import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

Vue.config.productionTip = false;

/**
 * 导入路由守卫全局权限
 */
 import "@/plugins/permission";

import FilberTree from '@/plugins/filber.tree.js';
Vue.use(FilberTree);

new Vue({
  router,
  store,
  filber: FilberTree.filber,
  render: h => h(App)
}).$mount('#app')
