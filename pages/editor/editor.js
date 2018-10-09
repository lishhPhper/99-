//获取应用实例
const app = getApp()

Page({
    data: {
        userType: 2,
        request_url: app.globalData.apiUrl,
        articleId: '',
    },
    onShow: function () {
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
    },
    onLoad: function(options) {
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                obj.setData({
                    token: res.data.token,
                    itemKey: options.itemKey,
                    editorType: options.editorType,
                })
                if (options.articleId != undefined || options.articleId != ''){
                    obj.setData({
                        articleId: options.articleId,
                    })
                }
            },
        })
    },
});