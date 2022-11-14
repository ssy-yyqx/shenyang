import request from '@/utils/request'
import { urls } from '../utils/ipconfig'
export function getUnitDeploymentList(data) {
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
            unitName: '中国新闻',
            equipNum: 'admin',
            keyEquipNum: '2019-02-24',
            settingTime: '2020-12-27'
          },
          {
            id: 1,
            taskName: '美国新闻',
            creator: 'lisa',
            createTime: '2020-02-24',
            endTime: '2021-05-04',
            complete: '10/30',
            taskKey: 'sys_usa_news',
            taskType: '基本数据',
            addForm: [
              { name: '主键',
                key: 'id',
                type: 'number',
                size: '12'
              },
              { name: '新闻名称',
                key: 'newsName',
                type: 'varchar',
                size: '20'
              },
              { name: '发生地',
                key: 'address',
                type: 'varchar',
                size: '255'
              },
              { name: '时间',
                key: 'time',
                type: 'date',
                size: ''
              }
            ]
          }
        ],
        total: 2
      },
      msg: 'success'
    }
    resolve(result)
  })
}
// 获取表格数据
export function getTableData(params) {
  return request({
    // url: `/upgrade/product/products?pageNum=${params.pageNum}&pageSize=${params.pageSize}&productName=${params.productName}`,
    url: `/upgrade/product/products`,
    method: 'get',
    params
  })
  // return new Promise(resolve => {
  //   const result = {
  //     code: 200,
  //     data: [
  //       {
  //         productName: '单位简况产品',
  //         createUser: '张三',
  //         createState: '已生成',
  //         createCompany: '',
  //         createTime: '2021-05-08'
  //       },
  //       {
  //         productName: '单位简况产品',
  //         createUser: '张三',
  //         createState: '已生成',
  //         createCompany: '',
  //         createTime: '2021-05-08'
  //       },
  //       {
  //         productName: '单位简况产品',
  //         createUser: '张三',
  //         createState: '已生成',
  //         createCompany: '',
  //         createTime: '2021-05-08'
  //       },
  //       {
  //         productName: '单位简况产品',
  //         createUser: '张三',
  //         createState: '已生成',
  //         createCompany: '',
  //         createTime: '2021-05-08'
  //       },
  //       {
  //         productName: '单位简况产品',
  //         createUser: '张三',
  //         createState: '已生成',
  //         createCompany: '',
  //         createTime: '2021-05-08'
  //       },
  //       {
  //         productName: '单位简况产品',
  //         createUser: '张三',
  //         createState: '已生成',
  //         createCompany: '',
  //         createTime: '2021-05-08'
  //       }
  //     ],
  //     msg: 'success'
  //   }
  //   resolve(result)
  // })
}
// 获取表格数据
export function getDataTempllateTable(params) {
  return new Promise(resolve => {
    const result = {
      code: 200,
      data: [
        {
          templateName: '单位简况',
          createUser: '张三',
          templateState: '表字段',
          createCompany: '沈阳',
          createTime: '2021-05-08'
        },
        {
          templateName: '人员类别',
          createUser: '张三',
          templateState: '脚本',
          createCompany: '沈阳',
          createTime: '2021-05-08'
        }
      ],
      msg: 'success'
    }
    resolve(result)
  })
}

// 新增数据产品   选择产品
export function findDataProduct(params) {
  return new Promise(resolve => {
    const result = {
      code: 200,
      data: [
        {
          value: '1',
          label: '单位简况产品'
        },
        {
          value: '2',
          label: '个人信息卡片产品'
        },
        {
          value: '3',
          label: '单位情况产品'
        }
      ],
      msg: 'success'
    }
    resolve(result)
  })
}

// 新增数据产品   产品内容
export function findDataProductContent(params) {
  return new Promise(resolve => {
    const result = {
      code: 200,
      data: [
        {
          label: '单位简况产品',
          children: [
            {
              label: '一、单位整体介绍',
              value: 'briefInfo',
              format: 'text'
            },
            {
              label: '二、单位人员类别统计',
              value: 'category',
              format: 'chart'
            }
          ]

        }
      ],
      msg: 'success'
    }
    resolve(result)
  })
}

// 图表内容模板
export function findDataTemplate() {
  return new Promise(resolve => {
    const result = {
      code: 200,
      data: [
        {
          label: '部队人员信息模板',
          value: 'userInfo',
          x: ['LB', 'RS', 'ZS'],
          y: ['LB', 'RS', 'ZS']
        },
        {
          label: '单位信息模板',
          value: 'companyInfo',
          x: ['LB', 'RS', 'ZS'],
          y: ['LB', 'RS', 'ZS']
        },
        {
          label: '装备信息模板',
          value: 'equipmentInfo',
          x: ['LB', 'RS', 'ZS'],
          y: ['LB', 'RS', 'ZS']
        }
      ],
      msg: 'success'
    }
    resolve(result)
  })
}

// 图表内容展示信息
export function findDataInfo() {
  return new Promise(resolve => {
    const result = {
      code: 200,
      data: {
        x: ['士兵', '二级军官', '四级军官', '首长'],
        y: [120, 232, 201, 234]
      },
      msg: 'success'
    }
    resolve(result)
  })
}

// 获取模板列表
export function getFixedModels(data) {
  return request({
    url: urls['upgrade'] + '/model/models',
    method: 'get',
    params: data
  })
}
// 获取模板详细信息
export function getFixedModelById(data) {
  return request({
    url: urls['upgrade'] + '/model/getModelById',
    method: 'get',
    params: data
  })
}
// 新增模板保存
export function addFixedModel(data) {
  return request({
    url: urls['upgrade'] + '/model/addModel',
    method: 'post',
    data
  })
}
// 修改模板保存
export function updateFixedModel(data) {
  return request({
    url: urls['upgrade'] + '/model/updateModel',
    method: 'post',
    data
  })
}
// 删除模板
export function deleteFixedModel(data) {
  return request({
    url: urls['upgrade'] + '/model/deleteModel',
    method: 'get',
    params: data
  })
}
// 获取模板文件地址
export function getFixedModelFileById(data) {
  return request({
    url: urls['upgrade'] + '/model/getModelFileById',
    method: 'get',
    params: data
  })
}
// 解析sql
export function anlysisSql(data) {
  return request({
    url: urls['upgrade'] + '/model/analysisSQL',
    method: 'post',
    data
  })
}
