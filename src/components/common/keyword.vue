<template>
<div>
    <el-dialog title="关键字" :visible.sync="param.visible" :before-close="reset" :modal-append-to-body="false">
        <p class="selTab">已选择：
            <el-tag class="tag" type="success" v-for="item in selkeys" :key="item.id" style="margin-right: 10px;margin-bottom: 20px;" @close="closeTag(item)" closable>{{item.keywordname}}
            </el-tag>
        </p>
        <!-- <div class="keyCat">
            <p class="catTit">关键字类别</p>
            <el-tag class="tag" type="success" @click.native="getKeys(item)" v-for="item in cateList" style="margin-right: 10px; min-width: 80px;">{{item.categoryname}}</el-tag>
        </div>
        <div class="keyCat">
            <p class="catTit">关键字</p>
            <el-tag class="tag" type="success"  @click.native="setSel(item)" v-for="item in keywords" style="margin-right: 10px; min-width: 80px;">{{item.keywordname}}</el-tag>
        </div>
        <p class="tips">请选择关键字类别，然后点击选择的关键字</p> -->
        
        <div class="pb10">
            <el-form inline-message :model="searchList" label-width="70px">
                <el-row :gutter="30" class="pb5">
                    <el-col :span="7">
                        <el-input v-model="searchList.categoryidDesc">
                            <template slot="prepend">类别</template>
                        </el-input>
                    </el-col>
                    <el-col :span="7">
                        <el-input v-model="searchList.keywordname">
                            <template slot="prepend">关键字</template>
                        </el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" @click="searchinfo" size="small" style="margin:4px">搜索</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-table ref="table" 
                  :data="list" 
                  border 
                  style="width: 100%;" 
                  :default-sort="{prop:'samplesList', order: 'descending'}" 
                  @selection-change="selChange">
            <el-table-column type="selection" width="55" fixed >
            </el-table-column>
            <el-table-column label="分类" sortable prop="categoryidDesc">
            </el-table-column>
            <el-table-column label="关键字" sortable prop="keywordname">
            </el-table-column>
        </el-table>
        <el-pagination background class="text-right pt10"
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="page.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="page.totalCount">
        </el-pagination>
        <div slot="footer">
            <el-button type="primary" @click="save">确 定</el-button>
            <el-button @click="reset">取 消</el-button>
        </div>
    </el-dialog>  
</div>
</template>

<script>
import Config from '../../config.js'
export default {
    name: 'keyword',
    data(){
        return {
            loading: false,
            basic_url: Config.dev_url,
            file_url: Config.file_url,
            page: {
                currentPage: 1,
                pageSize: 20,
                totalCount: 0
            },
            searchList: {
                'categoryidDesc': '',
                'keywordname': ''
            },
            list: [],
            keywords: [],
            selkeys: [],
            delKeys: [],
            selPageData: []
        }
    },
    props: ['param'],
    methods: {
        selChange(val){
            // this.setSelectRow();
            this.selPageData = val;
            var _this = this;
            //处理分页时，分页记忆失去之前数据，500必须大于setSelectRow的时间
            setTimeout(function(){
                _this.changePageCoreRecordData();
            },800);
        },
        //分页
        sizeChange(val) {
            this.changePageCoreRecordData();
            this.page.pageSize = val;
            this.getData();
        },
        currentChange(val) {
            this.changePageCoreRecordData();
            this.page.currentPage = val;
            this.getData();
        },
        //高级查询
        searchinfo() {
            this.page.currentPage = 1;
            this.page.pageSize = 10;
            this.getData();
        },
        reset(){
            this.selkeys = [];
            this.keywords = [];
            this.delKeys = [];
            this.selPageData = [];
            this.param.visible = false;
            this.page = {
                currentPage: 1,
                pageSize: 20,
                totalCount: 0
            };
        },
        save(){
            var url = this.file_url + '/file/fileKeyword';
            var catList = [];
            var selkeys = this.selkeys;
            for(var i=0; i<selkeys.length; i++){
                if(!!selkeys[i].filekeywordid){
                    catList.push({
                        filekeywordid: selkeys[i].filekeywordid,
                        keywordid: selkeys[i].id,
                        categoryid: selkeys[i].categoryid
                    });
                }else{
                    catList.push({
                        filekeywordid: '',
                        keywordid: selkeys[i].id,
                        categoryid: selkeys[i].categoryid
                    });
                }
                
            }
            var postData = {
                fileid: this.param.fileid,
                categoryKeywordList: catList,
                deleteFilekeywordidList: this.delKeys
            };
            this.$axios.post(url,postData).then((res) => {
                if(res.data.code==1){
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    });
                }
                this.reset();
            }).catch((err) => {});
        },
        closeTag(item){
            if(item.filekeywordid != ''){
                this.delKeys.push(item.filekeywordid);
            }
            this.selkeys.splice(this.selkeys.indexOf(item), 1);
            this.setSelectRow();
        },
        getData(){
            var data = {
                page: this.page.currentPage,
                limit: this.page.pageSize,
                categoryidDesc: this.searchList.categoryidDesc,
                keywordname: this.searchList.keywordname
            };
            var url = this.basic_url + '/api-apps/app/tbKeyword2';
            this.$axios.get(url, {
                params: data
            }).then((res) => {
                this.page.totalCount = res.data.count;
                this.list = res.data.data;
                setTimeout(()=>{
                    this.setSelectRow();
                }, 200)
            }).catch((wrong) => {});
        },
        requestData(){
            var url = this.file_url + '/file/fileKeywordList';
            this.$axios.post(url, {
                'fileid': this.param.fileid
            }).then((res) => {
                var selkeys = res.data;
                this.selkeys = selkeys;
                for(var i=0; i<selkeys.length; i++){
                    selkeys[i].id = selkeys[i].keywordid;
                }
                this.setSelectRow();
            }).catch((wrong) => {});
        },
        changePageCoreRecordData () {
            let idKey = 'id';
            let that = this;
            if (this.selkeys.length <= 0) {
                this.selkeys = this.selPageData;
                return;
            }
            let selectAllIds = [];
            this.selkeys.forEach(row=>{
                selectAllIds.push(row[idKey]);
            })
            let selectIds = [];
            this.selPageData.forEach(row=>{
                selectIds.push(row[idKey]);
                if (selectAllIds.indexOf(row[idKey]) < 0) {
                    that.selkeys.push(row);
                }
            })
            let noSelectIds = [];
            this.list.forEach(row=>{
                if (selectIds.indexOf(row[idKey]) < 0) {
                    noSelectIds.push(row[idKey]);
                }
            })
            noSelectIds.forEach(id=>{
                if (selectAllIds.indexOf(id) >= 0) {
                    for(let i = 0; i< that.selkeys.length; i ++) {
                        if (that.selkeys[i][idKey] == id) {
                            that.selkeys.splice(i, 1);
                            break;
                        }
                    }
                }
            })
        },
        setSelectRow() {
            if (!this.selkeys || this.selkeys.length <= 0) {
                return;
            }
            let idKey = 'id';
            let selectAllIds = [];
            let that = this;
            this.selkeys.forEach(row=>{
                selectAllIds.push(row[idKey]);
            })
            this.$refs.table.clearSelection();
            for(var i = 0; i < this.list.length; i++) {                    
                if (selectAllIds.indexOf(this.list[i][idKey]) >= 0) {
                    this.$refs.table.toggleRowSelection(this.list[i], true);
                }
            }
        }
    },
}
</script>

<style scoped>  
.keyCat{
    padding-top: 10px;
    padding-bottom: 30px;
}
.catTit{
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    margin-bottom: 10px;
}
.selTab, .chooseTab{
    font-size: 18px;
}
.chooseTab{
    text-align: center;
}
.tag{
    cursor: pointer;
}
.tips{
    color: #ccc;
    font-size: 12px;
}
</style>