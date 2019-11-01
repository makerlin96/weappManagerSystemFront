<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-has="'sys:user:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">
        添加
      </el-button>
    </div>
    <el-table
      border
      :data="tableData"
      :loading="listLoading"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" header-align="center" />
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope" align="center">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="类型" width="120" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-if="scope.row.type === 2" size="small" type="primary">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由" align="center" />
      <el-table-column prop="perms" label="授权标识" align="center" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-has="'sys:user:edit'" size="small" type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
          <el-button v-has="'sys:user:edit'" size="small" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDataList, del } from '@/api/permission'
import { handleCofirm } from '@/utils/confirm'
import AddOrUpdate from './permission-add-or-update'

export default {
  name: 'PermissionList',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      listLoading: true,
      tableData: [],
      addOrUpdateVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getDataList().then(res => {
        this.tableData = res.data
        this.listLoading = false
      })
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
      handleCofirm('此操作将永久删除该数据, 是否继续?').then(res => {
        del([id]).then(res => {
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
