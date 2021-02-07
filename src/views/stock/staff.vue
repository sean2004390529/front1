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
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteStaff">
        批量删除
      </el-button>
      <br>
      <el-input v-model="listQuery.staffname" placeholder="搜索员工名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.email" placeholder="搜索邮箱" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" placeholder="搜索电话" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="info" icon="el-icon-search" @click="handleFilter">
        搜索
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
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" sortable align="center" width="90px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="员工名" prop="staffname" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.staffname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话号码" prop="phone" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="email" prop="email" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="部门" prop="email" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.deptId | deptFilter }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row,$index)">
            修改
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete-solid" @click="handleDelete(row,$index)">
            删除
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
        <el-form-item label="员工名" prop="staffname">
          <el-input v-model="temp.staffname" />
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="phone" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <!-- <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="temp.deptId" placeholder="请选择所属部门">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item> -->
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
import { fetchList, createStaff, updateStaff, deleteStaff, fetchAllDept } from '@/api/stock/staff'
import Pagination from '@/components/Pagination'

export default {
  name: 'Staff',
  components: { Pagination },
  // filters: {
  //   deptFilter(deptId) {
  //     console.log(deptList)
  //     const deptMap = this.deptList
  //     return deptMap[deptId]
  //   }
  // },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      options: null,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        staffname: undefined,
        email: undefined,
        phone: undefined,
        deptId: undefined
      },
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        id: undefined,
        staffname: undefined,
        email: undefined,
        phone: undefined,
        deptId: undefined
      },
      rules: {
        staffname: [{ required: true, message: '员工名不能为空', trigger: 'blur' }]
      },
      deleteStaffList: [],
      multipleSelection: []
      // deptList: {}
    }
  },
  created() {
    // fetchAllDept().then(response => {
    //   this.options = response.data
    //   this.options.forEach(item => {
    //     this.deptList[item.id] = item.name
    //   })
    // })
    this.getList()
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
        id: undefined,
        staffname: '',
        email: '',
        phone: ''
      }
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    clearFilter() {
      this.listQuery.staffname = undefined
      this.listQuery.email = undefined
      this.listQuery.phone = undefined
      this.getList()
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createStaff(this.temp).then(() => {
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
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      fetchAllDept().then(response => {
        this.options = response.data
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.updateTime = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateStaff(tempData).then(() => {
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
    deleteStaff() {
      deleteStaff(this.deleteStaffList).then(response => {
        this.deleteUserList = []
        this.getList()
      })
    },
    handleDelete(row, index) {
      this.deleteStaffList = []
      this.deleteStaffList.push(row.id)
      this.$confirm('是否删除此员工', '删除员工', {
        confirmButtonText: '确定删除员工',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteStaff()
        this.$message({
          type: 'success',
          message: '删除员工成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除员工/删除员工失败'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteStaff() {
      this.deleteStaffList = []
      this.multipleSelection.forEach(item => {
        this.deleteStaffList.push(item.id)
      })
      if (this.deleteStaffList.length === 0) {
        this.$message('没有选中员工')
      } else {
        this.$confirm('是否删除选中员工', '批量删除员工', {
          confirmButtonText: '确定删除员工',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteStaff()
          this.$message({
            type: 'success',
            message: '批量删除员工成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除员工/删除员工失败'
          })
        })
      }
    }
  }
}
</script>

<style>

</style>
