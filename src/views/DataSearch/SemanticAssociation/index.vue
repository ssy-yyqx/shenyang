<template>
  <Container>
    <iframe :src="baseurl" width="100%" height="100%" style="border: none" overflow="none" />
  </Container>
</template>

<script>
// import * as API from '@/api/DataSearch'
import Container from '@/components/Container'
import { BADEURL } from '../../../../static/ifrema/index'
export default {
  components: { Container },
  data() {
    return {
      input3: '',
      baseurl: BADEURL,
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 2,
        pageSizes: [10, 15, 20, 30]
      }
    }
  },
  methods: {
    searchButton() {
      this.$message.success('搜索')
    }
  }
}
</script>

<style lang="scss" scoped>
#background {
  background: url("../../../icons/newImages/menuIcon/search.png") no-repeat;
  background-position: center;
  height: 80%;
  width: 80%;
  background-size: cover;
  position: fixed;
}
.el-select .el-input {
    width: 130px;
  }
.input-with-select{
  width: 570px;
  margin-right: 0;
  box-shadow:#d3d4da  0  3 5 5;
}

</style>
