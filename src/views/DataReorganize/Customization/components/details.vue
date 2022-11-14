<template>
  <div>
    <!-- 详情对话框 -->
    <el-dialog
      title="查看主题数据"
      :visible.sync="detailsIsShowChilren"
      width="80%"
      height="800px"
      custom-class="qiefen-dialog-class"
      top="50px"
      @before-close="closeDialog"
    >
      <div v-if="tabList && tabList.length > 0" class="detail-class">
        <div class="con-header">
          <el-tabs v-model="checkedTable" type="card" @tab-click="topRadioChange">
            <el-tab-pane v-for="(item) in tabList" :key="item.tableName" :label="item.tableComment" :name="item.tableName" />
          </el-tabs>
        </div>
        <div class="table-bon">
          <div class="table-section">
            <el-table
              :data="subTableData"
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
                v-for="item in subTableColumn"
                :key="item.labelCode"
                :label="item.labelName"
                :prop="item.labelCode"
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
        style="
          width: 600px;
          height: 400px;
          margin: 100px auto;
          line-height: 400px;
          text-align: center;
        "
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
    detailsIsShow: {
      type: Boolean,
      default: true
    },
    tabList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 对话框是否显示
      detailsIsShowChilren: this.detailsIsShow,
      // 当前选中tab
      checkedTable: '',
      // 表头
      subTableColumn: [],
      // 表格数据
      subTableData: [],
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      }
    }
  },
  created() {
    if (this.tabList && this.tabList.length > 0) {
      this.checkedTable = this.tabList[0].tableName
      // 获取表格数据
      this.getSubTableData()
    }
  },
  methods: {
    closeDialog() {
      this.detailsIsShowChilren = false
      this.$emit('closeDetailDialog')
    },
    // 表切换
    topRadioChange(tableName) {
      this.checkedTable = tableName.name
      this.pager.pageNum = 1
      this.pager.pageSize = 10
      this.getSubTableData()
    },
    // 详情表格序号
    getRowIndex(index) {
      return (
        (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
      )
    },
    // 获取详情表格数据
    getSubTableData() {
      const params = {
        tableName: this.checkedTable,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize
      }
      API.getThemeDetailData(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          const { tableFiled, tableData, total } = data
          this.subTableColumn = tableFiled
          this.subTableData = tableData
          this.pager.total = total
        } else {
          this.$message.error(msg)
        }
      })
    },
    pagerDetailhandleSizeChange(val) {
      this.pager.pageSize = val
      this.getSubTableData()
    },
    pagerDetailhandleCurrentChange(val) {
      this.pager.pageNum = val
      this.getSubTableData()
    }
  }
}
</script>

<style lang="" scoped>
.pager-section{
  text-align: right;
  margin-top: 12px;
}

</style>
