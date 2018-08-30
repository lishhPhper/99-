//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        musicArr: [],
        selected_id: 0,
        loadingHidden: true,
        default_hidden: false,
        searchMusicArr: false,
        music_url: app.globalData.music_url
    },
    onLoad: function(options) {
        var obj = this;
        // 1：首页图文编辑 2：同城圈图文编辑
        if (options.saveType == 1) {
            var saveUrl = 'api/v1/homeContent/setCache';
            var navigateUrl = '/pages/manufactor/editor/editor?type=2';
        } else {
            var saveUrl = 'api/v1/article/setCache';
            var navigateUrl = '/pages/community/editor/editor?type=2';
        }
        if (options.articleId == undefined) {
            options.articleId = '';
        }
        obj.setData({
            articleId: options.articleId,
            saveType: options.saveType,
            saveUrl: saveUrl,
            navigateUrl: navigateUrl,
        });
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                wx.request({
                    url: app.globalData.apiUrl + 'api/v1/music/getCategoryList',
                    method: 'GET',
                    header: {
                        'userToken': res.data.token
                    },
                    success: function(getCategoryListRes) {
                        if (getCategoryListRes.data.state == 1) {
                            obj.setData({
                                categoryArr: getCategoryListRes.data.data,
                                token: res.data.token
                            });
                        } else {
                            console.log(getCategoryListRes);
                        }
                    }
                });
            }
        })
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
    playVoice: function(event) {
        var obj = this;
        var musicId = event.currentTarget.dataset.musicId;
        var musicLink = event.currentTarget.dataset.musicLink;
        var musicName = event.currentTarget.dataset.musicName;
        obj.setData({
            selected_music_id: musicId,
            musicLink: musicLink,
            musicName: musicName
        });
        if (musicId != 0) {
            obj.setData({
                loadingHidden: false
            });
            if (app.globalData._music != '') {
                app.globalData._music.destroy();
            }
            app.globalData._music = wx.createInnerAudioContext();
            app.globalData._music.autoplay = true;
            app.globalData._music.loop = true;
            app.globalData._music.src = obj.data.music_url + musicLink;
            app.globalData._music.onPlay(() => {
                console.log('开始播放');
                obj.setData({
                    loadingHidden: true
                });
                obj.update();
            })
            app.globalData._music.onError((res) => {
                console.log(res.errMsg)
                console.log(res.errCode)
            })
        }
    },
    openCategory: function(event) {
        var obj = this;
        var categoryId = event.currentTarget.dataset.categoryId;
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/music/getByCategory',
            method: 'GET',
            header: {
                'userToken': obj.data.token
            },
            data: {
                page: 1,
                row: 20,
                category_id: categoryId
            },
            success: function(getByCategoryRes) {
                if (getByCategoryRes.data.state == 1) {
                    obj.setData({
                        selected_category_id: categoryId,
                        musicArr: getByCategoryRes.data.data
                    });
                } else {
                    console.log(recommendRes);
                }
            }
        });
    },
    saveMusic: function(event) {
        var obj = this;
        var musicLink = obj.data.musicLink;
        var musicName = obj.data.musicName;
        var userToken = obj.data.token;
        var saveType = obj.data.saveType;
        switch (saveType) {
            case '1':
                var requestData = {
                    music: musicLink,
                    musicName: musicName,
                };
                break;
            case '2':
                var requestData = {
                    music: musicLink,
                    musicName: musicName,
                    articleId: obj.data.articleId
                };
                break;
        }
        wx.request({
            url: app.globalData.apiUrl + obj.data.saveUrl,
            method: 'GET',
            header: {
                'userToken': userToken
            },
            data: requestData,
            success: function(setCacheRes) {
                if (setCacheRes.data.state == 1) {
                    console.log('保存成功');
                    if (app.globalData._music != '') {
                        app.globalData._music.destroy();
                    }
                    wx.navigateTo({
                        url: obj.data.navigateUrl,
                    })
                } else {
                    console.log(setCacheRes);
                }
            }
        });
    },
    searchMusic: function(event) {
        var obj = this;
        var keyword = obj.data.inputVal;
        var userToken = obj.data.token;
        if (keyword == '') {
            obj.setData({
                default_hidden: false
            });
        } else {
            wx.request({
                url: app.globalData.apiUrl + 'api/v1/music/query',
                method: 'GET',
                header: {
                    'userToken': userToken
                },
                data: {
                    keyword: keyword,
                },
                success: function(queryRes) {
                    if (queryRes.data.state == 1) {
                        if (queryRes.data.data.length == 0) {
                            obj.setData({
                                searchMusicArr: false,
                                default_hidden: true
                            });
                        } else {
                            obj.setData({
                                searchMusicArr: queryRes.data.data,
                                default_hidden: true
                            });
                        }
                    } else {
                        console.log(queryRes);
                    }
                }
            });
        }
    }
});