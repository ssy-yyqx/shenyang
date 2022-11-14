<template>
  <div v-if="tableData.length>0" class="content">
    
    <div
      v-for="(itemFirst,indexFirst) in tableData"
      :key="indexFirst"
      style="display: flex;"
    >
      <template v-if="indexFirst %2 !== 0">
        <div v-for="(item,indexs) in itemFirst" :key="indexs" class="allBgc">
          <div class="itemsName" :title="item.JGMC">
            {{ item.JGMC }}
          </div>
          <div class="ziduan" :title="item.SJZ">{{ item.SJZ }}</div>
        </div>
      </template>
      <template v-else>
        <div v-for="(items,indexs) in itemFirst" :key="indexs" class="situationItem">
          <div class="itemsName" :title="items.JGMC">
            {{ items.JGMC }}
          </div>
          <div class="ziduan" :title="items.SJZ">{{ items.SJZ }}</div>
        </div>
      </template>
    </div>
    <div class="img">
      <div v-if="dataImg.length>0">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="(item,index) in dataImg" :key="index">
            <img :src="item" style=" height: 650px;object-fit: cover;width:100% ">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div v-else>
        <el-empty :image-size="200" />
      </div>
    </div>
  </div>
  <div v-else>
    <el-empty description="暂无数据" />
  </div>
</template>
<script>
import * as API from '@/api/index'
export default {
  props: {
    zhuangbeiData: {
      type: Object,
      default: {}
    },
    equipmentCode: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      activeName: 'second',
      tableData: [],
      dataImg: []
    }
  },
  watch: {
    zhuangbeiData: {
      handler(val) {
        this.equipDetail()
      },
      deep: true

    }
  },
  mounted() {
    this.equipDetail()
  },
  methods: {
    // 用来分割数组  每4个为一组
    group(array, subGroupLength) {
      if (array && array.length) {
        let index = 0
        const newArray = []
        while (index < array.length) {
        // slice(start,end) 从index下标开始   不包括结尾
          newArray.push(array.slice(index, index += subGroupLength))
        }
        return newArray
      }
    },
    getFirstNode(tree) {
      for (let i = 0; i < tree.length; i++) {
        var el = tree[i]
        if (el.childList && el.childList.length > 0) {
          this.getFirstNode(el.childList)
          break
        } else {
          this.firstObj = el
          break
        }
      }
      return this.firstObj
    },
    equipDetail() {
      const data = {
        equipmentCode: this.zhuangbeiData.code || this.equipmentCode
      }
      API.equipDetail(data).then(res => {
        if(res.data.equipmentPerformance.length && res.data.equipmentPerformance.length>0 || res.data.equipmentMedia.length && res.data.equipmentMedia.length>0 ){
          this.tableData = this.group(res.data.equipmentPerformance,4)
          this.dataImg = res.data.equipmentMedia
        }else{
          this.tableData = []
           this.dataImg = []
        }
        
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
    width: 98.5%;
    background: #fff;
    border-radius: 10px;
    margin: 0px 0 12px 20px;
    padding:10px 10px 25px 10px;
    padding:30px 10px;
    overflow-y:scroll;
    height: calc(100vh - 169px);

}
.img{
  margin:20px 10px;
  img{
    object-fit: cover
  }
  img:nth-child(2n-1){
    margin-right: 1%;
  }

}
.content-row{
padding:10px
}
.box-card{
  margin-top: 20px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  .el-card__body{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
}
.red{
  color: rgb(31,125,215)
}
.allBgc {
  width: 23%;
  height: 40px;
  line-height: 40px;
  margin-left: 18px;
  margin-bottom: 8px;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  background: rgba(31, 125, 215, 0.14);
  .itemsName{
    width: 17%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }
  .ziduan{
    width: 77%;height: 31px;line-height: 31px;margin-top: 4px;margin-right: 10px;
    background-color: #1f7dd72b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size:16px;
    text-indent:10px;
  }
}
.situationItem {
  width: 23%;
  height: 40px;
  line-height: 40px;
  background: #f0f2f7;
  margin-left: 18px;
  margin-bottom: 8px;
  padding-left: 10px;
  // padding-right: 15px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  .itemsName{
    width: 17%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }
  .ziduan{
    width: 77%;height: 31px;line-height: 31px;margin-top: 4px;margin-right: 10px;
    background: #dcdee399;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size:16px;
    text-indent:10px;
  }
}
</style>
