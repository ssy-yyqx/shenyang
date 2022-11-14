<template>
  <Container>
    <Containertwo own-class="con-two">
      <div class="dataCust">
        <!-- 表单 -->
        <div class="queryCondition">
          <el-form
            ref="searchForm"
            :model="searchForm"
            label-position="right"
            label-width="85px"
            class="top-form"
          >
            <el-row :gutter="25" style="width: 100%">
              <el-col :span="6">
                <el-form-item
                  label="主题名称"
                  prop="topicName"
                  style="margin-left: 20px"
                >
                  <el-input
                    v-model="searchForm.topicName"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="主题描述" prop="topicDescribe">
                  <el-input
                    v-model="searchForm.topicDescribe"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6" style="text-align: center">
                <el-button
                  style="background: #1f7fd8; color: #fff"
                  @click="onhandleQuery"
                >查询</el-button>
                <!-- <el-button @click="reset">重置</el-button> -->
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 新增按钮 -->
        <div class="button-con">
          <el-button class="elbutton" @click="addRelevan">
            <img
              :src="require(`@/icons/newImages/buttonIcon/add.png`)"
              class="img-class"
              alt=""
            >
            <span>表关联</span>
          </el-button>
          <el-button class="elbutton" @click="addSql">
            <img
              :src="require(`@/icons/newImages/buttonIcon/add.png`)"
              class="img-class"
              alt=""
            >
            <span>SQL定制</span>
          </el-button>
        </div>
        <!-- 表格内容 -->
        <div class="table-bon">
          <div class="table-section">
            <el-table
              :data="tableData"
              stripe
              height="100%"
              header-row-class-name="header-row-class"
              border
              style="width: 100%"
              :index="table_index"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column
                label="序号"
                type="index"
                width="50"
                :index="table_index"
                align="center"
              />
              <el-table-column
                label="主题名称"
                prop="topicName"
                align="center"
                :render-header="renderHeader"
              />
              <el-table-column
                label="类型"
                prop="topicType"
                align="center"
                :formatter="formatter"
                :render-header="renderHeader"
              />
              <el-table-column
                label="创建时间"
                prop="createTime"
                align="center"
                :render-header="renderHeader"
              />
              <el-table-column
                label="主题描述"
                prop="topicDescribe"
                align="center"
                :render-header="renderHeader"
              />
              <el-table-column label="操作" align="center" width="250">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    style="color: #1f7fd8"
                    @click="onHandleView(scope.row)"
                  >
                    详情
                  </el-button>
                  <el-divider direction="vertical" />
                  <el-button
                    type="text"
                    size="small"
                    style="color: #1f7fd8"
                    @click="onHandleEdit(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-divider direction="vertical" />
                  <el-button
                    type="text"
                    size="small"
                    style="color: #1f7fd8"
                    @click="onHandleDeleteByRow(scope.row)"
                  >
                    删除
                  </el-button>
                  <el-divider direction="vertical" />
                  <el-button
                    type="text"
                    size="small"
                    style="color: #1f7fd8"
                    @click="onHandleDownLoad(scope.row)"
                  >
                    导出
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pager-section">
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
    </Containertwo>
    <!-- 导出 -->
    <Export v-if="isShowDialog" :is-show-dialog="isShowDialog" :topic-id="topicId" @changeIsShowDialog="changeIsShowDialog"/>
    <!-- 过滤 -->
    <Filtration :change-is-show="changeIsShow" :label-filter="labelFilter" :pager="pager" :column-property="columnProperty" @onFilterChange="onFilterChange" @filterTableData="filterTableData" />
    <!-- 表关联详情 -->
    <TableRelateDetail v-if="detailsIsShow" :details-is-show="detailsIsShow" :tab-list="tableList" @closeDetailDialog="closeDetailDialog" />
    <!-- sql定制详情 -->
    <SqlCustomizeDetail v-if="sqlDetailsIsShow" :sql-details-is-show="sqlDetailsIsShow" :row-topic-sql="rowTopicSql" @sqlCloseDetailDialog="sqlCloseDetailDialog" />
    <!-- 表关联新增编辑 -->
    <RelevanAddEdit v-if="addIsShow" :add-is-show="addIsShow" :type="relevanType" :edit-row="editRow" @closeaddRelaevanDialog="closeaddRelaevanDialog" @saveTheme="saveTheme" @updateTheme="updateTheme" />
    <!-- sql定制新增编辑 -->
    <AddEditSql v-if="sqlIsShow" :sql-is-show="sqlIsShow" :type="sqlType" :sql-edit-row="sqlEditRow" @closeaddSql="closeaddSql" @saveSqlTheme="saveSqlTheme" />
  </Container>
</template>

<script>
import * as API from '@/api/index'
import Container from '@/components/Container'
import Containertwo from '@/components/ContainerTwo'
import { TableRelateDetail, SqlCustomizeDetail } from './details'
import AddEditSql from '@/views/DataReorganize/Customization/components/addEditSql'
import Export from '@/views/DataReorganize/Customization/components/export'
import RelevanAddEdit from '@/views/DataReorganize/Customization/components/relevanAddEdit'
import Filtration from '@/views/DataReorganize/Customization/components/filtration'

export default {
  components: { Container, Containertwo, Export, Filtration, TableRelateDetail, SqlCustomizeDetail, RelevanAddEdit, AddEditSql },
  data() {
    return {
      // 表单查询
      searchForm: {
        topicName: undefined,
        topicDescribe: undefined
      },
      // 表格数据
      tableData: [],
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      isShowDialog: false, // 导出模态框
      topicId: '',
      changeIsShow: false, // 过滤模态框
      labelFilter: '', // 过滤标题
      columnProperty: '', // 过滤标题英文名
      filterData: {}, // 过滤的值
      detailsIsShow: false,
      // 详情表切换列表
      tableList: [],
      // 详情SQL定制弹窗关闭
      sqlDetailsIsShow: false,
      // sql定制详情语句
      rowTopicSql: '',
      // 表关联新增编辑弹窗关闭
      addIsShow: false,
      // 表关联编辑行
      editRow: {},
      // sql定制新增编辑弹窗
      sqlIsShow: false,
      // 关联表弹窗类型
      relevanType: 'add',
      // sql定制编辑行
      sqlEditRow: {},
      // sql定制弹窗类型
      sqlType: 'add'
    }
  },
  watch: {

  },
  created() {
    this.getTableData()
  },
  methods: {
    // 查询按钮
    onhandleQuery() {
      this.getTableData()
    },
    // 重置按钮
    reset() {
      this.$refs.searchForm.resetFields()
      this.getTableData()
    },
    // 表格相关=======================
    // index配置
    table_index(index) {
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    },
    // 表格复选框
    handleSelectionChange(val) {
      // this.selectedRows = val
    },
    // 表格类型
    formatter(row, column) {
      if (row.topicType === '0') {
        return '表关联 '
      } else if (row.topicType === '1') {
        return 'SQL定制'
      }
    },
    // 表头过滤
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
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getTableData()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.pageNum = val
      this.getTableData()
    },
    // 获取表格数据
    getTableData(sortColumnMap) {
      const page = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        sortColumnMap: sortColumnMap || {}
      }
      var props = Object.assign({}, page, this.searchForm)

      API.getThemeListData(props).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.tableData = data.list
          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 导出
    onHandleDownLoad(row) {
      this.isShowDialog = true
      this.topicId = row.topicId
    },
    // 监听导出变化框变化时触发的函数修改父组件的是否显示状态
    changeIsShowDialog(val) {
      this.isShowDialog = val
    },
    // 删除
    onHandleDeleteByRow(row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          API.deleteTheme({ topicId: row.topicId }).then((res) => {
            const { code, msg } = res
            if (String(code) === '200') {
              this.$message.success(msg)
              this.getTableData()
            } else {
              this.$message.error(msg)
            }
          })
        })
        .catch(() => {})
    },
    // 过滤
    Rowdataanalysis(column, index) {
      this.changeIsShow = true
      this.labelFilter = column.label
      this.columnProperty = column.property
    },
    // 监听过滤对话框变化时触发的函数修改父组件的是否显示状态
    onFilterChange(val) {
      this.changeIsShow = val
    },
    // 过滤表格更新事件
    filterTableData(val) {
      this.tableData = val
    },
    // 详情
    onHandleView(row) {
      console.log(row,row.topicType)
      this.tableList = []
      if (row.topicType === '0') { // 表关联
        this.detailsIsShow = true
        this.tableList = row.topicTableResponseList
      } else if (row.topicType === '1') { // sql定制
        this.sqlDetailsIsShow = true
        this.rowTopicSql = row.topicSql
      }
    },
    // 关闭详情弹窗 -- 表连接
    closeDetailDialog(val) {
      
      this.detailsIsShow = val
    },
    // 关闭sql定制详情弹窗
    sqlCloseDetailDialog(val) {
      console.log(val)
      this.sqlDetailsIsShow = val
    },
    // 表关联新增
    addRelevan() {
      this.editRow = {}
      this.relevanType = 'add'
      this.addIsShow = true
    },
    closeaddRelaevanDialog() {
      this.addIsShow = false
    },
    // sql按钮新增
    addSql() {
      this.sqlEditRow = {}
      this.sqlType = 'add'
      this.sqlIsShow = true
    },
    closeaddSql() {
      this.sqlIsShow = false
    },
    // 编辑
    onHandleEdit(row) {
      this.editRow = {}
      if (row.topicType === '0') { // 表关联
        this.addIsShow = true
        this.editRow = row
        this.relevanType = 'edit'
      } else if (row.topicType === '1') { // sql定制
        this.sqlIsShow = true
        this.sqlEditRow = row
        this.sqlType = 'edit'
      }
    },
    // 新增表关联
    saveTheme() {
      this.getTableData()
    },
    // 表关联更新
    updateTheme() {
      this.getTableData()
    },
    // 新增sql定制
    saveSqlTheme() {
      this.getTableData()
    }

  }
}
</script>

<style lang="scss" scoped>
>>> .el-button--primary{
  background: #1f7cd7;
}
.dataCust {
  height: 100%;
  .queryCondition {
    width: 100%;
    height: 50px;
    margin-bottom: 15px;
    border-radius: 7px;
    border: 1px solid #e9eaef;
    .top-form {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .button-con {
    width: 100%;
    height: 40px;
    padding: 5px 0;
    margin-bottom: 10px;
    .elbutton {
      margin-right: 15px;
      line-height: 30px;
      padding: 0px 15px;
      .img-class {
        vertical-align: bottom;
        border-style: none;
        height: 30px;
      }
    }
  }
  .table-bon {
    width: 100%;
    height: calc(100% - 115px);
    .table-section {
      width: 100%;
      height: calc(100% - 50px);
    }
    .pager-section {
      width: 100%;
      height: 30px;
      margin: 10px 0;
      text-align: right;
    }
  }
}
</style>
