<template>
  <div class="navbar">
    <Mytime class="my-time" />

    <div class="my-menu">
      <div v-for="route in routes" :key="route.path" class="menu-item" :class="getActiveClass(route)" @click="toFirstMenu(route)">
        <span class="item-span">
          {{ route.meta.title }}
        </span>
      </div>

    </div>
    <div style="position: absolute;right: 50px;top: 78px;white-space: nowrap;">
      <el-radio ref="radio1" v-model="radio" label="日常" @change="changeradio">日常</el-radio>
      <el-radio ref="radio2" v-model="radio" label="重大突发事件" @change="changeradio">重大突发事件</el-radio>
      <el-radio ref="radio3" v-model="radio" label="战时" @change="changeradio">战时</el-radio>
    </div>
    <div class="proName">
      {{ title }}
    </div>

    <img :src="headerImg" class="header-bg">

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click" @command="clickBadge">
        <div class="avatar-wrapper">
          <el-avatar size="medium" :src="avatar1" class="user-avatar" />
          <el-badge v-if="isShow !== '采集任务'" is-dot class="item elBadge" />
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/UserCentre/intelligent">
              <el-dropdown-item>
                智能推送
              </el-dropdown-item>
            </router-link>
            <router-link to="/UserCentre/gather">
              <el-dropdown-item command="采集任务">
                采集任务<el-badge v-if="isShow !== '采集任务'" class="mark" :max="99" :value="valueBadge" />
              </el-dropdown-item>
            </router-link>
          <!-- <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item> -->
          </el-dropdown-menu>
        </div>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
import * as API from '@/api/index'
import { mapGetters } from 'vuex'
import Mytime from '@/components/MyTime'
// import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Mytime
  },
  data() {
    return {
      valueBadge: '', // 数字
      isShow: '',
      isavatarShow: '',
      radio: '',
      headerImg: require('@/icons/newImages/headerbg.png'),
      avatar1: require('@/icons/newImages/avatar1.png')
    }
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    title() {
      return this.$store.state.settings.title
    },
    routes() {
      const routerList = []
      this.$router.options.routes.forEach(element => {
        if (element.children) {
          routerList.push(element)
        }
      })
      return routerList
    }
  },
  mounted() {
    this.getStatus()
    // this.$refs.radio1.$el.childNodes[0].childNodes[0].style = 'background:#09960980;'
  },
  created() {
    this.getBadge()
    console.log(window.location.href)
  },
  methods: {
    getStatus() {
      API.getStatus().then(res => {
        console.log(res)
        if (res.code === 200) {
          if (res.msg === '0') {
            this.radio = '日常'
          } else if (res.msg === '1') {
            this.radio = '重大突发事件'
          } else if (res.msg === '2') {
            this.radio = '战时'
          }
          console.log(this.radio)
          if (this.radio === '日常') {
            this.$refs.radio1.$el.childNodes[0].childNodes[0].style = 'background:#09960980;'
            this.$refs.radio2.$el.childNodes[0].childNodes[0].style = 'background:#fff'
            this.$refs.radio3.$el.childNodes[0].childNodes[0].style = 'background:#fff'
          } else if (this.radio === '重大突发事件') {
            this.$refs.radio2.$el.childNodes[0].childNodes[0].style = 'background:#e2a0288c;'
            this.$refs.radio1.$el.childNodes[0].childNodes[0].style = 'background:#fff'
            this.$refs.radio3.$el.childNodes[0].childNodes[0].style = 'background:#fff'
          } else if (this.radio === '战时') {
            this.$refs.radio3.$el.childNodes[0].childNodes[0].style = 'background:#e01a1ac4;'
            this.$refs.radio1.$el.childNodes[0].childNodes[0].style = 'background:#fff'
            this.$refs.radio2.$el.childNodes[0].childNodes[0].style = 'background:#fff'
          }
        }
      })
    },
    clickBadge(e) {
      this.isShow = e
    },
    getBadge() {
      const props = {
        pageNum: 1,
        pageSize: 10000,
        sortColumnMap: {},
        isConfirm: '0'
      }
      API.getCollectTask(props).then(res => {
        console.log(res)
        this.valueBadge = res.data.total
        if (res.data.total === 0) {
          this.isShow = '采集任务'
        }
      })
    },

    changeradio(e) {
      // console.log(this.$refs.radio1.$el.childNodes[1])

      if (e === '日常') {
        this.$refs.radio1.$el.childNodes[0].childNodes[0].style = 'background:#09960980;'
        this.$refs.radio2.$el.childNodes[0].childNodes[0].style = 'background:#fff'
        this.$refs.radio3.$el.childNodes[0].childNodes[0].style = 'background:#fff'
        this.getUpdate('0')
      } else if (e === '重大突发事件') {
        this.$refs.radio2.$el.childNodes[0].childNodes[0].style = 'background:#e2a0288c;'
        this.$refs.radio1.$el.childNodes[0].childNodes[0].style = 'background:#fff'
        this.$refs.radio3.$el.childNodes[0].childNodes[0].style = 'background:#fff'
        this.getUpdate('1')
      } else if (e === '战时') {
        this.$refs.radio3.$el.childNodes[0].childNodes[0].style = 'background:#e01a1ac4;'
        this.$refs.radio1.$el.childNodes[0].childNodes[0].style = 'background:#fff'
        this.$refs.radio2.$el.childNodes[0].childNodes[0].style = 'background:#fff'
        this.getUpdate('2')
      }
    },
    getUpdate(dataValue) {
      const data = {
        systemStatus: dataValue
      }
      API.getInfoUpdate(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    toFirstMenu(item) {
      this.$router.push(item.redirect)
    },
    getActiveClass(item) {
      return this.$route.path.indexOf(item.name) > -1 ? 'active-item' : ''
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-radio{
    margin-right: 0px;
    width: 26.9%;
    height: 18px;
    line-height: 18px;
}

>>> .el-radio__inner{
    border-color: #fff !important;
}

>>> .el-radio__label{
  padding-left: 4px;
}
>>> .el-radio__label:hover{
  color:#409EFF !important;
}
>>> .el-radio:nth-last-child(2){
   width: 55%;
    height: 18px;
    line-height: 18px;;
}
.navbar {
  height: 42px;
  position: relative;
  z-index: 9;
  // background: #F5F6FA;
  // box-shadow: 0 1px 1px rgba(0,21,41,.08);
  .header-bg{
    display:inline-block;
    width: 100%;
    height: 100px;
  }
  .my-time{
    width: 116px;
    position: absolute;
    right: 140px;
    top: 46px;
  }
  .my-menu{
    width: 54%;
    height: 50px;
    position: absolute;
    top: 45px;
    left: 30%;
    transform:skew(-42deg);
    padding: 5px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .menu-item{
      border: 1px solid #d0d6d9;
      border-top-right-radius: 13px;
      border-bottom-left-radius: 17px;
      width: 9%;
      height: 44px;
      line-height: 44px;
      cursor: pointer;
      background:
      linear-gradient(0deg, transparent 0, #F7F9FA 0)
      top left,
      linear-gradient(-140deg, transparent 5px, #F7F9FA 0)
      top right,
      linear-gradient(0deg, transparent 0, #F7F9FA 0)
      bottom right,
      linear-gradient(30deg, transparent 5px, #F7F9FA 0)
      bottom left;
      background-size: 70% 70%;
      background-repeat: no-repeat;
      text-align: center;
      color: #555555;
      &:hover{
        color:#1F7CD7 ;
      }
      .item-span{
        display: inline-block;
        font-size: 13px;
        font-weight: 400;
        transform:skew(42deg);
      }
    }
    .active-item{
      background:
      linear-gradient(0deg, transparent 0, #1F7CD7 0)
      top left,
      linear-gradient(-140deg, transparent 5px, #1F7CD7 0)
      top right,
      linear-gradient(0deg, transparent 0, #1F7CD7 0)
      bottom right,
      linear-gradient(30deg, transparent 5px, #1F7CD7 0)
      bottom left;
      background-size: 70% 70%;
      background-repeat: no-repeat;
      color: #fff !important;
      .item-span{
        font-weight: bold;
      }
      border: 1px solid #1F7CD7;
      border-top-right-radius: 13px;
      border-bottom-left-radius: 17px;
    }

  }
  .proName{
    position: absolute;
    left: 3%;
    top: 33px;
    width: 28%;
    height: 50px;
    text-align: center;
    font-size: 28px;
    font-weight: bolder;
    color: #fff;
    z-index: 666;
  }
  /* .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  } */

  /* .breadcrumb-container {
    float: left;
  } */
  >>> .el-badge__content.is-fixed.is-dot{
    right: 5px;
    top: 4px;
  }
  .right-menu {
    width: 92px;
    position: absolute;
    right: 10px;
    top: 47px;
    // height: 50px;
    // line-height: 50px;
    &:focus {
      outline: none;
    }

    .avatar-container {
      width: 100%;
      .avatar-wrapper {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .elBadge{
          position:absolute;
          top:0px;
          right:60px;
        }
        .user-avatar {
          width: 30px;
          height: 30px;
        }
        .user-name{
          display: block;
          color: #000;
          font-size: 14px;
          width: 55px;
          text-align: center;
          text-overflow:ellipsis;
          overflow:hidden;
          white-space:nowrap;
        }
        .el-icon-arrow-down {
          margin: 0 10px;
          font-size: 12px;
        }
      }
    }
  }
  .right-divider {

    position: absolute;
    top: 42px;
    right: 126px;
    height: 50px;
    display: block;
    width: 1px;
    margin: 8px 8px;
    margin-bottom: 0;
    height: 25px;
    background: #dcdfe6;
  }
  .right-items{
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    margin: 0 10px;
    .el-button{
      padding: 4px;
      background: #EAEBEF;
      color: #C8C8C8;
      border-color: #EAEBEF;
      font-size: 18px;
      &:focus {
        outline: none;
      }
      &:hover{
        color: #FFF;
        background-color: #909399;
        border-color: #909399;
      }
    }
  }
}
</style>
