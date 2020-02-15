<template>
  <view class="play-container">
      <view class="cover_image">
        <image :src="noFindImage" v-if="playUrl==''"></image>
        <video  :src="playUrl" controls id="player" @play="playVideoFirst" ></video>
      </view>
      <view class="introduction"> 
        <view class="title-and-info">
          <view class="title">
          {{courseDetails.course.title}}
          </view>
          <view class="info">
           <text>{{courseDetails.course.study_count}}人学过</text>
          <text>难度:{{level}}</text>
          <text>时长:{{courseDetails.course.course_duration}}</text>
          </view>
        </view>
        <view class="comment">
          <image src="/static/images/evaluate@2x.png"></image>
        </view>
        
      </view>
      <view class="course-progress">
         <view class="title">课程进度</view>
        <view class="catelog-container">
          <view class="course-item" v-for="(item,index) in courseDetails.videos" :key="index" @click="selectCourse(index)">
            <text :class="activeIndex===index? 'active':''">
              {{item.name}}
            </text>
            <view class="studied" v-if="item.is_study==1" :class="activeIndex===index? 'active':''" >
              <!-- {{item.is_study==0? "未播放":"已播放"}} -->
              已播放
            </view>
            <text class="time" v-else :class="activeIndex===index? 'active':''">
              {{item.duration}}
            </text>
          </view>
        </view>
      </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { http } from '../../utils/http';
export default Vue.extend({
  onLoad(options){
    this.id=options.id
    this.currentData()
  },
  data(){
    return{
      id:null,
      courseDetails:{},
      playUrl :"",
      activeIndex:0,
      isCheckUser:false
    }
  },
  computed:{
    level(){
      // console.log(this.courseDetails.course.level)
      if(this.courseDetails.course===undefined) return
      switch(this.courseDetails.course.level){
        case 1:{
          return  "初级";
          break;
        };
        case 2:{
          return "中级";
          break;
        };
        case 3:{
          return "高级";
          break;
        }
        default:{
          return "无级别";
          break;
        }
      }
    }
  },
  methods:{
    // 首次播放第一个视屏
    playVideoFirst(){
      !this.isCheckUser &&  this.selectCourse(0)
    },
    async currentData(){
      let res =await http({
        url:`course/play/${this.id}`

      })
      if(res.data.status===0){
        this.courseDetails=res.data.message
        this.noFindImage=this.courseDetails.videos[0].cover_photo_url
        this.playUrl=this.courseDetails.videos[0].video_url
        // console.log(this.courseDetails.videos[0].is_study)
      }
    },
    async selectCourse(index){
     uni.createVideoContext("player").pause()
    const checkIsPay= await this.PayFor()
    console.log(checkIsPay,'----------------')
    if(!checkIsPay){
      // 未支付去支付
      uni.showModal({
        title:"提示",
        content:"你還沒有支付該課程，請去支付吧！",
        confirmText:"去支付",
        confirmColor:"#ff9a29",
        success:  res=> {
        if (res.confirm) {
            console.log('用户点击确定');
            uni.navigateTo({
              // url:"/pages/pay/index"
              url:`/pages/pay/index?id=${this.id}&title=${this.courseDetails.course.title}&price=${this.courseDetails.course.price}&imageUrl=${this.courseDetails.course.cover_image_url}`
            })
        } 
        }
      })
               return    
    }

      
      // 播放
      this.activeIndex=index
      this.playUrl=this.courseDetails.videos[index].video_url
      setTimeout(() => {
        uni.createVideoContext("player").play()
      }, 200);
      this.studyVedios(index)
   
    },
    async PayFor(){
      const res= await http({
        url:"order/info",
        data:{
          course_id:this.id
        }
      })
      if(res.data.status===0){
        if(res.data.message.pay_status===1){
          this.isCheckUser=true
         return  Promise.resolve(true)

        }else{
          return Promise.resolve(false)
        }
      }else{
        return Promise.reject(false)
      }
      // console.log(res)

    },
    async studyVedios(index){
      const res = await http({
        url:"study/video",
        method:"POST",
        data:{
          course_id:this.id,
          video_id:this.courseDetails.videos[index].id
        }
      })
      if(res.data.status===0){
        this.courseDetails.videos[index].is_study=1
      }
    }
  }

});
</script>
<style lang="less" scoped>
.play-container {
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
    video {
      width: 750rpx;
      height: 434rpx;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: -10rpx;
    border-radius: 16px 16px 0px 0px;
    border-bottom: 1px solid #f5f5f5;
    left: 0;
    right: 0;
    height: 192rpx;
    background-color: #ffffff;
    padding: 38rpx 32rpx;
    display: flex;
    align-items: center;
    .title-and-info {
      flex: 1;
      .title {
        color: #343434;
        font-size: 24px;
        font-weight: bold;
      }
      .info {
        margin-top: 12rpx;
        height: 34rpx;
        line-height: 34rpx;
        color: #818181;
        font-size: 12px;
        display: block;
        text {
          padding-right: 15rpx;
        }
        text:nth-child(2),
        text:nth-child(3) {
          padding-left: 15rpx;
        }
        text:nth-child(2) {
          position: relative;
          &::before {
            position: absolute;
            content: '';
            background-color: #ebebeb;
            left: 0rpx;
            width: 1px;
            top: 8rpx;
            height: 20rpx;
          }
          &::after {
            position: absolute;
            content: '';
            background-color: #ebebeb;
            right: 0rpx;
            width: 1px;
            top: 8rpx;
            height: 20rpx;
          }
        }
      }
    }
    .comment {
      margin-top: 32rpx;
      image {
        width: 198rpx;
        height: 80rpx;
      }
    }
  }
  .course-progress {
    margin-top: 222rpx;
    padding: 44rpx 32rpx;
    background-color: #fff;
    .title {
      color: #343434;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 800;
    }
    .catelog-container {
      .course-item {
        display: flex;
        justify-content: space-between;
      }
      text {
        color: #636363;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
      }
      .studied {
        float: right;
        margin-top: 16rpx;
        font-size: 10px;
        text-align: center;
        color: #aaaaaa;
        background-color: #f5f5f5;
        border-radius: 12rpx;
        width: 98rpx;
        height: 48rpx;
        line-height: 48rpx;
      }
      .time {
        float: right;
      }
      .active {
        color: #ff5e00;
      }
    }
  }
}
.comment-content {
  label {
    width: 100rpx;
  }
  textarea {
    width: 100%;
    height: 200rpx;
  }
}
</style>