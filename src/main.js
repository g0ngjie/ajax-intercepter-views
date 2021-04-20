import Vue from 'vue'
import App from './App.vue'
import router from "./router";

import './element-plugin'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'

// 设置语言
locale.use(enLocale)

Vue.prototype.$ELEMENT = { size: 'mini' };
import "./index.scss"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
