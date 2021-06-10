import bus from "@/plugins/bus";

const app = {
  state: {
    env:process.env.NODE_ENV,//环境 dev开发 production生产
    appName:process.env.VUE_APP_NAME,//项目名称
    ua:'',//项目是 android还是ios
    imei: '1234567',//设备号
    direction:'forward', // 页面切换方向
    keepArray:[],//缓存组件的数组集合
    canSwipeRight:true,//是否可以向右滑动返回 地图等页面禁用右划返回
  },
  mutations: {
    SET_EVN:(state, env)=>{//设置环境
      state.env=env
    },
    SET_APPNAME: (state, appName) => {
      state.appName = appName
    },
    SET_UA: (state, ua) => {
      state.ua = ua
    },
    SET_IMEI: (state, imei) => {
      state.imei = imei
    },
    SET_CANSWIPERIGHT: (state, canSwipeRight) => {
      state.canSwipeRight = canSwipeRight
    },
    SET_DIRECTION:(state,direction)=>{
      state.direction = direction
    },
    SET_KEEPARRAY:(state,keepArray)=>{
      state.keepArray=keepArray;
    },
    ADD_KEEPARRAY:(state,item)=>{
      let set=new Set(state.keepArray);
      set.add(item);
      state.keepArray=Array.from(set);
    },
    DELETE_KEEPARRAY:(state,item)=>{
      let arry=state.keepArray;
      arry.splice(arry.indexOf(item),1);
      bus.$off(item);
      state.keepArray=arry;
    },

  },
  actions: {
    updateDirection({ commit }, direction){//更新方向
      commit('SET_DIRECTION', direction)
    },
    updateCanSwipeRight({ commit },canSwipeRight){//设置是否开启右划返回
      commit('SET_CANSWIPERIGHT', canSwipeRight)
    },
    initEnv({commit}, env){//项目初始化是设置环境
      commit('SET_EVN',env);
    },
    initAppName({commit}, appName){//项目初始化是设置项目名称
      commit('SET_APPNAME',appName);
    },
    initUa({commit}){
      let ua = navigator.userAgent.toLocaleLowerCase();
      if(ua.includes('iphone')){
        ua = 'ios';
      }else if(ua.includes('android')){
        ua = 'android';
      }
      commit('SET_UA',ua);
    },
  }
}

export default app
