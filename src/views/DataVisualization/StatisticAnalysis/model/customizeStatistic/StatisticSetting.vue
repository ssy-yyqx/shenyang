<template>
  <div class="setting-container">
    <div v-if="type !== 'view'" class="left-section">
      <div
        v-for="(item, index) in statisticTypes"
        :key="index"
        class="statistic-item"
        draggable="true"
        @dragstart="
          (event) => {
            onDrag(event, item);
          }
        "
      >
        <i :class="item.icon"> {{ item.value }}</i>
      </div>
    </div>
    <div class="right-sectin">
      <div
        class="form-section"
      >
        <label>标题：</label>
        <el-input
          v-model="name"
          :rules="[
            { required: true, message: '标题不能为空'}
          ]"
          :disabled="type === 'view'"
        />
      </div>
      <div
        id="StatisticSection"
        class="statistic-section"
        @drop="drop"
        @dragover="allowDrop"
      />
    </div>
    <el-dialog
      width="50%"
      title="配置sql"
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <ChartSqlSetting
        ref="ChartSqlSetting"
        :chart-data="currentEditChart"
        :type="type"
        @handleClick="handleClick"
      />
      <span slot="footer" class="dialog-footer" :style="activeNames === 'example' ? hid : show">
        <template v-if="type !== 'view'">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="onHandleSave">确 定</el-button>
        </template>
        <el-button v-else @click="innerVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/DataVisualization'
import ChartSqlSetting from './ChartSqlSetting.vue'
export default {
  components: { ChartSqlSetting },
  props: {
    id: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 表单类型
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      name: '',
      activeNames:'',
      hid:'display:none',
      show:'display:block',
      // 统计类型列表
      statisticTypes: [
        {
          type: 'barChart',
          value: '柱图',
          icon: 'iconfont icon-tongjitubiao'
        },
        {
          type: 'stripChart',
          value: '条形图',
          icon: 'iconfont icon-tiaoxingtu2'
        },
        {
          type: 'lineChart',
          value: '线图',
          icon: 'iconfont icon-chart-trend'
        },
        {
          type: 'pieChart',
          value: '环形图',
          icon: 'iconfont icon-pie-chart-full'
        },
        {
          type: 'roseChart',
          value: '玫瑰图',
          icon: 'iconfont icon-meiguitu1'
        },
        {
          type: 'gauge',
          value: '仪表盘',
          icon: 'iconfont icon-yibiaopan'
        },
        {
          type: 'scatter',
          value: '散点图',
          icon: 'iconfont icon-sandiantu'
        },
        {
          type: 'candlestick',
          value: '饼状图',
          icon: 'iconfont icon-Kxiantu'
        },
        {
          type: 'radar',
          value: '雷达图',
          icon: 'iconfont icon-leidatu'
        },
        {
          type: 'parallel',
          value: '平行坐标图',
          icon: 'iconfont icon-pinghangzuobiaoxi'
        },
        {
          type: 'sankey',
          value: '漏斗图',
          icon: 'iconfont icon-sangjitu'
        }
      ],
      // 当前统计信息
      currentStatistic: {
        type: '',
        value: ''
      },
      // 柱图配置
      barOption: {
        grid: {
          bottom: 30
        },
        legend: {
          left: 'center',
          data: [
            '编制数（人）',
            '现有数（人）',
            '在位数（人）',
            '可出动数（人）'
          ]
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          data: ['军（警）官', '义务兵', '士官']
        },
        yAxis: { minInterval: 1 },
        series: [
          {
            name: '编制数（人）',
            type: 'bar',
            data: [105, 98, 97, 96]
          },
          {
            name: '现有数（人）',
            type: 'bar',
            data: [105, 98, 97, 96]
          },
          {
            name: '在位数（人）',
            type: 'bar',
            data: [105, 98, 97, 96]
          },
          {
            name: '可出动数（人）',
            type: 'bar',
            data: [105, 98, 97, 96]
          }
        ]
      },
      // 条形图配置
      stripOption: {
        grid: {
          bottom: 30,
          left: 200 // 调整这个属性
        },
        legend: {
          left: 'center',
          data: [
            '编制数（人）',
            '现有数（人）',
            '在位数（人）',
            '可出动数（人）'
          ]
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['军（警）官', '义务兵', '士官']
        },
        series: [
          {
            name: '编制数（人）',
            type: 'bar',
            data: [105, 98, 97, 96]
          },
          {
            name: '现有数（人）',
            type: 'bar',
            data: [105, 98, 97, 96]
          },
          {
            name: '在位数（人）',
            type: 'bar',
            data: [105, 98, 97, 96]
          },
          {
            name: '可出动数（人）',
            type: 'bar',
            data: [105, 98, 97, 96]
          }
        ]
      },
      // 线图配置
      lineOption: {
        grid: {
          bottom: 30
        },
        legend: {
          left: 'center',
          data: [
            '编制数（人）',
            '现有数（人）',
            '在位数（人）',
            '可出动数（人）'
          ]
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: ['军（警）官', '义务兵', '士官']
        },
        yAxis: { minInterval: 1 },
        series: [
          {
            name: '编制数（人）',
            type: 'line',
            data: [105, 98, 97, 96]
          },
          {
            name: '现有数（人）',
            type: 'line',
            data: [105, 98, 97, 96]
          },
          {
            name: '在位数（人）',
            type: 'line',
            data: [105, 98, 97, 96]
          },
          {
            name: '可出动数（人）',
            type: 'line',
            data: [105, 98, 97, 96]
          }
        ]
      },
      // 环饼图配置
      pieOption: {
        // 鼠标悬浮
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 20
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '26',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                name: '舰艇长',
                value: 4
              },
              {
                name: '指挥员',
                value: 10
              }
            ]
          }
        ]
      },
      // 玫瑰图配置
      roseOption: {
        // 鼠标悬浮
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 20
        },
        series: [
          {
            type: 'pie',
            radius: [20, 50],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
              {
                name: '舰艇长',
                value: 4
              },
              {
                name: '指挥员',
                value: 10
              },
              {
                name: '其他',
                value: 30
              }
            ]
          }
        ]
      },
      // 仪表盘配置
      gaugeoption: {
        // tooltip: {
        //   formatter: "{a} <br/>{b} : {c}",
        // },
        series: [
          {
            name: '',
            type: 'gauge',
            min: 0,
            max: 100,
            detail: {
              formatter: '{value}'
            },
            data: [
              {
                value: 50,
                name: '士兵'
              }
            ]
          }
        ]
      },
      // 散点图
      scatterOption: {
        xAxis: {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: '{value} kg'
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: '{value} cm'
          }
        },
        series: [
          {
            symbolSize: 20,
            data: [
              [10.0, 8.04],
              [8.07, 6.95],
              [13.0, 7.58],
              [9.05, 8.81],
              [11.0, 8.33],
              [14.0, 7.66],
              [13.4, 6.81],
              [10.0, 6.33],
              [14.0, 8.96],
              [12.5, 6.82],
              [9.15, 7.2],
              [11.5, 7.2],
              [3.03, 4.23],
              [12.2, 7.83],
              [2.02, 4.47],
              [1.05, 3.33],
              [4.05, 4.96],
              [6.03, 7.24],
              [12.0, 6.26],
              [12.0, 8.84],
              [7.08, 5.82],
              [5.02, 5.68]
            ],
            type: 'scatter'
          }
        ]
      },
      // 饼状图
      candlestickOption: {
        series: [
          {
            type: 'pie',
            data: [
              { value: 1048, name: '舰艇长' },
              { value: 735, name: '指挥员' },
              { value: 580, name: '其他' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 雷达图
      radarOption: {
        title: {
          text: ''
        },
        legend: {
          data: ['军（警）官', '义务兵']
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '总人数', max: 6500 },
            { name: '编制数', max: 16000 },
            { name: '现有数', max: 30000 },
            { name: '可出行数', max: 38000 },
            { name: '已出行数', max: 38000 },
            { name: '在位数', max: 52000 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: '军（警）官'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: '义务兵'
              }
            ]
          }
        ]
      },
      // 平行坐标图
      parallelOption: {
        parallelAxis: [
          { dim: 0, name: '军（警）官' },
          { dim: 1, name: '义务兵' },
          {
            dim: 2,
            name: '士官',
            type: 'category',
            data: ['编制数', '现有数', '在位数']
          }
        ],
        parallel:{
          parallelAxisDefault:{
            axisLabel:{interval:0}
          }
        },

        series: {
          type: 'parallel',
          lineStyle: {
            width: 4
          },
          data: [
            [12.99, 100, '编制数'],

            [9.99, 80, '现有数'],
            [20, 120, '在位数']
          ]
        }
      },
      // 漏斗图
      sankeyOption: {
        title: {
          text: ''
        },
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{a} <br/>{b} : {c}",
        // },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: ['总人数', '军（警）官', '义务兵', '士官']
        },
        series: [
          {
            name: '',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: [
              { value: 40, name: '士官' },
              { value: 20, name: '义务兵' },
              { value: 80, name: '军（警）官' },
              { value: 100, name: '总人数' }
            ]
          }
        ]
      },
      // 图表列表
      chartList: [],
      // 是否显示sql设置窗口
      innerVisible: false,
      // 当前编辑图表
      currentEditChart: {},
      // 图表对象
      charts: {}
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          setTimeout(() => {
            if (this.id) {
              this.getChartList(this.id)
            }
          }, 200)
          
        } else {
          document.getElementById('StatisticSection').innerHTML = ''
          this.charts = {}
          this.name = ''
          this.chartList = []
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClick(val){
      this.activeNames = val
    },
    onDrag(ev, data) {
      ev.dataTransfer.setData('Type', data.type)
      this.currentStatistic = data
    },
    drop(ev) {
      ev.preventDefault()
      console.log(ev)
      if (ev.target.id !== 'StatisticSection') {
        return
      }
      const type = ev.dataTransfer.getData('Type')
      const id = type + Date.now()
      // 生成图表代码
      this.generateChartElement(id, ev.target)
      // 图表列表添加数据
      this.chartList.push({
        chartsId: id,
        chartsType: type,
        dynamicSql: '',
        title: '',
        chartsLayout: '1' // 1: 50%  2: 100%
      })
      // 初始化图表
      console.log(type)
      console.log(id)
      this[type](id)
    },
    // 生成图表代码
    generateChartElement(id, target, layout) {
      const _this = this
      // 组件容器
      const element = document.createElement('div')
      if (layout === '2') {
        element.setAttribute('class', 'statistic-section-item full-width')
      } else {
        element.setAttribute('class', 'statistic-section-item')
      }
      // 头部容器
      const headerElement = document.createElement('div')
      headerElement.setAttribute('class', 'header')
      if (this.type !== 'view') {
        // 放大按钮
        const expandElement = document.createElement('i')
        if (layout === '2') {
          expandElement.setAttribute('class', 'hide el-icon-zoom-in')
        } else {
          expandElement.setAttribute('class', 'show el-icon-zoom-in')
        }
        headerElement.appendChild(expandElement)
        expandElement.onclick = function() {
          expandElement.setAttribute('class', 'hide el-icon-zoom-in')
          smallElement.setAttribute('class', 'show el-icon-zoom-out')
          element.setAttribute('class', 'statistic-section-item full-width')
          _this.charts[id].resize()
          // 设置布局
          const chart = _this.chartList.find((item) => item.chartsId === id)
          chart.chartsLayout = '2'
        }

        // 缩小按钮
        const smallElement = document.createElement('i')
        if (layout === '2') {
          smallElement.setAttribute('class', 'show el-icon-zoom-out')
        } else {
          smallElement.setAttribute('class', 'hide el-icon-zoom-out')
        }
        headerElement.appendChild(smallElement)
        smallElement.onclick = function() {
          smallElement.setAttribute('class', 'hide el-icon-zoom-out')
          expandElement.setAttribute('class', 'show el-icon-zoom-in')
          element.setAttribute('class', 'statistic-section-item')
          _this.charts[id].resize()
          // 设置布局
          const chart = _this.chartList.find((item) => item.chartsId === id)
          chart.chartsLayout = '1'
        }
        // 编辑按钮
        const editElement = document.createElement('i')
        editElement.setAttribute('class', 'el-icon-edit')
        headerElement.appendChild(editElement)
        editElement.onclick = function() {
          _this.onHandleEdit(id)
        }
        // 关闭按钮
        const closeElement = document.createElement('i')
        closeElement.setAttribute('class', 'el-icon-close')
        headerElement.appendChild(closeElement)
        closeElement.onclick = function() {
          target.removeChild(element)
          const removeIndex = _this.chartList.findIndex(
            (item) => item.chartsId === id
          )
          _this.chartList.splice(removeIndex, 1)
        }
      } else {
        // 查看按钮
        const editElement = document.createElement('i')
        editElement.setAttribute('class', 'el-icon-view')
        headerElement.appendChild(editElement)
        editElement.onclick = function() {
          _this.onHandleEdit(id)
        }
      }

      // 图表容器
      const chartElement = document.createElement('div')
      chartElement.id = id
      chartElement.setAttribute('class', 'chart-section')
      // 添加头部元素
      element.appendChild(headerElement)
      // 添加图表元素
      element.appendChild(chartElement)
      // 添加组件
      target.appendChild(element)
    },
    allowDrop(ev) {
      ev.preventDefault()
    },
    // 初始化仪表盘
    gauge(id, data) {
      var gauge = this.$echarts.init(document.getElementById(id))
      if (data) {
        console.log(data)
        this.gaugeoption.series[0].data = []
        this.gaugeoption.series[0].data.push({
          value: data.sum,
          name: data.name
        })
        this.gaugeoption.series[0].max = data.allSum
      }
      gauge.setOption(this.gaugeoption)
      this.$set(this.charts, id, gauge)
    },
    // 散点图
    scatter(id, data) {
      var scatter = this.$echarts.init(document.getElementById(id))
      if (data) {
        this.scatterOption.series[0].data = data
      }
      scatter.setOption(this.scatterOption)
      this.$set(this.charts, id, scatter)
    },
    // 饼状图
    candlestick(id, data) {
      var candlestick = this.$echarts.init(document.getElementById(id))
      if (data) {
        this.candlestickOption.series[0].data = data
      }
      candlestick.setOption(this.candlestickOption)
      this.$set(this.charts, id, candlestick)
    },
    // 平行坐标图
    parallel(id, data) {
      var parallel = this.$echarts.init(document.getElementById(id))
      if (data) {
        console.log(data)
        this.parallelOption.parallelAxis = data.parallelAxis
        this.parallelOption.series.data = data.data
      }
      parallel.setOption(this.parallelOption)
      this.$set(this.charts, id, parallel)
    },
    // 雷达图
    radar(id, data) {
      var radar = this.$echarts.init(document.getElementById(id))
      if (data) {
        this.radarOption.legend.data = data.dataX
        this.radarOption.radar.indicator = data.indicator
        this.radarOption.series[0].data = data.data
      }
      console.log(this.radarOption)
      radar.setOption(this.radarOption)
      this.$set(this.charts, id, radar)
    },
    // 漏斗图
    sankey(id, data) {
      var sankey = this.$echarts.init(document.getElementById(id))
      if (data) {
        this.sankeyOption.series[0].data = data
        this.sankeyOption.legend.data = []
        for (let i = 0; i < data.length; i++) {
          this.sankeyOption.legend.data.push(data[i].name)
        }
      }
      sankey.setOption(this.sankeyOption)
      this.$set(this.charts, id, sankey)
    },

    // 初始化柱图
    barChart(id, data) {
      var myChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        const { legend, axis, series } = this.getChartsDataByDataset(
          'barChart',
          data
        )
        this.barOption.legend.data = legend
        this.barOption.xAxis.data = axis
        this.barOption.series = series
      }
      myChart.setOption(this.barOption)
      this.$set(this.charts, id, myChart)
    },
    // 初始化条形图
    stripChart(id, data) {
      var myChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        if (data) {
          const { legend, axis, series } = this.getChartsDataByDataset(
            'stripChart',
            data
          )
          this.stripOption.legend.data = legend
          this.stripOption.yAxis.data = axis
          this.stripOption.series = series
        }
      }
      myChart.setOption(this.stripOption)
      this.$set(this.charts, id, myChart)
    },
    // 初始化线图
    lineChart(id, data) {
      var myChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        const { legend, axis, series } = this.getChartsDataByDataset(
          'lineChart',
          data
        )
        this.lineOption.legend.data = legend
        this.lineOption.xAxis.data = axis
        this.lineOption.series = series
      }
      myChart.setOption(this.lineOption)
      this.$set(this.charts, id, myChart)
    },
    // 初始化饼图
    pieChart(id, data) {
      const pieChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        this.pieOption.series[0].data = data
      }
      pieChart.setOption(this.pieOption)
      this.$set(this.charts, id, pieChart)
    },
    // 初始化玫瑰图
    roseChart(id, data) {
      const pieChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        this.roseOption.series[0].data = data
      }
      pieChart.setOption(this.roseOption)
      this.$set(this.charts, id, pieChart)
    },
    // 修改图表
    onHandleEdit(chartsId) {
      this.currentEditChart = this.chartList.find(
        (item) => item.chartsId === chartsId
      )
      this.innerVisible = true
      this.$nextTick(()=>{
        this.activeNames = this.$refs.ChartSqlSetting.activeName
        console.log(this.activeNames)
      })
    },
    // 保存sql修改
    onHandleSave() {
      if (this.$refs.ChartSqlSetting.activeName === 'example') {
        const data = this.$refs.ChartSqlSetting.getChartData()
        this.updateChart(this.currentEditChart.chartsType, data)
        this.innerVisible = false
      } else {
        const data = this.$refs.ChartSqlSetting.getData()
        this.currentEditChart.dynamicSql = data.sql
        this.currentEditChart.title = data.title
        API.getCustomizeStatisticDataBySql({
          chartsType: this.currentEditChart.chartsType,
          sql: this.currentEditChart.dynamicSql
        }).then((res) => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            // 更新图表
            this.updateChart(this.currentEditChart.chartsType, data)
            this.innerVisible = false
          } else {
            this.$message.error(msg)
          }
        })
      }
    },
    // 更新图表
    updateChart(chartsType, data) {
      if (chartsType === 'pieChart' || chartsType === 'roseChart') {
        const options = this.charts[this.currentEditChart.chartsId].getOption()
        options.series[0].data = data
        this.charts[this.currentEditChart.chartsId].clear()
        this.charts[this.currentEditChart.chartsId].setOption(options, {
          replaceMerge: 'dataset'
        })
      } else {
        const { legend, axis, series } = this.getChartsDataByDataset(
          chartsType,
          data
        )
        if (chartsType === 'barChart' || chartsType === 'lineChart') {
          this.charts[this.currentEditChart.chartsId].setOption({
            legend: {
              data: legend
            },
            xAxis: {
              data: axis
            },
            series: series
          })
        } else {
          this.charts[this.currentEditChart.chartsId].setOption({
            legend: {
              data: legend
            },
            yAxis: {
              data: axis
            },
            series: series
          })
        }
      }
    },
    // 获取柱状图、线图、条形图数据
    getChartsDataByDataset(chartsType, data) {
      let legend = []
      const series = []
      const axis = []
      data.forEach((item, index) => {
        if (index === 0) {
          legend = item.slice(1)
          for (let i = 1; i < item.length; i++) {
            series.push({
              name: item[i],
              type: chartsType === 'lineChart' ? 'line' : 'bar',
              data: []
            })
          }
        } else {
          axis.push(item[0])
          for (let i = 1; i < item.length; i++) {
            series[i - 1].data.push(item[i])
          }
        }
      })
      return {
        legend,
        axis,
        series
      }
    },
    // 获取图表列表
    getChartList(id) {
      this.charts = {}
      API.getCustomizeStatisticDetail({ id: id }).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.chartList = data.chartsList
          this.name = data.name
          this.chartList.forEach((item) => {
            this.generateChartElement(
              item.chartsId,
              document.getElementById('StatisticSection'),
              item.chartsLayout
            )
            // 初始化图表
            this[item.chartsType](item.chartsId, item.chartsData)
          })
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取图表数据 --- 父组件调用
    getSaveData() {
      return {
        charts: this.chartList,
        name: this.name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-container {
  display: flex;
  background: #e7e9ef;
  height: 580px;
  .left-section {
    width: 120px;
    padding: 10px;
    .statistic-item {
      padding: 10px;
      cursor: move;
    }
  }
  .right-sectin {
    flex: 1;
    padding: 10px;
    .form-section {
      width: 50%;
      display: flex;
      align-items: center;
      label {
        word-break: keep-all;
      }
    }
    .statistic-section {
      padding: 10px;
      border: 1px solid #dfdfdf;
      width: 100%;
      margin-top: 10px;
      background: #ffffff;
      height: calc(100% - 40px);
      overflow-y: auto;
    }
  }
}
</style>
<style lang="scss">
.statistic-section-item {
  width: calc(50% - 10px);
  height: 200px;
  border: 1px solid #dfdfdf;
  border-radius: 2px;
  position: relative;
  display: inline-block;
  margin: 5px;
  .header {
    padding: 10px;
    text-align: right;
    i {
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
    .show {
      display: inline-block;
    }
    .hide {
      display: none;
    }
  }
  .chart-section {
    width: 100%;
    height: calc(100% - 40px);
  }
}
.full-width {
  width: calc(100% - 10px);
}
</style>
