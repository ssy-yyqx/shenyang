<template>
  <div class="conTable">
    <div class="table-section">
      <el-table
        :data="tableDataInfo.tableData"
        stripe
        height="100%"
        border
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column
          v-for="(item, index) of tableDataInfo.tableHead"
          :key="index"
          :label="item.label"
          :prop="item.fieldName"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-info"
              type="info"
              size="small"
              round
              @click="onHandleView(scope.row)"
            >查看</el-button>
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="small"
              round
              @click="onHandleEdit(scope.row)"
            >修改</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="small"
              round
              @click="onHandleDeleteByRow(scope.row)"
            >删除</el-button>
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
  </div>
</template>
<script>
export default {
  props: ['tableDataInfo'],
  data() {
    return {
      // 分页
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      selectedRows: []
    }
  },
  methods: {
    onHandleView(row) {},
    onHandleEdit(row) {},
    onHandleDeleteByRow(row) {},
    // 表格复选框
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getTableData()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getTableData()
    }
  }
}
</script>
<style lang="scss" scoped>
.conTable {
  height: calc(100% - 40px);
  ::v-deep .table-section {
    height: calc(100% - 60px);
    .el-table__body-wrapper{
      height: calc(100% - 40px);
    }
  }
  .pager-section {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
