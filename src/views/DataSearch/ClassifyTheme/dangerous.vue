<template>
  <div class="dangerous-table">
    <div class="dangerous-cascader">
      <el-cascader
        v-model="cascaderData"
        :options="optionsData"
        :props="optionProps"
        placeholder="请选择地区"
        style="margin-bottom:10px;"
        clearable
        filterable
        @change="changeCascader"
      />
    </div>

    <classTable
      :table-data="tableData"
      :topic-table="topicTable"
      :props-dangerous="propsDangerous"
    />
    <div class="button-con" style="margin-top: 10px">
      <el-button class="elbutton" style="position: relative" @click="daochu">
        <img
          style="width: 20px; height: 20px; position: absolute; top: 20%"
          :src="require(`@/icons/newImages/daochu.png`)"
          class="img-class"
          alt=""
        />
        <span style="margin-left: 32px">导出</span>
      </el-button>
    </div>
    <div class="pager-section">
      <el-pagination
        :current-page="pager.currentPage"
        :page-sizes="pager.pageSizes"
        :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.total"
        @size-change="
          (val) => {
            handleSizeChange(val);
          }
        "
        @current-change="
          (val) => {
            handleCurrentChange(val);
          }
        "
      />
    </div>
    <el-dialog
      custom-class="qiefen-dialog-class"
      title="数据导出"
      :visible.sync="dataExportDialogVisible"
      width="30%"
    >
      <span>模板类型：</span>
      <el-radio
        v-model="exportType"
        label="EXCEL"
        style="margin-right: 14px"
        @change="radio"
      >文档</el-radio>
      <el-radio
        v-model="exportType"
        label="DMP"
        @change="radio"
      >数据包</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button
          style="
            width: 57px;
            text-align: center;
            background: #1f7cd7;
            color: rgba(255, 255, 255);
          "
          @click="getDeploymentTable"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogguolv" width="30%">
      <div v-if="dialogguolv">
        <FormGenerate
          ref="tableForm"
          :tab="thirdLevel"
          :form-list="formListZB"
          :form-values="formValues"
          :force-code="forceCode"
          :equipment-code="equipmentCode"
          :is-edit="isEdit"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogguolv = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import classTable from './classTable'
import * as APIclass from '@/api/classification'
import FormGenerate from '@/views/DataCollection/Online/components/FormGenerate'
import bus from '@/utils/bus'
export default {
  name: 'Dangerous',
  components: {
    classTable,
    FormGenerate
  },
  props: {
    propsDangerous: {
      type: String,
      default: ''
    },
    citysData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      formListZB: [],
      thirdLevel: '',
      formValues: {},
      dialogguolv: false,
      forceCode: '',
      equipmentCode: '',
      isEdit: false,
      isIndexCome: '',
      tableData: [],
      cascaderData: [],
      dataExportDialogVisible: false,
      type: '',
      exportType: '',
      optionProps: {
        value: 'field',
        label: 'label',
        children: 'childList',
        checkStrictly: true
      },
      optionsData: [],
      topicTable: [],
      formTopicTableData: '',
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10, 15, 20, 30]
      },
      cityField: ''
    }
  },
  watch: {
    propsDangerous(val) {
      this.cascaderData = []
      this.formTopicTableData = val
      this.getTopicTable(val)
      this.getList({
        areaCode: '',
        topicTable: val,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage
      })
    }
  },
  mounted() {
    const that = this
    this.formTopicTableData = this.propsDangerous
    this.getTopicTable(this.formTopicTableData)
    this.getList({
      areaCode: '',
      topicTable: this.formTopicTableData,
      pageSize: this.pager.pageSize,
      pageNum: this.pager.currentPage
    })
    this.optionsData = this.getTreeData(this.citysData)
    bus.$on('searchStructureBus', (e) => {
      console.log(e)
      this.isIndexCome = e
      const params = { topicTable: this.formTopicTableData }
      that.searchStructure(params)
    })
  },
  methods: {
    onSubmit() {
      if (this.$refs.tableForm) {
        const formData = this.$refs.tableForm.getFormData()
        this.$refs.tableForm.isValidate().then((valid) => {
          if (valid) {
            console.log(formData)
            console.log(this.formListZB)
            this.dialogguolv = false
            const data = {
              areaCode: '',
              topicTable: this.formTopicTableData,
              pageSize: this.pager.pageSize,
              pageNum: this.pager.currentPage,
              conditions: [
                {
                  columnValue: formData[this.isIndexCome],
                  columnName: this.isIndexCome,
                  domType: this.formListZB[0].domType
                }
              ]
            }
            this.getList(data)
          }
        })
      }
    },
    searchStructure(params) {
      APIclass.searchStructure(params).then((res) => {
        console.log(res)

        this.formListZB = []
        this.formListZB.push(
          res.data.find((e) => e.columnName == this.isIndexCome)
        )
        this.dialogguolv = true
      })
    },
    // 省市区选择
    changeCascader(val) {
      this.cityField = val[val.length - 1]
      this.getList({
        areaCode: val[val.length - 1] || '',
        topicTable: this.formTopicTableData,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage
      })
    },
    // 一页显示多少个
    handleSizeChange(val) {
      this.pager.pageSize = val
      //if(this.cityField !== undefined){
      //  this.getList({
      //    areaCode: this.cityField,
      //    topicTable: this.formTopicTableData,
      //    pageSize: this.pager.pageSize,
      //    pageNum: this.pager.currentPage
      //  })
      //}else{
      //  this.getList({
      //    areaCode: '',
      //    topicTable: this.formTopicTableData,
      //    pageSize: this.pager.pageSize,
      //    pageNum: this.pager.currentPage
      //  })
      //}
      this.getList({
        areaCode: '',
        topicTable: this.formTopicTableData,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage
      })
    },
    // 第几页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      //if(this.cityField !== undefined){
      //  this.getList({
      //    areaCode: this.cityField,
      //    topicTable: this.formTopicTableData,
      //    pageSize: this.pager.pageSize,
      //    pageNum: this.pager.currentPage
      //  })
      //}else{
      //  this.getList({
      //    areaCode: '',
      //    topicTable: this.formTopicTableData,
      //    pageSize: this.pager.pageSize,
      //    pageNum: this.pager.currentPage
      //  })
      //}
      this.getList({
        areaCode: '',
        topicTable: this.formTopicTableData,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage
      })
    },
    // 获取表头
    getTopicTable(data) {
      APIclass.getTopicTable(data).then((res) => {
        this.topicTable = []
        Object.keys(res.data).forEach((key) => {
          this.topicTable.push({
            key: key,
            name: res.data[key]
          })
        })
      })
    },
    // 获取表数据
    getList(data) {
      APIclass.getList(data).then((res) => {
        this.pager.total = res.data.total
        this.tableData = res.data.list
      })
    },
    // 处理城市数据
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].childList && data[i].childList.length < 1) {
          data[i].childList = undefined
        } else {
          this.getTreeData(data[i].childList)
        }
      }
      return data
    },
    daochu(type) {
      // console.log(type, 'danger')
      this.dataExportDialogVisible = true
    },
    radio(value) {
      console.log(value)

      if (value === 'EXCEL') {
        this.type = '1'
      } else {
        this.type = '2'
      }
    },
    getDeploymentTable() {
      if (this.type === '') {
        this.$message.error('请选择导出类型')
        return false
      }
      console.log(this.type)
      const params = {
        areaCode: this.cityField,
        topicTable: this.formTopicTableData,
        topicId: '',
        exportType: this.type
      }
      APIclass.exportTopic(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          window.open(data)
          this.$message({
            type: 'success',
            message: '导出成功!'
          })
          this.dataExportDialogVisible = false
          this.exportType = ''
          this.type = ''
        } else {
          this.$message.error(msg)
        }
      })
    }
    // daochu(type) {
    //   const params = {
    //     areaCode: this.cityField,
    //     topicTable: this.formTopicTableData,
    //     topicId: ''
    //   }
    //   APIclass.exportTopic(params).then((res) => {
    //     const { code, data, msg } = res
    //     if (String(code) === '200') {
    //       window.open(data)
    //       this.$message({
    //         type: 'success',
    //         message: '导出成功!'
    //       })
    //     } else {
    //       this.$message.error(msg)
    //     }
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
>>> .qiefen-dialog-class {
  margin-top: 22vh !important;
}
.dangerous-table {
  background: #fff;
  margin-top: 20px;
  padding: 10px;
  .dangerous-cascader {
    width: 190px;
  }
}
.pager-section {
  margin-top: 30px;
  text-align: right;
  margin-right: 20px;
}
</style>
