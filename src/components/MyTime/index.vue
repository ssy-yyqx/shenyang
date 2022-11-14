<template>
  <div class="date-info">
    {{ time }}
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      time: '',
      timeInterval: null
    }
  },
  created() {
    this.updateTime()
  },
  methods: {
    updateTime() {
      const _this = this
      this.timeInterval = setInterval(function() {
        _this.time = moment().format('HH:mm:ss')
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.date-info {
    color:#000;
    font-size:27px;
}
</style>
