import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import http from './plugins/http';
import filter from './plugins/filter';
import bus from './plugins/bus';
import goback from './directives/goback';
import Vant from 'vant';
import 'vant/lib/index.css';
import { Dialog } from 'vant';
import 'amfe-flexible/index.js';
import animated from 'animate.css';
import validate from './plugins/validate/plugin'
import '@/icons' // icon
let VueTouch = require('vue-touch');



Vue.config.productionTip = false;

//ui框架
Vue.use(Vant);
//动画样式
Vue.use(animated);
//请求
Vue.use(http);
//事件总线
Vue.prototype.$bus = bus;

//消息提示
Vue.use(Dialog);
//指令
Vue.use(goback);
//vue的前进后退
//过滤器
Object.keys(filter).forEach(key=>Vue.filter(key,filter[key]));
//表单校验插件
Vue.use(validate);
//滑动事件
Vue.use(VueTouch, {name: 'v-touch'});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
