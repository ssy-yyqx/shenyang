<template>
  <div class="dataP">
    <el-breadcrumb
      separator="/"
      class="title"
      separator-class="el-icon-arrow-right"
    >
      <!-- <el-breadcrumb-item
        :to="{ path: '/DataPush/productMade' }"
        @click.native="back()"
      >返回</el-breadcrumb-item> -->
      <!-- <el-breadcrumb-item>{{ editMode ? '编辑数据产品' : '新增数据产品' }}</el-breadcrumb-item> -->
    </el-breadcrumb>
    <div class="lookParams">
      <el-form
        ref="lookProductNewParams"
        :model="lookProductNewParams"
        label-width="100px"
        :rules="rules"
      >
        <!-- <el-row> -->
        <el-col :span="24" class="paramsItem">
          <el-form-item label="模板选择:" prop="fixedModelId">
            <el-select
              v-model="lookProductNewParams.fixedModelId"
              placeholder="请选择模板"
              @change="selectChange"
            >
              <el-option
                v-for="(item, index) of fixedModelList"
                :key="index"
                :label="item.modelName"
                :value="item.modelId"
              >
                <span style="float: left;margin-left:15px">{{
                  item.modelName
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="paramsItem">
          <el-form-item label="产品名称:" prop="productName">
            <el-input
              v-model="lookProductNewParams.productName"
              placeholder="请输入产品名称"
            />
          </el-form-item>
        </el-col>

        <!-- v-model="lookProductNewParams.productDescribes[index]" -->
        <el-col v-for="(item,index) in forceTreeData" :key="index" :span="24" class="paramsItem">
          <el-form-item :label="item.sqlParamsName+':'" :prop="item.sqlParamsCode">
            <el-input
              v-model="lookProductNewParams[item.sqlParamsCode]"
              :placeholder="'请输入'+item.sqlParamsName"
              @click.native="forceTreeDataClick(item)"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24" class="paramsItem">
          <el-form-item label="产品描述:" prop="productDescribe">
            <el-input
              v-model="lookProductNewParams.productDescribe"
              placeholder="请输入产品描述"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">

          <el-button style="float:right" type="primary" @click="lookProductNew">预览</el-button>

        </el-col>
      </el-form>
    </div>
    <div v-show="bShowView" id="test" class="result">
      <div class="result-pdf">
        <pdf
          v-for="i in pdf.pageCount"
          :key="i"
          :src="pdf.pdfName"
          :page="i"
          class="prodruct-pdf"
        />
      </div>
      <div class="viewBtn">
        <el-button type="primary" :disabled="saveDisabled" @click="saveView">保存</el-button>
        <el-button type="primary" @click="printView">打印</el-button>
        <el-button type="info" plain @click="cancelView">取消</el-button>
      </div>

    </div>

    <el-dialog
      :title="editMode ? '编辑数据产品' : '新增数据产品'"
      custom-class="qiefen-dialog-classaa"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :modal="false"
      :show-close="true"
    >
      <div style="height:60px">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-select v-model="selectChangeTableValue" placeholder="请选择" @change="selectChangeTable">
              <el-option
                v-for="item in subTleCol"
                :key="item.columnName"
                :label="item.columnComment"
                :value="item.columnName"
              />
            </el-select>
          </el-col>
          <el-col v-if="formListZB.length>0 && isFormGenerate" :span="8">
            <FormGenerate
              ref="tableForm"
              :tab="thirdLevel"
              :form-list="formListZB"
              :form-values="formValues"
              :force-code="forceCode"
              :equipment-code="equipmentCode"
              :is-edit="isEdit"
            />
          </el-col>
          <el-col v-if="formListZB.length>0 && isFormGenerate" :span="2"> <el-button type="primary" @click="onSubmit">确定</el-button></el-col>
          <el-col v-if="formListZB.length>0 && isFormGenerate" :span="2"> <el-button type="primary" @click="onChongzhi">重置</el-button></el-col>

        </el-row>
      </div>

      <el-table
        ref="multipleTable"
        :data="subTableData"
        tooltip-effect="dark"
        style="width: 100%"
        :row-key="getRowKey"
        :header-cell-style="{background:'#1f7cd7',color:'#ffffff'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          width="55"
        />
        <el-table-column
          label="序号"
          type="index"
          :index="indexMethod"
          width="50"
          align="center"
        />
        <el-table-column
          v-for="item in subTleCol"
          :key="item.columnName"
          width="140"
          :label="item.columnComment"
          :prop="item.columnName"
          align="center"
          show-overflow-tooltip
        />
      </el-table>
      <div class="pager-section">
        <el-pagination
          :current-page="pagerDetail.pageNum"
          :page-sizes="pagerDetail.pageSizes"
          :page-size="pagerDetail.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagerDetail.total"
          @size-change="pagerDetailhandleSizeChange"
          @current-change="pagerDetailhandleCurrentChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/index'
import pdf from 'vue-pdf'
import bus from '@/utils/bus'
import FormGenerate from '@/views/DataCollection/Online/components/FormGenerate'
const initData = {
  fixedModelId: '', // 模板选择
  productName: '', // 产品名称
  productDescribe: '', // 产品描述
  productDescribes: '', // 描述
  searchText: [], // 单位选择code
  searchTextName: [] // 单位选择名称
}
export default {
  components: { pdf, FormGenerate },
  props: ['bAddDataProduct', 'editData', 'editMode'],
  data() {
    return {
      saveDisabled:false,
      selectChangeTableValue: '',
      formListZB: [],
      thirdLevel: '',
      formValues: {},

      forceCode: '',
      equipmentCode: '',
      isEdit: false,
      isFormGenerate: false,
      dialogVisible: false,
      tableData: [],
      rules: {
        fixedModelId: [
          { required: true, message: '请选择模板', trigger: ['blur', 'change'] }
        ],
        searchText: [
          { required: true, message: '请选择单位', trigger: ['blur', 'change'] }
        ],
        productName: [
          {
            required: true,
            message: '请输入产品名称',
            trigger: ['blur', 'change']
          }
        ]
      },
      fixedModelList: [], // 模板选择下拉框的数据
      forceTreeData: [], // 单位选择下拉框的数据
      filterText: '', // 单位选择下拉框过滤文本
      defaultProps: {
        children: 'childList',
        label: 'label',
        value: 'field'
      },
      value: '', // options
      defaultChecked: [], // 默认选中的值
      selectArr: [], // 选择栏绑定值
      selectData: [], // 选择栏绑定值
      // 配置的条件
      lookProductNewParams: initData,
      pdf: {
        pageCount: 0,
        pdfName: ''
      },
      bShowView: false, // 是否显示预览结果
      currentViewPath: '', // 当前预览结果的路径view
      currentModelId: '',
      // 分页
      pagerDetail: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      subTableData: [],
      subTleCol: [],
      currentAttribute: '',
      dataSuiYi: []
      // sqlParamsValue: []
    }
  },
  watch: {
    // 单位选择下拉框 过滤单位
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    // 条件变动的时候隐藏预览窗口
    lookProductNewParams: {
      handler() {
        this.bShowView = false
      },
      deep: true
    },
    editData: {
      handler(val, oldval) {
        console.log(val)
        console.log(this.editMode)
        console.log('改变了')
        if (!this.editMode) {
          this.lookProductNewParams = val
        } else {
          if (!this.editData.modelId) {
            console.log('没有值z')
            return false
          }
          this.lookProductNewParams = Object.assign({}, this.editData, { productDescribes: [] })

          this.lookProductNewParams.fixedModelId = this.editData.modelId
          console.log(this.lookProductNewParams)
          this.getTreeLists(this.lookProductNewParams.modelId)
          this.lookProductNewParams[this.editData.productParamsEntities[0].sqlParamsCode] = this.editData.productParamsEntities[0].sqlParamsValue
          this.pdf.pdfName = pdf.createLoadingTask(`/profile/download/${this.editData.pdfName}`)
          console.log(this.editData)
          this.pdf.pdfName.promise
            .then(pdf => {
              this.bShowView = true
              this.pdf.pageCount = pdf.numPages
            })
            .catch(err => {
              this.bShowView = false
              console.error('pdf 加载失败', err)
            })
        }
      },
      deep: true
    }
  },
  created() {
    // 获取模板选择数据
    this.getModelsList()
  },
  mounted() {
    // 如果是编辑，进行数据填充
    if (this.editData !== {} && this.editData.modelId) {
      this.lookProductNewParams = Object.assign({}, this.editData, { productDescribes: [] })

      this.lookProductNewParams.fixedModelId = this.editData.modelId
      console.log(this.lookProductNewParams)
      this.getTreeLists(this.lookProductNewParams.modelId)
      this.lookProductNewParams[this.editData.productParamsEntities[0].sqlParamsCode] = this.editData.productParamsEntities[0].sqlParamsValue
      this.pdf.pdfName = pdf.createLoadingTask(`/profile/download/${this.editData.pdfName}`)
      console.log(this.editData)
      this.pdf.pdfName.promise
        .then(pdf => {
          this.bShowView = true
          this.pdf.pageCount = pdf.numPages
        })
        .catch(err => {
          this.bShowView = false
          console.error('pdf 加载失败', err)
        })
    } else {
      this.lookProductNewParams = {}
    }
  },
  methods: {
    onSubmit() {
      if (this.$refs.tableForm) {
        const formData = this.$refs.tableForm.getFormData()
        this.$refs.tableForm.isValidate().then((valid) => {
          if (valid) {
            console.log(formData)

            this.getSubTableData(this.dataSuiYi, formData)
            // const data = {
            //   areaCode: '',
            //   topicTable: this.formTopicTableData,
            //   pageSize: this.pager.pageSize,
            //   pageNum: this.pager.currentPage,
            //   conditions: [
            //     {
            //       columnValue: formData[this.isIndexCome],
            //       columnName: this.isIndexCome,
            //       domType: this.formListZB[0].domType
            //     }
            //   ]
            // }
            // this.getList(data)
          }
        })
      }
    },
    selectChangeTable() {
      this.isFormGenerate = false
      console.log(this.selectChangeTableValue)
      setTimeout(() => {
        this.formListZB = [this.subTleCol.find((e) => e.columnName === this.selectChangeTableValue)]
        this.isFormGenerate = true
        console.log(this.formListZB)
      }, 300)
    },
    onChongzhi() {
      this.selectChangeTableValue = ''
      this.formListZB = []
      this.isFormGenerate = false
      this.getSubTableData(this.dataSuiYi)
    },
    // index配置   自定义序号
    indexMethod(index) {
      return index + this.pagerDetail.pageSize * (this.pagerDetail.pageNum - 1) + 1
    },
    confirm() {
      this.dialogVisible = false
      const arr = this.multipleSelection.map(i => {
        return i[this.currentAttribute]
      })
      console.log(arr)

      this.$set(this.lookProductNewParams, this.currentAttribute, arr.join(','))
      this.$refs.multipleTable.clearSelection()
    },
    // 表格多选框
    handleSelectionChange(val) {
      // console.log(this.forceTreeData[0])multipleTable
      // 单选
      // if (this.forceTreeData[0].isBatch === '1' && val.length > 1) {
      //   this.$refs.multipleTable.clearSelection()
      //   this.$refs.multipleTable.toggleRowSelection(val.pop())
      // }
      this.multipleSelection = val
    },
    handleClose(done) {
      this.dialogVisible = false
    },
    pagerDetailhandleSizeChange(val) {
      this.pagerDetail.pageSize = val
      this.getSubTableData(this.dataSuiYi)
    },
    pagerDetailhandleCurrentChange(val) {
      this.pagerDetail.pageNum = val
      this.getSubTableData(this.dataSuiYi)
    },
    topicStructure(data) {
      const params = {
        tableName: data.sqlTableName
      }
      API.topicStructure(params).then(res => {
        console.log(res.data)
        this.subTleCol = res.data
      })
    },
    forceTreeDataClick(data) {
      this.dialogVisible = true
      this.saveDisabled = false
      this.currentAttribute = data.sqlParamsCode
      this.dataSuiYi = data
      this.pagerDetail.pageNum = 1
      this.getSubTableData(data)
      this.topicStructure(data)
    },
    getSubTableData(data, formdata = {}) {
      const params = {
        tableName: data.sqlTableName,
        pageNum: this.pagerDetail.pageNum,
        pageSize: this.pagerDetail.pageSize
      }

      API.getThemeDetailData(Object.assign(params, formdata)).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.$nextTick(() => {
            const { tableFiled, tableData, total } = data
            this.subTableData = tableData
            this.pagerDetail.total = total
          })
        } else {
          this.$message.error(msg)
        }
      })
    },
    getRowKey(row) {
      return row.BDXH
    },
    // 返回首页
    back() {
      for (const item in this.forceTreeData) {
        this.lookProductNewParams[this.forceTreeData[item].sqlParamsCode] = ''
      }
      this.lookProductNewParams.fixedModelId = ''
      this.lookProductNewParams.productName = ''
      this.lookProductNewParams.productDescribe = ''
      this.lookProductNewParams.searchText = []
      this.lookProductNewParams.searchTextName = []
      this.$emit('addDataPruduct', false)
    },
    // 获取模板选择的数据
    getModelsList() {
      API.getModelsList().then(res => {
        const { code, rows, msg } = res
        if (String(code) === '200') {
          console.log('00')
          this.fixedModelList = rows
        } else {
          this.$message.error(msg)
        }
      })
    },
    selectChange(value) {
      this.lookProductNewParams.fixedModelId = value
      // this.modelId = value.modelId
      this.getTreeLists(value)
    },
    // 获取单位选择的数据
    getTreeLists(value) {
      const params = {
        modelId: value
      }

      API.getTreeLists(params).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.forceTreeData = data
          for (let i = 0; i < this.forceTreeData.length; i++) {
            this.rules[this.forceTreeData[i].sqlParamsCode] = {
              required: true,
              message: '请输入' + this.forceTreeData[i].sqlParamsName,
              trigger: ['blur', 'change']
            }
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 单位选择搜索
    filterChange(val, data) {
      if (!val) return true
      return data.label.indexOf(val) !== -1
    },
    getCurrentSelectArray() {
      // this.$nextTick(() => {
      // 若节点可被选择，则返回目前被选中的节点所组成的数组 接收两个boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      var arr = this.$refs.tree.getCheckedNodes(false, false)
      this.selectArr = []
      this.selectData = []
      // 赋值
      arr &&
        arr.length &&
        arr.forEach(item => {
          this.selectArr.push(item.label)
          this.selectData.push({
            name: item.label,
            id: item.field
          })
        })
      this.handleCheckChange()
      // });
    },
    changeSelect(val) {
      this.selectData = this.selectData.filter((item, index) => {
        return val.indexOf(item.name) > -1
      })
      var treeCheckedIdList = []
      for (let index = 0; index < this.selectData.length; index++) {
        const element = this.selectData[index]
        treeCheckedIdList.push(element.id)
      }
      this.$refs.tree.setCheckedKeys(treeCheckedIdList)
      this.handleCheckChange()
    },
    // 单位选择发生改变
    handleCheckChange(data, checked, indeterminate) {
      var searchText = this.$refs.tree.getCheckedNodes().map(item => {
        return item.field
      })
      var searchTextName = this.$refs.tree.getCheckedNodes().map(item => {
        return item.label
      })
      this.lookProductNewParams.searchText = searchText.toString()
      this.lookProductNewParams.searchTextName = searchTextName.toString()
    },
    // 预览
    lookProductNew() {
      
      var productParamsEntities = []
      for (const item in this.forceTreeData) {
        console.log(this.forceTreeData)
        console.log(this.lookProductNewParams)

        productParamsEntities.push({
          sqlParamsCode: this.forceTreeData[item].sqlParamsCode,
          sqlParamsValue: this.lookProductNewParams[this.forceTreeData[item].sqlParamsCode]
        })
      }
      this.$refs['lookProductNewParams'].validate(valid => {
        if (valid) {
          var params = {
            productName: this.lookProductNewParams.productName,
            productDescribe: this.lookProductNewParams.productDescribe,
            modelId: this.lookProductNewParams.fixedModelId,
            productParamsEntities: productParamsEntities
          }
          API.lookProductNew(params).then(res => {
            const { code, msg, data } = res
            if (String(code) === '200') {
              this.currentViewPath = data
              this.pdf.pdfName = pdf.createLoadingTask(data)
              this.pdf.pdfName.promise
                .then(pdf => {
                  this.bShowView = true
                  this.pdf.pageCount = pdf.numPages
                })
                .catch(err => {
                  this.bShowView = false
                  console.error('pdf 加载失败', err)
                })
            } else {
              this.bShowView = false
              this.$message.error(msg)
            }
          })
        }
      })
    },
    // 保存预览
    saveView() {
      var productParamsEntitie = []
      for (const item in this.forceTreeData) {
        productParamsEntitie.push({
          sqlParamsCode: this.forceTreeData[item].sqlParamsCode,
          sqlParamsValue: this.lookProductNewParams[this.forceTreeData[item].sqlParamsCode]
        })
      }
      var data = {
        productName: this.lookProductNewParams.productName,
        productDescribe: this.lookProductNewParams.productDescribe,
        modelId: this.lookProductNewParams.fixedModelId,
        productParamsEntities: productParamsEntitie
      }

      // 如果是编辑
      if (this.editMode) {
        const data = {
          productId: this.editData.productId,
          productName: this.lookProductNewParams.productName,
          productDescribe: this.lookProductNewParams.productDescribe,
          modelId: this.lookProductNewParams.fixedModelId,
          productParamsEntities: productParamsEntitie
        }
        API.editProductNew(data).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            this.saveDisabled = true
            this.$emit('addDataPruduct', false)
            bus.$emit('dataGood', true)
          } else {
            this.$message.error(msg)
          }
        })
      } else {
        this.saveDisabled = true
        API.getinsert(data).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            
            //this.dialogVisible = false
            this.$message.success(msg)
            bus.$emit('dataGood', true)
          } else {
            this.$message.error(msg)
          }
        })
      }
    
    },
    // 取消预览
    cancelView() {
      this.bShowView = false
      bus.$emit('closeTchuang', true)
    },
    // 打印
    printView() {
      const url = `${this.currentViewPath}`
      var aTag = document.createElement('a')
      aTag.href = url
      aTag.target = '_blank'
      document.body.appendChild(aTag)
      aTag.click()
      aTag.remove()
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-button--primary{
  background-color: #1f7cd7;
}
>>> .qiefen-dialog-class{
  margin-top: 15vh !important;
}
>>> .qiefen-dialog-classaa{
  margin-top: 10vh !important;
  .el-dialog__header{
    height: 38px;
    //background: none !important;
  }

}
.dataP {
  height: 100%;
  padding: 20px;
  background-color: #fff;
  // overflow-y: scroll;
}
.pager-section {
  width: 100%;
  height: 30px;
  margin: 10px 0;
  text-align: right;
}
.title {
  font-size: 16px;
  color: #867c7c;
  margin-bottom: 50px;
}
// .lookParams {
//   margin-left: 354px;
// }
.paramsItem {
  margin-right: 25px;
}
.result{
  width: 100%;
  height: 74%;
  float: left;
.result-pdf {
  height: 90%;
  width: 800px;
  margin: 0 auto;
  overflow-y: scroll;
  border: 1px #e6dddd solid;
}
}

.viewBtn {
  margin-top: 15px;
  text-align: center;
}
//处理下拉框不显示数据的问题
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
  overflow: auto;
}
.el-select-dropdown__item {
  height: auto;
  overflow: hidden;
  overflow-y: hidden;
  padding: 0;
}
.el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
element.style {
  width: 100%;
  max-width: 221.406px;
}
.el-select-dropdown__list{
  padding: 6px 10px
}
</style>
