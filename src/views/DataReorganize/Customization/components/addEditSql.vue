<template>
  <div>
    <!-- sql定制对话框 -->
    <el-dialog
      :title="dialogTitleSql"
      :visible.sync="sqlIsShowChilren"
      width="60%"
      custom-class="qiefen-dialog-class"
      top="10px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        ref="addThemeForm"
        :model="addThemeForm"
        :rules="themeRules"
        class="qiefen-dialog-form"
      >
        <el-row :gutter="150">
          <el-col :span="12">
            <el-form-item label="主题名称:" prop="topicName">
              <el-input v-model="addThemeForm.topicName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主题描述:" prop="topicDescribe">
              <el-input v-model="addThemeForm.topicDescribe" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="display:flex;justify-content: flex-end">
        <el-checkbox ref="checkboxRef" v-model="checkAll" :indeterminate="isIndeterminate" :disabled="rightTableData.length===0" style="margin-right:352px;margin-top:8px;" @change="handleCheckAllChange">全选</el-checkbox>
        <el-button ref="buttonRef" style="margin-bottom:10px;" @click="empty">清空</el-button>

      </div>

      <el-tabs v-model="activeTabs" tab-position="left" style="height:650px;" @tab-click="tabClick">
        <el-tab-pane label="选择表" name="first">
          <div style="">
            <el-row :gutter="10" style="margin-left: 0; margin-right: 0">
              <el-col :span="10" class="tree-box">
                <el-input
                  v-model="filterText"
                  style="padding: 5px 0"
                  prefix-icon="el-icon-search"
                  placeholder="输入要搜索内容..."
                />
                <el-scrollbar style="height: calc(100% - 42px)">
                  <el-tree
                    ref="treess"
                    class="filter-tree"
                    node-key="id"
                    :data="treeData"
                    :props="treeProps"
                    :filter-node-method="filterNode"
                    default-expand-all
                    :default-checked-keys="leftTreeDefaultCheckedKeys"
                    show-checkbox
                    check-on-click-node
                    @check="leftTreeClick('treess')"
                  />
                </el-scrollbar>
              </el-col>
              <el-col :span="4" class="botton-box">
                <el-button
                  icon="el-icon-arrow-right"
                  class="botton-box-button"
                  :disabled="leftTreeCheckList.length == 0"
                  @click="toRight"
                />
                <el-button
                  icon="el-icon-arrow-left"
                  class="botton-box-button"
                  :disabled="selecListSub.length == 0"
                  @click="toLeft('treess')"
                />
              </el-col>
              <el-col :span="10" class="list-box" style="padding-right: 0">
                <el-table
                  ref="checkListRef"
                  :data="rightTableData"
                  height="100%"
                  :show-header="false"
                  empty-text=" "
                  @selection-change="checkListChangeHandel"
                >
                  <el-table-column type="selection" width="45" align="center" />
                  <el-table-column
                    prop="label"
                    align="left"
                    show-overflow-tooltip
                  />
                  <el-table-column width="70px" align="center">
                    <!-- label非常重要 -->
                    <!-- 左边穿梭狂单选按钮 -->
                    <template v-slot="props">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="是否添加为主表"
                        placement="top-start"
                      >
                        <el-radio
                          v-model="isSelectName"
                          :label="props.row.tableName"
                          @change="handleRowChange(props.row)"
                        >{{ "" }}</el-radio>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="选字段" name="second">
          <div style="display: flex" class="table-section table-cols">
            <!-- 左边树状结构列表 -->
            <div
              class="tree-box"
              style="
                border-radius: 5px;
                height: 650px;
                width: 300px;
                overflow-x: auto;
                background-color: #fff;
              "
            >
              <el-input
                v-model="filterText"
                style="padding: 0 0 5px 0"
                prefix-icon="el-icon-search"
                placeholder="输入要搜索内容..."
              />
              <el-scrollbar style="height: 650px">
                <el-tree
                  ref="leftTree"
                  class="filter-tree"
                  style="height: 501px; width: 480px; overflow-y: scroll"
                  node-key="id"
                  :data="rightTableData"
                  :props="treeProps"
                  :filter-node-method="filterNode"
                  :default-checked-keys="keys"
                  check-on-click-node
                  @node-click="nodeClick"
                />
              </el-scrollbar>
            </div>
            <!-- 表格数据 -->
            <div style="background-color: #fff; width: 70%; margin-left: 10px">
              <el-table
                ref="duoxuanmultipleTable"
                :data="chooseFeildtableData"
                height="650"
                border
                stripe
                style="width: 100%; height: 650px"
                :cell-class-name="
                  ({ row, column, rowIndex, columnIndex }) => (
                    (row.index = rowIndex), (column.index = columnIndex)
                  )
                "
                @select="onHandleSelect"
                @select-all="handChange"
                @cell-click="tableCellClick"
              >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column
                  prop="tableColumn"
                  align="center"
                  label="字段标识"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="columnComment"
                  align="center"
                  label="字段名称"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="relationDictTable"
                  align="center"
                  label="关联字典表"
                  width="150"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span
                      v-if="
                        scope.row.index === tableCellClickRowIndex &&
                          scope.column.index === tableCellClickColumnIndex
                      "
                    >
                      <el-select
                        v-model="optionrelationDictTable[scope.row.index]"
                        filterable
                        placeholder="请选择"
                        @change="
                          (val) => {
                            tableCellInputBlur(val, scope.row);
                          }
                        "
                      >
                        <el-option
                          v-for="item in linkTableList"
                          :key="item.SHOWNAME"
                          :label="item.SHOWNAME"
                          :value="item.SHOWNAME"
                        />
                      </el-select>
                    </span>
                    <span v-else>{{ scope.row.relationDictTable }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="relationColumn"
                  align="center"
                  label="关联字段"
                  width="150"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span
                      v-if="
                        scope.row.index === tableCellClickRowIndex &&
                          scope.column.index === tableCellClickColumnIndex
                      "
                    >
                      <el-select
                        v-model="optionrelationColumn[scope.row.index]"
                        filterable
                        placeholder="请选择"
                        @change="
                          (val) => {
                            tableCellInputBlur(val, scope.row);
                          }
                        "
                      >
                        <el-option
                          v-for="item in structureList"
                          :key="item.columnName"
                          :label="item.columnName"
                          :value="item.columnName"
                        />
                      </el-select>
                    </span>
                    <span v-else>{{ scope.row.relationColumn }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="relationValue"
                  align="center"
                  label="关联显示字段"
                  width="150"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span
                      v-if="
                        scope.row.index === tableCellClickRowIndex &&
                          scope.column.index === tableCellClickColumnIndex
                      "
                    >
                      <el-select
                        v-model="optionrelationValue[scope.row.index]"
                        placeholder="请选择"
                        @change="
                          (val) => {
                            tableCellInputBlur(val, scope.row);
                          }
                        "
                      >
                        <el-option
                          v-for="item in structureList"
                          :key="item.columnName"
                          :label="item.columnName"
                          :value="item.columnName"
                        />
                      </el-select>
                    </span>
                    <span v-else>{{ scope.row.relationValue }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="columnAlias"
                  align="center"
                  label="字段别名"
                  width="150"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span
                      v-if="
                        scope.row.index === tableCellClickRowIndex &&
                          scope.column.index === tableCellClickColumnIndex
                      "
                    >
                      <el-input
                        v-model="inputcolumnAlias[scope.row.index]"
                        placeholder="请输入"
                        @change="
                          (val) => {
                            tableCellInputBlur(val, scope.row);
                          }
                        "
                      />
                    </span>
                    <span v-else>{{ scope.row.columnAlias }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="表连接" name="third">
          <div style="" class="table-section">
            <!-- 添加连接依据 -->
            <div
              style="
                background-color: #fff;
                width: 100%;
                display: flex;
                flex-direction: column;
                height: 300px;
              "
            >
              <div style="display: flex">
                <template>
                  <el-button
                    type="success"
                    style="width: 70px"
                    @click="onHandleAdd"
                  >
                    添加
                  </el-button>
                  <el-button
                    type="danger"
                    style="width: 70px"
                    @click="onHandleDelete"
                  >
                    删除
                  </el-button>
                </template>
              </div>

              <el-table
                ref="multipleTableAdd"
                height="200"
                stripe
                :data="form.tableColumnData"
                header-row-class-name="header-row-class"
                tooltip-effect="dark"
                style="width: 100%; margin-top: 5px"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column
                  v-for="(item, index) in tableRelateColumns"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <template v-if="item.useSlot">
                      <!-- 表名称 -->
                      <template v-if="item.prop === 'tableName'">
                        <el-select
                          v-model="scope.row[item.prop]"
                          placeholder="请选择"
                          style="width: 90%"
                          @change="tableCommentPrimary(scope.row[item.prop],scope.$index)"
                        >
                          <el-option
                            v-for="item1 in rightTableData"
                            :key="item1.tableName"
                            :label="item1.label"
                            :value="item1.tableName"
                          />
                        </el-select>
                      </template>
                      <!-- 表字段 -->
                      <template v-if="item.prop === 'tableColumn'">
                        <el-select
                          v-model="scope.row[item.prop]"
                          placeholder="请选择"
                          style="width: 90%"
                          @change="tableColumnsPrimary(scope.row[item.prop])"
                        >
                          <el-option
                            v-for="item1 in primaryTableColumns"
                            :key="item1.tableColumn"
                            :label="item1.columnComment"
                            :value="item1.tableColumn"
                          />
                        </el-select>
                      </template>
                      <!-- 关联类型 -->
                      <template v-if="item.prop === 'relationType'">
                        <el-select
                          v-model="scope.row[item.prop]"
                          placeholder="请选择"
                          style="width: 90%"
                          @change="relateTypeValue(scope.row[item.prop])"
                        >
                          <el-option
                            v-for="item1 in options"
                            :key="item1.value"
                            :label="item1.label"
                            :value="item1.value"
                          />
                        </el-select>
                      </template>
                      <!-- 关联表 -->
                      <template v-if="item.prop === 'relationTableName'">
                        <el-select
                          v-model="scope.row[item.prop]"
                          placeholder="请选择"
                          style="width: 90%"
                          @change="
                            onSelectOtherTable(
                              scope.row[item.prop],
                              scope.$index
                            )
                          "
                        >
                          <el-option
                            v-for="item1 in otherTables"
                            :key="item1.tableName"
                            :label="item1.label"
                            :value="item1.tableName"
                          />
                        </el-select>
                      </template>
                      <!-- 关联表字段 -->
                      <template v-if="item.prop === 'relationTableColumn'">
                        <el-select
                          v-model="scope.row[item.prop]"
                          placeholder="请选择"
                          style="width: 90%"
                        >
                          <el-option
                            v-for="item1 in otherTablesColumns[
                              scope.row.relationTableName
                            ]"
                            :key="item1.tableColumn"
                            :label="item1.columnComment"
                            :value="item1.tableColumn"
                          />
                        </el-select>
                      </template>
                    </template>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div
                style="
                  display: flex;
                  justify-content: flex-end;
                  margin: 10px 10px 0 0;
                "
              >
                <el-button
                  type="primary"
                  style="width: 80px; height: 32px"
                  @click="getGenSql(true)"
                >生成SQL</el-button>
              </div>
            </div>
            <!-- sql语句 -->
            <div
              style="
                background-color: #fff;
                width: 100%;
                margin-top: 10px;
                display: flex;
                justify-content: flex-start;
              "
            >
              <el-input
                v-model="textarea"
                :rows="2"
                style="width: 80%"
                type="textarea"
                placeholder="请输入内容"
              />
              <el-button
                type="primary"
                style="width: 80px; height: 32px; margin-left: 114px"
                @click="chaxunSql"
              >查询</el-button>
            </div>
            <!-- 连接依据表格数据-->
            <div

              style="background-color: #fff; width: 100%; margin-top: 10px"
              class="table-bon"
            >
              <div class="table-section">
                <el-table

                  ref="multipleTable"
                  border
                  stripe
                  height="215"
                  :data="tableJoinsTableData"
                  tooltip-effect="dark"
                  style=""
                >
                  <el-table-column
                    v-for="(item, index) in tableCol.value"
                    :key="index"
                    :label="item"
                    :prop="item"
                    align="center"
                    show-overflow-tooltip
                  />
                </el-table>
              </div>
              <!-- 分页 -->
              <div class="pager-section">
                <el-pagination

                  style="float: right; margin-top: 35px; margin-bottom: 70px"
                  :current-page="pager.pageNum"
                  :page-sizes="pager.pageSizes"
                  :page-size="pager.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="pager.total"
                  @size-change="handleSizeChangeReview"
                  @current-change="handleCurrentChangeReview"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :disabled="label==='选字段'||label==='选择表'" @click="getGenSql(false)">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/index'
export default {
  name: '',
  props: {
    sqlIsShow: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'add'
    },
    sqlEditRow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 对话框标题
      dialogTitleSql: '',
      sqlIsShowChilren: this.sqlIsShow,
      // 新增上面两个input
      addThemeForm: {
        topicName: undefined,
        topicDescribe: undefined
      },
      // 新建主题相关
      filterText: '',
      // 输入框校验
      themeRules: {
        topicName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      },
      // 树内容
      treeData: [],
      // 树配置
      treeProps: {
        label: 'label',
        children: 'childList'
      },
      // 树选中状态
      isIndeterminate: false,
      // 右侧树数据
      rightTableData: [],
      // 是否选中
      checkAll: false,
      // 默认选中第一个
      activeTabs: 'first',
      // 左侧树默认选中值
      leftTreeDefaultCheckedKeys: [],
      // 临时储存树已勾选表格
      leftTreeCheckList: [],
      // 储存右侧表格勾选
      selecListSub: [],
      // 树节点键值
      keys: [],
      // 选字段表格数据
      chooseFeildtableData: [],
      // 点击的单元格行索引
      tableCellClickRowIndex: null,
      // 点击的单元格列索引
      tableCellClickColumnIndex: null,
      form: {
        tableColumnData: [],
        tableCommentss: [],
        tableCom: []
      },
      // 连接表列
      tableRelateColumns: [
        {
          label: '表名称',
          prop: 'tableName',
          useSlot: true
        },
        {
          label: '表字段',
          prop: 'tableColumn',
          useSlot: true
        },
        {
          label: '关联类型',
          prop: 'relationType',
          useSlot: true
        },
        {
          label: '关联表',
          prop: 'relationTableName',
          useSlot: true
        },
        {
          label: '关联表字段',
          prop: 'relationTableColumn',
          useSlot: true
        }
      ],
      // 表连接sql语句
      textarea: '',
      label: '',
      // 表连接表格数据
      tableJoinsTableData: [],
      // 表连接表头数据
      tableCol: '',
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      // 是否主表
      isSelectName: '',
      globalKey: {}, // 表格页面数据反向选择
      linkTableList: [], // 关联表下拉选项
      optionrelationDictTable: [], // 关联字典表
      optionrelationColumn: [], // 关联字段
      optionrelationValue: [], // 关联显示字段
      inputcolumnAlias: [], // 关联别名
      structureList: [], // 关联表表字段
      // 主表字段列表
      primaryTableColumns: [],
      options: [
        {
          value: 'INNER JOIN',
          label: '内连接'
        },
        {
          value: 'LEFT JOIN',
          label: '左连接'
        },
        {
          value: 'RIGHT JOIN',
          label: '右连接'
        }
      ],
      // 除主表外的其他表列表
      otherTables: [],
      // 除主表外的其他表字段列表
      otherTablesColumns: {},
      // 连接类型
      sqlOptionsType: '',
      nodeKey: '',
      // 主表
      tableName: null,
      sqlRelationTableColumn: [],
      checkedData: [], // 表格选中
      // 编辑回显数据
      editFormData: {}
    }
  },
  watch: {
    // 观测主表是否变化
    tableName: {
      handler(val) {
        this.form.tableColumnData = []
      },
      deep: true
    },
    type: {
      handler(val) {
        if (val === 'add') {
          this.dialogTitleSql = '新增主题数据'
        } else {
          this.dialogTitleSql = '编辑主题数据'
        }
      },
      immediate: true
    }
  },
  created() {
    this.getTreeData()
    this.getLinkTableList()
    if (this.type === 'edit') {
      this.topicId = this.sqlEditRow.topicId
      this.addThemeForm.topicName = this.sqlEditRow.topicName
      this.addThemeForm.topicDescribe = this.sqlEditRow.topicDescribe
      this.textarea = this.sqlEditRow.topicSql

      // 回显选择表左侧树 和 右侧数据
      this.leftTreeDefaultCheckedKeys = []
      this.rightTableData = []
      this.sqlEditRow.topicTableResponseList.forEach(item => {
        const dataItem = Object.assign({}, item, { id: item.topicId, label: item.tableComment })
        this.leftTreeDefaultCheckedKeys.push(item.filedId)
        item.label = item.tableComment
        this.rightTableData.push({ ...item })
        if (item.isPrimary === '1') {
          this.isSelectName = item.tableName
          this.tableName = dataItem
        }
      })

      this.leftTreeCheckList = [...this.rightTableData]
      // 获取回显数据
      const props = {
        topicId: this.sqlEditRow.topicId
      }
      API.getTopicDetail(props).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.editFormData = data
          this.form.tableColumnData = this.editFormData.topicTableRelationResponseList
          // 默认第二步checked数据
          this.editFormData.topicTableResponseList.forEach(item => {
            this.globalKey[item.filedId] = {
              checkedData: item.topicTableColumnReponseList
            }
          })
        } else {
          this.$message.error(msg)
        }
      })
    }
  },
  methods: {
    // 对话框关闭
    handleClose() {
      this.sqlIsShowChilren = false
      this.$emit('closeaddSql')
    },
    // 查询树结构
    getTreeData() {
      this.rightTableData = []
      const props = {
        isContainOrg: '1'
      }
      API.getCustomizationDataTypeTree(props).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeData = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 全选按钮
    handleCheckAllChange(val) {
      this.rightTableData.forEach((i) => {
        if (val) {
          this.$refs.checkListRef.toggleAllSelection()
        } else {
          this.$refs.checkListRef.clearSelection()
        }
      })
    },
    // SQL定制按钮选择表清空按钮
    empty() {
      this.checkList = []
      this.isSelectName = ''
      this.rightTableData = []
      this.chooseFeildtableData = []
      //this.$refs.treess.setCheckedKeys([]);
      //console.log(this.rightTableData)
    },
    // 选步骤切换
    tabClick(e) {
      this.label = e.label
      if (this.label === '选字段' || this.label === '表连接') {
        this.$refs.checkboxRef.$el.style = 'display:none;'
        this.$refs.buttonRef.$el.style = 'display:none;'
      } else {
        this.$refs.checkboxRef.$el.style = 'display:block;margin-right:350px;margin-top:8px;'
        this.$refs.buttonRef.$el.style = 'display:block;'
      }
    },
    // 树过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    toLeft(tree) {
      this.selecListSub.forEach(item => {
        // 删除左侧被选中的数据
        const index = this.leftTreeCheckList.findIndex(leftItem => leftItem.tableName === item.tableName)
        if (index > -1) {
          this.leftTreeCheckList.splice(index, 1)
        }

        if (item.id) {
          // 左侧树勾选状态处理
          this.$refs[tree].setChecked(item.id, false)
        } else {
          // 删除默认选中节点
          this.leftTreeDefaultCheckedKeys.splice(index, 1)
          // 左侧树勾选状态处理
          this.$refs[tree].setChecked(item.filedId, false)
        }
      })
      // 删除右侧数据
      const rightTableData = []
      this.rightTableData.forEach(item => {
        if (!this.selecListSub.find(selectItem => selectItem.tableName === item.tableName)) {
          rightTableData.push(item)
        }
      })
      this.rightTableData = rightTableData
    },
    toRight() {
      this.rightTableData=[]
      // 右侧表格数据维护
      this.leftTreeCheckList.forEach(item => {
        if (item.childList === null) {
          if (!this.rightTableData.find(tableItem => tableItem.tableName === item.tableName)) {
            this.rightTableData.push(item)
          }
        }
      })
      // 第二步骤左侧树数据维护
      for (let i = 0; i < this.rightTableData.length; i++) {
        if (!this.globalKey[this.rightTableData[i].id]) {
          this.globalKey[this.rightTableData[i].id] = null
        }
      }
      console.log(this.rightTableData)
    },
    leftTreeClick(tree) {
      const selectedTreeNode = this.$refs[tree].getCheckedNodes()
      selectedTreeNode.forEach(item => {
        if (!item.field && !this.leftTreeCheckList.find(checkedItem => checkedItem.tableName === item.tableName)) {
          this.leftTreeCheckList.push(item)
        }
      })
    },
    // 主表单选按钮事件
    handleRowChange(data) {
      this.isSelectName = data.tableName
      // 当前主表
      this.tableName = data
    },
    // 新增sql主题
    checkListChangeHandel(selection) {
      this.selecListSub = selection
      if (selection.length === 0) {
        this.isIndeterminate = false
        this.checkAll = false
      } else if (selection.length < this.rightTableData.length) {
        this.isIndeterminate = true
      } else {
        this.isIndeterminate = false
        this.checkAll = true
      }
    },
    // 树节点点击事件
    nodeClick(obj, node, tree) {
      // 判断唯一值
      this.nodeKey = obj.filedId || obj.id
      if (this.globalKey[this.nodeKey] && this.globalKey[this.nodeKey].tableData) {
        this.chooseFeildtableData = this.globalKey[this.nodeKey].tableData
        const checkedData = this.globalKey[this.nodeKey].checkedData
        for (let i = 0, j = this.chooseFeildtableData.length; i < j; i++) {
          if (checkedData.find(item => item.tableColumn === this.chooseFeildtableData[i].tableColumn)) {
            this.$nextTick(() => {
              this.$refs.duoxuanmultipleTable.toggleRowSelection(
                this.chooseFeildtableData[i],
                true
              )
            })
          }
        }
      } else {
        this.getTableColumnsByName(obj).then((res) => {
          this.chooseFeildtableData = res
          this.optionrelationDictTable = new Array(res.length)
          if (this.type === 'add') { // 新增
            // 默认全选
            this.globalKey[this.nodeKey] = {
              tableData: res,
              checkedData: res
            }
            for (const i in res) {
              this.$nextTick(() => {
                this.$refs.duoxuanmultipleTable.toggleRowSelection(
                  this.chooseFeildtableData[i],
                  true
                )
              })
            }
          } else { // 编辑
            // 过滤返回数据
            const editData = this.editFormData.topicTableResponseList.find(item => item.filedId === this.nodeKey)
            if (editData) {
              this.globalKey[this.nodeKey].tableData = res
            } else {
              this.globalKey[this.nodeKey] = {
                tableData: res,
                checkedData: res
              }
            }
            // 返回的数据显示
            for (const i in this.globalKey[this.nodeKey].checkedData) {
              this.$nextTick(() => {
                const index = this.chooseFeildtableData.findIndex(item => item.tableColumn === this.globalKey[this.nodeKey].checkedData[i].tableColumn)
                this.$refs.duoxuanmultipleTable.toggleRowSelection(
                  this.chooseFeildtableData[index],
                  true
                )
              })
            }
          }
        })
      }
    },
    // // 表格复选框
    onHandleSelect(selection, row) {
      this.globalKey[this.nodeKey].checkedData = selection
    },
    handChange(val) {
      this.globalKey[this.nodeKey].checkedData = val
    },
    // 选字段获取关联表
    getLinkTableList() {
      API.getLinkTableList().then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          this.linkTableList = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 点击表格可以编辑
    tableCellClick(row, column, cell, event) {
      this.tableCellClickRowIndex = row.index
      this.tableCellClickColumnIndex = column.index
    },
    // 选字段根据表名获取字段名
    changeLinkTable(tableName) {
      if (!tableName) {
        return false
      }
      const params = {
        tableName: tableName
      }
      API.getStructureList(params).then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          this.structureList = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 单元格发生改变
    tableCellInputBlur(val, row) {
      row.relationDictTable = this.optionrelationDictTable[row.index]

      this.changeLinkTable(
        this.optionrelationDictTable[row.index],
        this.optionrelationColumn
      )
      row.relationColumn = this.optionrelationColumn[row.index]
      row.relationValue = this.optionrelationValue[row.index]
      row.columnAlias = this.inputcolumnAlias[row.index]
    },
    // 添加
    onHandleAdd() {
      const tableData = {
        tableName: '',
        tableColumn: '',
        tableComment: '',
        relationType: '',
        relationTableName: '',
        relationTableColumn: ''
      }
      this.form.tableColumnData.push(tableData)
    },
    // 根据表名获取字段列表
    getTableColumnsByName(data) {
      const prams = {
        tableName: data.tableName
      }
      return new Promise((resolve) => {
        API.getTopicTableColumns(prams).then((res) => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            resolve(data)
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    // 连接类型
    relateTypeValue(val) {
      this.sqlOptionsType = val
    },
    // 选择其他表
    onSelectOtherTable(tableName, index) {
      const tableObj = this.otherTables.find(
        (item) => item.tableName === tableName
      )
      this.form.tableColumnData[index].relationTableComment = tableObj.label
      this.sqlRelationTableColumn.push(tableName)
      // 获取字段列表
      if (this.otherTablesColumns[tableName] < 1) {
        this.getTableColumnsByName({ tableName }).then((res) => {
          this.otherTablesColumns[tableName] = res
        })
      }
    },
    // 删除
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
        this.form.tableColumnData.splice(
          this.form.tableColumnData.indexOf(this.selectedRows),
          1
        )
      })
    },
    // 表连接当前选中行
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    getGenSql(sql) {
      // 调接口拿表格数据
      if (this.type === 'add') { // 新增
        const targetArr = []
        this.rightTableData.forEach(item => {
          targetArr.push({
            isPrimary: item.tableName === this.isSelectName ? 1 : 0,
            tableComment: item.label,
            tableName: item.tableName,
            topicTableColumnRequestList: this.globalKey[item.id].checkedData
          })
        })
        setTimeout(() => {
          // 生成sql
          if (sql) {
            const params = {
              topicTableRelationRequestList: this.form.tableColumnData,
              topicTableRequestList: targetArr,
              topicType: '1'
            }
            API.getGenSql(params).then((res) => {
              const { code, msg } = res
              if (String(code === '200')) {
                this.textarea = msg
                if (msg === '') {
                  this.$message.error('生成失败')
                }
              } else {
                this.$message.error('生成失败')
              }
            })
          } else {
            const params = {
              pageNum: this.pager.pageNum,
              pageSize: this.pager.pageSize,
              topicDescribe: this.addThemeForm.topicDescribe,
              topicName: this.addThemeForm.topicName,
              topicTableRelationRequestList: this.form.tableColumnData,
              topicTableRequestList: targetArr,
              topicType: '1',
              topicSql: this.textarea
            }
            API.getSqlInsert(params).then((res) => {
              if (String(res.code === '200')) {
                this.$message.success(res.msg)
                this.handleClose()
                this.$emit('saveSqlTheme')
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }, 600)
      } else { // 编辑
        const targetArr = []
        this.rightTableData.forEach(item => {
          const id = item.filedId || item.id
          targetArr.push({
            isPrimary: item.tableName === this.isSelectName ? 1 : 0,
            tableComment: item.label,
            tableName: item.tableName,
            topicTableColumnRequestList: this.globalKey[id].checkedData
          })
        })
        const params = {
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          topicDescribe: this.addThemeForm.topicDescribe,
          topicName: this.addThemeForm.topicName,
          topicTableRelationRequestList: this.form.tableColumnData,
          topicTableRequestList: targetArr,
          topicType: '1',
          topicSql: this.textarea
        }
        API.getSqlInsert(params).then((res) => {
          if (String(res.code === '200')) {
            this.$message.success('编辑成功')
            this.handleClose()
            this.$emit('saveSqlTheme')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 查询sql语句
    chaxunSql() {
      const props = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        sql: this.textarea
      }
      API.getExecuteSql(props).then((res) => {
        const { code, data, message } = res
        if (String(code) === '200') {
          if (data.list && data.list.length > 0) {
            this.tableCol = Object.keys(data.list[0])
          }
          const qq = this.tableCol
          this.tableCol = []
          this.$set(this.tableCol, 'value', qq)
          this.tableJoinsTableData = data.list
          this.pager.total = data.total
        } else {
          this.$message.error(message)
        }
      })
    },
    // 主表
    tableCommentPrimary(val, index) {
      const data = this.rightTableData.find(item => item.tableName === val)
      this.form.tableColumnData[index].tableComment = data.label
      const prams = {
        tableName: val
      }
      API.getTopicTableColumns(prams).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.primaryTableColumns = data
        } else {
          this.$message.error(msg)
        }
      })

      this.otherTables = this.rightTableData.filter(
        (item) => item.tableName !== val
      )
      this.otherTables.forEach((item) => {
        this.$set(this.otherTablesColumns, item.tableName, [])
      })
    },
    // 生成sql表字段
    tableColumnsPrimary(val) {
      this.sqlTableColumnsPrimary = val
    },
    // 查询sql表格分页
    handleSizeChangeReview(val) {
      this.pager.pageSize = val
      this.chaxunSql()
    },
    handleCurrentChangeReview(val) {
      this.pager.pageNum = val
      this.chaxunSql()
    }
  }
}
</script>

<style lang="scss" scoped>
.qiefen-dialog-class {
  .tree-box {
    border-radius: 5px;
    border: 1px solid #e9eaef;
    height: 650px;
    width: 389px;
    background: #fff;
    .filter-tree {
      height: 100%;
    }
    .el-scrollbar__wrap {
      overflow-x: auto;
      height: calc(100% + 20px); //多出来的20px是横向滚动条默认的样式
    }
    .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
      white-space: nowrap;
      display: inline-block;
    }
  }
  .botton-box {
    height: 650px;
    width: 144px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    margin-left: 5px;
    .botton-box-button {
      padding: 9px;
      background: #f5f5f5;
      margin: 5px 0;
    }
  }
  .list-box {
    border-radius: 5px;
    border: 1px solid #e9eaef;
    height: 650px;
    width: 473px;
    padding-right: 0;
  }
  .detail-class {
    height: 600px;
    .con-header {
      width: 100%;
      height: 50px;
      margin-bottom: 20px;
      border-bottom: 1px solid #e9eaef;
    }
    .table-bon {
      width: 100%;
      height: calc(100% - 70px);
      .table-section {
        width: 100%;
        height: calc(100% - 32px);
      }
      .pager-section {
        width: 100%;
        height: 30px;
        margin: 10px 0;
        text-align: right;
      }
    }
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #1f7cd7;
    border-color: #1f7cd7;
  }
}

</style>
