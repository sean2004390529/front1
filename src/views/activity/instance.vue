<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteInstance">
        批量删除
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
      <el-table-column label="流程实例key" prop="processDefinitionKey" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.processDefinitionKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程资源名" prop="processDefinitionResourceName" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.processDefinitionResourceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" prop="status" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启动日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.startDate | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-tag @click.stop="handleDelete(row,$index)" type="danger" >删除</el-tag>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { fetchList, deleteInstance } from '@/api/activiti/instance'
import { formatDate } from '@/utils'

export default {
  name: 'ActivitiInstance',
  filters: {
    formatDate(time) {
      return formatDate(time)
    }
  },
  data() {
    return {
      listLoading: true,
      list: null,
      deleteInstanceList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleDelete(row, index) {
      this.deleteInstanceList = []
      this.deleteInstanceList.push(row.id)
      this.$confirm('是否删除此申请', '删除申请', {
        confirmButtonText: '确定删除申请',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteInstance()
        this.$message({
          type: 'success',
          message: '删除申请成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除申请'
        })
      })
    },
    deleteInstance() {
      deleteInstance(this.deleteInstanceList).then(response => {
        this.deleteInstanceList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteInstance() {
      this.deleteInstanceList = []
      this.multipleSelection.forEach(item => {
        this.deleteInstanceList.push(item.id)
      })
      if (this.deleteInstanceList.length === 0) {
        this.$message('没有选中申请')
      } else {
        this.$confirm('是否删除选中申请', '批量删除申请', {
          confirmButtonText: '确定删除申请',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteInstance()
          this.$message({
            type: 'success',
            message: '批量删除申请成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除申请'
          })
        })
      }
    },
  }

}
</script>

<style>

</style>