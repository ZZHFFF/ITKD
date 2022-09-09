<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="50"
        :immediate-check="false"
      >
        <!-- 文章列表 -->
        <article-item
          v-for="item in articleList"
          :key="item.art_id"
          :obj="item"
          @dislike="dislikeFn"
          @reports="reportsFn"
          @click.native="$router.push(`/article_detail?aid=${item.art_id}`)"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../components/ArticleItem.vue'
import { timeAgo } from '@/utils/date'
import { Notify } from 'vant'

import { articlesListAPI, articleDislikeAPI, articleReportsAPI } from '@/api'

export default {
  data () {
    return {
      articleList: [], // 文章列表
      loading: false, // 底部加载状态
      finished: false, // 数据是否全部加载完成
      nextTime: null, // 用于加载更多(分页)
      isLoading: false // 顶部刷新状态
    }
  },
  props: {
    cid: Number
  },
  methods: {
    timeAgo: timeAgo,
    // 底部加载
    onLoad () {
      // 有第一页数据以后, onLoad再发请求
      if (this.articleList.length > 0) {
        this.getArticleList()
      }
    },
    // 请求文章列表
    async getArticleList () {
      // 负责拿文章列表数据
      const res = await articlesListAPI({
        channelId: this.cid,
        timestamp: this.nextTime
      })
      console.log(res, '文章列表数据')
      // 回来的数据进行预处理, 把时间转成多久多久之前
      // 原本格式是"2019-03-11 09:00:00"这种形式 转成“3年前”
      res.data.data.results.forEach((obj) => {
        obj.pubdate = this.timeAgo(obj.pubdate)
      })

      // 如果无数据
      if (res.data.data.results.length === 0) {
        this.finished = true // 告诉list组件直接底部显示没有更多数据
      } else {
        this.nextTime = res.data.data.pre_timestamp // 保存请求一页数据时的时间(做分页用)
        this.articleList = [...this.articleList, ...res.data.data.results]
        // 等待网络请求结果后（即成功后）
        this.loading = false // 底部加载更多状态
        this.isLoading = false // 顶部加载状态关闭
      }
    },
    // 顶部刷新
    onRefresh () {
      this.nextTime = null
      this.articleList = []
      this.getArticleList()
    },
    // 反馈(不感兴趣)
    async dislikeFn (obj) {
      try {
        await articleDislikeAPI({
          target: obj.art_id
        })
        Notify({ type: 'success', message: '反馈成功' })
      } catch (err) {
        Notify({ type: 'warning', message: '反馈失败-联系程序员' })
      }
    },
    // 反馈(举报)
    async reportsFn (obj, type) {
      try {
        await articleReportsAPI({
          target: obj.art_id,
          type: type,
          remark: '就是其他问题'
        })
        Notify({ type: 'success', message: '举报成功' })
      } catch (err) {
        Notify({ type: 'warning', message: '举报失败' })
      }
    }
  },
  async created () {
    this.getArticleList()
  },
  components: {
    ArticleItem
  }
}
</script>
