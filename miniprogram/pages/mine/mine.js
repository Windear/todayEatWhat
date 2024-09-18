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
    pageIndex: 1,
    //数据列表
    list: [],
    //是否显示无数据
    showNone: true,
    //是否显示加载完成
    showLoading: true,
    //是否后台还有数据
    hasMore: true,
    //是否显示分享弹窗
    showShareModalStatus: false,
    delBtnWidth: 180,
    startX: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //判断是否登录
    //this.judgeLogin();
    this.initEleWidth();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获取用户所有食谱数据
    //this.findUserHistory();
    // this.getUserList(1, 1);
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
  getUserList(type, index) {
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
      let data = res.result.data;
      //如果返回的数据为空
      if (index === 1 && data.length === 0) {
        //显示空态图
        this.setData({
          showNone: true,
        });
      } else {
        //隐藏空态图
        this.setData({
          showNone: false,
        });
      }
      //转化时间
      for (let i = 0; i < data.length; i++) {
        let time = data[i].createTime;
        let hour = time.split(' ')[1].split(':')[0];
        data[i].hour = hour;
      };
      //如果请求数据为进入获取或者上拉加载type == 1
      if (type == 1) {
        //如果还没有请求完数据
        if (this.data.hasMore) {
          let moment_list = this.data.list;
          for (let i = 0; i < data.length; i++) {
            moment_list.push(data[i]);
          }
          this.setData({
            list: moment_list,
            hasMore: res.result.hasMore,
          });
          if (!res.result.hasMore) {
            this.setData({
              showLoading: false,
            });
          }
        } else {
          this.setData({
            hasMore: res.result.hasMore,
            showLoading: false,
          });
        };
      }
      //如果请求数据为下拉刷新type == 2
      if (type == 2) {
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

  //打开分享弹出层
  showShare() {
    console.log("打开遮罩")
    this.setData({
      showShareModalStatus: true
    })
  },

  //关闭分享弹出框
  hideShare() {
    this.setData({
      showShareModalStatus: false
    })
  },

  //滑动开始事件
  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  //滑动事件
  touchM: function(e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },

  // 滑动中事件
  touchE: function(e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
      //console.log("活动中")
    }
  },


  //获取元素自适应后的实际宽度
  getEleWidth: function(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },

  //获取删除按钮宽度
  initEleWidth: function() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  //删除列表
  delItem(e) {
    //获取列表中要删除项的下标
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除菜单',
      content: '是否确认删除该条数据？',
      success: function(res) {
        if (res.confirm) { //这里是点击了确定以后
          //console.log('用户点击确定'+id)
          //移除列表中下标为index的项
          list.splice(index, 1);
          //更新列表的状态
          that.setData({
            list: list
          });
          const db = wx.cloud.database();
          db.collection('userFoodMenu').doc(id).remove({
            success: function(res) {
              console.log("删除成功")
              //console.log(res)
            }
          })
          //删除数据库文件
        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
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
    // this.getUserList(2, 1);
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
    // this.getUserList(1, pageIndex);
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