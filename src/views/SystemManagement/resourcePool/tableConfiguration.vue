<template>
  <el-dialog
    title="同步表配置"
    :visible.sync="tableConfigVisibles"
    width="65%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    custom-class="qiefen-dialog-class"
  >
    <div style="margin-bottom:10px;">
      
      <el-form ref="form" :model="form" :inline="true" label-width="100px">
        <el-form-item label="表注释">
          <el-input v-model="form.TABLENAME"></el-input>
        </el-form-item>
        <el-form-item label="表名称">
          <el-input v-model="form.SHOWNAME"></el-input>
        </el-form-item>
        <el-form-item label="是否同步">
          <el-select v-model="form.ISSYNC" placeholder="请选择">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item>
          
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="cancel">重置</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-button type="primary" @click="synchronization">同步</el-button>
        <el-button type="primary" @click="synchronizationFalse">取消同步</el-button>
      </div>
    </div>
    <el-table
      ref="multipleSelection"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;height: calc(100vh - 439px);"
      stripe
      border
      :index="indexMethod"
      :row-key="getRowKey"
      :header-cell-style="{background:'#1F7FD8',color:'#F8F8F8'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        :reserve-selection="true"
        type="selection"
        width="55"
        align="center"
      />
     <!--
        <el-table-column
        label="序号"
        :index="indexMethod"
        type="index"
        width="150"
        align="center"
      />
     -->
      <el-table-column
        label="表注释"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.TABLENAME }}</template>
      </el-table-column>
      <el-table-column
        prop="SHOWNAME"
        label="表名称"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="是否同步"
        prop="ISSYNC"
        width="200"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <p v-if="scope.row.ISSYNC==='0'">否</p>
          <p v-if="scope.row.ISSYNC==='1'">是</p>
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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="tableConfigVisibles = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as API from '@/api/index'
export default {
  props: {
    'tableConfigVisible': {
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        TABLENAME: '',
        SHOWNAME: '',
        ISSYNC: ''
      },
      tableConfigVisibles: this.tableConfigVisible,
      // 表格
      tableData: [],
      multipleSelection: [],
      // 分页
      pager: {
        pageNum: 1, // 当前页数
        pageSize: 10, // 一页几条
        total: 0, // 总条数
        pageSizes: [10, 15, 20, 30]
      },
      SHOWNAME: []
    }
  },
  watch: {
    tableConfigVisible(val) {
      this.tableConfigVisibles = val
    },
    tableConfigVisibles(val) {
      if (!val) {
        this.$emit('tableConfigVisibleFalse')
      }
    }
  },
  created() {
    this.getTables()
  },
  methods: {
    cancel(){
      this.getTables()
      this.form = {}
    },
    //查询
    onSubmit(){
      const data = {
        'pageNum': this.pager.pageNum,
        'pageSize': this.pager.pageSize,
        tableName:this.form.SHOWNAME,
        tableComment:this.form.TABLENAME,
        isSync:this.form.ISSYNC
      }
      API.getTables(data).then(res => {
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
    // 同步
    synchronization() {
      if (this.multipleSelection.length <= 0) {
        return this.$message.error('请选择要同步的表！')
      }
      const data = {
        'isSync': '1',
        'tableNames': this.SHOWNAME
      }
      // console.log(data)
      this.updateTableSync(data)
    },
    // 取消同步
    synchronizationFalse() {
      if (this.multipleSelection.length <= 0) {
        return this.$message.error('请选择要取消同步的表！')
      }
      const data = {
        'isSync': '0',
        'tableNames': this.SHOWNAME
      }
      // console.log(data)
      this.updateTableSync(data)
    },
    updateTableSync(data) {
      API.updateTableSync(data).then(res => {
        // console.log(res)
        if (res.code === 200) {
          console.log(data)
          if (data.isSync === '1') {
            this.$message.success('配置成功')
          } else if (data.isSync === '0') {
            this.$message.success('取消配置成功')
          }
          this.getTables()
          this.$refs.multipleSelection.clearSelection()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getRowKey(row) {
      console.log(row)
      return row.TABLENAME
    },
    // index配置   自定义序号
    indexMethod(index) {
      return index + this.pager.pageSize * (this.pager.pageNum - 1) + 1
    },
    getTables() {
      const data = {
        'pageNum': this.pager.pageNum,
        'pageSize': this.pager.pageSize
      }
      API.getTables(data).then(res => {
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
      this.tableConfigVisibles = false
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.multipleSelection = val
      // console.log(this.multipleSelection)
      this.SHOWNAME = this.multipleSelection.map(i => {
        return i.SHOWNAME
      })
    },
    // 分页
    handleSizeChange(val) {
      this.pager.pageSize = val
      // console.log(`每页 ${val} 条`)
      this.onSubmit()
    },
    handleCurrentChange(val) {
      this.pager.pageNum = val
      // console.log(`当前页: ${val}`)
      //this.getTables()
       this.onSubmit()
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
