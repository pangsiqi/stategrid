<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加字典数据</div>
					<div class="mask_title" v-show="modifytitle">修改字典数据</div>
					<div class="mask_title" v-show="viewtitle">查看字典数据</div>
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
					<el-form inline-message :model="dictionarieForm" :rules="rules" ref="dictionarieForm" class="demo-user">
						<div class="content-accordion">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基础信息" name="1">
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="类型编码" prop="code" label-width="100px">
												<el-input v-model="dictionarieForm.code" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="类型名称" prop="name" label-width="100px">
												<el-input v-model="dictionarieForm.name" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="排序" prop="sort" label-width="100px">
												<el-input v-model="dictionarieForm.sort" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="24">
											<el-form-item label="备注" prop="tips" label-width="100px">
												<el-input type="textarea" row="2" v-model="dictionarieForm.tips" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>

								<div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion>
									<el-tabs v-model="activeName" @tab-click="handleClick">
										<el-tab-pane label="字典值列表" name="first">
											<div class="table-func table-funcb" v-show="noviews">
												<el-button type="success" size="mini" round @click="addfield1" v-show="!viewtitle">
													<i class="icon-add"></i><font>新建行</font>
												</el-button>
											</div>
											<el-table :header-cell-style="rowClass" :fig="true" :data="dictionarieForm.subDicts" row-key="ID" border stripe max-height="260" highlight-current-row style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'dictionarieForm.subDicts', order: 'descending'}">
												<el-table-column prop="iconOperation" fixed width="50">
													<template slot-scope="scope">
														<div v-show="noviews" style="width: 50px;">
															<i class="el-icon-check" v-if="scope.row.isEditing"></i>
															<i class="el-icon-edit" v-else></i>
														</div>
													</template>
												</el-table-column>

												<el-table-column prop="sort" label="排序" sortable width="120">
													<template slot-scope="scope">
														<el-form-item :prop="'subDicts.'+scope.$index + '.sort'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
															<el-input v-if="scope.row.isEditing" size="small" v-model="scope.$index + 1" placeholder="请输入">
															</el-input>
															<span v-else>{{scope.row.sort}}</span>
														</el-form-item>
													</template>
												</el-table-column>
												<!-- <el-table-column width="50"></el-table-column> -->
												<el-table-column prop="name" label="值名称" sortable>
													<template slot-scope="scope">
														<el-form-item :prop="'subDicts.'+scope.$index + '.name'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
															<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.name" placeholder="请输入值名称">
															</el-input>
															<span v-else>{{scope.row.name}}</span>
														</el-form-item>
													</template>
												</el-table-column>
												<el-table-column prop="code" label="值代号" sortable>
													<template slot-scope="scope">
														<el-form-item :prop="'subDicts.'+scope.$index + '.code'" :rules="[{required: true, message: '不能为空', trigger: 'blur'},{trigger: 'blur', validator: Validators.isSpecificKey}]">
															<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.code" placeholder="请输入值名称的代号，一般用数字表示">
															</el-input>
															<span v-else>{{scope.row.code}}</span>
														</el-form-item>
													</template>
												</el-table-column>
												<el-table-column fixed="right" label="操作" width="120" v-if="!viewtitle">
													<template slot-scope="scope">
														<el-button @click ="deleteRow(scope.$index,scope.row,'tableList')" type="text" size="small">
															<i class="icon-trash red"></i>
														</el-button>
													</template>
												</el-table-column>
											</el-table>
										</el-tab-pane>
									</el-tabs>
								</div>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
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
		components: {

		},
		props: {
			// dictionarieForm: {
			// 	type: Object,
			// 	default: function(){
			// 		return {
			// 			code:'' ,
			// 			name: '',
			// 			tips: '',
			// 			sort: '',//排序
			// 			updateTime:'',
			// 			updateUser:'',
			// 			createTime:'',
			// 			createUser:''
			// 		}
			// 	}
			// },
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
				basic_url: Config.dev_url,
				modify:false,//修订、修改人、修改时间
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				activeName: 'first', //tabs
				activeNames: ['1','2'], //手风琴数量
//				labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				rules: {
					code: [
						{ required: true, message: '必填', trigger: 'blur'},
						{ trigger: 'blur', validator: this.Validators.isWorknumber}
					],
					name: [
						{ required: true, message: '必填',trigger: 'blur'},
						{ validator: this.Validators.isSpecificKey, trigger: 'blur'}
					],
					sort: [{ required: false, trigger: 'blur',validator: this.Validators.isSpecificKey}],
					tips: [{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],
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
				index:0,
				dictionarieForm: {
					subDicts: [],
				}
			};
		},
		methods: {
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			handleClick(tab, event) {
			},
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing;
				}
			},
			//清空
			reset() {
				this.dictionarieForm = {
					code: '',
					name: '',
					tips: '',
					sort: '',
					subDicts: [],
				}
			},
			//添加内容时从父组件带过来的
			childMethods() {
				this.reset();
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.dictionarieForm.createUser=res.data.id;
					this.dictionarieForm.sort=0;
					var date=new Date();
					this.dictionarieForm.createTime = this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
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
			},
			
			// 这里是修改
			detail(dataid) {
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
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.dictionarieForm.updateUser=res.data.id;
					var date=new Date();
					this.dictionarieForm.updateTime = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err)=>{
				});
				var url = this.basic_url + '/api-user/dicts/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					for(var i = 0;i<res.data.subDicts.length;i++){
						res.data.subDicts[i].isEditing = false;
					}
					this.dictionarieForm = res.data;
					this.show = true;
				}).catch((err) => {
				});
            	
			},
			//这是查看
			view(dataid) {
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.dept = true;
				this.noedit = true;//表单内容
				this.views = true;//录入修改人信息
				this.noviews = false;//按钮
				this.show = true;
				var url = this.basic_url + '/api-user/dicts/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					this.dictionarieForm = res.data;
					this.show = true;
				}).catch((err) => {
				});
			},
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');
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
			//保存users/saveOrUpdate
			submitForm() {
				this.$refs.dictionarieForm.validate((valid) => {
					if(valid) {
						this.dictionarieForm.hidden=this.dictionarieForm.hidden?1:0
						var dictionarieForm = this.dictionarieForm;
						var url = this.basic_url + '/api-user/dicts/saveOrUpdate';
						this.$axios.post(url, this.dictionarieForm).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
								this.show = false;
								//重新加载数据
								this.$emit('request')
								this.$refs["dictionarieForm"].resetFields();
								this.show = false;
							} else {
								this.$message({//新加的异常后端返回提示消息
									 message: res.data.resp_msg,
									type: 'warning'
								});
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
			addfield1() {
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.enterby = res.data.id
					var date = new Date();
					this.currentDate = this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
					this.index = this.index + 1;
					var obj = {
						sort: this.index,
						code: '' ,
						name: '',
						isEditing: true
					};
					this.dictionarieForm.subDicts.push(obj);
				}).catch((err) => {
				})

			// addfield1() {
			// 	// this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
			// 	// 	this.createUser = res.data.id
			// 	// 	var date = new Date();
			// 	// 	this.createTime = this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
			// 	// 	this.index = this.index + 1;
			// 		var obj = {
			// 			pid: this.index,
			// 			code: '' ,
			// 			name: '',
			// 			//sort: '',//排序
			// 			//createTime: this.createTime,
			// 			//createUser: this.createUser,
			// 			//少附件
			// 			isEditing: true,
			// 		};
			// 		this.dictionarieForm.subDicts.push(obj);
			// 	// }).catch((err) => {
			// 	// 	this.$message({
			// 	// 		message: '网络错误，请重试',
			// 	// 		type: 'error'
			// 	// 	})
			// 	// })

			 },
			//刪除新建行
			deleteRow(index, row, listName){
				var TableName = '';
				if(listName =='tableList'){
					TableName = 'subDicts';
				}
				if(row.id){
					var url = this.basic_url + '/api-user/dicts/' + TableName +'/' + row.id;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {}).then((res) => {
							
							if(res.data.resp_code == 0){
								this.dictionarieForm[TableName].splice(index,1);
								this.$message({
									message: '删除成功',
									type: 'success'
								});
							}else{
								this.$message({
									message: res.data.resp_msg,
									type: 'error'
								});
							}
						}).catch((err) => {
						});
					}).catch(() => {

					});
				}else{
					this.dictionarieForm[TableName].splice(index,1);
				}
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

	#FHScrollbar { overflow-y: scroll;}
</style>