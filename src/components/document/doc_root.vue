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
					<div class="fixed-table-toolbar clearfix">
						<div class="bs-bars pull-left">
							<div class="hidden-xs" id="roleTableToolbar" role="group">
								<form method="post" id="file" action="" enctype="multipart/form-data" style="float: left; position: relative;" v-show="isUploadBtn">
									<button style="margin-right: 4px;" type="button" class="btn btn-green a-upload">
										<i class="icon-add"></i>上传
										<input id="excelFile" type="file" name="uploadFile" @change="upload" />
									</button>
								</form>
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
					<!-- <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone> -->
					<!-- 高级查询划出 Begin-->
					<div v-show="search" class="pb10">
						<el-form inline-message :model="searchList" label-width="70px">
							<el-row :gutter="30" class="pb5">
								<el-col :span="7">
									<el-input v-model="searchList.appname" @keyup.enter.native="searchinfo">
										<template slot="prepend">应用名称</template>
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
					<el-row class="relative" id="pageDiv">
						<!-- 左侧树菜单 Begin-->
						<el-col :span="5" class="lefttree" id="left">
							<div class="lefttreebg">
								<div class="left_tree_title clearfix" @click="min3max()">
									<div class="pull-left pr20" v-if="ismin">文件树</div>
									<!-- <span class="pull-right navbar-minimalize minimalize-styl-2">
										<i class="icon-doubleok icon-double-angle-left blue"></i>
									</span> -->
								</div>
								<div class="left_treebg" :style="{height: fullHeight}">
									<div class="p15" v-if="ismin">
										<el-tree ref="tree"
										 	:render-content="renderContent" 
										 	:load="loadNode"
											:default-expanded-keys=treeIdSel
										 	node-key="id"
										 	lazy
										 	:props="props"
										 	@node-click="handleNodeClick"
											v-if="treeShow">
										</el-tree>
									</div>
								</div>
							</div>
						</el-col>
						<div id="middle"></div>
						<el-col :span="19" class="leftcont" id="right">
							<!-- 表格 -->
							<el-table ref="table" :header-cell-style="rowClass"
									:data="fileList" 
									border 
									stripe 
									:height="fullHeight" 
									style="width: 100%;" 
									:default-sort="{prop:'fileList', order: 'descending'}" 
									@selection-change="SelChange"
	    							v-loadmore="loadMore"
									v-loading="loading"  
								    element-loading-text="加载中…"
								    element-loading-spinner="el-icon-loading"
								    element-loading-background="rgba(255, 255, 255, 0.9)">
								<el-table-column type="selection" width="55" fixed v-if="this.checkedName.length>0" align="center">
								</el-table-column>
								<el-table-column label="名称" sortable prop="filename" v-if="this.checkedName.indexOf('名称')!=-1">
								</el-table-column>
								<el-table-column label="应用" sortable prop="appname" v-if="this.checkedName.indexOf('应用')!=-1">
								</el-table-column>
								<el-table-column label="状态" sortable width="200px" prop="filestatus" v-if="this.checkedName.indexOf('状态')!=-1">
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
										<el-button @click="showAuth(scope.row)" type="text" size="small">关键字</el-button>
										<el-button @click="delFile(scope.$index,scope.row,)" type="text" size="small">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
							<!-- 表格 -->
							<el-pagination background class="text-right pt10" v-if="this.checkedName.length>0" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40, 100]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
							</el-pagination>
						</el-col>
					</el-row>
				</div>
				<!--报表-->
				<reportmask :reportData="reportData" ref="reportChild"></reportmask>
			</div>
		</div>
		<!-- <samplesmask ref="child" @request="requestData" @requestTree="getKey" v-bind:page=page></samplesmask> -->
		<!--右侧内容显示 End-->
		<el-dialog :modal-append-to-body="false" title="文件夹" :visible.sync="dirDialog">
			<el-form inline-message :model="dir" label-width="80px">
				<el-form-item label="名称">
					<el-input v-model="dir.dirName"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="primary" @click="addDir">确 定</el-button>
				<el-button @click="resetDir">取 消</el-button>
			</div>
		</el-dialog>
		<vkeyword ref="keyword" :param="param"></vkeyword>
		<!-- <vchoose ref="choose" :chooseParam = "chooseParam" @tranFormData = 'getChoose'></vchoose> -->
	</div>
</template>
<script>
	import 'vue2-dropzone/dist/vue2Dropzone.min.css'
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import samplesmask from'../samplesDetails/samples_mask.vue'
	import vueDropzone from 'vue2-dropzone'
	import vkeyword from '../common/keyword.vue'
	import vchoose from '../common/dataChoose.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	export default {
		name: 'samples',//接样
		components: {
			vheader,
			navs_tabs,
			navs_left,
			tableControle,
			samplesmask,
			vueDropzone,
			vkeyword,
			vchoose,
			reportmask
		},
		data() {
			return {
				reportData:{},//报表的数据
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				treeShow: true,
				treeIdSel: [],
				chooseParam: {
					selShow: false,
					visible: false,
					title: "用户列表",
					listName: 'user',
					selMax: 1,
					tableHeader: [
						{
							propName: 'username',
							labelName: '用户姓名'
						},
						{
							propName: 'deptName',
							labelName: '组织机构'
						}

					],
					search: [
						{
							name: 'deptId',
							val: ''
						}
					],
					url: '/api-user/users'
				},
				param: {
					visible: false,
				},
				resolve: function(){},
				node: {},
				parentNode: {},
				dirDialog: false,
				dir: {
					'dirName': ''
				},
				defaultKey: [],
				props: {
					label: 'name',
					children: 'zones',
				},
				//上传初始化参数
				dropzoneOptions: {
					url: 'https://httpbin.org/post',
					thumbnailWidth: 150,
					maxFilesize: 0.5,
					addRemoveLinks: true,
					headers: { "My-Awesome-Header": "header value" },
					dictDefaultMessage: "<i class='el-icon-upload'></i>点击上传"
				},
				file_url: Config.file_url,
				basic_url: Config.dev_url,
				isShow: false,
				ismin: true,
				loadSign: true, //加载
				commentArr: {},
				checkedName: [
					'名称', 
					'状态',
					'大小',
					'应用'
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
						label: '应用',
						prop: 'appname'
					}
				],
				companyId: '',
				selMenu: [],
				fileList: [],
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				search: false,
				show: false,
				down: true,
				up: false,
				searchList: {
					'appname': ''
				},
				//tree树菜单
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {//树菜单数据
					children: "subDepts",
					label: "fullname"
				},
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				deptId: 0,
				docId: 0,
				docParm: {
					'userid': '',
					'username': '',
					'deptid': '',
					'deptfullname': '',
				},
				samplesForm: {},//修改子组件时传递数据
				buttons:[],
				isUploadBtn: false
			}
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			//请求点击
		    getbtn(item){
		    	if(item.name=="上传"){
		         	this.upload();
		    	}else if(item.name=="新建文件夹"){
					this.showDir();
				}else if(item.name=="高级查询"){
					this.modestsearch();
		    	}else if(item.name=="报表"){
					this.reportdata();
				}
		    },
			delFile(index,row){
				var url = this.file_url + '/file/deleteFile/' + row.fileid;
                this.$axios.delete(url,{}).then((res) => {
                    if(res.data.code == 1){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
						});
						this.fileList.splice(index, 1);
                    }else{
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                    }
                }).catch((err) => {
                });
			},
			showAuth(row){
				this.param.visible = true;
				this.param.fileid = row.fileid;
				this.$refs.keyword.getData();
				this.$refs.keyword.requestData();
			},
			getChoose(data){
				// listName: this.chooseParam.listName,
                // data: this.selData
				var selData = data.data;
			},
			resetDir(){
				this.dir.dirName = '';
				this.dirDialog = false;
			},
			showDir(){
				this.dirDialog = true;
			},
			addDir(){
				var url = this.file_url + '/file/createPath';
				this.$axios.post(url, {
					"parentid": this.docId,
					"foldername": this.dir.dirName,
					"deptid": this.docParm.deptid
				}).then((res)=>{
					this.resetDir();
					if(res.data.code == 0){
						this.$message({
							message: res.data.message,
							type: 'error'
						});
					}else{
						this.$message({
							message: '新建成功',
							type: 'success'
						});
						this.treeShow = false;
						var that = this;
						setTimeout(function(){
							that.treeShow = true;
						},200);
						// this.loadThisNode();
					}
				})
			},
			loadThisNode(){
				this.loading = true;
				var url = this.file_url + '/file/pathList';
				this.$axios.post(url, {
					'pathid': this.docId,
					'deptid': this.docParm.deptid
				}).then((res) => {
					this.fileList = res.data.fileList.fileList;
					var pathList = res.data.pathList;
					for(var i=0; i<pathList.length; i++){
						pathList[i].name = pathList[i].foldername;
					}
					this.loadNode(this.node, this.resolve, 'loadThisNode' , pathList);
					this.loading = false;
				});
			},
			upload(e){
				var formData = new FormData();
				formData.append('files', document.getElementById('excelFile').files[0]);
				var config = {
					//添加请求头
					headers: { "Content-Type": "multipart/form-data" },
					//添加上传进度监听事件
					onUploadProgress: e => {
						var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
						this.progress = completeProgress;
					}
				};
				var url = this.file_url + '/file/uploadfile?userid=' 
						+ this.docParm.userid 
						+ '&username=' + this.docParm.username
						+ '&deptid=' + this.docParm.deptid
						+ '&deptfullname=' + this.docParm.deptfullname
						+ '&pathid=' + this.docId
				this.$axios.post(url, formData, config
				).then((res)=>{
					if(res.data.code == 0){
						this.$message({
							message: res.data.message,
							type: 'error'
						});
					}else{
						this.$message({
							message: '文档已成功上传至服务器',
							type: 'success'
						});
						this.requestData();
					}
				})
			},
			append(node, data) {
				const newChild = { id: 56, label: 'testtest'};
				node.childNodes.push(newChild);
			},
			remove(node, data) {
				const parent = node.parent;
				const children = parent.childNodes || parent.data;
				const index = children.findIndex(d => d.id === data.id);
				
				var url = this.file_url + '/file/deletePath/' + node.data.id;
				this.$confirm('确定删除此文件夹吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					this.$axios.delete(url, {}).then((res) => {
						if(res.data.code == 1) {
							children.splice(index, 1);
							this.$message({
								message: '删除成功',
								type: 'success'
							});
						}else{
							this.$message({
								message: res.data.message,
								type: 'error'
							});
						}
					}).catch((err) => {
					});
				}).catch(() => {});
			},
			renderContent(h, {node,data,store}) { //自定义Element树菜单显示图标
				return (
					<span class="custom-tree-node" style=" display: block; width: 100%;">
						<span style="display: block; float: left; margin-top: 3px;">{node.label}</span>
						<span style="display: block;float: right;">
							<el-button size="mini" icon="icon-trash red" type="text" on-click={ () => this.remove(node, data) }></el-button>
						</span>
					</span>
				);
			},
			//表格滚动加载
			loadMore() {
				let up2down = sessionStorage.getItem('up2down');
				if(this.loadSign) {					
					if(up2down=='down'){
						this.page.currentPage++;
						if(this.page.currentPage > Math.ceil(this.page.totalCount / this.page.pageSize)) {
							this.page.currentPage = Math.ceil(this.page.totalCount / this.page.pageSize)
							return false;
						}
						let append_height = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
						if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
							$('.el-table__body-wrapper table').append('<div class="filing" style="height: '+append_height+'px;width: 100%;"></div>');
							sessionStorage.setItem('toBtm','true');
						}
					} else {
						sessionStorage.setItem('toBtm','false');
						this.page.currentPage--;
						if(this.page.currentPage < 1) {
							this.page.currentPage=1;
							return false;
						}
					}
					this.loadSign = false;
					setTimeout(() => {
						this.loadSign = true;
					}, 1000)
					this.requestData();
				}
			},
			sizeChange(val) {
				this.page.pageSize = val;
				if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
					$('.el-table__body-wrapper table').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
					sessionStorage.setItem('toBtm','true');
				}else{
					sessionStorage.setItem('toBtm','false');
				}
				this.requestData();
			},
			currentChange(val) {
				this.page.currentPage = val;
				if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
					$('.el-table__body-wrapper table').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
					sessionStorage.setItem('toBtm','true');
				}else{
					sessionStorage.setItem('toBtm','false');
				}
				this.requestData();
			},

			requestData(){
				this.loading = true;
				// var data = {
				// 	page: this.page.currentPage,
				// 	limit: this.page.pageSize,
				// 	appname:this.searchList.appname,
				// }
				var num = this.page.currentPage - 1;
				var url = this.file_url + '/file/pathList?size=' + this.page.pageSize +'&page=' + num;
				this.$axios.post(url, {
					'pathid': this.docId,
					'deptid': this.docParm.deptid,
					'appname': this.searchList.appname
				}).then((res) => {
					this.page.totalCount = res.data.fileList.total;
					//总的页数
					let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize);
					if(this.page.currentPage >= totalPage) {
						this.loadSign = false;
					} else {
						this.loadSign = true;
					}
					this.fileList = res.data.fileList.fileList;
					this.loading = false;//加载动画关闭
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}//滚动加载数据判断filing
				});
			},
			handleNodeClick(data){
				this.page.currentPage = 1;
				this.docId = data.id;
				this.node = data;
				this.parentNode = data.parent;
				this.treeIdSel.indexOf(data.id)==-1?this.treeIdSel.push(data.id):this.treeIdSel.splice(this.treeIdSel.indexOf(data.id),1);
				// this.refreshLazyTree();
				this.requestData();
			},
			getUser(){//获取当前用户信息
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url, {}).then((res) => {//获取当前用户信息
					this.docParm.userid = res.data.id;
					this.docParm.username = res.data.username;
					this.docParm.deptid = res.data.deptId;
					this.docParm.deptfullname = res.data.deptName;
				}).catch((err) => {
				});
			},
			loadNode(node, resolve, opt, param) {
				if(opt == 'loadThisNode'){
					var pathList = param;
					// this.node.doCreateChildren(pathList)
					return this.resolve(pathList);
				}
				this.resolve = resolve;
				let that = this;
				var url = that.file_url + '/file/pathList';
				var pathid = 2;
				if(node.level === 0){
					pathid = 0;
				}else{
					pathid = node.data.id || node.id;
				}
				if(that.deptId == 0){
					setTimeout(function(){
						that.$axios.post(url, {
							'pathid': pathid,
							'deptid': that.docParm.deptid
						}).then((res) => {
							that.fileList = res.data.fileList.fileList;
							that.page.totalCount = res.data.fileList.total;
							var pathList = res.data.pathList;
							for(let i=0; i<pathList.length; i++){
								pathList[i].id =  pathList[i].pathid;
								pathList[i].name = pathList[i].foldername;
							}
							// this.node.doCreateChildren(pathList);
							return resolve(pathList);
						});
					}, 1000);
				}else{
					that.$axios.post(url, {
						'pathid': pathid,
						'deptid': that.deptId.deptid
					}).then((res) => {
						that.fileList = res.data.fileList.fileList;
						var pathList = res.data.pathList;
						for(var i=0; i<pathList.length; i++){
							pathList[i].name = pathList[i].foldername;
							pathList[i].id =  pathList[i].pathid;
						}
						return resolve(pathList);
					});
				}
			},
			nodeClick(m) {
				if(m.iconClass != 'icon-file-text') {
					if(m.iconClass == 'icon-file-normal') {
						m.iconClass = 'icon-file-open';
					} else {
						m.iconClass = 'icon-file-normal';
					}
				}
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

			resetbtn(){
				this.searchList = { //点击高级搜索后显示的内容
					appname: '',
				};
				// this.requestData();
			},
			searchinfo(index) {//高级查询
				this.page.currentPage = 1;
				this.page.pageSize = 20;
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
				// this.down = !this.down,
				// this.up = !this.up
			},
			//报表
			reportdata(){
				this.reportData.app=this.productType;
				this.$refs.reportChild.visible();
			},
			findTreeId(parentid,chooseData){
				var data = chooseData;
				for(var i=0; i<data.length; i++){
					var flag = true;
					if(data.id == parentid){
						data.splice(i,1);
						flag = false;
					}
					if(flag){
						this.findTreeId(parentid, data[i]);
					}
				}
			},
			// 删除
			delDir() {
				const parent = this.node.parent;
				const children = parent.data.children || parent.data;
				const index = children.findIndex(d => d.id === data.id);
				children.splice(index, 1);
			},
			SelChange(val) {//选中值后赋值给一个自定义的数组：selMenu
				this.selMenu = val;
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
					var resData = res.data;
					var uploadIndex = 0;
					var uploadBtn = resData.filter((item,index)=>{
						if(item.name == '上传'){
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
		},
		mounted() {// 在页面挂载前就发起请求
			this.treeDrag();//调用树和表单之间拖拽改变宽度
			this.getUser();
		},
	}
</script>

<style scope>
.p15 {padding:10px 15px;}
.a-upload input{
	position: absolute;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    width: 65px;
    left: 0px;
    height: 30px;
    z-index: 999;
}
.a-upload input,.a-upload input[type="file"] { cursor: pointer; font-size:0px; font-size:20px \9;}
.upload-btn{
    color: #fff;
    background-color: #286090;
    border-radius: 4px;
    padding: 4px 10px;
    width: 85px;
    height: 34px;
    line-height: 28px;
    border: none;
}
</style>