<template>
  <view class="course-detail-container" v-if="course_detail">
    <!-- 1.0 封面图 -->
    <view>
      <view v-if="!isPlaying" class="cover_image">
        <image :src="course_detail.course.cover_image_url" alt />
        <view class="play">
          <image @click="playCourseVideo" src="/static/images/play@2x.png" alt />
          <text>播放课程简介</text>
        </view>
      </view>
      <view v-else class="course_video">
        <video id="courseVideoId" :src="course_detail.course.course_video_url"></video>
      </view>
    </view>
    <!-- 2.0 简介 -->
    <view class="introduction">
      <view class="title-price">
        <text>{{course_detail.course.title}}</text>
        <text>￥{{course_detail.course.price}}.00</text>
      </view>
      <text class="introduce">{{course_detail.course.introduction}}</text>
      <view class="star">
        <star :score="course_detail.course.score"></star>
        <text>{{course_detail.course.study_count}}人在学</text>
      </view>
      <view class="study-share">
        <image @click="goToStudy" src="/static/images/start_study@2x.png" alt />
        <button open-type="share" class="share-button" plain></button>
      </view>
    </view>
    <!-- 3.0 目录、讲师介绍、评价 -->
    <view class="catalog">
      <view class="head">
        <text
          @click="toggleSelect(index)"
          :class="{active:selectIndex===index}"
          v-for="(item,index) in menus"
          :key="index"
        >{{item}}</text>
      </view>
      <view class="body">
        <view class="catelog-container" v-if="selectIndex === 0">
          <text
            v-for="(item,index) in course_detail.videos"
            :key="item.id"
          >{{index+1}}.{{item.name}}</text>
          <text v-if="!course_detail.videos">暂无课程视频哦，请联系客服添加~</text>
        </view>
        <view class="lecturer-container" v-else-if="selectIndex === 1">
          <view v-if="course_detail.lecturer" class="info">
            <image :src="course_detail.lecturer.avatar" alt />
            <view class="name-follow">
              <text>{{course_detail.lecturer.name}}</text>
              <text>关注人数：{{course_detail.lecturer.follow_count}}</text>
            </view>
            <text
              @click="followOrUnFollow(course_detail.lecturer,course_detail.lecturer.id)"
              :class="[course_detail.lecturer.is_follow === 1 ? 'follow' : 'unfollow']"
            >{{course_detail.lecturer.is_follow === 1 ? '已关注' : '关注'}}</text>
          </view>
          <view v-if="course_detail.lecturer" class="introduce">
            <text>{{course_detail.lecturer.introduction}}</text>
          </view>
          <text style="color:#636363;font-size:15px;" v-if="!course_detail.lecturer">暂无讲师简介哦~</text>
        </view>
        <view class="comment-container" v-else>
          <view class="comment-item" v-for="item in course_detail.comments" :key="item.id">
            <view class="info">
              <image :src="item.avatar" alt />
              <view class="nickname-content">
                <view class="nickname">
                  <view style="margin-top:12rpx;">{{item.nickname}}</view>&nbsp;&nbsp;
                  <view style="margin-left:20rpx">
                    <star :score="item.score" />
                  </view>
                </view>
                <view>{{item.content}}</view>
              </view>
              <text class="time">{{item.comment_time}}</text>
            </view>
            <view class="star">
              <image
                @click="like(item)"
                :src="item.is_like == 1 ? '/static/images/like_normal@2x.png' : '/static/images/like_highlight@2x.png'"
                alt
              />
            </view>
          </view>
          <text
            style="color:#636363;font-size:15px;padding:38rpx;"
            v-if="!course_detail.comments"
          >暂无评论哦，请学习之后再评价~</text>
        </view>
      </view>
    </view>
    <!-- <Modal></Modal> -->
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { http } from "../../utils/http";
import star from "@/components/star";
// import Model from '@/components/Model/index.vue'
export default Vue.extend({
  components: {
    star
  },
  data() {
    return {
      id: 0,
      course_detail: {},
      isPlaying: false,
      menus: ["目录", "讲师介绍", "评价"],
      selectIndex: 0
    };
  },
  onLoad(options) {
    this.id = options.id;
  },
  onShow(){
    this.currentData(this.id);

  },
  onHide() {
    console.log("---onHide---");
   
  },
  methods: {
    async like(item) {
      // console.log(id,is_like)
      switch (item.is_like) {
        case 1:
          item.is_like = 2;
          break;
        case 2:
          item.is_like = 1;
          break;
      }
      const res = await http({
        url: "comment/like",
        method: "POST",
        data: {
          comment_id: item.id,
          is_like: item.is_like
        }
      });
    },
    // 是不关注
    async followOrUnFollow(followOrUnFollow, lecturer) {
      // console.log(followOrUnFollow.is_follow)
      switch (followOrUnFollow.is_follow) {
        case 0: // 未关注
          let res = await http({
            url: "lecturer/follow",
            method: "POST",
            data: {
              lecturer_id: lecturer
            }
          });
          if (res.data.status === 0) {
            // console.log(followOrUnFollow)
            followOrUnFollow.is_follow = 1;
            uni.showToast({
              title: res.data.message,
              icon: "none"
            });
          }
          break;
        default:
          let res1 = await http({
            url: "lecturer/unfollow",
            method: "POST",
            data: {
              lecturer_id: lecturer
            }
          });
          if (res1.data.status === 0) {
            followOrUnFollow.is_follow = 0;
            uni.showToast({
              title: res1.data.message,
              icon: "none"
            });
          }
      }
    },

    toggleSelect(index) {
      this.selectIndex = index;
    },
    goToStudy() {
       uni.createVideoContext("courseVideoId") &&
      uni.createVideoContext("courseVideoId").pause();
      // setTimeout(() => {
        uni.navigateTo({
          url: "/pages/play/index?id=" + this.id
        });
      // }, 200);
    },
    // 播放视频
    playCourseVideo() {
      this.isPlaying = true;
      setTimeout(() => {
        uni.createVideoContext("courseVideoId").play();
      }, 200);
    },
    async currentData(id) {
      let res = await http({
        url: "course/" + id
      });
      if (res.data.status === 0) {
        this.course_detail = res.data.message;
        this.menus[2] = `评价(${this.course_detail.commentTotal})`;
      }
    }
  },
  onShareAppMessage(res) {
    // console.log(res)
    if (res.from === "button") {
      return {
        title: "你是选择button的组件",
        content: "呵呵看看新世界啊啊",
        path: "/pages/home/index",
        imageUrl:
          "https://pics1.baidu.com/feed/e61190ef76c6a7ef9617a6db35949e57f2de668a.jpeg?token=90a7c83bbf7fdc6d4f8a6f0df0a363b0"
      };
    } else {
      return {
        title: "你选择原生的组件分享",
        content: "看看石家街的乐趣",
        path: "/pages/home/index",
        imageUrl:
          "https://www.baidu.com/img/pcpad_e247c0f9a461b6394da20e308588818f.png"
      };
    }
  }
});
</script>

<style lang="less" scoped>
.course-detail-container {
  background-color: #efefef;
  position: relative;
  .cover_image {
    width: 750rpx;
    height: 434rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: 750rpx;
      height: 434rpx;
    }
    position: relative;
    .play {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      image {
        width: 164rpx;
        height: 164rpx;
      }
      text {
        margin-top: 10rpx;
        color: #e9e9e9;
        font-size: 30rpx;
      }
    }
  }
  .course_video {
    width: 750rpx;
    height: 434rpx;
    video {
      width: 750rpx;
      height: 434rpx;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: 0rpx;
    border-radius: 16px 16px 0px 0px;
    left: 0;
    right: 0;
    height: 452rpx;
    background-color: #ffffff;
    padding: 20rpx 30rpx;
    .title-price {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text:nth-child(1) {
        font-size: 24px;
        color: #343434;
        font-weight: Bold;
      }
      text:nth-child(2) {
        font-size: 22px;
        color: #ee3939;
      }
    }
    .introduce {
      color: #818181;
      font-size: 12px;
      margin-top: 100rpx;
    }
    .star {
      display: flex;
      margin-top: 20rpx;
      text {
        display: block;
        height: 50rpx;
        line-height: 50rpx;
        margin-left: 20rpx;
        font-size: 12px;
        color: #fe8e38;
      }
    }
    .study-share {
      margin-top: 42rpx;
      margin-bottom: 52rpx;
      image:nth-child(1) {
        width: 568rpx;
        height: 92rpx;
      }
      .share-button {
        border: none;
        width: 92rpx;
        height: 92rpx;
        background-color: #fff;
        border-radius: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        float: right;
        background-image: url(../../static/images/share@2x.png);
        background-repeat: no-repeat;
        background-size: 34rpx 34rpx;
        background-position: 30rpx 30rpx;
      }
    }
  }
  .catalog {
    margin-top: 520rpx;
    // position: absolute;
    z-index: 5;
    width: 750rpx;
    // height: 582rpx;
    background-color: #ffffff;
    .head {
      height: 120rpx;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      text {
        text-align: center;
        color: #a8a8a8;
        font-size: 14px;
        height: 120rpx;
        line-height: 120rpx;
        flex: 1;
        position: relative;
      }
      .active {
        color: #333333;
        font-weight: bold;
        &::after {
          content: "";
          position: absolute;
          left: 88rpx;
          bottom: 0px;
          width: 74rpx;
          height: 3px;
          background-color: #ff8e43;
        }
      }
    }
    .catelog-container {
      padding: 30rpx;
      height: 582rpx;
      text {
        background-color: #ffffff;
        color: #636363;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        display: block;
      }
    }
    .lecturer-container {
      padding: 30rpx;
      .info {
        height: 200rpx;
        display: flex;
        align-items: center;
        .name-follow {
          margin-left: 30rpx;
          display: flex;
          flex-direction: column;
          flex: 1;
          text:nth-child(1) {
            font-size: 34rpx;
            color: #333333;
          }
          text:nth-child(2) {
            font-size: 28rpx;
            margin-top: 15rpx;
            color: #a8a8a8;
          }
        }
        image {
          margin-left: 12rpx;
          width: 120rpx;
          height: 120rpx;
        }
        .unfollow {
          width: 136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 26rpx;
          color: #a8a8a8;
          font-size: 28rpx;
        }
        .follow {
          width: 136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 26rpx;
          color: #fff;
          background-color: #a8a8a8;
          font-size: 28rpx;
        }
      }
      .introduce {
        background-color: #ffffff;
        text {
          margin-left: 12rpx;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: rgba(168, 168, 168, 1);
          opacity: 1;
        }
      }
    }
    .comment-item {
      background-color: #ffffff;
      padding: 30rpx;
      height: 180rpx;
      border-bottom: 2px solid #f1f1f1;
      .info {
        height: 120rpx;
        display: flex;
        align-items: center;
        image {
          margin-left: 6rpx;
          width: 96rpx;
          height: 96rpx;
          border-radius: 50%;
        }
        .nickname-content {
          flex: 1;
          margin-left: 30rpx;
          .nickname {
            color: #333333;
            font-size: 30rpx;
            font-weight: bold;
            align-items: center;
            display: flex;
            view {
              height: 100%;
              display: inline-block;
            }
          }
          view:nth-child(2) {
            margin-top: 16rpx;
            color: #a8a8a8;
            font-size: 12px;
          }
        }
        .time {
          color: #a8a8a8;
          font-size: 11px;
        }
      }
    }
    .star {
      image {
        margin-top: 30rpx;
        width: 44rpx;
        height: 44rpx;
        float: right;
        margin-right: 20rpx;
      }
      image:nth-child(0) {
        margin-right: 20rpx;
      }
    }
  }
}
</style>