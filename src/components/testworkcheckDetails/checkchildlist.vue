<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="" :visible.sync="dialogProduct" width="50%" :before-close="handleClose" >
            <div class="scrollbar" style="max-height:360px;">
                <div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion v-for="item in selectData" :key="item.WONUM">
                    <el-row :gutter="20">
                        <el-col :span="11" class="pull-right pb10">
                            <el-input v-model="item.WONUM" :disabled="true">
								<template slot="prepend">子任务单编号</template>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-table ref="table" :data="item.TEMPLATELiST" row-key="ID" border max-height="360" stripe :fit="true" style="width: 100%;" :default-sort="{prop:'workorderForm.TEMPLATELiST', order: 'descending'}">
                        <el-table-column prop="D_DESC" label="描述" sortable>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer">
                <el-button @click="close">关闭</el-button>
            </div>
		</el-dialog>
	</div>
</template>

<script>
	import Config from '../../config.js';
	export default {
//	props:["approvingData"],//第一种方式
  name: 'checkchildlist',
  
  data() {
    return {
		basic_url: Config.dev_url,
		dialogProduct: false,
		loadSign: true, //鼠标滚动加载数据
		loading: false,//默认加载数据时显示loading动画
		commentArr:{},
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
		},
		DEPTID:'',//当前选择的机构值
        NUM:'',//类别编号
        activeName: 'first', //tabs
        workorderForm:{
            WONUM:'',
            TEMPLATELiST:[]
        },
        selectData:[]
    }
  },

  methods: {
    handleClick(row) {
    },
	handleClose(done) {
		this.$confirm('确认关闭？')
			.then(_ => {
				done();
			})
			.catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
	},
  	dateFormat(row, column) {
		var date = row[column.property];
		if(date == undefined) {
			return "";
		}
		return this.$moment(date).format("YYYY-MM-DD");
    },
    handleClick(tab, event) {
    },
  	//表头居中
	rowClass({ row, rowIndex}) {
	    return 'text-align:center'
	},
  	//表格滚动加载
	loadMore() {
		let up2down = sessionStorage.getItem('up2down');
		if(this.loadSign) {					
			if(up2down=='down'){
				this.page.currentPage++;
				if(this.page.currentPage > Math.ceil(this.page.totalCount / this.page.pageSize)) {
					this.page.currentPage = Math.ceil(this.page.totalCount / this.page.pageSize)
					return false;
				}
				let append_height = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
				if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
					$('.el-table__body-wrapper table').append('<div class="filing" style="height: '+append_height+'px;width: 100%;"></div>');
					sessionStorage.setItem('toBtm','true');
				}
			}else{
				sessionStorage.setItem('toBtm','false');
				this.page.currentPage--;
				if(this.page.currentPage < 1) {
					this.page.currentPage=1;
					return false;
				}
			}
			this.loadSign = false;
			setTimeout(() => {
				this.loadSign = true;
			}, 1000)
			this.requestData();
		}
	},
	//改变页数
	sizeChange(val) {
		this.page.pageSize = val;
		if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
			$('.el-table__body-wrapper table').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
			sessionStorage.setItem('toBtm','true');
		}else{
			sessionStorage.setItem('toBtm','false');
		}
		this.requestData();
	},
	//当前页数
	currentChange(val) {
		this.page.currentPage = val;
		if(this.page.currentPage == Math.ceil(this.page.totalCount / this.page.pageSize)){
			$('.el-table__body-wrapper table').append('<div class="filing" style="height: 800px;width: 100%;"></div>');
			sessionStorage.setItem('toBtm','true');
		}else{
			sessionStorage.setItem('toBtm','false');
		}
		this.requestData();
	},
  	//点击关闭按钮
	close() {
		this.dialogProduct = false;
	},
  	visible(dataid) {
		this.requestData(dataid);
    },
    //查看子任务单
	requestData(dataid){
		var url = this.basic_url + '/api-apps/app/workorder/operate/queryWorkorder?ID='+dataid;
        this.$axios.get(url,{}).then((res) => {
            if(res.data.resp_code == 0) {
                this.selectData = res.data.datas;
                this.dialogProduct = true;
            }else if(res.data.resp_code == 1){
                this.$message({
                    message: res.data.resp_msg,
                    type: 'warning'
                });
                this.dialogProduct = false;
            }
            
        }).catch((err) => {
        });
	},
  },
  mounted() {
  	
	},
}
</script>

<style>
</style>