//index.js
const urls = require('../../../static/js/pubilc.js')
import {
  requestUtil,
  getBaseUrl
} from '../../../utils/requestUtil.js'

Page({
  data: {

  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    //获取页面跳转传过来的参数
    var foodId = options.id;
    //获取小程序码页面跳转传过来的参数
    const scene = decodeURIComponent(options.scene);
    if (foodId) {
      this.setData({
        foodId: foodId
      });
    } else if (scene) {
      this.setData({
        foodId: scene,
        isshare: 1
      });
    };
    //判断是否从分享页面打开
    if (options.isshare == 1) {
      this.setData({
        isshare: options.isshare
      });
    }; 

    this.getFoodDetails();
  },

  onReady: function() {

  }, //设置动态标题栏

  //判断页面是否为分享打开
  is_share() {

  },

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
  getFoodDetails(){
    let id = this.data.foodId;
    console.log(id)
    requestUtil({
      url: '/cookbook/cookbookDetail/?id='+ id,
      method: 'GET',
      data: {}
    }).then((res) => {
      let foodDetail = res.data[0];
      this.setData({
        foodDetail: foodDetail
      });
      wx.setNavigationBarTitle({
              title: foodDetail.title
            });
    })
    .catch((err) => {
      console.log(err)
    })
  },
  // getFoodDetails() {
  //   let id = this.data.foodId;
  //   wx.cloud.callFunction({
  //     name: 'getFoodDetails',
  //     data: {
  //       id: id
  //     }
  //   }).then(res => {
  //     let data = res.result;
  //     let foodDetail = res.result.data[0];
  //     // foodDetail.ingredients = this.arrayJson(foodDetail.ingredients);
  //     // foodDetail.steps = this.arrayJson(foodDetail.steps);
  //     // foodDetail.burden = this.arrayJson(foodDetail.burden);
  //     this.setData({
  //       foodDetail: foodDetail
  //     });
  //     wx.setNavigationBarTitle({
  //       title: this.data.foodDetail.title
  //     });
  //   })
  // },

  //查看图片详情
  lookImg(e) {
    let current = e.target.dataset.src;
    let steps = this.data.foodDetail.steps;
    let imgList = [];
    for (let i = 0; i < steps.length; i++) {
      imgList.push(steps[i].img);
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
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
  },

  //跳转至首页
  onDetail() {
    wx.reLaunch({ //子页面跳转
      url: "../index"
    })
  },

  //分享
  //转发按钮
  onShareAppMessage: function(ops) {
    let foodId = this.data.foodId;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      // console.log(ops.target)
    }
    return {
      title: this.data.foodDetail.title,
      path: 'pages/index/food-detail/food-detail?id=' + foodId + '&isshare=1',
      imageUrl: this.data.foodDetail.albums,
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

  //返回首页
  backHome: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  //选择菜品返回
  selectFood(e) {
    wx.setStorageSync('selectFoodVal', e.currentTarget.dataset.foodData)
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
})