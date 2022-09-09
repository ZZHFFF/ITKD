// 不要手动写绝对路径, 用代码来动态获取 绝对地址
const path = require('path')
// console.log(__dirname) // 当前文件, 所在文件夹, 的绝对路径
// 盘符:/......../工程名字, 后面自己拼接 src/styles/cover.less
module.exports = {
  publicPath: './',
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 直接覆盖变量
          // 'nav-bar-background-color': '#007bff',
          // 'nav-bar-title-text-color': 'white',
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${path.resolve(__dirname, 'src/styles/cover.less')}";`
        }
      }
    }
  }
}
