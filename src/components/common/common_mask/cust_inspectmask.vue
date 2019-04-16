
<template>
<div>
    <el-dialog :modal-append-to-body="false" title="客户" height="400px" :visible.sync="dialogcustom" width="80%" :before-close="handleClose">
    <div class="scrollbar" style="height:380px;">
        <el-form inline-message :model="searchList" label-width="90px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="统一社会信用代码" prop="CODE" label-width="140px">
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
                <el-col :span="2" class="text-center">
                    <el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table ref="table" :header-cell-style="rowClass" :data="customerList" line-center border stripe height="270px" style="width: 100%;" :default-sort="{prop:'customerList', order: 'descending'}"
            v-loadmore="loadMore"
            v-loading="loading"  
            element-loading-text="加载中…"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, 0.9)"
            @selection-change="SelChange">
            <el-table-column type="selection" width="55" fixed align="center">
            </el-table-column>
            <el-table-column label="统一社会信用代码" width="200" sortable prop="CODE">
            </el-table-column>
            <el-table-column label="单位名称" sortable prop="NAME" >
            </el-table-column>
            <el-table-column label="联系地址" sortable prop="CONTACT_ADDRESS">
            </el-table-column>
            <el-table-column label="类型" sortable prop="TYPEDesc">
            </el-table-column>
            <el-table-column label="备注" sortable prop="MEMO" >
            </el-table-column>
        </el-table>
            <el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40,100]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
            </el-pagination>
        </div>
        <div slot="footer">
            <el-button type="primary" @click="determine">确 定</el-button>
            <el-button @click="resetBasisInfo">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
	import Config from '../../../config.js';
	export default {
  name: 'category',
  
  data() {
    return {
		basic_url: Config.dev_url,
		loadSign: true, //鼠标滚动加载数据
		loading: false,//默认加载数据时显示loading动画
		commentArr:{},
		selUser: [],//接勾选的值
		DEPTID:'',//当前选择的机构值
        customerList:[],
        dialogcustom:false,
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
		},
		searchList: {
			NUM:'',
			VERSION:'',
			DEPTID: '',
		},
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
	},
  	
	searchinfo() {
		this.page.currentPage = 1;
		this.page.pageSize = 20;
		this.requestData();
	},
	resetbtn(){
		this.searchList = {
			NUM:'',
			VERSION:'',
			DEPTID: '',
		}
	},
  	//点击关闭按钮
	close() {
		this.dialogcustom = false;
	},
  	visible() {
		this.dialogcustom= true;
		this.requestData();
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
		this.loading = true;
		var data = {
			page: this.page.currentPage,
			limit: this.page.pageSize,
			NUM:this.searchList.NUM,
			TYPE: this.searchList.TYPE,
			VERSION:this.searchList.VERSION,
		};
        var DEPTID=this.$store.state.currentcjdw[0].id;
		var url = this.basic_url + '/api-apps/app/customer?DEPTID_WHERES='+DEPTID+'&TYPE_WHERE_IN=2,3';
		console.log(url);
		this.$axios.get(url, {
			params: data
		}).then((res) => {
            console.log(res);
			this.page.totalCount = res.data.count;
			//总的页数
			let totalPage = Math.ceil(this.page.totalCount / this.page.pageSize)
			if(this.page.currentPage >= totalPage) {
				this.loadSign = false
			} else {
				this.loadSign = true
			}
			// this.commentArr[this.page.currentPage] = res.data.data
			// let newarr = []
			// for(var i = 1; i <= totalPage; i++) {
			// 	if(typeof(this.commentArr[i]) != 'undefined' && this.commentArr[i].length > 0) {
			// 		for(var j = 0; j < this.commentArr[i].length; j++) {
			// 			newarr.push(this.commentArr[i][j])
			// 		}
			// 	}
			// }
			this.customerList = res.data.data;
			this.loading = false;//加载动画关闭
			if($('.el-table__body-wrapper table').find('.filing').length>0 && this.page.currentPage < totalPage){
				$('.el-table__body-wrapper table').find('.filing').remove();
			}//滚动加载数据判断filing
		}).catch((wrong) => {
			// this.$message({
			// 	message: '网络错误，请重试1',
			// 	type: 'error'
			// });
		})
	},
	determine(){
        console.log(this.$store.state.currentcjdw[0]);
		var selData = this.selUser;
        if(selData.length == 0) {
            this.$message({
                message: '请选择数据',
                type: 'warning'
            });
            return;
        } else {
            var list = [];
            var VENDORDesc = [];//分包方名称
            var VENDOR= [];//分包方id
            var DEPTTYPE=[];//机构属性
            for (var i = 0; i < selData.length; i++) {
                VENDORDesc.push(selData[i].NAME);
				VENDOR.push(this.$store.state.currentcjdw[0].id);
				DEPTTYPE.push(1);
				
            }
                console.log(VENDORDesc);
                console.log(VENDOR);
                console.log(DEPTTYPE);
            //basisnums为basisnum数组用逗号拼接的字符串///////////
            // var VENDORDescs = VENDORDesc.toString(',');
            // console.log(VENDORDescs);
            // console.log(111111);
            // var VENDORs = VENDOR.toString(',');
            // console.log(VENDORs);
            // var DEPTTYPEs = DEPTTYPEs.toString(',');
            // console.log(DEPTTYPEs)            
            // for(var i = 0;i<selData.length;i++){
			// 	selData[i].ID = '';
            //     list.push(selData[i]);
			// }
			list.push(selData);
            console.log(list);
            this.$emit('cusinspect',list);
            
            // this.$emit('VENDORDescs',VENDORDescs);
            // console.log(1222222);
            // console.log(VENDORDescs);
			// this.$emit('VENDORs',VENDORs);
			// this.$emit('DEPTTYPEs',DEPTTYPEs);
            this.resetBasisInfo();
        }
    },
    
    resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
        this.dialogcustom = false;//关闭弹出框
        this.customerList = [];//列表数据置空
        this.page.currentPage = 1;//页码重新传值
        this.page.pageSize = 20;//页码重新传值
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
                this.resetBasisInfo();
            })
            .catch(_ => {
				console.log('取消关闭');
				$('.v-modal').hide();
			});
    }
  },
  mounted() {
		// this.requestData();
	},
}
</script>