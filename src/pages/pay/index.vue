<template>
  <div>
    {{sss}}
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data(){
    return{
      options:null
    }
  },
  onLoad(options){
    this.options=options
    // options.imageUrl=options.imageUrl.tirm()
    // this.options={...options.tirm()}
    // console.log(options)
  }  
})
</script>
<style lang="less" scoped>

</style>