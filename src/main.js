// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import fastclick from 'fastclick'
import axios from 'axios'
import vueLazyload from "vue-lazyload"

import '@/common/stylus/index.styl'
Vue.config.productionTip = false;

 // 官方文档使用vueLazyLoad方法
Vue.use(vueLazyload , {
    loading : require('common/image/default.png')
});


// 使用axios
Vue.prototype.axios = axios;

fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // render : h=>h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
});
