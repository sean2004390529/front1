<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.empName" placeholder="搜索名字" style="width: 120px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" placeholder="搜索电话" style="width: 120px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.mobile" placeholder="搜索手机号" style="width: 120px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.title" placeholder="搜索职位" style="width: 100px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.manager" placeholder="项目负责人" clearable style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option key="1" value="1" label="是" />
        <el-option key="0" value="0" label="否" />
      </el-select>
      <el-select v-model="listQuery.member" placeholder="项目成员" clearable style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option key="1" value="1" label="是" />
        <el-option key="0" value="0" label="否" />
      </el-select>
      
      <el-button class="filter-item" type="info" icon="el-icon-search" @click="handleFilter"></el-button>
      <el-button class="filter-item" type="info" icon="el-icon-circle-close" @click="clearFilter">
        清除筛选
      </el-button>
      <br>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新所有员工
      </el-button>
      <el-button  class="filter-item" type="primary" icon="el-icon-folder" @click="handleSelectSubDeptEmp">
        按部门显示员工
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
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" sortable align="center" width="50px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工名" prop="empName" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.empName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="座机号" prop="phone" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱地址" prop="email" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" prop="title" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="deptId" sortable align="center" width="120px">
        <template slot-scope="{row}">
          <el-select v-model="row.deptId" disabled=true>
            <el-option
              v-for="item in deptOption"
              :key="item.value"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="禁用/启用" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status | formatStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-tag @click.stop="handleUpdate(row,$index)">修改</el-tag>
          <el-tag @click.stop="handleDelete(row,$index)" type="danger" >删除</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />


    <!-- 编辑框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="ID" prop="id" hidden>
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="员工名" prop="empName">
          <el-input v-model="temp.empName" placeholder="请输入员工名" />
        </el-form-item>
        <el-form-item label="座机号" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入座机号" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="temp.email" placeholder="请输入email地址" />
        </el-form-item>
        <el-form-item label="title" prop="title">
          <el-input v-model="temp.title" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="禁用/启用" prop="status">
          <el-select v-model="temp.status" placeholder="禁用/启用角色">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" placeholder="请选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目负责人" prop="manager">
          <el-select v-model="temp.manager" placeholder="请选择可否">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目组员" prop="member">
          <el-select v-model="temp.member" placeholder="请选择可否">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-select v-model="temp.deptId" placeholder="请选择部门"  >
            <el-option
              v-for="item in deptOption"
              :key="item.value"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button icon="el-icon-setting" @click="updateEmpDept">选择部门</el-button>
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

    <!-- 部门 抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      direction="ltr"
      :show-close="false"
      @open="handleOpen"
      >
      <div slot="title" >
        <el-alert title="请选择部门" type="success"></el-alert>
      </div>

      <!-- 部门树 -->
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
          <span >{{ node.label }}</span>
        </span>
      </el-tree>
    </el-drawer>
  </div>
</template>

<script>
import { fetchList, createEmp, updateEmp, deleteEmp, fetchsubDeptEmp } from '@/api/emp'
import { fetchList as fetchDeptList, fetchDeptFlat } from '@/api/dept'
import Pagination from '@/components/Pagination'

export default {
  name: 'Emp',
  components: { Pagination },
  filters: {
    formatStatus(value) {
      if (value === 1) {
        return '启用'
      } else {
        return '禁用'
      }
    }
  },
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      list: null,
      deptList: null,
      selectDeptMode: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        empName: undefined,
        phone: undefined,
        mobile: undefined,
        title: undefined,
        manager: undefined,
        member: undefined
      },
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      drawer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        id: undefined,
        empName: '',
        phone: undefined,
        mobile: undefined,
        title: undefined,
        email: undefined,
        status: 1,
        sex: 1,
        manager: 0,
        member: 0,
        deptId: undefined
      },
      rules: {
        empName: [{ required: true, message: '员工名称必填', trigger: 'blur' }]
      },
      deleteEmpList: [],
      multipleSelection: [],
      deptOption: []
    }
  },
  created() {
    this.getList()
    this.getDeptList()
    this.getDeptOptionList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getDeptList(){
      fetchDeptList().then(response => {
        console.log("fetchDeptList - resp", response)
        this.deptList = response.data
      })
    },
    getDeptOptionList(){
      fetchDeptFlat().then(response => {
        console.log("fetchDeptFlat - resp", response)
        this.deptOption = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        empName: '',
        phone: undefined,
        mobile: undefined,
        title: undefined,
        email: undefined,
        status: 1,
        sex: 1,
        manager: 0,
        member: 0,
        deptId: undefined
      }
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    clearFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        empName: undefined,
        phone: undefined,
        mobile: undefined,
        title: undefined,
        manager: undefined,
        member: undefined
      },
      this.getList()
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data)
    },
    updateEmpDept(){
      this.drawer = true
      this.selectDeptMode = false
    },
    handleSelectSubDeptEmp(){
      this.drawer = true
      this.selectDeptMode = true
    },
    handleNodeClick(data, node) {
      if(!this.selectDeptMode){
        this.temp.deptId = data.id
        this.drawer = false
      }
      if(this.selectDeptMode){
        fetchsubDeptEmp(data.id).then(response => {
          this.list = response.data
          this.drawer = false
        })
      }
    },
    handleCreate() {
      this.resetTemp()
      this.temp.status = this.temp.status.toString()
      this.temp.sex = this.temp.sex.toString()
      this.temp.manager = this.temp.manager.toString()
      this.temp.member = this.temp.member.toString()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createEmp(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建员工成功',
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
    handleUpdate(row, index) {
      row.status = row.status.toString()
      row.sex = row.sex.toString()
      row.manager = row.manager.toString()
      row.member = row.member.toString()
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
              message: '修改员工信息成功',
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
      this.$confirm('是否删除此员工', '删除员工', {
        confirmButtonText: '确定删除员工',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteEmp()
        this.$message({
          type: 'success',
          message: '删除员工成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除员工'
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
        this.$message('没有选中员工')
      } else {
        this.$confirm('是否删除选中员工', '批量删除员工', {
          confirmButtonText: '确定删除员工',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteEmp()
          this.$message({
            type: 'success',
            message: '批量删除员工成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除员工'
          })
        })
      }
    },
    handleOpen(){
      // this.getDeptList()
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
