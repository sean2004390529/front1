<template>
  <div class="app-container">
    <!--新增、搜索栏 -->
    <div class="filter-container">
      <el-col :span="8">
        <el-input v-model="simpleInput.description" autofocus clearable placeholder="请添加Todo项" />
      </el-col>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addTodo">
        添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="getList">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteTodo">
        批量删除
      </el-button>
      <br>

      <el-input v-model="listQuery.description" placeholder="搜索Todo内容" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.result" placeholder="搜索结果" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="筛选状态" clearable style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option key="1" value="1" label="未完成" />
        <el-option key="0" value="0" label="完成" />
      </el-select>
      <el-select v-model="listQuery.urgent" placeholder="筛选紧急度" clearable style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option key="3" value="3" label="优先处理" />
        <el-option key="2" value="2" label="紧急" />
        <el-option key="1" value="1" label="一般" />
      </el-select>
      <el-select v-model="listQuery.isPublic" placeholder="筛选公开状态" clearable style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option lkey="1" value="1" abel="公开" />
        <el-option key="0" value="0" label="非公开" />
      </el-select>
      <el-button class="filter-item" type="info" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <!--表格 -->
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

      <el-table-column label="序号" sortable align="center" width="80">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" align="left" width="400">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" label="紧急度" sortable>
        <template slot-scope="{row}">
          <svg-icon v-for="n in +row.urgent" :key="n" icon-class="star" class="meta-item__icon" style="fill:blue;" />
        </template>
      </el-table-column>
      <el-table-column label="创建日期" sortable width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结果" prop="result" align="left">
        <template slot-scope="{row}">
          <span>{{ row.result }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable class-name="status-col" width="80">
        <template slot-scope="{row}">
          <el-tag effect="dark" :type="row.status | typeFilter">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="right" width="280" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="1==row.status" size="mini" type="success" @click="handleModifyStatus(row,0)">
            标记为完成
          </el-button>
          <el-button v-if="0==row.status" size="mini" type="info" @click="handleModifyStatus(row,1)">
            标记为未完成
          </el-button>
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
    <el-dialog title="编辑Todo" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="ID" prop="id" hidden>
          <el-input v-model="temp.id" :disabled="true"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" placeholder="请输入Todo内容" />
        </el-form-item>
        <el-form-item label="紧急度" prop="urgent">
          <el-rate v-model="temp.urgent" :max="3" show-text :texts="texts" />
        </el-form-item>
        <el-form-item label="结果" prop="result">
          <el-input v-model="temp.result" placeholder="请输入结果" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择状态">
            <el-option key="1" value="1" label="未完成" />
            <el-option key="0" value="0" label="完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="公开状态">
          <el-select v-model="temp.isPublic" class="filter-item" placeholder="请选择状态">
            <el-option key="1" value="1" label="公开" />
            <el-option key="0" value="0" label="非公开" />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createTodo, updateTodo, deleteTodo } from '@/api/todo'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Todo',
  components: { Pagination },
  filters: {
    formatDate(time) {
      return formatDate(time)
    },
    typeFilter(status) {
      const typeMap = ['success', 'info']
      return typeMap[status]
    },
    statusFilter(status) {
      const statusMap = ['完成', '未完成']
      return statusMap[status]
    }
  },
  data() {
    return {
      input: '',
      tableKey: 0,
      total: 0,
      listLoading: true,
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        description: undefined,
        result: undefined,
        status: '',
        urgent: '',
        isPublic: ''
      },
      simpleInput: {
        description: ''
      },
      temp: {
        id: undefined,
        description: '',
        status: '',
        urgent: 1,
        result: '',
        isPublic: ''
      },
      dialogFormVisible: false,
      rules: {
        description: [{ required: true, message: 'Todo内容必填', trigger: 'blur' }]
      },
      texts: ['一般', '紧急', '优先处理'],
      statusOptions: ['未完成', '完成'],
      deleteTodoList: [],
      multipleSelection: [],
      activeNames: ['1']
    }
  },
  created() {
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
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetSimpleInput() {
      this.simpleInput = {
        description: ''
      }
    },
    addTodo() {
      createTodo(this.simpleInput).then(() => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        setTimeout(() => {
          this.resetSimpleInput()
          this.getList()
        }, 500)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Todo内容不能为空'
        })
      })
    },
    handleModifyStatus(row, status) {
      const tempData = Object.assign({}, row)
      tempData.status = status
      updateTodo(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改状态成功',
          type: 'success',
          duration: 5000
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '修改状态失败'
        })
      })
      setTimeout(() => {
        this.getList()
      }, 500)
    },
    handleUpdate(row, index) {
      row.status = row.status.toString()
      row.isPublic = row.isPublic.toString()
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateTodo(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改角色成功',
              type: 'success',
              duration: 5000
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Todo更新失败'
            })
          })
          setTimeout(() => {
            this.getList()
          }, 500)
        }
      })
    },
    handleDelete(row, index) {
      this.deleteTodoList = []
      this.deleteTodoList.push(row.id)
      this.$confirm('是否删除此Todo', '删除Todo', {
        confirmButtonText: '确定删除Todo',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTodo()
        this.$message({
          type: 'success',
          message: '删除Todo成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除Todo'
        })
      })
    },
    deleteTodo() {
      deleteTodo(this.deleteTodoList).then(response => {
        this.deleteTodoList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteTodo() {
      this.deleteTodoList = []
      this.multipleSelection.forEach(item => {
        this.deleteTodoList.push(item.id)
      })
      if (this.deleteTodoList.length === 0) {
        this.$message('没有选中Todo')
      } else {
        this.$confirm('是否删除选中Todo', '批量删除Todo', {
          confirmButtonText: '确定删除Todo',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteTodo()
          this.$message({
            type: 'success',
            message: '批量删除Todo成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除Todo'
          })
        })
      }
    }
  }
}
</script>

<style>

</style>
