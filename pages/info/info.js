//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');


Page({
    data: {
        userInfo: {},
        img_url: app.globalData.img_url,
    },
    onShow: function () {
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
    },
    onLoad: function() {
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
        var obj = this;
        var userInfo = wx.getStorageSync('userInfo')
        obj.setData({
            userInfo: userInfo.user_info,
            token: userInfo.token,
        })
    }
});