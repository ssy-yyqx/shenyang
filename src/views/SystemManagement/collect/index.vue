<template>
  <Container>
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="4" class="listcol">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item>
              <el-input
                v-model="formInline.user"
                class="input"
                placeholder="输入搜索内容"
                clearable
                @clear="onclear"
                @input="onSubmit"
              />
            </el-form-item>
          </el-form>
          <ul class="list">
            <li
              v-for="(item, index) in SlistData"
              :key="index"
              :class="isIndex == index ? 'active' : ''"
              @click="getColumnSeqTables(item.tableName, index)"
            >
              {{ item.tableComment }}
            </li>
            <li v-if="SlistData.length == 0" style="color: rgba(169, 169, 169)">
              没有数据
            </li>
          </ul>
        </el-col>
        <el-col :span="20">
          <div class="rigthLlist">
            <div class="tableHead">
              <table
                class="dataTabble"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <thead>
                  <tr>
                    <th width="50%">字段key</th>
                    <th width="50%">字段名称</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="tableBody">
              <table
                class="dataTabble"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <draggable v-model="tablelist" element="tbody" @update="onEnd">
                  <tr v-for="(item, id) in tablelist" :key="id">
                    <td width="50%">{{ item.key }}</td>
                    <td width="50%">{{ item.value }}</td>
                  </tr>
                </draggable>
              </table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </Container>
</template>

<script>
// import * as API from '@/api/SystemManagement'
import Container from '@/components/Container'
import draggable from 'vuedraggable'
import * as API from '@/api/index'
export default {
  components: { Container, draggable },
  data() {
    return {
      listData: [],
      SlistData: [],
      formInline: {},
      tablelist: [],
      isIndex: 0,
      form: {
        columnList: [],
        tableName: ''
      }
    }
  },
  mounted() {
    this.getListLeft()
  },

  methods: {
    onclear() {
      this.SlistData = this.listData
    },
    onEnd() {
      this.form.columnList = []
      for (const item in this.tablelist) {
        this.form.columnList.push(this.tablelist[item].key)
      }
      // console.log(this.form);
      this.getCustomizeTables(this.form)
    },
    getCustomizeTables(data) {
      API.getCustomizeTables(data).then((res) => {
        console.log(res)
      })
    },
    getListLeft() {
      API.getInfoTables().then((res) => {
        console.log(res)
        this.listData = res.data
        this.SlistData = res.data
        this.getColumnSeqTables(res.data[0].tableName, 0)
      })
    },
    onSubmit() {
      console.log(this.formInline.user)
      if (!this.formInline.user) {
        this.getListLeft()
        this.isIndex = 0
        return false
      }
      this.isIndex = -1
      this.SlistData = []
      for (const item in this.listData) {
        if (
          this.listData[item].tableComment.indexOf(this.formInline.user) != -1
        ) {
          this.SlistData.push(this.listData[item])
        }
      }
    },
    getColumnSeqTables(tableName, index) {
      this.isIndex = index
      this.form.tableName = tableName
      const data = {
        tableName: tableName
      }
      API.getColumnSeqTables(data).then((res) => {
        console.log(res)
        this.tablelist = []
        for (const item in res.data) {
          this.tablelist.push({
            key: item,
            value: res.data[item]
          })
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
.container {
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: #fff;
}
li {
  list-style: none;
}
.listcol {
  border: 1px solid #e7e9ee;
  padding: 20px;
}
.list {
  overflow-y: scroll;
  height: calc(100vh - 264px);
  position: relative;
  border: 1px solid #e7e9ee;
}
.list li {
  height: 40px;
  width: 100%;
  border-bottom: 1px solid #e7e9ee;

  text-align: center;
  line-height: 40px;
  background: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
  cursor: pointer;
  font-size: 14px;
  &:nth-last-child(1) {
    border: none;
  }
}
.item {
  height: 50px;
  width: 100%;
  line-height: 50px;
  text-align: center;
  background: #fff;
}

.dataTabble {
  width: 100%;
  border: 1px solid #ebeef5;
  th {
    color: #fff;
    font-size: 14px;
    background-color: #1f7cd7;
    border-right: 1px solid #fff;

    &:nth-last-child(1) {
      border-right: none;
    }
  }
  tr {
    height: 40px;
    line-height: 40px;
    background-color: #fff;

    &:nth-child(2n) {
      background: #fafafa;
    }
    &:nth-last-child(1) td {
      border-bottom: none;
    }
    td {
      text-align: center;
      color: #606266;
      font-size: 14px;
      border-bottom: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;

      &:nth-last-child(1) {
        border-right: none;
      }
    }
  }
}
.btn {
  width: 30px;
  height: 26px;
}
.input {
  width: 13vw;
}
.active {
  background: #1f7cd7 !important;
  color: #fff;
}
.tableBody {
  overflow-y: scroll;
  height: calc(100vh - 213px);
  position: relative;
}
.tableHead {
  border-right: 1px solid #fff;
  border-left: none;
}
</style>
