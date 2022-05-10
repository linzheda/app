import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import http from './plugins/http';
import utils from './utils/utils';
import gis from './utils/gis';
import permissions from './utils/permissions';
import validate from './plugins/validate/plugin'
import filter from './plugins/filter';
import bus from './plugins/bus';
import goback from './directives/goback';
import pageHeader from './components/pageHeader/index';
import loading from './components/loading/loading';
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
//loading 组件
Vue.use(loading);
//请求
Vue.use(http);
//工具类
Vue.utils = utils;
Vue.prototype.$utils = Vue.utils;
//经纬度转换
Vue.gis = gis;
Vue.prototype.$gis = Vue.gis;
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
Vue.use(filter);
//表单校验插件
Vue.use(validate);
//滑动事件
let VueTouch = require('vue-touch');
Vue.use(VueTouch, {name: 'v-touch'});

//地图
//el-高德
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '157d82235f857a4cf6bd9d118a873804',
  plugin: [
    'AMap.Geocoder',
    'AMap.Autocomplete', // 输入提示插件
    'AMap.PlaceSearch', // POI搜索插件
    'AMap.Scale', // 右下角缩略图插件 比例尺
    'AMap.OverView', // 地图鹰眼插件
    'AMap.ToolBar', // 地图工具条
    'AMap.MapType', // 类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    'AMap.PolyEditor', // 编辑 折线多，边形
    'AMap.CircleEditor', // 圆形编辑器插件
    'AMap.Geolocation' // 定位控件，用来获取和展示用户主机所在的经纬度位置
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});


let instance = null;


function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

/**
 * 不存在主应用时可直接单独运行
 */
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("VueMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("app的mount");
  console.log(props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("app的unmount");
  instance.$destroy();
  instance = null;
}



/*new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');*/
