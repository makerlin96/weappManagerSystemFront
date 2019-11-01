<template>
  <el-dialog
    :title="!dataForm.cateId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="30%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:90%;" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="分类名称" prop="cateName">
        <el-input v-model="dataForm.cateName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="请输入排序" />
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
import { getInfo, add, edit } from '@/api/articleCate'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        cateId: '',
        cateName: '',
        status: 0,
        sort: ''
      },
      dataRule: {
        cateName: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.cateId = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.cateId) {
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
            'cateId': this.dataForm.cateId,
            'cateName': this.dataForm.cateName,
            'status': this.dataForm.status,
            'sort': this.dataForm.sort
          }
          if (!this.dataForm.cateId) {
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
