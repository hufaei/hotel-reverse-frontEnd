<template>
  <el-card class="hotel-search-card">
    <!-- 第一行：目的地输入框 -->
    <div class="input-row">
      <el-autocomplete
        v-model="keyWords"
        placeholder="位置/品牌/酒店"
        class="input-keyWords"
      />
      <el-input
        v-model="location"
        placeholder="输入地点（例如：北京）"
        class="input-location"
      />
    </div>

    <!-- 第二行：日期范围选择器（保留显示，但不作为搜索必填项） -->
    <div class="input-row">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="入住时间"
        end-placeholder="离店时间"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
        :default-time="defaultTime"
        :shortcuts="shortcuts"
        :disabled-date="disabledDate"
        @change="calculateStayDuration"
      />
      <span v-if="stayInfo" class="stay-info">{{ stayInfo }}</span>
    </div>

    <!-- 第三行：搜索按钮 -->
    <div class="button-row">
      <el-button type="primary" @click="searchHotels">搜索酒店</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref ,defineEmits, onMounted} from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/userSearchStore';

const emit = defineEmits(['search']);
const router = useRouter();

const keyWords = ref('');
const location = ref('');
const dateRange = ref([]);
const stayInfo = ref('');
const searchStore = useSearchStore();
// 默认时间设置（入住时间为14:00，离店时间为12:00）
const defaultTime = [
  new Date(2000, 0, 1, 14, 0),
  new Date(2000, 0, 1, 12, 0),
];

// 快捷选项
const shortcuts = [
  {
    text: '今天',
    value: () => {
      const start = new Date();
      const end = new Date();
      start.setHours(14, 0, 0);
      end.setHours(12, 0, 0);
      end.setDate(end.getDate() + 1);
      return [start, end];
    },
  },
  {
    text: '明天',
    value: () => {
      const start = new Date();
      const end = new Date();
      start.setDate(start.getDate() + 1);
      end.setDate(end.getDate() + 2);
      start.setHours(14, 0, 0);
      end.setHours(12, 0, 0);
      return [start, end];
    },
  },
];

// 禁用今天之前的日期
const disabledDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// 计算入住天数和夜晚数
const calculateStayDuration = (dates) => {
  if (dates && dates.length === 2) {
    const [start, end] = dates.map((date) => new Date(date));
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    stayInfo.value = `${days}晚`;
  } else {
    stayInfo.value = '';
  }
};

// 搜索酒店操作：只要求至少填写一个关键词，合并两项后跳转到 /bookings 页面
const searchHotels = () => {
  if (!keyWords.value && !location.value) {
    ElMessage.error('请输入搜索关键词或地点')
    return
  }
  // 更新全局 Store
  searchStore.$patch({
    keywords: keyWords.value,
    location: location.value,
    dateRange: dateRange.value
  })
  // 跳转到 bookings 页面，无需再传 query
  router.push('/bookings')
  // 触发自定义事件，让父组件处理搜索逻辑
  emit('search');
};
onMounted(() => {
  keyWords.value = searchStore.keywords
  location.value = searchStore.location
  dateRange.value = searchStore.dateRange
})
</script>

<style lang="scss" scoped>
.hotel-search-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  .input-row {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;

    .input-keyWords {
      flex: 1;
    }

    .el-date-picker {
      flex: 1;
    }

    .stay-info {
      align-self: center;
      margin-left: 10px;
      font-size: 14px;
      color: #666;
    }
  }

  .button-row {
    text-align: center;
  }
}
</style>
