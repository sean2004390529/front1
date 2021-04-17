<template>
  <div class="app-container">

    <!--功能栏 -->
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteEmp">
        批量删除
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" sortable align="center" width="90px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用途" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.purpose }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名称" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名字段" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.tableColumn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工名字" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.empName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-tag @click.stop="handleUpdate(row,$index)">修改</el-tag>
          <el-tag @click.stop="handleDelete(row,$index)" type="danger" >删除</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="ID" hidden>
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="perpose">
          <el-input v-model="temp.purpose" placeholder="请输入用途" />
        </el-form-item>
        <el-form-item label="表格名称" >
          <el-input v-model="temp.tableName" placeholder="请输入数据表名" />
        </el-form-item>
        <el-form-item label="表格字段" >
          <el-input v-model="temp.tableColumn" placeholder="请输入表格字段" />
        </el-form-item>
        <el-form-item label="选择员工" >
          <el-select v-model="temp.empName" clearable placeholder="请选择员工" value-key="item" @change="empChange">
            <el-option
              v-for="(item,idx) in empOptions"
              :key="idx"
              :label="item.empName"
              :value="item">
            </el-option>
          </el-select>
          <el-button icon="el-icon-user-solid" @click="handleSelectEmp">选择部门</el-button>
        </el-form-item>

        <el-form-item v-show="showEmp">
          <div v-if="!deptList">
            <el-button @click="fetchDeptList">刷新部门列表</el-button>
          </div>
          <div v-else>
            <el-col :span="10">
              <el-tree ref="tree"
              :data="deptList"
              node-key="id"
              :props="defaultProps"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </el-col>
            <el-col :span="10">
              <el-row >
                <el-tag class="margin" size="medium" @click="tagClick(tag.id, tag.empName)"
                  v-for="tag in empOptions"
                  :key="tag.id">
                  {{tag.empName}}
                </el-tag>
              </el-row>
            </el-col>
          </div>
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
import { fetchList, createEmp, updateEmp, deleteEmp } from '@/api/activiti/specialemp'
import { fetchList as fetchDeptList } from '@/api/dept'
import { fetchsubDeptEmp } from '@/api/emp'

export default {
  name: "SpecialEmp",
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        id: undefined,
        purpose: undefined,
        tableName: undefined,
        tableColumn: undefined,
        empId: undefined,
        empName: undefined
      },
      rules: {
        tableColumn: [{ required: true, message: '不能为空', trigger: 'blur' }],
        empId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        empName: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      deleteEmpList: [],
      multipleSelection: [],
      empOptions: [],
      showEmp: false,
      deptId: undefined,
      deptList: null,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
    }
  },
  created() {
    this.getList()
    this.fetchDeptList()
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
      this.temp  = {
        id: undefined,
        purpose: undefined,
        tableName: undefined,
        tableColumn: undefined,
        empId: undefined,
        empName: undefined
      }
    },
    fetchDeptList(){
      fetchDeptList().then(res =>{
        this.deptList = res.data
      })
    },
    handleSelectEmp(){
      this.showEmp = true
      this.fetchDeptList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    empChange(val){
      this.temp.empId = val.id
      this.temp.empName = val.empName
      this.showEmp = false
    },
    handleNodeClick(data) {
      this.deptId = data.id
      fetchsubDeptEmp(this.deptId).then(res =>{
        this.empOptions = res.data
      })
    },
    tagClick(empId, empName){
      this.temp.empId = empId
      this.temp.empName = empName
      this.showEmp = false
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createEmp(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '指定员工成功',
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
    handleCellClick(row){
      this.handleUpdate(row)
    },
    handleUpdate(row, index) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateEmp(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改指定员工成功',
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
    handleDelete(row, index) {
      this.deleteEmpList = []
      this.deleteEmpList.push(row.id)
      this.$confirm('是否删除此指定员工', '删除指定', {
        confirmButtonText: '确定删除指定员工',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteEmp()
        this.$message({
          type: 'success',
          message: '删除指定员工成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除指定员工'
        })
      })
    },
    deleteEmp() {
      deleteEmp(this.deleteEmpList).then(response => {
        this.deleteEmpList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteEmp() {
      this.deleteEmpList = []
      this.multipleSelection.forEach(item => {
        this.deleteEmpList.push(item.id)
      })
      if (this.deleteEmpList.length === 0) {
        this.$message('没有选中指定员工')
      } else {
        this.$confirm('是否删除选中指定员工', '批量删除指定员工', {
          confirmButtonText: '确定删除指定员工',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteEmp()
          this.$message({
            type: 'success',
            message: '批量删除指定员工成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除指定员工'
          })
        })
      }
    },
  }
}
</script>

<style>

</style>