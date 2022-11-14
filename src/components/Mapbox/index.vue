<template>
  <div id="map" ref="basicMapbox" :style="mapSize" style="border-radius: 7px;" />
</template>
<script>
import { mapGetters } from 'vuex'
import { MAPURL } from '@/utils/index.js'
import * as turf from '@turf/turf'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
export default {
  props: {
    mapWidth: {
      type: String,
      default: '100%'
    },
    mapHeight: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      map: undefined,
      // vecUrl: 'http://t0.tianditu.com/vec_w/wmts?tk=e90d56e5a09d1767899ad45846b0cefd',
      cvaUrl: 'http://t0.tianditu.com/cva_w/wmts?tk=e90d56e5a09d1767899ad45846b0cefd',
      vecUrl: MAPURL
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    mapSize() {
      const styleObj = {
        width: this.mapWidth,
        height: this.mapHeight
      }
      return styleObj
    }
  },
  watch: {
    'sidebar.opened': {
      deep: true,
      handler: function(newV, oldV) {
        setTimeout(() => {
          this.map.resize()
        }, 300)
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      var tdtVec = {
        // 类型为栅格瓦片
        'type': 'raster',
        'tiles': [
          // 请求地址
          // this.vecUrl + '&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles'
          // 'http://192.168.1.65:8857/tile/service/v1/tile?map=1&x={x}&y={y}&z={z}'
          this.vecUrl
        ],
        // 分辨率
        'tileSize': 256
      }
      // var tdtCva = {
      //   'type': 'raster',
      //   'tiles': [
      //     this.cvaUrl + '&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles'
      //   ],
      //   'tileSize': 256
      // }
      const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
      mapboxgl.accessToken = 'pk.eyJ1IjoiMTU2MDA1ODc1MzEiLCJhIjoiY2pqemo4em01YXoyaTN2bGZ0YnhyNWhrayJ9.cBK7DuuLXgb4Pu-2g_eRAQ'
      // this.map = new mapboxgl.Map({
      //   container: this.$refs.basicMapbox,
      //   style: 'mapbox://styles/mapbox/streets-v10',
      //   zoom: 13,
      //   // center: [4.899, 52.372]
      //   center: [103.83735604457024, 1.360253881403068]
      // })
      this.map = new mapboxgl.Map({
        // 地图容器div的id
        container: this.$refs.basicMapbox,
        style: {
          // 设置版本号，一定要设置
          'version': 8,
          // 添加来源
          'sources': {
            'tdtVec': tdtVec
            // 'tdtCva': tdtCva
          },
          'layers': [
            {
              // 图层id，要保证唯一性
              'id': 'tdtVec',
              // 图层类型
              'type': 'raster',
              // 数据源
              'source': 'tdtVec',
              // 图层最小缩放级数
              'minzoom': 0,
              // 图层最大缩放级数
              'maxzoom': 24
            }
            // {
            //   'id': 'tdtCva',
            //   'type': 'raster',
            //   'source': 'tdtCva',
            //   'minzoom': 0,
            //   'maxzoom': 17
            // }
          ]
        },
        // 地图中心点
        center: [123.47167, 41.683614],
        // 地图当前缩放级数
        zoom: 10
      })
      this.map.addControl(
        new mapboxgl.NavigationControl()
      )
      this.draw = new MapboxDraw({
        displayControlsDefault: false
      })
      this.map.addControl(this.draw)
    },
    addPointMarker(pros) {
      const map = this.map
      const that = this
      map.on('load', function() {
        map.loadImage(pros.marker, function(error, image) {
          if (error) throw error
          if (!map.hasImage(pros.markName)) {
            map.addImage(pros.markName, image)
          }
          // 先判断是否加载了该 id 的图片资源，没有则加载
          map.addLayer({
            id: pros.markName,
            type: 'symbol',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: pros.coord
                  }
                }]
              }
            },
            layout: {
              // 使用图片资源
              'icon-image': pros.markName,
              // 缩放
              'icon-size': 1,
              // 旋转角度
              'icon-rotate': pros.rotate,
              // 偏移量
              'icon-offset': [0, -15],
              // 跟随地图转动，推拉（3d效果那种）Mapbox 中叫 bearing 和 pitch
              'icon-rotation-alignment': 'map',
              'icon-allow-overlap': true,
              'icon-ignore-placement': true
            }
          })
          if (pros.dispaly) {
            map.on('click', pros.markName, function(e) {
              that.$emit('fatherMethod')
            })
          }
        })
      })
      if (pros.dispaly) {
        // 添加 icon 和 名称 标记
        const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
        var coord = pros.coord
        var location = '东经E:' + pros.coord[0] + '  北纬N:' + pros.coord[1]
        var time = pros.time
        // 创建 div.marker-wrap, div.marker-title, div.marker-wrap 用作定位, div.marker-title 显示标题
        const elWrap = document.createElement('div')
        elWrap.setAttribute('id', 'div_' + pros.markName)
        elWrap.style.marginTop = '15px'
        elWrap.style.border = '1px solid #186fca'
        elWrap.className = 'marker-wrap'
        // let isvisible = false
        elWrap.addEventListener('click', function() {
          that.$emit('fatherMethod')
          // this.showNotice()
          // isvisible = !isvisible
          // if (isvisible) {
          //   elWrap.setAttribute('style', 'display:block;')
          // } else {
          //   elWrap.setAttribute('style', 'display:none;')
          // }
          if (map.getZoom() < 6.5) {
            that.flyTo()
          }
        })
        const elTitle = document.createElement('div')
        elTitle.className = 'marker-title'
        elTitle.innerHTML = '<span style="margin-top:20px;font-size: 8px;font-weight: bold;color:#323B64;">' + time + '<br/>' + location + '</span>'
        elWrap.appendChild(elTitle)
        new mapboxgl.Marker(elWrap).setLngLat(coord).addTo(map)
        // var showInfo = '<div id="' + 'marker-title-' + pros + '" style="border:1px solid #B3B3B3;">'
        //   + '<span style="font-size: 10px;font-weight: bold;color:#323B64;">'
        //   + time + '<br/>' + location + '</span>' + '</div>'
        // new mapboxgl.Popup().setLngLat(coord).setHTML(showInfo).addTo(map)
      }
    },
    addLineMarker(coords) {
      const map = this.map
      var route = {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': coords
        }
      }
      var bbox = turf.bbox(route)
      map.fitBounds(bbox, {
        padding: { top: 10, bottom: 10, left: 10, right: 10 }
      })
      map.on('load', function() {
        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': route
          },
          'layout': {
            'line-miter-limit': 2,
            'line-join': 'miter'
          },
          'paint': {
            'line-color': '#46BEE9',
            'line-width': 4
          }
        })
      })
    }
  }
}
</script>
<style>
@import "../../assets/css/mapbox-gl.css";
a.mapboxgl-ctrl-logo {
  display: none;
}
</style>
