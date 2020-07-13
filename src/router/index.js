import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

let routes = [
    {path: '*', name: '*', redirect: '/404'},
    {path: '/404', name: '404', component: () => import('@/views/404')},
    {
        path: '/',
        name: '/',
        redirect: '/login',
        component: () => import('@/views/user/login/login'),
        meta: {keepAlive: false}
    },
    {path: '/login', name: 'login', component: () => import('@/views/user/login/login'), meta: {keepAlive: false}},
    {
        path: '/home-tabs',
        name: 'home-tabs',
        component: () => import('@/views/home/home-tabs'),
        meta: {keepAlive: true},
        children: [
            {
                path: 'homepage',
                name: 'homepage',
                component: () => import('@/views/home/homepage'),
                meta: {keepAlive: true}
            },
            {path: 'about', name: 'about', component: () => import('@/views/home/about'), meta: {keepAlive: true}},
            {
                path: 'service',
                name: 'service',
                component: () => import('@/views/home/service'),
                meta: {keepAlive: true}
            },
        ]
    },

]
const routerContext = require.context('./', true, /\.js$/)
routerContext.keys().forEach(route => {
    // 如果是根目录的 index.js 、不处理
    if (route.startsWith('./index')) {
        return
    }
    const routerModule = routerContext(route)
    /**
     * 兼容 import export 和 require module.export 两种规范
     */
    routes = routes.concat(routerModule.default || routerModule)
});


//获取滚动条的位置
function getScrollTop() {
    let scroll_top = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scroll_top = document.documentElement.scrollTop;
    } else if (document.body) {
        scroll_top = document.body.scrollTop;
    }
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
                resolve({ x: 0, y: to.meta.savedPosition ||0})
            }, 300)
        });
    }
}
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: scrollBehavior,
    routes
});

const myRouter = createRouter();
const history = window.sessionStorage;
history.clear();
let historyCount = history.getItem('count') * 1 || 0;
history.setItem('/', 0);

myRouter.beforeEach((to, from, next) => {
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
            from.meta.savedPosition=0;
            from.meta.keepAlive = false;
            to.meta.keepAlive = true;
        }else if(toDirection == 'replace'){
            store.commit('ADD_KEEPARRAY', to.name);
            to.meta.keepAlive = true;
            from.meta.keepAlive = true;
        }
    } else {
        const toIndex = history.getItem(to.path);
        const fromIndex = history.getItem(from.path);
        // 判断并记录跳转页面是否访问过，以此判断跳转过渡方式
        if (toIndex) {
            if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
                store.commit('SET_DIRECTION', 'forward');
                store.commit('ADD_KEEPARRAY', to.name);
                to.meta.keepAlive = true;
                from.meta.keepAlive = true;
            } else {
                store.commit('SET_DIRECTION', 'back');
                store.commit('DELETE_KEEPARRAY', from.name);
                from.meta.savedPosition=0;
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
    next();
});

export function resetRouter() {
    myRouter.replace('/login');
}

export default myRouter
