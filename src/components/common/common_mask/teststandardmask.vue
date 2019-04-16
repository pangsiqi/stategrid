<template>
	<div>
		<!-- 检测依据弹出框begin -->
			<el-dialog :modal-append-to-body="false" 
					title="检测依据" 
					:visible.sync="dialogVisible" 
					width="80%" 
					:before-close="handleClose">
				<!-- 高级查询划出 Begin-->
				<div class="pb10">
					<el-form inline-message :model="searchList" label-width="70px">
						<el-row :gutter="10">
							<el-col :span="6">
								<el-form-item label="标准编号" prop="S_NUM">
									<el-input v-model="searchList.S_NUM"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="标准名称" prop="S_NAME">
									<el-input v-model="searchList.S_NAME"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="英文名称" prop="S_ENGNAME">
									<el-input v-model="searchList.S_ENGNAME"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="版本" prop="VERSION">
									<el-input v-model="searchList.VERSION"></el-input>
								</el-form-item>
							</el-col>		
						</el-row>
						<el-row :gutter="10">
							<el-col :span="6">
								<el-form-item label="机构" prop="DEPTID">
									<el-input v-model="searchList.DEPTID" :disabled="true"></el-input>
									<!-- <el-select clearable v-model="searchList.DEPTID" filterable allow-create default-first-option placeholder="请选择">
										<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
									</el-select> -->
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="发布时间" prop="RELEASETIME">
									<el-date-picker style="width: 100%" v-model="searchList.RELEASETIME" type="date" placeholder="发布时间" value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="启用时间" prop="STARTETIME">
									<el-date-picker style="width: 100%" v-model="searchList.STARTETIME" type="date" placeholder="启用时间" value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<!-- <el-col :span="3">
								<el-select style="width: 120%" v-model="searchList.STATUS" placeholder="请选择信息状态">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="发布时间" prop="RELEASETIME">
								<el-date-picker style="width: 100%" v-model="searchList.RELEASETIME" type="date" placeholder="发布时间" value-format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="启用时间" prop="STARTETIME">
								<el-date-picker style="width: 100%" v-model="searchList.STARTETIME" type="date" placeholder="启用时间" value-format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-select style="width: 120%" v-model="searchList.STATUS" placeholder="请选择信息状态">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-col> -->
						<el-col :span="4">
							<el-button type="primary" @click="searchinfo" size="small" style="margin-top:2px">搜索</el-button>
							<el-button type="primary" @click="resetbtn" size="small" style="margin-top:2px; margin-left: 2px">重置</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<!-- 高级查询划出 End-->
			<!-- 第二层弹出的表格 Begin -->
			<el-table :data="standardList" height="400px" border stripe style="width: 100%;" :default-sort="{prop:'standardList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore">
				<el-table-column type="selection" width="55" fixed>
				</el-table-column>
				<el-table-column label="主键编号" width="120" sortable prop="ID">
				</el-table-column>
				<el-table-column label="标准编号" width="120" sortable prop="S_NUM">
				</el-table-column>
				<el-table-column label="标准名称" width="220" sortable prop="S_NAME">
				</el-table-column>
				<el-table-column label="英文名称" width="220" sortable prop="S_ENGNAME">
				</el-table-column>
				<!-- <el-table-column label="英文名称" width="220" sortable prop="S_ENGNAME">
				</el-table-column> -->
				<!-- <el-table-column label="状态" width="100" sortable prop="STATUS">
				</el-table-column> -->
				<el-table-column label="发布时间" width="160" sortable prop="RELEASETIME">
				</el-table-column>
				<el-table-column label="启用时间" width="160" sortable prop="STARTETIME">
				</el-table-column>
				<el-table-column label="版本" width="100" sortable prop="VERSION">
				</el-table-column>
				<el-table-column label="机构" width="180" sortable prop="DEPTIDDesc">
				</el-table-column>
				<!-- <el-table-column label="录入人" width="120" prop="ENTERBY" sortable>
				</el-table-column> -->
				<el-table-column label="录入时间" width="160" prop="ENTERDATE" sortable>
				</el-table-column>
				<!-- <el-table-column label="修改人" width="120" prop="CHANGEBY" sortable>
				</el-table-column> -->
				<el-table-column label="修改时间" width="160" prop="CHANGEDATE" sortable>
				</el-table-column>
			</el-table>
			<el-pagination background class="text-right pt10" @size-change="sizeChange" @current-change="currentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.totalCount">
			</el-pagination>
			<!-- 第二层弹出的表格 End -->
			<div slot="footer">
				<el-button type="primary" @click="addbasis">确 定</el-button>
		       <el-button @click="resetBasisInfo">取 消</el-button>
		    </div>
		</el-dialog>
		<!-- 检测依据弹出框 End -->
	</div>
</template>

<script>
	import Config from '../../../config.js';
	export default {
//	props:["approvingData"],//第一种方式
  name: 'standard',
  
  data() {
    return {
		basic_url: Config.dev_url,
		dialogVisible: false,
		loadSign:true,//加载
		commentArr:{},
		selUser: [],//接勾选的值
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
        },
        searchList: { //点击高级搜索后显示的内容
            S_NUM: '',
            S_NAME: '',
            VERSION: '',
            DEPARTMENT: '',
            RELEASETIME: '',
            STARTETIME: '',
            STATUS: '',
        },
        standardList:[],
		selectData:[],
		PRO_NUM :'',//产品编号
		P_NUM:'',//产品类别编号 
		S_NUM:'',//依据的id
		pronum:'',//产品类别的编号
		basisids:'',//存放勾选过的id逗号拼接的字符串
		productnum:'',//产品的编号
		basistable:[],
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
    //重置
    resetbtn(){
        this.searchList = {
            S_NUM:'',
            S_NAME:'',
            VERSION:'',
            DEPARTMENT:'',
            RELEASETIME:'',
            STARTETIME:'',
            STATUS:'',
            P_NUM:'',
            DEPTID:'',
            P_NAME:'',
            VERSION:'',
            STATUS:'',
        };
    },
    //提出单位
    getCompany() {
        var type = "2";
        var url = this.basic_url + '/api-user/depts/treeByType';
        this.$axios.get(url, {
            params: {
                type: type
            },
        }).then((res) => {
            this.selectData = res.data;
        });
    },
  	//表头居中
	rowClass({ row, rowIndex}) {
	    return 'text-align:center'
	},
	SelChange(val) {
		this.selUser = val;
	},
  	sizeChange(val) {
		this.page.pageSize = val;
		this.requestData();
	},
	currentChange(val) {
		this.page.currentPage = val;
		this.requestData();
	},
  	//点击关闭按钮
	close() {
		this.resetBasisInfo();
	},
	//页面显示
    basislead(value){
		this.PRO_NUM = value.PRO_NUM;//产品编号
		this.P_NUM = value.P_NUM;//产品类别编号
		this.S_NUM=value.S_NUM;
		// if(value[1]!=''&&value[1]!=null&&value[1]!=undefined){
		// 	this.basistable = value[1];//检测依据表格中已有的数据
		// 	var basissnum = [];
		// 	for(var i = 0;i<this.basistable.length;i++){
		// 		basissnum.push(this.basistable[i].S_NUM);
		// 	}
		// 	this.basissnums = basissnum.toString(',');
		// }else{
		// 	this.basissnums = '';
		// }
		this.requestData();//渲染数据
		this.searchList.DEPTID=this.$store.state.currentcjdw[0].fullname;
		this.dialogVisible = true;
    },
    addbasis(){
        var selData = this.selUser;
        if(selData.length == 0) {
            this.$message({
                message: '请选择数据',
                type: 'warning'
            });
            return;
        } else {
            var changeUser = this.selUser;
			var list = [];
			//basisnum为依据编号的数组
            // var basisnum = [];
			// var basisname = [];
			// var prover = [];
            // for (var i = 0; i < changeUser.length; i++) {
			// 	console.log(changeUser[i].S_NUM);
            //     basisnum.push(changeUser[i].S_NUM);
			// 	basisname.push(changeUser[i].S_NAME);	
			// 	prover.push(changeUser[i].S_NUM+':'+changeUser[i].VERSION);			
            // }
			//basisnums为basisnum数组用逗号拼接的字符串
			// var basisnums = basisnum.toString(',');
			// var basisnames = basisname.toString(',');
			// var provers = prover.toString(',');
			// list.push(basisnums);
            for(var i = 0;i<this.selUser.length;i++){
				this.selUser[i].ID = '';
                list.push(this.selUser[i]);
			}
            this.$emit('testbasis',list);
			// this.$emit('testbasisnum',basisnums);
			// this.$emit('testbasisname',basisnames);
			// this.$emit('testbasisprover',provers);
            this.resetBasisInfo();
		}
	},
	resetBasisInfo(){//重置弹出框相关信息
		this.dialogVisible = false;
		this.resetbtn();//重置高级搜索
		this.standardList = [];//清空表格渲染数据
		this.page.currentPage = 1;//页码信息重置
		this.page.pageSize = 10;//页码信息重置
	},
    loadMore () {
	   if (this.loadSign) {
	     this.loadSign = false
	     this.page.currentPage++
	     if (this.page.currentPage > Math.ceil(this.page.totalCount/this.page.pageSize)) {
	       return
	     }
	     setTimeout(() => {
	       this.loadSign = true
	     }, 1000)
	     this.requestData();
	   }
    },
    searchinfo(index) {
        this.page.currentPage = 1;
        this.page.pageSize = 10;
        this.requestData();
	},
	requestData(){
		var data = {
            page: this.page.currentPage,
            limit: this.page.pageSize,
            S_NUM: this.searchList.S_NUM,
            S_NAME: this.searchList.S_NAME,
            S_ENGNAME:this.searchList.S_ENGNAME,
            VERSION: this.searchList.VERSION,
            DEPTID: this.searchList.DEPTID,
            RELEASETIME: this.searchList.RELEASETIME,
            STARTETIME: this.searchList.STARTETIME,
            // STATUS: this.searchList.STATUS,
		};
		// var url = this.basic_url +'/api-apps/app/inspectionSta2?PRO_NUM_wheres='+this.productnum+'&S_NUM_where_not_in='+this.basissnums;
		var url=this.basic_url +'/api-apps/app/inspectionSta2?PRO_NUM_wheres='+this.PRO_NUM+'&NUM_wheres='+this.P_NUM+'&S_NUM_where_not_in='+this.S_NUM;
	   this.$axios.get(url, {}).then((res) => {
            this.page.totalCount = res.data.count;	
            //总的页数
            let totalPage=Math.ceil(this.page.totalCount/this.page.pageSize)
            if(this.page.currentPage >= totalPage){
                    this.loadSign = false
            }else{
                this.loadSign=true
            }
            this.commentArr[this.page.currentPage]=res.data.data
            let newarr=[]
            for(var i = 1; i <= totalPage; i++){
            
                if(typeof(this.commentArr[i])!='undefined' && this.commentArr[i].length>0){
                    
                    for(var j = 0; j < this.commentArr[i].length; j++){
                        newarr.push(this.commentArr[i][j])
                    }
                }
            }
            this.standardList = newarr;
        }).catch((wrong) => {})
	},
	determine(){
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
			this.dialogProduct = false;
			var value=this.selUser[0].PRO_NAME;
			this.$emit('appenddata',value);
			this.requestData();
		}
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
		this.getCompany();
	},
}
</script>

<style>

</style>