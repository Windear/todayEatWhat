// pages/login/login.js
const app = getApp()
//获取应用实例
//const index = getIndex()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //点击授权登录
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      //console.log(app.globalData.userInfo)
      //已经授权登录后跳转至生成菜单页面。
      let openid = app.globalData.openid
      // wx.redirectTo({
      //   url: "../index/food-menu/food-menu?openid=" + openid
      // })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showModal({
        title: '对不起',
        content: '您点击了拒绝授权,将无法生成您的个人菜单,点击确定重新获取授权。',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },


  //点击返回首页
  returnIndex() {
    wx.navigateBack({
      delta: 1
    })
  },
})