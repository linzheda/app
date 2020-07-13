export default [
    {
        path: '/echart',
        name: 'echart',
        component: () => import('@/views/charts/echart'),
        meta: {keepAlive: true}
    },

]
