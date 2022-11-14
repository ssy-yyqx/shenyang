<template>
  <Container>
    <div class="content-section">
      <!-- <Tree class="my-tree" :tree-data="treeDatas" :tree-props="defaultProps" @nodeClick="nodeClick" /> -->
      <!--懒加载的部队树-->
        <div  class="tree" style="width:350px;height: calc(100vh - 200px);background:white;overflow-y:scroll;overflow-x:scroll;padding: 10px;">
          <el-tree
            class="tree"
            style="width:450px;"
            ref="myTree"
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
      <div class="my-mapbox">
        <!-- :tools="mapTools"  -->
        <MapOl ref="MapOl" @featureMarker="featureMarker" />
      </div>
    </div>
    <el-dialog
      :title="allpointType.pointType==='1'? ForceDetailData.BDFH : ForceDetailData.ZBGCMC"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      custom-class="qiefen-dialog-class"
      :before-close="handleClose"
    >
      <!-- 名称：ZBGCMC 代号：ZBGCDH  工程分类：GCFLNM 竣工时间：JGSJ 保护区：BHQNM  经度：JD 维度：WD 高程 GC  地名：DMNM   图片：MTDX -->
      <div style="display:flex;flex-wrap: wrap;">
        <div class="getForceDetailVisible">
          <p>{{ allpointType.pointType==='1'? '部队番号：':'名称：' }}</p>
          <p>{{ allpointType.pointType==='1'? ForceDetailData.BDFH : ForceDetailData.ZBGCMC }}</p>
        </div>
        <div class="getForceDetailVisible">
          <p>{{ allpointType.pointType==='1'? '编程分类：':'代号：' }}</p>
          <p>{{ allpointType.pointType==='1'? ForceDetailData.BCFL : ForceDetailData.ZBGCDH }}</p>
        </div>
        <div class="getForceDetailVisible">
          <p>{{ allpointType.pointType==='1'? '部队级别：':'工程分类：' }}</p>
          <p>{{ allpointType.pointType==='1'? ForceDetailData.BDJB : ForceDetailData.GCFLNM }}</p>
        </div>
        <div class="getForceDetailVisible">
          <p>{{ allpointType.pointType==='1'? '兵种：':'竣工时间：' }}</p>
          <p>{{ allpointType.pointType==='1'? ForceDetailData.BZ : ForceDetailData.JGSJ }}</p>
        </div>
        <div class="getForceDetailVisible">
          <p>{{ allpointType.pointType==='1'? '军种：':'保护区：' }}</p>
          <p>{{ allpointType.pointType==='1'? ForceDetailData.JZ : ForceDetailData.BHQNM }}</p>
        </div>
        <div v-if="allpointType.pointType==='1'" class="getForceDetailVisible">
          <p>战区：</p>
          <p>{{ ForceDetailData.ZQ }}</p>
        </div>
        <div v-if="allpointType.pointType==='1'" class="getForceDetailVisible">
          <p>部署类别：</p>
          <p>{{ ForceDetailData.BSLB }}</p>
        </div>
        <div v-if="allpointType.pointType==='1'" class="getForceDetailVisible">
          <p>部署形式：</p>
          <p>{{ ForceDetailData.BSXS }}</p>
        </div>
        <div class="getForceDetailVisible">
          <p>经度：</p>
          <p>{{ ForceDetailData.JD }}</p>
        </div>
        <div class="getForceDetailVisible">
          <p>维度：</p>
          <p>{{ ForceDetailData.WD }}</p>
        </div>
        <div class="getForceDetailVisible">
          <p>高程：</p>
          <p>{{ ForceDetailData.GC }}</p>
        </div>
        <div class="getForceDetailVisible">
          <p>地名：</p>
          <p>{{ allpointType.pointType==='1'? ForceDetailData.DM : ForceDetailData.DMNM }}</p>
        </div>
        <div v-if="allpointType.pointType!=='1'" class="getForceDetailVisible">
          <p>图片：</p>
          <img v-if="ForceDetailData.MTDX !== 'data:image/jpeg;base64,null'" :src="ForceDetailData.MTDX" alt="" style="width:30%">
          <p v-else>暂无照片</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </Container>
</template>

<script>
import * as API from '@/api/index'
import Tree from '@/components/NoHeaderTree'
import Container from '@/components/Container'
import MapOl from '@/components/MapOl'
import water from '@/icons/img/mapSearch/water.png'
import flag from '@/icons/img/mapSearch/flag.png'
export default {
  name: 'AtlasMap',
  components: { Container, Tree, MapOl },
  data() {
    return {
      bdCheckedList: [],
      allpointType: '',
      ForceDetailData: {},
      dialogVisible: false, // 战备详情弹框
      mapTools: ['Home', 'RectSelect', 'CircleSelect', 'PolygonSelect', 'Clear'],
      search: {
        qy: '',
        date: ''
      },
      treeDatas: [],
      defaultProps: {
        children: 'childList',
        label: 'label'
      }
    }
  },
  created() {
    // 获取树数据
    //this.getTreeData()
  },
  mounted() {},
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
              this.forceCode = data[0].code
              // 默认部队选中节点
              this.bdCheckedList = [data[0].code]
              const checkTree = this.bdCheckedList.toString()
              //this.getTableList(checkTree)
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
    handleClose(done) {
      done()
    },
    // 战备工程详情 判断当前点击事件为部队还是战备工程
    featureMarker(val) {
      this.allpointType = val
      // console.log(val)
      let params = {}
      // 部队
      if (val.pointType === '1') {
        params = {
          forceCode: val.pointNM
        }
        this.getForceDetails(params)
      } else if (val.pointType === '2') {
        // 战备
        params = {
          engineeringCode: val.pointNM
        }
        this.getForceDetail(params)
      }
    },
    // 战备工程
    getForceDetail(params) {
      API.getForceDetail(params).then(res => {
        if (res.code === 200) {
          this.dialogVisible = true
          this.ForceDetailData = res.data
          this.ForceDetailData.MTDX = 'data:image/jpeg;base64,' + res.data.MTDX
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 部队
    getForceDetails(params) {
      API.getForceDetails(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.dialogVisible = true
          this.ForceDetailData = res.data
          this.ForceDetailData.MTDX = 'data:image/jpeg;base64,' + res.data.MTDX
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取树数据
    getTreeData() {
      API.getTreeList().then(res => {
        const { code, data, msg } = res
        if (String(code) === '200') {
          this.treeDatas = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    nodeClick(data) {
      console.log(data)
      this.$refs.MapOl.hideLayerByIds('zbgcLine')
      const params = {
        forceCode: data.code
      }
      API.getForceInfo(params).then(res => {
        if (res.code === 200) {
          const bd = []
          const zbgc = []
          const bdjw = []
          const zbgcjw = []
          res.data.forEach(i => {
            if (i.pointType === '1') { // 战备工程
              bd.push(i)
              bdjw.push([i.pointJD, i.pointWD])
            } else if (i.pointType === '2') { // 部队
              zbgc.push(i)
              zbgcjw.push([i.pointJD, i.pointWD])
            }
          })
          // 部队
          this.$refs.MapOl.addLayerAndGraphic('bd', bd, bdjw, flag)
          // 战备工程
          this.$refs.MapOl.addLayerAndGraphic('zbgc', zbgc, zbgcjw, water)

          if (zbgc.length > 0) {
            // console.log(111111111111)
            // for (let i = 0; i < zbgc.length; i++) {
            this.$refs.MapOl.addLayerAndGraphicLine(zbgc, bd[0], 'zbgcLine')
            // }
          } else {
            // this.$refs.MapOl.hideLayerByIds('zbgcLine')
          }
        }
      })
    },
    onSubmit() {}
  }
}
</script>

<style lang="scss" scoped>
>>> .qiefen-dialog-class{
  width: 35% !important;
  margin-top: 15vh !important;
}
>>> .ol-popups{
  display:none
}
>>> .my-tree{
  padding:0px 10px !important;
}
>>> .el-scrollbar__bar{
  display: none !important;
}
>>> .map-container .map-tools{
    position: absolute;
    top: 14px  !important;
    right: 20px;
}
>>> .el-scrollbar{
      overflow: scroll !important;
    overflow-y: hidden !important;
    position: relative !important;

}
>>> .el-scrollbar__wrap{
      overflow-x: hidden !important;
    height: 100% !important;
    margin-right: -177px !important;
    }
.content-section {
  display:flex;
  height: 100%;
  background: #fff;
  border-radius: 6px;
  padding-top:60px;
  .search-box {
    width: 100%;
    padding-top: 16px;
    height: 70px;
    display: flex;
    justify-content: space-between;
    .search-form{
      .demo-form-inline >>> .el-form-item{
        margin-bottom: 0;
      }
    }
    .search-botten {
      // margin-top: 10px;
      display: flex;
      padding-right: 106px;
      justify-content: space-between;
      // align-items: center;
    }
  }
  .my-mapbox {
    width: 100%;
    height: calc(100% - 80px);
    background: #fff;
    border-radius: 7px;
    position: relative;
    #map {
      position:absolute; top:0; bottom:0; width:100%;
    }
    >>> .mapboxgl-ctrl-bottom-left,
    >>> .mapboxgl-ctrl-bottom-right{
      display: none;
    }
    .my-tree {
      position: absolute;
      height: calc(100% - 0px);
      right: 1349px;
      border-radius: 0;
      z-index: 1;
      top: 0px;
    }
  }
}
.getForceDetailVisible{
  display: flex;
  width:50%;
  p:nth-child(1){
    width: 70px;
    text-align: right;
  }
}
</style>
