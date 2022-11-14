<template>
  <Container>
    <div class="total-section">
      <div class="top-section">
        <div class="search-section">
          <el-form ref="queryForm" :model="queryForm" class="form-section" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="数据类别名称" prop="tableComment">
                  <el-input v-model="queryForm.tableComment" autocomplete="off" size="mini" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数据类别标识" prop="tableName">
                  <el-input v-model="queryForm.tableName" autocomplete="off" size="mini" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数据种类" prop="tableCategory">
                  <select-tree
                    ref="select_tree"
                    v-model="queryForm.tableCategory"
                    :options="dataTypes"
                    :is-show="isShow"
                    :props="selectTreeOption"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="button-section">
            <el-button
              style="background: #1F7FD8;color: #FFFFFF"
              size="mini"
              @click="onhandleQuery"
            >查询</el-button>
            <el-button size="mini" @click="onHandleReset">重置</el-button>
          </div>
        </div>
        <div class="table-section">
          <el-table
            :data="tableData"
            border
            style="width:100%;"
            height="100%"
            :header-cell-style="{background:'#1F7FD8',color:'#F8F8F8'}"
            :index="indexMethod"
          >
            <el-table-column label="序号" type="index" width="50" :index="indexMethod" />
            <el-table-column
              label="数据类别名称"
              prop="tableComment"
              align="left"
              min-width="120px"
              show-overflow-tooltip
            />
            <el-table-column
              label="数据类别标识"
              prop="tableName"
              align="left"
              min-width="120px"
              show-overflow-tooltip
            />
            <el-table-column
              label="数据种类"
              prop="categoryName"
              align="left"
              min-width="120px"
              show-overflow-tooltip
            />
            <el-table-column label="操作" align="left" width="350">
              <template slot-scope="scope">
                <el-button
                  class="aStyle"
                  type="text"
                  size="mini"
                  @click="onHandleDetail(scope.row)"
                >详情</el-button>
                  <el-button class="aStyle" type="text" size="mini" @click="onHandleEdit(scope.row)">
                    编辑
                  </el-button>
                <!-- <el-button class="aStyle" type="text"  size="mini" @click="onHandleDel(scope.row)">删除</el-button> -->
                <el-button
                  class="aStyle"
                  type="text"
                  size="mini"
                  @click="onHandleProcessTask(scope.row)"
                >任务下发</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pager-section">
          <el-pagination
            :current-page="pager.pageNum"
            :page-sizes="pager.pageSizes"
            :page-size="pager.pageSize"
            layout="total, prev, pager, next, sizes"
            :total="pager.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <el-dialog
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :title="dialogFormTitle"
        width="30%"
        custom-class="qiefen-dialog-class"
        @close="closeToolForm"
      >
        <div class="transfer">
          <!-- 左框 -->
          <div class="list left">
            <el-tree
              v-if="dialogFormVisible"
              ref="sendTree"
              :data="treeData"
              show-checkbox
              node-key="id"
              :expand-on-click-node="true"
              :auto-expand-parent="false"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
              @check="check"
            />
          </div>
          <!-- 添加/删除 -->
          <!-- <div class="content">
            <el-button icon="el-icon-d-arrow-right" circle @click="push" />
            <br>
            <br>
            <el-button icon="el-icon-d-arrow-left" circle @click="del" />
          </div> -->
          <!-- 右框 -->
          <!-- <div class="list right">
            <template v-for="(item,index) in pros">
              <li :key="index" ref="bgc" class="lis">
                <div :id="item" style="cursor:pointer" @click="addArr(item,index)">{{ item }}</div>
              </li>
            </template>
          </div> -->
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" class="btn_theme" style="background:#1f7cd7" @click="onhandleToolSave">下 发</el-button>
          <el-button @click="closeToolForm">取 消</el-button>
        </div>
      </el-dialog>
      <div class="button-section">
        <el-button
          size="mini"
          icon="el-icon-plus"
          style="float:left;margin-left: 10px;margin-top:5px;margin-bottom:5px;background: rgba(31, 127, 216);color: rgba(255, 255, 255);"
          @click="onHandleAdd"
        >新增表</el-button>
      </div>
      <div v-if="dialogVisible" class="bottom-section">
        <div class="bottom-table-section">
          <EditTable
            ref="editTables"
            :showID="showID"
            :operation="operation"
            :table-row="tableRow"
            :select-tree-option="selectTreeOption"
            :data-types="dataTypes"
            :form="form"
            :disabled="isDisabled"
            :table-header="tableHeader"
            :show-index="showIndex"
            @changeLinkTable="changeLinkTable"
            @tableReload="tableReload"
          />
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container'
import EditTable from './EditTable'
import SelectTree from './SelectTree'
import * as API from '@/api/index'
import 'element-ui/lib/theme-chalk/index.css'
const formData = {
  tableComment: '',
  tableName: '',
  tableCategory: '',
  tableColumnData: []
}
export default {
  components: { Container, EditTable, SelectTree },
  data() {
    return {
      showID:false,
      operation: 'add',
      tableRow: {},
      dataTypeOptionLabel: undefined,
      dataTypeOptionValue: undefined,
      queryForm: {
        tableComment: '',
        tableName: '',
        tableCategory: ''
      },
      form: Object.assign({}, formData),
      dataTypes: [],
      isShow: false,
      disabled: false,
      editTableData: [],
      showIndex: false,
      tableHeader: [],
      linkTableList: [],
      structureList: [],
      checkArr: [],
      pros: [], // 右边框的数据
      selectTreeOption: {
        parent: 'parentId',
        value: 'categoryId',
        label: 'categoryName',
        children: 'childList'
      },
      defaultProps: {
        children: 'childList',
        label: 'label'
      },
      dialogVisible: false,
      dialogFormVisible: false, // 任务下发弹出框
      dialogFormTitle: '任务下发',
      dataList: [],
      childrenDataList: [],
      isDisabled: false,
      // 表格数据
      tableData: [],
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      currentRow: null,
      currentIndex: 0,
      data: [],
      pushData: [],
      rightData: [],
      selectName: '',
      colors: true,
      rightForceCode: [],
      forceCodes: [],
      treeData: [],
      tableCommit: '',
      tableName: ''
    }
  },

  created() {
    this.getTableList()
    this.getDataTypes()
    this.getLinkTableList()
  },
  mounted() {},
  methods: {
    
    indexMethod(index) {
      return index + this.pager.pageSize * (this.pager.pageNum - 1) + 1
    },
    changeLinkTable(tableName, tabObj) {
      if (!tableName) {
        return false
      }
      const params = {
        tableName: tableName
      }
      API.getStructureList(params).then(res => {
        const { code, data, msg } = res
        if (code === 200) {
          this.structureList = data
          this.structureList.forEach(item => {
            item.label = item.comments
            item.value = item.columnName
          })
          tabObj.optionList = this.structureList
        } else {
          this.$message.error(msg)
        }
      })
    },
    handleCheckChange(data, ischecked, subDatae) {
      if (ischecked) {
        this.$refs.selectOptionTree.setCheckedNodes([])
        this.$refs.selectOptionTree.setCheckedNodes([data])
        this.dataTypeOptionValue = data.value
        this.dataTypeOptionLabel = data.label
      }
    },
    getLinkTableList() {
      API.getLinkTableList().then(res => {
        const { code, data, msg } = res
        if (code === 200) {
          this.linkTableList = data
          this.getTableHeader()
        } else {
          this.$message.error(msg)
        }
      })
    },
    getDataTypes() {
      API.getDataTypes().then(res => {
        const { code, data, msg } = res
        if (code === 200) {
          this.dataTypes = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    tableReload() {
      this.dialogVisible = false
      this.getTableList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 点击任务下发
    onHandleProcessTask(row) {
      this.forceCodes = []
      console.log(row)
      this.tableCommit = row.tableComment
      this.tableName = row.tableName
      // 新增的表单
      this.toolTitle = '任务下发'
      this.dialogFormVisible = true
      const props = {
        deploy: '1'
      }
      API.getForceTree(props).then(res => {
        const { data, msg, code } = res
        if (String(code) === '200') {
          this.treeData = data
        } else {
          this.$message.error(msg)
        }
      })
    },

    // 点击树的下一个节点
    handleNodeClick(data) {
      this.data = data
    },
    check(val, data) {
      data.checkedNodes.forEach(item => {
        this.forceCodes.push(item.field)
      })
    },

    // 任务下发对话框点击确定
    onhandleToolSave() {
      
      // this.currentRow.isSend = true
      // this.$set(this.tableData, this.currentRow.$index, this.currentRow)
      // this.pros = [];

      // const forceCode = []

      // console.log(this.rightForceCode)

      // this.tableData.forEach(i => {
      //   tableCommit = i.tableComment
      //   tableName = i.tableName
      // })

      // if (this.pushData.length == 0) {
      //   return this.$message.error('请选择要下发的任务')
      // }

      const data = {
        forceCodes: this.forceCodes,
        tableCommit: this.tableCommit,
        tableName: this.tableName
      }

      console.log(data)
      API.getAssign(data).then(res => {
        console.log(res)
        const { msg, code } = res
        if (String(code) === '200') {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
        // if (res.code == 200) {
        //   this.$message.success(res.msg)
        //   this.pushData = []
        //   this.rightForceCode = []
        // } else {
        //   this.$message.error(res.msg)
        // }
      })

      this.dialogFormVisible = false

      // if (this.$refs.sendTree !== undefined) {
      //   this.$refs.sendTree.setCheckedKeys([])
      // }
    },
    closeToolForm() {
      // this.onHandleProcessTask();
      this.dialogFormVisible = false
      this.pros = []
      if (this.$refs.sendTree !== undefined) {
        this.$refs.sendTree.setCheckedKeys([])
      }
    },

    // 往右边框添加左边框的东西
    push() {
      this.getPros()
    },
    getPros() {
      if (this.pushData.indexOf(this.data.id) == -1) {
        this.pushData.push(this.data.id)
        this.rightForceCode.push(this.data.forceCode)
        this.pros.push(this.data.forceNumber)

        // console.log(this.data.id,this.data.forceNumber,this.pushData);
      } else {
        this.$message.error('已存在数据')
        return
      }
    },
    addArr(value, index) {
      if (this.colors) {
        // console.log(this.colors);

        this.$refs.bgc[index].style.background = '#1f7fd8'
        this.$refs.bgc[index].style.color = '#fff'
        this.colors = false
      } else {
        // console.log(this.colors);
        this.$refs.bgc[index].style.background = ''
        this.$refs.bgc[index].style.color = ''

        this.colors = true
      }

      this.rightData = [value]
    },
    // 移除数据
    del() {
      var treeDeleteList = []
      this.pros.forEach(i => {
        console.log(this.pros, this.rightData)

        var isHave = this.rightData.some(j => {
          return i === j
        })
        console.log(isHave)

        if (!isHave) {
          treeDeleteList.push(i)
          console.log(treeDeleteList)
        }
      })
      this.pros = [...treeDeleteList]
      this.pushData = []
    },
    getTableHeader() {
      this.tableHeader = [
        {
          name: 'columnName',
          title: '字段标识',
          type: 'text'
        },
        {
          name: 'columnComment',
          title: '字段名称',
          type: 'text'
        },
        {
          name: 'columnType',
          title: '字段类型',
          type: 'select',
          data: [
            {
              label: 'VARCHAR2',
              value: 'VARCHAR2'
            },
            {
              label: 'NUMBER',
              value: 'NUMBER'
            },
            {
              label: 'DATETIME',
              value: 'DATETIME'
            },
            {
              label: 'BLOB',
              value: 'BLOB'
            }
          ]
        },
        {
          name: 'columnLength',
          title: '字段长度',
          type: 'text',
          dataType: 'number',
          relate: [],
          data: []
        },
        {
          name: 'isPrimaryKey',
          title: '是否为主键',
          type: 'select',
          relate: [],
          data: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        {
          name: 'isNullable',
          title: '非空',
          type: 'select',
          data: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        {
          name: 'columnRefTable',
          title: '关联表',
          type: 'select',
          data: this.linkTableList,
          alisAName: 'linkTable'
        },
        {
          name: 'columnRefTableColumn',
          title: '关联字段',
          type: 'select',
          data: this.structureList,
          alisAName: 'structureList'
        },
        {
          name: 'columnRefTableColumnValue',
          title: '关联显示字段',
          type: 'select',
          data: this.structureList,
          alisAName: 'structureList'
        },
        {
          name: 'columnRefTableColumnSequence',
          title: '关联序号',
          type: 'select',
          data: this.structureList,
          alisAName: 'structureList'
        }
      ]
    },
    getTableList() {
      var page = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize
      }
      var props = Object.assign({}, page, this.queryForm)
      API.getTaskTableList(props).then(res => {
        const { code, data, msg } = res
        // console.log(res);

        if (code === 200) {
          this.tableData = data.list
          // console.log(this.tableData );

          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    /** 搜索按钮操作 */
    onhandleQuery() {
      // this.pager.pageNum = 1
      // let reg= new RegExp('^[\u4e00-\u9fa5_]+$')

      // if(!reg.test(this.queryForm.tableComment)){
      //    this.$message.warning('数据类别名称只能为中文或者下划线');
      //    return false
      // }
      // let tableNameReg = new RegExp('^[a-zA-Z_]+$')
      // if(!tableNameReg.test(this.queryForm.tableName)){
      //    this.$message.warning('数据类别标识只能为英文或者下划线');
      //    return false
      // }
      this.getTableList()
    },
    /** 重置按钮操作 */
    onHandleReset() {
      // this.$refs.queryForm.resetFields()
      this.queryForm = {
        tableComment: '',
        tableName: '',
        tableCategory: ''
      }

      this.$refs.select_tree.qingkong()
      this.getTableList()
    },
    reset() {
      const obj = {}
      obj.stopPropagation = () => {}
      try {
        this.$refs.enum_right.clearValue(obj)
      } catch (err) {
        this.$refs.enum_right.handleClear(obj)
      }
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      console.log(val)
      this.pager.pageSize = val
      this.getTableList()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.pageNum = val
      this.getTableList()
    },
    onHandleAdd() {
      formData.tableColumnData = []
      this.form = Object.assign({}, formData)
      this.dialogVisible = true
      this.isDisabled = false
      this.showID = true
      this.$nextTick(()=>{
        this.$refs.editTables.$refs.selectTree.qingkong()
      })
      this.operation = 'add'
    },
    onHandleEdit(data) {
      // 修改的表单
      this.isDisabled = false
      this.getsubList(data)
      this.form = Object.assign({}, formData, data)
      this.dialogVisible = true
      this.operation = 'edit'
    },
    getsubList(paraData) {
      const params = {
        tableName: paraData.tableName
      }
      API.getsubList(params).then(res => {
        const { code, data, msg } = res
        if (code === 200) {
          formData.tableColumnData = data
          formData.tableColumnData.forEach(item => {
            this.changeLinkTable(item.columnRefTable, item)
          })
          this.form = Object.assign({}, formData, paraData)
        } else {
          this.$message.error(msg)
        }
      })
    },
    onHandleDetail(data) {
      // 新增的表单
      this.isDisabled = true
      this.getsubList(data)
      this.form = Object.assign({}, formData, data)
      this.dialogVisible = true
      this.operation = 'detail'
    },
    onHandleDel(data) {
      this.$confirm('确定要删除这条任务吗？')
        .then(() => {
          API.delTask(data).then(res => {
            const { code } = res
            if (code === 200) {
              this.$message.success('删除任务成功')
            } else {
              this.$message.error('删除任务失败')
            }
          })
        })
        .catch(() => {
          this.$message.error('删除任务失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.aStyle {
  color: #2f76c0;
  padding: 2px;
}
.el-table::before {
  z-index: inherit;
}
.total-section {
  height: 100%;
  width: 100%;
  background: #ffffff;
  border-radius: 5px;
  padding: 5px 0;
  .top-section {
    width: 100%;
    height: 50%;
    // border: 1px solid #e9eaef;
    .search-section {
      width: calc(100% - 20px);
      height: 55px;
      position: relative;
      border: 1px solid #e9eaef;
      padding: 10px;
      margin: 10px;
      display: flex;
      .form-section{
        width: calc(100% - 200px);
      }
    }
    .button-section{
      width: 200px;
      text-align: right;
    }
    .table-section {
      padding-left: 10px;
      padding-right: 10px;
      width: 100%;
      height: calc(100% - 110px);
    }
    .pager-section {
      margin-top: 5px;
      padding-right: 5px;
      text-align: right;
      font-size: 15px;
      width: 100%;
      height: 40px;
    }
  }
  .button-section{
    height: 50px;
  }
  .bottom-section {
    width: 100%;
    height: 50%;
    padding: 0 10px;
    .bottom-table-section{
      height: calc(100% - 60px);
    }
  }
}

.transfer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.transfer > .list {
  // width: 300px;
  width: 90%;
  height: 350px;
  // border: 2px solid #bee8fb;
  list-style: none;
}
.content {
  font-size: 30px;
  margin: 0 20px;
  color: #bee8fb;
}
.list > li {
  width: 100%;
  height: 26px;
  line-height: 26px;
  text-align: center;
}
.list > li :hover {
  //  width: 100%;
  // height: 26px;

  background-color: #2f76c0;
  color: #fff;
  box-sizing: border-box;
}
.dialog-footer {
  margin-top: 10px;
}
// .lis :hover{
//   width: 100%;
//   height: 26px;
//   line-height: 26px;
//   background-color: #2f76c0;
//   color: #fff;
// }
</style>
