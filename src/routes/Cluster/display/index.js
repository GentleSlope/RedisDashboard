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
      title: '集群编号',
      dataIndex: 'id',
      key: '1',
    },
    {
      title: '用户组ID',
      dataIndex: 'redis_user_id',
      key: '2',
    },
    {
      title: '集群名称',
      dataIndex: 'name',
      key: '3',
    },
    {
      title: '主节点数',
      dataIndex: 'master_num',
      key: '4',
    },
    {
      title: '从节点数',
      dataIndex: 'nodes_num',
      key: '5',
    },
    {
      title: '集群创建时间',
      dataIndex: 'created_at',
      key: '6',
    },
    {
      title: '集群更新时间',
      dataIndex: 'updated_at',
      key: '7',
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      key: 'operation',
      render: (text, record) =>
        this.state.data.length > 0 ?
          <div>
            <Link to={'/home/cluster/instance/' + record.id + '/' + record.name}><a> 实例</a></Link>
            <Popconfirm title="是否删除该集群？" onConfirm={() => this.onDelete(record)}>
              <a> 删除</a>
            </Popconfirm>
          </div>
          : null,
    },
  ]


  getRemoteData(params) {
    axios.get('/api/v2/cluster/all', {
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
    axios.delete('/api/v2/cluster/delete', {
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
        <CustomBreadcrumb arr={['Redis集群', '集群列表']} />
        <Card bordered={false} title='集群列表' style={{ marginBottom: 10, minHeight: 440 }} id='fixed'>
          <Button type="primary">
            <Link to="/home/cluster/deploy">部署新的集群</Link>
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