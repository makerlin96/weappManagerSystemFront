<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item :model="listQuery">
          <el-input v-model="listQuery.q" clearable placeholder="请输入关键词" @change="initData"></el-input>
        </el-form-item>
        <el-form-item :model="listQuery">
          <el-select v-model="listQuery.cid" value="0" placeholder="请选择" @change="initData">
            <el-option
              v-for="item in cats"
              :key="item.cid"
              :label="item.name"
              :value="item.cid"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.cid }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      :data="goodsList"
      :loading="listLoading"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="itemId"
        width="150"
        align="center"
        label="商品ID">
      </el-table-column>
      <el-table-column
        prop="title"
        label="商品信息"
        show-overflow-tooltip
        align="left"
        width="600"
      >
        <template slot-scope="scope">
          <el-row>
            <el-col :span="5">
              <el-row style="width: 100px; height: 100px;">
                <el-col :span="24">
                  <img :src="scope.row.pictUrl" width="100" height="100">
                </el-col>
              </el-row>
              <el-row style="width: 100px; height: 100px;">
                <el-col :span="24">
                  <p style="font-size: 12px;text-align: center">
                    {{ scope.row.shopTitle }}
                    <span v-if="scope.row.userType === 0"><svg-icon icon-class="taobao" style="font-size: 16px"></svg-icon></span>
                    <span v-if="scope.row.userType === 1"><svg-icon icon-class="tmall" style="font-size: 16px"></svg-icon></span>
                  </p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="19">
              <el-row style="text-align: left">
                <el-col :span="24">
                  <span><a :href="'https://item.taobao.com/item.htm?id=' + scope.row.itemId" target="blank">{{ scope.row.title }}</a></span>
                  <br><br>
                </el-col>
                <el-col :span="5">
                  <div class="coupon-info">
                    <span>
                      <i>券</i>
                      {{ scope.row.couponAmount }}
                    </span>
                  </div>
                </el-col>
                <el-col :span="10">
                  <span>券后价：￥{{ (scope.row.zkFinalPrice - scope.row.couponAmount).toFixed(2) }}</span>
                </el-col>
              </el-row>
              <el-row style="text-align: left">
                <el-col :span="12">
                  佣金比例：<span style="color: red">{{ scope.row.commissionRate/100 }}%</span>
                </el-col>
                <el-col :span="12">
                  销量：
                  <el-tag v-if="scope.row.volume > 10000" size="small" type="danger">{{ scope.row.volume }}</el-tag>
                  <el-tag v-else size="small" type="success">{{ scope.row.volume }}</el-tag>
                </el-col>
                <br><br>
              </el-row>
              <el-row style="text-align: right">
                <el-col :span="24">
                  <el-button type="primary" icon="el-icon-phone" size="mini" round @click="contact(scope.row)">
                    联系商家
                  </el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        prop="commissionType"
        label="推广计划类型"
        width="150"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.commissionType === 'MKT'" type="danger">
            营销计划
          </el-tag>
          <el-tag v-else-if="scope.row.commissionType === 'SP'" type="primary">
            定向计划
          </el-tag>
          <el-tag v-else type="success">
            通用计划
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="couponInfo"
        label="优惠券信息"
        show-overflow-tooltip
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">
              <el-tag type="danger">{{ scope.row.couponInfo }}</el-tag>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="24">
              起：{{ scope.row.couponStartTime }}
            </el-col>
            <el-col :span="24">
              止：{{ scope.row.couponEndTime }}
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="12">
              <span>总：{{ scope.row.couponTotalCount }}</span>
            </el-col>
            <el-col :span="12">
              <span>余：{{ scope.row.couponRemainCount }}</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsId"
        label="操作"
        show-overflow-tooltip
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="提交审核" placement="top">
            <el-button :loading="checkSubmitLoading" type="primary" circle size="small" icon="el-icon-check" @click="checkSubmit(scope.row.itemId)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
  </div>
</template>

<script>
import { getGoods, getCats } from '@/api/goods'
import Pagination from '@/components/Pagination'
export default {
  name: 'GoodsSearch',
  components: {
    Pagination
  },
  data() {
    return {
      listQuery: {
        q: null,
        cid: null,
        page: 1,
        limit: 20
      },
      goodsList: [],
      cats: [],
      listLoading: true,
      checkSubmitLoading: false,
      total: 0
    }
  },
  created() {
    this.initData()
    getCats().then(res => {
      if (res.code === 200) {
        this.cats = res.data
      } else {
        this.$message.error(res.msg)
      }
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    initData() {
      getGoods(this.listQuery).then(res => {
        console.log(this.listQuery)
        if (res.code === 200) {
          this.goodsList = res.data
          this.total = res.totalCount
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(err)
      })
    },
    checkSubmit() {
      this.checkSubmitLoading = true
      this.$message.success('提交成功！')
      this.checkSubmitLoading = false
    },
    contact(data) {
      window.open(`https://amos.alicdn.com/getcid.aw?uid=${data.nick}&site=cntaobao`)
    }
  }
}
</script>

<style scoped>

</style>
