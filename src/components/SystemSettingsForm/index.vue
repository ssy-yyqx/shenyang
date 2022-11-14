<template>
  <div class="form1">
    <h4 class="mineTitle">{{ title }}</h4>
    <el-form :ref="formRef" :model="formData" label-position="left" label-width="auto" :rules="rules">
      <h5 class="subTitle">TCP传输配置</h5>
      <el-row :gutter="20">
        <el-col :span="15">
          <el-form-item label="IP地址" prop="TCPip" label-width="70px">
            <el-input v-model="formData.TCPip" placeholder="请输入地址" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="端口号" prop="TCPPort" label-width="70px">
            <el-input v-model="formData.TCPPort" placeholder="请输入端口" size="small" />
          </el-form-item>
        </el-col>
      </el-row>
      <h5 class="subTitle">UDP传输配置</h5>
      <el-row :gutter="20">
        <el-col :span="15">
          <el-form-item label="IP地址" prop="UDPip" label-width="70px">
            <el-input v-model="formData.UDPip" placeholder="请输入地址" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="端口号" prop="UDPPort" label-width="70px">
            <el-input v-model="formData.UDPPort" placeholder="请输入端口" size="small" />
          </el-form-item>
        </el-col>
      </el-row>
      <h5 class="subTitle">FTP传输配置</h5>
      <el-row :gutter="20">
        <el-col :span="15">
          <el-form-item label="IP地址" prop="FTPip" label-width="70px">
            <el-input v-model="formData.FTPip" placeholder="请输入地址" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="端口号" prop="FTPPort" label-width="70px">
            <el-input v-model="formData.FTPPort" placeholder="请输入端口" size="small" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账号" prop="account" label-width="70px">
            <el-input v-model="formData.account" placeholder="请输入账号" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password" label-width="70px">
            <el-input v-model="formData.password" placeholder="请输入密码" size="small" type="password" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="根目录" prop="path" label-width="70px">
        <el-input v-model="formData.path" placeholder="请输入根目录" size="small" />
      </el-form-item>
      <el-form-item
        v-for="(item,index) in formData.ftpDirectoryList"
        :key="index"
        :label="item.typeName"
        :prop="'ftpDirectoryList.'+index+'.classificDirectory'"
        :rules="{
          required: true, message: '文件夹名称不能为空', trigger: 'blur'
        }"
      >
        <el-input v-model="formData.ftpDirectoryList[index]['classificDirectory']" placeholder="请输入文件夹名称" size="small" />
      </el-form-item>
      <el-form-item label="分发策略" prop="sendType">
        <el-radio-group v-model="formData.sendType">
          <el-radio :label="0">实时分发</el-radio>
          <el-radio :label="1">延时分发</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="延时时间" prop="sendTime">
        <el-select v-model="formData.sendTime" placeholder="请选择" size="mini" :disabled="formData.sendType!==1">
          <el-option
            v-for="item in intervalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    formRef: {
      type: String,
      required: true
    },
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      intervalOptions: [
        {
          label: '30秒',
          value: '30'
        },
        {
          label: '1分钟',
          value: '60'
        },
        {
          label: '5分钟',
          value: '300'
        },
        {
          label: '15分钟',
          value: '900'
        },
        {
          label: '30分钟',
          value: '1800'
        }
      ],
      rules: {
        TCPip: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        TCPPort: [
          { required: true, message: '端口不能为空', trigger: 'blur' }
        ],
        UDPip: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        UDPPort: [
          { required: true, message: '端口不能为空', trigger: 'blur' }
        ],
        FTPip: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        FTPPort: [
          { required: true, message: '端口不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '根目录不能为空', trigger: 'blur' }
        ],
        sendType: [
          { required: true, message: '分发策略不能为空', trigger: 'blur' }
        ],
        sendTime: [
          { required: true, message: '延时时间不能为空', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .form1{
      width: 30%;
      text-align: center;
      .mineTitle{
        text-align: center;
        color: #303133;
        margin: 15px 0 25px 0;
      }
      .subTitle{
        text-align: center;
        color: #606266;
        margin: 5px 0;
      }
    }
</style>
