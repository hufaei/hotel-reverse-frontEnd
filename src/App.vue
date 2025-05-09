<template>
  <div id="app">
    <!-- 只有当用户不在登录或注册页面时才显示导航栏 -->
    <navBar v-if="!isAuthPage && !$route.path.startsWith('/admins')" />
    <router-view />
    <FixedIcons />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router'; // 引入 useRoute 来访问当前路由
import { useUserStore } from '@/stores/userStore';
import navBar from '@/components/NavBar.vue';
import FixedIcons from './components/FixedIcons.vue';
const userStore = useUserStore();
const route = useRoute(); // 获取当前路由
const goEasy = inject('goEasy') as any;
const isConnected = ref(false);
// 检查当前页面是否为登录或注册页面
const isAuthPage = ref(route.name === 'Login' || route.name === 'Register' || route.name === 'Forgot');

// 监听路由变化，实时更新 isAuthPage 状态
watch(route, (newRoute) => {
  isAuthPage.value = newRoute.name === 'Login' || newRoute.name === 'Register' || route.name === 'Forgot';
});

// 连接到 GoEasy
const connectGoEasy = async () => {
  const currentUser = userStore.user;
  if (!currentUser) return;
  
  try {
    goEasy.connect({
      id: currentUser.userId.toString(),
      data: {
        nickname: currentUser.username,
        email: currentUser.email || ''
      },
      onSuccess: function () {
        console.log('GoEasy connected successfully.');
        isConnected.value = true;
      },
      onFailed: function (error: { code: string; content: string }) {
        console.log('Failed to connect GoEasy, code:' + error.code + ', error:' + error.content);
      },
      onProgress: function (attempts: any) {
        console.log('GoEasy is connecting', attempts);
      }
    });
  } catch (error) {
    console.error('Failed to connect to GoEasy:', error);
  }
};

// 在组件挂载时连接 GoEasy
onMounted(async () => {
  if (userStore.user) {
    await connectGoEasy();
    var pubsub = goEasy.pubsub;
    pubsub.subscribe({
      channel: "channel_comment",//替换为您自己的channel
      onMessage: function (message:any) {
          //收到消息
          console.log("Channel:" + message.channel + " content:" + message.content);
      },
      onSuccess: function () {
          console.log("Channel订阅成功。");
      },
      onFailed: function (error:any) {
          console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
      }
  });
  } else {
    watch(() => userStore.user, (newUser) => {
      if (newUser) {
        connectGoEasy();
      }
    });
  }
});

// 提供 GoEasy 实例和连接状态
provide('goEasy', goEasy);
provide('isConnected', isConnected);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-image: url(https://s1.hdslb.com/bfs/static/blive/blfe-message-web/static/img/light_bg.8e46311e.png);
  background-size: cover; /* 背景图像覆盖整个容器 */
  background-repeat: no-repeat; /* 背景不重复 */
  background-position: center center; /* 背景居中显示 */
  color: #2c3e50;
}

</style>