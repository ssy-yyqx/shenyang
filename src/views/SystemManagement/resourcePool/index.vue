<template>
  <Container>
    <div class="container"
      v-loading="loading2"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      style="margin-bottom:12px;padding:9px 20px;" 
    >
      <div class="containerTop">
        <el-form ref="form" :model="formInline" label-width="80px" style="display:flex;height:52px;">
          <el-form-item label="任务状态">
            <el-select v-model="value" clearable placeholder="请选择" class="topSelect">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
            <el-button :disabled="value1.length===0&&value===''" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" style="margin-bottom: 14px;" @click="synchronization">同步任务</el-button>
      <el-button type="primary" style="margin-bottom: 14px;" @click="tableConfiguration">同步表配置</el-button>
      <!-- 刷新 -->
      <el-button type="primary" plain style="margin-left:12px;padding:9px 20px;" @click="refresh">刷 新</el-button>
      <!-- 表格数据 -->
      <el-table
        ref="multipleSelection"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;"
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
          v-for="(item,index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          show-overflow-tooltip
          :render-header="renderHeader"
        />
        <el-table-column
          label="任务状态"
          prop="taskStatus"
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
          label="操作"
          width="210"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="details(scope.row)"
            >详情</el-button>
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
    <Details
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :sync-id="syncId"
      @dialogVisiblesFalse="dialogVisiblesFalse"
    />
    <TableConfiguration v-if="tableConfigVisible" :table-config-visible="tableConfigVisible" @tableConfigVisibleFalse="tableConfigVisibleFalse" />
    <!-- 过滤 -->
    <el-dialog
      title=""
      :visible.sync="dialogVisibleFilter"
      width="30%"
    >
      <el-form v-if="dialogVisibleFilter" label-position="top" label-width="80px" :model="formFilter">
        <el-form-item :label="labelFilter">
          <el-input v-if="labelFilter==='同步表数量'||labelFilter==='同步失败表数据'" v-model="formFilter.inputData" @change="inputFilter" />
          <el-select v-if="labelFilter==='任务状态'" v-model="formFilter.inputData" placeholder="请选择">
            <el-option
              v-for="item in formFilterOptions"
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
import Container from '@/components/Container'
import Details from './details'
import TableConfiguration from './tableConfiguration'
import * as API from '@/api/index'
export default {
  components: { Container, Details, TableConfiguration },
  data() {
    return {
      loading2:false,
      formFilterOptions: [
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
      dialogVisibleFilter: false,
      taskStatus: '',
      // 详情弹框
      dialogVisible: false,
      // 同步表配置弹框
      tableConfigVisible: false,
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
        }],
      value: '',
      // 表格
      tableData: [],
      tableColumn: [
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'endTime',
          label: '结束时间'
        },
        {
          prop: 'syncTables',
          label: '同步表数量'
        },
        {
          prop: 'failTables',
          label: '同步失败表数据'
        }
      ],
      multipleSelection: [],
      // 分页
      pager: {
        pageNum: 1, // 当前页数
        pageSize: 10, // 一页几条
        total: 0, // 总条数
        pageSizes: [10, 15, 20, 30]
      },
      syncId: '',
      formInline: {},
      formFilter: {
        inputData: ''
      }
    }
  },
  created() {
    this.getSyncTaskList()
  },
  methods: {
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
    // 升序
    RowcaretTop(column, index) {
      const sortColumnMap = {
        [column.property]: 'ASC'
      }
      this.getSyncTaskList(sortColumnMap)
    },
    // 降序
    RowcaretBottom(column, index) {
      const sortColumnMap = {
        [column.property]: 'DESC'
      }
      this.getSyncTaskList(sortColumnMap)
    },
    // 时间过滤器
    dateFilter(val) {
      this.formFilter.inputData = val
    },
    // 过滤
    Rowdataanalysis(column, index) {
      this.dialogVisibleFilter = true
      this.labelFilter = column.label
      this.columnProperty = column.property
      this.formFilter.inputData = ''
    },
    // 过滤模态框取消按钮
    closeFilter() {
      this.dialogVisibleFilter = false
      // this.vale = ''
      this.formFilter.inputData = ''
    },
    // 过滤模态框确定按钮
    sureFilter() {
      this.dialogVisibleFilter = true
      this.getSyncTaskList()
      this.dialogVisibleFilter = false
    },
    // index配置   自定义序号
    indexMethod(index) {
      return index + this.pager.pageSize * (this.pager.pageNum - 1) + 1
    },
    // 启动同步
    synchronization() {
      this.$confirm('该同步会有后台任务自动进行，是否要进行手动操作?', '' ,{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$confirm('是否确定进行同步?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.getStartTask().then(res => {
            if (res.code === 200) {
              this.$message.success('启动成功')
              this.getSyncTaskList()
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消同步'
          });          
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消手动操作'
        });          
      });
    },
    // 页面一加载获取表格数据
    getSyncTaskList(sortColumnMap) {

      const data = {
        'startTime': this.value1[0],
        'endTime': this.value1[1],
        'taskStatus': this.value,
        'pageNum': this.pager.pageNum,
        'pageSize': this.pager.pageSize,
        sortColumnMap: sortColumnMap || {},
        [this.columnProperty]: this.formFilter.inputData || ''
      }
      API.getSyncTaskList(data).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.pager.total = data.total
          this.pager.pageNum = data.pageNum
          this.pager.pageSize = data.pageSize
          this.tableData = data.list
          
        } else {
          this.$message.error(res.msg)
        }
      })
      this.loading2=false
    },
    // 日期选择
    pickerSelect() {
      console.log(this.value1)
    },
    // 查询按钮
    query() {
      if (this.value1.length <= 0 && this.value === '') {
        return this.$message.error('请输入查询条件！')
      }
      this.getSyncTaskList()
    },
    // 重置按钮
    reset() {
      this.value1 = []
      this.value = ''
      this.getSyncTaskList()
    },
    // 刷新
    refresh() {
      this.formFilter.inputData = ''
      this.pager.pageNum = 1
      this.pager.pageSize = 10
      this.loading2=true
      this.getSyncTaskList()

      // this.pager.pageSizes = 10
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pager.pageSize = val
      this.getSyncTaskList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pager.pageNum = val
      this.getSyncTaskList()
    },
    // 详情按钮
    details(val) {
      // console.log(val)
      this.syncId = val.syncId
      this.dialogVisible = !this.dialogVisible
    },
    // 下载按钮
    download(val) {
      this.loading2 = true
      const params = {
        syncId: val.syncId
      }
      API.getSyncDeploymentTables(params).then(res => {
        if (res.code === 200) {
          this.$message.success('下载成功')
          window.open(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
      this.loading2 = false
    },
    // 详情弹框
    dialogVisiblesFalse(val) {
      this.dialogVisible = val
      this.$refs.multipleSelection.clearSelection()
    },
    tableConfigVisibleFalse(val) {
      this.tableConfigVisible = val
      this.$refs.multipleSelection.clearSelection()
    },
    // 同步表配置
    tableConfiguration() {
      this.tableConfigVisible = !this.tableConfigVisible
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
  overflow-Y: scroll;
  .containerTop{
    margin-bottom: 15px;
    border: 1px solid #e4dede;
    padding: 18px 0 0 0;
    .topSelect{
      width: 100% !important;
      margin-right: 15px;
    }
  }

  >>> .el-table__body-wrapper{
    height: 93%;
    overflow: auto;
    overflow-x: hidden;
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
