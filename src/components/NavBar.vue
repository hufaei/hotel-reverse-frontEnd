<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    :ellipsis="false"
    active-text-color="#000000"
  >
    <el-menu-item index="UserHome">
      <el-icon><img src="@/assets/main.png" alt="首页" class="nav-icon"></el-icon>
      首 页
    </el-menu-item>
    <el-menu-item index="home">
      <el-icon><img src="@/assets/sections.png" alt="预订" class="nav-icon"></el-icon>
      酒 店 预 订
    </el-menu-item>
    <el-menu-item index="Orders">
      <el-icon><img src="@/assets/publish.png" alt="订单" class="nav-icon"></el-icon>
      我 的 订 单
    </el-menu-item>
    <div class="flex-grow" />

    <!-- 用户已登录时显示头像和下拉菜单 -->
    <el-dropdown v-if="isLoggedIn" class="avatar-container" trigger="hover" @command="handleCommand">
      <div class="avatar-wrapper">
        <span class="nickname">{{ user.username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="UserHome">
            <el-icon><img src="@/assets/user.png" alt="用户中心" class="nav-icon"></el-icon>
            用户中心
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided>
            <el-icon><img src="@/assets/logout.png" alt="登出" class="nav-icon"></el-icon>
            登出
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 用户未登录时显示登录按钮 -->
    <el-menu-item v-else @click="goToLogin">
      <el-icon><img src="@/assets/user.png" alt="未登录" class="nav-icon"></el-icon>
      登录
    </el-menu-item>

    <!-- 私信消息按钮，未登录时点击提示登录 -->
    <el-menu-item index="Notifications" @click="handleChatClick">
      <mi-notice 
        :width="320"
        :dot="false"
        :amount="unreadTotal"
        :max-amount="9"
        :icon-setting="{ size: 20 }"
        class="message-icon">
        <template #icon>
          <img src="@/assets/private.png" alt="私信" class="nav-icon">
        </template>
      </mi-notice>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import { logoutApi } from '@/api/modules/system/login';


const router = useRouter();
let userStore = useUserStore();
const isLoggedIn = ref<boolean>(false); // 根据是否存在 token 判断用户是否已登录
const activeIndex = ref('home');
const unreadTotal = ref(0);
let user = userStore.user;
const goEasy = inject('goEasy') as any;
const isConnected = inject('isConnected') as any;

// 获取未读消息数量
const fetchUnreadMessages = async () => {
  if (goEasy && isConnected && isLoggedIn.value) {
    try {
      goEasy.im.latestConversations({
        onSuccess: (result: any) => {
          console.log('Fetched unread messages:', result);
          unreadTotal.value = result.content.unreadTotal; // result.content 包含 unreadTotal
        },
        onFailed: (error: any) => {
          console.error('Failed to get the latest conversations, code:', error.code, ' content:', error.content);
        }
      });
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }
};


var onConversationsUpdated = function (content:any) {
  unreadTotal.value = content.unreadTotal;
};



// 监听 isConnected 的变化
watch(isConnected, (newValue) => {
  if (newValue) {
    fetchUnreadMessages();
    //监听会话列表更新
    goEasy.im.on(goEasy.IM_EVENT.CONVERSATIONS_UPDATED, onConversationsUpdated);
  }
});


onMounted(() => {
  const hasReloaded = sessionStorage.getItem('hasReloaded');
  if (hasReloaded !== 'true') {
    sessionStorage.setItem('hasReloaded', 'true');
    window.location.reload();
  } 

  if (user.username && userStore.token) {
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
  }

  
  if (isConnected.value) {
    fetchUnreadMessages();
  }

});   

const handleCommand = (command: string) => {

  switch (command) {
    case 'logout':
      handleLogout();
      break;
    default:
      router.push({ name: command });
      break;
  }
};

const handleSelect = (key: string) => {
  console.log(key);
  if (key === 'logout') {
    handleLogout();
  } else {
    router.push({ name: key });
  }
};

const handleLogout = async () => {
  const success = await logoutApi();
  if (success) {
    isLoggedIn.value = false; // 更新登录状态
    userStore.clear(); // 清除用户
    user = userStore.user;
    router.push({ name: 'home' }); // 登出后导航到首页
  }
};

const goToLogin = () => {
  router.push({ name: 'Login' });
};

const handleChatClick = () => {
  if (!isLoggedIn.value) {
    ElMessage.error('请先登录后再查看通知');
  } else {
    router.push({ name: 'Notifications' });
  }
};

onBeforeUnmount(() => {
  // 重置 `hasReloaded` 标志
  sessionStorage.setItem('hasReloaded', 'false'); // 或者使用 sessionStorage.removeItem('hasReloaded');
});
</script>

<style scoped>
.el-menu-demo {
  align-items: center;
  background: azure;
  color: black;
}

.flex-grow {
  flex-grow: 1;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.el-menu-item, .el-sub-menu__title {
  display: flex;
  align-items: center;
}

.avatar-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nickname {
  margin-left: 8px;
  color: #1d1d1d;
}

.message-icon {
  display: flex;
  align-items: center;
  margin-left: 15px;
  margin-right: 15px; /* Add margin-right to separate it from the avatar */
}
</style>
