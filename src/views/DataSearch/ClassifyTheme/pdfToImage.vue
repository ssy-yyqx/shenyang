<template>
  <div class="wrap">
    <div class="bg-img pdf-list"></div>
  </div>
</template>

<script>
import * as PDFJS from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
export default {
  props: {
    pdfUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      canvasArr: [],
      scale: 1.5, // 放大倍数
    };
  },
  computed: {
    docid() {
      return this.$route.query.docid;
    },
  },
  mounted() {
    //http://192.168.0.104:9896/profile/blob/%E6%B5%8B%E8%AF%95.pdf
    this.transformImage(this.pdfUrl);
  },

  methods: {
    // 初始化pdf

    async transformImage(value) {
      const loadingTask = PDFJS.getDocument(value);
      const pdfList = document.querySelector(".pdf-list");
      pdfList.innerHTML = "";
      loadingTask.promise.then(async (pdf) => {
        // pdf 总页数
        let pages = pdf.numPages; //声明一个pages变量等于当前pdf文件的页数
        for (let i = 1; i <= pages; i++) {
          //循环页数
          let canvas = document.createElement("canvas");
          canvas.width = 200;
          let page = await pdf.getPage(i); //调用getPage方法传入当前循环的页数,返回一个page对象
          let scale = this.scale; //缩放倍数，1表示原始大小
          let viewport = page.getViewport({ scale });
          let context = canvas.getContext("2d"); //创建绘制canvas的对象
          var ratio = this.getPixelRatio(context);

          canvas.height = viewport.height * ratio; //定义canvas高和宽
          canvas.width = viewport.width * ratio;
          let renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext);

          canvas.className = `canvas`; //给canvas节点定义一个class名,这里我取名为canvas
          pdfList.appendChild(canvas); //插入到pdfList节点的最后
          this.canvasArr.push(canvas);
        }
      });
    },
    //设置清晰度
    getPixelRatio(context) {
      var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
      return (window.devicePixelRatio || 1) / backingStore;
    },
  },
};
</script>

<style scoped lang="scss">
</style>