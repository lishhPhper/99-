//index.js
//获取应用实例
const app = getApp()

var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    toView: 'red',
    scrollTop: 100,
    status:2,
    userToken:'',
    address:'',
    wx:'',
    phone:'',
    shop_name:'',
    shop_img:'',
    defaultImg:'../../../image/jiaju01.jpg'
  },

  onLoad:function() {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userToken = res.data.token
        that.setData({
          userToken
        });
        wx.request({
          url: app.globalData.apiUrl + 'api/v1/shop/info',
          header: {
            'content-type': 'application/json',
            'userToken': userToken
          },
          method: 'Get',
          success: function (res) {
            if(res.statusCode == 200){
              var address = '';
              var wx = '';
              var shop_wx = res.data.shop_wx;
              var wx_code = res.data.wx_code;
              if (res.data.province == res.data.city){
                address = res.data.province + res.data.district + res.data.town + res.data.address;
              }else{
                address = res.data.province + res.data.city + res.data.district + res.data.town + res.data.address;
              }
              if (shop_wx == '' && wx_code != ''){
                wx = wx_code;
              }else{
                wx = shop_wx;
              }
              var shop_name = res.data.shop_name;
              var shop_img = app.globalData.apiUrl + res.data.shop_img;

              console.log(address);
              that.setData({
                address,
                wx,
                shop_name,
                shop_img
              })
            }
          }
        })
      }
    })
    console.log(that.data.userToken);
    
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  entityStore:function (e) {
    this.setData({

    })
  },
  imgError:function (e){
    var that = this;
    that.setData({
      shop_img:that.data.defaultImg
    })
  }
});


