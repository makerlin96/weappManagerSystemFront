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
      <el-button type="primary" icon="el-icon-search" @click="initData">
        搜索
      </el-button>
      <el-button v-has="'sys:user:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">
        添加
      </el-button>
      <el-button v-has="'sys:user:del'" type="danger" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">
        删除
      </el-button>
      <el-button type="primary" :loading="downloadLoading" icon="el-icon-download" plain @click="handleExcel">
        导出
      </el-button>
      <el-button type="text" @click="moreSearch">更多筛选条件
        <i v-if="moreShow == true" class="el-icon-arrow-up" />
        <i v-else class="el-icon-arrow-down" />
      </el-button>
    </div>
    <div v-show="moreShow" class="filter-container">
      <el-input
        v-model="listQuery.mobile"
        placeholder="输入手机号查询"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="initData"
      />
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="left"
      />
    </div>
    <el-table border :data="tableData" :loading="listLoading" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="userId" label="ID" width="80" sortable align="center" />
      <el-table-column prop="username" label="账号" show-overflow-tooltip align="center" />
      <el-table-column prop="realName" label="姓名" show-overflow-tooltip align="center" />
      <el-table-column prop="mobile" label="联系电话" show-overflow-tooltip align="center" />
      <el-table-column prop="email" label="邮箱" show-overflow-tooltip align="center" />
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip sortable align="center" />
      <el-table-column prop="lastLoginTime" label="最后登录时间" show-overflow-tooltip align="center" />
      <el-table-column prop="status" label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="success">正常</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-has="'sys:user:edit'" size="small" type="text" @click="addOrUpdateHandle(scope.row.userId)">编辑</el-button>
          <el-button v-has="'sys:user:del'" size="small" type="text" @click="deleteHandle(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDataList, del, exportExcel } from '@/api/user'
import Pagination from '@/components/Pagination'
import { handleCofirm } from '@/utils/confirm'
import AddOrUpdate from './user-add-or-update'

export default {
  name: 'UserList',
  components: {
    Pagination,
    AddOrUpdate
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        username: '',
        mobile: '',
        startDate: '',
        endDate: ''
      },
      total: 0,
      dateRange: null,
      listLoading: true,
      downloadLoading: false,
      dataListSelections: [],
      tableData: [],
      addOrUpdateVisible: false,
      moreShow: false,
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
    moreSearch() {
      this.moreShow = !this.moreShow
    },
    // 添加和编辑
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 导出
    handleExcel() {
      this.downloadLoading = true
      exportExcel(this.listQuery).then(res => {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        const url = URL.createObjectURL(blob)
        const aLink = document.createElement('a')
        aLink.style.display = 'none'
        aLink.download = '用户列表.xlsx'
        aLink.href = url
        document.body.appendChild(aLink)
        aLink.click()
        this.downloadLoading = false
      })
    },
    // 删除
    deleteHandle(id) {
      const userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      handleCofirm(`确定对 [ id=${userIds.join(',')} ] 进行 [${id ? '删除' : '批量删除'}] 操作?`).then(res => {
        del(userIds).then(res => {
          this.listLoading = true
          if (res.code === 200) {
            this.listLoading = false
            this.initData()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
