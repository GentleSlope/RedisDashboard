import React from 'react'
import { Card, Modal, DatePicker, Popconfirm, Table, BackTop } from 'antd'
import axios from 'axios'
import moment from 'moment';
import qs from 'querystring'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
const dateFormat = 'YYYY/MM/DD';
const { RangePicker } = DatePicker;

class Resource extends React.Component {
    state = {
        beginTime: 1609430400,
        endTime: 1622476800,
        data: [],
        count: 2,
    }

    componentDidMount() {
        this.process()
    }

    process() {
        const { beginTime, endTime } = this.state
        const params = { "redis_user_id": 1, "begin": beginTime, "end": endTime }
        this.getRemoteData(params)
    }

    columns = [
        {
            title: '任务ID',
            dataIndex: 'id',
            key: '1',
        },
        {
            title: '实例ID',
            dataIndex: 'replica_id',
            key: '2',
        },
        {
            title: '任务类型',
            dataIndex: 'task_type',
            key: '3',
        },
        {
            title: '任务状态',
            dataIndex: 'task_status',
            key: '4',
        },
        {
            title: '执行结果',
            dataIndex: 'execution_result',
            key: '5',
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: '6',
        },
        {
            title: '更新时间',
            dataIndex: 'updated_at',
            key: 'other-7',
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


    getRemoteData = (params) => {
        const conf = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post('/api/v2/tasks/between', qs.stringify(params), conf).then(res => {
            const jsonData = res.data.data
            console.log(jsonData);
            this.setState({
                data: jsonData,
            })
        })
    }

    onDelete = (record) => {
        axios.delete('/api/v2//tasks/delete', {
            params: {
                ...record
            }
        }).then(res => {
            const { data } = res
            const { code, message } = data
            if (code === 200) {
                Modal.success({
                    title: 'success!',
                    content: '删除任务成功！'
                })
            } else {
                Modal.error({
                    title: message,
                    content: data.data
                })
            }
            const pm = { "redis_user_id": 1, "begin": this.state.beginTime, "end": this.state.endTime }
            this.getRemoteData(pm)
        })
    }

    onChange = (params) => {
        console.log(params[0]._d.getTime() / 1000);
        console.log(params[1]._d.getTime() / 1000);
        this.setState({
            beginTime: params[0]._d.getTime() / 1000,
            endTime: params[1]._d.getTime() / 1000,
        })
        const pm = { "redis_user_id": 1, "begin": params[0]._d.getTime() / 1000, "end": params[1]._d.getTime() / 1000 }
        this.getRemoteData(pm)
    }

    render() {

        return (
            <div>
                <CustomBreadcrumb arr={['Redis任务', '任务列表']} />
                <Card bordered={false} title='任务管理列表' style={{ marginBottom: 20, minHeight: 440 }} id='fixed'>
                    <RangePicker defaultValue={[moment('2021/01/01', dateFormat), moment('2021/05/31', dateFormat)]}
                        onChange={this.onChange} />
                    <Table dataSource={this.state.data} columns={this.columns} scroll={{ x: 1300 }} />
                </Card>
                <BackTop visibilityHeight={200} style={{ right: 50 }} />
            </div>
        )
    }
}

export default Resource