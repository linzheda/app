<template>
    <div class="service">
        <div class="header"></div>
        <div class="body">
            德玛西亚
            <div  v-for="item in list" :key="item">
                列表{{item}}
            </div>
        </div>
        <div class="foot">
        </div>
    </div>
</template>

<script>
    export default {
        name: "service",
        data(){
            return{
              list:[]
            };
        },
        created() {
            console.log("service created");
            for(let i=0;i<100;i++){
                this.list.push(i);
            }
        },
        destroyed() {
            console.log("service destroyed");
        }
    }
</script>

<style scoped>

</style>
