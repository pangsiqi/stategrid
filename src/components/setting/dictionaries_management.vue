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
				<!--按钮操作行 Begin-->
					<div class="fixed-table-toolbar clearfix">
						<div class="bs-bars pull-left">
							<div class="hidden-xs" id="roleTableToolbar" role="group">
							    <button v-for="item in buttons" class="btn mr5" :class="item.style" @click="getbtn(item)">
									<i :class="item.icon"></i>{{item.name}}
								</button>
							</div>
						</div>

						<div class="columns columns-right btn-group pull-right">
							<div id="refresh" title="刷新" class="btn btn-default btn-refresh"><i class="icon-refresh"></i></div>
							<tableControle :tableHeader="tableHeader" :checkedName="checkedName"  @tableControle="tableControle" ref="tableControle"></tableControle>
						</div>
					</div>
				<!--按钮操作行 End-->

				<!-- 高级查询划出 Begin-->
				<div v-show="search">
					<el-form inline-message :model="searchList">
						<el-row :gutter="10">
							<el-col :span="5">
								<el-form-item label="类型编码" prop="code" label-width="70px">
									<el-input v-model="searchList.code" @keyup.enter.native="searchinfo">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="类型名称" prop="name" label-width="70px">
									<el-input v-model="searchList.name" @keyup.enter.native="searchinfo">
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
				<!-- 高级查询划出 End-->
				
				<el-row :gutter="0">
					<el-col :span="24">
						<!-- 表格 Begin-->
						<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
							<el-table-column label="类型编码" width="200" sortable prop="code" v-if="this.checkedName.indexOf('类型编码')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row.id)>{{scope.row.code}}</p>
								</template>
							</el-table-column>

							<el-table-column label="类型名称" width="220" sortable prop="name" v-if="this.checkedName.indexOf('类型名称')!=-1">
							</el-table-column>
							
							<el-table-column label="备注" sortable prop="tips" v-if="this.checkedName.indexOf('备注')!=-1">
							</el-table-column>

							<el-table-column label="排序" sortable width="160" align="center" prop="sort" v-if="this.checkedName.indexOf('排序')!=-1">
							</el-table-column>
						</v-table>
						<!-- 表格 End-->
					</el-col>
				</el-row>
			</div>
		</div>
		<!--右侧内容显示 End-->
		<dictionariemask :dictionarieForm="dictionarieForm" ref="child" @request="requestData" v-bind:page=page></dictionariemask>
	</div>
</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import dictionariemask from '../settingDetails/dictionarie_mask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'dictionarie_management',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
			'dictionariemask': dictionariemask,
			'tableControle': tableControle,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'dicts',
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				basic_url: Config.dev_url,
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				checkedName: [//控制Table-列显示和隐藏
					'类型编码',
					'类型名称',
					'备注',
					'排序',
				],
				tableHeader: [//控制Table-列头标题名称
					{
						label: '类型编码',
						prop: 'code'
					},
					{
						label: '类型名称',
						prop: 'name'
					},
					{
						label: '备注',
						prop: 'tips'
					},
					{
						label: '排序',
						prop: 'sort'
					}
				],
				commentArr:{},
				selDictionarie: [],
				'启用': true,
				'冻结': false,
				dictionarieList: [],
				search: false,
				show: false,
				down: true,
				up: false,
				isShow: false,
				ismin:true,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					code: '',
					name: '',
				},
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				selData: [],
				dictionarieForm: {},//修改子组件时传递数据
				buttons:[],//按钮
			}
		},

		methods: {
			setSelData(val){
				this.selDictionarie = val;
			},
			tableControle(data){//控制表格列显示隐藏
				this.checkedName = data;
			},
			
			searchinfo() {
				this.requestData('init');
			},
			resetbtn(){
				this.searchList = { //点击高级搜索后显示的内容
					code: '',
					name: '',
				};
				this.requestData('init');
			},
			 //请求点击
		    getbtn(item){
		    	if(item.name=="添加"){
		         this.openAddData();
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
			openAddData() {//添加数据
				this.dictionarieForm = {
					code:'',
					name:'',
					tips:'',
					sort:'',//排序
					updateTime:'',
					updateUser:'',
					createTime:'',
					createUser:''
				};
				this.$refs.child.open();
				this.$refs.child.childMethods();
			},
			modify() {//修改数据
				this.selData = this.selDictionarie;
				if(this.selData.length == 0) {
					this.$message({
						message: '请您选择要修改的数据',
						type: 'warning'
					});
					return;
				} else if(this.selData.length > 1) {
					this.$message({
						message: '不可同时修改多条数据',
						type: 'warning'
					});
					return;
				} else {
					this.dictionarieForm = this.selDictionarie[0]; 
					this.$refs.child.detail(this.selDictionarie[0].id);
				}
			},
			//查看
			view(id) {
				this.$refs.child.view(id);
			},
			open(){
				this.show = true;
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
			},
			// 删除
			deluserinfo() {
				var selData = this.selDictionarie;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-user/dicts/deletes';
					//changeUser为勾选的数据
					var changeUser = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeUser.length; i++) {
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
                    }).then(({ value }) => {
                        this.$axios.delete(url, {params: data}).then((res) => {//.delete 传数据方法
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
				var selData = this.selDictionarie;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {
					var url = this.basic_url + '/api-user/dicts/physicsDel';
					//changeUser为勾选的数据
					var changeUser = selData;
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for (var i = 0; i < changeUser.length; i++) {
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
                    }).then(({ value }) => {
                        this.$axios.delete(url, {params: data}).then((res) => {//.delete 传数据方法
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
			
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			//Table默认加载数据
			requestData(opt) {//高级查询字段
				this.refs.table.requestData(opt);
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
	}
</script>

<style scoped>

</style>