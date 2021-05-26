import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import PrivateRoute from '../PrivateRoute'

const Home = LoadableComponent(() => import('../../routes/Home/index'))  //参数一定要是函数，否则不会懒加载，只会代码拆分
// 分组用户管理
const RedisUser = LoadableComponent(() => import('../../routes/Redis/User/index'))
// Redis基础管理页面
const Instance = LoadableComponent(() => import('../../routes/Redis/Instance/index'))
const InstanceDeploy = LoadableComponent(() => import('../../routes/Redis/Deploy/index'))
const InstanceMonitor = LoadableComponent(() => import('../../routes/Redis/Monitor/index'))
// Redis 日志相关
const LogInfo = LoadableComponent(() => import('../../routes/Redis/Log/index'))
const ResourceInfo = LoadableComponent(() => import('../../routes/Redis/Resource/index'))
const RedisConfig = LoadableComponent(() => import('../../routes/Redis/Config/index'))

// Redis集群相关
const ClusterDisplay = LoadableComponent(() => import('../../routes/Cluster/display/index'))
const ClusterDeploy = LoadableComponent(() => import('../../routes/Cluster/deploy/index'))
const ClusterInstance = LoadableComponent(() => import('../../routes/Cluster/instance/index'))

// Redis 告警信息
const AlarmInfo = LoadableComponent(() => import('../../routes/Redis/Alarm/index'))

// Redis任务相关
const TaskQueue = LoadableComponent(() => import('../../routes/Task/Queue/index'))

//关于
const About = LoadableComponent(() => import('../../routes/About/index'))

@withRouter
class ContentMain extends React.Component {
  render() {
    return (
      <div style={{ padding: 16, position: 'relative' }}>
        <Switch>
          <PrivateRoute exact path='/home' component={Home} />

          <PrivateRoute exact path='/home/base/user' component={RedisUser} />

          <PrivateRoute exact path='/home/redis/instance' component={Instance} />
          <PrivateRoute exact path='/home/redis/instance-deploy' component={InstanceDeploy} />
          <PrivateRoute exact path='/home/redis/monitor/:ip/:port/:redis_user_id' component={InstanceMonitor} />
          <PrivateRoute exact path='/home/redis/log/:ip/:port/:redis_user_id' component={LogInfo} />
          <PrivateRoute exact path='/home/redis/resource' component={ResourceInfo} />
          <PrivateRoute exact path='/home/redis/config/:ip/:port/:id' component={RedisConfig} />
          <PrivateRoute exact path='/home/message/alarm' component={AlarmInfo} />

          <PrivateRoute exact path='/home/task/queue' component={TaskQueue} />

          <PrivateRoute exact path='/home/cluster/display' component={ClusterDisplay} />
          <PrivateRoute exact path='/home/cluster/deploy' component={ClusterDeploy} />
          <PrivateRoute exact path='/home/cluster/instance/:id/:name' component={ClusterInstance} />

          <PrivateRoute exact path='/home/about' component={About} />

          <Redirect exact from='/' to='/home' />
        </Switch>
      </div>
    )
  }
}

export default ContentMain