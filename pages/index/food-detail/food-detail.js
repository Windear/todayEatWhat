
Page({
  data: {

  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var foodId = options.id;//获取页面跳转传过来的参数
    console.log(foodId);
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
        //foodDetail.ingredients = foodDetail.ingredients.replace('[', '').replace(']', '')
        that.setData({
          foodDetail: res.data
        });
        wx.setNavigationBarTitle({ title: that.data.foodDetail.title });
        console.log(foodDetail.ingredients)
      }
    })
  },





  
})