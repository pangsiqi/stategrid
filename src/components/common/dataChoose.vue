<template>
<div>
    <el-dialog :modal-append-to-body="false" :title="chooseParam.title" :visible.sync="dialogShow" :before-close="reset">
        <p class="selTab" v-show="chooseParam.selShow">已选择：
            <el-tag class="tag" 
                type="success" 
                v-for="item in selData" :key='item.id'
                style="margin-right: 10px;margin-bottom: 20px;"  
                @close="closeTag(item)"
                closable>{{item.keywordname}}
            </el-tag>
        </p>
        <el-table :data="list" row-key="ID" border stripe highlight-current-row style="width: 100%;"  @selection-change="handleSelData">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" sortable label="序号" width="50">
            </el-table-column>
            <el-table-column v-for="item in chooseParam.tableHeader" :key='item.id' :prop="item.propName" :label="item.labelName" sortable>
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
    name: 'dataChoose',
    props: ['chooseParam'],
    data(){
        return {
            basic_url: Config.dev_url,
            file_url: Config.file_url,
            list: [],
            //分页显示
            page: {
                currentPage: 1,
                pageSize: 20,
                totalCount: 0
            },
            selData: [],
            showSelData: [],
            dialogShow: false,
        }
    },
    methods: {
        handleSelData(val){
            this.selData = val;
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
        getData(opt,parmData){
            if(opt=='new'){
                var chooseParam = parmData;
            }else{
                var chooseParam = this.chooseParam;
            }
            var url = this.basic_url + chooseParam.url;
            var data = {
                page: this.page.currentPage,
                limit: this.page.pageSize,
            };
            var searchParm = chooseParam.search;
            for(var i=0; i<searchParm.length; i++){
                data[searchParm[i].name] = searchParm[i].val;
            }
            // this.showSelData = this.showSelData.concat(this.selData);
            this.$axios.get(url, {
                params: data
            }).then((res) => {
                this.list = res.data.data;
                this.page.totalCount = res.data.count;
                this.dialogShow = true;
            }).catch((err) => {
                // this.$message({
                //     message: '网络错误，请重试',
                //     type: 'error'
                // });
            });
        },
        reset(){
            this.dialogShow = false;
            this.list = [];
            this.page = {
                currentPage: 1,
                pageSize: 20,
                totalCount: 0
            };
            this.selData = [];
            this.showSelData = [];
        },
        save(){
           if(this.selData.length > this.chooseParam.selMax){
                var msg = '最多选择' + this.chooseParam.selMax + '条数据，请重新选择';
                this.$message({
                    message: msg,
                    type: 'warning'
                });
           }else if(this.selData.length == 0){
                this.$message({
                    message: '请选择数据',
                    type: 'warning'
                });
           }else{
                var transData = {
                   listName: this.chooseParam.listName,
                   data: this.selData
                }
                this.$emit('tranFormData', transData);
                this.reset();
           }
        },
        closeTag(item){
            this.selkeys.splice(this.selkeys.indexOf(item), 1);
        }
    }
}
</script>

<style scoped> 

</style>