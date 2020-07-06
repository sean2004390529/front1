<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
      </el-button>
      <el-col :span="4">
        <el-input v-model="filterText" placeholder="搜索部门" />
      </el-col>
    </div>

    <!-- 部门树 -->
    <el-col :span="8">
      <el-tree
        ref="tree"
        class="filter-tree"
        :data="list"
        node-key="id"
        highlight-current
        show-checkbox
        default-expand-all
        :filter-node-method="filterNode"
        :props="defaultProps"
        :render-content="renderContent"
        @check-change="handleCheckChange"
      />
    </el-col>

    <!-- 编辑框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="ID" prop="id" hidden>
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输部门名称" />
        </el-form-item>
        <el-form-item v-if="temp.pid!=0" label="所属部门" prop="pid">
          <el-select v-model="temp.pid" placeholder="请选择所属部门">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchAllDept, createDept, updateDept, fetchSubDept, deleteDept } from '@/api/dept'

export default {
  name: 'Roles',
  data() {
    return {
      listLoading: false,
      filterText: '',
      list: null,
      options: null,
      defaultProps: {
        children: 'subDept',
        label: 'name'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        id: undefined,
        name: '',
        pid: undefined,
        status: '',
        createTime: new Date()
      },
      rules: {
        name: [{ required: true, message: '部门名称必填', trigger: 'blur' }],
        pid: [{ required: true, message: '所属部门必选', trigger: 'blur' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
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
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        pid: undefined,
        status: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      fetchAllDept().then(response => {
        this.options = response.data
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDept(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建部门成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
      setTimeout(() => {
        this.getList()
      }, 500)
    },
    handleUpdate(data) {
      this.temp = Object.assign({}, data) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      fetchSubDept(this.temp.id).then(response => {
        this.options = response.data
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.updateTime = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateDept(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改部门成功',
              type: 'success',
              duration: 5000
            })
          })
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
    handleDelete(node, data){
      this.$confirm('是否删除选中部门', '删除部门', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.deleteDept(data.id)
        this.$message({
          type: 'success',
          message: '删除部门成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除部门/删除部门失败'
        })
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            <el-button size='mini' type='text' on-click={ () => this.handleUpdate(data) }>修改</el-button>
            <el-button size='mini' type='text' on-click={ () => this.handleDelete(node, data) }>删除</el-button>
          </span>
        </span>)
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
</style>
