<template>
  <!-- 切分 -->
  <Container own-class="con-one">
    <!-- 左边树状结构列表 -->
    <Tree
      v-loading="loading2"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      
      ref="myTree"
      class="tree"
      :radio-list="radioList"
      :tree-data="treeData"
      :tree-props="props1"
      @treeRadioChange="treeRadioChange"
      @nodeClick="nodeClick"
      @check="check"
    />
    <Containertwo own-class="con-two" v-loading="loading3"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)">
      <div v-if="checkTreeType==='xzqy'">
        <!-- 行政区域第一级表切换 -->
        <el-checkbox-group v-model="checkList">
          <el-tabs v-model="activeNameFirst" type="card" @tab-click="tabsFirstListClick">
            <el-tab-pane v-for="(item) in tabsFirstList" :key="item.categoryId" :name="item.categoryId" :label="item.categoryName">
              <div slot="label">
                <span class="checkboxNone">{{ item.categoryName }}</span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-checkbox-group>
      </div>
      <div v-if="checkTreeType==='dwbz'||checkTreeType==='sjlx'" class="con-header">
        <div style="display:flex;">
          <!-- 顶部表列表切换 -->
          <el-tabs
            ref="Tabletabs"
            v-model="secondLevel"
            style="width:98%;"
            type="card"
            :table-list="tableList"
            @tab-click="topRadioChange"
          >
            <el-tab-pane
              v-for="item in tableList"
              :key="item.tableName"
              :name="item.tableName"
              :label="item.tableSimpleComment"
            >
              <span slot="label"><el-checkbox v-model="item.isSelected" />{{ item.tableSimpleComment }}
              </span>
            </el-tab-pane>
          </el-tabs>
          <el-dropdown trigger="click" :hide-on-click="false">
            <span class="el-dropdown-link">
              <i
                class="el-icon-arrow-down el-icon--right"
                style="font-size: 12px;margin-top: 15px;margin-left: 12px;"
              />
            </span>
            <el-dropdown-menu slot="dropdown" style="height:500px;width:150px;overflow:auto;">
              <el-dropdown-item>
                <el-checkbox v-for="item in tableList" :key="item.tableName" v-model="item.isSelected" style="display:block">{{ item.tableSimpleComment }}</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div v-else>
        <div style="display:flex;">
          <el-tabs
            ref="tabletabs"
            v-model="secondLevelXZQY"
            type="card"
            style="width:98%;"
            :table-list="tableListxzqy"
            @tab-click="topRadioChangeXZQY"
          >
            <el-tab-pane
              v-for="item in tableListxzqy"
              :key="item.tableName"
              v-model="checkedXZQY"
              :name="item.tableName"
            >
              <span slot="label"><el-checkbox v-model="item.isSelect" />{{ item.tableComment }}
              </span>
            </el-tab-pane>
          </el-tabs>
          <el-dropdown trigger="click" :hide-on-click="false">
            <span class="el-dropdown-link">
              <i
                class="el-icon-arrow-down el-icon--right"
                style="font-size: 12px;margin-top: 15px;margin-left: 12px;"
              />
            </span>
            <el-dropdown-menu slot="dropdown" style="height:500px;width:150px;overflow:auto;">
              <el-dropdown-item>
                <el-checkbox v-for="item in tableListxzqy" :key="item.tableName" v-model="item.isSelect" style="display:block">{{ item.tableComment }}</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </div>
      <!-- 两个按钮 -->
      <div class="button-con">
        <!-- 切分 -->
        <el-button class="elbutton" @click="qiefen">
          <img
            :src="require(`@/icons/newImages/buttonIcon/qiefenButton.png`)"
            class="img-class"
            alt=""
          >
          <span>切分</span>
        </el-button>
        <!-- 刷新 -->
        <!-- <el-button class="elbutton" @click="shuaxin">
          <img
            :src="require(`@/icons/newImages/buttonIcon/refresh.png`)"
            class="img-class"
            alt=""
          >
          <span>重置</span>
        </el-button> -->

      </div>
      <!-- 表格内容 -->
      <div v-if="checkTreeType==='dwbz'||checkTreeType==='sjlx'&&tableCol.length>0" class="table-bon">
        <div class="table-section" style="height:90% ">
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            height="95%"
            class="table-class"
            header-row-class-name="header-row-class"
            border
            style="width: 100%"
            :index="table_index"
            @select="onHandleSelect"
          >
            <el-table-column v-if="tableCol.length>0" type="selection" width="55" align="center" />
            <el-table-column
              v-if="tableCol.length>0"
              label="序号"
              type="index"
              :index="table_index"
              width="50"
              align="center"
            />
            <el-table-column
              v-for="(item) in tableCol"
              :key="item.columnName"
              :label="item.columnComment"
              :prop="item.columnName"
              align="center"
              min-width="150"
              show-overflow-tooltip
              :render-header="renderHeader"
            />
            <el-table-column v-if="tableCol.length>0" label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  style="color: #1f7fd8"
                  @click="onHandleEdit(scope.row, 2)"
                >编辑</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  size="small"
                  style="color: #1f7fd8"
                  @click="onHandleEdit(scope.row, 0)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pager-section" v-if="tableCol.length>0">
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
      <div v-else-if="checkTreeType==='sjlx'" style="height:400px;border:1px solid #e6e6e6;text-align:center;line-height:400px;font-size:12px;color:#a6a6a6"">暂无数据</div>
      <div v-if="checkTreeType==='xzqy'" class="table-bon">
        <div class="table-section" style="height: calc(100% - 100px);">
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            height="100%"
            class="table-class"
            header-row-class-name="header-row-class"
            border
            style="width: 100%"
            :index="table_index"
            @select="onHandleSelect"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="序号"
              type="index"
              :index="table_index"
              width="50"
              align="center"
            />
            <el-table-column
              v-for="(item) in tableCol"
              :key="item.columnName"
              :label="item.columnComment"
              :prop="item.columnName"
              align="center"
              show-overflow-tooltip
              min-width="150"
              :render-header="renderHeader"
            />
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  style="color: #1f7fd8"
                  @click="onHandleEdit(scope.row, 2)"
                >编辑</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  size="small"
                  style="color: #1f7fd8"
                  @click="onHandleEdit(scope.row, 0)"
                >删除</el-button>
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
    </Containertwo>
    <!-- 编辑框内容 -->
    <el-dialog
      title="数据编辑"
      :visible.sync="editDialog"
      custom-class="qiefen-dialog-class"
      width="35%"
      @opened="editDialogOpened"
      @close="editClose"
    >
      <el-scrollbar style="height: 600px">
        <el-form
          ref="editFormRef"
          :model="editForm"
          label-position="top"
          style="padding: 0 20px"
        >
          <el-form-item
            v-for="(item, index) in tableCol"
            :key="'index1' + index"
            :label="item.commentsView"
            :prop="item.columnName"
          >
            <el-input
              v-model="editForm[item.columnName]"
              placeholder="参数值"
              :disabled="primaryKey.indexOf(item.columnName) > -1"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button
          style="background: #1f7fd8; color: #fff"
          @click="editHandel"
        >确 定</el-button>
        <el-button @click="editClose">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 导出 -->
    <el-dialog
      title="切分"
      custom-class="qiefen-dialog-class"
      :close-on-click-modal="false"
      :close-on-press-escape	="false"
      :visible.sync="dialogVisibleExport"
      width="30%"
    >
      <el-form ref="qiefenForm" :model="qiefenForm" label-position="top">
        <el-form-item label="选择切分方式:">
          <el-radio-group v-model="qiefenForm.camouflageType">
            <el-radio label="1">DMP</el-radio>
            <el-radio label="0">EXCEL</el-radio>
            <el-radio label="2">SQL</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" :disabled="qiefenDisabled" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 过滤 -->
    <el-dialog
      title=""
      :visible.sync="dialogVisibleFilter"
      width="30%"
    >
      <el-form :label-position="labelPosition" label-width="80px" :model="formFilter">
        <el-form-item :label="labelFilter">
          <el-cascader
            v-if="domType==='select'"
            ref="cascader"
            v-model="vale"
            :options="formFilter.selectData"
            style="width:100%"
            :props="props"
            @change="cascaderFilter"
          />
          <el-input v-if="domType==='input'||domType==='textarea'" v-model="formFilter.inputData" @change="inputFilter" />
          <el-date-picker
            v-if="domType==='date'"
            v-model="formFilter.datePicker"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss "
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
import Containertwo from '@/components/ContainerTwo'
import Tree from '@/components/MyTree'
// import length from '@turf/length'
// import formFilter from './components/formFilter.vue'
import Tabletabs from './components/tableTabs'

// const id = 0
var vm = {
  checkTreeType1: 'dwbz',
  components: { Container, Containertwo, Tree, Tabletabs },
  data() {
    return {
      loading3:false,
      qiefenDisabled: false,
      props1: {
        label: 'label',
        children: 'childList',
        isLeaf: 'leaf'
      },
      checkList: [],
      checkedXZQY: false,
      formFilter: {
        inputData: '',
        selectData: [],
        datePicker: ''
      },
      props: {
        value: 'code',
        children: [{ value: 'code' }],
        lazy: true,
        leaf: 'isLeaf',
        checkStrictly: true,
        lazyLoad: (node, resolve) => {
          this.cascaderFilter(node, resolve)
        }
      },
      vale: [],
      labelFilter: '',
      labelPosition: 'top',
      tabsFirstList: [],
      dialogVisibleFilter: false,
      activeNameFirst: '1',
      // 表切换多选框
      checkboxTabs: true,
      // 当前选择的树类型
      checkTreeType: 'dwbz',
      // 当前选择的树节点id
      treeCheckId: [],
      // 当前选择的树节点label
      treeCheckLabel: [],
      tableListxzqy: [],
      // 树单选
      radioList: [
        {
          label: 'dwbz',
          content: '单位编制'
        },
        {
          label: 'sjlx',
          content: '数据类型'
        },
        {
          label: 'xzqy',
          content: '行政区域'
        }
      ],
      // 树内容
      treeData: [],
      // 树配置
      treeProps: {
        label: 'label',
        children: 'childList'
      },
      // 表格数据
      tableData: [],
      // 表名称
      tableName: '',
      tableCol: [],
      // 主键信息
      primaryKey: [],
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      // 切分form
      qiefenForm: {
        isCloak: '0',
        camouflageType: '1',
        tableCategory: '00'
      },
      type: '',
      // 表列表
      tableList: [],
      // 编辑
      editDialog: false,
      dialogVisibleExport: false,
      editForm: {},
      jilianData: [], // 切分成功后返回的数据
      firstObj: {},
      value: [],
      tabsName: [],
      tabsNameXZQY: [],
      tabsNameSting: '',
      categoryIdName: '',
      categoryId: [],
      secondLevel: '', // 表列表默认选中
      secondLevelXZQY: '',
      globalKey: [], // 表格页面数据反向选择
      domType: '',
      nameTable: '',
      conditions: [],
      columnProperty: '',
      cascaderValue: '',
      inputValue: '',
      dateValue: '',
      areaType: [],
      loading2:false,
    }
  },
  created() {
    // 获取树数据
    this.getTreeDWBZ(this.radioList[0].label)
    this.loading2 = true
  },

  methods: {
    // 日期选择器过滤
    dateFilter(val) {
      this.dateValue = val
    },
    // 输入框过滤
    inputFilter(val) {
      this.inputValue = val
    },
    // 级联选择器过滤
    cascaderFilter(node, resolve) {
      const nodesInfo = this.$refs['cascader'].getCheckedNodes()
      nodesInfo.forEach(item => {
        this.cascaderValue = item.value
      })
      const props = {
        tableName: this.nameTable,
        columnName: this.columnProperty,
        sync: false,
        sequence: node.root ? '' : node.data.id
      }
      API.getSync(props).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
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
      const sortData = []
      const sort = {
        sortColumn: column.property,
        sortBy: 'ASC'
      }
      
      this.tableCol.forEach(item => {
        if (column.label === item.columnComment) {
          this.domType = item.domType
        }
      })
      if(this.domType == 'file'){
        this.dialogVisibleFilter = false
        this.$message.warning('文件类型不可排序')
      }else{
        sortData.push(sort)
        this.getTableData(this.secondLevel, sortData)
      }
    },
    // 降序
    RowcaretBottom(column, index) {
      const sortData = []
      const sort = {
        sortColumn: column.property,
        sortBy: 'DESC'
      }
      this.tableCol.forEach(item => {
        if (column.label === item.columnComment) {
          this.domType = item.domType
        }
      })
      if(this.domType == 'file'){
        this.dialogVisibleFilter = false
        this.$message.warning('文件类型不可排序')
      }else{
        sortData.push(sort)
      this.getTableData(this.secondLevel, sortData)
      }
      
    },
    // 过滤
    Rowdataanalysis(column, index) {
      this.vale = ''
      this.dialogVisibleFilter = true
      this.conditions = []
      this.labelFilter = column.label
      this.columnProperty = column.property
      this.getTableCol(this.secondLevel)

      this.tableCol.forEach(item => {
        if (column.label === item.columnComment) {
          this.domType = item.domType
          this.nameTable = item.tableName
        }
      })

      if (this.domType === 'file') {
        this.dialogVisibleFilter = false
        this.$message.warning('文件类型不可过滤')
      } else if (this.domType === 'input' || this.domType === 'textarea' || this.domType === 'date') {
        // this.dialogVisibleFilter = false
        // this.$message.warning('文件类型不可过滤')
      } else {
        const props = {
          tableName: this.nameTable,
          columnName: this.columnProperty,
          sync: false,
          sequence: this.cascaderValue
        }
        API.getSync(props).then(res => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            this.formFilter.selectData = data
          } else {
            this.$message.error(msg)
          }
        })
      }
    },
    // 过滤模态框确定按钮
    sureFilter() {
      this.dialogVisibleFilter = false
      this.vale = ''
      this.conditions = []
      this.formFilter = {}
      if (this.domType === 'select') {
        const conditionCloumn = {
          columnValue: this.cascaderValue || '',
          columnName: this.columnProperty,
          domType: this.domType
        }
        if (this.cascaderValue) {
          this.conditions.push(conditionCloumn)
        } else {
          // this.$message.warning('请输入过滤条件')
          // this.dialogVisibleFilter = true
        }
      } else if (this.domType === 'input' || this.domType === 'textarea') {
        const conditionCloumn = {
          columnValue: this.inputValue,
          columnName: this.columnProperty,
          domType: this.domType
        }
        if (this.inputValue === '') {
          // this.$message.warning('请输入过滤条件')
          // this.dialogVisibleFilter = true
        } else {
          this.conditions.push(conditionCloumn)
        }
      } else if (this.domType === 'date') {
        const conditionCloumn = {
          columnValue: this.dateValue,
          columnName: this.columnProperty,
          domType: this.domType
        }
        if (this.dateValue === '') {
          // this.$message.warning('请输入过滤条件')
          // this.dialogVisibleFilter = true
        } else {
          this.conditions.push(conditionCloumn)
        }
      }
      this.getTableData(this.secondLevel)
    },
    // 过滤模态框取消按钮
    closeFilter() {
      this.dialogVisibleFilter = false
      this.vale = ''
      this.formFilter = {}
    },
    // 行政区域二级列表tab切换
    topRadioChangeXZQY(val) {
      this.secondLevel = val.name
      this.conditions = []
      // 获取表头数据
      this.getTableCol(val.name)
      // 获取表格数据
      this.getTableData(val.name)
    },
    // 获取行政区域类型下的表  只切换表不做其他操作
    tabsFirstListClick(categoryId) {
      this.areaType = []
      this.tabsNameXZQY = []
      this.categoryIdName = categoryId.name
      const props = {
        categoryId: [categoryId.name]
      }
      API.getAreaTable(props).then(res => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          data.forEach(item => {
            item.isSelect = false
          })
          this.tableListxzqy = data
          this.secondLevelXZQY = this.tableListxzqy[0].tableName
          this.getTableCol(this.secondLevelXZQY)
          this.getTableData(this.secondLevelXZQY)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取行政类型八种类型
    getAreaType() {
      return new Promise(resolve => {
        API.getAreaType().then(res => {
          const { data, msg, code } = res
          if (String(code) === '200') {
            this.tabsFirstList = data
            this.activeNameFirst = this.tabsFirstList[0].categoryId
            resolve()
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    // 行政区域第一行多选
    firstTabs(val) {
      this.conditions = []
      if (val === true) {
        this.categoryId.push(this.categoryIdName)
      } else if (val === false) {
        // item是自己随便定义的一个参数箭头函数之后是返回的满足的值
        const index = this.categoryId.findIndex(item => item === this.categoryIdName)
        this.categoryId.splice(index, 1)
      }
      this.tableListxzqy = []
      const props = {
        categoryId: this.checkList
      }
      API.getAreaTable(props).then(res => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          this.tableListxzqy = data
          this.secondLevelXZQY = this.tableListxzqy[0].tableName
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 单位编制数据类型多选
    tabsCheckbox(val) {
      if (val === true) {
        this.tabsName.push(this.tabsNameSting)
        const map = new Map()
        this.tabsName = this.tabsName.filter(item => !map.has(item) && map.set(item, 1))
      } else {
        const index = this.tabsName.findIndex(item => item === this.secondLevel)
        this.tabsName.splice(index, 1)
      }
      // this.getTableData()
    },
    // 行政区域多选
    tabsCheckboxXZQY(e) {
      if (e === true) {
        this.tabsNameXZQY.push(this.secondLevelXZQY)
        const map = new Map()
        this.tabsNameXZQY = this.tabsNameXZQY.filter(item => !map.has(item) && map.set(item, 1))
      } else {
        const index = this.tabsNameXZQY.findIndex(item => item === this.secondLevelXZQY)
        this.tabsNameXZQY.splice(index, 1)
      }
      // this.getTableData()
    },
    // 树节点多选
    check(nodes, keys) {
      console.log(nodes, keys)
    
      
      this.treeCheckId = []
      this.treeCheckLabel = []
      keys.checkedNodes.forEach(item => {
        if (item.id === item.field) {
          this.treeCheckId.push(item.id)
        } else {
          this.treeCheckId.push(item.field)
        }
        this.treeCheckLabel.push(item.label)
      })
      this.conditions = []
      this.getTableData(this.tableName)
      if (this.checkTreeType === 'dwbz' || this.checkTreeType === 'sjlx') {
        this.getTableList(this.treeCheckId, this.treeCheckLabel)
        if(keys.checkedKeys.length>0){
          this.getTableData(this.tableName)
        }else{
          this.tableData = []
          this.tableCol = []
        }
      }
    },
    // 表格默认全选
    toggleSelect(rows) {
      if (rows) {
        rows.forEach(row => {
          // 未选中行
          const unSelectedRow = this.globalKey.filter(
            item => item === row.UNIQUE
          )
          // 判断切换页面数据回显保持
          if (unSelectedRow && unSelectedRow.length > 0) {
            // ...
          } else {
            if (!row.isSelected) {
              this.$set(row, 'isSelected', true) // 设置当前选中行的“isSelected”是否选中
            } else {
              this.$set(row, 'isSelected', false)
            }
            this.$refs.multipleTable.toggleRowSelection(row) // 设置表格全选
          }
        })
      }
    },
    // 重置查询数据
    reset() {
      // 表列表
      this.tableList = []
      // 表格数据
      this.tableData = []
      // 表名称
      this.tableName = ''
      this.tableCol = []
      this.pager.pageNum = 1
      this.pager.pageSize = 10
      this.pager.total = 0
      this.jilianData = ''
      // this.options_cascader = [];
    },
    // 切换树
    treeRadioChange(val) {
      vm.checkTreeType1 = val
      this.checkTreeType = val
      this.tableName = ''
      this.tabsName = []
      this.reset()
      if (this.checkTreeType === 'dwbz') {
        this.getTreeDWBZ(val)
      } else if (this.checkTreeType === 'sjlx') {
        this.getTreeSJLX()
      } else {
        this.areaType = []
        this.getTreeXZQY() // 行政区域树
        this.getAreaType() // 行政区域第一行八种类型数据
        this.tabsFirstListClick() // 八种数据类型下的表
      }
    },
    // 获取单位编制树
    getTreeDWBZ(type) {
      const prop = '/force'
      this.type = type
      API.getDataTypeTree({}, prop).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.loading2 = false
          this.treeData = data
          this.$refs.myTree.setChecks(this.treeData)
          const regObj = this.getFirstNode(this.treeData)
          if (regObj && regObj.field) {
            this.getTableList([regObj.field], [regObj.label])
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取数据类型树
    getTreeSJLX() {
      API.getDataTypeTree({}, '').then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeData = data
          this.$refs.myTree.setChecks(this.treeData)
          const regObj = this.getFirstNode(this.treeData)
          if (regObj && regObj.id) {
            this.getTableList([regObj.field], [regObj.label])
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取行政区域树
    getTreeXZQY() {
      API.getAreaTree().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeData = data
          this.$refs.myTree.setChecks(this.treeData)
          const regObj = this.getFirstNode(this.treeData)
          this.treeCheckId = [regObj.field]
          if (regObj && regObj.id) {
            const props = {
              categoryId: [this.activeNameFirst]
            }
            API.getAreaTable(props).then(res => {
              const { code, msg, data } = res
              if (String(code) === '200') {
                this.tableListxzqy = data
                //this.areaType = this.tableListxzqy[0].tableName + '_' + this.activeNameFirst
                this.secondLevelXZQY = this.tableListxzqy[0].tableName
                this.getTableCol(this.secondLevelXZQY) // 获取第一张表下的表头数据
                this.getTableData(this.secondLevelXZQY) // 获取第一张表下的表格数据
              } else {
                this.$message.error(msg)
              }
            })
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 查询树的第一个节点的表列表
    // 递归选择最底层第一个
    getFirstNode(tree, isTrue) {
      for (let i = 0; i < tree.length; i++) {
        var el = tree[i]
        if (el.childList && el.childList.length > 0) {
          this.getFirstNode(el.childList)
          break
        } else {
          this.firstObj = el
          break
        }
      }
      return this.firstObj
    },
    // 点击树
    nodeClick({ obj, node, tree }) {
      if (this.checkTreeType === 'dwbz') {
        this.getTableList([obj.field], [obj.label])
      } else if (this.checkTreeType === 'sjlx') {
        this.getTableList([obj.id])
      } else if (this.checkTreeType === 'xzqy') {
        this.getTableList([obj.field])
        this.areaType = []
        this.tabsNameXZQY = []
        const props = {
          categoryId: ['1']
        }
        API.getAreaTable(props).then(res => {
          const { code, msg, data } = res
          if (String(code) === '200') {
            this.tableListxzqy = data
            this.secondLevelXZQY = this.tableListxzqy[0].tableName
            this.getTableCol(this.secondLevelXZQY)
            this.getTableData(this.secondLevelXZQY)
          } else {
            this.$message.error(msg)
          }
        })
      }
    },
    // 获取表列表数据
    getTableList(ids, labels) {
      this.treeCheckId = ids

      this.treeCheckLabel = labels
      if (this.$refs.myTree.radio3 === 'dwbz') {
        API.getUnitTableList().then(res => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            this.$nextTick(() => {
              data.forEach(item => {
                item.isSelected = false
              })
              this.tableList = data
              this.secondLevel = this.tableList[0].tableName
            })
            if (data.length > 0) {
              this.getTableCol(data[0]['tableName'])
              this.getTableData(data[0]['tableName'])
            }
          } else {
            this.$message.error(msg)
          }
        })
      } else if (this.$refs.myTree.radio3 === 'sjlx') {
        if (ids === '') {
          this.tableList = []
          this.tableCol = []
          this.tableData = []
        } else {
          const props = {
            tableCategory: this.treeCheckId
          }
          API.getTableListMore(props).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.$nextTick(() => {
                this.tableList = data
                this.secondLevel = this.tableList[0].tableName
              })
              if (data.length > 0) {
                this.getTableCol(data[0]['tableName'])
                this.getTableData(data[0]['tableName'])
              }
            } else {
              this.$message.error(msg)
            }
          })
        }
      } else if (this.$refs.myTree.radio3 === 'xzqy') {
        API.getAreaList({}).then(res => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            this.$nextTick(() => {
              this.tableList = data
              this.secondLevel = this.tableList[0].tableName
            })
            if (data.length > 0) {
              this.activeNameFirst = this.tabsFirstList[0].categoryId
              this.getTableCol(this.tableListxzqy[0].tableName)
              this.getTableData(this.tableListxzqy[0].tableName)
            }
          } else {
            this.$message.error(msg)
          }
        })
      }
    },
    // 单位编制及数据类型表切换
    topRadioChange(tab) {
      this.conditions = []
      this.tabsNameSting = tab.name
      const val = tab.name
      this.getTableCol(val)
      this.getTableData(val)
    },
    // 获取表头数据
    getTableCol(val) {
      API.getStructureOld({}, val).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.tableCol = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取表格数据
    getTableData(tableName, sortData) {
      this.tableName = tableName
      var params

      if (this.conditions.length === 0) {
        this.conditions = []
      }
      if (this.checkTreeType === 'xzqy') {
        params = {
          tableName: this.tableName || '',
          splitType: '3',
          areaCode: this.treeCheckId,
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          isExport: '0',
          isCloak: '0',
          areaType: this.tableName + '_' + this.activeNameFirst || '',
          sort: sortData || '',
          conditions: this.conditions
        }
      } else if (this.checkTreeType === 'dwbz') {
        params = {
          tableName,
          splitType: '2',
          forceCode: this.treeCheckId,
          forceName: this.treeCheckLabel,
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          isExport: '0',
          isCloak: '0',
          sort: sortData || '',
          conditions: this.conditions
        }
      } else if (this.checkTreeType === 'sjlx') {
        params = {
          tableName,
          splitType: '1',
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          isExport: '0',
          isCloak: '0',
          sort: sortData || '',
          conditions: this.conditions
        }
      }

      API.getTableData(params).then(res => {
        const { code, rows, msg, total } = res
        if (String(code) === '200') {
          this.tableData = rows
          this.pager.total = total
          this.$nextTick(() => {
            this.toggleSelect(this.tableData)
          })
          this.cascaderValue = ''
          this.inputValue = ''
          this.dateValue = ''
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 表格序号下标
    table_index(index) {
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getTableData(this.tableName)
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.pageNum = val
      this.getTableData(this.tableName)
    },
    // 刷新
    shuaxin() {
      this.globalKey = []
      this.getTableCol(this.tableName)
      this.conditions = []
      this.getTableData(this.tableName)
    },
    // 切分
    qiefen() {
      if (this.checkTreeType === 'xzqy') {
        this.tabsNameXZQY = []
        this.tableListxzqy.forEach(item => {
          if (item.isSelect === true) {
            this.tabsNameXZQY.push(item.tableName)
          }
        })
      } else if (this.checkTreeType === 'dwbz' || this.checkTreeType === 'sjlx') {
        this.tabsName = []
        this.tableList.forEach(item => {
          if (item.isSelected === true) {
            this.tabsName.push(item.tableName)
          }
        })
      }
      if(this.tabsName.length<0){
        this.dialogVisibleExport =false
      }else{
        this.dialogVisibleExport = true
      }
      
      this.qiefenDisabled = false
    },
    // 确定切分
    qiefenHandel() {
      this.qiefenDisabled = true
      var params
      if (this.conditions.length === 0) {
        this.conditions = []
      }
      if (this.checkTreeType === 'xzqy') {
        this.areaType = []
        for (let i = 0; i < this.tabsNameXZQY.length; i++) {
          this.areaType.push(this.tabsNameXZQY[i] + '_' + this.activeNameFirst)
        }
        params = {
          areaType: this.areaType.toString(),
          splitType: '3',
          isCloak: this.qiefenForm.isCloak,
          areaCode: this.treeCheckId,
          isCloakAll: this.qiefenForm.camouflageType,
          tableName: this.tabsNameXZQY.toString(),
          isExport: '1',
          sort: '',
          conditions: this.conditions,
          unCheckIds: this.globalKey // 未选中的值
        }
      } else if (this.checkTreeType === 'dwbz') {
        params = {
          splitType: '2',
          isCloak: this.qiefenForm.isCloak,
          forceCode: this.treeCheckId,
          forceName: this.treeCheckLabel,
          isCloakAll: this.qiefenForm.camouflageType,
          tableName: this.tabsName.toString(),
          isExport: '1',
          sort: '',
          unCheckIds: this.globalKey
        }
      } else if (this.checkTreeType === 'sjlx') {
        params = {
          splitType: '1',
          isCloak: this.qiefenForm.isCloak,
          tableCategory: this.treeCheckId,
          isCloakAll: this.qiefenForm.camouflageType,
          isExport: '1',
          tableName: this.tabsName.toString(),
          unCheckIds: this.globalKey,
          sort: '',
          conditions: this.conditions
        }
      }
      var sss = ''
      var rrr = ''
      // 拼接表名-字段名
      // 遍历
      for (var i = 0; i < this.jilianData.length; i++) {
        if (i !== 0) {
          sss = sss + ','
          rrr = rrr + ','
        }
        // 表名-字段名拼接
        sss = sss + this.jilianData[i][1] + '-' + this.jilianData[i][2]
        rrr = rrr + this.jilianData[i][0]
      }

      var ss = rrr.split(',')
      // 处理数据 find() 方法获得当前元素集合中每个元素的后代，通过选择器、jQuery 对象或元素来筛选。
      function find() {
        // 数组去重
        var newArr = []
        for (var i = 0; i < ss.length; i++) {
          if (newArr.indexOf(ss[i]) === -1) {
            newArr.push(ss[i])
          }
        }
      }
      find(ss)
      params.cloakColumn = sss
      if (params.splitType === '3' && params.isCloakAll === '0') {
        params.tableCategory = rrr
      }

      if (this.qiefenForm.camouflageType === '1') {
        // 导出dmp
        API.getExportDmp(params).then(res => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            
            window.open(data)
            this.dialogVisibleExport = false
            this.qiefenDisabled = true
            this.areaType = []
            this.tabsNameXZQY = []
            this.loading3= false
          } else {
            this.$message.error(msg)
            this.loading3= false
          }
        })
      } else if (this.qiefenForm.camouflageType === '0') {
        // 切分请求 EXCEL
        API.sendExport(params).then(res => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            const urls = JSON.parse(data)
            window.location.href = urls.excelUrL
            this.qiefenDisabled = true
            if (urls.mediaUrL !== '') {
              setTimeout(() => {
                window.location.href = urls.mediaUrL
              }, 100)
            }
            this.$message({
              type: 'success',
              message: '切分成功!'
            })
            this.dialogVisibleExport = false
            this.areaType = []
            this.tabsNameXZQY = []
            this.loading3 = false
          } else {
            this.$message.error(msg)
            this.loading3= false
          }
        })
      } else if (this.qiefenForm.camouflageType === '2') {
        // 导出sql
        API.getExportSql(params).then((res) => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            window.open(data)
            this.qiefenDisabled = true
            this.dialogVisibleExport = false
            this.areaType = []
            this.tabsNameXZQY = []
            this.loading3= false
          } else {
            this.$message.error(msg)
            this.loading3= false
          }
        })
      }
    },
    // 切分模态框确定事件
    sure() {
      this.qiefenHandel()

    },
    // 切分模态框取消
    hide() {
      this.qiefenForm.camouflageType = '1'
      this.dialogVisibleExport = false
    },
    // 编辑时打开对话框
    editDialogOpened() {
      // this.$refs.editFormRef.resetFields();
    },
    // 数据编辑模态款确定事件
    editHandel() {
      var prop = {
        flag: '2',
        information: JSON.stringify(this.editForm),
        tableName: this.tableName,
        isCloak: '0',
        primaryValue: this.editForm.UNIQUE
      }
      API.compileRow(prop).then(res => {
        const { code, msg } = res
        if (String(code) === '200') {
          this.$message.success(msg)
          this.editClose()
          this.getTableData(this.tableName)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 关闭编辑
    editClose() {
      this.editDialog = false
      this.editForm = {}
    },
    // 编辑行
    onHandleEdit(row, code) {
      this.editForm = { ...row }
      // this.$refs.editFormRef.resetFields()
      this.editForm = JSON.parse(JSON.stringify(row))

      if (code === 2) {
        this.editDialog = true
        this.getPrimaryKey()
      } else if (code === 0) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.deleteHandel(row)
          })
          .catch(() => {
            this.editForm = {}
          })
      }
    },
    // 删除
    deleteHandel(row) {
      var prop = {
        flag: '0',
        information: JSON.stringify(this.editForm),
        tableName: this.tableName,
        isCloak: '0',
        primaryValue: this.editForm.UNIQUE
      }
      API.compileRow(prop).then(res => {
        const { code, msg } = res
        if (String(code) === '200') {
          this.$message.success(msg)
          this.editForm = {}
          this.getTableData(this.tableName)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取主键信息
    getPrimaryKey() {
      API.getPrimaryKey({}, this.tableName).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.primaryKey = []
          data.forEach(item => {
            this.primaryKey.push(item.columnName)
          })
          this.editDialog = true
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 表格复选框
    onHandleSelect(selection, row) {
      this.rowIsSelected = !row.isSelected
      this.$set(row, 'isSelected', !row.isSelected)
      if (!row.isSelected) {
        this.globalKey.push(row.UNIQUE)
      } else {
        const index = this.globalKey.indexOf(row.UNIQUE)
        if (index > -1) {
          this.globalKey.splice(index, 1)
        }
      }
    }
  }
}
export default vm
</script>

<style lang="scss" scoped>

.con-one {
  display: flex;
  justify-content: space-between;
  .con-two {
    width: calc(100% - 370px);
    // height: 100%;
    .con-header {
      // display: flex;
      width: 100%;
      height: 50px;
      margin-bottom: 10px;
      // border-bottom: 1px solid #e9eaef;
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
      height: 700px;
      .table-section {
        width: 100%;
        // height: calc(100% - 50px);
        .el-table {
          height: 100%;
          //  .el-table__body-wrapper{
          // margin-bottom: 0;
          .el-table__body-wrapper,
          .is-scrolling-left {
            height: 100%;
          }
          // }
        }
      }
      .pager-section {
        width: 100%;
        //height: 30px;
        //margin: 10px 0;
        marin-top:-20px;
        text-align: right;
      }
    }
  }
}
>>>.checkboxNone{
  .el-checkbox__label{
    display: none !important;
  }
}
</style>
