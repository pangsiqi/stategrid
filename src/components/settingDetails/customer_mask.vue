<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加客户</div>
					<div class="mask_title" v-show="modifytitle">修改客户</div>
					<div class="mask_title" v-show="viewtitle">查看客户</div>
					<div class="mask_anniu">
						<span class="mask_span mask_max" @click="toggle">
							<i v-bind:class="{ 'icon-maximization': isok1, 'icon-restore':isok2}"></i>
						</span>
						<span class="mask_span" @click="close">
							<i class="icon-close1"></i>
						</span>
					</div>
				</div>
				<div class="mask_content"><!-- status-icon验证后小对号 -->
					<el-form inline-message ref="CUSTOMER" :model="CUSTOMER" :rules="rules" class="demo-adduserForm" :label-position="labelPosition">
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基本信息" name="1">
									<el-row :gutter="20" class="pb10" style='display:none;'>
										<el-col :span="5" class="pull-right">
											<!-- <el-input v-model="CUSTOMER.STATUS" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input> -->
											<!-- <el-select v-model="CUSTOMER.STATUS" placeholder="请选择状态">
												<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
												</el-option>
											</el-select> -->
										</el-col>
									</el-row>
									<!-- <el-form label-width="100px"> -->
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="统一社会信用代码" prop="CODE" label-width="140px">
												<el-input v-model="CUSTOMER.CODE" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="单位名称" prop="NAME" label-width="100px">
												<el-input v-model="CUSTOMER.NAME" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="类型" prop="TYPE" label-width="100px">
												<el-select v-model="CUSTOMER.TYPE" placeholder="请选择" style="width: 100%" :disabled="noedit">
													<el-option v-for="(data,index) in SeleCUST_TYPE" :key="index" :value="data.code" :label="data.name"></el-option>
												</el-select>
											</el-form-item>
											<!--<el-form-item label="类型" prop="TYPE">
												<el-select style="width: 100%;" v-model="CUSTOMER.TYPE" placeholder="类型">
											      	<el-option label="委托" value="委托">	
											      	</el-option>
											      	<el-option label="分包" value="分包">
											      	</el-option>
											      	<el-option label="两者皆是" value="两者皆是">	
											      	</el-option>
											    </el-select>
											</el-form-item>-->
										</el-col>
									</el-row>
									<!-- <el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="邮箱" prop="EMAIL" label-width="110px">
												<el-input v-model="CUSTOMER.EMAIL" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="电话" prop="PHONE" label-width="100px">
												<el-input v-model="CUSTOMER.PHONE" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="传真" prop="FAX" label-width="100px">
												<el-input v-model="CUSTOMER.FAX" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row> -->
									<el-row :gutter="30">
										<el-col :span="16">
											<el-form-item label="联系地址" prop="CONTACT_ADDRESS" label-width="140px">
												<el-input v-model="CUSTOMER.CONTACT_ADDRESS" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="邮政编码" prop="ZIPCODE" label-width="100px">
												<el-input v-model="CUSTOMER.ZIPCODE" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="24">
											<el-form-item label="备注" prop="MEMO" label-width="140px">
												<el-input v-model="CUSTOMER.MEMO" type="textarea" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								<!-- </el-form> -->
								</el-collapse-item>
								
								<div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion>
									<el-tabs v-model="activeName" @tab-click="handleClick">
										<el-tab-pane name="first">
											<span slot="label"><i class="red">*</i> 资质信息</span>
											<div class="table-func table-funcb" >
												<el-button type="success" size="mini" round @click="addfield" v-show="!viewtitle">
													<i class="icon-add"></i>
													<font>新建行</font>
												</el-button>
												<form method="post" id="file" action="" enctype="multipart/form-data" style="float: right; position: relative; margin-left: 10px;">
													<el-button type="primary" size="mini" round class="a-upload">
														<i class="el-icon-upload2"></i>
														<font>上传</font>
														<input id="excelFile" type="file" name="uploadFile" @change="upload"/>
													</el-button>
												</form>
											</div>
										<el-table :header-cell-style="rowClass" :fit="true" :data="CUSTOMER.CUSTOMER_QUALIFICATIONList" row-key="ID" border stripe max-height="260" highlight-current-row style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'CUSTOMER.CUSTOMER_QUALIFICATIONList', order: 'descending'}">
										    <el-table-column prop="iconOperation" fixed width="50px" v-if="!viewtitle">
										      <template slot-scope="scope">
										      	<i class="el-icon-check" v-show="scope.row.isEditing">
										      	</i>
										      	<i class="el-icon-edit" v-show="!scope.row.isEditing">
										      	</i>
										      </template>
										    </el-table-column>

										    <el-table-column label="序号" sortable width="100px" prop="STEP" type="index">
										    </el-table-column>

										    <el-table-column label="证书编号" sortable width="120px" prop="CERTIFICATE_NUM">
										      <template slot-scope="scope">
										      	<el-form-item :prop="'CUSTOMER_QUALIFICATIONList.'+scope.$index + '.CERTIFICATE_NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
											      	<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.CERTIFICATE_NUM" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.CERTIFICATE_NUM}}</span>
											      </el-form-item>
										      </template>
										    </el-table-column>

											<el-table-column prop="CERTIFICATE_NAME" label="证书名称" sortable>
										      <template slot-scope="scope">
										         <el-form-item :prop="'CUSTOMER_QUALIFICATIONList.'+scope.$index + '.CERTIFICATE_NAME'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
											         <el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.CERTIFICATE_NAME" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.CERTIFICATE_NAME}}</span>
											     </el-form-item>
										      </template>
										    </el-table-column>

										    <el-table-column prop="ACTIVE_DATE" label="资质有效期" sortable width="160">
										      <template slot-scope="scope">
										      	<el-form-item :prop="'CUSTOMER_QUALIFICATIONList.'+scope.$index + '.ACTIVE_DATE'" :rules="{required: true, message: '不能为空', trigger: 'change'}">
											      	<el-form-item :prop="'CUSTOMER_QUALIFICATIONList.'+scope.$index + '.ACTIVE_DATE'" >
											         <el-date-picker style="width: 90%" v-show="scope.row.isEditing" v-model="scope.row.ACTIVE_DATE" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
											        <span v-show="!scope.row.isEditing" >{{scope.row.ACTIVE_DATE}}</span>
											    </el-form-item>
										    </el-form-item>
										      </template>
										    </el-table-column>
										    <!-- <el-table-column prop="STATUS" label="信息状态" sortable width="120px">
										      <template slot-scope="scope">
										        <el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.STATUS" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.STATUS}}</span>
										      </template>
										    </el-table-column> -->
											<el-table-column prop="FILESIZE" label="附件大小" sortable width="120px" v-if="!viewtitle">
												<template slot-scope="scope">
													<span v-if="!!scope.row.FILESIZE">{{scope.row.FILESIZE+'M'}}</span>
												</template>
										    </el-table-column>

										    <el-table-column prop="MEMO" label="备注" sortable width="120px">
										      <template slot-scope="scope">
										        <el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.MEMO" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.MEMO}}</span>
										      </template>
										    </el-table-column>

										    <el-table-column fixed="right" label="操作" width="120" v-if="!viewtitle">
										      <template slot-scope="scope">
										        <el-button @click = "deleteRow(scope.$index,scope.row,'tableList')" type="text" size="small">
										          <i class="icon-trash red"></i>
										        </el-button>
										      </template>
										    </el-table-column>
										  </el-table>
									  <!-- </el-form> -->
										</el-tab-pane>
										<el-tab-pane name="second">
											<span slot="label"><i class="red">*</i> 客户联系人</span>
											<div class="table-func table-funcb">
												<el-button type="success" size="mini" round @click="addrela" v-show="!viewtitle">
													<i class="icon-add"></i>
													<font>新建行</font>
												</el-button>
											</div>
												<el-table :header-cell-style="rowClass" :fit="true" :data="CUSTOMER.CUSTOMER_PERSONList" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'CUSTOMER.CUSTOMER_PERSONList', order: 'descending'}">
												    <el-table-column prop="iconOperation" fixed width="50px" v-if="!viewtitle">
												      <template slot-scope="scope">
												      	<i class="el-icon-check" v-show="scope.row.isEditing">
												      	</i>
												      	<i class="el-icon-edit" v-show="!scope.row.isEditing">
												      	</i>
												      </template>
												    </el-table-column>

												    <!-- <el-table-column label="序号" sortable width="120px" prop="STEP">
												      <template slot-scope="scope">
												      	<el-form-item :prop="'CUSTOMER_PERSONList.'+scope.$index + '.STEP'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
													      	<el-input v-show="scope.row.isEditing" size="small" v-model="scope.$index + 1" :disabled="noedit"></el-input>
													      	<span v-show="!scope.row.isEditing" >{{scope.row.STEP}}</span>
													      </el-form-item>
												      </template>
												    </el-table-column> -->

												    <el-table-column label="联系人" sortable width="150px" prop="PERSON">
												      <template slot-scope="scope">
												      	<el-form-item :prop="'CUSTOMER_PERSONList.'+scope.$index + '.PERSON'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
													      	<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.PERSON" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.PERSON}}</span>
													      </el-form-item>
												      </template>
												    </el-table-column>

													<el-table-column prop="PHONE" label="联系电话" sortable width="150px">
												      <template slot-scope="scope">
												      	<el-form-item :prop="'CUSTOMER_PERSONList.'+scope.$index + '.PHONE'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
													         <el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.PHONE" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.PHONE}}</span>
													     </el-form-item>
												      </template>
												    </el-table-column>

												    <el-table-column prop="FAX" label="传真" sortable width="150px">
												       <template slot-scope="scope">
												         <el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.FAX" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.FAX}}</span>
												      </template>
												    </el-table-column>
												    <el-table-column prop="EMAIL" label="邮箱" sortable>
												      <template slot-scope="scope">
												      	<el-form-item :prop="'CUSTOMER_PERSONList.'+scope.$index + '.EMAIL'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
													    	<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.EMAIL" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.EMAIL}}</span>
													    </el-form-item>
												      </template>
												    </el-table-column>

												    <el-table-column fixed="right" label="操作" width="120" v-if="!viewtitle">
												      <template slot-scope="scope">
												        <el-button @click = "deleteRow(scope.$index,scope.row,'mainList')" type="text" size="small">
												         <i class="icon-trash red"></i>
												        </el-button>
												      </template>
												    </el-table-column>
												  </el-table>
										</el-tab-pane>
									</el-tabs>
								</div>
								<el-collapse-item title="其它" name="3" v-show="views">
									<!-- <el-form label-width="100px"> -->
										<el-row :gutter="30">
											<el-col :span="8">
												<el-form-item label="录入人" prop="ENTERBYDesc" label-width="100px">
													<el-input v-model="CUSTOMER.ENTERBYDesc" placeholder="当前录入人" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="录入时间" prop="ENTERDATE" label-width="100px">
													<el-input v-model="CUSTOMER.ENTERDATE" placeholder="当前录入时间" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8" v-if="dept">
												<el-form-item label="机构" prop="DEPTIDDesc" label-width="100px">
													<el-input v-model="CUSTOMER.DEPTIDDesc" placeholder="当前录入人机构" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
										</el-row>
										<el-row :gutter="30">
											<el-col :span="8">
												<el-form-item label="修改人" prop="CHANGEBYDesc" label-width="100px">
													<el-input v-model="CUSTOMER.CHANGEBYDesc" placeholder="当前修改人" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="修改时间" prop="CHANGEDATE" label-width="100px">
													<el-input v-model="CUSTOMER.CHANGEDATE" placeholder="当前修改时间" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
										</el-row>
									<!-- </el-form> -->
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
			</div>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import { Loading } from 'element-ui'
	export default {
		name: 'customer_masks',
		data() {
			return {
				changeflag:false,
				wi:1,
				file_url: Config.file_url,
				basic_url: Config.dev_url,
				personinfo:false,
				loadSign:true,//加载
				commentArr:{},
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				Selectsys_depttype:[],//获取机构类型
				selUser:[],
				modify:false,
				statusshow1:true,
				statusshow2:false,
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				addtitle:true,//添加弹出框titile
				modifytitle:false,//修改弹出框titile
				viewtitle:false,//查看弹出框titile
				activeName: 'first', //tabs
				activeNames: ['1','2','3'],//手风琴数量
				labelPosition: 'right', //表单文本左对齐
				dialogVisible: false, //对话框
				selectData:[],
				fileList: [],
				CUSTOMER:{
					CUSTOMER_QUALIFICATIONList:[],
					CUSTOMER_PERSONList:[]
				},
				rules: {
					//统一社会信息代码
					CODE:[
						{required: true, message: '必填', trigger: 'blur'},
						{validator: this.Validators.isCompanyCode, trigger: 'blur'}
					],
					NAME:[
						{required: true,message: '必填',trigger: 'blur'},
						{validator: this.Validators.isNickname, trigger: 'blur'}
					],
					CONTACT_ADDRESS:[
						{required: true,message: '必填',trigger: 'blur'},
						{validator: this.Validators.isSpecificKey, trigger: 'blur'}
					],
					MEMO:[{required: false,trigger: 'blur',validator: this.Validators.isSpecificKey}],
					ZIPCODE:[{required: false,trigger: 'blur',validator: this.Validators.isZipcode}],
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				page: {//分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				falg:true,
				index:0,
				dept:false,
				noedit:false,//可编辑
				views:false,//录入修改人信息
				noviews:true,//按钮
				modify:false,//修订
				hintshow:false,
				statusshow1:true,
				statusshow2:false,
				docParam:{}
			};
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			handleClick(tab, event) {
			},
			iconOperation(row, column, cell, event){
		        if(column.property ==="iconOperation"){
		          row.isEditing = !row.isEditing
		        }
		    },
            
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			//生成随机数函数
			rand(min,max) {
		        return Math.floor(Math.random()*(max-min))+min;
		    },
			//新建行
			addfield(){
				var obj = {
					STEP:'',
					CERTIFICATE_NUM:'',
					CERTIFICATE_NAME:'',
					ACTIVE_DATE:'',
					STATUS:'',
					MEMO:'',
					FILEID: '',
					FILENAME: '',
					FILEPATH: '',
					isEditing: true
				};
				this.CUSTOMER.CUSTOMER_QUALIFICATIONList.push(obj);
			},
			//新建行
			addrela(){
				var obj = {
					ID:'',
					CODE:'',
					PERSON:'',
					PHONE:'',
					FAX:'',
					EMAIL:'',
					STATUS:'',
					MEMO:'',
					ENTERBY:'',
					ENTERDATE:'',
					CHANGEBY:'',
					CHANGEDATE:'',
					DEPTID:'',
					isEditing: true
                };
                this.CUSTOMER.CUSTOMER_PERSONList.push(obj);
			},
			//删除行
			deleteRow(index, row, listName){
				var TableName = '';
				if(listName =='tableList'){
					TableName = 'CUSTOMER_QUALIFICATION';
				}else{
					TableName = 'CUSTOMER_PERSON';
				}
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/customer/' + TableName +'/' + row.ID;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {}).then((res) => {
							
							if(res.data.resp_code == 0){
								this.CUSTOMER[TableName+'List'].splice(index,1);
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
					this.CUSTOMER[TableName+'List'].splice(index,1);
				}
			},
		
			//生成随机数函数
			rand(min,max) {
		        return Math.floor(Math.random()*(max-min))+min;
		    },
		    //清空
            reset(){
            	this.CUSTOMER={
					ID:'',
					CODE:'',
					NAME:'',
					CONTACT_ADDRESS:'',
					PHONE:'',
					PERSON:'',
					TYPE:'',
					ZIPCODE:'',
					STATUS:'活动',
//					STATUSDesc:'
					FAX:'',
					EMAIL:'',
					ENTERBY:'',
					ENTERDATE:'',
					CHANGEBY:'',
					CHANGEDATE:'',
					DEPTID:'',
					MEMO:'',
					CUSTOMER_QUALIFICATIONList:[],
					CUSTOMER_PERSONList:[]
				};
			},
			getUser(opt){
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
	    			this.CUSTOMER.ENTERBY = res.data.id;
					this.CUSTOMER.DEPTID = res.data.deptId;
					if(opt == 'detail'){
						var date = new Date();
						this.CUSTOMER.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					}
					this.docParam = {
						username: res.data.username,
						userid:  res.data.id,
						deptid: res.data.deptId,
						deptfullname: res.data.deptName,
					};
				}).catch((err) => {
				});
			},	
			//点击添加，修改按钮显示弹窗
			visible() {
				this.reset();
				this.addtitle = true;
				this.modifytitle = false;
				this.viewtitle = false;
				this.dept = false;
				this.noedit = false;//表单内容
				this.views = false;//录入修改人信息
				this.noviews = true;//按钮
				this.modify = false;//修订
				this.hintshow = false;
				this.statusshow1 = true;
				this.statusshow2 = false;
				var date = new Date();
				this.CUSTOMER.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				this.getUser('visible');
				// this.show = true;
			},
			getsys_depttype() {//获取机构类型
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=CUST_TYPE';
				this.$axios.get(url, {}).then((res) => {
					this.SeleCUST_TYPE = res.data;
				}).catch(error => {
					console.log('请求失败');
				})
			},
			// 这里是修改
			detail(dataid) {
			  this.wi=1;
				this.addtitle = false;
				this.modifytitle = true;
				this.viewtitle = false;
				this.dept = true;
				this.noedit = false;//表单内容
				this.views = false;//录入修改人信息
				this.noviews = true;//按钮
				this.hintshow = false;
				this.modify = true;//修订
				this.statusshow1 = false;
				this.statusshow2 = true;
				this.getUser('detail');
				this.$axios.get(this.basic_url + '/api-apps/app/customer/' + dataid, {}).then((res) => {
					//资质
					for(var i = 0;i<res.data.CUSTOMER_QUALIFICATIONList.length;i++){
						res.data.CUSTOMER_QUALIFICATIONList[i].isEditing = false;
					}
					//客户联系人
					for(var i = 0;i<res.data.CUSTOMER_PERSONList.length;i++){
						res.data.CUSTOMER_PERSONList[i].isEditing = false;
					}
					this.CUSTOMER = res.data;
					this.CUSTOMER.STATUS=this.CUSTOMER.STATUS=="1"? '活动' : '不活动';
					this.show = true;
				}).catch((err) => {
				});
			},
			//这是查看
			view(dataid) {
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.dept = true;
				this.noedit = true;//表单内容
				this.views = true;//录入修改人信息
				this.noviews = false;//按钮
				this.$axios.get(this.basic_url + '/api-apps/app/customer/' + dataid, {}).then((res) => {
					this.CUSTOMER = res.data;
					this.CUSTOMER.STATUS=this.CUSTOMER.STATUS=="1"? '活动' : '不活动';
					this.show = true;
				}).catch((err) => {
				});
				this.show = true;				
			},
			//点击关闭
			close() {
				this.show = false;
				this.$emit('request');
			},
			open(){
				this.show = true;
			},
			//弹出框放大缩小变换
			toggle(e) {
				if(this.isok1 == true) {
					this.maxDialog();
				} else {
					this.rebackDialog();
				}
			},
			//放大按钮
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
			// 保存users/saveOrUpdate
			save(parameter) {
				this.$refs.CUSTOMER.validate((valid) => {
		          if (valid) {
					if(this.CUSTOMER.CUSTOMER_QUALIFICATIONList.length==0 || this.CUSTOMER.CUSTOMER_PERSONList.length == 0){
						this.$message({
							message: '资质信息及客户联系人必填',
							type: 'warning',
						});
					}else{
						this.CUSTOMER.STATUS=this.CUSTOMER.STATUS=="活动" ? '1' : '0';
						var url = this.basic_url + '/api-apps/app/customer/saveOrUpdate';
						this.$axios.post(url, this.CUSTOMER).then((res) => {
							//resp_code == 0是后台返回的请求成功的信息
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								if(parameter=="Update"){
									this.show = false;
								}else{
									this.show = true;
									this.$emit('request');
								};
						   this.$refs["CUSTOMER"].resetFields();
							}
						}).catch((err) => {
						});
					}
		          } else {
		            this.show = true;
						this.$message({
							message: '有必填项未填写，请重新填写',
							type: 'warning',
						});
		          	}
						});
			},
			
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
			upload(e){
				var list = this.CUSTOMER.CUSTOMER_QUALIFICATIONList || [];
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
				var url = this.file_url + '/file/uploadfile?userid=' + this.docParam.userid 
						+ '&username=' + this.docParam.username
						+ '&deptid=' + this.docParam.deptid
						+ '&deptfullname=' + this.docParam.deptfullname
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
						this.CUSTOMER.CUSTOMER_QUALIFICATIONList[index].FILEID = res.data.fileid;
						this.CUSTOMER.CUSTOMER_QUALIFICATIONList[index].FILESIZE = res.data.filesize;
						this.CUSTOMER.CUSTOMER_QUALIFICATIONList[index].FILEPATH = res.data.webUrl;
						this.$set(this.CUSTOMER.CUSTOMER_QUALIFICATIONList,index,this.CUSTOMER.CUSTOMER_QUALIFICATIONList[index]); 
					}
				})
			}
		},
		mounted() {
			this.getsys_depttype();//页面打开加载-机构类型
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
	.a-upload input{
		position: absolute;
		font-size: 0px;
		font-size: 24px \9;
		right: 0px;
		top: 0;
		opacity: 0;
		filter: alpha(opacity=0);
		cursor: pointer;
		width: 100%;
		height: 30px;
		cursor: pointer;
	}
</style>