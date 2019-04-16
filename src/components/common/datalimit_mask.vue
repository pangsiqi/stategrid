<template>
	<div>
		<div class="mask" v-show="show1"></div>
		<div class="mask_divbg" v-show="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title">{{}}-数据限制</div>
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
					<el-form inline-message :model="user" :label-position="labelPosition" :rules="rules" ref="user" label-width="100px" class="demo-user">
						<div class="content-accordion" id="information">
							<div class="mask_tab-block">
								<div class="accordion-body tab-content" v-show="col_but1" id="tab-content2">
									<el-row :gutter="30">
										<el-col :span="12">
											<el-form-item label="应用名称" prop="companyName">
												<el-input v-model="user.companyName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getCompany"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="12">
											<el-form-item label="表名称" prop="companyName">
												<el-input v-model="user.companyName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getCompany"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="12">
											<el-form-item label="限制方式" prop="sex">
												<el-radio-group v-model="user.sexName">
													<el-radio label="默认"></el-radio>
													<el-radio label="自定义"></el-radio>
												</el-radio-group>
											</el-form-item>
										</el-col>
										<el-col :span="12">
											<el-form-item label="字段名" prop="deptName">
												<el-input v-model="user.deptName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getDept"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="24">
											<el-form-item label="限制范围" prop="password">
												<el-input type="textarea" v-model="user.password" placeholder="请填写"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</div>
							</div>
						</div>

						<div class="content-footer">
							<el-button type="primary" @click='submitForm()'>保存</el-button>
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
	export default {
		name: 'masks',
		props: {
			user: {
				type: Object,
				default: function(){
					return {
						companyId: '',
						deptId: '',
						password: '',
						sex: '',
						email: '',
						phone: '',
						enabled: 1,
						birthday: '',
						worknumber: '',
						nickname: '',
						idnumber: '',
						entrytime: '',
						address: '',
						tips: '',
						username: '',
						companyName:'',
						roleId: '',//角色
//						roles: [],//角色
						id: '',
					}
				}
			},
			page: Object ,
		},		
		data() {
			var validatePass1 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('必填'));
				} else {
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('必填'));
				} else {
					callback();
				}
			};
			var validatePass3 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('必填'));
				} else {
					callback();
				}
			};
			var validatePass4 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('必填'));
				} else {
					callback();
				}
			};
			var validatePass5 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('必填'));
				} else {
					callback();
				}
			};
			var validatePass6 = (rule, value, callback) => {
                var regidnumber = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
                if (!regidnumber.test(this.user.idnumber)) {
                   callback(new Error('身份证号填写有误'));
                } else {
                    callback();
                }
            };
            var validatePass7 = (rule, value, callback) => {
                var regphone = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/; 
                 if(!regphone.test(this.user.phone)){
                   callback(new Error('手机格式不正确'));
                }else{
                    callback();
                }
            };
            var validatePass8 = (rule, value, callback) => {
                  var regEmail= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                 if(!regEmail.test(this.user.email)){
                   callback(new Error('邮箱格式不正确'));
                }else{
                    callback();
                }
            };
			return {
				basic_url: Config.dev_url,
				editSearch: '',
				edit: true, //禁填
				'男': true,
				'女': false,
				col_but1: true,
				col_but2: true,
				show1:false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				useritem: [],
				labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				rules: {
					companyName: [{
						required: true,
						//						trigger: 'change',
						validator: validatePass1,
					}],
					deptName: [{
						required: true,
						//						trigger: 'change',
						validator: validatePass2,
					}],
					roleId: [{						
						required: true,
						trigger: 'blur',
						validator: validatePass3,
					}],
					username: [{
						required: true,
						trigger: 'blur',
						validator: validatePass4,
					}],
					password: [{
						required: true,
						trigger: 'blur',
						validator: validatePass5,
					}],
					idnumber: [{
						trigger: 'blur',
						validator: validatePass6,
					}],
					phone: [{
						trigger: 'blur',
						validator: validatePass7,
					}],
					email: [{
						trigger: 'blur',
						validator: validatePass8,
					}]
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				selectData: [],
			};
		},
		methods: {
			col_but(col_but) {
				if(col_but == 'col_but1') {
					this.col_but1 = !this.col_but1;
					this.down = !this.down,
					this.up = !this.up
				}
				if(col_but == 'col_but2') {
					this.col_but2 = !this.col_but2;
					this.down = !this.down,
					this.up = !this.up
				}
			},
			//form表单内容清空
			resetNew(){
                this.user = {
					companyName:'',
					deptName:'',
					username:'',
					password:'',
					nickname:'',
					birthday:'',
					sexName:'',
					idnumber:'',
					entrytime:'',
					roleId:'',
					worknumber:'',
					phone:'',
					email:'',
					address:'',
					tips:''
				}
                this.$refs["user"].resetFields();
            },
			//数据限制
			showdatalimit(){
				this.show1 = true;
			},
			// 这里是修改
			detail() {
				this.show = true;
				var url = this.basic_url + '/api-user/users/' + userid;
				this.$axios.get(url, {}).then((res) => {
					this.user = res.data;
					this.show = true;
				}).catch((err) => {});
			},
			//点击关闭按钮
			close() {
				this.show1 = false;
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
			getCheckedNodes() {
				this.checkedNodes = this.$refs.tree.getCheckedNodes()
			},
			//保存users/saveOrUpdate
			submitForm() {
				this.$refs.user.validate((valid) => {
					if(valid) {
						var user = this.user;
						user.sex = user.sexName == '男' ? 1 : 0;
						user.roleId = user.roleId.join(',');	
						var url = this.basic_url + '/api-user/users/saveOrUpdate';
						this.$axios.post(url, this.user).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
								this.show = false;
								//重新加载数据
								this.$emit('request')
							}
						}).catch((err) => {});
					} else {
						return false;
					}
				})
			},
			//所属组织
			getCompany() {
				this.editSearch = 'company';
				var page = this.page.currentPage;
				var limit = this.page.pageSize;
				var type = 1;
				var url = this.basic_url + '/api-user/depts/type';
				this.$axios.get(url, {
					params: {
						page: page,
						limit: limit,
						type: type
					},
				}).then((res) => {
					this.resourceData = res.data.data;
					this.dialogVisible = true;
				});
			},  
			//所属机构
			getDept() {
				this.editSearch = 'dept';
				var page = this.page.currentPage;
				var limit = this.page.pageSize;
				var type = 2;
				var url = this.basic_url + '/api-user/depts/type';
				this.$axios.get(url, {
					params: {
						page: page,
						limit: limit,
						type: type
					},
				}).then((res) => {
					this.resourceData = res.data.data;
					this.dialogVisible = true;
				});
			},
			//角色
			getRole() {
				this.editSearch = 'role';
				var page = this.page.currentPage;
				var limit = this.page.pageSize;
				var url = this.basic_url + '/api-user/roles';
				this.$axios.get(url, {
					params: {
						page: page,
						limit: limit,
					},
				}).then((res) => {
					this.selectData = res.data.data;
					}).catch(error =>{})
			},
		  	changeRole(event){
		  	 	this.user.roleId=[]
		  	 	for (var i=0;i<event.length;i++){	
		  	 		this.user.roleId.push(event[i])
		  	 	}		  	 	
          	},
			queding() {
				this.getCheckedNodes();
				this.placetext = false;
				this.dialogVisible = false;
				if(this.editSearch == 'company') {
					this.user.companyId = this.checkedNodes[0].id;
					this.user.companyName = this.checkedNodes[0].simplename;
				} else {
					this.user.deptId = this.checkedNodes[0].id;
					this.user.deptName = this.checkedNodes[0].simplename;
				}
			},
		},
		mounted() {
			this.getRole();
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>