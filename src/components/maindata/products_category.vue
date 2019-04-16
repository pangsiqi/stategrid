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
								<button v-for="item in buttons" :key='item.id' :class="'btn mr5 '+ item.style"  @click="getbtn(item)">
									<i :class="item.icon"></i>{{item.name}}
								</button>
								<el-dropdown size="small">
									<button class="btn mr5 btn-primarys">
										<i class="icon-inventory-line-callin"></i> 导入<i class="el-icon-arrow-down el-icon--right"></i>
									</button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item>
											<div @click="download"><i class="icon-download-cloud"></i>下载模版</div>
										</el-dropdown-item>
										
										<el-dropdown-item>
											<el-upload
											ref="upload"
											class="upload"
											:action="uploadUrl()"
											:on-success="fileSuccess"
											:limit=1
											multiple
											method:="post"
											:file-list="fileList">
												<i class="icon-upload-cloud"></i> 上传
											</el-upload>
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
						<div class="columns columns-right btn-group pull-right">
							<div id="refresh" title="刷新" class="btn btn-default btn-refresh">
								<i class="icon-refresh"></i>
							</div>
							<tableControle :tableHeader="columns" :checkedName="checkedName" @tableControle="tableControle" ref="tableControle"></tableControle>
						</div>
					</div>
					<!--按钮操作行 End-->

					<!-- 高级查询划出 Begin-->
					<div v-show="search">
						<el-form inline-message :model="searchList" label-width="45px">
							<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="编码" prop="NUM">
										<el-input v-model="searchList.NUM" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="名称" prop="TYPE">
										<el-input v-model="searchList.TYPE" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="版本" prop="VERSION">
										<el-input v-model="searchList.VERSION" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="机构" prop="DEPTID">
										<el-select clearable v-model="searchList.DEPTID" filterable allow-create default-first-option placeholder="请选择" @keyup.enter.native="searchinfo">
										    <el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
									<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px;    margin-left: 2px">重置</el-button>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<!-- 高级查询划出 End-->
					<el-row :gutter="0">
						<el-col :span="24">
							<!-- 表格 Begin-->
							<tree_grid :columns="columns" :loading="loading" :tree-structure="true" :data-source="deptList" v-on:classByValue="classByValue" @getDetail="getDetail" ></tree_grid>
						</el-col>
					</el-row>
				</div>
			</div>
			<!--右侧内容显示 End-->
			<categorymask :CATEGORY="CATEGORY" ref="categorymask" @request="requestData" @reset="reset"></categorymask>
			<!--报表-->
			<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
		</div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import categorymask from '../maindataDetails/product_categoryMask.vue'
	import tree_grid from '../common/TreeGrid.vue'//树表格
	import tableControle from '../plugin/table-controle/controle.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	
	export default {
		name: 'customer_management',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'categorymask': categorymask,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'tree_grid':tree_grid,
		},
		data() {
			return {
				appName: 'productType',
				btnShow: false,
				reportData:{},//报表的数据
				// up2down:'down',
				basic_url: Config.dev_url,
				commentArr: {},
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				fileList:[],
				value: '',
				deptList:[],
				productType:'productType',//appname
				checkedName: [
					'编码',
					'名称',
					'版本',
					'机构',
					// '信息状态',
					'录入时间',
					'修改时间'
				],
				columns: [{
						text: '编码',
						dataIndex: 'NUM',
						width:'200',
						isShow:true,
					},
					{
						text: '名称',
						dataIndex: 'TYPE',
						isShow:true,
					},
					{
						text: '版本',
						dataIndex: 'VERSION',
						width:'100',
						isShow:true,
					},
					{
						text: '机构',
						dataIndex: 'DEPTIDDesc',
						width:'140',
						isShow:true,
					},
					// {
					// 	label: '信息状态',
					// 	prop: 'STATUS'
					// },
					{
						text: '录入时间',
						dataIndex: 'ENTERDATE',
						dataType: 'date',
						isShow:true,
					},
					{
						text: '修改时间',
						dataIndex: 'CHANGEDATE',
						dataType: 'date',
						isShow:true,
					}
				],
				search: false,
				show: false,
				isShow: false,
				ismin: true,
				fullHeight: document.documentElement.clientHeight - 210 + 'px', //获取浏览器高度
				searchList: { //点击高级搜索后显示的内容
					NUM:'',
					TYPE: '',
					VERSION:'',
					DEPTID: '',
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "children",
					label: "TYPE"
				},
				CATEGORY: {},//修改子组件时传递数据
				selectData: [],
				buttons:[],
				selUser: []
			}
		},
		methods: {
			SelChange(val) {
				this.selUser = val;
			},
			fileSuccess(){//上传成功后返回数据
				this.page.currentPage = 1;
				this.requestData();
			},
			handleSuccess(response, file, fileList){//上传文件列表
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
			tableControle(data) {
				this.checkedName = data;
			},
			//重置
			resetbtn(){
				this.searchList = {
					NUM:'',
					TYPE: '',
					VERSION:'',
					DEPTID: '',
				};
				this.requestData();
			},
			//搜索
			searchinfo() {
				var data = {
					params: {
						NUM: this.searchList.NUM,
						TYPE: this.searchList.TYPE,
						VERSION: this.searchList.VERSION,
						DEPTID: this.searchList.DEPTID,
					}
				};
				var url= this.basic_url +'/api-apps/appSelection/productType/treeForStation?tree_id=NUM&tree_pid=PARENT';
				this.$axios.get(url, data).then((res) => {
					this.deptList = res.data.datas;
					this.loading = false;
				}).catch((wrong) => {})
			},
			//清空
			reset() {
				this.CATEGORY = {
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
				if(this.$refs['CATEGORY'] !== undefined) {
					this.$refs['CATEGORY'].resetFields();
				}
			},
			//请求点击
		    getbtn(item){
			var isshowbtn=this.btn;
		    	if(item.name=="添加"){
					if(isshowbtn=='0'){
                       this.$message({
						message: '您没有添加的权限',
						type: 'warning'
					});
					}else{
                       this.openAddMgr();
					}
		    	}else if(item.name=="修改"){
					if(isshowbtn=='0'){
                       this.$message({
						message: '您没有修改的权限',
						type: 'warning'
					});
					}else{
				        this.modify();
					}
		    	}else if(item.name=="彻底删除"){
					if(isshowbtn=='0'){
                       this.$message({
						message: '您没有彻底删除的权限',
						type: 'warning'
					});
					}else{
      					this.physicsDel();
					}
				}else if(item.name=="删除"){
					if(isshowbtn=='0'){
						this.$message({
							message: '您没有删除的权限',
							type: 'warning'
						});
					}else{
						this.deluserinfo();
					}
		    	}else if(item.name=="高级查询"){
		    		this.modestsearch();
		    	}else if(item.name=="导入"){
		    		this.download();
		    	}else if(item.name=="配置关系"){
		    		this.Configuration();
		    	}else if(item.name=="报表"){
			     	this.reportdata();
				}else if(item.name=="打印"){
				 	this.Printing();
				}else if(item.name=="导出"){
					this.exportData();
				}
		    },
			// 删除
			deluserinfo(){
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				}else {
					var url = this.basic_url + '/api-apps/app/productType/deletes';
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
						}).then((res) => {//.delete 传数据方法
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
									type: 'error'
								});
							}
						}).catch((err) => {

						});
					}).catch(() => {

					});
				}
			},
			//添加类别
			openAddMgr() {
				this.reset();
				this.$refs.categorymask.open(); // 方法1
				this.$refs.categorymask.visible();
			},
			getDetail(data){
				this.view(data);
			},
			classByValue(childValue) {
		  		this.selUser = childValue;
			},
			//修改类别
			modify() {
				if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要修改的数据',
						type: 'warning'
					});
					return;
				}else if(this.selUser.length > 1) {
					this.$message({
						message: '不可同时修改多个数据',
						type: 'warning'
					});
					return;
				}else {
					this.CATEGORY = this.selUser[0];
					this.$refs.categorymask.detail(this.selUser[0]);
				}
			},
			//查看
			 view(data) {
			 	this.CATEGORY =data;
				this.$refs.categorymask.view();
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
			},
			//彻底删除
			physicsDel(){
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				}else {
					var url = this.basic_url + '/api-apps/app/productType/physicsDel';
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
							}else{
								this.$message({
									message: res.data.resp_msg,
									type: 'error'
								});
							}
						}).catch((err) => {
						});
					}).catch(() => {

					});
				}
			},
			uploadUrl(){
                var url = this.basic_url +'/api-apps/app/productType/importExc?access_token='+sessionStorage.getItem('access_token');
                return url;
            },
          	
			// 导入
			download() {
				var url = this.basic_url + '/api-apps/app/productType/importExcTemplete?access_token='+sessionStorage.getItem('access_token');
				var xhr = new XMLHttpRequest();
					xhr.open('POST', url, true);
					xhr.responseType = "blob";
					xhr.setRequestHeader("client_type", "DESKTOP_WEB");
					xhr.onload = function() {
						if (this.status == 200) {
							var blob = this.response;
							var objecturl = URL.createObjectURL(blob);
							window.location.href = objecturl;
						}
					}
					xhr.send();
			},
			// 导出
			exportData() {
           		var url = this.basic_url + '/api-apps/app/productType/exportExc?access_token='+sessionStorage.getItem('access_token');
          		var xhr = new XMLHttpRequest();
            	xhr.open('POST', url, true);
            	xhr.responseType = "blob";
            	xhr.setRequestHeader("client_type", "DESKTOP_WEB");
            	xhr.onload = function() {
                	if (this.status == 200) {
						var filename = "productType.xls";
						var blob = this.response;
						var link = document.createElement('a');
						var objecturl = URL.createObjectURL(blob);
						link.href = objecturl;
						link.download = filename;
						link.click();
                	}
            	}
            	xhr.send();
			},
			// 打印
			Printing() {

			},
			//报表
			reportdata(){
				this.reportData.app=this.productType;
				this.$refs.reportChild.visible();
			},
			// 配置关系
			Configuration() {
				this.$router.push({
					path: '/inspection_project'
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
			formatter(row, column) {
				return row.enabled;
			},
			childByValue:function(childValue) {
				this.$refs.navsTabs.showClick(childValue);
				this.getbutton(childValue);
			},
		    getbutton(childByValue){
		    	var data = {
					menuId: childByValue.id,
					roleId: this.$store.state.roleid,
				};
				var url = this.basic_url + '/api-user/permissions/getPermissionByRoleIdAndSecondMenu';
				this.$axios.get(url, {params: data}).then((res) => {
					var resData = res.data;
					var uploadIndex = 0;
					var uploadBtn = resData.filter((item,index)=>{
						if(item.name == '导入'){
							uploadIndex  = index;
							return item;
						}
					});
					var delBtn = resData.filter((item,index)=>{
						if(item.name == '删除'){
							return item;
						}
					});
					this.delBtn = delBtn.length > 0? delBtn[0] : {};
					if(uploadBtn.length > 0){
						this.isUploadBtn = true;
						resData.splice(uploadIndex, 1);
					}
					this.buttons = resData;
				}).catch((err) => {
				})
			},
			getdept(){
				var url = this.basic_url + '/api-user/users/findDeptAttr';
				this.$axios.get(url, {}).then((res) => {
					this.btn=res.data;
				}).catch((err) => {})
			},
			requestData(){
				this.loading = true;
				var url= this.basic_url +'/api-apps/appSelection/productType/treeForStation?tree_id=NUM&tree_pid=PARENT';
				this.$axios.get(url, {
				}).then((res) => {
					this.deptList = res.data.datas;
					this.loading = false;
				}).catch((wrong) => {})
			}
		},
		mounted() {
			this.getCompany();
			this.getdept();
			this.requestData();
		}
	}
</script>