<template>
    <el-card class="hotel-search-card">
      <!-- 第一行：目的地输入框 -->
      <div class="input-row">
        <el-autocomplete
          v-model="keyWords"
          :fetch-suggestions="querySearch"
          placeholder="位置/品牌/酒店"
          @select="handleSelect"
          class="input-keyWords"
        />
        <el-input
        v-model="location"
        placeholder="输入地点（例如：北京）"
        class="input-location"
      />
      </div>
  
      <!-- 第二行：日期范围选择器 -->
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
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  
  const keyWords = ref('');
  const location = ref('');
  const dateRange = ref([]);
  const stayInfo = ref('');
  
  // 示例城市数据
  const cities = [
    { value: '上海（市）' },
    { value: '上饶（县）' },
    { value: '北京（市）' },
    { value: '深圳（市）' },
    { value: '广州（市）' },
    // 可以根据需要继续添加城市
  ];
  
  // 默认时间设置（入住时间为14:00，离店时间为12:00）
  const defaultTime = [
    new Date(2000, 0, 1, 14, 0), // 入住时间默认14:00
    new Date(2000, 0, 1, 12, 0), // 离店时间默认12:00
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
  
  // 搜索酒店操作
  const searchHotels = () => {
    if (!keyWords.value) {
      ElMessage.error('请输入关键词');
      return;
    }
    if (!location.value) {
      ElMessage.error('请输入目的地');
      return;
    }
    if (!dateRange.value || dateRange.value.length !== 2) {
      ElMessage.error('请选择入住和离店日期');
      return;
    }
    // 执行搜索操作，例如调用API或路由跳转
    console.log('搜索酒店', {
      location: location.value,
      keyWords: keyWords.value,
      dateRange: dateRange.value,
    });
  };
  
  // 查询匹配的城市
  const querySearch = (queryString, cb) => {
    const results = queryString
      ? cities.filter(createFilter(queryString))
      : cities;
    cb(results);
  };
  
  // 创建过滤器
  const createFilter = (queryString) => {
    return (city) => {
      return city.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    };
  };
  
  // 处理选择的城市
  const handleSelect = (item) => {
    console.log('选中城市:', item);
  };
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
  