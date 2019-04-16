<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div" v-loading="loading">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加检验/检测标准</div>
					<div class="mask_title" v-show="modifytitle">修改检验/检测标准</div>
					<div class="mask_title" v-show="viewtitle">查看检验/检测标准</div>
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
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基本信息" name="1">
									<el-row class="pb10" style="margin-right: 5px;">
										<el-col :span="3" class="pull-right">
											<el-input v-model="dataInfo.VERSION" :disabled="true">
												<template slot="prepend">版本</template>
											</el-input>
										</el-col>
										<el-col :span="5" class="pull-right mr20">
											<el-input v-model="dataInfo.S_NUM" placeholder="自动生成" :disabled="edit">
												<template slot="prepend">编码</template>
											</el-input>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="标准编号" prop="SS_NUM">
												<el-input v-model="dataInfo.SS_NUM" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="16"><!--移上去显示数据 :content="dataInfo.S_NAME"-->
											<!-- <el-tooltip class="item" effect="dark" placement="top"> -->
												<el-form-item label="标准名称" prop="S_NAME">
													<el-input v-model="dataInfo.S_NAME" :disabled="noedit"></el-input>
												</el-form-item>
											<!-- </el-tooltip> -->
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="24">
											<el-form-item label="英文名称" prop="S_ENGNAME">
												<el-input v-model="dataInfo.S_ENGNAME" :disabled="noedit">
												<!-- <el-input v-model="dataInfo.S_ENGNAME" :disabled="noedit" @focus="editBox('S_ENGNAME')"> -->
												<!-- <el-button slot="append" @click="dialogFormVisible = true" icon="icon-maximization"></el-button> -->
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="发布时间" prop="RELEASETIME">
												<el-date-picker v-model="dataInfo.RELEASETIME" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width:100%"  :disabled="noedit">
												</el-date-picker>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="启用时间" prop="STARTETIME">
												<el-date-picker v-model="dataInfo.STARTETIME" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width:100%" :disabled="noedit" :picker-options="pickerOptions1" >
												</el-date-picker>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="停用时间" prop="STOPTIME">
												<el-date-picker v-model="dataInfo.STOPTIME" type="date" value-format="yyyy-MM-dd" style="width:100%" :disabled="noedit" :picker-options="pickerOptions2">
												</el-date-picker>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="发布单位" prop="RELEASE_UNIT">
												<el-input v-model="dataInfo.RELEASE_UNIT" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8" v-if="dept">
											<el-form-item label="机构" prop="DEPTIDDesc">
												<el-input v-model="dataInfo.DEPTIDDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="文件" name="2">
									<doc-table ref="docTable" :docParm = "docParm" @getFileInfo = "getFileInfo" @saveParent = "save" @showLoading = "showLoading" @closeLoading = "closeLoading"></doc-table>
								</el-collapse-item>
								<el-collapse-item title="其它" name="3" v-show="views">
									<el-row>
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc">
												<el-input v-model="dataInfo.ENTERBYDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE">
												<el-input v-model="dataInfo.ENTERDATE" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人" prop="CHANGEBYDesc">
												<el-input v-model="dataInfo.CHANGEBYDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="CHANGEDATE">
												<el-input v-model="dataInfo.CHANGEDATE" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="save('Update')">保存</el-button>
							<el-button type="success" @click="save('Submit')" v-show="addtitle">保存并继续</el-button>
							<el-button v-if="modify" type="primary" class="btn-primarys" @click="modifyversion()">修订</el-button>
							<!-- <el-button v-if="modify" type="success" @click="update('dataInfo')">启用</el-button> -->
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>

			<el-dialog :modal-append-to-body="false" title="信息" :visible.sync="dialogFormVisible" :before-close="resetEditBox">
				<el-form >
					<el-form-item label="英文名称" :label-width="formLabelWidth" prop="editDataInfo">
						<el-input type="textarea" :rows="4" v-model="editDataInfo" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item class="text-center pt20">
						<el-button type="primary" @click="saveEditBox">确 定</el-button>
						<el-button @click="resetEditBox">取 消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import docTable from '../common/doc.vue'
	import { Loading } from 'element-ui'
	export default {
		name: 'masks',
		props: {
			dataInfo: {
				type: Object,
				default: function(){
					return {
						ID:'',
						S_NUM: '',
						SS_NUM: '',
						S_NAME: '',
						S_ENGNAME: '',
						ISUSESTATE: '0',//使用状态，默认0为使用，1为停用
						RELEASETIME: '',
						STARTETIME: '',
						STOPTIME: '',
						VERSION:1,
						RELEASE_UNIT: '',
						DEPARTMENT: '',
						ENTERBY: '',
						ENTERDATE: '',
						CHANGEBY: '',
						CHANGEDATE: '',
						FILEID: '',
						FILEPATH: '',
						FILESIZE: ''
					}
				}
			},
			page: Object ,
		},
		components: {docTable},
		data() {
			return {
				pickerOptions1: {
					disabledDate: (time) => {
						if(!!this.dataInfo.RELEASETIME){
							return time.getTime() < new Date(this.dataInfo.RELEASETIME).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
						}else{
							this.dataInfo.STARTETIME='';
							this.$message({
								message: '请先选发布时间',
								type: 'warning'
							});

						}
						
					}
				},
				pickerOptions2: {
					disabledDate: (time) => {
					if(!!this.dataInfo.STARTETIME){
							return time.getTime() < new Date(this.dataInfo.STARTETIME).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
						}else if(this.dataInfo.RELEASETIME==''||this.dataInfo.STARTETIME==''){
							this.dataInfo.STOPTIME='';
							this.$message({
								message: '请先选启用时间',
								type: 'warning'
							});

						}
					}	
				},
				loading: false,
				editDataInfo: '',
				editDataInfoProp: '',
				docParm: {
					'model': 'new',
					'recordid': 1,
					'userid': 1,
					'username': '',
					'deptid': 1,
					'deptfullname': '',
					'appname': '',
					'appid': 1
				},
				dialogTableVisible: false,
        		dialogFormVisible: false,
        		form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				formLabelWidth: '120px',
				basic_url: Config.dev_url,
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				value: '',
				selUser: [],
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				activeNames: ['1', '2', '3'], //手风琴数量
//				labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				leaddata: [ //导入数据的表格
					{
						columnname: 'author',
						description: '作者姓名',
						type: '字符串(string)',
						length: '6',
						retain: ''
					},
					{
						columnname: 'author',
						description: '作者姓名',
						type: '字符串(string)',
						length: '6',
						retain: ''
					},
					{
						columnname: 'author',
						description: '作者姓名',
						type: '字符串(string)',
						length: '6',
						retain: ''
					},
					{
						columnname: 'author',
						description: '作者姓名',
						type: '字符串(string)',
						length: '6',
						retain: ''
					}
				],
				rules: {
					SS_NUM: [{required: true, trigger: 'blur',validator: this.Validators.isSpecificKey}],//标准编号
					S_NAME: [{required: true, trigger: 'blur',validator: this.Validators.isChinese}],//中文名称
					S_ENGNAME: [{required: true, trigger: 'blur', validator: this.Validators.isEnglish}],//英文名称
					STARTETIME: [{required: true, trigger: 'blur',message: '必填',}],
					editDataInfoProp: [
						{required: true,trigger: 'blur',message: '必填',},
						{validator: this.Validators.isSpecificKey,trigger: 'blur'}
					],
					RELEASETIME:[{required: true, message: '必填', trigger: 'change'}],
					RELEASE_UNIT: [
						{required: true,trigger: 'blur',message: '必填',},
						{validator: this.Validators.isSpecificKey, trigger: 'blur'},
					],
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				// DATAINFO:{},//父组件传过来的值
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
			getFileInfo(fileData){
				this.dataInfo.FILESIZE = fileData.filesize;
				this.dataInfo.FILEID = fileData.fileid;
				this.dataInfo.FILEPATH = fileData.webUrl;
			},
			showLoading(){
				this.loading = true;
			},
			closeLoading(){
				this.loading = false;
			},
			editBox(val){
				this.dialogFormVisible = true;
				this.editDataInfoProp = val;
				this.editDataInfo = this.dataInfo[val];
			},
			saveEditBox(){
				var editProp = this.editDataInfoProp;
				this.dataInfo[editProp] = this.editDataInfo;
				this.resetEditBox();
			},
			resetEditBox(){
				this.dialogFormVisible = false;
				this.editDataInfo = '';
				this.editDataInfoProp = '';
			},
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			
			addfield() { //添加行信息
				var obj = {
					columnname: '',
					description: '',
					type: '',
					length: '',
					retain: ''
				};
				//this.attributes.push(obj);
				this.dataInfo.attributes.push(obj);
			},
			delfield(item) {
				var index = this.dataInfo.attributes.indexOf(item);
				if(index !== -1) {
					//this.attributes.splice(index, 1)
					this.dataInfo.attributes.splice(index, 1);
				}
			},
			importdia() {
				this.dialogVisible = true;
			},
			getUser(opt){
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					if(opt!='new'){
						this.dataInfo.DEPTID = res.data.deptId;
						this.dataInfo.CHANGEBY = res.data.id;
						var date = new Date();
						this.dataInfo.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
						//深拷贝数据
						let _obj = JSON.stringify(this.dataInfo);
						this.DATAINFO = JSON.parse(_obj);
					}else if(opt =='new'){
						this.dataInfo.DEPARTMENT = '';
						this.dataInfo.DEPTID = res.data.deptId;
						this.dataInfo.ENTERBY = res.data.id;
						var date = new Date();
						this.dataInfo.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
						//深拷贝数据
						let _obj = JSON.stringify(this.dataInfo);
						this.DATAINFO = JSON.parse(_obj);
					}
					this.docParm.userid = res.data.id;
					this.docParm.username = res.data.username;
					this.docParm.deptid = res.data.deptId;
					this.docParm.deptfullname = res.data.deptName;
				}).catch((err)=>{
				});
			},
			//添加添加显示弹窗
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
				this.getUser('new');
				this.docParm = {
					'model': 'new',
					'appname': '检验检测项目_检验/检测标准',
					'recordid': 1,
					'appid': 13
				};
				// this.show = true;
			},
			// 这里是修改
			detail() {
				this.addtitle = false;
				this.modifytitle = true;
				this.viewtitle = false;
				this.dept = true;
				this.noedit = false;//表单内容
				this.views = false;//录入修改人信息
				this.noviews = true;//按钮
				this.hintshow = false;
				this.modify = true;//修订
				this.statusshow1 = false;
				this.statusshow2 = true;
				this.getUser('edit');
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'edit';
					_this.docParm.appname = '检验检测项目_检验/检测标准';
					_this.docParm.recordid = _this.dataInfo.ID;
					_this.docParm.appid = 13;
					_this.$refs.docTable.getData();
				},100);
				this.show = true;
			},
			//这是查看
			view() {
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.dept = true;
				this.noedit = true;//表单内容
				this.views = true;//录入修改人信息
				this.noviews = false;//按钮
				this.show = true;	

				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'view';
					_this.docParm.appname = '检验检测项目_检验/检测标准';
					_this.docParm.recordid = _this.dataInfo.ID;
					_this.docParm.appid = 13;
					_this.$refs.docTable.getData();
				},100);			
			},
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');//关闭弹框去掉勾选
			},
			open(){
				this.show = true;
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
			//修订
			modifyversion(){
				this.$refs.dataInfo.validate((valid) => {
		          	if (valid) {
		          		var DATAINFO = JSON.stringify(this.DATAINFO); //接过来的数据
 						var dataInfo = JSON.stringify(this.dataInfo); //获取新新的数据
				 		if(dataInfo == DATAINFO){
							this.$message({
								message: '没有修改内容，不允许修订',
								type: 'warning'
							});
							return false;
					  	}else{
							var url = this.basic_url + '/api-apps/app/inspectionSta/operate/upgraded';
							this.$axios.post(url,this.dataInfo).then((res) => {
							//resp_code == 0是后台返回的请求成功的信息
								if(res.data.resp_code == 0) {
									this.$message({
										message: '保存成功',
										type: 'success'
									});
									//重新加载数据
									this.show = false;
									this.$emit('request');	
								}
							}).catch((err) => {
							});
						}
		          	} else {
			            this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
		          	}
			   });
			},
			//点击更新按钮
			update(dataInfo) {
				var data = {
					id: this.dataInfo.ID,
				}
				this.$axios.get(this.basic_url+ '/api-apps/app/inspectionSta/operate/updateRelate', {
					params: data
				}).then((res) => {
					if(res.data.resp_code == 0) {
						this.$message({
							message: '更新成功',
							type: 'success'
						});
					}else{
						return;
					}
				}).catch((err) => {
				});
			},
			// 保存users/saveOrUpdate
			save(opt) {
				this.$refs['dataInfo'].validate((valid) => {
					// this.dataInfo.RELEASETIME =  this.$moment(this.dataInfo.RELEASETIME).format("YYYY-MM-DD HH:mm:ss");
					// this.dataInfo.STARTETIME = this.$moment(this.dataInfo.STARTETIME).format("YYYY-MM-DD HH:mm:ss");
					if(!valid && opt == 'docUpload'){
						this.$message({
							message: '请先正确填写信息，再进行文档上传',
							type: 'warning'
						});
					}
					if (valid) {
						this.dataInfo.STATUS = ((this.dataInfo.STATUS == "1"||this.dataInfo.STATUS == '活动') ? '1' : '0');
						if(this.dataInfo.ID!=null&&this.dataInfo.ID!=undefined&&this.dataInfo.ID!=''){
							this.$confirm('是否需要修订版本？').then(_ => {
								this.modifyversion();
							}).catch(_ => {
								this.close();
							});	
						}else{
						var url = this.basic_url + '/api-apps/app/inspectionSta/saveOrUpdate';
						this.$axios.post(url, this.dataInfo).then((res) => {
							if(res.data.resp_code == 0) {
								if(opt == 'docUpload'){
									this.docParm.recordid = res.data.datas.id;
									this.docParm.model = 'edit';
									this.$refs.docTable.autoLoad();
									this.dataInfo.ID = res.data.datas.id;
									this.dataInfo.S_NUM = res.data.datas.S_NUM;
								}else{
									this.$message({
										message: '保存成功',
										type: 'success'
									});
									if(opt=='Update'){
										this.show=false;
									}else{
										this.show=true;
									}
									this.$emit('request');
									this.$emit('reset');
									this.visible();
								}
							}else{
								this.show = true;
								if(res.data.resp_code == 1) {
									this.$message({
										message: res.data.resp_msg,
										type: 'warning'
									});
								}else{
									this.$message({
										message:'相同数据不可重复添加！',
										type: 'warning'
									});
								}
							}						
						}).catch((err) => {

						});
						}
			        } else {
			          	this.show = true;
			          	this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
			        }
				});
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
			},
		}
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>