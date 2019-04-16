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
								<!-- <button type="button" class="btn btn-green" @click="openAddMgr">
                                	<i class="icon-add"></i>添加
                      			 </button>
								<button type="button" class="btn btn-blue button-margin" @click="modify">
								    <i class="icon-edit"></i>修改
								</button>
								<button type="button" class="btn btn-red button-margin" @click="del">
								    <i class="icon-trash"></i>删除
								</button>
									<button type="button" class="btn btn-red button-margin" @click="physicsDel">
							    <i class="icon-trash"></i>彻底删除
							</button>			 
							 <button type="button" class="btn btn-primarys button-margin" @click="importData">
								    <i class="icon-upload-cloud"></i>导入
								</button>
								<button type="button" class="btn btn-primarys button-margin" @click="exportData">
								    <i class="icon-download-cloud"></i>导出
								</button>
								<button type="button" class="btn btn-primarys button-margin" @click="Printing">
								    <i class="icon-print"></i>打印
								</button>
							<button type="button" class="btn btn-primarys button-margin" @click="reportdata">
							    <i class="icon-clipboard"></i>报表
							</button>
								<button type="button" class="btn btn-primarys button-margin" @click="modestsearch">
						    		<i class="icon-search"></i>高级查询
						    		<i class="icon-arrow1-down" v-show="down"></i>
						    		<i class="icon-arrow1-up" v-show="up"></i>
								</button>
								 -->
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
									<el-input v-model="searchList.categoryidDesc" @keyup.enter.native="searchinfo">
										<template slot="prepend">类别</template>
									</el-input>
								</el-col>
								<el-col :span="7">
									<el-input v-model="searchList.keywordname" @keyup.enter.native="searchinfo">
										<template slot="prepend">关键字</template>
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

					<el-row :gutter="0">
						<el-col :span="24">
							<!-- 表格 -->
							<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="类别" sortable prop="categoryidDesc" v-if="checkedName.indexOf('类别')!=-1">
								</el-table-column>
								<el-table-column label="关键字" sortable prop="keywordname" v-if="checkedName.indexOf('关键字')!=-1">
								</el-table-column>
								<el-table-column label="用户名称" sortable prop="username" v-if="checkedName.indexOf('用户名称')!=-1">
								</el-table-column>
								<el-table-column label="用户部门" sortable prop="deptfullname" v-if="checkedName.indexOf('用户部门')!=-1">
								</el-table-column>
								<el-table-column label="录入时间" sortable prop="createtime" v-if="checkedName.indexOf('录入时间')!=-1">
								</el-table-column>
							</v-table>
						</el-col>
					</el-row>
				</div>
			</div>
		<catmask ref="child" @request="requestData" :detailData="selMenu[0]"></catmask>
		<!--报表-->
		<reportmask :reportData="reportData" ref="reportChild"></reportmask>
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
	import catmask from'../documentDetails/cat_mask.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'samples',//接样
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'catmask': catmask,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'tbKeyword2',
				reportData:{},//报表的数据
				basic_url: Config.dev_url,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				fileList:[],
				ismin: true,
				//选择显示数据
				checkedName: [
					'关键字',
					'类别',
					'用户名称',
					'用户部门',
					'录入时间',
				],
				tableHeader: [{
						label: '关键字',
						prop: 'keywordname'
					},
					{
						label: '类别',
						prop: 'categoryidDesc'
					},
					{
						label: '用户名称',
						prop: 'username'
					},
					{
						label: '用户部门',
						prop: 'deptfullname'
					},
					{
						label: '录入时间',
						prop: 'createtime'
					}
				],
				samplesList: [],
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				search: false,
				show: false,
				down: true,
				up: false,
				searchList: {
					'categoryidDesc': '',
					'keywordname': ''
				},
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				samplesForm: {}, //修改子组件时传递数据
				// 选中的数据
				selMenu: [],
				buttons:[],
				tbKeyword2:'tbKeyword2'//appname
			}
		},
		methods: {
			setSelData(val){
				this.selMenu = val;
			},
			fileSuccess(){//上传成功后返回数据
				this.requestData('init');
			},
			handleSuccess(response, file, fileList){//上传文件列表
			},
			tableControle(data) {//控制表格列显示隐藏
				this.checkedName = data;
			},
			
			resetbtn(){
				this.searchList = { //点击高级搜索后显示的内容
					keywordname: '',
					categoryidDesc: '',
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
		    	 this.del();
		    	}else if(item.name=="报表"){
			     this.reportdata();
				}else if(item.name=="打印"){
				   this.Printing();
				}
		    },
			//报表
			reportdata(){
				this.reportData.app=this.tbKeyword2;
				this.$refs.reportChild.visible();
			},
			
			searchinfo() {
				this.requestData('init');
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
					this.$refs.child.detail();
				}
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
				this.down = !this.down,
					this.up = !this.up
			},
			getKeyWords(catId){
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					categoryid: catId ,
				}
				var url = this.basic_url + '/api-apps/app/tbKeyword2';
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					return res.data.count;
				}).catch((wrong) => {})
			},
			// 删除
			del() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				}else if(selData.length > 1){
					this.$message({
						message: '不可同时删除多条数据',
						type: 'error'
					});
					return;
				}else {
					var sonLength = this.getKeyWords(selData[0].id);
					if(sonLength>0){
						this.$message({
							message: '请先删除此类别下的关键字后再删除此数据',
							type: 'error'
						});
						return;
					}
					var url = this.basic_url + '/api-apps/app/tbKeyword2/deletes';
					var changeMenu = selData;
					var deleteid = [];
					for (var i = 0; i < changeMenu.length; i++) {
						deleteid.push(changeMenu[i].id);
					}
                    var data = {
						ids: deleteid.toString(',')
					}
					this.$confirm('确定删除数据吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        this.$axios.delete(url, {params: data}).then((res) => {//.delete 传数据方法
							if(res.data.resp_code == 0) {
								this.$message({
									message: '删除成功',
									type: 'success'
								});
								this.requestData();
							}
						}).catch((err) => {
						});
                    }).catch(() => {});
				}
			},
			// 彻底删除
			physicsDel() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				}else if(selData.length > 1){
					this.$message({
						message: '不可同时删除多条数据',
						type: 'error'
					});
					return;
				}else {
					var sonLength = this.getKeyWords(selData[0].id);
					if(sonLength>0){
						this.$message({
							message: '请先删除此类别下的关键字后再删除此数据',
							type: 'error'
						});
						return;
					}
					var url = this.basic_url + '/api-apps/app/tbKeyword2/physicsDel';
					var changeMenu = selData;
					var deleteid = [];
					for (var i = 0; i < changeMenu.length; i++) {
						deleteid.push(changeMenu[i].id);
					}
                    var data = {
						ids: deleteid.toString(',')
					}
					this.$confirm('确定删除数据吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        this.$axios.delete(url, {params: data}).then((res) => {//.delete 传数据方法
							if(res.data.resp_code == 0) {
								this.$message({
									message: '删除成功',
									type: 'success'
								});
								this.requestData();
							}
						}).catch((err) => {
						});
                    }).catch(() => {});
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
           		var url = this.basic_url + '/api-apps/app/tbKeyword2/exportExc?access_token='+sessionStorage.getItem('access_token');
          		 var xhr = new XMLHttpRequest();
            	xhr.open('POST', url, true);
            	xhr.responseType = "blob";
            	xhr.setRequestHeader("client_type", "DESKTOP_WEB");
            	xhr.onload = function() {
                	if (this.status == 200) {
						var filename = "tbKeyword2.xls";
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
			//Table默认加载数据
			requestData(opt){
				this.$refs.table.requestData(opt);
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
			childByValue(childValue) {
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
					this.buttons = res.data;
				}).catch((wrong) => {
				})
		    },
		},
	}
</script>

<style scope>
.p15 {padding:10px 15px;}
</style>