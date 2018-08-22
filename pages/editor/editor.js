//获取应用实例
const app = getApp()

Page({
    data: {
        userType: 2,
    },
    onLoad: function(options) {
        console.log(options);
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                obj.setData({
                    token: res.data.token,
                    itemKey: options.itemKey,
                })
            },
        })
    },
});