// pages/index/waimai/waimai-detail/waimai-detail.js
const app = getApp()
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
    this.getShopData();
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
  getShopData() {
    let selectShop = app.globalData.selectShop;
    this.setData({
      shopData: selectShop,
      markers: [{
        id: 1,
        latitude: selectShop.latitude,
        longitude: selectShop.longitude,
        iconPath: '/static/img/add.png',
        width: 20,
        height: 24,
      }],
      includePoints: [{
        latitude: app.globalData.location.latitude,
        longitude: app.globalData.location.longitude,
      },{
        latitude: selectShop.latitude,
        longitude: selectShop.longitude,
      }],
    });
    wx.setNavigationBarTitle({
      title: selectShop.name
    });
    //console.log(selectShop)
    this.setPhone();
  },

  //转换订餐电话
  setPhone() {
    let phone = this.data.shopData.phone;
    let phones = phone.split(' ')
    //console.log(phones)
    this.setData({
      phones: phones
    });
  },

  //点外卖复制名称
  copyShopName(){
    wx.setClipboardData({
      data: this.data.shopData.name,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showModal({
              title: res.data+' 复制成功',
              content: '请直接打开外卖APP(如美团、饿了么等)，粘贴名称进行搜索点单。',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      }
    })
  },

  //点击地址打开导航
  openMap(){
    let latitude = this.data.shopData.latitude;
    let longitude = this.data.shopData.longitude;
    let name = this.data.shopData.name;
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18,
      name: name,
    })
  },

  //点击拨打电话
  callPhone(e){
    let num = e.currentTarget.dataset.num;
    wx.makePhoneCall({
      phoneNumber: num // 仅为示例，并非真实的电话号码
    })
  }
})