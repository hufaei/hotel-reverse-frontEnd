import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: true, // 源映射开启
    rollupOptions: {
      output: {
        sourcemap: true 
      }
    }
  },
  server: {
    open: true, // 启动时自动打开浏览器
    port: 5173, // 设置开发服务器端口
    proxy: {
      '/api': {
        target: 'http://localhost:9991', // 目标服务器地址
        changeOrigin: true, // 是否改变源
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      }
    }
  },
})