<template>
  <div class="list">
    <div v-for="(item, index) in tableData" :key="index" class="list_view">
      <h3>{{ item.DYXTJGNM }}</h3>
      <div>{{ item.JS }}</div>
      <div
        v-for="(itemMT, indexMT) in tableTemporaryData[index]"
        :key="indexMT"
      >
        <div class="list_img">
          <div v-if="itemMT.MTLXNM == '图像媒体'">
            <el-image :src="itemMT.WJM"></el-image>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as APIclass from "@/api/classification";
export default {
  name: "listView",
  props: {
    propsDangerous: {
      type: String,
      default: "",
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    topicTable: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableTemporaryData: [],
    };
  },

  mounted() {
    setTimeout(() => {
      for (let i = 0; i < this.tableData.length; i++) {
        this.showImg(this.tableData[i], i);
      }
    }, 300);
  },
  methods: {
    showImg(item, index) {
      let indexList = index;
      APIclass.getDetail({
        topicTable: this.propsDangerous,
        paramValue: item.DYXTJGNM_KEY,
      }).then((res) => {
        let arrLength = this.tableData.length;

        this.tableTemporaryData = new Array(arrLength);
        this.tableTemporaryData[indexList] = res.data.emergencyTopic_RMWZDY_MT;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.list {
  margin-top: 20px;
  .list_img {
    margin-top: 20px;
  }
  .list_view {
    margin-bottom: 20px;
    h3 {
      font-size: 16px;
      margin: 10px;
      padding: 0px;
    }
    div {
      font-size: 14px;
      padding: 0px 10px;
    }
  }
}
</style>