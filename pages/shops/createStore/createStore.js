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
    pre_phone:'',
    isAgree:true,
    region: ['北京市', '北京市', '朝阳区'],
    customItem: '',
    provinceIndex:0,
    province:[],
    provinceId:'',
    cityIndex: 0,
    city: [],
    cityId: '',
    districtIndex: 0,
    district: [],
    districtId: '',
    wx_code:'',
    shop_img: '',
    license: '',
    license_code:'',
    upload_url: app.globalData.apiUrl + 'api/v1/image/temporary',
    category_id:'',
    category_name:'',
    category_child_id:'',
    userToken:'',
    user_info:{},
    store_name:'',
    store_contact:'',
    editState:false,
    town:'',
    address:'',
    user_name:'',
    phone:'',
    factory_address:'',
    checkStore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    var user_info = userInfo.user_info
    var userToken = userInfo.token
    that.setData({
      userInfo: user_info,
      userToken,
    })
    console.log(options);
    var group_type = options.group;
    if (typeof (group_type) != "undefined"){
      var checkStore = false;
      if(group_type == 1){
        that.setData({
          agent: false,
          manufacturers: true,
          checkStore
        })
      } else if (group_type == 2){
        that.setData({
          agent: true,
          manufacturers: false,
          checkStore
        })
      }
      wx.request({
        url: app.globalData.apiUrl + '/api/v1/shop/editRegister',
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'userToken': userToken
        },
        success: function (res) {
          console.log(res);
          if (res.data.state == 1) {
            that.setData({
              editState:true,
              store_name: res.data.data.store_name,
              phoneNum: res.data.data.store_phone,
              pre_phone: res.data.data.store_phone,             
              store_contact: res.data.data.store_contact,
              store_wx: res.data.data.store_wx,
              wx_code: res.data.data.wx_code,
              region: [res.data.data.province, res.data.data.city, res.data.data.district],
              town:res.data.data.town,
              address: res.data.data.address,
              shop_img: res.data.data.shop_img,
              factory_address: res.data.data.factory_address,
              category_id: res.data.data.category_id,
              category_child_id: res.data.data.category_child_id,
              license: res.data.data.license,
              user_name: res.data.data.user_name,
              phone: res.data.data.phone,
              wx_account: res.data.data.wx_account,
              license_code: res.data.data.license_code,
              category_name: res.data.data.classify_name
            })
          }
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
    var checkStore = this.data.checkStore
    if(checkStore){
      this.setData({
        agent: true,
        manufacturers: false
      });
    }
  },
  checkManufacturers: function () {
    var checkStore = this.data.checkStore
    if (checkStore) {
      this.setData({
        agent: false,
        manufacturers: true
      });
    }
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
        var userToken = that.data.userToken;
        wx.request({
          url: app.globalData.apiUrl +'api/v1/sms/getAuthCode/' + that.data.phoneNum,
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'userToken': userToken
            // 'userToken': '1376961ed2a0ef59c13a06a718399805'
          },
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
    var img = e.currentTarget.dataset.type
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        var tempFilePaths = res.tempFilePaths
        _this.setData({
          facade: res.tempFilePaths[0]
        })
        //上传
        var userToken = _this.data.userToken
        wx.uploadFile({
          url: _this.data.upload_url,
          filePath: res.tempFilePaths[0],
          name: 'img',
          header: {
            'content-type': 'multipart/form-data',
            'userToken': userToken
            // 'userToken': '1376961ed2a0ef59c13a06a718399805'
          }, // 设置请求的 header
          success: function (res) {
            var img_data = JSON.parse(res.data);
            if (img_data.state == '1') {
              switch (img){
                case '1':
                  _this.setData({
                    wx_code: img_data.data.img
                  })
                  break;
                case '2':
                  _this.setData({
                    shop_img: img_data.data.img
                  })
                  break;
                case '3':
                  _this.setData({
                    license: img_data.data.img
                  })
                  break;
                case '4':
                  _this.setData({
                    license_code: img_data.data.img
                  })
                  break;
              }
            }
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        console.log(_this.data.wx_code, _this.data.shop_img, _this.data.license, _this.data.license_code)
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

  bindRegionChange: function (event) {
    console.log('picker发送选择改变，携带值为',event.detail.value)
    this.setData({
      region: event.detail.value
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
    var userToken = this.data.userToken
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/site/region/' + id + '/2',
      header: {
        'content-type': 'application/json',
        // 'userToken':'48d56c38ba9d810987577e7250c9223e'
        'userToken': userToken
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
    var userToken = that.data.userToken;
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/site/region/' + id + '/3',
      header: {
        'content-type': 'application/json',
        'userToken': userToken
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
    var isAgree = that.data.isAgree
    if(!isAgree){
      wx.showToast({
        title: '请先勾选协议',
        image: '../../../image/fail.png'
      })
      return false
    }
    var request_data = {};
    if (that.data.agent) {
      // 代理商
      request_data.shop_name = list.name;
      request_data.shop_contact = list.contact;
      request_data.shop_wx = list.store_wx;
      request_data.wx_code = that.data.wx_code;
      request_data.town = list.town;
      request_data.address = list.address;
      request_data.shop_img = that.data.shop_img;
      request_data.license = that.data.license;
      request_data.user_name = list.user_name;
      request_data.phone = list.phone;
      request_data.wx_account = list.wx_account;
      request_data.license_code = that.data.license_code;                        
      var type = 1;
      var url = app.globalData.apiUrl + 'api/v1/shop/register';
    }
    if (that.data.manufacturers) {
      // 厂家
      request_data.factory_contact = list.contact;
      request_data.factory_wx = list.store_wx;
      request_data.wx_code = that.data.wx_code;
      request_data.town = list.town;
      request_data.address = list.address;
      request_data.factory_img = that.data.shop_img;
      request_data.factory_name = list.factory_name;
      request_data.factory_address = list.factory_address;
      request_data.license = that.data.license;
      request_data.user_name = list.user_name;
      request_data.phone = list.phone;
      request_data.wx_account = list.wx_account;
      request_data.license_code = that.data.license_code;           
      var type = 2;
      var url = app.globalData.apiUrl + 'api/v1/factory/register';
    }
   
    //检查手机号码和手机验证码
    var checkedNum = that.checkPhoneNum(list.store_phone);
    if(!checkedNum){
      wx.showToast({
        title: '手机号码不正确',
        image: '../../../image/fail.png'
      })
      return false
    }
    if (that.data.agent) {
      request_data.shop_phone = list.store_phone;
    }else{
      request_data.factory_phone = list.store_phone;
    }
    var editState = that.data.editState
    var pre_phone = that.data.pre_phone
    request_data.editState = editState
    if (!editState || (typeof (pre_phone) != "undefined" && pre_phone != list.store_phone)){
      console.log(11)
      that.checkPhoneCode(list.code);
    }
    
    request_data.code = list.code;
    // 检查地区、乡镇
    var region = that.data.region;
    that.checkAddress(region, list.town);
    if(region[1] == '县'){
      region[1] = region[0];
    }
    request_data.province = region[0];
    request_data.city = region[1];
    request_data.district = region[2];
    // 检查经营类别
    var category_id = that.data.category_id;
    var category_child_id = that.data.category_child_id;
    if (category_id == '' || category_child_id == ''){
      wx.showToast({
        title: '请选择经营类别',
        image: '../../../image/fail.png'
      })
      return false;
    }
    request_data.category_id = category_id;
    request_data.category_child_id = category_child_id;
    // console.log(request_data); return
    // 检查参数
    var userToken = this.data.userToken
    wx.request({
      url: url,
      data: request_data,
      header: {
        'content-type': 'application/json',
        'userToken': userToken
        // 'userToken':'1376961ed2a0ef59c13a06a718399805'
      },
      method: 'POST',
      success: function (res) {
        // 成功之后保存用户开店情况(看后续情况返回)
        console.log(res,res.data);
        if(res.data.state == 1){
          var userInfo = {}
          userInfo.user_info = res.data.data.user_info
          userInfo.token = userToken
          wx.setStorage({
            key: 'userInfo',
            data: userInfo
          })
          if(editState){
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.reLaunch({
              url: "../../shops/create/create",
            })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            image: '../../../image/fail.png'
          })
          return false;
        }
      },
      fail: function (res){
        wx.showToast({
          title: '提交失败',
          image: '../../../image/fail.png'
        })
        return false;
      }
    })
  },

  checkPhoneCode:function(code) {
    if (code.length != 6){
      wx.showToast({
        title: '验证码错误',
        image: '../../../image/fail.png'
      })
    }
  },
  checkAddress:function(region,town){
    if(region[0] == '' || region[1] == '' || region[2] == ''){
      wx.showToast({
        title: '请填写地区信息',
        image: '../../../image/fail.png'
      })
      return false
    }
  }
})