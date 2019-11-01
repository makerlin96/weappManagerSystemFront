<template>
  <div class="dashboard-editor-container" style="padding: 20px;">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" style="margin-bottom: 20px;">
          <div slot="header" class="clearfix">
            <span>销量统计</span>
          </div>
          <veLine :data="lineData" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单统计</span>
          </div>
          <veHistogram :data="histogramData" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>内存信息</span>
          </div>
          <el-table :data="tableDataMemMerge" border style="width: 100%">
            <el-table-column prop="label" label="属性" width="200" />
            <el-table-column prop="value" label="值" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务器信息</span>
          </div>
          <el-table :data="tableDataSysMerge" border style="width: 100%">
            <el-table-column prop="label" label="属性" width="200" />
            <el-table-column prop="value" label="值" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import VeLine from 'v-charts/lib/line.min'
import VeHistogram from 'v-charts/lib/histogram.min'
export default {
  name: 'Dashboard',
  components: {
    VeLine,
    VeHistogram
  },
  data() {
    return {
      lineData: {
        columns: ['日期', '访问用户', '下单用户', '下单率', '退货率'],
        rows: [
          { '日期': '4月', '访问用户': 50, '下单用户': 100, '下单率': 0.32, '退货率': 0.0 },
          { '日期': '5月', '访问用户': 300, '下单用户': 350, '下单率': 0.26, '退货率': 0.0 },
          { '日期': '6月', '访问用户': 150, '下单用户': 200, '下单率': 0.76, '退货率': 50 },
          { '日期': '7月', '访问用户': 200, '下单用户': 250, '下单率': 50, '退货率': 0.0 },
          { '日期': '8月', '访问用户': 250, '下单用户': 300, '下单率': 0.323, '退货率': 0.0 },
          { '日期': '9月', '访问用户': 100, '下单用户': 150, '下单率': 0.78, '退货率': 0.0 }
        ]
      },
      histogramData: {
        columns: ['日期', '下单量', '成交量'],
        rows: [
          { '日期': '星期一', '下单量': 6393, '成交量': 1093 },
          { '日期': '星期二', '下单量': 5530, '成交量': 3230 },
          { '日期': '星期三', '下单量': 1923, '成交量': 2623 },
          { '日期': '星期四', '下单量': 2723, '成交量': 1423 },
          { '日期': '星期五', '下单量': 4792, '成交量': 3492 },
          { '日期': '星期六', '下单量': 6593, '成交量': 4293 }
        ]
      },
      tableDataMemMerge: [
        {
          label: '内存总量',
          value: '0.97'
        }
      ],
      tableDataSysMerge: [
        {
          label: 'CPU用户使用率',
          value: '10%'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
