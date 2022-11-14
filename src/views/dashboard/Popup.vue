<template>
  <div class="popup-box">
    <el-tabs tab-position="left" style="width:100%">
      <el-tab-pane label="基础情况">
        <el-form :model="form">
          <el-form-item label="名称:">
            <span class="form-i">{{ form.name }}</span>
          </el-form-item>
          <el-form-item label="编码:">
            <span class="form-i">{{ form.code }}</span>
          </el-form-item>
          <el-form-item label="位置:">
            <span class="form-i">{{ form.posi }}</span>
          </el-form-item>
          <el-form-item label="电话:">
            <span class="form-i">{{ form.phone }}</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="装备情况">装备情况</el-tab-pane>
      <el-tab-pane label="部署情况">部署情况</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'Popup',
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          name: '联合参谋部',
          code: '001',
          posi: '沈阳市',
          phone: '123456789'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.popup-box{
  width: 350px;
  .form-i{
    padding: 5px 10px;
    border: 1px solid #E4E7ED;
    background: #F5F7FA;
    border-radius: 5px;
  }
}
</style>
