<template>
  <div class="app-container">

    <!-- 进度条-->
    <div>
      <el-steps :active="active" finish-status="success" >
        <el-step icon="el-icon-edit" title="填写申请"></el-step>
        <el-step icon="el-icon-s-check" title="选择审批人"></el-step>
      </el-steps>
    </div>

    <div class="marginTop">
      <!-- 填写申请 step0 -->
      <div v-show="active==0">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" >
          <el-form-item label="标题" prop="title">
            <el-col :span="11">
              <el-input v-model="temp.title" />
            </el-col>
          </el-form-item>
          <el-form-item label="迟到、早退" prop="type">
            <el-select v-model="temp.type" placeholder="请选择类型">
              <el-option label="迟到" value="0" />
              <el-option label="早退" value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="日期" prop="lateDate">
            <el-date-picker
              v-model="temp.lateDate"
              placeholder="选择日期"
              type="date"
              clearable
            />
          </el-form-item>

          <el-form-item label="迟到早退分钟数" prop="mins">
            <el-col :span="4">
              <el-input-number v-model="temp.mins" :min="0" :step="10" />
            </el-col>
          </el-form-item>
          <el-form-item label="备注" prop="reason">
            <el-col :span="11">
              <el-input type="textarea" v-model="temp.reason" placeholder="请输入请假备注" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 选择审批人 step1 -->
      <div v-show="active==1">
        <el-form ref="leaderForm" :rules="leaderRules" :model="temp" label-position="left" label-width="120px" >
          <el-form-item label="主管审批" prop="managerName">
            <el-select v-model="temp.managerName" clearable placeholder="请选择主管" value-key="item" @change="managerChange">
              <el-option
                v-for="(item,idx) in managerOptions"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('manager')">选择部门</el-button>
          </el-form-item>

          <el-form-item label="人事部审批"  prop="hrName">
            <el-select v-model="temp.hrName" placeholder="选择人事部员工" value-key="item" @change="hrChange">
              <el-option
                v-for="(item,idx) in hrOptions"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('hr')">选择部门</el-button>
          </el-form-item>

          <el-form-item label="总经理审批" v-show="temp.mins>=60">
            <el-select v-model="temp.ceoName" placeholder="选择总经理" value-key="item" @change="ceoChange">
              <el-option
                v-for="(item,idx) in ceoOptions"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('ceo')">选择部门</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submit">保存请假单</el-button>
            <el-button @click="active=0">返回</el-button>
          </el-form-item>
      </div>

      <!-- 部门树 step1-->
      <!-- 选择特殊员工处理申请 -->
      <div v-show="showEmp && active==1">
        <div v-if="!deptList">
          <el-button @click="fetchDeptList">刷新部门列表</el-button>
        </div>

        <div v-else>
          <el-col :span="10">
            <el-tree ref="tree"
            :data="deptList"
            node-key="id"
            :props="defaultProps"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-col>

          <el-col :span="10">
            <el-row >
              <el-tag class="marginLeft" size="medium" @click="tagClick(tag.id, tag.empName)"
                v-for="tag in tagOptions"
                :key="tag.id">
                {{tag.empName}}
              </el-tag>
            </el-row>
          </el-col>
        </div>
      </div>

    <div>
  </div>
</template>

<script>
import { submit } from '@/api/activiti/process/late'
import { fetchList as fetchDeptList } from '@/api/dept'
import { fetchsubDeptEmp } from '@/api/emp'
import { fecthSpecialemp } from '@/api/activiti/specialemp'

export default {
  name: "Late",
  data() {
    return {
      active: 0,
      temp: {
        title: '○月○日迟到',
        type: 0,
        lateDate: undefined,
        mins: undefined,
        reason: undefined,
        managerId: undefined,
        managerName: undefined,
        hrId: undefined,
        hrName: undefined,
        ceoId: undefined,
        ceoName: undefined
      },
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        lateDate: [{ required: true, message: '日期不能为空', trigger: 'blur' }],
        mins: [{ required: true, message: '分钟数不能为空', trigger: 'blur' }]
      },
      leaderRules: {
        managerName: [{ required: true, message: '主管不能为空', trigger: 'blur' }],
        hrName: [{ required: true, message: 'HR不能为空', trigger: 'blur' }],
      },
      whoApprove: '',
      managerOptions: [],
      hrOptions: [],
      ceoOptions: [],
      tagOptions: [],
      showEmp: false,
      deptId: undefined,
      deptList: null,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
    };
  },
  created() {
    this.temp.type = this.temp.type.toString()
    this.fecthSpecialemp()
  },
  methods: {
    resetTemp() {
      this.temp = {
        title: '○月○日迟到',
        type: 1,
        lateDate: undefined,
        mins: undefined,
        reason: undefined,
        managerId: undefined,
        managerName: undefined,
        hrId: undefined,
        hrName: undefined,
        ceoId: undefined,
        ceoName: undefined
      }
    },
    checkStep1(){
      this.permitSubmit = false
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          this.permitSubmit = true
        }
      })
    },
    nextStep(){
      this.checkStep1()
      if(this.permitSubmit){
        this.active = 1
      }
    },
    submit(){
      this.checkStep1()
      this.$refs['leaderForm'].validate((valid) => {
        if(valid && this.permitSubmit){
          submit(this.temp).then(() => {
            this.resetTemp()
            this.$notify({
              title: '成功',
              message: '保存申请成功（未正式提交）',
              type: 'success',
              duration: 5000
            })
            setTimeout(() => {
              this.$router.push({path:"/activity/task"})
            }, 500)
          })
        }
      })
    },
    fetchDeptList(){
      fetchDeptList().then(res =>{
        this.deptList = res.data
      })
    },
    handleSelectEmp(tag){
      // 注入tag
      this.whoApprove = tag
      this.showEmp = true
      this.fetchDeptList()
    },
    handleNodeClick(data) {
      this.deptId = data.id
      fetchsubDeptEmp(this.deptId).then(res =>{
        this.tagOptions = res.data
        if(this.whoApprove=='manager'){
          this.managerOptions = res.data
        }else if(this.whoApprove=='hr'){
          this.hrOptions = res.data
        }else if(this.whoApprove=='ceo'){
          this.ceoOptions = res.data
        }
      })
    },
    tagClick(empId, empName){
      // 根据tag，判断现在是设定主管 还是 hr审批
      if(this.whoApprove=='manager'){
        this.temp.managerId = empId
        this.temp.managerName = empName
      }else if(this.whoApprove=='hr'){
        this.temp.hrId = empId
        this.temp.hrName = empName
      }else if(this.whoApprove=='ceo'){
        this.temp.ceoId = empId
        this.temp.ceoName = empName
      }
      this.showEmp = false
    },
    managerChange(val){
      this.temp.managerId = val.id
      this.temp.managerName = val.empName
      this.showEmp = false
    },
    hrChange(val){
      this.temp.hrId = val.id
      this.temp.hrName = val.empName
      this.showEmp = false
    },
    ceoChange(val){
      this.temp.ceoId = val.id
      this.temp.ceoName = val.empName
      this.showEmp = false
    },
    fecthSpecialemp(){
      fecthSpecialemp('hr').then(res =>{
        this.temp.hrId = res.data.empId
        this.temp.hrName = res.data.empName
      })
      fecthSpecialemp('ceo').then(res =>{
        this.temp.ceoId = res.data.empId
        this.temp.ceoName = res.data.empName
      })
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .marginLeft {
    margin-left: 10px;
  }

  .marginTop {
    margin-top: 10px;
  }
</style>