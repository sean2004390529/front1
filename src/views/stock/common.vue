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
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteUnit">
        批量删除
      </el-button>
      <br>
      <el-input v-model="listQuery.value" placeholder="搜索单位" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      </el-table-column>valuevalue

      <el-table-column label="单位" prop="value" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.value }}</span>
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
        <el-form-item label="单位" prop="value">
          <el-input v-model="temp.value" />
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
import { fetchList, createUnit, updateUnit, deleteUnit } from '@/api/stock/common'
import Pagination from '@/components/Pagination'

export default {
  name: 'Common',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      options: null,
      unitList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        value: undefined
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
        value: undefined
      },
      rules: {
        value: [{ required: true, message: '单位不能为空', trigger: 'blur' }]
      },
      deleteUnitList: [],
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
    resetTemp() {
      this.temp = {
        id: undefined,
        value: undefined
      }
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    clearFilter() {
      this.listQuery.value = undefined
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUnit(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建单位成功',
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
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.updateTime = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUnit(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改单位成功',
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
    deleteUnit() {
      deleteUnit(this.deleteUnitList).then(response => {
        this.deleteUnitList = []
        this.getList()
      })
    },
    handleDelete(row, index) {
      this.deleteUnitList = []
      this.deleteUnitList.push(row.id)
      this.$confirm('是否删除此单位', '删除单位', {
        confirmButtonText: '确定删除单位',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUnit()
        this.$message({
          type: 'success',
          message: '删除单位成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除单位/删除单位失败'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteUnit() {
      this.deleteUnitList = []
      this.multipleSelection.forEach(item => {
        this.deleteUnitList.push(item.id)
      })
      if (this.deleteUnitList.length === 0) {
        this.$message('没有选中单位')
      } else {
        this.$confirm('是否删除选中单位', '批量删除单位', {
          confirmButtonText: '确定删除单位',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteUnit()
          this.$message({
            type: 'success',
            message: '批量删除单位成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除单位/删除单位失败'
          })
        })
      }
    }
  }
}
</script>

<style>

</style>
