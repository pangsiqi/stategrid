<template>
	<del-btn :delTable="appName" 
			:delBtn="delBtn" 
			:delLen="2" 
			:delData="selData" 
			@refreshList="requestData"
			v-if="JSON.stringify(delBtn) == '{}'">
	</del-btn>
	<!-- <delData-btn :delTable="appName"
				 :delBtn="delDataBtn"
				 :delLen="2" 
				 :delData="selData" 
				 @refreshList="requestData"
	</delData-btn> -->
</template>
<script>
	import Config from '../../../config.js'
	import delBtn from './delBtn.vue'
	import delDataBtn from './delDatabase.vue'
	export default {
		name: 'btnGroup',
		components: {
			'del-btn': delBtn,
			'delData-btn': delDataBtn
		},
		props: {
			btns: {
				type: Array,
				default: []
			},
			selData: {
				type: Array,
				default: []
			},
			appName: {
				type: String
			}
		},
		watch:{
			btns: {
				handler: (newVal, oldVal)=>{
					var resData = newVal;
					for(let i=0; i<resData.length; i++){
						switch(resData[i].name){
							case '删除':
								this.delBtn = resData[i];
								break;
							// case '彻底删除':
							// 	this.delDataBtn = resData[i];
							// 	break;
						}
					}
				},
				immediate:true,
            	deep:true
			}
		},
		data() {
			return {
				basic_url: Config.dev_url,
				//删除按钮
				delBtn: {},
				//彻底删除按钮
				delDataBtn: {},
				buttons: [],
			}
		},
		methods: {
			requestData(){
				this.$emit('requestData');
			}
		}
	}
</script>