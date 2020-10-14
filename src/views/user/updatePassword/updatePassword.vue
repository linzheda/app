<template>
    <div class="updatePassword tui-wh100">
        <page-header></page-header>
        <div class="tui-content">
            <div class="do-box">
                <password-field v-model="oldPassword" label="旧密码" placeholder="请输入旧密码" v-validate
                                data-rules="required" validate-name="oldPassword" validate-type="keyup"></password-field>
                <div class="error">{{errors.get('oldPassword')}}</div>
                <password-field v-model="newPassword" label="新密码" placeholder="请输入新密码"  v-validate
                                data-rules="required password2" validate-name="newPassword" validate-type="keyup"></password-field>
                <div class="error">{{errors.get('newPassword')}}</div>
                <p>密码必须符合以下要求：长度为8~16位，至少8个字符，至少1个大写字母，1个小写字母和1个数字</p>
                <div style="margin: 16px;">
                    <van-button round block type="info" @click="onSubmit">
                        提交
                    </van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PasswordField from "@/components/passwordField/passwordField";
    import {Toast} from "vant";

    export default {
        name: "updatePassword",
        components: {PasswordField},
        data() {
            return {
                oldPassword: '',//旧密码
                newPassword: '',//新密码
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
           //修改密码
            onSubmit() {
                if(this.$validator.checkAll()){
                    let param={
                        id:this.$store.getters.id,
                        oldPassword:this.oldPassword,
                        newPassword:this.newPassword,
                    };
                    this.$http.post('access/user/updatePassword',param).then(res=>{
                       if(res['data']){
                           Toast({
                               type: 'success',
                               message: res['msg'],
                           });
                           this.$store.dispatch("loginOut", 1).then(() => {
                               location.reload();
                           });
                       }else{
                           Toast({
                               type: 'fail',
                               message: res['msg'],
                           });
                       }
                    });
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .do-box{
        p{
            font-size: 12px;
            color: #969696;
        }
        .error{
            color: red;
            font-size: 12px;
        }
    }
</style>