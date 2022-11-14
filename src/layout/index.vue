<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <div :class="{'fixed-header':fixedHeader}">
      <navbar />
    </div>
    <div class="main-container">
      <sidebar v-if="issidebar" class="sidebar-container" :class="isShow" />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import bus from '@/utils/bus'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      issidebar: true
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    isShow() {
      const routerList = []
      this.$router.options.routes.forEach(element => {
        if (element.children) {
          routerList.push(element)
        }
      })
      return this.$route.name === 'Dashboard' || this.$route.name === 'WorkMap' ? 'sidebar-container-none' : ''
    }
  },
  beforeRouteLeave(to, from, next) { // 离开组件的时候触发
    this.issidebar = true
    next()
  },
  mounted() {
    this.issidebar = true
    bus.$on('QUNPING', (val) => {
      console.log(val)
      this.issidebar = val
    })
  },
  methods: {
    // handleClickOutside() {
    //   this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    // }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    min-width: 1400px;
    overflow: auto;
    // &.mobile.openSidebar{
    //   position: fixed;
    //   top: 0;
    // }
  }
  // .drawer-bg {
  //   background: #000;
  //   opacity: 0.3;
  //   width: 100%;
  //   top: 0;
  //   height: 100%;
  //   position: absolute;
  //   z-index: 999;
  // }

  .fixed-header {
    width: 100%;
  }

  .main-container{
    display: flex;
    height: calc(100% - 42px);
    .sidebar-container-none{
      display: none;
    }
  }

</style>
