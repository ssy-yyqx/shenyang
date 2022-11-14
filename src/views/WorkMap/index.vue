<template>
  <Container id="map">
    <div
      v-loading="loading2"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.001)"
      style="margin-bottom:12px;height:100%;width:100%;"
    >
      <MapOl
        ref="MapOl"
        :tools="mapTools"
        :img-path="imgPath"
        :mouse-clicks="mouseClicks"
        :is-add-popup="true"
        :left-top-x="leftTopX"
        :left-top-y="leftTopY"
        :rect-width="RectWidth"
        :rect-height="RectHeight"
        oncontextmenu="event.preventDefault()"
        @featureMarkerLayer="featureMarkerLayer"
        @changeRotation="changeRotation"
        @searchByRange="searchByRange"
        @signs="signs"
      />
      <div id="distance" class="distance-container" />
      <el-button class="junbiao" @click="sign">军标</el-button>

      <!-- 查询经纬度 -->
      <!--
            <div style="position: absolute;left: 772px;top: 66px;z-index: 1;color:#fff">
              <el-form :inline="true" :model="formInline" class="demo-form-inline" style="display: flex;">
                <el-form-item label="经度：" style="display: flex;">
                  <el-input v-model="formInline.JD" placeholder="经度"></el-input>
                </el-form-item>
                <el-form-item label="纬度：" style="display: flex;" class="demo-form-inline-item">
                  <el-input v-model="formInline.WD" placeholder="纬度"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="fly"></el-button>
                </el-form-item>
              </el-form>
            </div>
        -->

      <div class="left">
        <el-radio-group v-model="secondRadio" style="margin-bottom:10px;" size="medium" @change="secondRadioChange">
          <el-radio-button label="我方" />
          <el-radio-button label="敌方" />
        </el-radio-group>
        <div v-if="secondRadio=='我方'">
          <div class="suppliabledif">
            <!-- 地区 -->
            <div class="box" @click="clear">
              <el-button type="primary" style="height:34px">地区</el-button>
              <el-cascader
                ref="demoCascaderArea"
                v-model="suppliableValues"
                class="leftTopSelect"
                :options="optionss"
                :props="prop"
                clearable
                collapse-tags
                @change="handleChange"
              />
            </div>
          </div>
          <div style="width: 285px;height:500px;overflow-y:auto;scrollbar-width:thin;">
            <el-collapse v-model="activeNames" style="width: 100%">
              <!-- 作战力量 -->
              <el-collapse-item style="padding:5px;background:white;padding-bottom:0px;">
                <template slot="title">
                  <i>作战力量</i>
                  <el-popover
                    v-model="visiblePopover"
                    placement="right-start"
                    width="300"
                    trigger="click"
                  >
                    <!-- 下拉框 -->
                    <el-form ref="form" :model="formDetails" label-width="80px">
                      <el-form-item label="建制" style="margin-bottom:18px;">
                        <el-cascader
                          ref="demoCascaderZZLL"
                          v-model="formDetails.JZLBNM"
                          :options="fightData.JZLBNM"
                          :props="optionProps"
                          :show-all-levels="false"
                          collapse-tags
                          placeholder="请选择建制"
                          @change="handleChangeCascader"
                        />
                      </el-form-item>
                      <el-form-item label="级别" style="margin-bottom:18px;">
                        <el-cascader
                          ref="demoCascaderBDJB"
                          v-model="formDetails.BDJBNM"
                          :options="fightData.BDJBNM"
                          :props="optionProps"
                          :show-all-levels="false"
                          collapse-tags
                          placeholder="请选择级别"
                          @change="changeBDJB"
                        />
                      </el-form-item>
                      <el-form-item label="兵种" style="margin-bottom:18px;">
                        <el-cascader
                          ref="demoCascaderBZNM"
                          v-model="formDetails.BZNM"
                          :options="fightData.BZNM"
                          :props="optionProps"
                          :show-all-levels="false"
                          collapse-tags
                          placeholder="请选择兵种"
                          @change="changeBZNM"
                        />
                      </el-form-item>
                      <el-form-item label="编成分类" style="margin-bottom:18px;">
                        <el-cascader
                          ref="demoCascaderBCLBXF"
                          v-model="formDetails.BCLBXFNM"
                          :options="fightData.BCLBXFNM"
                          :props="optionProps"
                          :show-all-levels="false"
                          collapse-tags
                          placeholder="请选择编成分类"
                          @change="changeBCLBXFNM"
                        />
                      </el-form-item>
                      <el-form-item label="编成类别" style="margin-bottom:18px;">
                        <el-cascader
                          ref="demoCascaderBCLB"
                          v-model="formDetails.BCLBNM"
                          :options="fightData.BCLBNM"
                          :props="optionProps"
                          :show-all-levels="false"
                          collapse-tags
                          placeholder="请选择编成类别"
                          @change="changeBCLBNM"
                        />
                      </el-form-item>
                      <el-form-item label="部队类别" style="margin-bottom:18px;">
                        <el-cascader
                          ref="demoCascaderBD"
                          v-model="formDetails.BDLBNM"
                          :options="fightData.BDLBNM"
                          :props="optionProps"
                          :show-all-levels="false"
                          collapse-tags
                          placeholder="请选择部队类别"
                          @change="changedemoCascaderBD"
                        />
                      </el-form-item>
                      <div style="display:flex;justify-content: flex-end;">
                        <el-button plain size="mini" @click="cancel('作战力量')">取消</el-button>

                      </div>
                    </el-form>

                    <i slot="reference" class="header-icon el-icon-tickets" style="margin-left:180px;" />
                  </el-popover>
                </template>
                <div>
                  <el-checkbox-group
                    v-model="allQueryArmy"
                    @change="handleCheckedQueryArmyChange"
                  >
                    <el-checkbox
                      v-for="(item, index) in queryArmy"
                      :key="index"
                      class="elCheckBox"
                      :label="item"
                    >{{ item }}</el-checkbox>
                  </el-checkbox-group>
                  <div>
                    <el-button size="mini" style="margin-left:135px;" @click="resetCheckBox('作战力量')">清空</el-button>
                    <el-button type="primary" size="mini" @click="getForceData">查询</el-button>
                  </div>
                </div>
              </el-collapse-item>
              <!-- 战备工程 -->
              <el-collapse-item style="padding:5px;background:white;padding-bottom:0px;">
                <template slot="title">
                  <i>战备工程</i>
                  <el-popover
                    v-model="visiblePopoverZBGC"
                    placement="right-start"
                    width="300"
                    trigger="click"
                  >
                    <!-- 下拉框 -->
                    <el-form ref="form" :model="formCombatData" label-width="80px">
                      <el-form-item label="保护区">
                        <el-cascader
                          ref="demoCascaderBHQ"
                          v-model="formCombatData.BHQNM"
                          :options="fightDataformCombat.BHQNM"
                          :props="optionPropsCombat"
                          :show-all-levels="false"
                          collapse-tags
                          placeholder="请选择建制"
                          @change="changeCascaderBHQ"
                        />
                      </el-form-item>
                      <div style="display:flex;justify-content: flex-end;">
                        <el-button plain size="mini" @click="cancel('战备工程')">取消</el-button>
                      </div>

                    </el-form>

                    <i slot="reference" class="header-icon el-icon-tickets" style="margin-left:180px;" />
                  </el-popover>
                </template>
                <div>
                  <el-checkbox-group
                    v-model="allElection"
                    @change="handleCheckedCitiesChange"
                  >
                    <el-checkbox
                      v-for="(item, index) in engineering"
                      :key="index"
                      class="engineeringCheckbox"
                      :label="item"
                    >{{ item }}</el-checkbox>
                  </el-checkbox-group>
                </div>

                <div>
                  <el-button size="mini" style="margin-left:135px;" @click="resetCheckBox('战备工程')">清空</el-button>
                  <el-button type="primary" size="mini" @click="getWarEngineerings">查询</el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item style="padding:5px;background:white;padding-bottom:0px;">
                <template slot="title">
                  <i>战场环境</i>
                </template>
                <div>
                  <el-checkbox-group
                    v-model="allEnvironment"
                    @change="environments"
                  >
                    <el-checkbox
                      v-for="(item, index) in environment"
                      :key="index"
                      class="environmentCheckbox"
                      :label="item.label"
                    >{{ item.label }}</el-checkbox>
                  </el-checkbox-group>
                </div>

                <div>
                  <el-button size="mini" style="margin-left:135px;" @click="resetCheckBox('战场环境')">清空</el-button>
                  <el-button type="primary" size="mini" @click="zchjClick">查询</el-button>
                </div>

              </el-collapse-item>
              <el-collapse-item style="padding:5px;background:white;padding-bottom:0px;">
                <template slot="title">
                  <i>后勤保障</i>
                </template>
                <div>
                  <el-checkbox-group
                    v-model="allSupport"
                    @change="allSupports"
                  >
                    <el-checkbox
                      v-for="(item, index) in support"
                      :key="item.NM"
                      class="supportCheckBox"
                      :label="item.label"
                    >{{ item.label }}</el-checkbox>
                  </el-checkbox-group>
                </div>

                <div>
                  <el-button size="mini" style="margin-left:135px;" @click="resetCheckBox('后勤保障')">清空</el-button>
                  <el-button type="primary" size="mini" @click="hqbzClick">查询</el-button>
                </div>

              </el-collapse-item>
              </el-collapse-item>
              <el-collapse-item title="态势数据" style="padding:5px;background:white;padding-bottom:0px;">
                <template slot="title">
                  <i>态势数据</i>
                </template>
                <el-radio-group v-model="radioTime" size="mini" style="margin-left:80px;" @change="radioChange">
                  <el-radio-button label="实时" />
                  <el-radio-button label="历史" />
                </el-radio-group>
                <!-- 实时 -->
                <!--
                    <el-checkbox-group v-model="checkNow" v-if="radioTime==='实时'" style="margin-top:10px;" @change="handleCheckChange">
                    <el-checkbox
                      v-for="(item, index) in checkNowEng"
                      :key="item.NM"
                      class="supportCheckBox"
                      :label="item.label"
                    >{{ item.label }}</el-checkbox>
                  </el-checkbox-group>
                  -->
                <br>
                <div v-for="(item, index) in checkNowEng" v-if="radioTime==='实时'" :key="item.NM" style="margin-top:10px;display:inline-block;margin-left:10px;">
                  <el-checkbox v-model="item.checkeds" :checked="item.checkeds" @change="handleCheckChange(item.NM,$event)">{{ item.label }}</el-checkbox>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div v-if="secondRadio=='敌方'">
          <div class="suppliabledif">
            <!-- 地区 -->
            <div class="box" style="height: 47px;" @click="clear">
              <el-button type="primary" style="height: 34px;">国家/地区</el-button>
              <el-cascader
                ref="demoCascaderAreaSeond"
                v-model="suppliableValues"
                class="leftTopSelect"
                :options="optionssSecond"
                :props="prop"
                clearable
                collapse-tags
                @change="handleChangeSecond"
              />
            </div>
          </div>
          <div style="width: 280px;height:500px;overflow-y:auto;">
            <el-collapse style="width: 100%">
              <!-- 目标种类-->
              <el-collapse-item style="padding:5px;background:white;padding-bottom:0px;">
                <template slot="title">
                  <i>目标种类</i>
                </template>
                <div>
                  <el-checkbox-group
                    v-model="allSeond"
                    @change="secondChange"
                  >
                    <el-checkbox
                      v-for="(item, index) in secondQueryArmy"
                      :key="index"
                      class="elCheckBox"
                      :label="item.XH"
                    >{{ item.MC }}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <el-button type="primary" size="mini" style="margin-left:200px;" @click="secondChangeSearch">查询</el-button>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>

      <div v-if="radioTime==='历史' && secondRadio === '我方'" class="table">
        <div class="tableTop">
          <el-radio-group v-model="condition" style="margin:5px 0px 9px 10px;;" size="mini" @change="onChangeTab">
            <el-radio-button label="seaCondition">海情</el-radio-button>
            <el-radio-button label="airCondition">空情</el-radio-button>
            <el-radio-button label="dipper">北斗</el-radio-button>
          </el-radio-group>
          <el-checkbox v-model="wzChecked" class="WZcheck">伪装</el-checkbox>
          <i
            :class="{'el-icon-d-arrow-left':true, 'showTableIcon': bShowTable,'hideTableIcon': !bShowTable}"
            @click="showTable()"
          />
        </div>
        <!-- 显示海情、空情、北斗信息的表格 -->
        <div v-show="bShowTable">
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            :height="350"
            border
            style="width: 100%;"
            :header-cell-style="{background:'#1f7cd7',color:'#fff'}"
            @row-click="tabRowClick"
            @select="onSelectTableRow"
            @select-all="onSelectTableRowAll"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" :index="indexMethod" type="index" width="50" align="center" />
            <el-table-column
              v-for="(item,index) in tableColumn"
              :key="index"
              :min-width="item.label.length*15+30"
              :label="item.label"
              :prop="item.prop"
              sortable
              show-overflow-tooltip
              align="center"
            />
            <!-- <el-table-column
              v-for="(item,index) in tableColumn"
              :key="index"
              :min-width="item.label.length*15+30"
              :label="item.label"
              :prop="item.prop"
              show-overflow-tooltip
              align="center"
              :render-header="renderHeader"
            /> -->
          </el-table>
          <div class="pager-section" style="text-align: end;">
            <el-pagination
              :current-page="pager.pageNum"
              :page-size="pager.pageSize"
              layout="total, prev, pager, next"
              :total="pager.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
        <!-- 点击行弹出的表格 -->
        <div>
          <el-dialog v-dialogDrag custom-class="qiefen-dialog-class" title="态势信息" :visible.sync="dialogTableVisible" :modal="false">
            <el-table
              border
              :data="rowData"
              :header-cell-style="{background:'#1f7cd7',color:'#fff'}"
              height="370px"
            >
              <el-table-column
                v-for="(item,index) in rowColumn"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                align="center"
              />
            </el-table>
            <!-- <span slot="footer" class="dialog-footer">
              <el-button @click="dialogTableVisible = false">关闭</el-button>
            </span> -->
          </el-dialog>
        </div>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="qiefen-dialog-class"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
          <el-form-item :label="innerText" prop="text">
            <el-date-picker
              v-if="innerText==='最后收到报文时间' || innerText==='发现时间' || innerText==='首点时间' || innerText==='接收时间'"
              v-model="ruleForm.text"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
            <el-input v-else v-model="ruleForm.text" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 详情 -->
      <el-dialog
        title="详情信息"
        custom-class="qiefen-dialog-class"
        :visible.sync="dialogVisibleDetils"
        width="60%"
        :before-close="closeDialogVisibleDetils"
      >

        <!-- 战备工程基本信息 -->
        <div v-if="pointTypes === &quot;2&quot; && pointTypes !== &quot;&quot;" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            基本信息
          </span>
          <div class="bottom" style="display:flex;justify-content: space-between;flex-wrap:wrap;">
            <p style="width:24%;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">名称：{{ allDataList.ZBGCMC?allDataList.ZBGCMC:"暂无" }}</p>
            <p style="width:24%;">代号：{{ allDataList.JBDZ?allDataList.JBDZ:"暂无" }}</p>
            <p style="width:24%;">工程分类：{{ allDataList.GCFLNM?allDataList.GCFLNM:"暂无" }}</p>
            <p style="width:24%;">竣工时间：{{ allDataList.JGSJ?allDataList.JGSJ:"暂无" }}</p>
            <p style="width:24%;">保护区：{{ allDataList.BHQNM?allDataList.BHQNM:"暂无" }}</p>
            <p style="width:24%;">经度：{{ allDataList.JD?allDataList.JD:"暂无" }}</p>
            <p style="width:24%;">纬度：{{ allDataList.WD?allDataList.WD:"暂无" }}</p>
            <p style="width:24%;">高程：{{ allDataList.GC?allDataList.GC:"暂无" }}</p>
            <p style="width:24%;">位置：{{ allDataList.DMNM }}{{ allDataList.KZDM }}</p>
          </div>
          <el-divider />
          <!-- 扩展信息 -->
          <div v-if="kzxxData.length!='0'">
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              {{ allDataList.GCFLNM }}信息
            </span>
            <div v-if="kzxxData && kzxxData.length > 0" class="bottom">
              <p v-for="(item,index) in kzxxData" v-if="item && Object.keys(item).length>0" :key="index" style="display:inline-block;width:28%;">{{ item.key }}: {{ item.value }}</p>
            </div>
            <el-divider />
          </div>
          <!-- 所在防护责任区 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
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
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
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
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              跑道方向（度分秒）
            </span>
            <div v-if="msxxData.PDFX && msxxData.PDFX.length > 0" class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ msxxData.PDFX[0].value }}</div>
            <p v-else>暂无</p>
          </div>
          <el-divider />
          <!-- 油库容量 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              油库容量
            </span>
            <div v-if="msxxData.YKRL && msxxData.YKRL.length > 0" class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ msxxData.YKRL[0].value }}</div>
            <p v-else>暂无</p>
          </div>
          <el-divider />
          <!-- 配套情况 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              配套情况
            </span>
            <div v-if="msxxData.PTQK && msxxData.PTQK.length > 0" class="bottom" style="padding-bottom:15px;padding-top:10px;">
              {{ msxxData.PTQK[0].value }}
            </div>
            <p v-else>暂无</p>
          </div>
          <el-divider />
          <!-- 简述 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              简述
            </span>
            <div v-if="msxxData.JS && msxxData.JS.length > 0" class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ msxxData.JS[0].value }}</div>
            <p v-else>暂无</p>
          </div>
          <el-divider />
          <!-- 媒体信息 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              媒体信息
            </span>

            <el-carousel v-if="msxxData.MTXX && msxxData.MTXX.length > 0" height="250px" style="width:60%;margin:auto">
              <el-carousel-item v-for="(item,index) in msxxData.MTXX" :key="index">
                <img :src="item.mtdx" style="width:100%;height:100%" :title="item.fileName">
              </el-carousel-item>
            </el-carousel>
            <p v-else>暂无</p>
          </div>
        </div>
        <!-- 作战力量信息-->
        <div v-if="pointTypes === &quot;1&quot;" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            基本信息
          </span>
          <div class="bottom zzlldetail" style="display:flex;flex-wrap:wrap;">
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
          <el-divider />
          <!--担负任务-->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              担负任务
            </span>
            <div v-for="item in zzllDetailsDFRW" :key="item.BDNM_KEY" class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ item.DFRW? item.DFRW : "暂无" }}</div>

          </div>
          <el-divider />
          <!--简述-->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
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
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              媒体信息
            </span>
            <div class="bottom">
              <el-carousel v-if="zzllMTXX && zzllMTXX.length > 0" height="250px" style="width:60%;margin:auto">
                <el-carousel-item v-for="(item,index) in zzllMTXX" :key="index">
                  <img :src="'data:image/jpeg;base64,'+ item.mtdx" style="width:100%;height:100%" :title="item.fileName">
                </el-carousel-item>
              </el-carousel>
              <p v-else>暂无</p>
            </div>
          </div>
        </div>
        <!-- 后勤保障 -->
        <div v-if="pointTypes === &quot;3&quot;" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
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
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
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
            <span
              v-if="hqbzValue==='YK'"
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              油库信息
            </span>
            <div class="bottom">
              <p v-for="(item,index) in hqbzDetailkzxxData" :key="index" style="display:inline-block;width:24%;">{{ item.key }}: {{ item.value }}</p>
            </div>
            <el-divider />
          </div>
          <!--简述-->
          <div v-if="HQBZmsxxData">
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              简述
            </span>
            <div class="bottom" style="padding-bottom:15px;padding-top:10px;">{{ HQBZmsxxData.value ? HQBZmsxxData.value : "暂无" }}</div>
          </div>
          <el-divider />
          <!-- 媒体信息 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              媒体信息
            </span>
            <div class="bottom">
              <el-carousel v-if="hqbzMTXX && hqbzMTXX.length > 0" height="250px" style="width:60%;margin:auto">
                <el-carousel-item v-for="(item,index) in hqbzMTXX" :key="index">
                  <img :src="'data:image/jpeg;base64,'+ item.mtdx" style="width:100%;height:100%" :title="item.fileName">
                </el-carousel-item>
              </el-carousel>
              <p v-else>暂无</p>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="closeDialogVisibleDetils">关 闭</el-button>
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
        <div v-if="pointTypes==='4'" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            基本信息
          </span>
          <div class="bottom" style="display:flex;flex-wrap:wrap;">
            <p style="width:50%;">名称：{{ zchjDetailsData.MC }}</p>
            <p style="width:50%;">序号：{{ zchjDetailsData.XH }}</p>
            <p style="width:50%;">经度：{{ zchjDetailsData.JD }}</p>
            <p style="width:50%;">纬度：{{ zchjDetailsData.WD }}</p>
            <p style="width:50%;">高程(米)：{{ zchjDetailsData.GC }}</p>

            <p style="width:50%;">用频属性：{{ zchjDetailsData.YPSXNM }}</p>
            <p style="width:50%;">位置：{{ zchjDetailsData.MC }}{{ zchjDetailsData.KZDM }}</p>
          </div>
          <el-divider />
          <!-- 媒体信息 -->
          <div>
            <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
            <span
              class="top"
              style="display:inline-block;font-weight: bold; font-size: 14px;"
            >
              媒体信息
            </span>
            <el-carousel v-if="zchjMtxx && zchjMtxx.length > 0" height="250px" style="width:60%;margin:auto">
              <el-carousel-item v-for="(item,index) in zchjMtxx" :key="index">
                <img :src="`data:image/jpeg;base64,`+item.mtdx" style="width:100%;height:100%" :title="item.fileName">
              </el-carousel-item>
            </el-carousel>
            <p v-else>暂无</p>
          </div>
        </div>
        <div v-if="pointTypes==='3'" class="box-show">
          <span style="display:inline-block;width:5px;height:15px;background:blue;margin-right:5px;" />
          <span
            class="top"
            style="display:inline-block;font-weight: bold; font-size: 14px;"
          >
            基本信息
          </span>
          <div class="bottom" style="display:flex;flex-wrap:wrap;">
            <p style="width:50%;">设施名称：{{ hqbzDetailsData.SSMC }}</p>
            <p style="width:50%;">部队番号：{{ hqbzDetailsData.BDNM }}</p>
            <p style="width:50%;">位置：{{ hqbzDetailsData.DMNM }}{{ hqbzDetailsData.KZDM }}</p>
            <p style="width:50%;">经度：{{ hqbzDetailsData.JD }}</p>
            <p style="width:50%;">纬度：{{ hqbzDetailsData.WD }}</p>
            <p style="width:50%;">高程：{{ hqbzDetailsData.GC?hqbzDetailsData.GC:'暂无' }}</p>

          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisibleDetilsLittle = false">关 闭</el-button>
        </span>
      </el-dialog>

      <!-- 军标 -->
      <div v-if="dialogThemeVisibles" style="position: absolute;width: 362px;z-index: 999;right: 30px;bottom: 127px;background: rgba(255,255,255,0.5);scrollbar-width:thin;">
        <el-tree
          ref="myTree"
          style="height:335px;overflow:scroll;overflow-x:hidden;background: rgba(255, 255, 255, 0.5);color: #000;"
          :data="treeData"
          class="filter-tree"
          highlight-current
          :props="treeProps"
          show-checkbox
          :filter-node-method="filterNode"
          @check-change="handleCheckChangeTree"
        />
        <!-- 军标图库 -->
        <div style="display: flex;flex-wrap: wrap;height: 125px;overflow: hidden scroll;background: rgba(255, 255, 255, 0.5);scrollbar-width:thin;">
          <div v-for="(item, index) in JBData" :key="index" style="text-align:center;margin: 10px;">
            <p style="width:84px;height:51px">
              <!-- <img style="width:56px;height:51px" :src="item.img" @click="mouseClick(item)"> -->
              <img style="width:56px;height:51px" :src="'/jbdz'+item.path" @click="mouseClick(item)">
            </p>
            <p style="height:20px;line-height:20px;color: #000">{{ item.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script>

import people from '@/icons/newImages/analysis/people.png'
import Flag from '@/icons/img/mapSearch/flag.png'
import hosptail from '@/icons/img/mapSearch/hosptail.png'
import Green from '@/icons/img/mapSearch/green.png'
import Blue from '@/icons/img/mapSearch/blue.png'
import MapOl from '@/components/MapOl'
import Container from '@/components/Container'
import airplaneImage from '@/assets/icons/airplane.png'
import armyImage from '@/assets/icons/army.png'
import surfaceImage from '@/assets/icons/surface_forces.png'
import FlagIcons from '@/assets/icons/flag.png'
import troopStation from '@/assets/icons/troop_station.png'
import moment from 'moment'
import * as API from '../../api/index'
import {
  seaColumn,
  airColumn,
  dipperColumn,
  rowColumn
} from './tableColumns'
// 处理态势信息可拖拽
import './dialogDrag'
export default {
  components: { Container, MapOl },
  data() {
    return {
      activeNames: [],
      wzChecked: false,
      loading2: false,
      secondQueryArmy: [],
      allSeond: [],
      placeholderTextInput: '', // 筛选
      placeholderText: '请输入批号',
      dialogVisible: false,
      innerText: '',
      propKey: '',
      ruleForm: {
        text: ''
      },
      rules: {
        text: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      bShowTable: true, // 是否显示表格
      tableData: [], // 表格数据
      allTabData: [],
      tableColumn: seaColumn, // 海情表格的列
      // 分页
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      rowData: [], // 态势信息表格的数据
      rowColumn: rowColumn, // 态势信息表格的列
      dialogTableVisible: false, // 是否展示态势信息
      condition: 'seaCondition', // 当前选择的选项卡（海情、空情、北斗）
      airplaneImage,
      orderBy: '',
      orderColumn: '',
      radioValue: 'seaCondition',
      seaData: [], // 海情表格多选框选中的数据
      airData: [], // 空情表格多选框选中的数据
      deepData: [], // 北斗表格多选框选中的数据
      prop: {
        // checkStrictly: true,
        multiple: true,
        value: 'code',
        children: 'children',
        label: 'label'
      },
      optionss: [],
      // 我方
      suppliableValues: [],
      allElection: [], // 战备工程全选
      // 战备工程
      engineering: [],
      // 战场环境
      environment: [
        { checkeds: true, label: '电磁环境', NM: 'DCHJNM' },
        { checkeds: true, label: '核生化环境', NM: 'HHSHJNM' },
        { checkeds: true, label: '文化古迹', NM: 'WHGJNM' },
        { checkeds: true, label: '教堂', NM: 'JTNM' },
        { checkeds: true, label: '交通目标', NM: 'JJYSNM' }
      ],
      // 后勤保障
      support: [
        { checkeds: true, label: '油库', NM: 'YK' },
        { checkeds: true, label: '血站', NM: 'XZ' },
        { checkeds: true, label: '医院', NM: 'YY' }
      ],
      allEnvironment: ['电磁环境', '核生化环境', '文化古迹', '教堂', '交通目标'], // 战场环境全选
      allSupport: ['油库', '血站', '医院'], // 后勤保障全选
      allQueryArmy: [], // 全选
      queryArmy: [], // 全选
      radioTime: '实时',
      // 实时 全选
      checkNow: ['海情', '空情', '北斗'],
      checkNowEng: [
        { checkeds: true, label: '海情', NM: 'HQ' },
        { checkeds: true, label: '空情', NM: 'KQ' },
        { checkeds: true, label: '北斗', NM: 'BD' }
      ],
      // 作战力量
      formDetails: {
        JZLBNM: [],
        BCLBXFNM: [],
        BDJBNM: [],
        BZNM: [],
        BCLBNM: [],
        BDLBNM: []
      },
      fightData: {},
      optionProps: {
        value: 'code',
        label: 'label',
        children: 'children',
        multiple: true
        // checkStrictly: true
      },
      // 战备工程
      formCombatData: {
        BHQNM: []
      },
      fightDataformCombat: {},
      // 战备工程弹出框多选
      optionPropsCombat: {
        value: 'XH',
        label: 'MC',
        children: 'children',
        multiple: true,
        checkStrictly: true
      },
      // 提示框显示隐藏
      visiblePopover: false,
      visiblePopoverZBGC: false,
      // 建制类别
      jzlbData: [],
      // 编成类别
      bclbData: [],
      // 级别
      bdjbData: [],
      // 兵种
      bznmData: [],
      // 编成分类
      bclbxfData: [],
      // 后勤保障清楚点数据
      dataPoint: [],
      // 战场环境清除点数据
      zchjClearPoint: [],
      // 战备工程清楚点数据
      zbgcClearPoint: [],
      // 作战力量清除点数据
      zzllClearPoint: [],
      // 详情弹框
      dialogVisibleDetils: false,
      // 详情弹框数据
      detailsData: [],
      allDataList: {}, // 数据列表
      kzxxData: [],
      msxxData: [],
      gcflnm: '', // 工程分类内码
      zbgcnm: '', // 战备工程内码
      pointType: '',
      pointNM: '',
      zzllDetailsJBQK: {},
      zzllDetailsDFRW: [],
      zzllMTXX: [],
      zzllMTXXOne: '',
      zchjDetailsData: [],
      dialogVisibleDetilsLittle: false,
      hqbzDetailsData: [],
      hqbzDetailkzxxData: [],
      HQBZmsxxData: [],
      hqbzValue: '',
      mapTools: ['Home', 'MeasureLine', 'RectSelect', 'Screenshot', 'Clear'],
      JBData: [],
      treeProps: {
        label: 'label',
        children: 'children'
      },
      treeData: [],
      dialogThemeVisibles: false,
      dataItem: '',
      // 海情轨迹数据
      seaGj: '',
      // 空情轨迹数据
      airGj: '',
      targetType: '',
      // 北斗轨迹数据
      bdGj: '',
      secondRadio: '我方',
      // 敌方区域选择
      cascaderIdSeond: [],
      checkedAllDataSecond: [],
      pointTypes: '',

      mouseClicks: false,
      imgPath: '',
      zchjMtxx: [],
      hqbzMTXX: [],
      leftTopX: 0,
      leftTopY: 0,
      RectWidth: 0,
      RectHeight: 0

    }
  },
  mounted() {
    // 获取地区
    this.getAreaTree()
    this.getAreaTreeSecond()
    // 获取战备工程
    this.getCategory()
    // 初次进入页面的时候获取海情表格的数据；
    this.getSeaTableData()
    // 军种类型获取
    this.getQueryArmyService()
    // 获取搜索选项信息 作战力量
    this.getBDParams()
    // 战备工程
    this.getGCParams()
    // 空情实时数据
    this.getQueryRealTimeAir()
    // 北斗实时数据
    this.getQueryRealTimeBd()
    // 海情实时数据
    this.getQueryRealTimeSea()
    // 获取敌方位置数据
    // this.getDataSecond()
  },
  methods: {
    // 点飞行
    fly() {
      const JDWD = [this.formInline.JD, this.formInline.WD]
      this.$refs.MapOl.flyPoint(JDWD)
    },
    getDataSecond() {
      this.secondQueryArmy = []
      API.getQueryTargetType().then(res => {
        res.data.forEach(item => {
          this.secondQueryArmy.push(item)
          this.allSeond.push(item.XH)
        })
      })
    },
    secondChangeSearch() {
      this.$refs.MapOl.removeMarkerPoint('qq')
      this.loading2 = true

      let prams = {}
      if (this.suppliableValues.length > 0) {
        prams = {
          GJDQ: this.cascaderIdSeond,
          MBLX: this.allSeond
        }
      } else {
        prams = {
          GJDQ: [],
          MBLX: this.allSeond
        }
      }

      API.getTarget(prams).then(res => {
        this.loading2 = false
        this.checkedAllDataSecond = res.data
        res.data.forEach((mapItem) => {
          this.$refs.MapOl.addMarkerPoint(
            Blue,
            [mapItem.pointJD, mapItem.pointWD],
            'qq',
            mapItem
          )
        })
      })
    },
    secondChange(value) {
      this.getSelected(value)
    },
    getSelected(data) {
      const selectedResult = []
      this.checkedAllDataSecond.forEach(item => {
        const result = data.filter(dataItem => dataItem === item.XH)
        if (result.length > 0) {
          selectedResult.push(item.MBZLNM)
        }
      })
    },
    secondRadioChange(e) {
      this.$refs.MapOl.onHandleClear1()
      this.secondRadio = e
      this.activeNames = []
      if (e === '敌方') {
        this.cleatCluster()
        // 获取敌方位置数据
        this.getDataSecond()
      } else {
        if (this.radioTime == '实时') {
          this.checkNowEng.forEach(i => {
            if (i.NM === 'KQ' && i.checkeds) {
              // 空情实时数据
              this.getQueryRealTimeAir()
            }
            if (i.NM === 'HQ' && i.checkeds) {
              // 海情实时数据
              this.getQueryRealTimeSea()
            }
            if (i.NM === 'BD' && i.checkeds) {
              // 北斗实时数据
              this.getQueryRealTimeBd()
            }
          })
          // 清除显示路径
          this.$refs.MapOl.removeLineAndMarkerById(this.seaGj)
          this.$refs.MapOl.removeLineAndMarkerById(this.airGj)
          this.$refs.MapOl.removeLineAndMarkerById(this.bdGj)
        }
        this.$refs.MapOl.removeMarkerPoint('qq')
        this.getQueryArmyService()
        this.getCategory()
        this.allEnvironment = ['电磁环境', '核生化环境', '文化古迹', '教堂', '交通目标']
        this.allSupport = ['油库', '血站', '医院']
        this.checkNow = ['海情', '空情', '北斗']
      }
    },
    // 实时多选框选择
    handleCheckChange(val, e) {
      if (e) { // 如果是选中  添加点
        this.$refs.MapOl.showLayerById(val)
        if (val == 'KQ') {
          // 空情实时数据
          this.getQueryRealTimeAir()
        } else if (val == 'BD') {
          // 北斗实时数据
          this.getQueryRealTimeBd()
        } else if (val == 'HQ') {
          // 海情实时数据
          this.getQueryRealTimeSea()
        }
      } else { // 未选  删除点
        if (val == 'KQ') {
          clearInterval(this.clearTimeKQ)// 清除定时器
        } else if (val == 'BD') {
          clearInterval(this.clearTimeSet)// 清除定时器
        } else if (val == 'HQ') {
          clearInterval(this.clearTimeHQ)// 清除定时器
        }
        this.$refs.MapOl.hideLayerById(val)
      }
    },
    // 点击树
    handleCheckChangeTree(obj, node, tree) {
      if (!node) {
        this.JBData.forEach((i, index) => {
          if (i.path === obj.path) {
            this.JBData.splice(index, 1)
          }
        })
      } else {
        this.$emit('nodeClick', { obj, node, tree })
        if (obj.type === 'file') {
          this.JBData.push(obj)
        }
      }
    },
    // 过滤节点方法  单位编制
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    signs(val) {
      this.dialogThemeVisibles = val
      if (this.dialogThemeVisibles) {
        this.getTreeList()
      } else {
        this.JBData = []
        this.mouseClicks = false
        return
      }
    },
    sign() {
      this.dialogThemeVisibles = !this.dialogThemeVisibles
      if (this.dialogThemeVisibles) {
        this.getTreeList()
      } else {
        // this.$refs.MapOl.onHandleClear()
        // this.mouseClicks = false
        this.JBData = []
        return
      }
    },
    // 获取树列表
    getTreeList() {
      API.getJB().then(res => {
        this.treeData = [res]
      })
    },
    mouseClick(i) {
      // this.imgPath = i.img
      // this.mouseClicks = true
      this.imgPath = '/jbdz/' + i.path
      this.mouseClicks = true
    },
    // 点击确定获取坐标
    getBaseDatas(data) {
      this.pointData = []
      // API.getBaseData(data).then(res => {
      //   const { code, data, msg } = res
      //   if (String(code) === '200') {
      //     console.log('.data', data)

      //       this.pointData = data
      //      this.$refs.MapOl.addLayerAndGraphics('warEngineeringEntityListpointData', this.pointData, Red)
      //   } else {
      //     this.$message.error(msg)
      //   }
      // })
    },
    // 点选
    searchByRange(rangeData, x, y, width, height) {
      const data = {
        areaPointArr: rangeData.areaPointArr,
        type: rangeData.type === 'circle' ? 4 : 3,
        radio: Number(rangeData.radio),
        areas: this.cascaderId, // 地区
        armyServices: this.combatPowers, // 军种   作战力量
        dataTime: this.startDate, // 时间
        logistics: this.selectedSupport, // 后勤保障
        warEngineerings: this.selectedEngineer, // 战备工程
        warEnvironments: this.selectedEnvironment // 战场环境
      }
      this.getBaseDatas(data)
      console.log('rangeData', rangeData, x, y, width, height)
      this.leftTopX = x
      this.leftTopY = y
      this.RectWidth = width
      this.RectHeight = height
      console.log(typeof (this.leftTopY))
    },
    closeDialogVisibleDetils() {
      this.dialogVisibleDetils = false
      this.allDataList = {}
      this.kzxxData = []
      this.msxxData.YKRL = []
      this.msxxData.PDFX = []
      this.msxxData.MTXX = []
    },
    // 战备工程详情模态框
    getDetail(val) {
      setTimeout(() => {
        this.dialogVisibleDetils = true
        this.pointTypes = val.pointType
      }, 200)
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

          if (res.data.JCXX && Object.keys(res.data.JCXX).length > 0) {
            this.allDataList = res.data.JCXX
          }
          if (res.data.KZXX && res.data.KZXX.length > 0) {
            this.kzxxData = res.data.KZXX
          }
          if (res.data.MSXX && res.data.MSXX.length > 0) {
            this.msxxData.YKRL = res.data.MSXX.filter(item => item.key === '油库容量')
            this.msxxData.PDFX = res.data.MSXX.filter(item => item.key === '跑道方向（度分秒）')
            this.msxxData.PTQK = res.data.MSXX.filter(item => item.key === '配套情况')
            this.msxxData.JS = res.data.MSXX.filter(item => item.key === '简述')
          }

          if (res.data.MTDX && res.data.MTDX.length > 0) {
            res.data.MTDX.forEach(i => {
              i.mtdx = `data:image/jpeg;base64,` + i.mtdx
            })
            this.msxxData.MTXX = res.data.MTDX
          }
        }
      })
    },
    // 作战力量详情弹框
    getZZLLDetail(val) {
      this.dialogVisibleDetils = true
      this.pointTypes = val.pointType
      const prams = {
        pointNm: val.pointNM
      }
      API.getForceInfoDetails(prams).then(res => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          this.zzllDetailsJBQK = data.JBQK[0]
          if (data.DFRW) {
            this.zzllDetailsDFRW = data.DFRW.map(item => {
              return item
            })
          }
          console.log(data)
          this.zzllMTXX = data.MTDX
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 战场环境
    zchjDetails(val) {
      this.zchjMtxx = []
      this.dialogVisibleDetilsLittle = true
      this.pointTypes = val.pointType
      const prams = {
        areaCode: val.areaCode,
        pointCategory: val.pointCategory,
        pointNm: val.pointNM
      }
      API.getWarEnvironmentDeatil(prams).then(res => {
        this.zchjDetailsData = res.data.JBXX[0]
        if (res.data.MTDX && res.data.MTDX.length > 0) {
          res.data.MTDX.forEach(i => {
            this.zchjMtxx.push(i)
          })
        }
      })
    },
    // 后勤保障详情
    hqbzDetails(val) {
      this.hqbzMTXX = []
      this.pointTypes = val.pointType
      this.hqbzValue = val.pointCategory
      if (val.pointCategory == 'YK') {
        this.dialogVisibleDetils = true
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
            this.hqbzDetailkzxxData = data.KZXX
          }
          if (val.pointCategory == 'YY' || val.pointCategory == 'XZ') {
            this.hqbzDetailkzxxData = data.KZXX
          }

          if (data.MSXX) {
            this.HQBZmsxxData = data.MSXX[0]
          } else {
            this.HQBZmsxxData = []
          }
          console.log(data)
          this.hqbzMTXX = data.MTDX
        }
      })
    },
    // 地图图标点击事件
    featureMarkerLayer(val) {
      if (val) {
        if (val.pointType == 2) { // 战备工程
          this.getDetail(val)
        } else if (val.pointType == 1) { // 作战力量
          this.getZZLLDetail(val)
        } else if (val.pointType == 4) { // 战场环境
          this.zchjDetails(val)
        } else if (val.pointType == 3) { // 后勤保障
          this.hqbzDetails(val)
        } else if (val.targetType === '海情') { // 海情轨迹数据
          this.targetType = '海情'
          this.seaGj = val.batchNumber
          this.$confirm('是否显示该路径?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => { // 成功
            // 1.清除实时的当前点
            val.layerId = 'HQ'
            // this.$refs.MapOl.remove('ClusterHQ',val.batchNumber)
            this.$refs.MapOl.removeMarkerPoints(val.layerId, val.batchNumber)

            // this.$refs.MapOl.removeMarkerPoint(val.batchNumber)
            // 2.调用历史轨迹路径
            const prams = {
              ph: this.seaGj
            }
            API.getQueryRealTimeSeaGj(prams).then(res => {
              const { code, msg, data } = res
              if (String(code) === '200') {
                if (data.length > 0) {
                  const lineData = []
                  data.forEach(item => {
                    lineData.push([item.longitude, item.latitude])
                  })
                  // 显示点和线
                  this.$refs.MapOl.addLineAndMarker(surfaceImage, lineData[0], lineData, this.seaGj)
                  this.radio2 = 0
                } else {
                  this.$message.info('暂无数据')
                }
              } else {
                this.$message.error(msg)
              }
            })
            // 3.修改历史按钮显示
            this.radioTime = '历史'
            // 4.实时的标点取消   定时器取消
            this.$refs.MapOl.hideLayerById(val)
            clearInterval(this.clearTimeHQ)// 清除定时器
          }).catch(() => { // 取消
            this.$message({
              type: 'info',
              message: '已取消显示'
            })
          })
        } else if (val.targetType === '空情') { // 空情轨迹数据
          this.airGj = val.batchNumber
          this.targetType = '空情'
          this.$confirm('是否显示该路径?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => { // 成功
            // 1.清除实时的当前点
            val.layerId = 'KQ'
            // this.$refs.MapOl.remove('ClusterKQ',val.batchNumber)
            this.$refs.MapOl.removeMarkerPoints(val.layerId, val.batchNumber)
            // 2.调用历史轨迹路径
            const prams = {
              ph: val.batchNumber
            }
            API.getQueryRealTimeAirGj(prams).then(res => {
              const { code, data, msg } = res
              if (String(code) === '200') {
                if (data.length > 0) {
                  const lineData = []
                  data.forEach(item => {
                    lineData.push([item.longitude, item.latitude])
                  })
                  // 显示点和线
                  this.$refs.MapOl.addLineAndMarker(airplaneImage, lineData[0], lineData, this.airGj)
                } else {
                  this.$message.info('暂无数据')
                }
              } else {
                this.$message.error(msg)
              }
            })

            // 3.修改历史按钮显示
            this.radioTime = '历史'
            // 4.实时的标点取消   定时器取消
            // this.$refs.MapOl.hideLayerById(val)
            // clearInterval(this.clearTimeHQ)
          }).catch(() => { // 取消
            this.$message({
              type: 'info',
              message: '已取消显示'
            })
          })
        } else if (val.targetType === '北斗') { // 北斗轨迹数据
          this.$confirm('是否显示该路径?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => { // 成功
            // 1.清除实时的当前点
            val.layerId = 'BD'
            // this.$refs.MapOl.remove('Cluster',val.targetId)
            this.$refs.MapOl.removeMarkerPoints(val.layerId, val.targetId)

            // 2.调用历史轨迹路径
            this.bdGj = val.targetId
            this.targetType = '北斗'
            const prams = {
              bd: this.bdGj
            }
            API.getQueryRealTimeBdGj(prams).then(res => {
              const { code, data, msg } = res
              if (String(code) === '200') {
                if (data.length > 0) {
                  const lineData = []
                  data.forEach(item => {
                    lineData.push([item.longitude, item.latitude])
                  })
                  // 显示点和线
                  this.$refs.MapOl.addLineAndMarker(armyImage, lineData[0], lineData, this.bdGj)
                } else {
                  this.$message.info('暂无数据')
                }
              } else {
                this.$message.error(msg)
              }
            })
            // 3.修改历史按钮显示
            this.radioTime = '历史'
            // 4.实时的标点取消   定时器取消
            // this.$refs.MapOl.hideLayerById(val)
            // clearInterval(this.clearTimeSet)//清除定时器
          }).catch(() => { // 取消
            this.$message({
              type: 'info',
              message: '已取消显示'
            })
          })
        }
      }
    },
    // 右击事件
    changeRotation(val) {
      this.mouseClicks = val
    },
    cleatCluster() {
      this.$refs.MapOl.removeClusterLayer('YYCluster1')
      this.$refs.MapOl.removeClusterLayer('YKCluster1')
      this.$refs.MapOl.removeClusterLayer('XZCluster1')
      this.$refs.MapOl.removeClusterLayer('DCHJCluster1')
      this.$refs.MapOl.removeClusterLayer('HHSHJCluster1')
      this.$refs.MapOl.removeClusterLayer('WHGJCluster1')
      this.$refs.MapOl.removeClusterLayer('JTCluster1')
      this.$refs.MapOl.removeClusterLayer('JJYSCluster1')
      this.$refs.MapOl.removeClusterLayer('ZHFHCluster1')
      this.$refs.MapOl.removeClusterLayer('LJSSCluster1')
      this.$refs.MapOl.removeClusterLayer('JTJDCluster1')
      this.$refs.MapOl.removeClusterLayer('MTCluster1')
      this.$refs.MapOl.removeClusterLayer('JCCluster1')
      this.$refs.MapOl.removeClusterLayer('ZDCluster1')
      this.$refs.MapOl.removeClusterLayer('TXCluster1')
      this.$refs.MapOl.removeClusterLayer('CKCluster1')
      this.$refs.MapOl.removeClusterLayer('YFCluster1')
      this.$refs.MapOl.removeClusterLayer('RFCluster1')
      this.$refs.MapOl.removeClusterLayer('DPCluster1')
      this.$refs.MapOl.removeClusterLayer('KDCluster1')
      this.$refs.MapOl.removeClusterLayer('LJCluster1')
      this.$refs.MapOl.removeClusterLayer('HJCluster1')
      this.$refs.MapOl.removeClusterLayer('KJCluster1')
      this.$refs.MapOl.removeClusterLayer('HJJCluster1')
      this.$refs.MapOl.removeClusterLayer('ZLBDCluster1')
      this.$refs.MapOl.removeClusterLayer('LQBDCluster1')
      this.$refs.MapOl.removeClusterLayer('WJBDCluster1')
      this.$refs.MapOl.removeClusterLayer('QTCluster1')
    },
    // 后勤保障信息获取
    hqbzClick() {
      this.cleatCluster()
      this.loading2 = true
      if (this.allSupport.length === 0) {
        this.loading2 = false
        return this.$message.error('请选择数据！')
      } else {
        const allSupportEng = []
        this.support.forEach(item => {
          allSupportEng.push(item.NM)
        })
        let prams = {}
        if (this.demoCascaderArea !== undefined && this.demoCascaderArea.length && this.demoCascaderArea.length > 0) {
          prams = {
            DQ: this.cascaderId,
            HQBZ: this.selectedSupport || allSupportEng
          }
        } else {
          prams = {
            DQ: [],
            HQBZ: this.selectedSupport || allSupportEng
          }
        }
        API.getLogistics(prams).then(res => {
          const { code, msg, data } = res
          if (String(code) === '200') {
            this.dataPoint = data
            this.loading2 = false
            if (data) {
              if (data.length && data.length > 0) {
                const YYData = data.filter(item => item.pointCategory === 'YY')
                const YKData = data.filter(item => item.pointCategory === 'YK')
                const XZData = data.filter(item => item.pointCategory === 'XZ')
                if (YYData.length && YYData.length > 0) {
                  const count1 = YYData.length
                  const pointes = new Array(count1)
                  for (let i = 0; i < count1; ++i) {
                    const coordinate = [YYData[i].pointJD, YYData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: YYData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([YYData[0].pointJD, YYData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('YYCluster1', pointes)
                }

                if (XZData.length && XZData.length > 0) {
                  const count2 = XZData.length
                  const pointes = new Array(count2)
                  for (let i = 0; i < count2; ++i) {
                    const coordinate = [XZData[i].pointJD, XZData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: XZData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([XZData[0].pointJD, XZData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('XZCluster1', pointes)
                }

                if (YKData.length && YKData.length > 0) {
                  const count3 = YKData.length
                  const pointes = new Array(count3)
                  for (let i = 0; i < count3; ++i) {
                    const coordinate = [YKData[i].pointJD, YKData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: YKData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([YKData[0].pointJD, YKData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('YKCluster1', pointes)
                }
              } else if (data.length <= 0) {
                this.$message.warning('暂无数据！')
              }
            } else {
              this.$message.success(msg)
            }
          } else {
            this.$message.error(msg)
          }
        })
      }
    },
    // 战场环境信息获取
    zchjClick() {
      this.cleatCluster()
      this.loading2 = true
      if (this.allEnvironment.length === 0) {
        this.loading2 = false
        return this.$message.error('请选择数据！')
      } else {
        const engEnvironment = []
        this.environment.forEach(item => {
          engEnvironment.push(item.NM)
        })
        let prams = {}
        if (this.demoCascaderArea !== undefined && this.demoCascaderArea.length && this.demoCascaderArea.length > 0) {
          prams = {
            DQ: this.cascaderId,
            ZCHJ: this.selectedEnvironment || engEnvironment
          }
        } else {
          prams = {
            DQ: [],
            ZCHJ: this.selectedEnvironment || engEnvironment
          }
        }
        API.getWarEnvironment(prams).then(res => {
          const { data, msg, code } = res
          if (String(code) === '200') {
            this.loading2 = false
            this.zchjClearPoint = data
            if (data) {
              if (data.length && data.length > 0) {
                const DCHJData = data.filter(item => item.pointCategory === 'DCHJNM')
                const HHSHJData = data.filter(item => item.pointCategory === 'HHSHJNM')
                const WHGJData = data.filter(item => item.pointCategory === 'WHGJNM')
                const JTData = data.filter(item => item.pointCategory === 'JTNM')
                const JJYSData = data.filter(item => item.pointCategory === 'JJYSNM')

                if (DCHJData.length && DCHJData.length > 0) {
                  const count1 = DCHJData.length
                  const pointes = new Array(count1)
                  for (let i = 0; i < count1; ++i) {
                    const coordinate = [DCHJData[i].pointJD, DCHJData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: DCHJData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([DCHJData[0].pointJD, DCHJData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('DCHJCluster1', pointes)
                }
                if (HHSHJData.length && HHSHJData.length > 0) {
                  const count2 = HHSHJData.length
                  const pointes = new Array(count2)
                  for (let i = 0; i < count2; ++i) {
                    const coordinate = [HHSHJData[i].pointJD, HHSHJData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: HHSHJData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([HHSHJData[0].pointJD, HHSHJData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('HHSHJCluster1', pointes)
                }
                if (WHGJData.length && WHGJData.length > 0) {
                  const count3 = WHGJData.length
                  const pointes = new Array(count3)
                  for (let i = 0; i < count3; ++i) {
                    const coordinate = [WHGJData[i].pointJD, WHGJData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: WHGJData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([WHGJData[0].pointJD, WHGJData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('WHGJCluster1', pointes)
                }
                if (JTData.length && JTData.length > 0) {
                  const count4 = JTData.length
                  const pointes = new Array(count4)
                  for (let i = 0; i < count4; ++i) {
                    const coordinate = [JTData[i].pointJD, JTData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: JTData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([JTData[0].pointJD, JTData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('JTCluster1', pointes)
                }
                if (JJYSData.length && JJYSData.length > 0) {
                  const count5 = JJYSData.length
                  const pointes = new Array(count5)
                  for (let i = 0; i < count5; ++i) {
                    const coordinate = [JJYSData[i].pointJD, JJYSData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: JJYSData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([JJYSData[0].pointJD, JJYSData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('JJYSCluster1', pointes)
                }
              } else if (data.length <= 0) {
                this.$message.warning('暂无数据！')
              }
            } else {
              this.$message.success(msg)
            }
          } else {
            this.$message.error(msg)
          }
        })
      }
    },
    // 战备工程信息获取
    getWarEngineerings() {
      this.cleatCluster()
      this.loading2 = true
      if (this.allElection.length === 0) {
        this.loading2 = false
        return this.$message.error('请选择数据！')
      } else {
        let prams = {}
        if (this.demoCascaderArea !== undefined && this.demoCascaderArea.length && this.demoCascaderArea.length > 0) {
          prams = {
            DQ: this.cascaderId,
            GCFL: this.selectedEngineer,
            BHQ: this.bhqData
          }
        } else {
          prams = {
            DQ: [],
            GCFL: this.selectedEngineer,
            BHQ: this.bhqData
          }
        }
        API.getWarEngineerings(prams).then(res => {
          const { code, msg, data } = res
          if (String(code) === '200') {
            this.loading2 = false
            if (data) {
              if (data.length && data.length > 0) {
                const ZHFHData = data.filter(item => item.pointCategory === '01')
                const LJSSData = data.filter(item => item.pointCategory === '02')
                const JTJDData = data.filter(item => item.pointCategory === '03')
                const MTData = data.filter(item => item.pointCategory === '04')
                const JCData = data.filter(item => item.pointCategory === '05')
                const ZDData = data.filter(item => item.pointCategory === '06')
                const TXData = data.filter(item => item.pointCategory === '07')
                const CKData = data.filter(item => item.pointCategory === '08')
                const YFData = data.filter(item => item.pointCategory === '09')
                const RFData = data.filter(item => item.pointCategory === '10')
                const DPData = data.filter(item => item.pointCategory === '11')
                const KDData = data.filter(item => item.pointCategory === '12')

                if (ZHFHData.length && ZHFHData.length > 0) {
                  const count1 = ZHFHData.length
                  const pointes = new Array(count1)
                  for (let i = 0; i < count1; ++i) {
                    const coordinate = [ZHFHData[i].pointJD, ZHFHData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: ZHFHData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([ZHFHData[0].pointJD, ZHFHData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('ZHFHCluster1', pointes)
                }
                if (LJSSData.length && LJSSData.length > 0) {
                  const count2 = LJSSData.length
                  const pointes = new Array(count2)
                  for (let i = 0; i < count2; ++i) {
                    const coordinate = [LJSSData[i].pointJD, LJSSData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: LJSSData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([LJSSData[0].pointJD, LJSSData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('LJSSCluster1', pointes)
                }
                if (JTJDData.length && JTJDData.length > 0) {
                  const count3 = JTJDData.length
                  const pointes = new Array(count3)
                  for (let i = 0; i < count3; ++i) {
                    const coordinate = [JTJDData[i].pointJD, JTJDData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: JTJDData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([JTJDData[0].pointJD, JTJDData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('JTJDCluster1', pointes)
                }
                if (MTData.length && MTData.length > 0) {
                  const count4 = MTData.length
                  const pointes = new Array(count4)
                  for (let i = 0; i < count4; ++i) {
                    const coordinate = [MTData[i].pointJD, MTData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: MTData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([MTData[0].pointJD, MTData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('MTCluster1', pointes)
                }
                if (JCData.length && JCData.length > 0) {
                  const count5 = JCData.length
                  const pointes = new Array(count5)
                  for (let i = 0; i < count5; ++i) {
                    const coordinate = [JCData[i].pointJD, JCData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: JCData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([JCData[0].pointJD, JCData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('JCCluster1', pointes)
                }
                if (ZDData.length && ZDData.length > 0) {
                  const count6 = ZDData.length
                  const pointes = new Array(count6)
                  for (let i = 0; i < count6; ++i) {
                    const coordinate = [ZDData[i].pointJD, ZDData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: ZDData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([ZDData[0].pointJD, ZDData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('ZDCluster1', pointes)
                }
                if (TXData.length && TXData.length > 0) {
                  const count7 = TXData.length
                  const pointes = new Array(count7)
                  for (let i = 0; i < count7; ++i) {
                    const coordinate = [TXData[i].pointJD, TXData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: TXData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([TXData[0].pointJD, TXData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('TXCluster1', pointes)
                }
                if (CKData.length && CKData.length > 0) {
                  const count8 = CKData.length
                  const pointes = new Array(count8)
                  for (let i = 0; i < count8; ++i) {
                    const coordinate = [CKData[i].pointJD, CKData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: CKData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([CKData[0].pointJD, CKData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('CKCluster1', pointes)
                }
                if (YFData.length && YFData.length > 0) {
                  const count9 = YFData.length
                  const pointes = new Array(count9)
                  for (let i = 0; i < count9; ++i) {
                    const coordinate = [YFData[i].pointJD, YFData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: YFData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([YFData[0].pointJD, YFData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('YFCluster1', pointes)
                }
                if (RFData.length && RFData.length > 0) {
                  const count10 = RFData.length
                  const pointes = new Array(count10)
                  for (let i = 0; i < count10; ++i) {
                    const coordinate = [RFData[i].pointJD, RFData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: RFData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([RFData[0].pointJD, RFData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('RFCluster1', pointes)
                }
                if (DPData.length && DPData.length > 0) {
                  const count11 = DPData.length
                  const pointes = new Array(count11)
                  for (let i = 0; i < count11; ++i) {
                    const coordinate = [DPData[i].pointJD, DPData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: DPData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([DPData[0].pointJD, DPData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('DPCluster1', pointes)
                }
                if (KDData.length && KDData.length > 0) {
                  const count12 = KDData.length
                  const pointes = new Array(count12)
                  for (let i = 0; i < count12; ++i) {
                    const coordinate = [KDData[i].pointJD, KDData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: KDData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([KDData[0].pointJD, KDData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('KDCluster1', pointes)
                }
              } else if (data.length <= 0) {
                this.$message.warning('暂无数据！')
              }
            } else {
              this.cancel('战备工程')
              this.$message.success(msg)
            }
          } else {
            this.$message.error(msg)
          }
        })
        this.bhqData = []
      }
    },
    resetCheckBox(e) {
      if (e === '作战力量') {
        this.allQueryArmy = []
      } else if (e === '战备工程') {
        this.allElection = []
      } else if (e === '战场环境') {
        this.allEnvironment = []
      } else if (e === '后勤保障') {
        this.allSupport = []
      }
    },
    // 作战力量信息获取
    getForceData() {
      this.loading2 = true
      this.cleatCluster()
      if (this.allQueryArmy.length === 0) {
        this.loading2 = false
        return this.$message.error('请选择数据！')
      } else {
        let prams = {}
        if (this.demoCascaderArea !== undefined && this.demoCascaderArea.length && this.demoCascaderArea.length > 0) {
          prams = {
            DQ: this.cascaderId,
            JZ: this.combatPowers,
            JZLB: this.jzlbData,
            BCLB: this.bclbData,
            BDJB: this.bdjbData,
            BZ: this.bznmData,
            BCFL: this.bclbxfData,
            BDLB: this.bdData
          }
        } else {
          prams = {
            DQ: [],
            JZ: this.combatPowers,
            JZLB: this.jzlbData,
            BCLB: this.bclbData,
            BDJB: this.bdjbData,
            BZ: this.bznmData,
            BCFL: this.bclbxfData,
            BDLB: this.bdData
          }
        }
        API.getForceData(prams).then(res => {
          const { code, msg, data } = res
          if (String(code) === '200') {
            this.loading2 = false
            this.zzllClearPoint = data
            if (data) {
              if (data.length && data.length > 0) {
                const LJData = data.filter(item => item.pointCategory === '01')
                const HJData = data.filter(item => item.pointCategory === '02')
                const KJData = data.filter(item => item.pointCategory === '03')
                const HJJData = data.filter(item => item.pointCategory === '04')
                const ZLBDData = data.filter(item => item.pointCategory === '05')
                const LQBDData = data.filter(item => item.pointCategory === '06')
                const WJBDData = data.filter(item => item.pointCategory === '11')
                const QTData = data.filter(item => item.pointCategory === '99')

                if (LJData.length && LJData.length > 0) {
                  const count1 = LJData.length
                  const pointes = new Array(count1)
                  for (let i = 0; i < count1; ++i) {
                    const coordinate = [LJData[i].pointJD, LJData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: LJData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([LJData[0].pointJD, LJData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('LJCluster1', pointes)
                }
                if (HJData.length && HJData.length > 0) {
                  const count2 = HJData.length
                  const pointes = new Array(count2)
                  for (let i = 0; i < count2; ++i) {
                    const coordinate = [HJData[i].pointJD, HJData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: HJData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([HJData[0].pointJD, HJData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('HJCluster1', pointes)
                }
                if (KJData.length && KJData.length > 0) {
                  const count3 = KJData.length
                  const pointes = new Array(count3)
                  for (let i = 0; i < count3; ++i) {
                    const coordinate = [KJData[i].pointJD, KJData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: KJData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([KJData[0].pointJD, KJData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('KJCluster1', pointes)
                }
                if (HJJData.length && HJJData.length > 0) {
                  const count4 = HJJData.length
                  const pointes = new Array(count4)
                  for (let i = 0; i < count4; ++i) {
                    const coordinate = [HJJData[i].pointJD, HJJData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: HJJData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([HJJData[0].pointJD, HJJData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('HJJCluster1', pointes)
                }
                if (ZLBDData.length && ZLBDData.length > 0) {
                  const count5 = ZLBDData.length
                  const pointes = new Array(count5)
                  for (let i = 0; i < count5; ++i) {
                    const coordinate = [ZLBDData[i].pointJD, ZLBDData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: ZLBDData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([ZLBDData[0].pointJD, ZLBDData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('ZLBDCluster1', pointes)
                }
                if (LQBDData.length && LQBDData.length > 0) {
                  const count6 = LQBDData.length
                  const pointes = new Array(count6)
                  for (let i = 0; i < count6; ++i) {
                    const coordinate = [LQBDData[i].pointJD, LQBDData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: LQBDData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([LQBDData[0].pointJD, LQBDData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('LQBDCluster1', pointes)
                }
                if (WJBDData.length && WJBDData.length > 0) {
                  const count7 = WJBDData.length
                  const pointes = new Array(count7)
                  for (let i = 0; i < count7; ++i) {
                    const coordinate = [WJBDData[i].pointJD, WJBDData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: WJBDData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([WJBDData[0].pointJD, WJBDData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('WJBDCluster1', pointes)
                }
                if (QTData.length && QTData.length > 0) {
                  const count8 = QTData.length
                  const pointes = new Array(count8)
                  for (let i = 0; i < count8; ++i) {
                    const coordinate = [QTData[i].pointJD, QTData[i].pointWD]
                    pointes[i] = {
                      lonlat: coordinate,
                      property: QTData[i]
                    }
                  }
                  this.$refs.MapOl.flyPoint([QTData[0].pointJD, QTData[0].pointWD])
                  this.$refs.MapOl.addClusterLayer('QTCluster1', pointes)
                }

                // this.cancel('作战力量')
              } else if (data.length <= 0) {
                this.$message.warning('暂无数据！')
              }
            } else {
              this.$message.success(msg)
            }
            this.cancel('作战力量')
          } else {
            this.$message.error(msg)
          }
        })
        this.jzlbData = []
        this.bclbData = []
        this.bdjbData = []
        this.bznmData = []
        this.bclbxfData = []
        this.bdData = []
      }
    },
    // 海情实时数据
    getQueryRealTimeSea() {
      // this.clearTimeHQ=setInterval(()=>{
      API.getQueryRealTimeSea().then(res => {
        const { msg, data, code } = res
        if (String(code) === '200') {
          const HQ = []
          data.forEach((item) => {
            HQ.push(item)
          })
          this.$refs.MapOl.addLayerAndGraphics('HQ', HQ, surfaceImage)
        } else {
          this.$message.error(msg)
        }
      })
      // },60)
    },
    // 北斗实时数据
    getQueryRealTimeBd() {
      // this.clearTimeSet= setInterval(()=>{
      API.getQueryRealTimeBd().then(res => {
        const { msg, data, code } = res
        if (String(code) === '200') {
          if (data) {
            this.bdNowData = data
            const BD = []
            data.forEach((item) => {
              BD.push(item)
            })
            this.$refs.MapOl.addLayerAndGraphics('BD', BD, armyImage)
          }
        } else {
          this.$message.error(msg)
        }
      })
      // },1500)
    },
    // 清除定时器
    clearTime() {
      clearInterval(this.clearTimeSet)
      clearInterval(this.clearTimeKQ)
      clearInterval(this.clearTimeHQ)
    },
    // 空情实时数据
    getQueryRealTimeAir() {
      // this.clearTimeKQ=setInterval(()=>{
      API.getQueryRealTimeAir().then(res => {
        const { msg, data, code } = res
        if (String(code) === '200') {
          const KQ = []
          data.forEach((item) => {
            KQ.push(item)
          })
          // 添加点及图层
          this.$refs.MapOl.addLayerAndGraphics('KQ', KQ, airplaneImage)
        } else {
          this.$message.error(msg)
        }
      })
      // },30)
    },

    // 作战力量弹出框选择器事件
    handleChangeCascader(value) {
      const obj = this.$refs['demoCascaderZZLL'].getCheckedNodes()
      if (obj.length === 0) {
        return
      }
      this.jzlbData = obj.map((i) => {
        return i.value
      })
    },
    // 级别选择器
    changeBDJB(value) {
      const obj = this.$refs['demoCascaderBDJB'].getCheckedNodes()
      if (obj.length === 0) {
        return
      }
      this.bdjbData = obj.map((i) => {
        return i.value
      })
    },
    // 兵种
    changeBZNM(value) {
      const obj = this.$refs['demoCascaderBZNM'].getCheckedNodes()
      if (obj.length === 0) {
        return
      }
      this.bznmData = obj.map((i) => {
        return i.value
      })
    },
    // 编成分类
    changeBCLBXFNM(value) {
      const obj = this.$refs['demoCascaderBCLBXF'].getCheckedNodes()
      if (obj.length === 0) {
        return
      }
      this.bclbxfData = obj.map((i) => {
        return i.value
      })
    },
    // 编成类别选择器
    changeBCLBNM(value) {
      const obj = this.$refs['demoCascaderBCLB'].getCheckedNodes()
      if (obj.length === 0) {
        return
      }
      this.bclbData = obj.map((i) => {
        return i.value
      })
    },
    // 部队类别
    changedemoCascaderBD(value) {
      const obj = this.$refs['demoCascaderBD'].getCheckedNodes()
      if (obj.length === 0) {
        return
      }
      this.bdData = obj.map((i) => {
        return i.value
      })
    },
    // 保护区
    changeCascaderBHQ(value) {
      const obj = this.$refs['demoCascaderBHQ'].getCheckedNodes()
      if (obj.length === 0) {
        return
      }
      this.bhqData = obj.map((i) => {
        return i.value
      })
    },
    // 取消查询按钮
    cancel(val) {
      if (val === '作战力量') {
        this.visiblePopover = false
        this.formDetails.JZLBNM = []
        this.formDetails.BCLBXFNM = []
        this.formDetails.BDJBNM = []
        this.formDetails.BZNM = []
        this.formDetails.BCLBNM = []
        this.formDetails.BDLBNM = []
        this.jzlbData = []
        this.bclbData = []
        this.bdjbData = []
        this.bznmData = []
        this.bclbxfData = []
        this.bdData = []
      } else if (val === '战备工程') {
        this.visiblePopoverZBGC = false
        this.formCombatData.BHQNM = []
        this.bhqData = []
      }
    },
    // 搜索条件数据获取
    getGCParams() {
      API.getGCParams().then((res) => {
        this.fightDataformCombat = res.data
      })
    },
    // 获取搜索选项信息
    getBDParams() {
      API.getBDParams().then((res) => {
        this.fightData = res.data
      })
    },
    // 态势数据  实时历史切换
    radioChange(e) {
      this.radioTime = e
      if (this.radioTime == '实时') {
        this.checkNowEng.forEach(i => {
          if (i.NM === 'KQ' && i.checkeds) {
            // 空情实时数据
            this.getQueryRealTimeAir()
          }
          if (i.NM === 'HQ' && i.checkeds) {
            // 海情实时数据
            this.getQueryRealTimeSea()
          }
          if (i.NM === 'BD' && i.checkeds) {
            // 北斗实时数据
            this.getQueryRealTimeBd()
          }
        })
        // 清除显示路径
        this.$refs.MapOl.removeLineAndMarkerById(this.seaGj)
        this.$refs.MapOl.removeLineAndMarkerById(this.airGj)
        this.$refs.MapOl.removeLineAndMarkerById(this.bdGj)
      } else { // 历史
        clearInterval(this.clearTimeSet)// 清除定时器
        clearInterval(this.clearTimeKQ)// 清除定时器
        clearInterval(this.clearTimeHQ)// 清除定时器
        this.$refs.MapOl.hideLayerById('HQ')
        this.$refs.MapOl.hideLayerById('KQ')
        this.$refs.MapOl.hideLayerById('BD')
      }
    },
    // 后勤保障
    allSupports(value) {
      this.getSelectedSupports(value)
    },
    // 后勤保障选中的数据
    getSelectedSupports(value) {
      const selectedResult = []
      this.support.forEach(item => {
        const result = value.filter(dataItem => dataItem === item.label)
        if (result.length > 0) {
          selectedResult.push(item.NM)
        }
      })
      this.selectedSupport = selectedResult
    },
    // 战场环境
    environments(value) {
      this.getSelectedenvironments(value)
    },
    // 战场环境选中的数据
    getSelectedenvironments(value) {
      const selectedResult = []
      this.environment.forEach(item => {
        const result = value.filter(dataItem => dataItem === item.label)
        if (result.length > 0) {
          selectedResult.push(item.NM)
        }
      })
      this.selectedEnvironment = selectedResult
    },
    // 战备工程选中时的点击事件
    handleCheckedCitiesChange(value) {
      this.getSelectedEngineer(value)
    },
    // 根据选中的数据获取对象列表
    getSelectedEngineer(data) {
      const selectedResult = []
      this.engineeringAll.forEach(item => {
        const result = data.filter(dataItem => dataItem === item.MC)
        if (result.length > 0) {
          selectedResult.push(item.GCFLNM)
        }
      })
      this.selectedEngineer = selectedResult
    },
    // 获取战备工程
    getCategory() {
      API.getCategory().then(res => {
        if (res.code === 200) {
          this.engineering = res.data.map(i => {
            return i.MC
          })
          this.allElection = [...this.engineering]
          this.engineeringAll = res.data
          this.selectedEngineer = res.data.map(item => {
            return item.GCFLNM
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取作战力量
    getQueryArmyService() {
      API.getQueryArmyServices().then(res => {
        const { data, code, msg } = res
        if (String(code) === '200') {
          this.queryArmy = data.map(i => {
            return i.MC
          })
          this.allQueryArmy = [...this.queryArmy]
          this.checkedAllData = data
          this.combatPowers = data.map(item => {
            return item.JZNM
          })
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 作战力量
    handleCheckedQueryArmyChange(value) {
      this.getSelectedQueryArmy(value)
    },
    // 作战力量选中的数据
    getSelectedQueryArmy(data) {
      const selectedResult = []
      this.checkedAllData.forEach(item => {
        const result = data.filter(dataItem => dataItem === item.MC)

        if (result.length > 0) {
          selectedResult.push(item.JZNM)
        }
      })
      this.combatPowers = selectedResult
    },
    // 点击地区盒子时清图层
    clear() {
      // this.$refs.MapOl.onHandleClear()
    },
    // 获取地区(我方)
    getAreaTree() {
      const data = {
        columnName: 'DMNM',
        tableName: 'ZZBZ_S_TY_DM',
        sync: true
      }
      API.getSync(data).then(res => {
        if (res.code === 200) {
          this.optionss = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取地区(敌方)
    getAreaTreeSecond() {
      const data = {
        columnName: 'GJDQNM',
        tableName: 'ZZBZ_S_TY_GJ',
        sync: true
      }
      API.getSync(data).then(res => {
        if (res.code === 200) {
          this.optionssSecond = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 点击子节点拿到ID(我方)
    handleChange(val) {
      this.demoCascaderArea = val
      // this.cascaderId = []
      const obj = this.$refs['demoCascaderArea'].getCheckedNodes()
      if (obj.length === 0) {
        return
      }
      this.cascaderId = obj.map((i) => {
        return i.value
      })
    },
    // 点击子节点拿到ID（敌方）
    handleChangeSecond(val) {
      const obj = this.$refs['demoCascaderAreaSeond'].getCheckedNodes()
      if (obj.length === 0) {
        return
      }
      console.log(this.cascaderIdSeond)
      this.cascaderIdSeond = obj.map((i) => {
        return i.value
      })
    },

    // getRowKey(row) {
    //   return row.id
    // },
    searchText() {
      const data = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        startDate: this.startDate,
        orderBy: this.orderBy,
        orderColumn: this.orderColumn,
        batchNumber: this.placeholderTextInput
      }
      if (this.radioValue === 'seaCondition') {
        this.getSeaList(data)
      } else if (this.radioValue === 'airCondition') {
        this.getAirList(data)
      } else if (this.radioValue === 'dipper') {
        this.getBdList(data)
      }
    },
    getSeaList(data) {
      API.getSeaList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.rows
        }
      })
    },
    getAirList(data) {
      API.getAirTableData(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.rows
        }
      })
    },
    getBdList(data) {
      API.getBdList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.rows
        }
      })
    },
    // 表格头排序
    renderHeader(h, { column, $index }) {
      return h('div', [
        h(
          'p',
          {
            style: 'width:100%;'
          },
          column.label
        ),
        h('div', {
          style: 'display: inline-block;position: relative;top: 3px;'
        },
        [
          h('i', {
            class: 'el-icon-caret-top',
            style: 'display: block;line-height: 0.5;',
            on: {
              click: () => {
                this.RowcaretTop(column, $index)
              }
            }
          }),
          h('i', {
            class: 'el-icon-caret-bottom',
            style: 'display: block;line-height: 0.5;',
            on: {
              click: () => {
                this.RowcaretBottom(column, $index)
              }
            }
          })
        ]),
        h('i', {
          class: 'el-icon-data-analysis',
          on: {
            click: () => {
              this.Rowdataanalysis(column, $index)
            }
          }
        })
      ])
    },
    // 升序
    RowcaretTop(column, index) {
      const keys = this.tableColumn.find(item => item.prop === column.property)
      const orderBys = 'ASC'
      const orderColumns = keys.key
      // this.getSeaTableData(orderBys, orderColumns)
      if (this.radioValue === 'seaCondition') {
        this.getSeaTableData(orderBys, orderColumns)
      } else if (this.radioValue === 'airCondition') {
        this.getAirTableData(orderBys, orderColumns)
      } else if (this.radioValue === 'dipper') {
        this.getDipperTableData(orderBys, orderColumns)
      }
    },
    // 降序
    RowcaretBottom(column, index) {
      const keys = this.tableColumn.find(item => item.prop === column.property)
      const orderBys = 'DESC'
      const orderColumns = keys.key
      // this.getSeaTableData(orderBys, orderColumns)
      if (this.radioValue === 'seaCondition') {
        this.getSeaTableData(orderBys, orderColumns)
      } else if (this.radioValue === 'airCondition') {
        this.getAirTableData(orderBys, orderColumns)
      } else if (this.radioValue === 'dipper') {
        this.getDipperTableData(orderBys, orderColumns)
      }
    },
    // 过滤
    Rowdataanalysis(column, index) {
      this.innerText = column.label
      this.propKey = column.property
      this.dialogVisible = true
    },
    // 确定
    confirm() {
      // this.getSeaTableData('', '', this.ruleForm.text, this.propKey)
      if (this.radioValue === 'seaCondition') {
        this.getSeaTableData('', '', this.ruleForm.text, this.propKey)
      } else if (this.radioValue === 'airCondition') {
        this.getAirTableData('', '', this.ruleForm.text, this.propKey)
      } else if (this.radioValue === 'dipper') {
        this.getDipperTableData('', '', this.ruleForm.text, this.propKey)
      }
      if (this.ruleForm.text !== '') {
        this.dialogVisible = false
      } else {
        this.$message.error('请输入要查询的条件！')
        return
      }
      this.ruleForm.text = ''
    },
    // 弹出框右上角叉号
    handleClose() {
      this.ruleForm.text = ''
      this.dialogVisible = false
    },
    // index配置   自定义序号
    indexMethod(index) {
      return index + this.pager.pageSize * (this.pager.pageNum - 1) + 1
    },
    showTable() {
      this.bShowTable = !this.bShowTable
    },
    // 点击列表的行
    tabRowClick(row, column, event) {
      this.getRowTableData(row)
    },
    // 获取态势信息表格的数据
    getRowTableData(row) {
      if (this.condition === 'seaCondition') {
        const data = {
          batchNumber: row.batchNumber,
          id: row.id,
          findTime: row.findTime,
          lastReceiveTime: row.lastReceiveTime
        }
        API.getSeaTrack(data).then(res => {
          this.bFirstLoadDipper = false
          this.bFirstLoadAir = false
          this.dialogTableVisible = true
          const { code, data, message } = res
          if (code === 200) {
            this.rowData = data
          } else {
            this.$message.error(message)
          }
        })
      } else if (this.condition === 'airCondition') {
        const data = {
          batchNumber: row.batchNumber,
          id: row.id,
          findTime: row.findTime,
          lastReceiveTime: row.lastReceiveTime
        }
        API.getAirTrack(data).then(res => {
          this.bFirstLoadDipper = false
          this.bFirstLoadSea = false
          this.dialogTableVisible = true
          const { code, data, message } = res
          if (code === 200) {
            this.rowData = data
          } else {
            this.$message.error(message)
          }
        })
      } else if (this.condition === 'dipper') {
        const data = {
          targetId: row.targetId,
          id: row.id,
          positioningStartTime: row.positioningStartTime,
          positioningEndTime: row.positioningEndTime
        }
        API.getBdTrack(data).then(res => {
          this.bFirstLoadDipper = false
          this.bFirstLoadSea = false
          this.dialogTableVisible = true
          const { code, data, message } = res
          if (code === 200) {
            this.rowData = data
          } else {
            this.$message.error(message)
          }
        })
      }
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pager.pageSize = val
      // 获取空情
      this.getAirTableData()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.tableData = this.allTabData.slice((val - 1) * 10, val * 10)
      this.pager.pageNum = val
      if (this.condition === 'seaCondition') {
        this.getSeaTableData()
      } else if (this.condition === 'airCondition') {
        this.getAirTableData()
      } else if (this.condition === 'dipper') {
        this.getDipperTableData()
      }
    },
    // 切换tab：海情 空情 北斗
    onChangeTab(value) {
      this.wzChecked = false
      this.radioValue = value
      this.pager.pageNum = 1,
      this.pager.pageSize = 10
      // 清空所有图层
      // this.$refs.MapOl.onHandleClear()
      // 重新加载选中的数据
      if (value === 'seaCondition') {
        this.placeholderText = '请输入批号'
        this.getSeaTableData(this.pager.pageNum, this.pager.pageSize)
        this.seaData.forEach(i => {
          // 隐藏路径 清除点和线
          this.$refs.MapOl.removeLineAndMarkerById(i.batchNumber)
        })
      } else if (value === 'airCondition') {
        this.placeholderText = '请输入批号'
        this.getAirTableData(this.pager.pageNum, this.pager.pageSize)
        this.airData.forEach(i => {
          // 隐藏路径
          this.$refs.MapOl.removeLineAndMarkerById(i.batchNumber)
        })
      } else {
        this.placeholderText = '请输入北斗ID号'
        this.getDipperTableData(this.pager.pageNum, this.pager.pageSize)
        this.deepData.forEach(i => {
          // 隐藏路径
          this.$refs.MapOl.removeLineAndMarkerById(i.targetId)
        })
      }
    },
    // 选择表格数据
    onSelectTableRow(selection, row) {
      if (this.condition === 'seaCondition') {
        this.seaData = selection
        const checkItem = selection.find(item => item.batchNumber === row.batchNumber)

        if (checkItem) {
          // 显示路径
          this.getSeaTrack(checkItem)
        } else {
          // 隐藏路径 清除点和线
          this.$refs.MapOl.removeLineAndMarkerById(row.batchNumber)
        }
      } else if (this.condition === 'airCondition') {
        this.airData = selection
        const checkItem = selection.find(item => item.batchNumber === row.batchNumber)
        if (checkItem) {
          // 显示路径
          this.getAirTrack(checkItem)
        } else {
          // 隐藏路径
          this.$refs.MapOl.removeLineAndMarkerById(row.batchNumber)
        }
      } else {
        this.deepData = selection
        const checkItem = selection.find(item => item.targetId === row.targetId)
        if (checkItem) {
          // 显示路径
          this.getBdTrack(checkItem)
        } else {
          // 隐藏路径
          this.$refs.MapOl.removeLineAndMarkerById(row.targetId)
        }
      }
    },
    // 表格全选
    onSelectTableRowAll(selection) {
      this.$refs.MapOl.onHandleClear()
      if (selection.length > 0) {
        selection.forEach(item => {
          if (this.condition === 'seaCondition') {
            this.getSeaTrack(item)
          } else if (this.condition === 'airCondition') {
            this.getAirTrack(item)
          } else {
            this.getBdTrack(item)
          }
        })
      }
    },
    // 根据时间搜索
    searchTime(value) {
      this.startDate = value
      if (this.condition === 'seaCondition') {
        this.getSeaTableData()
      } else if (this.condition === 'airCondition') {
        this.getAirTableData()
      } else if (this.condition === 'dipper') {
        this.getDipperTableData()
      }
    },
    // 获取海情表格的数据
    getSeaTableData(pageNums, pageSizes, orderBy, orderColumn, texts, propKey) {
      this.tableColumn = seaColumn
      if (orderBy && orderColumn) {
        this.orderBy = orderBy
        this.orderColumn = orderColumn
      } else {
        // 排序
        this.orderBy = ''
        // 列名
        this.orderColumn = ''
      }
      let dataList = {}
      if (texts !== undefined) {
        // 动态改变对象的key值
        var datas = {}
        datas[propKey] = texts
        dataList = datas
      } else {
        dataList = {}
      }
      let data = {}
      // const data = dataList
      if (pageNums !== undefined && pageSizes !== undefined) {
        this.pager.pageNum = pageNums
        this.pager.pageSize = pageSizes
      }
      if (dataList !== {}) {
        data = {
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          startDate: this.startDate,
          orderBy: this.orderBy,
          orderColumn: this.orderColumn
        }
      } else {
        data = Object.assign(data, dataList)
      }
      API.getSeaList(data).then(res => {
        const { code, rows, msg, total } = res
        if (code === 200) {
          // 所有表格数据
          this.allTabData = rows
          // 当前页表格数据
          this.tableData = this.allTabData.slice(0, 10)
          this.pager.total = total
          // 获取海情路径
          if (this.tableData && this.tableData.length > 0 && orderBy === undefined) {
            if (this.seaData.length <= 0) {
              this.$nextTick(() => {
                // this.$refs.multipleTable.toggleRowSelection(this.tableData[0])
              })
            } else {
              this.$nextTick(() => {
                this.seaData.forEach(row => {
                  // row.checked = true
                  // if (row.checked) {
                  // this.$refs.multipleTable.toggleRowSelection(this.tableData.find(item => row.id === item.id), true)
                  // }
                })
              })
            }
            // 切换海情按钮默认显示第一条数据
            // this.getSeaTrack(this.tableData[0])
          } else {
            this.$refs.MapOl.onHandleClear()
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取空情表格的数据
    getAirTableData(pageNums, pageSizes, orderByOne, orderColumnOne, textsOne, propKeyOne) {
      this.tableColumn = airColumn

      if (orderByOne && orderColumnOne) {
        this.orderBy = orderByOne
        this.orderColumn = orderColumnOne
      } else {
        // 排序
        this.orderBy = ''
        // 列名
        this.orderColumn = ''
      }
      let dataList = {}
      if (textsOne !== undefined) {
        // 动态改变对象的key值
        var datas = {}
        datas[propKeyOne] = textsOne
        dataList = datas
      } else {
        dataList = {}
      }
      // const data = dataList
      // const orderBy = ''
      // const orderColumn = ''
      // const data = {
      //   pageNum: this.pager.pageNum,
      //   pageSize: this.pager.pageSize,
      //   startDate: this.startDate,
      //   orderBy: orderBy,
      //   orderColumn: orderColumn
      // }
      let data = {}
      // const data = dataList
      if (pageNums !== undefined && pageSizes !== undefined) {
        this.pager.pageNum = pageNums
        this.pager.pageSize = pageSizes
      }
      if (dataList !== {}) {
        data = {
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          startDate: this.startDate,
          orderBy: this.orderBy,
          orderColumn: this.orderColumn
        }
      } else {
        data = Object.assign(data, dataList)
      }
      API.getAirTableData(data).then(res => {
        const { code, rows, msg, total } = res
        if (code === 200) {
          // 所有表格数据
          this.allTabData = rows
          // 当前页表格数据
          this.tableData = this.allTabData.slice(0, 10)
          this.pager.total = total
          // 获取空情路径
          if (this.tableData && this.tableData.length > 0 && orderByOne === undefined) {
            if (this.airData.length <= 0) {
              this.$nextTick(() => {
                // this.$refs.multipleTable.toggleRowSelection(this.tableData[0])
              })
            } else {
              this.$nextTick(() => {
                this.airData.forEach(row => {
                  // row.checked = true
                  // if (row.checked) {
                  // this.$refs.multipleTable.toggleRowSelection(this.tableData.find(item => row.id === item.id), true)
                  // }
                })
              })
            }
            // 切换空情按钮默认显示第一条数据
            // this.getAirTrack(this.tableData[0])
          } else {
            this.$refs.MapOl.onHandleClear()
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取北斗表格的数据
    getDipperTableData(pageNums, pageSizes, orderByTwo, orderColumnTwo, textsTwo, propKeyTwo) {
      this.tableColumn = dipperColumn
      if (orderByTwo && orderColumnTwo) {
        this.orderBy = orderByTwo
        this.orderColumn = orderColumnTwo
      } else {
        // 排序
        this.orderBy = ''
        // 列名
        this.orderColumn = ''
      }
      let dataList = {}
      if (textsTwo !== undefined) {
        // 动态改变对象的key值
        var datas = {}
        datas[propKeyTwo] = textsTwo
        dataList = datas
      } else {
        dataList = {}
      }
      // const data = dataList
      // const orderBy = ''
      // const orderColumn = ''
      // const data = {
      //   pageNum: this.pager.pageNum,
      //   pageSize: this.pager.pageSize,
      //   startDate: this.startDate,
      //   orderBy: orderBy,
      //   orderColumn: orderColumn
      // }
      let data = {}
      // const data = dataList
      if (pageNums !== undefined && pageSizes !== undefined) {
        this.pager.pageNum = pageNums
        this.pager.pageSize = pageSizes
      }
      if (dataList !== {}) {
        data = {
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize,
          startDate: this.startDate,
          orderBy: this.orderBy,
          orderColumn: this.orderColumn
        }
      } else {
        data = Object.assign(data, dataList)
      }
      API.getBdList(data).then(res => {
        const { code, rows, msg, total } = res
        if (code === 200) {
          // 所有表格数据
          this.allTabData = rows
          // 当前页表格数据
          this.tableData = this.allTabData.slice(0, 10)
          this.pager.total = total
          // 获取北斗路径
          if (this.tableData && this.tableData.length > 0 && orderByTwo === undefined) {
            if (this.deepData.length <= 0) {
              this.$nextTick(() => {
                // .toggleRowSelection(this.tableData[0])
              })
            } else {
              this.$nextTick(() => {
                this.deepData.forEach(row => {
                  // row.checked = true
                  // if (row.checked) {
                  // this.$refs.multipleTable.toggleRowSelection(this.tableData.find(item => row.id === item.id), true)
                  // }
                })
              })
            }
            // 切换北斗按钮默认显示第一条数据
            // this.getBdTrack(this.tableData[0])
          } else {
            this.$refs.MapOl.onHandleClear()
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取海情路径
    getSeaTrack(params) {
      let data = {}
      if (this.wzChecked) {
        data = {
          batchNumber: params.batchNumber,
          id: params.id,
          findTime: params.findTime,
          lastReceiveTime: params.lastReceiveTime,
          isCloak: 1
        }
      } else {
        data = {
          batchNumber: params.batchNumber,
          id: params.id,
          findTime: params.findTime,
          lastReceiveTime: params.lastReceiveTime,
          isCloak: 0
        }
      }
      API.getSeaTrack(data).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          const lineData = []
          data.forEach(item => {
            lineData.push([item.longitude, item.latitude])
          })
          // 加载矢量数据 图片  图片经纬度   所有经纬度（用来划线）  类似id
          // this.$refs.MapOl.addLineAndMarker(airplaneImage, [params.longitude, params.latitude], lineData, params.batchNumber)
          this.$refs.MapOl.addLineAndMarker(airplaneImage, lineData[0], lineData, params.batchNumber)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取空情路径
    getAirTrack(params) {
      let data = {}
      if (this.wzChecked) {
        data = {
          batchNumber: params.batchNumber,
          id: params.id,
          findTime: params.findTime,
          lastReceiveTime: params.lastReceiveTime,
          isCloak: 1
        }
      } else {
        data = {
          batchNumber: params.batchNumber,
          id: params.id,
          findTime: params.findTime,
          lastReceiveTime: params.lastReceiveTime,
          isCloak: 0
        }
      }
      API.getAirTrack(data).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          const lineData = []
          data.forEach(item => {
            lineData.push([item.longitude, item.latitude])
          })
          // 加载矢量数据
          this.$refs.MapOl.addLineAndMarker(airplaneImage, lineData[0], lineData, params.batchNumber)
          // this.$refs.MapOl.addLineAndMarker(airplaneImage, [params.longitude, params.latitude], lineData, params.batchNumber)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取北斗路径
    getBdTrack(params) {
      let data = {}
      if (this.wzChecked) {
        data = {
          targetId: params.targetId,
          id: params.id,
          positioningStartTime: params.positioningStartTime,
          positioningEndTime: params.positioningEndTime,
          isCloak: 1
        }
      } else {
        data = {
          targetId: params.targetId,
          id: params.id,
          positioningStartTime: params.positioningStartTime,
          positioningEndTime: params.positioningEndTime,
          isCloak: 0
        }
      }
      API.getBdTrack(data).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          const lineData = []
          data.forEach(item => {
            lineData.push([item.longitude, item.latitude])
          })
          // 加载矢量数据
          this.$refs.MapOl.addLineAndMarker(airplaneImage, lineData[0], lineData, params.targetId)
          // this.$refs.MapOl.addLineAndMarker(airplaneImage, [params.longitude, params.latitude], lineData, params.targetId)
        } else {
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.WZcheck{
    width: 66px;
    margin-left: 10px;
    font-weight: bold;
    border-radius: 4px;
    text-align: center;
    height: 28px;
    font-size: 12px;
    line-height: 28px;
    margin-top: 5px;
    border: 1px solid #dcdfe6;
}
>>> .el-form-item__content{
  display: flex;
}
>>> .el-dialog__body{
  height:695px;
  overflow:auto;
  overflow-x:hidden
}
>>> .el-radio-button__orig-radio:checked+.el-radio-button__inner{
  background-color: #1f7cd7;
}
>>> .el-dialog__header{
 // padding: 20px;
}
>>> .el-loading-text{
  font-size: 20px;
  font-weight: bold;
}
>>> .el-table__body-wrapper{
  height: 262px !important;
}
.demo-form-inline{
  >>> .el-form-item:nth-child(2){
    margin-right:0
  }
  >>> .el-form-item__label{
    color:#fff;
    font-size: 16px;
    font-weight: normal;
  }
}

#map {
  padding: 0px;
  position: relative;
  .distance-container {
    position: absolute;
    background: #ffffff8a;
    color: #3a8ee6 !important;
    top: 44px;
    right: 832px;
    font-size: 25px;
    z-index: 1;
    font-weight: bold;
  }
}
.junbiao{
    position: absolute;
    top: 81px;
    height: 43px;
    line-height: 43px;
    border-radius: 6px;
    right: 250px;
    background: rgba(0,0,0,.5);
    z-index: 12;
    padding: 0 5px;
    color: white;
    border:none
}
.timeSearch {
  position: absolute;
  top: 66px;
  left: 330px;
  z-index: 1;
}
.tableTop {
  height: 38px;
  //padding-top: 7px;
  background: #fff;
  display: flex;
  //justify-content: flex-end;
  margin-right: 55px;
}
%tableIcon {
  font-size: 25px;
  position: absolute;
  top: 8px;
  right: 15px;
}
.showTableIcon {
  @extend %tableIcon;
  transform: rotate(-90deg);
}
.hideTableIcon {
  @extend %tableIcon;
  transform: rotate(90deg);
}
.search {
  display: inline-block;
  width: 250px;
  top: -3px;
  left: 50px;
  position: relative;
}
.table {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 50%;
  background:white;
  z-index: 999;
}
.el-dialog__header {
  height: 38px;
  background: #409eff;
  line-height: 33px;
  padding-left: 15px;
  padding: 3px 0 0 15px;
}
.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #fff;
}
.el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
.el-dialog__headerbtn {
  top: 11px;
}

.el-dialog__body {
  padding: 20px 20px;
}
.el-dialog__footer {
  padding: 0px 20px 20px 20px;
}
.pager-section {
  background: #fff;
}
.satelliteBtn {
  position: relative;
  bottom: 6px;
  left: 18px;
}
.left {
  position: absolute;
  left: 41px;
  top: 66px;
  z-index: 1;
  //background: #fff;
  //width: 231px;
  //height: 688px;
  //border-radius: 8px;
  .suppliabledif {
    //width: 251px;
    //height: 545px;
    overflow: hidden;
    //padding: 0 24px;
    .box {
      display:flex;
      padding: 0 0px 13px 0px;
      //border-bottom: 1px solid #ddd;
    }
  }
}
.text{
  line-height:40px;
}
.dialogRight{
display:flex;
flex-wrap: wrap;
p{
  width:50%;
}
.situationItem {
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
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
      line-height: 15px;
      display: inline-block;
    }

  }
  .zzlldetail{
    .nmZZLL{
      :hover{
        width:100px !important;
        height:20px !important;
        background:red !important;
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
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
.qiefen-dialog-class {
  position: absolute;
  width: 362px;
  z-index: 999;
  right: 30px;
  bottom: 127px;
  background: rgba(255, 255, 255, 0.2);
  p{
    height:30px;
    line-height:30px
  }

  p:nth-last-of-type(1) {
    height: 50px;
    line-height: 50px;
  }
}
.qiefen-dialog-class {
  p {
    width: 70px;
    height: 30px;
    line-height: 30px;
    text-align: right;
  }
  p:nth-last-of-type(1) {
    height: 50px;
    line-height: 50px;
  }
  a {
    margin-left: 90px;
  }
  .demo-ruleForm{
    >>>.el-input__inner{
      height: 32px;
    }
  }
  .dialog-footer{
    button{
      width: 64px;
      height: 34px;
    }
  }
}

}
</style>
