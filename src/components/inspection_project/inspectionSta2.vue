<template>
<div>
	<el-card class="box-card" :body-style="{ padding: '10px' }">
		<div slot="header" class="title clearfix">
			<span>检验/检测标准</span>
			<!--搜索框 Begin-->
			<div class="columns pull-right" style="width: 160px;">
				<el-input placeholder="请输入标准名称" v-model="search">
				</el-input>
			</div>
			<!--搜索框 End-->
		</div>
		<div class="text item">
			<div class="table-func pb10 clearfix">
				<el-button type="success" size="mini" round @click="addfield_inspectionSta2">
					<i class="icon-add"></i>
					<font>新建</font>
				</el-button>
			</div>
			<el-form inline-message :model="inspectionSta2Form" status-icon ref="inspectionSta2Form" class="el-radio__table">
			  <el-table ref="table" :data="inspectionSta2Form.inspectionList.filter(data => !search || data.S_NAME.toLowerCase().includes(search.toLowerCase()))" row-key="ID" border stripe height="250"
				highlight-current-row
				@current-change="viewchildRow"
				style="width: 100%;" :default-sort="{prop:'inspectionSta2Form.inspectionList', order: 'descending'}">
					
			  	<!-- <el-table-column label="编码" sortable width="100" prop="S_NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.S_NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.S_NUM" placeholder="请选择" disabled></el-input>
								<span class="blue" v-else>{{scope.row.S_NUM}}</span>
							</el-form-item>
			      </template>
			    </el-table-column> -->

					<el-table-column label="标准编号" width="140" prop="SS_NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.SS_NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.SS_NUM" disabled></el-input>
								<span class="blue" v-else>{{scope.row.SS_NUM}}</span>
								<!-- <span class="blue" @click="viewchildRow(scope.row.ID,scope.row.SS_NUM)" v-else>{{scope.row.SS_NUM}}</span> -->
							</el-form-item>
			      </template>
			    </el-table-column>

					<!-- <el-table-column label="所属产品类别" width="80" prop="NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.NUM" disabled></el-input>
								<span v-else>{{scope.row.NUM}}</span>
							</el-form-item>
			      </template>
			    </el-table-column>

					<el-table-column label="所属产品" width="80" prop="PRO_NUM">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.PRO_NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.PRO_NUM" disabled></el-input><span v-else>{{scope.row.PRO_NUM}}</span>
							</el-form-item>
			      </template>
			    </el-table-column> -->
					
			    <el-table-column label="标准名称" sortable prop="S_NAME">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.S_NAME'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.S_NAME" :disabled="true" placeholder="请输入内容">
			        		<el-button slot="append" icon="icon-search" @click="addprobtn(scope.row)"></el-button>
			        	</el-input><span v-else>{{scope.row.S_NAME}}</span>
							</el-form-item>
			      </template>
			    </el-table-column>

					<!-- <el-table-column label="标准英文名称" sortable prop="S_ENGNAME">
			      <template slot-scope="scope">
			        <el-form-item :prop="'inspectionList.'+scope.$index + '.S_ENGNAME'">
			        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.S_ENGNAME" :disabled="true" placeholder="请输入内容">
			        	</el-input><span v-else>{{scope.row.S_ENGNAME}}</span>
							</el-form-item>
			      </template>
			    </el-table-column> -->

				<!-- <el-table-column prop="STATUS" label="信息状态" sortable width="100" :formatter="judge">
			      <template slot-scope="scope">
			        <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.STATUS" disabled></el-input><span v-else>{{scope.row.STATUS}}</span>
			      </template>
			    </el-table-column>
				
				<el-table-column prop="RELEASETIME" label="发布时间" sortable width="120" :formatter="dateFormat">
			      <template slot-scope="scope">
			       	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.RELEASETIME" disabled></el-input><span v-else>{{scope.row.RELEASETIME}}</span>
			      </template>
			    </el-table-column>

					<el-table-column prop="STARTETIME" label="启用时间" sortable width="120" :formatter="dateFormat">
			      <template slot-scope="scope">
			       	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.STARTETIME" disabled></el-input><span v-else>{{scope.row.STARTETIME}}</span>
			      </template>
			    </el-table-column>

					<el-table-column prop="STOPTIME" label="停用时间" sortable width="120" :formatter="dateFormat">
			      <template slot-scope="scope">
			       	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.STOPTIME" disabled></el-input><span v-else>{{scope.row.STOPTIME}}</span>
			      </template>
			    </el-table-column>

			    <el-table-column prop="CHANGEBY" label="修改人" sortable width="100">
			      <template slot-scope="scope">
			        <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.CHANGEBY" placeholder="请输入内容" disabled></el-input><span v-else>{{scope.row.CHANGEBY}}</span>
			      </template>
			    </el-table-column>

			     <el-table-column prop="CHANGEDATE" label="修改时间" sortable width="160" :formatter="dateFormat">
			      <template slot-scope="scope">
			      	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.CHANGEDATE" disabled></el-input><span v-else>{{scope.row.CHANGEDATE}}</span>
			      </template>
			    </el-table-column> -->

			    <el-table-column prop="iconOperation" fixed="right" label="操作" width="50">
			      <template slot-scope="scope">
					<!-- <el-button type="text" size="medium" @click.native.prevent="modifyversion(scope.row)" v-else>
			        	<i class="icon-edit" title="修改"></i>
					</el-button> -->

					<el-button type="text" id="Edit" size="medium" @click.native.prevent="saveRow(scope.row)" v-if="scope.row.isEditing">
			        	<i class="icon-check" title="保存"></i>
					</el-button>

			        <el-button @click="deleteRow(scope.row)" type="text" size="medium" title="删除" v-else>
			          <i class="icon-trash red"></i>
			        </el-button>

			        <!-- <el-button type="text" id="Edit" size="medium" @click.native.prevent="saveRow(scope.row)" v-if="scope.row.isEditing">
			        	<i class="icon-check" title="保存"></i>
							</el-button>
							<el-button type="primary" round size="mini" @click="addchildRow(scope.row)" v-else>
			          添加
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

	<!-- 检验/检测标准 Begin -->
		<el-dialog :modal-append-to-body="false" title="选择基础数据——检验/检测标准" height="300px" :visible.sync="dialogVisible3" width="80%">
			<!--搜索框 Begin-->
			<div class="columns pull-right child-search">
				<el-input placeholder="请输入标准名称" v-model="search">
				</el-input>
			</div>
			<!--搜索框 End-->
			<!-- 第二层弹出的表格 Begin-->
			<el-table ref="table2" :header-cell-style="rowClass" :data="categoryList.filter(data => !search || data.SS_NUM.toLowerCase().includes(search.toLowerCase()))" border stripe height="360px"
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

				<el-table-column label="编码" width="155" sortable prop="S_NUM">
				</el-table-column>
				<el-table-column label="标准编号" width="155" sortable prop="SS_NUM">
				</el-table-column>
				<el-table-column label="标准名称" width="255" sortable prop="S_NAME">
				</el-table-column>
				<el-table-column label="标准英文名称" width="300" sortable prop="S_ENGNAME">
				</el-table-column>
				<el-table-column label="使用状态" width="100" sortable prop="ISUSESTATEDesc">
				</el-table-column>
				<el-table-column label="版本" sortable prop="VERSION" align="right">
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
		<!-- 检验/检测标准 End -->
</div>
</template>
<script>
	import Config from '../../config.js'
	
	export default {
		name: 'inspectionSta2',
		components: {
			
		},
		props: ['parentIds'],
		data() {
			return {
				basic_url: Config.dev_url,
				inspectionSta2Form:{//获取数据组
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
					pageSize: 20,
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

			addprobtn(row){//查找基础数据中的检验/检测标准
			 	this.catedata = row;//弹出框中选中的数据赋值给到table行中
				this.dialogVisible3 = true;
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				this.$axios.get(this.basic_url + '/api-apps/app/inspectionSta', {
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
			// 	this.viewfield_inspectionSta2(this.selParentId,this.pTypeId,this.parentId);
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
			// indexMethod(index) {
			// 	return index + 1;
			// },
			viewfield_inspectionSta2(id,num,pro_num){//点击父级筛选出子级数据
				if(id==undefined||id==null||id==''||num==undefined||num==null||num==''){
					this.inspectionSta2Form.inspectionList = []; 
					this.viewchildRow('null');
					return false;
					//todo  相关数据设置
				}
				this.selParentId =id;
				this.pTypeId = num;
				this.parentId = pro_num;
				console.log(this.selParentId);
				var url = this.basic_url + '/api-apps/app/inspectionSta2/PRODUCT2'
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
					this.inspectionSta2Form.inspectionList=!!res.data.INSPECTION_STANDARDS2List?res.data.INSPECTION_STANDARDS2List:[];
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}//滚动加载数据判断filing
					
					//默认主表第一条数据
					if(!this.inspectionSta2Form.inspectionList||this.inspectionSta2Form.inspectionList.length == 0){
						this.viewchildRow('null');
						this.inspectionSta2Form.inspectionList = []; 
					}else{
						this.$refs.table.setCurrentRow(this.inspectionSta2Form.inspectionList[0]);//默认选中第一条数据
						var data=this.inspectionSta2Form.inspectionList[0];
						this.$emit('parentMsd_inspectionSta2', data);
					}
					for(var j = 0; j < this.inspectionSta2Form.inspectionList.length; j++){
						this.inspectionSta2Form.inspectionList[j].isEditing = false;
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
			formatter(row, column) {
				return row.enabled;
			},
			addfield_inspectionSta2(PRO_NUM) { //插入行到产品类别Table中
				if (this.parentId == 1) {
					this.$message({
						message:'请选择所属产品',
						type:'warning'
					})
				} else {
					var isEditingflag=false;
					for(var i=0;i<this.inspectionSta2Form.inspectionList.length; i++){
						if (this.inspectionSta2Form.inspectionList[i].isEditing==false){
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
							this.currentDate = this.$moment(date).format("YYYY-MM-DD");
							this.currentDateTime = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
							var obj = {
								"NUM": this.pTypeId,//产品类别编号
								"PRO_NUM": this.parentId,//产品编号
								"S_NUM": '',//编码
								"SS_NUM": '',//标准编号
								"S_NAME": '',//标准中文名称
								"S_ENGNAME": '',//标准英文名称
								"ISUSESTATE": '',//使用状态
								"STATUS": '',
								"VERSION": '',
								"DEPTID": '',
								"RELEASETIME": '',
								"STARTETIME": '',
								"STOPTIME": '',
								"ENTERBY": this.currentUser,
								"ENTERDATE": this.currentDateTime,
								"isEditing": true,
							};
							this.inspectionSta2Form.inspectionList.unshift(obj);//在列表前新建行unshift，在列表后新建行push
						}).catch((err)=>{
						})
							} else {
									this.$message.warning("请先保存当前编辑项");
					}
				}
			},
			saveRow (row) {//Table-操作列中的保存行
				this.$refs['inspectionSta2Form'].validate((valid) => {
					if (valid) {
					var url = this.basic_url + '/api-apps/app/inspectionSta2/saveOrUpdate';
					var submitData = {
						"ID":row.ID,
						"NUM": row.NUM,
						"PRO_NUM": row.PRO_NUM,
						"S_NUM": row.S_NUM,
						"SS_NUM": row.SS_NUM,
						"S_NAME": row.S_NAME,
						"S_ENGNAME": row.S_ENGNAME,
						"ISUSESTATE": row.ISUSESTATE,
						"STATUS": row.STATUS,
						"DEPTID": row.DEPTID,
						"RELEASETIME": row.RELEASETIME,
						"STARTETIME": row.STARTETIME,
						"STOPTIME": row.STOPTIME,
						"ENTERBY": row.ENTERBY,
						"ENTERDATE": row.ENTERDATE,
						"VERSION": row.VERSION,
					}
					this.$axios.post(url, submitData).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							//重新加载数据
							// this.requestData_inspectionSta2();
							this.viewfield_inspectionSta2(this.selParentId,this.pTypeId,this.parentId);//重新加载父级选中的数据下所有子数据
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
						var url = this.basic_url + '/api-apps/app/inspectionSta2/' + row.ID;
							this.$axios.delete(url, {}).then((res) => {//.delete 传数据方法
					//resp_code == 0 是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.viewfield_inspectionSta2(this.selParentId,this.pTypeId,this.parentId);
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
					this.catedata.S_NUM = val.S_NUM;//编码
					this.catedata.SS_NUM = val.SS_NUM;//标准编号
					this.catedata.S_NAME = val.S_NAME;
					this.catedata.S_ENGNAME = val.S_ENGNAME;
					this.catedata.ISUSESTATE = val.ISUSESTATE;
					this.catedata.DEPTID = val.DEPTID;
					this.catedata.VERSION = val.VERSION;
					this.catedata.RELEASETIME = val.RELEASETIME;
					this.catedata.STARTETIME = val.STARTETIME;
					this.catedata.STOPTIME = val.STOPTIME;
					this.catedata.FILESIZE = val.FILESIZE;
					this.catedata.FILEID = val.FILEID;
					this.catedata.FILEPATH = val.FILEPATH;
					this.$emit('request');
					this.dialogVisible3 = false
				}
			},
			viewchildRow(data) {//查看子项数
				this.currentRow = data;
				this.$emit('parentMsd_inspectionSta2', data);
			},
			// viewchildRow(ID,S_NUM) {//查看子项数据
			// 	var data = {
			// 		id: ID,
			// 		num: S_NUM
			// 	};
			// 	this.$emit('parentMsd_inspectionSta2', data);
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
	right: 0px;
	width: 100px;
	text-align: right;
}
.el-card:hover .table-func  {display: block;}
</style>