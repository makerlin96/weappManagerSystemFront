<template>
  <el-dialog
    :title="!dataForm.userId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:90%;" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="账号" prop="username">
        <el-input v-model="dataForm.username" :disabled="dataForm.userId>0" placeholder="请输入帐号" />
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.userId }">
        <el-input v-model="dataForm.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.userId }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="请输入帐号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="角色" prop="roleIdList">
        <el-select v-model="dataForm.roleIdList" multiple placeholder="请选择角色" style="width: 100%">
          <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId" />
        </el-select>
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
import { isEmail, isMobile } from '@/utils/validate'
import { getUserInfo, add, edit } from '@/api/user'
import { getRoleList } from '@/api/role'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!this.dataForm.userId && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.userId && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      dataForm: {
        userId: '',
        username: '',
        password: '',
        realName: '',
        comfirmPassword: '',
        email: '',
        mobile: '',
        roleIdList: [],
        status: 0
      },
      dataRule: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        roleIdList: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.userId = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.userId) {
        getUserInfo(id).then(res => {
          if (res && res.code === 200) {
            this.dataForm.userId = res.data.userId
            this.dataForm.username = res.data.username
            this.dataForm.email = res.data.email
            this.dataForm.realName = res.data.realName
            this.dataForm.mobile = res.data.mobile
            this.dataForm.roleIdList = res.data.roleIdList
            this.dataForm.status = res.data.status
          }
        })
      }
      // 获取角色列表
      getRoleList().then(res => {
        this.roleList = res.data && res.code === 200 ? res.data : []
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            'userId': this.dataForm.userId,
            'username': this.dataForm.username,
            'password': this.dataForm.password,
            'realName': this.dataForm.realName,
            'email': this.dataForm.email,
            'mobile': this.dataForm.mobile,
            'status': this.dataForm.status,
            'roleIdList': this.dataForm.roleIdList
          }
          if (!this.dataForm.userId) {
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
