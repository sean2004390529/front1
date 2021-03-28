<template>
  <div  class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
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
      <el-table-column label="申请单" prop="name" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人Id" prop="assignee" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.assignee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请单号" prop="businessKey" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.businessKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启动日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createDate | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-tag @click.stop="approveRequest(row,$index)" type="danger" >批准</el-tag>
          <el-tag @click.stop="ReturnRequest(row,$index)" type="danger" >退回</el-tag>
          <el-tag @click.stop="RejectRequest(row,$index)" type="danger" >拒绝</el-tag>
        </template>
      </el-table-column>
    </el-table>
      
  </div>
</template>

<script>
import { fetchList, approveRequest } from '@/api/activiti/task'
import { formatDate } from '@/utils'

export default {
  name: 'ActivitiTask',
  filters: {
    formatDate(time) {
      return formatDate(time)
    }
  },
  data() {
    return {
      listLoading: true,
      list: null,
      temp: {
        id: '',
        approve: '',
        businessKey: ''
      }
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
    approveRequest(row){
      console.log("approveRequest", row)
      this.temp.id = row.id
      this.temp.approve = 1
      this.temp.businessKey = row.businessKey
      approveRequest(this.temp).then(() => {
        this.getList()
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作失败'
        })
      })
    },
    ReturnRequest(row){
      console.log("approveRequest", row)
    },
    RejectRequest(row){
      console.log("approveRequest", row)
    }
  }
}
</script>

<style>

</style>