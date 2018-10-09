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
        classify_id: 0,
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
            url: app.globalData.apiUrl + 'api/v1/article/queryArticle',
            method: 'GET',
            header: {
                'userToken': obj.data.token
            },
            data: {
                order: titleType,
                classify_id: obj.data.classify_id,
                keyword: obj.data.inputVal,
            },
            success: function (queryArticleRes) {
                if (queryArticleRes.data.state == 1) {
                    // var items = queryArticleRes.data.data;
                    // for (var i = 0; i < items.length; i++) {
                    //     WxParse.wxParse('format_text', 'html', items[i]['content']['text'], obj, 5);
                    //     items[i]['content']['format_text'] = obj.data.format_text;
                    // }
                    // queryArticleRes.data.data = items;
                    obj.setData({
                        articleList: queryArticleRes.data.data,
                    });
                } else {
                    console.log(queryArticleRes);
                }
            }
        });
    },
    classifyChange: function (event) {
        var classifyId = event.currentTarget.dataset.classifyId;
        var obj = this;
        console.log(classifyId);
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/article/queryArticle',
            method: 'GET',
            header: {
                'userToken': obj.data.token
            },
            data: {
                order: obj.data.titleType,
                classify_id: classifyId,
                keyword: obj.data.inputVal,
            },
            success: function (queryArticleRes) {
                if (queryArticleRes.data.state == 1) {
                    // var items = queryArticleRes.data.data;
                    // for (var i = 0; i < items.length; i++) {
                    //     WxParse.wxParse('format_text', 'html', items[i]['content']['text'], obj, 5);
                    //     items[i]['content']['format_text'] = obj.data.format_text;
                    // }
                    // queryArticleRes.data.data = items;
                    obj.setData({
                        articleList: queryArticleRes.data.data,
                        classify_id: classifyId
                    });
                } else {
                    console.log(queryArticleRes);
                }
            }
        });
    },
    onShow: function(options) {
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
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
                    url: app.globalData.apiUrl + 'api/v1/article/queryArticle',
                    method: 'GET',
                    header: {
                        'userToken': userToken
                    },
                    success: function (queryArticleRes) {
                        if (queryArticleRes.data.state == 1) {
                            // var items = queryArticleRes.data.data;
                            // for (var i = 0; i < items.length; i++) {
                            //     WxParse.wxParse('format_text', 'html', items[i]['content']['text'], obj, 5);
                            //     items[i]['content']['format_text'] = obj.data.format_text;
                            // }
                            // queryArticleRes.data.data = items;
                            obj.setData({
                                articleList: queryArticleRes.data.data,
                            });
                        } else {
                            console.log(queryArticleRes);
                        }
                    }
                });
            },
        })
    },
    searchArticle: function (event) {
        var obj = this;
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/article/queryArticle',
            method: 'GET',
            header: {
                'userToken': obj.data.token
            },
            data: {
                order: obj.data.titleType,
                classify_id: obj.data.classify_id,
                keyword: obj.data.inputVal,
            },
            success: function (queryArticleRes) {
                if (queryArticleRes.data.state == 1) {
                    // var items = queryArticleRes.data.data;
                    // for (var i = 0; i < items.length; i++) {
                    //     WxParse.wxParse('format_text', 'html', items[i]['content']['text'], obj, 5);
                    //     items[i]['content']['format_text'] = obj.data.format_text;
                    // }
                    // queryArticleRes.data.data = items;
                    obj.setData({
                        articleList: queryArticleRes.data.data,
                    });
                } else {
                    console.log(queryArticleRes);
                }
            }
        });
    }
});