<template>
  <div class="combat-container">
    <!-- 主体部分 -->
    <div class="mainContent">
      <!-- 左边 -->
      <div class="left">
        <!-- 左边的上边 -->
        <div class="top">
          <!-- 左边多选框 :is-add-popup="true"-->
          <MapOl
            ref="MapOl"
            @featureMarkerLayer="featureMarkerLayer"
          />
          <div class="selectBox">
            <!-- 部队-->

            <el-cascader
              v-model="selectData"
              :options="options"
              :props="Props"
              clearable
              collapse-tags
              @change="cascaderChange"
            />
          </div>
          <div class="leftSide">
            <div class="leftSideTop">
              <img
                style="width: 25px; height: 25px; vertical-align: middle"
                :src="require(`@/icons/newImages/analysis/定位.png`)"
                alt
              >
              战备工程位置
            </div>
            <div class="leftSideBtm">
              <el-checkbox
                v-for="item in allList"
                :key="item.GCFLNM"
                class="checkbox"
                :checked="true"
                :label="item.GCFLNM"
                @change="changeClick(item)"
              >
                {{ item.MC }}
              </el-checkbox>
            </div>
          </div>
          <!-- <div v-if="disabld" ref="myp" class="rightSide" :style="sidebar==true?'width:240px':'width:0px'">
            <div class="rows" @click="changeW">
              <img
                :src="sidebar==true?require(`@/icons/newImages/analysis/right.png`):require(`@/icons/newImages/analysis/left.png`)"
                alt
              >
            </div>
            <div class="image-section">
              <img v-if="content.mtdx" :src="content.mtdx" alt="未加载图片">
              <i v-else class="el-icon-picture-outline" />
            </div>
            <div class="rightSideBtm">
              <h4
                style="border-bottom: 1px solid #e6e6e6;height:30px;line-height: 30px;"
              >{{ content.zbgcmc }}</h4>
              <div class="right-side-item">
                代号：
                <span style="color:#000;">{{ content.zbgcdh }}</span>
              </div>
              <div class="right-side-item">
                位置：
                <span style="color:#000;">{{ content.wz }}</span>
              </div>
              <div class="right-side-item">
                竣工时间：
                <span style="color:#000;">{{ content.jgsj }}</span>
              </div>
              <div class="right-side-item">
                防卫部队：
                <span style="color:#000;">{{ content.fwbdmc }}</span>
              </div>
              <div class="right-side-item">
                防卫部队人数：
                <span style="color:#000;">{{ content.fwbdrys }}</span>
              </div>
            </div>
          </div> -->
        </div>
        <!-- 左边的下边 -->
        <div class="bottom">
          <div class="btmLeft">
            <div class="bottom-header">
              <img
                style="width: 25px; height: 25px; vertical-align: middle"
                :src="require(`@/icons/newImages/analysis/常规统计.png`)"
                alt
              >
              战备工程统计
            </div>
            <div id="myChartNumber1" class="chart-section" />
          </div>
          <div class="btmRight">
            <div class="bottom-header">
              <img
                style="width: 25px; height: 25px; vertical-align: middle"
                :src="require(`@/icons/newImages/analysis/饼状图.png`)"
                alt
              >
              各保护区战备工程情况
            </div>
            <div class="bzt">
              <div id="myPieChart1" :style="{ width: '50%', height: '50%' }" />
              <div id="myPieChart2" :style="{ width: '50%', height: '50%' }" />
              <div id="myPieChart3" :style="{ width: '50%', height: '50%' }" />
              <div id="myPieChart4" :style="{ width: '50%', height: '50%' }" />
            </div>
          </div>
        </div>
      </div>
      <!-- 右边 -->
      <div class="right">
        <div class="rightTop">
          <img
            style="
              width: 25px;
              height: 25px;
              vertical-align: middle;
              margin-left: 13px;
            "
            :src="require(`@/icons/newImages/analysis/file.png`)"
            alt
          >
          战备工程信息
        </div>
        <div class="rightBtm">
          <div class="rightBtm1">
            <div v-for="(item, index) in zbMessage" :key="index" class="text">
              <div class="kuang">
                <div
                  v-for="(i, indexs) in item.dataList"
                  :key="indexs"
                  class="content"
                >
                  <img
                    class="img1"
                    :src="'data:image/jpeg;base64,' + i.mtdx"
                    alt="暂无照片"
                  >
                  <div style="width:70%;">
                    <p style="height: 32px">
                      <img
                        style="
                          width: 25px;
                          height: 25px;
                          vertical-align: middle;
                        "
                        :src="require(`@/icons/newImages/analysis/111_03.png`)"
                        alt
                      >
                      {{ i.fwbdmc }}
                    </p>
                    <p style="height: 32px;overflow:hidden;white-space: nowrap;text-overflow:ellipsis;" :title="i.zbgcmc">
                      <img
                        style="
                          width: 25px;
                          height: 25px;
                          vertical-align: middle;
                        "
                        :src="require(`@/icons/newImages/analysis/111_06.png`)"
                        alt
                      >
                      {{ i.zbgcmc }}
                    </p>
                  </div>
                  <button
                    class="xq"
                    @click="
                      goDetails(
                        item,
                        index,
                        indexs,
                        'data:image/jpeg;base64,' + i.mtdx
                      )
                    "
                  >
                    详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     <!-- 详情 -->
    <el-dialog
      title="详情信息"
      custom-class="qiefen-dialog-class"
      :visible.sync="dialogVisibleDetils"
      width="60%"
      :before-close="closeDialogVisibleDetils"
      >

      <!-- 战备工程基本信息 -->
      <div class="box-show">
        <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;"></span>
        <span
          class="top"
          style="display:inline-block;font-weight: bold; font-size: 14px;"
        >
          基本信息
        </span>
        <div  class="bottom" style="display:flex;justify-content: space-between;flex-wrap:wrap;">
          <p style="width:24%;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">名称：{{allDataList.ZBGCMC?allDataList.ZBGCMC:"暂无"}}</p>
          <p style="width:24%;">代号：{{allDataList.JBDZ?allDataList.JBDZ:"暂无"}}</p>
          <p style="width:24%;">工程分类：{{allDataList.GCFLNM?allDataList.GCFLNM:"暂无"}}</p>
          <p style="width:24%;">竣工时间：{{allDataList.JGSJ?allDataList.JGSJ:"暂无"}}</p>
          <p style="width:24%;">保护区：{{allDataList.BHQNM?allDataList.BHQNM:"暂无"}}</p>
          <p style="width:24%;">经度：{{allDataList.JD?allDataList.JD:"暂无"}}</p>
          <p style="width:24%;">纬度：{{allDataList.WD?allDataList.WD:"暂无"}}</p>
          <p style="width:24%;">高程：{{allDataList.GC?allDataList.GC:"暂无"}}</p>
          <p style="width:24%;">位置：{{allDataList.DMNM}}{{allDataList.KZDM}}</p>
        </div>
        <el-divider />
        <!-- 扩展信息 -->
        <div v-if="kzxxData.length > 0">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;"></span>
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
            {{allDataList.GCFLNM}}信息
          </span>
          <div class="bottom" v-if="kzxxData && kzxxData.length > 0">
            <p v-for="(item,index) in kzxxData" :key="index" style="width:28%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{item.key}}:<span :title="item.value">{{item.value}}</span></p>
          </div>
          <el-divider />
        </div>
        <!-- 所在防护责任区 -->
        <div>
        <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;"></span>
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            所在防护责任区
          </span>
          <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ allDataList.SZFHZRQ ? allDataList.SZFHZRQ : "暂无" }}</div>
        </div>
        <el-divider />
        <!-- 质量描述 -->
        <div>
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;"></span>
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            质量描述
          </span>
          <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ allDataList.ZLMS ? allDataList.ZLMS : "暂无" }}</div>
        </div>
        <el-divider />
        
        <!-- 跑道方向（度分秒） -->
        <div>
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;"></span>
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            跑道方向（度分秒）
          </span>
           <div class="bottom" style="padding-bottom:15px;padding-top:10px;" v-if="msxxData.PDFX && msxxData.PDFX.length > 0">{{ msxxData.PDFX[0].value }}</div>
           <p v-else>暂无</p>
        </div>
        <el-divider />
        <!-- 油库容量 -->
        <div>
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;"></span>
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
           油库容量
          </span>
           <div class="bottom" style="padding-bottom:15px;padding-top:10px;" v-if="msxxData.YKRL && msxxData.YKRL.length > 0">{{ msxxData.YKRL[0].value }}</div>
           <p v-else>暂无</p>
        </div>
        <el-divider />
        <!-- 配套情况 -->
        <div>
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;"></span>
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
           配套情况
          </span>
           <div class="bottom" style="padding-bottom:15px;padding-top:10px;" v-if="msxxData.PTQK && msxxData.PTQK.length > 0">
            {{msxxData.YKRL[0].value}}
           </div>
           <p v-else>暂无</p>
        </div>
        <el-divider />
        <!-- 简述 -->
        <div>
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;"></span>
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            简述
          </span>
           <div class="bottom" style="padding-bottom:15px;padding-top:10px;" v-if="msxxData.JS && msxxData.JS.length > 0">{{ msxxData.JS[0].value }}</div>
          <p v-else>暂无</p>
        </div>
        <el-divider />
        <!-- 媒体信息 -->
        <div>
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;"></span>
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
           媒体信息
          </span>
           
           <el-carousel height="250px" style="width:60%;margin:auto" v-if="msxxData.MTXX && msxxData.MTXX.length > 0">
              <el-carousel-item v-for="(item,index) in msxxData.MTXX" :key="index">
                <img :src="item.mtdx" style="width:100%;height:100%" :title="item.fileName"/>
              </el-carousel-item>
           </el-carousel>
           <p v-else>暂无</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialogVisibleDetils">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import red from '@/icons/img/mapSearch/red.png'
import * as API from '@/api/index'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapOl from '@/components/MapOl'
// import { parseTime } from '@/utils/index'

export default {
  components: { MapOl },
  props: {
    forceCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Props: {
        value: 'field',
        id: 'id',
        label: 'label',
        children: 'childList', // 这里最好要后台返回树形数据
        checkStrictly: true,
        multiple: true
      },
      // disabld: true, // 箭头显示隐藏
      options: [],
      kzxxData:[],
      msxxData:[],
      map: '',
      // 多选框内容
      checkedList: [],
      // 顶部 地区 下拉选项数据
      selectData: [],
      value: '',
      // 位置信息
      location: [
        {
          commit: '代号：',
          content: '指挥防护工程'
        },
        {
          commit: '位置：',
          content: '陕西省西安市长安区神州5路3号'
        },
        {
          commit: '竣工时间：',
          content: '2011年10月3日'
        },
        {
          commit: '防卫部队：',
          content: '323部队'
        },
        {
          commit: '防卫部队人数：',
          content: '120'
        }
      ],
      dialogVisibleDetils: false,
      list: [],
      content: {},
      locationPhoto: '', // 战备工程位置头像
      zbMessage: [], // 战备工程信息列表
      forceCodes: '',
      force: [],
      dialogVisible: false,
      gcflnm: '', // 工程分类内码
      zbgcnm: '', // 战备工程内码
      flmc: '', // 防类名称   用来区分机场、通信、仓库表
      dataList: [], // 截取后的数组
      special: [],
      arrData: [],
      allDataList: {}, // 数据列表
      kzxxData:[],
      msxxData:[],
      // 战备工程位置列表
      allList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    this.getTree()
  },
  methods: {
    featureMarkerLayer(val) {
      console.log(val)
      this.getDetail('data:image/jpeg;base64,' + val.mtdx, val)
    },
    getTree() {
      API.getTreeList().then((res) => {
        if (res.code === 200) {
          this.options = this.setData(res.data)
        }
      })
    },
    setData(data) {
      let arr = []
      arr = data
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].childList.length > 0) {
          this.setData(arr[i].childList)
        } else {
          arr[i].childList = null
        }
      }
      return arr
    },
    cascaderChange(field) {
      var myChart1 = this.$echarts.init(document.getElementById('myChartNumber1'))
      var myChart2 = this.$echarts.init(document.getElementById('myPieChart1'))
      var myChart3 = this.$echarts.init(document.getElementById('myPieChart2'))
      var myChart4 = this.$echarts.init(document.getElementById('myPieChart3'))
      var myChart5 = this.$echarts.init(document.getElementById('myPieChart4'))
      if(field.length > 0) {
        const newArr = []
        field.forEach((i) => {
          this.force = i[i.length - 1]
          newArr.push(this.force)
        })
        this.forceCodes = newArr.toString()
        myChart1._dom.style="display:block"
        myChart2._dom.style="display:block"
        myChart3._dom.style="display:block"
        myChart4._dom.style="display:block"
        myChart5._dom.style="display:block"
        this.getType(this.forceCodes)
        this.getList(this.forceCodes)
        this.drawBars(this.forceCodes)
        this.pieChart1(this.forceCodes)
        this.pieChart2(this.forceCodes)
        this.pieChart3(this.forceCodes)
        this.pieChart4(this.forceCodes)
      }else {
        this.$refs.MapOl.onHandleClear1()
        this.allList = []
        this.zbMessage = []
       
        myChart1._dom.style="display:none"
        myChart2._dom.style="display:none"
        myChart3._dom.style="display:none"
        myChart4._dom.style="display:none"
        myChart5._dom.style="display:none"
      }
      
    },
    // 多选点击事件
    changeClick(data) {
      if (event.target.checked === true) {
        data.mapData.forEach((mapItem) => {
          this.$refs.MapOl.addMarkerPoint(
            red,
            [mapItem.jd, mapItem.wd],
            mapItem.zbgcdh,
            mapItem
          )
        })
      } else {
        data.mapData.forEach((mapItem) => {
          this.$refs.MapOl.removeMarkerPoint(mapItem.zbgcdh)
        })
      }
    },

    // 清除点
    clearMapData(layerName, pointList) {
      this.map.getLayer(layerName + 'point') &&
        this.map.removeLayer(layerName + 'point')
      this.map.getSource(layerName + 'point') &&
        this.map.removeSource(layerName + 'point')
    },

    // 战备工程-工程列表
    getList(forceCodes) {
      const prams = {
        forceCodes: this.forceCodes
      }
      API.getList(prams).then((res) => {
        if (res.code === 200) {
          this.zbMessage = res.data
          console.log(this.zbMessage)
        }
      })
    },

    // 战备工程-位置查询
    getPosition(gcflnm) {
      return new Promise((resolve) => {
        const params = {
          gcflnm: gcflnm.toString(),
          forceCodes: this.forceCodes
        }
        API.getPosition(params).then((res) => {
          const { code, data } = res
          if (code === 200) {
            resolve(data)
          }
        })
      })
    },

    // 获取战备工程类型
    getType(forceCode) {
      const prams = {
        forceCodes: this.forceCodes
      }
      API.getType(prams).then((res) => {
        if (res.code === 200) {
          this.allList = res.data
          if (this.allList && this.allList.length > 0) {
            this.allList.forEach((item) => {
              this.getPosition(item.GCFLNM, this.forceCodes).then((mapData) => {
                // 扩展数据
                item.mapData = mapData
                // 地图撒点
                mapData.forEach((mapItem, index) => {
                  this.$refs.MapOl.addMarkerPoint(
                    red,
                    [mapItem.jd, mapItem.wd],
                    mapItem.zbgcdh,
                    mapItem
                  )
                })
              })
            })
          }
        }
      })
    },

    // 点击三角形箭头动态显示信息
    // changeW() {
    //   this.sidebar = !this.sidebar
    // },

    // 柱状图
    drawBars(forceCode) {
      var myChart1 = this.$echarts.init(
        document.getElementById('myChartNumber1')
      )
      const prams = {
        forceCodes: this.forceCodes
      }
      API.getStatistic(prams).then((res) => {
        if (res.code === 200) {
          let Num = ''
          let Mc = ''
          Mc = res.data.map((item) => {
            return item.MC
          })
          Num = res.data.map((item) => {
            return item.NUM
          })
          myChart1.setOption({
            color: '#5272ea',
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              top: '10%',
              left: '3%',
              right: '5%',
              bottom: '0%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              data: Num,
              minInterval: 1
            },
            yAxis: {
              type: 'category',
              data: Mc
            },
            series: [
              {
                type: 'bar',
                data: Num
              }
            ]
          })
        }
      })
    },
    // 饼状图
    pieChart1(forceCode) {
      var myChart2 = this.$echarts.init(document.getElementById('myPieChart1'))
      const prams = {
        forceCodes: this.forceCodes
      }
      API.getProtect(prams).then((res) => {
        if (res.code === 200) {
          const obj = []
          for (const key in res.data.军事禁区) {
            obj.push({
              value: res.data.军事禁区[key].NUM,
              name: res.data.军事禁区[key].MC
            })
          }
          myChart2.setOption({
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '1%',
              itemWidth: 10,
              itemHeight: 10,
              icon: 'square',
              textStyle: {
                fontSize: 11
              }
            },
            color: ['#5470c6', '#73c0de', '#ee6666', '#fac858', '#91cc75'],
            graphic: {
              type: 'text',
              left: 'center',
              top: '58%',
              style: {
                text: '军事禁区',
                textAlign: 'center',
                fill: '#333',
                fontSize: 12
              }
            },
            series: [
              {
                type: 'pie',
                radius: ['40%', '65%'],
                itemStyle: {
                  normal: {
                    label: {
                      show: false // 隐藏标示文字
                    },
                    labelLine: {
                      show: false // 隐藏标示线
                    }
                  }
                },
                center: ['50%', '60%'],
                labelLine: {
                  show: false
                },
                data: obj
              }
            ]
          })
        }
      })
    },
    pieChart2(forceCode) {
      var myChart3 = this.$echarts.init(document.getElementById('myPieChart2'))
      const prams = {
        forceCodes: this.forceCodes
      }
      API.getProtect(prams).then((res) => {
        if (res.code === 200) {
          const obj = []
          for (const key in res.data.军事管理区) {
            obj.push({
              value: res.data.军事管理区[key].NUM,
              name: res.data.军事管理区[key].MC
            })
          }
          myChart3.setOption({
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '1%',
              itemWidth: 10,
              itemHeight: 10,
              // bottom: 5,
              icon: 'square',
              textStyle: {
                fontSize: 11
              }
            },
            color: ['#c65474', '#de73c3', '#6aee66', '#58fac2', '#7594cc'],
            graphic: {
              type: 'text',
              left: 'center',
              top: '58%',
              style: {
                text: '军事管理区',
                textAlign: 'center',
                fill: '#333',
                fontSize: 12
                // fontWeight: 700
              }
            },
            series: [
              {
                type: 'pie',
                radius: ['40%', '65%'],
                itemStyle: {
                  normal: {
                    label: {
                      show: false // 隐藏标示文字
                    },
                    labelLine: {
                      show: false // 隐藏标示线
                    }
                  }
                },
                center: ['50%', '60%'],
                labelLine: {
                  show: false
                },
                data: obj
              }
            ]
          })
        }
      })
    },
    pieChart3(forceCode) {
      var myChart4 = this.$echarts.init(document.getElementById('myPieChart3'))
      const prams = {
        forceCodes: this.forceCodes
      }
      API.getProtect(prams).then((res) => {
        if (res.code === 200) {
          const obj = []
          for (const key in res.data.安全控制范围) {
            obj.push({
              value: res.data.安全控制范围[key].NUM,
              name: res.data.安全控制范围[key].MC
            })
          }
          myChart4.setOption({
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '1%',
              itemWidth: 10,
              itemHeight: 10,
              // bottom: 5,
              icon: 'square',
              textStyle: {
                fontSize: 11
              }
            },
            color: ['#87c654', '#d5de73', '#6681ee', '#cc75a2', '#ee6666'],
            graphic: {
              type: 'text',
              left: 'center',
              top: '58%',
              style: {
                text: '安全控制范围',
                textAlign: 'center',
                fill: '#333',
                fontSize: 11
                // fontWeight: 700
              }
            },
            series: [
              {
                type: 'pie',
                radius: ['40%', '65%'],
                itemStyle: {
                  normal: {
                    label: {
                      show: false // 隐藏标示文字
                    },
                    labelLine: {
                      show: false // 隐藏标示线
                    }
                  }
                },
                center: ['50%', '60%'],
                labelLine: {
                  show: false
                },
                data: obj
              }
            ]
          })
        }
      })
    },
    pieChart4(forceCode) {
      var myChart5 = this.$echarts.init(document.getElementById('myPieChart4'))
      const prams = {
        forceCodes: this.forceCodes
      }
      API.getProtect(prams).then((res) => {
        if (res.code === 200) {
          const obj = []
          for (const key in res.data.未划区管理) {
            obj.push({
              value: res.data.未划区管理[key].NUM,
              name: res.data.未划区管理[key].MC
            })
          }
          myChart5.setOption({
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '1%',
              itemWidth: 10,
              itemHeight: 10,
              // bottom: 5,
              icon: 'square',
              textStyle: {
                fontSize: 11
              }
            },
            color: ['#8054c6', '#737cde', '#eebc66', '#75cc90', '#c65474'],
            graphic: {
              type: 'text',
              left: 'center',
              top: '58%',
              style: {
                text: '未划区管理',
                textAlign: 'center',
                fill: '#333',
                fontSize: 12
                // fontWeight: 700
              }
            },
            series: [
              {
                type: 'pie',
                radius: ['40%', '65%'],
                itemStyle: {
                  normal: {
                    label: {
                      show: false // 隐藏标示文字
                    },
                    labelLine: {
                      show: false // 隐藏标示线
                    }
                  }
                },
                center: ['50%', '60%'],
                labelLine: {
                  show: false
                },
                data: obj
              }
            ]
          })
        }
      })
    },
    // 详情按钮
    goDetails(item, index, indexs, img) {
      this.allDataList = {}
      this.gcflnm = item.dataList[indexs].gcflnm
      this.zbgcnm = item.dataList[indexs].zbgcnm

      this.getDetail(img)
    },
    closeDialogVisibleDetils(){
      this.dialogVisibleDetils = false
      this.allDataList = {}
      this.kzxxData = []
      this.msxxData =[]
    },
    // 战备工程详情模态框
    getDetail(img,val) {
      
      console.log(val)
      setTimeout(()=>{
        this.dialogVisibleDetils = true
      },200)
      let params = {}
      if (val) {
        params = {
          gcflnm: val.zbgcflnm,
          zbgcnm: val.zbgcnm
        }
      } else {
        params = {
          gcflnm: this.gcflnm,
          zbgcnm: this.zbgcnm
        }
      }
      API.getDetail(params).then((res) => {
        if (res.code === 200) {
          let list = []
          
          if(res.data.JCXX && Object.keys(res.data.JCXX).length>0){
            this.allDataList = res.data.JCXX
          }
          if(res.data.KZXX && res.data.KZXX.length>0){
            this.kzxxData = res.data.KZXX
          }
          if(res.data.MSXX && res.data.MSXX.length>0){

            this.msxxData.YKRL = res.data.MSXX.filter(item=> item.key==='油库容量')
            console.log(this.msxxData.YKRL)
            this.msxxData.PDFX = res.data.MSXX.filter(item=> item.key==='跑道方向（度分秒）')
            this.msxxData.PTQK = res.data.MSXX.filter(item=> item.key==='配套情况')
            this.msxxData.JS = res.data.MSXX.filter(item=> item.key==='简述')
          }
          
          if(res.data.MTDX && res.data.MTDX.length>0 ){
            res.data.MTDX.forEach(i=>{
              i.mtdx = `data:image/jpeg;base64,`+ i.mtdx
            })
            this.msxxData.MTXX = res.data.MTDX
          }
          
        }
      })
    },
    // 点击标注时获取详细信息
    // getProperties(data) {
    //   console.log(data)

    //   // this.sidebar = true
    //   // data.jgsj = parseTime(new Date(data.jgsj))
    //   // data.mtdx = 'data:image/jpeg;base64,' + data.mtdx
    //   // console.log(this.content)

    //   // this.content = data
    // }
  }
}
</script>
<style lang="scss" scoped>
>>> .ol-popups{
  display:none
}
>>> .el-button--primary {
  background-color: #1f7cd7;
}
>>> .el-dialog__body{
  height:695px;
  overflow:auto;
  overflow-x:hidden
}
.box-show {
  padding: 0px 20px;
  background: #fff;
}
.combat-container {
  width: 100%;
  height: 100%;
}
.mainContent {
  display: flex;
  height: 100%;
  margin-top: 12px;
  .left {
    width: calc(100% - 415px);
    height: 100%;
    margin-right: 15px;
    overflow: hidden;
    .top {
      width: 100%;
      height: 50%;
      border-radius: 5px;
      position: relative;
      overflow: hidden;
      .selectBox {
        width: 215px;
        height: 40px;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 1;
        border-radius: 0 0 5px 5px;
        >>> .el-cascader {
          position: absolute;
          top: 15px;
          left: 0px;
          margin-top: -15px;
        }
        >>> .el-input__inner {
          height: 32px !important;
        }
      }
      .leftSide {
        width: 215px;
        height: calc(100% - 48px);
        position: absolute;
        top: 38px;
        z-index: 1;
        border-radius: 5px;
        background: rgba($color: #fff, $alpha: 0.6);
        .leftSideTop {
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-bottom: 1px solid #e6e6e6;
          background: #ffffff;
          border-radius: 3px;
        }
        .leftSideBtm {
          height: calc(100% - 32px);
          padding: 3px 10px 3px 10px;
          overflow-y: auto;
          font-size: 12px;
          .checkbox {
            height: 36px;
            padding-top: 8px;
            width: 100%;
            border-bottom: 1px solid #e6e6e6;
            margin-right: 0px !important;
          }
        }
      }
      .rightSide {
        width: 240px;
        position: absolute;
        right: 0px;
        top: 0px;
        border-radius: 5px;
        background-color: #fff;
        .rows {
          width: 24px;
          height: 48px;
          position: absolute;
          left: -24px;
          top: 10px;
          background-color: #fff;
          cursor: pointer;
          img {
            margin-top: 15px;
            margin-left: 5px;
          }
        }
        .image-section {
          width: 240px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          img {
            width: 100%;
            height: 100%;
          }
          i {
            font-size: 36px;
          }
        }
        .rightSideBtm {
          padding: 0 17px;
          overflow: scroll;
          overflow-x: hidden;
          height: 193px;
          .right-side-item {
            color: #0c6bc8;
            margin-top: 5px;
            line-height: 30px;
            font-size: 12px;
            border-bottom: 1px solid #e6e6e6;
          }
        }
      }
    }
    .bottom {
      height: calc(50% - 12px);
      display: flex;
      margin-top: 12px;
      .bottom-header {
        height: 40px;
        padding: 8px;
        border-bottom: 1px solid #e6e6e6;
      }
      .btmLeft {
        height: 100%;
        width: 50%;
        background-color: #fff;
        border-radius: 5px;
        .chart-section {
          width: 100%;
          height: calc(100% - 40px);
        }
      }
      .btmRight {
        width: 50%;
        height: 100%;
        margin-left: 15px;
        background-color: #fff;
        border-radius: 5px;
        .bzt {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          height: calc(100% - 40px);
          div {
            border-right: 1px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
          }
          div:nth-child(3),
          div:nth-child(4) {
            border-bottom: 0;
          }
        }
      }
    }
  }
  .right {
    height: 100%;
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    .rightTop {
      height: 40px;
      font-size: 14px;
      line-height: 40px;
      border-bottom: 1px solid #e6e6e6;
    }
    .rightBtm {
      padding: 0 13px;
      overflow: scroll;
      overflow-x: hidden;
      height: calc(100% - 50px);
      .rightBtm1 {
        margin-top: 14px;
        .text {
          line-height: 36px;
          font-size: 12px;
          font-weight: bold;
        }
        .kuang {
          box-shadow: #dddddd9e 0px 0px 22px;
          border-radius: 5px;
          .content {
            height: 100px;
            margin: 0 19px;
            border-bottom: 1px solid #e6e6e6;
            display: flex;
            align-items: center;
            position: relative;
            .img1 {
              width: 80px;
              height: 80px;
              margin-right: 30px;
            }
            .xq {
              width: 72px;
              height: 24px;
              text-align: center;
              line-height: 24px;
              background-color: #eaf1fb;
              color: #0c6bc8;
              border-radius: 5px;
              position: absolute;
              right: 18px;
              top: 20px;
              border: 0;
            }
          }
          .content:nth-last-child(1) {
            border-bottom: 0;
          }
        }
      }
    }
  }
}
.qiefen-dialog-class {
  >>> .el-dialog {
    height: 80%;
    // overflow-y: scroll;
  }
  >>> .el-dialog__body {
    overflow-y: scroll !important;
    height: calc(100% - 90px) !important;
    padding: 20px !important;
  }
  >>> .el-divider--horizontal {
    margin: 0 !important;
    margin-bottom: 20px !important;
  }
  .bottom {
    p:nth-child(n) {
      width: 250px;
      line-height: 44px;
      display: inline-block;
    }
  }
  .el-divider {
    margin-bottom: 24px;
    margin-top: 24px;
  }
  .bottom1 {
    p:nth-child(n) {
      width: 300px;
      line-height: 44px;
    }
  }
  >>> .el-dialog__footer {
    height: 63px;
  }
}
.box-show {
  padding: 0px 20px;

  background: #fff;
}
>>> .el-dialog,
.el-pager li {
  background: #fff;
}
</style>
