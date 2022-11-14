
<template>
  <div class="content-section">
    <div class="form-search">
      <el-form label-width="80px" class="search-border" :inline="true">
        <el-row :gutter="0">
          <el-col :span="5">
            <el-form-item label="部队番号">
              <el-cascader
                ref="demoCascader"
                v-model="fightFormData.BDNM"
                :options="fightData.BDNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择部队番号"
                @change="
                  (val) => {
                    searchHandleChange(val, 'BDNM');
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="地名">
              <el-cascader
                ref="demoCascader"
                v-model="fightFormData.DMNM"
                :options="fightData.DMNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择地名"
                @change="
                  (val) => {
                    searchHandleChange(val, 'DMNM');
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="装备分类">
              <el-cascader
                v-model="fightFormData.ZBFLNM"
                :options="fightData.ZBFLNM"
                :props="optionProps"
                :show-all-levels="false"
                collapse-tags
                placeholder="请选择装备分类"
                @change="
                  (val) => {
                    searchHandleChange(val, 'ZBFLNM');
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
import Container from '@/components/Container'
export default {
  components: {
    Container
  },
  data() {
    return {
      numFlag: 6,
      formFightData: {
        BDNM: [],
        DMNM: [],
        ZBFLNM: []
      },
      tableFightData: {},
      fightData: {},
      optionProps: {
        value: 'code',
        label: 'label',
        children: 'children',
        // multiple: true,
        checkStrictly: true
      },
      fightFormData: {
        BDNM: [],
        DMNM: [],
        ZBFLNM: []
      },
      JZLBNMdata: [],
      searchTag: [],
      reultArr: {
        BDNM: [],
        DMNM: [],
        ZBFLNM: []
      },

      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      }
    }
  },
  mounted() {
    this.searchGetZZZBParams()
    this.getData(this.formFightData)
  },
  methods: {
    searchGetZZZBParams() {
      API.searchGetZZZBParams().then((res) => {
        console.log(res)
        this.fightData = res.data
      })
    },

    // 导出按钮 getExportSearchData
    daochu(data) {
      API.getExportSearchData(this.formFightData, 'ZB').then((res) => {
        const { code, msg } = res
        if (String(code) === '200') {
          window.open(msg)
        } else {
          this.$message.error(msg)
        }
      })
    },

    // 下拉响应数据
    searchHandleChange(val, type) {
      const changeVal = this.getId(val, type)

      if (changeVal.length <= 0) {
        this.searchTag = []
      }
      this.formFightData[type] = changeVal
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
      // 单选
      if (this.optionProps.checkStrictly) {
        this.formFightData[tag.key] = []
        this.fightFormData[tag.key] = []
      } else {
        // 多选
        this.formFightData[tag.key].splice(
          this.formFightData[tag.key].indexOf(tag.code),
          1
        )
      }
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
      API.getData(data, this.pager, 'ZB').then((res) => {
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
