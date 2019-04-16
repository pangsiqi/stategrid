<template>
	<div>
		<el-dialog :modal-append-to-body="false" 
			:title="dialogTit" 
			:visible.sync="dialogShow" 
			height="300px" 
			width="80%" 
			:before-close="reset">
			
			<el-table ref="table" :data="list" 
				border 
				stripe 
				height="300px" 
				style="width: 100%;" 
				:default-sort="{prop:'list', order: 'descending'}" 
				@selection-change="selChange"
				v-loadmore="loadMore"
				v-loading="loading"
				element-loading-text="加载中…"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(255, 255, 255, 0.9)">

				<el-table-column type="index" label="序号" width="50">
					<template slot-scope="scope">
						<span> {{(page.currentPage-1)*page.pageSize+scope.$index+1}} </span>
					</template>
				</el-table-column>
				<el-table-column type="selection" width="55" fixed align="center">
				</el-table-column>
				<el-table-column label="用户名" sortable width="140px" prop="username">
				</el-table-column>
				<el-table-column label="姓名" sortable width="200px" prop="nickname">
				</el-table-column>
				<el-table-column label="所属机构" sortable width="150px" prop="deptName">
				</el-table-column>
				<el-table-column label="手机号" sortable prop="phone">
				</el-table-column>
				<el-table-column label="录入时间" prop="createTime" width="100px" sortable :formatter="dateFormat">
				</el-table-column>
			</el-table>
			<el-pagination background 
				class="text-right pt10" 
				@size-change="sizeChange" 
				@current-change="currentChange" 
				:current-page="page.currentPage" 
				:page-sizes="[10, 20, 30, 40]" 
				:page-size="page.pageSize" 
				layout="total, sizes, prev, pager, next" 
				:total="page.totalCount">
			</el-pagination>
			<div slot="footer">
				<el-button type="primary" @click="submit">确 定</el-button>
				<el-button @click="reset">取 消</el-button>
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
				searchList: {},
				list: [],
				dialogShow: false,
				urlOpt: ''
			}
		},
		props: ['dialogTit'],
		methods: {
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
			selChange(val) {
				this.selData = val;
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
				this.urlOpt = opt;
				var data = {
					page: this.page.currentPage,
					limit: this.page.pageSize,
				}
				if(opt == 'groups'){
					var url = this.basic_url + '/api-user/users';
				}else{
					var url = this.basic_url + '/api-user/users?deptid_wheres='+opt;
				}
				this.$axios.get(url, {
					params: data
				}).then((res) => {
					this.dialogShow = true;
					this.page.totalCount = res.data.count;
					//总的页数
					let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize)
					if(this.page.currentPage >= totalPage) {
						this.loadSign = false
					} else {
						this.loadSign = true
					}
					this.list = res.data.data;
					this.loading = false;//加载动画关闭
					if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
						$('.el-table__body-wrapper table').find('.filing').remove();
					}
				}).catch((wrong) => {})
			},
			submit(){
				console.log();
				if(this.urlOpt == 'groups'){
					if(this.selData.length == 0){
						this.$message({
							message: '请选择数据',
							type: 'warning'
						});
					}else{
						this.dialogShow = false;
						this.$emit('getSelData',this.selData);
						this.reset();
					}
				}
				else {
					if(this.selData.length == 0){
						this.$message({
							message: '请选择数据',
							type: 'warning'
						});
					}else if(this.selData.length > 1){
						this.$message({
							message: '不可同时选择多条数据',
							type: 'warning'
						});
					}else{
						this.dialogShow = false;
						this.$emit('getSelData',this.selData[0]);
						this.reset();
					}
				}
			},
    
			reset(){//点击确定或取消按钮时重置数据20190303
				this.dialogShow = false;
				this.list = [];
				this.page.currentPage = 1;
				this.page.pageSize = 20;
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.reset();
					})
					.catch(_ => {
						$('.v-modal').hide();
					});
			}
		},
	}
</script>