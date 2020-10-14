<template>
    <div class="homeTabs">
        <router-view  />
        <van-tabbar route>
            <van-tabbar-item v-for="(item,index) of menuList" active-color='29A1F7' :key="index" replace :to="item.path" >
                <span>{{item.meta.title}}</span>
                <template  #icon="props">
                   <svg-icon  :icon-class="item.meta.icon" :class="{'active':props.active,'inactive':!props.active}" ></svg-icon>
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    export default {
        name: "homeTabs",
        data() {
            return {
                active:0,//当前选中哪个
                menuList:[],//菜单列表
            }
        },
        created() {
            this.initMenu();
        },
        mounted() {
        },
        beforeRouteEnter (to, from, next) {
            // 在渲染该组件的对应路由被 confirm 前调用
            // 不！能！获取组件实例 `this`
            // 因为当守卫执行前，组件实例还没被创建
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.$store.dispatch('updateCanSwipeRight', false);
            })

        },
        beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
            this.$store.dispatch('updateCanSwipeRight', true);
            next()
        },
        methods: {
            //初始化菜单列表
            initMenu(){
                let menus=this.$permissions.getCurrentRoute(this.$route);
                this.menuList=menus['children'];
                this.$router.push({name: this.menuList[0]['name']})
            },
        }
    }
</script>

<style scoped lang="less">
    .active{
        color: #29A1F7;
    }
    .inactive{
        color: #000000;
    }
</style>