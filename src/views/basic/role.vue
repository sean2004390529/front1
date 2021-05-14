<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteRole">
        批量删除
      </el-button>
      <el-input v-model="listQuery.name" placeholder="搜索角色名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.description" placeholder="搜索描述" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      @cell-click="handleCellClick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" sortable align="center" width="90px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名" prop="name" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="禁用/启用" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status | formatStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-tag @click.stop="handleUpdate(row,$index)">修改</el-tag>
          <el-tag @click.stop="handleDelete(row,$index)" type="danger" >删除</el-tag>
          <el-tag @click.stop="getPermission(row,$index)" type="success" >分配权限</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 编辑框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="ID" prop="id" hidden>
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" placeholder="请输入描述信息" />
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

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="PermissionFormVisible" fullscreen=true>
      <el-form :model="tempRole" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-form-item label="ID" prop="roleId" >
          <el-input v-model="tempRole.roleId" disabled />
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="tempRole.name" disabled />
        </el-form-item>

        <el-form-item label="分配角色">
          <el-transfer 
            v-model="selectedPermission" 
            :data="allPermissionList"
            :titles="['可选权限','已分配权限']"
            @change="handlePermissionChange"
          >
            <span slot-scope="{ option }">
              {{ option.label }}
            </span>
          </el-transfer>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="PermissionFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateYourPermission()">
          分配角色
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createRole, updateRole, deleteRoles } from '@/api/role'
import { fetchAllPermission, fetchYourPermission, updateYourPermission } from '@/api/permission'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Role',
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
      total: 0,
      listLoading: true,
      list: null,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        name: undefined,
        description: undefined
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
        description: '',
        status: 1,
        createTime: new Date()
      },
      rules: {
        name: [{ required: true, message: '角色名字必填', trigger: 'blur' }]
      },
      deleteRoleList: [],
      multipleSelection: [],
      PermissionFormVisible: false,
      tempRole: {
        roleId: undefined,
        name: ''
      },
      allPermissionList: [],
      selectedPermission: []
    }
  },
  created() {
    this.getList()
    this.fetchAllPermission()
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
    handleUpdate(row, index) {
      row.status = row.status.toString()
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        description: '',
        status: 1
      }
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.temp.status = this.temp.status.toString()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.temp).then(() => {
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
    handleCellClick(row){
      this.handleUpdate(row)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.updateTime = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateRole(tempData).then(() => {
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
    handleDelete(row, index) {
      this.deleteRoleList = []
      this.deleteRoleList.push(row.id)
      this.$confirm('是否删除此角色', '删除角色', {
        confirmButtonText: '确定删除角色',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRole()
        this.$message({
          type: 'success',
          message: '删除角色成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除角色'
        })
      })
    },
    deleteRole() {
      deleteRoles(this.deleteRoleList).then(response => {
        this.deleteRoleList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteRole() {
      this.deleteRoleList = []
      this.multipleSelection.forEach(item => {
        this.deleteRoleList.push(item.id)
      })
      if (this.deleteRoleList.length === 0) {
        this.$message('没有选中角色')
      } else {
        this.$confirm('是否删除选中角色', '批量删除角色', {
          confirmButtonText: '确定删除角色',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRole()
          this.$message({
            type: 'success',
            message: '批量删除角色成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除角色'
          })
        })
      }
    },
    resettempRole() {
      this.tempRole = {
        roleId: undefined,
        name: ''
      }
    },
    fetchAllPermission(){
      fetchAllPermission().then(req =>{
        const allPermissionData = req.data
        const data = []
        for(let i=0; i< allPermissionData.length; i++){
          data.push({
            key: allPermissionData[i].id,
            label: allPermissionData[i].name
          })
        }
        this.allPermissionList = data;
      })
    },
    getPermission(row, index) {
      this.resettempRole()
      this.selectedPermission = []
      this.tempRole.roleId = row.id
      this.tempRole.name = row.name
      fetchYourPermission(row.id).then(res => {
        if(res.data!=null){
          this.selectedPermission = res.data
        }
        this.PermissionFormVisible = true
      })
      
    },
    handlePermissionChange(){
      console.log("selectedPermission",this.selectedPermission)
    },
    updateYourPermission() {
      const roleId = this.tempRole.roleId
      const permissionId = this.selectedPermission
      updateYourPermission({roleId, permissionId }).then(response => {
        this.$notify({
          title: '成功',
          message: '分配权限成功',
          type: 'success',
          duration: 5000
        })
        this.PermissionFormVisible = false
        this.selectedPermission = []
      }).catch( ()=>{
        this.$message({
          type: 'info',
          message: '分配权限失败',
          duration: 5000
        })
      })
    },
    cancel(){
      this.dialogFormVisible = false
      this.getList()
    }
  }
}
</script>

<style >

</style>

