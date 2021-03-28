<template>
  <div class="app-container">

    <!-- 功能栏 -->
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteCorp">
        批量删除
      </el-button>
      <br>
      <el-input v-model="listQuery.name" placeholder="搜索公司名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.enname" placeholder="搜索英文名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.companyAddress" placeholder="搜索地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="info" icon="el-icon-search" @click="handleFilter"></el-button>
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
      <el-table-column label="公司名" prop="name" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文名" prop="enname" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.enname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司地址" prop="companyAddress" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.companyAddress }}</span>
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
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 编辑框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="code" prop="code" hidden>
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="公司名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入公司名" />
        </el-form-item>
        <el-form-item label="英文名" prop="enname">
          <el-input v-model="temp.enname" placeholder="请输入公司英文名" />
        </el-form-item>
        <el-form-item label="公司地址" prop="companyAddress">
          <el-input v-model="temp.companyAddress" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="禁用/启用" prop="status">
          <el-select v-model="temp.status" placeholder="请选择禁用或启用">
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

  </div>
</template>

<script>
import { fetchList, createCorp, updateCorp, deleteCorp } from '@/api/corp'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Corp',
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
        enname: undefined,
        companyAddress: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        code: undefined,
        name: undefined,
        enname: undefined,
        status: 1,
        companyAddress: undefined,
        createTime: new Date()
      },
      rules: {
        name: [{ required: true, message: '公司名字必填', trigger: 'blur' }]
      },
      deleteCorpList: [],
      multipleSelection: [],
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
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    clearFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        name: undefined,
        enname: undefined,
        companyAddress: undefined
      },
      this.getList()
    },
    resetTemp() {
      this.temp = {
        code: undefined,
        name: undefined,
        enname: undefined,
        status: 1,
        companyAddress: undefined,
        createTime: new Date()
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
          createCorp(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建公司成功',
              type: 'success',
              duration: 5000
            })
            this.getList()
          })
        }
      })
    },
    handleCellClick(row){
      this.handleUpdate(row)
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.updateTime = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateCorp(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改公司成功',
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
    cancel(){
      this.dialogFormVisible = false
      this.getList()
    },
    handleDelete(row, index) {
      this.deleteCorpList = []
      this.deleteCorpList.push(row.code)
      this.$confirm('是否删除此公司', '删除公司', {
        confirmButtonText: '确定删除公司',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCorp()
        this.$message({
          type: 'success',
          message: '删除公司成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除公司'
        })
      })
    },
    deleteCorp() {
      deleteCorp(this.deleteCorpList).then(response => {
        this.deleteCorpList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteCorp() {
      this.deleteCorpList = []
      this.multipleSelection.forEach(item => {
        this.deleteCorpList.push(item.code)
      })
      if (this.deleteCorpList.length === 0) {
        this.$message('没有选中公司')
      } else {
        this.$confirm('是否删除选中公司', '批量删除公司', {
          confirmButtonText: '确定删除公司',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCorp()
          this.$message({
            type: 'success',
            message: '批量删除公司成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除公司'
          })
        })
      }
    },
  }
}
</script>

<style>

</style>