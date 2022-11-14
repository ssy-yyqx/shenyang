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
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.main-section {
  width: 100%;
  background-color: #fff;
  box-shadow: #dddddd9e 0px 0px 22px;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
}
</style>
