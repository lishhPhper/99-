//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        inputShowed: false,
        inputVal: "",
        toView: 'red',
        scrollTop: 100,
        type: 3,
        nodeType: 1,
        productNodeType:1,
        aboutNodeType: 1,
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
    onLoad: function (options){
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                obj.setData({
                    userInfo: res.data.user_info,
                    token: res.data.token,
                    type: options.type,
                    aboutNodeType: options.aboutNodeType,
                });
                wx.setNavigationBarTitle({
                    title: res.data.user_info.user_name
                })
            },
        })
        
    }
});


