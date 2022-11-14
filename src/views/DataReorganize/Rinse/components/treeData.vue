<template>
  <div class="tree">
    <el-input v-model="filterText" placeholder="输入关键字" />
    <el-tree
      ref="tree"
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    />
  </div>
</template>
<script>
export default {
  props: ['treeData'],
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.$emit('clickNode', data.id)
    }
  }
}
</script>
<style lang="scss" scoped>
.tree {
  ::v-deep .el-tree {
    background-color: #f5f6fa;
    padding: 0px 10px;
    .el-tree-node__content:hover {
      background-color: #d8dadc;
    }
    .is-current{
      background-color: #d8dadc;
    }
  }
}
</style>
