import React from 'react'
import { Card, Modal, Form, Popconfirm, Button, Table, BackTop, Input } from 'antd'
import axios from 'axios'
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
                        <Item label="母机IP">
                            {getFieldDecorator('host_ip', {
                                rules: [{ required: true, message: '请输入母机IP地址！' }],
                            })(<Input />)}
                        </Item>
                        <Item label="资源简介">
                            {getFieldDecorator('host_group_identity', { rules: [{ required: true, message: '请输入母机IP地址！' }], })(<Input type="textarea" />)}
                        </Item>
                        <Item label="母机空间">
                            {getFieldDecorator('total_host_memory', { rules: [{ required: true, message: '请输入母机总空间！' }], })(<Input type="textarea" />)}
                        </Item>
                        <Item label="告警阈值">
                            {getFieldDecorator('limited_memory', { rules: [{ required: true, message: '请输入内存告警阈值！' }], })(<Input type="textarea" />)}
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

            console.log('Received values of form: ', values);
            this.insertResource(values)
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    insertResource = (params) => {
        const conf = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post('/api/v2/resource/insert', qs.stringify(params), conf).then(res => {
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
        })
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        return (
            <div>
                <p>
                    <Button type='primary' onClick={this.showModal}>新增母机</Button>
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


class Resource extends React.Component {
    state = {
        pagination: {
            pageSize: 8
        },
        data: [],
        count: 2,
    }

    componentDidMount() {
        this.getRemoteData()
    }

    columns = [
        {
            title: '母机IP',
            dataIndex: 'host_ip',
            key: '1',
        },
        {
            title: '分类描述',
            dataIndex: 'host_group_identity',
            key: '2',
        },
        {
            title: '母机器总容量',
            dataIndex: 'total_host_memory',
            key: '3',
        },
        {
            title: '已使用空间',
            dataIndex: 'used_memory',
            key: '4',
        },
        {
            title: '已分配空间',
            dataIndex: 'allocated_memory',
            key: '5',
        },
        {
            title: '告警阈值',
            dataIndex: 'limited_memory',
            key: '6',
        },
        {
            title: '操作',
            fixed: 'right',
            width: 125,
            render: (text, record) =>
                this.state.data.length > 0 ?
                    <div>
                        <Popconfirm title="是否删除该实例？" onConfirm={() => this.onDelete(record)}>
                            <a> 删除</a>
                        </Popconfirm>
                    </div>
                    : null,
        },
    ]


    getRemoteData(params) {
        this.setState({
            loading: true
        })
        axios.get('/api/v2/resource/all', {
            params: {
                ...params
            }
        }).then(res => {
            const jsonObj = JSON.parse(res.data.data)
            this.setState({
                loading: false,
                data: jsonObj,
            })
        })
    }

    onDelete = (record) => {
        axios.delete('/api/v2/resource/delete', {
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

    render() {

        return (
            <div>
                <CustomBreadcrumb arr={['Redis基础', '资源管理']} />
                <Card bordered={false} title='资源管理列表' style={{ marginBottom: 10, minHeight: 440 }} id='fixed'>
                    <p>
                        <CollectionsPage />
                    </p>
                    <Table dataSource={this.state.data} columns={this.columns} scroll={{ x: 1300 }} />
                </Card>
                <BackTop visibilityHeight={200} style={{ right: 50 }} />
            </div>
        )
    }
}

export default Resource