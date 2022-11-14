<template>
  <Container>
    <Containertwo own-class="con-two">
      <div class="dataCust">
        <div class="queryCondition">
          <el-form ref="searchForm" :model="searchForm" label-position="right" label-width="85px" class="top-form">
            <el-row :gutter="25" style="width:100%">
              <el-col :span="6">
                <el-form-item label="主题名称" prop="topicName">
                  <el-input v-model="searchForm.topicName" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="主题描述" prop="topicDescribe">
                  <el-input v-model="searchForm.topicDescribe" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="主题创建人" prop="createBy">
                  <el-input v-model="searchForm.createBy" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="6" style="text-align:center">
                <el-button style="background:#1F7FD8;color:#fff;" @click="getTableData">查询</el-button>
                <el-button @click="reset">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="button-con">
          <el-button class="elbutton" @click="addTheme">
            <img :src="require(`@/icons/newImages/buttonIcon/add.png`)" class="img-class" alt="">
            <span>新建</span>
          </el-button>
        </div>
        <div class="table-bon">
          <div class="table-section">
            <el-table
              :data="tableData"
              stripe
              height="100%"
              header-row-class-name="header-row-class"
              border
              style="width: 100%;"
              :index="table_index"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
              />
              <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center"
              />
              <el-table-column
                label="主题名称"
                prop="topicName"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                label="主题描述"
                prop="topicDescribe"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                label="主题类型"
                prop="topicType"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                label="创建人"
                prop="createBy"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                label="创建时间"
                prop="createTime"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                label="操作"
                align="center"
                width="250"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    style="color:#1F7FD8"
                    @click="onHandleView(scope.row)"
                  >
                    详情
                  </el-button>
                  <el-divider direction="vertical" />
                  <el-button
                    type="text"
                    size="small"
                    style="color:#1F7FD8"
                    @click="onHandleEdit(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-divider direction="vertical" />
                  <el-button
                    type="text"
                    size="small"
                    style="color:#1F7FD8"
                    @click="onHandleDeleteByRow(scope.row)"
                  >
                    删除
                  </el-button>
                  <el-divider direction="vertical" />
                  <el-button
                    type="text"
                    size="small"
                    style="color:#1F7FD8"
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
    <!-- 新增编辑产品 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogThemeVisible"
      width="900px"
      custom-class="qiefen-dialog-class"
      @closed="dialogThemeClosed"
    >
      <el-form
        ref="addThemeForm"
        :model="addThemeForm"
        :rules="themeRules"
        class="qiefen-dialog-form"
      >
        <el-row :gutter="120">
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
        <el-col :span="10" class="tree-box">
          <el-input
            v-model="filterText"
            style="padding:5px 0;"
            prefix-icon="el-icon-search"
            placeholder="输入要搜索内容..."
          />
          <el-scrollbar style="height: calc(100% - 42px);">
            <el-tree
              ref="tree"
              class="filter-tree"
              node-key="id"
              :data="treeData"
              :props="treeProps"
              :filter-node-method="filterNode"
              default-expand-all
              show-checkbox
              check-on-click-node
              @check="treeClick"
            />
          </el-scrollbar>
        </el-col>
        <el-col :span="4" class="botton-box">
          <el-button icon="el-icon-arrow-right" class="botton-box-button" :disabled="checkedNodes.length==0" @click="toRight" />
          <el-button icon="el-icon-arrow-left" class="botton-box-button" :disabled="selecListSub.length==0" @click="toLeft" />
        </el-col>
        <el-col :span="10" class="list-box">
          <el-table
            :data="checkList"
            height="100%"
            :show-header="false"
            empty-text=" "
            @selection-change="checkListChangeHandel"
          >
            <el-table-column
              type="selection"
              width="45"
              align="center"
            />
            <el-table-column prop="label" align="left" show-overflow-tooltip />
            <el-table-column width="70px" align="center">
              <!-- label非常重要 -->
              <template v-slot="props">
                <el-radio
                  v-model="selectName"
                  :label="props.row.tableName"
                  @change="handleRowChange(props.row)"
                >{{ "" }}</el-radio>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button style="background:#1F7FD8;color:#fff;" @click="saveTheme">确 定</el-button>
        <el-button @click="closeThemeDialog">取 消</el-button>
      </span>
    </el-dialog>
  </Container>
</template>

<script>
// import * as API from '@/api/DataPush/ProductManagement.js'
import Container from '@/components/Container'
import Containertwo from '@/components/ContainerTwo'
export default {
  components: { Container, Containertwo },
  data() {
    return {
      // 新建主题相关=================================
      dialogTitle: '',
      // 新建主题单选
      selectName: '',
      // 新建主题相关
      filterText: '',
      dialogThemeVisible: false,
      // 树内容
      treeData: [],
      // 树配置
      treeProps: {
        label: 'label',
        children: 'childList'
      },
      // 右侧已选树表格
      checkList: [],
      // 临时储存树已勾选表格
      checkLIst: [],
      // 储存右侧表格勾选
      selecListSub: [],
      // 储存左侧树勾选内容
      checkedNodes: [],
      // 新增上面两个input
      addThemeForm: {
        topicName: undefined,
        topicDescribe: undefined
      },
      themeRules: {
        topicName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      },

      // 表格相关=======================↓
      // 表格查询form
      searchForm: {
        topicName: undefined,
        topicDescribe: undefined,
        createBy: undefined
      },
      tableData: [],
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      // 表格相关=======================↑

      // 修改相关=======================↓
      editObj: {}
    }
  },
  watch: {
    filterText(val) {
      if (this.$refs.tree) {
        this.$refs.tree.filter(val)
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 新增主题相关=====================================================
    checkListChangeHandel(selection) {
      this.selecListSub = selection
    },
    isHaveTreeCheck() {
      console.log(this.$refs.tree.getCurrentNode())
      return false
    },
    toLeft() {
      var treeDeleteList = []
      this.checkList.forEach(i => {
        var isHave = this.selecListSub.some(j => {
          return i.tableName === j.tableName
        })
        if (!isHave) {
          treeDeleteList.push(i)
        }
      })
      var clearName = this.selecListSub.find(item => {
        return item.tableName === this.selectName
      })
      clearName ? this.selectName = '' : ''
      this.checkList = [...treeDeleteList]
      this.selecListSub = []
    },
    toRight() {
      this.$refs.tree.setCheckedKeys([])
      this.checkList = [...this.checkLIst]
      this.checkLIst = []
    },
    treeClick(obj, items) {
      this.checkedNodes = items.checkedNodes
      var checkLIst = [...this.checkList]
      items.checkedNodes.forEach(element => {
        var isHave = this.checkList.some(j => {
          return element.tableName === j.tableName
        })
        if (!element.childList && !isHave) { checkLIst.push(element) }
      })
      this.checkLIst = [...checkLIst]
    },
    handleRowChange(data) {
      this.selectName = data.tableName
    },
    // 查询树结构
    addTheme() {
      this.dialogTitle = '新增主题数据'
      API.getDataTypeTree().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeData = data
          this.dialogThemeVisible = true
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
    // 新增主题保存
    saveTheme() {
      var notCheckRadio = true
      this.checkList.forEach(item => {
        if (item.tableName === this.selectName) {
          notCheckRadio = false
        }
      })
      if (notCheckRadio) {
        this.$message.warning('请选择主表!')
        return
      }
      this.$refs.addThemeForm.validate((valid) => {
        if (valid) {
          const topicTableRelationEntities = []
          this.checkList.forEach(el => {
            topicTableRelationEntities.push({
              tableComment: el.label,
              tableName: el.tableName,
              isPrimary: el.tableName === this.selectName ? 0 : 1
            })
          })
          const params = {
            ...this.addThemeForm,
            topicTableRelationEntities,
            topicId: this.editObj ? this.editObj.topicId : null
          }
          if (this.dialogTitle === '编辑主题数据') {
            // 修改
            API.updateTheme(params).then(res => {
              const { code, msg } = res
              if (String(code) === '200') {
                this.$message.success(msg)
                this.getTableData()
                this.dialogThemeVisible = false
              } else {
                this.$message.error(msg)
              }
            })
          } else {
            API.addTheme(params).then(res => {
              const { code, msg } = res
              if (String(code) === '200') {
                this.$message.success(msg)
                this.getTableData()
                this.dialogThemeVisible = false
              } else {
                this.$message.error(msg)
              }
            })
          }
        }
      })
    },
    // 关闭新建主题
    closeThemeDialog() {
      this.dialogThemeVisible = false
    },
    dialogThemeClosed() {
      this.resetTheme()
    },
    resetTheme() {
      this.$refs.addThemeForm.clearValidate()
      // 新建主题单选
      this.selectName = ''
      // 新建主题相关
      this.filterText = ''
      // 树内容
      this.treeData = []
      // 右侧已选树表格
      this.checkList = []
      // 临时储存树已勾选表格
      this.checkLIst = []
      // 储存右侧表格勾选
      this.selecListSub = []
      // 储存左侧树勾选内容
      this.checkedNodes = []
      // 新增上面两个input
      this.addThemeForm = {
        topicName: undefined,
        topicDescribe: undefined
      }
      this.editObj = {}
    },

    // 表格相关=====================================================
    // index配置
    table_index(index) {
      return (this.pager.pageNum - 1) * this.pager.pageSize + index + 1
    },
    // 获取表格数据
    getTableData() {
      const params = {
        ...this.searchForm,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize
      }
      API.getTableData(params).then(res => {
        const { code, rows, msg, total } = res
        if (String(code) === '200') {
          this.tableData = rows
          this.pager.total = total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 重置
    reset() {
      this.$refs.searchForm.resetFields()
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.selectedRows = val
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
    // ====================================================================
    // 编辑
    onHandleEdit(row) {
      this.editObj = row
      this.dialogTitle = '编辑主题数据'
      // 新建主题单选
      this.selectName = row.topicTableRelationEntities[0].tableName
      // 右侧已选树表格
      this.checkList = row.topicTableRelationEntities.map(item => {
        item.label = item.tableComment
        return item
      })
      // 新增上面两个input
      this.addThemeForm.topicName = row.topicName
      this.addThemeForm.topicDescribe = row.topicDescribe
      API.getDataTypeTree().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeData = data
          this.dialogThemeVisible = true
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 导出
    onHandleDownLoad(row) {
      API.exportTopic({ topicId: row.topicId }).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.$message.success(msg)
          window.open(API.BastUrl + data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 删除
    onHandleDeleteByRow(row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          API.deleteTheme({ topicId: row.topicId }).then(res => {
            const { code, msg } = res
            if (String(code) === '200') {
              this.$message.success(msg)
              this.getTableData()
            } else {
              this.$message.error(msg)
            }
          })
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dataCust {
  height: 100%;
  .queryCondition {
    width: 100%;
    height: 50px;
    margin-bottom: 15px;
    border-radius: 7px;
    border:1px solid #E9EAEF;
    .top-form{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .button-con{
    width: 100%;
    height: 40px;
    padding: 5px 0;
    margin-bottom: 10px;
    .elbutton{
      margin-right:15px;
      line-height: 30px;
      padding: 0px 15px;
      .img-class{
        vertical-align: bottom;
        border-style: none;
        height: 30px;
      }
    }
  }
  .table-bon{
    width: 100%;
    height: calc(100% - 115px);
    .table-section{
      width: 100%;
      height: calc(100% - 50px);
    }
    .pager-section{
      width: 100%;
      height: 30px;
      margin: 10px 0;
      text-align: right;
    }
  }
}
</style>
