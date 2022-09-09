<template>
  <div>
    <van-nav-bar title="IT看点 - 登录" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="formLogin.mobile"
        type="tel"
        label="手机号"
        placeholder="请输入手机号"
        required
        :rules="[
          {
            required: true,
            message: '请填写手机号',
            trigger: 'onChange',
            pattern: /^1[3456789]\d{9}$/,
          },
        ]"
      />
      <van-field
        v-model="formLogin.code"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
        :rules="[
          {
            required: true,
            message: '请填写密码',
            trigger: 'onChange',
            pattern: /^\d{6}$/,
          },
        ]"
      />
      <div style="margin: 16px">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          :loading="isLoding"
          :disabled="isLoding"
          loading-text="程序员拼命加载ing..."
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { MyNotify } from '@/utils/Notify'

export default {
  name: 'Login',
  data () {
    return {
      formLogin: {
        mobile: '13888888888',
        code: '246810' // 默认只能用246810后台规定了
      },
      isLoding: false // 加载状态
    }
  },
  methods: {
    ...mapActions(['asyncLoginAction']),
    async onSubmit () {
      try {
        await this.asyncLoginAction(this.formLogin)
        MyNotify({ type: 'success', message: '登录成功' })
        // 跳转有登录未遂的地址 否则跳转到Layout页面
        this.$router.replace({
          path: this.$route.query.path || '/layout'
        })
      } catch (err) {
        MyNotify({ type: 'warning', message: '手机号或密码错误' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
// .van-nav-bar {
//   background: #007bff;
// }

// /* /deep/ 就是把data-v-hash值选择器写到类名的前面 */
// /deep/ .van-nav-bar__title {
//   color: white;
// }
</style>
