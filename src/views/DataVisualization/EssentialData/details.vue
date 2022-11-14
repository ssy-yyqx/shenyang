<template>
  <el-dialog
    title="人员基本信息"
    :close-on-click-modal="false"
    :visible.sync="detailVisible"
    top="1vh"
    class="qiefen-dialog-class"
    width="60%"
    :before-close="handleClose"
  >
    <table border="1" align="center" cellpadding="10" cellspacing="0" width="100%">
      <tbody align="center">
        <!-- width表示宽度，colspan表示占几列，rowspan表示占几行 contentEditable="true" 在<td></td>加上，可编辑-->
        <tr>
          <th width="20%">姓名</th>
          <td colspan="1" rowspan="1">{{ detailRow.MC ? detailRow.MC : '暂无' }}</td>
          <th>民族</th>
          <td rowspan="1">{{ detailRow.MZNM ? detailRow.MZNM : '暂无' }}</td>
          <!-- 照片 -->
          <td colspan="1" rowspan="7" width="20%" height="264px" >
            <img :src="'data:image/jpeg;base64,' + dataList.MYDX" alt="" style="width:100%;height: 100%;">
          </td>
        </tr>
        <tr>
          <th>性别</th>
          <td rowspan="1">{{ detailRow.XBNM ? detailRow.XBNM : '暂无' }}</td>
          <th>籍贯</th>
          <td rowspan="1">{{ detailRow.DMNM ? detailRow.DMNM : '暂无' }}</td>
        </tr>
        <tr>
          <th>政治面貌</th>
          <td rowspan="1">{{ detailRow.ZZMMNM ? detailRow.ZZMMNM : '暂无' }}</td>
          <th>出生年月</th>
          <td rowspan="1">{{ detailRow.CSNY ? detailRow.CSNY : '暂无' }}</td>
        </tr>
        <tr>
          <th>文化程度</th>
          <td rowspan="1">{{ detailRow.WHCDNM ? detailRow.WHCDNM : '暂无' }}</td>
          <th>入伍时间</th>
          <td rowspan="1">{{ detailRow.RWSJ ? detailRow.RWSJ : '暂无' }}</td>
        </tr>
        <tr>
          <th>第一学历</th>
          <td rowspan="1">{{ detailRow.DYXL ? detailRow.DYXL : '暂无' }}</td>
          <th>军衔</th>
          <td rowspan="1">{{ detailRow.JXNM ? detailRow.JXNM : '暂无' }}</td>
        </tr>
        <tr>
          <th>级别</th>
          <td rowspan="1">{{ detailRow.ZWJBNM ? detailRow.ZWJBNM : '暂无' }}</td>
          <th>职务</th>
          <td rowspan="1">{{ detailRow.ZWNM ? detailRow.ZWNM : '暂无' }}</td>
        </tr>
        <!-- <tr>
          <th>现职时间</th>
          <td rowspan="1">男</td>
          <th>首长代号</th>
          <td rowspan="1">男</td>
        </tr> -->
        <tr>
          <!-- <th>现岗时间</th>
          <td rowspan="1">男</td> -->
          <th>身份证号</th>
          <td rowspan="1" colspan="3">{{ detailRow.SFZHM ? detailRow.SFZHM : '暂无' }} </td>
        </tr>
        <tr>
          <th>院校培训</th>
          <td rowspan="1" colspan="4" style="text-align:left">{{ detailRow.JSYXPXQK?detailRow.JSYXPXQK:'暂无' }}</td>
        </tr>
        <tr v-if="detailRow.GGRLNM==='指挥员'">
          <th>任职经历</th>
          <td v-if="dataList.ZHY" rowspan="1" colspan="4" style="text-align:left">{{ dataList.ZHY.RZJL?dataList.ZHY.RZJL:'暂无' }}</td>
        </tr>
        <tr>
          <th>参加重大任务情况</th>
          <td rowspan="1" colspan="4" style="text-align:left">{{ detailRow.CJZDRWQK?detailRow.CJZDRWQK:'暂无' }}</td>
        </tr>
        <tr>
          <th>使用武器</th>
          <td v-if="dataList.SYWQ && dataList.SYWQ.length > 0" rowspan="1" colspan="4" style="text-align:left">是否当前使用({{ dataList.SYWQ[0].SFDQSY?dataList.SYWQ[0].SFDQSY:'暂无' }}),装备({{ dataList.SYWQ[0].ZBNM?dataList.SYWQ[0].ZBNM:'暂无' }})</td>
        </tr>
        <tr>
          <th>实弹发射情况</th>
          <td v-if="dataList.SDFSQK && dataList.SDFSQK.length > 0" rowspan="1" colspan="4" style="text-align:left">次数({{ dataList.SDFSQK[0].CS?dataList.SDFSQK[0].CS:'暂无' }}),装备({{ dataList.SDFSQK[0].ZBNM?dataList.SDFSQK[0].ZBNM:'暂无' }}),发射弹药数量（枚）({{ dataList.SDFSQK[0].FSDYSL?dataList.SDFSQK[0].FSDYSL:'暂无' }})</td>
        </tr>
        <tr>
          <th>简述</th>
          <td rowspan="1" colspan="4" style="text-align:left">{{ detailRow.JS?detailRow.JS:'暂无' }}</td>
        </tr>

      </tbody>
    </table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as API from '@/api/index'
export default {
  props: {
    dialogVisible: { type: Boolean, default: () => {} },
    detailRow: { type: Object, default: () => {} }
  },
  data() {
    return {
      detailVisible: this.dialogVisible,
      dataList: []
    }
  },
  watch: {
    dialogVisible(val) {
      this.detailVisible = val
    },
    detailVisible(val) {
      if (!val) {
        this.$emit('handleClose')
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getGGInfo()
    })
  },
  methods: {
    handleClose() {
      this.detailVisible = false
    },
    getGGInfo() {
      const params = {
        sfzhm: this.detailRow.SFZHM
      }
      //const params = {
      //  sfzhm: '220102198103014815'
      //}
      API.getGGInfo(params).then(res => {
        if (res.code === 200) {
          this.dataList = res.data
          this.dataList.MYDX = res.data.MYDX
          console.log(res.data,this.dataList)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-dialog__body{
  height: calc(100vh - 323px);
  padding: 41px;
  overflow: auto;
}
.rightContent {
  display: flex;
  flex-wrap: wrap;
  p {
    width: 25%;
    height: 40px;
    line-height: 40px;
    margin: 0;
  }
}
.yy{
  display:flex;
  justify-content: space-between;
  p{
    width: 25%;
  }
}
</style>
