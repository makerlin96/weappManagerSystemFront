<template>
  <el-dialog
    :title="!dataForm.roleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="30%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:90%;" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="授权" prop="remark">
        <el-form-item>
          <el-tree
            ref="tree"
            :data="permissionList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            show-checkbox
            accordion
          />
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getInfo, add, edit } from '@/api/role'
import { getDataList } from '@/api/permission'

export default {
  data() {
    return {
      permissionList: [],
      visible: false,
      dataForm: {
        roleId: '',
        roleName: '',
        remark: '',
        permissionIdList: []
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.roleId = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.tree.setCheckedKeys([])
        Promise.all([
          this.getPermissionList()
        ]).then(() => {
          if (this.dataForm.roleId) {
            this.getInfo()
          }
        })
      })
    },
    getInfo() {
      getInfo(this.dataForm.roleId).then(res => {
        if (res && res.code === 200) {
          this.dataForm = res.data
          setTimeout(() => {
            res.data.permissionIdList.forEach((value) => {
              this.$refs.tree.setChecked(value, true, false)
            })
          }, 500)
        }
      })
    },
    // 获取菜单列表
    getPermissionList() {
      getDataList().then(res => {
        if (res && res.code === 200) {
          this.permissionList = res.data
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.permissionIdList = [
            ...this.$refs.tree.getCheckedKeys(),
            ...this.$refs.tree.getHalfCheckedKeys()
          ]
          const param = {
            'roleId': this.dataForm.roleId,
            'roleName': this.dataForm.roleName,
            'remark': this.dataForm.remark,
            'permissionIdList': this.dataForm.permissionIdList
          }
          if (!this.dataForm.roleId) {
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
