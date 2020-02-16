<template>
  <!--pages/study/study.wxml-->
  <view class="study-container">
    <view class="study-item" v-for="(item, index) in studyProgresses" :key="index">
      <image :src="item.icon" alt />
      <view class="meta">
        <text class="title">{{item.title}}</text>
        <text class="progress">已学习{{item.study_hour}}课时/{{item.total_hour || 0}}课时</text>
      </view>
      <view class="circle">
        <circle
          ref="circleList"
          :canvasId="item.sid"
          :progress="item.study_progress"
          :width="55"
          :height="55"
        ></circle>
      </view>
    </view>
    <view v-if="isEmpty">
      <text class="no-study-tip">您还没有任何学习记录哦，赶快去学习吧~</text>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { http } from "@/utils/http";
import circle from "@/components/circle";
export default Vue.extend({
  components: {
    circle
  },
  data() {
    return {
      studyProgresses: [],
      isEmpty: false
    };
  },
  onShow() {
    this.currentStudy();
  },
  methods: {
    async currentStudy() {
      let res = await http({
        url: "study/progress"
      });
      if (res.data.status === 0) {
        this.studyProgresses = res.data.message;
        // Vue.nextTick(()=>{
        //   this.$refs.circleList && this.$refs.circleList.forEach(element => {
        //       element.draw()
        //   });
        // })
      }
    }
  }
});
</script>
<style scoped>
/* pages/study/study.wxss */
.study-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 32rpx;
  align-items: center;
  position: relative;
}

.study-item {
  margin-top: 32rpx;
  background-color: #fff;
  border-radius: 12rpx;
  width: 686rpx;
  height: 220rpx;
  display: flex;
  align-items: center;
}

.study-item image {
  width: 108rpx;
  height: 108rpx;
  margin-left: 50rpx;
}

.study-item .meta {
  flex: 1;
  margin-left: 50rpx;
  display: flex;
  flex-direction: column;
}

.study-item .meta .title {
  font-size: 30rpx;
  color: #333333;
}

.study-item .meta .progress {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #a8a8a8;
}

.circle {
  width: 109rpx;
  height: 109rpx;
  margin-right: 56rpx;
}

.no-study-tip {
  margin-top: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500rpx;
  font-size: 15px;
}
</style>