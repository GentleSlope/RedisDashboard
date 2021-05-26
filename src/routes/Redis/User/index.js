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
                        <Item label="用户分组名">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入用户分组名！' }],
                            })(<Input />)}
                        </Item>
                        <Item label="分组简介">
                            {getFieldDecorator('details', { rules: [{ required: true, message: '请输入用户分组简介！' }], })(<Input type="textarea" />)}
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
                'Content-Type': 'application/json'
            }
        }
        axios.post('/api/v2/user/insert', params, conf).then(res => {
            const { data } = res
            const { code, message } = data
            if (code === 200) {
                Modal.success({
                    title: 'success!',
                    content: '创建分组成功！'
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
                    <Button type='primary' onClick={this.showModal}>新增分组用户</Button>
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


class RedisUser extends React.Component {
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
            title: 'ID',
            dataIndex: 'id',
            key: '1',
            width: 100,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: '2',
        },
        {
            title: '指纹ID',
            dataIndex: 'uuid',
            key: '3',
        },
        {
            title: '分组描述',
            dataIndex: 'details',
            key: '4',
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: '5',
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
        axios.get('/api/v2/user/get', {
            params: {
                ...params
            }
        }).then(res => {
            const jsonObj = res.data.data
            this.setState({
                data: jsonObj,
            })
        })
    }

    onDelete = (record) => {
        axios.delete('/api/v2/user/delete', {
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
                <CustomBreadcrumb arr={['分组用户', '用户列表']} />
                <Card bordered={false} title='用户列表' style={{ marginBottom: 10, minHeight: 440 }} id='fixed'>
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

export default RedisUser