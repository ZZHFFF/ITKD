<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ obj.title }}</span>
          <!-- 单图 -->
          <img
            class="thumb"
            v-lazy="obj.cover.images[0]"
            v-if="obj.cover.type === 1"
          />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="obj.cover.type > 1">
          <img
            class="thumb"
            v-for="(imgUrl, index) in obj.cover.images"
            :key="index"
            v-lazy="imgUrl"
          />
        </div>
      </template>
      <!-- 自定义标题下方 label 的内容 -->
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ obj.aut_name }}</span>
            <span>{{ obj.comm_count }} 评论</span>
            <span>{{ obj.pubdate }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="onCloseClick" v-if="showX"/>
        </div>
      </template>
    </van-cell>

    <!-- 反馈面板 -->
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" get-container="body" :cancel-text="cancelText" @cancel="onCancel"/>
  </div>
</template>

<script>
import { firstActions, secondActions } from '@/api'
export default {
  data () {
    return {
      show: false,
      actions: firstActions,
      cancelText: '取消' // 底部按钮文字
    }
  },
  props: {
    // 文章信息对象
    obj: {
      type: Object,
      default () {
        return {}
      }
    },
    // x反馈是否显示
    showX: {
      type: Boolean,
      default: true // 默认显示
    }
  },
  methods: {
    // 反馈面板点击事件 点击各个选项，不包括取消，取消有另一个事件
    onSelect (action) {
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.cancelText = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('dislike', this.obj)
        this.show = false
      } else { // 这里就是二级反馈
        this.$emit('reports', this.obj, action.value) // 外面需要反馈类型的值
        this.actions = firstActions
        this.show = false
      }
    },
    // 点击了叉号按钮
    onCloseClick () {
      // 展示动作面板
      this.show = true
    },
    // 取消事件
    onCancel () {
      if (this.cancelText === '返回') {
        this.actions = firstActions
        this.cancelText = '取消'
        this.show = true // 点返回不要让弹窗关闭, 点取消文字按钮, 弹窗默认关闭
      }
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
 // 保持原有尺寸比例。但部分内容可能被剪切。
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
