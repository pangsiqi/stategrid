<template>
<div class="stepComponent" >
	<el-dialog :modal-append-to-body="false" title="流程历史" :visible.sync="innerVisible" width="45%">
    <div class="approvalProcess" >
        <el-steps :active="active" direction="vertical">
           <el-step :title="item.nodeName" :status="item.flag" :key="item.id" v-for="item in approvalProcessProject" :id="item.id">
            <template slot="description" >
             <div class="step-row">
                <el-row :gutter="30" class="processing_content">
                  <el-col :span="16" class="font13 gray">
                    <span>审批人： <label class="blue">{{item.opName}}</label></span>
                  </el-col>
                  <el-col :span="8" class="font13 text-right gray">
                    <span><i class="icon-time"></i> {{item.createTime}}</span>
                  </el-col>
                  <el-col :span="24">
                   <span>{{item.opinion}}</span>
                 </el-col>
                </el-row>
               </div>
             </template>
           </el-step>
        </el-steps>
        <!--<el-button style="margin-top: 12px;" @click="next">下一步</el-button>-->
    </div>
 </el-dialog>
</div>
</template>
<script>
 import Config from '../../config.js';
export default {
	 props:["approvingData"],//第一种方式
   components: {
  },
  props: ['approvingData'],
  data() {
    return {
    	basic_url: Config.dev_url,
    	appname:'',
   		id:'',
        innerVisible: false,
       	active: 0,
     	approvalProcessProject:[],
//     approvalProcessProject:[
//         {id:'0',title:"检验员审批",opinionName:"王华",opinionStatus:"error",opinion:"驳回，明细有误。",opinionDate:"2018-12-26 14:35:23"},
//         {id:'1',title:"检验员审批",opinionName:"王华",opinionStatus:"success",opinion:"同意。",opinionDate:"2018-12-26 14:35:23"},
//         { id:'2',title:"组长审批",opinionName:"李亮",opinionStatus:"success",opinion:"同意，建议归档。",opinionDate:"2018-12-26 16:25:34"},
//         { id:'3',title:"复查长审批",opinionName:"陈明明",opinionStatus:"success",opinion:"同意。",opinionDate:"2018-12-27 09:25:45"},
//         { id:'4',title:"站长审批",opinionName:"刘国富",opinionStatus:"wait",opinion:"待审核",opinionDate:""},
//     ],
    };
  },
  methods: {
  	close() {
				this.innerVisible = false;
			},
	open() {
				this.innerVisible = true;
			},
	visible() {
					this.open();
		  	},
	getdata(){
		console.log(this.approvingData);
		this.id=this.approvingData.id;
	    this.appname=this.approvingData.app;
	   	 var url = this.basic_url + '/api-apps/app/'+this.appname+'/flow/isStart/'+this.id;
            this.$axios.get(url, {}).then((res) => {
					
					if(res.data.resp_code == 1) {
						
							this.$message({
								message:res.data.resp_msg,
								type: 'warning'
							});
				    }else{
				    	var url = this.basic_url + '/api-apps/app/'+this.appname+'/flow/history/'+this.id;
		    				this.$axios.get(url, {}).then((res) => {
		    					
		    					for(var i=0;i<res.data.datas.length;i++){
										if(res.data.datas[i].flag==true){
											res.data.datas[i].flag="success";
										}else{
											res.data.datas[i].flag="error";
										}
									}
									this.approvalProcessProject = res.data.datas;
									this.innerVisible = true;
							});
					}
                });
               },
//   next() {
//      if (this.active++ > 2) this.active = 0;
//    },
  }
};
</script>
<style scoped>
  .stepComponent{
      padding: 10px 10px 10px 10px;
  }
  .stepsTitle{
      margin: 10px 0px  10px  0px ;
  }
  .approvalProcess{
      color: #9EADC4;
      font-size: 14px;
      /* width: 100%; */
      margin-left:10px;
      margin-right:10px;
      margin-top:10px;
  }
  .processing_content{
    font-size: 14px;
    line-height:2em;
    background-color: #FFFFFF;
    box-shadow:0px 1px 15px 1px rgba(176,192,237,0.42);
    border-radius: 4px;
    padding: 5px 0px;
  }
  .step-row{
     min-width:500px;
     margin-bottom:10px;
     margin-top:5px;
  }
</style>