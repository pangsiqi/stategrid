<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
				<div class="mask_title_div clearfix">
					<div class="mask_title" v-show="">查看</div>
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
						<div class="tablediv" style="
						background-color: #ffffff;
						padding: 30px;
						margin: 12px;height:439px">
							<!-- 表格 -->
							<el-table
								ref="multipleTable"
								:data="tableData3"
								tooltip-effect="dark"
								style="width: 100%"
								@selection-change="handleSelectionChange" height="340px" stripe border>
								<el-table-column
									label="日期"
									width="120">
									<template slot-scope="scope">{{ scope.row.date }}</template>
								</el-table-column>
								<el-table-column
									prop="name"
									label="姓名"
									width="120">
								</el-table-column>
								<el-table-column
									prop="address"
									label="地址"
									show-overflow-tooltip width="120">
								</el-table-column>
								<el-table-column
									prop="address"
									label="地址"
									show-overflow-tooltip width="120">
								</el-table-column>
								<el-table-column
									prop="address"
									label="地址"
									show-overflow-tooltip width="120">
								</el-table-column>
								<el-table-column
									prop="address"
									label="地址"
									show-overflow-tooltip width="120">
								</el-table-column>
								<el-table-column
									prop="address"
									label="地址"
									show-overflow-tooltip width="120">
								</el-table-column>
								<el-table-column
									prop="address"
									label="地址"
									show-overflow-tooltip width="120">
								</el-table-column>
								<el-table-column
									prop="address"
									label="地址"
									show-overflow-tooltip width="120">
								</el-table-column>
							</el-table>
								<!-- 表格 -->
								<el-pagination background
								@size-change="handleSizeChange"
								@current-change="handleCurrentChange"
								:current-page="currentPage4"
								:page-sizes="[100, 200, 300, 400]"
								:page-size="100"
								layout="total, sizes, prev, pager, next, jumper"
								:total="400" class="pull-right pt20 pb20">
							</el-pagination>
						</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import reportmask from '../common/common_mask/reportmask.vue'
	export default {
		name: 'masks',
		components: {
			reportmask	
		},
		data() {
			return {
				basic_url: Config.dev_url,
				selUser: [],
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				activeNames: ['1','2'], //手风琴数量
				dialogVisible: false, //对话框
				selectData: [],
				//tree
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
				rules: {
					//应用英文名称
					code: [
						{required: true, message: '请填写', trigger: 'blur'},
						{trigger: 'blur', validator: this.Validators.isEnglish}
					],
					//数据库表
					object_id: [
						{required: true, message: '请填写', trigger: 'blur'},
						{trigger: 'blur', validator: this.Validators.isEnglish}
					],
					//应用名称
					name: [
						{required: true, message: '请填写', trigger: 'blur'},
						{trigger: 'blur', validator: this.Validators.isSpecificKey}
					],
					//处理类
					handleclass: [{required: true, message: '请填写', trigger: 'blur'}],
					//排序
					sort: [
						{required: false, trigger: 'blur', validator: this.Validators.isInteger},
					],
					//应用描述
					description: [
						{required: true, message: '请填写', trigger: 'blur',},
					],
					
				},
				dataInfo:{
					
				}
			};
		},
		methods: {
			reportid(value){
				this.dataInfo.reportId = value;
			},
			reports(value){
				this.dataInfo.report = value.toString();
			},
			//获取导入表格勾选信息
			SelChange(val) {
				this.selUser = val;
			},
			//这是查看
			view() {
				this.show = true;				
			},
			//获取当前用户信息
			getUser(opt){
				var url = this.basic_url + '/api-user/users/currentMap';
				this.$axios.get(url,{}).then((res) => {
					if(opt == 'new'){
						this.dataInfo.createUser = res.data.id;
						this.dataInfo.createTime =this.getToday();
					}else{
						this.dataInfo.updateUser = res.data.id;
						this.dataInfo.updateTime = this.getToday();
					}
				}).catch((err) => {
				});
			},
			//获取当前时间
			getToday(){
				var date = new Date();
				// this.dataInfo.updateTime = this.$moment(date).format("YYYY-MM-DD HH:MM:SS");
				var month = date.getMonth();
				month++;
				var str = date.getFullYear() + '-' + month + '-'+ date.getDate() + ' ' +  date.getHours() + ':' + date.getMinutes()+ ':' + date.getSeconds() ;
				return str;
			},
			//获取当前组信息
			getData(id){ 
				var url=this.basic_url + '/api-apps/appcfg/'+ id;
				this.$axios.get(url, {}).then((res) => {
					this.dataInfo=res.data;
					if(typeof(this.dataInfo.reportId) != 'undefind'&&this.dataInfo.reportId != null&&this.dataInfo.reportId.length > 0) {
							this.dataInfo.reportId=[];
							var reports = this.dataInfo.reports;
							for(var i = 0; i < reports.length; i++) {
								this.dataInfo.reportId.push(reports[i].id);
							}
					}else if(this.dataInfo.reportId==null){
						this.dataInfo.reportId = [];
						this.dataInfo.reports = [];
					}
					
				this.show = true;
				}).catch((err) => {
				});

				// var url = this.basic_url + '/api-apps/appcfg/' + id;
				// this.$axios.get(url, {
				// }).then((res) => {
				// 	this.dataInfo = res.data;
				// }).catch((wrong) => {})
			},
			//点击关闭按钮
			close() {
				this.show = false;
			},
			resetForm(){
				this.dataInfo = {
					"id":'',
					"name":'',
					"num":'',
					"deptid":this.$store.state.currentcjdw[0].id,
					"deptName":this.$store.state.currentcjdw[0].fullname,
					"createUser":'',
					"createTime":'',
					"updateUser":'',
					"updateTime":'',
					"del_flag":'',
				};
				this.show = false;
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
			// 保存users/saveOrUpdate
			save(parameter) {
				var _this = this;
				this.$refs.dataInfo.validate((valid) => {
					if(valid) {
						var dataInfo = _this.dataInfo;
						var reportId = "";
						if(typeof(dataInfo.reportId) != 'undefind' && dataInfo.reportId.length > 0) {
							var arr = [];
							dataInfo.reportId.forEach(function(item) {
								var reports = _this.selectData;
								for(var j = 0; j < reports.length; j++) {
									if(reports[j].id == item) {
										arr.push(reports[j]);
										reportId = reportId + reports[j].id + ",";
									}
								}
							});
							dataInfo.reportId = reportId.substring(0,reportId.length-1);
							dataInfo.reports = arr;
						} else {
							dataInfo.reportId = '';
							dataInfo.reports = [];
						}
						var url = this.basic_url + '/api-apps/appcfg/saveOrUpdate';
						this.$axios.post(url, this.dataInfo).then((res) => {
							//resp_code == 0是后台返回的请求成功的信息
							if(res.data.resp_code == 0) {
								this.$message({
									message: '保存成功',
									type: 'success'
								});
								if(parameter=="Update"){
									this.show = false;
									this.$emit('request');
								}else{
									this.show=true;
									this.$emit('reset');
								}
								this.visible();
								// this.resetForm();
							}else{
								this.show = true;
								if(res.data.resp_code == 1) {
									//res.data.resp_msg!=''后台返回提示信息
									if( res.data.resp_msg!=''){
									 	this.$message({
											message: res.data.resp_msg,
											type: 'warning'
									 	});
									}else{
										this.$message({
											message:'相同数据不可重复添加！',
											type: 'warning'
										});
									}
								}
							}
						}).catch((err) => {
						});
					} else {
						this.$message({
							message: '未填写完整，请填写',
							type: 'warning'
						});
					}
				});
			},
			//报表参数类
			getreport(){
				var url = this.basic_url + '/api-report/report';
				this.$axios.get(url, {}).then((res) => {
					this.selectData = res.data.data;
				}).catch((wrong) => {
				})	
			},
		},
		mounted() {
			this.getreport();
		},
			
	}
</script>

<style scoped>
	@import '../../assets/css/mask-modules.css';
</style>