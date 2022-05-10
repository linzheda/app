<template>
    <div class="homePage tui-wh100">
        这是首页呀

        <button @click="showLoading()">显示loading</button>

    </div>
</template>

<script>
    export default {
        name: "homePage",
        data() {
            return {}
        },
        created() {

        },
        mounted() {
        },
        methods: {
            showLoading(){
                this.$loading.show();
                setTimeout(()=>{
                    this.$loading.hide();
                },5000)
            }
        }
    }
</script>

<style scoped lang="less">

</style>