<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="!modify">添加关键字授权</div>
					<div class="mask_title" v-show="modify">修改关键字授权</div>
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
						<div class="content-accordion">
							<!-- 关键字授权信息 -->
							<el-collapse v-model="activeNames">
								<el-collapse-item title="关键字授权信息" name="1">
									<el-row :gutter="20" class="pb10">
										<el-col :span="5" class="pull-right"></el-col>
									</el-row>
									<el-form-item v-for="item in basicInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}">
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input'" disabled></el-input>
										<el-input v-model="dataInfo[item.prop]" :disabled="true" v-if="item.label=='姓名'">
											<el-button slot="append" icon="el-icon-search" @click="addUser"></el-button>
										</el-input>
									</el-form-item>
								</el-collapse-item>
								<el-collapse-item title="关键字授权列表" name="2" class="ml30">
									<div class="table-func">
										<el-button type="success" size="mini" round @click="addKeyW">
											<i class="icon-add"></i>
											<font>新建行</font>
										</el-button>
									</div>
										<div style="position: absolute; z-index: 99; right: 260px; top: 60px;">
											<el-checkbox-group v-model="checkAuth" @change="handleAuth" v-show="selKeyW.length>0">
												<el-checkbox v-for="item in authOptions" :label="item" :key="item"></el-checkbox>
											</el-checkbox-group>
										</div>
									<el-table :data="selKeyW" border stripe :fit="true" highlight-current-row="highlight-current-row" style="width: 100% ;">
										<el-table-column label="类别名称" sortable prop="categoryidDesc">
											<template slot-scope="scope">
												<span>{{scope.row.categoryidDesc}}</span>
											</template>
										</el-table-column>
										<el-table-column label="关键字" sortable prop="keywordidDesc">
											<template slot-scope="scope">
												<span>{{scope.row.keywordidDesc}}</span>
											</template>
										</el-table-column>

										<el-table-column fixed="right" label="授权" width="600px">
											<template slot-scope="scope">
												<el-checkbox-group v-model="scope.row.checkedList">
													<el-checkbox label="显示"></el-checkbox>
													<el-checkbox label="编辑"></el-checkbox>
													<el-checkbox label="删除"></el-checkbox>
													<el-checkbox label="打印"></el-checkbox>
													<el-checkbox label="下载"></el-checkbox>
													<el-checkbox label="复制"></el-checkbox>
												</el-checkbox-group>
											</template>
										</el-table-column>
										<el-table-column fixed="right" width="150px" label="操作">
											<template slot-scope="scope">
												<el-button @click="del(scope.row,scope.$index)" type="text">删除</el-button>
											</template>
										</el-table-column>
									</el-table>
								</el-collapse-item>
							</el-collapse>
						</div>

						<div class="content-footer">
							<el-button type="primary" @click='submitForm'>保存</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
				<!--底部-->
			</div>
			<vchoose ref="choose" :chooseParam = "chooseParam" @tranFormData = 'getChoose'></vchoose>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import vchoose from '../common/dataChoose.vue'
	export default {
		name: 'masks',
		components: {
			vchoose,
		},
		props: ['detailData'],
		data() {
			return {
				authOptions: ['显示','编辑','删除','打印','下载','复制'],
				checkAuth: [],
				selBefore: [],

				chooseParam: {
					visible: false,
					title: "用户列表",
					listName: 'user',
					selMax: 1,
					tableHeader: [
						{
							propName: 'username',
							labelName: '用户姓名'
						},
						{
							propName: 'deptName',
							labelName: '组织机构'
						}

					],
					// search: [
					// 	{
					// 		name: 'deptId',
					// 		val: ''
					// 	}
					// ],
					url: '/api-user/users'
				},
				rules: {
					userid: [
						{ required: true, message: '请选择用户', trigger: 'blur' },
					],
					authority: [
						{ required: true, message: '请选择授权类型', trigger: 'blur' },
					]
				},
				basicInfo: [
					{
						label: '姓名',
						prop: 'username',
						width: '50%',
						type: 'select',
						displayType: 'inline-block'
					},
					{
						label: '机构名称',
						prop: 'deptName',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
					// ,
					// {
					// 	label: '授权',
					// 	prop: 'authority',
					// 	width: '100%',
					// 	type: 'checkbox',
					// 	displayType: 'inline-block'
					// }
				],
				authorities: [
					{
						label: '显示',
						val: 'fileread'
					},{
						label: '编辑',
						val: 'fileedit'
					},{
						label: '删除',
						val: 'filedelete'
					},{
						label: '打印',
						val: 'fileprint'
					},{
						label: '下载',
						val: 'filedownload'
					},{
						label: '复制',
						val: 'fileduplicate'
					},
					// {
					// 	label: '上传',
					// 	val: 'fileupload'
					// }
				],

				basic_url: Config.dev_url,

				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				activeNames: ['1', '2','3','4'], //手风琴数量
				dialogVisible: false, //对话框
				modify: false,
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				selectData: [], 
				getCheckboxData: {},

				dataInfo: {
					'id': '',  //主键ID，必填但页面没有字段
					'authority': [],
					'keywordid': '',
					'userid': '',
					'deptName': '',
					'username': ''
				},
				pmRecordList: [],

				usernames: [],
				// keywords: [],
				selKeyW: [],
				deptid: '',
			};
		},
		methods: {
			handleAuth(value){
				var _this = this;
				var increaseFlag = false;
				var selKeyW = this.selKeyW;
				var selKeys = [];
				var selKey = '';
				
				if(this.selBefore.length > value.length){
					increaseFlag = false;
					selKeys = this.selBefore.filter(function(item){
						if(value.indexOf(item) == -1){
							return item;
						};
					});
				}else{
					increaseFlag = true;
					selKeys = value.filter(function(item){
						if(_this.selBefore.indexOf(item) == -1){
							return item;
						};
					});
				}

				selKey = selKeys[0];
				for(var i=0; i<selKeyW.length; i++){
					if(selKeyW[i].checkedList.indexOf(selKey)==-1 && increaseFlag){
						selKeyW[i].checkedList.push(selKey);
					};
					if(selKeyW[i].checkedList.indexOf(selKey) && !increaseFlag){
						selKeyW[i].checkedList.splice(selKeyW[i].checkedList.indexOf(selKey),1);
					}
				}
				this.selBefore = value;
			},
			del(row,index){
				if(!row.id){
					this.selKeyW.splice(index,1);
				}else{
					var url = this.basic_url + '/api-apps/app/tbKeywordPrivilege2/deletes';
					var data = {
						ids: row.id,
					}
					this.$axios.delete(url, {params: data}).then((res) => {//.delete 传数据方法
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.selKeyW.splice(index,1);
						}else{
							this.$message({
								message: res.data.code_msg,
								type: 'success'
							});
						}
					}).catch((err) => {
					});
				}
			},
			getChoose(data){
				var selData = data.data;
				var opt = data.listName;
				this.detail('getChoose',selData,opt);
			},
			addKeyW(){
				this.chooseParam = {
					title: "关键字列表",
					listName: 'keywordList',
					selMax: 1000,
					tableHeader: [
						{
							propName: 'categoryidDesc',
							labelName: '类别'
						},
						{
							propName: 'keywordname',
							labelName: '关键字'
						}
					],
					search: [],
					url: '/api-apps/app/tbKeyword2'
				};
				this.$refs.choose.getData('new',this.chooseParam);
			},
			addUser(){
				this.chooseParam = {
					title: "用户列表",
					listName: 'user',
					selMax: 1,
					tableHeader: [
						{
							propName: 'username',
							labelName: '用户姓名'
						},
						{
							propName: 'deptName',
							labelName: '组织机构'
						}

					],
					search: [
						{
							name: 'deptId',
							val: ''
						}
					],
					url: '/api-user/users'
				};
				this.chooseParam.search[0].val = this.deptid;
				this.$refs.choose.getData('new',this.chooseParam);
			},
			getUser(){
				this.$axios.get(this.basic_url +'/api-user/users/currentMap', {}).then((res) => {
					this.deptid = res.data.deptId;
					this.dataInfo.deptName = res.data.deptName;
				}).catch((err) => {
				});
			},
			visible() {
				this.modify=false;
				this.show = true;
			},
			detail(opt,paramdata,listName) {
				if(opt == 'getChoose' && listName == 'keywordList'){
					var selKeyW = paramdata;
					var labelAuth = this.authorities;
					for(let i=0; i<selKeyW.length; i++){
						selKeyW[i].checkedList = [];
						selKeyW[i].keywordidDesc = selKeyW[i].keywordname;
						selKeyW[i].keywordid = selKeyW[i].id;
						selKeyW[i].id = '';
						for(let n=0; n<labelAuth.length; n++){
							var item = labelAuth[n].val;
							if(item == 'fileread'){
								selKeyW[i][item] == 1;
								selKeyW[i].checkedList.push(labelAuth[n].label);
							}
						}
						this.selKeyW.push(selKeyW[i]);
					}
					return;
				}else if(opt == 'getChoose' && listName == 'user'){
					var tmpData = paramdata[0];
					this.dataInfo.userid = tmpData.id;
					this.dataInfo.username = tmpData.username;
				}else{
					var detailData = this.detailData;
					this.dataInfo.userid = detailData.userid;
					this.dataInfo.username = detailData.username;
				}
				this.getUser();
				var data = {
					page: 1,
					limit: 10,
					userid: this.dataInfo.userid
				};
				var url = this.basic_url + '/api-apps/app/tbKeywordPrivilege2';
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					var selKeyW = res.data.data;
					var labelAuth = this.authorities;
					for(let i=0; i<selKeyW.length; i++){
						selKeyW[i].checkedList = [];
						for(let n=0; n<labelAuth.length; n++){
							var item = labelAuth[n].val;
							if(selKeyW[i][item] == 1){
								selKeyW[i].checkedList.push(labelAuth[n].label);
							}
						}
					}
					this.selKeyW = selKeyW;
					
					this.modify = true;
					this.show = true;
				}).catch((wrong) => {});
			},
			//点击关闭按钮
			close() {
				this.resetForm();
				this.$emit('request');
			},
			resetForm(){
				this.dataInfo =  {
					'id': '',  //主键ID，必填但页面没有字段
					'authority': [],
					'keywordid': '',
					'userid': ''
				};
				this.selKeyW = [];
				//this.$refs['dataInfo'].resetFields();
				this.show = false;
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

			submitForm() {
				var _this = this;
				var url = this.basic_url + '/api-apps/app/tbKeywordPrivilege2/batchSaveOrUpdate';
				this.$refs['dataInfo'].validate((valid) => {
					if(this.selKeyW.length == 0){
						this.resetForm();
						this.$emit('request');
						return;
					}

					if (valid) {
						var param = {
							datas: []
						};
						var selData = this.selKeyW;
						for(let i=0; i<selData.length; i++){
							var submitData = {
								'id': selData[i].id,  //主键ID，必填但页面没有字段
								'userid': this.dataInfo.userid,
								'username': this.dataInfo.username,
								'keywordid': selData[i].keywordid,
								'keywordidDesc': selData[i].keywordidDesc,
								'categoryidDesc': selData[i].categoryidDesc,
								'categoryid': selData[i].categoryid,
								
								'fileread': 0,
								'fileedit': 0,
								'fileprint': 0,
								'fileupload': 0,
								'filedownload': 0,
								'fileduplicate': 0,
								'filedelete': 0,
							};
							var authorities =  selData[i].checkedList;
							var labelAuth = this.authorities;
							for(let j in authorities){
								for(var n=0; n<labelAuth.length; n++){
									if(labelAuth[n].label == authorities[j]){
										var item =  labelAuth[n].val;
										submitData[item] = 1;
									}
								}
							}
							param.datas.push(submitData);
						}
						this.$axios.post(url, param).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
								this.resetForm();
								this.$emit('request');
							}
						}).catch((err) => {
						});
					} else {
						var middleWidth=5;
						return false;
					}
				});
			},
			// getKeyWords(){
			// 	var data = {
			// 		page: 1,
			// 		limit: 1000
			// 	}
			// 	var url = this.basic_url + '/api-apps/app/tbKeyword2';
			// 	this.$axios.get(url, {
			// 		params: data
			// 	}).then((res) => {
			// 		this.keywords = res.data.data;
			// 	}).catch((wrong) => {})
			// }
		},
		mounted() {
			this.getUser();
			// this.getKeyWords();
		},

	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>