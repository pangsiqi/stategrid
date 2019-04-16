<template>
	<button :key='delBtn.id' :class="'btn mr5 '+ delBtn.style"  @click="del">
		<i :class="delBtn.icon"></i>{{delBtn.name}}
	</button>
</template>
<script>
	import Config from '../../../config.js'
	export default {
		name: 'del',
		props: {
			delBtn: {},
			delTable: {
				type: String
			},
			delData: {
				type: Array,
				default: []
			},
			delLen: {
				type: Number,
				default: 1
			},
			delTable: {
				type: String
			}
		},
		data() {
			return {
				basic_url: Config.dev_url,
			}
		},
		methods: {
			//删除数据
			del(){
				if(this.delData.length == 0){
					this.$message({
						message: '请您选择要删除的数据',
						type: 'warning'
					});
					return;
				}
				if(this.delLen > 1){
					this.delMore();
				}else{
					this.delSingle();
				}
			},
			delSingle(){
				this.$confirm('确定彻底删除此数据吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(() => {
					var url = this.basic_url + '/api-apps/app/'+this.delTable+'/physicsDel/'+this.delData.ID;
					this.$axios.delete(url, {
					}).then((res) => { 
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.$emit('refreshList');
						}else{
							this.$message({
								message: res.data.message,
								type: 'error'
							});
						}
					}).catch((err) => {
						this.$message({
							message: '网络错误，请重试',
							type: 'error'
						});
					});
				}).catch(() => {});
			},
			//删除多条数据
			delMore(){
				var selData = this.delData;
				var url = this.basic_url + '/api-apps/app/'+this.delTable+'/physicsDel';
				var deleteid = [];
				for(var i = 0; i < selData.length; i++) {
					deleteid.push(selData[i].ID);
				}
				var data = {
					ids: deleteid.toString(','),
				}
				this.$confirm('确定彻底删除此数据吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(() => {
					this.$axios.delete(url, {
						params: data
					}).then((res) => { 
						if(res.data.resp_code == 0) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.$emit('refreshList');
						}else{
							this.$message({
								message: res.data.message,
								type: 'error'
							});
						}
					}).catch((err) => {
						this.$message({
							message: '网络错误，请重试',
							type: 'error'
						});
					});
				}).catch(() => {});
			}
		}
	}
</script>