<template>
<!-- 仪器和器量依据页面 -->
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
						<tableControle :tableHeader="tableHeader" :checkedName="checkedName"  @tableControle="tableControle" ref="tableControle"></tableControle>
					</div>
				</div>
				<!-- 高级查询划出 Begin-->
				<div v-show="search">
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="10">
							<el-col :span="5"></el-col>
							<el-col :span="5">
								<el-form-item label="设备名称" prop="DESCRIPTION">
									<el-input v-model="searchList.DESCRIPTION" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="制造商" prop="VENDOR">
									<el-input v-model="searchList.VENDOR" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="保管人" prop="KEEPER">
									<!-- <el-input v-model="searchList.KEEPER" @keyup.enter.native="searchinfo"></el-input> -->
									<el-select clearable 
											v-model="searchList.KEEPER" 
											filterable 
											default-first-option 
											placeholder="请选择">
										<el-option v-for="(data,index) in selPerson" :key="index" :value="data.id" :label="data.fullname"></el-option>
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
								<div class="pull-left pr20" v-if="ismin">设备分类</div>
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
						<!-- 表格 Begin-->
						<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
							<el-table-column label="设备编号" width="130" sortable prop="ASSETNUM" v-if="this.checkedName.indexOf('设备编号')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.ASSETNUM}}
									</p>
								</template>
							</el-table-column>
							<el-table-column label="设备名称" width="200" sortable prop="DESCRIPTION" v-if="this.checkedName.indexOf('设备名称')!=-1">
							</el-table-column>
							<el-table-column label="型号" width="160" sortable prop="MODEL" v-if="this.checkedName.indexOf('型号')!=-1">
							</el-table-column>
							<el-table-column label="技术指标" width="140" sortable prop="ASSET_KPI" v-if="this.checkedName.indexOf('技术指标')!=-1">
							</el-table-column>						
							<el-table-column label="制造商" width="140" sortable prop="VENDOR" v-if="this.checkedName.indexOf('制造商')!=-1">
							</el-table-column>
							<el-table-column label="出厂编号" width="160" sortable prop="FACTOR_NUM" v-if="this.checkedName.indexOf('出厂编号')!=-1">
							</el-table-column>
							<el-table-column label="价格(万元)" width="140" sortable prop="A_PRICE" v-if="this.checkedName.indexOf('价格(万元)')!=-1">
							</el-table-column>
							<el-table-column label="接受日期" width="140" sortable prop="ACCEPT_DATE" :formatter="dateFormat" v-if="this.checkedName.indexOf('接受日期')!=-1">
							</el-table-column>
							<el-table-column label="启用日期" width="140" sortable prop="S_DATE" :formatter="dateFormat" v-if="this.checkedName.indexOf('启用日期')!=-1">
							</el-table-column>						
							<el-table-column label="配置地址" width="140" sortable prop="C_ADDRESS" v-if="this.checkedName.indexOf('配置地址')!=-1">
							</el-table-column>
							<el-table-column label="接收状态" width="120" sortable prop="A_STATUS" v-if="this.checkedName.indexOf('接收状态')!=-1">
							</el-table-column>
							<el-table-column label="保管人" width="200" sortable prop="KEEPER" v-if="this.checkedName.indexOf('保管人')!=-1">
							</el-table-column>						
							<el-table-column label="备注" width="200" sortable prop="MEMO" v-if="this.checkedName.indexOf('备注')!=-1">
							</el-table-column>
						</v-table>
						<!-- 表格 End-->
					</el-col>
				</el-row>
			</div>
		</div>
		<!--右侧内容显示 End-->
		<instrumentsmask :detailData="selUser[0]" ref="child" @request="requestData"></instrumentsmask>
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
	import tableControle from '../plugin/table-controle/controle.vue'
	import instrumentsmask from '../equipmentsDetails/instrument_mask.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'instruments',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'instrumentsmask': instrumentsmask,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'asset',
				reportData:{},//报表的数据
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				commentArr: {},
				fileList:[],//文件上传的接收数据
				status: [
					{
						label: '启用',
						value: 1
					},
					{
						label: '封存',
						value: 2
					},
					{
						label: '报废',
						value: 3
					}
				],
				basic_url: Config.dev_url,
				dataUrl: '/api/api-user/users',
				searchData: {
			        page: 1,
			        limit: 10,//分页显示数
			        A_NAME: '',
			        VENDOR: '',
			        KEEPER: '',
			        STATE: '',
			        OPTION_STATUS: ''
		        },
				checkedName: [
					'设备编号',
					'设备名称',
					'型号',
					'技术指标',
					'制造商',
					'出厂编号',
					'价格（万元）',
					'接受日期',
					'启用日期',
					'配置地址',
					'接收状态',
					'保管人',
					'备注',
				],
				tableHeader: [
					{
						label: '设备编号',
						prop: 'ASSETNUM'
					},
					{
						label: '设备名称',
						prop: 'DESCRIPTION'
					},
					{
						label: '型号',
						prop: 'MODEL'
					},
					{
						label: '技术指标',
						prop: 'ASSET_KPI'
					},
					{
						label: '制造商',
						prop: 'VENDOR'
					},
					{
						label: '出厂编号',
						prop: 'FACTOR_NUM'
					},
					{
						label: '价格（万元）',
						prop: 'A_PRICE'
					},
					{
						label: '接受日期',
						prop: 'ACCEPT_DATE'
					},
					{
						label: '启用日期',
						prop: 'S_DATE'
					},
					{
						label: '配置地址',
						prop: 'C_ADDRESS'
					},
					{
						label: '接收状态',
						prop: 'A_STATUS'
					},
					{
						label: '保管人',
						prop: 'KEEPER'
					},
					{
						label: '备注',
						prop: 'MEMO'
					}
				],
				
				companyId: '',
				deptId: '',
				selUser: [],
				assetList: [],
				search: false,
				show: false,
				down: true,
				up: false,
				isShow: false,
				ismin:true,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					DESCRIPTION: '',
			        VENDOR: '',
			        KEEPER: '',
			        STATE: '',
			        OPTION_STATUS: ''
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "children",
					label: "CLASSIFY_DESCRIPTION"
				},
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				treeData: [],
				buttons:[],
				selPerson: [],
				asset:'asset'//appname
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
					DESCRIPTION: '',
			        VENDOR: '',
			        KEEPER: '',
			        STATE: '',
			        OPTION_STATUS: ''
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
		    	}else if(item.name=="报表"){
			     this.reportdata();
				}else if(item.name=="打印"){
				   this.Printing();
				}
		    },
			//添加
			openAddMgr() {
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
						message: '不可同时修改多条数据',
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
					var url = this.basic_url + '/api-apps/app/asset/deletes';
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
					var url = this.basic_url + '/api-apps/app/asset/physicsDel';
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
			fileSuccess(){//上传成功后返回数据
				this.page.currentPage = 1;
				this.requestData('init');
			},
			uploadUrl(){
                var url = this.basic_url +'/api-apps/app/asset/importExc?access_token='+sessionStorage.getItem('access_token');
                return url;
            },
			// 导入
			download() {
				var url = this.basic_url + '/api-apps/app/asset/importExcTemplete?access_token='+sessionStorage.getItem('access_token');
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
           		var url = this.basic_url + '/api-apps/app/asset/exportExc?access_token='+sessionStorage.getItem('access_token');
          		var xhr = new XMLHttpRequest();
            	xhr.open('POST', url, true);
            	xhr.responseType = "blob";
            	xhr.setRequestHeader("client_type", "DESKTOP_WEB");
            	xhr.onload = function() {
                	if (this.status == 200) {
						var filename = "asset.xls";
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
				this.reportData.app=this.asset;
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
			
			requestData(opt) {
				this.$refs.table.requestData(opt);
			},
			//  机构树
			getKey() {
				let that = this;
				var url = this.basic_url + '/api-apps/app/assetClass/tree?tree_id=CLASSIFY_NUM&tree_pid=PARENT';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data.datas;
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
				console.log(data);
				for(var i = 0; i < this.resourceData.length; i++) {
					if(data.CLASSIFY_DESCRIPTION == this.resourceData[i].CLASSIFY_DESCRIPTION) {
						this.searchList.DESCRIPTION = this.resourceData[i].CLASSIFY_DESCRIPTION;
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
      		renderContent(h, {node,data,store}) { //自定义Element树菜单显示图标
				return (<span><i class={data.iconClass}></i><span>{node.label}</span></span>)
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
		mounted(){
            this.getKey();
			this.treeDrag();//调用树和表单之间拖拽改变宽度
			this.getSelPerson();
        },
	}
</script>