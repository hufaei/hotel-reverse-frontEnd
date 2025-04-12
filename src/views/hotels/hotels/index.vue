<template>
  <div class="hotel-detail">
    <!-- 第一部分：酒店详情 Card -->
    <el-card class="hotel-info-card" shadow="hover">
      <!-- Card 头部：酒店名称、英文名称、地址、装修/开业年份 -->
      <template #header>
        <div class="card-header">
          <h2 class="hotel-name">{{ hotelDetail?.hotelName }}</h2>
          <small class="hotel-ename">{{ hotelDetail?.englishName }}</small>
          <div class="address">
            地址：{{ hotelDetail?.country }} {{ hotelDetail?.city }} {{ hotelDetail?.address }}
          </div>
          <div class="dates">
            装修年份：{{ hotelDetail?.renovationYear }} &nbsp;&nbsp; 开业年份：{{ hotelDetail?.openingYear }}
          </div>
          <div class="description">
            {{ hotelDetail?.description }}
          </div>
        </div>
      </template>
      <!-- Card 内容：左侧酒店图片，右侧地图 -->
      <div class="card-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-image
              :src="hotelDetail?.img"
              fit="cover"
              class="hotel-img"
              :lazy="true"
            />
          </el-col>
          <el-col :span="12">
            <div class="map-container" ref="mapContainer">
              <!-- leaflet 地图会在此容器中初始化 -->
              <div id="map" style="width:100%;height:300px;"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 第二部分：房型展示（横向滚动） -->
    <div class="room-types">
      <h3>房型展示</h3>
      <div class="room-list">
        <el-card
          v-for="room in roomTypesList"
          :key="room.roomTypeId"
          class="room-card"
          shadow="hover"
        >
          <el-image
            :src="room.photoUrls"
            fit="cover"
            class="room-img"
            :lazy="true"
          />
          <div class="room-header">
            <span class="room-name">{{ room.roomType }}</span>
            <span class="room-price">￥{{ room.price }}</span>
          </div>
          <div v-if="roomExpanded[String(room.roomTypeId)]" class="room-description">
            {{ room.description }}
          </div>
          <el-button
            type="text"
            @click="toggleRoom(String(room.roomTypeId))"
          >
            {{ roomExpanded[String(room.roomTypeId)] ? '收起详情' : '展开详情' }}
          </el-button>
        </el-card>
      </div>
    </div>

    <!-- 第三部分：评论展示 -->
    <div class="comments-section">
      <h3>酒店评论</h3>
      <!-- 评论头部：总评分 + 细分评分（2*2 布局） -->
      <div class="ratings-header">
        <div class="total-rating">
          <el-rate :model-value="totalRating" disabled show-text></el-rate>
          <span class="score-text">{{ totalRating }}</span>
        </div>
        <div class="detailed-ratings">
          <el-row>
            <el-col :span="12">
              <div class="detail-rate">
                <span>健康评分：</span>
                <el-rate :model-value="healthRate" disabled show-text></el-rate>
              </div>
              <div class="detail-rate">
                <span>环境评分：</span>
                <el-rate :model-value="envRate" disabled show-text></el-rate>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-rate">
                <span>服务评分：</span>
                <el-rate :model-value="serviceRate" disabled show-text></el-rate>
              </div>
              <div class="detail-rate">
                <span>设施评分：</span>
                <el-rate :model-value="facilitiesRate" disabled show-text></el-rate>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 评论列表：左右布局 -->
      <div class="comments-list">
        <el-row
          v-for="review in reviewsList"
          :key="review.reviewId"
          class="comment-item"
          :gutter="20"
        >
          <!-- 左侧：用户头像及基本信息 -->
          <el-col :span="6">
            <div class="user-info">
              <el-image
                src='https://img1.tucang.cc/api/image/show/c023f25f13c75149d280e93de3a185bf'
                fit="cover"
                class="user-avatar"
                :lazy="true"
              />
              <div class="user-name">{{ review.userInfo?.userName }}</div>
              <div class="user-extra">
                共{{ review.userInfo?.count }}条点评 /
                {{ formatBookingDate(review.createdAt ?? '') }}入住 /
                {{ review.userInfo?.roomType }}
              </div>
            </div>
          </el-col>
          <!-- 右侧：评论内容及时间 -->
          <el-col :span="18">
            <div class="comment-content">
              <div class="comment-text">{{ review.comment }}</div>
              <div class="comment-time">{{ review.createdAt }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getHotelsDetailApi } from '@/api/modules/hotels/hotels'
import { getReviewsListApi, getUserTotalReviews } from '@/api/modules/reviews/reviews'
import { getRoomTypesListApi } from '@/api/modules/roomtypes/roomTypes'
import type { IHotels } from '@/api/interface/hotels/hotels'
import type { IReviews } from '@/api/interface/reviews/reviews'
import type { IRoomTypes } from '@/api/interface/roomtypes/roomTypes'
import { useHotelHistoryStore, type HotelHistory } from '@/stores/hotelHistory'
const gril = "https://img1.tucang.cc/api/image/show/04471e3ecadaace4602d66453e1b8522"
// 引入 leaflet 及其样式
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/** 测试数据：路由参数用死数据 */
const hotelId = "JD0000001970"

// 声明响应式变量
const hotelDetail = ref<IHotels.Row | null>(null)
const roomTypesList = ref<IRoomTypes.Row[]>([])
const reviewsList = ref<IReviews.Row[]>([])

// 房间展开状态：key 为 roomTypeId，值为布尔
const roomExpanded = reactive<Record<string, boolean>>({})

// 默认评分数据（可从接口获取或自行计算）
const totalRating = ref(4.5)
const healthRate = ref(4)
const envRate = ref(4.2)
const serviceRate = ref(4.8)
const facilitiesRate = ref(4.3)

// 用于格式化评论列表接口参数
const formatParams = (params: IReviews.Query) => {
  const newParams = JSON.parse(JSON.stringify(params))
  if (newParams.createdAt) {
    newParams.createdAtStart = newParams.createdAt[0]
    newParams.createdAtEnd = newParams.createdAt[1]
    delete newParams.createdAt
  }
  return newParams
}

// 包装评论列表接口
const getReviewsList = (params: IReviews.Query) => {
  const newParams = formatParams(params)
  return getReviewsListApi(newParams)
}

// 切换房型详情展开/收起
const toggleRoom = (roomId: string) => {
  roomExpanded[roomId] = !roomExpanded[roomId]
}

// 格式化订单入住日期：提取 bookingCreateTime 字段，格式化为 "xxxx年x月"
const formatBookingDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}

const mapContainer = ref<HTMLElement | null>(null)
const hotelHistoryStore = useHotelHistoryStore()
onMounted(() => {
  // 1. 获取酒店详情
  getHotelsDetailApi({ id: hotelId })
    .then((res) => {
      hotelDetail.value = res.data
      console.log('查询酒店详情成功：', hotelDetail.value)
      var hotel: HotelHistory = {
        hotelId: hotelDetail.value?.hotelId ?? '',
        hotelName: hotelDetail.value?.hotelName ?? '',
        img: hotelDetail.value?.img ?? '',
        englishName: hotelDetail.value?.address ?? '',
      }
      hotelHistoryStore.addHotel(hotel)
      // 初始化地图（假设 hotelDetail 包含 lat 和 lng 字段）
      if (hotelDetail.value && hotelDetail.value.latitude && hotelDetail.value.longitude) {
        const map = L.map('map').setView(
          [hotelDetail.value.latitude, hotelDetail.value.longitude],
          13
        )
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)
        L.marker([hotelDetail.value.latitude, hotelDetail.value.longitude]).addTo(map)
      }
      // 2. 根据酒店ID获取房型列表数据
      return getRoomTypesListApi({ hotelId, limit: 10, page: 1 })
    })
    .then((res) => {
      roomTypesList.value = res.data.rows
      console.log('查询酒店房型列表成功：', roomTypesList.value)
      // 初始化房间展开状态
      roomTypesList.value.forEach(room => {
        roomExpanded[String(room.roomTypeId)] = false
      })
      // 3. 获取酒店评论列表数据
      return getReviewsList({ hotelId, limit: 10, page: 1 })
    })
    .then((res) => {
      reviewsList.value = res.data.rows
      console.log('查询酒店评论列表成功：', reviewsList.value)
      // 4. 为每条评论加载对应的用户视图数据（直接挂载到 review 对象上）
      return Promise.all(
        reviewsList.value.map((review) =>
          getUserTotalReviews({ id: Number(review.userId), bookingId: String(review.bookingId) })
            .then((userRes) => {
              review.userInfo = userRes.data
              return review
            })
        )
      )
    })
    .then(() => {
      console.log('加载评论对应用户视图数据成功：', reviewsList.value)
    })
    .catch((error) => {
      console.error('数据加载失败：', error)
    })
})
</script>

<style scoped>
.hotel-detail {
  padding: 20px;
}
.hotel-info-card {
  margin-bottom: 20px;
}
.card-header {
  line-height: 1.6;
}
.hotel-name {
  margin: 0;
}
.hotel-ename {
  color: #999;
  font-size: 14px;
}
.address,
.dates,
.description {
  margin-top: 5px;
  font-size: 14px;
}
.hotel-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
}
.map-container {
  position: relative;
}
.room-types {
  margin-bottom: 20px;
}
.room-list {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding-bottom: 10px;
}
.room-card {
  min-width: 250px;
  flex-shrink: 0;
}
.room-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.room-name {
  font-size: 16px;
}
.room-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}
.room-description {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}
.comments-section {
  margin-bottom: 20px;
}
.ratings-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.total-rating {
  margin-right: 20px;
  display: flex;
  align-items: center;
}
.score-text {
  margin-left: 5px;
  font-size: 16px;
  font-weight: bold;
}
.detailed-ratings .detail-rate {
  margin-bottom: 5px;
}
.comment-item {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}
.user-info {
  text-align: center;
}
.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 5px;
}
.user-name {
  font-weight: bold;
  margin-bottom: 3px;
}
.user-extra {
  font-size: 12px;
  color: #666;
}
.comment-content {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  position: relative;
}
.comment-time {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 12px;
  color: #999;
}
</style>
