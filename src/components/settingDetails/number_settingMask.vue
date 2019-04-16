<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加自动编号设置</div>
					<div class="mask_title" v-show="modifytitle">修改自动编号设置</div>
					<div class="mask_title" v-show="viewtitle">查看自动编号设置</div>
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
					<el-form inline-message :model="numbsetForm" :rules="rules" ref="numbsetForm" label-width="100px" status-icon>
						<div class="content-accordion">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基础信息" name="1">
									<el-row :gutter="20">
										<!-- <el-col :span="4" class="pull-right" v-if="modify">
											<el-input v-model="numbsetForm.STATUS==1?'活动':'不活动'" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input>
										</el-col> -->
										<!-- <el-col :span="4" class="pull-right" v-else>
											<el-input v-model="numbsetForm.STATUS" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input>
										</el-col> -->
											<!-- <el-select v-model="numbsetForm.STATUS" placeholder="请选择信息状态">
												<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
												</el-option>
											</el-select> -->
										<!-- </el-col> -->
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="是否初始化" prop="isinitbydate" label-width="110px">
												<el-input v-model="numbsetForm.isinitbydate" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="初始化日期格式">
												<el-input v-model="numbsetForm.initformat" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="前缀" prop="prefix">
												<el-input v-model="numbsetForm.prefix" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="初始化起始数" prop="initnum" label-width="110px">
												<el-input v-model="numbsetForm.initnum" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="增加量">
												<el-input v-model="numbsetForm.increase" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="是否拼接日期" prop="issplicingdate">
												<el-input v-model="numbsetForm.issplicingdate" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="拼接日期格式" prop="splicingformat" label-width="110px">
												<el-input v-model="numbsetForm.splicingformat" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="序列号">
												<el-input v-model="numbsetForm.serialnum" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="保留位数" prop="retain">
												<el-input v-model="numbsetForm.retain" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="其它" name="2"  v-show="views">
									<el-row>
										<el-col :span="8">
											<el-form-item label="录入人"  label-width="110px">
												<el-input v-model="numbsetForm.createuserDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" label-width="80px">
												<el-input v-model="numbsetForm.createtime" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
										<el-form-item label="变更人" label-width="80px">
												<el-input v-model="numbsetForm.updateuserDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="变更时间"  label-width="110px">
												<el-input v-model="numbsetForm.updatetime" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>

						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="submitForm('numbsetForm')">保存</el-button>
							<el-button @click="cancelForm">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
			<!-- 弹出 -->
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	export default {
		name: 'masks',
		props: {
			page: {
				type: Object,
			},
			numbsetForm: {
				type: Object,
				default: function(){
					return {
						isinitbydate:'',
						initformat:'',
						prefix:'',
						initnum:'',
						increase:'',
						issplicingdate:'',
						splicingformat:'',
						serialnum:'',
						retain:'',
					}
				}
			}
		},
		data() {
			// var validateAUTOKEY = (rule, value, callback) => {
   //              if (value === '') {
   //                  callback(new Error('请填写自动编号名称'));
   //              }else {
   //                  callback();
   //              }
   //          };
   //          var validateS_NUM = (rule, value, callback) => {
   //              if (value === '') {
   //                  callback(new Error('请填写起始数'));
   //              }else {
   //              	var targ=/^([0-9]*|[0-9]{1}\d*\.\d{1}?\d*)$/;
   //              	if (!targ.test(value)) {
   //              		callback(new Error('起始数须为数字'));
   //              	}
   //                  callback();
   //              }
   //          };
           
			return {
				basic_url: Config.dev_url,
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				modify:false,//修订、修改人、修改时间
				selMenu:[],
				dialogVisible: false, //对话框
				edit: true, //禁填
				activeNames: ['1','2'], //手风琴数量
				show: false,
				isok1: true,
				isok2: false,
//				labelPosition: 'top',//标题在上方显示
				rules:{
          			// AUTOKEY:[
					// 	{ required: true, message: '必填', trigger: 'blur'},
					// 	{ validator: this.Validators.isWorknumber, trigger: 'blur'}
					// ],
					// PREFIX:[{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],
          			// S_NUM:[
					// 	{ required: true, message: '必填', trigger: 'blur'},
					// 	{ validator: this.Validators.isInteger, trigger: 'blur'}
					// ],
          		
	          	},
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
			//form表单内容清空
			resetNew(){
                this.numbsetForm = {
					isinitbydate:'',
					initformat:'',
					prefix:'',
					initnum:'',
					increase:'',
					issplicingdate:'',
					splicingformat:'',
					serialnum:'',
					retain:'',
					createuser:'',
					createuserDesc:'',
					updateuser:'',
					updateuserDesc:''
				}
            },
            childMethods() {//添加内容时从父组件带过来的
            	this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.numbsetForm.createuser=res.data.id;
					this.numbsetForm.createuserDesc=res.data.nickname;
					var date=new Date();
					this.numbsetForm.createtime = this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
				}).catch((err)=>{
				})
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
            	// this.show = !this.show;
            },
            detail() {//修改内容时从父组件带过来的
            	this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.numbsetForm.updateuser=res.data.id;
					this.numbsetForm.updateuserDesc=res.data.nickname;
					var date=new Date();
					this.numbsetForm.updatetime = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err)=>{
				})
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
            	this.show = true;
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
			},
			//点击关闭按钮
			close() {
				this.show = false;
			},
			open(){
				this.show = true;
			},
			cancelForm(){
				this.show = false;
				this.reset();
			},
			reset() {
				this.show = false;
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
			//保存
			submitForm(numbsetForm) {
				this.$refs[numbsetForm].validate((valid) => {
		          if (valid) {
		          	// this.numbsetForm.STATUS=((this.numbsetForm.STATUS=="1"||this.numbsetForm.STATUS=='活动') ? '1' : '0');
					var url = this.basic_url + '/api-user/serialnum/saveOrUpdate';
					this.$axios.post(url, this.numbsetForm).then((res) => {
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							//重新加载数据
							this.$emit('request');
							this.$refs["numbsetForm"].resetFields();
							this.show = false;
						}
					}).catch((err) => {
					});
		          }else {
						this.show = true;
						this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
					}
		        });
				
			},
			handleClose(done) {//大弹出框确定关闭按钮
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
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>