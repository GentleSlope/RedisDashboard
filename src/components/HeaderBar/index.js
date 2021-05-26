import React from 'react'
import { Icon, Badge, Dropdown, Menu, Modal } from 'antd'
import screenfull from 'screenfull'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import { isAuthenticated } from '../../utils/Session'
import axios from 'axios'

//withRouter一定要写在前面，不然路由变化不会反映到props中去
@withRouter @inject('appStore') @observer
class HeaderBar extends React.Component {
  state = {
    icon: 'arrows-alt',
    count: 0,
    visible: false,
    avatar: require('./img/download.jpg')
  }

  componentDidMount() {
    this.getRemoteData()
    screenfull.onchange(() => {
      this.setState({
        icon: screenfull.isFullscreen ? 'shrink' : 'arrows-alt'
      })
    })
  }

  getRemoteData(params) {
    axios.get('/api/v2/alarm/all', {
      params: {
        ...params
      }
    }).then(res => {
      const jsonData = res.data.data
      this.setState({
        count: jsonData.length
      })
    }).finally(() => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    screenfull.off('change')
  }

  toggle = () => {
    this.props.onToggle()
  }
  screenfullToggle = () => {
    if (screenfull.enabled) {
      screenfull.toggle()
    }
  }
  logout = () => {
    this.props.appStore.toggleLogin(false)
    this.props.history.push(this.props.location.pathname)
  }

  render() {
    const { icon, count, visible, avatar } = this.state
    const { appStore, collapsed, location } = this.props
    const notLogin = (
      <div>
        <Link to={{ pathname: '/login', state: { from: location } }} style={{ color: 'rgba(0, 0, 0, 0.65)' }}>登录</Link>&nbsp;
        <img src={require('../../assets/img/defaultUser.jpg')} alt="" />
      </div>
    )
    const menu = (
      <Menu className='menu'>
        <Menu.ItemGroup title='用户中心' className='menu-group'>
          <Menu.Item>你好 - {isAuthenticated()}</Menu.Item>
          <Menu.Item><span onClick={this.logout}>退出登录</span></Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    )
    const login = (
      <Dropdown overlay={menu}>
        <img onClick={() => this.setState({ visible: true })} src={avatar} alt="" />
      </Dropdown>
    )
    return (
      <div id='headerbar'>
        <Icon
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          className='trigger'
          onClick={this.toggle} />
        <div style={{ lineHeight: '64px', float: 'right' }}>
          <ul className='header-ul'>
            <li><Icon type={icon} onClick={this.screenfullToggle} /></li>
            <li onClick={() => this.setState({ count: 0 })}>
              <Link to="/home/message/alarm">
                <Badge count={appStore.isLogin ? count : 0} overflowCount={99} style={{ marginRight: -17 }}>
                  <Icon type="notification" />
                </Badge>
              </Link>
            </li>
            <li>
              {appStore.isLogin ? login : notLogin}
            </li>
          </ul>
        </div>
        <Modal
          footer={null} closable={false}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.setState({ visible: false })}>
          <img src={avatar} alt="" width='100%' />
        </Modal>
      </div>
    )
  }
}

export default HeaderBar