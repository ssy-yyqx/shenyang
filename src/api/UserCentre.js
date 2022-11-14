import request from '@/utils/request'
import { urls } from '../utils/ipconfig'
// 获取消息列表
export function getList(data) {
  return request({
    url: urls['upgrade'] + '/intelligencePush/list',
    method: 'post',
    data
  })
}
// 获取消息列表
export function getDetail(data) {
  return request({
    url: urls['upgrade'] + '/intelligencePush/detail',
    method: 'post',
    data
  })
}

// 根据表名获取表头列表
export function getStructure(data, name) {
  return request({
    url: urls['upgrade'] + '/table/structure?tableName=' + name,
    method: 'get',
    data
  })
}
