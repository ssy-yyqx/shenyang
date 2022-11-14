<template>
  <Container>
    <div class="total-section">
      <div class="total-header">
        <!-- <div class="total-header-tab">
          <el-popover
            popper-class="popover"
            placement="right"
            width="540"
            trigger="click"
            @hide="hideTab(0)"
            @show="showTab(0)"
          >
            <div>
              <el-form :inline="true" :model="formCity" class="formCity-inline">
                <el-form-item>
                  <el-input v-model="formCity.city" placeholder="请输入城市">
                    <i slot="prefix" class="el-input__icon el-icon-search" />
                  </el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
              </el-form>
              <el-button
                style="position: absolute; left: 186px; z-index: 2"
                @click="closeCity"
                >清除</el-button
              >
              <el-tabs
                v-model="activeName"
                type="card"
                @tab-click="handleClick"
              >
                <el-tab-pane label="按省份" name="first">
                  <div v-if="province.length > 0" class="tab-province-cut">
                    <el-form label-width="80px" class="tab-province-cut-form">
                      <div
                        v-for="(item, index) in province"
                        :key="index"
                        class="tab-province-div"
                      >
                        <el-form-item :label="item.label">
                          <span
                            v-for="(itemCity, indexCity) in item.childList"
                            :key="indexCity"
                            :class="
                              cityField == itemCity.field
                                ? 'isClass province-ssqname'
                                : 'province-ssqname'
                            "
                            @click="citySearch(itemCity)"
                          >
                            {{ itemCity.label }}
                          </span>
                        </el-form-item>
                      </div>
                    </el-form>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="按城市" name="second">
                  <div class="tab-province-cut">
                    <el-form label-width="80px" class="tab-province-cut-form">
                      <div
                        v-for="(item, index) in districtData"
                        :key="index"
                        class="tab-province-div"
                      >
                        <div v-if="item.childList && item.childList.length > 0">
                          <el-form-item :label="item.label">
                            <span
                              v-for="(itemCity, indexCity) in item.childList"
                              :key="indexCity"
                              :class="
                                cityField == itemCity.field
                                  ? 'isClass province-ssqname'
                                  : 'province-ssqname'
                              "
                              @click="citySearch(itemCity)"
                            >
                              {{ itemCity.label }}
                            </span>
                          </el-form-item>
                        </div>
                      </div>
                    </el-form>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>

            <div
              slot="reference"
              :style="choseValue == '0' ? bgc : normalStyle"
              :class="tabClass.territory"
              @click="
                isShowTabFun('0', {
                  TOPIC_ID: 'regionaltopic-id',
                  TOPIC_NAME: '地域主题',
                })
              "
            >
              地域主题
            </div>
          </el-popover>
          <el-popover
            placement="right"
            width="460"
            trigger="click"
            @hide="hideTab(1)"
            @show="showTab(1)"
          >
            <el-form label-width="140px" class="DangerChem-margin">
              <el-form-item label="电磁环境">
                <span
                  :class="
                    propsDangerous == 'dangerousTopic_DCHJ'
                      ? 'province-ssqname isClass'
                      : 'province-ssqname'
                  "
                  @click="dangerousClick('dangerousTopic_DCHJ')"
                  >基本信息</span
                >
              </el-form-item>
              <el-form-item label="核化生环境">
                <span
                  :class="
                    propsDangerous == 'dangerousTopic_HHSHJ'
                      ? 'province-ssqname isClass'
                      : 'province-ssqname'
                  "
                  @click="dangerousClick('dangerousTopic_HHSHJ')"
                  >基本信息</span
                >
              </el-form-item>
            </el-form>

            <div
              slot="reference"
              :class="tabClass.dangerous"
              :style="choseValue == '1' ? bgc : normalStyle"
              @click="
                isShowTabFun('1', {
                  TOPIC_ID: 'dangeroustopic-id',
                  TOPIC_NAME: '危化环境主题',
                })
              "
            >
              危化环境主题
            </div>
          </el-popover>
          <el-popover
            placement="right"
            width="460"
            trigger="click"
            @hide="hideTab(2)"
            @show="showTab(2)"
          >
            <el-form label-width="140px" class="DangerChem-margin">
              <el-form-item label="战时新闻媒体信息">
                <span
                  :class="
                    propsDangerous == 'emergencyTopic_ZSXWMTD'
                      ? 'province-ssqname isClass'
                      : 'province-ssqname'
                  "
                  @click="dangerousClick('emergencyTopic_ZSXWMTD')"
                >
                  基本信息
                </span>
              </el-form-item>
              <el-form-item label="人民武装">
                <span
                  :class="
                    propsDangerous == 'emergencyTopic_ZHQK'
                      ? 'province-ssqname isClass'
                      : 'province-ssqname'
                  "
                  @click="dangerousClick('emergencyTopic_ZHQK')"
                >
                  综合信息
                </span>

                <span
                  :class="
                    propsDangerous == 'emergencyTopic_JGMBQK'
                      ? 'province-ssqname isClass'
                      : 'province-ssqname'
                  "
                  @click="dangerousClick('emergencyTopic_JGMBQK')"
                >
                  基干民兵情况
                </span>

                <span
                  :class="
                    propsDangerous == 'emergencyTopic_XYGWYBQK'
                      ? 'province-ssqname isClass'
                      : 'province-ssqname'
                  "
                  @click="dangerousClick('emergencyTopic_XYGWYBQK')"
                >
                  现役部队专业技术岗位预编预备役人员
                </span>
              </el-form-item>
              <el-form-item label="后勤动员">
                <span
                  :class="
                    propsDangerous == 'emergencyTopic_DYJG'
                      ? 'province-ssqname isClass'
                      : 'province-ssqname'
                  "
                  @click="dangerousClick('emergencyTopic_DYJG')"
                >
                  动员机构
                </span>
                <span
                  :class="
                    propsDangerous == 'emergencyTopic_HSJSLL'
                      ? 'province-ssqname isClass'
                      : 'province-ssqname'
                  "
                  @click="dangerousClick('emergencyTopic_HSJSLL')"
                >
                  海上救生力量
                </span>
              </el-form-item>
            </el-form>
            <div
              slot="reference"
              :class="tabClass.meet"
              :style="choseValue == '2' ? bgc : normalStyle"
              @click="
                isShowTabFun('2', {
                  TOPIC_ID: 'emergencytopic-id',
                  TOPIC_NAME: '应急机动主题',
                })
              "
            >
              应急机动主题
            </div>
          </el-popover>
        </div> -->

        <div class="total-header-tab">
          <el-tabs>
            <el-tab-pane>
              <div
                slot="label"
                @click="
                  isShowTabFun('0', {
                    TOPIC_ID: 'regionaltopic-id',
                    TOPIC_NAME: '地域主题',
                  })
                "
              >
                地域主题
              </div>
              <div>
                <el-form
                  :inline="true"
                  :model="formCity"
                  class="formCity-inline"
                >
                  <el-form-item>
                    <el-input
                      v-model="formCity.city"
                      placeholder="请输入城市"
                      @input="onSubmit"
                    >
                      <i slot="prefix" class="el-input__icon el-icon-search" />
                    </el-input>
                  </el-form-item>

                  <!-- <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                  </el-form-item> -->
                </el-form>
                <el-button
                  style="position: absolute; left: 186px; z-index: 2"
                  @click="closeCity"
                >清除</el-button>
                <el-tabs
                  v-model="activeName"
                  type="card"
                  @tab-click="handleClick"
                >
                  <el-tab-pane label="按省份" name="first">
                    <div v-if="province.length > 0" class="tab-province-cut">
                      <el-form label-width="80px" class="tab-province-cut-form">
                        <div
                          v-for="(item, index) in province"
                          :key="index"
                          class="tab-province-div"
                        >
                          <el-form-item>
                            <div slot="label" style="display: inline-block">
                              <span
                                :class="
                                  cityField == item.field
                                    ? 'isClass province-ssqname'
                                    : 'province-ssqname'
                                "
                                style="display: inline-block"
                                @click="citySearch(item)"
                              >{{ item.label }}</span>
                            </div>

                            <span
                              v-for="(itemCity, indexCity) in item.childList"
                              :key="indexCity"
                              :class="
                                cityField == itemCity.field
                                  ? 'isClass province-ssqname'
                                  : 'province-ssqname'
                              "
                              @click="citySearch(itemCity)"
                            >
                              {{ itemCity.label }}
                            </span>
                          </el-form-item>
                        </div>
                      </el-form>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="按城市" name="second">
                    <div class="tab-province-cut">
                      <el-form label-width="80px" class="tab-province-cut-form">
                        <div
                          v-for="(item, index) in districtData"
                          :key="index"
                          class="tab-province-div"
                        >
                          <div
                            v-if="item.childList && item.childList.length > 0"
                          >
                            <el-form-item>
                              <div slot="label" style="display: inline-block">
                                <span
                                  :class="
                                    cityField == item.field
                                      ? 'isClass province-ssqname'
                                      : 'province-ssqname'
                                  "
                                  style="display: inline-block"
                                  @click="citySearch(item)"
                                >{{ item.label }}</span>
                              </div>

                              <span
                                v-for="(itemCity, indexCity) in item.childList"
                                :key="indexCity"
                                :class="
                                  cityField == itemCity.field
                                    ? 'isClass province-ssqname'
                                    : 'province-ssqname'
                                "
                                @click="citySearch(itemCity)"
                              >
                                {{ itemCity.label }}
                              </span>
                            </el-form-item>
                          </div>
                        </div>
                      </el-form>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="搜索" name="search">
                    <div style="overflow-y: scroll; height: 180px">
                      <div
                        v-for="(item, index) in citySearchData"
                        :key="index"
                        style="width: 100%; line-height: 30px; height: 30px"
                      >
                        <span
                          style="font-size: 14px; clear: both"
                          :class="
                            cityField == item.value[item.value.length - 1]
                              ? 'isClass province-ssqname'
                              : 'province-ssqname'
                          "
                          @click="
                            citySearchDataClick(
                              item.value[item.value.length - 1]
                            )
                          "
                        >
                          {{ item.label.replace("/", " ").replace("/", " ") }}
                        </span>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
            <el-tab-pane>
              <div
                slot="label"
                @click="
                  isShowTabFun('1', {
                    TOPIC_ID: 'dangeroustopic-id',
                    TOPIC_NAME: '危化环境主题',
                  })
                "
              >
                危化环境主题
              </div>
              <el-tabs
                v-model="dataWHHJ"
                tab-position="left"
                style="height: 200px"
              >
                <el-tab-pane name="电磁环境">
                  <div
                    slot="label"
                    @click="dangerousClick('dangerousTopic_DCHJ')"
                  >
                    电磁环境
                  </div>
                  <ul>
                    <li
                      :class="
                        propsDangerous == 'dangerousTopic_DCHJ'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('dangerousTopic_DCHJ')"
                    >
                      基本信息
                    </li>
                  </ul>
                </el-tab-pane>
                <el-tab-pane name="核化生环境">
                  <div
                    slot="label"
                    @click="dangerousClick('dangerousTopic_HHSHJ')"
                  >
                    核化生环境
                  </div>
                  <ul>
                    <li
                      :class="
                        propsDangerous == 'dangerousTopic_HHSHJ'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('dangerousTopic_HHSHJ')"
                    >
                      基本信息
                    </li>
                  </ul>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane>
              <div
                slot="label"
                @click="
                  isShowTabFun('2', {
                    TOPIC_ID: 'emergencytopic-id',
                    TOPIC_NAME: '应急机动主题',
                  })
                "
              >
                应急机动主题
              </div>
              <el-tabs
                v-model="dataWHHJ"
                tab-position="left"
                style="height: 200px"
              >
                <el-tab-pane name="战时新闻媒体信息">
                  <div
                    slot="label"
                    @click="dangerousClick('emergencyTopic_ZSXWMTD')"
                  >
                    战时新闻媒体信息
                  </div>
                  <ul>
                    <li
                      :class="
                        propsDangerous == 'emergencyTopic_ZSXWMTD'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('emergencyTopic_ZSXWMTD')"
                    >
                      基本信息
                    </li>
                  </ul>
                </el-tab-pane>
                <el-tab-pane name="人民武装">
                  <div
                    slot="label"
                    @click="dangerousClick('emergencyTopic_ZHQK')"
                  >
                    人民武装
                  </div>
                  <ul>
                    <li
                      :class="
                        propsDangerous == 'emergencyTopic_ZHQK'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('emergencyTopic_ZHQK')"
                    >
                      综合信息
                    </li>
                    <li
                      :class="
                        propsDangerous == 'emergencyTopic_JGMBQK'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('emergencyTopic_JGMBQK')"
                    >
                      基干民兵情况
                    </li>
                    <li
                      :class="
                        propsDangerous == 'emergencyTopic_XYGWYBQK'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('emergencyTopic_XYGWYBQK')"
                    >
                      现役部队专业技术岗位预编预备役人员
                    </li>
                  </ul>
                </el-tab-pane>
                <el-tab-pane name="后勤动员">
                  <div
                    slot="label"
                    @click="dangerousClick('emergencyTopic_DYJG')"
                  >
                    后勤动员
                  </div>
                  <ul>
                    <li
                      :class="
                        propsDangerous == 'emergencyTopic_DYJG'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('emergencyTopic_DYJG')"
                    >
                      动员机构
                    </li>
                    <li
                      :class="
                        propsDangerous == 'emergencyTopic_HSJSLL'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('emergencyTopic_HSJSLL')"
                    >
                      海上救生力量
                    </li>
                  </ul>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane>
              <div
                slot="label"
                @click="
                  isShowTabFun('4', {
                    TOPIC_ID: 'regulations-id',
                    TOPIC_NAME: '标准法规主题',
                  })
                "
              >
                标准法规主题
              </div>
              <el-tabs
                v-model="dataWHHJ"
                tab-position="left"
                style="height: 200px"
              >
                <el-tab-pane name="作战法规">
                  <div
                    slot="label"
                    @click="dangerousClick('regulations_GJF')"
                  >
                    作战法规
                  </div>
                  <ul>
                    <li
                      :class="
                        propsDangerous == 'regulations_GJF'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('regulations_GJF')"
                    >
                      国际法
                    </li>
                    <li
                      :class="
                        propsDangerous == 'regulations_GNF'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('regulations_GNF')"
                    >
                      国内法
                    </li>
                    <li
                      :class="
                        propsDangerous == 'regulations_TWDQFL'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('regulations_TWDQFL')"
                    >
                      台湾地区法律
                    </li>
                    <li
                      :class="
                        propsDangerous == 'regulations_WGSTFL'
                          ? 'province-ssqname isClass'
                          : 'province-ssqname'
                      "
                      @click="dangerousClick('regulations_WGSTFL')"
                    >
                      外国涉台法律
                    </li>

                  </ul>
                </el-tab-pane>

              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="total-header-text">
          <div class="total-header-text-title">热点云及排名</div>

          <div class="total-header-text-wordcloud">
            <div class="wordcloud-text">
              <div ref="wordcloud" class="wordcloud" />
            </div>

            <div class="total-header-list">
              <classTable
                :is-filtration="isFiltration"
                :table-data="HotBot"
                :header-class="hotclass"
                :topic-table="hotTableTopic"
                :show-row-click="false"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="theme-table">
        <!-- 地域主题 -->
        <regionalTheme v-if="isShowTab == '0'" :city-field="cityField" />
        <dangerous
          v-if="isShowTab == '1'"
          :props-dangerous="propsDangerous"
          :citys-data="citysData"
        />
        <emergency
          v-if="isShowTab == '2'"
          :props-dangerous="propsDangerous"
          :citys-data="citysData"
        />
        <cloudPicture
          v-if="isShowTab == '3'"
          :props-dangerous="propsDangerous"
          :citys-data="citysData"
        />
        <dangerous
          v-if="isShowTab == '4'"
          :props-dangerous="propsDangerous"
          :citys-data="citysData"
          :is-cascader="false"
        />
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container'
import classTable from './classTable'
import regionalTheme from './regionalTheme'
import dangerous from './dangerous'
import emergency from './emergency'
import cloudPicture from './cloudPicture'

import * as APIclass from '@/api/classification'
import * as API from '@/api/index'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
export default {
  name: 'Classification',
  components: {
    Container,
    classTable,
    regionalTheme,
    dangerous,
    emergency,
    cloudPicture
  },
  data() {
    return {
      isFiltration: false,
      bgc: 'background:rgba(31 124 215)',
      normalStyle: '',
      choseValue: '',
      alinshi: [],
      activeName: 'first',
      cityField: '',
      citysData: [],
      province: [],
      districtData: [],
      isShowTab: '0',
      isHotPitch: '',
      dataWHHJ: '',
      dataYJJD: '',
      formCity: {
        city: ''
      },
      cloudPictureData: [],
      hotclass: true,
      propsDangerous: '',
      tabClass: {
        territory: 'total-button',
        dangerous: 'total-button',
        meet: 'total-button'
      },
      dataColors: [],
      colors: [
        'color: #c6b6ff; font-size: 26px; width: 60px',
        'color: #555555; font-size: 30px',
        'color: #ffff00; font-size: 26px; width: 60px',
        'color: blue; font-size: 30px',
        'color: #70b603; font-size: 40px',
        'color: #02a7f0; font-size: 15px'
      ],
      pager: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10, 15, 20, 30]
      },
      HotBot: [],
      hotTableTopic: [
        {
          key: 'XH',
          name: '序号'
        },
        {
          key: 'TOPICNAME',
          name: '热点词'
        },
        {
          key: 'ACCESSTOTAL',
          name: '数量'
        }
      ],
      citySearchData: []
    }
  },
  computed: {},

  watch: {},
  mounted() {
    this.getAreaTree()
    this.gettopicMake()
    this.getSelectTopicSort()
    this.$nextTick(() => {
      document.getElementById('tab-search').style.display = 'none'
    })
  },

  methods: {
    // 清除tab值
    hideTab(index) {
      if (index === '0') {
        this.tabClass.territory = 'total-button '
        this.isHotPitch = ''
        this.formCity.city = ''
      }
      if (index === '1') {
        this.tabClass.dangerous = 'total-button '
      }
      if (index === '2') {
        this.tabClass.meet = 'total-button '
      }
    },
    showTab(index) {
      if (index === '0') {
        this.tabClass.territory = 'total-button total-button-show'
      }
      if (index === '1') {
        this.tabClass.dangerous = 'total-button total-button-show'
      }
      if (index === '2') {
        this.tabClass.meet = 'total-button total-button-show'
      }
    },
    // 取随机数
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10)
        // break
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
        // break
        default:
          return 0
        // break
      }
    },
    // 获取省市区数据
    getAreaTree() {
      API.getAreaTree().then((res) => {
        this.cantonal(res.data)
      })
    },
    // 处理市数据
    cantonal(data) {
      this.citysData = data
      this.province = data
      this.districtData = []
      this.citysData.forEach((element) => {
        this.districtData.push(...element.childList)
      })
    },
    // 切换省市
    handleClick(tab, event) {
      if (this.cityField) {
        this.cityField = ''
      }
      this.cantonal(this.citysData)
      sessionStorage.removeItem('activeName')
    },
    regionChange(data) {},
    // 切换城市
    cutProvince(item) {
      this.districtData = []
      this.districtData.push(item)
      this.activeName = 'second'
    },
    // 搜索城市

    findCitys(arr, id) {
      if (arr == null) return null

      for (const obj of arr) {
        if (obj.label.indexOf(id) !== -1) {
          console.log(obj)
          this.alinshi.push(obj)
        }

        this.findCitys(obj.childList, id)
      }
    },
    // 获取城市id
    findCitysId(Arr, ID) {
      var _result = null
      for (let i = 0; i < Arr.length; i++) {
        if (Arr[i].label.indexOf(ID) !== -1) return Arr[i]
        if (Arr[i].childList) _result = this.findCitysId(Arr[i].childList, ID)
        if (_result != null) return _result
      }
      return _result
    },

    // 搜索城市
    onSubmit() {
      // console.log(this.formCity.city);
      // this.alinshi = [];
      // this.isHotPitch = "";
      // this.findCitys(this.citysData, this.formCity.city);
      // if (this.activeName === "first") {
      //   this.province = [];

      //   this.province = this.alinshi;
      // }
      // if (this.activeName === "second") {
      //   this.districtData = [];
      //   this.districtData = this.alinshi;
      // }
      //if (this.formCity.city.length < 2) {
      //  this.citySearchData = []
      //  this.$message({
      //    message: '输入搜索字符小于两个字符',
      //    type: 'warning'
      //  })
      //  return false
      //}
      const arr = {
        dictCodes: [this.formCity.city],
        tableName: 'ZZBZ_S_TY_DM'
      }
      this.standardDictSearch(arr)
    },
    // 下拉搜索接口数据
    standardDictSearch(arr) {
      API.standardDictSearch(arr).then((res) => {
        console.log(res.data)
        this.citySearchData = res.data
        sessionStorage.setItem('activeName', this.activeName)
        this.activeName = 'search'
      })
    },
    // 清除选中
    closeCity() {
      this.isHotPitch = ''
      this.cityField = ''
      this.formCity = {}
      this.citySearchData = []
      if (sessionStorage.getItem('activeName')) {
        this.activeName = sessionStorage.getItem('activeName')
      } else {
        this.activeName = 'first'
      }
    },
    // 获取城市
    citySearch(city) {
      this.isHotPitch = ''
      this.cityField = city.field
    },
    citySearchDataClick(id) {
      this.cityField = id
    },
    // 热门城市
    hotCitySearch(val) {
      this.isHotPitch = val
      const cityArr = this.findCitysId(this.citysData, val)

      this.cityField = cityArr.field
    },
    // 统计
    isShowTabFun(val, item) {
      if (val == 1) {
        this.dataWHHJ = '电磁环境'
      }
      if (val == 2) {
        this.dataWHHJ = '战时新闻媒体信息'
      }
      if (val == 4) {
        this.dataWHHJ = '作战法规'
      }

      this.choseValue = val
      this.isShowTab = val
      this.getAreaTree()
      this.propsDangerous = ''
      this.getTopicSort(item)
      if (val === '1') {
        this.propsDangerous = this.propsDangerous || 'dangerousTopic_DCHJ'
      }
      if (val === '2') {
        this.propsDangerous = this.propsDangerous || 'emergencyTopic_ZSXWMTD'
      }
      if (val === '3') {
        this.propsDangerous = item.TOPIC_ID
      }
      if (val === '4') {
        this.propsDangerous = this.propsDangerous || 'regulations_GJF'
      }
    },
    // 统计请求
    getTopicSort(data) {
      APIclass.getTopicSort(data).then((res) => {})
    },
    // 排名数据
    getSelectTopicSort() {
      APIclass.getSelectTopicSort().then((res) => {
        this.HotBot = res.data.splice(0, 6)
        // 设置排名序号
        this.HotBot.forEach((e, index) => {
          e.XH = index + 1
        })
      })
    },
    // 危化环境主题
    dangerousClick(val) {
      this.propsDangerous = val
    },
    // 获取云图文字
    gettopicMake() {
      APIclass.gettopicMake().then((res) => {
        for (const item in res.data) {
          this.cloudPictureData.push({
            name: res.data[item].TOPIC_NAME,
            value: item,
            TOPIC_ID: res.data[item].TOPIC_ID
          })
        }

        this.setwordCloudMap()
      })
    },
    // 云图
    setwordCloudMap() {
      var myChart = echarts.init(this.$refs.wordcloud)
      const that = this

      myChart.setOption({
        series: [
          {
            type: 'wordCloud',
            // 用来调整词之间的距离
            gridSize: 26,
            // 用来调整字的大小范围
            sizeRange: [16, 40],
            // 用来调整词的旋转方向，，[0,0]--代表着没有角度
            // rotationRange: [-45, 0, 45, 90],
            // rotationRange: [ 0,90],
            rotationRange: [0, 0],
            // 设置形状
            shape: 'circle',
            textStyle: {
              color: function() {
                return (
                  'rgba(' +
                  [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',') +
                  ')'
                )
              }
            },
            emphasis: {
              textStyle: {
                shadowBlur: 10,
                shadowColor: '#333',
                color: '#409EFF'
              }
            },
            // 位置相关设置
            left: 'center',
            top: 'center',
            right: null,
            bottom: null,
            width: '100%',
            height: '100%',
            // 数据
            data: this.cloudPictureData
          }
        ]
      })
      myChart.on('click', (params) => {
        that.isShowTabFun('3', params.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.total-section {
  >>> .el-tabs__item.is-active {
    color: #1f7cd7 !important;
  }
}
>>> .el-table >>> .cell {
  width: 100px;
}
.total-section >>> .el-tabs__item:hover {
  color: #1f7cd7 !important;
}
.DangerChem-margin {
  span {
    margin-right: 5px;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form-item__content {
    word-break: keep-all !important;
  }
}

.hot-City {
  margin-bottom: 10px;
  span {
    font-size: 16px;
    cursor: pointer;
    padding: 2px;
  }
}
.close-btn {
  float: right;
}

.tab-province-cut {
  height: 180px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  .tab-province-div {
    span {
      font-size: 12px;
      margin-right: 5px;
      padding: 2px;
    }
  }
}
.isClass {
  background: #1f7cd7;
  color: #fff;
}
.province-ssqname {
  cursor: pointer;
  padding: 2px;
  float: left;
}
.formCity-inline {
  position: absolute;
  left: 252px;
  z-index: 3;
}
.el-form--inline >>> .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.total-section {
  height: calc(100% - 0px);
  width: 100%;

  overflow-y: scroll;
  .theme-table {
    margin-right: 10px;
  }
  .city-table {
    margin-top: 20px;
  }
  .total-header {
    display: flex;
    height: 340px;
    .total-header-tab {
      width: 30%;
      padding: 20px;
      background: #fff;
    }

    .total-header-text {
      width: 70%;
      height: 100%;
      background: #fff;
      margin-left: 10px;
      margin-right: 10px;
      .total-header-text-title {
        padding: 20px 10px;
        border-bottom: 1px solid #e0e0ee;
        font-size: 14px;
        color: #1d1b1b;
      }
      .total-header-text-wordcloud {
        display: flex;
        width: 100%;
        height: 280px;

        .wordcloud-text {
          width: 75%;
        }

        .total-header-list {
          width: 25%;
          height: 280px;
          margin-right: 20px;
        }
      }
    }
  }

  .total-button {
    // width: 240px;
    height: 112px;
    text-indent: 20px;
    line-height: 112px;
    background: #a19f9f;
    color: #fff;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
  }
  .total-button-show {
    background: #fff;
    color: #a19f9f;
  }
}
.v-region {
  width: 100%;
}
.pager-section {
  margin-top: 20px;
  text-align: right;
  margin-right: 20px;
}
.wordcloud {
  width: 100%;
  height: 100%;
}
ul {
  padding: 0;
  margin: 0;
  li {
    list-style: none;
    display: inline-block;
    width: 100%;
    font-size: 14px;
    margin: 5px 0;
  }
}
</style>
