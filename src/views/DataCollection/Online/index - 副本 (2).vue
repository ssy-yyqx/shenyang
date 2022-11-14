<template>
  <Container>
    <div class="container-main">
      <div class="container-main-tabsSection zdy-table">
        <el-tabs v-model="firstLevel" type="card" @tab-click="changeTabList">
          <el-tab-pane
            v-for="item in tabsList"
            :key="item.categoryId"
            class="elTabsPane"
            :label="item.categoryName"
            :name="item.categoryId"
          />
        </el-tabs>
      </div>
      <div class="container-section">
        <div v-show="showLeftTree" class="left-section">
          <!-- <div class="left-tree"> -->
          <!-- <div class="search-section">
            <el-input
              v-model="filterText"
              size="small"
              placeholder="输入关键字进行过滤"
              prefix-icon="el-icon-search"
            />
          </div> -->
          <!-- 部队树 -->
          <div v-show="isBdTree" class="treebox">
            <el-tree
              ref="tree"
              lazy
              :load="loadBdTreeNode"
              :highlight-current="true"
              :accordion="true"
              :default-checked-keys="bdCheckedList"
              :props="defaultProps"
              node-key="id"
              :filter-node-method="filterNode"
              @node-click="onHandleClickBdTreeNode"
            />
          </div>
          <!-- 装备树 -->
          <div v-show="isZbTree" class="treebox">
            <el-tree
              ref="tree"
              lazy
              :load="loadZbTreeNode"
              :highlight-current="true"
              :accordion="true"
              :default-checked-keys="zbCheckedList"
              :props="defaultProps"
              node-key="id"
              @node-click="onHandleClickZbTreeNode"
            />
          </div>
          <!-- </div> -->
        </div>
        <div class="right-section" :class="{ 'full-show': !showLeftTree }">
          <div class="tabs-section zdy-table">
            <el-tabs
              v-model="secondLevel"
              type="card"
              @tab-click="changeNormalTab(secondLevel)"
            >
              <el-tab-pane
                v-for="item in subTabsList"
                :key="item.categoryId"
                :label="item.categoryName"
                :name="item.categoryId"
              />
            </el-tabs>
          </div>
          <div class="table-section">
            <template
              v-if="
                thirdLevel === 'ZZBZ_D_ZB_ZBZJXN' ||
                  thirdLevel === 'ZZBZ_D_HJJT_ZBZJXN'
              "
            >
              <el-tabs
                v-model="thirdLevel"
                class="onLineDataTabs"
                @tab-click="changeOnLineDataTabs()"
              >
                <el-tab-pane
                  v-for="item in onLineDataList"
                  :key="item.tableName"
                  :label="item.tableSimpleComment"
                  :name="item.tableName"
                />
              </el-tabs>
              <div class="container-content">
                <FormPageZBZJXN
                  :form-list="formList"
                  :second-level="secondLevel"
                  :third-level="thirdLevel"
                  :force-code="forceCode"
                  :equipment-code="equipmentCode"
                  :is-edit="operationType === 'edit'"
                  :tab-list="tabList"
                  :operation-type="operationType"
                  :first-level="firstLevel"
                />
              </div>
            </template>

            <!-- 关键岗位人员 -->
            <template v-else-if="thirdLevel === 'ZZLL_GJGWRY'">
              <div class="form-section">
                <Form
                  v-if="!loading && !loadingFormList"
                  :second-level="secondLevel"
                  :third-level="thirdLevel"
                  :force-code="forceCode"
                  :category-name="categoryName"
                />
              </div>
            </template>
            <!-- 其他 -->
            <template v-else>
              <el-tabs
                v-model="thirdLevel"
                class="onLineDataTabs"
                @tab-click="changeOnLineDataTabs()"
              >
                <el-tab-pane
                  v-for="item in onLineDataList"
                  :key="item.tableName"
                  :label="item.tableSimpleComment"
                  :name="item.tableName"
                />
              </el-tabs>
              <div
                class="child-tab__container"
                :class="{
                  'child-tab__container-all': thirdLevel === 'ZZLL_GJGWRY',
                }"
              >
                <div class="container-content">
                  <FormGenerate
                    v-if="!loading && !loadingFormList"
                    ref="tableForm"
                    :tab="thirdLevel"
                    :first-level="firstLevel"
                    :second-level="secondLevel"
                    :third-level="thirdLevel"
                    :form-list="formList"
                    :form-values="formValues"
                    :force-code="forceCode"
                    :equipment-code="equipmentCode"
                    :is-edit="operationType === 'edit'"
                    :category-name="categoryName"
                  />
                </div>
                <div v-if="formList.length > 0" class="container-btns">
                  <el-button
                    size="small"
                    type="primary"
                    style="background: #1f7cd7"
                    @click="onHandleSave"
                  >提交</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    plain
                    @click="onReset"
                  >重置</el-button>
                </div>
                <div class="abNormal">
                  <Table
                    :table-name="thirdLevel"
                    :table-comment="tableComment"
                    :tab-head-list="tabHeadList"
                    :tab-list="tabList"
                    :total="total"
                    :form-list="formList"
                    :data-type="firstLevel"
                    :force-code="forceCode"
                    :category-id="firstLevel"
                    :equipment-code="equipmentCode"
                    :is-tab-click="tabclick"
                    :current="current"
                    @isTabClick="isTabClick"
                    @isCurrent="isCurrent"
                    @onHandleEdit="onHandleEdit"
                    @handleSelectionChange="handleSelectionChange"
                    @deleteOnLineTableList="deleteOnLineTableList"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container'
import * as API from '@/api/index'
import FormGenerate from './components/FormGenerate.vue'
import Form from './components/index.vue'
import FormPageZBZJXN from './components/pageZBZJXN.vue'
import Table from './Table.vue'
const initDataTable = {
  list: [],
  total: 0,
  columns: []
}
export default {
  components: { Container, Table, Form, FormGenerate, FormPageZBZJXN },
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 9) {
        return value.slice(0, 9) + '...'
      }
      return value
    }
  },
  data() {
    return {
      current: false,
      showLeftTree: true, // 是否显示左侧树
      isBdTree: true, // 是否显示部队树
      isZbTree: false, // 是否显示装备树
      bdCheckedList: [],
      zbCheckedList: [],
      firstLevel: '',
      secondLevel: '',
      thirdLevel: '',
      operationType: 'add',
      tabHeadList: [],
      tabList: [],
      tabsList: [],
      formList: [],
      tabclick: false,
      forceCode: '',
      equipmentCode: '',
      tableData: Object.assign({}, initDataTable),
      tableComment: undefined,
      filterText: '',
      subTabsList: [],
      onLineDataList: [],
      categoryName: '',
      defaultProps: {
        label: 'label',
        value: 'code',
        id: 'id'
      },
      total: 0,
      loading: false,
      loadingFormList: false,
      formValues: {}
    }
  },
  watch: {
    // filterText(val) {
    //  this.$refs.tree.filter(val)
    // }
  },
  created() {
    this.getDataTypes()
  },
  mounted() {
    this.setLeftResize()
  },
  methods: {
    // 左侧可拖拽
    setLeftResize() {
      const element = document.querySelector('.left-section')
      console.log('element:', element)
      let resize = element.querySelector('.resize')
      if (!resize) {
        element.insertAdjacentHTML('afterbegin', '<div class="resize" title="收缩侧边栏"></div>')
        resize = element.querySelector('.resize')
      }
      resize.style.right = '0'
      resize.addEventListener('mousedown', function(e) {
        const startX = e.pageX
        const width = element.offsetWidth
        resize.classList.add('active')
        document.addEventListener('mousemove', move)
        let timer = null
        function move(e) {
          const moveX = e.pageX - startX
          clearTimeout(timer)
          timer = setTimeout(() => {
            element.style.width = (width + moveX) + 'px'
          }, 5)
        }
        document.addEventListener('mouseup', function() {
          document.removeEventListener('mousemove', move)
          resize.classList.remove('active')
        }, { once: true })
      })
    },
    filterNode(value, data) {
    //  //console.log(value, data)
    //  if (!value) return true;
    //  return data.label.indexOf(value) !== -1;
    },
    isTabClick() {
      this.tabclick = true
    },
    // 获取第一层tab数据
    getDataTypes() {
      API.getTreeDataType().then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          this.tabsList = data
          if (this.tabsList && this.tabsList.length > 0) {
            this.firstLevel = this.tabsList[0].categoryId
            console.log('log', this.firstLevel)
            this.changeTabList(true)
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取第二层tab
    changeTabList(value) {
      if (typeof (value.name) === 'string') {
        this.firstLevel = value.name
        console.log('log1', this.firstLevel)
      }
      this.categoryName = this.tabsList.find(
        (e) => e.categoryId == this.firstLevel
      ).categoryName
      const props = {
        categoryId: this.firstLevel
      }
      API.getTreeDataType(props).then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          this.subTabsList = data
          if (this.subTabsList && this.subTabsList.length > 0) {
            this.secondLevel = this.subTabsList[0].categoryId
            this.changeNormalTab(this.secondLevel)
          }
        } else {
          this.$message.error(msg)
        }
      })
      // 显示部队树
      if (this.firstLevel === '93159039c91111eba6bf70b5e84fe1ac') {
        this.showLeftTree = true
        this.isZbTree = false
        this.isBdTree = true
      } else if (this.firstLevel === '9315b8d0c91111eba6bf70b5e84fe1ac') {
        // 显示装备树
        this.showLeftTree = true
        this.isBdTree = false
        this.isZbTree = true
      } else {
        // 隐藏树
        this.showLeftTree = false
      }
    },
    // 加载部队树
    loadBdTreeNode(node, resolve) {
      const params = {}
      params.forceSequence = node.data ? node.data.id : ''
      API.getForceTreeList(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          if (node.level === 0) {
            if (data && data.length > 0) {
              this.forceCode = data[0].code
              // 默认部队选中节点
              this.bdCheckedList = [data[0].code]
              this.showLeftTree = true
            } else {
              this.showLeftTree = false
            }
          }
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 加载装备树
    loadZbTreeNode(node, resolve) {
      const params = {}
      params.equipmentId = node.data ? node.data.id : ''
      API.getEquipmentTreeList(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          if (node.level === 0) {
            if (data && data.length > 0) {
              this.equipmentCode = data[0].code
              // 默认装备树选中节点
              this.zbCheckedList = [data[0].code]
              this.showLeftTree = true
            } else {
              this.showLeftTree = false
            }
          }
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 点击部队树
    onHandleClickBdTreeNode(data) {
      this.forceCode = data.code
      // console.log(this.forceCode)
      this.changeOnLineDataTabs()
      this.formValues = {
        BDNM_KEY: this.forceCode
      }
      sessionStorage.setItem('BDNM_KEY', this.forceCode)
    },
    // 点击装备树
    onHandleClickZbTreeNode(data) {
      this.equipmentCode = data.code
      this.changeOnLineDataTabs()
      this.formValues = {}
    },
    // 获取第三层tab
    changeNormalTab(secondLevel) {
      const params = {
        tableCategory: this.secondLevel
      }

      API.getCateGoryInfo(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.onLineDataList = data
          if (this.onLineDataList && this.onLineDataList.length > 0) {
            this.thirdLevel = this.onLineDataList[0].tableName
            sessionStorage.setItem('thirdLevel', this.thirdLevel)
            this.changeOnLineDataTabs()
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    isCurrent() {
      this.current = false
    },
    // 获取表单和表格数据
    changeOnLineDataTabs() {
      sessionStorage.setItem('thirdLevel', this.thirdLevel)
      // console.log('第三层')
      this.current = true
      this.tabclick = false
      this.operationType = 'add'
      if (this.thirdLevel !== 'ZZBZ_D_ZB_ZBZJXN' && this.thirdLevel !== 'ZZBZ_D_HJJT_ZBZJXN') {
        // 获取表单列表
        this.getFormList()
      }

      // 获取表格数据
      if (this.thirdLevel !== 'ZZLL_GJGWRY' && this.thirdLevel !== 'ZZBZ_D_ZB_ZBZJXN' && this.thirdLevel !== 'ZZBZ_D_HJJT_ZBZJXN') {
        this.getTableList()
      }
      // 清空表单数据
      this.formValues = {}
    },
    // 获取表单数据
    getFormList() {
      this.loadingFormList = true
      const params = {
        tableName: this.thirdLevel,
        dataType: this.firstLevel,
        categoryId: this.secondLevel
      }
      API.getFromList(params).then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          this.formList = JSON.parse(JSON.stringify(data))
          this.tabHeadList = data
        } else {
          this.$message.error(msg)
        }
        this.loadingFormList = false
      })
    },
    // 获取表格数据
    getTableList() {
      this.tabList = []
      const params = {
        dataType: this.firstLevel,
        forceCode: this.forceCode,
        categoryId: this.secondLevel,
        tableName: this.thirdLevel,
        equipmentCode: this.equipmentCode,
        pageNum: 1,
        pageSize: 10
      }
      API.getOnLineTableList(params).then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          this.tabList = data.list
          this.total = data.total
          this.$store.dispatch('setOCTableData', this.tableData)
          if (data.list.length > 0) {
            this.formValues = data.list[0]
            if (data.list[0].BDNM_KEY) {
              sessionStorage.setItem('BDNM_KEY', data.list[0].BDNM_KEY)
            }

            // console.log(this.formValues)
            if (sessionStorage.getItem('thirdLevel')) {
              this.thirdLevel = sessionStorage.getItem('thirdLevel')
            }
          } else {
            this.onReset()
            this.formValues = Object.assign(this.formValues, {
              BDNM_KEY: sessionStorage.getItem('BDNM_KEY')
            })
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 编辑表格
    onHandleEdit(row) {
      this.operationType = 'edit'
      this.loading = true
      const params = {
        dataType: this.firstLevel,
        forceCode: this.forceCode,
        equipmentCode: this.equipmentCode,
        categoryId: this.secondLevel,
        tableName: this.thirdLevel,
        data: row.UNIQUE
      }
      API.getOnLineDetail(params).then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          this.formValues = data
        } else {
          this.$message.error(msg)
        }
        this.loading = false
      })
    },
    // 战备工程表格选择导出
    handleSelectionChange(row) {
    },
    // 删除表格数据
    deleteOnLineTableList() {
      this.getTableList()
    },
    // 重置
    onReset() {
      if (this.$refs.tableForm) {
        this.$refs.tableForm.ResetFormData()
      }

      this.operationType = 'add'
    },
    // 提交表单
    onHandleSave() {
      this.$refs.tableForm.isValidate().then((valid) => {
        if (valid) {
          const formData = this.$refs.tableForm.getFormData()
          const saveParams = {
            data: formData,
            tableName: this.thirdLevel,
            forceCode: this.forceCode,
            equipmentCode: this.equipmentCode,
            dataType: this.firstLevel,
            categoryId: this.secondLevel
          }
          if (this.operationType === 'add') {
            API.saveOnlineData(saveParams).then((res) => {
              const { code, msg } = res

              if (code === 200) {
                this.$message.success('数据采集成功')
                this.getTableList()
                this.current = true
              } else {
                this.$message.error(msg)
              }
            })
          } else if (this.operationType === 'edit') {
            console.log(saveParams)
            API.editOnLineTableList(saveParams).then((res) => {
              const { code, msg } = res

              if (code === 200) {
                this.$message.success('数据编辑成功')
                this.current = true
                this.getTableList()
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
/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 17px #ffffff;
  background-color: #ccc;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: #fff;
  background-image: -webkit-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.74) 0%,
    rgba(255, 255, 255, 0.74) 25%,
    transparent 100%,
    rgba(255, 255, 255, 0.74) 75%,
    transparent
  );
}
::v-deep .el-tabs__item:hover {
  background-color: #1f7cd7;
  color: white;
}
::v-deep .el-tabs__item.is-active {
  background-color: #1f7cd7;
  color: white;
}
option[checked="checked"] {
  background-color: #1f7cd7;
  color: white;
}
.container-main {
  height: 100%;
  width: 100%;
  background: #ffffff;
  .container-main-tabsSection {
    cursor: pointer;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 10px 2px 10px;
    .elTabsPane {
      height: 10px !important;
    }
    // >>> .el-tabs__item{
    //   height: -1px !important;
    // }
  }
  .container-content {
    height: 40%;
    overflow-y: auto;
    position: relative;
    padding: 0 20px;
  }
  .container-btns {
    text-align: right;
    padding-right: 30px;
  }

  .container-section {
    height: calc(100% - 50px);
    width: 100%;
    display: flex;
    .left-section {
      flex-shrink: 0;
      position: relative;
      width: 200px;
      overflow-x: auto;
      height: 100%;
      // overflow-y: auto;
      background: #ffffff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
      padding: 0 10px;
      border-radius: 5px;
      margin: -10px 10px 10px 10px;
      // .left-tree {
      .search-section {
        margin: 4% 5% 2% 0;
        width: 100%;
        align-items: center;
      }
      .treebox {
        overflow: auto;
        width: 521px;
        height: calc(100% - 60px);
      }
      // }
    }
    .right-section {
      flex: 1;
      // width: calc(100% - 230px);
      overflow-x: auto;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
      border-radius: 5px;
      margin: -10px 10px 10px 0px;
      .tabs-section {
        cursor: pointer;
        width: 100%;

        display: flex;
        flex-direction: column;
      }
      .table-section {
        width: 100%;
        height: calc(100% - 50px);
        .form-section {
          // height: calc(100% - 300px);
          height: 100%;
          padding: 10px;
        }
        .onLineDataTabs {
          margin-left: 10px;
          height: 40px;
        }
        .child-tab__container {
          height: calc(100% - 40px);
          overflow-y: auto;
          &-all {
            height: 100%;
          }
          .table-section {
            height: 300px;
          }
        }
        .abNormal {
          width: 100%;
          height: calc(60% - 52px);
          border-top: 1px solid #e9eaef;
          margin-top: 20px;
        }
      }
    }
    .full-show {
      width: calc(100% - 20px);
      height: calc(100% - 0px);
      margin-left: 10px;
    }
  }
  ::v-deep .el-tree-node__content:hover,
  ::v-deep
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #1f7cd7 !important;
  }
}
</style>
<style>
/*拖拽区div样式*/
.resize {
  cursor: e-resize;
  position: absolute;
  top: 0;
  /* left: 0; */
  width: 5px;
  height: 100%;
  z-index: 999;
  font-size: 32px;
  color: white;
  user-select: none;
}

.resize.active {
  background-color: #0090f1;
}

.resize:hover {
  background-color: #0090f1;
}
</style>
