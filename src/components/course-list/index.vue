<template>
	<view class="course-container">
  <view class="course-item" v-for="(item, index) in couseres" :key="index">
			<image src="{{item.icon}}" bindtap="ImageUrl" data-url="{{item.icon}}"></image>
			<view class="title">{{item.title}}</view>
			<view class="desc">{{item.subtitle}}</view>
			<button plain size="mini">{{['初级','中级','高级'][item.level-1]}}</button>
		</view>
  </view>
  

</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props:{
    couseres:{
      type:Array,
      default:[]
    }
  }


});
</script>

<style>
.course-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /* width: 100%; */
  padding: 30rpx;
}
.course-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  text-align: center;
  height: 316rpx;
  width: 333rpx;
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 5rpx;
}

.course-item image {
  height: 84rpx;
  width: 104rpx;
}

.course-item .title {
  font-size: 30rpx;
  font-weight: 400;
}

.course-item .desc {
  font-size: 20rpx;
  color: #a8a8a8;

}

.course-item button {
  display: flex;
  /* width: 84rpx;
  height: 24rpx; */
   width: 106rpx;
  border: 1rpx solid #ffb57d;
  font-size: 22rpx;
  border-radius: 10rpx;
  color: #ffb57d;

}

</style>