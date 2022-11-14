<template>
  <div class="content-section">
    <div class="form-search">
      <el-form label-width="80px" class="search-border" :inline="true">
        <el-row :gutter="0">
          <el-col :span="5">
            <el-form-item label="部队番号">

              <!-- <el-select v-model="baseTableName" placeholder="请选择">
                <el-tree
                  ref="treeLeft"
                  class="filter-tree"
                  node-key="id"
                  :data="treeData"
                  :props="treeProps"
                  show-checkbox
                  style="overflow-x:auto;"
                />
              </el-select> -->

              <el-cascader
                ref="bdnmCascader"
                v-model="fightFormData.BDNM"
                :options="bdnmList"
                :props="props.BDNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择部队番号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="地名">
              <el-cascader
                ref="dmnmCascader"
                v-model="fightFormData.DMNM"
                :options="dmnmList"
                :props="props.DMNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择地名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="装备分类">
              <el-cascader
                v-model="fightFormData.ZBFLNM"
                :props="props.ZBFLNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择装备分类"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-radio-group v-model="isAndOrRadioGroup" style="margin-top:10px;text-align:center;" @change="isAndOrRadioGroupChange">
              <el-radio label="0">与</el-radio>
              <el-radio label="1">或</el-radio>
              <el-radio label="2">非</el-radio>
            </el-radio-group>
          </el-col>
          <el-form-item>
            <el-button
              type="primary"
              size="medium"
              style="height: 35px"
              @click="onHandleSearch"
            >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="medium"
              style="height: 35px"
              @click="onReset"
            >重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" style="height: 35px" @click="exportDmp">导出数据包</el-button>
          </el-form-item>
          <!-- 导出 -->
          <el-form-item>
            <el-button
              class="elbutton"
              type="primary"
              size="medium"
              style="position: relative; height: 36px"
              @click="onHandleExport"
            >导出文档
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="search-data">
      <div class="label">查询结果：</div>
      <div class="table-result">
        <el-table :data="tableFightData.tableData" border stripe :header-cell-style="headClass" style="width: 100%">
          <el-table-column
            v-for="(item, index) in tableFightData.tableFiled"
            :key="index"
            :prop="item.labelCode"
            :label="item.labelName"
            sortable
            show-overflow-tooltip
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
import * as PARAMS from './params'
export default {
  data() {
    return {
      // baseTableName: '', // 选择器的值
      isAndOrRadioGroup: '0',
      fightFormData: {
        BDNM: [],
        DMNM: [],
        ZBFLNM: []
      },
      tableFightData: {},
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      // 下拉框配置
      props: {},
      // selectTypes: ['BDNM', 'DMNM', 'ZBFLNM']
      // selectTypes: ['DMNM', 'ZBFLNM'],
      selectTypes: ['ZBFLNM'],
      // 部队名称列表
      bdnmList: [],
      // 地名列表
      dmnmList: []
    }
  },
  created() {
    // 获取地名列表
    this.getDmnmList()
    this.getBDFHList()
    // 查询表格数据
    this.getTableData()
    // 生成下拉框配置
    this.props.DMNM = {
      value: 'code',
      label: 'label',
      children: 'children',
      multiple: true
    }
    this.props['BDNM'] = {
      value: 'code',
      label: 'label',
      children: 'children',
      multiple: true
    }
    this.selectTypes.forEach(item => {
      this.props[item] = {
        value: 'code',
        label: 'label',
        children: 'children',
        multiple: true,
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          const params = { ...PARAMS[item + '_PARAMS'] }
          params.sequence = node.level === 0 ? '' : node.data.id
          DataCollectionAPI.getSelectOptions(params).then((res) => {
            const { data } = res
            data.forEach((item) => {
              item.value = item.code
              item.leaf = item.isLeaf
            })
            resolve(data)
          })
        }
      }
    })
  },
  methods: {
    // 获取地名列表
    getDmnmList() {
      const params = {
        columnName: 'DMNM',
        equipmentCode: '',
        forceCode: '112618506',
        sequence: '',
        sync: true,
        tableName: 'ZZBZ_S_TY_DM'
      }
      DataCollectionAPI.getSelectOptions(params).then((res) => {
        const { data } = res
        this.dmnmList = data
      })
    },
    getBDFHList() {
      DataCollectionAPI.getSelectOptions({
        columnName: 'BDNM',
        equipmentCode: '0000000000000',
        forceCode: '110000000',
        sequence: '',
        sync: true,
        tableName: 'ZZLL_BD'
      }).then((res) => {
        const { data } = res
        this.bdnmList = data
      })
    },
    // 导出DMP
    exportDmp() {
      DataCollectionAPI.exportSearchDataDmp({ tableName: 'ZZLL_WQZB' }).then(res => {
        if (res.code === 200) {
          window.open(res.msg)
        }
      })
    },
    isAndOrRadioGroupChange(val) {
      this.isAndOrRadioGroup = val
    },
    // 搜索接口调用
    getTableData() {
      const params = this.getSearchParams()
      console.log(params)
      API.getData(params, this.pager, 'ZB').then((res) => {
        this.tableFightData = res.data
        this.pager.total = res.data.total
      })
    },
    // 获取搜索参数
    getSearchParams() {
      const params = {}
      this.selectTypes.forEach(item => {
        params[item] = this.getArrayData(this.fightFormData[item])
      })
      params.isAndOr = this.isAndOrRadioGroup
      params.BDNM = []
      if (this.$refs.bdnmCascader) {
        const nodes = this.$refs.bdnmCascader.getCheckedNodes()
        nodes.forEach(node => {
          params.BDNM.push(node.data.code)
        })
      }
      params.DMNM = []
      if (this.$refs.dmnmCascader) {
        const nodes = this.$refs.dmnmCascader.getCheckedNodes()
        nodes.forEach(node => {
          params.DMNM.push(node.data.code)
        })
      }
      return params
    },
    // 获取二维数组第二层的最后一个数据
    getArrayData(array) {
      const data = []
      array.forEach(item => {
        if (item && item.length > 0) {
          data.push(item[item.length - 1])
        }
      })
      return data
    },
    // 一页显示多少个
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getTableData()
    },
    // 第几页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getTableData()
    },
    // 搜索数据
    onHandleSearch() {
      this.pager.pageSize = 10
      this.pager.currentPage = 1
      console.log(this.pager)
      this.getTableData()
    },
    // 导出
    onReset() {
      this.fightFormData = {
        BDNM: [],
        DMNM: [],
        ZBFLNM: []
      }
    },
    // 导出按钮 getExportSearchData
    onHandleExport() {
      const params = this.getSearchParams()
      API.getExportSearchData(params, 'ZB').then((res) => {
        const { code, msg } = res
        if (String(code) === '200') {
          window.open(msg)
        } else {
          this.$message.error(msg)
        }
      })
    },
    headClass() {
      return 'background:rgba(31 127 216);color:#fff'
    }
  }
}
</script>
<style lang="scss" scoped>
.content-section {
  background: #fff;
  padding-bottom: 20px;
  overflow: auto;
  width: 100%;
  height: calc(100% - 0px);
  .form-search {
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
