<template>
<div>
	<el-card class="box-card" :body-style="{ padding: '10px' }">
		<div slot="header" class="title clearfix">
			<span>产品</span>
			<!--搜索框 Begin-->
				<div class="columns pull-right" style="width: 160px;">
					<el-input placeholder="请输入产品名称" v-model="search"></el-input>
				</div>
			<!--搜索框 End-->
		</div>
		<div class="text item">
			<div class="table-func pb10 clearfix">
				<el-button type="success" size="mini" round @click="addfield_product2">
					<i class="icon-add"></i>
					<font>新建</font>
				</el-button>
			</div>
			<el-form inline-message :model="product2Form" ref="product2Form" class="el-radio__table">
			  <el-table ref="table" :data="product2Form.inspectionList.filter(data => !search || data.PRO_NAME.toLowerCase().includes(search.toLowerCase()))" row-key="ID" border stripe height="250"
					highlight-current-row
					@current-change="viewchildRow"
					style="width: 100%;"
					:default-sort="{prop:'product2Form.inspectionList', order: 'descending'}">

			  	<el-table-column label="产品编号" sortable width="100" prop="PRO_NUM" class="pl30">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.PRO_NUM'">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.PRO_NUM" placeholder="自动生成" disabled></el-input>
								<span class="blue" v-else>{{scope.row.PRO_NUM}}</span>
								<!-- <span class="blue" @click="viewchildRow(scope.row.ID,scope.row.PRO_NUM)" v-else>{{scope.row.PRO_NUM}}</span> -->
							</el-form-item>
			      </template>
			    </el-table-column>
					
			  	<!-- <el-table-column label="所属产品类别" width="80" prop="NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.NUM" disabled></el-input><span v-else>{{scope.row.NUM}}</span>
							</el-form-item>
			      </template>
			    </el-table-column> -->
					
			    <el-table-column label="产品名称" sortable prop="PRO_NAME">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.PRO_NAME'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.PRO_NAME" :disabled="true" placeholder="请选择">
			        		<el-button slot="append" icon="icon-search" @click="addprobtn(scope.row)"></el-button>
			        	</el-input><span v-else>{{scope.row.PRO_NAME}}</span>
					</el-form-item>
			      </template>
			    </el-table-column>

				<!-- <el-table-column prop="STATUS" label="信息状态" sortable width="120" :formatter="judge">
			      <template slot-scope="scope">
			        <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.STATUS" disabled></el-input><span v-else>{{scope.row.STATUS}}</span>
			      </template>
			    </el-table-column> -->
				
				<!-- <el-table-column prop="VERSION" label="版本" sortable width="120">
			      <template slot-scope="scope">
			       	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.VERSION" disabled></el-input><span v-else>{{scope.row.VERSION}}</span>
			      </template>
			    </el-table-column> -->

			    <!-- <el-table-column prop="ENTERBY" label="修改人" sortable width="120">
			      <template slot-scope="scope">
			        <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.ENTERBY" placeholder="请输入内容" disabled></el-input><span v-else>{{scope.row.ENTERBY}}</span>
			      </template>
			    </el-table-column> -->

			     <!-- <el-table-column prop="ENTERDATE" label="修改时间" sortable width="160" :formatter="dateFormat">
			      <template slot-scope="scope">
			      	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.ENTERDATE" disabled></el-input><span v-else>{{scope.row.ENTERDATE}}</span>
			      </template>
			    </el-table-column> -->

			    <el-table-column prop="iconOperation" fixed="right" label="操作" width="50">
			      <template slot-scope="scope">
			        <!-- <el-button type="text" id="Edit" size="medium" @click="saveRow(scope.row)" v-if="scope.row.isEditing">
			        	<i class="icon-check" title="保存"></i>
					</el-button> -->
					<!-- <el-button type="text" size="medium" @click="modifyversion(scope.row)" v-else>
			        	<i class="icon-edit" title="修改"></i>
					</el-button> -->
			        <el-button type="text" id="Edit" size="medium" @click="saveRow(scope.row)" v-if="scope.row.isEditing">
			        	<i class="icon-check" title="保存"></i>
					</el-button>

			        <el-button @click="deleteRow(scope.row)" type="text" size="medium" title="删除" v-else>
			          <i class="icon-trash red"></i>
			        </el-button>
				 	<!--  <el-button type="primary" round size="mini" @click="addchildRow(scope.row)" v-else>
			          添加
			        </el-button> -->
			      </template>
			    </el-table-column>

			  </el-table>
			</el-form>
			<!-- 表格分页 Begin-->
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

	<!-- 产品 Begin -->
	<el-dialog :modal-append-to-body="false" title="选择基础数据——产品" height="300px" :visible.sync="dialogVisible3" width="80%">
		<!--搜索框 Begin-->
		<div class="columns pull-right child-search">
			<el-input placeholder="请输入产品名称" v-model="search">
			</el-input>
		</div>
		<!--搜索框 End-->
		<!-- 第二层弹出的表格 Begin-->
		<el-table ref="table2" :header-cell-style="rowClass" :data="categoryList.filter(data => !search || data.PRO_NAME.toLowerCase().includes(search.toLowerCase()))" border stripe height="300px"
			highlight-current-row
			@current-change="addproclass"
				v-loadmore="loadMore"
				v-loading="loading"
				element-loading-text="加载中…"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(255, 255, 255, 0.9)"
			style="width: 100%;" :default-sort="{prop:'categoryList', order: 'descending'}">
			<!-- <el-table-column type="selection" fixed width="55" align="center">
			</el-table-column> -->
			<el-table-column type="index" label="序号" width="50">
					<template slot-scope="scope">
						<span> {{(page.currentPage-1)*page.pageSize+scope.$index+1}} </span>
					</template>
				</el-table-column>
			<el-table-column label="产品编码" width="155" sortable prop="PRO_NUM">
			</el-table-column>
			<el-table-column label="产品名称" sortable prop="PRO_NAME">
			</el-table-column>
			<el-table-column label="版本" width="100" sortable prop="VERSION" align="right">
			</el-table-column>
			<el-table-column label="机构" width="185" sortable prop="DEPTIDDesc">
			</el-table-column>
			<el-table-column label="录入时间" width="120" prop="ENTERDATE" sortable :formatter="dateFormat">
			</el-table-column>
			<el-table-column label="修改时间" width="120" prop="ENTERDATE" sortable :formatter="dateFormat">
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
	<!-- 产品 End -->
</div>

</template>
<script>
	import Config from '../../config.js'
	
	export default {
		name: 'product2',
		components: {
			
		},
		props: ['parentIds'],
		data() {
			return {
				basic_url: Config.dev_url,
				product2Form:{
					inspectionList: []
				},
				fullHeight: document.documentElement.clientHeight - 100+'px',//获取浏览器高度
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
					pageSize: 20,
					totalCount: 0
				},
				parentId: 1,
				// selParentId: 1, //父类选中id
			}
		},
		methods: {
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
			 addprobtn(row){//查找基础数据中的产品名称
			 	this.catedata = row;//弹出框中选中的数据赋值给到table行中
				this.dialogVisible3 = true;
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				this.$axios.get(this.basic_url + '/api-apps/app/product', {
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
					this.categoryList = newarr;
				}).catch((wrong) => {})
			},
			// searchinfo(index) {//设置默认分页数
			// 	this.page.currentPage = 1;
			// 	this.page.pageSize = 10;
			// 	this.viewfield_product2(this.selParentId,this.parentId);
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
			viewfield_product2(id,num){//点击父级筛选出子级数据
				if(id==undefined||id==null||id==''||num==undefined||num==null||num==''){
					this.product2Form.inspectionList = [];
					this.viewchildRow('null');
					return false;
					//todo  相关数据设置
				}
				this.selParentId = id;
				this.parentId = num;
				var url = this.basic_url + '/api-apps/app/productType2'
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
					this.product2Form.inspectionList=!!res.data.PRODUCT2List?res.data.PRODUCT2List:[];
					
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}//滚动加载数据判断filing

					//默认主表第一条数据
					if(!this.product2Form.inspectionList||this.product2Form.inspectionList.length == 0){
						this.viewchildRow('null');
						this.product2Form.inspectionList = [];
					}else{
						this.$refs.table.setCurrentRow(this.product2Form.inspectionList[0]);//默认选中第一条数据
						var data=this.product2Form.inspectionList[0];
						this.$emit('parentMsd_product2', data);
					}
					for(var j = 0; j < this.product2Form.inspectionList.length; j++){
						this.product2Form.inspectionList[j].isEditing = false;
					}
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
			formatter(row, column) {//禁止产品行编辑
				return row.enabled;
			},
			addfield_product2(NUM) { //插入行到产品类型Table中
				var isEditingflag=false;
				if(Array.isArray(this.product2Form.inspectionList)){
					for(var i=0;i<this.product2Form.inspectionList.length; i++){
						if (this.product2Form.inspectionList[i].isEditing==false){
							isEditingflag=false;
						}else{
								isEditingflag=true;
								break;
						}
					}
				}else{
					this.product2Form.inspectionList = [];
				}
				
				if (isEditingflag==false){
						this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
						var currentUser, currentDatee;
						this.currentUser=res.data.nickname;
						var date=new Date();
						this.currentDate = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
						var obj = {
							"NUM": this.parentId,//产品类别编号
							"PRO_NUM": '',
							"PRO_NAME": '',
							"STATUS": '',
							"VERSION": '',
							"DEPTID": '',
							"ENTERBY": this.currentUser,
							"ENTERDATE": this.currentDate,
							"isEditing": true,
						};
						this.product2Form.inspectionList.unshift(obj);//在列表前新建行unshift，在列表后新建行push
					}).catch((err)=>{
					})
					} else {
						this.$message.warning("请先保存当前编辑项");
				}
			},
			saveRow (row) {//Table-操作列中的保存行
				this.$refs['product2Form'].validate((valid) => {
					if (valid) {
					var url = this.basic_url + '/api-apps/app/product2/saveOrUpdate';
					var submitData = {
						"ID":row.ID,
						"NUM": row.NUM,
						"PRO_NAME": row.PRO_NAME,
						"STATUS": row.STATUS,
						"DEPTID": row.DEPTID,
						"ENTERBY": row.ENTERBY,
						"ENTERDATE": row.ENTERDATE,
						"PRO_NUM": row.PRO_NUM,
						"VERSION": row.VERSION,
					}
					this.$axios.post(url, submitData).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							//重新加载数据
							this.viewfield_product2(this.selParentId,this.parentId);//重新加载父级选中的数据下所有子数据
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
				this.$confirm('确定删除此产品类型吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
					}).then(({ value }) => {
						var url = this.basic_url + '/api-apps/app/product2/' + row.ID;
							this.$axios.delete(url, {}).then((res) => {//.delete 传数据方法
					//resp_code == 0 是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.viewfield_product2(this.selParentId,this.parentId);
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
					this.catedata.PRO_NUM = val.PRO_NUM;
					this.catedata.PRO_NAME = val.PRO_NAME;
					this.catedata.DEPTID = val.DEPTID;
					this.catedata.VERSION = val.VERSION;
					this.$emit('request');
					this.dialogVisible3 = false
				}
			},
			viewchildRow(data) {//查看子项数
				this.currentRow = data;
				this.$emit('parentMsd_product2', data);//给父组件传值
			},
			// viewchildRow(ID,PRO_NUM) {//查看子项数据
			// 	var data = {
			// 		id: ID,
			// 		num: PRO_NUM
			// 	};
			// 	this.$emit('parentMsd_product2', data);
			// },
		},
		

	}
</script>

<style scoped>
.el-form-item__error {
	top: 18%;
    left: 5px;
    background: #FFF;
    padding: 5px 10px;
}
.el-card__header {
	padding: 10px;
}
.el-card { position: relative; overflow:visible;}
.el-card .table-func {
	display: none;
	z-index: 998;
	position:absolute;
	top: -35px;
	left: 0px;
	width: 100px;
	text-align: left;
}
.el-card:hover .table-func  {display: block;}

</style>