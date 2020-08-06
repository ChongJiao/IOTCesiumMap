import Vue from 'vue'
import Router from 'vue-router'
import CesiumMap from '../components/CesiumMap'
import TaskDetail from '../components/TaskDetail'
import UrlNotFound from '../components/UrlNotFound'
import NodesChart from '../components/NodesChart'
import ProcessShow from '../components/TaskFlow'
import DataCenter from '../components/DataCenter'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CesiumMap',
      component: CesiumMap
    },
    {
      path: '/CesiumMap',
      name: 'CesiumMap',
      component: CesiumMap
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
