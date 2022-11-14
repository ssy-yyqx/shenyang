<template>
  <div class="content-section">
    <div class="form-search">
      <el-form label-width="80px" class="search-border" :inline="true">
        <el-row :gutter="0">
          <el-col :span="20">
            <el-form-item label="选择类别">
              <el-radio-group
                v-model="checkedType"
                @change="handleCheckedChange"
              >
                <el-radio
                  v-for="(item, key, index) of typeData"
                  :key="index"
                  :label="key"
                >
                  {{ item }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="部队番号">
              <el-input v-model="fightFormData.BDFH" style="width: 200px;" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="部队级别">
              <el-cascader
                v-model="fightFormData.BDJBNM"
                :props="props.BDJBNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择级别"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="位置">
              <el-cascader
                ref="dmnmCascader"
                v-model="fightFormData.DMNM"
                :options="dmnmList"
                :props="props.DMNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择位置"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="建制">
              <el-cascader
                ref="demoCascader"
                v-model="fightFormData.JZLBNM"
                :props="props.JZLBNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择建制"
              />
            </el-form-item>
          </el-col>

          <el-radio-group v-model="isAndOrRadioGroup" @change="isAndOrRadioGroupChange">
            <el-radio label="0">与</el-radio>
            <el-radio label="1">或</el-radio>
            <el-radio label="2">非</el-radio>
          </el-radio-group>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="部队类别">
              <el-cascader
                v-model="fightFormData.BDLBNM"
                :props="props.BDLBNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择部队类别"
              />
            </el-form-item>

          </el-col>
          <el-col :span="5">
            <el-form-item label="军种">
              <el-cascader
                v-model="fightFormData.JZNM"
                :props="props.JZNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择军种"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="兵种">
              <el-cascader
                v-model="fightFormData.BZNM"
                :props="props.BZNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择兵种"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4.4">
            <el-form-item label="编成分类">
              <el-cascader
                v-model="fightFormData.BCLBXFNM"
                :props="props.BCLBXFNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择编成分类"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4.1">
            <el-form-item label="编成类别">
              <el-cascader
                v-model="fightFormData.BCLBNM"
                :props="props.BCLBNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择编成类别"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: right;">
            <el-form-item>
              <el-button
                type="primary"
                style="height: 35px;"
                @click="onHandleSearch"
              >查询</el-button>
            </el-form-item>
            <el-form-item><el-button type="primary" style="width:50px;height:35px;" @click="onReset">重置</el-button></el-form-item>
            <el-form-item><el-button type="primary" style="width:80px;height:35px;" @click="exportDmp">导出数据包</el-button></el-form-item>
            <!-- 导出 -->
            <el-form-item>
              <el-button
                class="elbutton"
                type="primary"
                style="width:70px;height:35px;margin-right:0"
                @click="onHandleExport"
              >导出文档
              </el-button>
            </el-form-item>
          </el-col>
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
            show-overflow-tooltip
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
import bus from '@/utils/bus'
import * as DataCollectionAPI from '@/api/dataCollection'
import * as PARAMS from './params'
export default {
  name: 'CombatForces',
  data() {
    return {
      isAndOrRadioGroup: '0',
      checkedType: '0',
      typeData: {
        0: '基本信息',
        3: '关键岗位人员信息'
      },
      tableFightData: {},
      fightFormData: {
        JZLBNM: [],
        BDJBNM: [],
        DMNM: [],
        JZNM: [],
        BZNM: [],
        BCLBNM: [],
        BCLBXFNM: [],
        BDLBNM: [],
        BDFH: ''
      },
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10, 15, 20, 30]
      },
      // 下拉框配置
      props: {},
      // selectTypes: ['JZLBNM', 'BDJBNM', 'DMNM', 'JZNM', 'BZNM', 'BCLBNM', 'BCLBXFNM', 'BDLBNM'],
      selectTypes: ['JZLBNM', 'BDJBNM', 'JZNM', 'BZNM', 'BCLBNM', 'BCLBXFNM', 'BDLBNM'],
      // 地名列表
      dmnmList: []
    }
  },
  created() {
    // 获取地名列表
    this.getDmnmList()
    // 查询表格数据
    this.getTableData()
    // 生成下拉框配置
    this.props.DMNM = {
      value: 'code',
      label: 'label',
      children: 'children',
      multiple: true
    }
    this.selectTypes.forEach(item => {
      if (item === 'JZLBNM' || item === 'BCLBXFNM' || item === 'DMNM') {
        this.props[item] = {
          value: 'code',
          label: 'label',
          children: 'children',
          multiple: true,
          // checkStrictly: true,
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
      } else {
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
    // 导出DMP
    exportDmp() {
      DataCollectionAPI.exportSearchDataDmp({ tableName: 'ZZLL_BDQK' }).then(res => {
        if (res.code === 200) {
          window.open(res.msg)
        }
      })
    },
    isAndOrRadioGroupChange(val) {
      this.isAndOrRadioGroup = val
    },
    headClass() {
      return 'background:rgba(31 127 216);color:#fff'
    },
    handleCheckedChange() {
      bus.$emit('tabPage', this.checkedType)
    },
    // 搜索接口调用
    getTableData() {
      const params = this.getSearchParams()
      API.getData(params, this.pager, 'BD').then((res) => {
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
      params.BDFH = this.fightFormData.BDFH
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
      this.getTableData(this.formFightData)
    },
    // 第几页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getTableData(this.formFightData)
    },
    // 搜索数据
    onHandleSearch() {
      this.pager.pageSize = 10
      this.pager.currentPage = 1
      this.getTableData(this.formFightData)
    },
    // 重置
    onReset() {
      this.fightFormData = {
        JZLBNM: [],
        BDJBNM: [],
        DMNM: [],
        JZNM: [],
        BZNM: [],
        BCLBNM: [],
        BCLBXFNM: [],
        BDLBNM: []
      }
    },
    // 导出按钮 getExportSearchData
    onHandleExport() {
      const params = this.getSearchParams()
      API.getExportSearchData(params, 'BD').then((res) => {
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
  overflow: auto;

  width: 100%;
  height: calc(100% - 0px);
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
      margin-right: 20px;
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
