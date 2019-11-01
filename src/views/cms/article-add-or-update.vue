<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="30%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:90%;" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="dataForm.keyword" placeholder="请输入关键字" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getInfo, add, edit } from '@/api/article'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: '',
        title: '',
        status: 0,
        keyword: ''
      },
      dataRule: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '关键字不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.id) {
        getInfo(id).then(res => {
          if (res && res.code === 200) {
            this.dataForm = res.data
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            'id': this.dataForm.id,
            'title': this.dataForm.title,
            'status': this.dataForm.status,
            'keyword': this.dataForm.keyword
          }
          if (!this.dataForm.id) {
            add(param).then(res => {
              this.returnResponse(res)
            })
          } else {
            edit(param).then(res => {
              this.returnResponse(res)
            })
          }
        }
      })
    },
    returnResponse(res) {
      if (res.code === 200) {
        this.visible = false
        this.$emit('refreshDataList')
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>
