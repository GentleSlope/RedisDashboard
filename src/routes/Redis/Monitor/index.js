import ReactJson from 'react-json-view'
import { Card, Collapse } from 'antd'
import React from 'react'
import axios from 'axios'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
const Panel = Collapse.Panel

class Monitor extends React.Component {
    state = {
        jsonData: []
    }
    componentDidMount() {
        const params = this.props.match.params
        this.getRemoteData(params)
    }

    getRemoteData(params) {
        axios.get('/api/v2/monitor/normal/get', {
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

    render() {
        console.log(this.state.jsonData);
        const { ip, port } = this.props.match.params
        const title = ip + ':' + port + ' 监控信息'
        const jsonData = [];
        this.state.jsonData.forEach((value, index) => {
            const temp = <Panel header={value.created_at}><ReactJson src={JSON.parse(value.info)} /></Panel>
            jsonData.push(temp)
        })
        return (
            <div>
                <CustomBreadcrumb arr={['Redis基础', '监控信息']} />
                <Card bordered={false} title={title} style={{ marginBottom: 10, minHeight: 440 }} >
                    <Collapse defaultActiveKey={['0']}>
                        {jsonData}
                    </Collapse>
                </Card>
            </div>
        )
    }
}

export default Monitor