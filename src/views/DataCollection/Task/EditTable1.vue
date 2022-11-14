<template>
  <div class="total-section">
    <div class="toolbar-section">
      <div class="form-section">
        <el-form :model="form" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="数据类别名称">
                <el-input v-model="form.tableComment" size="mini" :disabled="operation==='edit'" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="数据类别标识">
                <el-input v-model="form.tableName" size="mini" :disabled="operation==='edit'" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="数据种类">
                <select-tree ref="selectTree" v-model="form.tableCategory" class="componentStype" :options="dataTypes" :is-show="isShow" size="mini" :props="selectTreeOption" :width="width" @appendTree="appendTree" @editTree="editTree" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="button-section">
        <el-button size="mini" icon="el-icon-check" class="el-button el-button--primary is-plain" @click="onHandleSave">保存</el-button>
        <el-button size="mini" icon="el-icon-plus" class="el-button el-button--success is-plain" @click="onHandleAdd">添加字段</el-button>
        <el-button size="mini" icon="el-icon-minus" class="el-button el-button--danger is-plain" @click="onHandleDelete">删除字段</el-button>
      </div>
    </div>
    <div class="table-section">
      <el-table
        ref="tableForm"
        :data="form.tableColumnData"
        class="tb-edit"
        border
        stripe
        style="width:100%;"
        height="100%"
        :highlight-current-row="!disabled"
        :header-cell-style="{background:'#1F7FD8',color:'#F8F8F8'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
          :selectable="checkboxT"
        />
        <el-table-column
          v-if="showIndex"
          type="index"
          width="50"
        />
        <el-table-column
          v-for="(item,index) in tableHeader"
          :key="index"
          :prop="item.name"
          :header-align="'center'"
          :align="item.align"
          :label="item.title"
          :fixed="item.fixed"
          :width="item.width"
          show-overflow-tooltip
        >
          <template slot="header" slot-scope="scope">
            <span
              v-if="scope.column.property==='columnName' ||
                scope.column.property==='columnComment' ||
                scope.column.property==='columnType' ||
                scope.column.property==='columnLength'"
              class="red"
            >*</span>
            {{ scope.column.label }}
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.isAdd">
              <el-select
                v-if="item.type === 'select'&&item.alisAName !=='linkTable'&&item.alisAName !=='structureList'"
                :id="scope.$index+'_select_'+ item.name"
                v-model="scope.row[item.name]"
                size="small"
                filterable
                placeholder=""
                value=""
                @click="handleEdit(scope.row,scope.$index,scope.row[item.name],item.relate)"
              >
                <el-option
                  v-for="option in item.data"
                  :key="option.value+'a'"
                  :disabled="disabled"
                  :value="option.value"
                  :label="option.label"
                />
              </el-select>
              <el-select
                v-else-if="item.type === 'select'&&item.alisAName ==='linkTable'"
                v-model="scope.row[item.name]"
                size="small"
                filterable
                placeholder=""
                value=""
                @change="changeLinkTable(scope.row[item.name],scope.row)"
                @click="handleEdit(scope.row,scope.$index,scope.row[item.name],item.relate)"
              >
                <el-option
                  v-for="option in item.data"
                  :key="option.SHOWNAME+'b'"
                  :disabled="disabled"
                  :value="option.SHOWNAME"
                  :label="option.TABLENAME"
                />
              </el-select>
              <el-select
                v-else-if="item.type === 'select'&&item.alisAName ==='structureList'"
                v-model="scope.row[item.name]"
                size="small"
                filterable
                placeholder=""
                value=""
                @click="handleEdit(scope.row,scope.$index,scope.row[item.name],item.relate)"
              >
                <el-option
                  v-for="option in scope.row.optionList"
                  :key="option.value+'c'"
                  :disabled="disabled"
                  :value="option.value"
                  :label="option.label"
                />
              </el-select>
              <el-button v-else-if="item.type === 'btn'" :disabled="disabled" type="primary" size="small" @click="onSelected(scope.$index,scope.row)">
                {{ item.text }}
              </el-button>
              <el-input
                v-else-if="item.type === 'text'&&item.dataType==='number'"
                v-model="scope.row[item.name]"
                type="number"
                size="small"
                :disabled="disabled"
                placeholder=""
                @click="handleEdit(scope.$index, item.name,scope.row[item.name])"
              />
              <el-input
                v-else
                v-model="scope.row[item.name]"
                size="small"
                :disabled="disabled"
                placeholder=""
                @click="handleEdit(scope.$index, item.name,scope.row[item.name])"
              />
            </template>
            <span>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="opration==='appendTree'?'新增数据类型':'修改数据类型'"
      :visible.sync="isShowOpreation"
      width="30%"
    >
      <el-input v-model="categoryName" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowOpreation = false">取 消</el-button>
        <el-button type="primary" @click="submitTreeData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/index'
import SelectTree from './SelectTree'
export default {
  components: { SelectTree },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tableRow: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    tableHeader: Array,
    dataTypes: Array,
    stripe: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    selectTreeOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    operation: String
  },
  data() {
    return {
      width: '240px',
      isShow: true,
      categoryName: '',
      isShowOpreation: false,
      opration: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: 'isParent'
      },
      optionLabel: undefined,
      optionValue: undefined,
      selectedRows: [],
      tableColumnTp: {}
    }
  },
  watch: {
  },
  methods: {
    // submitTreeData() {
    //   if (this.opration === 'appendTree') {
    //     this.$refs.selectTree.submitTreeData(this.categoryName)
    //     this.isShowOpreation = false
    //   } else {
    //     this.$refs.selectTree.editTreeData(this.categoryName)
    //     this.isShowOpreation = false
    //   }
    // },
    submitTreeData() {
      if (this.opration === 'appendTree') {
        if (this.categoryName) {
          this.$refs.selectTree.submitTreeData(this.categoryName)
        } else {
          this.$message({
            message: '数据类型不能为空',
            type: 'warning'
          })
        }

        this.isShowOpreation = false
      } else {
        if (this.categoryName) {
          this.$refs.selectTree.editTreeData(this.categoryName)
        } else {
          this.$message({
            message: '数据类型不能为空',
            type: 'warning'
          })
        }

        this.isShowOpreation = false
      }
    },
    appendTree(opration) {
      this.isShowOpreation = true
      this.opration = opration
      this.categoryName = ''
    },
    editTree(opration, categoryName) {
      this.isShowOpreation = true
      this.opration = opration
      this.categoryName = categoryName
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    changeLinkTable(tableName, tabObj) {
      this.$emit('changeLinkTable', tableName, tabObj)
    },
    // 批量删除
    onHandleDelete() {
      if (this.selectedRows.length < 1) {
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('是否删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const list = []
        this.selectedRows.forEach(item => {
          if (item.isAdd) {
            list.push(item)
          }
        })
        if (list && list.length > 0) {
          list.forEach(item => {
            const index = this.form.tableColumnData.findIndex(tableItem => tableItem.columnName === item.columnName)
            this.form.tableColumnData.splice(index, 1)
          })
        }
        // API.customizeDelete(this.form).then(res => {
        //   const { code, data, msg } = res
        //   if (code === 200) {
        //     this.$message.success(msg);
        //     this.selectedRows.forEach(item => {
        //       const index = this.form.tableColumnData.indexOf(item)
        //       if (index !== -1) {
        //         this.form.tableColumnData.splice(index, 1)
        //       }
        //     })
        //   } else {
        //     this.$message.error('删除失败')
        //   }
        // })
      })
    },
    // 保存前校验数据
    saveValidate(list) {
      if (this.operation === 'add') {
        // 必须含有主键
        const primaryItems = list.filter(item => item.isPrimaryKey === true)
        if (primaryItems.length < 1) {
          this.$message.warning('表必须有主键！')
          return false
        }
      }
      // 字段标识必选
      const columnNameList = list.filter(item => !item.columnName)
      if (columnNameList.length > 0) {
        this.$message.warning('字段标识不能为空！')
        return false
      }
      // 字段名称必选
      const columnCommentList = list.filter(item => !item.columnComment)
      if (columnCommentList.length > 0) {
        this.$message.warning('字段名称不能为空！')
        return false
      }
      // 字段类型必选
      const columnTypeList = list.filter(item => !item.columnType)
      if (columnTypeList.length > 0) {
        this.$message.warning('字段类型不能为空！')
        return false
      }
      // 字段长度必选
      const columnLengthList = list.filter(item => !item.columnLength)
      if (columnLengthList.length > 0) {
        this.$message.warning('字段长度不能为空！')
        return false
      }
      // 字段标识
      const tableNameReg = new RegExp('^[A-Z]+[A-Z_]*[A-Z]+$')
      const isColumnComment = list.every(item => tableNameReg.test(item.columnName))
      if (!isColumnComment) {
        this.$message.warning('字段标识只能为英文或者下划线')
        return false
      }
      // 字段名称
      const reg = new RegExp('^[\u4E00-\u9FA5A-Za-z0-9_]+$')
      const isColumnName = list.every(item => reg.test(item.columnComment))
      if (!isColumnName) {
        this.$message.warning('字段名称只能为中文或者下划线')
        return false
      }
      // 是否关联表，如果关联则最后四个字段都不能为空
      const relateTableList = list.filter(item => item.columnRefTable && (!item.columnRefTableColumn || !item.columnRefTableColumnValue || !item.columnRefTableColumnSequence))
      if (relateTableList.length > 0) {
        this.$message.warning('请将关联表信息填完整！')
        return false
      }
      return true
    },
    onHandleSave() {
      const reg = new RegExp('^[\u4E00-\u9FA5A-Za-z0-9_]+$')
      if (!reg.test(this.form.tableComment)) {
        this.$message.warning('数据类别名称只能为中文或者下划线')
        return false
      }
      const tableNameReg = new RegExp('^[A-Z][A-Z_]+[A-Z]+$')
      if (!tableNameReg.test(this.form.tableName)) {
        this.$message.warning('数据类别标识只能为大写英文和下划线组合')
        return false
      }

      if (this.form.tableCategory === '') {
        this.$message.warning('请选择数据种类')
        return false
      }
      // 参数整理
      const params = Object.assign({}, this.form)
      // 带保存的列表
      const list = []
      params.tableColumnData.forEach(item => {
        if (item.isAdd) {
          list.push(item)
        }
      })
      params.tableColumnData = list
      // 校验保存列表
      if (!this.saveValidate(list)) {
        return false
      }

      if (this.operation === 'add') {
        API.customizeSave(params).then(res => {
          const { code, msg } = res
          if (code === 200) {
            this.$message.success('新增成功！')
          } else {
            this.$message.error(msg)
          }
        })
      } else if (this.operation === 'edit') {
        // 不提供字段修改功能，只添加和修改
        API.taskUpdate(params).then(res => {
          const { code, msg } = res
          if (code === 200) {
            this.$message.success('修改成功！')
          } else {
            this.$message.error(msg)
          }
        })
      }
      this.$emit('tableReload')
    },
    onHandleAdd() {
      const tableRow = {
        columnComment: '',
        columnLength: '',
        columnName: '',
        columnRefTable: '',
        columnRefTableColumn: '',
        columnRefTableColumnValue: '',
        columnRefTableColumnSequence: '',
        columnType: '',
        isNullable: '',
        isPrimaryKey: '',
        optionList: [],
        isAdd: true
      }
      this.form.tableColumnData.push(tableRow)
    },
    handleEdit(row, index, value, relate) {
      if (value && relate) {
        API.getRelateTableInfo(value).then(res => {
          const { code, data, msg } = res
          if (code === 200) {
            if (relate.length > 0) {
              for (let i = 0; i < relate.length; i++) {
                const name = relate[i]
                const select = document.getElementById(index + '_select_' + name)
                if (data.length > 0) {
                  for (let j = 0; j < data.length; j++) {
                    const option = data[j]
                    // var opt = document.createElement('option')
                    // opt.value = option.columnName
                    // opt.label = option.comments
                    // this.$set(targetObject,targetKey,targetValue);
                    select.append('<el-option label="' + option.comments + '" value="' + option.columnName + '"/>')
                    this.select.$forceUpdate()
                  }
                }
              }
            }
          }
        })
      }
    },
    onSelected: function(index, row) {
      console.log(row)
      this.$emit('onTableBtn', { index: index, row: row })
    },
    checkboxT(row) {
      if (row.isAdd) {
        return 1
      }
      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .componentStype {
    width: 300px;
  }
  .tb-edit .el-input, .tb-edit .el-select {
    display: none
  }
  .tb-edit .current-row .el-input, .tb-edit .current-row .el-select {
    display: block
  }
  .tb-edit .current-row .el-input + span, .tb-edit .current-row .el-select + span {
    display: none
  }
  .total-section {
    width: 100%;
    height: 100%;
    .toolbar-section {
      width: 100%;
      height: 80px;
      display: grid;
      .form-section {
        height: 40px;
      }
      .button-section {
        height: 40px;
      }
    }
    .table-section {
      width: 100%;
      height: calc(100% - 80px);
    }
  }
  .toolbarStyle {
    margin-top: 10px;
    margin-bottom: 10px;
    float:left;
    color:#1F7CD7;
  }
  .red{
    color: red;
    padding-right: 5px;
  }
  .el-form-item{
    margin-bottom: 0px !important;
  }
</style>
