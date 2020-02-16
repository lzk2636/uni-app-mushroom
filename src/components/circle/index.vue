<template>
  <canvas :style="'width:'+width+'px;heigth:'+height+'px'" :canvas-id="canvasId"></canvas>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    canvasId: {
      type: Number
    },
    progress: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: 50
    }
  },
  // mounted(){
  //   this.draw()
  // },
  // watch:{
  //   progress(newValue,oldValue){
  //     if(newValue!==oldValue){
  //       this.draw()
  //     }
  //   }
  // },
  methods:{
    draw(){
      console.log('--draw()--')
    var context = uni.createCanvasContext(this.canvasId, this);
    context.setStrokeStyle("#eeeeee");
    context.setLineWidth(5);
    context.arc(
      this.width / 2,
      this.height / 2,
      this.width / 2 - 5,
      -0.5*Math.PI,
      1.5 * Math.PI
    );
    context.stroke();
    context.beginPath()
    let color='#f00'
    if(this.progress>=80){
      color='#00ff00'
    }else if(this.progress>=50){
      color="#ffc107"
    }
    context.setStrokeStyle(color)
    context.arc(this.width/2,this.height/2,this.width/2-5,-0.5*Math.PI,this.progress/100*2*Math.PI-0.5*Math.PI)

    context.stroke();
    context.beginPath()
    context.setFillStyle(color)
    context.setFontSize(10)
    context.fillText(this.progress+"%",this.width/2-10,this.height/2+3)
    context.stroke()
    context.draw();
  // }
    }
  },
 
});
</script>
<style>
</style>