<template>
	<div>
		<div class="headerbg">
			<vheader></vheader>
			<navs_tabs  ref="navsTabs"></navs_tabs>
		</div>
		<div class="contentbg">
			<!--左侧菜单内容显示 Begin-->
			<navs_left ref="navleft" v-on:childByValue="childByValue"></navs_left>
			<!--左侧菜单内容显示 End-->
			<!--右侧内容显示 Begin-->
			<div class="wrapper wrapper-content">
				<div class="ibox-content">
					<!--<navs_button></navs_button>-->
					<div class="fixed-table-toolbar clearfix">
						<div class="bs-bars pull-left">
							<div class="hidden-xs" id="roleTableToolbar" role="group">
								<button type="button" class="btn btn-green" @click="openAddMgr" id="">
                                	<i class="icon-add"></i>添加
                      			 </button>
								<button type="button" class="btn btn-blue button-margin" @click="modify">
								    <i class="icon-edit"></i>修改
								</button>
								<button type="button" class="btn btn-red button-margin" @click="deluserinfo">
								    <i class="icon-trash"></i>删除
								</button>
								<button type="button" class="btn btn-primarys button-margin" @click="modestsearch">
						    		<i class="icon-search"></i>高级查询
						    		<i class="icon-arrow1-down" v-show="down"></i>
						    		<i class="icon-arrow1-up" v-show="up"></i>
								</button>
							</div>
						</div>
						<div class="columns columns-right btn-group pull-right">
							<div id="refresh" title="刷新" class="btn btn-default btn-refresh"><i class="icon-refresh"></i></div>
							<tableControle :tableHeader="tableHeader" :checkedName="checkedName" @tableControle="tableControle" ref="tableControle"></tableControle>
						</div>
					</div>
					<!-- 高级查询划出 Begin-->
					<div v-show="search" class="pb10">
						<el-form inline-message :model="searchList" label-width="70px">
							<el-row :gutter="30" class="pb5">
								<el-col :span="7">
									<el-input v-model="searchList.keywordname">
										<template slot="prepend">关键字名称</template>
									</el-input>
								</el-col>
								<el-col :span="7">
									<el-input v-model="searchList.categoryidDesc">
										<template slot="prepend">关键字分类ID</template>
									</el-input>
								</el-col>
								<el-col :span="3">
									<el-button type="primary" @click="searchinfo" size="small" style="margin:4px">搜索</el-button>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<!-- 高级查询划出 End-->

					<el-row :gutter="0">
						<!-- 左侧树菜单 Begin-->
						<!-- <el-col :span="5" class="lefttree" id="left">
							<div class="lefttreebg">
								<div class="left_tree_title clearfix" @click="min3max()">
									<div class="pull-left pr20" v-if="ismin">关键字分类</div>
									<span class="pull-right navbar-minimalize minimalize-styl-2">
										<i class="icon-doubleok icon-double-angle-left blue"></i>
									</span>
								</div>
								<div class="left_treebg" :style="{height: fullHeight}">
									<div class="p15" v-if="ismin">
										<el-tree ref="tree" class="filter-tree" :data="resourceData" node-key="id" default-expand-all :indent="22" :render-content="renderContent" :props="resourceProps" @node-click="handleNodeClick">
										</el-tree>
									</div>
								</div>
							</div>
						</el-col> -->
						<!-- 左侧树菜单 End-->
						
						<el-col class="leftcont">
							<!-- 表格 -->
							<el-table :data="samplesList" 
									  border 
									  stripe 
									  :height="fullHeight" 
									  style="width: 100%;" 
									  :default-sort="{prop:'samplesList', order: 'descending'}" 
									  @selection-change="SelChange"
									  v-loading="loading"  
								      element-loading-text="加载中…"
    							      element-loading-spinner="el-icon-loading"
    							      element-loading-background="rgba(255, 255, 255, 0.9)">
								<el-table-column type="selection" width="55" fixed v-if="this.checkedName.length>0">
								</el-table-column>
								<el-table-column label="关键字" sortable prop="keywordname" v-if="this.checkedName.indexOf('关键字')!=-1">
								</el-table-column>
								<el-table-column label="分类" sortable prop="categoryidDesc" v-if="this.checkedName.indexOf('分类')!=-1">
								</el-table-column>
								<el-table-column label="用户名称" sortable prop="username" v-if="this.checkedName.indexOf('用户名称')!=-1">
								</el-table-column>
								<el-table-column label="用户部门" sortable prop="deptfullname" v-if="this.checkedName.indexOf('用户部门')!=-1">
								</el-table-column>
								<el-table-column label="录入时间" sortable prop="createtime" v-if="this.checkedName.indexOf('录入时间')!=-1">
								</el-table-column>
							</el-table>
							
							<el-pagination background class="text-right pt10" v-if="this.checkedName.length>0" 
								@size-change="sizeChange" 
								@current-change="currentChange" 
								:current-page="page.currentPage" 
								:page-sizes="[10, 20, 30, 40]" 
								layout="total, sizes, prev, pager, next" 
								:total="page.totalCount">
							</el-pagination>
							<!-- 表格 -->
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<keywordmask ref="child" @request="requestData" :detailData="selMenu[0]"></keywordmask>
		<!--右侧内容显示 End-->
	</div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import keywordmask from'../documentDetails/keyword_mask.vue'
	export default {
		name: 'samples',//接样
		components: {
			vheader,
			navs_tabs,
			navs_left,
			tableControle,
			keywordmask,
		},
		data() {
			return {
				loading: false,
				basic_url: Config.dev_url,
				isShow: false,
				ismin: true,
				loadSign: true, //加载
				commentArr: {},
				checkedName: [
					'关键字',
					'分类',
					'用户名称',
					'用户部门',
					'录入时间',
				],
				tableHeader: [
					{
						label: '关键字',
						prop: 'keywordname'
					},
					{
						label: '分类',
						prop: 'categoryidDesc'
					},
					{
						label: '用户名称',
						prop: 'username'
					},
					{
						label: '用户部门',
						prop: 'deptfullname'
					},
					{
						label: '录入时间',
						prop: 'createtime'
					}
				],
				selMenu: [],
				samplesList: [],
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				search: false,
				show: false,
				down: true,
				up: false,
				searchList: {
					keywordname: '',
					categoryidDesc: ''
				},
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				samplesForm: {},//修改子组件时传递数据
				companyId: '',
				deptId: ''
			}
		},
		methods: {
			tableControle(data) {//控制表格列显示隐藏
				this.checkedName = data;
			},
			sizeChange(val) {//分页，总页数
				this.page.pageSize = val;
				this.requestData();
			},
			currentChange(val) {//分页，当前页
				this.page.currentPage = val;
				this.requestData();
			},
			searchinfo(index) {//高级查询
				this.page.currentPage = 1;
				this.page.pageSize = 10;
				this.requestData();
			},
			//添加样品管理
			openAddMgr() {
				this.$refs.child.visible();
			},
			//修改用戶
			modify() {
				if(this.selMenu.length == 0) {
					this.$message({
						message: '请您选择要修改的数据',
						type: 'warning'
					});
					return;
				} else if(this.selMenu.length > 1) {
					this.$message({
						message: '不可同时修改多条数据',
						type: 'warning'
					});
					return;
				} else {
					this.$refs.child.detail();
				}
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
				this.down = !this.down,
				this.up = !this.up
			},
			// 删除
			deluserinfo() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-apps/app/tbKeyword2/deletes';
					//changeMenu为勾选的数据
					var changeMenu = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeMenu.length; i++) {
						deleteid.push(changeMenu[i].id);
					}
					//ids为deleteid数组用逗号拼接的字符串
					ids = deleteid.toString(',');
                    var data = {
						ids: ids,
					}
					this.$confirm('确定删除此数据吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        this.$axios.delete(url, {params: data}).then((res) => {//.delete 传数据方法
						//resp_code == 0是后台返回的请求成功的信息
							if(res.data.resp_code == 0) {
								this.$message({
									message: '删除成功',
									type: 'success'
								});
								this.requestData();
							}else{
								this.$message({
									message: res.data.resp_msg,
									type: 'success'
								});
							}
						}).catch((err) => {
						});
                    }).catch(() => {

                	});
				}
			},
			SelChange(val) {//选中值后赋值给一个自定义的数组：selMenu
				this.selMenu = val;
			},
			requestData(index) {
				this.loading = true;
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					categoryidDesc: this.searchList.categoryidDesc,
				}
				var url = this.basic_url + '/api-apps/app/tbKeyword2';
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					this.page.totalCount = res.data.count;
					this.samplesList = res.data.data;
					this.loading = false;
				}).catch((wrong) => {})
			},
			
			min3max() { //左侧菜单正常和变小切换
				if($(".lefttree").hasClass("el-col-5")) {
					$(".lefttree").removeClass("el-col-5");
					$(".lefttree").addClass("el-col-1");
					$(".leftcont").removeClass("el-col-19");
					$(".leftcont").addClass("el-col-23");
					$(".icon-doubleok").removeClass("icon-double-angle-left");
					$(".icon-doubleok").addClass("icon-double-angle-right");
				} else {
					$(".lefttree").removeClass("el-col-1");
					$(".lefttree").addClass("el-col-5");
					$(".leftcont").removeClass("el-col-23");
					$(".leftcont").addClass("el-col-19");
					$(".icon-doubleok").removeClass("icon-double-angle-right");
					$(".icon-doubleok").addClass("icon-double-angle-left");
				}
				this.ismin = !this.ismin;
			},
			childByValue:function(childValue) {
        		// childValue就是子组件传过来的值
        		this.$refs.navsTabs.showClick(childValue);
      		},
      		
		},
		
		mounted() {// 在页面挂载前就发起请求
			this.requestData();
		},
	}
</script>

<style scope>
.p15 {padding:10px 15px;}
</style>