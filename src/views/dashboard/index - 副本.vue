<template>
  <Container>
    <Containertwo own-class="Dashboard">
      <div class="left-box">
        <div class="search">
          <div class="search-box">
            <el-input
              v-model="search"
              placeholder="请输入搜索内容..."
              size="small"
              prefix-icon="el-icon-search"
              @keyup.enter.native="addGeoMarker"
            />
          </div>
          <div class="search-box">
            <el-select v-model="search1" placeholder="政治工作部" class="zz" size="small" clearable>
              <el-option value="AAA" label="AAA" />
              <el-option value="BBB" label="BBB" />
            </el-select>
            <el-select v-model="search1" placeholder="军种指挥机构" class="zz" size="small" clearable>
              <el-option value="AAA" label="AAA" />
              <el-option value="BBB" label="BBB" />
            </el-select>
            <el-select v-model="search1" placeholder="驻派机构" class="zz" size="small" clearable>
              <el-option value="AAA" label="AAA" />
              <el-option value="BBB" label="BBB" />
            </el-select>
            <el-select v-model="search1" placeholder="联勤保障部" class="zz" size="small" clearable>
              <el-option value="AAA" label="AAA" />
              <el-option value="BBB" label="BBB" />
            </el-select>
          </div>
        </div>
        <div class="my-mapbox">
          <Map ref="myMap" />
        </div>
      </div>
      <div class="right-box">
        <div class="top-chart">
          <div class="title">
            基础人员信息组成
          </div>
          <div id="jcry" class="jcry" />
        </div>
        <div class="bottom-chart">
          <div class="title">
            装备情况
          </div>
          <div id="zbqk" class="zbqk" />
        </div>
      </div>
    </Containertwo>
  </Container>
</template>

<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { mapGetters } from 'vuex'
import Container from '@/components/Container'
import Containertwo from '@/components/ContainerTwo'
import Map from '@/components/Mapbox'
import Popup from './Popup'
import Vue from 'vue'
export default {
  name: 'Dashboard',
  components: { Container, Containertwo, Map },
  data() {
    return {
      search: undefined,
      search1: undefined,
      jcry: undefined,
      zbqk: undefined,
      formData: {},
      popupTemp: '',
      data: [
        { value: 1048, name: '坦克' },
        { value: 735, name: '飞机' },
        { value: 580, name: '步枪' },
        { value: 484, name: '机枪' },
        { value: 300, name: '运输机' }
      ],
      markerList: [],
      geojsonPoints: {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'properties': {
            'id': 1,
            'name': '联合参谋部',
            'code': '001',
            'posi': '沈阳市',
            'phone': '123456789'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [123.48566284667969, 41.77955305871155]
          }
        }, {
          'type': 'Feature',
          'properties': {
            'id': 2,
            'name': '联合参谋部2',
            'code': '002',
            'posi': '沈阳市XX区',
            'phone': '123456789'
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [123.393555, 41.825317]
          }
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  watch: {
    'sidebar.opened': {
      deep: true,
      handler: function(newV, oldV) {
        setTimeout(() => {
          this.jcry.resize()
          this.zbqk.resize()
        }, 200)
      }
    }
  },
  mounted() {
    this.drawLine()
    this.drawPie()
    window.addEventListener('resize', () => {
      this.jcry.resize()
      this.zbqk.resize()
    })
  },
  methods: {
    drawLine() {
      const that = this
      this.jcry = this.$echarts.init(document.getElementById('jcry'))
      this.jcry.setOption({
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: '#1A1A4E',
            fontWeight: 'bold'
          },
          data: ['将官', '校官', '尉官', '高级士官', '中级士官', '初级士官', '士兵']
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          }
        },
        series: [{
          data: [92, 202, 263, 332, 576, 703, 820],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
            shadowBlur: 10,
            shadowOffsetY: 18,
            opacity: 0.1
          },
          label: {
            show: true,
            position: 'top',
            distance: 5,
            formatter: '{c}',
            color: '#1A1A4E',
            fontWeight: 'bold'
          },
          barMaxWidth: 20,
          itemStyle: {
            normal: {
              color: new that.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#3D4CCB' // 0% 处的颜色
              }, {
                offset: 0.6,
                color: '#A245AA' // 60% 处的颜色
              }, {
                offset: 1,
                color: '#F93E8D' // 100% 处的颜色
              }], false),
              shadowColor: '#A245AA',
              shadowBlur: 10,
              shadowOffsetX: 3
            }
          }
        }]
      })
    },
    drawPie() {
      const that = this
      this.zbqk = this.$echarts.init(document.getElementById('zbqk'))
      this.zbqk.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: 15,
          // right: 0,
          // bottom: 0,
          itemGap: 20,
          icon: 'circle',
          padding: [10, 15],
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            rich: {
              a: {
                fontSize: 14,
                color: '#000',
                align: 'center'
              },
              b: {
                fontSize: 14,
                color: '#666',
                align: 'center'
              }
            }
          },
          formatter: function(name) {
            var val = that.data.find((item) => {
              return item.name === name
            })
            var arr = [
              '{a|' + name + '}',
              '{b|' + val.value + '}'
            ]
            return arr.join(' ')
          }
        },
        series: [
          {
            type: 'pie',
            bottom: 0,
            top: '23%',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b} {d}%',
              color: '#000'
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                  var colorList = [
                    {
                      c1: '#F9623E',
                      c2: '#FF8437'
                    },
                    {
                      c1: '#B9F93E',
                      c2: '#F1ED38'
                    },
                    {
                      c1: '#3EF9B0',
                      c2: '#37FF48'
                    }, {
                      c1: '#3D76FA',
                      c2: '#37BFFF'
                    }, {
                      c1: '#D63AEE',
                      c2: '#F93ED8'
                    }]
                  return new that.$echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                    offset: 0,
                    color: colorList[params.dataIndex].c1
                  }, {
                    offset: 1,
                    color: colorList[params.dataIndex].c2
                  }])
                }
              }
            },
            data: that.data
          }
        ]
      })
    },
    /* searchHandle() {
      console.log(456)
      const mapObj = this.$refs.myMap.map
      this.markerList[0] = new mapboxgl.Marker({
        element: "<img src:''></img>"
      })
        .setLngLat([123.48566284667969, 41.77955305871155])
        .addTo(mapObj)
    }, */
    addGeoMarker() {
      const map = this.$refs.myMap.map
      const that = this
      // 引入外部图片
      map.loadImage(require('@/assets/icons/flag.png'), function(error, image) {
        if (error) throw error
        // 先判断是否加载了该 id 的图片资源，没有则加载
        if (!map.hasImage('shipDirectionArrow')) {
          map.addImage('shipDirectionArrow', image)
        }
        map.addSource('geodataPoint', { type: 'geojson', data: that.geojsonPoints })
        map.addLayer({
          id: 'shipDirectionArrow',
          type: 'symbol',
          source: 'geodataPoint',
          layout: {
            // 使用图片资源
            'icon-image': 'shipDirectionArrow',
            // 缩放
            'icon-size': 1,
            // 偏移量
            'icon-offset': [0, 0],
            // 跟随地图转动，推拉（3d效果那种）Mapbox 中叫 bearing 和 pitch
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'icon-ignore-placement': true
          }
        })
        // map.addLayer({
        //   'id': 'pointlayerhighlight',
        //   'type': 'symbol',
        //   'source': 'geodataPoint',
        //   layout: {
        //     // 使用图片资源
        //     'icon-image': 'shipDirectionArrow',
        //     // 缩放
        //     'icon-size': 1,
        //     // 偏移量
        //     'icon-offset': [0, 0],
        //     'icon-opacity': 1,
        //     // 跟随地图转动，推拉（3d效果那种）Mapbox 中叫 bearing 和 pitch
        //     'icon-rotation-alignment': 'map',
        //     'icon-allow-overlap': true,
        //     'icon-ignore-placement': true
        //   },
        //   'filter': ['in', 'id', '']
        // })
      })
      map.on('click', 'shipDirectionArrow', function(e) {
        console.log(e.features[0])
        // var feature = e.features[0]
        // map.setFilter('pointlayerhighlight', ['in', 'id', feature.properties.id])
        var coordinates = e.features[0].geometry.coordinates.slice()
        that.createVideoPopUp(e.features[0].properties)
        new mapboxgl.Popup({
          closeButton: false,
          className: 'my-poprp',
          maxWidth: '350px'
        })
          .setLngLat(coordinates)
          .setDOMContent(that.popupTemp)
          .addTo(map)
      })
      map.on('mouseenter', 'shipDirectionArrow', function() {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'shipDirectionArrow', function() {
        map.getCanvas().style.cursor = ''
      })
      // 添加 icon 和 名称 标记
      // 创建 div.marker-wrap, div.marker-title, div.marker-wrap 用作定位, div.marker-title 显示标题
      // const elWrap = document.createElement('div')
      // elWrap.className = 'marker-wrap'
      // elWrap.addEventListener('click', function() {
      //   // that.shipInfoBoardDisplay = !that.shipInfoBoardDisplay
      //   console.log(map.getZoom())
      //   if (map.getZoom() < 6.5) {
      //     that.flyTo([123.48566284667969, 41.77955305871155])
      //   }
      // })
      // const elTitle = document.createElement('div')
      // elTitle.className = 'marker-title'
      // elTitle.innerHTML = '<span>' + '小红旗' + '</span>'
      // elWrap.appendChild(elTitle)
      // // 将 div.marker-wrap 加入到 map
      // const markerTagObject = new mapboxgl.Marker(elWrap).setLngLat([123.48566284667969, 41.77955305871155]).addTo(map)
    },
    createVideoPopUp(currentFeature) {
      var that = this
      that.formData = currentFeature// 传递到弹框页面的数据
      const Mytem = Vue.extend(Popup)
      const vm = new Mytem({
        propsData: {
          form: currentFeature
        } // 传参
      })
      vm.$mount()// 挂载
      this.popupTemp = vm.$el
    }
  }
}
</script>

<style lang="scss" scoped>
  .Dashboard{
    display: flex;
    justify-content: space-between;
    .left-box{
      height: 100%;
      margin-right: 20px;
      width:calc(67% - 20px);
      .search{
        height: 50px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .search-box{
          height: 100%;
          padding-bottom: 10px;
          .zz {
            margin-left: 15px;
            width: 125px;
            background-color: #fff;
            ::v-deep .el-input__inner {
              background: url('~@/assets/icons/zz.png') no-repeat;
              background-size: 16px 16px;
              background-position: 4px 8px;
              padding: 0 0 0 26px;
              box-sizing: border-box;
              font-size: 12px;
            }
          }
        }
      }
      .my-mapbox{
        height: calc(100% - 50px);
        background: #fff;
        border-radius: 7px;
      }
    }
    .right-box{
      height: 100%;
      width:33%;
      .top-chart{
        height: 50%;
        width: 100%;
        .title{
          height: 50px;
          line-height: 40px;
          padding-bottom: 10px;
          font-size: 18px;
          font-weight: bolder;
        }
        .jcry{
          width: 100%;
          height: calc(100% - 60px);
          background-color: #fff;
          border-radius: 7px;
        }
      }
      .bottom-chart{
        height: 50%;
        width: 100%;
        .title{
          height: 50px;
          line-height: 30px;
          padding: 10px 0;
          font-size: 18px;
          font-weight: bolder;
        }
        .zbqk{
          width: 100%;
          height: calc(100% - 50px);
          background-color: #fff;
          border-radius: 7px;
        }
      }
    }
  }
</style>
