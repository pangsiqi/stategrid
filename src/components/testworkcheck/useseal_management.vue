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
								<button v-for="item in buttons" :key='item.id' :class="'btn mr5 '+ item.style" @click="getbtn(item)">
									<i :class="item.icon"></i>{{item.name}}
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
						<el-form inline-message :model="searchList" label-width="45px">
							<el-row :gutter="10">
                                <el-col :span="7">
									<el-form-item label="工作任务单编号" prop="WONUM" label-width="110px">
										<el-input v-model="searchList.WONUM" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="7">
									<el-form-item label="委托书编号" prop="PROXYNUM" label-width="100px">
										<el-input v-model="searchList.PROXYNUM" @keyup.enter.native="searchinfo"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="7">
									<el-form-item label="用印人" prop="USER" label-width="80px">
										<!-- <el-input v-model="searchList.USER" @keyup.enter.native="searchinfo"></el-input> -->
										<el-select clearable 
											   v-model="searchList.USER" 
											   filterable 
											   default-first-option 
											   placeholder="请选择">
											<el-option v-for="(data,index) in selPerson" :key="index" :value="data.id" :label="data.fullname"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="7">
									<el-form-item label="归还时间" prop="GHTIME" label-width="110px">
										<el-date-picker v-model="searchList.GHTIME" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 100%;" @keyup.enter.native="searchinfo">
										</el-date-picker>
									</el-form-item>
								</el-col>
								<el-col :span="7">
									<el-form-item label="归还接收人" prop="GHUSER" label-width="100px">
										<!-- <el-input v-model="searchList.GHUSER" @keyup.enter.native="searchinfo"></el-input> -->
										<el-select clearable 
											   v-model="searchList.GHUSER" 
											   filterable 
											   default-first-option 
											   placeholder="请选择">
											<el-option v-for="(data,index) in selPerson" :key="index" :value="data.id" :label="data.fullname"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="4">
									<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
									<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px;    margin-left: 2px">重置</el-button>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<!-- 高级查询划出 End-->
					<el-row :gutter="0">
						<el-col :span="24">
							<!-- 表格 Begin-->
							<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="工作任务单编号" width="155" sortable prop="WONUM" v-if="this.checkedName.indexOf('工作任务单编号')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.WONUM}}
										</p>
									</template>
								</el-table-column>
                                <el-table-column label="委托书编号" sortable prop="PROXYNUM" v-if="this.checkedName.indexOf('委托书编号')!=-1">
								</el-table-column>
								<el-table-column label="委托书版本" sortable prop="PROXY_VERSION" v-if="this.checkedName.indexOf('委托书版本')!=-1">
								</el-table-column>
								<el-table-column label="用印人" width="100" sortable prop="USERDesc" v-if="this.checkedName.indexOf('用印人')!=-1">
								</el-table-column>
								<el-table-column label="用印时间" width="185" sortable prop="USETIME" v-if="this.checkedName.indexOf('用印时间')!=-1" :formatter="dateFormat">
								</el-table-column>
                                <el-table-column label="用印人机构" width="120" sortable prop="SEAL_DEPARTMENTDesc" v-if="this.checkedName.indexOf('用印人机构')!=-1">
								</el-table-column>
                                <el-table-column label="归还时间" width="100" sortable prop="GHTIME" v-if="this.checkedName.indexOf('归还时间')!=-1" :formatter="dateFormat">
								</el-table-column>
                                <el-table-column label="归还接收人" width="120" sortable prop="GHUSERDesc" v-if="this.checkedName.indexOf('归还接收人')!=-1">
								</el-table-column>
							</v-table>
							<!-- 表格 End-->
						</el-col>
					</el-row>
				</div>
			</div>
			<!--右侧内容显示 End-->
			<usesealmask :USESEAL="USESEAL" ref="usesealmask" @request="requestData" v-bind:page=page></usesealmask>
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
	import usesealmask from '../testworkcheckDetails/usesealMask.vue'
    import tableControle from '../plugin/table-controle/controle.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'useseal_management',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'usesealmask': usesealmask,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'sealUse',
				reportData:{},//报表的数据
				basic_url: Config.dev_url,
				commentArr: {},
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				checkedName: [
                    '工作任务单编号',
					'委托书编号',
                    '委托书版本',
                    '用印人',
                    '用印时间',
                    '用印人机构',
                    '归还时间',
                    '归还接收人',
				],
				tableHeader: [
                    {
						label: '工作任务单编号',
						prop: 'WONUM'
					},{
						label: '委托书编号',
						prop: 'PROXYNUM'
					},
					{
						label: '委托书版本',
						prop: 'PROXY_VERSION'
					},
					{
						label: '用印人',
						prop: 'USERDesc'
					},
					{
						label: '用印时间',
						prop: 'USETIME'
					},
					{
						label: '用印人机构',
						prop: 'SEAL_DEPARTMENTDesc'
					},
					{
						label: '归还时间',
						prop: 'GHTIME'
					},
					{
						label: '归还接收人',
						prop: 'GHUSERDesc'
					}
				],
				selUser: [],
				USESEAL: [],
				search: false,
				show: false,
				isShow: false,
				ismin: true,
				fullHeight: document.documentElement.clientHeight - 210 + 'px', //获取浏览器高度
                searchList: { //点击高级搜索后显示的内容
                    WONUM:'',
					PROXYNUM:'',
					USER: '',
					GHTIME:'',
                    GHUSER: '',
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				page: { //分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				buttons:[],
				selPerson: [],
			}
		},
		methods: {
			setSelData(val){
				this.selUser = val;
			},
			tableControle(data) {
				this.checkedName = data;
			},
			//重置
			resetbtn(){
				this.searchList = {
					WONUM:'',
					PROXYNUM:'',
					USER: '',
					GHTIME:'',
                    GHUSER: '',
				};
				this.requestData('init');
			},
			//搜索
			searchinfo() {
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
		    	 this.deluserinfo();
		    	}else if(item.name=="配置关系"){
		    	 this.Configuration();
		    	}else if(item.name=="报表"){
			     this.reportdata();
				}else if(item.name=="打印"){
				 this.Printing();
				}
		    },
			//添加类别
			openAddMgr() {
				this.$refs.usesealmask.open(); // 方法1
				this.$refs.usesealmask.visible();
			},
			//修改类别
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
					if(this.selUser[0].STATE == 3 || this.selUser[0].STATE == 2) {
						this.$message({
							message: '已启动的流程，不允许修改数据，只可以查看。',
							type: 'warning'
						});
						this.$refs.usesealmask.view(this.selUser[0].ID);
					//驳回
					}else if(this.selUser[0].STATE == 0) {
						var url = this.basic_url + '/api-apps/app/workorder/flow/isExecute/' + this.selUser[0].ID;
						this.$axios.get(url, {}).then((res) => {
							if(res.data.resp_code == 0) {
								var url = this.basic_url + '/api-apps/app/workorder/flow/isPromoterNode/' + this.selUser[0].ID;
								this.$axios.get(url, {}).then((res) => {
									if(res.data.resp_code == 0) {
										this.$refs.usesealmask.detail(this.selUser[0].ID);
									} else {
										this.$message({
											message: res.data.resp_msg,
											type: 'warning'
										});
									}
								});
							} else {
								this.$message({
									message: res.data.resp_msg,
									type: 'warning'
									});
							}
						});
					}else{
						this.$refs.usesealmask.detail(this.selUser[0].ID);	
					}
				}
			},
			//查看
			 view(data) {
				this.$refs.usesealmask.view(data.ID);
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
			},
			//报表
			reportdata(){
				this.reportData.app=this.productType;
				this.$refs.reportChild.visible();
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
					var url = this.basic_url + '/api-apps/app/sealUse/deletes';
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
			//物理删除
			physicsDel() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-apps/app/sealUse/physicsDel';
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
		    //代办跳转
			getRouterData() {
				// 只是改了query，其他都不变
				this.id = this.$route.query.bizId;
				this.$refs.child.view(this.id);
			},
			getSelPerson(){
				this.$axios.get(this.basic_url + '/api-user/users', {
				}).then((res) => {
					var resData = res.data.data;
					for (let i = 0; i < resData.length; i++) {
						this.selPerson.push({
							id: resData[i].id,
							fullname:  resData[i].nickname
						})
					}
				}).catch((wrong) => {})
			}
		},
		mounted() {
			if(this.$route.query.bizId != undefined) {
				this.getRouterData();
			}
			this.getSelPerson();
		},
	}
</script>

<style scoped>

</style>