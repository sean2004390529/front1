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
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDelete">
        批量删除
      </el-button>
      <br>
      <el-input v-model="listQuery.goodsname" placeholder="搜索物品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
    >

      <el-table-column type="selection" width="55" />

      <el-table-column label="序号" sortable align="center" width="90px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="物品名称" prop="goodsname" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.goodsname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="数量" prop="number" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="unit" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买日期" prop="createTime" sortable align="center">
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
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 编辑框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="ID" prop="id" hidden>
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="物品名称" prop="goodsname">
          <el-input v-model="temp.goodsname" />
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input-number v-model="temp.number" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-autocomplete
            v-model="temp.unit"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入单位"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="购买日期" prop="createTime">
          <el-date-picker
            v-model="temp.createTime"
            placeholder="请选择购买日期"
            type="date"
            :picker-options="pickerOptions"
          />
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
import { fetchList, createDisposable, updateDisposable, deleteDisposable } from '@/api/disposable'
import { fetchUnit } from '@/api/common'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Disposable',
  components: { Pagination },
  filters: {
    formatDate(time) {
      return formatDate(time)
    }
  },
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
        goodsname: undefined
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
        goodsname: undefined,
        number: undefined,
        createTime: undefined,
        unit: undefined
      },
      rules: {
        goodsname: [{ required: true, message: '物品名称不能为空', trigger: 'blur' }]
      },
      deleteDisposableList: [],
      multipleSelection: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created() {
    this.getList()
    this.fetchUnit()
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
    resetTemp() {
      this.temp = {
        id: undefined,
        goodsname: undefined,
        number: undefined,
        createTime: undefined,
        unit: undefined
      }
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    clearFilter() {
      this.listQuery.goodsname = undefined
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.temp.createTime = +new Date()
      this.temp.reuse = 0
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDisposable(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建一次性用品成功',
              type: 'success',
              duration: 5000
            })
            setTimeout(() => {
              this.getList()
            }, 500)
          })
        }
      })
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
          updateDisposable(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改使用品成功',
              type: 'success',
              duration: 5000
            })
            setTimeout(() => {
              this.getList()
            }, 500)
          })
        }
      })
    },
    handleDelete(row, index) {
      this.deleteDisposableList = []
      this.deleteDisposableList.push(row.id)
      this.$confirm('是否删除此使用品', '删除使用品', {
        confirmButtonText: '确定删除使用品',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDisposable()
        this.$message({
          type: 'success',
          message: '删除使用品成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除使用品/删除使用品失败'
        })
      })
    },
    deleteDisposable() {
      deleteDisposable(this.deleteDisposableList).then(response => {
        this.deleteDisposableList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDelete() {
      this.deleteDisposableList = []
      this.multipleSelection.forEach(item => {
        this.deleteDisposableList.push(item.id)
      })
      if (this.deleteDisposableList.length === 0) {
        this.$message('没有选中一次性用品')
      } else {
        this.$confirm('是否删除选中一次性用品', '批量删除一次性用品', {
          confirmButtonText: '确定删除一次性用品',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteDisposable()
          this.$message({
            type: 'success',
            message: '批量删除一次性用品成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除一次性用品/删除一次性用品失败'
          })
        })
      }
    },
    querySearchAsync(queryString, cb) {
      const unitList = this.unitList
      const results = queryString ? unitList.filter(this.createStateFilter(queryString)) : unitList
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 100)
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.indexOf(queryString) === 0)
      }
    },
    handleSelect(item) {
    },
    fetchUnit() {
      fetchUnit().then(response => {
        this.unitList = response.data
      })
    }
  }
}
</script>

<style>

</style>
