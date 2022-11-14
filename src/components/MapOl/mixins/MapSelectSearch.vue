<script>
import Draw, {
  createBox
} from 'ol/interaction/Draw'
import GeoJSON from 'ol/format/GeoJSON'
import { Circle } from 'ol/geom'
import Feature from 'ol/Feature'
import { Fill, Stroke, Style } from 'ol/style'
export default {
  data() {
    return {
      // 绘制对象
      drawObj: null
    }
  },
  methods: {
    // 初始化圆圈绘制
    initDrawCircleInteraction() {
      if (this.draw) {
        this.map.removeInteraction(this.draw)
        this.isStartMeasure = false
        this.helpTooltipElement.classList.add('hidden')
      }
      this.map.removeInteraction(this.drawObj)
      this.drawObj = new Draw({
        source: this.drawSource,
        type: 'Circle'
      })
      this.map.addInteraction(this.drawObj)
      // 监听绘制结束事件
      this.drawObj.on('drawend', (evt) => {
        console.log('结束事件', evt)
        const polygon = evt.feature.getGeometry()
        const center = polygon.getCenter()
        var metersPerUnit = this.map.getView().getProjection().getMetersPerUnit()
        console.log(metersPerUnit, polygon.getRadius())
        const radius = polygon.getRadius() * metersPerUnit / 1500
        this.$emit('searchByRange', {
          areaPointArr: center,
          radio: radius,
          type: 'circle'
        })
        this.map.removeInteraction(this.drawObj)
        this.drawSource.clear()
      })
    },
    // 初始化四边形绘制
    initDrawRectangleInteraction() {
      if (this.draw) {
        this.map.removeInteraction(this.draw)
        this.isStartMeasure = false
        this.helpTooltipElement.classList.add('hidden')
      }
      this.map.removeInteraction(this.drawObj)
      this.drawObj = new Draw({
        source: this.drawSource,
        type: 'Circle',
        geometryFunction: createBox()
      })
      this.map.addInteraction(this.drawObj)
      // 监听绘制结束事件
      this.drawObj.on('drawend', (evt) => {
        console.log('结束事件', evt.feature.getGeometry().getExtent())
        var feature = evt.feature
        var extent = feature.getGeometry().getExtent()
        // 地理坐标转化为屏幕坐标
        var coord = [extent[0], extent[3]]
        var leftTopPosttion = this.map.getPixelFromCoordinate(coord)
        var coord1 = [extent[2], extent[1]]
        var bottomRightPosttion = this.map.getPixelFromCoordinate(coord1)
        console.log('左上右下', leftTopPosttion, bottomRightPosttion)
        // 矩形宽高
        var width = Math.abs(bottomRightPosttion[0] - leftTopPosttion[0])
        var height = Math.abs(bottomRightPosttion[1] - leftTopPosttion[1])
        console.log('宽高', width, height)
        // 矩形左上角坐标
        var minX = leftTopPosttion[0] <= bottomRightPosttion[0] ? leftTopPosttion[0] : bottomRightPosttion[0]
        var minY = leftTopPosttion[1] <= bottomRightPosttion[1] ? leftTopPosttion[1] : bottomRightPosttion[1]
        console.log('左上角坐标', minX, minY)

        const featureGeoJson = JSON.parse(new GeoJSON().writeFeature(evt.feature))
        this.$emit('searchByRange', {
          areaPointArr: featureGeoJson.geometry.coordinates[0],
          type: 'rect'
        }, minX, minY, width, height)
        this.map.removeInteraction(this.drawObj)
        this.drawSource.clear()
      })
    },
    // 初始化多边形绘制
    initDrawPolygonInteraction() {
      if (this.draw) {
        this.map.removeInteraction(this.draw)
        this.isStartMeasure = false
        this.helpTooltipElement.classList.add('hidden')
      }
      this.map.removeInteraction(this.drawObj)
      this.drawObj = new Draw({
        source: this.measureSource,
        type: 'Polygon'
      })
      this.map.addInteraction(this.drawObj)
      // 监听绘制结束事件
      this.drawObj.on('drawend', (evt) => {
        const featureGeoJson = JSON.parse(new GeoJSON().writeFeature(evt.feature))
        this.$emit('searchByRange', {
          areaPointArr: featureGeoJson.geometry.coordinates[0],
          type: 'Polygon'
        })
        this.map.removeInteraction(this.drawObj)
        this.drawSource.clear()
      })
    },
    // 根据半径和中心点添加圆
    addCircleByCenterAndRadius(center, radius) {
      var metersPerUnit = this.map.getView().getProjection().getMetersPerUnit()
      var circleFeature = new Feature({
        geometry: new Circle(center, Number(radius * 1500 / metersPerUnit))
      })
      circleFeature.setStyle(
        new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0)'
          }),
          stroke: new Stroke({
            color: '#E74033',
            width: 2
          })
        })
      )
      this.markerLayer.getSource().addFeature(circleFeature)
    }
  }
}
</script>

<style>

</style>
