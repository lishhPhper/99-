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
          url: '',
          data: {
            phoneNum: this.data.phoneNum
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
          }
        })

        this.setData({
          alreadySend: true,
          send: false
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


  gotoShow: function () {
    var _this = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        console.log(res)
        _this.setData({
          facade: res.tempFilePaths[0]
        })
        // 上传
        this.upload_file('facade/',res.tempFilePaths[0]);
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
    wx.uploadFile({
      url: '' + url,
      filePath: filePath,
      name: name,
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: formData, // HTTP 请求中其他额外的 form data
      success: function (res) {
        console.log(res);
        if (res.status == 1 && !res.data.error_code) {
          typeof success == "function" && success(res.data);
        } else {
          typeof fail == "function" && fail(res);
        }
      },
      fail: function (res) {
        console.log(res);
        typeof fail == "function" && fail(res);
      }
    })
  },
  getSanCode: function (event) {
    // 区别 门店和法人
    console.log(event.currentTarget.dataset.type);
    let type = event.currentTarget.dataset.type;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (type === '1') {

        }
        if (type === '2') {

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