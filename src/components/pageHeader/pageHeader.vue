<template>
    <header class="header" :style="{'background-color': backgroundColor, color: fontColor}">
        <van-icon name="arrow-left" ref="backbtn" v-goback:[callbackKey]="data"/>
        <slot>
            <h1 class="title">
                {{pageTitle}}
            </h1>
        </slot>
        <div class="tui-right">
            <slot name="right"></slot>
        </div>
    </header>
</template>

<script>
    export default {
        name: "pageHeader",
        props: {
            data: {
                type: Object,
                default: null
            },
            needCallback: {
                type: Boolean,
                default: false
            },
            callback: {
                type: String,
                default: null
            },
            title: {
                type: String,
                default: null
            },
            //背景色
            backgroundColor: {
                type: String,
                default: '#ffffff' // 1a7bdd
            },
            //字体颜色
            fontColor: {
                type: String,
                default: '#000000'
            },
        },
        data() {
            return {
                callbackKey: '',
                pageTitle: ''
            }
        },
        created() {
            this.pageTitle = this.title == null ? this.$route.meta['title'] : this.title;
            if (this.needCallback && this.$utils.isEmpty(this.callback)) {
                let arr = this.$store.getters.keepArray;
                this.callbackKey = arr[arr.length - 2];
            }
        },
        mounted() {
        },
        methods: {
            goBack() {
                this.$refs.backbtn.click();
            }
        }
    }
</script>

<style scoped lang="less">
    .header {
        position: fixed;
        z-index: 10;
        top: 0;
        right: 0;
        left: 0;
        height: 44px;
        padding-right: 10px;
        padding-left: 45px;
        border-bottom: solid 1px #dcdee0;

        .title {
            font-size: 17px;
            font-weight: 500;
            line-height: 44px;
            position: absolute;
            right: 40px;
            left: 40px;
            display: inline-block;
            overflow: hidden;
            width: auto;
            margin: 0;
            text-overflow: ellipsis;
            text-align: center;
        }

        .van-icon-arrow-left {
            position: absolute;
            bottom: 10px;
            left: 10px;
            font-size: 24px;
        }
    }
</style>
