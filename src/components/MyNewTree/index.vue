<template>
  <div class="my-tree">
    <div class="tree-header">
      <el-radio-group v-model="radio3" size="small" @change="treeRadioChange">
        <el-radio-button
          v-for="item in radioList"
          :key="item.label"
          :label="item.label"
        >
          {{ item.content }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="tree-con">
      <el-input
        v-model="filterText"
        style="padding: 5px 0"
        prefix-icon="el-icon-search"
        placeholder="输入要搜索内容..."
      />
      <el-scrollbar style="height: calc(100% - 42px)">
        <!-- <el-tree
          ref="tree"
          class="filter-tree"
          node-key="id"
          :data="treeData"
          :props="treeProps"
          :filter-node-method="filterNode"
          highlight-current
          :default-expanded-keys="keys"
          :current-node-key="currents"
          @node-click="nodeClick"
        /> -->

        <el-tree
          ref="tree"
          node-key="id"
          :data="treeData"
          :radio-list="radioList"
          :tree-data="treeData"
          :tree-props="treeProps"
          @treeRadioChange="treeRadioChange"
          @node-click="nodeClick"
          :filter-node-method="filterNode"
          highlight-current
          :default-expanded-keys="keys"
          :current-node-key="currents"
          class="filter-tree"
          :props="treeProps"
          :load="loadNode"
          lazy
          v-if="isShowTree"
        >
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import * as API from "@/api/index.js";
export default {
  props: {
    radioList: {
      type: Array,
      required: true,
    },
    treeData: {
      type: Array,
      required: true,
    },
    treeProps: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      radio3: this.radioList[0].label,
      filterText: "",
      keys: [],
      currents: null,
      firstObj: {},
      isShowTree:true
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    loadNode(node, resolve) {
      console.log(node, "nodeq111");
      if (node.level === 0) {
        return resolve([{ name: "region" }]);
      }
      
      if (this.checkTreeType === "dwbz") {
        this.treeProps.label = "forceName";
        let props = {
          forceSequence: node.data.forceSequence,
        };
        API.getUnitsCompiledTree(props).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            resolve(data);
          }
        });
      } else if (this.checkTreeType  === "xzqy") {
        this.treeProps.label = "areaName";
        let props = {
          areaSequence: node.data.areaSequence,
        };
        API.getAreaTree(props).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            resolve(data);
          }
        });
      } else if (this.checkTreeType  === "sjlx") {
        this.treeProps.label = "categoryName";
        let props = {
          categoryId: node.data.categoryId,
        };
        API.getDataTypeTree(props).then((res) => {
          const { code, data, msg } = res;
          if (code === 200) {
            resolve(data);
          }
        });
      }
    },
    // 切换树
    treeRadioChange(val) {
      console.log(val,'dsaf')
      this.isShowTree = false;
      this.isShowTree = true;
      this.checkTreeType = val;
      console.log(this.checkTreeType,123213);
      this.getUnitTree(val);
      this.reset();
      this.$forceUpdate();
      
    },
    nodeClick(obj, node, tree) {
      this.$emit("nodeClick", { obj, node, tree });
    },
    // 递归选择最底层第一个
    getFirstNode(tree) {
      for (let i = 0; i < tree.length; i++) {
        var el = tree[i];
        if (el.childList && el.childList.length > 0) {
          this.getFirstNode(el.childList);
          break;
        } else {
          this.firstObj = el;
          break;
        }
      }
      return this.firstObj;
    },
    setChecks(val) {
      const regObj = this.getFirstNode(val);
      if (regObj && regObj.id) {
        this.keys = [regObj.id];
        this.$nextTick(() => {
          this.currents = regObj.id;
          this.$refs["tree"].setCurrentKey(regObj.id);
        });
      }
    },
    treeRadioChange(val) {
      this.$emit("treeRadioChange", val);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>
<style lang="scss" scoped>
.my-tree {
  background-color: #fff;
  width: 350px;
  height: 100%;
  overflow-y: auto;
  padding: 20px 10px;
  border-radius: 8px;
  .tree-header {
    height: 50px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e9eaef;
  }
  .tree-con {
    height: calc(100% - 70px);
    .filter-tree {
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
    }
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
<style lang="scss">
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #1f7cd7;
  border-color: #1f7cd7;
}
</style>
