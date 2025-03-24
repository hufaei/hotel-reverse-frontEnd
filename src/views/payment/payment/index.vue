<template>
  <div class="table-box">
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CirclePlus,
  Delete,
  EditPen,
} from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import {
  createPaymentApi,
  removePaymentApi,
  updatePaymentApi,
  getPaymentListApi,
  getPaymentDetailApi,
} from '@/api/modules/payment/payment';
import { useHandleData } from '@/hooks';
import PaymentForm from '@/views/payment/payment/components/PaymentForm.vue';
import type { IPayment } from '@/api/interface/payment/payment';
defineOptions({
  name: 'PaymentView'
})

// 获取table列表
const getTableList = (params: IPayment.Query) => {
  let newParams = formatParams(params);
  return getPaymentListApi(newParams);
};
const formatParams = (params: IPayment.Query) =>{
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createdAt && (newParams.createdAtStart = newParams.createdAt[0]);
  newParams.createdAt && (newParams.createdAtEnd = newParams.createdAt[1]);
  delete newParams.createdAt;
  return newParams;
}
// 打开 drawer(新增、查看、编辑)
const openAddEdit = async(title: string, row: any = {}, isAdd = true) => {
  if (!isAdd) {
    const record = await getPaymentDetailApi({ id: row?.paymentId })
    row = record?.data
  }
}
// 删除信息
const deleteInfo = async (params: IPayment.Row) => {
  await useHandleData(
    removePaymentApi,
    { ids: [params.paymentId] },
    `删除【${params.paymentId}】支付单表`
  )
}
</script>