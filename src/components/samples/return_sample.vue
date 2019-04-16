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
							<tableControle :tableHeader="tableHeader" :checkedName="checkedName" @tableControle="tableControle" ref="tableControle"></tableControle>
						</div>
					</div>
					<!-- 高级查询划出 Begin-->
					<div v-show="search">
						<el-form inline-message :model="searchList">
							<el-row :gutter="5">
								<el-col :span="6">
									<el-form-item label="样品序号" prop="ITEM_STEP" label-width="85px">
										<el-input v-model="searchList.ITEM_STEP" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="样品承接人" prop="ACCEPT_PERSON" label-width="85px">
										<!-- <el-input v-model="searchList.ACCEPT_PERSON" @keyup.enter.native="searchinfo"></el-input> -->
										<el-select clearable 
											   v-model="searchList.ACCEPT_PERSON" 
											   filterable 
											   default-first-option 
											   placeholder="请选择">
											<el-option v-for="(data,index) in selPerson" :key="index" :value="data.id" :label="data.fullname"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="5">
								<!-- <el-col :span="6">
									<el-form-item label="处理批准人" prop="APPR_PERSON" label-width="85px">
										<el-input v-model="searchList.APPR_PERSON" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col> -->
								<el-col :span="6">
									<el-form-item label="批准日期" prop="APPR_DATE" label-width="100px">
										<div class="block">
										    <el-date-picker
										      v-model="searchList.APPR_DATE"
										      type="date"
										      placeholder="请选择"
											  style="width: 100%"
											   @keyup.enter.native="searchinfo">
										    </el-date-picker>
									  	</div>
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
						<!-- 左侧树菜单 Begin-->
						<el-col :span="5" class="lefttree" id="left">
							<div class="lefttreebg">
								<div class="left_tree_title clearfix">
									<div class="pull-left pr20" v-if="ismin">检索分类</div>
								</div>
								<div class="left_treebg" :style="{height: fullHeight}">
									<div class="p15" v-if="ismin">
										<el-tree ref="tree" class="filter-tree" :data="resourceData" node-key="id" default-expand-all :indent="22" :render-content="renderContent" :props="resourceProps" @node-click="handleNodeClick">
										</el-tree>
									</div>
								</div>
							</div>
						</el-col>
						<!-- 左侧树菜单 End-->
						<div id="middle"></div>
						<el-col :span="19" class="leftcont" id="right">
							<!-- 表格 -->
							<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="样品编号" sortable width="220px" prop="ITEMNUM" v-if="this.checkedName.indexOf('样品编号')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.ITEMNUM}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="样品序号" sortable width="100px" prop="ITEM_STEP" v-if="this.checkedName.indexOf('样品序号')!=-1">
									<template slot-scope="scope">
										<span v-text="scope.row.ITEM_STEP==-1?'':scope.row.ITEM_STEP"></span>
									</template>
								</el-table-column>
								<el-table-column label="数量" width="100px" prop="QUALITY" sortable v-if="this.checkedName.indexOf('数量')!=-1">
								</el-table-column>
								<el-table-column label="返样人" sortable prop="RETURN_PERSONDesc" v-if="this.checkedName.indexOf('返样人')!=-1">
								</el-table-column>
								<el-table-column label="返样日期" sortable prop="RETURN_DATE" v-if="this.checkedName.indexOf('返样日期')!=-1" :formatter="dateFormat">
								</el-table-column>
							</v-table>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<samplesmask :samplesForm="samplesForm" ref="child" @request="requestData" @requestTree="getKey" v-bind:page=page></samplesmask>
		<!--右侧内容显示 End-->

		<!--报表-->
		<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import samplesmask from'../samplesDetails/returnsample_mask.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'return_samples',//返样
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'samplesmask': samplesmask,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'itemreturn',
				reportData:{},//报表的数据
				basic_url: Config.dev_url,
				isShow: false,
				ismin: true,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				commentArr: {},
				checkedName: [
					'样品编号',
					'样品序号',
					'数量',
					'返样人',
					'返样日期',
				],
				tableHeader: [{
						label: '样品编号',
						prop: 'ITEMNUM'
					},
					{
						label: '样品序号',
						prop: 'ITEM_STEP'
					},
					{
						label: '数量',
						prop: 'QUALITY'
					},
					{
						label: '返样人',
						prop: 'RETURN_PERSONDesc'
					},
					{
						label: '返样日期',
						prop: 'RETURN_DATE'
					},
				],
				companyId: '',
				deptId: '',
				selMenu: [],
				samplesList: [],
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				search: false,
				show: false,
				searchList: {
					ITEMNUM: '',//样品编号
					APPR_PERSON: '',//处理批准人
					ACCEPT_PERSON: '',//样品承接人
					ITEM_STEP: '',//样品序号
					APPR_DATE: '',//批准日期
					ACCEPT_DATE: '',//收样日期
				},
				//tree树菜单
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {//树菜单数据
					children: "subDepts",
					label: "fullname"
				},
				treeData: [],
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				samplesForm: {},//修改子组件时传递数据
				buttons:[],
				selPerson: [],
				itemreturn:'itemreturn'//appname
			}
		},
		methods: {
			setSelData(val){
				this.selMenu = val;
			},
			renderContent(h, {node,data,store}) { //自定义Element树菜单显示图标
				return (<span><i class={data.iconClass}></i><span title={data.lable}>{data.lable}</span></span>);
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
			tableControle(data) {//控制表格列显示隐藏
				this.checkedName = data;
			},
			searchinfo() {//高级查询
				this.requestData('init');
			},
			//重置
			resetbtn(){
				this.searchList = {
					ITEMNUM: '',//样品编号
					APPR_PERSON: '',//处理批准人
					ACCEPT_PERSON: '',//样品承接人
					ITEM_STEP: '',//样品序号
					APPR_DATE: '',//批准日期
					ACCEPT_DATE: '',//收样日期
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
		    	}else if(item.name=="导入"){
		    	 this.download();
		    	}else if(item.name=="删除"){
		    	 this.deluserinfo();
		    	}else if(item.name=="导出"){
		    	 this.exportData();
		    	}else if(item.name=="报表"){
			     this.reportdata();
				}else if(item.name=="打印"){
				 this.Printing();
				}
		    },
			//添加样品管理
			openAddMgr() {
				this.samplesForm = {
					ITEM_LINE_ID: '',//样品子表ID
					ITEMNUM: '',//样品序号
					QUALITY: '',//数量
					ACCEPT_DATE: '',//收回入库时间
					ACCEPT_PERSON: '',//样品承接人
					APPR_PERSON: '',//处理批准人
					APPR_DATE: '',//批准日期
					DO_PERSON: '',//处理人
					DO_DATE: '',//处理日期
					MEMO: '',//备注
					STATE: '3',//状态
					STATEDesc:'已检',
					STATUS: '',//信息状态
					ENTERBY: '',//录入人
					ENTERDATE: '',//录入时间
					CHANGEBY: '',//修改人
					CHANGEDATE: '',//修改时间
				};
				this.$refs.child.childMethods();
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
					this.samplesForm = this.selMenu[0]; 
					this.$refs.child.detail();
				}
			},
			//查看
			view(data) {
				this.samplesForm = data; 
				this.$refs.child.view();
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
			},
						//报表
			reportdata(){
				this.reportData.app=this.itemreturn;
				this.$refs.reportChild.visible();
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
					var url = this.basic_url + '/api-apps/app/itemreturn/deletes';
					//changeMenu为勾选的数据
					var changeMenu = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeMenu.length; i++) {
						deleteid.push(changeMenu[i].ID);
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
						// 删除
			physicsDel() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-apps/app/itemreturn/physicsDel';
					//changeMenu为勾选的数据
					var changeMenu = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeMenu.length; i++) {
						deleteid.push(changeMenu[i].ID);
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
			//样品序号树
			getKey() {
				let that = this;
				var url = this.basic_url + '/api-apps/appCustom/tree';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data.datas;
					this.treeData = this.transformTree(this.resourceData);
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
			handleNodeClick(data) {
				if(data.type=='dept') {
					this.searchList.P_NUM = '';
					this.searchList.PRO_NUM = '';
					this.searchList.DEPTID = data.deptid;
					this.page.currentPage = 1;
				}else if(data.type=='product'){
					this.searchList.PRO_NUM = data.num.substr(1);
					this.searchList.P_NUM = '';
					this.searchList.DEPTID = data.deptid;
					this.page.currentPage = 1;
				}else if(data.type=='producttype'){
					this.searchList.PRO_NUM = '';
					this.searchList.P_NUM = data.num.substr(2);
					this.searchList.DEPTID = data.deptid;
					this.page.currentPage = 1;
				}else{
					this.searchList.P_NUM = '';
					this.searchList.PRO_NUM = '';
					this.searchList.DEPTID = '';
					this.page.currentPage = 1;
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
			},
			getSelPerson(){
				this.$axios.get(this.basic_url + '/api-user/users', {
				}).then((res) => {
					var resData = res.data.data;
					for (let i = 0; i < resData.length; i++) {
						this.selPerson.push({
							id: resData[i].id,
							fullname:  resData[i].nickname
						})
					}
				}).catch((wrong) => {})
			}
		},
		
		mounted() {// 在页面挂载前就发起请求
			this.getKey();
			this.treeDrag();//调用树和表单之间拖拽改变宽度
			this.getSelPerson();
		},
	}
</script>

<style scope>
.p15 {padding:10px 15px;}
</style>