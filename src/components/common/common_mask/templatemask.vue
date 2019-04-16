<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="原始数据模版" :visible.sync="dialogtemplate" width="80%">
			<el-form inline-message :model="searchList" label-width="70px">
				<el-row :gutter="10">
					<el-col :span="5">
						<el-form-item label="模板描述" prop="DECRIPTION">
							<el-input v-model="searchList.DECRIPTION"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="模板编号" prop="PT_NUM">
							<el-input v-model="searchList.PT_NUM"></el-input>
						</el-form-item>
					</el-col>
					
					<el-col :span="4">
						<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
						<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px; margin-left: 2px">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table :header-cell-style="rowClass" :data="categoryList" border stripe height="360px" style="width: 100%;" :default-sort="{prop:'categoryList', order: 'descending'}" @selection-change="SelChange"
			v-loadmore="loadMore"
			v-loading="loading"  
			element-loading-text="加载中…"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255, 255, 255, 0.9)">
				<el-table-column type="selection" fixed width="55" align="center">
				</el-table-column>
				<el-table-column label="编码" width="155" sortable prop="PT_NUM">
				</el-table-column>
				<el-table-column label="模板描述" sortable prop="DECRIPTION">
				</el-table-column>							             
				<el-table-column label="录入时间" width="120" prop="ENTERDATE" sortable :formatter="dateFormat">
				</el-table-column>
				<el-table-column label="机构" width="185" sortable prop="DEPTIDDesc">
				</el-table-column>
			</el-table>
			<el-pagination background class="text-right pt10"@size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40,100]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
			</el-pagination>
			<div slot="footer" class="dialog-footer">
		       <el-button type="primary" @click="determine">确 定</el-button>
		       <el-button @click="resetBasisInfo">取 消</el-button>
		   </div>
		</el-dialog>
	</div>
</template>

<script>
	import Config from '../../../config.js';
	export default {
//	props:["approvingData"],//第一种方式
  name: 'product',
  
  data() {
    return {
		basic_url: Config.dev_url,
		loading: false,
		loadSign:true,//加载
		categoryList: [],
		dialogtemplate: false,
		commentArr:{},
		selUser: [],//接勾选的值
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
			},
		searchList: { //点击高级搜索后显示的内容
				DECRIPTION: '',
				PT_NUM: '',
		},
		DEPTID:'',//当前选择的机构值
		datamodule:[],//原始数据模板已选数据
		datamodulenums:'',//原始数据模板已选数据编号
		projectnums:'',//当前检测项目
		datatype:'',//请求模板类型
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
		this.selUser = val;
	},
  	sizeChange(val) {
		this.page.pageSize = val;
		this.requestData();
	},
	currentChange(val) {
		this.page.currentPage = val;
		this.requestData();
	},
	searchinfo() {
		this.page.currentPage = 1;
		this.page.pageSize = 20;
		this.requestData();
	},
	resetbtn(){
		this.searchList =  { //点击高级搜索后显示的内容
			DECRIPTION: '',
			PT_NUM: '',
		};
	},
  	//点击关闭按钮
	close() {
		this.dialogtemplate = false;
	},
  	visible(value) {
		//value[0]检测项目
		this.datatype = value[2];
		this.projectnums = value[0];
		//value[1]原始数据模板已选数据
		this.dialogtemplate = true;
		if(value[1]!=''&&value[1]!=null&&value[1]!=undefined){
			this.datamodule = value[1];
			var datamodulenum = [];
			for(var i = 0;i<this.datamodule.length;i++){
				datamodulenum.push(this.datamodule[i].PT_NUM);
			}
			this.datamodulenums = datamodulenum.toString(',');
		}else{
			this.datamodulenums = '';
		}
		if(this.datatype == '1'){
			this.requestinitData();
		}else if(this.datatype == '2'){
			this.requestData();
		}
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
	     if(this.datatype == '1'){
			this.requestinitData();
		}else if(this.datatype == '2'){
			this.requestData();
		}
	   }
	},
	requestinitData(){
		this.loading = true;
		var data = {
			page: this.page.currentPage,
			limit: this.page.pageSize,
			DECRIPTION:this.searchList.DECRIPTION,
			PT_NUM:this.searchList.PT_NUM
		}
		var url = this.basic_url + '/api-apps/app/rawDataTem';//业务基础数据原始数据模板
		this.$axios.get(url, {}).then((res) => {
			this.page.totalCount = res.data.count;
			//总的页数
			let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize);
			if(this.page.currentPage >= totalPage) {
				this.loadSign = false;
			} else {
				this.loadSign = true;
			}
			this.commentArr[this.page.currentPage] = res.data.data
			let newarr = [];
			for(var i = 1; i <= totalPage; i++) {

				if(typeof(this.commentArr[i]) != 'undefined' && this.commentArr[i].length > 0) {

					for(var j = 0; j < this.commentArr[i].length; j++) {
						newarr.push(this.commentArr[i][j])
					}
				}
			}
			this.categoryList = newarr;
			this.loading = false;
		}).catch((wrong) => {
			// this.$message({
			// 	message: '网络错误，请重试',
			// 	type: 'error'
			// });
		})
	},
	requestData(){
		this.loading = true;
		var data = {
			page: this.page.currentPage,
			limit: this.page.pageSize,
			DECRIPTION:this.searchList.DECRIPTION,
			PT_NUM:this.searchList.PT_NUM
		}
		// var url = this.basic_url + '/api-apps/app/rawDataTem2?P_NUM_where_in='+this.projectnums+'&NUM_where_not_in='+this.datamodulenums;
		// var url = this.basic_url + '/api-apps/app/rawDataTem';//业务基础数据原始数据模板
		var url = this.basic_url + '/api-apps/app/rawDataTem2?P_NUM_where_in='+this.projectnums;
		this.$axios.get(url, {}).then((res) => {
			this.page.totalCount = res.data.count;
			//总的页数
			let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize);
			if(this.page.currentPage >= totalPage) {
				this.loadSign = false;
			} else {
				this.loadSign = true;
			}
			this.commentArr[this.page.currentPage] = res.data.data
			let newarr = [];
			for(var i = 1; i <= totalPage; i++) {

				if(typeof(this.commentArr[i]) != 'undefined' && this.commentArr[i].length > 0) {

					for(var j = 0; j < this.commentArr[i].length; j++) {
						newarr.push(this.commentArr[i][j])
					}
				}
			}
			this.categoryList = newarr;
			this.loading = false;
		}).catch((wrong) => {
			// this.$message({
			// 	message: '网络错误，请重试',
			// 	type: 'error'
			// });
		})
	},
	determine(){
		if(this.selUser.length == 0){
			this.$message({
				message: '请选择数据',
				type: 'warning'
			});
		}else if(this.selUser.length > 1){
			this.$message({
				message: '不可同时选择多条数据',
				type: 'warning'
			});
		}else{
			var moduleObj = {
				id: this.selUser[0].ID,
				num: this.selUser[0].PT_NUM,
				desc: this.selUser[0].DECRIPTION
			};
			this.$emit('showModule',moduleObj);
			this.resetBasisInfo();//调用resetBasisInfo函数
		}
	},
	resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
		this.dialogtemplate = false;//关闭弹出框
		this.categoryList = [];//列表数据置空
		this.page.currentPage = 1;//页码重新传值
		this.page.pageSize = 10;//页码重新传值
	},
  },
  mounted() {
		// this.requestData();
	},
}
</script>

<style>
</style>