<template>
<!-- 使用/维护保养记录 -->
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
			<!-- <div class="mask_content"> -->
                <div class="mask_title_div clearfix">
                	<div class="mask_title" v-show="addtitle">添加使用/维护保养记录</div>
					<div class="mask_title" v-show="modifytitle">修改使用/维护保养记录</div>
					<div class="mask_title" v-show="viewtitle">查看使用/维护保养记录</div>
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
					<el-form inline-message :model="dataInfo" :rules="rules" ref="dataInfo" class="demo-user">
						<div class="content-accordion">
							<!-- 设备header信息 -->
							<el-collapse v-model="activeNames">							
	                            <el-collapse-item title="基本信息" name="1">
	                                <el-form-item label-width="120px" v-for="item in basicInfo" :key="item.id" :label="item.label" :prop="item.prop" :style="{ width: item.width, display: item.displayType}">
										<el-select v-model="dataInfo[item.prop]" filterable placeholder="请选择" v-if="item.type == 'select'" @change="selChange" :disabled="noedit">
											<el-option v-for="item in item.option"
											:key="item.ID"
											:label="item.ASSETNUM"
											:value="item.ID">
											</el-option>
										</el-select>
	                                    <el-input v-model="dataInfo[item.prop]" :type="item.type" disabled v-if="item.type == 'input'"></el-input>
	                                </el-form-item>
	                            </el-collapse-item>
	                            <!-- 使用记录、维护保养 Begin-->
								<div class="el-collapse-item pt10 pr20 pb20 ml60" aria-expanded="true" accordion>
									<el-tabs v-model="activeName" @tab-click="handleClick">
									    <el-tab-pane label="设备使用记录信息" name="first">
									    	<div class="table-func table-funcb">
										<el-button type="success" size="mini" round @click="addLine('tableList')" v-show="!viewtitle">
											<i class="icon-add"></i>
											<font>新建行</font>
										</el-button>
									</div>
									<el-table :header-cell-style="rowClass" :data="dataInfo.tableList" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" :default-sort="{prop:'dataInfo.pmRecord', order: 'descending'}">
										<el-table-column prop="iconOperation" fixed label="" width="50px">
											<template slot-scope="scope">
												<i class="el-icon-check" v-if="scope.row.isEditing"  @click="changeEdit(scope.row)"></i>
												<i class="el-icon-edit" v-else @click="changeEdit(scope.row)"></i>
											</template>
										</el-table-column>
	                                    <el-table-column type="index" sortable label="序号" width="50">
	                                    </el-table-column>
										<el-table-column prop="USEDATE" label="使用日期" sortable width="120px">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.USEDATE'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
													<el-date-picker v-if="scope.row.isEditing" size="small" v-model="scope.row.USEDATE" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
	                                                </el-date-picker>
	                                                <span v-else>{{scope.row.USEDATE}}</span>
												</el-form-item>
											</template>
										</el-table-column>
										<el-table-column prop="S_NUM" label="样品编号" sortable width="120px">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.S_NUM'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.S_NUM" placeholder="请输入样品编号">
														<el-button slot="append" icon="icon-search" @click="changeNum(scope.row)"></el-button>
													</el-input>
	                                                <span v-else>{{scope.row.S_NUM}}</span>
												</el-form-item>
											</template>
										</el-table-column>
	                                    <!-- 项目名称无 -->
										<el-table-column prop="USE_START" label="使用起始时间" sortable width="120px">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.USE_START'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-date-picker v-if="scope.row.isEditing" size="small" v-model="scope.row.USE_START" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
	                                                </el-date-picker>
	                                                <span v-else>{{scope.row.USE_START}}</span>
												</el-form-item>
											</template>
										</el-table-column>
	                                    <el-table-column prop="USE_END" label="使用终止时间" sortable width="120px">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.USE_END'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-date-picker v-if="scope.row.isEditing" size="small" v-model="scope.row.USE_END" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
	                                                </el-date-picker>
	                                                <span v-else>{{scope.row.USE_END}}</span>
												</el-form-item>
											</template>
										</el-table-column>
	                                    <el-table-column prop="ASSETOPRATION" label="设备运行情况" sortable width="120px">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.ASSETOPRATION'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.ASSETOPRATION" placeholder="请输入设备运行情况">
	                                                </el-input>
	                                                <span v-else>{{scope.row.ASSETOPRATION}}</span>
												</el-form-item>
											</template>
										</el-table-column>
	                                    <el-table-column prop="USE_PERSON" label="使用人" sortable width="100px">
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.USE_PERSON'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.USE_PERSON" placeholder="请输入使用人">
	                                                </el-input>
	                                                <span v-else>{{scope.row.USE_PERSON}}</span>
												</el-form-item>
											</template>
										</el-table-column>
	                                    <el-table-column prop="MEMO" label="备注" sortable>
											<template slot-scope="scope">
												<el-form-item :prop="'tableList.'+scope.$index + '.MEMO'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.MEMO" placeholder="请输入备注">
	                                                </el-input>
	                                                <span v-else>{{scope.row.MEMO}}</span>
												</el-form-item>
											</template>
										</el-table-column>
										<el-table-column label="操作" sortable width="70px">
											<template slot-scope="scope">
												<el-button type="danger" size="mini" round  @click="delLine(scope.$index,scope.row,'tableList')" :disabled="noedit">
													<i class="el-icon-delete"></i>
												</el-button>
											</template>
										</el-table-column>
									</el-table>
									    </el-tab-pane>
									    <el-tab-pane label="设备维护保养记录信息" name="second">
									    	<div class="table-func table-funcb">
										<el-button type="success" size="mini" round @click="addLine('maintenList')" v-show="!viewtitle">
											<i class="icon-add"></i>
											<font>新建行</font>
										</el-button>
									</div>
									<el-table :header-cell-style="rowClass" :data="dataInfo.maintenList" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" :default-sort="{prop:'dataInfo.pmRecord', order: 'descending'}">
										<el-table-column prop="iconOperation" fixed width="50px">
											<template slot-scope="scope">
												<i class="el-icon-check" v-if="scope.row.isEditing"  @click="changeEdit(scope.row)"></i>
												<i class="el-icon-edit" v-else  @click="changeEdit(scope.row)"></i>
											</template>
										</el-table-column>
	                                    <el-table-column type="index" sortable label="序号" width="50">
	                                    </el-table-column>
										<el-table-column prop="PROJECT" label="维护项目" sortable width="120px">
											<template slot-scope="scope">
												<el-form-item :prop="'maintenList.'+scope.$index + '.PROJECT'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.PROJECT" placeholder="请输入维护项目">
	                                                </el-input>
	                                                <span v-else>{{scope.row.PROJECT}}</span>
												</el-form-item>
											</template>
										</el-table-column>
										<el-table-column prop="W_DATE" label="维护时间" sortable>
											<template slot-scope="scope">
												<el-form-item :prop="'maintenList.'+scope.$index + '.W_DATE'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                 <el-date-picker v-if="scope.row.isEditing" size="small" v-model="scope.row.W_DATE" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
	                                                </el-date-picker>
	                                                <span v-else>{{scope.row.W_DATE}}</span>
												</el-form-item>
											</template>
										</el-table-column>
	                                    <el-table-column prop="W_PERSON" label="维护人" sortable>
											<template slot-scope="scope">
												<el-form-item :prop="'maintenList.'+scope.$index + '.W_PERSON'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
	                                                <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.W_PERSON" placeholder="请输入维护人">
	                                                </el-input>
	                                                <span v-else>{{scope.row.W_PERSON}}</span>
												</el-form-item>
											</template>
										</el-table-column>
										<el-table-column label="操作" sortable width="70px">
											<template slot-scope="scope">
												<el-button type="danger" size="mini" round  @click="delLine(scope.$index,scope.row,'maintenList')" :disabled="noedit">
													<i class="el-icon-delete"></i>
												</el-button>
											</template>
										</el-table-column>
									</el-table>
									    </el-tab-pane>
									</el-tabs>
								</div>
								<!-- 使用记录、维护保养 End-->
	                            <el-collapse-item title="其他" name="4" v-show="!addtitle">
	                            	<el-form-item label-width="120px" v-for="item in otherInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}" v-if="item.prop=='DEPARTMENT'" v-show="dept">
	                                    <el-input v-model="dataInfo[item.prop]" :type="item.type" disabled v-if="item.prop=='DEPARTMENT'"></el-input>
	                                </el-form-item>	
	                                <el-form-item label-width="120px" v-for="item in otherInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}" v-show="views">
	                                    <el-input v-if="item.type=='input'" v-model="dataInfo[item.prop]" :type="item.type" disabled></el-input>
	                                    <el-date-picker v-model="dataInfo[item.prop]" value-format="yyyy-MM-dd" v-if="item.type=='date'" disabled style="width:100%"></el-date-picker>
	                                </el-form-item>	
	                            </el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="saveAndUpdate('dataInfo')">保存</el-button>
							<el-button type="success" @click="saveAndSubmit('dataInfo')" v-show="addtitle">保存并继续</el-button>
							<el-button @click="close">取消</el-button>
							<!-- <el-button type="primary" @click='submitForm'>提交</el-button> -->
						</div>
					</el-form>
				</div>
			<!--底部-->
			</div>
			<el-dialog :modal-append-to-body="false" title=样品编号 :visible.sync="sampleDialog" width="80%" :before-close="resetSample">
				<div class="pb10">
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="10" class="pb10">
							<el-col :span="6">
								<el-input v-model="searchList.DESCRIPTION">
									<template slot="prepend">样品名称</template>
								</el-input>
							</el-col>
							<el-col :span="2">
								<el-button type="primary" @click="searchSam" size="small" style="margin:4px">搜索</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<el-table :data="sampleList" border stripe style="width: 100%;" @selection-change="selNum" :default-sort="{prop:'sampleList', order: 'descending'}">
					<el-table-column type="selection" width="55" fixed>
					</el-table-column>
					<el-table-column label="样品编号" sortable prop="ITEMNUM">
					</el-table-column>
					<el-table-column label="样品名称" sortable prop="DESCRIPTION">
					</el-table-column>
				</el-table>
				<div slot="footer" class="el-dialog__footer">
			       <el-button type="primary" @click="addSample">确 定</el-button>
			       <el-button @click="resetSample">取 消</el-button>
			    </div>
			</el-dialog> 
			<!-- 设备编号弹出框 end-->
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	export default {
		name: 'masks',
		props: ['detailData'],
		data() {
			return {
				sampleDialog: false,
				rules: {
					ASSETNUM: [
						{ required: true, trigger: 'blur', validator: this.Validators.isChoosedata },
					]
				},
				basicInfo: [
                    {
                        label: '设备编号',
                        prop: 'ASSETNUM',
                        width: '30%',
						type: 'select',
						option: [],
                        displayType: 'inline-block'
                    },
                    {
                        label: '设备名称',
                        prop: 'DESCRIPTION',
                        width: '30%',
                        type: 'input',
                        displayType: 'inline-block'
                    },
                    {
                        label: '规格型号',
                        prop: 'MODEL',
                        width: '30%',
                        type: 'input',
                        displayType: 'inline-block'
                    },
                    // {
                    //     label: '设备状态',
                    //     prop: 'STATE',
                    //     width: '30%',
                    //     type: 'input',
                    //     displayType: 'inline-block'
                    // },
                    {
                        label: '保管人',
                        prop: 'KEEPER',
                        width: '30%',
                        type: 'input',
                        displayType: 'inline-block'
                    }
                ],
                otherInfo: [
                    {
                        label: '录入人',
                        prop: 'ENTERBYDesc',
                        width: '30%',
                        type: 'input',
                        displayType: 'inline-block'
                    },
                    {
                        label: '机构',
                        prop: 'DEPTIDDesc',
                        width: '30%',
                        type: 'input',
                        displayType: 'inline-block'
                    },
                    {
                        label: '录入时间',
                        prop: 'ENTERDATE',
                        width: '30%',
                        type: 'date',
                        displayType: 'inline-block'
                    },
                    {
						label: '修改人',
						prop: 'CHANGEBYDesc',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
					{
						label: '修改时间',
						prop: 'CHANGEDATE',
						width: '30%',
						type: 'date',
						displayType: 'inline-block'
					}
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
				selectData: [], //
				getCheckboxData: {},

				dataInfo: {
					'ID': '',  //主键ID，必填但页面没有字段
					'ASSETNUM': '',
					'DESCRIPTION': '',
					'MODEL': '',
					'STATE': '',    
					'KEEPER': '',
					'tableList': [],
					'maintenList': []
				},
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				sampleList: [],
				selSample: [],
				selRow: {},
				searchList: {
					'DESCRIPTION': ''
				},
				activeName: 'first',//tabs
				addtitle:true,
				modifytitle:false,
				viewtitle:false,
				dept:false,
				noedit:false,//可编辑
				views:false,//录入修改人信息
				noviews:true,//按钮
				modify:false,//修订
				hintshow:false,
				statusshow1:true,
				statusshow2:false,
			};
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
				return 'text-align:center'
			},
			//tabs
			handleClick(tab, event) {
		    },
			searchSam(){
				this.page.currentPage = 1;
				this.page.pageSize = 10;
				this.getSamples();
			},
			sizeChange(val) {
				this.page.pageSize = val;
				this.getSamples();
			},
			currentChange(val) {
				this.page.currentPage = val;
				this.getSamples();
			},
			selNum(val){
				this.selSample = val;
			},
			addSample(){
				if(this.selSample.length==0){
					this.$message({
						message: '请选择样本编号',
						type: 'error'
					});
				}else if(this.selSample.length>1){
					this.$message({
						message: '不可同时选择多条数据',
						type: 'error'
					});
				}else{
					this.selRow.S_NUM = this.selSample[0].ITEMNUM;
					this.resetSample();
				}
			},
			resetSample(){
				this.sampleDialog = false;
				this.page = {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				};
				this.searchList.DESCRIPTION = '';
			},
			changeNum(row){
				this.selRow = row;
				this.getSamples();
			},
			getSamples(){
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					DESCRIPTION: this.searchList.DESCRIPTION,//样品名称
				}
				var url = this.basic_url + '/api-apps/app/item';
				this.$axios.get(url,{
					params: data
				}).then((res) => {
					this.sampleList = res.data.data;
					this.page.totalCount = res.data.count;
					this.sampleDialog = true;
				}).catch((err) => {
				});
			},
			getUser(){
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url,{}).then((res) => {
						this.dataInfo.DEPTID = res.data.deptId;
						this.dataInfo.ENTERBY = res.data.id;
				        // this.dataInfo.ENTERBY = res.data.username;
				        this.dataInfo.ENTERDATE = this.getToday();
				}).catch((err) => {
					this.$message({
						message: '网络错误，请重试',
						type: 'error'
					});
				});
			},
			getModiuser(){
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url,{}).then((res) => {
						this.dataInfo.DEPTID = res.data.deptId;//传给后台机构id
						this.dataInfo.CHANGEBY = res.data.id;
				        this.dataInfo.CHANGEDATE = this.getToday();
						// this.dataInfo.DEPARTMENT = res.data.deptName;
				}).catch((err) => {
				});
			},
			getToday(){
				var date = new Date();
				var str = date.getFullYear() + '-' + date.getMonth() + '-'+ date.getDate();
				var rate = this.$moment(str).format("yyyy-MM-dd HH:mm:ss")
				return rate;
			},
			changeEdit(row){
				row.isEditing = !row.isEditing;
			},
			addLine(listName){
				if(listName == 'tableList'){
					this.dataInfo.tableList.push({
						ID: '',
						ASSETNUM: this.dataInfo.ASSETNUM,
						USEDATE: '',
						S_NUM: '',
						USE_START: '',
						USE_END: '',
						ASSETOPRATION: '',
						USE_PERSON: '',		
						MEMO: '',
						isEditing: true
					});
				}else{
					this.dataInfo[listName].push({
						ID: '',
						ASSETNUM: this.dataInfo.ASSETNUM,
						PROJECT: '',	
						W_DATE: '',	
						W_PERSON: '',
						isEditing: true
					});
				}
			},
			delLine(index, row, listName){
				var TableName = '';
				if(listName=='tableList'){
					TableName = 'ASSET_USE';
				}else{
					TableName = 'ASSET_MAINTENANCE';
				}
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/asset2/' + TableName +'/' + row.ID;
					this.$axios.delete(url, {}).then((res) => {
						if(res.data.resp_code == 0){
							this.dataInfo[listName].splice(index,1);
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'error'
							});
						}
					}).catch((err) => {
					});
				}else{
					this.dataInfo[listName].splice(index,1);
				}
			},
			selChange(val){
				var data = this.basicInfo[0].option;
				var selData = data.filter(function(item){
					if(item.ID == val){
						return item;
					}
				});
				this.dataInfo = selData[0];
				this.dataInfo.tableList = [];
				this.dataInfo.maintenList = [];
			},
			//添加显示弹窗
			visible() {
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
				this.show = true;
				this.getUser();
			},
			// 这里是修改
			detail() {
				var ID = this.detailData.ID;
				var url = this.basic_url + '/api-apps/app/asset2/' + ID;
				this.$axios.get(url, {}).then((res) => {
					this.modify = true;
					this.show = true;
					this.dataInfo = res.data;
					this.dataInfo.tableList = this.dataInfo.ASSET_USEList;
					this.dataInfo.maintenList = this.dataInfo.ASSET_MAINTENANCEList;
				}).catch((wrong) => {});
				this.getModiuser();
				this.addtitle = false;
				this.modifytitle = true;
				this.viewtitle = false;
				this.dept = true;
				this.noedit = false;//表单内容
				this.views = false;//录入修改人信息
				this.noviews = true;//按钮
				this.modify = true;
				this.hintshow = false;
				this.statusshow1 = true;
				this.statusshow2 = false;
				this.show = true;
			},
			//这是查看
			view(dataid) {
				var url = this.basic_url + '/api-apps/app/asset2/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					// this.modify = true;
					// this.show = true;
					this.dataInfo = res.data;
					this.dataInfo.tableList = this.dataInfo.ASSET_USEList;
					this.dataInfo.maintenList = this.dataInfo.ASSET_MAINTENANCEList;
				}).catch((wrong) => {});
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.dept = false;
				this.modify = true;
				this.noedit = true;//表单内容
				this.views = true;//录入修改人信息
				this.noviews = false;//按钮
				// this.dataInfo = data;
				this.show = true;				
			},
			//点击关闭按钮
			close() {
				this.resetForm();
				this.$emit('request');
				this.show = false;
			},
			resetForm(){
				this.dataInfo =  {
					'tableList': [],
					'maintenList': []
				};
				//this.$refs['dataInfo'].resetFields();
				// this.show = false;
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
			save(dataInfo) {
				var _this = this;
				var url = this.basic_url + '/api-apps/app/asset2/saveOrUpdate';
				this.$refs['dataInfo'].validate((valid) => {
					if (valid) {
						if(this.dataInfo.tableList.length==0 || this.dataInfo.maintenList.length == 0){
							this.$message({
								message: '表格信息为必填内容',
								type: 'warning',
							});
						}else{
							this.dataInfo.ASSET_USEList = this.dataInfo.tableList;
							this.dataInfo.ASSET_MAINTENANCEList = this.dataInfo.maintenList;
							this.$axios.post(url, _this.dataInfo).then((res) => {
								if(res.data.resp_code == 0) {
									this.$message({
										message: '保存成功',
										type: 'success',
									});
									
									this.$emit('request');
									this.resetForm();
								}
							}).catch((err) => {
							});
							this.falg=true;
						}
					} else {
						this.show = true;
						this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
						this.falg=false;
					}
				});
			},
			saveAndUpdate(dataInfo) {
				this.save(dataInfo);
				if(this.falg){
					this.show = false;
				}
			},
			saveAndSubmit(dataInfo) {
				this.save(dataInfo);
				this.show = true;
			},
		},
		mounted() {
			var url = this.basic_url + '/api-apps/app/asset2';
			this.$axios.get(url, {
				params: {}
			}).then((res) => {
				this.basicInfo[0].option = res.data.data;
			}).catch((wrong) => {})
		},

	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>