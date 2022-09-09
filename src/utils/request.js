// 基于 axios 封装的请求模块
import ajax from 'axios'
import store from '@/store'
import router from '@/router'
// import { refreshTokenAPI } from '@/api'
// 新建一个新的axios实例
const axios = ajax.create({
  // baseURL: 'http://123.57.109.30:8000' // 基地址
  // baseURL: 'http://toutiao.itheima.net'
  baseURL: 'http://geek.itheima.net'
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么, 如果vuex里有token携带在请求头中
  if (store.state.token.length > 0 && config.headers.Authorization === undefined) {
    // 发起请求之前, 把token携带在请求头上(表明自己身份)
    config.headers.Authorization = 'Bearer ' + store.state.token
    // 作用：所有api接口里以后暂时不用自己携带Headers+Token了
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) { // 当状态码为2xx/3xx开头的进这里
  // 对响应数据做点什么
  return response
}, async function (error) { // 响应状态码4xx/5xx进这里
  // 对响应错误做点什么
  // console.dir(error)
  if (error.response.status === 401) { // 身份过期
    // token续签方式1:  去登录页重新登录, token无用, 清掉-确保路由守卫if进不去
    store.commit('setToken', '')
    console.log(router.currentRoute.fullPath)
    // 跳转到登录页时携带当前页面所在的路径，以便登录后跳转回来
    router.push({ path: `/login?path=${router.currentRoute.fullPath}` })

    // token续签方式2: refreshToken(用户无感知)
    // store.commit('setToken', '')
    // const res = await refreshTokenAPI()
    // store.commit('setToken', res.data.data.token)
    // 再调用一次未完成的请求啊(用户无感知)
    // error.config 就是上一次axios请求的配置对象
    // console.dir(error.config)
    // 把新的token赋予到下一次axios请求的请求头中
    // error.config.headers.Authorization = 'Bearer ' + res.data.data.token
    // return到await的地方
    // return ajax(error.config)
  } else {
    return Promise.reject(error)
  }
})

// 导出自定义函数, 参数对象解构赋值
export default ({ url, method = 'GET', params, data, headers }) => {
  return axios({
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers
  })

  // 以后假如换了请求库, 只需要改这里, 逻辑页面不用动, 保证代码的复用性和独立性(高内聚低耦合)
  //   return $.ajax({
  //     url: url,
  //     type: method,
  //     data: data,
  //     header: headers
  //   })
}
