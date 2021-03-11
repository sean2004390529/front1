<template>
  <div>
      Activity - definition
      <br>
      <el-button @click="getList">getList</el-button>
    <div>
  
</template>

<script>
import { fetchList, createTodo, updateTodo, deleteTodo } from '@/api/activity/definition'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'ActivityDefinition',
  data() {
    return {
    }
  },
  methods: {
    getList() {
      fetchList().then(response => {
        console.log(response)
      })
    },
  }
}
</script>

<style>

</style>