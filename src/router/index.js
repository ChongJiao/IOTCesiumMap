import Vue from 'vue'
import Router from 'vue-router'
import CesiumMap from '../components/CesiumMap'
import UrlNotFound from '../components/UrlNotFound'
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
      path: '/DataCenter',
      name: 'DataCenter',
      component: DataCenter
    },
    {
      path: '*',
      name: 'UrlNotFound',
      component: UrlNotFound
    }
  ]
})
