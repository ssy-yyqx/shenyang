const seaColumn = [
  { 'label': '批号', 'prop': 'batchNumber', 'key': 'PH' },
  { 'label': '机舷号', 'prop': 'machineSideNumber', 'key': 'JIXIANHAO' },
  { 'label': '目标编号', 'prop': 'targetCode', 'key': 'MBBH' },
  { 'label': '目标名称', 'prop': 'targetName', 'key': 'TARGETNAME' },
  { 'label': '出现时间', 'prop': 'findTime', 'key': 'CXSJ' },
  { 'label': '消失时间', 'prop': 'lastReceiveTime', 'key': 'XSSJ' },
  { 'label': '航迹点数', 'prop': 'trackNum', 'key': 'HJDS' },
  { 'label': '国籍', 'prop': 'nationality', 'key': 'GJ' },
]
const airColumn = [
  { 'label': '批号', 'prop': 'batchNumber', 'key': 'PH' },
  { 'label': '机舷号', 'prop': 'machineSideNumber', 'key': 'JIXIANHAO' },
  { 'label': '目标编号', 'prop': 'targetCode', 'key': 'MBBH' },
  { 'label': '目标名称', 'prop': 'targetName', 'key': 'TARGETNAME' },
  { 'label': '出现时间', 'prop': 'findTime', 'key': 'CXSJ' },
  { 'label': '消失时间', 'prop': 'lastReceiveTime', 'key': 'XSSJ' },
  { 'label': '航迹点数', 'prop': 'trackNum', 'key': 'HJDS' },
  { 'label': '国籍', 'prop': 'nationality', 'key': 'GJ' },
]
const dipperColumn = [
  { label: '北斗ID号', prop: 'targetId', 'key': 'TARGETID' },
  { label: '北斗别名', prop: 'targetName', 'key': 'TARGETNAME' },
  { label: '部队番号', prop: 'insititute', 'key': 'BDFH' },
  { label: '部队简称', prop: 'forcesAsName', 'key': 'BDJC' },
  { label: '部队等级', prop: 'forcesLevel', 'key': 'BDECHELON' },
  { label: '开始时间', prop: 'positioningStartTime', 'key': 'KSSJ' },
  { label: '结束时间', prop: 'positioningEndTime', 'key': 'JSSJ' },
  { label: '轨迹数量', prop: 'trackNum', 'key': 'GJSL' },
  { label: '当前任务', prop: 'currentTask', 'key': 'DQRW' },
  { label: '军民用', prop: 'militaryCivilianUse', 'key': 'JMY' },
]

const rowColumn = [
  { 'label': '时间', 'prop': 'time' }, { 'label': '经度', 'prop': 'longitude' }, { 'label': '纬度', 'prop': 'latitude' }, { 'label': '高度', 'prop': 'height' }, { 'label': '航向', 'prop': 'course' }, { 'label': '航速（海里/小时）', 'prop': 'speed' }
]

export {
  seaColumn,
  airColumn,
  dipperColumn,
  rowColumn
}
