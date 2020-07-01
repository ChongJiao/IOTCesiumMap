import Vue from 'vue'
import Router from 'vue-router'
import UserXmpp from '../components/UserXmpp'
import imageProcessDetail from '../components/TaskDetail'
import UrlNotFound from '../components/UrlNotFound'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/UserXmpp',
      name: 'UserXmpp',
      component: UserXmpp
    },
    {
      path: '/TaskDetail',
      name: 'TaskDetail',
      component: imageProcessDetail
    },
    {
      path: '*',
      name: 'UrlNotFound',
      component: UrlNotFound
    }
  ]
})
