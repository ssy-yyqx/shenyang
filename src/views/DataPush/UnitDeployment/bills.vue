<template>
  <el-dialog
      v-loading="loading2"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      style="margin-bottom:12px;padding:9px 20px;" 
    title="制作部署表"
    :visible.sync="dialogVisibles"
    width="66%"
    :close-on-click-modal="false"
    custom-class="qiefen-dialog-class"
  >
    <div class="content">
      <div class="center">
        <div class="one">
          <div class="oneTop">
            <el-form ref="formLabelAlign" :rules="themeRules" class="oneTopContents" :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
              <el-form-item label="部署表名称：" class="item1" prop="deploymentTableName">
                <el-input
                  v-model="formLabelAlign.deploymentTableName"
                  placeholder="请输入部署表名称"
                  @blur="checkBlur($event)"
                  @change="name"
                />
              </el-form-item>
              <el-form-item label="部署表描述：" prop="deploymentTableDescribe">
                <el-input
                  v-model="formLabelAlign.deploymentTableDescribe"
                  placeholder="请输入部署表描述"
                  @blur="checkBlurs($event)"
                  @change="describe"
                />
              </el-form-item>
            </el-form>
            <div class="oneTopContents" style="width: 100%;margin-right: 10px;">
              <p>选择主要部队：</p>
              <el-select
                v-model="mineStatus"
                class="form-input"
                style="width: 100%;"
                @change="selectChange"
              >
                <el-option style="height: auto;" :value="mineStatusValue">
                  <el-tree
                    ref="tree"
                    :data="dataTreeList"
                    highlight-current
                    node-key="id"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                  />
                </el-option>
              </el-select>
            </div>
            <!-- <div class="oneTopContents">
              <p>选择主要装备：</p>
              <el-select
                v-model="value1"
                class="select-style"
                multiple
                placeholder="请选择主要装备"
                @change="searchSelect"
              >
                <el-option
                  v-for="item in options"
                  :key="item.ZBNM"
                  :label="item.ZBNM"
                  :value="item.ZBNM"
                />
              </el-select>
            </div> -->
          </div>
        </div>
        <!-- <div class="table">
          <div class="table-section">
            <el-table
              ref="multipleSelection"
              :data="tableData"
              border
              stripe
              style="width:100%;height: 100%;overflow-y: auto"
              :header-cell-style="{ background: '#1F7FD8', color: '#F8F8F8' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column
                label="单位名称"
                prop="BDNM"
                align="center"
                min-width="110px"
                show-overflow-tooltip
              />
              <el-table-column
                label="战备名称"
                prop="ZBNM"
                align="center"
                min-width="110px"
                show-overflow-tooltip
              />
              <el-table-column
                label="编制数"
                prop="BZS"
                align="center"
                min-width="110px"
                show-overflow-tooltip
              />
              <el-table-column
                label="现有数"
                prop="XYS"
                align="center"
                min-width="120px"
                show-overflow-tooltip
              />
            </el-table>
          </div>
        </div> -->
        <div v-if="isShow" class="pfdss">
          <!-- <pdf
            class="pfds"
            :src="pdfData"
          /> -->
          <iframe :src="pdfData" width="100%" height="100%" />
        </div>
        <div class="bottom">
          <!-- <el-button class="btn" @click="deploymentTable">预览</el-button> -->
          <el-button
            class="btn"
            type="primary"
            @click="getInserts"
          >提交</el-button>
        </div>
      </div>

    </div>
  </el-dialog>
</template>

<script>
// import ContainerSeven from '@/components/ContainerSeven'
import pdf from 'vue-pdf'
import * as API from '@/api/index'
export default {
  components: { pdf },
  props: { dialogVisible: Boolean },
  data() {
    return {
      loading2:false,
      isShow: false,
      labelPosition: 'top',
      dialogVisibles: this.dialogVisible,
      alldata: {},
      formLabelAlign: {
        deploymentTableName: '', // 文本域的内容
        deploymentTableDescribe: '' // 文本域的内容
      },
      themeRules: {
        deploymentTableName: [{ required: true, message: '请输入部署表名称', trigger: 'blur' }],
        deploymentTableDescribe: [{ required: true, message: '请输入部署表描述', trigger: 'blur' }]
      },
      deploymentTableDate: '', // 数据时间
      multipleSelection: [],
      options: [], // 装备
      dataTreeList: [], // 部队
      field: '', // 部队的field
      mineStatus: '',
      mineStatusValue: {},
      defaultProps: {
        children: 'childList',
        label: 'label'
      },
      value: '',
      value1: '',
      //   表格数据
      tableData: [],
      tableDatas: [],
      label: '', // 动态显示title
      pageNum: '', // 当前页码
      pageSize: '', // 一页几条
      ZBNM: '', // 装备名称
      primaryEquipmentEntities: [], // 装备信息
      pdfData: '',
      deploymentTableId: ''
    }
  },
  watch: {
    dialogVisible(val) {
      this.dialogVisibles = val
    },
    dialogVisibles(val) {
      if (!val) {
        this.$emit('dialogVisibleFalse')
      }
    }
  },
  created() {
    this.getTreeList()
  },
  methods: {
    close() {
      const routeData = this.$router.resolve({
        path: `/DataPush/unitDeployment`
      })
      window.open(routeData.href, '_self')
      window.close()
    },
    // 部署表名称change方法：
    name() {
      // console.log(this.deploymentTableName);
    },
    // 部署表名称
    checkBlur(e) {
      this.formLabelAlign.deploymentTableName = e.target.value
    },
    // 部署表描述
    checkBlurs(e) {
      this.formLabelAlign.deploymentTableDescribe = e.target.value
    },
    // 部署表描述change方法：
    describe() {
      // console.log(this.deploymentTableDescribe);
    },
    // 数据时间change方法：
    dateTime() {
      // console.log(this.deploymentTableDate);
    },
    // 生成部署单位表
    deploymentTable() {
      this.$refs.formLabelAlign.validate((valid) => {
        if (valid) {
          // if (this.multipleSelection.length === 0) {
          //   this.$message.error('请勾选要生成的部署表')
          //   return
          // }
          const data = {
            deploymentTableName: this.formLabelAlign.deploymentTableName,
            deploymentTableDescribe: this.formLabelAlign.deploymentTableDescribe,
            forceCode: this.field,
            primaryEquipmentEntities: this.primaryEquipmentEntities
          }
          API.getLook(data).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.isShow = true
              this.pdfData = res.data
            } else {
              // this.$message.error(res.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击保存显示装备名称
    // save() {
    //   this.primaryEquipmentEntities = []
    //   this.tableData = []
    //   this.ZBNM.forEach(i => {
    //     this.options.forEach(item => {
    //       if (i === item.ZBNM) {
    //         console.log(i, item.ZBNM)

    //         const obj = {}
    //         this.$set(obj, 'BDNM', item.BDNM)
    //         this.$set(obj, 'ZBNM', item.ZBNM)
    //         this.$set(obj, 'BZS', item.BZS)
    //         this.$set(obj, 'XYS', item.XYS)
    //         this.tableData.push(obj)
    //         console.log(this.tableData)

    //         const Entities = {}
    //         this.$set(Entities, 'bdnm', item.BDNM_KEY)
    //         this.$set(Entities, 'zb', item.ZBNM)
    //         this.$set(Entities, 'bzs', item.BZS)
    //         this.$set(Entities, 'xys', item.XYS)
    //         this.primaryEquipmentEntities.push(Entities)
    //       }
    //     })
    //   })

    //   this.$set(this.alldata, 'deploymentTableName', this.formLabelAlign.deploymentTableName)
    //   this.$set(
    //     this.alldata,
    //     'deploymentTableDescribe',
    //     this.formLabelAlign.deploymentTableDescribe
    //   )
    //   this.$set(this.alldata, 'deploymentTableDate', this.deploymentTableDate)

    //   // this.value1 = ''
    //   // this.deploymentTableName = ''
    //   // this.deploymentTableDescribe = ''
    //   // this.deploymentTableDate = ''
    //   // this.primaryEquipmentEntities = []
    //   console.log(this.primaryEquipmentEntities)
    // },

    // 点击重置清空输入框
    reset() {
      this.value1 = ''
      this.formLabelAlign.deploymentTableName = ''
      this.formLabelAlign.deploymentTableDescribe = ''
      this.mineStatus = ''
      this.tableData = []
      this.pdfData = ''
    },

    // 点击下拉框触发的事件
    // searchSelect(value) {
    //   // 拿到输入框输入的值
    //   this.ZBNM = value
    //   this.save()
    // },

    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 查询本单位的部队情况
    getTreeList() {
      API.getTreeList().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.dataTreeList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 点击部队下拉框事件
    selectChange(e) {
      console.log(e)
      var arrNew = []
      var dataLength = this.mineStatusValue.length
      var eleng = e.length
      for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < eleng; j++) {
          if (e[j] === this.mineStatusValue[i].label) {
            arrNew.push(this.mineStatusValue[i])
          }
        }
      }
      this.$refs.tree.setCheckedNodes(arrNew)// 设置勾选的值
    },
    // 点击tree复选框事件
    handleNodeClick(data) {
      this.mineStatusValue = data
      this.field = data.field
      this.mineStatus = data.label
      this.getZBDTQK(data)
    },

    // 查询本单位的装备情况
    getZBDTQK(data) {
      // console.log(data)

      const params = {
        forceCode: data.field
      }
      API.getZBDTQK(params).then(res => {
        const { code, msg, data } = res
        // console.log(res)

        if (code === 200) {
          this.options = data
        } else {
          this.$message.error(msg)
        }
      })
    },

    // 提交部署表
    getInserts() {
      this.loading2 = true
      console.log(this.formLabelAlign.deploymentTableName, this.formLabelAlign.deploymentTableDescribe)

      // console.log(this.$refs.formLabelAlign)
      this.$refs.formLabelAlign.validate((valid) => {
        if (valid) {
          const data = {
            deploymentTableName: this.formLabelAlign.deploymentTableName,
            deploymentTableDescribe: this.formLabelAlign.deploymentTableDescribe,
            forceCode: this.field,
            primaryEquipmentEntities: this.primaryEquipmentEntities
          }
          API.getInsert(data).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$emit('dialogVisibleFalse', !this.dialogVisible)
              this.loading2 = false
              this.$message.success(res.msg)
              this.reset()
              this.isShow = false
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
>>> .el-button--primary{
  background-color: #1f7cd7;
}
>>> .qiefen-dialog-class{
  width: 50% !important;
  margin-top: 10vh !important;
}
>>> .el-dialog__body{
  height:311px;
}
.content {
  // width: 50%;
  border-radius: 5px;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  position: relative;
  // .top {
  //   height: 56px;
  //   line-height: 56px;
  //   font-size: 15px;
  //   padding-left: 18px;
  //   border-bottom: 1px solid #e5e5e5;
  // }
  .center {
    padding: 10px;
    height: calc(100vh - 643px);
    //border-bottom: 1px solid #e5e5e5;
    .one {
      width: 100%;

      //border: 1px solid #e5e5e5;
      padding: 6px 9px;
      margin-bottom: 16px;
      position: relative;
      .oneTop {
        width: 100%;

        .oneTopContents {
          .item1{
            margin-right: 10px;

          }
          .select-style {
            width: 100%;
            .el-input__inner {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
              border: 1px solid #a1a3ad;
              border-left-width: 0;
              background-color: rgba(0, 0, 0, 0.8);
              font-size: 0.28rem;
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }
        >>> .el-form--label-top .el-form-item__label{
          padding: 0;
          font-weight: normal;
          line-height: 27px;
        }
        >>> .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
          width: 100%;
        }
        // div:nth-child(1),
        // div:nth-child(3) {
        //   margin-right: 10px;
        //   width: 48%;
        // }
      }
      .oneBtm {
        width: 141px;
        position: absolute;
        right: 14px;
        bottom: 10px;
        .btn {
          width: 62px;
          height: 30px;
          font-size: 12px;
          line-height: 30px;
        }
      }
    }
    .table {
      position: relative;
      margin-left: 10px;
      margin-right: 10px;
      height: 292px;
      border-bottom: 1px solid #e5e5e5;
      .table-section {
        width: 100%;
        max-height: 237px;
        overflow: scroll;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .table-Btm {
        width: 181px;
        position: absolute;
        right: -5px;
        bottom: 10px;
        .btn {
          width: 62px;
          height: 30px;
          font-size: 12px;
          line-height: 30px;
        }
        button:nth-child(2) {
          width: 100px;
        }
      }
    }
    .pfdss{
      width:100%;
      height:calc(100vh - 527px);
      overflow: auto;
      .pfds {
      width:100%;height:100%;
        >>> canvas{
          height: 100% !important;
        }
      }
    }
  }
  .bottom {
   float: right;
    .btn {
      width: 62px;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
    }
  }
}
</style>
