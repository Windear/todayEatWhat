
Page({
  data: {
    scrollNum:1,
    scrollTextShow:false,
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var val = options.val;//获取页面跳转传过来的参数
    //console.log(foodId);
    this.setData({
      foodVal: val,
    });
    wx.setNavigationBarTitle({ title: "告诉妈妈想吃什么" });
    this.getSys();
  },

  //获取系统信息
  getSys() {
    var that = this
    // 获取系统信息
    wx.getSystemInfo({
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
    this.getdata(this.data.foodVal,0);
  },//设置动态标题栏

  //获取服务器菜单
  getdata(val,num) { //定义函数名称
    let that = this;
    let scrollNum = this.data.scrollNum;
    wx.request({
      url: 'https://longcz.binzc.com/recipes/searchMenu?str=' + val + '&pageSize=9&start='+ num, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let foodList;
        if(num == 0){
          foodList = res.data;
          that.setData({
            scrollTextShow: false,
          });
        }else{
          foodList = that.data.foodList;
          let newList = res.data;
          
          if (newList.length !== 0){
            for (let i = 0; i < newList.length; i++) {
              foodList.push(newList[i]);
            };
            that.setData({
              scrollNum: scrollNum + 1,
              
            });
            console.log(newList);
          }else{
            that.setData({
              scrollTextShow: true,
            });
          }
        }      
        that.setData({
          foodList: foodList
        });
        //wx.setNavigationBarTitle({ title: that.data.foodDetail.title });
        //console.log(foodList);
      }
    })
  },


  //清除搜索栏文字
  removeSearchVal(){
    this.setData({
      foodVal: ''
    });
  },

  //搜索
  bindKeyInput(e) {
    this.getdata(e.detail.value,0);
   
  },

  //同步搜索框val
  setFoodVal(e){
    this.setData({
      foodVal: e.detail.value
    })
  },

  //文字点搜索
  bindKeyText(event) {
    //console.log(event.currentTarget.dataset.value);
    this.getdata(event.currentTarget.dataset.value, 0);
  },

  //进入详情
  //跳转至菜品详情
  onFoodDetails(event) {
    let foodId = event.currentTarget.dataset.id;
    wx.navigateTo({  //子页面跳转
      url: "../food-detail/food-detail?id=" + foodId
    })
  },

  //上拉加载
  onTopScroll(){
    let scrollNum = this.data.scrollNum;
    this.getdata(this.data.foodVal, scrollNum);
   
  }
  
})