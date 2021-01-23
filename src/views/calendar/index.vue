<template>
  <div>

    <div class="calendar">
        <FullCalendar ref="myCalendar" :options="calendarOptions" />
    </div>


<!-- 编辑框 -->
    <el-dialog title="日程" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="event" label-position="left" label-width="80px">

        <el-form-item label="ID" prop="id" hidden>
          <el-input v-model="event.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="日程名称">
          <el-input v-model="event.title" placeholder="请填写日程内容"></el-input>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-col :span="11">
            <el-date-picker type="datetime" placeholder="开始日期" v-model="event.start" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2"></el-col>
          <el-col :span="11">
            <el-date-picker type="datetime" placeholder="结束日期" v-model="event.end" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="事件">
          <el-select v-model="event.backgroundColor" placeholder="请选择事件">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" v-if="addingMode">
          <el-button type="primary" @click="addNewEvent">创建日程</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
          <el-button type="primary" @click="updateEvent">更新</el-button>
          <el-button type="danger" @click="handleDelete">删除日程</el-button>
          <el-button @click="cancelEvent">取消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { fetchList, createEvent,  updateEvent, deleteEvent } from '@/api/calendar'

import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

export default {
  name: 'MaintenanceCalendarview',
  components: {
    FullCalendar
  },
  data() {
    return {
      event: {
        id: '',
        title: '',
        start: '',
        end: '',
        backgroundColor: ''
      },
      addingMode: true,
      indexToUpdate: '',
      dialogFormVisible: false,
      rules: {
        title: [{ required: true, message: '请填写日程', trigger: 'blur' }]
      },
      options: [{
          value: '#409EFF',
          label: '外出'
        }, {
          value: '#67C23A',
          label: '会议'
        }, {
          value: '#F56C6C',
          label: '休假'
        }, {
          value: '#909399',
          label: '其他'
        }
      ],
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: 'dayGridMonth',
        firstDay: 1,
        locale: 'zh-cn',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '日',
          list: '汇总'
        },
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false // 设置时间为24小时
        },
        dateClick: this.handleDateClick,
        eventClick: this.showEvent,
        select: this.handleSelect,
        events: [],
        dayMaxEvents: true,
        weekends: true,
        selectable: true
        // events: [
        //   {id: '1', title : '可以拖动但不能缩放', start: '2021-01-01 12:30', end: '2021-01-03 12:30', editable: true},
        //   {id: '2',title : 'event1', start: '2021-01-01 12:31', end: '2021-01-03 12:30', editable: true},
        //   {id: '3',title : '可以拖动,缩放', start: '2021-01-03 12:30', end: '2021-01-04 12:30', editable: true, color: 'red'}
        // ]
        
        //calendarOptions 结束
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleDateClick (arg) {
      this.event.start = arg.date
      this.event.end = arg.date
      this.dialogFormVisible = true
    },
    getList() {
      fetchList().then(response => {
        this.calendarOptions.events = response.data
      })
    },
    resetEvent() {
      this.event = {
        id: '',
        title: '',
        start: '',
        end: '',
        backgroundColor: ''
      }
    },
    addNewEvent(){
      createEvent(this.event).then(() => {
        this.dialogFormVisible = false,
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        setTimeout(() => {
          this.resetEvent()
          this.getList()
        }, 500)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '添加失败'
        })
      })
    },
    showEvent(arg){
      this.addingMode = false;
      const { id, title, start, end, backgroundColor } = this.calendarOptions.events.find(
        event => event.id === +arg.event.id
      );
      this.indexToUpdate = id;
      this.event = {
        id,
        title,
        start,
        end,
        backgroundColor
      }
      this.dialogFormVisible = true
    },
    handleSelect(arg){
      this.addingMode = true;
      this.event.start = arg.start
      this.event.end = arg.end
      this.dialogFormVisible = true
    },
    cancelEvent(){
      this.addingMode = true
      this.resetEvent()
    },
    updateEvent(){
      updateEvent(this.event).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '修改日程成功',
          type: 'success',
          duration: 5000
        })
        this.resetEvent()
        this.addingMode = true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '日程更新失败'
        })
      })
      setTimeout(() => {
        this.getList()
      }, 500)
    },
    handleDelete() {
      this.$confirm('是否删除此日程', '删除日程', {
        confirmButtonText: '确定删除日程',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteEventById()
        this.$message({
          type: 'success',
          message: '删除Todo成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除Todo'
        })
      })
    },
    deleteEventById(){
      deleteEvent(this.event.id).then(response => {
        this.dialogFormVisible = false
        this.resetEvent()
        this.getList()
        this.addingMode = true
      })
    },

    //methods 结束
  }
}
</script>

<style>
  .calendar {
      flex: 1;
      padding: 2em;
  }
  
  /* el-from样式 */
  .el-row {
    margin-top: 20px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  /* el-from样式结束 */
</style>
