// pages/index/food-menu/food-menu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    showShareModalStatus: false,
    ingredientsList: [],
    burdenList: [],
    isshare: 0,
    isUser: false,
    showCanvasImg: false,
    tipText: "最难忘的还是妈妈的味道！",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var _id = options._id; //获取页面跳转传过来的参数
    const scene = decodeURIComponent(options.scene); //获取小程序码页面跳转传过来的参数

    if (_id) {
      this.setData({
        _id: _id
      });
    } else if (scene) {
      this.setData({
        _id: scene,
        isshare: 1
      });
    };

    this.getCodeImg();


    wx.setNavigationBarTitle({
      title: "回家吃菜单"
    });

    this.getFoodMenu();

    //判断是否从分享页面打开
    if (options.isshare == 1) {
      this.setData({
        isshare: options.isshare
      });  
    }; 
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let isshare = this.data.isshare;
    //获取头像图片

    if (isshare == 0) {
      let touxiang = app.globalData.userInfo.avatarUrl;
      //将头像保存到临时文件夹
      wx.downloadFile({
        url: touxiang, // 网络返回的图片地址
        fail: function(err) {
          console.log(err)
        },
        success: function(res) {
          that.setData({
            userImagePath: res.tempFilePath,
          });
          //console.log(res.tempFilePath)
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.deleteCodeImg();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //获取菜单数据
  getFoodMenu() {
    const db = wx.cloud.database();
    let _id = this.data._id;
    if (_id) {
      // 查询当前用户所有的 counters
      db.collection('userFoodMenu').where({
        _id: this.data._id
      }).get({
        success: res => {
          // console.log(res);
          let data = res.data[0];

          this.setData({
            data: data,
          })
          //判断是否为当前用户的菜单
          if (app.globalData.openid === data._openid) {
            this.setData({
              isUser: true,
            })
          }
          //console.log(data);
          this.getFoodMaterial();

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '网络不佳，请稍后再试'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    }

  },

  //获取食材数据
  getFoodMaterial() {
    let foodList = this.data.data.foodMenu;
    let mainMaterial, accessories = new Array;
    //遍历出每个菜品的id号
    for (let i = 0; i < foodList.length; i++) {
      let foodid = foodList[i].id;
      this.getdata(foodid);
    }
    //console.log(this.data.burdenList);
  },

  //获取数据
  getdata(id) { //定义函数名称
    wx.cloud.callFunction({
      name: 'getFoodDetails',
      data: {
        id: id
      }
    }).then(res => {
      let foodDetail = res.result.data[0];
      //主料列表
      let ingredientsList = this.data.ingredientsList;
      //辅料列表
      let burdenList = this.data.burdenList;
      //辅料
      let burden = foodDetail.burden;
      //主料
      let ingredients = foodDetail.ingredients;

      for (let i = 0; i < ingredients.length; i++) {
        ingredientsList.push(ingredients[i]);
      }

      for (let j = 0; j < burden.length; j++) {
        burdenList.push(burden[j]);
      }
      // console.log(burdenList);
      this.setData({
        ingredientsList: ingredientsList,
        burdenList: burdenList
      })
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

  //打开分享弹出框
  showShare() {
    var that = this;
    if (!this.data.imagePath) {
      this.setData({
        showShareModalStatus: true
      })

      wx.showToast({
        title: '生成图片中',
        icon: 'loading',
        duration: 1000
      });
      setTimeout(function() {

        wx.hideToast();
        that.showCanvas();

      }, 1000)
    } else {
      this.setData({
        showShareModalStatus: true
      })
    }
    //this.showCanvas();
  },

  //关闭分享弹出框
  hideShare() {
    this.setData({
      showShareModalStatus: false
    })
  },



  //跳转至菜品详情
  onFoodDetails(event) {
    let foodId = event.currentTarget.dataset.id;
    wx.navigateTo({ //子页面跳转
      url: "../food-detail/food-detail?id=" + foodId
    })
  },

  //跳转至首页
  onDetail() {
    wx.reLaunch({ //子页面跳转
      url: "../index"
    })
  },

  //分享菜单
  shareFoodMenu() {
    wx.showModal({
      title: '分享给好友',
      content: '您可以直接发送给好友，也可以生成图片发送到朋友圈。',
      //showCancel: false,
      confirmText: '分享好友',
      cancelText: '生成图片',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //转发按钮
  onShareAppMessage: function(ops) {
    let _id = this.data._id;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: this.data.data.userInfo.nickName + '的菜单',
      path: 'pages/index/food-menu/food-menu?_id=' + _id + '&isshare=1',
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

  //修改给妈妈的话input
  bindKeyInput(e) {
    let that = this;
    const db = wx.cloud.database()
    db.collection('userFoodMenu').doc(this.data._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        tellText: e.detail.value
      },

      success: function(res) {
        that.setData({
          tellText: e.detail.value
        });
      }
    })
  },

  backHome: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  //canvas画图
  showCanvas() {
    let that = this;
    let userImg = that.data.userImagePath;
    let tipText = that.data.tipText;
    let tellText = that.data.tellText;
    var img = `/static/img/poster_bg` + Math.floor(Math.random() * 6) + `.png`;
    //判断想跟妈妈说的话是否为空
    if (!tellText) {
      tipText = that.data.tipText;
    } else {
      tipText = that.data.tellText;
    };
    //console.log(userImg)
    const ctx = wx.createCanvasContext('canvas_poster');
    ctx.clearRect(0, 0, 0, 0);
    //设置画布背景
    ctx.setFillStyle("#fff");
    //设置画布尺寸
    ctx.fillRect(0, 0, 260, 393);
    //绘制图片模板的展示图

    // console.log(img)
    ctx.drawImage(img, 0, 0, 260, 260);
    ctx.save(); // 保存当前context的状态


    //画出圆头像
    ctx.beginPath();
    ctx.arc(26, 286, 20, 0, 2 * Math.PI); //画出圆
    //ctx.setFillStyle('#fff');
    ctx.clip(); //裁剪上面的圆形
    ctx.drawImage(userImg, 10, 270, 40, 40);
    ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制

    //画出显示文字
    ctx.setFontSize(16);
    ctx.setFillStyle('#1F2D3D');
    ctx.fillText(tipText, 60, 285, 190);
    //画出用户名
    ctx.setFontSize(12);
    ctx.setFillStyle('#8492A6');
    ctx.fillText(app.globalData.userInfo.nickName, 60, 307, 190);
    //画一条线
    ctx.setFillStyle('#E0E6ED');
    ctx.fillRect(10, 320, 240, 1);
    //写提示文字
    ctx.setFontSize(10);
    ctx.setFillStyle('#8492A6');
    ctx.fillText('长按小程序码', 10, 350, 190);
    ctx.setFontSize(10);
    ctx.setFillStyle('#8492A6');
    ctx.fillText('查看好友今天想吃些啥？', 10, 365, 190);
    //画出小程序码

    ctx.drawImage(that.data.codeImagePath, 200, 330, 50, 50);
    ctx.save();
    //不知道是什么原因，手机环境能正常显示

    ctx.draw();

    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'canvas_poster',
        success: function(res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            showCanvasImg: true
          });
          //console.log(that.data.imagePath);
        },
        fail: function(res) {
          console.log(res);
        }
      });
    }, 200);

  },



  //获取小程序二维码
  getCodeImg() {
    let that = this;
    let id = this.data._id;
    wx.cloud.callFunction({
      name: 'token',
      data: { // 小程序码所需的参数
        page: "pages/index/food-menu/food-menu",
        id: id,
      },
      complete: res => {
        //console.log(id);
        //console.log(res);

        let appcode = res.result.code_add;
        let codeID = res.result.fileID;
        //console.log(appcode)
        wx.downloadFile({
          url: appcode, // 网络返回的图片地址
          fail: function(err) {
            console.log(err)
          },
          success: function(res) {
            that.setData({
              codeImagePath: res.tempFilePath,
              fileID: codeID
            });
            //console.log(res.tempFilePath)
          }
        });
      }
    });

  },

  //结束后删除上传的code
  deleteCodeImg() {
    let that = this;
    wx.cloud.callFunction({
      name: 'deleteCodeImg',
      data: { // 小程序码所需的参数
        fileId: that.data.fileID
      },
      complete: res => {
        //console.log(res);
      }
    });

  },

  //保存图片至相册
  baocun: function() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                showShareModalStatus: false
              })
            }
          },
          fail: function(res) {
            console.log(11111)
          }
        })
      }
    })
  },


})