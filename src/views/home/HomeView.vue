<template>
  <div class="home card">
    <div class="content-left">
      <DataPicker class="data-picker-container"/>
      <RecommendList class="recommend-list"/>
      <MapTemplate class="map-template"/>
    </div>
    <div class="content-right">
      <div class="sticky-wrapper">
        <el-image
          class="home-image"
          src='https://img1.tucang.cc/api/image/show/a1eaa434d66fb30d7bcff2a7f377b0c6'
          lazy
          fit="cover"
          alt="首页推荐图片">
        </el-image>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataPicker from './components/DataPicker.vue'
import RecommendList from './components/RecommendList.vue'
import MapTemplate from './components/MapTemplate.vue'
</script>

<style scoped lang="scss">
.home.card {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  padding: 24px;

  .content-left {
    flex: 1;
    margin-right: 24px;

    .data-picker-container,
    .recommend-list,
    .map-template {
      margin-bottom: 30px;
    }
  }

  .content-right {
    width: 400px; // 根据需要调整右侧宽度

    .sticky-wrapper {
      position: sticky;
      top: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .home-image {
      width: 100%;
      border-radius: 10px;  /* 圆角效果 */
      overflow: hidden;
    }

    .info-placeholder {
      margin-top: 15px;
      width: 100%;
      height: 80px; /* 根据需要调整 */
      background-color: #f0f0f0; /* 色块背景 */
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }
  }
}
</style>
