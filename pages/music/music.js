//index.js
//获取应用实例
const app = getApp();
var _music = '';
Page({
    data: {
        musicArr: [],
    },
    onLoad: function(options) {
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.apiUrl + 'api/v1/music/recommend/1/20',
                    method: 'GET',
                    header: {
                        'userToken': res.data.token
                    },
                    success: function (recommendRes) {
                        console.log(recommendRes);
                        if (recommendRes.data.state == 1) {
                            obj.setData({
                                musicArr: recommendRes.data.data.song_list,
                                token: res.data.token
                            });
                        } else {
                            console.log(recommendRes);
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
        if (_music != '') {
            _music.destroy();
        }
        _music = wx.createInnerAudioContext();
        _music.autoplay = true;
        _music.loop = true;
        _music.src = event.currentTarget.dataset.voiceResource
        _music.onPlay(() => {
            console.log('开始播放');
        })
        _music.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
});