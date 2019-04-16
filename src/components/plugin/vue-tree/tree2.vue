<template>
  <div id="app">
    <!--<div class="pl10 pr10 pb10 pt10">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    </div>-->
    <div class="left_treebg">
      <div class="p15">
        <!--<el-tree class="filter-tree" :data="data2" node-key="id" show-checkbox draggable indent="22" default-expand-all :props="defaultProps" :render-content="renderContent"></el-tree>-->
         <vue-ztree :list.sync='listData'  :func='nodeClick' :expand='expandClick' show-checkbox draggable>
    </vue-ztree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    
    data() {
      return {
//      filterText: '',
//      data2: [
//      {
//        id: 1,
//        label: '一级 1',
//        className: 'icon-file-normal',
//        children: [{
//          id: 4,
//          label: '二级 1-1',
//          className: 'icon-file-normal',
//          children: [{
//            id: 9,
//            label: '三级 1-1-1',
//            className: 'icon-file-text'
//          }, {
//            id: 29,
//            label: '三级 1-1-2',
//            className: 'icon-file-text'
//          }, {
//            id: 10,
//            label: '三级 1-1-3',
//            className: 'icon-file-normal',
//            children: [{
//              id: 329,
//              label: '四级 1-1-1',
//              className: 'icon-file-text'}, {
//              id: 319,
//              label: '四级 1-1-2',
//              className: 'icon-file-normal',
//              children: [{
//                id: 201,
//                label: '五级 21-1',
//                className: 'icon-file-text'}, {
//                id: 202,
//                label: '五级 21-2',
//                className: 'icon-file-text'}, {
//                id: 204,
//                label: '五级 21-3',
//                className: 'icon-file-normal',
//                children: [{
//                  id: 207,
//                  label: '六级六级六级六级六级六级 33-1',
//                  className: 'icon-file-text'
//                }, {
//                  id: 208,
//                  label: '六级 33-2',
//                  className: 'icon-file-text'
//                }]
//              }, {
//                id: 206,
//                label: '五级 21-4',
//                className: 'icon-file-text'}]
//            }, {
//                id: 207,
//                label: '四级 21-2',
//                className: 'icon-file-text'}]
//          }, {
//                id: 102,
//                label: '三级 21-2',
//                className: 'icon-file-text'}]
//        }, {
//        id: 24,
//        label: '二级 21-1',
//        className: 'icon-file-normal',
//        children: [{
//          id: 27,
//          label: '三级 33-1',
//          className: 'icon-file-text'
//        }, {
//          id: 28,
//          label: '三级 33-2',
//          className: 'icon-file-text'
//        }]
//      }
//        ]
//      }, {
//        id: 2,
//        label: '一级 2',
//        className: 'icon-file-normal',
//        children: [{
//          id: 5,
//          label: '二级 2-1',
//          className: 'icon-file-text'
//        }, {
//          id: 6,
//          label: '二级 2-2',
//          className: 'icon-file-text'
//        }]
//      }, {
//        id: 3,
//        label: '一级 33',
//        className: 'icon-file-normal',
//        children: [{
//          id: 7,
//          label: '二级 33-1',
//          className: 'icon-file-text'
//        }, {
//          id: 8,
//          label: '二级 33-2',
//          className: 'icon-file-text'
//        }]
//      }],
      };
    },
    props: [
        'listData'
    ],
    methods:{
        renderContent(h, { node, data, store }) //自定义Element树菜单显示图标
        {
          return (
            <span>
              <i class={data.className}></i>
              <span>{node.label}</span>
            </span>
          );
        },
        // 点击节点
        nodeClick:function(m){
            if(m.iconClass!='icon-file-text'){
                if( m.iconClass == 'icon-file-normal'){
                    m.iconClass = 'icon-file-open';
                }else{
                    m.iconClass = 'icon-file-normal';
                }
            }
            this.$emit("getTreeId", m);
        },
        expandClick:function(m){
            if(m.iconClass!='icon-file-text'){
                if( m.iconClass == 'icon-file-normal'){
                    m.iconClass = 'icon-file-open';
                }else{
                    m.iconClass = 'icon-file-normal';
                }
            }
            m.isFolder = !m.isFolder; 
        }

    },
}
</script>

<style scope>
.el-tree .el-tree-node__content>.el-tree-node__expand-icon {
  padding: 2px;
}
.el-tree .el-icon-caret-right { 
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


.el-tree .el-icon-caret-right:before {/*图标加号*/
    font-family: 'hxqheam';
    content: "\e967";
    position: absolute;
    z-index: 22;
}
.el-tree .el-icon-caret-right:after {
  content: "";
  width: 10px;
  position: absolute;
  border-bottom: 1px dashed #C7CED6;
  top: 7px;
  right: -4px;
  z-index: 1;
}



.el-tree .el-tree-node__expand-icon.is-leaf,.el-tree .el-tree-node__expand-icon.is-leaf:before {
  border:none;
  background:transparent;
  content: "";
}


.el-tree .el-tree-node__expand-icon.expanded {/*图标加号点击后不旋转，原Element会旋转*/
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}

.el-tree .el-tree-node__expand-icon.expanded:before {/*图标减号*/
    font-family: 'hxqheam';
    content: "\ea23";
}
.el-tree .el-tree-node .icon-file-normal {/*文件夹合并时图标*/
  color: #6585DF;
  font-family: 'hxqheam';
  content: "\e9fa";
  font-size: 20px;
}
.el-tree .el-tree-node.is-expanded>.el-tree-node__content .icon-file-normal:before {/*文件夹打开时图标*/
  font-family: 'hxqheam';
  content: "\e9fb";
}
.el-tree .el-tree-node>.el-tree-node__content .icon-file-text {/*最后子级图标颜色*/
  color: #92BDFF;
}

.el-tree-node [class^="icon-"], .el-tree-node [class*=" icon-"] {margin-right: 5px;}

[role=group].el-tree-node__children,
[role=group].el-tree-node__children [role=group].el-tree-node__children,
[role=group].el-tree-node__children .el-tree-node__content {position: relative;}

[role=group].el-tree-node__children:before,
[role=group].el-tree-node__children [role=group].el-tree-node__children:before,
[role=group].el-tree-node__children .el-tree-node__content:before{
  content: "";
  top: 0px;
  position: absolute;
  width: 9px;
  height: 100%;
  border-right: 1px dashed #C7CED6;
}


[role=group].el-tree-node__children [role=group].el-tree-node__children:before {
  left: 22px;
}

[role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children:before {
  left: 44px;
}

[role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children:before {
  left: 66px;
}

[role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children:before {
  left: 88px;
}

[role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children [role=group].el-tree-node__children:before {
  left: 110px;
}


[role=group].el-tree-node__children .el-tree-node__content:before{
  top:-15px;
}

.el-tree>div[role=treeitem]:nth-last-child(2)>div[role=group]:before,
.el-tree>div[role=treeitem] div[role=treeitem]:nth-last-child(1)>div[role=group]:before
{
  display: none;
}

.p15 {padding:10px 15px;}
</style>
