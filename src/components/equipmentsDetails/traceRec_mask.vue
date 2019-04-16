<template>
<!-- 溯源记录 -->
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加溯源记录</div>
						<div class="mask_title" v-show="modifytitle">修改溯源记录</div>
						<div class="mask_title" v-show="viewtitle">查看溯源记录</div>
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
					<el-form inline-message :model="dataInfo" :rules="rules" ref="dataInfo" label-width="100px" class="demo-user">
						<div class="content-accordion">
							<!-- 设备基本信息 -->
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基本信息" name="1">
									<el-row :gutter="20" class="pb10">
										<el-col :span="5" class="pull-right">
											<el-input v-model="dataInfo.RECORDNUM" :disabled="true">
												<template slot="prepend">溯源记录编号</template>
											</el-input>
										</el-col>
									</el-row>
									<el-form-item v-for="item in basicInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}" label-width="160px">
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input'" style="width: 220px;" :disabled="noedit || item.disabled" :placeholder="item.placeholder" ></el-input>

										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input'&&item.prop=='model'" style="width: 220px;" :disabled="true" :placeholder="item.placeholder" ></el-input>

										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='textarea'" :disabled="noedit" :placeholder="item.placeholder"></el-input>

										<el-date-picker v-model="dataInfo[item.prop]" value-format="yyyy-MM-dd" v-if="item.type=='date'" :disabled="noedit" :placeholder="item.placeholder" >
										</el-date-picker>

										<el-radio-group v-model="dataInfo[item.prop]" v-if="item.type=='radio'" :disabled="noedit">
											<el-radio :label="it.label" v-for="it in item.opts" :key="it.id"></el-radio>
										</el-radio-group>

										<el-select v-model="dataInfo[item.prop]" filterable :placeholder="item.placeholder" v-if="item.type == 'select'" @change="selChange" :disabled="noedit">
											<el-option v-for="item in assets"
											:key="item.ID"
											:label="item.DESCRIPTION"
											:value="item.DESCRIPTION">
											</el-option>
										</el-select>

									</el-form-item>
								</el-collapse-item>

								<el-collapse-item title="文件" name="2">
									<doc-table ref="docTable" :docParm="docParm" @saveParent="save"></doc-table>
								</el-collapse-item>

								<!-- 其他信息 -->
								<el-collapse-item title="其他" name="3" v-show="!addtitle">
									<el-form-item v-for="item in otherInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}" v-if="item.prop=='DEPARTMENT'" v-show="dept">
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.prop=='DEPARTMENT'" disabled></el-input>
									</el-form-item>	
									<el-form-item v-for="item in otherInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}" v-show="views">
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input'" disabled></el-input>
										<el-date-picker v-model="dataInfo[item.prop]" value-format="yyyy-MM-dd" v-if="item.type=='date'" disabled style="width:100%">
										</el-date-picker>
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
			var checkNum = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请输入设备价值'));
				}
				setTimeout(() => {
					if (!/^[0-9]*$/.test(value)) {
						callback(new Error('请输入数字值'));
					} else {
						callback();
					}
				}, 1000);
			};
			return {
				docParm: {
					'model': 'new',
					'appname': '',
					'recordid': 1,
					'userid': 1,
					'username': '',
					'deptid': 1,
					'deptfullname': '',
					'appname': '',
					'appid': 1
				},
				rules: {
					RECORDNUM: [
						{ required: true, trigger: 'blur', validator: this.Validators.isWorknumber},
					],
					C_NUM: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isWorknumber},
					],
					A_NAME: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					PM_MODEL: [
						{ required: true, message: '请选择', trigger: 'blur' },
					],
					PM_DATE: [
						{ required: true, message: '请选择', trigger: 'blur' },
					],
					R_CONCLUSION: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isFillTips},
					],
					A_KPI: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isFillTips},
					],
					SORUCE: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isFillTips},
					],
					R_DESC: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isFillTips},
					],
					C_PERSON: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isNickname},
					],
					C_DATE: [
						{ required: true, message: '请选择', trigger: 'blur' },
					],
					APPR_PERSON: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isNickname},
					],
					APPR_DATE: [
						{ required: true, message: '请选择', trigger: 'blur' },
					],
					S_MEMO: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isFillTips},
					],
					DESCRIPTION: [
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isFillTips},
					],
				},
				basicInfo: [
					{
						label: '设备名称',
						prop: 'A_NAME',
						width: '30%',
						type: 'select',
						placeholder: '请选择',
						displayType: 'inline-block'
					},
					{
						label: '设备编号',
						prop: 'ASSETNUM',
						width: '30%',
						type: 'input',
						placeholder: '自动获取',
						displayType: 'inline-block',
						disabled: true
					},
					{
						label: '规格型号',
						prop: 'MODEL',
						width: '30%',
						type: 'input',
						placeholder: '自动获取',
						displayType: 'inline-block',
						disabled: true
					},
					{
						label: '证书编号',
						prop: 'C_NUM',
						width: '30%',
						type: 'input',
						placeholder: '请填写',
						displayType: 'inline-block'
					},
					{
						label: '溯源日期',
						prop: 'PM_DATE',
						width: '30%',
						type: 'date',
						placeholder: '请选择',
						displayType: 'inline-block'
					},
					{
						label: '溯源方式',
						prop: 'PM_MODEL',
						width: '50%',
						type: 'radio',
						opts: [
                            {
                                label: '检定'
                            },
                            {
                                label: '核查'
                            }
                        ],
						displayType: 'inline-block'
					},
					{
						label: '设备性能指标要求',
						prop: 'A_KPI',
						width: '100%',
						type: 'textarea',
						placeholder: '请填写',
						displayType: 'inline-block'
					},
					{
						label: '指标确定来源',
						prop: 'SORUCE',
						width: '100%',
						type: 'textarea',
						placeholder: '请填写',
						displayType: 'inline-block'
					},
					{
						label: '确认内容',
						prop: 'R_DESC',
						width: '100%',
						type: 'textarea',
						placeholder: '请填写',
						displayType: 'inline-block'
					},
					{
						label: '确认结论',
						prop: 'R_CONCLUSION',
						width: '100%',
						type: 'textarea',
						placeholder: '请填写',
						displayType: 'inline-block'
					},
					{
						label: '确认人',
						prop: 'C_PERSON',
						width: '30%',
						type: 'input',
						placeholder: '请填写',
						displayType: 'inline-block'
					},
					{
						label: '确认日期',
						prop: 'C_DATE',
						width: '30%',
						type: 'date',
						placeholder: '请选择',
						displayType: 'inline-block'
					},
					{
						label: '审核人',
						prop: 'APPR_PERSON',
						width: '30%',
						type: 'input',
						placeholder: '请填写',
						displayType: 'inline-block'
					},
					{
						label: '审核时间',
						prop: 'APPR_DATE',
						width: '30%',
						type: 'date',
						placeholder: '请选择',
						displayType: 'inline-block'
					},
					{
						label: '特殊情况说明',
						prop: 'S_MEMO',
						width: '100%',
						type: 'textarea',
						placeholder: '请填写',
						displayType: 'inline-block'
					},
					{
						label: '记录描述',
						prop: 'DESCRIPTION',
						width: '100%',
						type: 'textarea',
						placeholder: '请填写',
						displayType: 'inline-block'
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
						label: '录入时间',
						prop: 'ENTERDATE',
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
				activeNames: ['1', '2','3','4'], //手风琴数量
				dialogVisible: false, //对话框
				addtitle: true, //添加弹出框titile
				modifytitle: false, //修改弹出框titile
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
					'RECORDNUM': '', 
					'DESCRIPTION': '',
					'ASSETNUM': '',
					'A_NAME': '',
					'MODEL': '',
					'PM_MODEL': '', 
					'PM_DATE': '',
					'R_CONCLUSION': '',
					'C_NUM': '',
					'A_KPI': '',
					'SORUCE': '',
					'R_DESC': '',
					'S_MEMO': '', 
					'C_PERSON': '',
					'C_DATE': '',
					'APPR_PERSON': '',
					'APPR_DATE': '',
					'STATUS': '1',	//活动1，不活动0
					'ENTERBY': '',
					'ENTERDATE': '',	
					'DEPTID': '',
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
			getUser(opt){
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url,{}).then((res) => {
					if(opt=='new'){
						this.dataInfo.DEPTID = res.data.deptId;
						this.dataInfo.ENTERBY = res.data.id;
						this.dataInfo.ENTERDATE = this.getToday();
					}
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
			getToday(){
				var date = new Date();
				var str = date.getFullYear() + '-' + date.getMonth() + '-'+ date.getDate();
				return str;
			},
			selChange(val){
				var data = this.assets;
				var selData = data.filter(function(item){
					if(item.DESCRIPTION == val){
						return item;
					}
				});
				this.dataInfo.MODEL = selData[0].MODEL;
				this.dataInfo.ASSETNUM = selData[0].ASSETNUM;
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
					'appname': '溯源记录',
					'recordid': 1,
					'appid': 51
				};
				this.getUser('new');
			},
			// 这里是修改
			detail(dataid) {
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
				this.getUser('edit');
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'edit';
					_this.docParm.appname = '溯源记录';
					_this.docParm.recordid = _this.detailData.ID;
					_this.docParm.appid = 51;
					_this.$refs.docTable.getData();
				},100);
				this.dataInfo = this.detailData;
			},
			//这是查看
			view(data) {
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.dept = false;
				this.modify = true;
				this.noedit = true;//表单内容
				this.views = true;//录入修改人信息
				this.noviews = false;//按钮
				this.dataInfo = data;
				this.show = true;	
				
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'view';
					_this.docParm.appname = '溯源记录';
					_this.docParm.recordid = _this.detailData.ID;
					_this.docParm.appid = 51;
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
					'RECORDNUM': '',
					'DESCRIPTION': '', 
					'ASSETNUM': '',
					'A_NAME': '',
					'MODEL': '',
					'PM_MODEL': '',
					'PM_DATE': '',
					'R_CONCLUSION': '',
					'C_NUM': '',
					'A_KPI': '',
					'SORUCE': '',
					'R_DESC': '',
					'S_MEMO': '', 
					'C_PERSON': '',
					'C_DATE': '',
					'APPR_PERSON': '',
					'APPR_DATE': '',
					'STATUS': '1',
					'ENTERBY': '',
					'ENTERDATE': '',	
					'DEPARTMENT': '',
				}
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
				var url = this.basic_url + '/api-apps/app/pmRecord/saveOrUpdate';
				this.$refs['dataInfo'].validate((valid) => {
					if(!valid && opt == 'docUpload'){
						this.$message({
							message: '请先正确填写信息，再进行文档上传',
							type: 'warning'
						});
					}
					if (valid) {
						this.$axios.post(url, _this.dataInfo).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
								if(opt=='Update'){
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
									this.dataInfo.RECORDNUM = res.data.datas.RECORDNUM;
								}else{
									this.$emit('request');
									this.resetForm();
								}
							}else{

							}
						}).catch((err) => {
						});
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
		},

	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>