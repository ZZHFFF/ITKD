// 基于vant组件库, UI层弹窗封装
// Notify函数
// import { Notify } from 'vant'
import { Toast } from 'vant'

export const MyNotify = ({ type, message }) => {
//   Notify({
//     type: type,
//     message: message
//   })

  if (type === 'warning') {
    Toast({
      type: 'fail',
      message
    })
  } else if (type === 'success') {
    Toast({
      type,
      message
    })
  }
}
