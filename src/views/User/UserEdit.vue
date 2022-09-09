<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="profile.photo"
            @click="$refs.iptFile.click()"
          />
          <!-- 移花接木，点击了图片，实际触发了下方表单事件 -->
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <!-- 姓名部分 -->
      <van-cell
        title="名称"
        is-link
        :value="profile.name"
        @click="showNameDialogFn"
      />
      <van-cell
        title="生日"
        is-link
        :value="profile.birthday"
        @click="showBirthFn"
      />
    </van-cell-group>

    <!-- 修改用户名称的对话框 -->
    <van-dialog
      v-model="isShowNameDialog"
      title="修改名称"
      show-cancel-button
      :before-close="onNameDialogBeforeClose"
    >
      <!-- 输入框 -->
      <van-field
        v-model.trim="userName"
        input-align="center"
        maxlength="7"
        placeholder="请输入名称"
        v-fofo
      />
    </van-dialog>

    <!-- 修改时间 -->
    <van-popup
      v-model="isShowBirth"
      position="bottom"
      style="height: 50%"
      round
    >
      <!-- 日期选择控件 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        :show-toolbar="true"
        @cancel="isShowBirth = false"
        @confirm="confirmFn"
      />
    </van-popup>
  </div>
</template>

<script>
import { userProfileAPI, updatePhotoAPI, updateProfileAPI } from '@/api'
import { Notify } from 'vant'
import { mapMutations } from 'vuex'
export default {
  name: 'UserEdit',
  data () {
    return {
      profile: {}, // 用户基本资料
      isShowNameDialog: false, // 是否显示姓名弹出框
      userName: '', // 编辑用户名
      isShowBirth: false, // 显示时间选择器
      minDate: new Date(1900, 0, 1), // 最小的可选的日期
      maxDate: new Date(), // 最大的可选日期
      currentDate: new Date() // 当前日期
    }
  },
  async created () {
    const res = await userProfileAPI()
    // console.log(res)
    this.profile = res.data.data
  },
  methods: {
    ...mapMutations(['updatePhoto', 'updateName']),
    // 文件选择方法
    async onFileChange (ev) {
      // console.log(ev.target.files[0], '选择图片')
      if (ev.target.files.length === 0) return // 防止用户未选择图片
      const fd = new FormData()
      fd.append('photo', ev.target.files[0]) // photo在表单里参数名携带
      const res = await updatePhotoAPI(fd)
      console.log(res, '更新头像')
      this.profile.photo = res.data.data.photo // 更新最新头像
      this.updatePhoto(res.data.data.photo) // 同步头像给vuex
    },
    // 点击名字-出现弹出框
    showNameDialogFn () {
      this.isShowNameDialog = true
      this.userName = this.profile.name // 设置默认显示内容
    },
    // 姓名修改弹出层-关闭前方法
    async onNameDialogBeforeClose (action, done) {
      // action的值: confirm或cancel(点击按钮区分)
      if (action === 'confirm') {
        // 确定
        // unicode编码 \u4092
        // url编码 %E2%C3%D1
        if (/^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/.test(this.userName)) {
          // 通过校验
          // 调用接口
          await updateProfileAPI({
            userName: this.userName
          })
          // 更新页面显示的名字
          this.profile.name = this.userName
          // 同步到vuex中
          this.updateName(this.userName)
          // 关闭弹窗
          done()
        } else {
          // 提示用户
          Notify({ type: 'warning', message: '用户名中英文和数字1-7位' })
          // 阻止弹窗关闭
          done(false)
        }
      } else if (action === 'cancel') {
        // 取消
        done()
      }
    },
    // 弹出时间选择框
    showBirthFn () {
      this.isShowBirth = true
      this.currentDate = new Date(this.profile.birthday) // 设置data组件默认显示时间
    },
    // 时间选择
    async confirmFn () {
      // console.log(this.currentDate instanceof Date)
      // this.currentDate里值是日期对象
      // 但是后台要"年-月-日"格式字符串参数值

      // console.log(this.currentDate)
      const year = this.currentDate.getFullYear()
      let month = this.currentDate.getMonth() + 1
      let day = this.currentDate.getDate()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      const dateStr = `${year}-${month}-${day}`
      await updateProfileAPI({
        birthday: dateStr
      })
      // 前端页面同步
      this.profile.birthday = dateStr
      // 时间选择器关闭
      this.isShowBirth = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
