<template>
    <div class="about tui-wh100">
        <div class="banner">
            <div class="user-center">
                <img :src="require('@/assets/images/user/about/head.png')">
                <b>{{userName}}</b>
            </div>
        </div>
        <div class="center-card">
            <ul class="table-view">
                <li class="table-view-cell" v-for="(item,index) of menuList" :key="index" @click="goPage(item)">
                    <a class="tui-navigate-right">
                        <svg-icon :icon-class="item.meta.icon"></svg-icon>
                        {{item.meta.title}}</a>
                </li>
                <li class="table-view-cell" >
                    <a class="tui-navigate-right">
                        <svg-icon icon-class="app-updateVersion"></svg-icon>
                       检查更新</a>
                </li>
            </ul>
        </div>

        <div class="center-card">
            <ul class="table-view">
                <li class="table-view-cell">
                    <a class="exit" @click="loginOut()">退出账号</a>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    export default {
        name: "about",
        data() {
            return {
                userName: '',//用户名
                menuList: [],//当前拥有的菜单
            }
        },
        created() {
            this.userName = this.$store.getters.name;
            this.$permissions.getMenuList(this.$route).then(res => {
                this.menuList = res;
            });
            this.$bus.$on(this.$route.name, (data) => {
                console.log("进入回调!!!!!" + data);
            });
        },
        mounted() {

        },
        methods: {
            //退出登录
            loginOut() {
                this.$store.dispatch("loginOut", 1).then(() => {
                    location.reload();
                });
            },
            //进入对应的页面
            goPage(item) {
                this.$router.push({name: item.name});
            }
        }
    }
</script>

<style scoped lang="less">
    .about {
        height: 100vh;
        background-color: #F2F2F2;
    }

    .banner {
        position: relative;
        height: 200px;
        line-height: 1.4;
        padding: 60px 25px 0;
        text-align: center;
        background: linear-gradient(to bottom, #025eba, #3797f8);

        &:before {
            content: '';
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("~@/assets/images/user/about/banner.png") no-repeat center bottom;
            background-size: 100%;
            pointer-events: none;
        }

        .user-center {
            padding-top: 12px;

            img {
                display: block;
                margin: 0 auto 10px;
                width: 64px;
                height: 64px;
            }

            b {
                display: block;
                line-height: 30px;
                font-size: 18px;
                color: #e8f1f4;
            }

            span {
                position: relative;
                display: inline-block;
                line-height: 24px;
                font-size: 12px;
                margin-bottom: 4px;
                color: #e8f1f4;
                opacity: .7
            }
        }
    }

    .center-card {
        margin: 12px;
        border-radius: 8px;
        font-size: 15px;
        background: #fff;
        overflow: hidden;

        .table-view {
            position: relative;
            margin-top: 0;
            margin-bottom: 0;
            padding-left: 0;
            list-style: none;
            background-color: #fff;

            .table-view-cell {
                position: relative;
                overflow: hidden;
                padding: 11px 15px;
                -webkit-touch-callout: none;

                .exit {
                    color: #fc3f3f !important;
                }

                &:after {
                    position: absolute;
                    right: 15px;
                    bottom: 0;
                    left: 15px;
                    height: 1px;
                    content: '';
                    -webkit-transform: scaleY(.5);
                    transform: scaleY(.5);
                    background-color: #c8c7cc;
                }

                &:last-child:after {
                    height: 0;
                }

                & > a:not(.btn) {
                    position: relative;
                    display: block;
                    overflow: hidden;
                    margin: -11px -15px;
                    padding: inherit;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: inherit;

                    .svg-icon {
                        color: #29A1F7;
                        padding: 0 4px;
                        margin-right: 8px;
                        border-radius: 3px
                    }
                }
            }


        }
    }

</style>