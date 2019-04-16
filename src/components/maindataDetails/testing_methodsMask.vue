<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加检验/检测方法</div>
					<div class="mask_title" v-show="modifytitle">修改检验/检测方法</div>
					<div class="mask_title" v-show="viewtitle">查看检验/检测方法</div>
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
					<div class="content-accordion">
						<el-collapse v-model="activeNames">
							<el-form inline-message :model="testingForm" :rules="rules" ref="testingForm" label-width="100px" status-icon>
								<el-collapse-item title="基础信息" name="1">
									<el-row :gutter="20" class="pb10">
										<el-col :span="3" class="pull-right">
											<el-input  v-model="testingForm.VERSION" :disabled="true">
												<template slot="prepend">版本</template>
											</el-input>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="编码" prop="M_NUM">
												<el-input v-model="testingForm.M_NUM" placeholder="自动生成" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="16">
											<el-form-item label="中文名称" prop="M_NAME">
												<el-input v-model="testingForm.M_NAME" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">&nbsp;</el-col>
										<el-col :span="16">
											<el-form-item label="英文名称" prop="M_ENAME">
												<el-input v-model="testingForm.M_ENAME" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="类别" prop="M_TYPE">
												<!-- <el-select v-model="testingForm.M_TYPE" placeholder="请选择类别" style="width: 100%;">
													<el-option v-for="(data,index) in selectData" :key="index" :value="data.code" :label="data.name"></el-option>
												</el-select> -->
												<el-input v-model="testingForm.M_TYPE" placeholder="请输入类别" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8" v-if="dept">
											<el-form-item label="机构">
												<el-input v-model="testingForm.DEPTIDDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="文件" name="3">
									<doc-table ref="docTable" :docParm = "docParm" @saveParent = "save"></doc-table>
								</el-collapse-item>

								<el-collapse-item title="其它" name="2" v-show="views">
									<el-row>
										<el-col :span="8">
											<el-form-item label="录入人">
												<el-input v-model="testingForm.ENTERBYDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间">
												<el-input v-model="testingForm.ENTERDATE" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人">
												<el-input v-model="testingForm.CHANGEBYDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间">
												<el-input v-model="testingForm.CHANGEDATE" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>

							</el-form>
						</el-collapse>
					</div>
					<div class="content-footer" v-show="noviews">
						<el-button type="primary" @click="save('Update')">保存</el-button>
						<el-button type="success" @click="save('Submit')" v-show="addtitle">保存并继续</el-button>
						<el-button v-if="modify" type="primary" class="btn-primarys" @click="modifyversion()">修订</el-button>
						<!-- <el-button v-if="modify" type="success" @click="update('testingForm')">启用</el-button> -->
						<el-button @click="close">取消</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import docTable from '../common/doc.vue'
	export default {
		name: 'testing_mask',
		components: {docTable},
		props: {
			page: {
				type: Object,
			},
			testingForm: { 
				type: Object,
				default: function() {
					return {
						VERSION: '',
						STATUS: '',
						M_NUM: '',
						M_NAME: '',
						M_ENAME: '',
						M_TYPE: '',
						DEPARTMENT: '',
						ENTERBY: '',
						ENTERDATE: '',
						CHANGEBY: '',
						CHANGEDATE: '',
					}
				}
			}
		},
		data() {
			return {
				docParm: {
					'model': 'new',
					'recordid': 1,
					'userid': 1,
					'username': '',
					'deptid': 1,
					'deptfullname': '',
					'appname': '',
					'appid': 1,
					'save': false
				},
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
				selMenu:[],
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				dialogVisible: false, //对话框
				edit: true, //禁填
				activeNames: ['1', '2', '3'], //手风琴数量
				addtitle: true,
				modifytitle: false,
				testing_filesForm:{//文件文件数据组
					inspectionList: []
				},
				TESTINGFORM:{},//
				isEditing: '',
				commentArr:{},//下拉加载
				rules: { //定义需要校验数据的名称
					M_NUM: [{
						required: false,
						trigger: 'change',//validateNum
						validator: this.Validators.isCodeNum,
					}],
					M_NAME: [
						{ required: true, message: '请填写中文名称', trigger: 'blur' },
						{ min: 5, max: 125, message: '长度在 5 到 125 个字符', trigger: 'blur' },
						{validator: this.Validators.isSpecificKey, trigger: 'blur'},
					],
					M_ENAME: [
						{ required: true, message: '请填写英文名称', trigger: 'blur' },
						{ min: 5, max: 255, message: '长度在 5 到 255 个字符', trigger: 'blur' },
						{validator: this.Validators.isSpecificKey, trigger: 'blur'},
					],
					M_TYPE: [
						{ required: true, message: '请填写', trigger: 'change' },
						{validator: this.Validators.isSpecificKey, trigger: 'blur'},
					]
				},
				hintshow:false,
				personinfo:false,
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
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			hint(){
				this.hintshow = true;
			},
			hinthide(){
				this.hintshow = false;
			},
			getUser(opt){
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.testingForm.DEPARTMENT = '';
					this.docParm.userid = res.data.id;
					this.docParm.username = res.data.username;
					this.docParm.deptid = res.data.deptId;
					this.docParm.deptfullname = res.data.deptName;
					//判断新建和修改时录入人/时间/机构和修改人/时间的变化
					if(opt == 'new'){
						this.testingForm.DEPTID = res.data.deptId;//录入人机构
						this.testingForm.ENTERBY = res.data.id;//录入人
						var date = new Date();
						this.testingForm.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");//录入时间
					}
					if(opt == 'edit'){
						this.testingForm.CHANGEBY = res.data.id;//修改人
						var date = new Date();
						this.testingForm.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");//修改时间
					}
					if(opt != 'new'){
						//深拷贝数据
						let _obj = JSON.stringify(this.testingForm);
						this.TESTINGFORM = JSON.parse(_obj);
					}
				}).catch((err)=>{
				})
				
			},
			visible() {//添加内容时从父组件带过来的
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'new';
					_this.docParm.appname = '检验检测项目_检验/检测方法';
					_this.docParm.recordid = _this.testingForm.ID;
					_this.docParm.appid = 16;
					_this.docParm.save = false;
					_this.$refs.docTable.getData();
				},100);
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
				this.getUser('new');//新建时当前用户
            	// this.show = true;
			},
			detail() { //修改内容时从父组件带过来的
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
//				this.testingForm.STATUS=this.testingForm.STATUS=="1"?'活动':'不活动';
				this.show = true;
				this.getUser('edit');//修改时当前用户
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'edit';
					_this.docParm.appname = '检验检测项目_检验/检测方法';
					_this.docParm.recordid = _this.testingForm.ID;
					_this.docParm.appid = 16;
					_this.$refs.docTable.getData();
				},100);
			},

			iconOperation(row, column, cell, event){//切换Table-操作列中的修改、保存
				if(column.property ==="iconOperation"){
					row.isEditing = !row.isEditing
				}
			},
			//这是查看
			view(item) {
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
					_this.docParm.appname = '检验检测项目_检验/检测方法';
					_this.docParm.recordid = _this.testingForm.ID;
					_this.docParm.appid = 16;
					_this.$refs.docTable.getData();
				},100);			
			},
			modifyversion () {//点击修改后给当前录入人和录入时间赋值
				this.$refs.testingForm.validate((valid) => {
			        if (valid) {
			          	var TESTINGFORM=JSON.stringify(this.TESTINGFORM); //接过来的数据
	 					var testingForm=JSON.stringify(this.testingForm); //获取新新的数据
					 	if(testingForm==TESTINGFORM){
					  		this.$message({
								message: '没有修改内容，不允许修订',
								type: 'warning'
							});
							return false;
						}else{
							var url = this.basic_url + '/api-apps/app/inspectionMet/operate/upgraded';
							this.$axios.post(url,this.testingForm).then((res) => {
								//resp_code == 0是后台返回的请求成功的信息
								if(res.data.resp_code == 0) {
									this.$message({
										message: '保存成功',
										type: 'success'
									});
									//重新加载数据
									this.show = false;
									this.$emit('request');
									this.$emit('reset');
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

			loadMore () {//表格滚动加载
			    if (this.loadSign) {
			        this.loadSign = false
			     	this.page.currentPage++
			     	if (this.page.currentPage > Math.ceil(this.page.totalCount/this.page.pageSize)) {
			       		return
			     	}
				    setTimeout(() => {
				        this.loadSign = true
				    }, 1000)
			     	this.requestData_doclinks()
			    }
			},
			sizeChange(val) {//页数
		        this.page.pageSize = val;
		      	this.requestData_doclinks();
		    },
		    currentChange(val) {//当前页
		      	this.page.currentPage = val;
		      	this.requestData_doclinks();
		    },
			searchinfo(index) {//查询展示出第1页数据
				this.page.currentPage = 1;
				this.page.pageSize = 10;
				this.requestData_doclinks();
			},

			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},

			//检验/检测方法类别
			getType() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=type';
				this.$axios.get(url, {}).then((res) => {
					this.selectData = res.data;
				}).catch(error => {
					// console.log('请求失败');
				})
			},

			addfield_doclinks() { //插入行到文件文件Table中
				var isEditingflag=false;
				for(var i=0;i<this.testing_filesForm.inspectionList.length; i++){
					if (this.testing_filesForm.inspectionList[i].isEditing==false){
						isEditingflag=false;
					}else{
                        isEditingflag=true;
                        break;
					}
				}
				if (isEditingflag==false){
                	this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
                		var currentUser, currentDate
						this.currentUser=res.data.nickname;
						var date=new Date();
						this.currentDate = this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
						var index=this.$moment(date).format("YYYYMMDDHHmmss");
						var obj = {
							"DOCLINKS": 'FLS' + index,
							"DESCRIPTION": '',
							"DOC_SIZE": '',
							"ROUTE": '',
							"ENTERBY": this.currentUser,
							"ENTERDATE": this.currentDate,
							"isEditing": true,
						};
						this.testing_filesForm.inspectionList.unshift(obj);//在列表前新建行unshift，在列表后新建行push
					}).catch((err)=>{
					})
	            } else {
	                this.$message.warning("请先保存当前编辑项");
				}
			},
			saveRow (row) {//Table-操作列中的保存行
				this.$refs['testing_filesForm'].validate((valid) => {
		          	if (valid) {
						var url = this.basic_url + '/api-apps/app/doclinks/saveOrUpdate';
						this.$axios.post(url, this.submitData).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								//重新加载数据
								this.requestData_doclinks();
							}
						}).catch((err) => {
						});
			        } else {
			            return false;
			        }
		        });
			},

			deleteRow(row) {//Table-操作列中的删除行
				this.$confirm('确定删除此文件文件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                	var url = this.basic_url + '/api-apps/app/doclinks/' + row.ID;
                    this.$axios.delete(url, {}).then((res) => {//.delete 传数据方法
					//resp_code == 0 是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.requestData_doclinks();
						}
					}).catch((err) => {
					});
                }).catch(() => {

            	});
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
			//点击更新按钮
			update(testingForm) {
				var data = {
					ID: this.testingForm.ID,
				}
				this.$axios.get(this.basic_url+ '/api-apps/app/inspectionMet/operate/updateRelate', {
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
			//执行保存
			save(opt) {
				var _this = this;
				this.$refs['testingForm'].validate((valid) => {
					if(!valid && opt == 'docUpload'){
						this.$message({
							message: '请先正确填写信息，再进行文档上传',
							type: 'warning'
						});
					}
					if (valid) {
						_this.testingForm.STATUS=_this.testingForm.STATUS=="活动" ? '1' : '0';
						if(_this.testingForm.ID!=null&&_this.testingForm.ID!=undefined&&_this.testingForm.ID!=''){
							this.$confirm('是否需要修订版本？').then(_ => {
								this.modifyversion();
							}).catch(_ => {
								this.close();
							});	
						}else{
						var url = this.basic_url + '/api-apps/app/inspectionMet/saveOrUpdate';
						this.$axios.post(url,_this.testingForm).then((res) => {
							if(res.data.resp_code == 0) {
								if(opt == 'docUpload'){
									this.docParm.recordid = res.data.datas.id;
									this.docParm.model = 'edit';
									this.$refs.docTable.autoLoad();
									this.testingForm.ID = res.data.datas.id;
									this.testingForm.M_NUM = res.data.datas.M_NUM;
								}else{
									this.$message({
										message: '保存成功',
										type: 'success'
									});
									if(opt=='Update'){
										console.log(1111);
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
									//res.data.resp_msg!=''后台返回提示信息
									if( res.data.resp_msg!=''){
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
							}
						}).catch((err) => {
							this.show = true;
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
			
			handleClose(done) { //大弹出框确定关闭按钮
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
			}
		},
		mounted() {
			this.getType();
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>