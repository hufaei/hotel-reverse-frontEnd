<template>
  <el-row :gutter="20">
    <!-- 左侧区域：日期选择器、酒店搜索输入及酒店列表 -->
    <el-col :span="14">
      <!-- 将 URL 中的关键词传递给 DataPicker，保留之前搜索的输入 -->
      <DataPicker :location="keywords" :keywords="keywords" @search="fetchHotels"/>
      
      <!-- 酒店列表展示 -->
      <div class="hotel-list">
        <el-card
          v-for="hotel in hotels"
          :key="hotel.hotelId"
          class="hotel-item"
          @mouseover="handleHotelHover(hotel)"
          @click="handleHotelClick(hotel)"
        >
          <div class="hotel-card-content">
            <img :src="hotel.img" alt="Hotel Image" class="hotel-thumb" />
            <div class="hotel-info">
              <h3 class="hotel-name">{{ hotel.hotelName }}</h3>
              <p class="hotel-english">{{ hotel.englishName }}</p>
              <p class="hotel-address">地址：{{ hotel.country+(hotel.address || '') }}电话：{{ hotel.contactPhone }}</p>
              <p class="hotel-phone">简介：{{ hotel.description }}</p>
              <el-rate
              v-model="hotel.stars"
            disabled
            text-color="#ff9900"
          ></el-rate>
              <p class="hotel-price">￥{{ hotel.minPrice }} 起</p>
            </div>
          </div>
        </el-card>
      </div>
    </el-col>

    <!-- 右侧区域：地图和搜索历史 -->
    <el-col :span="10">
      <el-affix :offset="20">
        <el-card class="map-card">
          <!-- Leaflet 地图容器 -->
          <div id="leaflet-map" style="height: 300px; width: 100%;"></div>
          <!-- 搜索历史 -->
          <div class="search-history">
            <h3>搜索历史</h3>
            <div
              v-for="item in hotelHistoryStore.history"
              :key="item.hotelId"
              class="history-item"
            >
              <img :src="item.img" alt="Hotel Image" class="history-thumb" />
              <div class="history-info">
                <p class="history-name">{{ item.hotelName }}</p>
                <p class="history-english">{{ item.englishName }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-affix>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DataPicker from '@/views/home/components/DataPicker.vue';
import { getHotelsDetailApi, getSearchHotelId } from '@/api/modules/hotels/hotels';
import { useHotelHistoryStore } from '@/stores/hotelHistory';
import {useSearchStore} from '@/stores/userSearchStore'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { IHotels } from '@/api/interface/hotels/hotels';

const route = useRoute();
const router = useRouter();
const hotelHistoryStore = useHotelHistoryStore();
hotelHistoryStore.loadHistory();
const searchStore = useSearchStore()
// 从 URL 中获取搜索关键词（这里直接传入原始字符串）
const keywords = searchStore.keywords || '';
const location = searchStore.location || '';
const dataRange = searchStore.dateRange || '';

const hotelIds = ref<string[]>([]);
const defaultHotelIds = [
  "JD0000107934",
  "JD0000121402",
  "JD0000127841"
];

const hotels = ref<IHotels.Row[]>([]);
let map: L.Map | null = null;
let currentMarker: L.Marker | null = null;
const fetchHotels = async () => {
  const keywords = searchStore.keywords || '';
  const location = searchStore.location || '';
  const dataRange = searchStore.dateRange || [];

  if (keywords) {
    try {
      const res = await getSearchHotelId({
        keywords: [keywords, location],
        dateStart: dataRange[0],
        dateEnd: dataRange[1]
      });
      hotelIds.value = res || [];
    } catch (error) {
      console.error("搜索酒店失败，使用默认酒店数据", error);
      hotelIds.value = defaultHotelIds;
    }
  } else {
    hotelIds.value = defaultHotelIds;
  }

  if (hotelIds.value.length) {
    const fetchPromises = hotelIds.value.map(id =>
      getHotelsDetailApi({ id }).then(res => res.data)
    );
    try {
      const results = await Promise.all(fetchPromises);
      hotels.value = results;
    } catch (error) {
      console.error("获取酒店详情失败:", error);
    }
  }
};
onMounted(async () => {
  fetchHotels();
  // 初始化 Leaflet 地图（默认居中杭州）
  map = L.map('leaflet-map').setView([30.2689, 121.2152], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
});

// 鼠标悬停到酒店项时更新地图定位并添加标记
function handleHotelHover(hotel: any) {
  if (hotel.latitude && hotel.longitude && map) {
    // 移除已有标记
    if (currentMarker) {
      map.removeLayer(currentMarker);
    }
    // 添加新的标记
    currentMarker = L.marker([hotel.latitude, hotel.longitude]).addTo(map);
    currentMarker.bindPopup(hotel.hotelName).openPopup();
    map.setView([hotel.latitude, hotel.longitude], 15);
  }
}

// 点击酒店项时，更新搜索历史并跳转到详情页
function handleHotelClick(hotel: any) {
  hotelHistoryStore.addHotel({
    hotelId: hotel.hotelId,
    hotelName: hotel.hotelName,
    englishName: hotel.englishName,
    img: hotel.img
  });
  router.push(`/hotels/${hotel.hotelId}`);
}
</script>

<style scoped>
.hotel-list {
  margin-top: 20px;
}
.hotel-item {
  display: flex;
  align-items: center;

  margin-bottom: 10px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}
.hotel-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.hotel-card-content {
  display: flex;
  align-items:start;
}
.hotel-thumb {
  width: 200px; /* 增大图片尺寸 */
  height: 250px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}
.hotel-info {
  flex: 1;
}
.hotel-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}
.hotel-english {
  font-size: 16px;
  color: #666;
  margin: 5px 0;
}
.hotel-address,
.hotel-phone {
  font-size: 14px;
  color: #999;
  display: -webkit-box;    
	-webkit-box-orient: vertical;    
	-webkit-line-clamp: 4;    
	overflow: hidden;
  margin: 2px 0;
}
.hotel-price {
  font-size: 16px;
  color: #f56c6c;
  font-weight: bold;
  margin: 5px 0;
}

/* 右侧区域 */
.map-card {
  padding: 10px;
}
.search-history {
  margin-top: 20px;
}
.search-history h3 {
  margin-bottom: 10px;
}
.history-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.history-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}
.history-info {
  flex: 1;
}
.history-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}
.history-english {
  font-size: 12px;
  color: #666;
  margin: 0;
}
</style>
