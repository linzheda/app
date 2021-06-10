/**
* 描述: 区划选择
*
**/
<template>
    <div class="areaSelect">
        <van-field readonly  v-if="isField" :label="fieldLabel"  :placeholder="'请选择'+fieldLabel" :required="isFieldRequired"
                   right-icon="arrow" v-model="showAreaName" @click="clickShowSelect"/>
        <div class="area-select-text" v-else @click="clickShowSelect()">
            <span>{{showAreaName||'请选择'}}</span>
        </div>
        <van-popup v-model="isShowOverlay" position="bottom" round closeable close-icon-position="top-left" :style="{ height: '80%' }">
            <div class="select-div">
                <div class="header">
                    <h4>请选择所在区域</h4>
                    <van-icon name="success" class="header-btn" v-if="(limitRank!=null&&selected_list.length===limitRank)||limitRank==null"
                              @click="returnResult()" />
                </div>
                <div class="selected-list">
                    <div v-for="(item,i) of selected_list" :key="i"
                         :class="{'on':selected_index===i}"
                         @click="getAreaListByPid(item.parentid,i)">
                        {{item.areaname}}
                    </div>
                    <div v-if="(limitRank==null&&selected_list.length<5&&isShowQXZ)
                    ||((limitRank!=null&&selected_list.length<limitRank&&isShowQXZ))"
                         :class="{'on':selected_index===selected_list.length}"
                         @click="getAreaListByPid(selected_list[selected_list.length-1]['id'],selected_list.length)">
                        请选择
                    </div>
                </div>
                <div class="select-list">
                    <ul>
                        <li v-for="(item,i) of  select_list" :key="'a'+i"
                            :class="{'on':item.isOk}"
                            @click="clickSelectItem(item)">
                            {{item.areaname}}
                        </li>
                    </ul>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: "areaSelect",
        model: {
            prop: 'inputValue',
            event: 'input'
        },
        props: {
            inputValue: {
                type: String,
                default: null
            },//当前输入的值
            areacode: {
                type: String,
                default: null
            },//区划
            limitRank: {
                type: Number,
                default: null
            },//要限制的区划等级
            limitSelectUp: {
                type: Boolean,
                default: true
            },// 不能选择上级
            readonly: {
                type: Boolean,
                default: false
            },//只读
            isField:{
                type:Boolean,
                default:false
            }, //是否是输入框
            isFieldRequired:{
                type:Boolean,
                default:false
            }, //是否是必须的
            fieldLabel:{
                type:String,
                default:'所属区划'
            }//field 的文本

        },
        data() {
            return {
                initialAreaCode: null,//最初始的areacode
                selectUpLimitRank: null,//
                selected_list: [],//选中的列表
                selected_index: null,//选中的列表
                select_list: [],//可供选择的列表
                isShowOverlay: false,//是否显示选择面板
                isShowQXZ: true,//是否显示请选择
                result: null,//返回结果
            }
        },
        computed: {
            showAreaName: function () {
                return this.selected_list.length > 0 ? this.selected_list[this.selected_list.length - 1].areaname : '';
            }
        },
        created() {
            this.initialAreaCode = this.areacode;
            if (this.$utils.isNotEmpty(this.initialAreaCode)) {
                this.getPAreaListByCode(this.initialAreaCode);
            }
        },
        methods: {
            //根据区划编码 获取该区划以及他的上级
            getPAreaListByCode(areacode) {
                let paramJson = {
                    areacode: areacode
                };
                this.$http.post("jfs/api/pubCtr/getPAreaListByCode", paramJson).then(res => {
                    this.selected_list = res['data'];
                    this.selected_index = this.selected_list.length - 1;
                    if (this.selected_list.length > 0) {
                        if (this.limitSelectUp) {
                            this.selectUpLimitRank = this.selected_list[this.selected_index]['rank'];
                        }
                        if ((this.limitRank != null && this.selected_list.length < this.limitRank) || this.limitRank == null) {
                            this.getAreaListByPid(this.selected_list[this.selected_index]['id'], this.selected_index + 1);
                        } else {
                            this.getAreaListByPid(this.selected_list[this.selected_index]['id'], this.selected_index);
                        }
                    }
                });
            },
            //根据pid 获取 选择的列表
            getAreaListByPid(pid, i = null) {
                if (this.selectUpLimitRank != null && i != null && this.limitSelectUp) {
                    if ((i + 1) <= this.selectUpLimitRank) {
                        this.$toast.fail("没有选择上一级的权限");
                        return;
                    }
                }
                if (i != null) {
                    this.selected_index = i;
                }
                let paramJson = {
                    parentid: pid
                };
                this.$http.post("jfs/api/pubCtr/getAreaListByPid", paramJson).then(res => {
                    let data = res['data'];
                    if (data != null && data.length > 0) {
                        this.isShowQXZ = true;
                        this.select_list = data;
                        this.select_list.forEach(item => {
                            if (this.selected_index < this.selected_list.length
                                && item['id'] == this.selected_list[this.selected_index]['id']) {
                                item['isOk'] = true;
                            } else {
                                item['isOk'] = false;
                            }
                        });
                        if (i == null) {
                            this.selected_index++;
                        }
                    } else {
                        this.isShowQXZ = false;
                    }
                });
            },
            //点击显示
            clickShowSelect() {
                if (this.readonly) {
                    return;
                }
                this.isShowOverlay = true;
                if (this.initialAreaCode == null && this.selected_list.length === 0) {
                    this.getAreaListByPid(null, 0);
                } else if (this.limitRank != null && this.selected_list.length < this.limitRank) {
                    this.getAreaListByPid(this.selected_list[this.selected_list.length - 1]['id'], this.selected_list.length);
                } else if (this.limitRank == null && this.selected_list.length < 5) {
                    this.getAreaListByPid(this.selected_list[this.selected_list.length - 1]['id'], this.selected_list.length);
                }
            },
            //点击选择
            clickSelectItem(item) {
                this.selected_list[this.selected_index] = item;
                this.selected_list.splice(this.selected_index + 1, this.selected_list.length - this.selected_index - 1);
                this.select_list.forEach(item => {
                    if (item['id'] === this.selected_list[this.selected_index]['id']) {
                        item['isOk'] = true;
                    } else {
                        item['isOk'] = false;
                    }
                });

                if (this.selected_list.length === this.limitRank || this.selected_list.length === 5) {
                    this.returnResult();
                } else {
                    this.getAreaListByPid(this.selected_list[this.selected_index]['id']);
                }
            },
            //返回结果
            returnResult() {
                this.isShowOverlay = false;
                let result = this.selected_list[this.selected_list.length - 1];
                this.$emit('input', result['areacode']);
                this.$emit('result', result);
            }
        }
    }
</script>

<style scoped lang="less">
    .van-popup--bottom.van-popup--round {
        border-radius: 15px 15px 0 0;
    }
    .area-select-text {
        display: inline-block;
        width: 100%;
        font-size: 14px;
        text-align: center;
        white-space: nowrap;
    }

    .select-div {
        /*头部*/
        .header {
            h4 {
                display: inline-block;
                margin: 15px 0;
                font-size: 16px;
                text-align: center;
                width: 100%;
            }
            border-bottom:1px solid #eeeeee;
        }

        /*确定按钮*/
        .header-btn {
            font-size: 22px;
            position: absolute;
            right: 20px;
            top: 15px;
            color: #c8c9cc;
        }

        /*选中的li*/

        .selected-list {
            display: flex;
            padding: 10px 25px;
            font-size: 14px;
            border-bottom: 1px solid #eeeeee;

            div {
                flex: 1;
            }

            .on {
                color: #0D9BF2;
            }
        }

        /*选择列表*/

        .select-list {
            position: absolute;
            left: 25px;
            right: 0;
            top: 90px;
            bottom: 0;
            overflow-y: scroll;
            font-size: 14px;

            ul {
                padding-top: 10px;

                li {
                    list-style: none;
                    height: 35px;
                    text-align: justify;
                    padding-left: 5px;
                }

                li.on:before {
                    vertical-align: middle;
                    font-family: 'vant-icon';
                    content: '\F0C8';
                    font-size: 20px;
                    font-weight: 400;
                    color: #0D9BF2;
                }

            }

        }


    }
</style>