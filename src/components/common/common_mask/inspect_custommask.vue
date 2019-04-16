<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="客户单位列表" :visible.sync="dialogCustomer" width="80%">
			<el-form inline-message :model="searchList" label-width="70px">
				<el-row :gutter="10">
					<el-col :span="5">
						<el-form-item label="统一社会信用代码" prop="CODE" label-width="100px">
							<el-input v-model="searchList.CODE">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="单位名称" prop="NAME">
							<el-input v-model="searchList.NAME">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="联系地址" prop="CONTACT_ADDRESS">
							<el-input v-model="searchList.CONTACT_ADDRESS">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="2">
						<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table ref="table" :header-cell-style="rowClass" :data="customerList" line-center border stripe height="360px" style="width: 100%;" :default-sort="{prop:'customerList', order: 'descending'}"
				v-loadmore="loadMore"
				v-loading="loading"  
				element-loading-text="加载中…"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(255, 255, 255, 0.9)"
				@selection-change="SelChange">
				<el-table-column type="selection" width="55" fixed align="center">
				</el-table-column>
				<el-table-column label="统一社会信用代码" width="200" sortable prop="customercode">
				</el-table-column>
				<el-table-column label="单位名称" sortable prop="customername" >
				</el-table-column>
				<el-table-column label="联系地址" sortable prop="customeraddress">
				</el-table-column>
				<el-table-column label="样品编号" sortable prop="itemnum">
				</el-table-column>
				<el-table-column label="接样日期" sortable prop="itemrecdate">
				</el-table-column>
			</el-table>
				<el-pagination background class="text-right pt10"
				@size-change="sizeChange"
				@current-change="currentChange"
				:current-page="page.currentPage"
				:page-sizes="[10, 20, 30, 40]"
				:page-size="page.pageSize"
				layout="total, sizes, prev, pager, next"
				:total="page.totalCount">
			</el-pagination>
				<div slot="footer">
			       <el-button type="primary" @click="determine">确 定</el-button>
			       <el-button @click="resetBasisInfo()">取 消</el-button>
			    </div>
			</el-dialog>
	</div>
</template>

<script>
	import Config from '../../../config.js';
	import { Loading } from 'element-ui'
	export default {
 		 name: 'customer',
  
	data() {
		return {
			basic_url: Config.dev_url,
			loadSign: true, //鼠标滚动加载数据
			loading: false,//默认加载数据时显示loading动画
			customerList: [],
			dialogCustomer: false,
			commentArr:{},
			selUser: [],//接勾选的值
			type:'',
			searchList: {
				NAME: '',
				CODE: '',
				CONTACT_ADDRESS: '',
			},
			page: {
				currentPage: 1,
				pageSize: 20,
				totalCount: 0
			},

			selkeys: [],
		}
	},

  methods: {
  	dateFormat(row, column) {
		var date = row[column.property];
		if(date == undefined) {
			return "";
		}
		return this.$moment(date).format("YYYY-MM-DD");
	},
  	//表头居中
	rowClass({ row, rowIndex}) {
	    return 'text-align:center'
	},
	SelChange(val) {
		this.selUser = val;
		var _this = this;
		//处理分页时，分页记忆失去之前数据，500必须大于setSelectRow的时间
		setTimeout(function(){
			_this.changePageCoreRecordData();
		},800);
	},
  	
	searchinfo() {
		this.page.currentPage = 1;
		this.page.pageSize = 20;
		this.requestData();
	},
  	//点击关闭按钮
	close() {
		this.dialogCustomer = false;
	},
	visible() {
		this.requestData();
		this.dialogCustomer = true;
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
	//Table默认加载数据
	requestData(){	
		this.loading = true;//加载动画打开
		var data = {
			page: this.page.currentPage,
			limit: this.page.pageSize,
			DEPTID:this.$store.state.currentcjdw[0].id,
			// NAME: this.searchList.NAME,
			// CODE: this.searchList.CODE,
			// CONTACT_ADDRESS: this.searchList.CONTACT_ADDRESS,
		};
		var url = this.basic_url + '/api-apps/app/inspectPro/operate/proxycustomer';//如果父组件没有传CJDW承检单位侧显示所有数
		this.$axios.get(url, {params: data}).then((res) => {
			this.page.totalCount = res.data.count;	
			//总的页数
			let totalPage=Math.ceil(this.page.totalCount/this.page.pageSize)
			if(this.page.currentPage >= totalPage){
				 this.loadSign = false
			}else{
				this.loadSign=true
			}
			this.customerList = res.data.data;
			// setTimeout(()=>{
			// 	this.setSelectRow();
			// }, 200)
			this.loading = false;//加载动画关闭
			if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
				$('.el-table__body-wrapper table').find('.filing').remove();
			}//滚动加载数据判断filing
		}).catch((wrong) => {
			// 	this.$message({
			// 	message: '网络错误，请重试',
			// 	type: 'erro'
			// });
		})
	},
	determine(){
		console.log(this.selUser[0]);
		if(this.selUser.length == 0){
			this.$message({
				message: '请选择数据',
				type: 'warning'
			});
		}else if(this.selUser.length > 1){
			this.$message({
				message: '不可同时选择多条数据',
				type: 'warning'
			});
		}else{

				var name=this.selUser[0].customername;//名称
				var address=this.selUser[0].customeraddress;//地址 
				var id=this.selUser[0].ID;
				var itemid=this.selUser[0].itemid;
				var itemnum=this.selUser[0].itemnum;
				var customarr=[];
				customarr.push(this.selUser[0].customerid);//委托单位id
				customarr.push(this.selUser[0].customername);//委托单位名称
				customarr.push(this.selUser[0].customeraddress);//地址
				customarr.push(this.selUser[0].customerzipcode);//邮编
				customarr.push(this.selUser[0].customercode);//信用代码
				customarr.push(this.selUser[0].depttype);//中心内（中心外）
				customarr.push(this.selUser[0].customername);
				this.$emit('customarr',customarr);
				if(this.selUser[0].customername==null||this.selUser[0].customername==undefined){
						customarr.push(falg);
				}
				// var code=this.selUser[0].CODE;//统一社会信用代码
				// this.$emit('customname',name);//传到主页面
				// this.$emit('customadd',address);//传到主页面
				// if(this.selUser[0]!=null){
				// 	var vendor=[];
				// 	if(this.selUser[0].depttype==1){
				// 		vendor.push(this.selUser[0].depttype);
				// 		this.$emit('vendor',vendor);
				// 	}else{
				// 		vendor.push(this.selUser[0].depttype);
				// 		this.$emit('vendor',vendor);
				// 	}
				// }
				//样品模块赋值
				console.log(this.selUser[0].itemid);
				if(this.selUser[0].itemid!=null&&this.selUser[0].itemid!=undefined&&this.selUser[0].itemid!=''){
						var url=this.basic_url + '/api-apps/app/item/' + itemid;
						this.$axios.get(url, {}).then((res) => {
							var custarr = [];
								custarr.push(res.data.P_NAME);//生产单位
								custarr.push(res.data.DESCRIPTION);//样品名称
								custarr.push(res.data.ID);//样品id
								custarr.push(res.data.ITEMNUM);//样品数量
								custarr.push(res.data.MODEL);//型号
								custarr.push(res.data.QUATITY);//质量
								custarr.push(res.data.PRODUCT);//产品名称
								custarr.push(res.data.PRODUCT_TYPE);//产品类别
								custarr.push(res.data.PRO_NUM);//产品编号
								custarr.push(res.data.PRO_VERSION);//产品版本
								custarr.push(res.data.P_NUM);//产品类别编号
								custarr.push(res.data.P_VERSION);//产品类别版本
								custarr.push(res.data.P_NAME);//生产单位名称id
								custarr.push(res.data.P_NAMEDesc);//生产单位名称name
								this.$emit('custarr',custarr);
						});
				}else{
					console.log(this.selUser[0].itemid);
							var custarr = [];
							custarr.push('falg');
							this.$emit('custarr',custarr);
				}
				
			this.dialogCustomer = false;
			// this.requestData();
			// this.resetBasisInfo();//调用resetBasisInfo函数
		}
	},
    resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
        this.dialogCustomer = false;//关闭弹出框
        // this.customerList = [];//列表数据置空
        this.page.currentPage = 1;//页码重新传值
        this.page.pageSize = 10;//页码重新传值
	},
	//table记忆
	changePageCoreRecordData () {
		let idKey = 'ID';
		let that = this;
		if (this.selkeys.length <= 0) {
			this.selkeys = this.selUser;
			return;
		}
		let selectAllIds = [];
		this.selkeys.forEach(row=>{
			selectAllIds.push(row[idKey]);
		})
		let selectIds = [];
		this.selUser.forEach(row=>{
			selectIds.push(row[idKey]);
			if (selectAllIds.indexOf(row[idKey]) < 0) {
				that.selkeys.push(row);
			}
		})
		let noSelectIds = [];
		this.customerList.forEach(row=>{
			if (selectIds.indexOf(row[idKey]) < 0) {
				noSelectIds.push(row[idKey]);
			}
		})
		noSelectIds.forEach(id=>{
			if (selectAllIds.indexOf(id) >= 0) {
				for(let i = 0; i< that.selkeys.length; i ++) {
					if (that.selkeys[i][idKey] == id) {
						that.selkeys.splice(i, 1);
						break;
					}
				}
			}
		})
	},
	//设置选中值
	setSelectRow() {
		if (!this.selkeys || this.selkeys.length <= 0) {
			return;
		}
		let idKey = 'ID';
		let selectAllIds = [];
		let that = this;
		this.selkeys.forEach(row=>{
			selectAllIds.push(row[idKey]);
		})
		this.$refs.table.clearSelection();
		for(var i = 0; i < this.customerList.length; i++) {                    
			if (selectAllIds.indexOf(this.customerList[i][idKey]) >= 0) {
				this.$refs.table.toggleRowSelection(this.customerList[i], true);
			}
		}
	},
	},
    mounted() {
		this.requestData();
	},
}
</script>

<style>
</style>