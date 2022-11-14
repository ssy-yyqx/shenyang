<template>
  <Container>
    <div class="total-section" 
        v-loading="loading2"
        element-loading-text="加载中"
        element-loading-background="rgba(255, 255, 255, 0.001)"
        style="margin-bottom:12px;padding:9px 20px;" 
      >
      <div class="table-section">
        <!-- 刷新 -->
        <el-button 
          type="primary"
          @click="refresh"
        >刷 新</el-button>
        <el-table
          :data="tableData"
          border
          height="650"
          stripe
          style="width: 100%"
        >
          <!-- <el-table-column
            type="selection"
            width="55"
            align="center"
          /> -->
          <el-table-column
            prop="tableName"
            label="表名称"
            align="center"
            :render-header="renderHeader"
          />
          <el-table-column
            prop="tableCommit"
            label="表注释"
            align="center"
            :render-header="renderHeader"
          />
          <el-table-column
            prop="forceCode"
            label="部队编号"
            align="center"
            :render-header="renderHeader"
          />
          <el-table-column
            prop="forceName"
            label="部队番号"
            :render-header="renderHeader"
            align="center"
          />
          <el-table-column
            prop="isConfirm"
            label="是否确认"
            align="center"
            :formatter="formatter"
            :render-header="renderHeader"
          />
          <el-table-column
            prop="assignData"
            label=" 下发日期"
            align="center"
            :render-header="renderHeader"
          />
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.isConfirm == '1'"
                style="color: #1f7fd8"
                @click="onHandleEdit(scope.row)"
              >确 认</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page="pager.pageNum"
            :page-sizes="pager.pageSizes"
            :page-size="pager.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pager.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

      </div>

    </div>
    <!-- 过滤 -->
    <el-dialog
      title=""
      :visible.sync="dialogVisibleFilter"
      width="30%"
    >
      <el-form v-if="dialogVisibleFilter" label-position="top" label-width="80px" :model="formFilter">
        <el-form-item :label="labelFilter">

          <el-input v-if="columnProperty==='tableName'||columnProperty==='tableCommit'||columnProperty==='forceName'||columnProperty==='forceCode'" v-model="formFilter.inputData" placeholder="请输入" />
          <el-select v-if="columnProperty==='isConfirm'" v-model="formFilter.inputData" placeholder="请选择">
            <el-option
              v-for="item in fileTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <!-- <div v-if="columnProperty=='assignData'">
            labelFilter
          </div> -->
          <el-date-picker
            v-if="columnProperty=='assignData'"
            v-model="formFilter.inputData"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
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
      formFilter: {
        inputData: ''
      },
      fileTypeOptions: [
        {
          value: '0',
          label: '未确认'
        },
        {
          value: '1',
          label: '已确认'
        }
      ],
      dialogVisibleFilter: false,
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      isConfirm: '', // 是否确认
      tableData: [], // 表格数据
      loading2:false // loading组件
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
    // 刷新
    refresh() {
      this.loading2 = true
      this.formFilter.inputData = ''
      this.columnProperty = ''
      this.getTableData()
    },
    // 获取表格数据
    getTableData(sortColumnMap) {
      const props = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        sortColumnMap: sortColumnMap || {},
        [this.columnProperty]: this.formFilter.inputData || ''
      }
      API.getCollectTask(props).then(res => {
        const { data, msg, code } = res
        if (String(code) === '200') {
          this.tableData = data.list
          this.pager.total = data.total
          
        } else {
          this.$message.error(msg)
        }
        this.loading2 = false
      })
    },
    // 是否确认
    formatter(row, column) {
      if (row.isConfirm === '0') {
        return '未确认'
      } else if (row.isConfirm === '1') {
        return '已确认'
      }
    },
    // 确认操作列
    onHandleEdit(row) {
      API.getCollectTaskConfirm({}, row.id).then(res => {
        const { msg, code } = res
        if (String(code) === '200') {
          this.$message.success('确认成功')
          this.getTableData()
        } else {
          this.$message.error(msg)
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.total-section{
  height: 100%;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 20px 20px;
  .table-section{
    // margin-top: 12px;
    >>>.el-table th{
      background: #1f7cd7;
      color: #fff;
    }
    .block{
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}

</style>
