<template>
  <div class="main-section4" :class="ownClass">
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
  .main-section4{
    padding: 20px;
    // padding-top: 62px;
    background: #fff;
    height : 100%;
    overflow-y: scroll;
    // width: 500px;
    border-radius: 15px;
    // margin-top: 20px;
  }
</style>
