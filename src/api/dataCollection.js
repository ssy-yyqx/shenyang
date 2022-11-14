import request from '@/utils/request'
import { urls } from '../utils/ipconfig'

// 获取人员列表
export function getPersonList(params) {
  return request({
    url: urls['upgrade'] + '/online/personnel/info',
    method: 'get',
    params
  })
}
// 根据人员ID获取对应的表列表
export function getTableListByPerson(params) {
  return request({
    url: urls['upgrade'] + '/online/personnel/table',
    method: 'get',
    params
  })
}
// 根据code获取下拉树
export function getSelectTreeByCode(params) {
  return request({
    url: urls['upgrade'] + '/standard/dict/detail',
    method: 'post',
    data: params
  })
}

// 同步获取下拉框选项
export function getSelectOptions(params) {
  return request({
    url: urls['upgrade'] + '/standard/dict/sync',
    method: 'post',
    data: params
  })
}

export function getDydt(params) {
  return request({
    url: urls['upgrade'] + '/visualization/getDydt',
    method: 'get',
    params
  })
}
export function keyPersonList(params) {
  return request({
    url: urls['upgrade'] + '/visualization/keyPersonList',
    method: 'get',
    params
  })
}
export function personCate(params) {
  return request({
    url: urls['upgrade'] + '/visualization/personCate',
    method: 'get',
    params
  })
}
export function getDyzt(params) {
  return request({
    url: urls['upgrade'] + '/visualization/getDyzt',
    method: 'get',
    params
  })
}

export function getSuppliesInfo(params) {
  return request({
    url: urls['upgrade'] + '/visualization/suppliesInfo',
    method: 'get',
    params
  })
}

export function professionalsCate(params) {
  return request({
    url: urls['upgrade'] + '/visualization/professionalsCate',
    method: 'get',
    params
  })
}
export function professionalsInfo(params) {
  return request({
    url: urls['upgrade'] + '/visualization/professionalsInfo',
    method: 'get',
    params
  })
}
export function forceLogisticsZb(params) {
  return request({
    url: urls['upgrade'] + '/visualization/forceLogisticsZb',
    method: 'get',
    params
  })
}
export function forceLogisticsRy(params) {
  return request({
    url: urls['upgrade'] + '/visualization/forceLogisticsRy',
    method: 'get',
    params
  })
}

export function forceLogisticsZbChart(data) {
  return request({
    url: urls['upgrade'] + '/visualization/forceLogisticsZbChart',
    method: 'post',
    data
  })
}

export function warPreDutyPerList(params) {
  return request({
    url: urls['upgrade'] + '/visualization/warPreDutyPerList',
    method: 'get',
    params
  })
}
export function warPreDutyPerChart(params) {
  return request({
    url: urls['upgrade'] + '/visualization/warPreDutyPerChart',
    method: 'get',
    params
  })
}

// 获取多选下拉框值
export function getMulitiSelectTreeByCode(params) {
  return request({
    url: urls['upgrade'] + '/online/personnel/type',
    method: 'post',
    data: params
  })
}
// 获取单选下拉框值
export function getSingleSelectTreeByCode(params) {
  return request({
    url: urls['upgrade'] + '/standard/dict/detail',
    method: 'post',
    data: params
  })
}
// 获取文件信息
export function getFileInfo(params) {
  return request({
    url: urls['upgrade'] + '/online/file/info',
    method: 'post',
    data: params
  })
}
// 获取表格内容
export function getTableData(params) {
  return request({
    url: 'http://192.168.1.10:8000' + '/users/create_task/',
    method: 'get',
    params
  })
}

// 新增保存表格内容
export function addTheme(data) {
  return request({
    url: 'http://192.168.1.10:8000' + '/users/create_task/',
    method: 'post',
    data
  })
}

// 运行接口
export function runTheme(data) {
  return request({
    url: 'http://192.168.1.10:8000' + '/users/spider/',
    method: 'post',
    data
  })
}

// 搜索
export function searchTable(params) {
  return request({
    url: 'http://192.168.1.10:8000' + '/users/search_task/',
    method: 'get',
    params
  })
}

// 获取详情表内容
export function getSubTableList(params) {
  return request({
    url: 'http://192.168.1.10:8000' + '/upgrade/table/tableData',
    method: 'get',
    params
  })
}

// 新增保存接口
// export function addTheme(data) {
//   return request({
//     url: bastUrl + '/upgrade/topic/insert',
//     method: 'post',
//     data
//   })
// }
// 修改保存接口
export function updateTheme(data) {
  return request({
    url: 'http://192.168.1.10:8000' + '/upgrade/topic/update',
    method: 'post',
    data
  })
}
// 数据类型树
export function getDataTypeTree(params) {
  return request({
    url: 'http://192.168.1.10:8000' + '/upgrade/tree/topicTree',
    method: 'get',
    params
  })
}

// 删除主题
export function deleteTheme(params) {
  return request({
    url: 'http://192.168.1.10:8000' + '/upgrade/topic/delete',
    method: 'get',
    params
  })
}

// 导出主题
export function exportTopic(params) {
  return request({
    url: 'http://192.168.1.10:8000' + '/upgrade/topic/exportTopic',
    method: 'get',
    params
  })
}

// ================================================================

// 根据表名获取表头列表
export function getStructure(data, name) {
  return request({
    url: 'http://192.168.1.10:8000' + '/upgrade/table/structure?tableName=' + name,
    method: 'post',
    data
  })
}

// 获取主键信息
export function getPrimaryKey(data, name) {
  return request({
    url: 'http://192.168.1.10:8000' + '/upgrade/table/primaryKey?tableName=' + name,
    method: 'post',
    data
  })
}
// 获取单位的表列表
export function getUnitTableList(data) {
  return request({
    url: 'http://192.168.1.10:8000' + '/upgrade/datasplit/tableCategoryInfo',
    method: 'post',
    data
  })
}

// 确定切分按钮
export function sendExport(tableCategory, isCloak) {
  return 'http://192.168.1.10:8000' + `/upgrade/datasplit/export/${tableCategory}/${isCloak}`
}

// 编辑行
export function compileRow(data) {
  return request({
    url: 'http://192.168.1.10:8000' + '/upgrade/datasplit/maintain',
    method: 'post',
    data
  })
}


//复杂条件查询导出dmp
export function exportSearchDataDmp(params) {
  return request({
    url: urls['upgrade'] + '/search/exportSearchDataDmp',
    method: 'get',
    params
  })
}
