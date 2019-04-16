<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加数据限制</div>
					<div class="mask_title" v-show="modifytitle">修改数据限制</div>
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
					<el-form inline-message :model="CATEGORY" :rules="rules" ref="CATEGORY" label-width="100px" class="demo-adduserForm">
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="数据限制配置" name="1">
									<el-row>
										<el-col :span="8">
											<el-form-item label="应用名称" prop="appName">
												<el-input v-model="CATEGORY.appName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getapp" :disabled="noedit"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="处理类名" prop="handleclass">
												<el-input v-model="CATEGORY.handleclass" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="16">
											<el-form-item label="sql语句" prop="sqlstr">												
                                                <el-input type="textarea" row="3" v-model="CATEGORY.sqlstr" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>										
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="save('Update')">保存</el-button>
							<el-button type="success" @click="save('Submit')" v-show="addtitle">保存并继续</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
			<appmask ref="appmask" @appdata='appdata' ></appmask>
		</div>
	</div>
</template>



<script>
	import Config from '../../config.js'
	import appmask from '../common/common_mask/applicationmask.vue'//产品类别
	export default {
		name: 'masks',
		components: {
			appmask
		},
		props: {
			CATEGORY: {
				type: Object,
				default: function() {
					return {
						id: '',
						appName: '',
                        sqlstr:'',
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
				loading: false,
				basic_url: Config.dev_url,
				selUser: [],
				edit: true, //禁填
				show: false,
				show2:false,
				isok1: true,
				isok2: false,
				activeNames: ['1','2'], //手风琴数量
				applicationList:[],//应用
				fullHeight: document.documentElement.clientHeight - 200 +'px',//获取浏览器高度
				rules: {
					name: [{required: true, trigger: 'change', validator: this.Validators.isSpecificKey,}],
					menuId: [{required: true, message: '请选择', trigger: 'change' }],
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				category:{},//从父组件接过来的值
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
			 // 按钮图标childValue就是子组件传过来的值
			childByValue: function (childValue) {
		        this.sendchildValue = childValue;
		    },
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			//图标
			getIcon(){
				this.show2 = true;
			},
			//按钮图标关闭
			close2(){
				this.show2 = false;
			},
			//按钮图标确定
			confirm2() {
				this.CATEGORY.icon = this.sendchildValue;
				this.show2 = false;
			},

			//添加显示弹窗
			visible() {
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.CATEGORY.DEPTID = res.data.deptId;
					this.CATEGORY.ENTERBY = res.data.id;
					var date = new Date();
					this.CATEGORY.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err) => {
				});
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
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.CATEGORY.CHANGEBY = res.data.id;
					// this.CATEGORY.CHANGEBYDesc = res.data.nickname;
					var date = new Date();
					this.CATEGORY.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					//深拷贝数据
					let _obj = JSON.stringify(this.CATEGORY);
        			this.category = JSON.parse(_obj);
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
			//获取应用
			getapp(){
				this.$refs.appmask.visible();
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
			// 保存users/saveOrUpdate
			save(parameter) {		
					if(true) {						
						var url = this.basic_url + '/api-user/dataRestrict/saveOrUpdate';
						this.$axios.post(url, this.CATEGORY).then((res) => {
							//resp_code == 0是后台返回的请求成功的信息
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								if(parameter=="Update"){
									this.show = false;
								}else{
									this.show = true;
									this.$emit('request');
								}
								this.$refs["CATEGORY"].resetFields(); //清空表单验证
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
					} else {
						this.show = true;
						this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
					}					
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
			//
			appdata: function (data) {
				this.CATEGORY.appName=data;
		    },
			
		},
		mounted() {
		},
	}
</script>

<style scoped>
	.el-table__body-wrapper 
	{
    overflow-y:scroll;
    }
	@import '../../assets/css/mask-modules.css';
</style>