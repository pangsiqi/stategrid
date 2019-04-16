<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加用户组</div>
					<div class="mask_title" v-show="modifytitle">修改用户组</div>
					<div class="mask_title" v-show="viewtitle">查看用户组</div>
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
					<el-form inline-message :model="dataInfo" :rules="rules" ref="dataInfo" >
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基本信息" name="1">
									<el-row>
										<el-col :span="6">
											<el-form-item label="编号" prop="num" label-width="100px">
												<el-input v-model="dataInfo.num" placeholder="自动生成" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<el-form-item label="所属机构" label-width="100px">
												<el-input v-model="dataInfo.deptName" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="12">
											<el-form-item label="组名" prop="name" label-width="100px">
												<el-input v-model="dataInfo.name" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>

								<el-collapse-item title="用户列表" name="2">
									<div class="table-func" v-if="!viewtitle">
										<el-button type="primary" size="mini" round @click="chooseUser()">
											<i class="icon-search"></i>
											<font>选择</font>
										</el-button>
									</div>
									<el-table :data="dataInfo.userList" border stripe :fit="true" highlight-current-row style="width: 100% ;" max-height="260" :default-sort="{prop:'dataInfo.userList', order: 'descending'}">
										<!-- <el-table-column prop="iconOperation" fixed width="50px">
											<template slot-scope="scope">
												<i class="el-icon-check" v-if="scope.row.isEditing" @click="changeState(scope.row)"></i>
												<i class="el-icon-edit" v-else @click="changeState(scope.row)"></i>
											</template>
										</el-table-column> -->

										<el-table-column label="用户ID" prop="userid" sortable>
											<!-- <template slot-scope="scope">
												<el-form-item :prop="'userList.'+scope.$index + '.userid'" :rules="[{required: true, message: '请选择', trigger: 'blur'}]">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.userid" disabled></el-input>
													<span v-else>{{scope.row.userid}}</span>
												</el-form-item>
											</template> -->
										</el-table-column>

										<el-table-column label="用户姓名" prop="nickname" sortable>
											<!-- <template slot-scope="scope">
												<el-form-item :prop="'userList.'+scope.$index + '.nickname'" :rules="[{required: true, message: '请选择', trigger: 'blur'}]">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.nickname">
														<el-button slot="append" icon="el-icon-search" @click="chooseUser"></el-button>
													</el-input>
													<span v-else>{{scope.row.nickname}}</span>
												</el-form-item>
											</template> -->
										</el-table-column>

										<el-table-column fixed="right" width="120" label="操作">
											<template slot-scope="scope">
												<el-button type="text" size="small" @click="delKey(scope.$index,scope.row)">
													<i class="icon-trash red"></i>
												</el-button>
											</template>
										</el-table-column>
									</el-table>
								</el-collapse-item>

								<el-collapse-item title="其他" name="3" v-show="views">
									<!-- 第一行 -->
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="录入人" prop="createby" label-width="100px">
												<el-input v-model="dataInfo.createName" placeholder="当前录入人" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="createdate" label-width="100px">
												<el-input v-model="dataInfo.createdate" placeholder="当前录入时间" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构" prop="deptidDesc" label-width="100px">
												<el-input v-model="dataInfo.deptidDesc" placeholder="当前录入人机构" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人" prop="updateby" label-width="100px">
												<el-input v-model="dataInfo.updateName" placeholder="当前修改人" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="updatedate" label-width="100px">
												<el-input v-model="dataInfo.updatedate" placeholder="当前修改时间" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>

							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="save('Update')">保存</el-button>
							<el-button type="success" @click="save('Submit')" v-show="addtitle">保存并继续</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
				<!--底部-->
			</div>
		</div>
		<vchoose ref="choose" :chooseParam = "chooseParam" @tranFormData = 'getChoose'></vchoose>
		<usermask ref="usermask" @getSelData="getUserData" :dialogTit="dialogTit"></usermask>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import vchoose from '../common/dataChoose.vue'
	import usermask from'../common/common_mask/currentUserMask.vue'
	export default {
		name: 'masks',
		// props: ['detailData'],
		components: {
			vchoose,
			usermask
		},
		data() {
			return {
				basic_url: Config.dev_url,
				dialogTit: '用户列表',
				rules: {
					//组名
					name: [
						{ required: true, message: '请输入', trigger: 'blur' },
						{validator: this.Validators.isSpecificKey, trigger: 'blur'},
					],
					nickname: [
						{ required: true, message: '请选择', trigger: 'blur' },
					]
				},
				show: false,
				isok1: true,
				isok2: false,
				edit: true, //禁填
				noedit:false,//可编辑
				views:false,//录入修改人信息
				noviews:true,//按钮
				down: true,
				up: false,
				activeNames: ['1', '2','3','4'], //手风琴数量
				dialogVisible: false, //对话框
				addtitle: true, //添加弹出框titile
				modifytitle: false, //修改弹出框titile
				modify:false,
				selectData: [], 
				getCheckboxData: {},
				dataInfo: {
					"id":'',
					"name":'',
					"num":'',
					"deptid":this.$store.state.currentcjdw[0].id,
					"deptName":this.$store.state.currentcjdw[0].fullname,
					"createby":'',
					"createdate":'',
					"updateby":'',
					"updatedate":'',
					"del_flag":0,
					'userList': []
				},
				chooseParam: {},
				editUserIndex: 1
			};
		},
		methods: {
			//选择多条用户数据插入到行列表中
			getUserData(val){
				for(var i=0;i<val.length;i++){
					var userList={
						id: '',
						userid:val[i].id,
						nickname:val[i].nickname,
						isEditing: true,
					};
					this.dataInfo.userList.push(userList);
				}
				
				// this.dataInfo.userList[this.editUserIndex].userid = val.id;
				// this.dataInfo.userList[this.editUserIndex].nickname = val.nickname;
			},
			//选择用户带回来值
			chooseUser(){
				this.$refs.usermask.requestData('groups');
			},
			//获取用户
			getChoose(data){
				var selData = data.data;
				this.dataInfo.id = selData[0].id;
				this.dataInfo.categoryname = selData[0].categoryname;
				this.getData(this.dataInfo.id);
			},
			//删除用户
			delKey(index,row){
				if(row.id!=''){
					var url = this.basic_url + '/api-user/groups/delGroupUserById?id=' + row.id;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
					this.$axios.delete(url, {}).then((res) => {
						if(res.data.resp_code == 0){
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.dataInfo.userList.splice(index,1);
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
					this.dataInfo.userList.splice(index,1);
				}
			},
			//判断当前行是否可编辑
			changeState(data){
				data.isEditing = !data.isEditing;
			},

			//新建按钮用户组行弹出框
			// addKWord(){
			// 	this.dataInfo.userList.push({
			// 		'userid': '',
			// 		'groupid': this.dataInfo.id,
			// 		'isEditing': true,
			// 		'id': ''
			// 	});
			// 	this.editUserIndex = this.dataInfo.userList.length-1;
			// },
			
			//获取当前用户信息
			getUser(opt){
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url,{}).then((res) => {
					if(opt == 'new'){
						this.dataInfo.createby = res.data.id;
						this.dataInfo.createdate =this.getToday();
					}else{
						this.dataInfo.updateby = res.data.id;
						this.dataInfo.updatedate = this.getToday();
					}
				}).catch((err) => {
				});
			},

			//获取当前时间
			getToday(){
				var date = new Date();
				var month = date.getMonth();
				month++;
				var str = date.getFullYear() + '-' + month + '-'+ date.getDate() + ' ' +  date.getHours() + ':' + date.getMinutes()+ ':' + date.getSeconds() ;
				return str;
			},
			//添加显示弹窗
			visible() {
				this.addtitle = true;
				this.modifytitle = false;
				this.viewtitle = false;
				this.noedit = false;//表单内容
				this.views = false;//录入修改人信息
				this.noviews = true;//按钮
				
				// this.show = true;
				this.getUser('new');
			},
			//这里是修改
			detail(val) {
				this.addtitle = false;
				this.modifytitle = true;
				this.viewtitle = false;
				this.noedit = false;//表单内容
				this.views = false;//录入修改人信息
				this.noviews = true;//按钮

				this.detailData = val;
				var id = this.detailData.id;
				this.getData(id);
				this.show = true;
				this.getUser('');
			},
			//这是查看
			view(val) {
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.dept = true;
				this.noedit = true;//表单内容
				this.views = true;//录入修改人信息
				this.noviews = false;//按钮

				this.detailData = val;
				var id = this.detailData.id;
				this.getData(id);
				this.show = true;
				this.getUser('');
			},
			//点击关闭按钮
			close() {
				this.resetForm();
				this.$emit('request');
			},
			resetForm(){
				this.dataInfo = {
					"id":'',
					"name":'',
					"num":'',
					"deptid":this.$store.state.currentcjdw[0].id,
					"deptName":this.$store.state.currentcjdw[0].fullname,
					"createby":'',
					"createdate":'',
					"updateby":'',
					"updatedate":'',
					"del_flag":'',
					"userList": []
				};
				// this.show = false;
			},
			//获取当前组信息
			getData(id){
				var url = this.basic_url + '/api-user/groups/' + id;
				this.$axios.get(url, {
				}).then((res) => {
					this.dataInfo = res.data;
				}).catch((wrong) => {})
			},
			open(){
				this.show = true;
			},
			toggle(e) { //大弹出框大小切换
				if(this.isok1) {
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

			rebackDialog() { //大弹出框还原成默认大小
				this.isok1 = true;
				this.isok2 = false;
				$(".mask_div").css("width", "80%");
				$(".mask_div").css("height", "90%");
				$(".mask_div").css("top", "0px");
			},
			//提交保存
			save(parameter) {
				var _this = this;
				var url = this.basic_url + '/api-user/groups/saveOrUpdate';
				this.$refs.dataInfo.validate((valid) => {
					if (valid) {
						this.$axios.post(url, this.dataInfo).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
								if(parameter=="Update"){
									this.show = false;
									this.$emit('request');
								}else{
									this.show=true;
									this.resetForm();
								}
								// this.visible();
								// this.resetForm();
							}else{
								this.show = true;
								this.$message({
									message: res.data.resp_msg,
									type: 'error',
								});
							}
						}).catch((err) => {
						});
					} else {
						return false;
					}
				});
			},
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>