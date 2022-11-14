// import request from '@/utils/request'
import {
  seaData,
  airData,
  dipperData,
  rowData,
  lineData_001201,
  lineData_001202,
  lineData_001203,
  lineData_001204,
  lineData_001205,
  lineData_001206
  // pointData
} from './data.js'

// 获取海情表格数据
export function getSeaTableData(params) {
  //   return request({
  //     url: '/upgrade/visualization/tableData',
  //     method: 'get',
  //     params
  //   })
  return Promise.resolve(seaData)
}
// 获取空情表格数据
export function getAirTableData(params) {
  //   return request({
  //     url: '/upgrade/visualization/tableData',
  //     method: 'get',
  //     params
  //   })
  return Promise.resolve(airData)
}
// 获取北斗表格数据
export function getDipperTableData(params) {
  //   return request({
  //     url: '/upgrade/visualization/tableData',
  //     method: 'get',
  //     params
  //   })
  return Promise.resolve(dipperData)
}
// 获取态势信息表格数据
export function getRowTableData(params) {
  //   return request({
  //     url: '/upgrade/visualization/tableData',
  //     method: 'get',
  //     params
  //   })
  return Promise.resolve(rowData)
}
// 获取地图线数据
export function getMapLineData(params) {
  //   return request({
  //     url: '/upgrade/visualization/tableData',
  //     method: 'get',
  //     params
  //   })
  if (params.id == '001201') {
    return Promise.resolve(lineData_001201)
  }
  if (params.id == '001202') {
    return Promise.resolve(lineData_001202)
  }
  if (params.id == '001203') {
    return Promise.resolve(lineData_001203)
  }
  if (params.id == '001204') {
    return Promise.resolve(lineData_001204)
  }
  if (params.id == '001205') {
    return Promise.resolve(lineData_001205)
  }
  if (params.id == '001206') {
    return Promise.resolve(lineData_001206)
  }
}
// 获取地图点数据
// export function getMapPointData(params) {
//     //   return request({
//     //     url: '/upgrade/visualization/tableData',
//     //     method: 'get',
//     //     params
//     //   })
//     return Promise.resolve(pointData)
// }

