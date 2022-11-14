<template>
  <div class="content-section">
    <div class="form-search">
      <el-form
        :model="ruleForm"
        label-width="160px"
        class="search-border"
        :inline="true"
      >
        <el-row>
          <el-col :span="20">
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
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" style="width:70px;height:35px;" @click="onSubmit">查询</el-button>
              <el-button
                class="elbutton"
                style="position: relative;height:36px;"
                @click="daochu"
              >
                <img
                  style="width:20px;height:20px;position:absolute;top:20%;"
                  :src="require(`@/icons/newImages/daochu.png`)"
                  class="img-class"
                  alt=""
                >
                <span style="margin-left:20px">导出</span>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="ruleForm.checkedType && checkedLabel[ruleForm.checkedType]"
        >
          <el-form-item
            v-for="(item, index) in checkedLabel[ruleForm.checkedType]"
            :key="index"
            :label="item.label"
          >
            <el-cascader
              v-if="checkedData[ruleForm.checkedType]"
              :key="cascaderKey"
              :ref="ruleForm.checkedType+'_'+item.key"
              v-model="fightFormData[ruleForm.checkedType][item.key]"
              :options="checkedData[ruleForm.checkedType][item.key]"
              :props="optionProps"
              :show-all-levels="false"
              collapse-tags
              :placeholder="'请选择' + item.label"
              @change="
                (val) => {
                  searchHandleChange(
                    val,
                    checkedData[ruleForm.checkedType][item.key],
                    item.key
                  );
                }
              "
            />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="search-data">
      <span class="tag-title">全部结果> </span>
      <div
        v-for="(item, key, index) of searchTag[ruleForm.checkedType]"
        :key="index"
        class="tag-label"
      >
        <el-tag
          v-for="tag in item"
          :key="tag.code"
          class="tag-data"
          closable
          effect="plain"
          @close="handleClose(key, index, tag.code)"
        >
          {{ tag.label }}
        </el-tag>
        <!-- <el-tag v-for="(tag,indexs) in item" v-show="indexs < numFlag" :key="tag.code" class="tag-data" effect="plain" closable @close="handleClose(key, index, tag.code)">
          {{ tag.label }}
        </el-tag>
        <el-tag v-if="item.length >= numFlag+1">
          +{{ item.length - numFlag }}
        </el-tag> -->
      </div>
    </div>
    <div v-if="tabPaneData.length > 0" class="table-result">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane
          v-for="(item, index) in tabPaneData"
          :key="index"
          :label="item.tableComment"
          :name="item.tableName"
        >
          <el-table :data="tableData.tableData" style="width: 100%">
            <el-table-column
              v-for="(item, index) in tableData.tableFiled"
              :key="index"
              :prop="item.labelCode"
              :label="item.labelName"
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
</template>
<script>
// import Container from '@/components/Container'
import * as API from '@/api/DataReorganize'
export default {
  // components: { Container },
  data() {
    return {
      numFlag: 6,
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
          },
          {
            key: ' HHSWZNM',
            label: '核生化物质'
          }
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
      tabPaneData: []
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
  mounted() {
    this.getZCHJParams()
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
      this.pager.total = 0
    },
    // 获取搜索选项信息
    getZCHJParams() {
      API.getZCHJParams().then((res) => {
        if (res.data) {
          this.checkedData = res.data
        }
      })
    },
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
      const data = {
        type: this.ruleForm.checkedType || '',
        paramMap: this.getparamMap()
      }
      console.log(data)

      // 获取tab头部
      this.getZCHJTableName(data)
      this.getZCHJData()
    },
    // 处理getparamMap数据
    getparamMap() {
      const paramMap = {}
      for (const item in this.checkedData[this.ruleForm.checkedType]) {
        paramMap[item] = []
        if (this.formData[this.ruleForm.checkedType][item]) {
          paramMap[item] = this.formData[this.ruleForm.checkedType][item]
        }
      }
      return paramMap
    },
    // tab表头
    getZCHJTableName(data) {
      API.getZCHJTableName(data).then((res) => {
        this.tabPaneData = res.data
        this.activeName = res.data[0].tableName
      })
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
    .tag-title {
      font-size: 14px;
      color: #555555;
    }
    .tag-label {
      display: inline;
    }
    .tag-data {
      margin-right: 10px;
      border-color: #e6e6e6;
      color: #555555;
    }
  }
  .table-result {
    border: 1px solid #e6e6e6;
    margin: 5px 22px 22px 22px;

    padding: 20px 10px;
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
}
</style>
