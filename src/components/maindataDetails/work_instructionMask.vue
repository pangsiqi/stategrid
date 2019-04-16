<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加作业指导书</div>
					<div class="mask_title" v-show="modifytitle">修改作业指导书</div>
					<div class="mask_title" v-show="viewtitle">查看作业指导书</div>
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
					<el-form inline-message :model="WORK_INSTRUCTION" :rules="rules" ref="WORK_INSTRUCTION" label-width="100px" class="demo-adduserForm">
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="作业指导书" name="1">
									<el-row class="pb10">
										<el-col :span="3" class="pull-right">
											<el-input v-model="WORK_INSTRUCTION.VERSION" :disabled="true">
												<template slot="prepend">版本</template>
											</el-input>
										</el-col>
										<el-col :span="5" class="pull-right mr20">
											<el-input v-model="WORK_INSTRUCTION.NUM" placeholder="自动生成" :disabled="edit">
												<template slot="prepend">编号</template>
											</el-input>
										</el-col>
									</el-row>

									<el-row>
										<!-- <el-col :span="8">
											<el-form-item label="类别编号" prop="NUM">
												<el-input v-model="WORK_INSTRUCTION.NUM" :disabled="edit" placeholder="自动生成"></el-input>
											</el-form-item>
										</el-col> -->
										<el-col :span="8">
											<el-form-item label="分发号" prop="WI_NUM">
												<el-input v-model="WORK_INSTRUCTION.WI_NUM" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="16">
											<el-form-item label="文件名称" prop="DESCRIPTION">
												<el-input v-model="WORK_INSTRUCTION.DESCRIPTION" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8" v-if="dept">
											<el-form-item label="机构" prop="DEPTIDDesc">
												<el-input v-model="WORK_INSTRUCTION.DEPTIDDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="文件" name="2">
									<doc-table ref="docTable" :docParm = "docParm" @saveParent = "save"></doc-table>
								</el-collapse-item>
								<el-collapse-item title="其它" name="3" v-show="views">
									<el-row>
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc">
												<el-input v-model="WORK_INSTRUCTION.ENTERBYDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE">
												<el-input v-model="WORK_INSTRUCTION.ENTERDATE" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人" prop="CHANGEBYDesc">
												<el-input v-model="WORK_INSTRUCTION.CHANGEBYDesc" placeholder="当前修改人" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="CHANGEDATE">
												<el-input v-model="WORK_INSTRUCTION.CHANGEDATE" placeholder="当前修改时间" :disabled="edit"></el-input>
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
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import docTable from '../common/doc.vue'
	export default {
		name: 'masks',
		components: {docTable},
		props: {
			WORK_INSTRUCTION: {
				type: Object,
				default: function() {
					return {
						ID: '',
						NUM: '',
						WI_NUM: '',
						DESCRIPTION: '',
						STATUS: '',
						VERSION: '',
						DEPARTMENT: '',
						ENTERBY: '',
						ENTERDATE: '',
						CHANGEBY: '',
						CHANGEDATE: ''
					}
				}
			},
			page: Object,
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
					'appid': 1
				},
				basic_url: Config.dev_url,
				selUser: [],
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				activeNames: ['1','2','3'], //手风琴数量
				//				labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				selectData: [],
				rules: {
					NUM: [{
						required: false,
						trigger: 'blur',
						validator: this.Validators.isCodeNum,
					}],
					DESCRIPTION: [
						{required: true, message: '请填写', trigger: 'blur'},
						{validator: this.Validators.isSpecificKey, trigger: 'blur'},
					],
				},
				testing_filesForm:{//文件文件数据组
					inspectionList: []
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				work_instruction:{},//从父组件接过来的值
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
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			sizeChange(val) {//页数
		        this.page.pageSize = val;
		      	this.requestData_doclinks();
		    },
		    currentChange(val) {//当前页
		      	this.page.currentPage = val;
		      	this.requestData_doclinks();
		    },
		    iconOperation(row, column, cell, event){//切换Table-操作列中的修改、保存
				if(column.property ==="iconOperation"){
					row.isEditing = !row.isEditing
				}
			},
			//生成随机数函数
			rand(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
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
			getUser(opt){
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.WORK_INSTRUCTION.DEPARTMENT = '';
					this.docParm.userid = res.data.id;
					this.docParm.username = res.data.username;
					this.docParm.deptid = res.data.deptId;
					this.docParm.deptfullname = res.data.deptName;
					//判断新建和修改时录入人/时间/机构和修改人/时间的变化
					if(opt == 'new'){
						this.WORK_INSTRUCTION.DEPTID = res.data.deptId;//录入人机构
						this.WORK_INSTRUCTION.ENTERBY = res.data.id;//录入人
						var date = new Date();
						this.WORK_INSTRUCTION.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");//录入时间
					}
					if(opt == 'edit'){
						this.WORK_INSTRUCTION.CHANGEBY = res.data.id;//修改人
						var date = new Date();
						this.WORK_INSTRUCTION.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");//修改时间
					}
					if( opt!='new' ){
						//深拷贝数据
						let _obj = JSON.stringify(this.WORK_INSTRUCTION);
						this.work_instruction = JSON.parse(_obj);
					}
					
				}).catch((err) => {
				});
			},
			
			//点击添加按钮显示弹窗
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
				this.docParm = {
					'model': 'new',
					'appname': '作业指导书',
					'recordid': 1,
					'appid': 10
				};
				this.getUser('new');//新建时当前用户
//				this.show = true;
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
				this.getUser('edit');//修改时当前用户
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'edit';
					_this.docParm.appname = '作业指导书';
					_this.docParm.recordid = _this.WORK_INSTRUCTION.ID;
					_this.docParm.appid = 10;
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
					_this.docParm.appname = '作业指导书';
					_this.docParm.recordid = _this.WORK_INSTRUCTION.ID;
					_this.docParm.appid = 10;
					_this.$refs.docTable.getData();
				},100);
			},
			//点击修订按钮
			modifyversion() {
				this.$refs.WORK_INSTRUCTION.validate((valid) => {
					if(valid) {
						var work_instruction=JSON.stringify(this.work_instruction); 
	 					var WORK_INSTRUCTION=JSON.stringify(this.WORK_INSTRUCTION);
					 	if(work_instruction==WORK_INSTRUCTION){
					  	this.$message({
								message: '没有修改内容，不允许修订！',
								type: 'warning'
							});
							return false;
					    }else{
							var url = this.basic_url + '/api-apps/app/productType/operate/upgraded';
							this.$axios.post(url, this.WORK_INSTRUCTION).then((res) => {
								//resp_code == 0是后台返回的请求成功的信息
								if(res.data.resp_code == 0) {
									this.$message({
										message: '修订成功',
										type: 'success'
									});
									//重新加载数据
									this.$emit('request');
									this.show = false;
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
											message:'相同数据不可重复修订！',
											type: 'warning'
										});
									}
								}
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
			save(opt) {
				this.$refs['WORK_INSTRUCTION'].validate((valid) => {
					if(!valid && opt == 'docUpload'){
						this.$message({
							message: '请先正确填写信息，再进行文档上传',
							type: 'warning'
						});
					}
					if(valid) {
						this.WORK_INSTRUCTION.STATUS = ((this.WORK_INSTRUCTION.STATUS == "1" || this.WORK_INSTRUCTION.STATUS == '活动') ? '1' : '0');
						if(this.WORK_INSTRUCTION.ID!=null&&this.WORK_INSTRUCTION.ID!=undefined&&this.WORK_INSTRUCTION.ID!=''){
							this.$confirm('是否需要修订版本？').then(_ => {
								this.modifyversion();
							}).catch(_ => {
								this.close();
							});	
						}else{
						var url = this.basic_url + '/api-apps/app/workIns/saveOrUpdate';
						this.$axios.post(url, this.WORK_INSTRUCTION).then((res) => {
							if(res.data.resp_code == 0) {
								
								if(opt == 'docUpload'){
									this.docParm.recordid = res.data.datas.id;
									this.docParm.model = 'edit';
									this.WORK_INSTRUCTION.ID = res.data.datas.id;
									this.WORK_INSTRUCTION.NUM = res.data.datas.NUM;
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
						done();
					})
					.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
			},
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>