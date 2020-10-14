import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import http from './plugins/http';
import utils from './utils/utils';
import permissions from './utils/permissions';
import validate from './plugins/validate/plugin'
import filter from './plugins/filter';
import bus from './plugins/bus';
import goback from './directives/goback';
import pageHeader from './components/pageHeader/index';
import Vant from 'vant';
import 'vant/lib/index.css';
import 'vant/lib/icon/local.css';
import { Dialog } from 'vant';
import 'amfe-flexible/index.js';
import '@/styles/common.less';
import '@/icons' // icon

Vue.config.productionTip = false;

//ui框架
Vue.use(Vant);
//通用头部组件
Vue.use(pageHeader);
//请求
Vue.use(http);
//工具类
Vue.utils = utils;
Vue.prototype.$utils = Vue.utils;
//权限
Vue.permissions = permissions;
Vue.prototype.$permissions = Vue.permissions;
//事件总线
Vue.prototype.$bus = bus;
//消息提示
Vue.use(Dialog);
//指令
Vue.use(goback);
//过滤器
Object.keys(filter).forEach(key=>Vue.filter(key,filter[key]));
//表单校验插件
Vue.use(validate);
//滑动事件
let VueTouch = require('vue-touch');
Vue.use(VueTouch, {name: 'v-touch'});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
