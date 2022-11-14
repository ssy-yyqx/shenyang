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
    background: #E7E9EF;
    height: calc(100vh);
    padding: 10px 0px;
  }
</style>
