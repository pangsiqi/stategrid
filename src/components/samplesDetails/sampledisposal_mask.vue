<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加样品处置</div>
					<div class="mask_title" v-show="modifytitle">修改样品处置</div>
					<div class="mask_title" v-show="viewtitle">查看样品处置</div>
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
					<el-form inline-message :model="samplesForm" :label-position="labelPosition" :rules="rules" ref="samplesForm" label-width="110px" status-icon>
						<div class="accordion">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基础信息" name="1">
									<el-row :gutter="20" class="pb10">
										<el-col :span="4" class="pull-right">
											<el-input v-model="samplesForm.STATEDesc" :disabled="edit">
												<template slot="prepend">状态</template>
											</el-input>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="8">
											<el-form-item label="样品编号" prop="ITEMNUM">
												<el-input v-model="samplesForm.ITEMNUM" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getsample" :disabled="noedit"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="处理批准人" prop="APPR_PERSONDesc">
												<el-input v-model="samplesForm.APPR_PERSONDesc" disabled>
													<el-button slot="append" icon="el-icon-search" @click="getPerson" :disabled="noedit"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="批准日期" prop="APPR_DATE">
												<el-date-picker v-model="samplesForm.APPR_DATE" type="date" placeholder="请选择批准日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="noedit">
												</el-date-picker>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="处理人" prop="DO_PERSONDesc">
												<el-input v-model="samplesForm.DO_PERSONDesc" disabled></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="处理日期" prop="DO_DATE">
												<el-date-picker v-model="samplesForm.DO_DATE" type="date" placeholder="请选择处理日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="noedit">
												</el-date-picker>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="24">
											<el-form-item label="备注" prop="MEMO">
												<el-input type="textarea" rows="3" v-model="samplesForm.MEMO" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="样品" name="2">
									<el-table :data="samplenumList" 
											  :header-cell-style="rowClass" 
											  border 
											  stripe 
											  height="400px" 
											  style="width: 100%;"
											  @selection-change="selDataChange" v-loadmore="loadMore">
										<el-table-column type="selection" width="55" fixed align="center">
										</el-table-column>
										<el-table-column label="样品编号" sortable prop="ITEMNUM">
										</el-table-column>
										<el-table-column label="样品序号" sortable prop="ITEM_STEP">
											<template slot-scope="scope">
												<span v-text="scope.row.ITEM_TYPE=='1'?'':scope.row.ITEM_STEP"></span>
											</template>
										</el-table-column>
										<el-table-column label="样品名称" sortable prop="DESCRIPTION">
										</el-table-column>
										<el-table-column label="数量" sortable prop="NUM">
											<template slot-scope="scope">
												<span v-text="!!scope.row.NUM?scope.row.NUM:1"></span>
											</template>
										</el-table-column>
										<el-table-column label="委托书编号" sortable prop="PROXYNUM">
										</el-table-column>
										<el-table-column label="样品承接人" sortable prop="DO_PERSONDesc">
										</el-table-column>
									</el-table>
								</el-collapse-item>

								<el-collapse-item title="其他" name="3" v-show="viewtitle">
									<el-row >
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc">
												<el-input v-model="samplesForm.ENTERBYDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE">
												<el-input v-model="samplesForm.ENTERDATE" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构" prop="DEPTIDDesc">
												<el-input v-model="samplesForm.DEPTIDDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="修改人">
												<el-input v-model="samplesForm.CHANGEBYDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间">
												<el-input v-model="samplesForm.CHANGEDATE" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>

									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="saveAndUpdate">保存</el-button>
							<el-button type="success" @click="saveAndSubmit" v-show="addtitle">保存并继续</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
		</div>
		<el-dialog :modal-append-to-body="false" title="样品编号" height="300px" :visible.sync="dialogsample" width="80%" :before-close="handleClose">
			<el-table :data="samplesList" 
						:header-cell-style="rowClass" 
						border 
						stripe 
						height="400px" 
						style="width: 100%;" 
						@selection-change="selChangeNum" 
						v-loadmore="loadMore">
				<el-table-column type="selection" width="55" fixed align="center">
				</el-table-column>
				<el-table-column label="样品编号" sortable  prop="ITEMNUM">
				</el-table-column>
				<el-table-column label="样品名称" sortable  prop="DESCRIPTION">
				</el-table-column>
				<el-table-column label="型号"  prop="MODEL" sortable>
				</el-table-column>
				<el-table-column label="样品状态" sortable prop="STATEDesc">
				</el-table-column>
			</el-table>
			<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40,100]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
			</el-pagination>
			<span slot="footer" class="dialog-footer">
				<el-button @click="resetSample">取 消</el-button>
				<el-button type="primary" @click="addsamplebtn">确 定</el-button>
			</span>
		</el-dialog>
		<usermask :tit="userMakeTit" @getSelData="getUserData" ref="usermask" ></usermask>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import usermask from'../common/common_mask/currentUserMask.vue'
	export default {
		name: 'sampledisposal_mask',
		props: {
			samplesForm: { //接收主表单中填写的数据信息
				type: Object,
				default: function() {
					return {
						ITEMNUM: '',//样品子表ID
						ITEM_STEP: '',//样品序号
						QUALITY: '',//数量
						ACCEPT_DATE: '',//收回入库时间
						ACCEPT_PERSON: '',//样品承接人
						APPR_PERSON: '',//处理批准人
						APPR_DATE: '',//批准日期
						DO_PERSON: '',//处理人
						DO_DATE: '',//处理日期
						MEMO: '',//备注
						STATE: '',//状态
						// STATUSDATE: '',//状态日期
						STATUS: '',//信息状态
						ENTERBY: '',//录入人
						ENTERDATE: '',//录入时间
						CHANGEBY: '',//修改人
						CHANGEDATE: '',//修改时间
					}
				}
			}
		},
		components: {
			'usermask': usermask
		},
		data() {
			var validateItemid = (rule, value, callback) => {//样品编号
                if (this.samplesForm.ITEMNUM === undefined || this.samplesForm.ITEMNUM === '' || this.samplesForm.ITEMNUM === null) {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
			return {
				userMakeTit: '处理批准人',
				maxNum: 1,
				sampleType: '',
				loadSign: true, //加载
				commentArr: {},
				falg:false,//保存验证需要的
				basic_url: Config.dev_url,
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				selectData: [], //获取检验/检测方法类别
				modify:false,//修订、修改人、修改时间
				selMenu:[],
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				dialogVisible: false, //对话框
				edit: true, //禁填
				activeNames: ['1'], //手风琴数量
				labelPosition: 'right', //表单标题在上方
				addtitle: true,
				modifytitle: false,
				viewtitle:false,
				noviews: true, //保存的按钮
				views: false,
				samples_itemlineForm:{//样品子表数据组
					inspectionList: []
				},
				//Tree树菜单数据
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "children",
					label: "fullname"
				},
				getCheckboxData: {},
				isEditing: '',
				commentArr:{},//下拉加载
				rules: { //定义需要校验数据的名称
					// ITEMNUM: [//样品编号
					// 	{ required: false,validator: validateItemid}
					// ],
					ACCEPT_PERSON: [
						{ required: true, message: '请填写样品承接人', trigger: 'blur' }
					],
					ACCEPT_DATE: [
						{ required: true, message: '批准日期不能为空', trigger: 'blur' }
					],
					APPR_PERSON: [
						{ required: true, message: '请填写处理批准人', trigger: 'blur' }
					],
					APPR_DATE: [
						{ required: true, message: '请选择类别', trigger: 'change' }
					],
					QUALITY: [
						{ required: true, message: '请填写数量', trigger: 'blur' }
					],
					DO_PERSON: [
						{ required: true, message: '处理人不能为空', trigger: 'blur' }
					],
					DO_DATE: [
						{ required: true, message: '处理日期不能为空', trigger: 'blur' }
					],
					// STATUSDATE: [
					// 	{ required: true, message: '状态日期不能为空', trigger: 'blur' }
					// ]
				},
				dialogsample:false,
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				samplesList:[],
				selData: [],
				dialogsamplenum:false,//样品序号
				samplenumList:[],//样品序号
			};
		},
		methods: {
			selDataChange(val){
				this.selData = val;
			},
			getUserData(data){
				this.$forceUpdate();
				this.samplesForm.APPR_PERSON = data.id;
				this.samplesForm.APPR_PERSONDesc = data.username;
			},
			getPerson(){
				this.$refs.usermask.requestData(this.samplesForm.deptId);
			},
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			sizeChange(val) {
				this.page.pageSize = val;
				this.requestData();
			},
			currentChange(val) {
				this.page.currentPage = val;
				this.requestData();
			},
			//样品编号
			getsample(){
				this.requestData();
				this.dialogsample = true;
			},
			getSamlpeList(){
				var itemList = [];
				for(var i=0; i<this.selUser.length; i++){
					itemList.push(this.selUser[i].ITEMNUM);
				}
				var url = this.basic_url + '/api-apps/appCustom/getDispositonByItemNum/' + itemList.join(',');
				this.$axios.get(url, {
				}).then((res) => {
					this.samplenumList = res.data;
				});
			},
			addsamplebtn(){
				if(this.selUser.length == 0){
					this.$message({
						message:'请选择数据',
						type:'warning'
					})
				}else{
					this.samplenumList = [];
					this.getSamlpeList();
					this.resetSample();
				}
			},
			resetSample(){
				this.dialogsample = false;
				this.selUser = [];
				this.samplesList = [];
			},
			reset(){
				this.samplenumList = [];
				this.selData = [];
			},
			selChangeNum(val) {
				this.selUser = val;
			},
			//样品序号
			// addsamplenum(){
			// 	this.dialogsamplenum = true;
			// 	this.$axios.get(this.basic_url + '/api-apps/app/itemline?ITEMNUM_wheres='+this.samplesForm.ITEMNUM, {

			// 	}).then((res) => {
			// 		this.samplenumList = res.data.data;
			// 	}).catch((wrong) => {})
			// },
			// addsamplenumbtn(){
			// 	if(this.selUser.length == 0){
			// 		this.$message({
			// 			message:'请选择数据',
			// 			type:'warning'
			// 		})
			// 	}else{
			// 		var num = [];
			// 		var nums = '';
			// 		for(var i = 0;i<this.selUser.length;i++){
			// 			num.push(this.selUser[i].ITEM_STEP);
			// 		}
			// 		nums = num.toString(',');
			// 		this.samplesForm.ITEM_STEP = nums;
			// 		this.dialogsamplenum = false;
			// 	}
			// },
			//获取委托书编号数据
			getProxy() {
				this.editSearch = 'dept';
				var page = this.page.currentPage;
				var limit = this.page.pageSize;
				var type = "2";
				var url = this.basic_url + '/api-user/depts/treeByType';
				this.$axios.get(url, {
					params: {
						type: type
					},
				}).then((res) => {
					this.resourceData = res.data;
					this.dialogVisible = true;
				});
			},
			//选择委托书编号节点
			handleCheckChange(data, checked, indeterminate) {
				this.getCheckboxData = data;
			},
			dailogconfirm() { //委托书编号小弹出框确认按钮事件
				this.getCheckedNodes();
				this.placetext = false;
				this.dialogVisible = false;
				if(this.editSearch == 'company') {
					this.samplesForm.ITEMNUM = this.getCheckboxData.id;
					this.samplesForm.MEMO = this.getCheckboxData.fullname;
				} else {
					this.samplesForm.ITEMNUM = this.getCheckboxData.id;
					this.samplesForm.MEMO = this.getCheckboxData.fullname;
				}
			},
			//小弹出框关闭按钮事件
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
			getCheckedNodes() { //小弹出框获取树菜单节点
				this.checkedNodes = this.$refs.tree.getCheckedNodes()
			},
			childMethods() {//添加内容时从父组件带过来的
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.samplesForm.DEPTID = res.data.deptId;
					this.samplesForm.ENTERBY = res.data.id;
					this.samplesForm.DO_PERSON = res.data.id;
					this.samplesForm.DO_PERSONDesc = res.data.nickname;
					var date=new Date();
					this.samplesForm.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					this.samplesForm.APPR_DATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					this.samplesForm.ACCEPT_DATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					this.samplesForm.DO_DATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err)=>{
				})
				this.addtitle = true;
            	this.modifytitle = false;
				this.modify=false;
				this.noviews = true;
            	this.show = true;
            	this.edit = true;
				this.noedit = false;
			},
			detail() { //修改内容时从父组件带过来的
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.samplesForm.CHANGEBY = res.data.id;
					var date=new Date();
					this.samplesForm.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err)=>{
				})
				this.viewtitle = false;
				this.addtitle = false;
				this.modifytitle = true;
				this.modify = true;
				this.noviews = true;
				this.show = true;
				this.edit = true;
				this.noedit = false;
			},
			//这是查看
			view() {
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.views = true; //
				this.noviews = false;
				this.edit = true;
				this.noedit = true;
				this.show = true;
			},
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},

			//检验/检测方法类别
			getType() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=type';
				this.$axios.get(url, {}).then((res) => {
					this.selectData = res.data;
				}).catch(error => {
					console.log('请求失败');
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
			//点击提交按钮执行保存
			save(opt) {
				this.$refs['samplesForm'].validate((valid) => {
					if (valid) {
						if(this.selData.length==0){
							this.$message({
								message: '请选择处置样品',
								type: 'warning'
							});
							return;
						}
						var url = this.basic_url + '/api-apps/appCustom/saveDisposition';
						this.samplesForm.child = this.selData;
						this.$axios.post(url, this.samplesForm).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								if(opt == 'save'){
									this.show = false;
									this.$emit('request');
								}
								this.$emit('reset');
								this.$refs['samplesForm'].resetFields();
							}
						}).catch((err) => {
						});
						this.falg = true;
					} else {
						this.show = true;
						this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
						this.falg = false;
					}
				});
			},
			//保存
			saveAndUpdate(){
				this.save('save');
			},
			//添加并保存
			saveAndSubmit(){
				this.save('update');
			},
			//表格滚动加载
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
			requestData(index) {//高级查询字段
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				this.$axios.get(this.basic_url + '/api-apps/appCustom/getDispositonItem', {
					params: data
				}).then((res) => {
					this.page.totalCount = res.data.count;
					let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize);
					if(this.page.currentPage >= totalPage) {
						this.loadSign = false;
					} else {
						this.loadSign = true;
					}
					this.samplesList = res.data.data;
				}).catch((wrong) => {})
			},
			handleClose(done) { //大弹出框确定关闭按钮
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
			this.getType();
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>