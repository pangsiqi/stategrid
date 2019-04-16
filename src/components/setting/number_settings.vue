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
								<button type="button" class="btn btn-green" @click="openAddMgr" id="">
                                	<i class="icon-add"></i>添加
                      			</button>
								<button type="button" class="btn btn-blue button-margin" @click="modify">
								    <i class="icon-edit"></i>修改
								</button>
								<button type="button" class="btn btn-red button-margin" @click="deluserinfo">
								    <i class="icon-trash"></i>删除
								</button>
								<button type="button" class="btn btn-primarys button-margin" @click="modestsearch">
						    		<i class="icon-search"></i>高级查询
						    		<i class="icon-arrow1-down" v-show="down"></i>
						    		<i class="icon-arrow1-up" v-show="up"></i>
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
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="10">
							<el-col :span="5">
								<el-form-item label="自动编号名称" prop="AUTOKEY" label-width="100px">
									<el-input v-model="searchList.AUTOKEY" @keyup.enter.native="searchinfo">
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
							<!-- <el-table-column label="应用编号" width="100" sortable prop="serialnum" v-if="this.checkedName.indexOf('序列号')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.serialnum}}</p>
								</template>
							</el-table-column> -->
							<el-table-column label="应用名" width="180" sortable prop="markx" v-if="this.checkedName.indexOf('前缀')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.markx}}</p>
								</template>
							</el-table-column>
							<el-table-column label="表名" width="260" sortable prop="marky" v-if="this.checkedName.indexOf('表名')!=-1">
							</el-table-column>
							<el-table-column label="描述" width="180" sortable prop="remarks" v-if="this.checkedName.indexOf('描述')!=-1">
							</el-table-column>
							<el-table-column label="前缀" width="100" sortable prop="prefix" v-if="this.checkedName.indexOf('前缀')!=-1">
							</el-table-column>
							<el-table-column label="初始化起始数" width="180" sortable align="right" prop="initnum" v-if="this.checkedName.indexOf('初始化起始数')!=-1">
							</el-table-column>
							<el-table-column label="是否初始化" width="140" sortable align="center" prop="isinitbydateDesc" v-if="this.checkedName.indexOf('是否初始化')!=-1">
							</el-table-column>
							<el-table-column label="初始化日期格式" width="140" sortable align="center" prop="initformat" v-if="this.checkedName.indexOf('初始化日期格式')!=-1">
							</el-table-column>
							<el-table-column label="增加量" width="100" sortable align="right" prop="increase" v-if="this.checkedName.indexOf('增加量')!=-1">
							</el-table-column>
							<el-table-column label="是否拼接日期" width="120" sortable align="center" prop="issplicingdateDesc" v-if="this.checkedName.indexOf('是否拼接日期')!=-1">
							</el-table-column>
							<el-table-column label="拼接日期格式" width="180" sortable align="center" prop="splicingformat" v-if="this.checkedName.indexOf('拼接日期格式')!=-1">
							</el-table-column>
							<el-table-column label="保留位数" sortable align="right" prop="retain" v-if="this.checkedName.indexOf('保留位数')!=-1">
							</el-table-column>
						</v-table>
						<!-- 表格 End-->
					</el-col>
				</el-row>
			</div>
		</div>
		<!--右侧内容显示 End-->
		<numbsetmask :numbsetForm="numbsetForm" ref="child" @request="requestData" v-bind:page=page></numbsetmask>
	</div>
</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import numbsetmask from '../settingDetails/number_settingMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'number_settings',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
			'numbsetmask': numbsetmask,
			'tableControle': tableControle,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'serialnum',
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
					'是否初始化',
					'初始化日期格式',
					'应用名',
					'表名',
					'描述',
					'前缀',
					'初始化起始数',
					'增加量',
					'是否拼接日期',
					'拼接日期格式',
					'序列号',
					'保留位数',
				],
				tableHeader: [//控制Table-列头标题名称
					{
						label: '是否初始化',
						prop: 'isinitbydate'
					},
					{
						label: '初始化日期格式',
						prop: 'initformat'
					},
					{
						label: '应用名',
						prop: 'markx'
					},
					{
						label: 'marky',
						prop: 'prefix'
					},
					{
						label: '描述',
						prop: 'remarks'
					},
					{
						label: '前缀',
						prop: 'prefix'
					},
					{
						label: '初始化起始数',
						prop: 'initnum'
					},
					{
						label: '增加量',
						prop: 'increase'
					},
					{
						label: '是否拼接日期',
						prop: 'issplicingdate'
					},
					{
						label: '拼接日期格式',
						prop: 'splicingformat'
					},
					{
						label: '序列号',
						prop: 'serialnum'
					},
					{
						label: '保留位数',
						prop: 'retain'
					}
				],
				commentArr:{},
				selMenu: [],
				'启用': true,
				'冻结': false,
				numberList: [],
				search: false,
				show: false,
				down: true,
				up: false,
				isShow: false,
				ismin:true,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					AUTOKEY: '',
				},
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				aaaData: [],
				numbsetForm: {}//修改子组件时传递数据
			}
		},

		methods: {
			setSelData(val){
				this.selMenu = val;
			},
			tableControle(data){//控制表格列显示隐藏
				this.checkedName = data;
			},
			searchinfo() {//高级查询
				this.requestData('init');
			},
			resetbtn(){
				this.searchList = {
					AUTOKEY: '',
				};
				this.requestData('init');
			},
			openAddMgr() {//添加自动编号设置数据
				this.numbsetForm = {
					isinitbydate:'',
					initformat:'',
					prefix:'',
					initnum:'',
					increase:'',
					issplicingdate:'',
					splicingformat:'',
					serialnum:'',
					retain:'',
					createuser:'',
					createuserDesc:'',
					updateuser:'',
					updateuserDesc:''
				};
				this.$refs.child.open();
				this.$refs.child.childMethods();
			},
			modify() {//修改自动编号设置数据
				this.aaaData = this.selMenu;
				if(this.aaaData.length == 0) {
					this.$message({
						message: '请您选择要修改的数据',
						type: 'warning'
					});
					return;
				} else if(this.aaaData.length > 1) {
					this.$message({
						message: '不可同时修改多条数据',
						type: 'warning'
					});
					return;
				} else {
					this.numbsetForm = this.selMenu[0]; 
					this.$refs.child.detail();
				}
			},
			//查看
			 view(item) {
			 	this.numbsetForm = item;
				this.$refs.child.view(item);
			},
			open(){
				this.show = true;
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
				this.down = !this.down,
					this.up = !this.up
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
					var url = this.basic_url + '/api-user/serialnum/'+this.selMenu[0].id;
					this.$confirm('确定删除此数据吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
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
			//Table默认加载数据
			requestData(opt) {//高级查询字段
				this.$refs.table.requestData(opt);
			},
		},
	}
</script>

<style scoped>

</style>