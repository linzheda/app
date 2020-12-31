/**
* 描述:回到头部
*
**/
<template>
    <div :class="['backtop',{'show': backTop}]" :style="styles" @click.stop="click">
        <slot>
            <div class="backtop-main"></div>
        </slot>
    </div>
</template>

<script>
    export default {
        name: "backTop",
        props: {
            distance: {
                type: Number,
                default: 200
            },
            bottom: {
                type: Number,
            },
            right: {
                type: Number,
            },
            duration: {
                type: Number,
                default: 1000
            },
            isAnimation: {
                type: Boolean,
                default: true
            },
            elId: {
                type: String,
                default: ''
            },
            zIndex: {
                type: Number,
                default: 1000
            }
        },
        data() {
            return {
                backTop: false,
                scrollEl: window
            }
        },
        mounted() {
            this.init()
        },
        activated() {
            this.init()
        },
        deactivated() {
            this.removeEventListener()
        },
        computed: {
            styles() {
                return {
                    bottom: `${this.bottom}px`,
                    right: `${this.right}px`,
                    "z-index": this.zIndex
                }
            }
        },
        methods: {
            addEventListener() {
                this.scrollEl.addEventListener("scroll", this.scrollListener, false);
                this.scrollEl.addEventListener("resize", this.scrollListener, false);
            },
            removeEventListener() {
                this.scrollEl.removeEventListener("scroll", this.scrollListener, false);
                this.scrollEl.removeEventListener("resize", this.scrollListener, false);
            },
            requestAniFrame() {
                return (
                    window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    }
                );
            },
            initCancelAniFrame() {
                let vendors = ["webkit", "moz"];
                for (
                    let x = 0;
                    x < vendors.length && !window.requestAnimationFrame;
                    ++x
                ) {
                    window.cancelAnimationFrame =
                        window[vendors[x] + "CancelAnimationFrame"] ||
                        window[vendors[x] + "CancelRequestAnimationFrame"];
                }
            },
            init() {
                if (this.elId && document.getElementById(this.elId)) {
                    this.scrollEl = document.getElementById(this.elId);
                }
                this.addEventListener();
                this.initCancelAniFrame();
            },
            scrollListener() {
                this.scrollTop = this.scrollEl.pageYOffset !== undefined ? this.scrollEl.pageYOffset : this.scrollEl.scrollTop;
                this.backTop = this.scrollTop >= this.distance;
            },
            click() {
                this.startTime = +new Date();
                this.isAnimation && this.duration > 0
                    ? this.scrollAnimation()
                    : this.scroll();
                this.$emit("click");
            },
            scrollAnimation() {
                const self = this;
                var cid = self.requestAniFrame()(function fn() {
                    var t = self.duration - Math.max(0, self.startTime - +new Date() + self.duration);
                    var y = (t * -self.scrollTop) / self.duration + self.scrollTop;
                    self.scroll(y);
                    cid = self.requestAniFrame()(fn);
                    if (t == self.duration || y == 0) {
                        window.cancelAnimationFrame(cid);
                    }
                });
            },
            scroll(y = 0) {
                if (this.scrollEl === window) {
                    window.scrollTo(0, y);
                } else {
                    this.scrollEl.scrollTop = y;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .backtop {
        display: none;
        line-height: 0;
        position: fixed;
        cursor: pointer;
        bottom: 60px;
        right: 20px;
        z-index: 1000;

        &.show {
            display: block;
        }

        &-main {
            transition: all .2s ease-in-out;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, .8) url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MSIgaGVpZ2h0PSI3MyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMzIzMjMyIiBkPSJNNDIuNTI3IDQ1YTY5LjQxMyA2OS40MTMgMCAwIDEtLjYzOCAyLjIyOWMtLjQ2OSAxLjQ1OS0xLjA2MSAzLjUzLTEuODEzIDUuMjk0YTEyLjAxIDEyLjAxIDAgMCAxIDMuODU1IDcuNjM2Yy4wMjcuMTEzLjA2OS4yMi4wNjkuMzQxdjNhMS41IDEuNSAwIDAgMS0zIDB2LTIuMDUzYTguOTA3IDguOTA3IDAgMCAwLTIuNTE2LTYuMjI3Yy0uNDUzLjQ4MS0uOTQ1Ljc4LTEuNDg0Ljc4aC03LjVhMS41IDEuNSAwIDAgMSAwLTNoNS42MzVjMi4wMTQgMCAzLjI3Ni01LjExMSA0LjA5Ny03LjgzMUM0MC4yODQgNDEuNDc4IDQxIDM4LjI2MSA0MSAzMi4wMTggNDEgMTUuOTkyIDI1LjUgNCAyNS41IDRTMTAgMTUuOTkyIDEwIDMyLjAxOGMwIDcuNDE0LjgzOCAxMi45NDYuODM4IDEyLjk0NkMxMS4zMDkgNDcuNDMgMTIuNzEzIDUzIDE1LjAyNyA1M0gyMS41YTEuNSAxLjUgMCAwIDEgMCAzSDEzYy0uNTEgMC0uOTgyLS4yMTUtMS40MTgtLjU3OUE4LjQ1NiA4LjQ1NiAwIDAgMCA5IDYxLjV2MmExLjUgMS41IDAgMCAxLTMgMHYtM2MwLS4yMTEuMDQ1LS40MTEuMTI0LS41OTNhMTEuNDczIDExLjQ3MyAwIDAgMSAzLjczNy02Ljk3NkM4LjkyNSA1MC45NSA4LjMwMSA0OC40NzkgOCA0N2MwIDAtLjExNi0uNzI5LS4yNjktMkgwbDctMTVoLjEzMUM4LjcwOCAxMy4yMiAyNS41IDAgMjUuNSAwczE2Ljc5MiAxMy4yMiAxOC4zNjkgMzBINDRsNyAxNWgtOC40NzN6TTcuMTE4IDM3LjQ2Mkw1IDQyaDIuNDIxYTEwOC42MzYgMTA4LjYzNiAwIDAgMS0uMzAzLTQuNTM4em0zNi43MTItLjExMmE0MC40NjYgNDAuNDY2IDAgMCAxLS42MTEgNC42NUg0NmwtMi4xNy00LjY1ek0xNi41IDYwYTEuNSAxLjUgMCAwIDEgMS41IDEuNXYxMGExLjUgMS41IDAgMCAxLTMgMHYtMTBhMS41IDEuNSAwIDAgMSAxLjUtMS41ek0xOCAzMS41YTcuNSA3LjUgMCAxIDEgMTUgMCA3LjUgNy41IDAgMCAxLTE1IDB6bTEyIDBhNC41IDQuNSAwIDEgMC05IDAgNC41IDQuNSAwIDAgMCA5IDB6TTI1LjUgNDlhMS41IDEuNSAwIDAgMSAxLjUgMS41djE2YTEuNSAxLjUgMCAwIDEtMyAwdi0xNmExLjUgMS41IDAgMCAxIDEuNS0xLjV6bTkgMTFhMS41IDEuNSAwIDAgMSAxLjUgMS41djEwYTEuNSAxLjUgMCAwIDEtMyAwdi0xMGExLjUgMS41IDAgMCAxIDEuNS0xLjV6Ii8+PC9zdmc+") no-repeat center;
            background-size: 17px 24px;
            border-radius: 50%;
            box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);

            &:active {
                opacity: .8;
            }
        }
    }
</style>

