<template>
	<div class="navbar-default navbar-static-side" :style="{height: fullHeight}">
		<div class="navbarbg" @click="min2max()">
			<span class="navbar-minimalize minimalize-styl-2">
				<i class="icon-menu1"></i> 
			</span>
		</div>
		<ul class="navs" id="side-menu" v-show="!isShow" >
			<li v-for="item in leftNavs" @click="addClickNav(item)">
				<router-link :to="item.navherf">
					<i :class="item.navicon"></i>
					<span class="nav-label" v-show="ismin">{{item.navtitle}}</span>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'navs',
	data(){
		return{
			isShow:false,
			ismin:true,
			fullHeight: document.documentElement.clientHeight - 100+'px',//获取浏览器高度
			leftNavs: [//leftNavs左侧菜单数据
				{
					navicon: 'icon-file-text',
					navtitle: '仪器和计量器具',
					navherf: '/instruments'
				}, {
					navicon: 'icon-file-text',
					navtitle: '使用/维护保养记录',
					navherf: '/usag_tending_records'
				}, {
					navicon: 'icon-task',
					navtitle: '溯源计划',
					navherf: '/traceability_plan'
				}, {
					navicon: 'icon-task',
					navtitle: '溯源记录',
					navherf: '/traceability_records'
				}, {
					navicon: 'icon-log',
					navtitle: '期间核查计划',
					navherf: '/verification_plan'
				}, {
					navicon: 'icon-log',
					navtitle: '期间核查记录',
					navherf: '/verification_records'
				}
			],
        selectedNav: {}
		}
	},
	
	methods: {
		addClickNav(item){
			if(!sessionStorage.getItem('clickedNav')){
				sessionStorage.setItem('clickedNav',JSON.stringify({arr:[]}));
			}
			var clickedNav = JSON.parse(sessionStorage.getItem('clickedNav')).arr;
			var flag = true;
			for(var i = 0; i < clickedNav.length; i++){
				if(item.navtitle == clickedNav[i].navtitle){
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
		let item=this.leftNavs[0];
		this.addClickNav(item);
	}
}
</script>

<style scoped>

</style>