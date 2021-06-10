/**
* 描述:h5上传组件
*
**/
<template>
    <div class="upload">
        <!--图片-->
        <template v-if="type===0">
            <van-uploader v-model="fileList" :max-size="limitSize" :max-count="limitNum" :multiple="multiple" :capture="capture"
                          :before-read="beforeRead" :after-read="afterRead" :before-delete="beforeDelete" @oversize="onOversize"   >
                <template #default>
                    <slot></slot>
                </template>
                <template #preview-cover="{ file }">
                    <slot name="preview-cover">
                        <div class="preview-cover van-ellipsis">{{ file.name }}</div>
                    </slot>
                </template>
            </van-uploader>
        </template>
    </div>
</template>

<script>
    export default {
        name: "upload",
        props: {
            limitNum: {//限制上传个数  默认20
                type: Number,
                default: 9
            },
            limitType: {//限制文件上传的类型
                type: String,
                default: null
            },
            limitSize:{
                type:Number,
                default:5242880
            },//文件大小5m
            multiple:{//多选
                type:Boolean,
                default:false
            },
            capture:{//是否调起摄像头 camera
                type:String,
                default:null
            },
            attachids: {//附件id集合,隔开
                type: String,
                default: null
            },
            type: {//上传文件格式 0图片 1 视频  2 音频文件  3文件  -1  选择
                type: Number,
                default: 0
            },
            showStyle: {//0单纯的展示不可上传  1纯图片(上传一般只能是图片)  2文件(上传的可以是图片 可以是附件)
                type: Number,
                default: 0
            },
            title: {//标题
                type: String,
                default: '附件上传'
            },
            realDeleteFile: {//是否真的删除文件   false的话  只清除当前组件的文件
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                fileList:[],//文件列表
            }
        },
        created() {
            if(this.attachids){
                let arr = this.attachids.split(",");
                arr.forEach(item => {
                    this.fileList.push({
                        url: process.env.VUE_APP_FILE_URL + item + '&isThumb=1',
                        id:item,
                        isImage: true
                    });
                });
            }
        },
        methods: {
            //文件大小超过限制时触发
            onOversize(file){
                console.log(file);
                this.$toast('文件大小不能超过 '+(this.limitSize/1048576)+'M');
            },
            //上传前置处理 这里判断文件类型
            beforeRead(file){
                console.log("beforeRead")
                if(this.$utils.isEmpty(file['type'])){
                    this.$toast('请检查文件类型');
                    return false;
                }
                if(this.limitType){
                    let arr = this.limitType.split(",");
                    if(!arr.some(item=>file.type.toLocaleLowerCase().includes(item))){
                        this.$toast('请上传 '+this.limitType+'格式文件');
                        return false;
                    }
                }
                return true;
            },
            //文件读取完成后的回调函数
            afterRead(file){
                file.status = 'uploading';
                file.message = '上传中...';
                let param = {
                    FileData: file['content'],
                    filename:file['file']['name'],
                };
                if(param['filename'].includes(".")){
                    param['filetype'] = param['filename'].substr(param['filename'].lastIndexOf(".") + 1);
                }
                this.$http.post("attachment/attachmentCtr/uploadFileByBase64", param).then(res => {
                    if(res['code']==200){
                        file.status = 'done';
                        file.message = '上传完成';
                        file['id'] = res['data']['id'];
                        this.returnIds();
                    }else{
                        file.status = 'failed';
                        file.message = '上传失败';
                    }
                });

            },
            //文件删除前的回调函数，返回 false 可终止文件读取，
            beforeDelete(file){
                return new Promise((resolve, reject)=>{
                    let param = {
                        id:file['id']
                    };
                    this.$http.post("attachment/attachmentCtr/deleteAttachmentById", param).then(res => {
                        if(res['code']==200){
                            file['id'] = null;
                            this.returnIds();
                            resolve(true);
                        }else{
                            this.$toast("删除失败");
                            reject();
                        }
                    });
                });

            },
            //返回ids
            returnIds(){
                let arr =[];
                this.fileList.forEach(item=>{
                    if (this.$utils.isNotEmpty(item['id'])) {
                        arr.push(item['id']);
                    }
                });
                let ids = arr.join(',');
                this.$emit("result", ids);
            }
        }
    }
</script>

<style scoped lang="less">
    .preview-cover {
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        width: 100%;
        padding: 4px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        background: rgba(0, 0, 0, 0.3);
    }
</style>