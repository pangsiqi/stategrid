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
						<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
							<!-- 封面 Begin-->
							<el-tab-pane label="封面" name="first">
									<el-row>
										<el-col :span="24" class="">
											<el-form inline-message :model="reportTemplate" ref="reportTemplate" :rules="rules" label-position="right">
												<el-form-item label="请先选择报告模板" prop="RE_TYPE" label-width="160px">
													<el-select clearable v-model="reportTemplate.RE_TYPE" placeholder="请选择" :disabled="noedit" style="width:500px;">
														<el-option v-for="(data,index) in selectData" :key="index" :value="data.RE_NUM" :label="data.DECRIPTION"></el-option>
													</el-select>
												</el-form-item>
											</el-form>
										</el-col>
									</el-row>
							</el-tab-pane>
							<!-- 封面 End-->

							<!-- 首页 Begin-->
							<el-tab-pane label="首页" name="second">
								<el-form inline-message :model="reportIndex" ref="reportIndex" :rules="rules" label-position="right">
									<div class="text-center font20 pb10 pt20">国家铁路产品质量监督检验中心<br />检测报告首页</div>
									<div class="pl30 pr30">
										<table width="100%" border="1" cellspacing="0" cellpadding="0" class="reportTable">
											<tr>
												<td width="10%" rowspan="2">产品名称</td>
												<td width="60%" rowspan="2">{{reportIndex.ITEM_NAME}}</td>
												<td width="10%">型号规格</td>
												<td width="20%">{{reportIndex.ITEM_MODEL}}</td>
											</tr>
											<tr>
												<td>商标/标识</td>
												<td>{{reportIndex.ITEM_TRADEMARK}}</td>
											</tr>
											<tr>
												<td>委托单位</td>
												<td colspan="3">{{reportIndex.ITEM_TRADEMARK}}</td>
											</tr>
											<tr>
												<td>制造单位</td>
												<td colspan="3">{{reportIndex.ITEM_TRADEMARK}}</td>
											</tr>
											<tr>
												<td>检测类别</td>
												<td>{{reportIndex.ITEM_TRADEMARK}}</td>
												<td>样品来源</td>
												<td>{{reportIndex.ITEM_SOURCE}}</td>
											</tr>
											<tr>
												<td>抽样日期</td>
												<td>{{reportIndex.CHECK_DATE}}</td>
												<td>样品数量</td>
												<td>{{reportIndex.ITEM_QUALITY}}</td>
											</tr>
											<tr>
												<td>生产日期/批</td>
												<td>{{reportIndex.PRODUCT_DATE}}</td>
												<td>样品编号</td>
												<td>{{reportIndex.ITEMNUM}}</td>
											</tr>
											<tr>
												<td>样品到达日期</td>
												<td>{{reportIndex.ARRIVAL_DATE}}</td>
												<td>样品状态说明</td>
												<td>{{reportIndex.ITEM_STATUS}}</td>
											</tr>
											<tr>
												<td>抽样方案/判定依据</td>
												<td colspan="3">{{reportIndex.CHECK_BASIS}}</td>
											</tr>
											<tr>
												<td>检测依据（多条加、号拼接）</td>
												<td colspan="3">{{reportIndex.S_NAME}}</td>
											</tr>
											<tr>
												<td>检测项目（多条加、号拼接）</td>
												<td colspan="3">
													{{reportIndex.P_DESC}}
												</td>
											</tr>
											<tr>
												<td>检测主要仪器设备（多条加、号拼接）</td>
												<td colspan="3">{{reportIndex.MAINASSET}}</td>
											</tr>
											<tr>
												<td>检测地点</td>
												<td>{{reportIndex.INSPECT_PLACE}}</td>
												<td>检测日期</td>
												<td>{{reportIndex.INSPECT_DATE}}</td>
											</tr>
											<tr>
												<td>
													<el-form-item label="" prop="INSPECT_RESULT_TYPE" label-width="0px">
														<el-select v-model="reportIndex.INSPECT_RESULT_TYPE" placeholder="请选择检测结论/结果" style="width: 100%;" :disabled="noedit">
															<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
															</el-option>
														</el-select>
													</el-form-item>
												</td>
												<td colspan="3">
													<el-form-item label="" prop="INSPECT_RESULT" label-width="0px">
														<el-input type="textarea" rows="5" placeholder="检测结论：是否符合XXX标准要求。" v-model="reportIndex.INSPECT_RESULT" :disabled="noedit"></el-input>
													</el-form-item>

													<el-form-item label="" prop="INSPECT_RESULT2" label-width="0px">
														<el-input type="textarea" rows="5" placeholder="检测结果：综合判定结课。" v-model="reportIndex.INSPECT_RESULT2" :disabled="noedit"></el-input>
													</el-form-item>

													<el-form-item label="综合判定结课" prop="SYNTHETICAL" label-width="110px">
														<el-radio-group v-model="reportIndex.SYNTHETICAL" :disabled="noedit">
															<el-radio label="合格"></el-radio>
															<el-radio label="不合格"></el-radio>
														</el-radio-group>
													</el-form-item>
													<p class="text-right">（盖章）</p>
												</td>
											</tr>
											<tr>
												<td>备 注</td>
												<td colspan="3">
													<el-form-item label="" prop="REPORT_MEMO" label-width="0px">
														<el-input type="textarea" rows="5" v-model="reportIndex.REPORT_MEMO" :disabled="noedit"></el-input>
													</el-form-item>
												</td>
											</tr>
										</table>
										<el-row class="pt10 pb40">
											<el-col :span="8">编制：</el-col>
											<el-col :span="8">审核：</el-col>
											<el-col :span="8">批准：</el-col>
										</el-row>
										<!-- <div class="clearfix pt10 pb20">注：下结论时，将“检测结论/检测结果”栏改为“检测结论”；不下结论时，将“检测结论/检测结果”栏改为“检测结果”。</div> -->
									</div>
								</el-form>
							</el-tab-pane>
							<!-- 首页 End-->

							<!-- 检测清单 Begin-->
							<el-tab-pane label="检测清单" name="third">
								<div class="clearfix">
									<el-form inline-message :label-position="labelPosition" label-width="110px">
										<el-row>
											<el-col :span="8"></el-col>
										</el-row>
									</el-form>
								</div>
							</el-tab-pane>
							<!-- 检测清单 End-->

							<!-- 内容页 Begin-->
							<el-tab-pane label="内容页" name="fourth">
								
								
							</el-tab-pane>
							<!-- 内容页 End-->

							<!-- 封底 Begin-->
							<el-tab-pane label="封底" name="fifth">

								
							</el-tab-pane>
							<!-- 封底 End-->
							
						</el-tabs>
						
					</div>
					<div class="content-footer" v-show="firstBtn">
							<!--首页按钮事件-->
							<el-button type="primary" v-show="secondBtn" @click="submitForm">保存</el-button>
							<!--检测清单按钮事件-->
							<el-button type="primary" v-show="thirdBtn" @click="testListSubmit">保存</el-button>
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
				basic_url: Config.dev_url,
				selectData: [],
				reportTemplate:{
					RE_TYPE: '1027',
				},
				reportIndex:{
					INSPECT_RESULT: '',
					WORKORDER_PROJECTList:[],//检测项目
				},
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
				activeName: 'first', //tabs
				activeNames: ['1','2','3','4','5'],//手风琴数量
				labelPosition: 'right', //表格
				isEditing: true,
				pageDisable: false,
				rules: {
					RE_TYPE: [{ required: true, message: '请选择', trigger: 'change' }],//选择报告模板类型
				},
			};
		},
		methods: {
			//TAbs页切换事件判断按钮显示
			handleClick(tab, event) {
				var activeName = event.target.getAttribute('id');//获取当前tabID名
				if(activeName=='tab-first') {//判断按钮显示问题，封面都不显示
					this.firstBtn = false;
				}else if(activeName=='tab-second') {//判断按钮显示问题，首页显示保存和取消
					this.firstBtn = true;
					this.secondBtn = true;
					this.thirdBtn = false;
					this.fourthBtn = false;
					this.fifthBtn = false;
				}else if(activeName=='tab-third') {//判断按钮显示问题，检查清单显示保存和取消
					this.firstBtn = true;
					this.secondBtn = false;
					this.thirdBtn = true;
					this.fourthBtn = false;
					this.fifthBtn = false;
				}else if(activeName=='tab-fourth') {//判断按钮显示问题，内容页显示生成内容页文档和取消
					this.firstBtn = true;
					this.secondBtn = false;
					this.thirdBtn = false;
					this.fourthBtn = true;
					this.fifthBtn = false;
				}else if(activeName=='tab-fifth') {//判断按钮显示问题，封底显示生成生成检验/检测报告和取消
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
					console.log(res);
					this.selectData = res.data.data;
				});
			},
			//清空表单
			reset(){
					this.reportIndex = {
										
				};
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
			showDialog(id){
				this.show = true;
				this.detailId = id;
				this.requestData();
			},
			requestData(){
				var url = this.basic_url + '/api-apps/app/workorder/operate/taskdeal?WORKORDERID='+this.detailId;
				this.$axios.get(url, {}).then((res) => {
					this.reportIndex = res.data.datas;//报告首页
					console.log(res.data.datas);
				}).catch((wrong) => {});
			},
			
			// 首页按钮事件保存users/saveOrUpdate
			submitForm() {
				this.$refs.reportIndex.validate((valid) => {
				if (valid) {
					var url = this.basic_url + '/api-apps/app/workorder/saveOrUpdate';
					this.$axios.post(url,this.reportIndex).then((res) => {
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							this.show = false;
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
			//检测清单按钮事件
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
		},
	}
</script>

<style>
	@import '../../assets/css/mask-modules.css';

	/* .el-tabs__content { min-height: 680px;} */
</style>
