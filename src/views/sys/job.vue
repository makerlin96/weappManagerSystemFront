<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="输入Bean名称查询"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="initData"
      />
      <el-button type="primary" icon="el-icon-search" @click="initData">
        搜索
      </el-button>
      <el-button v-has="'sys:job:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">
        添加
      </el-button>
      <el-button v-has="'sys:job:del'" type="danger" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">
        删除
      </el-button>
      <el-button type="primary" icon="el-icon-info">
        执行日志
      </el-button>
    </div>
    <el-table border :data="tableData" :loading="listLoading" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="jobId" label="ID" width="80" align="center" />
      <el-table-column prop="beanName" label="bean名称" show-overflow-tooltip align="center" />
      <el-table-column prop="methodName" label="方法名" show-overflow-tooltip align="center" />
      <el-table-column prop="params" label="参数" show-overflow-tooltip align="center" />
      <el-table-column prop="cronExpression" label="cron表达式" show-overflow-tooltip align="center" />
      <el-table-column prop="status" label="任务状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="success">正在执行</el-tag>
          <el-tag v-if="scope.row.status === 1" size="small" type="danger">已暂停</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center" />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip align="center" />
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" v-has="'sys:job:pause'" size="small" type="text" @click="pauseHandle(scope.row.jobId)">暂停</el-button>
          <el-button v-if="scope.row.status === 1" v-has="'sys:job:resume'" size="small" type="text" @click="resumeHandle(scope.row.jobId)">恢复</el-button>
          <el-button v-has="'sys:job:run'" size="small" type="text" @click="runHandle(scope.row.jobId)">立即运行</el-button>
          <el-button v-has="'sys:job:edit'" size="small" type="text" @click="addOrUpdateHandle(scope.row.jobId)">编辑</el-button>
          <el-button v-has="'sys:job:del'" size="small" type="text" @click="deleteHandle(scope.row.jobId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDataList, run, resume, pause, del } from '@/api/job'
import Pagination from '@/components/Pagination'
import { handleCofirm } from '@/utils/confirm'
import AddOrUpdate from './job-add-or-update'

export default {
  name: 'JobList',
  components: {
    Pagination,
    AddOrUpdate
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        beanName: ''
      },
      total: 0,
      listLoading: true,
      dataListSelections: [],
      tableData: [],
      addOrUpdateVisible: false
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
    // 添加和编辑
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    runHandle(id) {
      run(id).then(res => {
        if (res.code === 200) {
          this.initData()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    resumeHandle(id) {
      resume(id).then(res => {
        if (res.code === 200) {
          this.initData()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    pauseHandle(id) {
      pause(id).then(res => {
        if (res.code === 200) {
          this.initData()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
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
      }).catch(() => {})
    }
  }
}
</script>
