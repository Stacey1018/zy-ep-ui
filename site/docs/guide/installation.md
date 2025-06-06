# 使用 `hl-fe-components`

本节将介绍如何在项目中使用 hl-fe-components。

## 环境支持

::: tip 当前封装所使用的库版本

- element-plus 版本为： `^2.9.8+`
- vue 版本为： `^3.5.13+`
  :::

## 安装

### 1. 使用包管理器

```shell
# pnpm
pnpm install xxx
```

## 快速开始

### 1. 完整引入

`hl-fe-components` 将会在 Vue 应用中进行**全局组件注册**。

```js
// main.js
import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import router from "./router"

import HlFeComponent from "@healthlink/components"
import "@healthlink/components/dist/es/component.css" // 引入组件库的样式
import "element-plus/theme-chalk/src/index.scss" // 引入element-ui的样式

const app = createApp(App)

app.use(HlFeComponent)
app.use(router)
app.mount("#app")
```

### 2. 按需引入

1. 配置按需引入

```js
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import { HlElementResolver } from "@healthlink/components"

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["element-plus", "@healthlink/components"],
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        HlElementResolver(), // 按需引入
        ElementPlusResolver({
          importStyle: "sass",
        }),
      ],
      // include: [/\.vue$/, /\.vue\?vue/, /\.ts$/, /\.tsx$/, /\.js$/, /\.jsx$/],
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

2. 引入样式文件。

```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import '@healthlink/components/dist/es/component.css' // 引入组件库的样式
import 'element-plus/theme-chalk/src/index.scss'

const app = createApp(App)

app.use(router)
app.mount('#app')

```

## 注意事项

::: danger 关于原生库
组件库打包时会对第三方包如 `element-ui` 、`vue` 进行 `externals` 处理，所以务必保证使用组件的项目中导入必须要的第三方库。
:::
