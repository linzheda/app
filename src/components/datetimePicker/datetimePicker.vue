/**
* 描述: 时间选择控件
*
**/
<template>
    <div class="datetimePicker">
        <input type="text" readonly v-model="result" @focus="isShowDate=true">
        <van-popup v-model="isShowDate" position="bottom">
            <van-datetime-picker
                    v-model="currentDate"
                    :type="type"
                    :title="title"
                    :min-date="minDateTime"
                    :max-date="maxDateTime"
                    @confirm="confirm"
                    @cancel="cancel"
            />
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: "datetimePicker",
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
                default: null
            },
            /**
             * 类型    时间类型，可选值为 date time year-month month-day datehour 默认datetime
             */
            type: {
                type: String,
                default: 'datetime'
            },
            /**
             *  标题
             * */
            title: {
                type: String,
                default: '选择时间'
            },
            /**
             * 最小时间 默认值10年前
             */
            minDate: {
                type: Date,
                default: null
            },
            /**
             * 最大时间  默认值10年后
             */
            maxDate: {
                type: Date,
                default: null
            }
        },
        data() {
            return {
                result: this.inputValue,//返回的结果
                currentDate: this.inputValue,//当前日期
                isShowDate: false,//是否显示日期插件
                minDateTime: this.$utils.addMonth(new Date(), -12 * 10),//是否显示日期插件
                maxDateTime: this.$utils.addMonth(new Date(), 12 * 10),//是否显示日期插件
                fmt: 'yyyy-MM-dd hh:mm',//日期格式
            }
        },
        created() {
            this.minDateTime = this.minDate == null ? this.$utils.addMonth(new Date(), -12 * 10) : this.minDate;
            this.maxDateTime = this.maxDate == null ? this.$utils.addMonth(new Date(), 12 * 10) : this.maxDate;
            let fmt = 'yyyy-MM-dd hh:mm';
            switch (this.type) {
                case 'date':
                    fmt = 'yyyy-MM-dd';
                    break;
                case 'year-month':
                    fmt = 'yyyy-MM';
                    break;
                case 'month-day':
                    fmt = 'MM-dd';
                    break;
                case 'time':
                    fmt = 'hh:mm';
                    break;
                case 'datetime':
                    fmt = 'yyyy-MM-dd hh:mm';
                    break;
            }
            this.fmt = fmt;
            this.currentDate = this.$utils.parserDate(this.inputValue);
        },
        mounted() {
        },
        methods: {
            // 点击确定
            confirm() {
                this.isShowDate = false;
                this.result = this.$utils.getDate(this.currentDate, this.fmt);
                this.$emit('input', this.result);
            },
            // 点击取消
            cancel() {
                this.isShowDate = false;
                this.currentDate = this.$utils.parserDate(this.inputValue);
            },
        }
    }
</script>

<style scoped lang="less">
    .datetimePicker {
        display: inline-block;
        width: auto;
        height: auto;

        input {
            border: none;
            height: 100%;
            width: 100%;
            font-size: 16px;
        }
    }
</style>