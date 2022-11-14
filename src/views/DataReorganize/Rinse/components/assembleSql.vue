<template>
  <div class="aSql">
    <div>
      <el-form ref="ruleForm" :model="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-table
          :data="ruleForm.sqlRelation"
          :border="true"
          style="width: 99.99%;"
          height="200"
        >
          <el-table-column type="index" label="序号" width="100" />
          <el-table-column prop="fieldName" label="字段名称">
            <template slot-scope="scope">
              <el-form-item label="" :prop="'sqlRelation.'+scope.$index+'.fieldName'" :rules="rules.fieldName">
                <el-select v-model="scope.row.fieldName" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in fields"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="condition" label="条件">
            <template slot-scope="scope">
              <el-form-item label="" :prop="'sqlRelation.'+scope.$index+'.condition'" :rules="rules.condition">
                <el-select v-model="scope.row.condition" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in conditions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

            </template>
          </el-table-column>
          <el-table-column prop="data" label="数据">
            <template slot-scope="scope">
              <el-form-item label="" :prop="'sqlRelation.'+scope.$index+'.data'" :rules="rules.data">
                <el-input
                  v-model="scope.row.data"
                  autocomplete="off"
                  size="small"
                  placeholder="请输入数据"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="relationship" label="关系">
            <template slot-scope="scope">
              <el-form-item label="" :prop="'sqlRelation.'+scope.$index+'.relationship'" :rules="rules.relationship">
                <el-select v-model="scope.row.relationship" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in relationships"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                plain
                @click="delmembers(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div class="operator">
      <el-button type="success" @click="addmembers">添加</el-button>
      <el-button type="primary" @click="submitSql">确定</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['fields'],
  data() {
    return {
      ruleForm: {
        sqlRelation: [
          {
            id: 1,
            fieldName: '',
            condition: '',
            data: '',
            relationship: ''
          }
        ]
      },
      conditions: [
        { label: '包含', value: '1' },
        { label: '不包含', value: '2' },
        { label: '>', value: '3' },
        { label: '<', value: '4' },
        { label: '=', value: '5' },
        { label: '>=', value: '6' },
        { label: '<=', value: '7' }
      ],
      relationships: [
        { label: 'and', value: 'and' },
        { label: 'or', value: 'or' }
      ],
      rules: {
        fieldName: [{ required: true, message: '请选择字段', trigger: 'change' }],
        condition: [{ required: true, message: '请选择条件', trigger: 'change' }],
        data: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        relationship: [{ required: true, message: '请选择关系', trigger: 'change' }]
      },
      ids: [1]
    }
  },
  methods: {
    submitSql() {
      if (this.ruleForm.sqlRelation.length <= 0) {
        this.$message.warning('请添加内容')
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('sqlRelationSubmit', this.ruleForm.sqlRelation)
        }
      })
    },
    reset() {
      this.ruleForm.sqlRelation = []
    },
    addmembers() {
      const id = Math.max(...this.ids) + 1
      this.ids.push(id)
      this.ruleForm.sqlRelation.push({
        id: id,
        fieldName: '',
        condition: '',
        data: '',
        relationship: ''
      })
    },
    delmembers(index, row) {
      var that = this
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 点击确定的操作(调用接口)
          var hasmembers = that.ruleForm.sqlRelation
          that.ruleForm.sqlRelation = hasmembers.filter(item => item.id !== row.id)
          that.ids = that.ids.filter(item => item !== row.id)
          that.$refs.ruleForm.resetFields()
        })
        .catch(() => {
          // 点取消的提示
          return
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.aSql {
  .operator{
    margin-top: 10px;
    float: right;
  }
}
</style>
