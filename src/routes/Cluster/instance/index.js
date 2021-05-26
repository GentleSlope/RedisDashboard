import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { Card, Modal, Form, Popconfirm, Button, Table, BackTop, Input, Switch } from 'antd'
import qs from 'querystring'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'

const Item = Form.Item

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="创建一个新的单机实例"
                    okText="确定"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Item label="MasterId">
                            {getFieldDecorator('master_id')(<Input />)}
                        </Item>
                        <Item label="SlaveId">
                            {getFieldDecorator('instance_id', { rules: [{ required: true, message: '请输入需要插入的节点ID！' }], })(<Input />)}
                        </Item>
                    </Form>
                </Modal>
            );
        }
    },
);

class CollectionsPage extends React.Component {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.cluster_id = this.props.id
            console.log('Received values of form: ', values);
            this.insertNode(values)
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    insertNode = (params) => {
        axios.get('/api/v2/cluster/scale', {
            params: {
                ...params
            }
        }).then(res => {
            const { data } = res
            const { code, message } = data
            if (code === 200) {
                Modal.success({
                    title: 'success!',
                    content: '集群扩容成功'
                })
            } else {
                Modal.error({
                    title: message,
                    content: data.data
                })
            }
        })
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        return (
            <div>
                <p>
                    <Button type='primary' onClick={this.showModal}>集群扩容</Button>
                </p>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>

        );
    }
}

class ClusterInstance extends React.Component {
    state = {
        data: [],
    }

    componentDidMount() {
        this.getRemoteData()
    }

    columns = [
        {
            title: '实例编号',
            dataIndex: 'id',
            key: '1',
        },
        {
            title: '用户组ID',
            dataIndex: 'redis_user_id',
            key: '2',
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: '3',
        },
        {
            title: 'Port',
            dataIndex: 'port',
            key: '4',
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: '5',
        },
        {
            title: '是否docker容器',
            dataIndex: 'is_virtual',
            key: '6',
            render: (text, record) => {
                return <Switch disabled={true} checked={text === "true" ? true : false} />
            }
        },
        {
            title: '初始密码',
            dataIndex: 'password',
            key: '7',
        },
        {
            title: '节点状态',
            dataIndex: 'status',
            key: '8',
        },
        {
            title: '节点版本',
            dataIndex: 'version',
            key: '9',
        },
        {
            title: '操作',
            fixed: 'right',
            width: 200,
            key: 'operation',
            render: (text, record) =>
                this.state.data.length > 0 ?
                    <div>
                        <Popconfirm title="是否启动该实例？" onConfirm={() => this.onStart(record)}>
                            <a >启动</a>
                        </Popconfirm>
                        <Popconfirm title="是否停止该实例？" onConfirm={() => this.onStop(record)}>
                            <a> 停止</a>
                        </Popconfirm>
                        <Popconfirm title="是否删除该实例？" onConfirm={() => this.onDelete(record)}>
                            <a> 删除</a>
                        </Popconfirm>
                        <Link to={'/home/redis/monitor/' + record.ip + '/' + record.port + '/' + record.redis_user_id}><a> 监控</a></Link>
                        <Link to={'/home/redis/config/' + record.ip + '/' + record.port + '/' + record.id}><a> 配置</a></Link>
                    </div>
                    : null,
        },
    ]


    getRemoteData(params) {
        const { id } = this.props.match.params
        this.setState({
            loading: true
        })
        axios.get('/api/v2/cluster-instance/get', {
            params: {
                id
            }
        }).then(res => {
            const jsonObj = res.data.data
            this.setState({
                loading: false,
                data: jsonObj,
            })
        })
    }

    onStart = (record) => {
        axios.get('/api/v2/instance/start', {
            params: {
                ...record
            }
        }).then(res => {
            const { data } = res
            const { code, message } = data
            if (code === 200) {
                Modal.success({
                    title: 'success!',
                    content: '启动实例成功！'
                })
            } else {
                Modal.error({
                    title: message,
                    content: data.data
                })
            }
            this.getRemoteData()
        })
    }

    onStop = (record) => {
        axios.get('/api/v2/instance/stop', {
            params: {
                ...record
            }
        }).then(res => {
            const { data } = res
            const { code, message } = data
            if (code === 200) {
                Modal.success({
                    title: 'success!',
                    content: '停止实例成功！'
                })
            } else {
                Modal.error({
                    title: message,
                    content: data.data
                })
            }
            this.getRemoteData()
        })
    }

    onDelete = (record) => {
        axios.delete('/api/v2/cluster-node/delete', {
            params: {
                ...record
            }
        }).then(res => {
            const { data } = res
            const { code, message } = data
            if (code === 200) {
                Modal.success({
                    title: 'success!',
                    content: '删除实例成功！'
                })
            } else {
                Modal.error({
                    title: message,
                    content: data.data
                })
            }
            this.getRemoteData()
        })
    }
    handleAdd = () => {
        const { data, count } = this.state //本来想用data的length来代替count，但是删除行后，length会-1
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            data: [...data, newData],
            count: count + 1
        })
    }

    render() {
        const { id, name } = this.props.match.params
        const title = name
        return (
            <div>
                <CustomBreadcrumb arr={['Redis集群', '实例列表']} />
                <Card bordered={false} title={name + '实例列表'} style={{ marginBottom: 10, minHeight: 440 }} id='fixed'>
                    <p>
                        <CollectionsPage id={id} />
                    </p>
                    <Table dataSource={this.state.data} columns={this.columns}
                        scroll={{ x: 1300 }} />
                </Card>
                <BackTop visibilityHeight={200} style={{ right: 50 }} />
            </div>
        )
    }
}

export default ClusterInstance