<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>

    <!-- 搜索结果 -->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <article-item
          v-for="obj in articleList"
          :key="obj.art_id"
          :obj="obj"
          @click.native="$router.push(`/article_detail?aid=${obj.art_id}`)"
          :showX="false"
        ></article-item>
      </van-list>
    </div>
  </div>
</template>

<script>
import { searchResultListAPI } from '@/api'

import ArticleItem from '@/components/ArticleItem'
import { timeAgo } from '@/utils/date'
export default {
  name: 'SearchResult',
  data () {
    return {
      articleList: [], // 文章数据
      loading: false, // 加载状态
      finished: false, // 全部加载完成状态
      page: 1 // 页码
    }
  },
  methods: {
    // 触底加载更多
    onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        this.getSearchResultFn()
      }
    },
    // 获取搜索结果
    async getSearchResultFn () {
      console.log('搜索结果1')
      try {
        const res = await searchResultListAPI({
          q: this.$route.params.keywords, // 拿到关键词, keywords来源于router/index.js你定义的动态路由参数名
          page: this.page
        })
        // 同样是服务器原因，等了几分钟才响应过来
        console.log(res, '搜索结果2')
        // 更多数据判断
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }

        // 数据预处理
        res.data.data.results.forEach((obj) => {
          obj.pubdate = timeAgo(obj.pubdate)
        })

        // 合并数据
        this.articleList = [...this.articleList, ...res.data.data.results]
        this.loading = false
      } catch (err) {
        console.log(err)
      }
    }
  },
  created () {
    this.getSearchResultFn()
  },
  components: {
    ArticleItem
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
