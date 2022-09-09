import Vue from 'vue'
// 自定义指令
// 插件对象(必须有install方法, 才可以注入到Vue.use中)
export default {
  install () {
    Vue.directive('fofo', {
      inserted (el) {
        fn(el)
      },
      update (el) {
        fn(el)
      }
    })
  }
}
function fn (el) {
  if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
    // 如果直接是input标签/textarea标签
    el.focus()
  } else {
    // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
    const inp = el.querySelector('input')
    const textArea = el.querySelector('textarea')
    // 如果找到了
    if (inp || textArea) {
      inp && inp.focus()
      textArea && textArea.focus()
    } else {
      // 本身也不是, 子标签里也没有
      console.error('请把v-fofo用在输入框标签上')
    }
  }
}
