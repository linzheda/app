/**
* 描述: loading 组件
*
**/
<template>
    <van-overlay :show="show" @click="show = false" z-index="999">
        <van-loading class="loading" vertical >
            加载中...
        </van-loading>
    </van-overlay>
</template>

<script>
    export default {
        name: "loading",
        data() {
            return {
                show:false,//是否显示
            }
        },
        created() {
        },
        methods: {}
    }
</script>

<style scoped lang="less">
    .loading{
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

</style>