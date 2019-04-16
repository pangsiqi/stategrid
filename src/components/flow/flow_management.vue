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
			<div id="wrapper-content" class="wrapper">
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
										<el-checkbox-group v-model="checkedName">
											<el-dropdown-item v-for="(item,index) in tableHeader" :key="index">
												<el-checkbox :label="item.label" name="type"></el-checkbox>
											</el-dropdown-item>
										</el-checkbox-group>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
					</div>
					<!-- 高级查询划出 Begin-->
					<!--<div v-show="search">
						<el-form inline-message :model="searchList">
							<el-row :gutter="5">
								<el-col :span="6">
									<el-form-item label="委托单位名称" prop="V_NAME"  label-width="100px">
										<el-input v-model="searchList.V_NAME"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="样品名称" prop="ITEM_NAME" label-width="70px">
										<el-input v-model="searchList.ITEM_NAME"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="检测报告编号" prop="REPORT_NUM" label-width="100px">
										<el-input v-model="searchList.REPORT_NUM"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="检测委托书编号" prop="PROXYNUM" label-width="110px">
										<el-input v-model="searchList.PROXYNUM"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="5">
								<el-col :span="6">
									<el-form-item label="完成日期" prop="COMPDATE" label-width="100px">
										<el-date-picker v-model="searchList.COMPDATE" type="date" placeholder="完成日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%">
									</el-date-picker>
									</el-form-item>
								</el-col>
								
								<el-col :span="5">
									<el-form-item label="状态" prop="STATUS" label-width="70px">
										<el-select clearable v-model="searchList.STATUS" placeholder="选择状态" style="width: 100%">
											<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="2">
									<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
								</el-col>
							</el-row>
						</el-form>
					</div>-->
					<!-- 高级查询划出 End-->

					<el-row :gutter="10">
						<el-col :span="24" class="leftcont">
							<!-- 表格 -->
							<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
								<el-table-column label="编号" sortable width="130px" prop="id" v-if="this.checkedName.indexOf('编号')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row.ID)>{{scope.row.id}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="模型名称" sortable prop="name" v-if="this.checkedName.indexOf('模型名称')!=-1">
								</el-table-column>
								<el-table-column label="模型标识" sortable width="140px" prop="key" v-if="this.checkedName.indexOf('模型标识')!=-1">
								</el-table-column>
								<el-table-column label="类型" sortable width="140px" prop="category" v-if="this.checkedName.indexOf('类型')!=-1">
								</el-table-column>
								<el-table-column label="模型版本" sortable width="140px" prop="version" v-if="this.checkedName.indexOf('模型版本')!=-1">
								</el-table-column>
								<el-table-column label="录入时间" width="200px" prop="createTime" sortable  v-if="this.checkedName.indexOf('录入时间')!=-1">
								</el-table-column>
							</v-table>
							<!-- 表格 -->
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<flowmanmask ref="child" @request="requestData" ></flowmanmask>
		<iframemask ref="childIframe" ></iframemask>
	</div>		
</div>	
</template>

<script>
import Config from '../../config.js'
import vheader from '../common/vheader.vue'
import navs_left from '../common/left_navs/nav_left5.vue'
import navs_tabs from '../common/nav_tabs.vue'
import flowmanmask from '../flowDetails/flow_manMask.vue'
import iframemask from '../flowDetails/ifram.vue'
import vTable from '../plugin/table/table.vue'
export default {
	name: 'task',
		components: {
			'v-table': vTable,
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
			'flowmanmask': flowmanmask,
			'iframemask': iframemask,
		},

    data() {
      return {
		appName: 'flow',
      	basic_url: Config.dev_url,
		loadSign: true, //鼠标滚动加载数据
		loading: false,//默认加载数据时显示loading动画
      	fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
      	search: false,
      	flowmodelList:[],
      	commentArr: {},
      	checkedName: [
			'编号',
			'类型',
			'模型标识',
			'模型名称',
			'模型版本',
			'录入时间'
		],
		tableHeader: [{
			label: '编号',
			prop: 'id'
		},
		{
			label: '类型',
			prop: 'category'
		},
		{
			label: '模型标识',
			prop: 'key'
		},
		{
			label: '模型名称',
			prop: 'name'
		},
		{
			label: '模型版本',
			prop: 'version'
		},
		{
			label: '录入时间',
			prop: 'createTime'
		}
		],
		searchList: {},
		page: {
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
				this.editor();
			}else if(item.name=="彻底删除"){
				this.physicsDel();
			}else if(item.name=="高级查询"){
				this.modestsearch();
			}else if(item.name=="导入"){
				this.download();
			}else if(item.name=="删除"){
				this.deluserinfo();
			}else if(item.name=="发布"){
				this.release();
			}
		},
		//添加
		openAddMgr() {
			this.$refs.child.visible();
		},
		//Table默认加载数据
		requestData(opt) {
			this.$refs.table.requestData(opt);
		},
		//修改（编辑）
		editor(){
			if(this.selUser.length == 0) {
				this.$message({
					message: '请您选择要修改的流程',
					type: 'warning'
				});
				return;
			} else if(this.selUser.length > 1) {
				this.$message({
					message: '不可同时修改多个流程',
					type: 'warning'
				});
				return;
			} else {
				this.$refs.childIframe.visible(this.selUser[0].id);
			}
		},
		//删除
		delinfo(){
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
					var changeMenu = selData[0];
					var id=changeMenu.id
					var url = this.basic_url + '/api-flow/flow/model/'+id;
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
				}
		},
		//发布
		release(){
			if(this.selUser.length == 0) {
					this.$message({
						message: '请您选择要发布的流程',
						type: 'warning'
					});
					return;
				} else if(this.selUser.length > 1) {
					this.$message({
						message: '不可同时发布多个流程',
						type: 'warning'
					});
					return;
				} else {
					var id=this.selUser[0].id;
					var url = this.basic_url + '/api-flow/flow/model/'+id+'/deploy';
					this.$axios.get(url, {}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: res.data.resp_msg,
								type: 'success'
							});
							this.requestData();
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'warning'
							});
						}
					}).catch((err) => {
					});
				}
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
}
</script>

<style>
</style>