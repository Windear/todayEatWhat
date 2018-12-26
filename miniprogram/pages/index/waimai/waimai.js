// pages/index/waimai/waimai.js
const urls = require('../../../static/js/pubilc.js')
const util = require('../../../utils/util.js')
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var location;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //标签列表
    tags: [{
      val: "包子粥店",
      text: "%5B215%2C216%2C217%5D",
      color: "#FF5E5E"
    }, {
      val: "水果",
      text: "%5B245%5D",
      color: "#FF7DA1"
    }, {
      val: "麻辣烫",
      text: "%5B214%5D",
      color: "#FF9A9A"
    }, {
      val: "异国料理",
      text: "%5B229%2C230%2C264%5D",
      color: "#FFCB33"
    }, {
      val: "简餐",
      text: "%5B265%2C266%2C267%2C268%2C269%5D",
      color: "#6DDF88"
    }, {
      val: "地方小吃",
      text: "%5B234%2C235%2C237%5D",
      color: "#7AD8EC"
    }, {
      val: "汉堡披萨",
      text: "%5B212%2C211%5D",
      color: "#FFD86C"
    }, {
      val: "面馆",
      text: "%5B213%5D",
      color: "#FF7DA1"
    }, ],
    //时间
    today: util.today(new Date()),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 实例化API核心类
    location = new QQMapWX({
      key: 'NQVBZ-V6MK5-DA5IP-QQEZW-KD26V-QLB2Z' // 必填
    });

    this.getUserLocation();


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
    // 调用接口

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


  /**
   * 函数正文
   */
  //获取当前位置
  getUserLocation() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let lat = res.latitude
        let log = res.longitude
        that.getShopList(lat, log);
        app.globalData.location = {
          latitude: lat,
          longitude: log
        }
      }
    })
  },

  //获取当前位置的附近的餐厅列表
  getShopList(lat, log) {
    //获取公共链接
    let url = urls.waimai_url;
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
        offset: 0, //从第几条数据开始
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
        //console.log(res.data)
        that.setData({
          shopData: res.data,
          dataLlist: res.data
        });
        //随机传入店铺信息
        that.setShop();
      }
    })
  },

 

  //将洗牌后的数组使用传入需要显示的菜单
  setShop() {
    let selectShop = this.randomShopData(this.data.shopData);
    selectShop = selectShop.slice(0, 1);
    this.setData({
      selectShop: selectShop[0]
    });
  },

  //随机洗牌所有的菜单
  randomShopData(array) {
    let m = array.length,
      t, i;
    //console.log(m);
    //如果还剩有元素
    while (m) {
      // 随机选取一个元素…
      i = Math.floor(Math.random() * m--);
      // 与当前元素进行交换
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
    //console.log(array);
  },

  //点击随机选择
  randomShopClick() {
    let that = this;
    let a = 10;
    setInterval(function () {
      if (a != 0) {
        a--;
        that.setShop();
        //console.log(a);
      }
    }, 100);
    //
  },

  //跳转查看详情
  onWaimaiDetail() {
    app.globalData.selectShop = this.data.selectShop;
    wx.navigateTo({ //子页面跳转
      url: "waimai-detail/waimai-detail"
    })
  },

  //跳转更多餐厅
  onWaimaiList() {
    app.globalData.waimaiList = this.data.dataLlist;
    wx.navigateTo({ //子页面跳转
      url: "waimai-list/waimai-list"
    })
  },
  
})