import React from 'react'
import axios from 'axios'
import qs from 'querystring'
import { Card, Alert, Divider, Select, Steps, Input, Button, Form, Icon, BackTop, Upload, Modal } from 'antd'
import { inject, observer } from 'mobx-react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'

const { Step } = Steps;
const { Option } = Select;
const Item = Form.Item
const Dragger = Upload.Dragger
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    offset: 5
  }
}


@inject('stepFormStore') @Form.create() @observer
class Step1 extends React.Component {
  nextStep = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.stepFormStore.setInfo(values)
        this.props.stepFormStore.setCurrent(1)
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form className='stepForm' hideRequiredMark>
          <Item {...formItemLayout} label="Redis版本">
            {getFieldDecorator('version', {
              initialValue: 'v3.2.12',
              rules: [{ required: true, message: '请选择redis的版本' }],
            })(
              <Select placeholder="v3.2.12">
                <Option value="v3.2.12">v3.2.12</Option>
              </Select>
            )}
          </Item>
          <Item {...formItemLayout} label="实例ID">
            {getFieldDecorator('id', {
              initialValue: 50,
              rules: [{ required: true, message: '请输入实例ID' }],
            })(<Input placeholder="请输入实例ID" />)}
          </Item>

          <Item {...formItemLayout} label="Redis用户ID">
            {getFieldDecorator('redis_user_id', {
              initialValue: 1,
              rules: [{ required: true, message: '请输入Redis用户ID' }],
            })(<Input placeholder="请输入Redis用户ID" />)}
          </Item>

          <Item {...formItemLayout} label="实例名称">
            {getFieldDecorator('name', {
              initialValue: '81.71.137.16:30000',
              rules: [{ required: true, message: 'IP:PORT' }],
            })(<Input placeholder="请输入实例名称" />)}
          </Item>

          <Item {...formItemLayout} label="实例IP">
            {getFieldDecorator('ip', {
              initialValue: '81.71.137.16',
              rules: [{ required: true, message: '请输入实例IP' }],
            })(<Input placeholder="请输入实例IP" />)}
          </Item>

          <Item {...formItemLayout} label="端口">
            {getFieldDecorator('port', {
              initialValue: 30000,
              rules: [{ required: true, message: '请输入端口' }],
            })(<Input placeholder="请输入端口" />)}
          </Item>

          <Item {...formItemLayout} label="是否使用Docker部署">
            {getFieldDecorator('is_virtual', {
              initialValue: 'true',
              rules: [{ required: true, message: '是否使用Docker部署' }],
            })(<Input placeholder="是否使用Docker部署" />)}
          </Item>

          <Item {...formItemLayout} label="是否为集群节点">
            {getFieldDecorator('is_cluster', {
              initialValue: 'yes',
              rules: [{ required: true, message: '是否为集群节点' }],
            })(<Input placeholder="是否为集群节点" />)}
          </Item>

          <Item {...formItemLayout} label="设置节点状态">
            {getFieldDecorator('status', {
              initialValue: 'running',
              rules: [{ required: true, message: '设置节点状态' }],
            })(<Input placeholder="设置节点状态" />)}
          </Item>

          <Item {...formItemLayout} label="认证码">
            {getFieldDecorator('uuid', {
              initialValue: '5oiR54ix5L2g6I+B6I+B',
              rules: [{ required: true, message: '请输入认证码' }],
            })(<Input placeholder="请输入认证码" />)}
          </Item>

          <Item {...formItemLayout} label="服务端地址">
            {getFieldDecorator('host', {
              initialValue: 'http://81.71.137.16:8000',
              rules: [{ required: true, message: '请输入服务端地址' }],
            })(<Input placeholder="请输入服务端地址" />)}
          </Item>

          <Item {...formItemLayout} label="实例密码" required={false}>
            {getFieldDecorator('password', {
              initialValue: '123456',
              rules: [
                {
                  required: true,
                  message: '实例密码',
                },
              ],
            })(<Input type="password" autoComplete="off" style={{ width: '80%' }} />)}
          </Item>

          <Item {...formItemLayout} label="自动化部署">
            {getFieldDecorator('is_auto_deploy', {
              initialValue: 'yes',
              rules: [{ required: true, message: '是否需要立即部署自动化部署' }],
            })(<Input placeholder="是否需要自动化部署" />)}
          </Item>

          <Item {...formItemLayout} label="Docker cpu配额">
            {getFieldDecorator('cpu', {
              initialValue: 100,
              rules: [{
                required: true, message: 'Docker cpu配额',
                pattern: /^(\d+)((?:\.\d+)?)$/,
                message: '请输入合法金额数字',
              }],
            })(<Input placeholder="Docker cpu配额" />)}
          </Item>

          <Item {...formItemLayout} label="Docker 内存配额">
            {getFieldDecorator('memory', {
              initialValue: 41943040,
              rules: [{
                required: true, message: '内存配额',
                pattern: /^(\d+)((?:\.\d+)?)$/,
                message: '请输入合法金额数字',
              }],
            })(<Input placeholder="内存配额" />)}
          </Item>

          <Item {...tailFormItemLayout}>
            <Button type='primary' onClick={this.nextStep}>下一步</Button>
          </Item>
        </Form>
        <Divider />
        <BackTop visibilityHeight={200} style={{ right: 50 }} />
      </div>
    )
  }
}

@inject('stepFormStore') @Form.create() @observer
class Step2 extends React.Component {
  state = {
    loading: false,
    config: ''
  }
  getTextInfo = (file) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (result) => {
      console.log('***********', result.target.result)
      const config = result.target.result;
      this.props.form.setFieldsValue({
        content: config,
      });
    }
  }

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        let { cpu, memory, id, redis_user_id, name, ip, port, is_virtual, is_cluster, password, status, version, uuid, host, ex_port, username,
          ex_password, is_auto_deploy } = this.props.stepFormStore.info
        let { content } = values
        const params = {
          cpu, id, redis_user_id, name, ip, port, is_virtual, is_cluster, password, status, version, uuid, host, ex_port, username,
          ex_password, is_auto_deploy, content, memory
        }
        console.log(params);
        const conf = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        axios.put('/api/v2/instance/insert/' + params.redis_user_id, qs.stringify(params), conf).then(res => {
          console.log('**res:', res);
          const { data } = res
          const { code, message } = data
          if (code === 200) {
            Modal.success({
              title: 'success!',
              content: '插入实例成功！'
            })
            this.props.stepFormStore.setCurrent(2)
          } else {
            Modal.error({
              title: message,
              content: data.data
            })
          }
          this.setState({
            loading: false
          })
        }).catch((err) => {
          console.log('**err:', err);
          this.setState({
            loading: false
          })
          Modal.error({
            title: '插入实例错误',
            content: err.message
          })
        })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form className='stepForm' id='step2'>
          <Alert closable showIcon message="请确认实例信息，一旦部署，不允许修改。" style={{ marginBottom: 24 }} />
          <Item {...formItemLayout} className='setFormText' label="实例地址">
            {this.props.stepFormStore.info.ip}:{this.props.stepFormStore.info.port}
          </Item>
          <Item {...formItemLayout} className='setFormText' label="CPU 配额">
            {this.props.stepFormStore.info.cpu}
          </Item>
          <Item {...formItemLayout} className='setFormText' label="内存配额">
            {this.props.stepFormStore.info.memory}
          </Item>
          <Item {...formItemLayout} className='setFormText' label="Redis版本">
            {this.props.stepFormStore.info.version}
          </Item>
          <Divider />
          <Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label="">
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
            <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>提交</Button>
            <Button onClick={() => this.props.stepFormStore.setCurrent(0)} style={{ marginLeft: 8 }}>上一步</Button>
          </Item>
        </Form>
      </div>
    )
  }
}

@inject('stepFormStore') @observer
class Step3 extends React.Component {
  render() {
    return (
      <div id='step3'>
        <div>
          <div className='icon-box'>
            <Icon type='check-circle' />
          </div>
          <div>
            <h3 className='success'>操作成功</h3>
          </div>
          <Form className='result'>
            <Item>
              <Item {...formItemLayout} className='setFormText' label="实例地址">
                {this.props.stepFormStore.info.ip}:{this.props.stepFormStore.info.port}
              </Item>
              <Item {...formItemLayout} className='setFormText' label="CPU 配额">
                {this.props.stepFormStore.info.cpu}
              </Item>
              <Item {...formItemLayout} className='setFormText' label="内存配额">
                {this.props.stepFormStore.info.memory}
              </Item>
              <Item {...formItemLayout} className='setFormText' label="Redis版本">
                {this.props.stepFormStore.info.version}
              </Item>
            </Item>
          </Form>
          <div>
            <Button type='primary' onClick={() => this.props.stepFormStore.setCurrent(0)}>再次插入</Button>
          </div>
        </div>
      </div>
    )
  }
}

@inject('stepFormStore') @observer
class InstanceDeploy extends React.Component {
  showStep = () => {
    switch (this.props.stepFormStore.current) {
      case 1: return <Step2 />
      case 2: return <Step3 />
      default: return <Step1 />
    }
  }
  render() {
    return (
      <div>
        <CustomBreadcrumb arr={['Redis基础', '单机部署']} />
        <TypingCard source='单机部署特点是很简单，但内容容量有限、处理能力有限、无法实现高可用' />
        <Card title='分步表单' bordered={false} style={{ minHeight: 600 }}>
          <Steps style={styles.steps} current={this.props.stepFormStore.current}>
            <Step title="基础配置填写" />
            <Step title="配置文件上传" />
            <Step title="完成" />
          </Steps>
          <div>{this.showStep()}</div>
        </Card>
      </div>
    )
  }
}

const styles = {
  steps: {
    maxWidth: 750,
    margin: '16px auto'
  },
  desc: {
    padding: '0 56px',
  }
}

export default InstanceDeploy