<template>
    <div class="chart" ref="chart">
    </div>
</template>

<script>
    // 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
    import * as echarts from 'echarts/core';
    // 引入柱状图图表，图表后缀都为 Chart
    import {
        BarChart,LineChart,PieChart
    } from 'echarts/charts';
    // 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
    import {
        TitleComponent,
        TooltipComponent,
        GridComponent
    } from 'echarts/components';
    // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
    import {
        CanvasRenderer
    } from 'echarts/renderers';

    // 注册必须的组件
    echarts.use(
        [TitleComponent, TooltipComponent, GridComponent,CanvasRenderer, BarChart,LineChart,PieChart, ]
    );


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
