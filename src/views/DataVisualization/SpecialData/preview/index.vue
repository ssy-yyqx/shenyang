<template>
  <div id="StatisticSectionPreview" class="preview-section" :class="{'preview-section-download': isDownloading}" />
</template>

<script>
import * as API from '@/api/DataVisualization'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    isDownloading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 柱图配置
      barOption: {
        grid: {
          bottom: 30
        },
        legend: {
          left: 'center',
          data: ['编制数（人）', '现有数（人）', '在位数（人）', '可出动数（人）']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
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
          bottom: 30
        },
        legend: {
          left: 'center',
          data: ['编制数（人）', '现有数（人）', '在位数（人）', '可出动数（人）']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
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
          data: ['编制数（人）', '现有数（人）', '在位数（人）', '可出动数（人）']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
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
      // 饼图配置
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
      }
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
          document.getElementById('StatisticSectionPreview').innerHTML = ''
          this.charts = {}
          this.name = ''
          this.chartList = []
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取图表列表
    getChartList(id) {
      this.charts = {}
      API.getThematicDataDetail({ id: id }).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.chartList = data.chartsList
          this.chartList.forEach(item => {
            if (item.chartsType === 'text') {
              this.generateTextElement(item.chartsId, document.getElementById('StatisticSectionPreview'))
              document.getElementById(item.chartsId).innerHTML = item.dynamicSql
            } else if (item.chartsType === 'picture') {
              this.generatePictureElement(item.chartsId, document.getElementById('StatisticSectionPreview'))
              this.initPictureLoad(item.chartsId, item.dynamicSql)
            } else if (item.chartsType === 'table') {
              this.generateTableElement(item.chartsId, document.getElementById('StatisticSectionPreview'))
              this.initTable(item.chartsId, item.chartsData)
            } else {
              this.generateChartElement(item.chartsId, document.getElementById('StatisticSectionPreview'), item.chartsLayout)
              // 初始化图表
              this[item.chartsType](item.chartsId, item.chartsData)
            }
          })
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 生成文本编辑代码
    generateTextElement(id, target) {
      // 组件容器
      const element = document.createElement('div')
      element.setAttribute('class', 'preview-statistic-section-item full-width')
      // 图表容器
      const chartElement = document.createElement('div')
      chartElement.id = id
      chartElement.setAttribute('class', 'chart-section')
      // 添加图表元素
      element.appendChild(chartElement)
      // 添加组件
      target.appendChild(element)
    },
    // 生成图片代码
    generatePictureElement(id, target) {
      // 组件容器
      const element = document.createElement('div')
      element.setAttribute('class', 'preview-statistic-section-item full-width')
      // 图表容器
      const chartElement = document.createElement('div')
      chartElement.id = id
      chartElement.setAttribute('class', 'chart-section')
      // 添加图表元素
      element.appendChild(chartElement)
      // 添加组件
      target.appendChild(element)
    },
    // 初始化图片上传
    initPictureLoad(id, image) {
      const uploadDefaultImage = document.createElement('img')
      uploadDefaultImage.setAttribute('class', 'image-container')
      uploadDefaultImage.style.display = 'block'
      uploadDefaultImage.setAttribute('src', image)
      document.getElementById(id).setAttribute('class', 'preview-image-section')
      document.getElementById(id).appendChild(uploadDefaultImage)
    },
    // 生成表格代码
    generateTableElement(id, target) {
      // 组件容器
      const element = document.createElement('div')
      element.setAttribute('class', 'preview-statistic-section-item full-width')
      // 图表容器
      const chartElement = document.createElement('div')
      chartElement.id = id
      chartElement.setAttribute('class', 'chart-section')
      // 添加图表元素
      element.appendChild(chartElement)
      // 添加组件
      target.appendChild(element)
    },
    // 初始化表格
    initTable(id, tableData) {
      const tableElement = document.createElement('table')
      tableElement.setAttribute('border', 1)
      tableElement.setAttribute('cellspacing', 0)
      tableElement.setAttribute('cellpadding', 0)
      tableElement.setAttribute('class', 'preview-table-section')
      // 生成表头
      const headElement = document.createElement('tr')
      for (let i = 0, j = tableData.columns.length; i < j; i++) {
        const thElement = document.createElement('th')
        headElement.appendChild(thElement)
        thElement.innerHTML = tableData.columns[i]
      }
      tableElement.appendChild(headElement)
      // 生成表格内容
      for (let m = 0; m < tableData.rows.length; m++) {
        const trElement = document.createElement('tr')
        for (let n = 0; n < tableData.columns.length; n++) {
          const tdElement = document.createElement('td')
          trElement.appendChild(tdElement)
          tdElement.innerHTML = tableData.rows[m][n]
        }
        tableElement.appendChild(trElement)
      }
      document.getElementById(id).appendChild(tableElement)
    },
    // 生成图表代码
    generateChartElement(id, target, layout) {
      // 组件容器
      const element = document.createElement('div')
      if (layout === '2') {
        element.setAttribute('class', 'preview-statistic-section-item full-width')
      } else {
        element.setAttribute('class', 'preview-statistic-section-item')
      }
      // 图表容器
      const chartElement = document.createElement('div')
      chartElement.id = id
      chartElement.setAttribute('class', 'chart-section')
      // 添加图表元素
      element.appendChild(chartElement)
      // 添加组件
      target.appendChild(element)
    },
    // 初始化柱图
    barChart(id, data) {
      var myChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        const { legend, axis, series } = this.getChartsDataByDataset('barChart', data)
        this.barOption.legend.data = legend
        this.barOption.xAxis.data = axis
        this.barOption.series = series
      }
      myChart.setOption(this.barOption)
    },
    // 初始化条形图
    stripChart(id, data) {
      var myChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        if (data) {
          const { legend, axis, series } = this.getChartsDataByDataset('stripChart', data)
          this.stripOption.legend.data = legend
          this.stripOption.yAxis.data = axis
          this.stripOption.series = series
        }
      }
      myChart.setOption(this.stripOption)
    },
    // 初始化线图
    lineChart(id, data) {
      var myChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        const { legend, axis, series } = this.getChartsDataByDataset('lineChart', data)
        this.lineOption.legend.data = legend
        this.lineOption.xAxis.data = axis
        this.lineOption.series = series
      }
      myChart.setOption(this.lineOption)
    },
    // 初始化饼图
    pieChart(id, data) {
      const pieChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        this.pieOption.series[0].data = data
      }
      pieChart.setOption(this.pieOption)
    },
    // 初始化玫瑰图
    roseChart(id, data) {
      const pieChart = this.$echarts.init(document.getElementById(id))
      if (data) {
        this.roseOption.series[0].data = data
      }
      pieChart.setOption(this.roseOption)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-section{
  width: 100%;
  height: 600px;
  overflow-y: auto;
}
.preview-section-download{
  height: auto;
}
</style>
<style lang="scss">
.preview-image-section{
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  img{
    height: 100%;
    width: auto;
  }
}
.preview-table-section{
  width: 100%;
}
.preview-statistic-section-item{
  width: calc(50% - 10px);
  height: 200px;
  border-radius: 2px;
  position: relative;
  display: inline-block;
  margin: 5px;
  .chart-section{
    width: 100%;
    height: calc(100% - 40px);
    padding: 0 10px;
  }
}
.full-width{
  width: calc(100% - 10px);
}
</style>
