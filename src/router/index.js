import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import imageProcessDetail from '../components/imageProcessDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'Main',
      name: 'imageProcessDetail',
      component: imageProcessDetail
    }
  ]
})
