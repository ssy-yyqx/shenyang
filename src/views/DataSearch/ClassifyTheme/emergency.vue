<template>
  <div class="dangerous-table">
    <div class="dangerous-cascader">
      <el-cascader
        v-if="
          propsDangerous == 'emergencyTopic_ZHQK' ||
          propsDangerous == 'emergencyTopic_JGMBQK' ||
          propsDangerous == 'emergencyTopic_XYGWYBQK'
        "
        v-model="cascaderData"
        :show-all-levels="false"
        :props="props"
        placeholder="请选择武装部"
        clearable
        @change="
          (val) => {
            changeCascader(val, '0');
          }
        "
      />
      <el-cascader
        v-else
        :key="keyValue"
        v-model="cascaderData"
        :show-all-levels="false"
        :options="optionsData"
        :props="optionProps"
        placeholder="请选择地区"
        style="margin-bottom:10px;"
        clearable
        filterable
        @change="
          (val) => {
            changeCascader(val, '1');
          }
        "
      />
    </div>

    <div v-if="propsDangerous == 'emergencyTopic_ZHQK'">
      <listView
        :table-data="tableData"
        :topic-table="topicTable"
        :props-dangerous="propsDangerous"
      />
    </div>
    <div v-else>
      <classTable
        :table-data="tableData"
        :topic-table="topicTable"
        :props-dangerous="propsDangerous"
      />
    </div>
    <div class="button-con" style="margin-top: 10px">
      <el-button class="elbutton" style="position: relative" @click="daochu">
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
            handleSizeChange(val);
          }
        "
        @current-change="
          (val) => {
            handleCurrentChange(val);
          }
        "
      />
    </div>
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
    <el-dialog :visible.sync="dialogguolv" width="30%">
      <div v-if="dialogguolv">
        <FormGenerate
          ref="tableForm"
          :tab="thirdLevel"
          :form-list="formListZB"
          :form-values="formValues"
          :force-code="forceCode"
          :equipment-code="equipmentCode"
          :is-edit="isEdit"
        ></FormGenerate>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogguolv = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import classTable from "./classTable";
import listView from "./listView";

import * as APIclass from "@/api/classification";
import FormGenerate from "@/views/DataCollection/Online/components/FormGenerate";
import bus from "@/utils/bus";
let militaryChildren = [];
export default {
  name: "Emergency",
  components: {
    classTable,
    listView,
    FormGenerate,
  },
  props: {
    propsDangerous: {
      type: String,
      default: "",
    },
    citysData: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      formListZB: [],
      thirdLevel: "",
      formValues: {},
      dialogguolv: false,
      forceCode: "",
      equipmentCode: "",
      isEdit: false,
      isIndexCome: "",
      dataExportDialogVisible: false,
      exportType: "",
      type: "",
      tableData: [],
      keyValue: 0,
      optionProps: {
        value: "field",
        label: "label",
        children: "childList",
        checkStrictly: true,
      },
      militaryData: [],
      cascaderData: [],
      props: {
        lazy: true,
        leaf: "isLeaf",
        value: "id",
        lazyLoad(node, resolve) {
          const { level } = node;
          // 军区数据
          APIclass.getSelectOrg({
            columnName: "DYXTJGNM",
            tableName: "ZZBZ_S_TY_DYXTJG",
            sequence: node.value,
          }).then((res) => {
            militaryChildren = res.data;
            resolve(res.data);
          });
        },
      },
      optionsData: [],
      topicTable: [],
      formTopicTableData: "",
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10, 15, 20, 30],
      },
      cityField: "",
    };
  },
  watch: {
    propsDangerous(val) {
      this.formTopicTableData = val;
      this.cascaderData = [];
      this.getTopicTable(val);
      this.getList({
        areaCode: "",
        topicTable: val,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage,
      });
    },
    options(newVal) {
      this.keyValue++; // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    },
  },
  mounted() {
    let that = this;
    if (this.propsDangerous) {
      this.formTopicTableData = this.propsDangerous;
      this.getTopicTable(this.formTopicTableData);
      this.getList({
        areaCode: "",
        topicTable: this.formTopicTableData,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage,
      });

      this.optionsData = this.getTreeData(this.citysData);
      bus.$on("searchStructureBus", (e) => {
        console.log(e);
        this.isIndexCome = e;
        let params = { topicTable: this.formTopicTableData };
        that.searchStructure(params);
      });
    }
  },
  methods: {
    onSubmit() {
      if (this.$refs.tableForm) {
        const formData = this.$refs.tableForm.getFormData();
        this.$refs.tableForm.isValidate().then((valid) => {
          if (valid) {
            console.log(formData);
            console.log(this.formListZB);
            this.dialogguolv = false;
            let data = {
              areaCode: "",
              topicTable: this.formTopicTableData,
              pageSize: this.pager.pageSize,
              pageNum: this.pager.currentPage,
              conditions: [
                {
                  columnValue: formData[this.isIndexCome],
                  columnName: this.isIndexCome,
                  domType: this.formListZB[0].domType,
                },
              ],
            };
            this.getList(data);
          }
        });
      }
    },
    searchStructure(params) {
      APIclass.searchStructure(params).then((res) => {
        console.log(res);

        this.formListZB = [];
        this.formListZB.push(
          res.data.find((e) => e.columnName == this.isIndexCome)
        );
        this.dialogguolv = true;
      });
    },
    // 省市区选择
    changeCascader(val, type) {
      if (type == "0") {
        this.cityField =
          val.length > 0
            ? militaryChildren.find((e) => e.id == val[val.length - 1]).code
            : "";
        this.getList({
          areaCode:
            val.length > 0
              ? militaryChildren.find((e) => e.id == val[val.length - 1]).code
              : "",
          topicTable: this.formTopicTableData,
          pageSize: this.pager.pageSize,
          pageNum: this.pager.currentPage,
        });
      }
      if (type == "1") {
        this.cityField = val[val.length - 1];
        this.getList({
          areaCode: val[val.length - 1] || "",
          topicTable: this.formTopicTableData,
          pageSize: this.pager.pageSize,
          pageNum: this.pager.currentPage,
        });
      }
    },
    // 一页显示多少个
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.getList({
        areaCode: "",
        topicTable: this.formTopicTableData,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage,
      });
    },
    // 第几页
    handleCurrentChange(val) {
      this.pager.currentPage = val;
      this.getList({
        areaCode: "",
        topicTable: this.formTopicTableData,
        pageSize: this.pager.pageSize,
        pageNum: this.pager.currentPage,
      });
    },
    // 获取表头
    getTopicTable(data) {
      this.topicTable = [];
      APIclass.getTopicTable(data).then((res) => {
        console.log(res.data)
        console.log(this.topicTable)
        //this.topicTable = [];
        Object.keys(res.data).forEach((key) => {
          this.topicTable.push({
            key: key,
            name: res.data[key],
          });
        });
        console.log(this.topicTable)
      });
    },
    // 获取表数据
    getList(data) {
      APIclass.getList(data).then((res) => {
        this.pager.total = res.data.total;
        this.tableData = res.data.list;
      });
    },
    // 处理城市数据
    getTreeData(data) {
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].childList.length == 0) {
            data[i].childList = undefined;
          } else {
            this.getTreeData(data[i].childList);
          }
        }
      }

      return data;
    },
    daochu(type) {
      // console.log(type, 'eme')
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
      // console.log(this.type)
      if (this.type === "") {
        return this.$message.error("请选择导出类型");
      }

      const params = {
        areaCode: this.cityField,
        topicTable: this.formTopicTableData,
        topicId: "",
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
          this.type = "";
        } else {
          this.$message.error(msg);
        }
      });
    },
    // daochu(type) {
    //   const params = {
    //     areaCode: this.cityField,
    //     topicTable: this.formTopicTableData,
    //     topicId: ''
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
.dangerous-table {
  background: #fff;
  margin-top: 20px;
  padding: 10px;
  .dangerous-cascader {
    width: 190px;
  }
}
.pager-section {
  margin-top: 20px;
  text-align: right;
  margin-right: 20px;
}
</style>
