<template>
  <Container id="map">
    <div class="left">
      <div class="leftTop">
        <!-- 级联选择器 -->
        <el-cascader
          ref="demoCascader"
          class="leftTopSelect"
          :options="optionss"
          :props="prop"
          clearable
          @change="handleChange"
        />
        <!-- 远程搜索 模糊查询 -->
        <el-select
          v-model="value"
          clearable
          class="leftTopSearch"
          filterable
          remote
          placeholder="搜索地图"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="SearchMap"
          @clear="delValue"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item"
          />
        </el-select>
        <!-- 选择按钮 -->
        <el-button class="leftTopBtn" type="primary" @click="search">
          <img
            style="width: 24px;height: 24px;"
            :src="require(`@/icons/img/mapSearch/search.png`)"
            alt=""
          >
        </el-button>
      </div>
      <div class="leftCenter">
        <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
        <el-tree
          ref="tree"
          style="width:500px"
          class="filter-tree"
          show-checkbox
          :data="treeData"
          :props="defaultProps"
          highlight-current
          :filter-node-method="filterNode"
          @node-click="nodeClick"
          @check-change="handleCheckChange"
        />
      </div>
      <div class="leftBtm">
        <div v-for="(item, index) in switchData" :key="index" class="leftBtmBox">
          <p style="font-size:15px">
            <img
              style="width:24px;height:24px;vertical-align: middle;margin-right:2px"
              :src="item.src"
              alt=""
            ><span>{{ item.title }}</span>
          </p>
          <el-switch
            v-model="item.Value"
            style="margin-top: 9px;"
            active-color="#13ce66"
            inactive-color="rgba(216 216 216)"
            @change="switchChange(item.title, $event)"
          />
        </div>
      </div>
    </div>
    <div class="right" :style="{ width: input != '' ? '553px' : '333px' }">
      <!-- 正方形 -->
      <el-button @click="square">
        <img
          :src="require('@/icons/img/mapSearch/squares.png')"
          alt=""
          srcset=""
        >
      </el-button>
      <!-- 圆形 -->
      <el-button @click="circle">
        <img
          :src="require('@/icons/img/mapSearch/circle.png')"
          alt=""
          srcset=""
        >
      </el-button>
      <!-- 多变形 -->
      <el-button @click="polygon">
        <img
          :src="require('@/icons/img/mapSearch/polygon.png')"
          alt=""
          srcset=""
        >
      </el-button>
      <!-- 定位 -->
      <el-button @click="location">
        <img
          :src="require('@/icons/img/mapSearch/location.png')"
          alt=""
          srcset=""
        >
      </el-button>
      <el-input
        v-model="input"
        class="ipt"
        :style="{ width: input != '' ? '1155px' : '125px' }"
      />
      <p :style="{ width: input != '' ? '133px' : '50px' }">半径</p>
      <el-input
        v-model="inputs"
        class="ipts"
        :style="{ width: input != '' ? '283px' : '125px' }"
      />
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container'
import * as API from '@/api/index'
import Red from '@/icons/img/mapSearch/red.png'
import Blue from '@/icons/img/mapSearch/blue.png'
import Green from '@/icons/img/mapSearch/green.png'
import * as turf from '@turf/turf'
// import qs from 'qs'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
export default {
  components: { Container },
  data() {
    return {
      input: '',
      inputs: '',
      switchData: [
        {
          Value: true,
          src: Red,
          title: '部队部署'
        },
        {
          Value: true,
          src: Green,
          title: '战备工程'
        },
        {
          Value: true,
          src: Blue,
          title: '后勤保障'
        }
      ],
      map: '', // 地图
      filterText: '', // 输入的关键字过虑
      treeData: [], // 树的数据
      defaultProps: {
        children: 'childList',
        label: 'label'
      }, // 树指定节点的属性

      // ====级联选择器====
      optionss: [],
      prop: {
        checkStrictly: true,
        value: 'label',
        children: 'childList',
        label: 'label'
      },
      // ====远程搜索====
      options: [],
      value: '',
      list: [],
      loading: false,
      states: [],

      arrFieId: [],
      field: '', // 树节点的field
      Region: [], // 当前级联选择器输入的值
      SearchValue: '', // 远程搜索时选中的值
      regionCodeData: '', // 行政区域的code码
      // coords:[], // 正方形的经纬度
      a: 0,
      starCoords: [],
      Alldata: {},
      fieldArr: []
    }
  },

  watch: {
    // 对节点进行过滤 参数为关键字
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // 获取树数据
    this.getUnitTree()
    this.getcascaderTree()
  },

  mounted() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWFvcmV5IiwiYSI6ImNqNWhrenIwcDFvbXUyd3I2bTJxYzZ4em8ifQ.KHZIehQuWW9AsMaGtATdwA'
    this.map = new mapboxgl.Map({
      container: 'map',
      style: {
        // 设置版本号，一定要设置
        version: 8,
        // 添加来源
        sources: {
          tdtVec: {
            // 类型为栅格瓦片
            type: 'raster',
            tiles: [
              // 请求地址
              // this.vecUrl + '&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles'
              'http://192.168.1.18:8857/tile/service/v1/tile?map=1&x={x}&y={y}&z={z}'
            ],
            // 分辨率
            tileSize: 256
          }
          // 'tdtCva': tdtCva
        },
        layers: [
          {
            // 图层id，要保证唯一性
            id: 'tdtVec',
            // 图层类型
            type: 'raster',
            // 数据源
            source: 'tdtVec',
            // 图层最小缩放级数
            minzoom: 0,
            // 图层最大缩放级数
            maxzoom: 24
          }
        ]
      },
      center: [109.0469971, 34.11899951], // starting position [lng, lat]
      zoom: 11
    })
    // const _this = this
    // const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
    // mapboxgl.accessToken =
    //   'pk.eyJ1IjoibWFvcmV5IiwiYSI6ImNqNWhrenIwcDFvbXUyd3I2bTJxYzZ4em8ifQ.KHZIehQuWW9AsMaGtATdwA'
    // this.map = new mapboxgl.Map({
    //   container: 'map', // container id
    //   style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    //   center: [109.0469971, 34.11899951], // starting position [lng, lat]
    //   zoom: 9 // starting zoom
    // })

    // const language = new MapboxLanguage({ defaultLanguage: 'zh' }) // 地图加到显示为中文
    // this.map.addControl(language)
    this.map.on('load', () => {
      this.map.loadImage(Red, (error, image) => {
        if (error) throw error
        this.map.addImage('iconImgRed', image)
      })

      this.map.loadImage(Blue, (error, image) => {
        if (error) throw error
        this.map.addImage('iconImgBlue', image)
      })

      this.map.loadImage(Green, (error, image) => {
        if (error) throw error
        this.map.addImage('iconImgGreen', image)
      })
    })
  },
  methods: {
    // 点击开关按钮
    switchChange(title, e) {
      if (title === '部队部署') {
        if (!e) {
          this.map.getLayer('bdbsregionCode+point') &&
            this.map.removeLayer('bdbsregionCode+point')
          this.map.getSource('bdbsregionCode+point') &&
            this.map.removeSource('bdbsregionCode+point')
        } else {
          // 部队部署 坐标
          const bdbspointData = []
          this.Alldata.bdbs.forEach((item, index) => {
            bdbspointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          this.map.addSource('bdbsregionCode+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: bdbspointData
            }
          })
          this.map.addLayer({
            id: 'bdbsregionCode+point',
            type: 'symbol',
            source: 'bdbsregionCode+point',
            layout: {
              'icon-image': 'iconImgRed',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
        }
      } else if (title === '后勤保障') {
        if (!e) {
          this.map.getLayer('hqbzregionCode+point') &&
            this.map.removeLayer('hqbzregionCode+point')
          this.map.getSource('hqbzregionCode+point') &&
            this.map.removeSource('hqbzregionCode+point')
        } else {
          const hqbzpointData = []
          this.Alldata.hqbz.forEach((item, index) => {
            hqbzpointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          this.map.addSource('hqbzregionCode+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: hqbzpointData
            }
          })
          this.map.addLayer({
            id: 'hqbzregionCode+point',
            type: 'symbol',
            source: 'hqbzregionCode+point',
            layout: {
              'icon-image': 'iconImgBlue',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
        }
      } else if (title === '战备工程') {
        if (!e) {
          this.map.getLayer('zbgcregionCode+point') &&
            this.map.removeLayer('zbgcregionCode+point')
          this.map.getSource('zbgcregionCode+point') &&
            this.map.removeSource('zbgcregionCode+point')
        } else {
          const zbgcpointData = []
          this.Alldata.zbgc.forEach((item, index) => {
            zbgcpointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          this.map.addSource('zbgcregionCode+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: zbgcpointData
            }
          })
          this.map.addLayer({
            id: 'zbgcregionCode+point',
            type: 'symbol',
            source: 'zbgcregionCode+point',
            layout: {
              'icon-image': 'iconImgGreen',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
        }
      }
    },
    handleCheckChange(obj, node, tree) {
      if (!node) {
        this.clearLayerAndSource()
        return
      } else {
        this.$emit('nodeClick', { obj, node, tree })
        if (obj.childList.length === 0) {
          this.getPoint(obj.field)
        } else {
          return
        }
      }
    },
    // 拿到最底层的fieId
    nodeClick(obj, node, tree) {
      console.log(obj, node, tree)

      // this.$emit('nodeClick', { obj, node, tree })
      // // console.log(obj, node, tree);
      // // 如果下面的子节点长度为0
      // if (obj.childList.length === 0) {
      //   this.getPoint(obj.field)
      // } else {
      //   return
      // }
    },
    // 根据部队获取具体位置点
    getPoint(field) {
      // this.clearLayerAndSource()
      // console.log(field)
      // this.fieldArr.push(field)
      // console.log(this.fieldArr)
      // console.log(this.fieldArr[this.fieldArr.length - 1])

      // if(this.fieldArr[this.fieldArr.length - this.fieldArr.length-1] === field){

      // }

      // console.log(this.fieldArr[this.fieldArr.length - 2])

      this.field = field
      const params = {
        bdnm: this.field
      }
      console.log(params)

      API.getPoint(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          const getPointData = []
          res.data.forEach(item => {
            getPointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          console.log(getPointData)

          this.map.addSource('getPointData+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: getPointData
            }
          })
          this.map.addLayer({
            id: 'getPointData+point',
            type: 'symbol',
            source: 'getPointData+point',
            layout: {
              'icon-image': 'iconImgRed',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
        } else {
          this.$$message.error(res.msg)
        }
      })
    },
    // 级联选择器的点击事件
    handleChange(value) {
      if (value.length !== 0) {
        this.clearLayerAndSource()
        this.getRegionData()
      } else {
        this.clearLayerAndSource()
      }
    },
    // 选定行政区域或自定义边界内数据综合查询
    getRegionData() {
      const obj = this.$refs['demoCascader'].getCheckedNodes()
      const data = {
        regionCode: obj[0].data.field,
        type: 1
      }
      API.getRegionData(data).then(res => {
        // console.log(res)
        if (res.code === 200) {
          // 部队部署 坐标
          const bdbspointData = []
          res.data.bdbs.forEach((item, index) => {
            bdbspointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          this.map.addSource('bdbsregionCode+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: bdbspointData
            }
          })
          this.map.addLayer({
            id: 'bdbsregionCode+point',
            type: 'symbol',
            source: 'bdbsregionCode+point',
            layout: {
              'icon-image': 'iconImgRed',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
          // 后勤保障 坐标
          const hqbzpointData = []
          res.data.hqbz.forEach((item, index) => {
            hqbzpointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          this.map.addSource('hqbzregionCode+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: hqbzpointData
            }
          })
          this.map.addLayer({
            id: 'hqbzregionCode+point',
            type: 'symbol',
            source: 'hqbzregionCode+point',
            layout: {
              'icon-image': 'iconImgBlue',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
          // 战备工程 坐标
          const zbgcpointData = []
          res.data.zbgc.forEach((item, index) => {
            zbgcpointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          this.map.addSource('zbgcregionCode+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: zbgcpointData
            }
          })
          this.map.addLayer({
            id: 'zbgcregionCode+point',
            type: 'symbol',
            source: 'zbgcregionCode+point',
            layout: {
              'icon-image': 'iconImgGreen',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取行政区域的数据级联选择器
    getcascaderTree() {
      API.getAreaTree().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.optionss = data
          // console.log(this.optionss);

          // this.$refs.myTree.setChecks(this.treeData)
          // this.getFirstTableList(this.treeData)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取树 单位编制的数据
    getUnitTree() {
      const prop = '/force'
      API.getDataTypeTree({}, prop).then(res => {
        // console.log(res)
        if (res.code === 200) {
          this.treeData = res.data
          // this.$refs.tree.setChecks(this.treeData)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 清图层
    clearLayerAndSource() {
      if (this.map.getLayer('getPointData+point')) {
        this.map.removeLayer('getPointData+point')
      }
      if (this.map.getSource('getPointData+point')) {
        this.map.removeSource('getPointData+point')
      }
      if (this.map.getLayer('bdbsregionCode+point')) {
        this.map.removeLayer('bdbsregionCode+point')
      }
      if (this.map.getSource('bdbsregionCode+point')) {
        this.map.removeSource('bdbsregionCode+point')
      }

      if (this.map.getLayer('hqbzregionCode+point')) {
        this.map.removeLayer('hqbzregionCode+point')
      }
      if (this.map.getSource('hqbzregionCode+point')) {
        this.map.removeSource('hqbzregionCode+point')
      }

      if (this.map.getLayer('zbgcregionCode+point')) {
        this.map.removeLayer('zbgcregionCode+point')
      }
      if (this.map.getSource('zbgcregionCode+point')) {
        this.map.removeSource('zbgcregionCode+point')
      }

      if (this.map.getLayer('rectangle')) {
        this.map.removeLayer('rectangle')
      }
      if (this.map.getSource('rectangle')) {
        this.map.removeSource('rectangle')
      }
      if (this.map.getLayer('circle')) {
        this.map.removeLayer('circle')
      }
      if (this.map.getSource('circle')) {
        this.map.removeSource('circle')
      }
      // 多边形
      if (this.map.getLayer('polygon')) {
        this.map.removeLayer('polygon')
      }
      if (this.map.getSource('polygon')) {
        this.map.removeSource('polygon')
      }
      if (this.map.getLayer('line-area-stroke')) {
        this.map.removeLayer('line-area-stroke')
      }
      if (this.map.getSource('line-area-stroke')) {
        this.map.removeSource('line-area-stroke')
      }
      if (this.map.getLayer('line-area')) {
        this.map.removeLayer('line-area')
      }
      if (this.map.getSource('line-area')) {
        this.map.removeSource('line-area')
      }
      if (this.map.getLayer('points-area')) {
        this.map.removeLayer('points-area')
      }
      if (this.map.getSource('points-area')) {
        this.map.removeSource('points-area')
      }
      // 点
      if (this.map.getLayer('points')) {
        this.map.removeLayer('points')
      }
      if (this.map.getSource('points')) {
        this.map.removeSource('points')
      }
      if (this.map.getSource('points') === undefined) {
        this.input = ''
      }
    },

    // 画点
    location(e) {
      this.clearLayerAndSource()
      this.map.getCanvas().style.cursor = 'crosshair'
      e.stopPropagation()
      var isDraw = true
      // 禁止双击缩放
      this.map.doubleClickZoom.disable()

      var jsonPoint = {
        type: 'FeatureCollection',
        features: []
      }
      var source = this.map.getSource('points')
      if (source) {
        this.map.getSource('points').setData(jsonPoint)
      } else {
        this.map.addSource('points', {
          type: 'geojson',
          data: jsonPoint
        })
        this.map.addLayer({
          id: 'points',
          type: 'circle',
          source: 'points',
          paint: {
            'circle-color': '#ffffff',
            'circle-radius': 3,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ff0000'
          }
        })
      }
      var points = []
      var starCoords = []
      this.map.on('click', _e => {
        if (isDraw) {
          starCoords = []
          starCoords.push(_e.lngLat.lat)
          starCoords.unshift(_e.lngLat.lng)
          points.push(starCoords)
          // console.log(starCoords);
        }
      })

      this.map.on('dblclick', _e => {
        if (isDraw) {
          this.map.getCanvas().style.cursor = 'grab'
          isDraw = false
          var endCoords = [_e.lngLat.lng, _e.lngLat.lat]
          jsonPoint.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: endCoords
            }
          })
          // console.log(endCoords);

          this.map.getSource('points').setData(jsonPoint)
          // console.log(this.inputs);
          const data = {
            areaPointArr: [endCoords],
            radio: this.inputs,
            type: 4
          }
          // console.log(data);

          // console.log(data.areaPointArr,typeof(data.radio),data.radio,data.type);
          API.getRegionData(data).then(res => {
            // console.log(res);
            if (res.code === 200) {
              this.Alldata = res.data
              this.inputs = ''
              this.input = endCoords.toString()
              // 部队部署 坐标
              const bdbspointData = []
              res.data.bdbs.forEach((item, index) => {
                bdbspointData.push({
                  type: 'Feature',
                  properties: item,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(item.pointJD), Number(item.pointWD)]
                  }
                })
              })
              this.map.addSource('bdbsregionCode+point', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: bdbspointData
                }
              })
              this.map.addLayer({
                id: 'bdbsregionCode+point',
                type: 'symbol',
                source: 'bdbsregionCode+point',
                layout: {
                  'icon-image': 'iconImgRed',
                  'icon-size': 1,
                  'icon-offset': [0, 0],
                  'icon-allow-overlap': true
                }
              })
              // 后勤保障 坐标
              const hqbzpointData = []
              res.data.hqbz.forEach((item, index) => {
                hqbzpointData.push({
                  type: 'Feature',
                  properties: item,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(item.pointJD), Number(item.pointWD)]
                  }
                })
              })
              this.map.addSource('hqbzregionCode+point', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: hqbzpointData
                }
              })
              this.map.addLayer({
                id: 'hqbzregionCode+point',
                type: 'symbol',
                source: 'hqbzregionCode+point',
                layout: {
                  'icon-image': 'iconImgBlue',
                  'icon-size': 1,
                  'icon-offset': [0, 0.6],
                  'icon-allow-overlap': true
                }
              })
              // 战备工程 坐标
              const zbgcpointData = []
              res.data.zbgc.forEach((item, index) => {
                zbgcpointData.push({
                  type: 'Feature',
                  properties: item,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(item.pointJD), Number(item.pointWD)]
                  }
                })
              })
              this.map.addSource('zbgcregionCode+point', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: zbgcpointData
                }
              })
              this.map.addLayer({
                id: 'zbgcregionCode+point',
                type: 'symbol',
                source: 'zbgcregionCode+point',
                layout: {
                  'icon-image': 'iconImgGreen',
                  'icon-size': 1,
                  'icon-offset': [0, 0.6],
                  'icon-allow-overlap': true
                }
              })
              // 鼠标悬浮时显示信息
              const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
              })
              this.map.on('mouseenter', 'bdbsregionCode+point', e => {
                this.map.getCanvas().style.cursor = 'pointer'
                // console.log(e)

                var coordinates = e.features[0].geometry.coordinates.slice()
                // console.log(coordinates);

                var pointDM = e.features[0].properties.pointDM
                var pointGC = e.features[0].properties.pointGC
                var pointJD = e.features[0].properties.pointJD
                var pointKZDM = e.features[0].properties.pointKZDM
                var pointMC = e.features[0].properties.pointMC
                var pointWD = e.features[0].properties.pointWD
                var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                // console.log(description)

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                popup
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(this.map)
              })

              this.map.on('mouseleave', 'bdbsregionCode+point', () => {
                this.map.getCanvas().style.cursor = ''
                popup.remove()
              })

              this.map.on('mouseenter', 'hqbzregionCode+point', e => {
                this.map.getCanvas().style.cursor = 'pointer'
                // console.log(e)

                var coordinates = e.features[0].geometry.coordinates.slice()
                // console.log(coordinates);

                var pointDM = e.features[0].properties.pointDM
                var pointGC = e.features[0].properties.pointGC
                var pointJD = e.features[0].properties.pointJD
                var pointKZDM = e.features[0].properties.pointKZDM
                var pointMC = e.features[0].properties.pointMC
                var pointWD = e.features[0].properties.pointWD
                var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                // console.log(description)

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                popup
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(this.map)
              })

              this.map.on('mouseleave', 'hqbzregionCode+point', () => {
                this.map.getCanvas().style.cursor = ''
                popup.remove()
              })

              this.map.on('mouseenter', 'zbgcregionCode+point', e => {
                this.map.getCanvas().style.cursor = 'pointer'
                // console.log(e)

                var coordinates = e.features[0].geometry.coordinates.slice()
                // console.log(coordinates);

                var pointDM = e.features[0].properties.pointDM
                var pointGC = e.features[0].properties.pointGC
                var pointJD = e.features[0].properties.pointJD
                var pointKZDM = e.features[0].properties.pointKZDM
                var pointMC = e.features[0].properties.pointMC
                var pointWD = e.features[0].properties.pointWD
                var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                // console.log(description)

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                popup
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(this.map)
              })

              this.map.on('mouseleave', 'zbgcregionCode+point', () => {
                this.map.getCanvas().style.cursor = ''
                popup.remove()
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },

    // 多边形
    polygon(e) {
      this.clearLayerAndSource()
      this.map.getCanvas().style.cursor = 'crosshair'
      e.stopPropagation()
      var isMeasure = true
      // 禁止双击缩放
      this.map.doubleClickZoom.disable()
      var jsonPoint = {
        type: 'FeatureCollection',
        features: []
      }
      var jsonLine = {
        type: 'FeatureCollection',
        features: []
      }
      var points = []
      var source = this.map.getSource('points-area')
      if (source) {
        this.map.getSource('points-area').setData(jsonPoint)
        this.map.getSource('line-area').setData(jsonLine)
      } else {
        this.map.addSource('points-area', {
          type: 'geojson',
          data: jsonPoint
        })
        this.map.addSource('line-area', {
          type: 'geojson',
          data: jsonLine
        })
        this.map.addLayer({
          id: 'line-area',
          type: 'fill',
          source: 'line-area',
          paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.1
          }
        })
        this.map.addLayer({
          id: 'line-area-stroke',
          type: 'line',
          source: 'line-area',
          paint: {
            'line-color': '#ff0000',
            'line-width': 2,
            'line-opacity': 0.65
          }
        })
        this.map.addLayer({
          id: 'points-area',
          type: 'circle',
          source: 'points-area',
          paint: {
            'circle-color': '#ffffff',
            'circle-radius': 3,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ff0000'
          }
        })
      }
      const _this = this
      function addPoint(coords) {
        jsonPoint.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: coords
          }
        })
        _this.map.getSource('points-area').setData(jsonPoint)
      }

      this.map.on('click', _e => {
        if (isMeasure) {
          var coords = [_e.lngLat.lng, _e.lngLat.lat]
          points.push(coords)
          addPoint(coords)
          // console.log(coords);
        }
      })

      this.map.on('mousemove', _e => {
        if (isMeasure) {
          var coords = [_e.lngLat.lng, _e.lngLat.lat]
          var len = jsonPoint.features.length
          if (len !== 0 && len !== 1) {
            var pts = points.concat([coords])
            pts = pts.concat([points[0]])
            var json = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [pts]
              }
            }
            this.map.getSource('line-area').setData(json)
          }
        }
      })

      this.map.on('dblclick', _e => {
        if (isMeasure) {
          var coords = [_e.lngLat.lng, _e.lngLat.lat]
          points.push(coords)
          isMeasure = false
          this.map.getCanvas().style.cursor = 'grab'
          // console.log(jsonPoint.features);
          // console.log(jsonPoint.features.slice(0,-1));
          var areaPointArrs = jsonPoint.features.slice(0, -1)
          // console.log(areaPointArr);
          var areaPointArr = []
          areaPointArr = areaPointArrs.map(i => {
            // console.log(i.geometry.coordinates);
            return i.geometry.coordinates
          })
          // console.log(areaPointArr);
          const data = {
            areaPointArr,
            type: 3
          }
          API.getRegionData(data).then(res => {
            // console.log(res);
            if (res.code === 200) {
              this.Alldata = res.data
              // 部队部署 坐标
              const bdbspointData = []
              res.data.bdbs.forEach((item, index) => {
                bdbspointData.push({
                  type: 'Feature',
                  properties: item,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(item.pointJD), Number(item.pointWD)]
                  }
                })
              })
              this.map.addSource('bdbsregionCode+point', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: bdbspointData
                }
              })
              this.map.addLayer({
                id: 'bdbsregionCode+point',
                type: 'symbol',
                source: 'bdbsregionCode+point',
                layout: {
                  'icon-image': 'iconImgRed',
                  'icon-size': 1,
                  'icon-offset': [0, 0.6],
                  'icon-allow-overlap': true
                }
              })
              // 后勤保障 坐标
              const hqbzpointData = []
              res.data.hqbz.forEach((item, index) => {
                hqbzpointData.push({
                  type: 'Feature',
                  properties: item,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(item.pointJD), Number(item.pointWD)]
                  }
                })
              })
              this.map.addSource('hqbzregionCode+point', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: hqbzpointData
                }
              })
              this.map.addLayer({
                id: 'hqbzregionCode+point',
                type: 'symbol',
                source: 'hqbzregionCode+point',
                layout: {
                  'icon-image': 'iconImgBlue',
                  'icon-size': 1,
                  'icon-offset': [0, 0.6],
                  'icon-allow-overlap': true
                }
              })
              // 战备工程 坐标
              const zbgcpointData = []
              res.data.zbgc.forEach((item, index) => {
                zbgcpointData.push({
                  type: 'Feature',
                  properties: item,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(item.pointJD), Number(item.pointWD)]
                  }
                })
              })
              this.map.addSource('zbgcregionCode+point', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: zbgcpointData
                }
              })
              this.map.addLayer({
                id: 'zbgcregionCode+point',
                type: 'symbol',
                source: 'zbgcregionCode+point',
                layout: {
                  'icon-image': 'iconImgGreen',
                  'icon-size': 1,
                  'icon-offset': [0, 0.6],
                  'icon-allow-overlap': true
                }
              })
              // 鼠标悬浮时显示信息
              const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
              })
              this.map.on('mouseenter', 'bdbsregionCode+point', e => {
                this.map.getCanvas().style.cursor = 'pointer'
                // console.log(e)

                var coordinates = e.features[0].geometry.coordinates.slice()
                // console.log(coordinates);

                var pointDM = e.features[0].properties.pointDM
                var pointGC = e.features[0].properties.pointGC
                var pointJD = e.features[0].properties.pointJD
                var pointKZDM = e.features[0].properties.pointKZDM
                var pointMC = e.features[0].properties.pointMC
                var pointWD = e.features[0].properties.pointWD
                var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                // console.log(description)

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                popup
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(this.map)
              })

              this.map.on('mouseleave', 'bdbsregionCode+point', () => {
                this.map.getCanvas().style.cursor = ''
                popup.remove()
              })

              this.map.on('mouseenter', 'hqbzregionCode+point', e => {
                this.map.getCanvas().style.cursor = 'pointer'
                // console.log(e)

                var coordinates = e.features[0].geometry.coordinates.slice()
                // console.log(coordinates);

                var pointDM = e.features[0].properties.pointDM
                var pointGC = e.features[0].properties.pointGC
                var pointJD = e.features[0].properties.pointJD
                var pointKZDM = e.features[0].properties.pointKZDM
                var pointMC = e.features[0].properties.pointMC
                var pointWD = e.features[0].properties.pointWD
                var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                // console.log(description)

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                popup
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(this.map)
              })

              this.map.on('mouseleave', 'hqbzregionCode+point', () => {
                this.map.getCanvas().style.cursor = ''
                popup.remove()
              })

              this.map.on('mouseenter', 'zbgcregionCode+point', e => {
                this.map.getCanvas().style.cursor = 'pointer'
                // console.log(e)

                var coordinates = e.features[0].geometry.coordinates.slice()
                // console.log(coordinates);

                var pointDM = e.features[0].properties.pointDM
                var pointGC = e.features[0].properties.pointGC
                var pointJD = e.features[0].properties.pointJD
                var pointKZDM = e.features[0].properties.pointKZDM
                var pointMC = e.features[0].properties.pointMC
                var pointWD = e.features[0].properties.pointWD
                var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                // console.log(description)

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                popup
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(this.map)
              })

              this.map.on('mouseleave', 'zbgcregionCode+point', () => {
                this.map.getCanvas().style.cursor = ''
                popup.remove()
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },

    // 画圆
    circle(e) {
      this.clearLayerAndSource()
      // var centerArr = []
      // var radiusInKms = ''
      // 绘制圆形区域的函数
      const createGeoJSONCircle = (center, radiusInKm, points) => {
        // console.log(center, typeof(radiusInKm),radiusInKm)
        if (!points) points = 64
        var coords = {
          latitude: center[1],
          longitude: center[0]
        }
        var km = radiusInKm
        var ret = []
        var distanceX =
          km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180))
        var distanceY = km / 110.574
        // console.log(distanceX,distanceY);

        var theta, x, y
        for (var i = 0; i < points; i++) {
          theta = (i / points) * (2 * Math.PI)
          x = distanceX * Math.cos(theta)
          y = distanceY * Math.sin(theta)

          ret.push([coords.longitude + x, coords.latitude + y])
        }
        ret.push(ret[0])

        return {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [ret]
          }
        }
      }

      // $('#circle').click(function(e) {
      //   debugger
      this.map.getCanvas().style.cursor = 'crosshair'
      e.stopPropagation()
      var isDraws = true
      // 禁止双击缩放
      this.map.doubleClickZoom.disable()
      // var radius = 0
      var jsonCircle = {
        type: 'FeatureCollection',
        features: []
      }
      let _pixelRadius = 0
      var source = this.map.getSource('circle')
      if (source) {
        // map.getSource('circle').setData(jsonCircle);
      } else {
        this.map.addSource('circle', {
          type: 'geojson',
          data: jsonCircle
        })
        this.map.addLayer({
          id: 'circle',
          type: 'fill',
          source: 'circle',
          layout: {},
          paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.1
            // "circle-radius": {
            //    stops: [
            //    [0, 0],
            //    [20, _pixelRadius]],
            //    base: 2
            //   },
            //  "circle-opacity": 0.5,
            // "circle-stroke-width": 1,
            // "circle-color": "#00f",
            // "circle-pitch-alignment": "map"
          }
        })
      }

      var points = []
      var starCoords = []
      let isMousemove = false
      let isFilst = true
      let filstCoords = []
      this.map.on('click', _e => {
        if (isDraws) {
          starCoords = []
          starCoords.push(_e.lngLat.lat)
          starCoords.unshift(_e.lngLat.lng)
          if (isFilst) {
            filstCoords = starCoords
            isFilst = false
          }
          points.push(starCoords)
          this.map
            .getSource('circle')
            .setData(createGeoJSONCircle(starCoords, 0))
          isMousemove = true
          isDraws = true
        }
      })
      var moveCoords = []
      this.map.on('mousemove', _e => {
        if (isDraws && isMousemove) {
          isDraws = true
          var centerCoords = []

          moveCoords = [_e.lngLat.lng, _e.lngLat.lat]
          if (filstCoords.length != 0) {
            centerCoords = [
              (parseFloat(filstCoords[0]) + parseFloat(moveCoords[0])) / 2,
              (parseFloat(filstCoords[1]) + parseFloat(moveCoords[1])) / 2
            ]
            var _points = []
            _points.push(moveCoords)
            _points.unshift(filstCoords)
            // points.concat([moveCoords]);
            var line = turf.lineString(_points)
            var len = turf.length(line)
            if (len < 1) {
              _pixelRadius = len
              // m
              // len = Math.round(len * 1000);
              //  map.getSource('circle').setData(createGeoJSONCircle(filstCoords, len));
            } else {
              // km
              len = len.toFixed(2)
              _pixelRadius = len
              this.map
                .getSource('circle')
                .setData(createGeoJSONCircle(filstCoords, len))
            }
          }
        }
      })
      this.map.on('dblclick', _e => {
        if (isDraws) {
          this.map.getCanvas().style.cursor = 'grab'
          jsonCircle = {
            type: 'FeatureCollection',
            features: []
          }
          // map.getSource('circle').setData(jsonCircle);
          isMousemove = false
          isDraws = false
          this.map.getCanvas().style.cursor = ''
          // var endCoords = [_e.lngLat.lng, _e.lngLat.lat]
          if (filstCoords.length !== 0) {
            // debugger
            // var _points = points.concat([endCoords]);
            var _points = []
            _points.push(moveCoords)
            _points.unshift(filstCoords)
            var line = turf.lineString(_points)
            var len = turf.length(line)
            if (len < 1) {
              _pixelRadius = len
              // len = Math.round(len * 1000);
              // map.getSource('circle').setData(createGeoJSONCircle(filstCoords, len));
            } else {
              len = len.toFixed(2)
              _pixelRadius = len
              this.map
                .getSource('circle')
                .setData(createGeoJSONCircle(filstCoords, len))
              // console.log(filstCoords,_pixelRadius);

              const data = {
                areaPointArr: [filstCoords],
                radio: _pixelRadius,
                type: 4
              }
              // console.log(data)
              API.getRegionData(data).then(res => {
                // console.log(res)
                if (res.code === 200) {
                  this.Alldata = res.data
                  // 部队部署 坐标
                  const bdbspointData = []
                  res.data.bdbs.forEach((item, index) => {
                    bdbspointData.push({
                      type: 'Feature',
                      properties: item,
                      geometry: {
                        type: 'Point',
                        coordinates: [
                          Number(item.pointJD),
                          Number(item.pointWD)
                        ]
                      }
                    })
                  })
                  this.map.addSource('bdbsregionCode+point', {
                    type: 'geojson',
                    data: {
                      type: 'FeatureCollection',
                      features: bdbspointData
                    }
                  })
                  this.map.addLayer({
                    id: 'bdbsregionCode+point',
                    type: 'symbol',
                    source: 'bdbsregionCode+point',
                    layout: {
                      'icon-image': 'iconImgRed',
                      'icon-size': 1,
                      'icon-offset': [0, 0.6],
                      'icon-allow-overlap': true
                    }
                  })
                  // 后勤保障 坐标
                  const hqbzpointData = []
                  res.data.hqbz.forEach((item, index) => {
                    hqbzpointData.push({
                      type: 'Feature',
                      properties: item,
                      geometry: {
                        type: 'Point',
                        coordinates: [
                          Number(item.pointJD),
                          Number(item.pointWD)
                        ]
                      }
                    })
                  })
                  this.map.addSource('hqbzregionCode+point', {
                    type: 'geojson',
                    data: {
                      type: 'FeatureCollection',
                      features: hqbzpointData
                    }
                  })
                  this.map.addLayer({
                    id: 'hqbzregionCode+point',
                    type: 'symbol',
                    source: 'hqbzregionCode+point',
                    layout: {
                      'icon-image': 'iconImgBlue',
                      'icon-size': 1,
                      'icon-offset': [0, 0.6],
                      'icon-allow-overlap': true
                    }
                  })
                  // 战备工程 坐标
                  const zbgcpointData = []
                  res.data.zbgc.forEach((item, index) => {
                    zbgcpointData.push({
                      type: 'Feature',
                      properties: item,
                      geometry: {
                        type: 'Point',
                        coordinates: [
                          Number(item.pointJD),
                          Number(item.pointWD)
                        ]
                      }
                    })
                  })
                  this.map.addSource('zbgcregionCode+point', {
                    type: 'geojson',
                    data: {
                      type: 'FeatureCollection',
                      features: zbgcpointData
                    }
                  })
                  this.map.addLayer({
                    id: 'zbgcregionCode+point',
                    type: 'symbol',
                    source: 'zbgcregionCode+point',
                    layout: {
                      'icon-image': 'iconImgGreen',
                      'icon-size': 1,
                      'icon-offset': [0, 0.6],
                      'icon-allow-overlap': true
                    }
                  })

                  // 鼠标悬浮时显示信息
                  const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                  })
                  this.map.on('mouseenter', 'bdbsregionCode+point', e => {
                    this.map.getCanvas().style.cursor = 'pointer'
                    // console.log(e)

                    var coordinates = e.features[0].geometry.coordinates.slice()
                    // console.log(coordinates);

                    var pointDM = e.features[0].properties.pointDM
                    var pointGC = e.features[0].properties.pointGC
                    var pointJD = e.features[0].properties.pointJD
                    var pointKZDM = e.features[0].properties.pointKZDM
                    var pointMC = e.features[0].properties.pointMC
                    var pointWD = e.features[0].properties.pointWD
                    var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                    // console.log(description)

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                      coordinates[0] +=
                        e.lngLat.lng > coordinates[0] ? 360 : -360
                    }

                    popup
                      .setLngLat(coordinates)
                      .setHTML(description)
                      .addTo(this.map)
                  })

                  this.map.on('mouseleave', 'bdbsregionCode+point', () => {
                    this.map.getCanvas().style.cursor = ''
                    popup.remove()
                  })

                  this.map.on('mouseenter', 'hqbzregionCode+point', e => {
                    this.map.getCanvas().style.cursor = 'pointer'
                    // console.log(e)

                    var coordinates = e.features[0].geometry.coordinates.slice()
                    // console.log(coordinates);

                    var pointDM = e.features[0].properties.pointDM
                    var pointGC = e.features[0].properties.pointGC
                    var pointJD = e.features[0].properties.pointJD
                    var pointKZDM = e.features[0].properties.pointKZDM
                    var pointMC = e.features[0].properties.pointMC
                    var pointWD = e.features[0].properties.pointWD
                    var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                    // console.log(description)

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                      coordinates[0] +=
                        e.lngLat.lng > coordinates[0] ? 360 : -360
                    }

                    popup
                      .setLngLat(coordinates)
                      .setHTML(description)
                      .addTo(this.map)
                  })

                  this.map.on('mouseleave', 'hqbzregionCode+point', () => {
                    this.map.getCanvas().style.cursor = ''
                    popup.remove()
                  })

                  this.map.on('mouseenter', 'zbgcregionCode+point', e => {
                    this.map.getCanvas().style.cursor = 'pointer'
                    // console.log(e)

                    var coordinates = e.features[0].geometry.coordinates.slice()
                    // console.log(coordinates);

                    var pointDM = e.features[0].properties.pointDM
                    var pointGC = e.features[0].properties.pointGC
                    var pointJD = e.features[0].properties.pointJD
                    var pointKZDM = e.features[0].properties.pointKZDM
                    var pointMC = e.features[0].properties.pointMC
                    var pointWD = e.features[0].properties.pointWD
                    var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                    // console.log(description)

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                      coordinates[0] +=
                        e.lngLat.lng > coordinates[0] ? 360 : -360
                    }

                    popup
                      .setLngLat(coordinates)
                      .setHTML(description)
                      .addTo(this.map)
                  })

                  this.map.on('mouseleave', 'zbgcregionCode+point', () => {
                    this.map.getCanvas().style.cursor = ''
                    popup.remove()
                  })
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
            // console.log(filstCoords,_pixelRadius);
          }
        }
      })
      // })
    },

    // 画正方形
    square(e) {
      // 清除图层
      this.clearLayerAndSource()
      this.map.getCanvas().style.cursor = 'crosshair'
      // 阻止事件冒泡
      e.stopPropagation()
      var isDraw = true
      // 禁止双击缩放
      this.map.doubleClickZoom.disable()
      var jsonPoint = {
        type: 'FeatureCollection',
        features: []
      }
      jsonPoint.features = []
      var source = this.map.getSource('rectangle')
      if (source) {
        this.map.getSource('rectangle').setData(jsonPoint)
      } else {
        this.map.addSource('rectangle', {
          type: 'geojson',
          data: jsonPoint
        })
        this.map.addLayer({
          id: 'rectangle',
          type: 'fill',
          minzoom: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）
          maxzoom: 24,
          source: 'rectangle',
          layout: {},
          paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.1
          }
        })
      }
      var starCoords = []
      let isMousemove = false
      // 开始的经纬度
      this.map.on('click', _e => {
        if (isDraw) {
          starCoords = [_e.lngLat.lng, _e.lngLat.lat]
          isMousemove = true
          if (this.a === 0) {
            this.a = 1
            // console.log('starCoords', _e.lngLat.lng, _e.lngLat.lat)
            this.starCoords = starCoords
          }
        }
        return false
      })

      // var moveCoords = []
      // 移动时
      this.map.on('mousemove', _e => {
        if (isDraw && isMousemove) {
          var moveCoords = []
          moveCoords = [_e.lngLat.lng, _e.lngLat.lat]
          var rightTopCoords = []
          rightTopCoords = [moveCoords[0], starCoords[1]]
          var buttomLeftCoords = []
          buttomLeftCoords = [starCoords[0], moveCoords[1]]
          var coords = []
          coords = [
            starCoords,
            rightTopCoords,
            moveCoords,
            buttomLeftCoords,
            starCoords
          ]
          jsonPoint.features = []
          jsonPoint.features.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [coords]
            }
          })
          this.map.getSource('rectangle').setData(jsonPoint)
        }
      })
      // 结尾的经纬度
      this.map.on('dblclick', _e => {
        // debugger
        if (isDraw) {
          isMousemove = false
          isDraw = false
          this.map.getCanvas().style.cursor = 'grab'
          var endCoords = [_e.lngLat.lng, _e.lngLat.lat]
          var rightTopCoords = []
          rightTopCoords = [endCoords[0], this.starCoords[1]]
          var buttomLeftCoords = []
          buttomLeftCoords = [this.starCoords[0], endCoords[1]]
          var coords = []
          // 上右下左
          coords = [
            this.starCoords,
            rightTopCoords,
            endCoords,
            buttomLeftCoords
          ]
          jsonPoint.features.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: coords
            }
          })

          this.map.getSource('rectangle').setData(jsonPoint)

          const areaPointArr = [this.starCoords, endCoords]
          const data = {
            areaPointArr: areaPointArr,
            type: 2
          }
          // console.log(areaPointArr);
          API.getRegionData(data).then(res => {
            // console.log(res)
            if (res.code === 200) {
              console.log(res.data)
              this.Alldata = res.data
              // 部队部署 坐标
              const bdbspointData = []
              res.data.bdbs.forEach((item, index) => {
                bdbspointData.push({
                  type: 'Feature',
                  properties: item,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(item.pointJD), Number(item.pointWD)]
                  }
                })
              })
              // console.log(bdbspointData)

              this.map.addSource('bdbsregionCode+point', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: bdbspointData
                }
              })
              this.map.addLayer({
                id: 'bdbsregionCode+point',
                type: 'symbol',
                source: 'bdbsregionCode+point',
                layout: {
                  'icon-image': 'iconImgRed',
                  'icon-size': 1,
                  'icon-offset': [0, 0.6],
                  'icon-allow-overlap': true
                }
              })
              // 后勤保障 坐标
              const hqbzpointData = []
              res.data.hqbz.forEach((item, index) => {
                hqbzpointData.push({
                  type: 'Feature',
                  properties: item,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(item.pointJD), Number(item.pointWD)]
                  }
                })
              })
              this.map.addSource('hqbzregionCode+point', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: hqbzpointData
                }
              })
              this.map.addLayer({
                id: 'hqbzregionCode+point',
                type: 'symbol',
                source: 'hqbzregionCode+point',
                layout: {
                  'icon-image': 'iconImgBlue',
                  'icon-size': 1,
                  'icon-offset': [0, 0.6],
                  'icon-allow-overlap': true
                }
              })
              // 战备工程 坐标
              const zbgcpointData = []
              res.data.zbgc.forEach((item, index) => {
                zbgcpointData.push({
                  type: 'Feature',
                  properties: item,
                  geometry: {
                    type: 'Point',
                    coordinates: [Number(item.pointJD), Number(item.pointWD)]
                  }
                })
              })
              this.map.addSource('zbgcregionCode+point', {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: zbgcpointData
                }
              })
              this.map.addLayer({
                id: 'zbgcregionCode+point',
                type: 'symbol',
                source: 'zbgcregionCode+point',
                layout: {
                  'icon-image': 'iconImgGreen',
                  'icon-size': 1,
                  'icon-offset': [0, 0.6],
                  'icon-allow-overlap': true
                }
              })

              // 鼠标悬浮时显示信息
              const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
              })
              this.map.on('mouseenter', 'bdbsregionCode+point', e => {
                this.map.getCanvas().style.cursor = 'pointer'
                // console.log(e)

                var coordinates = e.features[0].geometry.coordinates.slice()
                // console.log(coordinates);

                var pointDM = e.features[0].properties.pointDM
                var pointGC = e.features[0].properties.pointGC
                var pointJD = e.features[0].properties.pointJD
                var pointKZDM = e.features[0].properties.pointKZDM
                var pointMC = e.features[0].properties.pointMC
                var pointWD = e.features[0].properties.pointWD
                var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                // console.log(description)

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                popup
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(this.map)
              })

              this.map.on('mouseleave', 'bdbsregionCode+point', () => {
                this.map.getCanvas().style.cursor = ''
                popup.remove()
              })

              this.map.on('mouseenter', 'hqbzregionCode+point', e => {
                this.map.getCanvas().style.cursor = 'pointer'
                // console.log(e)

                var coordinates = e.features[0].geometry.coordinates.slice()
                // console.log(coordinates);

                var pointDM = e.features[0].properties.pointDM
                var pointGC = e.features[0].properties.pointGC
                var pointJD = e.features[0].properties.pointJD
                var pointKZDM = e.features[0].properties.pointKZDM
                var pointMC = e.features[0].properties.pointMC
                var pointWD = e.features[0].properties.pointWD
                var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                // console.log(description)

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                popup
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(this.map)
              })

              this.map.on('mouseleave', 'hqbzregionCode+point', () => {
                this.map.getCanvas().style.cursor = ''
                popup.remove()
              })

              this.map.on('mouseenter', 'zbgcregionCode+point', e => {
                this.map.getCanvas().style.cursor = 'pointer'
                // console.log(e)

                var coordinates = e.features[0].geometry.coordinates.slice()
                // console.log(coordinates);

                var pointDM = e.features[0].properties.pointDM
                var pointGC = e.features[0].properties.pointGC
                var pointJD = e.features[0].properties.pointJD
                var pointKZDM = e.features[0].properties.pointKZDM
                var pointMC = e.features[0].properties.pointMC
                var pointWD = e.features[0].properties.pointWD
                var description = `<p>名称:${pointMC}</p><p>地名:${pointDM}</p><p>扩展地名:${pointKZDM}</p><p>纬度:${pointWD}</p><p>经度:${pointJD}</p><p>高程:${pointGC}</p>`
                // console.log(description)

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                }

                popup
                  .setLngLat(coordinates)
                  .setHTML(description)
                  .addTo(this.map)
              })

              this.map.on('mouseleave', 'zbgcregionCode+point', () => {
                this.map.getCanvas().style.cursor = ''
                popup.remove()
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
        return false
      })
    },

    // 过滤节点方法  单位编制
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 远程搜索时点击子节点的值
    SearchMap(item) {
      this.SearchValue = item.regionCode
    },
    // 点击搜索按钮
    search() {
      if (this.SearchValue === '') {
        this.$message.error('请输入内容')
        return
      } else {
        this.clearLayerAndSource()
        this.getSearchRegionData()
      }
    },
    // 可清空的单选模式下用户点击清空按钮时触发
    delValue() {
      this.clearLayerAndSource()
    },
    // 选定行政区域或自定义边界内数据综合查询
    getSearchRegionData() {
      const data = {
        regionCode: this.SearchValue,
        type: 1
      }
      API.getRegionData(data).then(res => {
        // console.log(res)
        if (res.code === 200) {
          // 部队部署 坐标
          const bdbspointData = []
          res.data.bdbs.forEach((item, index) => {
            bdbspointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          this.map.addSource('bdbsregionCode+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: bdbspointData
            }
          })
          this.map.addLayer({
            id: 'bdbsregionCode+point',
            type: 'symbol',
            source: 'bdbsregionCode+point',
            layout: {
              'icon-image': 'iconImgRed',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
          // 后勤保障 坐标
          const hqbzpointData = []
          res.data.hqbz.forEach((item, index) => {
            hqbzpointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          this.map.addSource('hqbzregionCode+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: hqbzpointData
            }
          })
          this.map.addLayer({
            id: 'hqbzregionCode+point',
            type: 'symbol',
            source: 'hqbzregionCode+point',
            layout: {
              'icon-image': 'iconImgBlue',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
          // 战备工程 坐标
          const zbgcpointData = []
          res.data.zbgc.forEach((item, index) => {
            zbgcpointData.push({
              type: 'Feature',
              properties: item,
              geometry: {
                type: 'Point',
                coordinates: [Number(item.pointJD), Number(item.pointWD)]
              }
            })
          })
          this.map.addSource('zbgcregionCode+point', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: zbgcpointData
            }
          })
          this.map.addLayer({
            id: 'zbgcregionCode+point',
            type: 'symbol',
            source: 'zbgcregionCode+point',
            layout: {
              'icon-image': 'iconImgGreen',
              'icon-size': 1,
              'icon-offset': [0, 0.6],
              'icon-allow-overlap': true
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 远程搜索方法  参数为当前输入值
    remoteMethod(query) {
      if (query === '') {
        return
      }
      this.Region = query
      const params = {
        region: this.Region
      }
      API.getRegion(params).then(res => {
        // console.log(res);
        if (res.code === 200) {
          this.states = res.data.map(i => {
            return {
              regionFullName: i.regionFullName,
              regionCode: i.regionCode
            }
          })

          // 远程搜索
          this.list = this.states.map(item => {
            // console.log(this.states,this.list)
            return {
              value: item.regionFullName,
              label: item.regionFullName,
              regionCode: item.regionCode
            }
          })

          if (query !== '') {
            this.loading = true
            setTimeout(() => {
              this.loading = false
              this.options = this.list.filter(item => {
                return (
                  item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                )
              })
            }, 200)
          } else {
            this.options = []
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 17px #ffffff;
  background-color: #ccc;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: #fff;
  background-image: -webkit-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.74) 0%,
    rgba(255, 255, 255, 0.74) 25%,
    transparent 100%,
    rgba(255, 255, 255, 0.74) 75%,
    transparent
  );
}
* {
  margin: 0;
  padding: 0;
}
#map {
  padding: 0px;
  position: relative;
  display: flex;
  .left {
    position: absolute;
    z-index: 1;
    top: 80px;
    left: 46px;
    .leftTop {
      display: flex;
      margin-bottom: 12px;
      position: relative;
      .leftTopSelect {
        width: 90px;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 1;
      }
      .leftTopSearch {
        padding-left: 87px;
        width: 337px;
        padding-right: 40px;
      }
      .leftTopBtn {
        height: 32px;
        width: 46px;
        position: absolute;
        right: 0px;
        z-index: 1;
      }
    }
    .leftCenter {
      padding: 7px 10px;
      overflow: scroll;
      width: 215px;
      height: 506px;
      background: rgba(255, 255, 255, 0.74);
      .filter-tree {
        background-color: rgba(255, 255, 255, 0.74);
      }
    }
    .leftBtm {
      width: 215px;
      height: 166px;
      background-color: rgba(255, 255, 255, 0.74);
      position: absolute;
      z-index: 1;
      top: 615px;
      .leftBtmBox {
        height: 40px;
        margin-bottom: 10px;
        margin-top: 12px;
        /* font-size: 14px; */
        line-height: 40px;
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        justify-content: space-around;
      }
    }
  }
  .right {
    padding: 0 10px;
    position: absolute;
    z-index: 1;
    top: 80px;
    right: 46px;
    width: 333px;
    display: flex;
    height: 40px;
    background: rgba(255, 255, 255, 0.74);
    button {
      background: rgba(255, 255, 255, 0.07);
      border: none;
      img {
        width: 18px;
        height: 18px;
      }
    }
    .ipt {
      margin-left: 10px;
      width: 125px;
      margin-top: 4px;
      .el-input__inner {
        background: #eee !important;
      }
    }
    .ipts {
      width: 125px;
      margin-top: 4px;
      .el-input__inner {
        background: #eee !important;
      }
    }
    p {
      width: 50px;
      margin: 10px;
      font-size: 15px;
    }
  }
}
</style>
