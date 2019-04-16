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
			<div class="ibox-content">
				<el-form ref="safemanage" :model="safemanage" label-width="80px" :label-position="labelPosition">
					<el-collapse v-model="activeNames">
						<el-collapse-item title="安全管理" name="1">
							<el-row :gutter="30">
						 		<el-col :span="12">
									<el-form-item label="是否包含大写字母">
										<el-select v-model="safemanage.emptyuppercase" filterable placeholder="请选择">
											<el-option v-for="item01 in uppercase" :label="item01.label" :value="item01.value" :key="item01.value"></el-option>
										</el-select>
									</el-form-item>
						 		</el-col>
						 

						 		<el-col :span="12">
						 			<el-form-item label="是否包含小写字母">
								    	<el-select v-model="safemanage.emptylowercase" filterable placeholder="请选择">
											<el-option v-for="item02 in lowercase" :key="item02.value" :label="item02.label" :value="item02.value"></el-option>
										</el-select>
									</el-form-item>	
						 		</el-col>
						 	</el-row>
						 	
						 	<el-row :gutter="30">
						 		<el-col :span="12">
									<el-form-item label="是否包含特殊字符">
										<el-select v-model="safemanage.emptycharacter" filterable placeholder="请选择">
											<el-option v-for="item03 in character" :key="item03.value" :label="item03.label" :value="item03.value"></el-option>
										</el-select>
									</el-form-item>
						 		</el-col>
						 	
						 		<el-col :span="12">
						 			<el-form-item label="密码长度">
								    	<el-select v-model="safemanage.emptylengths" filterable placeholder="请选择">
											<el-option v-for="item04 in lengths" :key="item04.value" :label="item04.label" :value="item04.value"></el-option>
										</el-select>
									</el-form-item>	
						 		</el-col>
						 	</el-row>

						 	<el-row :gutter="30">
						 		<el-col :span="12">
									<el-form-item label="密码过期天数">
										<el-select v-model="safemanage.emptyexpired" filterable placeholder="请选择">
											<el-option v-for="item05 in expired" :key="item05.value" :label="item05.label" :value="item05.value"></el-option>
										</el-select>
									</el-form-item>
						 		</el-col>
						 	
						 		<el-col :span="12">
						 			<el-form-item label="Session过期时间">
								    	<el-select v-model="safemanage.emptysession" filterable placeholder="请选择">
											<el-option v-for="item06 in session" :key="item06.value" :label="item06.label" :value="item06.value"></el-option>
										</el-select>
									</el-form-item>	
						 		</el-col>
						 	</el-row>

							<el-row :gutter="30">
								<el-col :span="12" >
									<el-form-item label="是否包含特殊字符">
										<el-select v-model="safemanage.emptyerrortimes" filterable placeholder="请选择">
											<el-option v-for="item07 in errortimes" :key="item07.value" :label="item07.label" :value="item07.value"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
						</el-collapse-item>
					</el-collapse>
				</el-form>

				<div class="el-dialog__footer">
					<el-button type="primary" @click="submitForm('safemanage')">保存</el-button>
					<el-button @click="resetForm('safemanage')">重置</el-button>
				</div>
			</div>
		</div>
	</div>
	<!--右侧内容显示 End-->
  	
</div>
</template>

<script>
import Config from '../../config.js'
import vheader from '../common/vheader.vue'
import navs_tabs from '../common/nav_tabs.vue'
import navs_left from '../common/left_navs/nav_left5.vue'

export default {
	name: 'safemanage',
		components: {
			vheader,
			navs_tabs,
			navs_left,
		},

    data() {
      return {
	      	basic_url: Config.dev_url,
			isShow:false,
			ismin:true,
			activeNames: ['1'],//手风琴数量
			fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
	        labelPosition: 'top',//表单标题在上方显示
			uppercase: [{//是滞包含大写字母
				value: '1',
				label: '是'
			}, {
				value: '0',
				label: '否'
			}],
	        lowercase: [{//是否包含小写字母
				value: '1',
				label: '是'
			}, {
				value: '0',
				label: '否'
			}],
			character: [{//是否包含特殊字符
				value: '1',
				label: '是'
			}, {
				value: '0',
				label: '否'
			}],
			lengths: [{//密码长度
				value: '6',
				label: '6位'
			}, {
				value: '8',
				label: '8位'
			}, {
				value: '16',
				label: '16位'
			}, {
				value: '22',
				label: '22位'
			}],
	        expired: [{//密码过期天数
				value: '5',
				label: '5天'
			}, {
				value: '10',
				label: '10天'
			}, {
				value: '20',
				label: '20天'
			}, {
				value: '30',
				label: '30天'
			}],
			session: [{//Session过期时间
				value: '3',
				label: '3分钟'
			}, {
				value: '5',
				label: '5分钟'
			}, {
				value: '10',
				label: '10分钟'
			}, {
				value: '15',
				label: '15分钟'
			}, {
				value: '25',
				label: '25分钟'
			}, {
				value: '30',
				label: '30分钟'
			}],
			errortimes: [{//密码输错次数
				value: '3',
				label: '3次'
			}, {
				value: '5',
				label: '5次'
			}, {
				value: '8',
				label: '8次'
			}],
			safemanage:{
				emptyuppercase: '0',//是滞包含大写字母
				emptylowercase: '0',//是否包含小写字母
				emptycharacter: '0',//是否包含特殊字符
				emptylengths: '6',//密码长度
				emptyexpired: '30',//密码过期天数
				emptysession: '5',//Session过期时间
				emptyerrortimes: '5',//密码输错次数
			}
		}
    },
    mounted(){

	},
	methods: {
		submitForm(formName) {//修改当前用户信息
	        this.$refs[formName].validate((valid) => {
				if (valid) {
		            var url = this.basic_url + '/api-user/users/me';
		            var personinfo=this.personinfo;
		            personinfo.sex = personinfo.sexName == '男' ? 1 : 0;
		            personinfo.enabled = personinfo.enabledName == '启用' ? 1 : 0;
		            this.$axios.put(url, this.personinfo).then((res) => {
						//resp_code == 0是后台返回的请求成功的信息
						if(res.data.resp_code == 0) {
							this.$message({
								message: '保存成功',
								type: 'success'
							});
							this.$emit('request')//重新加载数据
						} 
					}).catch((err) => {
					});

				} else {
					return false;
				}
	        });
		},
		
		resetForm(formName) {//重置按钮调用
			this.$refs[formName].resetFields();
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
	}	
}

</script>

<style scoped>
@import '../../assets/css/mask-modules.css';


</style>

