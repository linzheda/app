<template>
    <!--描述: 注册用户-->
    <div class="register tui-wh100">
        <page-header></page-header>
        <div class="tui-content">
            <div class="steps">
                <van-steps :active="active">
                    <van-step>基本信息填写</van-step>
                    <van-step>密码设置</van-step>
                    <van-step>提交成功</van-step>
                </van-steps>
            </div>
            <!--基本信息填写-->
            <div class="do-box" v-if="active===0">
                <van-field v-model="username" type="text" label="用户名" placeholder="请输入用户名"
                           v-validate data-rules="required " validate-name="username" validate-type="keyup"></van-field>
                <div class="tui-error">{{errors.get('username')}}</div>
                <!-- 输入手机号，调起手机号键盘 -->
                <van-field v-model="tel" type="tel" label="手机号" placeholder="请输入手机号"
                           v-validate data-rules="required phone" validate-name="tel" validate-type="keyup"/>
                <div class="tui-error">{{errors.get('tel')}}</div>
                <van-field v-model="sms" center clearable label="验证码" placeholder="请输入短信验证码"
                           v-validate data-rules="required" validate-name="sms" validate-type="keyup">
                    <template #button>
                        <van-button v-if="isShowSendBtn" size="small" type="primary" @click="clickSendSms">发送验证码
                        </van-button>
                        <van-count-down ref="countDown" v-else :time="60000" @finish="finishCountDown"
                                        format="ss秒后重新发送"/>
                    </template>
                </van-field>
                <div class="tui-error">{{errors.get('sms')}}</div>
                <van-button type="info" block round size="small" class="submit-btn" @click="checkNextOne">下一步
                </van-button>
            </div>
            <!--设置新密码-->
            <div class="do-box" v-else-if="active===1">
                <password-field v-model="newPassword1" label="设置密码" placeholder="请设置密码" v-validate
                                data-rules="required password2" validate-name="newPassword1"
                                validate-type="keyup"></password-field>
                <div class="tui-error">{{errors.get('newPassword1')}}</div>
                <password-field v-model="newPassword2" label="确认密码" placeholder="请确认密码" v-validate
                                data-rules="required" validate-name="newPassword2"
                                validate-type="keyup"></password-field>
                <div class="tui-error">{{errors.get('newPassword2')}}</div>
                <p>密码必须符合以下要求：长度为8~16位，至少1个大写字母，1个小写字母和1个数字</p>
                <div style="margin: 16px;">
                    <van-button round block type="info" @click="checkNextTwo">
                        提交
                    </van-button>
                </div>
            </div>
            <!--修改成功返回登录页-->
            <div class="do-box" v-else-if="active===2">
                <div class="reg-ok">
                    <img :src="require('@/assets/images/user/forgetpassword/reg-ok.png')"/>
                    <b>恭喜您，注册成功！</b>
                    <span>您可使用【登录账号或手机号】进行<br/>账户登录</span>
                </div>
                <div style="margin: 16px;">
                    <van-button round block type="info" @click="checkNextTree">
                        我知道了
                    </van-button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import PasswordField from "../../../components/passwordField/passwordField";
    import {Toast} from "vant";
    import md5 from "js-md5";

    export default {
        name: "register",
        components: {PasswordField},
        data() {
            return {
                type:1,//验证码类型 1注册2登录3忘记密码
                active: 0,//当前步骤
                tel: '',//手机号
                username: '',//用户名
                trueSms: '',//正确的短信验证码
                sms: '',//短信验证码
                isShowSendBtn: true,//是否显示发生按钮
                newPassword1: '',//新密码
                newPassword2: '',//确认新密码
            }
        },
        created() {
            console.log(this.$route)
        },
        mounted() {
        },
        methods: {
            //点击获取验证码
            clickSendSms() {
                if (this.$validator.checkArr(['tel'])) {
                    this.isShowSendBtn = false;
                    let param = {
                        tel: this.tel,
                        type:this.type
                    };
                    this.$http.post('access/user/sendSms', param).then(res => {
                        if (res['data']) {
                            this.trueSms = res['data'];
                        }
                    })
                } else {
                    Toast({
                        type: 'fail',
                        message: '请输入正确的手机号',
                    });
                }
            },
            //结束倒计时
            finishCountDown() {
                this.$refs.countDown.reset();
                this.isShowSendBtn = true;
            },
            //点击下一步验证 验证码是否正确
            checkNextOne() {
                if (this.$validator.checkArr(['tel', 'sms'])) {
                    let param = {
                        tel: this.tel,
                        sms: this.sms,
                        type:this.type
                    };
                    this.$http.post('access/user/checkSms', param).then(res => {
                        if (res['data']) {
                            this.active++;
                        } else {
                            Toast({
                                type: 'fail',
                                message: res['msg'],
                            });
                        }
                    });
                } else {
                    Toast({
                        type: 'fail',
                        message: this.errors[0]['msg'],
                    });
                }
            },
            /*点击下一步 注册*/
            checkNextTwo() {
                if (this.$validator.checkArr(['newPassword1', 'newPassword2'])) {
                    if (this.newPassword1 !== this.newPassword2) {
                        Toast({
                            type: 'fail',
                            message: "密码不一致",
                        });
                    } else {
                        let param = {
                            tel: this.tel,
                            password: md5(this.newPassword1),
                            name:this.username,
                            loginname:this.tel,
                            status:1,
                        };
                        this.$http.post('access/user/register', param).then(res => {
                            if (res['data']) {
                                this.active++;
                            }
                        });
                    }
                }

            },
            /*点击返回登录页*/
            checkNextTree() {
                this.$router.back();
            }
        }
    }
</script>

<style scoped lang="less">
    .steps {
        padding: 20px 30px;

        .van-steps {
            text-align: left;
        }
    }

    .do-box {
        padding: 0 20px;

        p {
            font-size: 12px;
            color: #969696;
        }

    }

    .reg-ok {
        padding-top: 30px;
        text-align: center;

        img {
            display: block;
            margin: 0 auto;
            width: 50%;
        }

        b {
            display: block;
            margin-bottom: 10px;
            font-size: 16px;
            color: #ffa29d;
        }

        span {
            display: block;
            color: #999;
            font-size: 12px;
        }
    }

    .submit-btn {
        width: 80%;
        margin: 50px auto 0;
    }

    .van-count-down {
        color: #bbbbbb;
    }
</style>