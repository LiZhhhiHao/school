import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
// import store from '../store/index'
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
    props: true,
    children: [
      {
        path: '/mainpage/saveapplication',
        component: () => import('../views/Mainpage/stu/Saveapplication.vue'),
        
      },
      {
        path: '/mainpage/application',
        component: () => import('../views/Mainpage/stu/Application.vue')
      },
      {
        path: '/mainpage/audit',
        component: () => import('../views/Mainpage/master/Audit.vue')
      },
      {
        path: "/mainpage/findUserList",
        component: () => import('../views/Mainpage/admin/FindUserList.vue')
      },
      {
        path: "/mainpage/findallroles",
        component: () => import('../views/Mainpage/admin/Findallroles.vue')
      },
      {
        path: "/mainpage/statisticalForm",
        component: () => import('../views/Mainpage/master/StatisticalForm.vue')
      }
    ],
    // beforeEnter: (to, from, next) => {
    //   let loginData = store.state.token;
    //   console.log(loginData);
    //   if (loginData != '') {
    //     console.log(11111);
    //     next();
    //   } else {
    //     next({
    //       name: 'Login',
    //     });
    //   }
    // }
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
