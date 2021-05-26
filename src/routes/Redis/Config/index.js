import { Card, Modal, Form, Icon, Button, Table, BackTop, Input, Upload } from 'antd'
import React from 'react'
import axios from 'axios'
import ReactJson from 'react-json-view'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'

const Item = Form.Item
const Dragger = Upload.Dragger
const TextArea = Input.TextArea

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        getTextInfo = (file) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (result) => {
                const config = result.target.result;
                this.props.form.setFieldsValue({
                    content: config,
                });
            }
        }
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
                    <Item label="Redis配置文件">
                        {getFieldDecorator('content', {
                            rules: [{
                                required: true,
                                message: '请上传文件!',
                            }],
                        })(<TextArea placeholder="{}" />)}
                    </Item>
                    <Dragger name="配置文件" action="" accept="text/plain" beforeUpload={this.getTextInfo} showUploadList={false}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">请将redis配置文件拖拽至此处</p>
                        <p className="ant-upload-hint">只支持单文本文件</p>
                    </Dragger>
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
            values.instance_id = Number(this.props.id)
            this.updateConfig(values)
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    updateConfig = (params) => {
        axios.post('/api/v2/config/update', params).then(res => {
            const { data } = res
            const { code, message } = data
            if (code === 200) {
                Modal.success({
                    title: 'success!',
                    content: '成功发布Redis更新任务',
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
                    <Button type='primary' onClick={this.showModal}>修改Redis配置</Button>
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


class RedisConfig extends React.Component {
    state = {
        jsonData: {}
    }
    componentDidMount() {
        this.process()
    }

    process() {
        const params = this.props.match.params
        this.getRemoteData(params)
    }

    getRemoteData(params) {
        axios.get('/api/v2/config/get', {
            params: {
                ...params
            }
        }).then(res => {
            console.log(res);
            const jsonData = JSON.parse(res.data.data.content)
            this.setState({
                jsonData
            })
        }).finally(() => {
            this.forceUpdate()
        })
    }

    render() {
        const { ip, id, port } = this.props.match.params
        const title = ip + ':' + port + ' 监控信息'
        return (
            <div>
                <CustomBreadcrumb arr={['Redis基础', '配置信息']} />
                <Card bordered={false} title={title} style={{ marginBottom: 10, minHeight: 440 }} >
                    <p><CollectionsPage id={id} process={this.process} /> </p>
                    <ReactJson src={this.state.jsonData} />
                </Card>
            </div>
        )
    }
}

export default RedisConfig