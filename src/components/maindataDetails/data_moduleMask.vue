<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
		<div class="mask_div">
			<div class="mask_title_div clearfix">
				<div class="mask_title" v-show="addtitle">添加原始数据模板</div>
				<div class="mask_title" v-show="modifytitle">修改原始数据模板</div>
				<div class="mask_title" v-show="viewtitle">查看原始数据模板</div>
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
								<el-collapse-item title="原始数据模板" name="1">
									<el-row>
										<el-col :span="8">
											<el-form-item label="编码" prop="PT_NUM">
												<el-input v-model="CATEGORY.PT_NUM" placeholder="自动生成" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="16">
											<el-form-item label="模板描述" prop="DECRIPTION">
												<el-input v-model="CATEGORY.DECRIPTION" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8" v-if="dept">
											<el-form-item label="机构" prop="DEPTIDDesc">
												<el-input v-model="CATEGORY.DEPTIDDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<!-- <el-collapse-item title="原始数据模板单元信息" name="2">
									<div class="table-func" v-show="noviews">
										<el-button type="success" size="mini" round @click="addfield">
											<i class="icon-add"></i>
											<font>新建行</font>
										</el-button>
									</div>
									<el-table :header-cell-style="rowClass" :fit="true" :data="CATEGORY.RAW_DATA_TEMPATE_DETAILList" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'CATEGORY.RAW_DATA_TEMPATE_DETAILList', order: 'descending'}">
										<el-table-column prop="iconOperation" fixed width="50px" v-show="!viewtitle">
											<template slot-scope="scope">
												<i class="el-icon-check" v-if="scope.row.isEditing"></i>
												<i class="el-icon-edit" v-else></i>
											</template>
										</el-table-column>
										<el-table-column label="序号" sortable width="80px" label-width="150px" type="index">
										</el-table-column>
										<el-table-column prop="ROWNUMBER" label="列号" sortable width="120px">
											<template slot-scope="scope">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.ROWNUMBER" placeholder="请输入">
													</el-input>
													<span v-else>{{scope.row.ROWNUMBER}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="COLNUMBER" label="行号" sortable width="120px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.COLNUMBER" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.COLNUMBER}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="DATALENGTH" label="数据长度" sortable width="120px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.DATALENGTH" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.DATALENGTH}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="DATATYPE" label="值类型" sortable width="120px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.DATATYPE" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.DATATYPE}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="DESCRIPTION" label="单元格描述" sortable width="150px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.DESCRIPTION" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.DESCRIPTION}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="FORMULA" label="计算公式" sortable width="150px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.FORMULA" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.FORMULA}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="GRIDTYPE" label="单元格类型" sortable width="150px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.GRIDTYPE" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.GRIDTYPE}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="HASFORMULA" label="是否使用计算公式" sortable width="180px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.HASFORMULA" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.HASFORMULA}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="COLSPAN" label="合并列" sortable width="120px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.COLSPAN" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.COLSPAN}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="ROWSPAN" label="合并行" sortable width="120px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.ROWSPAN" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.ROWSPAN}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="ISSPAN" label="是否合并" sortable width="120px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.ISSPAN" placeholder="请输入">
												</el-input>
												<span v-else>{{scope.row.ISSPAN}}</span>
											</template>
										</el-table-column>
										<el-table-column fixed="right" label="操作" width="120">
											<template slot-scope="scope">
												<el-button @click="deletemodule(scope.$index,scope.row,'tableList')" type="text" size="small" v-show="!viewtitle">
                                                 <i class="icon-trash red"></i>
												</el-button>
											</template>
										</el-table-column>
									</el-table>
								</el-collapse-item> -->
								<el-collapse-item title="文件" name="3">
									<doc-table ref="docTable" :docParm = "docParm" @saveParent="save"></doc-table>
								</el-collapse-item>
								<el-collapse-item title="其它" name="4" v-show="views">
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
							<!-- <el-button v-if="modify" type="success" @click="update('CATEGORY')">启用</el-button> -->
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
	import docTable from '../common/doc.vue'
	export default {
		name: 'masks',
		components: {docTable},
		// props: {
		// 	CATEGORY: {
		// 		type: Object,
		// 		default: function() {
		// 			return {
		// 				ID: '',
		// 				PT_NUM: '',
		// 				DECRIPTION: '',
		// 				STATUS: '',
		// 				DEPARTMENT: '',
		// 				ENTERBY: '',
		// 				ENTERDATE: '',
		// 				CHANGEBY: '',
		// 				CHANGEDATE: ''
		// 			}
		// 		}
		// 	},
		// 	page: Object,
		// },
		data() {
			return {
				docParm: {
					'model': 'new',
					'appname': '',
					'recordid': 1,
					'userid': 1,
					'username': '',
					'deptid': 1,
					'deptfullname': '',
					'appname': '',
					'appid': 1
				},
				falg:false,//保存验证需要的
				basic_url: Config.dev_url,
				selUser: [],
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				activeNames: ['1','2','3','4'], //手风琴数量
				//				labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				selectData: [],
				rules: {
					PT_NUM: [{
						required: false,
						trigger: 'blur',
						validator: this.Validators.isCodeNum,
					}],
					DECRIPTION: [
						{required: true, message: '请填写', trigger: 'blur'},
						{validator: this.Validators.isSpecificKey, trigger: 'blur'},
					],
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				// category:{},//从父组件接过来的值
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
				CATEGORY:{
					RAW_DATA_TEMPATE_DETAILList:[]
				},
				testing_filesForm:{//文件文件数据组
					inspectionList: []
				},
			};
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			addfield() {
				var obj = {
					ID:'',
					ROWNUMBER:'',
					COLNUMBER:'',
					DATALENGTH:'',
					DATATYPE:'',
					DESCRIPTION:'',
					FORMULA:'',
					GRIDTYPE:'',
					HASFORMULA:'',
					COLSPAN:'',
					ROWSPAN:'',
					ISSPAN:'',
					isEditing: true
				};
				this.CATEGORY.RAW_DATA_TEMPATE_DETAILList.push(obj);
			},
			//刪除新建行
			deletemodule(index, row, listName){
				var TableName = '';
				if(listName =='tableList'){
					TableName = 'RAW_DATA_TEMPATE_DETAIL';
				}
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/rawDataTem/' + TableName +'/' + row.ID;
					this.$axios.delete(url, {}).then((res) => {
						if(res.data.resp_code == 0){
							this.CATEGORY[TableName+'List'].splice(index,1);
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
				}else{
					this.CATEGORY[TableName+'List'].splice(index,1);
				}
			},
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			sizeChange(val) {//页数
		        this.page.pageSize = val;
		      	this.requestData_doclinks();
		    },
		    currentChange(val) {//当前页
		      	this.page.currentPage = val;
		      	this.requestData_doclinks();
		    },
			searchinfo(index) {//查询展示出第1页数据
				this.page.currentPage = 1;
				this.page.pageSize = 10;
				this.requestData_doclinks();
			},
			//生成随机数函数
			rand(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			},
			getUser(opt){
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.CATEGORY.DEPARTMENT = '';
					this.docParm.userid = res.data.id;
					this.docParm.username = res.data.username;
					this.docParm.deptid = res.data.deptId;
					this.docParm.deptfullname = res.data.deptName;
					//判断新建和修改时录入人/时间/机构和修改人/时间的变化
					if(opt == 'new'){
						this.CATEGORY.DEPTID = res.data.deptId;//录入人机构
						this.CATEGORY.ENTERBY = res.data.id;//录入人
						var date = new Date();
						this.CATEGORY.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");//录入时间
					}
					if(opt == 'edit'){
						this.CATEGORY.CHANGEBY = res.data.id;//修改人
						var date = new Date();
						this.CATEGORY.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");//修改时间
					}

					if(opt != 'new'){
						let _obj = JSON.stringify(this.CATEGORY);
						this.category = JSON.parse(_obj);
					}
				}).catch((err) => {
				});
			},
			//点击添加按钮显示弹窗
			visible() {
				this.docParm = {
					'model': 'new',
					'appname': '检验检测项目_原始数据模板',
					'recordid': 1,
					'appid': 17
				};
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
				this.getUser('new');//新建时当前用户
//				this.show = true;
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
				this.getUser('edit');//修改时当前用户
				var _this = this;
				var url = this.basic_url + '/api-apps/app/rawDataTem/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					for(var i=0;i<res.data.RAW_DATA_TEMPATE_DETAILList.length;i++){
						res.data.RAW_DATA_TEMPATE_DETAILList[i].isEditing = false;
					}
					this.CATEGORY = res.data;
					setTimeout(function(){
						_this.docParm.model = 'edit';
						_this.docParm.appname = '检验检测项目_原始数据模板';
						_this.docParm.recordid = _this.CATEGORY.ID;
						_this.docParm.appid = 17;
						_this.$refs.docTable.getData();
					},100);
					this.show = true;
				}).catch((err) => {
				});
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
				
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'view';
					_this.docParm.appname = '检验检测项目_原始数据模板';
					_this.docParm.recordid = _this.CATEGORY.ID;
					_this.docParm.appid = 17;
					_this.$refs.docTable.getData();
				},100);
			},
			//点击更新按钮
			update(CATEGORY) {
				var data = {
					ID: this.CATEGORY.ID,
				}
				this.$axios.get(this.basic_url+ '/api-apps/app/rawDataTem/operate/updateRelate', {
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
				this.resetData();
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
			save(opt) {
				this.$refs['CATEGORY'].validate((valid) => {
					if(!valid && opt == 'docUpload'){
						this.$message({
							message: '请先正确填写信息，再进行文档上传',
							type: 'warning'
						});
					}
					if(valid) {
						var len = this.$refs.docTable.getFilelen();
						if(opt != 'docUpload' && len==0){
							this.$message({
								message: '请先上传模版文件，再保存！',
								type: 'error'
							});
							return false;
						}
						this.CATEGORY.STATUS = ((this.CATEGORY.STATUS == "1" || this.CATEGORY.STATUS == '活动') ? '1' : '0');
						var url = this.basic_url + '/api-apps/app/rawDataTem/saveOrUpdate';
						this.$axios.post(url, this.CATEGORY).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								if(opt == 'docUpload'){
									this.docParm.recordid = res.data.datas.id;
									this.docParm.model = 'edit';
									this.$refs.docTable.autoLoad();
									this.CATEGORY.ID = res.data.datas.id;
									this.CATEGORY.PT_NUM = res.data.datas.PT_NUM;
								}else{
									if(opt == 'save'){
										this.show = false;
										this.$emit('request');
									}
									if(opt == 'update'){
										this.show = false;
										this.visible();
									}
									this.emit('request');
									this.$emit('reset');
								}
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
						// this.falg = true;
					} else {
						this.show = true;
						this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
					}
				});
			},
			resetData(){
				this.CATEGORY = {};
			},
			
			iconOperation(row, column, cell, event){//切换Table-操作列中的修改、保存
				if(column.property ==="iconOperation"){
					row.isEditing = !row.isEditing
				}
			},
			addfield_doclinks() { //插入行到文件文件Table中
				var isEditingflag=false;
				for(var i=0;i<this.testing_filesForm.inspectionList.length; i++){
					if (this.testing_filesForm.inspectionList[i].isEditing==false){
						isEditingflag=false;
					}else{
                        isEditingflag=true;
                        break;
					}
				}
				if (isEditingflag==false){
                	this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
                		var currentUser, currentDate
						this.currentUser=res.data.nickname;
						var date=new Date();
						this.currentDate = this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
						var index=this.$moment(date).format("YYYYMMDDHHmmss");
						var obj = {
							"DOCLINKS": 'FLS' + index,
							"DESCRIPTION": '',
							"DOC_SIZE": '',
							"ROUTE": '',
							"ENTERBY": this.currentUser,
							"ENTERDATE": this.currentDate,
							"isEditing": true,
						};
						this.testing_filesForm.inspectionList.unshift(obj);//在列表前新建行unshift，在列表后新建行push
					}).catch((err)=>{
					})
	            } else {
	                this.$message.warning("请先保存当前编辑项");
				}
			},
			saveRow (row) {//Table-操作列中的保存行
				this.$refs['testing_filesForm'].validate((valid) => {
		          	if (valid) {
						var url = this.basic_url + '/api-apps/app/doclinks/saveOrUpdate';
	//					var submitData = {
//						"ID":row.ID,
//					    "DOCLINKS": row.DOCLINKS,
//						"DESCRIPTION": row.DESCRIPTION,
//					    "DOC_SIZE": row.DOC_SIZE,
//						"ROUTE": row.ROUTE,
//						"ENTERBY": row.ENTERBY,
//					    "ENTERDATE": row.ENTERDATE,
//					}
						this.$axios.post(url, this.submitData).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								//重新加载数据
								this.requestData_doclinks();
							}
						}).catch((err) => {
						});
			        } else {
			            return false;
			        }
		        });
			},

			deleteRow(row) {//Table-操作列中的删除行
				this.$confirm('确定删除此文件文件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                	var url = this.basic_url + '/api-apps/app/doclinks/' + row.ID;
                    this.$axios.delete(url, {}).then((res) => {//.delete 传数据方法
					//resp_code == 0 是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.requestData_doclinks();
						}
					}).catch((err) => {
					});
                }).catch(() => {

            	});
			},
			loadMore () {//表格滚动加载
			    if (this.loadSign) {
			        this.loadSign = false
			     	this.page.currentPage++
			     	if (this.page.currentPage > Math.ceil(this.page.totalCount/this.page.pageSize)) {
			       		return
			     	}
				    setTimeout(() => {
				        this.loadSign = true
				    }, 1000)
			     	this.requestData_doclinks()
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
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>