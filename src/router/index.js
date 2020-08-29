import Vue from 'vue'
import Router from 'vue-router'
import CesiumMap from '../components/CesiumMap'
import TaskDetail from '../components/TaskDetail'
import UrlNotFound from '../components/UrlNotFound'
import NodesChart from '../components/NodesChart'
import ProcessShow from '../components/TaskFlow'
import DataCenter from '../components/DataCenter'
// import LoginWidget from '../components/LoginWidget'
import Login from '../components/Login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/CesiumMap',
      name: 'CesiumMap',
      component: CesiumMap
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/ProcessShow',
      name: 'ProcessShow',
      component: ProcessShow
    },
    {
      path: '/DataCenter',
      name: 'DataCenter',
      component: DataCenter
    },
    {
      path: '/TaskDetail',
      name: 'TaskDetail',
      component: TaskDetail
    },
    {
      path: '/Charts',
      name: 'Charts',
      component: NodesChart
    },
    {
      path: '*',
      name: 'UrlNotFound',
      component: UrlNotFound
    }
  ]
})
