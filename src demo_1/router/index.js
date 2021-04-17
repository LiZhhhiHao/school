import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    props: true,
  },
  {
    path: '/mainpage',
    name: 'Mainpage',
    component: () => import('../views/Mainpage.vue'),
    props:true,
    children: [
      {
        path: '/mainpage/in',
        component: ()=>import('../views/Mainpage/In.vue')
      },
      {
        path: '/mainpage/user',
        component: () => import('../views/Mainpage/User.vue')
      },
      {
        path: "/mainpage/findUserList",
        component: () => import('../views/Mainpage/FindUserList.vue')
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
      component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
