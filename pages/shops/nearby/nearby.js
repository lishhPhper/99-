//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        address: '',
        inputShowed: false,
        inputVal: "",
        toView: 'red',
        scrollTop: 100,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userToken: '',
        storeArr: [],
        img_url: '',
        lat: '',
        lng: '',
    },
    onShow: function (options) {
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
    },
    onLoad: function(options) {
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
        var that = this;
        var addressInfo = wx.getStorageSync('address')
        var address = addressInfo.address
        var userInfo = wx.getStorageSync('userInfo')
        var userToken = userInfo.token;
        var img_url = app.globalData.apiUrl;
        var lat = addressInfo.lat;
        var lng = addressInfo.lng;
        that.setData({
            address,
            userToken,
            img_url,
            lat,
            lng
        })

        wx.request({
            url: app.globalData.apiUrl + 'api/v1/site/nearbyStore/' + lat + '/' + lng,
            header: {
                'content-type': 'application/json',
                'userToken': userToken
            },
            method: 'Get',
            success: function(res) {
                if (res.data.state == 1) {
                    var storeArr = res.data.data
                    console.log(res.data)
                    that.setData({
                        storeArr
                    })
                }
            }
        })
    },
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function() {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    upper: function(e) {
        console.log(e)
    },
    lower: function(e) {
        console.log(e)
    },
    scroll: function(e) {
        console.log(e)
    },
    tap: function(e) {
        for (var i = 0; i < order.length; ++i) {
            if (order[i] === this.data.toView) {
                this.setData({
                    toView: order[i + 1]
                })
                break
            }
        }
    },
    tapMove: function(e) {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    },
    onPullDownRefresh: function () {
      wx.showNavigationBarLoading();
      var that = this;
      var userToken = that.data.userToken
      var lat = that.data.lat
      var lng = that.data.lng
      wx.request({
        url: app.globalData.apiUrl + 'api/v1/site/nearbyStore/' + lat + '/' + lng + '/2',
        header: {
          'content-type': 'application/json',
          'userToken': userToken
        },
        data: {
          'w': that.data.inputVal
        },
        method: 'Get',
        success: function (res) {
          if (res.data.state == 1) {
            var storeArr = res.data.data
            that.setData({
              storeArr
            })
          }
        },
        complete: function () {
          wx.hideNavigationBarLoading();                   //完成停止加载
          wx.stopPullDownRefresh();                       //停止下拉刷新
        }
      })
    },

    getNearbyStore: function(e) {
        var that = this;
        var userToken = that.data.userToken
        var lat = that.data.lat
        var lng = that.data.lng
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/site/nearbyStore/' + lat + '/' + lng + '/2',
            header: {
                'content-type': 'application/json',
                'userToken': userToken
            },
            data: {
                'w': that.data.inputVal
            },
            method: 'Get',
            success: function(res) {
                if (res.data.state == 1) {
                    var storeArr = res.data.data
                    that.setData({
                        storeArr
                    })
                }
            }
        })
    }
});