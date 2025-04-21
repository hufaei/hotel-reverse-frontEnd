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
import { onMounted, ref } from 'vue'
import deleteIcon from '@/assets/delete.png'
import deleteHoverIcon from '@/assets/delete-a.png'
import type { IHotels } from '@/api/interface/hotels/hotels'
import { useHandleData } from '@/hooks/index'
import { disCollectedApi, getCollectionApi } from '@/api/modules/hotels/hotels'

const hoveredId = ref<string>('')

// 收藏酒店数据
const hotels = ref<IHotels.Row[]>([])

// 获取收藏数据
const fetchCollection = async () => {
  try {
    const res = await getCollectionApi()
    console.log('获取收藏列表成功', res)
    hotels.value = res.data || []
  } catch (err) {
    console.error('获取收藏列表失败', err)
  }
}

async function removeFavorite(hotelId: string) {
  await useHandleData(
    disCollectedApi,
    { id: hotelId },
    `确定取消收藏该酒店`
  )
  hotels.value = hotels.value.filter(h => h.hotelId !== hotelId)
}

// 页面加载时调用
onMounted(() => {
  fetchCollection()
})

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
