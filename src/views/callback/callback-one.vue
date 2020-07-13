<template >
    <div class="callback-one">
        <div class="header">
            <van-nav-bar title="回调页面一" left-text="返回" left-arrow v-goback />
        </div>
        <div class="body">
            德玛西亚
            <div  v-for="item in list" :key="item">
                列表{{item}}
            </div>
            <button v-goback:[callback]="data" >返回上一级</button>
            <button v-on:click="goNextPage()" >进入下一级</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "callback-one",

        data() {
            return {
                callback: this.$route.params.callback,
                data:this.$route.params.data,
                list:[]
            }
        },
        created(){
            console.log('回调页面一 实例已创建');
            for(let i=0;i<50;i++){
                this.list.push(i);
            }
        },
        activated(){
            console.log("回调页面一  的activated");
        },
        destroyed() {
            console.log('回调页面一 实例已销毁');
        },
        methods: {
            goNextPage(){
                this.$router.push({name:'callback-two'});
            }
        }
    }
</script>

<style scoped>
</style>
