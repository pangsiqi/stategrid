<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加设备分类</div>
					<div class="mask_title" v-show="modifytitle">修改设备分类</div>
					<div class="mask_title" v-show="viewtitle">查看设备分类</div>
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
								<el-collapse-item title="设备分类" name="1">
									<el-row :gutter="20" class="pb10">
										<el-col :span="6" class="pull-right">
											<el-form-item label="设备编码">
												<el-input v-model="CATEGORY.CLASSIFY_NUM" placeholder="自动生成" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
												<el-form-item label="父级分类" prop="PARENTDesc">
													<el-tooltip class="item" effect="dark" content="不选父级或清空已选的父级，可设此条数据为一级分类" placement="top">
															<el-input v-model="CATEGORY.PARENTDesc" :disabled="true">
																<el-button slot="prepend" icon="icon-close2" @click="addparclassReset" :disabled="noedit" title="清空"></el-button>
																<el-button slot="append" icon="el-icon-search" @click="addparclass" :disabled="noedit"></el-button>
															</el-input>
													</el-tooltip>
												</el-form-item>
										</el-col>
										<el-col :span="16">
											<el-form-item label="分类描述" prop="CLASSIFY_DESCRIPTION">
												<el-input v-model="CATEGORY.CLASSIFY_DESCRIPTION" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="其它" name="2" v-show="views">
									<el-row>
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc">
												<el-input v-model="CATEGORY.ENTERBYDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE">
												<el-input v-model="CATEGORY.ENTERDATE" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构" prop="DEPTIDDesc">
												<el-input v-model="CATEGORY.DEPTIDDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人" prop="CHANGEBYDesc">
												<el-input v-model="CATEGORY.CHANGEBYDesc" placeholder="当前修改人" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="CHANGEDATE">
												<el-input v-model="CATEGORY.CHANGEDATE" placeholder="当前修改时间" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="save('Update')">保存</el-button>
							<el-button type="success" @click="save('Submit')" v-show="addtitle">保存并继续</el-button>
							<!-- <el-button v-if="modify" type="primary" class="btn-primarys" @click="modifyversion('CATEGORY')">修订</el-button> -->
							<!-- <el-button v-if="modify" type="success" @click="update('CATEGORY')">启用</el-button> -->
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
			<!-- 弹出 -->
			<el-dialog :modal-append-to-body="false" title="设备分类" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
				<el-tree ref="tree" :data="resourceData" show-checkbox node-key="id" :default-checked-keys="resourceCheckedKey" :props="resourceProps" default-expand-all @node-click="handleNodeClick" @check-change="handleClicks" check-strictly>
				</el-tree>
				<span slot="footer">
			       <el-button type="primary" @click="queding">确 定</el-button>
			       <el-button @click="resetBasisInfo">取 消</el-button>
			    </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	export default {
		name: 'masks',
		props: {
			CATEGORY: {
				type: Object,
				default: function() {
					return {
						ID: '',
						NUM: '',
						TYPE: '',
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
				falg:false,//保存验证需要的
				basic_url: Config.dev_url,
				selUser: [],
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				activeNames: ['1','2'], //手风琴数量
				//labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				selectData: [],
				rules: {
					//设备分类描述
					CLASSIFY_DESCRIPTION: [
						{required: true,trigger: 'blur', message: '必填'},
						{trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
				},
				resourceProps: {
					children: "children",
					label: "CLASSIFY_DESCRIPTION"
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
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
				// statusshow1:true,
				// statusshow2:false,
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
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			//生成随机数函数
			rand(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			},
			
			//父级分类
			addparclass(){
				this.dialogVisible = true;
				let that = this;
				var url = this.basic_url + '/api-apps/app/assetClass/tree?tree_id=CLASSIFY_NUM&tree_pid=PARENT';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data.datas;
					this.treeData = this.transformTree(this.resourceData);
				});
			},
			addparclassReset(){//置空父级分类
				this.CATEGORY.PARENT ='0';
				this.CATEGORY.PARENTDesc ='';
			},
			queding() {
				this.getCheckedNodes();
				if(this.checkedNodes == ''){
					this.$message({
						message:'请选择数据',
						type:'warning'
					})
				}else{					
					this.placetext = false;
					// this.dialogVisible = false;	
					this.CATEGORY.PARENT = this.checkedNodes[0].CLASSIFY_NUM;
					this.CATEGORY.PARENTDesc = this.checkedNodes[0].CLASSIFY_DESCRIPTION;
					this.resetBasisInfo();//调用resetBasisInfo函数
				}				
			},
			resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
				this.dialogVisible = false;//关闭弹出框
				this.resourceData = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 20;//页码重新传值
			},
			handleNodeClick(data) { //获取勾选树菜单节点
				
			},
			handleClicks(data,checked, indeterminate) {
				this.getCheckboxData = data;
						this.i++;
						if(this.i%2==0){
							if(checked){
									this.$refs.tree.setCheckedNodes([]);
									this.$refs.tree.setCheckedNodes([data]);
									//交叉点击节点
								}else{
									this.$refs.tree.setCheckedNodes([]);
									//点击已经选中的节点，置空
							}
					}
			},
			transformTree(data) {
				for(var i = 0; i < data.length; i++) {
					data[i].name = data[i].fullname;
					if(!data[i].pid || $.isArray(data[i].subDepts)) {
						data[i].iconClass = 'icon-file-normal';
					} else {
						data[i].iconClass = 'icon-file-text';
					}
					if($.isArray(data[i].subDepts)) {
						data[i].children = this.transformTree(data[i].subDepts);
					}
				}
				return data;
			},
			getCheckedNodes() {
				this.checkedNodes = this.$refs.tree.getCheckedNodes()
			},
			//添加显示弹窗
			visible() {
				//this.CATEGORY.NUM =  this.rand(1000,9999);
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.CATEGORY.DEPTID = res.data.deptId;
					this.CATEGORY.ENTERBY = res.data.id;
					// this.CATEGORY.ENTERBYDesc = res.data.nickname;
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
				// this.statusshow1 = true;
				// this.statusshow2 = false;
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
				// this.statusshow1 = false;
				// this.statusshow2 = true;
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.CATEGORY.CHANGEBY = res.data.id;
					// this.CATEGORY.CHANGEBYDesc = res.data.nickname;
					var date = new Date();
					this.CATEGORY.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					//深拷贝数据
					// let _obj = JSON.stringify(this.CATEGORY);
        			// this.category = JSON.parse(_obj);
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
			//点击修订按钮
			modifyversion(CATEGORY) {
				this.$refs[CATEGORY].validate((valid) => {
					if(valid) {
						var category=JSON.stringify(this.category); 
	 					var CATEGORY=JSON.stringify(this.CATEGORY);
					 	if(category==CATEGORY){
					  	this.$message({
								message: '没有修改内容，不允许修订！',
								type: 'warning'
							});
							return false;
					    }else{
							var url = this.basic_url + '/api-apps/app/productType/operate/upgraded';
							this.$axios.post(url, this.CATEGORY).then((res) => {
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
			//点击更新按钮
			update(CATEGORY) {
				var data = {
					id: this.CATEGORY.ID,
				}
				this.$axios.get(this.basic_url+ '/api-apps/app/productType/operate/updateRelate', {
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
			// 保存users/saveOrUpdate
			save(parameter) {
				this.$refs.CATEGORY.validate((valid) => {
					if(this.CATEGORY.PARENT == ''||this.CATEGORY.PARENT == undefined){
						this.CATEGORY.PARENT = '0';
					}
					if(valid) {
						this.CATEGORY.STATUS = ((this.CATEGORY.STATUS == "1" || this.CATEGORY.STATUS == '活动') ? '1' : '0');
						var url = this.basic_url + '/api-apps/app/assetClass/saveOrUpdate';
						this.$axios.post(url, this.CATEGORY).then((res) => {
							//resp_code == 0是后台返回的请求成功的信息
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								if(parameter=='Update'){
									this.show=false;
								}else{
									this.show=true;
								}
								//重新加载数据
									this.$emit('request');
									this.$emit('reset');
									this.visible();
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