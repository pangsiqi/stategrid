<template>
<div>
	<div class="headerbg">
		<vheader></vheader>
		<navs_tabs ref='navsTabs'></navs_tabs>
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
							<button v-for="item in buttons" class="btn mr5" :class="item.style" @click="getbtn(item)">
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
				<div v-show="search">
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="10">
							<el-col :span="5">
								<el-form-item label="溯源记录编号" prop="RECORDNUM" label-width="100px">
									<el-input v-model="searchList.RECORDNUM" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="记录描述" prop="DESCRIPTION">
									<el-input v-model="searchList.DESCRIPTION" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="设备编号" prop="ASSETNUM">
									<el-input v-model="searchList.ASSETNUM" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="设备名称" prop="A_NAME">
									<el-input v-model="searchList.A_NAME" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="10">
							<el-col :span="5">
								<el-form-item label="溯源方式" prop="PM_MODEL" label-width="100px">
									<el-input v-model="searchList.PM_MODEL" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="证书编号" prop="C_NUM">
									<el-input v-model="searchList.C_NUM" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
								<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px;margin-left: 2px">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<!-- 高级查询划出 End-->
				<el-row :gutter="0">
					<el-col :span="24">
						<!-- 表格 Begin-->
						<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
							<el-table-column label="溯源记录编号" width="120" sortable prop="RECORDNUM" v-if="this.checkedName.indexOf('溯源记录编号')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.RECORDNUM}}
									</p>
								</template>
							</el-table-column>
							<el-table-column label="记录描述" width="200" sortable prop="DESCRIPTION" v-if="this.checkedName.indexOf('记录描述')!=-1">
							</el-table-column>
							<el-table-column label="设备编号" width="140" sortable prop="ASSETNUM" v-if="this.checkedName.indexOf('设备编号')!=-1">
							</el-table-column>
							<el-table-column label="设备名称" width="200" sortable prop="A_NAME" v-if="this.checkedName.indexOf('设备名称')!=-1">
							</el-table-column>						
							<el-table-column label="规格型号" width="120" sortable prop="MODEL"  v-if="this.checkedName.indexOf('规格型号')!=-1">
							</el-table-column>
							<el-table-column label="溯源方式" width="120" sortable prop="PM_MODEL"  v-if="this.checkedName.indexOf('溯源方式')!=-1">
							</el-table-column>
							<el-table-column label="溯源日期" width="140" sortable prop="PM_DATE" :formatter="dateFormat" v-if="this.checkedName.indexOf('溯源日期')!=-1">
							</el-table-column>
							<el-table-column label="确认结论" width="160" sortable prop="R_CONCLUSION" v-if="this.checkedName.indexOf('确认结论')!=-1">
							</el-table-column>
							<el-table-column label="证书编号" width="140" sortable prop="C_NUM" v-if="this.checkedName.indexOf('证书编号')!=-1">
							</el-table-column>
							<el-table-column label="设备性能指标要求" width="200" sortable prop="A_KPI"  v-if="this.checkedName.indexOf('设备性能指标要求')!=-1">
							</el-table-column>
							<el-table-column label="指标确定来源" width="160" sortable prop="SORUCE" v-if="this.checkedName.indexOf('指标确定来源')!=-1">
							</el-table-column>
							<el-table-column label="确认内容" width="200" sortable prop="R_DESC" v-if="this.checkedName.indexOf('确认内容')!=-1">
							</el-table-column>
						</v-table>
						<!-- 表格 End-->
					</el-col>
				</el-row>
			</div>
		</div>
		<!--右侧内容显示 End-->
		<detailPage :detailData="selUser[0]" ref="child" @request="requestData"></detailPage>
		<!--报表-->
		<reportmask :reportData="reportData" ref="reportChild"></reportmask>
	</div>
</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import detailPage from '../equipmentsDetails/traceRec_mask.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'user_management',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'detailPage': detailPage,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'pmRecord',
				reportData:{},//报表的数据
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				basic_url: Config.dev_url,
				dataUrl: '/api/api-user/users',
				checkedName: [
					'溯源记录编号',
					'记录描述',
					'设备编号',
					'设备名称',
					'规格型号',
					'溯源方式',
					'溯源日期',	
					'确认结论',
					'证书编号',
					'设备性能指标要求',
					'指标确定来源',
					'确认内容'
				],
				tableHeader: [
					{
						label: '溯源记录编号',
						prop: 'RECORDNUM'
					},
					{
						label: '记录描述',
						prop: 'DESCRIPTION'
					},
					{
						label: '设备编号',
						prop: 'ASSETNUM'
					},
					{
						label: '设备名称',
						prop: 'A_NAME'
					},
					{
						label: '规格型号',
						prop: 'MODEL'
					},
					{
						label: '溯源方式',
						prop: 'PM_MODEL'
					},
					{
						label: '溯源日期',
						prop: 'PM_DATE'
					},
					{
						label: '确认结论',
						prop: 'R_CONCLUSION'
					},
					{
						label: '证书编号',
						prop: 'C_NUM'
					},
					{
						label: '设备性能指标要求',
						prop: 'A_KPI'
					},
					{
						label: '指标确定来源',
						prop: 'SORUCE'
					},
					{
						label: '确认内容',
						prop: 'R_DESC'
					}
				],
				leftNavs: [//leftNavs左侧菜单数据
					{
						navicon: 'icon-user',
						navtitle: '用户管理',
						navherf: '/personinfo'
					}, {
						navicon: 'icon-edit',
						navtitle: '机构管理',
						navherf: '/dept_management'
					}, {
						navicon: 'icon-role-site',
						navtitle: '角色管理',
						navherf: '/role_management'
					}, {
						navicon: 'icon-file-text',
						navtitle: '客户管理',
						navherf: '/customer_management'
					}, {
						navicon: 'icon-file-text',
						navtitle: '产品类别',
						navherf: '/products_category'
					}, {
						navicon: 'icon-file-text',
						navtitle: '产品',
						navherf: '/products'
					}, {
						navicon: 'icon-file-text',
						navtitle: '检验/检测标准',
						navherf: '/testing_standard'
					}, {
						navicon: 'icon-file-text',
						navtitle: '检验/检测项目',
						navherf: '/testing_projects'
					}, {
						navicon: 'icon-file-text',
						navtitle: '检验/检测方法',
						navherf: '/testing_methods'
					}, {
						navicon: 'icon-file-text',
						navtitle: '自动编号设置',
						navherf: '/number_settings'
					}
				],
				companyId: '',
				deptId: '',
				selUser: [],
				userList: [],
				search: false,
				show: false,
				down: true,
				up: false,
				isShow: false,
				ismin:true,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					DESCRIPTION: '',
					ASSETNUM: '',
					A_NAME: '',
					RECORDNUM: '',
					PM_MODEL: '',
					C_NUM: '',
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				userData:[],
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				aaaData:[],
				buttons:[],
				pmRecord:'pmRecord'//appname
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
					DESCRIPTION: '',
					ASSETNUM: '',
					A_NAME: '',
					RECORDNUM: '',
					PM_MODEL: '',
					C_NUM: '',
				};
				this.requestData('init');
			},
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
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
			//添加用戶
			openAddMgr() {
				this.$refs.child.visible();
			},
			//修改用戶
			modify() {
				if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要修改的数据',
						type: 'warning'
					});
					return;
				} else if(this.selUser.length > 1) {
					this.$message({
						message: '不可同时修改多个数据',
						type: 'warning'
					});
					return;
				} else {
					this.$refs.child.detail();
				}
			},
			//查看
			view(data) {
				this.$refs.child.view(data);
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
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-apps/app/pmRecord/deletes';
					//changeUser为勾选的数据
					var changeUser = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for(var i = 0; i < changeUser.length; i++) {
						deleteid.push(changeUser[i].ID);
					}
					//ids为deleteid数组用逗号拼接的字符串
					ids = deleteid.toString(',');
					var data = {
						ids: ids,
					}
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {
							params: data
						}).then((res) => { //.delete 传数据方法
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
					}).catch(() => {

					});
				}
			},
			// 删除
			physicsDel() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-apps/app/pmRecord/physicsDel';
					//changeUser为勾选的数据
					var changeUser = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for(var i = 0; i < changeUser.length; i++) {
						deleteid.push(changeUser[i].ID);
					}
					//ids为deleteid数组用逗号拼接的字符串
					ids = deleteid.toString(',');
					var data = {
						ids: ids,
					}
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {
							params: data
						}).then((res) => { //.delete 传数据方法
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
					}).catch(() => {

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
			//报表
			reportdata(){
				this.reportData.app=this.pmRecord;
				this.$refs.reportChild.visible();
			},
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			insert() {
				this.users.push(this.user)
			},
			remove(index) {
				this.users.splice(index, 1)
			},
			searchinfo(index) {
				this.requestData('init');
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
				}).catch((wrong) => {})
		    },
		}
	}
</script>