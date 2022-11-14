<template>
  <Container>
    <div class="container">
      <div class="search-section">
        <el-form :model="searchForm" label-width="80px">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="模板名称">
                <el-input v-model="searchForm.modelName" clearable />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="searchForm.time"
                  type="date"
                  placeholder="选择日期"
                  clearable
                />
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-button type="primary" @click="onHandleSearch">搜索</el-button>
              <el-button type="default" @click="onHandleReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="toolbar-section">
        <el-button size="medium" @click="onHandleAddTemplate">
          <i class="el-icon-plus addButtonIcon" />新增模板
        </el-button>
        <!-- <el-button
          size="medium"
          :disabled="selectedRows.length === 0"
          @click="onHandleDeleteTemplates()"
        >
          <i class="el-icon-close deleteButtonIcon" />删除
        </el-button> -->
      </div>
      <div class="table-section">
        <el-table :data="tableData" stripe height="100%" border style="width: 100%;" @selection-change="handleSelectionChange">
          <!--
            <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          -->
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
                  <el-button type="text" @click="onHandleDownload(scope.row)">下载</el-button>
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
    </div>
    <TemplateForm v-if="showTemplateForm" :show-template-form="showTemplateForm" :type="type" :model-id="modelId" @close="showTemplateForm=false" @refreshTable="getTableList" />
  </Container>
</template>

<script>
import Container from '@/components/Container'
import TemplateForm from './TemplateForm1.vue'
import * as API from '@/api/DataPush'
export default {
  components: { Container, TemplateForm },
  data() {
    return {
      // 搜索条件
      searchForm: {
        modelName: ''
        // time: ''
      },
      // 表头
      tableColumns: [
        {
          label: '模板名称',
          prop: 'modelName',
          align: 'center'
        },
        {
          label: '模板文件(pdf)',
          prop: 'modelPdfName',
          align: 'center'
        },
        {
          label: '模板文件(word)',
          prop: 'modelWordName',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          width: 140
        },
        {
          label: '描述',
          prop: 'modelDescribe',
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
      // 是否显示模板表单
      showTemplateForm: false,
      // 表单类型
      type: 'add',
      // 模板ID
      modelId: ''
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
      API.getFixedModels(params).then(res => {
        const { code, rows, total, msg } = res
        if (String(code) === '200') {
          this.tableData = rows
          this.pager.total = total
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
        name: ''
        // time: ''
      }
      this.getTableList()
    },
    // 新增模板
    onHandleAddTemplate() {
      this.type = 'add'
      this.modelId = ''
      this.showTemplateForm = true
    },
    // 批量删除模板
    onHandleDeleteTemplates(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.deleteFixedModel({ modelId: row.modelId }).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            this.$message.success('删除模板成功！')
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
      this.modelId = row.modelId
      this.showTemplateForm = true
    },
    // 下载
    onHandleDownload(row) {
      API.getFixedModelFileById({ modelId: row.modelId }).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          const dom = document.createElement('a')
          dom.setAttribute('target', '_blank')
          dom.setAttribute('href', data)
          dom.click()
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 编辑
    onHandleEdit(row) {
      this.type = 'edit'
      this.modelId = row.modelId
      this.showTemplateForm = true
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
    }
  }
}
</script>

<style lang="scss" scoped>

>>> .el-button--primary{
  background-color: #1f7cd7;
}
.container{
  height: 100%;
  width: 100%;
  background: #fff;
  padding: 20px;
  .search-section{
    padding-top: 18px;
    border: 1px solid #e4dede;
  }
  .toolbar-section{
    padding: 10px 0 10px 0;
    .addButtonIcon {
      color: #067ef9;
      font-weight: bolder;
      margin: 0px 8px 0 -7px;
    }
  }
  .table-section{
    height: calc(100% - 159px);
  }
  .pager-section{
    margin-top: 10px;
    text-align: right;
  }
}
</style>
<style lang="scss" scoped>
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
</style>
