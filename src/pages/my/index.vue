<template>
  <!--pages/my/my.wxml-->
  <view class="my-container" v-if="userInfo">
    <view class="header">
      <image class="avatar" :src="userInfo.avatar || '/static/images/avatar@2x.png'" alt />
      <text class="nickname">{{userInfo.nickname || '酷小鱼'}}</text>
    </view>
    <view class="tips">
      <view class="left">
        <text class="title">{{userInfo.study_hour}}</text>
        <text class="subtitle">累计学习小时</text>
      </view>
      <view class="middle">
        <text class="title">{{userInfo.follow_count}}</text>
        <text class="subtitle">我的关注</text>
      </view>
      <view class="right">
        <text class="title">{{userInfo.course_count}}</text>
        <text class="subtitle">我的课程</text>
      </view>
    </view>
    <view class="cells">
      <view class="cell">
        <text>学习历史</text>
        <image src="/static/images/arrow@2x.png" alt />
      </view>
      <view class="cell">
        <text>消息提醒</text>
        <image src="/static/images/arrow@2x.png" alt />
      </view>
      <view @click="clearCache" class="cell">
        <text>清除缓存</text>
        <image src="/static/images/arrow@2x.png" alt />
      </view>
      <view class="cell">
        <text>商务合作</text>
        <image src="/static/images/arrow@2x.png" alt />
      </view>
      <view @click="contact" class="cell">
        <text>在线客服</text>
        <image src="/static/images/arrow@2x.png" alt />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { http } from "@/utils/http";
export default Vue.extend({
  data() {
    return {
      userInfo: {}
    };
  },
  onShow() {
    this.currentData();
  },
  methods: {
    async currentData() {
      let res = await http({
        url: "my/info"
      });
      if (res.data.status === 0) {
        this.userInfo = res.data.message;
      }
    },
    clearCache() {
      //清除缓存
      uni.showLoading({
        title: "清除缓存....",
        complete: () => {
          let timer = setTimeout(() => {
            uni.clearStorageSync();
            uni.hideLoading();
            clearTimeout(timer);
            uni.reLaunch({
               url: "/pages/login/index"
            })
          }, 2000);
        }
      });
    },
    contact() {
      //在线客服
      uni.makePhoneCall({
          phoneNumber: '110' //仅为示例
      })
    }
  }
});
</script>
<style lang="less" scoped>
/* pages/my/my.wxss */

.my-container {
  position: relative;
}

.header {
  width: 750rpx;
  height: 440rpx;
  background-color: #ff8d43;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.avatar {
  width: 176rpx;
  height: 176rpx;
  border-radius: 50%;
}

.nickname {
  margin-top: 30rpx;
  font-size: 21px;
  color: #fff;
}

.tips {
  position: absolute;
  top: 400rpx;
  left: 32rpx;
  right: 32rpx;
  border-radius: 12rpx;
  height: 174rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.title {
  text-align: center;
  font-size: 26px;
  color: #333;
}

.subtitle {
  margin-top: 10rpx;
  text-align: center;
  font-size: 12px;
  color: #a8a8a8;
  font-weight: bold;
}

.left,
.middle,
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.middle {
  position: relative;
}

.middle::before {
  content: "";
  position: absolute;
  left: 0;
  top: 30rpx;
  height: 62rpx;
  width: 3rpx;
  background-color: #ebebeb;
}

.middle::after {
  content: "";
  position: absolute;
  right: 0;
  top: 30rpx;
  height: 62rpx;
  width: 3rpx;
  background-color: #ebebeb;
}

.cells {
  background-color: #fff;
  border-radius: 12rpx;
  margin-top: 160rpx;
  margin-left: 32rpx;
  margin-right: 32rpx;
  height: 600rpx;
  margin-bottom: 32rpx;
}

.cell {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f8f8f8;
  padding: 0rpx 20rpx;
}

.cell text {
  font-size: 30rpx;
  color: #333;
}

.cell image {
  width: 48rpx;
  height: 48rpx;
}
</style>