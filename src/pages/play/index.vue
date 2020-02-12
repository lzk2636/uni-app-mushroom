<template>
  <view>{{id}}</view>
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
      courseDetails:{}
    }
  },
  methods:{
    async currentData(){
      let res =await http({
        url:`course/play/${this.id}`

      })
      if(res.data.status===0){
        this.courseDetails=res.data.message
      }
    }
  }

});
</script>
<style>
</style>