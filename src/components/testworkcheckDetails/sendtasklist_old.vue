<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="" :visible.sync="dialogProduct" width="80%" :before-close="handleClose">
			<div class="mask_content">
				<el-form inline-message :model="workorderForm" :label-position="labelPosition" :rules="rules" ref="workorderForm" label-width="110px">
					<div class="content-accordion scrollbar" id="information" style="height:360px;">
						<el-collapse v-model="activeNames">
							<!-- 样品信息 Begin-->
							<el-collapse-item title="样品信息" name="1">
								<div v-if="this.workorderForm.STATE!=3" class="check-btn-right">
									<el-button class="start" type="warning" round size="mini" @click="sendback" v-show="start" ><i class="icon-back"></i> 回退</el-button>
								</div>
								<el-row :gutter="20" class="pb10">
									<el-col :span="4" class="pull-right">
										<el-input v-model="workorderForm.STATEDesc">
												<template slot="prepend">状态</template>
										</el-input>
									</el-col>
									<el-col :span="6" class="pull-right">
										<div class="el-input is-disabled el-input-group el-input-group--prepend">
											<div class="el-input-group__prepend">承检单位</div>
											<el-select clearable v-model="workorderForm.CJDW" filterable allow-create default-first-option placeholder="请选择承检单位" @change="RVENDORSelect($event)">
												<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
											</el-select>
										</div>
									</el-col>
									<el-col :span="8" class="pull-right">
										<el-input placeholder="自动生成" v-model="workorderForm.WONUM">
												<template slot="prepend">工作任务单编号</template>
										</el-input>
									</el-col>
								</el-row>

								<el-row>
									<el-col :span="24">
										<el-form-item label="样品名称" prop="ITEM_NAME">
											<el-input v-model="workorderForm.ITEM_NAME">
												<el-button slot="append" icon="el-icon-search" @click="addsample('workorder')"></el-button>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>

								<el-row>
									<el-col :span="8">
										<el-form-item label="规格型号" prop="ITEM_MODEL" >
											<el-input v-model="workorderForm.ITEM_MODEL"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="商标标识" prop="ITEM_TRADEMARK">
											<el-input v-model="workorderForm.ITEM_TRADEMARK"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="8">
										<el-form-item label="样品编号" prop="ITEMNUM">
											<el-input v-model="workorderForm.ITEMNUM"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="抽样日期" prop="CHECK_DATE">
											<el-date-picker v-model="workorderForm.CHECK_DATE" type="date" placeholder="请选择抽样日期" value-format="yyyy-MM-dd" style="width: 100%;">
											</el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="生产日期/批" prop="PRODUCT_DATE">
											<el-input v-model="workorderForm.PRODUCT_DATE"></el-input>
										</el-form-item>
									</el-col>
								</el-row>

								<el-row>
									<el-col :span="8">
										<el-form-item label="样品状态" prop="ITEM_STATUSDesc">
											<el-input v-model="workorderForm.ITEM_STATUSDesc"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="到站日期" prop="ARRIVAL_DATE">
											<el-date-picker v-model="workorderForm.ARRIVAL_DATE" type="date" placeholder="请选择到站日期" value-format="yyyy-MM-dd" style="width: 100%;">
											</el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="样品来源" prop="ITEM_SOURCE">
											<el-select v-model="workorderForm.ITEM_SOURCE" style="width: 100%">
												<el-option v-for="(data,index) in Select_ITEM_SOURCE" :key="index" :value="data.code" :label="data.name"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>

								<el-row >
									<el-col :span="8">
										<el-form-item label="样品数量" prop="ITEM_QUALITY">
											<el-input-number type="number" v-model.number="workorderForm.ITEM_QUALITY" @change="handleChangeQuality" :min="1" :max="1000" label="描述文字" style="width: 100%"></el-input-number>
										</el-form-item>
									</el-col>
									
									<el-col :span="8" >
										<el-form-item label="产品类别" prop="PRODUCT_TYPE"  label-width="110px">
											<el-input v-model="workorderForm.PRODUCT_TYPE" :disabled="true">
												<el-button slot="append" icon="el-icon-search" @click="addcategory"></el-button>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8" >
										<el-form-item label="产品名称" prop="PRODUCT"  label-width="110px">
											<el-input v-model="workorderForm.PRODUCT" :disabled="true">
												<el-button slot="append" icon="el-icon-search" @click="addproduct"></el-button>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-collapse-item>
							<!-- 样品信息 End-->

							<!-- 检测 Begin-->
							<el-collapse-item title="检测" name="2">
								<el-row :gutter="30">
									<el-col :span="24">
										<el-form-item label="抽样方案/判定依据" label-width="130px">
											<el-input type="textarea" rows="5" v-model="workorderForm.CHECK_BASIS"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-collapse-item>
							<!-- 检测 End-->
					
							<div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion>
								<el-tabs v-model="activeName">
									<el-tab-pane label="检测项目与要求" name="first">
										<el-table ref="table" :data="workorderForm.WORKORDER_PROJECTList" row-key="ID" border @selection-change="proChange" height="260" stripe :fit="true" style="width: 100%;" :default-sort="{prop:'workorderForm.WORKORDER_PROJECTList', order: 'descending'}">
											<el-table-column type="selection" width="55" fixed align="center"></el-table-column>
												<el-table-column prop="P_NUM" label="检测项目编号" sortable></el-table-column>
												<el-table-column prop="P_DESC" label="检测项目名称" sortable></el-table-column>
												<el-table-column prop="REMARKS" label="要求" sortable></el-table-column>
												<el-table-column prop="VERSION" label="版本" sortable></el-table-column>
										</el-table>
									</el-tab-pane>
									<el-tab-pane label="分包项目" name="second">
										<el-table ref="table" :data="workorderForm.WORKORDER_CONTRACTList" row-key="ID" border @selection-change="conChange" height="260" stripe :fit="true" style="width: 100%;" :default-sort="{prop:'workorderForm.WORKORDER_CONTRACTList', order: 'descending'}">
											<el-table-column type="selection" width="55" fixed align="center"></el-table-column>
											<el-table-column prop="WONUM" label="工作任务单编号" sortable width="150px"></el-table-column>
											<el-table-column prop="PROXY_CONTRACT_NUM" label="分包协议编号" sortable width="120px"></el-table-column>
											<el-table-column prop="PROXYNUM" label="委托书编号" sortable width="120px"></el-table-column>
											<el-table-column prop="INSPECT_GROUP" label="专业组" sortable width="120px"></el-table-column>
											<el-table-column prop="VENDORDesc" label="分包方名称" sortable width="120px"></el-table-column>
											<el-table-column prop="P_REMARKS" label="检验项目内容" sortable width="200px"></el-table-column>
											<el-table-column prop="REQUIRES" label="对环境和操作人员要求" sortable width="220px"></el-table-column>
											<el-table-column prop="Q_TYPE" label="对分包报告/证书的要求" sortable width="220px"></el-table-column>
											<el-table-column prop="CHECKCOST" label="检验费用" sortable width="120px"></el-table-column>
										</el-table>
									</el-tab-pane>
								</el-tabs>
							</div>
						</el-collapse>
					</div>
				</el-form>
			</div>
			<div class="content-footer">
				<el-button type="primary" @click="submit">确定</el-button>
				<el-button @click="close">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import Config from '../../config.js';
	export default {
//	props:["approvingData"],//第一种方式
  name: 'product',
  
  data() {
    return {
		basic_url: Config.dev_url,
		productList: [],
		dialogProduct: false,
		loadSign: true, //鼠标滚动加载数据
		loading: false,//默认加载数据时显示loading动画
		commentArr:{},
		start:false,
		selectData:[],//承检单位
		Select_ITEM_SOURCE:[],//获取样品信息-样品来源
		labelPosition: 'right', //表单文本框前面的标题右对齐
		activeName: 'first', //tabs
		activeNames: ['1','2','3'],//手风琴数量
		rules: {
					PROXYNUM: [{ required: true, trigger: 'blur', validator: this.Validators.isWorknumber}],//委托书编号
					PROXY_VERSION: [{ required: true, trigger: 'blur', validator: this.Validators.isNickname}],//委托书版本
					WONUM: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isWorknumber}
					],//工作任务单编号
					ITEM_NAME: [{ required: true,validator: this.Validators.isSpecificKey}],//样品名称
					ITEM_MODEL: [{ required: true,validator: this.Validators.isSpecificKey}],//规格型号
					ITEMNUM: [{ required: true,validator: this.Validators.isWorknumber}],//样品编号
					// ITEM_STATU: [{ required: true, message: '不能为空', trigger: 'blur' }],
					ITEM_STATUS: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					ITEM_SOURCE: [
						{ required: true, message: '不能为空', trigger: 'change' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					ITEM_QUALITY: [
						{ required: true, message: '不能为空', trigger: 'change' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					CHECK_BASIS: [
						{ required: true, message: '不能为空', trigger: 'change' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					COMPLETE_DATE: [
						{ required: true, message: '不能为空', trigger: 'change' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					COMPLETE_MODE: [
						{ required: true, message: '不能为空', trigger: 'change' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					ITEM_RECEPT_STATUS: [
						{ required: true, message: '不能为空', trigger: 'change' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					ITEM_PROFESSIONAL_GROUP: [
						{ required: true, message: '不能为空', trigger: 'change' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					STATUS: [
						{ required: true, message: '不能为空', trigger: 'change' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
				},
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
		},
		DEPTID:'',//当前选择的机构值
		NUM:'',//类别编号
		activeName: 'first', //tabs
		workorderForm:{
			WORKORDER_PROJECTList:[],
			WORKORDER_CONTRACTList:[]
		},
		proMenu: [],
		conMenu: [],
		WORKORDER_PROJECTLISTID:[],
		WORKORDER_CONTRACTLISTID:[]
    }
  },

  methods: {
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
  	dateFormat(row, column) {
		var date = row[column.property];
		if(date == undefined) {
			return "";
		}
		return this.$moment(date).format("YYYY-MM-DD");
    },
		//回退按钮
			sendback(){

			},
  	//表头居中
		rowClass({ row, rowIndex}) {
				return 'text-align:center'
		},
		//产品类别放大镜
			addcategory(){
				if(this.workorderForm.CJDW == null || this.workorderForm.CJDW == '' || this.workorderForm.CJDW == undefined){
					this.$message({
						message: '请先选择承检单位',
						type: 'warning'
					});
				}else{
					this.$refs.categorychild.visible(this.workorderForm.CJDW);
				}
			},
			//接到产品类别的值
			categorydata(value){
				this.workorderForm.P_NUM = value[0];
				this.workorderForm.PRODUCT_TYPE  = value[1];
				this.workorderForm.PRODUCT = '';
				this.workorderForm.PRO_NUM = '';
				this.workorderForm.S_NUM = '';
				this.workorderForm.WORKORDER_BASISList = [];
				this.workorderForm.WORKORDER_PROJECTList = [];
			},
			addproduct(){//受检产品名称
				if(this.workorderForm.P_NUM == null || this.workorderForm.P_NUM == '' || this.workorderForm.P_NUM == undefined){
					this.$message({
						message: '请先选择产品类别',
						type: 'warning'
					});
				}else{
					this.$refs.productchild.visible(this.workorderForm.P_NUM);
				}
			},
			//接到产品的值
			appenddata(value){
				this.workorderForm.PRO_NUM = value[0];
				this.workorderForm.PRODUCT = value[1];
				this.workorderForm.S_NUM = '';
				this.workorderForm.WORKORDER_BASISList = [];
				this.workorderForm.WORKORDER_PROJECTList = [];
			},
			//检验依据放大镜
			basisleadbtn(){
				if(this.workorderForm.PRO_NUM == null || this.workorderForm.PRO_NUM == '' || this.workorderForm.PRO_NUM == undefined){
					this.$message({
						message: '请先选择产品名称',
						type: 'warning'
					});
				}else{
					this.sendchilddata.push(this.workorderForm.PRO_NUM);
					this.sendchilddata.push(this.workorderForm.WORKORDER_BASISList);
					this.$refs.standardchild.basislead(this.sendchilddata);
					this.sendchilddata = [];
				}
			},
			//检验依据列表
			addbasis(value){
				this.workorderForm.S_NUM = value[0];
				for(var i = 1;i<value.length;i++){
					value[i].S_DESC = value[i].S_NAME;
					this.workorderForm.WORKORDER_BASISList.push(value[i]);
				}
				this.workorderForm.WORKORDER_PROJECTList = [];
			},
			//检验项目放大镜
			basisleadbtn2(){
				if(this.workorderForm.S_NUM == null || this.workorderForm.S_NUM == '' || this.workorderForm.S_NUM == undefined){
					this.$message({
						message: '请先选择检验依据列表数据',
						type: 'warning'
					});
				}else{
					this.sendchilddata.push(this.workorderForm.S_NUM);
					this.sendchilddata.push(this.workorderForm.WORKORDER_PROJECTList);
					this.$refs.projectchild.projectlead(this.sendchilddata);
					this.sendchilddata = [];
				}
			},
			 //检验项目列表
			addproject(value){
				for(var i = 0;i<value.length;i++){
					value[i].P_DESC = value[i].P_NAME;
					this.workorderForm.WORKORDER_PROJECTList.push(value[i]);
				}
				for(var i = 0;i<this.workorderForm.WORKORDER_PROJECTList.length;i++){
					this.pronums.push(this.workorderForm.WORKORDER_PROJECTList[i].P_NUM);
					console.log(2323);
					console.log(this.pronums);
				}
				this.workorderForm.PROJ_NUM = this.pronums.toString(',');
				console.log(111222);
				console.log(this.workorderForm.PROJ_NUM);
			},
		//承检单位
		getCompany() {
				var type = "2";
				var url = this.basic_url + '/api-user/depts/treeByType';
				this.$axios.get(url, {
					params: {
						type: type
					},
				}).then((res) => {
					this.selectData = res.data;
				});
			},
			//承检单位带出样品承接人(专业组)
			RVENDORSelect(RVENDORid){
				var url = this.basic_url + '/api-user/depts/findByPid/'+RVENDORid;
					this.$axios.get(url, {}).then((res) => {
						this.maingroup = res.data;
					}).catch((err) => {
					});
				this.workorderForm.PRODUCT_TYPE = '';
				this.workorderForm.P_NUM = '';
				this.workorderForm.PRODUCT = '';
				this.workorderForm.PRO_NUM = '';
				this.workorderForm.S_NUM = '';
				this.workorderForm.WORKORDER_BASISList = [];
				this.workorderForm.WORKORDER_PROJECTList    = [];
				ITEM_PROFESSIONAL_GROUP:'';//清空承接人数据
			},
			//获取样品信息-样品状态
			getITEM_STATUS() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=ITEM_STATUS';
				this.$axios.get(url, {}).then((res) => {
					this.Select_ITEM_STATUS = res.data;
				}).catch(error => {
				})
			},
			//获取样品信息-样品来源
			getITEM_SOURCE() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=ITEM_SOURCE';
				this.$axios.get(url, {}).then((res) => {
					this.Select_ITEM_SOURCE = res.data;
				}).catch(error => {
				})
			},
			//获取样品信息-完成方式
			getCOMPLETE_MODE() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=COMPLETE_MODE';
				this.$axios.get(url, {}).then((res) => {
					this.Select_COMPLETE_MODE = res.data;
				}).catch(error => {
				})
			},
			//获取样品信息-样品接收状态
			getITEM_RECEPT_STATUS() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=ITEM_RECEPT_STATUS';
				this.$axios.get(url, {}).then((res) => {
					this.Select_ITEM_RECEPT_STATUS = res.data;
				}).catch(error => {
				})
			},
			//获取样品信息-接收人、
			getselectData() {
				var page = this.page.currentPage;
				var limit = this.page.pageSize;
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=DEPT_TYPE';
				this.$axios.get(url, {}).then((res) => {
					this.selectData = res.data;
				}).catch(error => {
					console.log('请求失败');
				})
			},
			//获取样品信息-样品检后状态
			getITEM_CHECK_STATUS() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=ITEM_CHECK_STATUS';
				this.$axios.get(url, {}).then((res) => {
					this.Select_ITEM_CHECK_STATUS = res.data;
				}).catch(error => {
				})
			},
			//获取样品信息-样品处置
			getITEM_MANAGEMENT() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=ITEM_MANAGEMENT';
				this.$axios.get(url, {}).then((res) => {
					this.Select_ITEM_MANAGEMENT = res.data;
				}).catch(error => {
				})
			},
           
			//更改样品数量
			handleChangeQuality(value) {
				console.log(value);
			},
  	//表格滚动加载
		loadMore() {
			let up2down = sessionStorage.getItem('up2down');
			if(this.loadSign) {					
				if(up2down=='down'){
					this.page.currentPage++;
					if(this.page.currentPage > Math.ceil(this.page.totalCount / this.page.pageSize)) {
						this.page.currentPage = Math.ceil(this.page.totalCount / this.page.pageSize)
						return false;
					}
					let append_height = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
					if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
						$('.el-table__body-wrapper table').append('<div class="filing" style="height: '+append_height+'px;width: 100%;"></div>');
						sessionStorage.setItem('toBtm','true');
					}
				}else{
					sessionStorage.setItem('toBtm','false');
					this.page.currentPage--;
					if(this.page.currentPage < 1) {
						this.page.currentPage=1;
						return false;
					}
				}
				this.loadSign = false;
				setTimeout(() => {
					this.loadSign = true;
				}, 1000)
				this.requestData();
			}
		},
	//改变页数
	sizeChange(val) {
		this.page.pageSize = val;
		if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
			$('.el-table__body-wrapper table').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
			sessionStorage.setItem('toBtm','true');
		}else{
			sessionStorage.setItem('toBtm','false');
		}
		this.requestData();
	},
	//当前页数
	currentChange(val) {
		this.page.currentPage = val;
		if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
			$('.el-table__body-wrapper table').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
			sessionStorage.setItem('toBtm','true');
		}else{
			sessionStorage.setItem('toBtm','false');
		}
		this.requestData();
	},
  	//点击关闭按钮
	close() {
		this.dialogProduct = false;
	},
  	visible(dataid) {
		this.workorderForm.ID = dataid;
		this.requestData(dataid);
	},
	//Table默认加载数据
	requestData(dataid){
		this.loading = true;//加载动画打开
		var url = this.basic_url +'/api-apps/app/workorder/operate/subtaskList?WORKORDERID='+dataid;
		this.$axios.get(url, {}).then((res) => {
			if(res.data.resp_code == 0) {
				this.page.totalCount = res.data.count;//页码赋值
				//总的页数
				let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize);
				if(this.page.currentPage >= totalPage) {
					this.loadSign = false;
				} else {
					this.loadSign = true;
				}
				this.workorderForm.WORKORDER_PROJECTList = res.data.datas.WORKORDER_PROJECT;
				this.workorderForm.WORKORDER_CONTRACTList = res.data.datas.WORKORDER_CONTRACT;
				this.dialogProduct = true;
				this.loading = false;//加载动画关闭
				if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
					$('.el-table__body-wrapper table').find('.filing').remove();
				}//滚动加载数据判断filing
			}else if(res.data.resp_code == 1){
				this.$message({
					message: res.data.resp_msg,
					type: 'warning'
				});
				this.dialogProduct = false;
			}
		}).catch((err) => {
		});
	},
	proChange(val) {
		this.proMenu = val;
	},
	conChange(val) {
		this.conMenu = val;
	},
	submit(){
		if(this.conMenu.length == 0 && this.proMenu.length == 0) {
			this.$message({
				message: '请选择至少一条数据',
				type: 'warning'
			});
			return;
		}else {
			for(var i = 0;i<this.proMenu.length;i++){
				this.WORKORDER_PROJECTLISTID.push(this.proMenu[i].ID);
			}
			for(var i = 0;i<this.conMenu.length;i++){
				this.WORKORDER_CONTRACTLISTID.push(this.conMenu[i].ID);
			}
			var id = this.workorderForm.ID.toString();
			var projectid = this.WORKORDER_PROJECTLISTID.toString(',');
			var contractid = this.WORKORDER_CONTRACTLISTID.toString(',');
			// var url = 'http://192.168.1.115:7902/app/workorder/operate/subtask?WORKORDERID='+id+'&WORKORDER_PROJECTLISTID='+projectid+'WORKORDER_CONTRACTLISTID='+contractid;
			var url = this.basic_url +'/api-apps/app/workorder/operate/subtask?WORKORDERID='+id+'&WORKORDER_PROJECTLISTID='+projectid+'&WORKORDER_CONTRACTLISTID='+contractid;
			this.$axios.get(url,{}).then((res) => {
				if(res.data.resp_code == 0) {
					this.$message({
						message: '生成成功',
						type: 'success'
					});
					this.$emit('refresh');
				}
			}).catch((err) => {
			});
			this.selMenu = [];
			this.dialogProduct = false;
			this.$emit('request');
		}
	},	
  },
  mounted() {
  	
	},
}
</script>

<style>
</style>