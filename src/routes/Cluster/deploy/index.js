import React from 'react'
import axios from 'axios'
import { Card, Alert, Divider, Select, Steps, Input, Button, Icon, BackTop, Upload, Modal, Form, Radio, InputNumber } from 'antd'
import { inject, observer } from 'mobx-react'
import { AddableRowTable } from 'hermes-react';
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
  state = {
    loading: false,
    config: ''
  }

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
              <Select disabled={true} placeholder="v3.2.12">
                <Option value="v3.2.12">v3.2.12</Option>
              </Select>
            )}
          </Item>
          <Item {...formItemLayout} label="集群名称">
            {getFieldDecorator('cluster_name', {
              initialValue: 'willemjiangCluster',
              rules: [{ required: true, message: '请输入集群名称' }],
            })(<Input placeholder="请输入集群名称" />)}
          </Item>

          <Item {...formItemLayout} label="Redis用户ID">
            {getFieldDecorator('redis_user_id', {
              initialValue: 622,
              rules: [{ required: true, message: '请输入Redis用户ID' }],
            })(<InputNumber placeholder="请输入Redis用户ID" />)}
          </Item>

          <Item {...formItemLayout} label="Redis用户名">
            {getFieldDecorator('redis_user_name', {
              initialValue: 'willemjiangCluster',
              rules: [{ required: true, message: '请输入Redis用户名' }],
            })(<Input placeholder="请输入Redis用户ID" />)}
          </Item>

          <Item {...formItemLayout} label="分槽模式">
            {getFieldDecorator('slot_mode', {
              initialValue: 'average',
              rules: [{ required: true, message: '分槽模式' }],
            })(<Select disabled={true} placeholder="average">
              <Option value="average">均分</Option>
            </Select>)}
          </Item>

          <Item {...formItemLayout} label="是否需要重启">
            {getFieldDecorator('restart', {
              initialValue: false,
              rules: [{ required: true, message: '是否需要重启' }],
            })(
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )}
          </Item>

          <Item {...formItemLayout} label="集群密码" required={false}>
            {getFieldDecorator('password', {
              initialValue: '123456',
              rules: [
                {
                  required: true,
                  message: '需要设置统一的集群密码',
                },
              ],
            })(<Input type="password" autoComplete="off" style={{ width: '80%' }} />)}
          </Item>
          <div>
            <Item {...formItemLayout} label="Redis配置文件">
              {getFieldDecorator('content', {
                rules: [{
                  required: false,
                  message: '请上传文件!',
                }],
              })(<TextArea placeholder="{}" />)}
            </Item>
            <Dragger {...formItemLayout} name="配置文件" action="" accept="text/plain" beforeUpload={this.getTextInfo} showUploadList={false}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">请将redis配置文件拖拽至此处</p>
              <p className="ant-upload-hint">只支持单文本文件</p>
            </Dragger>
          </div>
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

const options = [{
  title: '节点ID',
  name: 'id',
  width: 3,
  formFieldProps: {
    rules: [{
      required: true,
      message: '此处必填',
    }, {
      pattern: /^-?[0-9]*(\.[0-9]*)?$/,
      message: '请输入纯数字',
    }],
  },
  render: (_, formProps) => {
    return (<Item >
      <InputNumber
        {...formProps}
        style={{ width: '90%' }}
        placeholder="请输入节点ID" />
    </Item>);
  },
},
{
  title: '节点IP',
  name: 'ip',
  width: 3,
  formFieldProps: {
    rules: [{
      required: true,
      message: '此处必填',
    }],
  },
  render: (_, formProps) => {
    return (<Item>
      <Input {...formProps}
        style={{ width: '90%' }}
        placeholder="请输入节点IP" />
    </Item>);
  },
},
{
  title: '节点Port',
  name: 'port',
  width: 3,
  formFieldProps: {
    rules: [{
      required: true,
      message: '此处必填',
    }, {
      pattern: /^-?[0-9]*(\.[0-9]*)?$/,
      message: '请输入纯数字',
    }],
  },
  render: (_, formProps) => {
    return (<Item>
      <InputNumber  {...formProps}
        min={0}
        max={65535}
        style={{ width: '90%' }}
        placeholder="请输入节点Port" />
    </Item>);
  },
},
{
  title: '主节点IP',
  name: 'master_ip',
  width: 3,
  formFieldProps: {
    rules: [{
      required: true,
      message: '此处必填',
    }],
  },
  render: (_, formProps) => {
    return (<Item>
      <Input {...formProps}
        style={{ width: '90%' }}
        placeholder="请输入主节点IP" />
    </Item>);
  },
},
{
  title: '主节点Port',
  name: 'master_port',
  width: 3,
  formFieldProps: {
    rules: [{
      required: true,
      message: '此处必填',
    }, {
      pattern: /^-?[0-9]*(\.[0-9]*)?$/,
      message: '请输入纯数字',
    }]
  },
  render: (_, formProps) => {
    return (<Item>
      <InputNumber {...formProps}
        style={{ width: '90%' }}
        placeholder="请输入主节点Port" />
    </Item>);
  },
}, {
  title: '主从关系',
  name: 'role',
  width: 3,
  render: (_, formProps) => {
    return (<Select {...formProps}
      placeholder="请选择"
      size="default"
      style={{ width: '90%' }}
      allowClear>
      <Option key="1" value='master'>主节点</Option>
      <Option key="2" value='slave' >从节点</Option>
    </Select>)
  },
}];

@inject('stepFormStore') @Form.create() @observer
class Step2 extends React.Component {
  state = {
    loading: false,
    config: '',
  }

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
        console.log(values.data);
        console.log(this.props.stepFormStore.info);
        const { slot_mode, content, password, redis_user_id, redis_user_name, restart, cluster_name, version } = this.props.stepFormStore.info
        const params = { password, redis_user_id, redis_user_name, cluster_name, slot_mode }
        params.instances = []
        params.instance_config_extension = {}
        params.instance_config_extension.config = {}
        params.instance_config_extension.config.content = window.btoa(content)
        params.instance_config_extension.restart = restart
        console.log(values.data.length);
        for (let i = 0; i < values.data.length; i++) {
          console.log(i)
          values.data[i].version = version
          params.instances.push(values.data[i])
        }
        console.log(params);
        const conf = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        axios.post('/api/v2/cluster/create', JSON.stringify(params), conf).then(res => {
          const { data } = res
          const { code, message } = data
          if (code === 200) {
            Modal.success({
              title: 'success!',
              content: '集群创建成功！'
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
          this.setState({
            loading: false
          })
          Modal.error({
            title: '集群创建错误',
            content: err.message
          })
        })
      }
    })
  }
  render() {
    const { getFieldProps } = this.props.form
    return (
      <div>
        <Form className='stepForm' id='step2'>
          <Alert closable showIcon message="请为集群添加节点。" style={{ marginBottom: 24 }} />
          <Item>
            <AddableRowTable options={options}
              copyable
              draggable
              form={this.props.form}
              {...getFieldProps('data', {
                initialValue: [{
                  id: 10001,
                  ip: '81.71.137.16',
                  port: 30001,
                  role: 'master',
                  master_ip: '81.71.137.16',
                  master_port: 30001
                },
                {
                  id: 10002,
                  ip: '81.71.137.16',
                  port: 30002,
                  role: 'master',
                  master_ip: '81.71.137.16',
                  master_port: 30001
                },
                {
                  id: 10003,
                  ip: '81.71.137.16',
                  port: 30003,
                  role: 'master',
                  master_ip: '81.71.137.16',
                  master_port: 30001,
                },
                {
                  id: 10004,
                  ip: '81.71.137.16',
                  port: 30004,
                  role: 'slave',
                  master_ip: '81.71.137.16',
                  master_port: 30001,
                },
                {
                  id: 10005,
                  ip: '81.71.137.16',
                  port: 30005,
                  role: 'slave',
                  master_ip: '81.71.137.16',
                  master_port: 30001
                },
                {
                  id: 10006,
                  ip: '81.71.137.16',
                  port: 30006,
                  role: 'slave',
                  master_ip: '81.71.137.16',
                  master_port: 30001
                }
                ],
                onChange: (v) => {
                  console.log(v);
                },
              })} />
          </Item>
        </Form>
        <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>提交</Button>
        <Button onClick={() => this.props.stepFormStore.setCurrent(0)} style={{ marginLeft: 8 }}>上一步</Button>
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
        <CustomBreadcrumb arr={['Redis集群', '集群部署']} />
        <TypingCard source='Redis 集群是一个可以在多个 Redis 节点之间进行数据共享的设施。
        集群通过分区partition来提供一定程度的可用性availability： 即使集群中有一部分节点失效或者无法进行通讯， 集群也可以继续处理命令请求。' />
        <Card title='分步表单' bordered={false} style={{ minHeight: 600 }}>
          <Steps style={styles.steps} current={this.props.stepFormStore.current}>
            <Step title="公共属性配置" />
            <Step title="节点信息配置" />
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