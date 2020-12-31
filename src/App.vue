<template>
    <div id="app">
        <v-touch v-on:swiperight="onSwipeRight" :swipe-options="{direction: 'horizontal', threshold: 50}">
            <transition :name="transitionName">
                <keep-alive :include="keepArray">
                    <router-view  class="router-view" ></router-view>
                </keep-alive>
            </transition>
        </v-touch>
        <back-top></back-top>
    </div>
</template>
<script>
    import BackTop from "./components/backTop/backTop";
    export default {
        name: 'app',
        components: {BackTop},
        data() {
            return {
                transitionName: 'slide-left',
            }
        },
        computed: {
            direction() {
                return this.$store.getters.direction;
            },
            keepArray() {
                return this.$store.getters.keepArray;
            }
        },
        watch: {
            direction(val) {
                console.log("路由方向" + val);
                if (val == 'forward') {
                    this.transitionName= 'slide-left';
                } else if (val == 'back') {
                    this.transitionName= 'slide-right';
                } else {
                    this.transitionName = '';
                }
            },
            keepArray(val) {
                console.log("缓存的组件列表" + val);
            }
        },
        created() {
            this.$store.dispatch('initEnv',process.env.NODE_ENV);
            this.$store.dispatch('initAppName',process.env.VUE_APP_NAME);
        },
        methods: {
            onSwipeRight() {
                if(this.$store.getters.canSwipeRight){
                    window.history.length > 1 ? this.$router.back() : this.$router.push('/');
                }
            }
        },


    }
</script>

<style lang="less">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .view-image-container {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        text-align: center;

        div {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
    }

    /* 切页动画 */
    .router-view {
        position: absolute;
        top: 0;
        width: 100%;
    }
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        will-change: transform;
        transition: all 250ms;
        position: absolute;
    }
    .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }
    .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }
    .slide-left-enter {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }
    .slide-left-leave-active {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }


</style>
