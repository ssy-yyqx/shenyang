<template>
  <div class="ht-editor">
    <div class="ht-editor__toolbar">
      <el-button type="text" @click="onHandleFontWeight">加粗</el-button>
      <el-button type="text" @click="onHandleUnderLine">下划线</el-button>
      <el-button type="text" @click="onHandleCenterLine">横中线</el-button>
      <el-button type="text" @click="onHandleFontSize">字体大小</el-button>
      <el-button type="text" @click="onHandleInsert">插入字段</el-button>
    </div>
    <div class="ht-editor__container" v-html="content" contenteditable="true">
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '<div><center><b><span style="font-size: 28px">标题</span></b><center></div>'+
      '<div><span style="font-size: 18px;"><u>段落1</u></span></div>'+
      '<div><span style="font-size: 18px;"><s>段落2</s></span></div>'+
      '<div><span style="font-size: 18px;">段落3</span></div>'
    }
  },
  mounted() {
    document.onpaste = new Function("event.returnValue=false");
  },
  methods: {
    // 加粗
    onHandleFontWeight() {
      console.log(window.getSelection().toString())
      console.log(window.getSelection().anchorOffset)
      
    },
    // 下划线
    onHandleUnderLine() {

    },
    // 横中线
    onHandleCenterLine() {

    },
    // 字体大小
    onHandleFontSize() {

    },
    // 插入字段
    onHandleInsert() {
      console.log(window.getSelection().focusOffset)
      console.log('插入字段')
    },
    getData() {
      return document.querySelector('.ht-editor__container').innerHTML
    }
  }
}
</script>

<style lang="scss" scoped>
.ht-editor{
  width: 100%;
  height: calc(100% - 60px);
  background-color: #FAFAFA;
  padding: 10px;
  &__toolbar{
    width: 100%;
    background-color: #FFFFFF;
    padding: 5px 20px;
    border: 1px solid hsl( 0,0%,82.7% );
    border-radius: 3px;
  }
  &__container{
    margin-top: 10px;
    background-color: #FFFFFF;
    line-height: 30px;
    padding: 10px;
  }
}
</style>