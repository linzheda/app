<template>
    <div class="chart" ref="chart">

    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        name: "echarts",
        props: {
            option: {
                type: Object,
                default: null
            },
        },
        data() {
            return {
                myChart: null
            }
        },
        mounted() {
            this.initCharts();
        },
        methods: {
            initCharts() {//初始化图表
                this.myChart = echarts.init(this.$refs.chart);
                this.myChart.setOption(this.option);
                window.addEventListener("resize", this.myChart.resize());
            }
        },
        watch: {
            option: {//监听echarts 的option 是否变化
                handler(newVal, oldVal) {
                    if (this.myChart!=null) {
                        if (newVal) {
                            this.myChart.setOption(newVal);
                        } else {
                            this.myChart.setOption(oldVal);
                        }
                    } else {
                        this.initCharts();
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="less">
    .chart {
        width: 100%;
        height: 100%;
    }
</style>
