import {
  requestUtil,
  getBaseUrl
} from '../../../utils/requestUtil.js'

Page({
      data: {
        pageNum: 1,
        scrollTextShow: false,
        page: 1,
        hasMore: true,
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




      //获取本地数据库数据（非微信云开发）
      async getCategoryFoods(val, num) {
        let filter = val;
        let page = num;
        let url = '/cookbook/cookbookList/'
        if (filter) url = '/cookbook/cookbookList/?search=' + filter + '&p=' + page;
        await requestUtil({
          url: url,
          method: 'GET',
          data: {}
        }).then((res) => {
          let data = res.data.results;
          let foodList = data;
          if (page == 1) {
           
            this.setData({
              scrollTextShow: false,
              pageNum: num + 1,
              foodList: foodList
            });
          } else {
           
            foodList = this.data.foodList;
          
            let newList = data;
            console.log(res.data)
            if (newList.length !== 0) {
              for (let i = 0; i < newList.length; i++) {
                foodList.push(newList[i]);
              };
              this.setData({
                foodList:foodList,
                pageNum: res.data.pageIndex + 1,
              });
            }

          }
          //如果返回后面没有数据了
          if (res.data.next == null) {
            
            this.setData({
              scrollTextShow: true,
              hasMore : false
            });
          }

          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
      })
    .catch((err) => {
      console.log(err)
    })

  },

  //清除搜索栏文字
  removeSearchVal() {
    console.log(12312312)
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
  /**
   * 页面上拉触底事件的处理函数
   */
  //上拉加载
  onReachBottom: function () {
    if(this.data.hasMore){
      this.onTopScroll()
    }
  },



  onTopScroll() {
    let pageNum = this.data.pageNum;
    console.log(pageNum)
    this.getCategoryFoods(this.data.foodVal, this.data.pageNum);
  },
//下拉刷新
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getCategoryFoods(this.data.foodVal, 1);
    this.setData({
      hasMore: true,
    });
  },

  //选择菜品返回
  selectFood(e) {
    wx.setStorageSync('selectFoodVal', e.currentTarget.dataset.foodData)
    wx.navigateBack({
      delta: 1
    })
  },
})