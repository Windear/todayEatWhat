Page({
  data: {

  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var foodId = options.id; //获取页面跳转传过来的参数
    //console.log(foodId);
    this.setData({
      foodId: foodId
    });
    //this.getdata();
    this.getFoodDetails();
  },

  onReady: function() {

  }, //设置动态标题栏

  //获取服务器菜单
  getdata() { //定义函数名称
    var that = this;
    wx.request({
      url: 'https://longcz.binzc.com/recipes/getMenuById?id=' + that.data.foodId, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let foodDetail = res.data;
        foodDetail.ingredients = that.arrayJson(foodDetail.ingredients);
        foodDetail.steps = that.arrayJson(foodDetail.steps);
        foodDetail.burden = that.arrayJson(foodDetail.burden);
        that.setData({
          foodDetail: foodDetail
        });
        wx.setNavigationBarTitle({
          title: that.data.foodDetail.title
        });
        //console.log(foodDetail);

      }
    })
  },

  getFoodDetails() {
    let id = this.data.foodId;
    wx.cloud.callFunction({
      name: 'getFoodDetails',
      data: {
        id: id
      }
    }).then(res => {
      let data = res.result;
      let foodDetail = res.result.data[0];
      // foodDetail.ingredients = this.arrayJson(foodDetail.ingredients);
      // foodDetail.steps = this.arrayJson(foodDetail.steps);
      // foodDetail.burden = this.arrayJson(foodDetail.burden);
      this.setData({
        foodDetail: foodDetail
      });
      wx.setNavigationBarTitle({
        title: this.data.foodDetail.title
      });
    })
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
  }






})