<template>
  <Container>
    <div class="content-section">
      <div class="content-section__left">
        <!--<Tree class="my-tree" :tree-data="treeDatas" :tree-props="defaultProp" @nodeClick="nodeClick" />-->
        <!--懒加载的部队树-->
        <div  class="tree" style="width:350px;height: calc(100vh - 145px);background:white;overflow-y:scroll;overflow-x:scroll;padding: 10px;">
          <el-tree
            class="my-tree"
            style="width:450px;"
            ref="myTree"
            lazy
            :load="loadBdTreeNode"
            :highlight-current="true"
            :accordion="true"
            :default-checked-keys="bdCheckedList"
            :props="defaultProp"
            node-key="id"
            @node-click="nodeClick"
          />
        </div>
      </div>
      <div class="content-section__right"
        v-loading="loading2"
        element-loading-text="加载中"
        element-loading-background="rgba(255, 255, 255, 0.001)"
        style="margin-bottom:12px;height:100%;width:100%;"
      >
        <div id="ChartSection" class="chart-section" />
      </div>
    </div>
<el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
      custom-class="qiefen-dialog-class"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="地理分析" name="geoanalysis">
          <MapOl v-if="baseDataModule" ref="MapOl" style="height:400px" :is-add-popup="true" :baseDataModule="baseDataModule" />
        </el-tab-pane>
        <el-tab-pane label="群体分析" name="second">
          <div style="display:flex;height:100%;padding-right: 14px;">
            <el-table
              :data="peopleTableData"
              border
              style="font-size: 14px;width:50%;"
              stripe
              show-summary
              force-scroll="vertical"
            >
              <el-table-column prop="MC" label="人员类别" />
              <el-table-column prop="BZS" label="编制数" />
              <el-table-column prop="SYS" label="现有数" />
              <el-table-column
                prop="ZWS"
                label="在位数"
              />
              <el-table-column
                prop="KCDS"
                label="可出动数"
              />
            </el-table>
            <div
              id="myChartNumber1"
              class="chart-section"
              style="width: 50%;height: 209px;margin-left: 10px;"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="路径分析" name="third">
          <el-table
            :data="pathTableData"
            border
            stripe
            tooltip-effect="dark"
            :header-cell-style="{background:'#1F7FD8',color:'#F8F8F8'}"
            height="400"
            style="width: 100%;"
          >
            <el-table-column
              prop="SSFSNM"
              label="输送方式"
              width="100"
            />
            <el-table-column
              prop="JDZBSJ"
              label="出动准备时间(小时)"
              width="130"
            />
            <el-table-column
              prop="RZDJDJL"
              label="日最大机动距离(千米)"
              width="150"
            />
            <el-table-column
              prop="ZZZMC"
              label="装载站名称"
              show-overflow-tooltip
              width="100"
            />
            <el-table-column
              prop="ZZSXSJ"
              label="装载所需时间(小时)"
              show-overflow-tooltip
              width="130"
            />
            <el-table-column
              prop="XZZMC"
              label="卸载站名称"
              show-overflow-tooltip
              width="200"
            />
            <el-table-column
              prop="XZSXSJ"
              label="卸载所需时间(小时)"
              width="130"
            />
            <el-table-column
              prop="YZRS"
              label="运载人数(人)"
              width="100"
            />
            <el-table-column
              prop="DJSXSJ"
              label="完成驻地到待机地域所需时间(小时)"
              width="220"
            />
            <el-table-column
              prop="ZDSXSJ"
              label="完成待机地域到作战阵地所需时间(小时)"
              width="240"
            />
            <el-table-column
              prop="SZSXSJ"
              label="完成实战部署至担负作战任务所需时间(小时)"
              width="260"
            />
          </el-table>
          <el-pagination
            style="text-align: right;"
            :current-page="pager.pageNum"
            :page-sizes="pager.pageSizes"
            :page-size="pager.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pager.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>
        <el-tab-pane label="行为分析" name="fourth">
          <div style="display: flex;flex-wrap:wrap;">
            <template>
              <div v-for="(item,index) in bdList" :key="index" class="allBgc">
                <div class="itemsName" :title="item.labelName">
                  {{ item.labelName }}
                </div>
                <div class="ziduan">{{ item.value }}</div>
              </div>
            </template>
            <!-- <template v-else>
              <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                <div class="itemsName" :title="items.labelName">
                  {{ items.labelName }}
                </div>
                <div
                  class="ziduan"
                >{{ items.value }}</div>
              </div>
            </template> -->
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeButton">关 闭</el-button>
      </span>
    </el-dialog>
  </Container>
</template>

<script>
import MapOl from '@/components/MapOl'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/graph')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import * as API from '@/api/index'
// import Tree from '@/components/NoHeaderTree'
import Container from '@/components/Container'
export default {
  name: 'Atlas',
  components: { Container, MapOl },
  data() {
    return {
pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
       treeDtaa:'',

      loading2:false,
      bdCheckedList: [],
      bdList: [
        {
          labelName: '日常战备首次出动最长时间(小时)',
          value: ''
        },
        {
          labelName: '日常战备首次出动最短时间(小时)',
          value: ''
        },
        {
          labelName: '一级战备首次出动最长时间(小时)',
          value: ''
        },
        {
          labelName: '一级战备首次出动最短时间(小时)',
          value: ''
        },
        {
          labelName: '二级战备首次出动最长时间(小时)',
          value: ''
        },
        {
          labelName: '二级战备首次出动最短时间(小时)',
          value: ''
        },
        {
          labelName: '三级战备首次出动最长时间(小时)',
          value: ''
        },
        {
          labelName: '三级战备首次出动最短时间(小时)',
          value: ''
        },
        {
          labelName: '四级战备首次出动最长时间(小时)',
          value: ''
        },
        {
          labelName: '四级战备首次出动最短时间(小时)',
          value: ''
        },
        {
          labelName: '四级战备火力突击最长反应时间(小时)',
          value: ''
        },
        {
          labelName: '四级战备火力突击最短反应时间(小时)',
          value: ''
        }

      ],
      pathTableData: [],
      forceCode: '',
      peopleTableData: [], // 人员实力   表格内容
      // 基础数据地图参数
      baseDataModule: null,
      activeName: 'geoanalysis',
      dialogVisible: false,
      nodes: [],
      links: [],
      // 过滤字段
      filterText: '',
      // 关系图表
      myChart: null,
      // 左侧树数据
      treeDatas: [],
      defaultProp: {
        children: 'childList',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // 获取树数据
    //this.getTreeData()
  },
  mounted() {
  },
  methods: {
    closeButton() {
      this.dialogVisible = false
      this.activeName = 'geoanalysis'
      this.baseDataModule = null
    },
    handleSizeChange(val) {
      this.perps()
    },
    handleCurrentChange(val) {
      this.perps()
    },
    // 加载部队树
    loadBdTreeNode(node, resolve) {
      const params = {}
      params.forceSequence = node.data ? node.data.id : ''
      API.getForceTreeList(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          if (node.level === 0) {
            if (data && data.length > 0) {
              this.forceCode = data[0].code
              // 默认部队选中节点
              this.bdCheckedList = [data[0].code]
              const checkTree = this.bdCheckedList.toString()
              //this.getTableList(checkTree)
              this.showLeftTree = true
            } else {
              this.showLeftTree = false
            }
          }
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取树数据
    getTreeData() {
      API.getTreeList().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeDatas = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 用来分割数组  每4个为一组
    group(array, subGroupLength) {
      if (array && array.length) {
        let index = 0
        const newArray = []
        while (index < array.length) {
        // slice(start,end) 从index下标开始   不包括结尾
          newArray.push(array.slice(index, index += subGroupLength))
        }
        return newArray
      }
    },
    perps() {
      const props = {
        forceCode: this.forceCode
      }
      API.getManeuverAbility(props).then(res => {
        const { msg, code, data } = res
        if (String(code) === '200') {
          console.log(data)
          this.pathTableData = data
          this.pager.total = data.length
        } else {
          this.$message.error(msg)
        }
      })
    },
    handleClick(tab, event) {
      if (tab.name === 'second') {
        const pops = {
          bdnm: this.forceCode,
          type: 'rysl'
        }
        API.getBassData(pops, this.forceCode, 'rysl').then(res => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            this.peopleTableData = data
            this.peopleTableDataDraw(data)
          } else {
            this.$message.error(msg)
          }
        })
        
      } else if (tab.name === 'third') {
        this.perps()
      } else if (tab.name === 'fourth') {
        const props = {
          forceCode: this.forceCode
        }
        API.getWarLevel(props).then(res => {
          const { code, msg, data } = res
          if (String(code) === '200') {
            console.log(data)
            this.bdList[0].value = data.RCZBSCCDZCSJ
            this.bdList[1].value = data.RCZBSCCDZDSJ
            this.bdList[2].value = data.YJZBSCCDZCSJ
            this.bdList[3].value = data.YJZBSCCDZDSJ
            this.bdList[4].value = data.EJZBSCCDZCSJ
            this.bdList[5].value = data.EJZBSCCDZDSJ
            this.bdList[6].value = data.SJZBSCCDZCSJ
            this.bdList[7].value = data.SJZBSCCDZDSJ
            this.bdList[8].value = data.ZJZBSCCDZCSJ
            this.bdList[9].value = data.ZJZBSCCDZDSJ
            this.bdList[10].value = data.ZJZBHLTJZCFYSJ
            this.bdList[11].value = data.ZJZBHLTJZDFYSJ
          } else {
            this.$message.error(msg)
          }

          // this.bdList = this.group(res.data, 4)
          // console.log(this.bdList)
        })
      }
    },
    // 树节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(data) {
      this.loading2 = true
      this.treeDtaa = data.label
      this.forceCode = data.code
      this.baseDataModule = null
      const params = {
        dbName: 'ZZLL',
        forceCode: data.code
      }
      API.getForce(params).then(res => {
        if (res.code === 200) {
          this.loading2 = false
          this.initCharts(res.data.data)
        }
      })
    
    },
    peopleTableDataDraw(data) {
      console.log(data)
        var myChart1 = this.$echarts.init(document.getElementById('myChartNumber1'))
        let mc = []
        mc = data.map((item) => {
          return item.MC
        })
        const bzs = data.map((item) => {
          return item.BZS
        })

        const xys = data.map((item) => {
          return item.SYS
        })
        const zws = data.map((item) => {
          return item.ZWS
        })
        const cds = data.map((item) => {
          return item.KCDS
        })
        
        myChart1.setOption({
        legend: {},
        tooltip: {},
        grid: {
          top: '10%',
          left: '3%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: { type: 'category', data: mc },
        yAxis: { type: 'value' },
        series: [
          {
            name: '编制数',
            type: 'bar',
            data: bzs
          },
          {
            name: '现有数',
            type: 'bar',
            data: xys
          },
          {
            name: '在位数',
            type: 'bar',
            data: zws
          },
          {
            name: '可出动数',
            type: 'bar',
            data: cds
          }
        ]
      })
    },

    /**
     * 设置echarts配置项,重绘画布
     */
    initCharts(dataList) {
      console.log(dataList,this.baseDataModule)
      if (!this.myChart) {
        this.myChart = echarts.init(document.getElementById('ChartSection'))
      }
      let fontSize = 12
      // 指定图表的配置项和数据
      const option = {
        // 动画更新变化时间
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        tooltip: {
          show: false
        },
        series: [
          {
            name: '关系图',
            type: 'graph',
            layout: 'force',
            legendHoverLink: true, // 是否启用图例 hover(悬停) 时的联动高亮。
            hoverAnimation: true, // 是否开启鼠标悬停节点的显示动画
            edgeLabel: {
              position: 'middle', // 边上的文字样式
              normal: {
                formatter: '{c}',
                show: true,
                textStyle: {
                  fontSize: fontSize
                }
              }
            },
            edgeSymbol: ['arrow', 'circle'],
            edgeSymbolSize: [10, 0],
            force: {
              edgeLength: 200,
              repulsion: 500 // 节点之间的距离
            },
            roam: true,
            draggable: true, // 每个节点的拖拉
            itemStyle: {
              normal: {
                cursor: 'pointer',
                label: {
                  show: true
                },
                nodeStyle: {
                  brushType: 'both',
                  borderColor: 'rgba(255,215,0,0.4)',
                  borderWidth: 1
                }
              },
              // 鼠标放上去有阴影效果
              emphasis: {
                focus: 'adjacency', // 聚焦关系图中的邻接点和边的图形(在高亮图形时，是否淡出其它数据的图形已达到聚焦的效果)
                lineStyle: {
                  width: 10
                },
                shadowColor: '#00FAE1',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 40
              }
            },
            lineStyle: {
              width: 2
              // curveness: 0.3 // 曲线
            },
            label: {
              normal: {
                show: true, // 是否显示标签。
                position: 'inside', // 文字置于圆圈下方 inside(圈里面) left right top bottom
                formatter: '{b}',
                textStyle: {
                  color: '#555555',
                  fontStyle: 'normal', // 文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                  fontWeight: 'bold', // 'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
                  fontFamily: 'sans-serif', // 文字的字体系列
                  fontSize: fontSize // 字体大小
                }
              }

            },
            symbolSize: 70, // 节点大小
            links: dataList.edges,
            data: dataList.nodes,
            cursor: 'pointer'
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
      let preZoom = 1
      // 设置文字(缩放文字)
      this.myChart.getZr().on('mousewheel', () => {
        var option = this.myChart.getOption()
        var zoom = option.series[0].zoom
        if (zoom !== preZoom) {
          preZoom = zoom
          fontSize = 12 * zoom
          option.series[0].label.textStyle.fontSize = fontSize
          option.series[0].label.textStyle.lineHeight = fontSize * 1.25
          option.series[0].edgeLabel.textStyle.fontSize = fontSize
          this.myChart.setOption(option)
        }
      })

      const this_this = this
      // 点击事件
      this.myChart.on('click', function(params) {
        if (this_this.treeDtaa === params.name) {
          if (params.dataType === 'node') {
            this_this.dialogVisible = true
            const objectAllData = {}
            if (this_this.activeName === 'geoanalysis') {
              const params = {
                bdnm: this_this.forceCode,
                type: 'bdbs'
              }
              API.getBassData(params, this_this.forceCode, 'bdbs').then(res => {
                var pointJD = '' // 经度
                var pointWD = '' // 纬度
                res.data.forEach(i => {
                  if (i.labelName === '经度') {
                    pointJD = parseFloat(i.value)
                    objectAllData.pointJD = i
                  } else if (i.labelName === '纬度') {
                    pointWD = parseFloat(i.value)
                    objectAllData.pointWD = i
                  } else if (i.labelName === '部队') {
                    objectAllData.bd = i
                  } else if (i.labelName === '地名') {
                    objectAllData.dm = i
                  } else if (i.labelName === '扩展地名') {
                    objectAllData.kzdm = i
                  } else if (i.labelName === '部署类别') {
                    objectAllData.bslb = i
                  } else if (i.labelName === '部署形式') {
                    objectAllData.bsxs = i
                  } else if (i.labelName === '高程') {
                    objectAllData.gc = i
                  } else if (i.labelName === '作战时间') {
                    objectAllData.zzsj = i
                  } else if (i.labelName === '天文时间') {
                    objectAllData.twsj = i
                  }
                })
                objectAllData.lonlat = [pointJD, pointWD]
                this_this.baseDataModule = objectAllData
                console.log(this_this.baseDataModule)
              })
            }
          } else {
            this_this.dialogVisible = false
          }
        } else {
          //this_this.$message.error('错了哦，这是一条错误消息')
        }
      })
      
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .my-tree{
  padding:0px 10px !important;
}
>>> .el-scrollbar{
      overflow: scroll !important;
    overflow-y: hidden !important;
    position: relative !important;

}
>>> .el-scrollbar__bar{
  display: none !important;
}
>>> .el-scrollbar__wrap{
      overflow-x: hidden !important;
    height: 100% !important;
    margin-right: -177px !important;
    }
.content-section{
    height: 100%;
    background: #ffffff;
    border-radius: 6px;
    display: flex;
    .left-section {
      width: 300px;
      overflow-x: auto;
      height: 100%;
      // overflow-y: auto;
      // background: #ffffff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
      padding: 0 10px;
      border-radius: 5px;
      margin: 0px 10px 10px 10px;
      // .left-tree {
      .search-section {
        margin: 4% 5% 2% 0;
        width: 100%;
        align-items: center;
      }
      .treebox {
        overflow: auto;
        width: 521px;
        height: calc(100% - 60px);
      }
      // }
    }
    &__left{
      padding: 10px;
      height: 100%;
      .my-tree{
        height: 100%;
      }
      .search-section{
        margin: 10px 0;
      }
      .tree-section{
        height: calc(100% - 55px);
        overflow-y: auto;
      }
    }
    &__right{
      padding: 20px;
      width: calc(100% - 350px);
      height: 100%;
      margin-left: 10px;
      .chart-section{
        width: 100%;
        height: 100%;
      }
    }
}
.allBgc {
  width: 254px;
  height: 40px;
  line-height: 40px;
  margin-left: 24px;
  margin-bottom: 8px;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  background: rgba(31, 125, 215, 0.14);
  .itemsName{
    width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .ziduan{
    width: 70%;height: 31px;line-height: 31px;margin-top: 4px;margin-right: 10px;
    background-color: #1f7dd72b;
  }
}
.situationItem {
  width: 300px;
  height: 40px;
  line-height: 40px;
  background: #f0f2f7;
  margin-left: 24px;
  margin-bottom: 8px;
  padding-left: 10px;
  // padding-right: 15px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  .itemsName{
    width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .ziduan{
    width: 70%;height: 31px;line-height: 31px;margin-top: 4px;margin-right: 10px;
    background: #dcdee399;
  }
}
</style>
