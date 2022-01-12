<template>
    <header class="header" :style="style" :class="{ 'botborder': border }">
        <van-icon class="header-left" v-if="leftArrow" name="arrow-left" ref="backbtn" v-goback:[callbackKey]="data"/>
        <div class="header-center">
            <slot>
                <div class="header-title" :style="{'top':$store.getters.headerHeight,'margin-right':leftArrow?'34px':'0'}">
                    <h6 class="title" v-if="hastitle">
                        {{pageTitle}}
                    </h6>
                </div>
            </slot>
        </div>
        <div class="header-right">
            <slot name="right"></slot>
        </div>
    </header>
</template>

<script>
    export default {
        name: "pageHeader",

        props: {
            data: {
                type: Object,
                default: null
            },
            needCallback: {
                type: Boolean,
                default: false
            },
            callback: {
                type: String,
                default: null
            },
            title: {
                type: String,
                default: null
            },
            //背景色
            backgroundColor: {
                type: String,
                default: '#1a7bdd' // 1a7bdd
            },
            //字体颜色
            fontColor: {
                type: String,
                default: '#ffffff'
            },
            // 渐变背景
            transparent: {
                type: Boolean,
                default: false
            },
            //是否返回按钮
            leftArrow: {
                type: Boolean,
                default: true
            },
            // 是否底部边框
            border: {
                type: Boolean,
                default: true
            },
            //是否标题
            hastitle: {
                type: Boolean,
                default :true
            },
            //是否公园
            ispark: {
                type: Boolean,
                default :false
            }
        },
        watch:{
            transparent:{
                handler(){
                    if (this.transparent) {
                        this.style = {
                            'background': `rgba(${this.hextoRGB(this.backgroundColor)},0)`,
                            'color': this.fontColor
                        }
                    } else {
                        this.style = {
                            'background': `rgba(${this.hextoRGB(this.backgroundColor)},1)`,
                            'color': this.fontColor
                        }
                    }
                    if(this.ispark){
                        this.style['padding'] = 0;
                    }
                    this.style['padding-top']=(parseFloat(this.$store.getters.headerHeight)-44)+'px' ;
                    this.style['height']=this.$store.getters.headerHeight;

                },
                immediate: true
            }
        },
        data() {
            return {
                callbackKey: '',
                pageTitle: '',
                backgroundopacity: 1,
                style: {
                    'background': `rgba(${this.hextoRGB(this.backgroundColor)},${this.backgroundopacity})`,
                    'color': this.fontColor
                },
            }
        },
        created() {
            this.pageTitle = this.title == null ? this.$route.meta['title'] : this.title;
            if (this.needCallback && this.$utils.isEmpty(this.callback)) {
                let arr = this.$store.getters.keepArray;
                this.callbackKey = arr[arr.length - 2];
            }
        },
        mounted() {
            window.addEventListener("scroll", this.handleScroll);
        },

        destroyed() {
            window.removeEventListener("scroll", this.handleScroll);
        },
        methods: {
            // 颜色转RGB
            hextoRGB(hex) {
                if (typeof hex !== 'string') {
                    return null;
                }
                // 过滤非法输入
                if (!/^#[0-9ABCDEFabcdef]{1,6}$/.test(hex)) {
                    return null
                }
                let pureStr = hex.slice(1);
                // 处理简写形式
                if (pureStr.length === 3) {
                    // 7f7 => [7, f, 7] => [[7], [f], [7]] => [[77], [ff], [77]] => [77, ff, 77] => 77ff77
                    pureStr = [].concat(...[...pureStr].map(v => [v]).map(v => v.concat(v))).join('')
                }
                let result = [];

                for (let i = 0; i < pureStr.length; i += 2) {
                    result.push(parseInt((pureStr[i] + pureStr[i + 1]), 16));
                }
                return `${result.join(',')}`
            },
            goBack() {
                this.$nextTick(()=>{
                    if(this.data){
                        this.$refs.backbtn.dataset['callbackData']=JSON.stringify(this.data);
                    }
                    this.$refs.backbtn.click();
                });
            },
            handleScroll() {
                //获取当前页面的滚动条纵坐标位置      网页被卷去的高
                const top = document.documentElement.scrollTop || document.body.scrollTop
                if (top > 0 && this.transparent) {
                    let opacity = top / 140;
                    //小于1的没达到条件之前就是半透明状态
                    opacity = opacity > 1 ? 1 : opacity;
                    this.backgroundopacity = opacity;
                    this.$emit('update:backgroundopacity',opacity);
                    this.opacitybackground = `rgba(${this.hextoRGB(this.backgroundColor)},${this.backgroundopacity})`;
                    this.style =Object.assign(this.style,{'background-color': this.opacitybackground, color: this.fontColor});
                    this.$forceUpdate();
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .header {
        position: sticky;
        z-index: 10;
        top: 0;
        right: 0;
        left: 0;
        height: 74px;
        padding: 0 15px;
        display: flex;
        align-items: center;
        .title {
            z-index: 1;
        }

        &.botborder {
            &:after {
                position: absolute;
                box-sizing: border-box;
                content: ' ';
                pointer-events: none;
                top: -50%;
                right: -50%;
                bottom: -50%;
                left: -50%;
                transform: scale(.5);
                content: '';
                border-bottom: solid 1px #f2f2f2;
            }
        }

        // 左 - 返回键
        .header-left {
            &.van-icon-arrow-left {
                z-index: 1;
                font-size: 24px;
                margin-right: 10px;
            }
        }

        // 中 - 标题、logo、工具栏
        .header-center {
            flex: 1;
            /deep/ .header-title {
                text-align: center;
                margin-right: 34px;
                .title {
                    font-size: 17px;
                    font-weight: 500;
                    line-height: 44px;
                    display: inline-block;
                    overflow: hidden;
                    width: auto;
                    margin: 0;
                    text-overflow: ellipsis;
                }
            }
        }

        // 右
        .header-right {

        }
    }
</style>
