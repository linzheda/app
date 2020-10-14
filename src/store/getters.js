import utils from "@/utils/utils";
const getters = {
  env: state => state.app.env,
  appName: state => state.app.appName,
  direction: state => state.app.direction,
  keepArray: state => state.app.keepArray,
  imei: state => state.app.imei,
  canSwipeRight: state => state.app.canSwipeRight,
  id: state => {return myGet(state.user.id,'id')},
  name: state => {return myGet(state.user.name,'name')},
  token: state =>{return myGet(state.user.token,'token')},
  menus:state=>state.user.menus||null,

}
function myGet(obj,key) {
  return utils.isNotEmpty(obj)? obj : (utils.isNotEmpty(localStorage[key] )? localStorage[key] : null)
}
export default getters
