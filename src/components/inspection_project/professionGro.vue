<template>
	<div>
		<div class="text item">
			<div class="clearfix relative">
				<!-- <div class="columns pull-left"><el-button type="primary" size="small">关联父级</el-button></div> -->
				<div class="columns pull-left">
					<el-input placeholder="请输入专业组名称" v-model="search" class="input-with-select">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</div>
				<div class="table-func pull-right">
					<el-button type="success" size="mini" round @click="addfield_professionGro" class="pull-right">
						<i class="icon-add"></i>
						<font>新建</font>
					</el-button>
				</div>
			</div>
			<el-form inline-message :model="professionGroForm" ref="professionGroForm">
				<!-- 表格 Begin-->
			  <el-table ref="table" :data="professionGroForm.inspectionList.filter(data => !search || data.PROF_GROUP.toLowerCase().includes(search.toLowerCase()))" row-key="ID" border stripe height="280"
					highlight-current-row
					style="width: 100%;" :default-sort="{prop:'professionGroForm.inspectionList', order: 'descending'}">
					<!-- <el-table-column label="所属产品类别" width="120" prop="NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.NUM" placeholder="请选择" disabled></el-input><span v-else>{{scope.row.NUM}}</span>
							</el-form-item>
			      </template>
			    </el-table-column>

					<el-table-column label="所属产品" width="120" prop="PRO_NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.PRO_NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.PRO_NUM" placeholder="请选择" disabled></el-input><span v-else>{{scope.row.PRO_NUM}}</span>
							</el-form-item>
			      </template>
			    </el-table-column>

					<el-table-column label="所属检验/检测标准" width="120" prop="S_NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.S_NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.S_NUM" placeholder="请选择" disabled></el-input><span v-else>{{scope.row.S_NUM}}</span>
							</el-form-item>
			      </template>
			    </el-table-column> -->

			  	<el-table-column label="所属项目编号" width="120" prop="P_NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.P_NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.P_NUM" placeholder="请选择" disabled></el-input><span v-else>{{scope.row.P_NUM}}</span>
							</el-form-item>
			      </template>
			    </el-table-column>

			  	<el-table-column label="机构编号" width="160" prop="PROF_NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.PROF_NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.PROF_NUM" placeholder="请选择" disabled></el-input>
								<span v-else>{{scope.row.PROF_NUM}}</span>
							</el-form-item>
			      </template>
			    </el-table-column>

			    <el-table-column label="专业组名称" sortable prop="PROF_GROUP">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.PROF_GROUP'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.PROF_GROUP" :disabled="true" placeholder="请选择">
			        		<el-button slot="append" icon="icon-search" @click="addprobtn(scope.row)"></el-button>
			        	</el-input><span v-else>{{scope.row.PROF_GROUP}}</span>
							</el-form-item>
			      </template>
			    </el-table-column>

				<!-- <el-table-column prop="STATUS" label="信息状态" sortable width="100" :formatter="judge">
			      <template slot-scope="scope">
			         <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.STATUS" disabled></el-input><span v-else>{{scope.row.STATUS}}</span>
			      </template>
			    </el-table-column> -->
				
				<!-- <el-table-column prop="VERSION" label="版本" sortable width="120">
			      <template slot-scope="scope">
			       	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.VERSION" disabled></el-input><span v-else>#r{{scope.row.VERSION}}</span>
			      </template>
			    </el-table-column> -->

			    <!-- <el-table-column prop="CHANGEBY" label="修改人" sortable width="120">
			      <template slot-scope="scope">
			        <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.CHANGEBY" placeholder="请输入内容" disabled></el-input><span v-else>{{scope.row.CHANGEBY}}</span>
			      </template>
			    </el-table-column>

			     <el-table-column prop="CHANGEDATE" label="修改时间" sortable width="160" :formatter="dateFormat">
			      <template slot-scope="scope">
			      	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.CHANGEDATE" disabled></el-input><span v-else>{{scope.row.CHANGEDATE}}</span>
			      </template>
			    </el-table-column> -->

			    <!-- <el-table-column prop="operationChild" fixed="right" align="center" label="增加子项" width="80">
				 	<template slot-scope="scope">
					 	<el-button type="text" id="Edit" size="medium" @click.native.prevent="saveRow(scope.row)" v-if="scope.row.isEditing">
				        	<i class="icon-check" title="保存"></i>
						</el-button>

					 	<el-button type="primary" round size="mini" @click="addchildRow(scope.row)" v-else>
							添加
						</el-button>
				    </template>
				 </el-table-column> -->
				 <el-table-column prop="iconOperation" fixed="right" label="操作" width="80">
			      <template slot-scope="scope">
			        <el-button type="text" id="Edit" size="medium" @click.native.prevent="saveRow(scope.row)" v-if="scope.row.isEditing">
						<i class="icon-check" title="保存"></i>
					</el-button>
					<el-button @click="deleteRow(scope.row)" type="text" size="medium" title="删除" v-else>
						<i class="icon-trash red"></i>
			        </el-button>
					<!-- <el-button type="text" size="medium" @click.native.prevent="modifyversion(scope.row)">
			        	<i class="icon-edit" title="修改"></i>
					</el-button> -->
			      </template>
			    </el-table-column>
			  </el-table>
			</el-form>
			<!-- 表格 End-->
		</div>

		<!-- 专业组 Begin -->
		<el-dialog :modal-append-to-body="false" title="选择基础数据——专业组" height="300px" :visible.sync="dialogVisible3" width="80%">
			<!--搜索框 Begin-->
			<div class="columns pull-right child-search">
				<el-input placeholder="请输入专业组名称" v-model="search">
				</el-input>
			</div>
			<!--搜索框 End-->
			<!-- 第二层弹出的表格 Begin-->
			<el-table ref="table2" :header-cell-style="rowClass" :data="categoryList.filter(data => !search || data.fullname.toLowerCase().includes(search.toLowerCase()))" border stripe height="300px"
				highlight-current-row
				@current-change="addproclass"
				style="width: 100%;"
				:default-sort="{prop:'categoryList', order: 'descending'}">
				<!-- <el-table-column type="selection" fixed width="55" align="center">
				</el-table-column> -->
				<el-table-column type="index" label="序号" width="50">
					<template slot-scope="scope">
						<span> {{(page.currentPage-1)*page.pageSize+scope.$index+1}} </span>
					</template>
				</el-table-column>
				<el-table-column label="机构编号" width="125" sortable prop="id">
				</el-table-column>
				<el-table-column label="专业组名称" sortable prop="fullname">
				</el-table-column>
				<el-table-column label="上级机构" width="185" sortable prop="parent">
				</el-table-column>
				<el-table-column label="版本" width="100" sortable prop="version" align="right">
				</el-table-column>
				<el-table-column label="录入时间" width="120" prop="createTime" sortable :formatter="dateFormat">
				</el-table-column>
				<el-table-column label="修改时间" width="120" prop="updateTime" sortable :formatter="dateFormat">
				</el-table-column>
			</el-table>
			<!-- 表格 End-->
			<!-- <span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="addproclass">确 定</el-button>
					<el-button @click="dialogVisible3 = false">取 消</el-button>
			</span> -->
		</el-dialog>
		<!-- 专业组 End -->
</div>
</template>

<script>
	import Config from '../../config.js'
	export default {
		name: 'professionGro',
		components: {
			
		},
		props: ['parentIds'],

		data() {
			return {
				basic_url: Config.dev_url,
				professionGroForm:{
					inspectionList: []
				},
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				departmentId: '',//当前用户机构号
				categoryList:[],//获取产品数据
				catedata:'',//获取产品类别一条数据放到table行中
				dialogVisible3: false, //对话框
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
					pageSize: 200,
					totalCount: 0
				},
				parentId: 1
			}
		},
		methods: {
			iconOperation(row, column, cell, event){//切换Table-操作列中的修改、保存
				if(column.property ==="iconOperation"){
					row.isEditing = !row.isEditing
				}
			},
			modifyversion (row) {//点击修改后给当前修改人和修改时间赋值
				 this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					row.CHANGEBY=res.data.id;
					var date=new Date();
					row.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err)=>{
				})
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
				this.addprobtn(this.catedata);
			},
			addprobtn(row){//查找基础数据中的检验/检测项目
				this.catedata = row;//弹出框中选中的数据赋值给到table行中
				this.dialogVisible3 = true;
				var currenturl = this.basic_url + '/api-user/depts/findByPid/' + this.parentIds;
				this.$axios.get(currenturl, {}).then((res) => {
					this.categoryList = res.data;
				}).catch(error => {
				})
			},
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			viewfield_professionGro(id,num,pro_num,s_num,p_num){//点击父级筛选出子级数据
				if(id==undefined||id==null||id==''||num==undefined||num==null||num==''){
					this.professionGroForm.inspectionList = [];
					return false;
					//todo  相关数据设置
				}
				this.selParentId = id;
				this.pTypeId = num;
				this.proId = pro_num;
				this.staId = s_num;
				this.parentId = p_num;
				var url = this.basic_url + '/api-apps/app/professionGro/INSPECTION_PROJECT2';
				url = !!id? (url + '/' + id) : url;
				this.$axios.get(url, {}).then((res) => {
					this.page.totalCount = res.data.count;	
					//总的页数
					let totalPage=Math.ceil(this.page.totalCount/this.page.pageSize)
					if(this.page.currentPage >= totalPage){
						 this.loadSign = false
					}else{
						this.loadSign=true
					}
					this.professionGroForm.inspectionList=!!res.data.PROFESSION_GROUPList?res.data.PROFESSION_GROUPList:[];

					for(var j = 0; j < this.professionGroForm.inspectionList.length; j++){
						this.professionGroForm.inspectionList[j].isEditing = false;
					}
					this.$refs.singleTable.setCurrentRow(this.professionGroForm.inspectionList[0]);//默认选中第一条数据
				}).catch((wrong) => {})
			},
			//获取导入表格勾选信息
			SelChange(val) {
				this.selData = val;
			},
			//表头居中
			rowClass({ row, rowIndex}) {
				return 'text-align:center'
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
			formatter(row, column) {
				return row.enabled;
			},
			addfield_professionGro(P_NUM) { //插入行到专业组Table中
				if (this.parentId == 1) {
					this.$message({
						message:'请选择所属检验/检测项目',
						type:'warning'
					})
				} else {
					var isEditingflag=false;
					for(var i=0;i<this.professionGroForm.inspectionList.length; i++){
						if (this.professionGroForm.inspectionList[i].isEditing==false){
							isEditingflag=false;
						}else{
							isEditingflag=true;
							break;
						}
					}
					if (isEditingflag==false){
							this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
							var currentUser, currentDate, currentDept;
							this.currentUser=res.data.nickname;
							this.currentDept=res.data.deptid;
							var date=new Date();
							this.currentDate = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
							var obj = {
								"NUM": this.pTypeId,//产品类别编号
								"PRO_NUM": this.proId,//产品编号
								"S_NUM": this.staId,//检验检测标准编号
								"P_NUM": this.parentId,//检验检测项目编号
								"PROF_NUM": '',//专业组编号
								"PROF_GROUP": '',
								"STATUS": '',
								"VERSION": '',
								"DEPTID": '',
								"ENTERBY": this.currentUser,
								"ENTERDATE": this.currentDate,
								"isEditing": true,
							};
							this.professionGroForm.inspectionList.unshift(obj);//在列表前新建行unshift，在列表后新建行push
						}).catch((err)=>{
						})
							} else {
								this.$message.warning("请先保存当前编辑项");
					}
				}
			},
			saveRow (row) {//Table-操作列中的保存行
				this.$refs['professionGroForm'].validate((valid) => {
					if (valid) {
					var url = this.basic_url + '/api-apps/app/professionGro/saveOrUpdate';
					var submitData = {
						"ID":row.ID,
						"NUM": row.NUM,//产品类编号
						"PRO_NUM": row.PRO_NUM,//产品编号
						"S_NUM": row.S_NUM,//检验检测标准编码
						// "SS_NUM": row.SS_NUM,//检验检测标准编号
						"P_NUM": row.P_NUM,//检验检测项目编号
						"PROF_NUM": row.PROF_NUM,//专业组编号
						"PROF_GROUP": row.PROF_GROUP,
						"STATUS": row.STATUS,
						"DEPTID": row.DEPTID,
						"ENTERBY": row.ENTERBY,
						"ENTERDATE": row.ENTERDATE,
						"VERSION": row.VERSION,
						"VERSION": row.VERSION,
					}
					this.$axios.post(url, submitData).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							//重新加载数据
							// this.requestData_professionGro();
							this.viewfield_professionGro(this.selParentId,this.pTypeId,this.proId,this.staId,this.parentId);//重新加载父级选中的数据下所有子数据
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
					var url = this.basic_url + '/api-apps/app/professionGro/' + row.ID;
						this.$axios.delete(url, {}).then((res) => {//.delete 传数据方法
					//resp_code == 0 是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.viewfield_professionGro(this.selParentId,this.pTypeId,this.proId,this.staId,this.parentId);
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
				addproclass(val) { //小弹出框确认按钮事件
				this.currentRow = val;
				if (val!=null) {
					this.catedata.PROF_NUM = val.id;
					this.catedata.PROF_GROUP = val.fullname;
					this.catedata.DEPTID = val.DEPTID;
					this.catedata.VERSION = val.VERSION;
					this.$emit('request');
					this.dialogVisible3 = false
				}
			},
		},
		
		// mounted() {
		// 	this.requestData_professionGro();
		// },
	}
</script>

<style scoped>
.el-form-item__error {
	top: 18%;
    left: 5px;
    background: #FFF;
    padding: 5px 10px;
}

.table-func {
	position: absolute;
	top: -50px;
    right: 0px;
    z-index: 888;
}
.columns{
	width:220px;
	position: absolute;
    right: 100px;
    bottom: -40px;
    z-index: 88;
}

</style>