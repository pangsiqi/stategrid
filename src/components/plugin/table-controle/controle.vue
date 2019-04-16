<template>
   <div class="keep-open btn-group" title="显示隐藏列">
      <el-dropdown :hide-on-click="false" class="btn btn-default btn-outline">
        <span class="el-dropdown-link">
          <font class="J_tabClose"><i class="icon-menu3"></i></font>
          <i class="icon-arrow2-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-checkbox-group v-model="checkedName" @change="checkedChange">
            <el-dropdown-item  v-for="(item,index) in tableHeader" :key="index">
              <el-checkbox :label="item.label" name="type"></el-checkbox>
            </el-dropdown-item>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
</template>

<script>
export default {
  props: [
      'tableHeader',
      'checkedName'
  ],
  methods:{
    checkedChange(){
      this.$emit('tableControle',this.checkedName);
    }  
  }
}
</script>
<style scope>
  .fixed-table-toolbar .columns{
    width: 100px;
  }
</style>

