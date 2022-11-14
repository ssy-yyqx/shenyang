import request from '@/utils/request'
import { urls } from '../utils/ipconfig'

// ==========系统管理-系统信息============

// 应用部署查询
export function getStatus(data) {
  return request({
    url: urls['upgrade'] + '/systemInfo/status',
    method: 'post',
    data: data
  })
}

// /systemInfo/update修改系统信息
export function getInfoUpdate(data) {
  return request({
    url: urls['upgrade'] + '/systemInfo/update',
    method: 'post',
    data: data
  })
}

// 获取在线采集正常表字段信息
export function getOnlineQueryNormalInfo(data) {
  return request({
    url: urls['upgrade'] + '/tree/collect/force/' + data,
    method: 'get'
  })
}

// 获取任务列表
export function getTaskTableList(data) {
  return request({
    url: urls['upgrade'] + '/customize/list',
    method: 'post',
    data: data
  })
}

// 获取新增数据表格头
export function getTaskTableHeader(data) {
  return request({
    url: urls['upgrade'] + '/customize/tableList',
    method: 'get'
  })
}

// 获取任务数据
export function getDataTypes(data) {
  return request({
    url: urls['upgrade'] + '/standard/dataType',
    method: 'get'
  })
}

// 获取任务数据
export function getsubList(params) {
  return request({
    url: urls['upgrade'] + '/customize/detail',
    method: 'get',
    params
  })
}
// 获取关联表列表
export function getLinkTableList(params) {
  return request({
    url: urls['upgrade'] + '/table/list',
    method: 'get',
    params
  })
}

// 获取关联表列表
export function getStructureList(params) {
  return request({
    url: urls['upgrade'] + '/table/structure',
    method: 'get',
    params
  })
}

// 自定义类型sava
export function customizeSave(data) {
  return request({
    url: urls['upgrade'] + '/customize/save',
    method: 'post',
    data: data
  })
}

// 自定义类型delete
export function customizeDelete(data) {
  return request({
    url: urls['upgrade'] + '/customize/column/remove',
    method: 'post',
    data: data
  })
}

// 获取数据类型
export function getTreeDataType(params) {
  return request({
    url: urls['upgrade'] + '/standard/dataType',
    method: 'get',
    params
  })
}

// 新增数据类型
export function addTreeDataType(data) {
  return request({
    url: urls['upgrade'] + '/table/category/add',
    method: 'post',
    data
  })
}

// 新增数据类型
export function updateTreeDataType(data) {
  return request({
    url: urls['upgrade'] + '/table/category/update',
    method: 'post',
    data
  })
}
// 在线采集
export function getCateGoryInfo(params) {
  return request({
    url: urls['upgrade'] + '/table/category/info',
    method: 'get',
    params
  })
}

// 在线采集
export function getFromList(data) {
  return request({
    url: urls['upgrade'] + '/table/collect',
    method: 'post',
    data
  })
}

// 获取下拉默认值
export function getDicList(data) {
  return request({
    url: urls['upgrade'] + '/standard/dict',
    method: 'post',
    data
  })
}
// 在线采集保存数据
export function saveOnlineData(data) {
  return request({
    url: urls['upgrade'] + '/online/save',
    method: 'post',
    data
  })
}
// 获取在线采集TabList
export function getOnLineTableList(data) {
  return request({
    url: urls['upgrade'] + '/online/list',
    method: 'post',
    data
  })
}

// 在线采集-作战力量树
export function getForceTreeList(params) {
  return request({
    url: urls['upgrade'] + '/standard/force',
    method: 'get',
    params
  })
}
// 在线采集
export function getEquipmentTreeList(params) {
  return request({
    url: urls['upgrade'] + '/standard/equipment',
    method: 'get',
    params
  })
}
// 删除在线采集Tab
export function deleteOnLineTableList(data) {
  return request({
    url: urls['upgrade'] + '/online/remove',
    method: 'post',
    data
  })
}
// 编辑回显Tab
export function getOnLineDetail(data) {
  return request({
    url: urls['upgrade'] + '/online/detail',
    method: 'post',
    data
  })
}
// 编辑接口
export function editOnLineTableList(data) {
  return request({
    url: urls['upgrade'] + '/online/edit',
    method: 'post',
    data
  })
}
// 离线采集-下载
export function downLoadFile(params) {
  return request({
    url: urls['upgrade'] + '/offline/download',
    method: 'get',
    params
  })
}
// 在线采集模板下载
export function templateDownload(data) {
  return request({
    url: urls['upgrade'] + '/importExportData/exportDataModel',
    method: 'post',
    data: data
  })
}
// 在线采集数据导出
export function collectionDataExport(data) {
  return request({
    url: urls['upgrade'] + '/importExportData/exportData',
    method: 'post',
    data: data
  })
}
// 在线采集数据导入
export function collectionDataImport(data) {
  return request({
    url: urls['upgrade'] + '/importExportData/importData',
    method: 'post',
    data: data
  })
}

// ===============数据切分====================
// 根据表名获取表头列表
export function getStructure(data, name) {
  return request({
    url: urls['upgrade'] + '/table/structure?tableName=' + name,
    method: 'get',
    data
  })
}
// 数据切分修改后表头
export function getStructureOld(data, name) {
  return request({
    url: urls['upgrade'] + '/datasplit/structure?tableName=' + name,
    method: 'get',
    data
  })
}
// 数据切分行政区域获取八种类型
export function getAreaType(params) {
  return request({
    url: urls['upgrade'] + '/datasplit/tableCategoryArea',
    method: 'get',
    params
  })
}
// 获取行政区域类型下的表   /datasplit/tableArea
export function getAreaTable(data) {
  return request({
    url: urls['upgrade'] + '/datasplit/tableArea',
    method: 'post',
    data
  })
}
// 获取表格内容
export function getTableData(data) {
  return request({
    url: urls['upgrade'] + '/datasplit/list',
    method: 'post',
    data
  })
}

// 数据类型/单位编制 树
export function getDataTypeTree(params, Unite) {
  return request({
    url: urls['upgrade'] + '/tree/split' + Unite,
    method: 'get',
    params
  })
}

// 数据行政区域树
export function getAreaTree(params) {
  return request({
    url: urls['upgrade'] + '/tree/split/area',
    method: 'get',
    params
  })
}

// 行政区域表
export function getAreaList(params) {
  return request({
    url: urls['upgrade'] + '/datasplit/tableCategoryAreaInfo',
    method: 'get',
    params
  })
}
// tableCategory
export function getTableCategory(params) {
  return request({
    url: urls['upgrade'] + '/datasplit/tableCategory',
    method: 'get',
    params
  })
}
// 获取数据结构的表列表
export function getTableList(data, id) {
  return request({
    url: urls['upgrade'] + '/table/category/info/' + id,
    method: 'post',
    data
  })
}
// 获取数据结构的表列表多选
export function getTableListMore(data) {
  return request({
    url: urls['upgrade'] + '/datasplit/tableCategoryDataTypeInfo',
    method: 'post',
    data
  })
}
// 获取主键信息
export function getPrimaryKey(data, name) {
  return request({
    url: urls['upgrade'] + '/table/primaryKey?tableName=' + name,
    method: 'get',
    data
  })
}
// 获取单位的表列表
export function getUnitTableList(data) {
  return request({
    url: urls['upgrade'] + '/datasplit/tableCategoryInfo',
    method: 'get',
    data
  })
}

// 确定切分按钮
export function sendExport(data) {
  return request({
    url: urls['upgrade'] + '/datasplit/export',
    method: 'post',
    data
  })
}

// 编辑行
export function compileRow(data) {
  return request({
    url: urls['upgrade'] + '/datasplit/maintain',
    method: 'post',
    data
  })
}

// ====================数据主题定制 start===========================
// 主题数据查询  列表
export function getThemeListData(data) {
  return request({
    url: urls['upgrade'] + '/topic/topics',
    method: 'post',
    data
  })
}

// 详情
export function getThemeDetailData(data) {
  return request({
    url: urls['upgrade'] + '/topic/tableData',
    method: 'post',
    data
  })
}

// 新增保存接口
export function saveTheme(data) {
  return request({
    url: urls['upgrade'] + '/topic/insert',
    method: 'post',
    data
  })
}

// 删除
export function deleteTheme(params) {
  return request({
    url: urls['upgrade'] + '/topic/delete',
    method: 'get',
    params
  })
}

// 导出
export function exportTheme(params) {
  return request({
    url: urls['upgrade'] + '/topic/exportTopic',
    method: 'get',
    params
  })
}

// 数据类型树
export function getCustomizationDataTypeTree(params) {
  return request({
    url: urls['upgrade'] + '/tree/topicTree',
    method: 'get',
    params
  })
}
// 选择表 表字段 表格数据
export function getTopicTableColumns(params) {
  return request({
    url: urls['upgrade'] + '/topic/tableColumns',
    method: 'get',
    params
  })
}
// sql构建接口
export function getGenSql(data) {
  return request({
    url: urls['upgrade'] + '/topic/genSql',
    method: 'post',
    data
  })
}
// /upgrade/topic/insert主题数据-新增
export function getSqlInsert(data) {
  return request({
    url: urls['upgrade'] + '/topic/insert',
    method: 'post',
    data
  })
}
// /topic/topicDetail 主题数据-详情
export function getTopicDetail(params) {
  return request({
    url: urls['upgrade'] + '/topic/topicDetail',
    method: 'get',
    params
  })
}

// ====================数据定制 end===========================

// ====================统计分析展现===========================
// 人员实力统计柱状图
export function personStrength(params) {
  return request({
    url: urls['upgrade'] + `/statistics/personnel`,
    method: 'get',
    params
  })
}
// 关键岗位人员变化
export function keyJob(params) {
  return request({
    url: urls['upgrade'] + `/statistics/materials`,
    method: 'get',
    params
  })
}
// 关键岗位人员变化统计 饼图
export function specialOperation(params) {
  return request({
    url: urls['upgrade'] + `/statistics/keyPerson`,
    method: 'get',
    params
  })
}
// 人员实力统计
export function personPower(params) {
  return request({
    // url: urls['upgrade'] + '/statistics/primaryPost?bdnm=360000000',
    url: urls['upgrade'] + `/statistics/primaryPost`,
    method: 'get',
    params
  })
}

// 人员实力统计详情
export function personDetails(params) {
  return request({
    // url: urls['upgrade'] + '/statistics/primaryPostDetail?sfzhm=888888888',
    url: urls['upgrade'] + `/statistics/primaryPostDetail`,
    method: 'get',
    params
  })
}

// ====================产品===========================
export function getProductDataList(params) {
  return request({
    url: urls['upgrade'] + '/product/products',
    method: 'get',
    params
  })
}
export function getProductDataLists(params) {
  return request({
    url: urls['upgrade'] + '/product/productInfo',
    method: 'get',
    params
  })
}
// 删除产品信息
export function deleteProduct(params) {
  return request({
    url: urls['upgrade'] + '/product/delete',
    method: 'get',
    params
  })
}
// 预览产品
export function lookProductNew(data) {
  return request({
    url: urls['upgrade'] + '/product/lookProduct',
    method: 'post',
    data
  })
}
// 添加产品
export function getinsert(data) {
  return request({
    url: urls['upgrade'] + '/product/insert',
    method: 'post',
    data
  })
}
// 编辑产品
export function editProductNew(data) {
  return request({
    url: urls['upgrade'] + '/product/update',
    method: 'post',
    data
  })
}
// 下载pdf文件
export function uploadPdfFile(params) {
  return request({
    // url: `/upgrade/product/productById?productId=${params.productId}&type=PDF`,
    url: urls['upgrade'] + '/product/productById',
    method: 'get',
    params
  })
}
// 查询所有固定模板
export function getModelsList(params) {
  return request({
    url: urls['upgrade'] + '/model/models',
    method: 'get',
    params
  })
}

// 部队结构树
export function getTreeList(params) {
  return request({
    url: urls['upgrade'] + '/tree/split/force',
    method: 'get',
    params
  })
}

export function getTreeLists(params) {
  return request({
    url: urls['upgrade'] + '/model/getModelParams',
    method: 'get',
    params
  })
}

// ========可视化基础数据展示===========
// 获取list内容
// export function getVisualizationTableData(params) {
//   return request({
//     url: urls['upgrade'] + '/visualization/baseData',
//     method: 'get',
//     params
//   })
// }

// ========可视化综合态势展现===========
// 获取空情表格数据
export function getAirTableData(data) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryAirList',
    method: 'post',
    data
  })
}

// 获取空情轨迹数据
export function getAirTrack(data) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryAirTrack',
    method: 'post',
    data
  })
}

// 获取海情表格数据
export function getSeaList(data) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/querySeaList',
    method: 'post',
    data
  })
}

// 获取海情轨迹数据
export function getSeaTrack(data) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/querySeaTrack',
    method: 'post',
    data
  })
}

// 获取北斗表格数据
export function getBdList(data) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryBdList',
    method: 'post',
    data
  })
}

// 获取北斗轨迹数据
export function getBdTrack(data) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryBdTrack',
    method: 'post',
    data
  })
}

// ====================可视化基础数据展现========================
// 基础数据表渲染
export function getBassData(params) {
  return request({
    url: urls['upgrade'] + '/visualization/baseData',
    method: 'get',
    params
  })
}

// /upgrade/visualization/export 数据可视化--基础数据导出
export function getBassExport(params) {
  return request({
    url: urls['upgrade'] + '/visualization/export',
    method: 'get',
    params
  })
}

export function getExportPdf(params) {
  return request({
    url: urls['upgrade'] + '/visualization/exportPdf',
    method: 'get',
    params
  })
}
// 关岗人员详情
export function getGGInfo(params) {
  return request({
    url: urls['upgrade'] + '/visualization/getGGInfo',
    method: 'get',
    params
  })
}
// ========可视化战备工程===========
// 战备工程-数量统计
export function getStatistic(params) {
  return request({
    url: urls['upgrade'] + '/engineering/statistic',
    method: 'get',
    params
  })
}

// 战备工程-各保护区战备工程统计
export function getProtect(params) {
  return request({
    url: urls['upgrade'] + '/engineering/protect',
    method: 'get',
    params
  })
}

// 战备工程-工程类型
export function getType(params) {
  return request({
    url: urls['upgrade'] + '/engineering/type',
    method: 'get',
    params
  })
}

// 战备工程-位置查询
export function getPosition(params) {
  return request({
    url: urls['upgrade'] + '/engineering/position',
    method: 'get',
    params
  })
}

// 战备工程-工程列表
export function getList(params) {
  return request({
    url: urls['upgrade'] + '/engineering/list',
    method: 'get',
    params
  })
}

// 战备工程-工程详情
export function getDetail(params) {
  return request({
    url: urls['upgrade'] + '/engineering/detail',
    method: 'get',
    params
  })
}

// ========数据采集-新增数据类===========
// 下级采集系统信息
export function getSubordinateInfo(params) {
  return request({
    url: urls['upgrade'] + '/system/app/subordinateInfo',
    method: 'get',
    params
  })
}

// 任务下发
export function getAssign(data) {
  return request({
    url: urls['upgrade'] + '/task/assign',
    method: 'post',
    data
  })
}

export function reportDeploymentTable(params) {
  return request({
    url: urls['upgrade'] + '/deployment/reportDeploymentTable',
    method: 'get',
    params
  })
}

// =================数据清洗=======================
//  一键审查 查询SQL列表
export function getSqlList(data) {
  return request({
    url: urls['upgrade'] + '/dataSearchRule/getSqlList',
    method: 'post',
    data
  })
}
// 一键审查   审查规则
export function getAllList(data) {
  return request({
    url: urls['upgrade'] + '/dataSearchRule/getAllList',
    method: 'get',
    data
  })
}
// 一键审查   SQL详情接口
export function getSqlDetail(data) {
  return request({
    url: urls['upgrade'] + '/dataSearchRule/sqlDetail',
    method: 'get',
    data
  })
}
// 一键审查    删除sql
export function getSqlListDelete(params) {
  return request({
    url: urls['upgrade'] + '/dataSearchRule/deleteSql',
    method: 'get',
    params
  })
}
// 一键审查    sql执行
export function getExecuteSql(data) {
  return request({
    url: urls['upgrade'] + '/dataSearchRule/executeSql',
    method: 'post',
    data
  })
}
// /upgrade/dataSearchRule/executeRule审查规则执行
export function getExecuteRule(data) {
  return request({
    url: urls['upgrade'] + '/dataSearchRule/executeRule',
    method: 'post',
    data
  })
}
// 一键审查    新增sql
export function getInsertSql(data) {
  return request({
    url: urls['upgrade'] + '/dataSearchRule/insertSql',
    method: 'post',
    data
  })
}
// 一键审查    修改sql
export function getUpdateSql(data) {
  return request({
    url: urls['upgrade'] + '/dataSearchRule/updateSql',
    method: 'post',
    data
  })
}

// 数据审查   数据列表
export function getListCheck(data) {
  return request({
    url: urls['upgrade'] + '/dataCheck/list',
    method: 'post',
    data
  })
}
// 数据审查   填报率
export function getDataReportRate(data) {
  return request({
    url: urls['upgrade'] + '/dataCheck/dataReportRate',
    method: 'post',
    data
  })
}
// 数据审查  重复率
export function getDataRepeat(data) {
  return request({
    url: urls['upgrade'] + '/dataCheck/dataRepeat',
    method: 'post',
    data
  })
}
// 数据审查  填报率导出
export function getExportReportRate(data) {
  return request({
    url: urls['upgrade'] + '/dataCheck/exportReportRate',
    method: 'post',
    data
  })
}
// 数据审查  重复率导出
export function getExportRepeatData(data) {
  return request({
    url: urls['upgrade'] + '/dataCheck/exportRepeatData',
    method: 'post',
    data
  })
}
// 一致性对比  获取本地所有表
export function getAllTable(data) {
  return request({
    url: urls['upgrade'] + '/table/list',
    method: 'get',
    data
  })
}
// 一致性对比 通过表获取表字段信息
export function getTableStructure(data, tableName) {
  return request({
    url: urls['upgrade'] + '/table/structure?tableName=' + tableName,
    method: 'get',
    data
  })
}

// 一致性对比   本地数据库数据查询
export function getDataBase(data) {
  return request({
    url: urls['upgrade'] + '/dataCompare/databaseData',
    method: 'post',
    data
  })
}
// 一致性对比  数据库列表-下拉框
export function getDatabaseList(data) {
  return request({
    url: urls['upgrade'] + '/dataCompare/getDatabaseList',
    method: 'get',
    data
  })
}
// 一致性对比  新增数据库
export function getInsertDatabase(data) {
  return request({
    url: urls['upgrade'] + '/dataCompare/insertDatabase',
    method: 'post',
    data
  })
}
// 一致性对比  数据库列表分页查询
export function getDatabasePage(data) {
  return request({
    url: urls['upgrade'] + '/dataCompare/getDatabasePage',
    method: 'post',
    data
  })
}
// 一致性对比  修改数据库
export function getUpdateDatabase(data) {
  return request({
    url: urls['upgrade'] + '/dataCompare/updateDatabase',
    method: 'post',
    data
  })
}
// 一致性对比  数据库表信息
export function getDatabaseTable(data, id) {
  return request({
    url: urls['upgrade'] + '/dataCompare/databaseTable?id=' + id,
    method: 'get',
    data
  })
}
// 一致性对比  数据库字段信息
export function getDatabaseColumn(data, id, tableName) {
  return request({
    url: urls['upgrade'] + '/dataCompare/databaseColumn?id=' + id + '&tableName=' + tableName,
    method: 'get',
    data
  })
}
// 一致性对比   对比数据库数据查询
export function getOtherDatabaseData(data) {
  return request({
    url: urls['upgrade'] + '/dataCompare/otherDatabaseData',
    method: 'post',
    data
  })
}

// 一致性对比  dataCompare/deleteDatabase 删除数据库 删除数据库
export function getDeleteDatabase(params) {
  return request({
    url: urls['upgrade'] + '/dataCompare/deleteDatabase',
    method: 'get',
    params
  })
}
// ================离线采集 采集工具生成==========================
// offline/genTools
export function getGenTools(data) {
  return request({
    url: urls['upgrade'] + '/offline/genTools',
    method: 'post',
    data
  })
}

// ========数据推送-单位部署表===========

// 查询所有部署表
export function getDeploymentTables(params) {
  return request({
    url: urls['upgrade'] + '/deployment/list',
    method: 'get',
    params
  })
}

// 查询本单位的装备情况
export function getZBDTQK(params) {
  return request({
    url: urls['upgrade'] + '/deployment/getZBDTQK',
    method: 'get',
    params
  })
}

// 生成单位部署表
export function getLook(data) {
  return request({
    url: urls['upgrade'] + '/deployment/preview',
    method: 'post',
    data
  })
}

// 提交单位部署表
export function getInsert(data) {
  return request({
    url: urls['upgrade'] + '/deployment/insert',
    method: 'post',
    data
  })
}

// 修改部署表
export function getDeploymentTableId(params) {
  return request({
    url: urls['upgrade'] + '/deployment/selectByDeploymentTableId',
    method: 'get',
    params
  })
}

// 修改之后提交的部署表
export function getUpdate(data) {
  return request({
    url: urls['upgrade'] + '/deployment/update',
    method: 'post',
    data
  })
}

// 删除部署表
export function getDelete(params) {
  return request({
    url: urls['upgrade'] + '/deployment/delete',
    method: 'get',
    params
  })
}

// 查看部署表信息和下载(导出)部署表
export function getDeploymentTable(params) {
  return request({
    url: urls['upgrade'] + '/deployment/getDeploymentTable',
    method: 'get',
    params
  })
}

// 对比部署表
export function getCompare(params) {
  return request({
    url: urls['upgrade'] + '/deployment/compare',
    method: 'get',
    params
  })
}

// 合并部署表
export function getMergeDeploymentTable(params) {
  return request({
    url: urls['upgrade'] + '/deployment/merge',
    method: 'get',
    params
  })
}

export function saveTreeNode() {

}

export function updateTreeNode() {

}

export function getOnlineFieldInfo() {

}

export function getPersonTableList() {

}

export function savePersonInfo() {

}

export function getOnlineTableList() {

}

export function editPersonInfo() {

}

export function taskUpdate(data) {
  return request({
    url: urls['upgrade'] + '/customize/column/add',
    method: 'post',
    data
  })
}
export function deleteTreeNode() {

}
export function getRelateTableInfo() {

}
export function deletePersonInfo() {

}
export function saveOnlineInfoUrl() {

}
// 数据定制  编辑
export function updateTheme(params) {
  return request({
    url: urls['upgrade'] + '/topic/update',
    method: 'post',
    data: params
  })
}
export function delTask() {

}

// =============地图综合查询==================
// 根据部队获取具体位置点
export function getPoint(params) {
  return request({
    url: urls['upgrade'] + '/datasearch/point',
    method: 'get',
    params
  })
}

// 模糊查询行政区域
export function getRegion(params) {
  return request({
    url: urls['upgrade'] + '/datasearch/region',
    method: 'get',
    params
  })
}

// 地图行政区域边界点
export function getRegionJson(params) {
  return request({
    url: urls['upgrade'] + '/datasearch/region/json',
    method: 'get',
    params
  })
}

// 选定行政区域或自定义边界内数据综合查询
export function getRegionData(data) {
  return request({
    url: urls['upgrade'] + '/datasearch/region/data',
    method: 'post',
    data
  })
}

// 地图搜索-单位编制树
export function getForceTree(data) {
  return request({
    url: urls['upgrade'] + '/tree/force',
    method: 'post',
    data
  })
}

// =============工作用图==================
// 军种类型获取
export function getQueryArmyServices(params) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/queryArmyServices',
    method: 'get',
    params
  })
}

// 战备工程类型获取-根类型
export function getCategory(params) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/queryEngineeringCategory',
    method: 'get',
    params
  })
}

// 我方基础数据
export function getBaseData(data) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/getBaseData',
    method: 'post',
    data
  })
}

// 数据切分-国家地区树  敌方地区数据
export function getCountryArea(params) {
  return request({
    url: urls['upgrade'] + '/tree/countryArea',
    method: 'get',
    params
  })
}

export function getEquipmentDy(params) {
  return request({
    url: urls['upgrade'] + '/visualization/getEquipmentDy',
    method: 'get',
    params
  })
}

export function getEquipmentSi(params) {
  return request({
    url: urls['upgrade'] + '/visualization/getEquipmentSi',
    method: 'get',
    params
  })
}

// 地区
export function getSync(data) {
  return request({
    url: urls['upgrade'] + '/standard/dict/sync',
    method: 'post',
    data
  })
}

// 敌方目标数据类型
export function getTargetType(params) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/queryTargetType',
    method: 'get',
    params
  })
}

// =============资源池同步管理==================
// 资源池同步任务查询
export function getSyncTaskList(data) {
  return request({
    url: urls['upgrade'] + '/system/databaseSync/syncTaskList',
    method: 'post',
    data
  })
}

// 资源池同步任务详情查询
export function getSyncTaskDetailList(data) {
  return request({
    url: urls['upgrade'] + '/system/databaseSync/syncTaskDetailList',
    method: 'post',
    data
  })
}

// 资源池同步任务启动
export function getStartTask(data) {
  return request({
    url: urls['upgrade'] + '/system/databaseSync/startTask',
    method: 'post',
    data
  })
}

// 系统管理-资源池同步错误文件下载
export function getSyncDeploymentTables(params) {
  return request({
    url: urls['upgrade'] + '/system/databaseSync/getDeploymentTable',
    method: 'get',
    params
  })
}
export function getInfoTables(params) {
  return request({
    url: urls['upgrade'] + '/table/category/info',
    method: 'get'

  })
}
export function getColumnSeqTables(params) {
  return request({
    url: urls['upgrade'] + '/table/columnSeq/info',
    method: 'get',
    params
  })
}
export function getCustomizeTables(data) {
  return request({
    url: urls['upgrade'] + '/table/columnSeq/customize',
    method: 'post',
    data
  })
}

// 资源池同步表配置
export function getTables(data) {
  return request({
    url: urls['upgrade'] + '/table/tables',
    method: 'post',
    data
  })
}

// 系统管理-更改同步表配置
export function updateTableSync(data) {
  return request({
    url: urls['upgrade'] + '/system/databaseSync/updateTableSync',
    method: 'post',
    data
  })
}

// ==============库转换======================
// /upgrade/system/databaseTransform/list 系统管理-库转换任务分页查询
export function getDatabaseTransform(data) {
  return request({
    url: urls['upgrade'] + '/system/databaseTransform/list',
    method: 'post',
    data
  })
}
// /upgrade/system/databaseTransform/export 系统管理-库转换结果导出
export function getDatabaseExport(params) {
  return request({
    url: urls['upgrade'] + '/system/databaseTransform/export',
    method: 'get',
    params
  })
}
// /upgrade/system/databaseTransform/create  系统管理-库转换任务创建
export function getDatabaseCreate(data) {
  return request({
    url: urls['upgrade'] + '/system/databaseTransform/create',
    method: 'post',
    data
  })
}

// =============关键岗位人员信息==================
export function getGGParams(params) {
  return request({
    url: urls['upgrade'] + '/search/getGGParams',
    method: 'get',
    params
  })
}

// // 关键岗位人员信息表格数据
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
// 战场环境

// 系统管理-知识图谱
export function getForce(params) {
  return request({
    url: urls['upgrade'] + '/system/knowledgeGraph/force',
    method: 'get',
    params
  })
}

// 战备工程详情
export function getForceDetail(params) {
  return request({
    url: urls['upgrade'] + '/system/knowledgeGraph/engineering/detail',
    method: 'get',
    params
  })
}

// 部队详情s
export function getForceDetails(params) {
  return request({
    url: urls['upgrade'] + '/system/knowledgeGraph/force/detail',
    method: 'get',
    params
  })
}

// 部队相关信息
export function getForceInfo(params) {
  return request({
    url: urls['upgrade'] + '/system/knowledgeGraph/getForceInfo',
    method: 'get',
    params
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
// 复杂条件查询 作战力量，战备工程导出
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
// 数据切分  导出dmp的接口
export function getExportDmp(data) {
  return request({
    url: urls['upgrade'] + '/datasplit/exportDmp',
    method: 'post',
    data
  })
}
// 数据切分  导出Sql的接口
export function getExportSql(data) {
  return request({
    url: urls['upgrade'] + '/datasplit/exportSql',
    method: 'post',
    data
  })
}

// 数据定制 导出Sql的接口
// 导出
export function getExportTopic(params) {
  return request({
    url: urls['upgrade'] + '/topic/exportTopic',
    method: 'get',
    params
  })
}
// 建制管理
export function addOrganization(data) {
  return request({
    url: urls['upgrade'] + '/organization/add',
    method: 'post',
    data
  })
}
// 建制管理
export function getConfig(data) {
  return request({
    url: urls['upgrade'] + '/organization/equipment/config',
    method: 'post',
    data
  })
}
// 下拉搜索
export function standardDictSearch(data) {
  return request({
    url: urls['upgrade'] + '/standard/dict/search',
    method: 'post',
    data
  })
}

// =====================文件传输=========================
// 分片检查
export function transChunk(params) {
  return request({
    url: urls['upgrade'] + '/system/fileTransfer/chunk',
    method: 'get',
    params
  })
}

// 文件合并
export function mergeFile(data) {
  return request({
    url: urls['upgrade'] + '/system/fileTransfer/mergeFile',
    method: 'post',
    data
  })
}
// 文件传输任务分页查询
export function FileList(data) {
  return request({
    url: urls['upgrade'] + '/system/fileTransfer/list',
    method: 'post',
    data
  })
}

// 任务下发
export function transfer(data) {
  return request({
    url: urls['upgrade'] + '/system/fileTransfer/transfer',
    method: 'post',
    data
  })
}

// =====================应用部署管理功能=========================
// 新增部署信息
export function insertDeploy(data) {
  return request({
    url: urls['upgrade'] + '/system/app/insertDeploy',
    method: 'post',
    data
  })
}

// 应用部署查询
export function deployList(data) {
  return request({
    url: urls['upgrade'] + '/system/app/deployList',
    method: 'post',
    data
  })
}

// 修改部署信息
export function updateDeploy(data) {
  return request({
    url: urls['upgrade'] + '/system/app/updateDeploy',
    method: 'post',
    data
  })
}

// 删除部署信息
export function deleteDeploy(params) {
  return request({
    url: urls['upgrade'] + '/system/app/deleteDeploy',
    method: 'get',
    params
  })
}
// 采集任务  列表查询
export function getCollectTask(data) {
  return request({
    url: urls['upgrade'] + '/collectTask/list',
    method: 'post',
    data
  })
}

// 统计分析展现-作战力量信息统计-仪表盘

export function getStatisticsDY(params) {
  return request({
    url: urls['upgrade'] + '/statistics/statisticsDY',
    method: 'get',
    params
  })
}
// 统计分析展现-作战力量信息统计-武器装备

export function getStatisticsZB(params) {
  return request({
    url: urls['upgrade'] + '/statistics/statisticsZB',
    method: 'get',
    params
  })
}

// 批量确认采集任务
export function getCollectTaskConfirm(data, ids) {
  return request({
    url: urls['upgrade'] + '/collectTask/confirm?ids=' + ids,
    method: 'post',
    data
  })
}
// 在线采集数据上报
export function getSubmit(data, ids) {
  return request({
    url: urls['upgrade'] + '/data/submit',
    method: 'post',
    data
  })
}

//

export function getStatisticsWord(params) {
  return request({
    url: urls['upgrade'] + '/statistics/statisticsWord',
    method: 'get',
    params
  })
}

// 单点登录
export function validateToken(params, token) {
  return request({
    url: urls['dddl'] + '/api/oauth/sso/' + token,
    method: 'get',
    params
  })
}

// 军标
export function getJB(params) {
  return request({
    url: urls['jbdz'] + '/api/jb',
    method: 'get',
    params
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
// /upgrade/visualization/situational/queryRealTimeAir 综合态势数据展示--空情实时数据
export function getQueryRealTimeAir(params) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryRealTimeAir',
    method: 'get',
    params
  })
}
// /upgrade/visualization/situational/queryRealTimeBd 综合态势数据展示--北斗实时数据
export function getQueryRealTimeBd(params) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryRealTimeBd',
    method: 'get',
    params
  })
}
// /upgrade/visualization/situational/queryRealTimeSea 综合态势数据展示--海情实时数据
export function getQueryRealTimeSea(params) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryRealTimeSea',
    method: 'get',
    params
  })
}
// /upgrade/workingDiagram/getForceData作战力量信息获取
export function getForceData(data) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/getForceData',
    method: 'post',
    data
  })
}
// /upgrade/workingDiagram/getWarEngineerings 战备工程信息获取
export function getWarEngineerings(data) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/getWarEngineerings',
    method: 'post',
    data
  })
}
// /upgrade/workingDiagram/getWarEnvironment 战场环境信息
export function getWarEnvironment(data) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/getWarEnvironment',
    method: 'post',
    data
  })
}
// /upgrade/workingDiagram/getLogistics 后勤信息
export function getLogistics(data) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/getLogistics',
    method: 'post',
    data
  })
}
// /upgrade/workingDiagram/getForceInfo 部队详情
export function getForceInfoDetails(params) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/getForceDetail',
    method: 'get',
    params
  })
}

// /upgrade/workingDiagram/getWarEnvironmentDeatil战场环境信息
export function getWarEnvironmentDeatil(params) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/getWarEnvironmentDeatil',
    method: 'get',
    params
  })
}
// /upgrade/workingDiagram/getLogisticsDetail 后勤保障信息
export function getLogisticsDetail(params) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/getLogisticsDetail',
    method: 'get',
    params
  })
}
// /upgrade/visualization/situational/queryRealTimeSeaGj综合态势数据展示--海情实时轨迹数据
export function getQueryRealTimeSeaGj(params) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryRealTimeSeaGj',
    method: 'get',
    params
  })
}
// /upgrade/visualization/situational/queryRealTimeAirGj 综合态势数据展示--空情实时轨迹数据
export function getQueryRealTimeAirGj(params) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryRealTimeAirGj',
    method: 'get',
    params
  })
}
// /upgrade/visualization/situational/queryRealTimeBdGj 综合态势数据展示--北斗实时轨迹数据
export function getQueryRealTimeBdGj(params) {
  return request({
    url: urls['upgrade'] + '/visualization/situational/queryRealTimeBdGj',
    method: 'get',
    params
  })
}
// /upgrade/system/knowledgeGraph/genDb 图数据库生成
export function getGenDb(params) {
  return request({
    url: urls['upgrade'] + '/system/knowledgeGraph/genDb',
    method: 'get',
    params
  })
}

export function getPersonal(params) {
  return request({
    url: urls['upgrade'] + '/statistics/combat/personal',
    method: 'get',
    params
  })
}
export function getAmmunition(params) {
  return request({
    url: urls['upgrade'] + '/statistics/combat/ammunition',
    method: 'get',
    params
  })
}

export function getEquipment(params) {
  return request({
    url: urls['upgrade'] + '/statistics/combat/equipment',
    method: 'get',
    params
  })
}

export function getMaterial(params) {
  return request({
    url: urls['upgrade'] + '/statistics/combat/material',
    method: 'get',
    params
  })
}

// /upgrade/product/publish // 发布接口
export function getPublish(params) {
  return request({
    url: urls['upgrade'] + '/product/publish',
    method: 'get',
    params
  })
}
// /upgrade/workingDiagram/queryTargetType  目标类型获取-根类型
export function getQueryTargetType(params) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/queryTargetType',
    method: 'get',
    params
  })
}
// /upgrade/workingDiagram/getTarget 地方目标信息
export function getTarget(data) {
  return request({
    url: urls['upgrade'] + '/workingDiagram/getTarget',
    method: 'post',
    data
  })
}
// 基础数据展现截图上传
export function uploadShotPicture(data) {
  return request({
    headers: {
      'content-Type': 'multipart/form-data'
    },
    url: urls['upgrade'] + '/visualization/upload',
    method: 'post',
    data
  })
}
export function exportPpt(data) {
  return request({
    url: urls['upgrade'] + '/visualization/exportPpt',
    method: 'post',
    data
  })
}
export function topicStructure(params) {
  return request({
    url: urls['upgrade'] + '/topic/structure',
    method: 'get',
    params
  })
}
// /upgrade/system/knowledgeGraph/force/maneuverAbility 路径分析-机动能力
export function getManeuverAbility(params) {
  return request({
    url: urls['upgrade'] + '/system/knowledgeGraph/force/maneuverAbility',
    method: 'get',
    params
  })
}
// /upgrade/system/knowledgeGraph/force/warLevel行为分析-战备水平
export function getWarLevel(params) {
  return request({
    url: urls['upgrade'] + '/system/knowledgeGraph/force/warLevel',
    method: 'get',
    params
  })
}
// /upgrade/crawl/task/add 添加任务
export function getTaskAdd(data) {
  return request({
    url: urls['upgrade'] + '/crawl/task/add',
    method: 'post',
    data
  })
}
// /upgrade/crawl/task/query 任务查询
export function getTaskTableData(data) {
  return request({
    url: urls['upgrade'] + '/crawl/task/query',
    method: 'post',
    data
  })
}
//  /upgrade/crawl/task/export 任务导出
export function getTaskExport(params) {
  return request({
    url: urls['upgrade'] + '/crawl/task/exportData',
    method: 'get',
    params
  })
}
export function equipDetail(params) {
  return request({
    url: urls['upgrade'] + '/visualization/equipDetail',
    method: 'get',
    params
  })
}
// /upgrade/system/app/connect测试系统连接
export function testConnect(params) {
  return request({
    url: urls['upgrade'] + '/system/app/connect',
    method: 'get',
    params
  })
}
// /upgrade/system/app/deployList 应用部署查询
export function getDeployList(data) {
  return request({
    url: urls['upgrade'] + '/system/app/listAll',
    method: 'post',
    data
  })
}

// 上传
export function exportZip(data) {
  return request({
    headers: {
      'content-Type': 'multipart/form-data'
    },
    url: urls['upgrade'] + '/datasearch/exportZip',
    method: 'post',
    data
  })
}

// 导出
export function exportWord(data) {
  return request({
    headers: {
      'content-Type': 'multipart/form-data'
    },
    url: urls['upgrade'] + '/datasearch/exportWord',
    method: 'post',
    data
  })
}

