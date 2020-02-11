<template>
  <view class="container">
    <view class="star-bg">
      <image
        @click="star(index)"
        v-for="(item,index) in 5"
        :key="item"
        src="/static/images/star_empty@2x.png"
        alt
      />
    </view>
    <view class="star">
      <image
        @click="star(index)"
        v-for="(item,index) in myScore"
        :key="item"
        src="/static/images/star_fill@2x.png"
        alt
      />
    </view>
  </view>
</template>

<script lang="ts">
  import Vue from "vue";
  export default Vue.extend({
    props: {
      score: {
        type: Number,
        // default: 0
        required:true
      }
    },
    data(){
      return{
        myScore:0
      }
    },
    onReady(){
      this.myScore=this.score
    },
   
    methods:{

    star(index){
      // console.log(7474)
      // console.log(index)
      this.myScore=index+1
      this.$emit("changeStar",this.myScore)
    }
    }
    

  });

</script>
<style lang="less" scoped>
.container {
  position: relative;
}
.star,
.star-bg {
  float: left;
  display: flex;
  height: 50rpx;
  align-items: center;
  image {
    width: 38rpx;
    height: 36rpx;
  }
}
.star {
  position: absolute;
  top: 0;
  left: 0;
}
</style>