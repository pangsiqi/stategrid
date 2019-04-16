<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<!-- <div class="mask_title" v-show="addtitle">添加检验委托书</div>
					<div class="mask_title" v-show="modifytitle">修改检验委托书</div> -->
					<div class="mask_title" v-show="viewtitle">下达任务单</div>
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
					<el-form inline-message :model="dataInfo" :label-position="labelPositions" :rules="rules" ref="dataInfo" class="demo-ruleForm">
						<!-- <div class="text-center" v-show="viewtitle">
							<span v-if="this.dataInfo.STATE!=3">
								<el-button id="start" type="success" round plain size="mini" @click="startup" v-show="start"><i class="icon-start"></i> 启动流程</el-button>
								<el-button id="approval" type="warning" round plain size="mini" @click="approvals" v-show="approval"><i class="icon-edit-3"></i> 审批</el-button>
							</span>
							<el-button type="primary" round plain size="mini" @click="flowmap"><i class="icon-git-pull-request"></i> 流程地图</el-button>
							<el-button type="primary" round plain size="mini" @click="flowhistory"><i class="icon-plan"></i> 流程历史</el-button>
							<el-button type="primary" round plain size="mini" @click="viewpepole"><i class="icon-user"></i> 当前责任人</el-button>
						</div> -->
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="委托单位" name="1">
									<el-row :gutter="5" class="pb10">
										<el-col :span="3" class="pull-right">
											<el-input v-model="dataInfo.VERSION" :disabled="edit">
												<template slot="prepend">版本</template>
											</el-input>
										</el-col>
										<el-col :span="3" class="pull-right">
											<el-input v-model="dataInfo.STATEDesc" :disabled="edit">
												<template slot="prepend">状态</template>
											</el-input>
										</el-col>
										<el-col :span="3" class="pull-right">
											<el-input v-model="dataInfo.TYPEDesc" :disabled="edit">
												<template slot="prepend">类别</template>
											</el-input>
										</el-col>
										<el-col :span="5" class="pull-right">
											<el-input v-model="dataInfo.PROXYNUM" :disabled="edit" placeholder="自动生成">
												<template slot="prepend">编号</template>
											</el-input>
										</el-col>
											<el-col :span="6" class="pull-right">
											<el-input v-model="dataInfo.R_VENDORDesc" :disabled="edit">
												<template slot="prepend">承检单位</template>
											</el-input>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="16">
											<el-form-item label="名称" prop="V_NAMEDesc" label-width="110px">
												<el-input v-model="dataInfo.V_NAMEDesc" :disabled="edit" width="100%">
													<el-button slot="append" :disabled="noedit" icon="el-icon-search" @click="getinspect_cust()">
													</el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="统一社会信用代码" prop="VENDOR" label-width="150px">
												<el-input v-model="dataInfo.VENDOR" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										
									</el-row>
									<el-row>
											<el-col :span="16">
											<el-form-item label="地址" prop="V_ADDRESS" label-width="110px">
												<el-input v-model="dataInfo.V_ADDRESS" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>	
									<el-row >
										<el-col :span="8">
											<el-form-item label="姓名" prop="V_PERSON" label-width="110px">
												<el-input v-model="dataInfo.V_PERSON" :disabled="noedit">
													 <el-button slot="append" :disabled="noedit" icon="el-icon-search" @click="addname"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="电话" prop="V_PHONE" label-width="110px">
												<el-input v-model="dataInfo.V_PHONE" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="邮编" prop="V_ZIPCODE" label-width="110px">
												<el-input v-model="dataInfo.V_ZIPCODE" :disabled="noedit" ></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="样品" name="2">
									<el-row>
											<el-col :span="12" >
												<el-form-item label="产品类别" prop="PRODUCT_TYPE"  label-width="110px">
													<el-input v-model="dataInfo.PRODUCT_TYPE" :disabled="special">
														<el-button slot="append" :disabled="special1" icon="el-icon-search"  @click="miancategory()"></el-button>
													</el-input>
												</el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="产品名称" prop="PRODUCT" label-width="110px">
													<el-input v-model="dataInfo.PRODUCT" :disabled="special">
														<el-button slot="append" :disabled="special1" icon="el-icon-search"  @click="mianproduct()"></el-button>
													</el-input>
												</el-form-item>
											</el-col>
											</el-row>
										<el-row>
											<el-col :span="12">
												<el-form-item label="生产单位名称" prop="P_NAMEDesc" label-width="110px">
													<el-input v-model="dataInfo.P_NAMEDesc" :disabled="noedit" >
														<el-button slot="append" icon="el-icon-search" :disabled="noedit" @click="getCustomer('pname')"></el-button>
													</el-input>
												</el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="样品名称" prop="ITEM_NAME" label-width="110px">
													<el-input v-model="dataInfo.ITEM_NAME" :disabled="special1">
													</el-input>
												</el-form-item>
											</el-col>
										</el-row>
										<el-row>
											<el-col :span="11">
												<el-form-item label="统一信用代码" prop="PRODUCT_UNIT" label-width="110px">
													<el-input v-model="dataInfo.PRODUCT_UNIT" :disabled="noedit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="型号" prop="ITEM_MODEL" label-width="110px">
													<el-input v-model="dataInfo.ITEM_MODEL" :disabled="special1"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="5">
												<el-form-item label="数量" prop="ITEM_QUALITY" label-width="110px">
													<el-input v-model.number="dataInfo.ITEM_QUALITY" :disabled="special1">
													</el-input>
												</el-form-item>
											</el-col>
										</el-row>
										<el-row>
											<el-col :span="8">
												<el-form-item label="样品状态" prop="ITEM_STATUS" label-width="110px">
													<el-input v-model="dataInfo.ITEM_STATUS" :disabled="noedit" ></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="标识" prop="ITEM_IDENT" label-width="110px">
													<el-input v-model="dataInfo.ITEM_IDENT" :disabled="noedit"></el-input>
												</el-form-item>
											</el-col>
											
											<el-col :span="8">
												<el-form-item label="保密要求" prop="ITEM_SECRECY" label-width="110px">
													<el-input v-model="dataInfo.ITEM_SECRECY" :disabled="noedit"></el-input>
												</el-form-item>
											</el-col>
											
										</el-row>
										<el-row>
											<el-col :span="10">
												<el-form-item label="取样方式" prop="ITEM_METHOD" label-width="110px">
													<el-radio-group v-model="dataInfo.ITEM_METHOD" :disabled="noedit">
														<el-radio label="委托方送样"></el-radio>
														<el-radio label="抽样"></el-radio>
														<el-radio label="其他"></el-radio>
													</el-radio-group>
												</el-form-item>
											</el-col>
											<el-col :span="14">
												<el-form-item label="检后处理" prop="ITEM_DISPOSITION" label-width="110px">
													<el-radio-group v-model="dataInfo.ITEM_DISPOSITION" :disabled="noedit">
														<el-radio label="自提"></el-radio>
														<el-radio label="邮寄"></el-radio>
														<el-radio label="报废"></el-radio>
														<el-radio label="本中心处理"></el-radio>
													</el-radio-group>
												</el-form-item>
											</el-col>
										</el-row>
								</el-collapse-item>

								<el-collapse-item title="检验" name="3">
									<el-row>
									<el-col :span="8">
										<el-form-item label="完成日期" prop="COMPDATE" label-width="140px">
											<el-date-picker v-model="dataInfo.COMPDATE" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="noedit">
											</el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="完成方式" prop="COMPMODE" label-width="110px">
											<el-radio-group v-model="dataInfo.COMPMODE" :disabled="noedit">
												<el-radio label="正常"></el-radio>
												<el-radio label="加急" class="red"></el-radio>
											</el-radio-group>
										</el-form-item>
									</el-col>
									</el-row>
										<el-form-item label="抽样方案/判定依据" prop="REMARKS" label-width="200px">
											<el-input v-model="dataInfo.REMARKS" :disabled="noedit"></el-input>
										</el-form-item>
								</el-collapse-item>
								<div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion>
									<el-tabs v-model="activeName" @tab-click="handleClick">
									    <el-tab-pane label="检验依据" name="first">
											<div class="table-func table-funcb">
												<el-button type="primary" size="mini" round @click="basisleadbtn('maintable')"  v-show="!viewtitle">
													<i class="icon-search"></i>
													<font>选择</font>
												</el-button>
											</div>
											<el-table :data="dataInfo.INSPECT_PROXY_BASISList" row-key="ID" border stripe :fit="true" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'dataInfo.INSPECT_PROXY_BASISList', order: 'descending'}">
												<el-table-column prop="S_NUM" label="标准编号" sortable width="150px">
													<template slot-scope="scope">
														<el-form-item :prop="'INSPECT_PROXY_BASISList.'+scope.$index + '.S_NUM'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.S_NUM" placeholder="请输入">
															   <el-button slot="append" icon="el-icon-search"></el-button>
														</el-input>
														<span v-else>{{scope.row.S_NUM}}</span>
														</el-form-item>
													</template>
												</el-table-column>

												<el-table-column prop="S_DESC" label="标准内容" sortable>
													<template slot-scope="scope">
														<el-form-item :prop="'INSPECT_PROXY_BASISList.'+scope.$index + '.S_DESC'" >
															<el-input size="small" v-model="scope.row.S_DESC" placeholder="请输入" :disabled="noedit">
                                                            </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>
									 
												<el-table-column prop="VERSION" label="版本" sortable width="120px">
													<template slot-scope="scope">
														<el-form-item :prop="'INSPECT_PROXY_BASISList.'+scope.$index + '.VERSION'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.VERSION" placeholder="请输入">
														</el-input>
														<span v-else>{{scope.row.VERSION}}</span>
														</el-form-item>
													</template>
												</el-table-column>
												
												<el-table-column fixed="right" label="操作" width="120px">
													<template slot-scope="scope">
														<el-button @click.native.prevent="deleteRow(scope.$index,scope.row,'basisList')" type="text" size="small" v-if="!viewtitle">
															 <i class="icon-trash red"></i>
														</el-button>
													</template>
												</el-table-column>
											</el-table>
									    </el-tab-pane>

									    <el-tab-pane label="检验项目与要求" name="second">
											<div class="table-func table-funcb">
												<el-button type="primary" size="mini" round @click="basisleadbtn2('maintable')"  v-show="!viewtitle">
													<i class="icon-search"></i>
													<font>选择</font>
												</el-button>
											</div>
	                                        
											<el-table ref="" :data="dataInfo.INSPECT_PROXY_PROJECList" row-key="ID" border stripe :fit="true"
												:summary-method="getSummaries" :show-summary="true"
												highlight-current-row
												style="width: 100%;" @cell-click="iconOperation"
												:default-sort="{prop:'dataInfo.INSPECT_PROXY_PROJECList', order: 'descending'}">

												<el-table-column prop="P_NUM" label="检验项目编号" sortable width="120px">
													<template slot-scope="scope">
													<el-form-item :prop="'INSPECT_PROXY_PROJECList.'+scope.$index + '.P_NUM'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.P_NUM" placeholder="请输入">
															   <el-button slot="append" icon="el-icon-search"></el-button>
														</el-input>
														<span v-else>{{scope.row.P_NUM}}</span>
													</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="P_DESC" label="检验项目描述" sortable>
													<template slot-scope="scope">
														<el-form-item :prop="'INSPECT_PROXY_PROJECList.'+scope.$index + '.P_DESC'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
															<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.P_DESC" placeholder="请输入">
															</el-input>
															<span v-else>{{scope.row.P_DESC}}</span>
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="REMARKS" label="要求" sortable>
													<template slot-scope="scope">
														<el-form-item :prop="'INSPECT_PROXY_PROJECList.'+scope.$index + '.REMARKS'" >
															<el-input size="small" v-model="scope.row.REMARKS" placeholder="请输入" :disabled="noedit">
                              </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="UNITCOST" label="单价(元)" sortable width="120px" :formatter="priceFormate">
												</el-table-column>
                                                <el-table-column prop="QUATITY" label="样品数量" sortable width="120px">
													<template slot-scope="scope">
                                                        <el-form-item :prop="'INSPECT_PROXY_PROJECList.'+scope.$index + '.QUATITY'" >
															<el-input size="small" v-model="scope.row.QUATITY" placeholder="请输入">
                                                            </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>
												<el-table-column prop="VERSION" label="项目版本" sortable width="120px">
													<template slot-scope="scope">
														<el-form-item :prop="'INSPECT_PROXY_PROJECList.'+scope.$index + '.VERSION'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.VERSION" placeholder="请输入">
														</el-input>
														<span v-else>{{scope.row.VERSION}}</span>
														</el-form-item>	
													</template>
												</el-table-column>
												<el-table-column fixed="right" label="操作" width="120">
													<template slot-scope="scope">
														<el-button @click.native.prevent="deleteRow(scope.$index,scope.row,'projectList')" type="text" size="small" v-if="!viewtitle">
														 <i class="icon-trash red"></i>
														</el-button>
													</template>
												</el-table-column>
											</el-table>
									    </el-tab-pane>

									    <el-tab-pane label="分包要求" name="third">
									    	<div class="table-func table-funcb">
												<el-button type="primary" size="mini" round  @click="outdept" v-show="!viewtitle">
            							<i class="icon-search"></i>
            							<font>中心外机构</font>
        								</el-button>
												<el-button type="primary" size="mini" @click="withindept" round  style="margin-left: 10px;" v-show="!viewtitle">
													<i class="icon-search"></i>
													<font>中心内机构</font>
												</el-button>
											</div>

											<el-table ref="IPO_table" :data="dataInfo.CHECK_PROXY_CONTRACTList" row-key="ID" border stripe :fit="true"
												:summary-method="getSummaries2" :show-summary="true"
												highlight-current-row="highlight-current-row"
												style="width: 100%;" @cell-click="iconOperation"
												:default-sort="{prop:'dataInfo.CHECK_PROXY_CONTRACTList', order: 'descending'}">
												
												<el-table-column prop="iconOperation" fixed label="" width="50px">
													<template slot-scope="scope"><i class="el-icon-check" v-if="scope.row.isEditing&&!viewtitle"></i><i class="el-icon-edit" v-else></i></template>
												</el-table-column>

												<el-table-column prop="V_NAMEDesc" label="委托单位" sortable width="120px">
													<template slot-scope="scope">
														<el-input :disabled="true" v-if="scope.row.isEditing" size="small" v-model="scope.row.V_NAMEDesc">
														</el-input>
														<span v-else>{{scope.row.V_NAMEDesc}}</span>
													</template>
												</el-table-column>
												
												<el-table-column prop="VENDORDesc" label="分包方名称" sortable width="120px">
													<template slot-scope="scope">
														<el-form-item :prop="'CHECK_PROXY_CONTRACTList.'+scope.$index + '.VENDORDesc'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-input :disabled="true" v-if="scope.row.isEditing" size="small" v-model="scope.row.VENDORDesc">
															<!-- <el-button slot="append" icon="el-icon-search" @click="getDept(scope.row)">
															</el-button> -->
														</el-input>
														<span v-else>{{scope.row.VENDORDesc}}</span>
														</el-form-item>	
													</template>
												</el-table-column>
	
												<el-table-column prop="DEPTTYPEDesc" label="机构类型" sortable width="120px">
													<template slot-scope="scope">
														<el-input :disabled="true" v-if="scope.row.isEditing" size="small" v-model="scope.row.DEPTTYPEDesc" placeholder="">
														</el-input>
														<span v-else>{{scope.row.DEPTTYPEDesc}}</span>
													</template>
												</el-table-column>

												<el-table-column prop="PRODUCT_TYPE" label="产品类别" sortable width="120px">
													<template slot-scope="scope">
														<el-form-item :prop="'CHECK_PROXY_CONTRACTList.'+scope.$index + '.P_DESC'"  >
														<el-input :disabled="true" v-if="scope.row.isEditing" size="small" v-model="scope.row.PRODUCT_TYPE">
														</el-input>
														<span v-else>{{scope.row.PRODUCT_TYPE}}</span>
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="PRODUCT" label="产品名称" sortable width="120px">
													<template slot-scope="scope">
														<el-input :disabled="true" v-if="scope.row.isEditing" size="small" v-model="scope.row.PRODUCT">
														</el-input>
														<span v-else>{{scope.row.PRODUCT}}</span>
													</template>
												</el-table-column>

												<el-table-column prop="BASIS" label="检验检测技术依据" sortable width="150px">
													<template slot-scope="scope">
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.BASIS" placeholder="请输入">
														</el-input>
														<span v-else>{{scope.row.BASIS}}</span>
													</template>
												</el-table-column>

												<el-table-column prop="P_REMARKS" label="检验项目内容" sortable width="200px">
													<template slot-scope="scope">
														<el-form-item :prop="'CHECK_PROXY_CONTRACTList.'+scope.$index + '.P_REMARKS'" :rules="[{required: true, message: '请输入', trigger: 'change'}]" >
															<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.P_REMARKS" placeholder="请输入">
															</el-input>
														<span v-else>{{scope.row.P_REMARKS}}</span>
														</el-form-item>
													</template>
												</el-table-column>

												<el-table-column prop="REQUIRES" label="对环境和操作人员要求" sortable width="220px">
													<template slot-scope="scope">
														<el-form-item :prop="'CHECK_PROXY_CONTRACTList.'+scope.$index + '.REQUIRES'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.REQUIRES" placeholder="请输入内容"></el-input>
														<span v-else>{{scope.row.REQUIRES}}</span>
														</el-form-item>
													</template>
												</el-table-column>

												<el-table-column prop="Q_TYPE" label="对分包报告/证书的要求" sortable width="220px">
													<template slot-scope="scope">
														<el-form-item :prop="'CHECK_PROXY_CONTRACTList.'+scope.$index + '.Q_TYPE'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]" >
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.Q_TYPE" placeholder="请输入内容"></el-input>
														<span v-else>{{scope.row.Q_TYPE}}</span>
														</el-form-item>
													</template>
												</el-table-column>
								
												<el-table-column prop="CHECKCOST" label="检验费用(元)" sortable width="160px">
													<template slot-scope="scope">
														<el-form-item :prop="'CHECK_PROXY_CONTRACTList.'+scope.$index + '.CHECKCOST'" :rules="[{required: true, message: '请输入数字', trigger: 'change'}]" >
															<el-input v-if="scope.row.isEditing" id="testprice" @blur="testPrice(scope.row)" size="small" v-model="scope.row.CHECKCOST" placeholder="请输入内容"></el-input>
															<span v-else>{{scope.row.CHECKCOST}}</span>
														</el-form-item>
													</template>
												</el-table-column>

                                                <el-table-column prop="QUATITY" label="样品数量" sortable width="120px">
													<template slot-scope="scope">
                                                        <el-form-item :prop="'CHECK_PROXY_CONTRACTList.'+scope.$index + '.QUATITY'" >
															<el-input size="small" v-model="scope.row.QUATITY" placeholder="请输入">
                                                            </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>
							                    <el-table-column fixed="right" label="操作" width="120">
													<template slot-scope="scope">
														<el-button @click.native.prevent="deleteRow(scope.$index,scope.row,'requestList')" type="text" size="small" v-if="!viewtitle">
															 <i class="icon-trash red"></i>
														</el-button>
													</template>
												</el-table-column>
											</el-table>
										</el-tab-pane>
									</el-tabs>
								</div>
								<el-collapse-item name="7">
									<el-row>
										<el-col :span="8">
											<el-form-item label="检验报告编号" prop="REPORT_NUM" label-width="110px">
												<el-input v-model="dataInfo.REPORT_NUM" disabled></el-input>
											</el-form-item>
										</el-col>
                                        <el-col :span="8">
											<el-form-item label="格式" prop="REPORT_FOMAT" label-width="110px">
												<el-radio-group v-model="dataInfo.REPORT_FOMAT" :disabled="noedit">
													<el-radio label="认证中心"></el-radio>
													<el-radio label="国家中心"></el-radio>
												</el-radio-group>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<el-form-item label="标识" prop="CNAS_OR_CMA_ID" label-width="110px">
												<el-checkbox-group v-model="dataInfo.CNAS_OR_CMA_ID" :disabled="noedit">
    											<el-checkbox label="CNAS"></el-checkbox>
												</el-checkbox-group>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="8">
											<el-form-item label="交委托方份数" prop="REPORT_QUALITY" label-width="110px">
												<el-input v-model.number="dataInfo.REPORT_QUALITY" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="发送方式" prop="REPORT_MODE" label-width="110px">
												<el-radio-group v-model="dataInfo.REPORT_MODE" :disabled="noedit">
													<el-radio label="自取"></el-radio>
													<el-radio label="邮寄"></el-radio>
													<el-radio label="其它"></el-radio>
												</el-radio-group>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="付款方式" prop="PAYMENT_METHOD" label-width="110px">
												<el-select v-model="dataInfo.PAYMENT_METHOD" placeholder="请选择" style="width: 100%;" :disabled="noedit">
													<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
									  <el-col :span="8">
											<el-form-item label="标准费用(元)" prop="CONTRACTCOST" label-width="110px">
												<el-input v-model="dataInfo.CONTRACTCOST" id="stacost" @blur="staPrice" disabled></el-input>
											</el-form-item>
										</el-col>  
										<el-col :span="8">
											<el-form-item label="合同收费(元)" prop="CHECK_COST" label-width="110px">
												<el-input  v-model="dataInfo.CHECK_COST" id="cost" @blur="toPrice" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="实收费用(元)" prop="ACTUALCOST" label-width="110px">
												<el-input  v-model="dataInfo.ACTUALCOST" id="actualcost"  @blur="actualPrice" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>	
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="我方经办人" prop="OURAGENT"  label-width="110px">
												<el-input v-model="dataInfo.OURAGENT" disabled></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="我方签办人" prop="OUR_SIGNATORY" label-width="110px">
												<el-input v-model="dataInfo.OUR_SIGNATORY" disabled></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="对方签办人" prop="OPPOSITE_AGENT" label-width="110px">
												<el-input v-model="dataInfo.OPPOSITE_AGENT" disabled></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="合同编号" prop="CONTRACTNUM" label-width="110px">
												<el-input v-model="dataInfo.CONTRACTNUM" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="主检组" prop="MAINGROUP"  label-width="110px">
												<el-select v-model="dataInfo.MAINGROUP" filterable allow-create default-first-option placeholder="请选择"  @change="getmaingroup($event)" @visible-change="visablemaingroup($event)" style="width: 100%;">
													<el-option v-for="(data,index) in maingroup" :key="index" :value="data.id" :label="data.fullname"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="主检负责人" prop="LEADER" label-width="110px">
												<el-select v-model="dataInfo.LEADER" filterable allow-create default-first-option placeholder="请选择" @visible-change="visableleader($event)">
													<el-option v-for="(data,index) in leaderdata" :key="index" :value="data.id" :label="data.nickname"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>	
									<el-row>	
										<el-col :span="24">
											<el-form-item label="备注" prop="MEMO" label-width="110px">
												<el-input type="textarea" rows="5" v-model="dataInfo.MEMO" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<el-collapse-item title="其他" name="8" v-show="views">
									<div class="accordion-body tab-content">
										<el-row >
											<el-col :span="8">
												<el-form-item label="录入人" prop="ENTERBYDesc" label-width="110px">
													<el-input v-model="dataInfo.ENTERBYDesc" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="录入时间" prop="ENTERDATE" label-width="110px">
													<el-input v-model="dataInfo.ENTERDATE" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="机构" prop="DEPTIDDesc" label-width="110px">
													<el-input v-model="dataInfo.DEPTIDDesc" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
										</el-row>
										<el-row >
											<el-col :span="8">
												<el-form-item label="修改人" prop="CHANGEBYDesc" label-width="110px">
													<el-input v-model="dataInfo.CHANGEBYDesc" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="修改时间" prop="CHANGEDATE" label-width="110px">
													<el-input v-model="dataInfo.CHANGEDATE" :disabled="edit"></el-input>
												</el-form-item>
											</el-col>
										</el-row>
									</div>
								</el-collapse-item>
							</el-collapse>
						</div>
						<!-- <div class="content-footer" v-show="noviews">
							<el-button type="primary" @click="save('Update')">保存</el-button>
							<el-button type="success"  v-show="addtitle" @click="save('Submit')">保存并继续</el-button>
							<el-button v-show="modifytitle" type="btn btn-primarys" @click="modifyversion">修订</el-button>
							<el-button @click="close">取消</el-button>
						</div>
						 -->
						<div class="content-footer">
							<el-button type="success" @click="build">确定</el-button>
						</div>
					</el-form>
				</div>
			</div>
			<!-- 客户联系人\姓名 Begin -->
			<el-dialog :modal-append-to-body="false" title="客户联系人" :visible.sync="dialogVisibleuser" width="80%" :before-close="handleClose2">
				<el-table :header-cell-style="rowClass" :data="CUSTOMER_PERSONList" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" @selection-change="SelChange" @cell-click="iconOperation" :default-sort="{prop:'CUSTOMER_PERSONList', order: 'descending'}" v-loadmore="loadMore"
				v-loading="loading" 
				element-loading-text="加载中…"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(255, 255, 255, 0.9)">
					<el-table-column type="selection" width="55" fixed align="center">
					</el-table-column>
					<el-table-column label="联系人" sortable width="150px" prop="PERSON">
					</el-table-column>
					<el-table-column prop="PHONE" label="联系电话" sortable width="150px">
					</el-table-column>
					<el-table-column prop="FAX" label="传真" sortable width="150px">
					</el-table-column>
					<el-table-column prop="EMAIL" label="邮箱" sortable>
					</el-table-column>
				</el-table>
				
				<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
				</el-pagination>

				<div slot="footer">
					<el-button type="primary" @click="addcusname">确 定</el-button>
					<el-button @click="resetBasisInfo2">取 消</el-button>
			  </div>
			</el-dialog>
			<!-- 客户联系人 End -->
			<!-- 样品名称  -->
			<sampletmask ref="samplechild" @showData="showData" @appenddes="appenddes" @appendmod="appendmod" @appendqua="appendqua" @linedata="linedata"></sampletmask>
			<!--受检企业-->
			<enterprisemask ref="enterprisechild"  @appendnames="appendnames"></enterprisemask>
			<!--审批页面-->
			<approvalmask :approvingData="approvingData" ref="approvalChild"  @detail="detailgetData"></approvalmask>
			<!--流程历史-->
			<flowhistorymask :approvingData="approvingData"  ref="flowhistoryChild" ></flowhistorymask>
			<!--流程地图-->
			<flowmapmask :approvingData="approvingData" ref="flowmapChild" ></flowmapmask>
			<!--当前责任人-->
			<vewPoplemask :approvingData="approvingData"  ref="vewPopleChild" ></vewPoplemask>
			<!-- 机构  -->
			<deptmask ref="deptchild" @deptdata = "deptdata"></deptmask>
			<!-- 产品类别  -->
			<categorymask ref="categorychild" @categorydata="categorydata"></categorymask>
			<!-- 产品名称  -->
			<productmask ref="productchild" @appenddata="appenddata"></productmask>
			<!-- 检验依据  -->
			<teststandardmask ref="standardchild" @testbasis="addbasis" @testbasisnum="testbasisnum" @testbasisname="testbasisname" @testbasisprover="testbasisprover"></teststandardmask>
			<!-- 检验项目  -->
			<testprojectmask ref="projectchild" @testproject="addproject" @testprojectnum="testprojectnum" @testprojectid="testprojectid" @testprojectname="testprojectname" @testprojectprover = "testprojectprover"></testprojectmask>
			<!--委托单位名称 -->
			<inspectcustommask ref="inscustom" @customarr="customarr" @custarr="custarr" @vendor="vendor"></inspectcustommask>
			<!--分包要求 中心外机构-->
			<custinspectmask ref="custinspectchild" @cusinspect="cusinspect"></custinspectmask>
			<!--分包要求 中心内机构-->
			<withdepetmask ref="withinspectchild" @withdepet="withdepet"></withdepetmask>
		</div>
	</div>
</template>

<script>
	// import { Loading } from 'element-ui'
	import Config from '../../config.js';
	import sampletmask from '../common/common_mask/samplemask.vue'//样品名称
	import inspectcustommask from '../common/common_mask/inspect_custommask.vue'//委托单位
	import enterprisemask from '../common/common_mask/enterprisemask.vue'//企业
	import approvalmask from '../workflow/approving.vue'
	import flowhistorymask from '../workflow/flowhistory.vue'
	import flowmapmask from '../workflow/flowmap.vue'
	import vewPoplemask from '../workflow/vewPople.vue'
	import deptmask from '../common/common_mask/deptmask.vue'//机构
	import categorymask from '../common/common_mask/categorylistmask.vue'//产品类别
	import productmask from '../common/common_mask/productlistmask.vue'//产品
	import teststandardmask from '../common/common_mask/teststandardmask.vue'//检验依据
	import testprojectmask from '../common/common_mask/testprojectmask.vue'//检验依据
	import custinspectmask from '../common/common_mask/cust_inspectmask.vue'//中心外机构
	import withdepetmask from '../common/common_mask/withdepet_mask.vue'//中心内机构
	export default {
		name: 'masks',
		components: {
			 approvalmask,
			 flowhistorymask,
			 flowmapmask,
			 vewPoplemask,
			 sampletmask,
			 enterprisemask,
			 deptmask,
			 categorymask,
			 productmask,
			 teststandardmask,
			 testprojectmask,
			 inspectcustommask,
			 custinspectmask,
			 withdepetmask,
		},
		data() {
			return {
				approvingData:{},
				loading: false,
				loadSign:true,//加载
				commentArr:{},
				basic_url: Config.dev_url,
				po_url: Config.po_url,
				dataInfo: {
					MAINGROUP:'',//主检组
					LEADER:'',//主检负责人
					STATE: '1',//流程状态
					STATEDesc:'编制',
					VERSION:'1',//版本
					TYPE:'1',//检验
					TYPEDesc:'检验',
					STATUS:'0',
					VENDOR:'',//委托单位编号
					R_VENDOR:'',//承建单位
					R_VENDORDesc:'',
					V_PERSON:'',//委托单位联系人
					ITEM_NAME:'',//样品名称
					ITEM_MODEL:'',//样品型号
					ITEM_QUALITY:'',//样品数量
					ITEM_SECRECY:'',//样品保密要求
					ITEM_METHOD:'委托方送样',//样品取样方式
					ITEM_DISPOSITION:'',//样品检后处理
					REPORT_NUM:'',//检验报告编号
					P_NUM:'',
					P_VERSION:'',
					PRO_NUM:'',
					PRO_VERSION:'',
					PRODUCT_TYPE:'',
					PRODUCT:'',
					PAYMENT_METHOD:'',//付款方式
					COMPDATE:'',
					COMPMODE:'',//完成方式
					REMARKS:'',
					V_NAME:'',//委托单位名称
					V_ADDRESS:'',//委托单位地址
					V_ZIPCODE:'',
					P_NAME:'',
					CHECK_COST:0,//合同费用
					ACTUALCOST:0,//实收费用
					CONTRACTCOST:0,//标准费用
					ACTUAL_PERCENT:0,
					INSPECT_PROXY_PROJECList: [],
					INSPECT_PROXY_BASISList: [],//
					CHECK_PROXY_CONTRACTList: [//分包要求
						{
							INSPECT_GROUP:'',	//专业组
							VENDOR: '',//承检单位
							VENDORDesc:'',//承检单位名称
							PT_NUM:'',//产品类别编号
							PRODUCT_TYPE:'',//产品类别
							PRO_NUM:'',//产品编号
							PRODUCT:'',//产品名称
							S_NUM:'',//检测依据编号
							BASIS: '',//检测依据
							PROJ_NUM:'',//检测项目编号
							PROJECT_ID:'',//检测项目ID
							P_REMARKS: '',//检测项目
							P_VERSIONNUM:'',	//产品类别编号+版本
							PRO_VERSIONNUM:'',	//产品名称编号+版本
							S_VERSIONNUM:'',	//检验检测依据编号+版本
							PROJ_VERSIONNUM:'',	//检测项目编号+版本
						}
					],
				},
				gridDataList: [], //彈出框的數據
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				options: [{
					value: '现金',
					label: '现金'
				}, {
					value: '电汇',
					label: '电汇'
				}, {
					value: '支票',
					label: '支票'
				}, {
					value: '转账',
					label: '转账'
				}, {
					value: '其他',
					label: '其他'
				}],
				value: '',
				selval:[],
				edit: true, //禁填
				noedit: false,
				special:false,
				special1:false,//样品模块的放大按钮
				editSearch: '', //判斷項目負責人和接收人
				col_but1: true,
				col_but2: true,
				show: false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				type: '',
				datainfo:{},
				addtitle: true, //添加弹出框titile
				modifytitle: false, //修改弹出框titile
				viewtitle: false, //查看弹出框title
				views: false,
				noviews: true, //保存的按钮
				modify: false,
				start:false,
				approval:false,
				DataInfo:'',
				activeName: 'first',//tabs
				activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', ], //手风琴数量
				labelPositions: 'right',
				rules: {
					V_NAME: [
						{required: true, message: '必填', trigger: 'blur',validator:this.Validators.isSpecificKey }],//委托单位名称
					V_ADDRESS: [{required: true, trigger: 'blur', validator: this.Validators.isAddress}],//地址
					V_ZIPCODE: [{required: false, trigger: 'blur', validator: this.Validators.isZipcode}],//邮编
					V_PERSON: [{required: true, trigger: 'blur', validator: this.Validators.isNickname}],//联系人姓名
					V_PHONE: [{required: true, validator: this.Validators.isPhones}],//联系人电话
					R_VENDORDesc: [{required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],//承检单位
					P_NAMEDesc: [{required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],//生产单位名称
					PRODUCT: [{required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],//产品名称
					ITEM_NAME: [{required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],//样品名称
					ITEM_MODEL: [
						{required: true, message: '必填', trigger: 'blur' },
						{trigger: 'blur', validator:this.Validators.isSpecificKey}
					],//型号
					ITEM_QUALITY: [
						{ required: true, message: '必填', trigger: 'blur'},
						{ type: 'number', message: '请输入数字'}
					],//数量
					ITEM_METHOD: [{ required: true, message: '必填', trigger: 'change' }],//取样方式
					ITEM_DISPOSITION: [{ required: true, message: '必填', trigger: 'change' }],//检后处理
					REMARKS: [
						{ required: true, message: '必填', trigger: 'blur'},
						{trigger: 'blur', validator:this.Validators.isSpecificKey}
					],//抽样方案/判定依据
					COMPDATE: [{ required: true, message: '必填', trigger: 'blur' }],//完成日期
					REPORT_QUALITY: [
						{ required: true, message: '必填', trigger: 'blur'},
						{ type: 'number', message: '请输入数字'}
					],//交委托方分数
					REPORT_MODE: [{ required: true, message: '必选', trigger: 'change' }],//发送方式
					REPORT_FOMAT: [{ required: true, message: '必填', trigger: 'change' }],//格式
					MAINGROUP: [{required: true, message: '必填', trigger: 'change' }],//主检组
					LEADER: [{required: true, message: '必填', trigger: 'change' }],//主检负责人
					CHECK_COST:[{required: false, trigger: 'blur', validator:this.Validators.isPrices}],//合同收费(元)
					ACTUALCOST:[{required: false, trigger: 'blur', validator:this.Validators.isPrices}],//实收费用
					CONTRACTCOST:[{required: false, trigger: 'blur', validator:this.Validators.isPrices}],//标准费用
					ITEM_STATUS: [{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],//样品状态
					CNAS_OR_CMA_ID: [{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],//标识
					ITEM_SECRECY: [{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],//保密要求
					CONTRACTNUM: [{ required: false, trigger: 'blur', validator: this.Validators.isSpecificKey}],//合同编号
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "children",
					label: "fullname"
				},
				dialogVisibleuser:false,
				customid:"",
				dataid:'',//修改和查看带过的id
				appname:'inspectPro',//appname
				CUSTOMER_PERSONList:[],//
				maingroup:[],//主检组
				selectData:[],//承建单位
				leaderdata:[],//主检负责人
				username:'',
				catenum:'',//产品类别作为参数传值给依
				basisnum:'',////依据选中数据们字符串作为参数传值给项目
				deptindex:{},//分包方名称
				main:'',
				sendchilddata:[],//检测依据子表已有的值
				pnum:'',//用于主表接修改时的产品的类别的值
				pronum:'',//用于主表接修改时的产品的值
				inistinspectproxy:'',//用于存储检测依据的子表数据
			};
		},
		methods: {
			priceFormate(row, column) {
				var money = row.UNITCOST;
				return row.UNITCOST =  this.toFixedPrice(money);
			},
			//检验项目与要求单价列总和
			getSummaries(param) {
        //param 是固定的对象，里面包含 columns与 data参数的对象 {columns: Array[4], data: Array[5]},包含了表格的所有的列与数据信息
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计';
            return;
					} 
					else if(index === 3) {//计算第几列的减1
						const values = data.map(item => {
							if(!!item[column.property]){
								return Number(item[column.property].replace(/,/g,''));
							}else{
								return 0.00;
							}
						});
						//验证每个value值是否是数字，如果是执行if
							if (!values.every(value => isNaN(value))) {
								sums[index] = values.reduce((prev, curr) => {
									return prev + curr;
								}, 0);
								sums[index] = this.toFixedPrice(sums[index]);
								if(!!sums[index]){
									this.ALLCOST = sums[index] += '元';
								}else{
									this.ALLCOST = '0.00元';
								}
							} else {
								sums[index] = ' ';
							}
					}
					else if(index === 4){
						const values = data.map(item => {
							if(!!item[column.property]){
								return Number(item[column.property]);
							}else{
								return 0;
							}
						});
						//验证每个value值是否是数字，如果是执行if
							if (!values.every(value => isNaN(value))) {
								sums[index] = values.reduce((prev, curr) => {
									return prev + curr;
								}, 0);
								if(this.Quety>this.dataInfo.ITEM_QUALITY){
											this.$message({
											message:'样品数量不能大于'+this.dataInfo.ITEM_QUALITY,
											type: 'warning'
										});
								}
								if(!!sums[index]){
									this.Quety = sums[index];
								}else{
									this.Quety = 0;
								}
							} else {
								sums[index] = ' ';
							}
					}
				});
					return sums;
			},
			//分包要求检测费用列的总和
			getSummaries2(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计';
            return;
          } else if(index === 10) {//计算第几列的减1
						const values = data.map(item => {
							if(!!item[column.property]){
								return Number(item[column.property].replace(/,/g,''));
							}else{
								return 0.00;
							}
						});
						//验证每个value值是否是数字，如果是执行if
						if (!values.every(value => isNaN(value))) {
							sums[index] = values.reduce((prev, curr) => {
								return prev + curr;
							}, 0);
							sums[index] = this.toFixedPrice(sums[index]);
							if(!!sums[index]){
								this.INSPECTCOST = sums[index] += '元';
							}else{
								this.INSPECTCOST = '0.00元';
							}
							
							var paramData1 = this.INSPECTCOST;
							var paramData2 = this.ALLCOST;
							this.$forceUpdate();
							this.dataInfo.CONTRACTCOST = this.number_format(parseFloat(paramData2.replace(/,/g,'').replace('元','')) + parseFloat(paramData1.replace(/,/g,'').replace('元','')),2) ;
						} else {
							sums[index] = ' ';
						}
					}
					else if(index === 11){
						const values = data.map(item => {
							if(!!item[column.property]){
								return Number(item[column.property]);
							}else{
								return 0;
							}
						});
						//验证每个value值是否是数字，如果是执行if
							if (!values.every(value => isNaN(value))) {
								sums[index] = values.reduce((prev, curr) => {
									return prev + curr;
								}, 0);
								if(!!sums[index]){
									this.Quety = sums[index];
									if(this.Quety>this.dataInfo.ITEM_QUALITY){
											this.$message({
											message:'样品数量不能大于'+this.dataInfo.ITEM_QUALITY,
											type: 'warning'
										});
									}
								}else{
									this.Quety = 0;
								}
							} else {
								sums[index] = ' ';
							}
					}
				});
					return sums;
			},
		number_format(number, decimals, dec_point, thousands_sep) {
		　　/*
		　　 * 参数说明：
		　　 * number：要格式化的数字
		　　 * decimals：保留几位小数
		　　 * dec_point：小数点符号
		　　 * thousands_sep：千分位符号
		　　 * */
		　　 number = (number + '').replace(/[^0-9+-Ee.]/g, '');
		　　 var n = !isFinite(+number) ? 0 : +number,
		　　 prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
		　　 sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		　　 dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			　　s = '',
			　　 toFixedFix = function(n, prec) {
			　　　　var k = Math.pow(10, prec);
			　　　　return '' + Math.ceil(n * k) / k;
			　　};
					s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
			　　 var re = /(-?\d+)(\d{3})/;
			　　 while(re.test(s[0])) {
			　　　　s[0] = s[0].replace(re, "$1" + sep + "$2");
			　　}
			　　if((s[1] || '').length < prec) {
			　　 s[1] = s[1] || '';
				　　s[1] += new Array(prec - s[1].length + 1).join('0');
			　　}
		　　　return s.join(dec);
		},
			
			// 中心内机构
			withindept(){
				this.$refs.withinspectchild.visible();
			},
			//中心外机构
			outdept(){
				this.$refs.custinspectchild.visible();
			},
			handleNodeClick(data) { //获取勾选树菜单节点
			},
			handleClicks(data,checked, indeterminate) {
				this.getCheckboxData = data;
           		 this.i++;
            		if(this.i%2==0){
                	if(checked){
                    	this.$refs.tree.setCheckedNodes([]);
                    	this.$refs.tree.setCheckedNodes([data]);
                    	//交叉点击节点
               		 }else{
                     this.$refs.tree.setCheckedNodes([]);
                    	//点击已经选中的节点，置空
                	 }
            		}
      },
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},	
			toNum(str) {
				return str.replace(/\,|\￥/g, "");
			},
			//金额两位小数点千位分隔符，四舍五入
			testPrice(item){
				var money = item.CHECKCOST;
				item.CHECKCOST = this.toFixedPrice(money);
			},	
			toFixedPrice(price){
				var res = 0;
				var money = price;
				var re = /^[0-9]+.?[0-9]*$/;
				if (!re.test(money)||money == '') {
	　　　　 res = 0.00;
	　　　　 return;
		　　}else{
					var num = parseFloat(this.toNum(money)).toFixed(2).toString().split(".");
					num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
					res = num.join(".");
				}
				return res;
			},
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			//所属上级
			getDept(item) {
				this.$refs.deptchild.visible(item);
				this.deptindex = item;
			},
			//取到分包方
			deptdata(value){
				this.deptindex.VENDOR = value[0];//id
				this.deptindex.VENDORDesc = value[1];//名称
				this.deptindex.DEPTTYPE = value[2];//机构属性id
				this.deptindex.DEPTTYPEDesc = value[3];//机构属性名称
			},
			getCheckedNodes() {
				this.checkedNodes = this.$refs.tree.getCheckedNodes()
			},
			loadMore () {
			   if (this.loadSign) {
			     this.loadSign = false
			     this.page.currentPage++
			     if (this.page.currentPage > Math.ceil(this.page.totalCount/this.page.pageSize)) {
			       return
			     }
			     setTimeout(() => {
			       this.loadSign = true
			     }, 1000)
			     this.requestData();
			   }
			 },	
			toNum(str) {
				if(Object.prototype.toString.call(str)!="[object String]"){
					str = str.toString();
				}
				return str.replace(/\,|\￥/g, "");
			},
			checkMoney(obj){
				var tempValue=obj.value.replace(/(^s+)|(s+$)/g,'').replace('￥','');
				if(!tempValue){return}
				if(/^-?d+(.d+)?$/.test(tempValue)){
					obj.value="￥"+parseFloat(tempValue).toFixed(2);
				}else{
					alert('请输入合法的货币值！');
				return
				}
			},
			//金额两位小数点千位分隔符，四舍五入
			toPrice(){
				var money = document.getElementById("cost").value;
				var num = parseFloat(this.toNum(money)).toFixed(2).toString().split(".");
				num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
				this.dataInfo.CHECK_COST = num.join(".");
			},
			staPrice(){
				var money = document.getElementById("stacost").value;
				// this.initsta = money;
				var num = parseFloat(this.toNum(money)).toFixed(2).toString().split(".");
				num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
				// this.dataInfo.CHECTCOST="￥" + num.join(".");
				this.dataInfo.CONTRACTCOST = num.join(".");
			},
			actualPrice(){
				var money = document.getElementById("actualcost").value;
				var num = parseFloat(this.toNum(money)).toFixed(2).toString().split(".");
				num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
				this.dataInfo.ACTUALCOST = num.join(".");
			},
			reset() {					
				this.dataInfo={
					MAINGROUP:'',//主检组
					LEADER:'',//主检负责人
					STATE: '1',//流程状态
					STATEDesc:'编制',
					VERSION:'1',//版本
					TYPE:'1',//检验
					TYPEDesc:'检验',
					STATUS:'0',
					VENDOR:'',//委托单位编号
					R_VENDOR:'',//承建单位
					R_VENDORDesc:'',
					V_PERSON:'',//委托单位联系人
					V_PHONE:'',//电话号码
					ITEM_NAME:'',//样品名称
					ITEM_MODEL:'',//样品型号
					ITEM_QUALITY:'',//样品数量
					ITEM_SECRECY:'',//样品保密要求
					ITEM_METHOD:'委托方送样',//样品取样方式
					ITEM_DISPOSITION:'自提',//样品检后处理
					REPORT_FOMAT:'认证中心',//标识
					REPORT_MODE:'自取',//发送方式
					REPORT_NUM:'',//检验报告编号
					P_NAMEDesc:'',//生产单位
					P_NAME:'',//生产单位
					PRODUCT_UNIT:'',//生产单位的信用代码
					ITEM_STATUS:'',//样品状态
					P_NUM:'',
					P_VERSION:'',
					PRO_NUM:'',
					PRO_VERSION:'',
					PRODUCT_TYPE:'',
					PRODUCT:'',
					PAYMENT_METHOD:'',//付款方式
					COMPDATE:'',
					COMPMODE:'正常',//完成方式
					REMARKS:'',
					V_NAME:'',//委托单位名称
					V_ADDRESS:'',//委托单位地址
					V_ZIPCODE:'',
					ACTUAL_PERCENT:0,
					CHECK_COST:0,//合同费用
					ACTUALCOST:0,//实收费用
					CONTRACTCOST:0,//标准费用
					INSPECT_PROXY_PROJECList: [],
					INSPECT_PROXY_BASISList: [],
					CHECK_PROXY_CONTRACTList: [],
				};	  
			},
			handleClick(tab, event) {
		    },
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing;
				}
			},
			//生成工作任务单
			build(){
				this.$refs.dataInfo.validate((valid) => {
			    if (valid) {
					var Url = this.basic_url + '/api-apps/app/inspectPro/operate/createWorkorder';
					this.$axios.post(Url, {inspectpro:this.dataInfo}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '生成工作任务单成功',
								type: 'success'
							});
							this.close();
						}else{
							this.$message({
							message: '已经生成工作任务单，请勿重复生成',
							type: 'warning'
						});
						}
					}).catch((err) => {
					});
					}else{
			        this.show = true;
			        this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
						}
					});
			},
			sizeChange(val) {
				this.page.pageSize = val;
				this.requestData();
			},
			currentChange(val) {
				this.page.currentPage = val;
				this.requestData();
			},
			
			
			//样品名称
			addsample(type){
				this.$refs.samplechild.visible(type);
			},
			
			//刪除新建行
			deleteRow(index, row, listName){
				var TableName = '';
				if(listName =='basisList'){
					TableName = 'INSPECT_PROXY_BASIS';
				}else if(listName =='projectList'){
					TableName = 'INSPECT_PROXY_PROJEC';
				}else{
					TableName = 'CHECK_PROXY_CONTRACT';
				}
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/inspectPro/' + TableName +'/' + row.ID;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {}).then((res) => {
							if(res.data.resp_code == 0){
								this.dataInfo[TableName+'List'].splice(index,1);
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
					this.dataInfo[TableName+'List'].splice(index,1);
				}
			},
			//点击按钮显示弹窗
			visible() {
				this.$axios.get(this.basic_url + '/api-user/users/currentMap',{}).then((res)=>{
					this.dataInfo.DEPTID = res.data.deptId;
					this.dataInfo.ENTERBY = res.data.id;
					var date = new Date();
					this.dataInfo.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					this.dataInfo.TYPE = '1';
					this.dataInfo.TYPEDesc = '检验';
					this.dataInfo.R_VENDORDesc=this.$store.state.currentcjdw[0].fullname;
					this.dataInfo.R_VENDOR=this.$store.state.currentcjdw[0].id;
					this.show = true;
				}).catch((err) => {
				})
				this.dataInfo.STATUS = 0;
        this.addtitle = true;
				this.modifytitle = false;
				this.viewtitle = false;
				this.views = false; //
				this.noviews = true;
				this.edit = true;
				this.noedit = false;
				this.special=true;
				this.special1=false;
			},
			//
			detailgetData() {
			var url = this.basic_url +'/api-apps/app/inspectPro/' + this.dataid;
				this.$axios.get(url, {}).then((res) => {
					// 依据
					for(var i = 0;i<res.data.INSPECT_PROXY_BASISList.length;i++){
						res.data.INSPECT_PROXY_BASISList[i].isEditing = false;
					}
					// 要求
					for(var m = 0;m<res.data.INSPECT_PROXY_PROJECList.length;m++){
						res.data.INSPECT_PROXY_PROJECList[m].isEditing = false;
						res.data.INSPECT_PROXY_PROJECList[m].INSPECT_GROUP = Number(res.data.INSPECT_PROXY_PROJECList[m].INSPECT_GROUP);
					}
					// 分包要求
					for(var n = 0;n<res.data.CHECK_PROXY_CONTRACTList.length;n++){
						res.data.CHECK_PROXY_CONTRACTList[n].isEditing = false;
						if(res.data.CHECK_PROXY_CONTRACTList[n].CHECKCOST.indexOf(',')==-1){
							res.data.CHECK_PROXY_CONTRACTList[n].CHECKCOST = this.toFixedPrice(res.data.CHECK_PROXY_CONTRACTList[n].CHECKCOST);
						}
						
						res.data.CHECK_PROXY_CONTRACTList[n].INSPECT_GROUP = Number(res.data.CHECK_PROXY_CONTRACTList[n].INSPECT_GROUP);
					}		
				
					res.data.LEADER = Number(res.data.LEADER);
					this.getmaingroup(res.data.MAINGROUP);
					if(res.data.CNAS_OR_CMA_ID=='1'){
						 res.data.CNAS_OR_CMA_ID=true;
					}
					if(res.data.MAINGROUP==''){
						 res.data.MAINGROUP='';
					}else{
						res.data.MAINGROUP = Number(res.data.MAINGROUP);
					}
					if(res.data.LEADER==''){
						 res.data.LEADER='';
					}else{
						res.data.LEADER = Number(res.data.LEADER);
					}
				
					this.dataInfo = res.data;
					this.RVENDORSelect();
					this.show = true;
					//深拷贝数据
					let _obj = JSON.stringify(this.dataInfo);
        			this.DataInfo = JSON.parse(_obj);
				}).catch((err) => {
				});
			},	
			
			// 这里是修改
			detail(dataid) {
				this.dataid=dataid;
				var usersUrl = this.basic_url + '/api-user/users/currentMap'
				this.$axios.get(usersUrl, {}).then((res) => {
					this.dataInfo.DEPTID = res.data.deptId;//传给后台机构id
					this.dataInfo.CHANGEBY = res.data.id;
					var date = new Date();
					this.dataInfo.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err) => {
				});
				this.detailgetData();
				this.modifytitle = true;
				this.addtitle = false;
				this.viewtitle = false;
				this.noviews = true;
				this.views = false; //
				this.edit = true;
				this.noedit = false;
			},
			//这是查看
			view(dataid) {
				this.dataid=dataid;				
				this.modifytitle = false;
				this.addtitle = false;
				this.viewtitle = true;
				this.special1=true;
				this.views = true; //
				this.noviews = false;
				this.edit = true;
				this.noedit = true;
				this.special=true;
				this.isEditing=false;
				this.detailgetData();
				//判断启动流程和审批的按钮是否显示
				var url = this.basic_url + '/api-apps/app/inspectPro/flow/isStart/'+dataid;
				this.$axios.get(url, {}).then((res) => {
					if(res.data.resp_code==1){
						this.start=true;
						this.approval=false;
					}else{
						var url = this.basic_url + '/api-apps/app/inspectPro/flow/Executors/'+dataid;
						this.$axios.get(url, {}).then((res) => {
							var resullt=res.data.datas;
							var users='';
							for(var i=0;i<resullt.length;i++){
								users = users + resullt[i].username+",";
							}
							if(users.indexOf(this.username) != -1){
								this.approval=true;
								this.start=false;
							}else{
								this.approval=false;
								this.start=false;
							}
						});
					}
				});
			},
			//产品
			mianproduct(){
				if(!!this.dataInfo.P_NUM){
					var data={appname:this.appname,P_NUM:this.dataInfo.P_NUM};
					this.$refs.productchild.visible(data);
				}else{
				    this.$message({
							message: '请先选择产品类别',
							type: 'warning'
						});
				}
				
			},
			//产品类别
			miancategory(){
				var data={appname:this.appname};
				this.$refs.categorychild.visible(data);
			},
		
			//接到产品类别的值
			categorydata(val){
				if(this.pnum!=val[0]){
					this.dataInfo.PRO_NUM='';
					this.dataInfo.PRODUCT='';
					this.dataInfo.PRO_VERSION='';
					this.dataInfo.INSPECT_PROXY_PROJECList=[];
					this.dataInfo.INSPECT_PROXY_BASISList=[];
					this.dataInfo.P_NUM=val[0];
					this.dataInfo.PRODUCT_TYPE=val[1];
					this.dataInfo.P_VERSION=val[2];
				}
			},
			//接到产品的值
			appenddata(val){
				if(this.pronum!=val[0]){
					this.dataInfo.INSPECT_PROXY_PROJECList=[];
					this.dataInfo.INSPECT_PROXY_BASISList=[];
					this.dataInfo.PRO_NUM=val[0];
					this.dataInfo.PRODUCT=val[1];
					this.dataInfo.PRO_VERSION=val[2];
					this.dataInfo.ITEM_NAME=val[1];
				}
			},
			
			 
			//委托单位
			customarr(val){
				this.dataInfo.V_NAME=val[0];
				this.dataInfo.V_NAMEDesc=val[1];//
				this.dataInfo.V_ADDRESS=val[2];
				this.dataInfo.V_ZIPCODE=val[3];
				this.dataInfo.VENDOR=val[4];//委托单位的信用代码
				this.dataInfo.P_NAME=val[0];
				this.dataInfo.P_NAMEDesc=val[1];//生产单位
				this.dataInfo.PRODUCT_UNIT=val[4];//生产单位的信用代码
				if(val[5]==1){
					this.dataInfo.PRODUCE_TYPE=1;
					this.dataInfo.DEPUTE_TYPE=1;
				}else{
					this.dataInfo.PRODUCE_TYPE=2;
					this.dataInfo.DEPUTE_TYPE=2;
				}
				if(val[4]="falg"){
					this.dataInfo.V_PERSON='';
					this.dataInfo.V_PHONE='';
					this.special=true;
				}
			},
			custarr(val){
				//样品没有值的时候
				if(val[0]=='falg'){
				// this.dataInfo.P_NAME='';
				this.dataInfo.ITEM_NAME='';
				this.dataInfo.ITEM_MODEL='';
				this.dataInfo.ITEM_QUALITY='';
				this.dataInfo.ITEM_STATUS='';
				this.dataInfo.ITEM_ID='';
				this.dataInfo.ITEM_SECRECY='';
				this.dataInfo.PRODUCT_TYPE='';
				this.dataInfo.PRODUCT='';
				// this.dataInfo.ITEM_METHOD='';
				// this.dataInfo.ITEM_DISPOSITION='';
				this.special1=false;
				this.special=true;

				}else{
				//样品有值的时候
				this.dataInfo.P_NAME=val[0];//生产单位
				this.dataInfo.ITEM_NAME=val[1];//样品名称
				this.dataInfo.ITEM_ID=val[2];//样品id
				this.dataInfo.ITEMNUM=val[3]//样品数量
				this.dataInfo.ITEM_MODEL=val[4];//模型
				this.dataInfo.ITEM_QUALITY=val[5];//质量
				this.dataInfo.PRODUCT=val[6];//产品名称
				this.dataInfo.PRODUCT_TYPE=val[7];//产品类别
				this.dataInfo.PRO_NUM=val[8];//产品编号
				this.dataInfo.PRO_VERSION=val[9];//产品版本
				this.dataInfo.P_NUM=val[10];//产品类别编号
				this.dataInfo.P_VERSION=val[11];//产品类别版本
				this.dataInfo.P_NAME=val[12];//生产单位名称id
				this.dataInfo.P_NAMEDesc=val[13];//生产单位name
				this.special1=true;
				this.special=true;
				this.special2=true;//样品名称
				}
			},
			vendor(val){
				this.dataInfo.VENDOR=val[0];
				// DEPUTE_TYPE  委托单位类型（中心内/中心外）
				if(!!val[0]){
					  this.dataInfo.PRODUCE_TYPE=1
						this.dataInfo.DEPUTE_TYPE=1;
				}else{
						this.dataInfo.DEPUTE_TYPE=2;
						this.dataInfo.PRODUCE_TYPE=2;
				}
			},
			//分包要求检验依据编号
			testbasisnum(value){
				this.deptindex.S_NUM = value;
				this.deptindex.PROJ_NUM ='';//检测项目编号
				this.deptindex.PROJECT_ID ='';//检测项目ID
				this.deptindex.P_REMARKS = '';//检测项目
				this.deptindex.PROJ_VERSIONNUM ='';	//检测项目编号+版本
			},
			//分包要求检验依据名称
			testbasisname(value){
				this.deptindex.BASIS = value;
			},
			//检测依据编号+版本
			testbasisprover(value){
				this.deptindex.S_VERSIONNUM = value;
			},
			//检验项目放大镜
			basisleadbtn2(val){
				// this.deptindex = val;
				if(val == 'maintable'){
					if(this.dataInfo.INSPECT_PROXY_BASISList.length==0 ){
						this.$message({
							message: '请先选择检验依据列表数据',
							type: 'warning'
						});
					}else{
						this.$refs.projectchild.projectlead();
					}
				}
			},
			//检验依据放大镜
			basisleadbtn(val){
				var snum=this.dataInfo.INSPECT_PROXY_BASISList;
				var basislist=[];
				for(var i=0;i<snum.length;i++){
          	basislist.push(snum[i].S_NUM);
				}
				var basisnums=basislist.join(',');
				this.inistinspectproxy=(this.dataInfo.INSPECT_PROXY_BASISList).join(',');
				this.deptindex = val;
				//子表
				if(val == 'maintable'){
					if(this.dataInfo.PRO_NUM == null || this.dataInfo.PRO_NUM == '' || this.dataInfo.PRO_NUM == undefined){
						this.$message({
							message: '请先选择产品名称',
							type: 'warning'
						});
					}else{
						var data={
							P_NUM:this.dataInfo.P_NUM,
							PRO_NUM:this.dataInfo.PRO_NUM,
							S_NUM:basisnums,
						}
						this.$refs.standardchild.basislead(data);
						this.main = 'main';
					}
				}else{
					if(this.deptindex.PRO_NUM == null || this.deptindex.PRO_NUM == '' || this.deptindex.PRO_NUM == undefined){
						this.$message({
							message: '请先选择产品名称',
							type: 'warning'
						});
					}else{
						this.$refs.standardchild.basislead(this.deptindex.PRO_NUM);
						this.main = 'table';
					}
				}
			},
			//检验依据列表赋值
			addbasis(val){
				// this.dataInfo.INSPECT_PROXY_BASISList=[];
				// this.dataInfo.INSPECT_PROXY_PROJECList=[];
				for(var i = 0;i<val.length;i++){
						var List={
								S_NUM: val[i].S_NUM,
								S_DESC: val[i].S_NAME,
								VERSION:val[i].VERSION,
						};
						this.dataInfo.INSPECT_PROXY_BASISList.push(List);
				}
			},
			 //检验项目列表
			addproject(value){
					for(var i = 0;i<value.length;i++){
						value[i].P_DESC = value[i].P_NAME;
						this.dataInfo.INSPECT_PROXY_PROJECList.push(value[i]);
				}
			},
			//检验要求与项目
			testprojectnum(value){
				this.deptindex.PROJ_NUM = value;
			},
			testprojectname(value){
				this.deptindex.P_REMARKS = value;
			},
			testprojectid(value){
				this.deptindex.PROJECT_ID = value;
			},
			testprojectprover(value){
				this.deptindex.PROJ_VERSIONNUM = value;
			},
			//中心外机构
			  cusinspect(val){
					for(var i = 0;i<val.length;i++){
							for(var j = 0;j<val[i].length;j++){
						var List={
								PROXY_CONTRACT_NUM: '',
								PROXYNUM: '',
								V_NAME:this.$store.state.currentcjdw[0].id,//委托单位
								V_NAMEDesc:this.$store.state.currentcjdw[0].fullname,//委托单位
								INSPECT_GROUP:'',
								PROJECT_ID:'',
								VENDOR: val[j][i].ID,//分包方名称
								VENDORDesc:val[j][i].NAME,//分包方名称
								DEPTTYPE:1,//机构属性id
								DEPTTYPEDesc:'中心外机构',//机构属性名称
								PT_NUM:'',//产品类别编号
								PRODUCT_TYPE:'',//产品类别
								PRO_NUM:'',//产品编号
								PRODUCT:'',//产品名称
								S_NUM:'',//检测依据编号
								BASIS: '',//检测依据
								PROJ_NUM:'',//检测项目编号
								P_REMARKS: '',//检测项目
								P_VERSIONNUM:'',	//产品类别编号+版本
								PRO_VERSIONNUM:'',	//产品名称编号+版本
								S_VERSIONNUM:'',	//检验检测依据编号+版本
								PROJ_VERSIONNUM:'',	//检测项目编号+版本
								REQUIRE: '',
								Q_TYPE: '',
								CHECKCOST: 0,
								STATUS:'1',
								isEditing: true
						};
							this.dataInfo.CHECK_PROXY_CONTRACTList.push(List);
						}
					}
				},
				//中心内机构
				withdepet(val){
							for(var i = 0;i<val.length;i++){
						var List={
								PROXY_CONTRACT_NUM: '',
								PROXYNUM: '',
							    V_NAME:this.$store.state.currentcjdw[0].id,//委托单位
								V_NAMEDesc:this.$store.state.currentcjdw[0].fullname,//委托单位
								INSPECT_GROUP:'',
								PROJECT_ID:'',
								VENDOR:val[i].dept,//承检单位
								VENDORDesc:val[i].deptname,//承检单位名称
								DEPTTYPE:2,//机构属性id
								DEPTTYPEDesc:'中心内机构',//机构属性名称
								PT_NUM:val[i].pt_num,//产品类别编号
								PRODUCT_TYPE:val[i].pt_name,//产品类别
								PRO_NUM:val[i].pro_num,//产品编号
								PRODUCT:val[i].pro_name,//产品名称
								S_NUM:val[i].s_num,//检测依据编号
								BASIS: val[i].s_name,//检测依据
								PROJ_NUM:val[i].p_num,//检测项目编号
								P_REMARKS: val[i].p_name,//检测项目
								P_VERSIONNUM:val[i].p_version,	//产品类别编号+版本
								PRO_VERSIONNUM:val[i].pro_version,	//产品名称编号+版本
								S_VERSIONNUM:val[i].s_version,	//检验检测依据编号+版本
								PROJ_VERSIONNUM:val[i].pro_version,	//检测项目编号+版本
								REQUIRE: '',
								Q_TYPE: '',
								CHECKCOST: 0,
								STATUS:'1',
								isEditing: true
						};
							this.dataInfo.CHECK_PROXY_CONTRACTList.push(List);
						}
				},
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');
			},
			open() {
				this.show = true;
			},
			toggle() {
				if(this.isok1 == true) {
					this.maxDialog();
				} else {
					this.rebackDialog();
				}
			},
			maxDialog() { //定义大弹出框一个默认大小
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
			showData(data){
				this.dataInfo.ITEM_NAME = data.appenddes;//名称
				this.dataInfo.ITEM_MODEL= data.appendmod;
				this.dataInfo.ITEM_QUALITY = data.appendqua;
				this.dataInfo.ITEM_ID = data.itemId;
				this.dataInfo.ITEM_STATUS = data.status;
				this.dataInfo.ITEM_STATUS = data.statusDesc;
			},
			//样品
			appenddes(value){
				this.dataInfo.ITEM_NAME = value;//名称
			},
			appendmod(value){
				this.dataInfo.ITEM_MODEL=value;
			},
			appendqua(value){
				this.dataInfo.ITEM_QUALITY=value;
			},
			linedata(value){
				this.dataInfo.R_VENDOR = value[0];
				this.dataInfo.R_VENDORDesc = value[1];
				this.dataInfo.P_NUM = value[2];
				this.dataInfo.PRODUCT_TYPE = value[3];
				this.dataInfo.PRO_NUM = value[4];
				this.dataInfo.PRODUCT = value[5];
				this.dataInfo.P_VERSION = value[6];//产品类别版本
				this.dataInfo.PRO_VERSION = value[7];//产品版本
				this.dataInfo.ITEMNUM = value[8];//样品编号
				this.dataInfo.MAINGROUP = '';
				this.dataInfo.LEADER = '';
				this.RVENDORSelect();
			},
			
			//生产单位名称
			appendnames(value){
				if(value.TYPE==1){
					this.dataInfo.P_NAMEDesc=value.NAME;
					this.dataInfo.PRODUCT_UNIT=value.CODE;
					this.dataInfo.P_NAME=value.ID;
					this.dataInfo.PRODUCE_TYPE=1;
				}else{
					this.dataInfo.PRODUCE_TYPE=2;
					this.dataInfo.P_NAMEDesc=value.fullname;
					this.dataInfo.P_NAME=value.id;
					this.dataInfo.PRODUCT_UNIT='';
				}
			},
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
			visablemaingroup:function(callback){    //只有回调参数为false时才触发 ctx.getAreaListDataSearch(vc,1)这个函数;
			    if(callback){
			    	if(this.dataInfo.R_VENDOR==""||this.dataInfo.R_VENDOR==undefined){
						this.$message({
							message: '请先输入承检单位',
							type: 'error'
						});
			    	}
			    }	
			},
			visableleader:function(callback){
				 if(callback){
			    	if(this.dataInfo.MAINGROUP==""||this.dataInfo.MAINGROUP==undefined){
						this.$message({
							message: '请先输入主检组',
							type: 'error'
						});
			    	}
			    }	
			},
			//主检组
			RVENDORSelect(){
				var url = this.basic_url + '/api-user/depts/findByPid/'+this.$store.state.currentcjdw[0].id;
				this.$axios.get(url, {}).then((res) => {
					this.maingroup = res.data;
				}).catch((err) => {
				});
			},
			//主检组带出主检负责人
			getmaingroup(maingroupid){
				if(!maingroupid){
					return;
				}
				this.dataInfo.LEADER = '';
				var url = this.basic_url + '/api-user/users/usersByDept?deptId='+maingroupid;
				this.$axios.get(url, {}).then((res) => {
					this.leaderdata = res.data.data;
				}).catch((err) => {
				});		
			},
			
			//生产单位
			getCustomer() {
					this.$refs.enterprisechild.getData();
			},
			//委托单位名称
			getinspect_cust(){
         this.$refs.inscustom.visible();	
			},
			//姓名
			addname(){
				var customid=this.dataInfo.V_NAME;//委托单位id
				if(customid==""||customid=="undenfiend"){
					this.$message({
						message: '请先选委托单位名称',
						type: 'warning'
					});
				}else{
					this.requestData();	
				}
			},
			
			requestData(){
				this.loading = true;
				var data = {
						page: this.page.currentPage,
						limit: this.page.pageSize,
					}
					var url = this.basic_url + '/api-apps/app/customer/CUSTOMER/'+ this.dataInfo.V_NAME;
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

						this.CUSTOMER_PERSONList = res.data.CUSTOMER_PERSONList;
						this.loading = false;
					});
					this.dialogVisibleuser = true;
			},
			
			addcusname(){
				if(this.selval.length == 0){
					this.$message({
						message: '请选择数据',
						type: 'warning'
					});
				}else if(this.selval.length > 1){
					this.$message({
						message: '不可同时选择多条数据',
						type: 'warning'
					});
				}else{
					this.dataInfo.V_PERSON = this.selval[0].PERSON;
					this.dataInfo.V_PHONE = this.selval[0].PHONE;
					this.resetBasisInfo2();//调用resetBasisInfo函数
				}
			},
			resetBasisInfo2(){//点击确定或取消按钮时重置数据20190303
				this.dialogVisibleuser = false;//关闭弹出框
				this.CUSTOMER_PERSONList = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 10;//页码重新传值
			},
			SelChange(val) {
				this.selval = val;
			},
			
			
        },
       
		mounted() {
			this.RVENDORSelect();
		},
	}
</script>

<style>
@import '../../assets/css/mask-modules.css';
.el-collapse-item__content {
    padding-bottom: 0px;
}
#cost{text-align: right}
#stacost{text-align: right}
#actualcost{text-align: right}
/*.el-form-item__error {
	top: 18%;
    left: 5px;
    background: #FFF;
    padding: 5px 10px;
}*/
</style>