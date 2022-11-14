<template>
  <div class="map-container">
    <template v-if="!isLoadingMap && isMapNormal">
      <div class="map-tools">
        <template v-for="(item, index) in mapTools">
          <div
            v-if="item.toolName === 'PointSelect'"
            :key="index"
            class="point-select-section"
          >
            <div class="input">
              <el-input
                v-model="pointSelect.radius"
                placeholder="半径"
                size="mini"
                type="text"
                title="单位:km"
              />
            </div>
            <i
              class="icon el-icon-location"
              :title="item.title"
              @click="onHandlePointSelect"
            />
            <div class="input">
              <el-input
                v-model="pointSelect.longitude"
                placeholder="经度"
                size="mini"
                class="input"
                disabled
              />
            </div>
            <div class="input">
              <el-input
                v-model="pointSelect.latitude"
                placeholder="纬度"
                size="mini"
                class="input"
                disabled
              />
            </div>
          </div>
          <div
            v-else
            :key="index"
            class="map-tools-item"
            :title="item.title"
            :class="currentMapTool === item.type ? 'active' : ''"
            @click="onHandleClick(item.method)"
          >
            <i :class="item.icon" />
          </div>
        </template>
      </div>
      <div id="MapContainer" ref="map" class="map-section" @contextmenu.prevent="" @mousedown.prevent.right.prevent="changeRotation('down',$event)" />
      <!-- 显示图片区域 -->
      <img
        :src="dataURL"
        style="
        position: absolute;
        top: 10000px;
        display: none;
        width: 800px;
        height: 300px;
      "
        class="real_pic"
      >
    </template>
    <div v-else class="page-error-info">
      <div v-if="isLoadingMap" class="info-text">加载中...</div>
      <div v-if="!isMapNormal" class="info-text">地图服务异常!</div>
    </div>
    <!-- Popup -->
    <div id="popup" class="ol-popups">
      <a id="popup-closer" href="#" class="ol-popup-closer" />
      <div id="popup-content" />
    </div>
  </div>
</template>

<script>
import Map from 'ol/Map'
import * as olControl from 'ol/control'
import OSM from 'ol/source/OSM'
import WMTS from 'ol/source/WMTS'
import XYZ from 'ol/source/XYZ'
import WMTSTilegrid from 'ol/tilegrid/WMTS'
import View from 'ol/View'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'
import VectorSource from 'ol/source/Vector'
import { Modify } from 'ol/interaction'
import { Cluster } from 'ol/source'
import Feature from 'ol/Feature'
import Icon from 'ol/style/Icon'
import { format } from 'ol/coordinate'
import MousePosition from 'ol/control/MousePosition.js'

import FlagIcons from '@/assets/icons/flag.png'
import YK from '@/icons/img/jbImg/yk.png'
import JTJD from '@/icons/img/jbImg/jthjjd.png'
import JTMB from '@/icons/img/jbImg/jtmb.png'
import MTGC from '@/icons/img/jbImg/mtgc.png'
import JCGC from '@/icons/img/jbImg/jcgc.png'
import TXGC from '@/icons/img/jbImg/txgc.png'
import CKGC from '@/icons/img/jbImg/ckgc.png'
import RFGC from '@/icons/img/jbImg/rfgc.png'
import DPGC from '@/icons/img/jbImg/rfgc.png'
import KDDK from '@/icons/img/jbImg/kddkjc.png'
import HSHHJ from '@/icons/img/jbImg/hshhj.png'
import XZ from '@/icons/img/jbImg/xz.png'
import YY from '@/icons/img/jbImg/yy.png'

import troopStation from '@/assets/icons/troop_station.png'
import Green from '@/icons/img/mapSearch/green.png'
import Blue from '@/icons/img/mapSearch/blue.png'
import hosptail from '@/icons/img/mapSearch/hosptail.png'
import Point from 'ol/geom/Point'
import MapMeasure from './mixins/MapMeasure'
import MapSelectSearch from './mixins/MapSelectSearch.vue'
import RedMarker from '@/icons/img/mapSearch/red.png'
import armyImage from '@/assets/icons/army.png'
import airplaneImage from '@/assets/icons/airplane.png'
import surfaceImage from '@/assets/icons/surface_forces.png'
import html2canvas from 'html2canvas'
import GeoJSON from 'ol/format/GeoJSON'
import { LineString } from 'ol/geom'
import Overlay from 'ol/Overlay'
import { boundingExtent, getTopLeft, getWidth } from 'ol/extent'
import { get as getProjection } from 'ol/proj'
import { parseTime } from '@/utils/index'

// 保存截图函数插件
// import { saveAs } from 'file-saver'

// 行政区域  电子所地址  http://22.17.12.10:8090/iserver/services/map-mongodb-Map/wmts-china
const baseLayerUrl = '/gis-api/iserver/services/map-mongodb-Map/wmts-china'
// const baseLayerUrl = '/gis-api/tile/service/v1/tile?map=1&x={x}&y={y}&z={z}'
// const baseLayerUrl = 'http://t{0-6}.tianditu.com/cva_c/wmts?tk=60a12b5bc3de61a0306f15c338ca02a1'

// url: 'http://192.168.10.240:8088/tilecache/service/tms/1.0.0/Global_Image-JPEG-4326@EPSG:4326@jpeg/{z}/{x}/{-y}.jpeg',

// 底图 电子所地址
const baseLayerUrls = '/gis-api/iserver/services/map-mongodb-GoogleMap/wmts-china'
// const baseLayerUrls = '/gis-aps/tilecache/service/tms/1.0.0/Global_Image-JPEG-4326@EPSG:4326@jpeg/{z}/{x}/{-y}.jpeg'
// const baseLayerUrls = 'http://t{0-6}.tianditu.com/vec_c/wmts?tk=60a12b5bc3de61a0306f15c338ca02a1'

import bus from '@/utils/bus'
import axios from 'axios'
export default {
  mixins: [MapMeasure, MapSelectSearch],
  props: {
    tools: {
      type: Array,
      default: () => {
        return []
      }
    },
    markerPosition: {
      type: Array,
      default: null
    },
    isAddPopup: {
      type: Boolean,
      default: false
    },
    mouseClicks: {
      type: Boolean,
      default: false
    },
    imgPath: {
      type: String,
      default: ''
    },
    baseDataModule: {
      type: Object,
      default: () => null
    },
    leftTopX: {
      type: Number,
      default: 0
    },
    leftTopY: {
      type: Number,
      default: 0
    },
    // eslint-disable-next-line vue/prop-name-casing
    RectWidth: {
      type: Number,
      default: 0
    },
    // eslint-disable-next-line vue/prop-name-casing
    RectHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      map: null,
      // 当前使用地图工具
      currentMapTool: '',
      // 地图配置
      mapConfig: {
        // center: [107.0144030909593, 35.342593661016916],
        center: [116.40517633118256, 40.26494118395431], // 接近北京市的中心点
        zoom: 7,
        maxZoom: 15,
        tools: [
          {
            type: '1',
            title: 'Home',
            toolName: 'Home',
            method: 'onHandleRecover',
            icon: 'iconfont icon-home'
          },
          {
            type: '2',
            title: '测距',
            toolName: 'MeasureLine',
            method: 'onHandleMeasureLine',
            icon: 'iconfont icon-celiang'
          },
          {
            type: '3',
            title: '测面',
            toolName: 'MeasureArea',
            method: 'onHandleMeasureArea',
            icon: 'iconfont icon-ziyuan'
          },
          {
            type: '4',
            title: '标记',
            toolName: 'Mark',
            method: 'onHandleMark',
            icon: 'iconfont icon-biaoji'
          },
          {
            type: '6',
            title: '清除',
            toolName: 'Clear',
            method: 'onHandleClear1',
            icon: 'iconfont icon-qingchu'
          },
          {
            type: '7',
            title: '放大',
            toolName: 'ExtentLarge',
            method: 'onHandleExtentLarge',
            icon: 'iconfont icon-fangda'
          },
          {
            type: '8',
            title: '缩小',
            toolName: 'ExtentSmall',
            method: 'onHandleExtentSmall',
            icon: 'iconfont icon-suoxiao'
          },
          {
            type: '9',
            title: '框选',
            toolName: 'RectSelect',
            method: 'onHandleRectSelect',
            icon: 'iconfont icon-kuangxuan'
          },
          {
            type: '10',
            title: '圈选',
            toolName: 'CircleSelect',
            method: 'onHandleCircleSelect',
            icon: 'iconfont icon-quanxuan'
          },
          {
            type: '11',
            title: '多边形选',
            toolName: 'PolygonSelect',
            method: 'onHandlePolygonSelect',
            icon: 'iconfont icon-duobianxingxuan'
          },
          {
            type: '12',
            title: '点选',
            toolName: 'PointSelect',
            method: 'onHandlePointSelect',
            icon: 'iconfont icon-jieping'
          },
          {
            type: '13',
            title: '截图',
            toolName: 'Screenshot',
            method: 'onHandleScreenshot',
            icon: 'iconfont icon-jieping'
          }
        ]
      },
      // 点选字段
      pointSelect: {
        radius: '', // 半径
        longitude: '', // 经度
        latitude: '' // 纬度
      },
      // 地图工具
      mapTools: [],
      // 地图标注图层
      graphicLayer: null,
      // 测量图层
      measureLayer: null,
      // 测量矢量图形
      measureSource: new VectorSource(),
      // 是否开始测量
      isStartMeasure: false,
      // 绘制图层
      drawLayer: null,
      // 绘制图形资源
      drawSource: new VectorSource(),
      // 绘制对象
      drawObj: null,
      // 是否标记
      isMarker: false,
      // 标记图层
      markerLayer: null,
      // 标记资源
      markerSource: new VectorSource(),
      // 截屏地址
      dataURL: '',
      // 行政区域资源
      regionSource: new VectorSource(),
      // 行政区域图层
      regionLayer: null,
      // 是否在地图初始化的时候添加marker
      isAddMarker: false,
      // 是否正在点选
      isPointSelecting: false,
      // 悬浮窗
      popup: null,
      layerMK: null,
      layerLine: null,
      // 地图是否正在加载
      isLoadingMap: false,
      // 地图服务是否正常
      isMapNormal: true,
      // 聚合对象
      cluster: {}
    }
  },
  watch: {
    tools: {
      handler(val) {
        this.filterTools(val)
      },
      deep: true,
      immediate: true
    },
    markerPosition: {
      handler(val) {
        if (val) {
          this.isAddMarker = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    setTimeout(() => {
      console.log(typeof (this.baseDataModule))
    }, 1000)
    this.initMap()
  },
  methods: {
    // 鼠标右击事件
    changeRotation(type, event) {
      this.$emit('changeRotation', false)
    },

    // 过滤工具
    filterTools(tools) {
      if (tools && tools.length > 0) {
        this.mapTools = []
        tools.forEach((item) => {
          this.mapTools.push(
            this.mapConfig.tools.find((toolItem) => toolItem.toolName === item)
          )
        })
      }
    },
    // 最基础的线上地图
    // 初始化地图
    // initMap() {
    //   this.map = new Map({
    //     layers: [
    //       new TileLayer({
    //         source: new OSM()
    //       })
    //     ],
    //     target: 'MapContainer',
    //     view: new View({
    //       center: [0, 0],
    //       zoom: 2
    //     })
    //   })
    // },

    // 测试的天地图
    initMap() {
      const projection = getProjection('EPSG:4326')
      const projectionExtent = projection.getExtent()
      const size = getWidth(projectionExtent) / 256
      var resolutions = []
      for (var z = 2; z < 19; ++z) {
        resolutions[z] = size / Math.pow(2, z)
      }
      // graphic图层
      this.graphicLayer = new VectorLayer({
        source: new VectorSource()
      })
      // 测量图层
      this.measureLayer = new VectorLayer({
        source: this.measureSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0)'
          }),
          stroke: new Stroke({
            color: '#E74033',
            width: 2
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#E74033'
            })
          })
        }),
        properties: {
          layerId: 'measureLayer'
        }
      })
      // 绘制图层
      this.drawLayer = new VectorLayer({
        source: this.drawSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0)'
          }),
          stroke: new Stroke({
            color: '#E74033',
            width: 2
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#E74033'
            })
          })
        }),
        properties: {
          layerId: 'drawLayer'
        }
      })
      // 标记图层
      this.markerLayer = new VectorLayer({
        source: this.markerSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0)'
          }),
          stroke: new Stroke({
            color: '#E74033',
            width: 2
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#E74033'
            })
          })
        }),
        properties: {
          layerId: 'markerLayer'
        }
      })
      this.regionLayer = new VectorLayer({
        source: this.regionSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0)'
          }),
          stroke: new Stroke({
            color: '#E74033',
            width: 2
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#E74033'
            })
          })
        }),
        properties: {
          layerId: 'regionLayer'
        }
      })
      var baseUrl1 = new TileLayer({
        source: new WMTS({
          name: '中国矢量1-4级',
          url: 'http://t{0-6}.tianditu.com/vec_c/wmts?tk=60a12b5bc3de61a0306f15c338ca02a1',
          layer: 'vec',
          style: 'default',
          matrixSet: 'c',
          format: 'tiles',
          wrapX: true,
          tileGrid: new WMTSTilegrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
          })
        }),
        properties: {
          layerId: 'TileLayers'
        }
      })
      var baseUrl2 = new TileLayer({
        source: new WMTS({
          name: '中国矢量注记1-4级',
          url: 'http://t{0-6}.tianditu.com/cva_c/wmts?tk=60a12b5bc3de61a0306f15c338ca02a1',
          layer: 'cva',
          style: 'default',
          matrixSet: 'c',
          format: 'tiles',
          wrapX: true,
          tileGrid: new WMTSTilegrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
          })
        }),
        properties: {
          layerId: 'TileLayers'
        }
      })

      // 鼠标获取坐标控件
      const mousePositionControl = new MousePosition({
        coordinateFormat: function(coordinate) {
          return format(coordinate, '经度:{x} &nbsp;&nbsp;纬度:{y}', 5)
        },
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      })

      this.map = new Map({
        layers: [
          baseUrl1,
          baseUrl2,
          this.graphicLayer,
          this.measureLayer,
          this.drawLayer,
          this.markerLayer,
          this.regionLayer
        ],
        target: 'MapContainer',
        view: new View({
          center: [123.415419891839, 41.824699541826575],
          // center: [116.40517633118256, 40.26494118395431],
          projection: projection,
          zoom: 7,
          maxZoom: 17,
          minZoom: 1
        })
      })

      // 添加控件到地图
      this.map.addControl(mousePositionControl)

      // 添加marker
      if (this.isAddMarker) {
        this.addMarker(this.markerPosition, true)
      }
      // 添加popup
      if (this.isAddPopup) {
        this.addPopup()

        setTimeout(() => {
          console.log(this.isAddPopup, this.baseDataModule)
          // 基础数据模块
          if (this.baseDataModule) {
            console.log(this.baseDataModule)
            this.addMakerAndShowPopup()
          }
        }, 1000)
      }
      this._bindMapEvents()
    },

    // 之前版本地图
    // initMap() {
    //   var tileSize = 256
    //   var extent = [-180.0, -90.0, 180.0, 90.0]
    //   var maxZoom = 19
    //   var rootResolution = 180.0 / tileSize
    //   var resolutions = []
    //   var matrixIds = []
    //   var projection = 'EPSG:4326'

    //   for (var i = 0; i <= maxZoom; i++) {
    //     resolutions[i] = rootResolution / Math.pow(2, i)
    //     matrixIds[i] = projection + ':' + i
    //   }

    //   // graphic图层
    //   this.graphicLayer = new VectorLayer({
    //     source: new VectorSource()
    //   })
    //   // 测量图层
    //   this.measureLayer = new VectorLayer({
    //     source: this.measureSource,
    //     style: new Style({
    //       fill: new Fill({
    //         color: 'rgba(255, 255, 255, 0)'
    //       }),
    //       stroke: new Stroke({
    //         color: '#E74033',
    //         width: 2
    //       }),
    //       image: new CircleStyle({
    //         radius: 7,
    //         fill: new Fill({
    //           color: '#E74033'
    //         })
    //       })
    //     }),
    //     properties: {
    //       layerId: 'measureLayer'
    //     }
    //   })
    //   // 绘制图层
    //   this.drawLayer = new VectorLayer({
    //     source: this.drawSource,
    //     style: new Style({
    //       fill: new Fill({
    //         color: 'rgba(255, 255, 255, 0)'
    //       }),
    //       stroke: new Stroke({
    //         color: '#E74033',
    //         width: 2
    //       }),
    //       image: new CircleStyle({
    //         radius: 7,
    //         fill: new Fill({
    //           color: '#E74033'
    //         })
    //       })
    //     }),
    //     properties: {
    //       layerId: 'drawLayer'
    //     }
    //   })
    //   // 标记图层
    //   标记图层
    //   this.markerLayer = new VectorLayer({
    //     source: this.markerSource,
    //     style: new Style({
    //       fill: new Fill({
    //         color: 'rgba(255, 255, 255, 0)'
    //       }),
    //       stroke: new Stroke({
    //         color: '#E74033',
    //         width: 2
    //       }),
    //       image: new CircleStyle({
    //         radius: 7,
    //         fill: new Fill({
    //           color: '#E74033'
    //         })
    //       })
    //     }),
    //     properties: {
    //       layerId: 'markerLayer'
    //     }
    //   })
    //   this.regionLayer = new VectorLayer({
    //     source: this.regionSource,
    //     style: new Style({
    //       fill: new Fill({
    //         color: 'rgba(255, 255, 255, 0)'
    //       }),
    //       stroke: new Stroke({
    //         color: '#E74033',
    //         width: 2
    //       }),
    //       image: new CircleStyle({
    //         radius: 7,
    //         fill: new Fill({
    //           color: '#E74033'
    //         })
    //       })
    //     }),
    //     properties: {
    //       layerId: 'regionLayer'
    //     }
    //   })

    //   var resolutions = new Array(16)
    //   var matrixIds = new Array(16)
    //   for (var z = 0; z < 16; ++z) {
    //     resolutions[z] = 0.703125 / Math.pow(2, z)
    //     matrixIds[z] = z
    //   }

    //   // tms图层  底图
    //   // var tmsLayers = new TileLayer({
    //   //   source: new XYZ({
    //   //     url: baseLayerUrls,
    //   //     projection: projection,
    //   //     maxResolution: 180.0 / 256,
    //   //     wrapX: false
    //   //   })
    //   // })

    //   // var tmsLayer = new TileLayer({
    //   //   source: new XYZ({
    //   //     url: baseLayerUrls,
    //   //     layer: 'GoogleMap', // 对应属性ows:Title
    //   //     style: 'default',
    //   //     format: 'image/png',
    //   //     tileMatrixSetID: 'ChinaPublicServices_GoogleMap',
    //   //     maximumLevel: 19,
    //   //     tileMatrixLabels: matrixIds,

    //   //     // projection: projection,
    //   //     maxResolution: 180.0 / 256,
    //   //     wrapX: false
    //   //   })
    //   // })

    //   var tmsLayers = new TileLayer({
    //     opacity: 1,
    //     source: new WMTS({
    //       url: baseLayerUrls,
    //       layer: 'GoogleMap',
    //       matrixSet: 'ChinaPublicServices_GoogleMap',
    //       format: 'image/png',
    //       tileGrid: new WMTSTilegrid({
    //         origin: [-180, 90],
    //         extent: [-180, -180, 180, 180],
    //         resolutions: resolutions,
    //         matrixIds: matrixIds
    //       }),
    //       style: 'default'
    //     }),
    //     properties: {
    //       layerId: 'TileLayers'
    //     }
    //   })

    //   // 行政区域
    //   var layerss = new TileLayer({
    //     opacity: 2,
    //     source: new WMTS({
    //       url: baseLayerUrl,
    //       layer: 'Map',
    //       matrixSet: 'ChinaPublicServices_Map',
    //       format: 'image/png',
    //       tileGrid: new WMTSTilegrid({
    //         origin: [-180, 90],
    //         extent: [-180, -180, 180, 180],
    //         resolutions: resolutions,
    //         matrixIds: matrixIds
    //       }),
    //       style: 'default'
    //     }),
    //     properties: {
    //       layerId: 'TileLayers'
    //     }
    //   })
    //   // 鼠标获取坐标控件
    //   const mousePositionControl = new MousePosition({
    //     coordinateFormat: function(coordinate) {
    //       return format(coordinate, '经度:{x} &nbsp;&nbsp;纬度:{y}', 5)
    //     },
    //     projection: 'EPSG:4326',
    //     className: 'custom-mouse-position',
    //     target: document.getElementById('mouse-position'),
    //     undefinedHTML: '&nbsp;'
    //   })
    //   this.map = new Map({
    //     controls: olControl.defaults({ zoom: false }),
    //     layers: [
    //       tmsLayers,
    //       layerss,
    //       this.graphicLayer,
    //       this.measureLayer,
    //       this.drawLayer,
    //       this.markerLayer,
    //       this.regionLayer
    //     ],
    //     target: 'MapContainer',
    //     view: new View({
    //       center: this.mapConfig.center,
    //       maxZoom: this.mapConfig.maxZoom,
    //       zoom: this.mapConfig.zoom,
    //       projection: 'EPSG:4326'
    //     })
    //   })
    //   // 添加控件到地图
    //   this.map.addControl(mousePositionControl)

    //   // 添加marker
    //   if (this.isAddMarker) {
    //     this.addMarker(this.markerPosition, true)
    //   }
    //   // 添加popup
    //   if (this.isAddPopup) {
    //     this.addPopup()

    //     setTimeout(() => {
    //       console.log(this.isAddPopup, this.baseDataModule)
    //       // 基础数据模块
    //       if (this.baseDataModule) {
    //         console.log(this.baseDataModule)
    //         this.addMakerAndShowPopup()
    //       }
    //     }, 1000)
    //   }
    //   this._bindMapEvents()
    // },
    // 添加地图事件
    _bindMapEvents() {
      const _this = this
      this.map.on('pointermove', (evt) => {
        if (_this.isStartMeasure) {
          _this.pointerMoveHandler(evt)
        } else {
          var pixel = _this.map.getEventPixel(evt.originalEvent)
          var hit = _this.map.hasFeatureAtPixel(pixel)
          if (hit) {
            _this.map.getTargetElement().style.cursor = 'pointer'
          } else {
            _this.map.getTargetElement().style.cursor = ''
          }
          var feature = _this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            return feature
          })
          if (feature) {
            if (_this.popup && !this.baseDataModule) {
              if (Object.keys(_this.cluster).length > 0) {
                console.log('22', feature)
                for (var layerId in _this.cluster) {
                  if (_this.cluster[layerId] !== null) {
                    _this.cluster[layerId].getFeatures(evt.pixel).then((clickedFeatures) => {
                      if (clickedFeatures.length) {
                        // Get clustered Coordinates
                        const features = clickedFeatures[0].get('features')

                        if (feature.getProperties().features.length === 1) {
                          const featureAllData = feature.getProperties().features[0].values_.properties
                          const coordinate = evt.coordinate
                          const name = featureAllData.pointMC
                          // console.log(featureAllData,name)
                          document.getElementById('popup-content').innerHTML = '<div>' + name + '</div>'
                          _this.popup.setPosition(coordinate)
                        }
                      }
                    })
                  }
                }
              }

              if (feature.values_.properties && feature.values_.properties.targetType && feature.values_.properties.targetType === '海情') {
                const coordinate = evt.coordinate
                const name = feature.values_.properties.seaCountryRegion
                console.log('海情', name)
                // //console.log(feature.values_.properties)
                document.getElementById('popup-content').innerHTML = `<div>
                  <div style="font-size: 16px;margin-bottom:15px;"><span style="text-align:right;">敌我属性:</span><span style="color:#F56C6C;">${feature.values_.properties.attribute}</span></div>
                  <div style="font-size: 16px;margin-bottom:15px;"><span style="">机舷号:</span><span style="color:#F56C6C;">${feature.values_.properties.seaMachineSideNumber}</span></div>
                  <div style="font-size: 16px;"><span style="">国家:</span> <span style="color:#F56C6C;">${name}</span></div>
                </div>`

                _this.popup.setPosition(coordinate)
              } else if (feature.values_.properties && feature.values_.properties.targetType && feature.values_.properties.targetType === '空情') {
                console.log('111', feature)

                const coordinate = evt.coordinate
                const name = feature.values_.properties.airCountryRegion
                console.log('空情', name)
                // document.getElementById('popup-content').innerHTML = '<div>' + name + '</div>'
                document.getElementById('popup-content').innerHTML = `<div>
                  <div style="font-size: 16px;margin-bottom:15px;"><span style="text-align:right;">敌我属性:</span><span style="color:#F56C6C;">${feature.values_.properties.attribute}</span></div>
                  <div style="font-size: 16px;margin-bottom:15px;"><span style="">机型:</span><span style="color:#F56C6C;">${feature.values_.properties.airModels}</span></div>
                  <div style="font-size: 16px;"><span style="">国家:</span> <span style="color:#F56C6C;">${name}</span></div>
                </div>`

                _this.popup.setPosition(coordinate)
              } else if (feature.values_.properties && feature.values_.properties.targetType && feature.values_.properties.targetType === '北斗') {
                const coordinate = evt.coordinate
                const name = feature.values_.properties.insititute
                console.log('北斗', feature.values_.properties)
                // document.getElementById('popup-content').innerHTML = '<div>' + name + '</div>'
                document.getElementById('popup-content').innerHTML = `<div>
                  <div style="font-size: 16px;margin-bottom:15px;"><span style="text-align:right;">番号:</span><span style="color:#F56C6C;">${feature.values_.properties.insititute}</span></div>
                  <div style="font-size: 16px;margin-bottom:15px;"><span style="">北斗ID:</span><span style="color:#F56C6C;">${feature.values_.properties.targetId}</span></div>
                </div>`

                _this.popup.setPosition(coordinate)
              } else if (feature.values_.properties) {
                console.log(feature)
                const coordinate = evt.coordinate
                const name = feature.values_.properties.pointMC
                document.getElementById('popup-content').innerHTML = '<div>' + name + '</div>'
                _this.popup.setPosition(coordinate)
              }
            }
          }
        }
      })
      // 地图点击
      this.map.on('click', (evt) => {
        // 聚合点击事件
        for (var layerId in _this.cluster) {
          // console.log(_this.cluster,_this.cluster[layerId])
          if (_this.cluster[layerId] !== null) {
            _this.cluster[layerId].getFeatures(evt.pixel).then((clickedFeatures) => {
              // console.log(clickedFeatures)
              if (clickedFeatures.length) {
                // Get clustered Coordinates
                const features = clickedFeatures[0].get('features')
                if (features.length > 1) {
                  const extent = boundingExtent(
                    features.map((r) => r.getGeometry().getCoordinates())
                  )
                  _this.map.getView().fit(extent, { duration: 1000, padding: [50, 50, 50, 50] })
                } else if (features.length === 1) {
                  _this.$emit(
                    'featureMarkerLayer',
                    feature.getProperties().features[0].getProperties().properties
                  )
                  console.log(feature.getProperties().features[0])
                }
              }
            })
          }
        }

        // 手动添加标注
        if (_this.isMarker) {
          // 创建一个Feature，并设置好在地图上的位置
          const feature = new Feature({
            geometry: new Point(evt.coordinate)
          })
          // 设置样式，在样式中就可以设置图标
          feature.setStyle(
            new Style({
              image: new Icon({
                anchor: [16, 32],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: RedMarker
              })
            })
          )
          // 添加到之前的创建的layer中去
          this.markerLayer.getSource().addFeature(feature)
        }

        // 手动添加军标标注
        if (_this.mouseClicks) {
          // 创建一个Feature，并设置好在地图上的位置
          const feature = new Feature({
            geometry: new Point(evt.coordinate)
          })
          // 设置样式，在样式中就可以设置图标
          feature.setStyle(
            new Style({
              image: new Icon({
                anchor: [16, 32],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: _this.imgPath
              })
            })
          )
          // 添加到之前的创建的layer中去
          this.markerLayer.getSource().addFeature(feature)
        }

        // 点选
        if (_this.isPointSelecting) {
          // 添加中心点
          // _this.addMarker(evt.coordinate)
          // 添加圆
          _this.addCircleByCenterAndRadius(
            evt.coordinate,
            _this.pointSelect.radius
          )
          // 搜索
          var metersPerUnit = this.map
            .getView()
            .getProjection()
            .getMetersPerUnit()

          _this.$emit('searchByRange', {
            areaPointArr: evt.coordinate,
            radio: (_this.pointSelect.radius * metersPerUnit) / 100000,
            // radio: _this.pointSelect.radius,
            type: 'circle'
          })
          // 回显经纬度
          _this.pointSelect.longitude = evt.coordinate[0]
          _this.pointSelect.latitude = evt.coordinate[1]
          _this.isPointSelecting = false
        } else {
          var feature = _this.map.forEachFeatureAtPixel(
            evt.pixel,
            function(feature, layer) {
              return feature
            },
            {
              layerFilter: (layer) => {
                const ids = ['measureLayer', 'drawLayer', 'regionLayer', 'markerLayer']
                if (layer.values_ && ids.indexOf(layer.values_.layerId) > -1) {
                  return false
                }
                return true
              },
              hitTolerance: 6
            }
          )
          // feature && feature.getProperties().properties
          if (feature) {
            // this.$emit('getProperties', feature.getProperties().properties)
            console.log('点击了标记')
            // console.log(feature.getProperties().properties)
            // 战备工程
            _this.$emit(
              'featureMarkerLayers',
              feature.getProperties().properties
            )

            _this.$emit(
              'featureMarker',
              feature.getProperties().properties
            )
            _this.$emit(
              'featureMarkerLayer',
              feature.getProperties().properties
            )
          }
          // if (_this.popup) {
          //  _this.popup.setPosition(undefined)
          //  return false
          // }
        }

        if (_this.popup) {
          if (!this.baseDataModule) {
            _this.popup.setPosition(undefined)
            return false
          }
        }
      })
    },
    // 点击工具
    onHandleClick(method) {
      this.isMarker = false
      this[method]()
    },
    // 恢复地图初始状态
    onHandleRecover() {
      this.map.getView().setCenter(this.mapConfig.center)
      this.map.getView().setZoom(this.mapConfig.zoom)
    },
    // 点飞行
    flyPoint(JDWD, zoom) {
      // this.map.getView().setCenter(JDWD)
      // this.map.getView().setZoom(zoom || 15)
      this.map.getView().animate({
        center: JDWD,
        zoom: zoom || 6,
        duration: 1800 // 飞行时间
      })
    },
    // 测距
    onHandleMeasureLine() {
      this.$emit('signs', false)
      this.isStartMeasure = true
      this.addInteraction('LineString', this.map)
    },
    // 侧面
    onHandleMeasureArea() {
      this.isStartMeasure = true
      this.addInteraction('Polygon', this.map)
    },
    // 标记
    onHandleMark() {
      this.isMarker = true
      this.addModifyInteraction()
    },
    // 标记内容可编辑
    addModifyInteraction() {
      const _this = this
      const modify = new Modify({
        hitDetection: this.markerLayer,
        source: this.markerSource
      })
      modify.on(['modifystart', 'modifyend'], function(evt) {
        _this.map.getTargetElement().style.cursor =
          evt.type === 'modifystart' ? 'grabbing' : 'pointer'
        if (evt.type === 'modifyend') {
          _this.$emit('setLonLat', evt.mapBrowserEvent.coordinate)
        }
      })
      this.map.addInteraction(modify)
    },
    // 清除
    onHandleClear() {
      // 清除所有图层
      const layers = this.map.getLayers().getArray()

      const layer = layers.filter((item, index) => item.values_.layerId && item.values_.layerId !== 'TileLayers')
      layer.forEach((item) => {
        item.getSource().clear()
      })
      // 清除覆盖物
      // this.map.getOverlays().clear()
      //  清除测量结果
      const measureDoms = document.getElementsByClassName('ol-tooltip-static')
      if (measureDoms && measureDoms.length > 0) {
        for (let i = measureDoms.length - 1; i >= 0; i--) {
          if (measureDoms[i]) {
            measureDoms[i].parentNode.removeChild(measureDoms[i])
          }
        }
      }
      // 清除弹框
      if (this.popup) {
        this.popup.setPosition(undefined)
      }
      // 删除聚合点
      for (const key in this.cluster) {
        if (key) {
          this.removeClusterLayer(key)
        }
      }
      this.$emit('childFn', '0')
    },
    // 清除
    onHandleClear1() {
      this.pointSelect = {
        latitude: '',
        longitude: '',
        radius: ''
      }

      // 清除底层之外的图层
      const layers = this.map.getLayers().getArray()
      console.log('.layers', layers)

      const layer = layers.filter((item, index) => item.values_.layerId !== 'TileLayers')
      layer.forEach((item) => {
        item.getSource().clear()
      })

      // 清除所有图层
      // const layers = this.map.getLayers().getArray()

      // layers.forEach((item) => {
      //   item.getSource().clear()
      // })
      // 清除覆盖物
      // this.map.getOverlays().clear()
      //  清除测量结果
      const measureDoms = document.getElementsByClassName('ol-tooltip-static')
      if (measureDoms && measureDoms.length > 0) {
        for (let i = measureDoms.length - 1; i >= 0; i--) {
          if (measureDoms[i]) {
            measureDoms[i].parentNode.removeChild(measureDoms[i])
          }
        }
      }
      this.leftTopX = 0
      this.leftTopY = 0
      this.RectWidth = 0
      this.RectHeight = 0

      this.$emit('signs', false)

      // 清除弹框
      if (this.popup) {
        this.popup.setPosition(undefined)
      }
      this.$emit('childFn', '0')
      this.$emit('clearBusinessData')
      // 删除聚合点
      for (const key in this.cluster) {
        if (key) {
          this.removeClusterLayer(key)
        }
      }
    },
    // 放大
    onHandleExtentLarge() {
      const zoom = this.map.getView().getZoom()
      this.map.getView().setZoom(zoom + 1)
    },
    // 缩小
    onHandleExtentSmall() {
      const zoom = this.map.getView().getZoom()
      this.map.getView().setZoom(zoom - 1)
    },
    // 框选
    onHandleRectSelect() {
      this.$emit('signs', false)
      // this.drawLayer.setSource(new VectorSource())
      this.initDrawRectangleInteraction()
    },
    // 圈选
    onHandleCircleSelect() {
      // this.drawLayer.setSource(new VectorSource())
      this.initDrawCircleInteraction()
    },
    // 多边形选
    onHandlePolygonSelect() {
      // this.drawLayer.setSource(new VectorSource())
      this.initDrawPolygonInteraction()
    },
    // 截屏
    onHandleScreenshot() {
      // console.log('截图', this.leftTopX, this.leftTopY, this.RectWidth, this.RectHeight)
      const _this = this
      if (this.leftTopX !== 0 && this.leftTopY !== 0 && this.RectWidth !== 0 && this.RectHeight !== 0) {
        console.log('/框选区域的截图')

        setTimeout(() => {
          const ref = this.$refs.map // 截图区域
          console.log(ref)
          html2canvas(ref, {
            x: this.leftTopX,
            y: this.leftTopY,
            width: this.RectWidth,
            height: this.RectHeight
          }).then((canvas) => {
            canvas.toBlob(function(blob) {
              // saveAs(blob, '工作用图')
              const elelink = document.createElement('a')
              elelink.download = '工作用图'
              elelink.style.display = 'none'
              elelink.href = URL.createObjectURL(blob)
              document.body.appendChild(elelink)
              elelink.click()
              document.body.removeChild(elelink)
              this.leftTopX = 0
              this.leftTopY = 0
              this.RectWidth = 0
              this.RectHeight = 0
              this.drawSource.clear()
            }, 'image/png', 1)

            // const dataURL = canvas.toDataURL('image/png')
            // _this.dataURL = dataURL
            // var oA = document.createElement('a')
            // oA.download = '工作用图' // 设置下载的文件名
            // oA.href = _this.dataURL
            // document.body.appendChild(oA)
            // oA.click()
            // oA.remove() // 下载之后把创建的元素删除

            // this.drawSource.clear()
          })
        }, 1000)
      } else {
        console.log('/全屏的截图')
        setTimeout(() => {
          const ref = this.$refs.map // 截图区域
          console.log(ref)
          html2canvas(ref, {
            backgroundColor: '#FFFFFF'
          }).then((canvas) => {
            canvas.toBlob(function(blob) {
              // saveAs(blob, '工作用图')
              const elelink = document.createElement('a')
              elelink.download = '工作用图'
              elelink.style.display = 'none'
              elelink.href = URL.createObjectURL(blob)
              document.body.appendChild(elelink)
              elelink.click()
              document.body.removeChild(elelink)
            }, 'image/png', 1)

            // 引入插件的blob方式
            // canvas.toBlob(function(blob) {
            //   saveAs(blob, '工作用图')
            // })

            // 之前的方式
            // const dataURL = canvas.toDataURL('image/png')
            // _this.dataURL = dataURL

            // var oA = document.createElement('a')
            // oA.download = '工作用图' // 设置下载的文件名
            // oA.href = _this.dataURL
            // document.body.appendChild(oA)
            // oA.click()
            // oA.remove() // 下载之后把创建的元素删除
          })
        }, 1000)
      }
    },
    // 添加行政区域 --- 父组件调用 添加边界
    addRegionToMap(geojsonObject) {
      this.regionSource = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonObject)
      })
      this.regionLayer.setSource(this.regionSource)
    },
    // 添加标记 --- 父组件调用---表单获取坐标使用
    addMarker(lonlat, isModify) {
      this.map.getView().setCenter(lonlat)
      // 创建一个Feature，并设置好在地图上的位置
      const feature = new Feature({
        geometry: new Point(lonlat)
      })
      // 设置样式，在样式中就可以设置图标
      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [16, 32],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: RedMarker
          })
        })
      )
      // 添加到之前的创建的layer中去
      this.markerLayer.getSource().addFeature(feature)
      if (isModify) {
        this.addModifyInteraction()
      }
    },
    // 添加图层和graphics
    addLayerAndGraphics(layerId, graphics, icon) {
      console.log('layerId', layerId)
      const layers = this.map.getLayers().getArray()
      let layer = layers.find((item) => item.values_.layerId === layerId)

      if (layer) {
        layer.getSource().clear()
        layer.setVisible(true)
      } else {
        layer = new VectorLayer({

          source: new VectorSource(),
          properties: {
            layerId: layerId
          }
        })
        this.map.addLayer(layer)
        this.layerMK = layer
      }
      graphics.forEach((item) => {
        // 创建一个Feature，并设置好在地图上的位置
        const jds = item.pointJD || item.longitude
        const wds = item.pointWD || item.latitude
        const feature = new Feature({

          geometry: new Point([jds, wds]),
          properties: item
        })

        // 设置样式，在样式中就可以设置图标
        feature.setStyle(
          new Style({
            image: new Icon({
              anchor: [16, 32],
              anchorXUnits: 'pixels',
              anchorYUnits: 'pixels',
              src: icon
            })
          })
        )
        // 添加到之前的创建的layer中去
        layer.getSource().addFeature(feature)
      })
      layer.setZIndex(10)
    },
    // 隐藏图层和graphics
    removeAddLayerAndGraphics(layerId, type) {
      // console.log(this.layerId)
      // console.log(this.layerMK)
      this.layerMK.setVisible(false)
    },
    // 给图层上添加标注
    addMakerToLayer(layerId, graphics, icon) {
      const layers = this.map.getLayers().getArray()
      const layer = layers.find((item) => item.values_.layerId === layerId)
      graphics.forEach((item) => {
        // 创建一个Feature，并设置好在地图上的位置
        const feature = new Feature({
          geometry: new Point([item.pointJD, item.pointWD]),
          properties: item
        })
        // 设置样式，在样式中就可以设置图标
        feature.setStyle(
          new Style({
            image: new Icon({
              anchor: [16, 32],
              anchorXUnits: 'pixels',
              anchorYUnits: 'pixels',
              src: icon
            })
          })
        )
        // 添加到之前的创建的layer中去
        layer.getSource().addFeature(feature)
      })
    },
    // 移除某图层上的标注
    removeMarkerPointByLayerIdAndMarkerType(layerId, markerType) {
      const layers = this.map.getLayers().getArray()
      const layer = layers.find((item) => item.values_.layerId === layerId)

      const features = layer.getSource().getFeatures()
      features.forEach((item) => {
        const itemId = item.getProperties().properties.pointCategory
        if (itemId === markerType) {
          layer.getSource().removeFeature(item)
        }
      })
    },
    // 添加标注
    addMarkerPointByLayerIdAndMarkerType(MarkerIcon, layerId, markerType) {
      const layers = this.map.getLayers().getArray()
      const layer = layers.find((item) => item.values_.layerId === layerId)
      const features = layer.getSource().getFeatures()
      // 创建一个Feature，并设置好在地图上的位置
      const marker = features
      // 设置样式，在样式中就可以设置图标
      marker.setStyle(
        new Style({
          image: new Icon({
            anchor: [16, 16],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: MarkerIcon
          })
        })
      )
      this.markerLayer.getSource().addFeature(marker)
    },
    // 根据图层ID显示图层
    showLayerById(layerId) {
      const layers = this.map.getLayers().getArray()
      const layer = layers.find((item) => item.values_.layerId === layerId)
      if (layer) {
        layer.setVisible(true)
      }
    },
    // 根据图层ID隐藏图层
    hideLayerById(layerId) {
      const layers = this.map.getLayers().getArray()
      // console.log(layers)
      const layer = layers.find((item) => item.values_.layerId === layerId)
      if (layer) {
        layer.setVisible(false)
      }
    },
    hideLayerByIds(layerId) {
      // const layers = this.map.getLayers().getArray()
      // const layer = layers.find((item) => item.values_.layerId === layerId)
      // if (layer) {
      //   layer.setVisible(false)
      // }
      if (this.layerLine) {
        // console.log('layerline', this.layerLine)
        this.map.removeLayer(this.layerLine)
      }

      // this.layerLine.getSource().getFeatures()[0].style_ = { display: 'none' }
      // this.map.removeLayer(this.layerLine)
    },
    // 添加线和点
    addLineAndMarker(MarkerIcon, point, line, id) {
      // // console.log(MarkerIcon, point, line, id)

      // 创建一个Feature，并设置好在地图上的位置
      const marker = new Feature({
        geometry: new Point(point),
        id: id + 'point'
      })
      // 设置样式，在样式中就可以设置图标
      marker.setStyle(
        new Style({
          image: new Icon({
            anchor: [16, 16],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: MarkerIcon
          })
        })
      )
      this.markerLayer.getSource().addFeature(marker)
      const lineFeature = new Feature({
        geometry: new LineString(line),
        id: id + 'line'
      })
      lineFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: 'red',
            width: 2
          })
        })
      )
      this.markerLayer.getSource().addFeature(lineFeature)
    },
    // 添加点 基础数据展现
    addPoint(MarkerIcon, point, id) {
      // 创建一个Feature，并设置好在地图上的位s置
      const marker = new Feature({
        geometry: new Point(point),
        id: id + 'point'
      })
      // 设置样式，在样式中就可以设置图标
      marker.setStyle(
        new Style({
          image: new Icon({
            anchor: [16, 16],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: MarkerIcon
          })
        })
      )
      this.markerLayer.getSource().addFeature(marker)
    },
    // 删除点和线
    removeLineAndMarkerById(id) {
      const features = this.markerLayer.getSource().getFeatures()
      features.forEach((item) => {
        const itemId = item.getProperties().id
        if (itemId === id + 'point' || itemId === id + 'line') {
          this.markerLayer.getSource().removeFeature(item)
        }
      })
    },
    // 点选
    onHandlePointSelect() {
      console.log(this.pointSelect.radius)
      if (!this.pointSelect.radius) {
        this.$message.warning('请输入半径')
        return
      }
      var regNumber = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
      if (regNumber.test(this.pointSelect.radius) === false) {
        this.$message.warning('半径不能为负数')
        return
      }
      this.isPointSelecting = true
    },
    // 添加标注
    addMarkerPoint(MarkerIcon, point, id, properties) {
      console.log(MarkerIcon, point, id, properties)

      // 创建一个Feature，并设置好在地图上的位置
      const marker = new Feature({
        geometry: new Point(point),
        id: id + 'point',
        properties
      })

      // 设置样式，在样式中就可以设置图标
      marker.setStyle(
        new Style({
          image: new Icon({
            anchor: [16, 16],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: MarkerIcon
          })
        })
      )

      this.markerLayer.getSource().addFeature(marker)
    },
    // 标记之间连线
    addLayerAndGraphic(layerId, graphics, line, icon) {
      const layers = this.map.getLayers().getArray()
      let layer = layers.find((item) => item.values_.layerId === layerId)

      if (layer) {
        layer.getSource().clear()
      } else {
        layer = new VectorLayer({
          source: new VectorSource(),
          properties: {
            layerId: layerId
          }
        })
        this.map.addLayer(layer)
      }
      graphics.forEach((item) => {
        // 创建一个Feature，并设置好在地图上的位置
        const feature = new Feature({
          geometry: new Point([item.pointJD, item.pointWD]),
          properties: item
        })
        // 设置样式，在样式中就可以设置图标
        feature.setStyle(
          new Style({
            image: new Icon({
              anchor: [16, 32],
              anchorXUnits: 'pixels',
              anchorYUnits: 'pixels',
              src: icon
            })
          })
        )
        // 添加到之前的创建的layer中去
        layer.getSource().addFeature(feature)
      })
    },
    addLayerAndGraphicLine(zbgc, bd, id) {
      var vectorLine = new VectorSource({})
      for (let i = 0; i < zbgc.length; i++) {
        var points = [[zbgc[i].pointJD, zbgc[i].pointWD], [bd.pointJD, bd.pointWD]]
        var featureLine = new Feature({
          geometry: new LineString(points),
          id: id
        })
        vectorLine.addFeature(featureLine)
      }
      var vectorLineLayer = new VectorLayer({
        source: vectorLine,
        style: new Style({
          fill: new Fill({ color: 'red', weight: 4 }),
          stroke: new Stroke({ color: 'red', width: 4 })
        })
      })
      this.map.addLayer(vectorLineLayer)
      this.layerLine = vectorLineLayer
    },
    // 移除标注
    removeMarkerPoint(id) {
      const features = this.markerLayer.getSource().getFeatures()
      // console.log(features)
      features.forEach((item) => {
        const itemId = item.getProperties().id
        if (itemId === id + 'point') {
          this.markerLayer.getSource().removeFeature(item)
        }
      })
    },
    // 移除标注
    removeMarkerPointSwitch(id) {
      const layers = this.map.getLayers().getArray()
      const layer = layers.find((item) => item.values_.layerId === id)
      const features = layer.getSource().getFeatures()
      console.log(features)
      features.forEach((item) => {
        const itemId = item.getProperties().properties.pointCategory
        if (itemId === id) {
          layer.getSource().removeFeature(item)
        }
      })
    },
    // 移除标注
    removeMarkerPoints(id, targetId) {
      console.log(id, targetId)
      const layers = this.map.getLayers().getArray()
      console.log(layers)
      const layer = layers.find((item) => item.values_.layerId === id)
      console.log(layers)
      const features = layer.getSource().getFeatures()
      console.log(features)
      features.forEach(item => {
        console.log(item)
        let itemId = ''
        if (item.values_.properties.targetId) {
          itemId = item.values_.properties.targetId
        } else {
          itemId = item.values_.properties.batchNumber
        }

        if (itemId === targetId) {
          // console.log(itemId)
          layer.getSource().removeFeature(item)
        }
      })
    },
    addPopup() {
      this.popup = new Overlay({
        element: document.getElementById('popup'),
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        },
        offset: [6, -8]
      })

      console.log(this.popup)
      this.map.addOverlay(this.popup)
    },
    // 添加聚合图层
    addClusterLayer(layerId, points) {
      // console.log(layerId, points)
      // 点
      const features = []
      for (let i = 0; i < points.length; i++) {
        // console.log(points)
        features.push(
          new Feature({
            geometry: new Point(points[i].lonlat),
            properties: points[i].property
          })
        )
      }
      // source
      const source = new VectorSource({
        features: features

      })
      // cluster source
      const clusterSource = new Cluster({
        distance: parseInt(20, 10),
        minDistance: parseInt(10, 10),
        source: source
      })
      // cluster
      const styleCache = {}

      if (this.cluster[layerId]) {
        this.cluster[layerId].setSource(clusterSource)
      } else {
        this.cluster[layerId] = new VectorLayer({
          source: clusterSource,
          style: function(feature) {
            // console.log('feature1280',feature)
            const size = feature.get('features').length
            // console.log(size)
            let style = styleCache[size]
            if (!style) {
              if (size > 1) {
                style = new Style({
                  image: new CircleStyle({
                    radius: 12,
                    stroke: new Stroke({
                      color: '#fff'
                    }),
                    fill: new Fill({
                      color: '#D81E06'
                    })
                  }),
                  text: new Text({
                    text: size.toString(),
                    fill: new Fill({
                      color: '#fff'
                    })
                  })
                })
              } else {
                if (layerId === 'YYCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: hosptail
                    })
                  })
                } else if (layerId === 'YKCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: YK
                    })
                  })
                } else if (layerId === 'XZCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: XZ
                    })
                  })
                } else if (layerId === 'DCHJCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: RedMarker
                    })
                  })
                } else if (layerId === 'HHSHJCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: HSHHJ
                    })
                  })
                } else if (layerId === 'WHGJCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: RedMarker
                    })
                  })
                } else if (layerId === 'JTCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: RedMarker
                    })
                  })
                } else if (layerId === 'JJYSCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: JTMB
                    })
                  })
                } else if (layerId === 'ZHFHCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: RedMarker
                    })
                  })
                } else if (layerId === 'LJSSCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: RedMarker
                    })
                  })
                } else if (layerId === 'JTJDCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: JTJD
                    })
                  })
                } else if (layerId === 'MTCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: MTGC
                    })
                  })
                } else if (layerId === 'JCCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: JCGC
                    })
                  })
                } else if (layerId === 'ZDCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: RedMarker
                    })
                  })
                } else if (layerId === 'TXCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: TXGC
                    })
                  })
                } else if (layerId === 'CKCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: CKGC
                    })
                  })
                } else if (layerId === 'YFCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: RedMarker
                    })
                  })
                } else if (layerId === 'RFCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: RFGC
                    })
                  })
                } else if (layerId === 'DPCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: DPGC
                    })
                  })
                } else if (layerId === 'KDCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: KDDK
                    })
                  })
                } else if (layerId === 'LJCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: Green
                    })
                  })
                } else if (layerId === 'HJCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: Green
                    })
                  })
                } else if (layerId === 'KJCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: Green
                    })
                  })
                } else if (layerId === 'HJJCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: Green
                    })
                  })
                } else if (layerId === 'ZLBDCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: Green
                    })
                  })
                } else if (layerId === 'LQBDCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: Green
                    })
                  })
                } else if (layerId === 'WJBDCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: Green
                    })
                  })
                } else if (layerId === 'QTCluster1') {
                  style = new Style({
                    image: new Icon({
                      anchor: [16, 32],
                      anchorXUnits: 'pixels',
                      anchorYUnits: 'pixels',
                      src: Green
                    })
                  })
                }
              }
              styleCache[size] = style
            }
            return style
          },
          properties: {
            layerId: layerId
          }
        })
        this.map.addLayer(this.cluster[layerId])
      }
    },
    // 清除聚合图层
    removeClusterLayer(layerId) {
      const layers = this.map.getLayers().getArray()
      const layer = layers.find((item) => item.values_.layerId === layerId)
      if (layer) {
        this.map.removeLayer(layer)
        this.cluster[layerId] = null
        // const features = layer.getSource().getFeatures()
        // features.forEach((item) => {
        //  layer.getSource().removeFeature(item)
        // })
      }
    },
    // 删除海空情历史标记
    remove(layerId, targetId) {
      const layers = this.map.getLayers().getArray()
      const layer = layers.find((item) => item.values_.layerId === layerId)
      if (layer) {
        const features = layer.getSource().getFeatures()
        features.forEach((item) => {
          let itemId = ''
          if (item.values_.features[0].values_.properties.targetId) {
            itemId = item.values_.features[0].values_.properties.targetId
          } else {
            itemId = item.values_.features[0].values_.properties.batchNumber
          }
          if (itemId === targetId) {
            layer.getSource().removeFeature(item)
          }
        })
      }
    },
    // 基础数据展现，显示标注和弹窗
    addMakerAndShowPopup() {
      const lonlat = this.baseDataModule.lonlat
      if (lonlat[0] && lonlat[1]) { // 如果有经纬度的话显示，没点不显示
        this.map.getView().setCenter(lonlat)
        // 创建一个Feature，并设置好在地图上的位置
        const feature = new Feature({
          geometry: new Point(lonlat),
          properties: this.baseDataModule
        })
        // 设置样式，在样式中就可以设置图标
        feature.setStyle(
          new Style({
            image: new Icon({
              anchor: [16, 32],
              anchorXUnits: 'pixels',
              anchorYUnits: 'pixels',
              src: RedMarker
            })
          })
        )
        // 添加到之前的创建的layer中去
        this.markerLayer.getSource().addFeature(feature)
        const coordinate = lonlat
        // console.log(feature.getProperties().properties)
        // 部队名称
        const bdValue = this.baseDataModule.bd.value
        // 部署类别
        const bslbLabelName = this.baseDataModule.bslb.labelName
        const bslbValue = this.baseDataModule.bslb.value
        // 部署形式
        const bsxsLabelName = this.baseDataModule.bsxs.labelName
        const bsxsValue = this.baseDataModule.bsxs.value
        // 地名
        const dmLabelName = this.baseDataModule.dm.labelName
        const dmValue = this.baseDataModule.dm.value
        // 扩展地名
        // const kzdmLabelName = this.baseDataModule.kzdm.labelName
        const kzdmValue = this.baseDataModule.kzdm.value
        // 经度
        const pointJDLabelName = this.baseDataModule.pointJD.labelName
        const pointJDValue = this.baseDataModule.pointJD.value
        // 纬度
        const pointWDLabelName = this.baseDataModule.pointWD.labelName
        const pointWDValue = this.baseDataModule.pointWD.value
        // 高程
        const gcLabelName = this.baseDataModule.gc.labelName
        const gcValue = this.baseDataModule.gc.value
        document.getElementById('popup-content').innerHTML = `
                <p style="margin:0;color:#3a8ee6;font-weight: bold;">${bdValue}</p>
                <p style="margin:6px 0;border:1px solid #ddd"></p>
                <div style="display:flex;font-size:15px;height: 30px;line-height: 30px;">
                  <p style="color:#000;margin:0;">${bslbLabelName}：</p>
                  <p style="color:#555;margin:0;">${bslbValue}</p>
                </div>
                <div style="display:flex;font-size:15px;height: 30px;line-height: 30px;">
                  <p style="color:#000;margin:0;">${bsxsLabelName}：</p>
                  <p style="color:#555;margin:0;">${bsxsValue}</p>
                </div>
                <div style="display:flex;font-size:15px;height: 30px;line-height: 30px;">
                  <p style="color:#000;margin:0;width:52px">${dmLabelName}：</p>
                  <p style="color:#555;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${dmValue}${kzdmValue}">${dmValue}${kzdmValue}</p>
                </div>
                <div style="display:flex;font-size:15px;height: 30px;line-height: 30px;">
                  <p style="color:#000;margin:0;">${pointJDLabelName}：</p>
                  <p style="color:#555;margin:0;">${pointJDValue}</p>
                </div>
                <div style="display:flex;font-size:15px;height: 30px;line-height: 30px;">
                  <p style="color:#000;margin:0;">${pointWDLabelName}：</p>
                  <p style="color:#555;margin:0;">${pointWDValue}</p>
                </div>
                <div style="display:flex;font-size:15px;height: 30px;line-height: 30px;">
                  <p style="color:#000;margin:0;">${gcLabelName}：</p>
                  <p style="color:#555;margin:0;">${gcValue}</p>
                </div>
              `
        setTimeout(() => {
          this.popup.setPosition(coordinate)
        }, 1000)
      }
    }
  }
}
</script>
<style>
.custom-mouse-position{
  position: absolute;
  right: 14px;
  bottom: 10px;
  color:#000;
  font-size: 18px;
  height: 40px;
  line-height: 40px;
}
</style>>
<style lang="scss" scoped>

.map-container {
  width: 100%;
  height: 100%;
  .map-section {
    width: 100%;
    height: 100%;
  }
  .map-tools {
    display: flex;
    position: absolute;
    top: 80px;
    right: 20px;
    text-align: center;
    z-index: 1000;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.5);
    box-sizing: content-box;
    padding: 0 5px;
    .iconfont {
      font-size: 18px;
      margin: 0px;
    }
    .point-select-section {
      display: flex;
      align-items: center;
      background: #5a5a5a;
      margin: 5px;
      border-radius: 3px;
      padding: 4px 7px 4px 1px;
      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }
      .icon {
        color: #fff;
        font-size: 24px;
        cursor: pointer;
      }
      .label {
        color: #fff;
        font-size: 12px;
        margin-right: 5px;
      }
      .input {
        width: 80px;
        margin: 0 5px;
      }
    }
    &-item {
      width: 34px;
      height: 34px;
      color: #ffffff;
      background: #5a5a5a;
      opacity: 1;
      margin: 5px;
      display: inline-block;
      border-radius: 17px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.8);
      }
    }
    .active {
      font-weight: bold;
      background: #dede04;
      color: #333;
    }
  }
}
.page-error-info{
  width: 200px;
  height: 60px;
  position: absolute;
  top: calc(50vh - 30px);
  left: calc(50vw - 100px);
  background: #fff;
  border-radius: 5px;
  .info-text{
    text-align: center;
    line-height: 60px;
    font-size: 18px;
  }
}
</style>
<style>
/*隐藏ol的一些自带元素*/
.ol-attribution,
.ol-zoom,

.ol-popups {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 22px;
  left: -55px;
  font: italic bold 12px;
  min-width: 30px;
}
.ol-popups:after,
.ol-popups:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popups:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popups:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
#popup-content {
  width: 222px;
}
</style>

