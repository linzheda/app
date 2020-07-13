<template>
    <div class="component-view" >
        <div class="header">
            <van-nav-bar title="文件上传" left-text="返回" left-arrow v-goback />
        </div>
        <div class="body">
           <file-upload :showStyle="0" :attachids="attachmentIds"></file-upload>
           <file-upload :showStyle="1" @attachmentIds="getAttachmentIds1"></file-upload>
           <file-upload :showStyle="2" :type="-1" @attachmentIds="getAttachmentIds2"></file-upload>
           <file-upload :showStyle="2" :type="3" @attachmentIds="getAttachmentIds2"></file-upload>
        </div>
    </div>
</template>

<script>

    import FileUpload from "@/components/file-upload";
    export default {
        name: "component-view",
        components: {FileUpload},
        data(){
            return{
                attachmentIds:'38,39',
                attachmentIds1:'',
                attachmentIds2:''
            }
        },
        methods:{
            getAttachmentIds1(data){
                this.attachmentIds1=data;
                console.log("文件1ids:"+this.attachmentIds1);
            },
            getAttachmentIds2(data){
                this.attachmentIds2=data;
                console.log("文件2ids:"+this.attachmentIds2);
            }
        }
    }
</script>

<style scoped>

</style>
