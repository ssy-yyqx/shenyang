<template>
  <Container id="map">
    <MapOl ref="MapOl" />
    <div class="timeSearch">
      <el-date-picker
        v-model="startDate"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期"
        @change="searchTime"
      />
    </div>
    <div class="table">
      <!-- <el-button @click="satelliteFn" class="satelliteBtn">{{satellite}}</el-button> -->

      <div class="tableTop">
        <el-radio-group v-model="condition" style="margin:3px 0px 9px 10px;;" size="medium">
          <el-radio-button label="seaCondition">海情</el-radio-button>
          <el-radio-button label="airCondition">空情</el-radio-button>
          <el-radio-button label="dipper">北斗</el-radio-button>
        </el-radio-group>
        <!-- <el-input v-model="search" class="search" placeholder="请输入搜索内容"></el-input> -->
        <i
          :class="{'el-icon-d-arrow-left':true, 'showTableIcon': bShowTable,'hideTableIcon': !bShowTable}"
          @click="showTable()"
        />
      </div>
      <!-- 显示海情、空情、北斗信息的表格 -->
      <div v-show="bShowTable">
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          :height="350"
          border
          style="width: 100%;"
          :header-cell-style="{background:'#409EFF',color:'#fff'}"
          @row-click="tabRowClick"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" :index="indexMethod" type="index" width="50" align="center" />
          <el-table-column
            v-for="(item,index) in tableColumn"
            :key="index"
            :min-width="item.label.length*15+30"
            :label="item.label"
            :prop="item.prop"
            align="center"
          />
        </el-table>
        <div class="pager-section">
          <el-pagination
            :current-page="pager.pageNum"
            :page-size="pager.pageSize"
            layout="total, prev, pager, next"
            :total="pager.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <!-- 点击行弹出的表格 -->
      <div>
        <el-dialog v-dialogDrag title="态势信息" :visible.sync="dialogTableVisible" :modal="false">
          <el-table
            border
            :data="rowData"
            :header-cell-style="{background:'#409EFF',color:'#fff'}"
            height="300px"
          >
            <el-table-column
              v-for="(item,index) in rowColumn"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              align="center"
            />
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">关闭</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </Container>
</template>

<script>
import MapOl from '@/components/MapOl'
import Container from '@/components/Container'
import airplaneImage from '@/assets/icons/airplane.png'
// import armedPoliceImage from '@/assets/icons/armed_police.png'
import armyImage from '@/assets/icons/army.png'
// import flagImage from '@/assets/icons/flag.png'
// import surfaceForceImage from '@/assets/icons/surface_forces.png'

// import troopStationImage from '@/assets/icons/troop_station.png'
// import fireForceImage from '@/assets/icons/fire_force.png'
// import { mapGetters } from 'vuex'
import moment from 'moment'
// import {
//   getSeaTableData,
//   getAirTableData,
//   getDipperTableData,
//   getRowTableData,
//   getMapLineData
// } from '@/api/DataVisualization/SynthesizeSituation'
import * as API from '../../../api/index'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
// 处理态势信息可拖拽
import './dialogDrag'
export default {
  components: { Container, MapOl },
  data() {
    return {
      value1: '',
      dataFlag: 'kq',
      startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      map: '',
      mapLineData: [], // 地图线的数据
      mapPointData: [], // 地图图标的数值
      bShowTable: false, // 是否显示表格
      tableData: [], // 表格数据
      allTabData: [],
      tableColumn: '', // 表格的列
      search: '', // 表格的搜索条件
      rowData: [], // 态势信息表格的数据
      rowColumn: '', // 态势信息表格的列
      dialogTableVisible: false, // 是否展示态势信息
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      firstLoad: true, // 是否是第一次加载页面
      condition: 'seaCondition', // 当前选择的选项卡（海情、空情、北斗）
      tabelCheckRowSea: [], // 海情表格勾选的行，初次进入默认勾选第一个
      tabelCheckRowAir: [], // 空情表格勾选的行，初次进入默认勾选第一个
      tabelCheckRowDipper: [], // 北斗表格勾选的行，初次进入默认勾选第一个
      bFirstLoadSea: true, // 是否是第一次加载海情表格
      bFirstLoadAir: true, // 是否是第一次加载空情表格
      bFirstLoadDipper: true, // 是否是第一次加载北斗表格
      currentLayerId: '', // 当前图层的ID
      satellite: '显示卫星地图',
      bSatellite: false,
      // 定义表格的列
      // 海情
      seaColumn: JSON.parse(
        '[{"label":"目标类型","prop":"targetType"},{"label":"关键字","prop":"keyWord"},{"label":"批号","prop":"batchNumber"},{"label":"机舷号","prop":"machineSideNumber"},{"label":"属性","prop":"attribute"},{"label":"类别","prop":"category"},{"label":"情报员","prop":"agents"},{"label":"军民用","prop":"militaryCivilianUse"},{"label":"类型","prop":"type"},{"label":"国籍","prop":"nationality"},{"label":"动态","prop":"dynamic"},{"label":"目标编识码","prop":"targetId"},{"label":"数量","prop":"amount"},{"label":"机舰名","prop":"machineShipName"},{"label":"任务","prop":"task"},{"label":"海情分类","prop":"seaSentimentClassification"},{"label":"原始情报员","prop":"originalAgent"},{"label":"最后收到报文时间","prop":"lastReceiveTime"},{"label":"发现时间","prop":"findTime"},{"label":"队形","prop":"formation"},{"label":"保留","prop":"keep"},{"label":"用户识别码","prop":"userId"},{"label":"目的地","prop":"destination"},{"label":"威胁等级","prop":"threatLevel"},{"label":"可信度","prop":"credibility"},{"label":"型号","prop":"model"},{"label":"重要性","prop":"importance"},{"label":"数据链批号序列","prop":"dataBatchNumber"},{"label":"情报装备内码","prop":"informationEquipmentCode"},{"label":"作战装备内码","prop":"combatEquipmentCode"},{"label":"作战型号内码","prop":"combatModelCode"},{"label":"军标代号","prop":"standardCode"},{"label":"军库代号","prop":"libraryCode"}]'
      ),
      // 空情
      airColumn: JSON.parse(
        '[{"label":"目标类型","prop":"targetType"},{"label":"关键字","prop":"keyWord"},{"label":"批号","prop":"batchNumber"},{"label":"敌我属性","prop":"attribute"},{"label":"机型","prop":"models"},{"label":"数量","prop":"amount"},{"label":"飞行员","prop":"aviator"},{"label":"国家地区","prop":"countryRegion"},{"label":"队形","prop":"formation"},{"label":"挂弹","prop":"hangBomb"},{"label":"余油","prop":"remainingOil"},{"label":"任务","prop":"task"},{"label":"型号","prop":"type"},{"label":"机号","prop":"machineNum"},{"label":"平台编识码","prop":"platformID"},{"label":"目标种类","prop":"targetSpecies"},{"label":"环境类别","prop":"environmentType"},{"label":"部别","prop":"forceType"},{"label":"状态","prop":"status"},{"label":"长机标识","prop":"longMachineSign"},{"label":"横滚","prop":"rollCross"},{"label":"俯仰","prop":"rollUp"},{"label":"跳伞识别","prop":"parachutingSign"},{"label":"起飞机场","prop":"beginAirport"},{"label":"降落机场","prop":"arriveAirport"},{"label":"备降机场","prop":"alternateAirport"},{"label":"信息来源","prop":"messageSource"},{"label":"二次代码","prop":"secondCode"},{"label":"附加信息","prop":"additionalInfo"},{"label":"首点时间","prop":"firstTime"},{"label":"目标标识","prop":"targetSign"},{"label":"任务企图","prop":"taskGoal"},{"label":"接收时间","prop":"receiveTime"},{"label":"是否保留","prop":"isKeep"},{"label":"可信度","prop":"credibility"},{"label":"装备内码","prop":"equipmentCode"},{"label":"军库代号","prop":"libraryCode"},{"label":"军标代号","prop":"standardCode"}]'
      ),
      // 北斗
      dipperColumn: JSON.parse(
        '[{"label":"北斗ID号","prop":"targetId"},{"label":"北斗别名","prop":"targetName"},{"label":"部队番号","prop":"insititute"},{"label":"部队内码","prop":"forcesCode"},{"label":"部队简称","prop":"forcesAsName"},{"label":"部队级别","prop":"forcesLevel"},{"label":"当前执行任务","prop":"currentTask"},{"label":"北斗设备类型","prop":"bdEquipmentType"},{"label":"军民用","prop":"militaryCivilianUse"},{"label":"军兵种","prop":"armBranch"},{"label":"军标库号","prop":"militaryStandardLibNumber"},{"label":"军标代号","prop":"militaryCode"}]'
      ),
      // 航势信息
      rowColumn: JSON.parse(
        '[{"label":"时间","prop":"seaTime"},{"label":"经度","prop":"longitude"},{"label":"纬度","prop":"latitude"},{"label":"高度","prop":"height"},{"label":"航向","prop":"course"},{"label":"航速（海里/小时）","prop":"speed"}]'
      ),
      selDatas: [],
      airplaneImage
    }
  },
  computed: {
    // 模糊搜索
    tableFilterData() {
      const search = this.search
      if (search) {
        return this.tableData.filter(data => {
          return Object.keys(data).some(key => {
            return (
              String(data[key])
                .toLowerCase()
                .indexOf(search) > -1
            )
          })
        })
      }
      return this.tableData
    }
    // 页码总条数（测试）
    // pagerTotal() {
    //   return this.tableFilterData.length;
    // }
  },
  watch: {
    // 监听选项卡切换（海情、空情、北斗）
    condition(condition, preCondition) {
      // console.log(condition);
      this.condition = condition
      this.conditionChange(preCondition)
    },
    tableFilterData: {
      handler() {
        this.$nextTick(() => {
          // 获取列的勾选值
          var tabelCheckRow = this.getTabelCheckRow()
          for (let index = 0; index < tabelCheckRow.length; index++) {
            const element = tabelCheckRow[index]
            this.$refs.multipleTable.toggleRowSelection(element)
          }
        })
      },
      deep: true
    }
  },
  mounted() {
    // mapboxgl.accessToken =
    //   'pk.eyJ1IjoibWFvcmV5IiwiYSI6ImNqNWhrenIwcDFvbXUyd3I2bTJxYzZ4em8ifQ.KHZIehQuWW9AsMaGtATdwA'
    // this.map = new mapboxgl.Map({
    //   container: 'map',
    //   style: {
    //     // 设置版本号，一定要设置
    //     version: 8,
    //     // 添加来源
    //     sources: {
    //       tdtVec: {
    //         // 类型为栅格瓦片
    //         type: 'raster',
    //         tiles: [
    //           // 请求地址
    //           // this.vecUrl + '&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles'
    //           'http://192.168.1.18:8857/tile/service/v1/tile?map=1&x={x}&y={y}&z={z}'
    //         ],
    //         // 分辨率
    //         tileSize: 256
    //       }
    //       // 'tdtCva': tdtCva
    //     },
    //     layers: [
    //       {
    //         // 图层id，要保证唯一性
    //         id: 'tdtVec',
    //         // 图层类型
    //         type: 'raster',
    //         // 数据源
    //         source: 'tdtVec',
    //         // 图层最小缩放级数
    //         minzoom: 0,
    //         // 图层最大缩放级数
    //         maxzoom: 24
    //       }
    //     ]
    //   },
    //   center: [109.0469971, 34.11899951], // starting position [lng, lat]
    //   zoom: 11
    // })
    // const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
    // mapboxgl.accessToken =
    //   'pk.eyJ1IjoibWFvcmV5IiwiYSI6ImNqNWhrenIwcDFvbXUyd3I2bTJxYzZ4em8ifQ.KHZIehQuWW9AsMaGtATdwA'
    // this.map = new mapboxgl.Map({
    //   container: 'map', // container id
    //   style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    //   center: [108.72, 34.36], // starting position [lng, lat]
    //   zoom: 9 // starting zoom
    // })
    // const language = new MapboxLanguage({ defaultLanguage: 'zh' }) // 地图加到显示为中文
    // this.map.addControl(language)
    // this.$refs.MapOl.addLayerAndGraphics(airplaneImage)
    // 初次进入页面的时候获取海情表格的数据；

    this.getSeaTableData()
  },
  methods: {
    // index配置   自定义序号
    indexMethod(index) {
      return index + this.pager.pageSize * (this.pager.pageNum - 1) + 1
    },
    // 获取地理图标最后的一项数值
    getMapPointData() {
      var arr = this.mapLineData
      // console.log(this.mapLineData);

      // 最后一项坐标
      this.mapPointData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              // 坐标系  取坐标的最后一项
              coordinates: arr[arr.length - 1]
            }
          }
        ]
      }
      // console.log(this.mapPointData);
    },
    // 获取地图数据
    getMapData() {
      if (this.condition === 'seaCondition') {
        // console.log("海清");
        if (this.tabelCheckRowSea[0] !== undefined && this.tabelCheckRowSea.length > 0) {
          const tabelCheckRow = this.tabelCheckRowSea
          console.log(tabelCheckRow)

          let machineSideNumber = ''
          machineSideNumber = tabelCheckRow.map(item => {
            return item.machineSideNumber
          })
          // console.log(machineSideNumber);
          machineSideNumber = machineSideNumber.toString()
          // console.log(machineSideNumber);

          const params = {
            machineSideNumber: machineSideNumber,
            startDate: this.startDate
          }
          // console.log(params);

          // let arr = [];
          API.getSeaTrack(params).then(res => {
          // console.log(res.data);
            this.mapLineData = []
            res.data.forEach(item => {
              this.mapLineData.push([
                Number(item.longitude),
                Number(item.latitude)
              ])
            })
            console.log(this.mapLineData)

            tabelCheckRow.map(item => {
            // 新增线

              this.map.on('load', () => {
                this.map.addLayer({
                  id: item.id + 'line',
                  type: 'line',
                  source: {
                    type: 'geojson',
                    data: {
                      type: 'Feature',
                      geometry: {
                        type: 'LineString',
                        coordinates: this.mapLineData
                      }
                    }
                  },
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': 'red',
                    'line-width': 3
                  }
                })
              })

              // 新增点
              this.map.on('load', () => {
                this.map.addLayer({
                  id: item.id + 'point',
                  type: 'symbol',
                  source: {
                    type: 'geojson',
                    data: {
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: this.mapLineData[this.mapLineData.length - 1]
                      }
                    }
                  },
                  layout: {
                    'icon-image': 'iconImg',
                    'icon-size': 1.4,
                    'icon-offset': [10, -10]
                  }
                })
              })
            })
            this.mapLineData = []
          })
        } else {
          return
        }
      } else if (this.condition === 'airCondition') {
        if (this.tabelCheckRowAir[0] !== undefined && this.tabelCheckRowAir.length > 0) {
        // 获取默认显示第一条的数据
          const tabelCheckRow = this.tabelCheckRowAir
          // console.log(tabelCheckRow);

          let machineNum = ''
          machineNum = tabelCheckRow.map(item => {
            return item.machineNum
          })

          // console.log(machineNum);
          machineNum = machineNum.toString()
          // console.log(machineNum);
          const params = {
            machineNum: machineNum,
            startDate: this.startDate
          }
          // let arr = [];
          API.getAirTrack(params).then(res => {
          // console.log(res.data);
            this.mapLineData = []
            res.data.forEach(item => {
              this.mapLineData.push([
                Number(item.longitude),
                Number(item.latitude)
              ])
            })
            // console.log(this.mapLineData);

            tabelCheckRow.map(item => {
            // 新增线
              this.map.on('load', () => {
                this.map.addLayer({
                  id: item.id + 'line',
                  type: 'line',
                  source: {
                    type: 'geojson',
                    data: {
                      type: 'Feature',
                      properties: {},
                      geometry: {
                        type: 'LineString',
                        coordinates: this.mapLineData
                      }
                    }
                  },
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': 'red',
                    'line-width': 3
                  }
                })
              })

              // 新增点
              this.map.on('load', () => {
                this.map.addLayer({
                  id: item.id + 'point',
                  type: 'symbol',
                  source: {
                    type: 'geojson',
                    data: {
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: this.mapLineData[this.mapLineData.length - 1]
                      }
                    }
                  },
                  layout: {
                    'icon-image': 'iconImg',
                    'icon-size': 1.4,
                    'icon-offset': [10, -10]
                  }
                })
              })
            })
          })
        } else {
          return
        }
      } else if (this.condition == 'dipper') {
        if (this.tabelCheckRowAir[0] !== undefined && this.tabelCheckRowAir.length > 0) {
          console.log('北斗')
          const tabelCheckRow = this.tabelCheckRowDipper
          // console.log(tabelCheckRow);

          let targetId = ''
          targetId = tabelCheckRow.map(item => {
            return item.targetId
          })
          // console.log(targetId);
          targetId = targetId.toString()
          // console.log(targetId);

          const params = {
            startDate: this.startDate,
            targetId: targetId
          }
          // console.log(params);

          // let arr = [];
          API.getBdTrack(params).then(res => {
          // console.log(res.data);
            this.mapLineData = []
            res.data.forEach(item => {
              this.mapLineData.push([
                Number(item.longitude),
                Number(item.latitude)
              ])
            })
            // console.log(this.mapLineData);

            tabelCheckRow.map(item => {
            // 新增线
              this.map.on('load', () => {
                this.map.addLayer({
                  id: item.id + 'line',
                  type: 'line',
                  source: {
                    type: 'geojson',
                    data: {
                      type: 'Feature',
                      properties: {},
                      geometry: {
                        type: 'LineString',
                        coordinates: this.mapLineData
                      }
                    }
                  },
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': 'red',
                    'line-width': 3
                  }
                })
              })
              // 新增点
              this.map.on('load', () => {
                this.map.addLayer({
                  id: item.id + 'point',
                  type: 'symbol',
                  source: {
                    type: 'geojson',
                    data: {
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: this.mapLineData[this.mapLineData.length - 1]
                      }
                    }
                  },
                  layout: {
                    'icon-image': 'iconImg',
                    'icon-size': 1.4,
                    'icon-offset': [10, -10]
                  }
                })
              })
            })
          })
        } else {
          return
        }
      }
    },

    showTable() {
      this.bShowTable = !this.bShowTable
    },
    // 获取表格勾选列
    getTabelCheckRow(condition) {
      condition = condition || this.condition
      // 海情
      if (condition === 'seaCondition') {
        return this.tabelCheckRowSea
      }
      // 空情
      else if (condition === 'airCondition') {
        return this.tabelCheckRowAir
      }
      // 北斗
      else if (condition === 'dipper') {
        return this.tabelCheckRowDipper
      }
    },
    // 获取海情表格的数据
    getSeaTableData() {
      this.allTabData = []
      const data = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        // dataFlag:this.dataFlag,
        startDate: this.startDate
      }
      // console.log(data);

      this.tableColumn = this.seaColumn

      API.getSeaList(
        data,
        this.pager.pageNum,
        this.pager.pageSize,
        this.startDate
      ).then(res => {
        // console.log(res);

        const { code, rows, message, total } = res
        // const total = rows.length;
        // console.log(data)

        if (code === 200) {
          this.allTabData = rows
          this.tableData = this.allTabData.slice(0, 10)
          this.pager.total = total
          // 如果是初次进来页面，设置默认选择第一条数据
          this.bFirstLoadAir = true
          if (this.bFirstLoadAir) {
            // 海情表格
            this.tabelCheckRowSea = [this.tableData[0]]
            // const _this = this
            // console.log(this.tabelCheckRowSea);
            // this.map.on('load', function() {
            //   _this.map.loadImage(airplaneImage, (error, image) => {
            //     if (error) throw error
            //     if (_this.map.hasImage('iconImg')) {
            //       _this.map.updateImage('iconImg', image)
            //     } else {
            //       _this.map.addImage('iconImg', image)
            //     }
            //   })
            // })

            // 获取地图的数据
            this.getMapData()
          }
          this.bFirstLoadSea = false
        } else {
          this.$message.error(message)
        }
      })
    },
    // 获取空情表格的数据
    getAirTableData() {
      console.log(222, this.allTabData)
      this.allTabData = []
      const data = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        // dataFlag:this.dataFlag,
        startDate: this.startDate
      }
      console.log(data)

      this.tableColumn = this.airColumn

      API.getAirTableData(data, this.pager.pageNum, this.pager.pageSize, this.startDate).then(res => {
        const { code, rows, message, total } = res
        // const total = data.length;
        if (code === 200) {
          this.allTabData = rows
          this.tableData = this.allTabData.slice(0, 10)
          this.pager.total = total
          console.log(this.allTabData)

          // 如果是初次进来页面，设置默认选择第一条数据
          if (this.bFirstLoadAir) {
            this.bFirstLoadSea = false
            // 空情表格
            this.tabelCheckRowAir = [this.tableData[0]]
            // console.log(this.tabelCheckRowAir);

            // 获取地图的数据
            this.getMapData()
          }
        } else {
          this.$message.error(message)
        }
      })
    },
    // 获取北斗表格的数据
    getDipperTableData() {
      this.allTabData = []
      const data = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        // dataFlag:this.dataFlag,
        startDate: this.startDate
      }
      this.tableColumn = this.dipperColumn

      API.getBdList(
        data,
        this.pager.pageNum,
        this.pager.pageSize,
        this.startDate
      ).then(res => {
        const { code, total, message, rows } = res
        // const total = rows.length;
        // console.log(data);

        if (code === 200) {
          this.allTabData = rows
          this.tableData = this.allTabData.slice(0, 10)
          this.pager.total = total
          // 如果是初次进来页面，设置默认选择第一条数据
          if (this.bFirstLoadAir) {
            this.bFirstLoadSea = false
            // 空情表格
            this.tabelCheckRowDipper = [this.tableData[0]]
            // console.log(this.tabelCheckRowDipper);

            // 获取地图的数据
            this.getMapData()
          }
        } else {
          this.$message.error(message)
        }
      })
    },
    // 获取态势信息表格的数据
    getRowTableData(row) {
      if (this.condition === 'seaCondition') {
        // let machineSideNumber = ''
        // machineSideNumber = this.tabelCheckRowSea.map(item => {
        //   return item.machineSideNumber
        // })
        // machineSideNumber = machineSideNumber.toString()
        const params = {
          machineSideNumber: row.machineSideNumber,
          startDate: this.startDate
        }
        console.log(params)

        API.getSeaTrack(params).then(res => {
          this.bFirstLoadDipper = false
          this.bFirstLoadAir = false
          this.dialogTableVisible = true
          const { code, data, message } = res
          const total = data.length
          // console.log(data);

          if (code === 200) {
            this.rowData = data
          } else {
            this.$message.error(message)
          }
        })
      } else if (this.condition === 'airCondition') {
        // console.log(this.rowColumn)
        this.rowColumn = JSON.parse(
          '[{"label":"时间","prop":"airTime"},{"label":"经度","prop":"longitude"},{"label":"纬度","prop":"latitude"},{"label":"高度","prop":"height"},{"label":"航向","prop":"course"},{"label":"航速（海里/小时）","prop":"speed"}]'
        )
        // let machineNum = ''
        // machineNum = this.tabelCheckRowAir.map(item => {
        //   return item.machineNum
        // })

        // console.log(machineNum)
        // machineNum = machineNum.toString()
        // console.log(machineNum)
        const params = {
          machineNum: row.machineNum,
          startDate: this.startDate
        }
        console.log(params)
        // let arr = [];
        API.getAirTrack(params).then(res => {
          this.bFirstLoadDipper = false
          this.bFirstLoadSea = false
          this.dialogTableVisible = true
          const { code, data, message } = res
          const total = data.length
          // console.log(data);

          if (code === 200) {
            this.rowData = data
          } else {
            this.$message.error(message)
          }
        })

        // console.log(222);
      } else if (this.condition === 'dipper') {
        this.rowColumn = JSON.parse(
          '[{"label":"时间","prop":"positioningTime"},{"label":"经度","prop":"longitude"},{"label":"纬度","prop":"latitude"},{"label":"高度","prop":"height"},{"label":"航向","prop":"course"},{"label":"航速（海里/小时）","prop":"speed"}]'
        )
        // console.log('北斗')
        // console.log(tabelCheckRow);

        // let targetId = ''
        // targetId = this.tabelCheckRowDipper.map(item => {
        //   return item.targetId
        // })
        // // console.log(targetId);
        // targetId = targetId.toString()
        // console.log(targetId);

        const params = {
          startDate: this.startDate,
          targetId: row.targetId
        }
        console.log(params)

        // let arr = [];
        API.getBdTrack(params).then(res => {
          // console.log(res.data);
          // res.data.forEach(item => {
          //   this.mapLineData.push([
          //     Number(item.longitude),
          //     Number(item.latitude)
          //   ]);
          // });
          // console.log(this.mapLineData);
          this.bFirstLoadDipper = false
          this.bFirstLoadSea = false
          this.dialogTableVisible = true
          const { code, data, message } = res
          const total = data.length
          // console.log(data);

          if (code === 200) {
            this.rowData = data
          } else {
            this.$message.error(message)
          }
        })
      }
    },
    // 清除地图的数据
    clearMapData(selection) {
      // console.log(selection);
      if (selection.length > 0 && selection[0] !== undefined) {
        // 获取列的勾选值
        var tabelCheckRow = selection
        // console.log(tabelCheckRow);
        // console.log(tabelCheckRow);

        // 清除地图的图层
        for (let index = 0; index < tabelCheckRow.length; index++) {
          const element = tabelCheckRow[index]
          var layerId = element.id

          this.map.getLayer(layerId + 'line') &&
          this.map.removeLayer(layerId + 'line')
          this.map.getSource(layerId + 'line') &&
          this.map.removeSource(layerId + 'line')
          // 点
          this.map.getLayer(layerId + 'point') &&
          this.map.removeLayer(layerId + 'point')
          this.map.getSource(layerId + 'point') &&
          this.map.removeSource(layerId + 'point')
        // 图片
        // this.map.hasImage(layerId + "icon") &&
        //   this.map.removeImage(layerId + "icon");
        }
      }
    },
    // 切换按钮
    conditionChange(preCondition) {
      // 上一个按钮的值
      // console.log(preCondition);
      // 修复切换选项卡表格高度塌陷的问题
      this.$nextTick(() => {
        // 页面加载完成后，重新渲染表格
        this.$refs.multipleTable.doLayout()
      })
      // 清空搜索条件
      this.search = ''
      // 页码恢复到第一页
      this.pager.pageNum = 1
      // 海情
      if (this.condition === 'seaCondition') {
        this.tableColumn = this.seaColumn
        // this.bFirstLoadAir = false
        // this.mapLineData = []
        this.getSeaTableData()
        this.clearMapData(this.tabelCheckRowAir)
      } else if (this.condition === 'airCondition') { // 空情
        this.tableColumn = this.airColumn
        // this.mapLineData = []
        this.getAirTableData()
        this.clearMapData(this.tabelCheckRowDipper)
      } else if (this.condition === 'dipper') { // 北斗
        this.tableColumn = this.dipperColumn
        // this.mapLineData = []
        this.getDipperTableData()
        this.clearMapData(this.tabelCheckRowSea)
      }
      // 更新地图的数据
      // this.getMapData();
    },
    // 更新地图数据
    updateMapData(currentLayerId) {
      // console.log('11111:',currentLayerId);

      // 如果存在线，则更换线路
      if (this.map.getLayer(currentLayerId + 'line')) {
        // console.log(111);
        // console.log('22222:',currentLayerId);

        // 更新线路
        this.map.getSource(currentLayerId + 'line').setData(this.mapLineData)
        // 更新图标位置和样式  this.mapPointData 为图标的最后一项的坐标点
        this.map.getSource(currentLayerId + 'point').setData(this.mapPointData)

        this.map.loadImage(airplaneImage, (error, image) => {
          if (error) throw error
          if (this.map.hasImage('iconImg')) {
            this.map.updateImage('iconImg', image)
          } else {
            this.map.addImage('iconImg', image)
          }
        })
        // }
      } else {
        // 不存在线则新增
        this.map.addSource(currentLayerId + 'line', {
          type: 'geojson',
          data: this.mapLineData
        })
        // 添加图层
        this.map.addLayer({
          id: currentLayerId + 'line',
          type: 'line',
          source: currentLayerId + 'line',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': 'red',
            'line-width': 3
          }
        })

        // 添加包含geojson数据的数据源
        this.map.addSource(currentLayerId + 'point', {
          type: 'geojson',
          data: this.mapPointData
        })
        if (this.condition === 'seaCondition') {
          this.map.loadImage(armyImage, (error, image) => {
            if (error) throw error
            this.map.addImage(currentLayerId + 'icon', image)
            // console.log(currentLayerId + "icon");
            this.map.addLayer({
              id: currentLayerId + 'point',
              type: 'symbol',
              source: currentLayerId + 'point',
              layout: {
                'icon-image': currentLayerId + 'icon',
                'icon-size': 1.4,
                'icon-offset': [10, -10]
              }
            })
          })
        } else {
          this.map.loadImage(airplaneImage, (error, image) => {
            if (error) throw error
            this.map.addImage(currentLayerId + 'icon', image)
            // 添加图片图层
            this.map.addLayer({
              id: currentLayerId + 'point',
              type: 'symbol',
              source: currentLayerId + 'point',
              layout: {
                'icon-image': currentLayerId + 'icon',
                'icon-size': 1.4,
                'icon-offset': [10, -10]
              }
            })
          })
        }
      }
    },
    // 点击列表的行
    tabRowClick(row, column, event) {
      this.getRowTableData(row)
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      // 获取空情
      this.getAirTableData()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.tableData = this.allTabData.slice((val - 1) * 10, val * 10)

      this.pager.pageNum = val
      if (this.condition === 'seaCondition') {
        this.getSeaTableData()
      } else if (this.condition === 'airCondition') {
        this.getAirTableData()
      } else if (this.condition === 'dipper') {
        this.getDipperTableData()
      }
    },
    selectionChange(selection) {
      this.clearMapData(this.tabelCheckRowSea)
      // console.log(111);

      // console.log(this.tabelCheckRowSea);

      if (selection.length > 0 && selection[0] !== undefined) {
        selection.map(v => {
          if (this.condition === 'seaCondition') {
            console.log(111, 'seaCondition')

            API.getSeaTrack({
              machineSideNumber: v.machineSideNumber.toString(),
              startDate: this.startDate
            }).then(res => {
              this.mapLineData = []
              res.data.forEach(item => {
                this.mapLineData.push([
                  Number(item.longitude),
                  Number(item.latitude)
                ])
              })
              // 新增线
              this.map.addLayer({
                id: v.id + 'line',
                type: 'line',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: this.mapLineData
                    }
                  }
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': 'red',
                  'line-width': 3
                }
              })
              // console.log(this.mapLineData[this.mapLineData.length - 1]);
              this.map.addLayer({
                id: v.id + 'point',
                type: 'symbol',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: this.mapLineData[this.mapLineData.length - 1]
                    }
                  }
                },
                layout: {
                  'icon-image': 'iconImg',
                  'icon-size': 1.4,
                  'icon-offset': [10, -10]
                }
              })
            })
            this.mapLineData = []
          } else if (this.condition === 'airCondition') {
            console.log(222, 'airCondition')
            API.getAirTrack({
              machineNum: v.machineNum.toString(),
              startDate: this.startDate
            }).then(res => {
              this.mapLineData = []
              res.data.forEach(item => {
                this.mapLineData.push([
                  Number(item.longitude),
                  Number(item.latitude)
                ])
              })
              console.log(this.mapLineData)

              // 新增线
              this.map.addLayer({
                id: v.id + 'line',
                type: 'line',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: this.mapLineData
                    }
                  }
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': 'red',
                  'line-width': 3
                }
              })
              console.log(this.mapLineData[this.mapLineData.length - 1])
              this.map.addLayer({
                id: v.id + 'point',
                type: 'symbol',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: this.mapLineData[this.mapLineData.length - 1]
                    }
                  }
                },
                layout: {
                  'icon-image': 'iconImg',
                  'icon-size': 1.4,
                  'icon-offset': [10, -10]
                }
              })
            })
            this.mapLineData = []
          } else if (this.condition === 'dipper') {
            console.log(333, 'dipper')
            API.getBdTrack({
              targetId: v.targetId.toString(),
              startDate: this.startDate
            }).then(res => {
              this.mapLineData = []
              res.data.forEach(item => {
                this.mapLineData.push([
                  Number(item.longitude),
                  Number(item.latitude)
                ])
              })
              console.log(this.mapLineData)
              // 新增线
              this.map.addLayer({
                id: v.id + 'line',
                type: 'line',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: this.mapLineData
                    }
                  }
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': 'red',
                  'line-width': 3
                }
              })
              console.log(this.mapLineData[this.mapLineData.length - 1])
              this.map.addLayer({
                id: v.id + 'point',
                type: 'symbol',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: this.mapLineData[this.mapLineData.length - 1]
                    }
                  }
                },
                layout: {
                  'icon-image': 'iconImg',
                  'icon-size': 1.4,
                  'icon-offset': [10, -10]
                }
              })
            })
            this.mapLineData = []
          }
        })
      } else {
        this.clearMapData(this.tabelCheckRowSea)
      }
      this.tabelCheckRowSea = selection
    },
    searchTime(value) {
      this.startDate = value
      if (this.condition === 'seaCondition') {
        this.getSeaTableData()
      } else if (this.condition === 'airCondition') {
        this.getAirTableData()
      } else if (this.condition === 'dipper') {
        this.getDipperTableData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#map {
  padding: 0px;
  position: relative;
}
.timeSearch {
  position: absolute;
  top: 66px;
  left: 40px;
  z-index: 1;
}
.tableTop {
  height: 54px;
  padding-top: 7px;
  background: #fff;
}
%tableIcon {
  font-size: 25px;
  position: absolute;
  top: 15px;
  right: 15px;
}
.showTableIcon {
  @extend %tableIcon;
  transform: rotate(-90deg);
}
.hideTableIcon {
  @extend %tableIcon;
  transform: rotate(90deg);
}
.search {
  display: inline-block;
  width: 250px;
  top: -3px;
  left: 50px;
  position: relative;
}
.table {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  z-index: 999;
}
.el-dialog__header {
  height: 38px;
  background: #409eff;
  line-height: 33px;
  padding-left: 15px;
  padding: 3px 0 0 15px;
}
.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #fff;
}
.el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
.el-dialog__headerbtn {
  top: 11px;
}

.el-dialog__body {
  padding: 20px 20px;
}
.el-dialog__footer {
  padding: 0px 20px 20px 20px;
}
.pager-section {
  background: #fff;
}
.satelliteBtn {
  position: relative;
  bottom: 6px;
  left: 18px;
}
</style>
