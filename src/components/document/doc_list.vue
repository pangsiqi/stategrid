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
					<div v-show="search" class="pb10">
						<el-form inline-message :model="searchList" label-width="70px">
							<el-row :gutter="30" class="pb5">
								<el-col :span="7">
									<el-input v-model="searchList.filename" @keyup.enter.native="searchinfo">
										<template slot="prepend">名称</template>
									</el-input>
								</el-col>
								<el-col :span="4">
									<el-button type="primary" @click="searchinfo" size="small" style="margin:4px">搜索</el-button>
									<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px;margin-left: 2px">重置</el-button>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<!-- 高级查询划出 End-->
					<el-row  class="relative" id="pageDiv">
						<!-- 左侧树菜单 Begin-->
						<el-col :span="5" class="lefttree" id="left">
							<div class="lefttreebg">
								<div class="left_tree_title clearfix" @click="min3max()">
									<div class="pull-left pr20" v-if="ismin">关键字类别及关键字</div>
									<!-- <span class="pull-right navbar-minimalize minimalize-styl-2">
										<i class="icon-doubleok icon-double-angle-left blue"></i>
									</span> -->
								</div>
								<div class="left_treebg" :style="{height: fullHeight}">
									<div class="p15" v-if="ismin">
										<el-tree ref="tree" class="filter-tree" 
												:data="resourceData" 
												node-key="id" 
												default-expand-all 
												:indent="22" 
												:render-content="renderContent"  
												@node-click="handleNodeClick"
												:props="resourceProps">
										</el-tree>
									</div>
								</div>
							</div>
						</el-col>
						<div id="middle"></div>
						<el-col  :span="19" class="leftcont" id="right">
							<!-- 表格 -->
							<el-table :data="fileList" 
									  border 
									  :height="fullHeight" 
									  style="width: 100%;" 
									  :default-sort="{prop:'fileList', order: 'descending'}"
									  v-loading="loading"  
								      element-loading-text="加载中…"
    							      element-loading-spinner="el-icon-loading"
    							      element-loading-background="rgba(255, 255, 255, 0.9)">
								<!-- <el-table-column type="selection" width="55" v-if="this.checkedName.length>0">
								</el-table-column> -->
								<el-table-column label="名称" sortable prop="filename" v-if="this.checkedName.indexOf('名称')!=-1">
								</el-table-column>
								<el-table-column label="状态" sortable width="200px" prop="filestatus" v-if="this.checkedName.indexOf('状态')!=-1">
								</el-table-column>
								<el-table-column label="上传时间" sortable width="200px" prop="uploadtime" v-if="this.checkedName.indexOf('上传时间')!=-1">
								</el-table-column>
								<el-table-column label="大小" sortable  width="140px" prop="filesize" v-if="this.checkedName.indexOf('大小')!=-1">
									<template slot-scope="scope">
										<span v-text="scope.row.filesize+'M'"></span>
									</template>
								</el-table-column>
								<el-table-column
									fixed="right"
									label="操作"
									width="200">
									<template slot-scope="scope">
										<el-popover
											placement="top"
											trigger="click">
											<div style="text-align: right; margin: 0">
												<el-button size="mini" type="text" :disabled="fileAuth.fileread==0"  @click="read(scope.row)">显示</el-button>
												<el-button size="mini" type="text" :disabled="fileAuth.filedownload==0" @click="download(scope.row)">下载</el-button>
												<el-button size="mini" type="text" :disabled="fileAuth.fileedit==0">编辑</el-button>
												<el-button size="mini" type="text" :disabled="fileAuth.fileprint==0">打印</el-button>
												<el-button size="mini" type="text" :disabled="fileAuth.fileduplicate==0">复制</el-button>
												<el-button size="mini" type="text" :disabled="fileAuth.filedelete==0">删除</el-button>
											</div>
											<el-button @click="showDo(scope.row)" type="text" size="small" slot="reference">文件权限</el-button>
										</el-popover>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination background class="text-right pt10" v-if="this.checkedName.length>0" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
							</el-pagination>
							<!-- 表格 -->
						</el-col>
					</el-row>
				</div>
			</div>
			<!--报表-->
			<reportmask :reportData="reportData" ref="reportChild"></reportmask>
		<!-- <samplesmask  ref="child" @request="requestData" @requestTree="getKey" v-bind:page=page></samplesmask> -->
		<!--右侧内容显示 End-->
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
	export default {
		name: 'samples',//接样
		components: {
			vheader,
			navs_tabs,
			navs_left,
			tableControle,
			samplesmask,
			reportmask
		},
		data() {
			return {
				reportData:{},//报表的数据
				loading: false,
				visible2: false,
				basic_url: Config.dev_url,
				file_url: Config.file_url,
			    po_url:Config.po_url,//pageoffice 服务路径
				isShow: false,
				ismin: true,
				loadSign: true, //加载
				commentArr: {},
				checkedName: [
					'名称', 
					'状态',
					'大小',
					'上传时间'
				],
				tableHeader: [{
						label: '名称',
						prop: 'filename'
					},
					{
						label: '状态',
						prop: 'filestatus'
					},
					{
						label: '大小',
						prop: 'filesize'
					},
					{
						label: '上传时间',
						prop: 'uploadtime'
					}
				],
				companyId: '',
				deptId: '',
				selMenu: [],
				fileList: [],
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				search: false,
				show: false,
				down: true,
				up: false,
				searchList: {
					'filename': ''
				},
				//tree树菜单
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceProps: {
					children: "subDepts",
					label: "fullname"
				},
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				treeData: [],
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				userParm: {},
				fileAuth: {
					filedelete: 0,
					filedownload: 0,
					fileduplicate: 0,
					fileedit: 0,
					fileprint: 0,
					fileread: 0,
					fileupload: 0,
				},
				fileAuthShow: false,
				samplesForm: {},//修改子组件时传递数据
				buttons:[],
			}
		},
		methods: {
			renderContent(h, {node,data,store}) { //自定义Element树菜单显示图标
				return (<span><i class={data.iconClass}></i><span  title={data.lable}>{data.lable}</span></span>)
			},
			//机构树
			getTree() {
				let that = this;
				var url = this.file_url + '/file/categoryKeyWordTreeList';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data.categoryList;
					if(this.resourceData!=null){
						this.resourceData = this.transformTree(this.resourceData);
					}
				}).catch((wrong) => {
				});
			},
			transformTree(data) {
				for(var i = 0; i < data.length; i++) {
					data[i].name = data[i].categoryname || data[i].keywordname;
					data[i].lable = data[i].categoryname || data[i].keywordname;
					if($.isArray(data[i].keywordList)) {
						data[i].iconClass = 'icon-file-normal';
					} else {
						data[i].iconClass = 'icon-file-text';
					}
					if($.isArray(data[i].keywordList)) {
						data[i].subDepts = this.transformTree(data[i].keywordList);
					}
				}
				return data;
			},
			handleNodeClick(data) {
				if(!!data.categoryid){
					this.searchList.categoryid = data.categoryid;
					this.searchList.keywordid = data.id;
					this.requestData();
				}
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

			//请求点击
		    getbtn(item){
		    	if(item.name=="高级查询"){
		    	 this.modestsearch();
		    	}else if(item.name=="报表"){
			     this.reportdata();
				}
		    },
			download(row){
				var url = row.filepath 
                        + '&userid=' + this.userParm.userid
                        + '&username=' + this.userParm.username
                        + '&deptid=' + this.userParm.deptid
                        + '&deptfullname=' + this.userParm.deptfullname;
                window.open(url); 
			},
			read(row){
				var url = this.po_url +"/show?filename=" +row.filename
                        + '&userid=' + this.userParm.userid
                        + '&username=' + this.userParm.username
                        + '&deptid=' + this.userParm.deptid
                        + '&deptfullname=' + this.userParm.deptfullname;
                window.open(url); 
			},
			showDo(row){
				var data = {
					"userid": this.userParm.userid,
					"fileid": row.fileid
				};
				var url = this.file_url + '/file/privilege';
				this.$axios.post(url, data).then((res) => {
					this.fileAuth = res.data;
				}).catch((wrong) => {})
			},
			tableControle(data) {//控制表格列显示隐藏
				this.checkedName = data;
			},
			sizeChange(val) {//分页，总页数
				this.page.pageSize = val;
				this.requestData();
			},
			currentChange(val) {//分页，当前页
				this.page.currentPage = val;
				this.requestData();
			},
		    resetbtn(){
			this.searchList = { //点击高级搜索后显示的内容
			filename: '',
			};
			this.requestData();
			},
			searchinfo(index) {//高级查询
				this.page.currentPage = 1;
				this.page.pageSize = 10;
				this.requestData();
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
					this.$refs.child.detail(this.selMenu[0].ID);
				}
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
				this.down = !this.down,
					this.up = !this.up
			},
			//报表
			reportdata(){
				this.reportData.app=this.productType;
				this.$refs.reportChild.visible();
			},
			SelChange(val) {//选中值后赋值给一个自定义的数组：selMenu
				this.selMenu = val;
			},
			requestData() {
				this.loading = true;
				var data = {
					userid: this.userParm.userid,
					filename: this.searchList.filename,
				}
				if(!!this.searchList.categoryid){
					data.categoryid = this.searchList.categoryid;
					data.keywordid = this.searchList.keywordid;
				}
				var url = this.file_url + '/file/baseKeywordList?page='+this.page.currentPage+'&limit='+this.page.pageSize;
				this.$axios.post(url, data).then((res) => {
					this.page.totalCount = res.data.total;
					this.fileList = res.data.vBaseKeywordFiles;
					this.loading = false;
				}).catch((wrong) => {})
			},
			

			min3max() { //左侧菜单正常和变小切换
				if($(".lefttree").hasClass("el-col-5")) {
					$(".lefttree").removeClass("el-col-5");
					$(".lefttree").addClass("el-col-1");
					$(".leftcont").removeClass("el-col-19");
					$(".leftcont").addClass("el-col-23");
					$(".icon-doubleok").removeClass("icon-double-angle-left");
					$(".icon-doubleok").addClass("icon-double-angle-right");
				} else {
					$(".lefttree").removeClass("el-col-1");
					$(".lefttree").addClass("el-col-5");
					$(".leftcont").removeClass("el-col-23");
					$(".leftcont").addClass("el-col-19");
					$(".icon-doubleok").removeClass("icon-double-angle-right");
					$(".icon-doubleok").addClass("icon-double-angle-left");
				}
				this.ismin = !this.ismin;
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
		},
		mounted() {// 在页面挂载前就发起请求
			this.treeDrag();//调用树和表单之间拖拽改变宽度
			this.getTree();
			var url = this.basic_url + '/api-user/users/currentMap';
			this.$axios.get(url, {}).then((res) => {//获取当前用户信息
				this.userParm.userid = res.data.id;
				this.userParm.username = res.data.username;
				this.userParm.deptid = res.data.deptId;
				this.userParm.deptName = res.data.deptName;
				this.requestData();
			}).catch((err) => {
			});
			
		},
	}
</script>

<style scope>
.p15 {padding:10px 15px;}
</style>