import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';
import element from './element-ui/index'
import 'reset.less'
// import echarts from 'echarts'
var echarts = require('echarts')
Vue.use(element)
// Vue.use(echarts);
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
