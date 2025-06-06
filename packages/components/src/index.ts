import type { App, Plugin } from 'vue'
import * as components from './component'
export * from './component' // 用于按需导入
export { HlElementResolver } from '../utils/resolver'
import '../styles/index.scss' // 引入全局样式

export const install = function (app: App) {
  Object.values(components).forEach((component) => {
    if (component.name) {
      app.use(component as unknown as Plugin)
    }
  })
  return app // 用于支持链式调用，例如: app.use(A).use(B)
}

export default {
  install,
}
