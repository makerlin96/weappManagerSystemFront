<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>佣金比例</span>
        <!--        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
      </div>
      <el-form label-position="right" label-width="80px" :model="commissionRate">
        <el-col :span="8">
          <el-form-item label="用户佣金">
            <el-input v-model="commissionRate.userRate">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-input v-model="commissionRate.proxyRate">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动形式">
            <el-input v-model="commissionRate.partnerRate">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setCommissionRate">提交</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getCommissionRate, setCommissionRate } from '@/api/settings';

export default {
  name: 'CommissionRate',
  data() {
    return {
      commissionRate: {
        userRate: 0,
        proxyRate: 0,
        partnerRate: 0
      }
    }
  },
  created() {
    getCommissionRate().then(res => {
      this.commissionRate = res.data
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    setCommissionRate() {
      setCommissionRate(this.commissionRate).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
