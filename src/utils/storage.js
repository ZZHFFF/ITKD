// 本地存储方式
// 如果同时有sessionStorage和localStorage, 可以封装2份
// 现在我只封装一种统一的方式
export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}
export const getStorage = (key) => {
  return localStorage.getItem(key)
}
export const removeStorage = (key) => {
  localStorage.removeItem(key)
}
export const clearStorage = () => {
  localStorage.clear()
}
