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
      <el-select v-model="listQuery.personId" placeholder="筛选借用人" clearable style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in options" :key="item.id" :label="item.staffname" :value="item.id" />
      </el-select>
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

      <el-table-column label="使用人" prop="personId" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.personId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="使用目的" prop="purpose" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.purpose }}</span>
        </template>
      </el-table-column>

      <el-table-column label="派发日期" prop="dispenseDate" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.dispenseDate | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="借用数量" prop="number" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.number }}</span>
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
        <el-form-item label="正在使用人" prop="personId">
          <el-select v-model="temp.personId" placeholder="请选择使用人">
            <el-option v-for="item in options" :key="item.id" :label="item.staffname" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="使用目的" prop="purpose">
          <el-input v-model="temp.purpose" />
        </el-form-item>

        <el-form-item label="派发日期" prop="dispenseDate">
          <el-date-picker
            v-model="temp.dispenseDate"
            placeholder="派发日期"
            type="date"
            :picker-options="pickerOptions"
          />
        </el-form-item>

        <el-form-item label="数量" prop="number">
          <el-input-number v-model="temp.number" :min="0" controls-position="right" />
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
import { fetchList, createDispense, updateDispense, deleteDispense, fetchAllStaff } from '@/api/dispense'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Dispense',
  components: { Pagination },
  filters: {
    formatDate(time) {
      return formatDate(time)
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      list: null,
      options: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        goodsname: undefined,
        purpose: undefined,
        personId: undefined
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
        purpose: undefined,
        personId: undefined,
        dispenseDate: undefined
      },
      rules: {
        goodsname: [{ required: true, message: '物品名称不能为空', trigger: 'blur' }],
        personId: [{ required: true, message: '借用人不能为空', trigger: 'blur' }]
      },
      deleteDispenseList: [],
      multipleSelection: [],
      // reuseOptions: ['可复用', '一次性用品'],
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
    this.fetchAllStaff()
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
    resetTemp() {
      this.temp = {
        id: undefined,
        goodsname: undefined,
        number: undefined,
        purpose: undefined,
        personId: undefined,
        dispenseDate: undefined
      }
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    clearFilter() {
      this.listQuery.goodsname = undefined
      this.listQuery.personId = undefined
      this.getList()
    },
    fetchAllStaff() {
      fetchAllStaff().then(response => {
        this.options = response.data
      })
    },
    handleCreate() {
      this.resetTemp()
      this.fetchAllStaff()
      this.temp.dispenseDate = +new Date()
      this.temp.reuse = 0
      this.temp.number = 1
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDispense(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建借用记录成功',
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
      this.fetchAllStaff()
      this.temp.personId = row.personId.toString()
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
          updateDispense(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改借用记录成功',
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
      this.deleteDispenseList = []
      this.deleteDispenseList.push(row.id)
      this.$confirm('是否删除此借用记录', '删除借用记录', {
        confirmButtonText: '确定删除借用记录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDispense()
        this.$message({
          type: 'success',
          message: '删除借用记录成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除借用记录/删除借用记录失败'
        })
      })
    },
    deleteDispense() {
      deleteDispense(this.deleteDispenseList).then(response => {
        this.deleteDispenseList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDelete() {
      this.deleteDispenseList = []
      this.multipleSelection.forEach(item => {
        this.deleteDispenseList.push(item.id)
      })
      if (this.deleteDispenseList.length === 0) {
        this.$message('没有选中借用记录')
      } else {
        this.$confirm('是否删除选中借用记录', '批量删除借用记录', {
          confirmButtonText: '确定删除借用记录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteDispense()
          this.$message({
            type: 'success',
            message: '批量删除借用记录成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除借用记录/删除借用记录失败'
          })
        })
      }
    },
    showUnreturn() {
      this.listLoading = true
      fetchUnreturn().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

<style>

</style>
