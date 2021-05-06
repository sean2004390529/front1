<template>
  <div>
    <!-- 功能键 -->
    <div class="margin" >
      <!-- <div class="calendarColor" :style="{'background-color': empColor}"></div> -->
      <el-button @click="openDrawer" type="primary" style="margin-left:10px;">查看员工日历</el-button>
      <el-date-picker
        v-model="toDate"
        type="date"
        placeholder="跳转到指定天"
        class="margin"
        @change="jumpToDay">
      </el-date-picker>
      <el-button @click="queryEmpCalendar">刷新</el-button>
      <el-button @click="clearOtherCalendar">清除其他日历</el-button>
      <el-button class="custButton" :style="{'background-color': empColor}" @click="openColorPane">更改日程颜色</el-button>
      <br>
      <el-checkbox-group v-model="checkedEmpCalendar" @change="checkboxChange" class="margin" fill="#D9ECFF">
        <el-checkbox-button v-for="(emp,index) in empCalendar" :label="emp" :key="emp">
          <div class="otherCalendarColor" :style="{'backgroundColor': empCalendarColor[index]}">{{emp}}</div>
        </el-checkbox-button>
      </el-checkbox-group>

    </div>

    <div class="calendar" >
        <FullCalendar ref="fullCalendar" :options="calendarOptions" />
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
        <el-form-item label="时间" prop="date">
            <el-date-picker
              v-model="event.date"
              start-placeholder="开始"
              end-placeholder="结束"
              type="datetimerange"
              :default-time="['09:00:00', '18:00:00']"
              clearable
            />
          </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer" v-if="addingMode">
          <el-button type="primary" @click="addNewEvent">创建日程</el-button>
          <el-button @click="cancelEvent">取消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
          <el-button type="primary" @click="updateEvent">更新</el-button>
          <el-button type="danger" @click="handleDelete">删除日程</el-button>
          <el-button @click="cancelEvent">取消</el-button>
      </div>
    </el-dialog>

    <!-- 抽屉 -->
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false">
      <div class="margin">
          <div v-if="!deptList">
            <el-button @click="fetchDeptList">刷新部门列表</el-button>
          </div>

          <div v-else>
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

            <el-tag class="margin" size="medium" @click="tagClick(tag.id, tag.empName)"
              v-for="tag in tagOptions"
              :key="tag.id">
              {{tag.empName}}
            </el-tag>

          </div>
      </div>

    </el-drawer>

    <!-- 调色板 -->
    <el-dialog title="调色板" :visible.sync="showColorPane">
      <!-- <div class="colorPane" :style="{'background-color': empColor}"></div> -->
      <div class="colorPane" :style='{background:`rgb(${colorPane.r},${colorPane.g},${colorPane.b})`}'></div>
      <el-form ref="colorForm" :model="colorPane" label-position="left" label-width="80px">

        <el-form-item label="红" >
          <el-slider v-model="colorPane.r" show-input :min=0 :max=255 @input="changePane"></el-slider>
        </el-form-item>
        <el-form-item label="绿" >
          <el-slider v-model="colorPane.g" show-input :min=0 :max=255 @input="changePane" ></el-slider>
        </el-form-item>
        <el-form-item label="蓝" >
          <el-slider v-model="colorPane.b" show-input :min=0 :max=255 @input="changePane" ></el-slider>
        </el-form-item>
        <el-form-item label="色调值" class="hex">
          <el-input v-model="colorPane.hex" ></el-input>
        </el-form-item>
      </el-form>

      <div class="samplePane">
        <div v-for="color in colorList1" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList2" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList3" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList4" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList5" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList6" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList7" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList8" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList9" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList10" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList11" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList12" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList13" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList14" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
        <div v-for="color in colorList15" :key="color" :style="{'background-color': color}" class="singlePane" @click="samplePaneClick(color)"></div><br>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePane">更新</el-button>
        <el-button @click="showColorPane=false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import FullCalendar, { Calendar } from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { fetchList, createEvent,  updateEvent, deleteEvent, queryEmpCalendar, changeColor } from '@/api/calendar'
import { fetchList as fetchDeptList } from '@/api/dept'
import { fetchsubDeptEmp, fetchEmpColor, fetchOtherEmpColor } from '@/api/emp'
import { rgbToHex, hexToRGB } from '@/utils'

export default {
  name: 'MaintenanceCalendarview',
  components: {
    FullCalendar
  },
  data() {
    return {
      drawer: false,
      toDate: undefined,
      deptList: null,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      showEmp: false,
      tagOptions: [],
      checkedEmpCalendar: [],
      empCalendar: [],
      empCalendarColor: [],
      empColor: undefined,
      count: 5,
      colorList1: ["#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00","#CCFF00","#99FF00","#66FF00","#33FF00","#00FF00","#00FF33","#00FF66","#00FF99","#00FFCC","#00FFFF","#00CCFF","#0099FF","#0066FF","#0033FF","#0000FF","#3300FF","#6600FF","#9900FF","#CC00FF","#FF00FF","#FF00CC","#FF0099","#FF0066","#FF0033"],
      colorList2: ["#F70909","#F73809","#F76809","#F79709","#F7C709","#F7F709","#C7F709","#97F709","#68F709","#38F709","#09F709","#09F738","#09F768","#09F797","#09F7C7","#09F7F7","#09C7F7","#0997F7","#0968F7","#0938F7","#0909F7","#3809F7","#6809F7","#9709F7","#C709F7","#F709F7","#F709C7","#F70997","#F70968","#F70938"],
      colorList3: ["#EE1111","#EE3D11","#EE6911","#EE9611","#EEC211","#EEEE11","#C2EE11","#96EE11","#69EE11","#3DEE11","#11EE11","#11EE3D","#11EE69","#11EE96","#11EEC2","#11EEEE","#11C2EE","#1196EE","#1169EE","#113DEE","#1111EE","#3D11EE","#6911EE","#9611EE","#C211EE","#EE11EE","#EE11C2","#EE1196","#EE1169","#EE113D"],
      colorList4: ["#E61A1A","#E6421A","#E66B1A","#E6941A","#E6BD1A","#E6E61A","#BDE61A","#94E61A","#6BE61A","#42E61A","#1AE61A","#1AE642","#1AE66B","#1AE694","#1AE6BD","#1AE6E6","#1ABDE6","#1A94E6","#1A6BE6","#1A42E6","#1A1AE6","#421AE6","#6B1AE6","#941AE6","#BD1AE6","#E61AE6","#E61ABD","#E61A94","#E61A6B","#E61A42"],
      colorList5: ["#DD2222","#DD4822","#DD6D22","#DD9222","#DDB822","#DDDD22","#B8DD22","#92DD22","#6DDD22","#48DD22","#22DD22","#22DD48","#22DD6D","#22DD92","#22DDB8","#22DDDD","#22B8DD","#2292DD","#226DDD","#2248DD","#2222DD","#4822DD","#6D22DD","#9222DD","#B822DD","#DD22DD","#DD22B8","#DD2292","#DD226D","#DD2248"],
      colorList6: ["#D52B2B","#D54D2B","#D56F2B","#D5912B","#D5B32B","#D5D52B","#B3D52B","#91D52B","#6FD52B","#4DD52B","#2BD52B","#2BD54D","#2BD56F","#2BD591","#2BD5B3","#2BD5D5","#2BB3D5","#2B91D5","#2B6FD5","#2B4DD5","#2B2BD5","#4D2BD5","#6F2BD5","#912BD5","#B32BD5","#D52BD5","#D52BB3","#D52B91","#D52B6F","#D52B4D"],
      colorList7: ["#CC3333","#CC5233","#CC7033","#CC8F33","#CCAE33","#CCCC33","#AECC33","#8FCC33","#70CC33","#52CC33","#33CC33","#33CC52","#33CC70","#33CC8F","#33CCAE","#33CCCC","#33AECC","#338FCC","#3370CC","#3352CC","#3333CC","#5233CC","#7033CC","#8F33CC","#AE33CC","#CC33CC","#CC33AE","#CC338F","#CC3370","#CC3352"],
      colorList8: ["#C43C3C","#C4573C","#C4723C","#C48D3C","#C4A93C","#C4C43C","#A9C43C","#8DC43C","#72C43C","#57C43C","#3CC43C","#3CC457","#3CC472","#3CC48D","#3CC4A9","#3CC4C4","#3CA9C4","#3C8DC4","#3C72C4","#3C57C4","#3C3CC4","#573CC4","#723CC4","#8D3CC4","#A93CC4","#C43CC4","#C43CA9","#C43C8D","#C43C72","#C43C57"],
      colorList9: ["#BB4444","#BB5C44","#BB7444","#BB8C44","#BBA344","#BBBB44","#A3BB44","#8CBB44","#74BB44","#5CBB44","#44BB44","#44BB5C","#44BB74","#44BB8C","#44BBA3","#44BBBB","#44A3BB","#448CBB","#4474BB","#445CBB","#4444BB","#5C44BB","#7444BB","#8C44BB","#A344BB","#BB44BB","#BB44A3","#BB448C","#BB4474","#BB445C"],
      colorList10: ["#B34D4D","#B3614D","#B3764D","#B38A4D","#B39E4D","#B3B34D","#9EB34D","#8AB34D","#76B34D","#61B34D","#4DB34D","#4DB361","#4DB376","#4DB38A","#4DB39E","#4DB3B3","#4D9EB3","#4D8AB3","#4D76B3","#4D61B3","#4D4DB3","#614DB3","#764DB3","#8A4DB3","#9E4DB3","#B34DB3","#B34D9E","#B34D8A","#B34D76","#B34D61"],
      colorList11: ["#AA5555","#AA6655","#AA7755","#AA8855","#AA9955","#AAAA55","#99AA55","#88AA55","#77AA55","#66AA55","#55AA55","#55AA66","#55AA77","#55AA88","#55AA99","#55AAAA","#5599AA","#5588AA","#5577AA","#5566AA","#5555AA","#6655AA","#7755AA","#8855AA","#9955AA","#AA55AA","#AA5599","#AA5588","#AA5577","#AA5566"],
      colorList12: ["#A25E5E","#A26B5E","#A2795E","#A2875E","#A2945E","#A2A25E","#94A25E","#87A25E","#79A25E","#6BA25E","#5EA25E","#5EA26B","#5EA279","#5EA287","#5EA294","#5EA2A2","#5E94A2","#5E87A2","#5E79A2","#5E6BA2","#5E5EA2","#6B5EA2","#795EA2","#875EA2","#945EA2","#A25EA2","#A25E94","#A25E87","#A25E79","#A25E6B"],
      colorList13: ["#996666","#997166","#997B66","#998566","#998F66","#999966","#8F9966","#859966","#7B9966","#719966","#669966","#669971","#66997B","#669985","#66998F","#669999","#668F99","#668599","#667B99","#667199","#666699","#716699","#7B6699","#856699","#8F6699","#996699","#99668F","#996685","#99667B","#996671"],
      colorList14: ["#916F6F","#91766F","#917D6F","#91836F","#918A6F","#91916F","#8A916F","#83916F","#7D916F","#76916F","#6F916F","#6F9176","#6F917D","#6F9183","#6F918A","#6F9191","#6F8A91","#6F8391","#6F7D91","#6F7691","#6F6F91","#766F91","#7D6F91","#836F91","#8A6F91","#916F91","#916F8A","#916F83","#916F7D","#916F76"],
      colorList15: ["#887777","#887B77","#887E77","#888277","#888577","#888877","#858877","#828877","#7E8877","#7B8877","#778877","#77887B","#77887E","#778882","#778885","#778888","#778588","#778288","#777E88","#777B88","#777788","#7B7788","#7E7788","#827788","#857788","#887788","#887785","#887782","#88777E","#88777B"],
      showColorPane: false,
      colorPane: {
        r: 0,
        g: 0,
        b: 0,
        hex: undefined
      },
      // 以上为测试数据
      event: {
        id: undefined,
        title: undefined,
        date: [],
        color: undefined,
        backgroundColor: undefined,
        allDay: false
      },
      addingMode: true,
      indexToUpdate: '',
      dialogFormVisible: false,
      rules: {
        title: [{ required: true, message: '请填写日程标题', trigger: 'blur' }],
        date: [{ required: true, message: '请填写日程时间', trigger: 'blur' }]
      },
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: 'dayGridMonth',
        firstDay: 0,
        headerToolbar: {
          left: 'prev,next today listWeek',
          center: 'title',
          // right: 'dayGridMonth,dayGridWeek,dayGridDay,timeGridWeek,timeGridDay,listDay,listWeek,listMonth'
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '日',
          list: '列表'
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
        weekends: true,
        selectable: true,
        events: [],
        eventTextColor: "black",
        displayEventEnd: true,
        // events: [
        //   {id: '1', title : '可以拖动但不能缩放', start: '2021-01-01 12:30', end: '2021-01-03 12:30', editable: true, color: 'blue'},
        //   {id: '2',title : 'event1', start: '2021-01-01 12:31', end: '2021-01-03 12:30', editable: true, color: 'yellow'},
        //   {id: '3',title : '可以拖动,缩放', start: '2021-01-03 12:30', end: '2021-01-04 12:30', editable: true, color: 'red'}
        // ],
        locales: [ 'en','ja', 'zh-cn' ],
        locale: 'zh-cn',
        slotDuration: '01:00:00',// 间隔
        slotLabelInterval: '01:00', // 间隔
        slotMinTime: '05:00:00', // 每天起始时间
        nowIndicator: true, //显示当前时间
        navLinks: true, // 可以点击跳转到当天日程
        nextDayThreshold: '00:00:00', // 超过0时，则横跨下一天
        businessHours: {
          daysOfWeek: [ 1, 2, 3, 4, 5 ],
          startTime: '08:30',
          endTime: '18:00',
        },
        // dayMaxEvents: false,
        dayMaxEventRows: false, //显示全部
        //calendarOptions 结束
      }
    }
  },
  created() {
    this.getList()
    // this.fetchEmpColor()
    this.keepFetch5Times()
  },
  methods: {
    resetEvent() {
      this.event = {
        id: undefined,
        title: undefined,
        date: [],
        color: undefined,
        backgroundColor: undefined,
        allDay: undefined
      }
    },
    getList() {
      fetchList().then(response => {
        this.calendarOptions.events = response.data
      })
    },
    addNewEvent(){
      if(this.empColor!=null){
        this.event.color = this.empColor
        this.event.backgroundColor = this.empColor
      }
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
      const { id, title, start, end} = this.calendarOptions.events.find(
        event => event.id === +arg.event.id
      );
      this.indexToUpdate = id;
      this.event = {
        id,
        title,
        date: [start, end]
      }
      this.dialogFormVisible = true
    },
    handleSelect(arg){
      this.resetEvent()
      this.addingMode = true;
      this.event.date[0] = arg.start
      this.event.date[1] = arg.end
      this.event.allDay = arg.allDay;
      this.dialogFormVisible = true
    },
    cancelEvent(){
      this.addingMode = true
      this.dialogFormVisible = false
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
        // 测试代码开始
    openDrawer(){
      this.drawer = true
      this.fetchDeptList()
    },
    fetchDeptList(){
      fetchDeptList().then(res =>{
        this.deptList = res.data
      })
    },
    handleNodeClick(data) {
      this.deptId = data.id
      fetchsubDeptEmp(this.deptId).then(res =>{
        this.tagOptions = res.data
      })
    },
    tagClick(empId, empName){
      if(this.empCalendar.indexOf(empName)){
        this.empCalendar.push(empName)
        this.checkedEmpCalendar.push(empName)
        // empCalendarColor
        fetchOtherEmpColor(empName).then(res => {
          this.empCalendarColor.push(res.data)
        })
      }
      this.showEmp = false
      this.drawer = false
      this.queryEmpCalendar()
    },
    queryEmpCalendar(){
      queryEmpCalendar(this.checkedEmpCalendar).then( res => {
        this.calendarOptions.events = res.data
      })
    },
    fetchEmpColor(){
      if(this.count < 1 || this.empColor!=null){
        clearInterval(this.intervalId)
      }
      fetchEmpColor().then(res =>{
        this.count = this.count - 1
        if(this.empCalendar.length == 0){
          this.empColor = res.data.color
          this.empCalendar.push(res.data.empName)
          this.checkedEmpCalendar.push(res.data.empName)
          this.empCalendarColor.push(res.data.color)
        }
      })
    },
    keepFetch5Times(){
      this.intervalId = setInterval(this.fetchEmpColor, 500)
    },
    checkboxChange(){
      this.queryEmpCalendar()
    },
    clearOtherCalendar(){
      this.checkedEmpCalendar = this.checkedEmpCalendar.slice(0,1)
      this.empCalendar = this.empCalendar.slice(0,1)
      this.empCalendarColor = this.empCalendarColor.slice(0,1)
      this.getList()
    },
    jumpToDay(){
      let cal = this.$refs.fullCalendar.getApi()
      cal.gotoDate(this.toDate)
    },
    openColorPane(){
      let {r,g,b} = hexToRGB(this.empColor)
      this.colorPane.r = r
      this.colorPane.g = g
      this.colorPane.b = b

      let hex = rgbToHex(this.colorPane.r, this.colorPane.g, this.colorPane.b)
      this.colorPane.hex = hex
      this.showColorPane = true
    },
    changePane(){
      let hex = rgbToHex(this.colorPane.r, this.colorPane.g, this.colorPane.b)
      this.colorPane.hex = hex
    },
    changeColor(){
      let empColor = this.empColor.slice(1)
      changeColor(empColor).then(res =>{
        this.getList()
        this.empCalendarColor[0] = this.empColor
        this.showColorPane = false
      })
    },
    updatePane(){
      this.empColor = this.colorPane.hex
      console.log("updatePane", this.colorPane.hex, this.empColor)
      this.changeColor()
    },
    samplePaneClick(color){
      this.colorPane.hex = color
      let {r,g,b} = hexToRGB(color)
      this.colorPane.r = r
      this.colorPane.g = g
      this.colorPane.b = b
      this.empColor = color

    }
    // 测试代码结束
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

  .margin {
    margin-left: 10px;
    margin-top: 10px
  }

  /* 调整 el-checkbox与button对其 */
  .el-checkbox-group {
    font-size: inherit;
  }
  .queryEmp {
    display: inline-block;
    margin-left: 10px;
  }

  .calendarColor{
    width: 20px;
    height: 15px;
    /* background-color: #909399; */
    display: inline-block;
    margin-left: 10px;
  }

  .otherCalendarColor{
    color: black; 
    padding: 4px;
    border-radius: 4px;
    font-size: 16px;
  }

  .el-checkbox-button--small .el-checkbox-button__inner {
      padding: 5px 9px;
  }

  .custButton{
    color: black;
  }
  .custButton:hover{
    color: white;
  }
  .colorPane{
    height: 100px;
    width: 100px;
    margin-bottom: 10px;
    text-align: center;
    margin:0 auto;
  }
  .hex{
    width: 50%;
  }

  .samplePane {
    width: 100%;
    border: black 1px solid;
  }
  .singlePane {
    height: 14px;
    width: 3.333%;
    /* background: chartreuse; */
    border: white 2px solid;
    display: inline-block;
  }
  .singlePane:hover {
    border: solid 2px black;
  }
</style>
