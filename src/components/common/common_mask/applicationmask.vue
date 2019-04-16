<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="产品类别" height="360px" :visible.sync="dialogapp" width="80%" :before-close="handleClose">
			<el-form inline-message :model="searchList" label-width="45px">
				<el-row :gutter="10">
					<el-col :span="5">
						<el-form-item label="编码" prop="NUM">
							<el-input v-model="searchList.NUM"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="名称" prop="TYPE">
							<el-input v-model="searchList.TYPE"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="版本" prop="VERSION">
							<el-input v-model="searchList.VERSION"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
						<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px; margin-left: 2px">重置</el-button>
					</el-col>
				</el-row>
			</el-form>

			<el-table ref="table" :header-cell-style="rowClass" 
									:data="applicationList" 
									border 
									stripe 
									:height="fullHeight" 
									style="width: 100%;" 
									:default-sort="{prop:'applicationList', order: 'descending'}" 
									@selection-change="SelChange" 
									v-loadmore="loadMore"
									v-loading="loading"  
									element-loading-text="加载中…"
									element-loading-spinner="el-icon-loading"
									element-loading-background="rgba(255, 255, 255, 0.9)">
					<el-table-column type="selection" fixed width="55" align="center">
					</el-table-column>
					<el-table-column label="应用英文名称" width="155" sortable prop="code" >
					</el-table-column>
					<el-table-column label="应用名称" width="150" sortable prop="name">
					</el-table-column>
					<el-table-column label="处理类" width="250" sortable prop="handleclass">
					</el-table-column>
					<el-table-column label="应用描述" width="185" sortable prop="description">
					</el-table-column>
					<el-table-column label="数据库表" width="185" sortable prop="object_id">
					</el-table-column>
					<el-table-column label="模块" width="185" sortable prop="module">
					</el-table-column>
					<el-table-column label="排序" width="120" align="right" sortable prop="sort">
					</el-table-column>
					<el-table-column label="录入时间" width="120" prop="createTime" sortable :formatter="dateFormat">
					</el-table-column>
					<el-table-column label="变更时间" width="120" prop="updateTime" sortable :formatter="dateFormat">
					</el-table-column>
					<el-table-column label="流程" width="120" prop="flowkey" sortable :formatter="dateFormat">
					</el-table-column>
					<el-table-column label="流程代办单据号" width="180" prop="flow_todo_num" sortable :formatter="dateFormat">
					</el-table-column>
					<el-table-column label="流程代办描述" width="180" prop="flow_todo_desc" sortable :formatter="dateFormat">
					</el-table-column>
			</el-table>

				<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40,100]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
		    </el-pagination>

				<!-- 表格 End-->
				<div slot="footer">
			       <el-button type="primary" @click="determine">确 定</el-button>
			       <el-button @click="resetBasisInfo">取 消</el-button>
			    </div>
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
		loadSign: true, //鼠标滚动加载数据
		loading: false,//默认加载数据时显示loading动画
		productList: [],
		commentArr:{},
		selUser: [],//接勾选的值
		DEPTID:'',//当前选择的机构值
		applicationList:[],
		dialogapp:false,
		fullHeight: document.documentElement.clientHeight - 200 +'px',//获取浏览器高度
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
  	
	searchinfo() {
		this.page.currentPage = 1;
		this.page.pageSize = 20;
		this.requestData();
	},
	resetbtn(){
		this.searchList = {
			NUM:'',
			VERSION:'',
			DEPTID: '',
		}
	},
  	//点击关闭按钮
	close() {
		this.dialogapp = false;
	},
	visible() {
		this.dialogapp = true;
		this.requestData();
	},
  	//表格滚动加载
		loadMore() {
			let up2down = sessionStorage.getItem('up2down');
			if(this.loadSign) {					
				if(up2down=='down'){
					this.page.currentPage++;
					if(this.page.currentPage > Math.ceil(this.page.totalCount / this.page.pageSize)) {
						this.page.currentPage = Math.ceil(this.page.totalCount / this.page.pageSize)
						return false;
					}
					let append_height = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
					if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
						$('.el-table__body-wrapper table').append('<div class="filing" style="height: '+append_height+'px;width: 100%;"></div>');
						sessionStorage.setItem('toBtm','true');
					}
				}else{
					sessionStorage.setItem('toBtm','false');
					this.page.currentPage--;
					if(this.page.currentPage < 1) {
						this.page.currentPage=1;
						return false;
					}
				}
				this.loadSign = false;
				setTimeout(() => {
					this.loadSign = true;
				}, 1000)
				this.requestData();
			}
		},
		//改变页数
		sizeChange(val) {
			this.page.pageSize = val;
			if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
				$('.el-table__body-wrapper table').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
				sessionStorage.setItem('toBtm','true');
			}else{
				sessionStorage.setItem('toBtm','false');
			}
			this.requestData();
		},
		//当前页数
		currentChange(val) {
			this.page.currentPage = val;
			if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
				$('.el-table__body-wrapper table').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
				sessionStorage.setItem('toBtm','true');
			}else{
				sessionStorage.setItem('toBtm','false');
			}
			this.requestData();
		},
	//Table默认加载数据
requestData() {
			this.loading = true;//加载动画打开
			var data = {
				page: this.page.currentPage,
				limit: this.page.pageSize,
				name: this.searchList.name,
				description: this.searchList.description,
			}
			var url = this.basic_url + '/api-apps/appcfg';
			this.$axios.get(url, {
				params: data
			}).then((res) => {
				this.page.totalCount = res.data.count;
				//总的页数
				let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize)
				if(this.page.currentPage >= totalPage) {
					this.loadSign = false
				} else {
					this.loadSign = true
				}
				this.applicationList = res.data.data;
				this.loading = false;//加载动画关闭
				if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
					$('.el-table__body-wrapper table').find('.filing').remove();
				}//滚动加载数据判断filing
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
			this.$emit('appdata',this.selUser[0].name);
			this.requestData();
			this.resetBasisInfo();//调用resetBasisInfo函数
		}
    },
    
    resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
        this.dialogapp = false;//关闭弹出框
        this.categoryList = [];//列表数据置空
        this.page.currentPage = 1;//页码重新传值
        this.page.pageSize = 20;//页码重新传值
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
                this.resetBasisInfo();
            })
            .catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
    }
  },
  mounted() {
		// this.requestData();
	},
}
</script>

<style>
</style>