import request from '@/utils/request'
import { urls } from '../utils/ipconfig'

// 获取统计分析展现树节点信息
export function getStatisticTreeNodesList() {
  // return request({
  //   url: '/task/list/page',
  //   method: 'post',
  //   data: data
  // })
  return new Promise(resolve => {
    const result = {
      code: 200,
      data: {
        list: [
          {
            id: 1,
            label: '沈阳市',
            table: '',
            isParent: true,
            pId: -1,
            children: [
              {
                id: 2,
                label: '和平区',
                table: '',
                isParent: true,
                pId: 1,
                children: []
              },
              {
                id: 3,
                label: '沈河区',
                table: '',
                isParent: true,
                pId: 1,
                children: []
              },
              {
                id: 4,
                label: '大东区',
                table: '',
                isParent: true,
                pId: 1,
                children: []
              },
              {
                id: 5,
                label: '皇姑区',
                table: '',
                isParent: true,
                pId: 1,
                children: []
              },
              {
                id: 6,
                label: '铁西区',
                table: '',
                isParent: true,
                pId: 1,
                children: []
              },
              {
                id: 7,
                label: '苏家屯区',
                table: '',
                isParent: true,
                pId: 1,
                children: []
              },
              {
                id: 8,
                label: '浑南区',
                table: '',
                isParent: true,
                pId: 1,
                children: []
              },
              {
                id: 9,
                label: '沈北新区',
                table: '',
                isParent: true,
                pId: 1,
                children: []
              }
            ]
          },
          {
            id: 10,
            label: '大连市',
            table: '',
            isParent: true,
            pId: -1,
            children: [
              {
                id: 11,
                label: '中山区',
                table: 'sys_land',
                isParent: false,
                pId: 10,
                children: []
              },
              {
                id: 12,
                label: '西岗区',
                table: 'sys_sky',
                isParent: false,
                pId: 10,
                children: []
              },
              {
                id: 13,
                label: '沙河口区',
                table: 'sys_ocean',
                isParent: false,
                pId: 10,
                children: []
              }
            ]
          }
        ]
      },
      msg: '获取树节点数据成功'
    }
    resolve(result)
  })
}

// 获取单位编制树
export function getCompanyTreeList(params) {
  return new Promise(resolve => {
    const result = {
      code: 200,
      data: [
        {
          label: '北部战区',
          children: [
            {
              label: '政治工作部',
              children: [
                {
                  label: 'AAA'
                },
                {
                  label: 'BBB'
                },
                {
                  label: 'CCC'
                }
              ]
            },
            {
              label: '军种指挥机构',
              children: [
                {
                  label: 'AAA'
                },
                {
                  label: 'BBB'
                },
                {
                  label: 'CCC'
                }
              ]
            },
            {
              label: '派驻机构',
              children: [
                {
                  label: 'AAA'
                },
                {
                  label: 'BBB'
                },
                {
                  label: 'CCC'
                }
              ]
            },
            {
              label: '联勤保障部',
              children: [
                {
                  label: 'AAA'
                },
                {
                  label: 'BBB'
                },
                {
                  label: 'CCC'
                }
              ]
            }
          ]
        }
      ],
      msg: 'success'
    }
    resolve(result)
  })
}
// 获取关系图数据
export function getChartData(praams) {
  return new Promise(resolve => {
    const result = {
      code: 200,
      // data: {
      //   categories: [
      //     { name: '人员' },
      //     { name: '工程' },
      //     { name: '部队' },
      //     { name: '后勤' },
      //     { name: '装备' }
      //   ],
      //   links: [
      //     { source: '部队', target: '后勤' },
      //     { source: '部队', target: '人员' },
      //     { source: '部队', target: '装备' },
      //     { source: '部队', target: '工程' },
      //     { source: '人员', target: '李四' },
      //     { source: '人员', target: '王五' },
      //     { source: '人员', target: '赵六' },
      //     { source: '装备', target: '装备1' },
      //     { source: '装备', target: '装备2' },
      //     { source: '装备', target: '装备3' },
      //     { source: '装备', target: '装备4' },
      //     { source: '工程', target: '工程1' },
      //     { source: '工程', target: '工程2' },
      //     { source: '工程', target: '工程3' },
      //     { source: '工程', target: '工程4' }
      //   ],
      //   nodes: [
      //     {
      //       'value': '部队',
      //       'symbolSize': 30,
      //       'value': 10,
      //       'category': 0
      //     },
      //     {
      //       'value': '后勤',
      //       'symbolSize': 25,
      //       'value': 10,
      //       'category': 0
      //     },
      //     {
      //       'value': '人员',
      //       'symbolSize': 25,
      //       'value': 10,
      //       'category': 0
      //     },
      //     {
      //       'value': '装备',
      //       'symbolSize': 25,
      //       'value': 10,
      //       'category': 0
      //     },
      //     {
      //       'value': '工程',
      //       'symbolSize': 25,
      //       'value': 10,
      //       'category': 0
      //     },
      //     {
      //       'value': '李四',
      //       'symbolSize': 20,
      //       'value': 1,
      //       'category': 0
      //     },
      //     {
      //       'value': '王五',
      //       'symbolSize': 20,
      //       'value': 2,
      //       'category': 0
      //     },
      //     {
      //       'value': '赵六',
      //       'symbolSize': 20,
      //       'value': 3,
      //       'category': 0
      //     },
      //     {
      //       'value': '装备1',
      //       'symbolSize': 20,
      //       'value': 1,
      //       'category': 0
      //     },
      //     {
      //       'value': '装备2',
      //       'symbolSize': 20,
      //       'value': 2,
      //       'category': 0
      //     },
      //     {
      //       'value': '装备3',
      //       'symbolSize': 20,
      //       'value': 3,
      //       'category': 0
      //     },
      //     {
      //       'value': '装备4',
      //       'symbolSize': 20,
      //       'value': 4,
      //       'category': 0
      //     },
      //     {
      //       'value': '工程1',
      //       'symbolSize': 20,
      //       'value': 1,
      //       'category': 0
      //     },
      //     {
      //       'value': '工程2',
      //       'symbolSize': 20,
      //       'value': 2,
      //       'category': 0
      //     },
      //     {
      //       'value': '工程3',
      //       'symbolSize': 20,
      //       'value': 3,
      //       'category': 0
      //     },
      //     {
      //       'value': '工程4',
      //       'symbolSize': 20,
      //       'value': 4,
      //       'category': 0
      //     }
      //   ]
      // },
      data: {
        maxid: 8,
        nodes: [
          {
            shape: 'circle',
            pid: 1,
            label: '708',
            name: 2,
            type: 'property',
            desc: '708',
            itemStyle: {
              color: '#1f90dc'
            }
          },
          {
            shape: 'circle',
            color: '#1f90dc',
            pid: 1,
            label: '101.01,0....',
            name: 3,
            type: 'property',
            desc: '101.01,0.03311',
            itemStyle: {
              color: '#1f90dc'
            }
          },
          {
            shape: 'circle',
            color: '#1f90dc',
            pid: 1,
            label: '殇',
            name: 4,
            type: 'property',
            desc: '殇',
            itemStyle: {
              color: '#1f90dc'
            }
          },
          {
            shape: 'circle',
            color: '#1f90dc',
            pid: 1,
            label: '8',
            name: 5,
            type: 'property',
            desc: '8',
            itemStyle: {
              color: '#1f90dc'
            }
          },
          {
            shape: 'circle',
            color: '#1f90dc',
            pid: 1,
            label: '89',
            name: 6,
            type: 'property',
            desc: '89',
            itemStyle: {
              color: '#1f90dc'
            }
          },
          {
            shape: 'circle',
            color: '#1f90dc',
            pid: 1,
            label: '坦克002',
            name: 7,
            type: 'property',
            desc: '坦克002',
            itemStyle: {
              color: '#1f90dc'
            }
          },
          {
            shape: 'circle',
            color: '#f06130',
            pid: 1,
            label: '企业/681362...',
            name: 8,
            type: 'nodes',
            desc: '企业/68136260',
            itemStyle: {
              color: '#f06130'
            }
          },
          {
            shape: 'circle',
            color: '#f06130',
            subids: [2, 3, 4, 5, 6, 7, 8],
            pid: 0,
            name: 1,
            label: '机构/大数据应用中心',
            type: 'nodes',
            desc: '机构/大数据应用中心',
            itemStyle: {
              color: '#f06130'
            }
          }
        ],
        code: 0,
        edges: [
          { source: '1', label: '代号', target: '2', id: '1_2' },
          { source: '1', label: '位置', target: '3', id: '1_3' },
          { source: '1', label: '领导', target: '4', id: '1_4' },
          { source: '1', label: '在编人数', target: '5', id: '1_5' },
          { source: '1', label: '在编人数', target: '6', id: '1_6' },
          { source: '1', label: '编成内码', target: '7', id: '1_7' },
          { source: '1', label: '下属单位', target: '8', id: '1_8' }
        ]
      },
      msg: 'success'
    }
    resolve(result)
  })
}

// 自定义统计列表
export function getCustomizeStatisticList(data) {
  return request({
    url: urls['upgrade'] + '/statistics/customize/list',
    method: 'get',
    params: data
  })
}

// 自定义统计新增
export function addCustomizeStatistic(data) {
  return request({
    url: urls['upgrade'] + '/statistics/customize/save',
    method: 'post',
    data
  })
}

// 自定义统计详情
export function getCustomizeStatisticDetail(data) {
  return request({
    url: urls['upgrade'] + '/statistics/customize/detail',
    method: 'get',
    params: data
  })
}

// 自定义统计修改
export function editCustomizeStatistic(data) {
  return request({
    url: urls['upgrade'] + '/statistics/customize/update',
    method: 'post',
    data
  })
}

// 自定义统计删除
export function deleteCustomizeStatistic(data) {
  return request({
    url: urls['upgrade'] + '/statistics/customize/remove',
    method: 'get',
    params: data
  })
}
// 根据sql获取自定义统计数据
export function getCustomizeStatisticDataBySql(data) {
  return request({
    url: urls['upgrade'] + '/statistics/customize/sqlData',
    method: 'get',
    params: data
  })
}
// 专题数据展现列表
export function getThematicDataList(data) {
  return request({
    url: urls['upgrade'] + '/thematic/list',
    method: 'get',
    params: data
  })
}

// 专题数据展现新增
export function addThematicData(data) {
  return request({
    url: urls['upgrade'] + '/thematic/save',
    method: 'post',
    data
  })
}

// 专题数据展现详情
export function getThematicDataDetail(data) {
  return request({
    url: urls['upgrade'] + '/thematic/detail',
    method: 'get',
    params: data
  })
}

// 专题数据展现修改
export function editThematicData(data) {
  return request({
    url: urls['upgrade'] + '/thematic/update',
    method: 'post',
    data
  })
}

// 专题数据展现删除
export function deleteThematicData(data) {
  return request({
    url: urls['upgrade'] + '/thematic/delete',
    method: 'get',
    params: data
  })
}
// 根据sql获取专题数据
export function getThematicDataBySql(data) {
  return request({
    url: urls['upgrade'] + '/thematic/chartDataBySql',
    method: 'get',
    params: data
  })
}
// 上传
export function uploadImage(data) {
  return request({
    headers: {
      'content-Type': 'multipart/form-data'
    },
    url: urls['upgrade'] + '/thematic/upload',
    method: 'post',
    data
  })
}

// 导出
export function downloadThematic(data) {
  return request({
    url: urls['upgrade'] + '/thematic/export',
    method: 'get',
    params: data
  })
}
