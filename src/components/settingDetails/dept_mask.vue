<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加机构</div>
					<div class="mask_title" v-show="modifytitle">修改机构</div>
					<div class="mask_title" v-show="viewtitle">查看机构</div>
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
					<el-form inline-message :model="adddeptForm" :rules="rules" ref="adddeptForm" label-width="100px" id="demo-adduserForm">
						<div class="content-accordion">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="机构信息" name="1">
									<el-row :gutter="30">
										<el-col :span="4" class="pull-right pb10" >
											<el-input v-model="adddeptForm.version" :disabled="edit">
												<template slot="prepend">版本</template>
											</el-input>
										</el-col>
										<!-- <el-col :span="4" class="pull-right" v-if="modify" style="display: none;">
												<el-input v-model="adddeptForm.status==1?'活动':'不活动'" :disabled="edit" >
													<template slot="prepend">信息状态</template>
												</el-input>
										</el-col> -->
										<!-- <el-col :span="4" class="pull-right" v-else style="display: none;">
												<el-input v-model="adddeptForm.status" :disabled="edit" >
													<template slot="prepend">信息状态</template>
												</el-input>
										</el-col> -->
									</el-row>
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="机构序号" prop="step">
												<el-input  v-model="adddeptForm.step" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构编码" prop="code">
												<el-input v-model="adddeptForm.code" :disabled="edit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构名称" prop="fullname">
												<el-input v-model="adddeptForm.fullname" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="上级机构" prop="pName">
												<el-input v-model="adddeptForm.pName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getDept" :disabled="noedit"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构类型" prop="depttype">
												<el-select v-model="adddeptForm.depttype" placeholder="请选择" style="width: 100%" :disabled="noedit">
													<el-option v-for="(data,index) in Selectsys_depttype" :key="index" :value="data.code" :label="data.name"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构属性" prop="type">
												<el-select v-model="adddeptForm.type" placeholder="请选择" style="width: 100%" :disabled="noedit">
													<el-option v-for="(data,index) in SelectDEPT_TYPE" :key="index" :value="data.code" :label="data.name"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="是否停用" prop="inactive">
												<el-input v-if="stopcontent" v-model="adddeptForm.inactive" :disabled="edit"></el-input>
												<el-select v-if="stopselect" v-model="adddeptForm.inactive" placeholder="请选择" style="width: 100%" :disabled="noedit">
													<el-option v-for="item in stopoptions" :key="item.value" :label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="联系地址" prop="address">
												<el-input v-model="adddeptForm.address" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="邮政编码">
												<el-input v-model="adddeptForm.zipcode" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="负责人">
												<el-input v-model="adddeptForm.leaderName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getPerson"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="电话" prop="telephone">
												<el-input v-model="adddeptForm.telephone" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="传真" prop="fax">
												<el-input v-model="adddeptForm.fax" :disabled="noedit">
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="邮箱" prop="email">
												<el-input v-model="adddeptForm.email" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="24">
											<el-form-item label="备注" prop="tips">
												<el-input :rows="3" type="textarea" v-model="adddeptForm.tips" placeholder="请输入" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="其他" name="1" v-show="views">
									<el-row :gutter="30" v-show="personinfo">
										<el-col :span="8">
											<el-form-item label="录入人" prop="createUser" label-width="100px">
												<el-input v-model="adddeptForm.createUser" placeholder="当前录入人" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="createTime" label-width="100px">
												<el-input v-model="adddeptForm.createTime" placeholder="当前录入时间" :disabled="edit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构" prop="deptidDesc" label-width="100px">
												<el-input v-model="adddeptForm.deptidDesc" placeholder="当前录入人机构" :disabled="edit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人" prop="updateUser" label-width="100px">
												<el-input v-model="adddeptForm.updateUser" placeholder="当前修改人" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="updateTime" label-width="100px">
												<el-input v-model="adddeptForm.updateTime" placeholder="当前修改时间" :disabled="edit">
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="save('Update')">保存</el-button>
							<el-button type="success" @click="save('Submit')" v-show="addtitle">保存并继续</el-button>
							<!--<el-button type="primary" class="btn-primarys" @click="submitForm('adddeptForm')">提交</el-button>-->
							<el-button v-if="modify" type="primary" class="btn-primarys" @click="modifyversion">修订</el-button>
							<el-button @click="close">取消</el-button> 
						</div>
					</el-form>
				</div>
			</div>
			<!-- 弹出 -->
			<el-dialog :modal-append-to-body="false" title="上级机构" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
				<div class="scrollbar" style="height:400px;">
					<el-tree ref="tree" :data="resourceData" show-checkbox node-key="id" :default-checked-keys="resourceCheckedKey" :props="resourceProps" default-expand-all @node-click="handleNodeClick" @check-change="handleClicks" check-strictly>
					</el-tree>
				</div>
				<div slot="footer">
			       <el-button type="primary" @click="queding();" >确 定</el-button>
			       <el-button @click="dialogVisible = false">取 消</el-button>
			    </div>
			</el-dialog>

			<!--负责人 Begin-->
			<el-dialog :modal-append-to-body="false" title="选择负责人" :visible.sync="dialogLeader" width="80%" :before-close="handleClose">
					<!-- 第二层弹出的表格 -->
						<el-table :data="userList" border stripe height="420px" style="width: 100%;" :default-sort="{prop:'userList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore">
								<el-table-column type="selection" width="55" fixed>
								</el-table-column>
								<el-table-column label="账号" sortable width="140px" prop="username">
								</el-table-column>
								<el-table-column label="姓名" sortable width="200px" prop="nickname">
								</el-table-column>
								<el-table-column label="机构" sortable width="150px" prop="deptName">
								</el-table-column>
								<el-table-column label="公司" sortable prop="companyName">
								</el-table-column>
								<!-- <el-table-column label="信息状态" sortable width="200px" prop="enabled" :formatter="judge">
								</el-table-column> -->
								<el-table-column label="录入时间" width="150px" prop="createTime" sortable :formatter="dateFormat">
								</el-table-column>
							</el-table>
							<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
							</el-pagination>
						<!-- 表格 -->
					
					<div slot="footer">
				       <el-button type="primary" @click="addleader">确 定</el-button>
				       <el-button @click="dialogLeader = false">取 消</el-button>
				    </div>
			</el-dialog>
			<!--负责人 End-->
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	export default {
		name: 'masks',
		props: {
			adddeptForm: {
				type: Object,
				default: function(){
					return {
						version:'',
						status:'',
						step:'',
						code:'',
						fullname:'',
						pName:'',
						pid:'',
						depttype:'',
						type:'',
						inactive:'',
						address:'',
						zipcode:'',
						leader:'',
						leaderName:'',
						telephone:'',
						fax:'',
						email:'',
						tips:'',
						createUser:'',
						createTime:'',
						updateUser:'',
						updateTime:''
					}
				}
			}
		},
		data() {
			return {
				basic_url: Config.dev_url,
				value: '',
				loadSign: true, //加载
				commentArr: {},
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '2',
					label: '不活动'
				}],
				stopoptions: [{
					value: '1',
					label: '是'
				}, {
					value: '2',
					label: '否'
				}],
				personinfo:false,
				showcode:true,
				views: false, //录入修改人信息
				noviews:true,//按钮
				selMenu:[],
				selUser: [],
				selData: [],//获取当前负责人
				SelectDEPT_TYPE:[],//获取机构属性
				Selectsys_depttype:[],//获取机构类型
				activeNames: ['1'], //手风琴数量
				userList: [],
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				dialogVisible: false, //对话框
				edit: true, //禁填
				noedit: false,//表单内容
				editSearch: '',
				noedit:false,//可编辑
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				show: false,
				isok1: true,
				isok2: false,
//				labelPosition: 'top',
				addtitle:true,//添加弹出框titile
				modifytitle:false,//修改弹出框titile
				viewtitle:false,//查看弹出框titile
				modify:false,//修订
				dialogLeader:false,
				stopcontent:false,
				stopselect:false,
	          	//tree树菜单
				resourceData: [], //数组，我这里是通过接口获取数据
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "children",
					label: "fullname"
				},
				rules:{
   					step: [{required:false,trigger: 'blur',validator: this.Validators.isWorknumber}],//机构序号
					fullname: [
						{required:true, trigger: 'blur', message: '必填',validator: this.Validators.isNickname}
					],//机构名称
					depttype: [{required:true,trigger: 'change',message: '请选择机构类型'}],//选择机构类型
   					type: [{required:true,trigger: 'change',message: '请选择机构属性'}],//选择机构属性
   					telephone: [{required:false,trigger: 'blur',validator: this.Validators.isTelephone}],//电话
					fax: [{required:false,trigger: 'blur',validator: this.Validators.isTelephone}],//传真
					email:[{required:true, trigger: 'blur', validator: this.Validators.isEmail,}],//邮箱
					code:[{required: false,trigger: 'blur',validator: this.Validators.isWorknumber}],//机构属性
					// address:[{required: true,trigger: 'blur',validator: this.Validators.isSpecificKey}],//联系地址
					address: [{required:true,trigger: 'blur',message: '请输入地址'}],//选择机构类型
					zipcode:[{required:false,trigger: 'blur',message: '请输入邮编'}],//选择机构类型
					telephone:[{required: true,trigger: 'blur',validator: this.Validators.isTelephone}],//电话
					fax:[{required: false,trigger: 'blur',validator: this.Validators.isTelephone}],//传真
					email:[{required: true, trigger: 'blur', message: '请输入邮箱'}],//邮箱
					tips:[{required: false,trigger: 'blur',validator: this.Validators.isSpecificKey}],//备注
					leaderName:[{required: true,trigger: 'blur',message: '请输入负责人'}],
				}
			}
		},
		methods: {
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
        	//添加显示弹窗
			visible() {//点击父组件按钮显示弹窗
				this.$axios.get(this.basic_url +'/api-user/users/currentMap', {}).then((res) => {
	     			this.adddeptForm.createUser = res.data.nickname;
	     			var date=new Date();
					this.adddeptForm.createTime = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				 }).catch((err) => {
				});	
				// this.$refs["adddeptForm"].resetFields();//清空表单验证
				this.adddeptForm.depttype='1';
				this.show = true;
				this.addtitle = true;
				this.modifytitle = false;
				this.modify = false;//修订按钮
				this.noedit = false; //表单内容
				this.views = false; //录入修改人信息
				this.noviews = true; //按钮
				this.stopcontent = true;
				this.stopselect = false;
				this.showcode = false;
			},
			//修改
			detail() {
				this.addtitle = false;
				this.modifytitle = true;
				this.viewtitle = false;
				this.views = false; //录入修改人信息
				this.noviews = true; //按钮
				this.modify = true;//修订按钮
				this.noedit = false; //表单内容
				this.stopcontent = false;
				this.stopselect = true;
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
	    			this.adddeptForm.updateUser = res.data.id;
	    			this.adddeptForm.updatebyName = res.data.nickname;
					var date=new Date();
					this.adddeptForm.updateTime = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					for(var key in this.adddeptForm){ 
						this.adddeptForm.hasOwnProperty('_expanded');
						this.adddeptForm.hasOwnProperty('_level');
						this.adddeptForm.hasOwnProperty('_parent');
						this.adddeptForm.hasOwnProperty('_show');
						delete this.adddeptForm._expanded;
						delete this.adddeptForm._level;
						delete this.adddeptForm._parent;
						delete this.adddeptForm._show;
						
					}
					//深拷贝数据
					// let obj = JSON.parse(JSON.stringfy(this.adddeptForm));
        			// this.ADDDEPTFORM = JSON.parse(obj);
				}).catch((err) => {
				});
                 this.show = true;
			},
			//这是查看
			view(){
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.modify = true;//修订按钮
				this.noedit = true;
				this.views = true; //录入修改人信息
				this.noviews = false; //按钮
				this.stopcontent = false;
				this.stopselect = true;
				this.personinfo = true;
				this.show = true;
			},
			//获取负责人数据
			getPerson(){
				this.requestData();
				this.dialogLeader = true;
			},
			SelChange(val) {
				this.selUser = val;
			},
			loadMore() {
				if(this.loadSign) {
					this.loadSign = false
					this.page.currentPage++
						if(this.page.currentPage > Math.ceil(this.page.totalCount / this.page.pageSize)) {
							return
						}
					setTimeout(() => {
						this.loadSign = true
					}, 1000)
					this.requestData()
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
			judge(data) {
				//taxStatus 布尔值
				return data.enabled ? '活动' : '不活动'
			},
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD"); 
			},
			addleader(){
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
					this.adddeptForm.leader = selData[0].id;
					this.adddeptForm.leaderName = selData[0].nickname;
					this.dialogLeader = false;
				}
			},
			//点击修订按钮
			modifyversion(){
				this.$refs.adddeptForm.validate((valid) => {
					if(valid) {
						var ADDDEPTFORM=JSON.stringify(this.ADDDEPTFORM); //父传的值
	 					var adddeptForm=JSON.stringify(this.adddeptForm);//新输入的值
					 	if(adddeptForm==ADDDEPTFORM){
					  	this.$message({
								message: '没有修改内容，不允许修订！',
								type: 'warning'
							});
							return false;
					   }else{
							var url = this.basic_url + '/api-user/depts/upgraded';
							this.$axios.post(url, this.adddeptForm).then((res) => {
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

			//所属上级
			getDept() {
				var page = this.page.currentPage;
				var limit = this.page.pageSize;
				var url = this.basic_url + '/api-user/depts/treeMap';
				this.$axios.get(url, {
					// params: {
					// 	page: page,
					// 	limit: limit,
					// 	// type: type
					// },
				}).then((res) => {
					this.resourceData = res.data;
					this.dialogVisible = true;
				});
			},
			queding() {
				this.getCheckedNodes(this.checkedNodes);
				if(this.checkedNodes == undefined){
					this.$message({
						message:'请选择数据',
						type:'warning'
					})
				
				}else{
					this.dialogVisible = false;				
					this.adddeptForm.pid = this.checkedNodes[0].id;
					this.adddeptForm.parent = this.checkedNodes[0].fullname;
					this.adddeptForm.pName = this.checkedNodes[0].fullname;
				}				
			},
			getCheckedNodes() {
				this.checkedNodes = this.$refs.tree.getCheckedNodes()
			},
			
			//生成随机数函数
			rand(min,max) {
		        return Math.floor(Math.random()*(max-min))+min;
		    },
			getDEPT_TYPE() {//获取机构属性
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=DEPT_TYPE';
				this.$axios.get(url, {}).then((res) => {
					this.SelectDEPT_TYPE = res.data;
				}).catch(error => {
				})
			},
			getsys_depttype() {//获取机构类型
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=depttype';
				this.$axios.get(url, {}).then((res) => {
					this.Selectsys_depttype = res.data;
					 adddeptForm.depttype='2'
				}).catch(error => {
				})
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
			//获取负责人数据
			requestData() {
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					// deptName: this.searchList.deptName,
					// nickname: this.searchList.nickname,
					// username: this.searchList.username,
					companyId: this.companyId,
					deptId: this.deptId
				}
				var url = this.basic_url + '/api-user/users';
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

					this.userList = newarr;
				}).catch((wrong) => {})
			},
			//保存
			save(parameter) {
				var _this = this;
				this.$refs.adddeptForm.validate((valid) => {
		          if (valid) {
		          	_this.adddeptForm.status=((_this.adddeptForm.status=="1"||_this.adddeptForm.status=='活动') ? '1' : '0');
					var url = _this.basic_url + '/api-user/depts/saveOrUpdate';
					this.$axios.post(url, {
						address: this.adddeptForm.address,
						children: this.adddeptForm.children,
						code: this.adddeptForm.code,
						createTime: this.adddeptForm.createTime,
						createUser: this.adddeptForm.createUser,
						createbyName: this.adddeptForm.createbyName,
						del_flag: this.adddeptForm.del_flag,
						depttype: this.adddeptForm.depttype,
						depttypeName: this.adddeptForm.depttypeName,
						email: this.adddeptForm.email,

						fullname: this.adddeptForm.fullname,
						id: this.adddeptForm.id,
						leaderName: this.adddeptForm.leaderName,
						pName: this.adddeptForm.pName,
						status: this.adddeptForm.status,
						telephone: this.adddeptForm.telephone,
						type: this.adddeptForm.type,
						typeName: this.adddeptForm.typeName,
						updateTime: this.adddeptForm.updateTime,
						updateUser: this.adddeptForm.updateUser,
						updatebyName:this.adddeptForm.updatebyName,
					}).then((res) => {
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							if(parameter=="Update"){
								this.$emit('request');
								this.show = false;
							}else{
								this.$emit('reset');
								this.show = true;
							}
							this.$refs["adddeptForm"].resetFields();//清空验证							 
						}
					}).catch((err) => {
						this.$message({
							 message: err.resp_msg,
							type: 'warning'
						});
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
		},
		mounted() {
			this.getDEPT_TYPE();//页面打开加载-机构属性
			this.getsys_depttype();//页面打开加载-机构类型
			this.requestData();
		}
	}
</script>

<style>
	@import '../../assets/css/mask-modules.css';
	
	/*.el-form-item__error {
		top: 18%;
	    left: 5px;
	    background: #FFF;
	    padding: 5px 10px;
	}*/
</style>