<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="configHandle()">
        上传配置
      </el-button>
      <el-button type="primary" icon="el-icon-plus" @click="uploadHandle()">
        上传文件
      </el-button>
      <el-button v-has="'sys:role:del'" type="danger" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">
        删除
      </el-button>
    </div>
    <el-table border :data="tableData" :loading="listLoading" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="url" label="URL地址" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="300" align="center" />
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="seeHandle(scope.row.url)">查看</el-button>
          <el-button v-has="'sys:role:del'" size="small" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
    <config v-if="configVisible" ref="config" />
    <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import { getDataList, del } from '@/api/oss'
import Pagination from '@/components/Pagination'
import Config from './oss-config'
import Upload from './oss-upload'
import { handleCofirm } from '@/utils/confirm'

export default {
  name: 'OssList',
  components: {
    Pagination,
    Config,
    Upload
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      listLoading: true,
      dataListSelections: [],
      tableData: [],
      configVisible: false,
      uploadVisible: false
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
    // 云存储配置
    configHandle() {
      this.configVisible = true
      this.$nextTick(() => {
        this.$refs.config.init()
      })
    },
    // 上传文件
    uploadHandle() {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
      })
    },
    // 查看
    seeHandle(url) {
      window.open(url, '_blank')
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
      }).catch(() => {})
    }
  }
}
</script>
