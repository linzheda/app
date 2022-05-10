/**
* 描述: 时间选择控件
*
**/
<template>
    <div class="datetimePicker">
        <van-field readonly v-if="isField" :label="fieldLabel" :placeholder="'请选择'+fieldLabel"
                   :required="isFieldRequired" right-icon="calendar-o" v-model="result"
                   @click.stop.prevent="isShowDate = true"/>
        <input class="my-input" type="text" v-else readonly v-model="result" @focus.stop.prevent="isShowDate = true">
        <van-popup v-model="isShowDate" position="bottom">
            <template v-if="type==='year'||type==='month'">
                <van-picker
                        :title="title"
                        :default-index="pickerDefaultIndex"
                        show-toolbar
                        :columns="pickerColumns"
                        @confirm="pickerConfirm"
                        @cancel="cancel"
                />
            </template>
            <template v-else>
                <van-datetime-picker
                        v-model="currentDate"
                        :type="type"
                        :title="title"
                        :min-date="minDateTime"
                        :max-date="maxDateTime"
                        @confirm="confirm"
                        @cancel="cancel"
                />
            </template>
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: "datetimePicker",
        model: {
            prop: 'modelVal',
            event: 'change'
        },
        props: {
            modelVal: {
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
            },
            //是否有默认值
            isDefault: {
                type: Boolean,
                default: true
            },
            //是否是输入框
            isField: {
                type: Boolean,
                default: false
            },
            isFieldRequired: {
                type: Boolean,
                default: false
            }, //是否是必须的
            //field 的文本
            fieldLabel: {
                type: String,
                default: '时间选择'
            }
        },
        computed: {
            result: function () {
                let result = '';
                if (this.modelVal) {
                    result = this.type !== 'year' && this.type !== 'month' ? this.$utils.getDate(this.currentDate, this.fmt) : this.currentDate;
                } else if (this.isDefault) {
                    result = this.type !== 'year' && this.type !== 'month' ? this.$utils.getDate(null, this.fmt) : this.currentDate;
                }
                return result;
            },
            pickerColumns: function () {
                let arr = [];
                if (this.type === 'year') {
                    let min = parseInt(this.$utils.dateFormat(this.minDateTime, this.fmt));
                    let max = parseInt(this.$utils.dateFormat(this.maxDateTime, this.fmt));
                    for (let i = min; i <= max; i++) {
                        arr.push(i+'');
                    }
                } else if (this.type === 'month') {
                    arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
                }
                return arr;
            },
            pickerDefaultIndex: function () {
                let index = this.pickerColumns.findIndex(i => {
                    return i === this.result;
                });
                return index;
            }
        },
        data() {
            return {
                currentDate: null,//当前日期
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
                case 'year':
                    fmt = 'yyyy';
                    break;
                case 'month':
                    fmt = 'MM';
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
                case 'alltime':
                    fmt = 'yyyy-MM-dd hh:mm:ss';
                    break;
            }
            this.fmt = fmt;
            this.currentDate = this.type !== 'year' && this.type !== 'month' ? this.$utils.parserDate(this.modelVal) : this.modelVal;
        },
        mounted() {
        },
        methods: {
            // 点击确定
            confirm() {
                this.isShowDate = false;
                this.$nextTick(() => {
                    this.$emit('change', this.result);
                });
            },
            // 点击取消
            cancel() {
                this.isShowDate = false;
                if( this.type !== 'year' && this.type !== 'month' ){
                    this.currentDate = this.$utils.parserDate(this.modelVal);
                }
            },
            //选择器确认
            pickerConfirm(value) {
                this.isShowDate = false;
                this.currentDate = value;
                this.$nextTick(() => {
                    this.$emit('change', this.result);
                });
            },
        }
    }
</script>

<style scoped lang="less">
    .datetimePicker {
        display: inline-block;
        width: auto;
        height: auto;
        text-align: left;

        .my-input {
            border: none;
            height: 100%;
            width: 100%;
            font-size: 16px;
        }
    }
</style>