<template>
  <div class="container">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;"
      stripe
      border
      :header-cell-style="{ background: '#1F7FD8', color: '#F8F8F8' }"
    >
      <el-table-column v-for="(item,index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" show-overflow-tooltip align="center" />
      <el-table-column
        align="center"
        label="切分状态"
      >
        <template slot-scope="scope">
          <p>切分完成</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-download"
            class="blue"
            @click="downLoad(scope.row)"
          >下载</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  </div>
</template>

<script>
import Container from '@/components/Container'
import * as API from '@/api/SplitFile'
export default {
  components: { Container },
  data() {
    return {
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
          label: '切分日期',
          prop: 'segmentationDate'
        }
        // {
        //   label: '切分状态',
        //   prop: 'segmentationStatus'
        // }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
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
    getData() {
      const data = {
        'pageNum': this.pager.currentPage,
        'pageSize': this.pager.pageSize
      }
      API.getSplitFile(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.pager.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    downLoad(val) {
      const params = {
        id: val.id
      }
      console.log(val)
      API.downLoadSplitFile(params).then(res => {
        if (res.code === 200) {
          window.open(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-table__body-wrapper{
  height: 617px;
  overflow-y: auto;
}
.container {
  height: 100%;
  width: 100%;
  padding: 10px;
  background-color: #fff;
}
.pagination{
  display: flex;
  justify-content: flex-end;
  margin: 11px 0;
}
</style>
