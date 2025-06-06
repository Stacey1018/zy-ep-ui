
// ## ✅ 第五步：支持组件预览（可选）

// VitePress 原生支持 Vue SFC 组件渲染，只http://localhost:5174/guild/installation.html要你的组件注册在全局即可。

// 在 `docs/.vitepress/theme/index.ts` 中配置：

import DefaultTheme from 'vitepress/theme'
import HlFeComponent from '@healthlink/components' // 按需加载或全量导入组件
import '@healthlink/components/css' // 按需加载或全量导入组件
import 'element-plus/theme-chalk/src/index.scss'
import ElementPlus from 'element-plus'


export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(HlFeComponent)
    app.use(ElementPlus)
  }
}
