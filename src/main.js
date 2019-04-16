// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import echarts from 'echarts'
import ElementUI from 'element-ui'
import { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import './assets/css/hxqheam-fonts.css'
import './assets/css/forms.css'
import './assets/css/tablelist.css'
import './assets/css/grid.css'
import $ from 'jquery'
import moment from 'moment'
import './axios'
import vueGridLayout from 'vue-grid-layout'

// import Dropzone from 'dropzone/dist/min/dropzone.min.js'
// import 'dropzone/dist/min/dropzone.min.css'

import vueztree from 'vue-ztree-2.0/dist/vue-ztree-2.0.umd.min.js'
// import EasyScroll from 'easyscroll'//自定义滚动条
import common from './assets/js/common.js'
import store from './store.js'
import 'babel-polyfill'
import Validators from './core/util/validators.js'


//import './jquery/dist/jquery.min.js'
//import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap/dist/js/bootstrap.min.js'
//import 'metismenu/dist/metisMenu.js'
//import 'slimscroll/example/ssmaster/jquery.slimscroll.min.js'
//import 'ztree/js/jquery.ztree.all.min.js'
//import 'ztree/js/jquery.ztree.core.js'
//import 'ztree/css/zTreeStyle/zTreeStyle.css'
//import './assets/bootstrap/bootstrap.min.css'
//import './assets/bootstrap/bootstrap.min.js'


Vue.config.productionTip = false
Vue.directive('loadmore', {
	bind(el, binding) {
		const selectWrap = el.querySelector('.el-table__body-wrapper');
		var scrollBeforeTop = 0;
		var firstFlag = true;
	    selectWrap.addEventListener('scroll', function(e) {
			if(this.scrollTop == scrollBeforeTop){
				return false;
			}
			let toBtm = sessionStorage.getItem('toBtm');
			if(toBtm=='true'){
				if(firstFlag){
					scrollBeforeTop = this.scrollTop;
					firstFlag = false;
					this.scrollTop = 2;
				}else{
					if(this.scrollTop >= scrollBeforeTop){
						this.scrollTop = 2;
						scrollBeforeTop = this.scrollTop;
					}
				}
			}
	      	let sign = 1
	      	const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
		    if (scrollDistance <= sign) {
				sessionStorage.setItem('up2down','down');
				binding.value();
				this.scrollTop = 800;
	      	}else if(this.scrollTop < sign){
				sessionStorage.setItem('up2down','up');
				binding.value();
				this.scrollTop = 2;
	      	}else{
	      		return false;
	      	}
	    })
	}
})

Vue.prototype.$echarts = echarts
Vue.prototype.$moment = moment//赋值使用
Vue.prototype.common = common
Vue.prototype.Validators = Validators
Vue.use(ElementUI)
Vue.use(vueztree)

// Vue.use(EasyScroll)//自定义滚动条
//Vue.use(infiniteScroll)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
 


   
