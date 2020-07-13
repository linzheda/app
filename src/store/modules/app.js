const app = {
  state: {
    env:process.env.NODE_ENV,//环境 dev开发 production生产
    imei: '1234567',//设备号
    direction:'forward', // 页面切换方向
    keepArray:[],//缓存组件的数组集合
    canSwipeRight:true,//是否可以向右滑动返回 地图等页面禁用右划返回
  },
  mutations: {
    SET_IMEI: (state, imei) => {
      state.imei = imei
    },
    SET_EVN:(state, env)=>{//设置环境
      state.env=env
    },
    SET_CANSWIPERIGHT: (state, canSwipeRight) => {
      state.canSwipeRight = canSwipeRight
    },
    SET_DIRECTION:(state,direction)=>{
      state.direction = direction
    },
    ADD_KEEPARRAY:(state,item)=>{
      let set=new Set(state.keepArray);
      set.add(item);
      state.keepArray=Array.from(set);
    },
    DELETE_KEEPARRAY:(state,item)=>{
      let arry=state.keepArray;
      arry.splice(arry.indexOf(item),1);
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
  }
}

export default app
