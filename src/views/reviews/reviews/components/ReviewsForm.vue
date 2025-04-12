<template>
    <div class="reviews-view">
      <el-card class="review-card" shadow="hover">
        <div class="card-header">订单评价</div>
        <el-form label-width="120px" class="review-form">
          <el-form-item label="整体评分">
            <el-rate v-model="rating" :colors="colors" :texts="texts" show-text></el-rate>
          </el-form-item>
          <el-form-item label="卫生评分">
            <el-rate v-model="healthRate" :colors="colors" :texts="texts" show-text></el-rate>
          </el-form-item>
          <el-form-item label="环境评分">
            <el-rate v-model="envRate" :colors="colors" :texts="texts" show-text></el-rate>
          </el-form-item>
          <el-form-item label="服务评分">
            <el-rate v-model="serviceRate" :colors="colors" :texts="texts" show-text></el-rate>
          </el-form-item>
          <el-form-item label="设施评分">
            <el-rate v-model="facilitiesRate" :colors="colors" :texts="texts" show-text></el-rate>
          </el-form-item>
          <el-form-item label="评价内容">
            <el-input
              type="textarea"
              :rows="4"
              v-model="comment"
              placeholder="请输入您的评价"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交评价</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const rating = ref(0)
  const healthRate = ref(0)
  const envRate = ref(0)
  const serviceRate = ref(0)
  const facilitiesRate = ref(0)
  const comment = ref('')
  const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
  const texts=ref(['oops', 'disappointed', 'normal', 'good', 'great'])
  // 此处仅用于展示页面样式，点击提交仅输出控制台信息
  const handleSubmit = () => {
    console.log('提交评价', {
      rating: rating.value,
      healthRate: healthRate.value,
      envRate: envRate.value,
      serviceRate: serviceRate.value,
      facilitiesRate: facilitiesRate.value,
      comment: comment.value
    })
  }
  </script>
  
  <style scoped>
  .reviews-view {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
  }
  
  .review-card {
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
  }
  
  .card-header {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }
  
  .review-form .el-form-item {
    margin-bottom: 20px;
  }
  </style>
  