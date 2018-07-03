//获取应用实例
const app = getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isShowBtn: 1,
    },
    onLoad: function () {
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                obj.setData({
                    isShowBtn: 0,
                });
                wx.reLaunch({
                    url: "/pages/shops/nearby/nearby",
                })
            },
        })

    },
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo === undefined) {
            _alert({ title: '授权提醒', content: '未授权无法进入小程序'});
        } else {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: app.globalData.apiUrl + 'api/v1/getOpenid',
                            data: {
                                code: res.code
                            },
                            success: function (loginRes) {
                                if (loginRes.data.state == 1) {
                                    var _getUserInfoParam = {
                                        openid: loginRes.data.data.openid,
                                        avatarUrl: e.detail.userInfo.avatarUrl,
                                        nickName: e.detail.userInfo.nickName,
                                    };
                                    _getUserInfo(_getUserInfoParam, function (_getUserInfoRes) {
                                        if (_getUserInfoRes.error_code == 0) {
                                            var obj = _getUserInfoRes.data;
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
                                    });
                                }
                            },
                            fail: function () {
                                _alert({ title: '登录失败', content: '服务器异常，请稍后再试' });
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

function _getUserInfo(param,_callback){
    wx.request({
        url: app.globalData.apiUrl + 'api/v1/user',
        method: 'POST',
        data: {
            wx_openid: param.openid,
            avatar: param.avatarUrl,
            user_name: param.nickName,
        },
        success: function (res) {
            if(res.data.state == 1){
                app.globalData.successReturn.data = res.data.data;
                _callback(app.globalData.successReturn);
            }else{
                _callback(app.globalData.failReturn);
            }
        }
    })
}

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


