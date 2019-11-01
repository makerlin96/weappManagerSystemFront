<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="输入用户名查询"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="initData"
      />
      <el-date-picker
        v-model="dateRange"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="left"
        class="filter-item"
      />
      <el-button type="primary" icon="el-icon-search" @click="initData">
        搜索
      </el-button>
      <el-button v-has="'sys:log:del'" type="danger" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">
        删除
      </el-button>
    </div>
    <el-table border :data="tableData" :loading="listLoading" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="username" label="操作账号" width="150" align="center" />
      <el-table-column prop="operation" label="操作方法" width="150" align="center" />
      <el-table-column prop="params" label="请求参数" show-overflow-tooltip align="center" />
      <el-table-column prop="time" label="执行时长(ms)" width="140" show-overflow-tooltip align="center" />
      <el-table-column prop="ip" label="IP地址" width="150" show-overflow-tooltip align="center" />
      <el-table-column prop="createTime" label="操作时间" width="180" align="center" />
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button v-has="'sys:log:del'" size="small" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
  </div>
</template>

<script>
import { getDataList, del } from '@/api/log'
import Pagination from '@/components/Pagination'
import { handleCofirm } from '@/utils/confirm'
export default {
  name: 'LogList',
  components: {
    Pagination
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        username: '',
        startDate: '',
        endDate: ''
      },
      total: 0,
      dateRange: null,
      listLoading: true,
      dataListSelections: [],
      tableData: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    dateRange(val) {
      if (val == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = val[0]
        this.listQuery.endDate = val[1]
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getDataList(this.listQuery).then(res => {
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.listLoading = false
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      handleCofirm(`确定对 [ id=${ids.join(',')} ] 进行 [${id ? '删除' : '批量删除'}] 操作?`).then(res => {
        del(ids).then(res => {
          this.listLoading = true
          if (res.code === 200) {
            this.listLoading = false
            this.initData()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {

      })
    }
  }
}
</script>
