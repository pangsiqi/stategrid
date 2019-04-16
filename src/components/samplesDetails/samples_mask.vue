<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加样品</div>
					<div class="mask_title" v-show="modifytitle">修改样品</div>
					<div class="mask_title" v-show="viewtitle">查看样品</div>
					<div class="mask_anniu">
						<span class="mask_span mask_max" @click="toggle">
							<i v-bind:class="{ 'icon-maximization': isok1, 'icon-restore':isok2}"></i>
						</span>
						<span class="mask_span" @click="close">
							<i class="icon-close1"></i>
						</span>
					</div>
				</div>
				
				<!--详情页弹出框 Begin-->
				<div class="mask_content">
					<el-form inline-message :model="samplesForm" :label-position="labelPosition" :rules="rules" ref="samplesForm" label-width="110px" status-icon class="demo-form-inline">
						<div class="content-accordion">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="基础信息" name="1">
									<el-row :gutter="20" class="pb10">
										<!--<el-col :span="4" class="pull-right">
											<el-input v-model="samplesForm.STATUS" :disabled="true">
												<template slot="prepend">信息状态</template>
											</el-input>
										</el-col>-->
										
										<el-col :span="4" class="pull-right">
											<el-input  v-model="samplesForm.STATEDesc" :disabled="true">
												<template slot="prepend">状态</template>
											</el-input>
										</el-col>
										
										<el-col :span="7" class="pull-right">
											<el-input placeholder="自动获取" v-model="samplesForm.ITEMNUM" :disabled="edit">
												<template slot="prepend">样品编号</template>
											</el-input>
										</el-col>

										<el-col :span="8" class="pull-right">
											<el-form-item label="承检单位" prop="CJDWDesc"  label-width="110px">
												<el-input v-model="samplesForm.CJDWDesc" disabled></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="12">
											<el-form-item label="委托书编号" prop="PROXYNUM" label-width="110px">
												<el-input v-model="samplesForm.PROXYNUM" :disabled="edit || (modifytitle && samplesForm.PROXYNUM!='')">
													<el-button slot="append" icon="el-icon-search" @click="getProxy" :disabled="noedit"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="16">
											<el-form-item label="委托单位名称" prop="V_NAMEDesc" label-width="110px">
												<el-input v-model="samplesForm.V_NAMEDesc" :disabled="true">
													<el-button slot="append" icon="el-icon-search" @click="getVname('V_NAME')" :disabled="noedit || (!!samplesForm.PROXYNUM)"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="委托单位统一社会信用代码" prop="VENDOR" label-width="220px">
												<el-input v-model="samplesForm.VENDOR" disabled></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="16">
											<el-form-item label="生产单位名称" prop="P_NAMEDesc" label-width="110px">
												<el-input v-model="samplesForm.P_NAMEDesc" disabled>
													<el-button slot="append" icon="el-icon-search"  @click="getVname('P_NAME')"  :disabled="noedit || (!!samplesForm.PROXYNUM)"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="生产单位统一社会信用代码" prop="PRODUCT_COMPANY" label-width="220px">
												<el-input v-model="samplesForm.PRODUCT_COMPANY" disabled></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="12" >
											<el-form-item label="产品类别" prop="PRODUCT_TYPE"  label-width="110px">
												<el-input v-model="samplesForm.PRODUCT_TYPE" :disabled="true">
													<el-button slot="append" icon="el-icon-search" @click="addcategory" :disabled="noedit||(!!samplesForm.PROXYNUM)"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="12">
											<el-form-item label="产品名称" prop="PRODUCT" label-width="110px">
												<el-input v-model="samplesForm.PRODUCT" :disabled="true">
													<el-button slot="append" icon="el-icon-search" @click="addproduct" :disabled="noedit||!!samplesForm.PROXYNUM"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="样品名称" prop="DESCRIPTION" label-width="110px">
												<el-input v-model="samplesForm.DESCRIPTION" :disabled="noedit||(!!samplesForm.PROXYNUM)"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="型号" prop="MODEL" label-width="110px">
												<el-input v-model="samplesForm.MODEL" :disabled="noedit||(!!samplesForm.PROXYNUM)"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="样品数量" prop="QUATITY" label-width="110px">
												<el-input-number v-model="samplesForm.QUATITY" :min="1" :step="1" :max="200" label="描述文字" @change="changeNum" :disabled="noedit||(!!samplesForm.PROXYNUM)"></el-input-number>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="生产日期/批" prop="MANUFACTURE_DATE" label-width="110px">
												<el-input  v-model="samplesForm.MANUFACTURE_DATE" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="抽样日期" prop="SAMPLE_DATE" label-width="110px">
												<el-date-picker
												      v-model="samplesForm.SAMPLE_DATE"
												      type="date"
												      placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd" :disabled="noedit">
												</el-date-picker>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="抽样人" prop="SAMPLE_PERSON" label-width="110px">
												<el-input v-model="samplesForm.SAMPLE_PERSON" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="抽样地点" prop="SAMPLE_PLACE" label-width="110px">
												<el-input v-model="samplesForm.SAMPLE_PLACE" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="产品标识代码" prop="PRODUCT_CODE" label-width="110px">
												<el-input v-model="samplesForm.PRODUCT_CODE" :disabled="noedit||(!!samplesForm.PROXYNUM)"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="收样人" prop="ACCEPT_PERSONDesc" label-width="110px">
												<el-input v-model="samplesForm.ACCEPT_PERSONDesc" placeholder="当前人" :disabled="true">
													<!-- <el-button slot="append" icon="el-icon-search" @click="getReceive" :disabled="noedit"></el-button> -->
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="收样日期" prop="ACCEPT_DATE" label-width="110px">
												<div class="block">
												    <el-date-picker
												      v-model="samplesForm.ACCEPT_DATE"
												      type="date"
												      placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd" :disabled="noedit">
												    </el-date-picker>
												</div>
											</el-form-item>
										</el-col>
										<el-col :span="16">
											<el-form-item label="其他资料" prop="OTHER" label-width="110px">
												<el-input v-model="samplesForm.OTHER" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="企业确认样品日期" prop="SAMPLE_CONFIRMATION_DATE" label-width="110px">
												<div class="block">
												    <el-date-picker
												      v-model="samplesForm.SAMPLE_CONFIRMATION_DATE"
												      type="date"
												      placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd" :disabled="noedit">
												    </el-date-picker>
												</div>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="样品费用（万元）" prop="ITEM_CHARGE" label-width="110px">
												<el-input v-model="samplesForm.ITEM_CHARGE" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="发票日期" prop="INVOICEDATE " label-width="110px">
												<div class="block">
												    <el-date-picker
												      v-model="samplesForm.INVOICEDATE"
												      type="date"
												      placeholder="选择日期" style="width:100%" value-format="yyyy-MM-dd" :disabled="noedit">
												    </el-date-picker>
												</div>
											</el-form-item>
										</el-col>
									</el-row>
									
									<el-row>
										<el-col :span="24">
											<el-form-item label="备注" prop="MEMO" label-width="110px">
												<el-input type="textarea" rows="5" v-model="samplesForm.MEMO" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="样品" name="2">								
									<div class="table-func" v-show="!viewtitle">
										<span><i class="red font16">*</i>此处是按样品数量生成的列表行</span>
										<el-button type="success" size="mini" round @click="addfield" :disabled="noedit">
											<i class="icon-start"></i>
											<font>生成</font>
										</el-button>
									</div>
									<el-table ref="table" :fit="true" max-height="260" :header-cell-style="rowClass" :data="samplesForm.ITEM_LINEList" row-key="ID" border stripe highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'samplesForm.ITEM_LINEList', order: 'descending'}">
									    <el-table-column prop="iconOperation" fixed width="50px" v-if="!viewtitle">
									      <template slot-scope="scope">
									      	<i class="el-icon-check" v-show="scope.row.isEditing">
									      	</i>
									      	<i class="el-icon-edit" v-show="!scope.row.isEditing">
									      	</i>
									      </template>
									    </el-table-column>
		
									    <el-table-column label="样品编号" sortable width="220px" prop="ITEMNUM" >
									      <template slot-scope="scope">
									      	<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.ITEMNUM" :disabled="edit" placeholder="自动获取">
									      	</el-input>
									      	<span v-show="!scope.row.isEditing" >{{scope.row.ITEMNUM}}</span>
									      </template>
									    </el-table-column>

									    <el-table-column label="样品序号" sortable width="120px" prop="ITEM_STEP">
									      <template slot-scope="scope">
									      	<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.ITEM_STEP" :disabled="true"></el-input>
									      	<span v-show="!scope.row.isEditing">{{scope.row.ITEM_STEP}}</span>
									      </template>
									    </el-table-column>

										<el-table-column prop="SN" label="单件码" sortable>
									      <template slot-scope="scope">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.SN" placeholder="请填写">
													</el-input>
													<span v-else>{{scope.row.SN}}</span>
									      </template>
									    </el-table-column>

										<el-table-column prop="STATEDesc" label="样品状态" sortable width="170px">
									      <template slot-scope="scope">
									        <el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.STATEDesc" placeholder="请输入内容" :disabled="true"></el-input>
									      	<span v-else>{{scope.row.STATEDesc}}</span>
										  </template>
									    </el-table-column>
									  </el-table>
								</el-collapse-item>
								<el-collapse-item title="其他" name="3" v-show="views">
									<el-row >
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc" label-width="110px">
												<el-input v-model="samplesForm.ENTERBYDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE" label-width="110px">
												<el-input v-model="samplesForm.ENTERDATE" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构" prop="DEPTIDDesc" label-width="110px">
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
							<el-button type="primary" @click='saveAndUpdate'>保存</el-button>
							<el-button type="success" v-show="addtitle" @click='saveAndSubmit'>保存并继续</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
				<!--详情页弹出框 End-->
			</div>

			<!--委托书编号-弹出框 Begin-->
			<el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" width="60%" :before-close="handleClose1">
				<div>
					<el-form inline-message :model="proxy_search" label-width="70px">
						<el-row :gutter="5">
							<el-col :span="7">
								<el-form-item label="委托书编号" prop="PROXYNUM">
									<el-input v-model="proxy_search.PROXYNUM"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item label="委托单位名称" prop="V_NAMEDesc">
									<el-input v-model="proxy_search.V_NAMEDesc"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="完成方式" prop="COMPMODE">
									<el-input v-model="proxy_search.COMPMODE"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
								<el-button type="primary" @click="resetProxy" size="small" style="margin-top:2px;    margin-left: 2px">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<el-table ref="table" :data="gridDataList" height="400px" @selection-change="SelChange"
					v-loadmore="loadMore('proxy')"
					v-loading="loading"
					element-loading-text="加载中…"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(255, 255, 255, 0.9)">
					<el-table-column type="selection" width="55" fixed >
					</el-table-column>
					<el-table-column label="检验委托书编号" sortable width="200px" prop="PROXYNUM" >
					</el-table-column>
					<el-table-column label="委托单位名称" sortable width="220px" prop="V_NAMEDesc">
					</el-table-column>
					<el-table-column label="生产单位名称" sortable width="220px" prop="P_NAMEDesc">
					</el-table-column>
					<el-table-column label="样品名称" sortable width="200px" prop="ITEM_NAME">
					</el-table-column>
					<el-table-column label="样品型号" sortable width="150px" prop="ITEM_MODEL">
					</el-table-column>
					<el-table-column label="样品信息状态" sortable width="200px" prop="ITEM_STATUSDesc">
					</el-table-column>
					<el-table-column label="检测依据" width="200px" prop="REMARKS" sortable>
					</el-table-column>
					<el-table-column label="完成日期" width="200px" prop="COMPDATE" sortable :formatter="dateFormat" type="date">
					</el-table-column>
					<el-table-column label="完成方式" width="200px" prop="COMPMODE" sortable>
					</el-table-column>
					<el-table-column label="检测报告编号" width="200px" prop="REPORT_NUM" sortable>
					</el-table-column>
					<el-table-column label="主检组" width="200px" prop="MAINGROUPDesc" sortable >
					</el-table-column>
					<!--<el-table-column label="信息状态" width="200px" prop="STATUS" sortable v-if="this.checkedName.indexOf('信息状态')!=-1">
					</el-table-column>-->
				</el-table>	
					<el-pagination 
						background 
						class="text-right pt10" 
						@size-change="sizeChange" 
						@current-change="currentChange" 
						:current-page="page.currentPage" 
						:page-sizes="[10, 20, 30, 40]" 
						layout="total, sizes, prev, pager, next" 
						:total="page.totalCount">
					</el-pagination>
				<div slot="footer">
	    			<el-button type="primary" @click="dailogconfirm">确 定</el-button>
	    			<el-button @click="resetBasisInfo1">取 消</el-button>
	  			</div>
			</el-dialog>
			<!--委托书编号-弹出框 Begin-->
			<!-- 收样人、接样人-弹出框 Begin -->
			<el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible3" height="300px" width="80%" :before-close="handleClose3">
				<el-table ref="table" :data="userList" border stripe :header-cell-style="rowClass" height="300px" style="width: 100%;" :default-sort="{prop:'userList', order: 'descending'}" @selection-change="SelChange"
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

				<el-pagination 
					background 
					class="text-right pt10" 
					@size-change="sizeChange" 
					@current-change="currentChange" 
					:current-page="page.currentPage" 
					:page-sizes="[10, 20, 30, 40]" 
					layout="total, sizes, prev, pager, next" 
					:total="page.totalCount">
				</el-pagination>

				<div slot="footer">
			       <el-button type="primary" @click="addPerson">确 定</el-button>
			       <el-button @click="resetBasisInfo3">取 消</el-button>
			    </div>
			</el-dialog>
			<!-- 收样人、接样人-弹出框 End -->

			<!--受检企业-->
			<enterprisemask ref="enterprisechild" @appendname="appendname" @appendnames="appendnames" @appendcode="appendcode" @appendcodes="appendcodes"></enterprisemask>

			<!-- 产品类别-弹出框子组件  -->
			<categorymask ref="categorychild" @categorydata="categorydata"></categorymask>

			<!-- 产品名称-弹出框子组件  -->
			<productmask ref="productchild" @appenddata="appenddata"></productmask>
			<deptmask ref="deptmask" @getSelData="setData"></deptmask>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import categorymask from '../common/common_mask/categorylistmask.vue'//产品类别
	import productmask from '../common/common_mask/productlistmask.vue'//产品
	import enterprisemask from '../common/common_mask/enterprisemask.vue'//企业
	import deptmask from'../common/common_mask/deptCustomMask.vue'
	export default {
		name: 'samples_mask',
		components: {
			'deptmask':deptmask,
			'categorymask':categorymask,
			'productmask':productmask,
			'enterprisemask':enterprisemask,
		},
		data() {
			
			return {
				proxy_search: {},
				vName: '',
				commentArr:{},
				falg:false,//保存验证需要的
				basic_url: Config.dev_url,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				value: '',
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				page: { //分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				selectData: [], //获取检验/检测方法类别
				Select_STATUS:[],//获取样品信息-样品状态-new
				modify:false,//修订、修改人、修改时间
				edit: true, //禁填
				noedit:false,
				selMenu:[],
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				fullHeight: document.documentElement.clientHeight - 210+'px',
				dialogVisible: false, //对话框
				dialogVisible2:false,//产品类别弹出框
				dialogVisible3:false,//接样人、收样人弹出框
				activeNames: ['1', '2','3'], //手风琴数量
				labelPosition: 'right', //表单标题在上方
				addtitle: true,
				modifytitle: false,
				viewtitle: false, //查看弹出框title
				noviews: true, //保存的按钮
				views: false,
				customid:"",
				samplesForm:{
					ITEM_LINEList:[]
				},
				categoryList:[],
				userList:[],
				//Tree树菜单数据
				gridDataList: [], //彈出框的數據
				isEditing: false,
				commentArr:{},//下拉加载
				tips:'1',
				rules: { //定义需要校验数据的名称
					// PROXYNUM: [{ required:true, trigger:'blur', message:'必填'}],//委托书编号
					VENDOR: [{ required:false, trigger:'blur', message:'必填'}],//委托单位编号
					V_NAME: [{ required:true, trigger:'blur', message:'必填'}],//委托单位名称
					PRODUCT_COMPANY: [{ required: false, trigger:'blur', validator: this.Validators.isSpecificKey}],//生产单位编号
					P_NAME: [{ required:true, trigger:'blur', message:'必填'}],//生产单位名称
					DESCRIPTION: [
						{ required:true, trigger:'blur', message:'必填'},
						{ trigger:'blur', validator: this.Validators.isSpecificKey}
					],//样品名称
					MANUFACTURE_DATE: [{ required:false, trigger:'blur', validator: this.Validators.isSpecificKey}],//生产日期/批
					SAMPLE_PERSON: [{ required:false, trigger:'blur', validator: this.Validators.isSpecificKey}],//抽样人
					SAMPLE_PLACE: [{ required:false, trigger:'blur', validator: this.Validators.isSpecificKey}],//抽样地点
					PRODUCT_CODE: [
						{ required:false, trigger:'change', validator: this.Validators.isWorknumber},
					],//产品标识代码
					SN: [{ required:true, message:'必填', trigger:'blur' }],
					TYPE: [{ required:true, trigger:'blur', message:'必填'}],//类别
					QUATITY: [{ required:true, trigger:'blur', validator: this.Validators.isInteger}],
					ACCEPTDATE: [{required:true, message: '请选择', trigger:'change' }],
					ACCEPT_DATE: [{required:true, message: '请选择', trigger:'change' }],
					RECIP_DATE: [{ required:true, message: '请选择', trigger:'change' }],
					STATUSDATE: [{required:true, message: '请选择', trigger:'change' }],
					PRODUCT_TYPE: [{required:true, message: '请选择', trigger:'blur' }],
					PRODUCT: [{required:true, message: '请选择', trigger:'blur' }],
					MODEL: [{ required:true, trigger:'change', validator: this.Validators.isSpecificKey}],//型号
					OTHER: [{ required:false, trigger:'change', validator: this.Validators.isSpecificKey}],//其它资料
					MEMO: [{ required:false, trigger:'change', validator: this.Validators.isSpecificKey}],//备注
				},
				selectDept:[],//承检单位
			};
		},
		methods: {
			searchinfo(){
				this.page.currentPage = 1;
				this.getProxy();
			},
			resetProxy(){
				this.proxy_search = {
					PROXYNUM: '',
					V_NAMEDesc: '',
					COMPMODE: '',
				};
			},
			changeNum(){
				this.samplesForm.ITEM_LINEList = [];
			},
			setData(data){
				this.$forceUpdate();
				if(this.vName == 'P_NAME'){
					if(data.depttype == '2'){
						this.samplesForm.P_NAME = data.id;
						this.samplesForm.P_NAMEDesc = data.fullname;
						this.samplesForm.PRODUCE_TYPE = '2';
						this.samplesForm.PRODUCT_COMPANY = '';
					}else{
						this.samplesForm.PRODUCT_COMPANY = data.CODE;
						this.samplesForm.P_NAME = data.ID;
						this.samplesForm.P_NAMEDesc = data.NAME;
						this.samplesForm.PRODUCE_TYPE = '1';
					}
				}else{
					if(data.depttype == '2'){
						this.samplesForm.V_NAME = data.id;
						this.samplesForm.V_NAMEDesc = data.fullname;
						this.samplesForm.DEPUTE_TYPE = '2';
						this.samplesForm.VENDOR = '';
						if(this.samplesForm.P_NAME==''){
							this.samplesForm.P_NAME = data.id;
							this.samplesForm.P_NAMEDesc = data.fullname;
							this.samplesForm.PRODUCE_TYPE = '2';
							this.samplesForm.PRODUCT_COMPANY = '';
						}
					}else{
						this.samplesForm.VENDOR = data.CODE;
						this.samplesForm.V_NAME = data.ID;
						this.samplesForm.V_NAMEDesc = data.NAME;
						this.samplesForm.DEPUTE_TYPE = '1';

						if(this.samplesForm.P_NAME==''){
							this.samplesForm.P_NAME = data.ID;
							this.samplesForm.P_NAMEDesc = data.NAME;
							this.samplesForm.PRODUCT_COMPANY = data.CODE;
							this.samplesForm.PRODUCE_TYPE = '1';
						}
					}
				}
			},
			getVname(opt){
				this.vName = opt;
				this.$refs.deptmask.getData(this.samplesForm.DEPTID);
			},
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			//委托单位统一社会信用代码
			appendcode(value){
				this.samplesForm.VENDOR=value;
			},
			//委托单位
			appendname(value){
				this.samplesForm.V_NAME = value;//名称
			},

			//生成单位
			appendnames(value){
				this.samplesForm.P_NAME=value;
			},
			//生成单位统一社会信用代码
			appendcodes(value){
				this.samplesForm.PRODUCT_COMPANY=value;//委托单位编号
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
					this.selectDept = res.data;

				});
			},
			//确定承检单位
			adddept(){
				this.samplesForm.P_NUM = '';
				this.samplesForm.PRODUCT_TYPE  = '';
				this.samplesForm.PRODUCT = '';
				this.samplesForm.PRO_NUM = '';
			},
			addcategory(){//产品类别
				if(this.samplesForm.CJDW == null || this.samplesForm.CJDW == '' || this.samplesForm.CJDW == undefined){
					this.$message({
						message: '请先选择承检单位',
						type: 'warning'
					});
				}else{
					this.$refs.categorychild.visible(this.samplesForm.CJDW);
				}
			},
			//接到产品类别的值
			categorydata(value){
				this.samplesForm.P_NUM = value[0];
				this.samplesForm.PRODUCT_TYPE  = value[1];
				this.samplesForm.P_VERSION = value[2];//产品类别版本
				this.samplesForm.PRODUCT = '';
				this.samplesForm.PRO_NUM = '';
			},
			addproduct(){//受检产品名称
				if(this.samplesForm.P_NUM == null || this.samplesForm.P_NUM == '' || this.samplesForm.P_NUM == undefined){
					this.$message({
						message: '请先选择产品类别',
						type: 'warning'
					});
				}else{
					this.$refs.productchild.visible(this.samplesForm.P_NUM,this.samplesForm.CJDW);
				}
			},
			//委托单位名称
			getCustomer(type) {
				if(type == 'vname'){
					this.$refs.enterprisechild.visible(type , this.samplesForm.appendid);
				}else{
					this.$refs.enterprisechild.visible(type);
				}
			},
			//接到产品的值
			appenddata(value){
				this.samplesForm.PRO_NUM = value[0];
				this.samplesForm.PRODUCT = value[1];
				if(!this.samplesForm.DESCRIPTION || this.samplesForm.DESCRIPTION == ''){
					this.samplesForm.DESCRIPTION = value[1];
				}
				this.samplesForm.PRO_VERSION = value[2];//产品版本
			},
			reset(){
				this.samplesForm = {
					ID: '',
					PROXYNUM: '',//委托书编号
					ITEMNUM: '',//样品编号
					VENDOR: '',//委托单位编号
					PRODUCT_COMPANY: '',//生产单位编号
					V_NAME: '',//委托单位名称
					P_NAME: '',//生产单位名称
					DESCRIPTION: '',//样品名称
					PRODUCT_CODE: '',//产品标识代码
					MODEL: '',//型号
					QUATITY: '',//数量
					OTHER: '',//其他资料
					MEMO: '',//备注
					ACCEPTDATE: '',//入库时间
					ACCEPT_PERSON: '',//收样人
					ACCEPT_DATE: '',//收样日期(缺省当前时间)
					RECIP_PERSON: '',//接样人
					RECIP_DATE: '',//接样日期
					STATE: '1',//状态
					STATEDesc: '待检',
					VERSION: '1',//版本
					STATUSDATE: '',//状态日期
					ENTERBY: '',//录入人
					ENTERDATE: '',//录入时间
					CHANGEBY: '',//修改人
					CHANGEDATE: '',//修改时间
					TYPE: '',//样品类别
					CJDW:'',//承检单位
					P_NUM:'',//产品类别编号
					PRODUCT_TYPE:'',//产品类别
					PRO_NUM:'',//产品编号
					PRODUCT:'',//产品
					STATUS: '1',//信息状态
					ITEM_LINEList:[]
				}
            },
			//获取委托书编号数据
			getProxy() {
				this.proxydata();
				this.dialogVisible = true;
			},
			proxydata(){
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					PROXYNUM: this.proxy_search.PROXYNUM,
					V_NAMEDesc: this.proxy_search.V_NAMEDesc,
					COMPMODE: this.proxy_search.COMPMODE
				};
				var url = this.basic_url + '/api-apps/appCustom/getInspectProxy';
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					this.gridDataList= res.data.data;
					this.page.totalCount = res.data.count;
				});
			},
			dailogconfirm(type) { //小弹出框确认按钮事件
				if(this.selval.length == 0){
					this.$message({
						message:'未选择数据',
						type:'warning'
					})
				}else if(this.selval.length == 1){
					var data = this.selval[0];
					this.samplesForm.ITEMNUM = data.ITEMNUM;
					this.samplesForm.PROXYNUM = data.PROXYNUM;
					this.samplesForm.V_NAME = data.V_NAME;
					this.samplesForm.V_NAMEDesc = data.V_NAMEDesc;
					this.samplesForm.VENDOR = data.VENDOR;
					this.samplesForm.PROXYNUM = data.PROXYNUM;
					this.samplesForm.P_NAME = data.P_NAME;
					this.samplesForm.P_NAMEDesc = data.P_NAMEDesc;
					this.samplesForm.PRODUCT_COMPANY = data.PRODUCT_UNIT;
					this.samplesForm.PRODUCT_TYPE = data.PRODUCT_TYPE;
					this.samplesForm.PRODUCT = data.PRODUCT;
					this.samplesForm.DESCRIPTION = data.ITEM_NAME;
					this.samplesForm.PRODUCT_CODE = data.ITEM_ID;
					this.samplesForm.MODEL = data.ITEM_MODEL;
					this.samplesForm.QUATITY = data.ITEM_QUALITY;

					this.samplesForm.DEPUTE_TYPE = data.DEPUTE_TYPE;
					this.samplesForm.PRODUCE_TYPE = data.PRODUCE_TYPE;

					this.resetBasisInfo1();
				}else if(this.selval.length > 1){
					this.$message({
						message:'不可选择多条数据',
						type:'warning'
					})
				}
			},
			resetBasisInfo1(){//点击确定或取消按钮时重置数据20190303
				this.dialogVisible = false;//关闭弹出框
				this.gridDataList = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 20;//页码重新传值
			},
			visible() {//添加内容时从父组件带过来的
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.samplesForm.DEPTID = res.data.deptId;
					this.samplesForm.ENTERBY = res.data.id;
					this.samplesForm.ACCEPT_PERSON = res.data.id;
					this.samplesForm.ACCEPT_PERSONDesc = res.data.nickname;
					var date=new Date();
					this.samplesForm.ACCEPT_DATE =  this.$moment(date).format("YYYY-MM-DD HH:mm:ss");//收样日期
					this.samplesForm.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					this.findDeptId();
				}).catch((err)=>{})
				this.reset();
				console.log(this.$store.state.currentcjdw);
				this.addtitle = true;
				this.modifytitle = false;
				this.viewtitle = false;
				this.noviews = true;
            	this.modify=false;
				this.show = true;
				this.views = false;
            	this.edit = true;
				this.noedit = false;
			},
			findDeptId(){
				this.$axios.get(this.basic_url + '/api-user/users/findUsersDeptofSta',{}).then((res)=>{
					var data = res.data[0];
					this.$forceUpdate();
					this.samplesForm.CJDW = data.id;
					this.samplesForm.CJDWDesc = data.fullname;
				}).catch((err)=>{})
			},
			detail(dataid) { //修改内容时从父组件带过来的
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.samplesForm.DEPTID = res.data.deptId;//传给后台机构id
					this.samplesForm.CHANGEBY = res.data.id;
					var date=new Date();
					this.samplesForm.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err)=>{
				})
				this.$axios.get(this.basic_url + '/api-apps/app/item/' + dataid, {}).then((res) => {
					for(var i=0;i<res.data.ITEM_LINEList.length;i++){
						res.data.ITEM_LINEList[i].isEditing = false;
					}
					res.data.CJDW = Number(res.data.CJDW);
					this.samplesForm = res.data;
				}).catch((err) => {
				});
				this.viewtitle = false;
				this.addtitle = false;
				this.modifytitle = true;
				this.modify = true;
				this.views = false;
				this.noviews = true;
				this.show = true;
				this.edit = true;
				this.noedit = false;
			},
			//这是查看
			view(dataid) {
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.views = true; 
				this.noviews = false;
				this.edit = true;
				this.noedit = true;
				var url = this.basic_url + '/api-apps/app/item/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					this.samplesForm = res.data;
					if(this.samplesForm.STATE == '1'){
						this.samplesForm.STATE == '待检';
					}else if(this.samplesForm.STATE == '2'){
						this.samplesForm.STATE == '在检';
					}else if(this.samplesForm.STATE == '3'){
						this.samplesForm.STATE == '已检';
					}else{
						this.samplesForm.STATE == '留存';
					}
					this.show = true;
				}).catch((err) => {
				});
			},
			iconOperation(row, column, cell, event){//切换Table-操作列中的修改、保存
				if(column.property ==="iconOperation"){
					row.isEditing = !row.isEditing
				}
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
				})
			},
			//
			getcategory(){
				this.dialogVisible2 = true;				
			},
			//收样人
			getReceive(){
				this.tips = '1';
				this.$emit('request');
				this.dialogVisible3 = true;
			},
			//接样人
			getCatch(){
				this.tips = '2';
				this.$emit('request');
				this.dialogVisible3 = true;
			},
			addPerson(){
				if(this.selval.length == 0){
					this.$message({
						message: '未选择数据',
						type: 'warning'
					});
				}else if(this.selval.length > 1){
					this.$message({
						message: '不可选择多条数据',
						type: 'warning'
					});
				}else{
					if (this.tips == '1') {
						this.samplesForm.ACCEPT_PERSON = this.selval[0].username; //收样人
						// this.dialogVisible3 = false;
						this.resetBasisInfo3();
						this.$emit('request');
					}else if(this.tips == '2'){
						this.samplesForm.RECIP_PERSON = this.selval[0].username;//接样人
						// this.dialogVisible3 = false;
						this.resetBasisInfo3();
						this.$emit('request');
					}
				}
			},
			resetBasisInfo3(){//点击确定或取消按钮时重置数据20190303
				this.dialogVisible3 = false;//关闭弹出框
				this.userList = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 20;//页码重新传值
			},
			addproclass(){
				if(this.selval.length == 0){
					this.$message({
						message: '未选择数据',
						type: 'warning'
					});
				}else if(this.selval.length > 1){
					this.$message({
						message: '不可选择多条数据',
						type: 'warning'
					});
				}else{
					this.samplesForm.TYPE = this.selval[0].TYPE;
					// this.dialogVisible2 = false;
					this.resetBasisInfo2();
					this.$emit('request');
				}
			},
			resetBasisInfo2(){//点击确定或取消按钮时重置数据20190303
				this.dialogVisible2 = false;//关闭弹出框
				this.categoryList = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 20;//页码重新传值
			},
			
			SelChange(val) {
				this.selval = val;
			},
			addfield() { 
				//插入行到文件文件Table中
				this.samplesForm.ITEM_LINEList = [];
				var date=new Date();
				var time = this.$moment(date).format("YYYY-MM-DD");
				for(var i = 0;i<this.samplesForm.QUATITY;i++){
					var obj = {
						ITEMNUM:'',
						ITEM_STEP:i+1,
						SN:'',
						STATE:'1',
						STATEDesc:'待检',
						ENTERBY:'',
						ENTERDATE:time,
						CHANGEBY:'',
						isEditing: true
					};
					this.samplesForm.ITEM_LINEList.push(obj);
				}
			},

			//点击关闭按钮
			close() {
				this.show = false;
				this.dialogVisible = false;
				this.dialogVisible2 = false;
				this.dialogVisible3 = false;
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
				this.$refs.samplesForm.validate((valid) => {
					if (valid) {
						if(this.samplesForm.ITEM_LINEList.length<=0){
			        		this.$message({
								message: '样品表格是必填项，请填写！',
								type: 'warning'
							});
							return false;
			        	}else{
							var url = this.basic_url + '/api-apps/app/item/saveOrUpdate';
							this.$axios.post(url, this.samplesForm).then((res) => {
								if(res.data.resp_code == 0) {
									this.$message({
										message: '保存成功',
										type: 'success'
									});
									if(opt=='save'){
										this.$emit('request');
										this.show = false;
									}
									this.reset();
								}
							}).catch((err) => {
							});
							this.show = false;
							this.falg = true;
						}
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
			//保存并继续
			saveAndSubmit(){
				this.save('update');
			},
			//生成委托书
			generate(){
				// console.log(this.samplesForm);
				var dataid = this.samplesForm.ID;
				var url =this.basic_url + '/api-apps/app/item/operate/isExcProxy?ID=' +dataid;
				this.$axios.get(url,{}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message:res.data.resp_msg,
								type: 'success'
							});
						var url =this.basic_url + '/api-apps/app/item/operate/createInspectProxy?ID='+dataid;
						this.$axios.get(url, {}).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message:res.data.resp_msg,
									type: 'success'
								});
							}
						}).catch((err) => {
						});
						
						}else{
							this.$message({
								message: res.data.resp_msg,
								type: 'error'
							});
						}
					}).catch((err) => {
					});
			},
			// loadMore (val) {
			//    if (this.loadSign) {
			//      this.loadSign = false
			//      this.page.currentPage++
			//      if (this.page.currentPage > Math.ceil(this.page.totalCount/this.page.pageSize)) {
			//        return
			//      }
			//      setTimeout(() => {
			//        this.loadSign = true
			// 	 }, 1000)
			// 	 if(val == 'proxy'){
			// 		 this.proxydata();
			// 	 }else if(val == 'type'){
			// 		 this.requestData()
			// 	 }
			//    }
			//  },
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
			// //表格滚动加载
			loadMore(val) {
				// let up2down = sessionStorage.getItem('up2down');
				// if(this.loadSign) {					
				// 	if(up2down=='down'){
				// 		this.page.currentPage++;
				// 		if(this.page.currentPage > Math.ceil(this.page.totalCount / this.page.pageSize)) {
				// 			this.page.currentPage = Math.ceil(this.page.totalCount / this.page.pageSize)
				// 			return false;
				// 		}
				// 		// let append_height = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
				// 		if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
				// 			sessionStorage.setItem('toBtm','true');
				// 		}
				// 	}else{
				// 		sessionStorage.setItem('toBtm','false');
				// 		this.page.currentPage--;
				// 		if(this.page.currentPage < 1) {
				// 			this.page.currentPage=1;
				// 			return false;
				// 		}
				// 	}
				// 	this.loadSign = false;
				// 	setTimeout(() => {
				// 		this.loadSign = true;
				// 	}, 1000)
				// 	if(val == 'proxy'){
				// 		this.proxydata();
				// 	}else if(val == 'type'){
				// 		this.requestData()
				// 	}
				// }
			},
			//产品类别数据
			requestData(index) {
				this.loading = true;//加载动画打开
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				this.$axios.get(this.basic_url + '/api-apps/app/productType', {
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
					this.categoryList = res.data.data;
					this.loading = false;//加载动画关闭
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}//滚动加载数据判断filing
				}).catch((wrong) => {})
			},
			//收样人、接样人数据
			requestData2(index) {
				this.loading = true;//加载动画打开
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				this.$axios.get(this.basic_url +'/api-user/users/currentMap', {}).then((res) => {
					this.deptid = res.data.deptId;
					var url = this.basic_url + '/api-user/users?deptid_wheres='+this.deptid;
					this.$axios.get(url, {
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
					}).catch((wrong) => {
					})
				}).catch((err) => {
				});
				
			},
			getITEM_STATUS() {//获取样品状态
				var url =  this.basic_url + '/api-user/dicts/findChildsByCode?code=ITEM_STATUS';
				this.$axios.get(url, {}).then((res) => {
					// this.Select_STATUS = res.data;
				}).catch(error => {
				})
			},

			handleClose1(done) { //大弹出框确定关闭按钮
				this.$confirm('确认关闭？')
				.then(_ => {
					this.resetBasisInfo1();
				})
				.catch(_ => {
					console.log('取消关闭');
					$('.v-modal').hide();
				});
			},
			//小弹出框关闭按钮事件
			handleClose2(done) {
				this.$confirm('确认关闭？')
				.then(_ => {
					this.resetBasisInfo2();
				})
				.catch(_ => {
					console.log('取消关闭');
					$('.v-modal').hide();
				});
			},
			//小弹出框关闭按钮事件
			handleClose3(done) {
				this.$confirm('确认关闭？')
				.then(_ => {
					this.resetBasisInfo3();
				})
				.catch(_ => {
					console.log('取消关闭');
					$('.v-modal').hide();
				});
			},
		},
		mounted() {
			this.getType();
			this.requestData();
			this.requestData2();
			this.getITEM_STATUS();
			this.getCompany();
		},
	}
</script>

<style>
	@import '../../assets/css/mask-modules.css';
	.table-funbc {
		position: absolute;
		top: 3px;
		right: 2px;
	}
</style>