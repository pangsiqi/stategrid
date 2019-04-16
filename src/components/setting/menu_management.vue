<template>
	<div>
		<div class="headerbg">
			<vheader></vheader>
			<navs_tabs></navs_tabs>
		</div>
		<div class="contentbg">
			<!--左侧菜单内容显示 Begin-->
			<navs_left ref="navleft" v-on:childByValue="childvalue"></navs_left>
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
										<el-checkbox-group v-model="checkedName" @change="changeCheckedName">
											<el-dropdown-item  v-for="(item,index) in columns" :key="index">
												<el-checkbox :label="item.text" name="type"></el-checkbox>
											</el-dropdown-item>
										</el-checkbox-group>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
					</div>
					<el-row :gutter="10">
						<el-col :span="24">
							<tree_grid :columns="columns" :loading="loading" :tree-structure="true" :data-source="menuList" v-on:classByValue="childByValue" @getDetail="getDetail"></tree_grid>
							<!-- <el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
							</el-pagination> -->
						</el-col>
					</el-row>
				</div>
			</div>
			<!--右侧内容显示 End-->
			<menumask :menu="menu" ref="child" @request="requestData" v-bind:page=page></menumask>
		</div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import tree_grid from '../common/TreeGrid.vue'//树表格
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import assetsTree from '../plugin/vue-tree/tree.vue'
	import menumask from '../settingDetails/menu_mask.vue'//弹出框
	export default {
		name: 'menu_management',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
			'menumask': menumask,
			'v-assetsTree': assetsTree,
			'tree_grid':tree_grid,
		},
		data() {
			return {
			loading: false,
			basic_url: Config.dev_url,
		    checkedName: [
					'菜单名称',
					'菜单url',
					'样式',
					'排序',
					'类型'
				],
			columns: [{
	            text: '菜单名称',
	            dataIndex: 'name',
	            isShow:true,
	          },
	          {
	            text: '菜单url',
	            dataIndex: 'url',
	            isShow:true,
	          },
	          {
	            text: '样式',
	            dataIndex: 'css',
	            isShow:true,
	          },
	          {
	          	text: '排序',
	          	dataIndex: 'sort',
	          	isShow:true,
	          },
	          {
	            text: '类型',
	            dataIndex: 'isMenu',
	            isShow:true,
	          },
	        ],
				selMenu: [],
				menuList: [],
				//deptTree: [], //树
				search: false,
				show: false,
				down: true,
				up: false,
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				treeData: [],
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				menu: {},//修改子组件时传递数据
				buttons:[],
			}
		},
		methods: {
			changeCheckedName(value){
				
				this.checkedName=value
				let str=value.toString()
				for(let i=0;i<this.columns.length;i++){
					if(str.indexOf(this.columns[i].text) != -1){
						this.columns[i].isShow=true
					}else{
						this.columns[i].isShow=false
					}
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
			//请求点击
		    getbtn(item){
		    	if(item.name=="添加"){
		        this.openAddMenu();
		    	}else if(item.name=="修改"){
		    	 this.modify();
		    	}else if(item.name=="高级查询"){
		    	 this.modestsearch();
		    	}else if(item.name=="删除"){
				 		this.delmenu();
					}else if(item.name=="彻底删除"){
						this.physicsDel();
					}
		    },
			//添加菜单
			openAddMenu() {
				this.menu = {
					parentId:'',
					name:'',
					url:'',
					sort:'',
					hidden:1,
					css:''
				};
				this.$refs.child.visible();
			},
			//修改
			modify() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要修改的数据',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时修改多个数据',
						type: 'warning'
					});
					return;
				} else {
					this.selMenu[0].canauthorization=this.selMenu[0].canauthorization.toString();
					this.menu = this.selMenu[0]; 
					this.$refs.child.detail(this.selMenu[0]);
				}
			},
			//彻底删除
			physicsDel() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时删除多个数据',
						type: 'warning'
					});
					return;
				} else {
					var changeMenu = selData[0];
					if(changeMenu.children == null){
						var id = changeMenu.id;
						var url = this.basic_url + '/api-user/menus/physicsDel/' + id;
						this.$confirm('确定删除此数据吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
						}).then(({
							value
						}) => {
							this.$axios.delete(url, {}).then((res) => { //.delete 传数据方法
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
					}else if(typeof(changeMenu.children)!='undefined' && changeMenu.children.length>0){
						this.$message({
							message: '先删除子菜单',
							type: 'error'
						});
					}
					else {
						// return;
					}
				}
			},
			getDetail(data){
				this.view(data);
			},
			//查看
			view(data) {
			 	this.menu = data;
				this.$refs.child.view();
			},
			// 删除
			delmenu() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时删除多个数据',
						type: 'warning'
					});
					return;
				} else {
					var changeMenu = selData[0];
					if(changeMenu.children == null){
						var id = changeMenu.id;
						var url = this.basic_url + '/api-user/menus/' + id;
						this.$confirm('确定删除此数据吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
						}).then(({
							value
						}) => {
							this.$axios.delete(url, {}).then((res) => { //.delete 传数据方法
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
					}else if(typeof(changeMenu.children)!='undefined' && changeMenu.children.length>0){
						this.$message({
							message: '先删除子菜单',
							type: 'error'
						});
					}
					else {
						// return;
					}
				}
			},

			SelChange(val) {
				
				this.selMenu = val;
			},
			requestData(index) {
				this.loading = true;
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				}
				var url = this.basic_url + '/api-user/menus/findTreeAlls';
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					this.loading = false;
					let result=res.data
					this.menuList = result;
					this.page.totalCount = res.data.count;
				}).catch((wrong) => {
					
				})
			},

			handleNodeClick(data) {},
			//子表格传过来的值
			childByValue: function (childValue) {
		        // childValue就是子组件传过来的
		        this.selMenu = childValue
		    },
			//左侧菜单传来
		    childvalue:function ( childvalue) {
		    	 this.getbutton( childvalue);
		    },
			//请求页面的button接口
		    getbutton(childvalue){
		    	var data = {
					menuId: childvalue.id,
					roleId: this.$store.state.roleid,
				};
				var url = this.basic_url + '/api-user/permissions/getPermissionByRoleIdAndSecondMenu';
				this.$axios.get(url, {params: data}).then((res) => {
					
					this.buttons = res.data;
					
				}).catch((wrong) => {})

		    },
		},
		mounted() {
			this.requestData();
//			this.getKey();
		},
	}
</script>

<style scoped>

</style>