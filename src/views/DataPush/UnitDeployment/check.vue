<template>
  <ContainerSeven>
    <div class="content">
      <pdf class="print" style="width:100%;height: 94%" :src="pdfData" />
      <div id="noprint" class="bottom">
        <div class="left">
          <el-button @click="onHandleExport">导出</el-button>
          <el-button @click="print">打印</el-button>
        </div>
        <div class="right">
          <el-button @click="quxiao">取消</el-button>
        </div>
      </div>

      <el-dialog
        custom-class="qiefen-dialog-class"
        title="数据导出"
        :visible.sync="dataExportDialogVisible"
        width="30%"
      >
        <span>模板类型：</span>
        <el-radio
          v-model="exportType"
          label="EXCEL"
          style="margin-right: 14px;"
        >EXCEL</el-radio>
        <el-radio v-model="exportType" label="XML">XML</el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button
            style="width: 57px;text-align: center;background:#1f7fd8;color: rgba(255, 255, 255);height:31px;line-height: 31px;"
            @click="getDeploymentTable(this)"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </ContainerSeven>
</template>

<script>
import ContainerSeven from '@/components/ContainerSeven'
import * as API from '@/api/index'
import pdf from 'vue-pdf'
export default {
  components: { ContainerSeven, pdf },
  data() {
    return {
      deploymentTableId: '', // 表格ID
      pdfData: '',
      type: '',
      dataExportDialogVisible: false,
      exportType: 'EXCEL'
    }
  },
  created() {
    this.deploymentTableId = this.$route.query.deploymentTableId
    // console.log(this.deploymentTableId)
    this.getDeploymentTable()
  },
  methods: {
    onHandleExport() {
      this.dataExportDialogVisible = true
    },
    // 打印
    print() {
      window.print()
    },
    // 取消
    quxiao() {
      const routeData = this.$router.resolve({
        path: `/DataPush/unitDeployment`
      })
      window.open(routeData.href, '_self')
      window.close()
    },
    // 查看部署表信息
    getDeploymentTable(btn) {
      // console.log(btn);

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
.content {
  width: 50%;
  border-radius: 5px;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  position: relative;
  .top {
    height: 56px;
    line-height: 56px;
    font-size: 15px;
    padding-left: 18px;
    border-bottom: 1px solid #e5e5e5;
  }
  .table2 {
    margin-top: 28px;
    position: relative;
    padding-left: 10px;
    padding-right: 10px;
    min-height: 784px;
    border-bottom: 1px solid #e5e5e5;
    .table-section {
      width: 100%;
      max-height: 280px;
      overflow: scroll;
      overflow-y: auto;
      overflow-x: hidden;
    }
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
