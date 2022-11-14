<template>
  <Container>
    <IndexTable @addDataPruduct="addDataPruduct" @addDataPruductadd="addDataPruductadd" />

    <el-dialog
      :visible.sync="bAddDataProduct"
      :title="editMode ? '编辑数据产品' : '新增数据产品' "
      width="60%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="qiefen-dialog-class"
    >
      <AddDataProduct
        :b-add-data-product="bAddDataProduct"
        :edit-data="editData"
        :edit-mode="editMode"
        @addDataPruduct="addDataPruduct"
      />
      <span slot="footer" class="dialog-footer" style="clear: both;width:100%;display:inline-block" />
    </el-dialog>

  </Container>
</template>

<script>
import Container from '@/components/Container'
import IndexTable from './indexTable'
import AddDataProduct from './addDataProduct'
import bus from '@/utils/bus'
export default {
  components: { Container, IndexTable, AddDataProduct },
  data() {
    return {
      editData: {}, // 编辑的数据
      editMode: false, // 区分新建和编辑
      bAddDataProduct: false // 是否展示新增产品数据页面
    }
  },
  mounted() {
    bus.$on('dataGood', (val) => {
      if (val) {
        this.bAddDataProduct = false
      }
    })
    bus.$on('closeTchuang', (val) => {
      if (val) {
        this.bAddDataProduct = false
      }
    })
  },
  methods: {
    // 新增、编辑数据产品页面     bShowAddPage: 区分打开主页面还是新增产品页面      editMode: 区分新建和编辑
    addDataPruduct(bShowAddPage, editMode, editData) {
      this.editData = editData
      this.bAddDataProduct = bShowAddPage
      this.editMode = editMode
    },
    addDataPruductadd() {
      this.editData = {}
      console.log(this.editData)
      this.bAddDataProduct = true
      this.editMode = false
    },
    handleClose() {
      //console.log('9')
      this.editData = {}
      this.bAddDataProduct = false
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-button--primary{
  background-color: #1f7cd7;
}
>>> .qiefen-dialog-class{
  width: 50% !important;
  margin-top: 10vh !important;
}
>>>.qiefen-dialog-class .el-dialog__footer{
  border: none !important
}
</style>

