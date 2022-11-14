<template>
  <div class="main-sections" :class="ownClass">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    ownClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.main-sections {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 23px;
  height: calc(100vh - 42px);
  padding-top: 73px;
  position: absolute;
  z-index: 1;
}
</style>
