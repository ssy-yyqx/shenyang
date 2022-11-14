<script>
import Draw from 'ol/interaction/Draw'
import { LineString, Polygon } from 'ol/geom'
import Overlay from 'ol/Overlay'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { getArea, getLength } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
export default {
  data() {
    return {
      // 当前绘制的图形
      sketch: null,
      // The help tooltip element.
      helpTooltipElement: null,
      // Overlay to show the help messages.
      helpTooltip: null,
      // The measure tooltip element.
      measureTooltipElement: null,
      // Overlay to show the measurement.
      measureTooltip: null,
      // 继续绘制图形提示语
      continuePolygonMsg: '点击继续绘制图形',
      // 继续绘制线提示语
      continueLineMsg: '点击继续绘制线',
      // global so we can remove it later
      draw: null,
      // 绘图事件
      listener: null
    }
  },
  methods: {
    // 绘制过程中的操作提示
    pointerMoveHandler(evt) {
      if (evt.dragging) {
        return
      }
      let helpMsg = '点击开始绘制'
      if (this.sketch) {
        const geom = this.sketch.getGeometry()
        if (geom instanceof Polygon) {
          helpMsg = this.continuePolygonMsg
        } else if (geom instanceof LineString) {
          helpMsg = this.continueLineMsg
        }
      }

      this.helpTooltipElement.innerHTML = helpMsg
      this.helpTooltip.setPosition(evt.coordinate)

      this.helpTooltipElement.classList.remove('hidden')
    },
    // Format length output.
    formatLength: function(line) {
      var length = getLength(line, {
        projection: 'EPSG:4326'
      })
      var output
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm'
      }
      return output
    },
    // Format area output.
    formatArea: function(polygon) {
      var area = getArea(polygon, {
        projection: 'EPSG:4326'
      })
      var output
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
      } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
      }
      return output
    },
    // 初始化绘制
    addInteraction(drawType, map) {
      if (this.drawObj) {
        map.removeInteraction(this.drawObj)
      }

      if (this.draw) {
        map.removeInteraction(this.draw)
      }
      this.draw = new Draw({
        source: this.measureSource,
        type: drawType,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      })
      map.addInteraction(this.draw)
      // 测量结果
      this.createMeasureTooltip(map)
      // 测量操作提示
      this.createHelpTooltip(map)
      // 绑定绘制事件
      this.bindDrawEvent(map)
    },
    // 绑定绘制事件
    bindDrawEvent(map) {
      this.draw.on('drawstart', (evt) => {
        // set sketch
        this.sketch = evt.feature
        var tooltipCoord = evt.coordinate
        this.listener = this.sketch.getGeometry().on('change', (evt) => {
          var geom = evt.target
          var output
          if (geom instanceof Polygon) {
            output = this.formatArea(geom)
            tooltipCoord = geom.getInteriorPoint().getCoordinates()
          } else if (geom instanceof LineString) {
            output = this.formatLength(geom)
            tooltipCoord = geom.getLastCoordinate()
          }
          // 测量结果提示语
          this.measureTooltipElement.innerHTML = output
          this.measureTooltip.setPosition(tooltipCoord)
        })
      })
      this.draw.on('drawend', () => {
        setTimeout(() => {
          // 结束绘制标志
          this.isStartMeasure = false
          this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
          this.measureTooltip.setOffset([0, -7])
          // 测量操作提示语
          this.helpTooltipElement.classList.add('hidden')
          // unset sketch
          this.sketch = null
          // unset tooltip so that a new one can be created
          this.measureTooltipElement = null
          this.createMeasureTooltip(map)
          unByKey(this.listener)
          map.removeInteraction(this.draw)
        })
      })
    },
    /**
     * Creates a new help tooltip
     */
    createHelpTooltip(map) {
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement)
      }
      this.helpTooltipElement = document.createElement('div')
      this.helpTooltipElement.className = 'ol-tooltip hidden'
      this.helpTooltip = new Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
      })
      map.addOverlay(this.helpTooltip)
    },
    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip(map) {
      if (this.measureTooltipElement) {
        this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement)
      }
      this.measureTooltipElement = document.createElement('div')
      this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
      this.measureTooltip = new Overlay({
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
      })
      map.addOverlay(this.measureTooltip)
    }
  }
}
</script>

<style lang="scss">
  .hidden{
    display: none;
  }
  .ol-tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
    font-size: 12px;
  }
  .ol-tooltip-measure {
    opacity: 1;
    font-weight: bold;
  }
  .ol-tooltip-static {
    background-color: #E74033;
    color: black;
    border: 1px solid white;
  }
  .ol-tooltip-measure:before,
  .ol-tooltip-static:before {
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: "";
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
  }
  .ol-tooltip-static:before {
    border-top-color: #E74033;
  }
</style>
