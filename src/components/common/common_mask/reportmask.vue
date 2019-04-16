
<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="报表" height="400px" :visible.sync="dialogReport" width="80%" >
			<el-table :data="reportsList" border stripe  height="360px" style="width: 100%;" :default-sort="{prop:'reportsList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore"
			v-loading="loading" 
			element-loading-text="加载中…"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(255, 255, 255, 0.9)">
				<el-table-column type="selection" width="55" >
				</el-table-column>
				<el-table-column label="代码" width="200" sortable prop="code">
				</el-table-column>
				<el-table-column label="报表名称" width="200" sortable prop="name">
				</el-table-column>
				<el-table-column label="id" sortable prop="id" >
				</el-table-column>
				<el-table-column label="报表文件" sortable prop="file">
				</el-table-column>
				<el-table-column label="备注" sortable prop="remarks">
				</el-table-column>
				<el-table-column label="类型" sortable prop="type">
				</el-table-column>						
				<el-table-column label="录入人" sortable prop="createby">
				</el-table-column>	
				<el-table-column label="录入时间" sortable prop="createdate">
				</el-table-column>	
				<el-table-column label="修改人" sortable prop="updateby">
				</el-table-column>
				<el-table-column label="修改时间" sortable prop="updatedate">
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
			<!-- 表格 End-->
			<span slot="footer" class="el-dialog__footer">
		        <el-button type="primary" @click="determine">确 定</el-button>
		        <el-button @click="resetBasisInfo">取 消</el-button>
			</span>
	</el-dialog>
	</div>		
	
</template>

<script>
	import Config from '../../../config.js';
	export default {
  name: 'category',
  
  data() {
    return {
		basic_url: Config.dev_url,
		loading: false,
		loadSign:true,//加载
		reportsList: [],
		commentArr:{},
		selUser: [],//接勾选的值
        dialogReport:false,
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
		},
		searchList: {
			NUM:'',
			VERSION:'',
			DEPTID: '',
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
	close() {
		this.dialogReport = false;
	},
  	visible() {
		this.dialogReport = true;
  	},
  	loadMore () {
	   if (this.loadSign) {
	     this.loadSign = false
	     this.page++
	     if (this.page > 10) {
	       return
	     }
	     setTimeout(() => {
	       this.loadSign = true
	     }, 1000)
	   }
	 },
	getreport(){
		this.loading = true;
		var url = this.basic_url + '/api-report/report';
		this.$axios.get(url, {}).then((res) => {
			this.reportsList = res.data.datas;
			this.loading = false;
			this.page.totalCount = res.data.count;
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
		}else{
			// this.close();
			var reportId=[];
			var reports=[];
			for(var i=0;i<this.selUser.length;i++){			
				reportId.push(this.selUser[i].id);
				reports.push(this.selUser[i].name);
			}
//			var arr = [];
//			arr.push(reportId);
//			arr.push(reports);
			this.$emit('reportid',reportId);
			this.$emit('reports',reports);
			this.resetBasisInfo();//调用resetBasisInfo函数
		}
	},
	resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
		this.dialogReport = false;//关闭弹出框
		this.reportsList = [];//列表数据置空
		this.page.currentPage = 1;//页码重新传值
		this.page.pageSize = 10;//页码重新传值
	},
},
	mounted() {
			this.getreport();
		},
}		

</script>

<style>
</style>