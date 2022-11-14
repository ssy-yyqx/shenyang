<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    custom-class="qiefen-dialog-class"
    :close-on-click-modal="false"
    width="70%"
  >
    <div class="editor-container">
      <div class="template-attr">
        <el-form label-width="80px">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="模板名称">
                <el-input v-model="name" clearable :disabled="type==='view'" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模板描述">
                <el-input v-model="describe" clearable :disabled="type==='view'" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否批量">
                <el-radio-group v-model="isBatch">
                  <el-radio :label="'0'">是</el-radio>
                  <el-radio :label="'1'">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="editor-section">
        <div class="editor-section__left">
          <div id="editor1" style="height: 100%;" />
        </div>
        <div class="editor-section__right">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>标记配置</span>
            </div>
            <el-form ref="form" :model="form" label-width="80px">
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="标记编码">
                    <el-input v-model="form.needData" clearable :disabled="type==='view'" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="SQL语句">
                    <el-input v-model="form.needSql" type="textarea" clearable :disabled="type==='view'" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="button-section">
              <el-button
                type="primary"
                :disabled="type==='view'"
                @click="onHandleAnalysisSql"
              >SQL解析</el-button>
            </div>
            <div class="table-section">
              <el-table
                :data="form.modelParamsEntities"
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="sqlParamsCode"
                  label="检索字段"
                  width="100"
                />
                <el-table-column
                  prop="sqlParamsName"
                  label="检索名称"
                  width="160"
                />
                <el-table-column
                  label="字段所属表"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.sqlTableName" placeholder="请选择">
                      <el-option
                        v-for="item in scope.row.tableNameList"
                        :key="item.labelCode"
                        :label="item.labelName"
                        :value="item.labelCode"
                      />
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="attributes-section">
              <div class="attributes-section__label">已配置标记</div>
              <div style="flex: 1;">
                <el-select v-model="currentAttribute" placeholder="请选择字段" value-key="needData" clearable @change="currentSel">
                  <el-option v-for="item in attributeList" :key="item.needData" :label="item.needData" :value="item" />
                </el-select>
              </div>
            </div>
            <!-- <div class="attributes-section__label">查询字段配置：</div>
            <el-form ref="searchForm" :model="searchForm" label-width="80px">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-form-item label="字段编码">
                    <el-input v-model="searchForm.sqlParamsCode" clearable :disabled="type==='view'" />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="字段名称">
                    <el-input v-model="searchForm.sqlParamsName" clearable :disabled="type==='view'" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button
                    type="primary"
                    :disabled="type==='view'"
                    @click="onHandleAddSearchParams(searchForm)"
                  >添加</el-button>
                </el-col>
              </el-row>
            </el-form>
            <div class="attributes-section">
              <div class="attributes-section__label">已配置的查询字段</div>
              <div style="flex: 1;">
                <el-select v-model="currentSearchAttribute" placeholder="请选择字段" value-key="sqlParamsCode" clearable @change="currentSelSearchParam">
                  <el-option v-for="item in form.modelParamsEntities" :key="item.sqlParamsCode" :label="item.sqlParamsName" :value="item" />
                </el-select>
              </div>
            </div> -->
          </el-card>
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
import * as API from '@/api/DataPush'
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
    modelId: {
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
      // 是否批量
      isBatch: '0',
      // 字段表单
      form: {
        needData: '',
        needSql: '',
        // 0 字符串 3 图片 4 表格
        needDataType: '',
        modelParamsEntities: []
      },
      // 存放字段和sql
      attributeResult: {},
      // 已配置字段
      attributeList: [],
      // 当前选中的已配置字段
      currentAttribute: '',
      // 字段表单
      searchForm: {
        sqlParamsCode: '',
        sqlParamsName: ''
      },
      // 存放字段和sql
      searchAttributeResult: {},
      // 已配置字段
      searchAttributeList: [],
      // 当前选中的查询字段
      currentSearchAttribute: '',
      // 编辑器
      editor: null,
      // 模板ID
      modeId: '',
      editorConfig: {
        height: 360,
        extraPlugins: 'dialog',
        toolbar: [['Source', '-', 'Bold', 'Italic'], ['NumberedList', 'BulletedList'], ['Table'], ['Styles'], ['AttributeSet'], ['TableHeadSet'], ['PictureAttrSet']]

      },
      // 模板内容
      content: '',
      tableData: []
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
    modelId: {
      handler: function(val) {
        if (val) {
          this.getTemplateDetail()
        }
      },
      immediate: true
    }
  },
  created() {
    setTimeout(()=>{
      console.log(CKEDITOR)
    },500)
    const _this = this
    CKEDITOR.on('instanceCreated', function(ev) {
      _this.editor = ev.editor
      _this.editor.on('pluginsLoaded', function() {
        // 配置字段
        _this.editor.addCommand('AttributeSetCommand', {
          exec: function(editor) {
            if (_this.validateFormData()) {
              editor.insertText(`{{${_this.form.needData}}}`)
              _this.setAttribute(_this.form.needData, 0)
            } else {
              _this.$message.warning('请先配置字段')
            }
          }
        })
        _this.editor.ui.add('AttributeSet', CKEDITOR.UI_BUTTON, {
          label: '数据标记',
          command: 'AttributeSetCommand'
        })
        // 配置表头
        _this.editor.addCommand('TableHeadSetCommand', {
          exec: function(editor) {
            if (_this.validateFormData()) {
              editor.insertText(`{{${_this.form.needData}}}`)
              _this.setAttribute(_this.form.needData, 4)
            } else {
              _this.$message.warning('请先配置字段')
            }
          }
        })
        _this.editor.ui.add('TableHeadSet', CKEDITOR.UI_BUTTON, {
          label: '表格标记',
          command: 'TableHeadSetCommand'
        })
        // 配置表格内容
        _this.editor.addCommand('TableContentSetCommand', {
          exec: function(editor) {
            if (_this.validateFormData()) {
              editor.insertText(`[${_this.form.needData}]`)
              _this.setAttribute(_this.form.needData, 4)
            } else {
              _this.$message.warning('请先配置字段')
            }
          }
        })
        _this.editor.ui.add('TableContentSet', CKEDITOR.UI_BUTTON, {
          label: '配置表格内容',
          command: 'TableContentSetCommand'
        })
        // 配置图片
        _this.editor.addCommand('PictureAttrSetCommand', {
          exec: function(editor) {
            if (_this.validateFormData()) {
              editor.insertText(`{{@${_this.form.needData}}}`)
              _this.setAttribute(_this.form.needData, 3)
            } else {
              _this.$message.warning('请先配置字段')
            }
          }
        })
        _this.editor.ui.add('PictureAttrSet', CKEDITOR.UI_BUTTON, {
          label: '图片标记',
          command: 'PictureAttrSetCommand'
        })
      })
    })
  },
  mounted() {
    setTimeout(() => {
      CKEDITOR.replace('editor1', this.editorConfig)
    }, 300)
  },
  methods: {
    // 配置前判断是否设置字段信息
    validateFormData() {
      const { needData, needSql } = this.form
      if (needData && needSql) {
        return true
      }
      return false
    },
    // 保存
    onHandleSave() {
      const mapList = []
      for (const key in this.attributeResult) {
        mapList.push(this.attributeResult[key])
      }
      const params = {
        modelHtmlString: this.editor.getData(),
        modelName: this.name,
        modelDescribe: this.describe,
        isBatch: this.isBatch,
        modelNeedSqlEntities: mapList
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
        params.modelId = this.modeId
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
    // 获取模板详细信息
    getTemplateDetail() {
      API.getFixedModelById({ modelId: this.modelId }).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          // 模板ID
          this.modeId = data.modelId
          // 模板名称
          this.name = data.modelName
          // 模板描述
          this.describe = data.modelDescribe
          // 是否批量
          this.isBatch = data.isBatch
          // 模板内容
          this.content = data.modelHtmlString
          console.log(this.content)
          document.getElementById('editor1').innerHTML = this.content
          // // 初始化富文本编辑器
          // this.initEdit()
          // 字段设置
          const sqls = data.modelNeedSqlEntities
          if (sqls && sqls.length > 0) {
            sqls.forEach(item => {
              this.attributeResult[item.needData] = item
            })
          }
          this.attributeList = data.modelNeedSqlEntities
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一配置字段选中
    currentSel(val) {
      this.form = { ...val }
    },
    // 设置字段列表
    setAttributeLists(val) {
      const mapList = []
      for (const key in val) {
        mapList.push(val[key])
      }
      return mapList
    },
    // 设置查询字段列表
    setSearchAttributeLists(val) {
      const mapList = []
      for (const key in val) {
        mapList.push({
          sqlParamsCode: key,
          sqlParamsName: val[key]
        })
      }
      return mapList
    },
    // 添加查询条件
    onHandleAddSearchParams(val) {
      const { sqlParamsCode, sqlParamsName } = val
      this.searchAttributeResult[sqlParamsCode] = sqlParamsName
      this.form.modelParamsEntities = this.setSearchAttributeLists(this.searchAttributeResult)
      this.searchForm = {
        sqlParamsCode: '',
        sqlParamsName: ''
      }
      this.currentSearchAttribute = ''
    },
    // 查询条件下拉内容切换
    currentSelSearchParam(val) {
      this.searchForm.sqlParamsCode = val.sqlParamsCode
      this.searchForm.sqlParamsName = val.sqlParamsName
    },
    // 点击配置按钮后设置配置数据
    setAttribute(key, type) {
      this.attributeResult[key] = Object.assign({}, this.form, { needDataType: type })
      this.attributeList = this.setAttributeLists(this.attributeResult)
      // 清空form
      this.form = {
        needData: '',
        needSql: '',
        // 0 字符串 3 图片 4 表格
        needDataType: '',
        modelParamsEntities: []
      }
      this.currentAttribute = ''
      this.searchForm = {
        sqlParamsCode: '',
        sqlParamsName: ''
      }
      this.currentSearchAttribute = ''
    },
    // 解析sql
    onHandleAnalysisSql() {
      if (this.form.needSql) {
        API.anlysisSql({
          needSql: this.form.needSql
        }).then(res => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            this.form.modelParamsEntities = data
          } else {
            this.$message.error(msg)
          }
        })
      } else {
        this.$message.warning('请先输入sql')
      }
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
      padding-left: 20px;
      width: 40%;
      height: 100%;
      .box-card{
        height: 100%;
      }
      .attributes-section{
        padding: 10px 0;
        display: flex;
        align-items: center;
        &__label{
          font-weight: bold;
          margin-bottom: 10px;
          color: #333333;
          padding-right: 5px;
        }
      }
      .button-section{
        text-align: right;
        margin: 0 0 10px 0;
      }
    }
  }
}
</style>
<style lang="scss">
.cke_button__attributeset_icon{
  width: 54px !important;
  &::after{
    content: '数据标记'
  }
}
.cke_button__tableheadset_icon{
  width: 54px !important;
  &::after{
    content: '表格标记'
  }
}
.cke_button__tablecontentset_icon{
  width: 80px !important;
  &::after{
    content: '配置表格内容'
  }
}
.cke_button__pictureattrset_icon{
   width: 54px !important;
  &::after{
    content: '图片标记'
  }
}
.el-card__header{
  padding: 10px 12px;
}
.el-card__body{
  padding: 10px;
  height: calc(100% - 36px);
  overflow-y: auto;
}
.cke_chrome{
  height: 100%;
}
</style>
