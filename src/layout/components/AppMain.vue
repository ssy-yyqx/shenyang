<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #e4e6ec;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

