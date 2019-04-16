<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title">报告生成与编辑</div>
					<div class="mask_anniu">
						<span class="mask_span mask_max" @click="toggle">
							<i v-bind:class="{'icon-maximization': isok1, 'icon-restore':isok2}"></i>
						</span>
						<span class="mask_span" @click="close">
							<i class="icon-close1"></i>
						</span>
					</div>
				</div>
				<div class="mask_content">
					<div class="content-accordion" id="information">
						<el-row>
							<el-col :span="20">
								<el-form inline-message :model="reportTemplate" ref="reportTemplate" :rules="rules" label-position="right">
									<el-form-item label="请先选择报告模板" prop="RE_TYPE" label-width="160px">
										<el-select clearable v-model="reportTemplate.RE_TYPE" placeholder="请选择" @change="requestData" :disabled="noedit" style="width:500px;">
											<el-option v-for="(data,index) in selectData" :key="index" :value="data.RE_NUM" :label="data.DECRIPTION"></el-option>
										</el-select>
									</el-form-item>
								</el-form>
							</el-col>
							<el-col :span="4" class="text-right">
								<!-- <el-button type="success" round size="medium"><i class="icon-eye"></i> 预览报告</el-button> -->
							</el-col>
						</el-row>

						<el-form inline-message :model="inputData" ref="reportGenerateForm" :rules="rules" label-position="right" lable-width="120px">
							<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
								<!-- 封面 Begin-->
								<el-tab-pane v-for="(reportData,index) in selectReportData" :key="index" :label="reportData.name" :name="reportData.typeid">
									<el-row v-if="reportData.name=='封面'||reportData.name=='首页'||reportData.name=='封底'">
										<el-col :span="8" v-for="(item,index) in selectReportData[index].List" :key="index">
											<el-form-item :label="item.title" :prop="item.param" v-if="item.required == 0" label-width="150px">
												<el-input v-model="inputData[item.param]" :type="item.type" v-if="item.type=='input'" :disabled="false" :placeholder="item.name">{{item.title}}</el-input>

												<el-input v-model="inputData[item.param]" :type="item.type" v-if="item.type=='text'" :disabled="true" :placeholder="item.name">{{item.title}}</el-input>

												<el-input v-model="inputData[item.param]" :type="item.type" v-if="item.type=='textarea'&&item.isdatabase=='1'" :disabled="true" :placeholder="item.name">{{item.title}}</el-input>
 
												<el-input v-model="inputData[item.param]" :type="item.type" v-if="item.type=='textarea'&&item.isdatabase=='0'" :disabled="false" :placeholder="item.name">{{item.title}}</el-input>

												<el-date-picker v-model="inputData[item.param]" :type="item.type" v-if="item.type=='date'" value-format="yyyy-MM-dd" :disabled="false" :placeholder="item.name" styel="width:100%;">
												</el-date-picker>

												<!-- <el-radio-group v-model="item.value" v-if="item.type=='radio'" :disabled="false">
													<el-radio :label="it.title" v-for="it in item.opts" :key="it.id"></el-radio>
												</el-radio-group> -->

												<!-- <el-select v-model="item.value" filterable :placeholder="item.name" v-if="item.type == 'select'" @change="selChange" :disabled="false">
													<el-option v-for="(itemchild,index) in assets" :key="index" :label="itemchild.title" :value="itemchild.value">
													</el-option>
												</el-select> -->
											</el-form-item>
											<el-form-item :label="item.title" :prop="item.param" v-else label-width="150px" :rules="{required: true, message: '请填写', trigger: 'change'}">
												<el-input v-model="inputData[item.param]" :type="item.type" v-if="item.type=='input'" :disabled="false" :placeholder="item.name">{{item.title}}</el-input>

												<el-input v-model="inputData[item.param]" :type="item.type" v-if="item.type=='text'" :disabled="true" :placeholder="item.name">{{item.title}}</el-input>

												<el-input v-model="inputData[item.param]" :type="item.type" v-if="item.type=='textarea'&&item.isdatabase=='1'" :disabled="true" :placeholder="item.name">{{item.title}}</el-input>
 
												<el-input v-model="inputData[item.param]" :type="item.type" v-if="item.type=='textarea'&&item.isdatabase=='0'" :disabled="false" :placeholder="item.name">{{item.title}}</el-input>

												<el-date-picker v-model="inputData[item.param]" :type="item.type" v-if="item.type=='date'" value-format="yyyy-MM-dd" :disabled="false" :placeholder="item.name" styel="width:100%;">
												</el-date-picker>

												<!-- <el-radio-group v-model="item.value" v-if="item.type=='radio'" :disabled="false">
													<el-radio :label="it.title" v-for="it in item.opts" :key="it.id"></el-radio>
												</el-radio-group> -->

												<!-- <el-select v-model="item.value" filterable :placeholder="item.name" v-if="item.type == 'select'" @change="selChange" :disabled="false">
														<el-option v-for="(itemchild,index) in assets" :key="index" :label="itemchild.title" :value="itemchild.value">
													</el-option>
												</el-select> -->
											</el-form-item>
										</el-col>
									</el-row>
									
									
									<el-row v-else-if="reportData.name=='产品质量检测报告'">
										<el-col :span="24">
											<el-table :data="reportData.List" 
												border 
												stripe 
												:fit="true" 
												max-height="460" 
												style="width: 100%;" 
												:default-sort="{prop:'reportData.List', order: 'descending'}">

												<el-table-column type="selection" fixed width="55" align="center"></el-table-column>

												<el-table-column type="index" label="序号" width="50">
													<template slot-scope="scope">
														<span> {{(page.currentPage-1)*page.pageSize+scope.$index+1}} </span>
													</template>
												</el-table-column>
												
												<el-table-column label="项目名称" sortable prop="P_DESC">
												</el-table-column>
												<el-table-column label="不合格类别" sortable prop="ISQUALIFIEDDesc">
												</el-table-column>
												<el-table-column label="技术要求" sortable prop="TECHNICAL_REQUIRE">
												</el-table-column>
												<el-table-column label="单位" sortable prop="UNIT">
												</el-table-column>
												<el-table-column label="检测结果" width="200px">
													<template slot-scope="scope">
														<el-table :data="scope.row.workorder_project_itemList" row-key="ID" :show-header="false" style="width: 100%;">
															<el-table-column label="样品编号" prop="ITEMNUM"></el-table-column>
															<el-table-column label="样品描述" prop="MEMO"></el-table-column>
														</el-table>
													</template>
												</el-table-column>
												
												<!-- <el-table-column label="检测结果" width="200px">
													<template slot-scope="scope">
														<el-table-column v-for="(itemList2,index) in scope.row.workorder_project_itemList" :key="index" :label="itemList2.ITEMNUM" prop="MEMO"></el-table-column>
													</template>
												</el-table-column> -->

												

												<el-table-column label="单项判定" width="200px" sortable prop="SYNTHETICAL">
													<template slot-scope="scope">
														<el-form-item :prop="'reportData.List.'+scope.$index + '.SYNTHETICAL'">
															<el-radio-group v-model="scope.row.SYNTHETICAL" :disabled="noedit">
																<el-radio v-for="(data,index) in SelectIsSynthetical" :key="index" :label="data.code">{{data.name}}</el-radio>
															</el-radio-group>
														</el-form-item>
													</template>
												</el-table-column>
											</el-table>

											<el-pagination
												@size-change="sizeChange"
												background
												@current-change="currentChange"
												:current-page="page.currentPage"
												:page-sizes="[10, 20, 30, 40]"
												:page-size="page.pageSize"
												layout="total, sizes, prev, pager, next"
												:total="page.totalCount"
												class="pt10 text-right">
											</el-pagination>
										</el-col>
									</el-row>

									<el-row v-else>
										<el-col :span="24">
											<el-table :data="reportData.List" 
												border 
												stripe 
												:fit="true" 
												max-height="260" 
												style="width: 100%;" 
												@cell-click="iconOperation" 
												:default-sort="{prop:'reportData.List', order: 'descending'}">
												<el-table-column type="selection" fixed width="55" align="center"></el-table-column>

												<el-table-column type="index" label="序号" width="50">
													<template slot-scope="scope">
														<span> {{(page.currentPage-1)*page.pageSize+scope.$index+1}} </span>
													</template>
												</el-table-column>

												<el-table-column label="检验责任人" sortable prop="LIABLE_PERSONDesc">
												</el-table-column>

												<el-table-column label="文件名称" prop="FILESIZE_ORG">
												</el-table-column>

												<el-table-column label="文件大小" prop="FILESIZE">
												</el-table-column>

												<el-table-column label="操作">
													<template slot-scope="scope">
														<el-button title="预览" @click="readFile(scope.row)" type="text" size="small"> 
															<i class="icon-excel"></i>
															预览
														</el-button>
														<el-button title="回退" type="text" size="small" @click="editFile(scope.row)">
															<i class="icon-back"></i>
															回退
														</el-button>
													</template>
												</el-table-column>
											</el-table>

											<el-pagination
												@size-change="sizeChange"
												background
												@current-change="currentChange"
												:current-page="page.currentPage"
												:page-sizes="[10, 20, 30, 40]"
												:page-size="page.pageSize"
												layout="total, sizes, prev, pager, next"
												:total="page.totalCount"
												class="pt10 text-right">
											</el-pagination>
										</el-col>
									</el-row>
									
								</el-tab-pane>
								<!-- 封面 End-->
								
							
							</el-tabs>
						</el-form>
					</div>
					<div class="content-footer" v-show="firstBtn">
						<!--首页按钮事件-->
						<el-button type="primary" v-show="secondBtn" @click="submitForm">保存</el-button>
						<!--检验检测项目清单按钮事件-->
						<el-button type="primary" v-show="thirdBtn" @click="submitForm">保存</el-button>
						<!--内容页按钮事件-->
						<el-button type="primary" v-show="fourthBtn" @click="filesSubmit">生成内容页文档</el-button>
						<!--封底按钮事件-->
						<el-button type="primary" v-show="fifthBtn" @click="reportSubmit">生成检验/检测报告</el-button>
						<el-button @click="close">取消</el-button>
					</div>
					
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	import Config from '../../config.js'
	export default {
		name: 'masks',
		components: {

		},
		data() {
			return {
				inputData: {},
				basic_url: Config.dev_url,
				selectData: [],//报告模板类型
				selectReportData: [],//获取报告数据
				SelectIsQualified:[],//不合格类别
				SelectIsSynthetical:[],//获取单项判定合格不合格
				reportTemplate:{
					RE_TYPE: '1010',
				},
				reportGenerateForm:{},
				date: new Date(), //绑定的时候 直接绑定的当前时间 就好了
				options: [{
					value: '检测结论',
					label: '检测结论'
				}, {
					value: '检测结果',
					label: '检测结果'
				}],
				loadSign:true,//加载
				firstBtn:false,
				secondBtn:false,
				thirdBtn:false,
				fourthBtn:false,
				fifthBtn:false,
				btnShow:true,
				btnClose:false,
				show: false,
				isok1: true,
				isok2: false,
				up: false,
				noedit:false,
				selUser:[],
				activeName: '0', //tabs
				activeNames: ['1','2','3','4','5'],//手风琴数量
				labelPosition: 'right', //表格
				isEditing: true,
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				rules: {
					RE_TYPE: [{ required: true, message: '请选择', trigger: 'change' }],//选择报告模板类型
				},
			};
		},
		methods: {
			//TAbs页切换事件判断按钮显示
			handleClick(tab, event) {
				var activeName = event.target.getAttribute('id');//获取当前tabID名
				if(activeName=='tab-0') {//判断按钮显示问题，封面都不显示
					this.firstBtn = false;
				}else if(activeName=='tab-1') {//判断按钮显示问题，首页显示保存和取消
					this.firstBtn = true;
					this.secondBtn = true;
					this.thirdBtn = false;
					this.fourthBtn = false;
					this.fifthBtn = false;
				}else if(activeName=='tab-2') {//判断按钮显示问题，检查清单显示保存和取消
					this.firstBtn = true;
					this.secondBtn = false;
					this.thirdBtn = true;
					this.fourthBtn = false;
					this.fifthBtn = false;
				}else if(activeName=='tab-3') {//判断按钮显示问题，内容页显示生成内容页文档和取消
					this.firstBtn = true;
					this.secondBtn = false;
					this.thirdBtn = false;
					this.fourthBtn = true;
					this.fifthBtn = false;
				}else if(activeName=='tab-4') {//判断按钮显示问题，封底显示生成生成检验/检测报告和取消
					this.firstBtn = true;
					this.secondBtn = false;
					this.thirdBtn = false;
					this.fourthBtn = false;
					this.fifthBtn = true;
				}
			},
			//报告模板类型
			getReportType() {
				// var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=RE_TYPE';
				var url = this.basic_url + '/api-apps/appSelection/inspectionRepTem/page';
				this.$axios.get(url, {}).then((res) => {
					this.selectData = res.data.data;
					// console.log(res.data.data[0].RE_NUM);
					this.reportTemplate.RE_TYPE = res.data.data[0].RE_NUM;
					// this.templatefileid = res.data.data[0].RE_NUM;
					// this.templatefileid = 1010;
					// this.templatefileid = res.data.data[0].ID;
				});
			},
			//报告模板整体数据列表
			requestData(){
				var url = this.basic_url + '/api-merge/templateConfig/findDataByIds/'+ this.reportTemplate.RE_TYPE +'/'+this.detailId;
				this.$axios.get(url, {}).then((res) => {
					this.selectReportData = res.data;//报告首页
					// console.log(res.data);
					// this.reportGenerateForm.inspect_date = this.getToday();
					this.dealData(res.data);
				}).catch((wrong) => {});
			},
			//获取不合格类别
			getIsQualified() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=isqualified';
				this.$axios.get(url, {}).then((res) => {
					this.SelectIsQualified = res.data;
				}).catch(error => {
				})
			},
			//单项判定合格不合格
			getIsSynthetical() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=isSynthetical';
				this.$axios.get(url, {}).then((res) => {
					this.SelectIsSynthetical = res.data;
				}).catch(error => {
				})
			},
			//From表单中的数据通过param找到Value值
			dealData(data,opt){
				var res = {};
				data.forEach((item,listIndex)=>{
					var list = item.List;
					var totalIndex = 0;
					list.forEach((val,index)=>{
						// console.log(listIndex);
						// console.log(data[listIndex]);
						var param = '';
						if(listIndex == 0){
							param = 'param' + index;
						}else if(listIndex == 1){
							param = 'param' + data[listIndex].List.length + index;
						}else{
							param = 'param' + data[listIndex].List.length + data[listIndex-1].List.length + index;
						}
						res[param] = val.value;
						val.param = param;
					});
				});
				this.inputData = res;
			},
			//清空表单
			reset(){
				this.reportGenerateForm = {
										
				};
			},
			//获取当前时间
			getToday(){
				var date = new Date();
				var month = date.getMonth();
				month++;
				var str = date.getFullYear() + '-' + month + '-'+ date.getDate() + ' ' +  date.getHours() + ':' + date.getMinutes()+ ':' + date.getSeconds() ;
				return str;
			},
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing;
				}
			},
			//打开弹出框页面
			showDialog(id){
				this.show = true;
				// this.detailId = id;
				this.detailId = id;
				this.requestData();
			},

			sizeChange(val) {//分页，总页数
		      this.page.pageSize = val;
		      this.requestData();
		    },
		    currentChange(val) {//分页，当前页
		      this.page.currentPage = val;
		      this.requestData();
			},
			
			
			// 首页按钮事件保存users/saveOrUpdate
			submitForm() {
				console.log(this.reportGenerateForm.name);
				this.$refs.reportGenerateForm.validate((valid) => {
				if (valid) {
					var paramData = this.selectReportData;
					for(let i=0; i<paramData.length; i++){
						var list = paramData[i].List;
						for(let j=0; j<list.length; j++){
							var tranData = list[j];
							tranData.value = this.inputData[tranData.param];
						}
						
					}
					var url = this.basic_url + '/api-merge/templateConfig/saveOrUpdateData/'+this.detailId;
					this.$axios.post(url,this.selectReportData).then((res) => {
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							// this.reportGenerateForm.reportData.List.id=this.detailId;
							// this.reportGenerateForm.reportData.List.report_num=this.detailId;
							// this.reportGenerateForm.reportData.List.product=this.detailId;
							// this.reportGenerateForm.reportData.List.v_name=this.detailId;
							// this.reportGenerateForm.reportData.List.proxy_type=this.detailId;
							// this.reportGenerateForm.reportData.List.id=this.detailId;
							console.log(this.detailId);
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							
							//重新加载数据
							this.$emit('requests');
						}
					}).catch((err) => {
					});
						} else {
							return false;
						}
					});
			},
			//检验检测项目清单按钮事件
			testListSubmit(){

			},
			//内容页按钮事件
			filesSubmit(){

			},
			//封底按钮事件
			reportSubmit(){

			},
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');
			},
			toggle(e) {
				if(this.isok1 == true) {
					this.maxDialog();
				} else {
					this.rebackDialog();
				}
			},
			maxDialog(e) { //大弹出框距离头部少60px
				this.isok1 = false;
				this.isok2 = true;
				$(".mask_div").width(document.body.clientWidth);
				$(".mask_div").height(document.body.clientHeight - 70);
				$(".mask_div").css("top", "-40px");
			},
			//还原按钮
			rebackDialog() { //大弹出框还原成默认大小
				this.isok1 = true;
				this.isok2 = false;
				$(".mask_div").css("width", "80%");
				$(".mask_div").css("height", "90%");
				$(".mask_div").css("top", "0px");
			},
			
		},
		
		mounted() {
			this.getReportType();
			this.getIsQualified();//不合格类别
			this.getIsSynthetical();//单项判定合格不合格
		},
	}
</script>

<style>
	@import '../../assets/css/mask-modules.css';

	/* .el-tabs__content { min-height: 680px;} */
</style>
