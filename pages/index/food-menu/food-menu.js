// pages/index/food-menu/food-menu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var _id = options._id; //获取页面跳转传过来的参数
    //console.log(foodId);
    this.setData({
      _id: _id
    });
    wx.setNavigationBarTitle({
      title: "回家吃菜单"
    });
    this.getFoodMenu();
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

  //获取菜单数据
  getFoodMenu() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('userFoodMenu').where({
      _id: this.data._id
    }).get({
      success: res => {
        // console.log(res);
        let data = res.data[0];

        this.setData({
          data: data,
        })
        console.log(data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '网络不佳，请稍后再试'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },


  //打开弹出框
  showModal() {
    this.setData({
      showModalStatus: true
    })
  },

  //关闭弹出框
  hideModal: function() {
    this.setData({

      showModalStatus: false
    })

  },

  //跳转至菜品详情
  onFoodDetails(event) {
    let foodId = event.currentTarget.dataset.id;
    wx.navigateTo({ //子页面跳转
      url: "../food-detail/food-detail?id=" + foodId
    })
  },

  //跳转至首页
  onDetail(){
    wx.reLaunch({ //子页面跳转
      url: "../index"
    })
  }

})