import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)
const state={//要设置的全局访问的state对象
   roleid:null,
   navid: null,
   menuid:null,//一级菜单id
   menusid:null,//二级菜单id
   currentRolesname:null,//当前的角色name
   currentcjdw:null,
   firstselectnav:{},//当只有一级菜单
   selectedNav:{
      css: 'icon-user',
      name: '首页',
      url: '/index'  
   },
   //要设置的初始属性值
   clickedNavs:[
      {
         css: 'icon-user',
         name: '首页',
         url: '/index'
      }
   ],
   isLoading: false
};
	//组件获取 state 用 vuex 的 getter
const getters = {   //实时监听state值的变化(最新状态)
   getRoleId(state) {  //承载变化的showFooter的值
      return state.roleid
   },
   getNavId(state){  //承载变化的changebleNum的值
      return state.navid
   },
   getMenuId(state){  //承载变化的changebleNum的值
      return state.menuid
   },
   getMensuId(state){  //承载变化的changebleNum的值
      return state.menusid
   },
   getSelectedNav(state){
      return state.selectedNav;
   },
   getClickedNav(state){
      return state.clickedNavs;
   },
   getfirstselectnav(state){
      return state.firstselectnav;
   },
   getcurrentrolesname(state){
      return state.currentRolesname;
   },
   getcurrentcjdw(state){
      return state.currentcjdw;
   },
};
   //修改 state 用 vuex 的 mutation 
const mutations = {
   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
   setRoleId(state,roleid) {  
      state.roleid = roleid;
   },
   //同上，这里面的参数除了state之外还传了需要增加的值sum
   setNavId(state,navid){ 
      state.navid=navid;
   },
   setMenuId(state,menuid) {  
      state.menuid = menuid;
   },
   setMenusId(state,menusid) { 
      state.menusid = menusid;
   },
   setSelectedNav(state,selectedNav){
      state.selectedNav=selectedNav;
   },
   setClickedNav(state,clickedNavs){
      state.clickedNavs=clickedNavs;
   },
   updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading;
   },
   setfirstselectnav(state,firstselectnav){
      state.selectedNav=firstselectnav;
   },
   setcurrentrolesname(state,currentRolesname){
      state.currentRolesname=currentRolesname;
   },
   setcurrentcjdw(state,currentcjdw){
      state.currentcjdw=currentcjdw;
   },
};

//组件触发动作用 vuex 的 action
//自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
const actions = {
   setRoleIdAct(context,roleid) {  
      context.commit('setRoleId',roleid);
   },
   setNavIdAct(context,navid) { 
      context.commit('setNavId',navid);
   },
   setMenuIdAct(context,menuid) {  
      context.commit('setMenuId',menuid);
   },
   setMenusIdAct(context,menusid) { 
      context.commit('setMenusId',menusid);
   },
   setSelectedNavAct(context,selectedNav){
      context.commit('setSelectedNav',selectedNav);
   },
   setClickedNavAct(context,clickedNav){
      context.commit('setClickedNav',clickedNav);
   },
   setfirstselectnavAct(state,firstselectnav){
      context.commit('setfirstselectnav',firstselectnav);
   },
   setcurrentrolesnameNavAct(context,currentRolesname){
      context.commit('setcurrentrolesname',currentRolesname);
   },
   setcurrentcjdwNavAct(context,currentcjdw){
      context.commit('setcurrentcjdw',currentcjdw);
   },
};

router.beforeEach(function (to, from, next) {
   store.commit('updateLoadingStatus', {isLoading: true});
   next();
})
 
router.afterEach(function (to) {
   store.commit('updateLoadingStatus', {isLoading: false});
})

const store = new Vuex.Store({
   state,
   getters,
   mutations,
   actions
});

export default store