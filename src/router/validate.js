export default [
    {
        path: '/validate',
        name: 'validate',
        component: () => import('@/views/validate/validate'),
        meta: {keepAlive: true}
    }
]
