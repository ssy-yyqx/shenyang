<template>
    <div 
      style="width: 100%;height: 100%;" 
      v-loading="loading" 
      element-loading-text="正在加载中..." 
      element-loading-background="rgba(255, 255, 255, 0.001)"
    >
    </div>
</template>

<script>
import * as API from "@/api/index";
export default {
  name: 'validateToken',
  data() {
    return {
      loading:true
    }
  },
  created(){
    console.log(window.location.href)
    const obj = window.location.href.split('=')[1]
    console.log(obj)
    this.validateToken(obj)
    
  },
  methods: {
      validateToken(val){
      const token = val
      const that = this
      API.validateToken({},token).then(res=>{
        if(res.code==='1'){
            const routeData = this.$router.resolve({
              path: `/`
            })
            window.open(routeData.href, '_self')
            this.loading = false
        }else{
            this.$message.error('认证失败')
            return
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
