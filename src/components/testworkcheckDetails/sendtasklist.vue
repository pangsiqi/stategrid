<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="viewtitle">下达任务</div>
					<div class="mask_anniu">
						<span class="mask_span mask_max" @click="toggle">
							<i v-bind:class="{'icon-maximization': isok1, 'icon-restore':isok2}"></i>
						</span>
						<span class="mask_span" @click="close">
							<i class="icon-close1"></i>
						</span>
					</div>
				</div>
				<div class="mask_content">
					<!-- status-icon 验证后文本框上显示对勾图标 -->
					<el-form inline-message :model="workorderForm" :label-position="labelPositions" :rules="rules" ref="workorderForm" >
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames">
								<!-- 样品信息 Begin-->
								<el-collapse-item title="样品信息" name="1">
									<!-- <div v-if="this.workorderForm.STATE!=3" class="check-btn-right">
										<el-button class="start" type="primary" round size="mini" @click="startup" v-show="start" ><i class="icon-check"></i> 接受此任务</el-button>
										<el-button class="start" type="warning" round size="mini" @click="sendback" v-show="start" ><i class="icon-back"></i> 回退</el-button>
									</div> -->
									<el-row :gutter="20" class="pb10">
										<el-col :span="4" class="pull-right">
											<el-input v-model="workorderForm.STATEDesc" :disabled="edit">
													<template slot="prepend">状态</template>
											</el-input>
										</el-col>
										<el-col :span="6" class="pull-right">
											<div class="el-input is-disabled el-input-group el-input-group--prepend">
												<div class="el-input-group__prepend">承检单位</div>
												<el-select clearable v-model="workorderForm.CJDW" filterable allow-create default-first-option placeholder="请选择承检单位" :disabled="noedit" @change="RVENDORSelect($event)">
													<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
												</el-select>
											</div>
										</el-col>
										<el-col :span="8" class="pull-right">
											<el-input placeholder="自动生成" v-model="workorderForm.WONUM" :disabled="edit">
													<template slot="prepend">工作任务单编号</template>
											</el-input>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="24">
											<el-form-item label="样品名称" prop="ITEM_NAME" label-width="110px">
												<el-input v-model="workorderForm.ITEM_NAME" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="addsample('workorder')" :disabled="edit"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="8">
											<el-form-item label="规格型号" prop="ITEM_MODEL" label-width="110px" >
												<el-input v-model="workorderForm.ITEM_MODEL" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="商标标识" prop="ITEM_TRADEMARK" label-width="110px">
												<el-input v-model="workorderForm.ITEM_TRADEMARK" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="样品编号" prop="ITEMNUM" label-width="110px">
												<el-input v-model="workorderForm.ITEMNUM" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="抽样日期" prop="CHECK_DATE" label-width="110px">
												<el-date-picker v-model="workorderForm.CHECK_DATE" type="date" placeholder="请选择抽样日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="edit">
												</el-date-picker>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="生产日期/批" prop="PRODUCT_DATE" label-width="110px">
												<el-input v-model="workorderForm.PRODUCT_DATE" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="8">
											<el-form-item label="样品状态" prop="ITEM_STATUSDesc" label-width="110px">
												<el-input v-model="workorderForm.ITEM_STATUSDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="到站日期" prop="ARRIVAL_DATE" label-width="110px">
												<el-date-picker v-model="workorderForm.ARRIVAL_DATE" type="date" placeholder="请选择到站日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="edit">
												</el-date-picker>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="样品来源" prop="ITEM_SOURCE" label-width="110px">
												<el-select v-model="workorderForm.ITEM_SOURCE" style="width: 100%" :disabled="edit">
													<el-option v-for="(data,index) in Select_ITEM_SOURCE" :key="index" :value="data.code" :label="data.name"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row >
										<el-col :span="8">
											<el-form-item label="样品来源" prop="ITEM_SOURCE" label-width="110px">
												<el-input-number type="number" v-model.number="workorderForm.ITEM_QUALITY" @change="handleChangeQuality" :min="1" :max="1000" label="描述文字" style="width: 100%" :disabled="edit"></el-input-number>
											</el-form-item>
										</el-col>
										
										<el-col :span="8" >
											<el-form-item label="产品类别" prop="PRODUCT_TYPE"  label-width="110px">
												<el-input v-model="workorderForm.PRODUCT_TYPE" :disabled="true">
													<el-button slot="append" :disabled="noedit" icon="el-icon-search" @click="addcategory"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8" >
											<el-form-item label="产品名称" prop="PRODUCT"  label-width="110px">
												<el-input v-model="workorderForm.PRODUCT" :disabled="true">
													<el-button slot="append" :disabled="noedit" icon="el-icon-search" @click="addproduct"></el-button>
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
												<el-input type="textarea" rows="5" v-model="workorderForm.CHECK_BASIS" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<!-- 检测 End-->

								<!-- 检测要求与样品信息 Begin-->
								<el-collapse-item title="检测要求与样品信息" name="4">
									<div class="clearfix pt10">
										<el-row>
											<el-col :span="24">
												<el-form-item label="委托方提供技术资料" label-width="140px">
													<el-input placeholder="请输入内容" v-model="workorderForm.TECHNICAL_INFORMATION" :disabled="noedit"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="24">
												<el-form-item label="特殊要求" label-width="140px">
													<el-input placeholder="请输入内容" v-model="workorderForm.SPECIAL_REQUIREMENTS" :disabled="noedit"></el-input>
												</el-form-item>
											</el-col>
										</el-row>
										<el-row>
											<el-col :span="8">
												<el-form-item label="样品接收人" label-width="140px">
													<el-input v-model="workorderForm.ITEM_RECCEPT_USERDesc" :disabled="true">
														<el-button slot="append" icon="el-icon-search" @click="addperson('ITEM_RECCEPT_USER')" :disabled="noedit"></el-button>
													</el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="样品接收日期" label-width="140px">
													<el-date-picker v-model="workorderForm.ITEM_RECEPT_DATE" type="date" placeholder="请选择样品接收日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="noedit">
													</el-date-picker>
												</el-form-item>
											</el-col>
											
										</el-row>

										<el-row>
											<el-col :span="8">
												<el-form-item label="完成日期" prop="COMPLETE_DATE" label-width="140px">
													<el-date-picker v-model="workorderForm.COMPLETE_DATE" type="date" placeholder="请选择完成日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="noedit">
													</el-date-picker>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="完成方式" label-width="120px">
													<el-radio-group v-model="workorderForm.COMPLETE_MODE" :disabled="noedit">
														<el-radio v-for="(data,index) in Select_COMPLETE_MODE" :key="index" :label="data.code">{{data.name}}</el-radio>
													</el-radio-group>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="样品接收状态" label-width="120px">
													<el-radio-group v-model="workorderForm.ITEM_RECEPT_STATUS" :disabled="noedit">
														<el-radio v-for="(data,index) in Select_ITEM_RECEPT_STATUS" :key="index" :label="data.code">{{data.name}}</el-radio>
													</el-radio-group>
												</el-form-item>
											</el-col>
										</el-row>

										<el-row>
											<el-col :span="8">
													<el-form-item label="样品承接人(专业组)" prop="ITEM_PROFESSIONAL_GROUPDesc" label-width="140px">
														<el-select clearable v-model="workorderForm.ITEM_PROFESSIONAL_GROUPDesc" placeholder="请选择" style="width: 100%;" :disabled="noedit"  @change="getgroup($event)">
															<el-option v-for="(data,index) in maingroup" :key="index" :value="data.id" :label="data.fullname"></el-option>
														</el-select>
													</el-form-item>
											</el-col>
										
											<el-col :span="8">
												<el-form-item label="样品承接日期" label-width="150px">
													<el-date-picker v-model="workorderForm.UNDERTAKE_DATE" type="date" placeholder="请选择完成日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="noedit">
													</el-date-picker>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="样品状态" prop="ITEM_STATU" label-width="120px">
													<el-input v-model="workorderForm.ITEM_STATU" :disabled="noedit"></el-input>
												</el-form-item>
											</el-col>
										</el-row>

										<el-row>
											<el-col :span="8">
												<el-form-item label="样品返回数量" label-width="140px">
													<el-input-number type="number" v-model.number="workorderForm.ITEM_RETURN_QUALITY" @change="handleChangeQuality" :min="1" :max="1000" label="描述文字" style="width: 100%;" :disabled="noedit"></el-input-number>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="样品检后状态" label-width="150px">
													<el-radio-group v-model="workorderForm.ITEM_CHECK_STATUS" :disabled="noedit">
														<el-radio v-for="(data,index) in Select_ITEM_CHECK_STATUS" :key="index" :label="data.code">{{data.name}}</el-radio>
													</el-radio-group>
												</el-form-item>
											</el-col>
										</el-row>

										<el-row>
											<el-col :span="8">
												<el-form-item label="样品返回接收人" label-width="140px">
													<el-input v-model="workorderForm.RETURN_ITEM_USERDesc" :disabled="edit">
														<el-button slot="append" icon="el-icon-search" @click="addperson('3')" :disabled="noedit"></el-button>
													</el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="样品返回日期" label-width="150px">
													<el-date-picker v-model="workorderForm.RETURN_ITEM_DATE" type="date" placeholder="请选择完成日期" value-format="yyyy-MM-dd" style="width: 100%;" :disabled="noedit">
													</el-date-picker>
												</el-form-item>
											</el-col>
										
											<el-col :span="8">
												<el-form-item label="样品处置" label-width="120px">
													<el-select v-model="workorderForm.ITEM_MANAGEMENT" style="width: 100%" :disabled="noedit">
														<el-option v-for="(data,index) in Select_ITEM_MANAGEMENT" :key="index" :value="data.code" :label="data.name"></el-option>
													</el-select>
												</el-form-item>
											</el-col>
										</el-row>

										<el-row>
											<el-col :span="8">
												<el-form-item label="样品承接人" label-width="140px">
													<el-input v-model="workorderForm.ITEM_UNDERTAKE_USERDesc" :disabled="edit">
														<el-button slot="append" icon="el-icon-search" @click="addperson('sampleget')" :disabled="noedit"></el-button>
													</el-input>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="专业技术/质量负责人" label-width="150px">
													<el-input v-model="workorderForm.PROFESSIONALDesc" :disabled="edit">
														<el-button slot="append" icon="el-icon-search" @click="addperson('qualityperson')" :disabled="noedit"></el-button>
													</el-input>
												</el-form-item>
											</el-col>
										</el-row>
									</div>
								</el-collapse-item>
								<!-- 检测要求与样品信息 End -->
								
								<div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion>
									<el-tabs v-model="activeName" @tab-click="handleClick">
										<!--检测项目与要求 Begin-->
										<el-tab-pane label="检测项目与要求" name="first">
											<el-table :data="workorderForm.WORKORDER_PROJECTList" border stripe :fit="true" max-height="260"
											 @cell-click="iconOperation" style="width: 100%;" 
											 :summary-method="getSummaries" :show-summary="true"
											 :default-sort="{prop:'workorderbasisList', order: 'descending'}" @selection-change="SelChange">
												<el-table-column type="selection" width="30" fixed align="center">
												</el-table-column>
												<el-table-column label="检验/检测依据" prop="S_NAME" sortable  width="350px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_PROJECTList.'+scope.$index + '.REMARKS'" >
															<el-input size="small" v-model="scope.row.S_NAME" placeholder="请输入">
                              </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="P_DESC" label="检测项目名称" sortable width="240px">
													<template slot-scope="scope">
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.P_DESC" placeholder="请输入">	
														</el-input>
														<span v-else>{{scope.row.P_DESC}}</span>
													</template>
												</el-table-column>

												<el-table-column prop="REMARKS" label="要求" sortable width="150px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_PROJECTList.'+scope.$index + '.REMARKS'" >
															<el-input size="small" v-model="scope.row.REMARKS" placeholder="请输入">
                              </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="INSPECT_GROUP" label="专业组" sortable  width="150px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_PROJECTList.'+scope.$index + '.INSPECT_GROUP'" >
															<el-select clearable v-model="scope.row.INSPECT_GROUP" placeholder="请选择"  @change="getleader($event,'PROJECTLIST',scope.$index,'add')" >
																<el-option v-for="data in maingroups" :key="data.id" :value="data.id" :label="data.fullname"></el-option>
															</el-select>
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="LEADER" label="责任人" sortable width="150px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_PROJECTList.'+scope.$index + '.LEADER'" >
															<el-select clearable v-model="scope.row.LEADER" placeholder="请选择"  @change="visableleader($event,PROJECTLIST,scope.$index)" >
																<el-option v-for="data in leader" :key="data.id" :value="data.id" :label="data.nickname"></el-option>
															</el-select>
														</el-form-item>	
													</template>
												</el-table-column>

                        <el-table-column prop="ASSIST_PERSION" label="助手" sortable width="150px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_PROJECTList.'+scope.$index + '.ASSIST_PERSION'" >
															<el-select clearable v-model="scope.row.ASSIST_PERSION" placeholder="请选择"  multiple >
																<el-option v-for="data in assistant" :key="data.id" :value="data.id" :label="data.nickname"></el-option>
															</el-select>
														</el-form-item>	
													</template>
												</el-table-column>
												<el-table-column prop="QUATITY" label="样品数量" sortable width="160px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_PROJECTList.'+scope.$index + '.QUATITY'" >
															<el-input size="small" v-model="scope.row.QUATITY" placeholder="请输入">
                              </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="COMPLETE_MODE" label="完成方式" sortable width="250px">
													<template slot-scope="scope">
														<el-radio-group v-model="scope.row.COMPLETE_MODE">
																<el-radio label="加急" class="red"></el-radio>
																<el-radio label="正常"></el-radio>
														</el-radio-group>
													</template>
												</el-table-column>

												<el-table-column prop="COMPLETE_DATE" label="完成日期" sortable width="180px">
													<template slot-scope="scope">
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.COMPLETE_DATE" placeholder="请输入"></el-input>
														<span v-else>{{scope.row.COMPLETE_DATE}}</span>
													</template>
												</el-table-column>
											</el-table>
										</el-tab-pane>
										<!--检测项目与要求 End-->
										<!--分包项目 Begin-->
										<el-tab-pane label="分包项目" name="second">
											<el-table :data="workorderForm.WORKORDER_CONTRACTList" row-key="ID"
											 border stripe :fit="true" highlight-current-row="highlight-current-row" 
											 :summary-method="getSummarie" :show-summary="true" 
											 style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'workorderForm.WORKORDER_CONTRACTList', order: 'descending'}" @selection-change="SelChanges">
												
												<el-table-column type="selection" width="30" fixed align="center">
												</el-table-column>
												<el-table-column prop="VENDOR" label="承包方单位名称" sortable width="260px">
													<template slot-scope="scope">
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.VENDOR">
														</el-input>
														<span v-else>{{scope.row.VENDOR}}</span>
													</template>
												</el-table-column>

												<el-table-column prop="BASIS" label="检验/检测标准依据" sortable width="200px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_CONTRACTList.'+scope.$index + '.BASIS'" >
															<el-input size="small" v-model="scope.row.BASIS" placeholder="请输入">
                              </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="PROXYNUM" label="项目名称" sortable width="200px">
													<template slot-scope="scope">
														<el-input :disabled="true" v-if="scope.row.isEditing" size="small" v-model="scope.row.PROXYNUM" placeholder="请输入">
														</el-input>
														<span v-else>{{scope.row.PROXYNUM}}</span>
													</template>
												</el-table-column>

												<el-table-column prop="REQUIRES" label="检验检测项目要求" sortable  width="240px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_CONTRACTList.'+scope.$index + '.REQUIRES'" >
															<el-input size="small" v-model="scope.row.REQUIRES" placeholder="请输入">
                              </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="INSPECT_GROUP" label="专业组" sortable  width="150px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_CONTRACTList.'+scope.$index + '.INSPECT_GROUP'" >
															<el-select clearable v-model="scope.row.INSPECT_GROUP" placeholder="请选择"    @change="getleader($event,'CONTRACTList',scope.$index,'add')">
																<el-option v-for="data in maingroups" :key="data.id" :value="data.id" :label="data.fullname"></el-option>
															</el-select>
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="LEADER" label="责任人" sortable width="150px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_CONTRACTList.'+scope.$index + '.LEADER'" >
															<el-select clearable v-model="scope.row.LEADER" placeholder="请选择"  @change="visableleader($event,CONTRACTList,scope.$index)" >
																<el-option v-for="data in leader" :key="data.id" :value="data.id" :label="data.nickname"></el-option>
															</el-select>
														</el-form-item>	
													</template>
												</el-table-column>

                        <el-table-column prop="ASSIST_PERSION" label="助手" sortable width="150px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_CONTRACTList.'+scope.$index + '.ASSIST_PERSION'" >
															<el-select clearable v-model="scope.row.ASSIST_PERSION" placeholder="请选择"  multiple>
																<el-option v-for="data in assistant" :key="data.id" :value="data.id" :label="data.nickname"></el-option>
															</el-select>
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="QUATITY" label="样品数量" sortable width="110px">
													<template slot-scope="scope">
														<el-form-item :prop="'WORKORDER_CONTRACTList.'+scope.$index + '.QUATITY'" >
															<el-input size="small" v-model="scope.row.QUATITY" placeholder="请输入">
                              </el-input> 
														</el-form-item>	
													</template>
												</el-table-column>

												<el-table-column prop="COMPLETE_MODE" label="完成方式" sortable width="250px">
													<template slot-scope="scope">
														<el-radio-group v-model="scope.row.COMPLETE_MODE">
																<el-radio label="加急" class="red"></el-radio>
																<el-radio label="正常"></el-radio>
														</el-radio-group>
													</template>
												</el-table-column>

												<el-table-column prop="COMPLETE_DATE" label="完成日期" sortable width="220px">
													<template slot-scope="scope">
														<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.COMPLETE_DATE" placeholder="请选择"></el-input>
														<span v-else>{{scope.row.COMPLETE_DATE}}</span>
													</template>
												</el-table-column>
											</el-table>
										</el-tab-pane>
										<!--分包项目 End-->
									</el-tabs>
									<!-- 备注 Begin-->
									<el-row class="pt10">
										<el-col :span="24">
											<el-form-item label="备注" prop="MEMO" label-width="45px">
												<el-input type="textarea" rows="3" v-model="workorderForm.MEMO" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<!-- 备注 End-->
								</div>
								
								<!-- 录入人信息 Begin-->
								<!-- <el-collapse-item title="其他" name="7" v-show="views">
									<el-row >
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc">
												<el-input v-model="workorderForm.ENTERBYDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE">
												<el-input v-model="workorderForm.ENTERDATE" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构" prop="DEPTIDDesc">
												<el-input v-model="workorderForm.DEPTIDDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row >
										<el-col :span="8">
											<el-form-item label="修改人" prop="CHANGEBYDesc">
												<el-input v-model="workorderForm.CHANGEBYDesc" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="CHANGEDATE">
												<el-input v-model="workorderForm.CHANGEDATE" :disabled="true"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item> -->
								<!-- 录入人信息 End -->
							</el-collapse>
						</div>
						<div class="content-footer" v-show="views">
							<el-button type="primary" @click="submitForm">确定</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
			
			<!--委托书编号-->
			<inspectmask ref="inspectchild" @appendpro="appendpro" @appendver="appendver"></inspectmask>
			<!-- 样品名称  -->
			<sampletmask ref="samplechild" @appendname="appendname" @appendmod="appendmod" @appendsta="appendsta" @appendite="appendite"></sampletmask>
			<!-- 原始模版  -->
			<!-- <templatemask ref="templatechild" @showModule="showModule"></templatemask> -->
			<!-- 产品类别  -->
			<categorymask ref="categorychild" @categorydata="categorydata"></categorymask>
			<!-- 产品名称  -->
			<productmask ref="productchild" @appenddata="appenddata"></productmask>
			<!-- 检验依据  -->
			<!-- <teststandardmask ref="standardchild" @testbasis="addbasis"></teststandardmask> -->
			<!-- 检验项目 -->
      		<testprojectmask ref="projectchild" @testproject="addproject"></testprojectmask>
			<!-- 查看子任务单  -->
			<!-- <checkchildlist ref="checkchildlist"></checkchildlist> -->
			<!-- 生成报告弹出显示数据  -->
			<!-- <reportdata ref="reportdata" @reportdatavalue = "reportdatavalue"></reportdata> -->
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import inspectmask from '../common/common_mask/inspectmask.vue'//委托书
	import sampletmask from '../common/common_mask/samplemask.vue'//样品
	import templatemask from '../common/common_mask/templatemask.vue'//模版
	import { Loading } from 'element-ui'
	import categorymask from '../common/common_mask/categorylistmask.vue'//产品类别
	import productmask from '../common/common_mask/productlistmask.vue'//产品
	// import teststandardmask from '../common/common_mask/teststandardmask.vue'//检验依据
	import testprojectmask from '../common/common_mask/testprojectmask.vue'//检验依据
	// import checkchildlist from './checkchildlist.vue'//查看子任务单
	import reportdata from './reportdata.vue'//生成报告弹出显示数据
	export default {
		name: 'masks',
		components: {
			 inspectmask,
			 sampletmask,
			 templatemask,
			 categorymask,
			 productmask,
			//  teststandardmask,
			 testprojectmask,
			//  checkchildlist,
			 reportdata
		},
		data() {
			return {
				approvingData:{},//流程传的数据
				file_url: Config.file_url,
				po_url: Config.po_url,
				dialogVisible2:false,
				workorderForm: {
					PROJ_NUM:'',
					WORKORDER_PROJECTList:[],//检测项目
					WORKORDER_CONTRACTList:[],//分包项目
				},
				PROJECTLIST:[],
				CONTRACTLIST:[],
				basic_url: Config.dev_url,
				commentArr:{},
				selMenu:[],
				leader:[],//负责人
				maingroups:[],//专业组
				assistant:[],//助手
				maingroupid:'',
				show: false,
				modify:false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				addtitle:true,//添加弹出框titile
				modifytitle:false,//修改弹出框titile
				viewtitle: false, //查看弹出框title
				views: false,
				edit: true, //禁填
				noedit:false,
				approval:false,
				start:false,
				activeName: 'first', //tabs
				activeNames: ['1','2','3','4','5','6','7'],//手风琴数量
				labelPositions: 'right', //表格
				selectData:[],//承检单位
				Select_ITEM_STATUS:[],//获取样品信息-样品状态
				Select_ITEM_SOURCE:[],//获取样品信息-样品来源
				Select_COMPLETE_MODE:[],//获取样品信息-完成方式
				Select_ITEM_RECEPT_STATUS:[],//获取样品信息-样品接收状态
				Select_ITEM_CHECK_STATUS:[],//获取样品信息-样品检后状态
				Select_ITEM_MANAGEMENT:[],//获取样品信息-样品处置
				fileList:[],//上传附件数据
				rules: {
					PROXYNUM: [{ required: true, trigger: 'blur', validator: this.Validators.isWorknumber}],//委托书编号
					PROXY_VERSION: [{ required: true, trigger: 'blur', validator: this.Validators.isNickname}],//委托书版本
					WONUM: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isWorknumber}
					],//工作任务单编号
					ITEM_NAME: [{ required: true, trigger: 'blur', validator: this.Validators.isSpecificKey}],//样品名称
					ITEM_MODEL: [{ required: true, trigger: 'blur', validator: this.Validators.isSpecificKey}],//规格型号
					// ITEMNUM: [{ required: true, trigger: 'blur', validator: this.Validators.isWorknumber}],//样品编号
					// ITEM_STATU: [{ required: true, message: '不能为空', trigger: 'blur' }],
					ITEM_STATUS: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					ITEM_SOURCE: [
						{ required: false, trigger: 'change', validator: this.Validators.isSpecificKey},
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
						{ required: false, message: '不能为空', trigger: 'change' },
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
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				isEditList: false,  //年度计划列表编辑装填
				selval:[],
				userList:[],
				samplesList:[],
				categoryList:[],
				numtips:'',
				workorder:'workorder',//appname
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				isEditing: true,
				modulenum:'',
				username:'',
				maingroup:[],//专业组
				docParm: {},
				reportname:'',//生成报告名称
				workorderreportid:'',//存放生成报告id
				btnshow:true,//报告提交按钮
				sendchilddata:[],//子表已有的值
				pronums:[],
				showcreatereoprt:false,//生成报告按钮
				reportvalue:{},//储存生成报告数据
				currentuserinfo:{},//储存当前用户信息
				showcreateagree:true,//生成分包协议按钮
				addPersonTable: ''
			};
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			SelChange(val) {
				this.PROJECTLIST = val;
			},
			SelChanges(val) {
				this.CONTRACTLIST = val;
			},
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing;
				}
			},
			handleClick(tab, event) {
//		        console.log(tab, event);
		   },
			
		
			appendpro(value){
				this.workorderForm.PROXYNUM =value;
					
			},
			appendver(value){
				this.workorderForm.PROXY_VERSION =value;
			},
			//样品
			addsample(type){
				this.$refs.samplechild.visible(type);
			},
			appendname(value){
				this.workorderForm.ITEM_NAME = value;//样品名称
			},
			appendmod(value){
				this.workorderForm.ITEM_MODEL = value;//样品名称
			},
			appendsta(value){
				this.workorderForm.ITEM_STATUS = value;//样品名称
			},
			appendite(value){
				this.workorderForm.ITEMNUM = value;//样品名称
			},
			addperson(num,opt){
				//opt主要是区是哪个子表添加人员
				this.getuser();
				this.numtips = num;
				this.addPersonTable = opt;
				this.dialogVisible2 = true;
			},
			//检测依据弹出框数据置空
			resetBasisInfo2(){
				this.dialogVisible2 = false;
				this.userList = [];
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 10;//页码重新传值
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
				this.workorderForm.WORKORDER_PROJECTList    = [];
				ITEM_PROFESSIONAL_GROUP:'';//清空承接人数据
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
					this.$refs.standardchild.basislead(this.sendchilddata);
					this.sendchilddata = [];
				}
			},
			// //检验依据列表
			// addbasis(value){
			// 	this.workorderForm.S_NUM = value[0];
			// 	for(var i = 1;i<value.length;i++){
			// 		value[i].S_DESC = value[i].S_NAME;
			// 	}
			// 	this.workorderForm.WORKORDER_PROJECTList = [];
			// },
		
			 //检验项目列表
			addproject(value){
				for(var i = 0;i<value.length;i++){
					value[i].P_DESC = value[i].P_NAME;
					this.workorderForm.WORKORDER_PROJECTList.push(value[i]);
				}
				for(var i = 0;i<this.workorderForm.WORKORDER_PROJECTList.length;i++){
					this.pronums.push(this.workorderForm.WORKORDER_PROJECTList[i].P_NUM);
				}
				this.workorderForm.PROJ_NUM = this.pronums.toString(',');
			},
			 
			// showModule(data){
			// 	this.modulenum.D_NUM = data.num;
			// 	this.modulenum.D_DESC = data.desc;
			// 	var url = this.file_url + '/file/fileList?page=0&size=10';
			// 	this.$axios.post(url,{
			// 		'appname': '检验检测项目_原始数据模板',
			// 		'recordid': data.id,
			// 	}).then((res) => {
			// 		this.modulenum.FILESIZE_ORG = res.data.fileList[0].filesize;
			// 		this.modulenum.FILEPATH_ORG = res.data.fileList[0].filepath;
			// 		this.modulenum.FILEID_ORG = res.data.fileList[0].fileid;
			// 	}).catch((err) => {
			// 	});
			// },
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
			},	
      		//刪除新建行
			deleteRow(index, row, listName){
				var TableName = '';
				if(listName =='basisList'){
					TableName = 'WORKORDER_BASIS';
				}else if(listName =='projectList'){
					TableName = 'WORKORDER_PROJECT';
				}else if(listName =='peopletList'){
					TableName = 'WORKORDER_CHECKPERSON';
				}else if(listName =='moduleList'){
					TableName = 'WORKORDER_DATA_TEMPLATE';
				}else{
					TableName = 'WORKORDER_ASSET';
				}
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/workorder/' + TableName +'/' + row.ID;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {}).then((res) => {
							if(res.data.resp_code == 0){
								this.workorderForm[TableName+'List'].splice(index,1);
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
					this.workorderForm[TableName+'List'].splice(index,1);
				}
			},
			//生成分包协议
			proagree(row){
				var data = {
					"WORKORDER_CONTRACTID":row.ID.toString(),
				};
				var url = this.basic_url +"/api-apps/app/workorder/operate/subproject";
				this.$axios.post(url,data).then((res) => {
					
					if(res.data.resp_code == 0) {
						this.$message({
							message: '生成成功',
							type: 'success'
						});
						this.showcreateagree = false;
					}
				}).catch((err) => {
				});
			},
			//启动流程
			startup(){
				var url = this.basic_url + '/api-apps/app/workorder/flow/'+this.dataid;
				this.$axios.get(url, {}).then((res) => {
					
					if(res.data.resp_code == 1) {
							this.$message({
								message:res.data.resp_msg,
								type: 'warning'
							});
				    }else{
				    	this.$message({
								message:res.data.resp_msg,
								type: 'success'
							});
							this.detailgetData();
							var url = this.basic_url + '/api-apps/app/workorder/flow/Executors/'+this.dataid;
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
			//回退按钮
			sendback(){

			},
			//审批流程
			approvals(){
				this.approvingData.id =this.dataid;
				this.approvingData.app=this.workorder;
				 var url = this.basic_url + '/api-apps/app/workorder/flow/isEnd/'+this.dataid;
		    		this.$axios.get(url, {}).then((res) => {
		    			if(res.data.resp_code == 0) {
							this.$message({
								message:res.data.resp_msg,
								type: 'warning'
							});
		    			}else{
		    				var url = this.basic_url + '/api-apps/app/workorder/flow/isExecute/'+this.dataid;
		    				this.$axios.get(url, {}).then((res) => {
				    			if(res.data.resp_code == 1) {
										this.$message({
											message:res.data.resp_msg,
											type: 'warning'
										});
								}else{
									var url = this.basic_url + '/api-apps/app/workorder/flow/customFlowValidate/'+this.dataid;
								this.$axios.get(url, {}).then((res) => {
				    				if(res.data.resp_code == 1) {
										this.$message({
											message:res.data.resp_msg,
											type: 'warning'
										});
									}else{
									 	this.$refs.approvalChild.visible();
									}
								})
								}
		    				});
		    			}
					});
			},
			//流程历史
			flowhistory(){
				this.approvingData.id =this.dataid;
				this.approvingData.app=this.workorder;
//			this.$refs.flowhistoryChild.open();
				this.$refs.flowhistoryChild.getdata(this.dataid);
			},
			//流程地图
			flowmap(){
				this.approvingData.id =this.dataid;
				this.approvingData.app=this.workorder;
				this.$refs.flowmapChild.getimage();
			},
			//当前责任人
			viewpepole(){
				this.approvingData.id =this.dataid;
				this.approvingData.app=this.workorder;
				this.$refs.vewPopleChild.getvewPople(this.dataid);
			},
			// //获取导入表格勾选信息
			// SelChange(val) {
			// 	this.selMenu = val;
			// },
		
			reprotids(val){

			},
		
			// reportdatavalue(value){
			// 	this.reportvalue = value;//储存生成报告数据
			// 	console.log(value);
			// 	this.workorderreportid = value.id;
      //           var obj = {
			// 		ID:value.ID,
      //               REPORTNUM:value.reportnum,
      //               REPORTNAME:value.reportname,
      //               FILEID:value.fileid,
      //               VERSION:value.version,
      //           }
      //           console.log(obj);
      //           this.workorderForm.WORKORDER_REPORTList.push(obj);
			// },
		
			detailgetData() {
				var url = this.basic_url +'/api-apps/app/workorder/' + this.dataid;
				this.$axios.get(url, {}).then((res) => {
					//项目
					for(var i = 0;i<res.data.WORKORDER_PROJECTList.length;i++){
						res.data.WORKORDER_PROJECTList[i].isEditing = false;
					}
					
					for(var i = 0;i<this.workorderForm.WORKORDER_CONTRACTList.length;i++){
						this.workorderForm.WORKORDER_CONTRACTList[i].INSPECT_GROUP = Number(this.workorderForm.WORKORDER_CONTRACTList[i].INSPECT_GROUP);
					}
					res.data.CJDW = Number(res.data.CJDW);
					res.data.ITEM_PROFESSIONAL_GROUP = Number(res.data.ITEM_PROFESSIONAL_GROUP);
					this.RVENDORSelect(res.data.CJDW);
					this.workorderForm = res.data;
					for(var i = 0;i<this.workorderForm.WORKORDER_CONTRACTList.length;i++){
						this.workorderForm.WORKORDER_CONTRACTList[i].INSPECT_GROUP = Number(this.workorderForm.WORKORDER_CONTRACTList[i].INSPECT_GROUP);
					}
					if(res.data.IS_MAIN == '1'){//是主任务单
						this.showcreatereoprt = true;//显示生成报告按钮
					}else{//不是主任务单
						this.showcreatereoprt = false;
					}
					this.show = true;
				}).catch((err) => {
				});
			},	
			// 这里是修改
			detail(dataid) {
				this.dataid=dataid;
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
	    			this.workorderForm.DEPTID = res.data.deptId;//传给后台机构id
					this.workorderForm.CHANGEBY = res.data.id;
					var date = new Date();
					this.workorderForm.CHANGEDATE = this.$moment(date).format("YYYY-MM-dd HH:mm:ss");
					
					this.docParm.recordid = dataid;
					this.docParm.appname = '工作任务单_关联原始数据模板';
					this.docParm.appid = '39';

					this.docParm.userid = res.data.id;
					this.docParm.username = res.data.username;
					this.docParm.deptid = res.data.deptId;
					this.docParm.deptfullname = res.data.deptName;
				}).catch((err) => {
				});
				this.detailgetData();
				this.btnshow = true;//显示报告提交按钮
				this.views = false;
				this.addtitle = false;
				this.modifytitle = true;
				this.viewtitle=false;
				this.modify = true;
				this.show = true;
				this.edit = true;
				this.noedit = false;
			},
			//这是查看
			view(dataid) {
				this.btnshow = true;//显示报告提交按钮
				this.dataid=dataid;	
				this.modifytitle = false;
				this.addtitle = false;
				this.viewtitle = true;
				this.views = true; //
				this.noviews = false;
				this.edit = true;
				this.noedit = true;
				//判断启动流程和审批的按钮是否显示

				var url = this.basic_url + '/api-apps/app/workorder/operate/subtaskList?WORKORDERID='+dataid;
					this.$axios.get(url, { }).then((res) => {
					res.data.datas.CJDW = Number(res.data.datas.CJDW);
					this.RVENDORSelect(res.data.datas.CJDW);
					// this.workorderForm = res.data;
					
					for(let i = 0;i<res.data.datas.WORKORDER_PROJECTList.length;i++){
						res.data.datas.WORKORDER_PROJECTList[i].INSPECT_GROUP = Number(res.data.datas.WORKORDER_PROJECTList[i].INSPECT_GROUP);
						this.getleader(res.data.datas.WORKORDER_PROJECTList[i].INSPECT_GROUP,'PROJECTLIST',i);
						res.data.datas.WORKORDER_PROJECTList[i].LEADER = Number(res.data.datas.WORKORDER_PROJECTList[i].LEADER);
						res.data.datas.WORKORDER_PROJECTList[i].ASSIST_PERSION = Number(res.data.datas.WORKORDER_PROJECTList[i].ASSIST_PERSION);
					}
					for(let i = 0;i<res.data.datas.WORKORDER_CONTRACTList.length;i++){
						res.data.datas.WORKORDER_CONTRACTList[i].INSPECT_GROUP = Number(res.data.datas.WORKORDER_CONTRACTList[i].INSPECT_GROUP);
						this.getleader(res.data.datas.WORKORDER_CONTRACTList[i].INSPECT_GROUP,'CONTRACTList',i);
						res.data.datas.WORKORDER_CONTRACTList[i].LEADER = Number(res.data.datas.WORKORDER_CONTRACTList[i].LEADER);
						res.data.datas.WORKORDER_CONTRACTList[i].ASSIST_PERSION = Number(res.data.datas.WORKORDER_CONTRACTList[i].ASSIST_PERSION);
					}
					// this.getleader(WORKORDER_CONTRACTList.INSPECT_GROUP);
							this.workorderForm = res.data.datas;
							this.show=true;
					}).catch((wrong) => {

					})
				// this.detailgetData();
				var url = this.basic_url + '/api-apps/app/workorder/flow/isStart/'+dataid;
				this.$axios.get(url, {}).then((res) => {
					
					if(res.data.resp_code==1){
						this.start=true;
						this.approval=false;
					}else{
						var url = this.basic_url + '/api-apps/app/workorder/flow/Executors/'+dataid;
						this.$axios.get(url, {}).then((res) => {
							
							res.data.CJDW = Number(res.data.CJDW);
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
			// 保存users/saveOrUpdate
			submitForm() {
				this.$refs.workorderForm.validate((valid) => {
		          if (valid) {
							//检验项目与要求的数据id
              var selectData= this.PROJECTLIST;
		          var deleteid = [];
		          var ids;
		          for(let i = 0; i < selectData.length; i++) {
		            deleteid.push(selectData[i].ID);
		          }
		          //ids为deleteid数组用逗号拼接的字符串
		          ids = deleteid.toString(',');
							// 分包项目的数据id
							var selectDatas= this.CONTRACTLIST;
							 //deleteid为id的数组
		          var deleteids = [];
		          var ides;
		          for(let i = 0; i < selectDatas.length; i++) {
		            deleteids.push(selectDatas[i].ID);
		          }
		          //ids为deleteid数组用逗号拼接的字符串
		          ides = deleteids.toString(',');
							var data = {
								WORKORDER:this.workorderForm,
								PROJECTLIST:ids,
								CONTRACTLIST:ides,
							}
							for(let i=0;i<this.workorderForm.WORKORDER_CONTRACTList.length;i++){
									this.workorderForm.WORKORDER_CONTRACTList[i].ASSIST_PERSION=this.workorderForm.WORKORDER_CONTRACTList[i].ASSIST_PERSION.toString(',')
							}
							for(let i=0;i<this.workorderForm.WORKORDER_PROJECTList.length;i++){
									this.workorderForm.WORKORDER_PROJECTList[i].ASSIST_PERSION=this.workorderForm.WORKORDER_PROJECTList[i].ASSIST_PERSION.toString(',')
							}
				  // /app/workorder/operate/subtask?WORKORDER=this.dataInfo&PROJECTLIST&CONTRACTLIST
					var url = this.basic_url + '/api-apps/app/workorder/operate/subtask';
					this.$axios.post(url,{WORKORDER:this.workorderForm,PROJECTLIST:ids,CONTRACTLIST:ides}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '下达成功',
								type: 'success'
							});
						}
					}).catch((err) => {
					});
			    } else {
							return false;
						}
					});
			},
			//查看子任务单
			// checkchildlist(){
			// 	this.$refs.checkchildlist.visible(this.workorderForm.ID);
			// },
			
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');
				//this.resetNew();
			},
			toggle(e) {
				if(this.isok1 == true) {
					this.maxDialog();
				} else {
					this.rebackDialog();
				}
			},
			maxDialog(e) { //大弹出框距离头部少60px
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
			
			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.resetBasisInfo2();
					})
					.catch(_ => {
						console.log('取消关闭');
						$('.v-modal').hide();
					});
			},
			getUser(){//获取当前用户信息
					var url = this.basic_url + '/api-user/users/currentMap';
					this.$axios.get(url, {}).then((res) => {//获取当前用户信息
					this.currentuserinfo = res.data;
				 	this.userid = res.data.id;
	        this.username = res.data.username;
					this.deptid = res.data.deptId;
					this.deptfullname = res.data.deptName;
	            }).catch((err) => {
	            });
			},
			getgroup(){//获取专业组信息
			var url = this.basic_url + '/api-user/depts/findDeptList/'+this.$store.state.currentcjdw[0].id;
			this.$axios.get(url, {}).then((res) => {
			this.maingroups=res.data;
	    	}).catch((err) => {
	      });
				
			},
			getleader(maingroupid,PROJECTLIST,index,add){
				this.maingroupid=maingroupid;
				if(!maingroupid){
					return;
				}
			  if(!!add){
					if(PROJECTLIST=='PROJECTLIST'){
					this.workorderForm.WORKORDER_PROJECTList[index].LEADER='';
					this.workorderForm.WORKORDER_PROJECTList[index].ASSIST_PERSION=[];
					}else{
						this.workorderForm.WORKORDER_CONTRACTList[index].LEADER='';
						this.workorderForm.WORKORDER_CONTRACTList[index].ASSIST_PERSION=[];
					}
				}
				var url = this.basic_url + '/api-user/users/usersByDept?deptId='+maingroupid;
				this.$axios.get(url, {}).then((res) => {
					this.leader = res.data.data;
				}).catch((err) => {
				});		
			},
			visableleader(leader,PROJECTLIST,index){
				if(!leader){
						return;
				}
				if(PROJECTLIST==PROJECTLIST){
					this.workorderForm.WORKORDER_PROJECTList[index].ASSIST_PERSION=[];
				}else{
					this.workorderForm.WORKORDER_CONTRACTList[index].ASSIST_PERSION=[];
				}
				var url = this.basic_url + '/api-user/users/usersByDept?deptId='+this.maingroupid;
				this.$axios.get(url, {}).then((res) => {
					var leaders = res.data.data;
					for(var i=0;i<leaders.length;i++){
          if(leader==leaders[i].id){
						  leaders.splice(i, 1); //删除下标为i的元素                
					}
				}
				this.assistant=leaders;
				}).catch((err) => {
				});
				
			},
			getSummaries(param) {
        //param 是固定的对象，里面包含 columns与 data参数的对象 {columns: Array[4], data: Array[5]},包含了表格的所有的列与数据信息
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计';
            return;
					} 
					else if(index === 7){
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
								if(this.Quety>this.workorderForm.ITEM_RETURN_QUALITY){
											this.$message({
											message:'样品数量不能大于'+this.workorderForm.ITEM_RETURN_QUALITY,
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
			getSummarie(param) {
        //param 是固定的对象，里面包含 columns与 data参数的对象 {columns: Array[4], data: Array[5]},包含了表格的所有的列与数据信息
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '统计';
            return;
					} 
					else if(index === 8){
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
								if(this.Quety>this.workorderForm.ITEM_RETURN_QUALITY){
											this.$message({
											message:'样品数量不能大于'+this.workorderForm.ITEM_RETURN_QUALITY,
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
		},
		
		mounted() {
			this.getITEM_STATUS();//页面打开加载-样品状态
			this.getITEM_SOURCE();//页面打开加载-样品来源
			this.getCOMPLETE_MODE();//页面打开加载-完成方式
			this.getselectData();//页面打开加载-接收人、负责人、收样人
			this.getITEM_RECEPT_STATUS();//页面打开加载-样品接收状态
			this.getITEM_CHECK_STATUS();//页面打开加载-样品检后状态
			this.getITEM_MANAGEMENT();//页面打开加载-样品处置
			this.getUser();
			this.getgroup();
		},
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';

</style>
