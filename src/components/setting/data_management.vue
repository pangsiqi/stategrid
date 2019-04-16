<template>
	<div>
		<div class="headerbg">
			<vheader></vheader>
			<navs_tabs></navs_tabs>
		</div>
		<div class="contentbg">
			<navs_left ref="navleft" v-on:childByValue="childvalue"></navs_left>
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
							<tableControle :tableHeader="tableHeader" :checkedName="checkedName"  @tableControle="tableControle" ref="tableControle"></tableControle>
						</div>
					</div>
					<!-- 高级查询划出begin -->
					<div v-show="search">
						<el-form inline-message :model="searchList" label-width="45px">
							<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="表名">
										<el-input v-model="searchList.name" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="描述">
										<el-input v-model="searchList.description" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
									<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px;margin-left: 2px">重置</el-button>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<!-- 高级查询划出end -->
					<el-row :gutter="0">
						<el-col :span="24">
							<!-- 表格begin-->
							<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="表名" sortable width="320" prop="name" v-if="this.checkedName.indexOf('表名')!=-1">
								</el-table-column>
								<el-table-column label="描述" sortable prop="description" v-if="this.checkedName.indexOf('描述')!=-1">
								</el-table-column>
							</v-table>
							<!-- 表格end -->
						</el-col>
					</el-row>
				</div>
			</div>
			<datamask ref="child" @request="requestData" @requestTree="getKey" v-bind:page=page></datamask>
			<relamask ref="rela" @request="requestData" v-bind:page=page></relamask>
		</div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import datamask from '../settingDetails/data_mask.vue'
	import relamask from '../settingDetails/rela_mask.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'data_management',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
			'datamask': datamask,
			'relamask': relamask,
			'tableControle':tableControle,
			'v-table':vTable
		},
		data() {
			return {
				appName: 'objectcfg',
				basic_url: Config.dev_url,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				selUser: [],
				search: false,
				show: false,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					name:'',
					description:''
				},
				checkedName: [
					'表名',
					'描述'
				],
				tableHeader: [
					{
						label: '表名',
						prop: 'name'
					},
					{
						label: '描述',
						prop: 'description'
					}
				],
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
				dataList:[],
				buttons:[],
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
					name:'',
					description:''
				};
				this.requestData('init');
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
		    		this.deldata();
		    	}else if(item.name=="彻底删除"){
		    		this.physicsDel();
		    	}else if(item.name=="配置关系"){
		    		this.setrelation();
		    	}else if(item.name=="生成表"){
					this.createtable();
				}
		    },
			//配置关系
			setrelation(){
				this.$refs.rela.visible();
			},
			//添加数据
			openAddMgr() {
				this.$refs.child.resetNew();
				this.$refs.child.visible();
			},
			//修改数据
			modify() {
				var selData = this.selUser;
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
					this.$refs.child.detail(selData[0].id);
				}
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
			},
			// 删除数据
			deldata() {
				var selData = this.selUser;
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
					var changeUser = selData[0];
					var id = changeUser.id;
					var url = this.basic_url + '/apps-center/objectcfg/' + id;
					this.$axios.delete(url, {}).then((res) => {//.delete 传数据方法
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
				}
			},
			//生成表
			createtable() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要生成表的数据',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时将多个数据生成表',
						type: 'warning'
					});
					return;
				} else {
					var changeUser = selData[0];
					var id = changeUser.id;
					var url = this.basic_url + '/apps-center/objectcfg/create/' + id;
					this.$axios.get(url, {}).then((res) => {
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '生成表成功',
								type: 'success'
							});
							this.requestData();
						}
					}).catch((err) => {
					});
				}
			},
			insert() {
				this.users.push(this.user)
			},
			remove(index) {
				this.users.splice(index, 1)
			},
			
			//Table默认加载数据
			requestData(opt) {
				this.$refs.table.requestData(opt);
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
			transformTree(data){
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
			},
			handleNodeClick(data) {
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
			this.getKey();
		},
	}
</script>