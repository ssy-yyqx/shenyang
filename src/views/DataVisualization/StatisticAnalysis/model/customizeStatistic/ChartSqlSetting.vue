<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="示例数据" name="example">
        <el-table :data="tableData" stripe border style="width: 100%">
          <el-table-column
            v-for="(item, index) in tableHeader"
            :key="index"
            :prop="item.name"
            :header-align="'center'"
            :label="item.title"
            :width="item.width"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-input
                v-if="type !== 'view'"
                v-model="scope.row[item.name]"
                size="small"
              />
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="sql配置" name="sql">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.title" :disabled="type === 'view'" />
          </el-form-item>
          <el-form-item label="sql:">
            <el-input
              v-model="form.sql"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              :disabled="type === 'view'"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 'example',
      form: {
        sql: '',
        title: ''
      },
      tableHeader: [],
      tableData: []
    }
  },
  watch: {
    chartData: {
      handler(val) {
        this.form = {
          sql: val.dynamicSql,
          title: val.title
        }
        this.setTableData(val.chartsType)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleClick(tab, event){
      this.$emit('handleClick',tab.name)
    },
    // 获取图表sql数据 --- 父组件调用
    getData() {
      return this.form
    },
    // 根据图表类型设置默认示例数据
    setTableData(chartsType) {

      if (
        chartsType === 'pieChart' ||
        chartsType === 'roseChart' ||
        chartsType === 'candlestick'
      ) {
        this.tableHeader = [
          {
            name: 'labelName',
            title: '',
            width: 180
          },
          {
            name: 'column1',
            title: ''
          }
        ]
        this.tableData = [
          {
            labelName: '舰艇长',
            column1: '20'
          },
          {
            labelName: '指挥员',
            column1: '20'
          },
          {
            labelName: '其他',
            column1: '20'
          }
        ]
      } else if (chartsType == 'gauge') {
        this.tableHeader = [
          {
            name: 'labelName',
            title: '',
            width: 180
          },
          {
            name: 'column1',
            title: '数量'
          },
          {
            name: 'column2',
            title: '总数'
          }
        ]
        this.tableData = [
          {
            labelName: '士兵',
            column1: '11',
            column2: '11'
          }
        ]
      } else if (chartsType == 'scatter') {
        this.tableHeader = [
          {
            name: 'labelName',
            title: '',
            width: 180
          },
          {
            name: 'column1',
            title: '身高'
          },
          {
            name: 'column2',
            title: '体重'
          }
        ]
        this.tableData = [
          {
            labelName: '小王',
            column1: '170',
            column2: '50'
          },
          {
            labelName: '小李',
            column1: '170',
            column2: '50'
          }
        ]
      } else if (chartsType == 'radar' || chartsType == 'parallel') {
        this.tableHeader = [
          {
            name: 'labelName',
            title: '',
            width: 180
          },
          {
            name: 'column1',
            title: '编制数（人）'
          },
          {
            name: 'column2',
            title: '现有数（人）'
          },
          {
            name: 'column3',
            title: '在位数（人）'
          },
          {
            name: 'column4',
            title: '可出动数（人）'
          },
          {
            name: 'column5',
            title: '已出动数（人）'
          }
        ]
        this.tableData = [
          {
            labelName: '军（警）官',
            column1: '105',
            column2: '98',
            column3: '97',
            column4: '96',
            column5: '100'
          },
          {
            labelName: '义务兵',
            column1: '1',
            column2: '0',
            column3: '0',
            column4: '0',
            column5: '100'
          },
          {
            labelName: '士官',
            column1: '1',
            column2: '0',
            column3: '0',
            column4: '0',
            column5: '100'
          }
        ]
      } else if (chartsType == 'sankey') {
        this.tableHeader = [
          {
            name: 'labelName',
            title: '',
            width: 180
          },
          {
            name: 'column1',
            title: '数量'
          }
        ]
        this.tableData = [
          {
            labelName: '士官',
            column1: '11'
          },
          {
            labelName: '义务兵',
            column1: '11'
          },
          {
            labelName: '军（警）官',
            column1: '11'
          },
          {
            labelName: '总人数',
            column1: '11'
          }
        ]
      } else {
        this.tableHeader = [
          {
            name: 'labelName',
            title: '',
            width: 180
          },
          {
            name: 'column1',
            title: '编制数（人）'
          },
          {
            name: 'column2',
            title: '现有数（人）'
          },
          {
            name: 'column3',
            title: '在位数（人）'
          },
          {
            name: 'column4',
            title: '可出动数（人）'
          }
        ]
        this.tableData = [
          {
            labelName: '军（警）官',
            column1: '105',
            column2: '98',
            column3: '97',
            column4: '96'
          },
          {
            labelName: '义务兵',
            column1: '1',
            column2: '0',
            column3: '0',
            column4: '0'
          },
          {
            labelName: '士官',
            column1: '56',
            column2: '52',
            column3: '52',
            column4: '51'
          }
        ]
      }
    },
    // 获取图表示例数据 --- 父组件调用
    getChartData() {
      const data = []
      if (
        this.chartData.chartsType === 'pieChart' ||
        this.chartData.chartsType === 'roseChart'
      ) {
        this.tableHeader.forEach((item) => {
          data.push({
            name: item.title,
            value: this.tableData[0][item.name]
          })
        })
      } else {
        const labels = ['labelName']
        this.tableHeader.forEach((item, index) => {
          if (index > 0) {
            labels.push(item.title)
          }
        })
        data.push(labels)
        this.tableData.forEach((item) => {
          data.push([
            item.labelName,
            item.column1,
            item.column2,
            item.column3,
            item.column4
          ])
        })
      }
      return data
    }
  }
}
</script>
