<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加仪器和计量器具</div>
					<div class="mask_title" v-show="modifytitle">修改仪器和计量器具</div>
					<div class="mask_title" v-show="viewtitle">查看仪器和计量器具</div>
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
					<el-form inline-message :model="dataInfo" :rules="rules" ref="dataInfo" label-width="120px" class="demo-user">
						<div class="content-accordion">
							<!-- 设备基本信息 -->
							<el-collapse v-model="activeNames">
								<el-collapse-item title="设备基本信息" name="1">
									<el-row :gutter="20" class="pb10">
										<el-col :span="5" class="pull-right">
											<el-input v-model="dataInfo.ASSETNUM" :disabled="true">
												<template slot="prepend">设备编号</template>
											</el-input>
										</el-col>
										<!-- <el-col :span="5" class="pull-right">
											<el-input v-model="dataInfo.STATUS==1?'活动':'不活动'" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input>
										</el-col> -->
									</el-row>
									<el-form-item v-for="item in basicInfo" :key="item.id" :label="item.label" :prop="item.prop" :style="{ width: item.width, display: item.displayType}">
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input' && item.prop !='A_PRICE' && item.prop !='TYPE' && item.prop !='ASSET_STATUS' && item.prop !='CONFIG_UNITDes' && item.prop !='ISPERIODIC'&& item.prop !='ASSET_NUMBER'" :disabled="noedit"></el-input>
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input' && (item.prop =='ASSET_STATUS' || item.prop =='CONFIG_UNITDes' || item.prop =='ISPERIODIC' || item.prop =='ASSET_NUMBER')" disabled></el-input>
										<!--设备分类-->
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input' && (item.prop =='TYPE')" :disabled="true">
											<el-button slot="append" :disabled="noedit" icon="el-icon-search" @click="addAsset"></el-button>
										</el-input>
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='textarea'" :disabled="noedit"></el-input>
										<el-date-picker v-model="dataInfo[item.prop]" value-format="yyyy-MM-dd" v-if="item.type=='date'" :disabled="noedit">
										</el-date-picker>
										<el-radio-group v-model="dataInfo[item.prop]" v-if="item.type=='radio'" :disabled="noedit">
											<el-radio :label="it.label" v-for="it in item.opts" :key="it.id"></el-radio>
										</el-radio-group>
										<el-select clearable v-model="dataInfo[item.prop]"  v-if="item.type=='select'" filterable allow-create default-first-option placeholder="请选择" :disabled="noedit">
											<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
										</el-select>
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input' && item.prop =='A_PRICE' " @blur="handlePrice" :disabled="noedit" id="cost"></el-input>
									</el-form-item>
								</el-collapse-item>

								<!-- 设备保管人员情况 -->
								<el-collapse-item title="设备保管人员情况" name="2">
									<el-form-item v-for="item in keeperInfo" :label="item.label" :key="item.id" :prop="item.prop" :style="{ width: item.width, display: item.displayType}">
										<el-input v-model="dataInfo[item.prop]" v-if="item.type=='input'&&item.prop =='KEEPERDesc'" :type="item.type" :disabled="true">
											<el-button slot="append" :disabled="noedit" icon="el-icon-search" @click="addPeople"></el-button>
										</el-input>
										<el-input v-model="dataInfo[item.prop]" :type="item.type" v-if="item.type=='input'&&item.prop!='KEEPERDesc'" :disabled="noedit"></el-input>
									</el-form-item>
								</el-collapse-item>

							    <el-collapse-item title="设备溯源信息状态" name="3" v-show="modify">
									<el-table :header-cell-style="rowClass" :fit="true" :data="pmRecordList" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" :default-sort="{prop:'pmRecordList', order: 'descending'}">
										<el-table-column type="index" sortable label="序号" width="50">
	                                    </el-table-column>
										<el-table-column prop="RECORDNUM" label="溯源记录编号" sortable width="120px">
										</el-table-column>
										<el-table-column prop="PM_DATE" label="溯源日期" sortable width="120px">
										</el-table-column>
										<el-table-column prop="R_DESC" label="溯源确认内容" sortable >
										</el-table-column>
										<el-table-column prop="R_CONCLUSION" label="溯源确认结论" sortable width="200px">
										</el-table-column>
										<el-table-column prop="STATUS" label="溯源信息状态" sortable width="120px">
										</el-table-column>
									</el-table>
								</el-collapse-item>
								<el-collapse-item title="文件" name="4">
									<doc-table ref="docTable" :docParm = "docParm" @saveParent = "save"></doc-table>
								</el-collapse-item>
								
								<!-- 其他信息 -->
								<el-collapse-item title="其他" name="5" v-show="!addtitle">
									<el-form-item v-for="item in otherInfo" :key="item.id" :label="item.label" :prop="item.prop" :style="{ width: item.width, display: item.displayType}" v-if="item.prop=='DEPARTMENT'" v-show="dept">
										<el-input v-model="dataInfo[item.prop]" :type="item.type" disabled v-if="item.prop=='DEPARTMENT'"></el-input>
									</el-form-item>
									<el-form-item v-for="item in otherInfo" :key="item.id" :label="item.label" :prop="item.prop" :style="{ width: item.width, display: item.displayType}" v-show="views">
										<el-input v-model="dataInfo[item.prop]" :type="item.type" disabled ></el-input>
									</el-form-item>	
								</el-collapse-item>
							</el-collapse>
						</div>

						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="save('Update')">保存</el-button>
							<el-button type="success" @click="save('Submit')" v-show="addtitle">保存并继续</el-button>
							<el-button @click="close">取消</el-button>
							<!-- <el-button type="primary" @click='submitForm'>提交</el-button> -->
						</div>
					</el-form>
				</div>
				<!--底部-->
			</div>

			<!--设备分类 Begin-->
			<el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible2" width="60%" :before-close="handleClose2">
				<!-- 高级查询划出 Begin-->
				<div class="clearfix">
					<el-form inline-message :model="searchList" label-width="45px">
						<el-row :gutter="10">
							<!-- <el-col :span="5">
								<el-form-item label="编码" prop="CLASSIFY_NUM">
									<el-input v-model="searchList.CLASSIFY_NUM"></el-input>
								</el-form-item>
							</el-col> -->
							<el-col :span="8">
								<el-form-item label="分类描述" prop="CLASSIFY_DESCRIPTION" label-width="80px">
									<el-input v-model="searchList.CLASSIFY_DESCRIPTION"></el-input>
								</el-form-item>
							</el-col>
							<!-- <el-col :span="5">
								<el-form-item label="父级分类" prop="PARENTDesc" label-width="80px">
									<el-input v-model="searchList.PARENTDesc"></el-input>
								</el-form-item>
							</el-col> -->
							<el-col :span="4">
								<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
								<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px;margin-left: 2px">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<!-- 高级查询划出 End-->
				<tree_grid :columns="columns" :tree-structure="true" :loading="loading" :data-source="categoryList" @classByValue="classByValue" @getDetail="getDetail"></tree_grid>
				<div slot="footer" v-if="noviews">
	    			<el-button type="primary" @click="addAssetType">确 定</el-button>
	    			<el-button @click="resetBasisInfo2">取 消</el-button>
	  			</div>
			</el-dialog>
			<!--设备分类 End-->

			<!--设备保管人 Begin-->
			<el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
				<el-table ref="table" :data="userList" border stripe :header-cell-style="rowClass" height="360px" style="width: 100%;" :default-sort="{prop:'userList', order: 'descending'}" @selection-change="SelChange"
						v-loadmore="loadMore"
						v-loading="loading"
						element-loading-text="加载中…"
						element-loading-spinner="el-icon-loading"
						element-loading-background="rgba(255, 255, 255, 0.9)">
					<el-table-column type="selection" width="55" fixed align="center">
					</el-table-column>
					<el-table-column label="用户名" sortable width="140px" prop="username">
					</el-table-column>
					<el-table-column label="姓名" sortable width="200px" prop="nickname">
					</el-table-column>
					<el-table-column label="机构" sortable width="150px" prop="deptName">
					</el-table-column>
					<el-table-column label="公司" sortable prop="companyName">
					</el-table-column>
					<el-table-column label="录入时间" prop="createTime" width="100px" sortable :formatter="dateFormat">
					</el-table-column>
				</el-table>
				<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
				</el-pagination>

				<div slot="footer" v-if="noviews">
	    			<el-button type="primary" @click="addpeoname">确 定</el-button>
	    			<el-button @click="resetBasisInfo">取 消</el-button>
	  			</div>
			</el-dialog>
			<!--设备保管人 End-->
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import docTable from '../common/doc.vue'
	import tree_grid from '../common/TreeGrid.vue'//树表格
	export default {
		name: 'masks',
		props: ['detailData'],
		components: {
			docTable,
			tree_grid,
		},
		data() {
			var checkNum = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请输入设备价值'));
				}else{
					callback();
				}
			};
			var validateKeeper = (rule, value, callback) => {//类别
                if (this.dataInfo.KEEPERDesc === undefined || this.dataInfo.KEEPERDesc === '' || this.dataInfo.KEEPERDesc === null) {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
			return {
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				commentArr:{},
				docParm: {
					'model': 'new',
					'appname': '',
					'recordid': 1,
					'userid': 1,
					'username': '',
					'deptid': 1,
					'deptfullname': '',
					'appid': 1
				},
				columns: [
					{
						text: '编码',
						dataIndex: 'CLASSIFY_NUM',
						isShow:true,
					},
					{
						text: '分类描述',
						dataIndex: 'CLASSIFY_DESCRIPTION',
						isShow:true,
					},
					{
						text: '父级分类',
						dataIndex: 'PARENTDesc',
						isShow:true,
					},
				],
				rules: {
					DESCRIPTION: [//设备名称
						{ required: true, message: '必填', trigger: 'blur'},
						{ trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					CONFIG_UNIT: [//配置单位
						{ required: true, message: '必填', trigger: 'blur'},
					],
					INS_SITE: [//安装地点
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					VENDOR: [//制造商
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					MODEL: [//规格型号
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					ASSET_KPI: [//技术指标
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					SUPPORT_ASSET: [//配套设备
						{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					OPTION_STATUS: [//设备使用状态
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					ISMETER: [//是否计量器具
						{ required: true, trigger: 'change', validator: this.Validators.isChoosedata},
					],
					ISPM: [//是否需要溯源
						{ required: true, trigger: 'change', validator: this.Validators.isChoosedata},
					],
					KEEPERDesc: [//设备保管人
						{ required: true, trigger: 'blur', validator: this.Validators.isChoosedata},
					],
					ACCEPT_DATE: [//接收日期
						{ required: true, message: '请选择日期', trigger: 'blur' },
					],
					USEDATE: [//使用日期
						{ required: true, message: '请选择日期', trigger: 'blur' },
					],
					S_DATE: [//启用日期
						{  required: true, message: '请选择日期', trigger: 'blur' },
					],
					C_ADDRESS: [//配置地址
						{ required: true, message: '必填', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					MODE1: [//检定/验证
						{ required: true, trigger: 'change', validator: this.Validators.isChoosedata},
					],
					STATE: [//设备状态
						{ required: true, trigger: 'change', validator: this.Validators.isChoosedata},
					],
					MODE: [//维护方式
						{ required: true, trigger: 'change', validator: this.Validators.isChoosedata},
					],
					STATUS: [//信息状态
						{ required: true, trigger: 'blur', validator: this.Validators.isWorknumber},
					],
					A_STATUS: [//接收状态
						{ required: true, trigger: 'change', validator: this.Validators.isChoosedata},
					],
					TYPE: [//设备分类
						{ required: true, trigger: 'change', validator: this.Validators.isChoosedata},
					],
					A_PRICE: [//设备价值
						{ required: true, trigger: 'blur', message: '必填',},
					],
					FACTOR_NUM: [//出厂编号
						{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey },
					],
					SUPPLIER: [//供货单位
						{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey },
					],
					ACCEPT_NUM: [//验收单号
						{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					TECHNICAL_DATA: [//技术资料
						{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey },
					],
					MEMO: [//备注
						{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey },
					],
				},
				basicInfo: [
					{
						label: '设备分类',
						prop: 'TYPE',
						width: '30%',
						type: 'input',						
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
						label: '设备价值(元)',
						prop: 'A_PRICE',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
                    {
						label: '设备型号',
						prop: 'MODEL',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
                    {
						label: '配置单位',
						prop: 'CONFIG_UNITDes',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
					{
						label: '接收日期',
						prop: 'ACCEPT_DATE',
						width: '30%',
						type: 'date',
						displayType: 'inline-block'
					},
                    // {
					// 	label: '使用日期',
					// 	prop: 'USEDATE',
					// 	width: '30%',
					// 	type: 'date',
					// 	displayType: 'inline-block'
					// },
                    {
						label: '技术指标',
						prop: 'ASSET_KPI',
						width: '100%',
						type: 'textarea',
						displayType: 'inline-block'
					},
                    {
						label: '配套设备',
						prop: 'SUPPORT_ASSET',
						width: '100%',
						type: 'textarea',
						displayType: 'inline-block'
					},
                    {
						label: '制造单位',
						prop: 'VENDOR',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
                    {
						label: '出厂编号',
						prop: 'FACTOR_NUM',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
                    {
						label: '供货单位',
						prop: 'SUPPLIER',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
                    {
						label: '验收单号',
						prop: 'ACCEPT_NUM',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
					{
						label: '使用状态',
						prop: 'OPTION_STATUS',
						width: '30%',
						type: 'input',
						displayType: 'inline-block',
					},
                    {
						label: '计量器具',
						prop: 'ISMETER',
						width: '30%',
						type: 'radio',
						displayType: 'inline-block',
                        opts: [
                            {
								label: '是',
								val: '是'
                            },
                            {
								label: '否',
								val: '否'
                            }
                        ]
					},
                    {
						label: '需要溯源',
						prop: 'ISPM',
						width: '30%',
						type: 'radio',
						displayType: 'inline-block',
                        opts: [
                            {
								label: '是',
								val: '是'
                            },
                            {
								label: '否',
								val: '否'
                            }
                        ]
					},
                    {
						label: '维护方式',
						prop: 'MODE',
						width: '30%',
						type: 'radio',
						displayType: 'inline-block',
                        opts: [
                            {
								label: '外委',
								val: '外委'
                            },
                            {
								label: '自维',
								val: '自维'
                            }
                        ]
					},
					{
						label: '检定/验证',
						prop: 'MODE1',
						width: '30%',
						type: 'radio',
						displayType: 'inline-block',
                        opts: [
                            {
								label: '送检',
								val: '送检'
                            },
                            {
								label: '自检',
								val: '自检'
                            }
                        ]
					},
                    {
						label: '接收状态',
						prop: 'A_STATUS',
						width: '70%',
						type: 'radio',
						displayType: 'inline-block',
                        opts: [
                            {
								label: '全新',
								val: '全新'
                            },
                            {
								label: '已使用过',
								val: '已使用过'
                            },
                            {
								label: '改装过',
								val: '改装过'
                            },
                            {
								label: '大修过',
								val: '大修过'
                            }
                        ]
					},
					{
						label: '设备状态',
						prop: 'STATE',
						width: '70%',
						type: 'radio',
						 opts: [
                            {
								label: '启用',
								val: '1'
                            },
                            {
								label: '封存',
								val: '2'
                            },
                            {
								label: '报废',
								val: '3'
                            }
                        ],
						displayType: 'inline-block',
					},
					{
						label: '配置地址',
						prop: 'C_ADDRESS',
						width: '100%',
						type: 'textarea',
						displayType: 'inline-block'
					},
					{
						label: '安装地点',
						prop: 'INS_SITE',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
					{
						label: '启用日期',
						prop: 'S_DATE',
						width: '30%',
						type: 'date',
						displayType: 'inline-block'
					},
                    {
						label: '技术资料',
						prop: 'TECHNICAL_DATA',
						width: '100%',
						type: 'textarea',
						displayType: 'inline-block'
					},
					{
						label: '资产状态',
						prop: 'ASSET_STATUS',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
					{
						label: '资产编号',
						prop: 'ASSET_NUMBER',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
					{
						label: '是否定期检查',
						prop: 'ISPERIODIC',
						width: '30%',
						type: 'input',
						displayType: 'inline-block'
					},
				],
				keeperInfo: [
					{
						label: '设备保管人',
						prop: 'KEEPERDesc',
						width: '50%',
						type: 'input',
						displayType: 'inline-block'
					},
					{
						label: '备注',
						prop: 'MEMO',
						width: '50%',
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
						label: '录入时间',
						prop: 'ENTERDATE',
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
				// dialogVisible: false, //对话框
				modify: false,
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				selectData: [], //
				getCheckboxData: {},
				selectUserDept: [], //选择配置单位
				dataInfo: {
					'ID': '',  //主键ID，必填但页面没有字段
					'ASSETNUM': '',
					'DESCRIPTION': '',
					'CONFIG_UNIT': '',
					'INS_SITE': '',
					'SUPPORT_ASSET': '',
					'VENDOR': '',
					'SUPPLIER': '',	
					'MODEL': '',
					'FACTOR_NUM': '',
					'ASSET_KPI': '',
					'STATE': '',    //设备状态，必填但页面没有字段
					'OPTION_STATUS': '',   
					'TYPE': '', 
					'ACCEPT_NUM': '',
					'ISMETER': '',
					'ISPM': '',
					'STATUSDATE': '',
					'KEEPER': '',
					'KEEPERDesc': '',
					'ACCEPT_DATE': '',
					'S_DATE': '',   
					'C_ADDRESS': '',  
					'A_STATUS': '',
					'A_PRICE': '',
					'MODE': '',
					'MODE1': '',
					'CHANGEBY': '',	
					'CHANGEDATE': '',	
					'ENTERBY': '',
					'ENTERDATE': '',	
					'DEPTID': '',	
					'MEMO': '',	
					'STATUS': '1',
					'SYNCHRONIZATION_TIME': '',
				},
				pmRecordList: [],
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
				falg:false,
				dialogVisible2:false,//设备分类弹出框
				dialogVisible:false,//设备保管人弹出框
				categoryList:[],//设备分类数据
				userList:[],//设备保管人数据
				searchList: { //点击高级搜索后显示的内容
					CLASSIFY_NUM:'',
					CLASSIFY_DESCRIPTION: '',
					PARENT:'',
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				selectData:[]
			};
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			handlePrice(){
				this.dataInfo.A_PRICE = parseFloat(this.dataInfo.A_PRICE).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			},
			//机构值
			getCompany() {
				var url = this.basic_url + '/api-user/users/currentMap';
	            this.$axios.get(url, {}).then((res) => {//获取当前用户信息
	            	// this.deptId = res.data.deptId;
	            	this.dataInfo.CONFIG_UNIT = res.data.deptId;
	            	this.dataInfo.CONFIG_UNITDes = res.data.deptName;
	            	
	            	// var type = "2";
					// var url = this.basic_url + '/api-user/depts/'+this.deptId;
					// this.$axios.get(url, {
					// 	params: {
					// 		type: type
					// 	},
					// }).then((res) => {
					// 	this.selectData = res.data;
					// });
	            }).catch((err) => {
	            });
			},
			getDetail(data){
				this.view(data);
			},
			classByValue(childValue) {
				// childValue就是子组件传过来的
				
				this.selUser = childValue;
			},
			childByValue(childValue) {
				// childValue就是子组件传过来的值
				this.$refs.navsTabs.showClick(childValue);
				this.getbutton(childValue);
			},
			
			//设备保管人员情况
			addPeople(){
				var CONFIG_UNIT=this.dataInfo.CONFIG_UNIT;
				if(CONFIG_UNIT==""||CONFIG_UNIT=="undenfiend"){
					this.$message({
						message: '请先选配置单位名称',
						type: 'warning'
					});
				}else{
					this.getuserinfo();
					this.dialogVisible = true;
				}
			},
			//点击设备分类选值
			addAsset(){
				var CONFIG_UNIT=this.dataInfo.CONFIG_UNIT;
				if(CONFIG_UNIT==""||CONFIG_UNIT=="undenfiend"){
					this.$message({
						message: '请先选配置单位名称',
						type: 'warning'
					});
				}else{
					this.requestData();
					this.dialogVisible2 = true;
				}
			},
			//设备分类
			addAssetType(){
				if(this.selUser.length == 0){
					this.$message({
						message: '请选择数据',
						type: 'warning'
					});
				}else if(this.selUser.length > 1){
					this.$message({
						message: '不可同时选择多条数据',
						type: 'warning'
					});
				}else{
					this.dataInfo.TYPE = this.selUser[0].CLASSIFY_DESCRIPTION;
					this.requestData();
					this.resetBasisInfo2();//调用resetBasisInfo2函数
				}
			},
			resetBasisInfo2(){//点击确定或取消按钮时重置数据20190303
				this.dialogVisible2 = false;//关闭弹出框
				this.categoryList = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 20;//页码重新传值
			},
			//设备保管人
			addpeoname(){
				if(this.selUser.length == 0){
					this.$message({
						message: '请选择数据',
						type: 'warning'
					});
				}else if(this.selUser.length > 1){
					this.$message({
						message: '不可同时选择多条数据',
						type: 'warning'
					});
				}else{
					this.dataInfo.KEEPERDesc = this.selUser[0].nickname;
					this.dataInfo.KEEPER = this.selUser[0].id;
					this.getuserinfo();
					this.resetBasisInfo();//调用resetBasisInfo函数
				}
			},
			resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
				this.dialogVisible = false;//关闭弹出框
				this.userList = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 10;//页码重新传值
			},
			SelChange(val) {
				this.selUser = val;
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
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			getUser(opt){
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url,{}).then((res) => {
					if(opt == 'new'){
                        // this.dataInfo.CHANGEBY = res.data.username;
						// this.dataInfo.CHANGEDATE = this.getToday();
						this.dataInfo.DEPTID = res.data.deptId;
						this.dataInfo.ENTERBY = res.data.id;
				        this.dataInfo.ENTERDATE = this.getToday();
						// this.dataInfo.DEPARTMENT = res.data.deptName;
					}else{
						this.dataInfo.DEPTID = res.data.deptId;//传给后台机构id
						this.dataInfo.CHANGEBY = res.data.id;
						this.dataInfo.CHANGEDATE = this.getToday();
					}

					this.docParm.userid = res.data.id;
					this.docParm.username = res.data.username;
					this.docParm.deptid = res.data.deptId;
					this.docParm.deptfullname = res.data.deptName;
				}).catch((err) => {
				});
			},
			getToday(){
				var date = new Date();
				var str = date.getFullYear() + '-' + date.getMonth() + '-'+ date.getDate();
				return str;
			},
			getPmList(){
				var data = {
					page: 1,
					limit: 20,
					assetnum: this.dataInfo.ASSETNUM
				};
				var url = this.basic_url + '/api-apps/app/pmRecord';
				this.$axios.get(url,{
					params: data
				}).then((res) => {
					this.pmRecordList = res.data.data;
				}).catch((err) => {
				});
					
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
				this.docParm = {
					'model': 'new',
					'appname': '仪器和计量器具',
					'recordid': 1,
					'appid': 47
				};
				this.getUser('new');
				this.getCompany();
			},
			// 这里是修改
			detail(dataid) {
				console.log(this.detailData);
				this.dataInfo = this.detailData;
				// this.dataInfo.CONFIG_UNIT = Number(this.dataInfo.CONFIG_UNIT);
				// this.handlePrice();
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
				
				this.getUser();
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'edit';
					_this.docParm.appname = '仪器和计量器具';
					_this.docParm.recordid = _this.dataInfo.ID;
					_this.docParm.appid = 47;
					_this.$refs.docTable.getData();
				},100);
				this.show = true;
				this.getCompany();
			},
			//这是查看
			view(data) {
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.dept = false;
				this.modify = true;
				this.noedit = true;//表单内容
				this.views = true;//录入修改人信息
				this.mview = true;
				this.noviews = false;//按钮
				this.dataInfo = data;
				this.show = true;		
				
				var _this = this;
				setTimeout(function(){
					_this.docParm.model = 'view';
					_this.docParm.appname = '仪器和计量器具';
					_this.docParm.recordid = _this.dataInfo.ID;
					_this.docParm.appid = 47;
					_this.$refs.docTable.getData();
				},100);
			},
			//点击关闭按钮
			close() {
				this.reset();
				this.$emit('request');
				this.show = false;
			},
			reset(){
				this.dataInfo =  {
					'ID': '', 
					'ASSETNUM': '',
					'DESCRIPTION': '',
					'CONFIG_UNIT': '',
					'INS_SITE': '',
					'SUPPORT_ASSET': '',
					'VENDOR': '',
					'SUPPLIER': '',	
					'MODEL': '',
					'FACTOR_NUM': '',
					'ASSET_KPI': '',
					'STATE': '',   
					'OPTION_STATUS': '',   
					'TYPE': '', 
					'ACCEPT_NUM': '',
					'ISMETER': '',
					'ISPM': '',
					'STATUSDATE': '',
					'KEEPER': '',
					'ACCEPT_DATE': '',
					'S_DATE': '',   
					'C_ADDRESS': '',  
					'A_STATUS': '',
					'A_PRICE': '',
					'MODE': '',
					'MODE1': '',
					'CHANGEBY': '',	
					'CHANGEDATE': '',	
					'ENTERBY': '',
					'ENTERDATE': '',	
					'DEPARTMENT': '',	
					'MEMO': '',	
					'STATUS': '1',
					'SYNCHRONIZATION_TIME': '',
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
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.resetBasisInfo();//调用resetBasisInfo函数
					})
					.catch(_ => {
				console.log('取消关闭');
					$('.v-modal').hide();
				});
			},
			handleClose2(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.resetBasisInfo2();//调用resetBasisInfo函数
					})
					.catch(_ => {
				console.log('取消关闭');
					$('.v-modal').hide();
				});
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

			save(opt) {
				var _this = this;
				var url = this.basic_url + '/api-apps/app/asset/saveOrUpdate';
				this.$refs['dataInfo'].validate((valid) => {
					if(!valid && opt == 'docUpload'){
						this.$message({
							message: '请先正确填写信息，再进行文档上传',
							type: 'warning'
						});
					}
					if (valid) {
						this.$axios.post(url, _this.dataInfo).then((res) => {
							if(res.data.resp_code == 0) {
								if(opt == 'docUpload'){
									this.docParm.recordid = res.data.datas.id;
									this.docParm.model = 'edit';
									this.$refs.docTable.autoLoad();
									this.dataInfo.ID = res.data.datas.id;
									this.dataInfo.ASSETNUM = res.data.datas.ASSETNUM;
								}else{
									this.$message({
										message: '保存成功',
										type: 'success',
									});
									if(opt=="Update"){
										this.$emit('request');
										this.reset();
										this.show=false;
									}else{
										this.show=true;
										this.$emit('request');
										this.reset();
									}
									
								}
							}
						}).catch((err) => {
						});
					} else {
						this.show = true;
						this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
					}
				});
			},
			searchinfo() {//点击高级搜索-搜索按钮后显示的内容
				this.page.currentPage = 1;
				this.page.pageSize = 20;
				this.requestData();
			},
			resetbtn(){
				this.searchList = { //点击高级搜索-重置按钮后显示的内容
					CLASSIFY_NUM:'',
					CLASSIFY_DESCRIPTION: '',
					PARENT:'',
				};
				this.requestData();
			},
			requestData() {//设备分类
				this.loading = true;//加载动画打开
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					CLASSIFY_DESCRIPTION: this.searchList.CLASSIFY_DESCRIPTION,
				};
				this.$axios.get(this.basic_url + '/api-apps/app/assetClass/tree?tree_id=CLASSIFY_NUM&tree_pid=PARENT', {//要修改接口路径
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
					this.categoryList = res.data.datas;
					this.loading = false;//加载动画关闭
				}).catch((wrong) => {})
			},
			getuserinfo() {//高级查询字段
				this.loading = true;//加载动画打开
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				this.$axios.get(this.basic_url + '/api-user/users', {
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
					this.userList = res.data.data;
					this.loading = false;//加载动画关闭
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}//滚动加载数据判断filing
				}).catch((wrong) => {})
				
			},
		},
		mounted() {
			this.getCompany();
		},

	}
</script>

<style>
	@import '../../assets/css/mask-modules.css';
	#cost{
		text-align: right !important;
	}
</style>