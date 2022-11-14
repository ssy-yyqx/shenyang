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
          <el-col :span="5">
            <el-form-item label="建制">
              <el-cascader
                ref="demoCascader"
                v-model="fightFormData.JZLBNM"
                :options="fightData.JZLBNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择建制"
                @change="
                  (val) => {
                    searchHandleChange(val, 'JZLBNM');
                  }
                "
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="5">
            <el-form-item label="编成">
              <el-cascader
                ref="demoCascader"
                v-model="fightFormData.BCLBXFNM"
                :options="fightData.BCLBXFNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择编成"
                @change="
                  (val) => {
                    searchHandleChange(val, 'BCLBXFNM');
                  }
                "
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="5">
            <el-form-item label="级别">
              <el-cascader
                v-model="fightFormData.BDJBNM"
                :options="fightData.BDJBNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择级别"
                @change="
                  (val) => {
                    searchHandleChange(val, 'BDJBNM');
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="位置">
              <el-cascader
                v-model="fightFormData.DMNM"
                :options="fightData.DMNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择位置"
                @change="
                  (val) => {
                    searchHandleChange(val, 'DMNM');
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="军种">
              <el-cascader
                v-model="fightFormData.JZNM"
                :options="fightData.JZNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择军种"
                @change="
                  (val) => {
                    searchHandleChange(val, 'JZNM');
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="兵种">
              <el-cascader
                v-model="fightFormData.BZNM"
                :options="fightData.BZNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择兵种"
                @change="
                  (val) => {
                    searchHandleChange(val, 'BZNM');
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="编成类别">
              <el-cascader
                v-model="fightFormData.BCLBNM"
                :options="fightData.BCLBNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择编成类别"
                @change="
                  (val) => {
                    searchHandleChange(val, 'BCLBNM');
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="编成分类">
              <el-cascader
                v-model="fightFormData.BCLBXFNM"
                :options="fightData.BCLBXFNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择编成分类"
                @change="
                  (val) => {
                    searchHandleChange(val, 'BCLBXFNM');
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="部队类别">
              <el-cascader
                v-model="fightFormData.BDLBNM"
                :options="fightData.BDLBNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择部队类别"
                @change="
                  (val) => {
                    searchHandleChange(val, 'BDLBNM');
                  }
                "
              />
            </el-form-item>
          </el-col>

          <el-form-item>
            <el-button
              type="primary"
              size="medium"
              style="height: 35px"
              @click="onSubmit"
            >查询</el-button>
          </el-form-item>
          <!-- 导出 -->
          <el-form-item>
            <el-button
              class="elbutton"
              style="position: relative; height: 36px"
              @click="daochu"
            >
              <img
                style="width: 20px; height: 20px; position: absolute; top: 20%"
                :src="require(`@/icons/newImages/daochu.png`)"
                class="img-class"
                alt=""
              >
              <span style="margin-left: 20px">导出</span>
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="search-data">
      <span class="tag-title">全部结果> </span>
      <el-tag
        v-for="(tag, index) in searchTag"
        v-show="index < numFlag"
        :key="tag.code"
        class="tag-data"
        effect="plain"
        closable
        @close="handleClose(tag)"
      >
        {{ tag.label }}
      </el-tag>
      <el-tag v-if="searchTag.length >= numFlag + 1">
        +{{ searchTag.length - numFlag }}
      </el-tag>
    </div>

    <div class="table-result">
      <el-table :data="tableFightData.tableData" style="width: 100%">
        <el-table-column
          v-for="(item, index) in tableFightData.tableFiled"
          :key="index"
          :prop="item.labelCode"
          :label="item.labelName"
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
</template>

<script>
import * as API from '@/api/DataReorganize'
import bus from '@/utils/bus'
// import Container from '@/components/Container'
export default {
  name: 'CombatForces',
  // components: { Container },
  data() {
    return {
      numFlag: 6,
      formFightData: {
        BCLBNM: [],
        BDJBNM: [],
        BZNM: [],
        DMNM: [],
        JZLBNM: [],
        JZNM: []
      },
      checkedType: '0',
      typeData: {
        0: '基本信息',
        3: '关键岗位人员信息'
      },
      tableFightData: {},
      fightData: {},
      optionProps: {
        value: 'code',
        label: 'label',
        children: 'children',
        // multiple: true
        checkStrictly: true
      },
      fightFormData: {
        BCLBNM: [],
        BDJBNM: [],
        BZNM: [],
        DMNM: [],
        JZLBNM: [],
        JZNM: []
      },
      JZLBNMdata: [],
      searchTag: [],
      reultArr: {
        BCLBNM: [],
        BDJBNM: [],
        BZNM: [],
        DMNM: [],
        JZLBNM: [],
        JZNM: []
      },

      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10, 15, 20, 30]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getBDParams()
    this.getData(this.formFightData)
  },
  methods: {
    handleCheckedChange() {
      bus.$emit('tabPage', this.checkedType)
    },
    // 导出按钮 getExportSearchData
    daochu(data) {
      API.getExportSearchData(this.formFightData, 'BD').then((res) => {
        const { code, msg } = res
        if (String(code) === '200') {
          window.open(msg)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取搜索选项信息
    getBDParams() {
      API.getBDParams().then((res) => {
        this.fightData = res.data
      })
    },

    // 下拉响应数据
    searchHandleChange(val, type) {
      const changeVal = this.getId(val, type)

      if (changeVal.length <= 0) {
        this.searchTag = []
      }
      this.formFightData[type] = changeVal
      // if (type === "BCLBNM") {
      //   this.formFightData.BCLBNM = changeVal;
      // }
      // if (type === "BDJBNM") {
      //   this.formFightData.BDJBNM = changeVal;
      // }
      // if (type === "BZNM") {
      //   this.formFightData.BZNM = changeVal;
      // }
      // if (type === "DMNM") {
      //   this.formFightData.DMNM = changeVal;
      // }
      // if (type === "JZLBNM") {
      //   this.formFightData.JZLBNM = changeVal;
      // }
      // if (type === "JZNM") {
      //   this.formFightData.JZNM = changeVal;
      // } else {
      //   this.formFightData[type] = changeVal;
      // }
    },
    // 判断是否为二维数组
    isTwoArray(data) {
      let arr = null
      data.some((items) => {
        arr = Array.isArray(items)
        return arr
      })
      return arr
    },
    // 选择数据处理
    getId(arr, originalData) {
      const result = []

      this.reultArr[originalData] = []

      const that = this
      let valueData = ''

      if (this.isTwoArray(arr)) {
        arr.forEach((v) => {
          valueData = v[v.length - 1]
          that.reultArr[originalData].push({
            code: that.findLabel(that.fightData[originalData], valueData).code,
            label: that.findLabel(that.fightData[originalData], valueData)
              .label,
            key: originalData
          })

          result.push(valueData)
        })
      } else {
        valueData = arr[arr.length - 1]
        that.reultArr[originalData].push({
          code: that.findLabel(that.fightData[originalData], valueData).code,
          label: that.findLabel(that.fightData[originalData], valueData).label,
          key: originalData
        })

        result.push(valueData)
      }
      that.getTagData()
      return result
    },

    // 处理tag数据
    getTagData() {
      this.searchTag = []
      // if (this.reultArr.BCLBNM.length > 0) {
      //   this.searchTag.push(...this.reultArr.BCLBNM);
      // }
      // if (this.reultArr.BDJBNM.length > 0) {
      //   this.searchTag.push(...this.reultArr.BDJBNM);
      // }
      // if (this.reultArr.BZNM.length > 0) {
      //   this.searchTag.push(...this.reultArr.BZNM);
      // }
      // if (this.reultArr.DMNM.length > 0) {
      //   this.searchTag.push(...this.reultArr.DMNM);
      // }
      // if (this.reultArr.JZLBNM.length > 0) {
      //   this.searchTag.push(...this.reultArr.JZLBNM);
      // }
      // if (this.reultArr.JZNM.length > 0) {
      //   this.searchTag.push(...this.reultArr.JZNM);
      // }
      for (const item in this.reultArr) {
        this.searchTag.push(...this.reultArr[item])
      }
    },
    // 获取label
    findLabel(Arr, ID) {
      var _result = null
      for (let i = 0; i < Arr.length; i++) {
        if (Arr[i].code === ID) return Arr[i]
        if (Arr[i].children) _result = this.findLabel(Arr[i].children, ID)
        if (_result != null) return _result
      }

      return _result
    },
    // 关闭标签
    handleClose(tag) {
      this.formFightData[tag.key].splice(
        this.formFightData[tag.key].indexOf(tag.code),
        1
      )
      this.reultArr[tag.key].splice(
        this.reultArr[tag.key].indexOf(tag.code),
        1
      )
      this.searchTag.splice(this.searchTag.indexOf(tag), 1)

      var oldData = this.fightFormData[tag.key]
      var data = { ...oldData }
      for (const item in data) {
        if (data[item].indexOf(tag.code) !== -1) {
          this.fightFormData[tag.key] = this.arrMove(oldData, oldData[item])
        }
      }
    },
    // 删除数组
    arrMove(arr, key) {
      var temp = []

      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== key) {
          temp.push(arr[i])
        }
      }
      return temp
    },
    // 搜索接口调用
    getData(data) {
      API.getData(data, this.pager, 'BD').then((res) => {
        this.tableFightData = res.data
        this.pager.total = res.data.total
      })
    },
    // 一页显示多少个
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getData(this.formFightData)
    },
    // 第几页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getData(this.formFightData)
    },
    // 搜索数据
    onSubmit() {
      this.getData(this.formFightData)
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
