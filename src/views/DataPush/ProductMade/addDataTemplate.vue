<template>
  <div class="conT">
    <div class="content">
      <el-card shadow="never">
        <div class="con">
          <div class="queryCondition">
            <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="名称">
                    <el-input v-model="form.name" />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="生成时间">
                    <el-date-picker
                      v-model="form.createTime"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-button type="primary">查询</el-button>
                  <el-button type="warning" @click="addData(1)">新增(点选)</el-button>
                  <el-button type="warning" @click="addData(2)">新增(sql)</el-button>
                  <el-button type="danger" @click="deleteData">删除</el-button>
                </el-col>
                <el-col :span="1">
                  <el-button type="info" @click="returnPage">返回</el-button>
                </el-col>
              </el-row>
            </el-form>

          </div>
          <div class="table-section">
            <el-table
              :data="tableData"
              stripe
              height="100%"
              border
              style="width: 100%;"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column
                label="模板名称"
                prop="templateName"
                align="center"
              />
              <el-table-column
                label="生成用户"
                prop="createUser"
                align="center"
              />
              <el-table-column
                label="生成单位"
                prop="createCompany"
                align="center"
              />
              <el-table-column
                label="生成时间"
                prop="createTime"
                align="center"
              />
              <el-table-column
                label="模板类型"
                prop="templateState"
                align="center"
              />
              <el-table-column
                label="操作"
                align="center"
                width="300"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    icon="el-icon-info"
                    type="info"
                    size="small"
                    round
                    @click="onHandleView(scope.row)"
                  >详情</el-button>
                  <el-button
                    icon="el-icon-edit"
                    type="primary"
                    size="small"
                    round
                    @click="onHandleEdit(scope.row)"
                  >编辑</el-button>
                  <el-button
                    icon="el-icon-delete"
                    type="danger"
                    size="small"
                    round
                    @click="onHandleDeleteByRow(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
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
      </el-card>
    </div>
    <!-- 新增点选 -->
    <el-dialog title="新增预定模板" :visible.sync="dialogPointFormVisible" width="600px">
      <el-form ref="formPoint" :model="formPoint" :rules="pointRules">
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="formPoint.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="选择表" prop="table" :label-width="formLabelWidth">
          <el-select v-model="formPoint.table" placeholder="请选择活动区域" @change="pointTableFields">
            <el-option v-for="(item,index) of tableNames" :key="index" :label="item.tableName" :value="item.tableName" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择字段" prop="field" :label-width="formLabelWidth">
          <el-select v-model="formPoint.field" placeholder="请选择活动区域">
            <el-option v-for="(item,index) of fieldNames" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input
            v-model="formPoint.remarks"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPointFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm(1)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增sql -->
    <el-dialog title="新增预定模板" :visible.sync="dialogSqlFormVisible" width="600px">
      <el-form ref="formSql" :model="formSql" :rules="sqlRules">
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="formSql.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="sql语句" prop="sql" :label-width="formLabelWidth">
          <el-input
            v-model="formSql.sql"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input
            v-model="formSql.remarks"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSqlFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm(2)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog title="详情信息" :visible.sync="dialogTableVisible">
      <div>
        <div v-if="detailsInfo.templateState === 'table'" class="fields">
          <span class="title">表：</span>
          <div class="value">{{ detailsInfo.tableName }}</div>
        </div>
        <div v-if="detailsInfo.templateState === 'table'" class="fields">
          <span class="title">字段：</span>
          <div class="value">{{ detailsInfo.fieldName }}</div>
        </div>
        <div v-if="detailsInfo.templateState === 'sql'" class="fields">
          <span class="title">sql：</span>
          <div class="value">{{ detailsInfo.sqlValue }}</div>
        </div>
      </div>
      <el-table
        :data="detailsInfo.tableData"
        stripe
        height="100%"
        border
        style="width: 100%;"
      >
        <el-table-column v-for="(item,index) of detailsInfo.tableHeader" :key="index" :property="item.value" :label="item.label" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/DataPush'
export default {
  data() {
    return {
      dialogPointFormVisible: false,
      dialogSqlFormVisible: false,
      dialogTableVisible: false,
      formLabelWidth: '80px',
      form: {
        name: '',
        createTime: ''
      },
      formPoint: {
        name: '',
        table: '',
        field: '',
        remarks: ''
      },
      pointRules: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        table: [{ required: true, message: '请选择表', trigger: 'change' }],
        field: [{ required: true, message: '请选择字段', trigger: 'change' }]
      },
      formSql: {
        name: '',
        sql: '',
        remarks: ''
      },
      sqlRules: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        sql: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ]
      },
      tableData: [],
      // 分页
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      tableNames: [
        {
          tableName: 'table1',
          tableField: ['name', 'field1']
        },
        {
          tableName: 'table2',
          tableField: ['name', 'field2']
        }
      ],
      fieldNames: [],
      detailsInfo: {
        templateState: 'table',
        tableName: 't_user',
        fieldName: 'id,name,age',
        sqlValue: 'select id,name,age from user;',
        tableData: [
          { id: '1', name: '张三', age: '23' }
        ],
        tableHeader: [
          { value: 'id', label: 'id' },
          { value: 'name', label: 'name' },
          { value: 'age', label: 'age' }
        ]
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    returnPage() {
      this.$emit('funActive', 0)
    },
    addData(value) {
      if (value === 1) {
        this.dialogPointFormVisible = true
        this.$refs.formPoint.resetFields()
      } else {
        this.dialogSqlFormVisible = true
        this.$refs.formSql.resetFields()
      }
    },
    submitForm(value) {
      if (value === 1) {
        this.$refs.formPoint.validate((valid) => {
          if (valid) {
            this.dialogPointFormVisible = false
          }
        })
      } else {
        this.$refs.formSql.validate((valid) => {
          if (valid) {
            this.dialogSqlFormVisible = false
          }
        })
      }
    },
    deleteData() {},
    pointTableFields(value) {
      // 选择
      this.tableNames.forEach(item => {
        if (item.tableName === value) {
          this.fieldNames = [...item.tableField]
        }
      })
    },
    // 获取表格数据
    getTableData() {
      API.getDataTempllateTable().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.tableData = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 表格复选框
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getTableData()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getTableData()
    },
    onHandleView(row) {
      if (row.templateState === '表字段') {
        this.detailsInfo.templateState = 'table'
      } else {
        this.detailsInfo.templateState = 'sql'
      }
      this.dialogTableVisible = true
    },
    onHandleEdit(row) {},
    onHandleDeleteByRow(row) {}
  }
}
</script>

<style lang="scss" scoped>
.conT {
  height: 100%;
  .content {
    height: 100%;
    ::v-deep .el-card {
      height: 100%;
      margin-bottom: 30px;
      .el-card__body {
        height: 100%;
        .con {
          height: 100%;
          .table-section {
            height: calc(100% - 102px);
          }
          .pager-section {
            margin-top: 20px;
            text-align: right;
          }
        }
      }
    }
  }
  .fields{
    height: 40px;
    display: flex;
    margin-bottom: 10px;
    .title{
       display: inline-block;
    width: 44px;
    line-height: 40px;
    }
    .value{
      display: inline-block;
      height: 100%;
      border: 1px solid #EBEEF5;
      width: calc(100% - 44px);
      padding: 5px;
      overflow-y: auto;
    }
  }
}
</style>
