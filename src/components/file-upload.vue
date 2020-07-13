<template>
    <div class="file-upload">
        <input type="file" style="display: none" ref="fileUpload" :accept="accept" multiple @change="uploadCheck()">
        <!--文本-->
        <div class="eui-uploaderTxt">
            <div class="tt" v-if="showStyle===2&&(pics.length+files.length)<limitnum">
                {{title}}
                <span @click="clickUpload">上传附件</span>
            </div>
            <!-- 缩类图-->
            <div class="eui-uploader">
                <div class="eui-uploader-preview" v-for="(item,index) in pics" :key="index">
                    <img :src="baseUrl+item.id" :onerror="noPic" alt="" class="img">
                    <svg-icon icon-class="del" class="icon-del" v-if="showStyle>0" @click="deleteFileById(index,1)"></svg-icon>
                </div>
                <div class="eui-uploader-btn" v-if="showStyle===1&&pics.length<limitnum" @click="clickUpload">
                    <svg-icon icon-class="camera" class="icon-add"></svg-icon>
                </div>
            </div>
            <ul>
                <li v-for="(item,index) in files" :key="index">
                    <h3>{{item.filename}}</h3>
                    <svg-icon icon-class="del"  v-if="showStyle===2" @click="deleteFileById(index,2)"/>
                </li>
            </ul>
        </div>
        <!--上传文件选择-->
        <van-action-sheet
                description="请选择要上传的文件类型"
                v-model="selectActionShow"
                :actions="selectAction"
                @select="onSelectAction"
                cancel-text="取消"
                @cancel="onCancelActionSheet"
        />
    </div>
</template>

<script>
    import {Dialog} from 'vant';

    export default {
        name: "file-upload",
        props: {
            limitnum: {//限制上传个数  默认20
                type: Number,
                default: 20
            },
            limittype: {//限制文件上传的类型
                type: String,
                default: null
            },
            attachids: {//附件id集合,隔开
                type: String,
                default: null
            },
            type: {//上传文件格式 0图片 1 视频  2 音频文件  3文件  -1  选择
                type: Number,
                default: 3
            },
            showStyle: {//0单纯的展示不可上传  1纯图片(上传一般只能是图片)  2文件(上传的可以是图片 可以是附件)
                type: Number,
                default: 0
            },
            title: {//标题
                type: String,
                default: '附件上传'
            },
            realDeleteFile: {//是否真的删除文件   false的话  只清楚当前组件的文件
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                AllowImgFileSize: 20971520, //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过20M上传失败
                baseUrl: process.env.BASE_URL + 'attachment/attachmentCtr/getFileById?isThumb=true&id=',
                picsAttach: '',//图片的ids
                accept: 'application/*,image/*,video/*,text/*,audio/*',//上传的文件格式
                selectActionShow: false,//是否显示选择的上拉菜单
                selectAction: [
                    {name: '图片'},
                    {name: '视频'},
                    {name: '音频'},
                    {name: '文件'}
                ],//选择的上拉菜单的选项
                pics: [],//图片集合
                files: [],//文件路径
                noPic:'this.src="' + require('@/assets/global-images/imgbreakdown.png') +'"',//图片无法显示
            }
        },
        created() {
            this.getAttachmentByIds();
        },
        methods: {
            getAttachmentByIds() {//获取附件集合 根据ids
                if (this.attachids != '' && this.attachids != null) {
                    let paramJson = {
                        ids: this.attachids
                    };
                    this.$http.post('attachment/attachmentCtr/getAttachmentByIds', paramJson).then(
                        res => {
                            if (res.code == 200) {
                                this.files = res.data.docs;
                                this.pics = res.data.pics;
                                this.retIdsFromFiles();
                            } else {
                                Dialog.alert({
                                    title: '温馨提示',
                                    message: "出错了..."
                                });
                            }
                        });
                }
            },
            clickUpload() {//点击上传
                if (this.showStyle == 1) {
                    this.accept = 'image/*';
                    this.$nextTick(() => {
                        this.$refs.fileUpload.click();
                    });
                } else if (this.showStyle == 2) {
                    if (this.type == -1) {
                        this.selectActionShow = true;
                    } else {
                        switch (this.type) {
                            case 0:
                                this.accept = 'image/*';
                                break;
                            case 1:
                                this.accept = 'video/*';
                                break;
                            case 2:
                                this.accept = 'audio/*';
                                break;
                            case 3:
                                this.accept = 'application/*,image/*,video/*,text/*,audio/*';
                                break;
                            default:
                                break;
                        }
                        this.$nextTick(() => {
                            this.$refs.fileUpload.click();
                        });
                    }
                }
            },
            uploadCheck() {//上传前的校验
                let myfile = this.$refs.fileUpload.value;
                // eslint-disable-next-line no-useless-escape
                let filename = myfile.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1");//获取文件名
                let filetype = myfile.substring(myfile.lastIndexOf(".") + 1, myfile.length);
                if(myfile.lastIndexOf(".")>0){
                    filetype = myfile.substring(myfile.lastIndexOf(".") + 1, myfile.length);
                    this.uploadFile(filetype,filename);
                }else {
                    let temp = this.$refs.fileUpload.files[0];
                    this.checkFileType(temp).then(res => {
                        filetype = res;
                        if (filetype == false) {
                            let typetemp = temp.type;
                            if (typetemp.indexOf("image") > -1) {
                                filetype = 'jpg';
                            } else if (typetemp.indexOf("audio") > -1) {
                                filetype = 'mp3';
                            } else if (typetemp.indexOf("video") > -1) {
                                filetype = 'mp4';
                            } else {
                                Dialog.alert({
                                    title: '温馨提示',
                                    message: "文件类型无法识别"
                                });
                                return;
                            }
                        }
                        this.uploadFile(filetype, filename);
                    });
                }
            },

            checkFileType(file,type='jpg') {//当上传文件没有后缀名是采用从二进制中获取文件名
                // 如果系统无法获取文件类型，则读取二进制流，对二进制进行解析文件类型
                return new Promise((resolve)=>{
                    let imgType = [
                        'ff d8 ff', //jpg
                        '89 50 4e', //png
                        '0 0 0 14 66 74 79 70 69 73 6F 6D', //mp4
                        '0 0 0 18 66 74 79 70 33 67 70 35', //mp4
                        '0 0 0 0 66 74 79 70 33 67 70 35', //mp4
                        '0 0 0 0 66 74 79 70 4D 53 4E 56', //mp4
                        '0 0 0 0 66 74 79 70 69 73 6F 6D', //mp4
                        '0 0 0 18 66 74 79 70 6D 70 34 32', //m4v
                        '0 0 0 0 66 74 79 70 6D 70 34 32', //m4v
                        '0 0 0 14 66 74 79 70 71 74 20 20', //mov
                        '0 0 0 0 66 74 79 70 71 74 20 20', //mov
                        '0 0 0 0 6D 6F 6F 76', //mov
                        '4F 67 67 53 0 02', //ogg
                        '1A 45 DF A3', //ogg
                    ];
                    let typeName = [
                        'jpg',
                        'png',
                        'mp4',
                        'mp4',
                        'mp4',
                        'mp4',
                        'mp4',
                        'm4v',
                        'm4v',
                        'mov',
                        'mov',
                        'mov',
                        'ogg',
                        'ogg',
                    ];
                    let sliceSize = /png|jpg|jpeg/.test(type) ? 3 : 12;
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    let result=false;
                    reader.onload=() =>{
                        let slice = reader.result.slice(0, sliceSize);
                        reader = null;
                        if (slice && slice.byteLength == sliceSize) {
                            let view = new Uint8Array(slice);
                            let arr = [];
                            view.forEach(function(v) {
                                arr.push(v.toString(16));
                            });
                            view = null;
                            let idx=-1;
                            imgType.forEach((item,index)=>{
                                if (arr.join(' ')==item){
                                    idx=index;
                                }
                            });
                            if (idx > -1) {
                                console.log("666"+typeName[idx]);
                                result=typeName[idx];
                                resolve(result);
                            } else {
                                result= false;
                                resolve(result);
                            }
                        } else {
                            result= false;
                            resolve(result);
                        }
                    }
                });
            },
            uploadFile(filetype,filename) {//请求后台上传文件
                //这里加限制判断
                if (this.limittype != null) {
                    if (this.limittype.indexOf(filetype.toLowerCase()) == -1) {//说明传的文件不是限制的文件
                        Dialog.alert({
                            title: '温馨提示',
                            message: "格式错误，请上传" + this.limittype + "格式的文件"
                        });
                        return;
                    }
                }
                let reader = new FileReader();
                let file = this.$refs.fileUpload.files[0];
                if (file) {
                    //将文件以Data URL形式读入页面
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        //var ImgFileSize = reader.result.substring(reader.result.indexOf(",") + 1).length;//截取base64码部分（可选可不选，需要与后台沟通）
                        if (this.AllowImgFileSize < reader.result.length) {
                            Dialog.alert({
                                title: '温馨提示',
                                message: "上传失败，请不要上传大于20M的文件"
                            });
                            return;
                        } else if (reader.result.length <= 5) {
                            Dialog.alert({
                                title: '温馨提示',
                                message: "上传失败，请不要上传空文件"
                            });
                            return;
                        } else {//上传
                            //上传
                            let paramJson = {
                                fileData: reader.result,
                                fileName: filename,
                                fileType: filetype,
                            };
                            this.$http.post('attachment/attachmentCtr/uploadFileByBase64', paramJson).then(
                                res => {
                                    if (res.code == 200) {
                                        //显示文件
                                        if (this.isImages(paramJson['fileType'])) {
                                            this.pics = [...this.pics, res.data];
                                        } else {
                                            this.files = [...this.files, res.data];
                                        }
                                        //返回附件id
                                        this.retIdsFromFiles();
                                    } else {
                                        Dialog.alert({
                                            title: '温馨提示',
                                            message: "上传失败"
                                        });
                                    }
                                }
                            );
                        }
                    }
                }

            },
            isImages(type) {//判决文件类型是不是图片
                let temp = type.toLowerCase();
                if (temp == 'jpg' || temp == 'png' || temp == 'jpeg' || temp == 'gif' ) {
                    return true;
                } else {
                    return false;
                }
            },
            deleteFileById(index, type) {//删除文件   type 1是pics里的  2是files里的
                let id = '';
                if (type == 1) {
                    id = this.pics[index]['id'];
                } else {
                    id = this.files[index]['id'];
                }
                if (this.realDeleteFile) {
                    this.$http.post('attachment/attachmentCtr/deleteAttachmentById', {id: id}).then(
                        res => {
                            if (res.code == 200) {
                                //删除图片
                                if (type == 1) {
                                    this.pics.splice(index, 1);
                                } else {
                                    this.files.splice(index, 1);
                                }
                                //返回附件id
                                this.retIdsFromFiles();
                            } else {
                                Dialog.alert({
                                    title: '温馨提示',
                                    message: "删除失败"
                                });
                            }
                        }
                    );
                } else {
                    //删除图片
                    if (type == 1) {
                        this.pics.splice(index, 1);
                    } else {
                        this.files.splice(index, 1);
                    }
                    //返回附件id
                    this.retIdsFromFiles();
                }

            },
            retIdsFromFiles() {//返回文件id集合
                let ids = '';
                if (this.pics != null && this.pics.length > 0) {
                    this.pics.forEach(item => {
                        ids += item['id'] + ',';
                    });
                }
                this.picsAttach = ids.substr(0, ids.length - 1);
                if (this.files != null && this.files.length > 0) {
                    this.files.forEach(item => {
                        ids += item['id'] + ',';
                    });
                }
                ids = ids.substr(0, ids.length - 1);
                this.$emit("attachmentIds", ids);
            },
            onCancelActionSheet() {//取消上拉菜单
                this.selectActionShow = false;
            },
            onSelectAction(item) {//上拉菜单的选项
                switch (item.name) {
                    case '图片':
                        this.accept = 'image/*';
                        break;
                    case '视频':
                        this.accept = 'video/*';
                        break;
                    case '音频':
                        this.accept = 'audio/*';
                        break;
                    case '文件':
                        this.accept = 'application/*,image/*,video/*,text/*,audio/*';
                        break;
                    default:
                        break;
                }
                this.$nextTick(() => {
                    this.selectActionShow = false;
                    this.$refs.fileUpload.click();
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .eui-uploader {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-left: 16px;
        box-sizing: border-box;

        &-preview {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 10px 8px 8px 0;

            .img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 4px;
                overflow: hidden;
            }

            .icon-del {
                position: absolute;
                top: -8px;
                right: -8px;
                font-size: 16px;
                color: #969696;
                border: 1px solid #fff;
                background: #fff;
                border-radius: 50%;
                z-index: 10;
            }
        }

        &-btn {
            position: relative;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 8px 8px 0;
            border-radius: 4px;
            overflow: hidden;
            border: 1px dashed #e5e5e5;
            background: #fff;
            box-sizing: border-box;

            .icon-add {
                font-size: 26px;
                color: #969696;
            }

            .input-file {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                cursor: pointer;
                opacity: 0;
            }
        }
    }

    .eui-uploaderTxt {
        background: #fff;

        .tt {
            position: relative;
            line-height: 40px;
            padding: 0 5px;
            font-size: 14px;

            &:before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: #e5e5e5;
                transform: scaleY(0.5);
            }

            span {
                float: right;
            }
        }

        ul {
            li {
                position: relative;
                display: flex;
                align-items: center;
                padding: 8px 16px;

                &:before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 16px;
                    right: 0;
                    height: 1px;
                    background: #e5e5e5;
                    transform: scaleY(0.5);
                }

                h3 {
                    flex: 1;
                    line-height: 20px;
                    margin: 0 20px 0 0;
                    font-size: 12px;
                    font-weight: 400;
                    text-align: left;
                }

                .icon-del {
                    font-size: 18px;
                    color: #969696;
                    border: 1px solid #fff;
                    box-sizing: border-box;
                    background: #fff;
                    border-radius: 50%;
                }
            }
        }
    }

</style>
