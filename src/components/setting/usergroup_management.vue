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
						<tableControle :tableHeader="tableHeader" :checkedName="checkedName" @tableControle="tableControle" ref="tableControle"></tableControle>
					</div>
					</div>
					<!-- 高级查询划出 -->
					<div v-show="search">
						<el-form inline-message :model="searchList" label-width="70px">
							<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="组名" prop="name" label-width="70px">
										<el-input v-model="searchList.name" @keyup.enter.native="searchinfo"></el-input>
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
							<v-table ref="vtable" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="编号" width="250" sortable prop="num" v-if="this.checkedName.indexOf('编号')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.num}}</p>
									</template>
								</el-table-column>

								<el-table-column label="组名" sortable prop="name" v-if="this.checkedName.indexOf('组名')!=-1">
								</el-table-column>

								<el-table-column label="所属机构" align="center" sortable prop="deptName" v-if="this.checkedName.indexOf('所属机构')!=-1">
								</el-table-column>
							</v-table>
						</el-col>
					</el-row>
					</div>
				</div>
			<!--右侧内容显示 End-->
		</div>
		<usergroupmask ref="usergroupmask" :detailData="detailData" @request="requestData" @reset="reset"></usergroupmask>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import usergroup_mask from '../settingDetails/usergroup_mask.vue'
	import vTable from '../plugin/table/table.vue'

	export default {
		name: 'dept_management',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
			'v-table': vTable,
			'tableControle': tableControle,
			'usergroupmask': usergroup_mask
		},
		data() {
			return {
				loading: false,
				basic_url: Config.dev_url,
				checkedName: [
					'编号',
					'组名',
					'所属机构',
				],
				appName: 'group',
				tableHeader: [
					{
						label: '编号',
						prop: 'num',
					},
					{
						label: '组名',
						prop: 'name',
					},
					{
						label: '所属机构',
						prop: 'deptid',
					},
				],
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				selUser:[],
				search: false,
				show: false,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: { //点击高级搜索后显示的内容
					name: '',
					deptid:'',
					deptName:'',
				},
				detailData: {},//修改子组件时传递数据
				buttons:[],//按钮
			}
		},
		methods: {
			setSelData(val){
				this.selUser = val;
			},
			//清空
			reset(){
				this.detailData = {
						"id":'',
						"name":'',
						"num":'',
						"deptid":this.$store.state.currentcjdw[0].id,
						"deptName":this.$store.state.currentcjdw[0].fullname,
						"createby":'',
						"createdate":'',
						"updateby":'',
						"updatedate":'',
						"del_flag":'',
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
			//左侧菜单传来
		    childvalue:function ( childvalue) {
		    	 this.getbutton( childvalue);
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
			searchinfo(index) {//高级查询
				this.requestData('init');
			},
			resetbtn(){
				this.searchList = {//高级查询
					name:'',
					num:'',
					deptName:'',
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
				 		this.deluserinfo();
					}else if(item.name=="彻底删除"){
				 		this.physicsDel();
					}
		    },
			//添加
			openAddMgr() {
				this.reset();
				this.$refs.usergroupmask.open(); // 方法1
				this.$refs.usergroupmask.visible();
			},
			//修改
			modify() {
				if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要修改的机构',
						type: 'warning'
					});
					return;
				} else if(this.selUser.length > 1) {
					this.$message({
						message: '不可同时修改多个机构',
						type: 'warning'
					});
					return;
				} else {
					this.detailData = this.selUser[0];
					this.$refs.usergroupmask.detail(this.selUser[0]);
				}
			},
			//查看用戶
			view(data) {
				this.detailData = data;
				this.$refs.usergroupmask.view(this.detailData);
			},
		
			//高级查询
			modestsearch() {
				this.search = !this.search;
			},
			// 删除
			deluserinfo() {
				var selData = this.selUser;
				console.log(selData);
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-user/groups/deletes';
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
			// 彻底删除
			physicsDel() {
				var selData = this.selUser;
				console.log(selData);
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				}  else {
					var url = this.basic_url + '/api-user/groups/physicsDel';
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
			requestData(opt) {//高级查询字段
				this.$refs.vtable.requestData(opt);
			},
		},
		mounted() {
			this.requestData();
		}
	}
</script>