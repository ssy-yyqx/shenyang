<template>
  <div class="main">
    <div class="content">
      <ContainerSix class="ContainerSix">
        <p class="top">基本信息</p>
        <div v-for="(item,index) in allDataList" :key="index" class="bottom">
          <p>名称：{{ item.ZBGCMC?item.ZBGCMC:'暂无' }}</p>
          <p>代号：{{ item.ZBGCDH?item.ZBGCDH:'暂无' }}</p>
          <p>工程分类：{{ item.GCFLNM?item.GCFLNM:'暂无' }}</p>
          <p>竣工时间：{{ item.JGSJ?item.JGSJ:'暂无' }}</p>
          <p>保护区：{{ item.BHQNM?item.BHQNM:'暂无' }}</p>
          <p v-if="item.ZBGCMC&&item.DMNM&&item.KZDM">位置：{{ item.SZFHZRQ }}{{ item.DMNM }}{{ item.KZDM }}</p>
          <p>经度：{{ item.JD?item.JD:'暂无' }}</p>
          <p>纬度：{{ item.WD?item.WD:'暂无' }}</p>
          <p>高程：{{ item.GC?item.GC:'暂无' }}</p>
          <p>防卫部队名称：{{ item.FWBDNM?item.FWBDNM:'暂无' }}</p>
          <p>防卫部队类别：{{ item.FWLBNM?item.FWLBNM:'暂无' }}</p>
          <p>防卫人数：{{ item.RYS?item.RYS:'暂无' }}</p>
        </div>
      </ContainerSix>
      <ContainerSix v-for="(item,index) in allDataList" :key="'index1-'+index" class="ContainerSix">
        <p class="top">所在防护责任区</p>
        <div class="bottom">{{ item.SZFHZRQ?item.SZFHZRQ:'暂无' }}</div>
      </ContainerSix>
      <ContainerSix v-for="(item,index) in allDataList" :key="'index2-'+index" class="ContainerSix">
        <p class="top">质量描述</p>
        <div class="bottom">{{ item.ZLMS?item.ZLMS:'暂无' }}</div>
      </ContainerSix>
      <ContainerSix v-for="(item,index) in allDataList" :key="'index3-'+index" class="ContainerSix">
        <p class="top">简述</p>
        <div class="bottom">{{ item.JS?item.JS:'暂无' }}</div>
      </ContainerSix>
      <ContainerSix class="ContainerSix">
        <div ref="yy" class="bottom1">
          <div v-if="flmc == '机场工程（含公路跑道）'">
            <div class="qq">
              <p
                v-for="(item,index) in special[0]"
                :key="'index4-'+index"
              >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
            </div>
          </div>

          <div v-else-if="flmc == '通信工程（台站）'">
            <div class="qq">
              <p
                v-for="(item,index) in special[0]"
                :key="'index4-'+index"
              >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
            </div>
          </div>

          <div v-else-if="flmc == '仓库工程'">
            <div class="qq">
              <p
                v-for="(item,index) in special[0]"
                :key="'index4-'+index"
              >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
            </div>
          </div>

          <div v-else class="qq">
            <p
              v-for="(item,index) in dataList"
              :key="index"
            >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
          </div>
        </div>
      </ContainerSix>

      <div v-if="flmc == '机场工程（含公路跑道）'">
        <ContainerSix class="ContainerSix">
          <p class="top">适用机型</p>
          <div class="bottom">
            <p
              v-for="(item,index) in special[1]"
              :key="'index5-'+index"
              style="font-weight: normal;width: 25%;font-size:12px; height: 40px;line-height: 40px;"
            >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
          </div>
        </ContainerSix>
        <ContainerSix class="ContainerSix">
          <p class="top">保障能力</p>
          <div class="bottom">
            <p
              v-for="(item,index) in special[2]"
              :key="'index6-'+index"
              style="font-weight: normal;width: 25%;font-size:12px; height: 40px;line-height: 40px;"
            >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
          </div>
        </ContainerSix>
        <ContainerSix class="ContainerSix">
          <p class="top">道坪信息</p>
          <div class="bottom">
            <p
              v-for="(item,index) in special[3]"
              :key="'index7-'+index"
              style="font-weight: normal;width: 25%;font-size:12px; height: 40px;line-height: 40px;"
            >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
          </div>
        </ContainerSix>
        <ContainerSix class="ContainerSix">
          <p class="top">洞库容量</p>
          <div class="bottom">
            <p
              v-for="(item,index) in special[4]"
              :key="'index8-'+index"
              style="font-weight: normal;width: 25%;font-size:12px; height: 40px;line-height: 40px;"
            >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
          </div>
        </ContainerSix>
      </div>

      <div v-else-if="flmc == '通信工程（台站）'">
        <ContainerSix v-if="special[1] && special[1].length>0" class="ContainerSix">
          <p class="top">保障能力</p>
          <div class="bottom">
            <p
              v-for="(item,index) in special[1]"
              :key="'index5-'+index"
              style="font-weight: normal;width: 25%;font-size:12px; height: 40px;line-height: 40px;"
            >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
          </div>
        </ContainerSix>

        <ContainerSix v-if="special[2] && special[2].length>0" class="ContainerSix">
          <p class="top">光缆铺设情况</p>
          <div class="bottom">
            <p
              v-for="(item,index) in special[2]"
              :key="'index6-'+index"
              style="font-weight: normal;width: 25%;font-size:12px; height: 40px;line-height: 40px;"
            >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
          </div>
        </ContainerSix>
      </div>

      <div v-else-if="flmc == '仓库工程'">
        <ContainerSix class="ContainerSix">
          <p class="top">储藏能力</p>
          <div class="bottom">
            <p
              v-for="(item,index) in special[1]"
              :key="'index5-'+index"
              style="font-weight: normal;width: 25%;font-size:12px; height: 40px;line-height: 40px;"
            >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
          </div>
        </ContainerSix>
        <ContainerSix class="ContainerSix">
          <p class="top">管道输送能力</p>
          <div class="bottom">
            <p
              v-for="(item,index) in special[2]"
              :key="'index6-'+index"
              style="font-weight: normal;width: 25%;font-size:12px; height: 40px;line-height: 40px;"
            >{{ item.key }}：{{ item.value?item.value:'暂无' }}</p>
          </div>
        </ContainerSix>
      </div>
    </div>
  </div>
</template>

<script>
import ContainerSix from '@/components/ContainerSix'
import * as API from '@/api/index'
export default {
  components: { ContainerSix },
  data() {
    return {
      gcflnm: '', // 工程分类内码
      zbgcnm: '', // 战备工程内码
      flmc: '', // 防类名称   用来区分机场、通信、仓库表
      allDataList: [], // 数据列表
      dataList: [], // 截取后的数组
      special: []
    }
  },
  created() {
    this.gcflnm = this.$route.query.gcflnm
    this.zbgcnm = this.$route.query.zbgcnm
    this.flmc = this.$route.query.flmc
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const params = {
        gcflnm: this.gcflnm,
        zbgcnm: this.zbgcnm
      }

      API.getDetail(params).then(res => {
        if (res.code === 200) {
          let list = []
          this.allDataList = res.data[0]
          list = res.data.slice(1)
          list.forEach(i => {
            i.forEach(item => {
              this.dataList.push(item)
            })
          })
          if (this.dataList.length === 0) {
            this.$refs.yy.style.padding = '0px'
            this.$refs.yy.style.height = '0px'
          }

          this.special = list
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 17px #ffffff;
  background-color: #ccc;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: #fff;
  background-image: -webkit-linear-gradient(
    90deg,
    #eee 0%,
    #eee 25%,
    transparent 100%,
    #eee 75%,
    transparent
  );
}

.main {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  padding-top: 22px;
  background-color: #e7e9ef;
  .content {
    width: 67%;
    margin: 0 auto;
    overflow: scroll;
    overflow-x: hidden;
    height: 100%;
    .ContainerSix {
      margin-bottom: 28px;
      .top {
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        padding-left: 24px;
        border-bottom: 1px solid #e6e6e6;
      }
      .bottom {
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        padding: 10px 0 10px 40px;
        p {
          width: 25%;
          height: 40px;
          line-height: 40px;
          font-size: 12px;
        }
      }
      .bottom1 {
        padding: 10px 0 10px 40px;
        // height: 300px;
        // overflow: scroll;
        // overflow-x: hidden;
        .qq {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          p {
            width: 25%;
            height: 40px;
            line-height: 40px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
