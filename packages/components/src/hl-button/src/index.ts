import HlButton from './index.vue'
import { withInstall } from '../../../utils/index' // 引入utils中的withInstall方法

export { HlButton } // 这里也是为了按需引入组件设置的，这样在使用组件库时可以  import { HlButton } from 'zy-ep-ui' 直接引入组件
export default withInstall(HlButton)
