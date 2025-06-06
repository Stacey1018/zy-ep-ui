import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import { HlElementResolver } from zy-ep-ui''
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@zy-ep-ui': path.resolve(__dirname, '../packages/components'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "~/styles/hl/index.scss" as vars;@use "zy-ep-ui/theme/element-theme.scss" as *;`,
        additionalData: `@use "~/styles/hl/index.scss" as vars;`,
        // additionalData: `@use "zy-ep-ui/theme/element-theme.scss" as *;`,
      },
    },
  },
  optimizeDeps: {
    include: ['element-plus', 'vue-advanced-cropper'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      // 显式包含需要转换的依赖
      include: [/vue-advanced-cropper/, /node_modules/],
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        // HlElementResolver(),
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
  ],

  server: {
    port: 3333,
  },
})
