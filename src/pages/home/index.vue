<template>
	<!--pages/home/home.wxml-->
<view class="home-container">

	<view class="page-body">
		<view class="page-section page-section-spacing swiper">
			<swiper autoplay duration="3000" circular>
				<block v-for="(item, index) in swiperList" :key="index">
				<navigator url="/pages/course-detail/course-detail?id={{item.id}}">
				<swiper-item>
						<!-- <view class="swiper-item {{item}}"> -->
						<image :src="item.img_url"></image>
						<!-- </view> -->
					</swiper-item>
				</navigator>
					
				</block>
			</swiper>
		</view>
	</view>
	<!-- 推荐课程 -->
	<view>
		<view class="tips">
			<view class="tip">推荐课程</view>
			<image src="/static/images/arrow@2x.png" @click="couseMore" />
		</view>
		<scroll-view class="course-container" scroll-x="true" style="width: 100%">
		<block  v-for="(item, index) in scrollList" :key="index">
			<navigator class="course-item"  url="/pages/course-detail/course-detail?id={{item.id}}" >			
					<image :src="item.icon"></image>
			</navigator>
		</block>
		
		</scroll-view>
	</view>
	<!-- 热门视频 -->
	<!-- <view>
		<view class="tips">
			<view class="tip">热门视频</view>
			<image src="/static/images/arrow@2x.png"></image>
		</view>
		<view class="hot-video">
			<navigator  wx:key="*this"  class="video-item" wx:for="{{hotVidioList}}" url="{{item.video_url}}" open-type="redirectTo" >
				<image src="{{item.cover_photo_url}}"> </image>
				<text class="title"> {{item.name}}</text>
				<text class="subtitle"> {{item.view_count}}已经观看</text>
			</navigator>
		</view>
	</view> -->


</view>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {http} from "@/utils/http.js"
	export default Vue.extend({
		data() {
			return {
        swiperList: [],
        scrollList:[]
			}
		},
		onLoad() {
      this.swiper()
      //home/course
      this.scrollView()


    },
    
		methods: {
      async scrollView(){
        let scrollView= await http({
          url:"home/course"
        })
        if(scrollView.data.status===0){
          this.scrollList=scrollView.data.message
        }
      },
      async swiper(){
          var swiper= await http({
            url:"home/swipers"
          })
          console.log(swiper)
          if(swiper.data.status===0){
            this.swiperList=swiper.data.message

          }
      },
      // 加载更多课程
      couseMore(){

      }
		}
	});
</script>

<style lang="less" scoped>
.home-container {
  padding: 20rpx;
  background-color: #fff;
}
swiper {
  width: 100%;
  height: 342rpx;
  swiper-item {
    width: 100%;
    height: 100%;
  }
  image {
    width: 100%;
    height: 100%;
  }
}
.tips {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text {
    font-size: 36rpx;
    font-weight: 700;
    color: #212121;
  }
  image {
    width: 48rpx;
    height: 48rpx;
  }
}
.course-container {
  height: 170rpx;
  white-space: nowrap;
  .course-item {
    width: 296rpx;
    height: 168rpx;
    display: inline-block;
    margin-right: 32rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.hot-video {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .video-item {
    width: 340prx;
    image {
      width: 340rpx;
      height: 210rpx;
      border-radius: 12rpx;
    }
    .title {
      margin-top: 15rpx;
      color: #262626;
      font-size: 26rpx;
    }
    .subtitle {
      margin-top: 15rpx;
      margin-bottom: 15rpx;
      color: #959595;
      font-size: 18rpx;
    }
  }
}
</style>
