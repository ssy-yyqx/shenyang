<template>
  <div class="content-section">
    <div class="form-search">
      <el-form label-width="80px" class="search-border">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工程类别" style="margin-bottom:0;">
              <el-checkbox-group
                v-model="formCombatData.GCFLNM"
              >
                <el-checkbox
                  v-for="(item, index) in combatData.GCFLNM"
                  :key="index"
                  :label="item.GCFLNM"
                  name="type"
                >{{ item.MC }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="保护区" style="margin-bottom:0;">
              <el-checkbox-group
                v-model="formCombatData.BHQNM"
              >
                <el-checkbox
                  v-for="(item, index) in combatData.BHQNM"
                  :key="index"
                  :label="item.BHQNM"
                  name="type"
                >{{ item.MC }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="display:flex;">
            <el-form-item label="防卫类别" style="margin-bottom:0;">
              <el-checkbox-group
                v-model="formCombatData.FWLBNM"
              >
                <el-checkbox
                  v-for="(item, index) in combatData.FWLBNM"
                  :key="index"
                  :label="item.FWLBNM"
                  name="type"
                >{{ item.MC }}</el-checkbox>
              </el-checkbox-group>

            </el-form-item>

            <el-radio-group style="margin:10px 0 0 100px;" v-model="isAndOrRadioGroup" @change="isAndOrRadioGroupChange">
              <el-radio label="0">与</el-radio>
              <el-radio label="1">或</el-radio>
              <el-radio label="2">非</el-radio>
            </el-radio-group>
            <el-button type="primary" style="margin-left: 400px;margin-bottom: 10px;width: 70px;height: 35px;" @click="onHandleSearch">查询</el-button>
            <el-button type="primary" style="margin-bottom: 10px;width: 70px;height: 35px;" @click="onReset">重置</el-button>
            <el-button type="primary" style="width: 90px;height: 35px;" @click="exportDmp">导出数据包</el-button>
            <el-button
              class="elbutton"
              type="primary"
              style="position: relative;height:36px;"
              @click="onHandleExport"
            >导出文档
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="search-data">
      <div class="label">查询结果：</div>
      <div class="table-result">
        <el-table :data="tableCombatData.tableData" border stripe :header-cell-style="headClass" style="width: 100%">
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableCombatData.tableFiled"
            :key="index"
            :prop="item.labelCode"
            :label="item.labelName"
            sortable
            width="180"
          />
        </el-table>
      </div>
      <div class="pager-section">
        <el-pagination
          :current-page="pager.currentPage"
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
</template>

<script>
import * as API from '@/api/DataReorganize'
import * as DataCollectionAPI from '@/api/dataCollection'
export default {
  name: 'Preparedness',
  data() {
    return {
      isAndOrRadioGroup: '0',
      formCombatData: {
        FWLBNM: [],
        BHQNM: [],
        GCFLNM: [],
        isAndOr:'0'
      },
      combatData: {},
      tableCombatData: {
        tableData: [],
        tableFiled: []
      },
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      }
    }
  },
  created() {
    this.getGCParams()
    this.getTableData(this.formCombatData)
  },
  methods: {
    // 导出DMP
    exportDmp(){
      DataCollectionAPI.exportSearchDataDmp({tableName:'ZBGC_ZBGC'}).then(res=>{
        if(res.code===200){
          window.open(res.msg)
        }
      })
    },
    isAndOrRadioGroupChange(val){
      this.isAndOrRadioGroup = val
      this.formCombatData.isAndOr = val
    },
    headClass() {
      return 'background:rgba(31 127 216);color:#fff'
    },
    // 搜索条件数据获取
    getGCParams() {
      API.getGCParams().then((res) => {
        this.combatData = res.data
      })
    },
    // 搜索接口调用
    getTableData(data) {
      API.getData(data, this.pager, 'GC').then((res) => {
        this.tableCombatData = res.data
        this.pager.total = res.data.total
      })
    },
    // 一页显示多少个
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getTableData(this.formCombatData)
    },
    // 第几页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getTableData(this.formCombatData)
    },
    // 搜索数据
    onHandleSearch() {
      this.pager.pageSize=10
      this.pager.currentPage = 1
      this.getTableData(this.formCombatData)
    },
    // 重置
    onReset() {
      this.formCombatData = {
        FWLBNM: [],
        BHQNM: [],
        GCFLNM: []
      }
    },
    // 导出
    onHandleExport() {
      API.getExportSearchData(this.formCombatData, 'GC').then(res => {
        const { code, msg } = res
        if (String(code) === '200') {
          window.open(msg)
        } else {
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content-section {
  background: #fff;
  padding-bottom: 20px;

  .form-search {
    // border-bottom: 1px solid #e6e6e6;
    margin: 20px;
    .search-border {
      border: 1px solid #e6e6e6;
      padding-top: 20px;
      margin-bottom: 20px;
    }
  }
  .search-data {
    margin: 0px 20px;
    .label{
      font-size: 14px;
      padding-bottom: 10px;
    }
    .table-result {
      border: 1px solid #e6e6e6;
      padding-bottom: 2px;
      .table-row {
        font-size: 14px;
        color: #555555;
        .table-row-li {
          margin-bottom: 20px;
          .table-description {
            background: #e6e6e6;
            padding: 4px 6px;
          }
        }
      }
    }
    .pager-section {
      margin-top: 20px;
      text-align: right;
    }
    .tag-title {
      font-size: 14px;
      color: #555555;
    }
    .tag-data {
      margin-right: 10px;
      border-color: #e6e6e6;
      color: #555555;
    }
  }
}
</style>
