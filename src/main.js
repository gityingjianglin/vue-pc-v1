import Vue from 'vue'
import App from './App.vue'
import plugins from './plugins' // plugins
import router from './router'
import store from './store'
import filters from './assets/filter/filter.js'
import element from './uiConfig/elementUi'
import wlkjUtils from 'wlkj-utils'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import VConsole from 'vconsole'
// import ECharts modules manually to reduce bundle size
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { ApmVuePlugin } from '@elastic/apm-rum-vue'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart,
  GaugeChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  TitleComponent,
  DataZoomComponent,
  VisualMapComponent,
  GraphicComponent
} from 'echarts/components'


// 挂载elastic run 插件
Vue.use(ApmVuePlugin, {
  router,
  config: {
    // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
    serviceName: 'client-pmp',
    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: '/stage-api-apm',
    // Set service version (required for sourcemap feature)
    serviceVersion: '',
    // 设置服务环境
    environment: 'production'
  }
})
let isIhaier = /Lark/.test(navigator.userAgent)
if (window.location.href.includes('sit') && isIhaier) {
  let vconsole = new VConsole()
  console.log(vconsole)
}
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  DataZoomComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  GraphicComponent
]);
Vue.component('v-chart', ECharts)
Vue.use(VueAwesomeSwiper)
Vue.use(element)
Vue.use(plugins)
Vue.prototype.$wlkjUtils = wlkjUtils
console.log(wlkjUtils.date.parseTime(1673407269))

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// register globally (or you can do it locally)

Vue.config.productionTip = false

let rootVue = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
export default rootVue