<template>
  <div class="favorites">
    <el-row :gutter="20">
      <el-col :span="6" v-for="hotel in hotels" :key="hotel.hotelId">
        <el-card class="hotel-card" shadow="always">
          <!-- 删除按钮 -->
          <img
            class="delete-icon"
            :src="hoveredId === hotel.hotelId ? deleteHoverIcon : deleteIcon"
            alt="delete"
            @click.stop="hotel.hotelId && removeFavorite(hotel.hotelId)"
            @mouseover="hotel.hotelId && (hoveredId = hotel.hotelId)"
            @mouseleave="hoveredId = ''"
          />
          <img :src="hotel.img" alt="Hotel Image" class="hotel-image" />
          <div class="hotel-info">
            <p class="hotel-name">{{ hotel.hotelName }}</p>
            <p class="hotel-address">{{ hotel.address }}</p>
            <el-rate
              :model-value="hotel.stars"
              disabled
              :max="5"
              style="font-size: 16px;"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import deleteIcon from '@/assets/delete.png'
import deleteHoverIcon from '@/assets/delete-a.png'
import type { IHotels } from '@/api/interface/hotels/hotels'
import { useHandleData } from '@/hooks/index';
import { disCollectedApi } from '@/api/modules/hotels/hotels';
const hoveredId = ref<string>('')

// 收藏酒店数据
const hotels = ref<IHotels.Row[]>([
  {
    hotelId: "dwahuidwa",
    img: 'https://img1.tucang.cc/api/image/show/fe94928dfb6984559d7b9ca155e13434',
    hotelName: '五星级大酒店',
    address: '北京市朝阳区',
    stars: 5
  },
  {
    hotelId: "fehsuidw",
    img: 'https://img1.tucang.cc/api/image/show/451df148544fa8c180cee925f2b161be',
    hotelName: '舒适连锁酒店',
    address: '上海市浦东新区',
    stars: 4
  },
  {
    hotelId: "festh",
    img: 'https://img1.tucang.cc/api/image/show/51148907155259773bb905a15f1641ae',
    hotelName: '经济型快捷酒店',
    address: '广州市天河区',
    stars: 3
  },
  {
    hotelId: "dwhauifew",
    img: 'https://img1.tucang.cc/api/image/show/451df148544fa8c180cee925f2b161be',
    hotelName: '豪华度假村',
    address: '海南省三亚市',
    stars: 5
  },
])

async function removeFavorite(hotelId: string) {
  await useHandleData(
    disCollectedApi,
    { id: hotelId },
    `确定取消收藏该酒店`
  )
  console.log('取消收藏：', hotelId)
  hotels.value = hotels.value.filter(h => h.hotelId !== hotelId)
}
</script>

<style scoped>
.favorites {
  padding: 10px;
}

.hotel-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.hotel-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.hotel-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}

.delete-icon {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.delete-icon:hover {
  transform: scale(1.2);
}

.hotel-info {
  margin-top: 10px;
}

.hotel-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.hotel-address {
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
