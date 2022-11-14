<template>
  <ContainerSeven>
    <div class="content">
      <div class="top">
        {{ label != undefined ? '编辑部署表' : '制作部署表' }}
      </div>
      <div class="center">
        <div class="one">
          <div class="oneTop">
            <div class="oneTopContents">
              <p>部署表名称：</p>
              <el-input
                v-model="deploymentTableName"
                class="resizeNone"
                type="textarea"
                style="resize: none;"
                :rows="1"
                placeholder="请输入部署表名称"
                @change="name"
              />
            </div>
            <div class="oneTopContents">
              <p>部署表描述：</p>
              <el-input
                v-model="deploymentTableDescribe"
                class="resizeNone"
                type="textarea"
                style="resize: none;"
                :rows="1"
                placeholder="请输入部署表描述"
                @change="describe"
              />
            </div>
            <div class="oneTopContents">
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
            </div>
            <div class="oneTopContents">
              <p>数据时间：</p>
              <el-date-picker
                v-model="deploymentTableDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
                type="datetime"
                placeholder="选择日期"
                @change="dateTime"
              />
              <!-- <el-select v-model="value" placeholder="请选择数据时间">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
            </div>
          </div>
          <div class="oneBtm">
            <el-button class="btn" @click="reset">重置</el-button>
            <el-button class="btn" @click="save">保存</el-button>
          </div>
        </div>
        <div class="table">
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
          <div class="table-Btm">
            <el-button class="btn" @click.prevent="delData()">刪除</el-button>
            <el-button
              class="btn"
              @click="deploymentTable"
            >生成部署单位</el-button>
          </div>
        </div>
        <!-- <div class="table2">
          <div class="table-section">
            <el-table
              :data="tableDatas"
              border
              stripe
              style="width:100%;height: 100%;overflow-y: auto"
              :header-cell-style="{background:'#1F7FD8',color:'#F8F8F8'}"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                label="单位名称"
                prop="q"
                align="center"
                min-width="110px"
                show-overflow-tooltip
              />

              <el-table-column label="人员实力" align="center">
                <el-table-column
                  label="编制"
                  prop="w"
                  align="center"
                  min-width="120px"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="现有"
                  prop="e"
                  align="center"
                  min-width="120px"
                  show-overflow-tooltip
                />
              </el-table-column>

              <el-table-column label="主要装备" align="center">
                <el-table-column
                  label="装备名称"
                  prop="r"
                  align="center"
                  min-width="120px"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="编制"
                  prop="t"
                  align="center"
                  min-width="120px"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="现有"
                  prop="y"
                  align="center"
                  min-width="120px"
                  show-overflow-tooltip
                />
              </el-table-column>

              <el-table-column
                label="部署位置"
                prop="u"
                align="center"
                min-width="110px"
                show-overflow-tooltip
              />
            </el-table>
          </div>
        </div>-->
        <!-- <div class="table2"> -->
        <pdf
          style="width:746px;height:134px;margin-left:100px"
          :src="pdfData"
        />
        <!-- </div> -->
      </div>
      <div class="bottom">
        <el-button class="btn" @click="close()">取消</el-button>
        <el-button
          class="btn"
          type="primary"
          @click="getInserts"
        >提交</el-button>
      </div>
    </div>
  </ContainerSeven>
</template>

<script>
import ContainerSeven from '@/components/ContainerSeven'
import pdf from 'vue-pdf'
import * as API from '@/api/index'
export default {
  components: { ContainerSeven, pdf },
  data() {
    return {
      alldata: {},
      deploymentTableName: '', // 文本域的内容
      deploymentTableDescribe: '', // 文本域的内容
      deploymentTableDate: '', // 数据时间
      multipleSelection: [],
      options: [],
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
  created() {
    // 动态控制title
    this.label = this.$route.query.label
    this.pageNum = this.$route.query.pageNum
    this.pageSize = this.$route.query.pageSize
    this.deploymentTableId = this.$route.query.deploymentTableId

    // console.log(this.label)

    // 查询本单位的装备情况
    if (this.label === '操作') {
      // console.log(this.label, '编辑部署表')
      this.getDeploymentTableId()
    } else {
      this.getZBDTQK()
      // console.log('制作部署表')
    }
  },
  methods: {
    close() {
      const routeData = this.$router.resolve({
        path: `/DataPush/unitDeployment`
      })
      window.open(routeData.href, '_self')
      window.close()
    },

    // 删除选中行
    delData() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const val = this.multipleSelection
        val.forEach((val, index) => {
          this.tableData.forEach((v, i) => {
            if (val.ZBNM === v.ZBNM) {
              // console.log(val, this.tableData)
              // console.log(val.ZBNM, v.ZBNM)
              // console.log(i, 1)

              // i 为选中的索引
              this.tableData.splice(i, 1)
            }
          })
        })
      }
      // 删除完数据之后清除勾选框
      this.$refs.multipleSelection.clearSelection()
    },

    // 部署表名称change方法：
    name() {
      // console.log(this.deploymentTableName);
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
      console.log(this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选要生成的部署表')
        return
      }

      const data = {
        deploymentTableName: this.alldata.deploymentTableName,
        deploymentTableDescribe: this.alldata.deploymentTableDescribe,
        deploymentTableDate: this.alldata.deploymentTableDate,
        primaryEquipmentEntities: this.primaryEquipmentEntities
      }
      console.log(data)
      API.getLook(data).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.pdfData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      // 清空表格数据
      this.tableData = []
      // this.primaryEquipmentEntities = []
      // console.log(this.primaryEquipmentEntities)
    },

    // 点击保存显示装备名称
    save() {
      // console.log(this.ZBNM, this.options)
      this.primaryEquipmentEntities = []
      this.ZBNM.forEach(i => {
        this.options.forEach(item => {
          if (i === item.ZBNM) {
            console.log(i, item.ZBNM)

            const obj = {}
            this.$set(obj, 'BDNM', item.BDNM)
            this.$set(obj, 'ZBNM', item.ZBNM)
            this.$set(obj, 'BZS', item.BZS)
            this.$set(obj, 'XYS', item.XYS)
            this.tableData.push(obj)
            const Entities = {}
            this.$set(Entities, 'bdnm', item.BDNM_KEY)
            this.$set(Entities, 'zb', item.ZBNM)
            this.$set(Entities, 'bzs', item.BZS)
            this.$set(Entities, 'xys', item.XYS)
            this.primaryEquipmentEntities.push(Entities)
          }
        })
      })

      this.$set(this.alldata, 'deploymentTableName', this.deploymentTableName)
      this.$set(
        this.alldata,
        'deploymentTableDescribe',
        this.deploymentTableDescribe
      )
      this.$set(this.alldata, 'deploymentTableDate', this.deploymentTableDate)

      this.value1 = ''
      this.deploymentTableName = ''
      this.deploymentTableDescribe = ''
      this.deploymentTableDate = ''
      // this.primaryEquipmentEntities = []
      console.log(this.primaryEquipmentEntities)
    },

    // 点击重置清空输入框
    reset() {
      this.value1 = ''
      this.deploymentTableName = ''
      this.deploymentTableDescribe = ''
      this.deploymentTableDate = ''
    },

    // 点击下拉框触发的事件
    searchSelect(value) {
      // 拿到输入框输入的值
      this.ZBNM = value
    },

    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 查询本单位的装备情况
    getZBDTQK() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      API.getZBDTQK(params).then(res => {
        const { code, msg, rows } = res
        if (code === 200) {
          this.options = rows
        } else {
          this.$message.error(msg)
        }
      })
    },

    // 编辑本单位的装备情况
    getDeploymentTableId() {
      const params = {
        deploymentTableId: this.deploymentTableId
      }
      console.log(params)

      API.getDeploymentTableId(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.deploymentTableName = res.data.deploymentTableName
          this.deploymentTableDescribe = res.data.deploymentTableDescribe
          this.value1 = res.data.primaryEquipmentEntities.map(i => {
            return i.zb
          })
          this.deploymentTableDate = res.data.deploymentTableDate
          const dataList = []
          res.data.armyInfoEntities.forEach(item => {
            const items = res.data.primaryEquipmentEntities.find(item1 => item1.bzs === item.bzs)
            dataList.push({
              BDNM: item.bd,
              ZBNM: items.zb,
              BZS: item.bzs,
              XYS: item.xys
            })
          })
          this.$refs.multipleSelection.toggleAllSelection()
          this.tableData = dataList
          this.pdfData = res.data.pdfFileName
          for (let i = 0; i < res.data.primaryEquipmentEntities.length; i++) {
            // console.log(res.data.primaryEquipmentEntities[i])
            const newObject = {}
            newObject.bdnm = res.data.primaryEquipmentEntities[i].bdnm
            newObject.zb = res.data.primaryEquipmentEntities[i].zb
            newObject.bzs = res.data.primaryEquipmentEntities[i].bzs
            newObject.xys = res.data.primaryEquipmentEntities[i].xys
            this.primaryEquipmentEntities.push(newObject)
          }
          this.getZBDTQK()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 提交部署表
    getInserts() {
      // console.log(this.primaryEquipmentEntities)
      if (this.label === '操作') {
        // console.log(this.label, '编辑部署表')
        const params = {
          deploymentTableId: this.deploymentTableId,
          deploymentTableName: this.deploymentTableName,
          deploymentTableDescribe: this.deploymentTableDescribe,
          deploymentTableDate: this.deploymentTableDate,
          primaryEquipmentEntities: this.primaryEquipmentEntities
        }
        console.log(params, typeof (params))
        API.getUpdate(params).then(res => {
          console.log(res)
          if (res.code === 200) {
            const { href } = this.$router.resolve({ path: '/DataPush/unitDeployment' })
            window.open(href, '_blank')
            window.close()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        const data = {
          deploymentTableName: this.alldata.deploymentTableName,
          deploymentTableDescribe: this.alldata.deploymentTableDescribe,
          deploymentTableDate: this.alldata.deploymentTableDate,
          primaryEquipmentEntities: this.primaryEquipmentEntities
        }
        // console.log(this.primaryEquipmentEntities)
        API.getInsert(data).then(res => {
        // console.log(res)
          if (res.code === 200) {
          // debugger
            const { href } = this.$router.resolve({ path: '/DataPush/unitDeployment' })
            window.open(href, '_blank')
            window.close()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.content {
  width: 50%;
  border-radius: 5px;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  position: relative;
  .top {
    height: 56px;
    line-height: 56px;
    font-size: 15px;
    padding-left: 18px;
    border-bottom: 1px solid #e5e5e5;
  }
  .center {
    padding: 10px;
    height: calc(100vh - 128px);
    border-bottom: 1px solid #e5e5e5;
    .one {
      width: 100%;
      height: 180px;
      border: 1px solid #e5e5e5;
      padding: 6px 9px;
      margin-bottom: 16px;
      position: relative;
      .oneTop {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        height: 72px;
        .oneTopContents {
          width: 50%;
          height: 66px;
          line-height: 27px;
          font-size: 12px;
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
        div:nth-child(1),
        div:nth-child(3) {
          margin-right: 10px;
          width: 48%;
        }
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
    .table2 {
      margin-top: 17px;
      position: relative;
      margin-left: 10px;
      margin-right: 10px;
      height: 262px;
    }
  }
  .bottom {
    width: 139px;
    position: absolute;
    right: 12px;
    margin-top: 10px;
    .btn {
      width: 62px;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
    }
  }
}
</style>
