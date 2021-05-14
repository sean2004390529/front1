<template>
  <div>
    <el-row :gutter="10">

        <!-- <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
          <a href="https://seancloud.tech:8000/#/todo/todo" >
            <div class="grid-content bg-purple" >
                <i class="el-icon-edit icon"></i>
                <el-link type="info" class="link" :underline="false">
                    Todo待办
                </el-link>
            </div>
          </a>
        </el-col> -->

        <!-- <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
          <a href="https://seancloud.tech:8000/#/stock/reuse" >
            <div class="grid-content bg-purple-light">
                <i class="el-icon-s-goods icon"></i>
                <el-link type="info" class="link" :underline="false">
                    物品管理
                </el-link>
            </div>
          </a>
        </el-col> -->

        <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
          <a href="https://seancloud.tech:8000/#/calendar/calendar" >
            <div class="grid-content bg-purple">
                <i class="el-icon-date icon"></i>
                <el-link type="info" class="link" :underline="false">
                    日程管理
                </el-link>
            </div>
          </a>
        </el-col>

        <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
          <a href="https://seancloud.tech:8000/#/activity/process/pretrip" >
            <div class="grid-content bg-purple">
                <i class="el-icon-message icon"></i>
                <el-link type="info" class="link" :underline="false">
                    出差申请
                </el-link>
            </div>
          </a>
        </el-col>

        <!-- <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
          <a href="https://seancloud.tech:8000/#/basic/emp" > 
            <div class="grid-content bg-purple-light">
                <i class="el-icon-s-custom icon"></i>
                <el-link type="info" class="link" :underline="false">
                    后台管理
                </el-link>
            </div>
          </a>
        </el-col> -->
        
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Dashboard"
}
</script>

<style>
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
    margin-left: 10px;
    margin-top: 10px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 100px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .icon {
    font-size: 80px;
    line-height: 100px;
  }
  .link {
    font-size: 20px;
  }
</style>