<template>
  <Container>
    <div class="content-section">
      <div class="content-title-button">
        <el-button-group>
          <el-button
            type="primary"
            :class="
              showButton == '0' || showButton == '3' ? '' : 'button-condition'
            "
            @click="tabChange('0')"
          >
            作战力量
          </el-button>
          <el-button
            type="primary"
            :class="showButton == '1' ? '' : 'button-condition'"
            @click="tabChange('1')"
          >
            战备工程
          </el-button>
          <el-button
            type="primary"
            :class="showButton == '2' ? '' : 'button-condition'"
            @click="tabChange('2')"
          >
            战场环境
          </el-button>
          <el-button
            type="primary"
            :class="showButton == '4' ? '' : 'button-condition'"
            @click="tabChange('4')"
          >
            作战装备
          </el-button>
        </el-button-group>
      </div>
      <div class="content">
        <combatForces v-if="showButton == '0'" />
        <preparedness v-if="showButton == '1'" />
        <battleground v-if="showButton == '2'" />
        <keyPost v-if="showButton == '3'" />
        <combatEquipment v-if="showButton == '4'" />
      </div>
    </div>
  </Container>
</template>
<script>
import Container from '@/components/Container'
import combatForces from './combatForces'
import preparedness from './preparedness'
import battleground from './battleground'
import combatEquipment from './combatEquipment'
import keyPost from './keyPost'
import bus from '@/utils/bus'
export default {
  name: 'ComplicatedCondition',
  components: {
    Container,
    combatForces,
    preparedness,
    keyPost,
    battleground,
    combatEquipment
  },
  data() {
    return {
      showButton: '0'
    }
  },
  mounted() {
    bus.$on('tabPage', (e) => {
      console.log(e)
      this.showButton = e
    })
  },
  methods: {
    tabChange(index) {
      this.showButton = index
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: calc(100% - 80px);
  width: 100%;

  overflow-y: scroll;
}
>>> .el-button--primary {
  background-color: #1f7cd7;
}
.button-condition {
  background: #f2f2f2;
  border-color: #d0d6d9;
  color: #555555;
}

.content-section {
  background: #fff;
  padding-bottom: 20px;

  height: calc(100vh - 120px);
  .content-title-button {
    padding: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e6e6e6;
  }
}
</style>
