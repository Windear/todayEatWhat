// pages/index/waimai/waimai.js
// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var demo;


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    demo = new QQMapWX({
      key: 'NQVBZ-V6MK5-DA5IP-QQEZW-KD26V-QLB2Z' // 必填
    });

    
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
    // 调用接口
    demo.search({
      keyword: '牛排',
      page_size:20,
      page_index:1,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res.status, res.message);
      },
      complete: function (res) {
       // console.log(res);
      }
    });
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

  }
})