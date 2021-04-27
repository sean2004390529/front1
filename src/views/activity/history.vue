<template>
  <div class="app-container">
    
    <!-- 功能键 -->
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="getList">
        刷新
      </el-button>
    </div>

    <!-- 各申请-->
    <el-tabs v-model="activeTask" @tab-click="handleTaskClick">
      <!-- 请假 Tab -->
      <el-tab-pane label="请假" name="leave">
        <el-table
          :key="leaveTableKey"
          v-loading="listLoading"
          :data="leaveList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @cell-click="leaveCellClick"
        >
          <el-table-column label="序号" sortable align="center" width="80">
            <template slot-scope="{row, $index}">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="left" >
            <template slot-scope="{row}">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="请假类型" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag :type="row.type | leaveTypeColor">
                {{ row.type | leaveTypeFilter }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="请假天数" width="80">
            <template slot-scope="{row}">
              <span>{{ row.leaveDays }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始于"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.startDate | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束于" align="center">
            <template slot-scope="{row}">
              <span>{{ row.endDate | formatDate }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.status | statusColor">
                {{ row.status | statusFilter }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 加班 Tab-->
      <el-tab-pane label="加班" name="ot">
        <el-table
          :key="OTTableKey"
          v-loading="listLoading"
          :data="OTList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @cell-click="OTCellClick"
        >
          <el-table-column label="序号" sortable align="center" width="80">
            <template slot-scope="{row, $index}">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="left" >
            <template slot-scope="{row}">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="加班类型" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag :type="row.type | otTypeColor">
                {{ row.type | otTypeFilter }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="加班小时数" width="100">
            <template slot-scope="{row}">
              <span>{{ row.hours }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始于"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.startDate | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束于" align="center">
            <template slot-scope="{row}">
              <span>{{ row.endDate | formatDate }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.status | statusColor">
                {{ row.status | statusFilter }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 直行直归 Tab -->
      <el-tab-pane label="直行直归" name="absent">
        <el-table
          :key="absentTableKey"
          v-loading="listLoading"
          :data="absentList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @cell-click="absentCellClick"
        >
          <el-table-column label="序号" sortable align="center" width="80">
            <template slot-scope="{row, $index}">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="left" >
            <template slot-scope="{row}">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag :type="row.type | absentTypeColor">
                {{ row.type | absentTypeFilter }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="日期"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.absentDate | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.status | statusColor">
                {{ row.status | statusFilter }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 迟到早退 Tab -->
      <el-tab-pane label="迟到早退" name="late">
        <el-table
          :key="lateTableKey"
          v-loading="listLoading"
          :data="lateList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @cell-click="lateCellClick"
        >
          <el-table-column label="序号" sortable align="center" width="80">
            <template slot-scope="{row, $index}">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="left" >
            <template slot-scope="{row}">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag :type="row.type | lateTypeColor">
                {{ row.type | lateTypeFilter }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="日期"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.lateDate | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分钟数" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.mins }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.status | statusColor">
                {{ row.status | statusFilter }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 交通费报销 Tab -->
      <el-tab-pane label="交通费报销" name="traffic">
        <el-table
          :key="trafficTableKey"
          v-loading="listLoading"
          :data="trafficList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @cell-click="trafficCellClick"
        >
          <el-table-column label="序号" sortable align="center" width="80">
            <template slot-scope="{row, $index}">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="left" >
            <template slot-scope="{row}">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报销金额" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请日期"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.createTime | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.status | statusColor">
                {{ row.status | statusFilter }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 出差报销 Tab -->
      <el-tab-pane label="出差报销" name="trip">
        <el-table
          :key="tripTableKey"
          v-loading="listLoading"
          :data="tripList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @cell-click="tripCellClick"
        >
          <el-table-column label="序号" sortable align="center" width="80">
            <template slot-scope="{row, $index}">
              <span>{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="left" >
            <template slot-scope="{row}">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="目的地" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.destination }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报销金额" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="目的" align="center" >
            <template slot-scope="{row}">
              <span>{{ row.reason }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始于"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.startDate | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束于"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.endDate | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" sortable class-name="status-col" >
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.status | statusColor">
                {{ row.status | statusFilter }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>

    <!-- 分页 -->
    <Pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />


    <!-- 请假单 回显-->
    <el-dialog :title="请假单" :visible.sync="leaveFormVisible" >
      <el-form ref="leaveDataForm" :model="leaveTemp" label-position="left" label-width="100px">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="leaveFormVisible = false">取消</el-button>
    </el-dialog>

    <!-- 加班单 回显 -->
    <el-dialog :title="加班单" :visible.sync="otFormVisible" >
      <el-form ref="dataForm" :model="OTTemp" label-position="left" label-width="100px">
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

      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="otFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 直行直归单 回显 -->
    <el-dialog :title="直行直归单" :visible.sync="absentFormVisible" >
      <el-form ref="dataForm" :model="absentTemp" label-position="left" label-width="100px">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="absentFormVisible = false">取消</el-button>
    </el-dialog>

    <!-- 迟到早退单 回显 -->
    <el-dialog :title="迟到早退" :visible.sync="lateFormVisible" >
      <el-form ref="dataForm" :model="lateTemp" label-position="left" label-width="100px">
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

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lateFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 交通费报销 回显-->
    <el-dialog :title="交通费报销" :visible.sync="trafficFormVisible" fullscreen>
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

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="trafficFormVisible = false">取消</el-button>
    </el-dialog>

    <!-- 出差报销单 编辑框 -->
    <el-dialog :title="出差报销单" :visible.sync="tripFormVisible" fullscreen>
      <el-form ref="dataForm" :model="tripTemp" label-position="left" label-width="70px">
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

  </div>
</template>

<script>
import { getComment } from '@/api/activiti/comment'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'
import { fetchLeaveHistory, showLeaveInfo } from '@/api/activiti/process/leave'
import { fetchOTHistory, showOTInfo } from '@/api/activiti/process/ot'
import { fetchAbsentHistory, showAbsentInfo } from '@/api/activiti/process/absent'
import { fetchLateHistory, showLateInfo } from '@/api/activiti/process/late'
import { fetchTrafficHistory, showTrafficInfo } from '@/api/activiti/process/traffic'
import { showTrafficfeeInfo } from '@/api/activiti/process/trafficfee'
import { fetchTripHistory, showTripInfo } from '@/api/activiti/process/trip'
import { showTripfeeInfo } from '@/api/activiti/process/tripfee'

export default {
  name: 'History',
  components: { Pagination },
  filters: {
    formatDate(time) {
      return formatDate(time)
    },
    leaveTypeColor(type) {
      const typeMap = ['info','warning', 'info','info','info','info','warning','warning']
      return typeMap[type]
    },
    leaveTypeFilter(type) {
      const typeMap = ['年假','病假','换休','产假','婚假','丧假','事假','其他']
      return typeMap[type]
    },
    otTypeColor(type) {
      const ottypeMap = ['info','success','warning','info']
      return ottypeMap[type]
    },
    otTypeFilter(type) {
      const ottypeMap = ['平日','周末','节假日','其他']
      return ottypeMap[type]
    },
    absentTypeColor(type) {
      const ottypeMap = ['info','info','success']
      return ottypeMap[type]
    },
    absentTypeFilter(type) {
      const ottypeMap = ['直行','直归','直行直归']
      return ottypeMap[type]
    },
    lateTypeColor(type) {
      const latetypeMap = ['success','warning']
      return latetypeMap[type]
    },
    lateTypeFilter(type) {
      const latetypeMap = ['迟到','早退']
      return latetypeMap[type]
    },
    statusColor(status) {
      const statusMap = ['info','info', 'success','warning']
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = ['未提交','审批中','已通过','取消']
      return statusMap[status]
    },
  },
  data() {
    return {
      total: 0,
      activeTask: 'leave',
      listQuery: {
        pageNum: 1,
        pageSize: 20
      },
      leaveTableKey: 0,
      OTTableKey: 1,
      absentTableKey: 2,
      lateTableKey: 3,
      trafficTableKey: 4,
      tripTableKey: 5,
      listLoading: true,
      leaveList: [],
      OTList: [],
      absentList: [],
      lateList: [],
      trafficList: [],
      tripList: [],
      leaveFormVisible: false,
      otFormVisible: false,
      absentFormVisible: false,
      lateFormVisible: false,
      trafficFormVisible: false,
      tripFormVisible: false,
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
      },
      absentTemp: {
        id: undefined,
        taskId: undefined,
        processInstanceId: undefined,
        title: undefined,
        absentDate: undefined,
        empName: undefined,
        reason: undefined
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
      },
      tripTemp: {
        id: undefined,
        taskId: undefined,
        processInstanceId: undefined,
        title: undefined,
        days: undefined,
        reason: undefined,
        empName: undefined,
      },
      trafficfeeTemp: {
        trafficList: []
      },
      tripfeeTemp: {
        tripList: []
      },
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
      if(this.activeTask=='leave'){
        fetchLeaveHistory(this.listQuery).then(response => {
          this.leaveList = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      }else if(this.activeTask=='ot'){
        fetchOTHistory(this.listQuery).then(response => {
          this.OTList = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      }else if(this.activeTask=='absent'){
        fetchAbsentHistory(this.listQuery).then(response => {
          this.absentList = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      }else if(this.activeTask=='late'){
        fetchLateHistory(this.listQuery).then(response => {
          this.lateList = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      }else if(this.activeTask=='traffic'){
        fetchTrafficHistory(this.listQuery).then(response => {
          this.trafficList = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      }else if(this.activeTask=='trip'){
        fetchTripHistory(this.listQuery).then(response => {
          this.tripList = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      }
    },
    handleTaskClick(tab){
      this.activeTask = tab.name
      this.getList()
    },
    leaveCellClick(row){
      getComment(row.instanceId).then( res => {
        this.commentData = res.data
      })
      showLeaveInfo(row.id).then( res => {
        this.leaveTemp = Object.assign({}, res.data) // copy obj
        this.leaveTemp.type = this.leaveTemp.type.toString()
        this.leaveFormVisible = true
      })
    },
    OTCellClick(row){
      getComment(row.instanceId).then( res => {
        this.commentData = res.data
      })
      showOTInfo(row.id).then( res => {
        this.OTTemp = Object.assign({}, res.data) // copy obj
        this.OTTemp.type = this.OTTemp.type.toString()
        this.otFormVisible = true
      })
    },
    absentCellClick(row){
      getComment(row.instanceId).then( res => {
        this.commentData = res.data
      })
      showAbsentInfo(row.id).then( res => {
        this.absentTemp = Object.assign({}, res.data) // copy obj
        this.absentTemp.type = this.absentTemp.type.toString()
        this.absentFormVisible = true
      })
    },
    lateCellClick(row){
      getComment(row.instanceId).then( res => {
        this.commentData = res.data
      })
      showLateInfo(row.id).then( res => {
        this.lateTemp = Object.assign({}, res.data) // copy obj
        this.lateTemp.type = this.lateTemp.type.toString()
        this.lateFormVisible = true
      })
    },
    trafficCellClick(row){
      getComment(row.instanceId).then( res => {
        this.commentData = res.data
      })
      showTrafficInfo(row.id).then( res => {
        this.trafficTemp = Object.assign({}, res.data) // copy obj
        this.trafficFormVisible = true
      })
      showTrafficfeeInfo(row.id).then( res =>{
        this.trafficfeeTemp.trafficList = res.data
        this.trafficfeeTemp.trafficList.forEach( item =>{
          item.type = item.type.toString()
        })
      })
    },
    tripCellClick(row){
      getComment(row.instanceId).then( res => {
        this.commentData = res.data
      })
      showTripInfo(row.id).then( res => {
        this.tripTemp = Object.assign({}, res.data) // copy obj
        this.tripFormVisible = true
      })
      showTripfeeInfo(row.id).then( res =>{
        this.tripfeeTemp.tripList = res.data
      })
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 10px;
  }
</style>