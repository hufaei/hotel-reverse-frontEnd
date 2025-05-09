<template>
  <div class="report-page">
    <!-- 蒙版覆盖层 -->
    <div class="overlay" v-if="showOverlay">
      <div class="overlay-content">
        <p>查看详情前往 xxx 软件</p>
        <el-button type="primary" @click="openApp">打开软件</el-button>
      </div>
    </div>

    <!-- 图表区域，可透过蒙版隐约可见 -->
    <div class="charts">
      <div id="ordersTrendChart" class="chart"></div>
      <div id="roomStatusChart" class="chart"></div>
      <div id="forecastChart" class="chart"></div>
      <div id="occupancyChart" class="chart"></div>
      <div id="revenueChart" class="chart"></div>
      <div id="bookingSourceChart" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const showOverlay = ref(true)

// 点击打开桌面应用
const openApp = () => {
  window.location.href = 'DataEase://open'
  showOverlay.value = false
}

onMounted(() => {
  // 初始化所有图表，布局紧凑
  initOrdersTrendChart()
  initRoomStatusChart()
  initForecastChart()
  initOccupancyChart()
  initRevenueChart()
  initBookingSourceChart()
})

// 订单流水趋势
const initOrdersTrendChart = () => {
  const el = document.getElementById('ordersTrendChart')
  if (!el) return
  const chart = echarts.init(el)
  chart.setOption({
    title: { text: '订单趋势', textStyle: { color: '#f39c12', fontSize: 14 } },
    tooltip: {},
    xAxis: { data: ['1月','2月','3月','4月','5月','6月'], axisLine: { lineStyle: { color: '#ecf0f1' } } },
    yAxis: { axisLine: { lineStyle: { color: '#ecf0f1' } } },
    series: [{ name: '订单量', type: 'line', data: [150,200,180,220,170,210], smooth: true }]
  })
}
// 房型状态
const initRoomStatusChart = () => {
  const el = document.getElementById('roomStatusChart')
  if (!el) return
  const chart = echarts.init(el)
  chart.setOption({
    title: { text: '房型状态', left: 'center', textStyle: { color: '#f39c12', fontSize: 14 } },
    series: [{ name: '状态', type: 'pie', radius: ['30%','60%'], data: [
      { value: 60, name: '空闲' }, { value: 30, name: '入住' }, { value: 10, name: '打扫中' }
    ], label: { show: false } }]
  })
}
// 未来预订预测
const initForecastChart = () => {
  const el = document.getElementById('forecastChart')
  if (!el) return
  const chart = echarts.init(el)
  chart.setOption({
    title: { text: '预订预测', textStyle: { color: '#f39c12', fontSize: 14 } },
    xAxis: { data: ['周一','周二','周三','周四','周五','周六','周日'], axisLine: { lineStyle: { color: '#ecf0f1' } } },
    yAxis: { axisLine: { lineStyle: { color: '#ecf0f1' } } },
    series: [
      { name: '预测流量', type: 'bar', data: [120,150,180,200,170,190,210] },
      { name: '历史平均', type: 'line', data: [110,140,160,180,160,180,200], smooth: true }
    ]
  })
}
// 入住率趋势
const initOccupancyChart = () => {
  const el = document.getElementById('occupancyChart')
  if (!el) return
  const chart = echarts.init(el)
  chart.setOption({
    title: { text: '入住率', textStyle: { color: '#f39c12', fontSize: 14 } },
    xAxis: { data: ['1月','2月','3月','4月','5月','6月'], axisLine: { lineStyle: { color: '#ecf0f1' } } },
    yAxis: { axisLine: { lineStyle: { color: '#ecf0f1' } }, max: 100 },
    series: [{ name: '入住率', type: 'line', data: [75,80,78,85,82,88], smooth: true }]
  })
}
// 房型收入
const initRevenueChart = () => {
  const el = document.getElementById('revenueChart')
  if (!el) return
  const chart = echarts.init(el)
  chart.setOption({
    title: { text: '房型收入', left: 'center', textStyle: { color: '#f39c12', fontSize: 14 } },
    tooltip: {},
    xAxis: { data: ['单人间','双人间','套房'], axisLine: { lineStyle: { color: '#ecf0f1' } } },
    yAxis: { axisLine: { lineStyle: { color: '#ecf0f1' } } },
    series: [{ name: '收入', type: 'bar', data: [50000,120000,80000] }]
  })
}
// 预订来源
const initBookingSourceChart = () => {
  const el = document.getElementById('bookingSourceChart')
  if (!el) return
  const chart = echarts.init(el)
  chart.setOption({
    title: { text: '预订来源', left: 'center', textStyle: { color: '#f39c12', fontSize: 14 } },
    series: [{ name: '来源', type: 'pie', radius: '50%', data: [
      { value: 45, name: '官网' }, { value: 25, name: 'OTA' }, { value: 20, name: '电话' }, { value: 10, name: '其他' }
    ], label: { fontSize: 12 } }]
  })
}
</script>

<style scoped>
.report-page {
  position: relative;
  padding: 16px;
  background-color: #2c3e50;
  color: #ecf0f1;
}
.report-page h1 {
  text-align: center;
  margin-bottom: 12px;
  color: #f39c12;
  font-size: 20px;
}

.overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.overlay-content {
  text-align: center;
}

.charts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;
}
.chart {
  width: 100%;
  height: 200px;
  background-color: #34495e;
  border-radius: 6px;
  padding: 8px;
}
</style>
