    <!-- 表关联新增编辑 -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addIsShowChilren"
      width="50%"
      top="50px"
      custom-class="qiefen-dialog-class"
      @closed="dialogThemeClosed"
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
      <el-row :gutter="10">
        <el-col :span="10" class="tree-box" style="width: 389px">
          <el-input
            v-model="filterText"
            style="padding: 5px 0"
            prefix-icon="el-icon-search"
            placeholder="输入要搜索内容..."
          />
          <el-scrollbar style="height: calc(100% - 42px)">
            <el-tree
              ref="leftTree"
              class="filter-tree"
              node-key="id"
              :data="treeData"
              :props="treeProps"
              :filter-node-method="filterNode"
              :default-checked-keys="defaultExpandKeys"
              default-expand-all
              show-checkbox
              check-on-click-node
              @check="leftTreeClick('leftTree')"
            />
          </el-scrollbar>
        </el-col>
        <el-col :span="4" class="botton-box" style="width: 144px">
          <el-button
            icon="el-icon-arrow-right"
            class="botton-box-button"
            :disabled="leftTreeCheckList.length == 0"
            @click="toRight"
          />
          <el-button
            icon="el-icon-arrow-left"
            class="botton-box-button"
            :disabled="selectTreeRightData.length == 0"
            @click="toLeft('leftTree')"
          />
        </el-col>
        <el-col :span="10" class="list-box" style="width: 384px">
          <el-table
            :data="rightTableData"
            height="100%"
            :show-header="false"
            empty-text=" "
            @selection-change="checkListChangeHandel"
          >
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column prop="label" align="left" show-overflow-tooltip />
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogThemeClosed">取 消</el-button>
        <el-button
          type="primary"
          style="background: #1f7fd8; color: #fff"
          @click="saveTheme"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/index'
export default {
  name: '',
  props: {
    addIsShow: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'add'
    },
    editRow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 对话框标题
      dialogTitle: '',
      // 对话框是否显示
      addIsShowChilren: this.addIsShow,
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
      // 默认显示数据
      defaultExpandKeys: [],
      // 树配置
      treeProps: {
        label: 'label',
        children: 'childList'
      },
      // 临时储存树已勾选表格
      leftTreeCheckList: [],
      // 储存右侧表格勾选
      selectTreeRightData: [],
      // 右侧树数据
      rightTableData: [],
      // 右侧已选树表格
      checkList: [],
      topicId: '',
      globalKey: {} // 表格页面数据反向选择

    }
  },
  watch: {
    type: {
      handler(val) {
        if (val === 'add') {
          this.dialogTitle = '新增主题数据'
        } else {
          this.dialogTitle = '编辑主题数据'
        }
      },
      immediate: true
    },
    filterText(val) {
      if (this.$refs.leftTree) {
        this.$refs.leftTree.filter(val)
      }
    }
  },
  created() {
    // 获取树
    this.getTreeData()
    if (this.type === 'edit') {
      this.topicId = this.editRow.topicId
      this.addThemeForm.topicName = this.editRow.topicName
      this.addThemeForm.topicDescribe = this.editRow.topicDescribe
      // 回显树 和 表格数据
      this.defaultExpandKeys = []
      this.rightTableData = []
      this.editRow.topicTableResponseList.forEach(item => {
        this.defaultExpandKeys.push(item.filedId)
        item.label = item.tableComment
        this.rightTableData.push({ ...item })
      })
      this.leftTreeCheckList = [...this.rightTableData]
    }
  },
  methods: {
    dialogThemeClosed() {
      this.addIsShowChilren = false
      this.$emit('closeaddRelaevanDialog')
    },
    // 查询树结构
    getTreeData() {
      this.rightTableData = []
      this.dialogTitle = '新增主题数据'
      const props = {
        isContainOrg: '1'
      }
      API.getCustomizationDataTypeTree(props).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeData = data
          this.addIsShowChilren = true
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 树过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 左侧树选中
    leftTreeClick(tree) {
      const selectedTreeNode = this.$refs[tree].getCheckedNodes()
      selectedTreeNode.forEach(item => {
        if (!item.field && !this.leftTreeCheckList.find(checkedItem => checkedItem.tableName === item.tableName)) {
          this.leftTreeCheckList.push(item)
        }
      })
    },
    // 右侧树多选
    checkListChangeHandel(selection) {
      this.selectTreeRightData = selection
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
    toRight() {
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
    },
    toLeft(tree) {
      this.selectTreeRightData.forEach(item => {
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
          this.defaultExpandKeys.splice(index, 1)
          // 左侧树勾选状态处理
          this.$refs[tree].setChecked(item.filedId, false)
        }
      })

      // 删除右侧数据
      const rightTableData = []
      this.rightTableData.forEach(item => {
        if (!this.selectTreeRightData.find(selectItem => selectItem.tableName === item.tableName)) {
          rightTableData.push(item)
        }
      })
      this.rightTableData = rightTableData
    },
    // 确定
    saveTheme() {
      this.$refs.addThemeForm.validate((valid) => {
        if (valid) {
          const topicTableRequestList = []
          this.checkList.forEach((el) => {
            topicTableRequestList.push({
              tableComment: el.label,
              tableName: el.tableName
            })
          })
          const targetArr = []
          this.rightTableData.forEach(item => {
            targetArr.push({
              isPrimary: item.tableName === this.selectNameSS ? 1 : 0,
              tableComment: item.label,
              tableName: item.tableName
            })
          })
          const params = {
            ...this.addThemeForm,
            topicTableRequestList: targetArr,
            topicType: '0',
            topicId: this.topicId || null
          }
          if (this.type === 'edit') { // 编辑
            // 修改
            API.updateTheme(params).then((res) => {
              const { code, msg } = res
              if (String(code) === '200') {
                this.$message.success(msg)
                this.$emit('updateTheme')
                this.addIsShowChilren = false
              } else {
                this.$message.error(msg)
              }
            })
          } else {
            API.saveTheme(params).then((res) => { // 新增
              const { code, msg } = res
              if (String(code) === '200') {
                this.$message.success(msg)
                this.$emit('saveTheme')
                this.addIsShowChilren = false
              } else {
                this.$message.error(msg)
              }
            })
          }
        }
      })
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
    width: 480px;
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
