<template>
  <Container>
    <div class="container">
      <div class="container">
        <!--操作栏 begin-->
        <div class="handle-box">
          <el-button type="primary" icon="el-icon-upload" class="mr10" @click="uploadFiles()">文件上传</el-button>
          <!-- <el-input v-model="query.nameSearch" placeholder="文件名" class="handle-input mr10" /> -->
          <!-- <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
        </div>
        <!--操作栏 end-->
        <!-- table主要区域 begin -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
           height="calc(100vh - 47%)"
          stripe
          border
          :header-cell-style="{ background: '#1F7FD8', color: '#F8F8F8' }"
        >
          <el-table-column v-for="(item,index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" show-overflow-tooltip align="center" :render-header="renderHeader" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-download"
                class="blue"
                @click="handleDownload(scope.$index, scope.row)"
              >下载</el-button>
              <!-- <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button> -->
              <el-button
                type="text"
                icon="el-icon-share"
                class="blue"
                :disabled="shareDisable"
                @click="share(scope.$index, scope.row)"
              >发送</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- table主要区域 end -->
        <!-- 分页 begin -->
        <div class="pagination">
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
        <!-- 分页 end -->
      </div>
      <!--上传附件弹出框 -->
      <el-dialog v-dialogDrag title="文件上传" center :visible.sync="uploadVisible" width="60%" @close="handlerClose">
        <UploadBigFile class="uploadSlot" @handlerCloses="handlerCloses" />
      </el-dialog>
      <!-- 文件发送的弹出框 -->
      <el-dialog
        title="文件发送"
        :visible.sync="shareVisible"
        width="30%"
        custom-class="qiefen-dialog-class"
        :before-close="Close"
      >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="部队" prop="selectInput">
            <el-select v-model="ruleForm.selectInput" placeholder="请选择">
              <el-option
                v-for="item in selectOptions"
                :key="item.id"
                :label="item.forceName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="Close">取 消</el-button>
          <el-button type="primary" @click="confirm">发 送</el-button>
        </span>
      </el-dialog>
      <!-- 过滤的弹出框 -->
      <el-dialog
        :visible.sync="filtrationVisible"
        custom-class="qiefen-dialog-class"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-form ref="ruleForms" :model="ruleForms" :rules="rule" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="innerText" prop="text">
            <el-date-picker
              v-if="innerText==='上传时间'"
              v-model="ruleForms.text"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            />
            <el-input v-else v-model="ruleForms.text" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="confirms">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </Container>

</template>

<script>
// import { selectFileList, deleteFile } from '@/api/modules/uploadFile'
import '@/common/directives'
import UploadBigFile from './Upload'
import Container from '@/components/Container'
import * as API from '@/api/index'
export default {
  components: { Container, UploadBigFile },
  data() {
    return {
      shareDisable: false,
      propsFilter: {
        value: 'field',
        label: 'label',
        children: 'childList',
        checkStrictly: true
      },
      selectOptions: [],
      filtrationVisible: false,
      innerText: '',
      propKey: '',
      ruleForms: {
        text: ''
      },
      rule: {
        text: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      shareVisible: false, // 文件发送的弹框
      ruleForm: {
        selectInput: ''// IP输入框
      },
      rules: {
        selectInput: [
          { required: true, message: '请填写IP输入框', trigger: 'blur' }
        ]
      },
      // 分页
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      tableData: [],
      tableColumn: [
        {
          label: '文件名',
          prop: 'fileName'
        },
        {
          label: '文件大小',
          prop: 'fileSize'
        },
        {
          label: '上传时间',
          prop: 'uploadDate'
        }
      ],
      multipleSelection: [],
      uploadVisible: false,
      pageTotal: 0,
      form: {},
      id: -1,
      allData: {},
      uploadVals: {},
      rows: {}
    }
  },
  mounted() {
    this.getData(this.allData)
  },
  methods: {
    // 级联选择器
    cascaderFilter() {
      API.getDeployList().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.selectOptions = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    renderHeader(h, { column, $index }) {
      return h('div', [
        h(
          'p',
          {
            style: 'display: inline-block;'
          },
          column.label
        ),
        h('div', {
          style: 'display: inline-block;position: relative;top: 3px;'
        },
        [
          h('i', {
            class: 'el-icon-caret-top',
            style: 'display: block;line-height: 7px;',
            on: {
              click: () => {
                this.RowcaretTop(column, $index)
              }
            }
          }),
          h('i', {
            class: 'el-icon-caret-bottom',
            style: 'display: block;line-height: 7px;',
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
      ])
    },
    RowcaretTop(column, index) {
      console.log(column, index)
      const keys = this.tableColumn.find(item => item.prop === column.property)
      const orderBys = 'ASC'
      const orderColumns = keys.prop
      this.getData('', orderBys, orderColumns)
    },

    RowcaretBottom(column, index) {
      console.log(column, index)
      const keys = this.tableColumn.find(item => item.prop === column.property)
      const orderBys = 'DESC'
      const orderColumns = keys.prop
      this.getData('', orderBys, orderColumns)
    },
    Rowdataanalysis(column, index) {
      this.innerText = column.label
      // key
      this.propKey = column.property
      this.filtrationVisible = true
    },
    // 确定
    confirms() {
      if (this.ruleForms.text !== '') {
        this.filtrationVisible = false
        this.getData('', '', '', this.propKey, this.ruleForms.text)
      } else {
        this.$message.error('请输入要查询的条件！')
        return
      }
      this.ruleForms.text = ''
    },
    // 弹出框右上角叉号
    handleClose() {
      this.ruleForms.text = ''
      this.filtrationVisible = false
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getData()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getData()
    },
    // 文件上传成功之后调用
    handlerCloses(val, uploadVal) {
      this.allData = val
      this.uploadVals = uploadVal
    },
    // 获取文件列表
    getData(value, orderBys, orderColumns, propKeys, texts) {
      let dataList = {}
      if (orderBys !== undefined && orderColumns !== undefined) {
        var sortColumnMap = {}
        sortColumnMap[orderColumns] = orderBys
        dataList = {
          sortColumnMap
        }
      }
      if (texts !== undefined) {
        // 动态改变对象的key值
        var datas = {}
        datas[propKeys] = texts
        dataList = datas
      }
      let Data={}
      if(value!== undefined){
         Data = {
          'endTime': '',
          'fileMd5': value.uniqueIdentifier,
          'filePath': value.relativePath ,
          'fileSize': value.size,
          'fileSource': '',
          'filename': value.relativePath ,
          'pageNum': this.pager.currentPage,
          'pageSize': this.pager.pageSize,
          'startTime': ''
        }
      }else{
        Data = {
          'endTime': '',
          'fileMd5':'',
          'filePath': '',
          'fileSize': '',
          'fileSource': '',
          'filename': '',
          'pageNum': this.pager.currentPage,
          'pageSize': this.pager.pageSize,
          'startTime': ''
        }
      }
      const data = Object.assign({}, Data, dataList)
      console.log(data)
      API.FileList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.pager.total = res.data.total
        }
      })
    },
    // 关闭上传文件弹出框时触发
    handlerClose() {
      // 清空上传文件的列表
      this.uploadVals.fileList = []
      this.uploadVals.files = []
      this.getData()
    },
    // 文件发送
    share(index, row) {
      console.log(row)
      if (row.fileSource === 1) { // 1的时候 不能点发送
        this.shareDisable = true
      } else { // 0的时候可以点
        this.shareDisable = false
      }
      this.rows = row
      this.shareVisible = true
      this.cascaderFilter()
    },
    // 发送按钮
    confirm() {
      if (this.ruleForm.selectInput === '') {
        this.$message.error('请输入信息')
        return
      }
      const data = {
        'downloadUrl': this.rows.downloadUrl,
        'fileMd5': this.rows.fileMd5,
        'fileName': this.rows.fileName,
        'filePath': this.rows.filePath,
        'fileSize': this.rows.fileSize,
        'fileSource': 1,
        'id': this.rows.id,
        'appId': this.ruleForm.selectInput
      }
      API.transfer(data).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.shareVisible = false
          this.$message.success(res.msg)
          this.ruleForm = {}
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 取消
    Close() {
      this.shareVisible = false
      this.ruleForm = {}
    },
    uploadFiles() {
      this.uploadVisible = true
    },
    // 下载
    async handleDownload(index, row) {
      const loading = this.$loading({
        lock: true,
        text: '文件生成中',
        background: 'rgba(0,0,0,0.3)'
      })
      setTimeout(() => {
        window.open(row.downloadUrl)
        loading.close()
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .qiefen-dialog-class{
  margin-top: 15vh !important;;
}
>>> .el-dialog__header{
  padding: 18px;
}
>>> .el-table__body-wrapper{
  height: 617px;
  overflow-y: auto;
}
.pagination{
  display: flex;
  justify-content: flex-end;
  margin: 11px 0;
}
.container {
  height: 100%;
  width: 100%;
  padding: 10px;
  background-color: #fff;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 1200;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.uploadSlot {
    margin: -10px 10px 10px 30px;
}
</style>
