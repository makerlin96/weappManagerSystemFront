<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:90%;" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="所属父级" prop="parentId">
        <el-popover
          ref="menuListPopover"
          v-model="menuListVisible"
          placement="bottom-start"
          trigger="click"
        >
          <el-scrollbar style="width: 200px">
            <el-tree
              ref="listTree"
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
      <el-form-item label="Key值" prop="k">
        <el-input v-model="dataForm.k" placeholder="请输入Key值" />
      </el-form-item>
      <el-form-item label="Value值" prop="value">
        <el-input v-model="dataForm.value" placeholder="请输入Value值" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" :min="1" :max="100" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { getDataList, add, edit, getInfo } from '@/api/dict'

export default {
  data() {
    return {
      visible: false,
      menuList: [],
      menuListVisible: false,
      dataForm: {
        id: '',
        name: '',
        k: '',
        value: '',
        parentId: 0,
        parentName: '',
        sort: 10
      },
      dataRule: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        k: [
          { required: true, message: 'Key值不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: 'Value值不能为空', trigger: 'blur' }
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
        this.$refs.listTree.setCurrentKey([])
        this.dataForm.parentName = ''
        this.getDataList()
      })
      if (this.dataForm.id) {
        getInfo(id).then(res => {
          if (res && res.code === 200) {
            this.dataForm = res.data
            setTimeout(() => {
              this.$refs.listTree.setCurrentKey(res.data.parentId)
            }, 500)
          }
        })
      }
    },
    getDataList() {
      getDataList().then(res => {
        this.menuList = res.data
      })
    },
    // 菜单树选中
    treeChangeHandle(data) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
      this.menuListVisible = false
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.id) {
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
