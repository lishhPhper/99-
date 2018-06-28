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
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  formSubmit: function (e) {
    var list = e.detail.value;
    if (agent){
      // 代理商
    }else{
      // 厂家
    }
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
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
})