<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title">配置关系</div>
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
									<el-collapse-item title="配置关系" name="2">
										<!-- 字段列表 Begin-->
										<div class="table-func">
											<el-button type="success" size="mini" round @click="addfield">
												<i class="icon-add"></i>
												<font>新建</font>
											</el-button>
										</div>
										<el-form :data="fieldList">
						                <el-form-item>
						                	<el-row :gutter="20">
						                		<el-col :span="4">
						                            <el-form-item label="关系名称"></el-form-item>
						                        </el-col>
						                        <el-col :span="5">
						                            <el-form-item label="父表对象"></el-form-item>
						                        </el-col>
						                        <el-col :span="5">
						                            <el-form-item label="字表对象"></el-form-item>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-form-item label="where子句"></el-form-item>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-form-item label="备注"></el-form-item>
						                        </el-col>
						                        <el-col :span="2">
						                            <el-form-item label="操作"></el-form-item>
						                        </el-col>
						                	</el-row>
						                    <el-row :gutter="20" v-for="(item,key) in fieldList" :key="key"><!-- ：key避免重复 -->
						                        <el-col :span="4">
						                            <el-input type="text"  placeholder="请输入人物" v-model="item.leadname"></el-input>
						                        </el-col>
						                        <el-col :span="5">
						                            <el-input v-model="item.leaddecri" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getDept"></el-button>
												</el-input>
						                        </el-col>
						                        <el-col :span="5">
						                            <el-input v-model="item.leaddecri" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getDept"></el-button>
													</el-input>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-input type="text"  placeholder="请输入关系" v-model="item.leadprecision"></el-input>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-input type="text"  placeholder="请输入关系" v-model="item.leadlength"></el-input>
						                        </el-col>
						                        <el-col :span="2">
						                            <i class="el-icon-delete" @click="delfield(item)" style="color: red"></i>
						                        </el-col>
						                    </el-row>
						                </el-form-item>
						            </el-form>
									<!-- 字段列表 End -->
									</el-collapse-item>
								</el-collapse>
							<!-- </div> -->
						</div>	
						<div class="content-footer">
							<el-button type="primary" @click='submitForm()'>提交</el-button>
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
								<el-table-column label="字段名称" sortable width="150" prop="leadname">
								</el-table-column>
								<el-table-column label="字段描述" sortable width="200" prop="leaddecri">
								</el-table-column>
								<el-table-column label="字段类型" sortable width="150" prop="leadtype">
								</el-table-column>
								<el-table-column label="小数点位数" sortable width="180" prop="leadprecision">
								</el-table-column>
								<el-table-column label="字段长度" sortable width="100" prop="leadlength">
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
			return {
				basic_url: Config.dev_url,
				selUser:[],
				edit: true, //禁填
				col_but1: true,
				col_but2: true,
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				useritem: [],
				activeNames: ['1','2'],//手风琴数量
//				labelPosition: 'top', //表格
				dialogVisible: false, //对话框
				dataList:[{
					objectName:'',
					description:''
				}],
				leaddata:[//导入数据的表格
				{
					leadname:'author',
					leaddecri:'作者姓名',
					leadtype:'字符串(string)',
					leadprecision:'',
					leadlength:'6'
				},
				{
					leadname:'author',
					leaddecri:'作者姓名',
					leadtype:'字符串(string)',
					leadprecision:'',
					leadlength:'6'
				},
				{
					leadname:'author',
					leaddecri:'作者姓名',
					leadtype:'字符串(string)',
					leadprecision:'',
					leadlength:'6'
				},
				{
					leadname:'author',
					leaddecri:'作者姓名',
					leadtype:'字符串(string)',
					leadprecision:'',
					leadlength:'6'
				}],
				dataInfo: {//添加数据库列表信息
					objectName:'',
					description:'',
					fieldList:[]
				},
				fieldList:[{//字段列表
					leadname: '',
					leaddecri: '',
					leadtype:'',
					leadprecision: '',
					leadlength: ''
				}],
				rules: {
					// companyName: [{ required: true, trigger: 'change', validator: validatePass1,}],
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
			};
		},
		methods: {
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
					this.fieldList.push(selData[0]);
					this.dialogVisible = false;
				}
			},
			addfield(){
				var obj = {
                    leadname: '',
					leaddecri: '',
					leadtype:'',
					leadprecision: '',
					leadlength: ''
                };
                this.fieldList.push(obj);
			},
			delfield(item){;
                var index = this.fieldList.indexOf(item);
                if (index !== -1) {
                    this.fieldList.splice(index, 1)
                }
			},
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
			importdia(){
				this.dialogVisible = true;
			},
			//添加显示弹窗
			visible() {
				this.show = true;
			},
			// 这里是修改
			detail(userid) {
				var url = this.basic_url + '/apps-center/objectcfg/' + userid;
				this.$axios.get(url, {}).then((res) => {
					this.user = res.data;
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
			submitForm() {
				this.dataInfo.fieldList.push(this.fieldList);
				this.show = false;
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