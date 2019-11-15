<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="系统设置" name="first">
          <el-form ref="sysForm" :model="sysForm" label-width="200px" style="width:40%;">
            <el-form-item label="系统名称：" prop="sysName">
              <el-input v-model="sysForm.sysName" placeholder="请输入系统名称" />
            </el-form-item>
            <el-form-item label="系统描述：" prop="sysDesc">
              <el-input v-model="sysForm.sysDesc" placeholder="请输入系统描述" />
            </el-form-item>
            <el-form-item label="系统关键字：" prop="sysKeyword">
              <el-input v-model="sysForm.sysKeyword" placeholder="请输入系统关键字" />
            </el-form-item>
            <el-form-item label="系统备案号：" prop="sysIcp">
              <el-input v-model="sysForm.sysIcp" placeholder="请输入系统备案号" />
            </el-form-item>
            <el-form-item label="版权信息：" prop="sysCopy">
              <el-input v-model="sysForm.sysCopy" placeholder="请输入系统关键字" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-edit" @click="dataFormSubmit()">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="上传配置" name="second">
          <el-form ref="uploadForm" :model="uploadForm" label-width="200px" style="width:40%;">
            <el-form-item label="存储位置：" prop="type">
              <el-radio-group v-model="uploadForm.type">
                <el-radio :label="0">本地</el-radio>
                <el-radio :label="1">七牛云</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="uploadForm.type === 0" label="上传目录：" prop="path">
              <el-input v-model="uploadForm.path" placeholder="服务器资源目录,例如C:/uploads" />
            </el-form-item>
            <template v-if="uploadForm.type === 1">
              <el-form-item label="accesskey：" prop="accesskey">
                <el-input v-model="uploadForm.accesskey" placeholder="请前往七牛云存储平台查看secretkey" />
              </el-form-item>
              <el-form-item label="secretkey：" prop="secretkey">
                <el-input v-model="uploadForm.secretkey" placeholder="请前往七牛云存储平台查看secretkey" />
              </el-form-item>
              <el-form-item label="默认域名：" prop="domain">
                <el-input v-model="uploadForm.domain" placeholder="七牛云存储的外链默认域名" />
              </el-form-item>
              <el-form-item label="空间名：" prop="bucketname">
                <el-input v-model="uploadForm.bucketname" placeholder="七牛云存储的空间名" />
              </el-form-item>
            </template>
            <el-form-item>
              <el-button type="primary" icon="el-icon-edit" @click="dataFormSubmit()">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="短信配置" name="third">
          <el-form ref="smsForm" :model="smsForm" label-width="200px" style="width:40%;">
            <el-form-item label="AccessKeyId：" prop="key">
              <el-input v-model="smsForm.key" placeholder="请输入阿里云短信平台AccessKeyId" />
            </el-form-item>
            <el-form-item label="AccessKeySecret：" prop="secret">
              <el-input v-model="smsForm.secret" placeholder="请输入阿里云短信平台AccessKeySecret" />
            </el-form-item>
            <el-form-item label="短信签名：" prop="signName">
              <el-input v-model="smsForm.signName" placeholder="请输入阿里云审核通过的短信签名" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-edit" @click="dataFormSubmit()">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="推送配置" name="fourth">
          <el-form ref="pushForm" :model="pushForm" label-width="200px" style="width:40%;">
            <el-form-item label="AppKey：" prop="key">
              <el-input v-model="pushForm.key" placeholder="请输入极光平台AppKey" />
            </el-form-item>
            <el-form-item label="MasterSecret：" prop="secret">
              <el-input v-model="pushForm.secret" placeholder="请输入极光平台Master" />
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-radio-group v-model="pushForm.status">
                <el-radio :label="0">开启</el-radio>
                <el-radio :label="1">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-edit" @click="dataFormSubmit()">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="开放平台配置" name="open">
          <el-form ref="pushForm" :model="openForm" label-width="200px" style="width:40%;">
            <el-form-item label="clientId：" prop="key">
              <el-input v-model="openForm.clientId" placeholder="请输入拼多多开放平台clientId" />
            </el-form-item>
            <el-form-item label="clientSecret：" prop="secret">
              <el-input v-model="openForm.clientSecret" placeholder="请输入拼多多开放平台clientSecret" />
            </el-form-item>
            <el-form-item label="accessToken：" prop="secret">
              <el-input v-model="openForm.accessToken" placeholder="请输入拼多多开放平台accessToken" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-edit" @click="jinbaoConfigSubmit()">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getSysConfigInfo, jinbaoConfigSubmit } from '@/api/sysConfig'

export default {
  name: 'Tab',
  components: {

  },
  data() {
    return {
      activeName: 'first',
      sysForm: {
        sysName: '',
        sysDesc: '',
        sysKeyword: '',
        sysIcp: '',
        sysCopy: ''
      },
      uploadForm: {
        type: 0,
        path: 'C:/uploads',
        accesskey: '',
        secretkey: '',
        domain: '',
        bucketname: ''
      },
      smsForm: {
        key: '',
        secret: '',
        signName: ''
      },
      pushForm: {
        key: '',
        secret: '',
        status: 0
      },
      openForm: {
        clientId: '',
        clientSecret: '',
        accessToken: ''
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getSysConfigInfo().then(res => {
        // console.log(res.data)
        this.sysForm = res.data.sysConfig
        this.pushForm = res.data.pushConfig
        this.uploadForm = res.data.uploadConfig
        this.openForm = res.data.jinbaoConfig
        // this.
      })
    },
    jinbaoConfigSubmit() {
      jinbaoConfigSubmit(this.openForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    dataFormSubmit() {
      this.$message.error('不可配置')
    }
  }
}
</script>
<style>
  .el-tabs__content {
    margin-top: 20px;
  }
</style>
