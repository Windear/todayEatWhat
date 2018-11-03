// pages/index/food-menu/food-menu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    ingredientsList: [],
    burdenList: [],
    isshare: 0,
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

    //console.log(options.isshare)
    if (options.isshare == 1) {
      this.setData({
        isshare: options.isshare
      });  
    }  

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
        //console.log(data);
        this.getFoodMaterial();
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

  //获取食材数据
  getFoodMaterial() {
    let foodList = this.data.data.foodMenu;
    let mainMaterial, accessories = new Array;
    //遍历出每个菜品的id号
    for (let i = 0; i < foodList.length; i++) {
      let foodid = foodList[i].id;
      this.getdata(foodid);
    }
    //console.log(this.data.burdenList);
  },

  //获取数据
  getdata(id) { //定义函数名称
    var that = this;
    // let  mainMaterial = {};
    let mainMaterial = "";
    wx.request({
      url: 'https://longcz.binzc.com/recipes/getMenuById?id=' + id, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},
      //async: false,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let foodDetail = res.data;
        //主料列表
        let ingredientsList = that.data.ingredientsList;
        //辅料列表
        let burdenList = that.data.burdenList;
        //辅料
        let burden = that.arrayJson(foodDetail.burden);
        //主料
        let ingredients = that.arrayJson(foodDetail.ingredients);

        for (let i = 0; i < ingredients.length; i++) {
          ingredientsList.push(ingredients[i]);
        }

        for (let j = 0; j < burden.length; j++) {
          burdenList.push(burden[j]);
        }
        // console.log(burdenList);
        that.setData({
          ingredientsList: ingredientsList,
          burdenList: burdenList
        })
      }
    })
    //console.log(mainMaterial) ;
  },


  //加引号的字段转化为数组
  arrayJson(credentials) {
    if (credentials == null || credentials == '' || credentials === ' ') {
      credentials = [];
    } else if (credentials.indexOf(',') == -1 && credentials.indexOf('.') > -1) {
      var tempImg = [];
      tempImg.push(JSON.parse(credentials));
      credentials = tempImg;
    } else if (credentials.indexOf(',') > -1) {
      credentials = JSON.parse(credentials);
    }
    return credentials;
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
  onDetail() {
    wx.reLaunch({ //子页面跳转
      url: "../index"
    })
  },

  //分享菜单
  shareFoodMenu() {
    wx.showModal({
      title: '分享给好友',
      content: '您可以直接发送给好友，也可以生成图片发送到朋友圈。',
      //showCancel: false,
      confirmText: '分享好友',
      cancelText: '生成图片',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  onShareAppMessage: function(ops) {
    let _id = this.data._id;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: this.data.data.userInfo.nickName + '的菜单',
      path: 'pages/index/food-menu/food-menu?_id=' + _id + '&isshare=1',
      success: function(res) {
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });

        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },

  //
  bindKeyInput(e){
    const db = wx.cloud.database()
    db.collection('userFoodMenu').doc(this.data._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        tellText: e.detail.value
      },
      success: function (res) {
        //console.log(res)
      }
    })
  },

  backHome: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }

})