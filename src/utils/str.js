/**
 * 转换高亮文字的方法
 * @param {*} str 要被处理的字符串
 * @param {*} target 要匹配关键字
 * @returns 处理后带标签高亮的方法
 */
export const lightFn = (str, target) => {
  const reg = new RegExp(target, 'ig')

  return str.replace(reg, (match) => { // match是关键字匹配的值(尽量保持原样)
    return `<span style="color: red">${match}</span>`
  })
}
