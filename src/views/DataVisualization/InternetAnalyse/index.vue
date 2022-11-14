<template>
  <div class="content">
    
    <el-button type="primary" class="check" size="middle" @click="checkA">
      {{ action.button }}
    </el-button>
    <el-button type="primary" class="check now" @click="repetOpen">图谱重载</el-button>
    <Atlas v-if="!action.isMap" />
    <AtlasMap v-if="action.isMap" />
  </div>
</template>
<script>
import Atlas from './atlas'
import AtlasMap from './map'
import * as API from '@/api/index'
export default {
  components: { Atlas, AtlasMap },
  data() {
    return {
      action: {
        isMap: false,
        button: '地图'
      }
    }
  },
  methods: {
    checkA() {
      this.action.isMap = !this.action.isMap
      this.action.button = this.action.isMap ? '图谱' : '地图'
    },
    repetOpen(){
      const prams ={
        dbName:'ZZLL'
      }
      API.getGenDb(prams).then(res=>{
        const {code,data,msg}=res
        if(String(code)==='200'){
          this.$message.success(msg)
        }else{
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  width: 100%;
  height: 100%;
  position: relative;
  .check{
    padding: 8px 21px;
    z-index: 99;
    position: absolute;
    right: 32px;
    top: 94px;
    background: #1f7cd7;
  }
  .now{
    right:120px;
    padding: 9px 15px;
  }
}
</style>
