<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="委托书编号" :visible.sync="dialogwork" width="80%" >
			<!-- 高级查询划出 Begin-->
            <el-form inline-message :model="searchList" label-width="110px">
                <el-row :gutter="5">
                    <el-col :span="6">
                        <el-form-item label="工作任务单编号" prop="WONUM">
                            <el-input v-model="searchList.WONUM">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="样品名称" prop="ITEM_NAME" label-width="80px">
                            <el-input v-model="searchList.ITEM_NAME">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="完成日期" prop="COMPLETE_DATE" label-width="80px">
                            <div class="block">
                                <el-date-picker v-model="searchList.COMPLETE_DATE" type="date" placeholder="请选择" style="width: 100%" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="6">
                        <el-form-item label="委托书编号" prop="PROXYNUM" label-width="110px">
                            <el-input v-model="searchList.PROXYNUM">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="录入时间" prop="ENTERDATE" label-width="80px">
                            <div class="block">
                                <el-date-picker v-model="searchList.ENTERDATE" type="date" placeholder="请选择" style="width: 100%" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                    </el-col>
                        <el-col :span="4">
                        <el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
                        <el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px;    margin-left: 2px">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>
			<!-- 高级查询划出 End-->
			<el-table :header-cell-style="rowClass" :data="userList" border stripe height="360px" style="width: 100%;" :default-sort="{prop:'userList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore"
            v-loading="loading" 
            element-loading-text="加载中…"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, 0.9)">
                <el-table-column type="selection" width="55" fixed align="center">
                </el-table-column>
                <el-table-column label="工作任务单编号" sortable width="200px" prop="WONUM">
                </el-table-column>
                <el-table-column label="样品名称" sortable width="220px" prop="ITEM_NAME">
                </el-table-column>
                <el-table-column label="样品型号" sortable width="180px" prop="ITEM_MODEL">
                </el-table-column>
                <el-table-column label="样品状态" sortable  width="100px" prop="ITEM_STATUS">
                </el-table-column>
                <el-table-column label="抽样方案/判定依据" sortable width="200px" prop="CHECK_BASIS">
                </el-table-column>
                <el-table-column label="完成日期" sortable  width="100px" :formatter="dateFormat" prop="COMPLETE_DATE">
                </el-table-column>
                <el-table-column label="完成方式" sortable  width="100px" prop="COMPLETE_MODE">
                </el-table-column>
                <el-table-column label="委托书编号" sortable  width="180px" prop="PROXYNUM">
                </el-table-column>
                <!-- <el-table-column label="信息状态" sortable width="100px" prop="STATUS" :formatter="judge" v-if="this.checkedName.indexOf('信息状态')!=-1">
                </el-table-column> -->
                <!-- <el-table-column label="录入人" sortable width="210px" prop="ENTERBY" v-if="this.checkedName.indexOf('录入人')!=-1">
                </el-table-column> -->
                <el-table-column label="录入时间" sortable width="210px" :formatter="dateFormat" prop="ENTERDATE">
                </el-table-column>
            </el-table>
            <el-pagination background class="text-right pt10"
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next" :total="page.totalCount">
            </el-pagination>
			<span slot="footer" class="dialog-footer">
			   <el-button type="primary" @click="determine">确 定</el-button>
		       <el-button @click="resetBasisInfo">取 消</el-button>
		    </span>
		</el-dialog>
	</div>
</template>

<script>
	import Config from '../../../config.js';
	export default {
        name: 'sample',
        data() {
            return {
                basic_url: Config.dev_url,
                loading: false,
                loadSign:true,//加载
                userList: [],
                dialogwork: false,
                commentArr:{},
                selval: [],//接勾选的值
                page: {
                    currentPage: 1,
                    pageSize: 20,
                    totalCount: 0
                    },
                searchList: {
                    WONUM: '',//工作任务单编号
                    ITEM_NAME: '',//样品名称
                    PROXYNUM: '',//委托书编号
                    STATE: '',//状态
                    COMPLETE_DATE: '',//完成日期
                    // ENTERBY: '',//录入人
                    ENTERDATE: '',//录入时间
                },
                
            }
        },

        methods: {
            dateFormat(row, column) {
                var date = row[column.property];
                if(date == undefined) {
                    return "";
                }
                return this.$moment(date).format("YYYY-MM-DD");
            },
            //表头居中
            rowClass({ row, rowIndex}) {
                return 'text-align:center'
            },
            SelChange(val) {
                this.selval = val;
            },
            sizeChange(val) {
                this.page.pageSize = val;
                this.requestData();
            },
            currentChange(val) {
                this.page.currentPage = val;
                this.requestData();
            },
            resetbtn(){
                this.searchList =  { //点击高级搜索后显示的内容
                    WONUM: '',//工作任务单编号
                    ITEM_NAME: '',//样品名称
                    PROXYNUM: '',//委托书编号
                    STATE: '',//状态
                    COMPLETE_DATE: '',//完成日期
                    // ENTERBY: '',//录入人
                    ENTERDATE: '',//录入时间
                };
            },
            searchinfo(index) {
                this.page.currentPage = 1;
                this.page.pageSize = 10;
                this.requestData();
            },
            //点击关闭按钮
            close() {
                this.dialogwork = false;
            },
            visible() {
                this.dialogwork = true;
            },
            loadMore () {
            if (this.loadSign) {
                this.loadSign = false
                this.page.currentPage++
                if (this.page.currentPage > Math.ceil(this.page.totalCount/this.page.pageSize)) {
                return
                }
                setTimeout(() => {
                this.loadSign = true
                }, 1000)
                this.requestData();
            }
            },
            requestData() {
                this.loading = true;
                var data = {
                    page: this.page.currentPage,
                    limit: this.page.pageSize,

                    WONUM: this.searchList.WONUM,
                    ITEM_NAME: this.searchList.ITEM_NAME,
                    PROXYNUM: this.searchList.PROXYNUM,
                    STATE: this.searchList.STATE,
                    COMPLETE_DATE: this.searchList.COMPLETE_DATE,
                    ENTERBY: this.searchList.ENTERBY,
                    ENTERDATE: this.searchList.ENTERDATE,
                }
                var url = this.basic_url + '/api-apps/app/workorder';
                this.$axios.get(url, {
                    params: data
                }).then((res) => {
                    this.page.totalCount = res.data.count;	
                    //总的页数
                    this.userList=res.data.data;
                    let totalPage=Math.ceil(this.page.totalCount/this.page.pageSize)
                    if(this.page.currentPage >= totalPage){
                            this.loadSign = false
                    }else{
                        this.loadSign=true
                    }
                    this.commentArr[this.page.currentPage]=res.data.data
                    let newarr=[]
                    for(var i = 1; i <= totalPage; i++){
                    
                        if(typeof(this.commentArr[i])!='undefined' && this.commentArr[i].length>0){
                            
                            for(var j = 0; j < this.commentArr[i].length; j++){
                                newarr.push(this.commentArr[i][j])
                            }
                        }
                    }
                    this.userList = newarr;
                    this.loading = false;
                }).catch((wrong) => {})
            },
            determine(){
                if(this.selval.length == 0){
                    this.$message({
                        message: '请选择数据',
                        type: 'warning'
                    });
                }else if(this.selval.length > 1){
                    this.$message({
                        message: '不可同时选择多条数据',
                        type: 'warning'
                    });
                }else{
                    var worknum = this.selval[0].WONUM;
                    this.$emit('appendwork',worknum);
                    // this.dialogwork = false;
                    // this.requestData();
                    this.resetBasisInfo();//调用resetBasisInfo函数
                }
            },
            resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
                this.dialogwork = false;//关闭弹出框
                this.userList = [];//列表数据置空
                this.page.currentPage = 1;//页码重新传值
                this.page.pageSize = 10;//页码重新传值
            },
        },
        mounted() {
            this.requestData();
        }
    }
</script>

<style>
</style>