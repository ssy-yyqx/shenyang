<template>
  <div class="main-section3" :class="ownClass">
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
.main-section3{
    padding: 20px;
    // padding-top: 62px;
    background: #fff;
    // height: 280px;
    // height: calc(100% / 2 - 20px);
    // width: 1052px;
    // margin-bottom: 50px;
    margin-top: 12px;
    border-radius: 10px;
  }
  .main-section3:nth-child(1){
    margin-top: 0px;
  }
</style>
