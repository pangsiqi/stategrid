<template>
<div>
	<div class="headerbg">
		<vheader></vheader>
		<navs_tabs ref="navsTabs"></navs_tabs>
	</div>
	<div class="contentbg">
		<!--左侧菜单调用 Begin-->
			<!-- <navs_left ref="navleft" v-on:childByValue="childByValue"></navs_left>  -->
		<!--左侧菜单调用 End-->
		<!--右侧内容显示 Begin-->
		<div class="wrapper wrapper-content wrapperall" :style="{height: fullHeight}">
			<div class="ibox-content">
				<!--所属机构 Begin-->
				<el-row :gutter="0">
					<el-col :span="24" class="text-center">
						<div class="clearfix">
							<div class="table-func pull-left">
								<el-button type="success" size="mini" round @click="addfield_productType2" class="pull-right mt5">
									<i class="icon-add"></i>
									<font>新建</font>
								</el-button>
							</div>
						<el-form :inline="true" :model="formInline">
							<el-form-item label="所属机构" prop="DEPTID">
								<el-select v-model="formInline.DEPTID" placeholder="请选择" @change="requestData" :disabled="nameFlag">
									<el-option v-for="(data,index) in Select_DEPTID" :key="index" :value="data.id" :label="data.fullname"></el-option>
								</el-select>
								<!-- <el-select v-model="formInline.DEPTID" placeholder="请选择" v-else disabled @change="requestData">
									<el-option v-for="(data,index) in Select_DEPTID" :key="index" :value="data.id" :label="data.fullname"></el-option>
								</el-select> -->
							</el-form-item>
						</el-form>
						</div>
					</el-col>
				</el-row>
				<!--所属机构 End-->

				<el-row class="relative" id="pageDiv">
					<el-col :span="6">
						<el-card class="box-card" :body-style="{ padding: '10px' }">
							<div slot="header" class="title clearfix">
								<span>产品类别</span>
								<!--搜索框 Begin-->
								<div class="columns pull-right" style="width: 160px;">
									<el-input placeholder="请输入产品类别名称" v-model="search">
									</el-input>
								</div>
								<!--搜索框 End-->
							</div>
							<div class="text item">
								<el-form inline-message :model="productType2Form" ref="productType2Form" class="el-radio__table">
								  <el-table ref="table" :data="productType2Form.inspectionList.filter(data => !search || data.TYPE.toLowerCase().includes(search.toLowerCase()))" row-key="ID" border stripe height="250"
										highlight-current-row
										@current-change="viewchildRow"
										style="width: 100%;"
										:default-sort="{prop:'productType2Form.inspectionList', order: 'descending'}">
								  	<el-table-column label="类别编号" sortable width="100" prop="NUM" class="pl30">
								      <template slot-scope="scope">
								        <el-form-item :prop="'inspectionList.'+scope.$index + '.NUM'">
								        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.NUM" placeholder="请选择" :disabled="true"></el-input>
													<span class="blue" v-else>{{scope.row.NUM}}</span>
												</el-form-item>
								      </template>
								    </el-table-column>

								    <el-table-column label="类别名称" sortable prop="TYPE">
								      <template slot-scope="scope">
								        <el-form-item :prop="'inspectionList.'+scope.$index + '.TYPE'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
								        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.TYPE" placeholder="请选择" :disabled="true">
								        		<el-button slot="append" icon="icon-search" @click="addprobtn(scope.row)"></el-button>
								        	</el-input><span v-else>{{scope.row.TYPE}}</span>
												</el-form-item>
								      </template>
								    </el-table-column>

								    <el-table-column prop="iconOperation" fixed="right" label="操作" width="50">
								      <template slot-scope="scope">
								        <el-button type="text" id="Edit" size="medium" @click="saveRow(scope.row)" v-if="scope.row.isEditing">
								        	<i class="icon-check" title="保存"></i>
										</el-button>
										<!-- <el-button type="text" size="medium" @click="modifyversion(scope.row)">
								        	<i class="icon-edit" title="修改"></i>
										</el-button> -->
								        <el-button @click="deleteRow(scope.row)" type="text" size="medium" title="删除" v-else>
								          <i class="icon-trash red"></i>
								        </el-button>

									 	<!-- <el-button type="text" size="medium" @click="addchildRow(scope.row)">
								          <i class="icon-add" title="添加子项"></i>
								        </el-button> -->
								      </template>
								    </el-table-column>

								  </el-table>
								</el-form>
								<!-- 表格 Begin-->
								<!-- <el-pagination background class="text-right pt10 pb10"
						            @size-change="sizeChange"
						            @current-change="currentChange"
						            :current-page="page.currentPage"
						            :page-sizes="[10, 20, 30, 40]"
						            :page-size="page.pageSize"
						            layout="total, sizes, prev, pager, next"
						            :total="page.totalCount">
						        </el-pagination> -->
								<!-- 表格 End-->
							</div>
						</el-card>
					</el-col>
					<el-col :span="6" class="v-resize"><product2child @parentMsd_product2="childMsd_product2" ref="product2child" :parentIds="formInline.DEPTID"></product2child></el-col>
					<el-col :span="6" class="v-resize"><inspectionSta2child @parentMsd_inspectionSta2="childMsd_inspectionSta2" ref="inspectionSta2child" :parentIds="formInline.DEPTID"></inspectionSta2child></el-col>
					<el-col :span="6" class="v-resize"><inspectionPro2child @parentMsd_inspectionPro2="childMsd_inspectionPro2" ref="inspectionPro2child" :parentIds="formInline.DEPTID"></inspectionPro2child></el-col>
				</el-row>
				<div class="el-collapse-item mt10 pt10 pb10" aria-expanded="true" accordion>
					<el-row :gutter="0">
						<el-col :span="24">
							<el-tabs>
						    	<el-tab-pane label="专业组"><professionGrochild ref="professionGrochild" :parentIds="formInline.DEPTID"></professionGrochild></el-tab-pane>
						    	<el-tab-pane label="检验/检测方法"><inspectionMet2child ref="inspectionMet2child" :parentIds="formInline.DEPTID"></inspectionMet2child></el-tab-pane>
						    	<el-tab-pane label="原始数据模板"><rawDataTem2child ref="rawDataTem2child" :parentIds="formInline.DEPTID"></rawDataTem2child></el-tab-pane>
						    	<el-tab-pane label="检验/检测报告模板"><inspectionRepTem2child ref="inspectionRepTem2child" :parentIds="formInline.DEPTID"></inspectionRepTem2child></el-tab-pane>
						    	<el-tab-pane label="检测仪器"><rawDataAssetchild ref="rawDataAssetchild" :parentIds="formInline.DEPTID"></rawDataAssetchild></el-tab-pane>
						    </el-tabs>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
	<!--右侧内容显示 End-->
	</div>

	<!-- 产品类别弹出框 Begin -->
		<el-dialog :modal-append-to-body="false" title="选择基础数据——产品类别" height="360px" :visible.sync="dialogVisible3" width="80%">
			<!--搜索框 Begin-->
			<div class="columns pull-right child-search">
				<el-input placeholder="请输入类别名称" v-model="search">
				</el-input>
			</div>
			<!--搜索框 End-->
			<el-table ref="table2" :header-cell-style="rowClass" :data="categoryList.filter(data => !search || data.TYPE.toLowerCase().includes(search.toLowerCase()))" border stripe
				height="400px"
				highlight-current-row
				@current-change="addproclass"
				v-loadmore="loadMore"
				v-loading="loading"
				element-loading-text="加载中…"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(255, 255, 255, 0.9)"
				style="width: 100%;" :default-sort="{prop:'categoryList', order:'descending'}">
				<!-- <el-table-column type="selection" fixed width="55" align="center">
				</el-table-column> -->
				<el-table-column type="index" label="序号" width="50">
					<template slot-scope="scope">
						<span> {{(page.currentPage-1)*page.pageSize+scope.$index+1}} </span>
					</template>
				</el-table-column>
				<el-table-column label="类别编码" width="155" sortable prop="NUM">
				</el-table-column>
				<el-table-column label="类别名称" sortable prop="TYPE">
				</el-table-column>
				<el-table-column label="版本" width="100" sortable prop="VERSION" align="right">
				</el-table-column>
				<el-table-column label="机构" width="185" sortable prop="DEPTIDDesc">
				</el-table-column>
				<el-table-column label="录入时间" width="120" prop="ENTERDATE" sortable :formatter="dateFormat">
				</el-table-column>
				<el-table-column label="修改时间" width="120" prop="CHANGEDATE" sortable :formatter="dateFormat">
				</el-table-column>
			</el-table>
			<div class="pt10 text-right">
				<el-pagination
						@size-change="sizeChange"
						background
						@current-change="currentChange"
						:current-page="page.currentPage"
						:page-sizes="[10, 20, 30, 40]"
						:page-size="page.pageSize"
						layout="total, sizes, prev, pager, next"
						:total="page.totalCount">
				</el-pagination>
			</div>
			<!-- 表格 End-->
			<!-- <span slot="footer" class="dialog-footer">
		       <el-button type="primary" @click="addproclass">确 定</el-button>
		       <el-button @click="dialogVisible3 = false">取 消</el-button>
		    </span> -->
		</el-dialog>
		<!-- 产品类别 End -->
</div>
</template>
<script>
	import Config from '../config.js'
	import vheader from './common/vheader.vue'
	import navs_tabs from './common/nav_tabs.vue'
	import navs_left from './common/left_navs/nav_left5.vue'
	import product2child from './inspection_project/product2.vue'//产品名称
	import inspectionSta2child from './inspection_project/inspectionSta2.vue'//检验/检测标准
	import inspectionPro2child from './inspection_project/inspectionPro2.vue'//检验/检测项目
	import professionGrochild from './inspection_project/professionGro.vue'//专业组
	import inspectionMet2child from './inspection_project/inspectionMet2.vue'//检验/检测方法
	import rawDataTem2child from './inspection_project/rawDataTem2.vue'//原始数据模板
	import inspectionRepTem2child from './inspection_project/inspectionRepTem2.vue'//检验/检测报告模板
	import rawDataAssetchild from './inspection_project/rawDataAsset.vue'//仪器和计量器具
	export default {
		name: 'inspection_project',
		components: {
			vheader,
			navs_left,
			navs_tabs,
			product2child,//产品名称
			inspectionSta2child,//检验/检测标准
			inspectionPro2child,//检验/检测项目
			professionGrochild,//专业组
			inspectionMet2child,//检验/检测方法
			rawDataTem2child,//原始数据模板
			inspectionRepTem2child,//检验/检测报告模板
			rawDataAssetchild,//仪器和计量器具
		},
		data() {
			return {
				basic_url: Config.dev_url,
				Select_DEPTID:[],//获取机构部门
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				formInline: {//选择站点显示数据
					DEPTID: '',//this.currentDept,
				},
				productType2Form:{//产品类别数据组
					inspectionList: []
				},
				departmentId: '',//当前用户机构号
				categoryList:[],//获取产品类型数据
				catedata:'',//获取产品类别一条数据放到table行中
				selData:[],
				isEditing: '',
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				commentArr:{},//下拉加载
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				search: '',//搜索
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				product2Id: 0,//获取子表产品ID
				inspectionSta2Id: 0,//获取子表检验/检测标准ID
				inspectionPro2Id: 0,//获取子表检验/检测项目ID
				dialogVisible3: false, //对话框
				parentId: 1,
				nameFlag: true
			}
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			childMsd_product2(data){//赋值给子组件检验/检测标准
				this.product2Id = data;
				if (!!data){
				this.$refs.inspectionSta2child.viewfield_inspectionSta2(data.ID,data.NUM,data.PRO_NUM);
				} else {
					this.$refs.inspectionSta2child.viewfield_inspectionSta2(null,null,null);
				}
			},
			childMsd_inspectionSta2(data){//赋值给子组件检验/检测项目
				this.inspectionSta2Id = data;
				if (!!data){
				this.$refs.inspectionPro2child.viewfield_inspectionPro2(data.ID,data.NUM,data.PRO_NUM,data.S_NUM);
				} else {
					this.$refs.inspectionPro2child.viewfield_inspectionPro2(null,null,null,null);
				}
			},
			childMsd_inspectionPro2(data){//赋值给子组件专业组、检验/检测方法、原始数据模板、检验/检测报告模板、检测仪器
				this.inspectionPro2Id = data;
				if (!!data){
				this.$refs.professionGrochild.viewfield_professionGro(data.ID,data.NUM,data.PRO_NUM,data.S_NUM,data.P_NUM);
				this.$refs.inspectionMet2child.viewfield_inspectionMet2(data.ID,data.NUM,data.PRO_NUM,data.S_NUM,data.P_NUM);
				this.$refs.rawDataTem2child.viewfield_rawDataTem2(data.ID,data.NUM,data.PRO_NUM,data.S_NUM,data.P_NUM);
				this.$refs.inspectionRepTem2child.viewfield_inspectionRepTem2(data.ID,data.NUM,data.PRO_NUM,data.S_NUM,data.P_NUM);
				this.$refs.rawDataAssetchild.viewfield_rawDataAsset(data.ID,data.NUM,data.PRO_NUM,data.S_NUM,data.P_NUM);
				} else {
				this.$refs.professionGrochild.viewfield_professionGro(null,null,null,null,null);
				this.$refs.inspectionMet2child.viewfield_inspectionMet2(null,null,null,null,null);
				this.$refs.rawDataTem2child.viewfield_rawDataTem2(null,null,null,null,null);
				this.$refs.inspectionRepTem2child.viewfield_inspectionRepTem2(null,null,null,null,null);
				this.$refs.rawDataAssetchild.viewfield_rawDataAsset(null,null,null,null,null);
				}
			},
			
			iconOperation(row, column, cell, event){//切换Table-操作列中的修改、保存
				if(column.property ==="iconOperation"){
					row.isEditing = !row.isEditing
				}
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
						let append_height = window.innerHeight - this.$refs.table2.$el.offsetTop - 50;
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
					this.addprobtn(this.catedata);
				}
			},
			//改变页数
			sizeChange(val) {
				this.page.pageSize = val;
				if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
					$('.el-table__body-wrapper table2').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
					sessionStorage.setItem('toBtm','true');
				}else{
					sessionStorage.setItem('toBtm','false');
				}
				this.addprobtn(this.catedata);
			},
			//当前页数
			currentChange(val) {
				this.page.currentPage = val;
				if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
					$('.el-table__body-wrapper table2').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
					sessionStorage.setItem('toBtm','true');
				}else{
					sessionStorage.setItem('toBtm','false');
				}
				this.addprobtn(this.catedata);;
			},

			addprobtn(row){//查找基础数据中的类别名称
			 	this.catedata = row;//弹出框中选中的数据赋值给到table行中
				this.dialogVisible3 = true;
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				// console.log(this.formInline.DEPTID);
				// var parentIds=this.formInline.DEPTID;//获取下拉列表中的所属机构ID
				// debugger;
				var url=this.basic_url + '/api-apps/appSelection/productType/leafPageForStation?tree_id=NUM&tree_pid=PARENT';
				this.$axios.get(url,{params: data}).then((res) => {
					this.page.totalCount = res.data.count;
					//总的页数
					let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize)
					if(this.page.currentPage >= totalPage) {
						this.loadSign = false
					} else {
						this.loadSign = true
					}
					// this.commentArr[this.page.currentPage] = res.data.data
					// let newarr = []
					// for(var i = 1; i <= totalPage; i++) {
					// 	if(typeof(this.commentArr[i]) != 'undefined' && this.commentArr[i].length > 0) {
					// 		for(var j = 0; j < this.commentArr[i].length; j++) {
					// 			newarr.push(this.commentArr[i][j])
					// 		}
					// 	}
					// }
					this.categoryList = res.data.data;
				}).catch((wrong) => {})
			},
			// searchinfo(index) {
			// 	this.page.currentPage = 1;
			// 	this.page.pageSize = 20;
			// 	this.requestData();
			// },
			// judge(data) {//taxStatus 信息状态布尔值
			// 	return data.enabled ? '活动' : '不活动'
			// },
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			indexMethod(index) {
				return index + 1;
			},
			getDEPTID() {//获取机构部门数据
				var currenturl = this.basic_url + '/api-user/users/findUsersDeptofSta';
					this.$axios.get(currenturl, {}).then((res) => {
						this.Select_DEPTID = res.data;
						this.formInline.DEPTID = res.data[0].id;
						this.requestData();
					}).catch(error => {
					})
					
			},
			
			requestData() {//加载数据
				this.loading = true;//加载动画打开
				var _this = this;
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					DEPTID: this.formInline.DEPTID_GRO,//点击部门名称下拉菜单显示数据
				}
				var url = this.basic_url + '/api-user/depts/findSubStrsById/'+ this.formInline.DEPTID;
				this.$axios.get(url, {}).then((res) => {//获取当前用户信息
				this.DEPTID_GRO = res.data;
					// console.log(this.formInline.DEPTID);
				var url = this.basic_url + '/api-apps/app/productType2?DEPTID_where_in='+ this.DEPTID_GRO;
					this.$axios.get(url, {
						params: data
					}).then((res) => {
						this.page.totalCount = res.data.count;
						//总的页数
						let totalPage=Math.ceil(this.page.totalCount/this.page.pageSize)
						if(this.page.currentPage >= totalPage){
							this.loadSign = false
						}else{
							this.loadSign=true
						}
						this.commentArr[this.page.currentPage]=res.data.data
						let newarr=[]
						for(var i = 1; i <= totalPage; i++){
							if(typeof(this.commentArr[i])!='undefined' && this.commentArr[i].length>0){
								for(var j = 0; j < this.commentArr[i].length; j++){
									this.commentArr[i][j].isEditing = false;
									newarr.push(this.commentArr[i][j])
								}
							}
						}
						this.productType2Form.inspectionList = newarr;//滚动加载更多
						
						this.loading = false;//加载动画关闭
						if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
							$('.el-table__body-wrapper table').find('.filing').remove();
						}//滚动加载数据判断filing

						//默认主表第一条数据
						if(!this.productType2Form.inspectionList||this.productType2Form.inspectionList.length == 0){
							this.viewchildRow('null');
						}else{
							this.$refs.table.setCurrentRow(this.productType2Form.inspectionList[0]);//默认选中第一条数据
						}
						
					}).catch((wrong) => {})
				}).catch((err) => {
				});
			},
			
			handleClose(done) {//关闭选择产品类别弹出框
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
			},
			formatter(row, column) {//禁止产品类别行编辑
				return row.enabled;
			},
			addfield_productType2() { //插入行到产品类别Table中
				var isEditingflag=false;
				for(var i=0;i<this.productType2Form.inspectionList.length; i++){
					if (this.productType2Form.inspectionList[i].isEditing==false){
						isEditingflag=false;
					}else{
						isEditingflag=true;
						break;
					}
				}
				if (isEditingflag==false){
						this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
						var currentUser, currentDate;
						this.currentUser=res.data.nickname;
						var date=new Date();
						this.currentDate = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
						var obj = {
							"TYPE": '',
							"STATUS": '',
							"NUM": '',
							"VERSION": '',
							"DEPTID": '',
							"ENTERBY": this.currentUser,
							"ENTERDATE": this.currentDate,
							"isEditing": true,
						};
						this.productType2Form.inspectionList.unshift(obj);//在列表前新建行unshift，在列表后新建行push
					}).catch((err)=>{
					})
						} else {
						this.$message.warning("请先保存当前编辑项");
				}
			},
			saveRow (row) {//Table-操作列中的保存行
				this.$refs['productType2Form'].validate((valid) => {
				if (valid) {
					var url = this.basic_url + '/api-apps/app/productType2/saveOrUpdate';
					var submitData = {
						"ID":row.ID,
						"TYPE": row.TYPE,
						"NUM": row.NUM,
						"VERSION": row.VERSION,
						"DEPTID": row.DEPTID,
						"STATUS": row.STATUS,
						"ENTERBY": row.ENTERBY,
						"ENTERDATE": row.ENTERDATE,
					}
					this.$axios.post(url, submitData).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							//重新加载数据
							this.requestData();
						} else {
							this.$message({
								message: res.data.resp_msg,
								type: 'warning'
							});
						}
					}).catch((err) => {
						
					});
						} else {
							return false;
						}
					});
			},
			deleteRow(row) {//Table-操作列中的删除行
				this.$confirm('确定删除此数据吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
					}).then(({ value }) => {
						var url = this.basic_url + '/api-apps/app/productType2/' + row.ID;
							this.$axios.delete(url, {}).then((res) => {//.delete 传数据方法
					//resp_code == 0 是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.requestData();
						} else {
							this.$message({
								message: res.data.resp_msg,
								type: 'warning'
							});
						}
					}).catch((err) => {
					});
						}).catch(() => {
					});
			},
			
			addproclass(val) { //小弹出框单击数据table行返回数据
				this.currentRow = val;
				if (val!=null) {
					this.catedata.NUM = val.NUM;
					this.catedata.TYPE = val.TYPE;
					this.catedata.DEPTID = val.DEPTID;
					this.catedata.VERSION = val.VERSION;
					this.$emit('request');
					this.dialogVisible3 = false;
				}
			},
			
			viewchildRow(val) {//查看子项数
				this.currentRow = val;
				this.$refs.product2child.viewfield_product2(val.ID,val.NUM);
			},
			// viewchildRow(id,num) {//单击整体选中本条数据
			// 	this.currentRow = val;
			// 	this.$refs.product2child.viewfield_product2(val.ID,val.NUM);
      // },
		},
		
		mounted() {
			this.getDEPTID();
			// this.getData();
			// this.requestData();
		},
	}
</script>

<style scoped>
.input { position: relative; z-index: 25; }
.el-input__suffix-inner {display: none;}
.el-form-item { margin-bottom: 0px;}
.el-collapse-item {
	padding-left: 15px;
	padding-right: 15px;
}
.el-table td {
    padding-top: 0px;
    padding-bottom: 0px;
}
.table-func {
	position:relative;
	top: 0px;
	right: 0px;
}
.el-table .cell {
	display: inline-block;
	cursor: pointer;
}
.el-card.is-never-shadow {
	background-color: #f0f2f9;
	-webkit-box-shadow: 0 2px 12px 0 rgba(39, 50, 173, 0.35);
    box-shadow: 0 2px 12px 0 rgba(39, 50, 173, 0.35);
}
.ml60 {margin-left: 60px;}
/*.el-card.is-always-shadow {
	-webkit-box-shadow: 0 2px 12px 0 rgba(56, 124, 195, 0.35);
    box-shadow: 0 2px 12px 0 rgba(56, 124, 195, 0.35);
}*/
/*.el-form-item__error {
	top: 18%;
    left: 5px;
    background: #FFF;
    padding: 5px 10px;
}
*/
</style>