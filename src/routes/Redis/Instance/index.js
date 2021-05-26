import React from 'react'
import { Card, Modal, Popconfirm, Button, Table, BackTop, Switch } from 'antd'
import axios from 'axios'
import { Link } from 'react-router-dom';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'

class Instance extends React.Component {
  state = {
    data: [],
  }

  componentDidMount() {
    this.getRemoteData()
  }

  columns7 = [
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
      title: '是否docker容器',
      dataIndex: 'is_virtual',
      key: '5',
      render: (text, record) => {
        return <Switch disabled={true} checked={text === "true" ? true : false} />
      }
    },
    {
      title: '是否集群部署',
      dataIndex: 'is_cluster',
      key: '6',
      render: (text, record) => {
        return <Switch disabled={true} checked={text === "yes" ? true : false} />
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
      width: 225,
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
            <Link to={'/home/redis/log/' + record.ip + '/' + record.port + '/' + record.redis_user_id}><a> 日志</a></Link>
          </div>
          : null,
    },
  ]


  getRemoteData(params) {
    this.setState({
      loading: true
    })
    axios.get('/api/v2/instance/all', {
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
    axios.delete('/api/v2/instance/delete', {
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

    return (
      <div>
        <CustomBreadcrumb arr={['Redis基础', '实例列表']} />
        <Card bordered={false} title='实例列表' style={{ marginBottom: 10, minHeight: 440 }} id='fixed'>
          <Button type="primary">
            <Link to="/home/redis/instance-deploy">部署单机实例</Link>
          </Button>
          <Table dataSource={this.state.data} columns={this.columns7}
            scroll={{ x: 1300 }} />
        </Card>
        <BackTop visibilityHeight={200} style={{ right: 50 }} />
      </div>
    )
  }
}

export default Instance