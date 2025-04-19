<template>
  <div class="report-page">
    <h1>报表分析</h1>
    <div class="charts">
      <div id="ordersTrendChart" class="chart"></div>
      <div id="roomStatusChart" class="chart"></div>
      <div id="forecastChart" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'

// 初始化订单流水趋势图（折线图）
const initOrdersTrendChart = () => {
  const chartDom = document.getElementById('ordersTrendChart')
  if (!chartDom) return
  const ordersTrendChart = echarts.init(chartDom)
  const option = {
    title: {
      text: '订单流水趋势',
      textStyle: { color: '#f39c12' }
    },
    tooltip: {},
    legend: { data: ['预订金额'], textStyle: { color: '#ecf0f1' } },
    xAxis: {
      data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
      axisLine: { lineStyle: { color: '#ecf0f1' } }
    },
    yAxis: {
      axisLine: { lineStyle: { color: '#ecf0f1' } }
    },
    series: [
      {
        name: '预订金额',
        type: 'line',
        data: [5000, 7000, 8000, 6500, 9000, 11000, 13000, 12000, 14000, 15000, 16000, 17000],
        smooth: true,
        lineStyle: { color: '#f39c12' }
      }
    ]
  }
  ordersTrendChart.setOption(option)
}

// 初始化房型状态变化图（环形图）
const initRoomStatusChart = () => {
  const chartDom = document.getElementById('roomStatusChart')
  if (!chartDom) return
  const roomStatusChart = echarts.init(chartDom)
  const option = {
    title: {
      text: '房型状态变化',
      left: 'center',
      textStyle: { color: '#f39c12' }
    },
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: '#ecf0f1' }
    },
    series: [
      {
        name: '房型状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '空闲' },
          { value: 735, name: '入住' },
          { value: 580, name: '打扫中' }
        ]
      }
    ]
  }
  roomStatusChart.setOption(option)
}

// 初始化未来预订预测图（柱状图+折线图混合）
const initForecastChart = () => {
  const chartDom = document.getElementById('forecastChart')
  if (!chartDom) return
  const forecastChart = echarts.init(chartDom)
  const option = {
    title: {
      text: '未来预订预测',
      textStyle: { color: '#f39c12' }
    },
    tooltip: {},
    legend: {
      data: ['预测流量', '预订流水'],
      textStyle: { color: '#ecf0f1' }
    },
    xAxis: {
      data: ['8月','9月','10月','11月','12月','1月','2月'],
      axisLine: { lineStyle: { color: '#ecf0f1' } }
    },
    yAxis: {
      axisLine: { lineStyle: { color: '#ecf0f1' } }
    },
    series: [
      {
        name: '预测流量',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: { color: '#f39c12' }
      },
      {
        name: '预订流水',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
        smooth: true,
        lineStyle: { color: '#e74c3c' }
      }
    ]
  }
  forecastChart.setOption(option)
}

onMounted(() => {
  initOrdersTrendChart()
  initRoomStatusChart()
  initForecastChart()
})
</script>

<style scoped>
.report-page {
  padding: 20px;
  background-color: #2c3e50;
  color: #ecf0f1;
}
.report-page h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #f39c12;
}
.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.chart {
  width: 600px;
  height: 400px;
  background-color: #34495e;
  border-radius: 8px;
  padding: 10px;
}
</style>
