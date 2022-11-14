<template>
  <Container>
    <div class="dataClean">
      <el-card shadow="never" style="height: 100%; overflow: auto">
        <!-- 顶部tab切换 -->
        <div class="top">
          <div>
            <el-radio-group v-model="radio" size="medium" @change="changeTabs">
              <el-radio-button label="一键审查" />
              <el-radio-button label="数据审查" />
              <el-radio-button label="一致性对比" />
            </el-radio-group>
          </div>
        </div>
        <el-divider />
        <!-- 一键审查 -->
        <div v-if="radio == '一键审查'" class="keyReview" style="display:flex">
          <!-- 一键审查规则 -->
          <div class="formRule" style="width: 34%;margin-right: 99px;">
            <div style="margin:0 10px 10px 0;display:flex;">
              <el-button
                plain
                @click="resetForm('formLabelAlign')"
              >重置</el-button>
              <div style="margin-left: 10px;">
                <img
                  style="
                    width: 20px;
                    height: 20px;
                    margin-top:6px
                  "
                  src="../../../icons/newImages/zhedie.png"
                  alt=""
                  @click="xinzen"
                >
              </div>
            </div>
            <div style="height: 443px;overflow:auto;overflow-x:hidden">
              <el-checkbox-group v-model="checkList">
                <el-checkbox style="display: block;margin: 10px;" v-for="(item,index) in  checkListData" :key="index" :label="item.name" @change="yjscChange(item,$event)"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div style="width:60%">
            <template>
              <el-tabs v-if="array.length>0" v-model="activeNameRule" :table-list="tabsLableRule" type="card" @tab-click="handleClick">
                <el-tab-pane v-for="(item) in tabsLableRule" :key="item.id" :label="item.name" :name="item.id" />
              </el-tabs>
            </template>
            <!-- 表格内容 -->
            <div v-if="array.length>0 && tableData.length>0" class="table-bon">
              <div class="table-section">
                <!-- @select="onHandleSelect" -->
                <el-table
                  class="yjscTabls"
                  ref="multipleTable"
                  border
                  stripe
                  height="70%"
                  :data="tableData"
                  tooltip-effect="dark"
                >
                  <el-table-column
                    type="selection"
                    :visible.sync="dialogVisibleCheck"
                    width="55"
                  />
                  <el-table-column
                    v-for="(item, index) in tableCol.value"
                    :key="index"
                    :label="item"
                    :prop="item"
                    align="center"
                    show-overflow-tooltip
                  />
                </el-table>

              </div>
              <!-- 分页 -->
              <div class="pager-section">
                <el-pagination
                  style="float: right; margin-top: 35px; margin-bottom: 70px"
                  :current-page="pager.pageNum"
                  :page-sizes="pager.pageSizes"
                  :page-size="pager.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="pager.total"
                  @size-change="handleSizeChangeReview"
                  @current-change="handleCurrentChangeReview"
                />
              </div>
            </div>
            <div
              v-else
              style="width:100%;height:150px;font-size:10px;color:#a9a9a9;border:1px solid #e6e6e6;text-align:center;line-height:150px"
            >
              暂无数据
            </div>
          </div>
          
        </div>





        
        <!-- 数据审查 -->
        <div
          v-if="radio == '数据审查'"
          class="dataReview"
          style="display: flex"
        >
          <!-- 数据审查 -->
          <!-- 左边树状结构列表 -->
          <div
            class="tree-box"
            style="border-radius: 5px;height: calc(100vh - 300px);width:350px;"
          >
            <el-input
              v-model="filterText"
              style="padding: 5px 0"
              prefix-icon="el-icon-search"
              placeholder="输入要搜索内容..."
            />
            <el-scrollbar style="height: calc(100vh - 300px);">
              <el-tree
                ref="tree"
                class="filter-tree"
                style="height: calc(100vh - 300px);width:655px;"
                node-key="id"
                :data="treeData"
                show-checkbox
                :props="treeProps"
                :filter-node-method="filterNode"
                :default-checked-keys="keys"
                default-expand-all
                check-on-click-node
                @node-click="nodeClick"
                @check-change="check"
              />
            </el-scrollbar>
          </div>
          <div class="dataReviewRight" style="flex-grow: 1">
            <el-button
              :disabled="saveDisable"
              type="primary"
              style="margin-left: 32px;margin-bottom:12px;"
              @click="jisuan"
            >填报计算</el-button>
            <el-button
              :disabled="repectDisable"
              type="primary"
              style="margin-left: 20px;margin-bottom:12px;"
              @click="repetJisuan"
            >重复计算</el-button>

            <!-- tabs切换表 -->
            <el-tabs v-model="editableTabsValue" :table-list="tabsLable" type="card" style="margin-left:32px;width:1270px;" @tab-click="topRadioChange">
              <el-tab-pane
                v-for="(item) in tabsLable"
                :key="item.tableName"
                :label="item.label"
                :name="item.tableName"
              />
            </el-tabs>
            <!-- 表格内容 -->
            <div class="table-bon" style="margin-left: 32px;">
              <template v-if="tabsLable && tabsLable.length>0">
                <div class="table-section">
                  <el-table
                    ref="multipleTable"
                    border
                    stripe
                    :data="tableDataReview"
                    tooltip-effect="dark"
                    style="width: calc(100vw - 646px);"
                  >
                    <template v-for="(item, index) in tableColReview">
                      <el-table-column
                        :key="item.columnName+index"
                        :label="item.columnComment"
                        :prop="item.columnName"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                      >
                        <template v-slot:header="scope">
                          <el-checkbox v-model="tableColReview[scope.$index].isChecked" />
                          {{ item.columnComment }}
                          <div style="display: inline-block;position: relative;top: 3px;">
                            <span style="display: block;line-height: 0.5;" class="el-icon-caret-top" @click="RowcaretTop(tableColReview[scope.$index], scope.$index)" />
                            <span style="display: block;line-height: 0.5;" class="el-icon-caret-bottom" @click="RowcaretBottom(tableColReview[scope.$index], scope.$index)" />
                          </div>

                          <span class="el-icon-data-analysis" @click="Rowdataanalysis(tableColReview[scope.$index], scope.$index)" />
                        </template>
                      </el-table-column>
                    </template>
                  </el-table>
                </div>
                <div class="pager-section">
                  <el-pagination
                    style="float: right; margin-top: 20px; margin-bottom: 20px"
                    :current-page="pager.pageNum"
                    :page-sizes="pager.pageSizes"
                    :page-size="pager.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pager.total"
                    @size-change="handleSizeChangeData"
                    @current-change="repetHandleCurrentChange"
                  />
                </div>
                <hr
                  style="
                    margin-top: 72px;
                    background-color: #e8e9ee;
                    height: 1px;
                    border: none;
                  "
                >
              </template>
              <div v-else style="height:300px;font-size:12px;text-align:center;border:1px solid #e6e6e6;line-height:150px;color:rgb(169, 169, 169);">暂无数据</div>
            </div>
            <div class="dataReviewBottom">
              <p style="margin-left: 32px">计算结果</p>

              <div v-if="disables=='填报计算'">
                <el-button
                  :disabled="exportDisables"
                  type="primary"
                  style="margin-left: 32px;margin-bottom:12px;"
                  @click="exportReview"
                >填报率导出</el-button>
                <!-- tabs切换表 -->
                <el-tabs v-model="editableTabsValueExport" :table-list="tabsLableExport" type="card" style="margin-left:32px;width:1270px;" @tab-click="topRadioExport">
                  <el-tab-pane
                    v-for="(item) in tabsLableExport"
                    :key="item.tableName"
                    :label="item.label"
                    :name="item.tableName"
                  />
                </el-tabs>

                <!-- 表格内容 -->
                <div
                  class="table-bon"
                  style="margin-left: 32px; width: 1276px"
                >
                  <div v-if="tianBaoData.length > 0" class="table-section">
                    <el-table
                      ref="multipleTable"
                      border
                      stripe
                      :data="tianBaoData"
                      tooltip-effect="dark"
                      style="width: 100%"
                    >
                      <el-table-column label="统计项" fixed width="150">
                        <template slot-scope="scope">{{ scope.row.labels }}</template>
                      </el-table-column>
                      <el-table-column
                        v-for="(item, index) in tianBaoReviewData"
                        :key="'index2'+index"
                        :label="item.comments"
                        :prop="item.columnName"
                        min-width="150"
                        show-overflow-tooltip
                      />
                    </el-table>
                  </div>
                  <div
                    v-else
                    style="width:100%;height:150px;border:1px solid #e6e6e6;font-size:10px;color:#a9a9a9;text-align:center;line-height:150px"
                  >
                    暂无数据
                  </div>
                </div>
              </div>

              <div v-else>
                <el-button
                  type="primary"
                  style="margin-left: 32px;margin-top:15px;margin-bottom:12px;"
                  @click="exportRepeatReview"
                >重复率导出</el-button>
                <el-tabs v-model="editableTabsValue" :table-list="tabsLable" type="card" style="margin-left:32px;width:1270px;" @tab-click="topRadioChangeExport">
                  <el-tab-pane
                    v-for="(item) in tabsLable"
                    :key="item.tableName"
                    :label="item.label"
                    :name="item.tableName"
                  />
                </el-tabs>
                <!-- 表格内容 -->
                <div class="table-bon" style="margin-left: 32px">
                  <div class="table-section">
                    <el-table
                      ref="multipleTable"
                      border
                      stripe
                      :data="tableDataRepeat"
                      tooltip-effect="dark"
                      style="width:  calc(100vw - 646px)"
                    >
                      <el-table-column
                        v-for="(item) in tableColReviewBottom"
                        :key="item.columnName"
                        :label="item.comments"
                        :prop="item.columnName"
                        min-width="150"
                        align="center"
                        show-overflow-tooltip
                      />
                    </el-table>
                  </div>
                  <div class="pager-section">
                    <el-pagination
                      style="float: right; margin-top: 20px; margin-bottom: 20px"
                      :current-page="pagerRepact.pageNum"
                      :page-sizes="pagerRepact.pageSizes"
                      :page-size="pagerRepact.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="pagerRepact.total"
                      @size-change="handleSizeChangeRepeat"
                      @current-change="handleCurrentChangeRepeat"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <!-- 一致性对比 -->
        <div
          v-if="radio == '一致性对比'"
          class="consistencyContrast"
          style="display: flex"
        >
          <!-- 本系统数据库 -->
          <div
            class="contrastLeft"
            style="
              width: 50%;
              height: 80%;
              background-color: #fafafa;
              border-radius: 5px;
              border: 1px solid #e6e6e6;
              padding: 14px 30px 20px 25px;
            "
          >
            <el-form
              :inline="true"
              class="demo-form-inline"
              style="display:flex;flex-direction: column;"
            >
              <el-form-item class="elFormItem" label="源 库:" label-width="73px">
                <el-input
                  :disabled="true"
                  style="width:430px"
                  placeholder="本系统数据库"
                />
              </el-form-item>
              <el-form-item label="选择表:" label-width="73px">
                <el-select v-model="value22" style="width:430px;" filterable placeholder="请选择" @change="tableZiDuan">
                  <!-- :options="options_cascader" -->
                  <el-option
                    v-for="(item,index) in optionsTable"
                    :key="index"
                    :label="item.TABLENAME"
                    :value="item.SHOWNAME"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="选择字段:" label-width="73px">
                <el-select v-model="optionsZiDuanCol" style="width:430px;" filterable multiple collapse-tags placeholder="请选择" @change="ziduanCol">
                  <el-option
                    v-for="(item,index) in optionsTableZiDuan"
                    :key="'index5'+index"
                    :label="item.comments"
                    :value="item.columnName"
                  />
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="margin-left:17px;vertical-align: top;" @click="search">查询</el-button>
              </el-form-item>
            </el-form>

            <!-- 表格内容 -->
            <div class="table-bon" style="margin-top: 15px">
              <div class="table-section">
                <el-table
                  ref="multipleTable"
                  border
                  stripe
                  height="450"
                  :data="tableDataZiDuan"
                  tooltip-effect="dark"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="(item, index) in optionsZiDuanCols"
                    :key="'index6'+index"
                    :label="optionsTableZiDuan.find((e)=>e.columnName==item).comments"
                    :prop="item"
                    align="center"
                    width="150"
                    show-overflow-tooltip
                  />
                </el-table>
              </div>
            </div>
            <div class="pager-section">
              <el-pagination
                style="float: right; margin-top: 35px; margin-bottom: 30px"
                :current-page="pager.pageNum"
                :page-sizes="pager.pageSizes"
                :page-size="pager.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pager.total"
                @size-change="handleSizeChangeContrast"
                @current-change="handleCurrentChangeYiZhi"
              />
            </div>
          </div>
          <!-- 对比源库 -->
          <div
            class="contrastRight"
            style="
              margin-left: 35px;
              width: 49%;
              height: 80%;
              background-color: #fafafa;
              border-radius: 5px;
              border: 1px solid #e6e6e6;
              padding: 14px 30px 20px 25px;
            "
          >
            <el-form
              :inline="true"
              class="demo-form-inline"
              style="display:flex;flex-direction: column;position:relative"
            >
              <el-form-item label="对比库:" label-width="73px">
                <el-select v-model="formInline" style="width:430px" filterable placeholder="请选择" @change="comparDataBase">
                  <el-option
                    v-for="(item,index) in optionsCompar"
                    :key="'index11'+index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>

              </el-form-item>
              <i
                class="el-icon-circle-plus-outline"
                style="color: #999999; font-size: 20px;position: absolute;right: 210px;top: 7px;"
                @click="xinzenAdd"
              />
              <i
                class="el-icon-s-fold"
                style="color: #999999; margin: 0 15px 0 10px; font-size: 20px;position: absolute;right: 160px;top: 6px;"
                @click="zhankai"
              />

              <el-form-item label="选择表:" label-width="73px">
                <el-select v-model="valueContrast1" style="width:430px" filterable placeholder="请选择" @change="tableZiDuanCompar">
                  <el-option
                    v-for="(item,index) in optionsComparTable"
                    :key="index"
                    :label="item.TABLE_COMMENT"
                    :value="item.TABLE_NAME"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="选择字段:" label-width="73px">
                <el-select v-model="comparZiDuanCol" style="width:430px" filterable multiple collapse-tags placeholder="请选择" @change="ziduanColCompar">
                  <el-option
                    v-for="(item,index) in comparTableZiDuan"
                    :key="'index55'+index"
                    :label="item.COLUMN_COMMENT"
                    :value="item.COLUMN_NAME"
                  />
                </el-select>
                <el-button type="primary" icon="el-icon-search" style="margin-left:17px;vertical-align: top;" @click="searchCompar">查询</el-button>
              </el-form-item>

            </el-form>

            <!-- 表格内容 -->
            <div class="table-bon" style="margin-top: 15px">
              <div class="table-section">
                <el-table
                  ref="multipleTable"
                  border
                  stripe
                  height="450"
                  :data="tableDataZiDuanCompar"
                  tooltip-effect="dark"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="(item, index) in comparZiDuanCols"
                    :key="'index6'+index"
                    :label="comparTableZiDuan.find((e)=>e.COLUMN_NAME==item).COLUMN_COMMENT"
                    :prop="item"
                    width="150"
                    align="center"
                    show-overflow-tooltip
                  />
                </el-table>
              </div>
            </div>
            <div class="pager-section">
              <el-pagination
                style="float: right; margin-top: 35px; margin-bottom: 30px"
                :current-page="pagerDuiBi.pageNum"
                :page-sizes="pagerDuiBi.pageSizes"
                :page-size="pagerDuiBi.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagerDuiBi.total"
                @size-change="handleSizeChangeCompar"
                @current-change="handleCurrentChangeContrast"
              />
            </div>
          </div>
        </div>

        <!-- 一键审查模态框 -->
        <el-dialog
          class="qiefen-dialog-class"
          title="一键审查规则管理"
          :visible.sync="dialogVisible"
          width="45%"
          top="10px"
          :before-close="handleClose"
        >
          <div class="tab-bon">
            <div class="table-section">
              <el-table
                :data="gridData"
                border
                stripe
                height="550"
                highlight-current-row
                @row-click="handleCurrentChangeRow"
              >
                <el-table-column
                  prop="name"
                  label="规则名称"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="sql"
                  label="SQL语句"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="remark"
                  label="备注"
                  width="150"
                  show-overflow-tooltip
                />
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click.stop="deleteRule(scope.row, 0)"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </div>
          <div class="pager-section">
            <el-pagination
              style="float: right; margin-top: 35px; margin-bottom: 30px"
              :current-page="yjsc.pageNum"
              :page-sizes="yjsc.pageSizes"
              :page-size="yjsc.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="yjsc.total"
              @size-change="handleSizeChangeDialog1"
              @current-change="handleCurrentChangeDialog"
            />
          </div>

          <div>
            <el-form v-model="currentRow" style="margin-top: 100px">
              <el-form-item label="规则名称" :label-width="formLabelWidth">
                <el-input
                  v-model="currentRow.name"
                  type="textarea"
                  autocomplete="off"
                  clearable
                />
              </el-form-item>
              <el-form-item label="SQL语句" :label-width="formLabelWidth">
                <el-input v-model="currentRow.sql" type="textarea" clearable />
              </el-form-item>
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input
                  v-model="currentRow.remark"
                  type="textarea"
                  autocomplete="off"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="save">保 存</el-button>
          </span>
        </el-dialog>

        <!-- 一致性对比新增模态框 -->
        <el-dialog
          class="qiefen-dialog-class"
          title="对比库信息"
          :visible.sync="dialogVisibleAdd"
          width="45%"
          :before-close="handleCloseAdd"
        >
          <el-form :model="formDuiBi" style="margin-top: 20px;">
            <el-form-item label="对比库名称" label-width="115px">
              <el-input v-model="formDuiBi.name" style="width:95%" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item label="数据库类型" label-width="115px">
              <el-select v-model="value" placeholder="请选择" style="width:95%" @change="selDuiBi">
                <el-option
                  v-for="item in duiBi"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="数据库IP" label-width="115px">
              <el-input v-model="formDuiBi.ip" style="width:95%" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item label="数据库端口" label-width="115px">
              <el-input v-model="formDuiBi.port" style="width:95%" clearable />
            </el-form-item>
            <el-form-item label="用户名" label-width="115px">
              <el-input v-model="formDuiBi.username" style="width:95%" clearable />
            </el-form-item>
            <el-form-item label="密码" label-width="115px">
              <el-input v-model="formDuiBi.password" style="width:95%" type="password" clearable />
            </el-form-item>
            <el-form-item label="数据库名/实例名" label-width="115px">
              <el-input v-model="formDuiBi.database" clearable style="width:95%" />
            </el-form-item>
            <el-form-item label="备注" label-width="115px">
              <el-input v-model="formDuiBi.remark" style="width:95%" clearable />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">

            <el-button @click="addCancel">取 消</el-button>
            <el-button
              type="primary"
              @click="insertBase"
            >确 定</el-button>
          </span>
        </el-dialog>
        <!-- 一致性对比展开模态框 -->
        <el-dialog
          class="qiefen-dialog-class"
          title="对比库信息管理"
          :visible.sync="dialogVisibleZhankai"
          width="45%"
          top="20px"
          :before-close="zhankaiCancel"
        >
          <div class="tab-bon">
            <div class="table-section">
              <el-table
                :data="duiBiBaseData"
                border
                height="250"
                stripe
                highlight-current-row
                @row-click="handleChangeRow"
              >
                <el-table-column
                  property="name"
                  label="对比库名称"
                  show-overflow-tooltip
                />
                <el-table-column
                  property="databaseType"
                  label="数据库类型"
                  show-overflow-tooltip
                />
                <el-table-column
                  property="ip"
                  label="数据库IP"
                  show-overflow-tooltip
                />
                <el-table-column
                  property="port"
                  label="数据库端口"
                  show-overflow-tooltip
                />
                <el-table-column
                  property="username"
                  label="用户名"
                  show-overflow-tooltip
                />
                <el-table-column
                  property="database"
                  min-width="130"
                  label="数据库名/实例名"
                  show-overflow-tooltip
                />
                <el-table-column
                  property="remark"
                  label="备注"
                  show-overflow-tooltip
                />
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="onHandleEdit(scope.row, 0)"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pager-section">
              <el-pagination
                style="float: right; margin-top: 20px; margin-bottom: 30px"
                :current-page="pagerDuiBiXinXi.pageNum"
                :page-sizes="pagerDuiBiXinXi.pageSizes"
                :page-size="pagerDuiBiXinXi.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagerDuiBiXinXi.total"
                @size-change="handleSizeChange"
                @current-change="handleChangeRowZhankai"
              />
            </div>
          </div>

          <el-form :model="currentRows" style="margin-top: 20px;margin-top:80px">
            <el-form-item label="对比库名称" label-width="115px">
              <el-input v-model="currentRows.name" style="width:95%" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item label="数据库类型" label-width="115px">
              <!-- <el-input v-model="currentRows.databaseType" style="width:95%" clearable /> -->
              <el-select v-model="currentRows.databaseType" style="width:95%" clearable placeholder="请选择">
                <el-option
                  v-for="item in duiBi"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="数据库IP" label-width="115px">
              <el-input v-model="currentRows.ip" style="width:95%" autocomplete="off" clearable />
            </el-form-item>
            <el-form-item label="数据库端口" label-width="115px">
              <el-input v-model="currentRows.port" style="width:95%" clearable />
            </el-form-item>
            <el-form-item label="用户名" label-width="115px">
              <el-input v-model="currentRows.username" style="width:95%" clearable />
            </el-form-item>
            <el-form-item label="密码" label-width="115px">
              <el-input v-model="pwd" type="password" style="width:95%" clearable @change="handlerChange" />
            </el-form-item>
            <el-form-item label="数据库名/实例名">
              <el-input v-model="currentRows.database" clearable style="width:82%" />
            </el-form-item>
            <el-form-item label="备注" label-width="115px">
              <el-input v-model="currentRows.remark" style="width:95%" clearable />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="zhankaiCancel">取 消</el-button>
            <el-button type="primary" @click="changePwd">保 存</el-button>
          </span>
        </el-dialog>

        <!-- 过滤 -->
        <el-dialog
          title=""
          :visible.sync="dialogVisibleFilter"
          width="30%"
        >
          <el-form v-if="dialogVisibleFilter" label-position="top" label-width="80px" :model="formFilter">
            <el-form-item :label="labelFilter">
              <el-cascader
                v-if="domType==='select'"
                ref="cascader"
                v-model="vale"
                style="width:100%"
                :props="props"
              />
              <!-- @change="cascaderFilter" -->
              <!-- :options="formFilter.selectData" -->
              <el-input v-if="domType==='input'||domType==='textarea'" v-model="formFilter.inputData" @change="inputFilter" />
              <el-date-picker
                v-if="domType==='date'"
                v-model="formFilter.datePicker"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss "
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
                style="width: 100%;"
                @change="dateFilter"
              />
            </el-form-item>

          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeFilter">取 消</el-button>
            <el-button type="primary" @click="sureFilter">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
    </div>
  </Container>
</template>

<script>
import * as API from '@/api/index'
import Container from '@/components/Container'
const Base64 = require('js-base64').Base64
export default {
  components: { Container },
  data() {
    return {
      props: {
        value: 'code',
        children: [{ value: 'code' }],
        lazy: true,
        leaf: 'isLeaf',
        checkStrictly: true,
        lazyLoad: (node, resolve) => {
          this.cascaderFilter(node, resolve)
        }
      },
      checkList:[],
      checkListData:[],
      formFilter: {
        inputData: '',
        selectData: [],
        datePicker: ''
      },
      labelFilter: '',
      domType: '',
      dialogVisibleFilter: false,
      activeNameRule: 'first',
      // enterTextarea: '',
      tabsRepeatExport: '',
      editableTabsValue: '', // 表列表默认选中
      editableTabsValueExport: '',
      tabsLable: [],
      tabsLableExport: [],
      tabsLableExportRepeat: [],
      disables: '填报计算',
      options_cascader: [],
      pwd: '',
      value22: '',
      valueContrast1: '',
      keys: [], // 树节点键值
      array: [],
      formLabelWidth: '80px', // 其他页面input中的label宽
      gridData: [],
      gridDataId: '',
      form: {},
      tianBaoData: [],
      optionsZiDuanCols: [],
      comparZiDuanCols: [],
      tableDataRepeat: [],
      saveDisable: true, // 初始为禁用状态
      repectDisable: true,
      exportDisables: true,
      tianBaoReviewData: [], // 填报其他列数据
      optionsTable: [], // 表名选择
      optionsCompar: [], // 对比库名
      optionsTableZiDuan: [], // 表字段选择
      optionsZiDuanCol: [], // 选择表头
      comparZiDuanCol: [],
      // 树配置
      treeProps: {
        label: 'label',
        children: 'childList'
      },
      value: '',
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      // 对比数据库
      pagerDuiBi: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      // 对比库信息管理
      pagerDuiBiXinXi:{
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      //  一键审查模态框
      yjsc:{
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      // 数据审查重复率计算下面分页
      pagerRepact: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 15, 20, 30]
      },
      tableCol: [], // 表头数据
      tableData: [], // 表格数据
      tableDataReview: [], // 数据审查表格数据
      tableColReview: [], // 数据审查表头数据
      tableName: '', // 表名称
      columnName: '', // 列名称
      dialogVisible: false, // 一键审查新增
      dialogVisibleAdd: false, // 一致性对比新增
      dialogVisibleZhankai: false, // 一致性对比展开
      dialogVisibleCheck: true, // 一键审查表格无数据时隐藏多选框
      currentRow: {
        name: '',
        sql: '',
        remark: ''
      }, // 一键审查模态框table数据到input
      currentRows: {}, // 一致性模态框table数据到input
      editDialog: false, // 编辑
      radio: '一键审查',
      labelPosition: 'right',
      // 新建主题相关
      filterText: '',
      formLabelAlign: {},
      type: '',
      formInline: [],
      textarea: '',
      options: [],
      treeData: [], // 树内容
      columns: [], // 表格列
      dataColumn: '',
      columnMap: [],
      tableDataZiDuan: [],
      tableDataZiDuanCompar: [],
      formDuiBi: {},
      tableNames: [],
      duiBi: [
        {
          label: 'ORACLE',
          value: 1
        },
        {
          label: 'MYSQL',
          value: 2
        },
        {
          label: 'DM8',
          value: 3
        }
      ],
      selDuiBiLabel: '', // 一致性对比新增模态框数据类型
      duiBiBaseData: [], // 一致性对比展开模态框表格数据
      idSel: '',
      optionsComparTable: [],
      comparTableZiDuan: [],
      tables: [],
      column: [],
      exportReportRate: [],
      alreadyColumns: [],
      dataColumnRequestList: [],
      // 表格数据
      autoTableData: {},
      tabsLableRule: [],
      cascaderValue: '',
      inputValue: '',
      dateValue: '',
      columnProperty: '',
      vale: [],
      conditions: {},
      array:[]
    }
  },
  watch: {
    filterText(val) {
      if (this.$refs.tree) {
        this.$refs.tree.filter(val)
      }
    }
  },
  created() {
    this.selectData()
    this.addTheme()
    this.optionsTab()
    this.comparDataBase()
  },
  methods: {
    // 一键审查tab规则切换
    handleClick(tab) {
      this.ruleId = tab.name
      this.pager.total = 0
      this.pager.pageNum = 1
      this.pager.pageSize = 10
      const props = {
        id: this.ruleId,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize
      }
      API.getExecuteRule(props).then(res => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          if (data.list && data.list.length > 0) {
            this.tableCol = Object.keys(data.list[0])
          }
          const qq = this.tableCol
          this.tableCol = []
          this.$set(this.tableCol, 'value', qq)
          this.tableData = data.list
          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 树节点多选
    check(nodes, val,e) {
      console.log(nodes.childList)
      console.log(nodes.childList===null)
      console.log(this.autoTableData)
      if(nodes.childList===null){
        console.log(nodes,val)
        if (nodes.tableName) {
          this.autoTableData[nodes.tableName] = null
        }
        if (nodes.field===null) {
          if (val === true) {
            if (nodes.childList === null) {
              this.tabsLable.push(nodes)
              if (this.tabsLable.length < 2) {
                this.editableTabsValue = nodes.tableName
              }
              this.conditions ={}
              this.getTableColReview(nodes.tableName, this.tabsLable.length < 2)
              this.getTableData(nodes.tableName, this.tabsLable.length < 2, {})
            }
          } else {
            this.tabsLableExport = []
            this.tianBaoData = []
            // 树节点取消勾选
            // 删除tab表数据
            const index = this.tabsLable.findIndex(item => item.tableName === nodes.tableName)
            this.tabsLable.splice(index, 1)
            if (this.tabsLable.length === 0) { // 表列表为空
              console.log(nodes.tableName)
              this.tableDataReview = []
              this.tianBaoData = []
              this.tableDataRepeat = []
              this.tableColReview = []
              this.pager.total = 0 
            } else { // 切换表多个时
              this.getTableColReview(this.tabsLable[0].tableName, true)
              this.conditions ={}
              this.getTableData(this.tabsLable[0].tableName, true)
              this.editableTabsValue = this.tabsLable[0].tableName
            }
          }
        }
      }
      
    },
    // 表列表切换
    topRadioChange(tab) {
      const val = tab.name
      this.tableColReview = this.autoTableData[val].columns
      this.tableDataReview = this.autoTableData[val].tableData
      this.pager.total = this.autoTableData[val].total
      this.pager.pageSize = 10
    },
    // 导出表列表切换
    topRadioChangeExport(tab) {
      this.pagerRepact.pageNum = 1
      this.pagerRepact.pageSize = 10
      this.getReviewTableColReview(tab.name)
      const columns = []
      const items = this.autoTableData[tab.name].columns.filter(item => item.isChecked)
      items.forEach(item => {
        columns.push(item.columnName)
      })
      const data = {
        tableName: tab.name,
        columns: columns,
        pageNum: this.pagerRepact.pageNum,
        pageSize: this.pagerRepact.pageSize
      }
      API.getDataRepeat(data).then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          this.tableDataRepeat = data.list
          this.pagerRepact.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 切换tabs改变内容
    changeTabs(value) {
      this.radio = value
      this.pager.pageNum = 1
      // 让页面内容置空
      if (value === '一键审查') {
        //debugger
        this.array = []
        this.checkList = []
        this.currentRow = {}
        this.tableCol = []
        this.tableData = []
        this.pager.pageNum = 1
        this.pager.pageSize = 10
      } else if (value === '数据审查') {
        this.saveDisable = true
        this.repectDisable = true
        this.exportDisables = true
        this.tableDataReview = []
        this.tableColReview = []
        this.tianBaoData = []
        this.pager.total = 0
        this.pagerRepact.total = 0
        this.tabsLable =[]
        this.tabsLableExport=[]
        this.tableDataRepeat =[]
        this.tableColReviewBottom = []
      } else if (value === '一致性对比') {
        this.value22 = []
        this.optionsZiDuanCol = []
        this.tableDataZiDuan = []
        this.pager.total = 0
        this.formInline = []
        this.comparZiDuanCol = []
        this.tableDataZiDuanCompar = []
        this.valueContrast1 = []
        this.pagerDuiBi.total = 0
        this.comparZiDuanCols = []
      }
    },
    // 一键审查下拉选框
    selectData() {
      API.getAllList().then(res => {
        const { code, data, message } = res
        if (String(code) === '200') {
          this.checkListData = data
        } else {
          this.$message.error(message)
        }
      })
    },
    // 一键审查规则下拉选择sql语句
    yjscChange(value,e) {
      if(e){
        this.tabsLableRule = []
        //debugger
        if(this.array.indexOf(value.id) === -1){
          this.array.push(value.id)
        }
        
        //console.log(this.array)
        for (const i in this.array) {
          const sqlItem = this.checkListData.find(item => item.id === this.array[i])
          //console.log(sqlItem) // 当前对像
          this.tabsLableRule.push(sqlItem)
          //console.log(this.tabsLableRule) // [{…}, {…}, __ob__: Observer]
          this.activeNameRule = sqlItem.id
        }
        this.getExecuteRules()
        
      }else {
        this.tabsLableRule.forEach((item, index)=>{
          if(item.id === value.id){
            this.tabsLableRule.splice(index, 1)
            
          }
        })
        
        this.array.forEach((item, index)=>{
          if(item === value.id){
            this.array.splice(index, 1)
          }
        })
        if(this.tabsLableRule.length > 0){
          this.activeNameRule = this.tabsLableRule[0].id
          this.getExecuteRules()
        }else {
          this.array = []
          this.tableData = []
        }
      }
      
    },
    getExecuteRules(){
      const props = {
          id: this.activeNameRule,
          pageNum: this.pager.pageNum,
          pageSize: this.pager.pageSize
        }
        API.getExecuteRule(props).then(res => {
          const { code, msg, data } = res
          if (String(code) === '200') {
            if (data.list && data.list.length > 0) {
              this.tableCol = Object.keys(data.list[0])
            }
            const qq = this.tableCol
            this.tableCol = []
            this.$set(this.tableCol, 'value', qq)
            this.tableData = data.list
            this.pager.total = data.total
            
          } else {
            this.$message.error(msg)
          }
        })
    },
    // 折叠点击展开  保存按钮
    xinzen() {
      if (this.radio === '一键审查') {
        this.getSqlList()
      } else if (this.radio === '一致性对比') {
        this.zhankai()
      }
    },
    // 模态框展开
    getSqlList() {
      this.dialogVisible = true
      const props = {
        pageNum: this.yjsc.pageNum,
        pageSize: this.yjsc.pageSize
      }
      API.getSqlList(props).then(res => {
        const { code, data, message } = res
        if (String(code) === '200') {
          this.gridData = data.list
          this.yjsc.total = data.total
        } else {
          this.$message.error(message)
        }
      })
    },
    // 表单重置
    resetForm(formName) {
      //console.log(this.checkList)
      this.array = []
      this.checkList = []
      this.currentRow = {}
      this.tableCol = []
      this.tableData = []
      // 新建主题相关
      this.filterText = ''
      this.options_cascader = []
      this.pager.pageSize = 10
      this.pager.pageNum = 1
    },
    // 编辑行
    onHandleEdit(row, code) {
      this.editForm = { ...row }
      this.editForm = JSON.parse(JSON.stringify(row))
      if (code === 2) {
        this.editDialog = true
      } else if (code === 0) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.deleteRow(row)
          })
          .catch(() => {
            this.editForm = {}
          })
      }
    },
    // 删除行数据
    deleteRow(rows) {
      if (this.radio === '一键审查') {
        this.gridData.forEach(i => {
          this.gridDataId = i.id
        })
      } else if (this.radio === '一致性对比') {
        this.gridDataId = rows.id
      }
      const props = {
        ids: this.gridDataId
      }
      API.getDeleteDatabase(props).then(res => {
        const { code, msg } = res
        if (String(code) === '200') {
          this.xinzen()
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一键审查模态框删除
    deleteRule(rows) {
      const props = {
        ids: rows.id
      }
      API.getSqlListDelete(props).then(res => {
        const { msg, code } = res
        if (String(code) === '200') {
          this.getSqlList()
          this.$message.success(msg)
          this.selectData()
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一键审查模态框关闭
    handleClose(done) {
      this.dialogVisible = false
      this.dialogVisibleZhankai = false
      this.cancel()
      //this.pager.pageSize = 10
      //this.pager.pageNum = 1
    },
    // 模态框取消事件
    cancel() {
      this.dialogVisible = false
      this.currentRow = {}
      //this.pager.pageSize = 10
      //this.pager.pageNum = 1
    },
    // 一致性对比新增关闭
    handleCloseAdd(done) {
      this.dialogVisibleAdd = false
    },
    // 点击表格数据回显在form表单
    handleCurrentChangeRow(val) {
      this.currentRow = val
    },
    // 模态框保存
    save() {
      this.array = []
      this.checkList = []
      if (this.currentRow.id) { // 修改
        const prams = {
          id: this.currentRow.id,
          name: this.currentRow.name,
          pageNum: this.yjsc.pageNum,
          pageSize: this.yjsc.pageSize,
          sql: this.currentRow.sql,
          remark: this.currentRow.remark
        }
        API.getUpdateSql(prams).then(res => {
          console.log(res)
          const { code, msg } = res
          if (String(code) === '200') {
            this.$message.success(msg)
            this.currentRow = {}
            this.dialogVisible = false
          } else {
            this.$message.error(msg)
          }
        })
      } else { // 新增
        // 一键审查    新增sql
        const prams = {
          name: this.currentRow.name,
          pageNum: this.yjsc.pageNum,
          pageSize: this.yjsc.pageSize,
          sql: this.currentRow.sql,
          remark: this.currentRow.remark
        }
        API.getInsertSql(prams).then(res => {
          const { code, msg } = res
          if (String(code) === '200') {
            this.$message.success(msg)
            this.currentRow = {}
            this.dialogVisible = false
          } else {
            this.$message.error(msg)
            this.dialogVisible = true
          // this.currentRow = {}
          }
        })
      }
      // 更新表格数据
      const props = {
        pageNum: this.yjsc.pageNum,
        pageSize: this.yjsc.pageSize
      }
      API.getSqlList(props).then(res => {
        const { code, data, message } = res
        if (String(code) === '200') {
          this.gridData = data.list
          // 更新下拉框的数据
          this.selectData()
        } else {
          this.$message.error(message)
        }
      })
      // this.currentRow = {}
    },
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
    setChecks(val) {
      const regObj = this.getFirstNode(val)
      if (regObj && regObj.id) {
        this.keys = [regObj.id]
        this.$nextTick(() => {
          this.currents = regObj.id
          this.$refs['tree'].setCurrentKey(regObj.id)
        })
      }
    },
    // 查询树结构
    addTheme() {
      API.getCustomizationDataTypeTree().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeData = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 树过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取 数据审查 表头数据
    getTableColReview(val, isLoadData) {
      API.getStructureOld({}, val).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          if (this.autoTableData[val]) {
            this.autoTableData[val].columns = data
          } else {
            this.autoTableData[val] = {
              columns: data,
              tableData: [],
              total: 0
            }
          }
          data.forEach(item => {
            item.isChecked = true
          })
          if (isLoadData) {
            this.tableColReview = data
            this.tableColReviewBottom = data
          }
        } else {
          this.$message.error(msg)
        }
      })
      return this.tableColReview
    },
    // 获取 数据审查 表头数据
    getReviewTableColReview(val) {
      API.getStructure({}, val).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.tableColReviewBottom = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取  数据审查  表格数据
    getTableData(tableName, isLoadData, sortData) {
      this.tableName = tableName
      var params = {
        tableName,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        sortData: sortData || {},
        data: this.conditions || {}

      }

      API.getListCheck(params).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.saveDisable = false
          this.repectDisable = false
          if (isLoadData) { // 当表格内容改变时总数也发生变换  第一次默认第一张表得数据及总数,点击下一个树节点总数及表格数据不显示
            this.tableDataReview = data.list
            this.pager.total = data.total
          }
          if (this.autoTableData[tableName]) {
            this.autoTableData[tableName].tableData = data.list
            this.autoTableData[tableName].total = data.total
          } else {
            this.autoTableData[tableName] = {
              columns: [],
              tableData: data.list,
              total: data.total
            }
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 升序
    RowcaretTop(column, index) {
      const sortData = {
        [column.columnName]: 'ASC'
      }
      
      if(column.columnDataType == 'BLOB'){
        this.dialogVisibleFilter = false
        this.$message.warning('文件类型不可排序')
      } else{
        this.getTableData(this.editableTabsValue, {}, sortData)
      }
    },
    // 降序
    RowcaretBottom(column, index) {
      const sortData = {
        [column.columnName]: 'DESC'
      }
      
      if(column.columnDataType == 'BLOB'){
        this.dialogVisibleFilter = false
        this.$message.warning('文件类型不可排序')
      }else{
        this.getTableData(this.editableTabsValue, {}, sortData)
      }
    },
    // 事件过滤器
    dateFilter(val) {
      this.dateValue = val
    },
    // 输入框过滤
    inputFilter(val) {
      this.inputValue = val
    },
    // 级联选择器过滤
    cascaderFilter(node, resolve) {
      // console.log('node:', node)
      // this.cascaderValue = ''
      // const nodesInfo = this.$refs['cascader'].getCheckedNodes()
      // nodesInfo.forEach(item => {
      //   this.cascaderValue = item.value
      // })
      const props = {
        tableName: this.nameTable,
        columnName: this.columnProperty,
        sync: false,
        sequence: node.root ? '' : node.data.id
      }
      API.getSync(props).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 过滤
    Rowdataanalysis(column, index) {
      this.dialogVisibleFilter = true
      this.labelFilter = column.columnComment
      this.columnProperty = column.columnName
      this.getTableColReview(this.editableTabsValue)

      this.tableColReview.forEach(item => {
        if (column.columnComment === item.columnComment) {
          this.domType = item.domType
          this.nameTable = item.tableName
        }
      })
      if (this.domType === 'file') {
        this.dialogVisibleFilter = false
        this.$message.warning('文件类型不可过滤')
      } else if (this.domType === 'input' || this.domType === 'textarea' || this.domType === 'date') {
        // this.dialogVisibleFilter = false
        // this.$message.warning('文件类型不可过滤')
      }
    },
    // 过滤模态框取消按钮
    closeFilter() {
      this.dialogVisibleFilter = false
      this.vale = ''
      this.formFilter = {}
    },
    // 过滤模态框确定按钮
    sureFilter() {
      this.dialogVisibleFilter = false
      // this.vale = ''

      this.conditions = {}
      this.formFilter = {}
      if (this.domType === 'select') {
        console.log('selected:', this.vale)
        var end = this.vale.pop()
        this.conditions = {
          [this.columnProperty]: end
        }
      } else if (this.domType === 'input' || this.domType === 'textarea') {
        this.conditions = {
          [this.columnProperty]: this.inputValue
        }
      } else if (this.domType === 'date') {
        this.conditions = {
          [this.columnProperty]: this.dateValue
        }
      }
      var params = {
        tableName: this.editableTabsValue,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        sortData: {},
        data: this.conditions || {}

      }
      API.getListCheck(params).then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.tableDataReview = data.list
          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 重复计算
    repetJisuan() {
      this.getReviewTableColReview(this.editableTabsValue)
      const columns = []
      const items = this.autoTableData[this.editableTabsValue].columns.filter(item => item.isChecked)
      items.forEach(item => {
        columns.push(item.columnName)
      })
      const data = {
        tableName: this.editableTabsValue,
        columns: columns,
        pageNum: this.pagerRepact.pageNum,
        pageSize: this.pagerRepact.pageSize
      }
      API.getDataRepeat(data).then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          this.disables = '重复计算'
          this.tableDataRepeat = data.list
          this.pagerRepact.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
      this.tabsLableExportRepeat = this.tabsLable
    },
    getDataReportRate(data) {
      API.getDataReportRate({ dataColumnRequestList: data }).then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          this.exportReportRate = data

          // const index = this.exportReportRate.findIndex(item => item.tableName === this.editableTabsValue)
          // this.exportReportRate.splice(index, 1)
          // console.log(this.exportReportRate)

          const tableData = [{
            labels: '总数'
          },
          {
            labels: '已填报数'
          },
          {
            labels: '未填报数'
          },
          {
            labels: '填报率'
          },
          {
            labels: '未填报率'
          }
          ]
          const selectedData = data.find(item => item.tableName === this.editableTabsValueExport)// 当前选中的表名下的数据
          this.tianBaoReviewData = selectedData.dataReportResponseList
          selectedData.dataReportResponseList.forEach((val) => {
            tableData[0][val.columnName] = val.totalCount
            tableData[1][val.columnName] = val.reportCount
            tableData[2][val.columnName] = val.noReportCount
            tableData[3][val.columnName] = val.reportRate
            tableData[4][val.columnName] = val.noReportRate
          })
          this.exportDisables = false
          this.tianBaoData = tableData
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 计算按钮
    jisuan() {
      this.tabsLableExport = this.tabsLable
      this.editableTabsValueExport = this.editableTabsValue
      let i = 0
      this.dataColumnRequestList = []
      this.tabsLable.forEach((item) => {
        API.getStructure({}, item.tableName).then(res => {
          const { code, data, msg } = res
          if (String(code) === '200') {
            this.disables = '填报计算'
            i++
            this.dataColumnRequestList.push({
              tableName: item.tableName,
              columns: data.map(val1 => val1.columnName)
            })
            if (i === this.tabsLable.length) {
              this.getDataReportRate(this.dataColumnRequestList)
            }
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    // 填报率导出
    exportReview() {
      var arrData = []
      this.exportReportRate.forEach((i) => {
        var arr = {}
        for (const e in i) {
          if (e === 'dataReportResponseList') {
            arr['dataReportRateRequestList'] = i[e]
          } else {
            arr[e] = i[e]
          }
        }
        arrData.push(arr)
      })
      API.getExportReportRate(arrData).then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          window.open(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 填报率导出表切换
    topRadioExport(targetName, action) {
      // API.getStructure({}, targetName.name).then(res => {
      //   const { data, msg, code } = res
      //   if (String(code) === '200') {
      //     this.tianBaoReviewData = data
      //     // this.tabsRepeatExport = targetName.name
      //   } else {
      //     this.$message.error(msg)
      //   }
      // })
      this.getDataReportRate(this.dataColumnRequestList)
    },
    // 重复率导出
    exportRepeatReview() {
      const dataColumnRequestList = []
      const keys = Object.keys(this.autoTableData)
      keys.forEach(item => {
        console.log(item)
        if (item) {
          const columns = this.autoTableData[item].columns.filter(item => item.isChecked)
          dataColumnRequestList.push({
            tableName: item,
            columns: columns.map(item => item.columnName)
          })
        }
      })
      this.getDataReportRepeat(dataColumnRequestList)
    },
    // 重复率导出
    getDataReportRepeat(data) {
      API.getExportRepeatData({ dataColumnRequestList: data }).then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          window.open(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一致性审查表字段下拉框
    tableZiDuan(value) {
      this.optionsZiDuanCol = []
      this.optionsZiDuanCols = []
      this.tableDataZiDuan = []
      this.pager.total = 0
      const props = {
        tableName: value
      }
      API.getTableStructure(props, value).then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          this.optionsTableZiDuan = data
          this.columnMap = data.map(ite => {
            return ite.columnName
          })
          this.tableName = data.map(i => {
            return i.tableName
          })
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一致性表字段点击 设置表头
    ziduanCol(value) {
      this.optionsZiDuanCol = value
    },
    // 本系统数据库表数据查询
    search() {
      this.optionsZiDuanCols = this.optionsZiDuanCol
      const props = {
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        tableName: this.tableName.splice(0, 1).toString(),
        columns: this.optionsZiDuanCol
      }
      API.getDataBase(props).then(res => {
        const { code, msg, data } = res
        if (String(code === '200')) {
          this.tableDataZiDuan = data.rows
          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一致性审查表下拉框
    optionsTab() {
      API.getAllTable().then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          this.optionsTable = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 对比库下拉列表
    comparDataBase(value) {
      API.getDatabaseList().then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          this.optionsCompar = data
          this.idSel = value
          if (this.idSel) {
            this.selectTablets()
          }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一致性对比新增
    xinzenAdd() {
      this.dialogVisibleAdd = true
    },
    // 一致性对比新增取消按钮
    addCancel() {
      this.dialogVisibleAdd = false
      this.formDuiBi = {}
      this.value = ''
    },
    // 一致性对比展开取消按钮
    zhankaiCancel() {
      this.dialogVisibleZhankai = false
      this.currentRows = {}
    },
    // 一致性对比新增数据库的数据库类型下拉选框
    selDuiBi(label) {
      this.selDuiBiLabel = label
    },
    // 一致性对比数据库新增模态框确定事件
    insertBase() {
      const props = {
        database: this.formDuiBi.database,
        databaseType: this.selDuiBiLabel,
        ip: this.formDuiBi.ip,
        name: this.formDuiBi.name,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
        password: Base64.encode(this.formDuiBi.password),
        port: this.formDuiBi.port,
        username: this.formDuiBi.username
      }
      API.getInsertDatabase(props).then(res => {
        const { code, msg } = res
        if (String(code === '200')) {
          this.comparDataBase()
        } else {
          this.$message.error(msg)
        }
      })
      this.formDuiBi = ''
      this.dialogVisibleAdd = false
    },
    // 一致对比展开
    zhankai() {
      this.dialogVisibleZhankai = true
      this.currentRows = {}
      const porps = {
        pageNum: this.pagerDuiBiXinXi.pageNum,
        pageSize: this.pagerDuiBiXinXi.pageSize
      }
      API.getDatabasePage(porps).then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          this.duiBiBaseData = data.list
          this.pagerDuiBiXinXi.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一致性对比展开表格数据回显form表单
    handleChangeRow(value) {
      this.currentRows = value
      // this.pwd = ''
    },
    // 对比库修改保存按钮
    changePwd() {
      const props = {
        database: this.currentRows.database,
        databaseType: this.currentRows.databaseType,
        id: this.currentRows.id,
        ip: this.currentRows.ip,
        name: this.currentRows.name,
        pageNum: this.pagerDuiBiXinXi.pageNum,
        pageSize: this.pagerDuiBiXinXi.pageSize,
        password: Base64.encode(this.pwd),
        port: this.currentRows.port,
        username: this.currentRows.username
      }
      API.getUpdateDatabase(props).then(res => {
        const { msg, code } = res
        if (String(code === '200')) {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      })
      this.dialogVisibleZhankai = false
    },
    // 监听一致性对比模态框表单密码框改变事件
    handlerChange(val) {
      this.pwd = val
    },
    // 一致性对比选择表
    selectTablets() {
      const prop = {
        id: this.idSel
      }
      API.getDatabaseTable(prop, this.idSel).then(res => {
        const { code, msg, data } = res
        if (String(code === '200')) {
          this.optionsComparTable = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 对比库下拉列表获取表字段
    tableZiDuanCompar(value) {
      this.comparZiDuanCol = []
      this.tableDataZiDuanCompar = []
      this.comparZiDuanCols = []
      this.pagerDuiBi.total = 0
      this.tables = value
      const props = {
        id: this.idSel,
        tableName: this.tables
      }
      API.getDatabaseColumn(props, this.idSel, this.tables).then(res => {
        const { code, msg, data } = res
        if (String(code === '200')) {
          this.comparTableZiDuan = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取表字段及表格数据
    ziduanColCompar(value) {
      this.comparZiDuanCol = value
    },
    // 对比数据库表格数据查询
    searchCompar() {
      this.comparZiDuanCols = this.comparZiDuanCol
      const props = {
        columns: this.comparZiDuanCol,
        id: this.idSel,
        pageNum: this.pagerDuiBi.pageNum,
        pageSize: this.pagerDuiBi.pageSize,
        tableName: this.tables
      }
      API.getOtherDatabaseData(props).then(res => {
        const { code, msg, data } = res
        if (String(code === '200')) {
          this.tableDataZiDuanCompar = data.rows
          this.pagerDuiBi.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },

    // 树节点点击事件
    nodeClick(obj, node, tree) {
      if (obj.childList === null || obj.childList.length === 0) {
        this.tableName = obj.tableName
      }

    },

    // 一致性对比展开切换每页显示条数
    handleSizeChange(val) {
      this.pagerDuiBiXinXi.pageSize = val
      this.zhankai()
    },
    // 数据审查显示条数
    handleSizeChangeData(val) {
      this.pager.pageSize = val
      this.pager.total = 0
      this.getTableData(this.editableTabsValue, true)
    },
    // 一键审查 切换每页显示条数
    handleSizeChangeReview(val) {
      this.pager.pageSize = val
      const props = {
        id: this.activeNameRule,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize
      }
      API.getExecuteRule(props).then(res => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          if (data.list && data.list.length > 0) {
            this.tableCol = Object.keys(data.list[0])
          }
          const qq = this.tableCol
          this.tableCol = []
          this.$set(this.tableCol, 'value', qq)
          this.tableData = data.list
          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 重复率填报导出分页显示条数
    handleSizeChangeRepeat(val) {
      this.pager.pageSize = val
      const columns = []
      const items = this.autoTableData[this.editableTabsValue].columns.filter(item => item.isChecked)
      items.forEach(item => {
        columns.push(item.columnName)
      })
      const data = {
        tableName: this.editableTabsValue,
        columns: columns,
        pageNum: this.pagerRepact.pageNum,
        pageSize: val
      }
      API.getDataRepeat(data).then(res => {
        const { msg, code, data } = res
        if (String(code === '200')) {
          this.tableDataRepeat = data.list
          this.pagerRepact.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 本系统数据库每页显示条数
    handleSizeChangeContrast(val) {
      this.pager.pageSize = val
      this.ziduanCol(this.optionsZiDuanCols)
      this.search()
    },
    // 对比库每页显示条数
    handleSizeChangeCompar(val) {
      this.pager.pageSize = val
      this.ziduanColCompar(this.comparZiDuanCol)
      this.searchCompar()
    },
    // 一键审查每页显示条数
    handleSizeChangeDialog1(val) {
      this.yjsc.pageSize = val
      this.xinzen()
    },

    // 切换当前页
    repetHandleCurrentChange(val) {
      this.pager.pageNum = val
      this.getTableData(this.editableTabsValue, true)
    },
    // 一键审查 分页
    handleCurrentChangeReview(val) {
      this.pager.pageNum = val
      const props = {
        id: this.ruleId || this.activeNameRule,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize
      }
      API.getExecuteRule(props).then(res => {
        const { code, msg, data } = res
        if (String(code) === '200') {
          if (data.list && data.list.length > 0) {
            this.tableCol = Object.keys(data.list[0])
          }
          const qq = this.tableCol
          this.tableCol = []
          this.$set(this.tableCol, 'value', qq)
          this.tableData = data.list
          this.pager.total = data.total
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 一致性对 本地库分页
    handleChangeRowZhankai(val) {
      this.pagerDuiBiXinXi.pageNum = val
      this.zhankai()
    },
    // 一致性对比本系统数据库 分页
    handleCurrentChangeYiZhi(val) {
      this.pager.pageNum = val
      this.ziduanCol(this.optionsZiDuanCols)
      this.search()
    },
    // 一致性对比数据库分页
    handleCurrentChangeContrast(val) {
      this.pagerDuiBi.pageNum = val
      this.ziduanColCompar(this.comparZiDuanCol)
      this.searchCompar()
    },
    // 数据审查重复性计算分页
    handleCurrentChangeRepeat(val) {
      this.pagerRepact.pageNum = val
      this.repetJisuan()
    },
    // 一键审查模态框 分页
    handleCurrentChangeDialog(val) {
      this.yjsc.pageNum = val
      this.xinzen()
    }
    // 表格复选框
    // onHandleSelect(selection, row) {
    //   console.log(selection, row)
    //   // this.$set(row, 'isSelected', !row.isSelected)
    //   // if (!row.isSelected) {
    //   //   this.globalKey.push(row.UNIQUE)
    //   // } else {
    //   //   const index = this.globalKey.indexOf(row.UNIQUE)
    //   //   if (index > -1) {
    //   //     this.globalKey.splice(index, 1)
    //   //   }
    //   // }
    // }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-radio-button__orig-radio:checked+.el-radio-button__inner,
>>> .el-button--primary{
  background: #1f7cd7;
}
.yjscTabls{
  >>> .el-table__body-wrapper{
    height:410px;
    overflow:auto;
    overflow-x:hidden
  }
}
>>> .el-dialog__body{
  height: 695px;
  overflow: auto;
  overflow-x: hidden;
}
.dataClean {
  height: 100%;
  ::v-deep .el-card {
    height: 100%;
    margin-bottom: 30px;
    .consistencyContrast {
      .contrastLeft {
        width: 40%;
        height: 100%;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        background-color: #fafafa;
        .demo-form-inline{
          .el-form-item--small> .el-form-item__label{
            text-align: right;
          }

        }
      }
    }
    .el-card__body {
      height: 100%;
      display: flex;
      .table-bon {
        width: 100%;
        // height: 450px;
        height: calc(100% - 100px);

        .table-section {
          width: 100%;
          // height: 474px;
          height: calc(100% - 50px);
          .el-table {
            height: 100%;
            .el-table__body-wrapper,
            .is-scrolling-left {
              height: 100%;
            }
          }
        }
        .pager-section {
          width: 100%;
          height: 30px;
          margin: 20px 0;
          text-align: right;
        }
      }
    }
  }
}
</style>
