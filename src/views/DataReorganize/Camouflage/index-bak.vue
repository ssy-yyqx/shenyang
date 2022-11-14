<template>
  <!-- 伪装 -->
  <Container own-class="con-one">
    <!-- 左边树状结构列表 -->
    <Tree
      ref="myTree"
      class="tree"
      :radio-list="radioList"
      :tree-data="treeData"
      :tree-props="treeProps"
      @treeRadioChange="treeRadioChange"
      @nodeClick="nodeClick"
      @check="check"
      @node-click="handleRowClick"
    />
    <Containertwo own-class="con-two">
      <div v-if="checkTreeType==='xzqy'">
        <!-- 行政区域第一级表切换 -->
        <el-tabs v-model="activeNameFirst" type="card" @tab-click="tabsFirstListClick">
          <el-tab-pane v-for="(item) in tabsFirstList" :key="item.categoryId" :name="item.categoryId" :label="item.categoryName">
            <!-- <span slot="label"><el-checkbox @change="firstTabs" />{{ item.categoryName }}
            </span> -->
            
            </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="checkTreeType==='dwbz'||checkTreeType==='sjlx'" class="con-header">
        <!-- 顶部表列表切换 -->
        <el-tabs
          ref="Tabletabs"
          v-model="secondLevel"
          type="card"
          :table-list="tableList"
          @tab-click="topRadioChange"
        >
          <el-tab-pane
            v-for="(item) in tableList"
            :key="item.tableName"
            :name="item.tableName"
          >
            <span slot="label"><el-checkbox @change="tabsCheckbox" />{{ item.tableSimpleComment }}
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else>
        <el-tabs
          ref="Tabletabs"
          v-model="secondLevelXZQY"
          type="card"
          :table-list="tableList"
          @tab-click="topRadioChangeXZQY"
        >
          <el-tab-pane
            v-for="item in tableListxzqy"
            :key="item.tableName"
            v-model="checkedXZQY"
            :name="item.tableName"
             :label="item.tableComment"
          >
            <!-- <span slot="label"><el-checkbox @change="tabsCheckboxXZQY" />{{ item.tableComment }}
            </span> -->
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 两个按钮 -->
      <div class="button-con">
        <!-- 导出 -->
        <el-button
          class="elbutton"
          style="position: relative;"
          @click="weizhuang"
        >
          <img
            style="width:20px;height:20px;position:absolute;top:20%;"
            :src="require(`@/icons/newImages/daochu.png`)"
            class="img-class"
            alt=""
          >
          <span style="margin-left:32px">导出</span>
        </el-button>
        <el-button class="elbutton" @click="shaxin">
          <img
            :src="require(`@/icons/newImages/buttonIcon/qiefenButton.png`)"
            class="img-class"
            alt=""
          >
          <span>伪装</span>
        </el-button>
        <!-- 重置 -->
        <el-button class="elbutton" @click="chongzhi">
          <img
            :src="require(`@/icons/newImages/buttonIcon/refresh.png`)"
            class="img-class"
            alt=""
          >
          <span>重置</span>
        </el-button>
      </div>
      <div v-if="checkTreeType==='dwbz'||checkTreeType==='sjlx'" class="table-bon">
        <div class="table-section" style="height: calc(100% - 50px);">
          <el-table
            ref="multipleTable"
            :data="tableData"
            height="70%"
            stripe
            class="table-class"
            header-row-class-name="header-row-class"
            border
            style="width: 100%;"
            :index="table_index"
            @select="onHandleSelect"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            />
            <el-table-column
              v-for="(item, index) in tableCol"
              :key="'index2' + index"
              :label="item.columnComment"
              :prop="item.columnName"
              align="center"
              show-overflow-tooltip
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
              width="50"
              align="center"
            />
            <el-table-column
              v-for="(item, index) in tableCol"
              :key="'index2' + index"
              :label="item.columnComment"
              :prop="item.columnName"
              align="center"
              show-overflow-tooltip
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
      <!-- <div style="width:1200px;height:400px;border:1px solid #e6e6e6;text-align:center;line-height:400px;font-size:12px;color:#a6a6a6">暂无数据</div> -->
    </Containertwo>

    <!-- 导出 -->
    <el-dialog
      title="数据伪装"
      :visible.sync="qiefenDialogVisible"
      custom-class="qiefen-dialog-class"
      width="35%"
      :close-on-click-modal="false"
      @opened="dialogOpened"
      @close="closeDialog"
    >
      <el-form ref="qiefenForm" :model="qiefenForm" label-position="top">
        <el-form-item label="选择伪装方式:">
          <el-radio-group v-model="qiefenForm.camouflageType">
            <el-radio label="1" @change="change">全字段伪装</el-radio>
            <el-radio label="0" @change="change">部分字段伪装</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 部分字段伪装 -->
        <div style="display: flex;width:100%">
          <div v-show="dialog_visible" class="block" style="display: flex;flex-direction: column;width:100%;">
            <el-radio-group v-model="isCustom" style="margin-bottom:20px;">
              <el-radio label="0" @change="selfChange">随机伪装</el-radio>
              <el-radio label="1" @change="selfChange">自定义伪装</el-radio>
            </el-radio-group>
            <!-- 随机伪装 -->
            <el-cascader
              v-show="dialog_visible_cascader"
              ref="cascader"
              v-model="jilianData"
              style="width: 300px"
              :options="options_cascader"
              :props="props"
              clearable
              @change="close"
            />
            <!-- 自定义伪装 -->
            <el-form v-show="dialog_visible_form" ref="dynamicValidateForm" :inline="true" :model="dynamicValidateForm" label-width="90px" class="demo-dynamic">
              <template v-for="(domain, index) in dynamicValidateForm.domains">
                <el-row :key="domain.key" :gutter="10" style="display:flex;">
                  <!-- 原始数据 -->
                  <el-col :span="10">
                    <el-form-item
                      label="原始数据"
                      :prop="'domains.' + index + '.value1'"
                      :rules="{ required: true, message: '原始数据不能为空',trigger: 'blur'}"
                      style="display:flex;"
                    >
                      <el-input
                        v-model="domain.value1"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- 修改数据 -->
                  <el-col :span="10">
                    <el-form-item
                      label="修改数据"
                      :prop="'domains.' + index + '.value2'"
                      :rules="{ required: true, message: '修改数据不能为空',trigger: 'blur'}"
                      style="display:flex;"
                    >
                      <el-input
                        v-model="domain.value2"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- 删除按钮、 -->
                  <el-col :span="5">
                    <el-button style="height:32px;margin-left:10px;" :disabled="dynamicValidateForm.domains.length>1?false:true" @click.prevent="removeDomain(domain)">删除</el-button>
                  </el-col>
                </el-row>
              </template>

              <el-form-item>
                <el-button @click="addDomain">新增</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          style="background: #1f7fd8; color: #fff"
          @click="qiefenHandel"
        >确 定</el-button>
        <el-button @click="qiefenClose('dynamicValidateForm')">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
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
            v-model="vale"
            :options="formFilter.selectData"
            style="width:100%"
            :props="propsFilter"
            @change="cascaderFilter"
          />
          <el-input v-if="domType==='input'||domType==='textarea'" v-model="formFilter.inputData" @change="inputFilter" />
          <el-date-picker
            v-if="domType==='date'"
            v-model="formFilter.datePicker"
            format="yyyy - MM - dd "
            value-format="yyyy-MM-dd"
            type="date"
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
import Tabletabs from './components/tableTabs'

// const id = 0
var vm = {
  checkTreeType1: 'dwbz',
  components: { Container, Containertwo, Tree, Tabletabs },
  data() {
    const this1 = this
    return {
      checkedXZQY: false,
      tableListxzqy: [],
      formFilter: {
        inputData: '',
        selectData: [],
        datePicker: ''
      },
      propsFilter: {
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
      domType: '',
      nameTable: '',
      conditions: [],
      columnProperty: '',
      cascaderValue: '',
      inputValue: '',
      dateValue: '',
      dialogVisibleFilter: false,
      secondLevelXZQY: '',
      tabsFirstList: [],
      activeNameFirst: '1',
      dynamicValidateForm: {
        domains: [{
          value1: '',
          value2: ''
        }]
      },
      email: '',
      tabsNameXZQY: [],
      tabsName: [],
      tabsNameSting: '',
      dialog_visible_cascader: true,
      dialog_visible_form: false,
      // 部分字段伪装后的显示与隐藏
      dialog_visible: false,
      // dialog_visible_all: false,
      treeLabel: '',
      treeFieldId: '',
      // 当前选择的树类型
      checkTreeType: 'dwbz',
      // 当前选择的树节点id
      treeCheckId: [],
      // 当前选择的树节点label
      treeCheckLabel: [],
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
      qiefenDialogVisible: false, // 切分弹框
      // 切分form
      qiefenForm: {
        isCloak: '1',
        camouflageType: '1',
        tableCategory: '00'
      },
      // 切分选项
      dataTypes: [],
      type: '',
      // 表列表
      tableList: [],
      qiefenData: '',
      // dataTypesAll: [], //行政区域全部伪装
      // 编辑
      editDialog: false,
      editForm: {},
      jilianData: [], // 切分成功后返回的数据
      firstObj: {},
      // 级联选择器 懒加载
      props: {
        lazy: true,
        multiple: true,
        lazyLoad(node, resolve) {
          this1.load(node, resolve)
        }
      },
      areaType: [],
      // lazy: true,//级联选择器动态懒加载
      value: [],
      // 级联选择器内容
      options: [],
      categoryId: [],
      erjifenlei: '',
      sjlxId: '', // 数据类型ID
      options_cascader: [],
      secondLevel: '', // 表列表默认选中
      globalKey: [], // 表格页面数据反向选择
      rowIsSelected: true,
      cloakValue: [], // 伪装值数组
      initValue: [], // 原始数组
      isCustom: '0'// 是否自定义  0：非自定义   1：自定义

    }
  },
  created() {
    // 获取树数据
    this.getTreeDWBZ(this.radioList[0].label)
    this.fistCascader()
  },
  methods: {
    tabsCheckbox(val) {
      if (val === true) {
        this.tabsName.push(this.tabsNameSting)
        const map = new Map()
        this.tabsName = this.tabsName.filter(item => !map.has(item) && map.set(item, 1))
      } else {
        const index = this.tabsName.findIndex(item => item === this.secondLevel)
        this.tabsName.splice(index, 1)
        // console.log(this.tabsName, 'tabsName')
      }
      // this.getTableData()
    },
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
    topRadioChangeXZQY(val) {
      this.secondLevel = val.name
      this.conditions = []
      // 获取表头数据
      this.getTableCol(val.name)
      // 获取表格数据
      this.getTableData(val.name)
    },
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
      this.cascaderValue = node.toString()
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
        // this.formFilter.selectData = res.data
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

      sortData.push(sort)
      this.getTableData(this.secondLevel, sortData)
    },
    // 降序
    RowcaretBottom(column, index) {
      const sortData = []
      const sort = {
        sortColumn: column.property,
        sortBy: 'DESC'
      }

      sortData.push(sort)
      this.getTableData(this.secondLevel, sortData)
    },
    // 过滤
    Rowdataanalysis(column, index) {
      this.vale = ''
      this.dialogVisibleFilter = true
      this.labelFilter = column.label
      this.columnProperty = column.property
      this.getTableCol(this.secondLevel)
      // console.log(this.tableCol)
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
      this.formFilter = {}
      this.conditions = []
      if (this.domType === 'select') {
        const conditionCloumn = {
          columnValue: this.cascaderValue || '',
          columnName: this.columnProperty,
          domType: this.domType
        }
        this.conditions.push(conditionCloumn)
      } else if (this.domType === 'input' || this.domType === 'textarea') {
        const conditionCloumn = {
          columnValue: this.inputValue,
          columnName: this.columnProperty,
          domType: this.domType
        }
        this.conditions.push(conditionCloumn)
      } else if (this.domType === 'date') {
        const conditionCloumn = {
          columnValue: this.dateValue,
          columnName: this.columnProperty,
          domType: this.domType
        }
        this.conditions.push(conditionCloumn)
      }
      this.getTableData(this.secondLevel)
    },
    // 过滤模态框取消按钮
    closeFilter() {
      this.dialogVisibleFilter = false
      this.vale = ''
      this.formFilter = {}
    },
    firstTabs(val) {
      this.conditions = ''
      if (val === true) {
        this.categoryId.push(this.categoryIdName)
      } else if (val === false) {
        // item是自己随便定义的一个参数箭头函数之后是返回的满足的值
        // const index = this.categoryId.findIndex(item => item.id==val.id)
        // // console.log(index)
        // this.categoryId.splice(index, 1)
        // // console.log(this.categoryId, 'false')
      }

      const props = {
        categoryId: this.categoryId
      }
      API.getAreaTable(props).then(res => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          this.tableListxzqy = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取行政类型八种类型
    getAreaType() {
      API.getAreaType().then(res => {
        const { data, msg, code } = res
        if (String(code) === '200') {
          this.tabsFirstList = data
          this.activeNameFirst = this.tabsFirstList[0].categoryId
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取行政区域类型下的表
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
          this.tableListxzqy = data
          this.secondLevelXZQY = this.tableListxzqy[0].tableName
          this.getTableCol(this.secondLevelXZQY)
          this.getTableData(this.secondLevelXZQY)
        } else {
          this.$message.error(msg)
        }
      })
    },
    close(val) {
      // console.log(val)
      this.$refs.cascader.dropDownVisible = false // 监听值发生变化就关闭它
    },
    chongzhi() {
      this.conditions = []
      this.getTableCol(this.tableName)
      this.getTableData(this.tableName)
    },
    // 点击行即可让复选框勾选
    handleRowClick(data, node) {
      node.checked = !(node.checked)
    },
    // 伪装模态框关闭事件
    closeDialog() {
      this.qiefenClose('dynamicValidateForm')
    },
    // 随机伪装和自定义伪装切换
    selfChange(label) {
      if (label === '0') { // 随机伪装
        this.dialog_visible_cascader = true
        this.dialog_visible_form = false
        this.dynamicValidateForm.domains.forEach(i => {
          i.value1 = ''
          i.value2 = ''
        })
      } else if (label === '1') { // 自定义伪装
        this.dialog_visible_cascader = false
        this.dialog_visible_form = true
        this.jilianData = []
      }
    },
    // 自定义伪装新增按钮
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value1: '',
        value2: ''
      })
    },
    // 删除条
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    // 树节点多选
    check(nodes, keys) {
      // 当前选中的节点
      // const aa = this.$refs.myTree.getCheckedData()
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
      this.getTableData(this.tableName)
      this.conditions = []
      if (this.checkTreeType === 'dwbz' || this.checkTreeType === 'sjlx') {
        this.getTableList(this.treeCheckId, this.treeCheckLabel)
      }
    },
    // 表列表移除tableList
    // removeTab(targetName) {
    //   const tabs = this.tableList
    //   let activeName = targetName
    //   let qq = ''
    //   if (activeName === targetName) {
    //     tabs.forEach((tab, index) => {
    //       if (tab.tableName === targetName) {
    //         const nextTab = tabs[index + 1] || tabs[index - 1]
    //         qq = nextTab
    //         if (nextTab) {
    //           activeName = nextTab.tableName
    //         }
    //       }
    //     })
    //   }
    //   // 删除表列表数据
    //   this.secondLevel = activeName
    //   this.tableList = tabs.filter(tab => tab.tableName !== targetName)
    //   // 过滤表列表下的表头数据
    //   const tabss = this.tableCol
    //   this.tableCol = tabss.filter(tab => tab.tableComment === targetName)
    //   // 过滤表格数据
    //   this.tableData = tabss.filter(tab => tab.tableComment === targetName)
    //   // if (String(this.tableList.length) === '0') {
    //   //   this.daochuButton = true
    //   //   this.weizhaungButton = true
    //   // }
    //   if (qq) {
    //     // 重新获取表头数据
    //     this.getTableCol(qq.tableName)
    //     // 重新获取表格数据
    //     this.getTableData(qq.tableName)
    //   }
    // },
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
            if (this.rowIsSelected) {
              this.$set(row, 'isSelected', true) // 设置当前选中行的“isSelected”是否选中
            } else {
              this.$set(row, 'isSelected', false)
            }
            this.$refs.multipleTable.toggleRowSelection(row) // 设置表格全选
          }
        })
      }
    },
    // 级联选择器第一级
    fistCascader() {
      var type1 = vm.checkTreeType1
      if (type1 === 'dwbz') {
        API.getUnitTableList({}).then(res => {
          const { data } = res
          data.forEach(item => {
            item.value = item.tableName
            item.label = item.tableSimpleComment
            this.options_cascader.push({ value: item.value, label: item.label })
          })
        })
      } else if (type1 === 'xzqy') {
        API.getAreaList({}, 'all').then(res => {
          const { data } = res
          data.forEach(item => {
            item.value = item.tableName
            item.label = item.tableSimpleComment
            this.options_cascader.push({ value: item.value, label: item.label })
          })
        })
      }
    },
    // 级联选择器懒加载
    load(node, resolve) {
      this.node = node
      this.resolve = resolve
      // let prop
      // var type1 = vm.checkTreeType1
      const { level } = node
      if (node.level === 1) {
        API.getStructure({}, node.data.value).then(res => {
          const { data } = res
          this.tableName = node.data.tableName
          data.forEach(item => {
            item.value = item.columnName
            item.label = item.commentsView
            item.leaf = level >= 0
          })
          resolve(data)
        })
      }
    },
    // 切分模态框单选按钮切换  显示与隐藏
    change(label) {
      if (String(label) === '1') {
        this.dialog_visible = false
      } else if (String(label) === '0') {
        this.dialog_visible = true
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
      this.jilianData = []
      this.options_cascader = []
    },
    // 切换树
    treeRadioChange(val) {
      vm.checkTreeType1 = val
      this.checkTreeType = val
      this.reset()
      this.tabsName = []
      this.tabsNameXZQY = []
      // this.getUnitTree(val)
      this.fistCascader()
      this.dialog_visible = false
      this.jilianData = []
      this.dynamicValidateForm.domains.forEach(i => {
        i.value1 = ''
        i.value2 = ''
      })
      this.cloakValue = []
      this.initValue = []
      this.conditions = []
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
    // 获取树
    // getUnitTree(type) {
    //   let prop
    //   this.type = type
    //   if (type === 'dwbz') {
    //     prop = '/force'
    //     API.getDataTypeTree({}, prop).then(res => {
    //       const { code, data, msg } = res
    //       if (String(code) === '200') {
    //         this.treeData = data
    //         this.$refs.myTree.setChecks(this.treeData)
    //         this.getFirstTableList(this.treeData)
    //       } else {
    //         this.$message.error(msg)
    //       }
    //     })
    //   } else if (type === 'sjlx') {
    //     prop = ''
    //     API.getDataTypeTree({}, prop).then(res => {
    //       const { code, data, msg } = res
    //       if (String(code) === '200') {
    //         this.treeData = data
    //         this.$refs.myTree.setChecks(this.treeData)
    //         this.getFirstTableList(this.treeData)
    //       } else {
    //         this.$message.error(msg)
    //       }
    //     })
    //   } else if (type === 'xzqy') {
    //     API.getAreaTree().then(res => {
    //       const { code, data, msg } = res
    //       if (String(code) === '200') {
    //         this.treeData = data
    //         this.$refs.myTree.setChecks(this.treeData)
    //         this.getFirstTableList(this.treeData)
    //       } else {
    //         this.$message.error(msg)
    //       }
    //     })
    //   }
    // },
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
    getFirstTableList(val) {
      const regObj = this.getFirstNode(val)
      if (this.checkTreeType === 'dwbz') {
        if (regObj && regObj.field) {
          this.getTableList([regObj.field], [regObj.label])
        }
      } else if (this.checkTreeType === 'sjlx') {
        if (regObj && regObj.id) {
          this.getTableList([regObj.field], [regObj.label])
        }
      } else {
        if (regObj && regObj.id) {
          const props = {
            categoryId: [this.activeNameFirst]
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
        }
      }
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
        if (this.treeCheckId.toString() === '') {
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
                this.options_cascader = []
                data.forEach(item => {
                  item.value = item.tableName
                  item.label = item.tableSimpleComment
                  this.options_cascader.push({ value: item.value, label: item.label })
                })
              })

              // var temp = {}
              // this.options_cascader = this.tableList.reduce((prev, curv) => {
              //   // // console.log(prev, curv)
              //   // 如果临时对象中有这个名字，什么都不做
              //   if (temp[curv.label]) {
              //     // // console.log(temp)
              //   } else {
              //     temp[curv.label] = true
              //     prev.push(curv)
              //   }
              //   return prev
              // }, [])
              // console.log(this.options_cascader)

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
    // 表切换
    topRadioChange(tab) {
      this.conditions = ''
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
        this.conditions = ''
      }
      if (this.checkTreeType === 'xzqy') {
        // this.areaType = []
        // this.tabsNameXZQY = []
        // for (let i = 0; i < this.tabsNameXZQY.length; i++) {
        //   this.areaType.push(this.tabsNameXZQY[i] + '_' + this.activeNameFirst)
        // }
        // console.log(this.areaType)
        params = {
          tableName: this.tableName,
          splitType: '3',
          areaCode: this.treeCheckId,
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          isExport: '0',
          isCloak: '0',
          areaType: this.areaType.toString(),
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
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 表格序号下标
    table_index(index) {
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    },
    // 表格复选框
    onHandleSelect(selection, row) {
      this.rowIsSelected = !row.isSelected
      this.$set(row, 'isSelected', this.rowIsSelected)
      if (this.rowIsSelected) {
        this.globalKey.push(row.UNIQUE)
      } else {
        const index = this.globalKey.indexOf(row.UNIQUE)
        if (index > -1) {
          this.globalKey.splice(index, 1)
        }
      }
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
    shaxin() {
      var params
      if (this.conditions.length === 0) {
        this.conditions = ''
      }
      this.areaType = []
      if (this.categoryIdName || this.secondLevelXZQY) {
        this.areaType.push(`${this.secondLevelXZQY}_${this.activeNameFirst}`)
        this.tableName = this.secondLevelXZQY
        const map = new Map()
        this.areaType = this.areaType.filter(item => !map.has(item) && map.set(item, 1))
      } else {
        this.areaType.push(`${this.tableName}_${this.activeNameFirst}`)
      }
      if (this.checkTreeType === 'xzqy') {
        params = {
          tableName: this.tableName,
          // areaType: this.areaType.toString(),
          areaType: this.tableName + '_' + this.activeNameFirst || '',
          splitType: '3',
          areaCode: this.treeCheckId,
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          isExport: '0',
          isCloak: '1',
          sort: '',
          conditions: this.conditions
        }
      } else if (this.checkTreeType === 'dwbz') {
        params = {
          tableName: this.tableName,
          splitType: '2',
          forceCode: this.treeCheckId,
          forceName: this.treeCheckLabel,
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          isExport: '0',
          isCloak: '1',
          sort: '',
          conditions: this.conditions
        }
      } else if (this.checkTreeType === 'sjlx') {
        params = {
          tableName: this.tableName,
          splitType: '1',
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          isExport: '0',
          isCloak: '1',
          sort: '',
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
        } else {
          this.$message.error(msg)
        }
      })

      this.getTableCol(this.tableName)
      this.rowIsSelected = true
    },
    // 导出
    weizhuang() {
      this.qiefenDialogVisible = true
    },
    // 会话框打开
    dialogOpened() {
      this.$refs.qiefenForm.resetFields()
    },
    // 确定伪装
    qiefenHandel() {
      
      console.log(this.isCustom)
      if (this.isCustom === '1') {
        this.$refs.dynamicValidateForm.validate().then(valid => {
          var params
          this.dynamicValidateForm.domains.forEach(i => {
            this.initValue.push(i.value1)
            this.cloakValue.push(i.value2)
          })
          if (this.conditions.length === 0) {
            this.conditions = ''
          }

          if (this.checkTreeType === 'xzqy') {
            // join() 方法用于把数组中的所有元素放入一个字符串  默认使用逗号作为分隔符
            this.areaType = []
            for (let i = 0; i < this.tabsNameXZQY.length; i++) {
              this.areaType.push(this.tabsNameXZQY[i] + '_' + this.activeNameFirst)
            }
            params = {
              splitType: '3',
              areaType: this.areaType.toString(),
              isCustom: this.isCustom,
              initValue: this.initValue,
              cloakValue: this.cloakValue,
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
              isCustom: this.isCustom,
              initValue: this.initValue,
              cloakValue: this.cloakValue,
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
              isCustom: this.isCustom,
              initValue: this.initValue,
              cloakValue: this.cloakValue,
              isCloak: this.qiefenForm.isCloak,
              isCloakAll: this.qiefenForm.camouflageType,
              isExport: '1',
              tableName: this.tabsName.toString(),
              sort: '',
              conditions: this.conditions,
              unCheckIds: this.globalKey
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
            sss = sss + this.jilianData[i][0] + '-' + this.jilianData[i][1]
            // 表名
            rrr = rrr + this.jilianData[i][0]
          }
          // // console.log(rrr.replace(/(^\s*)|(\s*$)/g, ""));
          var ss = rrr.split(',') // 使用","切割表名
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

          // // 伪装请求
          API.sendExport(params).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              const urls = JSON.parse(data)
              window.location.href = urls.excelUrL
              this.qiefenDialogVisible = false
              this.$nextTick(() => {
                this.$message({
                  type: 'success',
                  message: '伪装成功!'
                })
              })
              this.qiefenClose('dynamicValidateForm')
              this.dynamicValidateForm.domains.length = '1'
              this.tabsNameXZQY = []
            } else {
              this.$message.error(msg)
            }
          })
        })
      } else {
        // this.$message({
        //   type: 'info',
        //   message: '正在伪装，请等待~'
        // })
        var params
        const newTableList = []
        this.tableList.forEach(item => {
          newTableList.push(item.tableName)
        })
        this.dynamicValidateForm.domains.forEach(i => {
          this.initValue.push(i.value1)
          this.cloakValue.push(i.value2)
        })
        if (this.checkTreeType === 'xzqy') {
        // join() 方法用于把数组中的所有元素放入一个字符串  默认使用逗号作为分隔符
          this.areaType = []
          for (let i = 0; i < this.tabsNameXZQY.length; i++) {
            this.areaType.push(this.tabsNameXZQY[i] + '_' + this.activeNameFirst)
          }
          params = {
            areaType: this.areaType.toString(),
            splitType: '3',
            isCustom: this.isCustom,
            initValue: this.initValue,
            cloakValue: this.cloakValue,
            isCloak: this.qiefenForm.isCloak,
            areaCode: this.treeCheckId,
            isCloakAll: this.qiefenForm.camouflageType,
            tableName: this.tabsNameXZQY.toString(),
            isExport: '1',
            unCheckIds: this.globalKey // 未选中的值
          }
        } else if (this.checkTreeType === 'dwbz') {
          params = {
            splitType: '2',
            isCustom: this.isCustom,
            initValue: this.initValue,
            cloakValue: this.cloakValue,
            isCloak: this.qiefenForm.isCloak,
            forceCode: this.treeCheckId,
            forceName: this.treeCheckLabel,
            isCloakAll: this.qiefenForm.camouflageType,
            tableName: this.tabsName.toString(),
            isExport: '1',
            unCheckIds: this.globalKey
          }
        } else if (this.checkTreeType === 'sjlx') {
          params = {
            splitType: '1',
            isCustom: this.isCustom,
            initValue: this.initValue,
            cloakValue: this.cloakValue,
            isCloak: this.qiefenForm.isCloak,
            isCloakAll: this.qiefenForm.camouflageType,
            isExport: '1',
            tableName: this.tabsName.toString(),
            unCheckIds: this.globalKey
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
          sss = sss + this.jilianData[i][0] + '-' + this.jilianData[i][1]
          // 表名
          rrr = rrr + this.jilianData[i][0]
        }
        params.cloakColumn = sss
        if (params.splitType === '3' && params.isCloakAll === '0') {
          params.tableCategory = rrr
        }

        // // 伪装请求
        API.sendExport(params).then(res => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            const urls = JSON.parse(data)
            window.location.href = urls.excelUrL
            this.qiefenDialogVisible = false
            // this.tabsName = []
            // this.tabsNameXZQY = []
            this.$nextTick(() => {
              this.$message({
                type: 'success',
                message: '伪装成功!'
              })
            })
            this.qiefenClose('dynamicValidateForm')
            this.dynamicValidateForm.domains.length = '1'
          } else {
            this.$message.error(msg)
          }
        })
      }
    },
    // 伪装取消
    qiefenClose(formName) {
      this.qiefenDialogVisible = false
      this.qiefenForm = {
        isCloak: '1',
        camouflageType: '1',
        tableCategory: '00'
      }
      // this.options_cascader = []
      this.dialog_visible = false
      this.isCustom = '0'
      this.dialog_visible_cascader = true
      this.dialog_visible_form = false
      this.jilianData = []
      this.dynamicValidateForm.domains.forEach(i => {
        i.value1 = ''
        i.value2 = ''
      })
      this.$refs[formName].resetFields()
      this.tabsNameXZQY = []
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
        isCloak: '1',
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
        isCloak: '1',
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
    }
  }
}
export default vm
</script>

<style lang="scss" scoped>
.con-one {
  display: flex;
  justify-content: space-between;
  .el-dialog{
    .block{
      .demo-dynamic{
        >>> .el-form-item__content{
          display: flex;
          // margin-left: 10px;
          margin-left: 5px !important;

        }

      }
    }
  }
  .con-two {
    width: calc(100% - 370px);
    height: 100%;
    .con-header {
      width: 100%;
      height: 50px;
      margin-bottom: 20px;
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
      height: calc(100% - 100px);
      .table-section {
        width: 100%;
        height: calc(100% - 50px);
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
        height: 30px;
        margin: 10px 0;
        text-align: right;
      }
    }
  }
}
</style>
