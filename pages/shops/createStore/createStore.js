const app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    agent:true,
    manufacturers:false,
    alreadySend: false,
    send: true,
    second: 60,
    phoneNum:'',
    isAgree:true,
    provinceIndex:0,
    province:[],
    provinceId:'',
    cityIndex: 0,
    city: [],
    cityId: '',
    districtIndex: 0,
    district: [],
    districtId: '',
    shop_img: '',
    upload_url: app.globalData.apiUrl + 'api/v1/image/temporary',
    license:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 省信息
    var that = this;
    if (that.data.province == false){
      wx.request({
        url: app.globalData.apiUrl + 'api/v1/site/region/0/1',
        header: {
          'content-type': 'application/json'
        },
        method: 'Get',
        success: function (res) {
          console.log(res);
          var region = res.data.data.region
          var id = region[that.data.provinceIndex].id
          that.setData({
            province: region,
            provinceId: id,
          });
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  checkAgent: function () {
    this.setData({
      agent:true,
      manufacturers: false
    });
  },
  checkManufacturers: function () {
    this.setData({
      agent: false,
      manufacturers: true
    });
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },

  // 手机号部分
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    if (phoneNum.length === 11) {
      this.setData({
        phoneNum: e.detail.value
      })
    }
  },

  checkPhoneNum: function (phoneNum) {
    let str = /^1(3|4|5|6|7|8)[0-9]\d{8}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号码不正确',
        image: '../../../image/fail.png'
      })
      return false
    }
  },

  getSendMsg: function () {
    var that = this;
    // 检查手机号码
    let checkedNum = this.checkPhoneNum(that.data.phoneNum)
    console.log(checkedNum);
    if(checkedNum){
      // 检查是否频繁发送
      if (that.data.send){
        // 请求发送验证码
        wx.request({
          url: app.globalData.apiUrl +'api/v1/sms/getAuthCode/' + that.data.phoneNum,
          method: 'GET',
          success: function (res) {
            that.setData({
              alreadySend: true,
              send: false
            })
          }
        })
        this.timer();
      }
    }
  },

  timer:function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },


  gotoShow: function (e) {
    var _this = this
    let img = e.currentTarget.dataset.img
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        var tempFilePaths = res.tempFilePaths
        _this.setData({
          facade: res.tempFilePaths[0]
        })
        //上传
        wx.uploadFile({
          url: _this.data.upload_url,
          filePath: res.tempFilePaths[0],
          name: 'img',
          header: {
            'content-type': 'multipart/form-data'
          }, // 设置请求的 header
          success: function (res) {
            var img_data = JSON.parse(res.data);
            console.log(img_data.state, img)
            if (img_data.state == 1) {
              if(img == '1'){
                _this.setData({
                  shop_img: img_data.data.img
                })
               
              }
              if(img == '2'){
                _this.setData({
                  license: img_data.data.img
                })
              }
            }
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  upload_file: function (url, filePath, name, formData, success, fail) {
    var _this = this;
    console.log(url);
    
  },
  getSanCode: function (event) {
    // 区别 门店和法人
    console.log(event.currentTarget.dataset.type);
    let type = event.currentTarget.dataset.type;
    wx.scanCode({
      success: (res) => {
        console.log(res.result)
        if (type === '1') {
          this.setData({
            wx_code: res.result,
          })
        }
        if (type === '2') {
          this.setData({
            license_code: res.result,
          })
        }
      }
    })
  },

  bindProvinceChange:function (e) {
    var index = e.detail.value
    var id = this.data.province[index].id
    this.setData({
      provinceIndex: index,
      provinceId: id,
    })
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/site/region/' + id + '/2',
      header: {
        'content-type': 'application/json'
      },
      method: 'Get',
      success: function (res) {
        var region = res.data.data.region
        var id = region[that.data.cityIndex].id
        that.setData({
          city: region,
          cityId: id,
        });
      }
    })
  },
  bindCityChange: function (e) {
    var index = e.detail.value
    var id = this.data.city[index].id
    this.setData({
      cityIndex: index,
      cityId: id,
    })
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/site/region/' + id + '/3',
      header: {
        'content-type': 'application/json'
      },
      method: 'Get',
      success: function (res) {
        var region = res.data.data.region
        var id = region[that.data.districtIndex].id
        that.setData({
          district: region,
          districtId: id,
        });
      }
    })
  },
  bindDistrictChange: function (e) {
    var index = e.detail.value
    var id = this.data.district[index].id
    this.setData({
      districtIndex: index,
      districtId: id,
    })
  },
  formSubmit: function (e) {
    var list = e.detail.value;
    var that = this;

    if (that.data.agent) {
      // 代理商
      console.log(list);
      
    }
    if (that.data.manufacturers) {
      // 厂家
    }
  },
})