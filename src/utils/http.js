const BASE_URL = "http://localhost:3000/api"
const app = getApp()
const http = ({ url, tips = "数据加载中....", isToken = true, header = {}, method = "GET",data={} }) => {
  uni.showLoading({
    title: tips
  })
  
  console.log(app)
  if(isToken){
    if (app.globalData.userInfo.token) {
      header.Authorization = app.globalData.userInfo.token
    } else {
      const value = uni.getStorageSync('my_token');
      app.globalData.userInfo = value
      header.Authorization = app.globalData.userInfo.token
  
    }
  }
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/${url}`,
      method,
      header,
      data,
      success: res => {
        resolve(res)
      },
      fail: fail => {
        reject(fail)
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })
}
export { http }