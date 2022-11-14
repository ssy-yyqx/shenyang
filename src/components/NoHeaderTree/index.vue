<template>
  <div class="my-tree">
    <div class="tree-con">
      <el-input
        v-model="filterText"
        style="padding:5px 0;"
        prefix-icon="el-icon-search"
        placeholder="输入要搜索内容..."
      />
      <el-scrollbar style="height: calc(100% - 42px);">
        <el-tree
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
        />
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    treeData: {
      type: Array,
      required: true
    },
    treeProps: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filterText: '',
      keys: [],
      currents: null,
      firstObj: {}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // console.log(this.treeData, this.treeProps)
  },
  methods: {
    nodeClick(obj, node, tree) {
      this.$emit('nodeClick', { obj, node, tree })
    },
    // 递归选择最底层第一个
    getFirstNode(tree) {
      for (let i = 0; i < tree.length; i++) {
        var el = tree[i]
        if (el.childList && el.childList.length > 0) {
          this.getFirstNode(el.childList)
          break
        } else {
          this.firstObj = el
          break
        }
      }
      return this.firstObj
    },
    setChecks(val) {
      const regObj = this.getFirstNode(val)
      if (regObj && regObj.id) {
        this.keys = [regObj.id]
        this.$nextTick(() => {
          this.currents = regObj.id
          this.$refs['tree'].setCurrentKey(regObj.id)
        })
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>
<style lang="scss" scoped>
.my-tree{
  background-color: #fff;
  width:350px;
  height: 100%;
  overflow-y: auto;
  padding:20px 10px;
  border-radius: 8px;
   padding-top: 80px;
  .tree-con{
    height: 100% ;
    .filter-tree{
      height: 100%;
      background-color: rgba(255, 255, 255,0.8);
    }
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
<style lang="scss">
  .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #1F7CD7;
    border-color: #1F7CD7;
  }
</style>
