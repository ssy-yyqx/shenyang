<template>
  <div style="margin-top: 10px" v-if="loading">
    <el-row :gutter="40">
      <el-col :span="12">
        <div v-if="formListZB.length > 0">
          <FormGenerate
            v-if="thirdLevel === 'ZZBZ_D_HJJT_ZBZJXN'"
            ref="tableForm"
            :tab="thirdLevel"
            :form-list="formListZB"
            :form-values="formValues"
            :force-code="forceCode"
            :equipment-code="equipmentCode"
            :is-edit="isEdit"
          ></FormGenerate>
        </div>
      </el-col>
      <el-form ref="form" :model="form" label-width="160px">
        <el-col :span="12" v-for="(item, index) in tabList" :key="index">
          <el-form-item :label="item.label + ':'">
            <el-input v-model="form[item.code]" style="width: 100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="form-button-section">
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import * as API from "@/api/index";
import * as DataCollectionAPI from "@/api/dataCollection";
import FormGenerate from "./FormGenerate.vue";
import bus from "@/utils/bus";
export default {
  props: {
    formList: {
      type: Array,
      default: [],
    },
    secondLevel: {
      type: String,
      required: true,
    },
    thirdLevel: {
      type: String,
      required: true,
    },
    forceCode: {
      type: String,
      default: "",
    },
    equipmentCode: {
      type: String,
      default: "",
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
    operationType: {
      type: String,
      default: "",
    },
    firstLevel: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {},
      formValues: {},
      formListZB: [],
      tabList: [],
      loading: false,
      tabListTable: [],
    };
  },
  components: {
    FormGenerate,
  },
  methods: {
    onSubmit() {
      if (this.$refs.tableForm) {
        const formData = this.$refs.tableForm.getFormData();
        
        this.$refs.tableForm.isValidate().then((valid) => {
          if (valid) {
            this.onHandleSave(Object.assign(formData, { JGNM: this.form }));
          }
        });
      } else {
        this.onHandleSave({ JGNM: this.form });
      }
    },
    // 提交表单
    onHandleSave(data) {
      const saveParams = {
        data: data,
        tableName: this.thirdLevel,
        forceCode: this.forceCode,
        equipmentCode: this.equipmentCode,
        dataType: this.firstLevel,
        categoryId: this.secondLevel,
      };
      if (this.operationType === "add") {
        API.saveOnlineData(saveParams).then((res) => {
          const { code, msg } = res;

          if (code === 200) {
            this.$message.success("数据采集成功");
            this.getTableList();
          } else {
            this.$message.error(msg);
          }
        });
      } else if (this.operationType === "edit") {
        API.editOnLineTableList(saveParams).then((res) => {
          const { code, msg } = res;

          if (code === 200) {
            this.$message.success("数据编辑成功");

            this.getTableList();
          } else {
            this.$message.error(msg);
          }
        });
      }
    },
    onReset() {
      this.form = {};
      this.operationType = "add";
    },
    getSelectOptions() {
      let param = {
        columnName: "JGNM",
        equipmentCode: this.equipmentCode,
        forceCode: "110000000",
        sequence: "",
        sync: false,
        tableName: "ZZBZ_SS_ZB_ZBZJXN",
      };
      DataCollectionAPI.getSelectOptions(param).then((res) => {
        this.tabList = res.data;

        this.loading = true;
      });
    },
    // 获取表单数据
    getFormList() {
      const params = {
        tableName: this.thirdLevel,
        dataType: this.firstLevel,
        categoryId: this.secondLevel,
      };
      API.getFromList(params).then((res) => {
        if (
          JSON.parse(JSON.stringify(res.data)).find(
            (e) => e.columnComment == "舰艇舷号"
          )
        ) {
          this.formListZB = [
            JSON.parse(JSON.stringify(res.data)).find(
              (e) => e.columnComment == "舰艇舷号"
            ),
          ];
        }

        this.getSelectOptions();
      });
    },
    // 获取表格数据
    getTableList() {
      this.tabListTable = [];
      const params = {
        dataType: this.firstLevel,
        forceCode: this.forceCode,
        categoryId: this.secondLevel,
        tableName: this.thirdLevel,
        equipmentCode: this.equipmentCode,
        pageNum: 1,
        pageSize: 10,
      };
      API.getOnLineTableList(params).then((res) => {
        const { code, data, msg } = res;
        if (code === 200) {
          this.tabListTable = data.list;
          this.formValues = this.tabListTable[0];
          for (let item in this.tabList) {
            let data = this.tabListTable.find(
              (e) => e.JGNM_KEY == this.tabList[item].code
            );
            if (data) {
              this.$set(this.form, data.JGNM_KEY, data.SJZ);
            }
          }
        } else {
          this.$message.error(msg);
        }
      });
    },
  },
  created() {
    this.loading = false;
    this.formListZB = [];
    this.getFormList();
    this.getTableList();
    bus.$on("ShipNumber", (e) => {
      for (let i = 0; i < this.tabListTable.length; i++) {
        if (this.tabListTable[i].JTXHNM_KEY == e[0]) {
          let data = this.tabListTable[i];
          this.$set(this.form, data.JGNM_KEY, data.SJZ);
        }
      }
    });
  },
  watch: {
    thirdLevel: {
      handler(val, oldVal) {
        this.loading = false;
        this.formListZB = [];
        this.form = {};
        this.getFormList();
        this.getTableList();
      },
      deep: true,
    },
    equipmentCode: {
      handler(val, oldVal) {
        this.loading = false;
        this.formListZB = [];
        this.form = {};
        this.getFormList();
        this.getTableList();
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.form-button-section {
  text-align: right;
  padding: 10px 10px 0 10px;
}
</style>