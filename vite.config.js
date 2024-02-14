import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import ElementPlus from 'unplugin-element-plus/vite'

export default defineConfig({
  plugins: [
      ElementPlus(),
      vue(),
      AutoImport({
          import: ["vue"],
          resolvers: [
              ElementPlusResolver(),
              IconsResolver(),
          ],
      }),

      Components({
          resolvers: [
              // Auto register icon components
              // 自动注册图标组件
              IconsResolver({
                  enabledCollections: ['ep'],
              }),
              // Auto register Element Plus components
              // 自动导入 Element Plus 组件
              ElementPlusResolver(),
          ],

      }),
      Icons({
          autoInstall: true,
      }),
  ],



  server:{
    port: 3000,  //前端访问端口
    host: '0.0.0.0', //监听所有的ip地址
    proxy: {
      //如果以api开头，则走后端服务器8080端口，否则走本地3000端口
        '/api': {
            target: 'http://localhost:9595', //后端服务实际地址
            changeOrigin: true,
        }
    }
  },

    resolve: {
        alias: {
            // '@': path.resolve('./src')
        }
    },


})
