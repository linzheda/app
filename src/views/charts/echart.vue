<template>
    <div class="echart">
        <div class="header">
            <van-nav-bar title="echarts图标" left-text="返回" left-arrow v-goback />
        </div>
        <div class="body">
            <button @click="updateCharts()">点击修改图标</button>
            <div class="echarts1" style="width: 80vw;height: 50vh;" >
                <echarts :option="option"/>
            </div>
        </div>

    </div>
</template>

<script>
    import Echarts from "../../components/echarts";
    export default {
        name: "echart",
        components: {Echarts},
        beforeRouteEnter (to, from, next) {
            // 这里还无法访问到组件实例，this === undefined
            next( vm => {
                // 通过 `vm` 访问组件实例
                vm.$store.dispatch("updateCanSwipeRight", false);
            })
        },
        beforeRouteLeave(to, from, next){
            this.$store.dispatch("updateCanSwipeRight", true);
            next();
        },
        data(){
            return {
                option:{
                    title: {
                        text: 'ECharts 入门示例'
                    },
                    tooltip: {},
                    xAxis: {
                        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                },

            }
        },
        mounted(){

        },
        methods: {
            updateCharts() {
                this.option={
                    title: {
                        text: 'ECharts 测试'
                    },
                    tooltip: {},
                    xAxis: {
                        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                    },
                    yAxis: {},
                    series: [{
                        name: '拉拉',
                        type: 'bar',
                        data: [5, 25, 36, 10, 10, 20]
                    }]
                };
            },
        }
    }
</script>

<style scoped>

</style>
