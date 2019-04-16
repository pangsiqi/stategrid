<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title">任务处理</div>
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
					<!-- status-icon 验证后文本框上显示对勾图标 -->
					<el-form inline-message :model="workorderForm" :label-position="labelPosition" :rules="rules" ref="workorderForm" label-width="110px">
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<!-- 样品信息列表 Begin-->
								<div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion>
									<el-tabs v-model="activeName" @tab-click="handleClick">
										<el-tab-pane label="检测项目与要求" name="first">
											<div class="table-func table-funcb">
												<el-button style="float:left;" type="success" size="mini" round @click="viewModule" v-show="!pageDisable">
													<i class="icon-edit"></i><font>查看所有模板</font>
												</el-button>
											</div>
							            	<el-table :data="workorderForm.WORKORDER_PROJECTList" border stripe :fit="true" max-height="260" @cell-click="iconOperation" style="width: 100%;" :default-sort="{prop:'workorderbasisList', order: 'descending'}">
												<el-table-column prop="P_DESC" label="检测项目名称" sortable>
												</el-table-column>
							            		<el-table-column prop="REMARKS" label="技术要求" sortable>
												</el-table-column>
												<el-table-column prop="UNIT" label="计量单位" sortable>
												</el-table-column>
												<el-table-column label="样品序号" sortable>
													<template slot-scope="scope">
														<el-button type="primary" size="mini" round @click="addRemark(scope.$index,scope.row)" :disabled="pageDisable||scope.row.WONUM!=workorderForm.WONUM">添加结果</el-button>
													</template>
												</el-table-column>
												<el-table-column prop="ISQUALIFIED" label="不合格类别" sortable>
													<template slot-scope="scope">
														<el-select v-model="scope.row.ISQUALIFIED" placeholder="请选择" :disabled="pageDisable||scope.row.WONUM!=workorderForm.WONUM">
															<el-option key="1" label="不合格" value="1"></el-option>
															<el-option key="2" label="A类不合格" value="2"></el-option>
															<el-option key="3" label="B类不合格" value="3"></el-option>
														</el-select>
													</template>
												</el-table-column>
							            		<el-table-column prop="VERSION" label="模板" sortable>
													<template slot-scope="scope">
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.VERSION" placeholder="请输入" :disabled="pageDisable">	
														</el-input>
													</template>
												</el-table-column>
												<el-table-column prop="INSPECT_DATE" label="检测日期" sortable>
													<template slot-scope="scope">
														<div class="block">
															<el-date-picker v-model="scope.row.INSPECT_DATE" type="date" placeholder="请选择" style="width: 100%" value-format="yyyy-MM-dd" :disabled="pageDisable||scope.row.WONUM!=workorderForm.WONUM">
															</el-date-picker>
														</div>
													</template>
												</el-table-column>
							            	</el-table>
										</el-tab-pane>
										<el-tab-pane label="分包项目与要求" name="second">
							            	<el-table :data="workorderForm.WORKORDER_CONTRACTList" border stripe :fit="true" max-height="260" @cell-click="iconOperation" style="width: 100%;" :default-sort="{prop:'workorderbasisList', order: 'descending'}">
												<el-table-column prop="P_REMARKS" label="检测项目名称" sortable>
												</el-table-column>
							            		<el-table-column prop="TECHNICAL_REQUIRE" label="技术要求" sortable>
												</el-table-column>
												<el-table-column prop="UNIT" label="计量单位" sortable>
												</el-table-column>
												<el-table-column prop="UNIT" label="样品序号" sortable>
													<template slot-scope="scope">
														<el-button type="primary" size="mini" round @click="addRemark(scope.$index,scope.row,'contract')" :disabled="pageDisable||scope.row.WONUM!=workorderForm.WONUM">添加结果</el-button>
													</template>
												</el-table-column>
												<el-table-column prop="ISQUALIFIED" label="不合格类别" sortable>
													<template slot-scope="scope">
														<el-select v-model="scope.row.ISQUALIFIED" placeholder="请选择" :disabled="pageDisable||scope.row.WONUM!=workorderForm.WONUM">
															<el-option key="1" label="不合格" value="1"></el-option>
															<el-option key="2" label="A类不合格" value="2"></el-option>
															<el-option key="3" label="B类不合格" value="3"></el-option>
														</el-select>
													</template>
												</el-table-column>
							            		<el-table-column prop="VERSION" label="模板" sortable>
													<template slot-scope="scope">
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.VERSION" placeholder="请输入" :disabled="pageDisable">	
														</el-input>
													</template>
												</el-table-column>
												<el-table-column prop="INSPECT_DATE" label="检测日期" sortable>
													<template slot-scope="scope">
														<div class="block">
															<el-date-picker v-model="scope.row.INSPECT_DATE" type="date" placeholder="请选择" style="width: 100%" value-format="yyyy-MM-dd" :disabled="pageDisable||scope.row.WONUM!=workorderForm.WONUM">
															</el-date-picker>
														</div>
													</template>
												</el-table-column>
							            	</el-table>
										</el-tab-pane>
										
										<el-tab-pane label="检验检测设备" name="three">
											<div class="table-func table-funcb">
												<el-button style="float:left;" type="success" size="mini" round @click="addEquiptLine" v-show="!pageDisable">
													<i class="icon-add"></i><font>新建行</font>
												</el-button>
											</div>
											<el-table :data="workorderForm.WORKORDER_ASSETList" row-key="ID" border stripe :fit="true" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'dataInfo.INSPECT_PROXY_BASISList', order: 'descending'}">
												<el-table-column label="设备编号" sortable prop="ASSETNUM">
													<template slot-scope="scope">
														<el-input size="small" v-model="scope.row.ASSETNUM" disabled>
															<el-button slot="append" icon="el-icon-search" @click="chooseEquipt(scope.$index,scope.row)" :disabled="scope.row.ISUSE=='1' || pageDisable"></el-button>
														</el-input>
													</template>
												</el-table-column>
												<el-table-column prop="DESCRIPTION" label="设备名称" sortable >
												</el-table-column>
												<el-table-column prop="START_TIME" label="开始使用时间" sortable width="200px">
													<template slot-scope="scope">
														<el-date-picker v-model="scope.row.START_TIME" type="date" placeholder="请选择" style="width: 100%" value-format="yyyy-MM-dd" :disabled="scope.row.ISUSE=='1'||pageDisable">
														</el-date-picker>
													</template>
												</el-table-column>
												<el-table-column prop="END_TIME" label="截止使用时间" sortable width="200px">
													<template slot-scope="scope">
														<el-date-picker v-model="scope.row.END_TIME" type="date" placeholder="请选择" style="width: 100%" value-format="yyyy-MM-dd" :disabled="scope.row.ISUSE=='1'||pageDisable">
														</el-date-picker>
													</template>
												</el-table-column>
												<el-table-column label="操作">
													<template slot-scope="scope">
														<el-button title="删除" @click="delEquipt(scope.$index,scope.row)" type="text" size="small" v-if="scope.row.ISUSE=='0'||!pageDisable">
															<i class="icon-trash red"></i>
														</el-button>
													</template>
												</el-table-column>
											</el-table>
										</el-tab-pane>

										<el-tab-pane label="成果数据" name="four">
											<div class="table-func table-funcb">
												<form method="post" id="file" action="" enctype="multipart/form-data" style="float: left; margin-left: 10px; position: relative;">
													<el-button type="success" size="mini" round class="a-upload" v-show="!pageDisable">
														<i class="el-icon-upload2"></i><font>上传</font>
														<input id="excelFile" type="file" name="uploadFile" @change="upload"/>
													</el-button>
												</form>
											</div>
											<el-row>
												<el-col :span="24">
													<el-table :data="workorderForm.WORKORDER_DATA_TEMPLATEList" 
														  border 
														  stripe 
														  :fit="true" 
														  max-height="260" 
														  style="width: 100%;">
														<el-table-column label="检验责任人" sortable prop="LIABLE_PERSONDesc">
													    </el-table-column>
									            		<el-table-column label="文件名称" prop="FILESIZE_ORG">
														</el-table-column>
														<el-table-column label="文件大小" prop="FILESIZE">
														</el-table-column>
														<el-table-column label="操作" v-show="!pageDisable">
															<template slot-scope="scope">
															 	<el-button title="预览" @click="readFile(scope.row)" type="text" size="small"> 
																	<i class="icon-excel"></i>
																</el-button>
																<el-button title="编辑" type="text" size="small" @click="editFile(scope.row)"  v-show="!(!!scope.row.CONTRACTID&&scope.row.CONTRACTID==-1)||scope.row.WONUM==this.submitForm.WONUM">
																	<i class="icon-pencil"></i>
																</el-button>
																<el-button title="删除" @click="delFile(scope.$index,scope.row)" type="text" size="small"  v-show="!(!!scope.row.CONTRACTID&&scope.row.CONTRACTID==-1)||scope.row.WONUM==this.submitForm.WONUM">
																	<i class="icon-trash red"></i>
																</el-button>
															</template>
														</el-table-column>
									            	</el-table>
												</el-col>
											</el-row>
										</el-tab-pane>
									</el-tabs>
								</div>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="!pageDisable">
							<el-button type="primary" @click="submitForm">保存</el-button>
							<el-button type="success" @click="startup">提交审核</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
		</div>
		<!-- 相关序号添加备注 -->
		<el-dialog :modal-append-to-body="false" :visible.sync="sampleListVisible" width="60%" :before-close="resetSample">
			<el-table ref="table" 
				:data="sampleNumList" 
				border 
				stripe 
				:fit="true" 
				style="width: 100%;" 
				:default-sort="{prop:'workorderbasisList', order: 'descending'}">
				<el-table-column label="样品序号" sortable prop="ITEM_STEP" >
				</el-table-column>
				<el-table-column label="样品备注" sortable prop="OTHER">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.MEMO"></el-input>
					</template>
				</el-table-column>
			</el-table>	
			<div slot="footer">
				<el-button type="primary" @click="submitSample">确 定</el-button>
				<el-button @click="resetSample">取 消</el-button>
			</div>
		</el-dialog>
		<dataTemplate ref="dataTemplate"></dataTemplate>
		<equiptDialog ref="equiptDialog" @setData="setEquipt" :projectList="workorderForm.WORKORDER_PROJECTList" :pro_num="workorderForm.PRO_NUM" :num="workorderForm.P_NUM"></equiptDialog>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import { Loading } from 'element-ui'
	import dataTemplate from '../common/common_mask/dataTemplate.vue'//检验依据
	import equiptDialog from '../common/common_mask/equiptDialog.vue'//检验依据
	export default {
		name: 'masks',
		components: {
			'dataTemplate': dataTemplate,
			'equiptDialog': equiptDialog
		},
		data() {
			var validateProxynum = (rule, value, callback) => {//委托书编号
                if (this.workorderForm.PROXYNUM === undefined || this.workorderForm.PROXYNUM === '' || this.workorderForm.PROXYNUM === null) {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
			var validateProxyversion = (rule, value, callback) => {//委托书版本
                if (this.workorderForm.PROXY_VERSION === undefined || this.workorderForm.PROXY_VERSION === '' || this.workorderForm.PROXY_VERSION === null) {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
			var validateItemname = (rule, value, callback) => {//样品名称
                if (this.workorderForm.ITEM_NAME === undefined || this.workorderForm.ITEM_NAME === '' || this.workorderForm.ITEM_NAME === null) {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
			var validateItemname = (rule, value, callback) => {//规格型号
                if (this.workorderForm.ITEM_MODEL === undefined || this.workorderForm.ITEM_MODEL === '' || this.workorderForm.ITEM_MODEL === null) {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
			var validateItemnum = (rule, value, callback) => {//样品编号
                if (this.workorderForm.ITEMNUM === undefined || this.workorderForm.ITEMNUM === '' || this.workorderForm.ITEMNUM === null) {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
			return {
				sampleNumList: [],
				file_url: Config.file_url,
				po_url: Config.po_url,
				dialogVisible2:false,
				workorderForm: {
					PROJ_NUM:'',
					WORKORDER_BASISList:[],//检测依据
					WORKORDER_PROJECTList:[],//检测项目
					WORKORDER_CHECKPERSONList:[],//检验员信息
					WORKORDER_DATA_TEMPLATEList:[],//原始数据模板
					WORKORDER_REPORT_TEMPLATEList:[],//报告模板
					WORKORDER_ASSETList:[],//检验检测设备
					WORKORDER_REPORTList:[],//报告
					WORKORDER_CONTRACTList:[],//分包项目
				},
				basic_url: Config.dev_url,
				loadSign:true,//加载
				commentArr:{},
				show: false,
				isok1: true,
				isok2: false,
				up: false,
				noedit:false,
				activeName: 'first', //tabs
				activeNames: ['1','2','3','4','5','6','7'],//手风琴数量
				labelPosition: 'right', //表格
				selectData:[],//承检单位
				fileList:[],//上传附件数据
				rules: {
					PROXYNUM: [{ required: true, validator: validateProxynum}],//委托书编号
					PROXY_VERSION: [{ required: true, validator: validateProxyversion}],//委托书版本
					WONUM: [{ required: true, message: '不能为空', trigger: 'blur' }],
					ITEM_NAME: [{ required: true,validator: validateItemname}],//样品名称
					ITEM_MODEL: [{ required: true,validator: validateItemname}],//规格型号
					ITEMNUM: [{ required: true,validator: validateItemnum}],//样品编号
					// ITEM_STATU: [{ required: true, message: '不能为空', trigger: 'blur' }],
					ITEM_STATUS: [{ required: true, message: '不能为空', trigger: 'blur' }],
					ITEM_SOURCE: [{ required: true, message: '不能为空', trigger: 'change' }],
					ITEM_QUALITY: [{ required: true, message: '不能为空', trigger: 'blur' }],
					CHECK_BASIS: [{ required: true, message: '不能为空', trigger: 'blur' }],
					COMPLETE_DATE: [{ required: true, message: '不能为空', trigger: 'blur' }],
					COMPLETE_MODE: [{ required: true, message: '不能为空', trigger: 'blur' }],
					ITEM_RECEPT_STATUS: [{ required: true, message: '不能为空', trigger: 'blur' }],
					ITEM_PROFESSIONAL_GROUP: [{ required: true, message: '不能为空', trigger: 'blur' }],
					STATUS: [{ required: true, message: '不能为空', trigger: 'blur' }],
				},
				//tree
				isEditList: false,  //年度计划列表编辑装填
				userList:[],
				numtips:'',
				isEditing: true,
				modulenum:'',
				username:'',
				maingroup:[],//专业组
				docParm: {},
				reportname:'',//生成报告名称
				btnshow:true,//报告提交按钮
				pronums:[],
				showcreatereoprt:false,//生成报告按钮
				currentuserinfo:{},//储存当前用户信息
				addPersonTable: '',
				sampleListVisible: false,
				editEquptIndex: 1,
				editStepIndex: 1,
				stepType: '',
				detailId: 0,
				pageDisable: false
			};
		},
		methods: {
			startup(){
				var url = this.basic_url + '/api-apps/app/workorder/flow/'+this.detailId;
				this.$axios.get(url, {}).then((res) => {
					if(res.data.resp_code == 1) {
						this.$message({
							message:res.data.resp_msg,
							type: 'warning'
						});
				    }else{
				    	this.$message({
							message:res.data.resp_msg,
							type: 'success'
						});
				    }
				});
			},
			readFile(row){
				var url = this.po_url+"/show?filename=" +row.filename
					+ '&fileid=' +  row.FILEID
					+ '&userid=' +  this.docParm.userid
					+ '&username=' + this.docParm.username
					+ '&deptid=' + this.docParm.deptid
					+ '&deptfullname=' + this.docParm.deptfullname
					+ '&recordid=' + this.detailId
					+ '&appname=工作任务单_关联原始数据模板&appid=39&fileedit=0&fileprint=0&fileread=1&fileduplicate=0';
				 window.open(url); 
			},
			editFile(row){
				var url = this.po_url+"/show?filename=" +row.filename
					+ '&fileid=' +  row.FILEID
					+ '&userid=' +  this.docParm.userid
					+ '&username=' + this.docParm.username
					+ '&deptid=' + this.docParm.deptid
					+ '&deptfullname=' + this.docParm.deptfullname
					+ '&recordid=' + this.detailId
					+ '&appname=工作任务单_关联原始数据模板&appid=39&fileedit=1&fileprint=0&fileread=1&fileduplicate=0';
				 window.open(url); 
			},
			delFile(index,row){
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/workorder/WORKORDER_DATA_TEMPLATE/' + row.ID;
					this.$axios.delete(url, {}).then((res) => {
						if(res.data.resp_code == 0){
							this.workorderForm.WORKORDER_DATA_TEMPLATEList.splice(index,1);
							this.$message({
								message: '删除成功',
								type: 'success'
							});
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'error'
							});
						}
					}).catch((err) => {});
				}else{
					this.workorderForm.WORKORDER_DATA_TEMPLATEList.splice(index,1);
				}
			},
			delEquipt(index,row){

			},
			setEquipt(data){
				var index = this.editEquptIndex;
				this.workorderForm.WORKORDER_ASSETList[index].ASSETNUM = data.ASSETNUM;
				this.workorderForm.WORKORDER_ASSETList[index].DESCRIPTION = data.DECRIPTION;
			},
			viewModule(){
				this.$refs.dataTemplate.showData(this.deptid);
			},
			addRemark(index, row, opt){
				this.editStepIndex = index;
				this.sampleListVisible = true;
				this.stepType = opt;
				if(opt == 'contract'){
					this.sampleNumList = row.WORKORDER_CONTRACT_ITEMList;
				}else{
					this.sampleNumList = row.WORKORDER_PROJECT_ITEMList;
				}
			},
			submitSample(){
				var index = this.editStepIndex;
				if(this.stepType == 'contract'){
					this.workorderForm.WORKORDER_CONTRACTList[index].WORKORDER_CONTRACT_ITEMList = this.sampleNumList;
				}else{
					this.workorderForm.WORKORDER_PROJECTList[index].WORKORDER_PROJECT_ITEMList = this.sampleNumList;
				}
				this.resetSample();
			},
			resetSample(){
				this.sampleListVisible = false;
				this.sampleNumList = [];
			},
			addFileLine(){
				var obj = {
					ASSETNUM: '',
					DESCRIPTION: '',
					START_TIME: '',
					END_TIME: '',
				};
				this.workorderForm.WORKORDER_ASSETList.push(obj);
			},
			addEquiptLine(){
				var obj = {
					isEditing: false,
					ASSETNUM: '',
					DESCRIPTION: '',
					START_TIME: '',
					END_TIME: '',
					ISUSE: 0,
					ISCHOISE: 1
				};
				this.workorderForm.WORKORDER_ASSETList.push(obj);
			},
			chooseEquipt(index,row){
				this.editEquptIndex = index;
				this.$refs.equiptDialog.showData();
			},
			showDialog(id){
				this.detailId = id;
				this.requestData('showDialog');
			},
			requestData(opt){
				var url = this.basic_url + '/api-apps/app/workorder/operate/taskdeal?WORKORDERID='+this.detailId;
				this.$axios.get(url, {}).then((res) => {
					this.workorderForm = res.data.datas;
					this.workorderForm.WORKORDER_DATA_TEMPLATEList = this.workorderForm.WORKORDER_DATA_TEMPLATEList.splice(0,1);
					console.log(this.workorderForm.WORKORDER_DATA_TEMPLATEList);
					if(opt == 'showDialog'){
						this.show = true;
					}
					if(res.data.datas.STATE == '1'){
						this.pageDisable = false;
					}else{
						if(res.data.datas.STATE == '0'){
							var url2 = this.basic_url +  '/api-apps/app/workorder/flow/Executors/25';
							this.$axios.get(url2, {}).then((res) => {
								if(res.data.resp_code == 0){
									var resData =res.data.datas;
									var userid = this.userid;
									for (var i = 0; i < resData.length; i++) {
										if(userid == resData[i].id){
											this.pageDisable = false;
										}else{
											this.pageDisable = true;
										}
									}
								}
								
							}).catch((wrong) => {});
						}else{
							this.pageDisable = true;
						}
					}
				}).catch((wrong) => {});
			},
			downLoadRow(row){
				if(row.FILECHECKED){
					var url = row.FILEPATH 
                        + '&userid=' + this.docParm.userid
                        + '&username=' + this.docParm.username
                        + '&deptid=' + this.docParm.deptids
                        + '&deptfullname=' + this.docParm.deptfullname;
                	window.open(url);
				}else if(row.FILE_ORGCHECKED){
					var url = row.FILEPATH_ORG 
                        + '&userid=' + this.docParm.userid
                        + '&username=' + this.docParm.username
                        + '&deptid=' + this.docParm.deptid
                        + '&deptfullname=' + this.docParm.deptfullname;
                	window.open(url);
				}else{
					this.$message({
						message: '请选择要下载的文件',
						type: 'error'
					});
				}
			},
			deleteTempRow(index,row){
				if(row.FILECHECKED){
					var url = this.file_url + '/file/deleteFile/' + row.FILEID;
					this.$axios.delete(url,{}).then((res) => {
						if(res.data.code == 1){
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							row.FILEID = 0;
							row.FILECHECKED = false;
							row.FILEPATH = '';
							row.FILESIZE = 	'';
						}else{
							this.$message({
								message: '删除失败',
								type: 'error'
							});
						}
					}).catch((err) => {
					});
				}else if(row.FILE_ORGCHECKED){
					this.$message({
						message: '模板文件不允许删除',
						type: 'error'
					});
				}else{
					this.deleteRow(index, row, 'moduleList');
				}
			},
			upload(e){
				var formData = new FormData();
				var loading;
				loading = Loading.service({
					fullscreen: true,
					text: '拼命上传中...',
					background: 'rgba(F,F, F, 0.8)'
				});
				formData.append('files', document.getElementById('excelFile').files[0]);
				var config = {
					//添加请求头
					headers: { "Content-Type": "multipart/form-data" },
					//添加上传进度监听事件
					onUploadProgress: e => {
						var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
						this.progress = completeProgress;
					}
				};
				var url = '';
				var url = this.file_url + '/file/uploadfile?userid=' + this.docParm.userid 
						+ '&username=' + this.docParm.username
						+ '&deptid=' + this.docParm.deptid
						+ '&deptfullname=' + this.docParm.deptfullname
						+ '&recordid=' + this.detailId
						+ '&appname=' + this.docParm.appname
						+ '&appid=' + this.docParm.appid;
				this.$axios.post(url, formData, config
				).then((res)=>{
					loading.close();
					if(res.data.code == 0){
						this.$message({
							message: res.data.message,
							type: 'error'
						});
					}else{
						this.$message({
							message: '文件已成功上传至服务器',
							type: 'success'
						});
						var obj = {
							FILEID: res.data.fileid,
							FILESIZE: res.data.filesize,
							FILEPATH: res.data.webUrl,
							LIABLE_PERSONDesc: this.username,
							LIABLE_PERSON: this.userid,
							CONTRACTID: ''
						};
						this.workorderForm.WORKORDER_DATA_TEMPLATEList.push(obj);
					}
				})
			},
			reset(){
            	this.workorderForm = {
					PROXYNUM: '',//委托书编号
					PROXY_VERSION: '',//委托书版本
					PARENT_NUM: '',//父任务单编号
					IS_MAIN: '',//主任务单？
					MASTER_INSPECTOR: '',//主检员
					CJDW:'',//承检单位
					STATE: '',//信息状态
					STATUS: '',//状态
					WONUM: '',//工作任务单编号
					ITEM_NAME: '',//样品名称
					ITEM_MODEL: '',//规格型号
					ITEM_TRADEMARK: '',//商标标识
					ITEMNUM: '',//样品编号
					CHECK_DATE: '',//抽样日期
					PRODUCT_DATE: '',//生产日期/批
					ITEM_STATU: '',//填写的样品状态
					ITEM_STATUS: '',//选择的样品状态
					ARRIVAL_DATE: '',//到站日期
					ITEM_QUALITY: '',//样品数量
					ITEM_SOURCE: '',//样品来源
					CHECK_BASIS: '',//抽样方案/判定依据
					TECHNICAL_INFORMATION: '',//委托方提供技术资料
					SPECIAL_REQUIREMENTS: '',//特殊要求
					ITEM_RECCEPT_USER: '',//样品接收人
					ITEM_RECEPT_DATE: '',//样品接收日期
					COMPLETE_DATE: '',//完成日期
					COMPLETE_MODE: '',//完成方式
					ITEM_RECEPT_STATUS: '',//样品接收状态
					ITEM_PROFESSIONAL_GROUP: '',//样品承接人(专业组)
					UNDERTAKE_DATE: '',//样品承接日期
					ITEM_RETURN_QUALITY: '',//样品返回数量
					RETURN_ITEM_USER: '',//样品返回接收人
					RETURN_ITEM_DATE: '',//样品返回日期
					ITEM_CHECK_STATUS: '',//样品检后状态
					ITEM_MANAGEMENT: '',//样品处置
					ITEM_UNDERTAKE_USER: '',//样品承接人
					PROFESSIONAL: '',//专业技术/质量负责人
					CHECK_BASIS: '',//报告模板
					SEND: '',//是否寄出
					FILE: '',//是否归档
					SEND_DATE: '',//寄出时间
					FILE_DATE: '',//归档时间
					ENTERBY: '',//录入人
					ENTERDATE: '',//录入时间
					ORG_CODE: '',//录入人机构
					CHANGEBY: '',//修改人
					CHANGEDATE: '',//修改时间
					STATEDesc:'草稿',
					STATE:'1',
					WORKORDER_BASISList:[],//检测依据
					WORKORDER_PROJECTList:[],//检测项目
					WORKORDER_CHECKPERSONList:[],//检验员信息
					WORKORDER_DATA_TEMPLATEList:[],//原始数据模板
					WORKORDER_ASSETList:[],//检验检测设备
					WORKORDER_REPORT_TEMPLATEList:[],//报告模板
					WORKORDER_REPORTList:[],//报告
					WORKORDER_CONTRACTList:[],//分包项目					
				};
				this.editEquptIndex = 1;
				this.editStepIndex = 1;
				this.detailId = 0;
				this.pageDisable = false;
				this.pronums = [];//检测项目编号字符串
			},
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing;
				}
			},
			handleClick(tab, event) {

		   	},
			addperson(num,opt){
				//opt主要是区是哪个子表添加人员
				this.getuser();
				this.numtips = num;
				this.addPersonTable = opt;
				this.dialogVisible2 = true;
			},
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
			//承检单位带出样品承接人(专业组)
			RVENDORSelect(RVENDORid){
				var url = this.basic_url + '/api-user/depts/findByPid/'+RVENDORid;
					this.$axios.get(url, {}).then((res) => {
						this.maingroup = res.data;
					}).catch((err) => {
					});
				this.workorderForm.PRODUCT_TYPE = '';
				this.workorderForm.P_NUM = '';
				this.workorderForm.PRODUCT = '';
				this.workorderForm.PRO_NUM = '';
				this.workorderForm.S_NUM = '';
				this.workorderForm.WORKORDER_BASISList = [];
				this.workorderForm.WORKORDER_PROJECTList    = [];
				ITEM_PROFESSIONAL_GROUP:'';//清空承接人数据
			},
			 //模版编号
            templateNumber(item){
				if((item.DATA_TYPE == '2')&&(this.workorderForm.WORKORDER_PROJECTList==''||this.workorderForm.WORKORDER_PROJECTList==null||this.workorderForm.WORKORDER_PROJECTList==undefined)){
					this.$message({
						message: '请先选择检测项目与要求',
						type: 'warning'
					});
				}else{
					this.modulenum = item;
					var data = [];
					var datatype = item.DATA_TYPE;
					data.push(this.workorderForm.PROJ_NUM);
					data.push(this.workorderForm.WORKORDER_DATA_TEMPLATEList);
					data.push(datatype);
					this.$refs.templatechild.visible(data);
					data = [];
				}
            },
      		//刪除新建行
			deleteRow(index, row, listName){
				console.log(row);
				var TableName = '';
				console.log(listName);
				if(listName =='basisList'){
					TableName = 'WORKORDER_BASIS';
				}else if(listName =='projectList'){
					TableName = 'WORKORDER_PROJECT';
				}else if(listName =='peopletList'){
					TableName = 'WORKORDER_CHECKPERSON';
				}else if(listName =='moduleList'){
					TableName = 'WORKORDER_DATA_TEMPLATE';
				}else{
					TableName = 'WORKORDER_ASSET';
				}
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/workorder/' + TableName +'/' + row.ID;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {}).then((res) => {
							if(res.data.resp_code == 0){
								this.workorderForm[TableName+'List'].splice(index,1);
								this.$message({
									message: '删除成功',
									type: 'success'
								});
							}else{
								this.$message({
									message: res.data.resp_msg,
									type: 'error'
								});
							}
						}).catch((err) => {
						});
					}).catch(() => {

					});
				}else{
					this.workorderForm[TableName+'List'].splice(index,1);
				}
			},
			//原始数据模版
			addfield4(){
				var obj = {
					DATA_TYPE:'',
					D_NUM:'',
					D_DESC: '',
					STATUS: '1',
					isEditing: true,
					FILEID: '',
					FILEPATH: '',
					FILESIZE: '',
					FILEID_ORG: '',
					FILEPATH_ORG: '',
					FILESIZE_ORG: '',
					FILECHECKED: false,
					FILE_ORGCHECKED: false,
				};
				this.workorderForm.WORKORDER_DATA_TEMPLATEList.push(obj);
			},
			//生成报告
			getreport(){
				console.log(this.reportname);
				if(this.workorderForm.WORKORDER_DATA_TEMPLATEList.length < 2){
					this.$message({
						message: '请新建至少两条数据',
						type: 'warning'
					});
				}else if(this.workorderForm.WORKORDER_REPORTList.length>0){
					this.$message({
						message: '检验报告已经生成，请勿重复生成',
						type: 'warning'
					});
				}else{
					var changeUser = this.workorderForm.WORKORDER_DATA_TEMPLATEList;
					//basisnum为依据编号的数组
					var id = [];
					for (var i = 0; i < changeUser.length; i++) {
						id.push(changeUser[i].FILEID);		
					}
					//basisnums为basisnum数组用逗号拼接的字符串
					var ids = id.toString(',');
					console.log(ids);
					if(ids == '' || ids == undefined || ids == null){
						this.$message({
							message: '请上传文件',
							type: 'warning'
						});
					}else if(this.reportname == '' || this.reportname == undefined || this.reportname == null){
						var data = [];
						data.push(this.workorderForm.ID);
						data.push(this.reportname);
						data.push(this.workorderForm.WORKORDER_DATA_TEMPLATEList);
						data.push(this.workorderForm.PROXYNUM);
						data.push(this.workorderForm.WONUM);
						data.push(this.workorderForm.DEPTIDDesc);
						data.push(this.workorderForm.ID);
						this.$refs.reportdata.visible(data);
					}
				}
			},
			detailgetData() {
				var url = this.basic_url +'/api-apps/app/workorder/' + this.dataid;
				this.$axios.get(url, {}).then((res) => {
					//依据
					for(var i = 0;i<res.data.WORKORDER_BASISList.length;i++){
						res.data.WORKORDER_BASISList[i].isEditing = false;
					}
					//项目
					for(var i = 0;i<res.data.WORKORDER_PROJECTList.length;i++){
						res.data.WORKORDER_PROJECTList[i].isEditing = false;
					}
					//检验员
					for(var i = 0;i<res.data.WORKORDER_CHECKPERSONList.length;i++){
						res.data.WORKORDER_CHECKPERSONList[i].isEditing = false;
					}
					//原始数据
					for(var i = 0;i<res.data.WORKORDER_DATA_TEMPLATEList.length;i++){
						res.data.WORKORDER_DATA_TEMPLATEList[i].FILECHECKED = false;
						res.data.WORKORDER_DATA_TEMPLATEList[i].FILE_ORGCHECKED = false;
						res.data.WORKORDER_DATA_TEMPLATEList[i].isEditing = false;
					}
					
					for(var i = 0;i<res.data.WORKORDER_REPORTList.length;i++){
						if(res.data.WORKORDER_REPORTList[0].ISCREATED == '1'){
							this.btnshow = false;
						}
					}
					for(var i = 0;i<this.workorderForm.WORKORDER_CONTRACTList.length;i++){
						this.workorderForm.WORKORDER_CONTRACTList[i].INSPECT_GROUP = Number(this.workorderForm.WORKORDER_CONTRACTList[i].INSPECT_GROUP);
					}
					res.data.CJDW = Number(res.data.CJDW);
					res.data.ITEM_PROFESSIONAL_GROUP = Number(res.data.ITEM_PROFESSIONAL_GROUP);
					this.RVENDORSelect(res.data.CJDW);
					this.workorderForm = res.data;
					for(var i = 0;i<this.workorderForm.WORKORDER_CONTRACTList.length;i++){
						this.workorderForm.WORKORDER_CONTRACTList[i].INSPECT_GROUP = Number(this.workorderForm.WORKORDER_CONTRACTList[i].INSPECT_GROUP);
					}
					if(res.data.IS_MAIN == '1'){//是主任务单
						this.showcreatereoprt = true;//显示生成报告按钮
					}else{//不是主任务单
						this.showcreatereoprt = false;
					}
					this.show = true;
				}).catch((err) => {
				});
			},	
			// 保存users/saveOrUpdate
			submitForm() {
				this.$refs.workorderForm.validate((valid) => {
		          if (valid) {
					var url = this.basic_url + '/api-apps/app/workorder/saveOrUpdate';
					// console.log(this.workorderForm);
					this.$axios.post(url,this.workorderForm).then((res) => {
						// 
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
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');
				//this.resetNew();
			},
			reset(){

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
				$(".mask_div").height(document.body.clientHeight - 60);
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
			
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.resetBasisInfo2();
					})
					.catch(_ => {
						console.log('取消关闭');
						$('.v-modal').hide();
					});
			},
			loadMore (item) {
			    if (this.loadSign) {
			      this.loadSign = false;
			      this.page.currentPage++
			      if (this.page.currentPage > Math.ceil(this.page.totalCount/this.page.pageSize)) {
			        return
			    	}
					setTimeout(() => {
					this.loadSign = true;
					}, 1000)
					this.getuser();
			    }
			},	
			
			getuser(){
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				}
				if(!this.workorderForm.CJDW || this.workorderForm.CJDW == '' ){
					this.$message({
	                    message: '请先选择承检单位',
	                    type: 'warning'
					});
					return;
				}
				 //用户
				this.$axios.get(this.basic_url + '/api-user/users?deptId='+this.workorderForm.CJDW, {
					params: data
				}).then((res) => {
					//this.userList = res.data.data;
					this.page.totalCount = res.data.count;
					//总的页数
					let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize)
					if(this.page.currentPage >= totalPage) {
						this.loadSign = false
					} else {
						this.loadSign = true
					}
					this.commentArr[this.page.currentPage] = res.data.data
					let newarr = []
					for(var i = 1; i <= totalPage; i++) {
						if(typeof(this.commentArr[i]) != 'undefined' && this.commentArr[i].length > 0) {
							for(var j = 0; j < this.commentArr[i].length; j++) {
								newarr.push(this.commentArr[i][j])
							}
						}
					}
                    
					this.userList = newarr;
				}).catch((wrong) => {})	
			},
			getUser(){//获取当前用户信息
	            var url = this.basic_url + '/api-user/users/currentMap';
	            this.$axios.get(url, {}).then((res) => {//获取当前用户信息
				this.currentuserinfo = res.data;
				this.userid = res.data.id;
				this.username = res.data.username;
				this.deptid = res.data.deptId;
				this.deptfullname = res.data.deptName;
				this.docParm = {
					userid: res.data.id,
					username: res.data.username,
					deptid: res.data.deptId,
					deptfullname: res.data.deptName,
					appname: '工作任务单_关联原始数据模板',
					appid: '39'
				};
	            }).catch((err) => { });
        	},
			
		},
		
		mounted() {
			this.getCompany();
			this.getUser();
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
	.ml60 {margin-left: 60px;}
	.a-upload input{
		position: absolute;
		font-size: 0;
		left: 0;
		top: 0;
		opacity: 0;
		filter: alpha(opacity=0);
		cursor: pointer;
		width: 80px;
		height: 30px;
		cursor: pointer;
	}
	.upload-btn{
		color: #fff;
		background-color: #286090;
		border-radius: 4px;
		padding: 4px 10px;
		width: 85px;
		height: 34px;
		line-height: 28px;
		border: none;
		cursor: pointer;
	}
</style>
