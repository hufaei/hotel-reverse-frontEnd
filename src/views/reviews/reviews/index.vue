<template>
  <div class="table-box">
    <ReviewsForm></ReviewsForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  removeReviewsApi,
  getReviewsListApi,
  getReviewsDetailApi,
} from '@/api/modules/reviews/reviews';
import { useHandleData } from '@/hooks/index';
import ReviewsForm from '@/views/reviews/reviews/components/ReviewsForm.vue';
import type { IReviews } from '@/api/interface/reviews/reviews';

defineOptions({
  name: 'ReviewsView'
})

// 获取table列表
const getTableList = (params: IReviews.Query) => {
  let newParams = formatParams(params);
  return getReviewsListApi(newParams);
};
const formatParams = (params: IReviews.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createdAt && (newParams.createdAtStart = newParams.createdAt[0]);
  newParams.createdAt && (newParams.createdAtEnd = newParams.createdAt[1]);
  delete newParams.createdAt;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const reviewsRef = ref<InstanceType<typeof ReviewsForm>>()
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getReviewsDetailApi({ id: row?.reviewId })
    row = record?.data
  }
}
// 删除信息
const deleteInfo = async (params: IReviews.Row) => {
  await useHandleData(
    removeReviewsApi,
    { ids: [params.reviewId] },
    `删除【${params.reviewId}】用户评价表`
  )
}
// 批量删除信息
const batchDelete = async (ids: (string | number)[]) => {
  await useHandleData(removeReviewsApi, { ids }, '删除所选用户评价表')
}
</script>