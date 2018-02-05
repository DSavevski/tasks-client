import Vue from 'vue'
import Router from 'vue-router'
import Daily from '@/components/Daily'
import Weekly from '@/components/Weekly'
import Home from '@/components/Home'
import auth from '@/auth.js'

Vue.use(Router)


const routes= [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/daily',
      name: 'daily',
      component: Daily,
      meta: {requiresAuth: true}
    },
    {
      path: '/weekly',
      name: 'weekly',
      component: Weekly,
      meta: {requiresAuth: true}
    },
  ];


const router = new Router({routes, mode: 'history'})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    auth.check()
      .then(response =>{
        if (!auth.user.authenticated) {
          next({name: 'home'})
        }
        else {
          next();
        }
      })
  }
  else {
    next();
  }
});

export default router;


