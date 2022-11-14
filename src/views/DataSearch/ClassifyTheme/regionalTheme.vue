<template>
  <div class="city-table">
    <!-- 地域主题 -->
    <el-tabs v-model="activeTableName" type="border-card" @tab-click="tabClick">
      <el-tab-pane label="部队信息" name="regionalTopic_BD">
        <classTable
          :table-data="forceInformation"
          :topic-table="topicTable"
          :show-row-click="false"
        />
        <!-- 导出 -->
        <div class="button-con" style="margin-top: 10px">
          <el-button
            class="elbutton"
            style="position: relative"
            @click="daochu"
          >
            <img
              style="width: 20px; height: 20px; position: absolute; top: 20%"
              :src="require(`@/icons/newImages/daochu.png`)"
              class="img-class"
              alt=""
            >
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
                handleSizeChange(val, 'regionalTopic_BD');
              }
            "
            @current-change="
              (val) => {
                handleCurrentChange(val, 'regionalTopic_BD');
              }
            "
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="战备工程信息" name="regionalTopic_ZBGC">
        <classTable
          :table-data="engineering"
          :topic-table="topicTable"
          :show-row-click="false"
        />
        <div class="button-con" style="margin-top: 10px">
          <el-button
            class="elbutton"
            style="position: relative"
            @click="daochu"
          >
            <img
              style="width: 20px; height: 20px; position: absolute; top: 20%"
              :src="require(`@/icons/newImages/daochu.png`)"
              class="img-class"
              alt=""
            >
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
                handleSizeChange(val, 'regionalTopic_ZBGC');
              }
            "
            @current-change="
              (val) => {
                handleCurrentChange(val, 'regionalTopic_ZBGC');
              }
            "
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="后勤保障信息" name="regionalTopic_HQBZ_SHSH">
        <classTable
          :table-data="logistical"
          :topic-table="topicTable"
          :show-row-click="false"
        />
        <div class="button-con" style="margin-top: 10px">
          <el-button
            class="elbutton"
            style="position: relative"
            @click="daochu"
          >
            <img
              style="width: 20px; height: 20px; position: absolute; top: 20%"
              :src="require(`@/icons/newImages/daochu.png`)"
              class="img-class"
              alt=""
            >
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
                handleSizeChange(val, 'regionalTopic_HQBZ_SHSH');
              }
            "
            @current-change="
              (val) => {
                handleCurrentChange(val, 'regionalTopic_HQBZ_SHSH');
              }
            "
          />
        </div>
      </el-tab-pane>
    </el-tabs>
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
  name: 'RegionalTheme',
  components: {
    classTable,
    FormGenerate
  },
  props: {
    cityField: {
      type: String,
      default: ''
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
      activeTableName: 'regionalTopic_BD',
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10, 15, 20, 30]
      },
      dataExportDialogVisible: false,
      exportType: '',
      engineering: [],
      topicTable: [],
      forceInformation: [],
      type: '',
      logistical: []
    }
  },
  computed: {},

  // watch: {},
  watch: {
    // 设置城市
    cityField(val) {
      this.getTopicTable('regionalTopic_BD')
      this.getList(
        {
          areaCode: val,
          topicTable: 'regionalTopic_BD',
          pageSize: this.pager.pageSize,
          pageNum: this.pager.currentPage
        },
        'regionalTopic_BD'
      )
      this.activeTableName = 'regionalTopic_BD'
    }
  },
  mounted() {
    this.getTopicTable('regionalTopic_BD')
    this.getList(
      {
        areaCode: this.cityField,
        topicTable: 'regionalTopic_BD',
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage
      },
      'regionalTopic_BD'
    )
    const that = this
    bus.$on('searchStructureBus', (e) => {
      console.log(e)
      that.isIndexCome = e
      const params = { topicTable: this.activeTableName }
      console.log(params)
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
              topicTable: this.activeTableName,
              pageSize: this.pager.pageSize,
              pageNum: this.pager.currentPage
            }

            this.getList(Object.assign(data, formData), this.activeTableName)
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
    // 表格tab切换
    tabClick(tab, event) {
      this.pager = {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10, 15, 20, 30]
      }
      this.getTopicTable(tab.name)
      this.getList(
        {
          areaCode: this.cityField,
          topicTable: tab.name,
          pageSize: this.pager.pageSize,
          pageNum: this.pager.currentPage
        },
        tab.name
      )
    },
    // 一页显示多少个
    handleSizeChange(val, type) {
      this.pager.pageSize = val
      if (type == 'regionalTopic_BD') {
        this.getList(
          {
            areaCode: this.cityField,
            topicTable: 'regionalTopic_BD',
            pageSize: this.pager.pageSize,
            pageNum: this.pager.currentPage
          },
          'regionalTopic_BD'
        )
      }
      if (type == 'regionalTopic_ZBGC') {
        this.getList(
          {
            areaCode: this.cityField,
            topicTable: 'regionalTopic_ZBGC',
            pageSize: this.pager.pageSize,
            pageNum: this.pager.currentPage
          },
          'regionalTopic_ZBGC'
        )
      }
      if (type == 'regionalTopic_HQBZ_SHSH') {
        this.getList(
          {
            areaCode: this.cityField,
            topicTable: 'regionalTopic_HQBZ_SHSH',
            pageSize: this.pager.pageSize,
            pageNum: this.pager.currentPage
          },
          'regionalTopic_HQBZ_SHSH'
        )
      }
    },
    // 第几页
    handleCurrentChange(val, type) {
      this.pager.currentPage = val
      if (type == 'regionalTopic_BD') {
        this.getList(
          {
            areaCode: this.cityField,
            topicTable: 'regionalTopic_BD',
            pageSize: this.pager.pageSize,
            pageNum: this.pager.currentPage
          },
          'regionalTopic_BD'
        )
      }
      if (type == 'regionalTopic_ZBGC') {
        this.getList(
          {
            areaCode: this.cityField,
            topicTable: 'regionalTopic_ZBGC',
            pageSize: this.pager.pageSize,
            pageNum: this.pager.currentPage
          },
          'regionalTopic_ZBGC'
        )
      }
      if (type == 'regionalTopic_HQBZ_SHSH') {
        this.getList(
          {
            areaCode: this.cityField,
            topicTable: 'regionalTopic_HQBZ_SHSH',
            pageSize: this.pager.pageSize,
            pageNum: this.pager.currentPage
          },
          'regionalTopic_HQBZ_SHSH'
        )
      }
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
    getList(data, type) {
      APIclass.getList(data).then((res) => {
        this.pager.total = res.data.total
        if (type == 'regionalTopic_BD') {
          this.forceInformation = res.data.list
        }
        if (type == 'regionalTopic_ZBGC') {
          this.engineering = res.data.list
        }
        if (type == 'regionalTopic_HQBZ_SHSH') {
          this.logistical = res.data.list
        }
      })
    },
    daochu(type) {
      // console.log(type, 'regionalTheme')
      this.dataExportDialogVisible = true
    },
    radio(value) {
      if (value === 'EXCEL') {
        this.type = '1'
      } else {
        this.type = '2'
      }
    },
    getDeploymentTable() {
      if (this.type === '') {
        return this.$message.error('请选择导出类型')
      }
      const params = {
        areaCode: this.cityField,
        topicTable: 'regionalTopic_ZBGC',
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
  }
}
</script>

<style lang="scss" scoped>
>>> .qiefen-dialog-class {
  margin-top: 22vh !important;
}
.city-table {
  margin-top: 20px;
}
.pager-section {
  margin-top: 20px;
  text-align: right;
  margin-right: 20px;
}
</style>
