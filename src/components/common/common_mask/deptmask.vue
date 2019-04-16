<template>
	<div>
		<el-dialog :modal-append-to-body="false" title="" height="400px" :visible.sync="dialogCategory" width="80%" :before-close="handleClose">
			<tree_grid :columns="columns" :tree-structure="true" :data-source="deptList" v-on:classByValue="childByValue" v-loading="loading" 
                element-loading-text="加载中…"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.9)"></tree_grid>
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
                <el-button type="primary" @click="determine">确 定</el-button>
                <el-button @click="resetBasisInfo">取 消</el-button>
            </div>
		</el-dialog>
	</div>
</template>

<script>
	import Config from '../../../config.js';
    import tree_grid from '../TreeGrid.vue'//树表格
	export default {
    name: 'category',
    components: {
        'tree_grid':tree_grid,
    },
  
  data() {
    return {
		basic_url: Config.dev_url,
		productList: [],
        loading: false,
		loadSign:true,//加载
		commentArr:{},
		selUser: [],//接勾选的值
		DEPTID:'',//当前选择的机构值
        categoryList:[],
        dialogCategory:false,
		page: {
			currentPage: 1,
			pageSize: 20,
			totalCount: 0
        },
        deptList:[],
        columns: [
            {
                text: '机构名称',
                dataIndex: 'fullname',
                isShow:true,
            },
            {
                text: '机构编码',
                dataIndex: 'code',
                isShow:true,
            },
            {
                text: '上级机构',
                dataIndex: 'parent',
                isShow:true,
            },
            {
                text: '机构属性',
                dataIndex: 'depttypeName',
                isShow:true,
            },
            {
                text: '负责人',
                dataIndex: 'leader',
                isShow:true,
            },
            {
                text: '版本',
                dataIndex: 'version',
                isShow:true,
            },
            {
                text: '备注',
                dataIndex: 'tips',
                isShow:true,
            },
        ],
    }
  },

  methods: {
    //表格传过来
    childByValue: function (childValue) {
        // childValue就是子组件传过来的
        this.selUser = childValue
    },
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
  	sizeChange(val) {
		this.page.pageSize = val;
		this.requestData();
	},
	currentChange(val) {
		this.page.currentPage = val;
		this.requestData();
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
		this.dialogCategory = false;
	},
  	visible() {
		// this.DEPTID = DEPTID;
		this.dialogCategory = true;
		this.requestData();
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
	requestData() {//高级查询字段
        this.loading = true;
        var url = this.basic_url + '/api-user/depts/treeMapAll';
        this.$axios.get(url, {}).then((res) => {
            let result=res.data
            for(let i=0;i<result.length;i++){
                if(typeof(result[i].subDepts)!="undefined"&&result[i].subDepts.length>0){
                    let subDepts=result[i].subDepts;
                    result[i].children=subDepts;
                }	
            }
            this.deptList = result;
            this.loading = false;
//			this.page.totalCount = res.data.count;
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
			// this.dialogCategory = false;
			var proarr = [];
			proarr.push(this.selUser[0].id);
            proarr.push(this.selUser[0].fullname);
            proarr.push(this.selUser[0].depttype);
			proarr.push(this.selUser[0].depttypeName);
			this.$emit('deptdata',proarr);
			this.requestData();
            this.resetBasisInfo();//调用resetBasisInfo函数
		}
    },
    resetBasisInfo(){//点击确定或取消按钮时重置数据20190303
        this.dialogCategory = false;//关闭弹出框
        this.deptList = [];//列表数据置空
        this.page.currentPage = 1;//页码重新传值
        this.page.pageSize = 10;//页码重新传值
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
		this.requestData();
	},
}
</script>

<style>
</style>