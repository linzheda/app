export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/user/login/login'),
        meta: {keepAlive: false, requireLogin: false}
    }, {
        path: '/404',
        component: () => import('@/views/404'),
        meta: {title: '404', icon: '404'},
        hidden: true
    },
    {path: '*', redirect: '/404', meta: {title: '404', icon: '404'}, hidden: true},
]
