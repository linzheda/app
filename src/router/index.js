import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import utils from '@/utils/utils'

Vue.use(Router)

let routes = [
    {
        path: '/',
        name: '/',
        redirect: '/login',
        component: () => import('@/views/user/login/login'),
        meta: {keepAlive: false, requireLogin: false}
    },

]
const routerContext = require.context('./static', true, /\.js$/)
routerContext.keys().forEach(route => {
    const routerModule = routerContext(route)
    /**
     * 兼容 import export 和 require module.export 两种规范
     */
    routes = routes.concat(routerModule.default || routerModule)
});


//获取滚动条的位置
function getScrollTop() {
    let scroll_top = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
    return scroll_top;
}

//滚动条
const scrollBehavior = function (to, from, savedPosition) {
    if (savedPosition) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(savedPosition);
            }, 300)
        });
    } else {
        if (from.meta.keepAlive) {
            from.meta.savedPosition = getScrollTop();
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({x: 0, y: to.meta.savedPosition || 0})
            }, 300)
        });
    }
}
const createRouter = () => new Router({
    base: window.__POWERED_BY_QIANKUN__ ? "/qiankunApp/app" : "/",
    // 运行在主应用中时，基础路由地址配置为 /vue
    mode: 'history', // require service support
    scrollBehavior: scrollBehavior,
    routes
});

const myRouter = createRouter();
const history = window.sessionStorage;
history.clear();
let historyCount = history.getItem('count') * 1 || 0;
history.setItem('/', 0);

myRouter.beforeEach((to, from, next) => {
    //说明需要拦截
    if (utils.isNotEmpty(to.meta['require'])) {
        intercept(to).then(res => {
            doKeep(to, from)
            if (res['isChange']) {
                next(res['to']);
            } else {
                next();
            }

        });
    } else {
        //前进刷新后退不刷新
        doKeep(to, from)
        next();
    }
});


async function intercept(to) {
    let result = {
        isChange: false,
        to: null
    };
    let checkArr =utils.isNotEmpty(to.params['require'])?to.params['require'].split(','):to.meta['require'].split(',');
    await checkArr.forEach(item => {
        if(!result.isChange){
            switch (item) {
                case 'login':
                    result = requireLogin();
                    break;
                default:
                    break;
            }
        }
    });
    return result
}

//判断是否需要拦截到登录页
function requireLogin() {
    let result = {
        isChange: false,
        to: null
    };
    if (store.getters.token == null || store.getters.id == null) {
        result.isChange = true;
        result.to = {name: '/'}
    }
    return result
}

function doKeep(to, from) {
    let toDirection = to.params.direction;
    if (toDirection) {
        store.commit('SET_DIRECTION', toDirection);
        if (toDirection == 'forward') {
            ++historyCount;
            history.setItem('count', historyCount);
            to.path !== '/' && history.setItem(to.path, historyCount);
            store.commit('ADD_KEEPARRAY', to.name);
            to.meta.keepAlive = true;
            from.meta.keepAlive = true;
        } else if (toDirection == 'back') {
            store.commit('DELETE_KEEPARRAY', from.name);
            from.meta.savedPosition = 0;
            from.meta.keepAlive = false;
            to.meta.keepAlive = true;
        } else if (toDirection == 'replace') {
            store.commit('DELETE_KEEPARRAY', from.name);
            from.meta.savedPosition = 0;
            from.meta.keepAlive = false;
            store.commit('ADD_KEEPARRAY', to.name);
            to.meta.keepAlive = true;
        }
    } else {
        const toIndex = store.getters.keepArray.findIndex(item => item == to.name);
        const fromIndex = store.getters.keepArray.findIndex(item => item == from.name);
        // 判断并记录跳转页面是否访问过，以此判断跳转过渡方式
        if (toIndex>=0) {
            if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
                store.commit('SET_DIRECTION', 'forward');
                store.commit('ADD_KEEPARRAY', to.name);
                to.meta.keepAlive = true;
                from.meta.keepAlive = true;
            } else {
                store.commit('SET_DIRECTION', 'back');
                store.commit('DELETE_KEEPARRAY', from.name);
                from.meta.savedPosition = 0;
                from.meta.keepAlive = false;
                to.meta.keepAlive = true;
            }
        } else {
            ++historyCount;
            history.setItem('count', historyCount);
            to.path !== '/' && history.setItem(to.path, historyCount);
            store.commit('SET_DIRECTION', 'forward');
            store.commit('ADD_KEEPARRAY', to.name);
            to.meta.keepAlive = true;
            from.meta.keepAlive = true;
        }
    }
}

export function resetRouter() {
    const newRouter = createRouter();
    store.commit('SET_KEEPARRAY', []);
    store.commit('SET_MENUS', []);
    myRouter.matcher = newRouter.matcher // reset router
}

export default myRouter
