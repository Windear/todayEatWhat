//index.js
const util = require('../../utils/util.js')
import {
  requestUtil,
  getBaseUrl
} from '../../utils/requestUtil.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    appData:null,
    eat_time: '',
    time: '',
    peopleNum: 1,
    foodNum: 2,
    fixedFood: false,
    //预备固定菜单
    readyFixed: '',
    //主菜列表
    recommendCourse: [],

    //素菜列表
    vegetableCourse: [],

    //凉菜列表
    coldCourse: [],

    //甜品列表
    sweetCourse: [],

    //汤列表
    soupCourse: [],

    //被选中列表
    foodMenu: [],
    userInfo: app.globalData.userInfo,
    openid: app.globalData.openid,
    //canIUse: wx.canIUse('button.open-type.getUserInfo')
    //第几次请求,默认为第一次
    page: 1,
    //标签列表
    tags: [{
      val: "懒人食谱",
      color: "#FF5E5E"
    }, 
    // {
    //   val: "视频",
    //     color: "#FF7DA1"
    // }, 
    {
      val: "家常菜",
        color: "#FF9A9A"
    }, {
      val: "下饭菜",
        color: "#FFCB33"
    }, {
      val: "烘焙",
        color: "#6DDF88"
    }, {
      val: "快手菜",
        color: "#7AD8EC"
      }, {
        val: "减肥",
        color: "#FFD86C"
      },],
  },

  //进入加载
  onLoad: function() {
    this.setData({
      appData: app.globalData,
      openid : app.globalData.openid
    });
    this.setTime();
    this.getaAllFoods();
  },

  //显示页面执行函数
  onShow: function() {
    this.setSearchFood();
    //console.log(value);
  },

  //搜索标签
  touchSearchTags(event) {
    let value = event.currentTarget.dataset.value;
    wx.navigateTo({ //子页面跳转
      url: "search/search?val=" + value
    });
    this.setData({
      searchBtn: 0
    });
  },

  //或取搜索页面传回来的参数并添加到列表中并固定
  setSearchFood() {
    let value = wx.getStorageSync('selectFoodVal');
    let foodMenu = this.data.foodMenu;
    let selectFood = this.data.selectFood;
    let searchBtn = this.data.searchBtn;
    //console.log(searchBtn);
    if (value) {
      if (searchBtn === 0) {
        let food = {};
        //将传过来的参数直接添加到foodMenu并固定
        food['index'] = foodMenu[foodMenu.length - 1].index + 1;
        food['fixed'] = true;
        food['type'] = "main";
        food['id'] = value.id;
        food['albums'] = value.albums;
        food['tags'] = value.tags;
        food['title'] = value.title;
        //console.log(value);
        foodMenu.push(food);
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
      wx.setStorageSync('selectFoodVal', null)
    }
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

  //查询菜单数据
  getCategoryFoods(category, q) {
    let filter = q;
    let page = this.data.page;
    let url = '/cookbook/cookbookList/?search=' + filter
    requestUtil({
      url: url,
      method: 'GET',
      data: {}
    }).then(res => {
      let data = res.data.results;
      this.setData({
        page: res.previous?res.previous:0 + 1
      });
      // console.log(data)
      //根据类别将返回的数据传到相应的数组中
      if (category == "main") {
        let recommendCourse = this.data.recommendCourse;
        recommendCourse = recommendCourse.concat(data);
        this.setData({
          recommendCourse: recommendCourse
        });
        this.setFoodMenu();
      }
      if (category == "vegetable") {
        let vegetableCourse = this.data.vegetableCourse;
        vegetableCourse = vegetableCourse.concat(data);
        this.setData({
          vegetableCourse: vegetableCourse
        });
      }
      if (category == "cold") {
        let coldCourse = this.data.coldCourse;
        coldCourse = coldCourse.concat(data);
        this.setData({
          coldCourse: coldCourse
        });
      }
      if (category == "sweet") {
        let sweetCourse = this.data.sweetCourse;
        sweetCourse = sweetCourse.concat(data);
        this.setData({
          sweetCourse: sweetCourse,
        });
      }
      if (category == "soup") {
        let soupCourse = this.data.soupCourse;
        soupCourse = soupCourse.concat(data);
        this.setData({
          soupCourse: soupCourse,
        });
      }
    })
  },

  //获取所有分类下的菜单
  getaAllFoods() {
    this.getCategoryFoods('main', this.data.eat_time);
    this.getCategoryFoods('vegetable', '素食');
    this.getCategoryFoods('cold', '凉');
    this.getCategoryFoods('sweet', '甜品');
    this.getCategoryFoods('soup', '汤');
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
    //
  },

  //判断菜单食物是否固定，如果固定则不随机，如果不固定则随机
  setRandomFood() {
    let foodMenu = this.data.foodMenu;

    for (let i = 0; i < foodMenu.length; i++) {
      let randomFood = [];
      if (foodMenu[i].type == "main") {
        randomFood = this.randomFoodMenu(this.data.recommendCourse);
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
      showModalStatus: false,
      showAddFoodModal: false,
    })
  },

  //获取点击菜品传过来的值
  getFoodContent(event) {
    let selectFood = event.currentTarget.dataset.foodData;
    let foodMenu = this.data.foodMenu;
    this.setData({
      add: false
    })
    this.setData({
      selectFood: selectFood,
      showModalStatus: true
    })
  },

  //多加个菜
  addFood() {
    //弹出加菜列表
    this.setData({
      //selectFood: selectFood,
      showAddFoodModal: true
    })
  },

  //加什么菜
  addWhatFood(what) {
    //关闭弹窗
    this.hideModal();
    let foodMenu = this.data.foodMenu;
    let selectFoodRandom, selectFoodDetails;
    let selectFood = {};
    let type = what.currentTarget.dataset.what;
    //点击随便加个菜
    if (type == "main") {
      selectFoodDetails = this.randomFoodMenu(this.data.recommendCourse).slice(0, 1)[0];

    }
    //点击加个素菜
    if (type == "vegetable") {
      selectFoodDetails = this.randomFoodMenu(this.data.vegetableCourse).slice(0, 1)[0];
    }
    //点击加个凉菜
    if (type == "cold") {
      selectFoodDetails = this.randomFoodMenu(this.data.coldCourse).slice(0, 1)[0];
    }
    //点击加个甜品
    if (type == "sweet") {
      selectFoodDetails = this.randomFoodMenu(this.data.sweetCourse).slice(0, 1)[0];
    }
    //点击加个汤
    if (type == "soup") {
      selectFoodDetails = this.randomFoodMenu(this.data.soupCourse).slice(0, 1)[0];
    }
    //如果菜单列表的长度-1不等于0（菜单列表不为空）
    if (foodMenu[foodMenu.length - 1]) {
      //顺序放到最后一个的+1位后面
      selectFood['index'] = foodMenu[foodMenu.length - 1].index + 1;
    } else {
      //顺序为第一个
      selectFood['index'] = 1;
    };
    //不是固定菜品
    selectFood['fixed'] = false;
    selectFood['type'] = type;
    selectFood['id'] = selectFoodDetails.id;
    selectFood['tags'] = selectFoodDetails.tags;
    selectFood['title'] = selectFoodDetails.title;
    selectFood['albums'] = selectFoodDetails.albums;
    //console.log(foodMenu);
    this.setData({
      selectFood: selectFood,
      add: true
    })
    this.confirmFood()
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
      selectFoodRandom = this.randomFoodMenu(this.data.recommendCourse);
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
            this.onAdd()
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
      // createTime: createTime,
      tellText: '',
      foodMenu: this.data.foodMenu,
      userInfo: app.globalData.userInfo
    };
    let url = '/cookbook/userCookBook/'
    requestUtil({
      url: url,
      method: 'POST',
      data: data
    }).then((res) => {
         wx.navigateTo({
          url: "food-menu/food-menu?_id=" + res.data.id
        })
    })
    .catch((err) => {
      console.log(err)
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
  onShareAppMessage: function(ops) {
    let _id = this.data._id;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      //console.log(ops.target)
    }
    return {
      title: '今天回家吃什么？',
      path: 'pages/index/index',
      success: function(res) {
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });

        // 转发成功
        //console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        //console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  //跳转至外卖页面
  onWaimai() {
    wx.navigateTo({ //子页面跳转
      url: "waimai/waimai"
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