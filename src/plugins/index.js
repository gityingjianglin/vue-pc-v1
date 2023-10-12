import cache from './cache'
import modal from './modal'
import respondPlugin from './respondPlugin'
import tab from './tab'
export default {
  install(Vue) {
    // 缓存对象
    Vue.prototype.$cache = cache
    // 模态框对象
    Vue.prototype.$modal = modal
    // 页签操作
    Vue.prototype.$tab = tab
    Vue.use(respondPlugin)
  }
}
