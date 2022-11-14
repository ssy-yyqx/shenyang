<template>
  <div class="city-table">
    <!-- 云图部分 -->
    <el-tabs
      v-if="tabData.length > 0"
      v-model="activeTableName"
      type="border-card"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabData"
        :key="index"
        :label="item.TABLE_COMMENT"
        :name="item.TABLE_NAME"
      >
        <classTable
          :isFiltration="isFiltration"
          :table-data="cloudPictureTableData"
          :topic-table="topicTable"
          :show-row-click="false"
        />
        <div class="button-con" style="margin-top: 10px">
          <el-button
            class="elbutton"
            style="position: relative"
            @click="daochu"
          >
            <img
              style="width: 20px; height: 20px; position: absolute; top: 20%"
              :src="require(`@/icons/newImages/daochu.png`)"
              class="img-class"
              alt=""
            />
            <span style="margin-left: 32px">导出</span>
          </el-button>
        </div>
        <div class="pager-section">
          <el-pagination
            :current-page="pager.currentPage"
            :page-sizes="pager.pageSizes"
            :page-size="pager.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pager.total"
            @size-change="
              (val) => {
                handleSizeChange(val, item.TABLE_NAME);
              }
            "
            @current-change="
              (val) => {
                handleCurrentChange(val, item.TABLE_NAME);
              }
            "
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      custom-class="qiefen-dialog-class"
      title="数据导出"
      :visible.sync="dataExportDialogVisible"
      width="30%"
    >
      <span>模板类型：</span>
      <el-radio
        v-model="exportType"
        label="EXCEL"
        style="margin-right: 14px"
        @change="radio"
        >文档</el-radio
      >
      <el-radio v-model="exportType" label="DMP" @change="radio"
        >数据包</el-radio
      >
      <span slot="footer" class="dialog-footer">
        <el-button
          style="
            width: 57px;
            text-align: center;
            background: #1f7cd7;
            color: rgba(255, 255, 255);
          "
          @click="getDeploymentTable"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import classTable from "./classTable";

import * as APIclass from "@/api/classification";
export default {
  name: "CloudPicture",
  components: {
    classTable,
  },
  props: {
    cityField: {
      type: String,
      default: "",
    },
    propsDangerous: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isFiltration: false,
      activeTableName: "",
      tabData: [],
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10, 15, 20, 30],
      },
      dataExportDialogVisible: false,
      exportType: "",
      type: "",
      topicTable: [],
      cloudPictureTableData: [],
    };
  },
  computed: {},

  watch: {},
  watch: {
    propsDangerous(val) {
      this.gettopicMakeTable(val);
    },
    activeTableName(val) {
      this.getTopicTable(val);
      this.getList({
        areaCode: this.cityField,
        topicTable: val,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage,
      });
    },
  },
  mounted() {
    this.gettopicMakeTable(this.propsDangerous);
  },

  methods: {
    // 表格tab切换
    tabClick(tab, event) {
      this.pager = {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10, 15, 20, 30],
      };
      // this.getTopicTable(tab.name);
      // this.getList({
      //   areaCode: this.cityField,
      //   topicTable: tab.name,
      //   pageSize: this.pager.pageSize,
      //   pageNum: this.pager.currentPage,
      // });
    },
    // 一页显示多少个
    handleSizeChange(val, type) {
      this.pager.pageSize = val;

      this.getList({
        areaCode: this.cityField,
        topicTable: type,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage,
      });
    },
    // 第几页
    handleCurrentChange(val, type) {
      this.pager.currentPage = val;

      this.getList({
        areaCode: this.cityField,
        topicTable: type,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage,
      });
    },
    // 获取tab头
    gettopicMakeTable(data) {
      APIclass.gettopicMakeTable(data).then((res) => {
        this.tabData = res.data;

        if (res.data[0]) {
          this.activeTableName = res.data[0].TABLE_NAME || "";
        }
      });
    },
    // 获取表头
    getTopicTable(data) {
      APIclass.getTopicTable(data).then((res) => {
        this.topicTable = [];
        Object.keys(res.data).forEach((key) => {
          this.topicTable.push({
            key: key,
            name: res.data[key],
          });
        });
      });
    },
    // 获取表数据
    getList(data) {
      APIclass.getList(data).then((res) => {
        this.pager.total = res.data.total;
        this.cloudPictureTableData = res.data.list;
      });
    },
    daochu(type) {
      console.log(type, "cloud");
      this.dataExportDialogVisible = true;
    },
    radio(value) {
      if (value === "EXCEL") {
        this.type = "1";
      } else {
        this.type = "2";
      }
    },
    getDeploymentTable() {
      if (this.type === "") {
        return this.$message.error("请选择导出类型");
      }
      const params = {
        areaCode: this.cityField,
        topicTable: "dataMakTopic_",
        topicId: this.propsDangerous,
        exportType: this.type,
      };
      APIclass.exportTopic(params).then((res) => {
        const { code, data, msg } = res;
        if (String(code) === "200") {
          window.open(data);
          this.$message({
            type: "success",
            message: "导出成功!",
          });
          this.dataExportDialogVisible = false;
          this.exportType = "";
        } else {
          this.$message.error(msg);
        }
      });
    },
    // daochu(type) {
    //   const params = {
    //     areaCode: this.cityField,
    //     topicTable: 'dataMakTopic_',
    //     topicId: this.propsDangerous
    //   }
    //   APIclass.exportTopic(params).then((res) => {
    //     const { code, data, msg } = res
    //     if (String(code) === '200') {
    //       window.open(data)
    //       this.$message({
    //         type: 'success',
    //         message: '导出成功!'
    //       })
    //     } else {
    //       this.$message.error(msg)
    //     }
    //   })
    // }
  },
};
</script>

<style lang="scss" scoped>
>>> .qiefen-dialog-class {
  margin-top: 22vh !important;
}
.city-table {
  margin-top: 20px;
}
.pager-section {
  margin-top: 20px;
  text-align: right;
  margin-right: 20px;
}
</style>
