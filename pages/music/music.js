//index.js
//获取应用实例
const app = getApp();
var _music = '';
Page({
    data: {
        musicArr: [],
        selected_id: 0,
        loadingHidden: true
    },
    onLoad: function(options) {
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.apiUrl + 'api/v1/music/getCategoryList',
                    method: 'GET',
                    header: {
                        'userToken': res.data.token
                    },
                    success: function (getCategoryListRes) {
                        console.log(getCategoryListRes);
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
    playVoice: function (event) {
        var obj = this;
        var musicId = event.currentTarget.dataset.musicId;
        var musicLink = event.currentTarget.dataset.musicLink;
        this.setData({
            loadingHidden: false
        });
        obj.setData({
            selected_music_id: musicId,
            musicLink: musicLink
        });
        if (_music != '') {
            _music.destroy();
        }
        console.log(musicLink);
        _music = wx.createInnerAudioContext();
        _music.autoplay = true;
        _music.loop = true;
        _music.src = musicLink;
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
    },
    openCategory: function (event) {
        var obj = this;
        var categoryId = event.currentTarget.dataset.categoryId;
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/music/getByCategory',
            method: 'GET',
            header: {
                'userToken': obj.data.token
            },
            data:{
                page: 1,
                row: 20,
                category_id: categoryId
            },
            success: function (getByCategoryRes) {
                console.log(getByCategoryRes);
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
    saveMusic: function (event) {
        var music
    }
});