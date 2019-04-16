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
<!-- 							<div class="hidden-xs" id="roleTableToolbar" role="group">
								<button type="button" class="btn btn-green" @click="openAddMgr">
                                	<i class="icon-add"></i>添加
                      			 </button>
								<button type="button" class="btn btn-blue button-margin" @click="modify">
								    <i class="icon-edit"></i>修改
								</button>
								<button type="button" class="btn btn-red button-margin" @click="delinfo">
								    <i class="icon-trash"></i>删除
								</button>
								<button type="button" class="btn btn-primarys button-margin">
							    	<i class="icon-upload-cloud"></i>导入
								</button>
								<button type="button" class="btn btn-primarys button-margin">
							    	<i class="icon-download-cloud"></i>导出
								</button>
								<button type="button" class="btn btn-primarys button-margin">
							    	<i class="icon-print"></i>打印
								</button>
								<button type="button" class="btn btn-primarys button-margin">
							    	<i class="icon-alert-triangle"></i>中止
								</button>
								<button type="button" class="btn btn-primarys button-margin" @click="modestsearch">
						    		<i class="icon-search"></i>高级查询
						    		<i class="icon-arrow1-down" v-show="down"></i>
						    		<i class="icon-arrow1-up" v-show="up"></i>
								</button>
							</div> -->
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
								<el-table-column label="流程定义ID" sortable width="200px" prop="id" v-if="this.checkedName.indexOf('流程定义ID')!=-1">
									<template slot-scope="scope">
										<p class="blue" title="点击查看详情" @click=view(scope.row.ID)>{{scope.row.id}}
										</p>
									</template>
								</el-table-column>
								<el-table-column label="流程名称" sortable width="140px" prop="name" v-if="this.checkedName.indexOf('流程名称')!=-1">
								</el-table-column>
								<el-table-column label="流程标识" sortable width="140px" prop="key" v-if="this.checkedName.indexOf('流程标识')!=-1">
								</el-table-column>
								<el-table-column label="类型" sortable width="140px" prop="category" v-if="this.checkedName.indexOf('类型')!=-1">
								</el-table-column>
								<el-table-column label="部署id" sortable width="100px" prop="deploymentId" v-if="this.checkedName.indexOf('部署id')!=-1">
								</el-table-column>
								<el-table-column label="流程图资源" width="220px" prop="diagramResourceName" sortable  v-if="this.checkedName.indexOf('流程图资源')!=-1">
								</el-table-column>
								<el-table-column label="版本" prop="version" sortable  v-if="this.checkedName.indexOf('版本')!=-1">
								</el-table-column>
								<el-table-column label="资源名称" sortable width="200px" prop="resourceName" v-if="this.checkedName.indexOf('资源名称')!=-1">
								</el-table-column>
							</v-table>
							<!-- 表格 -->
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
	</div>		
</div>	
</template>

<script>
import Config from '../../config.js'
import vheader from '../common/vheader.vue'
import navs_left from '../common/left_navs/nav_left5.vue'
import navs_tabs from '../common/nav_tabs.vue'
import vTable from '../plugin/table/table.vue'

export default {
	name: 'task',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'v-table': vTable
		},

    data() {
      return {
		appName: 'flowProcess',
      	basic_url: Config.dev_url,
      	fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
		loadSign: true, //鼠标滚动加载数据
		loading: false,//默认加载数据时显示loading动画
      	search: false,
      	flowmodelList:[],
      	commentArr: {},
      	checkedName: [
			'流程定义ID',
			'类型',
			'流程标识',
			'流程名称',
			'部署id',
			'流程图资源',
			'版本',
			'资源名称'
		],
		tableHeader: [{
			label: '流程定义ID',
			prop: 'id'
		},
		{
			label: '类型',
			prop: 'category'
		},
		{
			label: '流程标识',
			prop: 'key'
		},
		{
			label: '流程名称',
			prop: 'name'
		},
		{
			label: '部署id',
			prop: 'deploymentId'
		},
		{
			label: '流程图资源',
			prop: 'diagramResourceName'
		},
		{
			label: '版本',
			prop: 'version'
		},
		{
			label: '资源名称',
			prop: 'resourceName'
		}
		],
		searchList: {
			// createTime:'',
		},
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
		},
      }
    },
  
	methods: {
		setSelData(val){
			this.selUser = val;
		},
		//Table默认加载数据
		requestData(opt) {
			this.$refs.table.requestData(opt);
		},
		childByValue:function(childValue) {
    		this.$refs.navsTabs.showClick(childValue);
      	},
	}
}
</script>

<style>
</style>