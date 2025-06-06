import HlBaseButton from './index.vue'
import { withInstall } from '../../../utils/index' // 引入utils中的withInstall方法

export { HlBaseButton } // 这里也是为了按需引入组件设置的，这样在使用组件库时可以  import { HlBaseButton } from 'hl-fe-components' 直接引入组件
export default withInstall(HlBaseButton)
