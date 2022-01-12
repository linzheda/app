export default [
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test/test'),
        meta: {keepAlive: false,title:'测试'}
    }
]
