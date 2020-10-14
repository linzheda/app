import {post} from '@/plugins/http';
import router, {resetRouter} from '@/router'

const user = {
    state: {
        id: '',
        name: '',
        token: '',
        menus: [],
    },
    mutations: {
        SET_ID: (state, id) => {
            state.id = id
            localStorage.setItem('id', id)
        },
        SET_TOKEN: (state, token) => {
            state.token = token
            localStorage.setItem('token', token)
        },
        SET_NAME: (state, name) => {
            state.name = name
            localStorage.setItem('name', name)
        },
        SET_MENUS: (state, menus) => {
            state.menus = menus
            localStorage.setItem('menus', JSON.stringify(menus))
        }
    },
    actions: {
        //登录
        Login({commit}, userinfo) {
            return new Promise((resolve, reject) => {
                post('access/user/login', userinfo).then(data => {
                    commit('SET_ID', data.data.id);
                    commit('SET_NAME', data.data.name);
                    commit('SET_TOKEN', data.data.token);
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        updateToken({commit}, token) {//更新token
            commit('SET_TOKEN', token);
        },
        loginOut({commit, state}, type = 0) {
            return new Promise((resolve) => {
                if (type == 1) {//说明是自己主动登出
                    let param = {
                        id: state.id || localStorage.getItem("id"),
                    };
                    post('access/user/loginOut', param).then(res => {
                        console.log(res)
                        commit('SET_ID', '');
                        commit('SET_NAME', '');
                        commit('SET_TOKEN', '');
                        commit('SET_MENUS', '');
                        localStorage.clear();
                        resetRouter();
                        resolve();
                    });
                } else {
                    commit('SET_ID', '');
                    commit('SET_NAME', '');
                    commit('SET_TOKEN', '');
                    commit('SET_MENUS', '');
                    localStorage.clear();
                    resetRouter();
                    resolve();
                }

            });
        },
        //获取菜单
        getMenu({commit, state}) {
            return new Promise((resolve, reject) => {
                let param = {
                    userId: state.id || localStorage.getItem("id"),
                    isn: '0.-2',
                    pid: -2
                };
                post('access/resources/getResourcesByUserId', param).then(data => {
                    let arr2 = [
                        {
                            path: '/404',
                            component: () => import('@/views/404'),
                            meta: {title: '404', icon: '404'},
                            hidden: true
                        },
                        {path: '*', redirect: '/404', meta: {title: '404', icon: '404'}, hidden: true},
                    ];
                    let result = filterAsyncRouter(data.data);
                    commit('SET_MENUS', result);
                    router.addRoutes(result);
                    router.addRoutes(arr2);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
        getAppMenus({state}, pid = -2) {
            let userId = state.id || localStorage.getItem("id");
            return new Promise((resolve, reject) => {
                getAccessRoute(userId, pid).then(res => {
                    let result = filterAsyncRouter(res.data);
                    resolve(result)
                }).catch(error => {
                    reject(error);
                });
            });
        },
        addRoutes({commit,state}, data) {
            return new Promise((resolve) => {
                let routes= data.filter(item=>!state.menus.some(item2=>item.name===item2.name));
                commit('SET_MENUS',state.menus.concat(routes));
                let arr2 = [
                    {
                        path: '/404',
                        component: () => import('@/views/404'),
                        meta: {title: '404', icon: '404'},
                        hidden: true
                    },
                    {path: '*', redirect: '/404', meta: {title: '404', icon: '404'}, hidden: true},
                ];
                if(routes.length>0){
                    router.addRoutes(routes.concat(arr2));
                }
                resolve(data)
            });
        }


    }
}
// 遍历后台传来的路由字符串，转换为组件对象
// eslint-disable-next-line no-unused-vars
function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.component) {
            route.component = loadView(route.component)
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    });
    return accessedRouters
}

function loadView(view) {
    // 路由懒加载
    return () => import('@/views/' + view );
}
function getAccessRoute(userId, pid) {
    return new Promise((resolve) => {
        let param = {
            userId: userId,
            isn: '0.-2',
            pid: pid
        };
        post('access/resources/getAccessRoute', param).then(res => {
            resolve(res);
        });
    });
}

export default user
