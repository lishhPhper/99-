//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
      address:'',
      inputShowed: false,
      inputVal: "",
      toView: 'red',
      scrollTop: 100,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      userToken:'',
      storeArr:[],
      img_url:''
    },
    onLoad: function (options) {
      var that = this;
      var addressInfo = wx.getStorageSync('address')
      var address = addressInfo.address
      var userInfo = wx.getStorageSync('userInfo')
      var userToken = userInfo.token;
      var img_url = app.globalData.apiUrl;
      that.setData({
        address,
        userToken,
        img_url
      })
      var lat = addressInfo.lat;
      var lng = addressInfo.lng;
      wx.request({
        url: app.globalData.apiUrl + 'api/v1/site/nearbyStore/' + lat + '/' + lng +'/2',
        header: {
          'content-type': 'application/json',
          'userToken': userToken
        },
        method: 'Get',
        success: function (res) {
          if(res.data.state == 1){
            var storeArr = res.data.data
            console.log(res.data)
            that.setData({
              storeArr
            })
          }
        }
      })
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
    
});


