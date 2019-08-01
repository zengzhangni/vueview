import Vue from 'vue'
import Router from 'vue-router'



Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('./views/index/Index.vue')
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('./views/index/Index.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('./views/user/User.vue')
    },
    {
      path: '/member/findByPage',
      name: 'findByPage',
      component: () => import('./views/member/MemberList.vue')
    }
  ]
})
