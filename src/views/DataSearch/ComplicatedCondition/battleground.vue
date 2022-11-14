<template>
  <div class="content-section">
    <div class="form-search">
      <div class="search-border">
        <el-form
          :model="ruleForm"
          label-width="80px"
          :inline="true"
        >
          <el-row>
            <el-col :span="16">
              <el-form-item label="选择类别">
                <el-radio-group
                  v-model="ruleForm.checkedType"
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
            <el-col :span="3">
              <el-radio-group style="margin-top: 8px;text-align: center;" v-model="isAndOrRadioGroup" @change="isAndOrRadioGroupChange">
                <el-radio label="0">与</el-radio>
                <el-radio label="1">或</el-radio>
                <el-radio label="2">非</el-radio>
              </el-radio-group>
            </el-col>
            
            
              <el-form-item>
                <el-button type="primary" style="width:60px;height:35px;" @click="onSubmit">查询</el-button>
                <el-button type="primary" style="width:60px;height:35px;" @click="onReset">重置</el-button>
                <el-button type="primary" style="width:90px;height:35px;" @click="exportDmp">导出数据包</el-button>
                <el-button
                  class="elbutton"
                  type="primary"
                  style="position: relative;height:36px;"
                  @click="daochu"
                >导出文档
                </el-button>
              </el-form-item>
          </el-row>
          
        </el-form>
        <el-form :inline="true" :label-width="ruleForm.checkedType==='JJYS' ? '160px' : '110px'">
          <el-row
            v-if="!loading && ruleForm.checkedType && checkedLabel[ruleForm.checkedType]"
          >
            <el-form-item
              v-for="(item, index) in checkedLabel[ruleForm.checkedType]"
              :key="index"
              :label="item.label"
            >
              <el-cascader
                :ref="ruleForm.checkedType+'_'+item.key"
                v-model="fightFormData[ruleForm.checkedType][item.key]"
                :props="props[item.key]"
                :show-all-levels="false"
                collapse-tags
                :placeholder="'请选择' + item.label"
              />
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="search-data">
      <div class="label">查询结果：</div>
      <div v-if="tabPaneData.length > 0" class="table-result">
        <el-tabs v-model="activeName" type="card" @tab-click="tabsClick">
          <el-tab-pane
            v-for="(item, index) in tabPaneData"
            :key="index"
            :label="item.tableComment"
            :name="item.tableName"
          >
            <el-table :data="tableData.tableData" border stripe :header-cell-style="headClass" style="width: 100%">
              <el-table-column
                v-for="(item, index) in tableData.tableFiled"
                :key="index"
                show-overflow-tooltip
                :prop="item.labelCode"
                :label="item.labelName"
                sortable
                min-width="200"
              />
            </el-table>
          </el-tab-pane>
        </el-tabs>
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
      isAndOrRadioGroup: '0',
      labelQk:'',
      cascaderKey: 1,
      activeName: '',
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      tableData: [],
      optionProps: {
        value: 'code',
        label: 'label',
        children: 'children',
        multiple: true
      },
      typeData: {
        DC: '电磁环境',
        HSH: '核化生环境',
        SHHJ: '社会情况',
        RMFK: '人民防空',
        XWMT: '战时新闻媒体动员',
        WZDY: '人民武装动员',
        HQDY: '后勤动员',
        JJYS: '军交运输'
      },
      fightFormData: {
        DC: {},
        HSH: {},
        SHHJ: {},
        RMFK: {},
        XWMT: {},
        WZDY: {},
        HQDY: {},
        JJYS: {}
      },
      formData: {
        DC: {},
        HSH: {},
        SHHJ: {},
        RMFK: {},
        XWMT: {},
        WZDY: {},
        HQDY: {},
        JJYS: {}
      },
      searchTag: {
        DC: {},
        HSH: {},
        SHHJ: {},
        RMFK: {},
        XWMT: {},
        WZDY: {},
        HQDY: {},
        JJYS: {}
      },
      checkedLabel: {
        DC: [
          {
            key: 'DMNM',
            label: '区域'
          },
          {
            key: 'YPSXNM',
            label: '用频属性'
          },
          {
            key: 'XHTZNM',
            label: '信号特征'
          }
        ],
        HSH: [
          {
            key: 'DMNM',
            label: '区域'
          },
          {
            key: 'HHSSSFLNM',
            label: '核生化设施分类'
          }
          // {
          //   key: ' HHSWZNM',
          //   label: '核生化物质'
          // }
        ],
        SHHJ: [
          {
            key: 'DMNM',
            label: '区域'
          }
        ],
        RMFK: [
          {
            key: 'DMNM',
            label: '区域'
          },
          {
            key: 'JGJBNM',
            label: '机构级别'
          },
          {
            key: 'FKDJNM',
            label: '防空级别'
          },
          {
            key: 'ZHSXZNM',
            label: '指挥所性质'
          },
          {
            key: 'ZHSZTNM',
            label: '指挥所状态'
          },
          {
            key: 'BDJBNM',
            label: '部队级别'
          },
          {
            key: 'ZYDLXNM',
            label: '专业队类型'
          }
        ],
        XWMT: [
          {
            key: 'DMNM',
            label: '区域'
          },
          {
            key: 'DWXZNM',
            label: '单位性质'
          },
          {
            key: 'MTLBNM',
            label: '媒体类型'
          }
        ],
        WZDY: [
          {
            key: 'DYXTJGNM',
            label: '动员系统机构'
          },
          {
            key: 'MBBDLXNM',
            label: '民兵部队类型 '
          },
          {
            key: 'YBYZYNM',
            label: '预备役专业 '
          }
        ],
        HQDY: [
          {
            key: 'DMNM',
            label: '区域'
          },
          {
            key: 'HKGSNM',
            label: '航空公司'
          },
          {
            key: 'TLJNM',
            label: '铁路局'
          }
        ],
        JJYS: [
          {
            key: 'DMNM',
            label: '区域'
          },
          {
            key: 'JQNM',
            label: '军区'
          },
          {
            key: 'BZJBNM',
            label: '保障级别'
          },
          {
            key: 'JTZDMBLXNM',
            label: '交通重点目标类型'
          },
          {
            key: 'JTZDMBSSHYNM',
            label: '交通重点目标所属行业'
          }
        ]
      },
      checkedData: {},
      ruleForm: {
        checkedType: ''
      },
      tabPaneData: [],
      // 下拉框配置
      props: {},
      selectTypes: ['DMNM', 'YPSXNM', 'XHTZNM', 'HHSSSFLNM', 'JGJBNM', 'FKDJNM', 'ZHSXZNM', 'ZHSZTNM', 'BDJBNM', 'ZYDLXNM', 'DWXZNM', 'MTLBNM', 'DYXTJGNM', 'MBBDLXNM', 'YBYZYNM', 'HKGSNM', 'TLJNM', 'JQNM', 'BZJBNM', 'JTZDMBLXNM', 'JTZDMBSSHYNM'],
      loading: false
    }
  },
  watch: {
    // 切换数据源
    ruleForm: {
      handler() {
        ++this.cascaderKey
        this.tabPaneData = []
      },
      immediate: true,
      deep: true
    },
    // 监听tab值变化
    activeName: function(val) {
      this.getZCHJData()
    }
  },
  created() {
    // this.getZCHJParams()
    // 生成下拉框配置
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
    const paramMap = {
      DMNM: [],
      XHTZNM: [],
      YPSXNM: []
    }
    const data = {
      type: 'DC',
      paramMap: paramMap
    }
    if (this.checkedData.DC) {
      this.ruleForm.checkedType = 'DC'
    }

    // // 获取tab头部
    this.getZCHJTableName(data)
  },
  methods: {
    exportDmp(){
      DataCollectionAPI.exportSearchDataDmp({tableName:this.activeName}).then(res=>{
        if(res.code===200){
          window.open(res.msg)
        }
      })
    },
    isAndOrRadioGroupChange(val){
      this.isAndOrRadioGroup = val
    },
    headClass() {
      return 'background:rgba(31 127 216);color:#fff'
    },
    // 导出按钮
    daochu() {
      const props = {
        paramMap: this.getparamMap()
      }
      console.log(props)
      // console.log(this.formCombatData)
      API.getExportSearchDataSome(props, 'DC', this.activeName).then(res => {
        const { code, msg } = res
        if (String(code) === '200') {
          window.open(msg)
        } else {
          this.$message.error(msg)
        }
      })
    },
    handleCheckedChange(val) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
      this.pager.total = 0
      this.labelQk = ''
    },
    // 获取搜索选项信息
    // getZCHJParams() {
    //   API.getZCHJParams().then((res) => {
    //     if (res.data) {
    //       this.checkedData = res.data
    //     }
    //   })
    // },
    searchHandleChange(val, data, key) {
      this.getSearchLabel(val, data, key)
    },

    // 处理label数据和form数据
    getSearchLabel(val, data, key) {
      // console.log(val, data, key)

      this.formData[this.ruleForm.checkedType][key] = []
      // this.searchTag[this.ruleForm.checkedType][key] = []
      for (const item in val) {
        this.formData[this.ruleForm.checkedType][key].push(
          val[item][val[item].length - 1]
        )
        // 以前的写法
        // this.searchTag[this.ruleForm.checkedType][key].push({
        //   label: this.getLabel(val[item][val[item].length - 1], data),
        //   code: val[item][val[item].length - 1]

        // })
      }
      setTimeout(() => {
        let checkArr = this.$refs[this.ruleForm.checkedType + '_' + key][0].getCheckedNodes()
        checkArr = checkArr.filter(item => !(item.parent && item.parent.checked))
        const arrSearchTag = {
          DC: {},
          HSH: {},
          SHHJ: {},
          RMFK: {},
          XWMT: {},
          WZDY: {},
          HQDY: {},
          JJYS: {}}
        arrSearchTag[this.ruleForm.checkedType][key] = []
        // 现在的写法
        for (let i = 0; i < checkArr.length; i++) {
          arrSearchTag[this.ruleForm.checkedType][key].push({
            label: checkArr[i].label,
            code: checkArr[i].value

          })
        }
        this.searchTag = arrSearchTag
      }, 100)

      // 提交的数据
      // console.log(this.formData);
      // tag数据
      // console.log(this.searchTag);
    },
    // 找label
    getLabel(val, data) {
      console.log(val)
      console.log(data)
      let labelVal = null
      for (let i = 0; i < data.length; i++) {
        if (data[i].code === val) {
          labelVal = data[i].label
        }
        if (data[i].children) {
          labelVal = this.getLabel(val, data[i].children)
        }
        if (labelVal != null) {
          return labelVal
        }
      }
      return labelVal
    },
    // 删除tag
    handleClose(key, index, val) {
      this.fightFormData[this.ruleForm.checkedType][key] = this.arrMove(
        this.fightFormData[this.ruleForm.checkedType][key],
        val
      )
      this.getSearchLabel(
        this.fightFormData[this.ruleForm.checkedType][key],
        this.checkedData[this.ruleForm.checkedType][key],
        key
      )
    },
    // 删除数组
    arrMove(arr, key) {
      var temp = []
      for (var i = 0; i < arr.length; i++) {
        if (!arr[i].find((e) => e === key)) {
          temp.push(arr[i])
        }
      }
      return temp
    },
    // 搜索
    onSubmit() {
      this.pager.pageSize = 10
      this.pager.currentPage = 1
      console.log(this.ruleForm.checkedType)
      const data = {
        type: this.ruleForm.checkedType || '',
        paramMap: this.getparamMap()
      }
      // 获取tab头部
      this.getZCHJTableName(data)
      this.getZCHJData()
    },
    // 重置
    onReset() {
      this.fightFormData = {
        DC: {},
        HSH: {},
        SHHJ: {},
        RMFK: {},
        XWMT: {},
        WZDY: {},
        HQDY: {},
        JJYS: {}
      }
    },
    // 处理getparamMap数据
    getparamMap() {
      const paramMap = {}
      if (this.ruleForm.checkedType) {
        this.checkedLabel[this.ruleForm.checkedType].forEach(item => {
          paramMap[item.key] = this.getArrayData(this.fightFormData[this.ruleForm.checkedType][item.key])
        })
      }
      paramMap.isAndOr =this.isAndOrRadioGroup
      console.log(paramMap)
      return paramMap
    },
    // 获取二维数组第二层的最后一个数据
    getArrayData(array) {
      const data = []
      if (array) {
        array.forEach(item => {
          if (item && item.length > 0) {
            data.push(item[item.length - 1])
          }
        })
      }
      return data
    },
    // tab表头
    getZCHJTableName(data) {
      
      API.getZCHJTableName(data).then((res) => {
        this.tabPaneData = res.data
        console.log(res.data[0].tableName)
        console.log(this.labelQk)
        if(this.labelQk === ''){
          this.activeName = res.data[0].tableName
        }else {
          this.activeName = this.labelQk
        }
        
      })
    },
    tabsClick(val){
      this.labelQk = val.name
      console.log(this.labelQk)
    },
    // 列表内容
    getZCHJData() {
      const data = {
        tableName: this.activeName,
        pageNum: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        paramMap: this.getparamMap()
      }

      API.getZCHJData(data).then((res) => {
        this.tableData = res.data
        this.pager.total = res.data.total
      })
    },

    // 分页
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getZCHJData()
    },
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getZCHJData()
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
      padding: 10px 10px 2px 10px;
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
