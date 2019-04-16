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
						<el-form inline-message :model="searchList" label-width="110px">
							<el-row :gutter="5">
								<el-col :span="6">
									<el-form-item label="工作任务单编号" prop="WONUM">
										<el-input v-model="searchList.WONUM"  @keyup.enter.native="searchinfo">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="样品名称" prop="ITEM_NAME" label-width="80px">
										<el-input v-model="searchList.ITEM_NAME"  @keyup.enter.native="searchinfo">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="完成日期" prop="COMPLETE_DATE" label-width="80px">
										<div class="block">
									    	<el-date-picker v-model="searchList.COMPLETE_DATE" type="date" placeholder="请选择" style="width: 100%" value-format="yyyy-MM-dd"  @keyup.enter.native="searchinfo">
									    	</el-date-picker>
								  		</div>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="5">
								<el-col :span="6">
									<el-form-item label="委托书编号" prop="PROXYNUM" label-width="110px">
										<el-input v-model="searchList.PROXYNUM"  @keyup.enter.native="searchinfo">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="录入时间" prop="ENTERDATE" label-width="80px">
										<div class="block">
									    	<el-date-picker v-model="searchList.ENTERDATE" type="date" placeholder="请选择" style="width: 100%" value-format="yyyy-MM-dd"  @keyup.enter.native="searchinfo">
									    	</el-date-picker>
								  		</div>
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
					
					<el-row class="relative" id="pageDiv">
						<el-col :span="5" class="lefttree" id="left">
							<div class="lefttreebg">
								<div class="left_tree_title clearfix">
									<div class="pull-left pr20" v-if="ismin">检索分类</div>
								</div>
								<div class="left_treebg" :style="{height: fullHeight}">
									<div class="p15" v-if="ismin">
										<el-tree ref="tree" class="filter-tree" :data="resourceData" node-key="id" default-expand-all :indent="22" :render-content="renderContent"  :props="resourceProps" @node-click="handleNodeClick">
										</el-tree>
									</div>
								</div>
							</div>
						</el-col>
						<div id="middle"></div>
						<el-col :span="19" class="leftcont" id="right">
							<!-- 表格 -->
							<tree_grid :columns="columns" :loading="loading" :tree-structure="true" :data-source="userList" v-on:classByValue="childvalue" @getDetail="getDetail"></tree_grid>
							<!-- 表格 -->
						</el-col>
					</el-row>
					</div>
				</div>
			<!--工作任务单详情/Houling-->
			<workorders_mask :workorderForm="workorderForm" ref="child" @requests="requestData" @requestTree="getKey" v-bind:page=page></workorders_mask>
			<!--工作任务单详情/Houling-->
			<sendtasklist ref="task" v-bind:page=page @refresh="refresh"></sendtasklist>
			<!--报表-->
			<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
			<!--任务处理/Aiyamin-->
			<workordersDeal ref="workDeal"></workordersDeal>
			<!--分包协议/Heliping-->
			<makeprotocolmask ref="protocolMask"></makeprotocolmask>
			<!--报告生成与编辑/Heliping-->
			<reportgeneratemask ref="reportGenerationMask"></reportgeneratemask>
		</div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import tree_grid from '../common/TreeGrid.vue'//树表格
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import workorders_mask from '../testworkcheckDetails/workorders_mask.vue'//之前的详情页
	import sendtasklist from '../testworkcheckDetails/sendtasklist.vue'//下达任务
	import reportmask from'../reportDetails/reportMask.vue'//报表
	import workordersDeal from'../testworkcheckDetails/workordersDeal.vue'//任务处理
	import makeprotocolmask from'../testworkcheckDetails/makeprotocol_mask.vue'//生成分包协议
	import reportgeneratemask from'../testworkcheckDetails/reportgenerate_mask.vue'//报告生成与编辑
	export default {
		name: 'workorders',
		components: {
			vheader,
			tree_grid,
			navs_tabs,
			navs_left,
			workorders_mask,
			sendtasklist,//下达任务
			reportmask,//报表
			workordersDeal,//任务处理
			makeprotocolmask,//生成分包协议
			reportgeneratemask,//报告生成与编辑
		},
		data() {
			return {
				reportData:{},//报表的数据
				loading: false,
				basic_url: Config.dev_url,
				checkedName: [
				    '工作任务单编号',
					'状态',
					'样品名称',
					'样品型号',
					'样品状态',
					'抽样方案/判定依据',
					'完成日期',
					'完成方式',
					'委托书编号',
					'录入人',
					'录入时间'
				],
				columns: [
					 {
					 	text: '工作任务单编号',
					 	dataIndex: 'WONUM',
					 	width: '300',
					 	isShow:true,
					 },
					{
						text: '状态',
						dataIndex: 'STATEDesc',
					 	width: '100',
						isShow:true,
					},
					{
						text: '是否为主任务单',
						dataIndex: 'IS_MAINDesc',
					 	width: '120',
						isShow:true,
					},
					{
						text: '样品名称',
						dataIndex: 'ITEM_NAME',
					 	width: '200',
						isShow:true,
					},
					{
						text: '样品型号',
						dataIndex: 'ITEM_MODEL',
					 	width: '140',
						isShow:true,
					},
					{
						text: '样品状态',
						dataIndex: 'ITEM_STATUS',
					 	width: '120',
						isShow:true,
					},
					{
						text: '抽样方案/判定依据',
						dataIndex: 'CHECK_BASIS',
					 	width: '160',
						isShow:true,
					},
					{
						text: '完成日期',
						dataIndex: 'COMPLETE_DATE',
					 	width: '160',
						isShow:true,
					},
					{
						text: '完成方式',
						dataIndex: 'COMPLETE_MODE',
					 	width: '120',
						isShow:true,
					},
					{
						text: '委托书编号',
						dataIndex: 'PROXYNUM',
					 	width: '160',
						isShow:true,
					},
					{
						text: '录入人',
						dataIndex: 'ENTERBY',
						isShow:true,
					},
					{
						text: '录入时间',
						dataIndex: 'ENTERDATE',
					 	width: '160',
						isShow:true,
					},
				],
				ismin: true,
				loadSign:true,//加载
				commentArr:{},
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				checkedName: [
					'工作任务单编号',
					'状态',
					'是否为主任务单',
					'样品名称',
					'样品型号',
					'样品状态',
					'抽样方案/判定依据',
					'完成日期',
					'完成方式',
					'委托书编号',
					// '录入人',
					'录入时间',
					// '信息状态'
				],
				tableHeader: [
					{
						label: '工作任务单编号',
						prop: 'WONUM'
					},
					{
						label: '状态',
						prop: 'STATE'
					},
					{
						label: '是否为主任务单',
						prop: 'IS_MAINDesc'
					},
					{
						label: '样品名称',
						prop: 'ITEM_NAME'
					},
					{
						label: '样品型号',
						prop: 'ITEM_MODEL'
					},
					{
						label: '样品状态',
						prop: 'ITEM_STATUS'
					},
					{
						label: '抽样方案/判定依据',
						prop: 'CHECK_BASIS'
					},
					{
						label: '完成日期',
						prop: 'COMPLETE_DATE'
					},
					{
						label: '完成方式',
						prop: 'COMPLETE_MODE'
					},
					{
						label: '委托书编号',
						prop: 'PROXYNUM'
					},
					{
						label: '录入时间',
						prop: 'ENTERDATE'
					}
				],
				companyId: '',
				deptId: '',
				selMenu: [],
				userList: [],
				search: false,
				show: false,
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				searchList: {
					WONUM: '',//工作任务单编号
					ITEM_NAME: '',//样品名称
					PROXYNUM: '',//委托书编号
					STATE: '',//状态
					COMPLETE_DATE: '',//完成日期
					// ENTERBY: '',//录入人
					ENTERDATE: '',//录入时间
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
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				workorderForm: {},//修改子组件时传递数据
				workorder:'workorder',//appname
				buttons:[],
			}
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			renderContent(h, {node,data,store}) { //自定义Element树菜单显示图标
				return (<span><i class={data.iconClass}></i><span title={data.lable}>{data.lable}</span></span>)
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
			loadMore() {
				if(this.loadSign) {
					this.loadSign = false
					this.page.currentPage++
						if(this.page.currentPage > Math.ceil(this.page.totalCount / this.page.pageSize)) {
							return
						}
					setTimeout(() => {
						this.loadSign = true
					}, 1000)
					this.requestData()
				}
			},
			sizeChange(val) {
		      this.page.pageSize = val;
		      this.requestData();
		    },
		    currentChange(val) {
		      this.page.currentPage = val;
		      this.requestData();
		    },
	    	resetbtn(){
				this.searchList =  { //点击高级搜索后显示的内容
					WONUM: '',//工作任务单编号
					ITEM_NAME: '',//样品名称
					PROXYNUM: '',//委托书编号
					STATE: '',//状态
					COMPLETE_DATE: '',//完成日期
					// ENTERBY: '',//录入人
					ENTERDATE: '',//录入时间
				};
				this.requestData();
			},
			searchinfo(index) {
				this.page.currentPage = 1;
				this.page.pageSize = 10;
				this.requestData();
			},
			//请求点击
		    getbtn(item){
		    	if(item.name=="修改"){
		    	 	this.modify();
		    	}else if(item.name=="彻底删除"){
		    	 	this.physicsDel();
		    	}else if(item.name=="高级查询"){
		    		this.modestsearch();
		    	}else if(item.name=="导入"){
		    	 	this.download();
		    	}else if(item.name=="删除"){
		    	 	this.deluserinfo();
		    	}else if(item.name=="任务处理"){
					this.workorderDeal();
		    	}else if(item.name=="下达任务"){
					this.tasklist();
		    	}else if(item.name=="生成分包协议"){
					this.makeProtocolMask();
		    	}else if(item.name=="报告生成与编辑"){
					this.reportGenerateMask();
		    	}else if(item.name=="报表"){
			    	this.reportdata();
				}
			},
			//任务处理
			workorderDeal(){
				if(this.selMenu.length == 0) {
					this.$message({
						message: '请选择要处理的任务',
						type: 'warning'
					});
					return;
				} else if(this.selMenu.length > 1) {
					this.$message({
						message: '不可同时处理多条任务',
						type: 'warning'
					});
					return;
				} else{
					this.$refs.workDeal.showDialog(this.selMenu[0].ID);
				}
			},
			//生成分包协议
			makeProtocolMask(){
				if(this.selMenu.length == 0) {
					this.$message({
						message: '请选择要处理的任务',
						type: 'warning'
					});
					return;
				} else if(this.selMenu.length > 1) {
					this.$message({
						message: '不可同时处理多条任务',
						type: 'warning'
					});
					return;
				} else{
					this.$refs.protocolMask.showDialog(this.selMenu[0].ID);
				}
			},
			//报告生成与编辑
			reportGenerateMask(){
				if(this.selMenu.length == 0) {
					this.$message({
						message: '请选择要处理的任务',
						type: 'warning'
					});
					return;
				} else if(this.selMenu.length > 1) {
					this.$message({
						message: '不可同时处理多条任务',
						type: 'warning'
					});
					return;
				} else{
					this.$refs.reportGenerationMask.showDialog(this.selMenu[0].ID);
					// console.log(this.selMenu[0].ID);
				}
			},
			getCurrentRole(){//获取当前用户信息
	            var url = this.basic_url + '/api-user/users/currentMap';
	            this.$axios.get(url, {}).then((res) => {//获取当前用户信息
	                return res.data.roleId;
	            }).catch((err) => {});
        	},
			//下达任务到子组件//之前的任务单修改页面
			modify() {
				if(this.selMenu.length == 0) {
					this.$message({
						message: '请选择要下达的任务',
						type: 'warning'
					});
					return;
				} else if(this.selMenu.length > 1) {
					this.$message({
						message: '不可同时下达多条子任务',
						type: 'warning'
					});
					return;
				} else{
					if(this.selMenu[0].STATE == 3 || this.selMenu[0].STATE == 2 || this.selMenu[0].STATE == 0) {
						//判断是不是当前执行者
						var url = this.basic_url + '/api-apps/app/workorder/flow/isExecute/' + this.selMenu[0].ID;
						this.$axios.get(url, {}).then((res) => {
							if(res.data.resp_code == 0) {
								this.$refs.child.detail(this.selMenu[0].ID);
								// var nodeId = '';
								// var url = this.dev_url + '/api-apps/app/workorder/flow/NodeId/' + this.selMenu[0].ID;
								// this.$axios.get(url, {}).then((res) => {
								// 	if(res.data.resp_code == 0) {
								// 		nodeId = res.data.datas;
								// 	} else {
								// 		this.$message({
								// 			message: res.data.resp_msg,
								// 			type: 'warning'
								// 		});
								// 	}
								// });
								// if(nodeId == 'jyfzr'){
								// 	this.$refs.child.detail(this.selMenu[0].ID,'第二个节点');	
								// }else if(nodeId == 'jyy'){
								// 	this.$refs.child.detail(this.selMenu[0].ID,'第三个节点');	
								// }else{
								// 	//cxlr
								// 	this.$refs.child.view(this.selMenu[0].ID,'第一个节点');
								// }
							} else {
								this.$message({
									message: res.data.resp_msg,
									type: 'warning'
								});
							}
						});
					}else{
						this.$refs.child.detail(this.selMenu[0].ID);	
					}
				}
			},
			//下达任务
			tasklist(){
				console.log(this.selMenu[0].ID);
				if(this.selMenu.length == 0) {
					this.$message({
						message: '请您选择要下达任务的数据',
						type: 'warning'
					});
					return;
				} else if(this.selMenu.length > 1) {
					this.$message({
						message: '不可下达多条子任务单',
						type: 'warning'
					});
					return;
				} else {
					this.$refs.task.view(this.selMenu[0].ID);	
				}
			},
			//报表
			reportdata(){
				this.reportData.app=this.workorder;
				this.$refs.reportChild.visible();
			},
			
			getDetail(data){
				this.view(data);
			},
			//查看
			view(data) {
				var id=data.ID;
				this.$refs.child.view(id);
			},
			//代办跳转
			getRouterData() {
				// 只是改了query，其他都不变
				this.id = this.$route.query.bizId;
				this.$refs.child.view(this.id);
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
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
				}else {
					var url = this.basic_url + '/api-apps/app/workorder/deletes';
					//changeUser为勾选的数据
					var changeUser = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeUser.length; i++) {
						if(changeUser[i].STATE!=1){
						 	this.$message({
								message: '您的数据中有已启动的流程，所以能删除',
								type: 'error'
							});
							return;
						}else{
							deleteid.push(changeUser[i].ID);
						}
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
							}
						}).catch((err) => {
						});
                    }).catch(() => {

                	});
				}
			},
			//彻底删除
			physicsDel(){
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-apps/app/workorder/physicsDel';
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
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			
			SelChange(val) {
				this.selMenu = val;
			},
			refresh(){
				this.requestData();
			},
			requestData() {
				this.loading = true;
				var data = {
					WONUM: this.searchList.WONUM,
					ITEM_NAME: this.searchList.ITEM_NAME,
					PROXYNUM: this.searchList.PROXYNUM,
					STATE: this.searchList.STATE,
					COMPLETE_DATE: this.searchList.COMPLETE_DATE,
					ENTERBY: this.searchList.ENTERBY,
					ENTERDATE: this.searchList.ENTERDATE,
					P_NUM: this.searchList.P_NUM,
					PRO_NUM: this.searchList.PRO_NUM,
					DEPTID: this.searchList.DEPTID
				}
				var url=this.basic_url +'/api-apps/app/workorder/tree?tree_id=WONUM&tree_pid=PARENT_NUM';
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					this.loading = false;
					let result=res.data.datas;
					for(let i=0;i<result.length;i++){
						if(typeof(result[i].subDepts)!="undefined"&&result[i].subDepts.length>0){
							let subDepts=result[i].subDepts;
							result[i].children=subDepts;
						}	
					}
					this.userList=res.data.datas;
				}).catch((wrong) => {

				})
			},
			//机构树
			getKey() {
				let that = this;
				// var url = this.basic_url + '/api-user/depts/tree';
				var url = this.basic_url + '/api-apps/appCustom/tree';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data.datas;
					// this.resourceData = res.data;
					this.treeData = this.transformTree(this.resourceData);
					// console.log(this.treeData);
				});
			},
			transformTree(data) {
				for(var i = 0; i < data.length; i++) {
					data[i].name = data[i].fullname || data[i].TYPE || data[i].pName || data[i].PRO_NAME;
					data[i].lable = data[i].fullname || data[i].TYPE || data[i].pName || data[i].PRO_NAME;
					if($.isArray(data[i].children)) {
						data[i].iconClass = 'icon-file-normal';
					} else {
						data[i].iconClass = 'icon-file-text';
					}
					if($.isArray(data[i].children)) {
						data[i].subDepts = this.transformTree(data[i].children);
					}
				}
				return data;
			},
			getTreeId(data){
				if(data.type == '1'){
					this.companyId = data.id;
					this.deptId = '';
				}else{
					this.deptId = data.id;
					this.companyId = '';
				}
				this.requestData();
			},
			handleNodeClick(data) {
				if(!!data.fullname) {
					this.searchList.P_NUM = '';
					this.searchList.PRO_NUM = '';
					this.searchList.DEPTID = data.id;
					this.currentPage = 1;
				}else if(!!data.TYPE){
					this.searchList.P_NUM = data.NUM;
					this.searchList.PRO_NUM = '';
					this.searchList.DEPTID = data.DEPTID;
					this.currentPage = 1;
				}else if(!!data.PRO_NUM){
					this.searchList.P_NUM = data.NUM;
					this.searchList.PRO_NUM = data.PRO_NUM;
					this.searchList.DEPTID = data.DEPTID;
					this.currentPage = 1;
				}else{
					this.searchList.P_NUM = '';
					this.searchList.PRO_NUM = '';
					this.searchList.DEPTID = '';
					this.currentPage = 1;
				}
				this.requestData();
			},
			formatter(row, column) {
				return row.enabled;
			},
			//表格传过来
			childvalue: function (childValue) {
				// childValue就是子组件传过来的
				this.selMenu = childValue;
			},
			//左侧菜单过来的
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
			this.treeDrag();//调用树和表单之间拖拽改变宽度
			this.requestData();
			this.getKey();
			if(this.$route.query.bizId != undefined) {
				this.getRouterData();
			}
			
		},
	}
</script>

<style scoped>

</style>