<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="form.title" :disabled="type === 'view'" />
    </el-form-item>
    <el-form-item label="sql:">
      <el-input
        v-model="form.sql"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
        :disabled="type === 'view'"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        sql: '',
        title: ''
      }
    }
  },
  watch: {
    chartData: {
      handler(val) {
        this.form = {
          sql: val.dynamicSql,
          title: val.title
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 获取图表sql数据 --- 父组件调用
    getData() {
      return this.form
    }
  }
}
</script>

<style>

</style>
