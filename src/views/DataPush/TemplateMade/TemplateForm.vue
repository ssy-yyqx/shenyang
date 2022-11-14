<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="70%"
  >
    <div class="editor-container">
      <div class="template-attr">
        <el-form label-width="80px">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="模板名称">
                <el-input v-model="name" clearable :disabled="type==='view'" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模板描述">
                <el-input v-model="describe" clearable :disabled="type==='view'" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="editor-section">
        <div class="editor-section__left">
          <div id="pell" style="height: 100%;" />
        </div>
        <div class="editor-section__right">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="字段">
              <el-input v-model="form.attribute" clearable :disabled="type==='view'" />
            </el-form-item>
            <el-form-item label="sql">
              <el-input v-model="form.sql" type="textarea" clearable :disabled="type==='view'" />
            </el-form-item>
          </el-form>
          <div v-if="setAttributeList && setAttributeList.length > 0" class="attributes-section">
            <div class="attributes-section__label">已配置的字段：</div>
            <div>
              <el-select v-model="currentAttribute" placeholder="请选择字段" value-key="id" clearable @change="currentSel">
                <el-option v-for="item in setAttributeList" :key="item.needData" :label="item.needData" :value="item" />
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="type!=='view'" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onHandleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { exec, init } from 'pell'
import * as API from '@/api/DataPush'
const initContent = '<div><center><b><span style="font-size: 28px">编制部署</span></b><center></center></center></div><div><b><span style="font-size: 18px">1.人员编制实力</span></b></div><div><p><span style="font-size: 12px;">&nbsp; &nbsp; 编制人（军官人、士兵人、文职人员人），现有</span><span style="color: blue;">${DESC1}</span><span style="font-size: 12px;">人。</span></p></div><div><div><b><span style="font-size: 18px">2.不对编程部署</span></b></div></div><div><p><span style="color: blue;">${DESC4}</span><br></p></div><div><div><b><span style="font-size: 18px">3.装备实力明细</span></b></div></div><div><p><span style="font-size: 12px;">编制装备：</span><span style="color: blue;">${DESC3}</span></p><p><span style="font-size: 12px;">现有装备：</span><span style="color: blue;">${DESC2}</span></p></div>'
export default {
  props: {
    showTemplateForm: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    fixedModelId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 是否显示弹窗
      dialogVisible: this.showTemplateForm,
      // 模板名称
      name: '',
      // 描述
      describe: '',
      // 模板内容
      content: initContent,
      form: {
        attribute: '',
        sql: ''
      },
      // 存放字段和sql
      attributeResult: {},
      // 编辑器
      editor: null,
      // 已配置字段
      setAttributeList: [],
      // 当前选中的已配置字段
      currentAttribute: '',
      // 模板ID
      modeId: ''
    }
  },
  computed: {
    title() {
      if (this.type === 'add') {
        return '新增模板'
      } else if (this.type === 'edit') {
        return '编辑模板'
      } else {
        return '查看模板'
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.$emit('close')
      }
    },
    type(val) {
      if (val === 'add') {
        this.title = '新增模板'
      } else if (val === 'edit') {
        this.title = '编辑模板'
      } else {
        this.title = '查看模板'
      }
    }
  },
  created() {
    if (this.fixedModelId) {
      this.getTemplateDetail()
    }
  },
  mounted() {
    setTimeout(() => {
      if (!this.fixedModelId) {
        this.content = initContent
        this.initEdit()
      }
    }, 200)
  },
  methods: {
    // 初始化
    initEdit() {
      this.editor = init({
        element: document.getElementById('pell'),
        onChange: html => {
          this.content = html
        },
        actions: [
          'bold',
          'underline',
          'strikethrough',
          'italic',
          {
            name: 'title',
            icon: '<div>标题</div>',
            title: '标题',
            result: () => {
              exec('insertHTML', '<div><center><b><span style="font-size: 28px">标题</span></b><center></div>')
            }
          },
          {
            name: 'level1Title',
            icon: '<div>一级标题</div>',
            title: '一级标题',
            result: () => {
              exec('insertHTML', '<div><b><span style="font-size: 18px">一级标题</span></b></div>')
            }
          },
          {
            name: 'P',
            icon: '<div>段落</div>',
            title: '段落',
            result: () => {
              exec('insertHTML', '<p><span style="font-size: 12px">段落</span></p>')
            }
          },
          {
            name: 'attribute',
            icon: '<div style="white-space: nowrap;">字段配置</div>',
            title: '字段配置',
            result: () => {
              if (this.form.attribute) {
                exec('insertHTML', '<span style="color: blue;">${' + this.form.attribute + '}</span>')
                this.attributeResult[this.form.attribute] = this.form.sql
                this.setAttributeLists(this.attributeResult)
              } else {
                this.$message.warning('请先配置字段！')
              }
            }
          },
          {
            name: 'table',
            icon: '<div style="white-space: nowrap;">表格</div>',
            title: '表格',
            result: () => {
              exec('insertHTML', '<table><th><td>1111</td><td>22</td></th></table>')
            }
          }
        ],
        classes: {
          actionbar: 'pell-actionbar',
          button: 'pell-button',
          content: 'pell-content',
          selected: 'pell-button-selected'
        }
      })
      this.editor.content.innerHTML = this.content
    },
    // 保存
    onHandleSave() {
      const mapList = []
      for (const key in this.attributeResult) {
        mapList.push({
          NEED_DATA: key,
          NEED_SQL: this.attributeResult[key]
        })
      }
      const params = {
        htmlString: this.content,
        name: this.name,
        describe: this.describe,
        mapList: mapList
      }
      if (this.type === 'add') {
        API.addFixedModel(params).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            this.$message.success('新增模板成功！')
            this.dialogVisible = false
            this.$emit('refreshTable')
          } else {
            this.$message.error(msg)
          }
        })
      } else if (this.type === 'edit') {
        params.fixedModelId = this.modeId
        API.updateFixedModel(params).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            this.$message.success('修改模板成功！')
            this.dialogVisible = false
            this.$emit('refreshTable')
          } else {
            this.$message.error(msg)
          }
        })
      } else {
        this.dialogVisible = false
      }
    },
    // 获取字段列表
    getAttributeList() {
      const getData = new Promise(resolve => {
        setTimeout(() => {
          resolve([
            { id: 'DESC1' },
            { id: 'DESC2' },
            { id: 'DESC3' },
            { id: 'DESC4' }
          ])
        }, 1000)
      })
      getData.then(res => {
        this.attributeList = res
      })
    },
    // 获取模板详细信息
    getTemplateDetail() {
      API.getFixedModelById({ fixedModelId: this.fixedModelId }).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          // 模板ID
          this.modeId = data.fixedModelId
          // 模板名称
          this.name = data.fixedModelName
          // 模板描述
          this.describe = data.fixedModelDescribe
          // 模板内容
          this.content = data.fixedModelComponentEntities[0].modelData
          // 初始化富文本编辑器
          this.initEdit()
          // 字段设置
          const sqls = data.fixedModelComponentEntities[0].modelNeedSqls
          if (sqls && sqls.length > 0) {
            sqls.forEach(item => {
              this.attributeResult[item.needData] = item.needSql
            })
          }
          this.setAttributeList = sqls
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一配置字段选中
    currentSel(val) {
      this.form.attribute = val.needData
      this.form.sql = val.needSql
    },
    // 设置字段列表
    setAttributeLists(val) {
      const mapList = []
      for (const key in val) {
        mapList.push({
          needData: key,
          needSql: val[key]
        })
      }
      this.setAttributeList = mapList
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-container{
  width: 100%;
  height: 500px;
  background: #FFFFFF;
  padding: 10px;
  .btn-section{
    padding: 10px 0;
  }
  .editor-section{
    height: calc(100% - 60px);
    display: flex;
    &__left{
      width: 60%;
      height: 100%;
      border: 1px solid #e7e9ef;
    }
    &__right{
      width: 40%;
      .attributes-section{
        padding: 10px;
        &__label{
          font-weight: bold;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
<style>
.pell-content{
  overflow-y: auto;
}
</style>
