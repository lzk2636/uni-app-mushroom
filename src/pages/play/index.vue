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
          <image src="/static/images/evaluate@2x.png" @click="commentCourse"></image>
        </view>
          <!-- 课程评价组件 -->
        <Model :visible="visible" @closeModal="closeModal" class="comment-content" @postComment="postComment">
          <label>输入内容:</label><textarea  rows="3" cols="3" v-model="content"></textarea>
          <label>评分:</label><star :score="score" :isChange="true" @changeStar="changeStar"></star>

        </Model>
        
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
import Model from '@/components/Model/index.vue'
import star from '@/components/star/index.vue'
export default Vue.extend({
  components:{
    Model,
    star
  },
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
      isCheckUser:false,
      visible:false,
      score:0,
      content:""
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
    // 评论发表
    async postComment(){
      if(this.content.trim().length===0){
         uni.showToast({
          title:"内容不能为空",
          icon:"none",
          duration:500
        })
        return
      }
      const res = await http({
        url:"comment/create",
        method:"POST",
        data:{
          course_id:this.id,
          content:this.content,
          score:this.score
        }
      })
      if(res.data.status===0){
        uni.showToast({
          title:res.data.message,
          icon:"none",
          duration:500
        })
        this.visible=false
        setTimeout(()=>{
          uni.navigateBack()

        },500)
      }
    },
    // 星星score
    changeStar(num){
      this.score=num
    },
    // 关闭model
    closeModal(visible){
      this.visible=visible
    },
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
       
      }
    },
    async selectCourse(index){
     uni.createVideoContext("player").pause()
    const checkIsPay= await this.PayFor()
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
      // this.courseDetails.videos[index].is_study=1
      this.studyVedios(index)
      setTimeout(() => {
        uni.createVideoContext("player").play()
      }, 200);
   
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
        console.log('is_study','--------------')
        this.courseDetails.videos[index].is_study=1
      }
    },

    async commentCourse(){
      const res=await http({
        url:"study/complete",
        // method:"POST",
        data:{
          course_id:this.id
        }
      })
      // console.log(res)
      if(res.data.status===0){
      if(!res.data.complete){
        uni.showModal({
          title:"温馨提示",
          content:"课程未学完",
          confirmText:"去学习",
          confirmColor:"#ffc107",
          showCancel:false
        })
        return
      }
      this.visible=true
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