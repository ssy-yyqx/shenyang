<template>
  <Container style="padding: 0px">
    <!-- 下拉选项 -->
    <div class="selectBox">
      <!-- 部队-->

      <el-row :gutter="20">
        <el-col :span="3">
          <el-cascader
            v-model="selectData"
            style="height:100%; margin-left: 2px;padding-top: 13px;"
            :options="options"
            :props="Props"
            @change="cascaderChange"
          /></el-col>
        <el-col :span="3">
          <el-date-picker
            v-model="selectyear"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
            style="height:100%; width: 100%"
            @change="cascaderChange"
          /></el-col>
        <el-col :span="6">
          <el-button
            size="small"
            @click="getStatisticsWord()"
          >下载</el-button>
          
        </el-col>

      </el-row>
    </div>
    <!-- 主体部分 -->
    <div class="mainContent1">
      <!-- 左边图表 -->
      <div class="leftBox">
        <!-- 人员实力统计 -->
        <Containerthree>
          <div class="cardTop">
            <img
              :src="require(`@/icons/newImages/analysis/zhuzhuangtu01.png`)"
              class="img-class"
              alt=""
            >
            <span>人员实力统计</span>
            <el-dropdown size="medium" type="primary" style="margin-left:100px;">
              <span class="el-dropdown-link">
                <el-button type="primary">切换 <i class="el-icon-arrow-down el-icon--right" /></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="qiehuanTongji('0','ry')">柱状图</el-dropdown-item>
                <el-dropdown-item @click.native="qiehuanTongji('1','ry')">折线图</el-dropdown-item>
                <el-dropdown-item @click.native="qiehuanTongji('2','ry')">饼状图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          
          <el-divider />
          <!--人员实力统计 柱状图 -->
          <div id="ryslmyChart" ref="ryslmyCharts" style="width: 1100px; height: 300px" />
        </Containerthree>
        <!-- 关键岗位人员变化统计 -->
        <Containerthree>
          <div class="cardTop">
            <img
              :src="require(`@/icons/newImages/analysis/zhuzhuangtu01.png`)"
              class="img-class"
              alt=""
            >
            <span>物资变化统计</span>
             <el-dropdown size="medium" type="primary" style="margin-left:110px;">
              <span class="el-dropdown-link">
                <el-button type="primary">切换 <i class="el-icon-arrow-down el-icon--right" /></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="qiehuanTongji('0','wz')">柱状图</el-dropdown-item>
                <el-dropdown-item @click.native="qiehuanTongji('1','wz')">折线图</el-dropdown-item>
                <el-dropdown-item @click.native="qiehuanTongji('2','wz')">饼状图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-divider />

          <div id="main" ref="mains" style="width: 1100px; height: 300px" />
        </Containerthree>
        <Containerthree>
          <div class="cardTop">
            <img
              :src="require(`@/icons/newImages/analysis/zhuzhuangtu01.png`)"
              class="img-class"
              alt=""
            >
            <span>弹药统计</span>
             <el-dropdown size="medium" type="primary" style="margin-left:150px;">
              <span class="el-dropdown-link">
                <el-button type="primary">切换 <i class="el-icon-arrow-down el-icon--right" /></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="qiehuanTongji('0','dy')">柱状图</el-dropdown-item>
                <el-dropdown-item @click.native="qiehuanTongji('1','dy')">折线图</el-dropdown-item>
                <el-dropdown-item @click.native="qiehuanTongji('2','dy')">饼状图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-divider />

          <!--弹药统计  仪表盘 -->
          <div
            id="myChartAmmunition"
             ref="myChartAmmunitions"
            :style="{ width: '1100px', height: '300px' }"
          />
        </Containerthree>
        <Containerthree>
          <div class="cardTop">
            <img
              :src="require(`@/icons/newImages/analysis/zhuzhuangtu01.png`)"
              class="img-class"
              alt=""
            >
            <span>装备统计</span>
             <el-dropdown size="medium" type="primary" style="margin-left:160px;">
              <span class="el-dropdown-link">
                <el-button type="primary">切换 <i class="el-icon-arrow-down el-icon--right" /></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="qiehuanTongji('0','zb')">柱状图</el-dropdown-item>
                <el-dropdown-item @click.native="qiehuanTongji('1','zb')">折线图</el-dropdown-item>
                <el-dropdown-item @click.native="qiehuanTongji('2','zb')">饼状图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-divider />
          <!-- <el-select
            v-model="ZBvalue"
            placeholder="请选择"
            @change="ZBChange"
            style="width: 215px"
          >
            <el-option
              v-for="item in ZBoptions"
              :key="item.DYZTNM"
              :label="item.MC"
              :value="item.MC"
            >
            </el-option>
          </el-select> -->

          <!--装备统计  折线图 -->
          <div id="ZBmyChart" ref="ZBmyCharts" :style="{ width: '1100px', height: '300px' }" />
        </Containerthree>
      </div>
      <!-- 右边信息部分 -->
    </div>

    <!-- 详情展示模态框 -->
    <el-dialog
      title="人员基本信息"
      :visible.sync="dialogVisible"
      width="80%"
      top="5vh"
      class="qiefen-dialog-class"
    >
      <div style="display: flex">
        <div class="left" style="width: 10%">
          <img
            :src="picture ? picture : '暂无'"
            alt=""
            style="width: 80%; margin-left: 20px"
          >
        </div>
        <div class="right" style="flex: 1; margin-left: 50px">
          <div class="bottom" style="display: flex; flex-wrap: wrap">
            <p>姓名：{{ allDataList.name ? allDataList.name : "暂无" }}</p>
            <p>民族：{{ allDataList.nation ? allDataList.nation : "暂无" }}</p>
            <p>性别：{{ allDataList.sex ? allDataList.sex : "暂无" }}</p>
            <p>
              籍贯：{{
                allDataList.nativePlace ? allDataList.nativePlace : "暂无"
              }}
            </p>
            <p>
              政治面貌：{{
                allDataList.politicalOutlook
                  ? allDataList.politicalOutlook
                  : "暂无"
              }}
            </p>
            <p>
              出生年月：{{
                allDataList.birthDate ? allDataList.birthDate : "暂无"
              }}
            </p>
            <p>
              文化程度：{{
                allDataList.educationDegree
                  ? allDataList.educationDegree
                  : "暂无"
              }}
            </p>
            <p>
              入伍时间：{{
                allDataList.enlistmentDate ? allDataList.enlistmentDate : "暂无"
              }}
            </p>
            <p>
              第一学历：{{
                allDataList.educationDegree
                  ? allDataList.educationDegree
                  : "暂无"
              }}
            </p>
            <p>
              军衔：{{
                allDataList.militaryRank ? allDataList.militaryRank : "暂无"
              }}
            </p>
            <p>
              级别：{{ allDataList.jobLevel ? allDataList.jobLevel : "暂无" }}
            </p>
            <p>
              职务：{{
                allDataList.personType ? allDataList.personType : "暂无"
              }}
            </p>
            <p>
              现职时间：{{
                allDataList.currentJobTime ? allDataList.currentJobTime : "暂无"
              }}
            </p>
            <p>
              现岗时间：{{
                allDataList.jobLevel ? allDataList.jobLevel : "暂无"
              }}
            </p>
            <p>
              身份证号：{{
                allDataList.idCardNum ? allDataList.idCardNum : "暂无"
              }}
            </p>
          </div>
        </div>
      </div>
      <el-divider />
      <div style="margin-left: 23px">
        <p class="top" style="font-weight: bold; font-size: 14px">院校培训</p>
        <div class="bottom" style="white-space: pre-wrap; line-height: 24px">
          {{
            allDataList.collegeStudySituation
              ? allDataList.collegeStudySituation
              : "暂无"
          }}
        </div>
      </div>
      <el-divider />
      <div style="margin-left: 23px">
        <p class="top" style="font-weight: bold; font-size: 14px">任职经历</p>
        <div class="bottom" style="white-space: pre-wrap; line-height: 24px">
          {{ allDataList.taskSituation ? allDataList.taskSituation : "暂无" }}
        </div>
      </div>
      <el-divider />
      <div style="margin-left: 23px">
        <p class="top" style="font-weight: bold; font-size: 14px">
          参加重大任务情况
        </p>
        <div class="bottom" style="white-space: pre-wrap; line-height: 24px">
          {{ allDataList.taskSituation ? allDataList.taskSituation : "暂无" }}
        </div>
      </div>
      <el-divider />
      <div style="margin-left: 23px">
        <p class="top" style="font-weight: bold; font-size: 14px">简述</p>
        <div class="bottom" style="white-space: pre-wrap; line-height: 24px">
          {{ allDataList.desc ? allDataList.desc : "暂无" }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </Container>
</template>
<script>
// import { mapGetters } from 'vuex'
import Container from '@/components/Container'
import Containerthree from '@/components/ContainerThree'
import Containerfour from '@/components/ContainerFour'
import * as API from '@/api/index'
import * as DataCollectionAPI from '@/api/dataCollection'
// import * as echarts from 'echarts'

export default {
  components: { Container, Containerthree, Containerfour },
  props: {
    forceCode: {
      type: String, // default: () => {return []} 数组写法
      default: ''
    }
  },

  data() {
    return {
      forceCodes: '',
      selectData: [],
      selectyear: '',
      StaffStrengthoptions: {},
      StaffStrength: [],
      Staffprops: {
        value: 'label',
        label: 'label'
      },
      goodsoptions: {},
      goods: [],
      Props: {
        value: 'field',
        id: 'id',
        label: 'label',
        children: 'childList', // 这里最好要后台返回树形数据
        checkStrictly: true
      },
      Ammunitionoptions: [],
      Ammunitionvalue: [],
      options: [],
      ZBdatAoptions: [],
      value: '',
      details: '', // 人员实力统计主官信息
      otherZhuguan: '', // 人员实力统计其他关键岗位信息
      headPortrait: '', // 人员实力详情头像
      ggryHeadPortrait: '', // 关键岗位人员头像信息
      sfzh: '',
      // 饼图
      pieChart: null,
      // 折线图
      lines: null,
      arrDate: [],
      linesData: null,
      datalabelName: '',
      dialogVisible: false,
      idCard: '',
      // zbgcnm: '', // 战备工程内码
      flmc: '', // 防类名称   用来区分机场、通信、仓库表
      allDataList: [], // 数据列表
      dataList: [], // 截取后的数组
      special: [],
      picture: '',
      ZBprops: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const params = {}
          params.equipmentId = node.data ? node.data.id : ''
          API.getEquipmentTreeList(params).then((res) => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              if (data.length > 0) {
                data.forEach((item) => {
                  item.value = item.label
                  item.children = item.children
                })
              }

              resolve(data)
            }
          })
        }
      },
      // details: []
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.initPieChart()
  },
  created() {
    this.getTree()
    // this.idCard = this.$route.query.idCard
  },

  methods: {
    qiehuanTongji(val,type) {
      if (val === '0') {
        this.series = [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      }
      if (val === '1') {
        this.series = [{ type: 'line' }, { type: 'line' }, { type: 'line' }]
      }
      if (val === '2') {
        this.series = [{ type: 'pie' }, { type: 'pie' }, { type: 'pie' }]
      }
      const params = {
        forceCode: this.forceCodes,
        year: this.selectyear
      }
      if(type=='ry'){//人员
        this.getPersonal(params)
      }else if(type=='wz'){//物资
        this.getMaterial(params)
      }else if(type=='dy'){//弹药
        this.getAmmunition(params)
      } else if(type=='zb'){//装备
       this.getEquipment(params)
      }
    },
    getStatisticsWord() {
      if (this.selectData.length > 0) {
        this.forceCodes =
          this.selectData[this.selectData.length - 1].toString()
      }
      

      if (!this.forceCodes) {
        this.$message({
          message: '请选择部队',
          type: 'warning'
        })
      }
      if (!this.selectyear) {
        this.$message({
          message: '请选择年份',
          type: 'warning'
        })
      }
      const params = {
        forceCode: this.forceCodes,
        year: this.selectyear
      }
      if (this.forceCodes && this.selectyear) {
        API.getStatisticsWord(params).then((res) => {
          
          window.open(res.msg)
        })
      }
    },
    // 装备
    ZBchange(data) {
      var myChart = this.$echarts.init(document.getElementById('ZBmyChart'))

      // ZBmyCharts
      if(data.length > 0) {
        const option = {
          legend: {},
          tooltip: {},
          dataset: {
            source: data
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: this.series
        }
        
        setTimeout(() => {
          myChart.setOption(option)
          this.$refs.ZBmyCharts.style = "visibility: visible;"
        }, 300)
      }else {
          this.$refs.ZBmyCharts.style = "visibility: hidden;"
      }
     
    },
    // 武器装备
    getStatisticsZB(forceCode, year) {
      const prams = {
        forceCode: forceCode,
        year: year
      }
      API.getStatisticsZB(prams).then((res) => {
        this.ZBdatAoptions = res.data
      })
    },
    getStatisticsDY(forceCode, year) {
      const prams = {
        forceCode: forceCode,
        year: year
      }
      API.getStatisticsDY(prams).then((res) => {
        
        this.Ammunitionoptions = res.data
      })
    },
    // 弹药统计
    AmmunitionChange(data) {
      var myChart = this.$echarts.init(
        document.getElementById('myChartAmmunition')
      )
      //myChartAmmunitions
      if(data.length > 0) {
        const option = {
          legend: {},
          tooltip: {},
          dataset: {
            source: data
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: this.series
        }
        setTimeout(() => {
          myChart.setOption(option)
          this.$refs.myChartAmmunitions.style = "visibility: visible;"
        }, 300)
      }else {
        this.$refs.myChartAmmunitions.style = "visibility:hidden"
      }
      
    },
    // 物资统计
    goodsChange(data) {
      var myChart = this.$echarts.init(document.getElementById('main'))

      if(data.length > 0) {
        const option = {
          legend: {},
          tooltip: {},
          dataset: {
            source: data
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: this.series
        }
        
        setTimeout(() => {
          myChart.setOption(option)
          this.$refs.mains.style = "visibility: visible;"
        }, 300)
      }else {
          this.$refs.mains.style = "visibility: hidden;"
      }
     
      
    },
    // 人员统计
    StaffStrengthChange(data) {
      var myChart = this.$echarts.init(document.getElementById('ryslmyChart'))
      if(data.length > 0){
        
        const option = {
          legend: {},
          tooltip: {},
          dataset: {
            source: data
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: this.series
        }
        setTimeout(() => {
          myChart.setOption(option)
          this.$refs.ryslmyCharts.style = "visibility: visible;"
        }, 300)

      }else {
        this.$refs.ryslmyCharts.style = "visibility:hidden"
      }
    },
    // 处理数据
    setDataStaff(data, zongData) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children) {
          this.setDataStaff(data[i].children, zongData)
        } else {
          if (data[i] && !zongData[data[i].label]) {
            // let a = arr.find((e) => data[i].id.indexOf(e.id) != -1);
            // arr.splice(arr.indexOf(a), 1);
            data.splice(i, 1)
            i = i - 1
            // delete data[i];
          }
        }
      }

      return data
    },

    // 获取级联选择器数列表
    getTree() {
      API.getTreeList().then((res) => {
        if (res.code === 200) {
          this.options = this.setData(res.data)
        }
      })
    },
    // 处理树数据
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
    // 级联选择器事件
    cascaderChange() {
      if (this.selectData.length > 0) {
        this.forceCodes =
          this.selectData[this.selectData.length - 1].toString()
      }
      const params = {
        forceCode: this.forceCodes,
        year: this.selectyear
      }
      if (!this.forceCodes) {
        this.$message({
          message: '请选择部队',
          type: 'warning'
        })
      }
      if (!this.selectyear) {
        this.$message({
          message: '请选择年份',
          type: 'warning'
        })
      }
      if (this.forceCodes && this.selectyear) {
        
        this.getPersonal(params)
        this.getAmmunition(params)
        this.getEquipment(params)
        this.getMaterial(params)
      }
    },
    // 人员统计
    getPersonal(params) {
      API.getPersonal(params).then(res => {
        if (res.data) {
          this.StaffStrengthChange(res.data)
        }
      })
    },
    // 弹药统计
    getAmmunition(params) {
      API.getAmmunition(params).then(res => {
        if (res.data) {
          this.AmmunitionChange(res.data)
        }
      })
    },
    // 装备统计
    getEquipment(params) {
      API.getEquipment(params).then(res => {
        if (res.data) {
          this.ZBchange(res.data)
        }
      })
    },
    // 物资统计
    getMaterial(params) {
      API.getMaterial(params).then(res => {
        if (res.data) {
          this.goodsChange(res.data)
        }
      })
    },
    // 获取部队树
    // 人员实力统计
    drawBar(forceCode, year) {
      const prams = {
        forceCode: forceCode,
        year: year
      }
      API.personStrength(prams).then((res) => {
        this.StaffStrengthoptions = res.data
        // this.StaffStrengthoptions.SearchLB = this.setDataStaff(
        //   this.StaffStrengthoptions.SearchLB,
        //   this.StaffStrengthoptions
        // );
        this.StaffStrengthoptions.SearchLB = this.StaffStrengthoptions.SearchLB
      })
    },
    // 物资变化统计
    drawLine(forceCode, year) {
      const prams = {
        forceCode: forceCode,
        year: year
      }
      API.keyJob(prams).then((res) => {
        this.goodsoptions = res.data
        // this.goodsoptions.SearchLB = this.setDataStaff(
        //   this.goodsoptions.SearchLB,
        //   this.goodsoptions
        // )
        this.goodsoptions.SearchLB = this.goodsoptions.SearchLB
      })
    },

    // 初始化饼图
    initPieChart() {
      this.pieChart = this.$echarts.init(
        document.getElementById('myChartNumber')
      )
      const options = {
        // 鼠标悬浮
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          orient: 'vertical',
          left: 'right',
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          top: '5%',
          left: 'center'
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
            data: []
          }
        ]
      }
      this.pieChart.setOption(options)
    },
    // 关键岗位人员变化统计
    drawBarNumber(forceCode, year) {
      const prams = {
        forceCode: forceCode,
        year: year
      }
      API.specialOperation(prams).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          const pieData = []
          for (let i = 0; i < data.length; i++) {
            pieData.push({
              name: data[i].MC,
              value: data[i].SUMN
            })
          }

          this.pieChart.setOption({
            series: [
              {
                data: pieData
              }
            ]
          })
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 人员实力详情
    powerDetails(forceCode, year) {
      const prams = {
        forceCode: forceCode,
        year: year
      }
      API.personPower(prams).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.otherZhuguan = data

          this.ggryHeadPortrait = this.otherZhuguan.map((item) => {
            item.picture = 'data:image/jpeg;base64,' + item.picture
          })
        } else {
          this.$message.error(msg)
        }
      })
    },

    // 详情按钮事件
    detailsButton(item, index) {
      this.dialogVisible = true
      // console.log(item)
      this.idCard = item.idCardNum
      this.getDetail()
      // console.log(index, indexs)
      // const routeData = this.$router.resolve({
      //   path: '/detailsPeople',
      //   query: {
      //     idCard: item.idCardNum
      //   }
      // })
      // console.log(routeData.href)
      // window.open('#/detailsPeople?idCard=' + item.idCardNum, '_blank')

      // const prams = {
      //   idCard: item.idCardNum
      // }
      // API.personDetails(prams).then(res => {
      //   const { code, data, msg } = res
      //   if (String(code) === '200') {
      //     window.open(data)
      //   } else {
      //     this.$message.error(msg)
      //   }
      // })
    },
    // 获取详细信息
    getDetail() {
      const params = {
        idCard: this.idCard
      }
      API.personDetails(params).then((res) => {
        const { data, code, msg } = res
        if (String(code) === '200') {
          this.picture = `data:image/jpeg;base64,` + data.picture
          this.allDataList = data
        } else {
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-col-3{
  height:100%
}
>>> .el-row{
  height:100%
}
.selectBox {

  height: 62px;
  background: white;
  border-radius: 0 0 5px 5px;
  line-height: 62px;
  // height: 30px;
  // margin-top: 12px;
  margin-bottom: 12px;
  .el-select {
    margin: 0px 30px 20px 0px;
  }
}
.mainContent1 {
  // height: 100%;
  //height: 77%;
  height:calc(100% - 143px);
  width:100%;
  display: flex;
  .cardTop {
    font-size: 14px;
    .img-class {
      width: 15px;
      height: 15px;
    }
  }
}
.rightBox {
  margin-left: 12px;
  width: 30%;
  // height: 100%;
  // overflow: scroll;
  // overflow-x: hidden;
  .el-card {
    .el-card__body {
      .item {
        display: flex;
        border-bottom: 1px solid #e6e6e6;
        padding-bottom: 5px;
        margin-bottom: 5px;
        .names {
          width: 25px;
          height: 25px;
        }
        .el-divider {
          margin-bottom: 24px;
        }
        .el-button {
          width: 50px;
          height: 25px;
        }
      }
    }
  }
}
.leftBox {
  width: 100%;
  height: 100%;

  overflow: scroll;
  overflow-x: hidden;
}
.el-dialog {
  .right {
    .bottom {
      p:nth-child(n) {
        width: 250px;
      }
    }
  }
}
.content {
  width: 67%;
  margin: 0 auto;
  overflow: scroll;
  overflow-x: hidden;
  height: 100%;
  .ContainerSix {
    margin-bottom: 20px;
    .top {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      padding-left: 24px;
      border-bottom: 1px solid #e6e6e6;
    }
    .bottom {
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      padding: 10px 0 10px 40px;
      p {
        width: 25%;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
      }
    }
    .bottom1 {
      padding: 10px 0 10px 40px;
      // height: 300px;
      // overflow: scroll;
      // overflow-x: hidden;
      .qq {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        p {
          width: 25%;
          height: 40px;
          line-height: 40px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
