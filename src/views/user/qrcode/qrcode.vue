<template>
    <div class="qrcode tui-wh100">
        <page-header></page-header>
        <!--页面主体-->
        <div class="tui-content">
            <div class="eui-qrcode">
                <div class="con">
                    <div class="top"><b>{{name}}</b>扫码下载，体验更多内容</div>
                    <div class="box">
                        <img :src="require('@/assets/images/qrcode/qrcode.png')"/>
                        <span>{{name}}APP客户端</span>
                    </div>
                </div>
                <div class="ft">扫一扫上面的二维码图案，下载{{name}}APP</div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "qrcode",
        data() {
            return {
                name: '',
                callback:''
            }
        },
        created() {
            this.name = this.$store.getters.appName;
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style scoped lang="less">
    .eui-qrcode {
        background: url('~@/assets/images/qrcode/qrcode-bg.png') no-repeat top center;
        background-size: cover;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .eui-qrcode .con {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }

    .eui-qrcode .top {
        width: 230px;
        margin: 0 auto -20px;
        padding: 15px 0 0 80px;
        height: 130px;
        text-align: center;
        font-size: 16px;
        color: rgba(255, 255, 255, .7);
        background: url('~@/assets/images/qrcode//qrcode-man.png') no-repeat left top;
        background-size: 100px;
    }

    .eui-qrcode .top b {
        display: block;
        line-height: 56px;
        font-size: 35px;
        color: #fff;
        background-image: linear-gradient(to bottom, #fff, #e5f1ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .eui-qrcode .box {
        position: relative;
        margin: 0 auto;
        padding: 15px;
        width: 240px;
        background: #fff;
        border-radius: 8px;
    }

    .eui-qrcode .box:before, .eui-qrcode .box:after {
        content: '';
        position: absolute;
        top: calc(100% - 2px);
        left: 24px;
        right: 24px;
        height: 20px;
        border-radius: 0 0 24px 24px;
        background: #fff;
        opacity: .3;
    }

    .eui-qrcode .box:after {
        left: 12px;
        right: 12px;
        height: 12px;
        border-radius: 0 0 12px 12px;
        opacity: .4;
    }

    .eui-qrcode .box img {
        display: block;
        margin: 20px auto 12px;
        width: 160px;
        height: 160px;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, .3);
    }

    .eui-qrcode .box span {
        display: block;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
    }

    .eui-qrcode .ft {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        text-align: center;
        color: #fff;
        font-size: 14px;
    }

</style>