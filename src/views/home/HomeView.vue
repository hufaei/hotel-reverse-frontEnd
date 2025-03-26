<template>
  <div class="home card">
    <DataPicker class="data-picker-container"/>
    <RecommendList class="recommend-list"/>
  </div>
</template>

<script setup lang="ts">
import DataPicker from './components/DataPicker.vue';
import RecommendList from './components/RecommendList.vue';
</script>

<style scoped lang="scss">
.home.card {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 20px auto;
  padding: 24px;
  
  .data-picker-container {
    width: 100%;
    margin-bottom: 30px;
  }
  
  .recommend-list {
    width: 100%;
  }
}
</style>