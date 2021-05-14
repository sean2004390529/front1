<template>
  <div class="app-container">

    <el-row>
      <el-col :span="12">
        <el-steps :active="active" finish-status="success" >
            <el-step icon="el-icon-edit" title="填写申请"></el-step>
            <el-step icon="el-icon-user-solid" title="选择同行人"></el-step>
            <el-step icon="el-icon-s-check" title="选择审批人"></el-step>
        </el-steps>
      </el-col>
    </el-row>

    <div class="marginTop">
      <!-- 填写申请 step0 -->
      <div v-show="active==0">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" >
          <el-form-item label="标题" prop="title">
            <el-input v-model="temp.title" />
          </el-form-item>
          <el-form-item label="目的地" prop="destination">
            <el-col :span="12">
              <el-input v-model="temp.destination" />
            </el-col>
          </el-form-item>
          <el-form-item label="出差日期" prop="tripDate">
            <el-date-picker
              v-model="temp.tripDate"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="-"
              type="daterange"
              clearable
              @change="dateChange"
            />
          </el-form-item>

          <el-form-item label="目的" >
              <el-input type="textarea" :rows="4" v-model="temp.reason" placeholder="请输入出差目的" />
          </el-form-item>
            <el-form-item label="预定行程" >
              <el-input type="textarea" :rows="4" v-model="temp.trip" placeholder="请输入预定行程"  />
          </el-form-item>
            <el-form-item label="备注" >
              <el-input type="textarea" :rows="4" v-model="temp.remark" placeholder="请输入备注"  />
          </el-form-item>
          <el-form-item label="预计费用" >
              <el-col :span="7">
                交通: <el-input-number v-model="temp.trafficFee" :min="0" label="预计交通费"></el-input-number>
              </el-col>
              <el-col :span="7">
                住宿: <el-input-number v-model="temp.hotelFee" :min="0" label="预计住宿费"></el-input-number>
              </el-col>
              <el-col :span="7">
                总费: <el-input-number v-model="temp.amount" :min="0" label="预计总费用"></el-input-number>
              </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 选择同行人 step1 -->
      <div v-show="active==1">
        <el-form ref="fellowForm" :rules="fellowRules" :model="temp" label-position="left" label-width="150px" >
          <el-form-item label="第一申请人" prop="emp1Name">
            <el-select v-model="temp.emp1Name" clearable placeholder="申请人" value-key="item" @change="emp1Change" disabled>
              <el-option
                v-for="(item,idx) in emp1Options"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <!-- <el-button icon="el-icon-user-solid" @click="handleSelectEmp('emp1')">选择部门</el-button> -->
          </el-form-item>

          <el-form-item label="第二申请人" prop="emp2Name">
            <el-select v-model="temp.emp2Name" clearable placeholder="申请人" value-key="item" @change="emp2Change">
              <el-option
                v-for="(item,idx) in emp2Options"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('emp2')">选择部门</el-button>
          </el-form-item>

          <el-form-item label="第三申请人" prop="emp3Name">
            <el-select v-model="temp.emp3Name" clearable placeholder="申请人" value-key="item" @change="emp3Change">
              <el-option
                v-for="(item,idx) in emp3Options"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('emp3')">选择部门</el-button>
          </el-form-item>

          <el-form-item label="第四申请人" prop="emp4Name">
            <el-select v-model="temp.emp4Name" clearable placeholder="申请人" value-key="item" @change="emp4Change">
              <el-option
                v-for="(item,idx) in emp4Options"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('emp4')">选择部门</el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="updateSchedule">更新到各员日历中</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nextStep">下一步</el-button>
            <el-button @click="active=0">返回</el-button>
          </el-form-item>
      </div>

      <!-- 选择审批人 step1 -->
      <div v-show="active==2">
        <el-form ref="leaderForm" :rules="leaderRules" :model="temp" label-position="left" label-width="150px" >
          <el-form-item label="第一审批人" prop="approver1Name">
            <el-select v-model="temp.approver1Name" clearable placeholder="请选择第一审批人" value-key="item" @change="approver1Change">
              <el-option
                v-for="(item,idx) in approver1Options"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('approver1')">选择部门</el-button>
          </el-form-item>

          <el-form-item label="第二审批人（如需）"  prop="approver2Name">
            <el-select v-model="temp.approver2Name" placeholder="请选择第二审批人" value-key="item" @change="approver2Change">
              <el-option
                v-for="(item,idx) in approver2Options"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('approver2')">选择部门</el-button>
          </el-form-item>

          <el-form-item label="第三审批人（如需）">
            <el-select v-model="temp.approver3Name" placeholder="请选择第三审批人" value-key="item" @change="approver3Change">
              <el-option
                v-for="(item,idx) in approver3Options"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('approver3')">选择部门</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submit">保存请假单</el-button>
            <el-button @click="active=1">返回</el-button>
          </el-form-item>
      </div>

      <!-- 部门树 step1-->
      <!-- 选择特殊员工处理申请 -->
      <div v-show="showEmp && active!=0">
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
import { submit } from '@/api/activiti/process/pretrip'
import { fetchList as fetchDeptList } from '@/api/dept'
import { fetchsubDeptEmp, fetchYourself } from '@/api/emp'
import { updateFromPretrip } from '@/api/calendar'

export default {
  name: "PreTrip",
  data() {
    return {
      active: 0,
      temp: {
        title: '○月○日出差',
        destination: undefined,
        tripDate: undefined,
        reason: undefined,
        trip: undefined,
        remark: undefined,
        trafficFee: undefined,
        hotelFee: undefined,
        amount: undefined,
        emp1Id: undefined,
        emp1Name: undefined,
        emp2Id: undefined,
        emp2Name: undefined,
        emp3Id: undefined,
        emp3Name: undefined,
        emp4Id: undefined,
        emp4Name: undefined,
        approver1Id: undefined,
        approver1Name: undefined,
        approver2Id: undefined,
        approver2Name: undefined,
        approver3Id: undefined,
        approver3Name: undefined
      },
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        destination: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        tripDate: [{ required: true, message: '出差时间不能为空', trigger: 'blur' }]
      },
      fellowRules: {
        emp1Name: [{ required: true, message: '第一审申请人不能为空', trigger: 'blur' }]
      },
      leaderRules: {
        approver1Name: [{ required: true, message: '第一审批人不能为空', trigger: 'blur' }]
      },
      whoApprove: '',
      approver1Options: [],
      approver2Options: [],
      approver3Options: [],
      tagOptions: [],
      showEmp: false,
      deptId: undefined,
      deptList: null,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      updateSchedule: true
    }
  },
  created() {
      this.fetchYourself()
  },
  methods: {
    fetchYourself(){
      fetchYourself().then(res => {
        this.temp.emp1Id = res.data.empId;
        this.temp.emp1Name = res.data.empName;
      })
    },
    resetTemp() {
      this.temp = {
        title: '○月○日出差',
        destination: undefined,
        tripDate: undefined,
        reason: undefined,
        trip: undefined,
        remark: undefined,
        trafficFee: undefined,
        hotelFee: undefined,
        amount: undefined,
        emp1Id: undefined,
        emp1Name: undefined,
        emp2Id: undefined,
        emp2Name: undefined,
        emp3Id: undefined,
        emp3Name: undefined,
        emp4Id: undefined,
        emp4Name: undefined,
        approver1Id: undefined,
        approver1Name: undefined,
        approver2Id: undefined,
        approver2Name: undefined,
        approver3Id: undefined,
        approver3Name: undefined
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
        this.active = this.active + 1
      }
    },
    submit(){
      this.checkStep1()
      if(this.updateSchedule){
          this.updateFromPretrip(this.temp)
      }
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
        if(this.whoApprove=='approver1'){
          this.approver1Options = res.data
        }else if(this.whoApprove=='approver2'){
          this.approver2Options = res.data
        }else if(this.whoApprove=='approver3'){
          this.approver3Options = res.data
        }else if(this.whoApprove=='emp1'){
          this.emp1Options = res.data
        }else if(this.whoApprove=='emp2'){
          this.emp2Options = res.data
        }else if(this.whoApprove=='emp3'){
          this.emp3Options = res.data
        }else if(this.whoApprove=='emp4'){
          this.emp4Options = res.data
        }
      })
    },
    tagClick(empId, empName){
      // 根据tag，判断现在是设定主管 还是 hr审批
      if(this.whoApprove=='approver1'){
        this.temp.approver1Id = empId
        this.temp.approver1Name = empName
      }else if(this.whoApprove=='approver2'){
        this.temp.approver2Id = empId
        this.temp.approver2Name = empName
      }else if(this.whoApprove=='approver3'){
        this.temp.approver3Id = empId
        this.temp.approver3Name = empName
      }else if(this.whoApprove=='emp1'){
        this.temp.emp1Id = empId
        this.temp.emp1Name = empName
      }else if(this.whoApprove=='emp2'){
        this.temp.emp2Id = empId
        this.temp.emp2Name = empName
      }else if(this.whoApprove=='emp3'){
        this.temp.emp3Id = empId
        this.temp.emp3Name = empName
      }else if(this.whoApprove=='emp4'){
        this.temp.emp4Id = empId
        this.temp.emp4Name = empName
      }
      this.showEmp = false
    },
    approver1Change(val){
      this.temp.approver1Id = val.id
      this.temp.approver1Name = val.empName
      this.showEmp = false
    },
    approver2Change(val){
      this.temp.approver2Id = val.id
      this.temp.approver2Name = val.empName
      this.showEmp = false
    },
    approver3Change(val){
      this.temp.approver2Id = val.id
      this.temp.approver3Name = val.empName
      this.showEmp = false
    },
    emp1Change(val){
      this.temp.emp1Id = val.id
      this.temp.emp1Name = val.empName
      this.showEmp = false
    },
    emp2Change(val){
      this.temp.emp2Id = val.id
      this.temp.emp2Name = val.empName
      this.showEmp = false
    },
    emp3Change(val){
      this.temp.emp3Id = val.id
      this.temp.emp3Name = val.empName
      this.showEmp = false
    },
    emp4Change(val){
      this.temp.emp4Id = val.id
      this.temp.emp4Name = val.empName
      this.showEmp = false
    },
    updateFromPretrip(){
      updateFromPretrip(this.temp).then( res => {
        console.log("updateFromPretrip")
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