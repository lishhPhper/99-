//index.js
//获取应用实例
const app = getApp();
var _music = '';

// ,
// audioOpen: function (param) {
//     if (_music != '') {
//         _music.pause()
//     }
//     _music = wx.createInnerAudioContext();
//     _music.obeyMuteSwitch = false;
//     _music.autoplay = true;
//     _music.loop = true;
//     if (param.uri != '') {
//         _music.src = param.uri
//     }
//     if (_music_on_off == 'on') {
//         _music.play()
//     }
//     wx.onShow(function () {
//         if (_music_on_off == 'on') {
//             _music.play()
//         }
//     });
//     wx.onAudioInterruptionEnd(function () {
//         if (_music_on_off == 'on') {
//             _music.play()
//         }
//     })
// },
// onOffMusic: function (param, _callback) {
//     if (param.type == 'off' && _music_on_off == 'on') {
//         _music.stop();
//         _music_on_off = 'off';
//         console.log('stop music.....');
//         _callback(trueReturn)
//     } else if (param.type == 'on' && _music_on_off == 'off') {
//         _music.play();
//         _music_on_off = 'on';
//         console.log('play Music.....');
//         _callback(trueReturn)
//     }
// },
Page({
    data: {
        //type: 3,
        nodeType: 1,
        productNodeType: 1,
        //aboutNodeType: 1,
        introduction_hidden: true,
        array: [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
        ]
    },
    titleChange: function (event) {
        var _obj = this;
        _obj.setData({
            type: event.currentTarget.dataset.type
        });
        switch (event.currentTarget.dataset.type){
            case 1:
                wx.request({
                    url: app.globalData.apiUrl + 'api/v1/factory/factoryProduct',
                    method: 'GET',
                    data: {
                        factoryId: _obj.data.storeInfo.id,
                    },
                    header: {
                        'userToken': _obj.data.token
                    },
                    success: function (res) {
                        console.log(res);
                        if (res.data.state == 1) {
                            wx.hideLoading();
                            _obj.setData({
                                productList: res.data.data
                            });
                        }
                    }
                })
                break;
        }
    },
    productNodeChange: function (event) {
        this.setData({
            productNodeType: event.currentTarget.dataset.productNodeType
        });
    },
    aboutNodeChange: function (event) {
        this.setData({
            aboutNodeType: event.currentTarget.dataset.aboutNodeType
        });
    },
    desChange: function (event) {
        this.setData({
            introduction_hidden: false
        });
    },
    bindinput: function (e) {
        this.setData({
            introduction: e.detail.value
        });
    },
    playVoice: function (event) {
        if(_music != ''){
            _music.destroy();
        }
        _music = wx.createInnerAudioContext();
        _music.autoplay = true;
        _music.loop = true;
        _music.src = event.currentTarget.dataset.voiceResource
        _music.onPlay(() => {
            console.log('开始播放');
        })
        _music.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    confirm: function (e) {
        var _obj = this;
        wx.showLoading({
            mask: true,
            title: '努力修改中...',
        });
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/factory/editFactoryInfo',
            method: 'POST',
            data: {
                introduction: _obj.data.introduction,
            },
            header: {
                'userToken': _obj.data.token
            },
            success: function (res) {
                if(res.data.state == 1){
                    wx.hideLoading();
                    _obj.setData({
                        introduction_hidden: true,
                        storeInfo: res.data.data
                    });
                }
            }
        })
    },
    onLoad: function (options) {
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                var userToken = res.data.token;
                var user_info = res.data.user_info;
                switch (user_info.type) {
                    // 厂家
                    case 1:
                        wx.request({
                            url: app.globalData.apiUrl + 'api/v1/factory/getFactoryInfo',
                            method: 'GET',
                            header: {
                                'content-type': 'multipart/form-data',
                                'userToken': userToken
                            },
                            success: function (factoryRes) {
                                if (factoryRes.data.state == 1) {
                                    obj.setData({
                                        userInfo: res.data.user_info,
                                        token: res.data.token,
                                        type: options.type,
                                        aboutNodeType: options.aboutNodeType,
                                        storeInfo: factoryRes.data.data,
                                    });
                                } else {
                                    console.log(factoryRes);
                                    //_alert({ title: '网络异常', content: '服务器异常，请稍后再试' });
                                }
                            }
                        });
                        break;
                    // 商家
                    case 2:

                        break;
                }

                wx.setNavigationBarTitle({
                    title: res.data.user_info.user_name
                })
            },
        })
    }
});


