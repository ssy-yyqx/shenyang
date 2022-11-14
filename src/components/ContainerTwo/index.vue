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
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 8px;
    background: #FFF;
  }
</style>
