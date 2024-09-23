// pages/login/login.js
const app = getApp()
//获取应用实例
import {
  requestUtil,
  getBaseUrl
} from '../../utils/requestUtil.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aData: app.globalData,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //点击授权登录
  getUserInfo() {
    let url = '/cookbook/get_open_id'
    //获取用户信息
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback(res)
        }
        console.log(res.userInfo)
        app.globalData.userInfo = res.userInfo
        //微信登录获取
        wx.login({
          success: (res) => {
            if (res.code) {
              //发起网络请求
              requestUtil({
                url: url,
                method: 'POST',
                data: {
                  code: res.code
                }
              }).then(res => {
                let data = res.data;
                let openid = data.openid
                app.globalData.openid = openid

                // wx.switchTab({
                //   url: '/pages/index/index',
                //   success: () => {
                //     console.log('页面跳转成功，此时 globalData 中的 userInfo 已更新。');
                //   },
                //   fail: (err) => {
                //     console.error('页面跳转失败：', err);
                //   },
                // });
                //已经授权登录后跳转至生成菜单页面。
                // wx.redirectTo({
                //   url: "../index/food-menu/food-menu?openid=" + openid
                // })
                wx.navigateBack({
                  delta: 1
                })

                console.log(data)
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          },
        })
      },
      fail: err => {
        console.error('获取用户信息失败', err)
      }
    })


    // if (e.detail.userInfo) {
    //   app.globalData.userInfo = e.detail.userInfo
    //   //console.log(app.globalData.userInfo)
    //   //已经授权登录后跳转至生成菜单页面。
    //   let openid = app.globalData.openid
    //   wx.redirectTo({
    //     url: "../index/food-menu/food-menu?openid=" + openid
    //   })
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // } else {
    //   wx.showModal({
    //     title: '对不起',
    //     content: '您点击了拒绝授权,将无法生成您的个人菜单,点击确定重新获取授权。',
    //     showCancel:false,
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //         wx.navigateBack({
    //           delta: 1
    //         })
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })

    // }
  },


  //点击返回首页
  returnIndex() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
})