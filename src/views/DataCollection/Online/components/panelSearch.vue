<template>
  <div style="background: #fff">
    <el-cascader-panel
      :options="panelSearchData"
      @change="handleNodeClick"
      :props="props"
    ></el-cascader-panel>
  </div>
</template>
<script>
export default {
  props: {
    columnName: {
      type: String,
      default: "",
    },
    panelSearchData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      props: {
        multiple: false,
        checkStrictly: true,
      },

      options: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    handleNodeClick(data) {
      let arr = {
        columnName: this.columnName,
        data: data,
      };
      this.$emit("setColumnNameData", arr);
    },
  },
  mounted() {
    this.options = this.panelSearchData;
  },
};
</script>