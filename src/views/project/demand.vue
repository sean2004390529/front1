<template>
  <div class="app-container">

    <!-- 功能键 -->
    <div class="filter-container">
      <el-button  class="filter-item" type="info" icon="el-icon-folder" @click="drawer=true">
        选定项目
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="info" icon="el-icon-edit" @click="cancelSelectPJ">
        取消选定项目
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="getList">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDeleteDemand">
        批量删除
      </el-button>
      <br>
      <div v-show="showPJ">
        <el-tag>{{ project.description }}</el-tag>
        <el-tag>{{ project.expectDate | formatDate }}</el-tag>
        <el-tag>{{ project.managerName }}</el-tag>
      </div>
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
      @cell-click="handleCellClick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" sortable align="center" width="50px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务描述" prop="description" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
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

      <el-table-column label="负责人" prop="inchargerName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.inchargerName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-tag @click="handleUpdate(row,$index)">修改</el-tag>
          <el-tag @click="handleDelete(row,$index)" type="danger" >删除</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑框 -->
    <el-dialog title="编辑项目" :visible.sync="dialogFormVisible" fullscreen=true>
      <!-- 编辑框 show -->
      <div v-if="showPJ">
        <div slot="title" class="dialog-footer">
          <el-tag>{{ project.description }}</el-tag>
          <el-tag>{{ project.expectDate | formatDate }}</el-tag>
          <el-tag>{{ project.managerName }}</el-tag><br>

          <el-divider content-position="left">
            <i class="el-icon-caret-bottom"></i>请填入项目进度<i class="el-icon-caret-bottom"></i>
          </el-divider>
        </div>
        
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" size="mini">
          <el-row>
            <el-form-item label="ID" prop="id" hidden>
              <el-input v-model="temp.id" :disabled="true" />
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="担当" prop="inchargerName" >
              <el-autocomplete
                v-model="temp.inchargerName"
                :fetch-suggestions="searchMemberAsync"
                placeholder="请输入担当"
                @select="handleSelect"
                value-key="empName"
              ></el-autocomplete>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="任务描述" prop="description">
              <el-input type="textarea" v-model="temp.description" :rows="2" placeholder="请输入项目描述"></el-input>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="进度描述" prop="detail">
              <el-input type="textarea" v-model="temp.detail" :rows="2" placeholder="请输入进度描述"></el-input>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="完成结果" prop="result">
              <el-input type="textarea" v-model="temp.result" :rows="2" placeholder="请输入进度结果"></el-input>
            </el-form-item>
          </el-row>

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
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            保存
          </el-button>
        </div>
      </div>

      <!-- 编辑框 未选择项目 -->
      <div v-else>
        <el-alert title="请先选择项目" type="error"></el-alert>
        <el-button  class="filter-item margin-top" type="primary" icon="el-icon-folder" @click="drawer=true">
          选择项目
        </el-button>
      </div>
    </el-dialog>



    <!--unfinish表格 -->
    <!-- 项目抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      direction="ltr"
      :show-close="false"
      @open="handleOpen"
      >

      <div slot="title" >
        <el-alert title="请选择项目" type="success"></el-alert>
      </div>

      <el-table
        :key="unfinishTableKey"
        v-loading="unfinishLoading"
        :data="unfinishList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        :row-class-name="tableRowClassName"
        @cell-click="handleUnfinishClick"
      >
        <el-table-column label="描述" prop="description" align="center" >
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预计完成日期" sortable align="center">
          <template slot-scope="{row}">
            <span>{{ row.expectDate | formatDate }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

  </div>


</template>

<script>
import { fetchList, createDemand, updateDemand, deleteDemand } from '@/api/project/demand'
import { fetchUnfinish } from '@/api/project/overall'
import { fetchMemberEmp } from '@/api/emp'
import { formatDate } from '@/utils'

export default {
  name: 'projectDemand',
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
  data () {
    return {
      unfinishTableKey: 0,
      unfinishTotal: 0,
      unfinishList: [],
      unfinishLoading: false,
      showPJ: false,
      project: {
        id: '',
        description: '',
        expectDate: '',
        managerName: ''
      },
      drawer: false,
      listLoading: false,
      dialogFormVisible: false,
      list: null,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      texts: ['一般', '紧急', '优先处理'],
      temp: {
        id: undefined,
        overallId: '',
        inchargerName: undefined,
        description: undefined,
        detail: undefined,
        status: 1,
        urgent: '',
        expectDate: '',
        completeDate: '',
      },
      rules: {
        description: [{ required: true, message: '任务需求描述必填', trigger: 'blur' }]
      },
      deleteDemandList: [],
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
      memberList: [],
      state: '',
      timeout: null,
    }
  },
  created() {
    this.loadUnfinishList()
    if(!this.showPJ){
      this.drawer = true
    }
    this.fetchMember()
    // this.getList()
  },
  methods: {
    resetTemp() {
      this.temp = {
        id: undefined,
        overallId: '',
        inchargerName: undefined,
        description: undefined,
        detail: undefined,
        status: 1,
        urgent: '',
        expectDate: '',
        completeDate: '',
      }
    },
    loadUnfinishList () {
      this.unfinishLoading = true
      fetchUnfinish().then(response => {
        this.unfinishList = response.data
        this.unfinishLoading = false
      })
    },
    cancelSelectPJ(){
      this.showPJ = false
      this.project= {
        id: '',
        description: '',
        expectDate: '',
        managerName: ''
      },
      this.list = []
    },
    getList(){
      this.listLoading = true
      if(this.showPJ){
        fetchList(this.project.id).then(response =>{
          this.list = response.data
        })
      }
      this.listLoading = false
    },
    fetchMember(){
      fetchMemberEmp().then(response =>{
        this.memberList = response.data
      })
    },
    handleUnfinishClick(row){
      this.project.id = row.id
      this.project.description = row.description
      this.project.expectDate = row.expectDate
      this.project.managerName = row.managerName
      this.showPJ = true
      this.getList()
      this.drawer = false
    },
    handleOpen(){
      // this.getDeptList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.temp.urgent = 1
      this.temp.status = 1
      this.temp.status = this.temp.status.toString()
      this.temp.expectDate = new Date()
      this.dialogFormVisible = true
      if(this.showPJ){
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.overallId = this.project.id
          createDemand(this.temp).then(() => {
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
          updateDemand(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改进度成功',
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
      this.deleteDemandList = []
      this.deleteDemandList.push(row.id)
      this.$confirm('是否删除此进度', '删除进度', {
        confirmButtonText: '确定删除进度',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDemand()
        this.$message({
          type: 'success',
          message: '删除项目进度!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除进度/删除项目进度'
        })
      })
    },
    deleteDemand() {
      deleteDemand(this.deleteDemandList).then(response => {
        this.deleteDemandList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDeleteDemand() {
      this.deleteDemandList = []
      this.multipleSelection.forEach(item => {
        this.deleteDemandList.push(item.id)
      })
      if (this.deleteDemandList.length === 0) {
        this.$message('没有选中进度')
      } else {
        this.$confirm('是否删除选中项目进度', '批量删除项目进度', {
          confirmButtonText: '确定删除项目进度',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteDemand()
          this.$message({
            type: 'success',
            message: '批量删除项目进度成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除项目进度/删除项目进度失败'
          })
        })
      }
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
    handleCellClick(row){
      this.handleUpdate(row)
    }
  }

}
</script>

<style scoped>
  .margin-top {
    margin-top: 10px;
  }


</style>