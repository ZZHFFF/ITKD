<template>
  <div>
    <keep-alive :exclude="['ArticleDetail', 'Login', 'Search', 'SearchResult']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>
