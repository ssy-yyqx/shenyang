<template>
  <el-form
    :ref="tab"
    :model="form"
    label-width="160px"
    class="form-section"
    :rules="formRules"
  >
    <template v-if="!loading">
      <template v-for="index of readyFormList.length">
        <template
          v-if="
            readyFormList[index - 1].domType !== 'textarea' &&
              readyFormList[index - 1].domType !== 'file'
          "
        >

          <el-row v-if="(index - 1) % 2 == 0" :key="index + 'row'" :gutter="10">
            <el-col v-if="firstLevel==='93159039c91111eba6bf70b5e84fe1ac'&&readyFormList[index - 1].columnComment!=='部队'" ref="colRef" :span="readyFormList.length == 1 ? 24 : 12">
              <!-- 输入框 -->
              <template v-if="readyFormList[index - 1].domType === 'input'">
                <el-form-item
                  :label="readyFormList[index - 1].columnComment"
                  :prop="readyFormList[index - 1].columnName"
                >
                  <template
                    v-if="
                      readyFormList[index - 1].columnName === 'JD' ||
                        readyFormList[index - 1].columnName === 'WD'
                    "
                  >
                    <div style="display: flex">
                      <el-input
                        v-model="form[readyFormList[index - 1].columnName]"
                        :placeholder="readyFormList[index - 1].columnText"
                        :disabled="
                          isEdit &&
                            readyFormList[index - 1].isPrimaryKey === 'Y' &&
                            !!formValues[readyFormList[index - 1].columnName]|| readyFormList[index - 1].columnComment==='文件名'
                        "
                        :maxlength="readyFormList[index - 1].columnLength"
                      />
                      <el-button
                        style="margin-left: 5px"
                        @click="onHandleSelectPoint"
                      >获取</el-button>
                    </div>
                  </template>
                  <el-input
                    v-else
                    v-model="form[readyFormList[index - 1].columnName]"
                    :placeholder="readyFormList[index - 1].columnText"
                    :disabled="
                      isEdit &&
                        readyFormList[index - 1].isPrimaryKey === 'Y' &&
                        !!formValues[readyFormList[index - 1].columnName] || readyFormList[index - 1].columnComment==='文件名'
                    "
                    :maxlength="readyFormList[index - 1].columnLength"
                  />
                </el-form-item>
              </template>
              <!-- 下拉框 -->
              <template v-if="readyFormList[index - 1].domType === 'select'">
                <el-form-item

                  :label="readyFormList[index - 1].columnComment"
                  :prop="readyFormList[index - 1].columnName"
                >
                  <BigDataSelect
                    v-if="bigDataTable.indexOf(readyFormList[index - 1].tableName) > -1"
                    :input-value="form[readyFormList[index - 1].columnName.split('_')[0]]"
                    :select-value="form[readyFormList[index - 1].columnName][0]"
                    :column-name="readyFormList[index - 1].columnName"
                    :table-name="readyFormList[index - 1].tableName"
                    :force-code="forceCode"
                    :equipment-code="equipmentCode"
                    :is-disabled="isEdit &&
                      readyFormList[index - 1].isPrimaryKey === 'Y' &&
                      !!formValues[readyFormList[index - 1].columnName]"
                    @setBigDataColumnValue="setBigDataColumnValue"
                  />
                  <el-cascader
                    v-else
                    ref="CascaderRef"
                    v-model="form[readyFormList[index - 1].columnName]"
                    clearable
                    :props="
                      formSelectProps[readyFormList[index - 1].columnName]
                    "
                    filterable
                    :disabled="
                      isEdit &&
                        readyFormList[index - 1].isPrimaryKey === 'Y' &&
                        !!formValues[readyFormList[index - 1].columnName]
                    "
                    :before-filter="
                      (val) => {
                        iptChange(
                          val,
                          readyFormList[index - 1].columnName,
                          readyFormList[index - 1]
                        );
                      }
                    "
                    @visible-change="
                      (val) => {
                        visibleChange(val, readyFormList[index - 1].columnName);
                      }
                    "
                    @change="
                      (val) => {
                        handleChange(val, readyFormList[index - 1].columnName);
                      }
                    "
                  />

                  <div
                    :ref="readyFormList[index - 1].columnName"
                    style="
                      display: none;
                      position: absolute;

                      z-index: 999999999999999999;
                    "
                  >
                    <panelSearch
                      :column-name="readyFormList[index - 1].columnName"
                      :panel-search-data="panelSearchData"
                      @setColumnNameData="setColumnNameData"
                    />
                  </div>
                </el-form-item>
              </template>
              <!-- 下拉框多选 -->
              <template v-if="readyFormList[index - 1].domType === 'muliSelect'">
                <el-form-item
                  :label="readyFormList[index - 1].columnComment"
                  :prop="readyFormList[index - 1].columnName"
                >
                  <el-cascader
                    v-model="form[readyFormList[index - 1].columnName]"
                    clearable
                    :props="{
                      multiple: true,
                      checkStrictly: true,
                      value: 'code',
                      leaf: 'isLeaf',
                    }"
                    filterable
                    :options="
                      formSelectProps[readyFormList[index - 1].columnName]
                    "
                  />
                </el-form-item>
              </template>

              <!-- 时间 datetime -->
              <template v-if="readyFormList[index - 1].domType === 'datetime'">
                <el-form-item
                  :label="readyFormList[index - 1].columnComment"
                  :prop="readyFormList[index - 1].columnName"
                >
                  <el-date-picker
                    v-model="form[readyFormList[index - 1].columnName]"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="
                      isEdit &&
                        readyFormList[index - 1].isPrimaryKey === 'Y' &&
                        !!formValues[readyFormList[index - 1].columnName]
                    "
                  />
                </el-form-item>
              </template>
            </el-col>
            <el-col v-if="firstLevel!=='93159039c91111eba6bf70b5e84fe1ac'" ref="colRef" :span="readyFormList.length == 1 ? 24 : 12">
              <!-- 输入框 -->
              <template v-if="readyFormList[index - 1].domType === 'input'">
                <el-form-item
                  :label="readyFormList[index - 1].columnComment"
                  :prop="readyFormList[index - 1].columnName"
                >
                  <template
                    v-if="
                      readyFormList[index - 1].columnName === 'JD' ||
                        readyFormList[index - 1].columnName === 'WD'
                    "
                  >
                    <div style="display: flex">
                      <el-input
                        v-model="form[readyFormList[index - 1].columnName]"
                        :placeholder="readyFormList[index - 1].columnText"
                        :disabled="
                          isEdit &&
                            readyFormList[index - 1].isPrimaryKey === 'Y' &&
                            !!formValues[readyFormList[index - 1].columnName]|| readyFormList[index - 1].columnComment==='文件名'
                        "
                        :maxlength="readyFormList[index - 1].columnLength"
                      />
                      <el-button
                        style="margin-left: 5px"
                        @click="onHandleSelectPoint"
                      >获取</el-button>
                    </div>
                  </template>
                  <el-input
                    v-else
                    v-model="form[readyFormList[index - 1].columnName]"
                    :placeholder="readyFormList[index - 1].columnText"
                    :disabled="
                      isEdit &&
                        readyFormList[index - 1].isPrimaryKey === 'Y' &&
                        !!formValues[readyFormList[index - 1].columnName] || readyFormList[index - 1].columnComment==='文件名'
                    "
                    :maxlength="readyFormList[index - 1].columnLength"
                  />
                </el-form-item>
              </template>
              <!-- 下拉框 -->
              <template v-if="readyFormList[index - 1].domType === 'select'">
                <el-form-item

                  :label="readyFormList[index - 1].columnComment"
                  :prop="readyFormList[index - 1].columnName"
                >
                  <BigDataSelect
                    v-if="bigDataTable.indexOf(readyFormList[index - 1].tableName) > -1"
                    :input-value="form[readyFormList[index - 1].columnName.split('_')[0]]"
                    :select-value="form[readyFormList[index - 1].columnName][0]"
                    :column-name="readyFormList[index - 1].columnName"
                    :table-name="readyFormList[index - 1].tableName"
                    :force-code="forceCode"
                    :equipment-code="equipmentCode"
                    :is-disabled="isEdit &&
                      readyFormList[index - 1].isPrimaryKey === 'Y' &&
                      !!formValues[readyFormList[index - 1].columnName]"
                    @setBigDataColumnValue="setBigDataColumnValue"
                  />
                  <el-cascader
                    v-else
                    ref="CascaderRef"
                    v-model="form[readyFormList[index - 1].columnName]"
                    clearable
                    :props="
                      formSelectProps[readyFormList[index - 1].columnName]
                    "
                    filterable
                    :disabled="
                      isEdit &&
                        readyFormList[index - 1].isPrimaryKey === 'Y' &&
                        !!formValues[readyFormList[index - 1].columnName]
                    "
                    :before-filter="
                      (val) => {
                        iptChange(
                          val,
                          readyFormList[index - 1].columnName,
                          readyFormList[index - 1]
                        );
                      }
                    "
                    @visible-change="
                      (val) => {
                        visibleChange(val, readyFormList[index - 1].columnName);
                      }
                    "
                    @change="
                      (val) => {
                        handleChange(val, readyFormList[index - 1].columnName);
                      }
                    "
                  />

                  <div
                    :ref="readyFormList[index - 1].columnName"
                    style="
                      display: none;
                      position: absolute;

                      z-index: 999999999999999999;
                    "
                  >
                    <panelSearch
                      :column-name="readyFormList[index - 1].columnName"
                      :panel-search-data="panelSearchData"
                      @setColumnNameData="setColumnNameData"
                    />
                  </div>
                </el-form-item>
              </template>
              <!-- 下拉框多选 -->
              <template v-if="readyFormList[index - 1].domType === 'muliSelect'">
                <el-form-item
                  :label="readyFormList[index - 1].columnComment"
                  :prop="readyFormList[index - 1].columnName"
                >
                  <el-cascader
                    v-model="form[readyFormList[index - 1].columnName]"
                    clearable
                    :props="{
                      multiple: true,
                      checkStrictly: true,
                      value: 'code',
                      leaf: 'isLeaf',
                    }"
                    filterable
                    :options="
                      formSelectProps[readyFormList[index - 1].columnName]
                    "
                  />
                </el-form-item>
              </template>

              <!-- 时间 datetime -->
              <template v-if="readyFormList[index - 1].domType === 'datetime'">
                <el-form-item
                  :label="readyFormList[index - 1].columnComment"
                  :prop="readyFormList[index - 1].columnName"
                >
                  <el-date-picker
                    v-model="form[readyFormList[index - 1].columnName]"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="
                      isEdit &&
                        readyFormList[index - 1].isPrimaryKey === 'Y' &&
                        !!formValues[readyFormList[index - 1].columnName]
                    "
                  />
                </el-form-item>
              </template>
            </el-col>

            <el-col v-if="index < readyFormList.length" :span="12">
              <!-- 输入框 -->
              <el-form-item
                v-if="readyFormList[index].domType === 'input'"
                :label="readyFormList[index].columnComment"
                :prop="readyFormList[index].columnName"
              >
                <template
                  v-if="
                    readyFormList[index].columnName === 'JD' ||
                      readyFormList[index].columnName === 'WD'
                  "
                >
                  <div style="display: flex">
                    <el-input
                      v-model="form[readyFormList[index].columnName]"
                      :disabled="
                        isEdit &&
                          readyFormList[index].isPrimaryKey === 'Y' &&
                          !!formValues[readyFormList[index].columnName] || readyFormList[index].columnText==='统一填1' || readyFormList[index].columnComment=='文件名'
                      "
                      :maxlength="readyFormList[index].columnLength"
                      :placeholder="readyFormList[index].columnText"
                    />
                    <el-button
                      style="margin-left: 5px"
                      @click="onHandleSelectPoint"
                    >获取</el-button>
                  </div>
                </template>
                <el-input
                  v-else
                  v-model="form[readyFormList[index].columnName]"
                  :disabled="
                    isEdit &&
                      readyFormList[index].isPrimaryKey === 'Y' &&
                      !!formValues[readyFormList[index].columnName] || readyFormList[index].columnComment=='文件名'
                  "
                  :placeholder="readyFormList[index].columnText"
                  :maxlength="readyFormList[index].columnLength"
                />
              </el-form-item>
              <!-- 下拉框 -->
              <template v-if="readyFormList[index].domType === 'select'">
                <el-form-item
                  :label="readyFormList[index].columnComment"
                  :prop="readyFormList[index].columnName"
                >
                  <BigDataSelect
                    v-if="bigDataTable.indexOf(readyFormList[index].tableName) > -1"
                    :input-value="form[readyFormList[index].columnName.split('_')[0]]"
                    :select-value="form[readyFormList[index].columnName][0]"
                    :column-name="readyFormList[index].columnName"
                    :table-name="readyFormList[index].tableName"
                    :force-code="forceCode"
                    :equipment-code="equipmentCode"
                    :is-disabled="isEdit &&
                      readyFormList[index - 1].isPrimaryKey === 'Y' &&
                      !!formValues[readyFormList[index - 1].columnName]"
                    @setBigDataColumnValue="setBigDataColumnValue"
                  />
                  <el-cascader
                    v-else
                    ref="CascaderRef"
                    v-model="form[readyFormList[index].columnName]"
                    clearable
                    :props="formSelectProps[readyFormList[index].columnName]"
                    filterable
                    :disabled="
                      isEdit &&
                        readyFormList[index].isPrimaryKey === 'Y' &&
                        !!formValues[readyFormList[index].columnName]
                    "
                    :before-filter="
                      (val) => {
                        iptChange(
                          val,
                          readyFormList[index].columnName,
                          readyFormList[index]
                        );
                      }
                    "
                    @visible-change="
                      (val) => {
                        visibleChange(val, readyFormList[index].columnName);
                      }
                    "
                    @change="
                      (val) => {
                        handleChange(val, readyFormList[index].columnName);
                      }
                    "
                  />

                  <div
                    :ref="readyFormList[index].columnName"
                    style="
                      display: none;
                      position: absolute;
                      z-index: 999999999999999999;
                    "
                  >
                    <panelSearch
                      :column-name="readyFormList[index].columnName"
                      :panel-search-data="panelSearchData"
                      @setColumnNameData="setColumnNameData"
                    />
                  </div>
                </el-form-item>
              </template>
              <!-- 多选下拉框 -->
              <template v-if="readyFormList[index].domType === 'muliSelect'">
                <el-form-item
                  :label="readyFormList[index].columnComment"
                  :prop="readyFormList[index].columnName"
                >
                  <!-- form[readyFormList[index].columnName] -->
                  <el-cascader
                    v-model="form[readyFormList[index].columnName]"
                    clearable
                    class="container-content-input"
                    filterable
                    :props="{
                      multiple: true,
                      checkStrictly: true,
                      value: 'code',
                      leaf: 'isLeaf',
                    }"
                    :options="formSelectProps[readyFormList[index].columnName]"
                  />
                </el-form-item>
              </template>

              <!-- 时间日期选择器 -->
              <template v-if="readyFormList[index].domType === 'datetime'">
                <el-form-item
                  :label="readyFormList[index].columnComment"
                  :prop="readyFormList[index].columnName"
                >
                  <el-date-picker
                    v-model="form[readyFormList[index].columnName]"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="
                      isEdit &&
                        readyFormList[index].isPrimaryKey === 'Y' &&
                        !!formValues[readyFormList[index].columnName]
                    "
                  />
                </el-form-item>
              </template>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row :key="index + 'row'" :gutter="10">
            <el-col :span="24">
              <el-form-item
                :label="readyFormList[index - 1].columnComment"
                :prop="readyFormList[index - 1].columnName"
              >
                <!-- 输入框 -->
                <el-input
                  v-if="readyFormList[index - 1].domType === 'textarea'&&readyFormList[index - 1].columnComment === '文件名'"
                  v-model="form[readyFormList[index - 1].columnName]"
                  placeholder="文件名来自上传文件,不支持修改"
                  type="textarea"
                />
                <el-input
                  v-else
                  v-model="form[readyFormList[index - 1].columnName]"
                  :placeholder="form[readyFormList[index - 1].columnText]"
                  type="textarea"
                />
                <!-- 文件 -->
                <template v-if="readyFormList[index - 1].domType === 'file'">
                  <div class="uploadfile">
                    <el-upload
                      ref="uploadfile"
                      :on-success="onUploadSuccess"
                      :action="actions"
                      class="container-content-input"
                      style="
                        display: inline-block;
                        margin-left: 5px;
                        float: left;
                      "
                      :limit="1"
                      :file-list="fileList"
                      :on-remove="handleRemove"
                      :on-exceed="onExceed"
                      :on-preview="handlePreview"
                      :before-upload="beforeUpload"
                    >
                      <el-button
                        size="small"
                        type="primary"
                      >点击上传</el-button>
                    </el-upload>
                    <el-button
                      v-if="filePath || imgurl"
                      style="float: left;"
                      size="small"
                      type="text"
                      @click="onPreview(filePath || imgurl)"
                    >预览</el-button>
                  </div>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </template>
    </template>
    <MapSelectPosition
      :visible="visible"
      :position="[form.JD, form.WD]"
      @closeDialog="closeDialog"
      @getPoint="getPoint"
    />
    <el-dialog v-if="filePath || imgurl" class="qiefen-dialog-class" title="媒体对象预览" :visible.sync="showFile">
      <div v-if="filePath" class="pdf-section">
        <pdfToImage :pdf-url="filePath" />
      </div>
      <div v-if="imgurl" style="display: flex;justify-content: center;">
        <el-image style="width:400px;height:480px;" :src="imgurl" />
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
import * as API from '@/api/index'
import * as DataCollectionAPI from '@/api/dataCollection'
import { parseTime } from '@/utils/index'
import MapSelectPosition from '@/components/MapSelectPosition'
import pdfToImage from '@/views/DataSearch/ClassifyTheme/pdfToImage'
import bus from '@/utils/bus'
import panelSearch from './panelSearch.vue'
// import Item from '../../../../layout/components/Sidebar/Item.vue'
// import { set } from 'ol/transform'
import BigDataSelect from '@/components/BigDataSelect'
import { BIG_DATA_TABLE } from '@/common/config.js'
export default {
  components: { MapSelectPosition, pdfToImage, panelSearch, BigDataSelect },
  props: {
    thirdLevel: {
      type: String,
      default: ''
    },
    secondLevel: {
      type: String,
      default: ''
    },
    firstLevel: {
      type: String,
      default: ''
    },

    tab: {
      type: String,
      default: ''
    },
    resetText: {
      type: String,
      default: ''
    },
    formList: {
      type: Array,
      default: () => {
        return []
      }
    },
    formValues: {
      type: Object,
      default: () => {
        return {}
      }
    },
    forceCode: {
      type: String,
      default: ''
    },
    equipmentCode: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isSequence: {
      type: String,
      default: ''
    },
    categoryName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      actions: '',
      a: [['01'], ['06', '0601'], ['07']],
      // 准备好的表单数据
      readyFormList: [],
      // 表单
      form: {},
      // 表单验证规则
      formRules: {},
      // 下拉框---异步---prop
      formSelectProps: {},
      // 回显时要用的下拉框数据
      selectOptions: {},
      // 文件列名
      fileColumn: '',
      // 文件列表
      fileList: [],
      // 是否显示地图拾点弹窗
      visible: false,
      loading: false,
      filePath: '',
      imgurl: '',
      showFile: false,
      labelIsshow: {},
      panelSearchData: [],
      bigDataTable: BIG_DATA_TABLE
    }
  },
  watch: {
  },
  created() {
    // this.$nextTick(()=>{
    //   console.log(this.$refs.colRef)
    // })
    this.actions = `/upgrade/online/upload/${this.tab}`
    this.setFormInfoAndRules(this.tab, this.formList)
    setTimeout(() => {
      this.setFormValues(this.formValues)
    }, 100)
    for (let i = 0; i < this.readyFormList.length; i++) {
      this.labelIsshow[this.readyFormList[i].columnName] = false
    }
  },
  methods: {
    // 下拉搜索选择
    setColumnNameData(val) {
      sessionStorage.setItem('form', JSON.stringify(this.form))

      if (val) {
        this.setFormInfoAndRules(this.tab, this.formList)
      }

      this.$refs[val.columnName][0].style.display = 'none'

      setTimeout(() => {
        if (val) {
          this.form = JSON.parse(sessionStorage.getItem('form'))
          this.$set(this.form, val.columnName, val.data[0])
        }
      }, 100)
    },
    // 下拉搜索输入
    iptChange(val, columnName, item) {
      this.$refs[columnName][0].style.display = 'block'
      const arr = {
        dictCodes: [val],
        tableName: item.tableName
      }
      this.standardDictSearch(arr)
      const domArr = document.getElementsByClassName('el-cascader__dropdown')
      for (const item in domArr) {
        if (domArr[item].style) {
          domArr[item].style.display = 'none'
        }
      }
    },
    // 下拉搜索接口数据
    standardDictSearch(arr) {
      API.standardDictSearch(arr).then((res) => {
        this.panelSearchData = res.data
      })
    },
    // 下拉隐藏后事件
    visibleChange(val, columnName) {
      this.$refs[columnName][0].style.display = 'none'
      if (val) {
        this.$refs[columnName][0].style.display = 'none'
      }
    },
    // 单选下拉选中后隐藏
    handleChange(val, columnName) {
      if (columnName == 'SFZHM_KEY') {
        bus.$emit('SFZHM_KEY', val[0])
      }
      bus.$emit('ShipNumber', val)
      for (const item in this.$refs.CascaderRef) {
        if (this.$refs.CascaderRef[item].dropDownVisible) {
          this.$refs.CascaderRef[item].dropDownVisible = false
        }
      }
    },
    // 设置基本信息表单字段和验证规则
    setFormInfoAndRules(tab, formList) {
      this.loading = true
      const form = {}
      const rules = {}
      const selectFormProp = {}
      const rowAreaItems = []
      const rowFileItems = []
      const commonItem = []
      formList.forEach((item) => {
        if (item.domType === 'textarea') {
          rowAreaItems.push(item)
        } else if (item.domType === 'file') {
          this.fileColumn = item.columnName
          rowFileItems.push(item)
        } else {
          commonItem.push(item)
        }
      })
      this.readyFormList = [...commonItem, ...rowAreaItems, ...rowFileItems]
      this.readyFormList.forEach(async(item) => {
        // 字段添加
        form[item.columnName] = ''
        if (item.domType === 'select') {
          if (item.columnName.indexOf('_KEY') < 0) {
            item.columnName = item.columnName + '_KEY'
            // item.columnName = item.columnName;
          }
          form[item.columnName] = ''
          // 设置下拉框内容
          selectFormProp[item.columnName] = this.setSelectFormProp(tab, item)
        }
        if (item.domType === 'muliSelect') {
          if (item.columnName.indexOf('_KEY') < 0) {
            item.columnName = item.columnName + '_KEY'
          }
          // 设置下拉框内容
          selectFormProp[item.columnName] = await this.setMulitiSelectData(
            tab,
            item
          )
        }
        // 验证规则添加
        rules[item.columnName] = []
        if (item.isNullable === 'N') {
          rules[item.columnName].push({
            required: true,
            message: `${item.columnComment}不能为空`
          })
        }
        if (item.columnRegular && item.isNullable === 'N') {
          rules[item.columnName].push({
            validator: (rule, value, callback) => {
              const reg = new RegExp(item.columnRegular)
              if (!reg.test(value)) {
                return callback(new Error(item.columnText))
              }
              return callback()
            },
            trigger: 'blur'
          })
        }
        if (item.columnRegular && item.isNullable === 'Y') {
          rules[item.columnName].push({
            validator: (rule, value, callback) => {
              if (value) {
                const reg = new RegExp(item.columnRegular)
                if (!reg.test(value)) {
                  return callback(new Error(item.columnText))
                }
                return callback()
              } else {
                return callback()
              }
            },
            trigger: 'blur'
          })
        }
      })
      this.form = form
      this.formRules = rules

      this.formSelectProps = selectFormProp
      setTimeout(() => {
        this.loading = false
      }, 200)
    },
    // 设置下拉框内容
    setSelectFormProp(tab, item, isMuliti) {
      const forceCode = this.forceCode
      const equipmentCode = this.equipmentCode

      const props = {
        multiple: false,
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const param = {
            columnName: item.columnName.split('_')[0],
            // tableName: tab,
            tableName: item.tableName,
            sequence: node.level === 0 ? '' : node.data.id,
            forceCode: forceCode,
            equipmentCode: equipmentCode,
            sync: false
          }

          DataCollectionAPI.getSelectOptions(param).then((res) => {
            const { data } = res
            data.forEach((item) => {
              item.value = item.code
              item.leaf = item.isLeaf
            })
            resolve(data)
          })
        }
      }
      if (isMuliti) {
        props.multiple = true
      }
      return props
    },
    // 设置多选下拉框数据
    setMulitiSelectData(tab, item) {
      return new Promise((resolve) => {
        const param = {
          columnName: item.columnName.split('_')[0],
          tableName: item.tableName,
          sequence: '',
          forceCode: this.forceCode,
          equipmentCode: this.equipmentCode,
          sync: true
        }
        DataCollectionAPI.getSelectOptions(param).then((res) => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            resolve(data)
          } else {
            this.$message.error(msg)
            resolve([])
          }
        })
      })
    },
    // 是否通过校验
    isValidate() {
      return this.$refs[this.tab].validate()
    },
    // 清空表单数据
    ResetFormData() {
      this.handleRemove()

      for (const item in this.readyFormList) {
        if (
          Object.prototype.toString.call(
            this.form[this.readyFormList[item].columnName]
          ) == '[object Number]'
        ) {
          this.form[this.readyFormList[item].columnName] = ''
          console.log(this.form[this.readyFormList[item].columnName])
        }
        if (
          Object.prototype.toString.call(
            this.form[this.readyFormList[item].columnName]
          ) == '[object String]'
        ) {
          this.form[this.readyFormList[item].columnName] = ''
          console.log(this.form[this.readyFormList[item].columnName])
        }
        if (
          Object.prototype.toString.call(
            this.form[this.readyFormList[item].columnName]
          ) == '[object Object]'
        ) {
          this.form[this.readyFormList[item].columnName] = {}
          console.log(this.form[this.readyFormList[item].columnName])
        }
        if (
          Object.prototype.toString.call(
            this.form[this.readyFormList[item].columnName]
          ) == '[object Array]'
        ) {
          this.form[this.readyFormList[item].columnName] = []
          console.log(this.form[this.readyFormList[item].columnName])
        }
        if (
          Object.prototype.toString.call(
            this.form[this.readyFormList[item].columnName]
          ) == '[object Null]'
        ) {
          this.form[this.readyFormList[item].columnName] = null
          console.log(this.form[this.readyFormList[item].columnName])
        }
      }
    },
    // 获取表单数据
    getFormData() {
      const formData = Object.assign({}, this.form)
      const a = Object.assign({}, this.form)
      for (const key in this.form) {
        const selectAttributeList = this.formList.filter(
          (item) => item.domType === 'select' && key === item.columnName
        )
        const dateAttributeList = this.formList.filter(
          (item) => item.domType === 'datetime' && key === item.columnName
        )
        const muliSelectAttributeList = this.formList.filter(
          (item) => item.domType === 'muliSelect' && key === item.columnName
        )
        // 下拉框内容重置
        if (selectAttributeList && selectAttributeList.length > 0) {
          if (formData[key] && formData[key].length > 0) {
            const saveKey = key.split('_')[0]
            formData[saveKey] = formData[key][formData[key].length - 1]
          }
          // else {
          //  const saveKey = key.split('_')[0]
          //  formData[saveKey] = formData[key][formData[key].length - 1]
          // formData[saveKey] = ''
          // }
        }
        // 多选下拉框内容
        if (muliSelectAttributeList && muliSelectAttributeList.length > 0) {
          if (formData[key] && formData[key].length > 0) {
            const valueArr = []
            // 如果是二维数组
            if (Array.isArray(formData[key][0])) {
              formData[key].forEach((item) => {
                valueArr.push(item[item.length - 1])
              })
            } else {
              // 不是二维数组
              formData[key].forEach((item) => {
                valueArr.push(item)
              })
            }
            const saveKey = key.split('_')[0]
            formData[saveKey] = valueArr
          }
        }
        // 时间数据格式化
        if (dateAttributeList && dateAttributeList.length > 0) {
          if (a[key]) {
            a[key] = parseTime(a[key], '{y}-{m}-{d} {h}:{m}:{s}')
          }
        }
        if (formData[key] == null) {
          formData[key] = ''
        }
      }
      if (this.fileColumn) {
        formData.isFile = true
        formData.filePath = this.form[this.fileColumn]
      }
      return formData
    },
    // 表单数据设置
    setFormValues(formValue) {
      this.form = Object.assign(this.form, formValue)
      console.log('861', this.form)
      for (const key in this.form) {
        const selectAttributeList = this.formList.filter(
          (item) => item.domType === 'select' && key === item.columnName
        )

        // 下拉框内容重置
        if (selectAttributeList && selectAttributeList.length > 0) {
          if (this.form[key]) {
            // this.form[key] = [this.form[key]];
            this.$set(this.form, key, new Array(this.form[key]))
            this.getSelectValue(
              this.form[key][0],
              key,
              selectAttributeList[0].tableName
            )
          }
        }
        const muliSelectAttributeList = this.formList.filter(
          (item) => item.domType === 'muliSelect' && key === item.columnName
        )
        // 多选下拉框内容
        if (muliSelectAttributeList && muliSelectAttributeList.length > 0) {
          if (this.form[key]) {
            // setTimeout(() => {
            this.getMulitiSelectValue(
              this.form[key],
              key,
              muliSelectAttributeList[0].tableName
            )
            // }, 500)
          }
        }

        // 文件
        if (key === this.fileColumn && this.fileColumn !== '' && key !== '') {
          if (this.formValues.UNIQUE) {
            DataCollectionAPI.getFileInfo({
              data: this.formValues.UNIQUE,
              tableName: this.tab
            }).then((res) => {
              const { code, data, msg } = res
              if (String(code) === '200') {
                this.fileList = [
                  {
                    name: data.filePath.substring(
                      data.filePath.lastIndexOf('/') + 1
                    ),
                    url: data.prefix + data.filePath
                  }
                ]
                this.form[key] = data.filePath

                // 取字符串的最后一项
                // //console.log(data.filePath.split('.')[data.filePath.split('.').length-1])
                if (data.filePath.split('.')[data.filePath.split('.').length - 1] == 'pdf' || data.filePath.split('.')[data.filePath.split('.').length - 1] == 'PDF') {
                  this.filePath = data.prefix + data.filePath
                  // console.log(this.filePath)
                }

                if (data.filePath.split('.')[data.filePath.split('.').length - 1] == 'jpg' || data.filePath.split('.')[data.filePath.split('.').length - 1] == 'JPG' || data.filePath.split('.')[data.filePath.split('.').length - 1] == 'png' || data.filePath.split('.')[data.filePath.split('.').length - 1] == 'PNG') {
                  this.imgurl = data.prefix + data.filePath
                  // console.log(this.imgurl)
                }
              } else {
                this.$message.error(msg)
              }
            })
          }
        }
      }
    },
    // 回显下拉框内容
    getSelectValue(dictCode, columnName, tableName) {
      if (typeof (dictCode) === 'object') {
        const params = {
          columnName: columnName.split('_')[0],
          dictCodes: dictCode,
          tableName: tableName,
          forceCode: this.forceCode,
          equipmentCode: this.equipmentCode
        }
        DataCollectionAPI.getSingleSelectTreeByCode(params).then((res) => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            this.form[columnName] = data[0]
          } else {
            this.$message.error(msg)
          }
        })
      } else {
        const params = {
          columnName: columnName.split('_')[0],
          dictCodes: [dictCode],
          tableName: tableName,
          forceCode: this.forceCode,
          equipmentCode: this.equipmentCode
        }
        DataCollectionAPI.getSingleSelectTreeByCode(params).then((res) => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            this.form[columnName] = data[0]
          } else {
            this.$message.error(msg)
          }
        })
      }
    },
    // 回显多选下拉框内容
    getMulitiSelectValue(dictCodes, columnName, tableName) {
      const params = {
        columnName: columnName.split('_')[0],
        dictCodes: dictCodes,
        tableName: tableName,
        forceCode: this.forceCode,
        equipmentCode: this.equipmentCode
      }
      DataCollectionAPI.getSingleSelectTreeByCode(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.form[columnName] = data
          // console.log('this.form',this.form,this.form[columnName])
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 上传成功
    onUploadSuccess(files, fileList) {
      const { code, msg } = files
      if (String(code) === '200') {
        this.form[this.fileColumn] = msg
        // //console.log(files);
        // //console.log(msg);
      } else {
        this.fileList = []
        this.$message.error(msg)
      }
    },
    // 判断上传文件的类型
    beforeUpload(file) {
      const testmsg = 'jpg,bmp,gif,jpeg,png,mp3,mp4,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb,doc,docx,xls,xlsx,ppt,pptx,html,htm,txt,rtf,rar,zip,gz,bz2,pdf,dmp,xml'
      const testdata = testmsg.split(',')
      let extension = true
      if (testdata.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) < 0) {
        extension = false
        this.$message({
          message: '上传文件只能是 jpg, bmp, gif, jpeg, png, mp3, mp4, wav, wma, wmv, mid, avi, mpg, asf, rm, rmvb, doc, docx, xls, xlsx, ppt, pptx, html, zip, htm, txt, rtf, rar, gz, bz2, pdf, dmp, xml格式!',
          type: 'warning'
        })
      }
      return extension
    },
    // 移出
    handleRemove(files, fileList) {
      this.fileList = []
      this.showFile = false
      this.filePath = ''
      this.imgurl = ''
      this.form[this.fileColumn] = ''
    },
    // 预览
    onPreview(url) {
      // console.log(url)
      this.showFile = true
    },
    // 预览
    handlePreview(file) {
      // this.filePath = file.url;
      // this.imgurl = file.url;

      if (file.name.split('.')[1] === 'html') {
        window.open(file.url)
      } else {
        this.showFile = true
      }

      // const dom = document.createElement('a')
      // dom.setAttribute('target', '_blank')
      // dom.setAttribute('href', this.filePath)
      // dom.click()
    },
    // 超出上传限制
    onExceed() {
      this.$message.warning('最多只能上传一个文件！')
    },
    // 地图选点
    onHandleSelectPoint() {
      this.visible = true
    },
    // 关闭弹窗
    closeDialog() {
      this.visible = false
    },
    // 获取选点
    getPoint(data) {
      this.form.JD = Number(data.lng).toFixed(4)
      this.form.WD = Number(data.lat).toFixed(4)
    },
    // 设置大数据下拉框值
    setBigDataColumnValue(columnName, value) {
      this.form[columnName] = [value]
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .ol-popups{
  display:none !important;
}
>>> .el-dialog__header{
  background:#1f7cd7;
}
>>> .el-dialog__title{
  color:#fff
}
.pdf-section {
  width: 100%;
  height: 600px;
  overflow-y: auto;
}
</style>
<style>
/* .el-tabs__content{
  height: 100%;
} */
.el-tab-pane {
  height: 100%;
}
.el-cascader--small {
  width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.uploadfile {
  position: relative;
}
.el-cascader__tags{
top: 5px !important;
transform: translateY(0%) !important
}

</style>
