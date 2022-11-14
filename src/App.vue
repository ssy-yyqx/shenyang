<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
  
}
</script>

<style lang="scss">

.el-upload-list__item .el-icon-close-tip{
  display: none !important;
}
.popover {
  position: absolute !important;
  top: 115px !important;
  left: 442px !important;
  .popper__arrow {
    top: 52.5px !important;
  }
}
.zdy-table .el-tabs__item {
  height: 30px !important;
  line-height: 30px !important;
}
.zdy-table .el-tabs__header {
  margin-bottom: 5px !important;
}
.el-form--label-top .el-form-item__label {
  padding-bottom: 0px !important;
}
.el-select-dropdown__list{
  padding: 6px 10px !important;
}
.qiehuanBtn .el-radio-button .el-radio-button__inner{
  width: 160px !important;
}
.box-card{

.el-card__body{
  white-space:nowrap !important;
   overflow:hidden !important;
   text-overflow:ellipsis !important;
}
}
</style>
