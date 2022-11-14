<template>
  <Container>
    <div
      v-loading="loading2"
      class="container"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      style="margin-bottom:12px;padding:9px 20px;"
    >
      <el-row :gutter="20" style="height:100%">
        <el-col :span="6">
          <div class="container-tree">
            <el-tree
              ref="treeBox"
              lazy
              :load="loadBdTreeNode"
              :highlight-current="true"
              :accordion="true"
              :default-checked-keys="bdCheckedList"
              :props="defaultProps"
              node-key="id"
              @node-click="handleNodeClick"
            />
          </div>
        </el-col>

        <el-col :span="18" style="height:100%">
          <el-tabs v-model="activeName" style="max-height: 96%;" @tab-click="handleClick">
            <!-- 部队 -->
            <el-tab-pane label="部队" name="first">

              <FormGenerate
                v-if="loading"
                ref="tableForm"
                :tab="activeTab"
                :form-list="formList"
                :form-values="formValues"
                :force-code="forceCode"
                :equipment-code="equipmentCode"
                :is-edit="isEdit"
                :is-sequence="isSequence"
              />
            </el-tab-pane>
            <!-- 装备 -->
            <el-tab-pane style="max-height: calc(100vh - 246px);" label="装备" name="second">
              <div class="filter-data">
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" style="margin:10px;margin-bottom:0" @change="handleCheckAllChange">全选</el-checkbox>
                <div class="filter-div">
                  <el-input v-model="filterData" class="filter-input" placeholder="请输入内容" clearable @clear="clearInput" />
                  <el-button class="filter-btn" type="primary" icon="el-icon-search" @click="filterSearch" />
                </div>
              </div>
              <!-- <div style="margin: 15px 0;" /> -->
              <el-checkbox-group v-model="checkedData" style="max-height: 69vh;overflow: auto;overflow-x: hidden;" @change="handleCheckedCitiesChange">
                <div v-for="(item,index) in (searchData.length>0?searchData:options)" :key="index" style="display:inline-block">
                  <el-checkbox v-if="item.ZBNM" :label="item.ZBNM" style="height:33px;line-height:33px;border:1px solid #eee;margin:10px;padding:0 10px" @change="handleChecked(item,$event)">{{ item.ZBNM }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </el-tab-pane>
          </el-tabs>

          <div class="form-button-section">
            <el-button
              size="small"
              type="primary"
              @click="onHandleSave()"
            >提交</el-button>
            <el-button
              v-if="confirmZB==='部队'"
              size="small"
              type="primary"
              @click="onHandleDelete()"
            >重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </Container>
</template>

<script>
import * as API from '@/api/index'
import Container from '@/components/Container'
import FormGenerate from '@/views/DataCollection/Online/components/FormGenerate.vue'
export default {
  components: { Container, FormGenerate },
  data() {
    return {
      activeName: 'first',
      loading2: false,
      data: [],
      formList: [],
      activeTab: '',
      formValues: {},
      forceCode: '',
      bdCheckedList: [],
      isEdit: '',
      equipmentCode: '',
      isSequence: '',
      parentSequence: '',
      expandDefault: [],
      defaultProps: {
        label: 'label',
        value: 'code',
        id: 'id'
      },
      // 多选框
      checkAll: false,
      checkedData: [],
      options: [],
      // 模糊查询后的值
      searchData: [],
      isIndeterminate: true,
      confirmZB: '部队',
      arr: [],
      loading: false,
      alreadyDatas: [],
      dataLoadLazy: [],
      newArray: [],
      filterData: '' // 装备模糊搜索值
    }
  },
  mounted() {
    // this.getTreeList()
    this.getFromList()
    setTimeout(() => {
      this.handleNodeClick(this.dataLoadLazy[0])
    }, 600)
  },
  methods: {
    // 模糊搜索
    filterSearch() {
      if (this.filterData === '') {
        this.getZBDTQK(this.dataLoadLazy[0])
      }
      // const reg = new RegExp('[\u4e00-\u9fa5]$')
      // if (!reg.test(this.filterData) && this.filterData !== '') {
      //   return this.$message.error('只能输入中文')
      // }
      this.searchData = []
      // 字符串方法indexOf
      for (let i = 0; i < this.options.length; i++) {
        // 如果字符串中不包含目标字符会返回-1
        if (this.options[i].ZBNM.indexOf(this.filterData) >= 0) {
          this.searchData.push(this.options[i])
        }
      }
      return this.searchData
    },
    // 清空模糊搜索框
    clearInput() {
      this.searchData = []
      this.getZBDTQK(this.dataLoadLazy[0])
    },
    // 全选
    handleCheckAllChange(val) {
      if (!val) {
        this.newArray = []
      }
      if (this.options.length > 0) {
        const checkedOptions = this.options.map(i => {
          return i.ZBNM
        })
        this.checkedData = val ? checkedOptions : []
        this.isIndeterminate = false
      }
    },
    // 多选框
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.options.length // Boolean  全选中为true
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.options.length
    },
    // tabs切换
    handleClick(tab, event) {
      this.confirmZB = tab.label
    },
    handleChecked(value, e) {
      const obj = {
        'bdnm': this.isSequencs,
        'bzs': value.BZS,
        'xys': value.XYS,
        'zb': value.ZBNM,
        'zbnm': value.ZBNM_KEY
      }
      if (e) {
        this.newArray.push(value)
      } else {
        this.newArray.forEach((item, index) => {
          if (item.ZBNM === value.ZBNM) {
            this.newArray.splice(index, 1)
          }
        })
      }
    },
    onHandleSave() {
      if (this.activeName === 'first') {
        this.$refs.tableForm.isValidate().then((valid) => {
          if (valid) {
            const formData = this.$refs.tableForm.getFormData()
            const arr = Object.assign(formData, {
              parentSequence: this.parentSequence
            })

            API.addOrganization(arr).then((res) => {
              if (res.code === 200) {
                this.$message.success('提交成功')
                // this.getTreeList()
              }
            })
          }
        })
      } else if (this.activeName === 'second') {
        console.log(this.newArray)
        if (this.newArray.length <= 0) {
          this.$message.warning('请勾选装备！')
          return false
        } else {
          this.getConfig()
        }
      }
    },
    // 装备提交
    getConfig() {
      console.log('111')
      this.newArray.forEach(i => {
        const obj = {
          'bdnm': this.isSequencs,
          'bzs': i.BZS,
          'xys': i.XYS,
          'zb': i.ZBNM,
          'zbnm': i.ZBNM_KEY
        }
        this.alreadyDatas.push(obj)
      })
      const data = [
        ...this.alreadyDatas
      ]
      API.getConfig(data).then(res => {
        if (res.code === 200) {
          this.$message.success('提交成功')
          this.alreadyDatas = []
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onHandleDelete() {
      this.$refs.tableForm.ResetFormData()
      this.checkedData = []
    },
    // 点击树节点
    handleNodeClick(data) {
      this.forceCode = data.code
      // this.changeOnLineDataTabs()
      this.formValues = {}
      this.loading = false
      this.arr = []
      this.alreadyDatas = []
      this.isSequencs = data.code

      if (this.confirmZB === '装备') {
        this.loading2 = true
        this.getZBDTQK(data)
      } else {
        this.getFromList(data)
      }
    },
    loadBdTreeNode(node, resolve) {
      const params = {}
      params.forceSequence = node.data ? node.data.id : ''
      API.getForceTreeList(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          if (node.level === 0) {
            if (data && data.length > 0) {
              this.forceCode = data[0].code
              this.dataLoadLazy = data
              // 默认部队选中节点
              this.bdCheckedList = [data[0].code]
              this.$nextTick(() => {
                if (this.isSequence) {
                  this.$refs.treeBox.setCurrentKey(this.isSequence)
                } else {
                  this.$refs.treeBox.setCurrentKey(data[0].id)
                }
                this.expandDefault.push(this.isSequence || data[0].id)
              })
            }
          }
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 查询本单位的装备情况
    getZBDTQK(data) {
      console.log(data)
      const params = {
        forceCode: data.code
      }
      API.getZBDTQK(params).then(res => {
        const { code, msg, data } = res
        if (code === 200) {
          // 过滤器
          const result = data.filter(word => {
            if (word.checked) {
              return word.ZBNM
            }
          })
          this.newArray = data.filter(word => {
            if (word.checked) {
              return word.ZBNM
            }
          })
          const arrData = result.map(i => {
            return i.ZBNM
          })
          this.checkedData = arrData
          this.options = data

          if (data.length === this.checkedData.length) {
            this.isIndeterminate = false
          } else {
            this.isIndeterminate = true
          }
        } else {
          this.$message.error(msg)
        }
        this.loading2 = false
      })
    },
    // getTreeList() {
    //  API.getTreeList().then((res) => {
    //    this.data = res.data
    //    console.log(res.data[0])
    //
    //    this.$nextTick(() => {
    //      if (this.parentSequence) {
    //        console.log(this.parentSequence)
    //        this.$refs.treeBox.setCurrentKey(this.parentSequence)
    //      } else {
    //
    //        this.$refs.treeBox.setCurrentKey(res.data[0].id)
    //      }
    //      this.expandDefault.push(this.parentSequence || res.data[0].id)
    //    })
    //  })
    // },
    getFromList(data) {
      const arr = {
        categoryId: '',
        dataType: '',
        tableName: 'ZZLL_BD'
      }
      API.getFromList(arr).then((res) => {
        this.formList = res.data
        this.loading = true
        for (let i = 0; i < this.formList.length; i++) {
          this.formValues[this.formList[i].columnName] = ''
        }
        if (data) {
          this.isSequence = data.code
          this.parentSequence = data.id
          this.formValues.BDXH = data.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  .container-tree {
    overflow-y: scroll;
    height: calc(100vh - 213px);

  }
  .filter-data{
    display: flex;
    justify-content: space-between;
    .filter-div{
      .filter-input{
        width: 200px;
      }
      .filter-btn{
        margin-left: -4px;
      }
    }

  }
  .form-button-section {
    text-align: right;
    padding: 10px 10px 0 10px;
  }
}
</style>
