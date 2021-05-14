<template>
  <div>

    <el-tabs v-model="activeName" @tab-click="handleClick" class="margin" >

      <!-- 修改密码 -->
      <el-tab-pane label="修改密码" name="changepw">
        <el-form ref="resetpwForm" :model="pwTemp" :rules="resetpwRules" label-position="left" label-width="80px">
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="pwTemp.newPassword" placeholder="请输入新密码" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword" >
            <el-input type="password" v-model="pwTemp.checkPassword" placeholder="请输入新密码"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changepw(pwTemp)">修改</el-button>
          </el-form-item>
      </el-form>
    </el-tab-pane>

  </el-tabs> 
  </div>
</template>

<script>
import { changepw, logout } from '@/api/user'

export default {
  name: 'user-settings',
  data(){
    return {
      activeName: 'changepw',
      pwTemp: {
        newPassword: undefined,
        checkPassword: undefined
      },
      resetpwRules: {
        newPassword: [{ pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d$@$!%*#?&]{6,}$/, message: '6位密码，必须包含大、小写字母与数字，可含特殊字符（不包括空格）'}],
        checkPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
    },
    changepw(){
      if(this.pwTemp.newPassword!=this.pwTemp.checkPassword){
        this.$message.error('密码不一致')
      }
      this.$refs['resetpwForm'].validate((valid) => {
        if(valid){
          changepw(this.pwTemp).then(res => {
            if(res.data=='ok'){
              this.$message.error('更新密码成功');
              logout()
            }else{
              this.$message.error('更新密码失败');
            }
          })
        }
      })
    }
  }
}
</script>

<style>
 .margin {
   margin-left: 20px;
   margin-top: 20px;
 }

 .el-input--small {
    width: 200px;
}
</style>