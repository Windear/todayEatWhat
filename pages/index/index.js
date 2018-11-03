//index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    eat_time: '',
    time: '',
    peopleNum: 1,
    foodNum: 2,
    fixedFood: false,
    //预备固定菜单
    readyFixed: '',
    //固定菜单
    fixedFoodMenu: [],
    //总体列表 早中晚餐

    //主菜列表
    mainCourse: '',

    //素菜列表
    vegetableCourse: '',

    //凉菜列表
    coldCourse: '',

    //甜品列表
    sweetCourse: '',

    //汤列表
    soupCourse: '',

    //被选中列表
    foodMenu: [],
    userInfo: {},
    hasUserInfo: false,
    //canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //进入加载
  onLoad: function() {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // };
    //console.log(app.globalData.userInfo);

    this.setTime();
    this.getdata();
    this.getMain();
    this.getVegetable();
    this.getCold();
    this.getSweet();
    this.getSoup();
  },

  //显示页面执行函数
  onShow: function() {
    this.setSearchFood();
    //console.log(value);
  },

  //登录
  getUser() {

  },

  //或取搜索页面传回来的参数并添加到列表中并固定
  setSearchFood() {
    let value = wx.getStorageSync('selectFoodVal');
    let foodMenu = this.data.foodMenu;
    let selectFood = this.data.selectFood;
    let searchBtn = this.data.searchBtn;
    //console.log(searchBtn);
    if (searchBtn === 0) {
      //将传过来的参数直接添加到foodMenu并固定
      value['index'] = foodMenu[foodMenu.length - 1].index + 1;
      value['fixed'] = true;
      value['type'] = "main";
      //console.log(value);
      foodMenu.push(value);
      this.setData({
        foodMenu: foodMenu,
      });
    } else if (searchBtn === 1) {
      //将传过来的参数添加到selectFood并固定
      selectFood.fixed = true;
      selectFood.id = value.id;
      selectFood.albums = value.albums;
      selectFood.tags = value.tags;
      selectFood.title = value.title;
      //console.log(selectFood);      
      this.setData({
        selectFood: selectFood,
      });
    };
    this.setData({
      searchBtn: ""
    });
  },

  //判断当前时间
  setTime() {
    //获取util.js里面的时间函数
    var time = util.hour(new Date());
    //设置时间
    if (time >= 3 && time < 10) {
      this.setData({
        eat_time: '早餐'
      });
    };
    if (time >= 10 && time < 14) {
      this.setData({
        eat_time: '午餐'
      });
    };
    if (time >= 14 && time < 24) {
      this.setData({
        eat_time: '晚餐'
      });
    };
    if (time >= 0 && time < 3) {
      this.setData({
        eat_time: '晚餐'
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
      url: 'https://longcz.binzc.com/recipes/searchMenu?str=' + this.data.eat_time + '&pageSize=200&start=0', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},

      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          recommendCourse: res.data
        });
        that.setFoodMenu();
        //console.log(res.data)
      }
    })
  },

  //获取服务器菜单
  getMain() { //定义函数名称
    var that = this;
    wx.request({
      url: 'https://longcz.binzc.com/recipes/getDayMenu?pageSize=500&start=0', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          mainCourse: res.data
        });
        //console.log(res.data)
      }
    })
  },

  getVegetable() { //定义函数名称
    var that = this;
    wx.request({
      url: 'https://longcz.binzc.com/recipes/searchMenu?str=素菜' + '&pageSize=200&start=0', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          vegetableCourse: res.data
        });
      }
    })
  },

  getCold() { //定义函数名称
    var that = this;
    wx.request({
      url: 'https://longcz.binzc.com/recipes/searchMenu?str=凉菜' + '&pageSize=200&start=0', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          coldCourse: res.data
        });
      }
    })
  },

  getSweet() { //定义函数名称
    var that = this;
    wx.request({
      url: 'https://longcz.binzc.com/recipes/searchMenu?str=甜点' + '&pageSize=200&start=0', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          sweetCourse: res.data
        });
      }
    })
  },

  getSoup() { //定义函数名称
    var that = this;
    wx.request({
      url: 'https://longcz.binzc.com/recipes/searchMenu?str=汤' + '&pageSize=200&start=0', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          soupCourse: res.data
        });
      }
    })
  },
  //根据人数设置菜品数目
  setFoodNum(event) {
    if (event.target.dataset.index == 1) {
      this.setData({
        peopleNum: event.target.dataset.index,
        foodNum: 2,
      });
    };
    if (event.target.dataset.index == 2) {
      this.setData({
        peopleNum: event.target.dataset.index,
        foodNum: 3,
      });
    };
    if (event.target.dataset.index == 3) {
      this.setData({
        peopleNum: event.target.dataset.index,
        foodNum: 4,
      });
    };
    if (event.target.dataset.index == 5) {
      this.setData({
        peopleNum: event.target.dataset.index,
        foodNum: 8,
      });
    };
    if (event.target.dataset.index == 12) {
      this.setData({
        peopleNum: event.target.dataset.index,
        foodNum: 12,
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
    //创建食物列表。
    let foodMenu = new Array;
    for (let i = 0; i < this.data.foodNum; i++) {
      let obj = {
        "index": i + 1,
        "fixed": false,
        "type": "main"
      };
      foodMenu.push(obj);
    };
    //将随机菜品传入食物列表。
    let randomFood = this.randomFoodMenu(this.data.recommendCourse);
    randomFood = randomFood.slice(0, foodMenu.length);
    for (let j = 0; j < randomFood.length; j++) {
      foodMenu[j]["id"] = randomFood[j].id;
      foodMenu[j]["tags"] = randomFood[j].tags;
      foodMenu[j]["title"] = randomFood[j].title;
      foodMenu[j]["albums"] = randomFood[j].albums;
    };
    //console.log(foodMenu);
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
        that.setRandomFood();
        //console.log(a);
      }
    }, 100);
  },

  //判断菜单食物是否固定，如果固定则不随机，如果不固定则随机
  setRandomFood() {
    let foodMenu = this.data.foodMenu;

    for (let i = 0; i < foodMenu.length; i++) {
      let randomFood = [];
      if (foodMenu[i].type == "main") {
        randomFood = this.randomFoodMenu(this.data.mainCourse);
      };
      if (foodMenu[i].type == "vegetable") {
        randomFood = this.randomFoodMenu(this.data.vegetableCourse);
      };
      if (foodMenu[i].type == "cold") {
        randomFood = this.randomFoodMenu(this.data.coldCourse);
      };
      if (foodMenu[i].type == "sweet") {
        randomFood = this.randomFoodMenu(this.data.sweetCourse);
      };
      if (foodMenu[i].type == "soup") {
        randomFood = this.randomFoodMenu(this.data.soupCourse);
      };
      randomFood = randomFood.slice(0, 1);
      if (!foodMenu[i].fixed) {
        for (let j = 0; j < foodMenu.length; j++) {
          if (randomFood[0].id != foodMenu[j].id) {
            foodMenu[i]["id"] = randomFood[0].id;
            foodMenu[i]["tags"] = randomFood[0].tags;
            foodMenu[i]["title"] = randomFood[0].title;
            foodMenu[i]["albums"] = randomFood[0].albums;
          }
        };

      };

      // if (foodMenu[i].id){

      // }

    };
    this.setData({
      foodMenu: foodMenu
    });
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
    let selectFood = event.currentTarget.dataset.foodData;

    let foodMenu = this.data.foodMenu;
    //如果点击的是多加个菜（传过来的值为空）
    if (!selectFood) {
      let selectFoodRandom = this.randomFoodMenu(this.data.mainCourse);
      selectFoodRandom = selectFoodRandom.slice(0, 1)[0];
      selectFood = selectFoodRandom;
      if (foodMenu[foodMenu.length - 1]) {
        selectFood['index'] = foodMenu[foodMenu.length - 1].index + 1;
        //console.log(foodMenu);
      } else {
        selectFood['index'] = 1;
        //console.log(foodMenu);
      };
      selectFood['fixed'] = false;
      selectFood['type'] = "main";
      //console.log(foodMenu);
      this.setData({
        add: true
      })
    } else {
      this.setData({
        add: false
      })
    };
    //console.log(selectFood);
    this.setData({
      selectFood: selectFood,
      showModalStatus: true
    })
  },

  //固定菜品
  fixedFood() {
    //设置标签是否显示
    let fixedFood = this.data.selectFood.fixed;
    let selectFood = this.data.selectFood;
    if (fixedFood) {

      //将固定状态改为false然后放进data中
      selectFood.fixed = false;
      //console.log(selectFood);
      this.setData({
        selectFood: selectFood,
      });

      //console.log(fixedFood);
    } else {


      //给选中菜单增加固定字段
      selectFood.fixed = true;
      this.setData({
        selectFood: selectFood
      })
      //console.log(fixedFoodMenu);
    }
    this.setData({
      // fixedFood: fixedFood
    })

  },

  //确定菜品
  confirmFood() {
    let foodMenu = this.data.foodMenu;
    let selectFood = this.data.selectFood;
    let add = this.data.add;
    //将选择更改后的食物传入到食物菜单中
    //foodMenu[selectFood.index-1] = selectFood;

    for (let i = 0; i < foodMenu.length; i++) {
      if (foodMenu[i].index == selectFood.index) {
        foodMenu[i] = selectFood;
      }
    };
    if (add) {
      foodMenu.push(selectFood);
    }

    //console.log(foodMenu);
    this.setData({
      foodMenu: foodMenu,
      //readyFixed: '',
      foodNum: foodMenu.length,
      showModalStatus: false
    });
  },

  //删除菜品
  deleteFood() {
    let selectFood = this.data.selectFood;
    let foodMenu = this.data.foodMenu;
    for (let i = 0; i < foodMenu.length; i++) {
      if (foodMenu[i].index == selectFood.index) {
        foodMenu.splice(i, 1);
        // console.log(foodMenu)
      }
    };
    //console.log(foodMenu)
    this.setData({
      foodMenu: foodMenu,
      showModalStatus: false
    });
  },

  //将洗牌后的数组使用传入需要显示的菜单
  setSelectFoodMenu() {
    let selectFood = this.data.selectFood;
    let selectFoodRandom = [];
    if (selectFood.type == "main") {
      selectFoodRandom = this.randomFoodMenu(this.data.mainCourse);
    };
    if (selectFood.type == "vegetable") {
      selectFoodRandom = this.randomFoodMenu(this.data.vegetableCourse);
    }
    if (selectFood.type == "cold") {
      selectFoodRandom = this.randomFoodMenu(this.data.coldCourse);
    }
    if (selectFood.type == "sweet") {
      selectFoodRandom = this.randomFoodMenu(this.data.sweetCourse);
    }
    if (selectFood.type == "soup") {
      selectFoodRandom = this.randomFoodMenu(this.data.soupCourse);
    }
    selectFoodRandom = selectFoodRandom.slice(0, 1)[0];
    selectFood.id = selectFoodRandom.id;
    selectFood.tags = selectFoodRandom.tags;
    selectFood.title = selectFoodRandom.title;
    selectFood.albums = selectFoodRandom.albums;
    this.setData({
      selectFood: selectFood
    });
  },

  //弹窗食物随机选择
  randomSelectFood() {
    let selectFood = this.data.selectFood;
    if (!selectFood.fixed) {
      let that = this;
      let a = 10;
      setInterval(function() {
        if (a != 0) {
          a--;
          that.setSelectFoodMenu();
          //console.log(a);
        }
      }, 100);
    };

  },


  //弹窗选择菜品类别
  selectFoodType(e) {
    let foodType = e.currentTarget.dataset.type;
    let selectFood = this.data.selectFood;
    selectFood.type = foodType
    this.setData({
      selectFood: selectFood
    });
    this.randomSelectFood();
  },

  //跳转至菜品详情
  onFoodDetails(event) {
    let foodId = event.currentTarget.dataset.id;
    wx.navigateTo({ //子页面跳转
      url: "food-detail/food-detail?id=" + foodId
    })
  },

  //搜索
  bindKeyInput(e) {
    wx.navigateTo({ //子页面跳转
      url: "search/search?val=" + e.detail.value
    });

    this.setData({
      searchBtn: e.currentTarget.dataset.onbtn
    });

  },

  //生成菜单
  setFoodsMenu() {
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
              this.onAdd();
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

  //数据库的增加
  onAdd() {
    //app.globalData.userInfo = scope.userInfo
    let openid = app.globalData.openid
    let createTime = util.formatTime(new Date());
    //数据存储成功后跳转至菜单页面
    let data = {
      openid: openid,
      createTime: createTime,
      tellText: '',
      foodMenu: this.data.foodMenu,
      userInfo: app.globalData.userInfo
    };
    //console.log(data)
    const db = wx.cloud.database()
    db.collection('userFoodMenu').add({
      data: data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id      
        wx.navigateTo({
          url: "food-menu/food-menu?_id=" + res._id
        })
        //console.log('[数据库] [新增记录] 成功: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '网络不佳，请稍后再试。'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
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

  //定义转发
  onShareAppMessage: function (ops) {
    let _id = this.data._id;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      //console.log(ops.target)
    }
    return {
      title: '今天回家吃什么？',
      path: 'pages/index/index',
      success: function (res) {
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });

        // 转发成功
        //console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        //console.log("转发失败:" + JSON.stringify(res));
      }
    }

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