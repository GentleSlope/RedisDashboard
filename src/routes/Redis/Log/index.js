import ReactJson from 'react-json-view'
import { Card, Collapse, Modal, Button } from 'antd'
import React from 'react'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
const Panel = Collapse.Panel

class LogInfo extends React.Component {
    state = {
        jsonData: []
    }
    componentDidMount() {
        const params = this.props.match.params
        this.getRemoteData(params)
    }

    getRemoteData(params) {
        axios.get('/api/v2/log/all', {
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
        const params = this.props.match.params
        axios.delete('/api/v2/log/delete', {
            params: {
                ...params
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
        console.log(this.state.jsonData);
        const { ip, port } = this.props.match.params
        const title = ip + ':' + port + ' 实例日志'
        const jsonData = [];
        this.state.jsonData.forEach((value, index) => {
            const temp = <Panel header={value.created_at}><ReactJson src={value} /></Panel>
            jsonData.push(temp)
        })
        return (
            <div>
                <CustomBreadcrumb arr={['Redis基础', '实例日志']} />
                <Card bordered={false} title={title} style={{ marginBottom: 10, minHeight: 440 }} >
                    <p>
                        <Button type='danger' onClick={this.deleteAll}>删除所有日志</Button>
                    </p>
                    <Collapse defaultActiveKey={['0']}>
                        {jsonData}
                    </Collapse>
                </Card>
            </div>
        )
    }
}

export default LogInfo