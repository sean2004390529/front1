<template>
  <div class="app-container">
    <!-- 功能键 -->
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="getList">
        刷新
      </el-button>
    </div>

    <!-- 各申请-->
    <el-tabs v-model="activeTask" @tab-click="handleTaskClick">
      <!-- 出差申请 Tab -->
      <el-tab-pane label="出差申请" name="pretrip">
        <el-table
          :key="pretripTableKey"
          v-loading="listLoading"
          :data="pretripList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @cell-click="pretripCellClick"
        >
          <el-table-column label="序号" sortable align="center" width="80">
            <template slot-scope="{row, $index}">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="left" >
            <template slot-scope="{row}">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始于"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.startDate | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束于" align="center">
            <template slot-scope="{row}">
              <span>{{ row.endDate | formatDate }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.status | statusColor">
                {{ row.status | statusFilter }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 出差申请单 回显-->
    <el-dialog :title="出差申请" :visible.sync="pretripFormVisible" fullscreen>
      <el-form ref="dataForm" :model="pretripTemp" label-position="left" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="标题" >
              <el-input v-model="pretripTemp.title" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="目的地">
              <el-input v-model="pretripTemp.destination" disabled/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="开始于">
              <el-date-picker
                v-model="pretripTemp.startDate"
                type="date" disabled >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="结束于">
              <el-date-picker
                v-model="pretripTemp.endDate"
                type="date" disabled >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="理由" >
          <el-input v-model="pretripTemp.reason" type="textarea" :rows="4" disabled />
        </el-form-item>
        <el-form-item label="预定行程" >
          <el-input v-model="pretripTemp.trip" type="textarea" :rows="4" disabled />
        </el-form-item>
        <el-form-item label="备注" >
          <el-input v-model="pretripTemp.remark" type="textarea" :rows="4" disabled />
        </el-form-item>
        <el-form-item label="同行人" >
          <el-tag>{{pretripTemp.emp1Name}}</el-tag>
          <el-tag v-show="pretripTemp.emp2Name!=null">{{pretripTemp.emp2Name}}</el-tag>
          <el-tag v-show="pretripTemp.emp3Name!=null">{{pretripTemp.emp3Name}}</el-tag>
          <el-tag v-show="pretripTemp.emp4Name!=null">{{pretripTemp.emp4Name}}</el-tag>
          <el-tag v-show="pretripTemp.emp5Name!=null">{{pretripTemp.emp5Name}}</el-tag>
        </el-form-item>

        <el-form-item label="批注信息">
          <el-table
            :data="commentData"
            style="width: 100%"
            fit
            border
            highlight-current-row
          >
            <el-table-column label="日期" width="100px">
              <template slot-scope="{row}">
                <span>{{ row.createTime | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="审批人" width="100px">
              <template slot-scope="{row}">
                <span>{{ row.empName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="批语">
              <template slot-scope="{row}">
                <span>{{ row.comment }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pretripFormVisible = false">取消</el-button>
    </el-dialog>

  </div>

</template>

<script>
import { getComment } from '@/api/activiti/comment'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'
import { fetchPretripHistory, showPretripInfo } from '@/api/activiti/process/pretrip'

export default {
  name: 'com1History',
  components: { Pagination },
  filters: {
    formatDate(time) {
      return formatDate(time)
    },
    statusColor(status) {
      const statusMap = ['info','info', 'success','warning']
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = ['未提交','审批中','已通过','取消']
      return statusMap[status]
    },
  },
  data() {
    return {
      total: 0,
      activeTask: 'pretrip',
      listQuery: {
        pageNum: 1,
        pageSize: 20
      },
      pretripTableKey: 6,
      listLoading: true,
      pretripList: [],
      pretripFormVisible: false,
      pretripTemp: {
        title: undefined,
        startDate: undefined,
        endDate: undefined,
        reason: undefined,
        remark: undefined,
        trip: undefined
      },
      commentTemp: {
        taskId: undefined,
        comment: undefined,
        key: undefined
      },
      commentData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if(this.activeTask=='pretrip'){
        fetchPretripHistory(this.listQuery).then(response => {
          this.pretripList = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      }
    },
    handleTaskClick(tab){
      this.activeTask = tab.name
      this.getList()
    },
    pretripCellClick(row){
      getComment(row.instanceId).then( res => {
        this.commentData = res.data
      })
      showPretripInfo(row.id).then( res => {
        this.pretripTemp = Object.assign({}, res.data) // copy obj
        this.pretripFormVisible = true
      })
    },
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 10px;
  }
</style>