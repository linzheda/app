<template>

    <div class="login">
        <div class="header">
            <img src="@/assets/logo.png">
        </div>
        <div class="body">
            <div style="width: 90vw;margin: 0 auto;">
                <div class="eui-input-group">
                    <div class="eui-input-row eui-required">
                        <div class="label"><svg-icon icon-class="user"></svg-icon>用户名</div>
                        <div class="body">
                            <div class="input">
                                <input type="text" v-model="username" placeholder="请输入用户名" class="field-block"
                                       v-validate
                                       data-rules="required" validate-name="login1" validate-type="keyup"
                                       validate-tips-required="请输入用户名">
                            </div>
                            <div class="error">{{errors.get('login1')}}</div>
                        </div>
                    </div>
                    <div class="eui-input-row eui-required">
                        <div class="label"><svg-icon icon-class="password"></svg-icon>密码</div>
                        <div class="body">
                            <div class="input">
                                <input type="password" v-model="password" placeholder="请输入密码" class="field-block"
                                       v-validate data-rules="required" validate-name="login2" validate-type="keyup"
                                       validate-tips-required="请输入密码">
                            </div>
                            <div class="error">{{errors.get('login2')}}</div>
                        </div>
                    </div>
                </div>
                <van-button type="info" size="large" v-on:click="login" >登录</van-button>
            </div>
        </div>
        <div class="footer">

        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        created() {
        },
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            login() {
                if (this.$validator.checkAll()) {
                    let jsonParam = {
                        name: this.username,
                        password: this.password
                    };
                    this.$store.dispatch('Login', jsonParam).then(res => {
                        this.$router.push({name: 'home-tabs'});
                        if (res.code == 500) {
                            this.$dialog.alert({
                                title: '出错了',
                                message: res.error
                            }).then(() => {
                                window.location.reload();
                            });
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .header img {
        width: 120px;
        margin: 30px auto;
    }

    .eui-input-group {
        background: #fff;
    }

    .eui-input-row {
        position: relative;
        display: flex;
        width: 100%;
        padding: 10px 16px;
        color: #323232;
        font-size: 14px;
        line-height: 24px;
        background: #fff;
        box-sizing: border-box;

        &:not(:last-child):after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: 0;
            bottom: 0;
            left: 16px;
            border-bottom: 1px solid #ebedf0;
            transform: scaleY(0.5);
        }

        .label {
            width: 90px;
            word-wrap: break-word;
        }

        .body {
            flex: 1;
            padding-left: 10px;

            .input {
                display: flex;
                align-items: center;

                .field-block {
                    display: block;
                    width: 100%;
                    min-width: 0;
                    margin: 0;
                    padding: 0;
                    color: #323232;
                    background: transparent;
                    border: 0;
                    resize: none;
                }
            }

            .error {
                color: #ee0a24;
                font-size: 12px;
                text-align: left;
            }
        }
    }

    .eui-required:before {
        position: absolute;
        left: 8px;
        color: #ee0a24;
        font-size: 14px;
        content: '*';
    }

    .mt-input {
        display: inline-block;
        border: 1px solid #ccc;
        line-height: 20px;
        font-size: 12px;
        color: #333;
        vertical-align: middle;
    }

    .valdate__error {
        border: 1px solid red;
    }

</style>
