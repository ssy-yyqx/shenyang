<template>
  <div class="table-tab">
    <div id="TabContent" ref="TabContent" class="tab-list">
      <el-radio-group ref="tagList" v-model="radio" size="small" class="my-radio-box" :style="{width:boxWidth}" @change="radioChange">
        <el-radio-button
          v-for="item in tableList"
          :key="item.id"
          :label="item.tableName"
          class="top-radio-button"
        >
          {{ item.tableComment }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="tab-buttons">
      <el-button type="text" icon="el-icon-arrow-left" @click="onClickLeftArrow" />
      <el-button type="text" icon="el-icon-arrow-right" @click="onClickRightArrow" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tableList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      radio: '',
      boxWidth: ''
    }
  },
  watch: {
    
  },
  methods: {
    radioChange(val) {
      this.$emit('topRadioChange', val)
    },
    // 点击左箭头
    onClickLeftArrow() {
      const left = document.getElementById('TabContent').scrollLeft
      if (left !== 0) {
        if (left >= 80) {
          document.getElementById('TabContent').scrollLeft -= 80
        } else {
          document.getElementById('TabContent').scrollLeft -= 30
        }
      }
    },
    // 点击右箭头
    onClickRightArrow() {
      document.getElementById('TabContent').scrollLeft += 80
    }
  }
}
</script>
<style lang="scss" scoped>
.table-tab{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tab-list{
    width: calc(100% - 80px);
    height: 32px;
    overflow: hidden;
    .my-radio-box{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow-x: auto;
      overflow-y: hidden;
      // .el-radio-button{
      //   width: 165px;
      // }
      // .el-radio-button--small .el-radio-button__inner{
      //   overflow: hidden;
      //   text-overflow:ellipsis;
      //   white-space: nowrap;
      // }
      &::-webkit-scrollbar {
          display: none;
      }
    }
  }
  .tab-buttons{
    width: 50px;
    margin: 0 15px;
  }
}
</style>
