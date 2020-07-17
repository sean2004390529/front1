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
      <el-input v-model="listQuery.purpose" placeholder="搜索购买目的" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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

      <el-table-column label="总金额(元)" prop="amount" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="购买目的" prop="purpose" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.purpose }}</span>
        </template>
      </el-table-column>

      <el-table-column label="购买日期" prop="createTime" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="可否复用" sortable class-name="status-col" width="180">
        <template slot-scope="{row}">
          <el-tag effect="dark" :type="row.reuse | typeFilter">
            {{ row.reuse | reuseFilter }}
          </el-tag>
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
        <el-form-item label="总金额(元)" prop="amount">
          <el-input-number v-model="temp.amount" controls-position="right" />
        </el-form-item>
        <el-form-item label="购买目的" prop="purpose">
          <el-input v-model="temp.purpose" />
        </el-form-item>
        <el-form-item label="购买日期" prop="createTime">
          <el-date-picker
            v-model="temp.createTime"
            placeholder="请选择购买日期"
            type="date"
            :picker-options="pickerOptions"
          />
        </el-form-item>

        <el-form-item label="可否复用">
          <el-select v-model="temp.reuse" class="filter-item" placeholder="请选择状态">
            <el-option key="1" value="1" label="可复用" />
            <el-option key="0" value="0" label="一次性用品" />
          </el-select>
        </el-form-item>

        <el-form-item label="保存到物品列表">
          <el-switch v-model="temp.save" active-color="#13ce66" inactive-color="#ff4949" />
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
import { fetchList, createPurchase, updatePurchase, deletePurchase } from '@/api/purchase'
import { fetchUnit } from '@/api/common'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Purchase',
  components: { Pagination },
  filters: {
    formatDate(time) {
      return formatDate(time)
    },
    typeFilter(status) {
      const typeMap = ['info', 'success']
      return typeMap[status]
    },
    reuseFilter(status) {
      const reuseMap = ['一次性用品', '可复用']
      return reuseMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      options: null,
      unitList: [],
      timeout: null,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        goodsname: undefined,
        purpose: undefined
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
        amount: undefined,
        purpose: undefined,
        createTime: undefined,
        reuse: undefined,
        unit: undefined,
        save: true
      },
      rules: {
        goodsname: [{ required: true, message: '物品名称不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '物品数量不能为空', trigger: 'blur' }]
      },
      deleteGoodsList: [],
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
        amount: undefined,
        purpose: undefined,
        createTime: undefined,
        reuse: undefined,
        unit: undefined
      }
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    clearFilter() {
      this.listQuery.goodsname = undefined
      this.listQuery.purpose = undefined
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.temp.createTime = +new Date()
      this.temp.reuse = 0
      this.temp.reuse = this.temp.reuse.toString()
      this.temp.save = true
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createPurchase(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建购买记录成功',
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
      row.reuse = row.reuse.toString()
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
          updatePurchase(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改购买记录成功',
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
      this.deleteGoodsList = []
      this.deleteGoodsList.push(row.id)
      this.$confirm('是否删除此购买记录', '删除购买记录', {
        confirmButtonText: '确定删除购买记录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePurchase()
        this.$message({
          type: 'success',
          message: '删除购买记录成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除购买记录/删除购买记录失败'
        })
      })
    },
    deletePurchase() {
      deletePurchase(this.deleteGoodsList).then(response => {
        this.deleteGoodsList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDelete() {
      this.deleteGoodsList = []
      this.multipleSelection.forEach(item => {
        this.deleteGoodsList.push(item.id)
      })
      if (this.deleteGoodsList.length === 0) {
        this.$message('没有选中购买记录')
      } else {
        this.$confirm('是否删除选中购买记录', '批量删除购买记录', {
          confirmButtonText: '确定删除购买记录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletePurchase()
          this.$message({
            type: 'success',
            message: '批量删除购买记录成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除购买记录/删除购买记录失败'
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

