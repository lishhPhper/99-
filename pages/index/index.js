//获取应用实例
const app = getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isShowBtn: 1,
    },
    onLoad: function () {
        var obj = this;
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo'] === true) {
                    obj.setData({
                        isShowBtn: 0,
                    });
                    wx.login({
                        success: function (loginRes) {
                            if (loginRes.code) {
                                wx.request({
                                    url: app.globalData.apiUrl + 'api/v1/getToken',
                                    method: 'GET',
                                    data: {
                                        code: loginRes.code,
                                    },
                                    success: function (getTokenRes) {
                                        if (getTokenRes.data.state == 1) {
                                            var userObj = getTokenRes.data.data;
                                            wx.setStorage({
                                                key: 'userInfo',
                                                data: userObj
                                            })
                                            wx.reLaunch({
                                                url: "/pages/shops/nearby/nearby",
                                            })
                                        } else {
                                            _alert({ title: '登录失败', content: '服务器异常，请稍后再试' });
                                        }
                                    }
                                })
                            } else {
                                _alert({ title: '登录失败', content: '服务器异常，请稍后再试' });
                            }
                        }
                    });
                } else {
                    obj.setData({
                        isShowBtn: 1,
                    });
                }
            }
        })
        
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var lat = res.latitude
            var lng = res.longitude
            app.globalData.lat = lat
            app.globalData.lng = lng
            wx.request({
              url: app.globalData.apiUrl + 'api/v1/address/'+ lat+'/'+lng,
              success: function (address) {
                if(address.data.state == 1){
                  app.globalData.province = address.data.data.address.province
                  app.globalData.city = address.data.data.address.city
                  app.globalData.district = address.data.data.address.district
                  app.globalData.address = address.data.data.address.address
                }
              }
            })
          }
        })
    },
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo === undefined) {
            _alert({ title: '授权提醒', content: '未授权无法进入小程序'});
        } else {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.request({
                            url: app.globalData.apiUrl + 'api/v1/getToken',
                            method: 'GET',
                            data: {
                                code: res.code,
                            },
                            success: function (res) {
                                if (res.data.state == 1) {
                                    var obj = res.data.data;
                                    wx.setStorage({
                                        key: 'userInfo',
                                        data: obj
                                    })
                                    wx.reLaunch({
                                        url: "/pages/shops/nearby/nearby",
                                    })
                                } else {
                                    _alert({ title: '登录失败', content: '服务器异常，请稍后再试' });
                                }
                            }
                        })
                    } else {
                        _alert({ title: '登录失败', content: '服务器异常，请稍后再试' });
                    }
                }
            });
        }
    }
});

function _alert(param) {
    var alertParam = {
        'title': param.title,
        'content': param.content,
        'showCancel': false,
        'canelColor': '#666',
        'confirmText': '确认',
        'confirmColor': '#666',
    }

    wx.showModal(alertParam)
}


