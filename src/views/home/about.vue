<template>
    <div class="about">
        <div class="header">
            <van-nav-bar title="个人信息"/>
        </div>
        <div class="body">
            <button @click="test"> 测试</button>
            <button v-goback>退出</button>
        </div>
        <div class="foot">
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        created() {
            console.log("about created");
            this.getUserInfo();
        },
        destroyed(){
            console.log("about destroyed");
        },
        methods: {
            getUserInfo() {
                let jsonParam = {
                    id: 1
                };
                this.$http.post('/userCtr/getUserInfo', jsonParam).then(res => {
                    console.log(res);
                });
            },
            test(){
                this.$http.get('/userCtr/consumer',{},false).then(res=>{
                    console.log(res);
                });
            }
        }
    }
</script>

<style scoped>

</style>
