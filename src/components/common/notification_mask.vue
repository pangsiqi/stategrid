<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加工作任务通知书</div>
					<div class="mask_title" v-show="modifytitle">修改工作任务通知书</div>
					<div class="mask_title" v-show="viewtitle">查看工作任务通知书</div>
					<div class="mask_title" v-show="reviewtitle">复查工作任务通知书</div>
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
					<el-form inline-message :model="dataInfo" :label-position="labelPosition" :rules="rules" ref="dataInfo" class="demo-form-inline">
						<div class="text-center" v-show="viewtitle">
						<span v-if="this.dataInfo.STATE!=3">	
						<el-button class="start" type="success" round plain size="mini" @click="startup" v-show="start"><i class="icon-start"></i> 启动流程</el-button>
						<el-button class="approval" type="warning" round plain size="mini" @click="approvals" v-show="approval"><i class="icon-edit-3"></i> 审批</el-button>
						</span>
						<el-button type="primary" round plain size="mini" @click="flowmap" ><i class="icon-git-pull-request"></i> 流程地图</el-button>
						<el-button type="primary" round plain size="mini" @click="flowhistory"><i class="icon-plan"></i> 流程历史</el-button>
						<el-button type="primary" round plain size="mini" @click="viewpepole"><i class="icon-user"></i> 当前责任人</el-button>
					</div>
					   <div class="content-accordion">
						<el-collapse v-model="activeNames">
							<el-collapse-item title="类型" name="1">
								<el-row :gutter="20" class="pb10">
									<el-col :span="4" class="pull-right">
										<el-input v-model="dataInfo.STATEDesc" :disabled="edit">
											<template slot="prepend">状态</template>
										</el-input>
									</el-col>
									<el-col :span="5" class="pull-right">
										<el-input v-model="dataInfo.N_CODE" :disabled="edit" placeholder="自动生成">
											<template slot="prepend">编号</template>
										</el-input>
									</el-col>
								</el-row>
								<el-form-item label="" prop="TYPE">
									<el-radio-group v-model="dataInfo.TYPE" :disabled="special || dataInfo.WP_NUM!=''">
										<el-row v-if="!addtitle">
											<el-col :span="4" v-if="!addtitle" >
												<el-radio label="1">监督抽查</el-radio>
											</el-col>
											<el-col :span="4">
												<el-radio label="2">监督抽查复查</el-radio>
											</el-col>
											<el-col :span="4" >
												<el-radio label="3">质量抽查</el-radio>
											</el-col>
											<el-col :span="4">
												<el-radio label="4">质量抽查复查</el-radio>
											</el-col>
										</el-row>	
										<el-row>
											<el-col :span="4">
												<el-radio label="5">生产许可证</el-radio>
											</el-col>
											<el-col :span="4">
												<el-radio label="6">认定检验检测</el-radio>
											</el-col>
											<el-col :span="4">
												<el-radio label="7">鉴定试验</el-radio>
											</el-col>
											<el-col :span="4">
												<el-radio label="8">委托检验检测</el-radio>
											</el-col>
											<el-col :span="4">
												<el-radio label="9">专项抽查</el-radio>
											</el-col>
											<el-col :span="4">
												<el-radio label="10">专项抽查复查</el-radio>
											</el-col>
											<el-col :span="4">
												<el-radio label="11">其它</el-radio>
											</el-col>
										</el-row>	
									</el-radio-group>
								</el-form-item>
							</el-collapse-item>
							<el-collapse-item title="基本信息" name="2">
								<el-row>
									<el-col :span="8">
										<el-form-item label="计划编号" prop="WP_NUM" label-width="110px">
											<el-input v-model="dataInfo.WP_NUM" :disabled="edit">
													<el-button slot="append" :disabled="false ||( dataInfo.TYPE!='2' && dataInfo.TYPE!='4')" icon="el-icon-search"></el-button>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="任务号" prop="TASKNUM" label-width="110px">
											<el-input v-model="dataInfo.TASKNUM" :disabled="noedit || dataInfo.WP_NUM!=''"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8" v-show="reviewtitle">
										<el-form-item label="原工作任务通知书编号" prop="PARENTWONUM" label-width="160px" >
											<el-input v-model="dataInfo.PARENTWONUM" :disabled="edit">
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="8" >
										<el-form-item label="承检单位" prop="CJDW" label-width="110px">
											<el-select	v-model="dataInfo.CJDW" 
														default-first-option 
														placeholder="请选择" 
														:disabled="special || dataInfo.TYPE=='2' || dataInfo.TYPE=='4' || dataInfo.WP_NUM!=''" 
														style="width: 100%"
														@change="changeCJDW">
												<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="产品类别" prop="PRODUCT_TYPE" label-width="110px">
											<el-input v-model="dataInfo.PRODUCT_TYPE" disabled>
												   <el-button slot="append" :disabled="special || dataInfo.TYPE=='2' || dataInfo.TYPE=='4'|| dataInfo.WP_NUM!=''" icon="el-icon-search" @click="addcategory"></el-button>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="受检产品名称" prop="ITEM_NAME" label-width="110px">
											<el-input v-model="dataInfo.ITEM_NAME" disabled>
												   <el-button slot="append" :disabled="special || dataInfo.TYPE=='2' || dataInfo.TYPE=='4'|| dataInfo.WP_NUM!=''" icon="el-icon-search" @click="addproduct"></el-button>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="8">
										<el-form-item label="受检产品型号" prop="ITEM_MODEL" label-width="110px">
											<el-input v-model="dataInfo.ITEM_MODEL" :disabled="special || dataInfo.TYPE=='2' || dataInfo.TYPE=='4'|| dataInfo.WP_NUM!=''"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="项目负责人" prop="P_LEADERDesc" label-width="110px">
											<el-input v-model="dataInfo.P_LEADERDesc" :disabled="true">
												<el-button :disabled="noedit || dataInfo.TYPE=='2' || dataInfo.TYPE=='4'" slot="append" icon="el-icon-search" @click="addperbtn('leader')"></el-button>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-collapse-item>
							<el-collapse-item title="检验检测要求" name="4" label-width="100px">
									<el-row>
									<el-col :span="8">
										<el-form-item label="受检企业" prop="V_NAMEDesc" label-width="140px">
											<el-input v-model="dataInfo.V_NAMEDesc" disabled>
												<el-button slot="append" :disabled="noedit || dataInfo.TYPE=='2' || dataInfo.TYPE=='4'|| dataInfo.WP_NUM!=''" icon="el-icon-search" @click="getDept('notice')" ></el-button>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="样品数量" prop="QUALITY" label-width="110px">
											<el-input v-model.number="dataInfo.QUALITY" :disabled="noedit"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="接收人" prop="ACCEPT_PERSONDesc" label-width="110px">
											<el-input v-model="dataInfo.ACCEPT_PERSONDesc" :disabled="edit || dataInfo.TYPE=='2' || dataInfo.TYPE=='4'">
												<el-button slot="append" icon="el-icon-search" @click="addperbtn('accept')" :disabled="noedit || dataInfo.TYPE=='2' || dataInfo.TYPE=='4'"></el-button>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-form-item label="抽样方案" prop="SOLUTION" label-width="140px">
										<el-input v-model="dataInfo.SOLUTION" :disabled="noedit"></el-input>
									</el-form-item>
								</el-row>
							</el-collapse-item>
							<div class="el-collapse-item pt10 pb20" aria-expanded="true" accordion>
								<el-tabs v-model="activeName" @tab-click="handleClick">
									<el-tab-pane label="检验依据" name="first">
										<div class="table-func table-funcb">
											<el-button type="success" size="mini" round @click="addfieldBasis" v-show="!(dataInfo.TYPE=='2' || dataInfo.TYPE=='4'|| dataInfo.WP_NUM!='')">
													<i class="icon-add"></i>
													<font>新建行</font>
											</el-button>
											<el-button type="primary" size="mini" round @click="basisleadbtn" :dialog="view" v-show="!(dataInfo.TYPE=='2' || dataInfo.TYPE=='4'|| dataInfo.WP_NUM!='')">
												<i class="icon-search"></i>
												<font>选择</font>
											</el-button>
										</div>

										<el-table :data="dataInfo.WORK_NOTICE_CHECKBASISList" row-key="ID" border stripe :fit="true" max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'dataInfo.WORK_NOTICE_CHECKBASISList', order: 'descending'}">
											<el-table-column label="序号" sortable width="80px" prop="NUMBER" type="index">
											</el-table-column>
											<el-table-column label="检验标准编号" sortable width="200px" prop="S_NUM">
												<template slot-scope="scope">
													<el-form-item :prop="'WORK_NOTICE_CHECKBASISList.' + scope.$index + '.S_NUM'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
													<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.S_NUM" placeholder="请输入内容">
														   <!-- <el-button slot="append" icon="el-icon-search" :disabled="standard"></el-button> -->
													</el-input>
													<span v-show="!scope.row.isEditing">{{scope.row.S_NUM}}</span>
													</el-form-item>
												</template>
											</el-table-column>
											<el-table-column prop="S_NAME" label="检验标准名称" sortable>
												<template slot-scope="scope">
													<el-form-item :prop="'WORK_NOTICE_CHECKBASISList.' + scope.$index + '.S_NAME'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
													<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.S_NAME" placeholder="请输入内容"></el-input><span v-show="!scope.row.isEditing">{{scope.row.S_NAME}}</span>
													</el-form-item>
												</template>
											</el-table-column>
											
											<el-table-column prop="VERSION" label="版本" sortable width="120px">
												<template slot-scope="scope">
													<el-form-item :prop="'WORK_NOTICE_CHECKBASISList.' + scope.$index + '.VERSION'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
													<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.VERSION" placeholder="请输入内容"></el-input>
													<span v-show="!scope.row.isEditing">{{scope.row.VERSION}}</span>
													</el-form-item>
												</template>
											</el-table-column>
											<el-table-column prop="FILESIZE" label="文件大小" sortable width="120px">
												<template slot-scope="scope">
													<span>{{(scope.row.FILESIZE<0?scope.row.FILESIZE:0) + 'M'}}</span>
												</template>
											</el-table-column>
											<el-table-column fixed="right" label="操作" width="100">
												<template slot-scope="scope">
													<el-button @click="deleteRow(scope.$index,scope.row,'secondList')" type="text" size="small" v-if="!viewtitle">
														<i class="icon-trash red"></i>
													</el-button>
													<el-button @click="viewFile(scope.row)" type="text" size="small" v-if="!viewtitle">
														<i class="icon-log red"></i>
													</el-button>
												</template>
											</el-table-column>
										</el-table>
									</el-tab-pane>
									<el-tab-pane label="检验检测项目" name="second">
										<div class="table-func table-funcb">
											<el-button type="success" size="mini" round @click="addfieldProject" v-show="!(dataInfo.TYPE=='2' || dataInfo.TYPE=='4'|| dataInfo.WP_NUM!='')">
													<i class="icon-add"></i>
													<font>新建行</font>
											</el-button>
											<el-button type="primary" size="mini" round @click="basisleadbtn2" v-show="!(dataInfo.TYPE=='2' || dataInfo.TYPE=='4'|| dataInfo.WP_NUM!='')">
												<i class="icon-search"></i>
												<font>选择</font>
											</el-button>
										</div>
										<el-table :data="dataInfo.WORK_NOTICE_CHECKPROJECTList" row-key="ID" border stripe :fit="true"
										 highlight-current-row="highlight-current-row" style="width: 100%;"
										  @cell-click="iconOperation" :default-sort="{prop:'dataInfo.WORK_NOTICE_CHECKPROJECTList', order: 'descending'}">
											<el-table-column label="序号" sortable width="120px" prop="NUMBER" type="index">
											</el-table-column>
											<el-table-column label="检验检测项目编号" sortable width="145px" prop="P_NUM">
												<template slot-scope="scope">
													<el-form-item :prop="'WORK_NOTICE_CHECKPROJECTList.' + scope.$index + '.P_NUM'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
													<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.P_NUM" placeholder="请输入内容">
														<!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
													</el-input>
													<span v-show="!scope.row.isEditing">{{scope.row.P_NUM}}</span>
													</el-form-item>
												</template>
											</el-table-column>
											<el-table-column prop="P_DESC" label="检验检测项目内容" sortable width="250px">
												<template slot-scope="scope">
													<el-form-item :prop="'WORK_NOTICE_CHECKPROJECTList.' + scope.$index + '.P_DESC'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
														<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.P_DESC" placeholder="请输入内容"></el-input>
														<span v-show="!scope.row.isEditing">{{scope.row.P_DESC}}</span>
													</el-form-item>
												</template>
											</el-table-column>
											<el-table-column prop="REMARKS" label="要求" sortable width="180px">
												<template slot-scope="scope">
													<el-form-item :prop="'WORK_NOTICE_CHECKPROJECTList.' + scope.$index + '.REMARKS'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
														<el-input size="small" v-model="scope.row.REMARKS" placeholder="请输入内容"></el-input>
													</el-form-item>
												</template>
											</el-table-column>
											<el-table-column prop="UNITCOST" label="单价" sortable width="100px">
												<!-- <template slot-scope="scope">
													<el-form-item :prop="'WORK_NOTICE_CHECKPROJECTList.' + scope.$index + '.UNITCOST'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
														<el-input size="small" v-model="scope.row.UNITCOST" placeholder="请输入内容"></el-input>
													</el-form-item>
												</template> -->
											</el-table-column>
											<el-table-column prop="VERSION" label="版本" sortable width="120px">
												<template slot-scope="scope">
													<el-form-item :prop="'WORK_NOTICE_CHECKPROJECTList.' + scope.$index + '.VERSION'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
													<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.VERSION" placeholder="请输入内容"></el-input>
													<span v-show="!scope.row.isEditing">{{scope.row.VERSION}}</span>
													</el-form-item>
												</template>
											</el-table-column>
											<!-- <el-table-column prop="STATUS" label="信息状态" sortable width="120px">
												<template slot-scope="scope">
													<el-form-item :prop="'WORK_NOTICE_CHECKPROJECTList.' + scope.$index + 'STATUS'" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
													<el-input v-show="scope.row.isEditing" size="small" v-model="scope.row.STATUS" placeholder="请输入内容"></el-input>
													<span v-show="!scope.row.isEditing">{{scope.row.STATUS}}</span>
													</el-form-item>
												</template>
											</el-table-column> -->
											<el-table-column label="附件" sortable width="120px">
												<template slot-scope="scope" v-if="!views">
													<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
														<el-button size="small" type="primary" >点击上传</el-button>
													</el-upload>
												</template>
											</el-table-column>
											<el-table-column fixed="right" label="操作" width="100px">
												<template slot-scope="scope">
													<el-button @click="deleteRow(scope.$index,scope.row,' onthebasisList')" type="text" size="small" v-if="!viewtitle" :disabled="views">
														<i class="icon-trash red"></i>
													</el-button>
												</template>
											</el-table-column>
										</el-table>
									</el-tab-pane>
								</el-tabs>
							</div>
							<el-collapse-item title="完成日期及费用" name="6">
								<el-row >
									<el-col :span="8">
										<el-form-item label="完成日期" prop="COMPDATE" label-width="110px">
											<el-date-picker v-model="dataInfo.COMPDATE" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :disabled="noedit" style="width: 100%">
											</el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="检验检测费用(元)" prop="CHECTCOST" label-width="130px">
											<el-input v-model="dataInfo.CHECTCOST" :disabled="noedit" id="cost" @blur="toPrice"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="下达日期" prop="XD_DATE" label-width="110px">
											<el-date-picker v-model="dataInfo.XD_DATE" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :disabled="noedit" style="width: 100%">
											</el-date-picker>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="30">
									<el-col :span="24">
										<el-form-item label="备注" prop="MEMO" label-width="110px">
											<el-input type="textarea" rows="5" v-model="dataInfo.MEMO" :disabled="noedit"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-collapse-item>
							<el-collapse-item title="其他" name="7" v-show="views">
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
								<el-row>
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
							</el-collapse-item>
						</el-collapse>
						</div>
					</el-form>
					<div class="content-footer" v-show="reviewtitle">
	          <el-button type="primary" @click="save('Update')">保存</el-button>
						<el-button @click="close">取消</el-button>
					</div>
					<div class="content-footer" v-show="noviews">
	          <el-button type="primary" @click="save('Update')">保存</el-button>
						<el-button type="success" v-show="addtitle" @click="save('Submit')">保存并继续</el-button>
						<el-button @click="close">取消</el-button>
					</div>
					<div class="content-footer" v-show="views">
						<el-button type="success" v-if="this.dataInfo.STATE == 3" @click="buildcheck">生成检验委托书</el-button>
						<el-button type="success" v-if="this.dataInfo.STATE == 3" @click="buildtest">生成检测委托书</el-button>
					</div>	
				</div>
			</div>
			<!-- 人员 -->
			<el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" title="用户信息">
				<el-form inline-message :model="searchList">
					<el-row :gutter="10">
						<el-col :span="5">
							<el-form-item label="用户名" prop="username" label-width="55px">
								<el-input v-model="searchList.username">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="姓名" prop="nickname" label-width="45px">
								<el-input v-model="searchList.nickname">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2">
							<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px" :disabled="views">搜索</el-button>
						</el-col>
					</el-row>
				</el-form>

				<el-table :header-cell-style="rowClass" :data="gridDataList" line-center border stripe height="360px" style="width: 100%;" :default-sort="{prop:'gridDataList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore"
				v-loading="loading"  
				element-loading-text="加载中…"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(255, 255, 255, 0.9)">
					<el-table-column type="selection" align="center" width="55" fixed>
					</el-table-column>
					<el-table-column label="ID" sortable width="70px" prop="id">
					</el-table-column>
					<el-table-column label="姓名" sortable width="200px" prop="nickname">
					</el-table-column>
					<el-table-column label="机构" sortable width="200px" prop="deptName">
					</el-table-column>
					<el-table-column label="公司" sortable prop="companyName">
					</el-table-column>
				</el-table>

				<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
				</el-pagination>

				<div slot="footer">
	    			<el-button type="primary" @click="dailogconfirm" :disabled="views">确 定</el-button>
	    			<el-button @click="resetBasisInfo" :disabled="views">取 消</el-button>
	  			</div>
			</el-dialog>
			<!-- 产品类别  -->
			<categorymask ref="categorychild" @categorydata="categorydata"></categorymask>
			<!-- 产品名称  -->
			<productmask ref="productchild" @appenddata="appenddata"></productmask>
			<!--受检企业-->
			<enterprisemask ref="enterprisechild" @appendnames="appendnames"></enterprisemask>
			<!--审批页面-->
			<approvalmask :approvingData="approvingData" ref="approvalChild" @detail="detailgetData"></approvalmask>
			<!--流程历史-->
			<flowhistorymask :approvingData="approvingData"  ref="flowhistoryChild" ></flowhistorymask>
			<!--流程地图-->
			<flowmapmask :approvingData="approvingData" ref="flowmapChild" ></flowmapmask>
			<!--当前责任人-->
			<vewPoplemask :approvingData="approvingData"  ref="vewPopleChild" ></vewPoplemask>
			<!-- 检测依据  -->
			<teststandardmask ref="standardchild" @testbasis="addbasis"></teststandardmask>
			<!-- 检测项目  -->
			<testprojectmask ref="projectchild" @testproject="addproject"></testprojectmask>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import categorymask from '../common/common_mask/categorylistmask.vue'//产品类别
	import productmask from '../common/common_mask/productlistmask.vue'//产品
	import enterprisemask from '../common/common_mask/enterprisemask.vue'//受检企业
	import approvalmask from '../workflow/approving.vue'//审批页面
	import flowhistorymask from '../workflow/flowhistory.vue'//流程历史
	import flowmapmask from '../workflow/flowmap.vue'//流程地图
	import vewPoplemask from '../workflow/vewPople.vue'//当前责任人
	import teststandardmask from '../common/common_mask/teststandardmask.vue'//检测依据
	import testprojectmask from '../common/common_mask/testprojectmask.vue'//检测依据

	export default {
		name: 'masks',
		components: {
			 approvalmask,
			 flowhistorymask,
			 flowmapmask,
			 vewPoplemask,
			 categorymask,
			 productmask,
			 enterprisemask,
			 teststandardmask,
			 testprojectmask,
		},
		data() {
			return {
				loading: false,
				loadSign:true,//加载
				approvingData:{},//流程的数据
				commentArr:{},
				falg:false,//保存验证需要的
				basic_url: Config.dev_url,
				po_url: Config.po_url,
				gridDataList: [], //彈出框的數據
				fileList: [],
				Selectsys_depttype:[],//能力类别
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 
				getCheckboxData: {},
				resourceProps: {
					children: "children",
					label: "fullname"
				},
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				searchList: {
					nickname: '',
					username: '',
				},
				value: '',
				selUser: [],
				reviewtitle:false,// 原工作任务通知书编号
				edit: true, //禁填
				noedit: false,
				special:false,//特殊
				plan:false,
				editSearch: '', //判斷項目負責人和接收人
				col_but1: true,
				col_but2: true,
				show: false,
				isok1: true,
				isok2: false,
				type: '',
				standard:false,//检验标准编号
				addtitle: true, //添加弹出框titile
				modifytitle: false, //修改弹出框titile
				viewtitle: false, //查看弹出框title
				modify: false,
				views: false,
				noviews: true, //保存的按钮
				approval:false,
				start:false,
				activeName: 'first', //tabs
				activeNames: ['1', '2', '3', '4', '5', '6', '7'], //手风琴数量
				labelPosition: 'right', //表格
				dialogVisible: false, //对话框
				dataInfo: { //添加数据库列表信息
					N_CODE: '',
					TYPE: '',
					XD_DATE: '',
					PRODUCT_TYPE:'',
					ITEM_NAME: '',
					ITEM_MODEL: '',
					V_NAME: '',
					V_NAMEDesc:'',
					VENDOR:'',
					CJDW: '',
					P_LEADER: '',
					TASKNUM: '',
					SOLUTION: '',
					COMPDATE: '',
					PRODUCE_TYPE:'',
					STATE: '1',
					STATEDesc: '草稿',
					ENTERBY: '',
					STATUS: '',
					CHECTCOST:'',
					WORK_NOTICE_CHECKBASISList: [],
					WORK_NOTICE_CHECKPROJECTList: [],
				},
				rules: {
					TYPE:[{required: true, message: '请至少选择一个', trigger: 'change'}],
					TASKNUM:[{required: false, trigger: 'change', validator:this.Validators.isSpecificKey}],
					CJDW: [{required: true,trigger: 'change',message: '请选择',}], //承检单位
					P_LEADERDesc: [{required: true, trigger: 'blur', message: '请选择'}], //项目负责人
					PRODUCT_TYPE: [{required: true, trigger: 'blur', message:'请选择'}], //受检产品类别
					ITEM_NAME: [{required: true, trigger: 'blur', message:'请选择'}], //受检产品名称
					ITEM_MODEL: [
						{required: true,trigger: 'blur',message: '必填'},
						{trigger: 'blur', validator:this.Validators.isSpecificKey}
					], //受检产品型号
					V_NAME: [{required: true,validator: this.Validators.isSpecificKey}], //受检企业
					VENDOR: [{required: true,trigger: 'blur',message: '必填'}], //受检企业编号
					QUALITY: [{required: true,message: '必填'},{ type: 'number', message: '必须为数字值'}], //样品数量
					CHECTCOST:[{required: false, trigger:'blur', validator:this.Validators.isPrices}], //检验检测费用
					XD_DATE: [{type: 'string', required: true, message: '请选择', trigger: 'change'}],//下达日期
					SOLUTION: [
						{required: true,trigger: 'blur',message: '必填',	},
						{trigger: 'blur',validator: this.Validators.isSpecificKey},
					],//抽样方案
					MEMO: [
						{required: false, trigger: 'blur', validator: this.Validators.isSpecificKey},
					],
					COMPDATE:[{required: true, trigger: 'blur', message: '必填'},]
					// REMARKS: [{required: true,trigger: 'blur',message: '必填',}],
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据
				selectData:[],//承检单位数据
				dataid:2,//修改和查看带过的id
				workNot:'workNot',//appname
				catenum:'',//产品类别作为参数传值给依据
				pronum:'',//产品作为参数传值给依据
				basisnum:'',////依据选中数据们字符串作为参数传值给项目
				PRODUCT_TYPE:'',//产品类别
				username:'',
				sendchilddata:[],//子表已有的值
			};
		},
		methods: {
			viewFile(){
				var url = this.po_url+'/show?fileid=' +  row.FILEID
						+ '&userid=' +  this.docParm.userid
						+ '&username=' + this.docParm.username
						+ '&deptid=' + this.docParm.deptid
						+ '&deptfullname=' + this.docParm.deptfullname
				window.open(url); 
			},
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			reset() {
				this.dataInfo = {
					WP_NUM: '',
					N_CODE: '',
					TYPE: '',
					XD_DATE: '',
					ITEM_NAME: '',
					PRODUCT_TYPE:'',
					ITEM_MODEL: '',
					V_NAME: '',
					V_NAMEDesc:'',
					VENDOR:'',
					CJDW: '',
					PRODUCE_TYPE:'',
					P_LEADER: '',
					TASKNUM: '',
					SOLUTION: '',
					COMPDATE: '',
					STATE: '1',
					STATEDesc: '草稿',
					ENTERBY: '',
					STATUS: '',
					CHECTCOST:'',
					WORK_NOTICE_CHECKBASISList: [],
					WORK_NOTICE_CHECKPROJECTList: [],
				}
				// this.$nextTick(() => {
				// 	this.$refs.form.resetFields();
				// });
				// this.$refs["dataInfo"].resetFields();
			},
			//机构值
			getCompany() {
				var type = "2";
				var url = this.basic_url + '/api-user/depts/treeByType';
				this.$axios.get(url, {
					params: {
						type: type
					},
				}).then((res) => {
					this.selectData = res.data;
				});
			},
			changeCJDW(){
				this.getCompany();
				this.getDeptPerson();
				this.dataInfo.PRODUCT_TYPE = '';
				this.dataInfo.P_NUM = '';
				this.dataInfo.ITEM_NAME = '';
				this.dataInfo.PRO_NUM = '';
				this.dataInfo.S_NUM = '';
				this.dataInfo.WORK_NOTICE_CHECKBASISList = [];
				this.dataInfo.WORK_NOTICE_CHECKPROJECTList = [];
			},

			// 受检企业
			getDept(parm){
				this.$refs.enterprisechild.getData(parm);
			},
			getDeptPerson() {//高级查询
				var data = {
					params: {
						id: this.dataInfo.CJDW
					}
				};
				var url = this.basic_url + '/api-user/depts/treeMap';
				this.$axios.get(url, data).then((res) => {
					if(res.data.length > 0){
						var data  = res.data[0];
						this.dataInfo.P_LEADERDesc = data.leaderName;
						this.dataInfo.P_LEADERD = data.leader;
						this.dataInfo.ACCEPT_PERSONDesc = data.leaderName;
						this.dataInfo.ACCEPT_PERSON = data.leader;
					}
				}).catch((wrong) => {
					this.$message({
						message: wrong.resp_msg,
						type: 'warning'
					});
				})
			},
			addcategory(){//产品类别
				if(!!this.dataInfo.CJDW){
					this.$refs.categorychild.visible(this.dataInfo.CJDW);
				}else{
					this.$message({
						message: '请先选择承检单位',
						type: 'warning'
					});
				}
			},
			addproduct(){//受检产品名成
				if(!!this.dataInfo.P_NUM){
					this.$refs.productchild.visible(this.dataInfo.P_NUM,this.dataInfo.CJDW);
				}else{
					this.$message({
						message: '请先选择产品类别',
						type: 'warning'
					});
				}
			},
			//单位
			addCompany(type){
				var CJDW = this.dataInfo.CJDW;
				var id;
				this.$refs.enterprisechild.visible(type,id,CJDW);
			},
			handleNodeClick(data) { //获取勾选树菜单节点
			},
			handleCheckChange(data, checked, indeterminate) {
				this.getCheckboxData = data;
			},
			getCheckedNodes() { //获取树菜单节点
				this.checkedNodes = this.$refs.tree.getCheckedNodes()
			},
			
			toNum(str) {
				return str.replace(/\,|\￥/g, "");
			},
			//金额两位小数点千位分隔符，四舍五入
			toPrice() {
				var money = document.getElementById("cost").value;
				var num = parseFloat(this.toNum(money)).toFixed(2).toString().split(".");
				num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");
				this.dataInfo.CHECTCOST = num.join(".");
			},

			//tabs
			handleClick(tab, event) {
			},
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing
				}
			},
			//删除行
			deleteRow(index, row, listName){
				var TableName = '';
				if(listName =='secondList'){
					TableName = 'WORK_NOTICE_CHECKBASIS';
				}else{
					TableName = 'WORK_NOTICE_CHECKPROJECT';
				}
				if(row.ID){
					var url = this.basic_url + '/api-apps/app/workNot/' + TableName +'/' + row.ID;
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
			sizeChange(val) {
				this.page.pageSize = val;
			},
			currentChange(val) {
				this.page.currentPage = val;
			},
			//新建行检测依据
			addfieldBasis() {
				var obj = {
					NUMBER: '1',
					S_NUM: '',
					DEPTTYPE:'1',
					S_NAME: '',
					S_ENGNAME: '',
					VERSION: '',
					STATUS: '1',
					isEditing: true
				};
				this.dataInfo.WORK_NOTICE_CHECKBASISList.push(obj);
			},
				//检测依据放大镜
			basisleadbtn(){
				var snum=this.dataInfo.WORK_NOTICE_CHECKBASISList;
				var basislist=[];
				for(var i=0;i<snum.length;i++){
          	basislist.push(snum[i].S_NUM);
				}
				var basisnums=basislist.join(',');
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
				}
			},
			//检验依据列表赋值
			addbasis(val){
				for(var i = 0;i<val.length;i++){
						var List={
								S_NUM: val[i].S_NUM,
								S_NAME: val[i].S_NAME,
								VERSION:val[i].VERSION,
								DEPTTYPE:'2',
						};
						this.dataInfo.WORK_NOTICE_CHECKBASISList.push(List);
				}
			},
			//检验检测项目
			addfieldProject() {
				var obj = {
					NUMBER: '1',
					P_NUM: '',
					DEPTTYPE:'1',
					P_DESC: '',
					REMARKS: '',
					VERSION: '1',
					STATUS: '1',
					isEditing: true
				};
				this.dataInfo.WORK_NOTICE_CHECKPROJECTList.push(obj);
			},
		 //检测项目放大镜
      basisleadbtn2(){
					var arr=[];
					var proxy=[];
					var proxylist=this.dataInfo.WORK_NOTICE_CHECKPROJECTList;
					for(var j=0;j<proxylist.length;j++){
							proxy.push(proxylist[j].P_NUM);
					}
					var proxypnum=proxy.join(',');
					for(var i = 0;i<this.dataInfo.WORK_NOTICE_CHECKBASISList.length;i++){
						arr.push(this.dataInfo.WORK_NOTICE_CHECKBASISList[i].S_NUM);
					}
					var sum=arr.join(',');
        if(this.dataInfo.WORK_NOTICE_CHECKBASISList.length==0 ){
            this.$message({
              message: '请先选择检验依据列表数据',
              type: 'warning'
            });
        }else{
						var data={
							P_NUM:this.dataInfo.P_NUM,
							PRO_NUM:this.dataInfo.PRO_NUM,
							S_NUM:sum,
							proxypnum:proxypnum
						}
          this.$refs.projectchild.projectlead(data);
        }
      },
			 //检验项目列表
			addproject(value){
					for(var i = 0;i<value.length;i++){
						var list={
								P_NUM:value[i].P_NUM,
								P_DESC:value[i].P_NAME,
								REMARKS:'',
								UNITCOST:value[i].UNITCOST,
								VERSION:value[i].VERSION,
								QUATITY:0,
								DEPTTYPE:'2',
						}	
						this.dataInfo.WORK_NOTICE_CHECKPROJECTList.push(list);
				}
			},
			//刪除新建行
			delfieldBasis(item) {
				var index = this.dataInfo.WORK_NOTICE_CHECKBASISList.indexOf(item);
				if(index !== -1) {
					this.dataInfo.WORK_NOTICE_CHECKBASISList.splice(index, 1);
				}
			},
			//添加显示弹窗
			visible() {
				this.reset();
				this.reviewtitle=false;
				this.noviews=true;
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.dataInfo.DEPTID = res.data.deptId;
					this.dataInfo.ENTERBY = res.data.id;
					var date = new Date();
					this.dataInfo.ENTERDATE = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err) => {
				})
				this.special = false;
				this.addtitle = true;
				this.modifytitle = false;
				this.viewtitle = false;
				this.views = false;
				this.noviews = true;
				this.edit = true;
				this.noedit = false;
			},
			detailgetData() {
				var url = this.basic_url +'/api-apps/app/workNot/' + this.dataid;
				this.$axios.get(url, {}).then((res) => {
					//依据对号控制
					for(var i = 0; i<res.data.WORK_NOTICE_CHECKBASISList.length;i++){
						res.data.WORK_NOTICE_CHECKBASISList[i].isEditing = false;
					}
					//项目要求对号控制
					for(var j = 0; j<res.data.WORK_NOTICE_CHECKPROJECTList.length;j++){
						res.data.WORK_NOTICE_CHECKPROJECTList[j].isEditing = false;
					}
					this.dataInfo = res.data; 
					this.dataInfo.CJDW=this.dataInfo.CJDWDesc;
					console.log(res);
					if(this.dataInfo.TYPE==2||this.dataInfo.TYPE==4){
						this.reviewtitle = true;
					}else{
						this.reviewtitle  = false;
					}
					this.show = true;
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
					if(this.dataInfo.WP_NUM!=undefined||this.dataInfo.WP_NUM!=null){
							this.special=true;
							this.noviews=false;
					}else{
							this.special=false;
							this.noviews=true;
					}
					var date = new Date();
					this.dataInfo.CHANGEDATE = this.$moment(date).format("YYYY-MM-dd HH:mm:ss");
				}).catch((err) => {
				});
				this.detailgetData();
				this.addtitle = false;
				this.modifytitle = true;
				this.reviewtitle=true;
				this.viewtitle = false;
				this.noviews = true;
				this.views = false; //
				this.edit = true;
				this.noedit = false;
			},
			//这是查看
			view(dataid) {
				this.dataid=dataid;
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = true;
				this.views = true; //
				this.noviews = false;
				this.edit = true;
				this.noedit = true;
				this.special=true;
				this.detailgetData();
				this.isEditing=false;
				//判断启动流程和审批的按钮是否显示
				var url = this.basic_url + '/api-apps/app/workNot/flow/isStart/'+dataid;
					this.$axios.get(url, {}).then((res) => {
					  if(res.data.resp_code==1){
							this.start=true;
							this.approval=false;
						}else{
						var url = this.basic_url + '/api-apps/app/workNot/flow/Executors/'+dataid;
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
			//
			review(dataid){
				console.log(dataid);
					var url = this.basic_url + '/api-apps/app/workNot/operate/createWorkNotice/?ID=' + dataid;
					this.$axios.get(url, {}).then((res) => {
							if(res.data.resp_code == 0) {
									this.dataInfo=res.data;
									this.show=true;
							}
					}).catch((wrong) => {
					})
				this.dataInfo.ISCREATED=1;	
				this.addtitle = false;
				this.modifytitle = false;
				this.viewtitle = false;
				this.reviewtitle=true; 
				this.views = false; //
				this.noviews = false;
				this.edit = true;
				this.noedit = true;
				this.special=true;
				this.isEditing=false;
			},
			//上传文件 Begin
			handleRemove(file, fileList) {
			},
			handlePreview(file) {
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			//上传文件 End
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');
			},
			open(){
				this.show = true;
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
			//接到产品类别的值
			categorydata(value){
				console.log(value)
				this.dataInfo.P_NUM = value[0];
				// this.dataInfo.PRODUCT_TYPEDesc = value[1];
			  this.dataInfo.PRODUCT_TYPE = value[1];
				this.dataInfo.ITEM_NAME = '';
				this.dataInfo.PRO_NUM = '';
				this.dataInfo.S_NUM = '';
				this.dataInfo.WORK_NOTICE_CHECKBASISList = [];
				this.dataInfo.WORK_NOTICE_CHECKPROJECTList = [];
			},
			//接到产品的值
			appenddata(value){
				this.dataInfo.PRO_NUM = value[0];
				this.dataInfo.ITEM_NAME = value[1];
				this.dataInfo.S_NUM = '';
				this.dataInfo.WORK_NOTICE_CHECKBASISList = [];
				this.dataInfo.WORK_NOTICE_CHECKPROJECTList = [];
			},
		appendnames(value){
				if(value.TYPE==1||value.TYPE==3){
					this.dataInfo.V_NAME=value.ID;
					this.dataInfo.V_NAMEDesc=value.NAME;
					this.dataInfo.DEPUTE_TYPE=1;
				}else if(value.TYPE==2){
					this.dataInfo.V_NAMEDesc=value.fullname;
					this.dataInfo.V_NAME=value.id;
					this.dataInfo.DEPUTE_TYPE=2;
				}
			},
			
			// 保存users/saveOrUpdate
			save(parameter) {
				this.$refs.dataInfo.validate((valid) => {
		          if (valid) {
							if(this.dataInfo.WORK_NOTICE_CHECKBASISList.length<=0&&this.dataInfo.WORK_NOTICE_CHECKPROJECTList.length<=0){
			        		this.$message({
								message: '依据和检验检测项目是必填项，请填写！',
								type: 'warning'
						    });
						return false;
			      }else{
			         var oDate1 = new Date(this.dataInfo.XD_DATE); //下达日期
    				 	 var oDate2 = new Date(this.dataInfo.COMPDATE);//完成日期
    				  if(oDate1.getTime() > oDate2.getTime()){ 
        						this.$message({
								message: '完成时间不能早于下达时间',
								type: 'warning'
							}); 
						return;	
    				  }
			        if(typeof(this.dataInfo.CJDW) != 'undefind') {
			        	 for(var j=0;j<this.selectData.length;j++){
			        	 	if(this.dataInfo.CJDW==this.selectData[j].fullname){
			        	 		this.dataInfo.CJDW=this.selectData[j].id
			        	 	}
			        	 }		
			        }
					var url = this.basic_url + '/api-apps/app/workNot/saveOrUpdate';
					this.$axios.post(url, this.dataInfo).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							if(parameter=="Update"){
								this.show = false;
								this.$emit('request');
								this.reset();
							}else{
								this.show = true;
								this.$emit('request');
								this.reset();
							}
						}
					}).catch((err) => {
							this.show = true;
					});}
					} else {
						this.show=true;
					 	this.$message({
							message: '有必填项未填写，请重新填写',
							type: 'warning',
						});
						this.falg=false
					}
				});
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.resetBasisInfo();
					})
					.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
			},
			searchinfo() {
				this.page.currentPage = 1;
				this.page.pageSize = 20;
				this.addperbtn();
			},
			//项目负责人放大镜
			addperbtn(type){
				if(this.dataInfo.CJDW==""||this.dataInfo.CJDW=="undefined"){
					this.$message({
						message: '请先选择承检单位',
							type: 'warning'
						});
				}else{
					this.loading = true;
					var params = {
						page: this.page.currentPage,
						limit: this.page.pageSize,

						deptId: this.searchList.deptId,
						nickname: this.searchList.nickname,
						username: this.searchList.username,
					}
					var url = this.basic_url + '/api-user/users/usersByDept?deptId='+this.dataInfo.CJDW;
					this.$axios.get(url, {
						params: params
					}).then((res) => {
						this.page.totalCount = res.data.count;
						this.gridDataList = res.data.data;
						this.loading = false;
					});
					this.dialogVisible = true;	
					this.type=type;
				}
			},
			dailogconfirm() { //选择人员确定按钮
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
					// this.dialogVisible = false;
					this.resetBasisInfo();//调用resetBasisInfo函数
					if(this.type == 'leader') {
						this.dataInfo.P_LEADER = this.selUser[0].id;
						this.dataInfo.P_LEADERDesc = this.selUser[0].nickname;
					} else {
						this.dataInfo.ACCEPT_PERSON = this.selUser[0].id;
						this.dataInfo.ACCEPT_PERSONDesc = this.selUser[0].nickname;
					}
				}
			},
			
			resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
				this.dialogVisible = false;//关闭弹出框
				this.gridDataList = [];//列表数据置空
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 10;//页码重新传值
			},
			//生成检验委托书
			buildcheck(){
				var dataid = this.dataInfo.ID;
				    var url=this.basic_url + '/api-apps/app/workNot/operate/createInspectProxy?ID=' + dataid+'&TYPE=1';
					this.$axios.get(url, {}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '生成检验委托书成功',
								type: 'success'
							});
						}else{
							this.$message({
							message: '已经生成检验委托书，请勿重复生成',
							type: 'warning'
							});
						}
					}).catch((err) => {
					});
			},
			//生成检测委托书
			buildtest(){
				var dataid = this.dataInfo.ID;
				    var url=this.basic_url + '/api-apps/app/workNot/operate/createInspectProxy?ID=' + dataid+'&TYPE=2';
					this.$axios.get(url, {}).then((res) => {
						if(res.data.resp_code == 0) {
							this.$message({
								message: '生成检测委托书成功',
								type: 'success'
							});
						}else{
							this.$message({
							message: '已经生成检测委托书，请勿重复生成',
							type: 'warning'
							});
						}
					}).catch((err) => {
					});
			},
			SelChange(val) {
				this.selUser = val;
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
			     this.requestData()
			   }
			 },
		
			
			 //启动流程
			startup(){
				var url = this.basic_url + '/api-apps/app/workNot/flow/'+this.dataid;
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
						var url = this.basic_url + '/api-apps/app/workNot/flow/Executors/'+this.dataid;
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
			//审批流程
			approvals(){
				this.approvingData.id =this.dataid;
				this.approvingData.app=this.workNot;
				var url = this.basic_url + '/api-apps/app/workNot/flow/isEnd/'+this.dataid;
		    		this.$axios.get(url, {}).then((res) => {
		    			if(res.data.resp_code == 0) {
							this.$message({
								message:res.data.resp_msg,
								type: 'warning'
							});
		    			}else{
		    				var url = this.basic_url + '/api-apps/app/workNot/flow/isExecute/'+this.dataid;
		    				this.$axios.get(url, {}).then((res) => {
				    			if(res.data.resp_code == 1) {
										this.$message({
											message:res.data.resp_msg,
											type: 'warning'
										});
								}else{
									var url = this.basic_url + '/api-apps/app/workNot/flow/customFlowValidate/'+this.dataid;
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
				this.approvingData.app=this.workNot;
//				this.$refs.flowhistoryChild.open();
				this.$refs.flowhistoryChild.getdata(this.dataid);
			},
			//流程地图
			flowmap(){
				this.approvingData.id =this.dataid;
				this.approvingData.app=this.workNot;
				this.$refs.flowmapChild.getimage(this.dataid);
			},
			//当前责任人
			viewpepole(){
				this.approvingData.id =this.dataid;
				this.approvingData.app=this.workNot;
				this.$refs.vewPopleChild.getvewPople(this.dataid);
			},
		
			
			getuser(){//获取当前用户信息
						var url = this.basic_url + '/api-user/users/currentMap';
						this.$axios.get(url, {}).then((res) => {//获取当前用户信息
										this.username = res.data.username;
						}).catch((err) => {
						});
				},
		},
		mounted() {
			this.getCompany();
			this.getuser();
		},
	}
</script>

<style>
	@import '../../assets/css/mask-modules.css';
	.el-radio-group .el-col-4 {
		padding-top: 5px;
	}
	
	#cost {
		text-align: right !important;
	}
</style>