<template>
  <el-dialog
    title="地图选点"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%"
    :before-close="onHandleClose"
  >
    <div id="MapSelectPosition" class="map-section" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onHandleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    position: {
      type: Array,
      default: () => {
        return [109.1622, 34.3230]
      }
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      lngLat: {
        lng: 109.1622,
        lat: 34.3230
      },
      isLoadedMap: false,
      marker: null
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('closeDialog')
      } else {
        if (!this.isLoadedMap) {
          setTimeout(() => {
            this.initMap()
          }, 2000)
        }
      }
    },
    position(val) {
      if (this.marker && val[0] && val[1]) {
        this.marker.setLngLat(new mapboxgl.LngLat(...val))
        console.log(val)
        window.map.flyTo({ center: val })
      }
    }
  },
  methods: {
    initMap() {
      const center = this.position && this.position[0] && this.position[1] ? this.position : [109.1622, 34.3230]
      const _this = this
      mapboxgl.accessToken = 'pk.eyJ1IjoiMTU2MDA1ODc1MzEiLCJhIjoiY2pqemo4em01YXoyaTN2bGZ0YnhyNWhrayJ9.cBK7DuuLXgb4Pu-2g_eRAQ'
      window.map = new mapboxgl.Map({
        container: 'MapSelectPosition',
        style: {
          // 设置版本号，一定要设置
          version: 8,
          // 添加来源
          sources: {
            tdtVec: {
            // 类型为栅格瓦片
              type: 'raster',
              tiles: [
                'http://192.168.1.35:8857/tile/service/v1/tile?map=1&x={x}&y={y}&z={z}'
              ],
              // 分辨率
              tileSize: 256
            }
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
        center: center,
        zoom: 10
      })
      this.marker = new mapboxgl.Marker({
        draggable: true,
        anchor: 'center',
        offset: [262, -416]
      }).setLngLat(center)
        .addTo(window.map)
      function onDragEnd() {
        var lngLat = _this.marker.getLngLat()
        _this.lngLat = lngLat
      }
      this.marker.on('dragend', onDragEnd)
      this.isLoadedMap = true
    },
    onHandleClose() {
      this.dialogVisible = false
    },
    onHandleConfirm() {
      this.$emit('getPoint', this.lngLat)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .map-section{
    width: 100%;
    height: 400px;
  }
  .dialog-footer{
    text-align: right;
  }
</style>
<style>
.mapboxgl-control-container{
  display: none;
}
</style>
