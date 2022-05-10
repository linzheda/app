/**
* 描述:点图定位
*
**/
<template>
    <van-popup v-model="showCurrent" get-container="body" position="bottom" :style="{ height: '100%' }">
        <div class="header-btn">
            <span type="primary" class="cancel-btn" @click="showCurrent=false">取消</span>
            <van-button type="primary" class="sub-btn" size="small" @click="clickSubmit">确认</van-button>
        </div>

        <div class="map">
            <el-amap ref="map" :vid="vid" :amap-manager="amapManager"
                     :zoom="zoom" :plugin="plugin"
                     :center="center" :events="events">
            </el-amap>
        </div>
        <div class="pois">
            <div class="search">
                <van-icon name="search"/>
                <input placeholder="搜索地点" type="text" id="tipinput" :style="{'width':!showTips?'100%':'85%'}"
                       @focus="showTips=true">
                <span class="qx" v-show="showTips" @click="clickQxSearch">取消</span>
            </div>
            <div class="select-list">
                <ul v-if="showTips">
                    <li v-for="(item,index) of tips" :key="'tips'+index" @click="clickTips(index)">
                        {{item.name}}
                        <p>{{item.address}}</p>
                        <van-icon name="success" v-show="index===tipsIndex"/>
                    </li>
                </ul>
                <ul v-else>
                    <li v-for="(item,index) of pois" :key="index" @click="clickPoi(index)">
                        {{item.name}}
                        <p>{{item.address}}</p>
                        <van-icon name="success" v-show="index===poisIndex"/>
                    </li>
                </ul>
            </div>
        </div>
    </van-popup>
</template>

<script>
    import {AMapManager, lazyAMapApiLoaderInstance} from 'vue-amap';

    let amapManager = new AMapManager();//地图管理器
    export default {
        name: "mapLocation",
        props: {
            is84: {
                type: Boolean,
                default: true
            },//是否要84坐标系
        },
        data() {
            let self = this;
            return {
                vid:'amapDemo'+Math.ceil(Math.random()*10),
                showCurrent: false,
                amapManager,//地图管理器
                center: [119.300864, 26.082801],//中心点
                zoom: 16,//层级
                events: {
                    init() {//地图初始化
                        lazyAMapApiLoaderInstance.load().then(() => {
                            self.startDrag();
                        });
                    },
                },//地图事件
                plugin: [
                    {
                        pName: 'Geolocation',//定位插件
                        timeout: 10000,//超过10秒后停止定位，默认：无穷大
                        zoomToAccuracy: true,//定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        // useNative:true,//是否使用安卓定位sdk用来进行定位，默认：false
                        buttonPosition: 'RB',//定位按钮可停靠的位置
                        events: {
                            init(o) {
                                // o 是高德地图定位插件实例
                                o.getCurrentPosition((status, result) => {
                                    if (result && result.position) {
                                        let lng = result.position.lng;
                                        let lat = result.position.lat;
                                        console.log([lng, lat]);
                                        // self.center = [lng, lat];
                                        self.$nextTick();
                                    }
                                })
                            }
                        }
                    },
                    {
                        pName: 'Autocomplete',
                        input: "tipinput",
                        city: '福州',
                        outPutDirAuto: false,
                        events: {
                            select(e) {
                                let lng = e['poi']['location']['lng'];
                                let lat = e['poi']['location']['lat'];
                                self.amapManager.getMap().panTo([lng, lat]);
                                self.$nextTick()
                            },
                            complete(AutocompleteResult) {
                                self.tipsIndex = 0;
                                self.tips = AutocompleteResult.tips;
                                self.$forceUpdate();
                            }
                        }

                    }
                ],//插件
                pois: [],//推荐点
                tips: [],//搜索推荐点
                showTips: false,//显示搜索推荐点
                isUpdatePois: true,//是否可以更新推荐点
                poisIndex: 0,//选中poi的下标
                tipsIndex: 0,//选中tip的下标

            }
        },
        created() {

        },
        methods: {
            //开启拖拽选址
            startDrag() {
                let map = this.amapManager.getMap();
                // eslint-disable-next-line no-undef
                AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
                    let positionPicker = new PositionPicker({
                        mode: 'dragMap',
                        map: map,
                        iconStyle: {//自定义外观
                            url: require('@/assets/images/pub/map-pin.png'),//图片地址
                            size: [24, 48],  //要显示的点大小，将缩放图片
                            ancher: [12, 48],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
                        }
                    });
                    positionPicker.on('success', (positionResult) => {
                        if (this.isUpdatePois) {
                            if (positionResult.regeocode.aois && positionResult.regeocode.aois.length > 0) {
                                this.pois = [{
                                    name: positionResult.address,
                                    address: positionResult.address,
                                    location: positionResult.position
                                }];
                            } else {
                                this.pois = [];
                            }
                            this.pois = this.pois.concat(positionResult.regeocode.pois);
                            this.poisIndex = 0;
                            this.isUpdatePois = false;
                            this.$forceUpdate();

                        }
                        this.$nextTick(() => {
                            this.isUpdatePois = true;
                        });
                    })
                    positionPicker.on('fail', function (failResult) {
                        console.log(failResult)
                    })
                    positionPicker.start();
                });

            },
            //点击poi
            clickPoi(i) {
                this.poisIndex = i;
                let lng = this.pois[i].location.lng;
                let lat = this.pois[i].location.lat;
                this.isUpdatePois = false;
                this.amapManager.getMap().panTo([lng, lat]);
            },
            //点击tips
            clickTips(i) {
                this.tipsIndex = i;
                console.log(this.tips[i]);
                let lng = this.tips[i].location.lng;
                let lat = this.tips[i].location.lat;
                this.isUpdatePois = false;
                this.amapManager.getMap().panTo([lng, lat]);
            },
            //点击取消搜索
            clickQxSearch() {
                document.getElementById("tipinput").value = "";
                this.showTips = false;
            },
            //点击确认
            clickSubmit() {
                let temp = this.showTips ? this.tips[this.tipsIndex] : this.pois[this.poisIndex];
                let lng = temp['location']['lng'];
                let lat = temp['location']['lat'];
                if (this.is84) {
                    let position = this.$gis.gcj_decrypt(lat,lng);
                    lng = position.lon;
                    lat = position.lat;
                }
                let data = {
                    lng: lng,
                    lat: lat,
                    address: temp['name']||temp['address']
                };
                this.$emit("result", data);
                this.showCurrent = false;
            }
        }
    }
</script>

<style scoped lang="less">
    .map {
        width: 100%;
        height: 60vh;
    }

    .header-btn {
        position: fixed;
        z-index: 99;
        top: 0;
        width: 100vw;
        display: block;
        padding: 30px 15px 20px;
        background: rgba(255, 255, 255, 0.2);

        .cancel-btn {
            float: left;
            font-size: 18px;
            color: #999999;
        }

        .sub-btn {
            float: right;
            padding: 0 10px;
            border-radius: 5px;

        }
    }

    .pois {
        width: 100%;
        height: 40vh;
        overflow-y: scroll;
        position: relative;

        .search {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 10px;

            input {
                width: 100%;
                background: #EDEDED;
                font-size: 16px;
                padding: 5px 5px 5px 30px;
                border: none;
                border-radius: 5px;
                z-index: 1;
                display: block;
            }

            .qx {
                position: absolute;
                right: 20px;
                top: calc(50% - 7px);
                font-size: 14px;
                color: #1a7bdd;
                z-index: 2;
            }

            .van-icon {
                position: absolute;
                left: 18px;
                top: calc(50% - 9px);
                font-size: 18px;

            }

        }

        .select-list {
            position: absolute;
            top: 50px;
            bottom: 0;
            width: 100%;
            overflow-y: scroll;

            ul {
                width: 100%;

                li {
                    font-size: 18px;
                    padding: 10px 30px 10px 10px;
                    border-bottom: 1px solid #efeeee;
                    position: relative;

                    p {
                        font-size: 12px;
                        color: #999999;
                    }

                    .van-icon {
                        position: absolute;
                        color: #1bcd23;
                        font-size: 20px;
                        right: 10px;
                        top: calc(50% - 10px);
                    }
                }
            }

        }
    }


</style>