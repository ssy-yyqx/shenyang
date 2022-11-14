<template>
  <el-dialog
    title="查看部署表"
    :visible.sync="visibleDialogCheck"
    width="66%"
    :close-on-click-modal="false"
    custom-class="qiefen-dialog-class"
  >
    <div class="content">
      <div class="pfdss">
        <!-- <pdf class="pfds" :src="pdfData" /> -->
        <iframe :src="pdfData" width="100%" height="100%" />
      </div>
      <div id="noprint" class="bottom">
        <div class="left">
          <el-button @click="onHandleExport">导出</el-button>
          <!-- <el-button @click="print">打印</el-button> -->
        </div>
        <div class="right">
          <el-button @click="quxiao">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as API from '@/api/index'
// import pdf from 'vue-pdf'
export default {
  // components: { pdf },
  props: {
    'visibleDialogChecks': [Boolean],
    'deploymentTableId': {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visibleDialogCheck: this.visibleDialogChecks,
      pdfData: '',
      type: '',
      dataExportDialogVisible: false,
      exportType: 'EXCEL',
      daochu: ''
    }
  },
  watch: {

    visibleDialogChecks(val) {
      this.visibleDialogCheck = val
    },
    visibleDialogCheck(val) {
      if (!val) {
        this.$emit('visibleDialogCheckFalse')
      }
    }
  },
  created() {
    this.getDeploymentTable()
  },
  methods: {
    onHandleExport() {
      this.getDeploymentTable(this.exportType)
    },
    // 打印
    // print() {
    //   window.print()
    // },
    // 取消
    quxiao() {
      this.$emit('visibleDialogCheckFalse', !this.visibleDialogChecks)
    },
    // 查看部署表信息
    getDeploymentTable(btn) {
      if (btn === undefined) {
        this.type = 'PDF'
      } else {
        this.type = 'EXCEL'
      }
      // console.log(this.type);

      const params = {
        deploymentTableId: this.deploymentTableId,
        type: this.type
      }
      // console.log(params)

      API.getDeploymentTable(params).then(res => {
        // console.log(res)
        if (res.code === 200) {
          if (this.type === 'EXCEL') {
            window.open(res.data)

            this.dataExportDialogVisible = false
          } else {
            this.pdfData = res.data
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@media print {
  #noprint {
    display: none;
  }
  .print {
    display: block;
  }
}
* {
  margin: 0;
  padding: 0;
}
>>> .qiefen-dialog-class{
  width: 70% !important;
  height: 90% !important;
}
>>> .qiefen-dialog-class .el-dialog__body {
  width: 100%;
  padding: 0 0 10px 0 !important;
  height: 100%;
}
.content {
  width: 100%;
  border-radius: 5px;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  position: relative;
  .pfdss{
      width:100%;
      height:93%;
      overflow: auto;
      // .pfds {
      // width:100%;
      // height:100%;
      //   >>> canvas{
      //     height: 100% !important;
      //   }
      // }
    }
  .bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 23px;
    button {
      width: 62px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      margin-top: 9px;
    }
  }
}
</style>
