<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加产品</div>
					<div class="mask_title" v-show="modifytitle">修改产品</div>
					<div class="mask_title" v-show="viewtitle">查看产品</div>
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
					<el-form inline-message :model="PRODUCT" :rules="rules" ref="PRODUCT" label-width="100px" class="demo-adduserForm">
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="名称" name="1">
									<el-row class="pb10">
										<el-col :span="3" class="pull-right">
											<el-input v-model="PRODUCT.VERSION" :disabled="true">
												<template slot="prepend">版本</template>
											</el-input>
										</el-col>
										<!--<el-col :span="5" class="pull-right" v-if="modify" style="display:none;">
											<el-input v-model="PRODUCT.STATUS=='1'?'活动':'不活动'" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input>
										</el-col>
										<el-col :span="5" class="pull-right" v-else style="display:none;">
											<el-input v-model="PRODUCT.STATUS" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input>
										</el-col>-->
										<!-- <el-select v-model="PRODUCT.STATUS" placeholder="请选择信息状态">
												<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
												</el-option>
											</el-select> -->
									</el-row>

									<el-row>
										<!-- <el-col :span="8">
											<el-form-item label="产品编号" prop="PRO_NUM">
												<el-input v-model="PRODUCT.PRO_NUM" :disabled="edit" placeholder="自动生成"></el-input>
											</el-form-item>
										</el-col> -->
										<el-col :span="8">
											<el-form-item label="编码" prop="PRO_NUM">
												<el-input v-model="PRODUCT.PRO_NUM" placeholder="自动生成" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="16">
											<el-form-item label="产品" prop="PRO_NAME">
												<el-input v-model="PRODUCT.PRO_NAME" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8" v-if="dept">
											<el-form-item label="机构" prop="DEPTIDDesc">
												<el-input v-model="PRODUCT.DEPTIDDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="其它" name="2"  v-show="views">
									<el-row>
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc">
												<el-input v-model="PRODUCT.ENTERBYDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE">
												<el-input v-model="PRODUCT.ENTERDATE" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人" prop="CHANGEBYDesc">
												<el-input v-model="PRODUCT.CHANGEBYDesc" placeholder="当前修改人" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="CHANGEDATE">
												<el-input v-model="PRODUCT.CHANGEDATE" placeholder="当前修改时间" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="save('Update')">保存</el-button>
							<el-button type="success" @click="save('Submit')" v-show="addtitle">保存并继续</el-button>
							<el-button v-if="modify" type="primary" class="btn-primarys" @click="modifyversion('PRODUCT')">修订</el-button>
							<!-- <el-button v-if="modify" type="success" @click="update('PRODUCT')">启用</el-button> -->
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
			PRODUCT: {
				type: Object,
				default: function() {
					return {
						ID: '',
						PRO_NUM: '',
						PRO_NAME: '',
						STATUS: '',
						VERSION: '',
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
				basic_url: Config.dev_url,
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				selUser: [],
				modify: false, //修订、修改人、修改时间
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				activeNames: ['1', '2'], //手风琴数量
				//labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				selectData: [],
				rules: {
					PRO_NUM: [{
						required: false,
						trigger: 'blur',
						validator: this.Validators.isWorknumber,
					}],
					PRO_NAME: [{
						required: true,
						trigger: 'blur',
						validator: this.Validators.isSpecificKey,
					}],
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				product:{},
				hintshow:false,
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
			//编码提示
			// hint(){
			// 	this.hintshow = true;
			// },
			// hinthide(){
			// 	this.hintshow = false;
			// },
			// //获取导入表格勾选信息
			// SelChange(val) {
			// 	this.selUser = val;
			// },
			//导入添加数据按钮
			// leadadddata() {
			// 	var selData = this.selUser;
			// 	if(selData.length == 0) {
			// 		this.$message({
			// 			message: '请您选择数据',
			// 			type: 'warning'
			// 		});
			// 		return;
			// 	} else if(selData.length > 1) {
			// 		this.$message({
			// 			message: '不可同时选择多条数据',
			// 			type: 'warning'
			// 		});
			// 		return;
			// 	} else {
			// 		this.dataInfo.attributes.push(selData[0]);
			// 		this.dialogVisible = false;
			// 	}
			// },
			//生成随机数函数
			// rand(min, max) {
			// 	return Math.floor(Math.random() * (max - min)) + min;
			// },
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

				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.PRODUCT.ID = '',
					this.PRODUCT.DEPTID = res.data.deptId;
					this.PRODUCT.ENTERBY = res.data.id;
					var date = new Date();
					this.PRODUCT.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					this.PRODUCT.DEPARTMENT = '';
					this.PRODUCT.VERSION = '1';
					this.PRODUCT.STATUS = '活动';
				}).catch((err) => {
				});
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

				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.PRODUCT.CHANGEBY = res.data.id;
					var date = new Date();
					this.PRODUCT.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					//深拷贝数据
					let _obj = JSON.stringify(this.PRODUCT);
        			this.product = JSON.parse(_obj);
				}).catch((err) => {
				});
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
			},
			// 保存users/saveOrUpdate
			save(parameter) {
				this.$refs.PRODUCT.validate((valid) => {
					if(valid) {
						this.PRODUCT.STATUS = ((this.PRODUCT.STATUS == "1" || this.PRODUCT.STATUS == '活动') ? '1' : '0');
						if(this.PRODUCT.ID!=null&&this.PRODUCT.ID!=undefined&&this.PRODUCT.ID!=''){
							this.$confirm('是否需要修订版本？').then(_ => {
								this.modifyversion();
							}).catch(_ => {
								this.close();
							});	
						}else{
						var url = this.basic_url + '/api-apps/app/product/saveOrUpdate';
						this.$axios.post(url, this.PRODUCT).then((res) => {
							//resp_code == 0是后台返回的请求成功的信息
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								if(parameter=="Update"){
									this.show = false;
									this.$emit('request');
								}else{
									this.show = true;
									this.visible()
								}
								this.$refs["PRODUCT"].resetFields(); //清空表单验证
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
			//点击修订按钮
			modifyversion() {
				this.$refs.PRODUCT.validate((valid) => {
					if(valid) {
					var product = JSON.stringify(this.product); 
 					var PRODUCT = JSON.stringify(this.PRODUCT);
					 	if(product == PRODUCT){
						  	this.$message({
								message: '没有修改内容，不允许修订',
								type: 'warning'
							});
							return false;
					  	}else{
							var url = this.basic_url + '/api-apps/app/product/operate/upgraded';
							console.log(this.PRODUCT);
							this.$axios.post(url, this.PRODUCT).then((res) => {
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
			update(PRODUCT) {
				var data = {
					id: this.PRODUCT.ID,
				}
				this.$axios.get(this.basic_url+ '/api-apps/app/product/operate/updateRelate', {
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
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
			}
		}
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>