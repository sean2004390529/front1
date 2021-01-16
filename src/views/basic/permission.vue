<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeletePermission">
        批量删除
      </el-button>
      <el-input v-model="listQuery.name" placeholder="搜索权限名" style="width: 80px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.remark" placeholder="搜索描述" style="width: 80px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.url" placeholder="搜索url" style="width: 80px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="序号" sortable align="center" width="50px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限名" prop="name" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="remark" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="url" prop="url" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="禁用/启用" align="center" width="50px" >
        <template slot-scope="{row}">
          <span>{{ row.status | formatStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="ID" prop="id" hidden>
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="权限名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入权限名" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="temp.remark" placeholder="请输入描述信息" />
        </el-form-item>
        <el-form-item label="url" prop="url">
          <el-input v-model="temp.url" placeholder="请输入url信息" />
        </el-form-item>
        <el-form-item label="禁用/启用" prop="status">
          <el-select v-model="temp.status" placeholder="请选择禁用或启用权限">
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
  </div>
</template>

<script>
import { fetchList, createPermission, updatePermission, deletePermission } from '@/api/permission'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Permissions',
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
        pageSize: 10,
        name: undefined,
        remark: undefined,
        url: undefined
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
        remark: '',
        url: '',
        status: 1,
        createTime: new Date()
      },
      rules: {
        name: [{ required: true, message: '权限名字必填', trigger: 'blur' }]
      },
      deletePermissionList: [],
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
        remark: '',
        url: '',
        status: 1
      }
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
          createPermission(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建权限成功',
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
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.updateTime = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updatePermission(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改权限成功',
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
      this.deletePermissionList = []
      this.deletePermissionList.push(row.id)
      this.$confirm('是否删除此权限', '删除权限', {
        confirmButtonText: '确定删除权限',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePermission()
        this.$message({
          type: 'success',
          message: '删除权限成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除权限'
        })
      })
    },
    deletePermission() {
      deletePermission(this.deletePermissionList).then(response => {
        this.deletePermissionList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeletePermission() {
      this.deletePermissionList = []
      this.multipleSelection.forEach(item => {
        this.deletePermissionList.push(item.id)
      })
      if (this.deletePermissionList.length === 0) {
        this.$message('没有选中权限')
      } else {
        this.$confirm('是否删除选中权限', '批量删除权限', {
          confirmButtonText: '确定删除权限',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletePermission()
          this.$message({
            type: 'success',
            message: '批量删除权限成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除权限'
          })
        })
      }
    }
  }
}
</script>

<style>

</style>
