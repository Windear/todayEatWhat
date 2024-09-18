import {
  requestUtil,
  getBaseUrl
} from '../../../utils/requestUtil.js'

Page({
  data: {
    pageNum: 1,
    scrollTextShow: false,
    page: 1,
    hasMore: false,
  },
  //同步搜索框val
  setFoodVal(e) {
    this.setData({
      foodVal: e.detail.value
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var val = options.val; //获取页面跳转传过来的参数
    //console.log(foodId);
    this.setData({
      foodVal: val,
    });
    wx.setNavigationBarTitle({
      title: "告诉妈妈想吃什么"
    });
    this.getSys();
  },

  //获取系统信息
  getSys() {
    var that = this
    // 获取系统信息
    wx.getWindowInfo({
      success: function (res) {
        //console.log(res);
        // 可使用窗口宽度、高度
        //console.log('height=' + res.windowHeight);
        //console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          scroll_height: res.windowHeight - 48
        })
      }
    })
  },


  onReady: function () {
    this.getCategoryFoods(this.data.foodVal, this.data.pageNum);
  },


  //查询菜单数据
  // getCategoryFoods(val, num) {
  //   let filter = val;
  //   let page = num;
  //   wx.cloud.callFunction({
  //     name: 'getCategoryFoods',
  //     data: {
  //       //数据库名称
  //       dbName: 'foodDetails',
  //       //筛选条件
  //       filter: filter,
  //       //返回多少条数据
  //       pageSize: 10,
  //       //第几页
  //       pageIndex: page
  //     }
  //   }).then(res => {
  //     let data = res.result.data;
  //     //console.log(res.result)
  //     let foodList;
  //     if (num == 1) {
  //       foodList = data;
  //       this.setData({
  //         scrollTextShow: false,
  //         pageNum: num + 1,
  //       });
  //     } else {
  //       foodList = this.data.foodList;
  //       let newList = data;
  //       if (newList.length !== 0) {
  //         for (let i = 0; i < newList.length; i++) {
  //           foodList.push(newList[i]);
  //         };
  //         this.setData({
  //           pageNum: res.result.pageIndex + 1,
  //         });
  //         //console.log(newList);
  //       }
  //     }
  //     //如果返回后面没有数据了
  //     if (!res.result.hasMore){
  //       this.setData({
  //         scrollTextShow: true,
  //       });
  //     }
  //     this.setData({
  //       foodList: foodList
  //     });
  //   })
  // },

  //获取本地数据库数据（非微信云开发）
  async getCategoryFoods(val, num) {
    let filter = val;
    let page = num;
    let url = '/cookbook/cookbookList/'
    if (filter) url = '/cookbook/cookbookList/?search=' + filter
    await requestUtil({
        url: url,
        method: 'GET',
        data: {}
      }).then((res) => {
        let data = res.data.results;
        let foodList = data;
        this.setData({
          scrollTextShow: false,
          pageNum: num + 1,
          foodList: foodList
        });
      })
      .catch((err) => {
        console.log(err)
      })

  },

  //清除搜索栏文字
  removeSearchVal() {
    this.setData({
      foodVal: ''
    });
  },

  //搜索
  bindKeyInput(e) {
    this.getCategoryFoods(e.detail.value, 1);

  },

  //文字点搜索
  bindKeyText(event) {
    console.log(event.currentTarget.dataset.value);
    this.getCategoryFoods(event.currentTarget.dataset.value, 1);
  },

  //进入详情
  //跳转至菜品详情
  onFoodDetails(event) {
    let foodId = event.currentTarget.dataset.id;
    wx.navigateTo({ //子页面跳转
      url: "../food-detail/food-detail?id=" + foodId
    })
  },

  //上拉加载
  onTopScroll() {
    //let pageNum = this.data.pageNum;
    console.log(pageNum)
    this.getCategoryFoods(this.data.foodVal, this.data.pageNum);
  },

  //选择菜品返回
  selectFood(e) {
    wx.setStorageSync('selectFoodVal', e.currentTarget.dataset.foodData)
    wx.navigateBack({
      delta: 1
    })
  },
})