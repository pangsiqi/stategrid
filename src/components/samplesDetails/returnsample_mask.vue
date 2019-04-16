<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加返样</div>
					<div class="mask_title" v-show="modifytitle">修改返样</div>
					<div class="mask_title" v-show="viewtitle">查看返样</div>
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
					<el-form inline-message :model="samplesForm" :label-position="labelPosition" :rules="rules" ref="samplesForm" label-width="110px" status-icon>
						<div class="accordion">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基础信息" name="1">
									<el-row :gutter="20" class="pb10">
										<el-col :span="4" class="pull-right">
											<el-input v-model="samplesForm.STATEDesc" :disabled="true">
												<template slot="prepend">状态</template>
											</el-input>
										</el-col>
										<el-col :span="6" class="pull-right">
											<el-select v-model="samplesForm.ITEM_TYPE" placeholder="样品类型" disabled>
												<el-option key="1" label="样品批次" value="1"></el-option>
												<el-option key="2" label="样品序号" value="2"></el-option>
											</el-select>
										</el-col>
									</el-row>

									<el-row >
										<el-col :span="8">
											<el-form-item label="产品类别" prop="TYPE">
												<!-- <el-select v-model="samplesForm.TYPE" placeholder="请选择类别" style="width: 100%;" :disabled="noedit">
													<el-option v-for="(data,index) in selectData" :key="index" :value="data.code" :label="data.name"></el-option>
												</el-select> -->
												<el-input v-model="samplesForm.TYPE" disabled></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="样品编号" prop="ITEMNUM">
												<el-input v-model="samplesForm.ITEMNUM" @input="getCodeInfo"  ref="itemnum"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8" v-if="samplesForm.ITEM_TYPE=='2'">
											<el-form-item label="样品序号" prop="ITEM_STEPs">
												<!-- <el-input v-model="samplesForm.ITEM_STEPs" disabled></el-input> -->
												<el-select v-model="ITEM_STEPs" multiple  @change="showQuality">
													<el-option
														v-for="item in sampleList"
														:key="item.ITEM_STEP"
														:label="item.ITEM_STEP"
														:value="item.ITEM_STEP">
													</el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="8">
											<el-form-item label="样品名称" prop="DESCRIPTION">
												<el-input v-model="samplesForm.DESCRIPTION" disabled></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="型号" prop="MODEL">
												<el-input v-model="samplesForm.MODEL" disabled></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="数量" prop="QUALITY">
												<el-input-number v-model="samplesForm.QUALITY" :min="0" :max="maxNum" label="描述文字" :disabled="noedit || samplesForm.ITEM_TYPE=='2'" style="width: 100%"></el-input-number>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="8">
											<el-form-item label="返样人" prop="RETURN_PERSONDesc">
												<el-input v-model="samplesForm.RETURN_PERSONDesc" disabled v-if="samplesForm.ITEM_TYPE=='2'"></el-input>
												<el-select v-model="samplesForm.RETURN_PERSON"  v-if="samplesForm.ITEM_TYPE=='1'" placeholder="请选择">
													<el-option
														v-for="item in rePerson"
														:key="item.id"
														:label="item.nickname"
														:value="item.id">
													</el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="返样日期" prop="RETURN_DATE">
												<el-date-picker v-model="samplesForm.RETURN_DATE" type="date" placeholder="请选择返样日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="noedit">
												</el-date-picker>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="24">
											<el-form-item label="其他资料" prop="OTHER">
												<el-input v-model="samplesForm.OTHER" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="24">
											<el-form-item label="备注" prop="MEMO">
												<el-input type="textarea" rows="5" v-model="samplesForm.MEMO":disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="其他" name="3" v-show="views">
									<el-row >
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc" label-width="110px">
												<el-input v-model="samplesForm.ENTERBYDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE" label-width="110px">
												<el-input v-model="samplesForm.ENTERDATE" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入人机构" prop="DEPTIDDesc" label-width="110px">
												<el-input v-model="samplesForm.DEPTIDDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="修改人" prop="CHANGEBYDesc">
												<el-input v-model="samplesForm.CHANGEBYDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间">
												<el-input v-model="samplesForm.CHANGEDATE" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer"  v-show="noviews">
							<el-button type="primary" @click="saveAndSubmit">保存</el-button>
							<el-button type="success" @click="saveAndUpdate">保存并继续</el-button>
							<el-button @click="close">取消</el-button>     
						</div>
					</el-form>
				</div>
			</div>
		</div>
		<!-- <usermask :tit="userMakeTit" @getSelData="getUserData" ref="usermask" ></usermask> -->
	</div>
</template>

<script>
	import Config from '../../config.js'
	// import usermask from'../common/common_mask/currentUserMask.vue'
	export default {
		name: 'collarsample_mask',
		// components: {
		// 	'usermask': usermask
		// },
		props: ['samplesForm'],
			
//			samplesForm: { //接收主表单中填写的数据信息
//				type: Object,
//				default: function() {
//					return {
//						ITEM_LINE_ID: '',//样品子表ID
//						ITEMNUM: '',//样品序号
//						QUALITY: '',//数量
//						ACCEPT_DATE: '',//收回入库时间
//						ACCEPT_PERSON: '',//样品承接人
//						APPR_PERSON: '',//处理批准人
//						APPR_DATE: '',//批准日期
//						DO_PERSON: '',//处理人
//						DO_DATE: '',//处理日期
//						MEMO: '',//备注
//						STATE: '',//状态
//						STATUS: '',//信息状态
//						ENTERBY: '',//录入人
//						ENTERDATE: '',//录入时间
//						CHANGEBY: '',//修改人
//						CHANGEDATE: '',//修改时间
//					}
//				}
//			}
//		},
		data() {
			return {
				sampleList: [],
				userMakeTit: '返样人',
				dialogVisible3: false,
				loading: false,
				loadSign: false,
				userList: [],
				maxNum: 100000,
				sampleType: '',
				falg:false,//保存验证需要的
				basic_url: Config.dev_url,
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				selectData: [], //获取检验/检测方法类别
				modify:false,//修订、修改人、修改时间
				selMenu:[],
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				dialogVisible: false, //对话框
				edit: true, //禁填
				activeNames: ['1','2'], //手风琴数量
				labelPosition: 'right', //表单标题在上方
				addtitle: true,
				modifytitle: false,
				viewtitle: false, //查看弹出框title
				views: false,
				noviews: true, //保存的按钮
				samples_itemlineForm:{//样品子表数据组
					inspectionList: []
				},
				//Tree树菜单数据
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "children",
					label: "fullname"
				},
				getCheckboxData: {},
				isEditing: '',
				commentArr:{},//下拉加载
				rules: { //定义需要校验数据的名称
					// ITEM_LINE_ID: [
					// 	{ required: true, message: '请选择样品子表ID', trigger: 'blur' }
					// ],
					ACCEPT_PERSON: [
						{ required: true, message: '请填写样品承接人', trigger: 'blur' }
					],
					ACCEPT_DATE: [
						{ required: true, message: '批准日期不能为空', trigger: 'blur' }
					],
					APPR_PERSON: [
						{ required: true, message: '请填写处理批准人', trigger: 'blur' }
					],
					APPR_DATE: [
						{ required: true, message: '请选择类别', trigger: 'change' }
					],
					QUALITY: [
						{ required: true, message: '请填写数量', trigger: 'blur' }
					],
					DO_PERSON: [
						{ required: true, message: '处理人不能为空', trigger: 'blur' }
					],
					DO_DATE: [
						{ required: true, message: '处理日期不能为空', trigger: 'blur' }
					],
				},
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				dialogsample:false,//样品编号
				dialogsamplenum:false,//样品序号
				samplesList:[],//样品编号弹出框表格数据来源
				samplenumList:[],
				rePerson: [],
				loadSign:false,
				ITEM_STEPs: [],
				commentArr:{},//下拉加载
				beforeItemNum: '',
				firstItem: true,
			};
		},
		methods: {
			// removeStep(){
			// 	this.samplesForm.QUALITY--;
			// },
			showQuality(){
				this.samplesForm.QUALITY = this.ITEM_STEPs.length;
			},
			getUserData(data){
				this.$forceUpdate();
				this.samplesForm.PERSON_PERSON = data.id;
				this.samplesForm.PERSON_PERSONDesc = data.username;
			},
			getReceive(){
				this.$axios.get(this.basic_url +'/api-apps/appCustom/getGrantPerson/'+this.samplesForm.ITEMNUM, {
					}).then((res) => {
						this.rePerson = res.data;
					}).catch((wrong) => {})
			},
			getCodeInfo(){
				if(this.samplesForm.ITEMNUM !== ''){
					var sample = {};
					var str = this.samplesForm.ITEMNUM;
					if(str.indexOf('{')!=-1){
						var sampleObj = str.slice(str.indexOf('{'),str.length);
							sample = JSON.parse(sampleObj);
					}else{
						sample.code = this.samplesForm.ITEMNUM;
					}
					//记录第一次扫描编号
					if(this.firstItem){
						this.beforeItemNum = sample.code;
						this.firstItem = false;
					}
					//判断两次扫码编号是否一致
					if(this.beforeItemNum != sample.code){
						this.$nextTick(()=> {
							this.samplesForm.ITEMNUM = this.beforeItemNum;
						});
						this.$message({
							message: '不是同一批次！',
							type: 'warning'
						});
						return;
					}
					this.$nextTick(()=> {
						this.samplesForm.ITEMNUM = sample.code;
					});
					//判断是不是已经添加
					if(!!sample.step && !!this.ITEM_STEPs && this.ITEM_STEPs.indexOf(sample.step)!='-1'){
						this.$message({
							message: '已添加！',
							type: 'warning'
						});
						return;
					}

					var url = this.basic_url + '/api-apps/appCustom/isRelateProxy';
					var data ={
						itemNum: sample.code,
						app:'itemReturn',
						ITEM_STEP: ''
					}
					if(!!sample.step){
						data.ITEM_STEP = sample.step;
					}
					this.$axios.get(url, {
						params: data
					}).then((res) => {
						if(JSON.stringify(res.data)!='{}'){
							var data = res.data;
							this.samplesForm.TYPE = data.TYPE;
							this.samplesForm.DESCRIPTION = data.DESCRIPTION;
							this.samplesForm.MODEL = data.MODEL;
							this.samplesForm.ITEM_TYPE = data.ITEM_TYPE;
							this.samplesForm.PRO_NUM = data.PRO_NUM;
							this.samplesForm.P_NUM = data.P_NUM;
							if(this.samplesForm.ITEM_TYPE == '1'){
								this.samplesForm.QUALITY = 1;
								var data = res.data;
								if(data.REMAINQUALITY == 0){
									this.$message({
										message: '暂无可领样样品！',
										type: 'warning'
									});
									return;
								}
								this.maxNum = data.REMAINQUALITY;
								this.getReceive();
							}else{
								this.samplesForm.RETURN_PERSON = data.GRANT_PERSON;
								this.samplesForm.RETURN_PERSONDesc = data.GRANT_PERSONDesc;
								if(this.samplesList.length==0){
									this.getSampleList(this.samplesForm.ITEMNUM, data.GRANT_PERSON);
								}
								if(!this.ITEM_STEPs){
									this.ITEM_STEPs = [];
								}
								if(!!sample.step){
									this.$forceUpdate();
									this.ITEM_STEPs.push(sample.step);
									this.samplesForm.QUALITY = this.ITEM_STEPs.length;
								}
							}
						}else{
							this.$message({
								message: '无可返样样品！',
								type: 'warning'
							});
						}
					}).catch((wrong) => {})
				}else{
					this.$forceUpdate();
					this.resetSamples();
				}
			},
			getSampleList(id,personid){
				this.$axios.get(this.basic_url + '/api-apps/appCustom/getCanReturnItem/' + id +'/'+personid, {}).then((res) => {
					this.sampleList = res.data;
				}).catch((err) => {});
			},
			resetSamples(){
				this.firstItem = true;
				this.beforeItemNum = '';
				this.sampleList = [];

				this.rePerson = [];

				this.samplesForm.TYPE = '';
				this.samplesForm.DESCRIPTION = '';
				this.samplesForm.RETURN_DATE = '';
				this.samplesForm.RETURN_PERSON = '';
				this.samplesForm.MODEL = '';
				this.samplesForm.ITEM_TYPE = '1';
				this.samplesForm.QUALITY = 0;

				this.maxNum = 1000;
				this.ITEM_STEPs = [];
			},
			childMethods() {//添加内容时从父组件带过来的
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					
					// this.samplesForm.DEPARTMENT=res.data.deptName;
					this.samplesForm.DEPTID = res.data.deptId;
					this.samplesForm.ENTERBY = res.data.id;
					this.samplesForm.ACCEPT_PERSON = res.data.id;
					var date=new Date();
					this.samplesForm.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					this.samplesForm.PERSON_DATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					this.samplesForm.ACCEPT_DATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					this.samplesForm.RETURN_DATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err)=>{
				})
				this.addtitle = true;
            	this.modifytitle = false;
            	this.viewtitle = false;
            	this.modify=false;
				this.show = true;
				this.noviews = true;
            	this.edit = true;
				this.noedit = false;
				this.views=false;
			},
			//这是查看
			view() {
				this.addtitle = false;
				this.viewtitle = true;
				this.modifytitle = false;
				this.views = true; //
				this.noviews = false;
				this.edit = true;
				this.noedit = true;
				this.show = true;
			},
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},

			//点击关闭按钮
			close() {
				this.show = false;
				this.resetSamples();
				this.$emit('request');
			},
			
			toggle(e) {
				if(this.isok1 == true) {
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
			//还原按钮
			rebackDialog() { //大弹出框还原成默认大小
				this.isok1 = true;
				this.isok2 = false;
				$(".mask_div").css("width", "80%");
				$(".mask_div").css("height", "90%");
				$(".mask_div").css("top", "0px");
			},
			//点击提交按钮执行保存
			save(opt){
				this.$refs.samplesForm.validate((valid) => {
					if (valid) {
						if(this.samplesForm.QUALITY == 0){
							this.$message({
								message: '数量为零，不可保存！',
								type: 'warning'
							});
							return;
						}
						if(this.samplesForm.ITEM_TYPE == '2'){
							this.samplesForm.ITEM_STEP = this.ITEM_STEPs.join(',');
						}
						this.samplesForm.RETURN_PERSON = this.samplesForm.RETURN_PERSON.toString()
						var url = this.basic_url + '/api-apps/app/itemreturn/saveOrUpdate';
						this.$axios.post(url, this.samplesForm).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								if(opt=='save'){
									this.show = false;
									this.$emit('request');
								}
								this.resetSamples();
								this.$reset('request');
								this.$refs.samplesForm.resetFields();
							}else{
								this.samplesForm.RETURN_PERSON = parseInt(this.samplesForm.RETURN_PERSON);
								this.$message({
									message: res.data.resp_msg,
									type: 'error'
								});
							}
						}).catch((err) => {});
					} else {
						this.samplesForm.RETURN_PERSON = parseInt(this.samplesForm.RETURN_PERSON);
						this.show = true;
						this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
					}
				});
			},
			saveAndUpdate(){
				this.save('update');
			},
			saveAndSubmit(){
				this.save('save');
			},
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>