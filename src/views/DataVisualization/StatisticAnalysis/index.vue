<template>
  <Container>
    <div class="container-section">
      <el-radio-group v-model="radio1" style="line-height:50px;margin-left:2px;" @change="treeRadioChange">
        <el-radio-button
          v-for="item in radioList"
          :key="item.label"
          :label="item.label"
        />
      </el-radio-group>
    </div>
    <!-- 主体部分 -->
    <div class="container-section__main">
      <Combat v-if="selectTitle == '战备工程信息统计'" ref="Combat" :force-code="forceCodes" @gcflnm="gcflnmChange" />
      <People v-if="selectTitle == '作战力量信息统计'" ref="People" />
      <CustomizeStatistic v-if="selectTitle == '自定义信息统计'" ref="CustomizeStatistic" />
    </div>
  </Container>
</template>
<script>
import Container from '@/components/Container'
// import * as API from '@/api/index'
import People from './model/people.vue'
import Combat from './model/combat.vue'
import CustomizeStatistic from './model/customizeStatistic/index.vue'

export default {
  components: { Container, People, Combat, CustomizeStatistic },
  data() {
    return {
      radio1: '',
      selectTitle: '作战力量信息统计',
      radioList: [
        {
          value: '1',
          label: '作战力量信息统计'
        },
        {
          value: '2',
          label: '战备工程信息统计'
        },
        {
          value: '3',
          label: '自定义信息统计'
        }
      ],
      forceCodes: '',
      gcflnm: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    this.radio1 = this.radioList[0].label
  },
  methods: {
    gcflnmChange(val) {
      this.gcflnm = val
    },
    // tabs切换事件
    treeRadioChange() {
      this.selectTitle = this.radio1
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-radio-button__orig-radio:checked+.el-radio-button__inner,
>>> .el-button--primary{
  background-color: #1f7cd7;
}
  .container-section{
    width: 100%;
    height:50px;
    background-color:white;
    border-radius:3px;
    &__main{
      height: calc(100% - 60px);
    }
  }
</style>
