<template>
  <Container>
    <div class="total-section">
      <div class="total-section-div">
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          border
          :header-cell-style="{background:'#1f7cd7',color:'#fff'}"
        >
          <el-table-column
            v-for="(column, index) in tableColumns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :align="column.align"
            :render-header="renderHeader"
          />
          <el-table-column prop="tag" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="color: #1f7fd8"
                @click="onView(scope.row)"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pager-section">
          <el-pagination
            :current-page="pager.currentPage"
            :page-sizes="pager.pageSizes"
            :page-size="pager.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pager.total"
            @size-change="
              (val) => {
                handleSizeChange(val);
              }
            "
            @current-change="
              (val) => {
                handleCurrentChange(val);
              }
            "
          />
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="drawer"
      custom-class="qiefen-dialog-class"
      title="详情"
    >
      <div class="items1" style="display: flex; flex-wrap: wrap">
        <div v-for="(item, index) in arr" :key="index" class="situationItem">
          <div style="font-weight: bold">
            {{ item.key }}
          </div>
          <div class="ziduan">{{ item.val }}</div>
        </div>
      </div>
      <!-- <el-table
        :data="tableDatas"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in tableCol"
          :key="index"
          :prop="item.columnName"
          :label="item.commentsView"
          width="180"
        />
      </el-table> -->
    </el-dialog>
    <!-- 过滤的弹出框 -->
    <el-dialog
      :visible.sync="filtrationVisible"
      custom-class="qiefen-dialog-class"
      width="30%"
      title="过滤"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="innerText" prop="text">
          <el-date-picker
            v-if="innerText==='采集时间'"
            v-model="ruleForm.text"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          />
          <el-input v-else v-model="ruleForm.text" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </Container>
</template>

<script>
import * as API from '@/api/UserCentre'
import Container from '@/components/Container'
export default {
  components: { Container },
  data() {
    return {
      filtrationVisible: false,
      innerText: '',
      propKey: '',
      ruleForm: {
        text: ''
      },
      rules: {
        text: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      // 表头  主题名称、相关度
      tableColumns: [
        {
          label: '标题',
          prop: 'title',
          align: 'center',
          key: 'name',
          value: 'TITLE'
        },
        {
          label: '采集时间',
          prop: 'collectDate',
          align: 'center',
          key: 'time',
          value: 'COLLECT_DATE'
        },
        {
          label: '数据来源',
          prop: 'dataSource',
          align: 'center',
          key: 'time',
          value: 'DATA_SOURCE'
        },
        {
          label: '主题名称',
          prop: 'topicName',
          align: 'center',
          key: 'time',
          value: 'DATA_SOURCE'
        },
        {
          label: '相关度',
          prop: 'correlationDegree',
          align: 'center',
          key: 'time',
          value: 'DATA_SOURCE'
        },
        {
          label: '描述',
          prop: 'description',
          align: 'center',
          key: 'time',
          value: 'DESCRIPTION'
        }
      ],
      keys: [],
      value: [],
      tableData: [],
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      drawer: false,
      row: {},
      arr: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    renderHeader(h, { column, $index }) {
      return h('div', [
        h(
          'p',
          {
            style: 'display:inline-block'
          },
          column.label
        ),
        h('div', {
          style: 'display: inline-block;position: relative;top: 3px;'
        }, [
          h('i', {
            class: 'el-icon-caret-top',
            style: 'display: block;line-height: 0.5;',
            on: {
              click: () => {
                this.RowcaretTop(column, $index)
              }
            }
          }),
          h('i', {
            class: 'el-icon-caret-bottom',
            style: 'display: block;line-height: 0.5;',
            on: {
              click: () => {
                this.RowcaretBottom(column, $index)
              }
            }
          })
        ]),

        h('i', {
          class: 'el-icon-data-analysis',
          on: {
            click: () => {
              this.Rowdataanalysis(column, $index)
            }
          }
        })
      ])
    },
    // 升序
    RowcaretTop(column, index) {
      const keys = this.tableColumns.find(item => item.prop === column.property)
      const orderBys = 'ASC'
      const orderColumns = keys.value
      this.getList(orderBys, orderColumns)
    },
    // 降序
    RowcaretBottom(column, index) {
      const keys = this.tableColumns.find(item => item.prop === column.property)
      const orderBys = 'DESC'
      const orderColumns = keys.value
      this.getList(orderBys, orderColumns)
    },
    // 过滤
    Rowdataanalysis(column, index) {
      this.innerText = column.label
      // key
      this.propKey = column.property
      this.filtrationVisible = true
    },
    // 确定
    confirm() {
      if (this.ruleForm.text !== '') {
        this.filtrationVisible = false
        console.log(this.propKey, this.ruleForm.text)
        this.getList('', '', this.propKey, this.ruleForm.text)
      } else {
        this.$message.error('请输入要查询的条件！')
        return
      }
      this.ruleForm.text = ''
    },
    // 弹出框右上角叉号
    handleClose() {
      this.ruleForm.text = ''
      this.filtrationVisible = false
    },
    getList(orderBys, orderColumns, propKeys, texts) {
      let orderBy = ''
      let orderColumn = ''
      if (orderBys && orderColumns) {
        orderBy = orderBys
        orderColumn = orderColumns
      } else {
        orderBy = ''
        orderColumn = ''
      }
      let dataList = {}
      if (texts !== undefined) {
        // 动态改变对象的key值
        var datas = {}
        datas[propKeys] = texts
        dataList = datas
      } else {
        dataList = {}
      }
      const Data = {
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage,
        orderBy,
        orderColumn
      }
      const data = Object.assign({}, Data, dataList)
      console.log(data)

      API.getList(data).then((res) => {
        this.tableData = res.data.list
        this.pager.total = res.data.total
      })
    },
    // 一页显示多少个
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getList({
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage
      })
    },
    // 第几页
    handleCurrentChange(val) {
      this.pager.currentPage = val

      this.getList({
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage
      })
    },
    // 点击查看
    onView(row) {
      this.row = row
      this.getDetail()
    },
    // 获取表内容
    getDetail() {
      const params = {
        primaryKeyObject: this.row.param,
        tableName: this.row.url
      }
      API.getDetail(params).then((res) => {
        if (res.code === 200) {
          this.arr = []
          for (var i in res.data) {
            this.arr.push({
              key: i,
              val: res.data[i]
            })
          }
          this.drawer = true
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-button--primary{
  background-color: #1f7cd7;
}
>>> .qiefen-dialog-class{
  margin-top: 15vh !important;
}

.situationItem {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #f0f2f7;
  margin-left: 24px;
  margin-bottom: 8px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.total-section {
  height: calc(100% - 20px);
  width: 100%;
  background: #fff;
  overflow-y: scroll;
  .total-section-div {
    padding: 20px;
  }
}
.pager-section {
  margin-top: 20px;
  text-align: right;
  margin-right: 20px;
}
// >>> .el-table td, .el-table th {
//     padding: 0 !important;
//   }
  >>> .el-table--small th {
    padding: 0 !important;
  }
</style>
