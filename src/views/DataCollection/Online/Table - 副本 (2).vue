<template>
  <div class="total-section">
    <div class="top-section">
      <div v-if="formList.length > 0" class="toolbar-section">
        <el-col :span="20">
          <!-- <el-button size="small" class="btnStyle" icon="el-icon-plus" @click="onHandleAdd">新增</el-button>
          <el-button size="small" class="btnStyle" icon="el-icon-edit" @click="onHandleEdit">修改</el-button> -->
          <!-- <el-button size="small" class="btnStyle" icon="el-icon-delete" @click="onHandleDelete">删除</el-button> -->
          <el-button
            size="mini"
            icon="el-icon-minus"
            class="btnStyle el-button el-button--danger is-plain"
            @click="onHandleDelete"
          >删除</el-button>
          <el-button
            size="small"
            icon="el-icon-s-fold"
            class="btnStyle el-button el-button--primary is-plain"
            @click="onHandleImport"
          >导入</el-button>
          <el-button
            size="small"
            icon="el-icon-s-unfold"
            class="btnStyle el-button el-button--primary is-plain"
            @click="onHandleExport"
          >导出</el-button>

          <el-button
            size="small"
            icon="el-icon-s-unfold"
            class="btnStyle el-button el-button--primary is-plain"
            @click="onHandleTemplate"
          >模板下载</el-button>

          <el-button
            size="small"
            icon="el-icon-s-unfold"
            class="btnStyle el-button el-button--primary is-plain"
            @click="dataReport"
          >数据上报</el-button>
        </el-col>
      </div>
      <div class="table-section">
        <el-table
          :data="tableData"
          stripe
          border
          height="100%"
          style="width: 100%"
          :header-cell-style="{ background: '#1F7FD8', color: '#F8F8F8' }"
          @selection-change="handleSelectionChange"
          @row-click="onHandleEdit"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column
            v-for="(column, index) in tabHeadList"
            :key="index"
            align="center"
            :type="column.columnDataType"
            :prop="column.columnName"
            :label="column.columnComment"
            show-overflow-tooltip
            :render-header="renderHeader"
          />
          <!-- <el-table-column label="操作" align="left" width="50">
            <template slot-scope="scope">
              <el-button class="aStyle" type="text" size="mini" @click="onHandleEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="pager-section">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog
        :visible.sync="oldUploadFormVisible"
        :close-on-click-modal="false"
        :title="importFormTitle"
        :before-close="handleCloseImportForm"
        width="30%"
      >
        <el-form v-model="uplodeObj">
          <div class="upload-section">
            <el-upload
              ref="upload"
              action="/upgrade/importExportData/importData"
              accept=".xls,.xlsx,.zip"
              class="upload-demo"
              drag
              :on-remove="onRemove"
              :file-list="fileList"
              :auto-upload="false"
              :on-change="onChange"
              :on-success="onSuccess"
              :data="{
                fileType: 'excel',
                updateSupport: 'true',
                tableName: this.tableName,
              }"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip" style="text-align:center;">仅上传不超过50MB文件</div>
              <div slot="tip" class="el-upload__tip">
                提示：仅允许导入“xls”、“xlsx”或“zip”格式文件！
              </div>
            </el-upload>
            <div>
              <el-button
                style="margin-top: 20px"
                size="small"
                type="success"
                @click="submitUpload"
              >上 传</el-button>
              <!-- <el-button
                style="margin-top: 20px"
                size="small"
                type="primary"
                :disabled="disabledButton"
                @click="submitUpload"
              >下 载</el-button> -->
            </div>
          </div>
          <!-- <div style="position: relative; top: 150px;">
              <el-checkbox  v-model="uplodeObj.updateSupport"/>是否更新已经存在的用户数据<a style="color: #454545;font-weight: bold" @click="onHandleTemplate">下载模板</a><br/>
              <p style="color: red;font-weight: bold">提示：仅允许导入“xls”或“xlsx”格式文件！</p>
            </div> -->
        </el-form>
      </el-dialog>
      <el-dialog
        custom-class="qiefen-dialog-class"
        title="模板下载"
        :visible.sync="templateDialogVisible"
        width="30%"
      >
        <span>模板类型：</span>
        <el-radio v-model="templateType" label="EXCEL">EXCEL</el-radio>
        <el-radio v-model="templateType" label="XML">XML</el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button
            style="background: #1f7fd8; color: #fff"
            @click="downloadTemplate"
          >确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        custom-class="qiefen-dialog-class"
        title="数据导出"
        :visible.sync="dataExportDialogVisible"
        width="30%"
      >
        <span>模板类型：</span>
        <el-radio v-model="exportType" label="EXCEL">EXCEL</el-radio>
        <el-radio v-model="exportType" label="XML">XML</el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button
            style="background: #1f7fd8; color: #fff"
            @click="downloadData"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      :visible.sync="dialogfiltration"
      width="30%"
      :before-close="Closefiltration"
    >
      <div v-if="dialogfiltration">
        <FormGenerate
          ref="tableForm"
          :tab="categoryId"
          :form-list="filtrationList"
          :force-code="forceCode"
          :equipment-code="equipmentCode"
          :is-edit="true"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogfiltration = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </span>
      <!-- <el-form :inline="true" :model="formInline">
        <el-form-item>
          <el-input
            v-model="formInline.user"
            placeholder="输入过滤数据"
            style="width: 100%"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form> -->
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/index'
import { mapGetters } from 'vuex'
import FormGenerate from './components/FormGenerate.vue'
import axios from 'axios'
import { download } from './dom.js'

export default {
  components: { FormGenerate },
  props: {
    tableName: {
      type: String,
      default: undefined
    },
    tableComment: {
      type: String,
      default: undefined
    },
    BDNM: {
      type: String
    },
    tabList: {
      type: Array,
      default: []
    },
    tabHeadList: {
      type: Array,
      default: []
    },
    total: {
      type: Number
    },
    formList: {
      type: Array,
      default: []
    },
    // fileList: {
    //   type: Array
    // },
    dataType: {
      type: String,
      default: ''
    },
    forceCode: {
      type: String,
      default: ''
    },
    categoryId: {
      type: String,
      default: ''
    },
    equipmentCode: {
      type: String,
      default: ''
    },
    isTabClick: {
      type: Boolean,
      default: false
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgSize:Number,
      fileList: [],
      fileData: {},
      fileName: '',
      importFormTitle: '上传数据',
      uplodeObj: {
        file: []
      },
      XMLurl: '',
      formInline: {},
      dialogfiltration: false,
      form: {},
      tableData: [],
      columns: [],
      // 分页
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 15, 20, 30],
      // 被选中的行
      selectedRows: [],
      dataExportDialogVisible: false,
      templateDialogVisible: false,
      templateType: 'EXCEL',
      exportType: 'EXCEL',
      columnKey: {},
      filtrationList: [],
      sortDataPage: {},
      oldUploadFormVisible: false
    }
  },
  watch: {
    onlineCollectionTableData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.columns = newVal.columns
        }
      },
      immediate: true,
      deep: true
    },
    onlineCollectionUploadFormVisible: {
      handler(newVal, oldVal) {
        console.log(newVal)
        this.oldUploadFormVisible = newVal
      },
      immediate: true,
      deep: true
    },
    tabList: {
      handler: function(val) {
        this.tableData = val
        if (this.tableData[0]) {
          this.$emit('onHandleEdit', this.tableData[0])
        }
      },
      immediate: true,
      deep: true
    },

    current: {
      handler(newVal, oldVal) {
        if (this.current) {
          this.currentPage = 1
        }
      },
      immediate: true,
      deep: true
    }
  },

  computeds: {
    uploadData() {
      return { fileName: this.fileName }
    },
    ...mapGetters([
      'onlineCollectionTableData',
      'onlineCollectionDialogVisible',
      'onlineCollectionUploadFormVisible'
    ])
  },
  methods: {
    onSubmit() {
      this.dialogfiltration = false
      const formData = this.$refs.tableForm.getFormData()
      this.$refs.tableForm.isValidate().then((valid) => {
        if (valid) {
          const sortData = {}

          this.getTableData(formData, sortData)
        }
      })
    },
    Closefiltration() {
      this.dialogfiltration = false
    },
    renderHeader(h, { column, $index }) {
      const l = column.label.length
      const f = 16
      column.minWidth = f * (l + 3)

      if (column.label == '历史沿革' || column.label == '媒体对象') {
        return h(
          'div',
          {
            style: 'white-space:nowrap;width:100%'
          },
          [
            h(
              'p',
              {
                style: 'display:inline-block'
              },
              column.label
            )
          ]
        )
      } else {
        return h(
          'div',
          {
            style: 'white-space:nowrap;width:100%'
          },
          [
            h(
              'p',
              {
                style: 'display:inline-block'
              },
              column.label
            ),
            h('div', {
              style: 'display: inline-block; position: relative; top: 3px;'
            }, [
              h('i', {
                class: 'el-icon-caret-top',
                style: 'display: block; line-height: 0.5;',
                on: {
                  click: () => {
                    this.RowcaretTop(column, $index)
                  }
                }
              }),
              h('i', {
                class: 'el-icon-caret-bottom',
                style: 'display: block; line-height: 0.5;',
                on: {
                  click: () => {
                    this.RowcaretBottom(column, $index)
                  }
                }
              })
            ]),

            h('i', {
              class: 'el-icon-data-analysis',
              on: {
                click: () => {
                  this.Rowdataanalysis(column, $index)
                }
              }
            })
          ]
        )
      }
    },
    // 升序
    RowcaretTop(column, index) {
      const sortData = {}
      const data = {}

      this.$emit('isTabClick', true)
      sortData[column.property] = 'ASC'
      this.sortDataPage = sortData
      this.getTableData(data, sortData)
    },
    // 降序
    RowcaretBottom(column, index) {
      const sortData = {}
      const data = {}

      this.$emit('isTabClick', true)
      sortData[column.property] = 'DESC'
      this.sortDataPage = sortData
      this.getTableData(data, sortData)
    },
    // 过滤
    Rowdataanalysis(column, index) {
      this.dialogfiltration = true
      this.columnKey = column
      this.filtrationList = []
      if (this.formList.find((e) => e.columnName == column.property + '_KEY')) {
        this.filtrationList.push(
          this.formList.find((e) => e.columnName == column.property + '_KEY')
        )
      }
      if (this.formList.find((e) => e.columnName == column.property)) {
        this.filtrationList.push(
          this.formList.find((e) => e.columnName == column.property)
        )
      }
    },
    onHandleEdit(row) {
      this.$emit('onHandleEdit', row)
    },
    handleCloseImportForm() {
      this.$store.dispatch('setOCUploadFormVisible', false)
      this.oldUploadFormVisible = false
      this.fileList = []
    },
    onHandleImport() {
      this.fileList = []
      this.$store.dispatch('setOCUploadFormVisible', true)
      this.oldUploadFormVisible = true
    },
    handleCloseAddOrUpdateForm() {
      this.$store.dispatch('setOCDialogVisible', false)
    },
    // 获取表格数据
    getTableData(data, sortData) {
      var props = {

      }
      if (this.isTabClick) {
        props = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          tableName: this.tableName,
          dataType: this.dataType,
          forceCode: this.forceCode,
          categoryId: this.categoryId,
          equipmentCode: this.equipmentCode,
          data: data || {},
          sortData: sortData || this.sortDataPage
        }
      } else {
        props = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          tableName: this.tableName,
          dataType: this.dataType,
          forceCode: this.forceCode,
          categoryId: this.categoryId,
          equipmentCode: this.equipmentCode,
          data: data || {}

        }
      }
      if (this.BDNM !== undefined) {
        props = Object.assign({}, props, this.BDNM)
      }
      API.getOnLineTableList(props).then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          this.tableData = data.list
          this.total = data.total
          if (data.list[0]) {
            this.$emit('onHandleEdit', data.list[0])
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.selectedRows = val
      this.$emit('handleSelectionChange', val)
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val

      this.getTableData()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('isCurrent')
      console.log('handleCurrentChange', this.currentPage)
      this.getTableData()
    },
    // 上传
    submitUpload() {
      console.log('000')
      if(this.imgSize > 50){
        this.$message({
          message: '上传文件不能超过50MB',
          type: 'warning'
        });
        return
      }
      this.$refs.upload.submit()
      this.getTableData()
    },
    onHandleExport() {
      this.dataExportDialogVisible = true
    },
    downloadData() {
      const selectUnique = []
      this.selectedRows.forEach((item) => {
        selectUnique.push(item.UNIQUE)
      })
      var props = {
        tableName: this.tableName,
        type: this.exportType,
        querys: selectUnique
      }
      console.log(props)
      API.collectionDataExport(props).then((res) => {
        const { code, msg, data } = res
        if (code === 200) {
          window.open(data)
          this.dataExportDialogVisible = false
          this.$refs.multipleTable.clearSelectionFun()
        } else {
          this.$message.error(msg)
        }
      })
    },
    onHandleTemplate() {
      this.templateDialogVisible = true
    },
    // 数据上报
    dataReport() {
      const props = {
        tableNames: [this.tableName]
      }
      //console.log(props)
      API.getSubmit(props).then((res) => {
        //console.log(res)
        if(res.code===200){
          this.$message.success(res.msg)
        }else {
          this.$message.error(res.msg)
        }
      })
    },
    downloadTemplate() {
      //var props = {
      //  // TODO  选择导出文件类型
      //  // tableComment: this.tableComment,
      //  tableName: this.tableName,
      //  type: this.templateType
      //}
      //API.templateDownload(props).then((res) => {
      //  const { code, msg, data } = res
      //  if (code === 200) {
      //    if (this.templateType === 'XML') {
      //      // this.XMLurl = data
      //      this.downloadUrlFile(data)
      //    } else {
      //      window.open(data)
      //    }
      //    this.templateDialogVisible = false
      //  } else {
      //    this.$message.error(msg)
      //  }
      //})
      this.onHandleDownLoad()
    },
    onHandleDownLoad(){
      // 防止下载文件时直接打开
      function fileAjax(url,callback,options){
        const xhr = new XMLHttpRequest()
        xhr.open('get',url,true)
        if(options.responseType){
          xhr.responseType = options.responseType
        }
        xhr.onreadystatechange = function(){
          if(xhr.readyState === 4 && xhr.status === 200){
            callback(xhr)
          }
        }
        xhr.send()
      }
      function downloadFile(content,filename){
        window.URL = window.URL || window.webkitURL
        const a = document.createElement('a')
        const blob = new Blob([content])
        // 二进制创建url
        const url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = filename
        a.click()
        // 销毁创建的url
        window.URL.revokeObjectURL(url)
      }
      const params = {
        tableName:this.tableName,
        type:this.templateType
      }
      API.templateDownload(params).then(res=>{
        const { code,rows,msg,total } = res
        if(String(code) === '200'){
          const url = `${res.data}`
          const name = res.data.substring(res.data.lastIndexOf('/')+1,res.data.length)  // 文件名称
          // 发送http请求,将文件链接转化为文件流
          fileAjax(
            url,
            function(xhr){
              downloadFile(xhr.response,name)
            },
            {
              responseType:'blob'
            }
          )
          this.templateDialogVisible = false
        }else {
          this.$message.error(msg)
        }
      })
    },
    downloadUrlFile(data) {
      axios.get(data, {
        headers: { 'Content-Disposition': 'attachment;filename=xmlmb.xml', 'Content-Type': 'application/x-download' }

      }).then((res) => {
        const name = res.config.url.split('/')
        download(res.data, name[name.length - 1].replace('.xml', ''), 'text/xml')
      })
    },
    // 批量删除
    onHandleDelete() {
      if (this.selectedRows.length < 1) {
        this.$message.warning('请选择数据')
        return
      }
      const unique = []
      this.selectedRows.forEach((item) => {
        unique.push(item.UNIQUE)
      })
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          data: unique,
          tableName: this.tableName
        }
        API.deleteOnLineTableList(params).then((res) => {
          const { code } = res
          if (code === 200) {
            this.$message.success('数据批量成功')
            this.$emit('deleteOnLineTableList', true)
          } else {
            this.$message.error('数据批量失败')
          }
        })
      })
    },
    // 刷新
    onHandleRefresh() {
      this.getTableData()
    },
    // 新增
    onHandleAdd() {
      this.dialogType = 'add'
      this.form = Object.assign({}, { file: [] })
      if (this.field !== undefined) {
        this.form = Object.assign({}, this.form, { BDNM: this.BDNM })
      }
      this.$store.dispatch('setOCDialogVisible', true)
      this.uploadFileUrl = API.saveOnlineInfoUrl
    },
    // // 修改
    // onHandleEdit() {
    //   if (this.selectedRows.length < 1) {
    //     this.$message.warning('请选择数据')
    //     return
    //   } else if (this.selectedRows.length > 1) {
    //     this.$message.warning('只能勾选一行修改')
    //     return
    //   }
    //   this.dialogType = 'edit'
    //   this.form = Object.assign({}, this.selectedRows[0], { file: [] })
    //   if (this.field !== undefined) {
    //     this.form = Object.assign({}, this.form, { BDNM: this.BDNM })
    //   }
    //   this.$store.dispatch('setOCDialogVisible', true)
    //   this.uploadFileUrl = API.updateOnlineInfoUrl
    // },
    uploadRemove(file, fileList) {
      const index = this.form.file.indexOf(file.raw)
      this.form.file.splice(index, 1)
    },
    uploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.msgSuccess('上传成功')
        this.getTableData()
      }
      this.form.file = fileList
    },
    handleChange(file, fileList) {
      if (file.status === 'ready') {
        this.form.file.push(file.raw)
      }
    },
    onRemove(file, fileList) {
      const index = this.uplodeObj.file.indexOf(file.raw)
      this.uplodeObj.file.splice(index, 1)
    },
    onSuccess(response, file, fileList) {
      console.log('+++++++', fileList)

      if (response.code === 200) {
        this.$message.success('上传成功')
      } else {
        this.$message.error(response.msg)
        if (response.data) {
          window.open(response.data)
        }
      }
      this.handleCloseImportForm()

      console.log('+++++++', fileList)
      this.uplodeObj.file = fileList
    },

    onChange(file, fileList) {
      this.imgSize = Number(file.size/1024/1024)
      if (file.status === 'ready') {
        this.uplodeObj.file = []
        this.uplodeObj.file.push(file.raw)
      }
    },
    clearForm() {
      this.uplodeObj = {}
      this.uploadFormVisible = false
    }
    // onSaveImport() {
    //   if (this.uplodeObj.file.length === 0) {
    //     this.msgWarning('请添加文件')
    //     return
    //   } else {
    //     this.$store.dispatch('setOCUploadFormVisible', false)
    //     this.uplodeObj = Object.assign({}, this.uplodeObj, { tableName: this.tableName })
    //     axios.post(API.infoImportUrl, this.uploadTool(this.uplodeObj), {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     })
    //       .then(res => {
    //         const { code, msg } = res.data
    //         if (code === 200) {
    //           this.msgSuccess(msg)
    //           this.getTableData()
    //         } else {
    //           this.$message.error(msg)
    //         }
    //       })
    //       .catch(err => {
    //         console.log(err)
    //       })
    //   }
    // },
    // onHandleSave() {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       this.$store.dispatch('setOCDialogVisible', false)
    //       const formData = new FormData()
    //       formData.set('tableName', this.tableName)
    //       formData.set('file', this.form.file)
    //       delete this.form.file
    //       formData.set('data', JSON.stringify(this.form))
    //       if (this.dialogType === 'add') {
    //         axios.post(API.saveOnlineInfoUrl, formData, {
    //           headers: {
    //             'Content-Type': 'multipart/form-data'
    //           }
    //         })
    //         .then(res => {
    //           const { code, data, msg } = res
    //           if (code === 200) {
    //             this.msgSuccess(msg)
    //             this.getTableData()
    //           } else {
    //             this.$message.error(msg)
    //           }
    //         })
    //         .catch(err => {
    //         })
    //       } else if (this.dialogType === 'edit') {
    //         axios.post(API.updateOnlineInfoUrl, formData, {
    //           headers: {
    //             'Content-Type': 'multipart/form-data'
    //           }
    //         })
    //         .then(res => {
    //           const { code, data, msg } = res
    //           if (code === 200) {
    //             this.msgSuccess(msg)
    //             this.getTableData()
    //           } else {
    //             this.$message.error(msg)
    //           }
    //         })
    //         .catch(err => {
    //         })
    //       }
    //     }
    //   })
    // },
    // uploadTool(data) {
    //   const body = new FormData()
    //   Object.keys(data).forEach(key => {
    //     if (key === 'file') {
    //       for (const val of data[key]) {
    //         body.append(key, val)
    //       }
    //     } else {
    //       body.append(key, data[key])
    //     }
    //   })
    //   return body
    // }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload-list.el-upload-list--text {
  position: relative;
  width: 100%;
  top: -45px;
  right: -87px;
  width: 250px;
}
::v-deep .upload-demo {
  height: 32px;
}
::v-deep .el-dialog {
  width: 400px;
  height: 372px;
}

.btnStyle {
  margin: 5px 10px;
}
.domStyle {
  padding-top: 19px;
}
.componentStype {
  width: 250px;
}
.total-section {
  border: none;
  height: 100%;
  width: 100%;
  .top-section {
    width: 100%;
    height: 100%;
    position: relative;
    .toolbar-section {
      height: 50px;
      width: 100%;
    }
    .table-section {
      height: 70%;
      width: 100%;
      padding-left: 10px;
      padding-right: 10px;
    }
    .pager-section {
      margin-top: 8px;
      text-align: right;
      float: right;
    }
  }
  .bottom-section {
    //margin-top: 5px;
    width: 100%;
    height: 200px;
    border-top: 1px solid #eff0f3;
    .topper {
      width: 100%;
      height: calc(100% - 10px);
      overflow-y: auto;
    }
    .footer {
      height: 10px;
      text-align: center;
    }
  }
}
.upload-section {
  text-align: center;
}
.SubmitButton {
  float: right;
  margin-bottom: 50px;
}
</style>
