<template>
	<div>
		<div class="headerbg">
			<vheader></vheader>
			<navs_tabs ref="navsTabs"></navs_tabs>
		</div>
		<div class="contentbg">
			<!--左侧菜单调用 Begin-->
			<div style="display:none;">
				<navs_left ref="navleft" v-on:childByValue="childByValue"></navs_left>
			</div>
			<!--左侧菜单调用 End-->
			<div class="wrapper wrapper-content wrapperall">
				<div class="ibox-content">
					<!--<navs_button></navs_button>-->
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
							<div class="keep-open btn-group" title="列">
								<el-dropdown :hide-on-click="false" class="pl10 btn btn-default btn-outline">
									<span class="el-dropdown-link">
										<font class="J_tabClose"><i class="icon-menu3"></i></font>
										<i class="el-icon-arrow-down icon-arrow2-down"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-checkbox-group v-model="checkedName">
											<el-dropdown-item  v-for="(item,index) in tableHeader" :key="index">
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
						<el-form inline-message :model="searchList" label-width="70px">
							<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="编号" prop="WP_NUM">
										<el-input v-model="searchList.WP_NUM" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="描述" prop="DESCRIPTION">
										<el-input v-model="searchList.DESCRIPTION" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								
								<el-col :span="5">
									<el-form-item label="年度" prop="YEAR" label-width="45px">
										<el-input v-model="searchList.YEAR" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="录入时间" prop="ENTERDATE">
										<div class="block">
											<el-date-picker
												v-model="searchList.ENTERDATE"
												type="date"
												placeholder="录入时间" 
												style="width: 100%" 
												value-format="YYYY-MM-dd"
												@keyup.enter.native="searchinfo">
											</el-date-picker>
										</div>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="编辑状态" prop="STATUS">
										<el-select v-model="searchList.STATUS" placeholder="请选择" style="width: 100%" clearable @keyup.enter.native="searchinfo">
											<el-option label="草稿" value="1"></el-option>
											<el-option label="审批中" value="2"></el-option>
											<el-option label="驳回" value="0"></el-option>
											<el-option label="已发布" value="3"></el-option>
											<el-option label="已取消" value="4"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="执行状态" prop="LEADER_STATUS">
										<el-select v-model="searchList.LEADER_STATUS" placeholder="请选择" style="width: 100%" clearable @keyup.enter.native="searchinfo">
											<el-option label="未开始" value="1"></el-option>
											<el-option label="进行中" value="2"></el-option>
											<el-option label="已完成" value="3"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="类型" prop="TYPE" label-width="45px">
										<el-select clearable v-model="searchList.TYPE" filterable allow-create default-first-option placeholder="请选择" style="width:100%" @keyup.enter.native="searchinfo">
											<el-option label="监督抽查" value="1"></el-option>
											<el-option label="质量抽查" value="2"></el-option>
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
					<el-row class="relative" id="pageDiv">
						<el-col :span="5" class="lefttree" id="left">
							<div class="lefttreebg">
								<div class="left_tree_title clearfix">
									<div class="pull-left pr20" v-if="ismin">类型</div>
								</div>
								<div class="left_treebg" :style="{height: fullHeight}">
									<div class="p15" v-if="ismin">
										<el-tree ref="tree" class="filter-tree" :data="resourceData" node-key="id" default-expand-all :indent="22" :render-content="renderContent"  :props="resourceProps" @node-click="handleNodeClick" empty-text="暂无数据权限，如需请联系上级管理员在系统设置-角色管理-数据配置中配置。">
										</el-tree>
									</div>
								</div>
							</div>
						</el-col>
						<div id="middle"></div>
						<el-col :span="19" class="leftcont" id="right">
							<!-- 表格 -->
							<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="编号" sortable width="100px" prop="WP_NUM" v-if="checkedName.indexOf('编号')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row.ID)>{{scope.row.WP_NUM}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="描述" sortable width="200px" prop="DESCRIPTION" v-if="checkedName.indexOf('描述')!=-1">
								</el-table-column>
								<el-table-column label="年度" sortable width="80px" prop="YEAR" v-if="checkedName.indexOf('年度')!=-1">
								</el-table-column>
								<el-table-column label="类型" sortable  width="100px" prop="TYPEDesc" v-if="checkedName.indexOf('类型')!=-1">
								</el-table-column>
								<el-table-column label="产品类别" sortable width="200px" prop="ITEMTYPE" v-if="checkedName.indexOf('产品类别')!=-1">
								</el-table-column>
								<el-table-column label="提出单位" sortable width="120px" prop="PROP_UNITDesc" v-if="checkedName.indexOf('提出单位')!=-1">
								</el-table-column>
								<el-table-column label="编辑状态" sortable width="100px" prop="STATUSDesc" v-if="checkedName.indexOf('编辑状态')!=-1">
								</el-table-column>
								<el-table-column label="提报日期" sortable width="160px" prop="REPORTDATE" :formatter="dateFormat" v-if="checkedName.indexOf('提报日期')!=-1">
								</el-table-column>
								<el-table-column label="执行状态" sortable  width="120px" prop="LEADER_STATUSDesc" v-if="checkedName.indexOf('执行状态')!=-1">
								</el-table-column>
								<el-table-column label="录入时间" sortable width="160px" prop="ENTERDATE" v-if="checkedName.indexOf('录入时间')!=-1" :formatter="dateFormat">
								</el-table-column>
								<el-table-column label="修改时间" sortable width="160px" prop="ENTERDATE" v-if="checkedName.indexOf('修改时间')!=-1" :formatter="dateFormat">
								</el-table-column>
							</v-table>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
			<annualmask ref="child" @request="requestData" v-bind:page=page></annualmask>
			<!--报表-->
			<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
	</div>
</template>
<script>
	import Config from '../config.js'
	import vheader from './common/vheader.vue'
	import navs_left from './common/left_navs/nav_left5.vue'
	import navs_tabs from './common/nav_tabs.vue'
	import annualmask from './common/annual_mask.vue'
	import assetsTree from './plugin/vue-tree/tree.vue'
	import reportmask from'./reportDetails/reportMask.vue'
	import vTable from './plugin/table/table.vue'
	export default {
		name: 'annual_plan',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
			'v-assetsTree': assetsTree,
			'annualmask': annualmask,
			'reportmask': reportmask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'workplan',
				reportData:{},//报表的数据
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				basic_url: Config.dev_url,
				ismin: true,
				fileList:[],//文件上传的接收数据
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				checkedName: [
					'编号',
					'描述',
					'年度',
					'类型',
					'产品类别',
					'提出单位',
					'提报日期',
					'编辑状态',
					'执行状态',
					'执行状态',
					'录入时间',
					// '信息状态'
					'修改时间',
				],
				tableHeader: [
					{
						label: '编号',
						prop: 'WP_NUM'
					},
					{
						label: '描述',
						prop: 'DESCRIPTION'
					},
					{
						label: '年度',
						prop: 'YEAR'
					},
					{
						label: '类型',
						prop: 'TYPE'
					},
					{
						label: '产品类别',
						prop: 'ITEMTYPE'
					},
					{
						label: '提出单位',
						prop: 'PROP_UNITEDesc'
					},
					{
						label: '提报日期',
						prop: 'REPORTDATE'
					},
					{
						label: '执行状态',
						prop: 'LEADER_STATUSDesc'
					},
					{
						label: '录入时间',
						prop: 'ENTERDATE'
					},
					{
					label: '修改时间',
						prop: 'CHANGEDATE'
					},
					// {
					// 	label: '信息状态',
					// 	prop: 'STATUS'
					// }
				],
				companyId: '',
				deptId: '',
				selUser: [],
				userList: [],
				search: false,
				show: false,
				down: true,
				up: false,
				searchList: {
					WP_NUM: '',
					DESCRIPTION: '',
					TYPE: '',
					YEAR: '',
					ENTERDATE:'',
					ENTERBY:'',
					STATUS:'',
					LEADER_STATUS:''
				},
				workplan:'workplan',//appname
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					label: "name"
				},
				treeData: [],
				userData:[],
				page: {
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
		renderContent(h, {node,data,store}) { //自定义Element树菜单显示图标
			return(<span><i class={data.iconClass}></i><span>{node.label}</span></span>);
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
		
		searchinfo(index) {//高级查询
			this.requestData('init');
		},
		resetbtn(){
			this.searchList =  { //点击高级搜索后显示的内容
				WP_NUM: '',
				DESCRIPTION: '',
				TYPE: '',
				YEAR: '',
				ENTERDATE:'',
				ENTERBY:'',
				STATUS:'',
				LEADER_STATUS:''
			};
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
			}else if(item.name=="导出"){
				this.exportData();
			}else if(item.name=="删除"){
				this.deluserinfo();
			}else if(item.name=="取消"){
				this.cancelbtn();
			}else if(item.name=="报表"){
				this.reportdata();
			}else if(item.name=="发布"){
				this.releasebtn();
			}
		},
		//添加
		openAddMgr() {
			// this.$refs.child.resetNew();
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
			console.log(id);
			this.$refs.child.view(id);
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
				var url = this.basic_url + '/api-apps/app/workplan/deletes';
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
					this.$axios.delete(url, {params: data}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.requestData();
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'warning'
							});
						}
					}).catch((err) => {
					});
				}).catch(() => {

				});
			}
		},
		// 物理删除
		physicsDel() {
			var selData = this.selUser;
			if(selData.length == 0) {
				this.$message({
					message: '请您选择要删除的数据',
					type: 'warning'
				});
				return;
			} else {
				var url = this.basic_url + '/api-apps/app/workplan/physicsDel';
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
					this.$axios.delete(url, {params: data}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.requestData();
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'warning'
							});
						}
					}).catch((err) => {
					});
				}).catch(() => {

				});
			}
		},
		fileSuccess(){//上传成功后返回数据
			this.requestData('init');
		},
		uploadUrl(){
			var url = this.basic_url +'/api-apps/app/workplan/importExc?access_token='+sessionStorage.getItem('access_token');
			return url;
		},
		
		// 导入
		download() {
			var url = this.basic_url + '/api-apps/app/workplan/importExcTemplete?access_token='+sessionStorage.getItem('access_token');
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
					//ids为cancelid数组用逗号拼接的字符串
					ids = cancelid.toString(',');
                    // var data = {
					// 	ids: ids,
					// }
					var url = this.basic_url + '/api-apps/app/workplan/operate/cancel?ids='+ids;
					
					this.$confirm('确定取消此数据吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        this.$axios.get(url, {}).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '取消成功',
									type: 'success'
								});
								this.requestData();
							}else{
								this.$message({
									message: res.data.resp_msg,
									type: 'warning'
								});
							}
						}).catch((err) => {
						});
                    }).catch(() => {

                	});

				}
				xhr.send();
		},
		// 导出
		exportData() {
			var url = this.basic_url + '/api-apps/app/workplan/exportExc?access_token='+sessionStorage.getItem('access_token');
				var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			xhr.responseType = "blob";
			xhr.setRequestHeader("client_type", "DESKTOP_WEB");
			xhr.onload = function() {
				if (this.status == 200) {
					var filename = "workplan.xls";
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
		//报表
		reportdata(){
			this.reportData.app=this.workplan;
			this.$refs.reportChild.visible();
		},
		//发布
		releasebtn(){
			var selData = this.selUser;
			if(selData.length == 0) {
				this.$message({
					message: '请您选择要发布的数据',
					type: 'warning'
				});
				return;
			} else {
				//changeUser为勾选的数据
				var changeUser = selData;
				//releaseid为id的数组
				var releaseid = [];
				var ids;
				for (var i = 0; i < changeUser.length; i++) {
					releaseid.push(changeUser[i].ID);
				}
				//ids为deleteid数组用逗号拼接的字符串
				ids = releaseid.toString(',');
				// var data = {
				// 	ids: ids,
				// }
				var url = this.basic_url + '/api-apps/app/workplan/operate/release?ids='+ids;
				
				this.$confirm('确定发布此数据吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					this.$axios.get(url, {}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '发布成功',
								type: 'success'
							});
							this.requestData();
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'warning'
							});
						}
					}).catch((err) => {
					});
				}).catch(() => {

				});
			}
		},
		//取消
		cancelbtn(){
			var selData = this.selUser;
			if(selData.length == 0) {
				this.$message({
					message: '请您选择要取消的数据',
					type: 'warning'
				});
				return;
			} else {
				//changeUser为勾选的数据
				var changeUser = selData;
				//cancelid为id的数组
				var cancelid = [];
				var ids;
				for (var i = 0; i < changeUser.length; i++) {
					cancelid.push(changeUser[i].ID);
				}
				//ids为cancelid数组用逗号拼接的字符串
				ids = cancelid.toString(',');
				// var data = {
				// 	ids: ids,
				// }
				var url = this.basic_url + '/api-apps/app/workplan/operate/cancel?ids='+ids;
				
				this.$confirm('确定取消此数据吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					this.$axios.get(url, {}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '取消成功',
								type: 'success'
							});
							this.requestData();
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'warning'
							});
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
		requestData(opt) {
			this.$refs.table.requestData(opt);
		},
		//树
		getKey() {
			var url = this.basic_url + '/api-user/users/findIdsByUserAndType/1';
			this.$axios.get(url, {}).then((res) => {
				this.resourceData = res.data;
				this.treeData = this.transformTree(this.resourceData);
			}).catch((wrong) => {
			});
		},
		transformTree(data){
			for(var i=0; i<data.length; i++){
				data[i].name = data[i].name;
				if(!data[i].pid || $.isArray(data[i].subDepts)){
					data[i].iconClass = 'icon-file-normal';
				}else{
					data[i].iconClass = 'icon-file-text';
				}
				if($.isArray(data[i].subDepts)){
					data[i].children = this.transformTree(data[i].subDepts);
				}
			}
			return data;
		},
		// getTreeId(data){
		// 	if(data.type == '1'){
		// 		this.companyId = data.id;
		// 		this.deptId = '';
		// 	}else{
		// 		this.deptId = data.id;
		// 		this.companyId = '';
		// 	}
		// 	this.requestData();
		// },
		handleNodeClick(data) {
			for(var i = 0; i < this.resourceData.length; i++) {
				if(data.name == this.resourceData[i].name) {
					this.searchList.TYPE = this.resourceData[i].code;
				}
			}
			this.requestData();
		},
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
					right.style.width = maxT - iT -middleWidth -10 + "px"; 
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
			this.getKey();
			this.treeDrag();//调用树和表单之间拖拽改变宽度
		},
	}
</script>

<style>
span.el-tree__empty-text {
	width:200px;
	top:100%;
	color: #909399;
}
</style>