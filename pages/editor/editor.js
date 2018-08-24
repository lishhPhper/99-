//获取应用实例
const app = getApp()

Page({
    data: {
        userType: 2,
        request_url: app.globalData.apiUrl,
    },
    onLoad: function(options) {
        console.log(options);
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                obj.setData({
                    token: res.data.token,
                    itemKey: options.itemKey,
                    editorType: options.editorType,
                })
            },
        })
    },
});