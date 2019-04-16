<template>
<div>
	<div class="headerbg">
		<vheader></vheader>
		<navs_tabs ref="navsTabs"></navs_tabs>
	</div>
	<div class="contentbg">
		<!--左侧菜单内容显示 Begin-->
		<navs_left ref="navleft" v-on:childByValue="childByValue"></navs_left>
		<!--左侧菜单内容显示 End-->

		<!--右侧内容显示 Begin-->
		<div class="wrapper wrapper-content">
			<div class="ibox-content">
				<div class="fixed-table-toolbar clearfix">
					<div class="bs-bars pull-left">
						<div class="hidden-xs" id="roleTableToolbar" role="group">
							<button v-for="item in buttons" :key='item.id' :class="'btn mr5 '+ item.style" @click="getbtn(item)">
									<i :class="item.icon"></i>{{item.name}}
							</button>
						</div>
					</div>
					<div class="columns columns-right btn-group pull-right">
						<div id="refresh" title="刷新" class="btn btn-default btn-refresh"><i class="icon-refresh"></i></div>
						<tableControle :tableHeader="tableHeader" :checkedName="checkedName"  @tableControle="tableControle" ref="tableControle"></tableControle>
					</div>
				</div>
				<!-- 高级查询划出 Begin-->
				<div v-show="search" class="pb10">
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="10">
							<el-col :span="5">
								<el-input v-model="searchList.name" @keyup.enter.native="searchinfo">
									<template slot="prepend">报表文件名称</template>
								</el-input>
							</el-col>
							<el-col :span="4">
								<el-button type="primary" @click="searchinfo" size="small">搜索</el-button>
								<el-button type="primary" @click="resetbtn" size="small">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<!-- 高级查询划出 End-->
				<el-row :gutter="0">
					<el-col :span="24">
						<!-- 表格 Begin-->
						<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
							<el-table-column label="报表文件名称" sortable prop="name" v-if="this.checkedName.indexOf('报表文件名称')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.name}}
									</p>
								</template>
							</el-table-column>
							<el-table-column label="录入人" width="140" sortable prop="createby" v-if="this.checkedName.indexOf('录入人')!=-1">
							</el-table-column>	
							<el-table-column label="修改人" width="140" sortable prop="updateby" v-if="this.checkedName.indexOf('修改人')!=-1">
							</el-table-column>
						</v-table>
					</el-col>
				</el-row>
			</div>
		</div>
		<!--右侧内容显示 End-->
		<iframemask ref="child"  @request="requestData" ></iframemask>
	</div>
</div>
</template>
<script>
	import Config from '../../config.js';
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import iframemask from '../reportDetails/reportfileMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'report',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'tableControle': tableControle,
			'iframemask': iframemask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'reportFile',
				commentArr: {},
				basic_url: Config.dev_url,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				checkedName: [
					'报表文件名称',
					'录入人',
					'修改人',
				],
				tableHeader: [
					{
						label: '报表文件名称',
						prop: 'name'
					},
					{
						label: '录入人',
						prop: 'createby'
					},
					{
						label: '修改人',
						prop: 'updateby'
					},
				],
				selUser: [],
				reportsList: [],
				search: false,
				show: false,
				down: true,
				up: false,
				isShow: false,
				ismin:true,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					name: '',
				},
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				buttons:[],
			}
		},
		methods: {
			setSelData(val){
				this.selUser = val;
			},
			tableControle(data){
				this.checkedName = data;
			},
		    resetbtn(){
				this.searchList = { //点击高级搜索后显示的内容
					name: '',
				};
				this.requestData('init');
			},
			searchinfo() {
				this.requestData('init');
			},
			//请求点击
		    getbtn(item){
		    	if(item.name=="添加"){
		         this.openAddMgr();
		    	}else if(item.name=="修改"){
		    	 this.modify();
		    	}else if(item.name=="彻底删除"){
		    	 this.physicsDel();
		    	}else if(item.name=="高级查询"){
		    	 this.modestsearch();
		    	}else if(item.name=="导入"){
		    	 this.download();
		    	}else if(item.name=="删除"){
		    	 this.deluserinfo();
		    	}else if(item.name=="报表"){
			     this.reportdata();
				}else if(item.name=="打印"){
				   this.Printing();
				}
		    },
			//添加
			openAddMgr() {
				this.$refs.child.visible();
			},
			//修改
			modify() {
				if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要修改的用户',
						type: 'warning'
					});
					return;
				} else if(this.selUser.length > 1) {
					this.$message({
						message: '不可同时修改多个用户',
						type: 'warning'
					});
					return;
				} else {
					this.$refs.child.detail(this.selUser[0].id);
				}
			},
			 view(){
//				this.$refs.categorymask.view();
				this.$refs.reportchild.visible();
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
				this.down = !this.down,
					this.up = !this.up
			},
			// 删除
			deluserinfo() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的用户',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时删除多个用户',
						type: 'warning'
					});
					return;
				} else {
					var id = selData[0].id;
					var url = this.basic_url + '/api-report/report/' + id;
					this.$axios.delete(url, {}).then((res) => {//.delete 传数据方法
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.requestData();
						}
					}).catch((err) => {
					});
				}
			},
			// 导入
			importData() {
				
			},
			// 导出
			exportData() {
				
			},
			// 打印
			Printing() {
				
			},
			
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			//Table默认加载数据
			requestData(opt) {
				this.$refs.table.requestData(opt);
			},
			childByValue(childValue) {
        		// childValue就是子组件传过来的值
				this.$refs.navsTabs.showClick(childValue);
				this.getbutton(childValue);
			},
			  //请求页面的button接口
		    getbutton(childByValue){
		    	var data = {
					menuId: childByValue.id,
					roleId: this.$store.state.roleid,
				};
				var url = this.basic_url + '/api-user/permissions/getPermissionByRoleIdAndSecondMenu';
				this.$axios.get(url, {params: data}).then((res) => {
					this.buttons = res.data;
				}).catch((wrong) => {
				})
		    },
		},
	}
</script>

<style scoped>

</style>