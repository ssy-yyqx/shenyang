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
    <div style="display:flex;padding: 18px 0 36px 0;border-bottom: 1px solid #eee;">
      <div class="left" style="width: 14%;height: 192px;">
        <img :src="dataList.MYDX?dataList.MYDX:'暂无' " alt="" style="width:100%;height: 100%;">
      </div>
      <div class="right" style="flex:1;margin-left:30px;">
        <div class="rightContent" style="display: flex;flex-wrap: wrap;">
          <p>姓名：{{ detailRow.MC ? detailRow.MC : '暂无' }}</p>
          <p>性别：{{ detailRow.XBNM ? detailRow.XBNM : '暂无' }}</p>
          <p>民族：{{ detailRow.MZNM ? detailRow.MZNM : '暂无' }}</p>
          <p>地名：{{ detailRow.DMNM ? detailRow.DMNM : '暂无' }}</p>
          <p>出生年月：{{ detailRow.CSNY ? detailRow.CSNY : '暂无' }}</p>
          <p>文化程度：{{ detailRow.WHCDNM ? detailRow.WHCDNM : '暂无' }}</p>
          <p>政治面貌：{{ detailRow.ZZMMNM ? detailRow.ZZMMNM : '暂无' }}</p>
          <p>身份证号码：{{ detailRow.SFZHM ? detailRow.SFZHM : '暂无' }}</p>
          <p>第一学历(全日制)：{{ detailRow.DYXL ? detailRow.DYXL : '暂无' }}</p>
          <p>军衔：{{ detailRow.JXNM ? detailRow.JXNM : '暂无' }}</p>
          <p>职务级别：{{ detailRow.ZWJBNM ? detailRow.ZWJBNM : '暂无' }}</p>
          <p>职务：{{ detailRow.ZWNM ? detailRow.ZWNM : '暂无' }}</p>
          <p>关键岗位人员类别：{{ detailRow.GGRLNM ? detailRow.GGRLNM : '暂无' }}</p>
          <p>入伍时间：{{ detailRow.RWSJ ? detailRow.RWSJ : '暂无' }}</p>
          <p>任现技术职级时间：{{ detailRow.RXJSZJSJ ? detailRow.RXJSZJSJ : '暂无' }}</p>
          <p>任现职级时间：{{ detailRow.RXZJSJ ? detailRow.RXZJSJ : '暂无' }}</p>
          <p>任现职务时间：{{ detailRow.RXZWSJ ? detailRow.RXZWSJ : '暂无' }}</p>
          <p>数据来源：{{ detailRow.SJLY ? detailRow.SJLY : '暂无' }}</p>
          <p>数据时间：{{ detailRow.SJSJ ? detailRow.SJSJ : '暂无' }}</p>
          <p>文件名：{{ dataList.WJM ? dataList.WJM : '暂无' }}</p>
        </div>
      </div>
    </div>
    <!-- 根据类型（GGRLNM 01 指挥员 02 舰艇长 03 飞行员 04 导弹营长）展示一下内容 -->
    <div v-if="detailRow.GGRLNM==='指挥员'" style="padding: 18px 0px;border-bottom: 1px solid rgba(238, 238, 238);">
      <div class="top" style="font-weight:bold;margin:0;height: 25px;">指挥员</div>
      <div class="yy">
        <p>任现职级时间：{{ dataList.ZHY.RXZJSJ?dataList.ZHY.RXZJSJ:'暂无' }}</p>
        <p>职务：{{ dataList.ZHY.ZWNM?dataList.ZHY.ZWNM:'暂无' }}</p>
        <p>首长代号: {{ dataList.ZHY.SZDH?dataList.ZHY.SZDH:'暂无' }}</p>
        <p>现岗时间: {{ dataList.ZHY.XGSJ?dataList.ZHY.XGSJ:'暂无' }}</p>
        <p>任职经历: {{ dataList.ZHY.RZJL?dataList.ZHY.RZJL:'暂无' }}</p>
      </div>
    </div>
    <div v-if="detailRow.GGRLNM==='舰艇长'" style="padding: 18px 0px;border-bottom: 1px solid rgba(238, 238, 238);">
      <div class="top" style="font-weight:bold;margin:0;height: 25px;">舰艇长、任职舰艇</div>
      <div class="yy">
        <p>舰长训练等级: {{ dataList.JTZ.ZZXLNM?dataList.JTZ.ZZXLNM:'暂无' }}</p>
        <p>是否当前任职：{{ dataList.RZJT.SFDQRZ?dataList.RZJT.SFDQRZ:'暂无' }}</p>
        <p>舰艇舷号: {{ dataList.RZJT.JTXHNM?dataList.RZJT.JTXHNM:'暂无' }}</p>
      </div>
    </div>
    <div v-if="detailRow.GGRLNM==='飞行员'" style="padding: 18px 0px;border-bottom: 1px solid rgba(238, 238, 238);">
      <div class="top" style="font-weight:bold;margin:0;height: 25px;">飞行员</div>
      <div class="yy">
        <p>飞行技术内码: {{ dataList.FXY.FXJSNM?dataList.FXY.FXJSNM:'暂无' }}</p>
        <p>现驾机型时间（小时）：{{ dataList.FXY.XJJXSJ?dataList.FXY.XJJXSJ:'暂无' }}</p>
        <p>飞行员代号: {{ dataList.FXY.FXYDH?dataList.FXY.FXYDH:'暂无' }}</p>
        <p>飞行水平: {{ dataList.FXY.FXSPNM?dataList.FXY.FXSPNM:'暂无' }}</p>
        <p>飞行总时间（小时）: {{ dataList.FXY.FXZSJ?dataList.FXY.FXZSJ:'暂无' }}</p>
      </div>
    </div>
    <div v-if="detailRow.GGRLNM==='导弹营长'" style="padding: 18px 0px;border-bottom: 1px solid rgba(238, 238, 238);">
      <div class="top" style="font-weight:bold;margin:0;height: 25px;">导弹营长</div>
      <div class="yy">
        <p>训练等级: {{ dataList.DDFSYZ.XLDJNM?dataList.DDFSYZ.XLDJNM:'暂无' }}</p>
      </div>
    </div>

    <div style="padding: 18px 0px;border-bottom: 1px solid rgba(238, 238, 238);">
      <p class="top" style="font-weight:bold;margin:0;height: 25px;">接受院校培训情况</p>
      <div class="bottom" style="white-space: pre-wrap;line-height:24px;">{{ detailRow.JSYXPXQK?detailRow.JSYXPXQK:'暂无' }}</div>
    </div>
    <div style="padding: 18px 0px;border-bottom: 1px solid rgba(238, 238, 238);">
      <p class="top" style="font-weight:bold;margin:0;height: 25px;">参加重大任务行动情况</p>
      <div class="bottom" style="white-space: pre-wrap;line-height:24px;">{{ detailRow.CJZDRWQK?detailRow.CJZDRWQK:'暂无' }}</div>
    </div>
    <div style="padding: 18px 0px;border-bottom: 1px solid rgba(238, 238, 238);">
      <p class="top" style="font-weight:bold;margin:0;height: 25px;">使用武器</p>
      <el-table
        :data="dataList.SYWQ"
        stripe
        border
      >
        <el-table-column
          prop="SFDQSY"
          label="是否当前使用"
          align="center"
        />
        <el-table-column
          prop="ZBNM"
          label="装备"
          align="center"
        />
      </el-table>
    </div>
    <div style="padding: 18px 0px;border-bottom: 1px solid rgba(238, 238, 238);">
      <p class="top" style="font-weight:bold;margin:0;height: 25px;">实弹发射情况</p>
      <el-table
        :data="dataList.SDFSQK"
        stripe
        border
      >
        <el-table-column
          prop="CS"
          label="次数"
          align="center"
        />
        <el-table-column
          prop="ZBNM"
          label="装备"
          align="center"
        />
        <el-table-column
          prop="FSDYSL"
          label="发射弹药数量（枚）"
          align="center"
        />
      </el-table>
    </div>
    <div style="padding: 18px 0px;border-bottom: 1px solid rgba(238, 238, 238);">
      <p class="top" style="font-weight:bold;margin:0;height: 25px;">简述</p>
      <div class="bottom" style="white-space: pre-wrap;line-height:24px;">{{ detailRow.JS?detailRow.JS:'暂无' }}</div>
    </div>

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
      dataList: {}
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
    this.getGGInfo()
  },
  methods: {
    handleClose() {
      this.detailVisible = false
    },
    getGGInfo() {
      // const params = {
      //   sfzhm: this.detailRow.SFZHM
      // }
      const params = {
        sfzhm: '220102198103014815'
      }
      API.getGGInfo(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.dataList = res.data
          this.dataList.MYDX = 'data:image/jpeg;base64,' + res.data.MYDX
          console.log(this.dataList)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-dialog__body{
  height: calc(100vh - 175px);
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
