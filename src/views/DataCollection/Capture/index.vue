<template>
  <Container>
    <Containertwo own-class="con-two">
      <div class="dataCust">
        <div class="queryCondition">
          <el-form
            ref="searchForm"
            :model="searchForm"
            label-position="right"
            label-width="85px"
            class="top-form1"
          >
            <el-row :gutter="25" style="width:100%">
              <el-col :span="6">
                <el-form-item label="任务名称：" prop="taskName">
                  <el-input v-model="searchForm.taskName" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="关键字：" prop="keyword">
                  <el-input v-model="searchForm.keyword" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <!--
                <el-col :span="6">
                <el-form-item label="时间：" prop="startDate">
                  <el-date-picker
                    v-model="timeVales"
                    type="daterange"
                    start-placeholder="请输入开始时间"
                    end-placeholder="请输入结束时间"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-form-item>
              </el-col>

              -->
              <el-col :span="6" style="text-align:right">
                <el-button style="background:#1F7FD8;color:#fff;" @click="searchTable">搜索</el-button>
                <el-button @click="reset">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="button-con">
          <el-button class="elbutton" @click="addTheme">
            <img :src="require(`@/icons/newImages/buttonIcon/add.png`)" class="img-class" alt>
            <span>新建</span>
          </el-button>
          <!-- <el-button class="elbutton" @click="runTheme">
            <img :src="require(`@/icons/newImages/run.png`)" class="img-class" alt>
            <span>运行</span>
          </el-button> -->
          <el-button class="elbutton" @click="exportButton">
            <img src="../../../icons/newImages/daochu.png" class="img-class" alt>
            <span>导出</span>
          </el-button>
        </div>

        <!-- 表格 -->
        <div class="table-bon">
          <div class="table-section">
            <el-table
              ref="multipleTable"
              :data="tableData"
              stripe
              height="100%"
              header-row-class-name="header-row-class"
              :header-cell-style="{background:'rgb(31, 127, 216)',color:'white'}"
              border
              style="width: 100%"

              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column
                label="序号"
                :index="indexMethod"
                type="index"
                width="50"
                align="center"
              />
              <el-table-column label="任务名称" prop="crawlTaskName" align="center" show-overflow-tooltip />
              <el-table-column label="关键字" prop="crawlKeyword" align="center" show-overflow-tooltip />
              <el-table-column label="采集网址" prop="crawlUrl" align="center" show-overflow-tooltip />
              <el-table-column label="开始时间" prop="crawlTaskStartDate" align="center" show-overflow-tooltip />
              <el-table-column label="结束时间" prop="crawlTaskEndDate" align="center" show-overflow-tooltip />
              <el-table-column label="创建人" prop="crawlCreator" align="center" show-overflow-tooltip />
              <el-table-column
                label="创建时间"
                prop="crawlTaskCreateDate"
                align="center"
                show-overflow-tooltip
              />
              <!-- <el-table-column label="状态" prop="status" align="center" :formatter="formatter" show-overflow-tooltip /> -->
            </el-table>
          </div>
          <div class="pager-section">
            <el-pagination
              :current-page="pager.pageNum"
              :page-sizes="pager.pageSizes"
              :page-size="pager.pageSize"
              layout="total, prev, pager, next, sizes"
              :total="pager.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </Containertwo>

    <!-- 新增编辑产品 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogThemeVisible"
      :close-on-click-modal="false"
      width="35%"
      custom-class="qiefen-dialog-class"
      @closed="closeThemeDialog"
    >
      <el-form ref="addForm" :rules="themeRules" :model="addForm" class="qiefen-dialog-form">
        <el-row :gutter="120">
          <el-col :span="12">
            <el-form-item label="采集任务:" prop="crawlTaskName" label-width="84px">
              <el-input v-model="addForm.crawlTaskName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关键字:" prop="crawlKeyword" label-width="82px">
              <el-input v-model="addForm.crawlKeyword" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采集网址:" prop="crawlUrl" label-width="84px">
              <el-select v-model="addForm.crawlUrl" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- v-model="timeVale"-->
            <el-form-item label="时间范围:" prop="crawlTaskStartDate" label-width="82px">
              <el-date-picker
                v-model="addForm.crawlTaskStartDate"
                type="daterange"
                start-placeholder="请输入开始时间"
                end-placeholder="请输入结束时间"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人:" prop="crawlCreator" label-width="82px">
              <el-input v-model="addForm.crawlCreator" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间:" prop="crawlTaskCreateDate" label-width="84px">
              <el-date-picker v-model="addForm.crawlTaskCreateDate" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 分割线 -->
      <div style="background: rgb(189 189 189 / 46%);;height:1px" />
      <span slot="footer" class="dialog-footer">
        <el-button style="background:#1F7FD8;color:#fff;" @click="saveTheme('addForm')">保存</el-button>
        <el-button @click="closeThemeDialog">取 消</el-button>
      </span>
    </el-dialog>
  </Container>
</template>

<script>
import * as API from '@/api/index'
import Container from '@/components/Container'
import Containertwo from '@/components/ContainerTwo'
import images1 from '../../../icons/img/run.gif'
// import images2 from '../../../icons/img/endError.png'
// import images3 from '../../icons/img/error.png'
import moment from 'moment'
export default {
  components: { Container, Containertwo },
  data() {
    // 检测不能出现同样的关键字
    // var checkKeyword = (rule, value, callback) => {
    //   var crawlKeyword = this.allTabData.some(item => {
    //     return item.crawlKeyword === value;
    //   });
    //   if (value === "") {
    //     callback(new Error("请输入关键字"));
    //   } else if (crawlKeyword) {
    //     callback(new Error("已存在此关键字"));
    //   } else {
    //     callback();
    //   }
    // };

    // var checkTaskName = (rule, value, callback) => {
    //   var taskname = this.allTabData.some(item => {
    //     return item.crawlTaskName === value;
    //   });
    //   if (value === "") {
    //     callback(new Error("请输入任务名称"));
    //   } else if (taskname) {
    //     callback(new Error("已存在此任务名称"));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      // 点击运行时所选择的行数据
      selectedRows: [],

      value1: '',
      multipleSelection: [],
      // 采集网址
      options: [
        {
          value: '选项1',
          label: 'http://www.luteshe.com' // 路透社
        },
        {
          value: '选项2',
          label: 'https://www.ifeng.com/' // 凤凰网
        },
        {
          value: '选项3',
          label: 'http://www.takungpao.com/' // 大公网
        },
        {
          value: '选项4',
          label: 'https://www.huanqiu.com/' // 环球网
        },
        {
          value: '选项5',
          label: 'http://www.mfa.gov.kp/zh/' // 朝鲜外务省网站
        },
        {
          value: '选项6',
          label: 'https://www.thepaper.cn/' // 澎湃新闻
        },
        {
          value: '选项7',
          label: 'http://www.uriminzokkiri.com/index.php?lang=chn' // 我们民族之间
        },
        {
          value: '选项8',
          label: 'https://m-cn.yna.co.kr/news' // 韩联社
        },
        {
          value: '选项9',
          label: 'http://world.kbs.co.kr/service/index.htm?lang=c' // 韩国国际广播电台
        },
        {
          value: '选项10',
          label: 'https://china.kyodonews.net/' // 共同社
        },
        {
          value: '选项11',
          label: 'http://www.zaobao.com/' // 联合早报（新）
        },
        {
          value: '选项12',
          label: 'http://www.haiwainet.cn/' // 海外网（中）
        },
        {
          value: '选项13',
          label: 'http://www.cankaoxiaoxi.com/' // 参考消息（中）
        },
        {
          value: '选项14',
          label: 'https://www.chinatimes.com/?chdtv' // 中时电子版（中台）
        },
        {
          value: '选项15',
          label: 'https://sputniknews.cn/archive/' // 俄罗斯卫星通讯社
        },
        {
          value: '选项16',
          label: 'https://www.donga.com/cn' // 东亚日报（韩）
        },
        {
          value: '选项17',
          label: 'http://chinese.joins.com/' // 中央日报（韩）
        },
        {
          value: '选项18',
          label: 'http://www.rodong.rep.kp/cn/' // 劳动新闻（朝）
        }
      ],

      // 时间选择，包含开始时间和结束时间
      timeVale: [],
      //timeVales: [],
      // 在运行时显示的loading文字
      // loading: "loading...",

      // 运行时显示的进度条图片
      images1: images1,

      // 新增表单
      addForm: {
        crawlTaskName: '', // 任务名称
        crawlTaskCreateDate: '', // 创建时间
        crawlKeyword: '', // 关键字
        crawlUrl: '', // 采集网址
        crawlTaskStartDate: '', // 开始时间  日期输入格式：20210602
        crawlTaskEndDate: '', // 结束时间
        crawlCreator: '' // 创建人
      },

      // 校验新增form表单
      themeRules: {
        crawlTaskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        crawlTaskCreateDate: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        crawlTaskStartDate: [
          { required: true, message: '请输入时间范围', trigger: 'blur' }
        ],
        crawlKeyword: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
        crawlUrl: [{ required: true, message: '请输入采集网址', trigger: 'blur' }],
        crawlCreator: [{ required: true, message: '请输入创建人', trigger: 'blur' }]
      },

      value: '',
      // value: '',
      // 新建主题
      dialogTitle: '',
      // 运行主题
      dialogTitleRun: '',
      // 新增模态框的显示与隐藏
      dialogThemeVisible: false,

      // 成功时显示的数据条数
      successSj: 0,
      // 失败时显示的数据条数
      errorSj: 0,
      // 查看失败原因
      reason: '',
      clickReason: '',

      // 表格相关=======================↓
      // 表格查询form
      searchForm: {
        taskName: '',
        keyword: '',
        startDate: '', // 开始时间  日期输入格式：20210602
        endDate: '' // 结束时间
      },

      // 表格里的内容
      tableData: [],

      // 用于截取数组前10条
      allTabData: [],
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      }
    }
  },

  created() {
    // 获取表格数据
    this.getTableData()
  },
  methods: {
    // 导出
    exportButton() {
      const taskIds = []
      this.selectedRows.forEach(i => {
        taskIds.push(i.crawlTaskId)
      })
      //window.open(`/upgrade/crawl/task/exportData?taskIds=` + taskIds.toString()) //文件流下载
      const params= {
        taskIds: taskIds.toString()
      }
      API.getTaskExport(params).then(res=>{
        if(res.code===200){
          window.open(res.data)
          this.$message.success(res.msg)
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    // 新增模态框的显示与隐藏
    addTheme() {
      this.dialogTitle = '新建采集任务'
      this.dialogThemeVisible = !this.dialogThemeVisible
    },
    // 点击完成之后运行框隐藏
    complete() {
      // 清空内容
      this.selectedRows = []
      this.images1 = images1
      this.loading = ''
      this.successSj = 0
      this.errorSj = 0
      this.getTableData()
      this.clickReason = ''
    },

    // 改变状态列的展示方式
    formatter(row, column) {
      if (column.label === '状态' && row.status === 1) {
        return '未导出'
      } else if (column.label === '状态' && row.status === 2) {
        return '已导出'
      }
    },

    // 查看失败原因
    checkReason() {
      if (this.errorSj !== 0) {
        this.clickReason = this.reason
      }
    },

    // 新增保存
    saveTheme(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.addForm)
          this.addForm.crawlTaskStartDate = this.timeVale[0]
          this.addForm.crawlTaskEndDate = this.timeVale[1]

          const params = {
            ...this.addForm,
            status: '0'
          }
          API.getTaskAdd(params).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.getTableData()
              this.dialogThemeVisible = false
              // this.$message.success(res.message)
              // this.resetTheme()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },

    // 关闭新建主题
    closeThemeDialog() {
      this.dialogThemeVisible = false
      this.resetTheme()
      this.getTableData()
      this.selectedRows = []
      this.$refs.multipleTable.clearSelection()
    },
    // 点击弹出框时，关闭模态框并重置表单
    dialogThemeClosed() {
      this.dialogThemeVisible = false
      this.resetTheme()
    },

    // 重置新增表单
    resetTheme() {
      this.addForm = {
        crawlTaskName: '', // 任务名称
        crawlTaskCreateDate: '', // 创建时间
        crawlKeyword: '', // 关键字
        crawlUrl: '', // 采集网址
        crawlTaskStartDate: '', // 开始时间  日期输入格式：20210602
        crawlTaskEndDate: '', // 结束时间
        crawlCreator: '' // 创建人
      }
      this.timeVale = []
    },

    // 表格相关=====================================================
    // index配置   自定义序号
    indexMethod(index) {
      return index + this.pager.pageSize * (this.pager.pageNum - 1) + 1
    },

    // 获取表格数据
    getTableData() {
      const props = {
        ...this.searchForm
      }
      API.getTaskTableData(props).then(res => {
        const { code, rows, message, total } = res
        // const arr = Object.keys(res.data)
        if (String(code) === '200') {
          this.allTabData = rows
          // 前端进行分页操作  slice(start,end) 从已有的数组中返回选定元素,参数start必填，end选填   end不包含
          // 例子
          // var workExp=["早上","中午","下午","晚上"];
          // var a =workExp.slice(0,3);
          // console.log(a) "早上","中午","下午"
          this.tableData = this.allTabData.slice((this.pager.pageNum - 1) * this.pager.pageSize, this.pager.pageNum * this.pager.pageSize)
          this.pager.total = total
        } else {
          this.$message.error(message)
        }
      })
    },

    // 搜索表格
    searchTable() {
      // 点击搜索时页码固定为1
      this.pager.pageNum = 1
      //if(this.timeVales){
      //  this.searchForm.startDate = this.timeVales[0]
      //  this.searchForm.endDate = this.timeVales[1]
      //}else{
      //  this.searchForm.startDate = ''
      //  this.searchForm.endDate = ''
      //}


      // 如果搜索时未输入内容    return false
      //if (
      //  this.searchForm.taskName === '' &&
      //  this.searchForm.keyword === '' &&
      //  this.searchForm.startDate === '' &&
      //  this.searchForm.endDate === ''
      //) {
      //  this.$message.error('请输入要搜索的内容')
      //  return false
      //}


      const params = {
        ...this.searchForm
      }
      API.getTaskTableData(params).then(res => {
        const { code, rows, message, total } = res
        if (String(code) === '200') {
          this.allTabData = rows
          this.tableData = this.allTabData.slice((this.pager.pageNum - 1) * this.pager.pageSize, this.pager.pageNum * this.pager.pageSize)
          this.pager.total = total
        } else {
          this.$message.error(message)
        }
      })
    },

    // 重置
    reset() {
      this.$refs.searchForm.resetFields()
      //this.timeVales = []
      this.searchForm.endDate = ''
      this.getTableData()
    },

    // 表格复选框
    handleSelectionChange(val) {
      this.selectedRows = val
      console.log(this.selectedRows)
      this.selectedRows.forEach(item => {
        item.loading = 'loading...'
      })
    },

    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getTableData()
    },

    // 切换当前页
    handleCurrentChange(val) {
      // slice(start,end)  从start当前位置开始   从end位置结束  不包括end
      this.tableData = this.allTabData.slice((val - 1) * this.pager.pageSize, val * this.pager.pageSize)
      this.pager.pageNum = val
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-dialog__header{
  padding: 10px;
}
>>> .el-dialog__title{
  font-size: 16px;
}
>>> .el-dialog__headerbtn {
  position: absolute;
  top: 13px;
  right: 20px;
}
.isActive {
  color: green !important;
}
.isFail {
  color: red !important;
}
.el-form-item {
  margin-bottom: 0px;
}
.el-button {
  width: 80px;
}
.el-col-12 {
  width: 100%;
  margin-bottom: 18px;
}
.el-select {
  width: 100%;
}
.el-range-editor--small.el-input__inner,
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

.dataCust {
  height: 100%;
  .queryCondition {
    width: 100%;
    height: 50px;
    margin-bottom: 20px;
    border-radius: 7px;
    border: 1px solid #e9eaef;
    .top-form1 {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .button-con {
    width: 100%;
    height: 40px;
    padding: 5px 0;
    margin-bottom: 10px;
    .elbutton {
      line-height: 30px;
      padding: 0px 15px;
      .img-class {
        vertical-align: bottom;
        border-style: none;
        height: 20px;
        margin-bottom: 5px;
      }
    }
  }
  .table-bon {
    width: 100%;
    height: calc(100% - 115px);
    .table-section {
      width: 100%;
      height: calc(100% - 50px);
    }
    .pager-section {
      width: 100%;
      height: 30px;
      margin: 10px 0;
      text-align: right;
    }
  }
}
</style>
