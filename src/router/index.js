import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},

{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},
// 数据推送》单位部署表》制作部署表
{
  path: '/bill',
  name: 'Bill',
  component: () => import('@/views/DataPush/UnitDeployment/bill')
},
// 数据推送》单位部署表》查看
{
  path: '/check',
  name: 'Check',
  component: () => import('@/views/DataPush/UnitDeployment/check')
},
// 校验token
{
  path: '/sign',
  name: 'sign',
  component: () => import('@/views/sign/index')
},
{
  path: '/SplitFile',
  name: 'SplitFile',
  component: () => import('@/views/SplitFile/index')
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: 'dashboard',
  meta: {
    title: '首页',
    icon: 'dataReceive'
  },
  children: [{
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '首页',
      icon: 'internet'
    }
  }]
},
{
  // 数据采集
  path: '/DataCollection',
  component: Layout,
  redirect: '/DataCollection/Online',
  name: 'DataCollection',
  meta: {
    title: '数据采集',
    icon: 'dataReceive'
  },
  children: [{
    path: 'online',
    name: 'Online',
    component: () => import('@/views/DataCollection/Online/index'),
    meta: {
      title: '在线采集',
      icon: 'online'
    }
  },
  {
    path: 'offline',
    name: 'Offline',
    component: () => import('@/views/DataCollection/Offline/index'),
    meta: {
      title: '离线采集',
      icon: 'outline'
    }
  },
  {
    path: 'task',
    name: 'Task',
    component: () => import('@/views/DataCollection/Task/index'),
    meta: {
      title: '自定义采集',
      icon: 'add'
    }
  },
  {
    path: 'capture',
    name: 'Capture',
    component: () => import('@/views/DataCollection/Capture/index'),
    meta: {
      title: '互联网爬取',
      icon: 'add'
    }
  }
  ]
},
{
  // 数据整编
  path: '/DataReorganize',
  component: Layout,
  redirect: '/DataReorganize/Rinse',
  name: 'DataReorganize',
  meta: {
    title: '数据整编',
    icon: 'dataSend'
  },
  children: [
    {
      path: 'rinse',
      name: 'Rinse',
      component: () => import('@/views/DataReorganize/Rinse/index'),
      meta: {
        title: '数据清洗',
        icon: 'qingxi'
      }
    },
    {
      path: 'segmentation',
      name: 'Segmentation',
      component: () => import('@/views/DataReorganize/Segmentation/index'),
      meta: {
        title: '数据切分',
        icon: 'quefen'
      }
    },
    {
      path: 'camouflage',
      name: 'Camouflage',
      component: () => import('@/views/DataReorganize/Camouflage/index'),
      meta: {
        title: '数据伪装',
        icon: 'weizhuang'
      }
    },
    {
      path: 'customization',
      name: 'Customization',
      component: () => import('@/views/DataReorganize/Customization/index'),
      meta: {
        title: '数据定制',
        icon: 'dingzhi'
      }
    }
  ]
},
{
  // 数据搜索
  path: '/DataSearch',
  component: Layout,
  redirect: '/DataSearch/classifyTheme',
  name: 'DataSearch',
  meta: {
    title: '数据搜索',
    icon: 'dataSend'
  },
  children: [{
    path: 'classifyTheme',
    name: 'ClassifyTheme',
    component: () => import('@/views/DataSearch/ClassifyTheme/index'),
    meta: {
      title: '分类主题查询',
      icon: 'internet'
    }
  },
  {
    path: 'complicatedCondition',
    name: 'ComplicatedCondition',
    component: () => import('@/views/DataSearch/ComplicatedCondition/index'),
    meta: {
      title: '复杂条件查询',
      icon: 'internet'
    }
  },
  {
    path: 'semanticAssociation',
    name: 'SemanticAssociation',
    component: () => import('@/views/DataSearch/SemanticAssociation/index'),
    meta: {
      title: '语义关联查询',
      icon: 'internet'
    }
  },
  {
    path: 'mapSynthesize',
    name: 'MapSynthesize',
    component: () => import('@/views/DataSearch/MapSynthesize/index'),
    meta: {
      title: '地图综合查询',
      icon: 'internet'
    }
  }
  ]
},
{
  // 数据推送
  path: '/DataPush',
  component: Layout,
  redirect: '/DataPush/productMade',
  name: 'DataPush',
  meta: {
    title: '数据推送',
    icon: 'dataSend'
  },
  children: [{
    path: 'productMade',
    name: 'ProductMade',
    component: () => import('@/views/DataPush/ProductMade/index'),
    meta: {
      title: '数据产品制作与管理',
      icon: 'sjcpzz'
    }
  },
  {
    path: 'unitDeployment',
    name: 'UnitDeployment',
    component: () => import('@/views/DataPush/UnitDeployment/index'),
    meta: {
      title: '单位部署表',
      icon: 'dwbsb'
    }
  },
  {
    path: 'templateMade',
    name: 'TemplateMade',
    component: () => import('@/views/DataPush/TemplateMade/index'),
    meta: {
      title: '自定义模板',
      icon: 'dwbsb'
    }
  }
  ]
},
{
  // 数据可视化
  path: '/DataVisualization',
  component: Layout,
  redirect: '/DataVisualization/essentialData',
  name: 'DataVisualization',
  meta: {
    title: '数据可视化',
    icon: ''
  },
  children: [{
    path: 'essentialData',
    name: 'EssentialData',
    component: () => import('@/views/DataVisualization/EssentialData/index'),
    meta: {
      title: '基础数据展现',
      icon: 'jcsj'
    }
  },
  {
    path: 'synthesizeSituation',
    name: 'SynthesizeSituation',
    component: () => import('@/views/DataVisualization/SynthesizeSituation/index'),
    meta: {
      title: '综合态势展现',
      icon: 'zhts'
    }
  },
  {
    path: 'statisticAnalysis',
    name: 'StatisticAnalysis',
    component: () => import('@/views/DataVisualization/StatisticAnalysis/index'),
    meta: {
      title: '统计分析展现',
      icon: 'tjfx'
    }
  },
  {
    path: 'specialData',
    name: 'SpecialData',
    component: () => import('@/views/DataVisualization/SpecialData/index'),
    meta: {
      title: '专题数据展现',
      icon: 'ztsj'
    }
  },
  {
    path: 'internetAnalyse',
    name: 'InternetAnalyse',
    component: () => import('@/views/DataVisualization/InternetAnalyse/index'),
    meta: {
      title: '关联网络分析展现',
      icon: 'glwl'
    }
  }
  ]
},
{
  // 工作用图
  path: '/WorkMap',
  component: Layout,
  redirect: '/WorkMap/index',
  name: 'WorkMap',
  meta: {
    title: '工作用图',
    icon: 'setting'
  },
  children: [{
    path: 'index',
    name: 'WorkMap',
    component: () => import('@/views/WorkMap/index'),
    meta: {
      title: '工作用图',
      icon: 'internet'
    }
  }]
},
{
  // 系统管理
  path: '/SystemManagement',
  component: Layout,
  redirect: '/SystemManagement/databasesys',
  name: 'SystemManagement',
  meta: {
    title: '系统管理',
    icon: 'internet'
  },
  children: [{
    path: 'databasesys',
    name: 'Databasesys',
    component: () => import('@/views/SystemManagement/Databasesys/index'),
    meta: {
      title: '库转换管理',
      icon: 'internet'
    }
  },
  {
    path: 'resourcePool',
    name: 'ResourcePool',
    component: () => import('@/views/SystemManagement/resourcePool/index'),
    meta: {
      title: '资源池同步管理',
      icon: 'internet'
    }
  },
  // {
  //   path: 'dictionaries',
  //   name: 'Dictionaries',
  //   component: () => import('@/views/SystemManagement/Dictionaries/index'),
  //   meta: {
  //     title: '字典管理',
  //     icon: 'internet'
  //   }
  // },
  // {
  //   path: 'role ',
  //   name: 'Role',
  //   component: () => import('@/views/SystemManagement/Role/index'),
  //   meta: {
  //     title: '角色管理',
  //     icon: 'internet'
  //   }
  // },
  // {
  //   path: 'personnel',
  //   name: 'Personnel',
  //   component: () => import('@/views/SystemManagement/Personnel/index'),
  //   meta: {
  //     title: '人员管理',
  //     icon: 'internet'
  //   }
  // },
  // {
  //   path: 'menu',
  //   name: 'Menu',
  //   component: () => import('@/views/SystemManagement/Menu/index'),
  //   meta: {
  //     title: '菜单管理',
  //     icon: 'internet'
  //   }
  // },
  {
    path: 'organizational',
    name: 'Mrganizational',
    component: () => import('@/views/SystemManagement/Mrganizational/index'),
    meta: {
      title: '建制管理',
      icon: 'internet'
    }
  },
  // {
  //   path: 'logsys',
  //   name: 'Logsys',
  //   component: () => import('@/views/SystemManagement/Logsys/index'),
  //   meta: {
  //     title: '日志管理',
  //     icon: 'internet'
  //   }
  // },
  {
    path: 'fileTransfer',
    name: 'fileTransfer',
    component: () => import('@/views/SystemManagement/fileTransfer/index'),
    meta: {
      title: '文件传输',
      icon: 'internet'
    }
  },
  {
    path: 'deployment',
    name: 'deployment',
    component: () => import('@/views/SystemManagement/deployment/index'),
    meta: {
      title: '应用部署管理',
      icon: 'internet'
    }
  },
  {
    path: 'collect',
    name: 'collect',
    component: () => import('@/views/SystemManagement/collect/index'),
    meta: {
      title: '采集配置管理',
      icon: 'internet'
    }
  },
  {
    path: 'DataReport',
    name: 'DataReport',
    component: () => import('@/views/SystemManagement/DataReport/index'),
    meta: {
      title: '数据上传',
      icon: 'internet'
    }
  }
  ]
},

{
  // 个人中心
  path: '/UserCentre',
  component: Layout,
  redirect: '/UserCentre/intelligent',
  name: 'UserCentre',
  meta: {
    title: '个人中心',
    icon: 'logSetting'
  },
  children: [{
    path: 'intelligent',
    name: 'Intelligent',
    component: () => import('@/views/UserCentre/Intelligent/index'),
    meta: {
      title: '智能推送',
      icon: 'internet'
    }
  },
  {
    path: 'gather',
    name: 'Gather',
    component: () => import('@/views/UserCentre/Gather/index'),
    meta: {
      title: '采集任务',
      icon: 'internet'
    }
  }
  // {
  //  path: 'userSetting',
  //  name: 'UserSetting',
  //  component: () => import('@/views/UserCentre/UserSetting/index'),
  //  meta: {
  //    title: '个人设置',
  //    icon: 'internet'
  //  }
  // }
  ]
},
// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
