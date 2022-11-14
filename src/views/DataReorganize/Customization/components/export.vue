<template>
  <div>
    <!-- 导出模态框 -->
    <el-dialog
      title="导出"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showDialog"
      custom-class="qiefen-dialog-class"
      width="30%"
    >
      <el-form ref="qiefenForm" label-position="top" :model="exportFrom">
        <el-form-item label="选择导出方式:">
          <el-radio-group v-model="exportFrom.type">
            <el-radio label="EXCEL">EXCEL</el-radio>
            <el-radio label="WORD">WORD</el-radio>
            <el-radio label="PDF">PDF</el-radio>
            <el-radio label="HTML">HTML</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="childOperation('cancel')">取 消</el-button>
        <el-button type="primary" :disabled="buttonDisabled" @click="childOperation('confirm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import * as API from '@/api/index'
export default {
  name: '',
  props: {
    isShowDialog: {
      type: Boolean,
      default: true
    },
    topicId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      buttonDisabled:false,
      exportFrom: {
        flageType: 'EXCEL',
        type: 'EXCEL'
      },
      showDialog: this.isShowDialog,
      topicIdChilren: this.topicId

    }
  },
  watch: {
    isShowDialog(val) {
      this.showDialog = val
    },

    showDialog(val){
      if(!val){
        this.$emit('changeIsShowDialog')
      }
    }
  },
  methods: {
    showDialogFn(val) {
      this.$emit('changeIsShowDialog', val)// ③组件内对myResult变更后向外部发送事件通知
    },
    // 按钮事件
    childOperation(type) {
      
      if (type === 'confirm') { // 点击确认要执行的代码
        this.buttonDisabled = true
        const props = {
          topicId: this.topicId,
          type: this.exportFrom.type
        }
        API.getExportTopic(props).then((res) => {
          const { msg, code } = res
          if (String(code) === '200') {
            window.open(msg)
            this.exportFrom.type = 'EXCEL'
            this.$message.success('导出成功')
            
            this.showDialogFn(false)
          }
        })
      } else if (type === 'cancel') { // 点击取消要执行的代码
        this.exportFrom.type = 'EXCEL'
        this.showDialogFn(false)
      }
    }
  }
}
</script>

<style lang="" scoped>

</style>
