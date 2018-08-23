//index.js
//获取应用实例
const app = getApp();
var _music = '';
Page({
    data: {
        musicArr: [],
        selected_id: 0,
        loadingHidden: true,
        music_url: app.globalData.apiUrl,
        default_hidden : false,
        searchMusicArr: false
    },
    onLoad: function(options) {
        var obj = this;
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
            if (_music != '') {
                _music.destroy();
            }
            _music = wx.createInnerAudioContext();
            _music.autoplay = true;
            _music.loop = true;
            _music.src = obj.data.music_url + musicLink;
            _music.onPlay(() => {
                console.log('开始播放');
                obj.setData({
                    loadingHidden: true
                });
                obj.update();
            })
            _music.onError((res) => {
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
        var musicLink = this.data.musicLink;
        var musicName = this.data.musicName;
        var userToken = this.data.token;
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/homeContent/setCache',
            method: 'GET',
            header: {
                'userToken': userToken
            },
            data: {
                music: musicLink,
                music_name: musicName
            },
            success: function(setCacheRes) {
                if (setCacheRes.data.state == 1) {
                    console.log('保存成功');
                    if (_music != '') {
                        _music.destroy();
                    }
                    wx.navigateTo({
                        url: '/pages/manufactor/editor/editor?type=2',
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
        if (keyword == ''){
            obj.setData({
                default_hidden: false
            });
        }else{
            wx.request({
                url: app.globalData.apiUrl + 'api/v1/music/query',
                method: 'GET',
                header: {
                    'userToken': userToken
                },
                data: {
                    keyword: keyword,
                },
                success: function (queryRes) {
                    if (queryRes.data.state == 1) {
                        if (queryRes.data.data.length == 0){
                            obj.setData({
                                searchMusicArr: false,
                                default_hidden: true
                            });
                        }else{
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