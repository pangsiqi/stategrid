<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="!modify">添加关键字</div>
					<div class="mask_title" v-show="modify">修改关键字</div>
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
								<el-collapse-item title="关键字信息" name="1">
									<el-row :gutter="20" class="pb10">
										<el-col :span="5" class="pull-right">
											<!-- <el-input v-model="dataInfo.STATUS==1?'活动':'不活动'" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input> -->
										</el-col>
									</el-row>
									<el-form-item v-for="item in basicInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}">
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input'"></el-input>
										<el-select v-model="dataInfo[item.prop]" placeholder="请选择" v-if="item.type == 'select'">
											<el-option v-for="item in cats"
											:key="item.id"
											:label="item.categoryname"
											:value="item.id">
											</el-option>
										</el-select>
									</el-form-item>
								</el-collapse-item>
							</el-collapse>
						</div>

						<div class="content-footer">
							<el-button type="primary" @click='submitForm'>保存</el-button>
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
		props: ['detailData'],
		data() {
			return {
				rules: {
					keywordname: [
						{ required: true, message: '请输入关键字', trigger: 'blur' },
					],
					categoryid: [
						{ required: true, message: '请选择关键字分类', trigger: 'blur' },
					]
				},
				basicInfo: [
					{
						label: '关键字',
						prop: 'keywordname',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
					{
						label: '分类',
						prop: 'categoryid',
						width: '50%',
						type: 'select',
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
				modify: false,
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				selectData: [], 
				getCheckboxData: {},

				dataInfo: {
					'keywordid': '',
					'categoryid': '',	
					'keywordname': '',
					'userid': '',
					'username': '',
					'createtime': '',
					'deptid': '',
					'deptfullname': ''
				},
				cats: []
			};
		},
		methods: {
			getUser(opt){
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url,{}).then((res) => {
					if(opt == 'new'){
						this.dataInfo.userid = res.data.id;
						this.dataInfo.username = res.data.username;
						this.dataInfo.createtime = this.getToday();
						this.dataInfo.deptid = res.data.deptId;
						this.dataInfo.deptfullname = res.data.deptName;
					}else{
						this.dataInfo.userid = res.data.id;
						this.dataInfo.username = res.data.username;
						this.dataInfo.deptid = res.data.deptId;
						this.dataInfo.deptfullname = res.data.deptName;
					}
				}).catch((err) => {
				});
			},
			getToday(){
				var date = new Date();
				var month = date.getMonth();
				month++;
				var str = date.getFullYear() + '-' + month + '-'+ date.getDate() + ' ' +  date.getHours() + ':' + date.getMinutes()+ ':' + date.getSeconds() ;
				return str;
			},
			//添加显示弹窗
			visible() {
				this.getUser('new');
				this.modify=false;
				this.show = true;
				this.getCat();
			},
			// 这里是修改
			detail(dataid) {
				this.getUser();
				this.dataInfo = this.detailData;
				this.modify = true;
				this.show = true;
				this.getCat();
			},
			//点击关闭按钮
			close() {
				this.resetForm();
				this.$emit('request');
			},
			resetForm(){
				this.dataInfo =  {
					'keywordid': '',
					'categoryid': '',	
					'keywordname': '',
					'userid': '',
					'username': '',
					'createtime': '',
					'deptid': '',
					'deptfullname': ''
				};
				//this.$refs['dataInfo'].resetFields();
				this.show = false;
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

			submitForm() {
				var _this = this;
				var url = this.basic_url + '/api-apps/app/tbKeyword2/saveOrUpdate';
				this.$refs['dataInfo'].validate((valid) => {
					if (valid) {
						if(!this.modify){
							this.dataInfo.createtime = this.getToday();
						}
						this.$axios.post(url, _this.dataInfo).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
								this.resetForm();
								this.$emit('request');
							}else{
								this.$message({
									message: res.data.resp_msg,
									type: 'error',
								});
							}
						}).catch((err) => {
						});
					} else {
						var middleWidth=5;
						return false;
					}
				});
			},
			getCat(){
				var data = {
					page: 1,
					limit: 1000,
					categoryname: '',
					username: this.dataInfo.username,
				};
				var url = this.basic_url + '/api-apps/app/tbCategory2';
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					this.cats = res.data.data;
				}).catch((wrong) => {});
			}
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>