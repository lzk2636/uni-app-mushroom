<template>
    <courseList :couseres="cousersList"></courseList>
</template>

<script lang="ts">
import Vue from 'vue'
import courseList from '@/components/course-list'
import { http } from '@/utils/http'
export default Vue.extend({
    components:{
        courseList
    },
    data() {
        return {
            // msg: '课程'
            cousersList:[]
        }
    },
    async onLoad(){
        let res= await http({
            url:"course/list"
        })
        if(res.data.status===0){
            this.cousersList=res.data.message
        }

    }

})
</script>