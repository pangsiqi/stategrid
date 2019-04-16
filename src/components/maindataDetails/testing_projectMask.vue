<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加检验/检测项目</div>
					<div class="mask_title" v-show="modifytitle">修改检验/检测项目</div>
					<div class="mask_title" v-show="viewtitle">查看检验/检测项目</div>
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
					<el-form inline-message :model="testing_projectForm" :rules="rules" ref="testing_projectForm"  >
						<div class="content-accordion">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基本信息" name="1">
									<el-row :gutter="20" class="pb10">
										<el-col :span="3" class="pull-right">
											<el-input placeholder="自动生成" v-model="testing_projectForm.VERSION" :disabled="true">
												<template slot="prepend">版本</template>
											</el-input>
										</el-col>
										<!--<el-col :span="5" class="pull-right" v-if="modify">
											<el-input v-model="testing_projectForm.STATUS=='1'?'活动':'不活动'" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input>
										</el-col>
										<el-col :span="5" class="pull-right" v-else>
											<el-input v-model="testing_projectForm.STATUS" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input>
										</el-col>-->
										<!-- <el-col :span="5" class="pull-right">
											<el-input v-model="testing_projectForm.P_NUM" :disabled="noedit" prop="P_NUM">
												<template slot="prepend">编码</template>
											</el-input>
										</el-col> -->
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="编码" prop="P_NUM" label-width="100px">
												<el-input v-model="testing_projectForm.P_NUM" placeholder="自动生成" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="16">
											<el-form-item label="项目名称" prop="P_NAME" label-width="100px">
												<el-input v-model="testing_projectForm.P_NAME"  onmouseover="this.title=this.value" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="单价(元)" prop="UNITCOST" label-width="100px">
												<el-input v-model="testing_projectForm.UNITCOST" id="cost" @blur="toPrice" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="作业指导书" prop="DOCLINKS_NUM" label-width="100px">
												<el-input v-model="testing_projectForm.DOCLINKS_NUM" :disabled="true">
													<el-button slot="append" icon="icon-search" @click="getwork" :disabled="noedit"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<!-- <el-col :span="8">
										<el-col :span="8">
											<el-form-item label="人员资质" prop="QUALIFICATION" label-width="100px">
												<el-input v-model="testing_projectForm.QUALIFICATION" :disabled="true">
													<el-button slot="append" icon="el-icon-search" @click="getpepole"></el-button>
												</el-input>
											</el-form-item>
										</el-col> -->
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="领域" prop="FIELD" label-width="100px">
												<el-input v-model="testing_projectForm.FIELD" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="子领域" prop="CHILD_FIELD" label-width="100px">
												<el-input v-model="testing_projectForm.CHILD_FIELD" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8" v-if="dept">
											<el-form-item label="机构" prop="DEPTIDDesc" label-width="100px">
												<el-input v-model="testing_projectForm.DEPTIDDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>	
								</el-collapse-item>
								<el-collapse-item title="人员资质" name="2">
									<div class="table-func" v-show="noviews">
										<el-button type="success" size="mini" round @click="addfield">
											<i class="icon-add"></i>
											<font>新建行</font>
										</el-button>
									</div>
									<div class="pt10">
										<el-table ref="table" :header-cell-style="rowClass" :fit="true" :data="testing_projectForm.QUALIFICATIONList" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'testing_projectForm.QUALIFICATIONList', order: 'descending'}">
											<el-table-column prop="iconOperation" fixed width="50px" v-if="!viewtitle">
												<template slot-scope="scope">
													<i class="el-icon-check" v-if="scope.row.isEditing"></i>
													<i class="el-icon-edit" v-else></i>
												</template>
											</el-table-column>
											<el-table-column prop="STEP" label="序号" sortable width="120px" label-width="150px" type="index">
											</el-table-column>
											<el-table-column prop="C_NAME" label="证书名称" sortable>
												<template slot-scope="scope">
													<el-form-item :prop="'QUALIFICATIONList.'+scope.$index + '.C_NAME'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
														<el-input v-if="scope.row.isEditing" v-model="scope.row.C_NAME" placeholder="请输入证书名称">
															<el-button slot="append" icon="icon-search" @click="getpepole(scope.row)" :disabled="noedit"></el-button>
														</el-input>
														<span v-else>{{scope.row.C_NAME}}</span>
													</el-form-item>
												</template>
											</el-table-column>
											<el-table-column fixed="right" label="操作" width="120">
												<template slot-scope="scope">
													<el-button @click.native.prevent="deleteRow(scope.$index,scope.row,'tableList')" type="text" size="small" v-show="!viewtitle">
															<i class="icon-trash red"></i>
													</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</el-collapse-item>
								<el-collapse-item title="其他" name="3" v-show="views">
									<el-row>
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc" label-width="100px">
												<el-input v-model="testing_projectForm.ENTERBYDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE" label-width="100px">
												<el-input v-model="testing_projectForm.ENTERDATE" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人" prop="CHANGEBYDesc" label-width="100px">
												<el-input v-model="testing_projectForm.CHANGEBYDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="CHANGEDATE" label-width="100px">
												<el-input v-model="testing_projectForm.CHANGEDATE" :disabled="true"></el-input>
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
							<!-- <el-button v-if="modify" type="success" @click="update('testing_projectForm')">启用</el-button> -->
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
			<el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
				<el-table :data="gridDataList" @selection-change="SelChange" height="400px">
					<el-table-column type="selection" width="55" fixed>
					</el-table-column>
					<!-- <el-table-column label="用户名" sortable width="100px" prop="user">
					</el-table-column> -->
					<el-table-column label="证书名称" sortable width="200px" prop="c_name">
					</el-table-column>
					<el-table-column label="资质有效期" sortable prop="c_date">
					</el-table-column>
				</el-table>
				<el-pagination background class="text-right" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
				</el-pagination>
				<span slot="footer" class="dialog-footer">
	    			<el-button @click="dialogVisible = false">取 消</el-button>
	    			<el-button type="primary" @click="dailogconfirm()">确 定</el-button>
	  			</span>
			</el-dialog>

			<!-- 作业指导书 Begin -->
			<el-dialog :modal-append-to-body="false" title="作业指导书" :visible.sync="dialogVisible2" width="80%" :before-close="handleClose">
				<el-table ref="table" 
					:header-cell-style="rowClass" 
					:data="WORK_INSTRUCTIONList" 
					border 
					stripe 
					height="400" 
					style="width: 100%;" 
					:default-sort="{prop:'WORK_INSTRUCTIONList', order: 'descending'}" 
					@selection-change="SelChange" 
					v-loadmore="loadMore">
					<el-table-column type="selection" fixed width="55">
					</el-table-column>
					<el-table-column label="分发号" width="155" sortable prop="NUM">
						<template slot-scope="scope">
							<p class="blue" title="点击查看详情" @click=view(scope.row)>{{scope.row.NUM}}
							</p>
						</template>
					</el-table-column>
					<el-table-column label="文件名称" sortable prop="DESCRIPTION">
					</el-table-column>
					<el-table-column label="版本" width="100" sortable prop="VERSION" align="right">
					</el-table-column>
					<el-table-column label="录入时间" width="160" prop="ENTERDATE" sortable :formatter="dateFormat">
					</el-table-column>
					<el-table-column label="机构" width="120" prop="DEPTIDDesc" sortable>
					</el-table-column>
				</el-table>

				<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40,100]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
				</el-pagination>

				<span slot="footer" class="dialog-footer">
			       <el-button type="primary" @click="addwork">确 定</el-button>
				   <el-button @click="DialogClose">取 消</el-button>
			    </span>
			</el-dialog>
			<!-- 作业指导书 End -->

		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	export default {
		name: 'masks',
		data() {
			var validateNum = (rule, value, callback) => {
				if(value != ""){
		             if((/^[0-9a-zA-Z()（）]+$/).test(value) == false){
		                 callback(new Error("请填写数字、字母或括号（编码不填写可自动生成）"));
		             }else{
		                 callback();
		             }
		         }else{
		             callback();
		         }
			};
			var validateP_NAME = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请填写项目名称'));
				} else {
					callback();
				}
			};
			var validateQUANTITY = (rule, value, callback) => {
				if(value === ""){
					 callback(new Error("请填写数字"));
				}else{
		             callback();
		        }
			};
			var validateQUALIFICATION = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请填写人员资质'));
				} else {
					callback();
				}
			};
			var validateDOCLINKS_NUM = (rule, value, callback) => {
				if(this.testing_projectForm.DOCLINKS_NUM === '') {
					callback(new Error('请选择作业指导书'));
				} else {
					callback();
				}
			};
			 //金额验证
			// var price=(rule, value, callback) => {//生产单位名称 
			// 	var exp = /^(-)?\d{1,3}(,\d{3})*(.\d+)?$/;
			// 	if(value != '' && value!=undefined){
			// 		if(exp.test(value)==false){ 
			// 			callback(new Error('请输入数字'));
			// 		}else{
			// 			callback();
			// 			}
			// 	}else {
			// 		callback();
			// 	}
			// };
			return {
				testing_projectForm:{
					CHANGEBY: '',
					CHILD_FIELD:'',
					DEPARTMENT:'',
					DOCLINKS_NUM: '',
					ENTERBY:'',
					ENTERDATE: '',
					FIELD: '',
					ID: '',
					P_NAME: '',
					P_NUM: '',
					QUALIFICATION: '',
					QUALIFICATIONList: [],
					QUANTITY: '',
					STATUS: '1',
					VERSION: 1,
					WORK_INSTRUCTIONList: []
				},
				basic_url: Config.dev_url,
				editSearch: '',
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				activeNames: ['1','2','3'], //手风琴数量
				dialogVisible: false, //对话框
				rules: { //需要验证的字段
					P_NUM: [{
						required: false,
						trigger: 'blur',
						validator: this.Validators.isSpecificKey,
					}],
					P_NAME: [{
						required: true,
						trigger: 'blur',
						validator: this.Validators.isSpecificKey,
					}],
					FIELD: [{
						required: false,
						trigger: 'blur',
						validator: this.Validators.isSpecificKey,
					}],
					CHILD_FIELD: [{
						required: false,
						trigger: 'blur',
						validator: this.Validators.isSpecificKey,
					}],
					UNITCOST:[{required: true, trigger: 'blur', validator:this.Validators.isPrices}],
				},
				testing_projectForm:{},//检验/检测项目数据组
				//tree
				gridDataList: [],
				selval: [],
				loadSign:true,//加载
				commentArr:{},
				resourceData: [], //数组，我这里是通过接口获取数据
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				page: { //分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				// initcost: '',
				TESTING_PROJECTFORM:{},//
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
				dialogVisible2:false,//作业指导书弹出框
				WORK_INSTRUCTIONList:[],
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				isEditing: true,
				peoplegrid:'',//人员资质当前这行放大镜
			};
		},
		methods: {
			addfield() {
				var obj = {
					ID:'',
					STEP: '',
					C_NUM: '',
					C_NAME: '',
					C_DATE: '',
					isEditing: true
				};
				this.testing_projectForm.QUALIFICATIONList.push(obj);
			},
			//刪除新建行
			deleteRow(index, row, listName){
				var TableName = '';
				if(listName =='tableList'){
					TableName = 'QUALIFICATION';
				}
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/inspectionPro/' + TableName +'/' + row.ID;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {}).then((res) => {
							if(res.data.resp_code == 0){
								this.testing_projectForm[TableName+'List'].splice(index,1);
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
					this.testing_projectForm[TableName+'List'].splice(index,1);
				}
			},
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing;
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
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			//编码提示
			hint(){
				this.hintshow = true;
			},
			hinthide(){
				this.hintshow = false;
			},
			toNum(str) {
				return str.replace(/\,|\￥/g, "");
			},
			//金额两位小数点千位分隔符，四舍五入
			toPrice() {
				var money = document.getElementById("cost").value;
				var num = parseFloat(this.toNum(money)).toFixed(2).toString().split(".");
				num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
				this.testing_projectForm.UNITCOST = num.join(".");
			},
			getCompany() { //文件查询接口，暂无通，待修改
				this.editSearch = 'DOCLINKS';
				var url = this.basic_url + '/api-user/depts/type'; //文件接口不对
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data.data;
				});
			},
			loadMore () {
			   if (this.loadSign) {
			     this.loadSign = false
			     this.page.currentPage++
			     if (this.page.currentPage > Math.ceil(this.page.totalCount/this.page.pageSize)) {
			       return
			     }
			     setTimeout(() => {
			       this.loadSign = true
			     }, 1000)
			     this.requestData()
			   }
			 },
			getwork(){
				this.requestData();
				this.dialogVisible2 = true;
			},
			getCheckedNodes() { //获取树菜单节点
				this.checkedNodes = this.$refs.tree.getCheckedNodes()
			},
			confirms() { //弹出框确定按钮调用数据
				this.getCheckedNodes();
				this.dialogVisible = false;
				if(this.editSearch == 'DOCLINKS') {
					this.testing_projectForm.DOCLINKSId = this.checkedNodes[0].id;
					this.testing_projectForm.DOCLINKS_NUM = this.checkedNodes[0].simplename;
				}
			},
			SelChange(val) {
				this.selval = val;
			},
			sizeChange(val) {
				this.page.pageSize = val;
				this.requestData();
			},
			currentChange(val) {
				this.page.currentPage = val;
				this.requestData();
			},
			handleClose(done) { //确认框关闭
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
			},

			visible() { //添加内容时从父组件带过来的
				this.testing_projectForm = {
					CHANGEBY: '',
					CHILD_FIELD:'',
					DEPARTMENT:'',
					DOCLINKS_NUM: '',
					ENTERBY:'',
					ENTERDATE: '',
					FIELD: '',
					ID: '',
					P_NAME: '',
					P_NUM: '',
					QUALIFICATION: '',
					QUALIFICATIONList: [],
					QUANTITY: '',
					STATUS: '1',
					VERSION: 1,
					WORK_INSTRUCTIONList: []
				},
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.testing_projectForm.DEPARTMENT = '';
					this.testing_projectForm.DEPTID = res.data.deptId;
					this.testing_projectForm.ENTERBY = res.data.id;
					var date = new Date();
					this.testing_projectForm.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
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
				// this.show = true;
			},

			detail(dataid) { //修改内容时从父组件带过来的
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.testing_projectForm.DEPARTMENT = '';
					this.testing_projectForm.CHANGEBY = res.data.id;
					var date = new Date();
					this.testing_projectForm.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					
				}).catch((err) => {
				});
				var url = this.basic_url + '/api-apps/app/inspectionPro/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					for(var i=0;i<res.data.QUALIFICATIONList.length;i++){
						res.data.QUALIFICATIONList[i].isEditing = false;
					}
					this.testing_projectForm = res.data;
					//深拷贝数据
					let _obj = JSON.stringify(this.testing_projectForm);
        	this.TESTING_PROJECTFORM = JSON.parse(_obj);
				}).catch((err) => {
				});
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
			view(dataid) {
				var url = this.basic_url + '/api-apps/app/inspectionPro/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					this.testing_projectForm = res.data;
				}).catch((err) => {
				});
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.dept = true;
				this.noedit = true;//表单内容
				this.views = true;//录入修改人信息
				this.noviews = false;//按钮
				this.show = true;				
			},
			//点击更新按钮
			update(testing_projectForm) {
				var data = {
					ID: this.testing_projectForm.ID,
				}
				this.$axios.get(this.basic_url+ '/api-apps/app/inspectionPro/operate/updateRelate', {
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
			modifyversion() {
				this.$refs.testing_projectForm.validate((valid) => {
					if(valid) {
					var TESTING_PROJECTFORM=JSON.stringify(this.TESTING_PROJECTFORM); //接过来的数据
					 var testing_projectForm=JSON.stringify(this.testing_projectForm); //获取新新的数据
					 	if(testing_projectForm==TESTING_PROJECTFORM){
					  		this.$message({
								message: '没有修改内容，不允许修订',
								type: 'warning'
							});
							return false;
					    }else{
							var url = this.basic_url + '/api-apps/app/inspectionPro/operate/upgraded';
							this.$axios.post(url, this.testing_projectForm).then((res) => {
								//resp_code == 0是后台返回的请求成功的信息
								if(res.data.resp_code == 0) {
									this.$message({
										message: '保存成功',
										type: 'success'
									});
									//重新加载数据
									this.show = false;
									this.$emit('request');
									this.$emit('reset');
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
				var _this = this;
				this.$refs.testing_projectForm.validate((valid) => {
					if(valid) {
						_this.testing_projectForm.STATUS = ((_this.testing_projectForm.STATUS == "1" || _this.testing_projectForm.STATUS == '活动') ? '1' : '0');
						if(_this.testing_projectForm.ID!=null&&_this.testing_projectForm.ID!=undefined&&_this.testing_projectForm.ID!=''){
							this.$confirm('是否需要修订版本？').then(_ => {
								this.modifyversion();
							}).catch(_ => {
								this.close();
							});	
						}else{
							var url = this.basic_url + '/api-apps/app/inspectionPro/saveOrUpdate';
							this.$axios.post(url, _this.testing_projectForm).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								if(parameter='Update'){
									this.show=false;
								}else{
									this.show=true;
								}
								this.$emit('reset');
								this.$emit('request');
								this.visible();
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
						//清空表单验证
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
			getpepole(item) {
				this.peoplegrid = item;
				var url = this.basic_url + '/api-user/users/qualifications';
				this.$axios.get(url, {
					
				}).then((res) => {
					this.page.totalCount = res.data.count;
					this.gridDataList = res.data.data;
					this.dialogVisible = true;
				});
			},
			dailogconfirm() { //小弹出框确认按钮事件
				if(this.selval.length == 0){
					this.$message({
						message: '请选择数据',
						type: 'warning'
					});
				}else if(this.selval.length > 1){
					this.$message({
						message: ' 不可选择多条数据',
						type: 'warning'
					});
				}else{
					this.peoplegrid.C_NAME = this.selval[0].c_name;
					this.dialogVisible = false;
				}
			},
			addwork() { //小弹出框确认按钮事件
				if(this.selval.length == 0){
					this.$message({
						message: '请选择数据',
						type: 'warning'
					});
				}else if(this.selval.length>1){
					this.$message({
						message: '不可以同时选择多条数据',
						type: 'warning'
					});
				}else{
					var changeUser = this.selval;
					var list = [];
					//basisnum为依据编号的数组
					var basisdesc = [];
					for (var i = 0; i < changeUser.length; i++) {
						basisdesc.push(changeUser[i].DESCRIPTION);
					}
					//basisnums为basisnum数组用逗号拼接的字符串el-tag__close el-icon-close
					this.testing_projectForm.DOCLINKS_NUM = basisdesc.toString(',');
					// list.push(basisnums);
					// for(var i = 0;i<this.selUser.length;i++){
					// 	this.selUser[i].ID = '';
					// 	list.push(this.selUser[i]);
					// }
					this.resetBasisInfo();//调用resetBasisInfo函数
				}
			},
			DialogClose(){//点击取消按钮
				this.resetBasisInfo();//调用resetBasisInfo函数
			},
			resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
				this.dialogVisible2 = false;//关闭弹出框
				this.WORK_INSTRUCTIONList = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 10;//页码重新传值
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
			requestData(index) {
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				}
				var url = this.basic_url + '/api-apps/app/workIns';
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					this.page.totalCount = res.data.count;
					//总的页数
					let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize)
					if(this.page.currentPage >= totalPage) {
						this.loadSign = false
					} else {
						this.loadSign = true
					}
					this.commentArr[this.page.currentPage] = res.data.data
					let newarr = []
					for(var i = 1; i <= totalPage; i++) {

						if(typeof(this.commentArr[i]) != 'undefined' && this.commentArr[i].length > 0) {

							for(var j = 0; j < this.commentArr[i].length; j++) {
								newarr.push(this.commentArr[i][j])
							}
						}
					}
					this.WORK_INSTRUCTIONList = newarr;
				}).catch((wrong) => {})
			},
		},
		mounted() {
			// this.requestData();
			this.getCompany();
		},
	}
</script>

<style>
	@import '../../assets/css/mask-modules.css';
	#cost {
		text-align: right !important;
		/* padding-right: 30px; */
	}
</style>