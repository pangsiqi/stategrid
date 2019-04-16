<template>
<div>
	<el-dialog :modal-append-to-body="false" title="审批" :visible.sync="innerVisible" width="60%">
  <el-form ref="approveForm" :model="approveForm" :rules="rules" label-width="120px" class="demo-ruleForm">
    <el-row :gutter="30">
      <el-col :span="23" :offset="0">
        <el-form-item label="审批意见" prop="opinion">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="approveForm.opinion"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item size="medium" class="div-submit">
      <el-button type="primary" @click="submitForm">同意</el-button>
      <el-button type="danger" @click="rejectForm">驳回</el-button>
    </el-form-item>
  </el-form>
  </el-dialog>
 </div>
</template>

<script>
import Config from '../../config.js';
export default {
	 props:["approvingData"],//第一种方式
  name: 'approving',
  
  data() {
    return {
    appname:'',
    id:'',
    basic_url: Config.dev_url,
      approveForm: {
        opinion: '',
      },
     innerVisible: false,
     rules: {
        opinion: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
        ],
     }

    }
  },

  methods: {
  	//点击关闭按钮
			close() {
				this.innerVisible = false;
			},
			open() {
				this.innerVisible = true;
			},
		  	visible() {
					this.open();
		  	},
		    //同意
		    submitForm(){
		    	console.log(this.approvingData);
		    	this.id=this.approvingData.id;
		    	this.appname=this.approvingData.app;
		    	this.$refs.approveForm.validate((valid) => {	
		    	var url = this.basic_url + '/api-apps/app/'+this. appname+'/flow/'+this.id;	
		    	console.log(url);
				this.approveForm = {
							"end":false,
					 		"flag": true,
							"opinion":this.approveForm.opinion,
					}
				this.$axios.post(url, this.approveForm).then((res) => {
				console.log(this.approveForm);
					if(res.data.resp_code == 1) {
						
							this.$message({
								message:res.data.resp_msg,
								type: 'warning'
							});
				    }else{
				    	this.$message({
								message:res.data.resp_msg,
								type: 'success'
							});
							this.close();
							//调用父页面的方法刷新页面
							this.$emit('detail');
				    }
				});
		    });
		    },
		    //驳回
		    rejectForm(){
		    	console.log(this.approvingData);
		    	this.id=this.approvingData.id;
		    	this.appname=this.approvingData.app;
		    	this.$refs.approveForm.validate((valid) => {	
		    	var url = this.basic_url + '/api-apps/app/'+this.appname+'/flow/'+this. id;	
				this.approveForm = {
							"end":false,
					 		"flag": false,
							"opinion":this.approveForm.opinion,
					}
				this.$axios.post(url, this.approveForm).then((res) => {
				
					if(res.data.resp_code == 1) {
							this.$message({
								message:res.data.resp_msg,
								type: 'warning'
							});
							this.close();
				    }else{
				    	this.$message({
								message:res.data.resp_msg,
								type: 'success'
							});
							this.close();
							//调用父页面的方法刷新页面
							this.$emit('detail');
				    }
				});
		    });
		   },
		    //取消
		    resetForm(){
		    }
  }
}

</script>

<style>
.div-submit {
	margin-top: 20px;	
}
</style>