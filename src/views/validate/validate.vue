<template>
    <div class="validate">
        <div class="header">
            <van-nav-bar title="表单校验" left-text="返回" left-arrow v-goback />
        </div>
        <div class="body">
            <div class="eui-input-group">
                <div class="eui-input-row eui-required">
                    <div class="label">最长六个字吧</div>
                    <div class="body">
                        <div class="input">
                            <input type="text" placeholder="请输入required range|1|100" class="field-block" v-validate
                                   data-rules="required range|1|100" validate-name="test4" validate-type="keyup"
                                   validate-tips-required="请输入" validate-tips-range="范围{0}到{1}">
                        </div>
                        <div class="error">{{errors.get('test4')}}</div>
                    </div>
                </div>
                <div class="eui-input-row">
                    <div class="label">rangelength|6|9</div>
                    <div class="body">
                        <div class="input">
                            <input type="text" placeholder="请输入rangelength|6|9" class="field-block" v-validate:test3.change="validateTest">
                        </div>
                        <div class="error">{{errors.get('test3')}}</div>
                    </div>
                </div>
                <div class="eui-input-row">
                    <div class="label">required</div>
                    <div class="body">
                        <div class="input">

                            <input type="text" placeholder="请输入required" class="field-block" v-validate data-rules="required" validate-name="test2">
                        </div>
                        <div class="error">{{errors.get('test2')}}</div>
                    </div>
                </div>

                <div class="eui-input-row">
                    <div class="label">IDCard</div>
                    <div class="body">
                        <div class="input">
                            <van-field  placeholder="请输入身份证" v-validate data-rules="IDCard" validate-name="test6" />
<!--
                            <input type="text" placeholder="IDCard" class="field-block" v-validate data-rules="IDCard" validate-name="test6">
-->
                        </div>
                        <div class="error">{{errors.get('test6')}}</div>
                    </div>
                </div>

                <div class="eui-input-row eui-required">
                    <div class="label">required min|100</div>
                    <div class="body">
                        <div class="input">
                            <input type="text" placeholder="请输入required min|100" class="field-block" v-validate:test1.input data-rules="required min|100">
                        </div>
                        <div class="error">{{errors.get('test1')}}</div>
                    </div>
                </div>
            </div>
            <van-row gutter="10" style="padding: 15px">
                <van-col span="12"><van-button type="info" size="large" @click="check()">验证</van-button></van-col>
                <van-col span="12"><van-button color="#666" size="large" @click="clear()">清除</van-button></van-col>
            </van-row>

        </div>

    </div>
</template>

<script>
    export default {
        name: "validate",
        data () {
            return {
                email: '',
                validateTest: {
                    rules:{
                        required:true,
                        rangelength: [6,9]
                    },
                    msg:{
                        required:"请输入",
                        rangelength:'长度不超过{0}到{1}'
                    }
                },
                password: '',
                validatePassword: [
                    {required: '', msg: ""},
                    {limit: this.limit, msg: ""}
                ]
            }
        },
        methods: {
            check: function () {
                console.log(this.errors);
                console.log(this.$validator);
                console.log(this.$validator.checkAll());
            },
            clear(){
                this.$validator.clear();
            }
        }
    }
</script>

<style lang="less" scoped>

    .eui-input-group{
        background: #fff;
    }
    .eui-input-row{
        position: relative;
        display: flex;
        width: 100%;
        padding: 10px 16px;
        color: #323232;
        font-size: 14px;
        line-height: 24px;
        background: #fff;
        box-sizing: border-box;
        &:not(:last-child):after{
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
        .label{
            width: 90px;
            word-wrap: break-word;
        }
        .body{
            flex: 1;
            padding-left: 10px;
            .input{
                display: flex;
                align-items: center;
                .field-block{
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
            .error{
                color: #ee0a24;
                font-size: 12px;
                text-align: left;
            }
        }
    }
    .eui-required:before{
        position: absolute;
        left: 8px;
        color: #ee0a24;
        font-size: 14px;
        content: '*';
    }

    .mt-input{
        display: inline-block;
        border: 1px solid #ccc;
        line-height: 20px;
        font-size: 12px;
        color: #333;
        vertical-align: middle;
    }
    .valdate__error{
        border: 1px solid red;
    }
</style>
