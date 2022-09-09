import Vue from 'vue'
import Vuex from 'vuex'
import { setStorage, getStorage } from '@/utils/storage'

import { loginAPI } from '@/api'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    token: getStorage('token') || '', // 前面有值用前面的, 前面要是null, 就用后面的
    refresh_token: getStorage('refresh_token') || '',
    user: JSON.parse(getStorage('user')) || {} // 用户基本资料(默认从本地取)
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      setStorage('token', token)
    },
    setRefreshToken (state, refreshToken) {
      state.refresh_token = refreshToken
      setStorage('refresh_token', refreshToken)
    },
    setUser (state, userObj) {
      state.user = userObj
      setStorage('user', JSON.stringify(userObj))
    },
    updatePhoto (state, photo) {
      state.user.photo = photo
      setStorage('user', JSON.stringify(state.user))
    },
    updateName (state, theName) {
      state.user.name = theName
      setStorage('user', JSON.stringify(state.user))
    }
  },
  actions: {
    async asyncLoginAction (store, val) {
      try {
        const res = await loginAPI(val)
        // console.log(res, '======')
        const { token, refresh_token } = res.data.data
        store.commit('setToken', token)
        store.commit('setRefreshToken', refresh_token)
        return Promise.resolve(res) // 返回成功的Promise对象
      } catch (err) {
        return Promise.reject(err) // 返回失败的Promise对象
      }
    }
  },
  getters: {
    userPhoto (state) {
      return state.user.photo
    }
  }
})
