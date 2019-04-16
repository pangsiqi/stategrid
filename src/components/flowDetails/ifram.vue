<template>
 <div> 
	<div class="masks" v-if="show"></div>
	<div class="mask_divbg" v-if="show">
		<div class="masks_div">
			<div class="mask_title_div clearfix">
				<div class="mask_title" >添加流程模型</div>
				<div class="mask_anniu">
					<!-- <span class="mask_span mask_max" @click="toggle">
						<i v-bind:class="{ 'icon-maximization': isok1, 'icon-restore':isok2}"></i>
					</span> -->
					<span class="mask_span" @click="close">
						<i class="icon-close1"></i>
					</span>
				</div>
			</div>			
		   <iframe :src="this.url +'/designer/modeler.html?modelId='+this.modelId" id="flowIframe" width="100%" height="100%" frameborder="0" scrolling="no" >
		   </iframe>
		</div>
   	</div>
 </div>
</template>

<script>
	import Config from '../../config.js';
	export default {
    props: ["modelId"],
	name: 'iframemask',
	data() {
    return {
    basic_url: Config.dev_url,
    innerVisible: false,
    show:false,
    url:'',
    isok1: true,
	isok2: false,
    }
  },
   methods: {
  	//点击关闭按钮
			close() {
				this.show = false;
			},
			open() {
				this.show= true;
			},
		  	visible(modelId) {
		  		if(modelId!="undefined"&&modelId!="null"){
		  			this.modelId=modelId;
		  		}
		  		var url=this.basic_url;
    			url = url.substring(0,21);
		  		this.url=url+"4500";
				this.show= true;
		  	},
		    //取消
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
  },
   mounted(){

   },
   
}
</script>

<style>
	@import '../../assets/css/mask-modules.css';
	.masks{
	width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    position: fixed;
    display: block;
    top: 0px;
    z-index: 1000;
    margin-top:60px;
}
.masks_div{
    position: absolute;
    z-index: 1001;
    width: 100%;
    background:#F3F6FA;	
    border-radius: 0px;
    height: 100%;
    top: 0px;
    bottom: 0px;
    overflow: hidden;
}
</style>