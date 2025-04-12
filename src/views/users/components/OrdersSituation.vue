<template>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="first">AllOrder</el-tab-pane>
      <el-tab-pane label="未出行" name="second">Togo</el-tab-pane>
      <el-tab-pane label="待付款" name="third">Topay</el-tab-pane>
      <el-tab-pane label="待评价" name="fourth">Tosay</el-tab-pane>
    </el-tabs>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue'
  import type { TabsPaneContext } from 'element-plus'
  
  const activeName = ref('first')
  
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
  </script>
  <style>
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  </style>
  