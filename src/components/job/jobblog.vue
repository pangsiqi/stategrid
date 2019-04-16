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
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_tabs from '../common/nav_tabs.vue'
	export default {
		name: 'jobblog',
		components: {
			'vheader': vheader,
			'navs_tabs': navs_tabs,
			'navs_left': navs_left,
		},
		data() {
			return{
				fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
				url:'',
			}
		},
		methods: {
			mounted() {
				this.$nextTick(function(){
					var url=this.basic_url;
					url = url.substring(0,21);
					var pos = url.lastIndexOf(':');
					url=url.substring(0,pos+1); 
					this.url=url+"8800/joblog";
				});	
			},
		}
	}
</script>

<style scoped>
	
</style>