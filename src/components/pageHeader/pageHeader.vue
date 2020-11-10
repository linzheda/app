<template>
    <header class="header">
        <a class="tui-navigate-left tui-left" v-goback:[callbackKey]="data"> </a>
        <h1 class="title">
            <slot>
                {{title}}
            </slot>
        </h1>
        <div class="tui-right" >
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
            }
        },
        data() {
            return {
                callbackKey: '',
                title: ''
            }
        },
        created() {
            this.title = this.$route.meta['title'];
            if (this.needCallback && this.$utils.isEmpty(this.callback)) {
                let arr = this.$store.getters.keepArray;
                this.callbackKey = arr[arr.length - 2];
            }
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style scoped lang="less">
    .header {
        background: #1a7bdd;
        color: #fff;
        position: fixed;
        z-index: 10;
        top: 0;
        right: 0;
        left: 0;
        height: 44px;
        padding-right: 10px;
        padding-left: 10px;

        .tui-navigate-left {
            width: 20px;
            height: 20px;
            overflow: hidden;
            margin-top: 12px;
            padding: inherit;
            white-space: nowrap;
            text-overflow: ellipsis;

            &:after {
                color: white;
                font-size: 18px;
            }
        }

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
        }
    }
</style>