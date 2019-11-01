<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.roleName"
        placeholder="输入角色名查询"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="search"
      />
      <el-button type="primary" icon="el-icon-search" @click="search">
        搜索
      </el-button>
      <el-button v-has="'sys:role:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">
        添加
      </el-button>
      <el-button v-has="'sys:role:del'" type="danger" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">
        删除
      </el-button>
    </div>
    <el-table border :data="tableData" :loading="listLoading" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="roleId" label="ID" width="80" align="center" />
      <el-table-column prop="roleName" label="角色名" align="center" />
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-has="'sys:role:edit'" size="small" type="text" @click="addOrUpdateHandle(scope.row.roleId)">编辑</el-button>
          <el-button v-has="'sys:role:del'" size="small" type="text" @click="deleteHandle(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDataList, del } from '@/api/role'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './role-add-or-update'
import { handleCofirm } from '@/utils/confirm'

export default {
  name: 'RoleList',
  components: {
    Pagination,
    AddOrUpdate
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        roleName: ''
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
    // 搜索
    search() {
      this.initData()
    },
    // 添加和编辑
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      const roleIds = id ? [id] : this.dataListSelections.map(item => {
        return item.roleId
      })
      handleCofirm(`确定对 [ id=${roleIds.join(',')} ] 进行 [${id ? '删除' : '批量删除'}] 操作?`).then(res => {
        del(roleIds).then(res => {
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
