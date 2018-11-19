// pages/mine/mine.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    //默认请求第一页
    pageIndex:1,
    //数据列表
    list:[],
    //是否显示加载完成
    showLoading:true,
    //是否后台还有数据
    hasMore:true
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
    //this.findUserHistory();
    this.getUserList(1, 1);
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

  //每次查询用户20条菜单数据
  getUserList(type,index) {
    
    let openid = app.globalData.openid;
    //console.log("加载过数据了，openid:" + openid)
      wx.cloud.callFunction({
        name: 'pagination',
        data: {
          dbName: 'userFoodMenu',
          filter: {
            _openid: openid
          },
          pageIndex: index,
          pageSize: 20
        }
      }).then(res => {
        //console.log(res)
        let data = res.result.data;
        //转化时间
        for (let i = 0; i < data.length; i++) {
          let time = data[i].createTime;
          let hour = time.split(' ')[1].split(':')[0];
          data[i].hour = hour;
        };
        //如果请求数据为进入获取或者上拉加载type == 1
        if (type == 1){
          //如果还没有请求完数据
          if (this.data.hasMore){
            let moment_list = this.data.list;
            for (let i = 0; i < data.length; i++) {
              moment_list.push(data[i]);
            }
            this.setData({
              list: moment_list,
              hasMore: res.result.hasMore,
            });
            if (!res.result.hasMore){
              this.setData({
                showLoading: false,
              });
            }
          }else{
            this.setData({
              hasMore: res.result.hasMore,
              showLoading: false,
            });
          };
        }
        //如果请求数据为下拉刷新type == 2
        if (type == 2){
          this.setData({
            list: data,
            hasMore: res.result.hasMore,
            showLoading: res.result.hasMore,
          });
          // 隐藏导航栏加载框
          wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
        }
      })
    
  },
 

  //跳转菜单详情
  toFoodMenu(event) {
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getUserList(2, 1);
    this.setData({
      pageIndex: 1,
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
   //上拉加载
  onReachBottom: function() {
    let pageIndex = this.data.pageIndex;
    let hasMore = this.data.hasMore;
    pageIndex++;
    this.getUserList(1, pageIndex);
    this.setData({
      pageIndex: pageIndex,
    });
    //console.log(pageIndex)
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})