<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="addtitle">添加用户</div>
					<div class="mask_title" v-show="modifytitle">修改用户</div>
					<div class="mask_title" v-show="viewtitle">查看用户</div>
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
					<el-form inline-message :model="user" :rules="rules" ref="user" :label-position="labelPositions" class="demo-user">
						<div class="content-accordion">
							<el-collapse v-model="activeNames">
								<!--<el-collapse-item title="基础信息" name="1">
									<el-row :gutter="30">
										<el-col :span="24">
											<el-form-item label="所属组织" prop="companyName">
												<el-input v-model="user.companyName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getCompany"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="30">
										<el-col :span="24">
											<el-form-item label="所属机构" prop="deptName">
												<el-input v-model="user.deptName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getDept"></el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row :gutter="30">
										<el-col :span="12">
											<el-form-item label="登录名称" prop="username">
												<el-input class = "usernames" v-model="user.username" ></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="12">
											<el-form-item label="登录口令" prop="password">
												<el-input type="password" v-model="user.password"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>-->
								<el-collapse-item title="用户基本资料" name="1">
									<!-- <el-row :gutter="20" class="pb10">
										<el-col :span="5" class="pull-right">
											<el-input v-model="user.enabled" :disabled="edit">
												<template slot="prepend">信息状态</template>
											</el-input>
										</el-col>
									</el-row> -->
									<!-- 第一行 -->
									<el-row>
										<el-col :span="8">
											<el-form-item label="用户名" v-if="modify" label-width="100px">
												<el-input v-model="user.username" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="用户名" prop="username" v-else label-width="100px">
												<el-input v-model="user.username" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8" v-if="addtitle">
											<!--<el-form-item label="密码" v-if="modify" label-width="100px">
												<el-input type="password" v-model="user.password" :disabled="true">
													<el-button slot="append" icon="icon-edit" @click="editpassword"></el-button>
												</el-input>
											</el-form-item>-->
											<el-form-item label="密码" prop="password" label-width="100px">
												<el-input type="password" v-model="user.password" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="姓名" prop="nickname" label-width="100px">
												<el-input v-if="user.username == 'admin'" v-model="user.nickname" :disabled="edit"></el-input>
												<el-input v-else v-model="user.nickname" :disabled="noedit"></el-input>
												<span class="error"></span>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="职务" prop="post" label-width="100px">
												<el-input v-model="user.post" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="工号" prop="worknumber" label-width="100px">
												<el-input v-model="user.worknumber" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="性別" prop="sex" label-width="100px">
												<el-radio-group v-show="addtitle" v-model="user.sex" :disabled="noedit">
													<el-radio label="1">男</el-radio>
													<el-radio label="0">女</el-radio>
												</el-radio-group>

												<el-radio-group v-show="modifytitle" v-model="user.sex" :disabled="noedit">
													<el-radio label="1">男</el-radio>
													<el-radio label="0">女</el-radio>
												</el-radio-group>

												<el-radio-group v-show="viewtitle" v-model="user.sex" :disabled="noedit">
													<el-radio :label="1">男</el-radio>
													<el-radio :label="0">女</el-radio>
												</el-radio-group>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="身份证号" prop="idnumber" label-width="100px">
												<el-input v-model="user.idnumber" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="手机号" prop="phone" label-width="100px">
												<el-input v-model="user.phone" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
								 			<el-form-item label="联系电话" prop="telephone" label-width="100px">
												<el-input v-model="user.telephone" :disabled="noedit"></el-input>
											</el-form-item>	
								 		</el-col>
										<el-col :span="8">
											<el-form-item label="电子邮箱" prop="email" label-width="100px">
												<el-input v-model="user.email" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="用户有效期" prop="user_active_date" label-width="100px">
												<el-date-picker v-model="user.user_active_date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="noedit">
												</el-date-picker>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="允许授权" prop="ispermit" label-width="100px">
												<el-radio-group v-if="user.username == 'admin'" v-model="user.ispermit" :disabled="edit">
													<el-radio label="1">是</el-radio>
													<el-radio label="2">否</el-radio>
												</el-radio-group>

												<el-radio-group v-else v-model="user.ispermit" :disabled="noedit">
													<el-radio label="1">是</el-radio>
													<el-radio label="2">否</el-radio>
												</el-radio-group>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="允许登录" prop="islogin" label-width="100px">
												<el-radio-group v-if="user.username == 'admin'" v-model="user.islogin" :disabled="edit">
													<el-radio label="1">是</el-radio>
													<el-radio label="2">否</el-radio>
												</el-radio-group>

												<el-radio-group v-else v-model="user.islogin" :disabled="noedit">
													<el-radio label="1">是</el-radio>
													<el-radio label="2">否</el-radio>
												</el-radio-group>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="8">
											<el-form-item label="所属机构" prop="deptName" label-width="100px">
												<el-input v-model="user.deptName" :disabled="edit">
													<el-button slot="append" icon="el-icon-search" @click="getDept" :disabled="noedit"></el-button>
												</el-input>
											</el-form-item>
											<!--<el-form-item label="所属机构" prop="deptName" >
													<el-select v-model="user.deptName" placeholder="请选择">
														<el-option v-for="item in option1" :key="item.value" :label="item.label" :value="item.value">
														</el-option>
													</el-select>
											</el-form-item>-->
										</el-col>
										<el-col :span="8">
											<el-form-item label="角色" prop="roleId" label-width="100px">
												<el-select v-model="user.roleId" multiple :disabled="!edit" default-first-option value-key="item.id" style="width: 100%;" @change="showUserRole">
													<el-option v-for="(item,index) in selectData" :key="index" :value="item.id" :label="item.name"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="学历" prop="education" label-width="100px">
												<el-select v-model="user.education" placeholder="请选择" style="width: 100%" :disabled="noedit">
													<el-option v-for="(item,index) in educationData" :key="index" :value="item.id" :label="item.name">
													</el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>
									
								 	<!-- <el-row>
								 		<el-col :span="16">
								 			 <el-form-item label="地址" prop="address" label-width="100px">
										    <el-input v-model="user.address"></el-input>
										  </el-form-item>	
								 		</el-col>
								 		<el-col :span="8">
								 			<el-form-item label="邮编" prop="zipcode" label-width="100px">
											    <el-input v-model="user.zipcode"></el-input>
											  </el-form-item>
								 		</el-col>
								 	</el-row> -->

								 	<el-row>
										<el-col :span="8">
											<!-- <el-form-item label="IP地址" prop="ipaddress" label-width="100px">
												<el-input v-model="user.ipaddress" :disabled="noedit"></el-input>
											</el-form-item> -->
										</el-col>
										<el-col :span="8">
											<el-form-item label="MAC地址" prop="macaddress" label-width="100px">
												<el-input v-model="user.macaddress" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="ERP机构" prop="erp_orgname" label-width="100px">
												<el-input v-model="user.erp_orgname" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="24">
											<el-form-item label="备注" prop="tips" label-width="100px">
												<el-input type="textarea" :rows="3" v-model="user.tips" :disabled="noedit"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
								<div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion>
									<el-tabs v-model="activeName" @tab-click="handleClick">
										<el-tab-pane label="资质信息" name="first">
											<div class="table-func table-funcb" v-show="noviews">
												<el-button type="success" size="mini" round @click="addfield1" v-show="!viewtitle">
													<i class="icon-add"></i>
													<font>新建行</font>
												</el-button>
												<form method="post" id="file" v-loading="loading" action="" enctype="multipart/form-data" style="float: right;margin-left: 10px;position: relative;">
													<el-button type="primary" size="mini" round class="a-upload">
														<i class="el-icon-upload2"></i>
														<font>上传</font>
														<input id="excelFile" type="file" name="uploadFile" @change="upload" />
													</el-button>
												</form>
											</div>
											<!-- <el-form :label-position="labelPosition" :rules="rules"> -->
												<el-table :header-cell-style="rowClass" :fig="true" :data="user.qualifications" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'user.qualifications', order: 'descending'}">
													<el-table-column prop="iconOperation" fixed width="50px" v-if="!viewtitle">
														<template slot-scope="scope">
															<i class="el-icon-check" v-if="scope.row.isEditing"></i>
															<i class="el-icon-edit" v-else></i>
														</template>
													</el-table-column>
													<el-table-column prop="step" label="序号" sortable width="120px" type="index">
													</el-table-column>
													<el-table-column prop="c_num" label="证书编号" sortable width="180px">
														<template slot-scope="scope">
															<el-form-item :prop="'qualifications.'+scope.$index + '.c_num'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
																<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.c_num" placeholder="请输入委托方名称">
																</el-input>
																<span v-else>{{scope.row.c_num}}</span>
															</el-form-item>
														</template>
													</el-table-column>
													<el-table-column prop="c_name" label="证书名称" sortable>
														<template slot-scope="scope">
															<el-form-item :prop="'qualifications.'+scope.$index + '.c_name'">
																<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.c_name" placeholder="请输入委托方名称">
																</el-input>
																<span v-else>{{scope.row.c_name}}</span>
															</el-form-item>
														</template>
													</el-table-column>
													<el-table-column prop="FILESIZE" label="附件大小" sortable width="120px" v-if="!viewtitle">
														<template slot-scope="scope">
															<span v-if="!!scope.row.FILESIZE">{{scope.row.FILESIZE+'M'}}</span>
														</template>
													</el-table-column>
													<el-table-column prop="c_date" label="资质有效期" sortable width="200px">
														<template slot-scope="scope">
															<el-form-item :prop="'qualifications.'+scope.$index + '.c_date'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
																<el-date-picker v-if="scope.row.isEditing" size="small" v-model="scope.row.c_date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: inherit;">
																</el-date-picker>
																<span v-else>{{scope.row.c_date}}</span>
															</el-form-item>
														</template>
													</el-table-column>
													
												
													<el-table-column fixed="right" label="操作" width="120" v-if="!viewtitle">
														<template slot-scope="scope">
															<el-button @click="deleteRow(scope.$index,scope.row,'tableList')" type="text" size="small">
																<i class="icon-trash red"></i>
															</el-button>
														</template>
													</el-table-column>
												</el-table>
											<!-- </el-form> -->
										</el-tab-pane>
										<el-tab-pane label="培训" name="second">
											<div class="table-func table-funcb" v-show="noviews">
												<el-button type="success" size="mini" round @click="addfield2" v-if="!viewtitle">
													<i class="icon-add"></i>
													<font>新建行</font>
												</el-button>
											</div>
												<el-table :header-cell-style="rowClass" :fit="true" :data="user.traings" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'user.traings', order: 'descending'}">
													<el-table-column prop="iconOperation" fixed label="" width="50px" v-if="!viewtitle">
														<template slot-scope="scope">
															<i class="el-icon-check" v-if="scope.row.isEditing"></i>
															<i class="el-icon-edit" v-else></i>
														</template>
													</el-table-column>
													<el-table-column label="序号" sortable width="120px" type="index">
													</el-table-column>
													<el-table-column prop="t_date" label="培训时间" sortable width="240px">
														<template slot-scope="scope">
															<el-form-item :prop="'traings.'+scope.$index + '.t_date'">
																<!--<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.t_date" placeholder="请输入委托方名称">
												</el-input>-->
																<el-date-picker v-if="scope.row.isEditing" size="small" v-model="scope.row.t_date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss">
																</el-date-picker>
																<span v-else>{{scope.row.t_date}}</span>
															</el-form-item>
														</template>
													</el-table-column>
													<el-table-column prop="t_description" label="培训内容" sortable>
														<template slot-scope="scope">
															<el-form-item :prop="'traings.'+scope.$index + '.t_description'">
																<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.t_description" placeholder="请输入委托方名称">
																</el-input>
																<span v-else>{{scope.row.t_description}}</span>
															</el-form-item>
														</template>
													</el-table-column>
													<!-- <el-table-column prop="status" label="信息状态" sortable width="120px">
														<template slot-scope="scope">
															<el-form-item :prop="'traings.'+scope.$index + '.status'">
																<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.status" placeholder="请输入要求">
																</el-input>
																<span v-else>{{scope.row.status}}</span>
															</el-form-item>
														</template>
													</el-table-column> -->
													<el-table-column fixed="right" label="操作" width="120" v-if="!viewtitle">
														<template slot-scope="scope">
															<el-button @click="deleteRow(scope.$index,scope.row,'traingList')" type="text" size="small">
																<i class="icon-trash red"></i>
															</el-button>
														</template>
													</el-table-column>
												</el-table>
										</el-tab-pane>

										<el-tab-pane label="IP地址管理" name="third">
											<div class="table-func table-funcb" v-show="noviews">
												<el-button type="success" size="mini" round @click="addfield3" v-if="!viewtitle">
													<i class="icon-add"></i>
													<font>新建行</font>
												</el-button>
											</div>
												<el-table :header-cell-style="rowClass" :fit="true" :data="user.ips" row-key="ID" border stripe max-height="260" highlight-current-row="highlight-current-row" style="width: 100%;" @cell-click="iconOperation" :default-sort="{prop:'user.ips', order: 'descending'}">
													<el-table-column prop="iconOperation" fixed label="" width="50px" v-if="!viewtitle">
														<template slot-scope="scope">
															<i class="el-icon-check" v-if="scope.row.isEditing"></i>
															<i class="el-icon-edit" v-else></i>
														</template>
													</el-table-column>

													<el-table-column label="序号" sortable width="120px" prop="step">
													   <template slot-scope="scope">
													         <el-input v-show="scope.row.isEditing" size="small" v-model="scope.$index + 1" disabled></el-input>
													         <span v-show="!scope.row.isEditing" >{{scope.row.step}}</span>
													   </template>
													</el-table-column>
													<el-table-column prop="ip_begin" label="起始IP地址" sortable>
														<template slot-scope="scope">
															<el-form-item :prop="'ips.'+scope.$index + '.ip_begin'">
																<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.ip_begin" placeholder="请输入起始IP地址">
																</el-input>
																<span v-else>{{scope.row.ip_begin}}</span>
															</el-form-item>
														</template>
													</el-table-column>

													<el-table-column prop="ip_end" label="结束IP地址" sortable>
														<template slot-scope="scope">
															<el-form-item :prop="'ips.'+scope.$index + '.ip_end'">
																<el-input v-if="scope.row.isEditing" size="small" v-model="scope.row.ip_end" placeholder="请输入结束IP地址">
																</el-input>
																<span v-else>{{scope.row.ip_end}}</span>
															</el-form-item>
														</template>
													</el-table-column>
													
													<el-table-column fixed="right" label="操作" width="120" v-if="!viewtitle">
														<template slot-scope="scope">
															<el-button @click="deleteRow(scope.$index,scope.row,'ipaddressList')" type="text" size="small">
																<i class="icon-trash red"></i>
															</el-button>
														</template>
													</el-table-column>

												</el-table>
										</el-tab-pane>
									</el-tabs>
								</div>
								<el-collapse-item title="其他" name="4" v-show="views">
									<!-- 第一行 -->
									<el-row :gutter="30">
										<el-col :span="8">
											<el-form-item label="录入人" prop="createby" label-width="100px">
												<el-input v-model="user.createbyName" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="录入时间" prop="createTime" label-width="100px">
												<el-input v-model="user.createTime" :disabled="edit">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改人" prop="updateby" label-width="100px">
												<el-input v-model="user.updateby" :disabled="edit"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="修改时间" prop="updateTime" label-width="100px">
												<el-input v-model="user.updateTime" :disabled="edit">
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div class="content-footer" v-show="noviews">
							<el-button type="primary" @click='save("Update")'>保存</el-button>
							<el-button type="success" @click='save("Submit")' v-show="addtitle">保存并继续</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
				<!--底部-->
			</div>
			<!--弹出-->

			<el-dialog :modal-append-to-body="false" title="机构" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
				<div class="el-collapse-item pb10" aria-expanded="true" accordion>
					<el-tabs v-model="activeName" @tab-click="depthandleClick">
						<el-tab-pane label="中心内机构" name="first">
							<div class="scrollbar" style="height:380px;">
								<el-tree ref="tree" :data="resourceData" show-checkbox node-key="id" default-expand-all :default-checked-keys="resourceCheckedKey" :props="resourceProps" @check="handleClicks" check-strictly>
								</el-tree>
							</div>
						</el-tab-pane>
						<el-tab-pane label="中心外机构" name="second">
							<div class="scrollbar" style="height:380px;">
								<el-form inline-message :model="searchList" label-width="90px">
									<el-row>
										<el-col :span="6">
											<el-form-item label="统一社会信用代码" prop="CODE" label-width="140px">
												<el-input v-model="searchList.CODE">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="5">
											<el-form-item label="单位名称" prop="NAME">
												<el-input v-model="searchList.NAME">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="5">
											<el-form-item label="联系地址" prop="CONTACT_ADDRESS">
												<el-input v-model="searchList.CONTACT_ADDRESS">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="2" class="text-center">
											<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
										</el-col>
									</el-row>
								</el-form>
								<el-table ref="table" :header-cell-style="rowClass" :data="customerList" line-center border stripe height="270px" style="width: 100%;" :default-sort="{prop:'customerList', order: 'descending'}"
									v-loadmore="loadMore"
									v-loading="loading"  
									element-loading-text="加载中…"
									element-loading-spinner="el-icon-loading"
									element-loading-background="rgba(255, 255, 255, 0.9)"
									@selection-change="SelChange">
									<el-table-column type="selection" width="55" fixed align="center">
									</el-table-column>
									<el-table-column label="统一社会信用代码" width="200" sortable prop="CODE">
									</el-table-column>
									<el-table-column label="单位名称" sortable prop="NAME" >
									</el-table-column>
									<el-table-column label="联系地址" sortable prop="CONTACT_ADDRESS">
									</el-table-column>
									<el-table-column label="类型" sortable prop="TYPE">
									</el-table-column>
									<el-table-column label="备注" sortable prop="MEMO" >
									</el-table-column>
								</el-table>
									<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40,100]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
									</el-pagination>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div slot="footer">
			       <el-button type="primary" @click="dailogconfirm" >确 定</el-button>
			       <el-button @click="resetTree">取 消</el-button>
			    </div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import { Loading } from 'element-ui'
	export default {
		name: 'masks',
		props: {
			page: Object,
		},
		//	props: ['user','page'],

		data() {
			var validatedeptname = (rule, value, callback) => {//所属机构
                if (this.user.deptName === undefined || this.user.deptName === '' || this.user.deptName === null) {
                    callback(new Error('请选择所属机构'));
                }else {
                    callback();
                }
            };
			return {
				loading: false,
				changeflag:false,//监听值的变化
				wi:1,
				basic_url: Config.dev_url,
				file_url: Config.file_url,
				user: {
					status: '1',
					roleId: [],
					roles: [],
					traings: [],
					sex: '0',
					ispermit: '0',
					islogin: '0',
					qualifications: [],
					ips: [],
					deptName:'',
					nickname:'',
				},
				customerList: [],
				searchList: {
					NAME: '',
					CODE: '',
					CONTACT_ADDRESS: '',
				},
				// page: {
				// 	currentPage: 1,
				// 	pageSize: 20,
				// 	totalCount: 0
				// },
				value: '',
				editSearch: '',
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				activeName: 'first', //tabs
				activeNames: ['1', '2', '3', '4'], //手风琴数量
				labelPosition: 'top', //表格
				labelPositions: 'right',
				dialogVisible: false, //对话框
				addtitle: true, //添加弹出框titile
				modifytitle: false, //修改弹出框titile
				modify:false,
				//default-expand-all:true,
				i:0,
				rules: {
					deptName: [{required: true,validator: validatedeptname}], //所属机构
					education: [{required: true,message: '必填',trigger: 'blur'}],
					roleId: [{required: true,trigger: 'blur',message: '必填',}],
					username: [
						{required: true,message: '必填',trigger: 'blur',},
						{validator: this.Validators.isUserName, trigger: 'blur'},//引用 isUserName
						{type: 'string', min: 4, max:20, message: '用户名不小于4位，不大于20位', trigger: 'blur'},
					],
					password: [
						{required: true,trigger: 'blur',message: '必填'},
						{validator: this.Validators.isValidatePass, trigger: 'blur'},
                	],
					sex: [{required: true,trigger: 'blur',message: '必填'}],
					ispermit_authorization: [{required: true,trigger: 'change',message: '必填'}], //授权
					islogin: [{required: true,trigger: 'change',message: '必填'}], //登陆
					mac_address: [{required: true,trigger: 'blur',message: '必填',}],
					ip_address: [{required: true,trigger: 'blur',message: '必填',}],
					nickname: [
						{required: true, trigger: 'blur', message: '必填'},
						{trigger: 'blur', validator: this.Validators.isNickname}
					],
					worknumber: [
						{required: true,trigger: 'blur',message: '必填'},
						{validator: this.Validators.isWorknumber, trigger: 'blur'},//引用 isWorknumber
					],
					idnumber: [{required: true,trigger: 'blur',validator: this.Validators.isIdnumber}],
					phone: [
						{required: true,trigger: 'blur',message: '必填'},
						{validator: this.Validators.isPhone, trigger: 'blur'},
					],
					telephone: [{required: false, trigger: 'blur', validator: this.Validators.isTelephone}],
					email: [
						{required: true,trigger: 'blur',message: '必填'},
						{validator: this.Validators.isEmail, trigger: 'blur'},
					],
					step: [{required: true,trigger: 'blur',message: '必填',}],
					t_date: [{required: true,trigger: 'blur',message: '必填',}],
					t_description: [{required: true,trigger: 'blur',message: '必填',}],
					status: [{required: true,trigger: 'blur',message: '必填',}],
					step: [{required: true,trigger: 'blur',message: '必填',}],
					c_date: [{required: true,trigger: 'blur',message: '必填',}],
					c_num: [{required: true,trigger: 'blur',message: '必填',}],
					c_name: [{required: true,trigger: 'blur',message: '必填',}],
					ipaddress: [{required: false,trigger: 'blur',validator: this.Validators.isIpaddress}],
					macaddress: [{required: false,trigger: 'blur',validator: this.Validators.isMacaddress}],
					post: [{required: false,trigger: 'blur',validator: this.Validators.isSpecificKey}],
					tips: [{required: false,trigger: 'blur',validator: this.Validators.isSpecificKey}],
				},
				//tree树菜单
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "children",
					label: "fullname"
				},
				selectData: [], //角色
				educationData: [], //最高学历
				getCheckboxData: {},
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
				index:0
			};
		},
		methods: {
			//tabs
			depthandleClick(tab, event) {
				this.requestData();
				this.getDept();
				this.getCheckboxData=[];
		    },
			showUserRole(){
			},
			resetTree(){
				this.dialogVisible = false;
				this.resourceCheckedKey = [];
				this.customerList = [];
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 20;//页码重新传值
			},
			editpassword(){//点击修改密码按钮跳转到修改密码页面
		      	this.$router.push({path: '/passwordedit'})
		    },
			currentSel(selVal){
        		this.selVal = selVal;
      		},
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			SelChange(val) {
				this.selUser = val;
				var _this = this;
			},
			handleClick(tab, event) {
			},
			iconOperation(row, column, cell, event) {
				if(column.property === "iconOperation") {
					row.isEditing = !row.isEditing;
				}
			},
			//清空
			reset() {
				this.user = {
					companyName: '',
					deptName: '',
					username: '',
					password: '',
					nickname: '',
					birthday: '',
					sexName: '',
					idnumber: '',
					entrytime: '',
					roleId: [],
					roles: [],
					worknumber: '',
					phone: '',
					email: '',
					address: '',
					tips: '',
					enabled: true,
					traings: [],
					qualifications: [],
					ips: [],
				}
			},
			//添加显示弹窗
			visible() {
				this.reset();
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.user.createby = res.data.id;
					this.user.createbyName = res.data.nickname;
					this.user.enterby = res.data.id
					this.user.enterbyName = res.data.nickname;
					var date = new Date();
					this.user.createTime = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err) => {
				})
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
				// this.show = true;
			},
			addfield1() {
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					var currentUser, currentDate;
					this.currentUser = res.data.nickname;
					this.enterby = res.data.id
					var date = new Date();
					this.currentDate = this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
					var obj = {
						step: 1,
						c_num: '',
						c_name: '',
						c_date: '',
						status: '',
						enterdate: this.currentDate,
						enterbyName: this.currentUser,
						enterby: this.enterby,
						//少附件
						isEditing: true
					};
					this.user.qualifications.push(obj);
				}).catch((err) => {
				})

			},
			addfield2() {
				var obj = {
					step: 1,
					t_date: '',
					t_description: '',
					status: '',
					isEditing: true
				};
				this.user.traings.push(obj);
			},
			addfield3() {
				var obj = {
					step: 1,
					ip_begin: '',
					ip_end: '',
					isEditing: true
				};
				this.user.ips.push(obj);
			},
			//刪除新建行
			deleteRow(index, row, listName){
				var TableName = '';
				if(listName =='tableList'){
					TableName = 'qualifications';
				}else if(listName =='traingList'){
					TableName = 'traings';
				}else{
					TableName = 'ips';
				}
				if(row.id){
					var url = this.basic_url + '/api-user/users/' + row.id;
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {}).then((res) => {
							if(res.data.resp_code == 0){
								this.user[TableName].splice(index,1);
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
					this.user[TableName].splice(index,1);
				}
			},
			//
			handleClicks(data,checked, indeterminate) {
				this.getCheckboxData = data;
           		if(checked){
					this.$refs.tree.setCheckedNodes([data]);
					this.$refs.tree.setCheckedKeys([data.id]);
				}else{
					this.$refs.tree.setCheckedNodes([]);
				}
			},
			
			//添加显示弹窗
			visible() {
				this.user = {
					companyName: '',
					deptName: '',
					username: '',
					password: '',
					nickname: '',
					birthday: '',
					sexName: '',
					idnumber: '',
					entrytime: '',
					roleId: [],
					roles: [],
					worknumber: '',
					phone: '',
					email: '',
					sex: '1',
					ispermit: '1',
					islogin: '1',
					education: '本科',
					address: '',
					tips: '',
					enabled: true,
					traings: [],
					qualifications: [],
					ips: [],
				};
				this.$axios.get(this.basic_url + '/api-user/users/currentMap', {}).then((res) => {
					this.user.createby = res.data.id;
					this.user.createbyName = res.data.nickname;
					this.user.enterby = res.data.id
					this.user.enterbyName = res.data.nickname;
					this.docParam = {
						username: res.data.username,
						userid:  res.data.id,
						deptid: res.data.deptId,
						deptfullname: res.data.deptName,
					};
					var date = new Date();
					this.user.createTime = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err) => {
				})
				// this.statusshow1 = true;
				// this.statusshow2 = false;
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
				// this.show = true;
			},
			// 这里是修改
			detail(dataid) {
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
				//	$('.usernames .el-input__inner').attr('disabled',true);
				var usersUrl = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(usersUrl, {}).then((res) => {
					this.user.changeby = res.data.nickname;
					this.docParam = {
						username: res.data.username,
						userid:  res.data.id,
						deptid: res.data.deptId,
						deptfullname: res.data.deptName,
					};
					var date = new Date();
					this.user.changedate = this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
				}).catch((err) => {
				});
				var url = this.basic_url + '/api-user/users/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					//资质信息
					for(var i = 0;i<res.data.qualifications.length;i++){
						res.data.qualifications[i].isEditing = false;
					}
					
					//培训
					for(var i = 0;i<res.data.traings.length;i++){
						res.data.traings[i].isEditing = false;
					}

					//IP地址管理
					// for(var i = 0;i<res.data.ips.length;i++){
					// 	res.data.ips[i].isEditing = false;
					// }
				    res.data.sex=res.data.sex.toString();
					this.user = res.data;
					// this.user.enabled = this.user.enabled ? '活动' : '不活动';
					this.user.roleId = this.user.roleId.split(',');
					var arr = [];
					var roleId = this.user.roleId;
					for(var i=0; i< roleId.length; i++){
						roleId[i] =  parseInt(roleId[i]);
					}
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
				// this.CATEGORY = item;
				this.show = true;

				var url = this.basic_url + '/api-user/users/' + dataid;
				this.$axios.get(url, {}).then((res) => {
					this.user = res.data;
					// this.user.sex = this.user.sex ? '男' : '女';
					this.user.enabled = this.user.enabled ? '活动' : '不活动';
					this.user.roleId = this.user.roleId.split(',');
					var roleId = this.user.roleId;
					for(var i=0; i< roleId.length; i++){
						roleId[i] =  parseInt(roleId[i]);
					}
					this.show = true;
				}).catch((err) => {
				});
			},
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');
			},
			open(){
				this.show = true;
			},
			toggle(e) { //大弹出框大小切换
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
			rebackDialog() { //大弹出框还原成默认大小
				this.isok1 = true;
				this.isok2 = false;
				$(".mask_div").css("width", "80%");
				$(".mask_div").css("height", "90%");
				$(".mask_div").css("top", "0px");
			},
			searchinfo() {
				this.page.currentPage = 1;
				this.page.pageSize = 20;
				this.requestData();
			},
			//保存users/saveOrUpdate
			save(parameter) {
				if(this.changeflag==true){
				var _this = this;
				this.$refs.user.validate((valid) => {
					if(valid) {
						_this.user.enabled = true;
						var user = _this.user;
						var roleId = [];
						user.roleId = user.roleId.join(',');
						var url = _this.basic_url + '/api-user/users/saveOrUpdate';
						this.$axios.post(url, _this.user).then((res) => {
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success',
								});
							if(parameter=="Update"){
									this.show = false;
									this.$emit('request');
								}else{
									this.show = true;
									this.$emit('request');
								}
								this.$refs["user"].resetFields(); //清空表单验证
							}else{
								this.$message({
									message: res.data.resp_msg,
									type: 'warning'
								});
								this.show=true;
								user.roleId = user.roleId.split(',');
								var roleId = this.user.roleId;
								for(var i=0; i< roleId.length; i++){
									roleId[i] =  parseInt(roleId[i]);
								}
							}
						}).catch((err) => {
							user.roleId = user.roleId.split(',');
							var roleId = this.user.roleId;
							for(var i=0; i< roleId.length; i++){
								roleId[i] =  parseInt(roleId[i]);
							}
						});
					} else {
						this.show = true;
						this.$message({
							message: '有必填项未填写，请重新填写',
							type: 'warning',
						});
					}
				})
				}else{
					this.show = false;
				    this.$emit('request');
				}
			},
			//所属组织
			getCompany() {
				// this.editSearch = 'company';
				var page = this.page.currentPage;
				var limit = this.page.pageSize;
				var type = '1';
				var url = this.basic_url + '/api-user/depts/treeByType';
				this.$axios.get(url, {
					params: {
						type: type
					},
				}).then((res) => {
					this.resourceData = res.data;
					this.dialogVisible = true;
				});
			},

			//中心内机构 
			getDept() {
				var url=this.basic_url+'/api-user/depts/treeMap'
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data;
					this.dialogVisible = true;
				});
			},
			//角色
			getRole() {
				var url = this.basic_url + '/api-user/roles';
				this.$axios.get(url, {}).then((res) => {
					this.selectData = res.data.data;
				}).catch(error => {
				})
			},
			//最高学历
			getEducation() {
				var url = this.basic_url + '/api-user/dicts/findChildsByCode?code=EDUCATIONS';
				this.$axios.get(url, {}).then((res) => {
					this.educationData = res.data;
				}).catch(error => {
					console.log('请求失败');
				})
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
			//中心外机构Table默认加载数据
			requestData(){
				this.loading = true;//加载动画打开
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					NAME: this.searchList.NAME,
					CODE: this.searchList.CODE,
					CONTACT_ADDRESS: this.searchList.CONTACT_ADDRESS,
				};
				var url = this.basic_url + '/api-apps/app/customer';//如果父组件没有传CJDW承检单位侧显示所有数据
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
					this.customerList = res.data.data;
					setTimeout(()=>{
						this.setSelectRow();
					}, 200)
					this.loading = false;//加载动画关闭
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}//滚动加载数据判断filing
				}).catch((wrong) => {
					// 	this.$message({
					// 	message: '网络错误，请重试',
					// 	type: 'erro'
					// });
				})
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
			//中心外机构Table默认加载数据
			requestData(){
				this.loading = true;//加载动画打开
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					NAME: this.searchList.NAME,
					CODE: this.searchList.CODE,
					CONTACT_ADDRESS: this.searchList.CONTACT_ADDRESS,
				};
				var url = this.basic_url + '/api-apps/app/customer';//如果父组件没有传CJDW承检单位侧显示所有数据
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
					this.customerList = res.data.data;
					
					this.loading = false;//加载动画关闭
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}//滚动加载数据判断filing
				}).catch((wrong) => {
					// 	this.$message({
					// 	message: '网络错误，请重试',
					// 	type: 'erro'
					// });
				})
			},
			dailogconfirm() { //小弹出框确认按钮事件
			if(this.getCheckboxData==null&&this.selUser.length == 0){
						this.$message({
						message: '中心内机构和中心外机构，请至少选择一个',
						type: 'erro'
					});
			}else if(this.getCheckboxData.length!=0&&this.getCheckboxData!=null){
				this.user.deptId = this.getCheckboxData.id;
				this.user.deptName = this.getCheckboxData.fullname;
			}else if(this.getCheckboxData.length==undefined&&this.selUser.length >1){
				this.$message({
						message: '不可同时选择多条数据',
						type: 'warning'
					});
			}else{
				this.user.deptName = this.selUser[0].NAME;//名称
				this.user.deptId =  this.selUser[0].ID;
			}
				this.requestData();
				this.resetTree();
			},

			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.resetTree();
					})
					.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
			},
			upload(e){
				var list = this.user.qualifications || [];
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
				this.loading = true;
				var formData = new FormData();
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
					this.loading = false;
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
						this.user.qualifications[index].FILEID = res.data.fileid;
						this.user.qualifications[index].FILESIZE = res.data.filesize;
						this.user.qualifications[index].FILEPATH = res.data.webUrl;
						this.$set(this.user.qualifications,index,this.user.qualifications[index]);
					}
				})
			}

		},
		mounted() {
			this.getRole();
			this.getEducation();
			this.requestData();
		},
		watch: {
			user:{
				handler:function(obj){
					if(this.wi!=1){
						this.changeflag=true;
					}
					this.wi++; 
				},
				deep:true
			}            
		}
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
	.a-upload input{
		position: absolute;
		font-size: 0;
		font-size: 20 \9;
		left: 0px;
		top: 0;
		opacity: 0;
		filter: alpha(opacity=0);
		cursor: pointer;
		width: 70px;
		height: 30px;
		cursor: pointer;
	}
</style>