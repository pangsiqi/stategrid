<template>
  <div id="app">
    <div style='width:280px;'>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>

    <el-tree class="filter-tree" :data="data2" node-key="id" draggable show-checkbox default-expand-all :props="defaultProps" @node-click="handleNodeClick" :render-content="renderContent"></el-tree>

    </div>
  </div>
</template>

<script>
export default {

    methods:{
        renderContent(h, { node, data, store }) //自定义Element树菜单显示图标
        {
          return (
            <span>
              <i class={data.className}></i>
              <span>{node.label}</span>
            </span>
          );
        }
    },
    data() {
      return {
        filterText: '',
        data2: [{
          id: 1,
          label: '一级 1',
          className: 'icon-file-normal',
          children: [{
            id: 4,
            label: '二级 1-1',
            className: 'icon-file-normal',
            children: [{
              id: 9,
              label: '三级 1-1-1',
              className: 'icon-file-text'
            }, {
              id: 10,
              label: '三级 1-1-2',
              className: 'icon-file-text'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    props: [
        'listData'
    ],
}
</script>

<style scope>
.el-tree-node__content>.el-tree-node__expand-icon {
  padding: 2px;
}
.el-icon-caret-right { 
  font-size: 10px;
  width: 17px;
  height: 17px;
  line-height:12px;
  font-weight: lighter;
  background: #FFF;
  color: #A2ABBF;
  border:1px solid #A2ABBF;
  border-radius: 3px;
  margin-top: -2px;
  margin-right: 5px;
  position: relative;
  z-index: 30;
}
.el-tree-node__expand-icon.is-leaf {
  border:none;
  background:transparent;
}

.el-icon-caret-right:before {/*图标加号*/
    font-family: 'hxqheam';
    content: "\e967";
    position: absolute;
    z-index: 22;
}
.el-icon-caret-right:after {
  content: "";
  width: 10px;
  position: absolute;
  border-bottom: 1px dashed #C7CED6;
  top: 7px;
  right: -4px;
  z-index: 1;
}




.el-tree-node__expand-icon.expanded {/*图标加号点击后不旋转，原Element会旋转*/
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}

.el-tree-node__expand-icon.expanded:before {/*图标减号*/
    font-family: 'hxqheam';
    content: "\ea23";
}
.el-tree-node .icon-file-normal {/*文件夹合并时图标*/
  color: #6585DF;
  font-family: 'hxqheam';
  content: "\e9fa";
  font-size: 18px;
}
.el-tree-node.is-expanded>.el-tree-node__content .icon-file-normal:before {/*文件夹打开时图标*/
  font-family: 'hxqheam';
  content: "\e9fb";
}
.el-tree-node>.el-tree-node__content .icon-file-text {/*最后子级图标颜色*/
  color: #92BDFF;
}

.el-tree-node [class^="icon-"], .el-tree-node [class*=" icon-"] {margin-right: 5px;}
.el-tree-node__content {
  position: relative;
  z-index: 33;
}
.el-tree-node .el-tree-node__content:after,.el-tree-node .el-tree-node__children:after {
  content: "";
  position: absolute;
  z-index: 1;
  top: 5px;
  border-left: 1px dashed #C7CED6;
  height: 100%;
  margin-left: 8px;
}

.el-tree-node__children .el-tree-node__children:after {margin-left: 30px;}

div.el-tree-node:last-child .el-tree-node__children:after {border:none;}
</style>
