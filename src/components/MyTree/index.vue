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
        style="padding:5px 0;"
        prefix-icon="el-icon-search"
        placeholder="输入要搜索内容..."
      />
      <el-scrollbar style="height: calc(100% - 42px);">
        <!-- :load="loadNode"
          lazy -->
        <el-tree
          ref="tree"
          class="filter-tree"
          node-key="id"
          show-checkbox
          :data="treeData"
          :props="treeProps"
          :filter-node-method="filterNode"
          highlight-current
          :default-expanded-keys="keys"
          :default-checked-keys="keys"
          :current-node-key="currents"
          @node-click="nodeClick"
          @check="onHandleCheck"
        />
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    radioList: {
      type: Array,
      required: true
    },
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
      radio3: this.radioList[0].label,
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

  methods: {
    // 树复选框多选事件
    onHandleCheck(checkedNodes, checkedKeys) {
      this.$emit('check', checkedNodes, checkedKeys)
    },
    // 树节点点击事件
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
    treeRadioChange(val) {
      this.$emit('treeRadioChange', val)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getCheckedData() {
      return this.$refs.tree.getCheckedNodes()
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
  .tree-header{
    height:50px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom:1px solid #E9EAEF;
  }
  .tree-con{
    height: calc(100% - 70px);
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
