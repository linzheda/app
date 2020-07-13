<template>
    <div class="callback-two">
        <div class="header">
            <van-nav-bar title="回调页面二" left-text="返回" left-arrow v-goback />
        </div>
        <div class="body">
            <button  v-on:click="goBack" >返回上一级</button>

        </div>
    </div>
</template>

<script>
    export default {
        name: "callback-two",
        created(){
            console.log('回调页面二 实例已创建');
        },
        destroyed() {
            console.log('回调页面二 实例已销毁');
        },
        methods:{
            goBack(){
                this.$router.back();
            }
        }
    }
</script>

<style scoped>

</style>
