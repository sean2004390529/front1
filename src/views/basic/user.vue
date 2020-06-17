<template>
  <div class="app-container">
    <!--查询栏 -->
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteUser">
        批量删除
      </el-button>
      <el-input v-model="listQuery.username" placeholder="搜索用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.email" placeholder="搜索邮箱" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" placeholder="搜索电话" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="info" icon="el-icon-search" @click="handleFilter">
        Search
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

      <el-table-column label="序号" sortable align="center" width="90px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" prop="username" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="email" prop="email" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话号码" prop="phone" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="禁用/启用" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status | formatStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row,$index)">
            修改
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete-solid" @click="handleDelete(row,$index)">
            删除
          </el-button>
          <el-button type="success" size="mini" icon="el-icon-unlock" @click="getRole(row,$index)">
            分配角色
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 编辑框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-form-item label="ID" prop="id" hidden disabled>
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item v-if="showPwd" label="密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="phone" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="禁用/启用" prop="status">
          <el-select v-model="temp.status" placeholder="请选择禁用或启用角色">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
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

    <!-- 分配角色框 -->
    <el-dialog title="分配角色" :visible.sync="RoleFormVisible">
      <el-form :model="tempRole" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-form-item label="ID" prop="userId">
          <el-input v-model="tempRole.userId" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="tempRole.username" disabled />
        </el-form-item>

        <el-form-item label="分配角色">
          <div class="editor-container">
            <dnd-list :list1="tempRole.selectedRoles" :list2="tempRole.allRoles" list1-title="已分配角色" list2-title="可分配角色" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="RoleFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateRole()">
          分配角色
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createUser, updateUser, fetchRoles, updateRoles, deleteUsers } from '@/api/user'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'
import DndList from '@/components/DndList'

export default {
  name: 'User',
  components: { Pagination, DndList },
  filters: {
    formatDate(time) {
      return formatDate(time)
    },
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
      tableKey: 0,
      listLoading: true,
      list: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        email: undefined,
        phone: undefined
      },
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      showPwd: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        id: undefined,
        username: '',
        email: '',
        phone: '',
        status: undefined
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      RoleFormVisible: false,
      tempRole: {
        userId: undefined,
        username: '',
        selectedRoles: [],
        allRoles: []
      },
      deleteUserList: [],
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.totalRows
        this.listLoading = false
      })
    },
    handleUpdate(row, index) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.showPwd = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        userId: undefined,
        username: '',
        email: '',
        phone: '',
        status: 1
      }
    },
    resetTempRole() {
      this.tempRole = {
        userId: undefined,
        username: '',
        selectedRoles: [],
        allRoles: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.showPwd = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建角色成功',
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.updateTime = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改角色成功',
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
    getRole(row, index) {
      this.resetTempRole()
      this.RoleFormVisible = true
      this.tempRole.userId = row.id
      this.tempRole.username = row.username
      fetchRoles(row.id).then(response => {
        this.tempRole.allRoles = response.data.allRoles
        this.tempRole.selectedRoles = response.data.selectedRoles
      })
    },
    updateRole() {
      const tempData = Object.assign({}, this.tempRole)
      updateRoles(tempData).then(response => {
        this.RoleFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改角色成功',
          type: 'success',
          duration: 5000
        })
      })
    },
    handleDelete(row, index) {
      this.deleteUserList = []
      this.deleteUserList.push(row.id)
      this.$confirm('是否删除此用户', '删除用户', {
        confirmButtonText: '确定删除用户',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUser()
        this.$message({
          type: 'success',
          message: '删除用户成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除用户'
        })
      })
    },
    deleteUser() {
      deleteUsers(this.deleteUserList).then(response => {
        this.deleteUserList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteUser() {
      this.deleteUserList = []
      this.multipleSelection.forEach(item => {
        this.deleteUserList.push(item.id)
      })
      if (this.deleteUserList.length === 0) {
        this.$message('没有选中用户')
      } else {
        this.$confirm('是否删除选中用户', '批量删除用户', {
          confirmButtonText: '确定删除用户',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteUser()
          this.$message({
            type: 'success',
            message: '批量删除用户成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除用户'
          })
        })
      }
    }
  }
}
</script>

<style >

</style>
