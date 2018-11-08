//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //云开发初始化

    wx.cloud.init({
      env:'windy23456',
      traceUser:true
    })

    this.getOpenid();
    //console.log(this.globalData.userInfo);
  },

  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        this.globalData.openid = res.result.OPENID      
      }
    })
  },

  globalData: {
    userInfo: null,
    openid: null,
    AppId:'wxcf3e54c49f32683c',
    AppSecret:'da40805b4b57b246f96617cf01082fed'
  }
})