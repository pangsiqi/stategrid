<template>
	<div>
		<!-- 检测项目与要求弹出框 Begin -->
		<el-dialog :modal-append-to-body="false" title="检测项目测试与要求" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
			<!-- 高级查询划出 Begin-->
			<div class="pb10">
				<el-form inline-message :model="searchList" label-width="70px">
					<el-row :gutter="10">
						<el-col :span="5">
							<el-form-item label="项目编号" prop="P_NUM">
								<el-input v-model="searchList.P_NUM"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="机构" prop="DEPTID">
								<el-input v-model="searchList.DEPTID" :disabled="true"></el-input>
								<!-- <el-select clearable v-model="searchList.DEPTID" filterable allow-create default-first-option placeholder="请选择">
									<el-option v-for="(data,index) in selectData" :key="index" :value="data.id" :label="data.fullname"></el-option>
								</el-select> -->
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="项目名称" prop="P_NAME">
								<el-input v-model="searchList.P_NAME"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="版本" prop="VERSION">
								<el-input v-model="searchList.VERSION"></el-input>
							</el-form-item>
						</el-col>
						<!-- <el-col :span="3">
							<el-select v-model="searchList.STATUS" placeholder="请选择信息状态">
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
			<!-- 第二层弹出的表格 Begin-->
			<el-table :data="projectList" height="400px" border stripe style="width: 100%;" :default-sort="{prop:'projectList', order: 'descending'}" @selection-change="SelChange" v-loadmore="loadMore">
				<el-table-column type="selection" width="55" fixed>
				</el-table-column>
				<el-table-column label="检验/检测项编号" width="150" sortable prop="P_NUM">
				</el-table-column>
				<el-table-column label="项目名称" width="220" sortable prop="P_NAME">
				</el-table-column>
				<el-table-column label="人员资质" width="180" sortable prop="QUALIFICATION">
				</el-table-column>
				<!-- <el-table-column label="状态" width="100" sortable prop="STATUS" :formatter="judge">
				</el-table-column> -->
				<el-table-column label="领域" width="120" sortable prop="FIELD" >
				</el-table-column>
				<el-table-column label="子领域" width="120" sortable prop="CHILD_FIELD">
				</el-table-column>
				<el-table-column label="版本" width="100" sortable prop="VERSION">
				</el-table-column>
				<el-table-column label="机构" width="180" sortable prop="DEPTIDDesc">
				</el-table-column>
				<!-- <el-table-column label="录入人" width="120" prop="ENTERBY" sortable>
				</el-table-column> -->
				<el-table-column label="录入时间" width="160" prop="ENTERDATE" sortable :formatter="dateFormat">
				</el-table-column>
				<!-- <el-table-column label="修改人" width="120" prop="CHANGEBY" sortable>
				</el-table-column> -->
				<el-table-column label="修改时间" width="160" prop="CHANGEDATE" sortable :formatter="dateFormat">
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
			<!-- 表格 End-->
			<div slot="footer">
				<el-button type="primary" @click="addbasis">确 定</el-button>
				<el-button @click="resetBasisInfo">取 消</el-button>
			</div>
		</el-dialog>
		<!-- 检测项目与要求 End -->
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
        projectList: [],//检测项目与要求
		selectData:[],
		basisnum:'',//检测依据传递过来的请求数据参数
		projectnum:'',//检测依据参数
		projecttable:[],//已选的检测项目
		projectpnums:'',//已选的检测项目拼接的字符串
		PRO_NUM:'',//产品编号
		P_NUM:'',//产品类别编号
        S_NUM:'',//
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
		this.dialogProduct = false;
    },
    projectlead(value){
		// this.PRO_NUM = value.PRO_NUM;//产品编号
		// this.P_NUM = value.P_NUM;//产品类别编号
		// this.S_NUM=value.S_NUM.toString(',');
		// this.projectnum=value.proxypnum;
		// // this.projectnum = value[0];
		// // if(value[1]!=''&&value[1]!=null&&value[1]!=undefined){
		// // 	this.projecttable = value[1];
		// // 	var projectpnum = [];
		// // 	for(var i = 0;i<this.projecttable.length;i++){
		// // 		projectpnum.push(this.projecttable[i].P_NUM);
		// // 	}
		// // 	this.projectpnums = projectpnum.toString(',');
		// // }else{
		// // 	this.projectpnums = '';
		// // }
	    this.searchList.DEPTID=this.$store.state.currentcjdw[0].fullname;
		this.requestData();//渲染数据
		this.dialogVisible = true;
	},
	//检验项目与要求弹出框的确定
    addbasis(){
        var selData = this.selUser;
        if(selData.length == 0) {
            this.$message({
                message: '请选择数据',
                type: 'warning'
            });
            return;
        } else {
            // var changeUser = this.selUser;
            var list = [];
            //basisnum为依据编号的数组
            // var basisnum = [];
			// var basisname = [];
			// var basisid = [];
			// var prover = [];//项目：版本
            // for (var i = 0; i < selData.length; i++) {
            //     basisnum.push(selData[i].P_NUM);
			// 	basisname.push(selData[i].P_NAME);
			// 	basisid.push(selData[i].ID);
			// 	prover.push(selData[i].P_NUM+':'+selData[i].VERSION);
            // }
            //basisnums为basisnum数组用逗号拼接的字符串
            // var basisnums = basisnum.toString(',');
			// var basisnames = basisname.toString(',');
			// var basisids = basisid.toString(',');
			// var provers = prover.toString(',');
            for(var i = 0;i<selData.length;i++){
				selData[i].ID = '';
                list.push(this.selUser[i]);
            }
            this.$emit('testproject',list);
			// this.$emit('testprojectname',basisnames);
			// this.$emit('testprojectnum',basisnums);
			// this.$emit('testprojectid',basisids);
			// this.$emit('testprojectprover',provers);
            this.resetBasisInfo();
        }
	},
	resetBasisInfo(){//重置弹出框相关信息
		this.dialogVisible = false;
		this.resetbtn();//重置高级搜索
		this.projectList = [];//清空表格渲染数据
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
            S_NAME: this.searchList.S_NAME,
            VERSION: this.searchList.VERSION,
            DEPARTMENT: this.searchList.DEPARTMENT,
            RELEASETIME: this.searchList.RELEASETIME,
            STARTETIME: this.searchList.STARTETIME,
            STATUS: this.searchList.STATUS,
            P_NUM: this.searchList.P_NUM,
            DEPTID: this.searchList.DEPTID,
            P_NAME: this.searchList.P_NAME,
            VERSION: this.searchList.VERSION,
            STATUS: this.searchList.STATUS,
		};
		// this.PRO_NUM = value.PRO_NUM;//产品编号
		// this.P_NUM = value.P_NUM;//产品类别编号
		// this.S_NUM=value.S_NUM.toString(',');
	    // var url=this.basic_url +'/api-apps/app/inspectionPro2?S_NUM_where_in='+this.projectnum+'&P_NUM_where_not_in='+this.projectpnums;
		// var url=this.basic_url +'/api-apps/app/inspectionPro2?P_NUM_where_in='+this.projectnum+'&P_NUM_where_not_in='+this.projectpnums;
		var url=this.basic_url +'/api-apps/app/inspectionPro2?PRO_NUM_wheres='+this.PRO_NUM+'&NUM_wheres='+this.P_NUM+'&S_NUM_where_in='+this.S_NUM+'&P_NUM_where_not_in='+this.projectnum;
		this.$axios.get(url,{}).then((res) => {
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
            
            this.projectList = newarr;
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
    },
  },
  mounted() {
        this.requestData();
        this.getCompany();
    },
}
</script>

<style>
</style>