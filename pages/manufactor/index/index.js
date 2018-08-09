//index.js
//获取应用实例
const app = getApp()

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
        this.setData({
            type: event.currentTarget.dataset.type
        });
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
    playVoice: function (e) {
        
    },
    confirm: function (e) {
        var _obj = this;
        wx.showLoading({
            mask: true,
            title: '努力加载中...',
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


