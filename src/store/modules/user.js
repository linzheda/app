import {post} from '@/plugins/http';
import utils from "@/utils/utils";
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
        addRoutes({commit, state}, data) {
            return new Promise((resolve) => {
                let routes = data.filter(item => !state.menus.some(item2 => item.name === item2.name));
                routes=filterAsyncRouter(routes);
                commit('SET_MENUS', state.menus.concat(routes));
                let arr2 = [
                    {
                        path: '/404',
                        component: () => import('@/views/404'),
                        meta: {title: '404', icon: '404'},
                        hidden: true
                    },
                    {path: '*', redirect: '/404', meta: {title: '404', icon: '404'}, hidden: true},
                ];
                if (routes.length > 0) {
                    router.addRoutes(routes.concat(arr2));
                }
                resolve(routes)
            });
        }


    }
}

const routerContext =require.context('@/views', true, /\.vue$/,'lazy');

// 遍历后台传来的路由字符串，转换为组件对象
// eslint-disable-next-line no-unused-vars
function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter(route => {
        if (utils.isNotEmpty(route.component) && typeof route.component == 'string') {
            route.component = loadView(route.component)
        }
        //如果没有path
        if(!route.path){
            route['path']='/'+route.name;
        }
        //如果没有组件
        if(utils.isEmpty(route.component)){
            route.component =autoView(route.name);
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    });
    return accessedRouters
}
//自动装配路由
function autoView(name) {
    let result = '';
    // 找到name对应的key
    let targetKey = null;
    routerContext.keys().forEach(v=>{
        let target = '';
        target = v.slice(0,v.lastIndexOf('.vue'));
        target = target.slice(target.lastIndexOf('/') + 1);
        if(target === name){
            targetKey = v;
        }
    })
    // 使用目标key找到组件
    try{
        result = targetKey.substring(1, targetKey.length - 4);
    }
    catch (e) {
        // 没名称视为纯菜单，不进行警告
        if(name){
            console.error('路由菜单：\t' + name + '\t未找到对应组件,可能的原因是:组件还未提交或配置的组件名称不存在于项目中。');
        }
        return false;
    }
    return ()=>import('@/views' + result );
}
// 路由懒加载
function loadView(view) {
    return () => import('@/views/' + view );
}
//从后台获取路由
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
