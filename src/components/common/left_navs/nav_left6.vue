<template>
	<div  class="navbar-default navbar-static-side" :style="{height: fullHeight}">
		<div class="navbarbg" @click="min2max()">
			<span class="navbar-minimalize minimalize-styl-2">
				<i class="icon-menu1"></i> 
			</span>
		</div>
		<ul class="navs" id="side-menu" v-show="!isShow" >
			<li v-for="item in leftNavs" @click="addClickNav(item)">
				<router-link :to="item.url">
					<i :class="item.css"></i>
					<span class="nav-label" v-show="ismin">{{item.name}}</span>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
	import Config from '../../../config.js'
export default {
	name: 'navs',
	data(){
		return{
			basic_url: Config.dev_url,
			isShow:false,
			ismin:true,
			fullHeight: document.documentElement.clientHeight - 100+'px',//获取浏览器高度
			leftNavs:[],
//			leftNavs: [//leftNavs左侧菜单数据
//				{
//					navicon: 'icon-file-text',
//					navtitle: '接样',
//					navherf: '/samples'
//				}, {
//					navicon: 'icon-wordbook',
//					navtitle: '领样',
//					navherf: '/collar_sample'
//				}, {
//					navicon: 'icon-wordbook',
//					navtitle: '返样',
//					navherf: '/return_sample'
//				}, {
//					navicon: 'icon-wordbook',
//					navtitle: '样品处置',
//					navherf: '/sample_disposal'
//				}
//			],
        selectedNav: {}
		}
	},
	
	methods: {
		getNaveLeft() {
				var _this = this;
				var data = {
					menuId: sessionStorage.getItem('menuId'),
					roleId: sessionStorage.getItem('roleid'),
				}
				var promise = new Promise(function(resolve, reject) {
					var url = _this.basic_url + '/api-user/menus/findSecondByRoleIdAndFisrtMenu';
					_this.$axios.get(url, {params: data}).then((res) => {
						_this.leftNavs = res.data;
						resolve(res);
					}).catch((wrong) => {
						// _this.$message({
						// 	message: '网络错误，请重试',
						// 	type: 'error'
						// });
					});
				});
				return promise;
			},
		addClickNav(item){
			if(!sessionStorage.getItem('clickedNav')){
				sessionStorage.setItem('clickedNav',JSON.stringify({arr:[]}));
			}
			var clickedNav = JSON.parse(sessionStorage.getItem('clickedNav')).arr;
			var flag = true;
			for(var i = 0; i < clickedNav.length; i++){
				if(item.name == clickedNav[i].name){
					flag = false;
				}
			}
			if(flag){
				clickedNav.push(item);
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

			if(!sessionStorage.getItem('selectedNav')){
				sessionStorage.setItem('selectedNav',JSON.stringify({}));
			}
			var selectedNav = JSON.parse(sessionStorage.getItem('selectedNav'));
			
			selectedNav = item;
			sessionStorage.setItem('selectedNav',JSON.stringify(selectedNav));
			sessionStorage.setItem('clickedNav',JSON.stringify({arr:clickedNav}));
		},
		min2max(){//左侧菜单正常和变小切换
        	if($(".navbar-static-side").width()=="220"){
		    	$(".wrapper").css("padding-left", "220px");
		    	$(".navs>li").css("margin", "0px 10px");
		    	this.maxDialog();
		    }else if($(".navbar-static-side").width()=="40"){
				$(".wrapper").css("padding-left", "40px");
				$(".navs>li").css("margin", "0");
				this.rebackDialog();
			}
		    this.ismin=!this.ismin;
   		},
	    maxDialog(e) {//右侧内容跟着左侧菜单正常和变小切换
	    	$(".navbar-static-side").css("width", "40px");
			$(".wrapper").css("padding-left", "40px");
			$(".navs>li").css("margin", "0");
		},
		rebackDialog() {//左侧菜单正常
			$(".navbar-static-side").css("width", "220px");
			$(".wrapper").css("padding-left", "220px");
			$(".navs>li").css("margin", "0px 10px");
		}
	},
	mounted() {
//		this.getNaveLeft();
		var that=this;
		that.getNaveLeft().then(function (result){
			var data=result.data;
			let item = data[0];
			that.addClickNav(item);
		});
//		let item=this.leftNavs[0];
//		this.addClickNav(item);
	}
}
</script>

<style scoped>
</style>	
