<template>
  <div class="account-security">
    <!-- 登录密码 -->
    <el-card class="security-card">
      <div class="card-content">
        <div class="card-left">
          <span class="card-title">登录密码</span>
          <p class="hint">建议定期更换</p>
        </div>
        <div class="card-middle">
          <p>
            安全性高的密码可以使账号更安全。建议您定期更换密码，
            且设置一个包含数字和字母，并且长度超过8位以上的密码。
          </p>
        </div>
        <div class="card-right">
          <el-button type="primary" size="small" @click="handleAction('password')">
            修改
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 绑定手机 -->
    <el-card class="security-card">
      <div class="card-content">
        <div class="card-left">
          <span class="card-title">绑定手机</span>
          <p class="phone-number">{{ user.phone || '无' }}</p>
        </div>
        <div class="card-middle">
          <p>
            绑定手机后，您即可享受手机号登录、动态码登录、找回密码等。为了帐号安全，
            建议您在更换手机号后第一时间更换绑定手机。
          </p>
        </div>
        <div class="card-right">
          <el-button type="primary" size="small" @click="handleAction('phone')">
            {{ user.phone ? '修改' : '设置绑定' }}
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 绑定邮箱 -->
    <el-card class="security-card">
      <div class="card-content">
        <div class="card-left">
          <span class="card-title">绑定邮箱</span>
          <p class="email-address">{{ user.email || '无' }}</p>
        </div>
        <div class="card-middle">
          <p>
            绑定E‑mail后，您即可使用E‑mail登录或找回密码等。
          </p>
        </div>
        <div class="card-right">
          <el-button type="primary" size="small" @click="handleAction('email')">
            {{ user.email ? '修改' : '设置绑定邮箱' }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore';

const router = useRouter()
const userStore = useUserStore()

// 直接使用 store 中的用户信息
const user = computed(() => ({
  phone: userStore.user.phone,
  email: userStore.user.email
}))

function handleAction(type: string) {
  switch (type) {
    case 'password':
      router.push('/forget')
      break
    case 'phone':
      // router.push(user.value.phone ? '/modify-phone' : '/bind-phone')
      break
    case 'email':
      // router.push(user.value.email ? '/modify-email' : '/bind-email')
      break
    default:
      break
  }
}
</script>

<style scoped>
.account-security {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.security-card {
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  height: 150px;
}

.card-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 16px;
}

.card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-middle {
  flex: 3;
  padding: 0 20px;
}

.card-right {
  flex: 1;
  text-align: right;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.hint {
  color: #909399;
  font-size: 14px;
  margin-bottom: 5px;
}

.phone-number,
.email-address {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 5px;
}
</style>
