import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// import 'element-plus/dist/index.css'
import './styles/index.scss'
// import HlFeComponent from '@zy-ep-ui/src/index'

// import HlFeComponent from 'zy-ep-ui'
// import '@zy-ep-ui/theme/index.scss' // 引入组件库的样式

const app = createApp(App)

// app.use(HlFeComponent)
app.use(router)
app.mount('#app')
