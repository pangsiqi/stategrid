<template>
  <div id="app">
    <el-table :data="tableData" style="width: 96%;margin: 0 auto;" :default-sort="{prop:'tableData', order: 'descending'}" @selection-change="selChange">
      <el-table-column type="selection" width="55" v-if="checkedName.length>0">
      </el-table-column>
      <el-table-column v-for="(item,index) in tableHeader" :label="item.label"  :key="index" sortable :prop="item.prop" v-if="checkedName.indexOf(item.label)!=-1">
      </el-table-column>
    </el-table>
    <el-pagination v-if="this.checkedName.length>0"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="page.totalCount">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data(){
    return{
      tableData:[],
      page: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      selData: []
    }
  },
  methods:{
    sizeChange(val) {
      this.page.pageSize = val;
      this.getData();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getData();
    },
    selChange(val) {
      this.selData = val;
    },
    getData(){
      var data = this.searchData;
      var url = this.url;
      this.$axios.get(url, {
        params: data
      }).then((res) => {
        this.tableData = res.data.data;
        this.page.totalCount = res.data.count;
      }).catch((wrong) => {})
    }
  },
  props: [
    'tableHeader',
    'checkedName',
    'url',
    'searchData'
  ],
  mounted(){
    this.getData();
  }
}
</script>
<style scope>
  .fixed-table-toolbar .columns{
    width: 120px;
  }
</style>

