import Vue from 'vue'
import Router from 'vue-router'
import CesiumMap from '@/components/CesiumMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CesiumMap',
      component: CesiumMap
    }
  ]
})
