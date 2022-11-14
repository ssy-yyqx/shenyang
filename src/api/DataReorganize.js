import request from '@/utils/request'
import { urls } from '../utils/ipconfig'

const bastUrl = ''
// 获取表格内容
export function getTableData(data) {
  return request({
    url: bastUrl + '/upgrade/datasplit/list',
    method: 'post',
    data
  })
}
// 获取部队信息查询条件
export function getBDParams(params = []) {
  return request({
    url: urls['upgrade'] + '/search/getBDParams',
    method: 'get',
    params
  })
}
// 获取战备工程查询条件
export function getGCParams(params = []) {
  return request({
    url: urls['upgrade'] + '/search/getGCParams',
    method: 'get',
    params
  })
}
// 部队信息和战备工程查询
export function getData(data, page, type) {
  const formData = {
    'type': type,
    'pageNum': page.currentPage,
    'pageSize': page.pageSize,
    'paramMap': data
  }
  return request({
    url: urls['upgrade'] + '/search/getData',
    method: 'post',
    data: formData
  })
}
// 战场环境选项
export function getZCHJParams(params = []) {
  return request({
    url: urls['upgrade'] + '/search/getZCHJParams',
    method: 'get',
    params
  })
}
// 战略环境表头

export function getZCHJTableName(data = []) {
  return request({
    url: urls['upgrade'] + '/search/getZCHJTableName',
    method: 'post',
    data
  })
}
// 战略环境内容

export function getZCHJData(data = []) {
  return request({
    url: urls['upgrade'] + '/search/getZCHJData',
    method: 'post',
    data
  })
}
// 复杂条件查询 作战力量，战备工程,关键岗位人员导出
export function getExportSearchData(data, type, tableName) {
  const formData = {
    'type': type,
    // 'tableName': tableName,
    'paramMap': data
  }
  return request({
    url: urls['upgrade'] + '/search/exportSearchData',
    method: 'post',
    data: formData
  })
}
// 复杂条件查询 战场环境导出
export function getExportSearchDataSome(data, type, tableName) {
  const formData = {
    'type': type,
    'tableName': tableName,
    'paramMap': data
  }
  return request({
    url: urls['upgrade'] + '/search/exportSearchData',
    method: 'post',
    data: formData
  })
}


export function searchGetZZZBParams(params = []) {

  return request({
    url: urls['upgrade'] + '/search/getZZZBParams',
    method: 'get',
    params
  })
}

