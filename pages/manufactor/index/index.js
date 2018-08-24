//index.js
//获取应用实例
const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    data: {
        type: 1,
        nodeType: 1,
        productNodeType: 1,
        aboutNodeType: 1,
        introduction_hidden: true,
        img_url: app.globalData.img_url,
        music_url: app.globalData.music_url,
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
        switch (event.currentTarget.dataset.type) {
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
        if (event.currentTarget.dataset.voiceResource != '') {
            if (app.globalData._music != '') {
                app.globalData._music.destroy();
            }
            app.globalData._music = wx.createInnerAudioContext();
            app.globalData._music.autoplay = true;
            app.globalData._music.loop = true;
            app.globalData._music.src = event.currentTarget.dataset.voiceResource
            app.globalData._music.onPlay(() => {
                console.log('开始播放');
            })
            app.globalData._music.onError((res) => {
                console.log(res.errMsg)
                console.log(res.errCode)
            })
        }
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
                if (res.data.state == 1) {
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
                                    var items = factoryRes.data.data.homeContent.items;
                                    if (items.length > 0) {
                                        for (var i = 0; i < items.length; i++) {
                                            WxParse.wxParse('format_text', 'html', items[i]['text'], obj, 5);
                                            items[i]['format_text'] = obj.data.format_text;
                                        }
                                        factoryRes.data.data.homeContent.items = items;
                                    }
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


