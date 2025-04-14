<template>
  <div class="table-box">
    <ReviewsForm></ReviewsForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  createReviewsApi
} from '@/api/modules/reviews/reviews';
import type { IReviews } from '@/api/interface/reviews/reviews';
import ReviewsForm from '@/views/reviews/reviews/components/ReviewsForm.vue';
defineOptions({
  name: 'ReviewsView'
})

</script>