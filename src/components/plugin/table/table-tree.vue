<template>
  <div id="app">
   <div class="keep-open btn-group" title="列">
      <el-dropdown :hide-on-click="false" class="pl10 btn btn-default btn-outline">
        <span class="el-dropdown-link">
          <font class="J_tabClose"><i class="icon-menu3"></i></font>
          <i class="el-icon-arrow-down icon-arrow2-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-checkbox-group v-model="checkedName" @change="checkedChange">
            <el-dropdown-item  v-for="item in tableHeader">
              <el-checkbox :label="item.label" name="type"></el-checkbox>
            </el-dropdown-item>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    checkedChange(){
      this.$emit('tableControle',this.checkedName);
    }  
  },
  props: [
      'tableHeader',
      'checkedName'
  ],
}
</script>
<style scope>
  .fixed-table-toolbar .columns{
    width: 120px;
  }
</style>

