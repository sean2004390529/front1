<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" v-if="!changeMode" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="changeMode=!changeMode">
        编辑部门
      </el-button>
      <el-button class="filter-item" v-if="changeMode" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="changeMode=!changeMode">
        取消编辑
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
      </el-button>
    </div>

    <!-- 部门树 -->
    <el-row :gutter="20">
      <el-col :span="10">
        <el-tree ref="tree"
        :data="list"
        node-key="id"
        :props="defaultProps"
        highlight-current
        default-expand-all
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="changeMode">
            <el-button v-if="node.isLeaf" type="text" size="mini" @click="() => handleDelete(node, data)">删除</el-button>
            <el-button type="text" size="mini" @click="() => handleAdd(data)">添加子部门</el-button>
            <el-button type="text" size="mini" @click.stop="() => handleUdate(data)">修改部门名称</el-button>
          </span>
        </span>
      </el-tree>
    </el-col>
      <el-col :span="10" :offset="2" v-if="dialogFormVisible">
        <el-form ref="dataForm" :model="temp" :rules="rules" label-width="80px">
          <el-form-item label="部门id">
            <el-input v-model="temp.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="部门名称">
            <el-input v-model="temp.deptName"></el-input>
          </el-form-item>
          <el-form-item label="父部门" v-if="addMode">
            <el-input v-model="temp.parentName" placeholder="请点击左边部门选择" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button v-if="addMode" type="primary" @click="createData">创建部门</el-button>
            <el-button v-if="!addMode" type="primary" @click="updateData">修改部门名称</el-button>
            <el-button @click="resetTemp">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { fetchList, createDept, updateDept, deleteDept } from '@/api/dept'

export default {
  name: 'Department',
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      changeMode: false,
      list: null,
      addMode: true,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      temp: {
        id: undefined,
        deptName: '',
        parentId: undefined,
        status: '',
        parentName: ''
      },
      rules: {
        deptName: [{ required: true, message: '部门名称必填', trigger: 'blur' }],
        parentId: [{ required: true, message: '所属部门必点', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        deptName: '',
        parentId: undefined,
        status: '',
        parentName: ''
      },
      this.dialogFormVisible = false
      this.addMode=true
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data)
    },
    handleNodeClick(data) {
      this.temp.parentId = data.id
      this.temp.parentName = data.deptName
    },
    handleAdd(data){
      this.addMode=true
      this.temp.parentId = data.id
      this.temp.parentName = data.deptName
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDept(this.temp).then(() => {
            this.$notify({
              title: '成功',
              message: '创建部门成功',
              type: 'success',
              duration: 5000
            })
          })
          this.resetTemp()
        }
      })
      setTimeout(() => {
        this.getList()
      }, 500)
    },
    handleUdate(data){
      this.resetTemp()
      this.temp.id = data.id
      this.temp.deptName = data.deptName
      this.temp.parentId = data.parentId
      this.addMode=false
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateDept(this.temp).then(() => {
            this.$notify({
              title: '成功',
              message: '修改部门成功',
              type: 'success',
              duration: 5000
            })
          })
          this.resetTemp()
          setTimeout(() => {
            this.getList()
          }, 500)
        }
      })
    },
    deleteDept(deptId) {
      deleteDept(deptId).then(response => {
        this.getList()
      })
    },
    handleDelete(node, data) {
      this.$confirm('是否删除选中部门', '删除部门', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDept(data.id)
        this.$message({
          type: 'success',
          message: '删除部门成功!(如果部门还存在，表明此部门还有员工，请先移除员工到其他部门)',
          duration: '10000'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除部门/删除部门失败'
        })
      })
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

</style>
