<template>
  <div class="special-data-container">
    <div class="search-section">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input v-model="searchForm.name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="onHandleSearch">搜索</el-button>
            <el-button type="default" @click="onHandleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="toolbar-section">
      <el-button type="success" @click="onHandleAddTemplate">
        新增
      </el-button>
    </div>
    <div class="table-section">
      <el-table :data="tableData" stripe height="100%" border style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column
          v-for="(column, index) in tableColumns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :render-header="renderHeader"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="onHandleView(scope.row)">查看</el-button>
            <el-button type="text" @click="onHandleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="onHandleDeleteTemplates(scope.row)">删除</el-button>
            <el-button type="text" @click="onHandlePreview(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pager-section">
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
    <!-- 过滤的弹出框 -->
    <el-dialog
      :visible.sync="filtrationVisible"
      custom-class="qiefen-dialog-class"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="innerText" prop="text">
          <el-date-picker
            v-if="innerText==='创建时间'"
            v-model="ruleForm.text"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
          <el-input v-else v-model="ruleForm.text" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      custom-class="qiefen-dialog-class"
      width="70%"
    >
      <EditForm :id="id" ref="StatisticSetting" :dialog-visible="dialogVisible" :type="type" />
      <span slot="footer" class="dialog-footer">
        <template v-if="type!=='view'">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onHandleSave">确 定</el-button>
        </template>
        <el-button v-else type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="预览"
      :visible.sync="previewDialogVisible"
      :close-on-click-modal="false"
      custom-class="qiefen-dialog-class"
      width="70%"
    >
      <PreviewPage :id="id" ref="PreviewDialog" :dialog-visible="previewDialogVisible" :is-downloading="isDownloading" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onHandleExport">导 出</el-button>
        <el-button type="primary" @click="previewDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/DataVisualization'
import EditForm from './edit/index.vue'
import PreviewPage from './preview/index.vue'
import html2canvas from 'html2canvas'
export default {
  components: { EditForm, PreviewPage },
  data() {
    return {
      filtrationVisible: false,
      innerText: '',
      propKey: '',
      ruleForm: {
        text: ''
      },
      rules: {
        text: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      // 搜索条件
      searchForm: {
        name: ''
      },
      // 表头
      tableColumns: [
        {
          label: '标题',
          prop: 'thematicdataName',
          align: 'center',
          key: 'name'
        },
        {
          label: '创建时间',
          prop: 'thematicdataDate',
          align: 'center',
          key: 'time'
        }
      ],
      // 表格数据
      tableData: [],
      // 分页
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      // 选择的行
      selectedRows: [],
      // 表单类型
      type: 'add',
      // 是否显示表单
      dialogVisible: false,
      // 当前编辑ID
      id: '',
      // 是否显示预览窗口
      previewDialogVisible: false,
      // 是否正在下载
      isDownloading: false,
      orderBy: '',
      orderColumn: ''
    }
  },
  computed: {
    title() {
      if (this.type === 'add') {
        return '新增统计'
      } else if (this.type === 'edit') {
        return '修改统计'
      } else {
        return '查看详情'
      }
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    renderHeader(h, { column, $index }) {
      return h('div', [
        h(
          'p',
          {
            style: 'display:inline-block'
          },
          column.label
        ),
        h('div', {
          style: 'display: inline-block;position: relative;top: 3px;'
        }, [
          h('i', {
            class: 'el-icon-caret-top',
            style: 'display: block;line-height: 0.5;',
            on: {
              click: () => {
                this.RowcaretTop(column, $index)
              }
            }
          }),
          h('i', {
            class: 'el-icon-caret-bottom',
            style: 'display: block;line-height: 0.5;',
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
    // 升序
    RowcaretTop(column, index) {
      const orderBys = 'ASC'
      const orderColumns = column.property
      this.getTableList(orderBys, orderColumns)
    },
    // 降序
    RowcaretBottom(column, index) {
      const orderBys = 'DESC'
      const orderColumns = column.property
      this.getTableList(orderBys, orderColumns)
    },
    // 过滤
    Rowdataanalysis(column, index) {
      const keys = this.tableColumns.find(item => item.prop === column.property)
      // key
      this.propKey = keys.key
      // 弹框里的label值
      this.innerText = column.label
      this.filtrationVisible = true
    },
    // 确定
    confirm() {
      if (this.ruleForm.text !== '') {
        this.filtrationVisible = false
        this.getTableList('', '', this.propKey, this.ruleForm.text)
      } else {
        this.$message.error('请输入要查询的条件！')
        return
      }
      this.ruleForm.text = ''
    },
    // 弹出框右上角叉号
    handleClose() {
      this.ruleForm.text = ''
      this.filtrationVisible = false
    },
    // 搜索
    onHandleSearch() {
      this.pager.currentPage = 1
      this.getTableList()
    },
    // 获取表格数据
    getTableList(orderBys, orderColumns, propKeys, texts) {
      const { currentPage, pageSize } = this.pager
      if (orderBys && orderColumns === 'thematicdataName') {
        this.orderBy = orderBys
        this.orderColumn = 'THEMATICDATA_NAME'
      } else if (orderBys && orderColumns === 'thematicdataDate') {
        this.orderBy = orderBys
        this.orderColumn = 'THEMATICDATA_DATE'
      } else {
        // 排序
        this.orderBy = ''
        // 列名
        this.orderColumn = ''
      }
      let dataList = {}
      if (propKeys === 'time') {
        var datas = {}
        datas[propKeys] = texts
        dataList = datas
      }
      if (propKeys === 'name') {
        var data = {}

        data[propKeys] = texts
        dataList = data
      }
      const params = Object.assign({}, this.searchForm, dataList, { orderBy: this.orderBy, orderColumn: this.orderColumn, pageNum: currentPage, pageSize: pageSize })
      API.getThematicDataList(params).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.tableData = data.list
          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 重置
    onHandleReset() {
      this.searchForm = {
        name: '',
        time: ''
      }
      this.getTableList()
    },
    // 新增
    onHandleAddTemplate() {
      this.type = 'add'
      this.id = ''
      this.dialogVisible = true
    },
    // 批量删除
    onHandleDeleteTemplates(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.deleteThematicData({ id: row.id }).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            this.$message.success('删除成功！')
            this.getTableList()
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    // 查看
    onHandleView(row) {
      this.type = 'view'
      this.id = row.id
      this.dialogVisible = true
    },
    // 编辑
    onHandleEdit(row) {
      this.type = 'edit'
      this.id = row.id
      this.dialogVisible = true
    },
    // 预览
    onHandlePreview(row) {
      this.id = row.id
      this.previewDialogVisible = true
    },
    // 切换每页显示数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getTableList()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getTableList()
    },
    // 校验sqls是否为空
    validateSql(data) {
      const isSqlNull = data.some(item => item.chartsType !== 'text' && item.chartsType !== 'picture' && !item.dynamicSql)
      if (isSqlNull) {
        return false
      }
      return true
    },
    // 保存
    onHandleSave() {
      if (this.type === 'add') {
        const param = this.$refs.StatisticSetting.getSaveData()
        if (!this.validateSql(param.charts)) {
          this.$message.warning('sql不能为空！')
          return
        }
        if (param.name === '') {
          this.$message.warning('标题不能为空！')
          return
        }
        API.addThematicData(param).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            this.$message.success('添加成功！')
            this.getTableList()
          } else {
            this.$message.error(msg)
          }
        })
      } else if (this.type === 'edit') {
        const param = this.$refs.StatisticSetting.getSaveData()
        if (!this.validateSql(param.charts)) {
          this.$message.warning('sql不能为空！')
          return
        }
        param.id = this.id
        API.editThematicData(param).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            this.$message.success('修改成功！')
            this.getTableList()
          } else {
            this.$message.error(msg)
          }
        })
      }
      this.dialogVisible = false
    },
    // 导出
    onHandleExport() {
      this.isDownloading = true
      const targetDom = document.querySelector('#StatisticSectionPreview')
      setTimeout(() => {
        html2canvas(targetDom, {
          useCORS: true,
          backgroundColor: '#FFFFFF'
        }).then((canvas) => {
          var imgData = canvas.toDataURL('image/png')
          this.download(imgData)
          this.isDownloading = false
        })
      }, 200)
    },
    // 下载
    download(imgData) {
      const formData = new FormData()
      formData.append('file', this.base64ToFile(imgData), 'image/png')
      API.uploadImage(formData).then(res => {
        const { code, data } = res
        if (String(code) === '200') {
          console.log(data)
          API.downloadThematic({
            id: this.id,
            path: data
          }).then(res => {
            var oA = document.createElement('a')
            oA.download = '截图' // 设置下载的文件名
            oA.href = res.data
            document.body.appendChild(oA)
            oA.click()
            oA.remove() // 下载之后把创建的元素删除
          })
        }
      })
    },
    base64ToFile(dataurl) {
      // 上传到服务器
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-button--primary{
  background-color: #1f7cd7;
}
>>> .qiefen-dialog-class{
  margin-top: 15vh !important;
}
>>> .el-dialog__header{
  padding: 20px;
}
.special-data-container{
  padding: 20px;
  margin-top: 60px;
  background: #FFFFFF;
  border-radius: 3px;
  height: calc(100% - 60px);
  .search-section{
    padding-top: 18px;
    border: 1px solid #e4dede;
  }
  .toolbar-section{
    padding: 10px 0 10px 0;
  }
  .table-section{
    height: calc(100% - 180px);
  }
  .pager-section{
    margin-top: 10px;
    text-align: right;
  }
}
</style>
<style>
.el-dialog__body{
  padding: 10px 20px !important;
}
</style>
