<template>
  <p>这是一个属性{{id}}</p>

</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      id:0
    }
  },
  onLoad(options){
    this.id=options.id

  }
});
</script>

<style>
</style>