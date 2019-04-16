<template>
	<div >
	<el-dialog :modal-append-to-body="false" title="当前责任人" :visible.sync="innerVisible" width="40%">
		  <!--<el-form ref="approveForm" :model="approveForm" :rules="rules" label-width="120px" class="demo-ruleForm">-->
	     <el-input disabled type="textarea" rows="5" v-model="user"></el-input>
	<!--    </el-form>-->
    </el-dialog>
</div>
</template>

<script>
	import Config from '../../config.js'; 
	export default {
	  props:["approvingData"],//第一种方式
	    name: 'vewPoplemask',
	  data() {
    return {
    	 appname:'',
   		 id:'',
   		 user:'',
    	 basic_url: Config.dev_url,  
   	     innerVisible: false,
    };
  },
	  methods: {
	  	open() {
					this.innerVisible = true;
				},
	  	getvewPople(){

	  		this.id=this.approvingData.id;
				this.appname=this.approvingData.app;

//		    /app/{app}/flow/isStart/{id}{app}单据是否启动流程
				var url = this.basic_url + '/api-apps/app/'+this.appname+'/flow/isStart/'+this.id;
		    		this.$axios.get(url, {}).then((res) => {
		    			if(res.data.resp_code == 1) {
							this.$message({
								message:res.data.resp_msg,
								type: 'warning'
							});
				    }else{
				    	var url = this.basic_url + '/api-apps/app/'+this.appname+'/flow/isEnd/'+this.id;
		    				this.$axios.get(url, {}).then((res) => {
		    					if(res.data.resp_code == 0) {
									this.$message({
										message:res.data.resp_msg,
										type: 'warning'
									});
		    					}else{
		    						var url = this.basic_url + '/api-apps/app/'+this.appname+'/flow/Executors/'+this.id;
		    						this.$axios.get(url, {}).then((res) => {
									var resullt=res.data.datas;
									var users='';
									for(var i=0;i<resullt.length;i++){
										users = users + resullt[i].nickname+'，';
									}
									this.user=users;			
									this.innerVisible = true;
									});
								}
				   			 });
		    			}
	 });		
	  },    
	  }
};
</script>

<style>
</style>