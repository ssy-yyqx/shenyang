<template>
  <Container>
    <div class="container"
      v-loading="loading2"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      plain style="margin-bottom:12px;padding:9px 20px;" 
    >
      <div class="container">
        <!--操作栏 -->
        <div class="handle-box">
          <el-button type="primary" icon="el-icon-plus" class="mr10" @click="addDeployment">新增部署</el-button>
          <!-- 刷新 -->
          <el-button type="primary" plain style="padding:9px 20px;" @click="refresh">刷 新</el-button>
        </div>

        <!-- table主要区域 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          border
          style="overflow:auto"
          :header-cell-style="{ background: '#1F7FD8', color: '#F8F8F8' }"
          class="table"
          header-cell-class-name="table-header"
        >
          <el-table-column prop="forceCode" label="部队内码" align="center" :render-header="renderHeader" />
          <el-table-column prop="forceSequence" label="部队序号" align="center" :render-header="renderHeader" />
          <el-table-column prop="forceName" label="部队番号" align="center" :render-header="renderHeader" />
          <el-table-column prop="ip" label="IP" align="center" :render-header="renderHeader" />
          <el-table-column prop="port" label="端口" align="center" :render-header="renderHeader" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-s-operation"
                class="blue"
                @click="testConnection(scope.$index, scope.row)"
              >测试连接</el-button>
              <el-button
                type="text"
                icon="el-icon-edit"
                class="blue"
                @click="editDeployment(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                style="color:red"
                @click="delDeployment(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
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
      <addOreditVisible v-if="addVisible" :add-visible="addVisible" :row-column="rowColumn" :title="title" @getData="getData" @colseDialog="colseDialog" />
    </div>

    <!-- 过滤 -->
    <el-dialog
      title=""
      :visible.sync="dialogVisibleFilter"
      width="30%"
    >
      <el-form v-if="dialogVisibleFilter" label-position="top" label-width="80px" :model="formFilter">
        <el-form-item :label="labelFilter">

          <el-input v-model="formFilter.inputData" placeholder="请输入" />
          <!-- <el-select v-if="columnProperty==='isConfirm'" v-model="formFilter.inputData" placeholder="请选择">
            <el-option
              v-for="item in fileTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->

          <!-- <el-date-picker
            v-if="columnProperty=='assignData'"
            v-model="formFilter.inputData"
            type="date"
            format="yyyy - MM - dd "
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 100%;"
            @change="dateFilter"
          /> -->
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
import addOreditVisible from './addOreditVisible'
import * as API from '@/api/index'
export default {
  components: { Container, addOreditVisible },
  data() {
    return {
      loading2:false,
      formFilter: {
        inputData: ''
      },
      tableData: [],
      addVisible: false,
      // 分页
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      title: '',
      rowColumn: {},
      dialogVisibleFilter: false
    }
  },
  mounted() {
    this.getDeployment()
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
      const data = {

        'pageNum': this.pager.currentPage,
        'pageSize': this.pager.pageSize,
        sortColumnMap: sortColumnMap || {}
      }
      API.deployList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.pager.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 降序
    RowcaretBottom(column, index) {
      const sortColumnMap = {
        [column.property]: 'DESC'
      }
      const data = {
        'pageNum': this.pager.currentPage,
        'pageSize': this.pager.pageSize,
        sortColumnMap: sortColumnMap || {}
      }
      API.deployList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.pager.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
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
      this.formFilter.inputData = ''
    },
    // 过滤模态框确定按钮
    sureFilter() {
      this.dialogVisibleFilter = true
      const data = {
        'pageNum': this.pager.currentPage,
        'pageSize': this.pager.pageSize,
        [this.columnProperty]: this.formFilter.inputData || ''
      }
      API.deployList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.pager.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      this.dialogVisibleFilter = false
    },
    // 时间过滤器
    dateFilter(val) {
      this.formFilter.inputData = val
    },
    getData(value) {
      // this.getDeployment()
    },
    // 刷新
    refresh() {
      this.loading2 = true
      this.formFilter.inputData = ''
      this.columnProperty = ''
      this.getDeployment()
    },
    colseDialog(val) {
      this.addVisible = val
      this.getDeployment()
    },
    // 查询部署表
    getDeployment(value) {
      let data = {}
      if (value) {
        data = {
          'forceCode': value.forceCode,
          'forceName': value.forceName,
          'forceSequence': value.forceSequence,
          'ip': value.ip,
          'pageNum': this.pager.currentPage,
          'pageSize': this.pager.pageSize,
          'port': value.port
        }
      } else {
        data = {
          'pageNum': this.pager.currentPage,
          'pageSize': this.pager.pageSize
        }
      }
      API.deployList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.pager.total = res.data.total
          
        } else {
          this.$message.error(res.msg)
        }
        this.loading2 = false
      })
    },
    // 新增
    addDeployment() {
      this.title = '新增部署表信息'
      this.addVisible = true
    },
    // 删除
    delDeployment(index, row) {
      const params = {
        ids: row.id
      }
      API.deleteDeploy(params).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功！')
          this.getDeployment()
        } else {
          this.$message.error('删除失败！')
        }
      })
    },
    // 编辑
    editDeployment(index, row) {
      this.title = '编辑部署表信息'
      this.rowColumn = row
      this.addVisible = true
    },
    // 测试连接
    testConnection(index, row) {
      const props = {
        ip: row.ip,
        port: row.port
      }
      API.testConnect(props).then(res => {
        console.log(res)
        const { code, data } = res
        if (String(code) === '200') {
          if (data === true) {
            this.$message.success('测试连接成功')
          } else {
            this.$message.error('测试连接失败')
          }
        } else {
          this.$message.error('测试连接失败')
        }
      })
    },

    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getData(this.allData)
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getData(this.allData)
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .qiefen-dialog-class{
  margin-top: 15vh !important;;
}
>>> .el-table__body-wrapper{
  height: 615px;
  overflow: auto;
}
.pagination{
  display: flex;
  justify-content: flex-end;
  margin: 11px 0;
}
.container {
  height: 100%;
  width: 100%;
  padding: 10px;
  background-color: #fff;
}
.handle-box {
    margin-bottom: 20px;
}
.mr10 {
    margin-right: 10px;
    background: #1f7fd8;
}
</style>
