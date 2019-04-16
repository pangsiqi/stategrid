<template>
	<div>
		<div class="headerbg">
			<vheader></vheader>
			<navs_tabs  ref="navsTabs"></navs_tabs>
		</div>
		<div class="contentbg">
			<!--左侧菜单调用 Begin-->
			<navs_left ref="navleft" v-on:childByValue="childByValue"></navs_left>
			<!--左侧菜单调用 End-->
			<!--右侧内容显示 Begin-->
			<div class="wrapper wrapper-content">
				<div class="ibox-content">
					<!--<navs_button></navs_button>-->
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
							<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="用户名" prop="username" label-width="55px">
										<el-input v-model="searchList.username" @keyup.enter.native="searchinfo">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="姓名" prop="nickname" label-width="45px">
										<el-input v-model="searchList.nickname" @keyup.enter.native="searchinfo">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="机构名称" prop="deptId" label-width="70px">
										<el-select clearable v-model="searchList.deptId" filterable allow-create default-first-option placeholder="请选择" style="width: 90%;border-radius:none">
										    <el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
										</el-select>
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

					<el-row class="relative" id="pageDiv">
						<el-col :span="5" class="lefttree" id="left">
							<div class="lefttreebg">
								<div class="left_tree_title clearfix">
									<div class="pull-left pr20" v-if="ismin">组织机构</div>
								</div>
								<div class="left_treebg" :style="{height: fullHeight}">
									<div class="p15" v-if="ismin">
										<el-tree ref="tree" class="filter-tree" :data="resourceData" node-key="id" default-expand-all :indent="22" :render-content="renderContent" :props="resourceProps" @node-click="handleNodeClick">
										</el-tree>
									</div>
								</div>
							</div>
						</el-col>
						<div id="middle"></div>
						<el-col :span="19" class="leftcont" id="right">
							<!-- 表格 -->
							<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="用户名" sortable width="180px" prop="username" v-if="this.checkedName.indexOf('用户名')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row.id)>{{scope.row.username}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="姓名" sortable width="200px" prop="nickname" v-if="this.checkedName.indexOf('姓名')!=-1">
								</el-table-column>
								<el-table-column label="性别" sortable width="100px" prop="sexName" v-if="this.checkedName.indexOf('性别')!=-1">
								</el-table-column>
								<el-table-column label="机构" sortable width="150px" prop="deptName" v-if="this.checkedName.indexOf('机构')!=-1">
								</el-table-column>
								<el-table-column label="手机号" sortable width="150px" prop="phone" v-if="this.checkedName.indexOf('手机号')!=-1">
								</el-table-column>
								<el-table-column label="员工号" width="180px" sortable prop="worknumber" v-if="this.checkedName.indexOf('员工号')!=-1">
								</el-table-column>
								<el-table-column label="用户有效期" prop="user_active_date" width="150px" sortable :formatter="dateFormat" v-if="this.checkedName.indexOf('用户有效期')!=-1">
								</el-table-column>
								<!-- <el-table-column label="公司" sortable prop="companyName" v-if="this.checkedName.indexOf('公司')!=-1">
								</el-table-column> -->
								<!--<el-table-column label="信息状态" sortable width="200px" prop="enabled" :formatter="judge" v-if="this.checkedName.indexOf('信息状态')!=-1">
								</el-table-column>-->
								<!-- <el-table-column label="录入时间" prop="createTime" width="100px" sortable :formatter="dateFormat" v-if="this.checkedName.indexOf('录入时间')!=-1">
								</el-table-column> -->
							</v-table>
							<!-- 表格 -->
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<usermask :user="user" ref="child" @request="requestData" @requestTree="getKey" v-bind:page=page></usermask>
		<el-dialog title="修改密码" :visible.sync="passdialog" width="30%" :before-close="resetNewpwd">
			<el-form inline-message :model="userpassword" :rules="rules" ref="newPwdForm">
	  			<el-form-item label="新密码" prop="Password" label-width="100px">
					<el-input  type="password" v-model="userpassword.Password"></el-input>
				</el-form-item>
				<el-form-item label="确认新密码" prop="newPassword" label-width="100px">
					<el-input type="password" v-model="userpassword.newPassword"></el-input>
				</el-form-item>
			</el-form>
		      <span slot="footer" class="dialog-footer">
		      	<el-button type="primary" @click="determine">确 定</el-button>
		        <el-button @click="resetNewpwd">取 消</el-button>
		      </span>
        </el-dialog>
		<!-- 权限管理 -->
		<el-dialog :modal-append-to-body="false" title="数据配置" :visible.sync="Access" width="30%" :before-close="handleClose">
			<!--年度计划查询类别-->
			<div class="scrollbar" style="max-height: 400px;">
				<el-tree ref="work" :data="workData"  v-show="workData.length>0" show-checkbox  node-key="id" default-expand-all :default-checked-keys="resourceCheckedKey" :props="resourework" >
				</el-tree>
				<!--工作任务通知书查询类别-->
				<el-tree ref="annual" :data="annualData" v-show="annualData.length>0" show-checkbox  node-key="id" default-expand-all :default-checked-keys="resourceCheckedKey" :props="resoureannual"  >
				</el-tree>
				<!--设置产品类别和产品-->
				<el-tree ref="product" :data="productData" v-show="productData.length>0" show-checkbox  node-key="id" default-expand-all :default-checked-keys="resourceCheckedKey" :props="resoureproduct" :check-strictly="true" >
				</el-tree>
				<el-tree ref="testproduct" :data="testingproductData" v-show="testingproductData.length>0" show-checkbox  node-key="id" default-expand-all :default-checked-keys="resourceCheckedKey" :props="resouretestingproduct" :check-strictly="true" >
				</el-tree>
			</div>
			<div slot="footer">
					<el-button type="primary" @click="Accessconfirm" >确 定</el-button>
					<el-button @click="resetTree">取 消</el-button>
				</div>
		</el-dialog>
		<!-- 查看权限 -->
		<el-dialog :modal-append-to-body="false" title="应用模块权限查看" :visible.sync="permissions" width="30%" :before-close="handleClose">
			<!--设置产品类别和产品-->
			<div class="scrollbar" style="max-height: 400px;">
				<el-tree ref="permissions" :data="permissionsData" node-key="id" default-expand-all :default-checked-keys="resourceCheckedKey" :props="resourepermissions" >
				</el-tree>
			</div>	
		</el-dialog>	
		<!--右侧内容显示 End-->
		<!--报表-->
		<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
	  <!--数据限制-->
		<datarestrictmask  @request="requestData" ref="datarestrictmask" ></datarestrictmask>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import usermask from '../settingDetails/user_mask.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import datarestrictmask from'../common/common_mask/datarestrictmask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'user_management',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'usermask': usermask,
			'reportmask': reportmask,
			'datarestrictmask': datarestrictmask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'api-user',
				reportData:{},//报表的数据
				rules:{
					newpassword: [
					{required: true,trigger: 'blur',message: '必填'},
					{validator: this.Validators.isValidatePass, trigger: 'blur'},
				],
					Password: [
					{required: true,trigger: 'blur',message: '必填'},
					{validator: this.Validators.isValidatePass, trigger: 'blur'},
				]
				},
				permissions:false,//查看权限
				Access:false,//权限管理的弹出框
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				basic_url: Config.dev_url,
				isShow: false,
				ismin: true,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				commentArr: {},
				passdialog:false,
				userpassword:{
					newPassword: '',
					Password:''
				},
				//权限弹出框的数据
				workData:[],//工作任务单的数据
				resourework:{
					children: "children",
					label: "name"
				},
				annualData:[],//年度树数据
				resoureannual:{
					children: "children",
					label: "name"
				},
				productData:[],//产品的数据
				resoureproduct:{
					children: "children",
					label: "fullname"
				},
				testingproductData:[],//检验检测产品的数据
				resouretestingproduct:{
					children: "children",
					label: "fullname"
				},
				permissionsData:[],//应用模块权限查看
				resourepermissions:{
					children: "children",
					label: "name"
				},
				checkedName: [
					'用户名',
					'姓名',
					'性别',
					'机构',
					'手机号',
					'员工号',
					'用户有效期',
					// '公司',
					// '信息状态',
					// '录入时间'
				],
				buttons: [],//请求回的按钮
				tableHeader: [{
						label: '用户名',
						prop: 'username'
					},
					{
						label: '姓名',
						prop: 'nickname'
					},
					{
						label: '性别',
						prop: 'GENDER'
					},
					{
						label: '机构',
						prop: 'deptName'
					},
					{
						label: '手机号',
						prop: 'phone'
					},
					{
						label: '员工号',
						prop: 'worknumber'
					},
					{
						label: '用户有效期',
						prop: 'user_active_date'
					},
					// {
					// 	label: '信息状态',
					// 	prop: 'enabled'
					// },
					// {
					// 	label: '录入时间',
					// 	prop: 'createTime'
					// }
				],
				companyId: '',
				deptId: '',
				selUser: [],
				'启用': true,
				'冻结': false,
				userList: [],
				search: false,
				show: false,
				searchList: {
					nickname: '',
					username: '',
					companyId: ''
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "fullname"
				},
				treeData: [],
				userData: [],
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				user: {},//修改子组件时传递数据
				selectData: [],
			}
		},
		methods: {
			setSelData(val){
				this.selUser = val;
			},
			tableControle(data) {
				this.checkedName = data;
			},
			getCheckedKeys() { 
				},
			resetTree(){
				this.Access = false;
				this.$refs.testproduct.setCheckedKeys([]);
				this.$refs.product.setCheckedKeys([]);
				this.$refs.annual.setCheckedKeys([]);
				this.$refs.work.setCheckedKeys([]);
			},
			resetNewpwd(){
				this.passdialog = false;
				this.requestData();
				this.$refs['newPwdForm'].resetFields();
			},
			//机构值
			getCompany() {
				var type = "2";
				var url = this.basic_url + '/api-user/depts/treeByType';
				this.$axios.get(url, {
					params: {
						type: type
					},
				}).then((res) => {
					this.selectData = res.data;
				});
			},
			renderContent(h, {node,data,store}) { //自定义Element树菜单显示图标
				return (<span><i class={data.iconClass}></i><span>{node.label}</span></span>)
			},
			// 点击节点
			nodeClick: function(m) {
				if(m.iconClass != 'icon-file-text') {
					if(m.iconClass == 'icon-file-normal') {
						m.iconClass = 'icon-file-open';
					} else {
						m.iconClass = 'icon-file-normal';
					}
				}
				this.handleNodeClick();
			},
			expandClick: function(m) {
				if(m.iconClass != 'icon-file-text') {
					if(m.iconClass == 'icon-file-normal') {
						m.iconClass = 'icon-file-open';
					} else {
						m.iconClass = 'icon-file-normal';
					}
				}
				m.isFolder = !m.isFolder;
			},
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			},
			searchinfo() {
				this.requestData('init');
			},
			resetbtn(){
				this.searchList = {
					nickname: '',
					username: '',
					deptId: ''
				};
				this.requestData('init');
			},
			
		    //请求点击
		    getbtn(item){
		    	if(item.name=="添加"){
		         this.openAddMgr();
		    	}else if(item.name=="修改"){
		    	 this.modify();
		    	}else if(item.name=="高级查询"){
		    	 this.modestsearch();
		    	}else if(item.name=="活动"){
		    	 this.unfreeze();
		    	}else if(item.name=="不活动"){
		    	 this.freezeAccount();
		    	}else if(item.name=="删除"){
		    	 	this.deluserinfo();
		    	}else if(item.name=="彻底删除"){
		    	 	this.physicsDel();
		    	}else if(item.name=="重置密码"){
		    	 	this.resetPwd();
		    	}else if(item.name=="报表"){
			     	this.reportdata();
		    	}else if(item.name=="数据配置"){
				 	this.configuration();
					}else if(item.name=="应用模块权限查看"){
				 	this.Checkpermissions();
					}else if(item.name=="数据限制"){
						this.datarestrict();
					}
			},
			datarestrict(){
				if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要设置的数据',
						type: 'warning'
					});
					return;
				} else if(this.selUser.length > 1) {
					this.$message({
						message: '不可同时设置多个数据',
						type: 'warning'
					});
					return;
				} else {
					this.$refs.datarestrictmask.visible(this.selUser[0].id);
				}
			},
			//应用模块权限查看
			Checkpermissions(){
				if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要设置的数据',
						type: 'warning'
					});
					return;
				} else if(this.selUser.length > 1) {
					this.$message({
						message: '不可同时设置多个数据',
						type: 'warning'
					});
					return;
				} else {
				var url = this.basic_url + '/api-user/users/findAuth/'+this.selUser[0].id;
				this.$axios.get(url, {}).then((res) => {
					this.permissionsData=res.data;
					this.permissions=true;
				}).catch(error => {
				})
				}
			},
			//数据配置
			configuration(){
				if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要设置的数据',
						type: 'warning'
					});
					return;
				} else if(this.selUser.length > 1) {
					this.$message({
						message: '不可同时设置多个数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-user/menus/findFirstMenu/'+this.selUser[0].id;
					this.$axios.get(url, {}).then((res) => {
					if(res.data==0){
						this.$message({
								message: '角色没有相应的权限配置',
								type: 'warning'
							});
					}else{
						this.getannual(this.selUser[0].id);
						this.getwork(this.selUser[0].id);
						this.getproduct(this.selUser[0].id);
						this.gettestproduct(this.selUser[0].id);
						this.Access=true;	
					}
				}).catch(error => {
				})
					
				}
			},
			getwork(id){
				var arr=[];	
				var url = this.basic_url + '/api-user/menus/findMenuByRoleIdsForPM/'+id;
				this.$axios.get(url, {}).then((res) => {
					this.workData = res.data;
					this.recursive(res.data,arr);
					this.$nextTick(() => {
							this.worksetChecked(arr);
						});
				}).catch(error => {
				})
			},
			getannual(id){
				var arr=[];	
				var url = this.basic_url + '/api-user/menus/findMenuByRoleIdsForTask/'+id;
				this.$axios.get(url, {}).then((res) => {
					this.annualData = res.data;
					this.recursive(res.data,arr);
					this.$nextTick(() => {
							this.annualsetChecked(arr);
						});
				}).catch(error => {
				})
			},
			getproduct(id){
				var arr=[];	
				var url = this.basic_url + '/api-apps/appCustom/pdTree/'+id+'/1';
				this.$axios.get(url, {}).then((res) => {
					if(res.data.datas!=null){
						console.log(res.data.datas);
						this.productData = res.data.datas;
						this.recursive(res.data.datas,arr);
						this.$nextTick(() => {
							this.productsetChecked(arr);
						});
					}
				}).catch(error => {
				})
			},
		    gettestproduct(id){
				var arr=[];	
				var url = this.basic_url + '/api-apps/appCustom/pdTree/'+id+'/2';
				this.$axios.get(url, {}).then((res) => {
					if(res.data.datas!=null){
						this.testingproductData = res.data.datas;
						this.recursive(res.data.datas,arr);                                 
						this.$nextTick(() => {
							this.testproductsetChecked(arr);
						});
					}
				}).catch(error => {
				})
			},
			recursive(mData,arr){
				var flag=true;
				for(var a = 0; a < mData.length; a++){
						if(mData[a].checked){
							arr.push(mData[a].id);
							// if(mData[a].children!=undefined){
							// 	for(var b=0;b<mData[a].children.length;b++){
							// 		if(!mData[a].children[b].checked){
							// 		flag=false;
							// 		break;
							// 		}
							// 	}
							// 	if(!flag){
							// 		arr.pop(mData[a].id)
							// 	}
							// }
						}
						if(mData[a].children!=undefined){
							this.recursive(mData[a].children,arr);
						}else{
							this.recursive(mData[a],arr);
						}
						
					}
				return mData;		
			},
			worksetChecked(arr){
				this.$refs.work.setCheckedKeys(arr);
			},
			annualsetChecked(arr){
				this.$refs.annual.setCheckedKeys(arr);
			},
			productsetChecked(arr){
				console.log(arr);
				this.$refs.product.setCheckedKeys(arr);
			},
			testproductsetChecked(arr){
				this.$refs.testproduct.setCheckedKeys(arr);
			},
			//
			Accessconfirm(){//确定
			var pmType=[];
			var taskType=[];
			var productType=[];
			var product=[];
			var checkProduct=[];
			var checkProductType=[];
			var deptIds=[];
			var checkDeptIds=[];
      var mtype=[];
			var mchecktype=[];

			var work=this.$refs.work.getCheckedNodes();
			var annual=this.$refs.annual.getCheckedNodes();
			var products=this.$refs.product.getCheckedNodes();
			var testingproduct=this.$refs.testproduct.getCheckedNodes();
			for(var a=0;a<work.length;a++){
				if(work[a].name!="年度计划"){
					  pmType.push(work[a].id); 
				}
			}
			for(var b=0;b<annual.length;b++){
				if(annual[b].name!="工作任务通知书"){
					  taskType.push(annual[b].id); 
				}
			}
       for(var c=0;c<products.length;c++){
						if(products[c].type=="dept"){
								deptIds.push(products[c].id);
						}
						if(products[c].type=="product"){
								product.push(products[c].id);
						}

					if(products[c].type=="producttype"){
								productType.push(products[c].id);
						}

					if(products[c].type=="menu"){
								mtype.push(products[c].id);
						}
			}


   for(var c=0;c<testingproduct.length;c++){
						if(testingproduct[c].type=="dept"){
								checkDeptIds.push(testingproduct[c].id);
						}
						if(testingproduct[c].type=="product"){
								checkProduct.push(testingproduct[c].id);
						}

					if(testingproduct[c].type=="producttype"){
								checkProductType.push(testingproduct[c].id);
						}

					if(testingproduct[c].type=="menu"){
								mchecktype.push(testingproduct[c].id);
						}
			}

			
			pmType = pmType.join(',');
			taskType = taskType.join(',');
			product = product.join(',');
			productType = productType.join(',');
			checkProduct = checkProduct.join(',');
			checkProductType = checkProductType.join(',');
			deptIds=deptIds.join(',');
			checkDeptIds=checkDeptIds.join(',');
			mtype=mtype.join(',');
      mchecktype=mchecktype.join(',');
 			
				var url = this.basic_url + '/api-user/users/setAuth';
				this.$axios.post(url, {pmType:pmType,
					taskType:taskType,
					productType:productType,
					product:product,
					checkProduct:checkProduct,
					checkProductType:checkProductType,
					deptIds:deptIds,
					checkDeptIds:checkDeptIds,
					mtype:mtype,
          mchecktype:mchecktype,
					userId:this.selUser[0].id}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '操作成功',
								type: 'success'
							});
						}
						this.requestData();
						this.resetTree();//置空数据                            
				}).catch((err) => {
				});
			},
			//添加用戶
			openAddMgr() {
				this.$refs.child.visible();
				this.$refs.child.open();
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
					this.user = this.selUser[0]; 
					this.$refs.child.detail(this.selUser[0].id);
				}
			},
			//查看用戶
			 view(id) {
				this.$refs.child.view(id);
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
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
					var url = this.basic_url + '/api-user/users/deletes';
					//changeUser为勾选的数据
					var changeUser = selData;
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
			// 彻底删除
			physicsDel() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				}  else {
					var url = this.basic_url + '/api-user/users/physicsDel';
					//changeUser为勾选的数据
					var changeUser = selData;
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
			// 重置
			resetPwd() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要重置密码的用户',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时多个用户进行重置',
						type: 'warning'
					});
					return;
				} else {
					this.passdialog=true;
				}
			},
			//密码的确定
			determine(){
				var id = this.selUser[0].id;
				var newPassword=this.userpassword.newPassword;
				var Password=this.userpassword.Password;
				if(newPassword==Password){
					var url = this.basic_url + '/api-user/users/' + id + '/password';
					this.$refs.newPwdForm.validate((valid) => {
						if (valid) {
							this.$axios.put(url,{"newPassword": this.userpassword.newPassword}).then((res) => {
								if(res.data.resp_code == 0) {
									this.$message({
										message: '修改成功',
										type: 'success'
									});
									this.resetNewpwd();
								}
							}).catch((err) => {
							});
						}
					});
				}else{
					this.$message({
						message:'新密码和确认新密码的值不一样请重新填写',
						type: 'error'
					});
				}
			},

			// 启用
			unfreeze() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择您要启动的用户',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时启动多个用户',
						type: 'warning'
					});
					return;
				} else {
					var changeUser = selData[0];
					var url = this.basic_url + '/api-user/users/updateEnabled?id=' + changeUser.id + '&enabled=true';
					this.$axios.get(url, {}).then((res) => {
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '启动成功',
								type: 'success'
							});
							this.requestData();
						}
					}).catch((err) => {
					});
				}
			},
			// 冻结
			freezeAccount() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择您要冻结的用户',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时冻结多个用户',
						type: 'warning'
					});
					return
				} else {
					var changeUser = selData[0];
					var url = this.basic_url + '/api-user/users/updateEnabled?id=' + changeUser.id + '&enabled=false';
					this.$axios.get(url, {}).then((res) => {
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '冻结成功',
								type: 'success'
							});
							this.requestData();
						}
					}).catch((err) => {
					});
				}
			},
			//报表
			reportdata(){
				this.reportData.app=this.workorder;
				this.$refs.reportChild.visible();
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.requestData();
					})
					.catch(_ => {
					console.log('取消关闭');
					$('.v-modal').hide();
				});
			},
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD"); 
			},

			requestData(opt) {
				this.$refs.table.requestData(opt);
			},

			//机构树
			getKey() {
				let that = this;
				var url = this.basic_url + '/api-user/depts/tree';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data;
					this.treeData = this.transformTree(this.resourceData);
				});
			},
			transformTree(data) {
				for(var i = 0; i < data.length; i++) {
					data[i].name = data[i].fullname;
					if(!data[i].pid || $.isArray(data[i].subDepts)) {
						data[i].iconClass = 'icon-file-normal';
					} else {
						data[i].iconClass = 'icon-file-text';
					}
					if($.isArray(data[i].subDepts)) {
						data[i].children = this.transformTree(data[i].subDepts);
					}
				}
				return data;
			},
			handleNodeClick(data) {
				if(data.type == '1') {
					this.companyId = data.id;
					this.searchList.companyId = data.id;
					this.deptId = '';
				} else {
					this.searchList.deptId = data.id;
					this.companyId = '';
					this.searchList.companyId = data.id;
				}
				this.requestData('init');
			},

			// min3max() { //左侧菜单正常和变小切换
			// 	if($(".lefttree").hasClass("el-col-5")) {
			// 		$(".lefttree").removeClass("el-col-5");
			// 		$(".lefttree").addClass("el-col-1");
			// 		$(".leftcont").removeClass("el-col-19");
			// 		$(".leftcont").addClass("el-col-23");
			// 		$(".icon-doubleok").removeClass("icon-double-angle-left");
			// 		$(".icon-doubleok").addClass("icon-double-angle-right");
			// 	} else {
			// 		$(".lefttree").removeClass("el-col-1");
			// 		$(".lefttree").addClass("el-col-5");
			// 		$(".leftcont").removeClass("el-col-23");
			// 		$(".leftcont").addClass("el-col-19");
			// 		$(".icon-doubleok").removeClass("icon-double-angle-right");
			// 		$(".icon-doubleok").addClass("icon-double-angle-left");
			// 	}
			// 	this.ismin = !this.ismin;
			// },
			childByValue:function(childValue) {
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
		    //树和表单之间拖拽改变宽度
			treeDrag(){
				var middleWidth=5,
				left = document.getElementById("left"),
				right =  document.getElementById("right"), 
				middle =  document.getElementById("middle"); 
				middle.style.left = left.clientWidth + 'px';
				right.style.left = left.clientWidth + 5 + 'px';
				middle.onmousedown = function(e) { 
					var disX = (e || event).clientX; 
					middle.left = middle.offsetLeft; 
					document.onmousemove = function(e) { 
						var iT = middle.left + ((e || event).clientX - disX); 
						var e=e||window.event,tarnameb=e.target||e.srcElement; 
						var maxT=document.body.clientWidth; 
						iT < 0 && (iT = 0); 
						iT > maxT/2 && (iT = maxT/2); 
						middle.style.left = left.style.width = iT + "px"; 
						right.style.width = maxT - iT -middleWidth -230 + "px"; 
						right.style.left = iT+middleWidth+"px"; 
						return false 
					}; 
					document.onmouseup = function() { 
						document.onmousemove = null; 
						document.onmouseup = null; 
						middle.releaseCapture && middle.releaseCapture() 
					}; 
					middle.setCapture && middle.setCapture(); 
					return false 
				}; 
			}
		},
		mounted() {	
			// 在页面挂载前就发起请求
			this.getKey();
			this.getCompany();
			this.treeDrag();//调用树和表单之间拖拽改变宽度
		}
	}
</script>

<style scope>



</style>