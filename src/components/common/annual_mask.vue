<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-show="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加年度计划</div>
					<div class="mask_title" v-show="modifytitle">修改年度计划</div>
					<div class="mask_title" v-show="viewtitle">查看年度计划</div>
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
					<el-form inline-message :model="WORKPLAN" :rules="rules" ref="WORKPLAN">
						<div class="content-accordion" id="information">
							<el-collapse v-model="activeNames" @change="handleChange">
								<el-collapse-item title="基本信息" name="1">
									<el-row :gutter="5">
										<el-col :span="5" class="pull-right">
											<el-input v-model="WORKPLAN.STATUSDesc" :disabled="true">
												<template slot="prepend">编辑状态</template>
											</el-input>
										</el-col>
										<el-col :span="5" class="pull-right">
											<el-input v-model="WORKPLAN.WP_NUM" placeholder="自动生成" :disabled="edit">
												<template slot="prepend">编号</template>
											</el-input>
										</el-col>
									</el-row>
									
									<el-row :gutter="5" class="pt10">
										<el-col :span="8">
											<el-form-item label="年度" prop="YEAR" label-width="85px">
												<div class="block">
												    <el-date-picker
												      v-model="WORKPLAN.YEAR"
												      type="year"
												      placeholder="选择年度"
												      value-format="yyyy"
												      format="yyyy"
												      :default-value="WORKPLAN.YEAR" style="width: 100%" :disabled="noedit">
												    </el-date-picker>
												</div>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="类别" prop="TYPE"  label-width="85px">
												<el-select v-model="WORKPLAN.TYPE" placeholder="请选择" :disabled="noedit" style="width: 100%">
													<el-option v-for="item in selectDataType" :key="item.id" :value="item.code" :label="item.name"></el-option>
												</el-select>
												<!-- <el-select v-model="WORKPLAN.TYPE" placeholder="请选择" :disabled="noedit" style="width: 100%">
													<el-option label="监督抽查" value="1"></el-option>
													<el-option label="质量抽查" value="2"></el-option>
												</el-select> -->
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="提出单位" prop="PROP_UNIT"  label-width="85px">
												<el-select clearable v-model="WORKPLAN.PROP_UNIT" placeholder="请选择" :disabled="noedit" style="width: 100%" allow-create filterable @change="selUnit">
													<el-option v-for="data in selectData" :key="data.id" :value="data.id" :label="data.fullname"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>

									<!-- <el-row :gutter="5">
										<el-col :span="8">
											<el-form-item label="承检单位" prop="CJDW" label-width="85px">
												<el-select clearable v-model="WORKPLAN.CJDW" filterable allow-create default-first-option placeholder="请选择" :disabled="noedit" style="width: 100%">
													<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
												</el-select>
											</el-form-item>	
										</el-col>
										
										<el-col :span="8">
											<el-form-item label="产品类别" prop="ITEMTYPE"  label-width="85px">
												<el-input v-model="WORKPLAN.ITEMTYPE" :disabled="true">
													<el-button slot="append" icon="el-icon-search" @click="addprobtn" :disabled="noedit"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row> -->
									<el-row :gutter="5">
										<el-col :span="24">
											<el-form-item label="计划描述" prop="DESCRIPTION" label-width="85px">
												<el-input v-model="WORKPLAN.DESCRIPTION" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								
								<!-- 年度计划列表 Begin-->
								<el-collapse-item title="年度计划列表" name="2" class="ml30">
									<div style="position: absolute; top:10px; right:40px;">
									<!-- <div> -->
										<!-- <el-button type="primary" size="mini" round v-show="!viewtitle">
											<i class="icon-upload-cloud"></i>
											<font>导入</font>
										</el-button> -->
										<el-dropdown size="small" v-show="!viewtitle">
											<el-button round type="primary" size="mini">
												<i class="icon-inventory-line-callin"></i> 导入<i class="el-icon-arrow-down el-icon-right"></i>
											</el-button>

											<el-dropdown-menu slot="dropdown">
												<el-dropdown-item>
													<div @click="download"><i class="icon-download-cloud"></i>下载模版</div>
												</el-dropdown-item>
												<el-dropdown-item>
													<el-upload
													ref="upload"
													class="upload"
													:action="uploadUrl()"
													:on-success="fileSuccess"
													:limit=1
													multiple
													method:="post">
														<div>上传</div>
													</el-upload>
												</el-dropdown-item>
											</el-dropdown-menu>
										</el-dropdown>
										<el-button type="primary" size="mini" round v-show="!addtitle" @click="exportData" style="margin-left: 10px;">
											<i class="icon-upload-cloud"></i>
											<font>导出</font>
										</el-button>
										<el-button type="success" size="mini" round @click="addfield1" v-show="!viewtitle">
											<i class="icon-add"></i>
											<font>新建行</font>
										</el-button>
									</div>
									<el-table :data="worlplanlist" 
											  :header-cell-style="rowClass"  
											  row-key="ID" 
											  border 
											  stripe 
											  :fit="true" 
											  highlight-current-row="highlight-current-row" 
											  style="width: 100% ;"  
											  :default-sort="{prop:'worlplanlist', order: 'descending'}" 
											  v-loadmore="loadMore"
											  @cell-dblclick="iconOperation"
											  @cell-click="showLineData">
									    <!-- <el-table-column prop="iconOperation" fixed width="50px" v-if="!viewtitle">
									      <template slot-scope="scope" >
									      	<i class="el-icon-check" v-if="scope.row.isEditing" @click="iconOperation(scope.row)"></i>
									      	<i class="el-icon-edit" v-if="!scope.row.isEditing" @click="iconOperation(scope.row)"></i>
									      </template>
									    </el-table-column> -->
									    <el-table-column label="序号" width="50px" prop="WP_LINENUM">
									      <template slot-scope="scope">
									      	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.$index + 1" disabled></el-input>
											<span v-if="!scope.row.isEditing">{{scope.$index + 1}}</span>
									      </template>
									    </el-table-column>
										<el-table-column prop="CJDW" label="承检单位" sortable width="200px">
											<template slot-scope="scope">
												<el-select v-if="scope.row.isEditing" clearable v-model="scope.row.CJDW" filterable allow-create default-first-option placeholder="请选择" :disabled="noedit" style="width: 100%">
													<el-option v-for="(data,index) in inspectUnit" :key="index" :value="data.id" :label="data.fullname"></el-option>
												</el-select>
												<span v-if="!scope.row.isEditing">{{scope.row.CJDW}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="PRODUCT_TYPE" label="产品类别" sortable width="200px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" v-model="scope.row.PRODUCT_TYPE" :disabled="true">
													<el-button slot="append" icon="el-icon-search" @click="addprobtn(scope.row)" :disabled="noedit"></el-button>
												</el-input>
												<span v-if="!scope.row.isEditing">{{scope.row.PRODUCT_TYPE}}</span>
											</template>
										</el-table-column>
										<el-table-column prop="ITEM_NAME" label="产品名称" sortable width="200px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.ITEM_NAME" placeholder="请选择" :disabled="true">
													<el-button slot="append" icon="el-icon-search" @click="addproduct(scope.row)"></el-button>
												</el-input>
												<span v-if="!scope.row.isEditing">{{scope.row.ITEM_NAME}}</span>
											</template>
										</el-table-column>
									    <el-table-column prop="MODEL" label="规格型号" sortable width="120px">
									      <template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.MODEL" placeholder="请选择">
												</el-input>
												<span v-else>{{scope.row.MODEL}}</span>
										  </template>
									    </el-table-column>
										<el-table-column prop="V_NAME" label="生产企业名称" sortable width="220px">
											<template slot-scope="scope">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.V_NAME" placeholder="请选择" :disabled="true">
														<el-button slot="append" icon="el-icon-search" @click="prodeptbtn(scope.row)"></el-button>
													</el-input>
													<span v-else>{{scope.row.V_NAME}}</span>
											</template>
										</el-table-column>

										<!-- <el-table-column prop="S_NAME" label="检测依据" sortable width="220px">
											<template slot-scope="scope">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.S_NAME" placeholder="请选择" :disabled="noedit">
														<el-button slot="append" icon="el-icon-search" @click="basisleadbtn(scope.row)"></el-button>
													</el-input>
													<span v-else>{{scope.row.S_NAME}}</span>
											</template>
										</el-table-column>

										<el-table-column prop="P_DESC" label="检测项目" sortable width="220px">
											<template slot-scope="scope">
													<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.P_DESC" placeholder="请选择" :disabled="noedit">
														<el-button slot="append" icon="el-icon-search" @click="basisleadbtn2(scope.row)"></el-button>
													</el-input>
													<span v-else>{{scope.row.P_DESC}}</span>
											</template>
										</el-table-column> -->

									    <el-table-column prop="CHECKCOST" label="检测费用" sortable width="120px">
									      <template slot-scope="scope">
									        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.CHECKCOST" placeholder="请输入内容" id="cost" @blur="toPrice(scope.row)"></el-input>
												<span v-else id="costshow">{{scope.row.CHECKCOST}}</span>
										  </template>
									    </el-table-column>
									    <el-table-column prop="REASION" label="项目提出理由" sortable width="220px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.REASION" placeholder="请输入内容"></el-input>
												<span v-else>{{scope.row.REASION}}</span>
										  	</template>
									    </el-table-column>
										<el-table-column prop="MEMO" label="近三年监督抽查情况" sortable width="260px">
											<template slot-scope="scope">
												<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.MEMO" placeholder="请输入内容"></el-input>
												<span v-else>{{scope.row.MEMO}}</span>
											</template>
									    </el-table-column>
									    <el-table-column fixed="right" label="操作" align="center" width="190px">
									      <template slot-scope="scope">
									        <el-button type="text" title="删除" @click="delPlan(scope.$index,scope.row, 'WORLPLANLINE','worlplanlist')"  size="small" v-show="!viewtitle">
									          <i class="icon-trash red"></i>
									        </el-button>
											<el-button type="primary" @click="assign(scope.row)" size="small" v-if="assignshow&&(scope.row.ISCREATED!=1)">
									          <i class="icon-send"></i>
											  下达工作任务通知书
									        </el-button>
									        <el-button type="info" size="small" v-if="assignshow&&(scope.row.ISCREATED==1)">
									          已下达
									        </el-button>
									      </template>
									    </el-table-column>
									</el-table>
								</el-collapse-item>
								<!-- 年度计划列表 End -->

								<!-- 检测依据、检测项目与要求 Begin-->
								<div class="el-collapse-item pt10 pr20 pb20 ml60" aria-expanded="true" accordion>
									<el-tabs v-model="activeName" @tab-click="handleClick">
									    <el-tab-pane label="检测依据" name="first">
									    	<div class="table-func table-funcb">
												<el-button type="primary" size="mini" round @click="basisleadbtn" v-show="isEditList">
													<i class="icon-search"></i>
													<font>选择</font>
												</el-button>
											</div>
							            	<el-table :header-cell-style="rowClass" :data="basisList" border stripe :fit="true" max-length="260px" style="width: 100%;" :default-sort="{prop:'basisList', order: 'descending'}">
							            		<el-table-column prop="NUMBER" label="序号" width="50" type="index"></el-table-column>
												<!-- <el-table-column prop="WP_NUM" label="所属编号" sortable width="150">
											      	<template slot-scope="scope">
											        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.WP_NUM" disabled></el-input><span v-else>{{scope.row.WP_NUM}}</span>
											      	</template>
							            		</el-table-column> -->
							            		<!-- <el-table-column prop="WP_LINENUM" label="所属序号" sortable width="150"></el-table-column> -->
							            		<el-table-column prop="S_NUM" label="标准编号" sortable width="160"></el-table-column>
							            		<el-table-column prop="S_NAME" label="标准名称" sortable width="350"></el-table-column>
							            		<el-table-column prop="VERSION" label="版本" sortable width="80"></el-table-column>
							            		<el-table-column prop="FILESIZE" label="文件大小" sortable width="120"></el-table-column>
							            		<el-table-column fixed="right" label="操作" width="80">
													<template slot-scope="scope"  v-if="!viewtitle">
														<el-button
															@click="delPlan(scope.$index,scope.row,'WORLPLANLINE_BASIS','basisList')"
															type="text"
															size="small">
															<i class="icon-trash red"></i>
														</el-button>
													</template>
											    </el-table-column>
							            	</el-table>
									    </el-tab-pane>

									    <el-tab-pane label="检测项目与要求" name="second">
									    	<div class="table-func table-funcb">
												<el-button type="primary" size="mini" round @click="basisleadbtn2" v-show="isEditList">
													<i class="icon-search"></i>
													<font>选择</font>
												</el-button>
											</div>
							            	<el-table :header-cell-style="rowClass" :data="proTestList" border stripe :fit="true" max-height="260" style="width: 100%;" :default-sort="{prop:'proTestList', order: 'descending'}">
												<el-table-column prop="NUMBER" label="序号" width="50" type="index"></el-table-column>
							            		<!-- <el-table-column prop="WP_NUM" label="所属编号" width="130">
							            			<template slot-scope="scope">
											        	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.WP_NUM" disabled></el-input><span v-else>{{scope.row.WP_NUM}}</span>
											      	</template>
							            		</el-table-column>
							            		<el-table-column label="所属序号" sortable width="120px" prop="WP_LINENUM">
											      <template slot-scope="scope">
											      	<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.WP_LINENUM" disabled></el-input><span v-else>{{scope.row.WP_LINENUM}}</span>
											      </template>
											    </el-table-column> -->
							            		<el-table-column prop="P_NUM" label="检验项目编号" width="100"></el-table-column>
							            		<el-table-column prop="P_DESC" label="检验项目描述" width="250"></el-table-column>
							            		<el-table-column prop="REMARKS" label="要求" width="200">
							            			<template slot-scope="scope">
											        	<el-input size="small" v-model="scope.row.REMARKS" placeholder="请输入内容">
											        	</el-input>
											      </template>
							            		</el-table-column>
							            		<el-table-column prop="VERSION" label="版本"></el-table-column>
							            		<el-table-column fixed="right" label="操作" width="80" v-if="!viewtitle">
											      <template slot-scope="scope">
											        <el-button
											          @click="delPlan(scope.$index,scope.row,'WORLPLANLINE_PROJECT','proTestList')" 
											          type="text"
											          size="small" v-show="!viewtitle">
											          	<i class="icon-trash red"></i>
											        </el-button>
											      </template>
											    </el-table-column>

							            	</el-table>
									    </el-tab-pane>
									</el-tabs>
								</div>
								<!-- 检测依据、检测项目与要求 End-->

								<!-- todo -->
								<!-- 文件编号列表 Begin-->
								<!-- <el-collapse-item title="文件编号列表" name="5">
									<div class="table-func">
										<el-button type="success" size="mini" round @click="addfield2"><i class="icon-add"></i><font>新建行</font>
										</el-button>
									</div>
									<el-form>
						                <el-form-item>
						                	<el-row :gutter="20">
						                		<el-col :span="2">
						                            <el-form-item label="计划编号" ></el-form-item>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-form-item label="文件编号"></el-form-item>
						                        </el-col>
						                        <el-col :span="6">
						                            <el-form-item label="文件描述"></el-form-item>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-form-item label="录入人" ></el-form-item>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-form-item label="录入时间"></el-form-item>
						                        </el-col>
						                        <el-col :span="2">
						                            <el-form-item label="上传"></el-form-item>
						                        </el-col>		                        
						                        <el-col :span="2">
						                            <el-form-item label="操作"></el-form-item>
						                        </el-col>
						                	</el-row>
						                    <el-row :gutter="10">
						                        <el-col :span="2">
						                            <el-input type="text"  placeholder="计划编号"></el-input>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-input type="text"  placeholder="文件编号"></el-input>
						                        </el-col>
						                        <el-col :span="6">
						                        	<el-input type="text"  placeholder="文件描述"></el-input>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-input type="text"  placeholder="录入人"></el-input>
						                        </el-col>
						                        <el-col :span="4">
						                            <el-input type="text"  placeholder="录入时间"></el-input>
						                        </el-col>
						                        <el-col :span="2">
						                            <el-upload
														class="upload-demo"
														action="https://jsonplaceholder.typicode.com/posts/"
														:on-preview="handlePreview"
														:on-remove="handleRemove"
														:before-remove="beforeRemove"
														multiple
														:limit="3"
														:on-exceed="handleExceed"
														:file-list="fileList">
														<el-button size="small" type="primary">点击上传</el-button>
													</el-upload>
						                        </el-col>                
						                        <el-col :span="2">
						                            <i class="el-icon-delete" @click="delfield(item)" style="color: red;text-align:center"></i>
						                        </el-col>
						                    </el-row>
						                </el-form-item>
					            	</el-form>
								</el-collapse-item> -->
								<!-- 文件编号列表 End -->
								<!-- 编制信息 Begin -->
								<div class="el-collapse-item pt10 pr20" aria-expanded="true" accordion>
									<el-row>
										<el-col :span="6">
											<el-form-item label="编制人" prop="COMPACTOR" label-width="85px">
												<el-input v-model="WORKPLAN.COMPACTOR" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<el-form-item label="审核人" prop="C_PERSON" label-width="85px">
												<el-input v-model="WORKPLAN.C_PERSON" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<el-form-item label="批准人" prop="APPRPERSON" label-width="85px">
												<el-input v-model="WORKPLAN.APPRPERSON" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="6">
											<el-form-item label="提报日期" prop="REPORTDATE" label-width="85px">
											<div class="block">
											    <el-date-picker
											      v-model="WORKPLAN.REPORTDATE "
											      type="date"
											      placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%" :disabled="noedit">
											    </el-date-picker>
											  </div>
											 </el-form-item>
										</el-col>
									</el-row>
								</div>
								<!-- 编制信息 End -->

								<!-- 文件 Begin -->
								<el-collapse-item title="文件" name="6">
									<doc-table ref="docTable" :docParm = "docParm" @saveParent = "save"></doc-table>
								</el-collapse-item>
								<!-- 文件 End -->
								
								<!-- 录入人信息 Begin-->
								<el-collapse-item title="其他" name="7" v-show="views">
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="录入人" prop="ENTERBYDesc" label-width="85px">
												<el-input v-model="WORKPLAN.ENTERBYDesc" placeholder="当前录入人" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="ENTERDATE" label-width="85px">
												<el-input v-model="WORKPLAN.ENTERDATE" placeholder="当前录入时间" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人" prop="CHANGEBYDesc" label-width="85px">
												<el-input v-model="WORKPLAN.CHANGEBYDesc" placeholder="当前修改人" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="CHANGEDATE" label-width="85px">
												<el-input v-model="WORKPLAN.CHANGEDATE" placeholder="当前修改时间" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="机构" prop="DEPTIDDesc" label-width="85px">
												<el-input v-model="WORKPLAN.DEPTIDDesc" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<!-- 录入人信息 End -->
							</el-collapse>
						</div>
						<div class="content-footer" v-if="!viewtitle">
							<el-button type="primary" @click="saveAndUpdate('WORKPLAN')">保存</el-button>
							<el-button type="success" @click="saveAndSubmit('WORKPLAN')" v-show="addtitle">保存并继续</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
			</div>
			<!-- 检测依据弹出框begin -->
			<el-dialog :modal-append-to-body="false" title="检测依据" :visible.sync="dialogVisible" width="80%" :before-close="handleClose1">
				<!-- 高级查询划出 Begin-->
				<div class="pb10">
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="10">
							<el-col :span="6">
								<el-form-item label="标准编号" prop="S_NUM">
									<el-input v-model="searchList.S_NUM"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="标准名称" prop="S_NAME">
									<el-input v-model="searchList.S_NAME"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="版本" prop="VERSION">
									<el-input v-model="searchList.VERSION"></el-input>
								</el-form-item>
							</el-col>		
						</el-row>
						<el-row :gutter="10">
							<!-- <el-col :span="6">
								<el-form-item label="机构" prop="DEPTID">
									<el-select clearable v-model="searchList.DEPTID" filterable allow-create default-first-option placeholder="请选择">
										<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
									</el-select>
								</el-form-item>
							</el-col> -->
							<el-col :span="6">
								<el-form-item label="发布时间" prop="RELEASETIME">
									<el-date-picker style="width: 100%" v-model="searchList.RELEASETIME" type="date" placeholder="发布时间" value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="启用时间" prop="STARTETIME">
									<el-date-picker style="width: 100%" v-model="searchList.STARTETIME" type="date" placeholder="启用时间" value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<!-- <el-col :span="3">
								<el-select style="width: 120%" v-model="searchList.STATUS" placeholder="请选择信息状态">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-col> -->
							<el-col :span="4">
								<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
								<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px; margin-left: 2px">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<!-- 高级查询划出 End-->
				<!-- 第二层弹出的表格 Begin -->
				<el-table :data="standardList" height="400px" border stripe style="width: 100%;" :default-sort="{prop:'standardList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore">
					<el-table-column type="selection" width="55" fixed>
					</el-table-column>
					<!-- <el-table-column label="主键编号" width="120" sortable prop="ID">
					</el-table-column> -->
					<el-table-column label="标准编号" width="160" sortable prop="S_NUM">
					</el-table-column>
					<el-table-column label="标准名称" width="220" sortable prop="S_NAME">
					</el-table-column>
					<!-- <el-table-column label="状态" width="100" sortable prop="STATUS">
					</el-table-column> -->
					<el-table-column label="发布时间" width="160" sortable prop="RELEASETIME">
					</el-table-column>
					<el-table-column label="启用时间" width="160" sortable prop="STARTETIME">
					</el-table-column>
					<el-table-column label="版本" width="100" sortable prop="VERSION">
					</el-table-column>
					<el-table-column label="机构" width="180" sortable prop="DEPTIDDesc">
					</el-table-column>
					<el-table-column label="录入时间" width="160" prop="ENTERDATE" sortable>
					</el-table-column>
					<el-table-column label="修改时间" width="160" prop="CHANGEDATE" sortable>
					</el-table-column>
				</el-table>

				<el-pagination background class="text-right pt10 pb10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
				</el-pagination>

				<!-- 第二层弹出的表格 End -->
				<div slot="footer">
			       <el-button type="primary" @click="addbasis">确 定</el-button>
			       <el-button @click="resetBasisInfo1">取 消</el-button>
			    </div>
			</el-dialog>
			<!-- 检测依据弹出框 End -->

			<!-- 检测项目与要求弹出框 Begin -->
			<el-dialog :modal-append-to-body="false" title="检测项目" :visible.sync="dialogVisible2" width="80%" :before-close="handleClose2">
				<!-- 高级查询划出 Begin-->
				<div class="pb10">
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="10">
								<el-col :span="5">
									<el-form-item label="项目编号" prop="P_NUM">
										<el-input v-model="searchList.P_NUM"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="机构" prop="DEPTID">
										<el-select clearable v-model="searchList.DEPTID" filterable allow-create default-first-option placeholder="请选择">
											<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="项目名称" prop="P_NAME">
										<el-input v-model="searchList.P_NAME"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="5">
									<el-form-item label="版本" prop="VERSION">
										<el-input v-model="searchList.VERSION"></el-input>
									</el-form-item>
								</el-col>
							<!-- <el-col :span="3">
								<el-select v-model="searchList.STATUS" placeholder="请选择信息状态">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-col> -->
							<el-col :span="4">
								<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
								<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px; margin-left: 2px">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<!-- 高级查询划出 End-->

				<!-- 第二层弹出的表格 Begin-->
				<el-table  :data="projectList" height="400px" border stripe style="width: 100%;" :default-sort="{prop:'projectList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore">
					<el-table-column type="selection" width="55" fixed>
					</el-table-column>
					<el-table-column label="检验/检测项编号" width="150" sortable prop="P_NUM">
					</el-table-column>
					<el-table-column label="项目名称" width="220" sortable prop="P_NAME">
					</el-table-column>
					<el-table-column label="人员资质" width="180" sortable prop="QUALIFICATION">
					</el-table-column>
					<!-- <el-table-column label="状态" width="100" sortable prop="STATUS" :formatter="judge">
					</el-table-column> -->
					<el-table-column label="领域" width="120" sortable prop="FIELD" >
					</el-table-column>
					<el-table-column label="子领域" width="120" sortable prop="CHILD_FIELD">
					</el-table-column>
					<el-table-column label="版本" width="100" sortable prop="VERSION">
					</el-table-column>
					<el-table-column label="机构" width="180" sortable prop="DEPTIDDesc">
					</el-table-column>
					<el-table-column label="录入时间" width="160" prop="ENTERDATE" sortable :formatter="dateFormat">
					</el-table-column>
					<el-table-column label="修改时间" width="160" prop="CHANGEDATE" sortable :formatter="dateFormat">
					</el-table-column>
				</el-table>
				<el-pagination background class="text-right pt10 pb10"
		            @size-change="sizeChange"
		            @current-change="currentChange"
		            :current-page="page.currentPage"
		            :page-sizes="[10, 20, 30, 40]"
		            :page-size="page.pageSize"
		            layout="total, sizes, prev, pager, next"
		            :total="page.totalCount">
		        </el-pagination>
				<!-- 表格 End-->
				<span slot="footer">
			       <el-button type="primary" @click="addbasis2">确 定</el-button>
			       <el-button @click="resetBasisInfo2">取 消</el-button>
			    </span>
			</el-dialog>
			<!-- 检测项目与要求 End -->

			<!-- 产品类别 Begin -->
			<el-dialog :modal-append-to-body="false" title="产品类别" height="400px" :visible.sync="dialogVisible3" width="80%" :before-close="handleClose3">
				<el-table :header-cell-style="rowClass" :data="categoryList" border stripe height="400px" style="width:100%;" :default-sort="{prop:'categoryList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore">
					<el-table-column type="selection" fixed width="55" align="center">
					</el-table-column>
					<el-table-column label="编码" width="155" sortable prop="NUM">
					</el-table-column>
					<el-table-column label="名称" sortable prop="TYPE">
					</el-table-column>
					<el-table-column label="版本" width="100" sortable prop="VERSION" align="right">
					</el-table-column>
					<el-table-column label="机构" width="185" sortable prop="DEPTIDDesc">
					</el-table-column>
					<el-table-column label="录入时间" width="160" prop="ENTERDATE" sortable :formatter="dateFormat">
					</el-table-column>
					<el-table-column label="修改时间" width="160" prop="CHANGEDATE" sortable :formatter="dateFormat">
					</el-table-column>
				</el-table>
				<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40,100]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
				</el-pagination>

				<span slot="footer">
			       <el-button type="primary" @click="addbasis3">确 定</el-button>
			       <el-button @click="resetBasisInfo3">取 消</el-button>
			    </span>
			</el-dialog>
			<!-- 产品类别 End -->

			<!-- 产品名称 Begin -->
			<el-dialog :modal-append-to-body="false" title="产品名称" :visible.sync="dialogVisible4" width="80%" :before-close="handleClose4">
				<el-table :header-cell-style="rowClass" :data="productList" line-center border stripe height="400px" style="width: 100%;" :default-sort="{prop:'productList', order: 'descending'}" @selection-change="SelChange"
				v-loadmore="loadMore"
				v-loading="loading"
				element-loading-text="加载中…"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(255, 255, 255, 0.9)">
					<el-table-column type="selection" fixed width="55" align="center">
					</el-table-column>
					<el-table-column label="所属产品类别编码" width="200" sortable prop="NUM">
					</el-table-column>
					<el-table-column label="产品编码" width="155" sortable prop="PRO_NUM">
					</el-table-column>
					<el-table-column label="产品名称" sortable prop="PRO_NAME">
					</el-table-column>
					<el-table-column label="版本" width="100" sortable prop="VERSION" align="right">
					</el-table-column>
					<el-table-column label="机构" width="185" sortable prop="DEPTIDDesc">
					</el-table-column>
					<el-table-column label="录入时间" width="160" prop="ENTERDATE" sortable :formatter="dateFormat">
					</el-table-column>
					<el-table-column label="修改时间" width="160" prop="CHANGEDATE" sortable :formatter="dateFormat">
					</el-table-column>
				</el-table>
				<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40,100]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
				</el-pagination>
				<span slot="footer">
			       <el-button type="primary" @click="addbasis4">确 定</el-button>
			       <el-button @click="resetBasisInfo4">取 消</el-button>
			    </span>
			</el-dialog>
			<!-- 产品名称 End -->
			<!-- 生产企业名称、受检企业名称 Begin -->
			<el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible5" width="80%" :before-close="handleClose5">
				<el-table :data="customerList" border stripe :header-cell-style="rowClass" height="400px" style="width: 100%;" :default-sort="{prop:'customerList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore">
					<el-table-column type="selection" width="55" fixed align="center">
					</el-table-column>
					<el-table-column label="统一社会信用代码" width="200" sortable prop="CODE">
					</el-table-column>
					<el-table-column label="单位名称" width="300" sortable prop="NAME">
					</el-table-column>
					<el-table-column label="联系地址" sortable prop="CONTACT_ADDRESS">
					</el-table-column>
					<!--<el-table-column label="信息状态" sortable width="100" prop="STATUS" :formatter="judge" v-if="this.checkedName.indexOf('信息状态')!=-1">
					</el-table-column>-->
				</el-table>
				<el-pagination background class="text-right pt10"
					@size-change="sizeChange"
					@current-change="currentChange"
					:current-page="page.currentPage"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="page.pageSize"
					layout="total, sizes, prev, pager, next"
					:total="page.totalCount">
				</el-pagination>
				<div slot="footer">
					<el-button type="primary" @click="addbasis5">确 定</el-button>
			       	<el-button @click="resetBasisInfo5">取 消</el-button>
			    </div>
			</el-dialog>

			<!-- 生产企业名称、受检企业名称 End -->
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import docTable from '../common/doc.vue'
	export default {
		name: 'masks',
		components: {docTable},
		data() {
			var validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
            var validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
            var validateAddress = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请填写联系地址'));
                }else {
                    callback();
                }
            };
            var validatePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请填写联系电话'));
                }else {
                    callback();
                }
            };
            var validateEmail = (rule, value, callback) => {
                if (value === '') {
		            callback(new Error('电子邮箱不能为空'));
		        } else {
			        var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			        if(!reg.test(value)){
			            callback(new Error('请输入有效的邮箱'));
			        }else{
			        	callback();
			        }
		        }
            };
            var validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(''));
                }else {
                    callback();
                }
            };
            var validateUnit = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择提出单位'));
                }else {
                    callback();
                }
            };
            var validateItemtype = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请填写产品类别'));
                }else {
                    callback();
                }
            };
            var validateType = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择计划类型'));
                }else {
                    callback();
                }
            };
            var validateBasislist = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择检测依据'));
                }else {
                    callback();
                }
            };
			//放大镜选择验证
			var validateItemdata = (rule, value, callback) => {
                if (this.WORKPLAN.ITEMTYPE === undefined || this.WORKPLAN.ITEMTYPE === '' || this.WORKPLAN.ITEMTYPE === null) {
                    callback(new Error('必填'));
                }else {
                    callback();
                }
            };
			return {
				docParm: {
					'model': 'new',
					'recordid': 1,
					'userid': 1,
					'username': '',
					'deptid': 1,
					'deptfullname': '',
					'appname': '',
					'appid': 1
				},
				basic_url: Config.dev_url,
				po_url: Config.po_url,
				showEdit: [], //显示编辑框
		        showBtn: [],
		        showBtnOrdinary: true,
		        fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				value: '',
				assignshow:false,//下达任务通知书按钮
				options: [{
					value: '1',
					label: '活动'
				}, {
					value: '0',
					label: '不活动'
				}],
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				commentArr:{},
				selUser:[],
				productList:[],
				edit: true, //禁填
				col_but1: true,
				col_but2: true,
				show: false,
				modify:false,
				isok1: true,
				isok2: false,
				down: true,
				up: false,
				addtitle:true,//添加弹出框titile
				modifytitle:false,//修改弹出框titile
				viewtitle: false, //查看弹出框title
				noviews: true, //保存的按钮
				views: false,
				activeName: 'first',//tabs
				activeNames: ['1','2','3','4','5','6','7'],//手风琴数量
				// labelPosition: 'right', //表格
				dialogVisible: false, //对话框
				dialogVisible2: false, //对话框
				dialogVisible3: false, //对话框
				dialogVisible4: false, //对话框
				dialogVisible5: false,//生产企业、受检企业对话框
				searchList: { //点击高级搜索后显示的内容
					S_NUM: '',
					S_NAME: '',
					VERSION: '',
					DEPARTMENT: '',
					RELEASETIME: '',
					STARTETIME: '',
					STATUS: '',
				},
				dataList:[{
					name:'',
					description:''
				}],
				search:'',
				selectData:[],//提出单位
				selectDataType:[],//年度抽查计划类别
				standardList: [],//检测依据数据
				projectList: [],//检测项目与要求
				fileList:[],//上传附件数据
				page: { //分页显示
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				WORKPLAN:{},
				inspectionList_child: {
					 WORLPLANLINE_BASISList:[],
					 WORLPLANLINE_PROJECTList:[]
				},
				
				rules: {
					PROP_UNIT:[{required: true, trigger: 'change', validator: this.Validators.isChoosedata}],//提出单位
					CJDW:[{required: true, trigger: 'change', validator: this.Validators.isChoosedata}], //承检单位
       				ITEMTYPE:[{required: true, trigger: 'blur', message: '请选择',}],//产品类别
					TYPE:[{required: true, trigger: 'change', validator: this.Validators.isChoosedata}],//类别
					// DESCRIPTION:[
					// 	{required: true, trigger: 'blur',message: '必填' },
					// 	{trigger: 'blur', validator: this.Validators.isFillTips}
					// ],//计划描述
					COMPACTOR:[//编制人
						{required: true, trigger: 'blur',message: '必填' },
						{trigger: 'blur', validator: this.Validators.isNickname},
					],
					C_PERSON:[//审核人
						{required: true, trigger: 'blur',message: '必填' },
						{trigger: 'blur', validator: this.Validators.isNickname},
					],
					APPRPERSON:[//批准人
						{required: true, trigger: 'blur',message: '必填' },
						{trigger: 'blur', validator: this.Validators.isNickname},
					],
					CONTACT_ADDRESS:[{required: true, trigger:'blur', validator:this.Validators.isAddress,}],
					PHONE:[{required: true, trigger: 'blur', validator: this.Validators.isPhone,}],
					EMAIL:[{required: true, trigger: 'blur', validator:this.Validators.isEmail,}],
       				YEAR: [{type: 'string', required: true, message: '请选择年度', trigger: 'change' }],//年度
       				REPORTDATE: [{type: 'string', required: true, message: '请选择提报日期', trigger: 'change'}],//提报日期
       				//检测依据 
					ITEM_NAME:[{required: true, message: '请填写', trigger: 'blur'}], //产品名称 
					MODEL:[{required: true, message: '请填写', trigger: 'blur'}],
					REMARKS:[{required: true, message: '请填写', trigger: 'blur'}],
					basisList:[{required: true, trigger: 'change', validator: this.Validators.isChoosedata}],//检测依据
				},
				editPlanLineRow: [],
				//tree
				worlplanlist: [], //年度计划列表				
				basisList: [], //检测依据
				proTestList: [], //项目检测和要求
				isEditList: false,  //年度计划列表编辑装填
				editPlan: {},  //编辑中的内容
				frontId: 1, //前端年度计划列表的唯一主键
				index:0,
				views:true,
				dept:true,
				categoryList:[],
				proindex:0,//生产企业一条数据标识
				deptindex:0,//受检企业一条数据标识
				falg:false,
				customerList:[],//生产企业、受检企业数据取自custom
				deptnum:'',//生产企业名称、受检企业名称标识号码
				requestnum:0,//更新表格数据标识
				itemtypenum:'',//当前选择的产品类别编号，用作参数请求产品名称
				pronamenum:'',//当前选择的产品名称编号，用作参数请求依据
				basisnums:'',//当前选择的依据编号字符串，用作参数请求检测项目
				noedit:false,
				basissnums:'',//已经选过的检测依据num
				projectpnums:'',//已经选过的检测项目num

				proposeUnit: '', //提出单位为检验站时
				inspectUnit: [], //承检单位
			};
		},
		methods: {
			selUnit(item){
				var selData = item;
				this.selectData.forEach((item)=>{
					if(item.id == selData){
						if(item.type == '2'){
							this.proposeUnit = item.id;
						}
					}
				});
			},
			viewPlanFile(row){
				var url = this.po_url+'/show?fileid=' +  row.FILEID
						+ '&userid=' +  this.docParm.userid
						+ '&username=' + this.docParm.username
						+ '&deptid=' + this.docParm.deptid
						+ '&deptfullname=' + this.docParm.deptfullname
				window.open(url); 
			},
			download() {
				var url = this.basic_url + '/api-apps/app/workplan/importExcTemplete?table=WORLPLANLINE&access_token='+sessionStorage.getItem('access_token');
				var xhr = new XMLHttpRequest();
					xhr.open('POST', url, true);
					xhr.responseType = "blob";
					xhr.setRequestHeader("client_type", "DESKTOP_WEB");
					xhr.onload = function() {
						if (this.status == 200) {
							var blob = this.response;
							var objecturl = URL.createObjectURL(blob);
							window.location.href = objecturl;
						}
					}
					xhr.send();
			},
			fileSuccess(){//上传成功后返回数据
				this.page.currentPage = 1;
				this.requestData();
			},
			uploadUrl(){
				var url = this.basic_url +'/api-apps/app/workplan/importExc?table=WORLPLANLINE&access_token='+sessionStorage.getItem('access_token');
				return url;
            },
			exportData() {
           		var url = this.basic_url + '/api-apps/app/workplan/exportExc?table=WORLPLANLINE&WP_NUM_wheres='+this.WORKPLAN.WP_NUM+'&access_token='+sessionStorage.getItem('access_token');
          		var xhr = new XMLHttpRequest();
            	xhr.open('POST', url, true);
            	xhr.responseType = "blob";
            	xhr.setRequestHeader("client_type", "DESKTOP_WEB");
            	xhr.onload = function() {
                	if (this.status == 200) {
						var filename = "worlplanline.xls";
						var blob = this.response;
						var link = document.createElement('a');
						var objecturl = URL.createObjectURL(blob);
						link.href = objecturl;
						link.download = filename;
						link.click();
                	}
            	}
            	xhr.send();
			},
			//检测依据弹出框数据置空
			resetBasisInfo1(){
				this.dialogVisible = false;
				this.resetbtn();
				this.standardList = [];
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 10;//页码重新传值
			},
			//提出单位
			 getCompany() {
			// 	var type = "2";
				var url = this.basic_url + '/api-user/depts/treeByType';
				this.$axios.get(url, {
					// params: {
					// 	type: type
					// },
				}).then((res) => {
					this.selectData = res.data;
				});
			},
			//重置
			resetbtn(){
				this.searchList = {
					S_NUM:'',
					S_NAME:'',
					VERSION:'',
					DEPARTMENT:'',
					RELEASETIME:'',
					STARTETIME:'',
					STATUS:'',
					P_NUM:'',
					DEPTID:'',
					P_NAME:'',
					VERSION:'',
					STATUS:'',
				};
			},
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			toNum(str) {
				return str.replace(/\,|\￥/g, "");
			},
			//金额两位小数点千位分隔符，四舍五入
			toPrice(item){
				var money = item.CHECKCOST.replace(/[^\d.]/g,'');
				if(money==''||money==undefined){
					item.CHECKCOST = '0.00';
				}else{
					var num = parseFloat(this.toNum(money)).toFixed(2).toString().split(".");
					num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
					item.CHECKCOST = num.join(".");
				}
			},
			//检测项目与要求修改和保存状态
			changeEdit(row){
				this.$nextTick(function(){
					row.isEditing = !row.isEditing;
				});
			},
			//生产企业名称
			prodeptbtn(item){
				// this.requestData();
				this.requestDeptname();
				this.dialogVisible5 = true;
				// this.$emit('request');
				this.proindex = item;
				this.requestnum = '3';
				this.deptnum = '1';
			},
			//受检企业名称
			getdeptbtn(item){
				// this.requestData();
				this.requestDeptname();
				this.dialogVisible5 = true;
				// this.$emit('request');
				this.deptindex = item;
				this.requestnum = '3';
				this.deptnum = '2';
			},
			
			fileSuccess(){
				this.detail(this.WORKPLAN.ID);
			},
			//删除计划列表
			delPlan(index,row,TableName,delList){
				if(row.ID){
					var url = this.basic_url +'/api-apps/app/workplan/' + TableName +'/' + row.ID;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {}).then((res) => {
							if(res.data.resp_code == 0){
									this[delList].splice(index,1);
							}else{
								this.$message({
									message: res.data.resp_msg,
									type: 'error'
								});
							}
						}).catch((err) => {
							// this.$message({
							// 	message: '网络错误，请重试',
							// 	type: 'error'
							// });
						});
					}).catch(() => {

					});
				}else{
						this[delList].splice(index,1);
				}
			},
			//下达任务通知书
			assign(item){
				var dataid = item.ID;
				if(item.ISCREATED == 1){
					this.$message({
						message: '已经下达工作任务通知书，请勿重复下达',
						type: 'warning'
					});
					// return;
				}else{
					this.$axios.get(this.basic_url + '/api-apps/app/workplan/operate/createWorkNotice?ID=' + dataid, {}).then((res) => {
					if(res.data.resp_code == 0) {
						this.$message({
							message: '下达工作任务通知书成功',
							type: 'success'
						});
					}else{
						this.$message({
							message: res.data.resp_msg,
							type: 'warning'
						});
					}
				}).catch((err) => {
					this.$message({
						message: '网络错误，请重试',
						type: 'error'
					});
				});
				}
				
			},
			showLineData(row){
				this.proTestList = row.WORLPLANLINE_PROJECTList;
				this.basisList = row.WORLPLANLINE_BASISList;
			},
   			//年度计划表格函数
   			iconOperation(row){
                row.isEditing = !row.isEditing;
				this.isEditList = row.isEditing;
				//如果有编辑状态的数据，保存上一条处于编辑状态的数据
				var editId = this.editPlan.frontId;
				if(editId){
					var worlplanlist = this.worlplanlist;
					for(var i=0, len=worlplanlist.length; i<len; i++){
						if(editId == worlplanlist[i].frontId){
							worlplanlist[i].WORLPLANLINE_PROJECTList = JSON.parse(JSON.stringify(this.proTestList));
							worlplanlist[i].WORLPLANLINE_BASISList = JSON.parse(JSON.stringify(this.basisList));
							worlplanlist[i].isEditing = false;
						}
					}
             	}
				if(row.isEditing){
					//编辑
					this.editPlan = row;
					this.proTestList = row.WORLPLANLINE_PROJECTList;
					this.basisList = row.WORLPLANLINE_BASISList;
				}else{
					this.editPlan = {};
					this.proTestList = [];
					this.basisList = [];
				}
        	},
   			//上传文件 Begin
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			//上传文件 End
   			judge(data) {
				return data.STATUS=="1" ? '活动' : '不活动'
			},
   			//时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			//检测依据弹出框
            addbasis(){
            	var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请选择数据',
						type: 'warning'
					});
					return;
				} else {
					var changeUser = this.selUser;
					//basisnum为依据编号的数组
					var basisnum = [];
					for (var i = 0; i < changeUser.length; i++) {
						basisnum.push(changeUser[i].S_NUM);
					}
					//basisnums为basisnum数组用逗号拼接的字符串
					this.basisnums = basisnum.toString(',');

					//循环push页面正常显示
					for(var i = 0;i<selData.length;i++){
						//新选来的数据ID为空
						selData[i].ID = '';
						//产品编号  与主表关联
						selData[i].WP_NUM = this.WORKPLAN.WP_NUM;
						selData[i].WP_LINENUM = this.editPlan.WP_LINENUM;
						//产品序号
						selData[i].NUMBER = this.proTestList.length>0?this.proTestList[this.proTestList.length-1].NUMBER+i+1 :
							1;
						this.basisList.push(JSON.parse(JSON.stringify(selData[i])));
						// basisnum.push(changeUser[i].S_NUM);//选择的数据的编号
					}
					this.resetBasisInfo1();
					this.$message({
						message: '添加成功',
						type: 'success'
					});
					return;
				}
			},
			//检测项目与要求数据置空
			resetBasisInfo2(){
				this.projectList = [];
				this.resetbtn();
				this.dialogVisible2 = false;
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 20;//页码重新传值
			},
			//检测项目与要求弹出框
            addbasis2(){
            	var selData = this.selUser;
				if(selData.length == 0) {
					this.$message({
						message: '请选择数据',
						type: 'warning'
					});
					return;
				} else {
					for(var i = 0;i<selData.length;i++){
						selData[i].P_DESC = selData[i].P_NAME;
						//可编辑状态
						selData[i].isEditing = false;
						//新选来的数据ID为空
						selData[i].ID = '';
						//产品要求
						selData[i].REMARKS = this.editPlan.REMARKS;
						//产品编号
						selData[i].WP_NUM = this.WORKPLAN.WP_NUM;
						selData[i].WP_LINENUM = this.editPlan.WP_LINENUM;
						//产品序号
						selData[i].NUMBER = this.proTestList.length>0?this.proTestList[this.proTestList.length-1].NUMBER+i+1 :
							1;
						this.proTestList.push(JSON.parse(JSON.stringify(selData[i])));
					}
					this.resetBasisInfo2();
					this.$message({
						message: '添加成功',
						type: 'success'
					});
					return;
				}
			},
			//产品类别
			addbasis3() {
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
					this.$forceUpdate();
					this.editPlan.PRODUCT_TYPE = this.selUser[0].ID;
					this.editPlan.NUM = this.selUser[0].NUM;
					this.resetBasisInfo3();//调用resetBasisInfo3函数
				}
			},
			//产品类别数据置空
			resetBasisInfo3(){
				this.dialogVisible3 = false;
				this.categoryList = [];
				this.selUser = [];
				this.page.currentPage = 1;
				this.page.pageSize = 10;
			},

			addproduct(row){//产品名称按钮
				if(row.PRODUCT_TYPE == ''){
					this.$message({
						message: '请先选择产品类别',
						type: 'warning'
					});
				}else{
					this.requestProname();
					this.dialogVisible4 = true;
				}
			},
			//产品名称弹框确定选中数据
			addbasis4(){
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
					this.editPlan.ITEM_NAME = this.selUser[0].ID;
					this.resetBasisInfo4();
				}
			},
			//产品名称数据置空
			resetBasisInfo4(){
				this.dialogVisible4 = false;
				this.productList = [];
				this.page.currentPage = 1;
				this.page.pageSize = 10;
				this.selUser = [];
			},
			//生产企业、受检企业名称
			addbasis5(){
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
					if(this.deptnum == '1'){
						this.proindex.V_NAME = this.selUser[0].NAME;
					}else if(this.deptnum == '2'){
						this.deptindex.SJ_NAME = this.selUser[0].NAME;
					}
					// this.dialogVisible5 = false;
					// this.$emit('request');
					this.requestDeptname();//调用企业名称requestDeptname函数
					this.resetBasisInfo5();//调用resetBasisInfo函数
				}
			},

			//生产企业名称、受检企业名称数据置空
			resetBasisInfo5(){
				this.dialogVisible5 = false;//关闭弹出框
				this.customerList = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 10;//页码重新传值
			},
			//产品名称数据
			requestProname(){
				this.loading = true;//加载动画打开
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				var url = this.basic_url + '/api-apps/app/product2?NUM_wheres='+this.editPlan.NUM+'&DEPTID_wheres='+this.editPlan.CJDW;
				this.$axios.get(url, {
					
				}).then((res) => {
					this.page.totalCount = res.data.count;
					//总的页数
					let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize)
					if(this.page.currentPage >= totalPage) {
						this.loadSign = false
					} else {
						this.loadSign = true
					}
					this.productList = res.data.data;
					this.loading = false;//加载动画关闭
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}//滚动加载数据判断filing
				}).catch((wrong) => {
					// this.$message({
					// 	message: '网络错误，请重试1',
					// 	type: 'error'
					// });
				})
			},
            //tabs
			handleClick(tab, event) {
			},
			//获取年度抽查计划类别
			getAnnualType(){
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=pm_type';
				this.$axios.get(url, {}).then((res) => {
					this.selectDataType = res.data;
				}).catch((wrong) => {
				})	
			},
            //检测依据弹出框
            basisleadbtn(){
				var basissnum = [];
				for(var i = 0;i<this.basisList.length;i++){
					basissnum.push(this.basisList[i].S_NUM);
				}
				this.basissnums = basissnum.toString(',');
				this.page.currentPage = 1;
				this.requestBasis();
				this.requestnum = '4';
				// this.dialogVisible = true;
				this.basissnums = '';
			},
			basisleadbtn2(){
				var projectpnum = [];
				for(var i = 0;i<this.proTestList.length;i++){
					projectpnum.push(this.proTestList[i].P_NUM);
				}
				this.projectpnums = projectpnum.toString(',');
				this.page.currentPage = 1;
				this.requestProject();
				this.requestnum = '5';
				
				this.projectpnums = '';
			},
			//检测依据数据
			requestBasis(){
				if(!!!this.WORKPLAN.PROP_UNIT){
					this.$message({
						message: '请先选择提出单位',
						type: 'warning'
					});
					return;
				}
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					S_NUM: this.searchList.S_NUM,
					S_NAME: this.searchList.S_NAME,
					S_ENGNAME:this.searchList.S_ENGNAME,
					VERSION: this.searchList.VERSION,
					DEPTID: this.WORKPLAN.PROP_UNIT,
					RELEASETIME: this.searchList.RELEASETIME,
					STARTETIME: this.searchList.STARTETIME,
				};
				var url = this.basic_url +'/api-apps/app/inspectionSta2?PRO_NUM_wheres='+this.editPlanLineRow.NUM+'&S_NUM_where_not_in='+this.basissnums+'&DEPTID_wheres='+this.WORKPLAN.PROP_UNIT;
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
								newarr.push(this.commentArr[i][j])
							}
						}
					}
					this.standardList = newarr;
					this.dialogVisible = true;
				}).catch((wrong) => {})
			},
			//检测项目数据
			requestProject(){
				if(!!!this.WORKPLAN.PROP_UNIT){
					this.$message({
						message: '请先选择提出单位',
						type: 'warning'
					});
					return;
				}
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					S_NAME: this.searchList.S_NAME,
					VERSION: this.searchList.VERSION,
					DEPARTMENT: this.searchList.DEPARTMENT,
					RELEASETIME: this.searchList.RELEASETIME,
					STARTETIME: this.searchList.STARTETIME,
					STATUS: this.searchList.STATUS,
					P_NUM: this.searchList.P_NUM,
					DEPTID: this.WORKPLAN.PROP_UNIT,
					P_NAME: this.searchList.P_NAME,
					VERSION: this.searchList.VERSION,
					STATUS: this.searchList.STATUS,
				};
				this.$axios.get(this.basic_url +'/api-apps/app/inspectionPro2?S_NUM_where_in='+this.basissnums+'&P_NUM_where_not_in='+this.projectpnums+'&DEPTID_wheres='+this.WORKPLAN.PROP_UNIT, {
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
								newarr.push(this.commentArr[i][j])
							}
						}
					}
					this.projectList = newarr;
					this.dialogVisible2 = true;
				}).catch((wrong) => {})
			},
			addprobtn(row){
				if(row.CJDW == ''){
					this.$message({
						message: '请先选择承检单位',
						type: 'warning'
					});
				}else{
					this.dialogVisible3 = true;
					this.editPlanLineRow = row;
					this.requesCategory(row.CJDW);
				}
			},
			//企业名称
			requestDeptname(){
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				var url = this.basic_url + '/api-apps/app/customer?&DEPTID_wheres='+this.WORKPLAN.PROP_UNIT;
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
								newarr.push(this.commentArr[i][j])
							}
						}
					}					
					this.customerList = newarr;
				}).catch((wrong) => {})
			},
			//产品类别数据
			requesCategory(cjdw){
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				};
				this.$axios.get(this.basic_url + '/api-apps/app/productType2?DEPTID=' + cjdw, {
					params: data
				}).then((res) => {
					this.page.totalCount = res.data.count;
					this.categoryList = res.data.data;
				}).catch((wrong) => {})
			},
			handleChange(val) {//手风琴开关效果调用
			},
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			
			addfield1(){//年度计划列表新建行
				if (this.isEditList){
					this.iconOperation(this.editPlan);
	            } 
				var date=new Date();
				this.currentDate = this.$moment(date).format("YYYY-MM-DD");
				this.index = this.index + 1;
				var obj = {
					'ID': '',
					'WP_NUM': 10001,
					'WP_LINENUM': this.index,
					'ITEM_NAME': '',
					'MODEL': '',
					'V_NAME': '',
					'BASIS': '',
					'P_NAME': '',
					//todo  默认值暂时为0
					'CHECKCOST': 0,
					'REASION': '',
					'SJ_NAME':'',
					'MEMO': '',
					'isEditing': true,
					'frontId': this.frontId++,
					'STATUS': '1',
					'VENDOR':  '',
					'CJDW': this.proposeUnit
				};
				// this.worlplanlist.unshift(obj);
				this.worlplanlist.push(obj);
				this.editPlan = this.worlplanlist[this.worlplanlist.length-1];
				this.basisList = [];
				this.proTestList = [];
				this.isEditList = true;
			},
			addfield2(){//文件编号列表新建行
				var obj2 = {
                    STEP:'',
					CERTIFICATE_NUM:'',
					CERTIFICATE_NAME:'',
					ACTIVE_DATE:'',
					STATUS:'',
					MEMO:''
                };
			},
			addfield4(){
				var obj4 = {
                    NUMBER:'',
					P_NUM:'',
					P_DESC:'',
					REMARKS:'',
					VERSION:''
                };
                this.WORKPLAN.WORLPLANLINE_PROJECTList.push(obj4);
			},
			delfield1(item){//年度计划列表删除行
                var index = this.WORKPLAN.WORLPLANLINEList.indexOf(item);
                if (index !== -1) {
                    this.WORKPLAN.WORLPLANLINEList.splice(index, 1);
                }
			},
			delfield3(item){//年度计划列表删除行
                var index = this.inspectionList_child.WORLPLANLINE_BASISList.indexOf(item);
                if (index !== -1) {
                    this.inspectionList_child.WORLPLANLINE_BASISList.splice(index, 1);
                }
			},
			delfield4(item){//年度计划列表删除行
                var index = this.inspectionList_child.WORLPLANLINE_PROJECTList.indexOf(item);
                if (index !== -1) {
                    this.inspectionList_child.WORLPLANLINE_PROJECTList.splice(index, 1);
                }
			},
			col_but(col_but) {
				if(col_but == 'col_but1') {
					this.col_but1 = !this.col_but1;
					this.down = !this.down,
					this.up = !this.up
				}
				if(col_but == 'col_but2') {
					this.col_but2 = !this.col_but2;
					this.down = !this.down,
					this.up = !this.up
				}
			},
			getUser(opt){
				this.$axios.get(this.basic_url +'/api-user/users/currentMap', {}).then((res) => {
					if(opt=='new'){
						this.WORKPLAN.DEPTID = res.data.deptId;
						this.WORKPLAN.ENTERBY = res.data.id;
						this.WORKPLAN.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
						this.WORKPLAN.COMPACTOR= res.data.nickname;
					}else{
						this.WORKPLAN.DEPTID = res.data.deptId;//传给后台机构id
						this.WORKPLAN.CHANGEBY = res.data.id;
						// this.WORKPLAN.DEPARTMENT = res.data.deptName;
						this.WORKPLAN.CHANGEBY = res.data.nickname;
	    				var date = new Date();
						this.WORKPLAN.CHANGEDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
					}
					this.docParm.userid = res.data.id;
					this.docParm.username = res.data.username;
					this.docParm.deptid = res.data.deptId;
					this.docParm.deptfullname = res.data.deptName;
				}).catch((err) => {});
			},
			//点击添加，修改按钮显示弹窗
			visible() {
				this.assignshow = false;//下达 按钮
				var myDate = new Date();
				var date = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				var year = myDate.getFullYear().toString();
				this.deptid=this.$store.state.currentcjdw[0].id
				this.WORKPLAN = {
					'ID': '',
					'WP_NUM': '',
					'DESCRIPTION': '',
					'YEAR': year,	
					'TYPE': '1',
					'STATUS': '1',
					'STATUSDesc': '草稿',
					'LEADER_STATUS': '1',
					'STATUSDATE': date,
					'ITEMTYPE': '',
					'CJDW': this.deptid,
					'PROP_UNIT': '',
					'ENTERBY': '',
					'ENTERDATE': date,
					'CHANGEBY': '',
					'CHANGEDATE': '',
					'COMPACTOR': '',
					'C_PERSON': '',
					'APPRPERSON': '',
					'REPORTDATE': date,
					'MEMO': '',
					'MESSSTATUS': '1',
					'SYNCHRONIZATION_TIME': ''
				};
				this.worlplanlist = []; //年度计划列表
				this.basisList = []; //检测依据
				this.proTestList = []; //项目检测和要求
				this.isEditList = false;
				this.docParm = {
					'model': 'new',
					'appname': '年度计划',
					'recordid': 1,
					'appid': 20
				};
				this.getUser('new');
				this.addtitle = true;
            	this.modifytitle = false;
				this.viewtitle = false;
            	this.modify=false;
            	this.views = false;
            	this.dept = false;
            	this.show = true;
            	this.edit = true;
				this.noedit = false;
			},
			// 这里是修改
			detail(dataid) {
				this.getCompany();
				this.assignshow = false;
				this.$axios.get(this.basic_url +'/api-apps/app/workplan/' + dataid, {}).then((res) => {
					for(var i = 0; i<res.data.WORLPLANLINEList.length; i++){
						res.data.WORLPLANLINEList[i].isEditing = false;
					}
					res.data.CJDW = Number(res.data.CJDW);
					res.data.PROP_UNIT = Number(res.data.PROP_UNIT);
					this.WORKPLAN = res.data;
					this.worlplanlist = res.data.WORLPLANLINEList;
					var worlplanlist = res.data.WORLPLANLINEList;
					for(var i=0, len=worlplanlist.length; i<len; i++){
						worlplanlist[i].isEditing = false;
						worlplanlist[i].frontId = this.frontId++;
					}
					if(res.data.WORLPLANLINEList.length > 0){
						res.data.WORLPLANLINEList[0].isEditing = true;
						this.basisList = res.data.WORLPLANLINEList[0].WORLPLANLINE_BASISList;
						this.proTestList = res.data.WORLPLANLINEList[0].WORLPLANLINE_PROJECTList;
						this.isEditList = true;
					}else{
						this.basisList = [];
						this.proTestList = [];
					}
					this.basisList = res.data.WORLPLANLINEList.length > 0 ? res.data.WORLPLANLINEList[0].WORLPLANLINE_BASISList : [];
					this.proTestList = res.data.WORLPLANLINEList.length > 0 ? res.data.WORLPLANLINEList[0].WORLPLANLINE_PROJECTList : [];
					this.getUser('edit');
					var _this = this;
					setTimeout(function(){
						_this.docParm.model = 'edit';
						_this.docParm.appname = '年度计划';
						_this.docParm.recordid = _this.WORKPLAN.ID;
						_this.docParm.appid = 20;
						_this.$refs.docTable.getData();
					},100);
					var type = "2";
					var url = this.basic_url + '/api-user/depts/treeByType';
					this.$axios.get(url, {
						params: {
							type: type
						},
					}).then((res) => {
						this.selectData = res.data;
					});
				}).catch((err) => {});
				var type = "2";
				var url = this.basic_url + '/api-user/depts/treeByType?id='+this.WORKPLAN.PROP_UNIT;
				this.$axios.get(url, {

				}).then((res) => {
					this.selectData = res.data;
				});
				this.viewtitle = false;
				this.addtitle = false;
				this.modifytitle = true;
				this.modify = true;
				this.views = false;
				this.dept = true;
				this.show = true;
				this.edit = true;
				this.noedit = false;
			},
			//查看
			view(dataid) {
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.views = true; //
				this.dept = true;
				this.noviews = false;
				this.edit = true;
				this.noedit = true;
				this.assignshow = true;//下达工作任务通知书按钮显示
				this.getCompany();
				var _this = this;

				setTimeout(function(){
					_this.docParm.model = 'view';
					_this.docParm.appname = '年度计划';
					_this.docParm.recordid = _this.WORKPLAN.ID;
					_this.docParm.appid = 20;
					_this.$refs.docTable.getData();
				},100);

				var url = this.basic_url + '/api-apps/app/workplan/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					this.WORKPLAN = res.data;
					res.data.PROP_UNIT = Number(res.data.PROP_UNIT);
					this.worlplanlist = res.data.WORLPLANLINEList;
					var worlplanlist = res.data.WORLPLANLINEList;
					for(var i=0, len=worlplanlist.length; i<len; i++){
						worlplanlist[i].isEditing = false;
						worlplanlist[i].frontId = this.frontId++;
					}
					this.basisList = res.data.WORLPLANLINEList.length > 0 ? res.data.WORLPLANLINEList[0].WORLPLANLINE_BASISList : [];
					this.proTestList = res.data.WORLPLANLINEList.length > 0 ? res.data.WORLPLANLINEList[0].WORLPLANLINE_PROJECTList : [];
					this.show = true;

					var type = "2";
					var url = this.basic_url + '/api-user/depts/treeByType';
					this.$axios.get(url, {
						params: {
							type: type
						},
					}).then((res) => {
						this.selectData = res.data;
					});
				}).catch((err) => {});
			},
			//点击关闭按钮
			close() {
				this.show = false;
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
			save(opt) {
				this.$refs.WORKPLAN.validate((valid) => {
					if(!valid && opt == 'docUpload'){
						this.$message({
							message: '请先正确填写信息，再进行文档上传',
							type: 'warning'
						});
					}
					if (valid) {
						if(this.isEditList){
							this.$message({
								message: '请先保存当前年度计划列表数据项',
								type: 'warning'
							});
							this.iconOperation(this.editPlan);
							return;
						}
						if(this.worlplanlist.length>0){
							for(var i=0;i<this.worlplanlist.length;i++){
								if(!this.worlplanlist[i].WORLPLANLINE_PROJECTList||!this.worlplanlist[i].WORLPLANLINE_BASISList||this.worlplanlist[i].WORLPLANLINE_PROJECTList.length == 0||this.worlplanlist[i].WORLPLANLINE_BASISList.length == 0){
									this.$message({
										message: '检测依据、检测项目与要求是必填项，请填写！',
										type: 'warning'
									});
									return false;
								}else{
									if(!this.isEditList){
										this.WORKPLAN.WORLPLANLINEList = this.worlplanlist;
										var url = this.basic_url +'/api-apps/app/workplan/saveOrUpdate';
										this.$axios.post(url, this.WORKPLAN).then((res) => {
											if(res.data.resp_code == 0) {
												if(opt == 'docUpload'){
													this.docParm.recordid = res.data.datas.id;
													this.docParm.model = 'edit';
													this.$refs.docTable.autoLoad();
													this.WORKPLAN.ID = res.data.datas.id;
													this.WORKPLAN.WP_NUM = res.data.datas.WP_NUM;
												}else{
													this.$message({
														message: '保存成功',
														type: 'success'
													});
													if(opt == 'save'){
														this.show = false;
														this.$emit('request');
													}
													if(opt == 'update'){
														this.show = true;
														this.reset();
													}
												}
											}else{
                                                this.$message({
                                                    message: res.data.resp_msg,
                                                    type: 'error'
                                                });
                                            }
										}).catch((err) => {
											// this.$message({
											// 	message: '网络错误，请重试',
											// 	type: 'error'
											// });
										});
										this.falg=true;
									}else{
										this.$message({
											message: '年度计划列表的数据，需保存',
											type: 'warning'
										});
										return false;
									}
								}
							}
						}else{
							this.$message({
								message: '年度计划列表是必填项，请填写！',
								type: 'warning'
							});
							return false;
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
			reset(){
				this.WORKPLAN = {
					'ID': '',
					'WP_NUM': '',
					'DESCRIPTION': '',
					'YEAR': year,	
					'TYPE': '1',
					'STATUS': '1',
					'LEADER_STATUS': '1',
					'STATUSDATE': date,
					'ITEMTYPE': '',
					'PROP_UNIT': '',
					'ENTERBY': '当前人',
					'ENTERDATE': date,
					'CHANGEBY': '',
					'CHANGEDATE': '',
					'COMPACTOR': '',
					'C_PERSON': '',
					'APPRPERSON': '',
					'REPORTDATE': date,
					'MEMO': '',
					'MESSSTATUS': '1',
					'SYNCHRONIZATION_TIME': ''
				};
				this.worlplanlist = []; //年度计划列表
				// this.basisList = []; //检测依据
				// this.proTestList = []; //项目检测和要求
				// this.isEditList = false;
			},
			//保存
			saveAndUpdate(WORKPLAN) {
				this.save('save');
			},
			//保存并继续
			saveAndSubmit(WORKPLAN) {
				this.save('update');
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
					if(this.requestnum == '1'){
						this.requesCategory();
					}else if(this.requestnum == '2'){
						this.requestProname();
					}else if(this.requestnum == '3'){
						this.requestDeptname();
					}else if(this.requestnum == '4'){
						this.requestBasis();
					}else if(this.requestnum == '5'){
						this.requestProject();
					}
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
				if(this.requestnum == '1'){
						this.requesCategory();
					}else if(this.requestnum == '2'){
						this.requestProname();
					}else if(this.requestnum == '3'){
						this.requestDeptname();
					}else if(this.requestnum == '4'){
						this.requestBasis();
					}else if(this.requestnum == '5'){
						this.requestProject();
					}
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
				if(this.requestnum == '1'){
						this.requesCategory();
					}else if(this.requestnum == '2'){
						this.requestProname();
					}else if(this.requestnum == '3'){
						this.requestDeptname();
					}else if(this.requestnum == '4'){
						this.requestBasis();
					}else if(this.requestnum == '5'){
						this.requestProject();
					}
			},
			searchinfo(index) {
				this.page.currentPage = 1;
				this.page.pageSize = 10;
				if(this.requestnum == '1'){
					this.requesCategory();
				}else if(this.requestnum == '2'){
					this.requestProname();
				}else if(this.requestnum == '3'){
					this.requestDeptname();
				}else if(this.requestnum == '4'){
					this.requestBasis();
				}else if(this.requestnum == '5'){
					this.requestProject();
				}
			},
			//检测依据弹出框关闭
			handleClose1(done) {
		       this.resetBasisInfo1();
		    },
		    //检测项目与要求弹出框关闭
		    handleClose2(done) {
		       this.resetBasisInfo2();
		    },
		    //产品类别弹出框关闭
		    handleClose3(done) {
		       this.resetBasisInfo3();
		    },
		    //产品名称弹出框关闭
		    handleClose4(done) {
		        this.resetBasisInfo4();
		    },
		    //生产企业名称、受检企业名称弹出框关闭
		    handleClose5(done) {
		        this.resetBasisInfo5();
			},
			getInspectUnit(){
				var url = this.basic_url + '/api-user/depts/findStation/2';
				this.$axios.get(url, {
				}).then((res) => {
					this.inspectUnit = res.data;
				});
			}
		},
		mounted() {
			this.getInspectUnit();
			this.getCompany();
			this.getAnnualType();
		},
	}
</script>

<style>
	@import '../../assets/css/mask-modules.css';
	.ml60 {margin-left: 60px;}
	#cost{text-align: right !important;}
	#costshow{float: right;}
	.el-dialog__footer {
		padding: 19px 20px 20px;
		text-align: center;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
</style>