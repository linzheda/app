<template>
    <div class="home-tabs" ref="boxtabs">
        <div class="body" style="padding-bottom: 50px;">
            <div v-if="pages[0].created==true">
                <home v-show="active==0"></home>
            </div>
            <div v-if="pages[1].created==true">
                <service v-show="active==1"></service>
            </div>
            <div v-if="pages[2].created==true">
                <about v-show="active==2"></about>
            </div>
        </div>
        <van-tabbar v-model="active">
            <van-tabbar-item v-for="(item,index) in pages " v-on:click="clickTabItem(index)" :key="index" :icon="item.icon">
                {{item.name}}
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    import Home from "./homepage";
    import Service from "./service";
    import About from "./about";

    export default {
        name: "home-tabs",
        components: {About, Service, Home},
        mounted() {
            window.addEventListener('scroll', this.scrollToTop)
        },
        data() {
            return {
                active: 0,
                isActive: 0,
                scrollheight: 0,
                pages: [
                    {
                        name: 'homepage',
                        icon: 'home-o',
                        to: 'homepage',
                        created: true,
                        isActive: true,
                        scrolltop: 0
                    },
                    {
                        name: 'service',
                        icon: 'home-o',
                        to: 'service',
                        created: false,
                        isActive: false,
                        scrolltop: 0
                    }, {
                        name: 'about',
                        icon: 'user-o',
                        to: 'about',
                        created: false,
                        isActive: false,
                        scrolltop: 0
                    }
                ]
            }
        },
        methods: {
            clickTabItem(index) {
                this.pages[this.isActive].scrolltop = this.scrollheight;
                this.pages[this.isActive].isActive = false;
                this.isActive = index;
                this.pages[index].created = true;
                this.pages[index].isActive = true;
                this.$nextTick(() => {
                    window.scrollTo(0,this.pages[index].scrolltop);
                });
            },
            scrollToTop() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                this.scrollheight = scrollTop;
            }
        }

    }
</script>

<style scoped>

</style>
