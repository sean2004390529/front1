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
      </el-button><br>

      <el-input v-model="listQuery.username" placeholder="搜索用户名" style="width: 200px;" class="filter-item" 
        @keyup.enter.native="handleFilter" clearable @clear="getList()" />
      <el-input v-model="listQuery.email" placeholder="搜索邮箱" style="width: 200px;" class="filter-item" 
        @keyup.enter.native="handleFilter" clearable @clear="getList()" />
      <el-input v-model="listQuery.phone" placeholder="搜索电话" style="width: 200px;" class="filter-item" 
        @keyup.enter.native="handleFilter" clearable @clear="getList()" />
      <el-button class="filter-item" type="info" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" type="info" icon="el-icon-circle-close" @click="clearFilter">
        清除筛选
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

      <el-table-column label="用户名" prop="username" sortable align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="email" prop="email" sortable align="center" width="250px">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话号码" prop="phone" sortable align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="禁用/启用" width="100px" align="center">
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
          <el-tag @click.stop="handleUpdate(row,$index)">修改</el-tag>
          <el-tag @click.stop="handleDelete(row,$index)" type="danger" >删除</el-tag>
          <el-tag @click.stop="getRole(row,$index)" type="success" >分配角色</el-tag>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 编辑框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
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
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!-- 分配角色框 -->
    <el-dialog title="分配角色" :visible.sync="RoleFormVisible" fullscreen=true>
      <el-form :model="tempUser" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-form-item label="ID" prop="userId" hidden>
          <el-input v-model="tempUser.userId" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="tempUser.username" disabled />
        </el-form-item>

        <el-form-item label="分配角色">
          <el-transfer 
            v-model="selectedRole" 
            :data="allRoleList"
            :titles="['可选角色','已分配角色']"
            @change="handleRoleChange"
          >
            <span slot-scope="{ option }">
            {{ option.label }} - {{option.description}}
            </span>
          </el-transfer>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="RoleFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateYourRole()">
          分配角色
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createUser, updateUser,  deleteUsers } from '@/api/user'
import { fetchAllRole, fetchYourRole, updateYourRole } from '@/api/role'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'User',
  components: { Pagination },
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
        status: 1
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      deleteUserList: [],
      multipleSelection: [],
      RoleFormVisible: false,
      tempUser: {
        userId: undefined,
        username: ''
      },
      allRoleList: [],
      selectedRole: []
    }
  },
  created() {
    this.getList()
    this.fetchAllRole()
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
    resetTemp() {
      this.temp = {
        userId: undefined,
        username: '',
        email: '',
        phone: '',
        status: 1
      }
    },
    handleCellClick(row){
      this.handleUpdate(row)
    },
    resettempUser() {
      this.tempUser = {
        userId: undefined,
        username: '',
      }
    },
    clearFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        email: undefined,
        phone: undefined
      },
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.temp.status = this.temp.status.toString()
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
    handleUpdate(row, index) {
      row.status = row.status.toString()
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.showPwd = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
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
    fetchAllRole(){
      fetchAllRole().then(req =>{
        const allRoleData = req.data
        const data = []
        for(let i=0; i< allRoleData.length; i++){
          data.push({
            key: allRoleData[i].id,
            label: allRoleData[i].name,
            description: allRoleData[i].description
          })
        }
        this.allRoleList = data;
      })
    },
    getRole(row, index) {
      this.resettempUser()
      this.selectedRole = []
      this.tempUser.userId = row.id
      this.tempUser.username = row.username
      fetchYourRole(row.id).then(res => {
        if(res.data!=null){
          this.selectedRole = res.data
        }
        this.RoleFormVisible = true
      })
    },
    handleRoleChange(){
      // console.log(this.selectedRole)
    },
    updateYourRole() {
      const userId = this.tempUser.userId
      const roleId = this.selectedRole
      updateYourRole({userId, roleId }).then(response => {
        this.$notify({
          title: '成功',
          message: '分配角色成功',
          type: 'success',
          duration: 5000
        })
        this.RoleFormVisible = false
        this.selectedRole = []
      }).catch( ()=>{
        this.$message({
          type: 'info',
          message: '分配角色失败',
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
    },
    cancel(){
      this.dialogFormVisible = false
      this.getList()
    }
  }
}
</script>

<style>

</style>
