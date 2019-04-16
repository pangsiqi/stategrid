<template>
  <el-table
    :data="data"
    style="width: 100%;"
    ref="table"
    :row-style="showTr" 
    border 
    stripe 
    highlight-current-row
    @current-change="singleTable"
    :header-cell-style="rowClass" 
    :height="fullHeight" 
    @selection-change="SelChange">
    <el-table-column type="selection" width="55" fixed align="center">
		</el-table-column>
    <el-table-column label="序号" type="index" width="55">
    </el-table-column>
    <el-table-column v-for="(column, index) in columns" :width="column.width" :dataType="column.dataType" :key="column.dataIndex"
      :label="column.text" :formatter="dateFormat" v-if="column.isShow && column.dataIndex != 'version'">
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <span v-if="toggleIconShow(index,scope.row)" class="button is-outlined is-primary is-small" @click="toggle(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
        </span>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        <span v-if="index===0" title="点击查看详情" class="blue" @click="view(scope.row)">{{scope.row[column.dataIndex]}}</span>  
        <span v-else>{{scope.row[column.dataIndex]}}</span>
      </template>
    </el-table-column>

    <el-table-column v-for="(column, index) in columns" :width="column.width" :dataType="column.dataType" :key="column.dataIndex"
      :label="column.text" :formatter="dateFormat" v-if="column.isShow && column.dataIndex == 'version'" align="right">
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <span v-if="toggleIconShow(index,scope.row)" class="button is-outlined is-primary is-small" @click="toggle(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
        </span>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        <span v-if="index===0" @click="view(scope.row)">{{scope.row[column.dataIndex]}}</span>
        <span v-else>{{scope.row[column.dataIndex]}}</span>          
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import Utils from '../../assets/js/index.js'
  import deliver from '../../assets/js/deliver.js'
  export default {
    name: 'tree-grid',
    props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
// 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
      checkedName: {
        type: Array,
        default: function () {
          return []
        }
      }, 
// 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return true;
        }
      }
    },
    data () {
      return {
        fullHeight: document.documentElement.clientHeight - 210+'px',//获取浏览器高度
        selData: [],
        isshift: false,
        isctrl: false,
      }
    },
    computed: {
    // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll);
          return data;
        }
        return me.dataSource;
      }
    },
    methods: {
      singleTable(row){
        if(this.isctrl){
          this.$refs.table.toggleRowSelection(row);
          console.log(this.$refs.table.toggleRowSelection(row));
        }else if(this.isshift){
          var selData = this.selData;
          var list = this.list;
          var minIndex = 0;
          var maxIndex = 0;
          var clickIndex = 0;
          var selIndex = [];
          var dataProp = (this.appName=='report'||this.appName=='reportFile'||this.appName=='flow' )?'id':'ID';
          for(var i=0; i<selData.length; i++){
            list.forEach(function(item, index){
              if(item[dataProp] == selData[i][dataProp]){
                selIndex.push(index);
                if(i==0){
                  minIndex = index;
                  maxIndex = index;
                }else{
                  minIndex = index<minIndex ? index:minIndex; 
                  maxIndex = index>maxIndex ? index:maxIndex; 
                }
              }
              if(item[dataProp] == row[dataProp]){
                clickIndex = index;
              }
            }); 
          }
          var min = 0;
          var max = 0;
          if(clickIndex < minIndex){
            min = clickIndex;
            max = maxIndex;
          }else if(clickIndex > maxIndex){
            min = minIndex;
            max = clickIndex;
          }else{
            min = minIndex;
            max = clickIndex;
          }
          selIndex.forEach((item)=>{
            this.$refs.table.toggleRowSelection(list[item]);
          });
          for(var m=min; m<=max; m++){
            this.$refs.table.toggleRowSelection(list[m]);
          }
        }else{
          this.$refs.table.clearSelection();
          this.$refs.table.toggleRowSelection(row);
        }
      },
      eventBind(){
        var that = this;
        document.onkeydown = function(e) { //按下键盘      
        switch (e.keyCode) {        
          case 16:           
            that.isshift = true;     
            break;         
          case 17:          
            that.isctrl = true;        
            break;     
          }     
        };    
        document.onkeyup = function(e) { //放弃键盘   
          switch (e.keyCode) {      
            case 16:           
              that.isshift = false;      
              break;        
            case 17:         
              that.isctrl = false;     
              break;       
          }  
        }   
      },
      //表头居中
      rowClass({ row, rowIndex}) {
        return 'text-align:center'
      },
    	//改变的值
    	SelChange(val) {
				this.selData = val;
				//子给父传值
				// childByValue是在父组件on监听的方法
        // 第二个参数this.childValuedata是需要传的值
        this.$emit('classByValue', val);
			},
      // 显示行
      showTr: function (row, index) {
        let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
        row.row._show = show
        return show ? '' : 'display:none;'
      },

      // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
      view: function (data) {
         this.$emit('getDetail', data);
      },
      // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
      // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      //时间格式化  
			dateFormat(row, column) {
				var date = row[column.property];
				if(date == undefined) {
					return "";
				}
				return this.$moment(date).format("YYYY-MM-DD");
			},
    },
    mounted(){
      this.eventBind();
    }
  }
</script>
<style scoped>
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
</style>
