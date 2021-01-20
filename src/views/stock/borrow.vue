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
      <el-button class="filter-item" type="warning" icon="el-icon-warning-outline" @click="showUnreturn">
        显示所有未归还
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

      <el-table-column label="正在使用人" prop="personId" sortable align="center">
        <template slot-scope="{row}">
          <el-select v-model="row.personId" disabled placeholder="请选择使用人">
            <el-option v-for="item in options" :key="item.id" :label="item.staffname" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="开始借用" prop="borrowDate" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.borrowDate | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="预计归还日期" prop="expectReturn" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.expectReturn | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实际归还日期" prop="actualReturn" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.actualReturn | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="借用数量" prop="number" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="unit" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.unit }}</span>
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
          <el-autocomplete
            v-model="temp.goodsname"
            popper-class="my-autocomplete"
            :fetch-suggestions="queryReuseListAsync"
            placeholder="请输入物品名称"
            @select="handleSelect"
          >
            <i slot="suffix" class="el-icon-edit el-input__icon" />
            <template slot-scope="{ item }">
              <span class="name">{{ item.value = item.goodsname }} - {{ item.number }} {{ item.unit }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="正在使用人" prop="personId">
          <el-select v-model="temp.personId" placeholder="请选择使用人">
            <el-option v-for="item in options" :key="item.id" :label="item.staffname" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="借用目的" prop="purpose">
          <el-input v-model="temp.purpose" />
        </el-form-item>

        <el-form-item label="开始借用日期" prop="borrowDate">
          <el-date-picker
            v-model="temp.borrowDate"
            placeholder="开始借用日期"
            type="date"
            :picker-options="pickerOptions"
          />
        </el-form-item>

        <el-form-item label="预计归还日期" prop="expectReturn">
          <el-date-picker
            v-model="temp.expectReturn"
            placeholder="预计归还日期"
            type="date"
            :picker-options="pickerReturn"
          />
        </el-form-item>

        <el-form-item label="实际归还日期" prop="actualReturn">
          <el-date-picker
            v-model="temp.actualReturn"
            placeholder="实际归还日期"
            type="date"
            :picker-options="pickerReturn"
          />
        </el-form-item>

        <el-form-item label="数量" prop="number">
          <el-input-number v-model="temp.number" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-autocomplete
            v-model="temp.unit"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入单位"
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
import { fetchList, createBorrow, updateBorrow, deleteBorrow, fetchAllStaff, fetchUnreturn } from '@/api/stock/borrow'
import { fetchUnit } from '@/api/stock/common'
import { fetchReuse } from '@/api/stock/reuse'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Borrow',
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
      unitList: [],
      instockReuseList: [],
      options: null,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        goodsname: undefined,
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
        borrowDate: undefined,
        expectReturn: undefined,
        actualReturn: undefined,
        unit: undefined
      },
      rules: {
        goodsname: [{ required: true, message: '物品名称不能为空', trigger: 'change' }],
        personId: [{ required: true, message: '借用人不能为空', trigger: 'blur' }]
      },
      deleteBorrowList: [],
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
      },
      pickerReturn: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '两周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7 * 2)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created() {
    this.fetchAllStaff()
    this.getList()
    this.fetchUnit()
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
        goodsname: undefined,
        number: undefined,
        purpose: undefined,
        personId: undefined,
        borrowDate: undefined,
        expectReturn: undefined,
        actualReturn: undefined,
        unit: undefined
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
      this.fetchReuse()
      this.temp.borrowDate = +new Date()
      this.temp.isBorrow = 1
      this.temp.reuse = 1
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
          createBorrow(this.temp).then(() => {
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
      this.fetchReuse()
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
          updateBorrow(tempData).then(() => {
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
      this.deleteBorrowList = []
      this.deleteBorrowList.push(row.id)
      this.$confirm('是否删除此借用记录', '删除借用记录', {
        confirmButtonText: '确定删除借用记录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteBorrow()
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
    deleteBorrow() {
      deleteBorrow(this.deleteBorrowList).then(response => {
        this.deleteBorrowList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDelete() {
      this.deleteBorrowList = []
      this.multipleSelection.forEach(item => {
        this.deleteBorrowList.push(item.id)
      })
      if (this.deleteBorrowList.length === 0) {
        this.$message('没有选中借用记录')
      } else {
        this.$confirm('是否删除选中借用记录', '批量删除借用记录', {
          confirmButtonText: '确定删除借用记录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteBorrow()
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
    },
    querySearchAsync(queryString, cb) {
      const unitList = this.unitList
      const results = queryString ? unitList.filter(this.createStateFilter(queryString)) : unitList
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 100)
    },
    queryReuseListAsync(queryString, cb) {
      const instockReuseList = this.instockReuseList
      const results = queryString ? instockReuseList.filter(this.createStateFilter(queryString)) : instockReuseList
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 100)
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      this.temp.goodsname = item.value
      this.temp.unit = item.unit
    },
    fetchUnit() {
      fetchUnit().then(response => {
        this.unitList = response.data
      })
    },
    fetchReuse() {
      fetchReuse().then(response => {
        this.instockReuseList = response.data
      })
    }
  }
}
</script>

<style lang="scss">
.my-autocomplete {
  li {
    line-height: small;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
