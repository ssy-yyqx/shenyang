<template>
  <div class="big-data-select">
    <el-popover
      placement="bottom-start"
      title=""
      width="400"
      :disabled="isDisabled"
      @show="show"
      @hide="hide"
      trigger="click"
    >
      <div class="select-container">
        <template v-if="total > 0">
          <div v-infinite-scroll="load" class="select-data-section" infinite-scroll-disabled="disabled">
            <el-radio-group v-model="selectedData" @change="onHandleChangeSelect">
              <div v-for="item in currentData" :key="item.code" class="select-data-item">
                <el-radio :label="item.code">{{ item.label }}</el-radio>
              </div>
            </el-radio-group>
          </div>
          <p v-if="loading" class="info">加载中...</p>
          <p v-if="noMore" class="info">没有更多了</p>
        </template>
        <p v-else class="info">暂无数据</p>
      </div>
      <el-input slot="reference" v-model="input" placeholder="请选择" :disabled="isDisabled" :suffix-icon="isShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @change="onHandleSearch">
      </el-input>
    </el-popover>
  </div>
</template>

<script>
import * as API from '@/api/dataCollection'
export default {
  props: {
    inputValue: {
      type: String,
      default: ''
    },
    resetTexts: {
      type: String,
      default: ''
    },
    selectValue: {
      type: String,
      default: ''
    },
    columnName: {
      type: String,
      default: ''
    },
    tableName: {
      type: String,
      default: ''
    },
    forceCode: {
      type: String,
      default: ''
    },
    equipmentCode: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow:false,
      // 输入框值
      input: '',
      // 搜索条件
      searchKey: '',
      // 全量数据
      allData: [],
      // 搜索结果
      searchedData: [],
      // 总数
      total: 0,
      // 当前显示数据
      currentData: [],
      // 选中的数据
      selectedData: '',
      // 是否正在加载数据
      loading: false,
      // 当前页
      currentPage: 1,
      // 每页条数
      pageSize: 10
    }
  },
  computed: {
    noMore() {
      return this.currentData.length >= this.total
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    inputValue: {
      handler(val) {
        this.input = val
      },
      immediate: true
    },
    selectValue: {
      handler(val) {
        this.selectedData = this.selectValue
      },
      immediate: true
    },
    isDisabled:{
      handler(val) {
        if(!val){
          this.input = ''
        }
      },
      immediate: true
    }
  },
  created() {
    this.generateData()
  },
  methods: {
    show(){
      this.isShow = true
    },
    hide(){
      this.isShow = false
    },
    // 生产数据
    generateData() {
      const param = {
        columnName: this.columnName.split('_')[0],
        tableName: this.tableName,
        sequence: '',
        forceCode: this.forceCode,
        equipmentCode: this.equipmentCode,
        sync: false
      }
      API.getSelectOptions(param).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.allData = data
          this.setData(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取当前数据
    load() {
      this.loading = true
      this.currentData.splice(this.currentPage * this.pageSize, 0, ...this.allData.slice(this.currentPage * 10, this.currentPage * 10 + 10))
      this.currentPage++
      this.loading = false
    },
    // 搜索
    onHandleSearch() {
      const data = this.allData.filter(item => item.label.indexOf(this.input) > -1)
      this.setData(data)
    },
    // 设置数据
    setData(data) {
      this.searchedData = data
      this.total = data.length
      if (data && data.length > 0) {
        if (data.length < 11) {
          this.currentData = [...data]
        } else {
          this.currentData = this.searchedData.slice(0, 10)
        }
      } else {
        this.currentData = []
      }
    },
    // 选择
    onHandleChangeSelect(data) {
      const selectedData = this.currentData.find(item => item.code === data)
      if (selectedData) {
        this.input = selectedData.label
        this.$emit('setBigDataColumnValue', this.columnName, selectedData.code)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.big-data-select{
  width: 100%;
  height: 100%;
}
.select-container{
  .select-data-section{
    height: 200px;
    overflow: auto;
    .select-data-item{
      padding: 10px;
    }
  }
}
.info{
  font-size: 12px;
  padding: 0 20px;
  color: #dfdfdf;
}
</style>
