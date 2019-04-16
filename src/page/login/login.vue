<template>
<div id="login">
    <div class="centerDiv">
        <div class="contmain">
            <div class="left-img"></div> 
            <div class="middle-box loginscreen">
                <div class="logo"></div>
                <div class="login_box">
                    <font>用户登录</font>
                    <form class="login_form" ref="loginForm" :model="userinfo" method="post" autocomplete="off">
                        
                        <div class="input-group">
                            <input type="text" id="username" placeholder="用户名" v-model="userinfo.username" @blur="blur1()">
                            <div class="bottom-line"></div>
                            <span v-show="null1" class="wrong">{{ername}}</span>
                        </div>

                        <div class="input-group">
                            <input type="password" id="password" placeholder="密码" v-model="userinfo.password" @blur="blur2()" @keyup.enter="login">
                            <div class="bottom-line"></div>
                            <span v-show="null2" class="wrong">{{erpass}}</span>
                        </div>
                        
                        <div class="input-group">
                            <div class="pull-left remember">
                                <el-checkbox>记住密码</el-checkbox>
                            </div>
                            
                            <div class="pull-right forget"><a href="#">忘记密码？</a></div>
                        </div>
                        
                        <div class="input-group">
                            <button type="button" class="btn-login" @click="login">登 录</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="hiddenDiv"></div>

    <div class="footer-content">Copyright &#169 中铁检验认证中心 All Rights Reserved.</div>
</div>
</template>

<script>
    import Config from '../../config.js'
    import qs from "qs"
    export default {
        name: 'login',
        //记住密码
        data () {
            return {
                msg: 'EAM2.0',
                ername:"",
                erpass:"",
                null1:false,
                null2:false,
                userinfo:{},
                basic_url: Config.dev_url
            }
        },
        methods: {
            login() {
                sessionStorage.clear();
                this.$store.dispatch('setRoleIdAct',null);
                this.$store.dispatch('setNavIdAct',null);
                this.$store.dispatch('setcurrentrolesnameNavAct',null);
                var url = this.basic_url + '/api-auth/oauth/token?grant_type=password&scope=app&client_id=webApp&client_secret=webApp&username=' 
                        + this.userinfo.username   
                        + '&password=' 
                        + this.userinfo.password;

                 this.$axios({
                    method:"post",
                    url: url,
                  }).then((res)=>{
                        if(res.data.access_token){
                            sessionStorage.setItem('access_token',res.data.access_token);
                            sessionStorage.setItem('expires_in',res.data.expires_in);
                            sessionStorage.setItem('refresh_token',res.data.refresh_token);
                            this.$router.push('/index')
                        }
                  }).catch((res) => {
                      this.$message({
                            message:res.resp_msg,
                            type: 'warning'
                        });
                  })
             }, 
             blur1(){
                if (this.userinfo.username == '') {
                    this.ername = "必填信息";
                    this.null1 = true;
                }else{
                    this.null1 = false;
                }
                // else if(this.userinfo.username == 'admin'){
                //     this.ername = "正确";
                //     this.a = true;
                //     this.b = false;
                // }else{
                //     this.ername = "用户名错误";
                //     this.a = false;
                //     this.b = true;
                // }
             }, 
             blur2(){
                if (this.userinfo.password == '') {
                    this.erpass = "必填信息";
                    this.null2 = true;
                }else{
                    this.null2 = false;
                }
                // else if(this.userinfo.password == 'admin'){
                //     this.erpass = "正确";
                //     this.c = true;
                //     this.d = false;
                // }else{
                //     this.erpass = "密码错误";
                //     this.c = false;
                //     this.d = true;
                // }
             }      
        },
    }
</script>

<style scoped>
  @import './login.css';
  .el-checkbox, .el-radio {
    line-height: 20px!important;
  }
</style>