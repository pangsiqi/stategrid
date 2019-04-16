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
					<!--按钮操作行 Begin-->
					<div class="fixed-table-toolbar clearfix">
						<div class="bs-bars pull-left">
							<div class="hidden-xs" id="roleTableToolbar" role="group">
							<button type="button" class="btn btn-green" @click="openAddMgr" id="">
	                        	<i class="icon-add"></i>添加
	              			</button>
							<button type="button" class="btn btn-blue button-margin" @click="modify">
							    <i class="icon-edit"></i>修改
							</button>
							<button type="button" class="btn btn-purple button-margin" @click="deluserinfo">
							    <i class="icon-trash"></i>删除
							</button>
							<!-- <button type="button" class="btn btn-red button-margin" @click="physicsDel">
							    <i class="icon-trash1"></i>彻底删除
							</button> -->
							<button type="button" class="btn btn-primarys button-margin" @click="modestsearch">
					    		<i class="icon-search"></i>高级查询
					    		<!-- <i class="icon-arrow1-down" v-show="down"></i>
					    		<i class="icon-arrow1-up" v-show="up"></i> -->
							</button>
							</div>
						</div>
						<div class="columns columns-right btn-group pull-right">
							<div id="refresh" title="刷新" class="btn btn-default btn-refresh">
								<i class="icon-refresh"></i>
							</div>
							<tableControle :tableHeader="tableHeader" :checkedName="checkedName" @tableControle="tableControle" ref="tableControle"></tableControle>
						</div>
					</div>
					<!--按钮操作行 End-->

					<!-- 高级查询划出 Begin-->
					<div v-show="search">
						<el-form inline-message :model="searchList" label-width="95px">
							<el-row :gutter="10">
								<el-col :span="6">
									<el-form-item label="按钮名称" prop="name">
										<el-input v-model="searchList.name" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="所属菜单" prop="menuIdDesc">
										<el-select v-model="searchList.menuIdDesc" filterable style="width: 100%">
											<el-option v-for="item in selectDataMenu" :key="item.id" :value="item.id" :label="item.name" :class="item.name"></el-option>
										</el-select>
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
					<el-row :gutter="0">
						<el-col :span="24">
							<!-- 表格 Begin-->
							<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="按钮名称" width="160" sortable prop="name" v-if="this.checkedName.indexOf('按钮名称')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.name}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="所属菜单" width="180" sortable prop="menuIdDesc" v-if="this.checkedName.indexOf('所属菜单')!=-1" align="center">
								</el-table-column>
								<el-table-column label="按钮图标" width="125" align="center" sortable prop="icon" v-if="this.checkedName.indexOf('按钮图标')!=-1">
									<template slot-scope="scope">
										<i :class="scope.row.icon"></i> <!-- {{scope.row.icon}} -->
									</template>
								</el-table-column>
								<el-table-column label="按钮颜色" sortable prop="style" v-if="this.checkedName.indexOf('按钮颜色')!=-1">
									<template slot-scope="scope">
										<button type="button" :class="'btn '+ scope.row.style">{{scope.row.style}}</button>
									</template>
								</el-table-column>
								<el-table-column label="排序" width="100" sortable prop="sort" v-if="this.checkedName.indexOf('排序')!=-1">
								</el-table-column>
								<el-table-column label="录入时间" width="160" prop="createTime" sortable :formatter="dateFormat" v-if="this.checkedName.indexOf('录入时间')!=-1">
								</el-table-column>
								<el-table-column label="修改时间" width="160" prop="updateTime" sortable :formatter="dateFormat" v-if="this.checkedName.indexOf('修改时间')!=-1">
								</el-table-column>
							</v-table>
							<!-- 表格 End-->
						</el-col>
					</el-row>
				</div>
			</div>
			<!--右侧内容显示 End-->
			<btnconfigmask :CATEGORY="CATEGORY" ref="btnconfigmask" @request="requestData" @reset="reset" v-bind:page=page></btnconfigmask>
			<!--报表-->
			<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
		</div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import btnconfigmask from '../settingDetails/buttonconfigure_mask.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'button_configure',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'tableControle': tableControle,
			'btnconfigmask': btnconfigmask,
			'reportmask': reportmask,
			'v-table': vTable
		},
		data() {
			return {
				appName:'apppermissions',
				reportData:{},//报表的数据
				scroll_old:0,
				selectDataMenu: [],
				// up2down:'down',
				reportData:{},//报表的数据
				basic_url: Config.dev_url,
				commentArr: {},
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				fileList:[],
				value: '',
				permissions:'permissions',//appname
				checkedName: [
					'按钮名称',
					'所属菜单',
					'按钮图标',
					'按钮颜色',
					'排序',
					'录入时间',
					'修改时间'
				],
				tableHeader: [{
						label: '按钮名称',
						prop: 'name'
					},{
						label: '所属菜单',
						prop: 'menuIdDesc'
					},
					
					{
						label: '按钮图标',
						prop: 'icon'
					},
					{
						label: '按钮颜色',
						prop: 'style'
					},
					{
						label: '排序',
						prop: 'sort'
					},
					{
						label: '录入时间',
						prop: 'createTime'
					},
					{
						label: '修改时间',
						prop: 'updateTime'
					}
				],
				selUser: [],
				categoryList: [],
				search: false,
				show: false,
				isShow: false,
				ismin: true,
				fullHeight: document.documentElement.clientHeight - 210 + 'px', //获取浏览器高度
				searchList: { //点击高级搜索后显示的内容
					name: '',
					menuIdDesc:''
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					btnconfigmaskren: "subDepts",
					label: "simplename"
				},
				page: { //分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				CATEGORY: {},//修改子组件时传递数据
			}
		},
		methods: {
			setSelData(val){
				this.selUser = val;
			},
			tableControle(data) {
				this.checkedName = data;
			},
			//所属菜单
			getMenuId(){
				var url = this.basic_url + '/api-user/menus/findAllMenu';
				this.$axios.get(url, {}).then((res) => {
					// 
					this.selectDataMenu = res.data;
				}).catch((wrong) => {
				})	
			},
			//重置
			resetbtn(){
				this.searchList = {
					name:'',
					menuIdDesc:'',
				};
				this.requestData('init');
			},
			//搜索
			searchinfo() {
				this.requestData('init');
			},
			//清空
			reset() {
				this.CATEGORY = {
					id: '',
					name: '',//按钮名称
					// menuIdDesc: '',//所属菜单
					menuId: '',//所属菜单
					icon: '',//图标
					style: '',//按钮颜色
					sort: '',//排序
					deptid: '',//部门ID
					permission: '',//按钮事件名称
					creatUser: '',//录入人
					createTime: '',//录入时间
					updateUser: '',//修改人
					updateTime: '',//修改时间
				};
				if(this.$refs['CATEGORY'] !== undefined) {
					this.$refs['CATEGORY'].resetFields();
				}
			},
			//添加按钮配置
			openAddMgr() {
				this.reset();
				this.$refs.btnconfigmask.open(); // 方法1
				this.$refs.btnconfigmask.visible();
			},
			//修改按钮配置
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
					console.log(this.selUser[0]);
					this.CATEGORY = this.selUser[0];
					this.$refs.btnconfigmask.detail();
				}
			},
			//查看
			view(data) {
			 	this.CATEGORY =data;
				this.$refs.btnconfigmask.view();
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
					var url = this.basic_url + '/api-user/permissions/deletes';
					//changeUser为勾选的数据
					var changeUser = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for(var i = 0; i < changeUser.length; i++) {
						deleteid.push(changeUser[i].id);
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
			//彻底删除
			physicsDel(){
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-user/permissions/physicsDel';
					//changeUser为勾选的数据
					var changeUser = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for(var i = 0; i < changeUser.length; i++) {
						deleteid.push(changeUser[i].id);
					}
					//ids为deleteid数组用逗号拼接的字符串
					ids = deleteid.toString(',');
					var data = {
						ids: ids,
					}
					console.log(data);
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
			handleSuccess(response, file, fileList){
				console.log(response);
				console.log(file);
				console.log(fileList);
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
			childByValue:function(childValue) {
        		// childValue就是子组件传过来的值
        		this.$refs.navsTabs.showClick(childValue);
      		}
		},
		mounted() {
			this.getMenuId();
		}
	}
</script>

<style scoped>

</style>