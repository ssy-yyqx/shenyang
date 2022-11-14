<template>
  <!-- 新增部署信息弹框 -->
  <el-dialog
    :title="titles"
    :visible.sync="addVisibles"
    width="30%"
    custom-class="qiefen-dialog-class"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="部队内码" prop="forceCode">
        <el-input v-model="ruleForm.forceCode" />
      </el-form-item>
      <el-form-item label="部队序号" prop="forceSequence">
        <el-input v-model="ruleForm.forceSequence" />
      </el-form-item>
      <el-form-item label="部队番号" prop="forceName">
        <el-input v-model="ruleForm.forceName" />
      </el-form-item>
      <el-form-item label="IP" prop="ip">
        <el-input v-model="ruleForm.ip" />
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="ruleForm.port" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as API from '@/api/index'
export default {
  props: {
    addVisible: { type: Boolean, default: () => {} },
    title: { type: String, default: '' },
    rowColumn: { type: Object, default: () => {} }
  },
  data() {
    return {
      addVisibles: this.addVisible,
      ruleForm: {
        forceCode: '',
        forceSequence: '',
        forceName: '',
        id: '',
        ip: '',
        port: ''
      },
      rules: {
        forceCode: [
          { required: true, message: '请填写部队内码', trigger: 'blur' }
        ],
        forceSequence: [
          { required: true, message: '请填写部队序号', trigger: 'blur' }
        ],
        forceName: [
          { required: true, message: '请填写部队番号', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请填写IP', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请填写端口', trigger: 'blur' }
        ]
      },
      titles: this.title
    }
  },
  watch: {
    addVisible(val) {
      this.addVisibles = val
    },
    addVisibles(val) {
      if (!val) {
        this.$emit('colseDialog')
      }
    },
    title(val) {
      this.titles = val
    }
  },
  mounted() {
    if (this.titles === '编辑部署表信息') {
      this.ruleForm = this.rowColumn
    }
  },
  methods: {
    // 确定
    confirm() {
      if (this.ruleForm.forceCode === '' || this.ruleForm.forceSequence === '' || this.ruleForm.forceName === '' || this.ruleForm.ip === '' || this.ruleForm.port === '') {
        this.$message.error('请输入信息')
        return
      }
      const data = {
        forceCode: this.ruleForm.forceCode,
        forceSequence: this.ruleForm.forceSequence,
        forceName: this.ruleForm.forceName,
        ip: this.ruleForm.ip,
        port: this.ruleForm.port
      }

      if (this.titles === '编辑部署表信息') {
        this.updateDeploy()
      } else {
        this.insertDeploy(data)
      }
    },
    // 编辑
    updateDeploy() {
      const data = {
        'forceCode': this.rowColumn.forceCode,
        'forceName': this.rowColumn.forceName,
        'forceSequence': this.rowColumn.forceSequence,
        'id': this.rowColumn.id,
        'ip': this.rowColumn.ip,
        'port': this.rowColumn.port
      }
      API.updateDeploy(data).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.addVisibles = false
          this.$emit('getData', data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 新增
    insertDeploy(data) {
      API.insertDeploy(data).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.addVisibles = false
          this.$emit('getData', data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 取消
    handleClose() {
      this.addVisibles = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
