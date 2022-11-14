<template>
  <div class="setting-container">
    <div v-if="type !== 'view'" class="left-section">
      <div
        class="statistic-item"
        draggable="true"
        @dragstart="
          (event) => {
            onDragText(event);
          }
        "
      >
        <i class="iconfont icon--wenbenmiaoshu"> 文本</i>
      </div>
      <div
        class="statistic-item"
        draggable="true"
        @dragstart="
          (event) => {
            onDragPicture(event);
          }
        "
      >
        <i class="iconfont icon-charutupian"> 图片</i>
      </div>
      <div
        class="statistic-item"
        draggable="true"
        @dragstart="
          (event) => {
            onDragTable(event);
          }
        "
      >
        <i class="iconfont icon-biaodanzujian-biaoge"> 表格</i>
      </div>
      <div
        v-for="(item, index) in statisticTypes"
        :key="index"
        class="statistic-item"
        draggable="true"
        @dragstart="
          (event) => {
            onDrag(event, item);
          }
        "
      >
        <i :class="item.icon"> {{ item.value }}</i>
      </div>
    </div>
    <div class="right-sectin">
      <div class="form-section">
        <label>标题：</label>
        <el-input v-model="name" :disabled="type === 'view'" />
      </div>
      <div
        id="StatisticSection"
        class="statistic-section"
        @drop="drop"
        @dragover="allowDrop"
      />
    </div>
    <el-dialog
      width="50%"
      title="配置sql"
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <ChartSqlSetting
        v-if="currentEditChart.chartsType !== 'table'"
        ref="ChartSqlSetting"
        :chart-data="currentEditChart"
        :type="type"
      />
      <TableSqlSetting
        v-else
        ref="ChartSqlSetting"
        :chart-data="currentEditChart"
        :type="type"
      />
      <span slot="footer" class="dialog-footer">
        <template v-if="type !== 'view'">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="onHandleSave">确 定</el-button>
        </template>
        <el-button v-else @click="innerVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as API from "@/api/DataVisualization";
import ChartSqlSetting from "./ChartSqlSetting.vue";
import TableSqlSetting from "./TableSqlSetting.vue";
import UploadImage from "@/icons/img/upload.png";
import html2canvas from "html2canvas";
export default {
  components: { ChartSqlSetting, TableSqlSetting },
  props: {
    id: {
      type: String,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // 表单类型
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      name: "",
      // 统计类型列表
      statisticTypes: [
        {
          type: "barChart",
          value: "柱图",
          icon: "iconfont icon-tongjitubiao",
        },
        {
          type: "stripChart",
          value: "条形图",
          icon: "iconfont icon-tiaoxingtu2",
        },
        {
          type: "lineChart",
          value: "线图",
          icon: "iconfont icon-chart-trend",
        },
        {
          type: "pieChart",
          value: "饼图",
          icon: "iconfont icon-pie-chart-full",
        },
        {
          type: "roseChart",
          value: "玫瑰图",
          icon: "iconfont icon-meiguitu1",
        },
      ],
      // 当前统计信息
      currentStatistic: {
        type: "",
        value: "",
      },
      // 柱图配置
      barOption: {
        grid: {
          bottom: 30,
        },
        legend: {
          left: "center",
          data: [
            "编制数（人）",
            "现有数（人）",
            "在位数（人）",
            "可出动数（人）",
          ],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: {
          data: ["军（警）官", "义务兵", "士官"],
        },
        yAxis: { minInterval: 1 },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "编制数（人）",
            type: "bar",
            data: [105, 98, 97, 96],
          },
          {
            name: "现有数（人）",
            type: "bar",
            data: [105, 98, 97, 96],
          },
          {
            name: "在位数（人）",
            type: "bar",
            data: [105, 98, 97, 96],
          },
          {
            name: "可出动数（人）",
            type: "bar",
            data: [105, 98, 97, 96],
          },
        ],
      },
      // 条形图配置
      stripOption: {
        grid: {
          bottom: 30,
        },
        legend: {
          left: "center",
          data: [
            "编制数（人）",
            "现有数（人）",
            "在位数（人）",
            "可出动数（人）",
          ],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true },
          },
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: ["军（警）官", "义务兵", "士官"],
        },
        series: [
          {
            name: "编制数（人）",
            type: "bar",
            data: [105, 98, 97, 96],
          },
          {
            name: "现有数（人）",
            type: "bar",
            data: [105, 98, 97, 96],
          },
          {
            name: "在位数（人）",
            type: "bar",
            data: [105, 98, 97, 96],
          },
          {
            name: "可出动数（人）",
            type: "bar",
            data: [105, 98, 97, 96],
          },
        ],
      },
      // 线图配置
      lineOption: {
        grid: {
          bottom: 30,
        },
        legend: {
          left: "center",
          data: [
            "编制数（人）",
            "现有数（人）",
            "在位数（人）",
            "可出动数（人）",
          ],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true },
          },
        },
        xAxis: {
          type: "category",
          data: ["军（警）官", "义务兵", "士官"],
        },
        yAxis: { minInterval: 1 },
        series: [
          {
            name: "编制数（人）",
            type: "line",
            data: [105, 98, 97, 96],
          },
          {
            name: "现有数（人）",
            type: "line",
            data: [105, 98, 97, 96],
          },
          {
            name: "在位数（人）",
            type: "line",
            data: [105, 98, 97, 96],
          },
          {
            name: "可出动数（人）",
            type: "line",
            data: [105, 98, 97, 96],
          },
        ],
      },
      // 饼图配置
      pieOption: {
        // 鼠标悬浮
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: 20,
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "26",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "舰艇长",
                value: 4,
              },
              {
                name: "指挥员",
                value: 10,
              },
            ],
          },
        ],
      },
      // 玫瑰图配置
      roseOption: {
        // 鼠标悬浮
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: 20,
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            type: "pie",
            radius: [20, 50],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 5,
            },
            data: [
              {
                name: "舰艇长",
                value: 4,
              },
              {
                name: "指挥员",
                value: 10,
              },
              {
                name: "其他",
                value: 30,
              },
            ],
          },
        ],
      },
      // 图表列表
      chartList: [],
      // 是否显示sql设置窗口
      innerVisible: false,
      // 当前编辑图表
      currentEditChart: {},
      // 图表对象
      charts: {},
      // 文本编辑器配置
      editorConfig: {
        height: 140,
        extraPlugins: "dialog",
        toolbar: [["-", "Bold", "Italic"], ["Styles"]],
      },
      // 文本编辑器对象
      editors: {},
      // 表格初始化数据
      tableInitData: {
        columns: ["列1", "列2", "列3"],
        rows: [
          ["1-1", "1-2", "1-3"],
          ["2-1", "2-2", "2-3"],
          ["3-1", "3-2", "3-3"],
        ],
      },
    };
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          setTimeout(() => {
            if (this.id) {
              this.getChartList(this.id);
            }
          }, 200);
        } else {
          document.getElementById("StatisticSection").innerHTML = "";
          this.charts = {};
          this.name = "";
          this.chartList = [];
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 拖拽文本
    onDragText(ev) {
      ev.dataTransfer.setData("Type", "text");
    },
    // 拖拽图片
    onDragPicture(ev) {
      ev.dataTransfer.setData("Type", "picture");
    },
    // 拖拽表格
    onDragTable(ev) {
      ev.dataTransfer.setData("Type", "table");
    },
    onDrag(ev, data) {
      ev.dataTransfer.setData("Type", data.type);
      this.currentStatistic = data;
    },
    drop(ev) {
      ev.preventDefault();
      if (ev.target.id !== "StatisticSection") {
        return;
      }
      const type = ev.dataTransfer.getData("Type");
      const id = type + Date.now();
      if (type === "text") {
        this.generateTextElement(id, ev.target);
        this.initTextEditor(id);
        // 图表列表添加数据
        this.chartList.push({
          chartsId: id,
          chartsType: "text",
          dynamicSql: "",
          title: "",
          chartsLayout: "2", // 1: 50%  2: 100%
        });
      } else if (type === "picture") {
        this.generatePictureElement(id, ev.target);
        this.initPictureLoad(id);
        // 图表列表添加数据
        this.chartList.push({
          chartsId: id,
          chartsType: "picture",
          dynamicSql: "",
          title: "",
          chartsLayout: "2", // 1: 50%  2: 100%
        });
      } else if (type === "table") {
        this.generateTableElement(id, ev.target);
        this.initTable(id, this.tableInitData);
        // 图表列表添加数据
        this.chartList.push({
          chartsId: id,
          chartsType: "table",
          dynamicSql: "",
          title: "",
          chartsLayout: "2", // 1: 50%  2: 100%
        });
      } else {
        // 生成图表代码
        this.generateChartElement(id, ev.target);
        // 图表列表添加数据
        this.chartList.push({
          chartsId: id,
          chartsType: type,
          dynamicSql: "",
          title: "",
          chartsLayout: "1", // 1: 50%  2: 100%
        });
        // 初始化图表
        this[type](id);
      }
    },
    // 生成文本编辑代码
    generateTextElement(id, target) {
      const _this = this;
      // 组件容器
      const element = document.createElement("div");
      element.setAttribute("class", "statistic-section-item full-width");
      // 头部容器
      const headerElement = document.createElement("div");
      headerElement.setAttribute("class", "header");
      if (this.type !== "view") {
        // 关闭按钮
        const closeElement = document.createElement("i");
        closeElement.setAttribute("class", "el-icon-close");
        headerElement.appendChild(closeElement);
        closeElement.onclick = function () {
          target.removeChild(element);
          const removeIndex = _this.chartList.findIndex(
            (item) => item.chartsId === id
          );
          _this.chartList.splice(removeIndex, 1);
        };
      } else {
        // 下载按钮
        const downloadElement = document.createElement("i");
        downloadElement.setAttribute("class", "el-icon-download");
        headerElement.appendChild(downloadElement);
        downloadElement.onclick = function () {
          html2canvas(document.getElementById(id), {
            backgroundColor: "#FFFFFF",
          }).then((canvas) => {
            const dataURL = canvas.toDataURL("image/png");
            _this.download(dataURL);
          });
        };
      }
      // 图表容器
      const chartElement = document.createElement("div");
      chartElement.id = id;
      chartElement.setAttribute("class", "chart-section");
      // 添加头部元素
      element.appendChild(headerElement);
      // 添加图表元素
      element.appendChild(chartElement);
      // 添加组件
      target.appendChild(element);
    },
    // 初始化文本编辑器
    initTextEditor(id) {
      this.editors[id] = CKEDITOR.replace(id, this.editorConfig);
    },
    // 生成图片代码
    generatePictureElement(id, target) {
      const _this = this;
      // 组件容器
      const element = document.createElement("div");
      element.setAttribute("class", "statistic-section-item full-width");
      // 头部容器
      const headerElement = document.createElement("div");
      headerElement.setAttribute("class", "header");
      if (this.type !== "view") {
        // 关闭按钮
        const closeElement = document.createElement("i");
        closeElement.setAttribute("class", "el-icon-close");
        headerElement.appendChild(closeElement);
        closeElement.onclick = function () {
          target.removeChild(element);
          const removeIndex = _this.chartList.findIndex(
            (item) => item.chartsId === id
          );
          _this.chartList.splice(removeIndex, 1);
        };
      } else {
        // 下载按钮
        const downloadElement = document.createElement("i");
        downloadElement.setAttribute("class", "el-icon-download");
        headerElement.appendChild(downloadElement);
        downloadElement.onclick = function () {
          const item = _this.chartList.find((item) => item.chartsId === id);
          fetch(item.dynamicSql)
            .then((res) => res.blob())
            .then((blob) => {
              _this.download(URL.createObjectURL(blob));
            });
        };
      }
      // 图表容器
      const chartElement = document.createElement("div");
      chartElement.id = id;
      chartElement.setAttribute("class", "chart-section");
      // 添加头部元素
      element.appendChild(headerElement);
      // 添加图表元素
      element.appendChild(chartElement);
      // 添加组件
      target.appendChild(element);
    },
    // 初始化图片上传
    initPictureLoad(id, image) {
      const _this = this;
      const uploadDefaultImage = document.createElement("img");
      uploadDefaultImage.setAttribute("class", "image-container");
      uploadDefaultImage.style.display = "block";
      uploadDefaultImage.setAttribute("src", image || UploadImage);
      const inputFile = document.createElement("input");
      inputFile.setAttribute("type", "file");
      inputFile.style.display = "none";
      // 上传文件捕获
      inputFile.onchange = function () {
        const formData = new FormData();
        formData.append("file", inputFile.files[0]);
        API.uploadImage(formData).then((res) => {
          const { code, data } = res;
          if (String(code) === "200") {
            uploadDefaultImage.src = data;
            _this.chartList.forEach((item) => {
              if (item.chartsId === id) {
                console.log(item);
                item.dynamicSql = data;
              }
            });
          }
        });
      };
      uploadDefaultImage.onclick = function () {
        inputFile.click();
      };
      document
        .getElementById(id)
        .setAttribute("class", "chart-section image-section");
      document.getElementById(id).appendChild(uploadDefaultImage);
    },
    // 生成表格代码
    generateTableElement(id, target) {
      const _this = this;
      // 组件容器
      const element = document.createElement("div");
      element.setAttribute("class", "statistic-section-item full-width");
      // 头部容器
      const headerElement = document.createElement("div");
      headerElement.setAttribute("class", "header");
      if (this.type !== "view") {
        // 编辑按钮
        const editElement = document.createElement("i");
        editElement.setAttribute("class", "el-icon-edit");
        headerElement.appendChild(editElement);
        editElement.onclick = function () {
          _this.onHandleEdit(id);
        };
        // 关闭按钮
        const closeElement = document.createElement("i");
        closeElement.setAttribute("class", "el-icon-close");
        headerElement.appendChild(closeElement);
        closeElement.onclick = function () {
          target.removeChild(element);
          const removeIndex = _this.chartList.findIndex(
            (item) => item.chartsId === id
          );
          _this.chartList.splice(removeIndex, 1);
        };
      } else {
        // 查看按钮
        const editElement = document.createElement("i");
        editElement.setAttribute("class", "el-icon-view");
        headerElement.appendChild(editElement);
        editElement.onclick = function () {
          _this.onHandleEdit(id);
        };
        // 下载按钮
        const downloadElement = document.createElement("i");
        downloadElement.setAttribute("class", "el-icon-download");
        headerElement.appendChild(downloadElement);
        downloadElement.onclick = function () {
          html2canvas(document.getElementById(id), {
            backgroundColor: "#FFFFFF",
          }).then((canvas) => {
            const dataURL = canvas.toDataURL("image/png");
            _this.download(dataURL);
          });
        };
      }
      // 图表容器
      const chartElement = document.createElement("div");
      chartElement.id = id;
      chartElement.setAttribute("class", "chart-section");
      // 添加头部元素
      element.appendChild(headerElement);
      // 添加图表元素
      element.appendChild(chartElement);
      // 添加组件
      target.appendChild(element);
    },
    // 初始化表格
    initTable(id, tableData) {
      const tableElement = document.createElement("table");
      tableElement.setAttribute("border", 1);
      tableElement.setAttribute("cellspacing", 0);
      tableElement.setAttribute("cellpadding", 0);
      tableElement.setAttribute("class", "table-section");
      // 生成表头
      const headElement = document.createElement("tr");
      for (let i = 0, j = tableData.columns.length; i < j; i++) {
        const thElement = document.createElement("th");
        headElement.appendChild(thElement);
        thElement.innerHTML = tableData.columns[i];
      }
      tableElement.appendChild(headElement);
      // 生成表格内容
      for (let m = 0; m < tableData.rows.length; m++) {
        const trElement = document.createElement("tr");
        for (let n = 0; n < tableData.columns.length; n++) {
          const tdElement = document.createElement("td");
          trElement.appendChild(tdElement);
          tdElement.innerHTML = tableData.rows[m][n];
        }
        tableElement.appendChild(trElement);
      }
      document.getElementById(id).appendChild(tableElement);
    },
    // 生成图表代码
    generateChartElement(id, target, layout) {
      console.log(id);
      const _this = this;
      // 组件容器
      const element = document.createElement("div");
      if (layout === "2") {
        element.setAttribute("class", "statistic-section-item full-width");
      } else {
        element.setAttribute("class", "statistic-section-item");
      }
      // 头部容器
      const headerElement = document.createElement("div");
      headerElement.setAttribute("class", "header");
      if (this.type !== "view") {
        // 放大按钮
        const expandElement = document.createElement("i");
        if (layout === "2") {
          expandElement.setAttribute("class", "hide el-icon-zoom-in");
        } else {
          expandElement.setAttribute("class", "show el-icon-zoom-in");
        }
        headerElement.appendChild(expandElement);
        expandElement.onclick = function () {
          expandElement.setAttribute("class", "hide el-icon-zoom-in");
          smallElement.setAttribute("class", "show el-icon-zoom-out");
          element.setAttribute("class", "statistic-section-item full-width");
          _this.charts[id].resize();
          // 设置布局
          const chart = _this.chartList.find((item) => item.chartsId === id);
          chart.chartsLayout = "2";
        };

        // 缩小按钮
        const smallElement = document.createElement("i");
        if (layout === "2") {
          smallElement.setAttribute("class", "show el-icon-zoom-out");
        } else {
          smallElement.setAttribute("class", "hide el-icon-zoom-out");
        }
        headerElement.appendChild(smallElement);
        smallElement.onclick = function () {
          smallElement.setAttribute("class", "hide el-icon-zoom-out");
          expandElement.setAttribute("class", "show el-icon-zoom-in");
          element.setAttribute("class", "statistic-section-item");
          _this.charts[id].resize();
          // 设置布局
          const chart = _this.chartList.find((item) => item.chartsId === id);
          chart.chartsLayout = "1";
        };
        // 编辑按钮
        const editElement = document.createElement("i");
        editElement.setAttribute("class", "el-icon-edit");
        headerElement.appendChild(editElement);
        editElement.onclick = function () {
          _this.onHandleEdit(id);
        };
        // 关闭按钮
        const closeElement = document.createElement("i");
        closeElement.setAttribute("class", "el-icon-close");
        headerElement.appendChild(closeElement);
        closeElement.onclick = function () {
          target.removeChild(element);
          const removeIndex = _this.chartList.findIndex(
            (item) => item.chartsId === id
          );
          _this.chartList.splice(removeIndex, 1);
        };
      } else {
        // 查看按钮
        const editElement = document.createElement("i");
        editElement.setAttribute("class", "el-icon-view");
        headerElement.appendChild(editElement);
        editElement.onclick = function () {
          _this.onHandleEdit(id);
        };
        // 下载按钮
        if (!id) {
          const downloadElement = document.createElement("i");
          downloadElement.setAttribute("class", "el-icon-download");
          headerElement.appendChild(downloadElement);
          downloadElement.onclick = function () {
            _this.download(
              _this.charts[id].getDataURL({
                pixelRatio: 2,
                backgroundColor: "#fff",
              })
            );
          };
        }
      }

      // 图表容器
      const chartElement = document.createElement("div");
      chartElement.id = id;
      chartElement.setAttribute("class", "chart-section");
      // 添加头部元素
      element.appendChild(headerElement);
      // 添加图表元素
      element.appendChild(chartElement);
      // 添加组件
      target.appendChild(element);
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    // 初始化柱图
    barChart(id, data) {
      var myChart = this.$echarts.init(document.getElementById(id));
      if (data) {
        const { legend, axis, series } = this.getChartsDataByDataset(
          "barChart",
          data
        );
        this.barOption.legend.data = legend;
        this.barOption.xAxis.data = axis;
        this.barOption.series = series;
      }
      myChart.setOption(this.barOption);
      this.$set(this.charts, id, myChart);
    },
    // 初始化条形图
    stripChart(id, data) {
      var myChart = this.$echarts.init(document.getElementById(id));
      if (data) {
        if (data) {
          const { legend, axis, series } = this.getChartsDataByDataset(
            "stripChart",
            data
          );
          this.stripOption.legend.data = legend;
          this.stripOption.yAxis.data = axis;
          this.stripOption.series = series;
        }
      }
      myChart.setOption(this.stripOption);
      this.$set(this.charts, id, myChart);
    },
    // 初始化线图
    lineChart(id, data) {
      var myChart = this.$echarts.init(document.getElementById(id));
      if (data) {
        const { legend, axis, series } = this.getChartsDataByDataset(
          "lineChart",
          data
        );
        this.lineOption.legend.data = legend;
        this.lineOption.xAxis.data = axis;
        this.lineOption.series = series;
      }
      myChart.setOption(this.lineOption);
      this.$set(this.charts, id, myChart);
    },
    // 初始化饼图
    pieChart(id, data) {
      const pieChart = this.$echarts.init(document.getElementById(id));
      if (data) {
        this.pieOption.series[0].data = data;
      }
      pieChart.setOption(this.pieOption);
      this.$set(this.charts, id, pieChart);
    },
    // 初始化玫瑰图
    roseChart(id, data) {
      const pieChart = this.$echarts.init(document.getElementById(id));
      if (data) {
        this.roseOption.series[0].data = data;
      }
      pieChart.setOption(this.roseOption);
      this.$set(this.charts, id, pieChart);
    },
    // 修改图表
    onHandleEdit(chartsId) {
      this.currentEditChart = this.chartList.find(
        (item) => item.chartsId === chartsId
      );
      this.innerVisible = true;
    },
    // 保存sql修改
    onHandleSave() {
      if (this.currentEditChart.chartsType === "table") {
        const data = this.$refs.ChartSqlSetting.getData();
        this.currentEditChart.dynamicSql = data.sql;
        this.currentEditChart.title = data.title;
        const params = {
          chartsType: this.currentEditChart.chartsType,
          sql: this.currentEditChart.dynamicSql,
        };
        API.getThematicDataBySql(params).then((res) => {
          const { code, data, msg } = res;
          if (String(code) === "200") {
            this.updateTable(this.currentEditChart.chartsId, data);
            this.innerVisible = false;
          } else {
            this.$message.error(msg);
          }
        });
      } else {
        if (this.$refs.ChartSqlSetting.activeName === "example") {
          const data = this.$refs.ChartSqlSetting.getChartData();
          this.updateChart(this.currentEditChart.chartsType, data);
          this.innerVisible = false;
        } else {
          const data = this.$refs.ChartSqlSetting.getData();
          this.currentEditChart.dynamicSql = data.sql;
          this.currentEditChart.title = data.title;
          API.getCustomizeStatisticDataBySql({
            chartsType: this.currentEditChart.chartsType,
            sql: this.currentEditChart.dynamicSql,
          }).then((res) => {
            const { code, data, msg } = res;
            if (String(code) === "200") {
              // 更新图表
              this.updateChart(this.currentEditChart.chartsType, data);
              this.innerVisible = false;
            } else {
              this.$message.error(msg);
            }
          });
        }
      }
    },
    // 更新图表
    updateChart(chartsType, data) {
      if (chartsType === "pieChart" || chartsType === "roseChart") {
        const options = this.charts[this.currentEditChart.chartsId].getOption();
        options.series[0].data = data;
        this.charts[this.currentEditChart.chartsId].clear();
        this.charts[this.currentEditChart.chartsId].setOption(options, {
          replaceMerge: "dataset",
        });
      } else {
        const { legend, axis, series } = this.getChartsDataByDataset(
          chartsType,
          data
        );
        if (chartsType === "barChart" || chartsType === "lineChart") {
          this.charts[this.currentEditChart.chartsId].setOption({
            legend: {
              data: legend,
            },
            xAxis: {
              data: axis,
            },
            series: series,
          });
        } else {
          this.charts[this.currentEditChart.chartsId].setOption({
            legend: {
              data: legend,
            },
            yAxis: {
              data: axis,
            },
            series: series,
          });
        }
      }
    },
    // 更新表格
    updateTable(id, tableData) {
      document.getElementById(id).innerHTML = "";
      this.initTable(id, tableData);
    },
    // 获取柱状图、线图、条形图数据
    getChartsDataByDataset(chartsType, data) {
      let legend = [];
      const series = [];
      const axis = [];
      data.forEach((item, index) => {
        if (index === 0) {
          legend = item.slice(1);
          for (let i = 1; i < item.length; i++) {
            series.push({
              name: item[i],
              type: chartsType === "lineChart" ? "line" : "bar",
              data: [],
            });
          }
        } else {
          axis.push(item[0]);
          for (let i = 1; i < item.length; i++) {
            series[i - 1].data.push(item[i]);
          }
        }
      });
      return {
        legend,
        axis,
        series,
      };
    },
    // 获取图表列表
    getChartList(id) {
      this.charts = {};
      API.getThematicDataDetail({ id: id }).then((res) => {
        const { code, data, msg } = res;
        if (String(code) === "200") {
          this.chartList = data.chartsList;
          this.name = data.name;
          this.chartList.forEach((item) => {
            if (item.chartsType === "text") {
              this.generateTextElement(
                item.chartsId,
                document.getElementById("StatisticSection")
              );
              if (this.type !== "view") {
                this.initTextEditor(item.chartsId);
              }
              document.getElementById(item.chartsId).innerHTML =
                item.dynamicSql;
            } else if (item.chartsType === "picture") {
              this.generatePictureElement(
                item.chartsId,
                document.getElementById("StatisticSection")
              );
              this.initPictureLoad(item.chartsId, item.dynamicSql);
            } else if (item.chartsType === "table") {
              this.generateTableElement(
                item.chartsId,
                document.getElementById("StatisticSection")
              );
              this.initTable(item.chartsId, item.chartsData);
            } else {
              this.generateChartElement(
                item.chartsId,
                document.getElementById("StatisticSection"),
                item.chartsLayout
              );
              // 初始化图表
              this[item.chartsType](item.chartsId, item.chartsData);
            }
          });
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 获取图表数据 --- 父组件调用
    getSaveData() {
      this.chartList.forEach((item) => {
        if (item.chartsType === "text") {
          item.dynamicSql = this.editors[item.chartsId].getData();
        }
      });
      return {
        charts: this.chartList,
        name: this.name,
      };
    },
    // 下载
    download(url) {
      var oA = document.createElement("a");
      oA.download = "截图"; // 设置下载的文件名
      oA.href = url;
      document.body.appendChild(oA);
      oA.click();
      oA.remove(); // 下载之后把创建的元素删除
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-container {
  display: flex;
  background: #e7e9ef;
  height: 580px;
  .left-section {
    width: 120px;
    padding: 10px;
    .statistic-item {
      padding: 10px;
      cursor: move;
    }
  }
  .right-sectin {
    flex: 1;
    padding: 10px;
    .form-section {
      width: 50%;
      display: flex;
      align-items: center;
      label {
        word-break: keep-all;
      }
    }
    .statistic-section {
      padding: 10px;
      border: 1px solid #dfdfdf;
      width: 100%;
      margin-top: 10px;
      background: #ffffff;
      height: calc(100% - 40px);
      overflow-y: auto;
    }
  }
}
</style>
<style lang="scss">
.statistic-section-item {
  width: calc(50% - 10px);
  height: 200px;
  border: 1px solid #dfdfdf;
  border-radius: 2px;
  position: relative;
  display: inline-block;
  margin: 5px;
  .header {
    padding: 10px;
    text-align: right;
    i {
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
    .show {
      display: inline-block;
    }
    .hide {
      display: none;
    }
  }
  .chart-section {
    width: 100%;
    height: calc(100% - 40px);
    padding: 0 10px;
  }
}
.full-width {
  width: calc(100% - 10px);
}
.image-container {
  width: auto;
  height: 140px;
  cursor: pointer;
}
.image-section {
  display: flex;
  justify-content: center;
}
.table-section {
  width: 100%;
}
</style>
