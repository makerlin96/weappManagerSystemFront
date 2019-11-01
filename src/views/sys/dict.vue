<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-has="'sys:dict:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">
        添加
      </el-button>
    </div>
    <el-table
      border
      :data="tableData"
      :loading="listLoading"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" header-align="center" />
      <el-table-column prop="k" label="Key值" align="center" />
      <el-table-column prop="value" label="Value值" align="center" />
      <el-table-column prop="sort" label="排序" align="center" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-has="'sys:dict:edit'" size="small" type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
          <el-button v-has="'sys:dict:del'" size="small" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDataList, del } from '@/api/dict'
import { handleCofirm } from '@/utils/confirm'
import AddOrUpdate from './dict-add-or-update'

export default {
  name: 'DictList',
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
