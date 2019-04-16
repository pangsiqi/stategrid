<template>
<div>
		<div class="headerbg">
			<vheader ></vheader>
			<navs_tabs ref='navsTabs'></navs_tabs>	
		</div>
        <div class="contentbg">
	    	<div class="wrapper-content">
				<div class="ibox-content">
					<!--<navs_button></navs_button>-->
					<div class="fixed-table-toolbar clearfix">
						<div class="bs-bars pull-left">
							<div class="hidden-xs" id="roleTableToolbar" role="group">
								<!-- <button type="button" class="btn btn-green" @click="audit">
											<i class="icon-add"></i>审核
								</button> -->
								<button type="button" class="btn btn-primarys button-margin" >
						    		<i class="icon-search"></i>高级查询
								</button>
							</div>
						</div>
						<div class="columns columns-right btn-group pull-right">
							<div id="refresh" title="刷新" class="btn btn-default btn-refresh"><i class="icon-refresh"></i></div>
							<div class="keep-open btn-group" title="列">
								<el-dropdown :hide-on-click="false" class="pl10 btn btn-default btn-outline">
									<span class="el-dropdown-link">
										<font class="J_tabClose"><i class="icon-menu3"></i></font>
										<i class="el-icon-arrow-down icon-arrow2-down"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-checkbox-group v-model="checkedName">
											<el-dropdown-item v-for="(item,index) in tableHeader" :key="index">
												<el-checkbox :label="item.label" name="type"></el-checkbox>
											</el-dropdown-item>
										</el-checkbox-group>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
					</div>
					<!-- 高级查询划出 Begin-->
					<div v-show="search">
						<el-form inline-message :model="searchList">
							<el-row :gutter="5">
								<el-col :span="6">
									<!--<el-form-item label="流程类型" prop="V_NAME"  label-width="100px">
										<el-input v-model="searchList.V_NAME"></el-input>
									</el-form-item>-->
								</el-col>
								<el-col :span="5">
									<el-form-item label="时间" prop="createTime" label-width="70px">
										<el-input v-model="searchList.createTime"></el-input>
									</el-form-item>
								</el-col>
								<!--<el-col :span="5">
									<el-form-item label="代办/已办" prop="REPORT_NUM" label-width="100px">
										<el-input v-model="searchList.REPORT_NUM"></el-input>
									</el-form-item>
								</el-col>-->
							</el-row>
						</el-form>
					</div>
					<!-- 高级查询划出 End-->

					<el-row :gutter="10">
						<el-col :span="24" class="leftcont">
							<!-- 表格 -->
							<el-table :data="todoList" :header-cell-style="rowClass" border stripe :height="fullHeight" style="width: 100%;" :default-sort="{prop:'todoList', order: 'descending'}" @selection-change="SelChange" >
								<el-table-column type="selection" width="55" fixed v-if="this.checkedName.length>0" align="center">
								</el-table-column>
								<!--<el-table-column label="数据id" sortable width="140px" prop="bizid" v-if="this.checkedName.indexOf('数据id')!=-1">-->
								<!-- </el-table-column> -->
								<el-table-column label="单据号" sortable prop="bizNum" v-if="this.checkedName.indexOf('单据号')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=audit(scope.row)>{{scope.row.bizNum}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="App" sortable width="140px" prop="app" v-if="this.checkedName.indexOf('App')!=-1">
								</el-table-column>
								<el-table-column label="当前环节" sortable prop="name" v-if="this.checkedName.indexOf('当前环节')!=-1">
								</el-table-column>
								<el-table-column label="应用" sortable prop="appDesc" v-if="this.checkedName.indexOf('应用')!=-1">
								</el-table-column>
								<el-table-column label="任务状态" sortable width="100px" align="center" prop="state" v-if="this.checkedName.indexOf('任务状态')!=-1">
								</el-table-column>
								<el-table-column label="录入时间" sortable width="160px" prop="createTime" v-if="this.checkedName.indexOf('录入时间')!=-1">
								</el-table-column>
							</el-table>
							<el-pagination background class="text-right pt10" v-if="this.checkedName.length>0" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
							</el-pagination>
							<!-- 表格 -->
						</el-col>
					</el-row>
				</div>
			</div>
        </div>
</div>
</template>

<script>
import Config from '../config.js'
//import maskrouter from '../maskrouter.js'
import vheader from './common/vheader.vue'
import navs_tabs from './common/nav_tabs.vue'

export default {
	name: 'task',
		components: {
			vheader,
			navs_tabs,
		},

    data() {
      return {
      	basic_url: Config.dev_url,
      	fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
      	search: false,
      	todoList:[],
      	commentArr: {},
      	checkedName: [
//					'数据id',
					'App',
					'当前环节',
					'应用',
					'单据号',
					'任务状态',
					'录入时间',
					],
		tableHeader: [
//		{
//			label: '数据id',
//			prop: 'bizid'
//		},
		{
			label: 'App',
			prop: 'app'
		},
		{
			label: '当前环节',
			prop: 'name'
		},
		{
			label: '应用',
			prop: 'appDesc'
		},
		{
			label: '单据号',
			prop: 'bizNum'
		},
		{
			label: '任务状态',
			prop: 'state'
		},
		{
			label: '录入时间',
			prop: 'createTime'
		}],
		searchList: {
				createTime:'',	
			},
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
			},
      }
    },
  
	methods: {
		//表头居中
		rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
		//审核	
		audit(item){
			this.$router.push({path:item.bizMenuUrl ,query: { bizId: item.bizId,}});
			this.$store.dispatch('setMenuIdAct',item.bizFirstMenuId);

		},
		//点击的数据
		SelChange(val) {
			this.selUser = val;
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

					// PRO_NUM: this.searchList.PRO_NUM,
					// PRO_NAME: this.searchList.PRO_NAME,
					// VERSION: this.searchList.VERSION,
					// DEPTID: this.searchList.DEPTID,
					// STATUS: this.searchList.STATUS,
				}
				var url = this.basic_url + '/api-apps/app/flow/flow/todo';
				this.$axios.get(url, {params: data}).then((res) => {
					this.page.totalCount = res.data.count;
					//总的页数
					let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize);
					if(this.page.currentPage >= totalPage) {
						this.loadSign = false
					} else {
						this.loadSign = true
					}
					this.todoList = res.data.data;
					this.loading = false;//加载动画关闭
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}//滚动加载数据判断filing
				}).catch((wrong) => {
					
					
				})
			},
		},
	  mounted(){
	  	this.requestData();
	},
}

</script>

<style scoped>
@import '../assets/css/mask-modules.css';

</style>

