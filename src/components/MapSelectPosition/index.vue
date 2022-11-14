<template>
  <el-dialog
    title="地图选点"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%"
    :before-close="onHandleClose"
    :modal="false"
  >
    <div class="map-section">
      <MapOl
        ref="MapOl"
        :marker-position="markerPosition"
        @setLonLat="setLonLat"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onHandleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MapOl from "@/components/MapOl/index";
export default {
  components: { MapOl },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Array,
      default: () => {
        return [109.1622, 34.323];
      },
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      //lngLat: {
      //  lng: 109.1622,
      //  lat: 34.323,
      //},
      lngLat: {
        lng: 123.4061,
        lat: 41.7586,
      },
    };
  },
  computed: {
    markerPosition() {
      if (this.position[0] && this.position[1]) {
        return this.position;
      }
      return [123.4061, 41.7586];
    },
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit("closeDialog");
      }
    },
    position(val) {
      if (val[0] && val[1]) {
        this.lngLat = {
          lng: val[0],
          lat: val[1],
        };
      }
    },
  },
  methods: {
    onHandleClose() {
      this.dialogVisible = false;
    },
    onHandleConfirm() {
      this.$emit("getPoint", this.lngLat);
      this.dialogVisible = false;
    },
    setLonLat(data) {
      this.lngLat = {
        lng: data[0],
        lat: data[1],
      };
    },
  },
};
</script>

<style lang="scss" scoped>

.map-section {
  width: 100%;
  height: 400px;
}
.dialog-footer {
  text-align: right;
}
</style>
<style>
.mapboxgl-control-container {
  display: none;
}

</style>
