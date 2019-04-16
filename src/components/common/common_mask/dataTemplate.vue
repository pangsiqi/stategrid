<template>
	<div>
		<el-dialog :modal-append-to-body="false" 
				   title="模板" 
				   :visible.sync="dialogVisible" 
				   width="80%"
				   :before-close="reset">
			<el-table ref="singleTable" 
				:data="list" 
				line-center 
				border 
				stripe 
				height="360px" 
				style="width: 100%;" 
				:default-sort="{prop:'productList', order: 'descending'}"
				v-loadmore="loadMore"
				v-loading="loading"  
				element-loading-text="加载中…"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(255, 255, 255, 0.9)">
				<el-table-column label="模板编号" width="155" sortable prop="PT_NUM">
				</el-table-column>
				<el-table-column label="模板描述" sortable prop="DECRIPTION">
					<template slot-scope="scope">
						<p class="blue" title="下载模板文件" @click="downLoad(scope.row)">{{scope.row.DECRIPTION}}
						</p>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background 
						   class="text-right pt10" 
						   @size-change="sizeChange" 
						   @current-change="currentChange" 
						   :current-page="page.currentPage" 
						   :page-sizes="[10, 20, 30, 40,100]" 
						   layout="total, sizes, prev, pager, next" 
						   :total="page.totalCount">
			</el-pagination>
			<div slot="footer">
				<!-- <el-button type="primary" @click="determine">确 定</el-button> -->
				<el-button @click="reset">取 消</el-button>
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
		dialogVisible: false,
		basic_url: Config.dev_url,
		file_url: Config.file_url,
		loading: false,
		loadSign:true,//加载
		list: [],
		dialogProduct: false,
		commentArr:{},
		selUser: [],//接勾选的值
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
		},
		allDepts: '',
		DEPTID:'',//当前选择的机构值
		CJDW:'',//机构编号
		NUM:'',//产品类别编号
		appname:'',//appname
		NUM:'',//产品类别的编号
		docParm: {}
    }
  },

  methods: {
	getDocParm(){
		this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
			this.docParm.userid = res.data.id;
			this.docParm.username = res.data.username;
			this.docParm.deptid = res.data.deptId;
			this.docParm.deptfullname = res.data.deptName;
		}).catch((err)=>{});
	},
	downLoad(row){
		var url = this.file_url + '/file/fileList?page=0&size=10';
		this.$axios.post(url,{
			'appname': '检验检测项目_原始数据模板',
			'recordid': row.ID,
		}).then((res) => {
			var resData = res.data.fileList;
			var data = resData.length > 0 ? resData[0] : {};
			var url = data.filepath 
				+ '&userid=' + this.docParm.userid
				+ '&username=' + this.docParm.username
				+ '&deptid=' + this.docParm.deptid
				+ '&deptfullname=' + this.docParm.deptfullname;
			window.open(url);
		}).catch((err) => {});
	},
  	sizeChange(val) {
		this.page.pageSize = val;
		this.requestData();
	},
	currentChange(val) {
		this.page.currentPage = val;
		this.requestData();
	},
	showData(id){
		this.dialogVisible = true;
		this.deptId = id;
		this.getDocParm();
		this.requestData();
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
		};
		var url = this.basic_url + '/api-apps/app/rawDataTem';
		this.$axios.get(url, {}).then((res) => {
			this.page.totalCount = res.data.count;
			//总的页数
			let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize)
			if(this.page.currentPage >= totalPage) {
				this.loadSign = false
			} else {
				this.loadSign = true
			}
			this.list = res.data.data;
			this.loading = false;
		}).catch((wrong) => {})
	},
	submit(){
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
			var proarr = [];
			proarr.push(this.selUser[0].PRO_NUM);
			proarr.push(this.selUser[0].PRO_NAME);
			proarr.push(this.selUser[0].VERSION);
			this.$emit('appenddata',proarr);
			this.requestData();
			this.resetBasisInfo();//调用resetBasisInfo函数
		}
	},
	
    reset(){//点击确定或取消按钮时重置数据20190303
        this.dialogVisible = false;//关闭弹出框
        this.list = [];//列表数据置空
        this.page.currentPage = 1;//页码重新传值
        this.page.pageSize = 20;//页码重新传值
    },
  }
}
</script>

<style>
</style>