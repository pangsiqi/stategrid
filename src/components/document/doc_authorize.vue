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
								<button v-for="item in buttons" class="btn mr5" :key="item.id" :class="item.style" @click="getbtn(item)">
									<i :class="item.icon"></i>{{item.name}}
								</button>
								<!-- <button type="button" class="btn btn-green" @click="openAddMgr" id="">
                                	<i class="icon-add"></i>添加
                      			 </button>
								<button type="button" class="btn btn-blue button-margin" @click="modify">
								    <i class="icon-edit"></i>修改
								</button>
								<button type="button" class="btn btn-red button-margin" @click="deluserinfo">
								    <i class="icon-trash"></i>删除
								</button>
								<button type="button" class="btn btn-red button-margin" @click="physicsDel">
							    <i class="icon-trash"></i>彻底删除
							</button>			
								<button type="button" class="btn btn-primarys button-margin" @click="reportdata">
							    <i class="icon-clipboard"></i>报表
							</button>
								<button type="button" class="btn btn-primarys button-margin" @click="modestsearch">
						    		<i class="icon-search"></i>高级查询
						    		<i class="icon-arrow1-down" v-show="down"></i>
						    		<i class="icon-arrow1-up" v-show="up"></i>
								</button> -->
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
									<el-input v-model="searchList.username"  @keyup.enter.native="searchinfo">
										<template slot="prepend">姓名</template>
									</el-input>
								</el-col>
								
								<!-- <el-col :span="7">
									<el-input v-model="searchList.keywordidDesc">
										<template slot="prepend">关键字</template>
										</el-input>
								</el-col> -->
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
								<el-table-column label="姓名" sortable width="140px" prop="username" v-if="this.checkedName.indexOf('姓名')!=-1">
								</el-table-column>
								<el-table-column label="关键字" sortable prop="keywordidDesc" v-if="this.checkedName.indexOf('关键字')!=-1">
								</el-table-column>
								<el-table-column label="查看" sortable prop="fileread" v-if="this.checkedName.indexOf('查看')!=-1">
									<template slot-scope="scope">
										<i :class="scope.row.fileread==1?'el-icon-check':''"></i>
									</template>
								</el-table-column>
								<el-table-column label="编辑" sortable prop="fileedit" v-if="this.checkedName.indexOf('编辑')!=-1">
									<template slot-scope="scope">
										<i :class="scope.row.fileedit==1?'el-icon-check':''"></i>
									</template>
								</el-table-column>
								<el-table-column label="删除" sortable prop="filedelete" v-if="this.checkedName.indexOf('删除')!=-1">
									<template slot-scope="scope">
										<i :class="scope.row.filedelete==1?'el-icon-check':''"></i>
									</template>
								</el-table-column>
								<!-- <el-table-column label="上传" sortable prop="fileupload" v-if="this.checkedName.indexOf('上传')!=-1">
									<template slot-scope="scope">
										<i :class="scope.row.fileupload==1?'el-icon-check':''"></i>
									</template>
								</el-table-column> -->
								<el-table-column label="下载" sortable prop="filedownload" v-if="this.checkedName.indexOf('下载')!=-1">
									<template slot-scope="scope">
										<i :class="scope.row.filedownload==1?'el-icon-check':''"></i>
									</template>
								</el-table-column>
								<el-table-column label="打印" sortable prop="fileprint" v-if="this.checkedName.indexOf('打印')!=-1">
									<template slot-scope="scope">
										<i :class="scope.row.fileprint==1?'el-icon-check':''"></i>
									</template>
								</el-table-column>
								<el-table-column label="复制" sortable prop="fileduplicate" v-if="this.checkedName.indexOf('复制')!=-1">
									<template slot-scope="scope">
										<i :class="scope.row.fileduplicate==1?'el-icon-check':''"></i>
									</template>
								</el-table-column>
							</v-table>
							<!-- 表格 -->
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<authmask ref="child" @request="requestData" :detailData="selMenu[0]"></authmask>
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
	import authmask from'../documentDetails/auth_mask.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'samples',//接样
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'authmask': authmask,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'tbKeywordPrivilege2',
				reportData:{},//报表的数据
				loading: false,
				basic_url: Config.dev_url,
				isShow: false,
				ismin: true,
				loadSign: true, //加载
				commentArr: {},
				checkedName: [
					'姓名',
					'关键字',
					'查看',
					'删除',
					// '上传',
					'下载',
					'复制',
					'编辑',
					'打印',
				],
				tableHeader: [{
						label: '姓名',
						prop: 'username'
					},
					{
						label: '关键字',
						prop: 'keywordidDesc'
					},
					{
						label: '查看',
						prop: 'fileread'
					},
					{
						label: '删除',
						prop: 'filedelete'
					},
					{
						label: '下载',
						prop: 'filedownload'
					},
					{
						label: '复制',
						prop: 'fileduplicate'
					},
					{
						label: '编辑',
						prop: 'fileedit'
					},
					{
						label: '打印',
						prop: 'fileprint'
					}
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
					keywordidDesc: '',
					username: ''
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
			}
		},
		methods: {
			setSelData(val){
				this.selMenu = val;
			},
			renderContent(h, {node,data,store}) { //自定义Element树菜单显示图标
				return (<span><i class={data.iconClass}></i><span>{node.label}</span></span>)
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
			//表格滚动加载
			loadMore () {
			   if (this.loadSign) {
			     this.loadSign = false
			     this.page.currentPage++
			     if (this.page.currentPage > Math.ceil(this.page.totalCount/this.page.pageSize)) {
			       return
			     }
			     setTimeout(() => {
			       this.loadSign = true
			     }, 1000)
			     this.requestData('init');
			   }
			 },
			tableControle(data) {//控制表格列显示隐藏
				this.checkedName = data;
			},
		   resetbtn(){
				this.searchList = { //点击高级搜索后显示的内容
					username: '',
				};
				this.requestData('init');
			},
			searchinfo() {//高级查询
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
			//添加样品管理
			openAddMgr() {
				this.$refs.child.visible();
			},
			//修改
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
			//报表
			reportdata(){
				this.reportData.app=this.productType;
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
					var url = this.basic_url + '/api-apps/app/tbKeywordPrivilege2/deletes';
					//changeMenu为勾选的数据
					var changeMenu = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeMenu.length; i++) {
						deleteid.push(changeMenu[i].id);
					}
					//ids为deleteid数组用逗号拼接的字符串
					ids = deleteid.toString(',');
                    var data = {
						ids: ids,
					}
					this.$confirm('确定删除这些数据吗？', '提示', {
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
							}else{
								this.$message({
									message: res.data.code_msg,
									type: 'success'
								});
							}
						}).catch((err) => {
						});
                    }).catch(() => {

                	});
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
				} else {
					var url = this.basic_url + '/api-apps/app/tbKeywordPrivilege2/physicsDel';
					//changeMenu为勾选的数据
					var changeMenu = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeMenu.length; i++) {
						deleteid.push(changeMenu[i].id);
					}
					//ids为deleteid数组用逗号拼接的字符串
					ids = deleteid.toString(',');
                    var data = {
						ids: ids,
					}
					this.$confirm('确定删除这些数据吗？', '提示', {
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
							}else{
								this.$message({
									message: res.data.code_msg,
									type: 'success'
								});
							}
						}).catch((err) => {
						});
                    }).catch(() => {

                	});
				}
			},
			requestData(opt) {
				this.$refs.table.requestData(opt);
			},
			//生产单位树
			getKey() {
				let that = this;
				var url = this.basic_url + '/api-user/depts/tree';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data;
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
				if(data.type == '1') {
					this.companyId = data.id;
					this.deptId = '';
				} else {
					this.deptId = data.id;
					this.companyId = '';
				}
				this.requestData();
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
		},
		mounted() {// 在页面挂载前就发起请求
			this.getKey();
		},
		
	}
</script>

<style scope>
.p15 {padding:10px 15px;}
</style>