<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:90%;" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="父级菜单" prop="parentId">
        <el-popover
          ref="menuListPopover"
          v-model="menuListVisible"
          placement="bottom-start"
          trigger="click"
        >
          <el-scrollbar style="width: 200px">
            <el-tree
              ref="menuListTree"
              :data="menuList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="treeChangeHandle"
            />
          </el-scrollbar>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="默认顶级" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" label="路由" prop="path">
        <el-input v-model="dataForm.path" placeholder="请输入路由地址" />
      </el-form-item>
      <el-form-item label="授权" prop="perms">
        <el-input v-model="dataForm.perms" placeholder="请输入授权标识" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" :min="0" />
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" label="图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="请选择图标" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getDataList, add, edit, getInfo } from '@/api/permission'

export default {
  data() {
    return {
      visible: false,
      menuList: [],
      menuListVisible: false,
      dataForm: {
        id: '',
        name: '',
        parentId: 0,
        parentName: '',
        perms: '',
        icon: '',
        path: '',
        sort: 10,
        type: 1
      },
      dataRule: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
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
        this.dataForm.parentName = ''
      })
      if (this.dataForm.id) {
        getInfo(id).then(res => {
          if (res && res.code === 200) {
            this.dataForm.id = res.data.id
            this.dataForm.name = res.data.name
            this.dataForm.parentId = res.data.parentId
            this.dataForm.parentName = res.data.parentName
            this.dataForm.perms = res.data.perms
            this.dataForm.icon = res.data.icon
            this.dataForm.path = res.data.path
            this.dataForm.sort = res.data.sort
            this.dataForm.type = res.data.type
          }
        })
      }
      getDataList().then(res => {
        this.menuList = res.data
      })
    },
    // 上级菜单树, 选中
    treeChangeHandle(data) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
      this.menuListVisible = false
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            'id': this.dataForm.id,
            'name': this.dataForm.name,
            'parentId': this.dataForm.parentId,
            'parentName': this.dataForm.parentName,
            'perms': this.dataForm.perms,
            'icon': this.dataForm.icon,
            'path': this.dataForm.path,
            'sort': this.dataForm.sort,
            'type': this.dataForm.type
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
