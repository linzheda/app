export default [
    {
        path: '/components',
        name: 'component-view',
        component: () => import('@/views/components/component-view'),
        meta: {keepAlive: true}
    }
]
