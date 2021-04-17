<template>
  <div class="app-container">

    <!-- 功能栏 -->
    <div class="filter-container">
      <el-upload
        class="upload"
        ref="upload"
        :action="uploadUrl"
        :data="uploadData"
        :limit="1"
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary" icon="el-icon-files" >选取zip格式bpmn文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" icon="el-icon-upload" @click="submitUpload">上传并部署</el-button>
        <el-button style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">刷新</el-button>
        <el-button style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="clearSystemDeployment">清除系统部署</el-button>
        <el-button style="margin-left: 10px;" type="danger" icon="el-icon-delete-solid" @click="batchDelete">批量删除</el-button>
      </el-upload>
    </div>

    <!-- 表格 act_re_deployment -->
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
      <el-table-column label="序号" sortable align="center" width="90px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名" prop="name" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传次数" prop="version" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部署日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deploymentTime | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-tag @click.stop="handleDelete(row,$index)" type="danger" >删除</el-tag>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />


    <!-- 显示 act_re_procdef -->
    <el-dialog title="绑定员工" :visible.sync="ProcessDefinitonVisible" >
      <el-form :model="tempDefiniton" label-position="left" label-width="100px" style="margin-left:50px;">
        <el-form-item label="ID" hidden>
          <el-input v-model="tempDefiniton.id" disabled />
        </el-form-item>
        <el-form-item label="部署名" >
          <el-input v-model="tempDefiniton.name" disabled />
        </el-form-item>
        <el-form-item label="部署key" >
          <el-input v-model="tempDefiniton.key" disabled />
        </el-form-item>
        <el-form-item label="bpmn文件名" >
          <el-input v-model="tempDefiniton.resourceName" disabled />
        </el-form-item>
        <el-form-item label="图片名" >
          <el-input v-model="tempDefiniton.diagramResourceName" disabled />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="ProcessDefinitonVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { clear, fetchList, deleteDeployment, getDefinition } from '@/api/activiti/deployment'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'ActivitiDeployment',
  filters: {
    formatDate(time) {
      return formatDate(time)
    }
  },
  data() {
    return {
      fileList: [],
      uploadData:{},
      uploadUrl: "https://seancloud.tech:8000/api/act/deploy/upload",
      tableKey: 0,
      total: 0,
      listLoading: true,
      list: null,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
      },
      deleteList: [],
      multipleSelection: [],
      ProcessDefinitonVisible: false,
      tempDefiniton: {
        id: undefined,
        name: undefined,
        key: undefined,
        resourceName: undefined,
        diagramResourceName: undefined
      }
    };
  },
  created() {
    this.getList()
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    submitUpload() {
      this.$refs.upload.submit()
      // :file-list=“fileList”，filelist为只读，修改后就会报错,清空上传列表
      setTimeout(() => {
        this.$refs.upload.clearFiles();
        this.getList()
      }, 500);
    },
    beforeUpload(file){
      const extName = file.name.split('.')[1]
      if(extName !="zip"){
        this.$message.error("请上传[.zip]格式文件")
      }
      else{
        return true
      }
    },
    resetDefiniton(){
      this.tempDefiniton = {
        id: undefined,
        name: undefined,
        key: undefined,
        resourceName: undefined,
        diagramResourceName: undefined
      }
    },
    clearSystemDeployment(){
      clear()
      setTimeout(() => {
        this.getList()
      }, 500);
    },
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleDelete(row, index) {
      this.deleteList = []
      this.deleteList.push(row.id)
      this.$confirm('是否删除此部署', '删除部署', {
        confirmButtonText: '确定删除部署',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDeployment()
        this.$message({
          type: 'success',
          message: '删除部署成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除部署'
        })
      })
    },
    deleteDeployment() {
      deleteDeployment(this.deleteList).then(response => {
        this.deleteList = []
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchDelete() {
      this.deleteList = []
      this.multipleSelection.forEach(item => {
        this.deleteList.push(item.id)
      })
      if (this.deleteList.length === 0) {
        this.$message('没有选中部署')
      } else {
        this.$confirm('是否删除选中部署', '批量删除部署', {
          confirmButtonText: '确定删除部署',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteDeployment()
          this.$message({
            type: 'success',
            message: '批量删除部署成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除部署'
          })
        })
      }
    },
    handleCellClick(row){
      this.resetDefiniton()
      getDefinition(row.id).then(res =>{
        this.tempDefiniton = res.data
        this.ProcessDefinitonVisible = true
      })
    }
  }
}
</script>

<style >


</style>