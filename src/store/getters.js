const getters = {
  direction: state => state.app.direction,
  keepArray: state => state.app.keepArray,
  imei: state => state.app.imei,
  canSwipeRight: state => state.app.canSwipeRight,
  token: state => state.user.token,
  id: state => state.user.id,

}
export default getters
