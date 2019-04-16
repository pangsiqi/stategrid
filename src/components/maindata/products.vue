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
					<!--按钮操作行 Begin-->
					<div class="fixed-table-toolbar clearfix">
						<div class="bs-bars pull-left">
							<div class="hidden-xs" id="roleTableToolbar" role="group">
								<button v-for="item in buttons" :key='item.id' :class="'btn mr5 '+ item.style" @click="getbtn(item)">
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
							<tableControle :tableHeader="tableHeader" :checkedName="checkedName" @tableControle="tableControle" ref="tableControle"></tableControle>
						</div>
					</div>
					<!--按钮操作行 End-->

					<!-- 高级查询划出 Begin-->
					<div v-show="search">
						<el-form inline-message :model="searchList" label-width="45px">
							<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="编码" prop="PRO_NUM">
										<el-input v-model="searchList.PRO_NUM" @keyup.enter.native="searchinfo">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="名称" prop="PRO_NAME">
										<el-input v-model="searchList.PRO_NAME" @keyup.enter.native="searchinfo">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="版本" prop="VERSION">
										<el-input v-model="searchList.VERSION" @keyup.enter.native="searchinfo">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
									<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px; margin-left: 2px">重置</el-button>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<!-- 高级查询划出 End-->
					<el-row :gutter="0">
						<el-col :span="24">
							<!-- 表格 Begin-->
							<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="编码" width="155" sortable="custom" prop="PRO_NUM" v-if="checkedName.indexOf('编码')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.PRO_NUM}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="名称" sortable="custom" prop="PRO_NAME" v-if="checkedName.indexOf('名称')!=-1">
								</el-table-column>
								<el-table-column label="版本" width="100" sortable="custom" prop="VERSION" v-if="checkedName.indexOf('版本')!=-1" align="right">
								</el-table-column>
								<el-table-column label="机构" width="185" sortable="custom" prop="DEPTIDDesc" v-if="checkedName.indexOf('机构')!=-1">
								</el-table-column>
								<el-table-column label="录入时间" width="120" prop="ENTERDATE" sortable="custom" :formatter="dateFormat" v-if="checkedName.indexOf('录入时间')!=-1">
								</el-table-column>
								<el-table-column label="修改时间" width="120" prop="CHANGEDATE" sortable="custom" :formatter="dateFormat" v-if="checkedName.indexOf('修改时间')!=-1">
								</el-table-column>
							</v-table>
							<!-- 表格 End-->
						</el-col>
					</el-row>

				</div>
			</div>
			<!--右侧内容显示 End-->
			<productmask :PRODUCT="PRODUCT" ref="child" @request="requestData" @reset="reset" v-bind:page=page></productmask>
			<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
		</div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import productmask from '../maindataDetails/product_mask.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'customer_management',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'productmask': productmask,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'product',
				btn:'',//根据机构按钮的权限
				reportData:{},//报表的数据
				basic_url: Config.dev_url,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				fileList:[],//文件上传的接收数据
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
					'编码',
					'名称',
					'版本',
					'机构',
					// '信息状态',
					'录入时间',
					'修改时间'
				],
				tableHeader: [{
						label: '编码',
						prop: 'PRO_NUM'
					},
					{
						label: '名称',
						prop: 'PRO_NAME'
					},
					{
						label: '版本',
						prop: 'VERSION'
					},
					{
						label: '机构',
						prop: 'DEPTIDDesc'
					},
					// {
					// 	label: '信息状态',
					// 	prop: 'STATUS'
					// },
					{
						label: '录入时间',
						prop: 'ENTERDATE'
					},
					{
						label: '修改时间',
						prop: 'CHANGEDATE'
					}
				],
				selUser: [],
				productList: [],
				search: false,
				show: false,
				isShow: false,
				ismin: true,
				fullHeight: document.documentElement.clientHeight - 210 + 'px', //获取浏览器高度
				searchList: { //点击高级搜索后显示的内容
					PRO_NUM: '',
					PRO_NAME: '',
					VERSION: '',
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				PRODUCT: {}, //修改子组件时传递数据
				page: { //分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				selectData: [],
				buttons:[],
				// product:'product'//appname
			}
		},
		methods: {
			setSelData(val){
				this.selUser = val;
			},
			fileSuccess(){
				this.page.currentPage = 1;
				this.requestData();
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
				}else if(item.name=="导出"){
		    	 this.exportData();
		    	}else if(item.name=="报表"){
			     this.reportdata();
				}else if(item.name=="打印"){
				 this.Printing();
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
			
			//重置
			resetbtn(){
				this.searchList =  { //点击高级搜索后显示的内容
					PRO_NUM: '',
					PRO_NAME: '',
					VERSION: '',
				};
				this.requestData('init');
			},
			//搜索
			searchinfo() {
				this.requestData('init');
			},
			//清空
			reset() {
				this.PRODUCT = {
					PRO_NUM: '',
					PRO_NAME: '',
					STATUS: '活动',
					VERSION: '1',
					ENTERBY: '',
					ENTERDATE: '',
					CHANGEBY: '',
					CHANGEDATE: ''
				};
				if(this.$refs['PRODUCT'] !== undefined) {
					this.$refs['PRODUCT'].resetFields();
				}
			},
			//添加
			openAddMgr() {
				this.reset();
				this.$refs.child.open();
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
					this.PRODUCT = this.selUser[0];
					this.$refs.child.detail();
				}
			},
			//查看
			 view(data) {
			 	this.PRODUCT = data;
				this.$refs.child.view();
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
					var url = this.basic_url + '/api-apps/app/product/deletes';
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
			// 彻底删除
			physicsDel() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-apps/app/product/physicsDel';
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
			handleSuccess(response, file, fileList){
			},
			// 导入
			uploadUrl(){
                var url = this.basic_url +'/api-apps/app/product/importExc?access_token='+sessionStorage.getItem('access_token');
                return url;
            },
			// 导入
			download() {
				var url = this.basic_url + '/api-apps/app/product/importExcTemplete?access_token='+sessionStorage.getItem('access_token');
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
           		var url = this.basic_url + '/api-apps/app/product/exportExc?access_token='+sessionStorage.getItem('access_token');
          		 var xhr = new XMLHttpRequest();
            	xhr.open('POST', url, true);
            	xhr.responseType = "blob";
            	xhr.setRequestHeader("client_type", "DESKTOP_WEB");
            	xhr.onload = function() {
                	if (this.status == 200) {
						var filename = "product.xls";
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
				this.reportData.app=this.product;
				this.$refs.reportChild.visible();
			},
			requestData() {
				this.$refs.table.requestData();
			},
			handleNodeClick(data) {},
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
					
					var resData = res.data;
					var uploadIndex = 0;
					var uploadBtn = resData.filter((item,index)=>{
						if(item.name == '导入'){
							uploadIndex  = index;
							return item;
						}
					});
					if(uploadBtn.length > 0){
						this.isUploadBtn = true;
						resData.splice(uploadIndex, 1);
					}
					this.buttons = resData;	
				}).catch((wrong) => {
				})

			},
			//根据机构设置按钮权限
			getdept(){
				var url = this.basic_url + '/api-user/users/findDeptAttr';
				this.$axios.get(url, {}).then((res) => {
					
					this.btn=res.data;
				}).catch((wrong) => {
				})
			}
		},
		mounted() {
			// this.requestData();
			this.getCompany();
			this.getdept();
		},
	}
</script>

<style>
input[type="text"], input[type="password"], textarea {
    height: 35px;
    padding: 0px 5px;
    border-left:none;
    border: 1px solid #DFE5EA;
}
</style>