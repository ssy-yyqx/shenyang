<template>
  <div class="font">
    <!-- <el-divider content-position="left">{{ title }}</el-divider> -->
    <div class="title">{{ info.label }}</div>
    <div><el-input
      v-model="infoC[info.value]"
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
    /> </div>
  </div>
</template>
<script>
export default {
  props: ['info'],
  data() {
    return {
      infoC: {}
    }
  }
}
</script>
<style lang="scss" scoped>
.font{
  .el-divider__text, .el-link{
    font-size: 20px;
  }
  .title{
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
  }
}
</style>
