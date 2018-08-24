//获取应用实例
const app = getApp()

Page({
    data: {
        img_url: app.globalData.img_url,
        inputShowed: false,
        inputVal: "",
        toView: 'red',
        scrollTop: 100,
        array: [{},
            {},
            {},
            {},
            {},
            {},
        ],
    },
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function() {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    upper: function(e) {
        console.log(e)
    },
    lower: function(e) {
        console.log(e)
    },
    scroll: function(e) {
        console.log(e)
    },
    tap: function(e) {
        for (var i = 0; i < order.length; ++i) {
            if (order[i] === this.data.toView) {
                this.setData({
                    toView: order[i + 1]
                })
                break
            }
        }
    },
    tapMove: function(e) {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    },
    onLoad: function(options) {
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                var userToken = res.data.token;
                var user_info = res.data.user_info;
                wx.request({
                    url: app.globalData.apiUrl + 'api/v1/article/classify',
                    method: 'GET',
                    header: {
                        'userToken': userToken
                    },
                    success: function(classifyRes) {
                        if (classifyRes.data.state == 1) {
                            obj.setData({
                                userInfo: res.data.user_info,
                                token: res.data.token,
                                classifyArr: classifyRes.data.data,
                            });
                        } else {
                            console.log(classifyRes);
                        }
                    }
                });
            },
        })
    }
});