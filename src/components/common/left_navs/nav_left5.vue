<template>
	<div  class="navbar-default navbar-static-side scrollbar" :style="{height: fullHeight}">
		<div class="navbarbg" @click="min2max()">
			<span class="navbar-minimalize minimalize-styl-2">
				<i class="icon-menu1"></i> 
			</span>
		</div>
		<ul class="navs" id="side-menu" v-show="!isShow" >
			<li v-for="item in leftNavs" :key="item.id" @click="addClickNav(item)">
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
			leftNavs: [],
            selectedNav: {}
		}
	},
	methods: {
		addClickNav(item){
			var flag = false;
			for(var i = 0; i < this.$store.state.clickedNavs.length; i++){
				if(item.name == this.$store.state.clickedNavs[i].name){
					flag = true;
				}
			}
			if(!flag){
				this.$store.state.clickedNavs.push(item);
				setTimeout(function(){
		 			var left = $('.page-tabs').offset().left; 
		            //tabs总宽度
		            var tabW = $('.page-tabs-content').width();
		            //总区域内容宽度
		            var contentW = $('.content-tabs').width()-240;
		            if(tabW>contentW){
		            	var poor=tabW-contentW;
		            	$('.page-tabs').offset({
		                    left:poor
		                });
		            }
				},0);				
			}
			this.$store.dispatch('setSelectedNavAct',item);
			//点击的值传给user
			this.$emit('childByValue',item);
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
		},	
	},
	mounted() {
		if(this.$store.state.menuid=="undefined"||this.$store.state.menuid=="null"){
			  $('.navbar-default').hide();
		     this.$emit('childByValue',this.$store.state.selectedNav);
		}else{
		    var data = {
				menuId: this.$store.state.menuid,
				roleId: this.$store.state.roleid,
			};
			var menu={
				id:this.$store.state.menuid
			};
			var url = this.basic_url + '/api-user/menus/findSecondByRoleIdAndFisrtMenu';
			this.$axios.get(url, {params: data}).then((res) => {
				if(res.data.length>0&&res.data!='undefined'){
					if(this.$route.path!=this.$store.state.selectedNav.url){
						this.$store.dispatch('setSelectedNavAct',res.data[0]);
					}
					$('.navbar-default').show();
					this.leftNavs = res.data;
					this.$emit('childByValue',this.$store.state.selectedNav);
				}else{
					$('.navbar-default').hide();
					$('.wrapper').css('padding-left','0px');
					this.$emit('childByValue',menu);
				}
			}).catch((wrong) => {
				// this.$message({
				// 	message: '网络错误，请重试左侧',
				// 	type: 'error'
				// });
			});
		}
	}
}
</script>

<style scoped>

</style>