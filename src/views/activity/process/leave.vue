<template>
  <div class="app-container">

    <!-- 进度条-->
    <div>
      <el-steps :active="active" finish-status="success" >
        <el-step icon="el-icon-edit" title="填写申请"></el-step>
        <el-step icon="el-icon-s-check" title="选择审批人"></el-step>
        <el-step icon="el-icon-s-promotion" title="提交确认"></el-step>
      </el-steps>
    </div>

    <!-- 填写申请-->
    <div v-show="active==0">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" >
        <el-form-item label="标题" prop="title">
          <el-col :span="11">
            <el-input v-model="temp.title" />
          </el-col>
        </el-form-item>
        <el-form-item label="休假" prop="type">
          <el-select v-model="temp.type" placeholder="请选择休假种类">
            <el-option label="年假" value="1" />
            <el-option label="病假" value="2" />
            <el-option label="换休" value="3" />
            <el-option label="产假" value="4" />
            <el-option label="婚假" value="5" />
            <el-option label="丧假" value="6" />
            <el-option label="事假" value="11" />
            <el-option label="其他" value="12" />
          </el-select>
        </el-form-item>

        <el-form-item label="请假日期" prop="leaveDate">
          <el-date-picker
            v-model="temp.leaveDate"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange"
            :picker-options="pickerOptions"
            :default-time="['09:00:00', '18:00:00']"
            clearable
          />
        </el-form-item>

        <el-form-item label="休假天数" prop="title">
          <el-col :span="4">
            <el-input-number :min="0" v-model="temp.leaveDays" />
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="11">
            <el-input type="textarea" v-model="temp.remark" placeholder="请输入请假备注" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="active=1">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 选择审批人-->
    <div v-show="active==1">
      <!-- mock员工 -->
      <el-form ref="leaderForm" :rules="leaderRules" :model="temp" label-position="left" label-width="100px" >
        <el-form-item label="主管审批" prop="manager">
          <el-select v-model="temp.manager" placeholder="请选择审批的主管">
            <el-option
              v-for="item in managerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="人事部审批" prop="hr">
          <el-select v-model="temp.hr" placeholder="请选择审批的人事部员工">
            <el-option
              v-for="item in hrOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 部门树 -->
        <!-- 选择特殊员工处理申请 -->
        <el-form-item>
          <el-button type="primary" @click="active=2">下一步</el-button>
          <el-button @click="active=0">返回</el-button>
        </el-form-item>
    </div>

    <!-- 提交确认-->
    <div v-show="active==2">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" >
        <el-form-item label="标题" prop="title">
          <el-col :span="11">
            <el-input v-model="temp.title" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="休假" prop="type">
          <el-select v-model="temp.type" placeholder="请选择休假种类" disabled>
            <el-option label="年假" value="1" />
            <el-option label="病假" value="2" />
            <el-option label="换休" value="3" />
            <el-option label="产假" value="4" />
            <el-option label="婚假" value="5" />
            <el-option label="丧假" value="6" />
            <el-option label="事假" value="11" />
            <el-option label="其他" value="12" />
          </el-select>
        </el-form-item>

        <el-form-item label="请假日期" prop="leaveDate">
          <el-date-picker
            v-model="temp.leaveDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            :default-time="['09:00:00', '18:00:00']"
            disabled
          />
        </el-form-item>

        <el-form-item label="休假天数" prop="title">
          <el-col :span="4">
            <el-input-number :min="0" v-model="temp.leaveDays" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="11">
            <el-input type="textarea" v-model="temp.remark" placeholder="请输入请假备注" disabled />
          </el-col>
        </el-form-item>

        <el-form-item label="主管审批" prop="manager">
          <el-select v-model="temp.manager" placeholder="请选择审批的主管" disabled >
            <el-option
              v-for="item in managerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="人事部审批" prop="hr">
          <el-select v-model="temp.hr" placeholder="请选择审批的人事部员工" disabled >
            <el-option
              v-for="item in hrOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">确认申请</el-button>
          <el-button @click="active=0">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { submit } from '@/api/activiti/process/leave'

export default {
  name: "Leave",

  data() {
    return {
      active: 0,
      temp: {
        title: '○月○日休暇申請',
        type: '',
        leaveDate: '',
        leaveDays: '',
        remark: '',
        manager: '',
        hr: ''
      },
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        type: [{ required: true, message: '请假类型不能为空', trigger: 'blur' }],
        leaveDate: [{ required: true, message: '请假天数不能为空', trigger: 'blur' }],
        leaveDays: [{ required: true, message: '请假天数不能为空', trigger: 'blur' }]
      },
      // mock假数据
      managerOptions: [
        {value: 'staffid-111', label: '久住吕'},
        {value: 'staffid-222', label: '加菲'},
      ],
      hrOptions: [
        {value: 'staffid-333', label: '李菲菲'},
        {value: 'staffid-444', label: '唐飞飞'}
      ]
    };
  },
  methods: {
    resetTemp() {
      this.temp = {
        title: '○月○日休暇申請',
        type: '',
        leaveDate: '',
        leaveDays: '',
        remark: '',
        manager: '',
        hr: ''
      }
    },
    submit(){
      console.log("submit ", this.temp)
      submit(this.temp).then(() => {
        this.active = 0
        this.resetTemp()
        this.$notify({
          title: '成功',
          message: '申请提交成功',
          type: 'success',
          duration: 5000
        })
        setTimeout(() => {
          // this.getList()
        }, 500)
      })
    }
  }
}
</script>

<style>

</style>