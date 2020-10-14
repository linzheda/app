<template>
    <div class="login">
        <div class="title">
            <h3>登录</h3>
            <p>你的宣传口号或理念</p>
        </div>
        <div class="input-group">
            <div class="row">
                <div class="label">
                    <svg-icon icon-class="user"></svg-icon>
                </div>
                <input type="text" v-model="username" placeholder="请输入用户名" class="field-block"
                       v-validate
                       data-rules="required" validate-name="login1" validate-type="keyup"
                       validate-tips-required="请输入用户名">
            </div>
            <div class="error">{{errors.get('login1')}}</div>
            <div class="row">
                <div class="label">
                    <svg-icon icon-class="password"></svg-icon>
                </div>
                <input type="password" v-model="password" placeholder="请输入密码" class="field-block"
                       v-validate data-rules="required" validate-name="login2" validate-type="keyup"
                       validate-tips-required="请输入密码">
            </div>
            <div class="error">{{errors.get('login2')}}</div>
            <a href="javascript:void(0)" class="forgot">忘记密码？</a>
        </div>
        <div class="btn" v-on:click="login">登录</div>

        <div class="foot">
            还没有账号<a href="javascript:void(0)">去创建</a>?
        </div>
    </div>
</template>

<script>
    import md5 from 'js-md5';

    export default {
        name: "login",
        data() {
            return {
                username: '',
                password: ''
            }
        },
        created() {
            if (this.$store.getters.env === 'dev') {
                this.username = 'admin';
                this.getSystem();
            }
        },
        methods: {
            //获取系统参数
            getSystem() {
                this.$http.post('pub/pubCtr/getSysParam', {code: 'superPassword'}).then(res => {
                    this.password = res.data.value;
                });
            },
            //登录
            login() {
                if (this.$validator.checkAll()) {
                    let jsonParam = {
                        name: this.username,
                        password: md5(this.password)
                    };
                    this.$store.dispatch('Login', jsonParam).then(res => {
                        if (res.code === 500) {
                            this.$dialog.alert({
                                title: '出错了',
                                message: res.error
                            });
                        } else {
                            this.$permissions.initRoutes();
                        }
                    });
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .login{
        width: 100%;
        height: 100vh;
        padding: 100px 30px 0 30px;
        background: url('~@/assets/images/login/login-bg.png') no-repeat top center #fff;
        background-size: cover;
        box-sizing: border-box;
        .title{
            text-align: left;
            margin-bottom: 66px;
            h3{
                font-size: 34px;
                line-height: 50px;
                color: #000;
                margin: 0;
            }
            p{
                margin: 0;
                line-height: 34px;
                font-size: 16px;
                color: rgba(102,102,102,.6);
            }
        }
        .input-group{
            .row{
                display: flex;
                align-items: center;
                height: 46px;
                margin-bottom: 20px;
                padding-right: 20px;
                background: #fff;
                box-shadow: 0px 5px 20px 1.8px rgba(203, 203, 203, 0.58);
                border-radius: 46px;
                .label{
                    width: 60px;
                }
                input.field-block{
                    flex: 1;
                    border: none;
                    height: 44px;
                    margin: 0;
                    font-size: 14px;
                }
            }
            .error{
                font-size: 12px;
                color: red;
                margin-top: -12px;
                margin-bottom: 5px;
            }
            .forgot{
                float: right;
                font-size: 12px;
                color: #666;
            }
        }
        .btn{
            display: block;
            margin-top: 100px;
            height: 40px;
            line-height: 40px;
            color: #fff;
            text-align: center;
            font-size: 16px;
            border-radius: 40px;
            background-image: -webkit-linear-gradient( -180deg, rgb(252,184,127) 0%, rgb(254,121,113) 100%);
        }
        .foot{
            position: absolute;
            left: 0;
            width: 100%;
            text-align: center;
            color: #666;
            font-size: 12px;
            bottom: 40px;
            a{
                color: #fe8674;
            }
        }
    }
</style>
