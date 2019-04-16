<template>
	<div>
	    <div id="printdom">
            <img  id="barcode" :src="codeUrl" alt="条码" />
        </div>
	</div>
</template>
<script>
	import Config from '../../config.js'
	import vheader from '../common/vheader.vue'
	import navs_left from '../common/left_navs/nav_left5.vue'
	import navs_header from '../common/nav_tabs.vue'
	import tableControle from '../plugin/table-controle/controle.vue'
	import samplesmask from'../samplesDetails/samples_mask.vue'
	import reportmask from'../reportDetails/reportMask.vue'
	export default {
		name: 'printCode',//接样
		components: {
			vheader,
			navs_left,
			navs_header,
			tableControle,
			samplesmask,
			reportmask
		},
		data() {
			return {
				codeUrl: 'http://192.168.1.115:7902/stripcode/image/91325219.jpg',
				code_url: Config.code_url,
			}
		},
		methods: {

		},
		mounted(){
			this.codeUrl = this.$route.query.imgUrl;
			console.log(this.codeUrl);
            setTimeout(function(){
                window.print();
            },1000);
        }
	}
</script>

<style scope>
.p15 {padding:10px 15px;}
@media print {
    #printdom {
	    page-break-before: always;
	    width: 50mm;
	    height: 50mm;
	    text-align: center;
	    display: block;
	}
	#printdom img {
		width: 35mm;
		height: 35mm;
	}	
}
</style>