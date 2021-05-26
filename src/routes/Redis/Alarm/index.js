import { Card, Modal, Col, Row, Collapse, BackTop, Button } from 'antd'
import React from 'react'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
const Panel = Collapse.Panel

class AlarmInfo extends React.Component {
    state = {
        jsonData: []
    }
    componentDidMount() {
        this.getRemoteData()
    }

    getRemoteData(params) {
        axios.get('/api/v2/alarm/all', {
            params: {
                ...params
            }
        }).then(res => {
            console.log(res);
            const jsonData = res.data.data
            this.setState({
                jsonData
            })
        }).finally(() => {
            this.forceUpdate()
        })
    }

    deleteAll = () => {
        axios.delete('/api/v2/alarm/delete', {}).then(res => {
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
        console.log(this.state.jsonData);
        const title = '告警信息'
        const jsonData = [];
        this.state.jsonData.forEach((value, index) => {
            const temp = <Panel header={value.ip + ":" + value.port + " " + value.created_at}>{JSON.stringify(value)}</Panel>
            jsonData.push(temp)
        })
        return (
            <div>
                <CustomBreadcrumb arr={['Redis告警信息', '告警信息']} />
                <Card bordered={false} title={title} style={{ marginBottom: 10, minHeight: 440 }} >
                    <p>
                        <Button type='danger' onClick={this.deleteAll}>删除所有告警</Button>
                    </p>
                    <Collapse defaultActiveKey={['0']}>
                        {jsonData}
                    </Collapse>
                </Card>
            </div>
        )
    }
}

export default AlarmInfo