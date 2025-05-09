<template>
  <div class="hotel-detail">
    <!-- 第一部分：酒店详情 Card -->
    <el-card class="hotel-info-card" shadow="hover">
      <div class="card-header">
        <!-- 左侧信息 -->
        <div class="hotel-info-left">
          <div style="display: flex;flex-direction: row; justify-content: space-between;">
            <h2 class="hotel-name">{{ hotelDetail?.hotelName }}</h2>
            <div style="width:30px;height:30px;cursor:pointer;" @click="toggleCollect">
              <img
                :src="isCollected ? collectedActiveIcon : collectedIcon"
                alt="收藏"
                class="collect-icon"
              />
            </div>
          </div>
          <div class="hotel-contact">
            电话：{{ hotelDetail?.contactPhone }} &nbsp;&nbsp;
            地址：{{ hotelDetail?.country }} {{ hotelDetail?.city }} {{ hotelDetail?.address }}
          </div>
          <div class="hotel-renovation">
            装修年份：{{ hotelDetail?.renovationYear ? hotelDetail.renovationYear : '不详' }}
          </div>
          <div class="hotel-main-info">
            <el-image
              style="width: 200px; height: 250px; flex: 1;"
              :src="hotelDetail?.img"
              lazy
              fit="cover"
            />
            <div class="hotel-description">
              {{ hotelDetail?.description }}
            </div>
          </div>
        </div>
        <!-- 右侧地图和交通图标 -->
        <div class="hotel-info-right">
          <div id="map" class="map-container"></div>
          <div class="traffic-icons">
            <template v-for="(item, index) in trafficList" :key="index">
              <el-tooltip
                effect="dark"
                :content="'距离' + item.name + item.distance + ' ' + item.transport + ' ' + item.duration"
                placement="top"
              >
                <div class="traffic-item">
                  <img
                    v-if="item.type === 'Airport'"
                    :src="airplaneIcon"
                    alt="飞机"
                    class="traffic-icon"
                  />
                  <img
                    v-else-if="item.type === 'RailwayStation'"
                    :src="trainIcon"
                    alt="火车"
                    class="traffic-icon"
                  />
                  <img
                    v-else-if="item.type === 'MetroEntrance'"
                    :src="metroIcon"
                    alt="地铁"
                    class="traffic-icon"
                  />
                  <div class="traffic-distance">{{ item.distance }}</div>
                </div>
              </el-tooltip>
            </template>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 第二部分：房型展示（卡片式列表，内嵌 Collapse 展开详细信息） -->
    <div class="room-types">
      <h3>房型展示</h3>
      <div class="room-list">
        <el-card
          v-for="room in roomTypesList"
          :key="room.roomTypeId"
          class="room-card"
          shadow="hover"
        >
          <!-- 卡片头部：图片、基本信息和 info 数据 -->
          <div class="room-card-header">
            <el-image
              :src="room.photoUrls"
              class="room-thumb"
              fit="cover"
              lazy
            />
            <div class="room-info-wrapper">
              <div class="room-basic-info">
                <div class="room-name">{{ room.roomType }}</div>
                <div class="room-price">￥{{ room?.price || '200' }}
                  <span style="color: darkgray;">当前剩余：{{ room.inventory ?? '—' }} 间</span>
                </div>
              </div>
              <!-- 将 info 数据以行列形式展示 -->
              <el-row :gutter="10" class="room-info-descriptions">
                <el-col
                  v-for="(value, key) in parseRoomInfo(String(room.info))"
                  :key="key"
                  :span="6"
                >
                  <div class="info-item">
                    <span class="info-label">{{ getInfoLabel(key) }}:</span>
                    <span class="info-value">{{ value }}</span>
                  </div>
                </el-col>
              </el-row>
              </div>
              <!-- 原来的“立即预订”按钮 -->
            <div class="room-book-btn">
              <el-button type="primary" @click="openDialog(room)">
                立即预订
              </el-button>
            </div>
          </div>
          <!-- 弹窗：确认预订信息 -->
          <el-dialog
            v-model="dialogVisible"
            width="480px"
            title="确认预订信息"
            :before-close="() => (dialogVisible = false)"
          >
          <p>即将创建订单，确认预订信息是否无误：</p>
          <!-- 日期范围选择器 -->
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :disabled-date="disablePastDate"
            style="width: 100%; margin-top: 12px;"/>
            <el-input v-model="userPhone" placeholder="预留手机号" />
            <span>预订房间数量</span>
            <el-input-number v-model="bookCount" :min="1" :max="10"/>
          <!-- 弹窗底部按钮 -->
          <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              :disabled="dateRange.length !== 2"
              @click="confirmBooking"
            >
              确定
            </el-button>
          </template>
        </el-dialog>
          <!-- 内嵌 Collapse 展开详细描述，使用网格布局 -->
          <el-collapse v-model="activeRoomDetails[String(room.roomTypeId)]" expand>
            <el-collapse-item :name="room.roomTypeId">
              <template #title>
                <span>查看详情</span>
              </template>
              <div class="room-detail-grid">
                <el-row :gutter="10">
                  <el-col
                    v-for="(value, key) in parseRoomDetail(String(room.description))"
                    :key="key"
                    :span="6"
                  >
                    <div class="detail-item">
                      <div class="detail-label">{{ key }}</div>
                      <div class="detail-value">{{ value }}</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </div>

    <!-- 第三部分：评论展示 -->
    <div class="comments-section">
      <h3>酒店评论</h3>
      <el-divider />
      <div class="ratings-header">
        <div class="total-rating">
          <span>总评分：</span>
          <el-rate :model-value="totalRating" disabled size="large"></el-rate>
          <span class="score-text">{{ totalRating }}</span>
        </div>
        <div class="detailed-ratings">
          <el-row>
            <el-col :span="12">
              <div class="detail-rate">
                <span>健康评分：</span>
                <el-rate :model-value="healthRate" disabled></el-rate>
              </div>
              <div class="detail-rate">
                <span>环境评分：</span>
                <el-rate :model-value="envRate" disabled></el-rate>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-rate">
                <span>服务评分：</span>
                <el-rate :model-value="serviceRate" disabled></el-rate>
              </div>
              <div class="detail-rate">
                <span>设施评分：</span>
                <el-rate :model-value="facilitiesRate" disabled></el-rate>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-divider />
      <div class="comments-list">
        <el-row
          v-for="review in reviewsList"
          :key="review.reviewId"
          class="comment-item"
          :gutter="20"
        >
          <el-col :span="6">
            <div class="user-info">
              <el-image
                src="https://img1.tucang.cc/api/image/show/c023f25f13c75149d280e93de3a185bf"
                fit="cover"
                class="user-avatar"
                lazy
              />
              <div class="user-name">{{ review.userInfo?.userName }}</div>
              <div class="user-extra">
                共点评{{ review.userInfo?.count }}条 <el-divider direction="vertical" />
                {{ formatBookingDate(review.createdAt ?? '') }}入住 <el-divider direction="vertical" />
                {{ review.userInfo?.roomType }}
              </div>
            </div>
          </el-col>
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
import { ref, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHotelsDetailApi,collectedApi,disCollectedApi } from '@/api/modules/hotels/hotels'
import { getReviewsListApi, getUserTotalReviews } from '@/api/modules/reviews/reviews'
import { getRoomTypesListApi } from '@/api/modules/roomtypes/roomTypes'
import type { IHotels } from '@/api/interface/hotels/hotels'
import type { IReviews } from '@/api/interface/reviews/reviews'
import type { IRoomTypes } from '@/api/interface/roomtypes/roomTypes'
import { useHotelHistoryStore, type HotelHistory } from '@/stores/hotelHistory'
import { getRoomTypeInventoryDetailApi } from '@/api/modules/roomtypeinventory/roomTypeInventory'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import airplaneIcon from '@/assets/飞机.png'
import trainIcon from '@/assets/火车.png'
import metroIcon from '@/assets/地铁.png'
import collectedIcon from '@/assets/收藏.png'            // 收藏未激活
import collectedActiveIcon from '@/assets/收藏-a.png'    // 收藏已激活
import { is } from '@/utils/is'

// ---- 响应式状态 ----
const dialogVisible = ref(false);
/** 存储用户在弹窗中选的起止日期，格式为 ['yyyy-MM-dd','yyyy-MM-dd'] */
const dateRange = ref<string[]>([]);
const userPhone = ref<string>('');
const bookCount = ref<number>(1);
/** 打开弹窗时，缓存当前房型信息 */
const selectedRoom = ref<IRoomTypes.Row | null>(null);

const route = useRoute()
const router = useRouter()
const hotelId = (route.params.id as string) || "JD0000001970"
// 收藏状态
const isCollected = ref(false)
const hotelDetail = ref<IHotels.Row | null>(null)
type IRoomWithInventory = IRoomTypes.Row & { inventory?: number }
const roomTypesList = ref<IRoomWithInventory[]>([])
const reviewsList = ref<IReviews.Row[]>([])
const trafficList = ref<TrafficItem[]>([])

// 用于房型卡片中 Collapse 展开状态管理（以房型 id 为 key，对应值为数组）
const activeRoomDetails = reactive<Record<string, string[]>>({})

// 切换收藏
async function toggleCollect() {
  try {
    if(isCollected.value) {
      await disCollectedApi({ id: hotelId })
    }else{
      await collectedApi({ id: hotelId })
    }
    isCollected.value = !isCollected.value
  } catch (error) {
    console.error('收藏状态切换失败：', error)
  }
}
// 初始化时为每个房型初始化状态
watch(roomTypesList, (newList) => {
  newList.forEach(room => {
    if (!activeRoomDetails[String(room.roomTypeId)]) {
      activeRoomDetails[String(room.roomTypeId)] = []
    }
  })
})

const totalRating = ref(4.5)
const healthRate = ref(4)
const envRate = ref(4.2)
const serviceRate = ref(4.8)
const facilitiesRate = ref(4.3)

const formatParams = (params: IReviews.Query) => {
  const newParams = JSON.parse(JSON.stringify(params))
  if (newParams.createdAt) {
    newParams.createdAtStart = newParams.createdAt[0]
    newParams.createdAtEnd = newParams.createdAt[1]
    delete newParams.createdAt
  }
  return newParams
}

const getReviewsList = (params: IReviews.Query) => {
  const newParams = formatParams(params)
  return getReviewsListApi(newParams)
}

const formatBookingDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}

interface TrafficItem {
  type: string         // Airport, RailwayStation, MetroEntrance
  name: string
  distance: string     // 例如 "19.2公里"
  transport: string    // 例如 "驾车" 或 "步行"
  duration: string     // 例如 "20分钟"
}

function parseTraffic(trafficStr: string): TrafficItem[] {
  return trafficStr.split('###').map(item => {
    const parts = item.split(',')
    return {
      type: parts[0],
      name: parts[1],
      distance: parts[2],
      transport: parts[3],
      duration: parts[4]
    }
  })
}

// 解析房型 info 数据（假设为 JSON 格式字符串）
function parseRoomInfo(infoStr: string): Record<string, string> {
  try {
    return JSON.parse(infoStr)
  } catch (e) {
    return {}
  }
}

// 将 info key 转换为描述性标签
function getInfoLabel(key: string): string {
  const infoLabelMap: Record<string, string> = {
    floor: "楼层",
    checkin: "入住人数",
    wifi: "WIFI",
    bed: "床型",
    area: "面积(㎡)",
    window: "窗户",
    smoke: "吸烟",
    breakfast: "早餐"
  }
  return infoLabelMap[key] || key
}

// 解析房型详细描述文本，将各类别分离后返回对象
function parseRoomDetail(detailStr: string): Record<string, string> {
  const detailObj: Record<string, string> = {}
  const unified = detailStr.replace(/；/g, ";")
  const segments = unified.split(";").filter(s => s.trim() !== "")
  segments.forEach(segment => {
    const parts = segment.split(":")
    if (parts.length >= 2) {
      const key = parts[0].trim()
      const value = parts.slice(1).join(":").trim()
      detailObj[key] = value
    }
  })
  return detailObj
}
/** 点击“立即预订”时打开弹窗，并保存房型 */
function openDialog(room: IRoomTypes.Row) {
  selectedRoom.value = room;
  // 清空上次的日期
  dateRange.value = [];
  dialogVisible.value = true;
}

/** 限制只能选今天及往后日期 */
function disablePastDate(date: Date) {
  // 将“今天 00:00”转为时间戳，日期小于该值即为禁用
  const todayStart = new Date().setHours(0, 0, 0, 0);
  return date.getTime() < todayStart;
}

/** 点击“确定”时，校验并跳转到下一个页面 */
function confirmBooking() {
  if (
    !selectedRoom.value ||
    dateRange.value.length !== 2
  ) {
    return;
  }
  const [startDate, endDate] = dateRange.value;
  router.push({
    path: '/payments',
    query: {
      roomTypeId: selectedRoom.value.roomTypeId?.toString() || '',
      userPhone: userPhone.value,
      bookCount: bookCount.value,
      hotelId,
      startDate,
      endDate,
    },
  });
  dialogVisible.value = false;
}
onMounted(() => {
  getHotelsDetailApi({ id: hotelId })
    .then((res) => {
      hotelDetail.value = res.data
      totalRating.value = hotelDetail.value?.rate ?? 4.5
      // 记录浏览历史（示例）
      const hotelHistoryStore = useHotelHistoryStore()
      const hotel: HotelHistory = {
        hotelId: hotelDetail.value?.hotelId ?? '',
        hotelName: hotelDetail.value?.hotelName ?? '',
        img: hotelDetail.value?.img ?? '',
        englishName: hotelDetail.value?.address ?? ''
      }
      hotelHistoryStore.addHotel(hotel)

      // 解析交通数据
      const trafficDataStr = hotelDetail.value?.traffic ?? ''
      trafficList.value = parseTraffic(trafficDataStr)

      // 初始化地图
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

      // 获取房型列表数据
      return getRoomTypesListApi({ hotelId, limit: 10, page: 1 })
    })
    .then((res) => {
      roomTypesList.value = res.data.rows
      Promise.all(
        roomTypesList.value.map((room) =>
          getRoomTypeInventoryDetailApi({ roomTypeId : room.roomTypeId ?? '' })
            .then((detailRes) => {
              room.inventory = detailRes.data.availableQuantity
              return room
            })
        )
      )
      // 获取酒店评论列表数据
      return getReviewsList({ hotelId, limit: 10, page: 1 })
    })
    .then(async (res) => {
      // 先拿到原始数组
      reviewsList.value = res.data.rows

      // 顺序调用：for…of + await
      const sequenced: typeof reviewsList.value = []
      for (const review of reviewsList.value) {
        const userRes = await getUserTotalReviews({
          id: Number(review.userId),
          bookingId: String(review.bookingId)
        })
        review.userInfo = userRes.data
        sequenced.push(review)
      }

      return sequenced
  })
    .catch((error) => {
      console.error('数据加载失败：', error)
    })
})
</script>

<style scoped>
.hotel-detail {
  padding: 20px;
  background-color: #f5f7fa;
}

/* 酒店详情 Card */
.hotel-info-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.hotel-info-left {
  flex: 1;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hotel-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.hotel-contact {
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
}

.hotel-renovation {
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
}

.hotel-main-info {
  width: 100%;
  display: flex;
}

.hotel-description {
  flex: 1;
  margin-left: 20px;
  font-size: 14px;
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 10;
  overflow: hidden;
}

.hotel-info-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.map-container {
  width: 100%;
  height: 300px;
  border-radius: 4px;
  overflow: hidden;
}

.traffic-icons {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}

.traffic-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.traffic-icon {
  width: 28px;
  height: 28px;
}

.traffic-distance {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 房型展示 */
.room-types {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.room-types h3 {
  font-size: 20px;
  margin-bottom: 15px;
}

.room-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 房型卡片 */
.room-card {
  padding: 15px;
}

/* 卡片头部 */
.room-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.room-thumb {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.room-info-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.room-basic-info {
  margin-bottom: 10px;
}

.room-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.room-price {
  font-size: 16px;
  color: #f56c6c;
}

/* 横向 info 展示 */
.room-info-descriptions {
  margin: 10px 0;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: bold;
  margin-right: 3px;
}

.info-value {
  color: #555;
}

/* 预订按钮 */
.room-book-btn {
  margin-top: 10px;
  text-align: right;
}

/* 展开详情的网格布局 */
.room-detail-grid {
  margin-top: 10px;
}

.detail-item {
  padding: 5px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 10px;
}

.detail-label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 3px;
}

.detail-value {
  font-size: 14px;
  color: #555;
}

/* 评论展示 */
.comments-section {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
}

.comments-section h3 {
  font-size: 20px;
  margin-bottom: 15px;
}

.ratings-header {
  margin-bottom: 15px;
}

.total-rating {
  display: flex;
  align-items: center;
}

.total-rating .score-text {
  margin-left: 8px;
  font-size: 16px;
  color: #333;
}

.detailed-ratings .detail-rate {
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

.comments-list .comment-item {
  margin-bottom: 20px;
}

.user-info {
  text-align: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 8px;
}

.user-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.user-extra {
  font-size: 12px;
  color: #999;
}

.comment-content {
  font-size: 16px;
  color: #555;
  margin-top: 18px;
}

.comment-time {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: #999;
  margin-top: 80px;
}
</style>
