<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon
          name="cross"
          size="0.37333334rem"
          color="white"
          @click="$emit('close')"
        />
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span
          >我的频道
          <span class="small-title">
            {{ isEdit ? "点击删除频道" : "点击进入频道" }}
          </span>
        </span>
        <span @click="isEdit = !isEdit">{{ isEdit ? "完成" : "编辑" }}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="obj in userChannelList" :key="obj.id" @click="removeFn(obj)">
          <div class="channel-item van-hairline--surround">
            {{ obj.name }}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge" v-if="isEdit && obj.name !== '推荐'">
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="obj in unChannelList" :key="obj.id" @click="addFn(obj)">
          <div class="channel-item van-hairline--surround">{{ obj.name }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { allChannelListAPI } from '@/api'
export default {
  props: {
    userChannelList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      allChannelList: [], // 所有频道
      isEdit: false // 控制编辑状态
    }
  },
  methods: {
    // 新增频道
    addFn (obj) {
      if (this.isEdit === true) { // 新增逻辑
        this.$emit('addChannel', obj)
      }
    },
    // 删除频道
    removeFn (obj) {
      if (this.isEdit === true && obj.name !== '推荐') { // 删除频道
        this.$emit('removeChannel', obj)
      } else { // 在非编辑的情况下点击，跳转到相应的频道
        this.$emit('changeChannel', obj)
        this.$emit('close') // 关闭弹窗
      }
    }
  },
  computed: {
    unChannelList () {
      return this.allChannelList.filter((obj) => {
        const index = this.userChannelList.findIndex(
          (obj2) => obj2.id === obj.id
        )
        if (index === -1) return true
      })
    }
  },
  async created () {
    const res = await allChannelListAPI()
    console.log(res, '所有的频道列表')
    this.allChannelList = res.data.data.channels
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
