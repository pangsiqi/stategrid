<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="产品类别" height="360px" :visible.sync="dialogapp" width="80%" :before-close="handleClose">
			<el-table ref="table" :header-cell-style="rowClass"
				:data="categoryList"
					border
					stripe
					:height="fullHeight"
					style="width: 100%;"
					:default-sort="{prop:'categoryList', order: 'descending'}"
					@selection-change="SelChange"
					v-loadmore="loadMore"
				v-loading="loading"
				element-loading-text="加载中…"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(255, 255, 255, 0.9)">
				<el-table-column type="selection" fixed width="55"  align="center">
				</el-table-column>

				<el-table-column label="应用名称" width="160" sortable prop="appName">									
				</el-table-column>
				<el-table-column label="处理类名" width="200" sortable prop="handleclass">									
				</el-table-column>
				<el-table-column label="sql"  align="left" sortable prop="sqlstr">		
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
		userid:'',	
		basic_url: Config.dev_url,
		loadSign: true, //鼠标滚动加载数据
		loading: false,//默认加载数据时显示loading动画
		categoryList: [],
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
	visible(userid) {
		this.userid=userid;
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
				this.loading = true;
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				}
				var url = this.basic_url + '/api-user/dataRestrict';
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
					this.categoryList = res.data.data;
					this.loading = false;
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}
				var url = this.basic_url + '/api-user/users/findDataRestrictByuserId/'+this.userid;
					this.$axios.get(url, {}).then((res) => {
						var check=res.data;
						// this.$refs.table.toggleRowSelection(res.data);
						this.$nextTick(()=>{
								if(this.categoryList!==undefined&&check!==undefined){
									 this.categoryList.forEach((v,i)=>{
										 check.forEach((_v,i)=>{
											 if(_v!=null){
												 if(v.id==_v){
													 this.$refs.table.toggleRowSelection(v,true);
												 }
											 }
										 })
									 })
								}
						})
					})

				}).catch((wrong) => {
					this.$message({
						message: '网络错误，请重试',
						type: 'error'
					});
				})
			},
	determine(){
		var restrictIds = [];
		var ids;
		for(var i = 0; i <this.selUser.length; i++) {
			restrictIds.push(this.selUser[i].id);
		}
		//ids为deleteid数组用逗号拼接的字符串
		ids = restrictIds.toString(',');
		var data = {
					restrictIds: ids,
				}
			if(this.selUser.length == 0){
				this.$message({
					message: '请选择数据',
					type: 'warning'
				});
			}else{
				this.resetBasisInfo();//调用resetBasisInfo函数
					var url = this.basic_url + '/api-user/dataRestrict/saveUserRestrict/'+this.userid+'/'+ids;
				this.$axios.get(url, {}).then((res) => {
					if(res.data.resp_code == 0) {
								this.$message({
									message: '操作成功',
									type: 'success'
								});
								this.$emit('request');
						}
				}).catch((wrong) => {
					this.$message({
						message: '网络错误，请重试',
						type: 'error'
					});
				})
			}
    },
    
    resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
        this.dialogapp = false;//关闭弹出框
        this.categoryList = [];//列表数据置空
        this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 20;//页码重新传值
				this.$emit('request');
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