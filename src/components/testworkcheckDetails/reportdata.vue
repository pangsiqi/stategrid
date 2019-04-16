<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="" :visible.sync="dialogProduct" width="80%" :before-close="handleClose">
		<div class="scrollbar" style="max-height:360px;">
			<div class="el-collapse-item pt10 pr20 pb20" aria-expanded="true" accordion>
				<el-table ref="multipleTable" :data="REPORTList" row-key="ID" border height="260"  @selection-change="SelChange" stripe :fit="true" style="width: 100%;" :default-sort="{prop:'REPORTList', order: 'descending'}">
					<el-table-column type="selection" fixed width="55" align="center"> 
					</el-table-column>
					<el-table-column prop="D_DESC" label="描述" sortable width="220px">
					</el-table-column>
					<el-table-column prop="NUM" label="排序" sortable width="220px">
						<template slot-scope="scope">
							<el-input size="small" v-model="scope.row.NUM"></el-input>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="content-footer">
			<el-button type="primary" @click="submit">确定</el-button>
			<el-button @click="close">取消</el-button>
		</div>
		</el-dialog>
	</div>
</template>

<script>
	import Config from '../../config.js';
	export default {
//	props:["approvingData"],//第一种方式
  name: 'product',
  
  data() {
    return {
		basic_url: Config.dev_url,
		productList: [],
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
		proMenu: [],
		conMenu: [],
		WORKORDER_PROJECTLISTID:[],
        WORKORDER_CONTRACTLISTID:[],
        reportdata:'',//生成报告名称
        dataid:'',//主表id
        REPORTList:[],//表格渲染数据
        PROXYNUM:'',
        WONUM:'',
        DEPTIDDesc:'',
        ID:'',
        selUser:[]//勾选的值
    }
  },

  methods: {
	// toggleSelection() {
	// 	this.$refs.multipleTable.toggleAllSelection();
	// },
	// handleSelectionChange(val) {
	// 	this.multipleSelection = val;
	// },
	selectdata(){
		return false;
	},
    SelChange(val) {
		this.selUser = val;
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
//		        console.log(tab, event);
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
  	visible(value) {
		console.log(value);
        this.dataid = value[0];
        this.reportdata = value[1];
        // var reporttable = value[2];
        this.PROXYNUM = value[3];
        this.WONUM = value[4];
        this.DEPTIDDesc = value[5];
		this.ID = value[6];
		
		this.loading = true;//加载动画打开
		console.log(this.dataid);
		var url = this.basic_url +'/api-apps/app/workorder/operate/templatedata?id='+this.dataid;
		console.log(url);
        this.$axios.get(url,{}).then((res) => {
			this.REPORTList = res.data;
			this.$refs.multipleTable.toggleAllSelection();
        }).catch((err) => {
		});		
		this.dialogProduct = true;
	},
	//Table默认加载数据
	requestData(){
		this.loading = true;//加载动画打开
		console.log(this.dataid);
		var url = this.basic_url +'/api-apps/app/workorder/operate/templatedata?id='+this.dataid;
		console.log(url);
        this.$axios.get(url,{}).then((res) => {
            this.REPORTList = res.data;
        }).catch((err) => {
        });
	},
	proChange(val) {
		this.proMenu = val;
	},
	conChange(val) {
		this.conMenu = val;
    },
	submit(){
		this.$prompt('请输入报告名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        }).then(({ value }) => {
			this.reportname = value;
			if(this.reportname == '' || this.reportname == undefined || this.reportname == null){
				this.$message({
					message: '请输入报告名称',
					type: 'warning'
				});
				return;
			}else {
				this.sortKey(this.selUser,'NUM')
				console.log(this.selUser);
				var ids = '';
				var id = [];
				for(var i = 0;i<this.selUser.length;i++){
					id.push(this.selUser[i].FILEID);
				}
				ids = id.toString(',');
				var url = this.basic_url +"/api-merge/merge/workorder/MergeWord";			
				this.$axios.post(url, {
					"filePath":ids,
					"fileName":this.reportname,
					"proxynum":this.PROXYNUM,
					"wonum":this.WONUM,
					"deptfullname":this.DEPTIDDesc,
					"recordid":this.ID
				}).then((res) => {
					// this.workorderreportid = res.data.datas.id;
					// 
					// console.log()
					// var obj = {
					//     REPORTNUM:res.data.datas.reportnum,
					//     REPORTNAME:res.data.datas.reportname,
					//     // PREVIEW:'',
					//     VERSION:res.data.datas.version,
					// }
					// console.log(obj);
					// this.workorderForm.WORKORDER_REPORTList.push(obj);
					// console.log(this.workorderForm.WORKORDER_REPORTList);
					
					if(res.data.resp_code == 0) {
						this.$message({
							message: '生成成功',
							type: 'success'
						});
						var reportvalue = res.data.datas;
						this.$emit('reportdatavalue',reportvalue);
					}
				}).catch((err) => {
				});
				this.selMenu = [];
				this.dialogProduct = false;
				this.REPORTList = [];
				this.$emit('request');
			}
        }).catch(() => {
       
        });
	},
	sortKey(array,key){
        array.sort(function(a,b){
			var x = a[key];
			var y = b[key];
			return ((x<y)?-1:(x>y)?1:0)
    	})
	}	
  },
  mounted() {
  	
  },
}
</script>

<style>
</style>