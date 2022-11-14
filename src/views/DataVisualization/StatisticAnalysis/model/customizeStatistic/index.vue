<template>
  <div class="customize-container">
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
      <!-- <el-button
        type="danger"
        :disabled="selectedRows.length === 0"
        @click="onHandleDeleteTemplates()"
      >
        删除
      </el-button> -->
    </div>
    <div class="table-section">
      <el-table :data="tableData" stripe height="100%" border style="width: 100%;" @selection-change="handleSelectionChange">
        <!-- <el-table-column
          type="selection"
          width="55"
        /> -->
        <el-table-column
          v-for="(column, index) in tableColumns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :align="column.align"
        >
          <template slot-scope="scope">
            <template v-if="column.useSlot">
              <template v-if="column.prop === 'opera'">
                <el-button type="text" @click="onHandleView(scope.row)">查看</el-button>
                <el-button type="text" @click="onHandleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="onHandleDeleteTemplates(scope.row)">删除</el-button>
              </template>
            </template>
            <template v-else>
              {{ scope.row[column.prop] }}
            </template>
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
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      custom-class="qiefen-dialog-class"
      width="70%"
    >
      <StatisticSetting :id="id" ref="StatisticSetting" :dialog-visible="dialogVisible" :type="type" />
      <span slot="footer" class="dialog-footer">
        <template v-if="type!=='view'">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onHandleSave">确 定</el-button>
        </template>
        <el-button v-else type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/DataVisualization'
import StatisticSetting from './StatisticSetting.vue'
export default {
  components: { StatisticSetting },
  data() {
    return {
      // 搜索条件
      searchForm: {
        name: ''
      },
      // 表头
      tableColumns: [
        {
          label: '标题',
          prop: 'name',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'date',
          align: 'center'
        },
        {
          label: '操作',
          prop: 'opera',
          align: 'center',
          useSlot: true
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
      id: ''
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
    // 搜索
    onHandleSearch() {
      this.pager.currentPage = 1
      this.getTableList()
    },
    // 获取表格数据
    getTableList() {
      const { currentPage, pageSize } = this.pager
      const params = Object.assign({}, this.searchForm, { pageNum: currentPage, pageSize: pageSize })
      API.getCustomizeStatisticList(params).then(res => {
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
        API.deleteCustomizeStatistic({ id: row.id }).then(res => {
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
      const isSqlNull = data.some(item => !item.dynamicSql)
      if (isSqlNull) {
        return false
      }
      return true
    },
    // 保存
    onHandleSave() {
      // console.log(this.name)

      if (this.type === 'add') {
        const param = this.$refs.StatisticSetting.getSaveData()

        if (!param.name) {
          this.$message.warning('标题不能为空！')
          return false
        }
        if (param.charts.length === 0) {
          this.$message.warning('内容不能为空！')
          return false
        }
        if (!this.validateSql(param.charts)) {
          this.$message.warning('sql不能为空！')
          return false
        }

        API.addCustomizeStatistic(param).then(res => {
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
        API.editCustomizeStatistic(param).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-button--primary{
  background-color: #1f7cd7;
}
.customize-container{
  padding: 20px;
  // margin: 10px;
  margin-top: 12px;
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
