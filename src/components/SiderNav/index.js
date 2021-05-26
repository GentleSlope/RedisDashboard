import React from 'react'
import CustomMenu from "../CustomMenu/index";

const menus = [
  {
    title: '首页',
    icon: 'home',
    key: '/home'
  },
  {
    title: '分组用户',
    icon: 'user',
    key: '/home/base',
    subs: [
      { key: '/home/base/user', title: '用户列表', icon: '', },
    ]
  },
  {
    title: 'Redis基础',
    icon: 'database',
    key: '/home/redis',
    subs: [
      { key: '/home/redis/instance', title: '实例列表', icon: '', },
      { key: '/home/redis/instance-deploy', title: '单机部署', icon: '', },
      { key: '/home/redis/resource', title: '资源管理', icon: '', },
    ]
  },
  {
    title: 'Redis集群',
    icon: 'dot-chart',
    key: '/home/cluster',
    subs: [
      { key: '/home/cluster/display', title: '集群列表', icon: '', },
      { key: '/home/cluster/deploy', title: '集群部署', icon: '', },
    ]
  },
  {
    title: 'Redis任务',
    icon: 'bars',
    key: '/home/task',
    subs: [
      { key: '/home/task/queue', title: '任务列表', icon: '', },
    ]
  },
  {
    title: 'Redis告警信息',
    icon: 'message',
    key: '/home/message',
    subs: [
      { key: '/home/message/alarm', title: '告警信息', icon: '', },
    ]
  },


  {
    title: '关于',
    icon: 'info-circle-o',
    key: '/home/about'
  }
]


class SiderNav extends React.Component {
  render() {
    return (
      <div style={{ height: '100vh', overflowY: 'scroll' }}>
        <div style={styles.logo}></div>
        <CustomMenu menus={menus} />
      </div>
    )
  }
}

const styles = {
  logo: {
    height: '32px',
    background: 'rgba(255, 255, 255, .2)',
    margin: '16px'
  }
}

export default SiderNav