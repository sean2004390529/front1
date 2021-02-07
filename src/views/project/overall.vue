<template>
  <div  class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="getList">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteOverall">
        批量删除
      </el-button>
      <br>

      <el-input v-model="listQuery.description" placeholder="搜索项目内容" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.managerName" placeholder="项目负责人" clearable style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option key="1" value="1" label="未完成" />
        <el-option key="0" value="0" label="完成" />
      </el-select>
      <el-select v-model="listQuery.urgent" placeholder="紧急度" clearable style="width: 120px" class="filter-item" @change="handleFilter">
        <el-option key="3" value="3" label="优先处理" />
        <el-option key="2" value="2" label="紧急" />
        <el-option key="1" value="1" label="一般" />
      </el-select>
      <el-button class="filter-item" type="info" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="info" icon="el-icon-circle-close" @click="clearFilter">
        清除筛选
      </el-button>
    </div>

    <!-- 各任务表格-->
    <el-tabs v-model="activeTask" @tab-click="handleTaskClick">
      <el-tab-pane label="紧急项目" name="urgent"></el-tab-pane>
      <el-tab-pane label="所有未完成项目" name="unfinish"></el-tab-pane>
      <el-tab-pane label="已完成" name="finished"></el-tab-pane>
      <!-- <el-tab-pane label="组任务" name="groupTask"></el-tab-pane> -->
    </el-tabs>

    <!--表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column label="序号" sortable align="center" width="50">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" align="left" width="200">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="紧急度" sortable width="80px" >
        <template slot-scope="{row}">
          <svg-icon v-for="n in +row.urgent" :key="n" icon-class="star" class="meta-item__icon" style="fill:blue;" />
        </template>
      </el-table-column>
      <el-table-column label="创建日期" sortable width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新日期" sortable width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计完成日期" sortable width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expectDate | formatDate }}</span>
        </template>
      </el-table-column>
            <el-table-column label="实际完成日期" sortable width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.completeDate | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable class-name="status-col" width="80">
        <template slot-scope="{row}">
          <el-tag effect="dark" :type="row.status | typeFilter">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="managerName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.managerName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="{row,$index}">
            <el-tag @click="handleUpdate(row,$index)">修改</el-tag>
            <el-tag @click="handleDelete(row,$index)" type="danger" >删除</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 编辑框 -->
    <el-dialog title="编辑项目" :visible.sync="dialogFormVisible" fullscreen=true>
      <div slot="title" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
      <el-divider content-position="left">
        <i class="el-icon-caret-bottom"></i>请填入项目内容<i class="el-icon-caret-bottom"></i>
      </el-divider>

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" size="mini">
        <el-row>
          <el-form-item label="ID" prop="id" hidden>
            <el-input v-model="temp.id" :disabled="true" />
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="项目负责人" prop="managerName" >
              <el-autocomplete
                v-model="temp.managerName"
                :fetch-suggestions="searchManagerAsync"
                placeholder="请输入项目负责人"
                @select="handleSelect"
                value-key="empName"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="项目金额（元）" prop="amount">
              <el-col :span="6">
                <el-input v-model="temp.amount"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="组员">
            <el-autocomplete 
              v-model="temp.member1Name"
              :fetch-suggestions="searchMemberAsync"
              placeholder="第一组员"
              clearable=true
              @select="handleSelect"
              value-key="empName"
            ></el-autocomplete>
            <el-autocomplete
              v-model="temp.member2Name"
              :fetch-suggestions="searchMemberAsync"
              placeholder="第二组员"
              clearable=true
              @select="handleSelect"
              value-key="empName"
            ></el-autocomplete>
            <el-autocomplete
              v-model="temp.member3Name"
              :fetch-suggestions="searchMemberAsync"
              placeholder="第三组员"
              clearable=true
              @select="handleSelect"
              value-key="empName"
            ></el-autocomplete>
            <el-autocomplete
              v-model="temp.member4Name"
              :fetch-suggestions="searchMemberAsync"
              placeholder="第四组员"
              clearable=true
              @select="handleSelect"
              value-key="empName"
            ></el-autocomplete>
          </el-form-item>
        </el-row>


        <el-row>
          <el-form-item label="项目描述" prop="description">
            <el-input type="textarea" v-model="temp.description" :rows="2" placeholder="请输入项目描述"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="项目目标" prop="target">
            <el-input type="textarea" v-model="temp.target" :rows="2" placeholder="请输入项目目标"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="项目前提" prop="requirement">
            <el-input type="textarea" v-model="temp.requirement" :rows="5" placeholder="请输入项目前提"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="项目风险" prop="risk">
            <el-input type="textarea" v-model="temp.risk" :rows="5" placeholder="请输入项目风险"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="项目详细说明" prop="detail">
            <el-input type="textarea" v-model="temp.detail" :rows="20" placeholder="请输入项目详细说明"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="紧急度" prop="urgent">
                <el-rate v-model="temp.urgent" :max="3" show-text :texts="texts" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="temp.status" class="filter-item" placeholder="项目状态">
                  <el-option key="1" value="1" label="未完成" />
                  <el-option key="0" value="0" label="完成" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="预计完成" prop="expectDate">
                <el-date-picker 
                  v-model="temp.expectDate" type="date" placeholder="预计完成日期" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实际完成" prop="expectDate">
                <el-date-picker 
                  v-model="temp.completeDate" type="date" placeholder="实际完成日期" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

        <el-row>
          <el-form-item label="项目结果" prop="result">
            <el-input type="textarea" v-model="temp.result" :rows="2" placeholder="请输入项目详细说明"></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createOverall, updateOverall, deleteOverall } from '@/api/project/overall'
import { fetchManagerEmp, fetchMemberEmp } from '@/api/emp'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'projectOverall',
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
      tableKey: 0,
      total: 0,
      listLoading: true,
      managerloading: false,
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        managerName: undefined,
        description: undefined,
        status: '',
        urgent: ''
      },
      temp: {
        id: undefined,
        managerName: undefined,
        member1Name: undefined,
        member2Name: undefined,
        member3Name: undefined,
        member4Name: undefined,
        description: undefined,
        target: undefined,
        requirement: undefined,
        risk: undefined,
        detail: undefined,
        result: undefined,
        status: '',
        urgent: '',
        expectDate: '',
        completeDate: '',
        amount: ''
      },
      dialogFormVisible: false,
      rules: {
        description: [{ required: true, message: '请填入项目描述', trigger: 'blur' }]
      },
      texts: ['一般', '紧急', '优先处理'],
      deleteOverallList: [],
      multipleSelection: [],
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }, {
          text: '一个月后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', date);
          }
        }]
      },
      managerList: [],
      memberList: [],
      state: '',
      timeout: null,
      activeTask: 'unfinish'
    }
  },
  created() {
    this.listQuery.status = 1
    this.listQuery.status = this.listQuery.status.toString()
    this.listQuery.urgent = ''
    this.getList()
    this.fetchManager()
    this.fetchMember()
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
    fetchManager(){
      fetchManagerEmp().then(response =>{
        this.managerList = response.data
      })
    },
    fetchMember(){
      fetchMemberEmp().then(response =>{
        this.memberList = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        managerName: undefined,
        member1Name: undefined,
        member2Name: undefined,
        member3Name: undefined,
        member4Name: undefined,
        description: undefined,
        target: undefined,
        requirement: undefined,
        risk: undefined,
        detail: undefined,
        result: undefined,
        status: '',
        urgent: '',
        expectDate: '',
        completeDate: '',
        amount: ''
      }
    },
    tableRowClassName({row, rowIndex}) {
      const expDate = formatDate(row.expectDate)
      const now = formatDate(new Date())
      if (expDate<now) {
        return 'warning-row';
      } else return '';
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    clearFilter() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        managerName: undefined,
        description: undefined,
        status: '',
        urgent: ''
      },
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.temp.urgent = 1
      this.temp.status = 1
      this.temp.status = this.temp.status.toString()
      this.temp.expectDate = new Date()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createOverall(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建项目成功',
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
      row.status = row.status.toString()
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
          updateOverall(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改项目成功',
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
      this.deleteOverallList = []
      this.deleteOverallList.push(row.id)
      this.$confirm('是否删除此项目', '删除项目', {
        confirmButtonText: '确定删除项目',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteOverall()
        this.$message({
          type: 'success',
          message: '删除项目成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除项目/删除项目失败'
        })
      })
    },
    deleteOverall() {
      deleteOverall(this.deleteOverallList).then(response => {
        this.deleteOverallList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteOverall() {
      this.deleteOverallList = []
      this.multipleSelection.forEach(item => {
        this.deleteOverallList.push(item.id)
      })
      if (this.deleteOverallList.length === 0) {
        this.$message('没有选中项目')
      } else {
        this.$confirm('是否删除选中项目', '批量删除项目', {
          confirmButtonText: '确定删除项目',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteOverall()
          this.$message({
            type: 'success',
            message: '批量删除项目成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除项目/删除项目失败'
          })
        })
      }
    },
    searchManagerAsync(queryString, cb) {
      var managers = this.managerList;
      var results = queryString ? managers.filter(this.createStateFilter(queryString)) : managers;
      clearTimeout(this.timeout);
      cb(results);
    },
    searchMemberAsync(queryString, cb) {
      var members = this.memberList;
      var results = queryString ? members.filter(this.createStateFilter(queryString)) : members;
      clearTimeout(this.timeout);
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.empName.indexOf(queryString) === 0);
      };
    },
    handleSelect(item) {
      // console.log(item);
    },
    handleCellClick(row){
      this.handleUpdate(row)
    },
    handleTaskClick(tab, event){
      if(tab.name == 'urgent'){
        this.listQuery.status = 1
        this.listQuery.status = this.listQuery.status.toString()
        this.listQuery.urgent = 3
        this.listQuery.urgent = this.listQuery.urgent.toString()
        this.getList()
      }
      else if(tab.name == 'unfinish'){
        this.listQuery.status = 1
        this.listQuery.status = this.listQuery.status.toString()
        this.listQuery.urgent = ''
        this.getList()
      }
      else if(tab.name == 'finished'){
        this.listQuery.status = 0
        this.listQuery.status = this.listQuery.status.toString()
        this.listQuery.urgent = ''
        this.getList()
      }
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: #F56C6C;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>