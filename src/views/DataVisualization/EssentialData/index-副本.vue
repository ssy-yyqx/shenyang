<template>
  <Container own-class="con-one">
    <!-- 搜索框的树 -->
    <NoHeaderTree
      ref="myTree"
      class="tree"
      :tree-data="treeData"
      :tree-props="treeProps"
      @nodeClick="nodeClick"
    />
    <div class="rightContent">
      <!-- 顶部表列表切换   @tab-click="getTableList"-->
      <el-tabs
        v-model="secondLevel"
        type="card"
        closable
        @tab-remove="removeTab"
        @tab-click="jump"
      >
        <el-tab-pane
          v-for="(item) in subTabsList"
          :key="item.label"
          :label="item.label"
          :name="item.label"
          :value="item.value"
        />
      </el-tabs>
      <!-- 导出按钮 -->
      <!-- <el-button type="primary" style="margin-left:20px;margin-bottom:5px;" @click="download">导出<i class="el-icon-download" /></el-button> -->
      <el-button
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
      </el-button>
      <!-- 主体内容部分 -->
      <div class="big" @scroll="onScroll">
        <!-- 部队情况 -->
        <div class="forcesSituation scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队情况</span>

          </div>

          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in bdList"
              :key="'index2'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
            <div class="jianshu">
              <p
                style="
                  line-height: 40px;
                  padding-left: 16px;
                  margin-top: 0;
                  margin-bottom: 0;
                "
              />
              <p
                class="content"
                style="
                  line-height: 25px;
                  margin-bottom: 0;
                  margin-top: 0;
                  padding-right: 16px;
                  padding-left: 16px;
                  -webkit-word-break: break-all;
                  -moz-word-break: break-all;
                  -ms-word-break: break-all;
                  -o-word-break: break-all;
                  word-break: break-all;
                "
              />
            </div>
          </div>
        </div>

        <!-- 部队部署 -->
        <div class="troopsDeployed scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队部署</span>
          </div>

          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in bdbsList"
              :key="'index3'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
            <!-- <div id="map" style="width:300px;height:100px;margin-left:24px;" /> -->
          </div>

        </div>

        <!-- 责任区 -->
        <div class="turnoutArea scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>责任区</span>
          </div>

          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in zrqLIstanbul"
              :key="'index4'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
          </div>
        </div>

        <!-- 担负任务 -->
        <div class="responsible scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>担负任务</span>
          </div>
          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in dfrwList"
              :key="'index5'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
          </div>
          <!-- <div class="jianshu">
            <p
              style="
                line-height: 40px;
                padding-left: 16px;
                margin-top: 0;
                margin-bottom: 0;
              "
            >
              担负任务
            </p>
            <p
              class="content"
              style="margin-top:0;line-height:25px;color:black;font-size:12px;padding-right: 16px;padding-left:16px;-webkit-word-break: break-all;-moz-word-break: break-all;
          -ms-word-break: break-all; -o-word-break: break-all; word-break: break-all;"
            >
              将军事斗争准备基点放在打赢信息化局部战争上，突出海上军事斗争和军事斗争准备，有效控制重大危机，妥善应对连锁反应，坚决捍卫国家领土主权、统一和安全。
            </p>
          </div> -->
        </div>

        <!-- 历史沿革 -->
        <div class="history scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>历史沿革</span>
          </div>
          <pdf ref="pdf" class="evolution" :src="pdfUrl" />
        </div>

        <!-- 人员实力 -->
        <!-- :header-cell-style="{textAlign: 'center'}" -->
        <!-- :cell-style="{ textAlign: 'center' }" -->
        <div class="personStrength scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>人员实力</span>
          </div>
          <el-table
            :data="peopleTableData"
            border
            style="width: 961px; font-size: 14px"
            stripe
            show-summary
            force-scroll="vertical"
          >
            <el-table-column prop="MC" label="人员类别" width="200" />
            <el-table-column prop="BZS" label="编制数" width="200" />
            <el-table-column prop="SYS" label="现有数" width="200" />
            <el-table-column
              prop="ZWS"
              label="在位数"
              width="180"
            />
            <el-table-column
              prop="KCDS"
              label="可出动数"
              width="180"
            />
          </el-table>
        </div>

        <!-- 装备实力 -->
        <div class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>装备实力</span>
          </div>
          <!-- 装备动态情况 -->
          <div class="currentIntelligence">
            <h5>装备动态情况</h5>
            <el-table
              :data="currentTableData"
              border
              style="width: 1274px; font-size: 14px"
              stripe
            >
              <el-table-column prop="equipmentName" label="装备" width="180" />
              <el-table-column
                prop="establishmentNumber"
                label="编制数"
                width="180"
              />
              <el-table-column prop="existingNumber" label="现有数" />
              <el-table-column prop="availableNumber" label="可用数" />
              <el-table-column prop="increaseNumber" label="拟增加数" />
              <el-table-column prop="remark" label="备注" />
            </el-table>
          </div>
          <el-divider />
          <!-- 装备状况 -->
          <div class="currentIntelligence">
            <h5>装备状况</h5>
            <el-table
              :data="zbequipmentTableData"
              border
              style="width: 791px; font-size: 14px"
              stripe
            >
              <el-table-column prop="equipmentName" label="装备" width="180" />
              <el-table-column
                prop="equipmentSituation"
                label="装备状况"
                width="180"
              />
              <el-table-column
                prop="equipmentNumber"
                label="数量"
                width="180"
              />
              <el-table-column prop="remark" label="备注" width="250" />
            </el-table>
          </div>
          <el-divider />
          <!-- 舰艇状况 -->
          <div class="currentIntelligence">
            <h5>舰艇状况</h5>
            <el-table
              :data="warshipTableData"
              border
              style="width: 971px; font-size: 14px"
              stripe
            >
              <el-table-column prop="shipName" label="舰艇舷号" width="180" />
              <el-table-column prop="shipCategory" label="舰艇类别" width="180" />
              <el-table-column prop="shipSituation" label="舰艇状态" width="180" />
              <el-table-column prop="shipNumber" label="数量" width="180" />
              <el-table-column prop="remark" label="备注" width="250" />
            </el-table>
          </div>
        </div>

        <!-- 关键岗位人员信息 -->
        <div class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>关键岗位人员信息</span>
          </div>
          <!-- 人员数量 -->
          <div class="currentIntelligence">
            <h5>人员数量</h5>
            <el-table
              :data="personalNumberTableData"
              border
              style="width: 611px; font-size: 14px"
              stripe
            >
              <el-table-column
                prop="personCategory"
                label="关键岗位人员类别"
                width="180"
              />
              <el-table-column prop="personNumber" label="数量" width="180" />
              <el-table-column prop="remark" label="备注" width="250" />
            </el-table>
          </div>
          <el-divider />
          <!-- 人员类别 -->
          <div class="currentIntelligence">
            <h5>关键岗位人员类别</h5>
            <el-table
              :data="personnelCategoryTableData"
              border
              style="width: 791px; font-size: 14px"
              stripe
            >
              <el-table-column prop="personName" label="姓名" width="180" />
              <el-table-column prop="idCard" label="身份证号码" width="180" />
              <el-table-column
                prop="personCategory"
                label="关键岗位人员类别"
                width="180"
              />
              <el-table-column prop="remark" label="备注" width="250" />
            </el-table>
          </div>
          <el-divider />
          <!-- 指挥员 -->
          <div class="currentIntelligence">
            <h5>指挥员</h5>
            <el-table
              :data="commanderTableData"
              border
              style="width: 981px; font-size: 14px"
              stripe
            >
              <el-table-column prop="chiefCode" label="首长代号" width="180" />
              <el-table-column prop="idCard" label="身份证号码" width="200" />
              <el-table-column prop="job" label="职务" width="200" />
              <el-table-column prop="currentJobLevelTime" label="任现职级时间" width="200" />
              <el-table-column prop="currentJobTime" label="到岗时间" width="200" />
            </el-table>
          </div>
          <el-divider />
          <!-- 飞行员 -->
          <div class="currentIntelligence">
            <h5>飞行员</h5>
            <el-table
              :data="aviatorTableData"
              border
              style="width: 1081px; font-size: 14px"
              stripe
            >
              <el-table-column
                prop="aviatorCode"
                label="飞行员代号"
                width="180"
              />
              <el-table-column prop="idCard" label="身份证号码" width="180" />
              <el-table-column prop="flightLevel" label="飞行水平" width="180" />
              <el-table-column
                prop="flightTechnology"
                label="飞行技术"
                width="180"
              />
              <el-table-column
                prop="flightTotalTime"
                label="飞行总时间(小时)"
                width="180"
              />
              <el-table-column
                prop="currentModelTotalTime"
                label="现架机型时间(小时)"
                width="180"
              />
            </el-table>
          </div>
          <el-divider />
          <!-- 导弹发射营长 -->
          <div class="currentIntelligence">
            <h5>导弹发射营长</h5>
            <el-table
              :data="missileEntityListTableData"
              border
              style="width: 501px; font-size: 14px"
              stripe
            >
              <el-table-column prop="idCard" label="身份证号码" width="250" />
              <el-table-column
                prop="trainingLevel"
                label="训练等级"
                width="250"
              />
            </el-table>
          </div>
          <el-divider />
          <!-- 舰艇长 -->
          <div class="currentIntelligence">
            <h5>舰艇长</h5>
            <el-table
              :data="warshipEntityTableData"
              border
              style="width: 1001px; font-size: 14px"
              stripe
            >
              <el-table-column prop="idCard" label="身份证号码" width="250" />
              <el-table-column
                prop="trainingLevel"
                label="舰长训练等级"
                width="250"
              />
              <el-table-column
                prop="warshipCode"
                label="任职舰艇舷号"
                width="250"
              />
              <el-table-column
                prop="isCurrentJob"
                label="是否当前任职"
                width="250"
              />
            </el-table>
          </div>
          <el-divider />
          <!-- 使用武器情况 -->
          <div class="currentIntelligence">
            <h5>使用武器情况</h5>
            <el-table
              :data="useWeaponsTableData"
              border
              style="width: 751px; font-size: 14px"
              stripe
            >
              <el-table-column prop="idCard" label="身份证号码" width="250" />
              <el-table-column
                prop="weaponsName"
                label="使用武器名称"
                width="250"
              />
              <el-table-column
                prop="isCurrentUse"
                label="是否当前使用"
                width="250"
              />
            </el-table>
          </div>
          <el-divider />
          <!-- 实弹发射情况 -->
          <div class="currentIntelligence">
            <h5>实弹发射情况</h5>
            <el-table
              :data="ammunitionSituationEntityTableData"
              border
              style="width: 1001px; font-size: 14px"
              stripe
            >
              <el-table-column prop="idCard" label="身份证号码" width="250" />
              <el-table-column
                prop="ammunitionName"
                label="发射弹药名称"
                width="250"
              />
              <el-table-column prop="frequency" label="次数" width="250" />
              <el-table-column
                prop="ammunitionNumber"
                label="发射弹药数量(枚)"
                width="250"
              />
            </el-table>
          </div>
        </div>

        <!-- 专业人员 -->
        <div class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>专业人员</span>
          </div>
          <!-- 飞行机组 -->
          <div class="currentIntelligence">
            <h5>飞行机组</h5>
            <el-table
              :data="flightTableData"
              border
              style="width: 721px; font-size: 14px"
              stripe
            >
              <el-table-column
                prop="personCategory"
                label="专业人员类别"
                width="180"
              />
              <el-table-column
                prop="establishmentNumber"
                label="编制数"
                width="180"
              />
              <el-table-column prop="existingNumber" label="现有数" width="180" />
              <el-table-column prop="reignNumber" label="在位数" width="180" />
            </el-table>
          </div>
          <el-divider />
          <!-- 潜艇艇员队 -->
          <div class="currentIntelligence">
            <h5>潜艇艇员队</h5>
            <el-table
              :data="warTableData"
              border
              style="width: 721px; font-size: 14px"
              stripe
            >
              <el-table-column
                prop="personCategory"
                label="专业人员类别"
                width="180"
              />
              <el-table-column
                prop="establishmentNumber"
                label="编制数"
                width="180"
              />
              <el-table-column
                prop="existingNumber"
                label="现有数"
                width="180"
              />
              <el-table-column
                prop="reignNumber"
                label="在位数"
                width="180"
              />
            </el-table>
          </div>
        </div>

        <!-- 物资动态情况 -->
        <div class="personStrength scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>物资动态情况</span>
          </div>
          <el-table
            :data="wzdtTableData"
            border
            style="width: 1201px; font-size: 14px"
            stripe
            show-summary
          >
            <el-table-column
              prop="suppliesCategory"
              label="物资类别"
              width="200"
            />
            <el-table-column prop="carryingAmount" label="携行量" width="200" />
            <el-table-column prop="runAmount" label="运行量" width="200" />
            <el-table-column prop="addAmount" label="加大量" width="200" />
            <el-table-column prop="consumption" label="消耗量" width="200" />
            <el-table-column prop="transshipment" label="补充量" width="200" />
          </el-table>
        </div>

        <!-- 弹药情况 -->
        <div class="personStrength scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>弹药情况</span>
          </div>
          <el-table
            :data="dyqkTableData"
            border
            style="width: 1261px; font-size: 14px"
            stripe
            show-summary
          >
            <el-table-column prop="zbnm" label="弹药类别" width="180" />
            <el-table-column prop="dyzt" label="弹药状态" width="180" />
            <el-table-column prop="amount" label="数量" width="150" />
            <el-table-column prop="carryingAmount" label="携行量" width="150" />
            <el-table-column prop="runAmount" label="运行量" width="150" />
            <el-table-column prop="addAmount" label="加大量" width="150" />
            <el-table-column prop="consumption" label="消耗量" width="150" />
            <el-table-column prop="transshipment" label="补充量" width="150" />
          </el-table>
        </div>

        <!-- 指挥机构 -->
        <div class="forcesSituation scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>指挥机构</span>
          </div>
          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in zhjgList"
              :key="'index6'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
          </div>
          <el-divider />
          <!-- <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              class="situationItem"
              v-for="(item, index) in zhjgList"
              :key="index"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
          </div> -->
        </div>

        <!-- 战备水平-->
        <div class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>战备水平</span>
          </div>
          <!-- 基本情况 -->
          <h5>基本情况</h5>
          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in jbqkList"
              :key="'index7'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
          </div>
          <el-divider />
          <!-- 机动能力 -->
          <h5>机动能力</h5>
          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in jdnlList"
              :key="'index8'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
          </div>
          <el-divider />
          <!-- 训练水平 -->
          <h5>训练水平</h5>
          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in xlspList"
              :key="'index9'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
            <div class="jianshu">
              <p
                style="
                  line-height: 40px;
                  padding-left: 16px;
                  margin-top: 0;
                  margin-bottom: 0;
                "
              />
              <p
                class="content"
                style="
                  line-height: 25px;
                  margin-bottom: 0;
                  margin-top: 0;
                  padding-right: 16px;
                  padding-left: 16px;
                  -webkit-word-break: break-all;
                  -moz-word-break: break-all;
                  -ms-word-break: break-all;
                  -o-word-break: break-all;
                  word-break: break-all;
                "
              />
            </div>
          </div>
          <el-divider />
          <!-- 战备值班情况 -->
          <div class="currentIntelligence">
            <h5 style="margin: 0 0 10px 24px">战备值班情况</h5>
            <div class="items1" style="display: flex; flex-wrap: wrap">
              <div
                v-for="(item, index) in zbzbList"
                :key="'index10'+index"
                class="situationItem"
              >
                <div class="itemsName" style="font-weight: bold">
                  {{ item.labelName }}
                </div>
                <div class="ziduan">{{ item.value }}</div>
              </div>
            </div>
            <h5>值班人员</h5>
            <el-table
              :data="warPersonTableData"
              border
              style="width: 401px; font-size: 14px; margin-left: 24px"
              stripe
            >
              <el-table-column prop="dutyPersonName" label="姓名" width="200" />
              <el-table-column prop="zbflnm" label="值班分类" width="200" />
            </el-table>
            <h5 style="margin-top: 10px">值班装备</h5>
            <el-table
              :data="warEquipmentTableData"
              border
              style="width: 801px; font-size: 14px; margin-left: 24px"
              stripe
            >
              <el-table-column prop="zbnm" label="装备名称" width="200" />
              <el-table-column prop="amount" label="装备数量" width="200" />
              <el-table-column
                prop="zbdy"
                label="值班弹药"
                width="200"
              />
              <el-table-column
                prop="dyamount"
                label="弹药数量"
                width="200"
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
              style="width: 501px; font-size: 14px"
              stripe
            >
              <el-table-column prop="dznm" label="弹种" width="250" />
              <el-table-column prop="amount" label="数量" width="250" />
            </el-table>
          </div>
        </div>

        <!-- 后装保障体系 -->
        <div class="forcesSituation scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>后装保障体系</span>
          </div>
          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in hzbzList"
              :key="'index11'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
          </div>
          <el-table
            :data="defenceEquipmentTableData"
            border
            style="width: 501px; font-size: 14px; margin-left: 24px"
            stripe
          >
            <el-table-column prop="equipmentName" label="防卫力量主要装备" width="250" />
            <el-table-column prop="equipmentNumber" label="数量" width="250" />
          </el-table>
        </div>

        <!-- 部队后勤 -->
        <div class="equipment scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队后勤</span>
          </div>
          <!-- 干部供应 -->
          <div class="currentIntelligence">
            <h5>干部供应</h5>
            <el-table
              :data="cadreSupplyTableData"
              border
              style="width: 401px; font-size: 14px"
              stripe
            >
              <el-table-column prop="level" label="军衔" width="200" />
              <el-table-column prop="currentNumber" label="现有数" width="200" />
            </el-table>
          </div>
          <el-divider />
          <!-- 士兵供应 -->
          <div class="currentIntelligence">
            <h5>士兵供应</h5>
            <el-table
              :data="soldiersSupplyTableData"
              border
              style="width: 401px; font-size: 14px"
              stripe
            >
              <el-table-column prop="level" label="职务级别" width="200" />
              <el-table-column prop="currentNumber" label="现有数" width="200" />
            </el-table>
          </div>
          <el-divider />
          <!-- 后勤装备 -->
          <div class="currentIntelligence">
            <h5>后勤装备</h5>
            <el-table
              :data="equipmentTableData"
              border
              style="width: 921px; font-size: 14px"
              stripe
            >
              <el-table-column
                prop="equipmentName"
                label="装备名称"
                width="200"
              />
              <el-table-column
                prop="establishmentNumber"
                label="编制数"
                width="180"
              />
              <el-table-column prop="existingNumber" label="现有数" width="180" />
              <el-table-column prop="availableNumber" label="可用数" width="180" />
              <el-table-column prop="increaseNumber" label="拟增加数" width="180" />
            </el-table>
          </div>
        </div>

        <!-- 部队军标 -->
        <div class="forcesSituation scroll-item">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队军标</span>
          </div>
          <div class="items1" style="display: flex; flex-wrap: wrap">
            <div
              v-for="(item, index) in bdjbTableData"
              :key="'index12'+index"
              class="situationItem"
            >
              <div class="itemsName" style="font-weight: bold">
                {{ item.labelName }}
              </div>
              <div class="ziduan">{{ item.value }}</div>
            </div>
          </div>
        </div>
        <!-- 部队媒体 -->
        <div class="forcesSituation scroll-item" style="margin-bottom: 0px">
          <div class="topTitle">
            <div class="leftLine" />
            <span>部队媒体</span>
          </div>
          <img
            :src="bdmtTableData"
            alt=""
            style="width: 500px; height: 500px; margin-left: 24px"
          >
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import * as API from '@/api/index'
import pdf from 'vue-pdf'
import Container from '@/components/Container'
// import Containertwo from '@/components/ContainerTwo'
import NoHeaderTree from '@/components/NoHeaderTree'
export default {
  name: 'Pdf',
  components: { Container, NoHeaderTree, pdf },
  data() {
    return {
      foceCode: '',
      // indexList: 0,
      pdfUrl: '',
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
          label: '部队情况'
        },
        {
          vlaue: '2',
          type: 'bdbs',
          label: '部队部署'
        },
        {
          vlaue: '3',
          type: 'zrq',
          label: '责任区'
        },
        {
          vlaue: '4',
          type: 'dfrw',
          label: '担负任务'
        },
        {
          vlaue: '5',
          type: 'lsyg',
          label: '历史沿革'
        },
        {
          vlaue: '6',
          type: 'rysl',
          label: '人员实力'
        },
        {
          vlaue: '7',
          type: 'zbsl',
          label: '装备实力'
        },
        {
          vlaue: '8',
          type: 'ggry',
          label: '关键岗位人员'
        },
        {
          vlaue: '9',
          type: 'zyry',
          label: '专业人员'
        },
        {
          vlaue: '10',
          type: 'wzdt',
          label: '物资动态'
        },
        {
          vlaue: '11',
          type: 'dyqk',
          label: '弹药情况'
        },
        {
          vlaue: '12',
          type: 'zhjgqk',
          label: '指挥机构'
        },
        {
          vlaue: '13',
          type: 'zbsp',
          label: '战备水平'
        },
        {
          vlaue: '14',
          type: 'hzbz',
          label: '后装保障体系'
        },
        {
          vlaue: '15',
          type: 'bdhq',
          label: '部队后勤'
        },
        {
          vlaue: '16',
          type: 'bdjb',
          label: '部队军标'
        },
        {
          vlaue: '17',
          type: 'bdmt',
          label: '部队媒体'
        }
      ],
      secondLevel: '部队情况',

      onLineDataList: [],
      tableName: undefined,

      peopleTableData: [], // 人员实力   表格内容
      currentTableData: [], // 装备动态情况表格内容
      warshipTableData: [], // 装备动态舰艇
      zbequipmentTableData: [], // 装备状况

      personalNumberTableData: [], // 关键岗位人员信息
      personnelCategoryTableData: [], // 人员类别
      commanderTableData: [], // 指挥员
      aviatorTableData: [], // 飞行员
      missileEntityListTableData: [], // 导弹发射营长
      warshipEntityTableData: [], // 舰艇长
      useWeaponsTableData: [], // 使用武器情况
      ammunitionSituationEntityTableData: [], // 实弹发射情况
      defenceEquipmentTableData: [], // 后装保障表格

      flightTableData: [], // 飞行机组人员
      warTableData: [], // 潜艇艇员队

      wzdtTableData: [], // 动态物资情况

      dyqkTableData: [], // 弹药情况
      cadreSupplyTableData: [], // 干部供应
      soldiersSupplyTableData: [], // 士兵供应
      equipmentTableData: [], // 后勤装备

      bdjbTableData: [], // 部队军标
      bdmtTableData: '', // 部队媒体
      hzbzList: [], // 后装保障item

      tableData: [],
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
      tabIndex: 0 // 动态切换导航栏
    }
  },
  created() {
    // 获取树数据
    this.getTreeList()
  },
  mounted() {
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
    // 导出
    download() {
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
      // console.log(tab);
      this.secondLevel = tab.label
      // console.log(this.secondLevel);
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
      const deleteTab = this.subTabsList.findIndex((item) => item.label === targetName)
      const scrollItems = document.querySelectorAll('.scroll-item')
      // console.log(scrollItems);
      const deleteDom = scrollItems[deleteTab]
      deleteDom.parentNode.removeChild(deleteDom)// 删除dom节点
      // console.log(deleteDom);
      // deleteDom.style.display = 'none'
      const tabs = this.subTabsList
      let activeName = targetName
      if (activeName === targetName) {
        tabs.forEach((tab, i) => {
          // console.log(tab.label, targetName);
          if (tab.label === targetName) {
            const nextTab = tabs[i + 1] || tabs[i - 1]
            if (nextTab) {
              activeName = nextTab.value
            }
          }
        })
      }
      this.secondLevel = activeName
      this.subTabsList = tabs.filter(tab => tab.label !== targetName)
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
              this.bdList = data
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
              this.bdbsList = data
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
              this.zrqLIstanbul = data
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
              this.dfrwList = data
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
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'zbsl') {
          const params = {
            bdnm: id,
            type: this.type[6].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.currentTableData = data.equipmentDynamicEntityList
              this.zbequipmentTableData = data.equipmentSituationEntityList
              this.warshipTableData = data.warshipSituationEntityList
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'ggry') {
          const params = {
            bdnm: id,
            type: this.type[7].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.personalNumberTableData = data.keyPersonStatisticsEntityList
              this.personnelCategoryTableData =
                data.keyPersonCategoryEntityList
              this.commanderTableData = data.commanderEntityList
              this.aviatorTableData = data.aviatorEntityList
              this.missileEntityListTableData = data.missileEntityList
              this.warshipEntityTableData = data.warshipEntityList
              this.useWeaponsTableData = data.useWeaponsEntityList
              this.ammunitionSituationEntityTableData =
                data.ammunitionSituationEntityList
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'zyry') {
          const params = {
            bdnm: id,
            type: this.type[8].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.flightTableData = data.flightList
              this.warTableData = data.warshipList
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'wzdt') {
          const params = {
            bdnm: id,
            type: this.type[9].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.wzdtTableData = data
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'dyqk') {
          const params = {
            bdnm: id,
            type: this.type[10].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.dyqkTableData = data
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'zhjgqk') {
          const params = {
            bdnm: id,
            type: this.type[11].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.zhjgList = data
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
              this.jbqkList = data.warPreLevelList
              this.xlspList = data.warPreTrainingLevelList
              this.maxAmmunitiTableData = data.warPreMaxWithAmmunitionList
              this.zbzbList = data.warPreDutyCaseList
              this.warPersonTableData = data.warPreDutyPersonnelList
              this.warEquipmentTableData = data.warPreDutyEquipmentList
              this.jdnlList = data.warPreMobilityList
            } else {
              this.$message.error(msg)
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
              this.hzbzList = data.defencePowerList
              this.defenceEquipmentTableData = data.defenceEquipmentEntityList
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'bdhq') {
          const params = {
            bdnm: id,
            type: this.type[14].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.soldiersSupplyTableData = data.soldiersSupplyList
              this.cadreSupplyTableData = data.cadreSupplyList
              this.equipmentTableData = data.equipmentList
            } else {
              this.$message.error(msg)
            }
          })
        } else if (item === 'bdjb') {
          const params = {
            bdnm: id,
            type: this.type[15].types
          }
          API.getBassData(params, id, item).then(res => {
            const { code, data, msg } = res
            if (String(code) === '200') {
              this.bdjbTableData = data
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
                this.bdmtTableData =
                  `data:image/jpeg;base64,` + data[0].mediaContent
              }
            } else {
              this.$message.error(msg)
            }
          })
        }
      })
    },
    // 获取树列表
    getTreeList() {
      API.getTreeList().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeData = data
          console.log(data)
          this.$refs.myTree.setChecks(this.treeData)
          this.getFirstTableList(this.treeData)
        } else {
          this.$message.error(msg)
        }
      })
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
      console.log(regObj)
      this.foceCode = regObj.field
      console.log(this.foceCode)
      if (regObj && regObj.field) {
        this.getTableList(regObj.field)
      }
    },
    // 点击树
    nodeClick({ obj, node, tree }) {
      // console.log(obj.field)
      // 判断父节点是否可选
      // if (obj.childList === null || obj.childList.length === 0) {
      this.getTableList(obj.field)
      this.foceCode = obj.field
      console.log(this.foceCode)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
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
    width: 1345px;
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
      height: calc(100vh - 185px);
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
        width: 1322px;
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
          width: 300px;
          height: 40px;
          line-height: 40px;
          background: #f0f2f7;
          margin-left: 24px;
          margin-bottom: 8px;
          padding-left: 15px;
          padding-right: 15px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
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
      // .troopsDeployed{
      //   .items1{
      //     #map>>>.mapboxgl-ctrl-bottom-right{
      //             // display: none !important;
      //       }
      //   }
      // }
      .history {
        margin: 0px 0 12px 20px;
        .evolution {
          width: 1274px;
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
    }
  }
}
</style>
