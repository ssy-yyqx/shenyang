<template>
  <div class="content-section">
    <div class="form-search">
      <el-form label-width="80px" class="search-border">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工程类别" style="margin-bottom:0;">
              <el-checkbox-group
                v-model="formCombatData.GCFLNM"
                @change="
                  (val) => {
                    onChangeVal(val, 'GCFLNM');
                  }
                "
              >
                <el-checkbox
                  v-for="(item, index) in combatData.GCFLNM"
                  :key="index"
                  :label="item.GCFLNM"
                  name="type"
                >{{ item.MC }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="保护区" style="margin-bottom:0;">
              <el-checkbox-group
                v-model="formCombatData.BHQNM"
                @change="
                  (val) => {
                    onChangeVal(val, 'BHQNM');
                  }
                "
              >
                <el-checkbox
                  v-for="(item, index) in combatData.BHQNM"
                  :key="index"
                  :label="item.BHQNM"
                  name="type"
                >{{ item.MC }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="display:flex;">
            <el-form-item label="防卫类别" style="margin-bottom:0;">
              <el-checkbox-group
                v-model="formCombatData.FWLBNM"
                @change="
                  (val) => {
                    onChangeVal(val, 'FWLBNM');
                  }
                "
              >
                <el-checkbox
                  v-for="(item, index) in combatData.FWLBNM"
                  :key="index"
                  :label="item.FWLBNM"
                  name="type"
                >{{ item.MC }}</el-checkbox>
              </el-checkbox-group>

            </el-form-item>
            <el-button type="primary" style="margin-left: 150px;margin-bottom: 10px;width: 70px;height: 35px;" @click="onSubmit">查询</el-button>
            <el-button
              class="elbutton"
              style="position: relative;height:36px;"
              @click="daochu"
            >
              <img
                style="width:20px;height:20px;position:absolute;top:20%;"
                :src="require(`@/icons/newImages/daochu.png`)"
                class="img-class"
                alt=""
              >
              <span style="margin-left:20px">导出</span>
            </el-button>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
    <div class="search-data">
      <span class="tag-title"> 全部结果> </span>

      <el-tag v-for="(tag,index) in searchTag" v-show="index < numFlag" :key="index" class="tag-data" effect="plain" closable @close="handleClose(tag)">
        {{ tag.label }}
      </el-tag>
      <el-tag v-if="searchTag.length >= numFlag+1">
        +{{ searchTag.length - numFlag }}
      </el-tag>
    </div>
    <div class="table-result">
      <el-table :data="tableCombatData.tableData" style="width: 100%">
        <el-table-column
          v-for="(item, index) in tableCombatData.tableFiled"
          :key="index"
          :prop="item.labelCode"
          :label="item.labelName"
          width="180"
        />
      </el-table>
    </div>
    <div class="pager-section">
      <el-pagination
        :current-page="pager.currentPage"
        :page-sizes="pager.pageSizes"
        :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import * as API from '@/api/DataReorganize'
import Container from '@/components/Container'
export default {
  name: 'Preparedness',
  components: { Container },
  data() {
    return {
      numFlag: 6,
      formCombatData: {
        FWLBNM: [],
        BHQNM: [],
        GCFLNM: []
      },
      searchTag: [],
      reultArr: {
        FWLBNM: [],
        BHQNM: [],
        GCFLNM: []
      },
      combatData: {},
      tableCombatData: [],
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getGCParams()
    this.getData(this.formCombatData)
  },
  methods: {
    daochu(data) {
      console.log(this.formCombatData)
      API.getExportSearchData(this.formCombatData, 'GC').then(res => {
        const { code, msg } = res
        if (String(code) === '200') {
          window.open(msg)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 搜索接口调用
    getData(data) {
      API.getData(data, this.pager, 'GC').then((res) => {
        this.tableCombatData = res.data
        this.pager.total = res.data.total
      })
    },
    // 一页显示多少个
    handleSizeChange(val) {
      this.pager.pageSize = val
      this.getData(this.formCombatData)
    },
    // 第几页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.getData(this.formCombatData)
    },
    // 搜索数据
    onSubmit() {
      this.getData(this.formCombatData)
    },
    // 搜索条件数据获取
    getGCParams() {
      API.getGCParams().then((res) => {
        this.combatData = res.data
      })
    },
    // 关闭标签
    handleClose(tag) {
      if (this.formCombatData[tag.type].indexOf(tag.code) != -1) {
        this.formCombatData[tag.type].splice(
          this.formCombatData[tag.type].indexOf(tag.code),
          1
        )
        this.searchTag.splice(this.searchTag.indexOf(tag), 1)
      }
    },
    // 选择数据
    onChangeVal(val, type) {
      this.reultArr[type] = []
      if (type == 'GCFLNM') {
        this.formCombatData.GCFLNM = val
      }
      if (type == 'BHQNM') {
        this.formCombatData.BHQNM = val
      }
      if (type == 'FWLBNM') {
        this.formCombatData.FWLBNM = val
      }
      val.forEach((item) => {
        this.reultArr[type].push({
          label: this.combatData[type].find((e) => e[type] == item).MC,
          code: this.combatData[type].find((e) => e[type] == item)[type],
          type: type
        })
      })

      this.getTagData()
    },
    // 处理tag数据
    getTagData() {
      this.searchTag = []
      if (this.reultArr.GCFLNM.length > 0) {
        this.searchTag.push(...this.reultArr.GCFLNM)
      }
      if (this.reultArr.BHQNM.length > 0) {
        this.searchTag.push(...this.reultArr.BHQNM)
      }
      if (this.reultArr.FWLBNM.length > 0) {
        this.searchTag.push(...this.reultArr.FWLBNM)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content-section {
  background: #fff;
  padding-bottom: 20px;

  .form-search {
    // border-bottom: 1px solid #e6e6e6;
    margin: 20px;
    .search-border {
      border: 1px solid #e6e6e6;
      padding-top: 20px;
      margin-bottom: 20px;
    }
  }
  .search-data {
    margin: 0px 20px;
    .tag-title {
      font-size: 14px;
      color: #555555;
    }
    .tag-data {
      margin-right: 10px;
      border-color: #e6e6e6;
      color: #555555;
    }
  }
  .table-result {
    border: 1px solid #e6e6e6;
    margin: 5px 22px 22px 22px;

    padding: 20px 10px;
    padding-bottom: 2px;
    .table-result-title {
      font-size: 14px;
      font-weight: bold;
      line-height: 30px;
      color: #555555;
    }
    .rows-particulars {
      width: 100%;
      height: 30px;
      margin-top: -20px;
      div {
        float: right;
        font-size: 14px;
        color: #555555;
      }
    }
    .table-row {
      font-size: 14px;
      color: #555555;
      .table-row-li {
        margin-bottom: 20px;
        .table-description {
          background: #e6e6e6;
          padding: 4px 6px;
        }
      }
    }
  }
  .pager-section {
    margin-top: 20px;
    text-align: right;
    margin-right: 20px;
  }
}
</style>
