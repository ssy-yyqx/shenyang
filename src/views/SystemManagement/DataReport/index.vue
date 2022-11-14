<template>
  <Container>
    <div class="container">
      <!-- :on-change="handleChange" -->
      <el-upload
        ref="upload"
        :data="{updateSupport:true,tableName:''}"
        accept=".xls,.xlsx,.zip"
        class="upload-demo"
        drag
        :on-remove="onRemove"
        :on-success="onSuccess"
        :auto-upload="false"
        :on-change="handleChange"
        :file-list="fileList"
        action="/upgrade/importExportData/importData"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip" style="text-align:center;">仅上传不超过50MB文件</div>
        <div slot="tip" class="el-upload__tip" style="text-align:center;color:red;">提示：仅允许导入“xls”、“xlsx”或“zip”格式文件！</div>

      </el-upload>
      <el-button type="success" style="margin-top:20px;" @click="dataUpload">上 传</el-button>
    </div>
  </Container>
</template>

<script>
// import * as API from '@/api/index'
import Container from '@/components/Container'
export default {
  components: { Container },
  data() {
    return {
      fileList: [],
      uplodeObj: {
        file: ''
      },
      imgSize: Number
    }
  },
  methods: {
    // 数据上传
    dataUpload(e) {
      if (this.imgSize > 50) {
        this.$message({
          message: '上传文件不能超过50MB',
          type: 'warning'
        })
        return
      }
      this.$refs.upload.submit()
      // this.getTableData()
    },
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.imgSize = Number(file.size / 1024 / 1024)
      this.fileList = [fileList[fileList.length - 1]]
    },
    onRemove(file, fileList) {
      const index = this.uplodeObj.file.indexOf(file.raw)
      this.uplodeObj.file.splice(index, 1)
    },
    onSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$message.success('上传成功')
      } else {
        this.$message.error(response.msg)
        if (response.data) {
          window.open(response.data)
        }
      }

      this.uplodeObj.file = fileList
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .upload-demo{
    >>> .el-upload-dragger{
      background-color: cornflowerblue;
    }
    .el-upload__text{
      color: black;
      em{
        color: crimson;
      }
    }
  }

}
</style>

