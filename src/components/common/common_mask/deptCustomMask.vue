<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="客户列表" :visible.sync="dialogShow" width="80%" :before-close="resetTree">
			<div class="el-collapse-item pb10" aria-expanded="true" accordion>
				<el-tabs v-model="activeName">
					<el-tab-pane label="检验站" name="first">
						<div class="scrollbar" style="height:380px;">
							<el-tree ref="tree" 
									:data="resourceData" 
									show-checkbox 
									node-key="id" 
									default-expand-all 
									:default-checked-keys="resourceCheckedKey" 
									:props="resourceProps" 
									@check="handleClicks" 
									check-strictly >
							</el-tree>
						</div>
					</el-tab-pane>
					<el-tab-pane label="客户" name="second">
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
							<el-table ref="singleTable"
								highlight-current-row
								@current-change="selChange"
								@selection-change="setSel"

								:data="list" 
								line-center 
								border 
								stripe 
								height="270px" 
								style="width: 100%;" 
								:default-sort="{prop:'list', order: 'descending'}"
								v-loadmore="loadMore"
								v-loading="loading"  
								element-loading-text="加载中…"
								element-loading-spinner="el-icon-loading"
								element-loading-background="rgba(255, 255, 255, 0.9)"
								>
								<el-table-column type="selection" width="55" fixed align="center">
								</el-table-column>
								<el-table-column label="统一社会信用代码" width="200" sortable prop="CODE">
								</el-table-column>
								<el-table-column label="单位名称" sortable prop="NAME" >
								</el-table-column>
								<el-table-column label="联系地址" sortable prop="CONTACT_ADDRESS">
								</el-table-column>
								<el-table-column label="类型" sortable prop="TYPEDesc">
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
				<el-button type="primary" @click="submit" >确 定</el-button>
				<el-button @click="resetTree">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import Config from '../../../config.js';
	export default {
		name: 'userList',
		data() {
			return {
				basic_url: Config.dev_url,
				loadSign: true, //鼠标滚动加载数据
				loading: false,//默认加载数据时显示loading动画
				selData: [],//接勾选的值
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				searchList: {
					CODE: '',
					NAME: '',
					CONTACT_ADDRESS: ''
				},
				activeName: 'second', //tabs
				list: [],
				dialogShow: false,
				resourceData: [],
				resourceCheckedKey: [],
				resourceProps: {
					children: "children",
					label: "fullname"
				},
				getCheckboxData: [],
				deptId: 0
			}
		},
		props: ['dialogTit'],
		methods: {
			setSel(val) {
				this.selData = val;
			},
			handleClicks(data,checked, indeterminate) {
				this.$refs.singleTable.clearSelection();
				this.getCheckboxData = data;
           		if(checked){
					this.$refs.tree.setCheckedNodes([data]);
					this.$refs.tree.setCheckedKeys([data.id]);
				}else{
					this.$refs.tree.setCheckedNodes([]);
				}
			},
			searchinfo() {
				this.page.currentPage = 1;
				this.page.pageSize = 20;
				this.requestData();
			},
			resetTree(){
				this.dialogShow = false;
				this.resourceCheckedKey = [];
				this.list = [];
				this.selData = [];
				this.page.currentPage = 1;//页码重新传值
				this.page.pageSize = 20;//页码重新传值
				this.activeName = 'second';
				this.searchList = {
					CODE: '',
					NAME: '',
					CONTACT_ADDRESS: ''
				};
			},
			getData(id){
				this.dialogShow = true;
				this.deptId = id;
				this.requestData();
				this.getDept();
				this.getCheckboxData=[];
			},
			selChange(row) {
				this.selData = [];
				this.selData.push(row);
				this.$refs.singleTable.clearSelection();
				this.$refs.singleTable.toggleRowSelection(row);
		
				this.$refs.tree.setCheckedNodes([]);
				this.$refs.tree.setCheckedKeys([]);
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
			//Table默认加载数据
			requestData(opt) {
				this.loading = true;//加载动画打开
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
					NAME: this.searchList.NAME,
					CODE: this.searchList.CODE,
					CONTACT_ADDRESS: this.searchList.CONTACT_ADDRESS,
				};
				var url = this.basic_url + '/api-apps/app/customer?TYPE_where_in=1,3';//如果父组件没有传CJDW承检单位侧显示所有数据
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
					this.list = res.data.data;
					// setTimeout(()=>{
					// 	this.setSelectRow();
					// }, 200)
					this.loading = false;//加载动画关闭
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}
				}).catch((wrong) => {
				})
			},
			getDept() {
				var url=this.basic_url+'/api-apps/app/inspectPro/operate/proxycustomer';
				var data = {
					DEPTID: this.deptId,
					TYPE: 'dept'
				};
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					this.resourceData = res.data.datas;
					this.dialogVisible = true;
				});
			},
			submit(){
				var selData = {};
				if(this.$refs.tree.getCheckedNodes().length > 0){
					var selDatas = this.$refs.tree.getCheckedNodes();
					selData = selDatas[0];
				}
				if(this.selData.length > 0){
					selData = this.selData[0];
				}
				if(JSON.stringify(selData)=="{}"){
					this.$message({
						message: '请选择数据',
						type: 'warning'
					});
				}else{
					this.dialogShow = false;
					this.$emit('getSelData', selData);
					this.resetTree();
				}
			},
    
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.resetBasisInfo();
					})
					.catch(_ => {
						$('.v-modal').hide();
					});
			}
		},
	}
</script>