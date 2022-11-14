<template>
  <div id="CesiumContainer" class="cesium-container" />
</template>

<script>
export default {
  props: {

  },
  data() {
    return {

    }
  },
  mounted() {
    const baseLayerUrls = '/gis-api/iserver/services/map-mongodb-GoogleMap/wmts-china'
    const baseLayerUrl = '/gis-api/iserver/services/map-mongodb-Map/wmts-china'

    var _matrixIds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
    ]

	    const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
		    url: baseLayerUrls, //
		    layer: 'GoogleMap', // 对应属性ows:Title
		    style: 'default',
		    format: 'image/png',
		    tileMatrixSetID: 'ChinaPublicServices_GoogleMap', // 对应属性TileMatrixSet 选择对应的比例尺集
      maximumLevel: 19,
      tileMatrixLabels: _matrixIds,
      tilingScheme: new Cesium.GeographicTilingScheme({
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1
      })
    })

    var _matrixIds = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
    ]
    const imageryProviders = new Cesium.WebMapTileServiceImageryProvider({
      url: baseLayerUrl, //
      layer: 'Map', // 对应属性ows:Title
      style: 'default',
      format: 'image/png',
      tileMatrixSetID: 'ChinaPublicServices_Map', // 对应属性TileMatrixSet 选择对应的比例尺集
      maximumLevel: 16, // 该地图最大层级16
      tileMatrixLabels: _matrixIds,
      tilingScheme: new Cesium.GeographicTilingScheme({
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1
      })
    })
    var czml = [
      {
        id: 'init1',
        name: 'CZML Geometries: Polyline',
        version: '1.0'
      }
    ]
    const lon = 124
    const lat = 37
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(lon - 5, lat - 2, lon + 5, lat + 2)// Rectangle(west,south,east,north)
    this.viewer1 = new Cesium.Viewer('CesiumContainer', {
      animation: true, // 是否显示动画控件
      shouldAnimate: false, // 是否初始时刻运动
      homeButton: true, // 是否显示Home按钮
      fullscreenButton: false, // 是否显示全屏按钮
      baseLayerPicker: false, // 是否显示图层选择控件 去掉自带的图层选择器
      geocoder: false, // 是否显示地名查找控件,设置为true，则无法查询
      timeline: true, // 是否显示时间线控件
      sceneModePicker: false, // 是否显示投影方式控件 三维/二维
      navigationHelpButton: false, // 是否显示帮助信息控件
      infoBox: false, // 是否显示点击要素之后显示的信息 信息框小部件
      requestRenderMode: false, // true启用请求渲染模式:更新实体需拖动地图 视图才更新[true 加载完entity后requestRender一下]
      scene3DOnly: false, // 每个几何实例将只能以3D渲染以节省GPU内存 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
      fullscreenElement: document.body, // 全屏时渲染的HTML元素
      selectionIndicator: false, // 是否显示选取指示器组件
      // terrainProvider: Cesium.createWorldTerrain(), // 注释时相当于使用默认地形，解开注释相当于使用全球地形[世界地形数据]
      imageryProvider: imageryProvider
    })
    this.viewer1.imageryLayers.addImageryProvider(imageryProviders)
    window.viewer = this.viewer1
    viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权信息
    this.initMap()
  },
  destroyed() { // 钩子函数
    window.viewer = null
  },
  methods: {
    addPoint(id, pointJD, pointWD, labelGraphis, icon) {
      window.viewer.entities.add({
        id: id,
        name: '点几何对象',
        position: window.Cesium.Cartesian3.fromDegrees(pointJD, pointWD),
        billboard: {
          image: icon
        }
      })
    },
    removePoint(id) {
      var getById = window.viewer.entities.getById(id)
      window.viewer.entities.remove(getById)
    },
    initMap() {
      var scene = window.viewer.scene
      var handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
      handler.setInputAction(function(movement) {
        var pick = window.viewer.scene.pick(movement.position)
        console.log(pick.id._id, window.viewer.entities._entities._array)
        window.viewer.entities._entities._array.forEach(i => {
          if (Cesium.defined(pick) && (pick.id._id === i._id)) {
            console.log('单击', pick.id._id, i._id)
          }
        })
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      handler.setInputAction(function(movement) {
        var labelEntity = window.viewer.entities.add({
          label: {
            text: '',
            show: false,
            showBackground: true,
            font: '14px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0)
          }
        })
        var foundPosition = false
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
          var pickedObj = scene.pick(movement.endPosition)
          // console.log(pickedObj.id)
          window.viewer.entities._entities._array.forEach(i => {
            if (Cesium.defined(pickedObj) && (pickedObj.id._id === i._id)) {
              // console.log('移动',pickedObj.id._id,i._id,i)
              var cartesian = window.viewer.scene.pickPosition(movement.endPosition)
              if (Cesium.defined(cartesian)) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
                labelEntity.label.show = true

                labelEntity.label.text = '11' + pickedObj.id._name
                labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -cartographic.height * (window.viewer.scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0))

                foundPosition = true
                console.log(labelEntity.label.eyeOffset)
              }
            }
          })
        }
        if (!foundPosition) {
          labelEntity.label.show = false
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

  }
}
</script>

<style lang="scss" scoped>

.cesium-container{
    width: 100%;
    height: 100%;
}

</style>
