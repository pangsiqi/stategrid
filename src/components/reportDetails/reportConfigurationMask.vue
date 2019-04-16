<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加报表配置</div>
					<div class="mask_title" v-show="modifytitle">修改报表配置</div>
					<div class="mask_title" v-show="viewtitle">查看报表配置</div>
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
					<el-form inline-message :model="dataInfo" :label-position="labelPositions" :rules="rules" ref="dataInfo" class="demo-ruleForm">
						<div class="content-accordion">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基本信息" name="1">
									<el-row :gutter="5" class="pb10">
										<el-col :span="5" class="pull-right">
											<el-input v-model="dataInfo.status" :disabled="edit">
												<template slot="prepend">状态</template>
											</el-input>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="代码" prop="code" label-width="110px">
												<el-input v-model="dataInfo.code" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="文件" prop="file" label-width="110px">
												<el-input v-model="dataInfo.file" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="文件名称" prop="name" label-width="110px">
												<el-input v-model="dataInfo.name" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row >
										<el-col :span="8">
											<el-form-item label="类型" prop="type" label-width="110px">
												<el-input v-model="dataInfo.type" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="备注" prop="remarks" label-width="110px">
												<el-input v-model="dataInfo.remarks" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
							</el-collapse-item>
								<div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion>
									<el-tabs v-model="activeName" @tab-click="handleClick">
									    <el-tab-pane label="子表" name="first">
									    	<div class="table-func table-funcb">
												<el-button type="success" size="mini" round @click="addcheckProCont"  v-show="!viewtitle">
													<i class="icon-add"></i>
													<font>新建行</font>
												</el-button>
											</div>

											<el-table :data="dataInfo.params" row-key="ID" border stripe :fit="true" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'dataInfo.params', order: 'descending'}">

												<el-table-column prop="iconOperation" fixed label="" width="50px" v-if="!viewtitle">
													<template slot-scope="scope">
														<i class="el-icon-check" v-if="scope.row.isEditing"></i>
														<i class="el-icon-edit" v-else></i>
													</template>
												</el-table-column>


												<el-table-column prop="param" label="参数" sortable width="120px">
													<template slot-scope="scope">
														<el-form-item :prop="'params.'+scope.$index + '.param'" >
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.param" :disabled="noedit">
														</el-input>
														<span v-else>{{scope.row.param}}</span>
														</el-form-item>
													</template>
												</el-table-column>

												<el-table-column prop="label" label="参数名称" sortable>
													<template slot-scope="scope">
														<el-form-item :prop="'params.'+scope.$index + '.label'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.label" placeholder="请输入参数名称">
														</el-input>
														<span v-else>{{scope.row.label}}</span>
														</el-form-item>
													</template>
												</el-table-column>

												<!--<el-table-column prop="defaultVal" label="默认值" sortable width="120px">
													<template slot-scope="scope">
														<el-form-item :prop="'params.'+scope.$index + '.defaultVal'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.defaultVal" placeholder="请输入分包方名称">
														</el-input>
														<span v-else>{{scope.row.defaultVal}}</span>
														</el-form-item>
													</template>
												</el-table-column>-->

												<el-table-column prop="required" label="必填" sortable width="180px">
													<template slot-scope="scope">
												<el-form-item :prop="'params.'+scope.$index + '.required'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
													<el-select v-if="scope.row.isEditing" v-model="scope.row.required" filterable allow-create default-first-option placeholder="请选择">
										    <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
										    		</el-select>
														<span v-else>{{scope.row.requiredDesc}}</span>
												</el-form-item>
													</template>
												</el-table-column>

												<el-table-column prop="type" label="类型" sortable width="220px">
													<template slot-scope="scope">
														<el-form-item :prop="'params.'+scope.$index + '.type'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-select v-if="scope.row.isEditing" v-model="scope.row.type" filterable allow-create default-first-option placeholder="请选择">
										    <el-option v-for="(data,index) in selectData" :key="index" :value="data.code" :label="data.name"></el-option>
														</el-select>
														<span v-else>{{scope.row.typeDesc}}</span>
														</el-form-item>
													</template>
												</el-table-column>
												
												<el-table-column fixed="right" label="操作" width="120">
													<template slot-scope="scope">
														<el-button @click.native.prevent="deleteRow(scope.$index,dataInfo.params)" type="text" size="small" v-if="!viewtitle">
															 <i class="icon-trash red"></i>
														</el-button>
													</template>
												</el-table-column>

											</el-table>
									    </el-tab-pane>
									</el-tabs>
								</div>
								<el-collapse-item title="其他" name="3" v-show="views">
									<div class="accordion-body tab-content">
										<el-row >
											<el-col :span="8">
												<el-form-item label="录入人" prop="createbyDesc" label-width="110px">
													<el-input v-model="dataInfo.createbyDesc" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="录入时间" prop="createdate" label-width="110px">
													<el-input v-model="dataInfo.createdate" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="机构" prop="deptidDesc" label-width="110px">
													<el-input v-model="dataInfo.deptidDesc" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
										</el-row>
										<el-row >
											<el-col :span="8">
												<el-form-item label="修改人" prop="updatebyDesc" label-width="110px">
													<el-input v-model="dataInfo.updatebyDesc" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="修改时间" prop="updatedate" label-width="110px">
													<el-input v-model="dataInfo.updatedate" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>

										</el-row>
									</div>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="saveAndUpdate">保存</el-button>
							<el-button type="success"  v-show="addtitle" @click="saveAndSubmit">保存并继续</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
		</div>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js';
	export default {
		name: 'masks',
		data() {
			return {
				falg:false,//保存验证需要的
				basic_url: Config.dev_url,
				dataInfo:{
					status: '1',
					code:'',
					file:'',
					name:'',
					type:'',
					remarks:'',
					u_type:'',
					params: [],
					createby:'',
					createdate:'',
					updateby:'',
					updatedate:'',
					deptid:''
				},
				edit: true, //禁填
				noedit: false,
				col_but1: true,
				col_but2: true,
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				datainfo:{},
				addtitle: true, //添加弹出框titile
				modifytitle: false, //修改弹出框titile
				viewtitle: false, //查看弹出框title
				views: false,
				noviews: true, //保存的按钮
				modify: false,
				activeName: 'first',//tabs
				activeNames: ['1', '2', '3'], //手风琴数量
				labelPositions: 'right',
				rules: {
					
				},
				dataid:'',//修改和查看带过的id
				selectData:[],
				options: [{
		          value: '1',
		          label: '是'
		        }, {
		          value: '0',
		          label: '否'
		        }]
			};
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},	
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			reset() {					
				this.dataInfo={
					status: '1',
					code:'',
					file:'',
					name:'',
					type:'',
					remarks:'',
					u_type:'',
					params: [],
					createby:'',
					createdate:'',
					updateby:'',
					updatedate:''
				};	  
			},
			handleClick(tab, event) {
		    },
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing;
				}
			},
			
			sizeChange(val) {
				this.page.pageSize = val;
				this.requestData();
			},
			currentChange(val) {
				this.page.currentPage = val;
				this.requestData();
			},
			//新建行
			addcheckProCont() {
				var obj = {
					param: '',
					label: '',
					defaultVal: '',
					required: '',
					type: '',
					status:'1',
					isEditing: true
				};
				this.dataInfo.params.push(obj);
			},
			
			//刪除新建行
			deleteRow(index,rows) {//Table-操作列中的删除行
				rows.splice(index,1);
			},
			//添加显示弹窗
			visible() {
				// this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
				// 	
				// 	// this.dataInfo.DEPTID = res.data.deptId;
				// 	this.dataInfo.createby = res.data.id;
				// 	this.username=res.data.username;
				// 	var date = new Date();
				// 	this.dataInfo.createdate = this.$moment(date).format("YYYY-MM-DD");
				// 	this.show = true;
				// }).catch((err) => {
				// 	this.$message({
				// 		message: '网络错误，请重试',
				// 		type: 'error'
				// 	})
				// })
               	this.addtitle = true;
				this.modifytitle = false;
				this.viewtitle = false;
				this.views = false; //
				this.noviews = true;
				this.edit = true;
				this.noedit = false;
				this.show = true;
			},
			//
			detailgetData() {
				var url = this.basic_url + '/api-report/report/' + this.dataid;
				this.$axios.get(url, {}).then((res) => {
					for(var n = 0;n<res.data.params.length;n++){
						res.data.params[n].isEditing = false;
					}
					this.dataInfo = res.data;
					this.show = true;
				}).catch((err) => {
				});
			},	
			
			// 这里是修改
			detail(dataid) {
				this.dataid=dataid;
				// var usersUrl = this.basic_url + '/api-user/users/currentMap'
				// this.$axios.get(usersUrl, {}).then((res) => {
				// 	// this.dataInfo.DEPTID = res.data.deptId;//传给后台机构id
				// 	this.dataInfo.updateby = res.data.id;
				// 	var date = new Date();
				// 	this.dataInfo.updatedate = this.$moment(date).format("YYYY-MM-DD");
				// }).catch((err) => {
				// 	this.$message({
				// 		message: '网络错误，请重试',
				// 		type: 'error'
				// 	});
				// });
				this.detailgetData();
				this.modifytitle = true;
				this.addtitle = false;
				this.viewtitle = false;
				this.noviews = true;
				this.views = false; //
				this.edit = true;
				this.noedit = false;
			},
			//这是查看
			view(dataid) {
				this.dataid=dataid;				
				this.modifytitle = false;
				this.addtitle = false;
				this.viewtitle = true;
				this.views = true; //
				this.noviews = false;
				this.edit = true;
				this.noedit = true;
				this.isEditing=false;
				this.detailgetData();
			},
			
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');
			},
			open() {
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
			save() {
				this.$refs.dataInfo.validate((valid) => {
			        if (valid) {
							var url = this.basic_url + '/api-report/report/saveOrUpdate';
							this.$axios.post(url, this.dataInfo).then((res) => {
								if(res.data.resp_code == 0) {
									this.$message({
										message: '保存成功',
										type: 'success'
									});
									//重新加载数据
									this.$emit('request');
//									this.reset();
								}
							}).catch((err) => {
							});
						this.falg = true;
			        }else{
			          	this.show = true;
			            this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
			           this.falg = false;
			        }
				});
			},
			saveAndUpdate(){
				this.save();
				if(this.falg){
					this.show = false;
				}
			},
			saveAndSubmit(){
				this.save();
				this.show = true;			
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
			requestData(){
				var data = {
						page: this.page.currentPage,
						limit: this.page.pageSize,
					}
					var url = this.basic_url + '/api-apps/app/customer/CUSTOMER/'+ this.customid;
					this.$axios.get(url, {
						params: data
					}).then((res) => {
						this.CUSTOMER_PERSONList = res.data.CUSTOMER_PERSONList;
					});
					this.dialogVisibleuser = true;
			},
			getType(){
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=report_param_type';
				this.$axios.get(url, {}).then((res) => {
					this.selectData = res.data;
				}).catch(error => {
					console.log('请求失败');
				})
			},
		},
		mounted() {
			this.getType();
		},
	}
</script>

<style>
@import '../../assets/css/mask-modules.css';
.el-collapse-item__content {
    padding-bottom: 0px;
}
</style>