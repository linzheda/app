<template>
    <div class="homePage tui-wh100">
        这是首页呀
        <router-link :to="{name:'Test'}"> 测试 </router-link>
    </div>
</template>

<script>
    export default {
        name: "homePage",
        data() {
            return {}
        },
        created() {
            this.$permissions.addRoute('Test').then(res=>{
                console.log(res)
            });
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style scoped lang="less">

</style>