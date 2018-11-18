// pages/mine/mine.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //判断是否登录
    //this.judgeLogin();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获取用户所有食谱数据
    this.findUserHistory();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //再次判断登录
    this.judgeLogin();
  },

  /**
   * 页面执行函数
   */
  //判断是否登录
  judgeLogin() {
    let that = this;
    //判断是否登录授权。
    wx.getSetting({
      success: res => {
        //如果有直接跳转到生成菜单页面
        //如果没有跳转至登录页面
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
              //获取到授权
              //console.log(res.userInfo);
              that.setData({
                userImg: res.userInfo.avatarUrl,
                userName: res.userInfo.nickName,
                login: true
              });
              // wx.navigateTo({
              //   url: "food-menu/food-menu?_id=" + "W9qcfbdokuiPuJFc"
              // })
            }
          })
          //
        } else {
          wx.navigateTo({
            url: '../login/login'
          })
        }
      }
    })
  },

  //点击登录
  clickLogin() {
    wx.navigateTo({
      url: '../login/login'
    })
  },

  //查询该用户的所有菜单
  findUserHistory() {
    const db = wx.cloud.database();
    let openid = app.globalData.openid;
    let that = this;
    if (openid) {
      // 查询当前用户所有的 counters
      db.collection('userFoodMenu').where({
          _openid: openid
        })
        .orderBy('createTime', 'desc')
        .get({
          success: res => {
            let data = res.data;
            
            //转化时间
            for(let i = 0;i<data.length;i++){
              let time = data[i].createTime;
              let hour = time.split(' ')[1].split(':')[0];
              data[i].hour = hour;
            };
            console.log(data)
            that.setData({
              list: data,
            });
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '网络不佳，请稍后再试'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
    }
  },

  //跳转菜单详情
  toFoodMenu(event){
    //console.log(event)
    wx.navigateTo({
      url: "/pages/index/food-menu/food-menu?_id=" + event.currentTarget.dataset.id
    })
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

  }
})