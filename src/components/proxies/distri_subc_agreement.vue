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
				<!-- 高级查询划出 Begin-->
				<div v-show="search">
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="5">
							<el-col :span="5">
								<el-form-item label="分包协议编号" prop="PROXY_CONTRACT_NUM" label-width="100px">
									<el-input v-model="searchList.PROXY_CONTRACT_NUM" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="委托书编号" prop="PROXYNUM" label-width="85px">
									<el-input v-model="searchList.PROXYNUM" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="分包单位" prop="VENDOR" label-width="70px">
									<!-- <el-input v-model="searchList.VENDOR" @keyup.enter.native="searchinfo"></el-input> -->
									<el-select clearable 
											   v-model="searchList.VENDOR" 
											   filterable 
											   default-first-option 
											   placeholder="请选择">
										<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								  <el-form-item label="录入时间" prop="ENTERDATE" label-width="70px">
									<div class="block">
									    <el-date-picker
									      	v-model="searchList.ENTERDATE"
									      	type="date" 
										  	style="width: 100%;"
									      	placeholder="录入时间" 
										  	value-format="yyyy-MM-dd"
										  	@keyup.enter.native="searchinfo">
									    </el-date-picker>
								  </div>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
								<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px; margin-left: 2px">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<!-- 高级查询划出 End-->
				<el-row class="relative" id="pageDiv">
					<!-- 左侧树菜单 Begin-->
					<el-col :span="5" class="lefttree" id="left">
						<div class="lefttreebg">
							<div class="left_tree_title clearfix">
								<div class="pull-left pr20" v-if="ismin">检索分类</div>
							</div>
							<div class="left_treebg" :style="{height: fullHeight}">
								<div class="p15" v-if="ismin">
									<el-tree ref="tree" class="filter-tree" :data="resourceData" node-key="id" default-expand-all :indent="22" :render-content="renderContent" :props="resourceProps" @node-click="handleNodeClick">
									</el-tree>
								</div>
							</div>
						</div>
					</el-col>
					<!-- 左侧树菜单 End-->
					<div id="middle"></div>
					<el-col :span="19" class="leftcont" id="right">
						<!-- 表格 Begin-->
						
						<v-table ref="table" :appName="appName" :searchList="searchList" @getSelData="setSelData">
							<el-table-column label="分包协议编号" width="150" sortable prop="PROXY_CONTRACT_NUM" v-if="this.checkedName.indexOf('分包协议编号')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row.ID)>{{scope.row.PROXY_CONTRACT_NUM}}
									</p>
								</template>
							</el-table-column>
							<el-table-column label="委托书编号" width="150" sortable prop="PROXYNUM" v-if="this.checkedName.indexOf('委托书编号')!=-1">
							</el-table-column>
							<el-table-column label="委托方名称" width="150" sortable prop="V_NAMEDesc" v-if="this.checkedName.indexOf('委托方名称')!=-1">
							</el-table-column>
							<el-table-column label="状态" width="150" sortable prop="state" v-if="this.checkedName.indexOf('状态')!=-1">
							</el-table-column>
							<el-table-column label="分包单位" width="150" sortable prop="VENDORDesc" v-if="this.checkedName.indexOf('分包单位')!=-1">
							</el-table-column>
							<el-table-column label="检验/检测项目内容" width="150" sortable prop="P_REMARKS" v-if="this.checkedName.indexOf('检验/检测项目内容')!=-1">
							</el-table-column>						
							<el-table-column label="对环境和操作人员要求" width="180" sortable prop="REQUIRE" v-if="this.checkedName.indexOf('对环境和操作人员要求')!=-1">
							</el-table-column>
							<el-table-column label="对分包报告/证书的要求" width="180" sortable prop="Q_TYPE" v-if="this.checkedName.indexOf('对分包报告/证书的要求')!=-1">
							</el-table-column>
							<el-table-column label="检验检测费用" width="120" sortable prop="CHECKCOST" v-if="this.checkedName.indexOf('检验检测费用')!=-1">
							</el-table-column>
							<el-table-column label="信息状态" width="100" sortable prop="STATUS" v-if="this.checkedName.indexOf('信息状态')!=-1">
							</el-table-column>
							<el-table-column label="录入人" width="100" sortable prop="ENTERBY" v-if="this.checkedName.indexOf('录入人')!=-1">
							</el-table-column>
							<el-table-column label="录入时间" width="120" sortable prop="ENTERDATE" :formatter="dateFormat" v-if="this.checkedName.indexOf('录入时间')!=-1">
							</el-table-column>
							<el-table-column label="修改人" width="100" sortable prop="CHANGEBY" v-if="this.checkedName.indexOf('修改人')!=-1">
							</el-table-column>
							<el-table-column label="修改时间" width="120" sortable prop="CHANGEDATE" :formatter="dateFormat" v-if="this.checkedName.indexOf('修改时间')!=-1">
							</el-table-column>
						</v-table>
						<!-- 表格 End-->
					</el-col>
				</el-row>
			</div>
		</div>
		<distrisubmask  ref="child" @request="requestData" @requestTree="getKey" v-bind:page=page></distrisubmask>
	</div>
</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue' 
	import tableControle from '../plugin/table-controle/controle.vue'
	import distrisubmask from '../proxiesDetails/distrisub_mask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'user_management',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'distrisubmask': distrisubmask,
			'tableControle': tableControle,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'subcontrac2',
				basic_url: Config.dev_url,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				checkedName: [
					'分包协议编号',
					'委托书编号',
					'委托方名称',
					'状态',
					'分包单位',
					'检验/检测项目内容',
					'检验检测项目依据',
					'对环境和操作人员要求',
					'对分包报告/证书的要求',
					'检验检测费用',
					'信息状态',
					'录入人',
					'录入时间',
					'修改人',
					'修改时间'
				],
				tableHeader: [
					{
						label: '分包协议编号',
						prop: 'PROXY_CONTRACT_NUM'
					},
					{
						label: '委托书编号',
						prop: 'PROXYNUM'
					},
					{
						label: '委托方名称',
						prop: 'V_NAMEDesc'
					},
					{
						label: '状态',
						prop: 'state'
					},
					{
						label: '分包单位',
						prop: 'VENDOR'
					},
					{
						label: '检验/检测项目内容',
						prop: 'P_REMARKS'
					},
					{
						label: '检验检测项目依据',
						prop: 'BASIS'
					},
					{
						label: '对环境和操作人员要求',
						prop: 'REQUIRE'
					},
					{
						label: '对分包报告/证书的要求',
						prop: 'Q_TYPE'
					},
					{
						label: '检验检测费用',
						prop: 'CHECKCOST'
					},
					{
						label: '信息状态',
						prop: 'STATUS'
					},
					{
						label: '录入人',
						prop: 'ENTERBY'
					},
					{
						label: '录入时间',
						prop: 'ENTERDATE'
					},
					{
						label: '修改人',
						prop: 'CHANGEBY'
					},
					{
						label: '修改时间',
						prop: 'CHANGEDATE'
					}
				],
				companyId: '',
				deptId: '',
				selUser: [],
				subagreeList: [],
				search: false,
				show: false,
				isShow: false,
				ismin:true,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					PROXY_CONTRACT_NUM: '',
					PROXYNUM: '',
					VENDOR: '',
					ENTERBY:'',
					ENTERDATE:''
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "fullname"
				},
				userData:[],
				//分页显示
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
			tableControle(data){
				this.checkedName = data;
			},
			searchinfo() {
				this.requestData('init');
			},
			resetbtn(){
				this.searchList =  { //点击高级搜索后显示的内容
					PROXY_CONTRACT_NUM:'',
					PROXYNUM: '',
					VENDOR: '',
					ENTERDATE: '',
				};
				this.requestData('init');
			},
			getbtn(item){
				if(item.name=="高级查询"){
					this.modestsearch();
				}else if(item.name=="导入"){
					this.download();
				}else if(item.name=="打印"){
					this.Printing();
				}
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
			},
			//查看
			 view(id) {
				this.$refs.child.view(id);
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
			handleNodeClick(data) {
				if(data.type == '1') {
					this.companyId = data.id;
					this.deptId = '';
				} else {
					this.deptId = data.id;
					this.companyId = '';
				}
				this.requestData();
			},
			renderContent(h, {node,data,store}) { //自定义Element树菜单显示图标
				return (<span><i class={data.iconClass}></i><span>{node.label}</span></span>)
			},
			// 点击节点
			nodeClick: function(m) {
				if(m.iconClass != 'icon-file-text') {
					if(m.iconClass == 'icon-file-normal') {
						m.iconClass = 'icon-file-open';
					} else {
						m.iconClass = 'icon-file-normal';
					}
				}
				this.handleNodeClick();
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
			transformTree(data) {
				for(var i = 0; i < data.length; i++) {
					data[i].name = data[i].fullname;
					if(!data[i].pid || $.isArray(data[i].subDepts)) {
						data[i].iconClass = 'icon-file-normal';
					} else {
						data[i].iconClass = 'icon-file-text';
					}
					if($.isArray(data[i].subDepts)) {
						data[i].children = this.transformTree(data[i].subDepts);
					}
				}
				return data;
				
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
		    //树和表单之间拖拽改变宽度
			treeDrag(){
				var middleWidth=5,
				left = document.getElementById("left"),
				right =  document.getElementById("right"), 
				middle =  document.getElementById("middle"); 
				middle.style.left = left.clientWidth + 'px';
				right.style.left = left.clientWidth + 5 + 'px';
				middle.onmousedown = function(e) { 
					var disX = (e || event).clientX; 
					middle.left = middle.offsetLeft; 
					document.onmousemove = function(e) { 
						var iT = middle.left + ((e || event).clientX - disX); 
						var e=e||window.event,tarnameb=e.target||e.srcElement; 
						var maxT=document.body.clientWidth; 
						iT < 0 && (iT = 0); 
						iT > maxT/2 && (iT = maxT/2); 
						middle.style.left = left.style.width = iT + "px"; 
						right.style.width = maxT - iT -middleWidth -230 + "px"; 
						right.style.left = iT+middleWidth+"px"; 
						return false 
					}; 
					document.onmouseup = function() { 
						document.onmousemove = null; 
						document.onmouseup = null; 
						middle.releaseCapture && middle.releaseCapture() 
					}; 
					middle.setCapture && middle.setCapture(); 
					return false 
				}; 
			},
			//代办跳转
			getRouterData() {
				// 只是改了query，其他都不变
				this.id = this.$route.query.bizId;
				this.$refs.child.view(this.id);
			},
			getSelectData(){
				var url = this.basic_url + '/api-user/depts/findFirstSecond';
				this.$axios.get(url, {}).then((res) => {
					this.selectData = res.data;
				}).catch((wrong) => {})
			}
		},
		mounted(){
			this.treeDrag();//调用树和表单之间拖拽改变宽度
			this.getKey();
			this.getSelectData();
			if(this.$route.query.bizId != undefined) {
				this.getRouterData();
			}
		},
	}
</script>

<style scoped>

</style>