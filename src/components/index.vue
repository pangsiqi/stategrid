<template>
<div>
	<div class="headerbg">
		<vheader @clickfun='getroId' ref="vheader" @getTodoNum="getTodoNum" @getTodoDing="getTodoDing" @getTodoFinish="getTodoFinish"></vheader>
		<navs_tabs ref='navsTabs'></navs_tabs>
	</div>

    <div class="contentbg">
		<!--右侧内容显示 Begin-->
		<div class="wrapper-content">
			<div id="information" :style="{height: fullHeight}">
				<div class="ibox-content pl20 pr20">
					<!--我的应用 Begin-->
					<div class="clearfix">
						<h3 class="pull-left">我的应用</h3>
					</div>
					<el-row :gutter="20" class="applist">
						<!--APPList Begin-->
						<el-col :span="4" v-for="(item,index) in applistdata" :key="index">
							<div class="applistbg" @click="goto(item)" :data-id='applistdata.id'>
								<span><i :class="item.css"></i></span>
								<font>{{item.name}}</font>
							</div>
						</el-col>
						<!--APPList End-->
					</el-row>
					<!--我的应用 End-->

					<!--工作统计 Begin-->
					<div class="clearfix pt30">
						<h3>工作统计</h3>
					</div>
					<el-row :gutter="20" class="applist">
						<!--APPList Begin-->
						<el-col :span="12">
							<div class="statisticsbg">
								<div class="echart_title clearfix">
									<div class="pull-left">
										<h6><el-badge :value="toDoNum" :max="99" class="item">待办任务</el-badge></h6>
									</div>
									<div class="pull-right font13 blue">
										<router-link :to="{path:'/task'}">更多<i class="el-icon-arrow-right el-icon--right"></i></router-link>
									</div>
								</div>
								<div id="todoLists" class="pt40" style="width:100%; height:260px;">
									<!-- 表格 -->
									<el-table ref="table" :data="todoList" :header-cell-style="rowClass" border stripe height="180" style="width: 100%;" :default-sort="{prop:'todoList', order: 'descending'}"
										v-loadmore="loadMore"
										v-loading="loading"
										element-loading-text="加载中…"
										element-loading-spinner="el-icon-loading"
										element-loading-background="rgba(255, 255, 255, 0.9)">
										<!-- <el-table-column label="数据id" sortable width="140px" prop="bizid">
										</el-table-column> -->
										<el-table-column label="单据号" sortable width="160px" prop="bizNum">
											<template slot-scope="scope">
												<p class="blue" title="点击查看详情" @click=audit(scope.row)>{{scope.row.bizNum}}
												</p>
											</template>
										</el-table-column>
										<el-table-column label="应用" sortable width="160px" prop="appDesc">
										</el-table-column>
										<el-table-column label="当前环节" sortable prop="name">
										</el-table-column>
										<!-- <el-table-column label="任务状态" sortable width="140px" align="center" prop="state">
										</el-table-column> -->
										<el-table-column label="录入时间" sortable width="160px" prop="createTime">
										</el-table-column>
									</el-table>
									<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
									</el-pagination>
									<!-- 表格 -->
								</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="statisticsbg" style="height: 290px">
								<div class="echart_title clearfix">
									<div class="pull-left">
										<h6>工作完成情况</h6>
									</div>
									<el-dropdown class="pull-right font13 blue">
										<span class="el-dropdown-link">
											近一周<i class="el-icon-arrow-down el-icon--right"></i>
										</span>
										<el-dropdown-menu slot="dropdown" class="pull-right">
											<el-dropdown-item>昨天</el-dropdown-item>
											<el-dropdown-item>近一周</el-dropdown-item>
											<el-dropdown-item>近一月</el-dropdown-item>
											<el-dropdown-item>近一年</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</div>
								<div class="pt40 clearfix">
									<div class="pull-left">
										<p class="big_numb">{{toDoNum}}</p>
										<p class="small_font">工作总计</p>
										<div class="pt40">
											<p class="middle_font pt40">
												<span class="red">待办工作: {{toDoNum}}</span>
												<span class="textblue">执行中: {{toDoDing}}</span>
												<span class="green">已完成: {{toDoFinish}}</span>
											</p>
										</div>
									</div>
									<div class="pull-right" style="width: 160px; padding-top: 80px;">
											<div class="wracircle" data-anim="base wracircle">
												<div class="circle" data-anim="base left" style=""></div>
												<div class="circle_font">
													<p class="font24">46%</p>
													<p>工作完成率</p>
												</div>
										</div>
									</div>
								</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="statisticsbg">
								<div class="echart_title clearfix">
									<div class="pull-left">
										<h6>设备故障提报量</h6>
									</div>
									<el-dropdown class="pull-right font13 blue">
										<span class="el-dropdown-link">
											近一年<i class="el-icon-arrow-down el-icon--right"></i>
										</span>
										<el-dropdown-menu slot="dropdown" class="pull-right">
											<el-dropdown-item>昨天</el-dropdown-item>
											<el-dropdown-item>近一周</el-dropdown-item>
											<el-dropdown-item>近一月</el-dropdown-item>
											<el-dropdown-item class="">近一年</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</div>
								<div id="main" style="width: 100%; height: 260px;"></div>
							</div>
						</el-col>
						<!-- <el-col :span="6">
							<div class="statisticsbg">
								<div class="echart_title clearfix">
									<div class="pull-left">
										<h6>注册用户人数 <font class="red">(1000)</font></h6>
									</div>
									<div class="pull-right font13 blue">
										<router-link :to="{path:'/user_management'}">更多<i class="el-icon-arrow-right el-icon--right"></i></router-link>
									</div>
								</div>
							</div>
						</el-col> -->
						<!--APPList End-->
					</el-row>
					<!--工作统计 End-->

					
				</div>
			</div>
				
		</div>
	</div>
	<!--右侧内容显示 End-->
</div>
</template>

<script>
import Config from '../config.js'
import vheader from './common/vheader.vue'
import navs_tabs from './common/nav_tabs.vue'
import  'echarts/theme/macarons.js'

export default {
	name: 'index',
		components: {
			vheader,
			navs_tabs,
		},

    data() {
      return {
				toDoNum: 0,
				toDoDing: 0,
				toDoFinish: 0,
      	roleid:1,
      	basic_url: Config.dev_url,
      	loadSign: true, //鼠标滚动加载数据
      	loading: false,//默认加载数据时显示loading动画
        show: false,
		fullHeight: document.documentElement.clientHeight - 100+'px',//获取浏览器高度
		applistdata: [],
		todoList:[],
		searchList: {
			createTime:'',	
		},
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
		},			

      }
    },
  
	methods: {
		getTodoNum(num){//获取vheader子组件里面的getTodoNumber函数值
			this.toDoNum = num;
		},
		getTodoDing(doingnum){//获取vheader子组件里面的getTodoDing函数值
			this.toDoDing = doingnum;
		},
		getTodoFinish(finishnum){//获取vheader子组件里面的getTodoFinish函数值
			this.toDoFinish = finishnum;
		},
		//表头居中
		rowClass({ row, rowIndex}) {
		    return 'text-align:center'
		},
		//审核	
		audit(item){
			this.$router.push({path:item.bizMenuUrl ,query: { bizId: item.bizId,}});
			this.$store.dispatch('setMenuIdAct',item.bizFirstMenuId);

		},
		//Table默认加载数据
		requestData() {
			this.loading = true;//加载动画打开
			var data = {
				page: this.page.currentPage,
				limit: this.page.pageSize,
			}
			var url = this.basic_url + '/api-apps/app/flow/flow/todo';
			this.$axios.get(url, {params: data}).then((res) => {
				this.page.totalCount = res.data.count;
				//总的页数
				let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize);
				if(this.page.currentPage >= totalPage) {
					this.loadSign = false
				} else {
					this.loadSign = true
				}
				this.todoList = res.data.data;
				this.loading = false;//加载动画关闭
				if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
					$('.el-table__body-wrapper table').find('.filing').remove();
				}//滚动加载数据判断filing
			}).catch((wrong) => {
				
				
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
		goto(item){
			this.$store.dispatch('setMenuIdAct',item.id);
			var _this = this;
	        var data = {
				menuId: item.id,
				roleId: _this.$store.state.roleid,
			};
			var url = _this.basic_url + '/api-user/menus/findSecondByRoleIdAndFisrtMenu';
			_this.$axios.get(url, {params: data}).then((res) => {
				if(res.data!="undefined"&&res.data.length>0){
					item = res.data[0];
				}
				
				_this.$store.dispatch('setSelectedNavAct',item);
				var flag="1";
				for(var i=0;i<_this.$store.state.clickedNavs.length;i++){
					if(_this.$store.state.clickedNavs.length==1){
						flag="0";
					}else{
						if(typeof(_this.$store.state.clickedNavs[i].id)!=undefined&&i!=0){
						if(_this.$store.state.clickedNavs[i].id != item.id){
							flag="0";
						}else{
							flag="1";
							break;
						}
					}
					}	
				}
				if(flag=="0"){
					_this.$store.state.clickedNavs.push(item);
					setTimeout(function(){
						var left = $('.page-tabs').offset().left; 
						//tabs总宽度
						var tabW = $('.page-tabs-content').width();
						//总区域内容宽度
						var contentW = $('.content-tabs').width()-240;
						if(tabW>contentW){
							var poor=tabW-contentW;
							$('.page-tabs').offset({
										left: -poor
								});
						}
					},0);
				}
			}).catch((wrong) => {
			});
				_this.$store.dispatch('setNavIdAct',item.id);
				var data = {
				menuId: this.$store.state.menuid,
				roleId: this.$store.state.roleid,
			};
			var url = this.basic_url + '/api-user/menus/findSecondByRoleIdAndFisrtMenu';
			this.$axios.get(url, {params: data}).then((res) => {
				if(res.data.length>0&&res.data!='undefined'){
					var leftnav=res.data;
				  this.$router.push({path:leftnav[0].url});
					this.$emit('childByValue',this.$store.state.selectedNav);
				}else {
					this.$router.push({path:item.url});
					this.$emit('childByValue',this.$store.state.selectedNav);
				}
			}).catch((wrong) => {
			});
		},
		//引入饼状图图表
		initEchart(){
			var myChart = this.$echarts.init(document.getElementById('main'),'macarons');
	        // 指定图表的配置项和数据
	        var option = {
	             xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: [{
			        data: [820, 932, 901, 934, 1290, 1330, 1320],
			        type: 'line',
			        areaStyle: {}
			    }]
	        };
	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);
		},
		 getroId(roleid){
		 	this.getFirstMenus(roleid);
		},
        //一级菜单
		getFirstMenus(roleid) {
				var roleid=this.$store.state.roleid;
				var url = this.basic_url + '/api-user/menus/findFirstByRoleId/' + roleid;
				this.$axios.get(url, {}).then((res) => {
						this.applistdata = res.data;
				}).catch(error => {
				})
			},
			//获取全局承建单位
		getcjdw(){
			var url = this.basic_url + '/api-user/users/findUsersDeptofSta';
				this.$axios.get(url, {}).then((res) => {
					this.$store.dispatch('setcurrentcjdwNavAct',res.data);
				}).catch(error => {
				});
		}
	},
	mounted(){
		//获取全局的承检单位
		this.getcjdw();
		//加载待办任务
		this.requestData();
		//一级菜单
		this.initEchart();//调用饼状图图表函数名称
		this.getTodoNum();//打开页面就执行getTodoNum待办任务数函数
		this.getTodoDing();//打开页面就执行getTodoDing待办任务数函数
		this.getTodoFinish();//打开页面就执行getTodoFinish待办任务数函数
		this.$refs.navsTabs.showClick({
			css: 'icon-user',
			name: '首页',
			url: '/index'})
		//默认请求roid
		if(this.$store.state.roleid==null||typeof(this.$store.state.roleid)==undefined){
			var url = this.basic_url + '/api-user/roles/default';
        	this.$axios.get(url, {}).then((res) => {
        	var roleid= res.data.id;
        	this.$store.dispatch('setRoleIdAct',res.data.id);
      		this.getFirstMenus(roleid);
      		}).catch(error => {
       		})
		}else{
			var roleid=this.$store.state.roleid;
	        var url = this.basic_url + '/api-user/menus/findFirstByRoleId/' + roleid;
	        
	        this.$axios.get(url, {}).then((res) => {
	            this.applistdata = res.data;
	        }).catch(error => {
	        })
		};
	},
}

</script>

<style scoped>
@import '../assets/css/mask-modules.css';

/*工作统计*/
.echart_title {
	left: 15px;
	right: 15px;
	line-height:20px;
	padding-bottom: 10px;
	height: 35px;
	position: absolute;
	top: 15px;
	z-index: 80;
}
.big_numb { color: #333333; font-size: 28px; line-height:32px; }
.small_font { color: #BDBDBD; font-size:10px; line-height:15px;}
.middle_font { color: #121958; font-size: 13px;  line-height:22px;}
.middle_font span {display: block;}



/*半圆统计图效果*/

.wracircle {
	width: 160px; /* Set the size of the progress bar */
	height: 160px;
	position: absolute; /* Enable clipping */
	transform:rotate(270deg);
	clip: rect(0px, 160px, 160px, 80px); /* Hide half of the progress bar */
}

/* Set the sizes of the elements that make up the progress bar */
.circle {
	width: 160px;
	height: 160px;
	border: 10px solid #9399F3;
	border-radius: 80px;
	position: absolute;
	z-index: 1;
	clip: rect(0px, 80px, 160px, 0px);
}
.wracircle:after {
	content: '';
	width: 160px;
	height: 160px;
	position: absolute;
	z-index: -1;
	border: 10px solid #EBF4F7;
	border-radius: 100px;
}
.circle_font {
	position: absolute;
	z-index: 6;
	width:100%;
	height: 55%;
	top: 42px;
	right: 0px;
	bottom: 0px;
	text-align: center; 
	transform:rotate(90deg);
}
.circle_font p {
	font-size: 13px;
}
.circle_font p.font24 {font-size: 24px;}
/* Using the data attributes for the animation selectors. */
/* Base settings for all animated elements */
div[data-anim~=base] {
  -webkit-animation-iteration-count: 1;  /* Only run once */
  -webkit-animation-fill-mode: forwards; /* Hold the last keyframe */
  -webkit-animation-timing-function:linear; /* Linear animation */
}

.wracircle[data-anim~=wracircle] {
  -webkit-animation-duration: 0.01s; /* Complete keyframes asap */
  -webkit-animation-delay: 3s; /* Wait half of the animation */
  -webkit-animation-name: close-wracircle; /* Keyframes name */
}
.circle[data-anim~=left] {
  -webkit-animation-duration: 1s; /* Full animation time */
  -webkit-animation-name: left-spin;
}
/* 改变工作完成情况数据，公式（180/100*n） */
@-webkit-keyframes left-spin {
	from {-webkit-transform: rotate(0deg);} to {-webkit-transform: rotate(82deg);}
}

</style>

