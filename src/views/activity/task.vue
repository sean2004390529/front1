<template>
  <div  class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="getList">
        刷新
      </el-button>
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
      <el-table-column label="序号" sortable align="center" width="90px">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请单" prop="name" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申请单号" prop="businessKey" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.businessKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createDate | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待处理人" prop="assignee" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.assignee | formatAssignee }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" align="center" class-name="small-padding fixed-width">
        <template  slot-scope="{row,$index}">
          <div v-if="row.selfRequest">
            <el-tag @click.stop="approveRequest(row,'tag')" type="success" >提交</el-tag>
            <el-tag @click.stop="rejectRequest(row,'tag')" type="warning" >放弃</el-tag>
            <el-tag @click.stop="showInfo(row)" type="success" >查看</el-tag>
          </div>
          <div v-else>
            <el-tag @click.stop="approveRequest(row,'tag')" type="success" >批准</el-tag>
            <el-tag @click.stop="returnRequest(row,'tag')" type="warning" >退回</el-tag>
            <el-tag @click.stop="rejectRequest(row,'tag')" type="danger" >拒绝</el-tag>
            <el-tag @click.stop="showInfo(row)" type="success" >查看</el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 请假单 编辑框 -->
    <el-dialog :title="请假单" :visible.sync="leaveFormVisible" >
      <el-form ref="dataForm" :model="leaveTemp" label-position="left" label-width="80px">
        <el-form-item label="taskId" hidden>
          <el-input v-model="leaveTemp.taskId" disabled />
        </el-form-item>
        <el-form-item label="ID" hidden>
          <el-input v-model="leaveTemp.id" disabled />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="11">
             <el-form-item label="休假" >
              <el-select v-model="leaveTemp.type" disabled>
                <el-option label="年假" value="0" />
                <el-option label="病假" value="1" />
                <el-option label="换休" value="2" />
                <el-option label="产假" value="3" />
                <el-option label="婚假" value="4" />
                <el-option label="丧假" value="5" />
                <el-option label="事假" value="6" />
                <el-option label="其他" value="7" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="请假天数" >
              <el-input v-model="leaveTemp.leaveDays" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="开始于">
              <el-date-picker
                v-model="leaveTemp.startDate"
                type="datetime" disabled >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="结束于">
              <el-date-picker
                v-model="leaveTemp.endDate"
                type="datetime" disabled >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="请假理由" >
          <el-input v-model="leaveTemp.reason" disabled />
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


        <el-form-item label="批注" >
          <el-input v-model="leaveTemp.comment" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="selfRequest">
          <el-button type="primary" @click="approveRequest(leaveTemp,'button','leave')">提交</el-button>
          <el-button type="warning" @click="rejectRequest(leaveTemp,'button','leave')">放弃</el-button>
          <el-button @click="leaveFormVisible = false">取消</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="approveRequest(leaveTemp,'button','leave')">批准</el-button>
          <el-button type="warning" @click="returnRequest(leaveTemp,'button','leave')">退回</el-button>
          <el-button type="danger" @click="rejectRequest(leaveTemp,'button','leave')">拒绝</el-button>
          <el-button @click="leaveFormVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 加班单 编辑框 -->
    <el-dialog :title="加班单" :visible.sync="OTFormVisible" >
      <el-form ref="dataForm" :model="OTTemp" label-position="left" label-width="80px">
        <el-form-item label="ID" hidden >
          <el-input v-model="OTTemp.id" disabled />
        </el-form-item>
        <el-form-item label="taskId" hidden >
          <el-input v-model="OTTemp.taskId" disabled />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="加班类型" >
              <el-select v-model="OTTemp.type" disabled>
                <el-option label="平日" value="0" />
                <el-option label="周末" value="1" />
                <el-option label="节假日" value="2" />
                <el-option label="其他" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="加班小时数" >
              <el-input v-model="OTTemp.hours" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="开始于">
              <el-date-picker
                v-model="OTTemp.startDate"
                type="datetime" disabled >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="结束于">
              <el-date-picker
                v-model="OTTemp.endDate"
                type="datetime" disabled >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="加班理由" >
          <el-input v-model="OTTemp.reason" disabled />
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

        <el-form-item label="批注" >
          <el-input v-model="OTTemp.comment" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="selfRequest">
          <el-button type="primary" @click="approveRequest(OTTemp,'button')">提交</el-button>
          <el-button type="warning" @click="rejectRequest(OTTemp,'button')">放弃</el-button>
          <el-button @click="OTFormVisible = false">取消</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="approveRequest(OTTemp,'button')">批准</el-button>
          <el-button type="warning" @click="returnRequest(OTTemp,'button')">退回</el-button>
          <el-button type="danger" @click="rejectRequest(OTTemp,'button')">拒绝</el-button>
          <el-button @click="OTFormVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    
    <!-- 直行直归单 编辑框 -->
    <el-dialog :title="直行直归单" :visible.sync="absentFormVisible" >
      <el-form ref="dataForm" :model="absentTemp" label-position="left" label-width="80px">
        <el-form-item label="taskId" hidden >
          <el-input v-model="absentTemp.taskId" disabled />
        </el-form-item>
        <el-form-item label="ID" hidden >
          <el-input v-model="absentTemp.id" disabled />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="类型" >
              <el-select v-model="absentTemp.type" disabled>
                <el-option label="直行" value="0" />
                <el-option label="直归" value="1" />
                <el-option label="直行直归" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="日期" >
              <el-input v-model="absentTemp.absentDate" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="理由" >
          <el-input v-model="absentTemp.reason" disabled />
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


        <el-form-item label="批注" >
          <el-input v-model="absentTemp.comment" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="selfRequest">
          <el-button type="primary" @click="approveRequest(absentTemp,'button')">提交</el-button>
          <el-button type="warning" @click="rejectRequest(absentTemp,'button')">放弃</el-button>
          <el-button @click="absentFormVisible = false">取消</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="approveRequest(absentTemp,'button')">批准</el-button>
          <el-button type="warning" @click="returnRequest(absentTemp,'button')">退回</el-button>
          <el-button type="danger" @click="rejectRequest(absentTemp,'button')">拒绝</el-button>
          <el-button @click="absentFormVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 迟到早退单 编辑框 -->
    <el-dialog :title="迟到早退" :visible.sync="lateFormVisible" >
      <el-form ref="dataForm" :model="lateTemp" label-position="left" label-width="80px">
        <el-form-item label="taskId" hidden >
          <el-input v-model="lateTemp.taskId" disabled />
        </el-form-item>
        <el-form-item label="ID" hidden >
          <el-input v-model="lateTemp.id" disabled />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="迟到、早退">
              <el-select v-model="lateTemp.type" disabled >
                <el-option label="迟到" value="0" />
                <el-option label="早退" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="日期" >
              <el-input v-model="lateTemp.lateDate" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="理由" >
          <el-input v-model="lateTemp.reason" disabled />
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


        <el-form-item label="批注" >
          <el-input v-model="lateTemp.comment" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="selfRequest">
          <el-button type="primary" @click="approveRequest(lateTemp,'button')">提交</el-button>
          <el-button type="warning" @click="rejectRequest(lateTemp,'button')">放弃</el-button>
          <el-button @click="lateFormVisible = false">取消</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="approveRequest(lateTemp,'button')">批准</el-button>
          <el-button type="warning" @click="returnRequest(lateTemp,'button')">退回</el-button>
          <el-button type="danger" @click="rejectRequest(lateTemp,'button')">拒绝</el-button>
          <el-button @click="lateFormVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 交通报销单 编辑框 -->
    <el-dialog :title="交通报销单" :visible.sync="trafficFormVisible" fullscreen>
      <el-form ref="dataForm" :model="trafficTemp" label-position="left" label-width="80px">
        <el-form-item label="taskId" hidden>
          <el-input v-model="trafficTemp.taskId" disabled />
        </el-form-item>
        <el-form-item label="ID" hidden>
          <el-input v-model="trafficTemp.id" disabled />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="标题" label-width="40px">
              <el-input v-model="trafficTemp.title" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="备注" label-width="40px">
              <el-input v-model="trafficTemp.remark" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="月份" label-width="40px">
              <el-date-picker v-model="trafficTemp.month" type="month" disabled ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="报销金额" label-width="80px">
              <el-input v-model="trafficTemp.amount" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 滚动条 -->
        <el-form-item label="交通费" size="medium">
          <!-- 分隔条 -->
          <el-row :gutter="20">
            <el-col :span="0.5">
            </el-col>
            <el-col :span="4">
              <el-divider direction="vertical"></el-divider>
              <span>日期</span>
            </el-col>
            <el-col :span="4">
              <el-divider direction="vertical"></el-divider>
              <span>出发地</span>
            </el-col>
            <el-col :span="4">
              <el-divider direction="vertical"></el-divider>
              <span>目的地</span>
            </el-col>
            <el-col :span="4">
              <el-divider direction="vertical"></el-divider>
              <span>原因</span>
            </el-col>
            <el-col :span="3">
              <el-divider direction="vertical"></el-divider>
              <span>费用类型</span>
            </el-col>
          </el-row>
            
          <el-row :key="i" v-for="i in trafficfeeTemp.trafficList.length" class="infinite-list-item" :model="trafficfeeTemp.trafficList" :gutter="5" >
            <el-col :span="0.5" >
              <span>{{i}}<span>
            </el-col>
            <el-col :span="4" >
              <el-date-picker v-model="trafficfeeTemp.trafficList[i-1].feeDate" placeholder="选择日期" type="date" disabled/>
            </el-col>
            <el-col :span="4" >
              <el-input v-model="trafficfeeTemp.trafficList[i-1].from" placeholder="出发地" disabled ></el-input>
            </el-col>
            <el-col :span="4" >
              <el-input v-model="trafficfeeTemp.trafficList[i-1].to" placeholder="目的地" disabled ></el-input>
            </el-col>
            <el-col :span="4" >
              <el-input v-model="trafficfeeTemp.trafficList[i-1].reason" placeholder="原因" disabled></el-input>
            </el-col>
            <el-col :span="3" >
              <el-select v-model="trafficfeeTemp.trafficList[i-1].type" placeholder="费用类型" disabled>
                <el-option label="全部" value="0" />
                <el-option label="车费" value="1" />
                <el-option label="高速费" value="2" />
                <el-option label="停车费" value="3" />
                <el-option label="其他" value="4" />
              </el-select>
            </el-col>
            <el-col :span="3" class="marginLeft">
              <el-input v-model="trafficfeeTemp.trafficList[i-1].fee" disabled></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="批注信息" label-width="80px">
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

        <el-form-item label="批注" >
          <el-input v-model="trafficTemp.comment" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="selfRequest">
          <el-button type="primary" @click="approveRequest(trafficTemp,'button','traffic')">提交</el-button>
          <el-button type="warning" @click="rejectRequest(trafficTemp,'button','traffic')">放弃</el-button>
          <el-button @click="trafficFormVisible = false">取消</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="approveRequest(trafficTemp,'button','traffic')">批准</el-button>
          <el-button type="warning" @click="returnRequest(trafficTemp,'button','traffic')">退回</el-button>
          <el-button type="danger" @click="rejectRequest(trafficTemp,'button','traffic')">拒绝</el-button>
          <el-button @click="trafficFormVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 出差报销单 编辑框 -->
    <el-dialog :title="出差报销单" :visible.sync="tripFormVisible" fullscreen>
      <el-form ref="dataForm" :model="tripTemp" label-position="left" label-width="70px">
        <el-form-item label="taskId" hidden>
          <el-input v-model="tripTemp.taskId" disabled />
        </el-form-item>
        <el-form-item label="ID" hidden>
          <el-input v-model="tripTemp.id" disabled />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="标题" >
              <el-input v-model="tripTemp.title" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目的地" >
              <el-input v-model="tripTemp.destination" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item label="报销金额" >
              <el-input v-model="tripTemp.amount" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="出差于">
              <el-date-picker
                v-model="tripTemp.startDate"
                type="datetime" disabled >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束于">
              <el-date-picker
                v-model="tripTemp.endDate"
                type="datetime" disabled >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="天数" >
              <el-input v-model="tripTemp.days" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 滚动条 -->
        <el-form-item label="交通费" size="medium">
          <el-row :gutter="20">
            <el-col :span="0.5">
            </el-col>
            <el-col :span="3">
              <el-divider direction="vertical"></el-divider>
              <span>日期</span>
            </el-col>
            <el-col :span="3">
              <el-divider direction="vertical"></el-divider>
              <span>地点/酒店</span>
            </el-col>
            <el-col :span="3">
              <el-divider direction="vertical"></el-divider>
              <span>酒店费用</span>
            </el-col>
            <el-col :span="3">
              <el-divider direction="vertical"></el-divider>
              <span>飞机高铁费用</span>
            </el-col>
            <el-col :span="3">
              <el-divider direction="vertical"></el-divider>
              <span>的士交通费用</span>
            </el-col>
            <el-col :span="3">
              <el-divider direction="vertical"></el-divider>
              <span>补贴</span>
            </el-col>
            <el-col :span="3">
              <el-divider direction="vertical"></el-divider>
              <span>其他费用</span>
            </el-col>
          </el-row>

          <el-row :key="i" v-for="i in tripfeeTemp.tripList.length" class="infinite-list-item" :model="tripfeeTemp.tripList" :gutter="5" >
            <el-col :span="0.5" >
              <span>{{i}}<span>
            </el-col>
            <el-col :span="3" >
              <el-date-picker v-model="tripfeeTemp.tripList[i-1].tripDate" type="date" disabled/>
            </el-col>
            <el-col :span="3" >
              <el-input v-model="tripfeeTemp.tripList[i-1].destination" disabled ></el-input>
            </el-col>
            <el-col :span="3" >
              <el-input v-model="tripfeeTemp.tripList[i-1].hotelFee" disabled ></el-input>
            </el-col>
            <el-col :span="3" >
              <el-input v-model="tripfeeTemp.tripList[i-1].airportFee" disabled ></el-input>
            </el-col>
            <el-col :span="3" >
              <el-input v-model="tripfeeTemp.tripList[i-1].taxiFee" disabled ></el-input>
            </el-col>
            <el-col :span="3" >
              <el-input v-model="tripfeeTemp.tripList[i-1].allowance" disabled ></el-input>
            </el-col>
            <el-col :span="3" >
              <el-input v-model="tripfeeTemp.tripList[i-1].otherFee" disabled ></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="批注信息" label-width="80px">
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

        <el-form-item label="批注" >
          <el-input v-model="tripTemp.comment" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="selfRequest">
          <el-button type="primary" @click="approveRequest(tripTemp,'button','trip')">提交</el-button>
          <el-button type="warning" @click="rejectRequest(tripTemp,'button','trip')">放弃</el-button>
          <el-button @click="tripFormVisible = false">取消</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="approveRequest(tripTemp,'button','trip')">批准</el-button>
          <el-button type="warning" @click="returnRequest(tripTemp,'button','trip')">退回</el-button>
          <el-button type="danger" @click="rejectRequest(tripTemp,'button','trip')">拒绝</el-button>
          <el-button @click="tripFormVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 出差预申请 编辑框 -->
    <el-dialog :title="出差预申请" :visible.sync="pretripFormVisible" fullscreen>
      <el-form ref="dataForm" :model="pretripTemp" label-position="left" label-width="80px">
        <el-form-item label="taskId" hidden >
          <el-input v-model="pretripTemp.taskId" disabled />
        </el-form-item>
        <el-form-item label="ID" hidden >
          <el-input v-model="pretripTemp.id" disabled />
        </el-form-item>
        
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


        <el-form-item label="批注" >
          <el-input v-model="pretripTemp.comment" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="selfRequest">
          <el-button type="primary" @click="approveRequest(pretripTemp,'button')">提交</el-button>
          <el-button type="warning" @click="rejectRequest(pretripTemp,'button')">放弃</el-button>
          <el-button @click="pretripFormVisible = false">取消</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="approveRequest(pretripTemp,'button')">批准</el-button>
          <el-button type="warning" @click="returnRequest(pretripTemp,'button')">退回</el-button>
          <el-button type="danger" @click="rejectRequest(pretripemp,'button')">拒绝</el-button>
          <el-button @click="pretripFormVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList } from '@/api/activiti/task'
import { getComment } from '@/api/activiti/comment'
import { formatDate, formatAssignee, parseTime } from '@/utils'
import { showLeaveInfo,approveLeaveRequest, returnLeaveRequest, rejectLeaveRequest } from '@/api/activiti/process/leave'
import { showOTInfo,approveOTRequest, returnOTRequest, rejectOTRequest } from '@/api/activiti/process/ot'
import { showAbsentInfo,approveAbsentRequest, returnAbsentRequest, rejectAbsentRequest } from '@/api/activiti/process/absent'
import { showLateInfo,approveLateRequest, returnLateRequest, rejectLateRequest } from '@/api/activiti/process/late'
import { showTrafficInfo,approveTrafficRequest, returnTrafficRequest, rejectTrafficRequest } from '@/api/activiti/process/traffic'
import { showTrafficfeeInfo } from '@/api/activiti/process/trafficfee'
import { showTripInfo, approveTripRequest, returnTripRequest, rejectTripRequest } from '@/api/activiti/process/trip'
import { showTripfeeInfo } from '@/api/activiti/process/tripfee'
import { showPretripInfo, approvePretripRequest, returnPretripRequest, rejectPretripRequest } from '@/api/activiti/process/pretrip'

export default {
  name: 'ActivitiTask',
  filters: {
    formatDate(time) {
      return formatDate(time)
    },
    formatAssignee(name) {
      return formatAssignee(name)
    }
  },
  data() {
    return {
      listLoading: true,
      list: null,
      temp: {
        id: '',
        approve: '',
        businessKey: ''
      },
      leaveFormVisible: false,
      OTFormVisible: false,
      absentFormVisible: false,
      lateFormVisible: false,
      trafficFormVisible: false,
      tripFormVisible: false,
      pretripFormVisible: false,
      dialogStatus: '',
      leaveTemp: {
        id: undefined,
        taskId: undefined,
        processInstanceId: undefined,
        title: undefined,
        startDate: undefined,
        endDate: undefined,
        leaveDays: undefined,
        empName: undefined,
        reason: undefined,
        comment: undefined
      },
      OTTemp: {
        id: undefined,
        taskId: undefined,
        processInstanceId: undefined,
        title: undefined,
        hours: undefined,
        startDate: undefined,
        endDate: undefined,
        empName: undefined,
        reason: undefined,
        comment: undefined
      },
      absentTemp: {
        id: undefined,
        taskId: undefined,
        processInstanceId: undefined,
        title: undefined,
        absentDate: undefined,
        empName: undefined,
        reason: undefined,
        comment: undefined
      },
      lateTemp: {
        id: undefined,
        taskId: undefined,
        processInstanceId: undefined,
        title: undefined,
        lateDate: undefined,
        empName: undefined,
        reason: undefined,
        comment: undefined
      },
      trafficTemp: {
        id: undefined,
        taskId: undefined,
        processInstanceId: undefined,
        title: undefined,
        month: undefined,
        remark: undefined,
        empName: undefined,
        comment: undefined
      },
      tripTemp: {
        id: undefined,
        taskId: undefined,
        processInstanceId: undefined,
        title: undefined,
        destination: undefined,
        startDate: undefined,
        endDate: undefined,
        reason: undefined,
        amount: undefined,
        empName: undefined,
        comment: undefined
      },
      pretripTemp: {
        id: undefined,
        taskId: undefined,
        processInstanceId: undefined,
        title: undefined,
        destination: undefined,
        startDate: undefined,
        endDate: undefined,
        reason: undefined,
        amount: undefined,
        empName: undefined,
        comment: undefined
      },
      trafficfeeTemp: {
        trafficList: []
      },
      tripfeeTemp: {
        tripList: []
      },
      selfRequest: false,
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
      fetchList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    resetStatus(){
      this.leaveFormVisible = false
      this.OTFormVisible = false
      this.absentFormVisible = false
      this.lateFormVisible = false,
      this.trafficFormVisible = false,
      this.tripFormVisible = false,
      this.pretripFormVisible = false,
      this.selfRequest = false
      this.commentTemp = {
        taskId: undefined,
        comment: undefined,
        key: undefined
      }
    },
    showInfo(row){
      let key = row.businessKey.split(":")[0]
      let id = row.businessKey.split(":")[1]
      getComment(row.processInstanceId).then( res => {
        this.commentData = res.data
      })
      if(key=='leaveProcess'){ //这里已经可以使用constant
        showLeaveInfo(id).then( res => {
          this.leaveTemp = Object.assign({}, res.data) // copy obj
          this.leaveTemp.taskId = row.id
          this.leaveTemp.type = this.leaveTemp.type.toString()
          this.selfRequest = row.selfRequest
          this.commentTemp.key = 'leaveProcess'
          this.leaveFormVisible = true
        })
      }else if(key=='otProcess'){
        showOTInfo(id).then( res => {
          this.OTTemp = Object.assign({}, res.data) // copy obj
          this.OTTemp.taskId = row.id
          this.OTTemp.type = this.OTTemp.type.toString()
          this.selfRequest = row.selfRequest
          this.commentTemp.key = 'otProcess'
          this.OTFormVisible = true
        })
      }else if(key=='absentProcess'){
        showAbsentInfo(id).then( res => {
          this.absentTemp = Object.assign({}, res.data) // copy obj
          this.absentTemp.taskId = row.id
          this.absentTemp.type = this.absentTemp.type.toString()
          this.selfRequest = row.selfRequest
          this.commentTemp.key = 'absentProcess'
          this.absentFormVisible = true
        })
      }else if(key=='lateProcess'){
        showLateInfo(id).then( res => {
          this.lateTemp = Object.assign({}, res.data) // copy obj
          this.lateTemp.taskId = row.id
          this.lateTemp.type = this.lateTemp.type.toString()
          this.selfRequest = row.selfRequest
          this.commentTemp.key = 'lateProcess'
          this.lateFormVisible = true
        })
      }else if(key=='trafficProcess'){
        showTrafficInfo(id).then( res => {
          this.trafficTemp = Object.assign({}, res.data) // copy obj
          this.trafficTemp.taskId = row.id
          this.selfRequest = row.selfRequest
          this.commentTemp.key = 'trafficProcess'
          this.trafficFormVisible = true
        })
        showTrafficfeeInfo(id).then( res =>{
          this.trafficfeeTemp.trafficList = res.data
          this.trafficfeeTemp.trafficList.forEach( item =>{
            item.type = item.type.toString()
          })
        })
      }else if(key=='tripProcess'){
        showTripInfo(id).then( res => {
          this.tripTemp = Object.assign({}, res.data) // copy obj
          this.tripTemp.taskId = row.id
          this.selfRequest = row.selfRequest
          this.commentTemp.key = 'tripProcess'
          this.tripFormVisible = true
        })
        showTripfeeInfo(id).then( res =>{
          console.log("showTripfeeInfo", res)
          this.tripfeeTemp.tripList = res.data
          console.log("tripList", this.tripfeeTemp.tripList)
        })
      }else if(key=='com1PretripProcess'){
        showPretripInfo(id).then( res => {
          this.pretripTemp = Object.assign({}, res.data) // copy obj
          this.pretripTemp.taskId = row.id
          this.selfRequest = row.selfRequest
          this.commentTemp.key = 'com1PretripProcess'
          this.pretripFormVisible = true
        })
      }
    },
    handleCellClick(row){
      this.showInfo(row)
    },
    handleRequest(row, tag){
      console.log("handleRequest", row, tag)
      if(tag=='button'){
        this.commentTemp.taskId = row.taskId
        this.commentTemp.comment = row.comment
      }else if(tag='tag'){
        this.commentTemp.taskId = row.id
        this.commentTemp.key = row.businessKey.split(":")[0]
      }
    },
    approveRequest(row, tag){
      this.handleRequest(row, tag)
      let key = this.commentTemp.key
      if(key=='leaveProcess'){
        approveLeaveRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='otProcess'){
        approveOTRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='absentProcess'){
        approveAbsentRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='lateProcess'){
        approveLateRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='trafficProcess'){
        approveTrafficRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='trafficProcess'){
        approveTrafficRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='tripProcess'){
        approveTripRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='com1PretripProcess'){
        approvePretripRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }
    },
    returnRequest(row, tag) {
      this.handleRequest(row, tag)
      let key = this.commentTemp.key
      if(key=='leaveProcess'){
        returnLeaveRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '退回成功!'
          })
        })
        this.resetStatus()
      }else if(key=='otProcess'){
        returnOTRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='absentProcess'){
        returnAbsentRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='lateProcess'){
        returnLateRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='trafficProcess'){
        returnTrafficRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='tripProcess'){
        returnTripRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='com1PretripProcess'){
        returnPretripRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }
    },
    rejectRequest(row, tag, taskType){
      this.handleRequest(row,tag, taskType)
      let key = this.commentTemp.key
      if(key=='leaveProcess'){
        rejectLeaveRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '放弃申请!'
          })
        })
        this.resetStatus()
      }else if(key=='otProcess'){
        rejectOTRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='absentProcess'){
        rejectAbsentRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='lateProcess'){
        rejectLateRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='trafficProcess'){
        rejectTrafficRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='tripProcess'){
        rejectTripRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }else if(key=='com1PretripProcess'){
        rejectPretripRequest(this.commentTemp).then(() =>{
          this.getList()
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        })
        this.resetStatus()
      }
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 10px;
  }

</style>