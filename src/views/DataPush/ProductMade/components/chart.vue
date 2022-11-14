<template>
  <div class="font">
    <!-- <el-divider content-position="left">{{ title }}</el-divider> -->
    <div class="title">{{ info.label }}</div>
    <div>
      <el-input
        v-model="infoC[info.value]"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
      />
    </div>
    <div class="echart">
      <el-button
        class="bt"
        type="primary"
        size="medium"
        @click="addChart"
      >添加图表</el-button>
    </div>
    <div id="mainChart" />
    <el-dialog title="图表数据" :visible.sync="dialogFormVisible" width="600px">
      <el-form v-if="dialogFormVisible" ref="form" :model="form" :rules="rules">
        <div class="headTitle">图标属性</div>
        <el-form-item label="名称：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图表：" prop="type" :label-width="formLabelWidth">
          <el-radio-group v-model="form.type">
            <el-radio v-for="(item,index) of charts" :key="index" :label="item.value">
              <el-image style="width: 20px; height: 20px" :src="item.image" />
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="headTitle">数据绑定</div>
        <el-form-item label="数据模板：" prop="dataTemplate" :label-width="formLabelWidth">
          <el-select
            v-model="form.dataTemplate"
            placeholder="请选择数据模板"
            @change="handleTemplats"
          >
            <el-option
              v-for="(item, index) of dataTemplates"
              :key="index"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="x轴：" prop="xAxis" :label-width="formLabelWidth">
          <el-select v-model="form.xAxis" placeholder="请选择x轴">
            <el-option
              v-for="(item, index) of xAxis"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="y轴：" prop="yAxis" :label-width="formLabelWidth">
          <el-select v-model="form.yAxis" placeholder="请选择y轴">
            <el-option
              v-for="(item, index) of yAxis"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button
          type="primary"
          @click="drawChart"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as API from '@/api/DataPush'
import echarts from 'echarts'
export default {
  props: ['info'],
  data() {
    return {
      image: require('@/icons/img/tablePhoto.png'),
      infoC: {},
      dialogFormVisible: false,
      form: {
        name: '',
        type: 'bar',
        dataTemplate: '',
        xAxis: '',
        yAxis: ''
      },
      formLabelWidth: '100px',
      dataTemplates: [],
      xAxis: [],
      yAxis: [],
      charts: [
        {
          // 柱状
          image: require('@/icons/img/bar.png'),
          value: 'bar'
        },
        {
          // 面积图
          image: require('@/icons/img/areaLine.png'),
          value: 'arealine'
        },
        {
          // 折线图
          image: require('@/icons/img/line.png'),
          value: 'line'
        },
        {
          // 仪表盘
          image: require('@/icons/img/dashboard.png'),
          value: 'gauge'
        },
        {
          // 表格
          image: require('@/icons/img/table.png'),
          value: 'table'
        },
        {
          // 饼图
          image: require('@/icons/img/pie.png'),
          value: 'pie'
        }
      ],
      charsValue: {},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        dataTemplate: [
          { required: true, message: '请选择数据模板', trigger: 'change' }
        ],
        xAxis: [
          { required: true, message: '请选择x轴', trigger: 'change' }
        ],
        yAxis: [
          { required: true, message: '请选择y轴', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择图表类型', trigger: 'change' }
        ]

      }
    }
  },
  methods: {
    addChart() {
      this.dialogFormVisible = true
      API.findDataTemplate().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.dataTemplates = data
          this.$refs.form.resetFields()
        } else {
          this.$message.error(msg)
        }
      })
    },
    handleTemplats(value) {
      this.xAxis = [...value.x]
      this.yAxis = [...value.y]
    },
    drawChart() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          API.findDataInfo().then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.charsValue = { ...data }
              // 画图表
              switch (this.form.type) {
                case 'bar':this.barChart()
                  break
                case 'arealine':this.arealineChart()
                  break
                case 'line':this.lineChart()
                  break
                case 'gauge':this.gaugeChart()
                  break
                case 'table':this.tableChart()
                  break
                case 'pie':this.pieChart()
                  break
              }
            } else {
              this.$message.error(msg)
            }
          })
        }
      })
    },
    resetForm() {
      this.dialogFormVisible = false
    },
    barChart() {
      // 柱状图
      var chartDom = document.getElementById('mainChart')
      var myChart = echarts.init(chartDom)
      var option = {
        title: {
          text: this.form.name,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.charsValue.x,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: this.charsValue.y
          }
        ]
      }
      myChart.setOption(option)
    },
    arealineChart() {
      // 面积图
      var chartDom = document.getElementById('mainChart')
      var myChart = echarts.init(chartDom)
      var option = {
        title: {
          text: this.form.name,
          left: 'center'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.charsValue.x
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.charsValue.y,
          type: 'line',
          areaStyle: {}
        }]
      }

      myChart.setOption(option)
    },
    lineChart() {
      // 折线图
      var chartDom = document.getElementById('mainChart')
      var myChart = echarts.init(chartDom)
      var option = {
        title: {
          text: this.form.name,
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.charsValue.x
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.charsValue.y,
          type: 'line'
        }]
      }
      myChart.setOption(option)
    },
    gaugeChart() {
      // 仪表盘
      var chartDom = document.getElementById('mainChart')
      var myChart = echarts.init(chartDom)
      var option = {
        title: {
          text: this.form.name,
          left: 'center'
        },
        series: [{
          type: 'gauge',
          axisLine: {
            lineStyle: {
              width: 20,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -20,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -20,
            length: 20,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            color: 'auto',
            distance: 0,
            fontSize: 16
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} km/h',
            color: 'auto'
          },
          data: [{
            value: 70
          }]
        }]
      }
      myChart.setOption(option)
    },
    tableChart() {
      // 表格
    },
    pieChart() {
      // 饼图
      var chartDom = document.getElementById('mainChart')
      var myChart = echarts.init(chartDom)
      var option = {
        title: {
          text: this.form.name,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 735, name: '士兵' },
              { value: 580, name: '首长' }
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
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.font {
  .el-divider__text,
  .el-link {
    font-size: 20px;
  }
  .title {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .echart {
    .bt {
      margin-top: 10px;
    }
  }
  #mainChart{
    margin-top: 10px;
    width: 500px;
    height: 350px;
    background-color: #f5f6fa;
  }
  .headTitle {
    font-size: 16px;
    font-weight: bolder;
    padding: 5px 0px;
    background: #f5f6fa;
    margin-bottom: 5px;
  }
}
</style>
