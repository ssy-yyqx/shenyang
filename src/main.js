import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import WebUploader from 'webuploader'
import uploader from 'vue-simple-uploader'

import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import Print from 'vue-print-nb'
import vRegion from 'v-region'

import { urls } from '@/utils/ipconfig'
import { createSocket } from '@/api/websocket'
createSocket(urls['wsUrl'])

import './font/iconfont.css'

import './font/font_style/iconfont.css'

//var Cesium = require('../static/Cesium/Cesium')
//Vue.prototype.Cesium = Cesium


// import jquery from 'jquery'

// 接收消息
const getsocketData = e => { // 创建接收消息函数
  const data = e && e.detail.data

  if (data != '收到消息，消息内容：ping' && data != '连接成功') {
    const newArr = JSON.parse(data)
    newArr.param = JSON.parse(newArr.param)
    ElementUI.Notification({
      dangerouslyUseHTMLString: true,
      title: newArr.title,
      message: newArr.description + '<p>有一条新消息产生，请前往消息中心<span style="color:#0066ff;cursor:pointer">查看</span></p>',
      type: 'warning',
      onClick: function () {
        router.push('/UserCentre/intelligent')
      }
    })
  }
}

// 注册监听事件
window.addEventListener('onmessageWS', getsocketData)

Vue.use(vRegion)
Vue.use(WebUploader)
Vue.use(uploader)
// Vue.use(jquery)

Vue.use(ElementUI, { locale, size: 'small' }, Print)



Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgWarning = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: 'warning'
  })
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg)
}
Vue.config.productionTip = false
const Base64 = require('js-base64').Base64
new Vue({
  el: '#app',
  router,
  store,
  Base64,
  render: h => h(App)
})
