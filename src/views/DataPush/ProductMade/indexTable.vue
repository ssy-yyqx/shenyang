<template>
  <div class="conT">
    <div class="content" v-loading="loading2"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      style="margin-bottom:12px;height:100%;width:100%;">
      <el-card shadow="never">
        <div class="con">
          <div class="queryCondition">
            <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="5" style="margin-right:60px">
                  <el-form-item label="名称:" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="opreation-btn">
                  <el-button type="primary" @click="queryTableData()">查询</el-button>
                  <el-button :disabled="form.name === ''" @click="resetQuery()">重置</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="buttons">
            <el-button size="medium" @click="addData">
              <i class="el-icon-plus addButtonIcon" />新增数据产品
            </el-button>
            <el-button
              size="medium"
              :disabled="selectedRows.length === 0"
              @click="deleteTableData()"
            >
              <i class="el-icon-close deleteButtonIcon" />删除
            </el-button>
          </div>
          <div class="table-section">
            <el-table
              :data="tableData"
              stripe
              height="612px"
              border
              style="width: 100%;"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="产品名称" prop="productName" align="center" />
              <el-table-column label="产品描述" prop="productDescribe" align="center" />
              <el-table-column label="生成用户" prop="createBy" align="center" />
              <el-table-column label="生成时间" prop="createTime" align="center" />
              <el-table-column label="文件名称" prop="wordName" align="center" />
              <el-table-column label="操作" align="center" width="350" fixed="right">
                <template slot-scope="scope">
                  <el-link type="primary" :underline="false" @click="onHandleView(scope.row)">详情</el-link>
                  <label class="seprate">&nbsp;|&nbsp;</label>
                  <el-link type="primary" :underline="false" @click="onHandleEdit(scope.row)">编辑</el-link>
                  <label class="seprate">&nbsp;|&nbsp;</label>
                  <el-link type="primary" :underline="false" @click="onHandleDownLoad(scope.row)">下载</el-link>
                  <label class="seprate">&nbsp;|&nbsp;</label>
                  <el-link type="primary" :underline="false" @click="onHandlePublish(scope.row)">发布</el-link>
                  <label class="seprate">&nbsp;|&nbsp;</label>
                  <el-link type="primary" :underline="false" @click="deleteTableData(scope.row)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pager-section" style="display: flex; justify-content: flex-end;margin-top: 9px;">
            <el-pagination
              :current-page="pager.currentPage"
              :page-sizes="pager.pageSizes"
              :page-size="pager.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pager.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog :visible.sync="isShowViewPdf" width="60%">
      <div>
        <pdf v-for="i in pdf.pageCount" :key="i" :src="pdf.src" :page="i" />
      </div>
    </el-dialog>

    <el-dialog
      custom-class="qiefen-dialog-class"
      title="下载"
      :visible.sync="dataExportDialogVisible"
    >
      <span>模板类型：</span>
      <el-radio v-model="exportType" label="PDF">PDF</el-radio>
      <el-radio v-model="exportType" label="WORD">WORD</el-radio>
      <el-radio v-model="exportType" label="HTML">HTML</el-radio>
      <el-radio v-model="exportType" label="EXCEL">EXCEL</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button
          style="background: #1f7fd8; color: #fff"
          @click="downloadData"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/index'
import pdf from 'vue-pdf'
import bus from '@/utils/bus'
export default {
  components: { pdf },
  data() {
    return {
      loading2:false,
      downloadDatas:{},
      PublishDatas:{},
      exportType:'',
      publishType:'',
      dataExportDialogVisible:false, // 下载弹出框
      form: {
        name: ''
      },
      isShowViewPdf: false,
      tableData: [],
      tableParams: {}, // 请求表格数据携带的参数
      selectedRows: [],
      // 分页
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      pdf: {
        currentPage: 1, // pdf文件页码
        pageCount: 0, // pdf文件总页数
        fileType: 'pdf', // 文件类型
        src: '' // pdf文件地址
      },
      fixedModelList: [] // 模板选择下拉框的数据
    }
  },
  created() {
    // 获取模板选择数据
    this.getModelsList()
    bus.$on('dataGood', (val) => {
      if (val) {
        this.getModelsList()
      }
    })
  },
  methods: {
    // 发布接口
    publishData(){
      const params = {
        productId:this.PublishDatas.productId,
        type:'1'
      }
      API.getPublish(params).then(res=>{
        if(res.code===200){
          this.$message.success(res.msg)
        }else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取模板选择的数据
    getModelsList() {
      API.getModelsList().then(res => {
        const { code, rows, msg } = res
        if (String(code) === '200') {
          this.fixedModelList = rows
          this.queryTableData()
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 点击新增数据产品按钮
    addData() {
      // 返回父组件
      this.$emit('addDataPruductadd', true)
    },
    // 查询表格数据
    queryTableData() {
      this.tableParams = {
        productName: this.form.name,
        pageNum: this.pager.currentPage,
        pageSize: this.pager.pageSize
      }
      this.getTableData()
    },
    // 获取表格数据
    getTableData() {
      const params = Object.assign(this.tableParams)
      API.getProductDataList(params).then(res => {
        const { code, rows, msg, total } = res
        
        if (String(code) === '200') {
          this.tableData = rows
          this.pager.total = total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 重置筛选条件
    resetQuery() {
      this.$refs.form.resetFields()
      this.queryTableData()
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.queryTableData()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.queryTableData()
    },
    onHandleView(row) {
      this.isShowViewPdf = true
      this.$nextTick(() => {
        const params = {
          productId: row.productId,
          type: 'PDF'
        }
        API.uploadPdfFile(params).then(res => {
          const { code, msg, data } = res
          if (String(code) === '200') {
            console.log(data)
            this.pdf.src = pdf.createLoadingTask(data)
            this.pdf.src.promise
              .then(pdf => {
                this.pdf.pageCount = pdf.numPages
              })
              .catch(err => {
                console.error('pdf 加载失败', err)
              })
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    onHandleEdit(row) {
      const params = {
        productId: row.productId
      }

      API.getProductDataLists(params).then(res => {
        const { code, msg } = res
        if (String(code) === '200') {
          if (![res.data].length) {
            this.$message.error('当前数据不存在')
            return
          } else {
            var editData = [res.data][0]
            this.$emit('addDataPruduct', true, true, editData)
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 下载
    onHandleDownLoad(row) {
      this.exportType = 'PDF'
      this.dataExportDialogVisible = true
      this.downloadDatas = row
    },
    downloadData(){
      this.loading2 = true
       // 防止下载的时候直接打开文档
      function fileAjax(url, callback, options) {
        const xhr = new XMLHttpRequest()
        xhr.open('get', url, true)
        if (options.responseType) {
          xhr.responseType = options.responseType
        }
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr)
          }
        }
        xhr.send()
      }
      function downloadFile(content, filename) {
        window.URL = window.URL || window.webkitURL
        const a = document.createElement('a')
        const blob = new Blob([content])
        // 通过二进制文件创建url
        const url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = filename
        a.click()
        // 销毁创建的url
        window.URL.revokeObjectURL(url)
      }
      const params = {
        productId: this.downloadDatas.productId,
        type: this.exportType
      }
      API.uploadPdfFile(params).then(res => {
        const { code, rows, msg, total } = res
        if (String(code) === '200') {
          const url = `${res.data}`
          const name = res.data.substring(res.data.lastIndexOf('/') + 1, res.data.length) // 下载的文件的名称
          // 发送http请求，将文件链接转换成文件流
          fileAjax(
            url,
            function(xhr) {
              downloadFile(xhr.response, name)
            },
            {
              responseType: 'blob'
            }
          )
          this.dataExportDialogVisible = false
          this.loading2 = false
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 发布
    onHandlePublish(row) {
      this.PublishDatas = row
      this.publishData()
    },
    // 删除
    deleteTableData(row) {
      if (row) {
        var sMsg = '确定删除该数据产品吗?'
      } else {
        var sMsg = '确定删除所选数据产品吗?'
      }
      this.$confirm(sMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {}
        // 行内删除
        if (row) {
          params.productIds = row.productId
        } else {
          params.productIds = []
          for (let index = 0; index < this.selectedRows.length; index++) {
            const element = this.selectedRows[index]
            params.productIds.push(element.productId)
          }
          params.productIds = params.productIds + ''
        }
        API.deleteProduct(params).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            this.queryTableData()
            this.$message.success(msg)
          } else {
            this.$message.error(msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .qiefen-dialog-class{
  width: 25% !important;
  margin-top: 24vh !important;
}
>>> .el-button--primary{
  background-color: #1f7cd7;
}
.conT {
  height: 100%;
  .content {
    height: 100%;
    >>> .el-card{
      height: 100%;
    }
    ::v-deep .el-card {
      height: calc(100% - 30px);
      .el-card__body {
        height: 100%;
        .con {
          height: 100%;

          .table-section {
            height: calc(100% - 102px);
          }
          .pager-section {
            text-align: right;
          }
        }
      }
    }
  }
  .opreation-btn {
    margin-left: 20px;
    margin-bottom: 10px;
  }
  .queryCondition {
    padding: 18px 0px 0px 0px;
    border: 1px solid #e4dede;
  }
  .buttons {
    margin: 10px 0;
  }
  .addButtonIcon {
    color: #067ef9;
    font-weight: bolder;
    margin: 0px 8px 0 -7px;
  }
  .deleteButtonIcon {
    color: red;
    font-weight: bolder;
    margin: 0px 8px 0 -7px;
  }
  .seprate {
    color: #c7c3c3;
  }
}
</style>
