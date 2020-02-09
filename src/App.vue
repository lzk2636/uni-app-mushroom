<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        mpType: 'app',
        onLaunch() {
            console.log('App Launch')
            // console.log(this)
            
           let token= uni.getStorageSync('my_token')
           let scope:any=this
            if(token){
                // this["$scope"].globalData.userInfo.token=token
                scope.globalData.userInfo.token=token
                // console.log(scope.globalData.userInfo)
                uni.reLaunch({
                    url:"/pages/home/index"
                })
            }
        },
        onShow() {
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        },
        globalData: {  
           userInfo:{}  
        }
    });
</script>

<style>
    /*每个页面公共css */
    page{
        background-color: #f8f8f8f8;
        height: 100%;
    }
</style>
