<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="输入文章标题查询"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="search"
      />
      <el-button type="primary" icon="el-icon-search" @click="search">
        搜索
      </el-button>
      <el-button v-has="'cms:article:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">
        添加
      </el-button>
      <el-button v-has="'cms:article:del'" type="danger" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">
        删除
      </el-button>
    </div>
    <el-table border :data="tableData" :loading="listLoading" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="title" label="标题" show-overflow-tooltip align="center" />
      <el-table-column prop="cateName" label="分类" align="center" />
      <el-table-column prop="keyword" label="关键字" align="center" />
      <el-table-column prop="views" label="浏览量" align="center" />
      <el-table-column prop="writer" label="发布人" align="center" />
      <el-table-column prop="status" label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="success">正常</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-has="'cms:article:edit'" size="small" type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
          <el-button v-has="'cms:article:del'" size="small" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDataList, del } from '@/api/article'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './article-add-or-update'
import { handleCofirm } from '@/utils/confirm'

export default {
  name: 'ArticleList',
  components: {
    Pagination,
    AddOrUpdate
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        title: ''
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
      const Ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      handleCofirm(`确定对 [ id=${Ids.join(',')} ] 进行 [${id ? '删除' : '批量删除'}] 操作?`).then(res => {
        del(Ids).then(res => {
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
