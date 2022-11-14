<template>
  <el-dialog
    title="对比部署表"
    :visible.sync="visibleDialogCompares"
    width="66%"
    :close-on-click-modal="false"
    custom-class="qiefen-dialog-class"
    :before-close="handleClose"
  >
    <div class="PDFS">
      <div v-for="(item,index) in idsData" :key="index">
        <p style="text-align:center;font-weight: bold;font-size:20px;color:#000;margin:0">{{ item.deploymentTableName }}</p>
        <!-- <pdf :src="item.pdfFileName" /> -->
        <iframe :src="item.pdfFileName" width="100%" height="100%" />
      </div>
    </div>
    <div style="margin-bottom: 22px;">
      <p style="font-size:18px">对比结果：</p>
      <div style="height: 185px;overflow: auto;">
        <div v-for="(item,index) in result" :key="index">
          <p style="font-weight: bold;font-size:14px;color:#000">{{ item.iterator }}：</p>
          <ul v-for="(i,ind) in item.resultContent" :key="ind">
            <li v-if="i !== ''">{{ i }}</li>
          </ul>
        </div>
      </div>

    </div>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span> -->
  </el-dialog>
</template>

<script>
// import pdf from 'vue-pdf'
import * as API from '@/api/index'
export default {
  // components: { pdf },
  props: {
    'visibleDialogCompare': [Boolean],
    'ids': {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visibleDialogCompares: this.visibleDialogCompare,
      result: [],
      resultContent: [],
      deploymentTableIds: [],
      idsData: this.ids
    }
  },
  watch: {
    visibleDialogCompare(val) {
      this.visibleDialogCompares = val
    },
    visibleDialogCompares(val) {
      if (!val) {
        this.$emit('visibleDialogComparesFalse')
      }
    }
  },
  mounted() {
    console.log(this.idsData)

    this.getCompare()
  },
  methods: {
    // 取消按钮
    handleClose() {
      this.visibleDialogCompares = false
      this.$emit('visibleDialogComparesFalse', this.visibleDialogCompares, this.ids)
    },
    getCompare() {
      this.deploymentTableIds = this.ids.map(i => {
        return i.deploymentTableIds
      })
      const params = {
        deploymentTableIds: this.deploymentTableIds.toString()
      }
      API.getCompare(params).then(res => {
        // console.log(res.data)
        if (res.code === 200) {
          for (const iterator in res.data) {
            // console.log(iterator, res.data[iterator])
            this.result.push({
              iterator: iterator,
              resultContent: res.data[iterator]
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
canvas{
  height: 100% !important;
}
/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 17px #ffffff;
  background-color: #ffffff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: #fff;
  background-image: -webkit-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.74) 0%,
    rgba(255, 255, 255, 0.74) 25%,
    transparent 100%,
    rgba(255, 255, 255, 0.74) 75%,
    transparent
  );
}
>>> .qiefen-dialog-class{
  width: 80% !important;
  height: 80% !important;
}
>>> .qiefen-dialog-class .el-dialog__body {
  width: 100%;
  height: 100%;
}
.PDFS{
  width: 100%;
  height: calc(100vh - 486px);
  overflow: auto;
  border-bottom: 1px solid #e8e8e8;
  div{
    height: 100%;
    margin-bottom: 68px;
  }
}
</style>
