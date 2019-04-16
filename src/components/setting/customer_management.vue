<template>
<div>
	<div class="headerbg">
		<vheader></vheader>
		<navs_tabs ref="navsTabs"></navs_tabs>
	</div>
	<div class="contentbg">
		<!--左侧菜单内容显示 Begin-->
		<navs_left ref="navleft" v-on:childByValue="childvalue"></navs_left>
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
						<div id="refresh" title="刷新" class="btn btn-default btn-refresh"><i class="icon-refresh"></i></div>
						<tableControle :tableHeader="tableHeader" :checkedName="checkedName" @tableControle="tableControle" ref="tableControle"></tableControle>
					</div>
				</div>
				<!-- 高级查询划出 Begin-->
				<div v-show="search">
					<el-form inline-message :model="searchList" label-width="80px">
						<el-row :gutter="10">
							<el-col :span="6">
								<el-form-item label="统一社会信用代码" prop="CODE" label-width="160px">
									<el-input v-model="searchList.CODE" @keyup.enter.native="searchinfo">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="单位名称" prop="NAME">
									<el-input v-model="searchList.NAME" @keyup.enter.native="searchinfo">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="创建机构" prop="DEPTIDDesc">
									<el-input v-model="searchList.DEPTIDDesc" @keyup.enter.native="searchinfo">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="联系地址" prop="CONTACT_ADDRESS">
									<el-input v-model="searchList.CONTACT_ADDRESS" @keyup.enter.native="searchinfo">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="3">
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
							<el-table-column label="统一社会信用代码" width="180" sortable prop="CODE" v-if="this.checkedName.indexOf('统一社会信用代码')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row.ID)>{{scope.row.CODE}}
									</p>
								</template>
							</el-table-column>
							<el-table-column label="单位名称" width="300" sortable prop="NAME" v-if="this.checkedName.indexOf('单位名称')!=-1">
							</el-table-column>
							<el-table-column label="联系地址" width="300" sortable prop="CONTACT_ADDRESS" v-if="this.checkedName.indexOf('联系地址')!=-1">
							</el-table-column>
							<el-table-column label="类型" sortable prop="TYPEDesc" v-if="this.checkedName.indexOf('类型')!=-1">
							</el-table-column>
							<el-table-column label="创建机构" sortable prop="DEPTIDDesc" v-if="this.checkedName.indexOf('创建机构')!=-1">
							</el-table-column>
							<el-table-column label="备注" sortable prop="MEMO" v-if="this.checkedName.indexOf('备注')!=-1">
							</el-table-column>
						</v-table>
						<!-- 表格 End-->
					</el-col>
				</el-row>
			</div>
		</div>
		<!--右侧内容显示 End-->
		<customermask ref="child" @request="requestData" v-bind:page=page></customermask>
		<!--报表-->
		<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
	</div>
</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import customermask from '../settingDetails/customer_mask.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'user_management',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
			'customermask': customermask,
			'reportmask': reportmask,
			'tableControle': tableControle,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'customer',
				reportData:{},//报表的数据
				basic_url: Config.dev_url,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				fileList:[],//文件上传的接收数据
				commentArr:{},
				selectData: [],
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				checkedName: [
					'统一社会信用代码',
					'单位名称',
					'联系地址',
					'类型',
					'创建机构',
					'备注',
					// '联系电话',
					// '信息状态',
				],
				tableHeader: [
					{
						label: '统一社会信用代码',
						prop: 'CODE'
					},
					{
						label: '单位名称',
						prop: 'NAME'
					},
					{
						label: '联系地址',
						prop: 'CONTACT_ADDRESS'
					},
					{
						label: '类型',
						prop: 'TYPEDesc'
					},
					{
						label: '创建机构',
						prop: 'DEPTIDDesc'
					},
					{
						label: '备注',
						prop: 'MEMO'
					},
					// {
					// 	label: '联系电话',
					// 	prop: 'PHONE'
					// },
					// {
					// 	label: '信息状态',
					// 	prop: 'STATUS'
					// }
				],
				companyId: '',
				deptId: '',
				selUser: [],
				customerList: [],
				search: false,
				show: false,
				isShow: false,
				ismin:true,
				fileList: [],//上传附件数据
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					NAME: '',
					CODE: '',
					PHONE: '',
					CONTACT_ADDRESS: '',
					STATUS: ''
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				page: {//分页显示
					currentPage: 1,
					pageSize:20,
					totalCount: 0
				},
				buttons:[],//按钮
				customer:'customer',//appname
			}
		},

		methods: {
			setSelData(val){
				this.selUser = val;
			},
			tableControle(data){
				this.checkedName = data;
			},
			searchinfo() {
				this.requestData('init');
			},
			resetbtn(){
				this.searchList = { //点击高级搜索后显示的内容
					NAME: '',
					CODE: '',
					PHONE: '',
					CONTACT_ADDRESS: '',
					STATUS: '',
					DEPTIDDesc:'',
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
		    	}else if(item.name=="删除"){
				 this.deluserinfo();
				}else if(item.name=="彻底删除"){
				 this.physicsDel();
				}else if(item.name=="报表"){
			     this.reportdata();
				}
		    },
			//添加
			openAddMgr() {
				this.$refs.child.open();
				this.$refs.child.visible();
			},
			//修改
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
					this.$refs.child.detail(this.selUser[0].ID);
				}
			},
			//查看
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
					var url = this.basic_url + '/api-apps/app/customer/deletes';
					//changeUser为勾选的数据
					var changeUser = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeUser.length; i++) {
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
                    }).then(({ value }) => {
                        this.$axios.delete(url, {params: data}).then((res) => {//.delete 传数据方法
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
			physicsDel() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-apps/app/customer/physicsDel';
					//changeUser为勾选的数据
					var changeUser = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeUser.length; i++) {
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
                    }).then(({ value }) => {
                        this.$axios.delete(url, {params: data}).then((res) => {//.delete 传数据方法
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
			//获取机构项
			getMenuId(){
				var url = this.basic_url + '/api-user/menus/findAllMenu';
				this.$axios.get(url, {}).then((res) => {
					// 
					this.selectData = res.data;
				}).catch((wrong) => {
					this.$message({
						message: '网络错误，请重试',
						type: 'error'
					});
				})	
			},
			//报表
			reportdata(){
				this.reportData.app=this.customer;
				this.$refs.reportChild.visible();
			},
			fileSuccess(){//上传成功后返回数据
				this.page.currentPage = 1;
				this.requestData();
			},
			handleSuccess(response, file, fileList){//上传文件列表
				console.log(response);
				console.log(file);
				console.log(fileList);
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
           		var url = this.basic_url + '/api-apps/app/customer/exportExc?access_token='+sessionStorage.getItem('access_token');
          		 var xhr = new XMLHttpRequest();
            	xhr.open('POST', url, true);
            	xhr.responseType = "blob";
            	xhr.setRequestHeader("client_type", "DESKTOP_WEB");
            	xhr.onload = function() {
                	if (this.status == 200) {
						var filename = "customer.xls";
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
			//上传文件 Begin
			handleRemove(file, fileList) {
				// console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
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
		    childvalue:function ( childvalue) {
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
					this.buttons = res.data;
					
				}).catch((wrong) => {})

		    },
		},
	}
</script>

<style scoped>

</style>