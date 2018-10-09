//index.js
//获取应用实例
const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    data: {
        img_url: app.globalData.img_url,
        music_url: app.globalData.music_url,
    },
    onLoad: function(options) {
        var obj = this;
        var articleId = options.articleId;
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                var userToken = res.data.token;
                var user_info = res.data.user_info;
                obj.setData({
                    userInfo: res.data.user_info,
                    token: res.data.token,
                    articleId: articleId,
                });
                wx.request({
                    url: app.globalData.apiUrl + 'api/v1/article/details',
                    method: 'GET',
                    header: {
                        'userToken': userToken
                    },
                    data:{
                        id: articleId,
                    },
                    success: function (detailsRes) {
                        console.log(detailsRes);
                        if (detailsRes.data.state == 1) {
                            var items = detailsRes.data.data.content;
                            for (var i = 0; i < items.length; i++) {
                                WxParse.wxParse('format_text', 'html', items[i]['text'], obj, 5);
                                items[i]['format_text'] = obj.data.format_text;
                            }
                            detailsRes.data.data.content = items;
                            obj.setData({
                                detailsRes: detailsRes.data.data,
                            });

                            if (app.globalData._music != '') {
                                app.globalData._music.destroy();
                            }
                            app.globalData._music = wx.createInnerAudioContext();
                            app.globalData._music.autoplay = true;
                            app.globalData._music.loop = true;
                            app.globalData._music.src = obj.data.music_url + detailsRes.data.data.music;
                            app.globalData._music.onPlay(() => {
                                console.log('开始播放');
                            })
                            app.globalData._music.onError((res) => {
                                console.log(res.errMsg)
                                console.log(res.errCode)
                            })

                        } else {
                            console.log(detailsRes);
                        }
                    }
                });
            },
        })
    }
});