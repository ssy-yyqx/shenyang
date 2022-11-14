<template>
  <div>
    <!-- 过滤 -->
    <el-dialog
      title=""
      :visible.sync="showDialogFilter"
      width="30%"
    >
      <el-form label-position="top" label-width="80px" :model="formFilter">
        <el-form-item :label="labelFilter">
          <el-input v-if="labelFilter==='主题名称'||labelFilter==='主题描述'" v-model="formFilter.inputData" @change="dateFilter" />
          <el-select v-if="labelFilter==='类型'" v-model="formFilter.inputData" placeholder="请选择" @change="dateFilter">
            <el-option
              v-for="item in formFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-if="labelFilter==='创建时间'"
            v-model="formFilter.inputData"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss "
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 100%;"
            @change="dateFilter"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="filterDialog('cancel')">取 消</el-button>
        <el-button type="primary" @click="filterDialog('confirm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/index'
export default {
  name: '',
  props: {
    changeIsShow: {
      type: Boolean,
      default: true
    },
    labelFilter: {
      type: String,
      default: ''
    },
    pager: {
      type: Object,
      default: () => {}
    },
    columnProperty: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 对话框是否显示
      showDialogFilter: this.changeIsShow,
      formFilter: {
        inputData: ''
      },
      // 对话框表单label
      labelFilterChilren: this.labelFilter,
      // 过滤两种类型
      formFilterOptions: [
        {
          value: '0',
          label: '表关联'
        },
        {
          value: '1',
          label: 'SQL定制'
        }
      ],
      // 分页
      pagerChilren: this.pager,
      // 英文字段
      columnPropertyChilren: this.columnProperty

    }
  },
  watch: {
    changeIsShow(val) {
      this.showDialogFilter = val
    }
  },
  created() {
  },
  methods: {
    showDialogFilterFn(val) {
      this.$emit('onFilterChange', val)// 组件内对变更后向外部发送事件通知
    },
    // 按钮事件
    filterDialog(type) {
      if (type === 'confirm') { // 点击确认要执行的代码
        const filter = {}
        filter[this.columnProperty] = this.formFilter.inputData || ''
        const page = {
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          sortColumnMap: {}
        }
        var props = Object.assign({}, page, this.searchForm, filter)

        API.getThemeListData(props).then((res) => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            this.tableData = data.list
            this.$emit('filterTableData', this.tableData)
            this.pager.total = data.total
            this.showDialogFilterFn(false)
          } else {
            this.$message.error(msg)
          }
        })
        this.formFilter.inputData = ''
      } else if (type === 'cancel') { // 点击取消要执行的代码
        this.showDialogFilterFn(false)
        this.formFilter.inputData = ''
      }
    },
    // 过滤器
    dateFilter(val) {
      this.formFilter.inputData = val
    }

  }
}
</script>

<style lang="" scoped>

</style>
