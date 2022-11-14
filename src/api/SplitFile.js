import request from '@/utils/request'
import { urls } from '../utils/ipconfig'

// 获取表格数据
export function getSplitFile(data) {
  return request({
    url: urls['upgrade'] + '/datasplit/splitFile',
    method: 'post',
    data
  })
}

export function downLoadSplitFile(params) {
  return request({
    url: urls['upgrade'] + '/datasplit/downLoadSplitFile',
    method: 'get',
    params
  })
}
