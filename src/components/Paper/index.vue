<template>
  <div class="c-paper">
    <div v-if="hasHeader" class="c-paper-header">
      <slot name="header"/>
    </div>
    <div class="c-paper-content">
      <slot name="content"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hasHeader: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.c-paper {
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
  &-header {
    padding: 1px 0 15px 0;
    font-size: 16px;
    font-weight: bold;
    color: #2E68EA;
  }
  &-content {
    height: calc(100% - 40px);
  }
}
</style>
