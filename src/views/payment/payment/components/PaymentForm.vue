<template>
    <el-dialog
      :model-value="visible"
      title="订单支付"
      width="400px"
      @close="handleClose"
      :destroy-on-close="true"
    >
      <div class="payment-body">
        <!-- 支付详情 -->
        <div v-if="loading" class="loading-container">
          <el-spin />
        </div>
        <div v-else>
          <p class="amount">
            应付金额：<span class="amount-value">¥{{ paymentDetail?.amount}}</span>
          </p>
  
          <!-- 支付方式选择 -->
          <el-form label-width="80px">
            <el-form-item label="支付方式">
              <el-radio-group v-model="selectedMethod">
                <el-radio label="alipay">
                  <img src="@/assets/alipay.png" alt="支付宝" class="icon" /> 支付宝
                </el-radio>
                <el-radio label="wechat">
                  <img src="@/assets/wechat.png" alt="微信" class="icon" /> 微信支付
                </el-radio>
              </el-radio-group>
            </el-form-item>
  
            <!-- 支付原因（可选） -->
            <el-form-item label="备注">
              <el-input
                v-model="reason"
                placeholder="请输入支付备注（可选）"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
  
      <!-- 操作按钮 -->
      <template v-slot:footer>
<span  class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          :loading="paying"
          :disabled="loading || !selectedMethod"
          @click="doPay"
        >
          立即支付
        </el-button>
      </span>
</template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, watch, defineProps, defineEmits, onMounted } from 'vue';
  import { getPaymentDetailByBooking, paidApi } from '@/api/modules/payment/payment'; 
  import type { IPayment } from '@/api/interface/payment/payment';
  
  // 外部通过 v-model:visible 和 bookingId 控制打开与订单
  const props = defineProps<{
    visible: boolean;
    bookingId: number;
  }>();
  const emits = defineEmits<{
    (e: 'update:visible', v: boolean): void;
    (e: 'paid-success'): void;
  }>();
  
  // 本地状态
  const loading = ref(false);
  const paying = ref(false);
  const selectedMethod = ref<string>('alipay');
  const reason = ref<string>('');
  const paymentDetail = ref<IPayment.Row| null>(null);
  
  // 每次弹窗打开，拉取支付详情
  watch(
    () => props.visible,
    async (val) => {
        console.log(props.bookingId)
      if (val && props.bookingId) {
        loading.value = true;
        try {
          const res = await getPaymentDetailByBooking({ id: props.bookingId });
          console.log(res)
          // 假设接口返回 { paymentId, amount, currency, dueDate, status }
          paymentDetail.value =res.data;
        } finally {
          loading.value = false;
        }
      }
    },
    { immediate: true }
  );
  
  // 关闭弹窗
  function handleClose() {
    emits('update:visible', false);
    // 清空本地
    reason.value = '';
    selectedMethod.value = 'alipay';
  }
  
  // 执行支付
  async function doPay() {
    if (!paymentDetail.value?.paymentId) return;
    paying.value = true;
    try {
      await paidApi({
        paymentId: paymentDetail.value?.paymentId,
        reason: reason.value
      });
      emits('paid-success');
      handleClose();
    } finally {
      paying.value = false;
    }
  }
  </script>
  
  <style scoped>
  .payment-body {
    min-height: 120px;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
  }
  
  .amount {
    font-size: 16px;
    margin-bottom: 20px;
  }
  .amount-value {
    color: #f56c6c;
    font-weight: bold;
    font-size: 20px;
  }
  
  .icon {
    width: 24px;
    vertical-align: middle;
    margin-right: 6px;
  }
  
  .dialog-footer {
    text-align: right;
  }
  </style>
  