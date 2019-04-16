import Vue from 'vue'
import Router from 'vue-router'

const Login = r => require.ensure([], () => r(require('@/page/login/login')), 'Login')
const index = r => require.ensure([], () => r(require('@/components/index')), 'index')
const task = r => require.ensure([], () => r(require('@/components/task')), 'task')
const all_icons = r => require.ensure([], () => r(require('@/components/common/all_icons')), 'all_icons')
const ztree = r => require.ensure([], () => r(require('@/components/common/ztree')), 'ztree')

const products_category = r => require.ensure([], () => r(require('@/components/maindata/products_category')), 'products_category')
const products = r => require.ensure([], () => r(require('@/components/maindata/products')), 'products')
const testing_standard = r => require.ensure([], () => r(require('@/components/maindata/testing_standard')), 'testing_standard')
const testing_projects = r => require.ensure([], () => r(require('@/components/maindata/testing_projects')), 'testing_projects')
const testing_methods = r => require.ensure([], () => r(require('@/components/maindata/testing_methods')), 'testing_methods')
const data_module = r => require.ensure([], () => r(require('@/components/maindata/data_module')), 'data_module')
const report_module = r => require.ensure([], () => r(require('@/components/maindata/report_module')), 'report_module')
const work_instruction = r => require.ensure([], () => r(require('@/components/maindata/work_instruction')), 'work_instruction')

const application_management = r => require.ensure([], () => r(require('@/components/setting/application_management')), 'application_management')
const button_configure = r => require.ensure([], () => r(require('@/components/setting/button_configure')), 'button_configure')
const customer_management = r => require.ensure([], () => r(require('@/components/setting/customer_management')), 'customer_management')
const user_management = r => require.ensure([], () => r(require('@/components/setting/user_management')), 'user_management')
const usergroup_management = r => require.ensure([], () => r(require('@/components/setting/usergroup_management')), 'usergroup_management')
const dept_management = r => require.ensure([], () => r(require('@/components/setting/dept_management')), 'dept_management')
const role_management = r => require.ensure([], () => r(require('@/components/setting/role_management')), 'role_management')
const menu_management = r => require.ensure([], () => r(require('@/components/setting/menu_management')), 'menu_management')
const data_management = r => require.ensure([], () => r(require('@/components/setting/data_management')), 'data_management')
const safe_management = r => require.ensure([], () => r(require('@/components/setting/safe_management')), 'safe_management')
const number_settings = r => require.ensure([], () => r(require('@/components/setting/number_settings')), 'number_settings')
const dictionaries_management = r => require.ensure([], () => r(require('@/components/setting/dictionaries_management')), 'dictionaries_management')
const personinfo = r => require.ensure([], () => r(require('@/components/setting/personinfo')), 'personinfo')
const passwordedit = r => require.ensure([], () => r(require('@/components/setting/passwordedit')), 'passwordedit')


const notifications  = r => require.ensure([], () => r(require('@/components/notifications')), 'notifications')//工作任务通知书
const proxies  = r => require.ensure([], () => r(require('@/components/proxies')), 'proxies')//委托书管理
const annual_plan  = r => require.ensure([], () => r(require('@/components/annual_plan')), 'annual_plan')//年度计划

const samples  = r => require.ensure([], () => r(require('@/components/samples/samples')), 'samples')//样品管理-接样
const collar_sample  = r => require.ensure([], () => r(require('@/components/samples/collar_sample')), 'collar_sample')//样品管理-领样
const return_sample  = r => require.ensure([], () => r(require('@/components/samples/return_sample')), 'return_sample')//样品管理-返样
const sample_disposal  = r => require.ensure([], () => r(require('@/components/samples/sample_disposal')), 'sample_disposal')//样品管理-样品处置


const workorders  = r => require.ensure([], () => r(require('@/components/testworkcheck/workorders')), 'workorders')//工作任务单
const report_approve  = r => require.ensure([], () => r(require('@/components/testworkcheck/report_approve')), 'report_approve')//报告审批
const useseal_management  = r => require.ensure([], () => r(require('@/components/testworkcheck/useseal_management')), 'useseal_management')//用印管理
const quality_supervision  = r => require.ensure([], () => r(require('@/components/testworkcheck/quality_supervision')), 'quality_supervision')//质量监督抽查审批
const reportarchiving  = r => require.ensure([], () => r(require('@/components/testworkcheck/reportarchiving')), 'reportarchiving')//报告归档
const devices  = r => require.ensure([], () => r(require('@/components/devices')), 'devices')//设备管理
const inspection_project  = r => require.ensure([], () => r(require('@/components/inspection_project')), 'inspection_project')//检验/检测项目管理
const test  = r => require.ensure([], () => r(require('@/components/test')), 'test')//检验/检测项目管理
const files_search  = r => require.ensure([], () => r(require('@/components/files_search')), 'files_search')//文件查询
const interfaces  = r => require.ensure([], () => r(require('@/components/interfaces')), 'interfaces')//接口
const reports  = r => require.ensure([], () => r(require('@/components/reports/reports')), 'reports')//报表管理
const reportfile  = r => require.ensure([], () => r(require('@/components/reports/reportfile')), 'reportfile')//报表文件

const inspect_proxy  = r => require.ensure([], () => r(require('@/components/proxies/inspect_proxy')), 'inspect_proxy')//检验委托书
const check_proxy  = r => require.ensure([], () => r(require('@/components/proxies/check_proxy')), 'check_proxy')//检测委托书
const subc_agreement  = r => require.ensure([], () => r(require('@/components/proxies/subc_agreement')), 'subc_agreement')//承包方分包协议
const distri_subc_agreement  = r => require.ensure([], () => r(require('@/components/proxies/distri_subc_agreement')), 'distri_subc_agreement')//分包方分包协议

const equipment_classify  = r => require.ensure([], () => r(require('@/components/equipments/equipment_classify')), 'equipment_classify')//设备分类
const instruments  = r => require.ensure([], () => r(require('@/components/equipments/instruments')), 'instruments')//仪器和计量器具
const usag_tending_records  = r => require.ensure([], () => r(require('@/components/equipments/usag_tending_records')), 'usag_tending_records')//使用/维护保养记录
const traceability_plan  = r => require.ensure([], () => r(require('@/components/equipments/traceability_plan')), 'traceability_plan')//溯源计划
const traceability_records  = r => require.ensure([], () => r(require('@/components/equipments/traceability_records')), 'traceability_records')//溯源记录
const verification_plan  = r => require.ensure([], () => r(require('@/components/equipments/verification_plan')), 'verification_plan')//期间核查计划
const verification_records  = r => require.ensure([], () => r(require('@/components/equipments/verification_records')), 'verification_records')//期间核查记录   
const testing  = r => require.ensure([], () => r(require('@/components/testing')), 'testing')//期间核查记录

const doc_category  = r => require.ensure([], () => r(require('@/components/document/doc_category')), 'doc_category')//关键字类别
const doc_keyword  = r => require.ensure([], () => r(require('@/components/document/doc_keyword')), 'doc_keyword')//关键字
const doc_authorize  = r => require.ensure([], () => r(require('@/components/document/doc_authorize')), 'doc_authorize')//关键字授权
const doc_root  = r => require.ensure([], () => r(require('@/components/document/doc_root')), 'doc_root')//文件目录
const doc_list  = r => require.ensure([], () => r(require('@/components/document/doc_list')), 'doc_list')//文件列表
const job  = r => require.ensure([], () => r(require('@/components/job/job')), 'job')//任务管理
const jobblog  = r => require.ensure([], () => r(require('@/components/job/jobblog')), 'jobblog')//调度日志
const jobgroup  = r => require.ensure([], () => r(require('@/components/job/jobgroup')),'jobgroup')//执行器管理
const data_restrict = r => require.ensure([], () => r(require('@/components/setting/data_restrict')), 'data_restrict')//数据限制

const approving  = r => require.ensure([], () => r(require('@/components/workflow/approving')), 'approving')//审批意见
const flowhistory  = r => require.ensure([], () => r(require('@/components/workflow/flowhistory')), 'flowhistory')//流程历史
const flowmap  = r => require.ensure([], () => r(require('@/components/workflow/flowmap')), 'flowmap')//流程地图

const flow_management  = r => require.ensure([], () => r(require('@/components/flow/flow_management')), 'flow_management')//流程模型
const flow_process  = r => require.ensure([], () => r(require('@/components/flow/flow_process')), 'flow_process')//流程模型

const printCode  = r => require.ensure([], () => r(require('@/components/samples/printCode')), 'printCode')//打印条码

const loginlog  = r => require.ensure([], () => r(require('@/components/loginlog/loginlog')), 'loginlog')//打印条码
const operlog  = r => require.ensure([], () => r(require('@/components/loginlog/operlog')), 'operlog')//打印条码

Vue.use(Router)
  const routes = [
    {//登录页
      path: '/',
      name: 'Login',
      component: Login
    },
    {//首页
      path: '/index',
      name: 'index',
      component: index
    },
     {//代办
      path: '/task',
      name: 'task',
      component: task
    },
    {//年度计划
      path: '/annual_plan',
      name: 'annual_plan',
      component: annual_plan
    },
    {//工作任务通知书
      path: '/notifications',
      name: 'notifications',
      component: notifications
    },
    {//所有图标
      path: '/all_icons',
      name: 'all_icons',
      component: all_icons
    },
    {//客户管理
      path: '/customer_management',
      name: 'customer_management',
      component: customer_management
    },
    {//产品类别
      path: '/products_category',
      name: 'products_category',
      component: products_category
    },
    {//产品
      path: '/products',
      name: 'products',
      component: products
    },
    {//检验/检测标准
      path: '/testing_standard',
      name: 'testing_standard',
      component: testing_standard
    },
    {//检验/检测项目
      path: '/testing_projects',
      name: 'testing_projects',
      component: testing_projects
    },
    {//检验/检测方法
      path: '/testing_methods',
      name: 'testing_methods',
      component: testing_methods
    },
    {//原始数据模板
      path: '/data_module',
      name: 'data_module',
      component: data_module
    },
    {//检验检测报告模板
      path: '/report_module',
      name: 'report_module',
      component: report_module
    },
    {//作业指导书
      path: '/work_instruction',
      name: 'work_instruction',
      component: work_instruction
    },
    {//自动编号设置
      path: '/number_settings',
      name: 'number_settings',
      component: number_settings
    },
    {//机构管理
      path: '/dept_management',
      name: 'dept_management',
      component: dept_management
    },
    {//数据管理
      path: '/data_management',
      name: 'data_management',
      component: data_management
    },
    {//字典管理
      path: '/dictionaries_management',
      name: 'dictionaries_management',
      component: dictionaries_management
    },
    {//检验委托书
      path: '/inspect_proxy',
      name: 'inspect_proxy',
      component: inspect_proxy
    },
    {//检测委托书
      path: '/check_proxy',
      name: 'check_proxy',
      component: check_proxy
    },
    {//审批意见
      path: '/approving',
      name: 'approving',
      component: approving
    },
     {//流程历史
      path: '/flowhistory',
      name: 'flowhistory',
      component: flowhistory
    },{//流程地图
      path: '/flowmap',
      name: 'flowmap',
      component: flowmap
    },
    {//承包方分包协议
      path: '/subc_agreement',
      name: 'subc_agreement',
      component: subc_agreement
    },
    {//分包方分包协议
      path: '/distri_subc_agreement',
      name: 'distri_subc_agreement',
      component: distri_subc_agreement
    },
    {//设备分类
      path: '/equipment_classify',
      name: 'equipment_classify',
      component: equipment_classify
    },
    {//仪器和计量器具
      path: '/instruments',
      name: 'instruments',
      component: instruments
    },
    {//使用/维护保养记录
      path: '/usag_tending_records',
      name: 'usag_tending_records',
      component: usag_tending_records
    },
    {//溯源计划
      path: '/traceability_plan',
      name: 'traceability_plan',
      component: traceability_plan
    },
    {//溯源记录
      path: '/traceability_records',
      name: 'traceability_records',
      component: traceability_records
    },
    {//期间核查计划
      path: '/verification_plan',
      name: 'verification_plan',
      component: verification_plan
    },
    {//期间核查记录
      path: '/verification_records',
      name: 'verification_records',
      component: verification_records
    },
    {//数据限制
      path: '/data_restrict',
      name: 'data_restrict',
      component: data_restrict
    },
    {//个人资料
      path: '/personinfo',
      name: 'personinfo',
      component: personinfo
    },
    {//修改密码
      path: '/passwordedit',
      name: 'passwordedit',
      component: passwordedit
    },
    {//树菜单
      path: '/ztree',
      name: 'ztree',
      component:ztree  
    },
    {//菜单管理
      path: '/menu_management',
      name: 'menu_management',
      component: menu_management
    },
     {//应用管理
      path: '/application_management',
      name: 'application_management',
      component: application_management
    },
     {//按钮配置
      path: '/button_configure',
      name: 'button_configure',
      component: button_configure
    },
    {//角色管理
      path: '/role_management',
      name: 'role_management',
      component: role_management
    },
     {//用户管理
      path: '/user_management',
      name: 'user_management',
      component: user_management
    },
    {//用户组管理
     path: '/usergroup_management',
     name: 'usergroup_management',
     component: usergroup_management
    },
    {//安全管理
      path: '/safe_management',
      name: 'safe_management',
      component: safe_management
    },
    {//委托书管理
      path: '/proxies',
      name: 'proxies',
      component: proxies
    },
    {//样品管理-接样
      path: '/samples',
      name: 'samples',
      component: samples
    },{//样品管理-领样
      path: '/collar_sample',
      name: 'collar_sample',
      component: collar_sample
    },
    {//样品管理-返样
      path: '/return_sample',
      name: 'return_sample',
      component: return_sample
    },
    {//样品管理-样品处置
      path: '/sample_disposal',
      name: 'sample_disposal',
      component: sample_disposal
    },
    {//工作任务单
      path: '/workorders',
      name: 'workorders',
      component: workorders
    },
    {//报告审批
      path: '/report_approve',
      name: 'report_approve',
      component: report_approve
    },
    {//用印管理
      path: '/useseal_management',
      name: 'useseal_management',
      component: useseal_management
    },
    {//质量监督抽查审批
      path: '/quality_supervision',
      name: 'quality_supervision',
      component: quality_supervision
    },
     {//报告归档
      path: '/reportarchiving',
      name: 'reportarchiving',
      component: reportarchiving
    },
    {//设备管理
      path: '/devices',
      name: 'devices',
      component: devices
    },
    {//检验/检测项目管理
      path: '/inspection_project',
      name: 'inspection_project',
      component: inspection_project
    },
    {//检验/检测项目管理
      path: '/test',
      name: 'test',
      component: test
    },
    {//文件查询
      path: '/files_search',
      name: 'files_search',
      component: files_search
    },
    {//接口
      path: '/interfaces',
      name: 'interfaces',
      component: interfaces
    },
    {//报表管理
      path: '/reports',
      name: 'reports',
      component: reports
    },
    {//报表管理
      path: '/reportfile',
      name: 'reportfile',
      component: reportfile
    },
    {//机构管理
      path: '/testing',
      name: 'testing',
      component: testing
    },
    {//关键字类别管理
      path: '/doc_category',
      name: 'doc_category',
      component: doc_category
    },
    {//关键字管理
      path: '/doc_keyword',
      name: 'doc_keyword',
      component: doc_keyword
    },
    {//关键字授权管理
      path: '/doc_authorize',
      name: 'doc_authorize',
      component: doc_authorize
    },
    {//文件目录管理
      path: '/doc_root',
      name: 'doc_root',
      component: doc_root
    }
    ,
    {//文件列表管理
      path: '/doc_list',
      name: 'doc_list',
      component: doc_list
    },
     {//流程模型
      path: '/flow_management',
      name: 'flow_management',
      component: flow_management
    },
    {//工作流管理
      path: '/flow_process',
      name: 'flow_process',
      component: flow_process
    },
    {//任务管理
      path: '/job',
      name: 'job',
      component: job
    },
    {//任务管理
      path: '/jobblog',
      name: 'jobblog',
      component: jobblog
    },
    {//任务管理
      path: '/jobgroup',
      name: 'jobgroup',
      component: jobgroup
    },
    {//打印条码
      path: '/printCode',
      name: 'printCode',
      component: printCode
    },
    {//登录日志
      path: '/loginlog',
      name: 'loginlog',
      component: loginlog
    },
    {//操作日志
      path: '/operlog',
      name: 'operlog',
      component: operlog
    },
];

const router = new Router({
  routes: routes
})
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        var token = sessionStorage.getItem('access_token');
        if (token) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/',
            })
        }
    }
    else {
        next();
    }
})

export default  router