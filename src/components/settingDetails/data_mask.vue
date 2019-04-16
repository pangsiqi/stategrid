<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加数据库表</div>
					<div class="mask_title" v-show="modifytitle">修改机构</div>
					<div class="mask_title" v-show="viewtitle">查看客户</div>
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
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基本信息" name="1">
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="表名" prop="name">
												<el-input v-model="dataInfo.name"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="描述" prop="description">
												<el-input v-model="dataInfo.description"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="字段列表" name="2">
									<!-- 字段列表 Begin-->
									<div class="table-func">
										<el-button type="primary" size="mini" round  @click="importdia">
											<i class="icon-upload-cloud"></i>
											<font>导入</font>
										</el-button>
										<el-button type="success" size="mini" round @click="addfield">
											<i class="icon-add"></i>
											<font>新建</font>
										</el-button>
									</div>
						            <el-table :data="dataInfo.attributes" row-key="ID" border stripe height="260" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'dataInfo.attributes', order: 'descending'}">
									    <el-table-column prop="iconOperation" fixed width="50px">
										    <template slot-scope="scope">
										      	<i class="el-icon-check" v-show="scope.row.isEditing">
										      	</i>
										      	<i class="el-icon-edit" v-show="!scope.row.isEditing">
										      	</i>
										    </template>
									    </el-table-column>
									    <el-table-column label="字段名" sortable width="220px" prop="columnname">
										    <template slot-scope="scope">
										      	<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.columnname" disabled></el-input><span v-show="!scope.row.isEditing" >{{scope.row.columnname}}</span>
										    </template>
									    </el-table-column>
									    <el-table-column label="字段描述" sortable width="220px" prop="description">
										    <template slot-scope="scope">
										      	<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.description" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.description}}</span>
										    </template>
									    </el-table-column>
										<el-table-column prop="type" label="字段类型" sortable width="220px">
										    <template slot-scope="scope">
										        <el-select v-show="scope.row.isEditing" size="small" v-model="scope.row.S_DESC" placeholder="选择字段类型">
												    <el-option label="字符串(string)" value="string"></el-option>
												    <el-option label="浮点类型(float)" value="float"></el-option>
												    <el-option label="整数(int)" value="int"></el-option>
												    <el-option label="长整型(long)" value="long"></el-option>
												    <el-option label="双精度(double)" value="double"></el-option>
												    <el-option label="日期(date)" value="date"></el-option>
												    <el-option label="时间(time)" value="time"></el-option>
												</el-select>
										        <span v-show="!scope.row.isEditing">{{scope.row.type}}</span>
										    </template>
									    </el-table-column>
									    <el-table-column prop="length" label="长度" sortable width="220px">
										    <template slot-scope="scope">
										       	<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.length" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.length}}</span>
										    </template>
									    </el-table-column>
									    <el-table-column prop="retain" label="小数点位数" sortable>
										    <template slot-scope="scope">
										        <el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.retain" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.retain}}</span>
										    </template>
									    </el-table-column>
									    <el-table-column fixed="right" label="操作" width="60">
										    <template slot-scope="scope">
										        <el-button @click = "deleteRow(scope.$index, dataInfo.attributes)" type="text" size="small">
										          <i class="icon-trash red"></i>
										        </el-button>
										    </template>
									    </el-table-column>
									</el-table>
									<!-- 字段列表 End -->
								</el-collapse-item>
							</el-collapse>
						</div>			
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="submitForm('dataInfo')">保存</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
		<!-- 弹出 -->
			<el-dialog :modal-append-to-body="false" title="添加数据库表" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
				<div class="content-accordion" id="information">
					<div class="mask_tab-block">
						<div class="mask_tab-head clearfix">
							<div class="accordion_title">
								<span class="accordion-toggle">导入标准字段</span>
							</div>
							<div class="col_but" @click="col_but('col_but1')">
								<i class="icon-arrow1-down" v-show="down"></i><i class="icon-arrow1-up" v-show="up"></i>
							</div>
						</div>
						<div class="accordion-body tab-content" v-show="col_but1" id="tab-content2">
						<!-- 第二层弹出的表格 -->
							<el-table :data="leaddata" style="width: 100%;margin: 0 auto;" :default-sort="{prop:'leaddata', order: 'descending'}" @selection-change="SelChange">
								<el-table-column type="selection" width="55" >
								</el-table-column>
								<el-table-column label="字段名称" sortable width="150" prop="columnname">
								</el-table-column>
								<el-table-column label="字段描述" sortable width="200" prop="description">
								</el-table-column>
								<el-table-column label="字段类型" sortable width="150" prop="type">
								</el-table-column>
								<el-table-column label="字段长度" sortable width="100" prop="length">
								</el-table-column>
								<el-table-column label="小数点位数" sortable width="180" prop="retain">
								</el-table-column>							
							</el-table>
							<!-- 表格 -->
						</div>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
			       <el-button @click="dialogVisible = false">取 消</el-button>
			       <el-button type="primary" @click="leadadddata">确 定</el-button>
			    </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	export default {
		name: 'masks',
		data() {
			var validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请英文填写表名'));
                }else {
                    callback();
                }
            };
            var validateDecri = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请填写描述'));
                }else {
                    callback();
                }
            };
			return {
				basic_url: Config.dev_url,
				selUser:[],
				edit: true, //禁填
				col_but1: true,
				col_but2: true,
				noviews:true,//按钮
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				addtitle:true,//添加弹出框titile
				modifytitle:false,//修改弹出框titile
				viewtitle:false,//查看弹出框titile
				activeNames: ['1','2'],//手风琴数量
//				labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				dataList:[{
					name:'',
					description:''
				}],
				leaddata:[//导入数据的表格
				{
					columnname:'author',
					description:'作者姓名',
					type:'字符串(string)',
					length:'6',
					retain:''
				},
				{
					columnname:'author',
					description:'作者姓名',
					type:'字符串(string)',
					length:'6',
					retain:''
				},
				{
					columnname:'author',
					description:'作者姓名',
					type:'字符串(string)',
					length:'6',
					retain:''
				},
				{
					columnname:'author',
					description:'作者姓名',
					type:'字符串(string)',
					length:'6',
					retain:''
				}],
				dataInfo: {//添加数据库列表信息
					name:'',
					description:'',
					attributes:[]
				},
				rules: {
					name: [
						{ required: true, message: '必填',trigger: 'blur'},
						{ validator: this.Validators.isSpecificKey, trigger: 'blur'},
					],
					description: [
						{ required: true, message: '必填',trigger: 'blur'},
						{ validator: this.Validators.isSpecificKey, trigger: 'blur'}
					],
					// leadname: [
					// 	{ required: true, message: '必填',trigger: 'blur'},
					// 	{ validator: this.Validators.isSpecificKey, trigger: 'blur'},
					// ],
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
			};
		},
		methods: {
			resetNew(){
                this.dataInfo = {//数据库列表
					name:'',
					description:'',
					attributes:[{//字段列表
						columnname: '',
						description: '',
						type:'',
						length: '',
						retain: '',
						isEditing:true
					}]
				}
                // this.$refs["dataInfo"].resetFields();
            },
			
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			//导入添加数据按钮
			leadadddata(){
				var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择数据',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时选择多条数据',
						type: 'warning'
					});
					return;
				} else {
					//this.attributes.push(selData[0]);
					this.dataInfo.attributes.push(selData[0]);
					this.dialogVisible = false;
				}
			},
			addfield(){
				var obj = {
                    columnname: '',
					description: '',
					type:'',
					length: '',
					retain: '',
					isEditing: true
                };
                this.dataInfo.attributes.push(obj);
			},
			//删除行
			deleteRow(index, rows) {//Table-操作列中的删除行
				rows.splice(index, 1);
			},
			iconOperation(row, column, cell, event){
		        if(column.property ==="iconOperation"){
		          row.isEditing = !row.isEditing
		        }
		    },
			delfield(item){
                var index = this.dataInfo.attributes.indexOf(item);
                if (index !== -1) {
                    //this.attributes.splice(index, 1)
                    this.dataInfo.attributes.splice(index, 1);
                }
			},
			col_but(col_but) {
				//alert(col_but)
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
			importdia(){
				this.dialogVisible = true;
			},
			//添加显示弹窗
			visible() {
				this.show = true;
			},
			// 这里是修改
			detail(dataid) {
				var url = this.basic_url + '/apps-center/objectcfg/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					this.dataInfo = res.data;
					//this.attributes=this.dataInfo.attributes;
					this.show = true;
				}).catch((err) => {
				});
			},
			//点击关闭按钮
			close() {
				this.show = false;
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
			submitForm(dataInfo) {
				this.$refs[dataInfo].validate((valid) => {
		          if (valid) {
					var url = this.basic_url + '/apps-center/objectcfg/saveOrUpdate';
					//this.dataInfo.attributes=this.attributes;
	               /* $.each(this.attributes,function(i,n){
	                    this.dataInfo.attributes.push(n.columnname +" ，"+n.description+" ，"+n.type+" ，"+n.length+" ，"+n.retain+");
	                });*/	

                // var dataInfo = JSON.parse(JSON.stringify(this.dataInfo));				
					this.$axios.post(url, this.dataInfo).then((res) => {
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							this.show = false;
							//重新加载数据
							this.$emit('request')
						}
					}).catch((err) => {
					});
			          } else {
			            return false;
			          }
			        });
			},
			// 所属组织
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
			// 所属机构
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
			// 角色
			getRole() {
				this.editSearch = 'role';
				var data = {
					params: {
						page: 1,
						limit: 10,
					}
				}
				let that = this;
				var url = this.basic_url + '/api-user/roles';

				this.$axios.get(url, {
					
				}).then((res) => {
					this.resourceData = res.data.data;
					this.dialogVisible = true;
				});
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