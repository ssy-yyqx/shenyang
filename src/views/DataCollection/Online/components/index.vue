<template>
  <div class="person-container">
    <div class="person-container__left">
      <div class="left-button-section">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="onHandleAddPeople"
        >新增人员</el-button>
      </div>
      <div class="left-people-section">
        <div
          v-for="item in peopleList"
          :key="item.idCardNum"
          class="people-item"
          :class="{ 'people-item__active': activePeople === item.idCardNum }"
        >
          <span class="item-text" @click="onHandleClickPeople(item)">{{
            item.name
          }}</span>
          <span
            class="del-buttn"
            @click="deletePerson(item)"
          ><i
            class="el-icon-close"
          /></span>
        </div>
      </div>
    </div>
    <div class="person-container__right">
      <div class="tab-section">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(item, tabIdex) in tabList"
            :key="tabIdex + item.tableName + 'tab'"
            :label="item.tableSimpleComment"
            :name="item.tableName"
          />
        </el-tabs>
      </div>
      <div v-loading="isLoadingForm" class="form-section">
        <Form
          v-if="!isLoadingForm && !isLoadingFormValue"
          ref="tableForm"
          :tab="activeTab"
          :form-list="formList"
          :form-values="formValues"
          :force-code="forceCode"
          :equipment-code="equipmentCode"
          :is-edit="isEdit"
        />
        <div class="form-button-section">
          <el-button
            size="small"
            type="primary"
            @click="onHandleSave()"
          >提交</el-button>
          <!-- <el-button size="small" type="primary" @click="onHandleReset()">重置</el-button> -->
          <el-button
            size="small"
            type="primary"
            @click="onHandleDelete()"
          >删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from '@/api/index'
import * as DataCollectAPI from '@/api/dataCollection.js'
import Form from './FormGenerate.vue'
import bus from '@/utils/bus'
export default {
  components: { Form },
  props: {
    secondLevel: {
      type: String,
      required: true
    },
    thirdLevel: {
      type: String,
      required: true
    },
    forceCode: {
      type: String,
      default: ''
    },
    equipmentCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      valueData: false, // 用来判断当前是否有数据
      // 左侧人员列表
      peopleList: [],
      // 当前选中的人员
      activePeople: '',
      // tab列表
      tabList: [],
      // 当前选中的tab
      activeTab: '',
      // 表单列表
      formList: [],
      // 表单数据
      formValues: {},
      // 是否正在加载表单
      isLoadingForm: false,
      // 是否正在加载表单值
      isLoadingFormValue: false
    }
  },
  computed: {
    isEdit() {
      return !!this.activePeople
    }
  },
  watch: {
    forceCode(val) {
      this.getPeopleList()
    },
    equipmentCode(val) {
      this.getPeopleList()
    }
  },
  created() {
    this.getPeopleList()
  },
  mounted() {
    if(sessionStorage.getItem('idCardNum') !== null) {
      sessionStorage.removeItem('idCardNum')
    }
    bus.$on('SFZHM_KEY', (val) => {
      //console.log(val)
      this.activePeople = val
    })

  },
  methods: {
    // 新增人员
    onHandleAddPeople() {
      // 清空选中的人员
      this.activePeople = ''
      this.getTabsByPeople()
    },
    // 获取人员列表
    getPeopleList(id) {
      const params = {
        forceCode: this.forceCode
      }
      DataCollectAPI.getPersonList(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.peopleList = data
          if (this.peopleList && this.peopleList.length > 0) {
            // 选中新增的数据
            if (id) {
              this.activePeople = id
              console.log('158',this.activePeople)
              this.getTabsByPeople(this.activePeople)
            } else {
              // 默认选中第一个
              if(this.activePeople === "") {
                this.activePeople = this.peopleList[0].idCardNum
                console.log('165activePeople',this.activePeople,'peopleList',this.peopleList)
              }else {
                                            
                this.peopleList.forEach(i=>{
                  if(i.idCardNum === this.$refs.tableForm.getFormData().SFZHM){
                    this.activePeople = i.idCardNum
                  }
                })
                console.log('173',this.activePeople)
              }
              console.log('175',this.activePeople,'this.peopleList',this.peopleList)
              this.getTabsByPeople(this.activePeople)
            }
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 点击左侧人员列表
    onHandleClickPeople(data) {
      //console.log(data)
      sessionStorage.removeItem('SFZHM_KEY')
      sessionStorage.removeItem('thirdLevel')
      //console.log(data.idCardNum)
      this.activePeople = data.idCardNum
      sessionStorage.setItem('idCardNum', data.idCardNum)
      console.log('180',data.idCardNum)
      this.getTabsByPeople(data.idCardNum)
    },
    // 删除左侧人员
    deletePerson(data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          data: [data.UNIQUE],
          tableName: this.thirdLevel
        }
        API.deleteOnLineTableList(params).then((res) => {
          const { code, msg } = res
          if (code === 200) {
            this.$message.success('删除成功！')
            this.getPeopleList()
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    // 根据人员获取tab列表
    getTabsByPeople(id) {
      console.log('207',id)
      let params = {}
      if (id) {
        params = {
          forceCode: this.forceCode,
          sfzhm: id
        }
      }
      DataCollectAPI.getTableListByPerson(params).then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          this.tabList = data
          if (this.tabList && this.tabList.length > 0) {
            // 默认选中第一个tab

            if (sessionStorage.getItem('thirdLevel')) {
              this.activeTab = sessionStorage.getItem('thirdLevel')
              //this.activePeople = sessionStorage.getItem('idCardNum')
              console.log('237',this.activePeople)
            
            } else {
              this.activeTab = this.tabList[0].tableName
            }


            this.activeTab = this.tabList[0].tableName

            this.getFormList()
            if (id) {
              console.log('227',id)
              this.getFormDetail(id)
            } else {
              this.formValues = {}
            }
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 点击tab
    handleTabClick() {
      //console.log('00')
      sessionStorage.setItem('thirdLevel', this.activeTab)
      this.getFormList()
      if (this.activePeople) {
        this.getFormDetail(this.activePeople)
      }
    },
    // 获取表单数据
    getFormList() {
      this.isLoadingForm = true
      const params = {
        tableName: this.activeTab,
        categoryId: this.secondLevel
      }
      API.getFromList(params).then((res) => {
        const { code, data, msg } = res
        if (code === 200) {
          //console.log(this.formList)
          this.formList = data
        } else {
          this.$message.error(msg)
        }
        this.isLoadingForm = false
      })
    },
    // 获取表单详情
    getFormDetail(id) {
      console.log('282',id)
      this.isLoadingFormValue = true
      const peopleItem = this.peopleList.find((item) => item.idCardNum === id)
      console.log('269',this.peopleList)
      const params = {
        dataType: this.secondLevel,
        forceCode: this.forceCode,
        categoryId: this.secondLevel,
        tableName: this.activeTab,
        data: peopleItem.UNIQUE
      }
      API.getOnLineDetail(params).then((res) => {
        //console.log(res.data)
        const { code, data, msg } = res
        if (code === 200) {
          this.formValues = data
          if (data.SFZHM_KEY) {
            sessionStorage.setItem('SFZHM_KEY', data.SFZHM_KEY)
            // 有数据
            this.valueData = false
          } else {
            // 没有数据
            this.valueData = true
            this.formValues = Object.assign(this.formValues, {
              SFZHM_KEY: sessionStorage.getItem('SFZHM_KEY')
            })
          }
        } else {
          this.$message.error(msg)
        }
        this.isLoadingFormValue = false
      })
    },
    // 提交
    onHandleSave() {
      
      this.$refs.tableForm.isValidate().then((valid) => {
        if (valid) {
          const formData = this.$refs.tableForm.getFormData()
          console.log('304',this.$refs.tableForm.getFormData())
          const saveParams = {
            data: formData,
            tableName: this.activeTab,
            forceCode: this.forceCode,
            categoryId: this.secondLevel,
            dataType: this.secondLevel
          }
          // 有数据
          if (this.activePeople && this.formValues.SFZHM_KEY && !this.valueData) {
            console.log(saveParams)
            API.editOnLineTableList(saveParams).then((res) => {
              const { code, msg } = res
              if (code === 200) {
                this.$message.success('数据修改成功')
                this.getPeopleList()
                if (this.activeTab === 'ZZLL_GJGWRY_GJGWRYLB') {
                  DataCollectAPI.getTableListByPerson({
                    forceCode: this.forceCode,
                    sfzhm: this.activePeople
                  }).then((res) => {
                    ////console.log(res.data)
                    const { code, data, msg } = res
                    if (code === 200) {
                      this.tabList = data
                    } else {
                      this.$message.error(msg)
                    }
                  })
                }
              } else {
                this.$message.error(msg)
              }
            })
          } else {
            // 没有数据
            API.saveOnlineData(saveParams).then((res) => {
              //console.log('没有数据',res.data)
              const { code, data, msg } = res
              if (code === 200) {
                this.getPeopleList(data.SFZHM)
                this.$message.success('数据采集成功')
              } else {
                this.$message.error(msg)
              }
            })
          }
        }
      })
    },
    // 重置
    onHandleReset() {},
    // 删除
    onHandleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          data: [this.formValues.UNIQUE],
          tableName: this.activeTab
        }
        API.deleteOnLineTableList(params).then((res) => {
          const { code, msg } = res
          if (code === 200) {
            this.$message.success('数据批量成功')
            this.getFormDetail(this.activePeople)
          } else {
            this.$message.error(msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.person-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  &__left {
    width: 140px;
    background: #e7e9ef;
    border-radius: 2px;
    .left-button-section {
      width: 100%;
      text-align: center;
      padding: 10px;
    }
    .left-people-section {
      height: calc(100% - 55px);
      overflow-y: auto;
      .people-item {
        margin: 5px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &__active {
          color: #409eff;
        }
        .item-text {
          padding: 0 10px;
        }
        .del-buttn {
          padding: 0 10px;
        }
      }
    }
  }
  &__right {
    width: calc(100% - 160px);
    .tab-section {
      width: 100%;
      height: 45px;
    }
    .form-section {
      width: 100%;
      height: calc(100% - 45px);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px 10px 0 0;
    }
    .form-button-section {
      text-align: right;
      padding: 10px 10px 0 10px;
    }
  }
}
</style>
