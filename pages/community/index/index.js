//获取应用实例
const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    data: {
        img_url: app.globalData.img_url,
        inputShowed: false,
        inputVal: "",
        toView: 'red',
        scrollTop: 100,
        articleList: [],
        titleType:0,
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
    titleChange: function (event) {
        var titleType = event.currentTarget.dataset.titleType;
        var obj = this;
        this.setData({
            titleType: titleType
        })
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/article/localList',
            method: 'GET',
            header: {
                'userToken': obj.data.token
            },
            data: {
                order: titleType
            },
            success: function (localListRes) {
                if (localListRes.data.state == 1) {
                    var items = localListRes.data.data;
                    for (var i = 0; i < items.length; i++) {
                        WxParse.wxParse('format_text', 'html', items[i]['content']['text'], obj, 5);
                        items[i]['content']['format_text'] = obj.data.format_text;
                    }
                    localListRes.data.data = items;
                    obj.setData({
                        articleList: localListRes.data.data,
                    });
                } else {
                    console.log(localListRes);
                }
            }
        });
    },
    classifyChange: function (event) {
        var classifyId = event.currentTarget.dataset.classifyId;
        var obj = this;
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/article/listByClassify',
            method: 'GET',
            header: {
                'userToken': obj.data.token
            },
            data: {
                order: obj.data.titleType,
                classify_id: classifyId
            },
            success: function (listByClassifyRes) {
                if (listByClassifyRes.data.state == 1) {
                    var items = listByClassifyRes.data.data;
                    for (var i = 0; i < items.length; i++) {
                        WxParse.wxParse('format_text', 'html', items[i]['content']['text'], obj, 5);
                        items[i]['content']['format_text'] = obj.data.format_text;
                    }
                    listByClassifyRes.data.data = items;
                    obj.setData({
                        articleList: listByClassifyRes.data.data,
                        classifyId: classifyId
                    });
                } else {
                    console.log(listByClassifyRes);
                }
            }
        });
    },
    onLoad: function(options) {
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                var userToken = res.data.token;
                var user_info = res.data.user_info;
                obj.setData({
                    userInfo: res.data.user_info,
                    token: res.data.token,
                });
                wx.request({
                    url: app.globalData.apiUrl + 'api/v1/article/classify',
                    method: 'GET',
                    header: {
                        'userToken': userToken
                    },
                    success: function(classifyRes) {
                        if (classifyRes.data.state == 1) {
                            obj.setData({
                                classifyArr: classifyRes.data.data,
                            });
                        } else {
                            console.log(classifyRes);
                        }
                    }
                });
                wx.request({
                    url: app.globalData.apiUrl + 'api/v1/article/localList',
                    method: 'GET',
                    header: {
                        'userToken': userToken
                    },
                    data:{
                        order:0
                    },
                    success: function (localListRes) {
                        if (localListRes.data.state == 1) {
                            var items = localListRes.data.data;
                            for (var i = 0; i < items.length; i++) {
                                WxParse.wxParse('format_text', 'html', items[i]['content']['text'], obj, 5);
                                items[i]['content']['format_text'] = obj.data.format_text;
                            }
                            localListRes.data.data = items;
                            obj.setData({
                                articleList: localListRes.data.data,
                            });
                        } else {
                            console.log(localListRes);
                        }
                    }
                });
            },
        })
    }
});