import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import diretivesObj from '@/utils/directives'
// import hljs from 'highlight.js'  为了优化打包的体积
import 'highlight.js/styles/default.css' // 代码高亮的样式
import './VantRegister' // 注册vant组件

// Vue.directive('highlight', function (el) { // 自定义一个代码高亮指令
//   const highlight = el.querySelectorAll('pre, code') // 获取里面所有pre或者code标签
//   highlight.forEach((block) => {
//     hljs.highlightBlock(block) // 突出显示pre和code内标签, 并自动识别语言, 添加类名和样式
//   })
// })

Vue.use(diretivesObj)
Vue.config.productionTip = false
if (process.env.NODE_ENV !== 'development') { // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
// 生产环境下让所有打印失效
  console.log = function () { }
  console.error = function () { }
  console.dir = function () { }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
