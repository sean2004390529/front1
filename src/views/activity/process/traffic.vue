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

          <!-- 滚动条 -->
          <el-form-item label="交通费" >
              <div class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
                <el-row v-for="i in feeTemp.trafficList.length" class="infinite-list-item" :model="feeTemp.trafficList" :gutter="5" >
                  <el-col :span="0.5" >
                    <span>{{i}}<span>
                  </el-col>
                  <el-col :span="4" >
                    <el-date-picker v-model="feeTemp.trafficList[i-1].feeDate" placeholder="选择日期" type="date" clearable />
                  </el-col>
                  <el-col :span="4" >
                    <el-input v-model="feeTemp.trafficList[i-1].from" placeholder="出发地"></el-input>
                  </el-col>
                  <el-col :span="4" >
                    <el-input v-model="feeTemp.trafficList[i-1].to" placeholder="目的地"></el-input>
                  </el-col>
                  <el-col :span="4" >
                    <el-input v-model="feeTemp.trafficList[i-1].reason" placeholder="原因"></el-input>
                  </el-col>
                  <el-col :span="3" >
                    <el-select v-model="feeTemp.trafficList[i-1].type" placeholder="费用类型">
                      <el-option label="全部" value="0" />
                      <el-option label="车费" value="1" />
                      <el-option label="高速费" value="2" />
                      <el-option label="停车费" value="3" />
                      <el-option label="其他" value="4" />
                    </el-select>
                  </el-col>
                  <el-col :span="3" class="marginLeft">
                    <el-input-number v-model="feeTemp.trafficList[i-1].fee" placeholder="金额" 
                      @focus="addItem(i)" 
                      @blur="caculatePreAmount">
                    </el-input-number>
                  </el-col>
                </el-row>
              </div>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-col :span="11">
              <el-input type="textarea" v-model="temp.remark" placeholder="备注" />
            </el-col>
          </el-form-item>

          <el-form-item label="报销额" >
            <el-col :span="4">
              <el-input-number v-model="feeTemp.preAmount" disabled />
            </el-col>
          </el-form-item>

          <el-form-item label="报销月份" prop="month">
            <el-date-picker
              v-model="temp.month"
              placeholder="选择月份"
              type="month"
              clearable
            />
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

          <el-form-item label="财务部部审批"  prop="financeName">
            <el-select v-model="temp.financeName" placeholder="选择人事部员工" value-key="item" @change="financeChange">
              <el-option
                v-for="(item,idx) in financeOptions"
                :key="idx"
                :label="item.empName"
                :value="item">
              </el-option>
            </el-select>
            <el-button icon="el-icon-user-solid" @click="handleSelectEmp('finance')">选择部门</el-button>
          </el-form-item>

          <el-form-item label="总经理审批"  prop="ceoName">
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

          <el-form-item label="报销额" >
            <el-col :span="4">
              <el-input-number v-model="feeTemp.preAmount" disabled />
            </el-col>
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
import { submit } from '@/api/activiti/process/traffic'
import { batchSaveTempFee } from '@/api/activiti/process/trafficfee'
import { fetchList as fetchDeptList } from '@/api/dept'
import { fetchsubDeptEmp } from '@/api/emp'
import { fecthSpecialemp } from '@/api/activiti/specialemp'

export default {
  name: "Traffic",
  data() {
    return {
      active: 0,
      temp: {
        title: '○月交通费',
        month: undefined,
        remark: undefined,
        managerId: undefined,
        managerName: undefined,
        financeId: undefined,
        financeName: undefined,
        ceoId: undefined,
        ceoName: undefined,
        uuid: undefined,
        amount: undefined
      },
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
      },
      leaderRules: {
        managerName: [{ required: true, message: '主管不能为空', trigger: 'blur' }],
        financeName: [{ required: true, message: '财务不能为空', trigger: 'blur' }],
        ceoName: [{ required: true, message: '总经理不能为空', trigger: 'blur' }],
      },
      whoApprove: '',
      managerOptions: [],
      financeOptions: [],
      ceoOptions: [],
      tagOptions: [],
      showEmp: false,
      deptId: undefined,
      deptList: null,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      feeTemp: {
        count: 1,
        preAmount: 0,
        trafficList: [
          {feeDate: undefined, from: undefined, to: undefined, reason: undefined, type: 0, fee: undefined}
        ]
      }
    }
  },
  created() {
    this.fecthSpecialemp()
    this.temp.month = new Date()
    this.feeTemp.trafficList[0].type = this.feeTemp.trafficList[0].type.toString()
  },
  methods: {
    resetTemp() {
      this.temp = {
        title: '○月交通费',
        month: undefined,
        remark: undefined,
        managerId: undefined,
        managerName: undefined,
        financeId: undefined,
        financeName: undefined,
        ceoId: undefined,
        ceoName: undefined,
        uuid: undefined,
        amount: undefined
      }
      this.temp.month = new Date()
      this.feeTemp.preAmount = 0
    },
    checkStep1(){
      this.permitSubmit = false
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          this.permitSubmit = true
        }
      })
    },
    batchSaveTempFee(){
      this.caculatePreAmount()
      batchSaveTempFee(this.feeTemp).then( res => {
        console.log("saveFee", res)
        this.temp.uuid = res.data.uuid
        if(this.feeTemp.preAmount==res.data.amount && this.permitSubmit){
          this.active = 1
          this.temp.amount = res.data.amount
        }
      })
    },
    nextStep(){
      this.checkStep1()
      this.batchSaveTempFee()
    },
    submit(){
      this.checkStep1()
      this.$refs['leaderForm'].validate((valid) => {
        if(valid && this.permitSubmit){
          console.log("submit", this.temp)
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
    dateChange(val){ //自动计算请假天数
      let diftime = (val[1]-val[0])/1000/60/60
      let day = 0
      if(diftime<5){
        day = 0.5
      }else {
        day = Math.floor(diftime/24) + 1
      }
      this.temp.leaveDays =  day
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
        }else if(this.whoApprove=='finance'){
          this.financeOptions = res.data
        }else if(this.whoApprove=='ceo'){
          this.ceoOptions = res.data
        }
      })
    },
    tagClick(empId, empName){
      // 根据tag，判断现在是设定主管 还是 finance审批
      if(this.whoApprove=='manager'){
        this.temp.managerId = empId
        this.temp.managerName = empName
      }else if(this.whoApprove=='finance'){
        this.temp.financeId = empId
        this.temp.financeName = empName
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
    financeChange(val){
      this.temp.financeId = val.id
      this.temp.financeName = val.empName
      this.showEmp = false
    },
    ceoChange(val){
      this.temp.ceoId = val.id
      this.temp.ceoName = val.empName
      this.showEmp = false
    },
    fecthSpecialemp(){
      fecthSpecialemp('finance').then(res =>{
        this.temp.financeId = res.data.empId
        this.temp.financeName = res.data.empName
      })
      fecthSpecialemp('ceo').then(res =>{
        this.temp.ceoId = res.data.empId
        this.temp.ceoName = res.data.empName
      })
    },
    addItem(i){
      if(i==this.feeTemp.count){
        this.feeTemp.count += 1
        this.feeTemp.trafficList.push({feeDate: undefined, from: undefined, to: undefined, reason: undefined, type: 0, fee: undefined})
        this.feeTemp.trafficList[this.feeTemp.count-1].type = this.feeTemp.trafficList[this.feeTemp.count-1].type.toString()
      }
    },
    caculatePreAmount() {
      this.feeTemp.preAmount = 0,
      this.feeTemp.trafficList.forEach( item => {
        if(item.fee!=null){
          this.feeTemp.preAmount = this.feeTemp.preAmount + item.fee
        }
      });
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

  .infinite-list {
      height: auto;
      padding: 0;
      margin: 0;
      list-style: none;
  }
  .infinite-list .infinite-list-item {
    display: flex;
    /* align-items: right;
    justify-content: right;
    height: 50px;
    background: #e8f3fe;
    margin-top: 10px;
    color: #7dbcfc; */
  }

  /* .wrap {
    height: auto;
    overflow-y: auto;
  } */
  
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: auto;
  }
</style>