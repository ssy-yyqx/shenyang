<template>
  <div style="height: 100%">
    <el-table
      border
      stripe
      :data="tableData"
      :header-cell-style="headClass"
      style="overflow-x:auto;width: 100%; color: #49494a; height: 100%"
      @row-click="rowClick"
    >
      <el-table-column
        v-for="(item, index) in topicTable"
        :key="index"
        :prop="item.key"
        sortable
        :label="item.name"
        show-overflow-tooltip
        :render-header="isFiltration ? renderHeader : renderHeaderNo"
      />
    </el-table>
    <el-dialog
      :visible.sync="drawer"
      custom-class="qiefen-dialog-class"
      title="主题详情"
    >
      <div
        v-for="(item, index) in surfaceKey"
        :key="index"
        class="table_drawer"
      >
        <div v-if="titleTable[item] && index == 0" class="mt-title">
          {{ titleTable[item] }}
        </div>

        <el-table :data="tableTemporaryData[item]" style="width: 100%">
          <el-table-column
            v-for="(itemTopic, indexTopic) in tableTopic[item]"
            :key="indexTopic"
            :prop="itemTopic.key"
            :label="itemTopic.label"
          />
        </el-table>
      </div>
      <div class="table_drawer">
        <div v-if="surfaceKeyMT.length > 0">
          <div v-for="(item, index) in surfaceKeyMT" :key="index">
            <div v-if="titleTable[item] && index == 0" class="mt-title">
              {{ titleTable[item] }}
            </div>
            <div v-if="tableTemporaryData[item].length > 0">
              <div
                v-for="(itemMT, indexMT) in tableTemporaryData[item]"
                :key="indexMT"
              >
                <div
                  v-if="
                    itemMT.MTLXNM == '图像媒体' || itemMT.MTGSNM == 'JPG/JPEG'
                  "
                >
                  <el-image :src="itemMT.WJM" />
                </div>
                <div v-if="itemMT.MTLXNM == '复合文档'">
                  <pdfToImage :pdf-url="itemMT.WJM" />
                </div>
              </div>
            </div>
            <div v-else class="table_drawer_noText">暂无数据</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as APIclass from "@/api/classification";
import pdfToImage from "./pdfToImage";
import Text from "../../DataPush/ProductMade/components/text.vue";
import bus from "@/utils/bus";
export default {
  name: "ClassTable",
  components: {
    pdfToImage,
  },
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
    headerClass: {
      type: Boolean,
      default: false,
    },
    showRowClick: {
      type: Boolean,
      default: true,
    },
    isFiltration: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      drawer: false,
      tableTopic: [],
      tableTemporaryData: [],
      rowClickData: {},
      surfaceKey: [],
      surfaceKeyMT: [],
      titleTable: {},
    };
  },
  mounted() {},
  methods: {
    renderHeader(h, { column, $index }) {
      return h(
        "div",
        {
          style: "display:inline-block;",
        },
        [
          h(
            "p",
            {
              style: "display:inline-block",
            },
            column.label
          ),
          h('div', {
          style: 'display: inline-block;position: relative;top: 3px;'
        },
        ),
          h("i", {
            class: "el-icon-data-analysis",
            style: "margin-left:5px",
            on: {
              click: (event) => {
                this.Rowdataanalysis(column, $index);
                event.stopPropagation();
              },
            },
          }),
        ]
      );
    },
    renderHeaderNo(h, { column, $index }) {
      return h("span", column.label);
    },
    Rowdataanalysis(column, index) {
      console.log("1");
      bus.$emit("searchStructureBus", column.property);
    },

    headClass() {
      return 'background:rgba(31 127 216);color:#fff'
    },
    noHeadClass() {
      return " ";
    },
    rowClick(row, column, event) {
      if (
        this.propsDangerous !== "emergencyTopic_JGMBQK" &&
        this.propsDangerous !== "emergencyTopic_ZSXWMTD" &&
        this.propsDangerous !== "emergencyTopic_XYGWYBQK"
      ) {
        if (this.showRowClick) {
          this.rowClickData = {
            topicTable: this.propsDangerous,
            paramValue:
              row.DCHJNM ||
              row.HHSHJNM ||
              row.DWNM ||
              row.DYXTJGNM ||
              row.DYJGNM ||
              row.ZZXGFGNM_KEY
          }

          this.getTopicChiTableComment(this.propsDangerous);
          this.getDetail(this.rowClickData);
          this.drawer = this.showRowClick;
        }
      }
    },
    // 表头
    getTopicChiTable(data) {
      APIclass.getTopicChiTable(data).then((res) => {
        const arrData = res.data;
        this.surfaceKey = [];
        this.surfaceKeyMT = [];
        Object.keys(arrData).forEach((element) => {
          if (element.indexOf("MT") != -1) {
            this.surfaceKeyMT.push(element);
          } else {
            this.surfaceKey.push(element);
          }
          this.manageGetTable(arrData[element], element);
        });
      });
    },
    // 处理表头
    manageGetTable(data, elem) {
      this.tableTopic[elem] = [];
      Object.keys(data).forEach((element) => {
        this.tableTopic[elem].push({
          key: element,
          label: data[element],
        });
      });
    },
    // 数据
    getDetail(data) {
      APIclass.getDetail(data).then((res) => {
        this.tableTemporaryData = res.data;
        this.getTopicChiTable(this.rowClickData);
      });
    },
    // 获取标题
    getTopicChiTableComment(data) {
      APIclass.getTopicChiTableComment(data).then((res) => {
        this.titleTable = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
>>> .el-table__body-wrapper{
  overflow: auto;
  overflow-x: hidden;
  height: 87%;
}
.table_drawer {
  padding: 20px;
}
.mt-title {
  height: 40px;
  line-height: 40px;
  font-weight: bold;
}
.table_drawer_noText {
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #909399;
  font-size: 12px;
}

</style>

