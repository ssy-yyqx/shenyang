<template>
  <div class="conT">
    <div class="content">
      <el-card shadow="never">
        <div class="left">
          <div>
            <div class="title">选择组件</div>
            <div
              v-for="(item, index) of assembly"
              :key="index"
              class="assembly"
              @click="handleSelectAssembly(item.value)"
            >
              <el-image style="width: 20px; height: 20px" :src="item.image" />
              <span class="font">{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="right">
          右
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assembly: [
        {
          image: require('@/icons/img/font.png'),
          name: '文本',
          value: '1'
        },
        {
          image: require('@/icons/img/table.png'),
          name: '表格',
          value: '2'
        },
        {
          image: require('@/icons/img/tablePhoto.png'),
          name: '图表',
          value: '3'
        },
        {
          image: require('@/icons/img/photo.png'),
          name: '图片',
          value: '4'
        }
      ]
    }
  },
  created() {},
  methods: {
    handleSelectAssembly(value) {}
  }
}
</script>

<style lang="scss" scoped>
.conT {
  height: 100%;
  .content {
    height: 100%;
    ::v-deep .el-card {
      height: 100%;
      margin-bottom: 30px;
      .el-card__body {
        height: 100%;
        display: flex;
        .left {
          width: 10%;
          height: 100%;
          .title {
            height: 30px;
            line-height: 30px;
            font-size: 18px;
            margin-bottom: 10px;
          }
          .assembly {
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 35px;
            background-color: #f2f2f2;
            margin-bottom: 20px;
            .el-image {
              margin-right: 10px;
            }
            .font{
              line-height: 35px;
            }
          }
        }
        .right {
          width: 90%;
          height: 100%;
          background-color: yellow;
        }
      }
    }
  }
}
</style>
