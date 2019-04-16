<template>
	<div>
		<div class="headerbg">
			<vheader></vheader>
			<navs_tabs></navs_tabs>
		</div>
		<div class="contentbg">
			<!--左侧菜单调用 Begin-->
			<navs_left ref="navleft" v-on:childByValue="childvalue"></navs_left>
			<!--左侧菜单调用 End-->

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
												<el-checkbox :label="item.text"  name="type"></el-checkbox>
											</el-dropdown-item>
										</el-checkbox-group>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
					</div>
					<!-- 高级查询划出 -->
					<div v-show="search">
						<el-form inline-message :model="searchDept" label-width="70px">
							<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="机构名称" prop="fullname" label-width="70px">
										<el-input v-model="searchDept.fullname">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
									<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px;margin-left: 2px">重置</el-button>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<!-- 高级查询划出 -->
					<el-row :gutter="10">
						<el-col :span="24">
							<tree_grid :columns="columns" :loading="loading" :tree-structure="true" :data-source="deptList" v-on:classByValue="childByValue" @getDetail="getDetail"></tree_grid>
							<!-- <el-pagination background class="text-right pt10" v-if="this.checkedName.length>0"
							   @size-change="sizeChange" 
							   @current-change="currentChange" 
							   :current-page="page.currentPage" 
							   :page-sizes="[10, 20, 30, 40]"
					           :page-size="page.pageSize" 
					           layout="total, sizes, prev, pager, next"
					           :total="page.totalCount">
							</el-pagination> -->
						</el-col>
					</el-row>
					</div>
				</div>
			<!--右侧内容显示 End-->
			<deptmask :adddeptForm="adddeptForm" ref="child" @request="requestData" @reset="reset" @requestTree="getKey" v-bind:page=page></deptmask>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import tree_grid from '../common/TreeGrid.vue'//树表格
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import deptmask from '../settingDetails/dept_mask.vue'

	export default {
		name: 'dept_management',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
			'deptmask': deptmask,
			'tree_grid':tree_grid,
		},
		data() {
			return {
				loading: false,
				basic_url: Config.dev_url,
				checkedName: [
					// '序号',
					'机构名称',
					'机构编号',
					'上级机构',
					'机构类型',
					'负责人',
					'版本',
					'备注',
				],
				columns: [
					// {
					// 	text: '序号',
					// 	dataIndex: 'step',
					// 	isShow:true,
					// },
					{
						text: '机构名称',
						dataIndex: 'fullname',
						width:'240',
						isShow:true,
					},
					{
						text: '机构编号',
						dataIndex: 'id',
						isShow:true,
					},
					{
						text: '上级机构',
						dataIndex: 'pName',
						isShow:true,
					},
					{
						text: '机构类型',
						dataIndex: 'depttypeName',
						isShow:true,
					},
					{
						text: '机构属性',
						dataIndex: 'typeName',
						isShow:true,
					},
					{
						text: '负责人',
						dataIndex: 'leaderName',
						isShow:true,
					},
					{
						text: '版本',
						dataIndex: 'version',
						isShow:true,
					},
					{
						text: '备注',
						dataIndex: 'tips',
						isShow:true,
					},
				],

				companyId: '',
				deptId: '',
				selDept: [],
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				total:0,
				deptList: [],
				selMenu:[],
				search: false,
				show: false,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchDept: {//高级查询
					simplename:'',
					fullname:''
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				treeData: [],
				selData: [],
				adddeptForm: {},//修改子组件时传递数据
				buttons:[],//按钮
			}
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			//清空
			reset(){
				this.adddeptForm = {
						"version":'1',
						"status":'活动',
						"step":'',
						"id":'',
						"fullname":'',
						"org_range":'2',
						"type":'',
						"inactive":'否',
						"address":'',
						"zipcode":'',
						"leader":'',
						"telephone":'',
						"fax":'',
						"email":'',
						"tips":'',
						"pid":'',
						"enterby":'',
						"enterdate":'',
						"changeby":'',
						"changedate":'',
						"depttype":'1',
					};
			},
			//请求页面的button接口
		    getbutton(childvalue){
		    	var data = {
					menuId: childvalue.id,
					roleId: this.$store.state.roleid,
				};
				var url = this.basic_url + '/api-user/permissions/getPermissionByRoleIdAndSecondMenu';
				this.$axios.get(url, {params: data}).then((res) => {
					// 
					this.buttons = res.data;
					
				}).catch((wrong) => {})

		    },
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
			//表格传过来
			childByValue: function (childByValue) {
		        // childValue就是子组件传过来的
		        this.selMenu = childByValue
		    },
			//左侧菜单传来
		    childvalue:function ( childvalue) {
		    	 this.getbutton( childvalue);
			},
			getDetail(data){
				this.view(data);
			},
			//查看
			view(data) {
			 	this.adddeptForm = data;
				this.$refs.child.view();
			},
			tableControle(data){//控制表格列显示隐藏
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
			currentTree(val){
			},
			//分页功能
			aTable(val){ 
				this.page = val; 
				this.requestData();
			}, 
			searchinfo() {//高级查询
				var data = {
					params: {
						fullname: this.searchDept.fullname
					}
				};
				var url = this.basic_url + '/api-user/depts/treeMap';
				this.$axios.get(url, data).then((res) => {
					let result=res.data
					for(let i=0;i<result.length;i++){
						if(typeof(result[i].subDepts)!="undefined"&&result[i].subDepts.length>0){
							let subDepts=result[i].subDepts;
							result[i].children=subDepts;
						}	
					}
					this.deptList = result;
					this.loading = false;
				}).catch((wrong) => {
					this.$message({
							message: wrong.resp_msg,
							type: 'warning'
						});
				})
			},
			resetbtn(){
				this.searchDept = {//高级查询
					simplename:'',
					fullname:''
				};
				this.requestData();
			},
			 //请求点击
		    getbtn(item){
		    	if(item.name=="添加"){
		         this.openAddMgr();
		    	}else if(item.name=="修改"){
		    	 this.modify();
		    	}else if(item.name=="高级查询"){
		    	 this.modestsearch();
		    	}else if(item.name=="删除"){
				 this.deluserinfo();
				}else if(item.name=="彻底删除"){
				 this.physicsDel();
				}
		    },
			//添加
			openAddMgr() {
				this.reset();
				this.$refs.child.visible();
			},
			//修改
			modify() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要修改的机构',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时修改多个机构',
						type: 'warning'
					});
					return;
				} else {
					this.adddeptForm = this.selMenu[0]; 
					this.$refs.child.detail();
				}
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
						message: '请您选择要删除的机构',
						type: 'warning'
					});
					return;
				} else {
					var changeMenu = selData[0];
					if(changeMenu.children!=null && typeof(changeMenu.children)!='undefined' && changeMenu.children.length>0){
						this.$message({
							message: '先删除子机构',
							type: 'error'
						});
					}else {
						var url = this.basic_url + '/api-user/depts/deletes';
						//changeMenu为勾选的数据
	//					var changeMenu = selData[0];
						//deleteid为id的数组
						var deleteid = [];
						var ids;
						for(var i = 0; i < selData.length; i++) {
							deleteid.push(selData[i].id);
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
				}
			},
			// 彻底删除
			physicsDel() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的机构',
						type: 'warning'
					});
					return;
				} else {
					var changeMenu = selData[0];
					if(changeMenu.children!=null && typeof(changeMenu.children)!='undefined' && changeMenu.children.length>0){
						this.$message({
							message: '先删除子机构',
							type: 'error'
						});
					}else {
						var url = this.basic_url + '/api-user/depts/physicsDel';
						//changeMenu为勾选的数据
	//					var changeMenu = selData[0];
						//deleteid为id的数组
						var deleteid = [];
						var ids;
						for(var i = 0; i < selData.length; i++) {
							deleteid.push(selData[i].id);
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
				this.selDept = val;
			},

			requestData() {//高级查询字段
				this.loading = true;
				var url = this.basic_url + '/api-user/depts/treeMap';
				this.$axios.get(url, {}).then((res) => {
					let result=res.data
					for(let i=0;i<result.length;i++){
						if(typeof(result[i].subDepts)!="undefined"&&result[i].subDepts.length>0){
							let subDepts=result[i].subDepts;
							result[i].children=subDepts;
						}	
					}
					this.deptList = result;
					this.loading = false;
//					this.page.totalCount = res.data.count;
				}).catch((wrong) => {})
			},
			//机构树
			getKey() {
				let that = this;
				var url = this.basic_url + '/api-user/depts/tree';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data;
					this.treeData = this.transformTree(this.resourceData);
				});
			},
			transformTree(data){//给树菜单添加图标
				for(var i=0; i<data.length; i++){
					data[i].name = data[i].fullname;
					if(!data[i].pid || $.isArray(data[i].subDepts)){
						data[i].iconClass = 'icon-file-normal';
					}else{
						data[i].iconClass = 'icon-file-text';
					}
					if($.isArray(data[i].subDepts)){
						data[i].children = this.transformTree(data[i].subDepts);
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
			},
			formatter(row, column) {
				return row.enabled;
			}
		},
		mounted() {
			this.requestData();
			this.getKey();
		}
	}
</script>

<style scoped>
	
</style>