import request from '@/utils/request'
import { urls } from '../utils/ipconfig'
// 获取表头
export function getTopicTable(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/topicTable/' + data,
    method: 'get'
  })
}
// 获取内容
export function getList(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/list',
    method: 'post',
    data: data
  })
}
// 获取详情
export function getDetail(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/detail',
    method: 'post',
    data: data
  })
}
// 获取云图文字

export function gettopicMake(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/topicMake',
    method: 'get'
  })
}
// 获取tab分类
export function gettopicMakeTable(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/topicMakeTable/' + data,
    method: 'get'
  })
}
// 详情表头

export function getTopicChiTable(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/topicChiTable/' + data.topicTable,
    method: 'get'
  })
}
// 统计数据
export function getTopicSort(data) {
  const params = {
    topicId: data.TOPIC_ID,
    topicName: data.TOPIC_NAME || data.name
  }
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/topicTable/topicSort',
    method: 'get',
    params
  })
}

// 排名数据
export function getSelectTopicSort(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/topicTable/selectTopicSort',
    method: 'get'
  })
}
// 获取标题

export function getTopicChiTableComment(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/topicChiTableComment/' + data,
    method: 'get'
  })
}

//
export function getSelectOrg(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/topicTable/selectOrg',
    method: 'post',
    data
  })
}

export function exportTopic(data) {
  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/export',
    method: 'post',
    data: data
  })
}

export function searchStructure(params) {

  return request({
    url: urls['upgrade'] + '/searchClassifyTopic/structure',
    method: 'get',
    params
  })
}


