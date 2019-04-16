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
							<button v-for="item in buttons" class="btn mr5" :class="item.style" @click="getbtn(item)">
									<i :class="item.icon"></i>{{item.name}}
							</button>
							<!-- <button type="button" class="btn btn-green" @click="openAddMgr">
	                        	<i class="icon-add"></i>添加
	              			 </button>
							<button type="button" class="btn btn-blue button-margin" @click="modify">
							    <i class="icon-edit"></i>修改
							</button>
							<button type="button" class="btn btn-red button-margin" @click="deluserinfo">
							    <i class="icon-trash"></i>删除
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
							<button type="button" class="btn btn-primarys button-margin" @click="modestsearch">
					    		<i class="icon-search"></i>高级查询
					    		<i class="icon-arrow1-down" v-show="down"></i>
					    		<i class="icon-arrow1-up" v-show="up"></i>
							</button> -->
						</div>
					</div>
					<div class="columns columns-right btn-group pull-right">
						<div id="refresh" title="刷新" class="btn btn-default btn-refresh"><i class="icon-refresh"></i></div>
						<tableControle :tableHeader="tableHeader" :checkedName="checkedName"  @tableControle="tableControle" ref="tableControle"></tableControle>
					</div>
				</div>
				<!-- 高级查询划出 Begin-->
				<div v-show="search" class="pb10">
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="10">
							<el-col :span="5">
								<el-input v-model="searchList.code" @keyup.enter.native="searchinfo">
									<template slot="prepend">报表名称</template>
								</el-input>
							</el-col>
							<el-col :span="4">
								<el-button type="primary" @click="searchinfo" size="small">搜索</el-button>
								<el-button type="primary" @click="resetbtn" size="small">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<!-- 高级查询划出 End-->
				<el-row :gutter="0">
					<el-col :span="24">
						<!-- 表格 Begin-->
						<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
							<!-- <el-table-column label="序号" sortable prop="id" v-if="checkedName.indexOf('序号')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row.id)>{{scope.row.id}}
									</p>
								</template>
							</el-table-column> -->
							<el-table-column label="报表名称" width="200" sortable prop="code" v-if="checkedName.indexOf('报表名称')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row.id)>{{scope.row.code}}
									</p>
								</template>
							</el-table-column>
							<el-table-column label="报表文件" width="220" sortable prop="name" v-if="checkedName.indexOf('报表文件')!=-1">
							</el-table-column>
							<!-- <el-table-column label="报表文件" width="230" sortable prop="file" v-if="this.checkedName.indexOf('报表文件')!=-1">
							</el-table-column> -->
							<el-table-column label="备注" sortable prop="remarks" v-if="checkedName.indexOf('备注')!=-1">
							</el-table-column>
							<el-table-column label="类型" sortable width="140" prop="type" v-if="checkedName.indexOf('类型')!=-1">
							</el-table-column>						
							<!-- <el-table-column label="录入人" sortable width="120" prop="createby" v-if="this.checkedName.indexOf('录入人')!=-1">
							</el-table-column>	 -->
							<el-table-column label="录入时间" width="160" sortable prop="createdate" v-if="checkedName.indexOf('录入时间')!=-1">
							</el-table-column>	
							<!-- <el-table-column label="修改人" width="120" sortable prop="updateby" v-if="this.checkedName.indexOf('修改人')!=-1">
							</el-table-column> -->
							<el-table-column label="修改时间" width="160" sortable prop="updatedate" v-if="checkedName.indexOf('修改时间')!=-1">
							</el-table-column>
						</v-table>
					</el-col>
				</el-row>
			</div>
		</div>
		<!--右侧内容显示 End-->
		<reportmask ref="child" @request="requestData"></reportmask>
	</div>
</div>
</template>
<script>
	import Config from '../../config.js';
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import reportmask from '../reportDetails/reportConfigurationMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'report',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'report',
				dataInfo:{},
				basic_url: Config.dev_url,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				checkedName: [
					'序号',
					'报表名称',
					// 'id',
					'报表文件',
					'备注',
					'类型',
					// '录入人',
					'录入时间',
					// '修改人',
					'修改时间'
				],
				tableHeader: [
					{
						label: '序号',
						prop: 'id'
					},
					{
						label: '报表名称',
						prop: 'code'
					},
					{
						label: '报表文件',
						prop: 'name'
					},
					{
						label: '备注',
						prop: 'remarks'
					},
					{
						label: '类型',
						prop: 'type'
					},
					// {
					// 	label: '录入人',
					// 	prop: 'createby'
					// },
					{
						label: '录入时间',
						prop: 'createdate'
					},
					// {
					// 	label: '修改人',
					// 	prop: 'updateby'
					// },
					{
						label: '修改时间',
						prop: 'updatedate'
					},
					
				],
				selUser: [],
				reportsList: [],
				search: false,
				show: false,
				down: true,
				up: false,
				isShow: false,
				ismin:true,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					code: '',
				},
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				buttons:[],
			}
		},
		methods: {
			setSelData(val){
				this.selUser = val;
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
			tableControle(data){
				this.checkedName = data;
			},
			
		    resetbtn(){
				this.searchList = { //点击高级搜索后显示的内容
					code: '',
				};
				this.requestData('init');
			},
			searchinfo() {
				this.requestData('init');
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
						message: '不可同时修改多个数据',
						type: 'warning'
					});
					return;
				} else {
					// console.log(this.selUser[0]);
					this.$refs.child.detail(this.selUser[0].id);
				}
			},
			//查看
			view(dataid) {
				// console.log(dataid);
			 	// this.reportsList =data;
				this.$refs.child.view(dataid);
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
					var url = this.basic_url + '/api-report/report/deletes';
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
			// 导入
			importData() {
				
			},
			// 导出
			exportData() {
				
			},
			// 打印
			Printing() {
				
			},
			
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			//Table默认加载数据
			requestData(opt) {
				this.$refs.table.requestData(opt);
			},
			childByValue(childValue) {
        		// childValue就是子组件传过来的值
				this.$refs.navsTabs.showClick(childValue);
				this.getbutton(childValue);
			},
			//请求页面的button接口
		    getbutton(childByValue){
		    	// console.log(childByValue);
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
		}
	}
</script>

<style scoped>

</style>