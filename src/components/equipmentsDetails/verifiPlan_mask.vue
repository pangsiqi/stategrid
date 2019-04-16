<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
	            <div class="mask_title_div clearfix">
	            	<div class="mask_title" v-show="addtitle">添加期间核查计划</div>
					<div class="mask_title" v-show="modifytitle">修改期间核查计划</div>
					<div class="mask_title" v-show="viewtitle">查看期间核查计划</div>
	                <div class="mask_anniu">
	                    <span class="mask_span mask_max" @click="toggle">
	                        <i v-bind:class="{ 'icon-maximization': isok1, 'icon-restore':isok2}"></i>
	                    </span>
	                    <span class="mask_span" @click="close">
	                        <i class="icon-close1"></i>
	                    </span>
	                </div>
	            </div>
	            <div class="mask_content">
					<el-form inline-message :rules="rules" :model="dataInfo" ref="dataInfo" class="demo-user">
						<div class="content-accordion">
							<!-- 设备header信息 -->
							<el-collapse v-model="activeNames">
	                            <el-collapse-item title="基本信息" name="1">
	                                <el-form-item label-width="120px" v-for="item in basicInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}">

										<el-date-picker v-model="dataInfo[item.prop]" value-format="yyyy-MM-dd" v-if="item.type=='date'" :disabled="item.disabled"></el-date-picker>
	                                    <el-input v-model="dataInfo[item.prop]" :type="item.type" disabled v-if="item.type == 'input'&&item.prop == 'C_PLANNUM'" :disabled="true" placeholder="自动生成"></el-input>
										<el-input v-model="dataInfo[item.prop]" :type="item.type" disabled v-if="item.type == 'input'&&item.prop != 'C_PLANNUM'" :disabled="noedit"></el-input>
	                                </el-form-item>
	                            </el-collapse-item>

							    <el-collapse-item title="设备期间检查计划信息" name="2">
	                                <div class="table-func">
										<el-button type="warning" size="mini" round @click="addLine('tableList')" v-show="!viewtitle">
											<i class="el-icon-upload"></i>
											<font>导入</font>
										</el-button>
										<el-button type="success" size="mini" round @click="addLine" v-show="!viewtitle">
											<i class="icon-add"></i>
											<font>新建行</font>
										</el-button>
									</div>
									 <!-- :fit="true" -->
									<el-table :header-cell-style="rowClass" :data="dataInfo.tableList" row-key="ID" border stripe max-height="260" highlight-current-row style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'dataInfo.tableList', order: 'descending'}">
										<el-table-column prop="iconOperation" fixed label="" width="50px" v-if="!viewtitle">
											<template slot-scope="scope">
												<i class="el-icon-check" v-if="scope.row.isEditing"  @click="changeEdit(scope.row)"></i>
												<i class="el-icon-edit" v-else @click="changeEdit(scope.row)"></i>
											</template>
										</el-table-column>

	                                    <el-table-column type="index" sortable label="序号" width="50">
	                                    </el-table-column>

										<el-table-column label="设备编号" sortable width="120px" prop="ASSETNUM">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.ASSETNUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
													<el-select size="small" v-if="scope.row.isEditing" v-model="scope.row.ASSETNUM" filterable placeholder="请选择" @change="selChange($event,scope.row)">
														<el-option v-for="item in assets"
														:key="item.ID"
														:label="item.ASSETNUM"
														:value="item.ID">
														</el-option>
													</el-select>
	                                                <span v-else>{{scope.row.ASSETNUM}}</span>
												</el-form-item>
											</template>
										</el-table-column>

										<el-table-column label="设备名称" sortable width="120px" prop="A_NAME">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.A_NAME'">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.A_NAME" placeholder="自动获取" disabled>
	                                                </el-input>
	                                                <span v-else>{{scope.row.A_NAME}}</span>
												</el-form-item>
											</template>
										</el-table-column>

										<el-table-column label="规格型号" sortable width="120px" prop="MODEL">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.MODEL'">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.MODEL" placeholder="自动获取" disabled>
	                                                </el-input>
	                                                <span v-else>{{scope.row.MODEL}}</span>
												</el-form-item>
											</template>
										</el-table-column>

										<el-table-column label="溯源周期" sortable width="120px" prop="PM_ZQ">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.PM_ZQ'" :rules="{required: true, trigger: 'blur', message: '不能为空，且只能为数字'},">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.PM_ZQ" placeholder="请输入溯源周期">
	                                                </el-input>
	                                                <span v-else>{{scope.row.PM_ZQ}}</span>
												</el-form-item>
											</template>
										</el-table-column>

										<el-table-column label="溯源有效期" sortable width="120px" prop="PM_YXQ">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.PM_YXQ'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
													<el-date-picker v-if="scope.row.isEditing" size="small" v-model="scope.row.PM_YXQ" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
	                                                </el-date-picker>
	                                                <span v-else>{{scope.row.PM_YXQ}}</span>
												</el-form-item>
											</template>
										</el-table-column>

										<el-table-column label="计划期间核查时间" sortable width="150px" prop="C_PLAN_DATE">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.C_PLAN_DATE'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-date-picker v-if="scope.row.isEditing" size="small" v-model="scope.row.C_PLAN_DATE" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
	                                                </el-date-picker>
	                                                <span v-else>{{scope.row.C_PLAN_DATE}}</span>
												</el-form-item>
											</template>
										</el-table-column>

	                                    <el-table-column label="执行时间" sortable width="100px" prop="COMPDATE">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.COMPDATE'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-date-picker v-if="scope.row.isEditing" size="small" v-model="scope.row.COMPDATE" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
	                                                </el-date-picker>
	                                                <span v-else>{{scope.row.COMPDATE}}</span>
												</el-form-item>
											</template>
										</el-table-column>

	                                    <el-table-column prop="CHECKMEMO" label="核查结果">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.CHECKMEMO'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.CHECKMEMO" placeholder="请输入核查结果">
	                                                </el-input>
	                                                <span v-else>{{scope.row.CHECKMEMO}}</span>
												</el-form-item>
											</template>
										</el-table-column>

										<el-table-column label="操作" sortable width="80px" v-if="!viewtitle">
											<template slot-scope="scope">
												<el-button type="danger" size="mini" round @click="delLine(scope.$index,scope.row)">
													<i class="el-icon-delete"></i>
												</el-button>
											</template>
										</el-table-column>

									</el-table>
								</el-collapse-item>

								<el-collapse-item title="文件" name="3">
									<doc-table ref="docTable" :docParm = "docParm"  @saveParent = "save"></doc-table>
								</el-collapse-item>
								<el-collapse-item title="其他" name="4" v-show="!addtitle">
	                            	<el-form-item label-width="120px" v-for="item in otherInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}" v-if="item.prop=='DEPARTMENT'" v-show="dept">
	                                    <el-input v-model="dataInfo[item.prop]" :type="item.type" disabled v-if="item.prop=='DEPARTMENT'"></el-input>
	                                </el-form-item>	
	                                <el-form-item label-width="120px" v-for="item in otherInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}" v-show="views">
	                                    <el-input v-if="item.type=='input'" v-model="dataInfo[item.prop]" :type="item.type" disabled></el-input>
	                                    <el-date-picker v-model="dataInfo[item.prop]" value-format="yyyy-MM-dd" v-if="item.type=='date'" disabled style="width:100%"></el-date-picker>
	                                </el-form-item>	
	                            </el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="save('Update')">保存</el-button>
							<el-button type="success" @click="save('Submit')" v-show="addtitle">保存并继续</el-button>
							<el-button @click="close">取消</el-button>
							<!-- <el-button type="primary" @click='submitForm'>提交</el-button> -->
						</div>
					</el-form>
				</div>
				<!--底部-->
			</div>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import docTable from '../common/doc.vue'
	export default {
		name: 'masks',
		props: ['detailData'],
		components: {docTable},
		data() {
			return {
				docParm: {
					'model': 'new',
					'appname': '',
					'recordid': 1,
					'userid': 1,
					'username': '',
					'deptid': 1,
					'deptfullname': '',
					'appid': 1
				},
				rules: {
					C_PLANNUM: [
						{ required: false, trigger: 'blur', validator: this.Validators.isWorknumber},
					],
					DESCRIPTION: [
						{required: true,trigger: 'blur', message: '必填'},
						{trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					STATE: [
						{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
				},
				basicInfo: [
					{
						label: '计划编号',
						prop: 'C_PLANNUM',
						width: '30%',
						type: 'input',
						displayType: 'inline-block',
						disabled: true
					},
					{
						label: '计划描述',
						prop: 'DESCRIPTION',
						width: '30%',
						type: 'input',
						displayType: 'inline-block',
						disabled: false
					},
					{
						label: '状态',
						prop: 'STATE',
						width: '30%',
						type: 'input',
						displayType: 'inline-block',
						disabled: false
					},
				],
				otherInfo: [
                    {
                        label: '录入人',
                        prop: 'ENTERBYDesc',
                        width: '30%',
                        type: 'input',
                        displayType: 'inline-block'
                    },
                    {
                        label: '机构',
                        prop: 'DEPTIDDesc',
                        width: '30%',
                        type: 'input',
                        displayType: 'inline-block'
                    },
                    {
                        label: '录入时间',
                        prop: 'ENTERDATE',
                        width: '30%',
                        type: 'date',
                        displayType: 'inline-block'
                    },
                    {
						label: '修改人',
						prop: 'CHANGEBYDesc',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
					{
						label: '修改时间',
						prop: 'CHANGEDATE',
						width: '30%',
						type: 'date',
						displayType: 'inline-block'
					}
                ],
				basic_url: Config.dev_url,

				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				activeNames:['1', '2','3'], //手风琴数量
				dialogVisible: false, //对话框
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				selectData: [], //
				getCheckboxData: {},

				dataInfo: {
					'ID': '',
					'C_PLANNUM': '',
					'DESCRIPTION': '',
				    'STATE': '',
					'ENTERBY': '',
					'ENTERDATE': '',
					'DEPTID': '',
					'STATUS': '1',
					'tableList': []
				},
				assets: [],
				addtitle:true,
				modifytitle:false,
				viewtitle:false,
				dept:false,
				noedit:false,//可编辑
				views:false,//录入修改人信息
				noviews:true,//按钮
				modify:false,//修订
				hintshow:false,
				statusshow1:true,
				statusshow2:false,
			};
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
				return 'text-align:center'
			},
			iconOperation(row, column, cell, event){
		        if(column.property ==="iconOperation"){
		          row.isEditing = !row.isEditing
		        }
		    },
			getUser(opt){
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url,{}).then((res) => {
					if(opt=='new'){
						this.dataInfo.DEPTID = res.data.deptId;
						this.dataInfo.ENTERBY = res.data.id;
						this.dataInfo.ENTERDATE = this.getToday();
					}
					// else{
						// this.dataInfo.DEPTID = res.data.deptId;//传给后台机构id
						// this.dataInfo.CHANGEBY = res.data.id;
				        // this.dataInfo.CHANGEDATE = this.getToday();
					// }
						this.docParm.userid = res.data.id;
						this.docParm.username = res.data.username;
						this.docParm.deptid = res.data.deptId;
						this.docParm.deptfullname = res.data.deptName;
				}).catch((err) => {
				});
			},
			getToday(){
				var date = new Date();
				var str = date.getFullYear() + '-' + date.getMonth() + '-'+ date.getDate();
				var rate = this.$moment(str).format("yyyy-MM-dd")
				return rate;
			},
			selChange(val,row){//此块数据好像只能赋值一次
				var data = this.assets;
				var selData = data.filter(function(item){
					if(item.ID == val){
						return item;
					}
				});
				var pmPlan;
                var url = this.basic_url + '/api-apps/app/pmPlan?ASSETNUM' + selData[0].ASSETNUM+"&ENTERDATE_orders=desc";
					this.$axios.get(url, {}).then((res) => {
						if(res.data.code == 0){
							 pmPlan=res.data.data[0];
                                row.PM_ZQ = pmPlan.FREQUENCY;
				                row.PM_YXQ = pmPlan.PM_PLANDATE;
						}else{
							this.$message({
								message: "",
								type: 'error'
							});
						}
					}).catch((err) => {
					});
				row.A_NAME = selData[0].DESCRIPTION;
				row.MODEL = selData[0].MODEL;
			},
			changeEdit(row){
				row.isEditing = !row.isEditing;
			},
			//新建行
			addLine(){
				var obj = {
                    ASS_ID:'',
                    ASSETNUM:'',
					A_NAME:'',
					MODEL:'',
					PM_ZQ:0,
					PM_YXQ:'',
					C_PLAN_DATE: '',
					COMPDATE: '',
					CHECKMEMO: '',
					C_PLANNUM: this.dataInfo.C_PLANNUM,
					STATUS: '1',
					isEditing: true
                };
                this.dataInfo.tableList.push(obj);
			},
			
			delLine(index, row){
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/checkPlanLine/' + row.ID;
					this.$axios.delete(url, {}).then((res) => {
						if(res.data.resp_code == 0){
							this.dataInfo.tableList.splice(index,1);
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'error'
							});
						}
					}).catch((err) => {
					});
				}else{
					this.dataInfo.tableList.splice(index,1);
				}
			},
			//添加显示弹窗
			visible() {
				this.addtitle = true;
				this.modifytitle = false;
				this.viewtitle = false;
				this.dept = false;
				this.noedit = false;//表单内容
				this.views = false;//录入修改人信息
				this.noviews = true;//按钮
				this.modify = false;//修订
				this.hintshow = false;
				this.statusshow1 = true;
				this.statusshow2 = false;
				this.show = true;
				
				this.docParm = {
					'model': 'new',
					'appname': '期间核查计划',
					'recordid': 1,
					'appid': 52
				};
				this.getUser('new');
			},
			// 这里是修改
			detail() {
				var ID = this.detailData.ID;
				var url = this.basic_url + '/api-apps/app/checkPlan/' + ID;
				this.$axios.get(url, {}).then((res) => {
					this.modify = true;
					this.show = true;
					this.dataInfo = res.data;
					this.dataInfo.tableList = this.dataInfo.CHECK_PLAN_LINEList;

					this.getUser('edit');
					var _this = this;
					setTimeout(function(){
						_this.docParm.model = 'edit';
						_this.docParm.appname = '期间核查计划';
						_this.docParm.recordid = _this.dataInfo.ID;
						_this.docParm.appid = 52;
						_this.$refs.docTable.getData();
					},100);

					this.addtitle = false;
					this.modifytitle = true;
					this.viewtitle = false;
					this.dept = true;
					this.noedit = false;//表单内容
					this.views = false;//录入修改人信息
					this.noviews = true;//按钮
					this.modify = true;
					this.hintshow = false;
					this.statusshow1 = true;
					this.statusshow2 = false;
					this.show = true;
				}).catch((wrong) => {});
			},
			//这是查看
			view(dataid) {
				var url = this.basic_url + '/api-apps/app/checkPlan/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					this.dataInfo = res.data;
					this.dataInfo.tableList = this.dataInfo.CHECK_PLAN_LINEList;
				}).catch((wrong) => {});
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.dept = false;
				this.modify = true;
				this.noedit = true;//表单内容
				this.views = true;//录入修改人信息
				this.noviews = false;//按钮
				// this.dataInfo = data;
				this.show = true;	
				
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'view';
					_this.docParm.appname = '期间核查计划';
					_this.docParm.recordid = _this.dataInfo.ID;
					_this.docParm.appid = 52;
					_this.$refs.docTable.getData();
				},100);
			},
			//点击关闭按钮
			close() {
				this.resetForm();
				this.$emit('request');
				this.show = false;
			},
			resetForm(){
				this.dataInfo = {
					'ID': '',
					'C_PLANNUM': '',
					'DESCRIPTION': '',
				    'STATE': '',
					'ENTERBY': '',
					'ENTERDATE': '',
					'DEPARTMEMT': '',
					'STATUS': '1',
					'tableList': []
				};
				//this.$refs['dataInfo'].resetFields();
				// this.show = false;
			},
			toggle(e) { //大弹出框大小切换
				if(this.isok1) {
					this.maxDialog();
				} else {
					this.rebackDialog();
				}
			},
			maxDialog(e) { //定义大弹出框一个默认大小
				this.isok1 = false;
				this.isok2 = true;
				$(".mask_div").width(document.body.clientWidth);
				$(".mask_div").height(document.body.clientHeight - 70);
				$(".mask_div").css("top", "-40px");
			},

			rebackDialog() { //大弹出框还原成默认大小
				this.isok1 = true;
				this.isok2 = false;
				$(".mask_div").css("width", "80%");
				$(".mask_div").css("height", "90%");
				$(".mask_div").css("top", "0px");
			},

			save(opt) {
				var _this = this;
				var url = this.basic_url + '/api-apps/app/checkPlan/saveOrUpdate';
				this.$refs['dataInfo'].validate((valid) => {
					if(!valid && opt == 'docUpload'){
						this.$message({
							message: '请先正确填写信息，再进行文档上传',
							type: 'warning'
						});
					}
					if (valid) {
						this.dataInfo.CHECK_PLAN_LINEList = this.dataInfo.tableList;
						this.$axios.post(url, _this.dataInfo).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
								if(opt=="Update"){
									this.$emit('request');
									this.resetForm();
									this.show=false;
								}else{
									this.$emit('request');
									this.resetForm();
									this.show=true;
								}
								if(opt == 'docUpload'){
									this.docParm.recordid = res.data.datas.id;
									this.docParm.model = 'edit';
									this.$refs.docTable.autoLoad();
									this.dataInfo.ID = res.data.datas.id;
									this.dataInfo.C_PLANNUM = res.data.datas.C_PLANNUM;
								}else{
									this.$emit('request');
									this.resetForm();
								}
							}
						}).catch((err) => {
						});
						this.falg=true;
					} else {
						this.show = true;
						this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
					}
				});
			},
		},
		mounted() {
			var url = this.basic_url + '/api-apps/app/asset';
			this.$axios.get(url, {
				params: {}
			}).then((res) => {
				this.assets = res.data.data;
			}).catch((wrong) => {})
		}
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>