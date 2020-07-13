<template>
    <div class="homepage">
        <div class="header">
            <van-nav-bar title="我的主页"/>
        </div>
        <div class="body">
            <svg-icon icon-class="404"  style="font-size: 35px;color: red"></svg-icon>
            <van-grid :column-num="3">
                <van-grid-item icon="photo-o" text="回调-组件件通信" v-on:click="goCallback()"/>
                <van-grid-item icon="photo-o" text="表单校验" v-on:click="goValidate()"/>
                <van-grid-item icon="photo-o" text="组件" v-on:click="goComponent()"/>
                <van-grid-item icon="photo-o" text="echarts" @click="goCharts" />
                <van-grid-item icon="photo-o" text="过滤器" />
                <van-grid-item icon="photo-o" text="指令"/>
                <van-grid-item icon="photo-o" text="ui框架"/>
            </van-grid>

            <p>{{num|number(2,true)}}</p>
            <p>{{xactdt|date('description')}}</p>
        </div>
        <div class="foot">
        </div>
    </div>
</template>

<script>

    export default {
        name: 'homepage',
        data() {
            return {
                active: 0,
                xactdt: '2019-11-29 12:03:00',
                num: '1,234,567.891011',
            }
        },
        created() {
            console.log("home created");
            this.$bus.$on(this.$route.name, (data) => {
                console.log("进入回调!!!!!" + data);
                this.callback();
            });
        },
        destroyed() {
            console.log("home destroyed");
            this.$bus.$off(this.$route.name);
        },
        methods: {
            goCallback() {
                this.$router.push({name: "callback-one", params: {callback: this.$route.name, data: '啦啦啦德玛西亚'}});
            },
            goValidate(){
                this.$router.push({name:"validate"});
            },
            goComponent(){
                this.$router.push({name:"component-view"});
            },
            goCharts(){
                this.$router.push({name:"echart"});
            },
            callback(){
                this.num='21123133.334444';
            }
        }
    }
</script>
