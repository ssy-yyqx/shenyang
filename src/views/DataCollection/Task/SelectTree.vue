<!-- 树状选择器 -->
<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover"
  >
    <el-button
      v-if="isShow"
      type="text"
      size="mini"
      class="appenBtn"
      @click="() => append()"
    >
      新增
    </el-button>
    <el-tree
      ref="tree"
      class="select-tree"
      highlight-current
      :style="`min-width: ${width}`"
      :data="options"
      :props="props"
      lazy
      :load="loadNode"
      node-key="id"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :default-expand-all="false"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span @click="onClickNode(node)">{{ node.label }}</span>
        <span v-if="isShowInput && num === data.id">
          <input v-model="inputValue" :rules="inputRule" type="text" style="margin-left: 22px;">
          <a style="color: red;margin-left: 5px;" @click="() => save(data)"><i class="el-icon-check" /></a>
          <a style="color: red;margin-left: 5px;" @click="() => cancel()"><i class="el-icon-minus" /></a>
        </span>
        <span v-if="isShow" style="margin-left: 20px;">
          <el-button
            v-if="node.level===1"
            type="text"
            size="mini"
            @click="() => append(data)"
          >
            新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => edit(data)"
          >
            修改
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      clearable
      :style="`width: ${width};min-width: ${treeWidth}`"
      :class="{ 'rotate': showStatus }"
      suffix-icon="el-icon-arrow-down"
      :placeholder="placeholder"
    />
  </el-popover>
</template>

<script>
// import * as API from '@/api/DataCollection'
import * as API from '@/api/index'
export default {
  name: 'Pagination',
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected'
  },
  props: {
    isShow: Boolean,
    showID: Boolean,
    isShowOpreation: false,
    // 接收绑定参数
    value: String,
    // 输入框宽度
    width: String,
    // 选项数据
    options: {
      type: Array,
      required: true
    },
    labelName:{
      type:String,
      default:''
    },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择'
    },
    
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        parent: 'parentId',
        value: 'categoryId',
        label: 'categoryName',
        children: 'children'
      })
    }
  },
  data() {
    return {
      inputValue: '',
      inputRule:
        [
          {
            required: true,
            message: '请输入节点信息',
            trigger: 'blur,change'
          }
        ],
      node: [],
      resolve: [],

      num: '',
      operation: 'add',
      isShowInput: false,
      keyValue: '',
      // 树状菜单显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: 'auto',
      // 输入框显示值
      labelModel: '',
      // 实际请求传值
      valueModel: '0',
      parentCategory: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  
  computed: {
    // 是否为树状结构数据
    dataType() {
      const jsonStr = JSON.stringify(this.options)
      return jsonStr.indexOf(this.props.children) !== -1
    },
    // 若非树状结构，则转化为树状结构数据
    data() {
      return this.dataType ? this.options : this.switchTree()
    }
  },
  watch: {
    labelName(val){
      this.labelModel = val
    },
    labelModel(val) {
      if (!val) {
        this.valueModel = ''
      }
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // 检测输入框原有值并显示对应 label
    if (this.value) {
      this.labelModel = this.queryTree(this.data, this.value)
    }
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`
    })
  },
  methods: {
    qingkong() {
      
      this.labelModel = ''
      console.log(this.labelModel)
    },
    getDataTypes() {
      API.getDataTypes().then(res => {
        const { code, data, msg } = res
        if (code === 200) {
          this.options = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.resolve = resolve
        this.node = node
        return resolve(this.options)
      }
      const props = {
        categoryId: node.data.categoryId
      }
      API.getTreeDataType(props).then(res => {
        const { code, data, msg } = res
        if (code === 200) {
          resolve(data)
        }
      })
    },
    cancel() {
      this.isShowInput = false
      this.inputValue = ''
    },
    save(node) {
      if (this.inputValue !== undefined && this.inputValue !== '' && this.inputValue !== null) {
        if (this.operation === 'add') {
          const props = {
            value: this.inputValue,
            node: node
          }
          API.saveTreeNode(props).then(res => {
            const { code, data, msg } = res
            if (code === 200) {
              const newChild = data
              if (!node.children) {
                this.$set(node, 'children', [])
              }
              node.children.push(newChild)
            }
          })
        } else if (this.operation === 'edit') {
          const props = {
            value: this.inputValue,
            node: node
          }
          API.updateTreeNode(props).then(res => {
            const { code, data, msg } = res
            if (code === 200) {
              this.$set(node, 'label', this.inputValue)
            }
          })
        }
        this.isShowInput = false
      } else {
        this.$message.error('信息不能为空')
      }
    },
    append(data) {
      // this.isShowOpreation = true
      // const newChild = { categoryId: 1, categoryName: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
      // console.log(data)
      // this.num = data.categoryId
      // this.isShowInput = true
      // this.operation = 'add'
      // this.inputValue = ''
      console.log(data)
      if (data) {
        this.parentCategory = data.categoryId
      } else {
        this.parentCategory = '0'
      }
      this.$emit('appendTree', 'appendTree')
    },
    submitTreeData(categoryName) {
      this.node.childNodes = []
      const params = {
        categoryName: categoryName,
        parentCategory: this.parentCategory
      }
      API.addTreeDataType(params).then(res => {
        const { code, data, msg } = res
        if (code === 200) {
          this.getDataTypes()
          // this.$parent.getDataTypes()
          this.loadNode(this.node, this.resolve)
        }
      })
    },
    editTreeData(categoryName) {
      this.node.childNodes = []
      this.loadNode(this.node, this.resolve)
      const params = {
        categoryName: categoryName,
        parentCategory: this.parentCategory,
        categoryId: this.parentCategory
      }
      API.updateTreeDataType(params).then(res => {
        const { code, data, msg } = res
        if (code === 200) {

        }
      })
    },
    edit(data) {
      this.parentCategory = data.categoryId
      console.log(data.categoryName)
      this.$emit('editTree', 'editTree', data.categoryName)
      // this.num = data.id
      // this.isShowInput = true
      // this.operation = 'edit'
      // this.inputValue = data.label
    },
    remove(node, data) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const props = {
            node: data
          }
          API.deleteTreeNode(props).then(res => {
            const { code, data, msg } = res
            if (code === 200) {
              const parent = node.parent
              const children = parent.data.children || parent.data
              const index = children.findIndex(d => d.id === data.id)
              children.splice(index, 1)
              this.$message.success(msg)
            }
          })
        })
        .catch(() => {
          return
        })
    },
    // 单击节点
    onClickNode(node) {
      if (node.level === 1) {
        return false
      }
      this.labelModel = node.data[this.props.label] // 中文
      this.valueModel = node.data[this.props.value] // 英文
      this.onCloseTree()
    },
    // 偏平数组转化为树状层级结构
    switchTree() {
      return this.cleanChildren(this.buildTree(this.options, '0'))
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.$refs.popover.showPopper = false
    },
    // 显示时触发
    onShowPopover() {
      this.showStatus = true
      this.$refs.tree.filter(false)
    },
    // 隐藏时触发
    onHidePopover() {
      this.showStatus = false
      this.$emit('selected', this.valueModel)
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true
      return data[this.props.label].indexOf(query) !== -1
    },
    // 搜索树状数据中的 ID
    queryTree(tree, id) {
      let stark = []
      stark = stark.concat(tree)
      while (stark.length) {
        const temp = stark.shift()
        if (temp[this.props.children]) {
          stark = stark.concat(temp[this.props.children])
        }
        if (temp[this.props.value] === id) {
          return temp[this.props.label]
        }
      }
      return ''
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = []
        for (let i = 0; i < data.length; i++) {
          const n = data[i]
          if (n[this.props.parent] === parentId) {
            n.children = fa(n.rowGuid)
            temp.push(n)
          }
        }
        return temp
      }
      return fa(id)
    },
    // 清除空 children项
    cleanChildren(data) {
      const fa = (list) => {
        list.map((e) => {
          if (e.children.length) {
            fa(e.children)
          } else {
            delete e.children
          }
          return e
        })
        return list
      }
      return fa(data)
    }
  }
}
</script>

<style>
.el-input.el-input--suffix {
  cursor: pointer;
  overflow: hidden;
}
.el-input.el-input--suffix.rotate .el-input__suffix {
  transform: rotate(180deg);
}
.select-tree {
  max-height: 350px;
  overflow-y: scroll;
}
/* 菜单滚动条 */
.select-tree::-webkit-scrollbar {
  z-index: 11;
  width: 6px;
}
.select-tree::-webkit-scrollbar-track,
.select-tree::-webkit-scrollbar-corner {
  background: #fff;
}
.select-tree::-webkit-scrollbar-thumb {
  border-radius: 5px;
  width: 6px;
  background: #b4bccc;
}
.select-tree::-webkit-scrollbar-track-piece {
  background: #fff;
  width: 6px;
}
.appenBtn{
  margin-left: 10px;
}
</style>
