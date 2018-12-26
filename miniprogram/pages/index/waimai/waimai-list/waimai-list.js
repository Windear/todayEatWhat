// pages/index/waimai/waimai-list/waimai-list.js
const app = getApp()
const urls = require('../../../../static/js/pubilc.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset:30,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getShopData();
    this.getSys();
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

  // 自定义函数
  //获取系统信息
  getSys() {
    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        // 可使用窗口宽度、高度
        //console.log('height=' + res.windowHeight);
        //console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          scroll_height: res.windowHeight
        })
      }
    })
  },
  //获取列表信息
  getShopData() {
    let shopList = app.globalData.waimaiList;
    //console.log(shopList)
    this.setData({
      shopList: shopList
    })
  },
  //进入详情
  onShopDetails(e){
    app.globalData.selectShop = e.currentTarget.dataset.select;
    wx.navigateTo({ //子页面跳转
      url: "../waimai-detail/waimai-detail"
    })
  },

  //获取当前位置的附近的餐厅列表
  getShopList(offset) {
    //获取公共链接
    let url = urls.waimai_url;
    let lat = app.globalData.location.latitude;
    let log = app.globalData.location.longitude;
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
    })
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        offset: offset, //从第几条数据开始
        limit: 30, //返回多少条
        latitude: lat, //横坐标
        longitude: log, //纵坐标
        order_by: 5,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideToast();
        console.log(res);

        that.setData({
          //shopData: res.data,
          offset: offset + res.data.length,
        });

      }
    })
  },

  //上拉加载
  onTopScroll() {
    //let scrollNum = this.data.scrollNum;
    let offset = this.data.offset;
    this.getShopList(offset);
  },
})