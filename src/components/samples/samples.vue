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
						<el-form inline-message :model="searchList" label-width="70px">
							<el-row :gutter="5">
								<el-col :span="7">
									<el-form-item label="样品编号" prop="ITEMNUM">
										<el-input v-model="searchList.ITEMNUM" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="7">
									<el-form-item label="产品类别" prop="PRODUCT_TYPE">
										<el-input v-model="searchList.PRODUCT_TYPE" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="7">
									<el-form-item label="委托单位" prop="V_NAME">
										<!-- <el-input v-model="searchList.V_NAME" @keyup.enter.native="searchinfo"></el-input> -->
										<el-select clearable 
											   v-model="searchList.V_NAME" 
											   filterable 
											   default-first-option 
											   placeholder="请选择">
											<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="5">
								<el-col :span="7">
									<el-form-item label="样品名称" prop="DESCRIPTION">
										<el-input v-model="searchList.DESCRIPTION" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="7">
									<el-form-item label="收样人" prop="ACCEPT_PERSON">
										<el-select clearable 
											   v-model="searchList.ACCEPT_PERSON" 
											   filterable 
											   default-first-option 
											   placeholder="请选择">
											<el-option v-for="(data,index) in selPerson" :key="index" :value="data.id" :label="data.fullname"></el-option>
										</el-select>
										<!-- <el-input v-model="searchList.ACCEPT_PERSON" @keyup.enter.native="searchinfo"></el-input> -->
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="收样日期" prop="ACCEPT_DATE">
										<div class="block">
											<el-date-picker
											v-model="searchList.ACCEPT_DATE"
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
								<div class="left_tree_title clearfix" >
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
										<p class="blue" title="点击查看详情" @click=view(scope.row.ID)>{{scope.row.ITEMNUM}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="样品名称" sortable width="200px" prop="DESCRIPTION" v-if="this.checkedName.indexOf('样品名称')!=-1">
								</el-table-column>
								<el-table-column label="产品类别" sortable width="300px" prop="PRODUCT_TYPE" v-if="this.checkedName.indexOf('产品类别')!=-1">
								</el-table-column>
								<el-table-column label="委托单位" sortable width="260px" prop="V_NAMEDesc" v-if="this.checkedName.indexOf('委托单位')!=-1">
								</el-table-column>
								<el-table-column label="生产单位" sortable width="200px" prop="P_NAMEDesc" v-if="this.checkedName.indexOf('生产单位')!=-1">
								</el-table-column>
								<el-table-column label="型号" width="100px" prop="MODEL" sortable v-if="this.checkedName.indexOf('型号')!=-1">
								</el-table-column>
								<el-table-column label="数量" width="100px" prop="QUATITY" sortable v-if="this.checkedName.indexOf('数量')!=-1">
								</el-table-column>
								<el-table-column label="收样人" sortable width="140px" prop="ACCEPT_PERSONDesc" v-if="this.checkedName.indexOf('收样人')!=-1">
								</el-table-column>
								<el-table-column label="收样日期" sortable width="140px" :formatter="dateFormat" prop="ACCEPT_DATE" v-if="this.checkedName.indexOf('收样日期')!=-1">
								</el-table-column>
								<!-- <el-table-column label="接样人" sortable width="140px" prop="RECIP_PERSON" v-if="this.checkedName.indexOf('接样人')!=-1">
								</el-table-column>
								<el-table-column label="接样日期" sortable width="140px" :formatter="dateFormat" prop="RECIP_DATE" v-if="this.checkedName.indexOf('接样日期')!=-1">
								</el-table-column> -->
								<el-table-column label="状态" sortable width="100px" prop="STATEDesc" v-if="this.checkedName.indexOf('状态')!=-1">
								</el-table-column>
							</v-table>
							<!-- 表格 -->
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<samplesmask  ref="child" @request="requestData" @requestTree="getKey" v-bind:page=page></samplesmask>
		<!--右侧内容显示 End-->
			<!--报表-->
		<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
		<el-dialog
			title="条码"
			:visible.sync="codeDialog"
			width="80%"
			:before-close="resetCode"
			center>
			<div id="printdom">
				<el-form label-width="120px" :rules="rules" ref="codeForm">
					<el-row>
						<el-col :span="8">
							<el-form-item label="样品类型" v-show="sampleTypeFlag && codeUrl==''">
								<el-radio-group v-model="sampleType" @change="getSampleList">
									<el-radio label="1">样品批次</el-radio>
									<el-radio label="2">样品序号</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="8">
							<el-form-item label="条码类型">
								<el-radio-group v-model="codeType">
									<el-radio label="1">条形码</el-radio>
									<el-radio label="2">二维码</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<el-table
					ref="singleTable"
					:data="sampleList"
					highlight-current-row
					@current-change="selCurrentChange"

					border
					stripe
					style="width: 100%;"
					v-show="sampleType=='2'"
					@selection-change="selSample">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="ITEMNUM" label="样品编号" sortable  ></el-table-column>
					<el-table-column prop="ITEM_STEP" label="样品序号" sortable ></el-table-column>
					<el-table-column prop="STATEDesc" label="样品状态" sortable></el-table-column>
				</el-table>
				<img  id="barcode" :src="codeUrl" alt="条码" v-show="codeUrl!=''"/>
			</div>
			<span slot="footer">
				<el-button type="primary" @click="genCode">生成条码</el-button>
				<router-link target="_blank" :to="{path:'/printCode',query:{imgUrl: codeUrl}}">
					<el-button type="primary" v-show="codeUrl!=''">打印条码</el-button>
				</router-link>
			</span>
		</el-dialog>
	</div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import samplesmask from'../samplesDetails/samples_mask.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'samples',//接样
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
				rules:{
					codeType: [
						{ required: true, message: '请选择条码类型', trigger: 'change' }
					],
				},
				sampleType: '1',
				codeType: '2',
				appName: 'item',
				codeDialog: false,
				codeUrl: '',
				code_url: Config.code_url,
				reportData:{},//报表的数据
				basic_url: Config.dev_url,
				isShow: false,
				ismin: true,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				commentArr: {},
				checkedName: [
					'样品编号',
					'样品名称',
					'产品类别',
					'委托单位',
					'生产单位',
					'型号',
					'数量',
					'收样人',
					'收样日期',
					'接样人',
					'接样日期',
					'状态',
					'信息状态',
				],
				tableHeader: [{
						label: '样品编号',
						prop: 'ITEMNUM'
					},
					{
						label: '样品名称',
						prop: 'DESCRIPTION'
					},
					{
						label: '产品类别',
						prop: 'PRODUCT_TYPE'
					},
					{
						label: '委托单位',
						prop: 'P_NAME'
					},
					{
						label: '生产单位',
						prop: 'P_NAME'
					},
					
					{
						label: '型号',
						prop: 'MODEL'
					},
					{
						label: '数量',
						prop: 'QUATITY'
					},
					{
						label: '收样人',
						prop: 'ACCEPT_PERSON'
					},
					{
						label: '收样日期',
						prop: 'ACCEPT_DATE'
					},
					{
						label: '状态',
						prop: 'STATEDesc'
					},
					{
						label: '信息状态',
						prop: 'STATUS'
					},
				],
				companyId: '',
				deptId: '',
				selMenu: [],
				samplesList: [],
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				search: false,
				show: false,
				down: true,
				up: false,
				searchList: {
					ITEMNUM:'',//样品编号
					V_NAME: '',//委托单位名称
					DESCRIPTION: '',//样品名称
					ACCEPT_PERSON: '',//收样人
					// P_NAME: '',//生产单位名称
					TYPE: '',//样品类别
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
				sampleList: [],
				sampleTypeFlag: false,
				selectData: [],
				selPerson: [],
				
				item:'item'//appname
			}
		},
		methods: {
			selCurrentChange(row){
				this.selSampleData = [];
				this.selSampleData.push(row);
				this.$refs.singleTable.clearSelection();
       			this.$refs.singleTable.toggleRowSelection(row);
			},
			selSample(val){
				this.selSampleData = val;
			},
			genCode(){
				if(this.sampleType=='2'&&this.selSampleData.length==0){
					this.$message({
						message: '请您选择数据',
						type: 'warning'
					});
					return;
				}
				if(this.selSampleData.length>1){
					this.$message({
						message: '不可同时选择多条数据',
						type: 'warning'
					});
					return;
				}
				var url = this.basic_url + '/api-apps/app/item/operate/buildbarcode4jcode?SIMPLE_CODE='
						+this.selMenu[0].ITEMNUM
						+'&SIMPLE_NAME='
						+ this.selMenu[0].DESCRIPTION
						+'&CODE_TYPE='
						+ this.codeType;
				if(this.sampleType=='2'){
					url = url+ '&ITEM_STEP='+ this.selSampleData[0].ITEM_STEP;
				}
				this.$axios.get(url, {}).then((res) => {//.delete 传数据方法
					if(res.data.resp_code == 0) {
						this.sampleTypeFlag = false;
						this.codeDialog = true;
						this.codeUrl = this.code_url + res.data.datas;
						this.saveData();
					}
				}).catch((err) => {});
			},
			saveData(){
				var url = this.basic_url + '/api-apps/app/item/operate/saveItemType'
				this.$axios.post(url, {
					itemType: this.sampleType,
					itemNum: this.selMenu[0].ITEMNUM
				}).then((res) => {
					if(res.data.resp_code == 0) {
						console.log('保存成功');
					}
				}).catch((err) => {});
			},
			getSampleList(){
				this.selSampleData = [];
				if(this.sampleList.length>0){
					return false;
				}
				var dataid = this.selMenu[0].ID;
				this.$axios.get(this.basic_url + '/api-apps/app/item/' + dataid, {}).then((res) => {
					this.sampleList = res.data.ITEM_LINEList;
				}).catch((err) => {});
			},
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
					ITEMNUM:'',//样品编号
					V_NAME: '',//委托单位名称
					DESCRIPTION: '',//样品名称
					ACCEPT_PERSON: '',//收样人
					TYPE: '',//样品类别
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
				}else{
					this.barcode();
				}
			},
			barcode(){
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
					this.sampleTypeFlag = !this.selMenu[0].ITEM_TYPE||!this.selMenu[0].ISRECEIVE ? true : false;
					if(this.selMenu[0].ITEM_TYPE =='2'){
						this.getSampleList();
						this.sampleType = '2';
					}
					this.codeDialog = true;
				}
			},
			resetCode(){
				this.codeDialog = false;
				this.sampleTypeFlag = false;
				this.sampleType = '1';
				this.codeType = '2';
				this.selMenu = [];
				this.selSampleData = [];
				this.sampleList = [];
				this.codeUrl = '';
				this.requestData();
			},
			printCode(){
				let routeUrl = this.$router.resolve({
					name: '/print',
					query:{
						imgUrl: this.codeUrl,
					}
				});
				this.resetCode();
				window.open(routeUrl.href, '_blank');
			},
			//添加样品管理
			openAddMgr() {
				this.$refs.child.visible();
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
					if(this.selMenu[0].ISRECEIVE=='1'){
						this.$message({
							message: '此样品已有领样单，不可修改！',
							type: 'warning'
						});
						return;
					}
					this.$refs.child.detail(this.selMenu[0].ID);
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
			//报表
			reportdata(){
				this.reportData.app=this.item;
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
					if(this.selMenu[0].ISRECEIVE=='1'){
						this.$message({
							message: '此样品已有领样单，不可删除！',
							type: 'warning'
						});
						return;
					}
					if(this.selMenu[0].PROXYNUM!=''){
						this.$message({
							message: '此样品已绑定委托书，不可删除！',
							type: 'warning'
						});
						return;
					}
					var url = this.basic_url + '/api-apps/app/item/deletes';
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
						}).catch((err) => {});
                    }).catch(() => {});
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
					var url = this.basic_url + '/api-apps/app/item/physicsDel';
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
			//生产单位树
			getKey() {
				let that = this;
				// var url = this.basic_url + '/api-user/depts/tree';
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
						right.style.width = maxT - iT -middleWidth -240 + "px"; 
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
			getSelPromise(){
				var arr1 = [];
				var resFun = new Promise((resolve,reject)=>{
					this.$axios.get(this.basic_url + '/api-user/depts/findFirstSecond', {}).then((res) => {
						this.selectData = res.data;
						resolve(arr1);
					}).catch((wrong) => {})
				})
				return resFun;
			},
			getSelectData(){
				this.getSelPromise().then(()=>{
					this.$axios.get(this.basic_url + '/api-apps/app/customer', {}).then((res) => {
						var resData = res.data.data;
						for (let i = 0; i < resData.length; i++) {
							this.selectData.push({
								id: resData[i].ID,
								fullname:  resData[i].NAME
							})
						}
					}).catch((wrong) => {})
				})
				.catch(function(err){
					console.log(err);
				})
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
		mounted() {
			this.getKey();
			this.treeDrag();
			this.getSelectData();
			this.getSelPerson();
		},
	}
</script>

<style scope>
.p15 {padding:10px 15px;}
#printdom {
	page-break-before: always;
	text-align: center;
	display: block;
}
</style>