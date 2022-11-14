<template>
  <Container id="map">
    <div
      v-loading="loading2"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      style="margin-bottom:12px;height:100%;width:100%;"
    >

      <MapOl id="StatisticSectionPreviews" ref="MapOl" :is-add-popup="true" :tools="mapTools" @searchByRange="searchByRange" @childFn="parentFn" @featureMarkerLayers="featureMarkerLayer" @clearBusinessData="clearBusinessData" />
      <div class="left">
        <el-button style="width: 63px;margin-bottom: 10px;height: 30px;background-color: #409EFF;" type="primary" @click="onHandleExportzip('zip')">导出数据包</el-button>
        <el-button style="width: 63px;margin-bottom: 10px;height: 30px;background-color: #409EFF;" type="primary" @click="onHandleExportword('word')">导出文档</el-button>
        <div class="leftTop">
          <!-- 级联选择器 -->
          <el-cascader
            ref="demoCascader"
            v-model="selectedIds"
            class="leftTopSelect"
            :options="optionss"
            :props="prop"
            clearable
            filterable

            @change="handleChange"
          />
          <!-- 远程搜索 模糊查询 -->
          <el-select
            ref="selects"
            v-model="value"
            clearable
            class="leftTopSearch"
            filterable
            remote
            placeholder="搜索地图"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="SearchMap"
            @clear="delValue"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
          <!-- 选择按钮 -->
          <el-button style="height:35px;" class="leftTopBtn" type="primary" @click="search">
            <img
              style="width: 24px;height: 24px;"
              :src="require(`@/icons/img/mapSearch/search.png`)"
              alt=""
            >
          </el-button>
        </div>
        <div class="leftCenter">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
          <div style="width: 100%;height: calc(100vh - 470px);overflow: auto;">
            <el-tree
              ref="tree"
              class="filter-tree"
              :data="treeData"
              node-key="id"
              :props="defaultProps"
              highlight-current
              :filter-node-method="filterNode"
              @node-click="handleCheckChange"
            />
          </div>
        </div>
        <div class="leftBtm">
          <div v-for="(item, index) in switchData" :key="index" class="leftBtmCon">
            <el-checkbox v-model="item.Value" class="leftBtmBox" @change="switchChange(item.checkType, $event)">{{ item.title }}</el-checkbox>
            <div v-for="(i,ind) in item.arr" :key="ind" ref="leftCon" :class="isSubCategoryData.indexOf(i)!=-1?'leftCon xuanzhong':'leftCon'" @click="del(item, i, $event)">
              <img
                style="width:24px;height:24px;vertical-align: middle;margin-right:2px"
                :src="i.src"
                alt=""
              >
              <i style="font-style: normal;">{{ i.label }}</i>
            </div>
          </div>
        </div>
      </div>

      <!-- 详情 -->
      <el-dialog
        title="详情信息"
        custom-class="qiefen-dialog-class"
        :visible.sync="dialogVisibleDetils"
        top="5vh"
        width="60%"
      >

        <!-- 战备工程基本信息 -->
        <div v-if="pointTypeS==2" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            基本信息
          </span>
          <div class="bottom" style="display:flex;justify-content: space-between;flex-wrap:wrap;">
            <p :title="allDataList.ZBGCMC" style="width:24%;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">名称：{{ allDataList.ZBGCMC?allDataList.ZBGCMC:"暂无" }}</p>
            <p style="width:24%;">代号：{{ allDataList.JBDZ?allDataList.JBDZ:"暂无" }}</p>
            <p style="width:24%;">工程分类：{{ allDataList.GCFLNM?allDataList.GCFLNM:"暂无" }}</p>
            <p style="width:24%;">竣工时间：{{ allDataList.JGSJ?allDataList.JGSJ:"暂无" }}</p>
            <p style="width:24%;">保护区：{{ allDataList.BHQNM?allDataList.BHQNM:"暂无" }}</p>
            <p style="width:24%;">经度：{{ allDataList.JD?allDataList.JD:"暂无" }}</p>
            <p style="width:24%;">纬度：{{ allDataList.WD?allDataList.WD:"暂无" }}</p>
            <p style="width:24%;">高程：{{ allDataList.GC?allDataList.GC:"暂无" }}</p>
            <p :title="`${allDataList.DMNM}`+`${allDataList.KZDM}`" style="width:24%;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;margin-bottom:15px;">位置：{{ allDataList.DMNM }}{{ allDataList.KZDM }}</p>
          </div>
          <el-divider style="margin-bottom:15px;" />
          <!-- 扩展信息 -->
          <div v-if="kzxxData.length!='0'">
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              {{ allDataList.GCFLNM }}信息
            </span>
            <div class="bottom">
              <p v-for="(item,index) in kzxxData" :key="index" :title="item.value" style="display:inline-flex;width:24%;">{{ item.key }}: <span style="width:24%;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;margin-bottom:15px;">{{ item.value }}</span></p>
            </div>
            <el-divider style="margin-bottom:15px;" />
          </div>
          <!-- 所在防护责任区 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              所在防护责任区
            </span>
            <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ allDataList.SZFHZRQ ? allDataList.SZFHZRQ : "暂无" }}</div>
          </div>
          <el-divider />
          <!-- 质量描述 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              质量描述
            </span>
            <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ allDataList.ZLMS ? allDataList.ZLMS : "暂无" }}</div>
          </div>
          <el-divider />

          <!-- 跑道方向（度分秒） -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              跑道方向（度分秒）
            </span>
            <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ msxxData.PDFX ? msxxData.PDFX : "暂无" }}</div>
          </div>
          <el-divider />
          <!-- 油库容量 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              油库容量
            </span>
            <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ msxxData.YKRL ? msxxData.YKRL : "暂无" }}</div>
          </div>
          <el-divider />
          <!-- 配套情况 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              配套情况
            </span>
            <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ msxxData.PTQK ? msxxData.PTQK : "暂无" }}</div>
          </div>
          <el-divider />
          <!-- 简述 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              简述
            </span>
            <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ msxxData.JS ? msxxData.JS : "暂无" }}</div>

          </div>
          <el-divider />
          <!-- 媒体信息 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              媒体信息
            </span>
            <div class="bottom">
              <el-carousel v-if="msxxData.MTXX && msxxData.MTXX.length > 0" height="250px" style="width:60%;margin:auto">
                <el-carousel-item v-for="(item,index) in msxxData.MTXX" :key="index">
                  <img :src="'data:image/jpeg;base64,'+item.mtdx" style="width:100%;height:100%" :title="item.fileName">
                </el-carousel-item>
              </el-carousel>
              <p v-else>暂无</p>
            </div>
          </div>
        </div>
        <!-- 作战力量信息-->
        <div v-if="pointTypeS==1" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            基本信息
          </span>
          <div v-if="Object.keys(zzllDetailsJBQK).length > 0" class="bottom zzlldetail" style="display:flex;flex-wrap:wrap;">
            <p class="nmZZLL" :title="zzllDetailsJBQK.BDNM" style="width:24%;display:flex;">部队番号：<span style="display:inline-block;width:150px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">{{ zzllDetailsJBQK.BDNM }}</span></p>
            <p style="width:24%;">战区：{{ zzllDetailsJBQK.ZQNM }}</p>
            <p style="width:24%;">军种：{{ zzllDetailsJBQK.JZLBNM }}</p>
            <p style="width:24%;">兵种：{{ zzllDetailsJBQK.BZNM }}</p>
            <p style="width:24%;">部队代号：{{ zzllDetailsJBQK.BDDH }}</p>
            <p style="width:24%;">部队级别：{{ zzllDetailsJBQK.BDJBNM }}</p>
            <p style="width:24%;">部队类别：{{ zzllDetailsJBQK.BDLBNM }}</p>
            <p style="width:24%;">力量区分：{{ zzllDetailsJBQK.LLQFNM }}</p>
            <p style="width:24%;">编成分类：{{ zzllDetailsJBQK.BCLBXFNM }}</p>
            <p style="width:24%;">编成类别：{{ zzllDetailsJBQK.BCLBNM }}</p>
            <p style="width:24%;">编制代号：{{ zzllDetailsJBQK.BZDH }}</p>
            <p style="width:24%;">建制类别：{{ zzllDetailsJBQK.JZLBNM }}</p>
            <p style="width:24%;">保障区：{{ zzllDetailsJBQK.BZQNM }}</p>
            <p style="width:24%;">供应性质：{{ zzllDetailsJBQK.GYXZNM }}</p>
          </div>
          <div style="padding-bottom: 15px;padding-top: 10px;">暂无</div>
          <el-divider />
          <!--担负任务-->
          <div style="margin-top:15px;">
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              担负任务
            </span>
            <template v-if="zzllDetailsDFRW.length && zzllDetailsDFRW.length > 0">
              <div v-for="item in zzllDetailsDFRW" class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ item.DFRW }}</div>
            </template>
            <template v-else>
              <div style="padding-bottom: 15px;padding-top: 10px;">暂无</div>
            </template>

          </div>
          <el-divider />
          <!--简述-->
          <div style="margin-top:15px;">
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              简述
            </span>
            <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ zzllDetailsJBQK.JS ? zzllDetailsJBQK.JS : "暂无" }}</div>

          </div>
          <el-divider />
          <!-- 媒体信息 -->
          <div style="margin-top:15px;">
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              媒体信息
            </span>
            <template v-if="zzllMTXX.length && zzllMTXX.length > 0">

              <el-carousel v-if="zzllMTXX" height="450px">
                <el-carousel-item v-for="(item,index) in zzllMTXX" :key="index">
                  <img :src="item" style="margin-left:15%;">
                </el-carousel-item>
              </el-carousel>

            </template>
            <template v-else>
              <div style="padding-bottom: 15px;padding-top: 10px;">暂无</div>
            </template>

          </div>
        </div>
        <!-- 后勤保障 -->
        <div v-if="pointTypeS==3" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;margin-top:15px;" />
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            基本信息
          </span>
          <div class="bottom" style="display:flex;flex-wrap:wrap;">
            <p style="width:24%;">设施名称：{{ hqbzDetailsData.SSMC }}</p>
            <p style="width:24%;display:flex;" :title="hqbzDetailsData.BDNM">部队番号：<span style="display:inline-block;width:150px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">{{ hqbzDetailsData.BDNM }}</span></p>
            <p style="width:24%;display:flex;" :title="`${hqbzDetailsData.DMNM}`+`${hqbzDetailsData.KZDM}`">位置：<span style="display:inline-block;width:150px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">{{ hqbzDetailsData.DMNM }}{{ hqbzDetailsData.KZDM }}</span></p>
            <p style="width:24%;">经度：{{ hqbzDetailsData.JD }}</p>
            <p style="width:24%;">纬度：{{ hqbzDetailsData.WD }}</p>
            <p style="width:24%;">高程：{{ hqbzDetailsData.GC?hqbzDetailsData.GC:'暂无' }}</p>

          </div>
          <el-divider />
          <!-- 扩展信息 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;margin-top:15px;" />
            <span
              v-if="this.hqbzValue=='YY'"
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              医院信息
            </span>
            <span
              v-if="this.hqbzValue=='XZ'"
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              血站信息
            </span>
            <div class="bottom">
              <p v-for="(item,index) in hqbzDetailkzxxData" :key="index" style="display:inline-block;width:24%;">{{ item.key }}: {{ item.value }}</p>
            </div>
            <el-divider />
          </div>
          <!--简述-->
          <div v-if="HQBZmsxxData">
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              简述
            </span>
            <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ HQBZmsxxData.value ? HQBZmsxxData.value : "暂无" }}</div>

          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button style="width:55px;height:35px;" type="primary" @click="dialogVisibleDetils = false">关 闭</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="详情信息"
        custom-class="qiefen-dialog-class"
        :visible.sync="dialogVisibleDetilsLittle"
        top="5vh"
        width="35%"
      >
        <!-- 战场环境信息 -->
        <div v-if="pointTypeS==4" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;margin-top:15px;" />
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            基本信息
          </span>
          <div class="bottom" style="display:flex;flex-wrap:wrap;">
            <p style="width:50%;" :title="zchjDetailsData.MC">名称：<span style="width:150px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">{{ zchjDetailsData.MC }}</span></p>
            <p style="width:50%;">序号：{{ zchjDetailsData.XH }}</p>
            <p style="width:50%;">经度：{{ zchjDetailsData.JD }}</p>
            <p style="width:50%;">纬度：{{ zchjDetailsData.WD }}</p>
            <p style="width:50%;">高程(米)：{{ zchjDetailsData.GC }}</p>
            <p style="width:50%;">用频属性：{{ zchjDetailsData.YPSXNM }}</p>
            <p style="width:50%;" :title="`${zchjDetailsData.MC}`+`${zchjDetailsData.KZDM}`">位置：<span style="display:inline-block;width:150px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">{{ zchjDetailsData.MC }}{{ zchjDetailsData.KZDM }}</span></p>
          </div>
          <el-divider />
          <!-- 媒体信息 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;margin-top:15px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              媒体信息
            </span>
            <div class="bottom">
              <el-carousel v-if="zchiImg.length>0">
                <el-carousel-item v-for="(item,index) in zchiImg" :key="index">
                  <img :src="item" style="margin-left:15%;">
                </el-carousel-item>
              </el-carousel>
              <div v-else>暂无</div>
            </div>
          </div>
        </div>
        <div v-if="pointTypeS==3" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;margin-top:15px;" />
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            基本信息
          </span>
          <div class="bottom" style="display:flex;flex-wrap:wrap;">
            <p style="width:50%;">设施名称：{{ hqbzDetailsData ? hqbzDetailsData.SSMC : 暂无 }}</p>
            <p style="width:50%;">部队番号：{{ hqbzDetailsData ? hqbzDetailsData.BDNM : 暂无 }}</p>
            <p style="width:50%;">位置：{{ hqbzDetailsData ? hqbzDetailsData.DMNM : 暂无 }}{{ hqbzDetailsData ? hqbzDetailsData.KZDM : 暂无 }}</p>
            <p style="width:50%;">经度：{{ hqbzDetailsData ? hqbzDetailsData.JD : 暂无 }}</p>
            <p style="width:50%;">纬度：{{ hqbzDetailsData ? hqbzDetailsData.WD : 暂无 }}</p>
            <p style="width:50%;">高程：{{ hqbzDetailsData ? hqbzDetailsData.GC:'暂无' }}</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button style="width:55px;height:35px;" type="primary" @click="dialogVisibleDetilsLittle = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container'
import * as API from '@/api/index'
// import Red from '@/icons/img/mapSearch/red.png'

import Blue from '@/icons/img/mapSearch/blue.png'
import Green from '@/icons/img/mapSearch/green.png'
import Orange from '@/icons/img/mapSearch/orange.png'
import MapOl from '@/components/MapOl'

import BDBS from '@/icons/img/jbImg/bdbs.png'
import JTJD from '@/icons/img/jbImg/jthjjd.png'
import MT from '@/icons/img/jbImg/mtgc.png'
import JCGC from '@/icons/img/jbImg/jcgc.png'
import TXGC from '@/icons/img/jbImg/txgc.png'
import CKGC from '@/icons/img/jbImg/ckgc.png'
import RFGC from '@/icons/img/jbImg/rfgc.png'
import DPGC from '@/icons/img/jbImg/dpgc.png'
import KD from '@/icons/img/jbImg/kddkjc.png'
import YK from '@/icons/img/jbImg/yk.png'
import XZ from '@/icons/img/jbImg/xz.png'
import YY from '@/icons/img/jbImg/yy.png'
import HSHHJ from '@/icons/img/jbImg/hshhj.png'
import JTMB from '@/icons/img/jbImg/jtmb.png'

import html2canvas from 'html2canvas'

export default {
  components: { Container, MapOl },
  data() {
    return {
      searchRegionData: [], // 选定地区后的数据
      treePoint: [],
      zipData: '',
      loading2: false,
      zzllMTXXOne: '',
      zchjDetailsData: [],
      dialogVisibleDetilsLittle: false,
      hqbzDetailsData: [],
      hqbzDetailkzxxData: [],
      HQBZmsxxData: [],
      hqbzValue: '',
      zzllDetailsJBQK: {},
      zzllDetailsDFRW: [],
      pointTypeS: '',
      dialogVisibleDetils: false,
      areaCode: [], // 部队树
      allData: [],
      selectedIds: [],
      indexArr: Number,
      // 地图工具
      mapTools: ['Home', 'RectSelect', 'CircleSelect', 'PolygonSelect', 'PointSelect', 'Clear', 'MeasureLine'],
      input: '',
      inputs: '',
      checkList: ['部队部署', '战场环境', '战备工程', '后勤保障'],
      switchData: [
        {
          Value: true,
          src: BDBS,
          title: '部队部署',
          type: '1',
          checkType: 'bdbs',
          arr: [
            {
              label: '部队部署',
              key: 'BS',
              src: BDBS,
              isShow: true
            }
          ]
        },
        {
          Value: true,
          src: Green,
          title: '战备工程',
          checkType: 'zbgc',
          type: '2',
          arr: [
            {
              label: '指挥防护工程',
              key: '01',
              src: Green,
              isShow: true
            },
            {
              label: '陆军设施工程',
              key: '02',
              src: Green,
              isShow: true
            },
            {
              label: '舰艇基地工程',
              key: '03',
              src: JTJD,
              isShow: true
            },
            {
              label: '码头',
              key: '04',
              src: MT,
              isShow: true
            },
            {
              label: '机场',
              key: '05',
              src: JCGC,
              isShow: true
            },
            {
              label: '阵地',
              key: '06',
              src: Green,
              isShow: true
            },
            {
              label: '通信',
              key: '07',
              src: TXGC,
              isShow: true
            },
            {
              label: '仓库',
              key: '08',
              src: CKGC,
              isShow: true
            },
            {
              label: '营房',
              key: '09',
              src: Green,
              isShow: true
            },
            {
              label: '人防',
              key: '10',
              src: RFGC,
              isShow: true
            },
            {
              label: '道坪',
              key: '11',
              src: DPGC,
              isShow: true
            },
            {
              label: '坑道(洞库)',
              key: '12',
              src: KD,
              isShow: true
            }
          ]
        },
        {
          Value: true,
          src: Blue,
          title: '后勤保障',
          checkType: 'hqbz',
          type: '3',
          arr: [
            {
              label: '油库',
              key: 'YK',
              src: YK,
              isShow: true
            },
            {
              label: '血站',
              key: 'XZ',
              src: XZ,
              isShow: true
            },
            {
              label: '医院',
              key: 'YY',
              src: YY,
              isShow: true
            }
          ]
        },
        {
          Value: true,
          src: Orange,
          title: '战场环境',
          checkType: 'zchj',
          type: '4',
          arr: [
            {
              label: '电磁环境',
              key: 'DCHJNM',
              src: Orange,
              isShow: true
            },
            {
              label: '核生化环境',
              key: 'HHSHJNM',
              src: HSHHJ,
              isShow: true
            },
            {
              label: '文化古迹',
              key: 'WHGJNM',
              src: Orange,
              isShow: true
            },
            {
              label: '教堂',
              key: 'JTNM',
              src: Orange,
              isShow: true
            },
            {
              label: '交通目标',
              key: 'JJYSNM',
              src: JTMB,
              isShow: true
            }
          ]
        }
      ],
      filterText: '', // 输入的关键字过虑
      treeData: [], // 树的数据
      defaultProps: {
        children: 'childList',
        label: 'label'
      }, // 树指定节点的属性

      // ====级联选择器====
      optionss: [],
      prop: {
        checkStrictly: true, // 单选
        // multiple: true, // 多选
        value: 'id',
        children: 'childList',
        label: 'label'
      },
      // ====远程搜索====
      options: [],
      value: '',
      list: [],
      loading: false,
      states: [],
      arrFieId: [],
      Region: [], // 当前级联选择器输入的值
      SearchValue: '', // 远程搜索时选中的值
      regionCodeData: '', // 行政区域的code码
      // coords:[], // 正方形的经纬度
      a: 0,
      starCoords: [],
      Alldata: {},
      fieldArr: [],
      allShow: true,
      isSubCategoryData: [],
      rangeDataType: [],
      kzxxData: [],
      msxxData: [],
      zzllMTXX: [],
      allDataList: [], // 数据列表
      zchiImg: [],
      allSwitchChangeData: []
    }
  },

  watch: {
    // 对节点进行过滤 参数为关键字
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // 获取树数据
    this.getUnitTree()
    // 获取行政区域的数据级联选择器
    this.getcascaderTree()
  },

  mounted() {},
  methods: {
    onHandleExportzip(val) {
      this.zipData = val
      this.gethtml2canvas()
    },
    onHandleExportword(val) {
      this.zipData = val
      this.gethtml2canvas()
    },
    gethtml2canvas() {
      const targetDom = document.querySelector('#StatisticSectionPreviews')
      setTimeout(() => {
        html2canvas(targetDom, {
          useCORS: true,
          backgroundColor: '#FFFFFF'
        }).then((canvas) => {
          var imgData = canvas.toDataURL('image/png')
          this.download(imgData)
          this.isDownloading = false
        })
      }, 200)
    },
    download(imgData) {
      const formData = new FormData()
      formData.append('file', this.base64ToFile(imgData), 'image/png')
      if (this.zipData === 'zip') {
        API.exportZip(formData).then(res => {
          const { code, data } = res
          if (String(code) === '200') {
            window.open(data)
          }
        })
      } else if (this.zipData === 'word') {
        API.exportWord(formData).then(res => {
          const { code, data } = res
          if (String(code) === '200') {
            window.open(data)
          }
        })
      }
    },
    base64ToFile(dataurl) {
      // 上传到服务器
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    // 战备工程详情模态框
    getDetail(val) {
      console.log(val)
      this.pointTypeS = val.pointType
      console.log(this.pointTypeS)
      this.dialogVisibleDetils = true
      let params = {}
      if (val) {
        params = {
          gcflnm: val.pointCategory,
          zbgcnm: val.pointNM
        }
      }
      API.getDetail(params).then((res) => {
        if (res.code === 200) {
          const list = []
          if (res.data.JCXX) {
            this.allDataList = res.data.JCXX
          } else if (res.data.KZXX) {
            this.kzxxData = res.data.KZXX
          }
          this.msxxData.MTXX = res.data.MTDX

          if (res.data.MSXX) {
            // this.msxxData.JS = res.data.MSXX[0].value
            // this.msxxData.PDFX = res.data.MSXX[1].value
            // this.msxxData.YKRL = res.data.MSXX[2].value
            // this.msxxData.PTQK = res.data.MSXX[3].value
            // this.msxxData.MTXX = res.data.MSXX[4].value
          }
        }
      })
    },
    // 作战力量详情弹框
    getZZLLDetail(val) {
      this.dialogVisibleDetils = true
      this.pointTypeS = val.pointType
      const prams = {
        pointNm: val.pointNM
      }
      API.getForceInfoDetails(prams).then(res => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          if (data.JBQK.length > 0) {
            this.zzllDetailsJBQK = data.JBQK[0]
          }

          if (data.MTDX && data.MTDX.length > 0) {
            this.zzllMTXX = []
            data.MTDX.forEach(item => {
              this.zzllMTXX.push(`data:image/jpeg;base64,` + item.mtdx)
            })
            console.log(this.zzllMTXX)
          }
          if (data.DFRW) {
            data.DFRW.forEach(item => {
              this.zzllDetailsDFRW.push(item)
            })
            console.log(this.zzllDetailsDFRW)
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 战场环境
    zchjDetails(val) {
      this.dialogVisibleDetilsLittle = true
      this.pointTypeS = val.pointType
      const prams = {
        areaCode: val.areaCode,
        pointCategory: val.pointCategory,
        pointNm: val.pointNM
      }
      API.getWarEnvironmentDeatil(prams).then(res => {
        this.zchjDetailsData = res.data.JBXX[0]
        this.zchiImg = []
        if (res.data.MTDX) {
          res.data.MTDX.forEach(item => {
            this.zchiImg.push(`data:image/jpeg;base64,` + item.mtdx)
          })
        }
      })
    },
    // 后勤保障详情
    hqbzDetails(val) {
      this.pointTypeS = val.pointType
      this.hqbzValue = val.pointCategory
      if (val.pointCategory == 'YK') {
        this.dialogVisibleDetilsLittle = true
      }
      if (val.pointCategory == 'YY' || val.pointCategory == 'XZ') {
        this.dialogVisibleDetils = true
      }
      const prams = {
        pointCategory: val.pointCategory,
        pointNm: val.pointNM
      }
      API.getLogisticsDetail(prams).then(res => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          this.hqbzDetailsData = data.JBXX[0]
          if (val.pointCategory == 'YK') {
            this.hqbzDetailkzxxData = data.KZXX[0]
          }
          if (val.pointCategory == 'YY' || val.pointCategory == 'XZ') {
            this.hqbzDetailkzxxData = data.KZXX
          }

          if (data.MSXX) {
            this.HQBZmsxxData = data.MSXX[0]
          } else {
            this.HQBZmsxxData = []
          }
        }
      })
    },
    // 地图图标点击事件
    featureMarkerLayer(val) {
      console.log(val, '1212')
      if (val && val.pointType == 2) { // 战备工程
        this.getDetail(val)
      } else if (val && val.pointType == 1) { // 作战力量
        this.getZZLLDetail(val)
      } else if (val && val.pointType == 4) { // 战场环境
        this.zchjDetails(val)
      } else if (val && val.pointType == 3) { // 后勤保障
        this.hqbzDetails(val)
      }
    },
    parentFn(val) {
      this.isSubCategoryData = []
      this.rangeDataType = []
    },
    handleCheckChange(obj, node, tree) {
      this.getPoint(obj.field)
      // if (obj.childList.length === 0) {
      //   this.getPoint(obj.field)
      // }
    },
    fly(data) {
      const JDWD = [data.pointJD, data.pointWD]
      this.$refs.MapOl.flyPoint(JDWD)
    },
    // 根据部队获取具体位置点
    getPoint(field) {
      const params = {
        bdnm: field
      }
      API.getPoint(params).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          console.log('data', data)
          // 树节点数据 显示隐藏标记
          this.treePoint = data
          this.allSwitchChangeData = data
          this.$refs.MapOl.addLayerAndGraphics('BS', data, BDBS)
          if (data.length > 0) {
            this.fly(data[0])
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取行政区域的数据级联选择器
    getcascaderTree() {
      API.getAreaTree().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.optionss = this.fn(data)
          // this.$refs.myTree.setChecks(this.treeData)
          // this.getFirstTableList(this.treeData)
        } else {
          this.$message.error(msg)
        }
      })
    },
    fn(data) {
      for (const item in data) {
        if (data[item].childList.length > 0) {
          this.fn(data[item].childList)
        } else {
          data[item].childList = null
        }
      }
      return data
    },
    // 获取树 单位编制的数据
    getUnitTree(areaCodes) {
      // console.log(areaCodes) // undefined
      if (areaCodes !== undefined && this.selectedIds.length > 0) {
        this.areaCode = areaCodes
      } else {
        this.areaCode = []
      }

      const data = {
        areaCode: this.areaCode
      }
      API.getForceTree(data).then(res => {
        if (res.code === 200) {
          this.treeData = res.data
          // this.$refs.tree.setChecks(this.treeData)
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 过滤节点方法  单位编制
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 远程搜索时点击子节点的值
    SearchMap(item) {
      this.SearchValue = item.regionCode
    },
    // 点击搜索按钮
    search() {
      if (this.SearchValue === '' && !this.selectedIds[this.selectedIds.length - 1]) {
        this.$message.error('请输入内容')
        return
      } else {
        this.$refs.MapOl.onHandleClear()
        this.getSearchRegionData()

        this.getRegionJson()
      }
    },
    // 可清空的单选模式下用户点击清空按钮时触发
    delValue() {
      this.$refs.MapOl.onHandleClear()
    },
    // 选定行政区域或自定义边界内数据综合查询
    getSearchRegionData() {
      const data = {
        regionCode: this.SearchValue || this.selectedIds[this.selectedIds.length - 1],
        type: 1
      }
      API.getRegionData(data).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.getDataJb(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 远程搜索方法  参数为当前输入值
    remoteMethod(query) {
      if (query === '') {
        return
      }
      this.Region = query
      const params = {
        region: this.Region
      }
      API.getRegion(params).then(res => {
        // console.log(res);
        if (res.code === 200) {
          this.states = res.data.map(i => {
            return {
              regionFullName: i.regionFullName,
              regionCode: i.regionCode
            }
          })

          // 远程搜索
          this.list = this.states.map(item => {
            // console.log(this.states,this.list)
            return {
              value: item.regionFullName,
              label: item.regionFullName,
              regionCode: item.regionCode
            }
          })

          if (query !== '') {
            this.loading = true
            setTimeout(() => {
              this.loading = false
              this.options = this.list.filter(item => {
                return (
                  item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                )
              })
            }, 200)
          } else {
            this.options = []
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 级联选择器的点击事件
    handleChange(value) {
      const obj = this.$refs['demoCascader'].getCheckedNodes()
      // console.log(obj)
      this.areaCode = obj.map(i => {
        // console.log(i.value)
        return i.value
      })
      // console.log(this.areaCode)

      this.$refs.MapOl.onHandleClear()
      if (value.length !== 0) {
        this.$refs.demoCascader.$el.style = 'width:232px'
        this.$refs.selects.$el.style = 'padding-left: 225px;width: 448px'
        this.getRegionData()
        this.getRegionJson()
        // 获取树数据
        this.getUnitTree(this.areaCode)
      } else {
        this.$refs.demoCascader.$el.style = 'width:90px'
        this.$refs.selects.$el.style = 'padding-left: 87px;width: 337px'
        if (this.selectedIds.length === 0) {
          this.getUnitTree()
        }
      }
    },
    // 点击级联选择器添加边界
    getRegionJson() {
      const obj = this.$refs['demoCascader'].getCheckedNodes()
      const data = {
        regionCode: this.SearchValue || obj[0].data.field
      }
      API.getRegionJson(data).then(res => {
        const { code, data, msg } = res
        if (code === 200) {
          // 添加边界
          this.$refs.MapOl.addRegionToMap(data.geoJson)
          // 飞到中心点
          this.$refs.MapOl.flyPoint([data.centerLon, data.centerLat], 8)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 选定行政区域或自定义边界内数据综合查询
    getRegionData() {
      const obj = this.$refs['demoCascader'].getCheckedNodes()
      const data = {
        regionCode: obj[0].data.field,
        type: 1
      }
      API.getRegionData(data).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.searchRegionData = data
          this.allSwitchChangeData = data
          this.getDataJb(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 根据选择范围搜索
    searchByRange(rangeData) {
      this.loading2 = true
      this.rangeDataType = rangeData
      // console.log(this.switchData)
      this.switchData.forEach(i => {
        i.Value = true
      })
      const data = {
        areaPointArr: rangeData.areaPointArr,
        type: rangeData.type === 'circle' ? 4 : 3,
        radio: Number(rangeData.radio)
      }
      if (rangeData.type === 'circle') {
        data.areaPointArr = [data.areaPointArr]
      }
      API.getRegionData(data).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.loading2 = false
          this.allData = data
          this.allSwitchChangeData = data
          this.getDataJb(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    getDataJb(data) {
      const bdbs = [] // 部队部署
      const dchj = [] // 电磁环境
      const hshhj = [] // 核生化环境
      const whgj = [] // 文化古迹
      const jt = [] // 教堂
      const jtmb = [] // 交通目标
      const zhfh = [] // 指挥防护工程
      const ljss = [] // 陆军设施工程
      const jtjd = [] // 舰艇基地工程
      const mt = [] // 码头
      const jc = [] // 机场
      const zd = [] // 阵地
      const tx = [] // 通信
      const ck = [] // 仓库
      const yf = [] // 营房
      const rf = [] // 人防
      const dp = [] // 道坪
      const kd = [] // 坑道(洞库)
      const yk = [] // 油库
      const xz = [] // 血站
      const yy = [] // 医院
      data.forEach((mapItem) => {
        if (mapItem.pointCategory === 'BS') { // 部队部署
          bdbs.push(mapItem)
        } else if (mapItem.pointCategory === 'DCHJ') { // 电磁环境
          dchj.push(mapItem)
        } else if (mapItem.pointCategory === 'HHSHJNM') { // 核生化环境
          hshhj.push(mapItem)
        } else if (mapItem.pointCategory === 'WHGJ') { // 文化古迹
          whgj.push(mapItem)
        } else if (mapItem.pointCategory === 'JT') { // 教堂
          jt.push(mapItem)
        } else if (mapItem.pointCategory === 'JJYS') { // 交通目标
          jtmb.push(mapItem)
        } else if (mapItem.pointCategory === '01') { // 指挥防护工程
          zhfh.push(mapItem)
        } else if (mapItem.pointCategory === '02') { // 陆军设施工程
          ljss.push(mapItem)
        } else if (mapItem.pointCategory === '03') { // 舰艇基地工程
          jtjd.push(mapItem)
        } else if (mapItem.pointCategory === '04') { // 码头
          mt.push(mapItem)
        } else if (mapItem.pointCategory === '05') { // 机场
          jc.push(mapItem)
        } else if (mapItem.pointCategory === '06') { // 阵地
          zd.push(mapItem)
        } else if (mapItem.pointCategory === '07') { // 通信
          tx.push(mapItem)
        } else if (mapItem.pointCategory === '08') { // 仓库
          ck.push(mapItem)
        } else if (mapItem.pointCategory === '09') { // 营房
          yf.push(mapItem)
        } else if (mapItem.pointCategory === '10') { // 人防
          rf.push(mapItem)
        } else if (mapItem.pointCategory === '11') { // 道坪
          dp.push(mapItem)
        } else if (mapItem.pointCategory === '12') { // 坑道(洞库)
          kd.push(mapItem)
        } else if (mapItem.pointCategory === '12') { // 油库
          yk.push(mapItem)
        } else if (mapItem.pointCategory === '12') { // 血站
          xz.push(mapItem)
        } else if (mapItem.pointCategory === '12') { // 医院
          yy.push(mapItem)
        }
      })
      // 部队部署
      this.$refs.MapOl.addLayerAndGraphics('BS', bdbs, BDBS)
      // 电磁环境
      this.$refs.MapOl.addLayerAndGraphics('DCHJNM', dchj, Orange)
      // 核生化环境
      this.$refs.MapOl.addLayerAndGraphics('HHSHJNM', hshhj, HSHHJ)
      // 文化古迹
      this.$refs.MapOl.addLayerAndGraphics('WHGJNM', whgj, Orange)
      // 教堂
      this.$refs.MapOl.addLayerAndGraphics('JTNM', jt, Orange)
      // 交通目标
      this.$refs.MapOl.addLayerAndGraphics('JJYSNM', jtmb, JTMB)
      // 指挥防护工程
      this.$refs.MapOl.addLayerAndGraphics('01', zhfh, Green)
      // 陆军设施工程
      this.$refs.MapOl.addLayerAndGraphics('02', ljss, Green)
      // 舰艇基地工程
      this.$refs.MapOl.addLayerAndGraphics('03', jtjd, JTJD)
      // 码头
      this.$refs.MapOl.addLayerAndGraphics('04', mt, MT)
      // 机场
      this.$refs.MapOl.addLayerAndGraphics('05', jc, JCGC)
      // 阵地
      this.$refs.MapOl.addLayerAndGraphics('06', zd, Green)
      // 通信
      this.$refs.MapOl.addLayerAndGraphics('07', tx, TXGC)
      // 仓库
      this.$refs.MapOl.addLayerAndGraphics('08', ck, CKGC)
      // 营房
      this.$refs.MapOl.addLayerAndGraphics('09', yf, Green)
      // 人防
      this.$refs.MapOl.addLayerAndGraphics('10', rf, RFGC)
      // 道坪
      this.$refs.MapOl.addLayerAndGraphics('11', dp, DPGC)
      // 坑道(洞库)
      this.$refs.MapOl.addLayerAndGraphics('12', kd, KD)
      // 油库
      this.$refs.MapOl.addLayerAndGraphics('YK', yk, YK)
      // 血站
      this.$refs.MapOl.addLayerAndGraphics('XZ', xz, XZ)
      // 医院
      this.$refs.MapOl.addLayerAndGraphics('YY', yy, YY)
    },
    // 点击开关按钮
    switchChange(type, isOpen) {
      const bdbs = [] // 部队部署
      const dchj = [] // 电磁环境
      const hshhj = [] // 核生化环境
      const whgj = [] // 文化古迹
      const jt = [] // 教堂
      const jtmb = [] // 交通目标
      const zhfh = [] // 指挥防护工程
      const ljss = [] // 陆军设施工程
      const jtjd = [] // 舰艇基地工程
      const mt = [] // 码头
      const jc = [] // 机场
      const zd = [] // 阵地
      const tx = [] // 通信
      const ck = [] // 仓库
      const yf = [] // 营房
      const rf = [] // 人防
      const dp = [] // 道坪
      const kd = [] // 坑道(洞库)
      const yk = [] // 油库
      const xz = [] // 血站
      const yy = [] // 医院
      this.allSwitchChangeData.forEach((mapItem) => {
        if (mapItem.pointCategory === 'BS') { // 部队部署
          bdbs.push(mapItem)
        } else if (mapItem.pointCategory === 'DCHJ') { // 电磁环境
          dchj.push(mapItem)
        } else if (mapItem.pointCategory === 'HHSHJNM') { // 核生化环境
          hshhj.push(mapItem)
        } else if (mapItem.pointCategory === 'WHGJ') { // 文化古迹
          whgj.push(mapItem)
        } else if (mapItem.pointCategory === 'JT') { // 教堂
          jt.push(mapItem)
        } else if (mapItem.pointCategory === 'JJYS') { // 交通目标
          jtmb.push(mapItem)
        } else if (mapItem.pointCategory === '01') { // 指挥防护工程
          zhfh.push(mapItem)
        } else if (mapItem.pointCategory === '02') { // 陆军设施工程
          ljss.push(mapItem)
        } else if (mapItem.pointCategory === '03') { // 舰艇基地工程
          jtjd.push(mapItem)
        } else if (mapItem.pointCategory === '04') { // 码头
          mt.push(mapItem)
        } else if (mapItem.pointCategory === '05') { // 机场
          jc.push(mapItem)
        } else if (mapItem.pointCategory === '06') { // 阵地
          zd.push(mapItem)
        } else if (mapItem.pointCategory === '07') { // 通信
          tx.push(mapItem)
        } else if (mapItem.pointCategory === '08') { // 仓库
          ck.push(mapItem)
        } else if (mapItem.pointCategory === '09') { // 营房
          yf.push(mapItem)
        } else if (mapItem.pointCategory === '10') { // 人防
          rf.push(mapItem)
        } else if (mapItem.pointCategory === '11') { // 道坪
          dp.push(mapItem)
        } else if (mapItem.pointCategory === '12') { // 坑道(洞库)
          kd.push(mapItem)
        } else if (mapItem.pointCategory === '12') { // 油库
          yk.push(mapItem)
        } else if (mapItem.pointCategory === '12') { // 血站
          xz.push(mapItem)
        } else if (mapItem.pointCategory === '12') { // 医院
          yy.push(mapItem)
        }
      })

      if (isOpen) {
        if (type === 'bdbs') {
          // 部队部署
          this.$refs.MapOl.addLayerAndGraphics('BS', bdbs, BDBS)
        } else if (type === 'zbgc') {
          // 指挥防护工程
          this.$refs.MapOl.addLayerAndGraphics('01', zhfh, Green)
          // 陆军设施工程
          this.$refs.MapOl.addLayerAndGraphics('02', ljss, Green)
          // 舰艇基地工程
          this.$refs.MapOl.addLayerAndGraphics('03', jtjd, JTJD)
          // 码头
          this.$refs.MapOl.addLayerAndGraphics('04', mt, MT)
          // 机场
          this.$refs.MapOl.addLayerAndGraphics('05', jc, JCGC)
          // 阵地
          this.$refs.MapOl.addLayerAndGraphics('06', zd, Green)
          // 通信
          this.$refs.MapOl.addLayerAndGraphics('07', tx, TXGC)
          // 仓库
          this.$refs.MapOl.addLayerAndGraphics('08', ck, CKGC)
          // 营房
          this.$refs.MapOl.addLayerAndGraphics('09', yf, Green)
          // 人防
          this.$refs.MapOl.addLayerAndGraphics('10', rf, RFGC)
          // 道坪
          this.$refs.MapOl.addLayerAndGraphics('11', dp, DPGC)
          // 坑道(洞库)
          this.$refs.MapOl.addLayerAndGraphics('12', kd, KD)
        } else if (type === 'hqbz') {
          // 油库
          this.$refs.MapOl.addLayerAndGraphics('YK', yk, YK)
          // 血站
          this.$refs.MapOl.addLayerAndGraphics('XZ', xz, XZ)
          // 医院
          this.$refs.MapOl.addLayerAndGraphics('YY', yy, YY)
        } else if (type === 'zchj') {
          // 电磁环境
          this.$refs.MapOl.addLayerAndGraphics('DCHJNM', dchj, Orange)
          // 核生化环境
          this.$refs.MapOl.addLayerAndGraphics('HHSHJNM', hshhj, HSHHJ)
          // 文化古迹
          this.$refs.MapOl.addLayerAndGraphics('WHGJNM', whgj, Orange)
          // 教堂
          this.$refs.MapOl.addLayerAndGraphics('JTNM', jt, Orange)
          // 交通目标
          this.$refs.MapOl.addLayerAndGraphics('JJYSNM', jtmb, JTMB)
        }
      } else {
        if (type === 'bdbs') {
          this.$refs.MapOl.removeMarkerPointSwitch('BS')
        } else if (type === 'zbgc') {
          this.$refs.MapOl.removeMarkerPointSwitch('01')
          this.$refs.MapOl.removeMarkerPointSwitch('02')
          this.$refs.MapOl.removeMarkerPointSwitch('03')
          this.$refs.MapOl.removeMarkerPointSwitch('04')
          this.$refs.MapOl.removeMarkerPointSwitch('05')
          this.$refs.MapOl.removeMarkerPointSwitch('06')
          this.$refs.MapOl.removeMarkerPointSwitch('07')
          this.$refs.MapOl.removeMarkerPointSwitch('08')
          this.$refs.MapOl.removeMarkerPointSwitch('09')
          this.$refs.MapOl.removeMarkerPointSwitch('10')
          this.$refs.MapOl.removeMarkerPointSwitch('11')
          this.$refs.MapOl.removeMarkerPointSwitch('12')
        } else if (type === 'hqbz') {
          this.$refs.MapOl.removeMarkerPointSwitch('YK')
          this.$refs.MapOl.removeMarkerPointSwitch('XZ')
          this.$refs.MapOl.removeMarkerPointSwitch('YY')
        } else if (type === 'zchj') {
          this.$refs.MapOl.removeMarkerPointSwitch('DCHJNM')
          this.$refs.MapOl.removeMarkerPointSwitch('HHSHJNM')
          this.$refs.MapOl.removeMarkerPointSwitch('WHGJNM')
          this.$refs.MapOl.removeMarkerPointSwitch('JTNM')
          this.$refs.MapOl.removeMarkerPointSwitch('JJYSNM')
        }
      }
    },

    del(category, subCategory, event) {
      // 是否框选
      if (this.rangeDataType.areaPointArr) {
        this.istreePointOrRegionDataOrRangeDataType(subCategory, this.allData)
      } else if (this.treePoint.length > 0) {
        // 点击树节点
        this.istreePointOrRegionDataOrRangeDataType(subCategory, this.treePoint)
      } else if (this.searchRegionData.length > 0) {
        // 选择地区
        this.istreePointOrRegionDataOrRangeDataType(subCategory, this.searchRegionData)
      }
    },
    // 是否点击树节点
    istreePointOrRegionDataOrRangeDataType(subCategory, data) {
      if (!subCategory.isShow) {
        this.isSubCategoryData.splice(this.isSubCategoryData.indexOf(subCategory), 1)
        const a = []
        for (const item in data) {
          if (data[item].pointCategory === subCategory.key) {
            a.push(data[item])
          }
        }
        this.$refs.MapOl.addMakerToLayer(subCategory.key, a, subCategory.src)
        subCategory.isShow = true
      } else {
        if (!this.isSubCategoryData.find((e) => e === subCategory)) {
          this.isSubCategoryData.push(subCategory)
        }
        this.$refs.MapOl.removeMarkerPointByLayerIdAndMarkerType(subCategory.key, subCategory.key)
        subCategory.isShow = false
      }
    },
    // 清除业务方面输入框的值
    clearBusinessData() {
      this.$refs.tree.setCheckedKeys([])
      this.filterText = ''
      this.value = {}
      this.selectedIds = []
      this.getUnitTree()
    }
  }
}
</script>

<style lang="scss" scoped>
.xuanzhong{
  color: #b4b4b4;
}
>>> .el-button--primary{
  background-color: #1f7cd7;
}

/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 17px #ffffff;
  background-color: #ccc;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  background-color: #fff;
  background-image: -webkit-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.74) 0%,
    rgba(255, 255, 255, 0.74) 25%,
    transparent 100%,
    rgba(255, 255, 255, 0.74) 75%,
    transparent
  );
}
>>> .el-dialog__body {
  height: 695px;
  overflow: auto;
  overflow-x: hidden;
}

* {
  margin: 0;
  padding: 0;
}
#map {
  padding: 0px;
  position: relative;
  display: flex;
  .left {
    position: absolute;
    z-index: 1;
    top: 80px;
    left: 46px;
    .leftTop {
      display: flex;
      margin-bottom: 12px;
      position: relative;
      .leftTopSelect {
        width: 100px;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 1;
        >>> .el-input__inner{
          height:34px;
        }
      }
      .leftTopSearch {
        padding-left: 87px;
        width: 337px;
        padding-right: 40px;
        >>> .el-input--small .el-input__inner{
          height:34px;
        }

      }
      .leftTopBtn {
        height: 32px;
        width: 46px;
        position: absolute;
        right: 0px;
        z-index: 1;
      }
    }
    .leftCenter {
      padding: 7px 10px;
      // overflow: scroll;
      width: 291px;
      height: calc(100vh - 431px);
      background: rgba(255, 255, 255,  0.74);
      .filter-tree {
        background-color: rgba(255, 255, 255, 0);
        overflow: auto;
        height: calc(100vh - 470px);
        width: 550px;
      }
    }
    .leftBtm {
      width: 1639px;
      height: 162px;
      background-color: rgba(255, 255, 255, 0.74);
      position: absolute;
      z-index: 1;
      bottom: -219px;
      .leftBtmCon{
        display: flex;
        border-bottom: 1px solid #c9c2c2a8;
        .leftBtmBox {
          background: #d5d0d04d;
          height: 40px;
          line-height: 40px;
          width: 108px;
          text-align: center;
        }
        .leftCon{
          font-size: 14px;
          width: 127px;
          height: 40px;
          line-height: 40px;
          :hover {
            cursor: pointer;
          }
        }
      }

    }
  }
  .right {
    padding: 0 10px;
    position: absolute;
    z-index: 1;
    top: 80px;
    right: 46px;
    width: 333px;
    display: flex;
    height: 40px;
    background: rgba(255, 255, 255, 0.74);
    button {
      background: rgba(255, 255, 255, 0.07);
      border: none;
      img {
        width: 18px;
        height: 18px;
      }
    }
    .ipt {
      margin-left: 10px;
      width: 125px;
      margin-top: 4px;
      .el-input__inner {
        background: #eee !important;
      }
    }
    .ipts {
      width: 125px;
      margin-top: 4px;
      .el-input__inner {
        background: #eee !important;
      }
    }
    p {
      width: 50px;
      margin: 10px;
      font-size: 15px;
    }
  }
}
.box-show {
  padding: 0px 20px;
  background: #fff;
}
.qiefen-dialog-class {
  >>> .el-dialog {
    height: 80%;
    // overflow-y: scroll;
  }
  >>> .el-dialog__body {
    overflow-y: scroll !important;
    height: calc(100% - 90px) !important;
    padding: 0px 20px !important;
  }
  >>> .el-divider--horizontal {
    margin: 0 !important;
    //margin-bottom: 15px !important;
    margin-top:15px !important;
  }
  .bottom {
    p {
      width: 24%;
      line-height: 45px;
      display: inline-block;
    }

  }
  .zzlldetail{
    .nmZZLL{
      :hover{
        width:100px !important;
        height:20px !important;
        background:BDBS !important;
      }
    }

  }

  .bottom1 {
    p:nth-child(n) {
      width: 300px;
      line-height: 44px;
    }
  }
  >>> .el-dialog__footer {
    height: 63px;
  }
}
</style>
