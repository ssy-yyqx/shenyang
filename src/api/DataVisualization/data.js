// 海情 表格相关数据
var seaData = [{
  'NO': 1,
  'targetType': '001201',
  'keyword': '北斗1号',
  'code': '陆军合成第十二旅',
  'jixianCode': '020304001',
  'property': '合成十二旅',
  'cetegory': '副师级',
  'informationSource': '巡逻',
  'militaryCivilianUse': '定位设备',
  'type': '军用',
  'nationality': '',
  'dynamic': '',
  'destCode': '',
  'number': '',
  'jijianName': '',
  'task': '',
  'seaConditionCat': '',
  'originalInfoSource': '',
  'latestMsgTime': '',
  'findTime': '',
  'order': '',
  'retain': '',
  'UserID': '',
  'destination': '',
  'threatLevel': '',
  'Feasibility': '',
  'model': '',
  'importance': '',
  'DataLinkBatchNumber': '',
  'infoBatchNumber': '',
  'fightBatchNumber': '',
  'fightModelNumber': '',
  'militaryStandardLibNumber': '',
  'militaryCode': ''
}, {
  'NO': 2,
  'targetType': '001202',
  'keyword': '北斗1号',
  'code': '陆军合成第十二旅',
  'jixianCode': '020304001',
  'property': '合成十二旅',
  'cetegory': '副师级',
  'informationSource': '巡逻',
  'militaryCivilianUse': '定位设备',
  'type': '军用',
  'nationality': '',
  'dynamic': '',
  'destCode': '',
  'number': '',
  'jijianName': '',
  'task': '',
  'seaConditionCat': '',
  'originalInfoSource': '',
  'latestMsgTime': '',
  'findTime': '',
  'order': '',
  'retain': '',
  'UserID': '',
  'destination': '',
  'threatLevel': '',
  'Feasibility': '',
  'model': '',
  'importance': '',
  'DataLinkBatchNumber': '',
  'infoBatchNumber': '',
  'fightBatchNumber': '',
  'fightModelNumber': '',
  'militaryStandardLibNumber': '',
  'militaryCode': ''
}]
// 空情 表格相关数据
var airData = [{
  'NO': 1,
  'targetType': '001203',
  'keyword': '北斗1号',
  'code': '陆军合成第十二旅',
  'friendorfoe': '020304001',
  'type': '合成十二旅',
  'number': '20',
  'pilot': '张三',
  'countryAndRegion': '中国',
  'order': '',
  'hangingBomb': '',
  'remainOil': '',
  'task': '',
  'model': '',
  'aircraftNumber': '',
  'platformIdentNumber': '',
  'targetCategory': '',
  'environmentCategory': '',
  'department': '',
  'status': '',
  'longAircraftIdent': '',
  'roll': '',
  'pitch': '',
  'parachuteIdent': '',
  'departureAirport': '',
  'landAirport': '',
  'landedAirport': '',
  'infoSource': '',
  'secondCode': '',
  'additionalInfo': '',
  'firstTime': '',
  'targetID': '',
  'taskAttempt': '',
  'receivingTime': '',
  'reservation': '',
  'credibility': '',
  'batchNumber': '',
  'militaryStandardLibNumber': '',
  'militaryCode': ''
},
{
  'NO': 2,
  'targetType': '001204',
  'keyword': '北斗1号',
  'code': '陆军合成第十二旅',
  'friendorfoe': '020304001',
  'type': '合成十二旅',
  'number': '20',
  'pilot': '张三',
  'countryAndRegion': '中国',
  'order': '',
  'hangingBomb': '',
  'remainOil': '',
  'task': '',
  'model': '',
  'aircraftNumber': '',
  'platformIdentNumber': '',
  'targetCategory': '',
  'environmentCategory': '',
  'department': '',
  'status': '',
  'longAircraftIdent': '',
  'roll': '',
  'pitch': '',
  'parachuteIdent': '',
  'departureAirport': '',
  'landAirport': '',
  'landedAirport': '',
  'infoSource': '',
  'secondCode': '',
  'additionalInfo': '',
  'firstTime': '',
  'targetID': '',
  'taskAttempt': '',
  'receivingTime': '',
  'reservation': '',
  'credibility': '',
  'batchNumber': '',
  'militaryStandardLibNumber': '',
  'militaryCode': ''
}]

// 北斗 表格相关数据
// var dipperData = JSON.parse("[{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"},{\"dipperID\":\"001203\",\"dipperAlias\":\"北斗1号\",\"armyDesignation\":\"陆军合成第十二旅\",\"armyNumber\":\"020304001\",\"armyAbbreviation\":\"合成十二旅\",\"armyLevel\":\"副师级\",\"currentTask\":\"巡逻\",\"dipperDeviceType\":\"定位设备\",\"militaryCivilianUse\":\"军用\",\"soldiersCategory\":\"军兵种\",\"militaryStandardLibNumber\":\"65365\",\"militaryCode\":\"123456\"}]")
var dipperData = [{
  'NO': 1,
  'dipperID': '001205',
  'ipperAlias': '北斗1号',
  'armyDesignation': '陆军合成第十二旅',
  'armyNumber': '020304001',
  'armyAbbreviation': '合成十二旅',
  'armyLevel': '副师级',
  'currentTask': '巡逻',
  'dipperDeviceType': '定位设备',
  'militaryCivilianUse': '军用',
  'soldiersCategory': '',
  'militaryStandardLibNumber': '',
  'militaryCode': ''
}, {
  'NO': 2,
  'dipperID': '001206',
  'ipperAlias': '北斗1号',
  'armyDesignation': '陆军合成第十二旅',
  'armyNumber': '020304001',
  'armyAbbreviation': '合成十二旅',
  'armyLevel': '副师级',
  'currentTask': '巡逻',
  'dipperDeviceType': '定位设备',
  'militaryCivilianUse': '军用',
  'soldiersCategory': '',
  'militaryStandardLibNumber': '',
  'militaryCode': ''
}]
// 态势信息 表格相关数据
var rowData = [{
  'NO': 1,
  'time': '2021-06-11 10:40',
  'lon': '116.408',
  'lat': '36.309',
  'high': '150.89',
  'course': '东南偏南',
  'Speed': '90'
}, {
  'NO': 2,
  'time': '2021-06-11 10:40',
  'lon': '116.408',
  'lat': '36.309',
  'high': '150.89',
  'course': '东南偏南',
  'Speed': '90'
}, {
  'NO': 3,
  'time': '2021-06-11 10:40',
  'lon': '116.408',
  'lat': '36.309',
  'high': '150.89',
  'course': '东南偏南',
  'Speed': '90'
}]
var lineData_001201 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            121.11328124999999,
            20.981956742832327
          ],
          [
            118.6083984375,
            21.350781150679737
          ],
          [
            118.6083984375,
            22.836945920943855
          ],
          [
            119.92675781249999,
            24.487148563173424
          ],
          [
            120.5419921875,
            25.423431426334222
          ],
          [
            122.14599609375001,
            26.52956523826758
          ]
        ]
      }
    }
  ]
}
var lineData_001202 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            119.86083984375,
            25.264568475331583
          ],
          [
            122.56347656249999,
            27.6251403350933
          ],
          [
            123.48632812499999,
            27.664068965384516
          ],
          [
            124.01367187499999,
            28.420391085674304
          ]
        ]
      }
    }
  ]
}
var lineData_001203 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            121.11328124999999,
            20.981956742832327
          ],
          [
            118.6083984375,
            21.350781150679737
          ],
          [
            118.6083984375,
            22.836945920943855
          ],
          [
            119.92675781249999,
            24.487148563173424
          ],
          [
            120.5419921875,
            25.423431426334222
          ],
          [
            122.14599609375001,
            26.52956523826758
          ]
        ]
      }
    }
  ]
}
var lineData_001204 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            119.86083984375,
            25.264568475331583
          ],
          [
            122.56347656249999,
            27.6251403350933
          ],
          [
            123.48632812499999,
            27.664068965384516
          ],
          [
            124.01367187499999,
            28.420391085674304
          ]
        ]
      }
    }
  ]
}
var lineData_001205 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            121.61865234375,
            22.654571520098994
          ],
          [
            124.03564453125,
            25.839449402063185
          ],
          [
            126.10107421874999,
            27.00040800352175
          ],
          [
            126.89208984375,
            27.410785702577023
          ]
        ]
      }
    }
  ]
}
var lineData_001206 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            123.06884765625,
            28.69058765425071
          ],
          [
            123.04687499999999,
            26.588527147308614
          ],
          [
            124.892578125,
            27.11781284232125
          ],
          [
            126.2548828125,
            28.57487404744697
          ],
          [
            127.001953125,
            29.19053283229458
          ]
        ]
      }
    }
  ]
}
export {
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
}
