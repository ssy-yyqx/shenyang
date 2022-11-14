<template>
  <div class="main-section" :class="ownClass">
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
  .main-section{
    // padding: 12px;
    // padding-top: 60px;
    background: #E7E9EF;
    height: calc(100vh - 164px);
    // height: calc(100vh - 42px);
    // padding-top: 73px;
  }
</style>
