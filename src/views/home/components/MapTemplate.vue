<template>
  <div class="map-wrapper">
    <div id="map" class="map-container"></div>
    <p class="map-tips">点击标记查看景点详情</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 解决默认图标路径问题
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

// 西湖周边主要景点数据
const attractions = [
  {
    name: '西湖',
    coords: [30.2469, 120.1378],
    desc: '世界文化遗产，中国十大风景名胜之一'
  },
  {
    name: '雷峰塔',
    coords: [30.2333, 120.1486],
    desc: '西湖十景之雷峰夕照，白娘子传说发源地'
  },
  {
    name: '断桥残雪',
    coords: [30.2572, 120.1465],
    desc: '西湖十景之一，白蛇传经典场景'
  },
  {
    name: '苏堤春晓',
    coords: [30.2458, 120.1364],
    desc: '西湖十景之首，贯穿西湖南北的景观堤'
  },
  {
    name: '三潭印月',
    coords: [30.2397, 120.1422],
    desc: '西湖十景之一，一元纸币背面图案'
  }
]

onMounted(() => {
  // 初始化地图
  const map = L.map('map').setView([30.2469, 120.1378], 14)
  
  // 添加地图图层
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // 添加景点标记
  attractions.forEach(attraction => {
    L.marker(attraction.coords as L.LatLngExpression, { icon: defaultIcon })
      .addTo(map)
      .bindPopup(`
        <div class="popup-content">
          <h3>${attraction.name}</h3>
          <p>${attraction.desc}</p>
        </div>
      `)
  })

  // 添加西湖范围图层
  L.polygon([
    [30.255, 120.125],
    [30.255, 120.15],
    [30.235, 120.15],
    [30.235, 120.125]
  ], { color: '#3388ff', fillOpacity: 0.1 }).addTo(map)
})
</script>

<style scoped>
.map-wrapper {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 2% auto;
}

.map-title {
  color: #2c3e50;
  margin-bottom: 15px;
  font-family: '楷体', cursive;
}

.map-container {
  width: 100%;
  height: 600px;
  border-radius: 10px;
  border: 2px solid #ddd;
}

.map-tips {
  text-align: center;
  color: #666;
  margin-top: 10px;
  font-size: 0.9em;
}

/* 覆盖Leaflet默认弹出框样式 */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.popup-content h3 {
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-size: 1.1em;
}

.popup-content p {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}
</style>