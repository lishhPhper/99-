//获取应用实例
const app = getApp()

Page({
    data: {
        userType: 2,
    },
    onShow: function() {
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                obj.setData({
                    token: res.data.token,
                })
            },
        })
    },
});