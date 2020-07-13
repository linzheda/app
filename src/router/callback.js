export default [
    {
        path: '/callback-one',
        name: 'callback-one',
        component: () => import('@/views/callback/callback-one'),
        meta: {keepAlive: true}
    },
    {
        path: '/callback-two',
        name: 'callback-two',
        component: () => import('@/views/callback/callback-two'),
        meta: {keepAlive: true}
    }
]
