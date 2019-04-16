<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加菜单</div>
					<div class="mask_title" v-show="modifytitle">修改菜单</div>
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
					<el-form inline-message :model="menu" :rules="rules" ref="menu" label-width="100px" class="demo-user">
						<div class="content-accordion">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基础信息" name="1">
									<el-row :gutter="30">
										<el-col :span="24">
											<el-form-item label="所属上级" prop="pName">
												<el-input v-model="menu.pName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getParentId"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="菜单名称" prop="name">
												<el-input v-model="menu.name" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="链接地址" prop="url">
												<el-input v-model="menu.url" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="排序" prop="sort">
												<el-input v-model="menu.sort" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row :gutter="30">
										<!--是否影藏-->
										<el-col :span="8">
											<el-form-item label="是否显示" prop="hidden">
												<el-switch active-color="#5B7BFA" inactive-color="#dadde5" v-model="menu.hidden" @change="changeval">
												</el-switch>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="菜单图标" prop="css">
												<el-input v-model="menu.css" :disabled="edit">
													<i :class="menu.css" slot="prepend"></i>
													<el-button slot="append" icon="el-icon-search" @click="getCss"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
                                            <el-form-item label="是否允许授权" prop="canauthorization">
                                                <el-radio-group v-model="menu.canauthorization">
                                                    <el-radio label='1'>是</el-radio>
                                                    <el-radio label='0'>否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
									</el-row>
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
			<!--选择所属上级弹出框 Begin-->
			<el-dialog :modal-append-to-body="false" title="选择所属上级" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
				<el-tree ref="tree" :data="resourceData" show-checkbox node-key="id" :default-checked-keys="resourceCheckedKey" :props="resourceProps">
				</el-tree>
				<div slot="footer">
			       <el-button type="primary" @click="confirm();" >确 定</el-button>
			       <el-button @click="dialogVisible = false">取 消</el-button>
			    </div>
			</el-dialog>
			<!--选择所属上级弹出框 End-->
		</div>

			<!--应用中心图标弹出 Begin-->
	        <div class="mask" v-show="show2"></div>
			<div class="mask_divbg" v-show="show2">
				<div class="mask_div">
					<div class="mask_title_div clearfix">
						<div class="mask_title">应用中心图标</div>
						<div class="mask_anniu">
							<span class="mask_span mask_max" @click="toggle">
								<i v-bind:class="{ 'icon-maximization': isok1, 'icon-restore':isok2}"></i>
							</span>
							<span class="mask_span" @click='close2'>
								<i class="icon-close1"></i>
							</span>
						</div>
					</div>
					<div id="FHScrollbar" :style="{height: fullHeight}">
						<div class="content-accordion">
							<all_icons v-on:childByValue="childByValue"></all_icons>
						</div>
						<div class="content-footer">
							<el-button type="primary" @click="confirm2();" >确 定</el-button>
							<el-button @click='close2'>取 消</el-button>
						</div>
					</div>
				</div>
			</div>
			<!--应用中心图标弹出 End-->	    
		
	</div>
</template>

<script>
	import Config from '../../config.js'
	import deliver from '../../assets/js/deliver.js'
	import all_icons from '../common/all_icons.vue'//弹出框
	export default {
		name: 'masks',
		components: {
			'all_icons':all_icons,
		},
		props: {
			menu: {
				type: Object,
				default: function(){
					
					return {
						parentId:'' ,
						name: '',
						url: '',
						sort: '',
						hidden:1 ,
						css: '',
						isMenu: 0,
						roled:0,
					}
				}
			},
		},

		data() {
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('必填'));
				} else {
					callback();
				}
			};
			

			return {
				falg:false,//保存验证需要的
				basic_url: Config.dev_url,
				edit: true, //禁填
				col_but1: true,
				col_but2: true,
				show: false,
				show2:false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				activeNames: ['1'], //手风琴数量
//				labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				addtitle:true,
				modifytitle:false,
				fullHeight: document.documentElement.clientHeight - 200 +'px',//获取浏览器高度
				rules: {
					// pName: [{required: true,trigger: 'blur',validator: validatePass}],
					name: [
						{required: true,message: '必填',trigger: 'blur'},
						{validator: this.Validators.isNickname, trigger: 'blur'}
					],
					url: [
						{required: true,message: '必填',trigger: 'blur'},
						{validator: this.Validators.isLinkURL, trigger: 'blur'}
					],
					sort: [{required: false,trigger: 'blur',validator: this.Validators.isInteger}],
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "name"
				},
				noedit:false,
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
			//添加显示弹窗
			visible() {
				this.modifytitle=false;
				this.show = true;
				this.noedit = false;
			},
			
			// 这里是修改
			detail(item) {
				this.addtitle=false;
				this.modifytitle=true;
				if(item.hidden == '0'){
					item.hidden = true;
				}else if(item.hidden == '1'){
					item.hidden = false;
				}
				
				this.show = true;
				this.noedit = false;
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
				this.noedit = true;
			},
			//点击关闭按钮
			close() {
				this.show = false;
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
			getCheckedNodes() {
				this.checkedNodes = this.$refs.tree.getCheckedNodes()
			},

			//保存users/saveOrUpdate
			submitForm() {
				if(this.menu.parentId == ''){//上级为空给后台传-1表示为一级菜单
					this.menu.parentId = '-1';
				}
				this.$refs.menu.validate((valid) => {
					if(valid) {
						this.menu.hidden = this.menu.hidden?0:1;
						var menu = this.menu;			
						var url = this.basic_url + '/api-user/menus/saveOrUpdate';
						this.menutest={
								"id":this.menu.id,
								"parentId":this.menu.parentId ,
								"name":this.menu.name,
								"url":this.menu.url,
								"sort":this.menu.sort,
								"hidden":this.menu.hidden,
								"css":this.menu.css,
								"canauthorization":this.menu.canauthorization,
							}
					
						//return false;
					
						this.$axios.post(url, this.menutest).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
								this.show = false;
								//重新加载数据
								this.$emit('request')
								this.$refs["menu"].resetFields();
							}
						}).catch((err) => {
						});
					} else {
						this.$message({
							message: '有必填项未填写，请填写',
							type: 'warning'
						});
						this.show = true;
					}
				})
			},
			//所属上级
			getParentId() {
				var url = this.basic_url + '/api-user/menus/findOnes';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data.data;
					this.dialogVisible = true;
				});
			},
			//图标
			getCss(){
				this.show2 = true;
			},
			confirm() {
				this.getCheckedNodes();
				this.placetext = false;
				this.dialogVisible = false;
				this.menu.parentId = this.checkedNodes[0].id;
				this.menu.pName = this.checkedNodes[0].name;
			},
		    childByValue: function (childValue) {
		        // childValue就是子组件传过来的值
		        this.sendchildValue = childValue;
		      
		    },
		    //应用中心图标关闭
		    close2(){
				this.show2 = false;
			},
			//应用中心图标确定
			confirm2() {
				this.menu.css = this.sendchildValue;
				this.show2 = false;
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
			changeval(Callbackvaule){
				// this.menu.hidden=Callbackvaule?1:0;
			},
			toggleStatus(state){
			
			}

		},
		mounted() {

		},

	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';

	#FHScrollbar { overflow-y: scroll;}
</style>