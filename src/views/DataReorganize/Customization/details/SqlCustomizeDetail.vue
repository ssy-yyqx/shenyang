<template>
  <!-- sql定制详情 -->
  <div>
    <el-dialog
      title="查看主题数据"
      :visible.sync="sqlDetailsIsShowChilren"
      width="80%"
      height="800px"
      custom-class="qiefen-dialog-class"
      top="50px"
      :before-close="closeDialog"
    >
      <div v-if="sqlDetailTableData && sqlDetailTableData.length > 0" class="detail-class">
        <div class="table-bon">
          <div class="table-section">
            <el-table
              :data="sqlDetailTableData"
              stripe
              height="100%"
              class="table-class"
              header-row-class-name="header-row-class"
              border
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center"
                :index="getRowIndex"
              />
              <el-table-column
                v-for="(item,index) in sqlDetailTableColumn.value"
                :key="index"
                :label="item"
                :prop="item"
                align="center"
                show-overflow-tooltip
              />
            </el-table>
          </div>
          <div class="pager-section">
            <el-pagination
              :current-page="pager.pageNum"
              :page-sizes="pager.pageSizes"
              :page-size="pager.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pager.total"
              @size-change="pagerDetailhandleSizeChange"
              @current-change="pagerDetailhandleCurrentChange"
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="noData"
      >
        暂无数据
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          style="background: #1f7fd8; color: #fff"
          @click="closeDialog"
        >关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/index'
export default {
  name: '',
  props: {
    sqlDetailsIsShow: {
      type: Boolean,
      default: true
    },
    rowTopicSql: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 对话框是否显示
      sqlDetailsIsShowChilren: this.sqlDetailsIsShow,
      // 表头
      sqlDetailTableColumn: [],
      // 表格数据
      sqlDetailTableData: [],
      // tableColSql: '',
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      }

    }
  },
  watch:{
    sqlDetailsIsShow(val){
      this.sqlDetailsIsShowChilren = val
    },
    sqlDetailsIsShowChilren(val){
      if(!val){
        this.$emit('sqlCloseDetailDialog')
      }
    }
  },
  created() {
    // 获取表格数据
    this.getSqlTableData()
  },
  methods: {
    // 对话框关闭之前调用事件
    closeDialog() {
      this.sqlDetailsIsShowChilren = false
      this.$emit('sqlCloseDetailDialog',this.sqlDetailsIsShowChilren)
    },
    // 详情表格序号
    getRowIndex(index) {
      return (
        (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
      )
    },
    // 获取sql表格数据
    getSqlTableData() {
      const props = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        sql: this.rowTopicSql
      }
      API.getExecuteSql(props).then((res) => {
        const { code, data, message } = res
        if (String(code) === '200') {
          if (data.list && data.list.length > 0) {
            this.sqlDetailTableColumn = Object.keys(data.list[0]) // 获取表头数据
          }
          const qq = this.sqlDetailTableColumn
          this.sqlDetailTableColumn = []
          this.$set(this.sqlDetailTableColumn, 'value', qq)
          this.sqlDetailTableData = data.list
          this.pager.total = data.total
        } else {
          this.$message.error(message)
        }
      })
    },
    pagerDetailhandleSizeChange(val) {
      this.pager.pageSize = val
      this.getSqlTableData()
    },
    pagerDetailhandleCurrentChange(val) {
      this.pager.pageNum = val
      this.getSqlTableData()
    }
  }
}
</script>

<style lang="" scoped>
.noData{
  width: 600px;
  height: 400px;
  margin: 100px auto;
  line-height: 400px;
  text-align: center;
}
.pager-section{
  text-align: right;
  margin-top: 10px;
}
</style>
