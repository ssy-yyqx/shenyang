<template>
  <el-dialog
    title="详情"
    :visible.sync="dialogVisibles"
    width="65%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    custom-class="qiefen-dialog-class"
  >
    <el-table
      ref="multipleSelection"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;min-height: calc(100vh - 438px);"
      stripe
      height="500"
      border
      :header-cell-style="{background:'#1F7FD8',color:'#F8F8F8'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="序号"
        type="index"
        :index="table_index"
        width="150"
        align="center"
      />
      <el-table-column
        label="表名称"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.tableName }}</template>
      </el-table-column>
      <el-table-column
        prop="dataTotal"
        label="同步数据数"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="失败数据数"
        prop="failData"
        width="200"
        align="center"
        show-overflow-tooltip
      />
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibles = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisibles = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as API from '@/api/index'
export default {
  props: {
    'dialogVisible': {
      type: Boolean
    },
    'syncId': {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisibles: this.dialogVisible,
      // 表格
      tableData: [],
      multipleSelection: [],
      // 分页
      pager: {
        pageNum: 1, // 当前页数
        pageSize: 10, // 一页几条
        total: 0, // 总条数
        pageSizes: [10, 15, 20, 30]
      }
    }
  },
  watch: {
    dialogVisible(val) {
      this.dialogVisibles = val
    },
    dialogVisibles(val) {
      if (!val) {
        this.$emit('dialogVisiblesFalse')
      }
    }
  },
  created() {
    this.getSyncTaskDetailList()
  },
  methods: {
    // 表格相关=======================
    // index配置
    table_index(index) {
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    },
    getSyncTaskDetailList() {
      const data = {
        'pageNum': this.pager.pageNum,
        'pageSize': this.pager.pageSize,
        'syncId': this.syncId
      }
      API.getSyncTaskDetailList(data).then(res => {
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
    },
    handleClose() {
      this.dialogVisibles = false
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handleSizeChange(val) {
      this.pager.pageSize = val
      console.log(`每页 ${val} 条`)
      this.getSyncTaskDetailList()
    },
    handleCurrentChange(val) {
      this.pager.pageNum = val
      console.log(`当前页: ${val}`)
      this.getSyncTaskDetailList()
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .qiefen-dialog-class {
  margin-top: 10vh !important;
}

>>> .el-table__body-wrapper{
  height: 93%;
  overflow: auto;
}
.pagination{
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
