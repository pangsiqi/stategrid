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
					<!--按钮操作行 Begin-->
					<div class="fixed-table-toolbar clearfix">
						<div class="bs-bars pull-left">
							<div class="hidden-xs" id="roleTableToolbar" role="group">
								<button v-for="item in buttons" :key='item.id' :class="'btn mr5 '+ item.style" @click="getbtn(item)">
									<i :class="item.icon"></i>{{item.name}}
								</button>
							</div>
						</div>
						<div class="columns columns-right btn-group pull-right">
							<div id="refresh" title="刷新" class="btn btn-default btn-refresh">
								<i class="icon-refresh"></i>
							</div>
							<tableControle :tableHeader="tableHeader" :checkedName="checkedName" @tableControle="tableControle" ref="tableControle"></tableControle>
						</div>
					</div>
					<!--按钮操作行 End-->

					<!-- 高级查询划出 Begin-->
					<div v-show="search">
						<el-form inline-message :model="searchList" label-width="70px">
							<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="应用名称" prop="name">
										<el-input v-model="searchList.name" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="应用描述" prop="description">
										<el-input v-model="searchList.description" @keyup.enter.native="searchinfo"></el-input>
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
								<el-table-column label="应用英文名称" width="155" sortable prop="code" v-if="this.checkedName.indexOf('应用英文名称')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.code}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="应用名称" width="150" sortable prop="name" v-if="this.checkedName.indexOf('应用名称')!=-1">
								</el-table-column>
								<el-table-column label="处理类" width="250" sortable prop="handleclass" v-if="this.checkedName.indexOf('处理类')!=-1">
								</el-table-column>
								<el-table-column label="应用描述" width="185" sortable prop="description" v-if="this.checkedName.indexOf('应用描述')!=-1">
								</el-table-column>
								<el-table-column label="数据库表" width="185" sortable prop="object_id" v-if="this.checkedName.indexOf('数据库表')!=-1">
								</el-table-column>
								<el-table-column label="模块" width="185" sortable prop="module" v-if="this.checkedName.indexOf('模块')!=-1">
								</el-table-column>
								<el-table-column label="排序" width="120" align="right" sortable prop="sort" v-if="this.checkedName.indexOf('排序')!=-1">
								</el-table-column>
								<el-table-column label="录入时间" width="120" prop="createTime" sortable :formatter="dateFormat" v-if="this.checkedName.indexOf('录入时间')!=-1">
								</el-table-column>
								<el-table-column label="变更时间" width="120" prop="updateTime" sortable :formatter="dateFormat" v-if="this.checkedName.indexOf('变更时间')!=-1">
								</el-table-column>
								<el-table-column label="流程" width="120" prop="flowkey" sortable :formatter="dateFormat" v-if="this.checkedName.indexOf('流程')!=-1">
								</el-table-column>
								<el-table-column label="流程代办单据号" width="180" prop="flow_todo_num" sortable :formatter="dateFormat" v-if="this.checkedName.indexOf('流程代办单据号')!=-1">
								</el-table-column>
								<el-table-column label="流程代办描述" width="180" prop="flow_todo_desc" sortable :formatter="dateFormat" v-if="this.checkedName.indexOf('流程代办描述')!=-1">
								</el-table-column>
							</v-table>
							<!-- 表格 End-->
						</el-col>
					</el-row>
				</div>
			</div>
			<!--右侧内容显示 End-->
			<categorymask :dataInfo="dataInfo" ref="categorymask" @request="requestData" @reset="reset" v-bind:page=page></categorymask>
		</div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import categorymask from '../settingDetails/application_mask.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'customer_management',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'categorymask': categorymask,
			'tableControle': tableControle,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'appcfg',
				basic_url: Config.dev_url,
				loading: false,//默认加载数据时显示loading动画
				loadSign: true, //鼠标滚动加载数据
				commentArr: {},
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				checkedName: [
					'应用英文名称',
					'应用名称',
					'处理类',
					'应用描述',
					'数据库表',
					'模块',
					'排序',
					'录入时间',
					'变更时间',
					'流程',
					'流程代办单据号',
					'流程代办描述'
				],
				tableHeader: [{
					label: '应用英文名称',
					prop: 'code'
				},
				{
					label: '应用名称',
					prop: 'name'
				},
				{
					label: '处理类',
					prop: 'handleclass'
				},
				{
					label: '类型',
					 prop: 'type'
				},
				{
					label: '应用描述',
					prop: 'description'
				},
				{
					label: '数据库表',
					prop: 'object_id'
				},
				{
						label: '模块',
						prop: 'module'
				},
				{
					label: '排序',
					prop: 'sort'
				},
				{
					label: '录入时间',
					prop: 'createTime'
				},
				{
					label: '变更时间',
					prop: 'updateTime'
				},
				{
					label: '流程',
					prop: 'flowkey'
				},
				{
					label: '流程代办单据号',
					prop: 'flow_todo_num'
				},
				{
					label: '流程代办描述',
					prop: '流程代办描述'
				},

				//{
					//label: '信息状态',
					//prop: 'STATUS'
				//},
				],
				selUser: [],
				applicationList: [],
				search: false,
				show: false,
				isShow: false,
				ismin: true,
				fullHeight: document.documentElement.clientHeight - 210 + 'px', //获取浏览器高度
				searchList: { //点击高级搜索后显示的内容
					name:'',
					description: '',
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					categorymaskren: "subDepts",
					label: "simplename"
				},
				page: { //分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				dataInfo: {},//修改子组件时传递数据
				buttons:[],
			}
		},
		methods: {
			setSelData(val){
				this.selUser = val;
			},
			tableControle(data) {
				this.checkedName = data;
			},
			//搜索
			searchinfo() {
				this.requestData('init');
			},
			resetbtn(){
				this.searchList = { //点击高级搜索后显示的内容
					name:'',
					description: '',
				};
				this.requestData('init');
			},
			//清空
			reset() {
				this.dataInfo = {
					ID: '',
					NUM: '',
					TYPE: '',
					STATUS: '活动',
					VERSION: '1',
					DEPARTMENT: '',
					ENTERBY: '',
					ENTERDATE: '',
					CHANGEBY: '',
					CHANGEDATE: ''
				};
				if(this.$refs['dataInfo'] !== undefined) {
					this.$refs['dataInfo'].resetFields();
				}

			},
			 //请求点击
		    getbtn(item){
		    	if(item.name=="添加"){
		         this.openAddMgr();
		    	}else if(item.name=="修改"){
		    		this.modify();
		    	}else if(item.name=="高级查询"){
		    		this.modestsearch();
		    	}else if(item.name=="删除"){
						this.deluserinfo();
					}else if(item.name=="彻底删除"){
						this.physicsDel();
					}
		    },
			//添加类别
			openAddMgr() {
				this.reset();
				this.$refs.categorymask.open(); // 方法1
				this.$refs.categorymask.visible();
			},
			//修改类别
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
					this.dataInfo = this.selUser[0];
					this.$refs.categorymask.detail( this.selUser[0]);
				}
			},
			//查看
			 view(data) {
			 	this.dataInfo =data;
				this.$refs.categorymask.view(this.dataInfo);
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
			},
			// 删除
			deluserinfo() {
				if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				}else if(this.selUser.length > 1){
					this.$message({
						message: '不可删除多条数据',
						type: 'warning'
					});
					return;
				}else {
					var url = this.basic_url + '/api-apps/appcfg/deletes';
					//changeUser为勾选的数据
					var changeUser = this.selUser;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for(var i = 0; i < changeUser.length; i++) {
						deleteid.push(changeUser[i].id);
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
			//彻底删除
			physicsDel(){
				if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				}else if(this.selUser.length > 1){
					this.$message({
						message: '不可删除多条数据',
						type: 'warning'
					});
					return;
				}else {
					var url = this.basic_url + '/api-apps/appcfg/physicsDel';
					//changeUser为勾选的数据
					var changeUser =this.selUser;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for(var i = 0; i < changeUser.length; i++) {
						deleteid.push(changeUser[i].id);
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
			//左侧菜单传来
		    childByValue:function ( childvalue) {
				// childValue就是子组件传过来的值
				this.$refs.navsTabs.showClick(childvalue);
		    	 this.getbutton( childvalue);
		    },
			//请求页面的button接口
		    getbutton(childvalue){
		    	var data = {
					menuId: childvalue.id,
					roleId: this.$store.state.roleid,
				};
				var url = this.basic_url + '/api-user/permissions/getPermissionByRoleIdAndSecondMenu';
				this.$axios.get(url, {params: data}).then((res) => {
					this.buttons = res.data;
				}).catch((wrong) => {
				})

		    },

		}
	}
</script>

<style>

</style>