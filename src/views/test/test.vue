/**
* 描述:
*
**/
<template>
    <div class="test tui-wh100">
        <page-header></page-header>
        <div class="tui-content">
            <float-ball>
                <div class="add-btn"  @click="goCaseReport">
                    <van-icon name="plus"/>
                    新增
                </div>
            </float-ball>
        </div>
    </div>
</template>

<script>
    import FloatBall from "../../components/floatBall/floatBall";
    export default {
        name: "test",
        components: {FloatBall},
        data() {
            return {
                data:'3213213'
            }
        },
        created() {
            this.$store.dispatch('updateCanSwipeRight', false);
        },
        methods: {
            goCaseReport(){
                console.log(this.data);
            }
        }
    }
</script>

<style scoped lang="less">
    .add-btn {
        text-align: center;
        background: #1a7bdd;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 12px;

        .van-icon {
            padding: 6px 0;
            display: block;
        }
    }
</style>