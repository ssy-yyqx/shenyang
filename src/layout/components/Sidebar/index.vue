<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-menu
      :default-active="activeMenu"
      :collapse="false"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="true"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
    >
      <!-- <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" /> -->
      <el-menu-item v-for="route in routes" :key="route.path" :index="route.name" @click="toSomePath(route.name)">
        <img :src="require(`@/icons/newImages/menuIcon/${route.meta.icon}.png`)" class="el-icon-document" style="width:17px">
        <span slot="title">{{ route.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
 import variables from '@/styles/variables.scss'

export default {
  components: { Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      const routerFather = this.$router.options.routes.find((item) => {
        return this.$route.matched[0].name === item.name
      })
      return routerFather.children
    },
    activeMenu() {
      return this.$route.name
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    toSomePath(name) {
      this.$router.push({ name: name })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep  .is-checked{
  background-color: #ff0000
}
</style>
