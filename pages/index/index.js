//index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    eat_time: '',
    time: '',
    foodNum: 2,
    fixedFood:false,
    //固定菜单
    fixedFoodMenu:[],
    //总体列表 早中晚餐

    //主菜列表
    mainCourse: '',


    //素菜列表

    //凉菜列表

    //甜品列表

    //汤列表

    //被选中列表
    foodMenu: '',

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //进入加载
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };

    this.setTime();
    this.getdata();

  },

  //判断当前时间
  setTime() {
    //获取util.js里面的时间函数
    var time = util.hour(new Date());
    //设置时间
    if (time < 10) {
      this.setData({
        eat_time: '早餐'
      });
    };
    if (time >= 10 && time < 14) {
      this.setData({
        eat_time: '午餐'
      });
    };
    if (time >= 14 && time < 20) {
      this.setData({
        eat_time: '晚餐'
      });
    };
    if (time >= 20 && time < 3) {
      this.setData({
        eat_time: '宵夜'
      });
    };
    this.setData({
      time: time
    });
  },

  //获取服务器菜单
  getdata() { //定义函数名称
    var that = this;
    wx.request({
      url: 'https://longcz.binzc.com/recipes/searchMenu?str=' + this.data.eat_time + '&pageSize=100&start=0', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},

      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          mainCourse: res.data
        });
        that.setFoodMenu();
        //console.log(res.data)
      }
    })
  },


  //根据人数设置菜品数目
  setFoodNum(event) {
    if (event.target.dataset.index == 1) {
      this.setData({
        foodNum: 2
      });
    };
    if (event.target.dataset.index == 2) {
      this.setData({
        foodNum: 3
      });
    };
    if (event.target.dataset.index == 3) {
      this.setData({
        foodNum: 4
      });
    };
    if (event.target.dataset.index == 5) {
      this.setData({
        foodNum: 8
      });
    };
    if (event.target.dataset.index == 12) {
      this.setData({
        foodNum: 12
      });
    };
    this.setFoodMenu();
  },

  //随机洗牌所有的菜单
  randomFoodMenu(array) {
    let m = array.length,
      t, i;
    //console.log(m);
    //如果还剩有元素
    while (m) {
      // 随机选取一个元素…
      i = Math.floor(Math.random() * m--);
      // 与当前元素进行交换
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
    //console.log(array);
  },

  //将洗牌后的数组使用传入需要显示的菜单
  setFoodMenu() {
    var foodMenu = this.randomFoodMenu(this.data.mainCourse);
    foodMenu = foodMenu.slice(0, this.data.foodNum);
    this.setData({
      foodMenu: foodMenu
    });
  },

  //点击随机选择
  randomFoodClick() {
    let that = this;
    let a = 10;
    setInterval(function() {
      if (a != 0) {
        a--;
        that.setFoodMenu();
        //console.log(a);
      }
    }, 100);
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

  //获取点击菜品传过来的值
  getFoodContent(event) {
    this.setData({
      selectFood: event.currentTarget.dataset.foodData,
      showModalStatus: true
    })
  },

  //固定菜品
  fixedFood(){
    //设置标签是否显示
    let fixedFood = this.data.selectFood.fixed;
    if (fixedFood){
      let selectFood = this.data.selectFood;
      selectFood.fixed = false;
      this.setData({
        selectFood: selectFood
      })
      //console.log(fixedFood);
    }else{
      //定义固定菜单数组
      let fixedFoodMenu = this.data.fixedFoodMenu;
      let selectFood = this.data.selectFood;
      //给选中菜单增加固定字段
      selectFood['fixed'] = true;
      fixedFoodMenu.push(this.data.selectFood);
      this.setData({
        //fixedFoodMenu: fixedFoodMenu,
        selectFood: selectFood
      })
      //console.log(fixedFoodMenu);
    }
    this.setData({
      // fixedFood: fixedFood
    })

  },


  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //退出登录
  exitUpLogo: function() {
    this.setData({
      userInfo: {},
      hasUserInfo: false
    })

  },



  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})