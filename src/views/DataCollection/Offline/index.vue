<template>
  <Container>
    <div style="display:flex;">
      <div
        v-loading="loading2"
        class="offline-main"
        element-loading-text="加载中"
        element-loading-background="rgba(255, 255, 255, 0.001)"
      >
        <div class="left-section">
          <div class="search-section">
            <el-input
              v-model="filterText"
              size="small"
              placeholder="输入关键字进行过滤"
              prefix-icon="el-icon-search"
            />
          </div>
          <div class="treebox">
            <el-tree
              ref="treeLeft"
              class="filter-tree"
              node-key="id"
              :data="treeData"
              :props="treeProps"
              show-checkbox
              style="overflow-x:auto;"
              :filter-node-method="filterNode"
              @node-click="onHandleClickLeft"
              @check="onHandleChecks"
            />
          </div>
        </div>
      </div>

      <div
        v-loading="loading3"
        class="tree-box"
        element-loading-text="加载中"
        element-loading-background="rgba(255, 255, 255, 0.001)"
        style="background: #fff;border-radius: 5px;height: calc(100vh - 130px);width:300px;margin-left: 10px;"
      >
        <div
          style="margin: 2%;width: 95%;-webkit-box-align: center;-ms-flex-align: center;align-items: center;"
        >
          <el-input
            v-model="filterTextRight"
            prefix-icon="el-icon-search"
            placeholder="输入要搜索内容..."
          />
        </div>
        <el-scrollbar style="height:calc(100vh - 176px);">
          <el-tree
            ref="tree"
            class="filter-tree"
            style="height: calc(100vh - 170px);width:500px;overflow-x:auto;"
            node-key="id"
            :data="treeDataRight"
            :props="treeProps"
            :filter-node-method="filterNodeRight"
            :default-checked-keys="keys"
            show-checkbox
            @node-click="nodeClick"
            @check="onHandleCheck"
          />
        </el-scrollbar>
      </div>
      <div v-loading="loading" element-loading-text="下载中" element-loading-background="rgba(0, 0, 0, 0.4)" class="offline" style="position: relative;flex: 1">
        <img src="../../../assets/icons/offLineUpload.png" style="position: absolute;top: 200px;left: 360px;">
        <el-button element-loading-text="加载中" type="primary" style="position: absolute;top: 390px;left: 465px;" @click="download">下 载<i class="el-icon-download el-icon--right" /></el-button>
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container'
import * as API from '@/api/index'
export default {
  components: { Container },
  filters: {
  },
  data() {
    return {
      loading: false,
      filterText: '',
      filterTextRight: '',
      // 树配置
      treeProps: {
        label: 'label',
        children: 'childList'
      },
      forceCode: [], // 左侧树节点点击
      tableName: '', // 表名
      tableNames: [],
      treeData: [],
      treeDataRight: [], // 树内容
      keys: [], // 树节点键值
      defaultProps: {
        label: 'label',
        value: 'code',
        id: 'id'
      },
      loading2: false,
      loading3: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeLeft.filter(val)
    },
    filterTextRight(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.loading2 = true
    this.loading3 = true
    this.addTheme()
    this.getUnitTree()
  },
  methods: {

    // 当复选框被点击的时候触发
    onHandleChecks(nodes, keys) {
      this.forceCode = []
      if (nodes.childList !== null || nodes.childList.length !== 0) {
        keys.checkedNodes.forEach(item => {
          this.forceCode.push(item.field)
        })
      }
    },
    // 树节点点击
    onHandleClickLeft(obj, node, tree) {
      this.forceCode = []
      if (obj.childList !== null || obj.childList.length !== 0) {
        this.forceCode.push(obj.field)
      }
    },
    // 查询树结构
    addTheme() {
      API.getCustomizationDataTypeTree().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.loading3 = false
          const result = data.filter(word => word.label !== '舆情数据' && word.label !== '气象数据')
          this.treeDataRight = result
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 树过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterNodeRight(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树节点点击事件
    nodeClick(obj, node, tree) {
      if (obj.childList === null || obj.childList.length === 0) {
        this.tableName = obj.tableName
        this.tableNames.push(this.tableName)
      }
    },
    // 树复选框多选事件
    onHandleCheck(checkedNodes, checkedKeys) {
      this.tableNames = []
      checkedKeys.checkedNodes.forEach(item => {
        if (item.tableName !== null) {
          this.tableNames.push(item.tableName)
        }
      })
    },
    getUnitTree() {
      const prop = '/force'
      API.getDataTypeTree({}, prop).then(res => {
        console.log('=======', res)

        const { code, data, msg } = res
        if (String(code) === '200') {
          this.loading2 = false
          this.treeData = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 下载
    download() {
      if (this.forceCode === [] || this.tableNames === []) {
        this.loading = false
        this.$message.error('请选择部队以及表名')
      } else {
        const props = {
          forceCodes: this.forceCode,
          tableNames: this.tableNames
        }
        this.loading = true
        API.getGenTools(props).then(res => {
          const { data, code, msg } = res
          if (String(code) === '200') {
            this.loading = false
            this.$message.success('下载成功')
            this.$refs.treeLeft.setCheckedKeys([])
            this.$refs.tree.setCheckedKeys([])
            window.open(data)
          } else {
            this.$message.error(msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-button--primary{
  background: #1f7cd7;
}
  .offline-main{
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 100%;
    .left-section {
      width: 300px;
      height: calc(100vh - 130px);
      overflow-y: auto;
      background: #FFFFFF;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
      border-radius: 5px;
      .search-section {
        margin: 2%;
        width: 95%;
        align-items: center;
      }
      .treebox {
        overflow: auto;
        max-height: 100%;
        height: calc(100% - 60px);
        //width: 300px;
        width: 450px;
      }
    }
  .offline{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
     ::v-deep .el-button{
      width: 200px;
      height: 50px;
      margin-top: 20px;
    }
  }
  }
</style>
