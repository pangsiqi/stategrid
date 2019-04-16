<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="委托书编号" :visible.sync="dialoginspect" width="80%" >
			<el-form inline-message :model="searchList">
				<el-row :gutter="5">
					<el-col :span="6">
						<el-form-item label="委托单位名称" prop="V_NAME"  label-width="100px">
							<el-input v-model="searchList.V_NAME"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="样品名称" prop="ITEM_NAME" label-width="70px">
							<el-input v-model="searchList.ITEM_NAME"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="检测报告编号" prop="REPORT_NUM" label-width="100px">
							<el-input v-model="searchList.REPORT_NUM"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="检测委托书编号" prop="PROXYNUM" label-width="110px">
							<el-input v-model="searchList.PROXYNUM"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="5">
					<el-col :span="6">
						<el-form-item label="完成日期" prop="COMPDATE" label-width="100px">
							<el-date-picker v-model="searchList.COMPDATE" type="date" placeholder="完成日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%">
						</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="4">
					<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
					<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px; margin-left: 2px">重置</el-button>
				</el-col>
				</el-row>
			</el-form>
			<el-table :data="inspectList" border stripe :header-cell-style="rowClass" style="width: 100%;" height="360px" :default-sort="{prop:'inspectList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore('inspect')"
			v-loading="loading" 
			element-loading-text="加载中…"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255, 255, 255, 0.9)">	
				<el-table-column type="selection" width="55" fixed align="center">
				</el-table-column>
				<el-table-column label="检验委托书编号" sortable width="160px" prop="PROXYNUM">
				</el-table-column>
				<el-table-column label="委托单位名称" sortable width="220px" prop="V_NAME">
				</el-table-column>
				<el-table-column label="生产单位名称" sortable width="220px" prop="P_NAME">
				</el-table-column>
				<el-table-column label="样品名称" sortable width="180px" prop="ITEM_NAME">
				</el-table-column>
				<el-table-column label="样品型号" sortable width="140px" prop="ITEM_MODEL">
				</el-table-column>
				<el-table-column label="检测依据" width="200px" prop="REMARKS" sortable>
				</el-table-column>
				<el-table-column label="完成日期" width="140px" prop="COMPDATE" sortable  :formatter="dateFormat" data-type = "">
				</el-table-column>
				<el-table-column label="完成方式" width="180px" prop="COMPMODE" sortable>
				</el-table-column>
				<el-table-column label="检测报告编号" width="160px" prop="REPORT_NUM" sortable>
				</el-table-column>
				<el-table-column label="主检组" width="140px" prop="MAINGROUP" sortable>
				</el-table-column>
				<el-table-column label="录入时间" width="160px" prop="ENTERDATE" sortable :formatter="dateFormat">
				</el-table-column>
				<el-table-column label="版本" width="80" prop="VERSION" sortable>
				</el-table-column>
			</el-table>	
			<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
			</el-pagination>
			<span slot="footer">
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
		inspectList: [],
		dialoginspect: false,
		commentArr:{},
		selval: [],//接勾选的值
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
			},
		searchList: {
				V_NAME:'',
				ITEM_NAME: '',
				REPORT_NUM: '',
				PROXYNUM: '',
				COMPDATE: '',
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
			V_NAME:'',
			ITEM_NAME: '',
			REPORT_NUM: '',
			PROXYNUM: '',
			COMPDATE: '',
		};
	},
	searchinfo() {
		this.page.currentPage = 1;
		this.page.pageSize = 20;
		this.requestData();
	},
  	//点击关闭按钮
	close() {
		this.dialoginspect = false;
	},
  	visible() {
		this.dialoginspect = true;
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
	requestData(){
		this.loading = true;
		var data = {
				page: this.page.currentPage,
				limit: this.page.pageSize,
				V_NAME:this.searchList.V_NAME,
				ITEM_NAME: this.searchList.ITEM_NAME,
				REPORT_NUM: this.searchList.REPORT_NUM,
				PROXYNUM: this.searchList.PROXYNUM,
				COMPDATE: this.searchList.COMPDATE,
			}
			//委托书
			this.$axios.get(this.basic_url + '/api-apps/app/inspectPro', {params: data}).then((res) => {
				this.page.totalCount = res.data.count;
				//总的页数
				let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize);
				if(this.page.currentPage >= totalPage) {
					this.loadSign = false
				} else {
					this.loadSign = true
				}
				this.commentArr[this.page.currentPage] = res.data.data
				let newarr = []
				for(var i = 1; i <= totalPage; i++) {
					if(typeof(this.commentArr[i]) != 'undefined' && this.commentArr[i].length > 0) {

						for(var j = 0; j < this.commentArr[i].length; j++) {
							newarr.push(this.commentArr[i][j])
						}
					}
				}
				this.inspectList = newarr;
				this.loading = false;
			}).catch((wrong) => {
				// this.$message({
				// 	message: '网络错误，请重试',
				// 	type: 'error'
				// });
			})
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
			var proxynum=this.selval[0].PROXYNUM;	
			var version=this.selval[0].VERSION;
			this.$emit('appendpro',proxynum);
			this.$emit('appendver',version);
			// this.dialoginspect = false;
			// this.requestData();
			this.resetBasisInfo();//调用resetBasisInfo函数
		}
	},
	
	resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
		this.dialoginspect = false;//关闭弹出框
		this.inspectList = [];//列表数据置空
		this.page.currentPage = 1;//页码重新传值
		this.page.pageSize = 10;//页码重新传值
	},
  },

  mounted() {
		this.requestData();
	},
}
</script>

<style>
</style>