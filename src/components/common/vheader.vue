<template>
	<div class="heder clearfix white" style="margin-left: 80px;
    margin-top: -60px;">
        <!-- <router-link :to="{path:'/index'}"><div class="logo"></div></router-link> -->
        <!-- <ul class="nav-head pull-left">
            <li class="current" ><router-link :to="{path:'/index'}">控制台</router-link></li>
        </ul> -->
        <div>
            <!-- <ul class="pull-left">
                <li class="current" > -->
                    <div class="navbarbg pull-left">
                        <span class="navbar-minimalize minimalize-styl-2" @click="min2max()">
                            <img src="../../assets/img/logophone.png" style="    border: 0;
                            vertical-align: middle;
                            width: 137px;
                            height: 32px;
                            padding-left: 20px;
                            margin-top: -9px;"> 
                        </span>
                    </div>
                <!-- </li>
            </ul> -->
            <div class="nav-head pull-right nav-right">
                <span @click="appCenter">
                    <el-badge :value="toDoNumber" :max="99" class="item pt5 mr30">
                        <a class="lingdang">
                            <i class="icon-notice"></i>
                        </a>
                    </el-badge>
                </span>
                <el-dropdown placement="top" trigger="click">
                <span class="el-dropdown-link white">
                    <font class="roles pr10">{{username}}<br>{{GetRolesname}}</font>
                    <font class="pr10">您好</font>
                    <font><img :src="headImgUrl==''? imgUrl:headImgUrl " class="userimg"/></font>
                    <i class="el-icon-arrow-down icon-arrow2-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="scrollbar" style="max-height:300px">
                    <el-dropdown-item v-for="(item,index) in GetRoles" :key="index">
                        <div @click = "clickfun($event)">
                            {{item.name}}
                        </div>
                    </el-dropdown-item>

                    <el-dropdown-item class="border-linet pt10 mt10">
                        <router-link to="/personinfo">
                            <i class="icon-user mr10"></i>个人资料
                        </router-link>
                    </el-dropdown-item>

                    <el-dropdown-item class="border-lineb pb10">
                        <router-link to="/passwordedit">
                            <i class="icon-key mr10"></i>修改密码
                        </router-link>
                    </el-dropdown-item>

                    <el-dropdown-item>
                        <div v-on:click="cleanAll()">
                            <i class="icon-log-out mr10"></i>退出
                        </div>
                    </el-dropdown-item>

                </el-dropdown-menu>
                </el-dropdown>

            </div>
        </div>
    </div>
</template>

<script>
import Config from '../../config.js'
import imgUrl  from '../../assets/img/female.png'

export default {
//  name: 'nav',
    data(){
        return {
            basic_url: Config.dev_url,
            file_url: Config.file_url,
            imgUrl: imgUrl,
            toDoNumber: 0,//获取待办任务数量
            toDoDing: 0,//获取执行中数量
            toDoFinish: 0,//获取已完成数量
            headImgUrl: '',
            username: '',
            nickname: '',
            deptid: '',
            GetRolesname:'',
            GetRoles:[],//获取当前角色
        }
    },
    methods: {
        min2max(){//左侧菜单正常和变小切换
            if($(".navbar-static-side").width()=="220"){
                $(".wrapper").css("padding-left", "220px");
                $(".navs>li").css("margin", "0px 10px");
                this.maxDialog();
            }else if($(".navbar-static-side").width()=="40"){
                $(".wrapper").css("padding-left", "40px");
                $(".navs>li").css("margin", "0");
                this.rebackDialog();
            }
            this.ismin=!this.ismin;
        },
    	cleanAll(){
            this.$router.push({ path: '/',name: 'Login',});
            sessionStorage.clear();
//    		sessionStorage.setItem("",JSON.stringify(this.$store.state))
			this.$store.dispatch('setClickedNavAct',[{
                css: 'icon-user',
                name: '首页',
                url: '/index'}]);
            this.$store.dispatch('setSelectedNavAct',{
                css: 'icon-user',
                name: '首页',
                url: '/index'});
            this.$store.dispatch('setRoleIdAct',null);
            this.$store.dispatch('setNavIdAct',null);
            this.$store.dispatch('setcurrentrolesnameNavAct',null);
    	},
        getData(){//获取当前用户信息
            var url = this.basic_url + '/api-user/users/currentMap';
            this.$axios.get(url, {}).then((res) => {//获取当前用户信息
                    this.username = res.data.username;
                    this.nickname = res.data.nickname;
                    this.userid = res.data.id;
                    this.deptid = res.data.deptid;
                    this.getImgUrl();
            }).catch((err) => {
            });
        },
        getTodoNumber() {//获取当前用户待办任务数
            var url = this.basic_url + '/api-apps/app/flow/flow/todoCounts';
            this.$axios.get(url, {}).then((res) => {
                this.toDoNumber = res.data.datas;
                var url = window.location.href;
                if(url.indexOf('index') != -1){
                    this.$emit('getTodoNum',this.toDoNumber);
                }
            }).catch(error => {
            });
        },
        getTodoDing() {//获取当前用户执行中
            var url = this.basic_url + '/api-apps/app/flow/flow/todoCounts?BizState=2';
            this.$axios.get(url, {}).then((res) => {
                this.toDoDing = res.data.datas;
                var url = window.location.href;
                if(url.indexOf('index') != -1){
                    this.$emit('getTodoDing',this.toDoDing);
                }
            }).catch(error => {
            });
        },
        getTodoFinish() {//获取当前用户已完成
            var url = this.basic_url + '/api-apps/app/flow/flow/todoCounts?BizState=3';
            this.$axios.get(url, {}).then((res) => {
                this.toDoFinish = res.data.datas;
                var url = window.location.href;
                if(url.indexOf('index') != -1){
                    this.$emit('getTodoFinish',this.toDoFinish);
                }
            }).catch(error => {
            });
        },
        getImgUrl(){
            var url = this.file_url + '/file/icon?appname=icon&userid=' + this.userid;
            this.$axios.get(url, {}).then((res) => {
                if(res.data.code==1){
                    this.headImgUrl = res.data.icon;
                }
            }).catch(error => {
            });
        },
       getITEM_Roles() {
            var url = this.basic_url + '/api-user/roles/current';
            this.$axios.get(url, {}).then((res) => {
                this.GetRoles = res.data;
                if(this.$store.state.currentRolesname!=undefined){
                    this.GetRolesname=this.$store.state.currentRolesname
                }else{
                    this.GetRolesname=this.GetRoles[0].name;
                }
                if(res.data!=null&&res.data.length>0){
                    let item = res.data[0];
                }
            }).catch(error => {
            })
        },
		 clickfun(e) {
      		// e.target 是你当前点击的元素
              // e.currentTarget 是你绑定事件的元素
              var item={
        		css: 'icon-user',
                name: '首页',
                url: '/index'};
      	    var content=$.trim(e.target.innerHTML)
              this.GetRolesname=content;
              this.$router.push({path: item.url});
              this.$store.dispatch('setcurrentrolesnameNavAct',content);
      	      var GetRoles=this.GetRoles
      	    for(let i=0;i<GetRoles.length;i++){
      	    	if(GetRoles[i].name==content){
      	    		var roId=this.GetRoles[i].id
                     this.$store.dispatch('setRoleIdAct',roId);
      	    	}
      	    }

    	   this.$emit('clickfun',roId);
      	   this.$store.dispatch('setClickedNavAct',[{
                css: 'icon-user',
                name: '首页',
                url: '/index'}]);
            this.$store.dispatch('setSelectedNavAct',{
                css: 'icon-user',
                name: '首页',
                url: '/index'});
    	},
        appCenter(){
        	var item={
        		css: 'icon-user',
                name: '待办任务',
                url: '/task'};
        	var flag = false;
			for(var i = 0; i < this.$store.state.clickedNavs.length; i++){
				if(item.name == this.$store.state.clickedNavs[i].name){
					flag = true;
				}
			}
			if(!flag){
				this.$store.state.clickedNavs.push(item);
			}
				this.$router.push({path: item.url});
        },
        
    },
    mounted(){
        this.getData();//调用getData
        this.getITEM_Roles();
        this.getTodoNumber();//待办工作
        this.getTodoDing();//执行中
        this.getTodoFinish();//已完成
    }
}
</script>

<style scoped>	
.heder{
    width:95%;
    height:60px;
    background:#02b6a9;
    box-shadow:0px 2px 40px 1px rgba(221,229,252,0.5);
    position: relative;
    z-index: 2000;
}
.hederbg {
    height:60px;
    background: url(../../assets/img/head_rt.png) top right no-repeat;}

.logo{
    background-image:url(../../assets/img/logo-white.png);
    background-repeat: no-repeat;
    background-position: left center;
    width: 195px;
    min-height: 60px;
    float: left;
    position: relative;
    z-index: 998;
    margin-left: 22px;
    background-size: 75%;
}

.nav-head li{
    float: left;
    height:58px;
    font-size:15px;
    line-height:58px;
    padding-left:20px;
    padding-right:20px;
    margin: 0px 10px;
    border-top:2px solid transparent;
}
.nav-head li:hover,.nav-head .current{
    border-top:2px solid #FFF;    
    font-weight:bold;
    color:#FFFFFF;
    background-color:rgba(255,255,255,.1);
}


.nav-right{
    height:36px;
    margin: 10px 20px;
}
.nav-right font { line-height:36px; display: inline-block; vertical-align: middle;}
font.roles { line-height:18px;}

.roles i{
    font-style: normal;;
    display: inline-block;
    padding-right: 5px;
    font-size: 12px;
}
a .userimgs {border:2px solid #DFE5EA;}
a:hover .userimgs {border:2px solid #9153f1;}
.userimgs {width:16px; height:16px; margin-right:9px; border-radius:3px;}

.el-badge { cursor: pointer;}
.lingdang{
    display: inline-block;
} 
.lindang  .icon-notice{
	color:#fff;
}  
.userInfo{
    width: 84px;
    height: 20px;
    font-size: 14px;
    color: #FBFDFF;
    line-height: 37px;
    margin-left: 40px;
    margin-right: 10px;
}
.userimg{
	position: relative;
}
.border-linet {border-top:1px solid #DFE5EA;}
  
.userInfo{
    width:84px;
    height:20px;
    font-size:14px;
    font-weight:400;
    color:rgba(251,253,255,1);
    line-height: 37px;
    
}
.userimg{
    width:40px;
    height:36px;
    background-size: 100%;
    background-repeat: no-repeat;
    border-radius:6px;
}

.icon-order-down{
	position: absolute;
    color: #fff;
    width: 10px;
    height: 6px;
    font-size: 14px;
    left: 50px;
    top: 8px;
}

</style>