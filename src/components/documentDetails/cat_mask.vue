<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="!modify">添加关键字类别/关键字</div>
					<div class="mask_title" v-show="modify">修改关键字类别/关键字</div>
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
					<el-form inline-message :model="dataInfo"  ref="dataInfo" label-width="100px">
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基本信息" name="1">
									<el-row :gutter="5" class="pt10">
										<el-col :span="6">
											<el-form-item label="类别名称" prop="dataInfo.categoryname">
												<el-input v-model="dataInfo.categoryname">
													<el-button slot="append" icon="el-icon-search" @click="chooseCat"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								
								<el-collapse-item title="关键字列表" name="2" class="ml30">
									<div class="table-func">
										<el-button type="success" size="mini" round @click="addKWord">
											<i class="icon-add"></i>
											<font>新建行</font>
										</el-button>
									</div>

									<el-table :data="dataInfo.tb_keyword2List" border stripe :fit="true" highlight-current-row="highlight-current-row" style="width: 100% ;">
										<el-table-column prop="iconOperation" fixed width="50px">
											<template slot-scope="scope">
												<i class="el-icon-check" v-if="scope.row.isEditing" @click="changeState(scope.row)">
												</i>
												<i class="el-icon-edit" v-if="!scope.row.isEditing" @click="changeState(scope.row)">
												</i>
											</template>
										</el-table-column>
										<el-table-column label="名称" sortable prop="keywordname">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.keywordname"></el-input>
												<span v-if="!scope.row.isEditing">{{scope.row.keywordname}}</span>
											</template>
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
		</div>
		<vchoose ref="choose" :chooseParam = "chooseParam" @tranFormData = 'getChoose'></vchoose>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import vchoose from '../common/dataChoose.vue'
	export default {
		name: 'masks',
		props: ['detailData'],
		components: {
			vchoose,
		},
		data() {
			return {
				rules: {
					// categoryname: [
					// 	{ required: true, message: '请输入分类名称', trigger: 'blur' },
					// ]
				},

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
					'id': '',	
                    'categoryname': '',
					'userid': 0,	
					'username': '',
                    'createtime': '',	
                    'deptid': 0,
					'deptfullname': '',
					'tb_keyword2List': [],
				},
				chooseParam: {}
			};
		},
		methods: {
			chooseCat(){
				this.chooseParam = {
					title: "关键字类别列表",
					listName: 'keywordCat',
					selMax: 1,
					tableHeader: [
						{
							propName: 'categoryname',
							labelName: '关键字类别'
						},
						{
							propName: 'createtime',
							labelName: '录入时间'
						}

					],
					search: [],
					url: '/api-apps/app/tbCategory2'
				};
				this.$refs.choose.getData('new',this.chooseParam);
			},
			getChoose(data){
				var selData = data.data;
				this.dataInfo.id = selData[0].id;
				this.dataInfo.categoryname = selData[0].categoryname;
				this.getData(this.dataInfo.id);
			},
			delKey(index,row){
				if(row.id!=''){
					var url = this.basic_url + '/api-apps/app/tbCategory2/tb_keyword2/' + row.id;
					this.$axios.delete(url, {}).then((res) => {
						if(res.data.resp_code == 0){
							this.dataInfo.tb_keyword2List.splice(index,1);
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'error'
							});
						}
					}).catch((err) => {
					});
				}else{
					this.dataInfo.tb_keyword2List.splice(index,1);
				}
			},
			changeState(data){
				data.isEditing = !data.isEditing;
			},
			addKWord(){
				this.dataInfo.tb_keyword2List.push({
					'keywordname': '',
					'createtime': this.dataInfo.createtime,
					'deptid': this.dataInfo.deptid,
					'deptfullname': this.dataInfo.deptfullname,
					'id': '',
					'userid': this.dataInfo.userid,	
					'username': this.dataInfo.username,
					'isEditing': true,
					'categoryid': this.dataInfo.id
				});
			},
			getUser(opt){
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url,{}).then((res) => {
					if(opt == 'new'){
						this.dataInfo.userid = res.data.id;
						this.dataInfo.username = res.data.username;
						this.dataInfo.createtime =this.getToday();
						this.dataInfo.deptid = res.data.deptId;
						this.dataInfo.deptfullname = res.data.deptName;
					}else{
						this.dataInfo.userid = res.data.id;
						this.dataInfo.username = res.data.username;
						this.dataInfo.deptid = res.data.deptId;
						this.dataInfo.deptfullname = res.data.deptName;
					}
				}).catch((err) => {
				});
			},
			getToday(){
				var date = new Date();
				var month = date.getMonth();
				month++;
				var str = date.getFullYear() + '-' + month + '-'+ date.getDate() + ' ' +  date.getHours() + ':' + date.getMinutes()+ ':' + date.getSeconds() ;
				return str;
			},
			//添加显示弹窗
			visible() {
				this.modify=false;
				this.show = true;
				this.getUser('new');
			},
			// 这里是修改
			detail() {
				this.dataInfo = this.detailData;
				var id = this.detailData.categoryid;
				this.getData(id);
				this.modify = true;
				this.show = true;
				this.getUser();
			},
			getData(id){
				var url = this.basic_url + '/api-apps/app/tbCategory2/' + id;
				this.$axios.get(url, {
				}).then((res) => {
					this.dataInfo = res.data;
				}).catch((wrong) => {})
			},
			//点击关闭按钮
			close() {
				this.resetForm();
				this.$emit('request');
			},
			resetForm(){
				this.dataInfo = {
					'id': '',	
                    'categoryname': '',
					'userid': '',	
					'username': '',
                    'createtime': '',	
                    'deptid': '',
					'deptfullname': '',
					'tb_keyword2List': [],
				};
				// //this.$refs['dataInfo'].resetFields();
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
				var url = this.basic_url + '/api-apps/app/tbCategory2/saveOrUpdate';
				this.$refs['dataInfo'].validate((valid) => {
					if (valid) {
						if(!this.modify){
							this.dataInfo.createtime = this.getToday();
						}
						this.$axios.post(url, _this.dataInfo).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
								this.resetForm();
								this.$emit('request');
							}else{
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