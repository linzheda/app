<template>
    <div id="app">
        <v-touch v-on:swiperight="onSwipeRight" :swipe-options="{direction: 'horizontal', threshold: 50}">
            <transition mode="out-in" :duration="{ enter: 100, leave: 200 }"
                        v-bind:leave-active-class="leaveActiveClass" v-bind:enter-active-class="enterActiveClass">
                <keep-alive :include="keepArray">
                    <router-view style="min-height: 100vh" ></router-view>
                </keep-alive>
            </transition>
        </v-touch>
    </div>
</template>
<script>
    export default {
        name: 'app',
        data() {
            return {
                transitionName: 'fade',
                enterActiveClass: '',
                leaveActiveClass: 'animated fadeOutLeft'
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
                console.log("测试方向" + val);
                if (val == 'forward') {
                    this.enterActiveClass = 'animated fadeInRight';
                    this.leaveActiveClass = 'animated fadeOutLeft';
                } else if (val == 'back') {
                    this.enterActiveClass = 'animated fadeInLeft';
                    this.leaveActiveClass = 'animated fadeOutRight'
                } else {
                    this.enterActiveClass = '';
                    this.leaveActiveClass = '';
                }
            },
            keepArray(val) {
                console.log("测试要缓存的组件列表" + val);
            }
        },
        created() {
            this.$store.dispatch('initEnv',process.env.NODE_ENV);
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
        buttom: 0;
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


</style>
