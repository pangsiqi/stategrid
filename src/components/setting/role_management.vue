<template>
<div>
		<!-- header Begin -->
		<div class="headerbg">
			<div style="    width: 80px;
			height: 60px;
			background-color: rgb(2, 182, 169);
			border: none;
			padding-top: 12px;
			padding-left: 20px;
			color: rgb(255, 255, 255);" class="topleft">
				<span class="navbar-minimalize minimalize-styl-2" @click="min2max()">
					<i class="icon-menu1"></i> 
				</span>
			</div>
			<div class="">
					<vheader></vheader>
			</div>
		</div>
    <!-- header End -->
		<!--左侧菜单内容显示 Begin-->
		<div style="margin-top: 60px;">
				<div class="navbar-default navbar-static-side">
					<div id="sidebar-collapse">
						<div class="tv">
							<div class="icon icon-home
							"></div>
								<div class="xiangqing">首页</div>
						</div>
						<div class="tv">
							<div class="icon icon-layers"></div>
								<div class="xiangqing">组织管理</div>
						</div>
						<div class="tv">
							<div class="icon icon-distribution"></div>
								<div class="xiangqing">人员管理</div>
						</div>
						<div class="tv">
							<div class="icon icon-award"></div>
								<div class="xiangqing">选拔任用</div>
						</div>
						<div class="tv">
							<div class="icon icon-eye"></div>
								<div class="xiangqing">监督管理</div>
						</div>
						<div class="tv">
							<div class="icon icon-pie-chart"></div>
								<div class="xiangqing">分析研判</div>
						</div>
						<div class="tv">
							<div class="icon icon-grid"></div>
								<div class="xiangqing">综合查询</div>
						</div>
						<div class="tv">
							<div class="icon icon-book-open"></div>
								<div class="xiangqing">培训培养</div>
						</div>
					</div>
				</div>
			<!--左侧菜单内容显示 End-->
			<!--右侧内容显示 Begin-->
			<div class="wrapper wrapper-content">
					<div class="">
							<navs_tabs></navs_tabs>
					</div>
				
				<div class="ibox-content" :style="{height: fullHeight}">
					<div id="search" style="width: 98.1%;
					height: 113px;
					background-color: #ffffff;
					margin-left: 12px;
					margin-top: 41px;" :class="operateinfo?activeback:noneback">
						<el-form ref="personinfo" inline-message :model="personinfo" :rules="rules" :label-position="labelPosition" style="margin-top: -29px;margin-left: 11px;">
								<el-row :gutter="30">
										<el-col :span="6" style="padding-left: 33px;padding-top: 8px;padding-right: 8px;">
											<el-form-item label="选择日期" label-width="100px">
													<el-date-picker v-model="value6"  type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" style="width:240px">
    											</el-date-picker>
											</el-form-item>
										</el-col>
										<el-col :span="3" style="padding-top: 8px;">
												<el-form-item label="选择状态" label-width="100px">
														<el-select v-model="personinfo.roleId" clearable placeholder="请选择" style="width: 100%" value-key="item.id">
																<el-option value="已提交" label="已提交"></el-option>
																<el-option value="已保存" label="已保存"></el-option>
															</el-select>
												</el-form-item>
											</el-col>
											<el-col :span="4" style="padding-left: 33px;padding-top: 51px;padding-right: 39px;">
												<el-form-item label="" label-width="100px">
														<el-button  @click="searchinfo" size="small" style="margin-top:2px;background-color:#02b6a9;border-color:#02b6a9;color:#ffffff">查询</el-button>
												</el-form-item>
											</el-col>
											<el-col :span="3" style="padding-left: 33px;padding-top: 51px;padding-right: 39px;">
												<el-form-item label="" label-width="100px">
												</el-form-item>
											</el-col>
											<el-col :span="4" style="padding-left: 12px;padding-right: 16px;padding-top: 51px;float: right;" >
													<el-button  @click="alterbtn" size="small" style="margin-top:2px"><i class="icon-menu3"></i>&nbsp;&nbsp;变更操作</el-button>
													<el-button  @click="resetbtn" size="small" style="margin-top:2px;margin-left: 8px">提示</el-button>
											</el-col>
								</el-row>
						</el-form>
					</div>
					<div style="width: 98.1%;
					height: 67px;
					background-color: rgb(255, 255, 255);
					margin-left: 12px;
					margin-top: 29px;" v-show="operateinfo">
							<el-form ref="personinfo" inline-message :model="personinfo" :rules="rules" :label-position="right" style="margin-top: -29px;margin-left: 11px;">
									<el-row :gutter="30">
											<el-col :span="10" style="padding-left: 33px;padding-top: 8px;padding-right: 8px;">
												<el-form-item label="选择日期" label-width="70px">
														<el-radio v-model="radio" label="1" class="radiobtn">新增</el-radio>
														<el-radio v-model="radio" label="2">人员调动</el-radio>
														<el-radio v-model="radio" label="3">退休</el-radio>
														<el-radio v-model="radio" label="4">离职</el-radio>
												</el-form-item>
											</el-col>
											<el-col :span="11" style="padding-left: 33px;padding-top: 8px;padding-right: 8px;">
													<!-- <el-button  @click="resetbtn" size="small" style="margin-top:2px;margin-left: 8px"></el-button> -->
											</el-col>
											<el-col :span="2" style="padding-left: 33px;padding-top: 8px;padding-right: 8px;">
													<el-button  @click="admirebtn" size="small" style="margin-top:2px;margin-left: 38px;background-color:#02b6a9;border-color:#02b6a9;color:#ffffff"">确认</el-button>
											</el-col>
									</el-row>
							</el-form>
					</div>
					<div class="tablediv" style="
					background-color: #ffffff;
					padding: 30px;
					margin: 12px;height:439px">
						<!-- 表格 -->
						<el-table	ref="multipleTable"	:data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" height="340px" stripe border>
							<el-table-column align="center"	type="selection" width="55" fixed>
							</el-table-column>
							<el-table-column prop="num"	label="序号" width="80" align="center">
							</el-table-column>
							<el-table-column	label="人员姓名" width="180">
									<template slot-scope="scope">
											<p class="blue" title="点击查看详情" @click="view">{{scope.row.name}}
											</p>
										</template>
							</el-table-column>
							<el-table-column	prop="type"	label="变更类型" show-overflow-tooltip width="150">
							</el-table-column>
							<el-table-column	prop="reason"	label="变更原因"	show-overflow-tooltip width="230">
							</el-table-column>
							<el-table-column	prop="begintime"	label="开始时间"	show-overflow-tooltip width="250">
							</el-table-column>
							<el-table-column	prop="status"	label="状态"	show-overflow-tooltip width="180">
									<template slot-scope="scope">
											<el-tag type="success">已提交</el-tag>
										</template>
									
							</el-table-column>
						  <el-table-column	prop="option"	label="操作"	show-overflow-tooltip fixed="right" align="center">
								<template slot-scope="scope">
										<el-button type="text" size="small" class="ass" style="color:rgb(0,0,0,0.65)"><i class="icon-edit"></i></el-button>
								</template>
							</el-table-column>
						</el-table>
							<!-- 表格 -->
							<el-pagination background
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page="currentPage4"
							:page-sizes="[100, 200, 300, 400]"
							:page-size="100"
							layout="total, sizes, prev, pager, next, jumper"
							:total="400" class="pull-right pt20 pb20">
						</el-pagination>
					</div>
					
				</div>
			</div>
			<categorymask :dataInfo="dataInfo" ref="categorymask" @request="requestData" @reset="reset" v-bind:page=page></categorymask>

		</div>
	<!-- </div> -->
	<!--右侧内容显示 End-->
  	<!--弹出框内容显示 Begin-->
	<el-dialog :modal-append-to-body="false" title="机构" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
		<el-tree ref="tree" :data="resourceData" show-checkbox node-key="id" default-expand-all :default-checked-keys="resourceCheckedKey" :props="resourceProps" @node-click="handleNodeClick" @check-change="handleClicks" check-strictly="true">
		</el-tree>
		<div slot="footer">
			<el-button type="primary" @click="dailogconfirm" >确 定</el-button>
			<el-button @click="dialogVisible = false">取 消</el-button>
		</div>
	</el-dialog>
	<!--弹出框内容显示 End-->
</div>
</template>

<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	import { Loading } from 'element-ui'
	import categorymask from '../settingDetails/application_mask.vue'
	export default {
		name: 'personinfo',
		components: {
			vheader,
			navs_tabs,
			categorymask
		},
		data() {
			return {
				operateinfo:true,
				radio: '1',
				value6:'',
				loading: false,
				activeName: 'first', //tabs
				docParm:{},
				basic_url: Config.dev_url,
				file_url: Config.file_url,
				editSearch: '',
				'启用': 1,
				'冻结': 0,
				'男': 1,
				'女': 0,
				activeNames: ['1','2','3','4'],//手风琴数量
				show:false,
				userList: [],
				selectData: [], //
				isShow: false,
				ismin:true,
				fullHeight: document.documentElement.clientHeight - 110+'px',//获取浏览器高度
				headImgUrl: '',//头像上传
				fileid: 1,
				index:0,
				labelPosition: 'top',
				dialogVisible: false, //对话框
				personinfo:{},
				tableData3: [{
          num: '1',
          name: '李建国',
          type: '新增',
					reason: '2019社会招聘',
          begintime: '2019-3-28 12：08：37',
          // status: '<el-tag type="success">标签二</el-tag>',
        }, {
          num: '2',
          name: '李卫华',
          type: '人员调动',
					reason: '人员跨单位调动',
          begintime: '2019-3-28 12：08：38',
          // status: '',
        }, {
          num: '3',
          name: '王建业',
          type: '退休',
					reason: '人员满退休年龄自愿退休',
          begintime: '2019-3-28 12：01：22',
          // status: '',
        }, {
          num: '4',
          name: '张国平',
          type: '退休',
					reason: '人员满退休年龄自愿退休',
          begintime: '2019-3-28 11：58：37',
          // status: '',
        }, {
          num: '5',
          name: '夏金东',
          type: '离职',
					reason: '劳动者主动解除劳动合同',
          begintime: '2019-3-28 11：08：37',
          // status: '',
        }, {
          num: '6',
          name: '黄洁华',
					type: '离职',
					reason: '劳动者主动解除劳动合同',
          begintime: '2019-3-28 12：08：37',
          // status: '11',
        }, {
          num: '7',
          name: '张光亮',
					type: '离职',
					reason: '劳动者主动解除劳动合同',
          begintime: '2019-3-28 12：08：37',
          // status: '',
        }],
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "fullname"
				},
			rules: {//required: true,必填标题加红*
	    	roleId: [{required: true,trigger: 'blur',message: '必填',}],
		    nickname: [{required: true,trigger: 'blur',validator: this.Validators.isNickname}],
	      worknumber: [
					{required: true,trigger: 'blur',message: '必填'},
					{validator: this.Validators.isWorknumber, trigger: 'blur'},//引用 isWorknumber
				],
		    email: [
					{required: true,trigger: 'blur',message: '必填'},
					{validator:this.Validators.isEmail, trigger: 'blur'},
				],
				telephone: [{required: false,trigger: 'blur',validator: this.Validators.isTelephone}],
				phone:  [
					{required: true,trigger: 'blur',message: '必填'},
					{validator: this.Validators.isPhone, trigger: 'blur'},
				],
				idnumber: [{required: false,trigger: 'blur', validator: this.Validators.isIdnumber}],
				address: [{required: false,trigger: 'blur', validator: this.Validators.isSpecificKey}],
				zipcode: [{required: false,trigger: 'blur', validator: this.Validators.isZipcode}],
				ipaddress: [{required: false,trigger: 'blur', validator: this.Validators.isIpaddress}],
				macaddress: [{required: false,trigger: 'blur', validator: this.Validators.isMacaddress}],
				post: [{required: false,trigger: 'blur', validator: this.Validators.isSpecificKey}],
				tips: [{required: false,trigger: 'blur', validator: this.Validators.isSpecificKey}],
			},
			leftNavs: [//leftNavs左侧菜单数据
					{
							navicon: 'icon-user',
							navtitle: '个人资料',
							navherf: '/personinfo'
					}, {
							navicon: 'icon-edit',
							navtitle: '修改密码',
							navherf: '/passwordedit'
					}
				]
			}
		},
		
		methods: { 
			//查看
			view() {
				this.$refs.categorymask.view();
			},
			alterbtn(){
				this.operateinfo = !this.operateinfo;
			},
			admirebtn(item){
            this.clickvalue = item;
            this.$router.push({path: '/personinfo'});
            // this.$store.dispatch('setClickedNavAct',item);
        },
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing;
				}
			},
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			addfield1() {
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					var currentUser, currentDate;
					this.currentUser = res.data.nickname;
					this.enterby = res.data.id
					var date = new Date();
					this.currentDate = this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
					var obj = {
						step: 1,
						c_num: '',
						c_name: '',
						c_date: '',
						status: '',
						enterdate: this.currentDate,
						enterbyName: this.currentUser,
						enterby: this.enterby,
						//少附件
						isEditing: true
					};
					this.personinfo.qualifications.push(obj);
				}).catch((err) => {
				})

			},
			addfield2() {
				var obj = {
					step: 1,
					t_date: '',
					t_description: '',
					status: '',
					isEditing: true
				};
				this.personinfo.traings.push(obj);
			},

			addfield3() {
				var obj = {
					STEP: 1,
					IP_BEGIN: '',
					IP_END: '',
					isEditing: true
				};
				this.personinfo.ips.push(obj);
			},
			upload(e){
				var formData = new FormData();
				this.loading = true;
				this.$emit('showLoading');
				formData.append('files', document.getElementById('excelFile').files[0]);
				var config = {
					//添加请求头
					headers: { "Content-Type": "multipart/form-data" },
					//添加上传进度监听事件
					onUploadProgress: e => {
						var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
						this.progress = completeProgress;
					}
				};
				var url = this.file_url + '/file/uploadIcon?userid=' + this.docParm.userid 
						+ '&username=' + this.docParm.username
						+ '&deptid=' + this.docParm.deptid
						+ '&deptfullname=' + this.docParm.deptfullname
						+ '&recordid=1&appname=icon&appid=99&pathid=5';
				if(this.headImgUrl!=''){
					url += '&fileid=' + this.fileid;
				}
				this.$axios.post(url, formData, config
				).then((res)=>{
					this.loading = false;
					if(res.data.code == 0){
						this.$message({
							message: res.data.message,
							type: 'error'
						});
					}else{
						this.$message({
							message: '文件已成功上传至服务器',
							type: 'success'
						});
						this.headImgUrl = res.data.icon;
					}
				})
			},
			getData(){//获取当前用户信息
	    		var url = this.basic_url + '/api-user/users/currentMap';
	    		this.$axios.get(url, {}).then((res) => { 
	    			this.personinfo=res.data;
					var roles =res.data.roles;
					this.docParm.userid = res.data.id;
					this.docParm.username = res.data.username;
					this.docParm.deptid = res.data.deptId;
					this.docParm.deptfullname = res.data.deptName;
	    			this.personinfo.roleId = this.personinfo.roleId.split(',');
					var arr = [];
					var roleId = this.personinfo.roleId;
					for(var i=0; i< roleId.length; i++){
						roleId[i] =  parseInt(roleId[i]);
					}
	    			this.getImgUrl();
				}).catch((err) => {
				});
			},
			getImgUrl(){//用户头像
				var url = this.file_url + '/file/icon?appname=icon&userid=' + this.docParm.userid;
				this.$axios.get(url, {}).then((res) => {
					if(res.data.code==1){
						this.headImgUrl = res.data.icon;
						this.fileid = res.data.fileid;
					}else{
						this.headImgUrl = '';
						this.fileid = 0;
					}
				});
			},
	    	handleNodeClick(data) { //获取勾选树菜单节点
				
			},
			handleClicks(data,checked, indeterminate) {//获取机构勾选树菜单节点
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
			// getCompany() {//所属组织
			// 	this.editSearch = 'company';
			// 	var url = this.basic_url + '/api-user/depts/type';
			// 	this.$axios.get(url, {}).then((res) => {
			// 		this.resourceData = res.data.data;
			// 		this.dialogVisible = true;
			// 	});
			// },
			getDept() {//所属机构
				this.editSearch = 'dept';
				var url = this.basic_url + '/api-user/depts/treeMap';
				this.$axios.get(url, {}).then((res) => {
					// 
					this.resourceData = res.data.data;
					this.dialogVisible = true;
				});
			},

			//角色
			getRole() {
				var url = this.basic_url + '/api-user/roles';
				this.$axios.get(url, {}).then((res) => {
					this.selectData = res.data.data;
				}).catch(error => {
				})
			},
			getCheckedNodes() {//获取树菜单节点
				this.checkedNodes = this.$refs.tree.getCheckedNodes()
			},
			dailogconfirm() {//弹出框确定按钮调用数据
				this.getCheckedNodes();
				this.dialogVisible = false;
				if(this.editSearch == 'company') {
					this.personinfo.companyId = this.checkedNodes[0].id;
					this.personinfo.companyName = this.checkedNodes[0].fullname;
				} else {
					this.personinfo.deptId = this.checkedNodes[0].id;
					this.personinfo.deptName = this.checkedNodes[0].fullname;
				}

			},
			handleClose(done) {//确认框关闭
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
			},
	    	submitForm(formName) {//修改当前用户信息
		        this.$refs[formName].validate((valid) => {
					if (valid) {
							var url = this.basic_url + '/api-user/users/me';
							var personinfo=this.personinfo;
							var _this=this
							personinfo.sex = personinfo.sex == '男' ? 1 : 0;
						var roleId = "";
						if(typeof(personinfo.roleId) != 'undefind' && personinfo.roleId.length > 0) {
							var arr = [];
							personinfo.roleId.forEach(function(item) {
								var roles = _this.selectData;
								for(var j = 0; j < roles.length; j++) {
									if(roles[j].id == item) {
										arr.push(roles[j]);
										roleId = roleId + roles[j].id + ",";
									}
								}
							});
							personinfo.roleId = roleId;
							personinfo.roles = arr;
						} else {
							personinfo.roleId = '';
							personinfo.roles = [];
						}
							this.$axios.put(url, this.personinfo).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
							} 
						}).catch((err) => {
						});

					} else {
						return false;
					}
		        });
			},

			resetForm(formName) {//重置按钮调用
				this.personinfo = {
					companyId: '',//所属组织ID
					companyName: '',//所属组织
					deptId: '',//所属机构ID
					deptName: '',//所属机构
					nickname:'',//人员姓名
					username:'',//用户名
					enabled:'',//配置信息状态
					enabledName:'',//配置信息状态名称
					birthday:'',//出生日期
					sex:'',//性别
					entrytime:'',//入职日
					email:'',//邮箱
					phone:'',//手机
					address:'',//地址
					tips:'',//备注
					telephone:'',//联系电话
					zipcode:'',//邮编
					ipaddress:'',//IP地址
					macaddress:'',//MAC地址
					roleId: [],
					roles: [],
					traings: [],
					qualifications: [],
					ips: [],
				};
				this.$refs[formName].resetFields();//
			},

			handleAvatarSuccess(res, file) {//上传头像
		        this.headImgUrl = URL.createObjectURL(file.raw);
		    },
		    beforeAvatarUpload(file) {//上传头像图片格式和大小验证
		        const isJPG = file.type === 'image/jpeg';
		        const isLt2M = file.size / 1024 / 1024 < 2;
		        if (!isJPG) {
		          this.$message.error('上传头像图片只能是 JPG 格式!');
		        }
		        if (!isLt2M) {
		          this.$message.error('上传头像图片大小不能超过 2MB!');
		        }
		        return isJPG && isLt2M;
		    },
		    editpassword(){//点击修改密码按钮跳转到修改密码页面
		      	this.$router.push({path: '/passwordedit'})
		    },
			min2max(){//左侧菜单正常和变小切换
				if($(".navbar-static-side").width()=="80"){
					$(".wrapper").css("padding-left", "80px");
					this.maxDialog();
				}else if($(".navbar-static-side").width()=="0"){
					$(".wrapper").css("padding-left", "0px");
					$(".navs>li").css("margin", "0");
					this.rebackDialog();
				}
				this.ismin=!this.ismin;
			},
		  maxDialog(e) {//右侧内容跟着左侧菜单正常和变小切换
		    $(".navbar-static-side").css("margin-left", "-80px");
				$(".wrapper").css("padding-left", "0px");
				$(".navbar-static-side").css("width", "0px");
			},
			rebackDialog() {//左侧菜单正常
				$(".navbar-static-side").css("margin-left", "0px");
				$(".wrapper").css("padding-left", "80px");
				$(".navbar-static-side").css("width", "80px");
			},
			upload2(e){
				var list = this.personinfo.qualifications || [];
				var editList = [];
				for(let i=0; i<list.length; i++){
					if(list[i].isEditing){
						editList.push(i);
					}
				}
				if(editList.length > 1){
					this.$message({
						message: '不可同时编辑多条数据',
						type: 'error'
					});
					return;
				}
				if(editList.length == 0){
					this.$message({
						message: '请选择要上传文件的数据',
						type: 'error'
					});
					return;
				}
				var formData = new FormData();
				var loading;
				loading = Loading.service({
					fullscreen: true,
					text: '拼命上传中...',
					background: 'rgba(F,F, F, 0.8)'
				});
				// this.$emit('showLoading');
				formData.append('files', document.getElementById('excelFile1').files[0]);
				var config = {
					//添加请求头
					headers: { "Content-Type": "multipart/form-data" },
					//添加上传进度监听事件
					onUploadProgress: e => {
						var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
						this.progress = completeProgress;
					}
				};
				var url = this.file_url + '/file/uploadfile?userid=' + this.docParm.userid 
						+ '&username=' + this.docParm.username
						+ '&deptid=' + this.docParm.deptid
						+ '&deptfullname=' + this.docParm.deptfullname
						+ '&recordid=1&appname=客户管理&appid=2';
				this.$axios.post(url, formData, config
				).then((res)=>{
					loading.close();
					if(res.data.code == 0){
						this.$message({
							message: res.data.message,
							type: 'error'
						});
					}else{
						this.$message({
							message: '文件已成功上传至服务器',
							type: 'success'
						});
						var index = editList[0];
						this.personinfo.qualifications[index].FILEID = res.data.fileid;
						this.personinfo.qualifications[index].FILESIZE = res.data.filesize;
						this.personinfo.qualifications[index].FILEPATH = res.data.webUrl;
						this.$set(this.personinfo.qualifications,index,this.personinfo.qualifications[index]);
					}
				})
			},
			deleteRow(index, row, listName){
				var TableName = '';
				if(listName =='tableList'){
					TableName = 'qualifications';
				}else if(listName =='traingList'){
					TableName = 'traings';
				}else{
					TableName = 'ips';
				}
				if(row.id){
					var url = this.basic_url + '/api-user/users/' + TableName +'/' + row.id;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {}).then((res) => {
							if(res.data.resp_code == 0){
								this.personinfo[TableName].splice(index,1);
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
					this.personinfo[TableName].splice(index,1);
				}
			},
		},
		mounted() {
			this.getRole();
			this.getData();
		},
	}
</script>

<style scoped>
@import '../../assets/css/mask-modules.css';

.avatar-uploader {
    border: 1px dashed #d9d9d9;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #02b6a9;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .avatar {
    width: 140px;
    height: 140px;
    display: block;
    margin:0px auto; 
  }
 .avatar i {font-size: 50px; line-height:130px; color: #c0c4cc;}

 .a-upload input{
	position: absolute;
		font-size: 20px \9;
    font-size: 0px;
    opacity: 0;
    filter: alpha(opacity=0);
    width: 100%;
    cursor: pointer;
		height: 160px;
		left: 0px;
		top: 0px;
 }
 .a-upload img{
	/*position: absolute;*/
	border-radius: 12px;
	height: 140px;
    /*top: 10px;*/
 }
 .a-upload span{
	display: block;
	position: relative;
 }
 .tv {
	background-color: rgb(255, 255, 255);
    width: 80px;
    height: 80px;
    float: left;
}
.tv:hover .xiangqing{
	color: #02b6a9;
	transition: all 0.2s ease-out 0s;
}
.tv:hover .icon{
	color: #02b6a9;
	transition: all 0.2s ease-out 0s;
}
.xiangqing {
    margin-top: 8px;
    font-size: 14px;
    font-family: "Microsoft YaHei";
    color:#a8acb9;
    text-align: center;
    margin-bottom: 6px;
}
.icon {
    font-size: 28px;
    width: 28px;
    height: 28px;
    margin: auto;
		margin-top: 22px;
		color:#a8acb9;
}
.el-button:focus, .el-button:hover {
    color: #02b6a9;
    border-color: #02b6a9;
		background-color: #ffffff;
}
.wrapper.activeback {
	border:1px solid black;
	box-shadow:0px -2px 5px 0px rgba(176,192,237,0.5);
}
.wrapper.noneback {
	border:1px solid white;
}
.el-button--text{
	color:#02b6a9;
}
.el-radio__input.is-checked {
    border-color: #02b6a9;
    background: #02b6a9;
}
.ass i:hover{
	color:#02b6a9;
}
</style>

