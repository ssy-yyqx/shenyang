<template>
  <Container own-class="con-one">

    <div v-if="isQUNPING" class="qiehuanBtn">
      <el-radio-group v-model="activeNameqh" @change="radioButton">
        <el-radio-button label="部队" />
        <el-radio-button label="装备" />

      </el-radio-group>
    </div>

    <!--懒加载的部队树-->
    <div
      v-show="isQUNPING && activeNameqh=='部队'"
      v-loading="loading2"
      class="tree"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      style="width: 20%;
        height: calc(100vh - 120px);background:white;padding: 10px;"
    >
      <el-tree
        ref="myTree"
        style="width:100%; height: calc(100vh - 175px);margin-top: 45px;overflow:auto;"
        lazy
        :load="loadBdTreeNode"
        :highlight-current="true"
        :accordion="true"
        :default-checked-keys="bdCheckedList"
        :props="defaultProps"
        node-key="id"
        @node-click="nodeClick"
      />
    </div>
    <div v-show="isQUNPING && activeNameqh=='装备'" class="my-tree">

      <el-tree
        ref="treexinde"
        style="width:100%; height: calc(100vh - 189px);overflow:auto;"
        lazy
        :load="loadZbTreeNode"
        :highlight-current="true"
        :props="defaultPropszb"
        :accordion="true"
        :default-checked-keys="zbCheckedList"
        :current-node-key="currents"
        node-key="code"
        @node-click="onHandleClickZbTreeNode"
      />
    </div>

    <div v-if="activeNameqh=='装备'" class="rightContent" :style="isQUNPING?'width:80%':'width:100%'">
      <el-button style="margin:0px 0px 10px 20px" @click="quanping"> <span>{{ isQUNPING?'全屏':'取消全屏' }}</span></el-button>
      <zhuangbei :zhuangbei-data="zhuangbeiData" :equipment-code="equipmentCode" />
    </div>
    <div v-if="activeNameqh=='部队'" class="rightContent" :style="isQUNPING?'width:80%':'width:100%'">
      <div style="display:flex">
        <!-- 顶部表列表切换   @tab-click="getTableList"-->
        <el-tabs
          v-model="secondLevel"
          type="card"
          closable
          style="width:96%"
          @tab-remove="removeTab"
          @tab-click="jump"
        >
          <template v-for="(item) in subTabsList">
            <el-tab-pane
              v-if="item.isShow"
              :key="item.label"
              :label="item.label"
              :name="item.label"
              :value="item.value"
            />
          </template>
        </el-tabs>
        <el-dropdown :hide-on-click="false" trigger="click" style="width: 4%;text-align: center;height: 43px;line-height: 43px;">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down" style="color:#555;font-size: 14px;" />
          </span>
          <el-dropdown-menu slot="dropdown" style="position: absolute;top: 141px;left: 1732px;">
            <el-dropdown-item>
              <!-- 点击多选框，使用isShow来控制多选框的取消与勾选 -->
              <el-checkbox v-for="(item) in subTabsList" :key="item.vlaue" v-model="item.isShow" :checked="item.isShow" style="display:block">{{ item.label }}</el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <el-button
        class="elbutton"
        style="margin-left:20px;margin-bottom:5px;position: relative;"
        @click="download"
      >
        <img
          style="width:20px;height:20px;position:absolute;top:20%;"
          :src="require(`@/icons/newImages/daochu.png`)"
          class="img-class"
          alt=""
        >
        <span style="margin-left:32px">导出</span>

      </el-button> -->
      <div class="button-section">
        <el-button @click="downloadWord">导出word</el-button>
        <el-button @click="downloadPpt">导出ppt</el-button>
        <el-button @click="downloadPdf">导出pdf</el-button>
        <el-button @click="quanping"> <span>{{ isQUNPING?'全屏':'取消全屏' }}</span></el-button>
      </div>
      <!-- 主体内容部分 -->
      <div class="big" @scroll="onScroll">
        <!-- 部队情况 -->
        <div v-if="subTabsList[0].isShow" class="forcesSituation scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队情况</span>
          </div>
          <div v-for="(item,index) in bdList" :key="index" style="display: flex;">
            <template v-if="index %2 !== 0">
              <div v-for="(items,indexs) in item" :key="indexs" class="allBgc">
                <div class="itemsName" :title="items.labelName">
                  {{ items.labelName }}
                </div>
                <!--  v-if="items.value && items.value.length > 2" v-focus -->
                <div class="ziduan" :title="items.value">{{ items.value }}</div>
              </div>
            </template>
            <template v-else>
              <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                <div class="itemsName" :title="items.labelName">
                  {{ items.labelName }}
                </div>
                <div
                  class="ziduan"
                  :title="items.value"
                >{{ items.value }}</div>
              </div>
            </template>
          </div>
        </div>

        <!-- 部队部署 -->
        <div v-if="subTabsList[1].isShow" id="BDBD_ID" class="troopsDeployed scroll-item" style="height: 448px;">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队部署</span>
          </div>
          <MapOl v-if="baseDataModule" ref="MapOl" style="height:400px" :is-add-popup="true" :base-data-module="baseDataModule" :is-quanping="isQUNPING" />
        </div>

        <!-- 责任区 -->
        <div v-if="subTabsList[2].isShow" class="turnoutArea scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>责任区</span>
          </div>

          <div
            v-for="(item, index) in zrqLIstanbul"
            :key="'index4'+index"
            style="display: flex;"
          >
            <template v-if="index %2 !== 0">
              <div v-for="(items,indexs) in item" :key="indexs" class="allBgc">
                <div class="itemsName" :title="items.labelName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan" :title="items.value">{{ items.value }}</div>
              </div>
            </template>
            <template v-else>
              <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                <div class="itemsName" :title="items.labelName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan" :title="items.value">{{ items.value }}</div>
              </div>
            </template>
          </div>
        </div>

        <!-- 担负任务 -->
        <div v-if="subTabsList[3].isShow" class="responsible scroll-item history">
          <div class="topTitle">
            <div class="leftLine" />
            <span>担负任务</span>
          </div>
          <div v-if="dfrwList.length>0" style="height:440px;overflow-y:scroll;">
            <div
              v-for="(item, index) in dfrwList"
              :key="'index5'+index"
              style="display: flex;margin-left:25px;white-space: pre-line;"
            >
              <p style="line-height:40px;width: 97%;">{{ item }}</p>
            </div>
          </div>
          <div v-else>
            <el-empty :image-size="200" />
          </div>
        </div>

        <!-- 历史沿革 -->
        <div v-if="subTabsList[4].isShow" class="history scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>历史沿革</span>
          </div>
          <pdf ref="pdf" class="evolution" style="width:96%" :src="pdfUrl" />
        </div>

        <!-- 人员实力 -->
        <!-- :header-cell-style="{textAlign: 'center'}" -->
        <!-- :cell-style="{ textAlign: 'center' }" -->
        <div v-if="subTabsList[5].isShow" class="personStrength scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>人员实力</span>
          </div>
          <div style="display:flex;height:100%;padding-right: 14px;">
            <div id="myChartNumber1" class="chart-section" />
            <el-table
              :data="peopleTableData"
              border
              style="font-size: 14px"
              stripe
              show-summary
              force-scroll="vertical"
            >
              <el-table-column prop="MC" label="人员类别" />
              <el-table-column prop="BZS" label="编制数" />
              <el-table-column prop="SYS" label="现有数" />
              <el-table-column
                prop="ZWS"
                label="在位数"
              />
              <el-table-column
                prop="KCDS"
                label="可出动数"
              />
            </el-table>
          </div>
        </div>

        <!-- 装备实力 -->
        <div v-if="subTabsList[6].isShow" class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>装备实力</span>
          </div>
          <!-- 装备动态情况 -->
          <div class="currentIntelligence">
            <el-table
              :data="zbdtData"
              style="width: 96%;overflow: auto;"
              row-key="id"
              border
              lazy
              :load="lazyLoad"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              @row-click="zbdtDetails"
            >
              <el-table-column label="装备">
                <template slot-scope="scope">
                  <el-popover v-if="scope.row.hasChildren" :ref="'popover' + scope.row.id" trigger="click" placement="top" :append-to-body="false">
                    <div v-if="allEquipmentSiData && allEquipmentSiData.length>0">
                      <div style="width: 100%;display: flex;justify-content: space-between;">
                        <p>装备状况</p>
                        <p>数量</p>
                      </div>
                      <div style="max-height: 219px;overflow: auto;">
                        <div v-for="(item,index) in allEquipmentSiData" :key="index" style="width: 100%;display: flex;line-height: 37px;justify-content: space-between;background: #eee;padding: 0px 10px;margin-bottom: 10px;">
                          <p style="margin:0">{{ item.equipmentSituation }}</p>
                          <p style="margin:0">{{ item.equipmentNumber }}</p>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <p style="margin:0;padding:0;">暂无数据</p>
                    </div>

                    <div slot="reference" class="name-wrapper" style="display: inline-block;">
                      {{ scope.row.label }}
                    </div>
                  </el-popover>

                  <div v-else style="display: inline-block;">{{ scope.row.label }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="establishmentNumber"
                label="编制数"
                width="200"
              />
              <el-table-column prop="existingNumber" label="现有数" width="200" />
              <el-table-column prop="availableNumber" label="可用数" width="200" />
              <el-table-column prop="increaseNumber" label="拟增加数" width="200" />
              <!-- <el-table-column prop="remark" label="操作" width="200" /> -->
            </el-table>
          </div>

        </div>

        <!-- 关键岗位人员信息 -->
        <div v-if="subTabsList[7].isShow" class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>关键岗位人员信息</span>
          </div>
          <!-- accordion  开启手风琴模式 -->
          <el-collapse
            v-model="activeNames"
            class="myclass"
            accordion
            style="margin: 0 22px;"
            @change="collapse"
          >
            <el-collapse-item v-for="(item,index) in ggryData" :key="index" :name="item.GGRLNM">
              <template slot="title">
                <i :class="IScode==item.GGRLNM?'el-icon-caret-bottom':'el-icon-caret-right'" style="font-size:16px" /> {{ item.MC }}
              </template>
              <el-table
                :data="ggryTableData"
                stripe
                border
                style="width: 96%;overflow: auto;"
              >
                <el-table-column
                  v-for="(items,indexs) in tableColumn"
                  :key="indexs"
                  :prop="items.prop"
                  :label="items.label"
                  stripe
                  border
                />
                <el-table-column
                  label="操作"
                  fixed="right"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      style="color:#1F7FD8"
                      @click="details(scope.row)"
                    >详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>

        </div>

        <!-- 专业人员 -->
        <div v-if="subTabsList[8].isShow" class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>专业人员</span>
          </div>

          <!-- 飞行机组 -->
          <div class="currentIntelligence">
            <h5>飞行机组</h5>
            <div style="display:flex;height:100%;padding-right: 14px;">

              <el-collapse
                v-model="activeName"
                class="myclass"
                style="margin-left: 20px;width: 50%;"
                accordion
                @change="fxjCollapse"
              >
                <el-collapse-item v-for="(item,index) in flightTableData" :key="index" :name="item.XH">
                  <template slot="title">
                    <i :class="fxjIScode==item.XH?'el-icon-caret-bottom':'el-icon-caret-right'" style="font-size:16px" /> {{ item.MC }}
                  </template>
                  <el-table
                    :data="fxjTableData"
                    border
                    style="margin:0"
                    stripe
                  >
                    <el-table-column
                      prop="personCategory"
                      label="专业人员类别"
                    />
                    <el-table-column
                      prop="establishmentNumber"
                      label="编制数"
                    />
                    <el-table-column prop="existingNumber" label="现有数" />
                    <el-table-column prop="reignNumber" label="在位数" />
                  </el-table>
                </el-collapse-item>
              </el-collapse>
              <div id="myChartNumber2" class="chart-section" />
            </div>

          </div>
          <el-divider />
          <!-- 潜艇艇员队 -->
          <div class="currentIntelligence">
            <h5>潜艇艇员队</h5>
            <div style="display:flex;height:100%;padding-right: 14px;">

              <el-collapse
                v-model="qtactiveName"
                class="myclass"
                style="margin-left: 20px;width: 50%;"
                accordion
                @change="qtCollapse"
              >
                <el-collapse-item v-for="(item,index) in warTableData" :key="index" :name="item.XH">
                  <template slot="title">
                    <i :class="qtIScode==item.XH?'el-icon-caret-bottom':'el-icon-caret-right'" style="font-size:16px" /> {{ item.MC }}
                  </template>
                  <el-table
                    :data="qtTableData"
                    border
                    style="margin:0"
                    stripe
                  >
                    <el-table-column
                      prop="personCategory"
                      label="专业人员类别"
                    />
                    <el-table-column
                      prop="establishmentNumber"
                      label="编制数"
                    />
                    <el-table-column prop="existingNumber" label="现有数" />
                    <el-table-column prop="reignNumber" label="在位数" />
                  </el-table>
                </el-collapse-item>
              </el-collapse>
              <div id="myChartNumber3" class="chart-section" />
            </div>

          </div>
        </div>

        <!-- 物资动态情况 -->
        <div v-if="subTabsList[9].isShow" class="personStrength scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>物资动态情况</span>
          </div>
          <el-table
            :data="wzdtTableData"
            border
            stripe
            style="width: 96%;overflow: auto;"
            row-key="id"
            lazy
            :load="lazyLoadWzdt"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column
              prop="label"
              label="物资类别"
              width="300"
            />
            <el-table-column prop="carryingAmount" label="携行量" />
            <el-table-column prop="runAmount" label="运行量" />
            <el-table-column prop="addAmount" label="加大量" />
            <el-table-column prop="consumption" label="消耗量" />
            <el-table-column prop="transshipment" label="补充量" />
          </el-table>
        </div>

        <!-- 弹药情况 -->
        <div v-if="subTabsList[10].isShow" class="personStrength scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>弹药情况</span>
          </div>
          <!-- 将show-summary设置为true就会在表格尾部展示合计行。 -->
          <el-table
            :data="dyqkTableData"
            border
            style="width: 96%; font-size: 14px"
            stripe
            row-key="id"
            lazy
            :load="lazyLoads"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            @row-click="dyqkDetails"
          >
            <el-table-column label="装备" width="300">
              <template slot-scope="scope">
                <el-popover v-if="!scope.row.hasChildren" :ref="'popover' + scope.row.id" trigger="click" placement="top" :append-to-body="false">
                  <div v-if="allDyqkData && allDyqkData.length>0">
                    <div style="width: 100%;display: flex;justify-content: space-between;">
                      <p>弹药状态</p>
                      <p>弹药数量</p>
                    </div>
                    <div style="max-height: 219px;overflow: auto;">
                      <div v-for="(item,index) in allDyqkData" :key="index" style="width: 100%;display: flex;line-height: 37px;justify-content: space-between;background: #eee;padding: 0px 10px;margin-bottom: 10px;">
                        <p style="margin:0">{{ item.dyzt }}</p>
                        <p style="margin:0">{{ item.amount }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <p style="margin:0">暂无数据</p>
                  </div>

                  <div slot="reference" class="name-wrapper" style="display: inline-block;">
                    {{ scope.row.label }}
                  </div>
                </el-popover>

                <div v-else style="display: inline-block;">{{ scope.row.label }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="carryingAmount" label="携行量" />
            <el-table-column prop="runAmount" label="运行量" />
            <el-table-column prop="addAmount" label="加大量" />
            <el-table-column prop="consumption" label="消耗量" />
            <el-table-column prop="transshipment" label="补充量" />
          </el-table>
        </div>

        <!-- 指挥机构 -->
        <div v-if="subTabsList[11].isShow" class="forcesSituation scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>指挥机构</span>
          </div>
          <div
            v-for="(item, index) in zhjgList"
            :key="'index6'+index"
            style="display: flex;"
          >
            <template v-if="index %2 !== 0">
              <div v-for="(items,indexs) in item" :key="indexs" class="allBgc">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
            <template v-else>
              <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
          </div>
          <el-divider />
        </div>

        <!-- 战备水平-->
        <div v-if="subTabsList[12].isShow" class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>战备水平</span>
          </div>
          <!-- 基本情况 -->
          <h5>基本情况</h5>
          <div
            v-for="(item, index) in jbqkList"
            :key="'index7'+index"
            style="display: flex;"
          >
            <template v-if="index %2 !== 0">
              <div v-for="(items,indexs) in item" :key="indexs" class="allBgc">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
            <template v-else>
              <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
          </div>
          <el-divider />
          <!-- 机动能力 -->
          <h5>机动能力</h5>
          <div
            v-for="(item, index) in jdnlList"
            :key="'index8'+index"
            style="display: flex;"
          >
            <template v-if="index %2 !== 0">
              <div v-for="(items,indexs) in item" :key="indexs" class="allBgc">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
            <template v-else>
              <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
          </div>
          <el-divider />
          <!-- 训练水平 -->
          <h5>训练水平</h5>
          <div
            v-for="(item, index) in xlspList"
            :key="'index9'+index"
            style="display: flex;"
          >
            <template v-if="index %2 !== 0">
              <div v-for="(items,indexs) in item" :key="indexs" class="allBgc">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
            <template v-else>
              <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
          </div>
          <el-divider />
          <!-- 战备值班情况 -->
          <div class="currentIntelligence">
            <h5 style="margin: 0 0 10px 24px">战备值班情况</h5>
            <div
              v-for="(item, index) in zbzbList"
              :key="'index10'+index"
              style="display: flex;"
            >
              <template v-if="index %2 !== 0">
                <div v-for="(items,indexs) in item" :key="indexs" class="allBgc">
                  <div class="itemsName">
                    {{ items.labelName }}
                  </div>
                  <div class="ziduan">{{ items.value }}</div>
                </div>
              </template>
              <template v-else>
                <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                  <div class="itemsName">
                    {{ items.labelName }}
                  </div>
                  <div class="ziduan">{{ items.value }}</div>
                </div>
              </template>
            </div>
            <h5>值班人员</h5>
            <div style="display:flex;height:100%;padding-right: 14px;">
              <el-collapse
                v-model="activeName"
                class="myclass"
                style="margin-left: 20px;width: 50%;"
                accordion
                @change="zbryCollapse"
              >
                <el-collapse-item v-for="(item,index) in zbryTableData" :key="index" :name="item.code">
                  <template slot="title">
                    <i :class="zbryIScode==item.code?'el-icon-caret-bottom':'el-icon-caret-right'" style="font-size:16px" /> {{ item.label }}
                  </template>
                  <el-table
                    :data="warPersonTableData"
                    border
                    style="margin: 0"
                    stripe
                  >
                    <el-table-column prop="dutyPersonName" label="姓名" />
                    <el-table-column prop="dutyDate" label="值班日期" />
                  </el-table>
                </el-collapse-item>
              </el-collapse>
              <div id="zbryChart" class="chart-section" />
            </div>
            <el-divider />
            <h5 style="margin-top: 10px">值班装备</h5>
            <el-table
              :data="warEquipmentTableData"
              border
              style="margin:0 24px;width:96%"
              stripe
            >
              <el-table-column prop="zbnm" label="装备名称" />
              <el-table-column prop="amount" label="装备数量" />
              <el-table-column
                prop="zbdy"
                label="值班弹药"
              />
              <el-table-column
                prop="dyamount"
                label="弹药数量"
              />
            </el-table>
          </div>
          <el-divider />
          <!-- 一次出动可装带的最大弹药数 -->
          <div class="currentIntelligence">
            <h5>一次出动可装带的最大弹药数</h5>
            <el-table
              :data="maxAmmunitiTableData"
              border
              style="margin:0 24px;width:96%"
              stripe
            >
              <el-table-column prop="dznm" label="弹种" />
              <el-table-column prop="amount" label="数量" />
            </el-table>
          </div>
        </div>

        <!-- 后装保障体系 -->
        <div v-if="subTabsList[13].isShow" class="forcesSituation scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>后装保障体系</span>
          </div>
          <div
            v-for="(item, index) in hzbzList"
            :key="'index11'+index"
            style="display: flex;"
          >
            <template v-if="index %2 !== 0">
              <div v-for="(items,indexs) in item" :key="indexs" class="allBgc">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
            <template v-else>
              <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
          </div>
          <el-table
            :data="defenceEquipmentTableData"
            border
            style="margin:0 24px;width:96%"
            stripe
          >
            <el-table-column prop="equipmentName" label="防卫力量主要装备" />
            <el-table-column prop="equipmentNumber" label="数量" />
          </el-table>
        </div>

        <!-- 部队后勤 -->
        <div v-if="subTabsList[14].isShow" class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队后勤</span>
          </div>
          <div style="display:flex">
            <!-- 干部供应 -->
            <div class="currentIntelligence" style="width: 45%;margin-right: 87px;">
              <h5>干部供应</h5>
              <el-table
                :data="cadreSupplyTableData"
                border
                class="hqbzClass"
                style="width:100%"
                stripe
              >
                <el-table-column prop="level" label="军衔" />
                <el-table-column prop="currentNumber" label="现有数" />
              </el-table>
            </div>
            <!-- 士兵供应 -->
            <div class="currentIntelligence" style="width: 45%;">
              <h5>士兵供应</h5>
              <el-table
                :data="soldiersSupplyTableData"
                border
                class="hqbzClass"
                style="width: 100%"
                stripe
              >
                <el-table-column prop="level" label="职务级别" />
                <el-table-column prop="currentNumber" label="现有数" />
              </el-table>
            </div>
          </div>
          <el-divider />
          <!-- 后勤装备 -->
          <div class="currentIntelligence">
            <h5>后勤装备</h5>
            <div style="display:flex;height:100%;">
              <el-table
                :data="hqzbequipmentTableData"
                style="font-size: 14px"
                stripe
                row-key="id"
                border
                lazy
                :load="hqzblazyLoad"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              >
                <el-table-column
                  prop="label"
                  label="装备名称"
                  width="200"
                />
                <el-table-column
                  prop="establishmentNumber"
                  label="编制数"
                />
                <el-table-column prop="existingNumber" label="现有数" />
                <el-table-column prop="availableNumber" label="可用数" />
                <el-table-column prop="increaseNumber" label="拟增加数" />
              </el-table>
              <div id="hqzbChart" class="chart-section" />
            </div>

          </div>
        </div>

        <!-- 部队军标 -->
        <div v-if="subTabsList[15].isShow" class="forcesSituation scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队军标</span>
          </div>
          <div
            v-for="(item, index) in bdjbTableData"
            :key="'index12'+index"
            style="display: flex;"
          >
            <template v-if="index %2 !== 0">
              <div v-for="(items,indexs) in item" :key="indexs" class="allBgc">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
            <template v-else>
              <div v-for="(items,indexs) in item" :key="indexs" class="situationItem">
                <div class="itemsName">
                  {{ items.labelName }}
                </div>
                <div class="ziduan">{{ items.value }}</div>
              </div>
            </template>
          </div>
        </div>
        <!-- 部队媒体 -->
        <div v-if="subTabsList[16].isShow" class="forcesSituation scroll-item" style="margin-bottom: 0px">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队媒体</span>
          </div>
          <!-- <div v-for="(item,index) in bdmtTableData" :key="index" style="margin-left: 24px;margin-top:4px">
            <pdf v-if="item.mediaFormat === 'RTF'" ref="pdf" class="evolution" style="width:96%" :src="item.mediaFileName" />
            <img v-if="item.mediaFormat === 'JPG/JPEG'" :src="item.mediaFileName" style=" height: 500px; ">
          </div> -->
          <div v-if="bdmtTableData.length>0" style="margin:10px 25px">
            <el-carousel :interval="5000" arrow="always">
              <el-carousel-item v-for="(item,index) in bdmtTableData" :key="index">
                <img :src="item" style=" height: 500px;object-fit: cover;width:100% ">
              </el-carousel-item>
            </el-carousel>
          </div>
          <div v-else>
            <el-empty :image-size="200" />
          </div>

        </div>
      </div>
    </div>

    <!-- 关岗人员详情页面 -->
    <Details v-if="dialogVisible" :dialog-visible="dialogVisible" :detail-row="detailRow" @handleClose="handleClose" />
  </Container>
</template>

<script>
import * as API from '@/api/index'
import pdf from 'vue-pdf'
// import Red from '@/icons/img/mapSearch/red.png'
import Container from '@/components/Container'
import Details from './details'
// import Containertwo from '@/components/ContainerTwo'
import NoHeaderTree from '@/components/NoHeaderTree'
import MapOl from '@/components/MapOl'
import * as DataCollectionAPI from '@/api/dataCollection'
import html2canvas from 'html2canvas'
import bus from '@/utils/bus'
import zhuangbei from './zhuangbei'
export default {
  name: 'Pdf',
  components: { Container, NoHeaderTree, pdf, Details, MapOl, zhuangbei },
  // 鼠标悬浮显示内容
  directives: {
    'focus': {
      componentUpdated(el) {
        const curStyle = window.getComputedStyle(el, '') // 获取当前元素的style
        const textSpan = document.createElement('span') // 创建一个容器来记录文字的width
        // 设置新容器的字体样式，确保与当前需要隐藏的样式相同
        textSpan.style.fontSize = curStyle.fontSize
        textSpan.style.fontWeight = curStyle.fontWeight
        textSpan.style.fontFamily = curStyle.fontFamily
        // 将容器插入body，如果不插入，offsetWidth为0
        document.body.appendChild(textSpan)
        // 设置新容器的文字
        textSpan.innerHTML = el.innerText
        // 如果字体元素小于当前元素，则需要隐藏
        if (textSpan.offsetWidth < el.offsetWidth) {
          // 给当前元素设置超出隐藏
          el.style.overflow = 'hidden'
          el.style.textOverflow = 'ellipsis'
          el.style.whiteSpace = 'nowrap'
          // 鼠标移入
          el.onmouseenter = (e) => {
            // 创建浮层元素并设置样式
            const vcTooltipDom = document.createElement('div')
            vcTooltipDom.style.cssText = `
              max-width:400px;
              max-height: 400px;
              overflow: auto;
              position:absolute;
              top:${e.clientY + 5}px;
              left:${e.clientX}px;
              background: rgba(0, 0 , 0, .6);
              color:#fff;
              border-radius:5px;
              padding:10px;
              display:inline-block;
              font-size:12px;
              z-index:19999
            `
            // 设置id方便寻找
            vcTooltipDom.setAttribute('id', 'vc-tooltip')
            // 将浮层插入到body中
            document.body.appendChild(vcTooltipDom)
            // 浮层中的文字
            document.getElementById('vc-tooltip').innerHTML = el.innerText
          }
          // 鼠标移出
          el.onmouseleave = function() {
            // 找到浮层元素并移出
            const vcTooltipDom = document.getElementById('vc-tooltip')
            vcTooltipDom && document.body.removeChild(vcTooltipDom)
          }
        }
        // 记得移除刚刚创建的记录文字的容器
        document.body.removeChild(textSpan)
      },
      // 指令与元素解绑时
      unbind() {
        // 找到浮层元素并移除
        const vcTooltipDom = document.getElementById('vc-tooltip')
        vcTooltipDom && document.body.removeChild(vcTooltipDom)
      }
    }
  },

  data() {
    return {
      loading2: false,
      defaultProps: {
        label: 'label',
        value: 'code',
        id: 'id'
      },
      defaultPropszb: {
        label: 'label',
        value: 'code',
        code: 'code'
      },
      dfrwList: [], // 担负任务
      currents: '',
      zhuangbeiData: {},
      bdCheckedList: [],
      zbCheckedList: [],
      activeNameqh: '部队',
      allcollapseData: [[]],
      activeNames: [],
      activeName: [],
      qtactiveName: [],
      ggryData: [],
      allDatas: [],
      tableData1: [],
      deleteTabIndex: '',
      show: false,
      dialogVisible: false,
      detailRow: {},
      foceCode: '',
      // indexList: 0,
      pdfUrl: '',
      IScode: '',
      fxjIScode: '',
      zbryIScode: '',
      qtIScode: '',
      // 树内容
      treeData: [],
      // 树配置
      treeProps: {
        label: 'label',
        children: 'childList'
      },
      type: [
        {
          vlaue: '01',
          types: 'jcsj' // 部队情况
        },
        {
          vlaue: '02',
          types: 'bdbs'
        },
        {
          vlaue: '03',
          types: 'zrq'
        },
        {
          vlaue: '04',
          types: 'dfrw'
        },
        {
          vlaue: '05',
          types: 'lsyg'
        },
        {
          vlaue: '06',
          types: 'rysl'
        },
        {
          vlaue: '07',
          types: 'zbsl'
        },
        {
          vlaue: '08',
          types: 'ggry'
        },
        {
          vlaue: '09',
          types: 'zyry'
        },
        {
          vlaue: '010',
          types: 'wzdt'
        },
        {
          vlaue: '011',
          types: 'dyqk'
        },
        {
          vlaue: '012',
          types: 'zhjgqk'
        },
        {
          vlaue: '013',
          types: 'zbsp'
        },
        {
          vlaue: '014',
          types: 'hzbz'
        },
        {
          vlaue: '015',
          types: 'bdhq'
        },
        {
          vlaue: '016',
          types: 'bdjb'
        },
        {
          vlaue: '017',
          types: 'bdmt'
        }
      ],
      typeLx: '',
      subTabsList: [
        {
          vlaue: '1',
          type: 'jcsj',
          label: '部队情况',
          isShow: true
        },
        {
          vlaue: '2',
          type: 'bdbs',
          label: '部队部署',
          isShow: true
        },
        {
          vlaue: '3',
          type: 'zrq',
          label: '责任区',
          isShow: true
        },
        {
          vlaue: '4',
          type: 'dfrw',
          label: '担负任务',
          isShow: true
        },
        {
          vlaue: '5',
          type: 'lsyg',
          label: '历史沿革',
          isShow: true
        },
        {
          vlaue: '6',
          type: 'rysl',
          label: '人员实力',
          isShow: true
        },
        {
          vlaue: '7',
          type: 'zbsl',
          label: '装备实力',
          isShow: true
        },
        {
          vlaue: '8',
          type: 'ggry',
          label: '关键岗位人员',
          isShow: true
        },
        {
          vlaue: '9',
          type: 'zyry',
          label: '专业人员',
          isShow: true
        },
        {
          vlaue: '10',
          type: 'wzdt',
          label: '物资动态',
          isShow: true
        },
        {
          vlaue: '11',
          type: 'dyqk',
          label: '弹药情况',
          isShow: true
        },
        {
          vlaue: '12',
          type: 'zhjgqk',
          label: '指挥机构',
          isShow: true
        },
        {
          vlaue: '13',
          type: 'zbsp',
          label: '战备水平',
          isShow: true
        },
        {
          vlaue: '14',
          type: 'hzbz',
          label: '后装保障体系',
          isShow: true
        },
        {
          vlaue: '15',
          type: 'bdhq',
          label: '部队后勤',
          isShow: true
        },
        {
          vlaue: '16',
          type: 'bdjb',
          label: '部队军标',
          isShow: true
        },
        {
          vlaue: '17',
          type: 'bdmt',
          label: '部队媒体',
          isShow: true
        }
      ],
      checkList: [],
      secondLevel: '部队情况',

      onLineDataList: [],
      tableName: undefined,

      peopleTableData: [], // 人员实力   表格内容
      currentTableData: [], // 装备动态情况表格内容
      warshipTableData: [], // 装备动态舰艇
      zbequipmentTableData: [], // 装备状况

      tableData: [], // 关键岗位人员信息
      ggryTableData: [],
      tableColumn: [
        {
          label: '姓名',
          prop: 'MC'
        },
        {
          label: '性别',
          prop: 'XBNM'
        },
        {
          label: '身份证号码',
          prop: 'SFZHM'
        },
        {
          label: '军衔',
          prop: 'JXNM'
        },
        {
          label: '关键岗位人员类别',
          prop: 'GGRLNM'
        },
        {
          label: '文化程度',
          prop: 'WHCDNM'
        }

      ], // 表格表头
      // personalNumberTableData: [], // 关键岗位人员信息
      // personnelCategoryTableData: [], // 人员类别
      // commanderTableData: [], // 指挥员
      // aviatorTableData: [], // 飞行员
      // missileEntityListTableData: [], // 导弹发射营长
      // warshipEntityTableData: [], // 舰艇长
      // useWeaponsTableData: [], // 使用武器情况
      // ammunitionSituationEntityTableData: [], // 实弹发射情况

      defenceEquipmentTableData: [], // 后装保障表格

      flightTableData: [], // 飞行机组人员
      zbryTableData: [], // 值班人员
      fxjTableData: [], // 飞行机组人员
      qtTableData: [], // 飞行机组人员
      warTableData: [], // 潜艇艇员队

      wzdtTableData: [], // 动态物资情况

      dyqkTableData: [], // 弹药情况
      cadreSupplyTableData: [], // 干部供应
      soldiersSupplyTableData: [], // 士兵供应
      hqzbequipmentTableData: [], // 后勤装备

      bdjbTableData: [], // 部队军标
      bdmtTableData: [], // 部队媒体
      hzbzList: [], // 后装保障item

      bdList: [], // 部队情况
      bdbsList: [], // 部队部署
      zrqLIstanbul: [], // 责任区
      dfrwList: [], // 担负任务
      lsygList: [], // 历史沿革
      ryslList: [], // 人员实力
      zhjgList: [], // 指挥机构
      zbspList: [], // 战备水平
      jbqkList: [], // 基本情况
      xlspList: [], // 训练水平
      maxAmmunitiTableData: [], // 一次出动可装带的最大弹药数
      zbzbList: [], // 战备值班
      warPersonTableData: [], // 值班人员
      warEquipmentTableData: [], // 值班装备
      jdnlList: [], // 机动能力
      tabIndex: 0, // 动态切换导航栏
      // 基础数据地图参数
      baseDataModule: null,
      // 装备动态表格数据
      zbdtData: [],
      visible: false,
      allEquipmentSiData: [], // 装备实力
      allDyqkData: [], // 装备实力
      foceSerialNumber: '',
      isQUNPING: true,
      equipmentCode: ''
    }
  },
  watch: {
    activeNameqh: {
      handler(val) {
        // this.getTreeList()
      },
      deep: true

    }
  },
  mounted() {
    // this.getTreeList()
    // const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
    // mapboxgl.accessToken =
    //   'pk.eyJ1IjoibWFvcmV5IiwiYSI6ImNqNWhrenIwcDFvbXUyd3I2bTJxYzZ4em8ifQ.KHZIehQuWW9AsMaGtATdwA'
    // this.map = new mapboxgl.Map({
    //   container: 'map', // container id
    //   style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    //   center: [109.0469971, 34.11899951], // starting position [lng, lat]
    //   zoom: 7 // starting zoom
    // })
  },
  methods: {
    // 加载部队树
    loadBdTreeNode(node, resolve) {
      const params = {}
      params.forceSequence = node.data ? node.data.id : ''
      API.getForceTreeList(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          if (node.level === 0) {
            if (data && data.length > 0) {
              // 默认部队选中节点
              this.bdCheckedList = [data[0].code]

              const checkTree = this.bdCheckedList.toString()
              this.getTableList(checkTree)
              this.showLeftTree = true
              this.foceCode = data[0].code
              // this.forceCode =  data[0].code
            } else {
              this.showLeftTree = false
            }
          }
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    quanping() {
      this.isQUNPING = !this.isQUNPING
      bus.$emit('QUNPING', this.isQUNPING)
    },
    handleClose(val) {
      this.dialogVisible = val
    },
    details(row) {
      this.dialogVisible = true
      this.detailRow = row
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
    // 导出word
    downloadWord() {
      const props = {
        forceCode: this.foceCode
      }
      API.getBassExport(props).then(res => {
        const { msg, code } = res
        if (String(code) === '200') {
          window.open(msg)
          this.$message.success('导出成功')
        } else {
          this.$message.error('导出失败')
        }
      })
    },
    // 导出
    downloadPpt() {
      const targetDom = document.querySelector('#BDBD_ID')
      html2canvas(targetDom, {
        backgroundColor: '#FFFFFF'
      }).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png')
        const formData = new FormData()
        formData.append('file', this.base64ToFile(dataURL), 'image/png')
        API.uploadShotPicture(formData).then(res => {
          const { code, data } = res
          if (String(code) === '200') {
            const params = {
              forceCode: this.foceCode,
              shots: [data]
            }
            API.exportPpt(params).then(res => {
              const { msg, code } = res
              if (String(code) === '200') {
                window.open(msg)
                this.$message.success('导出成功')
              } else {
                this.$message.error('导出失败')
              }
            })
          }
        })
      })
    },
    downloadPdf() {
      const props = {
        forceCode: this.foceCode
      }
      API.getExportPdf(props).then(res => {
        const { msg, code } = res
        if (String(code) === '200') {
          window.open(msg)
          this.$message.success('导出成功')
        } else {
          this.$message.error('导出失败')
        }
      })
    },
    // 防抖
    debounce(func, wait, immediate) {
      var timeout, args, context, timestamp, result
      var later = function() {
        // 据上一次触发时间间隔
        var last = new Date() - timestamp
        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
          timeout = setTimeout(later, wait - last)
        } else {
          timeout = null
          // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
          if (!immediate) {
            result = func.apply(context, args)
            if (!timeout) context = args = null
          }
        }
      }
      return function() {
        context = this
        args = arguments
        timestamp = new Date()
        var callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
          result = func.apply(context, args)
          context = args = null
        }

        return result
      }
    },
    // 锚点定位
    jump(tab) {
      this.secondLevel = tab.label
      const index = tab.index
      const target = document.querySelector('.big')
      const scrollItems = document.querySelectorAll('.scroll-item')
      // 判断滚动条是否滚动到底部
      if (target.scrollHeight <= target.scrollTop + target.clientHeight) {
        this.tabIndex = index
      }
      const totalY = scrollItems[index].offsetTop - scrollItems[0].offsetTop // 锚点元素距离其offsetParent(这里是body)顶部的距离(待滚动的距离)
      let distance = document.querySelector('.big').scrollTop // 滚动条距离滚动区域顶部的距离
      // let distance = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset // 滚动条距离滚动区域顶部的距离(滚动区域为窗口)
      // 滚动动画实现, 使用setTimeout的递归实现平滑滚动，将距离细分为50小段，10ms滚动一次
      // 计算每一小段的距离
      let step = totalY / 50
      if (totalY > distance) {
        smoothDown(document.querySelector('.big'))
      } else {
        const newTotal = distance - totalY
        step = newTotal / 50
        smoothUp(document.querySelector('.big'))
      }

      // 参数element为滚动区域
      function smoothDown(element) {
        if (distance < totalY) {
          distance += step
          element.scrollTop = distance
          setTimeout(smoothDown.bind(this, element), 10)
        } else {
          element.scrollTop = totalY
        }
      }

      // 参数element为滚动区域
      function smoothUp(element) {
        if (distance > totalY) {
          distance -= step
          element.scrollTop = distance
          setTimeout(smoothUp.bind(this, element), 10)
        } else {
          element.scrollTop = totalY
        }
      }
    },
    // 内容滚动
    onScroll(e) {
      const scrollItems = document.querySelectorAll('.scroll-item')
      for (let i = scrollItems.length - 1; i >= 0; i--) {
        // 判断滚动条滚动距离是否大于当前滚动项可滚动距离
        const judge =
          e.target.scrollTop >=
          scrollItems[i].offsetTop - scrollItems[0].offsetTop - 80
        if (judge) {
          this.tabIndex = i
          break
        }
      }
      if (this.tabIndex) {
        this.secondLevel = this.subTabsList[this.tabIndex].label
      }
    },
    // 标签移除
    removeTab(targetName) {
      // 使用v-if来控制tabs栏显示与隐藏
      const deleteTab = this.subTabsList.find((item) => item.label === targetName)
      deleteTab.isShow = false
    },
    // 关港人员
    collapse(val) {
      this.IScode = val
      if (val) {
        const params = {
          keyPersonCate: val,
          forceCode: this.foceCode
        }
        DataCollectionAPI.keyPersonList(params).then(res => {
          if (res.code === 200) {
            this.ggryTableData = res.data
          }
        })
      } else {
        this.ggryTableData = []
      }
    },
    // 专业人员
    fxjCollapse(val) {
      this.fxjIScode = val
      if (val) {
        const params = {
          personType: val,
          forceCode: this.foceCode
        }
        DataCollectionAPI.professionalsInfo(params).then(res => {
          if (res.code === 200) {
            this.fxjTableData = res.data
            this.zyryPeopleTableDataDraw(res.data)
          }
        })
      }
    },
    qtCollapse(val) {
      this.qtIScode = val
      if (val) {
        const params = {
          personType: val,
          forceCode: this.foceCode
        }
        DataCollectionAPI.professionalsInfo(params).then(res => {
          if (res.code === 200) {
            this.qtTableData = res.data
            this.qtPeopleTableDataDraw(res.data)
          }
        })
      }
    },
    // 获取数据
    getTableList(id) {
      this.typeLx = this.subTabsList.map((item, index) => {
        return item.type
      })
      this.typeLx.map(item => {
        if (item === 'jcsj') {
          const params = {
            bdnm: id,
            type: this.type[0].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.bdList = this.group(data, 4)
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'bdbs') {
          const params = {
            bdnm: id,
            type: this.type[1].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              const objectAllData = {}
              let pointJD = '' // 经度
              let pointWD = '' // 纬度
              data.forEach(i => {
                if (i.labelName === '部队') {
                  objectAllData.bd = i
                } else if (i.labelName === '地名') {
                  objectAllData.dm = i
                } else if (i.labelName === '扩展地名') {
                  objectAllData.kzdm = i
                } else if (i.labelName === '部署类别') {
                  objectAllData.bslb = i
                } else if (i.labelName === '部署形式') {
                  objectAllData.bsxs = i
                } else if (i.labelName === '高程') {
                  objectAllData.gc = i
                } else if (i.labelName === '作战时间') {
                  objectAllData.zzsj = i
                } else if (i.labelName === '天文时间') {
                  objectAllData.twsj = i
                } else if (i.labelName === '经度') {
                  pointJD = parseFloat(i.value) // 地图服务需要浮点类型数据 返回的是字符串类型
                  objectAllData.pointJD = i
                } else if (i.labelName === '纬度') {
                  pointWD = parseFloat(i.value)
                  objectAllData.pointWD = i
                }
              })
              objectAllData.lonlat = [pointJD, pointWD]
              this.baseDataModule = objectAllData
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'zrq') {
          const params = {
            bdnm: id,
            type: this.type[2].types
          }

          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.zrqLIstanbul = this.group(data, 4)
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'dfrw') {
          const params = {
            bdnm: id,
            type: this.type[3].types
          }

          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.dfrwList = []
              data.forEach(item => {
                this.dfrwList.push(item.DFRW)
              })
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'lsyg') {
          const params = {
            bdnm: id,
            type: this.type[4].types
          }

          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.pdfUrl = data
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'rysl') {
          const params = {
            bdnm: id,
            type: this.type[5].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.peopleTableData = data
              this.peopleTableDataDraw(data)
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'zbsl') {
          // 第一层数据
          this.getZbdtData().then(res => {
            for (let i = 0; i < res.length; i++) {
              const params = {
                equipmentCode: res[i].id,
                forceCode: id
              }

              API.getEquipmentDy(params).then(resData => {
                if (resData.code === 200) {
                  res[i].establishmentNumber = resData.data[0].establishmentNumber
                  res[i].existingNumber = resData.data[0].existingNumber
                  res[i].availableNumber = resData.data[0].availableNumber
                  res[i].increaseNumber = resData.data[0].increaseNumber
                }
              })
            }
            setTimeout(() => {
              this.zbdtData = res
              // console.log(res)
            }, 1000)
          })
        } else if (item === 'ggry') {
          const data = {
            forceCode: this.foceCode || id
          }
          DataCollectionAPI.personCate(data).then(res => {
            if (res.code === 200) {
              this.ggryData = res.data
            }
          })
        } else if (item === 'zyry') {
          // const params = {
          //   bdnm: id,
          //   personType: '01'
          // }
          // const param = {
          //   bdnm: id,
          //   personType: '02'
          // }
          const params = {
            forceCode: id,
            personType: '01'
          }
          const param = {
            forceCode: id,
            personType: '02'
          }
          DataCollectionAPI.professionalsCate(params).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.flightTableData = data
            } else {
              this.$message.error(msg)
            }
          })
          DataCollectionAPI.professionalsCate(param).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.warTableData = data
              // this.zyryPeopleTableDataDraw(data)
            } else {
              this.$message.error(msg)
            }
          })
          const para = {
            personType: '01',
            forceCode: this.foceCode || id
          }
          DataCollectionAPI.professionalsInfo(para).then(res => {
            if (res.code === 200) {
              this.zyryPeopleTableDataDraw(res.data)
            }
          })
          const qtPara = {
            personType: '02',
            forceCode: this.foceCode || id
          }
          DataCollectionAPI.professionalsInfo(qtPara).then(res => {
            if (res.code === 200) {
              this.qtPeopleTableDataDraw(res.data)
            }
          })
        } else if (item === 'wzdt') {
          this.getWzdtTableData().then(res => {
            // 页面一加载显示第一层数据的携行量。。
            for (let i = 0; i < res.length; i++) {
              const params = {
                equipmentCode: res[i].id,
                forceCode: this.foceSerialNumber || id || this.foceCode
              }
              DataCollectionAPI.getSuppliesInfo(params).then(resData => {
                if (resData.code === 200) {
                  res[i].carryingAmount = resData.data[0].carryingAmount
                  res[i].runAmount = resData.data[0].runAmount
                  res[i].addAmount = resData.data[0].addAmount
                  res[i].consumption = resData.data[0].consumption
                  res[i].transshipment = resData.data[0].transshipment
                }
              })
            }
            setTimeout(() => {
              this.wzdtTableData = res
            }, 1000)
          })
        } else if (item === 'dyqk') {
          this.getdyqkTableData().then(res => {
            for (let i = 0; i < res.length; i++) {
              const params = {
                equipmentCode: res[i].id,
                forceCode: this.foceSerialNumber || this.foceCode || id
              }
              DataCollectionAPI.getDydt(params).then(resData => {
                if (resData.code === 200) {
                  res[i].carryingAmount = resData.data[0].carryingAmount
                  res[i].runAmount = resData.data[0].runAmount
                  res[i].addAmount = resData.data[0].addAmount
                  res[i].consumption = resData.data[0].consumption
                  res[i].transshipment = resData.data[0].transshipment
                }
              })
            }
            setTimeout(() => {
              this.dyqkTableData = res
            }, 1000)
          })
        } else if (item === 'zhjgqk') {
          const params = {
            bdnm: id,
            type: this.type[11].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.zhjgList = this.group(data, 4)
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'zbsp') {
          const params = {
            bdnm: id,
            type: this.type[12].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.jbqkList = this.group(data.warPreLevelList, 4)
              this.xlspList = this.group(data.warPreTrainingLevelList, 4)
              this.maxAmmunitiTableData = data.warPreMaxWithAmmunitionList
              this.zbzbList = this.group(data.warPreDutyCaseList, 4)
              // this.warPersonTableData = data.warPreDutyPersonnelList
              this.warEquipmentTableData = data.warPreDutyEquipmentList
              this.jdnlList = this.group(data.warPreMobilityList, 4)
            } else {
              this.$message.error(msg)
            }
          })
          const zbspParams = {
            columnName: 'ZBFLNM',
            equipmentCode: '0000000000000',
            forceCode: '110000000',
            sequence: '',
            sync: false,
            tableName: 'ZZBZ_S_TY_ZBRYFL'
          }
          DataCollectionAPI.getSelectOptions(zbspParams).then(res => {
            if (res.code === 200) {
              console.log(res.data)
              this.zbryTableData = res.data
              this.getwarPreDutyPerChart()
            }
          })
        } else if (item === 'hzbz') {
          const params = {
            bdnm: id,
            type: this.type[13].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.hzbzList = this.group(data.defencePowerList, 4)
              this.defenceEquipmentTableData = data.defenceEquipmentEntityList
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'bdhq') {
          const params = {
            forceCode: id,
            type: this.type[14].types
          }
          // const params = {
          //   bdnm: id,
          //   type: this.type[14].types
          // }
          DataCollectionAPI.forceLogisticsRy(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.soldiersSupplyTableData = data.soldiersSupplyList
              this.cadreSupplyTableData = data.cadreSupplyList
            } else {
              this.$message.error(msg)
            }
          })

          // 第一层数据
          this.gethqzbData().then(res => {
            // console.log(res)

            this.getData(res).then(resd => {
              // console.log(resd)
              this.hqzbMountedTableDataDraw(resd)
            })

            setTimeout(() => {
              this.hqzbequipmentTableData = res
            }, 1000)
          })
        } else if (item === 'bdjb') {
          const params = {
            bdnm: id,
            type: this.type[15].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.bdjbTableData = this.group(data, 4)
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'bdmt') {
          const params = {
            bdnm: id,
            type: this.type[16].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              if (data && data.length > 0) {
                this.bdmtTableData = data
              } else {
                this.bdmtTableData = []
              }
            } else {
              this.$message.error(msg)
            }
          })
        }
      })
    },
    // 战备水平 点击事件获取表格数据
    zbryCollapse(val) {
      this.zbryIScode = val
      if (val) {
        const params = {
          personType: val,
          forceCode: this.foceCode
        }
        DataCollectionAPI.warPreDutyPerList(params).then(res => {
          if (res.code === 200) {
            this.warPersonTableData = res.data
          }
        })
      }
    },
    getwarPreDutyPerChart() {
      const params = {
        forceCode: this.foceCode
      }
      DataCollectionAPI.warPreDutyPerChart(params).then(res => {
        if (res.code === 200) {
          var zbryChart = this.$echarts.init(document.getElementById('zbryChart'))

          const DUTYTYPE = res.data.map((item) => {
            return item.DUTYTYPE
          })
          const PERSONSUM = res.data.map((item) => {
            return item.PERSONSUM
          })
          zbryChart.setOption({
            legend: {},
            tooltip: {},
            grid: {
              top: '10%',
              left: '3%',
              right: '5%',
              bottom: '0%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: DUTYTYPE,
              axisLabel: {
                show: true,
                interval: 0,
                formatter: function(value) {
                  return (res.data.length > 4 ? (value.slice(0, 2) + '...') : value)
                },
                textStyle: {
                  color: '#555',
                  fontSize: 12,
                  textAlign: 'center'
                }
              },
              triggerEvent: true
            },
            yAxis: { type: 'value' },
            series: [
              {
                name: '总数',
                type: 'bar',
                data: PERSONSUM
                // barWidth: 30 // 改变柱状图宽度
              }
            ]
          })
          // 页面监控宽度的变化
          window.addEventListener('resize', () => {
            zbryChart.resize()
          })

          // 就是这个方法，解决y轴鼠标放上提示全部内容
          this.extension(zbryChart)
        }
      })
    },
    async getData(res) {
      const LogisticsZb = []
      for (let i = 0; i < res.length; i++) {
        const params = {
          equipmentCode: res[i].id,
          forceCode: this.foceSerialNumber || this.foceCode
          // forceCode: this.foceSerialNumber || this.forceCode || id
        }

        LogisticsZb.push(await this.forceLogisticsZb(params, res, i))
      }
      return Promise.resolve(LogisticsZb)

      // console.log(LogisticsZb)
    },
    forceLogisticsZb(params, res, i) {
      let arr = {}
      return DataCollectionAPI.forceLogisticsZb(params).then(resData => {
        // console.log(resData)
        if (resData.code === 200) {
          if (resData.data.length && resData.data.length > 0) {
            res[i].establishmentNumber = resData.data[0].establishmentNumber
            res[i].existingNumber = resData.data[0].existingNumber
            res[i].availableNumber = resData.data[0].availableNumber
            res[i].increaseNumber = resData.data[0].increaseNumber
          }
          arr = {
            label: res[i].label,
            value: resData.data[0]
          }
        }
        return Promise.resolve(arr)
      })
    },

    // 用来分割数组  每4个为一组
    group(array, subGroupLength) {
      if (array && array.length) {
        let index = 0
        const newArray = []
        while (index < array.length) {
        // slice(start,end) 从index下标开始   不包括结尾
          newArray.push(array.slice(index, index += subGroupLength))
        }
        return newArray
      }
    },
    // 获取装备动态数据
    getZbdtData(sequence) {
      const param = {
        columnName: 'ZBNM',
        tableName: 'ZZBZ_S_TY_ZB',
        sequence: sequence || '',
        forceCode: '',
        equipmentCode: '0000000000000',
        sync: false
      }
      return new Promise((resolve, reject) => {
        DataCollectionAPI.getSelectOptions(param).then((res) => {
          const { data } = res
          data.forEach(item => {
            item.hasChildren = !item.isLeaf
          })
          resolve(data)
        })
      })
    },
    // 部队后勤表格数据
    gethqzbData(sequence) {
      const params = {
        columnName: 'ZBNM',
        equipmentCode: '0000000000000',
        forceCode: '',
        sequence: sequence || '',
        sync: false,
        tableName: 'ZZBZ_S_TY_HQZB'
      }
      return new Promise((resolve, reject) => {
        DataCollectionAPI.getSelectOptions(params).then((res) => {
          const { data } = res
          data.forEach(item => {
            item.hasChildren = !item.isLeaf
          })
          resolve(data)
        })
      })
    },
    // 弹药情况
    getdyqkTableData(sequence) {
      const param = {
        columnName: 'ZBNM',
        tableName: 'ZZBZ_S_TY_ZB',
        sequence: sequence || '01001',
        forceCode: '',
        equipmentCode: '0000000000000',
        sync: false
      }
      return new Promise((resolve, reject) => {
        DataCollectionAPI.getSelectOptions(param).then((res) => {
          const { data } = res
          data.forEach(item => {
            item.hasChildren = !item.isLeaf
          })
          const dyqkDataList = data.filter(item => item.label === '通用弹药')
          resolve(dyqkDataList)
        })
      })
    },
    // 物资动态
    getWzdtTableData(sequence) {
      const param = {
        columnName: 'WZNM',
        equipmentCode: '0000000000000',
        forceCode: '',
        sequence: sequence || '',
        sync: false,
        tableName: 'ZZBZ_S_TY_WZ'
      }
      return new Promise((resolve, reject) => {
        DataCollectionAPI.getSelectOptions(param).then((res) => {
          const { data } = res
          data.forEach(item => {
            item.hasChildren = !item.isLeaf
          })
          resolve(data)
        })
      })
    },
    // 物资动态懒加载
    lazyLoadWzdt(tree, treeNode, resolve) {
      this.getWzdtTableData(tree.id).then(res => {
        for (let i = 0; i < res.length; i++) {
          const params = {
            equipmentCode: res[i].id,
            forceCode: this.foceSerialNumber || this.foceCode || id
          }
          DataCollectionAPI.getSuppliesInfo(params).then(resData => {
            if (resData.code === 200) {
              res[i].carryingAmount = resData.data[0].carryingAmount
              res[i].runAmount = resData.data[0].runAmount
              res[i].addAmount = resData.data[0].addAmount
              res[i].consumption = resData.data[0].consumption
              res[i].transshipment = resData.data[0].transshipment
            }
          })
        }
        setTimeout(() => {
          resolve(res)
        }, 200)
      })
    },
    // 装备实力
    lazyLoad(tree, treeNode, resolve) {
      // 子节点
      this.getZbdtData(tree.id).then(res => {
        for (let i = 0; i < res.length; i++) {
          const params = {
            equipmentCode: res[i].id,
            forceCode: this.foceSerialNumber || this.foceCode
          }

          API.getEquipmentDy(params).then(resData => {
            if (resData.code === 200) {
              res[i].establishmentNumber = resData.data[0].establishmentNumber
              res[i].existingNumber = resData.data[0].existingNumber
              res[i].availableNumber = resData.data[0].availableNumber
              res[i].increaseNumber = resData.data[0].increaseNumber
            }
          })
        }
        setTimeout(() => {
          resolve(res)
        }, 200)
      })
    },
    // 部队后勤
    hqzblazyLoad(tree, treeNode, resolve) {
      this.gethqzbData(tree.id).then(res => {
        for (let i = 0; i < res.length; i++) {
          const params = {
            equipmentCode: res[i].id,
            forceCode: this.foceSerialNumber || this.foceCode
          }
          DataCollectionAPI.forceLogisticsZb(params).then(resData => {
            if (resData.code === 200) {
              if (resData.data.length && resData.data.length > 0) {
                res[i].establishmentNumber = resData.data[0].establishmentNumber
                res[i].existingNumber = resData.data[0].existingNumber
                res[i].availableNumber = resData.data[0].availableNumber
                res[i].increaseNumber = resData.data[0].increaseNumber
              }
            }
          })
        }
        const hqbzDrawId = res.map(i => {
          return i.id
        })
        // console.log(hqbzDrawId)
        const data = {
          forceCode: this.foceCode,
          equipmentCodes: hqbzDrawId
        }
        // 获取柱状图
        DataCollectionAPI.forceLogisticsZbChart(data).then(res => {
          // console.log(res)
          this.hqzbTableDataDraw(res.data)
        })

        setTimeout(() => {
          resolve(res)
        }, 1000)
      })
    },
    // 弹药情况
    lazyLoads(tree, treeNode, resolve) {
      // 子节点
      this.getZbdtData(tree.id).then(res => {
        for (let i = 0; i < res.length; i++) {
          const params = {
            equipmentCode: res[i].id,
            forceCode: this.foceSerialNumber || this.foceCode
          }
          DataCollectionAPI.getDydt(params).then(resData => {
            if (resData.code === 200) {
              res[i].carryingAmount = resData.data[0].carryingAmount
              res[i].runAmount = resData.data[0].runAmount
              res[i].addAmount = resData.data[0].addAmount
              res[i].consumption = resData.data[0].consumption
              res[i].transshipment = resData.data[0].transshipment
            }
          })
        }
        setTimeout(() => {
          resolve(res)
        }, 200)
      })
    },
    // 装备动态点击表格行
    zbdtDetails(row, column, event) {
      console.log(row)
      if (row.hasChildren) {
        const params = {
          forceCode: this.foceCode,
          equipmentCode: row.code
        }
        API.getEquipmentSi(params).then(res => {
          if (res.code === 200) {
            this.allEquipmentSiData = res.data
          }
        })
      }
    },
    dyqkDetails(row, column, event) {
      if (!row.hasChildren) {
        const params = {
          forceCode: this.foceCode,
          equipmentCode: row.code
        }
        DataCollectionAPI.getDyzt(params).then(res => {
          if (res.code === 200) {
            this.allDyqkData = res.data
          }
        })
      }
    },
    peopleTableDataDraw(data) {
      var myChart1 = this.$echarts.init(
        document.getElementById('myChartNumber1')
      )
      let mc = []
      mc = data.map((item) => {
        return item.MC
      })
      const bzs = data.map((item) => {
        return item.BZS
      })

      const xys = data.map((item) => {
        return item.SYS
      })
      const zws = data.map((item) => {
        return item.ZWS
      })
      const cds = data.map((item) => {
        return item.KCDS
      })
      myChart1.setOption({
        legend: {},
        tooltip: {},
        grid: {
          top: '10%',
          left: '3%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: { type: 'category', data: mc },
        yAxis: { type: 'value' },
        series: [
          {
            name: '编制数',
            type: 'bar',
            data: bzs
          },
          {
            name: '现有数',
            type: 'bar',
            data: xys
          },
          {
            name: '在位数',
            type: 'bar',
            data: zws
          },
          {
            name: '可出动数',
            type: 'bar',
            data: cds
          }
        ]
      })
    },
    zyryPeopleTableDataDraw(data) {
      var myChart2 = this.$echarts.init(
        document.getElementById('myChartNumber2')
      )
      const mc = []
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        // console.log(`${element.personCategory}(${element.astronomicalTime})`)
        mc.push(`${element.personCategory}(${element.astronomicalTime})`)
      }
      const bzs = data.map((item) => {
        return item.establishmentNumber
      })
      const xys = data.map((item) => {
        return item.existingNumber
      })
      const zws = data.map((item) => {
        return item.reignNumber
      })
      myChart2.setOption({
        legend: {},
        tooltip: {},
        grid: {
          top: '10%',
          left: '3%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: mc,
          axisLabel: {
            show: true,
            interval: 0,
            formatter: function(value) {
              return (data.length > 4 ? (value.slice(0, 2) + '...') : value)
            },
            textStyle: {
              color: '#555',
              fontSize: 12,
              textAlign: 'center'
            }
          },
          triggerEvent: true
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '编制数',
            type: 'bar',
            data: bzs
            // barWidth: 30 // 改变柱状图宽度
          },
          {
            name: '现有数',
            type: 'bar',
            data: xys
            // barWidth: 30
          },
          {
            name: '在位数',
            type: 'bar',
            data: zws
            // barWidth: 30
          }
        ]
      })
      // 页面监控宽度的变化
      window.addEventListener('resize', () => {
        myChart2.resize()
      })

      // 就是这个方法，解决y轴鼠标放上提示全部内容
      this.extension(myChart2)
    },
    extension(myChart) {
      // 注意这里，是以X轴显示内容过长为例，如果是y轴的话，需要把params.componentType == 'xAxis'改为xAxis
      // 判断是否创建过div框,如果创建过就不再创建了
      // 该div用来盛放文本显示内容的，方便对其悬浮位置进行处理
      var elementDiv = document.getElementById('extension')
      if (!elementDiv) {
        var div = document.createElement('div')
        div.setAttribute('id', 'extension')
        div.style.display = 'block'
        document.querySelector('html').appendChild(div)
      }
      myChart.on('mouseover', (params) => {
        console.log(params)

        if (params.componentType === 'xAxis') {
          var elementDiv = document.querySelector('#extension')
          // 设置悬浮文本的位置以及样式
          var elementStyle =
              'position: absolute;z-index: 99999;color: #fff;font-size: 12px;padding: 5px;display: inline;border-radius: 4px;background-color: #303133;box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 8px'
          elementDiv.style.cssText = elementStyle
          elementDiv.innerHTML = params.value
          document.querySelector('html').onmousemove = function(event) {
            var elementDiv = document.querySelector('#extension')
            var xx = event.pageX - 10
            var yy = event.pageY + 15
            elementDiv.style.top = yy + 'px'
            elementDiv.style.left = xx + 'px'
          }
        }
      })
      myChart.on('mouseout', (params) => {
        // 注意这里，我是以X轴显示内容过长为例，如果是y轴的话，需要改为yAxis
        if (params.componentType === 'xAxis') {
          var elementDiv = document.querySelector('#extension')

          elementDiv.style.cssText = 'display:none'
        }
      })
    },
    qtPeopleTableDataDraw(data) {
      var myChart3 = this.$echarts.init(
        document.getElementById('myChartNumber3')
      )
      const mc = []
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        mc.push(`${element.personCategory}(${element.astronomicalTime})`)
      }
      const bzs = data.map((item) => {
        return item.establishmentNumber
      })
      const xys = data.map((item) => {
        return item.existingNumber
      })
      const zws = data.map((item) => {
        return item.reignNumber
      })
      myChart3.setOption({
        legend: {},
        tooltip: {},
        grid: {
          top: '10%',
          left: '3%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: mc,
          axisLabel: {
            show: true,
            interval: 0,
            formatter: function(value) {
              return (data.length > 4 ? (value.slice(0, 2) + '...') : value)
            },
            textStyle: {
              color: '#555',
              fontSize: 12,
              textAlign: 'center'
            }
          },
          triggerEvent: true
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '编制数',
            type: 'bar',
            data: bzs
            // barWidth: 30 // 改变柱状图宽度
          },
          {
            name: '现有数',
            type: 'bar',
            data: xys
            // barWidth: 30
          },
          {
            name: '在位数',
            type: 'bar',
            data: zws
            // barWidth: 30
          }
        ]
      })
      // 页面监控宽度的变化
      window.addEventListener('resize', () => {
        myChart3.resize()
      })

      // 就是这个方法，解决y轴鼠标放上提示全部内容
      this.extension(myChart3)
    },
    // 部队后勤柱状图
    hqzbTableDataDraw(data) {
      console.log(data)
      var hqzbChart = this.$echarts.init(
        document.getElementById('hqzbChart')
      )
      // 装备名称
      const equipmentName = data.map((item) => {
        return item.equipmentName
      })
      // 可用数
      const availableNumber = data.map((item) => {
        return item.availableNumber
      })
      // 编制数
      const establishmentNumber = data.map((item) => {
        return item.establishmentNumber
      })
      // 现有数
      const existingNumber = data.map((item) => {
        return item.existingNumber
      })
      // 拟增加数
      const increaseNumber = data.map((item) => {
        return item.increaseNumber
      })
      hqzbChart.setOption({
        legend: {},
        tooltip: {},
        grid: {
          top: '10%',
          left: '3%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: { type: 'category', data: equipmentName },
        yAxis: { type: 'value' },
        series: [
          {
            name: '编制数',
            type: 'bar',
            data: establishmentNumber
          },
          {
            name: '现有数',
            type: 'bar',
            data: existingNumber
          },
          {
            name: '可用数',
            type: 'bar',
            data: availableNumber
          },
          {
            name: '拟增加数',
            type: 'bar',
            data: increaseNumber
          }
        ]
      })
    },
    hqzbMountedTableDataDraw(resDataZB) {
      // console.log(resDataZB)

      var hqzbChart = this.$echarts.init(
        document.getElementById('hqzbChart')
      )
      // // 装备名称
      const equipmentName = resDataZB.map((item) => {
        return item.label
      })
      // // 可用数
      const kys = resDataZB.map((item) => {
        if (item.value !== undefined) {
          return item.value.availableNumber
        }
      })
      const availableNumber = kys.filter(item => item !== undefined)
      // // 编制数
      const bzs = resDataZB.map((item) => {
        if (item.value !== undefined) {
          return item.value.establishmentNumber
        }
      })
      const establishmentNumber = bzs.filter(item => item !== undefined)
      // // 现有数
      const xys = resDataZB.map((item) => {
        if (item.value !== undefined) {
          return item.value.existingNumber
        }
      })
      const existingNumber = xys.filter(item => item !== undefined)
      // // 拟增加数
      const zjs = resDataZB.map((item) => {
        if (item.value !== undefined) {
          return item.value.increaseNumber
        }
      })
      const increaseNumber = zjs.filter(item => item !== undefined)
      hqzbChart.setOption({
        legend: {},
        tooltip: {},
        grid: {
          top: '10%',
          left: '3%',
          right: '5%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: { type: 'category', data: equipmentName,
          axisLabel: {
            show: true,
            interval: 0,
            formatter: function(value) {
              return (resDataZB.length > 4 ? (value.slice(0, 2) + '...') : value)
            },
            textStyle: {
              color: '#555',
              fontSize: 12,
              textAlign: 'center'
            }
          },
          triggerEvent: true },
        yAxis: { type: 'value' },
        series: [
          {
            name: '编制数',
            type: 'bar',
            data: establishmentNumber
          },
          {
            name: '现有数',
            type: 'bar',
            data: existingNumber
          },
          {
            name: '可用数',
            type: 'bar',
            data: availableNumber
          },
          {
            name: '拟增加数',
            type: 'bar',
            data: increaseNumber
          }
        ]
      })
      // 页面监控宽度的变化
      window.addEventListener('resize', () => {
        hqzbChart.resize()
      })
      // 就是这个方法，解决y轴鼠标放上提示全部内容
      this.extension(hqzbChart)
    },
    // 查询树的第一个节点的表列表
    // 递归选择最底层第一个
    getFirstNode(tree) {
      for (let i = 0; i < tree.length; i++) {
        var el = tree[i]
        if (el.childList && el.childList.length > 0) {
          this.getFirstNode(el.childList)
          break
        } else {
          this.firstObj = el
          break
        }
      }
      return this.firstObj
    },
    getFirstTableList(val) {
      const regObj = this.getFirstNode(val)
      this.foceCode = regObj.field
      this.foceSerialNumber = regObj.id
      if (regObj && regObj.field) {
        this.getTableList(regObj.field)
      }
    },
    // 加载装备树
    loadZbTreeNode(node, resolve) {
      const params = {}
      params.equipmentId = node.data ? node.data.id : ''
      API.getEquipmentTreeList(params).then((res) => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          if (node.level === 0) {
            if (data && data.length > 0) {
              this.equipmentCode = data[0].code
              this.currents = this.equipmentCode
              // 默认装备树选中节点
              this.zbCheckedList = [data[0].code]
              this.showLeftTree = true
            } else {
              this.showLeftTree = false
            }
          }
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    //
    radioButton() {
      setTimeout(() => {
        this.currents = this.equipmentCode
      }, 200)
    },
    // 点击装备树
    onHandleClickZbTreeNode(data) {
      this.zhuangbeiData = data
    },
    // 点击树
    nodeClick(data) {
      this.foceCode = data.code
      this.getTableList(data.code)
      this.baseDataModule = null

      // 装备实力
      this.zbdtData = []
      this.getZbdtData().then(res => {
        this.zbdtData = res
      })
      // 弹药情况
      this.dyqkTableData = []
      this.getdyqkTableData().then(res => {
        this.dyqkTableData = res
      })
      this.wzdtTableData = []
      // 物资动态
      this.getWzdtTableData().then(res => {
        this.wzdtTableData = res
      })

      this.activeNames = []
      this.activeName = []
      this.qtactiveName = []
      this.IScode = ''
      this.fxjIScode = ''
      this.qtIScode = ''
      this.zbryIScode = ''
      const para = {
        personType: '01',
        // forceCode: obj.field
        forceCode: data.code
      }
      DataCollectionAPI.professionalsInfo(para).then(res => {
        if (res.code === 200) {
          this.zyryPeopleTableDataDraw(res.data)
        }
      })
      const qtPara = {
        personType: '02',
        // forceCode: obj.field
        forceCode: data.code
      }
      DataCollectionAPI.professionalsInfo(qtPara).then(res => {
        if (res.code === 200) {
          this.qtPeopleTableDataDraw(res.data)
        }
      })
      this.hqzbequipmentTableData = []
      // 部队后勤
      this.gethqzbData().then(res => {
        this.hqzbequipmentTableData = res
      })
      // this.foceCode = obj.field
    }
  }
}
</script>

<style lang="scss" scoped>
.myclass >>>  .collapse-transition{
  -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
  transition: 0s height, 0s padding-top, 0s padding-bottom;
}
.myclass  >>>   .horizontal-collapse-transition{
  -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
  transition: 0s width, 0s padding-left, 0s padding-right;
}
.myclass  >>>   .horizontal-collapse-transition .el-submenu__title .el-submenu__icon-arrow{
  -webkit-transition: 0s;
  transition: 0s;
  opacity: 0;
}
.hqbzClass{
  >>> .el-table__body-wrapper{
    max-height: 200px;
    overflow: auto;
    overflow-x: hidden;
  }
}
>>> .el-collapse-item__arrow{
  display: none;
}

.toEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chart-section {
  width: 50%;
  height: 209px;
}
.allBgc {
  width: 23%;
  height: 40px;
  line-height: 40px;
  margin-left: 18px;
  margin-bottom: 8px;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  background: rgba(31, 125, 215, 0.14);
  .itemsName{
    width: 17%;
  }
  .ziduan{
    width: 77%;height: 31px;line-height: 31px;margin-top: 4px;margin-right: 10px;
    background-color: #1f7dd72b;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.con-one {
  display: flex;
  padding-right: 20px;
  .con-header {
    width: 100%;
    height: 50px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e9eaef;
  }
  .rightContent {
    // width: 1345px;
    // width: 80%;
    height: 100%;
    .tabs-section {
      cursor: pointer;
      width: 100%;
      height: 6%;
      border-bottom: 1px solid #eff0f3;
      display: flex;
      flex-direction: column;
    }
    .con-header {
      width: 100%;
      height: 50px;
      margin-bottom: 20px;
      border-bottom: 1px solid #e9eaef;
    }
    .el-tabs {
      margin-left: 26px;
      height: 45px;
    }

    .big {
      // height: 100%;
      height: calc(100vh - 220px);
      overflow: scroll;
      overflow-x: hidden;
      .forcesSituation,
      .troopsDeployed,
      .responsible,
      .history,
      .personStrength,
      .equipment,
      .turnoutArea,
      .combatReadiness,
      .keyPosition {
        width: 100%;
        // height: 435px; //修改
        background: white;
        border-radius: 10px;
        margin: 0px 0 12px 20px;
        padding-bottom: 25px;
        .jianshu {
          width: 1274px;
          font-size: 14px;
          background: #f7f7f7;
          margin: 0 0 0px 24px;
        }
        .topTitle {
          height: 48px;
          line-height: 54px;
          display: flex;
          font-size: 14px;
          font-weight: bold;
          color: #1f7cd7;
          .leftLine {
            width: 5px;
            height: 16px;
            background: #1f7cd7;
            margin: 19px 11px 0 24px;
          }
        }
        .situationItem {
          width: 23%;
          height: 40px;
          line-height: 40px;
          background: #f0f2f7;
          margin-left: 18px;
          margin-bottom: 8px;
          padding-left: 10px;
          // padding-right: 15px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          .itemsName{
            width: 17%;
          }
          .ziduan{
            width: 77%;height: 31px;line-height: 31px;margin-top: 4px;margin-right: 10px;
            background: #dcdee399;
          }
        }
      }
      .troopsDeployed,
      .responsible,
      .turnoutArea {
        margin: 0px 0 12px 20px;
      }
      .personStrength {
        .el-table {
          width: 1250px;
        }
      }
      .history {
        margin: 0px 0 12px 20px;
        .evolution {

          height: 600px;
          background: #f0f2f7;
          margin-left: 24px;
          overflow-y: scroll;
        }
      }
      .personStrength {
        .el-table {
          margin-left: 24px;
        }
      }
      .equipment {
        margin: 0px 0 12px 20px;
        h5 {
          margin: 0px 0 7px 24px;
        }
        .el-table {
          margin-left: 24px;
        }
      }
      .keyPosition {
        .el-table {
          margin-left: 24px;
        }
        h5 {
          margin: 0px 0 7px 24px;
        }
      }
      .itemsName{
        color: #555;
        // width: 30%;
        width: 17%;
        text-align: right;
        overflow:hidden; /*溢出的部分隐藏*/
        white-space: nowrap; /*文本不换行*/
        text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）；clip：不显示省略标记（...），而是简单的裁切*/
      }
      .ziduan{
        padding-left: 10px;
        font-size: 16px;
        // width: 68%;
        text-align: left;

        overflow:hidden; /*溢出的部分隐藏*/
        white-space: nowrap; /*文本不换行*/
        text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）；clip：不显示省略标记（...），而是简单的裁切*/
      }
    }
  }
}
.button-section{
  padding: 8px 20px;
}
.tree{
  >>> .el-tree-node{
    width:480px;
  }
}
.my-tree {
    background-color: #fff;
    width: 350px;
    height: 100%;
    padding:55px 10px 80px 10px;
    border-radius: 8px;
}
.qiehuanBtn{
  width: 360px;
  height: 40px;
  position: absolute;
  left:20px;
  top: 85px;
  z-index: 1111;
}

</style>
