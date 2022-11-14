<template>
  <div class="content-section">
    <div class="form-search">
      <el-form label-width="80px" class="search-border" :inline="true">
        <el-row :gutter="20">
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
          <el-radio-group v-model="isAndOrRadioGroup" @change="isAndOrRadioGroupChange">
            <el-radio label="0">与</el-radio>
            <el-radio label="1">或</el-radio>
            <el-radio label="2">非</el-radio>
          </el-radio-group>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input v-model="fightFormData.MC" style="width: 200px;" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号码" label-width="82px">
              <el-input
                v-model="fightFormData.SFZHM"
                placeholder="请输入身份证号码"
                style="width: 200px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键岗位人员类别" label-width="126px">
              <el-cascader
                ref="GGRLNM"
                v-model="fightFormData.GGRLNM"
                :props="props.GGRLNM"
                collapse-tags
                :show-all-levels="false"
                placeholder="请选择关键岗位人员类别"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="军衔">
              <el-cascader
                ref="JXNM"
                v-model="fightFormData.JXNM"
                :props="props.JXNM"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择军衔"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="部队番号">
              <el-cascader
                ref="BDNM"
                v-model="fightFormData.BDNM"
                :props="props.BDNM"
                collapse-tags
                :show-all-levels="false"
                placeholder="请选择部队番号"
              />
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="文化程度">
              <el-cascader
                ref="WHCDNM"
                v-model="fightFormData.WHCDNM"
                :props="props.WHCDNM"
                collapse-tags
                :show-all-levels="false"
                placeholder="请选择文化程度"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职务级别" label-width="126px">
              <el-cascader
                ref="ZWJBNM"
                v-model="fightFormData.ZWJBNM"
                :props="props.ZWJBNM"
                collapse-tags
                :show-all-levels="false"
                placeholder="请选择职务级别"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="政治面貌">
              <el-cascader
                ref="ZZMMNM"
                v-model="fightFormData.ZZMMNM"
                :props="props.ZZMMNM"
                collapse-tags
                :show-all-levels="false"
                placeholder="请选择政治面貌"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin: 0 20px 10px 0px;">
          <el-col :span="24" style="text-align: right;">
            <el-button
              type="primary"
              @click="onHandleSearch"
            >查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
            <el-button type="primary" @click="exportDmp">导出数据包</el-button>
            <el-button
              class="elbutton"
              type="primary"
              @click="onHandleExport"
            >
              导出文档
            </el-button>
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
import * as API from '@/api/index'
import bus from '@/utils/bus'
import * as DataCollectionAPI from '@/api/dataCollection'
import * as PARAMS from './params'
export default {
  data() {
    return {
      isAndOrRadioGroup: '0',
      checkedType: '3',
      typeData: {
        0: '基本信息',
        3: '关键岗位人员信息'
      },
      fightFormData: {
        SFZHM: '',
        GGRLNM: [],
        JXNM: [],
        ZZMMNM: [],
        WHCDNM: [],
        ZWJBNM: [],
        BDNM: [],
        MC: ''
      },
      tableFightData: {
        tableFiled: [],
        tableData: []
      },
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      // 下拉框配置
      props: {

      },
      selectTypes: ['BDNM', 'GGRLNM', 'JXNM', 'WHCDNM', 'ZWJBNM', 'ZZMMNM']
    }
  },
  created() {
    // 查询表格数据
    this.getTableData()
    // 生成下拉框配置
    this.selectTypes.forEach(item => {
      if (item === 'JXNM' || item === 'ZWJBNM' || item === 'GGRLNM') {
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
    // 导出DMP
    exportDmp() {
      DataCollectionAPI.exportSearchDataDmp({ tableName: 'ZZLL_GJGWRY_JBQK' }).then(res => {
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
      params.SFZHM = this.fightFormData.SFZHM
      API.getData(params, this.pager, 'GG').then((res) => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          this.tableFightData.tableFiled = data.tableFiled
          this.tableFightData.tableData = data.tableData
          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取搜索参数
    getSearchParams() {
      const params = {}
      this.selectTypes.forEach(item => {
        params[item] = this.getArrayData(this.fightFormData[item])
      })
      params.isAndOr = this.isAndOrRadioGroup
      params.MC = this.fightFormData.MC
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
    // 查询按钮
    onHandleSearch() {
      this.pager.pageSize = 10
      this.pager.currentPage = 1
      this.getTableData()
    },
    // 重置
    onReset() {
      this.fightFormData = {
        SFZHM: '',
        GGRLNM: [],
        JXNM: [],
        ZZMMNM: [],
        WHCDNM: [],
        ZWJBNM: [],
        BDNM: []
      }
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
    // 导出按钮
    onHandleExport() {
      const params = this.getSearchParams()
      params.SFZHM = this.fightFormData.SFZHM
      API.getExportSearchData(params, 'GG').then((res) => {
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
>>> .el-col-6 {
  width: 25%;
}
// >>> .el-input--small .el-input__inner{
//   width: 215px;
// }
.content-section {
  background: #fff;
  padding-bottom: 20px;
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
</style>
