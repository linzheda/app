<template>
    <!--带密码可见功能的密码输入框-->
    <van-field
            class="field" :class="{'my-boder':border}"
            v-model="password" :type="passwordType" :label=label :placeholder=placeholder
            clearable v-bind="$attrs"
            @input="$emit('input',password)"
            ref="input" @focus="border?$refs.input.$el.classList.add('on'):''"
            @blur="border?$refs.input.$el.classList.remove('on'):''">
        <template slot="right-icon">
            <svg-icon :icon-class="passwordType==='password'?'app-eyes-open':'app-eyes-close'"
                      @click.stop="switchPasswordType"></svg-icon>
        </template>
    </van-field>
</template>

<script>
    export default {
        name: "passwordField",
        model: {
            prop: 'inputValue',
            event: 'input'
        },
        props: {
            /**
             * 当前输入的值
             */
            inputValue: {
                type: String,
                default: ''
            },
            /**
             * 输入框左侧文本
             */
            label: {
                type: String,
                default: ''
            },
            /**
             * 占位提示文字
             */
            placeholder: {
                type: String,
                default: '请输入密码'
            },
            border: {
                type: Boolean,
                default: false
            }

        },
        data() {
            return {
                password: this.inputValue,
                passwordType: 'password',
            }
        },
        methods: {
            /**
             * 密码是否可见
             */
            switchPasswordType() {
                this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
            }
        }
    }
</script>

<style scoped lang="less">
    .field /deep/ .van-field__right-icon {
        display: flex
    }


    .field /deep/ .van-field__label {
        width: auto;
        margin-right: 0.4rem;
    }


    /deep/ .my-boder {
        border: 1px solid #eeeeee;
        border-radius: 10px;
        padding: 5px 10px;
        width: 96%;
        margin-left: 2%;

        input:focus ~ .input-border {
            border: 1px solid #eeeeee;
        }

        &.on {
            border: 1px solid #1a7bdd;
        }
    }

</style>