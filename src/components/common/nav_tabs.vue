<template>
    <div>
        <div class="content-tabs">
            <button class="roll-nav roll-left J_tabLeft"  @click="tabLeft"><i class="icon-previous"></i></button>
            <div class="page-tabs J_menuTabs">
                <div class="page-tabs-content">
                    <span v-for="item in tabs" :class="clickvalue == 'index' ? 'active':'J_menuTab'" @click="indexSelected(item)">首页<i class="icon-close2" @click.stop="closeTab(item, $event)"></i></span>
                    <span v-for="item in tabs" :class="clickvalue == 'person' ? 'active':'J_menuTab'" @click="personSelected('person')">人员新增<i class="icon-close2" @click.stop="closeTab(item, $event)"></i></span>
                    <span v-for="item in tabs" :class="clickvalue == 'dept' ? 'active':'J_menuTab'" @click="deptSelected('dept')">人员变动管理<i class="icon-close2" @click.stop="closeTab(item, $event)"></i></span>
                    <!-- <router-link to="/user_management" class="J_menuTab active" >用户管理 <i class="icon-close2"></i></router-link> -->
                </div>
            </div>
            <div v-if="currentPage === '/index'">
            <button class="roll-nav roll-right J_tabRight" @click="tabRight" style="right:100px;"><i class="icon-next"></i></button>
            <button class="btn-group roll-nav roll-right" style="right:0px;">
                <el-dropdown placement="top" trigger="click">
                  <span class="el-dropdown-link">
                    <font class="pr10 J_tabClose">关闭操作</font>
                    <i class="el-icon-arrow-down icon-arrow2-down"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item class="divider"><span @click="closeSel">关闭当前选项卡</span></el-dropdown-item>
                    <el-dropdown-item class="J_tabCloseAll border-lineb"><span @click="closeAll">关闭全部选项卡</span></el-dropdown-item>
                    <el-dropdown-item class="J_tabCloseOther"><span @click="closeOther">关闭其他选项卡</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </button>
            </div>
            <div v-else>
                <button class="roll-nav roll-right J_tabRight"  @click="tabRight"><i class="icon-next"></i></button>
                <button class="btn-group roll-nav roll-right">
                    <el-dropdown placement="top" trigger="click">
                      <span class="el-dropdown-link">
                        <font class="pr10 J_tabClose">关闭操作</font>
                        <i class="el-icon-arrow-down icon-arrow2-down"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="divider"><span @click="closeSel">关闭当前选项卡</span></el-dropdown-item>
                        <el-dropdown-item class="J_tabCloseAll border-lineb"><span @click="closeAll">关闭全部选项卡</span></el-dropdown-item>
                        <el-dropdown-item class="J_tabCloseOther"><span @click="closeOther">关闭其他选项卡</span></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </button>
                <router-link :to="{path:'/index'}" class="roll-nav roll-right J_tabExit"><i class="icon-back"></i>返回</router-link>
            </div>
           <!--  <a onclick="history.back(-1);return false;" class="roll-nav roll-right J_tabExit"><i class="icon-back"></i>返回</a> -->
        </div>
    </div>
</template>

<script>
import Config from '../../config.js'
export default {
    name: 'nav_tabs',
      data(){
        return {
            basic_url: Config.dev_url,
            tabs: [],
            selectedTab: {},
            clickvalue:'',
            tabsvalue:'',
            currentPage: this.$route.path,//获取URL地址

        }
    },
    methods: {
        tabLeft(){
            var left = $('.page-tabs').offset().left; 
            //tab宽度
            var tabW = $('.page-tabs-content').width();
            //总宽度
            var contentW = $('.content-tabs').width()-240;
           if (left !== 0&&tabW>contentW) {
                $('.page-tabs').offset({
                    left:40
                });
            }
        },

        tabRight(){
            var left = $('.page-tabs').offset().left; 
            //tabs总宽度
            var tabW = $('.page-tabs-content').width();
            //总区域内容宽度
            var contentW = $('.content-tabs').width()-240;
            if(tabW>contentW){
            	var poor=tabW-contentW;
            	$('.page-tabs').offset({
                    left: -poor
                });
            }
        },
        closeTab(tab, event){
            console.log(tab);
            console.log(event);
            if (event) event.preventDefault();
            var _this = this;
            var tabs = _this.tabs;
            if(tabs.length == 1){
                //只有一个选项卡
                _this.$router.push({path: '/index'});
                _this.$store.dispatch('setClickedNavAct',[{
                css: 'icon-user',
                name: '首页',
                url: '/index'}]);
            	_this.$store.dispatch('setSelectedNavAct',{
                css: 'icon-user',
                name: '首页',
                url: '/index'});
            }else{
                var selectedIndex = 0;
                _this.tabs = _this.tabs.filter(function(item,index){
                    if(item.name != tab.name){
                        selectedIndex = index;
                    }
                    return item.name != tab.name;
                });
            
                //关闭当前显示的选项卡
                if(tab.name == _this.selectedTab.name){
                    if(selectedIndex==_this.tabs.length){
                        selectedIndex = 0;
                    }
                    var selTab = _this.tabs[selectedIndex];
                    _this.selectedTab = JSON.parse(JSON.stringify(selTab));
                }
//              sessionStorage.setItem('clickedNav',JSON.stringify({arr:_this.tabs}));
//              sessionStorage.setItem('selectedNav',JSON.stringify(_this.selectedTab));
				this.$store.dispatch('setClickedNavAct',_this.tabs);
				this.$store.dispatch('setSelectedNavAct',_this.selectedTab);
				if(_this.selectedTab.parentId!=-1){
					this.$store.dispatch('setMenuIdAct',_this.selectedTab.parentId);//点击时重新给meunid赋值	
				}else{
					//如果只有一级菜单
					this.$store.dispatch('setMenuIdAct','');
				}
                this.$router.push({path: _this.selectedTab.url});
//              return false;
            }
        },
        closeSel(){
            this.closeTab( this.selectedTab);
        },
        closeAll(){
            this.$store.dispatch('setClickedNavAct',[{
                css: 'icon-user',
                name: '首页',
                url: '/index'}]);
            this.$store.dispatch('setSelectedNavAct',{
                css: 'icon-user',
                name: '首页',
                url: '/index'});
            this.$router.push({path: '/index'});
        },
        closeOther(){
        	var item={
        		css: 'icon-user',
                name: '首页',
                url: '/index'
        	};
        	var flag = false;
            this.tabs = [this.selectedTab];
				if(this.selectedTab.name!="首页"){
					this.tabs.unshift(item);
				}
				this.$store.dispatch('setClickedNavAct',this.tabs);
				this.$router.push({path: item.url});

        },
        showSelected(item){
        	this.selectedTab = item;
        	this.$store.dispatch('setSelectedNavAct',item);
			this.$router.push({path: item.url});
			if(item.parentId!=-1){
				this.$store.dispatch('setMenuIdAct',item.parentId);//点击时重新给meunid赋值	
			}else{
				//如果只有一级菜单
                this.$store.dispatch('setMenuIdAct',item.id);
                
			}
           
        },
        personSelected(item){
            this.clickvalue = item;
            this.$router.push({path: '/personinfo'});
            // this.$store.dispatch('setClickedNavAct',item);
        },
        deptSelected(item){
            this.clickvalue = item;
            this.$router.push({path: '/role_management'});
            // this.$store.dispatch('setClickedNavAct',item);
        },
        showClick(items){
	        this.tabs = this.$store.state.clickedNavs;
	        if(this.$route.path!=this.$store.state.clickedNavs.url){
				for(var i = 0; i < this.tabs.length; i++){
					if(this.$route.path == this.tabs[i].url){
						this.selectedTab = this.tabs[i];
					}
				}
			}else{
				this.selectedTab = items;
			}
        }
    },
    mounted(){
      	this.showClick(this.$store.state.setClickedNav);
//   	this.showSelected(this.$store.state.setSelectedNav);

    },
}
</script>

<style scoped>  
.content-tabs {
    position: relative;
    height: 40px;
    background: #eaedf1;
    line-height: 40px;
    border-bottom: 1px solid #DFE5EA;
    box-shadow:0px 2px 24px 0px rgba(0,0,0,0.04);
    /* margin-right:80px; */
}
.content-tabs button {border-radius: 0px;}
.content-tabs .roll-left {
    left: 0;
    border-right: solid 1px #d1d8de;
}
.content-tabs .roll-nav, .page-tabs-list {
    position: absolute;
    width: 40px;
    height: 39px;
    text-align: center;
    color: #999;
    z-index: 2;
    top: 0;
    margin-left: 10px;
}
.content-tabs button,.roll-right.J_tabExit {
    border: 0;
    height: 37px;
    background:linear-gradient(360deg,rgba(232,236,240,1) 0%,rgba(255,255,255,1) 100%);
}
.page-tabs {
	float: left;
    position: absolute;
    margin-left: 40px;
    height: 39px;
    overflow: hidden;
    width:10000px;
}
.roll-right.J_tabRight {
    right: 140px;
}
.content-tabs .roll-right {
    right: 0;
    border-left: solid 1px #d1d8de;
}
.content-tabs .roll-nav, .page-tabs-list {
    position: absolute;
    width: 40px;
    height: 39px;
    text-align: center;
    z-index: 2;
    top: 0;
    margin-left: 0px;
}
.content-tabs .roll-nav, .page-tabs-list,.roll-right.btn-group button{
    color: #5B6371;
    font-size: 14px;
}
.roll-right.btn-group {
    right: 60px;
    width: 100px;
    padding: 0;
}
.roll-right.btn-group button {
    width: 100px;
}
.roll-right.J_tabExit {
    height: 39px;
    width: 60px;
    
}
.roll-right.J_tabRight {
    right: 160px;
}
.page-tabs-content{
	 float: left;
}
.page-tabs-content span{
    display: block;
    float: left;
    color: #97A3B4;
    background-color: #eaedf1;
    border: solid 1px #d1d8de;
    padding: 0 12px;
    height: 35px;
    margin-top: 8px;
    margin-left: 5px;
    line-height: 35px;
    position: relative;
    cursor: pointer;
    /*width:30000px;*/
}
.page-tabs span.active {
    color: #02b6a9;
    margin-top: 5px;
    background:linear-gradient(360deg,rgba(234,239,243,1) 0%,rgba(255,255,255,1) 100%);
    box-shadow:0px -2px 5px 0px rgba(176,192,237,0.5);
}

.page-tabs span .icon-close2 {
    color: #97A3B4;
    margin-left: 2px;
}
.page-tabs span.active .icon-close2 {
    color: #97A3B4;
}
.page-tabs span:hover {color: #02b6a9;; background-color: #F5F8FB;}
.page-tabs span:hover .icon-close2,.page-tabs span:hover.active .icon-close2{
    color: #f74e57;
}
.page-tabs .J_menuTab{
    border-radius: 4px 4px 0px 0px;
}


</style>