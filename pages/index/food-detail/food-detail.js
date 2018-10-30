
Page({
  data: {

  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var foodId = options.id;//获取页面跳转传过来的参数
    //console.log(foodId);
    this.setData({
      foodId: foodId
    });
    this.getdata();
    
  },

  onReady: function () {
    
  },//设置动态标题栏

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
        wx.setNavigationBarTitle({ title: that.data.foodDetail.title });
        //console.log(foodDetail);
        
      }
    })
  },

  //加引号的字段转化为数组
  arrayJson(credentials){
    // var credentials = '[{"authType":"0","picture":"http: //static1.aidingmao.com/rental/img/fae5e9f0-f295-11e7-b5ea-27875362170c.jpg"},{"authType":"1","picture":"http://static1.aidingmao.com/rental/img/feb6a100-f295-11e7-b5ea-27875362170c.jpeg"}]';

    if (credentials == null || credentials == '' || credentials === ' ') {
      credentials = [];
    } else if (credentials.indexOf(',') == - 1 && credentials.indexOf('.') > - 1) {
      var tempImg = [];
      tempImg.push(JSON.parse(credentials));
      credentials = tempImg;
    } else if (credentials.indexOf(',') > - 1) {
      credentials = JSON.parse(credentials);
    }
    return credentials;
  }





  
})