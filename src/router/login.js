export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/user/login/login'),
        meta: {keepAlive: false, requireLogin: false,title:'登录'}
    }, {
        path: '/forgetPassword',
        name: 'forgetPassword',
        component: () => import('@/views/user/forgetPassword/forgetPassword'),
        meta: {keepAlive: false, requireLogin: false,title:'忘记密码'}
    },{
        path: '/register',
        name: 'register',
        component: () => import('@/views/user/register/register'),
        meta: {keepAlive: false, requireLogin: false,title:'注册用户'}
    }, {
        path: '/404',
        component: () => import('@/views/404'),
        meta: {title: '404',  icon: '404'},
        hidden: true
    },
    {path: '*', redirect: '/404', meta: {title: '404', icon: '404'}, hidden: true},
]
