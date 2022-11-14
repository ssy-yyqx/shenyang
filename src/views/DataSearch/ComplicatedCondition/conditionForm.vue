<template>
  <el-form :model="form" label-width="100px" :disabled="isDisabled">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="工程名称">
          <el-input v-model="form.bdInnerCode" autocomplete="off" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="工程编码">
          <el-input v-model="form.bdSeperateCode" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="位置">
          <el-input v-model="form.bdNo" autocomplete="off" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="经纬度">
          <el-input v-model="form.bdName" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="工程级别">
          <el-select v-model="form.bdLevel" placeholder="请选择">
            <el-option label="1级" value="shanghai" />
            <el-option label="2级" value="beijing" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input
            v-model="form.bdNumber"
            autocomplete="off"
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { FORM_TYPE } from "@/common/dict";
export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: String,
      default: FORM_TYPE.ADD,
    },
  },
  data() {
    return {};
  },
  computed: {
    isDisabled() {
      return this.type === FORM_TYPE.DETAIL;
    },
  },
};
</script>

<style>
</style>
