<template>
  <Container>
    <div class="container"
      v-loading="loading2"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      plain style="margin-bottom:12px;padding:9px 20px;" 
    >
      <div class="containerTop">
        <el-form ref="form" :model="formInline" label-width="80px" style="display:flex;height:52px;">
          <!-- 选择时间 -->
          <!-- <el-date-picker
            v-model="value1"
            style="margin-right: 90px;"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="pickerSelect"
          /> -->
          <!-- 任务状态 -->
          <el-form-item label="任务状态:">
            <el-select v-model="taskStatus" placeholder="请选择" class="topSelect" filterable @change="selectChange">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <!-- 文件类型 -->
          <el-form-item label="文件类型">
            <el-select v-model="fileType" placeholder="请选择" class="fileSelect" filterable @change="fileChange">
              <el-option
                v-for="item in optionsFile"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>

          <div>
            <el-button type="primary" style="margin-left:12px" @click="query">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-form>

      </div>
      <!-- 新建任务 -->
      <el-dropdown style="margin-bottom: 14px;" trigger="click" @command="newTask">
        <el-button type="primary">
          新建任务<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="EXCEL">EXCEL</el-dropdown-item>
          <el-dropdown-item command="XML">XML</el-dropdown-item>
          <el-dropdown-item command="SQL">SQL</el-dropdown-item>
          <el-dropdown-item command="DMP">DMP</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 刷新 -->
      <el-button type="primary" plain style="margin-left:12px;padding:9px 20px;" @click="refresh">刷 新</el-button>

      <el-table
        ref="multipleSelection"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;padding:0"
        stripe
        border
        height="calc(100vh - 52.8%)"
        class="tableBox"
        :index="indexMethod"
        :header-cell-style="{background:'#1F7FD8',color:'#F8F8F8'}"
        :row-style="{height: '0'}"
        :cell-style="{padding: '0'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />
        <el-table-column
          label="序号"
          :index="indexMethod"
          type="index"
          width="100"
          align="center"
        />
        <el-table-column
          prop="startTime"
          label="开始时间"
          align="center"
          show-overflow-tooltip
          :render-header="renderHeader"
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
          align="center"
          show-overflow-tooltip
          :render-header="renderHeader"
        />
        <el-table-column
          prop="taskStatus"
          label="任务状态"
          align="center"
          show-overflow-tooltip
          :render-header="renderHeader"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.taskStatus==='1'">完成</p>
            <p v-if="scope.row.taskStatus==='0'">失败</p>
            <p v-if="scope.row.taskStatus==='2'">运行中</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileType"
          label="文件类型"
          align="center"
          show-overflow-tooltip
          :render-header="renderHeader"
        />
        <el-table-column
          label="操作"
          width="210"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="download(scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :current-page="pager.pageNum"
        :page-sizes="pager.pageSizes"
        :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 过滤 -->
    <el-dialog
      title=""
      :visible.sync="dialogVisibleFilter"
      width="30%"
    >
      <el-form v-if="dialogVisibleFilter" label-position="top" label-width="80px" :model="formFilter">
        <el-form-item :label="labelFilter">
          <el-select v-if="labelFilter==='任务状态'" v-model="formFilter.inputData" placeholder="请选择">
            <el-option
              v-for="item in taskStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-if="labelFilter==='文件类型'" v-model="formFilter.inputData" placeholder="请选择">
            <el-option
              v-for="item in fileTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-if="labelFilter==='开始时间'||labelFilter==='结束时间'"
            v-model="formFilter.inputData"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss "
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 100%;"
            @change="dateFilter"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFilter">取 消</el-button>
        <el-button type="primary" @click="sureFilter">确 定</el-button>
      </span>
    </el-dialog>
  </Container>
</template>

<script>
import * as API from '@/api/index'
import Container from '@/components/Container'
export default {
  components: { Container },
  data() {
    return {
      loading2:false,
      taskStatusOptions: [
        {
          value: '1',
          label: '完成'
        },
        {
          value: '0',
          label: '失败'
        },
        {
          value: '2',
          label: '运行中'
        }
      ],
      fileTypeOptions: [
        {
          value: 'EXCEL',
          label: 'EXCEL'
        },
        {
          value: 'XML',
          label: 'XML'
        },
        {
          value: 'SQL',
          label: 'SQL'
        },
        {
          value: 'DMP',
          label: 'DMP'
        }
      ],
      formFilter: {
        inputData: ''
      },
      dialogVisibleFilter: false,
      // 日期选择器
      value1: [],
      // 单选框选择器
      options: [
        {
          value: '1',
          label: '完成'
        }, {
          value: '0',
          label: '失败'
        }, {
          value: '2',
          label: '运行中'
        }
      ],
      // 文件类型
      valueFile: '',
      // 文件类型内容
      optionsFile: [
        {
          value: '1',
          label: 'EXCEL'
        },
        {
          value: '2',
          label: 'XML'
        },
        {
          value: '3',
          label: 'SQL'
        },
        {
          value: '4',
          label: 'DMP'
        }
      ],
      // 表格
      tableData: [],
      // 分页
      pager: {
        pageNum: 1, // 当前页数
        pageSize: 10, // 一页几条
        total: 0, // 总条数
        pageSizes: [10, 15, 20, 30]
      },
      // 开始时间
      startTime: '',
      // 结束时间
      endTime: '',
      // 运行状态
      taskStatus: '',
      // 文件类型
      fileType: '',
      formInline: {}
    }
  },
  created() {
    this.getTableData()
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
      const sortColumnMap = {
        [column.property]: 'ASC'
      }
      this.getTableData(sortColumnMap)
    },
    // 降序
    RowcaretBottom(column, index) {
      const sortColumnMap = {
        [column.property]: 'DESC'
      }
      this.getTableData(sortColumnMap)
    },
    // 过滤
    Rowdataanalysis(column, index) {
      this.dialogVisibleFilter = true
      this.labelFilter = column.label
      this.columnProperty = column.property
      this.formFilter.inputData = ''
    },
    // 时间过滤器
    dateFilter(val) {
      this.formFilter.inputData = val
    },
    // 过滤模态框取消按钮
    closeFilter() {
      this.dialogVisibleFilter = false
      this.formFilter.inputData = ''
    },
    // 过滤模态框确定按钮
    sureFilter() {
      this.dialogVisibleFilter = true
      this.getTableData()
      this.dialogVisibleFilter = false
    },
    // 日期选择
    pickerSelect() {
      this.startTime = this.value1[0]
      this.endTime = this.value1[1]
    },
    // 运行状态
    selectChange(val) {
      this.taskStatus = val
    },
    // 文件类型
    fileChange(val) {
      this.fileType = val
    },
    // 查询按钮
    query() {
      if (this.value1.length <= 0 && this.taskStatus === '' && this.fileType === '') {
        this.loading2=false
        return this.$message.error('请输入查询条件！')
      } else{
        this.loading2 = true
        this.getTableData()
      }
      
    },
    // 重置按钮
    reset() {
      this.loading2=true
      this.value1 = []
      this.taskStatus = ''
      this.fileType = ''
      this.pager.pageNum = 1
      this.getTableData()
    },
    // 刷新
    refresh() {
      this.loading2=true
      this.pager.pageNum = 1
          this.pager.pageSize = 10
      const data = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        sortColumnMap: {}
      }
      this.formInline.startTime = this.value1[0]
      this.formInline.endTime = this.value1[1]
      this.formInline.taskStatus = this.taskStatus
      this.formInline.fileType = this.fileType
      var props = Object.assign({}, data, this.formInline)
      API.getDatabaseTransform(props).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.tableData = data.list
          this.pager.total = data.total
          
          
        } else {
          this.$message.error(msg)
        }
        
      })
      this.loading2=false
    },
    // 新建任务
    newTask(command) {
      const props = {
        fileType: command
      }
      API.getDatabaseCreate(props).then(res => {
        const { msg, code } = res
        if (String(code) === '200') {
          this.$message.success('任务开始运行')
          this.getTableData()
        } else {
          this.$message.error(msg)
        }
      })
    },
    // index配置   自定义序号
    indexMethod(index) {
      return index + this.pager.pageSize * (this.pager.pageNum - 1) + 1
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pager.pageNum = val
      this.getTableData()
    },
    // 首次加载表格数据
    getTableData(sortColumnMap) {
      const filter = {}
      filter[this.columnProperty] = this.formFilter.inputData || ''
      const data = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        sortColumnMap: sortColumnMap || {}
      }
      this.formInline.startTime = this.value1[0]
      this.formInline.endTime = this.value1[1]
      this.formInline.taskStatus = this.taskStatus
      this.formInline.fileType = this.fileType
      var props = Object.assign({}, data, this.formInline, filter)
      API.getDatabaseTransform(props).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.tableData = data.list
          this.pager.total = data.total
          
        } else {
          this.$message.error(msg)
        }
        
      })
      this.loading2=false
    },
    // 下载按钮 getDatabaseExport
    download(val) {
      this.loading2=true
      const props = {
        id: val.id
      }
      API.getDatabaseExport(props).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          window.open(data)
          
        } else {
          this.$message.error(msg)
        }
        
      })
      this.loading2=false
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
  .containerTop{
    margin-bottom: 15px;
    border: 1px solid #e4dede;
    padding: 18px 0 0 0;
    .topSelect{
      width: 100% !important;
      margin-right: 15px;
    }
    .fileSelect{
      width: 100% !important;
      margin-right: 15px;
    }
  }

  >>> .el-table__body-wrapper{
    height: 93%;
    overflow: auto;
  }
  .pagination{
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
  }
  >>> .el-table td, .el-table th {
    padding: 0 !important;
  }
  >>> .el-table--small th {
    padding: 0 !important;
  }
}
</style>
