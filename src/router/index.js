import Vue from 'vue'
import Router from 'vue-router'
import UserXmpp from '../components/UserXmpp'
import UrlNotFound from '../components/UrlNotFound'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'UserXmpp',
      component: UserXmpp
    },
    {
      path: '/main',
      name: 'UserXmpp',
      component: UserXmpp
    },
    {
      path: '*',
      name: 'UrlNotFound',
      component: UrlNotFound
    }
  ]
})
