<template>
<!-- 溯源计划 -->
<div>
	<div class="headerbg">
		<vheader></vheader>
		<navs_tabs ref='navsTabs'></navs_tabs>
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
								<el-dropdown size="small">
									<button class="btn mr5 btn-primarys">
										<i class="icon-inventory-line-callin"></i> 导入<i class="el-icon-arrow-down el-icon--right"></i>
									</button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item>
											<div @click="download"><i class="icon-download-cloud"></i>下载模版</div>
										</el-dropdown-item>
										<el-dropdown-item>
											<el-upload
											ref="upload"
											class="upload"
											:action="uploadUrl()"
											:on-success="fileSuccess"
											:limit=1
											multiple
											method:="post"
											:file-list="fileList">
												<i class="icon-upload-cloud"></i> 上传
											</el-upload>
										</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
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
						<el-row :gutter="10">
							<el-col :span="5">
								<el-form-item label="计划编号" prop="PMNUM">
									<el-input v-model="searchList.PMNUM" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="计划描述" prop="DESCRIPTION">
									<el-input v-model="searchList.DESCRIPTION" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="设备编号" prop="ASSETNUM" label-width="100px">
									<el-input v-model="searchList.ASSETNUM" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="设备名称" prop="A_NAME">
									<el-input v-model="searchList.A_NAME" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="10">
							<el-col :span="5">
								<el-form-item label="溯源周期" prop="FREQUENCY">
									<el-input v-model="searchList.FREQUENCY" @keyup.enter.native="searchinfo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="溯源机构" prop="PM_MECHANISM">
									<el-select clearable v-model="searchList.PM_MECHANISM" filterable allow-create default-first-option placeholder="请选择" @keyup.enter.native="searchinfo">
										<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="溯源完成日期" prop="COMP_DATE" label-width="100px">
									<div class="block">
									    <el-date-picker
									      v-model="searchList.COMP_DATE"
									      type="date"
									      placeholder="请选择"
										  style="width: 100%"  
										  value-format="yyyy-MM-dd"
										  @keyup.enter.native="searchinfo">
									    </el-date-picker>
								  	</div>
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
							<el-table-column label="溯源计划编号" width="200" sortable prop="PMNUM" v-if="this.checkedName.indexOf('溯源计划编号')!=-1">
								<template slot-scope="scope">
									<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.PMNUM}}
									</p>
								</template>
							</el-table-column>
							<el-table-column label="计划描述" width="200" sortable prop="DESCRIPTION" v-if="this.checkedName.indexOf('计划描述')!=-1">
							</el-table-column>
							<el-table-column label="设备编号" width="120" sortable prop="ASSETNUM" v-if="this.checkedName.indexOf('设备编号')!=-1">
							</el-table-column>
							<el-table-column label="设备名称" width="220" sortable prop="A_NAME" v-if="this.checkedName.indexOf('设备名称')!=-1">
							</el-table-column>						
							<el-table-column label="规格型号" width="180" sortable prop="MODEL" v-if="this.checkedName.indexOf('规格型号')!=-1">
							</el-table-column>
							<el-table-column label="制造商" width="160" sortable prop="VENDOR" v-if="this.checkedName.indexOf('制造商')!=-1">
							</el-table-column>
							<el-table-column label="溯源方式" width="110" sortable prop="TRACEABILITY" v-if="this.checkedName.indexOf('溯源方式')!=-1">
							</el-table-column>
							<el-table-column label="溯源周期" width="100" sortable prop="FREQUENCY" v-if="this.checkedName.indexOf('溯源周期')!=-1">
							</el-table-column>
							<el-table-column label="单位" width="80" sortable prop="FREQUENCYUNIT" v-if="this.checkedName.indexOf('单位')!=-1">
							</el-table-column>
							<el-table-column label="溯源机构" width="100" sortable prop="PM_MECHANISMDesc" v-if="this.checkedName.indexOf('溯源机构')!=-1">
							</el-table-column>
							<el-table-column label="前次溯源起止时间" width="180" sortable prop="PM_START_END" :formatter="dateFormat" v-if="this.checkedName.indexOf('前次溯源起止时间')!=-1">
							</el-table-column>
							<el-table-column label="本次溯源计划时间" width="180" sortable prop="PM_PLANDATE" :formatter="dateFormat" v-if="this.checkedName.indexOf('本次溯源计划时间')!=-1">
							</el-table-column>
							<el-table-column label="溯源完成日期" width="130" sortable prop="COMP_DATE" :formatter="dateFormat" v-if="this.checkedName.indexOf('溯源完成日期')!=-1">
							</el-table-column>
						</v-table>
						<!-- 表格 End-->
					</el-col>
				</el-row>
			</div>
		</div>
		<!--右侧内容显示 End-->
		<detailPage :detailData="selUser[0]" ref="child" @request="requestData"></detailPage>
		<!--报表-->
		<reportmask :reportData="reportData" ref="reportChild" ></reportmask>
	</div>
</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import detailPage from '../equipmentsDetails/trancePlan_mask.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	import vTable from '../plugin/table/table.vue'
	export default {
		name: 'user_management',
		components: {
			'vheader': vheader,
			'navs_left': navs_left,
			'navs_tabs': navs_tabs,
			'tableControle': tableControle,
			'reportmask': reportmask,
			'detailPage': detailPage,
			'v-table': vTable
		},
		data() {
			return {
				appName: 'pmPlan',
				reportData:{},//报表的数据
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				basic_url: Config.dev_url,
				fileList:[],//文件上传的接收数据
				checkedName: [
					'溯源计划编号',
					'计划描述',	
					'设备编号',	
					'设备名称',	
					'规格型号',
					'制造商',
					'溯源方式',
					'溯源周期',
					'单位',
					'溯源机构',	
					'前次溯源起止时间',
					'本次溯源计划时间',
					'溯源完成日期'
				],
				tableHeader: [
					{
						label: '溯源计划编号',
						prop: 'PMNUM'
					},
					{
						label: '计划描述',
						prop: 'DESCRIPTION'
					},
					{
						label: '设备编号',
						prop: 'ASSETNUM'
					},
					{
						label: '设备名称',
						prop: 'A_NAME'
					},
					{
						label: '规格型号',
						prop: 'MODEL'
					},
					{
						label: '制造商',
						prop: 'VENDOR'
					},
					{
						label: '溯源方式',
						prop: 'TRACEABILITY'
					},
					{
						label: '溯源周期',
						prop: 'FREQUENCY'
					},
					{
						label: '单位',
						prop: 'FREQUENCYUNIT'
					},
					{
						label: '溯源机构',
						prop: 'PM_MECHANISMDesc'
					},
					{
						label: '前次溯源起止时间',
						prop: 'PM_START_END'
					},
					{
						label: '本次溯源计划时间',
						prop: 'PM_PLANDATE'
					},
					{
						label: '溯源完成日期',
						prop: 'COMP_DATE'
					}
				],
				selUser: [],
				userList: [],
				search: false,
				show: false,
				down: true,
				up: false,
				isShow: false,
				ismin:true,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchList: {
					'A_NAME': '',
					'PMNUM': '',
					'ASSETNUM': '',
					'PM_MECHANISM': '',
					'DESCRIPTION': '',
					'COMP_DATE': '',
					'FREQUENCY': ''
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				userData:[],
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				selectData:[],
				buttons:[],
				pmPlan:'pmPlan'//appname
			}
		},
		methods: {
			setSelData(val){
				this.selUser = val;
			},
			tableControle(data){
				this.checkedName = data;
			},
			resetbtn(){
				this.searchList = { //点击高级搜索后显示的内容
					A_NAME: '',
					PMNUM: '',
					ASSETNUM: '',
					PM_MECHANISM: '',
					DESCRIPTION: '',
					COMP_DATE: '',
					FREQUENCY: ''
				};
				this.requestData('init');
			},
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
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
		    	}else if(item.name=="报表"){
			     this.reportdata();
				}else if(item.name=="打印"){
				   this.Printing();
				}
			},
			fileSuccess(){//上传成功后返回数据
				this.requestData('init');
			},
			//添加用戶
			openAddMgr() {
//				this.$refs.child.resetNew();
				this.$refs.child.visible();
			},
			//修改用戶
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
					this.$refs.child.detail();
				}
			},
			//查看
			 view(data) {
				this.$refs.child.view(data);
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
					var url = this.basic_url + '/api-apps/app/pmPlan/deletes';
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
			// 删除
			physicsDel() {
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				} else {					
					var url = this.basic_url + '/api-apps/app/pmPlan/physicsDel';
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
			uploadUrl(){
                var url = this.basic_url +'/api-apps/app/pmPlan/importExc?access_token='+sessionStorage.getItem('access_token');
                return url;
            },
          	
			// 导入
			download() {
				var url = this.basic_url + '/api-apps/app/pmPlan/importExcTemplete?access_token='+sessionStorage.getItem('access_token');
				var xhr = new XMLHttpRequest();
					xhr.open('POST', url, true);
					xhr.responseType = "blob";
					xhr.setRequestHeader("client_type", "DESKTOP_WEB");
					xhr.onload = function() {
						if (this.status == 200) {
							var blob = this.response;
							var objecturl = URL.createObjectURL(blob);
							window.location.href = objecturl;
						}
					}
					xhr.send();
			},
			// 导出
			exportData() {
           		var url = this.basic_url + '/api-apps/app/pmPlan/exportExc?access_token='+sessionStorage.getItem('access_token');
          		 var xhr = new XMLHttpRequest();
            	xhr.open('POST', url, true);
            	xhr.responseType = "blob";
            	xhr.setRequestHeader("client_type", "DESKTOP_WEB");
            	xhr.onload = function() {
                	if (this.status == 200) {
						var filename = "pmPlan.xls";
						var blob = this.response;
						var link = document.createElement('a');
						var objecturl = URL.createObjectURL(blob);
						link.href = objecturl;
						link.download = filename;
						link.click();
                	}
            	}
            	xhr.send();
			},
			// 打印
			Printing() {
				
			},
			//报表
			reportdata(){
				this.reportData.app=this.pmPlan;
				this.$refs.reportChild.visible();
			},
			//Table默认加载数据
			requestData(opt) {
				this.$refs.table.requestData(opt);
			},
			searchinfo() {
				this.requestData('init');
			},
			//机构值
			getCompany() {
				var type = "2";
				var url = this.basic_url + '/api-user/depts/treeByType';
				this.$axios.get(url, {
					params: {
						type: type
					},
				}).then((res) => {
					this.selectData = res.data;
				});
			},
			childByValue(childValue) {
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
					var resData = res.data;
					var uploadIndex = 0;
					var uploadBtn = resData.filter((item,index)=>{
						if(item.name == '导入'){
							uploadIndex  = index;
							return item;
						}
					});
					if(uploadBtn.length > 0){
						this.isUploadBtn = true;
						resData.splice(uploadIndex, 1);
					}
					this.buttons = resData;

				}).catch((wrong) => {

				})
		    },
		},
		mounted(){
			this.getCompany();
             // 注册scroll事件并监听  
             let self = this;
              $(".div-table").scroll(function(){
                self.loadMore();
            })
        },
	}
</script>