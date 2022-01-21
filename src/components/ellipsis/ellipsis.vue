/**
* 描述:  省略 组件 多行溢出折叠
*
**/
<template>
    <div class="ellipsis-c">
        <div v-show="!btnShow">
            <div class="shadow">
                <textarea :rows="rows" readonly></textarea>
                <div class="shadow-box" ref="box">
                    {{ showContent }}
                    <template>
                        {{ ellipsisText }}
                        <span class="ellipsis-btn">
                            <slot name="expand">
                                <template v-if="showStyle==='text'">
                                {{expandBtnText}}
                                </template>
                                <template v-if="showStyle==='icon'">
                                    <van-icon name="arrow-down" />
                                </template>
                            </slot>
                        </span>
                    </template>

                    <span ref="tail"></span>
                </div>
            </div>
            <div class="real-box">
                {{ showContent }}
                <template v-if="(textLength < content.length) || btnShow">
                    {{ ellipsisText }}
                    <span class="ellipsis-btn" @click.stop="clickBtn">
                        <slot name="expand">
                             <template v-if="showStyle==='text'">
                                {{expandBtnText}}
                             </template>
                            <template v-if="showStyle==='icon'">
                                <van-icon name="arrow-down" />
                            </template>
                        </slot>
                    </span>
                </template>

            </div>
        </div>
        <div class="ellipsis-content" v-show="btnShow">
            {{ showContent }}
            <span class="ellipsis-btn" style="float: right" @click.stop="clickBtn">
                <slot name="collapse">
                    <template v-if="showStyle==='text'">
                         {{collapseBtnText}}
                    </template>
                    <template v-if="showStyle==='icon'">
                        <van-icon name="arrow-up"/>
                    </template>
                </slot>
            </span>
        </div>
    </div>
</template>

<script>
    import resizeObserver from 'element-resize-detector'

    const observer = resizeObserver()
    export default {
        name: "ellipsis",
        props: {
            content: {
                type: String,
                default: ''
            },//内容
            showStyle: {
                type: String,
                default: 'text'
            },//显示风格 text 文字  icon  图标 自定义的话 用插槽
            expandBtnText: {
                type: String,
                default: '展开'
            },//展开 文字描述
            collapseBtnText: {
                type: String,
                default: '收起'
            },//收起 文字描述
            ellipsisText: {
                type: String,
                default: '...'
            },// ... 展位
            rows: {
                type: Number,
                default: 1
            },//显示几行
        },
        data() {
            return {
                textLength: 0,
                beforeRefresh: null,
                boxWidth: 0,
                boxHeight: 0,
                btnShow: false,
            }
        },
        computed: {
            showContent() {
                // const length = this.beforeRefresh ? this.content.length : this.textLength
                return this.content.substr(0, this.textLength)
            },
            watchData() {
                return [this.content, this.expandBtnText, this.ellipsisText, this.rows, this.btnShow]
            }
        },
        watch: {
            watchData: {
                immediate: true,
                handler() {
                    this.refresh()
                }
            },
        },
        mounted() {
            observer.listenTo(this.$refs.box, (el) => {
                if (el.offsetWidth === this.boxWidth && el.offsetHeight === this.boxHeight) return
                this.boxWidth = el.offsetWidth
                this.boxHeight = el.offsetHeight
                this.refresh()
            })
        },
        beforeDestroy() {
            observer.uninstall(this.$refs.box)
        },
        methods: {
            refresh() {
                this.beforeRefresh && this.beforeRefresh()
                let stopLoop = false
                this.beforeRefresh = () => stopLoop = true
                this.textLength = this.content.length
                const checkLoop = (start, end) => {
                    if (stopLoop || start + 1 >= end) {
                        this.beforeRefresh = null;
                    } else {
                        const boxRect = this.$refs.box.getBoundingClientRect()
                        const tailRect = this.$refs.tail.getBoundingClientRect()
                        const overflow = tailRect.bottom > boxRect.bottom
                        overflow ? (end = this.textLength) : (start = this.textLength)
                        this.textLength = Math.floor((start + end) / 2)
                        this.$nextTick(() => checkLoop(start, end))
                    }

                }
                this.$nextTick(() => checkLoop(0, this.textLength))
            },
            clickBtn() {
                this.btnShow = !this.btnShow;
                // this.$emit('click-btn',  this.btnShow)
            },
        }
    }
</script>

<style scoped lang="less">
    .ellipsis-c {
        text-align: left;
        position: relative;
        line-height: 1.5;

        .shadow {
            width: 100%;
            display: flex;
            pointer-events: none;
            opacity: 0;
            user-select: none;
            position: absolute;
            outline: green solid 1px;
        }

        textarea {
            border: none;
            flex: auto;
            padding: 0;
            resize: none;
            overflow: hidden;
            font-size: inherit;
            line-height: inherit;
            outline: none;
        }

        .shadow-box {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }

        .ellipsis-btn {
            cursor: pointer;
            text-decoration: underline;
            color: #4791ff;
        }
    }
</style>