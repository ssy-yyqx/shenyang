// import request from '@/utils/request'

export function login(data) {
  return new Promise((resolve, reject) => {
    resolve({
      code: 20000,
      data: {
        token: 'admin'
      }
    })
  })
}

export function getInfo(token) {
  return new Promise((resolve, reject) => {
    resolve({
      code: 20000,
      data: {
        name: 'admin',
        menu: [
          {
            id: '0',
            name: '首页',
            routerName: 'Dashboard'
          },
          {
            id: '1',
            name: '数据采集',
            children: [
              {
                id: '1_1',
                name: '在线采集',
                image: 'el-icon-eleme',
                routerName: 'Online'
              },
              {
                id: '1_2',
                name: '离线采集',
                image: 'el-icon-eleme',
                routerName: 'Offline'
              },
              {
                id: '1_3',
                name: '互联网爬取',
                image: 'el-icon-eleme',
                routerName: 'Capture'
              }
            ]
          },
          {
            id: '2',
            name: '数据整编',
            children: [
              {
                id: '2_1',
                name: '数据清洗',
                image: 'el-icon-eleme',
                routerName: 'Rinse'
              },
              {
                id: '2_2',
                name: '数据切分',
                image: 'el-icon-eleme',
                routerName: 'Segmentation'
              },
              {
                id: '2_3',
                name: '数据定制',
                image: 'el-icon-eleme',
                routerName: 'Customization'
              }
            ]
          },
          {
            id: '3',
            name: '数据搜索',
            children: [
              {
                id: '3_1',
                name: '分类主题查询',
                image: 'el-icon-eleme',
                routerName: 'ClassifyTheme'
              },
              {
                id: '3_2',
                name: '复杂条件查询',
                image: 'el-icon-eleme',
                routerName: 'ComplicatedCondition'
              },
              {
                id: '3_3',
                name: '语义关联查询',
                image: 'el-icon-eleme',
                routerName: 'SemanticAssociation'
              },
              {
                id: '3_4',
                name: '地图综合查询',
                image: 'el-icon-eleme',
                routerName: 'MapSynthesize'
              }
            ]
          },
          {
            id: '4',
            name: '数据推送',
            children: [
              {
                id: '4_1',
                name: '数据产品制作',
                image: 'el-icon-eleme',
                routerName: 'ProductMade'
              },
              {
                id: '4_2',
                name: '单位部署表',
                image: 'el-icon-eleme',
                routerName: 'UnitDeployment'
              },
              {
                id: '4_3',
                name: '数据产品管理',
                image: 'el-icon-eleme',
                routerName: 'ProductManagement'
              }
            ]
          },
          {
            id: '5',
            name: '数据可视化',
            children: [
              {
                id: '5_1',
                name: '基础数据展现',
                image: 'el-icon-eleme',
                routerName: 'EssentialData'
              },
              {
                id: '5_2',
                name: '综合态势展现',
                image: 'el-icon-eleme',
                routerName: 'SynthesizeSituation'
              },
              {
                id: '5_3',
                name: '统计分析展现',
                image: 'el-icon-eleme',
                routerName: 'StatisticAnalysis'
              },
              {
                id: '5_4',
                name: '专题数据展现',
                image: 'el-icon-eleme',
                routerName: 'SpecialData'
              },
              {
                id: '5_5',
                name: '互联网络分析查询',
                image: 'el-icon-eleme',
                routerName: 'InternetAnalyse'
              }
            ]
          },
          {
            id: '6',
            name: '工作用图',
            routerName: 'WorkMap'
          },
          {
            id: '7',
            name: '系统管理',
            children: [
              {
                id: '7_1',
                name: '库转换管理',
                image: 'el-icon-eleme',
                routerName: 'Databasesys'
              },
              {
                id: '7_2',
                name: '字典管理',
                image: 'el-icon-eleme',
                routerName: 'Dictionaries'
              },
              {
                id: '7_3',
                name: '角色管理',
                image: 'el-icon-eleme',
                routerName: 'Role'
              },
              {
                id: '7_4',
                name: '人员管理',
                image: 'el-icon-eleme',
                routerName: 'Personnel'
              },
              {
                id: '7_5',
                name: '菜单管理',
                image: 'el-icon-eleme',
                routerName: 'Menu'
              },
              {
                id: '7_6',
                name: '建制管理',
                image: 'el-icon-eleme',
                routerName: 'Mrganizational'
              },
              {
                id: '7_7',
                name: '日志管理',
                image: 'el-icon-eleme',
                routerName: 'Logsys'
              }
            ]
          },
          {
            id: '8',
            name: '个人中心',
            children: [
              {
                id: '8_1',
                name: '智能推送',
                image: 'el-icon-eleme',
                routerName: 'Intelligent'
              },
              {
                id: '8_2',
                name: '采集任务',
                image: 'el-icon-eleme',
                routerName: 'Gather'
              },
              {
                id: '8_3',
                name: '个人设置',
                image: 'el-icon-eleme',
                routerName: 'UserSetting'
              },
              {
                id: '8_4',
                name: '退出',
                image: 'el-icon-eleme',
                routerName: 'logout'
              }
            ]
          }
        ]
      }
    })
  })
}

export function logout() {
  return new Promise((resolve, reject) => {
    resolve({
      code: 20000,
      data: {
        token: ''
      }
    })
  })
}
