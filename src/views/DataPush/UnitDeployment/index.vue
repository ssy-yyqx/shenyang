<template>
  <Container>
    <div class="total-section">
      <div class="top-section">
        <el-button @click="getDelete">
          <img class="img" src="@/icons/newImages/deleteButton.png">
          <span>删除</span>
        </el-button>
        <el-button :disabled="madeButtonDisabled" @click="goBill">
          <img class="img" src="@/icons/newImages/添加 (1).png">
          <span>制作部署表</span>
        </el-button>
        <el-button :disabled="deploymentButtonDisabled" @click="getMergeDeploymentTable">
          <img class="img" src="@/icons/newImages/合并.png">
          <span>合并部署表</span>
        </el-button>
        <el-button :disabled="compareButtonDisabled" @click="compare">
          <img class="img" src="@/icons/newImages/compare.png">
          <span>对比部署表</span>
        </el-button>
        <div style="float: right;display: flex;height: 40px;">
          <el-input v-model="deploymentTableName" size="large" placeholder="请输入部署表名称" prefix-icon="el-icon-search" />
          <el-button slot="append" style="background:#1f7cd7;height: 32px;width:63px;color:white;border: 0;border-top-left-radius: 0px;border-bottom-left-radius: 0px;" @click="search">搜 索</el-button>
        </div>
      </div>
      <div class="table-section">
        <el-table
          ref="multipleSelection"
          :data="tableData"
          border
          stripe
          :index="indexMethod"
          style="width:100%;height: 100%;overflow-y: auto"
          :header-cell-style="{ background: '#1F7FD8', color: '#F8F8F8' }"
          :row-key="getRowKey"
          @select="onTableSelect"
          @selection-change="handleSelectionChange"
          @select-all="selectAll"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55" align="center" />
          <el-table-column
            label="部署表名称"
            prop="deploymentTableName"
            align="center"
            min-width="120px"
            show-overflow-tooltip
          />
          <el-table-column
            label="部署表描述"
            prop="deploymentTableDescribe"
            align="center"
            min-width="120px"
            show-overflow-tooltip
          />
          <el-table-column
            label="数据时间"
            prop="deploymentTableDate"
            align="center"
            min-width="120px"
            show-overflow-tooltip
          />
          <el-table-column
            label="创建人"
            prop="createBy"
            align="center"
            min-width="120px"
            show-overflow-tooltip
          />
          <el-table-column
            label="创建时间"
            prop="createTime"
            align="center"
            min-width="120px"
            show-overflow-tooltip
          />
          <!--
            <el-table-column
            label="状态"
            prop="status"
            align="center"
            min-width="120px"
            show-overflow-tooltip
            :formatter="stateFormat"
          />
          -->
          <el-table-column label="操作" align="center" width="340">
            <template slot-scope="scope">
              <el-button
                class="aStyle"
                type="text"
                size="mini"
                @click="onHandleDetail(scope)"
              >查看</el-button>
              <!-- <el-button
                :ref="`myp${scope.$index}`"
                class="aStyle"
                type="text"
                size="mini"
                @click="onHandleEdit(scope)"
              >编辑</el-button> -->
              <el-button
                class="aStyle"
                type="text"
                size="mini"
                @click="onHandleProcessTask(scope)"
              >上报</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-section">
        <el-pagination
          :current-page="pager.pageNum"
          :page-sizes="pager.pageSizes"
          :page-size="pager.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pager.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :title="dialogFormTitle"
        width="40%"
        custom-class="qiefen-dialog-class"
        @close="closeToolForm"
      >
        <div class="transfer">
          <!-- 左框 -->
          <div class="list left">
            <el-tree
              v-if="dialogFormVisible"
              ref="sendTree"
              node-key="id"
              :expand-on-click-node="true"
              :auto-expand-parent="false"
              :props="defaultProps"
              :filter-node-method="filterNode"
              :load="loadNode"
              lazy
              @node-click="handleNodeClick"
            />
          </div>
          <!-- 添加/删除 -->
          <div class="content">
            <el-button icon="el-icon-d-arrow-right" circle @click="push" />
            <br>
            <br>
            <el-button icon="el-icon-d-arrow-left" circle @click="del" />
          </div>
          <!-- 右框 -->
          <div class="list right">
            <template v-for="(item,index) in pros">
              <li :key="index" ref="bgc" class="lis">
                <div :id="item" style="cursor:pointer" @click="addArr(item,index)">{{ item }}</div>
                <!-- <a>{{item}}</a> -->
              </li>
            </template>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" class="btn_theme" style="background:#1f7cd7" @click="onhandleToolSave">确 定</el-button>
          <el-button @click="closeToolForm">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <Bills v-if="dialogVisible" :dialog-visible="dialogVisible" @dialogVisibleFalse="dialogVisibleFalse" />
    <Checks v-if="visibleDialogChecks" :visible-dialog-checks="visibleDialogChecks" :deployment-table-id="deploymentTableId" @visibleDialogCheckFalse="visibleDialogCheckFalse" />
    <Compare
      v-if="visibleDialogCompare"
      :visible-dialog-compare="visibleDialogCompare"
      :ids="ids"
      @visibleDialogComparesFalse="visibleDialogComparesFalse"
    />
  </Container>
</template>

<script>
import Container from '@/components/Container'
import * as API from '@/api/index'
import Bills from './bills'
// import Edit from './edit'
import Checks from './checks'
import Compare from './compare'
export default {
  components: { Container, Bills, Checks, Compare },
  data() {
    return {
      madeButtonDisabled:false,
      deploymentButtonDisabled:false,
      compareButtonDisabled:false,

      createTime: '',
      deploymentTableName: '',
      dialogVisible: false, // 制作
      VisibleDialog: false, // 编辑
      visibleDialogChecks: false, // 查看
      visibleDialogCompare: false, // 对比
      pros: [], // 右边框的数据
      defaultProps: {
        children: 'children',
        label: 'forceNumber'
      },
      data: [], // 左框数据
      dialogFormVisible: false, // 单位部署表弹出框
      dialogFormTitle: '单位部署表上报',
      tableData: [],
      multipleSelection: [],
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      deploymentTableId: '', // 表格id
      ids: [],
      pushData: [],
      rightData: [],
      selectName: '',
      colors: true,
      rightForceCode: [],
      rowData: {},
      pdfData: '',
      dataPdf: []

    }
  },
  created() {
    // 查询所有部署表
    this.getDeploymentTables()
  },
  mounted() {

  },
  methods: {
    // 对比部署表
    compare() {
      if (this.multipleSelection.length <= 0 || this.multipleSelection.length === 1) {
        this.$message.error('请选择两个或两个以上的部署表！')
        return
      }
      this.visibleDialogCompare = !this.visibleDialogCompare
    },
    search() {
      this.getDeploymentTables()
    },
    dialogVisibleFalse(val) {
      this.dialogVisible = val
      this.VisibleDialog = val
      this.getDeploymentTables()
    },
    visibleDialogCheckFalse(val) {
      this.visibleDialogChecks = val
    },
    visibleDialogComparesFalse(val) {
      this.visibleDialogCompare = val
      this.ids = []
      this.$refs.multipleSelection.clearSelection()
      // this.getDeploymentTables()
    },
    // 动态渲染状态
    stateFormat(row, column) {
      if (row.status === '1') {
        return '未上报'
      } else {
        return '已上报'
      }
    },
    // 查询所有部署表
    getDeploymentTables() {
      const params = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        deploymentTableName: this.deploymentTableName
      }
      // console.log(params);
      API.getDeploymentTables(params).then(res => {
        // console.log(res)
        const { code, msg, data } = res
        if (code === 200) {
          this.tableData = data.list
          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },

    // 表格相关=====================================================
    // index配置
    indexMethod(index) {
      return index + this.pager.pageSize * (this.pager.pageNum - 1) + 1
    },
    getRowKey(row) {
      return row.createTime
    },
    //表格全选操作
    selectAll(rows){
      if(rows.length>0){
        this.madeButtonDisabled = true
        this.deploymentButtonDisabled = true
        this.compareButtonDisabled = true
      }else{
        this.madeButtonDisabled = false
        this.deploymentButtonDisabled = false
        this.compareButtonDisabled = false
      }
    },
    onTableSelect(rows, row) {
      // 判断当前是否选中
      const selected = rows.length > 0 && rows.indexOf(row) !== -1
      if (rows.length > 0) {
        console.log(rows.length)

        const params = {
          deploymentTableId: row.deploymentTableId,
          type: 'PDF'
        }
        API.getDeploymentTable(params).then(res => {
          if (res.code === 200) {
            this.pdfData = res.data
            if (selected) {
              this.ids.push({
                deploymentTableIds: row.deploymentTableId,
                deploymentTableName: row.deploymentTableName,
                pdfFileName: this.pdfData
              })
            } else {
              this.ids.forEach((item, index) => {
                if (item.deploymentTableName === row.deploymentTableName) {
                  this.ids.splice(index, 1)
                }
              })
            }
            console.log(this.ids)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else if (rows.length === 0) {
        this.ids = []
      }
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getDeploymentTables()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.pager.pageNum = val
      this.getDeploymentTables()
    },
    // 点击前往部署表
    goBill() {
      // console.log(val)
      this.dialogVisible = !this.dialogVisible

      // const routeData = this.$router.resolve({
      //   path: '/bill',
      //   query: {
      //     pageNum: this.pager.pageNum,
      //     pageSize: this.pager.pageSize
      //   }
      // })
      // window.open(routeData.href, '_blank')
      // window.close()
    },

    // 点击前往编辑
    // onHandleEdit(val) {
    //   this.VisibleDialog = !this.VisibleDialog
    //   this.deploymentTableId = val.row.deploymentTableId
    // },

    // 点击前往查看
    onHandleDetail(val) {
      this.visibleDialogChecks = !this.visibleDialogChecks
      this.deploymentTableId = val.row.deploymentTableId
    },
    // 点击上报弹出模态框
    onHandleProcessTask(val) {
      console.log(val)
      const params = {
        deploymentTableIds: val.row.deploymentTableId
      }
      API.reportDeploymentTable(params).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
      // this.rowData = val.row

      // // 新增的表单
      // this.toolTitle = '单位部署表上报'
      // this.dialogFormVisible = true
    },
    // 点击确定
    onhandleToolSave() {
      // this.currentRow.isSend = true
      // this.$set(this.tableData, this.currentRow.$index, this.currentRow)
      // this.pros = [];
      // const forceCode = []

      // let tableCommit = ''
      // let tableName = ''
      // this.tableData.map(i => {
      //   tableCommit = i.deploymentTableDescribe
      //   tableName = i.deploymentTableName
      // })

      if (this.pushData.length === 0) {
        return this.$message.error('请选择要上报的任务')
      }

      const data = {
        forceCodes: this.rightForceCode,
        tableCommit: this.rowData.deploymentTableDescribe,
        tableName: this.rowData.deploymentTableName
      }
      console.log(data)

      API.getAssign(data).then(res => {
        // console.log(res);
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.pushData = []
          this.rightForceCode = []
        } else {
          this.$message.error(res.msg)
        }
      })

      this.dialogFormVisible = false

      if (this.$refs.sendTree !== undefined) {
        this.$refs.sendTree.setCheckedKeys([])
      }
    },

    // // 点击确定
    // onhandleToolSave() {
    //   this.dialogFormVisible = false
    //   this.pros = []
    //   if (this.$refs.sendTree !== undefined) {
    //     this.$refs.sendTree.setCheckedKeys([])
    //   }
    // },
    // 关闭模态框
    closeToolForm() {
      this.dialogFormVisible = false
      this.pros = []
      if (this.$refs.sendTree !== undefined) {
        this.$refs.sendTree.setCheckedKeys([])
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 点击树的下一个节点
    handleNodeClick(data) {
      this.data = data
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        const res = await API.getSubordinateInfo()
        return resolve(res.data)
      }
      if (node.level > 1) return resolve([])
      API.getSubordinateInfo({ forceSequence: node.data.forceSequence }).then(res => {
        if (res.code === 200) {
          // this.tableData = res.data
          resolve(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // getPros(data, keys) {
    //   for (let i = 0; i < data.length; i++) {
    //     const obj = data[i]
    //     const id = obj.id
    //     const key = obj.label
    //     if (keys.indexOf(id) !== -1) {
    //       const children = obj.children
    //       if (children && children.length > 0) {
    //         this.getPros(children, keys)
    //       } else {
    //         if (this.pros.indexOf(key) === -1) {
    //           this.pros.push(key)
    //         }
    //       }
    //     } else {
    //       continue
    //     }
    //   }
    // },
    // 往右边框添加左边框的东西
    push() {
      this.getPros()
    },
    getPros() {
      if (this.pushData.indexOf(this.data.id) === -1) {
        this.pushData.push(this.data.id)
        this.rightForceCode.push(this.data.forceCode)
        this.pros.push(this.data.forceNumber)

        // console.log(this.data.id,this.data.forceNumber,this.pushData);
      } else {
        this.$message.error('已存在数据')
        return
      }
    },
    // 移除数据
    del() {
      var treeDeleteList = []
      this.pros.forEach(i => {
        console.log(this.pros, this.rightData)

        var isHave = this.rightData.some(j => {
          return i === j
        })
        console.log(isHave)

        if (!isHave) {
          treeDeleteList.push(i)
          console.log(treeDeleteList)
        }
      })
      this.pros = [...treeDeleteList]
      this.pushData = []
    },
    addArr(value, index) {
      if (this.colors) {
        // console.log(this.colors);

        this.$refs.bgc[index].style.background = '#1f7fd8'
        this.$refs.bgc[index].style.color = '#fff'
        this.colors = false
      } else {
        // console.log(this.colors);
        this.$refs.bgc[index].style.background = ''
        this.$refs.bgc[index].style.color = ''

        this.colors = true
      }

      this.rightData = [value]
    },
    // 删除选中的数据
    getDelete() {
      console.log(this.multipleSelection)
      if (this.multipleSelection.length <= 0) {
        return this.$message.error('请勾选要删除的数据！')
      }
      const deploymentTableIds = []
      for (var i in this.multipleSelection) {
        console.log(this.multipleSelection[i].deploymentTableId)
        deploymentTableIds.push(this.multipleSelection[i].deploymentTableId)
      }
      console.log(deploymentTableIds.toString())

      const params = {
        deploymentTableId: deploymentTableIds.toString()
      }

      // 确认删除
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          API.getDelete(params).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.getDeploymentTables()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => {
          this.$refs.multipleSelection.clearSelection()
        })
    },
    // 合并部署表
    getMergeDeploymentTable() {
      if (this.multipleSelection.length <= 0) {
        return this.$message.error('请勾选要合并的部署表！')
      }
      const deploymentTableIds = []
      this.multipleSelection.map(i => {
        deploymentTableIds.push(i.deploymentTableId)
      })
      const params = {
        deploymentTableIds: deploymentTableIds.toString()
      }
      API.getMergeDeploymentTable(params).then(res => {
        if (res.code === 200) {
          this.getDeploymentTables()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-button--primary{
  background-color: #1f7cd7;
}
.total-section {
  height: 100%;
  width: 100%;
  background: #ffffff;
  padding: 20px;
  border-radius: 5px;
  .top-section {
    padding: 18px;
    border: 1px solid #e4dede;
    margin-bottom: 10px;
    .img {
      width: 10px;
      height: 10px;
      margin-right: 5px;
    }
  }
  >>> .el-input__inner{
    height: 32px;
    width: 100%;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  >>> .el-input__icon{
    height: 32px;
    line-height: 32px;
  }
  .table-section {
    width: 100%;
    overflow: auto;
    height: calc(100% - 112px);
  }
  .pager-section {
    text-align: right;
    font-size: 15px;
    width: 100%;
    height: 40px;
  }
  >>> .el-pagination{
    padding: 0;
    padding-top: 13px;
  }
  >>> .el-select {
    height: 100%;
  }
  >>> .el-pagination__sizes{
    margin: 0;
  }
  >>> .el-input {
    height: 81%;
    margin: 0;
  }
  >>> .el-input__inner{
    width: 100%;
    height: 100%;
  }
  >>> .el-input__suffix{
    top: -1px;
  }
}
.transfer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.transfer > .list {
  width: 300px;
  height: 350px;
  border: 2px solid #bee8fb;
  list-style: none;
}
.content {
  font-size: 30px;
  margin: 0 20px;
  color: #bee8fb;
}
.list > li {
  padding: 5px;
  box-sizing: border-box;
}
.dialog-footer {
  margin-top: 10px;
}
</style>
