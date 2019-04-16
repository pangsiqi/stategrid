<template>
	<div>
		<div class="mask" v-if="show"></div>
		<div class="mask_divbg" v-if="show">
			<div class="mask_div">
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
				<div class="mask_content">
					<el-form inline-message :model="modelflow" :rules="rules" label-width="100px" ref="modelflow">
						<div class="accordion" id="information">
							<el-collapse v-model="activeNames">
								<el-collapse-item title="新建模型" name="1">
										<el-col :span="8">
											<el-form-item label="模型标识" prop="key">
												<el-input v-model="modelflow.key"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="模型类型" prop="category">
												<el-input v-model="modelflow.category"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="模型名称" prop="name">
												<el-input v-model="modelflow.name"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="8">
											<el-form-item label="模型描述" prop="description">
												<el-input v-model="modelflow.description"></el-input>
											</el-form-item>
										</el-col>
								</el-collapse-item>
								
							</el-collapse>
						</div>
						<div class="el-dialog__footer">
							<el-button type="primary" @click="saveAndUpdate">保存</el-button>
							<el-button @click="close">取消</el-button>
						</div>
					</el-form>
				</div>
				<iframemask  ref="child" :modelId="modelId"></iframemask>
			</div>
		</div>
	</div>
</template>

<script>
	import Config from '../../config.js'
	import iframemask from '../flowDetails/ifram.vue'
	export default {
		name: 'masks',
		components: {
			iframemask
		},
		props: {
			modelflow: {
				type: Object,
				default: function() {
					return {
						key: '',
						category: '',
						name: '',
						description: '',
						
					}
				}
			},
			page: Object,
		},
		data() {
			return {
				falg:false,//保存验证需要的
				basic_url: Config.dev_url,
				show:false,
				selUser: [],
				edit: true, //禁填
				show: false,
				isok1: true,
				isok2: false,
				modelId:'',
				activeNames: ['1'], //手风琴数量
				rules: { //定义需要校验数据的名称
					key: [{ required: true, message: '请填写模型标识', trigger: 'blur' }],
					category: [{ required: true, message: '请填写模型类型', trigger: 'blur' }],
					name: [{ required: true, message: '请填写模型名称', trigger: 'blur' }],
					description: [{ required: true, message: '请填写模型描述', trigger: 'blur' }],
				},
			};
		},
		methods: {
			//添加显示弹窗
			visible() {
				this.show = true;
			},
			//点击关闭按钮
			close() {
				this.show = false;
				this.$emit('request');
			},
			open(){
				this.show = true;
			},
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
			// 保存users/saveOrUpdate
			save() {
				this.$refs.modelflow.validate((valid) => {
					if (valid) {
					   var url = this.basic_url + '/api-flow/flow/model/create';
						this.$axios.get(url, {}).then((res) => {
							this.modelId=res.data.modelId;
							
							if(res.status ==200) {
     						this.$refs.child.visible();
							}
						}).catch((err) => {
						});
					} else {
						this.show = false;
						return false;
					}
				});
			},
			
			//保存
			saveAndUpdate() {
				this.save();
//				if(this.falg){
//					this.show = false;
//				}
			},
			//保存并继续
			saveAndSubmit() {
				this.save();
				this.show = true;
			},
			
		},
		mounted() {
			
		},
		
	}
</script>

<style>
	@import '../../assets/css/mask-modules.css';
</style>