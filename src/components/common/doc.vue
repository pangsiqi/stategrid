<template>
<div>
    <div class="table-func">
        <form method="post" id="file" action="" enctype="multipart/form-data" style="float: left; position: relative;" v-show="docParm.model=='edit'">
            <el-button type="primary" size="mini" round class="a-upload">
                <i class="el-icon-upload2"></i>
                <font>上传</font>
                <input id="excelFile" type="file" name="uploadFile" @change="upload" v-if="docParm.model=='edit'"/>
            </el-button>
        </form>
        <el-button type="primary" size="mini" round class="a-upload" @click="uploadTip" v-show="docParm.model=='new'">
            <i class="el-icon-upload2"></i>
            <font>上传</font>
        </el-button>
        <el-button type="primary" size="mini" @click="download" round  style="margin-left: 10px;" v-if="docParm.model=='edit'">
            <i class="el-icon-download"></i>
            <font>下载</font>
        </el-button>
        <!-- <el-button type="primary" size="mini" @click="testAuto" round  style="margin-left: 10px;">
            <i class="el-icon-download"></i>
            <font>测试上传</font>
        </el-button> -->
        <el-button type="danger" size="mini" @click="delFile" round v-if="docParm.model=='edit'">
            <i class="el-icon-delete"></i>
            <font>删除行</font>
        </el-button>
    </div>
    <el-table :data="doc" row-key="ID" border stripe highlight-current-row style="width: 100%;"  @selection-change="handleSelFile">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" sortable label="序号" width="50">
        </el-table-column>
        <el-table-column prop="filerealname" label="名称" sortable>
        </el-table-column>
        <el-table-column prop="filestatus" label="状态" sortable>
        </el-table-column>
        <el-table-column prop="filesize" label="大小" sortable >
            <template slot-scope="scope">
                <span v-text="scope.row.filesize+'M'"></span>
            </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
                <el-button @click="showAuth(scope.row)" type="text" size="small"  v-if="docParm.model=='edit'">关键字</el-button>
                <el-button @click="readAuth(scope.row)" type="text" size="small">查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="pageLeft"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="page.totalCount">
    </el-pagination>
    <vkeyword ref="keyword" :param="param"></vkeyword>
    <el-dialog
        title="提示"
        :visible.sync="tipSaveShow"
        width="30%"
        :before-close="reset"
        :modal-append-to-body="false">
        <span>文档上传前会自动保存数据</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="reset">取 消</el-button>
            <el-button type="primary" @click="saveMain">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import Config from '../../config.js'
import vkeyword from '../common/keyword.vue'
import { Loading } from 'element-ui'
export default {
    name: 'nav_tabs',
    components: {
        vkeyword
    },
    data(){
        return {
            param: {
                visible: false,
            },
            basic_url: Config.dev_url,
            file_url: Config.file_url,
            po_url:Config.po_url,//pageoffice 服务路径
            doc: [],
            fileList: [],
            selFiles: [],
            //分页显示
            page: {
                currentPage: 1,
                pageSize: 20,
                totalCount: 0
            },
            tipSaveShow: false
        }
    },
    props: ['docParm'],
    methods: {
        autoLoad(){
            setTimeout(function(){
                $('#excelFile').click();
            },500);
        },
        reset(){
            this.tipSaveShow = false;
        },
        getFilelen(){
        	return this.doc.length;
        },
        saveMain(){
            var _this = this;
            this.$emit('saveParent','docUpload');
            this.reset();
        },
        showAuth(row){
            this.param.visible = true;
            this.param.fileid = row.fileid;
            this.$refs.keyword.getData();
			this.$refs.keyword.requestData();
        },
        readAuth(row){
            var url = this.po_url+"/show?filename=" +row.filename
                + '&fileid=' +  row.fileid
                + '&userid=' +  this.docParm.userid
                + '&username=' + this.docParm.username
                + '&deptid=' + this.docParm.deptid
                + '&deptfullname=' + this.docParm.deptfullname
                + '&recordid=' + this.docParm.recordid
                + '&appname=' + this.docParm.appname
                + '&appid=' + this.docParm.appid;
        // window.open(url);
        },
        uploadTip(){
            this.tipSaveShow = true;
        },
        sizeChange(val) {
            this.page.pageSize = val;
            this.getData();
        },
        currentChange(val) {
            this.page.currentPage = val;
            this.getData();
        },
        handleSelFile(val){
            this.selFiles = val;
        },
        upload(e){
            if( this.docParm.appid == 13 && this.doc.length >= 1){//appid==13原始数据模板文件上传
                this.$message({
                    message: '只能上传一个文档！',
                    type: 'error'
                });
                return;
            }
            if(this.docParm.appid == 17 && this.doc.length >= 2){//appid==17报告模板文件上传
                this.$message({
                    message: '只能上传两个文档！',
                    type: 'error'
                });
                return;
            }
            var formData = new FormData();
            var loading;
            loading = Loading.service({
                fullscreen: true,
                text: '拼命上传中...',
                background: 'rgba(F,F, F, 0.8)'
            });
            // this.$emit('showLoading');
            formData.append('files', document.getElementById('excelFile').files[0]);
            var config = {
                //添加请求头
                headers: { "Content-Type": "multipart/form-data" },
                //添加上传进度监听事件
                onUploadProgress: e => {
                    var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
                    this.progress = completeProgress;
                }
            };
            var url = this.file_url + '/file/uploadfile?userid=' + this.docParm.userid 
                + '&username=' + this.docParm.username
                + '&deptid=' + this.docParm.deptid
                + '&deptfullname=' + this.docParm.deptfullname
                + '&recordid=' + this.docParm.recordid
                + '&appname=' + this.docParm.appname
                + '&appid=' + this.docParm.appid;
            this.$axios.post(url, formData, config
            ).then((res)=>{
                loading.close();
                // this.$emit('closeLoading');
                if(res.data.code == 0){
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    });
                }else{
                    this.$message({
                        message: '文件已成功上传至服务器',
                        type: 'success'
                    });
                    //检测标准需要存储文件相关信息
                    if( this.docParm.appid == 13){
                        this.$emit('getFileInfo',res.data);
                    }
                }
                this.getData();
            })
        },
        getData(){
            if(this.docParm.model == 'new'){
                res.data.fileList = [];
                return false;
            }
            var pageNum = this.page.currentPage - 1;
            var url = this.file_url + '/file/fileList?page=' + pageNum + '&size=' + this.page.pageSize;
            this.$axios.post(url,{
                'appname': this.docParm.appname,
                'recordid': this.docParm.recordid,
            }).then((res) => {
                this.doc = res.data.fileList;
                this.page.totalCount = res.data.total;
            }).catch((err) => {});
        },
        download(){
            var selFilesLen = this.selFiles.length;
            if(selFilesLen == 0){
                this.$message({
                    message: '请选择文件',
                    type: 'warning'
                });
            }else if(selFilesLen > 1){
                this.$message({
                    message: '不可同时下载多个文件',
                    type: 'warning'
                });
            }else{
                var url = this.selFiles[0].filepath 
                    + '&userid=' + this.docParm.userid
                    + '&username=' + this.docParm.username
                    + '&deptid=' + this.docParm.deptid
                    + '&deptfullname=' + this.docParm.deptfullname;
                window.open(url); 
            }
        },
        delFile(){
            var selFilesLen = this.selFiles.length;
            if(selFilesLen == 0){
                this.$message({
                    message: '请选择数据项',
                    type: 'warning'
                });
            }else if(selFilesLen > 1){
                this.$message({
                    message: '不可同时删除多条数据',
                    type: 'warning'
                });
            }else{
                var url = this.file_url + '/file/deleteFile/' + this.selFiles[0].fileid;
                this.$axios.delete(url,{}).then((res) => {
                    if(res.data.code == 1){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                    }
                    this.getData();
                }).catch((err) => {});
            }
        }
    },
}
</script>

<style scoped>
#file button {
    position: relative;
}
.a-upload input{
    position: absolute;
    font-size: 0px;
    font-size: 20px \9;
    right: 0px;
    top: 0;
    height: 30px;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
    width: 70px;
    cursor: pointer;
}
.upload-btn{
    color: #fff;
    background-color: #286090;
    border-radius: 4px;
    padding: 4px 10px;
    width: 85px;
    height: 34px;
    line-height: 28px;
    border: none;
    cursor: pointer;
}
.pageLeft{
    float: right;
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>