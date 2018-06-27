//获取应用实例
const app = getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {

    },
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo === undefined) {
            var alertParam = {
                'title': '授权提醒',
                'content': '未授权无法进入小程序',
                'showCancel': false,
                'canelColor': '#666',
                'confirmText': '确认',
                'confirmColor': '#666',
            }

            wx.showModal(alertParam)
        } else {
            wx.checkSession({
                success: function () {
                    //session_key 未过期，并且在本生命周期一直有效
                    console.log('session_key未过期');
                    // 获取服务器用户信息
                    
                },
                fail: function () {
                    // session_key 已经失效，需要重新执行登录流程
                    wx.login({
                        success: function (res) {
                            if (res.code) {
                                //发起网络请求
                                wx.request({
                                    url: app.globalData.apiUrl + '/api/v1/getOpenid',
                                    data: {
                                        code: res.code
                                    },
                                    success:function(loginRes){
                                        if(loginRes.data.state == 1){
                                            var _getUserInfoParam = {
                                                openid: loginRes.data.data.openid,
                                                avatarUrl: e.detail.userInfo.avatarUrl,
                                                nickName: e.detail.userInfo.nickName,
                                            };
                                            _getUserInfo(_getUserInfoParam, function (_getUserInfoRes){
                                                console.log(_getUserInfoRes);
                                            });
                                        }
                                    },
                                    fail:function(){
                                        console.log('登录失败，请重新登录');
                                    }
                                })
                            } else {
                                console.log('登录失败！' + res.errMsg);
                            }
                        }
                    });
                }
            })
        }
    }
});

function _getUserInfo(param,_callback){
    wx.request({
        url: app.globalData.apiUrl + '/api/v1/user',
        method: 'POST',
        data: {
            wx_openid: param.openid,
            avatar: param.avatarUrl,
            user_name: param.nickName,
        },
        success: function (res) {
            console.log(res);
            if(res.data.code == 1){
                _callback(res.data.data);
            }else{
                console.log('获取用户信息失败');
                // _callback({code: 1});
            }
        }
    })
}


