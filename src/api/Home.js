import request from '@/utils/request'
// 文章 - 获取列表
export const articlesListAPI = ({ channelId, timestamp }) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp: timestamp || (new Date()).getTime()
    }
  })
}
// 文章 - 不感兴趣
export const articleDislikeAPI = ({ target }) => {
  return request({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: target
    }
  })
}
// 文章 - 举报
export const articleReportsAPI = ({ target, type, remark }) => {
  return request({
    url: '/v1_0/article/reports',
    method: 'POST',
    data: {
      target: target,
      type: type,
      remark: remark
    }
  })
}
// 接口方法, 只负责调用一个接口, 返回一个Promise对象
// 频道 - 所有频道
export const allChannelListAPI = () => {
  return request({
    url: '/v1_0/channels'
  })
}
// 频道 - 用户已选频道
export const userChannelAPI = () => request({
  url: '/v1_0/user/channels'
})
// 频道 - 更新已选
export const updateChannelAPI = ({ channels }) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels: channels
    }
  })
}
