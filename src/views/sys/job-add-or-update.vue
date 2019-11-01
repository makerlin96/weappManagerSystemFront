<template>
  <el-dialog
    :title="!dataForm.jobId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:90%;" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="bean名称" prop="beanName">
        <el-input v-model="dataForm.beanName" placeholder="请输入“@Component”注解中的bean名称" />
      </el-form-item>
      <el-form-item label="方法名称" prop="methodName">
        <el-input v-model="dataForm.methodName" placeholder="请要执行的方法名称" />
      </el-form-item>
      <el-form-item label="参数" prop="params">
        <el-input v-model="dataForm.params" placeholder="请输入参数（选填）" />
      </el-form-item>
      <el-form-item label="表达式" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" placeholder="请选择cron表达式" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="请输入备注信息" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getInfo, add, edit } from '@/api/job'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        jobId: '',
        beanName: '',
        methodName: '',
        params: '',
        cronExpression: '',
        remark: ''
      },
      dataRule: {
        beanName: [
          { required: true, message: '请输入bean名称', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '请要执行的方法名称', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '请选择cron表达式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.jobId = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.jobId) {
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
          if (!this.dataForm.jobId) {
            add(this.dataForm).then(res => {
              this.returnResponse(res)
            })
          } else {
            edit(this.dataForm).then(res => {
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
