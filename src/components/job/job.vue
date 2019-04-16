<template>
	<div>
		<div class="headerbg">
			<vheader></vheader>
			<navs_tabs></navs_tabs>
		</div>
		<div class="contentbg">
			<!--左侧菜单调用 Begin-->
			<navs_left></navs_left>
			<!--左侧菜单调用 End-->

			<!--右侧内容显示 Begin-->
			<div class="wrapper wrapper-content">
				<el-row :gutter="10">
					<el-col :span="24">
						<iframe :src="url" id="flowIframe" width="100%" :height="fullHeight"  frameborder="0" scrolling="no" >
				   		</iframe>
				   	</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	export default {
		name: 'dept_management',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
		},
		data() {
			return {
				loading: false,
				basic_url: Config.dev_url,
				companyId: '',
				deptId: '',
				selDept: [],
				page: {
					currentPage: 1,
					pageSize: 20,
					totalCount: 0
				},
				total:0,
				deptList: [],
				selMenu:[],
				search: false,
				show: false,
				down: true,
				up: false,
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				searchDept: {//高级查询
					simplename:'',
					fullname:''
				},
				//tree
				resourceData: [], //数组，我这里是通过接口获取数据，
				resourceDialogisShow: false,
				resourceCheckedKey: [], //通过接口获取的需要默认展示的数组 [1,3,15,18,...]
				resourceProps: {
					children: "subDepts",
					label: "simplename"
				},
				treeData: [],
				selData: [],
				adddeptForm: {},//修改子组件时传递数据
				url:'',
			}
		},
		methods: {
			//表头居中
			rowClass({ row, rowIndex}) {
			    return 'text-align:center'
			},
			//清空
			reset(){
				this.adddeptForm = {
						"version":'1',
						"status":'活动',
						"step":'',
						"code":'',
						"fullname":'',
						"parent":'',
						"org_range":'2',
						"type":'',
						"inactive":'否',
						"address":'',
						"zipcode":'',
						"leader":'',
						"telephone":'',
						"fax":'',
						"email":'',
						"tips":'',
						"pid":'',
						"enterby":'',
						"enterdate":'',
						"changeby":'',
						"changedate":''
					};
			},
			changeCheckedName(value){
				this.checkedName=value
				let str=value.toString()
				for(let i=0;i<this.columns.length;i++){
					if(str.indexOf(this.columns[i].text) != -1){
						this.columns[i].isShow=true
					}else{
						this.columns[i].isShow=false
					}
				}
			},
			//表格传过来
			childByValue: function (childValue) {
		        // childValue就是子组件传过来的
		        this.selMenu = childValue
		    },
			tableControle(data){//控制表格列显示隐藏
			  this.checkedName = data;
			},
			sizeChange(val) {//分页，总页数
		      this.page.pageSize = val;
		      this.requestData();
		    },
		    currentChange(val) {//分页，当前页
		      this.page.currentPage = val;
		      this.requestData();
		    },
			currentTree(val){
			},
			//分页功能
			aTable(val){ 
				this.page = val; 
				this.requestData();
			}, 
			searchinfo(index) {//高级查询
				var data = {
					params: {
						page: 1,
						limit: 10,
						simplename: this.searchDept.simplename,
						fullname: this.searchDept.fullname
					}
				};
				var url = this.basic_url + '/api-user/depts';
				this.$axios.get(url, data).then((res) => {
					this.deptList = res.data.data;
				}).catch((wrong) => {

				})
			},
			resetbtn(){
				this.searchDept = {//高级查询
					simplename:'',
					fullname:''
				};
				this.requestData();
			},
			//添加
			openAddMgr() {
				this.reset();
				this.$refs.child.visible();
			},
			//修改
			modify() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要修改的机构',
						type: 'warning'
					});
					return;
				} else if(selData.length > 1) {
					this.$message({
						message: '不可同时修改多个机构',
						type: 'warning'
					});
					return;
				} else {
					this.adddeptForm = this.selMenu[0]; 
					console.log(this.adddeptForm);
					this.$refs.child.detail();
				}
			},
			//高级查询
			modestsearch() {
				this.search = !this.search;
				this.down = !this.down,
				this.up = !this.up
			},
			// 删除
			deluserinfo() {
				var selData = this.selMenu;
				if(selData.length == 0) {
					this.$message({
						message: '请您选择要删除的机构',
						type: 'warning'
					});
					return;
				} else {
					var changeMenu = selData[0];
					if(changeMenu.children!=null && typeof(changeMenu.children)!='undefined' && changeMenu.children.length>0){
						this.$message({
							message: '先删除子机构',
							type: 'error'
						});
					}else {
//						var id = changeMenu.id;
//						var url = this.basic_url + '/api-user/depts/' + id;
//						this.$axios.delete(url, {}).then((res) => {
//							//resp_code == 0是后台返回的请求成功的信息
//							if(res.data.resp_code == 0) {
//								this.$message({
//									message: '删除成功',
//									type: 'success'
//								});
//								this.requestData();
//							}
//						}).catch((err) => {
//							this.$message({
//								message: '网络错误，请重试',
//								type: 'error'
//							});
//						});
					var url = this.basic_url + '/api-user/depts/deletes';
					//changeMenu为勾选的数据
//					var changeMenu = selData[0];
					//deleteid为id的数组
					var deleteid = [];
					var ids;
					for(var i = 0; i < selData.length; i++) {
						deleteid.push(selData[i].id);
					}
					//ids为deleteid数组用逗号拼接的字符串
					ids = deleteid.toString(',');
					var data = {
						ids: ids,
					}
					this.$confirm('确定删除此数据吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						this.$axios.delete(url, {
							params: data
						}).then((res) => { //.delete 传数据方法
							//resp_code == 0是后台返回的请求成功的信息
							if(res.data.resp_code == 0) {
								this.$message({
									message: '删除成功',
									type: 'success'
								});
								this.requestData();
							}
						}).catch((err) => {
						});
					}).catch(() => {

					});
					}
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
			SelChange(val) {
				this.selDept = val;
			},

			requestData() {//高级查询字段
				this.loading = true;
				var url = this.basic_url + '/api-user/depts/treeMap';
				this.$axios.get(url, {}).then((res) => {
					
					let result=res.data
					for(let i=0;i<result.length;i++){
						if(typeof(result[i].subDepts)!="undefined"&&result[i].subDepts.length>0){
							let subDepts=result[i].subDepts;
							result[i].children=subDepts;
						}	
					}
					this.deptList = result;
					this.loading = false;
//					this.page.totalCount = res.data.count;
				}).catch((wrong) => {})
			},
			//机构树
			getKey() {
				let that = this;
				var url = this.basic_url + '/api-user/depts/tree';
				this.$axios.get(url, {}).then((res) => {
					this.resourceData = res.data;
					this.treeData = this.transformTree(this.resourceData);
				});
			},
			transformTree(data){//给树菜单添加图标
				for(var i=0; i<data.length; i++){
					data[i].name = data[i].fullname;
					if(!data[i].pid || $.isArray(data[i].subDepts)){
						data[i].iconClass = 'icon-file-normal';
					}else{
						data[i].iconClass = 'icon-file-text';
					}
					if($.isArray(data[i].subDepts)){
						data[i].children = this.transformTree(data[i].subDepts);
					}
				}
				return data;
			},
			getTreeId(data){
				if(data.type == '1'){
					this.companyId = data.id;
					this.deptId = '';
				}else{
					this.deptId = data.id;
					this.companyId = '';
				}
				this.requestData();
			},
			handleNodeClick(data) {
			},
			formatter(row, column) {
				return row.enabled;
			}
		},
		mounted() {
			this.$nextTick(function(){
				var url=this.basic_url;
				url = url.substring(0,21);
				var pos = url.lastIndexOf(':');
				url=url.substring(0,pos+1); 
				this.url=url+"8800/jobinfo";
			})
		},
		created(){
		   	
}
	}
</script>

<style scoped>
	
</style>