import Vue from 'vue'
import Router from 'vue-router'
import Daily from '@/components/Daily'
import Weekly from '@/components/Weekly'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'test',
      component: Test
    },
    {
      path: '/daily',
      name: 'daily',
      component: Daily
    },
    {
      path: '/weekly',
      name: 'weekly',
      component: Weekly
    }
  ]
})
